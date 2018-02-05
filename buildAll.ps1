Set-Location .\node_modules\ERSParser
# npm install
# gulp build
Set-Location ../SparqlAutocompletion
# npm install 
# npm run build
Set-Location ../EditorComponent
# npm install 
# npm run buildRelease
# npm run buildDebug
Set-Location ../../
#Copy necessary editor files to bin folder
Remove-Item bin -Force  -Recurse -ErrorAction SilentlyContinue
mkdir bin | Out-Null
Copy-Item -Recurse .\node_modules\EditorComponent\dist\* bin\
Copy-Item -Recurse .\node_modules\EditorComponent\node_modules\monaco-editor bin\monaco-editor
# Copy necessary editor files to TestProject
Remove-Item .\TestProject\content\editor -Force  -Recurse -ErrorAction SilentlyContinue
mkdir .\TestProject\content\editor | Out-Null
Copy-Item -Recurse .\node_modules\EditorComponent\dist\* .\TestProject\content\editor
Copy-Item  -Recurse .\node_modules\EditorComponent\node_modules\monaco-editor .\TestProject\content\editor\monaco-editor