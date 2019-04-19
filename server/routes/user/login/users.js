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

// 사용사 로그인 처리
var userLoginCheck = function(req, res) {
  console.log('users 모듈 안에 있는 userLoginCheck 호출됨.');

  var options = {};
console.log("email : " + req.body.email + " password : " + req.body.password);
  options.email = req.body.email;
  options.password = req.body.password;
  // options.criteria.hashed_password = crypto.createHash('sha256', config.pwd_salt).update(password).digest('base64');;

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  console.log('client IP***********--> ' + ip);

  //접속 시간 
  var dt = new Date();
  var dt_time = dt.getHours();
  console.log('client DATE***********--> ' + dt);

  // var stmt = mydb.AdminMember.selectAdminCheck(options);
  console.log(stmt);
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    
    util.log("options==> ", JSON.stringify(options));

    var stmt = mapper.getStatement('login', 'userLoginCheck', options, {language:'sql', indent: '  '});
    console.log(stmt);

    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
            success: true,
            results: rows
        });
        res.end();
      }).catch(err => {
        util.log("Error while performing Query.", err);
        res.json({
          success: false,
          message: "이메일계정 또는 비밀번호가 올바르지 않습니다.",
        });
        res.end();
      });

    });
  } catch(exception) {
    util.log("err=>", exception);
  }
};

// 사용사 정보 조회
/*
var getUserInfo = function(req, res) {
    console.log('/users/getUserInfo 패스 요청됨.');
    console.log(req.body);
    
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var userid = req.body.userid || req.query.userid;
        console.log("getUserInfo : " + req.body.userid);
        console.log("getUserInfo : " + req.query.userid);
        
        database.UserModel.findByUserId(userid, function(err, user) {
            console.log("getUserInfo : " + user);
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
    console.log('/users/updateUserInfo 패스 요청됨');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        var userinfo = req.body.userinfo;
        var options = { "criteria": {"userid": userinfo.userid}, "userinfo": userinfo };

        database.UserModel.updateInfo(options, function(err) {
            if (err) {
                console.log("Update.... FAIL " + err);
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
module.exports.userLoginCheck = userLoginCheck;
