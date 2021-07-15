const Pool = require('pg').Pool
const pool = new Pool({
    user : 'postgres',
    password : 'fizmat',
    port : 5432,
    host : 'localhost',
    database : 'farm_db'
})

module.exports = pool