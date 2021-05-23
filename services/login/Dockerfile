FROM node:14.17.0 as builder

WORKDIR /app

COPY ["./package.json", "./package-lock.json", "./"]
COPY ./ ./

RUN npm i --only=dev
RUN npm i --only=prod

RUN npm run clean
RUN npm run build

FROM node:14.17.0

WORKDIR /app

COPY ["./package.json", "./package-lock.json", "./"]
RUN npm i --only=prod

COPY --from=builder "/app/build/" "./build"

EXPOSE $PORT

CMD npm start
