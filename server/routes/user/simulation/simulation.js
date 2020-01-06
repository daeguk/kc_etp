/*
 *  시뮬레이션 관련 정보
 *
 *  @date 2019-07-26
 *  @author bkLove
 */
var config = require('../../../config/config');
var util = require('../../../util/util');
var Promise = require("bluebird");
// var multer = require('multer');
// var xlsx = require('xlsx');
var async = require('async');
var _ = require("lodash");
var simulationBacktest = require('./simulationBacktest');
var log = require('../../../util/logg');
var limit = {
  divide_size: 100,
  result_dive_size: 5
};
var INIT_START_YEAR = {
  value: 2000,
  text: "2000"
}; /* 시작년도 최초값 */
var SEARCH_SCEN_NAME = "unnamed"; /* 시나리오명 prefix */
var initGrpInfo = {
  INIT_GRP_CD: "*" /* 그룹코드 최초값 */ ,
  INIT_INCRE_GRP_CD: 100000 /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
};

/*
 * 상위 그룹정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getInitGrpCd = function(req, res) {
  try {
    log.debug('simulation.getInitGrpCd 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getInitGrpCd  req.body.data no data.", req.body.data);
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
    resultMsg.dataList = [{
      grp_cd: initGrpInfo.INIT_GRP_CD,
      grp_name: "선택안함",
      org_grp_cd: initGrpInfo.INIT_GRP_CD,
      grp_yn: "0"
    }];
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      try {
        stmt = mapper.getStatement('simulation', 'getInitGrpCd', paramData, format);
        log.debug(stmt, paramData);
        if(paramData.now_grp_cd && paramData.now_grp_cd == initGrpInfo.INIT_GRP_CD) {
          resultMsg.dataList = [];
        }
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          } else if(rows && rows.length > 0) {
            resultMsg.dataList.push(...rows);
            resultMsg.result = true;
            resultMsg.msg = "";
          } else {
            resultMsg.result = true;
            resultMsg.msg = "";
          }
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
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.dataList = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * next 시나리오명을 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getNextScenName = function(req, res) {
  try {
    log.debug('simulation.getNextScenName 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getNextScenName  req.body.data no data.", req.body.data);
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
        paramData.search_scen_name = SEARCH_SCEN_NAME;
        stmt = mapper.getStatement('simulation', 'getNextScenName', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          if(rows && rows.length == 1) {
            resultMsg.scen_name = rows[0].next_scen_name;
            resultMsg.result = true;
            resultMsg.msg = "";
          }
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
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.scen_name = "";
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 시뮬레이션 공통코드 초기 데이터를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getInitData = function(req, res) {
  try {
    log.debug('simulation.getInitData 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getInitData  req.body.data no data.", req.body.data);
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
    resultMsg.arr_start_year = []; /* 초기설정 시작년도 array */
    resultMsg.arr_rebalance_cycle_cd = []; /* 초기설정 리밸런싱주기 array */
    resultMsg.arr_rebalance_date_cd = []; /* 초기설정 리밸런싱일자 array */
    resultMsg.arr_bench_mark_cd = []; /* 초기설정 벤치마크 array */
    resultMsg.arr_importance_method_cd = []; /* 초기설정 비중설정방식 array */
    resultMsg.arr_stock_gubun = []; /* 초기설정 주식수구분 array */
    resultMsg.arrMsg = [];
    resultMsg.result = true;
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      try {
        /* 초기설정 시작년도 array */
        var nowYear = new Date().getFullYear();
        for(var i = INIT_START_YEAR.value; i <= nowYear; i++) {
          resultMsg.arr_start_year.push({
            value: new String(i),
            text: new String(i)
          });
        }
        stmt = mapper.getStatement('simulation', 'getInitData', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          if(rows && rows.length > 0) {
            for(var i in rows) {
              if(rows[i].com_mst_cd) {
                switch (rows[i].com_mst_cd) {
                  /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
                  case "COM006":
                    resultMsg.arr_rebalance_cycle_cd.push(rows[i]);
                    break;
                    /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
                  case "COM007":
                    resultMsg.arr_rebalance_date_cd.push(rows[i]);
                    break;
                    /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
                  case "COM008":
                    resultMsg.arr_bench_mark_cd.push(rows[i]);
                    break;
                    /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
                  case "COM009":
                    resultMsg.arr_importance_method_cd.push(rows[i]);
                    break;
                    /* COM013 - 주식수 구분 ( 1-유동주식수, 2-상장주식수 ) */
                  case "COM013":
                    resultMsg.arr_stock_gubun.push(rows[i]);
                    break;
                }
              }
            }
          }
          var v_index = -1;
          /* 초기설정 시작년도 array */
          if(resultMsg.arr_start_year.length == 0) {
            resultMsg.result = false;
            resultMsg.msg = "초기 데이터 [시작년도] 값이 존재하지 않습니다.";
            resultMsg.arrMsg.push(resultMsg.msg);
          }
          /* 초기설정 리밸런싱주기 array */
          if(resultMsg.result) {
            v_index = _.findIndex(paramData.arrComMstCd, function(o) {
              return o == "COM006"
            });
            if(v_index > -1 && resultMsg.arr_rebalance_cycle_cd.length == 0) {
              resultMsg.result = false;
              resultMsg.msg = "초기 데이터 [리밸런싱주기] 값이 존재하지 않습니다.";
              resultMsg.arrMsg.push(resultMsg.msg);
            }
          }
          /* 초기설정 리밸런싱일자 array */
          if(resultMsg.result) {
            v_index = _.findIndex(paramData.arrComMstCd, function(o) {
              return o == "COM007"
            });
            if(v_index > -1 && resultMsg.arr_rebalance_date_cd.length == 0) {
              resultMsg.result = false;
              resultMsg.msg = "초기 데이터 [리밸런싱일자] 값이 존재하지 않습니다.";
              resultMsg.arrMsg.push(resultMsg.msg);
            }
          }
          /* 초기설정 벤치마크 array */
          if(resultMsg.result) {
            v_index = _.findIndex(paramData.arrComMstCd, function(o) {
              return o == "COM008"
            });
            if(v_index > -1 && resultMsg.arr_bench_mark_cd.length == 0) {
              resultMsg.result = false;
              resultMsg.msg = "초기 데이터 [벤치마크] 값이 존재하지 않습니다.";
              resultMsg.arrMsg.push(resultMsg.msg);
            }
          }
          /* 초기설정 비중설정방식 array */
          if(resultMsg.result) {
            v_index = _.findIndex(paramData.arrComMstCd, function(o) {
              return o == "COM009"
            });
            if(v_index > -1 && resultMsg.arr_importance_method_cd.length == 0) {
              resultMsg.result = false;
              resultMsg.msg = "초기 데이터 [비중설정방식] 값이 존재하지 않습니다.";
              resultMsg.arrMsg.push(resultMsg.msg);
            }
          }
          /* 초기설정 주식수구분 array */
          if(resultMsg.result) {
            v_index = _.findIndex(paramData.arrComMstCd, function(o) {
              return o == "COM013"
            });
            if(v_index > -1 && resultMsg.arr_stock_gubun.length == 0) {
              resultMsg.result = false;
              resultMsg.msg = "초기 데이터 [주식수 구분] 값이 존재하지 않습니다.";
              resultMsg.arrMsg.push(resultMsg.msg);
            }
          }
          if(resultMsg.result) {
            resultMsg.result = true;
            resultMsg.msg = "";
          }
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
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_start_year = []; /* 초기설정 시작년도 array */
    resultMsg.arr_rebalance_cycle_cd = []; /* 초기설정 리밸런싱주기 array */
    resultMsg.arr_rebalance_date_cd = []; /* 초기설정 리밸런싱일자 array */
    resultMsg.arr_bench_mark_cd = []; /* 초기설정 벤치마크 array */
    resultMsg.arr_importance_method_cd = []; /* 초기설정 비중설정방식 array */
    resultMsg.arr_stock_gubun = []; /* 초기설정 주식수 구분 array */
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 선택된 종목의 구성정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getJongmokInfo = function(req, res) {
  try {
    log.debug('simulation.getJongmokInfo 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getJongmokInfo  req.body.data no data.", req.body.data);
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
        stmt = mapper.getStatement('etpOper', 'getKspjongBasic', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          if(rows) {
            if(rows.length == 1) {
              resultMsg.jongmokInfo = rows[0];
              resultMsg.result = true;
              resultMsg.msg = "";
            } else if(rows.length > 1) {
              resultMsg.result = false;
              resultMsg.msg = "데이터가 2건 이상 존재합니다.";
            }
          } else {
            resultMsg.result = false;
            resultMsg.msg = "데이터가 존재하지 않습니다.";
          }
          res.json(resultMsg);
          res.end();
        });
      } catch (err) {
        log.error(err, stmt, paramData);
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = err;
        resultMsg.jongmokInfo = {};
        res.json(resultMsg);
        res.end();
      }
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.jongmokInfo = {};
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 그룹 정보를 수정한다.
 * 2019-05-20  bkLove(촤병국)
 */
var modifyGroup = function(req, res) {
  try {
    log.debug('simulation.modifyGroup 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.modifyGroup  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. grp_cd, scen_cd 가 존재하는지 체크한다. */
          function(callback) {
            try {
              var msg = {};
              /* 넘겨받은 상태값이 없는 경우 */
              if(typeof paramData.status == "undefined" || paramData.status == "") {
                paramData.status = "insert";
              }
              /* insert 인 경우 grp_cd, scen_cd 가 존재하는지 체크하지 않는다. */
              if(paramData.status == "insert") {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulation', 'getExistCodeCheckByGroup', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length == 1) {
                    if(rows[0].grp_cd_yn != "Y") {
                      resultMsg.result = false;
                      resultMsg.msg = "선택한 그룹코드가 존재하지 않습니다.";
                      resultMsg.err = "선택한 그룹코드가 존재하지 않습니다.";
                      return callback(resultMsg);
                    } else if(rows[0].scen_cd_yn != "Y") {
                      resultMsg.result = false;
                      resultMsg.msg = "선택한 시나리오 코드가 존재하지 않습니다.";
                      resultMsg.err = "선택한 시나리오 코드가 존재하지 않습니다.";
                      return callback(resultMsg);
                    }
                    callback(null, msg);
                  }
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 시나리오명이 존재하는지 체크한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var exist_yn = "Y";
              /* 상태값이 modify 인 경우 */
              if(paramData.status == "modify") {
                paramData.prev_grp_cd = paramData.grp_cd;
                paramData.prev_scen_cd = paramData.scen_cd;
              }
              /* delete 인 경우 시나리오명 중복체크를 하지 않는다. */
              if(paramData.status == "delete") {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulation', 'getExistScenName', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length == 1) {
                    exist_yn = rows[0].exist_yn;
                  }
                  if(exist_yn == "Y") {
                    resultMsg.result = false;
                    resultMsg.msg = "시나리오 그룹명이 이미 존재합니다.";
                    resultMsg.err = "시나리오 그룹명이 이미 존재합니다.";
                    return callback(resultMsg);
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 하위에 시나리오 건수를 조회한다. ( 시나리오 그룹에서 삭제시 ) */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var exist_cnt = 1;
              paramData.grp_yn = '1'; /* 그룹여부(1-그룹) */
              paramData.scen_depth = "1"; /* 시나리오 DEPTH */
              /* 등록, 수정 인 경우 하위에 시나리오 건수를 조회하지 않는다. */
              if(["insert", "modify"].includes(paramData.status)) {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulation', 'getExistSubCntByGroup', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length == 1) {
                    exist_cnt = rows[0].exist_cnt;
                  }
                  if(exist_cnt > 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "시나리오가 한건 이상  존재합니다.";
                    resultMsg.err = "시나리오가 한건 이상  존재합니다.";
                    return callback(resultMsg);
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 시뮬레이션 시나리오 코드를 채번한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              /* modify, delete 인 경우 시뮬레이션 시나리오 코드를 채번하지 않는다. */
              if(["modify", "delete"].includes(paramData.status)) {
                callback(null, msg);
              } else {
                paramData.init_incre_grp_cd = initGrpInfo.INIT_INCRE_GRP_CD; /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
                /* 상위그룹이 없는 경우 그룹여부='1' 설정 */
                if(typeof paramData.grp_cd == "undefined" || !paramData.grp_cd) {
                  paramData.grp_cd = initGrpInfo.INIT_GRP_CD; /* 그룹코드 최초값 */
                }
                stmt = mapper.getStatement('simulation', 'getScenCdByGroup', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length == 1) {
                    paramData.scen_cd = rows[0].scen_cd;
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. 시뮬레이션 시나리오 정렬순번을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(!paramData.grp_cd) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = "[error] simulation.getScenOrderNo Error while performing Query";
                callback(resultMsg, msg)
              } else if(!paramData.scen_cd) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = "[error] simulation.getScenOrderNo Error while performing Query";
                callback(resultMsg, msg)
              } else {
                /* delete 인 경우 시뮬레이션 시나리오 정렬순번을 조회하지 않는다. */
                if(paramData.status == "delete") {
                  callback(null, msg);
                } else {
                  stmt = mapper.getStatement('simulation', 'getScenOrderNo', paramData, format);
                  log.debug(stmt, msg);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(rows && rows.length == 1) {
                      paramData.scen_order_no = rows[0].scen_order_no;
                    }
                    callback(null, msg);
                  });
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. 시뮬레이션 기본 정보를 저장한다. */
          function(msg, callback) {
            var queryId = "saveTmSimulMastByGroup";
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(["delete"].includes(paramData.status)) {
                callback(null, msg);
              } else {
                if(paramData.status == "modify") {
                  queryId = "modifyTmSimulMastByGroup";
                }
                paramData.start_year = ""; /* 시작년도 */
                paramData.rebalance_cycle_cd = ""; /* 리밸런싱주기 (COM006) */
                paramData.rebalance_date_cd = ""; /* 리밸런싱일자 (COM007) */
                paramData.init_invest_money = 0; /* 초기투자금액 */
                paramData.bench_mark_cd = ""; /* 벤치마크 (COM008) */
                paramData.importance_method_cd = ""; /* 비중설정방식 (COM009) */
                stmt = mapper.getStatement('simulation', queryId, paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    callback(resultMsg, msg);
                  } else {
                    callback(null, msg);
                  }
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 6. (등록건) 그룹 공유 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(["insert"].includes(paramData.status)) {
                paramData.upper_grp_cd = paramData.grp_cd;
                paramData.upper_scen_cd = paramData.scen_cd;
                paramData.changeGrpCdYn = "0";
                stmt = mapper.getStatement('simulation', "getSimulShareUpperGrp", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    var v_temp = _.filter(rows, {
                      'email': paramData.user_id
                    });
                    if(typeof v_temp != "undefined" && v_temp.length == 1) {
                      msg.v_simul_share_upper_grp = rows[0];
                    }
                  }
                  callback(null, msg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 7. (등록건) 공유정보 설정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var v_queryId = "";
              msg.arr_insert_list = [];
              msg.arr_update_list = [];
              if(["insert"].includes(paramData.status)) {
                /* simul_share 수정 건 */
                if(typeof msg.v_simul_share_upper_grp != "undefined" && Object.keys(msg.v_simul_share_upper_grp).length > 0) {
                  msg.arr_update_list.push({
                    "grp_cd": msg.v_simul_share_upper_grp.grp_cd,
                    "scen_cd": msg.v_simul_share_upper_grp.scen_cd,
                    "email": paramData.user_id,
                    "owner_yn": "1"
                  });
                  paramData.arr_update_list = msg.arr_update_list;
                  v_queryId = "modifyShareUserInArr";
                }
                /* simul_share 등록 건 */
                else {
                  msg.arr_insert_list.push({
                    "grp_cd": paramData.grp_cd,
                    "scen_cd": paramData.scen_cd,
                    "email": paramData.user_id,
                    "owner_yn": "1"
                  });
                  paramData.arr_insert_list = msg.arr_insert_list;
                  v_queryId = "saveShareUserInArr";
                }
              }
              if(v_queryId == "") {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulation', v_queryId, paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation." + v_queryId + " success");
                  }
                  paramData.arr_insert_list = [];
                  paramData.arr_update_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 8. 삭제시 공유정보를 해제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(["delete"].includes(paramData.status)) {
                var param = {};
                param.moduleId = "applyShareUserRevokeInArrModule";
                param.transaction = {};
                param.transaction.mapper = mapper;
                param.transaction.pool = pool;
                param.transaction.conn = conn;
                param.user_id = paramData.user_id;
                param.inst_cd = paramData.inst_cd;
                param.type_cd = paramData.type_cd;
                param.uesr_large_typeid = paramData.large_type;
                param.krx_cd = paramData.krx_cd;
                param.grp_cd = paramData.grp_cd;
                param.scen_cd = paramData.scen_cd;
                param.arr_checked_shared = [];
                param.arr_checked_shared.push({
                  "email": paramData.user_id
                });
                param.group_delete_yn = "1";
                log.debug('simulation.modifyGroup -> simulation.applyShareUserRevokeInArrModule START');
                /* 공유 대상자 해제 모듈을 호출한다. */
                applyShareUserRevokeInArrModule.call(this, req, res, param).then(function(e) {
                  if(e && e.resultMsg && e.resultMsg.result) {
                    log.debug('simulation.modifyGroup -> simulation.applyShareUserRevokeInArrModule success END');
                    resultMsg = e.resultMsg;
                    callback(null, msg);
                  } else {
                    log.debug('simulation.modifyGroup -> simulation.applyShareUserRevokeInArrModule error END');
                    log.debug(e, param);
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = config.MSG.error01;
                    callback(resultMsg);
                  }
                }).catch(function(err) {
                  log.debug('simulation.modifyGroup -> simulation.applyShareUserRevokeInArrModule error END');
                  log.debug(err, param);
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  callback(resultMsg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 9. 삭제시 시뮬레이션 기본 정보를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(["delete"].includes(paramData.status)) {
                stmt = mapper.getStatement('simulation', "deleteTmSimulMastByGroup", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    callback(resultMsg);
                  } else {
                    callback(null);
                  }
                });
              } else {
                callback(null);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.error(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            if(paramData.status == "delete") {
              resultMsg.msg = "성공적으로 삭제하였습니다.";
            } else {
              resultMsg.msg = "성공적으로 저장하였습니다.";
            }
            resultMsg.err = null;
            conn.commit();
          }
          res.json(resultMsg);
          res.end();
        });
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 시뮬레이션 마스터 정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulMast = function(req, res) {
  try {
    log.debug('simulation.getSimulMast 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getSimulMast  req.body.data no data.", req.body.data);
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
    resultMsg.mastInfo = {};
    Promise.using(pool.connect(), conn => {
      try {
        paramData.changeGrpCdYn = "0";
        stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          if(rows && rows.length == 1) {
            resultMsg.result = true;
            resultMsg.msg = "";
            resultMsg.mastInfo = rows[0];
          }
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
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.mastInfo = {};
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 시뮬레이션 공통코드 초기 데이터를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getInitData1 = function(req, res) {
  try {
    log.debug('simulation.getInitData1 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getInitData1  req.body.data no data.", req.body.data);
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
    resultMsg.arr_code_list = [];
    resultMsg.arrMsg = [];
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      try {
        stmt = mapper.getStatement('simulation', 'getInitData', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          if(rows && rows.length > 0) {
            resultMsg.arr_code_list = rows;
            resultMsg.result = true;
            resultMsg.msg = "";
          } else {
            resultMsg.result = false;
            resultMsg.msg = "공통코드 데이터가 존재하지 않습니다.";
            resultMsg.err = "공통코드 데이터가 존재하지 않습니다.";
          }
          res.json(resultMsg);
          res.end();
        });
      } catch (err) {
        log.error(err, stmt, paramData);
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = err;
        resultMsg.arr_code_list = [];
        res.json(resultMsg);
        res.end();
      }
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_code_list = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 화면에서 select 된 리밸런싱 일자를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getRebalanceDate = function(req, res) {
  try {
    log.debug('simulation.getRebalanceDate 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getRebalanceDate  req.body.data no data.", req.body.data);
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
    resultMsg.dataList = [];
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
      var queryId = "getRebalanceDate";
      try {
        if(paramData.rebalance_cycle_cd == "") {
          queryId = "getRebalanceDateUploadByScenCd";
          if(!paramData.grp_cd || !paramData.scen_cd) {
            throw "grp_cd 또는 scen_cd 가 존재하지 않습니다.";
          }
        }
        stmt = mapper.getStatement('simulation', queryId, paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          resultMsg.result = true;
          resultMsg.msg = "";
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          } else if(rows && rows.length > 0) {
            for(var i = 0; i < rows.length; i++) {
              resultMsg.dataList.push({
                "text": rows[i].fmt_F12506,
                "value": rows[i].F12506
              });
            }
          }
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
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.dataList = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 시뮬레이션 목록정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulList = function(req, res) {
  try {
    log.debug('simulation.getSimulList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getSimulList  req.body.data no data.", req.body.data);
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
    resultMsg.dataList = [];
    Promise.using(pool.connect(), conn => {
      try {
        stmt = mapper.getStatement('simulation', 'getSimulList', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          if(rows && rows.length > 0) {
            resultMsg.result = true;
            resultMsg.msg = "";
            resultMsg.dataList = rows;
          }
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
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.dataList = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 시뮬레이션 포트폴리오 정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulPortfolio = function(req, res) {
  try {
    log.debug('simulation.getSimulPortfolio 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getSimulPortfolio  req.body.data no data.", req.body.data);
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
    /* 리밸런싱일별 포트폴리오 */
    var rebalancePortfolioObj = {};
    resultMsg.rebalancePortfolioObj = {};
    Promise.using(pool.connect(), conn => {
      try {
        stmt = mapper.getStatement('simulation', 'getSimulPortfolio', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          if(!err) {
            resultMsg.result = true;
            resultMsg.msg = "";
            if(rows && rows.length > 0) {
              resultMsg.result = true;
              var v_order_no = 0;
              for(var i = 0; i < rows.length; i++) {
                if(!rebalancePortfolioObj[rows[i].rebalance_date] || Object.keys(rebalancePortfolioObj[rows[i].rebalance_date]).length == 0) {
                  rebalancePortfolioObj[rows[i].rebalance_date] = {};
                  v_order_no = 0;
                }
                if(!rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013] || Object.keys(rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013]).length == 0) {
                  rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013] = {};
                }
                rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013].F16013 = rows[i].F16013; /* 단축코드 */
                rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013].F16002 = rows[i].F16002; /* 종목명 */
                rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013].F15028 = rows[i].F15028; /* 시가총액 */
                rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013].importance = rows[i].importance; /* 비중 */
                rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013].order_no = v_order_no; /* 정렬순번 */
                rebalancePortfolioObj[rows[i].rebalance_date][rows[i].F16013].trIndex = v_order_no; /* 테이블 레코드 순번 */
                v_order_no++;
              }
            }
            resultMsg.rebalancePortfolioObj = rebalancePortfolioObj;
          }
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
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.rebalancePortfolioObj = [];
    res.json(resultMsg);
    res.end();
  }
}
/*************************************************************************************************************
 *   기본정보 저장과 함께 백테스트 실행  START
 **************************************************************************************************************/
/*
 * 기본정보 저장과 함께 백테스트 실행을 수행한다.
 * 2019-05-20  bkLove(촤병국)
 */
var runBacktestWithSaveBasicInfo = function(req, res) {
  try {
    log.debug('simulation.runBacktestWithSaveBasicInfo 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.runBacktestWithSaveBasicInfo  req.body.data no data.", req.body.data);
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
    var v_resultSimulData = {};
    resultMsg.arr_daily = [];
    resultMsg.arr_rebalance = [];
    resultMsg.simul_mast = {};
    resultMsg.analyzeList = [];
    resultMsg.jsonFileName = "";
    resultMsg.inputData = [];
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. 시나리오명이 존재하는지 체크한다. */
          function(callback) {
            try {
              var msg = {};
              var exist_yn = "Y";
              paramData.changeGrpCdYn = "0";
              paramData.prevChangeGrpCdYn = "0";
              /* 기존에 등록된 prev_scen_cd 가 없는 경우 ( 신규 건 ) */
              if(typeof paramData.prev_scen_cd == "undefined" || paramData.prev_scen_cd == "") {
                paramData.status = "insert";
              } else {
                paramData.status = "modify";
              }
              stmt = mapper.getStatement('simulation', 'getExistScenName', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  exist_yn = rows[0].exist_yn;
                }
                if(exist_yn == "Y") {
                  resultMsg.result = false;
                  resultMsg.msg = "시나리오명이 이미 존재합니다.";
                  resultMsg.err = "시나리오명이 이미 존재합니다.";
                  return callback(resultMsg);
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 그룹코드 변경시 하위에 시나리오 건수를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var exist_cnt = 1;
              paramData.grp_yn = "0"; /* 그룹여부(1-그룹) */
              paramData.scen_depth = "2"; /* 시나리오 DEPTH */
              /* 수정 건 이고 상위 그룹이 변경된 경우 */
              if(paramData.status == "modify" && paramData.prev_grp_cd != paramData.grp_cd) {
                paramData.changeGrpCdYn = "1";
                paramData.prevChangeGrpCdYn = "1";
                stmt = mapper.getStatement('simulation', 'getExistSubCnt', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length == 1) {
                    exist_cnt = rows[0].exist_cnt;
                  }
                  if(exist_cnt > 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "변경 전 상위그룹에 시나리오가 한건 이상  존재합니다.";
                    resultMsg.err = "변경 전 상위그룹에 시나리오가 한건 이상  존재합니다.";
                    return callback(resultMsg);
                  }
                  callback(null, msg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 시뮬레이션 시나리오 코드를 채번한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              /* modify 상태이고 상위그룹이 변경되지 않는 경우 기존 scen_cd 사용 */
              if(paramData.status == "modify" && paramData.prev_grp_cd == paramData.grp_cd) {
                callback(null, msg);
              } else {
                paramData.init_incre_grp_cd = initGrpInfo.INIT_INCRE_GRP_CD; /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
                stmt = mapper.getStatement('simulation', "getScenCd1", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length == 1) {
                    paramData.scen_cd = rows[0].scen_cd;
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. 시뮬레이션 시나리오 정렬순번을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(!paramData.grp_cd) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = config.MSG.error01;
                callback(resultMsg, msg);
              } else if(!paramData.scen_cd) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = config.MSG.error01;
                callback(resultMsg, msg);
              } else {
                /* 신규 건 이거나 상위 그룹이 변경된 경우 정렬순번 조회 */
                if(paramData.status == "insert" || paramData.prev_grp_cd != paramData.grp_cd) {
                  stmt = mapper.getStatement('simulation', 'getScenOrderNo', paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(rows && rows.length == 1) {
                      paramData.scen_order_no = rows[0].scen_order_no;
                    }
                    callback(null, msg);
                  });
                } else {
                  callback(null, msg);
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. modify 인 경우 tm_simul_mast 를 조회한다. */
          function(msg, callback) {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            if(paramData.status == "modify") {
              try {
                stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length != 1) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    callback(resultMsg, msg);
                  } else {
                    /* simul_mast 정보가 변동되었는지 체크하기 위해 v_simul_mast 에 보관 */
                    msg.v_org_simul_mast = [];
                    msg.v_org_simul_mast.push({
                      start_year: rows[0].start_year /* 시작년도 */ ,
                      rebalance_cycle_cd: rows[0].rebalance_cycle_cd /* 리밸런싱주기 (COM006) */ ,
                      rebalance_date_cd: rows[0].rebalance_date_cd /* 리밸런싱일자 (COM007) */ ,
                      init_invest_money: rows[0].init_invest_money /* 초기투자금액 */ ,
                      bench_mark_cd: rows[0].bench_mark_cd /* 벤치마크 (COM008) */ ,
                      importance_method_cd: rows[0].importance_method_cd /* 비중설정방식 (COM009) */
                    });
                    msg.v_input_simul_mast = [];
                    msg.v_input_simul_mast.push({
                      start_year: paramData.start_year /* 시작년도 */ ,
                      rebalance_cycle_cd: paramData.rebalance_cycle_cd /* 리밸런싱주기 (COM006) */ ,
                      rebalance_date_cd: paramData.rebalance_date_cd /* 리밸런싱일자 (COM007) */ ,
                      init_invest_money: paramData.init_invest_money /* 초기투자금액 */ ,
                      bench_mark_cd: paramData.bench_mark_cd /* 벤치마크 (COM008) */ ,
                      importance_method_cd: paramData.importance_method_cd /* 비중설정방식 (COM009) */
                    });
                    callback(null, msg);
                  }
                });
              } catch (err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                callback(resultMsg);
              }
            } else {
              callback(null, msg);
            }
          },
          /* 6. modify 인 경우 tm_simul_portfolio 를 조회한다. */
          function(msg, callback) {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            if(paramData.status == "modify") {
              try {
                stmt = mapper.getStatement('simulation', 'getSimulPortfolio2', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    callback(resultMsg, msg);
                  } else {
                    msg.v_org_simul_portfolio = [];
                    /* simul_portfolio 정보가 변동되었는지 체크하기 위해 v_simul_mast 에 보관 */
                    for(var i = 0; i < rows.length; i++) {
                      msg.v_org_simul_portfolio.push({
                        F16013: rows[i].F16013 /* 구성종목코드  */ ,
                        rebalance_date: rows[i].rebalance_date /* 리밸런싱 날짜 */ ,
                        importance: rows[i].importance /* 비중  */
                      });
                    }
                    callback(null, msg);
                  }
                });
              } catch (err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                callback(resultMsg);
              }
            } else {
              callback(null, msg);
            }
          },
          /* 7. 현재 serialNo 를 구한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', 'getSerialNo', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length != 1) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  callback(resultMsg, msg);
                } else {
                  msg.now_serial_no = Number(rows[0].serial_no);
                  callback(null, msg);
                }
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 8. 변경전 시나리오의 상위 그룹 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_simul_upper_grp = {};
              /* 그룹변경이 없는 경우 */
              if(paramData.changeGrpCdYn == "0") {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulation', "getUpperGrp", paramData, format);
                log.debug(stmt);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length == 1) {
                    msg.v_simul_upper_grp = rows[0];
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 9. 시뮬레이션 기본 정보를 저장한다. */
          function(msg, callback) {
            var queryId = "saveTmSimulMast";
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(paramData.status == "insert") {
                paramData.time_series_upload_yn = "0";
                paramData.serial_no = msg.now_serial_no + 1;
              } else if(paramData.status == "modify") {
                queryId = "modifyTmSimulMast";
                paramData.serial_no = msg.now_serial_no + 1;
                /* DB 에 존재하는 정보와 입력한 정보가 다른지 체크  */
                var v_diff_simul_mast = _.xorWith(msg.v_org_simul_mast, msg.v_input_simul_mast, _.isEqual);
                var v_diff_simul_portfolio = _.xorWith(msg.v_org_simul_portfolio, msg.v_input_portfolio, _.isEqual);
                log.debug("#######################################################################################################");
                /* simul_mast 정보가 다른 경우 tm_simul_mast 의 serial_no 에 1 증가 */
                if(v_diff_simul_mast && v_diff_simul_mast.length > 0) {
                  paramData.serial_no = msg.now_serial_no + 1;
                  log.debug("simul_mast 변경됨 >>> 변경전 serial_no", msg.now_serial_no, "변경후 serial_no", paramData.serial_no);
                }
                /* simul_portfolio 정보가 다른 경우 tm_simul_mast 의 serial_no 에 1 증가 */
                else if(v_diff_simul_portfolio && v_diff_simul_portfolio.length > 0) {
                  paramData.serial_no = msg.now_serial_no + 1;
                  log.debug("simul_portfolio 변경됨 >>> 변경전 serial_no", msg.now_serial_no, "변경후 serial_no", paramData.serial_no);
                }
                /* simul_mast 와 simul_portfolio 모두 변경된 정보가 없는 경우 현재 serial_no 로 유지 */
                else {
                  log.debug("simul_mast, simul_portfolio 변경없음 >>> serial_no", msg.now_serial_no);
                  paramData.serial_no = msg.now_serial_no;
                }
                log.debug("#######################################################################################################");
              }
              stmt = mapper.getStatement('simulation', queryId, paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  callback(resultMsg, msg);
                } else {
                  callback(null, msg);
                }
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 10. 수정일 경우 이미 등록된 tm_simul_portfolio 를 삭제한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              /* 수정인 경우 */
              if(paramData.status == "modify") {
                stmt = mapper.getStatement('simulation', "deleteTmSimulPortfolio", paramData, format);
                log.debug(stmt);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  callback(null, msg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 11. tm_simul_portfolio 에 저장한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(paramData.rebalancePortfolioObj && Object.keys(paramData.rebalancePortfolioObj).length > 0) {
                msg.arr_portfolio = [];
                msg.v_input_portfolio = [];
                for(var i = 0; i < Object.keys(paramData.rebalancePortfolioObj).length; i++) {
                  var v_key = Object.keys(paramData.rebalancePortfolioObj)[i];
                  var v_sub_item = paramData.rebalancePortfolioObj[v_key];
                  var v_order_no = 0;
                  for(var j = 0; j < Object.keys(v_sub_item).length; j++) {
                    var v_sub_key2 = Object.keys(v_sub_item)[j];
                    var v_sub_item2 = v_sub_item[v_sub_key2];
                    v_sub_item2.rebalance_date = v_key;
                    msg.arr_portfolio.push(v_sub_item2);
                    msg.v_input_portfolio.push({
                      F16013: v_sub_item2.F16013 /* 구성종목코드  */ ,
                      rebalance_date: v_sub_item2.rebalance_date /* 리밸런싱 날짜 */ ,
                      importance: v_sub_item2.importance /* 비중  */
                    })
                  }
                }
              }
              /* 포트폴리오 기본정보가 없는 경우 */
              if(!msg.arr_portfolio || msg.arr_portfolio.length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "[백테스트] 포트폴리오 정보가 존재하지 않습니다.";
                resultMsg.err = "[백테스트] 포트폴리오 정보가 존재하지 않습니다.";
                callback(resultMsg);
              }
              /* 포트폴리오 설정 건이 존재하는 경우 */
              if(msg.arr_portfolio && msg.arr_portfolio.length > 0) {
                var divideList = [];
                async.forEachOfLimit(msg.arr_portfolio, 1, function(subList, i, innerCallback) {
                  async.waterfall([
                    function(innerCallback) {
                      divideList.push(subList);
                      innerCallback(null, paramData);
                    },
                    function(sub_msg, innerCallback) {
                      var divide_size = (limit && limit.divide_size ? limit.divide_size : 1);
                      if(divideList && (divideList.length == divide_size || i == msg.arr_portfolio.length - 1)) {
                        try {
                          paramData.arr_portfolio = divideList;
                          stmt = mapper.getStatement('simulation', 'saveTmSimulPortfolio', paramData, format);
                          //                                                  log.debug(stmt);
                          conn.query(stmt, function(err, rows) {
                            if(err) {
                              resultMsg.result = false;
                              resultMsg.msg = config.MSG.error01;
                              resultMsg.err = err;
                              return innerCallback(resultMsg);
                            }
                            innerCallback(null);
                          });
                          divideList = [];
                        } catch (err) {
                          resultMsg.result = false;
                          resultMsg.msg = config.MSG.error01;
                          if(!resultMsg.err) {
                            resultMsg.err = err;
                          }
                          return innerCallback(resultMsg);
                        }
                      } else {
                        innerCallback(null);
                      }
                    }
                  ], function(err) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      if(!resultMsg.err) {
                        resultMsg.err = err;
                      }
                      return innerCallback(resultMsg);
                    }
                    innerCallback(null);
                  });
                }, function(err) {
                  if(err) {
                    return callback(resultMsg);
                  }
                  log.debug("simulation.saveTmSimulPortfolio", paramData);
                  delete msg.arrInsertDtl;
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 12. 변경할 대상이 상위 그룹이 있는 경우 - 변경전 시나리오 공유자 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_simul_prev_share = [];
              if(paramData.changeGrpCdYn == "0") {
                callback(null, msg);
              } else {
                /* 변경할 대상이 상위그룹인 경우 */
                if(paramData.org_grp_yn == "1") {
                  paramData.changeGrpCdYn = "1";
                  stmt = mapper.getStatement('simulation', "getUserListInCheckedSimulation", paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(rows && rows.length > 0) {
                      msg.v_simul_prev_share = rows;
                    }
                    paramData.changeGrpCdYn = paramData.prevChangeGrpCdYn;
                    callback(null, msg);
                  });
                } else {
                  callback(null, msg);
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 13. 변경할 대상이 상위 그룹이 있는 경우 - 변경할 그룹 공유자 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_simul_share_upper = [];
              if(paramData.changeGrpCdYn == "0") {
                callback(null, msg);
              } else {
                /* 변경할 대상이 상위 그룹이 있는 경우 */
                if(paramData.org_grp_yn == "1") {
                  paramData.changeGrpCdYn = "0";
                  paramData.upper_grp_cd = "*";
                  paramData.upper_scen_cd = paramData.grp_cd;
                  stmt = mapper.getStatement('simulation', "getSimulShareUpperGrp", paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(rows && rows.length > 0) {
                      msg.v_simul_share_upper = rows;
                    }
                    paramData.changeGrpCdYn = paramData.prevChangeGrpCdYn;
                    callback(null, msg);
                  });
                } else {
                  callback(null, msg);
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 14. 변경할 대상이 상위 그룹이 있는 경우 - 그룹 공유자 정보를 설정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_insert_list = [];
              if(paramData.changeGrpCdYn == "1") {
                /* 변경할 대상이 상위 그룹이 있는 경우 - (변경전) 시나리오 공유자가 존재하는 경우  */
                if(typeof msg.v_simul_prev_share != "undefined" && msg.v_simul_prev_share.length > 0) {
                  /* 변경할 대상이 상위 그룹이 있는 경우 - (변경할) 그룹 공유자가 존재하는 경우  */
                  if(typeof msg.v_simul_share_upper != "undefined" && msg.v_simul_share_upper.length > 0) {
                    msg.v_simul_prev_share.forEach(function(item, index, array) {
                      var v_check_data = _.filter(msg.v_simul_share_upper, {
                        'email': item.email
                      });
                      if(typeof v_check_data == "undefined" || v_check_data.length == 0) {
                        msg.arr_insert_list.push({
                          "grp_cd": paramData.upper_grp_cd,
                          "scen_cd": paramData.upper_scen_cd,
                          "email": item.email,
                          "owner_yn": item.owner_yn
                        });
                      }
                    });
                    paramData.arr_insert_list = msg.arr_insert_list;
                  } else {
                    paramData.arr_insert_list = msg.v_simul_prev_share;
                  }
                }
              }
              if(!paramData.arr_insert_list || paramData.arr_insert_list.length == 0) {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulation', "saveShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.saveShareUserInArr ( 기존 시나리오 공유자 -> 그룹 공유자 ) success");
                  }
                  paramData.arr_insert_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 15. 변경전 대상이 상위 그룹이 있는 경우 - 변경전 그룹에 속하지 않는 삭제 대상 공유자를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_arr_simul_share_not_in_group = [];
              if(paramData.changeGrpCdYn == "0") {
                callback(null, msg);
              } else {
                /* 변경전 대상이 상위그룹이 있는 경우 */
                if(typeof msg.v_simul_upper_grp == "undefined" || Object.keys(msg.v_simul_upper_grp).length == 0) {
                  callback(null, msg);
                } else {
                  paramData.prev_upper_grp_cd = msg.v_simul_upper_grp.grp_cd;
                  paramData.prev_upper_scen_cd = msg.v_simul_upper_grp.scen_cd;
                  stmt = mapper.getStatement('simulation', "getSimulShareNotInGroupForDelelete", paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(rows && rows.length > 0) {
                      msg.v_arr_simul_share_not_in_group = rows;
                    }
                    callback(null, msg);
                  });
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 16. 변경전 대상이 상위 그룹이 있는 경우 - 변경전 그룹에 속하지 않는 삭제 대상 공유자를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(paramData.changeGrpCdYn == "0") {
                callback(null, msg);
              } else {
                /* 변경전 대상이 상위그룹이 있는 경우 */
                if(typeof msg.v_arr_simul_share_not_in_group == "undefined" || msg.v_arr_simul_share_not_in_group.length == 0) {
                  callback(null, msg);
                } else {
                  paramData.arr_delete_list = msg.v_arr_simul_share_not_in_group;
                  stmt = mapper.getStatement('simulation', "deleteShareUserInArr", paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(rows) {
                      log.debug("simulation.deleteShareUserInArr ( 변경전 그룹에 속하지 않는 삭제 대상 ) success");
                    }
                    paramData.arr_delete_list = [];
                    callback(null, msg);
                  });
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 17. 그룹변경인 경우 [tm_simul_share] 시나리오 수정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var v_queryId = "";
              if(paramData.changeGrpCdYn == "0") {
                /* 등록인 경우 */
                if(paramData.status == "insert") {
                  paramData.owner_yn = "1";
                  v_queryId = "saveTmSimulShareScen";
                } else {
                  v_queryId = "modifyTmSimulShareScenByChangeGroup";
                }
              } else {
                v_queryId = "modifyTmSimulShareScenByChangeGroup";
              }
              stmt = mapper.getStatement('simulation', v_queryId, paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation." + v_queryId + " ( 시나리오 tm_simul_share ) success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          // /* 18. 그룹변경인 경우 [tm_simul_result_mast] 수정한다.  */
          // function( msg, callback) {
          //     try {
          //         if( !msg || Object.keys( msg ).length == 0 ) {
          //             msg = {};
          //         }
          //         /* 그룹변경이 존재하는 경우 */
          //         if( paramData.changeGrpCdYn == "1" ) {
          //             stmt = mapper.getStatement('simulation', "modifyTmSimulResultMastByChangeGroup", paramData, format);
          //             log.debug(stmt, paramData);
          //             conn.query(stmt, function(err, rows) {
          //                 if (err) {
          //                     resultMsg.result = false;
          //                     resultMsg.msg = config.MSG.error01;
          //                     resultMsg.err = err;
          //                     return callback(resultMsg);
          //                 }
          //                 if( rows ) {
          //                     log.debug( "simulation.modifyTmSimulResultMastByChangeGroup ( 그룹변경 tm_simul_result_mast ) success" );
          //                 }
          //                 callback(null, msg);
          //             });
          //         }else{
          //             callback(null, msg);
          //         }
          //     } catch (err) {
          //         resultMsg.result = false;
          //         resultMsg.msg = config.MSG.error01;
          //         resultMsg.err = err;
          //         return callback(resultMsg);
          //     }
          // },                    
          // /* 19. 그룹변경인 경우 [tm_simul_result_anal] 수정한다.  */
          // function( msg, callback) {
          //     try {
          //         if( !msg || Object.keys( msg ).length == 0 ) {
          //             msg = {};
          //         }
          //         /* 그룹변경이 존재하는 경우 */
          //         if( paramData.changeGrpCdYn == "1" ) {
          //             stmt = mapper.getStatement('simulation', "modifyTmSimulResultAnalByChangeGroup", paramData, format);
          //             log.debug(stmt, paramData);
          //             conn.query(stmt, function(err, rows) {
          //                 if (err) {
          //                     resultMsg.result = false;
          //                     resultMsg.msg = config.MSG.error01;
          //                     resultMsg.err = err;
          //                     return callback(resultMsg);
          //                 }
          //                 if( rows  ) {
          //                     log.debug( "simulation.modifyTmSimulResultAnalByChangeGroup ( 그룹변경 tm_simul_result_anal ) success" );
          //                 }
          //                 callback(null, msg);
          //             });
          //         }else{
          //             callback(null, msg);
          //         }
          //     } catch (err) {
          //         resultMsg.result = false;
          //         resultMsg.msg = config.MSG.error01;
          //         resultMsg.err = err;
          //         return callback(resultMsg);
          //     }
          // },
          // /* 20. 그룹변경인 경우 [tm_simul_result_daily] 수정한다.  */
          // function( msg, callback) {
          //     try {
          //         if( !msg || Object.keys( msg ).length == 0 ) {
          //             msg = {};
          //         }
          //         /* 그룹변경이 존재하는 경우 */
          //         if( paramData.changeGrpCdYn == "1" ) {
          //             stmt = mapper.getStatement('simulation', "modifyTmSimulResultDailyByChangeGroup", paramData, format);
          //             log.debug(stmt, paramData);
          //             conn.query(stmt, function(err, rows) {
          //                 if (err) {
          //                     resultMsg.result = false;
          //                     resultMsg.msg = config.MSG.error01;
          //                     resultMsg.err = err;
          //                     return callback(resultMsg);
          //                 }
          //                 if( rows ) {
          //                     log.debug( "simulation.modifyTmSimulResultDailyByChangeGroup ( 그룹변경 tm_simul_result_daily ) success" );
          //                 }
          //                 callback(null, msg);
          //             });
          //         }else{
          //             callback(null, msg);
          //         }
          //     } catch (err) {
          //         resultMsg.result = false;
          //         resultMsg.msg = config.MSG.error01;
          //         resultMsg.err = err;
          //         return callback(resultMsg);
          //     }
          // },
          // /* 21. 그룹변경인 경우 [tm_simul_result_rebalance] 수정한다.  */
          // function( msg, callback) {
          //     try {
          //         if( !msg || Object.keys( msg ).length == 0 ) {
          //             msg = {};
          //         }
          //         /* 그룹변경이 존재하는 경우 */
          //         if( paramData.changeGrpCdYn == "1" ) {
          //             stmt = mapper.getStatement('simulation', "modifyTmSimulResultRebalanceByChangeGroup", paramData, format);
          //             log.debug(stmt, paramData);
          //             conn.query(stmt, function(err, rows) {
          //                 if (err) {
          //                     resultMsg.result = false;
          //                     resultMsg.msg = config.MSG.error01;
          //                     resultMsg.err = err;
          //                     return callback(resultMsg);
          //                 }
          //                 if( rows ) {
          //                     log.debug( "simulation.modifyTmSimulResultRebalanceByChangeGroup ( 그룹변경 tm_simul_result_rebalance ) success" );
          //                 }
          //                 callback(null, msg);
          //             });
          //         }else{
          //             callback(null, msg);
          //         }
          //     } catch (err) {
          //         resultMsg.result = false;
          //         resultMsg.msg = config.MSG.error01;
          //         resultMsg.err = err;
          //         return callback(resultMsg);
          //     }
          // },
          /* 22. 백테스트 수행 후 결과를 저장한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              paramData.moduleId = "runBacktestWithSaveBasicInfo";
              paramData.transaction = {};
              paramData.transaction.mapper = mapper;
              paramData.transaction.pool = pool;
              paramData.transaction.conn = conn;
              /* 백테스트 수행 후 결과를 저장한다. */
              simulationBacktest.saveBacktestResult(req, res, paramData).then(function(e) {
                if(e && e.resultMsg && e.resultMsg.result) {
                  resultMsg = e.resultMsg;
                  e.resultMsg.msg = "성공적으로 저장하였습니다.";
                  e.resultMsg.err = null;
                  callback(null);
                } else {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = config.MSG.error01;
                  callback(resultMsg);
                }
              }).catch(function(err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                return callback(resultMsg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            conn.commit();
          }
          res.json(resultMsg);
          res.end();
        });
      });
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*************************************************************************************************************
 *   기본정보 저장과 함께 백테스트 실행  END
 **************************************************************************************************************/
/*
 * 시나리오 공유 건수를 조회한다.
 * 2019-11-11  bkLove(촤병국)
 */
var getScenarioShareCount = function(req, res) {
  try {
    log.debug('simulation.getScenarioShareCount 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getScenarioShareCount  req.body.data no data.", req.body.data);
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
    resultMsg.share_count = 0;
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      try {
        stmt = mapper.getStatement('simulation', 'getScenarioShareCount', paramData, format);
        log.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if(err) {
            log.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }
          if(!rows || rows.length == 0) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = config.MSG.error01;
          }
          if(rows && rows.length == 1) {
            resultMsg.result = true;
            resultMsg.msg = "";
            resultMsg.share_count = rows[0].share_count;
          }
          res.json(resultMsg);
          res.end();
        });
      } catch (err) {
        log.error(err, stmt, paramData);
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = err;
        resultMsg.share_count = 0;
        res.json(resultMsg);
        res.end();
      }
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.share_count = 0;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 시뮬레이션 정보를 삭제한다.
 * 2019-05-20  bkLove(촤병국)
 */
var deleteAllSimul = function(req, res) {
  try {
    log.debug('simulation.deleteAllSimul 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.deleteAllSimul  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. simul_mast 가 이미 삭제되었는지 체크한다. */
          function(callback) {
            try {
              var msg = {};
              paramData.changeGrpCdYn = "0";
              stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                /* 이미 삭제된 경우 */
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "이미 삭제된 상태입니다.";
                  resultMsg.err = "이미 삭제된 상태입니다.";
                  return callback(resultMsg);
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 상위 그룹 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_simul_upper_grp = {};
              paramData.changeGrpCdYn = "0";
              stmt = mapper.getStatement('simulation', 'getUpperGrp', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  msg.v_simul_upper_grp = rows[0];
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. tm_simul_mast 를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', 'deleteSimulMast', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.deleteSimulMast success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. tm_simul_portfolio 를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', 'deleteTmSimulPortfolio', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.deleteTmSimulPortfolio success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. tm_simul_result_anal 을 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', 'deleteSimulResultAnal', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.deleteSimulResultAnal success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 6. tm_simul_result_rebalance 를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', 'deleteSimulResultRebalance', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.deleteSimulResultRebalance success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 7. tm_simul_result_daily 를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', 'deleteSimulResultDaily', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.deleteSimulResultDaily success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 8. tm_simul_result_mast 를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', 'deleteSimulResultMast', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.deleteSimulResultMast success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 9. tm_simul_result_contribute 를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', 'deleteSimulResultContribute', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.deleteSimulResultContribute success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 10. 그룹에 속하지 않는 삭제 대상 공유자를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_arr_simul_share_not_in_group = [];
              /* 상위그룹이 있는 경우 */
              if(typeof msg.v_simul_upper_grp == "undefined" || Object.keys(msg.v_simul_upper_grp).length == 0) {
                callback(null, msg);
              } else {
                paramData.prev_grp_cd = paramData.grp_cd;
                paramData.prev_scen_cd = paramData.scen_cd;
                paramData.prev_upper_grp_cd = msg.v_simul_upper_grp.grp_cd;
                paramData.prev_upper_scen_cd = msg.v_simul_upper_grp.scen_cd;
                stmt = mapper.getStatement('simulation', "getSimulShareNotInGroupForDelelete", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    msg.v_arr_simul_share_not_in_group = rows;
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 11. 그룹에 속하지 않는 삭제 대상 공유자를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              /* 변경전 대상이 상위그룹이 있는 경우 */
              if(typeof msg.v_arr_simul_share_not_in_group == "undefined" || msg.v_arr_simul_share_not_in_group.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_delete_list = msg.v_arr_simul_share_not_in_group;
                stmt = mapper.getStatement('simulation', "deleteShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.deleteShareUserInArr ( 변경전 그룹에 속하지 않는 삭제 대상 ) success");
                  }
                  paramData.arr_delete_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 12. 사용자에 상관없이 [tm_simul_share] 시나리오별 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "deleteAllTmSimulShareScen", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.deleteAllTmSimulShareScen success");
                }
                callback(null);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 삭제하였습니다.";
            resultMsg.err = null;
            conn.commit();
          }
          res.json(resultMsg);
          res.end();
        });
      });
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 선택된 시나리오를 이름 변경한다.
 * 2019-05-20  bkLove(촤병국)
 */
var renameScenario = function(req, res) {
  try {
    log.debug('simulation.renameScenario 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.renameScenario  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. 수정할 정보가 존재하는지 체크한다. */
          function(callback) {
            try {
              var msg = {};
              paramData.changeGrpCdYn = "0";
              stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "변경할 데이터가 존재하지 않습니다.";
                  resultMsg.err = "변경할 데이터가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 시나리오명이 존재하는지 체크한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var exist_yn = "Y";
              paramData.status = "modify";
              paramData.prev_grp_cd = paramData.grp_cd;
              paramData.prev_scen_cd = paramData.scen_cd;
              stmt = mapper.getStatement('simulation', 'getExistScenName', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  exist_yn = rows[0].exist_yn;
                }
                if(exist_yn == "Y") {
                  resultMsg.result = false;
                  resultMsg.msg = "시나리오 그룹명이 이미 존재합니다.";
                  resultMsg.err = "시나리오 그룹명이 이미 존재합니다.";
                  return callback(resultMsg);
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 시나리오 이름을 변경한다. */
          function(msg, callback) {
            try {
              stmt = mapper.getStatement('simulation', 'renameScenario', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 변경하였습니다.";
            resultMsg.err = null;
            conn.commit();
          }
          res.json(resultMsg);
          res.end();
        });
      });
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 선택된 시나리오를 복사한다.
 * 2019-11-07  bkLove(촤병국)
 */
var copyScenario = function(req, res) {
  try {
    log.debug('simulation.copyScenario 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.copyScenario  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. 로그인 사용자가 등록한 simul_mast 조회한다.  */
          function(callback) {
            try {
              var msg = {};
              msg.v_simul_mast = {};
              paramData.changeGrpCdYn = "1";
              stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "기본정보가 존재하지 않습니다.";
                  resultMsg.err = "기본정보가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                if(rows.length == 1) {
                  msg.v_simul_mast = rows[0];
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 복사하기에서 사용할 로그인 사용자가 등록한 시나리오명을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.v_simul_mast == "undefined" || Object.keys(msg.v_simul_mast).length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "기본정보가 존재하지 않습니다.";
                resultMsg.err = "기본정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else if(msg.v_simul_mast.scen_name == "") {
                resultMsg.result = false;
                resultMsg.msg = "시나리오명이 존재하지 않습니다.";
                resultMsg.err = "시나리오명이 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                stmt = mapper.getStatement('simulation', 'getScenNameForCopy', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  log.debug("### msg.v_simul_mast.scen_name", msg.v_simul_mast.scen_name);
                  var v_postfix = "_copy";
                  var v_scen_name = msg.v_simul_mast.scen_name;
                  var v_max_count = 100;
                  for(var i = 0; i < 20; i++) {
                    v_scen_name += v_postfix;
                    if(fn_getByte.call(this, v_scen_name) > v_max_count) {
                      resultMsg.result = false;
                      resultMsg.msg = "시나리오명(" + v_scen_name + ") 최대 " + v_max_count + "자 초과되었습니다.";
                      resultMsg.err = "시나리오명(" + v_scen_name + ") 최대 " + v_max_count + "자 초과되었습니다.";
                      return callback(resultMsg);
                    }
                    var v_filter_data = _.filter(rows, {
                      "scen_name": v_scen_name
                    });
                    if(!v_filter_data || v_filter_data.length == 0) {
                      paramData.scen_name = v_scen_name;
                      break;
                    }
                  }
                  log.debug("#### paramData.scen_name", paramData.scen_name);
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 시나리오명이 존재하는지 체크한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var exist_yn = "Y";
              paramData.status = "insert";
              stmt = mapper.getStatement('simulation', 'getExistScenName', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  exist_yn = rows[0].exist_yn;
                }
                if(exist_yn == "Y") {
                  resultMsg.result = false;
                  resultMsg.msg = "시나리오 그룹명이 이미 존재합니다.";
                  resultMsg.err = "시나리오 그룹명이 이미 존재합니다.";
                  return callback(resultMsg);
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. 시뮬레이션 시나리오 코드를 채번한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.v_simul_mast == "undefined" || Object.keys(msg.v_simul_mast).length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "시나리오 정보가 존재하지 않습니다.";
                resultMsg.err = "시나리오 정보가 존재하지 않습니다.";
                callback(resultMsg);
              }
              var queryId = "getScenCdByGroup";
              /* 그룹인지 체크 */
              if(msg.v_simul_mast.grp_yn == "0") {
                queryId = "getScenCd1";
              }
              paramData.init_incre_grp_cd = initGrpInfo.INIT_INCRE_GRP_CD; /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
              /* 상위그룹이 없는 경우 그룹여부='1' 설정 */
              if(typeof paramData.grp_cd == "undefined" || !paramData.grp_cd) {
                paramData.grp_cd = initGrpInfo.INIT_GRP_CD; /* 그룹코드 최초값 */
              }
              stmt = mapper.getStatement('simulation', queryId, paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  paramData.scen_cd = rows[0].scen_cd;
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. 시뮬레이션 시나리오 정렬순번을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              paramData.grp_yn = msg.v_simul_mast.grp_yn;
              stmt = mapper.getStatement('simulation', 'getScenOrderNo', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  paramData.scen_order_no = rows[0].scen_order_no;
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 6. 시뮬레이션 기본 정보를 복사한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              paramData.serial_no = 1;
              stmt = mapper.getStatement('simulation', "copyTmSimulMast", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  callback(resultMsg);
                } else {
                  if(rows) {
                    log.debug("simulation.copyTmSimulMast success");
                  }
                  callback(null, msg);
                }
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 7. 시나리오인 경우 상위 그룹정보 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              /* 시나리오 이면서 그룹이 없는 경우 */
              if(msg.v_simul_mast.grp_yn == "0" && msg.v_simul_mast.grp_cd == "*") {
                callback(null, msg);
              } else {
                paramData.upper_scen_cd = paramData.grp_cd;
                stmt = mapper.getStatement('simulation', "getScenarioUpperGrp", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 1) {
                    resultMsg.result = false;
                    resultMsg.msg = "선택된 시나리오 그룹 정보가 한건 이상 존재합니다.";
                    resultMsg.err = "선택된 시나리오 그룹 정보가 한건 이상 존재합니다.";
                    return callback(resultMsg);
                  } else if(rows.length == 1) {
                    /* 상위 그룹 */
                    msg.v_simul_upper_grp = rows[0];
                  }
                  if(typeof paramData.upper_scen_cd != "undefined") {
                    paramData.upper_scen_cd = "";
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 8. 상위 그룹이 존재하는 경우 그룹 공유 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              /* 상위 그룹이 없는 경우 */
              if(typeof msg.v_simul_upper_grp == "undefined" || Object.keys(msg.v_simul_upper_grp).length == 0) {
                callback(null, msg);
              } else {
                paramData.upper_grp_cd = msg.v_simul_upper_grp.grp_cd;
                paramData.upper_scen_cd = msg.v_simul_upper_grp.scen_cd;
                paramData.changeGrpCdYn = "0";
                stmt = mapper.getStatement('simulation', "getSimulShareUpperGrp", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    var v_temp = _.filter(rows, {
                      'email': paramData.user_id
                    });
                    if(typeof v_temp != "undefined" && v_temp.length == 1) {
                      msg.v_simul_share_upper_grp = rows[0];
                    }
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 9. 등록할 공유정보 설정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_insert_list = [];
              msg.arr_update_list = [];
              /* 그룹 정보가 존재하는 경우 */
              if(typeof msg.v_simul_upper_grp != "undefined" && Object.keys(msg.v_simul_upper_grp).length > 0) {
                /* simul_share 수정 건 */
                if(typeof msg.v_simul_share_upper_grp != "undefined" && Object.keys(msg.v_simul_share_upper_grp).length > 0) {
                  msg.arr_update_list.push({
                    "grp_cd": msg.v_simul_upper_grp.grp_cd,
                    "scen_cd": msg.v_simul_upper_grp.scen_cd,
                    "email": paramData.user_id,
                    "owner_yn": "1"
                  });
                }
                /* simul_share 등록 건 */
                else {
                  msg.arr_insert_list.push({
                    "grp_cd": msg.v_simul_upper_grp.grp_cd,
                    "scen_cd": msg.v_simul_upper_grp.scen_cd,
                    "email": paramData.user_id,
                    "owner_yn": "1"
                  });
                }
              }
              msg.arr_insert_list.push({
                "grp_cd": paramData.grp_cd,
                "scen_cd": paramData.scen_cd,
                "email": paramData.user_id,
                "owner_yn": "1"
              });
              if(typeof msg.arr_insert_list == "undefined" || msg.arr_insert_list.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_insert_list = msg.arr_insert_list;
                stmt = mapper.getStatement('simulation', "saveShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.saveShareUserInArr success");
                  }
                  paramData.arr_insert_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 10. 수정할 공유정보 설정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_update_list == "undefined" || msg.arr_update_list.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_update_list = msg.arr_update_list;
                stmt = mapper.getStatement('simulation', "modifyShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.saveShareUserInArr success");
                  }
                  paramData.arr_update_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 11. [tm_simul_portfolio] 를 복사한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              /* 시나리오인 경우 */
              if(msg.v_simul_mast.grp_yn == "0") {
                stmt = mapper.getStatement('simulation', "copyTmSimulPortfolio", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.copyTmSimulPortfolio success");
                  }
                  callback(null);
                });
              } else {
                callback(null);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 복사하였습니다.";
            resultMsg.err = null;
            conn.commit();
          }
          res.json(resultMsg);
          res.end();
        });
      });
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 선택된 시나리오를 그룹변경한다.
 * 2019-11-07  bkLove(촤병국)
 */
var fnChangeGroup = function(req, res) {
  try {
    log.debug('simulation.fnChangeGroup 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.fnChangeGroup  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        try {
          paramData.moduleId = "changeGroupModle";
          paramData.transaction = {};
          paramData.transaction.mapper = mapper;
          paramData.transaction.pool = pool;
          paramData.transaction.conn = conn;
          /* 그룹변경 모듈을 수행한다. */
          changeGroupModle.call(this, req, res, paramData).then(function(e) {
            log.debug('simulation.fnChangeGroup 완료.');
            if(e && e.resultMsg && e.resultMsg.result) {
              resultMsg = e.resultMsg;
              conn.commit();
              res.json(resultMsg);
              res.end();
            } else {
              log.debug(e, paramData);
              conn.rollback();
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = config.MSG.error01;
              res.json(resultMsg);
              res.end();
            }
          }).catch(function(err) {
            log.debug('simulation.fnChangeGroup 완료.');
            log.debug(err, paramData);
            conn.rollback();
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            res.json(resultMsg);
            res.end();
          });
        } catch (err) {
          log.debug('simulation.fnChangeGroup 완료.');
          log.debug(err, paramData);
          conn.rollback();
          resultMsg.result = false;
          resultMsg.msg = config.MSG.error01;
          resultMsg.err = err;
          res.json(resultMsg);
          res.end();
        }
      });
    });
  } catch (expetion) {
    log.debug('simulation.fnChangeGroup 완료.');
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * arr 그룹변경 모듈을 수행한다.
 * 2019-05-20  bkLove(촤병국)
 */
var arrChangeGroupModle = async function(req, res, paramData) {
  return await new Promise(async function(resolve, reject) {
    try {
      var resultMsg = {};
      if(!paramData || Object.keys(paramData).length == 0 || !paramData.transaction || Object.keys(paramData.transaction).length == 0 || !paramData.transaction.mapper || !paramData.transaction.pool || !paramData.transaction.conn) {
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = config.MSG.error01;
        resolve({
          result: false,
          resultMsg: resultMsg
        });
      } else {
        var mapper = paramData.transaction.mapper;
        var pool = paramData.transaction.pool;
        var conn = paramData.transaction.conn;
        var format = {
          language: 'sql',
          indent: ''
        };
        var param = {
          user_id: paramData.user_id,
          inst_cd: paramData.inst_cd,
          type_cd: paramData.type_cd,
          large_type: paramData.large_type,
          krx_cd: paramData.krx_cd
        };
        param.transaction = {};
        param.transaction.mapper = mapper;
        param.transaction.pool = pool;
        param.transaction.conn = conn;
        if(typeof paramData.arr_simul_change_group == "undefined" || paramData.arr_simul_change_group.length == 0) {
          resultMsg.result = false;
          resultMsg.msg = "";
          resultMsg.err = "";
          resolve({
            result: true,
            resultMsg: resultMsg
          });
        } else {
          log.debug("\n\n########## arrChangeGroupModle 그룹변경 START ############");
          for(var i = 0; i < paramData.arr_simul_change_group.length; i++) {
            var item = paramData.arr_simul_change_group[i];
            param.prev_grp_cd = item.grp_cd;
            param.prev_scen_cd = item.scen_cd;
            param.grp_cd = initGrpInfo.INIT_GRP_CD;
            param.org_grp_yn = "0";
            /* 그룹변경 모듈을 수행한다. */
            log.debug("\n\n########## 개별 그룹변경 호출 START ( changeGroupModle  ) - " + param.prev_grp_cd + "/" + param.prev_scen_cd + "/" + param.grp_cd);
            await changeGroupModle.call(this, req, res, param).then(function(e) {
              if(e && e.resultMsg && e.resultMsg.result) {
                log.debug("########## 개별 그룹변경 호출 success END");
                resultMsg = e.resultMsg;
              } else {
                log.debug("########## 개별 그룹변경 호출 error END");
                log.debug(e, param);
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = config.MSG.error01;
              }
            }).catch(function(err) {
              log.debug("########## 개별 그룹변경 호출 error END");
              log.debug(err, param);
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
            });
          }
          if(resultMsg.result) {
            resolve({
              result: true,
              resultMsg: resultMsg
            });
          } else {
            resolve({
              result: false,
              resultMsg: resultMsg
            });
          }
          log.debug("########## arrChangeGroupModle 그룹변경 success END ############\n\n");
        }
      }
    } catch (err) {
      log.debug("########## arrChangeGroupModle 그룹변경 error END ############\n\n");
      log.debug(err, param);
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      resultMsg.err = err;
      resolve({
        result: false,
        resultMsg: resultMsg
      });
    }
  });
}
/*
 * 그룹변경 모듈을 수행한다.
 * 2019-05-20  bkLove(촤병국)
 */
var changeGroupModle = async function(req, res, paramData) {
  return await new Promise(function(resolve, reject) {
    try {
      log.debug('simulation.changeGroupModle 호출됨.');
      var resultMsg = {};
      if(!paramData || Object.keys(paramData).length == 0 || !paramData.transaction || Object.keys(paramData.transaction).length == 0 || !paramData.transaction.mapper || !paramData.transaction.pool || !paramData.transaction.conn) {
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = config.MSG.error01;
        resolve({
          result: false,
          resultMsg: resultMsg
        });
      } else {
        var mapper = paramData.transaction.mapper;
        var pool = paramData.transaction.pool;
        var conn = paramData.transaction.conn;
        var format = {
          language: 'sql',
          indent: ''
        };
        async.waterfall([
          /* 1. 선택된 시나리오 및 변경할 그룹정보가 존재하는지 체크한다. */
          function(callback) {
            try {
              var msg = {};
              paramData.INIT_GRP_CD = initGrpInfo.INIT_GRP_CD;
              stmt = mapper.getStatement('simulation', 'checkScenarioExistForChangeGroup', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "기본정보가 존재하지 않습니다.";
                  resultMsg.err = "기본정보가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                if(rows.length == 1) {
                  if(rows[0].scenario_exist_yn != "Y") {
                    resultMsg.result = false;
                    resultMsg.msg = "선택된 시나리오 정보가 존재하지 않습니다.";
                    resultMsg.msg = "선택된 시나리오 정보가 존재하지 않습니다.";
                    return callback(resultMsg);
                  }
                  if(rows[0].grp_exist_yn != "Y") {
                    resultMsg.result = false;
                    resultMsg.msg = "변경 할 그룹 정보가 존재하지 않습니다.";
                    resultMsg.msg = "변경 할 그룹 정보가 존재하지 않습니다.";
                    return callback(resultMsg);
                  }
                  callback(null, msg);
                } else {
                  resultMsg.result = false;
                  resultMsg.msg = "기본정보를 확인해 주세요.";
                  resultMsg.err = "기본정보를 확인해 주세요.";
                  return callback(resultMsg);
                }
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 시뮬레이션 시나리오 코드를 채번한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              paramData.init_incre_grp_cd = initGrpInfo.INIT_INCRE_GRP_CD; /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
              /* 상위그룹이 없는 경우 그룹여부='1' 설정 */
              if(typeof paramData.grp_cd == "undefined" || !paramData.grp_cd) {
                paramData.grp_cd = initGrpInfo.INIT_GRP_CD; /* 그룹코드 최초값 */
              }
              stmt = mapper.getStatement('simulation', "getScenCd1", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  paramData.scen_cd = rows[0].scen_cd;
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 시뮬레이션 시나리오 정렬순번을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              paramData.grp_yn = "0";
              stmt = mapper.getStatement('simulation', 'getScenOrderNo', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  paramData.scen_order_no = rows[0].scen_order_no;
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. 변경전 시나리오의 상위 그룹 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_simul_upper_grp = {};
              paramData.changeGrpCdYn = "1";
              stmt = mapper.getStatement('simulation', 'getUpperGrp', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  msg.v_simul_upper_grp = rows[0];
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. 그룹변경인 경우 [tm_simul_mast] 수정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "modifyTmSimulMastByChangeGroup", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  callback(resultMsg, msg);
                } else {
                  callback(null, msg);
                }
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 6. 그룹변경인 경우 [tm_simul_portfolio] 수정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "modifyTmSimulPortfolioByChangeGroup", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.modifyTmSimulPortfolioByChangeGroup ( 그룹변경 tm_simul_portfolio ) success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 7. 변경할 대상이 상위 그룹이 있는 경우 - 변경전 시나리오 공유자 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_simul_prev_share = [];
              /* 변경할 대상이 상위그룹인 경우 */
              if(paramData.org_grp_yn == "1") {
                paramData.changeGrpCdYn = "1";
                stmt = mapper.getStatement('simulation', "getUserListInCheckedSimulation", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    msg.v_simul_prev_share = rows;
                  }
                  callback(null, msg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 8. 변경할 대상이 상위 그룹이 있는 경우 - 변경할 그룹 공유자 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_simul_share_upper = [];
              /* 변경할 대상이 상위 그룹이 있는 경우 */
              if(paramData.org_grp_yn == "1") {
                paramData.changeGrpCdYn = "0";
                paramData.upper_grp_cd = "*";
                paramData.upper_scen_cd = paramData.grp_cd;
                stmt = mapper.getStatement('simulation', "getSimulShareUpperGrp", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    msg.v_simul_share_upper = rows;
                  }
                  callback(null, msg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 9. 변경할 대상이 상위 그룹이 있는 경우 - 그룹 공유자 정보를 설정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_insert_list = [];
              /* 변경할 대상이 상위 그룹이 있는 경우 - (변경전) 시나리오 공유자가 존재하는 경우  */
              if(typeof msg.v_simul_prev_share != "undefined" && msg.v_simul_prev_share.length > 0) {
                /* 변경할 대상이 상위 그룹이 있는 경우 - (변경할) 그룹 공유자가 존재하는 경우  */
                if(typeof msg.v_simul_share_upper != "undefined" && msg.v_simul_share_upper.length > 0) {
                  msg.v_simul_prev_share.forEach(function(item, index, array) {
                    var v_check_data = _.filter(msg.v_simul_share_upper, {
                      'email': item.email
                    });
                    if(typeof v_check_data == "undefined" || v_check_data.length == 0) {
                      msg.arr_insert_list.push({
                        "grp_cd": paramData.upper_grp_cd,
                        "scen_cd": paramData.upper_scen_cd,
                        "email": item.email,
                        "owner_yn": item.owner_yn
                      });
                    }
                  });
                  paramData.arr_insert_list = msg.arr_insert_list;
                } else {
                  paramData.arr_insert_list = msg.v_simul_prev_share;
                }
              }
              if(!paramData.arr_insert_list || paramData.arr_insert_list.length == 0) {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulation', "saveShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.saveShareUserInArr ( 기존 시나리오 공유자 -> 그룹 공유자 ) success");
                  }
                  paramData.arr_insert_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 10. 변경전 대상이 상위 그룹이 있는 경우 - 변경전 그룹에 속하지 않는 삭제 대상 공유자를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_arr_simul_share_not_in_group = [];
              /* 변경전 대상이 상위그룹이 있는 경우 */
              if(typeof msg.v_simul_upper_grp == "undefined" || Object.keys(msg.v_simul_upper_grp).length == 0) {
                callback(null, msg);
              } else {
                paramData.prev_upper_grp_cd = msg.v_simul_upper_grp.grp_cd;
                paramData.prev_upper_scen_cd = msg.v_simul_upper_grp.scen_cd;
                stmt = mapper.getStatement('simulation', "getSimulShareNotInGroupForDelelete", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    msg.v_arr_simul_share_not_in_group = rows;
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 11. 변경전 대상이 상위 그룹이 있는 경우 - 변경전 그룹에 속하지 않는 삭제 대상 공유자를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              /* 변경전 대상이 상위그룹이 있는 경우 */
              if(typeof msg.v_arr_simul_share_not_in_group == "undefined" || msg.v_arr_simul_share_not_in_group.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_delete_list = msg.v_arr_simul_share_not_in_group;
                stmt = mapper.getStatement('simulation', "deleteShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.deleteShareUserInArr ( 변경전 그룹에 속하지 않는 삭제 대상 ) success");
                  }
                  paramData.arr_delete_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 12. 그룹변경인 경우 [tm_simul_share] 시나리오 수정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "modifyTmSimulShareScenByChangeGroup", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.modifyTmSimulShareScenByChangeGroup ( 시나리오 tm_simul_share ) success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 13. 그룹변경인 경우 [tm_simul_result_mast] 수정한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "modifyTmSimulResultMastByChangeGroup", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.modifyTmSimulResultMastByChangeGroup ( 그룹변경 tm_simul_result_mast ) success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 14. 그룹변경인 경우 [tm_simul_result_anal] 수정한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "modifyTmSimulResultAnalByChangeGroup", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.modifyTmSimulResultAnalByChangeGroup ( 그룹변경 tm_simul_result_anal ) success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 15. 그룹변경인 경우 [tm_simul_result_daily] 수정한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "modifyTmSimulResultDailyByChangeGroup", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.modifyTmSimulResultDailyByChangeGroup ( 그룹변경 tm_simul_result_daily ) success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 16. 그룹변경인 경우 [tm_simul_result_rebalance] 수정한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "modifyTmSimulResultRebalanceByChangeGroup", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.modifyTmSimulResultRebalanceByChangeGroup ( 그룹변경 tm_simul_result_rebalance ) success");
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
          /* 17. 그룹변경인 경우 [tm_simul_result_contribute] 수정한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulation', "modifyTmSimulResultContributeByChangeGroup", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows) {
                  log.debug("simulation.modifyTmSimulResultContributeByChangeGroup ( 그룹변경 tm_simul_result_contribute ) success");
                }
                callback(null);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              return callback(resultMsg);
            }
          },
        ], function(err) {
          log.debug('simulation.changeGroupModle 완료.');
          if(err) {
            log.debug(err, stmt, paramData);
            resolve({
              result: false,
              resultMsg: resultMsg
            });
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 그룹변경 하였습니다.";
            resultMsg.err = null;
            resolve({
              result: true,
              resultMsg: resultMsg
            });
          }
        });
      }
    } catch (expetion) {
      log.debug('simulation.changeGroupModle 완료.');
      log.debug(expetion, paramData);
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      resultMsg.err = expetion;
      resolve({
        result: false,
        resultMsg: resultMsg
      });
    }
  }).catch(function(err) {
    log.debug('simulation.changeGroupModle 완료.');
    log.debug(err, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = err;
  });
}
/*
 * 공유할 공유자를 조회한다.
 * 2019-11-13  bkLove(촤병국)
 */
var getUserListForShare = function(req, res) {
  try {
    log.debug('simulation.getUserListForShare 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getUserListForShare  req.body.data no data.", req.body.data);
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
    resultMsg.arr_user_list_for_share = [];
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      async.waterfall([
        /* 1. 선택된 시뮬레이션에 속한 대상자를 조회한다. */
        function(callback) {
          try {
            var msg = {};
            paramData.changeGrpCdYn = "0";
            stmt = mapper.getStatement('simulation', 'getUserListInCheckedSimulation', paramData, format);
            log.debug(stmt, paramData);
            conn.query(stmt, function(err, rows) {
              if(err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                return callback(resultMsg);
              }
              if(rows && rows.length > 0) {
                msg.arr_user_list_checked_simulation = rows;
              }
              callback(null, msg);
            });
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
        /* 2. 공유할 모든 대상자를 조회한다. */
        function(msg, callback) {
          try {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            stmt = mapper.getStatement('simulation', 'getAllUserListForShare', paramData, format);
            log.debug(stmt);
            conn.query(stmt, function(err, rows) {
              if(err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                return callback(resultMsg);
              }
              if(!rows || rows.length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "대상자가 존재하지 않습니다.";
                resultMsg.err = "대상자가 존재하지 않습니다.";
                return callback(resultMsg);
              }
              if(rows && rows.length > 0) {
                if(typeof msg.arr_user_list_checked_simulation == "undefined" || msg.arr_user_list_checked_simulation.length == 0) {
                  resultMsg.arr_user_list_for_share = rows;
                } else {
                  rows.forEach(function(item, index, array) {
                    /* 시나리오에 등록된 사용자 제외 */
                    var v_check_data = _.filter(msg.arr_user_list_checked_simulation, {
                      'email': item.email,
                      'owner_yn': '0'
                    });
                    if(typeof v_check_data == "undefined" || v_check_data.length == 0) {
                      /* 현재 사용자 제외 */
                      if(item.email != paramData.user_id) {
                        resultMsg.arr_user_list_for_share.push(item);
                      }
                    }
                  });
                }
                callback(null);
              }
            });
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
      ], function(err) {
        if(err) {
          log.debug(err, stmt, paramData);
        } else {
          resultMsg.result = true;
          resultMsg.msg = "";
          resultMsg.err = null;
        }
        res.json(resultMsg);
        res.end();
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_user_list_for_share = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 공유된 공유자를 조회한다.
 * 2019-11-13  bkLove(촤병국)
 */
var getUserListShared = function(req, res) {
  try {
    log.debug('simulation.getUserListShared 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getUserListShared  req.body.data no data.", req.body.data);
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
    resultMsg.arr_user_list_shared = [];
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      async.waterfall([
        /* 1. 선택된 시뮬레이션에 속한 대상자를 조회한다. */
        function(callback) {
          try {
            var msg = {};
            paramData.changeGrpCdYn = "0";
            stmt = mapper.getStatement('simulation', 'getUserListInCheckedSimulation', paramData, format);
            log.debug(stmt, paramData);
            conn.query(stmt, function(err, rows) {
              if(err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                return callback(resultMsg);
              }
              if(rows && rows.length > 0) {
                msg.arr_user_list_checked_simulation = rows;
              }
              callback(null, msg);
            });
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
        /* 2. 공유된 대상자를 조회한다. */
        function(msg, callback) {
          try {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            /* 선택된 시뮬레이션에 공유 대상이 존재하는지 체크 */
            if(typeof msg.arr_user_list_checked_simulation == "undefined" || msg.arr_user_list_checked_simulation.length == 0) {
              callback(null);
            } else {
              stmt = mapper.getStatement('simulation', 'getAllUserListForShare', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "대상자가 존재하지 않습니다.";
                  resultMsg.err = "대상자가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  msg.arr_user_list_checked_simulation.forEach(function(item, index, array) {
                    if(item.owner_yn == '0') {
                      var v_check_data = _.filter(rows, {
                        'email': item.email
                      });
                      if(typeof v_check_data != "undefined" && v_check_data.length == 1) {
                        resultMsg.arr_user_list_shared.push({
                          "grp_cd": paramData.grp_cd,
                          "scen_cd": paramData.scen_cd,
                          "email": item.email,
                          "name": v_check_data[0].name,
                          "owner_yn": "0"
                        });
                      }
                    }
                  });
                  if(resultMsg.arr_user_list_shared.length > 0) {
                    resultMsg.arr_user_list_shared = _.orderBy(resultMsg.arr_user_list_shared, ["name"], ["asc"]);
                  }
                }
                callback(null);
              });
            }
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
      ], function(err) {
        if(err) {
          log.debug(err, stmt, paramData);
        } else {
          resultMsg.result = true;
          resultMsg.msg = "";
          resultMsg.err = null;
        }
        res.json(resultMsg);
        res.end();
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_user_list_shared = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 공유 대상자를 적용한다.
 * 2019-11-13  bkLove(촤병국)
 */
var applyShareUserInArr = function(req, res) {
  try {
    log.debug('simulation.applyShareUserInArr 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.applyShareUserInArr  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    resultMsg.share_count = 0;
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. 시나리오 또는 그룹 정보를 조회한다. */
          function(callback) {
            try {
              var msg = {};
              paramData.changeGrpCdYn = "0";
              stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "선택된 시나리오 정보가 존재하지 않습니다.";
                  resultMsg.err = "선택된 시나리오 정보가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  msg.v_simul_mast = rows[0];
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 시나리오 인 경우 상위 그룹, 그룹인 경우 그룹에 속한 시나리오들을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.v_simul_mast == "undefined" || Object.keys(msg.v_simul_mast).length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "선택된 시나리오 정보가 존재하지 않습니다.";
                resultMsg.err = "선택된 시나리오 정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                /*  시나리오 이면서 그룹이 없는 경우 skip */
                if(msg.v_simul_mast.grp_yn == "0" && msg.v_simul_mast.grp_cd == "*") {
                  callback(null, msg);
                } else {
                  var v_queryId = "getScenarioUpperGrp";
                  paramData.upper_scen_cd = paramData.grp_cd;
                  /* 그룹인 경우 */
                  if(msg.v_simul_mast.grp_yn == "1") {
                    v_queryId = "getScenarioInGrp";
                    paramData.upper_scen_cd = paramData.scen_cd;
                  }
                  stmt = mapper.getStatement('simulation', v_queryId, paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(!rows || rows.length == 0) {
                      /* 그룹이 아닌 경우 */
                      if(msg.v_simul_mast.grp_yn == "0") {
                        resultMsg.result = false;
                        resultMsg.msg = "선택된 시나리오 그룹 정보가 존재하지 않습니다.";
                        resultMsg.err = "선택된 시나리오 그룹 정보가 존재하지 않습니다.";
                        return callback(resultMsg);
                      }
                    } else {
                      /* 그룹인 경우 */
                      if(msg.v_simul_mast.grp_yn == "1") {
                        /* 그룹에 속한 시나리오 */
                        msg.v_arr_simul_in_grp = rows;
                      } else {
                        if(rows && rows.length > 1) {
                          resultMsg.result = false;
                          resultMsg.msg = "선택된 시나리오 그룹 정보가 한건 이상 존재합니다.";
                          resultMsg.err = "선택된 시나리오 그룹 정보가 한건 이상 존재합니다.";
                          return callback(resultMsg);
                        } else if(rows.length == 1) {
                          /* 상위 그룹 */
                          msg.v_simul_upper_grp = rows[0];
                        }
                      }
                    }
                    if(typeof paramData.upper_scen_cd != "undefined") {
                      paramData.upper_scen_cd = "";
                    }
                    callback(null, msg);
                  });
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 시나리오 또는 그룹에 속한 공유자 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_data_list = [];
              msg.arr_insert_list = [];
              msg.arr_update_list = [];
              paramData.arr_data_list = [];
              if(msg.v_simul_mast.grp_yn == "1") {
                /* 그룹 하위 정보가 존재하는 경우 */
                if(typeof msg.v_arr_simul_in_grp != "undefined" && msg.v_arr_simul_in_grp.length > 0) {
                  msg.arr_data_list = msg.v_arr_simul_in_grp;
                }
                msg.arr_data_list.push(msg.v_simul_mast);
              } else {
                /* 그룹 정보가 존재하는 경우 */
                if(typeof msg.v_simul_upper_grp != "undefined" && Object.keys(msg.v_simul_upper_grp).length > 0) {
                  msg.arr_data_list.push(msg.v_simul_upper_grp);
                }
                msg.arr_data_list.push(msg.v_simul_mast);
              }
              paramData.arr_data_list = msg.arr_data_list;
              stmt = mapper.getStatement('simulation', "getSimulShareInArr", paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  paramData.arr_checked_for_share.forEach(function(item, index, array) {
                    msg.arr_data_list.forEach(function(item_sub, index_sub, array_sub) {
                      msg.arr_insert_list.push({
                        "grp_cd": item_sub.grp_cd,
                        "scen_cd": item_sub.scen_cd,
                        "email": item.email,
                        "owner_yn": "0"
                      });
                    });
                  });
                } else {
                  paramData.arr_checked_for_share.forEach(function(item, index, array) {
                    msg.arr_data_list.forEach(function(item_sub, index_sub, array_sub) {
                      var v_temp = _.filter(rows, function(o) {
                        return o.grp_cd == item_sub.grp_cd && o.scen_cd == item_sub.scen_cd && o.email == item.email;
                      });
                      if(typeof v_temp == "undefined" || v_temp.length == 0) {
                        msg.arr_insert_list.push({
                          "grp_cd": item_sub.grp_cd,
                          "scen_cd": item_sub.scen_cd,
                          "email": item.email,
                          "owner_yn": "0"
                        });
                      } else {
                        msg.arr_update_list.push({
                          "grp_cd": item_sub.grp_cd,
                          "scen_cd": item_sub.scen_cd,
                          "email": item.email
                        });
                      }
                    });
                  });
                }
                paramData.arr_data_list = [];
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. 신규 등록할 공유자들을 등록한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_insert_list == "undefined" || msg.arr_insert_list.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_insert_list = msg.arr_insert_list;
                stmt = mapper.getStatement('simulation', 'saveShareUserInArr', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. 수정할 공유자들을 변경한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_update_list == "undefined" || msg.arr_update_list.length == 0) {
                callback(null);
              } else {
                paramData.arr_update_list = msg.arr_update_list;
                stmt = mapper.getStatement('simulation', 'modifyShareUserInArr', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  callback(null);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 공유하였습니다.";
            resultMsg.err = null;
            conn.commit();
          }
          res.json(resultMsg);
          res.end();
        });
      });
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 공유 대상자를 해제한다.
 * 2019-11-13  bkLove(촤병국)
 */
var applyShareUserRevokeInArr = function(req, res) {
  try {
    log.debug('simulation.applyShareUserRevokeInArr 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.applyShareUserRevokeInArr  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    if(typeof paramData.only_shared_user != "undefined" && paramData.only_shared_user == "Y") {
      paramData.arr_checked_shared.push({
        "email": paramData.user_id
      })
    }
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        try {
          paramData.moduleId = "applyShareUserRevokeInArrModule";
          paramData.transaction = {};
          paramData.transaction.mapper = mapper;
          paramData.transaction.pool = pool;
          paramData.transaction.conn = conn;
          log.debug('simulation.applyShareUserRevokeInArr -> simulation.applyShareUserRevokeInArrModule START');
          /* 공유 대상자 해제 모듈을 호출한다. */
          applyShareUserRevokeInArrModule.call(this, req, res, paramData).then(function(e) {
            if(e && e.resultMsg && e.resultMsg.result) {
              log.debug('simulation.applyShareUserRevokeInArr -> simulation.applyShareUserRevokeInArrModule success END');
              resultMsg = e.resultMsg;
              conn.commit();
              res.json(resultMsg);
              res.end();
            } else {
              log.debug('simulation.applyShareUserRevokeInArr -> simulation.applyShareUserRevokeInArrModule error END');
              log.debug(e, paramData);
              conn.rollback();
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = config.MSG.error01;
              res.json(resultMsg);
              res.end();
            }
          }).catch(function(err) {
            log.debug('simulation.applyShareUserRevokeInArr -> simulation.applyShareUserRevokeInArrModule error END');
            log.debug(err, paramData);
            conn.rollback();
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            res.json(resultMsg);
            res.end();
          });
        } catch (err) {
          log.debug('simulation.applyShareUserRevokeInArr -> simulation.applyShareUserRevokeInArrModule error END');
          log.debug(err, paramData);
          conn.rollback();
          resultMsg.result = false;
          resultMsg.msg = config.MSG.error01;
          resultMsg.err = err;
          res.json(resultMsg);
          res.end();
        }
      });
    });
  } catch (expetion) {
    log.debug('simulation.applyShareUserRevokeInArr 완료.');
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 공유 대상자 해제 모듈을 호출한다.
 * 2019-05-20  bkLove(촤병국)
 */
var applyShareUserRevokeInArrModule = async function(req, res, paramData) {
  return await new Promise(function(resolve, reject) {
    try {
      log.debug('simulation.applyShareUserRevokeInArrModule 호출됨.');
      var resultMsg = {};
      if(!paramData || Object.keys(paramData).length == 0 || !paramData.transaction || Object.keys(paramData.transaction).length == 0 || !paramData.transaction.mapper || !paramData.transaction.pool || !paramData.transaction.conn) {
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = config.MSG.error01;
        resolve({
          result: false,
          resultMsg: resultMsg
        });
      } else {
        var mapper = paramData.transaction.mapper;
        var pool = paramData.transaction.pool;
        var conn = paramData.transaction.conn;
        var format = {
          language: 'sql',
          indent: ''
        };
        var stmt = "";
        async.waterfall([
          /* 1. 시나리오 또는 그룹 정보를 조회한다. */
          function(callback) {
            try {
              var msg = {};
              paramData.changeGrpCdYn = "0";
              stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "선택된 시나리오 정보가 존재하지 않습니다.";
                  resultMsg.err = "선택된 시나리오 정보가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  msg.v_simul_mast = rows[0];
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 시나리오 인 경우 상위 그룹, 그룹인 경우 그룹에 속한 시나리오들을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.v_simul_mast == "undefined" || Object.keys(msg.v_simul_mast).length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "선택된 시나리오 정보가 존재하지 않습니다.";
                resultMsg.err = "선택된 시나리오 정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                /* 시나리오 이면서 그룹이 없는 경우 */
                if(msg.v_simul_mast.grp_yn == "0" && msg.v_simul_mast.grp_cd == "*") {
                  callback(null, msg);
                } else {
                  var v_queryId = "getScenarioUpperGrp";
                  paramData.upper_scen_cd = paramData.grp_cd;
                  /* 그룹인 경우 */
                  if(msg.v_simul_mast.grp_yn == "1") {
                    v_queryId = "getScenarioInGrp";
                    paramData.upper_scen_cd = paramData.scen_cd;
                  }
                  stmt = mapper.getStatement('simulation', v_queryId, paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(!rows || rows.length == 0) {
                      /* 그룹이 아닌 경우 */
                      if(msg.v_simul_mast.grp_yn == "0") {
                        resultMsg.result = false;
                        resultMsg.msg = "선택된 시나리오 그룹 정보가 존재하지 않습니다.";
                        resultMsg.err = "선택된 시나리오 그룹 정보가 존재하지 않습니다.";
                        return callback(resultMsg);
                      }
                    } else {
                      /* 그룹인 경우 */
                      if(msg.v_simul_mast.grp_yn == "1") {
                        /* 그룹에 속한 시나리오 */
                        msg.v_arr_simul_in_grp = rows;
                      } else {
                        if(rows && rows.length > 1) {
                          resultMsg.result = false;
                          resultMsg.msg = "선택된 시나리오 그룹 정보가 한건 이상 존재합니다.";
                          resultMsg.err = "선택된 시나리오 그룹 정보가 한건 이상 존재합니다.";
                          return callback(resultMsg);
                        } else if(rows.length == 1) {
                          /* 상위 그룹 */
                          msg.v_simul_upper_grp = rows[0];
                        }
                      }
                    }
                    if(typeof paramData.upper_scen_cd != "undefined") {
                      paramData.upper_scen_cd = "";
                    }
                    callback(null, msg);
                  });
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /*  
              3. 선택된 시나리오 공유자 또는 그룹에 속한 공유자들을 조회한다. 
              ( 그룹 공유 후 복사하기 한 경우 - 그룹에 속한 공유자 중 owner_yn 이 '1' 이면서 선택된 사용자와 다른 공유자가 있는지 체크 )
          */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_delete_list = [];
              paramData.arr_data_list = [];
              if(typeof msg.v_simul_mast == "undefined" || Object.keys(msg.v_simul_mast).length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "선택된 시나리오 정보가 존재하지 않습니다.";
                resultMsg.err = "선택된 시나리오 정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                /* 그룹 하위 시나리오 정보가 존재하는 경우 */
                if(msg.v_simul_mast.grp_yn == "1") {
                  if(typeof msg.v_arr_simul_in_grp != "undefined" && msg.v_arr_simul_in_grp.length > 0) {
                    paramData.arr_data_list = msg.v_arr_simul_in_grp;
                  }
                }
                /* 그룹이 아닌 시나리오인 경우 */
                if(msg.v_simul_mast.grp_yn == "0") {
                  paramData.arr_data_list.push({
                    "grp_cd": msg.v_simul_mast.grp_cd,
                    "scen_cd": msg.v_simul_mast.scen_cd
                  });
                }
                if(typeof paramData.arr_data_list != "undefined" && paramData.arr_data_list.length > 0) {
                  stmt = mapper.getStatement('simulation', 'getSimulShareInArr', paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(rows && rows.length > 0) {
                      var v_temp = [];
                      paramData.arr_checked_shared.forEach(function(item, index, array) {
                        /* 삭제인 경우 */
                        if(typeof paramData.group_delete_yn != "undefined" && paramData.group_delete_yn == "1") {
                          /* 시나리오 또는 그룹 하위 시나리오 모든 공유 정보 추출 */
                          v_temp = [];
                          item.arr_simul_share_all = [...rows];
                          /* 시나리오 또는 그룹 하위 시나리오들의 본인 것만 추출 */
                          v_temp = [];
                          v_temp = _.filter(rows, function(o) {
                            return o.email == item.email;
                          });
                          item.arr_simul_share = [...v_temp];
                        }
                        /* 삭제가 아닌 경우 */
                        else if(typeof paramData.group_delete_yn == "undefined" || paramData.group_delete_yn == "0") {
                          /* 선택된 사용자의 시나리오 또는 그룹 하위 시나리오 공유자 추출 */
                          v_temp = [];
                          v_temp = _.filter(rows, function(o) {
                            return o.email == item.email;
                          });
                          item.arr_simul_share_all = [...v_temp];
                          /* 선택된 시나리오 또는 그룹 하위 시나리오들의 owner_yn 이 0 인 것만 추출 */
                          v_temp = [];
                          v_temp = _.filter(rows, function(o) {
                            return o.email == item.email && o.owner_yn == '0';
                          });
                          item.arr_simul_share = [...v_temp];
                        }
                        if(typeof v_temp != "undefined" || v_temp.length > 0) {
                          v_temp.forEach(function(o) {
                            msg.arr_delete_list.push({
                              "grp_cd": o.grp_cd,
                              "scen_cd": o.scen_cd,
                              "email": item.email
                            });
                          });
                        }
                        item.arr_simul_change_group = _.differenceWith(item.arr_simul_share_all, item.arr_simul_share, function(a, b) {
                          return a.grp_cd == b.grp_cd && a.scen_cd == b.scen_cd
                        });
                      });
                    }
                    paramData.arr_data_list = [];
                    callback(null, msg);
                  });
                } else {
                  callback(null, msg);
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. 선택된 시나리오 공유자 또는 그룹에 속한 공유자들을 해제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_delete_list != "undefined" && msg.arr_delete_list.length > 0) {
                paramData.arr_delete_list = msg.arr_delete_list;
                stmt = mapper.getStatement('simulation', 'deleteShareUserInArr', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.deleteShareUserInArr ( 선택된 시나리오 또는 그룹에 속한 공유자들을 해제 ) success");
                  }
                  msg.arr_delete_list = [];
                  callback(null, msg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. 그룹 공유 후 복사하기를 한 시나리오에 대해 그룹이 해제되기에 그룹없음으로 그룹변경 시킨다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var v_arr_simul_change_group = [];
              paramData.arr_checked_shared.forEach(function(item, index, array) {
                var v_temp = _.get(item, "arr_simul_change_group");
                if(typeof v_temp != "undefined" && v_temp.length > 0) {
                  v_temp.forEach(function(item1, index1, array1) {
                    v_arr_simul_change_group.push(item1);
                  });
                }
              });
              if(v_arr_simul_change_group.length > 0) {
                var param = {};
                param.moduleId = "arrChangeGroupModle";
                param.transaction = {};
                param.transaction.mapper = mapper;
                param.transaction.pool = pool;
                param.transaction.conn = conn;
                param.user_id = paramData.user_id;
                param.inst_cd = paramData.inst_cd;
                param.type_cd = paramData.type_cd;
                param.large_type = paramData.large_type;
                param.krx_cd = paramData.krx_cd;
                param.arr_simul_change_group = v_arr_simul_change_group;
                /* 그룹변경 모듈을 수행한다. */
                arrChangeGroupModle.call(this, req, res, param).then(function(e) {
                  if(e && e.resultMsg && e.resultMsg.result) {
                    resultMsg = e.resultMsg;
                    callback(null, msg);
                  } else {
                    log.debug(e, param);
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = config.MSG.error01;
                    callback(resultMsg);
                  }
                }).catch(function(err) {
                  log.debug(err, param);
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  callback(resultMsg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 6. 그룹에 속한 공유자 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              paramData.upper_scen_cd = "";
              msg.upper_grp_cd = "";
              msg.upper_scen_cd = "";
              /* 상위 그룹코드 설정 */
              if(msg.v_simul_mast.grp_yn == "1") {
                msg.upper_grp_cd = msg.v_simul_mast.grp_cd;
                msg.upper_scen_cd = msg.v_simul_mast.scen_cd;
              } else {
                if(typeof msg.v_simul_upper_grp != "undefined" && Object.keys(msg.v_simul_upper_grp).length > 0) {
                  msg.upper_grp_cd = msg.v_simul_upper_grp.grp_cd;
                  msg.upper_scen_cd = msg.v_simul_upper_grp.scen_cd;
                }
              }
              if(msg.upper_grp_cd != "" && msg.upper_scen_cd != "") {
                paramData.upper_grp_cd = msg.upper_grp_cd;
                paramData.upper_scen_cd = msg.upper_scen_cd;
                stmt = mapper.getStatement('simulation', 'getSimulShareInGrp', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length == 0) {
                    /* 그룹 하위에 속한 공유자가 없을시 그룹 공유자 정보 삭제 */
                    paramData.arr_checked_shared.forEach(function(item, index, array) {
                      msg.arr_delete_list.push({
                        "grp_cd": msg.upper_grp_cd,
                        "scen_cd": msg.upper_scen_cd,
                        "email": item.email
                      });
                    });
                  } else {
                    paramData.arr_checked_shared.forEach(function(item, index, array) {
                      /* 그룹 하위 조회 */
                      var v_temp = _.filter(rows, function(o) {
                        return o.email == item.email && o.grp_cd == item.grp_cd && o.scen_cd == item.scen_cd && o.owner_yn == '0';
                      });
                      /* 그룹 하위에 속한 공유자가 없을시 그룹 공유자 정보 삭제 */
                      if(typeof v_temp == "undefined" || v_temp.length == 0) {
                        msg.arr_delete_list.push({
                          "grp_cd": msg.upper_grp_cd,
                          "scen_cd": msg.upper_scen_cd,
                          "email": item.email
                        });
                      }
                    });
                  }
                  paramData.upper_scen_cd = "";
                  callback(null, msg);
                });
              } else {
                callback(null, msg);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 7. 선택된 사나리오 또는 그룹에 속한 공유자들을 해제한다. ( 그룹 하위에 속한 공유자가 없을시 그룹 공유자 정보 삭제 ) */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_delete_list != "undefined" && msg.arr_delete_list.length > 0) {
                paramData.arr_delete_list = msg.arr_delete_list;
                stmt = mapper.getStatement('simulation', 'deleteShareUserInArr', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.deleteShareUserInArr ( 그룹 하위에 속한 공유자가 없을시 그룹 공유자 정보 해제 ) success");
                  }
                  callback(null);
                });
              } else {
                callback(null);
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            resolve({
              result: false,
              resultMsg: resultMsg
            });
          } else {
            resultMsg.result = true;
            resultMsg.msg = "";
            resultMsg.err = null;
          }
          resolve({
            result: true,
            resultMsg: resultMsg
          });
        });
      }
    } catch (expetion) {
      log.debug('simulation.applyShareUserRevokeInArrModule 완료.');
      log.debug(expetion, paramData);
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      resultMsg.err = expetion;
      resolve({
        result: false,
        resultMsg: resultMsg
      });
    }
  });
}
/*
 * 결과화면( 그룹비교 또는 선택 비교 ) 에서 공유할 공유자를 조회한다.
 * 2019-11-13  bkLove(촤병국)
 */
var getUserListForShareInResultGroup = function(req, res) {
  try {
    log.debug('simulation.getUserListForShareInResultGroup 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getUserListForShareInResultGroup  req.body.data no data.", req.body.data);
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
    resultMsg.arr_user_list_for_share = [];
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      async.waterfall([
        /* 1. 공유할 모든 대상자를 조회한다. */
        function(callback) {
          try {
            var msg = {};
            stmt = mapper.getStatement('simulation', 'getAllUserListForShare', paramData, format);
            log.debug(stmt);
            conn.query(stmt, function(err, rows) {
              if(err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                return callback(resultMsg);
              }
              if(!rows || rows.length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "대상자가 존재하지 않습니다.";
                resultMsg.err = "대상자가 존재하지 않습니다.";
                return callback(resultMsg);
              }
              if(rows && rows.length > 0) {
                resultMsg.arr_user_list_for_share = _.differenceWith(rows, paramData.arr_user_shared, function(a, b) {
                  return a.email == b.email
                });
              }
              callback(null);
            });
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
      ], function(err) {
        if(err) {
          log.debug(err, stmt, paramData);
        } else {
          resultMsg.result = true;
          resultMsg.msg = "";
          resultMsg.err = null;
        }
        res.json(resultMsg);
        res.end();
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_user_list_for_share = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 결과화면( 그룹비교 ) 에서 그룹에 공유된 공유자를 조회한다.
 * 2019-11-13  bkLove(촤병국)
 */
var getUserListSharedInGroup = function(req, res) {
  try {
    log.debug('simulation.getUserListSharedInGroup 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.getUserListSharedInGroup  req.body.data no data.", req.body.data);
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
    resultMsg.arr_user_list_shared = [];
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      async.waterfall([
        /* 1. 공유할 대상자를 조회한다. */
        function(callback) {
          try {
            var msg = {};
            msg.arr_all_user_list_for_share = [];
            stmt = mapper.getStatement('simulation', 'getAllUserListForShare', paramData, format);
            log.debug(stmt);
            conn.query(stmt, function(err, rows) {
              if(err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                return callback(resultMsg);
              }
              if(!rows || rows.length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "대상자가 존재하지 않습니다.";
                resultMsg.err = "대상자가 존재하지 않습니다.";
                return callback(resultMsg);
              }
              if(rows && rows.length > 0) {
                msg.arr_all_user_list_for_share = rows;
              }
              callback(null, msg);
            });
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
        /* 2. 상위 그룹 정보를 조회한다. */
        function(msg, callback) {
          try {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            if(typeof msg.arr_all_user_list_for_share == "undefined" || msg.arr_all_user_list_for_share.length == 0) {
              resultMsg.result = false;
              resultMsg.msg = "대상자가 존재하지 않습니다.";
              resultMsg.err = "대상자가 존재하지 않습니다.";
              callback(resultMsg);
            } else {
              msg.v_simul_upper_grp = {};
              paramData.upper_scen_cd = paramData.scen_cd;
              stmt = mapper.getStatement('simulation', 'getScenarioUpperGrp', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "그룹정보가 존재하지 않습니다.";
                  resultMsg.err = "그룹정보가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                if(rows && rows.length > 1) {
                  resultMsg.result = false;
                  resultMsg.msg = "그룹정보가 2건 이상 존재합니다.";
                  resultMsg.err = "그룹정보가 2건 이상 존재합니다.";
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  msg.v_simul_upper_grp = rows[0];
                }
                callback(null, msg);
              });
            }
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
        /* 3. 그룹에 공유된 대상자를 조회한다. */
        function(msg, callback) {
          try {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            msg.v_arr_shared_grp = [];
            /* 상위 그룹 체크 */
            if(typeof msg.v_simul_upper_grp == "undefined" || Object.keys(msg.v_simul_upper_grp).length == 0) {
              resultMsg.result = false;
              resultMsg.msg = "그룹정보가 존재하지 않습니다.";
              resultMsg.err = "그룹정보가 존재하지 않습니다.";
              callback(resultMsg);
            } else {
              paramData.changeGrpCdYn = "0";
              paramData.upper_grp_cd = paramData.grp_cd;
              paramData.upper_scen_cd = paramData.scen_cd;
              stmt = mapper.getStatement('simulation', 'getSimulShareUpperGrp', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "그룹에 공유된 정보는 1건 이상 존재해야 합니다.";
                  resultMsg.err = "그룹에 공유된 정보는 1건 이상 존재해야 합니다.";
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  rows.forEach(function(item, index, array) {
                    if(item.owner_yn == '0') {
                      var v_check_data = _.filter(msg.arr_all_user_list_for_share, {
                        'email': item.email
                      });
                      /* 그룹에 공유된 공유자만 보관 */
                      if(typeof v_check_data != "undefined" && v_check_data.length == 1) {
                        msg.v_arr_shared_grp.push({
                          "grp_cd": paramData.grp_cd,
                          "scen_cd": paramData.scen_cd,
                          "email": item.email,
                          "name": v_check_data[0].name,
                          "owner_yn": "0"
                        });
                      }
                    }
                  });
                }
                callback(null, msg);
              });
            }
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
        /* 4. 그룹에 속한 시나리오들을 조회한다. */
        function(msg, callback) {
          try {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            msg.v_arr_simul_in_grp = [];
            stmt = mapper.getStatement('simulation', 'getScenarioInGrp', paramData, format);
            log.debug(stmt);
            conn.query(stmt, function(err, rows) {
              if(err) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                return callback(resultMsg);
              }
              if(rows && rows.length > 0) {
                msg.v_arr_simul_in_grp = rows;
              }
              callback(null, msg);
            });
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
        /* 5. 그룹에 속한 시나리오들의 공유 정보를 조회한다. */
        function(msg, callback) {
          try {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            paramData.arr_data_list = [];
            /* 그룹에 속한 시나리오가 없는 경우 */
            if(typeof msg.v_arr_simul_in_grp == "undefined" || msg.v_arr_simul_in_grp.length == 0) {
              resultMsg.result = false;
              resultMsg.msg = "그룹 내 시나리오는 1건 이상 존재해야 합니다.";
              resultMsg.err = "그룹 내 시나리오는 1건 이상 존재해야 합니다.";
              callback(resultMsg);
            } else {
              paramData.arr_data_list = msg.v_arr_simul_in_grp;
              stmt = mapper.getStatement('simulation', 'getSimulShareInArr', paramData, format);
              log.debug(stmt);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  if(typeof msg.v_arr_shared_grp != "undefined" && msg.v_arr_shared_grp.length > 0) {
                    /* [그룹 공유자] 와 [그룹 내 공유자] 가 동일한 경우에만 선택된 공유자에 설정 */
                    msg.v_arr_shared_grp.forEach(function(item, index, array) {
                      var v_check_data = _.filter(rows, {
                        'email': item.email
                      });
                      if(typeof v_check_data != "undefined" && v_check_data.length > 0) {
                        if(msg.v_arr_simul_in_grp.length == v_check_data.length) {
                          resultMsg.arr_user_list_shared.push(item);
                        }
                      }
                    });
                  }
                  if(resultMsg.arr_user_list_shared.length > 0) {
                    resultMsg.arr_user_list_shared = _.orderBy(resultMsg.arr_user_list_shared, ["name"], ["asc"]);
                  }
                }
                paramData.arr_data_list = [];
                callback(null);
              });
            }
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            callback(resultMsg);
          }
        },
      ], function(err) {
        if(err) {
          log.debug(err, stmt, paramData);
        } else {
          resultMsg.result = true;
          resultMsg.msg = "";
          resultMsg.err = null;
        }
        res.json(resultMsg);
        res.end();
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_user_list_shared = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 결과화면( 그룹비교 또는 선택 비교 )에서 공유 대상자를 적용한다.
 * 2019-11-13  bkLove(촤병국)
 */
var applyShareUserInResultGroup = function(req, res) {
  try {
    log.debug('simulation.applyShareUserInResultGroup 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.applyShareUserInResultGroup  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    resultMsg.share_count = 0;
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. 그룹하위 또는 선택된 시나리오가 존재하는지 조회한다. */
          function(callback) {
            try {
              var msg = {};
              var v_queryId = "";
              msg.v_arr_simul_mast = [];
              /* 선택비교 */
              if(paramData.method_gubun == "getInfoCheckedScenCd") {
                v_queryId = "getSimulMastInArr";
              }
              /* 그룹비교 */
              else if(paramData.method_gubun == "getScenInGrpCd") {
                paramData.upper_scen_cd = paramData.scen_cd;
                v_queryId = "getScenarioInGrp";
              }
              if(v_queryId == "") {
                resultMsg.result = false;
                resultMsg.msg = "시나리오 기본 정보가 존재하지 않습니다.";
                resultMsg.err = "시나리오 기본 정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                stmt = mapper.getStatement('simulation', v_queryId, paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "시나리오 정보가 한건 이상 존재해야 합니다.";
                    resultMsg.err = "시나리오 정보가 한건 이상 존재해야 합니다.";
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    msg.v_arr_simul_mast = rows;
                  }
                  if(typeof paramData.upper_scen_cd != "undefined") {
                    paramData.upper_scen_cd = "";
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 그룹하위 또는 선택된 시나리오의 공유정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_insert_list = [];
              msg.arr_update_list = [];
              if(typeof msg.v_arr_simul_mast == "undefined" || msg.v_arr_simul_mast.length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "시나리오 정보가 한건 이상 존재해야 합니다.";
                resultMsg.err = "시나리오 정보가 한건 이상 존재해야 합니다.";
                callback(resultMsg);
              } else {
                var v_queryId = "";
                /* 선택비교 */
                if(paramData.method_gubun == "getInfoCheckedScenCd") {
                  paramData.arr_data_list = paramData.arr_scen_in_grp;
                  v_queryId = "getSimulShareInArr";
                }
                /* 그룹비교 */
                else if(paramData.method_gubun == "getScenInGrpCd") {
                  paramData.upper_scen_cd = paramData.scen_cd;
                  v_queryId = "getSimulShareInGrp";
                }
                stmt = mapper.getStatement('simulation', v_queryId, paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "시나리오 공유 정보가 한건 이상 존재해야 합니다.";
                    resultMsg.err = "시나리오 공유 정보가 한건 이상 존재해야 합니다.";
                    return callback(resultMsg);
                  }
                  for(var j = 0; j < paramData.arr_scen_in_grp.length; j++) {
                    var v_row = paramData.arr_scen_in_grp[j];
                    /* 결과에 노출된 시나오 기준으로 소유자 또는 본인 email 이 공유 테이블에 존재하는지 체크  */
                    var v_temp = _.filter(rows, function(o) {
                      return (o.owner_yn == "1" && o.grp_cd == v_row.grp_cd && o.scen_cd == v_row.scen_cd) || (o.email == paramData.email && o.grp_cd == v_row.grp_cd && o.scen_cd == v_row.scen_cd);
                    });
                    if(typeof v_temp == "undefined" || v_temp.length == 0) {
                      resultMsg.result = false;
                      resultMsg.msg = "현재 사용자가 공유자 정보에 존재하지 않습니다.";
                      resultMsg.err = "현재 사용자가 공유자 정보에 존재하지 않습니다.";
                      return callback(resultMsg);
                    }
                  }
                  /* 공유할 email 이 없으면 insert, 존재하면 update */
                  for(var i = 0; i < paramData.arr_checked_for_share.length; i++) {
                    var v_check_row = paramData.arr_checked_for_share[i];
                    for(var j = 0; j < msg.v_arr_simul_mast.length; j++) {
                      var v_row = msg.v_arr_simul_mast[j];
                      var v_temp = _.filter(rows, function(o) {
                        return (o.email == v_check_row.email && o.grp_cd == v_row.grp_cd && o.scen_cd == v_row.scen_cd);
                      });
                      if(typeof v_temp != "undefined" && v_temp.length > 1) {
                        resultMsg.result = false;
                        resultMsg.msg = "공유자 정보에 2건 이상 존재합니다.";
                        resultMsg.err = "공유자 정보에 2건 이상 존재합니다.";
                        return callback(resultMsg);
                      }
                      if(typeof v_temp == "undefined" || v_temp.length == 0) {
                        msg.arr_insert_list.push({
                          "grp_cd": v_row.grp_cd,
                          "scen_cd": v_row.scen_cd,
                          "email": v_check_row.email,
                          "owner_yn": "0"
                        });
                      } else {
                        msg.arr_update_list.push({
                          "grp_cd": v_row.grp_cd,
                          "scen_cd": v_row.scen_cd,
                          "email": v_check_row.email
                        });
                      }
                    }
                  }
                  if(typeof paramData.upper_scen_cd != "undefined") {
                    paramData.upper_scen_cd = "";
                  }
                  if(typeof paramData.arr_data_list != "undefined") {
                    paramData.arr_data_list = [];
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 그룹하위 또는 선택된 시나리오의 공유정보를 등록한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_insert_list == "undefined" || msg.arr_insert_list.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_insert_list = msg.arr_insert_list;
                stmt = mapper.getStatement('simulation', "saveShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.saveShareUserInArr ( 그룹하위 또는 선택된 사니리오 ) success");
                  }
                  msg.arr_insert_list = [];
                  paramData.arr_insert_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. 그룹하위 또는 선택된 시나리오의 공유정보를 수정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_update_list == "undefined" || msg.arr_update_list.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_update_list = msg.arr_update_list;
                stmt = mapper.getStatement('simulation', "modifyShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.modifyShareUserInArr ( 그룹하위 또는 선택된 사니리오 ) success");
                  }
                  msg.arr_update_list = [];
                  paramData.arr_update_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. 상위 그룹 또는 선택된 시나리오의 상위그룹이 존재하는지 체크한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_simul_mast_upper = [];
              var v_queryId = "";
              /* 선택비교 */
              if(paramData.method_gubun == "getInfoCheckedScenCd") {
                v_queryId = "getSimulMastUpperInArr";
              }
              /* 그룹비교 */
              else if(paramData.method_gubun == "getScenInGrpCd") {
                paramData.upper_scen_cd = paramData.scen_cd;
                v_queryId = "getScenarioUpperGrp";
              }
              if(v_queryId == "") {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulation', v_queryId, paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    msg.arr_simul_mast_upper = rows;
                  }
                  if(typeof paramData.upper_scen_cd != "undefined") {
                    paramData.upper_scen_cd = "";
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 6. 상위 그룹 또는 선택된 시나리오의 상위그룹의 공유정보가 존재하는지 체크한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_simul_share_upper = [];
              if(typeof msg.arr_simul_mast_upper == "undefined" || msg.arr_simul_mast_upper.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_data_list = msg.arr_simul_mast_upper;
                stmt = mapper.getStatement('simulation', "getSimulShareInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "선택된 시나리오 그룹 정보가 존재하지 않습니다.";
                    resultMsg.err = "선택된 시나리오 그룹 정보가 존재하지 않습니다.";
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    /* 공유할 email 이 없으면 insert, 존재하면 update */
                    for(var i = 0; i < paramData.arr_checked_for_share.length; i++) {
                      var v_check_row = paramData.arr_checked_for_share[i];
                      for(var j = 0; j < msg.arr_simul_mast_upper.length; j++) {
                        var v_row = msg.arr_simul_mast_upper[j];
                        var v_temp = _.filter(rows, function(o) {
                          return (o.email == v_check_row.email && o.grp_cd == v_row.grp_cd && o.scen_cd == v_row.scen_cd);
                        });
                        if(typeof v_temp != "undefined" && v_temp.length > 1) {
                          resultMsg.result = false;
                          resultMsg.msg = "공유자 정보에 그룹정보가 2건 이상 존재합니다.";
                          resultMsg.err = "공유자 정보에 그룹정보가 2건 이상 존재합니다.";
                          return callback(resultMsg);
                        }
                        if(typeof v_temp == "undefined" || v_temp.length == 0) {
                          msg.arr_insert_list.push({
                            "grp_cd": v_row.grp_cd,
                            "scen_cd": v_row.scen_cd,
                            "email": v_check_row.email,
                            "owner_yn": "0"
                          });
                        } else {
                          msg.arr_update_list.push({
                            "grp_cd": v_row.grp_cd,
                            "scen_cd": v_row.scen_cd,
                            "email": v_check_row.email
                          });
                        }
                      }
                    }
                    msg.arr_simul_share_upper = rows;
                  }
                  if(typeof paramData.arr_data_list != "undefined") {
                    paramData.arr_data_list = [];
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 7. 상위 그룹 또는 선택된 시나리오의 상위그룹의 공유정보를 등록한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_insert_list == "undefined" || msg.arr_insert_list.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_insert_list = msg.arr_insert_list;
                stmt = mapper.getStatement('simulation', "saveShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.saveShareUserInArr ( 상위 그룹 또는 선택된 시나리오의 상위그룹 ) success");
                  }
                  msg.arr_insert_list = [];
                  paramData.arr_insert_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 7. 상위 그룹 또는 선택된 시나리오의 상위그룹의 공유정보를 수정한다.  */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_update_list == "undefined" || msg.arr_update_list.length == 0) {
                callback(null);
              } else {
                paramData.arr_update_list = msg.arr_update_list;
                stmt = mapper.getStatement('simulation', "modifyShareUserInArr", paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows) {
                    log.debug("simulation.modifyShareUserInArr ( 상위 그룹 또는 선택된 시나리오의 상위그룹 ) success");
                  }
                  msg.arr_update_list = [];
                  paramData.arr_update_list = [];
                  callback(null);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 공유하였습니다.";
            resultMsg.err = null;
            conn.commit();
          }
          res.json(resultMsg);
          res.end();
        });
      });
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 결과화면( 그룹비교 )에서 공유 대상자를 해제한다.
 * 2019-11-13  bkLove(촤병국)
 */
var applyShareUserRevokeInGroup = function(req, res) {
  try {
    log.debug('simulation.applyShareUserRevokeInGroup 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulation.applyShareUserRevokeInGroup  req.body.data no data.", req.body.data);
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
    /*
     *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
     *   written by bkLove(최병국)   2019-06-25
     */
    util.fn_replaceSpecialChar(paramData);
    resultMsg.share_count = 0;
    var format = {
      language: 'sql',
      indent: ''
    };
    var stmt = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. 상위 그룹 정보를 조회한다. */
          function(callback) {
            try {
              var msg = {};
              msg.v_simul_upper_grp = {};
              paramData.upper_scen_cd = paramData.scen_cd;
              stmt = mapper.getStatement('simulation', 'getScenarioUpperGrp', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(!rows || rows.length == 0) {
                  resultMsg.result = false;
                  resultMsg.msg = "그룹정보가 존재하지 않습니다.";
                  resultMsg.err = "그룹정보가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                if(rows && rows.length > 1) {
                  resultMsg.result = false;
                  resultMsg.msg = "그룹정보가 2건 이상 존재합니다.";
                  resultMsg.err = "그룹정보가 2건 이상 존재합니다.";
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  msg.v_simul_upper_grp = rows[0];
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 그룹에 공유된 대상자를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_simul_share_upper = [];
              msg.arr_delete_list = [];
              /* 상위 그룹 체크 */
              if(typeof msg.v_simul_upper_grp == "undefined" || Object.keys(msg.v_simul_upper_grp).length == 0) {
                resultMsg.result = false;
                resultMsg.msg = "그룹정보가 존재하지 않습니다.";
                resultMsg.err = "그룹정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                paramData.changeGrpCdYn = "0";
                paramData.upper_grp_cd = paramData.grp_cd;
                paramData.upper_scen_cd = paramData.scen_cd;
                stmt = mapper.getStatement('simulation', 'getSimulShareUpperGrp', paramData, format);
                log.debug(stmt);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "그룹 공유 데이터는 1건 이상 존재해야 합니다.";
                    resultMsg.err = "그룹 공유 데이터는 1건 이상 존재해야 합니다.";
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    msg.arr_simul_share_upper = rows;
                    /* 해제할 공유자 정보 */
                    paramData.arr_checked_shared.forEach(function(item, index, array) {
                      var v_temp = _.filter(rows, function(o) {
                        return o.owner_yn == "0" && msg.v_simul_upper_grp.grp_cd == o.grp_cd && msg.v_simul_upper_grp.scen_cd == o.scen_cd && item.email == o.email;
                      });
                      if(typeof v_temp != "undefined" && v_temp.length > 0) {
                        msg.arr_delete_list.push({
                          "grp_cd": msg.v_simul_upper_grp.grp_cd,
                          "scen_cd": msg.v_simul_upper_grp.scen_cd,
                          "email": item.email
                        });
                      }
                    });
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. 상위 그룹 공유자를 해제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_delete_list == "undefined" || msg.arr_delete_list.length == 0) {
                callback(null, msg);
              } else {
                paramData.arr_delete_list = msg.arr_delete_list;
                stmt = mapper.getStatement('simulation', 'deleteShareUserInArr', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  msg.arr_delete_list = [];
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 4. 상위 그룹에 속한 공유자 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.arr_delete_list = [];
              paramData.upper_scen_cd = paramData.scen_cd;
              stmt = mapper.getStatement('simulation', 'getSimulShareInGrp', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  paramData.arr_checked_shared.forEach(function(item, index, array) {
                    /* 그룹 하위 공유자 */
                    var v_temp = _.filter(rows, function(o) {
                      return o.owner_yn == "0" && item.email == o.email;
                    });
                    if(typeof v_temp != "undefined" && v_temp.length > 0) {
                      v_temp.forEach(function(o) {
                        msg.arr_delete_list.push({
                          "grp_cd": o.grp_cd,
                          "scen_cd": o.scen_cd,
                          "email": item.email
                        });
                      });
                    }
                  });
                }
                if(typeof paramData.upper_scen_cd != "undefined") {
                  paramData.upper_scen_cd = "";
                }
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 5. 상위그룹에 속한 공유자를 해제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.arr_delete_list == "undefined" || msg.arr_delete_list.length == 0) {
                callback(null);
              } else {
                paramData.arr_delete_list = msg.arr_delete_list;
                stmt = mapper.getStatement('simulation', 'deleteShareUserInArr', paramData, format);
                log.debug(stmt, paramData);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  msg.arr_delete_list = [];
                  callback(null);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          }
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 해제하였습니다.";
            resultMsg.err = null;
            conn.commit();
          }
          res.json(resultMsg);
          res.end();
        });
      });
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    res.json(resultMsg);
    res.end();
  }
}
/*
 *   문자열 길이를 반환한다.
 *   2019-09-06  bkLove(촤병국)
 */
var fn_getByte = function(str) {
  var count = 0;
  for(var i = 0; i < str.length; i++) {
    if(escape(str.charAt(i)).length >= 4) count += 2;
    else
    if(escape(str.charAt(i)) != "%0D") count++;
  }
  return count;
}
/*
 *   시계열 샘플파일 다운로드를 수행한다.
 *   2019-09-06  bkLove(촤병국)
 */
var getTimeSeriesSampleFileDown = function(req, res) {
  log.debug('simulation.getTimeSeriesSampleFileDown 호출됨.');
  var paramData = {};
  try {
    paramData.user_id = (req.session.user_id ? req.session.user_id : "");
    paramData.inst_cd = (req.session.inst_cd ? req.session.inst_cd : "");
    paramData.type_cd = (req.session.type_cd ? req.session.type_cd : "");
    paramData.large_type = (req.session.large_type ? req.session.large_type : "");
    paramData.krx_cd = (req.session.krx_cd ? req.session.krx_cd : "");
    var savedFileNm = "timeseries_sample.xlsx";
    var file = config.sampleDownFolder + "/" + savedFileNm;
    log.debug("#### getTimeSeriesSampleFileDown START ###", file, "#### getTimeSeriesSampleFileDown SEND ###");
    res.download(file, savedFileNm, function(err) {
      log.error(paramData, err);
    });
  } catch (err) {
    log.error(paramData, err);
  }
};
/*
 *   리밸런싱 샘플파일 다운로드를 수행한다.
 *   2019-09-06  bkLove(촤병국)
 */
var getRebalancingSampleFileDown = function(req, res) {
  log.debug('simulation.getRebalancingSampleFileDown 호출됨.');
  var paramData = {};
  try {
    paramData.user_id = (req.session.user_id ? req.session.user_id : "");
    paramData.inst_cd = (req.session.inst_cd ? req.session.inst_cd : "");
    paramData.type_cd = (req.session.type_cd ? req.session.type_cd : "");
    paramData.large_type = (req.session.large_type ? req.session.large_type : "");
    paramData.krx_cd = (req.session.krx_cd ? req.session.krx_cd : "");
    var savedFileNm = "rebalancing_sample.xlsx";
    var file = config.sampleDownFolder + "/" + savedFileNm;
    log.debug("#### getRebalancingSampleFileDown START ###", file, "#### getRebalancingSampleFileDown SEND ###");
    res.download(file, savedFileNm, function(err) {
      log.error(paramData, err);
    });
  } catch (err) {
    log.error(paramData, err);
  }
};
/*
 *   포트폴리오 샘플파일 다운로드를 수행한다.
 *   2019-09-06  bkLove(촤병국)
 */
var getPortfolioSampleFileDown = function(req, res) {
  log.debug('simulation.getPortfolioSampleFileDown 호출됨.');
  var paramData = {};
  try {
    paramData.user_id = (req.session.user_id ? req.session.user_id : "");
    paramData.inst_cd = (req.session.inst_cd ? req.session.inst_cd : "");
    paramData.type_cd = (req.session.type_cd ? req.session.type_cd : "");
    paramData.large_type = (req.session.large_type ? req.session.large_type : "");
    paramData.krx_cd = (req.session.krx_cd ? req.session.krx_cd : "");
    var savedFileNm = "portfolio_sample.xlsx";
    var file = config.sampleDownFolder + "/" + savedFileNm;
    log.debug("#### getPortfolioSampleFileDown START ###", file, "#### getPortfolioSampleFileDown SEND ###");
    res.download(file, savedFileNm, function(err) {
      log.error(paramData, err);
    });
  } catch (err) {
    log.error(paramData, err);
  }
};
module.exports.getInitGrpCd = getInitGrpCd;
module.exports.getNextScenName = getNextScenName;
module.exports.getInitData = getInitData;
module.exports.getJongmokInfo = getJongmokInfo;
module.exports.modifyGroup = modifyGroup;
module.exports.getSimulMast = getSimulMast;
module.exports.getInitData1 = getInitData1;
module.exports.getRebalanceDate = getRebalanceDate;
module.exports.getSimulList = getSimulList;
module.exports.getSimulPortfolio = getSimulPortfolio;
module.exports.runBacktestWithSaveBasicInfo = runBacktestWithSaveBasicInfo;
module.exports.deleteAllSimul = deleteAllSimul;
module.exports.renameScenario = renameScenario;
module.exports.copyScenario = copyScenario;
module.exports.fnChangeGroup = fnChangeGroup;
module.exports.changeGroupModle = changeGroupModle;
module.exports.arrChangeGroupModle = arrChangeGroupModle;
module.exports.getScenarioShareCount = getScenarioShareCount;
module.exports.getUserListForShare = getUserListForShare;
module.exports.getUserListShared = getUserListShared;
module.exports.applyShareUserInArr = applyShareUserInArr;
module.exports.applyShareUserRevokeInArr = applyShareUserRevokeInArr;
module.exports.applyShareUserInResultGroup = applyShareUserInResultGroup;
module.exports.getUserListForShareInResultGroup = getUserListForShareInResultGroup;
module.exports.getUserListSharedInGroup = getUserListSharedInGroup;
module.exports.applyShareUserRevokeInGroup = applyShareUserRevokeInGroup;
module.exports.getTimeSeriesSampleFileDown = getTimeSeriesSampleFileDown;
module.exports.getRebalancingSampleFileDown = getRebalancingSampleFileDown;
module.exports.getPortfolioSampleFileDown = getPortfolioSampleFileDown;