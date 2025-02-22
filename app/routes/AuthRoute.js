const express=require('express')
const router=express.Router()
const AuthController=require('../controller/AuthController') 
const auth=require('../middleware/auth')


router.post('/login',AuthController.Login)
router.post('/forget',AuthController.Forget)
router.get('/user',auth.authenticateToken,AuthController.IsAuth)

module.exports=router