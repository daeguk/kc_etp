/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var sms = require('../../../util/sms');
var Promise = require("bluebird");
var log = require('../../../util/logg');

/*
 * 고객지원 정보를 저장한다.
 * 2019-05-03  bkLove(촤병국)
 */
var saveCustSupport = function(req, res) {
  try {
    log.debug('custSupport.saveCustSupport 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] custSupport.saveCustSupport  req.body.data no data.", req.body.data);
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      throw resultMsg;
    }
    var paramData = JSON.parse(JSON.stringify(req.body.data));
    paramData.user_id = (req.session.user_id ? req.session.user_id : "");
    paramData.inst_cd = (req.session.inst_cd ? req.session.inst_cd : "");
    paramData.type_cd = (req.session.type_cd ? req.session.type_cd : "");
    paramData.large_type = (req.session.large_type ? req.session.large_type : "");
    paramData.krx_cd = (req.session.krx_cd ? req.session.krx_cd : "");
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      try {
        if(paramData.contents) {
          paramData.subject = paramData.contents.substr(0, 30);
        }
        stmt = mapper.getStatement('custSupport', 'saveCustSupport', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          resultMsg.result = true;
          resultMsg.msg = "성공적으로 전송하였습니다.";
          resultMsg.err = "";
          var msg = "고객지원 접수되었습니다. [" + paramData.subject + "]";
          console.log(msg);
          sms.smsSend(1, msg)
          res.json(resultMsg);
          res.end();
        });
      } catch (err) {
        log.error(err, stmt, paramData);
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = err;
        res.json(resultMsg);
        res.end();
      }
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    if(resultMsg && !resultMsg.msg) {
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      resultMsg.err = expetion;
    }
    resultMsg.dataList = [];
    res.json(resultMsg);
    res.end();
  }
}
module.exports.saveCustSupport = saveCustSupport;