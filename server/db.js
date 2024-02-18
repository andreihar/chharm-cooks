const { Pool } = require('pg');

require('dotenv').config();

console.log(process.env.DB_PASS);

const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
});

const helpers = {
	// init: async function() {
    //     const q = 'CREATE TABLE IF NOT EXISTS people(id SERIAL PRIMARY KEY, name VARCHAR(50), age INT, instructor BOOLEAN)'
    //     const res = await pool.query(q)
    // },

    getUsers: async function() {
        const res = await pool.query('SELECT * FROM accounts')
        return res.rows
    },

	addUser: async function(username, password) {
        const q = 'INSERT INTO accounts(username, password) VALUES($1, $2)'
        const res = await pool.query(q, [username, password])
    },

    // deleteById: async function(id) {
    //     const q = 'DELETE FROM people WHERE id = $1'
    //     const res = await pool.query(q, [id])
    // },

    // uploadFile: async function(filename, pic) {
    //     const q = 'INSERT INTO pics(filename, pic) VALUES($1, $2)'
    //     const res = await pool.query(q, [filename, pic])
    // },

    // getImage: async function(id) {
    //     const res = await pool.query('SELECT * FROM pics where pid=$1',[id])
    //     return res.rows[0]
    // }
}

module.exports = { helpers }

// const createTblQry = `CREATE TABLE accounts (
// 	user_id serial PRIMARY KEY,
// 	username VARCHAR (50) UNIQUE NOT NULL,
// 	password VARCHAR (50) NOT NULL
// );`

// pool.query("CREATE DATABASE login;").then((res) => {
// 	console.log(res);
// 	console.log("Database created successfully");
// }).catch((err) => {
// 	console.log(err);
// })

// pool.query(createTblQry).then((res) => {
// 	console.log("Table created successfully");
// 	console.log(res);
// }).catch((err) => {
// 	console.log(err);
// })

// module.exports = pool;