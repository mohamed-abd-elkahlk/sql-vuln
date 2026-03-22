# Use a specific Node LTS Alpine image for stability and smaller footprint
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Enable Corepack (built into Node) to manage pnpm without needing npm install -g
RUN corepack enable pnpm

# Copy only the dependency files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using a frozen lockfile for deterministic builds
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]