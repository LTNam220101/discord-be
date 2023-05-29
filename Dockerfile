FROM node:18-alpine
 
WORKDIR /user/src/app

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json ./
 
COPY . .

RUN cp .env.example .env

RUN npm install
 
CMD ["npm", "run", "start:dev"]
