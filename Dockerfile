FROM node:12

# Create app directory
RUN mkdir -p /usr/graceful-shutdown
WORKDIR /usr/graceful-shutdown

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]