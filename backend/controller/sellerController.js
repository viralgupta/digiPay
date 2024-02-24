const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Payment = require('../models/Payment')
const AWS = require('aws-sdk');
require('dotenv').config();



const findUser = asyncHandler(async (req, res) => {
    try {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.ACCESS_SECRET,
            region: 'ap-south-1'
        })
        
        const rekognition = new AWS.Rekognition()
        
        rekognition.listCollections((err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!data.CollectionIds.includes(process.env.FACE_COLLECTION)) {
                console.log("Coudnt find collection")
                return;
            }
            
            rekognition.searchUsersByImage({
                "CollectionId": process.env.FACE_COLLECTION,
                "Image": {
                    "Bytes": req.file.buffer
                },
                "MaxUsers": 1,
                "UserMatchThreshold": 95
            }, async (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (data.UserMatches.length > 0) {
                    const user = await User.findById(data.UserMatches[0].User.UserId)
                    if (!user) {
                        res.status(200).json({ success: false, message: "No User found!" });
                        return;
                    }
                    res.status(200).json({ success: true, user: user });
                }
                else {
                    res.status(200).json({ success: false, message: "No User found!" });
                    return;
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
})

const createPayment = asyncHandler(async (req, res) => {
    const {id, buyerId, reason, amount} = req.body;
    if (!id || !buyerId) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const buyer = await User.findById(buyerId)
    if(!buyer) {
        res.status(400).json({success: false, message: "No User exists with this id"})
        return;
    }
    if(amount > buyer.balance){
        res.status(400).json({success: false, message: "User balance is not sufficient!"})
        return;
    }
    else{
        const payment = await Payment.create({
            seller: id,
            buyer: buyerId,
            payedAt: Date(),
            amount: amount,
            reason: reason
        })
        const seller = await User.findById(id)
        const postData = {
            payid: payment._id,
            amount: amount,
            seller: seller.name,
            reason: reason
        };
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        };
        await fetch("http://localhost:8001/api/sendmessage", requestOptions);
        res.status(200).json({success: true, payment})
    }    
})


module.exports = { createPayment, findUser }