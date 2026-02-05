# frontend/Dockerfile
FROM node:20

WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start Vite dev server
CMD ["npm", "run", "dev"]
