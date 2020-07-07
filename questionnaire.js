var db = require('./db');
var router = require('express').Router();

function getBySubjectId(req, res) {
    var myQuery = "select [Name], ID, Subjectid from Questionnaires where SubjectId = " +
        req.params.id;
    db.executeQuery(res, myQuery);
}

function getById(req, res) {
    var myQuery = `select Criteria from Questionnaires Where ID = ${req.params.id}`;
    db.executeQuery(res, myQuery);

}

function getAll(req, res) {
    var sql =
        "Select FC.ID, FC.SubjectId, S.SubjectName, FC.Name, FC.Criteria from Questionnaires AS FC Inner join Subject AS S  ON FC.SubjectId = S.ID";
    db.executeQuery(res, sql);
}

function create(req, res) {
    var obj = req.body;
    const formObj = obj.filter(item => item.hasOwnProperty('formName') ? true : false);
    const questionnaire = obj
    questionnaire.shift();

    var myQuery = `insert into Questionnaires ( SubjectId, Name, Criteria) values (${formObj[0].subjectName}, 
       '${formObj[0].formName}', '${JSON.stringify(questionnaire)}');`;
    db.executeQuery(res.send('ok'), myQuery);

}

router.get('/getBySubject/:id', getBySubjectId);
router.get('/getById/:id', getById);
router.get('/getAll', getAll);
router.post('/create', create);

module.exports = router;
