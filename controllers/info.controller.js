const db = require('../db')

class infoController{
    async getInfo(req, res){
        
    }
    async updateCabbage(req, res){
        const {id} = req.body
        const cabbage = db.query('UPDATE info set cabage_total = $1, cabage_amount = $2 where user_id =$3', [])
    }
    async updateCarrot(req, res){
        
    }
    async updatePot(req, res){
        
    }
}

module.exports = new infoController;