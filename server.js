const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const db = require('./models');

const { UserRouter, AuthRouter } = require('./routes');

require('dotenv').config();

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World',
    });
});

app.use('/users', UserRouter);
app.use('/auth', AuthRouter);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});

const PORT = process.env.PORT || 9999;
const HOST_NAME = process.env.HOST_NAME || 'localhost';

app.listen(PORT, HOST_NAME, () => {
    console.log(`Server is running at: http://${HOST_NAME}:${PORT}`);
    db.connectDb();
});
