/* eslint-disable no-console */
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';
if (process.env.NODE_ENV !== 'production') require('dotenv').config({
  path: `./.${process.env.NODE_ENV}.env`
});

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const router = require('./router/index');
// const config = require('./config');
// const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const { PORT } = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, {useMongoClient: true})
  .then(() => console.log(`successfully connected to ${process.env.NODE_ENV} database`))
  .catch(err => console.log(`error connecting to the Database ${err}`));
  /*
mongoose.connect(process.env.DB_URI, {useMongoClient: true}, function(err) {
    if (!err) {
        console.log(`connected to the Database: ${process.env.NODE_ENV}`);
    } else {
        console.log(`error connecting to the Database ${err}`);
    }
});
*/
app.use(morgan('dev'));

// express middleware
app.use(bodyParser.json());

// use cors so that front end application can access this api
app.use(cors());

app.get('/', function(req, res) {
    res.status(200).send('All good!');
});

app.use('/api', router);

app.listen(PORT, function() {
    console.log(`listening on port ${PORT}`);
});

// sure of error
app.use(function(err, req, res, next) {
    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }
    next(err);
});

//  not sure of error 
app.use(function (err, req, res, next) {
 console.log(err);
 res.status(500).json({message: 'Server error'});
 next();
});

module.exports = app;