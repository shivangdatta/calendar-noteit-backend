const express = require('express')
const router = express.Router()
const {loginHandler , logoutHandler} = require('../controllers/authController')
const { verifyFirebaseToken } = require('../middleware/authorization')

router.route('/')
    .post(verifyFirebaseToken , loginHandler)
    .get(logoutHandler)

module.exports = router
