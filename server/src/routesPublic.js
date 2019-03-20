'use strict';

const router = require('express').Router();
const { home } = require('./controllers');

router.route('/test').get(home.test);

module.exports = router;
