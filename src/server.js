if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const config = require('./config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;

mongoose.Promise = global.Promise;

mongoose.connect(db, {useMongoClient: true}, function(err) {
    if (!err) {
        console.log(`connected to the Database: ${db}`);
    } else {
        console.log(`error connecting to the Database ${err}`);
    }
});

app.use(morgan('dev'));

// express middleware
app.use(bodyParser.json());

// use cors so that front end application can access this api
app.use(cors());

app.get('/', function(req, res) {
    res.status(200).send('All good!');
});

app.listen(PORT, function() {
    console.log(`listening on port ${PORT}`);
});

/*
// sure of error
app.use(function(err, req, res, next) {
    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }
    next(err);
});

// not sure of error
app.use(function (err, req, res, next) {
 console.log(err);
 res.status(500).json({message: 'Server error'});
 next();
});
*/
module.exports = app;