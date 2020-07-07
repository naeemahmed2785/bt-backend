var db = require('./db');
var router = require('express').Router();
var ourConfig = require('./config');
var sql = require('mssql');

function getAll(req, res) {
    var myQuery = "select * from Subject";
    db.executeQuery(res, myQuery);
}

function getReportBySubjectId(req, res) {

    sql.connect(ourConfig, function () {
        var request = new sql.Request();
        request.input("subid", sql.Int, req.params.sid);
        request.input("rptName", sql.VarChar(50), req.params.rptName);
        request.input("weeksDue", sql.Int, req.params.weeksDue);
        request
            .execute("get_ReportsDue")
            .then(function (data) {
                res.status(200).send(data.recordsets[0]);
            })
            .catch(function (err) {
                res.send(err);
            });
    });
}

router.get('/', getAll);
router.get('/:sid/:rptName/:weeksDue', getReportBySubjectId);


module.exports = router;