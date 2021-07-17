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
        try {
            const {ach_id} = req.body;
            const {user_id} = req.body;
            const {progress_increasing} = req.body;

            const ach_progress = await db.query(`SELECT progress FROM user_achievement_progress WHERE user_id = $1 AND ach_id=$2`, [user_id, ach_id]);
            // console.log(ach_progress)
            const goal = await db.query('SELECT goal from achievementgoals WHERE ach_id = $1', [ach_id])
            if(ach_progress.rows[0].comleted) {
                res.send('achievement completed')
                return
            }else if(ach_progress.rows.length){
                let increased = parseInt(ach_progress.rows[0].progress) + parseInt(progress_increasing);
                let completed  = increased >= goal.rows[0].goal ? true : false;
                const updateAch = await db.query('UPDATE user_achievement_progress set progress=$1, comleted=$2 where user_id = $3 AND ach_id = $4 RETURNING *', [increased,completed, user_id, ach_id]);
                res.send(updateAch)
            }else{
                let completed  = progress_increasing >= goal.rows[0].goal ? true : false;
                const newAch = await db.query('INSERT INTO user_achievement_progress (user_id, ach_id, progress, comleted) values ($1, $2, $3, $4) RETURNING *', [user_id, ach_id, progress_increasing, completed]);
                res.send(newAch)                
            }
        } catch (e) {
            res.send("somethings gone wrong ",e)
        }
    }
    async getAllAchievementProgress(req,res){
        //зделать фильтер для поиска goal
        const {user_id} = req.body;
        const ach = await db.query(`SELECT * FROM achievement`);
        const goal = await db.query(`SELECT * FROM achievementgoals`);
        const progress = await db.query(`SELECT * FROM user_achievement_progress WHERE user_id = $1`, [user_id]);
        var resultMass = [];
            for(let i = 0; i<ach.rows.length;i++){
                // console.log(ach.rows[i])
                let someProgressOfAchievements = (progress.rows.filter(x=>x.ach_id == ach.rows[i].id));
                let someGoalOfAchievements = (goal.rows.filter(x=>x.ach_id == ach.rows[i].id));
                if(someProgressOfAchievements.length){
                    resultMass.push({
                        name: ach.rows[i].name,
                        progress: someProgressOfAchievements[0].progress,
                        completed: someProgressOfAchievements[0].comleted,
                        goal:someGoalOfAchievements[0].goal,
                    })
                    
                } else{
                    console.log(5)
                }
            }
            
            
       

        res.send(resultMass)
    }
    async getAllAchievement(req, res){
        try {
            const ach = await db.query('SELECT * FROM achievement');
            const goal = await db.query(`SELECT * FROM achievementgoals`);
            const allAchievements = []
            for(let i = 0; i<ach.rows.length;i++){
                let someGoalOfAchievements = (goal.rows.filter(x=>x.ach_id == ach.rows[i].id));
                allAchievements.push({
                    id: ach.rows[i].id,
                    name: ach.rows[i].name,
                    goal:someGoalOfAchievements[0].goal
                })
            }

            res.json(allAchievements);
        } catch (e) {
            res.send(e)
        }
    }
    
    
}

module.exports = new achievementController;