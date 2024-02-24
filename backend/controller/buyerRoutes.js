const express = require('express')
const {registerUser, loginUser, registerFace, myPayment, blockPayment, getBalance, confirmPayment} = require('./buyerController')
const {protect} = require('../middlewear/authMiddleware')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const buyerRoutes = express.Router()

buyerRoutes.route('/signup').post(registerUser)
buyerRoutes.route('/login').post(loginUser)
buyerRoutes.route('/registerface').post(protect, upload.single('fileContent'), registerFace)
buyerRoutes.route('/getbalance').post(protect, getBalance)
buyerRoutes.route('/mypayments').post(protect, myPayment)
buyerRoutes.route('/blockpayment').post(blockPayment)
buyerRoutes.route('/confirmpayment').post(confirmPayment)


module.exports= buyerRoutes



