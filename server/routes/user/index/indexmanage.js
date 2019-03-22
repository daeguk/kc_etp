/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

var getInfoOpenReqList = function(req, res) {
  console.log('indexmanage 모듈 안에 있는 getInfoOpenReqList 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
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

var getIndexSummaryHist = function(req, res) {
  console.log('indexmanage 모듈 안에 있는 getindexsummaryhist 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  console.log("req.query");
  console.log(req.query);
  var options = {index_cd:req.query.idx_cd};
  var stmt = etpStmts.IndexManage.selectIndexSummaryHist(options);
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

var getIndexToastGridTestList = function(req, res) {
  console.log('indexmanage 모듈 안에 있는 getIndexToastGridTestList 호출됨.');
};

module.exports.getInfoOpenReqList = getInfoOpenReqList;
module.exports.getIndexSummaryHist = getIndexSummaryHist;
module.exports.getIndexToastGridTestList = getIndexToastGridTestList;