ARG NODE_VERSION
FROM node:${NODE_VERSION:-latest} AS node 
COPY . /app
RUN npm install && npm run prod