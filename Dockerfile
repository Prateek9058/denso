FROM node:20-alpine
# ENV NODE_ENV development
WORKDIR /app

COPY ./package*.json /app

RUN npm install

COPY . .
# RUN npm run build
EXPOSE 3000

CMD ["npm","run","dev"]