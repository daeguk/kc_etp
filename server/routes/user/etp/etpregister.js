/*
 *  ETP 등록화면
 */
var config = require('../../../config/config');
var Promise = require("bluebird");
var async = require('async');
const etpUser = "0001";
const etnUser = "0002";
const koscomUser = "9998";
const koscomSuperUser = "9999";
/* logging 추가함.  2019-06-10 */
var log = require('../../../util/logg');
var format = {
  language: 'sql',
  indent: ''
};

var getEtpRegisterView = function(req, res) {
  try {
    log.debug('###ETP VIEW CALL###', req.query.seq);
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var paramData = {};
    var resultMsg = {};
    paramData.seq = req.query.seq * 1;
    paramData.user_id = req.session.user_id;
    paramData.inst_cd = req.session.inst_cd;
    paramData.inst_type_cd = req.session.type_cd;
    if(paramData.inst_type_cd !== etpUser && paramData.inst_type_cd !== etnUser && paramData.inst_type_cd !== koscomUser && paramData.inst_type_cd !== koscomSuperUser) {
      resultMsg.result = false;
      resultMsg.msg = "발행사만 신청이 가능합니다. ";
      throw resultMsg;
    }
    log.debug('###ETP VIEW CALL sessioncheck###');
    var param = {
      userType: '0001',
      lCd: '004',
      seq: paramData.seq,
      inst_cd: paramData.inst_cd,
      inst_type_cd: paramData.inst_type_cd
    };
    var stmt = '';
    Promise.using(pool.connect(), conn => {
      async.waterfall([
        //발행사
        function(callback) {
          stmt = mapper.getStatement('EtpRegister', 'getCompList', param, format);
          log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            if(rows) {
              resultMsg.compList = rows;
            }
            //log.debug(rows);
            callback(null, param);
          });
        },
        function(data, callback) { //지수산출/입수기관
          stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
          //log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            if(rows) {
              resultMsg.code004List = rows;
            }
            callback(null, param);
            //log.debug(rows);
          });
        },
        function(data, callback) { //휴장일기준
          param.lCd = '005'
          stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
          //log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            if(rows) {
              resultMsg.code005List = rows;
            }
            callback(null, param);
            // log.debug(rows);
          });
        },
        function(data, callback) { //적용환율
          param.lCd = '006'
          stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
          // log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            if(rows) {
              resultMsg.code006List = rows;
            }
            callback(null, param);
            // log.debug(rows);
          });
        },
        function(data, callback) { //iNav/ilv 계산식
          param.lCd = '007'
          stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
          //log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            if(rows) {
              resultMsg.code007List = rows;
            }
            callback(null, param);
            // log.debug(rows);
          });
        },
        function(data, callback) { //국내지수산출기관
          param.lCd = '008'
          stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
          // log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            if(rows) {
              resultMsg.code008List = rows;
            }
            callback(null, param);
            // log.debug(rows);
          });
        },
        function(data, callback) { //국내지수타입
          param.lCd = '009'
          stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
          // log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            if(rows) {
              resultMsg.code009List = rows;
            }
            callback(null, param);
            // log.debug(rows);
          });
        },
        function(data, callback) { //사무수탁사
          param.lCd = '010'
          stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
          //  log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            if(rows) {
              resultMsg.code010List = rows;
            }
            callback(null, param);
          });
        },
        function(data, callback) { //update 화면에조회될 기본정보
          stmt = mapper.getStatement('EtpRegister', 'getMaster', param, format);
          // log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
            resultMsg.masterData = rows;
            if(rows[0] !== undefined && rows[0] !== null) {
              var idxFileNm = rows[0].idx_file_nm;
              if(idxFileNm !== null && idxFileNm !== '' && idxFileNm !== undefined) {
                var idx = idxFileNm.lastIndexOf("/");
                if(idx > 0) {
                  var idxFilePath = idxFileNm.substring(0, idx);
                  var newIdxFileNm = idxFileNm.substring(idx + 1, idxFileNm.length);
                  resultMsg.masterData[0].idx_file_nm = newIdxFileNm;
                  resultMsg.masterData[0].idx_file_path = idxFilePath;
                }
              }
            }
            callback(null, param);
          });
        },
      ], function(err) {
        if(err) {
          log.debug(err);
        } else {
          resultMsg.result = true;
          resultMsg.msg = "";
          resultMsg.err = null;
          resultMsg.params = param;
        }
        res.json(resultMsg);
        res.end();
      });
    });
  } catch (exception) {
    log.debug(exception);
    if(resultMsg && !resultMsg.msg) {
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      resultMsg.err = exception;
    }
    resultMsg.compList = {};
    resultMsg.code004List = [];
    resultMsg.code005List = [];
    resultMsg.code006List = [];
    resultMsg.code007List = [];
    resultMsg.code008List = [];
    resultMsg.code009List = [];
    resultMsg.code010List = [];
    resultMsg.masterData = [];
    res.json(resultMsg);
    res.end()
  }
};
var insertEtpRegister = function(req, res) {
  var pool = req.app.get("pool");
  var mapper = req.app.get("mapper");
  log.debug('###ETP INSERT CALL JSONPARSE BEFORE>>>###' + req.body.data);
  var paramData = JSON.parse(req.body.data);
  paramData.user_id = req.session.user_id;
  //일반->  세션
  //코스콤->선택값
  if(req.session.type_cd !== koscomSuperUser && req.session.type_cd !== koscomUser) {
    paramData.inst_cd = paramData.paramInstCd;
  }
  //개발용 세팅
  // paramData.inst_cd       =   '04870';
  // paramData.inst_type_cd  =   '0002';
  log.debug("###ETP INSERT CALL HUDLE1##", req.session);
  if(req.session == '') {
    res.json({
      result: false,
      msg: "잘못된 접속입니다."
    });
    res.end();
    return;
  }
  log.debug("###ETP INSERT CALL HUDLE2##", paramData);
  if(paramData.paramInstTypeCd !== etpUser && paramData.paramInstTypeCd !== etnUser && paramData.paramInstTypeCd !== koscomUser && paramData.paramInstTypeCd !== koscomSuperUser) {
    res.json({
      result: false,
      msg: "발행사만 신청이 가능합니다."
    });
    res.end();
    return;
  }
  log.debug("###ETP INSERT CALL HUDLE JUMP SUCCESS");
  paramData.list_req_date = paramData.listReqDate; //##이값만 바인딩이 안된다..이상하다..
  paramData.list_date = paramData.listDate;
  var isin_code = paramData.isin_code; //단축코드
  var list_req_date = paramData.list_req_date; //상장신청일
  var list_date = paramData.list_date; //상장일
  var inav_calc_yn = paramData.inav_calc_yn; //iNAV산출여부
  var idx_rec_yn = paramData.idx_rec_yn; //기초지수입수여부
  var isin_stat_cd = paramData.isin_stat_cd; //상태
  var real_yn = paramData.real_yn; //실시간 지수반영여부
  var isu_srt_cd = paramData.isu_srt_cd; //종목코드
  paramData.isin_stat_cd = "0001"; //등록시 초기값
  if(isin_code !== "" && isin_code !== undefined) {
    if(list_req_date == '' && list_req_date !== undefined) {
      res.json({
        result: false,
        msg: "종목코드 입력 시 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
    if(list_date == '' && list_date !== undefined) {
      res.json({
        result: false,
        msg: "종목코드 입력 시 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
  }
  if(inav_calc_yn !== "" && inav_calc_yn !== "N" && inav_calc_yn !== undefined) {
    if(isin_code == '' && isin_code !== undefined) {
      res.json({
        result: false,
        msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
    if(list_req_date == '' && list_req_date !== undefined) {
      res.json({
        result: false,
        msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
    if(list_date == '' && list_date !== undefined) {
      res.json({
        result: false,
        msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
  }
  //기초지수 입수여부: Y
  // => 상태코드: 0002(기초지수)
  if(idx_rec_yn == 'Y') {
    paramData.isin_stat_cd = '0002';
  }
  // 상태코드 : 0002(기초지수)
  // 종목코드 단축코드 존재 
  // => 상태코드: 0003(종목코드)
  if(isin_stat_cd == '0002' && isin_code !== '' && isu_srt_cd !== '') {
    paramData.isin_stat_cd = '0003';
  }
  // iNAV 산출여부 : Y
  // => 상태코드:  0004
  if(inav_calc_yn == 'Y') {
    paramData.isin_stat_cd = '0004';
  }
  //기초지수입수여부 : N
  // => 상태코드: 0001(신청)
  if(idx_rec_yn == 'N') {
    paramData.isin_stat_cd = '0001';
  }
  if(real_yn == 'N') {
    paramData.ridx_dist_inst_cd = null; //지수입수기관
    paramData.ridx_dist_sym_code = null; //지수입수기관심볼
    paramData.ridx_holy_cd = null; //실시간휴장일기준
    paramData.ridx_comp_dist_yn = null; //발행사
    paramData.ridx_krx_dist_yn = null; //KRX 
    paramData.ridx_ksd_dist_yn = null; //예탁원
    paramData.ridx_mirae_dist_yn = null; //미래에셋펀드서비스
    paramData.ex_hedge_yn = null; //환헷지여부
    paramData.ridx_dist_term = null; //지수제공주기
  }
  if(paramData.kor_for_type == 'K') {
    paramData.idx_sym_code = paramData.kor_idx_sym_code;
    paramData.idx_nm = paramData.kor_idx_nm;
    paramData.user_req = paramData.kor_user_req;
  }
  log.debug('###ETP CALL JSONPARSE LAST>>>###' + JSON.stringify(paramData));
  var stmt = '';
  log.debug(stmt);
  Promise.using(pool.connect(), conn => {
    try {
      async.waterfall([
        function(callback) {
          stmt = mapper.getStatement('EtpRegister', 'insertMaster', paramData, format);
          log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(rows) {
              log.debug("insertMaster", rows);
              paramData.seq = rows.insertId;
            }
            if(err) {
              return callback(err);
            }
            callback(null, paramData);
          })
        },
        function(data, callback) {
          log.debug("EtpRegister paramData insertMasterHistory before", paramData);
          paramData.seq_hist = 1;
          stmt = mapper.getStatement('EtpRegister', 'insertMasterHistory', paramData, format);
          log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(rows) {
              log.debug("insertMasterHistory", rows);
            }
            if(err) {
              return callback(err);
            }
            callback(null, paramData);
          });
        },
      ], function(err) {
        if(err) {
          log.debug("[err] EtpRegister.insertMaster Error while performing Query.", err);
          res.json({
            result: false,
            msg: err
          });
        } else {
          res.json({
            result: true
          });
        }
        res.end();
      });
    } catch (exception) {
      log.debug("[error] EtpRegister.insertMaster Error while performing Query.", exception);
      res.json({
        result: false,
        msg: exception
      });
      res.end();
    }
  });
};
var updateEtpRegister = function(req, res) {
  var pool = req.app.get("pool");
  var mapper = req.app.get("mapper");
  //log.debug('###ETP UPDATE JSONPARSE BEFORE>>>###'+req.body.data);
  var paramData = JSON.parse(req.body.data);
  paramData.user_id = req.session.user_id;
  if(req.session.type_cd !== koscomSuperUser && req.session.type_cd !== koscomUser) {
    paramData.inst_cd = paramData.paramInstCd;
  }
  if(req.session == '') {
    res.json({
      result: false,
      msg: "잘못된 접속입니다."
    });
    res.end();
    return;
  }
  paramData.list_req_date = paramData.listReqDate;
  paramData.list_date = paramData.listDate;
  if(paramData.real_yn == 'N') {
    paramData.ridx_dist_inst_cd = null; //지수입수기관
    paramData.ridx_dist_sym_code = null; //지수입수기관심볼
    paramData.ridx_holy_cd = null; //실시간휴장일기준
    paramData.ridx_comp_dist_yn = null; //발행사
    paramData.ridx_krx_dist_yn = null; //KRX 
    paramData.ridx_ksd_dist_yn = null; //예탁원
    paramData.ridx_mirae_dist_yn = null; //미래에셋펀드서비스
    paramData.ex_hedge_yn = null; //환헷지여부
    paramData.ridx_dist_term = null; //지수제공주기
  }
  if(paramData.kor_for_type == 'K') {
    paramData.idx_sym_code = paramData.kor_idx_sym_code;
    paramData.idx_nm = paramData.kor_idx_nm;
    paramData.user_req = paramData.kor_user_req;
  }
  if(paramData.isin_code !== "" && paramData.isin_code !== undefined) {
    if(paramData.list_req_date == '' && paramData.list_req_date !== undefined) {
      res.json({
        result: false,
        msg: "종목코드 입력 시 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
    if(paramData.list_date == '' && paramData.list_date !== undefined) {
      res.json({
        result: false,
        msg: "종목코드 입력 시 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
  }
  if(paramData.inav_calc_yn !== "" && paramData.inav_calc_yn !== "N" && paramData.inav_calc_yn !== undefined) {
    if(paramData.isin_code == '' && paramData.isin_code !== undefined) {
      res.json({
        result: false,
        msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
    if(paramData.list_req_date == '' && paramData.list_req_date !== undefined) {
      res.json({
        result: false,
        msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
    if(paramData.list_date == '' && paramData.list_date !== undefined) {
      res.json({
        result: false,
        msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
      });
      res.end();
      return;
    }
  }
  // 상태코드          : 신청 (0001)
  // 기초지수입수여부   : Y
  // => 상태코드 기초지수상태(0002)
  if(paramData.isin_stat_cd == '0001' && paramData.idx_rec_yn == 'Y') {
    paramData.isin_stat_cd = '0002';
  }
  // 상태코드          : 기초지수상태 (0002)
  // 단축코드존재, 종목코드 존재 
  // => 상태코드 종목코드(0003)
  if(paramData.isin_stat_cd == '0002' && paramData.isin_code !== '' && paramData.isu_srt_cd !== '') {
    paramData.isin_stat_cd = '0003';
  }
  // iNAV산출여부 : Y
  //  => 상태코드 0004
  if(paramData.inav_calc_yn == 'Y') {
    paramData.isin_stat_cd = '0004';
  }
  /*
      // iNAV산출여부 : N  
      // 상태코드      :0004
      // => 상태코드 종목코드(0003)
      if(paramData.isin_stat_cd =='0004' && paramData.inav_calc_yn == 'N'){
          paramData.isin_stat_cd ='0003';
      }

      // 상태코드      :0002 OR 0001
      // 기초지수입수여부 : N 
      // 기초지수입수여부가 우선 
      // => 상태코드 종목코드(0001)
      if((paramData.isin_stat_cd =='0001' || paramData.isin_stat_cd =='0002')
          &&paramData.idx_rec_yn == 'N'){
          paramData.isin_stat_cd ='0003';
      }
   */
  //log.debug('###ETP UPDATE JSONPARSE LAST>>>###', paramData);
  var dbMasterData;
  var stmt = '';
  Promise.using(pool.connect(), conn => {
    try {
      async.waterfall([
        function(callback) { //db isin_stat_cd 값 상태 확인
          stmt = mapper.getStatement('EtpRegister', 'getMaster', paramData, format);
          conn.query(stmt, function(err, rows) {
            if(rows) {
              dbMasterData = rows[0];
              //log.debug("UPDATE BEFORE MASTER Data:::", dbMasterData.isin_stat_cd);
              if(
                (dbMasterData.inst_cd !== paramData.paramInstCd) && (req.session.type_cd !== koscomSuperUser && req.session.type_cd !== koscomUser)) {
                return callback("해당 발행사나 코스콤만 수정이 가능합니다.");
              }
              // iNAV산출여부 : N
              // DB 상태코드: 0004
              //  => 상태코드 0003
              if(paramData.inav_calc_yn == 'N' && dbMasterData.isin_stat_cd == '0004') {
                paramData.isin_stat_cd = '0003';
              }
              // DB 상태코드: 0002 OR 0001
              // 기초지수입수여부   : N
              // 기초지수입수여부가 우선
              if(dbMasterData.isin_stat_cd == '0001' || dbMasterData.isin_stat_cd == '0002') {
                if(paramData.idx_rec_yn == 'N') {
                  paramData.isin_stat_cd = '0001';
                }
              }
            }
            if(err) {
              return callback(err);
            }
            callback(null, paramData);
          });
        },
        function(data, callback) {
          log.debug(paramData);
          stmt = mapper.getStatement('EtpRegister', 'updateMaster', paramData, format);
          log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(rows) {
              log.debug("updateMaster", rows);
            }
            if(err) {
              return callback(err);
            }
            callback(null, paramData);
          });
        },
        function(data, callback) {
          stmt = mapper.getStatement('EtpRegister', 'getMasterHistoryNextSeq', paramData, format);
          conn.query(stmt, function(err, rows) {
            if(rows) {
              // log.debug( "getMasterHistoryNextSeq", rows[0].SEQ_HIST);
              paramData.seq_hist = rows[0].SEQ_HIST;
              //  log.debug("EtpRegister paramData", paramData);
            }
            if(err) {
              return callback(err);
            }
            callback(null, paramData);
          });
        },
        function(data, callback) {
          log.debug("EtpRegister paramData insertMasterHistory before", paramData);
          stmt = mapper.getStatement('EtpRegister', 'insertMasterHistory', paramData, format);
          log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            if(rows) {
              log.debug("insertMasterHistory", rows);
            }
            if(err) {
              return callback(err);
            }
            callback(null, paramData);
          });
        },
      ], function(err) {
        if(err) {
          log.debug("[err] EtpRegister.updateEtpRegister Error while performing Query.", err);
          res.json({
            result: false,
            msg: err
          });
        } else {
          res.json({
            result: true
          });
        }
        res.end();
      });
    } catch (exception) {
      log.debug("[error] EtpRegister.updateEtpRegister Error while performing Query.", exception);
      res.json({
        result: false,
        msg: exception
      });
      res.end();
    }
  });
};
module.exports.getEtpRegisterView = getEtpRegisterView;
module.exports.insertEtpRegister = insertEtpRegister;
module.exports.updateEtpRegister = updateEtpRegister;