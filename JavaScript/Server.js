var http = require('http');
var fs = require('fs');

const HOST = 'localhost'
const PORT =8080;

fs.readFile('../HTML/index.html', function (err, html) {

    if (err) throw err;

    console.log("Server is listening on " + HOST + ":" + PORT);
    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(PORT, HOST);
});