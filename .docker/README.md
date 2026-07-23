# SIDRA Docker Environment

## Directory Structure

.docker/
│
├── Dockerfile.dev
├── Dockerfile.prod
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md


## Development

Build

docker compose -f .docker/docker-compose.dev.yml up --build

Stop

docker compose -f .docker/docker-compose.dev.yml down


## Production

Build

docker compose -f .docker/docker-compose.prod.yml up --build -d

Stop

docker compose -f .docker/docker-compose.prod.yml down


## Default Ports

Application

3000


## Environment

Development

.env.local

Production

.env.production.local


## Images

Development

sidra-dev

Production

sidra-production


## Requirements

- Docker Engine 27+
- Docker Compose v2+
- Node.js 22
- npm 10+


## Notes

- Development supports hot reload.
- Production runs optimized Next.js standalone output.
- Environment variables are loaded from local environment files.
- Firebase credentials are **not** stored inside Docker images.
- Secrets must be injected at runtime.


SIDRA Production Infrastructure
Version 1.0
