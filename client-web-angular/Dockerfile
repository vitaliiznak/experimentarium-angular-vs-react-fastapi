FROM node:20-alpine

WORKDIR /app

# Install global dependencies
RUN npm install -g @angular/cli

# Install dependencies first
COPY package*.json ./
RUN npm install


# Copy the rest of the application
COPY . .

# Expose Angular dev server port and debug port
EXPOSE 4200
EXPOSE 9229

# Start development server
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"] 