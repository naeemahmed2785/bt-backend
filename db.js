var ourConfig = require("./config");
var sql = require('mssql');


module.exports = {
    executeQuery: (res, myquery) => {
        sql.connect(ourConfig, function (err) {
            if (err) console.log("got error while connecting::", err);
            // create Request object

            var request = new sql.Request();

            // query to the database and get the records
            request.query(myquery, function (err, data) {
                if (err) {
                    console.log(myquery);
                    console.log(err);
                    res.status(501).send(err);
                }
                // send records as a response
                else {
                    res.status(200).send(data.recordset);
                }
            });
        });
    },

    executeMultipleQuery: (res, myquery) => {
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
    },
    executeSelect: (query, response) => {
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
    }
}