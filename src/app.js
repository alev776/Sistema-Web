const express = require('express');
require('./db/mongoose');
const path = require('path');
const login = require('./routes/login');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const publicDirectory = path.join(__dirname, './public');

app.use(express.json());
app.use(cors({origin: 'http://localhost:8080'}));
app.use(morgan('tiny'));
app.use(express.static(publicDirectory));
app.use(login);

module.exports = app;
