const Pool = require('pg').Pool
const poll = new Pool({
    user : 'postgres',
    password : 'fizmat',
    port : 5432,
    host : 'localhost',
    database : ''
})