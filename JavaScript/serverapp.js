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
var dataUtil = require('./data');
var multer = require('multer');
var querystring = require('querystring');
// var url = require('url');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("./"));
app.use(session({secret: 'cum', saveUninitialized: true, resave: true}));
app.set('views', path.join(__dirname, '/../HTML'));
app.use(express.static(__dirname + '/../HTML/'));
app.use(express.static(__dirname + '/uploads/'));
app.set('view engine', 'ejs');

console.log("PWD:" + __dirname);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });


app.get('/', (req, res) => {
    res.redirect('/form');
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/home.html'));
});

app.get('/prog', (req, res) => {
    res.render(path.join(__dirname + '/../HTML/prog.ejs'));
});

app.get('/marque', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/marque.html'));
});

app.get("/location", (req, res) => {
    const sql = "SELECT * FROM cars";
    db = dataUtil.__open_data(dataPath);
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(rows);
        res.render(path.join(__dirname + '/../HTML/location.ejs'), {data: {cars: rows}});
  });
});

app.get('/car', (req, res)=> {
    var getUrl = req.url;
    getNumb = getUrl.match(/\d+/g);
    const sql = "SELECT * FROM cars";
    db = dataUtil.__open_data(dataPath);
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(rows);
        res.render(path.join(__dirname + '/../HTML/car.ejs'), {data: {cars: rows, size: getNumb[0]}});
  });
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
        db = dataUtil.__open_data(dataPath);
        dataUtil.__insert_data_user(db, email, password);
        dataUtil.__db_close(db);
        res.redirect('/home');
    }
});

app.post('/send_car', upload.single('photo'), (req, res) => {
    try {
        const first = req.body.first;
        const last = req.body.name;
        const marque = req.body.marque;
        const modele = req.body.modele;
        const place = req.body.place;
        const porte = req.body.porte;
        const carburant = req.body.carburant;
        const lieu = req.body.lieu;
        const prix = req.body.prix;
        const filename = req.file.filename;
        const isAvailaible = 0;
        const id = req.body.id;
        db = dataUtil.__open_data(dataPath);
        dataUtil.__insert_data_cars(db, first, last, marque, modele, place, porte, carburant, lieu, prix, filename, isAvailaible);
        dataUtil.__db_close(db);
        res.redirect('/prog');
    } catch (error) {
        console.error(error);
    }
});


app.post('/louer', (req, res) => {
    try {
        var getUrl = req.url;
        let str = "";
        for (var i=0; i < getUrl.length; i++) {
            if (getUrl[i] >= '0' && getUrl[i] <= '9')
                str = getUrl[i];
        }
        const id = parseInt(str, 10) + 1;
        console.log(id);
        const isAvalaible = 1;
        db = dataUtil.__open_data(dataPath);
        dataUtil.__update_cars_table(db, id, isAvalaible);
        res.redirect('/location');
    } catch(error) {
        console.error(error);
    }
});
app.listen(PORT,console.log('App listening on localhost:'+ PORT));