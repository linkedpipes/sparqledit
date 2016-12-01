var fs = require('fs');

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

module.exports.getFilesTree = getFilesTree;