FROM node:alpine3.15
# EXPOSE 3000 9229

WORKDIR /home/worker

COPY package.json /home/worker/
COPY yarn.lock /home/worker/

RUN yarn install

COPY . /home/worker

RUN yarn build

CMD ./scripts/start.sh