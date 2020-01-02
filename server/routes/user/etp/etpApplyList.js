/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var Promise = require("bluebird");
/* logging 추가함.  2019-06-10 */
var log = require('../../../util/logg');

/* 
 * etp 신청 현황  조회한다.
 * 
 *  *  */
var getEtpApplyList = function(req, res) {
  try {
    log.debug('EtpApply=>getEtpApplyList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      inst_cd: req.session.inst_cd == '04870' ? '' : req.session.inst_cd,
    };
    log.debug("options", JSON.stringify(options.inst_cd));
    var stmt = mapper.getStatement('EtpRegister', 'selectEtpApplyList', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows,
          inst_cd: req.session.inst_cd
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
var getEtpApplyDistCnt = function(req, res) {
  try {
    log.debug('EtpApply=>getEtpApplyDistCnt 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      inst_cd: req.session.inst_cd == '04870' ? '' : req.session.inst_cd
    };
    log.debug("options", JSON.stringify(options));
    var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyDistCnt', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
var getEtpApplyIndexCnt = function(req, res) {
  try {
    log.debug('EtpApply=>getEtpApplyIndexCnt 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      inst_cd: req.session.inst_cd == '04870' ? '' : req.session.inst_cd
    };
    log.debug("options", JSON.stringify(options));
    var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyIndexCnt', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
var getEtpApplyCodeCnt = function(req, res) {
  try {
    log.debug('EtpApply=>getEtpApplyCodeCnt 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      inst_cd: req.session.inst_cd == '04870' ? '' : req.session.inst_cd
    };
    log.debug("options", JSON.stringify(options));
    var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyCodeCnt', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
var getEtpApplyInavCnt = function(req, res) {
  try {
    log.debug('EtpApply=>getEtpApplyInavCnt 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      inst_cd: req.session.inst_cd == '04870' ? '' : req.session.inst_cd
    };
    log.debug("options", JSON.stringify(options));
    var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyInavCnt', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
var getCompContactList = function(req, res) {
  try {
    log.debug('EtpApply=>getCompContactList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      inst_cd: req.session.inst_cd == '04870' ? '' : req.session.inst_cd
    };
    log.debug("options", JSON.stringify(options));
    var stmt = mapper.getStatement('EtpRegister', 'getCompContactList', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
var getIdxList = function(req, res) {
  try {
    log.debug('EtpApply=>getIdxList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      "market_id": req.query.market_id,
      "idx_sym_code": req.query.idx_sym_code
    };
    log.debug("options", JSON.stringify(options));
    var stmt = mapper.getStatement('EtpRegister', 'getIdxList', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
var getRidxList = function(req, res) {
  try {
    log.debug('EtpApply=>getRidxList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      "rMarket_id": req.query.rMarket_id,
      "ridx_dist_sym_code": req.query.ridx_dist_sym_code
    };
    log.debug("options", JSON.stringify(options));
    var stmt = mapper.getStatement('EtpRegister', 'getRidxList', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
var deleteEtpApply = function(req, res) {
  try {
    log.debug('EtpApply=>deleteEtpApply 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var params = {
      "user_id": req.session.user_id,
      "seqValues": req.query.seqValues,
      "seq": "",
      "type_cd": req.session.type_cd
    };
    //*** 운영반영시 주석제거***               
    // if(params.type_cd !=='0002'){
    //     res.json({
    //         result: false
    //         ,msg: "코스콤만 삭제가 가능합니다."
    //     });
    //     res.end();
    //     return;
    // }
    var stmt = "";
    var async = require('async');
    var format = {
      language: 'sql',
      indent: ' '
    };

    function replacer(name, val) {
      if(val == '' || val == undefined) {
        return null;
      } else {
        return val; // return unchanged
      }
    }
    async.forEachOfLimit(req.query.seqValues, 1, function(seq, index, cb) {
      log.debug(index + ': ' + seq);
      Promise.using(pool.connect(), conn => {
        async.waterfall([
          function(callback) { //삭제
            params.seq = seq;
            log.debug(params.seq);
            stmt = mapper.getStatement('EtpRegister', 'deleteEtpApply', params, format);
            log.debug(stmt);
            conn.query(stmt, function(err, rows) {
              if(rows) {
                log.debug("deleteEtpApply", rows);
              }
              if(err) {
                return callback(err);
              }
              callback(null, params);
            });
          },
          function(data, callback) { //db 마스터조회
            stmt = mapper.getStatement('EtpRegister', 'getMaster', params, format);
            log.debug(stmt);
            conn.query(stmt, function(err, rows) {
              if(rows) {
                params.dbMasterData = rows[0];
              }
              if(err) {
                return callback(err);
              }
              callback(null, params);
            });
          },
          function(data, callback) { //히스토리 시퀀스확인
            stmt = mapper.getStatement('EtpRegister', 'getMasterHistoryNextSeq', params, format);
            log.debug(stmt);
            conn.query(stmt, function(err, rows) {
              if(rows) {
                params.dbMasterData.seq_hist = rows[0].SEQ_HIST;
                params.dbMasterData.user_id = params.user_id;
              }
              if(err) {
                return callback(err);
              }
              callback(null, params);
            });
          },
          function(data, callback) { //히스토리쌓기
            stmt = mapper.getStatement('EtpRegister', 'insertMasterHistory', JSON.parse(JSON.stringify(params.dbMasterData, replacer)), format);
            log.debug(stmt);
            conn.query(stmt, function(err, rows) {
              if(rows) {
                log.debug("insertMasterHistory", rows);
              }
              if(err) {
                return callback(err);
              }
              callback(null, params);
            });
          }
        ], function(err) {
          if(err) {
            log.error("[err] EtpRegister.deleteEtpApply Error while performing Query.", err);
            res.json({
              result: false,
              msg: err
            });
            res.end();
          } else {
            log.debug(index + ": done")
            cb();
          }
        });
      });
    }, function() {
      log.debug('ALL done');
      res.json({
        result: true
      });
      res.end();
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      result: false,
      msg: exception
    });
    res.end();
  }
};
var getINavList = function(req, res) {
  try {
    log.debug('EtpApply=>getINavList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var options = {
      "isu_srt_cd": req.query.isu_srt_cd,
    };
    log.debug("options", JSON.stringify(options));
    var stmt = mapper.getStatement('EtpRegister', 'getINavList', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      }).catch(err => {
        log.error("Error while performing Query.", err);
        res.json({
          success: false,
          message: err
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
  }
};
module.exports.getEtpApplyList = getEtpApplyList;
module.exports.getEtpApplyDistCnt = getEtpApplyDistCnt;
module.exports.getEtpApplyIndexCnt = getEtpApplyIndexCnt;
module.exports.getEtpApplyCodeCnt = getEtpApplyCodeCnt;
module.exports.getEtpApplyInavCnt = getEtpApplyInavCnt;
module.exports.getCompContactList = getCompContactList;
module.exports.getIdxList = getIdxList;
module.exports.getRidxList = getRidxList;
module.exports.deleteEtpApply = deleteEtpApply;
module.exports.getINavList = getINavList;