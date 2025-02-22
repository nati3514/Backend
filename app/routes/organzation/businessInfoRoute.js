const express=require('express')
const router=express.Router()
const BusinessInfoController=require('../../controller/organzation/BusinessInfoController') 
const auth=require('../../middleware/auth')

router.post('/update',BusinessInfoController.UpdateInfo)
router.get('/info',BusinessInfoController.GetInfo)

module.exports=router