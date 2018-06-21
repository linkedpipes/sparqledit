FROM node:8.4
RUN npm install http-server -g
COPY web /var/sparqleditor/
WORKDIR /var/sparqleditor
CMD ["http-server"]