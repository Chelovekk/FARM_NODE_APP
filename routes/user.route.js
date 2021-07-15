const{Router} = require('express')
const router = Router()
const userController = require('../controllers/user.controller')

router.post ('/user', userController.createUser);
router.get ('/user/:id', userController.getOneUser);
router.delete ('/user/:id', userController.deleteUser);
router.get ('/allusers', userController.getAllUsers);


module.exports = router