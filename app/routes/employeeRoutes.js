const express = require('express');
const router = express.Router();
const { getAllEmployees } = require('../controller/employeeController');

router.get('/', getAllEmployees);  

module.exports = router;
