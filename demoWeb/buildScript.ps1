Remove-Item  web\bin -Force  -Recurse -ErrorAction SilentlyContinue
mkdir web\bin | Out-Null
# Unfortunately windows docker dont work with local paths, must be changed 
docker run --rm -it -v C:/Users/martin/sparqleditor/demoWeb/web/bin:/tmp/bin sparqleditor /bin/bash -c "mkdir /tmp/bin/sparqleditor;cp -r ./dist/* /tmp/bin/sparqleditor;cp -r ./node_modules/monaco-editor /tmp/bin/monaco-editor;cp -r ./node_modules/requirejs /tmp/bin/requirejs;cp -r ../EditorTool/dist/editortool.js /tmp/bin/editortool.js"
Remove-Item web\sparql-editor.zip -Force -ErrorAction SilentlyContinue
Compress-Archive -Path .\web\bin\* -DestinationPath web\sparql-editor