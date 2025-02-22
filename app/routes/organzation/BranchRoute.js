const express=require('express')
const router=express.Router()
const BranchController=require('../../controller/organzation/BranchController') 
const auth=require('../../middleware/auth')


router.post('/new',BranchController.NewBranch)
router.get('/all',BranchController.AllBranch)
router.get('/:id', BranchController.GetBranchById)
router.patch('/:id', BranchController.UpdateBranch)

module.exports=router