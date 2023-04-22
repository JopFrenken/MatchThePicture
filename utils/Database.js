/*   
|*   NodeJS MySQL helper class by Albert Lourensen (83350)
|*   
|*   Dependencies:
|*   - mysql
|*   - dotenv
*/   

const mysql = require('mysql');
const dotenv = require('dotenv');

// environment variables from env file
dotenv.config();

let conn;

// connect to database
const connect = async () => {
    conn = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
    })

    conn.connect(err => {
        if (err) {
            console.log()
            console.error('Unable to connect to MySQL database.')
            console.log()
            return
        } else {
            console.log()
            console.log('Connection to MySQL database established successfully.')
            console.log()
        }
    })
}

// query function
const query = async (sql) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    })
}

// database methods
const $ = {
    USER: {
        GET_ALL: async (name) => {
            let result = await query(`SELECT * FROM users ORDER BY seconds_left DESC LIMIT 3`)
            return result.length > 0 ? result : false
        },

        SEND_SCORE: async (data) => {
            let result = await query(`INSERT INTO users (name, seconds_left) VALUES ('${data.name}', '${data.time}')`)
        },
    },
    COUNTRIES: {
        GET_ALL: async () => {
            let result = await query('SELECT * FROM images');
            return result.length > 0 ? result : false
        }
    }
}

module.exports = {
    conn,
    connect,
    query,
    $
}