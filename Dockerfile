FROM amd64/alpine:latest

RUN apk add --update \
ffmpeg \
imagemagick \
nodejs-current \
python2 \
yarn \
git \
make \
g++

WORKDIR /mclbot

COPY . .

RUN yarn install

EXPOSE 3000 9400
CMD [ "/usr/bin/node", "/mclbot/bot.js" ]
