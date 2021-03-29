FROM node:latest

WORKDIR /app
COPY . .
WORKDIR /app/client
RUN npm install
WORKDIR /app
CMD ["npm", "run", "client"]