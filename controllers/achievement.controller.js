const db = require('../db')

class achievementController{
    async getAchievements(req, res){
        const achievements = await db.query('SELECT * FROM achievements');
        console.log(achievements.rows);
        res.send('rows')
    }
    async updateCabbage(req,res){

    }
    async updateCarrot(req,res){
        
    }
    async updatePots(req,res){
        
    }
}

module.exports = new achievementController;