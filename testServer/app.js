var express = require('express')
var fs = require('fs');
var app = express();

app.use('/', express.static(__dirname));
app.use('/content', express.static(__dirname + '\\..\\ERSParser'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '\\index.html')
})
var getFilesTree = function (path) {
    getFilesTreeRecursive
}

var getFilesTreeRecursive = function (path, files) {
    fs.readdirSync(path).forEach(function (file) {
        var subpath = path + '\\' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFilesTree(subpath, files);
        } else {
            files.push(path + '\\' + file);
        }
    });
}
var getFilesTree = function (path) {
    var pathObject = {
        prefix: path,
        relative: "",
        getAbsolutePath: function () {
            return this.prefix + this.relative;
        }
    }
    return getFilesTreeRecursive(pathObject);
}

var getFilesTreeRecursive = function (path) {
    var files = [];
    var folders = [];

    var result = fs.readdirSync(path.getAbsolutePath()).forEach(function (file) {
        var subpath = path.getAbsolutePath() + "\\" + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            var subFolderPath = Object.assign({}, path);
            subFolderPath.relative += "\\" + file;
            folders.push(getFilesTreeRecursive(subFolderPath));
        } else {
            files.push(file);
        }
    });

    var folderInfo = {};
    folderInfo.path = path;
    folderInfo.folders = folders;
    folderInfo.files = files;
    return folderInfo;
}

app.get('/test', function (req, res) {

    var result = getFilesTree(__dirname + '\\..\\parser\\test');
    res.send(result);
});

app.listen(3000);