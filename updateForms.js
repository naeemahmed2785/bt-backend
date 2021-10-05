var db = require ("./db")
var router = require('express').Router();


function deleteFormById (req, res) {
    const x  = req.params.id
    console.log(x)
    let myquery = `Delete from Questionnaires where ID = ${req.params.id}`
    db.executeSelect(myquery, res);

}


router.delete('/deleteFormById/:id', deleteFormById)

module.exports = router;
