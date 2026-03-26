# Build stage
FROM node:20-bookworm AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
# COPY .env ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:20-bookworm

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy built app from builder
COPY --from=builder /app/.output ./.output

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "./.output/server/index.mjs"]
