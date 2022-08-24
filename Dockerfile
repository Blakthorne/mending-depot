FROM node:18-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy source files
COPY . .

# Build app
RUN npm run build
EXPOSE 3000

# Run app
CMD ["npm", "run", "dev"]