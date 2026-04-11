FROM node:20-slim

WORKDIR /app

RUN apk update && apk upgrade

# Copy lockfile alongside package.json so npm ci can install exact versions
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

EXPOSE 5002

CMD ["node", "src/index.js"]
