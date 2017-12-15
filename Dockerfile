FROM kkarczmarczyk/node-yarn:latest

WORKDIR /usr/src/app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install
RUN yarn cache clean

COPY src src
COPY public public

ARG REACT_APP_GRAPHQL_API

RUN yarn run build --production

RUN npm install -g serve

CMD serve -s build

EXPOSE 5000