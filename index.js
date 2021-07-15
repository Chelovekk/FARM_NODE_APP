const { json } = require('express')
const express = require('express')
const app = express()
const router = require('./routes/user.route')

app.use(json())

app.use('/api', router)

app.listen(3000, ()=> console.log(`started on ...`))
