/*
 * Login 위한 라우팅 함수 정의
 *
 * @date 2018-04-05
 * @author shinji
 */
var crypto = require('crypto');
var config = require('../../config/config');

var checkLoginTest = function(req, res) {
    console.log('users 모듈 안에 있는 checkLogin1 호출됨.');

    var mydb = req.app.get('mydb');
    var options = {id:'admin'};
    var stmt = mydb.UserMember.selectUserList(options);
    console.log(stmt);
    
    mydb.db.query(stmt, function(err, rows, fields) {
      if (!err){
        console.log('The solution is: ', rows);
        res.json({ success: false, message: rows });
        res.end();
      }else{
        console.log('Error while performing Query.', err);
      }        
    });
};

//로그인
var checkLogin = function(req, res) {
    console.log('users 모듈 안에 있는 checkLogin 호출됨.');

    // console.dir(req);
    var options = { criteria: {} };
    var userid = req.body.userid;
    var password = req.body.password;
    // 운영으로 갈때 주석풀기
    if(config.runenv == "dev") {
        var ip = "211.255.203.42";
    }else {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    }

    console.log('접속시도IP : ' + ip);
    //접속 허용 시간 
    var dt = new Date();
    var dt_time = dt.getHours();
    console.log('client IP***********--> ' + ip);

    options.criteria.userid = userid;
    options.criteria.hashed_password = crypto.createHash('sha256', config.pwd_salt).update(password).digest('base64');;

    console.log("userid : [" + userid + "]");
    // console.log("hashed_password : [" + options.criteria.hashed_password + "]");

    if (userid.length > 0 && password.length > 0) {
        var UM = req.app.get('database').UserModel;

        UM.loginByUser(options, function(err, user) {
            if (err) {
                console.log("Error.......: " + err);
                res.json({ success: false, message: err });
                res.end();
            }
            // 등록된 사용자가 없는 경우
            if (user.length > 0) {
                console.log('계정 일치.');
                console.log(' 이름 : ' + user[0].name);
                console.log(' IP주소 : ' + user[0].ipaddr);
                console.log(' 접속시간 TO : ' + user[0].starttime);
                console.log(' 접속시간 FROM : ' + user[0].endtime);
                console.log(' 현재 시간대 :' + dt_time);
                var dbIpaddr = user[0].ipaddr.split(',');
                if (dbIpaddr.indexOf(ip) !== -1) { //계정일치, 접속 허용IP 일치
                    if (user[0].starttime <= dt_time && dt_time <= user[0].endtime) {
                        res.json({
                            success: true,
                            message: "OK",
                            userid: userid,
                            username: user[0].name,
                            user_level: user[0].user_level,
                            comp_no: user[0].comp_no,
                            comp_name: user[0].comp_name,
                        });

                        makeSessionKey(req, user[0]);
                        res.end();

                        var visit_day = new Date();
                        // 당일 / 누적 카운팅, 당일 초기화는 cron
                        options = { "criteria": {"userid": userid}, 
                            "userinfo": {$inc: { total_visit: 1, today_visit : 1}, $set:{ last_visitday: visit_day}}};

                        UM.updateInfo(options, function(err) {
                            if (err) {
                                console.log("Visit Update.... FAIL " + err);
                            } else {
                                console.log("Visit Update.... SUCCESS ");
                            }
                        });
                
                    } else {
                        console.log('계정은 일치, IP정보 일치, 접속시간 불일치');
                        res.json({ success: false, message: "No Auth TIME" });
                        res.end();
                    }
                } else {
                    console.log('계정은 일치하지만, IP정보가 다름!!');
                    res.json({ success: false, message: "No Auth IP" });
                    res.end();
                }
            } else {
                console.log('계정 일치하지 않음.');
                res.json({ success: false, message: "ERROR LOGIN" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "ERROR LOGIN" });
        res.end();
    }
};

// 보안을 강화하고자 한다면, session key / IP를 DB에 저장하고 모든 조회시 체크
// route_loader.js 지금은 loginkey == undefined 로만 체크하기로 함
// 필요하면, IP / ID 로 DB 세션값 체크, 속도 이슈 생기면 DB를 REDIS로 구성
var makeSessionKey = function(req, user) {
    var sDate = new Date();

    req.session.loginkey = user.ipaddr + "_" + user.userid + "_" + sDate.toString();
    req.session.save();
    console.log("session loginkey: " + req.session.loginkey);
}

//방문자수 카운트 후 업데이트
var countInfo = function(req, res) {
    console.log('login 모듈 안에 있는 countInfo 호출됨.');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        //카운트 조회
        database.CountModel.getVisitCount(function(err, count) {
            if (err) {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();

                //결과값(count)이 있으면
            } else if (count) {
                //이 함수는 로그인 모듈(gubun==1)과 사용자설정화면(gubun==2)에서 같이 쓰기 때문에 구분함
                //로그인 모듈에서는 로그인 후 방문자수 업데이트
                if (req.query.gubun == 1) {
                    // console.log('로그인 count 있음');

                    var indate = req.query.vueDate;
                    // console.log('vue에서 받은 오늘 날짜:'+ indate);
                    var ddd = count[0].updated_at;
                    var inputDate = ddd.toISOString().substr(0, 10);

                    // console.log('DB에서 가져온 마지막 날짜 :'+ ddd);
                    // console.log('DB에서 가져온 마지막 날짜 변환 :'+ inputDate);

                    //조회날짜와 DB날짜가 같다면 (조회시점이 오늘이라면)
                    if (indate === inputDate) {
                        //같은 날짜라면 오늘 방문자수 +1 
                        var today_count = count[0].today_count + 1;
                        var total_count = count[0].total_count + 1;
                        // console.log("같은날짜 today_count : [" + today_count + "] total_count : [" + total_count + "]");
                    } else {
                        //다른날짜면 오늘방문자수 = 0에서 시작
                        var today_count = 1;
                        var total_count = count[0].total_count + 1;
                        // console.log("다른날짜 0에서 시작 today_count : [" + today_count + "] total_count : [" + total_count + "]");
                    }

                    var uDate = new Date();
                    // console.log('uDate: '+uDate);
                    var options = { "today_count": today_count, "total_count": total_count, "updated_at": uDate }

                    //방문자수 업데이트 
                    database.CountModel.updateCountInfo(options, function(err) {
                        if (err) {
                            console.log("UpdateCountInfo.... FAIL " + err);
                            res.json({ success: false, message: "FAIL" });
                            res.end();
                        } else {
                            console.dir("UpdateCountInfo.... OK ");
                            res.json({ success: true, message: "OK" });
                            res.end();
                        }
                    });
                    //사용자설정 화면에서 CALL
                } else if (req.query.gubun == 2) {
                    //카운트만 가져오기
                    // console.log('사용자설정 화면에서 CALL...');
                    var today_count = count[0].today_count;
                    var total_count = count[0].total_count;

                    res.json({ success: true, message: "OK", dayCount: today_count, totalCount: total_count });
                    res.end();
                };
                //결과값(count)가 없음   
            } else {
                res.json({ success: false, message: "No Data" });
                res.end();
            };
        }); //getVisitCount 끝

        //database.db 데이터베이스 connection ERROR
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

module.exports.checkLoginTest = checkLoginTest;
module.exports.checkLogin = checkLogin;