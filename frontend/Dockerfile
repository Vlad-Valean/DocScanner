# Base image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
