# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0

# ------------------------------------------------------------------------------
# Base image with node for all stages
FROM node:${NODE_VERSION} AS base

# Install cross-env globally
RUN npm install -g cross-env

# Set working directory
WORKDIR /usr/src/app

FROM base AS build

# Copy package files
COPY package.json ./

# Debug: Show npm and node versions
RUN node --version && npm --version

# Install all dependencies (including dev)
RUN npm install --force

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Final stage: minimal runtime
FROM base AS final
RUN mkdir -p /usr/src/app/uploads && chown -R node:node /usr/src/app/uploads

COPY package.json ./
# Install only production dependencies
RUN npm install --omit=dev --force

USER node

# Copy package files and built app

COPY --from=build /usr/src/app/dist ./dist

EXPOSE ${PORT}
CMD ["sh", "-c", "npm run ${START_COMMAND}"]
