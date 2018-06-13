Remove-Item bin -Force  -Recurse -ErrorAction SilentlyContinue
mkdir bin | Out-Null
# Unfortunately windows docker dont work with local paths, must be changed 
docker run --rm -it -v C:/Users/martin/sparqleditor/demoDocker/bin:/tmp/bin sparqleditor /bin/bash -c "cp -r ./dist/* /tmp/bin;cp -r ./node_modules/monaco-editor /tmp/bin/monaco-editor;cp -r ./node_modules/requirejs /tmp/bin/requirejs;cp -r ../EditorTool/dist/editortool.js /tmp/bin/editortool.js"