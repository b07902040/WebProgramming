import mongoose from 'mongoose';

let mongoose = require('mongoose');
let scoreCardSchema = mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true }
})
//   name   : String
//   subject: String
//   score  : Number
export default model('ScoreCard', scoreCardSchema);
