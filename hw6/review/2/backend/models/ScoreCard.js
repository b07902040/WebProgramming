// TODO: Define ScoreCardSchema
//   name   : String
//   subject: String
//   score  : Number
// export default model('ScoreCard', scoreCardSchema);
//const mongoose = require('mongoose');
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const scoreCardSchema = new Schema({
    name: {
        type: String
    },
    subject: {
        type: String
    },
    score: {
        type: Number
    }
});
const ScoreCard = mongoose.model('ScoreCard', scoreCardSchema);
export default ScoreCard;