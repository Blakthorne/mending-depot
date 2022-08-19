FROM node:current-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY package.json .
COPY package-lock.json .
COPY next.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .
RUN npm install

# Copy source files
COPY . .

# Build app
RUN npm build
EXPOSE 3000

# Run app
CMD ["npm", "next", "dev"]