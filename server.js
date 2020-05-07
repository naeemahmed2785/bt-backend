var express = require("express");
var app = express();
var cors = require("cors");
var sql = require("mssql");
var bodyParser = require("body-parser");
var ourConfig = require("./config");

app.use(bodyParser.json());

app.use(cors());

var executeMultipleQuery = function (res, myquery) {
  sql.connect(ourConfig, function (err) {
    if (err) console.log(err);
    // create Request object

    var request = new sql.Request();

    // query to the database and get the records
    request.query(myquery, function (err, data) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      // send records as a response
      else {
        res.send(("got data from back", data.recordsets));
      }
    });
  });
};

var executeQuery = function (res, myquery) {
  sql.connect(ourConfig, function (err) {
    if (err) console.log(err);
    // create Request object

    var request = new sql.Request();

    // query to the database and get the records
    request.query(myquery, function (err, data) {
      if (err) {
        console.log(err);
        res.status(501).send(err);
      }
      // send records as a response
      else {
        res.status(200).send(data.recordset);
      }
    });
  });
};

var executeSelect = function (query, response) {
  sql.connect(ourConfig, (err) => {
    var request = new sql.Request();
    request.query(query, (err, data) => {
      if (err) {
        response.send(err.message);
      } else {
        response.status(200).send(data.recordsets[0]);
      }
    });
  });
};

app.get("/getSubjects", (req, res) => {
  var myQuery = "select * from Subject";
  executeQuery(res, myQuery);
});

app.get("/getCriteriaType/:id", (req, res) => {
  var myQuery =
    "select [Type], ID, Subjectid from FormCriteria where SubjectId = " +
    req.params.id;
  executeQuery(res, myQuery);
});
app.post("/getUpdatedTest", (req, res) => {
  var obj = req.body;
  var myQuery = `SELECT top 1 * from TestRecord where StudentId = ${obj.selectedStudentId} and SubjectId =${obj.selectedSubjectId} order by createdDate desc`;
  executeQuery(res, myQuery);
});
app.get("/getStudentSubjects/:id", (req, res) => {
  var myQuery = `select SS.SubjectId, Subject.SubjectName  from StudentSubjects SS
    inner join subject on subject.id = SS.SubjectId 
    where SS.StudentId = '${req.params.id}'`;
  executeQuery(res, myQuery);
});

app.get("/getCriteriaById/:id", (req, res) => {
  var myQuery = `select Criteria from FormCriteria Where ID = ${req.params.id}`;
  executeQuery(res, myQuery);
});
app.post("/saveteachercomment", (req, res) => {
  var obj = req.body;
  var myQuery = `insert into TeacherComments (StudentID, SubjectID, Comments, CreatedDate) values (${obj.selectedStudentId},
        ${obj.selectedSubjectId}, '${obj.results}', '${obj.commentDate}')`;
  executeQuery(res, myQuery);
});
// getCriteriaById

app.get("/studentsByRef/:id", (req, res) => {
  var myquery = `select ID, FirstName + ' ' + LastName as Name from Student where RefNumber = '${req.params.id}'`;
  executeQuery(res, myquery);
});

app.post("/ptm", (req, res) => {
  const obj = req.body;
  var myquery = `insert into PTM (StudentID, PTM) values (${obj.studentId},'${obj.ptm}')`;
  executeQuery(res, myquery);
});

app.post("/savetestrecord", (req, res) => {
  const obj = req.body;
  var myQuery = `insert into TestRecord (StudentId, SubjectId, Book, TestNumber, TestAttempt, CreatedDate,
        Marks, Result, Teacher, UpdateBy) values (${obj.selectedStudentId}, ${obj.selectedSubjectId}, '${obj.book}','${obj.testNumber}',
        '${obj.attempt}', '${obj.testDate}', '${obj.marks}','${obj.results}', '${obj.teacher}','${obj.updatedBy}');`;
  executeQuery(res, myQuery);
});

app.post("/newstudent", (req, res) => {
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
      .then(function (err, recordsets, returnValue, affected) {
        console.dir(err);
        res.send(res.statusCode);
      })
      .catch(function (err) {
        res.send(err);
      });
  });
});

app.post("/search", (req, res) => {
  var obj = req.body;
  var myquery = `SELECT *, dbo.getStudentSubject(S.ID) AS Subjects FROM Student S left outer JOIN PTM P ON S.ID = P.StudentID 
    where S.RefNumber IS NULL OR S.RefNumber='${obj.refNumber}' 
    OR S.FirstName IS NULL OR S.FirstName like '%${obj.firstName}%' 
    OR S.LastName IS NULL OR S.lastname like '%${obj.lastName}%'`;
  executeSelect(myquery, res);
});

app.get("/viewstudent/:id", (req, res) => {
  var myquery = `select s.*, dbo.getStudentSubject(s.id) as subjects from student s where s.id = ${req.params.id};
    select S.SubjectName, TC.Comments, TC.CreatedDate from TeacherComments AS TC 
    Inner join Subject AS S ON TC.SubjectID = S.ID where StudentID = ${req.params.id};
    select * from TestRecord Where StudentId = ${req.params.id}`;
  executeMultipleQuery(res, myquery);
});



// **************************************************************
app.get("/getFormsList", (req, res) => {
  var sql =
    "Select FC.ID, FC.SubjectId, S.SubjectName, FC.Type, FC.Criteria from FormCriteria AS FC Inner join Subject AS S  ON FC.SubjectId = S.ID";
  executeQuery(res, sql);
});

app.post("/saveNewForms", (req, res) => {
  var obj = req.body;
  const formObj = obj.filter(item => item.hasOwnProperty('formName') ? true : false);
  const questionnaire = obj
  questionnaire.shift();

  var myQuery = `insert into FormCriteria ( SubjectId, Type, Criteria) values (${formObj[0].subjectName}, 
       '${formObj[0].formName}', '${JSON.stringify(questionnaire)}');`;
  executeQuery(res.send('ok'), myQuery);
})

// **************************************************************

var server = app.listen(3000, () => {
  console.log("listening at port 3000");
});



