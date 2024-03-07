FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 4000

CMD [ "node", "server.js" ]