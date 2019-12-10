/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var Promise = require("bluebird");
var async = require('async');
var log = require('../../../util/logg');

var getEtpList = function(req, res) {
  try {
    log.debug('etpinfo.getEtpList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};

    /* 1. body.data 값이 있는지 체크 */
    if (!req.body.data) {
      log.error("[error] etpinfo.getEtpList  req.body.data no data.", req.body.data);
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;

      throw resultMsg;
    }

    var paramData = JSON.parse(JSON.stringify(req.body.data));

    paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
    paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
    paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
    paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
    paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );

    var format = { language: 'sql', indent: '' };
    var stmt = "";

    Promise.using(pool.connect(), conn => {
      /* 1. 분류코드별 지수정보를 조회한다. */
      var etpFunc1 = function() {
        var callback = null;

        if (arguments.length == 1) {
          callback = arguments[0];
        } else if (arguments.length == 2) {
          data = arguments[0];
          callback = arguments[1];
        }
        stmt = mapper.getStatement('etpinfo', 'getJisuListByCtgCode', paramData, format);
        // log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            return callback(resultMsg);
          }
          if (rows) {
            resultMsg.ctgCodeList = rows;
          }
          callback(null, paramData);
        });
      };

      /* 2. 지수별 ETP 목록을 조회한다. */
      var etpFunc2 = function() {
        var callback = null;

        if (arguments.length == 1) {
          callback = arguments[0];
        } else if (arguments.length == 2) {
          data = arguments[0];
          callback = arguments[1];
        }
        var etpLists = [];

        /* ctg_code 별로 ETP 목록 데이터를 조회한다. */
        async.forEachOf(resultMsg.ctgCodeList, function(ctgCodeItem, index, inner_callback) {
          paramData.ctg_code = ctgCodeItem.ctg_code;
          stmt = mapper.getStatement('etpinfo', 'getEtpListByJisu', paramData, format);
          // log.debug(stmt, paramData);
          conn.query(stmt, function(err, rows) {
            if (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return inner_callback(resultMsg);
            }
            if (rows) {
              etpLists.push(rows);
            }
            inner_callback(null);
          });
        }, function(err) {
          if (err) {
            return callback(resultMsg);
          } else {
            resultMsg.etpLists = etpLists;
            return callback(null);
          }
        });
      };

      var funcList = [];
      funcList.push(etpFunc1);
      funcList.push(etpFunc2);
      async.waterfall(funcList, function(err) {
        if (err) {
          log.error(err, stmt, paramData);
        } else {
          resultMsg.result = true;
          resultMsg.msg = "";
          resultMsg.err = null;
        }
        res.json(resultMsg);
        res.end();
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.etpLists = [];

    res.json(resultMsg);
    res.end();
  }
}

var getEtfKorList = function(req, res) {
  log.debug('etpinfo 모듈 안에 있는 getEtpKorList 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  var options = {};
  var stmt = etpStmts.EtpInfo.selectEtfKorList(options);
  //log.debug(stmt);

  res.json({ success: true, results: rows });
  res.end();
  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
      log.debug("sql1" == rows.affectedRows)
      res.json({ success: true, results: rows });
      res.end();
    }).catch(err => {
      log.debug("Error while performing Query.", err);
      res.json({ success: false, message: err });
      res.end();
    });
  });
};

var getEtfForList = function(req, res) {
  log.debug('etpinfo 모듈 안에 있는 getEtfForList 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  var options = {};
  var stmt = etpStmts.EtpInfo.selectEtfForList(options);
  //log.debug(stmt);

  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
      log.debug("sql1" == rows.affectedRows)
      res.json({ success: true, results: rows });
      res.end();
    }).catch(err => {
      log.debug("Error while performing Query.", err);
      res.json({ success: false, message: err });
      res.end();
    });
  });
};

var getEtnKorList = function(req, res) {
  log.debug('etpinfo 모듈 안에 있는 getEtnKorList 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  var options = {};
  var stmt = etpStmts.EtpInfo.selectEtnKorList(options);
  //log.debug(stmt);

  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
      log.debug("sql1" == rows.affectedRows)
      res.json({ success: true, results: rows });
      res.end();
    }).catch(err => {
      log.debug("Error while performing Query.", err);
      res.json({ success: false, message: err });
      res.end();
    });
  });
};

var getEtnForList = function(req, res) {
  log.debug('etpinfo 모듈 안에 있는 getEtnForList 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  var options = {};
  var stmt = etpStmts.EtpInfo.selectEtnForList(options);
  //log.debug(stmt);

  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
      log.debug("sql1" == rows.affectedRows)
      res.json({ success: true, results: rows });
      res.end();
    }).catch(err => {
      log.debug("Error while performing Query.", err);
      res.json({ success: false, message: err });
      res.end();
    });
  });
};

module.exports.getEtpList = getEtpList;
module.exports.getEtfKorList = getEtfKorList;
module.exports.getEtfForList = getEtfForList;
module.exports.getEtnKorList = getEtnKorList;
module.exports.getEtnForList = getEtnForList;