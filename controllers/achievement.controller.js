const db = require('../db')

class achievementController{

    // api/achievementcreate
    async createAchievement(req,res){
        try{
            //получение данных из тела
            const {achName} = req.body
            const {goal} = req.body
            //запись даннх в таблицы данных из таблиц 
            const newAch = await db.query('INSERT INTO achievement (name) values ($1) RETURNING *', [achName])
            const newGoal = await db.query('INSERT INTO achievementgoals (goal, ach_id) values ($1, $2) RETURNING *', [goal, newAch.rows[0].id])
            res.send('created')
        }catch(e){
            res.send(e)
        }
       
    }
    async getAchievement(req, res){
         //получение данных из тела
        const {ach_id} = req.body;

        //получение даннх в таблицы данных из таблиц 
        const data  = await db.query('SELECT pp.name, p.goal  FROM  achievement pp   JOIN achievementgoals p ON p.ach_id=pp.id where pp.id=$1', [ach_id]);
        
        res.send(data)
   
    }

    // api/achievementall
    async getAllAchievement(req, res){
        try {
        const allAchievements  = await db.query('SELECT pp.*, p.goal  FROM  achievement pp   JOIN achievementgoals p ON p.ach_id=pp.id ;');
        res.json(allAchievements);

        } catch (e) {
            res.send(e)
        }
    }

//   api/achievementincrease
    async increaseAchievementProgress(req,res){
        // try {
         //получение данных из тела
            const {ach_id} = req.body;
            const {user_id} = req.body;
            const {progress_increasing} = req.body;

             //получение даннх в таблиц данных из таблиц 
            const ach_progress_goal = await db.query('SELECT pp.progress, pp.completed, p.goal FROM user_achievement_progress pp JOIN achievementgoals p ON p.ach_id=pp.ach_id WHERE pp.ach_id=$1 and pp.user_id =$2', [ach_id, user_id])
            //проверка и создание данных для отправки
            if(ach_progress_goal.rows.length && ach_progress_goal.rows[0].completed) {
                res.send('achievement completed')
                return
            } else if(ach_progress_goal.rows.length){
                
                let increased = parseInt(ach_progress_goal.rows[0].progress) + parseInt(progress_increasing);
                let completed  = increased >= ach_progress_goal.rows[0].goal ? true : false;
                const updateAch = await db.query('UPDATE user_achievement_progress set progress=$1, completed=$2 where user_id = $3 AND ach_id = $4 RETURNING *', [increased,completed, user_id, ach_id]);
                res.send(updateAch)
            }else{
                let completed  = progress_increasing >= ach_progress_goal.rows[0].goal ? true : false;
                const newAch = await db.query('INSERT INTO user_achievement_progress (user_id, ach_id, progress, completed) values ($1, $2, $3, $4) RETURNING *', [user_id, ach_id, progress_increasing, completed]);
                res.send(newAch)                
            }
        // } catch (e) {
        //     res.send("somethings gone wrong ")
        // }
    }
    // api/achievementgetprogres
    async getAchievementProgress(req,res){        
        try{
         //получение данных из тела
            const {ach_id} = req.body;
            const {user_id} = req.body;
           
            //получение даннх в таблиц данных из таблиц 
            const ach = await db.query(`SELECT name FROM achievement WHERE id = $1`, [ach_id]);
            const goal = await db.query(`SELECT goal FROM achievementgoals WHERE ach_id = $1`, [ach_id]);

            const progress = await db.query(`SELECT progress, completed FROM user_achievement_progress WHERE user_id = $1 AND ach_id=$2`, [user_id, ach_id]);
       
            //проверка и создание данных для отправки
            if(progress.rows.length){
                var progresInfo = progress.rows[0].progress;
                var completed = progress.rows[0].completed;
            }else{
                var progresInfo = 0;
                var completed = false;

            }
            const sendInfo = {
                ach_name: ach.rows[0].name,
                ach_goal: goal.rows[0].goal,
                ach_progress: progresInfo,
                ach_completed: completed

            }
            res.send(sendInfo);
        }catch(e){
            res.send(e);
        }
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
}

module.exports = new achievementController;