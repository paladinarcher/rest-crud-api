FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install && \
  npm install -g --force nodemon

EXPOSE 3000

CMD ["npm", "run", "start"]
