const express = require('express')
const dotenv = require('dotenv')
var cors = require('cors')
const buyerRoutes = require('./controller/buyerRoutes.js')
const sellerRoutes = require('./controller/sellerRoutes.js')


dotenv.config()
const connectDB = require('./config/db.js')
const { notFound, errorHandler } = require('./middlewear/errorhandler.js');



const app = express()
app.use(cors());
app.use(express.json())
connectDB()

app.use('/api/buyer', buyerRoutes);
app.use('/api/seller', sellerRoutes)


app.use(notFound)
app.use(errorHandler)

app.listen(process.env.BPORT || 5000, () => { console.log("Backend Started at port", process.env.BPORT) })


