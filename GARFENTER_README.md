# Garfenter Clientes - Twenty CRM Deployment

## Overview

This is a customized deployment of **Twenty CRM** configured specifically for **Garfenter** operations in Guatemala. The system is pre-configured with Spanish language, Guatemalan Quetzal (GTQ) currency, and Guatemala timezone.

## Quick Start

### 1. One-Click Deployment

```bash
./garfenter-start.sh
```

This automated script will:
- Check system requirements (Docker, Docker Compose)
- Create environment configuration
- Pull necessary Docker images
- Start all services (CRM, Database, Cache, Worker)
- Display access URLs and status

### 2. Access the CRM

Open your browser and navigate to:
```
http://localhost:3000
```

Create your first admin account and start using Garfenter Clientes!

## Files Created

### Core Deployment Files

1. **`docker-compose.garfenter.yml`** (5.0 KB)
   - Complete Docker Compose configuration
   - Services: server, worker, PostgreSQL 15, Redis 7
   - Pre-configured with Guatemala settings
   - Uses `garfenter-network` for service communication
   - Persistent data volumes for database and file storage

2. **`.env.garfenter.example`** (3.7 KB)
   - Comprehensive environment template
   - Database configuration
   - Security settings
   - Email configuration (optional)
   - Google/Microsoft integration (optional)
   - S3 storage configuration (optional)

3. **`garfenter-start.sh`** (8.6 KB)
   - Automated deployment script
   - Beautiful ASCII art branding
   - System requirements check
   - Port availability verification
   - Service health monitoring
   - Colorful status output

### Documentation Files

4. **`GARFENTER_DEPLOYMENT.md`** (9.1 KB)
   - Complete deployment guide
   - Configuration options
   - Management commands
   - Backup and restore procedures
   - Troubleshooting guide
   - Production deployment checklist
   - Security best practices

5. **`GARFENTER_QUICKSTART.md`** (1.1 KB)
   - Quick reference guide
   - Essential commands
   - Configuration highlights
   - Fast access to key information

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Garfenter Clientes                     │
│                (Docker Compose Stack)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │   garfenter-clientes-server (Twenty CRM)        │   │
│  │   - Backend API (NestJS)                        │   │
│  │   - Frontend (React)                            │   │
│  │   - Port: 3000                                  │   │
│  │   - Spanish UI, GTQ currency                    │   │
│  └──────────┬──────────────────────────────────────┘   │
│             │                                           │
│  ┌──────────┴──────────────────────────────────────┐   │
│  │   garfenter-clientes-worker                     │   │
│  │   - Background job processing                   │   │
│  │   - Email sending, data sync, etc.              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────┐    ┌─────────────────────┐   │
│  │  garfenter-postgres │    │   garfenter-redis   │   │
│  │  PostgreSQL 15      │    │   Redis 7           │   │
│  │  Port: 5432         │    │   Port: 6379        │   │
│  │  Data: GTQ, es      │    │   Cache & Sessions  │   │
│  └─────────────────────┘    └─────────────────────┘   │
│                                                          │
│  Network: garfenter-network                             │
│  Volumes: db-data, redis-data, server-storage          │
└─────────────────────────────────────────────────────────┘
```

## Guatemala-Specific Configuration

The deployment is pre-configured with:

- **Language:** Spanish (es)
- **Currency:** Guatemalan Quetzal (GTQ)
- **Timezone:** America/Guatemala
- **Locale Settings:** All date, time, and number formats use Guatemala standards

## Quick Reference Commands

### Start/Stop Services

```bash
# Start all services
./garfenter-start.sh

# Stop services (keep data)
docker compose -f docker-compose.garfenter.yml stop

# Start stopped services
docker compose -f docker-compose.garfenter.yml start

# Restart services
docker compose -f docker-compose.garfenter.yml restart
```

### View Logs

```bash
# All services
docker compose -f docker-compose.garfenter.yml logs -f

# Specific service
docker compose -f docker-compose.garfenter.yml logs -f garfenter-clientes-server
```

### Database Management

```bash
# Backup database
docker exec garfenter-postgres pg_dump -U postgres garfenter_clientes > backup.sql

# Restore database
cat backup.sql | docker exec -i garfenter-postgres psql -U postgres -d garfenter_clientes

# Connect to database
docker exec -it garfenter-postgres psql -U postgres -d garfenter_clientes
```

## Configuration

### Environment File

On first run, `.env.garfenter` is created from `.env.garfenter.example`.

**Important: Change these for production:**

```bash
# Generate secure password
PG_DATABASE_PASSWORD=your_secure_password_here

# Generate with: openssl rand -base64 32
APP_SECRET=your_secure_secret_here

# Your production domain
SERVER_URL=https://crm.garfenter.com
```

### Optional Features

Edit `.env.garfenter` to enable:

- **Email Sending:** SMTP configuration for notifications
- **Google Integration:** Calendar and Gmail sync
- **Microsoft Integration:** Outlook and Teams integration
- **S3 Storage:** Cloud file storage instead of local

See `.env.garfenter.example` for all available options.

## Data Persistence

All data is stored in Docker volumes:

| Volume | Purpose | Location |
|--------|---------|----------|
| `garfenter-db-data` | PostgreSQL database | All CRM data |
| `garfenter-redis-data` | Redis cache | Sessions, queues |
| `garfenter-server-storage` | File storage | Uploads, attachments |

**Note:** Volumes persist even when containers are stopped or removed (unless using `down -v`).

## System Requirements

### Minimum Requirements

- **OS:** macOS, Linux, or Windows with WSL2
- **Docker:** Version 20.10 or higher
- **Docker Compose:** V2 (included in Docker Desktop)
- **RAM:** 4 GB minimum (8 GB recommended)
- **Disk:** 10 GB free space
- **Ports:** 3000, 5432, 6379 available

### Recommended for Production

- **RAM:** 16 GB
- **Disk:** 50 GB SSD
- **CPU:** 4 cores
- **Network:** Stable internet connection
- **Backups:** Automated daily backups
- **Monitoring:** Prometheus/Grafana setup

## Security Considerations

### Development Environment

The default configuration is suitable for local development and testing.

### Production Environment

Before deploying to production:

1. **Change all default passwords**
   - Database password
   - Application secret

2. **Use HTTPS**
   - Set up SSL/TLS certificate
   - Use reverse proxy (nginx, traefik)

3. **Firewall Configuration**
   - Restrict database port (5432) to localhost only
   - Restrict Redis port (6379) to localhost only
   - Only expose application port (3000) through reverse proxy

4. **Regular Backups**
   - Automated daily database backups
   - Test restore procedures
   - Off-site backup storage

5. **Monitoring**
   - Set up logging
   - Monitor resource usage
   - Configure alerts

See `GARFENTER_DEPLOYMENT.md` for detailed production deployment guide.

## Troubleshooting

### Port Already in Use

If ports 3000, 5432, or 6379 are already in use:

1. Edit `.env.garfenter`
2. Change port numbers:
   ```bash
   SERVER_PORT=3001
   PG_PORT=5433
   REDIS_PORT=6380
   ```
3. Restart services

### Services Won't Start

1. Ensure Docker is running:
   ```bash
   docker info
   ```

2. Check logs for errors:
   ```bash
   docker compose -f docker-compose.garfenter.yml logs
   ```

3. Reset everything:
   ```bash
   docker compose -f docker-compose.garfenter.yml down -v
   ./garfenter-start.sh
   ```

### Database Connection Issues

1. Check database is running:
   ```bash
   docker exec garfenter-postgres pg_isready
   ```

2. Verify credentials in `.env.garfenter`

3. Check database logs:
   ```bash
   docker compose -f docker-compose.garfenter.yml logs garfenter-postgres
   ```

For more troubleshooting help, see `GARFENTER_DEPLOYMENT.md`.

## Upgrading

To upgrade to a new version of Twenty CRM:

1. Backup your data first!
   ```bash
   docker exec garfenter-postgres pg_dump -U postgres garfenter_clientes > backup.sql
   ```

2. Update the TAG in `.env.garfenter`:
   ```bash
   TAG=v0.30.0  # or latest
   ```

3. Pull new images and restart:
   ```bash
   docker compose -f docker-compose.garfenter.yml pull
   docker compose -f docker-compose.garfenter.yml up -d
   ```

## Getting Help

### Documentation

- **Quick Start:** `GARFENTER_QUICKSTART.md`
- **Full Guide:** `GARFENTER_DEPLOYMENT.md`
- **This File:** `GARFENTER_README.md`

### Twenty CRM Resources

- Official Documentation: https://twenty.com/developers
- GitHub Repository: https://github.com/twentyhq/twenty
- Community Discord: https://discord.gg/cx5n4Jzs57

### Garfenter Support

Contact your system administrator for Garfenter-specific support.

## License

This deployment is based on **Twenty CRM**, which is licensed under **AGPLv3**.

The deployment scripts and configuration are customized for Garfenter operations.

## Credits

- **Twenty CRM:** https://twenty.com
- **Deployment by:** Garfenter Development Team
- **Configured for:** Guatemala operations

---

**Garfenter Clientes** - Professional CRM for Guatemala
Powered by Twenty CRM
