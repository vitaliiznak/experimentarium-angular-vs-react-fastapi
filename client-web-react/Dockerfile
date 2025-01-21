FROM node:20-alpine

WORKDIR /app

# Copy package files first from the client-web-react directory
COPY client-web-react/package.json client-web-react/package-lock.json ./

# Copy shared packages if they exist
COPY packages ./packages

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY client-web-react .

# Expose both the Vite dev server port and debug port
EXPOSE 5173
EXPOSE 9230

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]