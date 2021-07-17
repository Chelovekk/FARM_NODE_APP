const db = require('../db')

class achievementController{
    async createAchievement(req,res){
        try{
            const {achName} = req.body
            const {goal} = req.body
            const newAch = await db.query('INSERT INTO achievement (name) values ($1) RETURNING *', [achName])
            console.log(newAch.rows[0].id)
            const newGoal = await db.query('INSERT INTO achievementgoals (goal, ach_id) values ($1, $2) RETURNING *', [goal, newAch.rows[0].id])
            console.log(newGoal.rows)
            res.send('ok')
        }catch(e){
            res.send(e)
        }
       
    }

    async getAchievement(req, res){
        const {ach_id} = req.body;
        const ach = await db.query(`SELECT name FROM achievement WHERE id = $1`, [ach_id]);
        const goal = await db.query(`SELECT goal FROM achievementgoals WHERE ach_id = $1`, [ach_id]);
   
    res.send({
        ach_name: ach.rows[0].name,
        ach_goal: goal.rows[0].goal
    })
    }
    async getAchievementProgress(req,res){
        //зделать проверки
        
        try{
            const {ach_id} = req.body;
            const {user_id} = req.body;
            const ach = await db.query(`SELECT name FROM achievement WHERE id = $1`, [ach_id]);
                // console.log(ach)
            const goal = await db.query(`SELECT goal FROM achievementgoals WHERE ach_id = $1`, [ach_id]);
            const progress = await db.query(`SELECT progress, comleted FROM user_achievement_progress WHERE user_id = $1 AND ach_id=$2`, [user_id, ach_id]);
            if(progress.rows.length){
                var progresInfo = progress.rows[0].progress;
            }else{
                var progresInfo = 0;
            }
            const sendInfo = {
                ach_name: ach.rows[0].name,
                ach_goal: goal.rows[0].goal,
                ach_progress: progresInfo,
                ach_completed: progress.rows[0].comleted

            }
            res.send(sendInfo);
        }catch(e){
            res.send(e);
        }
    }
    async increaseAchievementProgress(req,res){
        //add achievement cheking
        //зделать проверки
//добавить проверку на выполнение
        try {
            const {ach_id} = req.body;
            const {user_id} = req.body;
            const {progress_increasing} = req.body;

            const ach_progress = await db.query(`SELECT progress FROM user_achievement_progress WHERE user_id = $1 AND ach_id=$2`, [user_id, ach_id]);
            // console.log(ach_progress)
            const goal = await db.query('SELECT goal from achievementgoals WHERE ach_id = $1', [ach_id])
            if(ach_progress.rows.length){
                let increased = parseInt(ach_progress.rows[0].progress) + parseInt(progress_increasing);
                const updateAch = await db.query('UPDATE user_achievement_progress set progress=$1 where user_id = $2 AND ach_id = $3  RETURNING *', [increased, user_id, ach_id]);
                res.send(updateAch)
            }else{
                
                const newAch = await db.query('INSERT INTO user_achievement_progress (user_id, ach_id, progress) values ($1, $2, $3) RETURNING *', [user_id, ach_id, progress_increasing]);
                res.send(newAch)
            }
        } catch (e) {
            console.log('errre')
            res.send(e)
        }
    }
    async getAllAchievementProgress(req,res){
        //зделать фильтер для поиска goal
        const {user_id} = req.body;
        const ach = await db.query(`SELECT * FROM achievement`);
        const progress = await db.query(`SELECT * FROM user_achievement_progress WHERE user_id = $1`, [user_id]);
        var resultMass = [];
            for(let i = 0; i<ach.rows.length;i++){
                // console.log(ach.rows[i])
                let someProgressOfAchievements = (progress.rows.filter(x=>x.ach_id == ach.rows[i].id));
                // console.log(massWithOneEntry)
                if(massWithOneEntry.length){
                    resultMass.push({
                        name: ach.rows[i].name,
                        progress: someProgressOfAchievements[0].progress,
                        completed: someProgressOfAchievements[0].comleted
                    })
                    
                } else{
                    console.log(5)
                }
            }
            
            
       

        res.send(resultMass)
    }
    async getAllAchievement(req, res){
        try {
            const achievements = await db.query('SELECT * FROM achievement');
            res.json(achievements.rows);
        } catch (e) {
            res.send(e)
        }
    }
    
    
}

module.exports = new achievementController;