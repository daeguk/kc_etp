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

var getIndexVueTableTestList = function(req, res) {
  console.log('indexmanage 모듈 안에 있는 getIndexVueTableTestList 호출됨.');
  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  console.log("req.query");
  console.log(req.query);
  var options = {};
  var stmt = etpStmts.IndexManage.getIndexToastGridTestList(options);
  console.log(stmt);
  
  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
            util.log("sql1" == rows.affectedRows)
            res.json({ success: true, results: rows, count: rows.length });
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

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  console.log("req.query");
  console.log(req.query);
  var options = {};
  var stmt = etpStmts.IndexManage.getIndexToastGridTestList(options);
  console.log(stmt);
  
  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
            util.log("sql1" == rows.affectedRows)
            res.json({ success: true, results: rows, count: rows.length });
            res.end();
        }).catch(err => {
            util.log("Error while performing Query.", err);
            res.json({ success: false, message: err });
            res.end();
        });

   
  });  
};

/* 
* 이미 등록된 지수ID 가 존재하는지 확인한다.
* 2019-04-02  bkLove(촤병국)
*/
var getJisuDuplCheck = function(req, res) {
  console.log('indexmanage -> getJisuDuplCheck 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");
  var result = false;

  /* 1. body.data 값이 있는지 체크 */
  if( !req.body.data ) {
    console.log( "[error] indexmanage -> getJisuDuplCheck  req.body.data no data." );
    console.log( req.body.data );
    res.json({ success: false, result: result });
    return ;
  }

  var options = JSON.parse( JSON.stringify(req.body.data) );

  /* 2. 이미 등록된 지수ID 가 존재하는지 확인 */
  var stmt = etpStmts.IndexManage.getJisuDuplCheck( options) ;
  console.log(stmt);
  
  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {

          /* 3. cnt 가 0보다 큰 경우 데이터가 존재 */
          if(     rows 
              &&  rows[0].cnt > 0 )  {
                result  = true;
          }

          console.log("indexmanage -> getJisuDuplCheck  result=[" + result + "]");
          res.json({ success: true, result: result });
          res.end();
      }).catch(err => {
          console.log("[error] indexmanage -> getJisuDuplCheck Error while performing Query.", err);
          res.json({ success: false, message: err, result: result });
          res.end();
      });
  });  
};

module.exports.getInfoOpenReqList = getInfoOpenReqList;
module.exports.getIndexSummaryHist = getIndexSummaryHist;
module.exports.getIndexVueTableTestList = getIndexVueTableTestList;
module.exports.getIndexToastGridTestList = getIndexToastGridTestList;
module.exports.getJisuDuplCheck = getJisuDuplCheck;