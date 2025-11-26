# Garfenter Clientes - One-Click Deployment Guide

## Overview

This deployment setup provides a one-click installation of **Garfenter Clientes**, a CRM system based on Twenty CRM, specifically configured for Guatemala operations.

## What's Included

The deployment includes:

- **Twenty CRM Server** - Backend API and business logic
- **Twenty CRM Frontend** - React-based user interface
- **PostgreSQL 15** - Primary database
- **Redis 7** - Caching and session management
- **Worker Service** - Background job processing

All configured with:
- Spanish language (es)
- Guatemalan Quetzal (GTQ) currency
- America/Guatemala timezone

## Quick Start

### Prerequisites

1. **Docker Desktop** installed and running
   - Download from: https://www.docker.com/products/docker-desktop
   - Minimum version: Docker 20.10+
   - Required for Docker Compose V2

2. **System Requirements**
   - 4GB RAM minimum (8GB recommended)
   - 10GB free disk space
   - Ports available: 3000 (server), 5432 (postgres), 6379 (redis)

### One-Click Deployment

Simply run:

```bash
./garfenter-start.sh
```

That's it! The script will:
1. Check system requirements
2. Create environment file if needed
3. Pull Docker images
4. Start all services
5. Show access URLs and status

### First Time Access

1. Open http://localhost:3000 in your browser
2. Create your first admin account
3. Start using Garfenter Clientes!

## Configuration

### Environment Variables

All configuration is in `.env.garfenter` file (created automatically from `.env.garfenter.example`).

#### Essential Settings (Change These!)

```bash
# Database password - CHANGE IN PRODUCTION!
PG_DATABASE_PASSWORD=garfenter2024_change_me_in_production

# Application secret - Generate with: openssl rand -base64 32
APP_SECRET=garfenter_secret_CHANGE_THIS_IN_PRODUCTION

# Server URL - Update for production
SERVER_URL=http://localhost:3000
```

#### Port Configuration

If default ports are in use, change these:

```bash
SERVER_PORT=3000      # Main application port
PG_PORT=5432         # PostgreSQL port
REDIS_PORT=6379      # Redis port
```

#### Localization (Pre-configured)

```bash
DEFAULT_LOCALE=es              # Spanish
DEFAULT_CURRENCY=GTQ           # Guatemalan Quetzal
TZ=America/Guatemala          # Guatemala timezone
```

### Optional Features

#### Email Configuration

Uncomment and configure in `.env.garfenter`:

```bash
EMAIL_FROM_ADDRESS=contacto@garfenter.com
EMAIL_FROM_NAME="Garfenter CRM"
EMAIL_SYSTEM_ADDRESS=sistema@garfenter.com
EMAIL_DRIVER=smtp
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=465
EMAIL_SMTP_USER=your-email@garfenter.com
EMAIL_SMTP_PASSWORD=your-smtp-password
```

#### Google Integration

For Calendar and Gmail integration:

```bash
MESSAGING_PROVIDER_GMAIL_ENABLED=true
CALENDAR_PROVIDER_GOOGLE_ENABLED=true
AUTH_GOOGLE_CLIENT_ID=your-client-id
AUTH_GOOGLE_CLIENT_SECRET=your-client-secret
AUTH_GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/redirect
AUTH_GOOGLE_APIS_CALLBACK_URL=http://localhost:3000/auth/google-apis/redirect
```

#### S3 Storage

For cloud file storage:

```bash
STORAGE_TYPE=s3
STORAGE_S3_REGION=us-east-1
STORAGE_S3_NAME=garfenter-crm-storage
STORAGE_S3_ENDPOINT=https://s3.amazonaws.com
```

## Management Commands

### View Logs

```bash
# All services
docker compose -f docker-compose.garfenter.yml logs -f

# Specific service
docker compose -f docker-compose.garfenter.yml logs -f garfenter-clientes-server
```

### Control Services

```bash
# Stop services (data preserved)
docker compose -f docker-compose.garfenter.yml stop

# Start services
docker compose -f docker-compose.garfenter.yml start

# Restart services
docker compose -f docker-compose.garfenter.yml restart

# Stop and remove containers (data preserved in volumes)
docker compose -f docker-compose.garfenter.yml down

# Stop and remove everything including data (DANGEROUS!)
docker compose -f docker-compose.garfenter.yml down -v
```

### Check Status

```bash
docker compose -f docker-compose.garfenter.yml ps
```

### Access Database

```bash
# Connect to PostgreSQL
docker exec -it garfenter-postgres psql -U postgres -d garfenter_clientes
```

### Access Redis

```bash
# Connect to Redis CLI
docker exec -it garfenter-redis redis-cli
```

## Backup and Restore

### Database Backup

```bash
# Create backup
docker exec garfenter-postgres pg_dump -U postgres garfenter_clientes > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
cat backup_file.sql | docker exec -i garfenter-postgres psql -U postgres -d garfenter_clientes
```

### Full Backup (Volumes)

```bash
# Backup all data volumes
docker run --rm \
  -v garfenter-db-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/garfenter-backup-$(date +%Y%m%d).tar.gz -C /data .
```

## Troubleshooting

### Services Won't Start

1. Check Docker is running:
   ```bash
   docker info
   ```

2. Check port conflicts:
   ```bash
   lsof -i :3000
   lsof -i :5432
   lsof -i :6379
   ```

3. View error logs:
   ```bash
   docker compose -f docker-compose.garfenter.yml logs
   ```

### Database Connection Issues

1. Check database is healthy:
   ```bash
   docker exec garfenter-postgres pg_isready
   ```

2. Verify credentials in `.env.garfenter`

3. Check database logs:
   ```bash
   docker compose -f docker-compose.garfenter.yml logs garfenter-postgres
   ```

### Application Not Loading

1. Wait for database initialization (first run can take 2-3 minutes)

2. Check server health:
   ```bash
   curl http://localhost:3000/healthz
   ```

3. Check server logs:
   ```bash
   docker compose -f docker-compose.garfenter.yml logs garfenter-clientes-server
   ```

### Reset Everything

If you need to start fresh:

```bash
# Stop and remove everything
docker compose -f docker-compose.garfenter.yml down -v

# Remove environment file
rm .env.garfenter

# Start again
./garfenter-start.sh
```

## Production Deployment

### Security Checklist

- [ ] Change `PG_DATABASE_PASSWORD` to a strong password
- [ ] Generate new `APP_SECRET` with: `openssl rand -base64 32`
- [ ] Update `SERVER_URL` to your production domain
- [ ] Configure SSL/TLS (use reverse proxy like nginx or traefik)
- [ ] Set up regular database backups
- [ ] Configure firewall rules
- [ ] Enable monitoring and alerting
- [ ] Review and configure email settings
- [ ] Set up log rotation

### Recommended Production Setup

1. Use a reverse proxy (nginx/traefik) with SSL
2. Set up automated backups
3. Use external PostgreSQL and Redis (managed services)
4. Configure S3 for file storage
5. Set up monitoring (Prometheus/Grafana)
6. Use Docker Swarm or Kubernetes for high availability

### Reverse Proxy Example (nginx)

```nginx
server {
    listen 80;
    server_name crm.garfenter.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name crm.garfenter.com;

    ssl_certificate /etc/ssl/certs/garfenter.crt;
    ssl_certificate_key /etc/ssl/private/garfenter.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Architecture

### Services Overview

```
┌─────────────────────────────────────────────┐
│          garfenter-clientes-server          │
│         (Twenty CRM API + Frontend)         │
│              Port: 3000                     │
└───────────────┬─────────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
┌───────▼──────┐  ┌────▼──────────┐
│   PostgreSQL │  │     Redis     │
│   (Database) │  │    (Cache)    │
│  Port: 5432  │  │  Port: 6379   │
└──────────────┘  └───────────────┘
        │               │
        └───────┬───────┘
                │
     ┌──────────▼──────────┐
     │  garfenter-worker   │
     │  (Background Jobs)  │
     └─────────────────────┘
```

### Data Persistence

All data is stored in Docker volumes:

- `garfenter-db-data` - PostgreSQL database
- `garfenter-redis-data` - Redis cache
- `garfenter-server-storage` - File uploads

Volumes persist even when containers are removed (unless using `down -v`).

### Network

All services communicate over `garfenter-network` bridge network.

## Support

### Official Twenty CRM Documentation

- Documentation: https://twenty.com/developers
- GitHub: https://github.com/twentyhq/twenty
- Community: https://discord.gg/cx5n4Jzs57

### Garfenter Specific Issues

For Garfenter-specific configuration questions, contact your system administrator.

## License

This deployment setup is based on Twenty CRM, which is licensed under AGPLv3.
See LICENSE file for details.

---

**Garfenter Clientes** - Built with Twenty CRM
