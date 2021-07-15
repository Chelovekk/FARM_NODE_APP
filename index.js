const { json } = require('express');
const express = require('express');
const app = express();
const userRouter = require('./routes/user.route');
const achievementRouter = require('./routes/achievement.route');
const events = require('events');

var emit = new events.EventEmitter();


app.use(json());

app.use('/api', userRouter);
app.use('/api', achievementRouter);


app.listen(3000, ()=> console.log(`started on ...`));
