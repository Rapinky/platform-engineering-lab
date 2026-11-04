
FROM node:24-alpine

WORKDIR /app

COPY package.json ./
COPY src/ ./src/
COPY tests/ ./tests/
COPY scripts/ ./scripts/

RUN npm test && npm run build

USER node

CMD ["node", "--check", "dist/calculator.mjs"]
