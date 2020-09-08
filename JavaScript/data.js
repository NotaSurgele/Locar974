var sqlite = require('sqlite3').verbose();
var querystring = require('querystring');

module.exports = {
    __open_data: function (dataPath) {
        // open and create sqlite data base connexion
        let db = new sqlite.Database(dataPath, (err) => {
            if (err) return console.error("cannot connect to database error : " + err);
            console.log("connected to the data base");
        });
        return db;
    },

    //This function insert email and password into sqlite database
    __insert_data_user: function (db, email, password) {
        db.run(`INSERT INTO users (email, password) values ('${email}', '${password}')`, (err) =>{
            if (err) return console.error("Cannot insert into the TABLE" + err.message);
            console.log(email + "|" + password + " has been added to the data base");
        });
    },

    __db_close: function (db) {
        db.close();
        console.log("Database has been closed with success");
    },

    __insert_data_cars: function (db, firstname, lastname, marque, modele, place, porte, carburant, lieu, prix, filename, isAvailable) {
        db.run(`INSERT INTO cars (firstname, lastname, marque, modele, place, porte, carburant, lieu, prix, filename, isAvailable) values ('${firstname}', '${lastname}', '${marque}', '${modele}', '${place}', '${porte}', '${carburant}', '${lieu}', '${prix}', '${filename}', '${isAvailable}')`, (err) =>{
            if (err) return console.error("Cannot insert into the TABLE" + err.message);
            console.log(`('${firstname}', '${lastname}', '${marque}', '${modele}', '${place}', '${porte}', '${carburant}', '${lieu}', '${prix}', '${filename}' added to the cars tables car is available`);
        });
    },
    __update_cars_table: function (db, id ,isAvailable, date) {
        db.run(`UPDATE cars SET isAvailable = '${isAvailable}' WHERE id = '${id}'`);
        console.log(`car id:'${id}' has been changed`);
    }
};