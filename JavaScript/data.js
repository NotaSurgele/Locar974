var sqlite = require('sqlite3').verbose();

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

    _get_data_from: function(db, table) {
        let row;
        db.each(`SELECT * FROM ${table}`, (err, row) => {
            console.log(row);
            return row;
         });
    },

    __db_close: function (db) {
        db.close();
        console.log("Database has been closed with success");
    },

    __file_upload: function (req, res) {
        if (req.files) {
            console.log(req.files);
            var file = req.files.photo
            var filename = file.name;
            console.log(filename);

            file.mv('./uploads/' + filename, (err) => {
                if (err) return res.send(err);
                else console.log('File Uploaded');
            });
        }
    }

};
