# Dockerize — Next.js App Router Project

A guide on building and running this Next.js project inside a Docker container using a multi-stage build optimized for production.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [How the Dockerfile Works](#how-the-dockerfile-works)
- [Build the Image](#build-the-image)
- [Run the Container](#run-the-container)
- [Environment Variables](#environment-variables)
- [Docker Compose (Optional)](#docker-compose-optional)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed (v20+ recommended)
- (Optional) [Docker Compose](https://docs.docker.com/compose/) for multi-service setups

---

## How the Dockerfile Works

The Dockerfile uses a **three-stage multi-stage build** to produce a small, secure production image.

### Stage 1 — `deps` (Install Dependencies)

```dockerfile
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
```

- Starts from a lightweight Alpine Node image.
- Enables **pnpm** via corepack.
- Installs dependencies using the lockfile to ensure reproducible builds.

### Stage 2 — `builder` (Build the App)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build
```

- Copies `node_modules` from the deps stage and the full source code.
- Runs `pnpm build`, which produces a **standalone** output thanks to the `output: "standalone"` setting in `next.config.ts`.

### Stage 3 — `runner` (Production Image)

```dockerfile
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

- Copies only the **standalone server**, **static assets**, and **public** folder — no `node_modules` bloat.
- Runs as a non-root `nextjs` user for security.
- Final image is typically **~150–200 MB** compared to 1 GB+ for a naive build.

---

## Build the Image

```bash
docker build -t nextjs-seo-app .
```

To build without cache (useful after dependency changes):

```bash
docker build --no-cache -t nextjs-seo-app .
```

---

## Run the Container

```bash
docker run -p 3000:3000 nextjs-seo-app
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Run in Detached Mode

```bash
docker run -d -p 3000:3000 --name nextjs-seo-app nextjs-seo-app
```

### Pass Environment Variables at Runtime

```bash
docker run -p 3000:3000 \
  -e API_BASE_URL=https://api.example.com \
  nextjs-seo-app
```

Or use an env file:

```bash
docker run -p 3000:3000 --env-file .env.production nextjs-seo-app
```

---

## Environment Variables

| Variable | Default | Description |
| ----------------------- | ----------- | ---------------------------------------- |
| `NODE_ENV` | `production`| Node environment |
| `PORT` | `3000` | Port the server listens on |
| `HOSTNAME` | `0.0.0.0` | Bind address |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disables Next.js telemetry |

Add any app-specific variables (e.g. `API_BASE_URL`) via `-e` flags or `--env-file`.

---

## Docker Compose (Optional)

Create a `docker-compose.yml` at the project root for convenience:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Then run:

```bash
docker compose up --build        # build & start
docker compose up -d             # detached mode
docker compose down              # stop & remove
```

---

## Useful Commands

```bash
# List running containers
docker ps

# View logs
docker logs nextjs-seo-app
docker logs -f nextjs-seo-app    # follow/stream logs

# Stop the container
docker stop nextjs-seo-app

# Remove the container
docker rm nextjs-seo-app

# Remove the image
docker rmi nextjs-seo-app

# Shell into a running container
docker exec -it nextjs-seo-app sh
```

---

## Troubleshooting

### Build fails at `pnpm install`

Make sure `pnpm-lock.yaml` is committed and up to date. Run `pnpm install` locally first to regenerate it if needed.

### `.next/standalone` folder is missing

Ensure `next.config.ts` has the standalone output enabled:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};
```

### Container exits immediately

Check logs with `docker logs nextjs-seo-app`. Common causes:

- Missing required environment variables.
- Port conflict — try a different host port: `-p 8080:3000`.

### Static assets (images, CSS) not loading

The standalone output requires the `public` and `.next/static` folders to be copied separately. The Dockerfile already handles this — verify those `COPY` lines are present.
