const{Router} = require('express')
const router = Router()
const achievementController = require('../controllers/achievement.controller')

router.post ('/achievementcreate', achievementController.createAchievement);
router.post ('/achievementget', achievementController.getAchievement);
router.post ('/achievementgetprogres', achievementController.getAchievementProgress);
router.get ('/achievementall', achievementController.getAllAchievement);
router.post ('/achievementincrease', achievementController.increaseAchievementProgress);
router.post ('/achievementallprogress', achievementController.getAllAchievementProgress);





module.exports = router
