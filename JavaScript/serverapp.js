const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
var path = require("path");
var dataPath = "../database/data.db";
const {check, validationResult} = require('express-validator');
const data = "../database/data.db";
var sqlite = require('sqlite3').verbose();

function __open_data(dataPath) {
    // open and create sqlite data base connexion
    let db = new sqlite.Database(dataPath, (err) => {
        if (err) return console.error("cannot connect to database error : " + err);
        console.log("connected to the data base");
    });
    return db;
}

//This function insert email and password into sqlite database
function __insert_data(db, email, password) {
    db.run(`INSERT INTO users (email, password) values ('${email}', '${password}')`, (err) =>{
        if (err) return console.error("Cannot insert into the TABLE" + err.message);
    });
}

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
        db = __open_data(dataPath);
        __insert_data(db, email, password);
        console.log(email + " " + password + " has been added to the data base");
        db.close();
        res.send("formulaire envoté avec l'adresse : " + email + " et comme mdp :" + password);
    }
});

app.get ('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/test.html'), function (err) {
        if (err) throw err;
    });
});

app.listen(PORT,console.log('App listening on localhost:'+ PORT));