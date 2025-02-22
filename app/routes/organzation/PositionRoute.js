const express=require('express')
const router=express.Router()
const PositionController=require('../../controller/organzation/PositionController') 
const auth=require('../../middleware/auth')


router.post('/new',PositionController.NewPostion)
router.get('/all',PositionController.AllPosition)
router.get('/find',PositionController.FindPosition)
router.get('/:id', PositionController.GetPosition)
router.patch('/:id', PositionController.UpdatePosition)

module.exports=router