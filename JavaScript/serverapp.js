const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
var path = require("path");
var dataPath = "../database/data.db";
const {check, validationResult} = require('express-validator');
var sqlite = require('sqlite3').verbose();
const session = require('express-session');
const util = require('util');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("./"));
app.use(session({secret: 'cum', saveUninitialized: true, resave: true}));
app.set('views', path.join(__dirname, '/../HTML'));
app.use(express.static(__dirname + '/../HTML/'));
app.set('view engine', 'ejs');

console.log("PWD:" + __dirname);

function __open_data(dataPath) {
    // open and create sqlite data base connexion
    let db = new sqlite.Database(dataPath, (err) => {
        if (err) return console.error("cannot connect to database error : " + err);
        console.log("connected to the data base");
    });
    return db;
}


//This function insert email and password into sqlite database
function __insert_data_user(db, email, password) {
    db.run(`INSERT INTO users (email, password) values ('${email}', '${password}')`, (err) =>{
        if (err) return console.error("Cannot insert into the TABLE" + err.message);
        console.log(email + "|" + password + " has been added to the data base");
    });
}

function _get_data_from(db, table) {
     db.each(`SELECT * FROM ${table}`, (err, row) => {
        console.log(row);
     });
     return row;
}

function __db_close(db) {
    db.close();
    console.log("Database has been closed with success");
}


app.get ('/', (req, res) => {
    res.redirect('/form');
});

app.get ('/form', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/index.html'));
});

app.get ('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/home.html'));
});

app.get('/prog', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/prog.html'));
});

app.get('/marque', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/marque.html'));
});

app.get('/location', (req, res) => {
    res.render(path.join(__dirname + '/../HTML/location.ejs'), {data : {test: ['Peugeot 208-Diesel', 'Peugeot 209-Diesel', 'Peugeot 210-Diesel', 'Peugeot 211-Diesel', 'Peugeot 212-Diesel']}});
    db = __open_data(dataPath);
    _get_data_from(db, "users");
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/contact.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/profile.html'));
});

app.post('/submit_form', [
    check('email').isEmail().trim().withMessage('Email is not valid'),
    check('password').isLength({min : 5}).trim().withMessage('Password must be 5 character length')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        res.redirect('/form');
    } else {
        const email = req.body.email;
        const password = req.body.password;
        db = __open_data(dataPath);
        __insert_data_user(db, email, password);
        __db_close(db);
        res.redirect('/home');
    }
});

app.post('/submit_prog', (req, res) => {
    console.log("en cours");
});

app.listen(PORT,console.log('App listening on localhost:'+ PORT));