/*
 * 사용자설정 관련 라우팅 함수 정의
 *
 * @date 2018-09-11
 * @author threeon
 */
var crypto = require('crypto');
var config = require('../../../config/config');
var dbconfig = require('../../../database/mysql_config');
var util = require('../../../util/util');
var Promise = require("bluebird");

/* logging 추가함.  2019-06-10 */
var log = config.logger;

// 사용사 로그인 처리
var userLoginCheck = function(req, res) {
  log.debug('users 모듈 안에 있는 userLoginCheck 호출됨.');

  var options = {};
  // log.debug("email : " + req.body.email);

  options.email = req.body.email;
  options.password = req.body.password;
  // options.criteria.hashed_password = crypto.createHash('sha256', config.pwd_salt).update(password).digest('base64');;

  // IP / 접속 시간 
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  var dt = new Date();
  log.debug("client DATE : " + dt + " IP : " + ip);

  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    /*
    *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
    *   written by bkLove(최병국)   2019-06-25
    */
    util.fn_replaceSpecialChar( options );
    log.debug("options==> ", JSON.stringify(options));

    var stmt = mapper.getStatement('member', 'userLoginCheck', options, dbconfig.format);
    // log.debug(stmt);

    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        if(rows.length == 0) {
          res.json({
            success: false,
            message: "이메일계정 또는 비밀번호가 올바르지 않습니다.",
          });
          res.end();
        }else {
            // 세션 정보 처리;
            req.session.user_id = rows[0].email;
            req.session.inst_cd = rows[0].inst_cd;
            req.session.type_cd = rows[0].type_cd;
            req.session.large_type = rows[0].large_type;
            req.session.krx_cd = rows[0].krx_cd;
            req.session.save();
            res.json({
                success: true,
                results: rows
            });
            res.end();
        }
      }).catch(err => {
        log.debug("Error while performing Query.", err);
        res.json({
          success: false,
          message: err,
        });
        res.end();
      });
    });
  } catch(exception) {
    log.debug("err=>", exception);
  }
  setLoginHistory(req);
};

var setLoginHistory = function(req) {
  try {
    var options = req.body;
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    /*
    *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
    *   written by bkLove(최병국)   2019-06-25
    */
    util.fn_replaceSpecialChar( options );
    var stmt = mapper.getStatement('member', 'setLoginHistory', options, dbconfig.format);
    // log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {

      }).catch(err => {
        log.debug("Error while performing Query.", err);
      });
    });

    // tm_user_log 접속내역 기록
    var stmt1 = mapper.getStatement('member', 'insertUserLog', options, dbconfig.format);
    // log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt1).then(rows => {
        // console.log("insertUserLog.................: " + stmt);
      }).catch(err => {
        log.debug("Error while performing Query.", err);
      });
    });
  } catch(exception) {
    log.debug("err=>", exception);
  }
}

// 사용사 그룹 가져오기
var getMemberTypeList = function(req, res) {
  log.debug('users 모듈 안에 있는 getMemberTypeList 호출됨.');

  var options = {};
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('member', 'getMemberTypeList', options, dbconfig.format);
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
            success: true,
            results: rows
        });
        res.end();
      }).catch(err => {
        log.debug("Error while performing Query.", err);
        res.json({
          success: false,
          message: "사용자 그룹 코드를 가져올 수 없습니다.",
        });
        res.end();
      });
    });
  } catch(exception) {
    log.debug("err=>", exception);
  }
};

// 사용사 그룹 가져오기
var getMemberDomainList = function(req, res) {
  log.debug('users 모듈 안에 있는 getMemberDomainList 호출됨.');

  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('member', 'getMemberDomainList', {}, dbconfig.format);
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
            success: true,
            results: rows
        });
        res.end();
      }).catch(err => {
        log.debug("Error while performing Query.", err);
        res.json({
          success: false,
          message: "사용자 그룹 코드를 가져올 수 없습니다.",
        });
        res.end();
      });
    });
  } catch(exception) {
    log.debug("err=>", exception);
  }
};

// 회원등록
var userNewAccount = function(req, res) {
  log.debug('users 모듈 안에 있는 userNewAccount 호출됨.');

  var options = req.body;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    /*
    *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
    *   written by bkLove(최병국)   2019-06-25
    */
    util.fn_replaceSpecialChar( options );
    var stmt = mapper.getStatement('member', 'userNewAccount', options, dbconfig.format);
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
            success: true,
            results: rows
        });
        res.end();
      }).catch(err => {
        log.debug("Error while performing Query.", err);
        res.json({
          success: false,
          message: "동일한 계정이 등록되어 있습니다.",
        });
        res.end();
      });
    });
  } catch(exception) {
    log.debug("err=>", exception);
  }
};

// 회원 패스워드 찾기
var userFindPwd = function(req, res) {
  log.debug('users 모듈 안에 있는 userFindPwd 호출됨.');

  var options = req.body;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    /*
    *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
    *   written by bkLove(최병국)   2019-06-25
    */
    util.fn_replaceSpecialChar( options );
    var stmt = mapper.getStatement('member', 'userFindPwd', options,  dbconfig.format);
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        // log.debug("rows cnt : " + rows.length);
        if(rows.length == 0) {
          res.json({
            success: false,
            message: "해당 계정이 등록되어 있지 않습니다.",
          });
          res.end();
        }else {
          res.json({
            success: true
            // results: rows
          });
          res.end();
        }
      }).catch(err => {
        log.debug("Error while performing Query.", err);
        res.json({
          success: false,
          message: err,
        });
        res.end();
      });
    });
  } catch(exception) {
    log.debug("err=>", exception);
  }
};

// 회원 정보 수정
var userUpdateInfo = function(req, res) {
  log.debug('users 모듈 안에 있는 userUpdateInfo 호출됨.');

  var options = req.body;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    /*
    *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
    *   written by bkLove(최병국)   2019-06-25
    */
    util.fn_replaceSpecialChar( options );
    var stmt = mapper.getStatement('member', 'setUserInfo', options,  dbconfig.format);
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        log.debug("rows cnt : " + rows.length);
        if(rows.length == 0) {
          res.json({
            success: false,
            message: "해당 계정이 등록되어 있지 않습니다.",
          });
          res.end();
        }else {
          res.json({
            success: true
            // results: rows
          });
          res.end();
        }
      }).catch(err => {
        log.debug("Error while performing Query.", err);
        res.json({
          success: false,
          message: err,
        });
        res.end();
      });
    });
  } catch(exception) {
    log.debug("err=>", exception);
  }
};

module.exports.userLoginCheck = userLoginCheck;
module.exports.getMemberTypeList = getMemberTypeList;
module.exports.getMemberDomainList = getMemberDomainList;
module.exports.userNewAccount = userNewAccount;
module.exports.userFindPwd = userFindPwd;
module.exports.userUpdateInfo = userUpdateInfo;