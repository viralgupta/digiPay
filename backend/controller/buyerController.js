const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Payment = require('../models/Payment')
const generateToken = require('../config/generateToken')
require('dotenv').config();
const AWS = require('aws-sdk')

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    console.log(req.body)
    if (!name && !email && !password) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        res.status(400).json({ success: false, message: "User Already Exists! Please Login" });
    }
    else {
        const picture = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
        const user = await User.create({ name, email, password, picture })
        const userResponse = {
            ...user.toJSON(),
            password: undefined,
        };
        if (user) {
            const token = await generateToken(user._id)
            res.status(200).json({ success: true, message: "User Created Successfully! Redirecting...", token, user: userResponse });
        }
        else {
            res.status(400).json({ success: false, message: "Unable to create user!" });
        }
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email && !password) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const user = await User.findOne({ email: email });
    if (user) {
        if (await user.matchPassword(password)) {
            const token = await generateToken(user._id)
            const userResponse = {
                ...user.toJSON(),
                password: undefined,
            };
            res.status(200).json({ success: true, message: "Login successful", token, user: userResponse });
        }
        else {
            res.status(400).json({ success: false, message: "Invalid Credentials!" });
        }
    }
    else {
        res.status(400).json({ success: false, message: "Invalid Credentials!" });
    }
})

const myPayment = asyncHandler(async (req, res) => {
    if (!req.body.id) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const myPayments = await Payment.find(req.body.seller ? { seller : req.body.id } : {buyer: req.body.id}).populate(req.body.seller ? { path : 'buyer', select: 'name picture'} :{ path: 'seller', select: 'name picture' });

    for (const payment of myPayments) {
        if (payment.hasConfirmed) {
            // Continue processing or do something with confirmed payments
        } else if (payment.hasBlocked) {
            await Payment.findByIdAndUpdate(payment._id, { hasFailed: true, hasConfirmed: true });
        } else if (payment.payedAt !== undefined && Date.now() - payment.payedAt.getTime() > process.env.TIME_LIMIT) {
            if (!payment.hasBlocked) {
                await Payment.findByIdAndUpdate(payment._id, { hasConfirmed: true });

                const buyer = await User.findById(payment.buyer);
                const seller = await User.findById(payment.seller);

                await User.findByIdAndUpdate(payment.buyer, { balance: buyer.balance - payment.amount });
                await User.findByIdAndUpdate(payment.seller, { balance: seller.balance + payment.amount });
            }
        }
    }

    const newPayments = await Payment.find(req.body.seller ? { seller : req.body.id } : {buyer: req.body.id}).populate(req.body.seller ? { path : 'buyer', select: 'name picture'} :{ path: 'seller', select: 'name picture' })
    newPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ myPayments: newPayments })
})

const getBalance = asyncHandler(async (req, res) => {
    if (!req.body.id) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const user = await User.findById(req.body.id);
    res.json({ success: true, balance: user.balance })
})

const blockPayment = asyncHandler(async (req, res) => {
    if (!req.body.paymentid) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const payment = await Payment.findById(req.body.paymentid)
    if (!payment) {
        res.status(400).json({ success: false, message: "No payment exists with this id" })
        return;
    }
    else if ((Date.now() - payment.payedAt.getTime()) > process.env.TIME_LIMIT) {
        res.status(200).json({ success: false, message: "Time limit exceeded!" })
        return;
    }
    if(payment.hasBlocked || payment.hasFailed){
        res.json({ success: false, message: "Payment already canceled!!!" })
        return;
    }
    if(payment.hasConfirmed){
        res.json({success: false, message: "Your payment is already confirmed!!!"})
    }
    else {
        const updatedPayment = await Payment.findByIdAndUpdate(req.body.paymentid, { hasBlocked: true })
        res.json({ success: true, updatedPayment })
        return;
    }
})

const confirmPayment = asyncHandler(async (req, res) => {
    console.log(req.body.paymentid)
    if (!req.body.paymentid) {
        res.json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const payment = await Payment.findById(req.body.paymentid)
    if (!payment) {
        res.json({ success: false, message: "No payment exists with this id" })
        return;
    }
    if(payment.hasBlocked || payment.hasFailed){
        res.json({ success: false, message: "Payment already canceled!!!" })
        return;
    }
    if(payment.hasConfirmed){
        res.json({success: false, message: "Your payment is already confirmed!!!"})
    }
    else {
        const updatedPayment = await Payment.findByIdAndUpdate(req.body.paymentid, { hasConfirmed: true })
        res.json({ success: true, updatedPayment})
        return;
    }
})

const registerFace = asyncHandler(async (req, res) => {
    const { id } = req.body;

    try {
        const user = await User.findById(id)
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.ACCESS_SECRET,
            region: 'ap-south-1'
        })

        const rekognition = new AWS.Rekognition();

        rekognition.listCollections(async (err, data) => {
            if (err) {
                res.status(500);
                return;
            }
            if (data.CollectionIds.includes(process.env.FACE_COLLECTION)) {
                if (!user.hasUserId) {
                    rekognition.createUser({
                        "CollectionId": process.env.FACE_COLLECTION,
                        "UserId": id
                    }, async (err, data) => {
                        if (err) {
                            res.status(400);
                            return;
                        }
                        rekognition.indexFaces({
                            Image: {
                                "Bytes": req.file.buffer
                            },
                            CollectionId: process.env.FACE_COLLECTION,
                            MaxFaces: 1,
                            QualityFilter: "AUTO",
                            // ExternalImageId: (booking._id).toString().concat(".png")
                        }, async (err, data) => {
                            if (err) {
                                res.status(400);
                                return;
                            }
                            rekognition.associateFaces({
                                "CollectionId": process.env.FACE_COLLECTION,
                                "UserId": id,
                                "FaceIds": [data.FaceRecords[0].Face.FaceId]
                            }, async (err, data) => {
                                if (err) {
                                    res.status(400);
                                    return;
                                }
                                if (data.AssociatedFaces.length > 0) {
                                    const newuser = await User.findByIdAndUpdate(id, {
                                        hasUserId: true,
                                        associatedFaces: data.AssociatedFaces.length
                                    }, { new: true }).select("-password")
                                    res.json({ success: true, message: "Uploaded!", user: newuser })
                                    return;
                                }
                                else {
                                    console.log("No Associated Faces")
                                    res.status(400).json({ success: false })
                                    return;
                                }
                            })
                        })
                    })
                }
                else {
                    res.json({ success: false, message: "Already Uploaded!" });
                }
            }
            else {
                rekognition.createCollection({ CollectionId: process.env.FACE_COLLECTION }, async (err, data) => {
                    if (err) {
                        res.status(500);
                        return;
                    }
                    if (!user.hasUserId) {
                        rekognition.createUser({
                            "CollectionId": process.env.FACE_COLLECTION,
                            "UserId": id
                        }, async (err, data) => {
                            if (err) {
                                res.status(400);
                                return;
                            }
                            rekognition.indexFaces({
                                Image: {
                                    "Bytes": req.file.buffer
                                },
                                CollectionId: process.env.FACE_COLLECTION,
                                MaxFaces: 1,
                                QualityFilter: "AUTO",
                                // ExternalImageId: (booking._id).toString().concat(".png")
                            }, async (err, data) => {
                                if (err) {
                                    res.status(400);
                                    return;
                                }
                                rekognition.associateFaces({
                                    "CollectionId": process.env.FACE_COLLECTION,
                                    "UserId": id,
                                    "FaceIds": [data.FaceRecords[0].Face.FaceId]
                                }, async (err, data) => {
                                    if (err) {
                                        res.status(400);
                                        return;
                                    }
                                    if (data.AssociatedFaces.length > 0) {
                                        const newuser = await User.findByIdAndUpdate(id, {
                                            hasUserId: true,
                                            associatedFaces: data.AssociatedFaces.length
                                        }, { new: true }).select("-password")
                                        res.json({ success: true, message: "Uploaded!", user: newuser })
                                        return;
                                    }
                                    else {
                                        console.log("No Associated Faces")
                                        res.status(400).json({ success: false })
                                        return;
                                    }
                                })
                            })
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error })
    }
})

module.exports = { registerUser, loginUser, myPayment, blockPayment, registerFace, getBalance, confirmPayment }