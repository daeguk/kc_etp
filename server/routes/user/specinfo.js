/*
 * 사용자 보안관제 특이사항
 *
 * @date 2018-09-19
 * @author ThreeOn
 */
var config = require('../../config/config');

// 사용사 특이사항 정보 조회
var getUserSpecInfo = function(req, res) {
    console.log('/user/getUserSpecInfo 패스 요청됨.');
    console.log(req.body);
    
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var options = {
            "criteria": { "bbs_id": req.query.bbs_id, 
                "comp_no": req.query.comp_no,
                "notice": req.query.notice},
        }
        
        database.BoardModel.getUserSpecInfo(options, function(err, results) {
            console.log(results);
            if(results.length == 0) {
                res.json({ success: false, message: "No Data" });
                res.end();
            }else {
                var resBody = {"specinfo": results};
                res.json(resBody);
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

module.exports.getUserSpecInfo = getUserSpecInfo;
