/*
 * 사용자설정 관련 라우팅 함수 정의
 *
 * @date 2018-09-11
 * @author threeon
 */
var crypto = require('crypto');
var config = require('../../config/config');

// 사용사 정보 조회
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
