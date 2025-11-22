# Dockerfile: apps/alifpustaka-app/Dockerfile

# --- STAGE 1: Dependency Installation and Build ---
FROM node:20-alpine AS base

# Install pnpm globally for efficient dependency management
RUN npm install -g pnpm

# Set the working directory for the entire monorepo
WORKDIR /app

# Copy root files needed for dependency resolution and Turborepo setup
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy packages required by the app
COPY packages/ ./packages/
COPY apps/alifpustaka-app/package.json ./apps/alifpustaka-app/

# Install dependencies for the entire workspace
# This MUST include 'prisma' as a devDependency in the shared package
RUN pnpm install --frozen-lockfile

# Copy source code after installation
COPY apps/alifpustaka-app/ ./apps/alifpustaka-app/

# Run the build command for this specific app and its dependencies
RUN pnpm --filter alifpustaka-app build


# --- STAGE 2: Final Production Image (Used by App and Migration Service) ---
# We use node-slim to keep it lighter than 'base', but retain Node.js features.
FROM node:20-slim AS runner

# Install OpenSSL/CA certificates needed for network connections (Prisma/DB)
# and a shell for running commands.
RUN apt-get update && apt-get install -y openssl ca-certificates bash \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Copy only the necessary files for production and migration
WORKDIR /app

# Copy the entire node_modules structure from the build stage. 
# This is necessary because the Prisma CLI (`prisma` package) and 
# its runtime dependencies (like @prisma/client, query engines) must be available for migration.
COPY --from=base /app/node_modules ./node_modules

# Copy built application and relevant config files
COPY --from=base /app/apps/alifpustaka-app/package.json ./apps/alifpustaka-app/package.json
COPY --from=base /app/apps/alifpustaka-app/dist ./apps/alifpustaka-app/dist

# Copy the packages directory containing the built Prisma config (dist)
COPY --from=base /app/packages ./packages

# 🚨 Migration service needs access to pnpm and its executable link
COPY --from=base /usr/local/bin/pnpm /usr/local/bin/pnpm

# Add any necessary runtime script (optional)
# CMD ["node", "./apps/alifpustaka-app/dist/index.js"] 
# NOTE: The CMD is typically overridden by the 'alifpustaka-migrate' service in docker-compose