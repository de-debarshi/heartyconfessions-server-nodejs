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
    reactions: {
        like : { type: Number , default: 0},
        dislike : { type: Number , default: 0},
        sad : { type: Number , default: 0},
        angry : { type: Number , default: 0},
        funny: { type: Number , default: 0}
    },
    comments : [commentSchema],
    commentCount: { type: Number },
    reactionCount: { type: Number }
}, {timestamps: true});
/* confessionSchema.virtual('commentCountCalculate').get(function() {
    if(this.comments)
    return this.comments.length;
}); */
var Confession = mongoose.model('Confession', confessionSchema);

module.exports = { Confession };