FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD sleep 10 && node server.js

CMD [ "node", "server.js" ]