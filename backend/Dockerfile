# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire React app to the container
COPY . .

# Expose the port that the app runs on
EXPOSE 5000

# Set the command to run the application
CMD ["npm", "run","serverstart"]