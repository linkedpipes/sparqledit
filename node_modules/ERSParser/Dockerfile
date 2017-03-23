FROM node
MAINTAINER Martin Rouček
RUN npm install mocha -g  && \
    npm install gulp -g
WORKDIR /home
COPY package.json /home/package.json
RUN npm install
COPY . /home
CMD ["gulp", "test"] 