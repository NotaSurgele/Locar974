const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
var path = require("path");

app.use(bodyParser.urlencoded({extended : false}));

app.get ('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/index.html'), function (err) {
        if (err) throw err;
    });
});

app.get('/submit_form', function(req, res) {
    console.log(req.query);
});

app.get ('/test', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/test.html'), function (err) {
        if (err) throw err;
    });
});

app.listen(PORT,console.log('App listening on ', +PORT));