const{Router} = require('express')
const router = Router()
const achievementController = require('../controllers/achievement.controller');

router.post ('/achievementcreate', achievementController.createAchievement);

//Получение отдельных достижений из блока.
router.post ('/achievementget', achievementController.getAchievement);
//Oбновление прогресса. Добавление значения к блоку достижений.
router.post ('/achievementincrease', achievementController.increaseAchievementProgress);
//Получение прогресса по каждому блоку достижений.
router.post ('/achievementgetprogres', achievementController.getAchievementProgress);
//Получение всех блоков достижений со значениями прогресса.
router.post ('/achievementallprogress', achievementController.getAllAchievementProgress);


router.get ('/achievementall', achievementController.getAllAchievement);




module.exports = router
