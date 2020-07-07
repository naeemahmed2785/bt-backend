var db = require('./db')
var router = require('express').Router();
var moment = require('moment');




function create(req, res) {
    var data = req.body;


    var sql = `insert into Answers(StudentId, QuestionnaireId, CreatedDate, Answer) 
    values(${data.selectedStudentId}, ${data.qId}, '${data.answer.createdDate}', '${JSON.stringify(data.answer)}')`;
    db.executeQuery(res, sql);

}


router.post('/create', create);
module.exports = router;