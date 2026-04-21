FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy workspace manifests (cheap layer for cache)
COPY package.json pnpm-lock.yaml* ./

# Copy workspace config if mounted from repo root (adjust at build time)
# Build context assumed to be repo root — use `.dockerignore` to trim.
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY artifacts/agents/package.json ./artifacts/agents/package.json
COPY artifacts/landing/package.json ./artifacts/landing/package.json
COPY artifacts/landing/drizzle ./artifacts/landing/drizzle

RUN pnpm install --filter @workspace/agents... --frozen-lockfile=false

# Copy the agents source
COPY artifacts/agents ./artifacts/agents

WORKDIR /app/artifacts/agents

# Default entrypoint — override in container apps per job (scraper, classifier, etc.)
ENV AGENT_FIXTURE_MODE=false
ENTRYPOINT ["node", "--experimental-vm-modules", "--loader", "tsx"]
CMD ["scraper/main.ts"]
