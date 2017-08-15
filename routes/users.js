const router = require('koa-router')();
let util = require('../libs/util');
let User = require('../models/user');
let commonError = require('../libs/error');
let security = require('../libs/security');
router.prefix('/users');




module.exports = router;
