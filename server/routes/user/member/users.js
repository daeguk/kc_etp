/*
 * 사용자설정 관련 라우팅 함수 정의
 *
 * @date 2018-09-11
 * @author threeon
 */
var crypto = require('crypto');
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

/* logging 추가함.  2019-06-10 */
var log = config.logger;

// 사용사 로그인 처리
var userLoginCheck = function(req, res) {
  log.debug('users 모듈 안에 있는 userLoginCheck 호출됨.');

  var options = {};
log.debug("email : " + req.body.email + " password : " + req.body.password);
  options.email = req.body.email;
  options.password = req.body.password;
  // options.criteria.hashed_password = crypto.createHash('sha256', config.pwd_salt).update(password).digest('base64');;

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  log.debug('client IP***********--> ' + ip);

  //접속 시간 
  var dt = new Date();
  var dt_time = dt.getHours();
  log.debug('client DATE***********--> ' + dt);

  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    
    /*
    *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
    *   written by bkLove(최병국)   2019-06-25
    */
    for( var i in options ) {
        if( options[i] && typeof options[i] === "string" ) {
            if( options[i].indexOf( "\\" ) > -1 ) {
                options[i] = options[i].replace( /\\/g, "\\\\" );
            }
        }
    }

    log.debug("options==> ", JSON.stringify(options));

    var stmt = mapper.getStatement('member', 'userLoginCheck', options, {language:'sql', indent: '  '});
    log.debug(stmt);

    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        if(rows.length == 0) {
          res.json({
            success: false,
            message: "이메일계정 또는 비밀번호가 올바르지 않습니다.",
          });
          res.end();
        }else {
            /*
                세션 정보 처리;
             ============================
            */
            req.session.user_id = rows[0].email;
            req.session.inst_cd = rows[0].inst_cd;
            req.session.type_cd = rows[0].type_cd;
            req.session.large_type = rows[0].large_type;
            req.session.krx_cd = rows[0].krx_cd; //거래소 ETP 발행사 코드
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
    for( var i in options ) {
        if( options[i] && typeof options[i] === "string" ) {
            if( options[i].indexOf( "\\" ) > -1 ) {
                options[i] = options[i].replace( /\\/g, "\\\\" );
            }
        }
    }
    
    var stmt = mapper.getStatement('member', 'setLoginHistory', options, {language:'sql', indent: '  '});
    log.debug(stmt);

    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {

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
    
    var stmt = mapper.getStatement('member', 'getMemberTypeList', options, {language:'sql', indent: '  '});
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

  var options = {};
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    
    var stmt = mapper.getStatement('member', 'getMemberDomainList', options, {language:'sql', indent: '  '});
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
    for( var i in options ) {
        if( options[i] && typeof options[i] === "string" ) {
            if( options[i].indexOf( "\\" ) > -1 ) {
                options[i] = options[i].replace( /\\/g, "\\\\" );
            }
        }
    }
    
    var stmt = mapper.getStatement('member', 'userNewAccount', options, {language:'sql', indent: '  '});
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
    for( var i in options ) {
        if( options[i] && typeof options[i] === "string" ) {
            if( options[i].indexOf( "\\" ) > -1 ) {
                options[i] = options[i].replace( /\\/g, "\\\\" );
            }
        }
    }    
    
    var stmt = mapper.getStatement('member', 'userFindPwd', options, {language:'sql', indent: '  '});
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
    for( var i in options ) {
        if( options[i] && typeof options[i] === "string" ) {
            if( options[i].indexOf( "\\" ) > -1 ) {
                options[i] = options[i].replace( /\\/g, "\\\\" );
            }
        }
    }
    
    var stmt = mapper.getStatement('member', 'setUserInfo', options, {language:'sql', indent: '  '});
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

// 사용사 정보 조회
/*
var getUserInfo = function(req, res) {
    log.debug('/users/getUserInfo 패스 요청됨.');
    log.debug(req.body);
    
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var userid = req.body.userid || req.query.userid;
        log.debug("getUserInfo : " + req.body.userid);
        log.debug("getUserInfo : " + req.query.userid);
        
        database.UserModel.findByUserId(userid, function(err, user) {
            log.debug("getUserInfo : " + user);
            if (err) {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            } else if (user.length) {
                res.json({ success: true, message: "OK", userinfo: user[0]});
                res.end();
            } else {
                res.json({ success: false, message: "No Data" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

//사용자정보 수정
var updateUserInfo = function(req, res) {
    log.debug('/users/updateUserInfo 패스 요청됨');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        var userinfo = req.body.userinfo;
        var options = { "criteria": {"userid": userinfo.userid}, "userinfo": userinfo };

        database.UserModel.updateInfo(options, function(err) {
            if (err) {
                log.debug("Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

module.exports.getUserInfo = getUserInfo;
module.exports.updateUserInfo = updateUserInfo;
*/
