# Garfenter Clientes - Quick Start

## One-Click Deployment

```bash
./garfenter-start.sh
```

## What You Get

- **Twenty CRM** configured for Guatemala
- **Spanish** language (es)
- **GTQ** (Quetzal) currency
- **America/Guatemala** timezone
- PostgreSQL 15 database
- Redis 7 cache
- Complete CRM solution ready to use

## Access

Open in browser: **http://localhost:3000**

Create your first admin account and start managing clients!

## Quick Commands

```bash
# View logs
docker compose -f docker-compose.garfenter.yml logs -f

# Stop services
docker compose -f docker-compose.garfenter.yml stop

# Start services
docker compose -f docker-compose.garfenter.yml start

# Restart
docker compose -f docker-compose.garfenter.yml restart
```

## Configuration

Edit `.env.garfenter` for custom settings.

**Important:** Change these in production:
- `PG_DATABASE_PASSWORD` - Database password
- `APP_SECRET` - Application secret (generate with: `openssl rand -base64 32`)
- `SERVER_URL` - Your domain URL

## Full Documentation

See `GARFENTER_DEPLOYMENT.md` for complete documentation including:
- Email configuration
- Google/Microsoft integration
- Backup and restore procedures
- Production deployment guide
- Troubleshooting

## Support

- Twenty CRM Docs: https://twenty.com/developers
- GitHub: https://github.com/twentyhq/twenty

---

**Garfenter Clientes** - Powered by Twenty CRM
