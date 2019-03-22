/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

var getEtpApplyList = function(req, res) {
    console.log('etpregister 모듈 안에 있는 getetpapplylist 호출됨.');

    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");
    // var options = {id:'admin'};
    var options = {};
    var stmt = etpStmts.EtpRegister.selectEtpRegisterList(options);
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

module.exports.getEtpApplyList = getEtpApplyList;