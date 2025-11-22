FROM node:16-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=build /app/build ./build

# Copy server.js file from the build stage
COPY --from=build /app/server.js ./

# Install required packages for the server
RUN npm init -y && \
    npm install serve-handler http-proxy-middleware

# Expose port
EXPOSE 3000

# Serve the app on port 3000
CMD ["node", "server.js"]