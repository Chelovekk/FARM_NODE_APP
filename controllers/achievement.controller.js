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
        
        // try{
            const {ach_id} = req.body;
            const {user_id} = req.body;
            const ach = await db.query(`SELECT name FROM achievement WHERE id = $1`, [ach_id]);
                // console.log(ach)
            const goal = await db.query(`SELECT goal FROM achievementgoals WHERE ach_id = $1`, [ach_id]);
            const progress = await db.query(`SELECT progress, comleted FROM user_achievement_progress WHERE user_id = $1 AND ach_id=$2`, [user_id, ach_id]);
            if(progress.rows.length){
                var progresInfo = progress.rows[0].progress;
            }else{
                var progresInfo = 'no progres';
            }
            console.log(progress.rows[0])
            const sendInfo = {
                ach_name: ach.rows[0].name,
                ach_goal: goal.rows[0].goal,
                ach_progress: progresInfo 
            }
            res.send(sendInfo);
        // }catch(e){
        //     res.send(e);
        // }
    }
    async increaseAchievementProgress(req,res){
        // add achievement cheking
        // try {
            const {ach_id} = req.body;
            const {user_id} = req.body;
            const ach_completed = await db.query(`SELECT * FROM user_achievement_progress WHERE user_id = $1 AND ach_id=$2`, [user_id, ach_id]);
            const ach_progress = await db.query(`SELECT progress FROM user_achievement_progress WHERE user_id = $1 AND ach_id=$2`, [user_id, ach_id]);
            const goal = await db.query('SELECT goal from achievementgoals WHERE ach_id = $1', [ach_id])

            const {progress_increasing} = req.body;

            // const goal = await db.query('SELECT goal from achievementgoals WHERE ach_id = $1', [ach_id])
            
            if(ach_completed.rows.length){
                res.send('already completed');
                return
            }


            if(ach_progress.rows.length){
                let increased = parseInt(ach_progress.rows[0].progress) + parseInt(progress_increasing);
                // let completed  = increased >= goal.rows[0].goal ? true : false;
                if (increased >= goal.rows[0].goal){
                    await db.query('DELETE FROM  user_achievement_progress where user_id = $1 AND ach_id = $2', [user_id, ach_id]);
                    await db.query('INSERT INTO  user_achievement_completed   (user_id, ach_id) values($1,$2)', [user_id, ach_id]);
    
                }else{
                    await db.query('UPDATE user_achievement_progress set progress=$1 where user_id = $3 AND ach_id = $4  ', [increased, user_id, ach_id]);
                }

                res.send('obnovleno')
            }else{
                // let completed  = progress_increasing >= goal.rows[0].goal ? true : false;
                if (progress_increasing >= goal.rows[0].goal){
                    await db.query('INSERT INTO  user_achievement_completed  (user_id, ach_id) values($1,$2)', [user_id, ach_id]);
    
                }else{
                    await db.query('INSERT INTO user_achievement_progress (user_id, ach_id, progress) values ($1, $2, $3)', [user_id, ach_id, progress_increasing]);
                }
                res.send('sozdano')
            }
        // } catch (e) {
        //     console.log('errre')
        //     res.send(e)
        // }
    }
    async getAllAchievementProgress(req,res){
        //зделать фильтер для поиска goal
        const {user_id} = req.body;
        const ach = await db.query(`SELECT * FROM achievement`);
        const goal = await db.query(`SELECT * FROM achievementgoals`);
        console.log(goal)
        const progress = await db.query(`SELECT * FROM user_achievement_progress WHERE user_id = $1`, [user_id]);
        var resultMass = [];
            for(let i = 0; i<ach.rows.length;i++){
                let someProgressOfAchievements = (progress.rows.filter(x=>x.ach_id == ach.rows[i].id));
                let someGoalOfAchievements = (goal.rows.filter(x=>x.ach_id == ach.rows[i].id));

                if(someProgressOfAchievements.length){
                    resultMass.push({
                        name: ach.rows[i].name,
                        goal:someGoalOfAchievements[0].goal,
                        progress: someProgressOfAchievements[0].progress,
                        completed: someProgressOfAchievements[0].comleted
                    })
                    
                } else{
                    resultMass.push({
                        name: ach.rows[i].name,
                        goal: someGoalOfAchievements[0].goal,
                        progress: "no progress",
                        completed: false
                    })

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
    async test(req,res){
        const ach_completed = await db.query(`SELECT * FROM user_achievement_completed WHERE user_id = $1 AND ach_id=$2 `, [2, 9]);

        res.send(ach_completed)
    }
    
    
}

module.exports = new achievementController;