/*
 * 사용자설정 관련 라우팅 함수 정의
 *
 * @date 2018-09-11
 * @author threeon
 */
var crypto = require('crypto');
var config = require('../../config/config');

//사용자설정 메뉴의 고객사 리스트 가져오기
var userList = function(req, res) {
    console.log('/admin/userList 패스 요청됨.');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var options = {
            "criteria": {},
            "perPage": req.query.perPage,
            "curPage": req.query.curPage
        };

        if(req.query.searchinfo != '') {
            var sinfo = '.*' + req.query.searchinfo + '*.';
            if(req.query.seloption == 'userid') {
                options.criteria = { $and: [ { userid : {$regex : sinfo, $options:"i" }}, ] };
            }else if(req.query.seloption == 'comp_name') {
                options.criteria = { $and: [ { comp_name : {$regex : sinfo, $options:"i" }}, ] };
            }else {
                options.criteria = { $and: [ { name : {$regex : sinfo, $options:"i" }}, ] };
            }
        }

        database.UserModel.countAllUser(function(err, userCnt) {
            // console.log("userCnt : " + userCnt);
            if(userCnt > 0) {
                database.UserModel.findByOptions(options, function(err, results) {
                    if(results.length == 0) {
                        res.json({ success: false, message: "No Data" });
                        res.end();
                    }else {
                        var totalPage = Math.ceil(userCnt / req.query.perPage);
                        console.log(" totalPage : " + totalPage) ;
                        var pageInfo = {
                            "totalPage": totalPage,
                            "perPage": req.query.perPage,
                            "curPage": req.query.curPage
                        };
                        var resBody = { "pageInfo": pageInfo, "userslist": results };
    
                        res.json(resBody);
                        res.end();
                    }
                });
            }else {
                res.json({ success: false, message: "No Data" });
                res.end();
            }
        });

    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//신규사용자 중복확인
var useridCheck = function(req, res) {
    console.log('/admin/useridCheck 패스 요청됨 ');
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        var userid = req.body.userid;
        database.UserModel.findByUserId(userid, function(err, user) {
            if (err) {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            } else if (user) {
                console.log(user);
                if (user[0] == null) {
                    console.log("사용가능한 ID..1");
                    res.json({ success: false, message: "No ID" });
                    res.end();
                } else {
                    console.log("존재하는 ID..");
                    res.json({ success: true, message: "HAS ID" });
                    res.end();
                }
            } else {
                console.log("사용가능한 ID..2");
                res.json({ success: false, message: "No ID" });
                res.end();
            }
        });

    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
}

//비밀번호 초기화
var pwdInit = function(req, res) {
    console.log('/admin/pwdInit 패스 요청됨');
    var database = req.app.get('database');

    if (database.db) {
        var userid = req.body.userid;
        console.log("salt : " + config.pwd_salt);
        var hashed_password = crypto.createHash('sha256', config.pwd_salt).update(config.pwd_default).digest('base64');

        console.log("hash : " + hashed_password);
        var options = { "criteria": { "userid": userid }, "pwdInfo": {"hashed_password": hashed_password} };

        database.UserModel.pwdChange(options, function(err, result) {
            if (err) {
                console.log("pwdInit.... Initialize ERROR " + err);
                res.json({ success: false, message: "Initialize ERROR !!" });
                res.end();
            } else {
                console.dir("pwdInit.... OK : " + result);
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

//비밀번호 수정
var pwdChange = function(req, res) {
    console.log('/admin/pwdChange 패스 요청됨');
    var database = req.app.get('database');

    if (database.db) {
        var userid = req.body.userid;
        var oldPwd = req.body.oldPwd;
        var newPwd = req.body.newPwd;

        var options = {"criteria": {}};
        var old_hashed_password = crypto.createHash('sha256', config.pwd_salt).update(oldPwd).digest('base64');
        options.criteria.userid = userid;
        options.criteria.hashed_password = old_hashed_password;
    
        database.UserModel.loginByUser(options, function(err, user) {
            if (err) {
                console.log(" pwdChange DB Error.......: " + err);
                res.json({ success: false, message: err });
                res.end();
            }else if(user.length){
                var new_hashed_password = crypto.createHash('sha256', config.pwd_salt).update(newPwd).digest('base64');

                console.log("hash : " + new_hashed_password);
                var options1 = { "criteria": { "userid": userid }, "pwdInfo": {"hashed_password": new_hashed_password} };
    
                database.UserModel.pwdChange(options1, function(err, result) {
                    if (err) {
                        console.log("pwdChange.... Initialize ERROR " + err);
                        res.json({ success: false, message: "Initialize ERROR !!" });
                        res.end();
                    } else {
                        console.dir("pwdChange.... OK : " + result);
                        res.json({ success: true, message: "OK" });
                        res.end();
                    }
                });
            }else {                
                console.log(" pwdChange PASSWORD Error.......: ");
                res.json({ success: false, message: "패스워드가 틀렸습니다." });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

//신규사용자 등록
var insertInfo = function(req, res) {
    console.log('/users/insertinfo 패스 요청됨 ');

    var database = req.app.get('database');
    var hashed_password = crypto.createHash('sha256', config.pwd_salt).update(config.pwd_default).digest('base64');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var userinfo = req.body.userinfo;
        userinfo.hashed_password = hashed_password;

        var options = { "criteria": {}, "userinfo": userinfo };

        var UM = new database.UserModel(options.userinfo);
        UM.insertInfo(function(err, result) {
            if (err) {
                console.log("Insert.... FAIL");
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.log("Insert.... OK");
                console.log(result);
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};


//사용자정보 수정
var updateInfo = function(req, res) {
    console.log('/users/updateinfo 패스 요청됨');

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
                console.log("Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//사용자 삭제
var deleteInfo = function(req, res) {
    console.log('/users/deleteinfo 패스 요청됨.');

    var database = req.app.get('database');
    if (database.db) {
        var bbs_id = req.body.bbs_id;
        var userinfo = req.body.userinfo;
        var options = { "criteria": {"userid": userinfo.userid }, "userinfo": userinfo };

        database.UserModel.deleteInfo(options, function(err) {
            if (err) {
                console.log("Delete.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("Delete.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

module.exports.userList = userList;
module.exports.useridCheck = useridCheck;
module.exports.pwdInit= pwdInit;
module.exports.pwdChange= pwdChange;
module.exports.insertInfo = insertInfo;
module.exports.updateInfo = updateInfo;
module.exports.deleteInfo = deleteInfo;
