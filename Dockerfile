# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0

# ------------------------------------------------------------------------------
# Base image with node for all stages
FROM node:${NODE_VERSION} AS base

# Set working directory
WORKDIR /usr/src/app

# ------------------------------------------------------------------------------
# Install production dependencies
FROM base AS deps

# Copy package files
COPY package.json ./

# Debug: Show npm and node versions
RUN node --version && npm --version

# Install production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# ------------------------------------------------------------------------------
# Build the application
FROM base AS build

# Copy package files
COPY package.json ./

# Debug: Show npm and node versions
RUN node --version && npm --version

# Install all dependencies (including dev)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the project
RUN npm run build

# ------------------------------------------------------------------------------
# Final stage with minimal runtime dependencies
FROM base AS final

# Set production environment
ENV NODE_ENV=production
ENV PORT=1205
ENV START_COMMAND=start:prod

# Switch to non-root user
USER node

# Copy only what's needed to run
COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose application port
EXPOSE ${PORT}

# Run the application with configurable command
CMD ["sh", "-c", "npm run ${START_COMMAND}"]
