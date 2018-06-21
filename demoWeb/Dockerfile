FROM node:8.4
RUN npm install http-server -g
COPY index.html  exampleOntology.json ./bin/ /var/sparqleditor/
WORKDIR /var/sparqleditor
CMD ["http-server","-p","80"]