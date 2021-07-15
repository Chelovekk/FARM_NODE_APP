const db = require('../db')

class userController{
    async createUser(req, res){
        const {userName} = req.body;
        const newUser = await db.query('INSERT INTO usertable (username) values ($1) RETURNING *', [userName]);
        console.log(userName);
        res.json(userName);
    }
    
    async getOneUser(req,res){
        const id  = req.params.id;
        console.log(id)
        const user = await db.query('SELECT * FROM usertable where id = $1', [id])
        res.send(user.rows )
    }
    async deleteUser(req, res){
        const id  = req.params.id;
        const user = await db.query('DELETE FROM usertable where id = $1', [id])
        console.log(id)
        res.send(`deleted ${user.rows}`)
    }
    async getAllUsers(req, res){
        const users = await db.query('SELECT * FROM usertable');
        console.log(users);
        res.json(users.rows);

    }
}

module.exports = new userController;