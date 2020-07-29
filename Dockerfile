FROM node:12

# Create app directory
RUN mkdir -p /usr/graceful-shutdown
WORKDIR /usr/graceful-shutdown

COPY package*.json ./

RUN npm install

RUN npm link

RUN npm install ./opentelemetry-js/

COPY . .

CMD [ "node", "index.js" ]