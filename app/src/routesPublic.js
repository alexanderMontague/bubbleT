'use strict';

const router = require('express').Router();
const { home, salary } = require('./controllers');

router.route('/test').get(home.test);
router.route('/salaryData').get(salary.fullSalaryData);

module.exports = router;
