const express=require('express')
const router=express.Router()

//organzation routes
const businessInfoRoute=require('./organzation/businessInfoRoute')
const BranchRoute=require('./organzation/BranchRoute')
const DepartmentRoute=require('./organzation/DepartmentRoute')
const PositionRoute=require('./organzation/PositionRoute')
const employeeRoutes = require('./employeeRoutes')

//report route
const reportRoutes=require('./report/reportRoutes')
const dailyReportRoutes = require('./report/dailyReportRoutes')

//auth
const AuthRoute=require('./AuthRoute')

router.use('/auth',AuthRoute)

router.use('/organzation/business',businessInfoRoute)
router.use('/organzation/branch',BranchRoute)
router.use('/organzation/department',DepartmentRoute)
router.use('/organzation/position',PositionRoute)
router.use('/employee', employeeRoutes) 

router.use('/reports', reportRoutes);
router.use('/reports/daily', dailyReportRoutes)


module.exports=router
