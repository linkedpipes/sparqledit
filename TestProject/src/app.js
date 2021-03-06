var http = require("http");
var fs = require("fs");

const defaultPort = 80;

function createHttpHeaders(url) {
    var isHtml = url.match(/\.html$/);
    var isJson = url.match(/\.json$/);

    var httpHeaders = {
        "Access-Control-Allow-Origin": "*"
    };
    if (isHtml) {
        httpHeaders["Content-Type"] = "text/html; charset=utf-8";
    }
    if (isJson) {
        httpHeaders["Content-Type"] = "application/json; charset=utf-8";
    }
    return httpHeaders;
}

function getPort() {
    try {
        var port = parseInt(process.argv[2]);
        return isNaN(port) ? defaultPort : port;
    }
    catch (ex) {
        return defaultPort;
    }
}

function ControlerResponse(code, content) {
    this.code = code;
    this.content = content;
}

function simpleController(url) {
    if (url == "/") {
        url = "/index.html";
    }

    try {
        var urlContent = fs.readFileSync(__dirname + "/../content" + url).toString();
        return new ControlerResponse(200, urlContent);
    }
    catch (ex) {
        return new ControlerResponse(404, "Not found.");
    }
}

var server = http.createServer((req, res) => {
    var response = simpleController(req.url);
    res.writeHead(response.code, createHttpHeaders(req.url));
    res.end(response.content);
})

server.listen(getPort());