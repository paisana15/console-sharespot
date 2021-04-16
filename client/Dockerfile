FROM node:latest

WORKDIR /app
COPY . .
WORKDIR /app/client
RUN npm install
RUN npm i -g serve
ENV GENERATE_SOURCEMAP=false
RUN npm run build

CMD ["serve", "-s", "build", "-l", "80"]