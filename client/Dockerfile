FROM node:18-alpine as build-deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build-deps /usr/src/app/dist ./

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]