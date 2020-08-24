var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

const HOST = 'localhost'
const PORT = 8080;


fs.readFile('../HTML/index.html', function (err, html) {

    if (err) throw err;
    console.log("Server is listening on " + HOST + ":" + PORT);

    http.createServer(function(req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        console.log(query);
        var parsedQuery = querystring.stringify(query);
        fs.appendFile('data.txt', parsedQuery + "\n", (err) => {
            if (err) throw err;
        });
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();

    }).listen(PORT, HOST);

});