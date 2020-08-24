var http = require('http');
var fs = require('fs');

const HOST = 'localhost'
const PORT = 8080;

const option = {
    method: 'GET'
}

function GET_() {
    const req = http.request(option, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', data => {
            process.stdout.write(data)
        });
    });
    req.on('error', error => {
        console.error(error)
      })
}


fs.readFile('../HTML/index.html', function (err, html) {

    if (err) throw err;

    console.log("Server is listening on " + HOST + ":" + PORT);
    http.createServer(function(req, res) {
        GET_();
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    }).listen(PORT, HOST);
});