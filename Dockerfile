FROM node:lts-buster-slim AS builder

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY package*.json .
COPY prisma ./prisma/
RUN apt-get update -y && apt-get install -y openssl
RUN npm install

# Copy source files
COPY . .

# Build app
RUN npm run build

FROM node:lts-buster-slim AS prod

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 80

# Run app
CMD ["npm", "run", "start"]