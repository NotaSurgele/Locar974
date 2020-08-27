const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
var path = require("path");
const {check, validationResult} = require('express-validator');

var sqlite = require('sqlite3').verbose();

// open and create sqlite data base connexion
let db = new sqlite.Database('../database/data.db', (err) => {
    if (err) return console.error("cannot connect to database error : " + err);

    console.log("connected to the data base");
});

console.log("PWD:" + __dirname);

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("../HTML/Pic"));
app.use(express.static("../HTML"));
app.use(express.static("/"));

app.get ('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/index.html'), function (err) {
        if (err) throw err;
    });
});

app.post('/submit_form', [
    check('email').isEmail(),
    check('password').isLength({min : 5})
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email + ' ' + password);
        db.run(`INSERT INTO users (email, password) values ('${email}', '${password}')`, (err) =>{
            if (err) return console.error("Cannot insert into the TABLE" + err.message);
        });
        console.log(email + " " + password + " has been added to the data base");
        // db.close();
        res.send("formulaire envoté avec l'adresse : " + email + " et comme mdp :" + password);
    }
});

app.get ('/new', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/test.html'), function (err) {
        if (err) throw err;
    });
});
app.listen(PORT,console.log('App listening on localhost:'+ PORT));