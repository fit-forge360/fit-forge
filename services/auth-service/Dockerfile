FROM node:20-slim

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node src/ ./src/
EXPOSE 5001
CMD ["node", "src/index.js"]
