const db = require('../db');

class userController{
    async createUser(req, res){
        try{
            const {userName} = req.body;
            const a = await db.query(`SELECT username FROM usertable WHERE username = $1`, [userName]);
            if(a.rows.length){
                res.send('nik zanyat');
            } else {
                const newUser = await db.query('INSERT INTO usertable (username) values ($1) RETURNING *', [userName]);
                res.send('good');
            }
        } catch(e){
            res.send(e)
        }
    }
        
    async getOneUser(req,res){
        const id  = req.params.id;
        console.log(id);
        const user = await db.query('SELECT * FROM usertable WHERE id = $1', [id]);
        res.send(user.rows );
    }
    async deleteUser(req, res){
        const id  = req.params.id;
        const user = await db.query('DELETE FROM usertable WHERE id = $1', [id]);
        console.log(id);
        res.send(`deleted ${user.rows}`);
    }
    async getAllUsers(req, res){
        const users = await db.query('SELECT * FROM usertable');
        console.log(users);
        res.json(users.rows);

    }
}

module.exports = new userController;