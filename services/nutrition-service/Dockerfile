FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --omit=dev

COPY src/ ./src/

EXPOSE 5004

CMD ["node", "src/index.js"]
