FROM node:8.4
RUN npm install mocha -g  && \
    npm install gulp -g && \
    npm install http-server -g 
RUN mkdir -p /home/app/node_modules
WORKDIR /home/app/node_modules/EditorComponent
COPY ./node_modules/ERSParser/package.json /home/app/node_modules/ERSParser/package.json
RUN npm install --prefix /home/app/node_modules/ERSParser
COPY ./node_modules/SparqlAutocompletion/package.json /home/app/node_modules/SparqlAutocompletion/package.json
RUN npm install --prefix /home/app/node_modules/SparqlAutocompletion
COPY ./node_modules/EditorTool/package.json /home/app/node_modules/EditorTool/package.json
RUN npm install --prefix /home/app/node_modules/EditorTool
COPY ./node_modules/EditorComponent/package.json /home/app/node_modules/EditorComponent/package.json
RUN npm install --prefix /home/app/node_modules/EditorComponent
COPY ./node_modules /home/app/node_modules
RUN gulp --cwd ../ERSParser build
RUN npm run build --prefix /home/app/node_modules/SparqlAutocompletion
RUN npm run build --prefix /home/app/node_modules/EditorTool
RUN npm run buildDebug --prefix /home/app/node_modules/EditorComponent && \
    npm run buildRelease --prefix /home/app/node_modules/EditorComponent
CMD ["http-server"]