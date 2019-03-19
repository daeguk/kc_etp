/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');

var getInfoOpenReqList = function(req, res) {
  console.log('indexmanage 모듈 안에 있는 getInfoOpenReqList 호출됨.');

  var mydb = req.app.get('mydb');
  // var options = {id:'admin'};
  var options = {};
  var stmt = mydb.IndexManage.selectIndexInfoOpenReqList(options);
  console.log(stmt);
  
  mydb.db.query(stmt, function(err, rows, fields) {
    if (!err){
      // console.log('The solution is: ', rows);
      res.json({ success: true, results: rows });
      res.end();
    }else{
      console.log('Error while performing Query.', err);
      res.json({ success: false, message: rows });
      res.end();
    }        
  });
};

var getIndexSummaryHist = function(req, res) {
  console.log('indexmanage 모듈 안에 있는 getindexsummaryhist 호출됨.');

  var mydb = req.app.get('mydb');
  // var options = {id:'admin'};
  console.log("req.query");
  console.log(req.query);
  var options = {index_cd:req.query.idx_cd};
  var stmt = mydb.IndexManage.selectIndexSummaryHist(options);
  console.log(stmt);
  
  mydb.db.query(stmt, function(err, rows, fields) {
    if (!err){
      // console.log('The solution is: ', rows);
      res.json({ success: true, results: rows });
      res.end();
    }else{
      console.log('Error while performing Query.', err);
      res.json({ success: false, message: rows });
      res.end();
    }        
  });
};

module.exports.getInfoOpenReqList = getInfoOpenReqList;
module.exports.getIndexSummaryHist = getIndexSummaryHist;