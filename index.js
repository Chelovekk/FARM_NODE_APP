const express = require('express')
const config = require('config')
const app = express()
const router = require('./routes/user.route')

app.use('/api', router)

app.listen(3000, ()=> console.log(`started on ...`))
