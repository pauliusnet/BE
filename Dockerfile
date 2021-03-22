FROM node:10.13.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ADD . /usr/src/app
RUN npm run build
EXPOSE 80
ENTRYPOINT npm run typeorm migration:run && npm run start:prod
