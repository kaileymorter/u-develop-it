//connect SQLite database
const sqlite3 = require('sqlite3').verbose();

//import express
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if(err) {
        return console.log(err.message);
    }
    console.log('Connected to the election database.');
});

//get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message})
            return;
        }

        res.json ({
            message: 'success',
            data: rows
        });
    });
});

//get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

//create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//                 VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.run(sql, params, function(err, result) {
//     if (err){
//         console.log(err);
//     }
//     console.log(result, this.lastID);
// })

//default response for any other request(not found) catch all
app.use((req, res) => {
    res.status(404).end();
});

//start server after DB connection
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});