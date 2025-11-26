#!/bin/bash

# ============================================
# GARFENTER CLIENTES - One-Click Deployment
# ============================================
# Automated deployment script for Twenty CRM
# Configured for Guatemala operations
# ============================================

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Project paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.garfenter"
ENV_EXAMPLE="${SCRIPT_DIR}/.env.garfenter.example"
DOCKER_COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.garfenter.yml"

# ============================================
# Functions
# ============================================

print_banner() {
    echo -e "${CYAN}${BOLD}"
    echo "============================================"
    echo "   ____    _    ____  _____ _____ _   _ _____ _____ ____  "
    echo "  / ___|  / \\  |  _ \\|  ___| ____| \\ | |_   _| ____|  _ \\ "
    echo " | |  _  / _ \\ | |_) | |_  |  _| |  \\| | | | |  _| | |_) |"
    echo " | |_| |/ ___ \\|  _ <|  _| | |___| |\\  | | | | |___|  _ < "
    echo "  \\____/_/   \\_\\_| \\_\\_|   |_____|_| \\_| |_| |_____|_| \\_\\"
    echo ""
    echo "           CLIENTES - CRM System"
    echo "         Powered by Twenty CRM"
    echo "============================================"
    echo -e "${NC}"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_info "Checking system requirements..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    print_success "Docker is installed"

    # Check Docker Compose
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please update Docker to a version that includes Docker Compose V2"
        exit 1
    fi
    print_success "Docker Compose is installed"

    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker Desktop"
        exit 1
    fi
    print_success "Docker is running"

    echo ""
}

setup_environment() {
    print_info "Setting up environment..."

    if [ ! -f "$ENV_FILE" ]; then
        if [ -f "$ENV_EXAMPLE" ]; then
            print_warning ".env.garfenter not found. Creating from example..."
            cp "$ENV_EXAMPLE" "$ENV_FILE"
            print_success "Created .env.garfenter from example"
            echo ""
            print_warning "${BOLD}IMPORTANT SECURITY NOTICE:${NC}"
            print_warning "Please edit .env.garfenter and change the following:"
            print_warning "  1. PG_DATABASE_PASSWORD (database password)"
            print_warning "  2. APP_SECRET (application secret key)"
            print_warning "  3. SERVER_URL (if deploying to production)"
            echo ""
            print_info "Generate a secure APP_SECRET with:"
            echo -e "  ${CYAN}openssl rand -base64 32${NC}"
            echo ""

            read -p "Press Enter to continue with default values or Ctrl+C to exit and configure..."
        else
            print_error "Neither .env.garfenter nor .env.garfenter.example found!"
            exit 1
        fi
    else
        print_success "Environment file found"
    fi

    # Source the environment file
    set -a
    source "$ENV_FILE"
    set +a

    echo ""
}

check_ports() {
    print_info "Checking if required ports are available..."

    SERVER_PORT=${SERVER_PORT:-3000}
    PG_PORT=${PG_PORT:-5432}
    REDIS_PORT=${REDIS_PORT:-6379}

    check_port() {
        local port=$1
        local service=$2
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            print_warning "Port $port ($service) is already in use"
            return 1
        else
            print_success "Port $port ($service) is available"
            return 0
        fi
    }

    all_available=true
    check_port $SERVER_PORT "Server" || all_available=false
    check_port $PG_PORT "PostgreSQL" || all_available=false
    check_port $REDIS_PORT "Redis" || all_available=false

    if [ "$all_available" = false ]; then
        echo ""
        print_warning "Some ports are in use. You can:"
        print_warning "  1. Stop the services using those ports"
        print_warning "  2. Change the ports in .env.garfenter"
        print_warning "  3. Continue anyway (may cause conflicts)"
        echo ""
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Deployment cancelled"
            exit 0
        fi
    fi

    echo ""
}

pull_images() {
    print_info "Pulling Docker images (this may take a few minutes on first run)..."
    docker compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" pull
    print_success "Images pulled successfully"
    echo ""
}

start_services() {
    print_info "Starting Garfenter Clientes services..."
    echo ""

    docker compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" up -d

    echo ""
    print_success "Services started successfully!"
    echo ""
}

wait_for_services() {
    print_info "Waiting for services to be ready..."
    echo ""

    print_info "This may take 1-2 minutes for initial database setup..."

    max_attempts=60
    attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if docker compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" ps | grep -q "garfenter-clientes-server.*healthy"; then
            print_success "Server is ready!"
            return 0
        fi

        attempt=$((attempt + 1))
        echo -ne "${BLUE}[INFO]${NC} Waiting for services... ($attempt/$max_attempts)\r"
        sleep 5
    done

    echo ""
    print_warning "Services are taking longer than expected to start"
    print_info "You can check logs with: docker compose -f docker-compose.garfenter.yml logs -f"
    return 1
}

show_status() {
    echo ""
    echo -e "${CYAN}${BOLD}============================================${NC}"
    echo -e "${GREEN}${BOLD}   GARFENTER CLIENTES IS RUNNING!${NC}"
    echo -e "${CYAN}${BOLD}============================================${NC}"
    echo ""

    SERVER_URL=${SERVER_URL:-http://localhost:3000}

    echo -e "${BOLD}Access URLs:${NC}"
    echo -e "  ${GREEN}CRM Application:${NC} ${CYAN}${SERVER_URL}${NC}"
    echo ""

    echo -e "${BOLD}Database Connection:${NC}"
    echo -e "  Host: ${CYAN}localhost${NC}"
    echo -e "  Port: ${CYAN}${PG_PORT:-5432}${NC}"
    echo -e "  Database: ${CYAN}${PG_DATABASE_NAME:-garfenter_clientes}${NC}"
    echo -e "  User: ${CYAN}${PG_DATABASE_USER:-postgres}${NC}"
    echo ""

    echo -e "${BOLD}Useful Commands:${NC}"
    echo -e "  View logs:     ${CYAN}docker compose -f docker-compose.garfenter.yml logs -f${NC}"
    echo -e "  Stop services: ${CYAN}docker compose -f docker-compose.garfenter.yml stop${NC}"
    echo -e "  Start services:${CYAN}docker compose -f docker-compose.garfenter.yml start${NC}"
    echo -e "  Restart:       ${CYAN}docker compose -f docker-compose.garfenter.yml restart${NC}"
    echo -e "  Stop & Remove: ${CYAN}docker compose -f docker-compose.garfenter.yml down${NC}"
    echo ""

    echo -e "${BOLD}Container Status:${NC}"
    docker compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" ps
    echo ""

    echo -e "${YELLOW}${BOLD}First Time Setup:${NC}"
    echo -e "  1. Open ${CYAN}${SERVER_URL}${NC} in your browser"
    echo -e "  2. Create your first user account"
    echo -e "  3. Start managing your clients!"
    echo ""

    echo -e "${CYAN}${BOLD}============================================${NC}"
    echo -e "${GREEN}${BOLD}   Thank you for using Garfenter Clientes!${NC}"
    echo -e "${CYAN}${BOLD}============================================${NC}"
    echo ""
}

cleanup_on_error() {
    print_error "An error occurred during deployment"
    print_info "Cleaning up..."
    docker compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" down 2>/dev/null || true
    exit 1
}

# ============================================
# Main Execution
# ============================================

main() {
    # Set up error handling
    trap cleanup_on_error ERR

    # Clear screen and show banner
    clear
    print_banner

    # Run deployment steps
    check_requirements
    setup_environment
    check_ports
    pull_images
    start_services
    wait_for_services
    show_status
}

# Run main function
main
