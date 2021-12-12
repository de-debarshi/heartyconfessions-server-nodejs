const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const { Confession } = require('../models/confession');

// => localhost:3000/confession/
router.get('/paginate&page=:pageNumber&category=:category', (req, res) => {
    var limit = 6;
    var skip = (req.params.pageNumber-1) * limit;
    var responseObj = {
        totalPage : null,
        confessionList : null
    };
    var searchQuery;
    if(req.params.category && req.params.category !== 'undefined' && req.params.category !== 'All') {
        searchQuery = { status: 'approved' , categories: req.params.category};
    } else {
        searchQuery = { status: 'approved'};
    }
    console.log(searchQuery);
    Confession.countDocuments(searchQuery , (err, count) => {
        if (!err) { 
            responseObj.totalPage = Math.ceil(count / limit);
            Confession.find(searchQuery, (err, docs) => {
                if (!err) {
                    //docs = docs.map((doc) => doc.commentCount ? {...doc, commentCount: doc.commentCount} : doc );
                    responseObj.confessionList = docs;
                    res.send(responseObj); 
                }
                else { console.log('Error in Retriving Confessions :' + JSON.stringify(err, undefined, 2)); }
            }).select('-comments').limit(limit).skip(skip);
        }
    });
});

router.get('/single&id=:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Confession.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Confession :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    var confsn = new Confession({
        age: req.body.age,
        sex: req.body.sex,
        content: req.body.content,
        status: 'approved',
        categories: req.body.categories,
        likes: 0,
        comments : [],
        commentCount : 0
    });
    confsn.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Confession Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/liked&id=:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Confession.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Confession Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/unliked&id=:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Confession.findByIdAndUpdate(req.params.id, { $inc: { likes: -1 } }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Confession Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/comment', (req, res) => {
    if (!ObjectId.isValid(req.body._id))
        return res.status(400).send(`No record with given id : ${req.body._id}`);
    var newComment = {
        username : req.body.username,
        comment : req.body.comment
    };
    Confession.findByIdAndUpdate(req.body._id, { $push: {comments:newComment} }, { new: true }, (err, doc) => {
        if (!err) {
            var commentCount = doc.comments.length;
            Confession.findByIdAndUpdate(req.body._id, { $set: {commentCount: commentCount} }, { new: true }, (err, doc) => {
                if (!err) { res.send(doc); }
                else { console.log('Error in Confession Update :' + JSON.stringify(err, undefined, 2)); }
            });
            //res.send(doc);
        }
        else { console.log('Error in Confession Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var confsn = {
        age: req.body.age,
        sex: req.body.sex,
        content: req.body.content
    };
    Confession.findByIdAndUpdate(req.params.id, { $set: confsn }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Confession Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Confession.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Confession Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;