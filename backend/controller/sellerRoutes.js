const express = require('express')
const { createPayment, findUser} = require('./sellerController')
const {protect} = require('../middlewear/authMiddleware')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const sellerRoutes = express.Router()


sellerRoutes.route('/finduser').post(upload.single('fileContent'), findUser)
sellerRoutes.route('/createpayment').post(protect, createPayment)

module.exports= sellerRoutes



