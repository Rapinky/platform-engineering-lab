

# Stage 1: Build and test
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY src/ ./src/
COPY tests/ ./tests/
COPY scripts/ ./scripts/

RUN npm test && npm run build

fix: install monitoring test dependencies in Docker builder
# Stage 2: Runtime
FROM node:24-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/dist/ ./dist/

USER node

CMD ["node", "--check", "dist/calculator.mjs"]
