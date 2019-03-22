var util = require("util");
var Promise = require("bluebird");


var getBlueList = function(req, res) {

    var pool = req.app.get("pool");

    console.log('indexmanage 모듈 안에 있는 getBlueList 호출됨.');
  
    var etpStmts = req.app.get("stmt");
    
    var options = {id:'admin'};
    var options = {};
    var stmt = etpStmts.IndexManage.selectIndexInfoOpenReqList(options);

    console.log(stmt);
    

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {
                util.log("sql1" == rows.affectedRows)
                res.json({ success: true, results: rows });
                res.end();
            }).catch(err => {
                util.log("Error while performing Query.", err);
                res.json({ success: false, message: err });
                res.end();
            });
    
       
    });

};

module.exports.getBlueList = getBlueList;

