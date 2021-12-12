const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    username : String,
    comment : String
}, {timestamps: true});
const confessionSchema = new mongoose.Schema({
    age: { type: Number },
    sex: { type: String },
    content: { type: String },
    status: { type: String },
    categories: [ String ],
    likes: { type: Number },
    comments : [commentSchema]
}, {timestamps: true});
var Confession = mongoose.model('Confession', confessionSchema);

module.exports = { Confession };