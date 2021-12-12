
const express = require('express');
require('./config');
require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const confessionController = require('./controllers/confessionController.js');

let app = express();
app.use(bodyParser.json());
app.use(cors());

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));

app.use('/api/confession', confessionController);