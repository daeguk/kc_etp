/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');

var getEtpApplyList = function(req, res) {
    console.log('etpregister 모듈 안에 있는 getetpapplylist 호출됨.');

    var mydb = req.app.get('mydb');
    // var options = {id:'admin'};
    var options = {};
    var stmt = mydb.EtpRegister.selectEtpRegisterList(options);
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

module.exports.getEtpApplyList = getEtpApplyList;