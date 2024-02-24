const mongoose = require('mongoose')

const { Schema } = mongoose;
const paymentSchema = new Schema({
  seller: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  buyer: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hasBlocked: {
    type: Boolean,
    default: false
  },
  hasConfirmed: {
    type: Boolean,
    default: false
  },
  hasFailed: {
    type: Boolean,
    default: false
  },
  payedAt:{
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reason: {
    type: String
  }
}, {timestamps: true});


mongoose.models = {}
const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment