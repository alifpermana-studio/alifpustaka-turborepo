# Dockerfile: apps/alifpustaka-web/Dockerfile

# --- STAGE 1: Build Dependencies ---
FROM node:20-alpine AS base

RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all source code, including shared packages and the app itself
COPY packages/ ./packages/
COPY apps/alifpustaka-web/ ./apps/alifpustaka-web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Run the Turborepo build for the web app
# This command generates the optimized production output in .next/
RUN pnpm --filter alifpustaka-web build


# --- STAGE 2: Runner Image (Next.js Standalone) ---
# Use the official Next.js recommendation for a lightweight production image
FROM node:20-alpine AS runner

ENV NODE_ENV production
# Set the port the container will run on
ENV PORT 4000 
# Set this to where your app will run
WORKDIR /app

# The Next.js standalone output contains all required files, including node_modules
# The 'standalone' directory is created during the build stage
COPY --from=base /app/apps/alifpustaka-web/.next/standalone ./
COPY --from=base /app/apps/alifpustaka-web/.next/static ./apps/alifpustaka-web/.next/static
# Copy public assets if necessary
COPY apps/alifpustaka-web/public ./apps/alifpustaka-web/public

# Execute the application
CMD ["node", "apps/alifpustaka-web/server.js"]