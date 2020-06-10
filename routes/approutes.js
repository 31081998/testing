const express = require('express')
const { body } = require('express-validator')
const CommonController = require('../controllers/app/CommonController')
const router = express.Router()

router.post('/register', CommonController.register)
router.post('/verify-otp', CommonController.verifyOtp)
router.post('/login', CommonController.login)

module.exports = router