FROM node:18-alpine

WORKDIR /app/src

# Install git (needed for simple-git) + bash + openssh
RUN apk add --no-cache git bash openssh

COPY src/package*.json ./
RUN npm ci

COPY src .

EXPOSE 4000
CMD ["node", "index.js"]
