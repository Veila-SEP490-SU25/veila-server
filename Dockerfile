# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0

# ------------------------------------------------------------------------------
# Base image with node for all stages
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# ------------------------------------------------------------------------------
# Install production dependencies
FROM base AS deps

# Use cache and bind mounts to speed up installs
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# ------------------------------------------------------------------------------
# Build the application
FROM base AS build

# Install all dependencies (including dev) to build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source code
COPY . .

# Build the project
RUN npm run build

# ------------------------------------------------------------------------------
# Final stage with minimal runtime dependencies
FROM base AS final

# Set production environment
ENV NODE_ENV=production

# Switch to non-root user
USER node

# Copy only what's needed to run
COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose application port
EXPOSE 1205

# Run the application (fixed typo)
CMD ["npm", "run", "start:prod"]
