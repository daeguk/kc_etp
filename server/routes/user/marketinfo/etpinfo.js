/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');

var getEtfKorList = function(req, res) {
    console.log('etpinfo 모듈 안에 있는 getEtpKorList 호출됨.');

    var mydb = req.app.get('mydb');
    // var options = {id:'admin'};
    var options = {};
    var stmt = mydb.EtpInfo.selectEtfKorList(options);
    console.log(stmt);
    
    mydb.db.query(stmt, function(err, rows, fields) {
      if (!err){
        console.log('The solution is: ', rows);
        res.json({ success: true, results: rows });
        res.end();
      }else{
        console.log('Error while performing Query.', err);
        res.json({ success: false, message: rows });
        res.end();
      }        
    });
};

var getEtfForList = function(req, res) {
  console.log('etpinfo 모듈 안에 있는 getEtfForList 호출됨.');

  var mydb = req.app.get('mydb');
  // var options = {id:'admin'};
  var options = {};
  var stmt = mydb.EtpInfo.selectEtfForList(options);
  console.log(stmt);
  
  mydb.db.query(stmt, function(err, rows, fields) {
    if (!err){
      console.log('The solution is: ', rows);
      res.json({ success: true, results: rows });
      res.end();
    }else{
      console.log('Error while performing Query.', err);
      res.json({ success: false, message: rows });
      res.end();
    }        
  });
};

var getEtnKorList = function(req, res) {
  console.log('etpinfo 모듈 안에 있는 getEtnKorList 호출됨.');

  var mydb = req.app.get('mydb');
  // var options = {id:'admin'};
  var options = {};
  var stmt = mydb.EtpInfo.selectEtnKorList(options);
  console.log(stmt);
  
  mydb.db.query(stmt, function(err, rows, fields) {
    if (!err){
      console.log('The solution is: ', rows);
      res.json({ success: true, results: rows });
      res.end();
    }else{
      console.log('Error while performing Query.', err);
      res.json({ success: false, message: rows });
      res.end();
    }        
  });
};

var getEtnForList = function(req, res) {
  console.log('etpinfo 모듈 안에 있는 getEtnForList 호출됨.');

  var mydb = req.app.get('mydb');
  // var options = {id:'admin'};
  var options = {};
  var stmt = mydb.EtpInfo.selectEtnForList(options);
  console.log(stmt);
  
  mydb.db.query(stmt, function(err, rows, fields) {
    if (!err){
      console.log('The solution is: ', rows);
      res.json({ success: true, results: rows });
      res.end();
    }else{
      console.log('Error while performing Query.', err);
      res.json({ success: false, message: rows });
      res.end();
    }        
  });
};

module.exports.getEtfKorList = getEtfKorList;
module.exports.getEtfForList = getEtfForList;
module.exports.getEtnKorList = getEtnKorList;
module.exports.getEtnForList = getEtnForList;