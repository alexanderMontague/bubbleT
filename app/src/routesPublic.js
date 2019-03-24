'use strict';

const router = require('express').Router();
const { home, salary } = require('./controllers');

router.route('/test').get(salary.testSalaryData);
router.route('/salaryData').get(salary.fullSalaryData);
router.route('/queryData').get(salary.querySalaryData);

module.exports = router;
