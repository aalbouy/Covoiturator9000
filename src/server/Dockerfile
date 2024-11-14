FROM node:lts-alpine as build-stage

RUN apk update && apk upgrade
RUN apk add --no-cache sqlite

## Server
RUN mkdir server
WORKDIR /server
COPY ./package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]