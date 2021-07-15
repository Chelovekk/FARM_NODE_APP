const{Router} = require('express')
const router = Router()
const achievementController = require('../controllers/achievement.controller')

router.get ('/achievement', achievementController.getAchievements);

module.exports = router
