FROM node:20-alpine

WORKDIR /app

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Copy lockfile alongside package.json so npm ci can install exact versions
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

EXPOSE 5002

CMD ["node", "src/index.js"]
