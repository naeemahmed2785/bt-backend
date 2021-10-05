
// import { request } from 'http';

var express = require('express');
var subject = require('./subject');
var questionnaire = require('./questionnaire');
var student = require('./student');
var answer = require('./answer');
var updateForms = require ('./updateForms');
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();



app.use(bodyParser.json());
app.use(cors());





app.use('/subjects', subject);
app.use('/questionnaire', questionnaire);
app.use('/student', student);
app.use('/answer', answer);
app.use('/updateForms', updateForms);

module.exports = app;