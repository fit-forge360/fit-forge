FROM node:18-alpine

WORKDIR /app

# Copy lockfile alongside package.json so npm ci can install exact versions
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

EXPOSE 5004

CMD ["node", "src/index.js"]
