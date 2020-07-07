var db = require('./db');
var router = require('express').Router();
var ourConfig = require('./config');
var sql = require('mssql');

function create(req, res) {
    const student = req.body;
    sql.connect(ourConfig, function () {
        var request = new sql.Request();
        request.input("RefNumber", sql.VarChar(10), student.refNumber);
        request.input("FirstName", sql.VarChar(50), student.firstName);
        request.input("LastName", sql.VarChar(50), student.lastName);
        request.input("Gender", sql.Char(1), student.gender);
        request.input("Year", sql.VarChar(10), student.year);
        request.input("Subjects", sql.VarChar(50), student.subject.join(","));
        request
            .execute("student_insert")
            .then(function (data) {
                res.status(200).send(data);
            })
            .catch(function (err) {
                res.send(err);
            });
    });
}

function byRef(req, res) {
    var myquery = `select ID, FirstName + ' ' + LastName as Name from Student where RefNumber = '${req.params.id}'`;
    db.executeQuery(res, myquery);
}

function subjects(req, res) {
    var myQuery = `select SS.SubjectId, Subject.SubjectName  from StudentSubjects SS
    inner join subject on subject.id = SS.SubjectId 
    where SS.StudentId = '${req.params.id}'`;
    db.executeQuery(res, myQuery);
}

function search(req, res) {
    var obj = req.body;
    var myquery = `SELECT *, dbo.getStudentSubject(S.ID) AS Subjects FROM Student S left outer JOIN PTM P ON S.ID = P.StudentID 
      where S.RefNumber IS NULL OR S.RefNumber='${obj.refNumber}' 
      OR S.FirstName IS NULL OR S.FirstName like '%${obj.firstName}%' 
      OR S.LastName IS NULL OR S.lastname like '%${obj.lastName}%'`;
    db.executeSelect(myquery, res);
}

function getById(req, res) {
    var myquery = `select S.Id, S.RefNumber, S.FirstName, S.LastName, S.Gender, s.AdmDate, S.Year,
    dbo.getStudentSubject(s.id) as StudentSubjects
    from student s where s.id = ${req.params.id};
    select sub.SubjectName, A.Answer from Answers AS A 
    inner join Student AS S ON S.Id = A.StudentId
    inner join Questionnaires Q ON A.QuestionnaireId = q.ID
    inner join Subject as sub on Q.SubjectId = sub.ID
    where s.id  = ${req.params.id}`;
    db.executeMultipleQuery(res, myquery);
}

function getAllStudent(req, res) {
    var myquery = "select * from Student";
    db.executeSelect(myquery, res)
}


router.post('/create/', create);
router.get('/:id/byRef', byRef);
router.get('/:id/subjects', subjects);
router.post('/search/', search);
router.get('/:id', getById);
router.get('/', getAllStudent);


module.exports = router;
