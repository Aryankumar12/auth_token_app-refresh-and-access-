# Use official Node image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start server
CMD ["node", "server.js"]