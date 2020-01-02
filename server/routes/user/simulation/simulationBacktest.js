/*
 *  시뮬레이션 관련 정보
 *
 *  @date 2019-07-26
 *  @author bkLove
 *  수정일 2018-09-06  daeguk  
 *  -수정내용: 리밸런싱일별로 포트 폴리오 입력시 처리 과정 추가 및 오류 수정
 */
var config = require('../../../config/config');
var util = require('../../../util/util');
var util1 = require('util');
var Promise = require("bluebird");
// var multer = require('multer');
// var xlsx = require('xlsx');
var async = require('async');
var _ = require("lodash");
var simulModule = require('./simulModule');
var simulAnalyze = require('./analyzeTimeserise');
var log = require('../../../util/logg');
var limit = {
  divide_size: 100,
  result_dive_size: 5
};

/*
 * 백테스트를 수행한다.
 * 2019-05-20  bkLove(촤병국)
 */
var runBacktest = async function(req, res, paramData) {
  return await new Promise(function(resolve, reject) {
    try {
      log.debug('simulationBacktest.runBacktest 호출됨.');
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
        var resultMsg = {};
        var format = {
          language: 'sql',
          indent: ''
        };
        var stmt = "";
        var v_resultSimulData = {};
        resultMsg.arr_daily = [];
        resultMsg.arr_rebalance = [];
        resultMsg.simul_mast = {};
        resultMsg.jsonFileName = "";
        resultMsg.inputData = [];
        async.waterfall([
          /* 1 저장시 입력했던 정보로 백테스트 기본정보를 조회한다. */
          function(callback) {
            try {
              var msg = {};
              stmt = mapper.getStatement('simulationBacktest', 'getSimulListByBacktest', paramData, format);
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
                  resultMsg.msg = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";
                  resultMsg.err = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";
                  return callback(resultMsg);
                }
                var v_simul_mast = {};
                var v_simulPortfolio = rows;
                if(typeof paramData.prev_grp_cd != "undefined" && paramData.prev_grp_cd != "") {
                  v_simul_mast.prev_grp_cd = paramData.prev_grp_cd; /* 이전 그룹코드(상위코드) */
                }
                if(typeof paramData.prev_scen_cd != "undefined" && paramData.prev_scen_cd != "") {
                  v_simul_mast.prev_scen_cd = paramData.prev_scen_cd; /* 이전 그룹코드(상위코드) */
                }
                for(var i in rows) {
                  //v_simulPortfolio[ rows[i].F16013 ]      =   rows[i];
                  /* 마스터 정보 설정 */
                  if(i == 0) {
                    v_simul_mast.grp_cd = rows[0].grp_cd; /* 그룹코드(상위코드) */
                    v_simul_mast.scen_cd = rows[0].scen_cd; /* 시나리오 코드 */
                    v_simul_mast.scen_name = rows[0].scen_name /* 시나리오명 */
                    v_simul_mast.start_year = rows[0].start_year; /* 시작년도 */
                    v_simul_mast.rebalance_cycle_cd = rows[0].rebalance_cycle_cd; /* 리밸런싱주기 (COM006) */
                    v_simul_mast.rebalance_date_cd = rows[0].rebalance_date_cd; /* 리밸런싱일자 (COM007) */
                    v_simul_mast.init_invest_money = rows[0].init_invest_money; /* 초기투자금액 */
                    v_simul_mast.bench_mark_cd = rows[0].bench_mark_cd; /* 벤치마크 (COM008) */
                    v_simul_mast.bench_index_cd01 = rows[0].bench_index_cd01; /* 벤치마크 인덱스 코드 ( F16013 ) */
                    v_simul_mast.bench_index_cd02 = rows[0].bench_index_cd02; /* 벤치마크 인덱스 코드 ( large_type ) */
                    v_simul_mast.bench_index_cd03 = rows[0].bench_index_cd03; /* 벤치마크 인덱스 코드 ( middle_type ) */
                    v_simul_mast.bench_index_nm = rows[0].bench_index_nm; /* 벤치마크 인덱스 코드명 */
                    v_simul_mast.importance_method_cd = rows[0].importance_method_cd; /* 비중설정방식 (COM009) */
                    v_simul_mast.serial_no = rows[0].serial_no /* 변경 순번 */
                  }
                }
                msg.v_simul_mast = v_simul_mast;
                msg.v_simulPortfolio = v_simulPortfolio;
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 2. 저장시 입력했던 정보로 리밸런싱 일자를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'getRebalanceDateByScenCd', paramData, format);
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
                  resultMsg.msg = "[백테스트] 리밸런싱 일자 정보가 존재하지 않습니다.";
                  resultMsg.err = "[백테스트] 리밸런싱 일자 정보가 존재하지 않습니다.";
                  return callback(resultMsg);
                } else {
                  /*=================================== 
                  * 1. 포트 폴리오를 리밸런싱일별로 Array화 한다,
                      2. 이력 데이터를 조회할 파라메터 생성
                  ======================================*/
                  var v_simulPortfolioList = [];
                  var firstRebalenceDate = "";
                  rows.forEach(function(item, index) {
                    if(index == 0) firstRebalenceDate = item.F12506;
                    var simulPortfolio = _.filter(msg.v_simulPortfolio, {
                      'rebalance_date': item.F12506
                    });
                    var simulPortfolioObj = [];
                    simulPortfolio.forEach(function(portfolio) {
                      simulPortfolioObj[portfolio.F16013] = portfolio;
                    });
                    v_simulPortfolioList[item.F12506] = simulPortfolioObj;
                  });
                }
                /* 엑셀 업로드시 시뮬레이션 시작일을 첫 리밸런싱일로 세팅 */
                if(msg.v_simul_mast.rebalance_date_cd == "" && msg.v_simul_mast.rebalance_cycle_cd == "") {
                  paramData.first_date = firstRebalenceDate;
                } else {
                  paramData.first_date = msg.v_simul_mast.start_year + "0101";
                }
                msg.v_arrRebalanceDate = rows;
                msg.v_simulPortfolioList = v_simulPortfolioList;
                msg.v_simulPortfolio = v_simulPortfolioList[firstRebalenceDate]; //  첫 리밸런싱 까지 포트 폴리오로 사용
                msg.firstRebalenceDate = firstRebalenceDate; //  첫리밸런싱 일자
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(resultMsg);
            }
          },
          /* 3. (백테스트) 백테스트 실행시 이력정보를 조회한다. */
          function(msg, callback) {
            var temp_kspjong_hist = [];
            var kspjong_hist = [];
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'getSimulHistListByScenCd', paramData, format);
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
                  resultMsg.msg = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";
                  resultMsg.err = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";
                  return callback(resultMsg);
                } else {
                  //paramData.first_date = rows[0].F12506;
                  temp_kspjong_hist = rows;
                  kspjong_hist = fn_history_filter(temp_kspjong_hist /*DB에서 조회된 종목별 히스토리*/ , msg.v_simulPortfolio /* 시작일 포트롤리오 */ , msg.v_simulPortfolioList /* 리밸런싱일별 포트 폴리오*/ , msg.v_arrRebalanceDate /* 리밸런싱 일자 정보 */ );
                }
                /*************************************************************************************************************
                 *   시뮬레이션 이력정보로 백테스트 수행
                 **************************************************************************************************************/
                v_resultSimulData = fn_get_simulation_data(msg.v_simul_mast /* 시뮬레이션 기본 마스터 정보 */ , kspjong_hist /* 일자별 종목 이력 데이터 */ , msg.v_arrRebalanceDate /* 리밸런싱 일자 정보 */ , msg.v_simulPortfolio /* [tm_simul_portfolio] 기준 종목 데이터 */ , msg.v_simulPortfolioList /*리밸런싱 날짜별 포트 폴리오*/ );
                resultMsg.simul_mast = msg.v_simul_mast;
                delete msg.v_arrRebalanceDate;
                delete msg.v_simulPortfolio;
                delete msg.v_simulPortfolioList;
                callback(null, msg);
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              resultMsg.dailyJongmokObj = {};
              resultMsg.dailyObj = {};
              callback(resultMsg);
            }
          },
          /* 4. td_kspjong_hist 테이블 기준 td_index_hist 테이블에서 bench_mark 와 일치하는 정보를 조회한다.*/
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(msg.v_simul_mast && Object.keys(msg.v_simul_mast).length > 0) {
                if(msg.v_simul_mast.bench_index_cd01) {
                  paramData.bench_index_cd01 = msg.v_simul_mast.bench_index_cd01;
                }
                if(msg.v_simul_mast.bench_index_cd02) {
                  paramData.bench_index_cd02 = msg.v_simul_mast.bench_index_cd02;
                }
                if(msg.v_simul_mast.bench_index_cd03) {
                  paramData.bench_index_cd03 = msg.v_simul_mast.bench_index_cd03;
                }
              }
              if(paramData.bench_index_cd01 == "" || paramData.bench_index_cd02 == "" || paramData.bench_index_cd03 == "") {
                callback(null);
              } else {
                stmt = mapper.getStatement('simulationBacktest', 'getSimulBenchMark', paramData, format);
                log.debug(stmt);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    /* 일자별 지수에 밴치마크 정보를 설정한다. */
                    fn_set_bench_mark(v_resultSimulData.arr_daily, rows);
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
            resolve({
              result: false,
              resultMsg: resultMsg
            });
          } else {
            resultMsg.result = true;
            /* 일자별 지수에 balance 정보를 설정한다. */
            fn_set_balance(v_resultSimulData.arr_daily, resultMsg.simul_mast);
            resultMsg.arr_daily = [...v_resultSimulData.arr_daily];
            resultMsg.arr_rebalance = [...v_resultSimulData.arr_rebalance];
            if(paramData.moduleId && ["getSimulJongmoForExcel"].includes(paramData.moduleId)) {
              resultMsg.dailyJongmokObj = v_resultSimulData.dailyJongmokObj;
            }
            if(paramData.moduleId && ["runBacktestWithSaveBasicInfo"].includes(paramData.moduleId)) {
              //                          resultMsg.dailyObj          =   v_resultSimulData.dailyObj;
              resultMsg.arr_contribute = v_resultSimulData.arr_contribute;
            }
            resultMsg.err = null;
            resolve({
              result: true,
              resultMsg: resultMsg
            });
          }
        });
      }
    } catch (expetion) {
      log.debug(expetion, paramData);
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      resultMsg.err = expetion;
      resultMsg.arr_daily = [];
      resultMsg.arr_rebalance = [];
      resultMsg.simul_mast = {};
      resultMsg.jsonFileName = "";
      resultMsg.inputData = [];
      resolve({
        result: false,
        resultMsg: resultMsg
      });
    }
  }).catch(function(expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_daily = [];
    resultMsg.arr_rebalance = [];
    resultMsg.simul_mast = {};
    resultMsg.jsonFileName = "";
    resultMsg.inputData = [];
  });
}
/*
 * daily 정보를 조회하여 파이선 호출 후 분석테이블에 저장한다.
 * 2019-10-24  bkLove(촤병국)
 */
var getAnalyze_timeseries = function(req, res) {
  try {
    log.debug('simulationBacktest.getAnalyze_timeseries 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulationBacktest.getAnalyze_timeseries  req.body.data no data.", req.body.data);
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
    resultMsg.owner_all_yn = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. 시뮬레이션 마스터 정보를 조회한다. */
          function(callback) {
            try {
              var msg = {};
              msg.v_simul_mast = {};
              if(!paramData || !paramData.grp_cd || !paramData.scen_cd) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = "기본정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
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
                  /* 삭제된 경우 */
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "시나리오가 삭제 되었습니다.";
                    resultMsg.err = "시나리오가 삭제 되었습니다.";
                    return callback(resultMsg);
                  }
                  if(rows && rows.length == 1) {
                    msg.v_simul_mast = rows[0];
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              if(!resultMsg.err) {
                resultMsg.err = err;
              }
              return callback(resultMsg);
            }
          },
          /* 2. tm_simul_result_daily 데이터를 조회한다.*/
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              msg.v_arr_result_daily = [];
              if(typeof msg.v_simul_mast == "undefined" || Object.keys(msg.v_simul_mast).length == 0) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = "기본정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                resultMsg.owner_all_yn = msg.v_simul_mast.owner_yn;
                stmt = mapper.getStatement('simulationBacktest', 'getSimulResultDaily', paramData, format);
                log.debug(stmt);
                conn.query(stmt, function(err, rows) {
                  if(err) {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = err;
                    return callback(resultMsg);
                  }
                  if(rows && rows.length > 0) {
                    msg.v_arr_result_daily = rows;
                    paramData.first_date = rows[0].F12506;
                    /* 일자별 지수에 balance 정보를 설정한다. */
                    fn_set_balance(msg.v_arr_result_daily, msg.v_simul_mast);
                  }
                  callback(null, msg);
                });
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              if(!resultMsg.err) {
                resultMsg.err = err;
              }
              return callback(resultMsg);
            }
          },
          /* 3. tm_simul_result_daily 테이블 기준 td_index_hist 테이블에서 bench_mark 와 일치하는 정보를 조회한다.*/
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.v_arr_result_daily == "undefined" || msg.v_arr_result_daily.length == 0) {
                callback(null, msg);
              } else {
                paramData.bench_mark_cd = msg.v_simul_mast.bench_mark_cd;
                paramData.bench_index_cd01 = msg.v_simul_mast.bench_index_cd01;
                paramData.bench_index_cd02 = msg.v_simul_mast.bench_index_cd02;
                paramData.bench_index_cd03 = msg.v_simul_mast.bench_index_cd03;
                if(paramData.bench_mark_cd == "" || paramData.bench_index_cd01 == "" || paramData.bench_index_cd02 == "" || paramData.bench_index_cd03 == "") {
                  callback(null, msg);
                } else {
                  stmt = mapper.getStatement('simulationBacktest', 'getSimulBenchMark', paramData, format);
                  log.debug(stmt);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(rows && rows.length > 0) {
                      /* 일자별 지수에 밴치마크 정보를 설정한다. */
                      fn_set_bench_mark(msg.v_arr_result_daily, rows);
                    }
                    callback(null, msg);
                  });
                }
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              if(!resultMsg.err) {
                resultMsg.err = err;
              }
              return callback(resultMsg);
            }
          },
          /* 4. input data를 파일생성 후 파이선을 호출한다.*/
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              resultMsg.jsonFileName = "";
              resultMsg.inputData = "";
              msg.arr_analyze_db = [];
              if(typeof msg.v_arr_result_daily == "undefined" || msg.v_arr_result_daily.length == 0) {
                callback(null, msg);
              } else {
                log.debug("분석정보 #1 조회 from 파이선 START");
                simulAnalyze.getAnalyze_timeseries(msg.v_arr_result_daily, paramData.bench_mark_cd).then(function(e) {
                  if(e && e.result) {
                    if(e.results && e.results.length > 0) {
                      resultMsg.jsonFileName = e.jsonFileName;
                      resultMsg.inputData = e.inputData;
                      var v_arr_analyze_org = e.results;
                      try {
                        if(v_arr_analyze_org && v_arr_analyze_org.length > 0) {
                          log.debug("파이선 호출결과 파일명 ==>", resultMsg.jsonFileName);
                          log.debug("파이선 호출결과 원본 ==>", v_arr_analyze_org);
                          var v_arr_analyze_json = JSON.parse(v_arr_analyze_org);
                          var v_anal_return = fn_setAnal01(v_arr_analyze_json);
                          resultMsg.arr_analyze = v_anal_return.arr_analyze;
                          resultMsg.arr_analyze_main = v_anal_return.arr_analyze_main;
                          msg.arr_analyze_db = v_anal_return.arr_analyze_db;
                          callback(null, msg);
                        }
                      } catch (e) {
                        log.error(e);
                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = "파싱 중 오류가 발생되었습니다.";
                        resultMsg.arr_analyze = [];
                        resultMsg.arr_analyze_main = [];
                        msg.arr_analyze_db = [];
                        callback(null, msg);
                      }
                    }
                  } else {
                    if(e) {
                      resultMsg.jsonFileName = e.jsonFileName;
                      resultMsg.inputData = e.inputData;
                    }
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = "[error] simulAnalyze.getAnalyze_timeseries 파이선 호출중 오류가 발생되었습니다.";
                    resultMsg.arr_analyze = [];
                    resultMsg.arr_analyze_main = [];
                    msg.arr_analyze_db = [];
                    callback(null, msg);
                  }
                });
                log.debug("분석정보 #1 조회 from 파이선 END");
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              resultMsg.err = err;
              callback(null, msg);
            }
          },
          /* 5. 분석정보를 저장한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              paramData.transaction = {};
              paramData.transaction.mapper = mapper;
              paramData.transaction.pool = pool;
              paramData.transaction.conn = conn;
              paramData.arr_analyze_db = msg.arr_analyze_db;
              /* 분석정보를 저장한다. */
              fnSaveTmSimulResultAnal.call(this, req, res, paramData).then(function(e) {
                if(e && e.resultMsg && e.resultMsg.result) {
                  callback(null);
                } else {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = config.MSG.error01;
                  callback(resultMsg);
                }
              });
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              if(!resultMsg.err) {
                resultMsg.err = err;
              }
              return callback(resultMsg);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
            conn.rollback();
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 조회하였습니다.";
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
    resultMsg.owner_all_yn = "";
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 분석정보를 저장한다.
 * 2019-05-20  bkLove(촤병국)
 */
var fnSaveTmSimulResultAnal = async function(req, res, paramData) {
  return await new Promise(function(resolve, reject) {
    try {
      log.debug('simulationBacktest.fnSaveTmSimulResultAnal 호출됨.');
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
        var resultMsg = {};
        var format = {
          language: 'sql',
          indent: ''
        };
        var stmt = "";
        async.waterfall([
          /* 1. (백테스트) tm_simul_result_anal 분석정보를 삭제한다. */
          function(callback) {
            try {
              var msg = {};
              if(typeof paramData.changeGrpCdYn == "undefined") {
                paramData.changeGrpCdYn = "0";
              }
              /* 기존에 등록된 prev_scen_cd 가 없는 경우 ( 신규 건 ) */
              if(typeof paramData.prev_scen_cd != "undefined" && typeof paramData.prev_grp_cd != "undefined" && paramData.prev_scen_cd != "" && paramData.prev_grp_cd != "" && paramData.prev_grp_cd != paramData.grp_cd) {
                paramData.changeGrpCdYn = "1";
              }
              if(!paramData.grp_cd || !paramData.scen_cd) {
                callback(null, msg);
              } else {
                stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResultAnal', paramData, format);
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
              }
            } catch (err) {
              resultMsg.result = false;
              resultMsg.msg = config.MSG.error01;
              if(!resultMsg.err) {
                resultMsg.err = err;
              }
              return callback(resultMsg);
            }
          },
          /* 2. (백테스트) tm_simul_result_anal 분석정보를 저장한다. */
          function(msg, callback) {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            if(typeof paramData.arr_analyze_db == "undefined" || paramData.arr_analyze_db.length == 0) {
              callback(null);
            } else {
              var divideList = [];
              async.forEachOfLimit(paramData.arr_analyze_db, 1, function(subList, i, innerCallback) {
                async.waterfall([
                  function(innerCallback) {
                    subList.show_order_no = i;
                    divideList.push(subList);
                    innerCallback(null, paramData);
                  },
                  function(sub_msg, innerCallback) {
                    var divide_size = (limit && limit.result_dive_size ? limit.result_dive_size : 1);
                    if(divideList && (divideList.length == divide_size || i == paramData.arr_analyze_db.length - 1)) {
                      try {
                        paramData.dataLists = divideList;
                        stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultAnal', paramData, format);
                        conn.query(stmt, function(err, rows) {
                          if(err) {
                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;
                            return callback(resultMsg);
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
                        return callback(resultMsg);
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
                    return callback(resultMsg);
                  }
                  innerCallback(null);
                });
              }, function(err) {
                if(err) {
                  return callback(resultMsg);
                }
                log.debug("simulationBacktest.saveTmSimulResultAnal");
                paramData.arr_analyze_db = [];
                callback(null);
              });
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
            resolve({
              result: true,
              resultMsg: resultMsg
            });
          }
        });
      }
    } catch (expetion) {
      log.debug(expetion, paramData);
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      resultMsg.err = expetion;
      resolve({
        result: false,
        resultMsg: resultMsg
      });
    }
  }).catch(function(expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
  });
}
/*************************************************************************************************************
 *   백테스트 결과 저장
 **************************************************************************************************************/
/*
 * 백테스트 결과를 저장한다.
 * 2019-08-14  bkLove(촤병국)
 */
var saveBacktestResult = async function(req, res, paramData) {
  return await new Promise(function(resolve, reject) {
    try {
      log.debug('simulationBacktest.saveBacktestResult 호출됨.');
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
        var v_resultSimulData = {
          arr_daily: [],
          arr_rebalance: {},
          dailyJongmokObj: {},
          dailyObj: {}
        };
        async.waterfall([
          /* 1. 백테스트를 수행한다. */
          function(callback) {
            try {
              if(!paramData.grp_cd || !paramData.scen_cd) {
                resultMsg.result = false;
                resultMsg.msg = "[백테스트] 기본 인자값 정보가 존재하지 않습니다.";
                resultMsg.err = "[백테스트] 기본 인자값 정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                var msg = {};
                // paramData.moduleId      =   "saveBacktestResult2";
                if(paramData.time_series_upload_yn != "undefined" && paramData.time_series_upload_yn == "1") {
                  callback(null, msg);
                } else {
                  /* 백테스트를 수행한다. */
                  runBacktest.call(this, req, res, paramData).then(function(e) {
                    if(e && e.resultMsg && e.resultMsg.result) {
                      resultMsg = e.resultMsg;
                      // resultMsg.result        =   e.resultMsg.result;
                      // resultMsg.msg           =   e.resultMsg.msg;
                      // resultMsg.simul_mast    =   e.resultMsg.simul_mast;
                      v_resultSimulData.arr_daily = [];
                      if(e.resultMsg.arr_daily && e.resultMsg.arr_daily.length > 0) {
                        v_resultSimulData.arr_daily = [...e.resultMsg.arr_daily];
                      }
                      v_resultSimulData.arr_rebalance = {};
                      if(e.resultMsg.arr_rebalance && Object.keys(e.resultMsg.arr_rebalance).length > 0) {
                        v_resultSimulData.arr_rebalance = e.resultMsg.arr_rebalance;
                      }
                      v_resultSimulData.dailyJongmokObj = {};
                      if(e.resultMsg.dailyJongmokObj && Object.keys(e.resultMsg.dailyJongmokObj).length > 0) {
                        v_resultSimulData.dailyJongmokObj = e.resultMsg.dailyJongmokObj;
                      }
                      v_resultSimulData.dailyObj = {};
                      if(e.resultMsg.dailyObj && Object.keys(e.resultMsg.dailyObj).length > 0) {
                        v_resultSimulData.dailyObj = e.resultMsg.dailyObj;
                      }
                      v_resultSimulData.arr_contribute = {};
                      if(e.resultMsg.arr_contribute && Object.keys(e.resultMsg.arr_contribute).length > 0) {
                        v_resultSimulData.arr_contribute = e.resultMsg.arr_contribute;
                      }
                      if(resultMsg.simul_mast && resultMsg.simul_mast.serial_no != null) {
                        paramData.serial_no = resultMsg.simul_mast.serial_no;
                      }
                      callback(null, msg);
                    } else {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = config.MSG.error01;
                      callback(resultMsg);
                    }
                  }).catch(function(expetion) {
                    log.debug(expetion, paramData);
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = expetion;
                    callback(resultMsg);
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
          /* 2. 입력할 값을 기준으로 tm_simul_result_mast 와 비교하여 insert, modify 대상 추출 */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof paramData.changeGrpCdYn == "undefined" || paramData.changeGrpCdYn == null) {
                paramData.changeGrpCdYn = "0";
              }
              /* 기존에 등록된 prev_scen_cd 가 없는 경우 ( 신규 건 ) */
              if(typeof paramData.prev_scen_cd != "undefined" && typeof paramData.prev_grp_cd != "undefined" && paramData.prev_scen_cd != "" && paramData.prev_grp_cd != "" && paramData.prev_grp_cd != paramData.grp_cd) {
                paramData.changeGrpCdYn = "1";
              }
              stmt = mapper.getStatement('simulationBacktest', 'getTmSimulResultMastCheck', paramData, {
                language: 'sql',
                indent: '  '
              });
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length == 1) {
                  msg.simul_result_mast_status = rows[0].dtl_status
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
          /* 3. [tm_simul_result_mast] 테이블에 등록 또는 수정한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(msg.simul_result_mast_status && paramData.serial_no != null) {
                var queryId = "";
                if(msg.simul_result_mast_status == "insert") {
                  queryId = "saveTmSimulResultMast";
                } else if(msg.simul_result_mast_status == "modify") {
                  queryId = "modifyTmSimulResultMast";
                }
                stmt = mapper.getStatement('simulationBacktest', queryId, paramData, {
                  language: 'sql',
                  indent: '  '
                });
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
          //                     /* 4. (백테스트) tm_simul_result 결과를 삭제한다. */
          //                     function(msg, callback) {
          //                         try {
          //                             if( !msg || Object.keys( msg ).length == 0 ) {
          //                                 msg = {};
          //                             }                            
          //                             stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResult', paramData, format);
          //                             log.debug(stmt);
          //                             conn.query(stmt, function(err, rows) {
          //                                 if (err) {
          //                                     resultMsg.result = false;
          //                                     resultMsg.msg = config.MSG.error01;
          //                                     resultMsg.err = err;
          //                                     return callback(resultMsg);
          //                                 }
          //                                 callback(null, msg);
          //                             });
          //                         } catch (err) {
          //                             resultMsg.result = false;
          //                             resultMsg.msg = config.MSG.error01;
          //                             if( !resultMsg.err ) {
          //                                 resultMsg.err = err;
          //                             }
          //                             return callback(resultMsg);
          //                         }
          //                     },
          //                     /* 5. (백테스트) tm_simul_result 결과를 저장한다. */
          //                     function(msg, callback) {
          //                         if( !msg || Object.keys( msg ).length == 0 ) {
          //                             msg = {};
          //                         }
          //                         var arrInsertDtl    =   [];
          //                         /* tm_simul_result 테이블에 저장하기 위한 변수 설정 */
          //                         if (    v_resultSimulData 
          //                             &&  v_resultSimulData.dailyJongmokObj 
          //                             &&  Object.keys( v_resultSimulData.dailyJongmokObj ).length > 0 
          //                         ) {
          //                             for( var i=0; i < Object.keys( v_resultSimulData.dailyJongmokObj ).length; i++ ) {
          //                                 var v_F12506        =   Object.keys( v_resultSimulData.dailyJongmokObj )[i];
          //                                 var v_subItem       =   v_resultSimulData.dailyJongmokObj[ v_F12506 ];
          //                                 var v_mastItem      =   v_resultSimulData.dailyObj[ v_F12506 ];
          //                                 for( var j=0; j < Object.keys( v_resultSimulData.dailyJongmokObj[ v_F12506 ] ).length; j++ ) {
          //                                     var v_dataKey       =   Object.keys( v_resultSimulData.dailyJongmokObj[ v_F12506 ] )[j];
          //                                     var v_dataItem      =   v_resultSimulData.dailyJongmokObj[ v_F12506 ][ v_dataKey ];
          //                                     Object.assign( v_dataItem, v_mastItem );
          //                                     arrInsertDtl.push( v_dataItem  );
          //                                 }
          //                             }
          //                         }
          //                         /* 등록건이 존재하는 경우 */
          //                         if( arrInsertDtl && arrInsertDtl.length > 0 ) {
          //                             var divideList  =   [];
          //                             async.forEachOfLimit( arrInsertDtl, 1, function(subList, i, innerCallback) {
          //                                 async.waterfall([
          //                                     function(innerCallback) {
          //                                         divideList.push( subList );
          //                                         innerCallback(null, paramData);
          //                                     },
          //                                     function(sub_msg, innerCallback) {
          //                                         var divide_size = ( limit && limit.result_dive_size ? limit.result_dive_size : 1 );
          //                                         if( divideList && ( divideList.length == divide_size || i == arrInsertDtl.length-1 ) ) {
          //                                             try {
          //                                                 paramData.dataLists =   divideList;
          //                                                 stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResult', paramData, format);
          // //                                                log.debug(stmt);
          //                                                 conn.query(stmt, function(err, rows) {
          //                                                     if (err) {
          //                                                         resultMsg.result = false;
          //                                                         resultMsg.msg = config.MSG.error01;
          //                                                         resultMsg.err = err;
          //                                                         return innerCallback(resultMsg);
          //                                                     }
          //                                                     innerCallback(null);
          //                                                 });
          //                                                 divideList  =   [];
          //                                             } catch (err) {
          //                                                 resultMsg.result = false;
          //                                                 resultMsg.msg = config.MSG.error01;
          //                                                 if( !resultMsg.err ) {
          //                                                     resultMsg.err = err;
          //                                                 }
          //                                                 return innerCallback(resultMsg);
          //                                             }
          //                                         }else{
          //                                             innerCallback(null);
          //                                         }
          //                                     }
          //                                 ], function(err) {
          //                                     if( err ) {
          //                                         resultMsg.result = false;
          //                                         resultMsg.msg = config.MSG.error01;
          //                                         if( !resultMsg.err ) {
          //                                             resultMsg.err = err;
          //                                         }
          //                                         return innerCallback(resultMsg);
          //                                     }
          //                                     innerCallback(null);
          //                                 });                                            
          //                             }, function(err) {
          //                                 log.debug( "############ simulationBacktest.saveTmSimulResult #############" );
          //                                 if (err) {
          //                                     return callback(resultMsg);
          //                                 }
          //                                 delete  v_resultSimulData.dailyJongmokObj;
          //                                 delete  v_resultSimulData.dailyObj;
          //                                 arrInsertDtl    =   [];
          //                                 callback(null, msg);
          //                             });
          //                         }else{
          //                             callback(null, msg);
          //                         }
          //                     },
          /* 6. (백테스트) tm_simul_result_daily 결과를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResultDaily', paramData, format);
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
              if(!resultMsg.err) {
                resultMsg.err = err;
              }
              return callback(resultMsg);
            }
          },
          /* 7. (백테스트) tm_simul_result_daily 결과를 저장한다. */
          function(msg, callback) {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            /* daily 건이 존재하는 경우 */
            if(v_resultSimulData.arr_daily && v_resultSimulData.arr_daily.length > 0) {
              var divideList = [];
              async.forEachOfLimit(v_resultSimulData.arr_daily, 1, function(subList, i, innerCallback) {
                async.waterfall([
                  function(innerCallback) {
                    subList.F15028_S = subList.tot_F15028_S;
                    subList.F15028_C = subList.tot_F15028_C;
                    divideList.push(subList);
                    innerCallback(null, paramData);
                  },
                  function(sub_msg, innerCallback) {
                    var divide_size = (limit && limit.result_dive_size ? limit.result_dive_size : 1);
                    if(divideList && (divideList.length == divide_size || i == v_resultSimulData.arr_daily.length - 1)) {
                      try {
                        paramData.dataLists = divideList;
                        stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultDaily', paramData, format);
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
                log.debug("simulationBacktest.saveTmSimulResultDaily");
                callback(null, msg);
              });
            } else {
              callback(null, msg);
            }
          },
          /* 8. (백테스트) tm_simul_result_rebalance 결과를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResultRebalance', paramData, format);
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
              if(!resultMsg.err) {
                resultMsg.err = err;
              }
              return callback(resultMsg);
            }
          },
          /* 9. (백테스트) tm_simul_result_rebalance 결과를 저장한다. */
          function(msg, callback) {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            var arr_result_rebalance = [];
            if(v_resultSimulData.arr_rebalance && v_resultSimulData.arr_rebalance.length > 0) {
              v_resultSimulData.arr_rebalance.forEach(function(item, index, array) {
                Object.keys(item).forEach(function(sub_item, sub_index, sub_array) {
                  arr_result_rebalance.push(item[sub_item]);
                });
              });
            }
            if(arr_result_rebalance && arr_result_rebalance.length > 0) {
              var divideList = [];
              async.forEachOfLimit(arr_result_rebalance, 1, function(subList, i, innerCallback) {
                async.waterfall([
                  function(innerCallback) {
                    divideList.push(subList);
                    innerCallback(null, paramData);
                  },
                  function(sub_msg, innerCallback) {
                    var divide_size = (limit && limit.result_dive_size ? limit.result_dive_size : 1);
                    if(divideList && (divideList.length == divide_size || i == arr_result_rebalance.length - 1)) {
                      try {
                        paramData.dataLists = divideList;
                        stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultRebalance', paramData, format);
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
                log.debug("simulationBacktest.saveTmSimulResultRebalance");
                arr_result_rebalance = [];
                callback(null, msg);
              });
            } else {
              callback(null, msg);
            }
          },
          /* 10. (백테스트) tm_simul_result_contribute 결과를 삭제한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResultContribute', paramData, format);
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
              if(!resultMsg.err) {
                resultMsg.err = err;
              }
              return callback(resultMsg);
            }
          },
          /* 11. (백테스트) tm_simul_result_contribute 결과를 저장한다. */
          function(msg, callback) {
            if(!msg || Object.keys(msg).length == 0) {
              msg = {};
            }
            resultMsg.arr_contribute = [];
            var arr_result_contribute = [];
            if(v_resultSimulData.arr_contribute && v_resultSimulData.arr_contribute.length > 0) {
              v_resultSimulData.arr_contribute.forEach(function(item, index, array) {
                var v_tempItem = {};
                v_tempItem.F12506 = String(index);
                v_tempItem.fmt_F12506 = util.formatDate(v_tempItem.F12506);
                v_tempItem.F12506_B = item.before_date;
                v_tempItem.F12506_S = item.start_date;
                v_tempItem.F12506_E = item.end_date;
                if(typeof item.jongmok != "undefined" && Object.keys(item.jongmok).length > 0) {
                  for(var i = 0; i < Object.keys(item.jongmok).length; i++) {
                    var v_F16013 = Object.keys(item.jongmok)[i];
                    var v_jongmokItem = item.jongmok[v_F16013];
                    var v_subItem = Object.assign({}, v_tempItem);
                    v_subItem.F16013 = v_F16013;
                    if(typeof v_subItem != "undefined" && Object.keys(v_jongmokItem).length > 0) {
                      v_subItem.F16002 = v_jongmokItem.F16002;
                      v_subItem.START_WEIGHT = v_jongmokItem.START_WEIGHT;
                      v_subItem.END_WEIGHT = v_jongmokItem.END_WEIGHT;
                      v_subItem.CONTRIBUTE_RATE = v_jongmokItem.CONTRIBUTE_RATE;
                      if(!(v_subItem.F12506_B == v_tempItem.F12506_S && v_subItem.F12506_B == v_tempItem.F12506_E && v_subItem.F12506_S == v_tempItem.F12506_E)) {
                        arr_result_contribute.push(v_subItem);
                      }
                    }
                  }
                }
              });
              delete v_resultSimulData.arr_contribute;
            }
            if(arr_result_contribute && arr_result_contribute.length > 0) {
              /* 기여도 정보를 일자별로 변환한다. */
              var v_return_obj = fn_convert_contribute_indexRate(arr_result_contribute, v_resultSimulData.arr_daily);
              if(v_return_obj && v_return_obj.result) {
                resultMsg.arr_contribute = v_return_obj.return_data;
              }
              var divideList = [];
              async.forEachOfLimit(arr_result_contribute, 1, function(subList, i, innerCallback) {
                async.waterfall([
                  function(innerCallback) {
                    divideList.push(subList);
                    innerCallback(null, paramData);
                  },
                  function(sub_msg, innerCallback) {
                    var divide_size = (limit && limit.result_dive_size ? limit.result_dive_size : 1);
                    if(divideList && (divideList.length == divide_size || i == arr_result_contribute.length - 1)) {
                      try {
                        paramData.dataLists = divideList;
                        stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultContribute', paramData, format);
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
                log.debug("simulationBacktest.saveTmSimulResultContribute");
                arr_result_rebalance = [];
                callback(null);
              });
            } else {
              callback(null);
            }
          },
        ], function(err) {
          if(err) {
            log.debug(err, stmt, paramData);
          } else {
            resultMsg.result = true;
            resultMsg.msg = "성공적으로 저장하였습니다.";
            resultMsg.err = null;
            resultMsg.grp_cd = paramData.grp_cd;
            resultMsg.scen_cd = paramData.scen_cd;
          }
          resolve({
            result: true,
            resultMsg: resultMsg
          });
        });
      }
    } catch (expetion) {
      log.debug(expetion, paramData);
      resultMsg.result = false;
      resultMsg.msg = config.MSG.error01;
      resultMsg.err = expetion;
      resolve({
        result: false,
        resultMsg: resultMsg
      });
    }
  }).catch(function(expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
  });
}
/*************************************************************************************************************
 *   백테스트 결과 조회
 **************************************************************************************************************/
/*
 * 백테스트 결과를 조회한다.
 * 2019-08-14  bkLove(촤병국)
 */
var getBacktestResult = function(req, res) {
  try {
    log.debug('simulationBacktest.getBacktestResult 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulationBacktest.getBacktestResult  req.body.data no data.", req.body.data);
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
    resultMsg.arr_result_daily = [];
    resultMsg.arr_result_rebalance = [];
    resultMsg.simul_result_mast = {};
    resultMsg.arr_bench_mark = [];
    resultMsg.analyzeList = [];
    resultMsg.jsonFileName = "";
    resultMsg.inputData = "";
    resultMsg.arr_analyze = [];
    resultMsg.arr_analyze_main = []
    resultMsg.arr_contribute = [];
    resultMsg.owner_all_yn = "";
    Promise.using(pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        if(txerr) {
          return log.error(txerr);
        }
        async.waterfall([
          /* 1. simul_mast 가 존재하는지 체크한다. */
          function(callback) {
            try {
              var msg = {};
              if(!paramData.grp_cd || !paramData.scen_cd) {
                resultMsg.result = false;
                resultMsg.msg = "[백테스트] 기본 인자값 정보가 존재하지 않습니다.";
                resultMsg.err = "[백테스트] 기본 인자값 정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
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
                  if(!rows || rows.length == 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "기본정보가 존재하지 않습니다.";
                    resultMsg.err = "기본정보가 존재하지 않습니다.";
                    return callback(resultMsg);
                  } else if(rows.length == 1) {
                    msg.v_simul_mast = rows[0];
                    paramData.bench_mark_cd = rows[0].bench_mark_cd;
                    paramData.bench_index_cd01 = rows[0].bench_index_cd01;
                    paramData.bench_index_cd02 = rows[0].bench_index_cd02;
                    paramData.bench_index_cd03 = rows[0].bench_index_cd03;
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
          /* 2. (백테스트) 시뮬레이션 할 기본정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              if(typeof msg.v_simul_mast == "undefined" || Object.keys(msg.v_simul_mast).length == 0) {
                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = "기본정보가 존재하지 않습니다.";
                callback(resultMsg);
              } else {
                resultMsg.owner_all_yn = msg.v_simul_mast.owner_yn;
                if(typeof paramData.time_series_upload_yn != "undefined" && paramData.time_series_upload_yn == "1") {
                  resultMsg.simul_result_mast = msg.v_simul_mast;
                  callback(null, msg);
                } else {
                  paramData.changeGrpCdYn = "0";
                  stmt = mapper.getStatement("simulationBacktest", "getSimulListByBacktest", paramData, format);
                  log.debug(stmt, paramData);
                  conn.query(stmt, function(err, rows) {
                    if(err) {
                      resultMsg.result = false;
                      resultMsg.msg = config.MSG.error01;
                      resultMsg.err = err;
                      return callback(resultMsg);
                    }
                    if(!rows || rows.length == 0 || !rows[0].start_year) {
                      resultMsg.result = false;
                      resultMsg.msg = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";
                      resultMsg.err = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";
                      return callback(resultMsg);
                    }
                    resultMsg.simul_result_mast = rows[0];
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
          /* 3. (백테스트) tm_simul_result_daily 테이블을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'getSimulResultDaily', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  resultMsg.arr_result_daily = rows;
                  paramData.first_date = rows[0].F12506;
                  /* 일자별 지수에 balance 정보를 설정한다. */
                  fn_set_balance(resultMsg.arr_result_daily, resultMsg.simul_result_mast);
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
          /* 4. tm_simul_result_daily 테이블 기준 td_index_hist 테이블에서 bench_mark 와 일치하는 정보를 조회한다.*/
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'getSimulBenchMark', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  /* 일자별 지수에 밴치마크 정보를 설정한다. */
                  fn_set_bench_mark(resultMsg.arr_result_daily, rows);
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
          /* 5. (백테스트) tm_simul_result_rebalance 테이블을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'getSimulResultRebalance', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  resultMsg.arr_result_rebalance = rows;
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
          /* 6. (백테스트) tm_simul_result_contribute 테이블을 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              stmt = mapper.getStatement('simulationBacktest', 'getSimulResultContribute', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  /* 기여도 정보를 일자별로 변환한다. */
                  var v_return_obj = fn_convert_contribute_indexRate(rows, resultMsg.arr_result_daily);
                  if(v_return_obj && v_return_obj.result) {
                    resultMsg.arr_contribute = v_return_obj.return_data;
                  }
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
          /* 7. (백테스트) tm_simul_result_anal 정보를 조회한다. */
          function(msg, callback) {
            try {
              if(!msg || Object.keys(msg).length == 0) {
                msg = {};
              }
              var analyzeList = [];
              resultMsg.jsonFileName = "";
              resultMsg.inputData = "";
              if(resultMsg.arr_result_daily && resultMsg.arr_result_daily.length > 0) {
                resultMsg.arr_result_daily.forEach(function(item) {
                  let analyzeObj = {};
                  if(typeof item.F12506 != 'undefined') {
                    analyzeObj.date = util1.format('%s-%s-%s', item.F12506.substr(0, 4), item.F12506.substr(4, 2), item.F12506.substr(6, 2));
                    analyzeObj.backtest = item.INDEX_RATE;
                    analyzeObj.riskfree = item.F15175;
                    if(paramData.bench_mark_cd != '0') {
                      analyzeObj.benchmark = item.bm_data01;
                    }
                    analyzeObj.kospi = item.KOSPI_F15001;
                    analyzeObj.F15028_S = item.tot_F15028_S;
                    analyzeObj.F15028_C = item.tot_F15028_C;
                    analyzeList.push(analyzeObj);
                  }
                });
                resultMsg.jsonFileName = "timeserise_" + (new Date().getTime()) + ".json";
                resultMsg.inputData = JSON.stringify(analyzeList);
              }
              stmt = mapper.getStatement('simulationBacktest', 'getTmSimulResultAnal', paramData, format);
              log.debug(stmt, paramData);
              conn.query(stmt, function(err, rows) {
                if(err) {
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = err;
                  return callback(resultMsg);
                }
                if(rows && rows.length > 0) {
                  var v_arr_analyze_main = [];
                  for(var i = 0; i < rows.length; i++) {
                    var rowData = rows[i];
                    var analJson = {};
                    analJson.anal_title = rowData.anal_title;
                    analJson.backtest = rowData.backtest + (rowData.backtest != "N/A" && rowData.backtest_percent_yn == "1" ? " %" : "");
                    if(rowData.backtest_year != null && rowData.backtest_year != "") {
                      analJson.backtest += " (" + rowData.backtest_year + ")";
                    }
                    analJson.benchmark = rowData.benchmark + (rowData.benchmark != "N/A" && rowData.benchmark_percent_yn == "1" ? " %" : "");
                    if(rowData.benchmark_year != null && rowData.benchmark_year != "") {
                      analJson.benchmark += " (" + rowData.benchmark_year + ")";
                    }
                    resultMsg.arr_analyze.push(analJson);
                    if(rowData.title_order_no != null & rowData.title_order_no > 0) {
                      analJson = {};
                      analJson.anal_title = rowData.anal_title;
                      rowData.fmt_backtest = Number(rowData.backtest).toFixed(2);
                      if(rowData.backtest != "N/A" && rowData.backtest_percent_yn == "1") {
                        rowData.fmt_backtest += " %";
                      }
                      analJson.backtest = rowData.fmt_backtest;
                      if(rowData.backtest_year != null && rowData.backtest_year != "") {
                        analJson.backtest += " (" + rowData.backtest_year + ")";
                      }
                      rowData.fmt_benchmark = Number(rowData.benchmark).toFixed(2);
                      if(rowData.benchmark != "N/A" && rowData.benchmark_percent_yn == "1") {
                        rowData.fmt_benchmark += " %";
                      }
                      analJson.benchmark = rowData.fmt_benchmark;
                      if(rowData.benchmark_year != null && rowData.benchmark_year != "") {
                        analJson.benchmark += " (" + rowData.benchmark_year + ")";
                      }
                      analJson.anal_title = rowData.title_anal_id;
                      analJson.order_no = rowData.title_order_no;
                      v_arr_analyze_main.push(analJson);
                    }
                  }
                  resultMsg.arr_analyze_main = _.orderBy(v_arr_analyze_main, ["order_no"], ["asc"]);
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
            conn.rollback();
          } else {
            resultMsg.result = true;
            resultMsg.msg = "";
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
    resultMsg.arr_result_daily = [];
    resultMsg.arr_result_rebalance = [];
    resultMsg.simul_result_mast = {};
    resultMsg.analyzeList = [];
    resultMsg.jsonFileName = "";
    resultMsg.inputData = "";
    resultMsg.arr_analyze = [];
    resultMsg.arr_analyze_main = [];
    resultMsg.arr_contribute = [];
    resultMsg.owner_all_yn = "";
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 엑셀 다운로드용 시뮬레이션 종목정보를 조회한다.
 * 2019-10-31  bkLove(촤병국)
 */
var getSimulJongmoForExcel = function(req, res) {
  try {
    log.debug('simulationBacktest.getSimulJongmoForExcel 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulationBacktest.getSimulJongmoForExcel  req.body.data no data.", req.body.data);
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
    resultMsg.arr_excel_jongmok_header = [];
    resultMsg.arr_excel_jongmok_data = [];
    Promise.using(pool.connect(), conn => {
      async.waterfall([
        /* 1. 백테스트를 수행한다. */
        function(callback) {
          try {
            var msg = {};
            if(!paramData.grp_cd || !paramData.scen_cd) {
              resultMsg.result = false;
              resultMsg.msg = "기본 인자값 정보가 존재하지 않습니다.";
              resultMsg.err = "기본 인자값 정보가 존재하지 않습니다.";
              callback(resultMsg);
            } else {
              msg.arr_daily_jongmok = [];
              if(paramData.time_series_upload_yn != "undefined" && paramData.time_series_upload_yn == "1") {
                callback(null, msg);
              } else {
                paramData.moduleId = "getSimulJongmoForExcel";
                paramData.transaction = {};
                paramData.transaction.mapper = mapper;
                paramData.transaction.pool = pool;
                paramData.transaction.conn = conn;
                /* 백테스트를 수행한다. */
                runBacktest.call(this, req, res, paramData).then(function(e) {
                  if(e && e.resultMsg && e.resultMsg.result) {
                    resultMsg.result = e.resultMsg.result;
                    resultMsg.msg = e.resultMsg.msg;
                    resultMsg.simul_mast = e.resultMsg.simul_mast;
                    if(e.resultMsg.dailyJongmokObj && Object.keys(e.resultMsg.dailyJongmokObj).length > 0) {
                      for(var i = 0; i < Object.keys(e.resultMsg.dailyJongmokObj).length; i++) {
                        var v_F12506 = Object.keys(e.resultMsg.dailyJongmokObj)[i];
                        var v_subItem = e.resultMsg.dailyJongmokObj[v_F12506];
                        var v_mastItem = e.resultMsg.dailyJongmokObj[v_F12506];
                        for(var j = 0; j < Object.keys(e.resultMsg.dailyJongmokObj[v_F12506]).length; j++) {
                          var v_dataKey = Object.keys(e.resultMsg.dailyJongmokObj[v_F12506])[j];
                          var v_dataItem = e.resultMsg.dailyJongmokObj[v_F12506][v_dataKey];
                          Object.assign(v_dataItem, v_mastItem);
                          msg.arr_daily_jongmok.push(v_dataItem);
                        }
                      }
                    }
                    callback(null, msg);
                  } else {
                    resultMsg.result = false;
                    resultMsg.msg = config.MSG.error01;
                    resultMsg.err = config.MSG.error01;
                    callback(resultMsg);
                  }
                }).catch(function(expetion) {
                  log.debug(expetion, paramData);
                  resultMsg.result = false;
                  resultMsg.msg = config.MSG.error01;
                  resultMsg.err = expetion;
                  callback(resultMsg);
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
        /* 2. 엑셀 다운로드용 종목정보를 설정한다. */
        function(msg, callback) {
          try {
            msg.arr_excel_jongmok_header = [];
            if(typeof msg.arr_daily_jongmok == "undefined" && msg.arr_daily_jongmok.length == 0) {
              callback(null);
            } else {
              msg.arr_daily_jongmok = _.orderBy(msg.arr_daily_jongmok, ["grp_cd", "scen_cd", "F12506", "F16013"], ["asc", "asc", "asc", "asc"]);
              /* 헤더 정보 */
              msg.arr_excel_jongmok_header = _.uniqBy(msg.arr_daily_jongmok, function(o) {
                return o.grp_cd + "_ " + o.scen_cd + "_" + o.F16013
              }).map(function(o) {
                return {
                  "grp_cd": o.grp_cd /* 그룹코드(상위코드) */ ,
                  "scen_cd": o.scen_cd /* 시나리오코드 */ ,
                  "F16013": o.F16013 /* 단축 코드(현금은 KRW로 처리) */ ,
                  "F16002": o.F16002 /* 종목명 */
                };
              });
              msg.arr_excel_jongmok_header = _.orderBy(msg.arr_excel_jongmok_header, ["F16013"], ["asc"]);
              /* 일자 정보 */
              var arr_result_data = _.uniqBy(msg.arr_daily_jongmok, "F12506").map(function(o) {
                return {
                  "F12506": o.F12506 /* 입회일자 */ ,
                  "fmt_F12506": util.formatDate(String(o.F12506)) /* 입회일자 */
                };
              });
              arr_result_data = _.orderBy(arr_result_data, ["F12506"], ["asc"]);
              /* 헤더가 존재하는 경우 데이터 설정 */
              if(msg.arr_excel_jongmok_header && msg.arr_excel_jongmok_header.length > 0) {
                for(var i = 0; i < msg.arr_daily_jongmok.length; i++) {
                  var v_row = msg.arr_daily_jongmok[i];
                  var v_header = _.findIndex(msg.arr_excel_jongmok_header, {
                    "F16013": v_row.F16013
                  });
                  var v_index = -1;
                  if(v_header > -1) {
                    v_index = _.findIndex(arr_result_data, {
                      "F12506": v_row.F12506
                    });
                  }
                  if(v_index > -1) {
                    arr_result_data[v_index][msg.arr_excel_jongmok_header[v_header].F16013 + "_F15007"] = v_row.F15007; /* 기준가 */
                    arr_result_data[v_index][msg.arr_excel_jongmok_header[v_header].F16013 + "_F30700"] = v_row.F30700; /* 종가 */
                    arr_result_data[v_index][msg.arr_excel_jongmok_header[v_header].F16013 + "_F16143"] = v_row.F16143; /* 상장주식수 */
                    arr_result_data[v_index][msg.arr_excel_jongmok_header[v_header].F16013 + "_TODAY_RATE"] = v_row.TODAY_RATE; /* 지수적용비율 */
                    arr_result_data[v_index][msg.arr_excel_jongmok_header[v_header].F16013 + "_TODAY_IMPORTANCE"] = v_row.TODAY_IMPORTANCE; /* 비중 */
                  }
                }
              }
              arr_result_data.forEach(function(item, index, array) {
                msg.arr_excel_jongmok_header.forEach(function(item1, index1, array1) {
                  /* 기준가 */
                  if(typeof item[item1.F16013 + "_F15007"] == "undefined") {
                    item[item1.F16013 + "_F15007"] = "";
                  }
                  /* 종가 */
                  if(typeof item[item1.F16013 + "_F30700"] == "undefined") {
                    item[item1.F16013 + "_F30700"] = "";
                  }
                  /* 상장주식수 */
                  if(typeof item[item1.F16013 + "_F16143"] == "undefined") {
                    item[item1.F16013 + "_F16143"] = "";
                  }
                  /* 지수적용비율 */
                  if(typeof item[item1.F16013 + "_TODAY_RATE"] == "undefined") {
                    item[item1.F16013 + "_TODAY_RATE"] = "";
                  }
                  /* 비중 */
                  if(typeof item[item1.F16013 + "_TODAY_IMPORTANCE"] == "undefined") {
                    item[item1.F16013 + "_TODAY_IMPORTANCE"] = "";
                  }
                });
              });
              resultMsg.arr_excel_jongmok_header = msg.arr_excel_jongmok_header;
              resultMsg.arr_excel_jongmok_data = arr_result_data;
              callback(null);
            }
          } catch (err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            if(!resultMsg.err) {
              resultMsg.err = err;
            }
            return callback(resultMsg);
          }
        },
      ], function(err) {
        if(err) {
          log.debug(err, stmt, paramData);
        } else {
          resultMsg.result = true;
          resultMsg.err = null;
        }
        res.json(resultMsg);
        res.end();
      });
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_excel_jongmok_header = [];
    resultMsg.arr_excel_jongmok_data = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 시뮬레이션 결과 테이블에 저장되어 있는지 체크한다.
 * 2019-10-24  bkLove(촤병국)
 */
var getSimulResultSaveYn = function(req, res) {
  try {
    log.debug('simulationBacktest.getSimulResultSaveYn 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulationBacktest.getSimulResultSaveYn  req.body.data no data.", req.body.data);
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
    resultMsg.result_save_yn = "N";
    Promise.using(pool.connect(), conn => {
      try {
        /* 그룹에 속한 시뮬레이션을 조회한다. */
        stmt = mapper.getStatement('simulationBacktest', 'getSimulResultSaveYn', paramData, format);
        log.debug(stmt);
        conn.query(stmt, function(err, rows) {
          if(err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            res.json(resultMsg);
            res.end();
            return false;
          }
          if(rows && rows.length == 1) {
            resultMsg.result = true;
            resultMsg.msg = "";
            resultMsg.result_save_yn = rows[0].result_save_yn;
            res.json(resultMsg);
            res.end();
          }
        });
      } catch (err) {
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        if(!resultMsg.err) {
          resultMsg.err = err;
        }
        res.json(resultMsg);
        res.end();
      }
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.result_save_yn = "N";
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 시계열 엑셀 다운로드를 위한 데이터를 조회한다.
 * 2019-10-24  bkLove(촤병국)
 */
var getSimulTimeSeriesExcel = function(req, res) {
  try {
    log.debug('simulationBacktest.getSimulTimeSeriesExcel 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    /* 1. body.data 값이 있는지 체크 */
    if(!req.body.data) {
      log.error("[error] simulationBacktest.getSimulTimeSeriesExcel  req.body.data no data.", req.body.data);
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
    resultMsg.arr_result_daily = [];
    Promise.using(pool.connect(), conn => {
      try {
        /* 그룹에 속한 시뮬레이션을 조회한다. */
        stmt = mapper.getStatement('simulationBacktest', 'getSimulResultDaily', paramData, format);
        log.debug(stmt);
        conn.query(stmt, function(err, rows) {
          if(err) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
            res.json(resultMsg);
            res.end();
            return false;
          }
          if(rows && rows.length > 0) {
            rows.forEach(function(item, index, array) {
              resultMsg.arr_result_daily.push({
                "fmt_F12506": item.fmt_F12506,
                "INDEX_RATE": item.INDEX_RATE
              })
            });
          }
          resultMsg.result = true;
          resultMsg.msg = "";
          res.json(resultMsg);
          res.end();
        });
      } catch (err) {
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        if(!resultMsg.err) {
          resultMsg.err = err;
        }
        res.json(resultMsg);
        res.end();
      }
    });
  } catch (expetion) {
    log.debug(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
    resultMsg.err = expetion;
    resultMsg.arr_result_daily = [];
    res.json(resultMsg);
    res.end();
  }
}
/*
 * 기여도 정보를 일자별로 변환한다.
 * 2019-10-24  bkLove(촤병국)
 */
function fn_convert_contribute_indexRate(p_arr_result_contribute, p_arr_daily) {
  try {
    var v_prev_F12506 = "";
    var v_arr_F12506_contribute = [];
    var v_tempObj = {};
    var v_return_arr_contribute = [];
    var v_return_obj = {};
    if(!p_arr_result_contribute || p_arr_result_contribute.length == 0 || !p_arr_daily || p_arr_daily.length == 0) {
      v_return_obj.result = false;
      v_return_obj.msg = "기여도 정보가 존재하지 않습니다.";
      v_return_obj.return_data = [];
      return v_return_obj;
    }
    for(var i = 0; i < p_arr_result_contribute.length; i++) {
      var v_row = p_arr_result_contribute[i];
      if(i == 0) {
        v_prev_F12506 = v_row.F12506;
        v_tempObj.F12506 = v_row.F12506;
        /* 시작 직전일 */
        v_tempObj.F12506_B = v_row.F12506_B;
        var v_daily_obj = _.find(p_arr_daily, {
          "F12506": v_row.F12506_B
        });
        if(v_daily_obj && Object.keys(v_daily_obj).length > 0) {
          v_tempObj.F12506_B_INDEX_RATE = v_daily_obj.INDEX_RATE;
        }
        /* 시작 입회일자 */
        v_tempObj.F12506_S = v_row.F12506_S;
        v_daily_obj = _.find(p_arr_daily, {
          "F12506": v_row.F12506_S
        });
        if(v_daily_obj && Object.keys(v_daily_obj).length > 0) {
          v_tempObj.F12506_S_INDEX_RATE = v_daily_obj.INDEX_RATE;
        }
        /* 종료 입회일자 */
        v_tempObj.F12506_E = v_row.F12506_E;
        v_daily_obj = _.find(p_arr_daily, {
          "F12506": v_row.F12506_E
        });
        if(v_daily_obj && Object.keys(v_daily_obj).length > 0) {
          v_tempObj.F12506_E_INDEX_RATE = v_daily_obj.INDEX_RATE;
        }
      }
      if(v_prev_F12506 == v_row.F12506) {
        v_arr_F12506_contribute.push(v_row);
      }
      if(i == p_arr_result_contribute.length - 1 || v_prev_F12506 != v_row.F12506) {
        v_tempObj.dataLists = v_arr_F12506_contribute;
        v_return_arr_contribute.push(v_tempObj);
        v_arr_F12506_contribute = [];
        v_tempObj = {};
        v_tempObj.dataLists = [];
        if(i != p_arr_result_contribute.length - 1) {
          v_tempObj.F12506 = v_row.F12506;
          /* 시작 직전일 */
          v_tempObj.F12506_B = v_row.F12506_B;
          var v_daily_obj = _.find(p_arr_daily, {
            "F12506": v_row.F12506_B
          });
          if(v_daily_obj && Object.keys(v_daily_obj).length > 0) {
            v_tempObj.F12506_B_INDEX_RATE = v_daily_obj.INDEX_RATE;
          }
          /* 시작 입회일자 */
          v_tempObj.F12506_S = v_row.F12506_S;
          v_daily_obj = _.find(p_arr_daily, {
            "F12506": v_row.F12506_S
          });
          if(v_daily_obj && Object.keys(v_daily_obj).length > 0) {
            v_tempObj.F12506_S_INDEX_RATE = v_daily_obj.INDEX_RATE;
          }
          /* 종료 입회일자 */
          v_tempObj.F12506_E = v_row.F12506_E;
          v_daily_obj = _.find(p_arr_daily, {
            "F12506": v_row.F12506_E
          });
          if(v_daily_obj && Object.keys(v_daily_obj).length > 0) {
            v_tempObj.F12506_E_INDEX_RATE = v_daily_obj.INDEX_RATE;
          }
          v_arr_F12506_contribute.push(v_row);
        }
      }
      v_prev_F12506 = v_row.F12506;
    }
    v_return_obj.result = true;
    v_return_obj.msg = "";
    v_return_obj.return_data = v_return_arr_contribute;
    return v_return_obj;
  } catch (e) {
    log.error(e);
    v_return_obj.result = false;
    v_return_obj.msg = config.MSG.error01;
    v_return_obj.return_data = [];
    return v_return_obj;
  }
}
/*
 *   일자별 지수에 balance 정보를 설정한다.
 *   2019-08-14  bkLove(촤병국)
 */
function fn_set_balance(p_arr_daily, p_simul_mast) {
  if(p_arr_daily && p_arr_daily.length > 0) {
    var v_prev_index = 0;
    for(var i = 0; i < p_arr_daily.length; i++) {
      var v_daily = p_arr_daily[i];
      var v_prev_daily = (typeof p_arr_daily[v_prev_index] == "undefined" ? {} : p_arr_daily[v_prev_index]);
      /* 최초인 경우 */
      if(i == 0) {
        v_daily.balance = p_simul_mast.init_invest_money;
      } else {
        /* balance = 전일 balance * ( 당일 지수 / 전일 지수 ) */
        v_daily.balance = (Number(v_prev_daily.balance) * (Number(Number(v_daily.INDEX_RATE).toFixed(2)) / Number(Number(v_prev_daily.INDEX_RATE).toFixed(2)))).toFixed(3);
      }
      if(i > 0) {
        v_prev_index = i;
      }
    }
  }
}
/*
 *   일자별 지수에 밴치마크 정보를 설정한다.
 *   2019-08-14  bkLove(촤병국)
 */
function fn_set_bench_mark(p_arr_daily, p_arr_bench) {
  try {
    /* 소수점시 계산시 사용할 고정값 */
    var numInfo = {
      IMPORTANCE_FIX_NUM: 100 /* 비중  소수점 계산시 사용할 고정값 */ ,
      IMPORTANCE_FIX_NUM1: 10000 /* 비중  소수점 계산시 사용할 고정값 */ ,
      JISU_RATE_FIX_NUM: 100000000000000000 /* 지수적용비율 소수점 계산시 사용할 고정값 */
    };
    if(p_arr_daily && p_arr_daily.length > 0 && p_arr_bench && p_arr_bench.length > 0) {
      var v_prev_index = 0;
      for(var i = 0; i < p_arr_daily.length; i++) {
        var v_daily = p_arr_daily[i];
        var v_prev_daily = (typeof p_arr_daily[v_prev_index] == "undefined" ? {} : p_arr_daily[v_prev_index]);
        var v_bm = (typeof p_arr_bench[i] == "undefined" ? {} : p_arr_bench[i]);
        fn_set_sub_bench_mark(i, v_daily, v_prev_daily, v_bm);
        if(i > 0) {
          v_prev_index = i;
        }
      }
    }
  } catch (e) {
    throw e;
  }
}
/*
 *   (하위) 일자별 지수에 밴치마크 정보를 설정한다.
 *   2019-08-14  bkLove(촤병국)
 */
function fn_set_sub_bench_mark(p_index, p_daily, p_prev_daily, p_bm) {
  try {
    p_daily.bm_data01 = Number(p_bm.F15001);
    p_daily.F15175 = Number(p_bm.F15175);
    p_daily.KOSPI_F15001 = Number(p_bm.KOSPI_F15001);
    /* 최초인 경우 */
    if(p_index == 0) {
      p_daily.bm_1000_data = 1000;
      p_daily.bm_return_data = Number(
        (
          (Number(p_daily.bm_1000_data) - Number(p_daily.bm_1000_data)) / Number(p_daily.bm_1000_data)).toFixed(17));
    } else {
      /* 1000 단위환산 = 전일 단위환산 * ( 당일지수 / 전일 지수 ) */
      p_daily.bm_1000_data = Number(
        (Number(p_prev_daily.bm_1000_data) * (Number(p_daily.bm_data01) / Number(p_prev_daily.bm_data01))).toFixed(17));
      /* return = ( 당일 단위환산 - 전일 단위환산 ) / 전일 단위환산 */
      p_daily.bm_return_data = Number(
        (
          (Number(p_daily.bm_1000_data) - Number(p_prev_daily.bm_1000_data)) / Number(p_prev_daily.bm_1000_data)).toFixed(17));
    }
  } catch (e) {
    throw e;
  }
}
/*
 * 분석정보를 설정한다.
 * 2019-07-26  bkLove(촤병국)
 */
function fn_setAnal01(p_arr_analyze_temp) {
  arr_analyze = [];
  arr_analyze_main = [];
  arr_analyze_db = [];
  if(p_arr_analyze_temp && Object.keys(p_arr_analyze_temp).length > 0) {
    var v_anal = {};
    var v_anal01 = {};
    /* 정수처리 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "final_balance");
    v_anal.anal_title = "Final Balance";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "int",
      p_percent_yn: "0",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "cagr");
    v_anal.anal_title = "CAGR";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: arr_analyze_main,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: 1
    });
    /*  수익률 ( 연도 )
        %처리. 100곱한후 소수점 6째자리에서 반올림 
    */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "best_y", "rtn");
    v_anal01 = fn_getFindJson(p_arr_analyze_temp, "best_y", "year");
    v_anal.anal_title = "Best Year";
    v_anal.backtest02 = (v_anal01.backtest != "N/A" ? v_anal01.backtest : "N/A");
    v_anal.benchmark02 = (v_anal01.benchmark != "N/A" ? v_anal01.benchmark : "N/A");
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: arr_analyze_main,
      p_anal: v_anal,
      p_anal01: v_anal01,
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: 7
    });
    /*  수익률 ( 연도 )
        %처리. 100곱한후 소수점 6째자리에서 반올림 
    */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "worst_y", "rtn");
    v_anal01 = fn_getFindJson(p_arr_analyze_temp, "worst_y", "year");
    v_anal.anal_title = "Worst Year";
    v_anal.backtest02 = (v_anal01.backtest != "N/A" ? v_anal01.backtest : "N/A");
    v_anal.benchmark02 = (v_anal01.benchmark != "N/A" ? v_anal01.benchmark : "N/A");
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: arr_analyze_main,
      p_anal: v_anal,
      p_anal01: v_anal01,
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: 8
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "mdd");
    v_anal.anal_title = "MDD";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: arr_analyze_main,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: 6
    });
    /* 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "sharpe_rto");
    v_anal.anal_title = "Sharpe Ratio";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: arr_analyze_main,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "0",
      p_position: 5,
      p_order_no: 3
    });
    /* 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "sortino_rto");
    v_anal.anal_title = "Sortino Ratio";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "0",
      p_position: 5,
      p_order_no: -1
    });
    /* 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "vs_market", "corr");
    v_anal.anal_title = "Market Correlation";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "0",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "arith_mean");
    v_anal.anal_title = "Arithmetic Mean (daily)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "annlzd_arith_mean");
    v_anal.anal_title = "Arithmetic Mean (annualized)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "geo_mean");
    v_anal.anal_title = "Geometric Mean (daily)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "annlzd_geo_mean");
    v_anal.anal_title = "Geometric Mean (annualized)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "stdev");
    v_anal.anal_title = "Volatility (daily)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "annlzd_stdev");
    v_anal.anal_title = "Volatility (annualized)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: arr_analyze_main,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: 2
    });
    arr_analyze_main[arr_analyze_main.length - 1].anal_title = "Vol(annualized)";
    arr_analyze_db[arr_analyze_db.length - 1].title_anal_id = "Vol(annualized)";
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "down_dev");
    v_anal.anal_title = "Downside Deviation (daily)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "vs_market", "beta");
    v_anal.anal_title = "Beta(vs market)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: arr_analyze_main,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "0",
      p_position: 5,
      p_order_no: 4
    });
    arr_analyze_main[arr_analyze_main.length - 1].anal_title = "Beta(KOSPI 기준)";
    arr_analyze_db[arr_analyze_db.length - 1].title_anal_id = "Beta(KOSPI 기준)";
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "vs_market", "alpha");
    v_anal.anal_title = "Alpha(vs market, annualized)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: arr_analyze_main,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: 5
    });
    arr_analyze_main[arr_analyze_main.length - 1].anal_title = "Alpha(KOSPI 기준)";
    arr_analyze_db[arr_analyze_db.length - 1].title_anal_id = "Alpha(KOSPI 기준)";
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "vs_market", "r2");
    v_anal.anal_title = "R2(vs market)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "vs_benchmark", "beta");
    v_anal.anal_title = "Beta(vs benchmark)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "0",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "vs_benchmark", "alpha");
    v_anal.anal_title = "Alpha(vs benchmark, annualized)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "vs_benchmark", "r2");
    v_anal.anal_title = "R2(vs benchmark)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "skewness");
    v_anal.anal_title = "Skewness";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "0",
      p_position: 5,
      p_order_no: -1
    });
    /* 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "kurtosis");
    v_anal.anal_title = "Excess Kurtosis";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "0",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "hist_var");
    v_anal.anal_title = "Historical VaR(5%)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "anal_var");
    v_anal.anal_title = "Analytical VaR(5%)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
    v_anal = fn_getFindJson(p_arr_analyze_temp, "c_var");
    v_anal.anal_title = "Conditional VaR(5%)";
    fn_set_analyze_data({
      p_arr_analyze: arr_analyze,
      p_arr_analyze_db: arr_analyze_db,
      p_arr_analyze_main: null,
      p_anal: v_anal,
      p_anal01: {},
      p_type: "number",
      p_percent_yn: "1",
      p_position: 5,
      p_order_no: -1
    });
    return {
      arr_analyze: arr_analyze,
      arr_analyze_main: arr_analyze_main,
      arr_analyze_db: arr_analyze_db
    }
  }
}
/*
 *   파싱된 분석정보를 설정한다.
 *   2019-07-26  bkLove(촤병국)
 */
function fn_set_analyze_data(p_param = {
  p_arr_analyze: [],
  p_arr_analyze_db: [],
  p_arr_analyze_main: [],
  p_anal: {},
  p_anal01: {},
  p_type: "",
  p_percent_yn: "0",
  p_position: 5,
  p_order_no: -1
}) {
  var v_result_data = {};
  var v_data = {
    anal_title: "",
    backtest02: "",
    benchmark02: ""
  };
  if(typeof p_param.p_anal != "undefined" && Object.keys(p_param.p_anal).length > 0 && typeof p_param.p_anal.anal_title != "undefined") {
    v_data.anal_title = p_param.p_anal.anal_title;
  }
  if(typeof p_param.p_anal01 != "undefined" && Object.keys(p_param.p_anal01).length > 0) {
    v_data.backtest02 = (p_param.p_anal01.backtest != "N/A" ? p_param.p_anal01.backtest : "N/A");
    v_data.benchmark02 = (p_param.p_anal01.benchmark != "N/A" ? p_param.p_anal01.benchmark : "N/A");
  }
  /*  analyze     START */
  if(p_param.p_arr_analyze != null) {
    v_result_data = Object.assign({}, v_data);
    v_result_data.backtest = fn_convert_data({
      p_data: p_param.p_anal.backtest,
      p_data01: v_data.backtest02,
      p_type: p_param.p_type,
      p_percent_yn: p_param.p_percent_yn,
      p_show_percent_yn: "1",
      p_show_data01_yn: "1",
      p_position: p_param.p_position
    });
    v_result_data.benchmark = fn_convert_data({
      p_data: p_param.p_anal.benchmark,
      p_data01: v_data.benchmark02,
      p_type: p_param.p_type,
      p_percent_yn: p_param.p_percent_yn,
      p_show_percent_yn: "1",
      p_show_data01_yn: "1",
      p_position: p_param.p_position
    });
    p_param.p_arr_analyze.push(v_result_data);
    /*  arr_analyze_main    START */
    if(p_param.p_arr_analyze_main != null) {
      v_result_data = Object.assign({}, v_data);
      v_result_data.backtest = fn_convert_data({
        p_data: p_param.p_anal.backtest,
        p_data01: v_data.backtest02,
        p_type: p_param.p_type,
        p_percent_yn: p_param.p_percent_yn,
        p_show_percent_yn: "1",
        p_show_data01_yn: "1",
        p_position: 2
      });
      v_result_data.benchmark = fn_convert_data({
        p_data: p_param.p_anal.benchmark,
        p_data01: v_data.benchmark02,
        p_type: p_param.p_type,
        p_percent_yn: p_param.p_percent_yn,
        p_show_percent_yn: "1",
        p_show_data01_yn: "1",
        p_position: 2
      });
      v_result_data.order_no = p_param.p_order_no;
      p_param.p_arr_analyze_main.push(v_result_data);
    }
    /*  arr_analyze_main    END */
    /* arr_analyze_db   START */
    if(p_param.p_arr_analyze_db != null) {
      v_result_data = Object.assign({}, v_data);
      v_result_data.title_anal_id = "";
      if(p_param.p_order_no > 0) {
        v_result_data.title_anal_id = v_result_data.anal_title;
      }
      v_result_data.title_order_no = p_param.p_order_no;
      v_result_data.backtest = fn_convert_data({
        p_data: p_param.p_anal.backtest,
        p_data01: v_data.backtest02,
        p_type: p_param.p_type,
        p_percent_yn: p_param.p_percent_yn,
        p_show_percent_yn: "0",
        p_show_data01_yn: "0",
        p_position: p_param.p_position
      });
      v_result_data.backtest_year = "";
      if(v_data.backtest02 != "") {
        v_result_data.backtest_year = v_data.backtest02;
      }
      v_result_data.backtest_percent_yn = "0";
      if(typeof p_param.p_percent_yn != "undefined") {
        v_result_data.backtest_percent_yn = p_param.p_percent_yn;
      }
      v_result_data.benchmark = fn_convert_data({
        p_data: p_param.p_anal.benchmark,
        p_data01: v_data.benchmark02,
        p_type: p_param.p_type,
        p_percent_yn: p_param.p_percent_yn,
        p_show_percent_yn: "0",
        p_show_data01_yn: "0",
        p_position: p_param.p_position
      });
      v_result_data.benchmark_year = "";
      if(v_data.benchmark02 != "") {
        v_result_data.benchmark_year = v_data.benchmark02;
      }
      v_result_data.benchmark_percent_yn = "0";
      if(typeof p_param.p_percent_yn != "undefined") {
        v_result_data.benchmark_percent_yn = p_param.p_percent_yn;
      }
      p_param.p_arr_analyze_db.push(v_result_data);
    }
    /* arr_analyze_db   END */
  }
  /*  analyze     END */
}
/*
 *   구분 정보에 맞게 데이터를 노출한다.
 *   2019-07-26  bkLove(촤병국)
 */
function fn_convert_data(p_param = {
  p_data: "",
  p_data01: "",
  p_type: "",
  p_percent_yn: "0",
  p_show_percent_yn: "0",
  p_position: 5,
  p_show_data01_yn: "0"
}) {
  var v_data = "";
  if(p_param.p_data == "N/A") {
    v_data = p_param.p_data;
  } else {
    switch (p_param.p_type) {
      case "number":
        if(p_param.p_percent_yn == "0") {
          v_data = Number(p_param.p_data).toFixed(p_param.p_position);
        } else {
          v_data = (Number(p_param.p_data) * 100).toFixed(p_param.p_position);
        }
        if(p_param.p_percent_yn == "1" && p_param.p_show_percent_yn == "1") {
          v_data += " %";
        }
        if(typeof p_param.p_show_data01_yn != "undefined" && p_param.p_show_data01_yn == "1") {
          if(p_param.p_data01 != "") {
            v_data += " (";
            v_data += p_param.p_data01;
            v_data += ")";
          }
        }
        break;
      case "int":
        v_data = parseInt(Number(p_param.p_data));
        break;
      case "":
        v_data = p_param.p_data;
        break;
    }
  }
  return v_data;
}
/*
 * key 에 일치하는 JSON 정보를 추출한다.
 * 2019-07-26  bkLove(촤병국)
 */
function fn_getFindJson(p_arr_analyze_temp, p_strKey = "", p_subKey = "") {
  var vm = this;
  var returnJson = {
    backtest: "",
    benchmark: ""
  };
  if(p_strKey != "" && p_arr_analyze_temp && Object.keys(p_arr_analyze_temp).length > 0) {
    if(p_subKey != "") {
      if(typeof p_arr_analyze_temp["backtest"] != "undefined" && p_arr_analyze_temp["backtest"] && typeof p_arr_analyze_temp["backtest"][p_strKey] != "undefined" && p_arr_analyze_temp["backtest"][p_strKey] && typeof p_arr_analyze_temp["backtest"][p_strKey][p_subKey] != "undefined" && p_arr_analyze_temp["backtest"][p_strKey][p_subKey]) {
        returnJson.backtest = p_arr_analyze_temp["backtest"][p_strKey][p_subKey];
      } else {
        returnJson.backtest = "N/A";
      }
      if(typeof p_arr_analyze_temp["benchmark"] != "undefined" && p_arr_analyze_temp["benchmark"] && typeof p_arr_analyze_temp["benchmark"][p_strKey] != "undefined" && p_arr_analyze_temp["benchmark"][p_strKey] && typeof p_arr_analyze_temp["benchmark"][p_strKey][p_subKey] != "undefined" && p_arr_analyze_temp["benchmark"][p_strKey][p_subKey]) {
        returnJson.benchmark = p_arr_analyze_temp["benchmark"][p_strKey][p_subKey];
      } else {
        returnJson.benchmark = "N/A";
      }
    } else {
      if(typeof p_arr_analyze_temp["backtest"] != "undefined" && p_arr_analyze_temp["backtest"] && typeof p_arr_analyze_temp["backtest"][p_strKey] != "undefined" && p_arr_analyze_temp["backtest"][p_strKey]) {
        returnJson.backtest = p_arr_analyze_temp["backtest"][p_strKey];
      } else {
        returnJson.backtest = "N/A";
      }
      if(typeof p_arr_analyze_temp["benchmark"] != "undefined" && p_arr_analyze_temp["benchmark"] && typeof p_arr_analyze_temp["benchmark"][p_strKey] != "undefined" && p_arr_analyze_temp["benchmark"][p_strKey]) {
        returnJson.benchmark = p_arr_analyze_temp["benchmark"][p_strKey];
      } else {
        returnJson.benchmark = "N/A";
      }
    }
  }
  return returnJson;
}
/*
 *  시뮬레이션 이력정보로 백테스트 수행결과를 반환한다.
 *  2019-08-14  bkLove(촤병국)
 *  2018-09-10  리밸런싱일별 종목 변경처리, 
 *  2018-10-10  기여도 계산 
 */
var fn_get_simulation_data = function(p_simul_mast /* 시뮬레이션 기본 마스터 정보 */ , p_simul_hist_data /* 일자별 종목 이력 데이터 */ , p_arrRebalanceDate /* 리밸런싱 일자 정보 */ , p_simulPortfolio /* [tm_simul_portfolio] 기준 종목 데이터 */ , p_simulPortfolioList /* 리밸런싱 날짜별 포트 폴리오 */ ) {
  var v_prev_F12506 = ""; /* 이전 입회일자 */
  var v_next_F12506 = ""; /* 이후 입회일자 */
  var v_before_F12506 = ""; /* 직전 입회일자 */
  var v_first_F12506 = ""; /* 최초 입회일자 */
  var v_first_record_yn = "N"; /* 최초 레코드 여부 */
  var v_dailyJongmokObj = {}; /* 일자별 종목 데이터 */
  var v_dailyObj = {}; /* 일자별 결과 정보 */
  var v_arr_daily = []; /* array 일자별 데이터 */
  var v_arr_rebalance = []; /* array rebalance 데이터 */
  var v_rebalanceObj = {};
  var JongmokImportDateList = []; /* 종목별 편입 일자*/
  var v_arr_contribute = []; /* 기여도 계산일자*/
  var v_startDate = "";
  var v_endDate = "";
  var v_before_startDate = "";
  try {
    if(p_simul_hist_data && p_simul_hist_data.length > 0) {
      if(p_simul_hist_data.length > 0) {
        v_first_F12506 = p_simul_hist_data[0].F12506;
        v_prev_F12506 = p_simul_hist_data[0].F12506;
        v_before_F12506 = p_simul_hist_data[0].F12506;
        v_startDate = v_first_F12506;
        v_before_startDate = v_first_F12506;
      }
      var v_prev_jongmok = {};
      var v_jongmok = {};
      var v_daily = {};
      var v_prev_daily = {};
      var v_prev_rebalancing_F12506 = ""; /* 이전 리밸런싱 일자 */
      for(var i = 0; i < p_simul_hist_data.length; i++) {
        v_next_F12506 = "";
        if(!v_dailyJongmokObj[p_simul_hist_data[i].F12506] || Object.keys(v_dailyJongmokObj[p_simul_hist_data[i].F12506]).length == 0) {
          v_dailyJongmokObj[p_simul_hist_data[i].F12506] = {};
        }
        if(!v_dailyObj[p_simul_hist_data[i].F12506] || Object.keys(v_dailyObj[p_simul_hist_data[i].F12506]).length == 0) {
          v_dailyObj[p_simul_hist_data[i].F12506] = {};
        }
        v_dailyJongmokObj[p_simul_hist_data[i].F12506][p_simul_hist_data[i].F16013] = p_simul_hist_data[i];
        /* 입회일자 기준 직전 일자 추출 */
        /* i-1 이 0 보다 큰 경우 - i-1 입회일자 셋팅 */
        if(i - 1 >= 0) {
          v_prev_F12506 = p_simul_hist_data[i - 1].F12506;
        }
        /* 입회일자가 달라지는 경우 */
        if(v_prev_F12506 != p_simul_hist_data[i].F12506) {
          v_before_F12506 = v_prev_F12506;
        }
        /* 입회일자가 바뀌는 경우 */
        /* i+1 이 마지막 인 경우 - i+1 입회일자 셋팅 */
        if(i + 1 <= p_simul_hist_data.length - 1) {
          v_next_F12506 = p_simul_hist_data[i + 1].F12506;
        }
        /* i 가 마지막인 경우 - 마지막 입회일자 셋팅 */
        else if(i == p_simul_hist_data.length - 1) {
          v_next_F12506 = p_simul_hist_data[i].F12506;
        }
        /* 입회일자가 달라지는 경우 */
        if(v_next_F12506 != p_simul_hist_data[i].F12506 || i == p_simul_hist_data.length - 1) {
          /* 리밸런싱 날짜별로 포트 폴리오 변경*/
          var findIndex = _.findIndex(p_arrRebalanceDate, {
            'F12506': p_simul_hist_data[i].F12506
          });
          if(findIndex != -1) {
            /* 리밸런싱 날짜별로 포트 폴리오 변경*/
            p_simulPortfolio = p_simulPortfolioList[p_simul_hist_data[i].F12506];
            /* 기여도 계산 날짜 세팅*/
            v_endDate = v_before_F12506
            if(typeof v_arr_contribute[p_simul_hist_data[i].F12506] == "undefined") {
              /* 초기화 */
              v_arr_contribute[p_simul_hist_data[i].F12506] = {
                'start_date': '',
                /* 기여도 계산 시작일 */ 'before_date': '',
                /* 기여도 계산 직전일 */ 'end_date': '',
                /* 기여도 계산 종료일 */
              }
            }
            if(typeof v_arr_contribute[p_simul_hist_data[p_simul_hist_data.length - 1].F12506] == "undefined") {
              /* 초기화 */
              v_arr_contribute[p_simul_hist_data[p_simul_hist_data.length - 1].F12506] = {
                'start_date': '',
                /* 기여도 계산 시작일 */ 'before_date': '',
                /* 기여도 계산 직전일 */ 'end_date': '',
                /* 기여도 계산 종료일 */
              }
            }
            v_arr_contribute[p_simul_hist_data[i].F12506].start_date = v_startDate; /* 기여도 계산 시작일 */
            v_arr_contribute[p_simul_hist_data[i].F12506].before_date = v_before_startDate; /* 기여도 계산 직전일 */
            if(p_arrRebalanceDate[p_arrRebalanceDate.length - 1].F12506 == p_simul_hist_data[i].F12506) {
              v_arr_contribute[p_simul_hist_data[i].F12506].end_date = v_endDate;
              /* 마지막 리밸런싱일 부터 현재 날짜까지 추가 */
              v_arr_contribute[p_simul_hist_data[p_simul_hist_data.length - 1].F12506].start_date = p_simul_hist_data[i].F12506;
              v_arr_contribute[p_simul_hist_data[p_simul_hist_data.length - 1].F12506].before_date = v_before_F12506; /* 기여도 계산 직전일 */
              v_arr_contribute[p_simul_hist_data[p_simul_hist_data.length - 1].F12506].end_date = p_simul_hist_data[p_simul_hist_data.length - 1].F12506; /* 기여도 계산 종료일 */
            } else {
              v_arr_contribute[p_simul_hist_data[i].F12506].end_date = v_endDate; /* 기여도 계산 종료일 */
            }
            v_startDate = p_simul_hist_data[i].F12506;
            if(i == 0) {
              v_before_startDate = p_simul_hist_data[i].F12506;
            } else {
              v_before_startDate = v_before_F12506;
            }
          }
          /* 비교시가총액 변동 발생 여부 */
          v_dailyObj[p_simul_hist_data[i].F12506].change_yn = "N";
          v_first_record_yn = "N";
          if(v_first_F12506 == p_simul_hist_data[i].F12506) {
            v_first_record_yn = "Y";
          }
          v_jongmok = v_dailyJongmokObj[p_simul_hist_data[i].F12506];
          v_prev_jongmok = v_dailyJongmokObj[v_before_F12506];
          simulModule.fn_set_importDate({
            F12506: p_simul_hist_data[i].F12506 /* 입회일자 */ ,
            first_record_yn: v_first_record_yn /* 최초 레코드 여부 */
          }, p_arrRebalanceDate /* 리밸런싱 일자 */ , v_jongmok /* 현재 종목 */ , p_simulPortfolio /* [tm_simul_portfolio] 기준 종목 데이터 */ , JongmokImportDateList /* 종목별 편입일자*/ );
          /*************************************************************************************************************
           *   일자별로 종목들의 기초 데이터를 설정한다.
           *   -   최초일은 종가 기준으로 계산
           *   -   이후는 기준가 기준으로 계산
           *   -   T 일이 리밸런싱일자 인지 설정
           **************************************************************************************************************/
          simulModule.fn_set_dayilyJongmok({
            rowInx: i /* 일자별 종목 레코드 인덱스 */ ,
            F12506: p_simul_hist_data[i].F12506 /* 입회일자 */ ,
            v_before_F12506: v_before_F12506 /* 직전 영업일 입회일자 */ ,
            first_record_yn: v_first_record_yn /* 최초 레코드 여부 */
          }, p_simul_mast /* 시뮬레이션 기본 마스터 정보 */ , p_arrRebalanceDate /* 리밸런싱 일자 */ , v_jongmok /* 일자별 종목 데이터 */ , v_dailyObj /* 일자별 정보 */ , p_simulPortfolio /* [tm_simul_portfolio] 기준 종목 데이터 */ , JongmokImportDateList /* 종목별 편입일자*/ , v_prev_jongmok /* 전날 종목 데이터 */ );
        }
      }
      /**************************************************/
      if(v_dailyJongmokObj && Object.keys(v_dailyJongmokObj).length > 0) {
        v_prev_jongmok = {};
        v_jongmok = {};
        v_daily = {};
        v_prev_daily = {};
        v_prev_index = 0;
        /* 첫날을 제외한 리밸런싱의 전후 날짜를 설정한다. */
        var prev_rebalance_F12506 = "";
        v_rebalanceObj.chg_jongmok = {}; /* 첫 리밸런싱 종목을 기준으로 변경되는 정보 ( 종목편입 인지 확인 ) */
        for(var i = 0; i < p_arrRebalanceDate.length; i++) {
          if(!v_rebalanceObj[p_arrRebalanceDate[i].F12506] || Object.keys(v_rebalanceObj[p_arrRebalanceDate[i].F12506]).length == 0) {
            v_rebalanceObj[p_arrRebalanceDate[i].F12506] = {};
          }
          v_rebalanceObj[p_arrRebalanceDate[i].F12506].prev_rebalance_F12506 = prev_rebalance_F12506;
          v_rebalanceObj[p_arrRebalanceDate[i].F12506].rebalance_F12506 = p_arrRebalanceDate[i].F12506;
          v_rebalanceObj[p_arrRebalanceDate[i].F12506].org_jongmok = {}; /* 원본 종목정보 */
          v_rebalanceObj[p_arrRebalanceDate[i].F12506].add_jongmok = {}; /* 종목편입 */
          v_rebalanceObj[p_arrRebalanceDate[i].F12506].sub_jongmok = {}; /* 종목편출 */
          v_rebalanceObj[p_arrRebalanceDate[i].F12506].imp_jongmok = {}; /* 비중조절 종목 */
          prev_rebalance_F12506 = p_arrRebalanceDate[i].F12506;
        }
        var v_rebalance_cnt = 0;
        for(var i = 0; i < Object.keys(v_dailyJongmokObj).length; i++) {
          var v_F12506 = Object.keys(v_dailyJongmokObj)[i];
          var v_jongmok = v_dailyJongmokObj[v_F12506];
          var v_prev_jongmok = (typeof v_dailyJongmokObj[Object.keys(v_dailyJongmokObj)[v_prev_index]] == "undefined" ? {} : v_dailyJongmokObj[Object.keys(v_dailyJongmokObj)[v_prev_index]]);
          var v_daily = v_dailyObj[Object.keys(v_dailyObj)[i]];
          var v_prev_daily = (typeof v_dailyObj[Object.keys(v_dailyObj)[v_prev_index]] == "undefined" ? {} : v_dailyObj[Object.keys(v_dailyObj)[v_prev_index]]);
          v_first_record_yn = "N";
          if(i == 0) {
            v_first_record_yn = "Y";
          }
          /* 리밸런싱 날짜별로 포트 폴리오 변경*/
          var findIndex = _.findIndex(p_arrRebalanceDate, {
            'F12506': v_F12506
          });
          if(findIndex != -1) {
            p_simulPortfolio = p_simulPortfolioList[v_F12506];
          }
          try {
            if(v_daily.rebalancing == "1") {
              v_prev_rebalancing_F12506 = v_F12506;
            }
            var v_change_yn = "N";
            if(v_first_record_yn == "Y") {
              // 시작 포트 폴리오 
              p_simulPortfolio = p_simulPortfolioList[p_arrRebalanceDate[0].F12506];
              simulModule.fn_set_today_rate({
                F12506: v_F12506 /* 입회일자 */ ,
                v_before_F12506: v_before_F12506,
                v_first_F12506: v_first_F12506,
                first_record_yn: v_first_record_yn /* 최초 레코드 여부 */ ,
                case_gubun: "case1",
                v_change_yn: "N",
                p_prev_rebalancing_F12506: v_prev_rebalancing_F12506
              }, p_simul_mast /* 시뮬레이션 기본 마스터 정보 */ , p_simulPortfolio /* [tm_simul_portfolio] 기준 종목 데이터 */ , v_jongmok /* 현재 종목 */ , v_prev_jongmok /* 이전 종목 */ , v_daily /* 현재 daily */ , v_prev_daily /* 이전 daily */ , v_rebalanceObj);
              /*  리밸런싱인 경우 종목별 지수적용비율을 재산정 */
              if(v_daily.rebalancing == "1") {
                fn_set_rebalanceDate_history(v_rebalance_cnt, v_F12506, v_rebalanceObj, v_jongmok, v_prev_jongmok, v_key, JongmokImportDateList, p_simulPortfolio);
                v_rebalance_cnt++;
              }
            } else {
              /*  리밸런싱인 경우 종목별 지수적용비율을 재산정 */
              if(v_daily.rebalancing == "1") {
                simulModule.fn_set_today_rate({
                  F12506: v_F12506 /* 입회일자 */ ,
                  v_before_F12506: v_before_F12506,
                  v_first_F12506: v_first_F12506,
                  first_record_yn: v_first_record_yn /* 최초 레코드 여부 */ ,
                  case_gubun: "case2",
                  v_change_yn: "N",
                  p_prev_rebalancing_F12506: v_prev_rebalancing_F12506
                }, p_simul_mast /* 시뮬레이션 기본 마스터 정보 */ , p_simulPortfolio /* [tm_simul_portfolio] 기준 종목 데이터 */ , v_jongmok /* 현재 종목 */ , v_prev_jongmok /* 이전 종목 */ , v_daily /* 현재 daily */ , v_prev_daily /* 이전 daily */ , v_rebalanceObj);
                fn_set_rebalanceDate_history(v_rebalance_cnt, v_F12506, v_rebalanceObj, v_jongmok, v_prev_jongmok, v_key, JongmokImportDateList, p_simulPortfolio);
                v_rebalance_cnt++;
              } else {
                /* 이벤트 변동여부 체크 */
                v_change_yn = simulModule.fn_get_event_check({
                  F12506: v_F12506 /* 입회일자 */ ,
                  v_before_F12506: v_before_F12506,
                  first_record_yn: v_first_record_yn /* 최초 레코드 여부 */
                }, p_simul_mast /* 시뮬레이션 기본 마스터 정보 */ , p_simulPortfolio /* [tm_simul_portfolio] 기준 종목 데이터 */ , v_jongmok /* 현재 종목 */ , v_prev_jongmok /* 이전 종목 */ , v_daily /* 현재 daily */ , v_prev_daily /* 이전 daily */ );
                simulModule.fn_set_today_rate({
                  F12506: v_F12506 /* 입회일자 */ ,
                  v_before_F12506: v_before_F12506,
                  v_first_F12506: v_first_F12506,
                  first_record_yn: v_first_record_yn /* 최초 레코드 여부 */ ,
                  case_gubun: "case3",
                  v_change_yn: v_change_yn,
                  p_prev_rebalancing_F12506: v_prev_rebalancing_F12506
                }, p_simul_mast /* 시뮬레이션 기본 마스터 정보 */ , p_simulPortfolio /* [tm_simul_portfolio] 기준 종목 데이터 */ , v_jongmok /* 현재 종목 */ , v_prev_jongmok /* 이전 종목 */ , v_daily /* 현재 daily */ , v_prev_daily /* 이전 daily */ , v_rebalanceObj);
              }
            }
          } catch (e) {
            log.debug("error ", e);
          }
          v_arr_daily.push(v_daily);
          if(i > 0) {
            v_prev_index = i;
          }
        }
        /* 기여도 계산*/
        try {
          v_arr_contribute.forEach(function(contributeItem) {
            contributeItem.jongmok = v_dailyJongmokObj[contributeItem.start_date];
            let start_dailyObj = _.find(v_arr_daily, ['F12506', contributeItem.before_date]);
            let end_dailyObj = _.find(v_arr_daily, ['F12506', contributeItem.end_date]);
            let startIndex = start_dailyObj.INDEX_RATE;
            let endIndex = end_dailyObj.INDEX_RATE;
            for(var jongmokIndex = 0; jongmokIndex < Object.keys(contributeItem.jongmok).length; jongmokIndex++) {
              var jongmokKey = Object.keys(contributeItem.jongmok)[jongmokIndex];
              contributeItem.jongmok[jongmokKey].START_WEIGHT = v_dailyJongmokObj[contributeItem.start_date][jongmokKey].AFTER_IMPORTANCE;
              contributeItem.jongmok[jongmokKey].END_WEIGHT = v_dailyJongmokObj[contributeItem.end_date][jongmokKey].TODAY_IMPORTANCE;
              /*기여율 = (종료일지수값 * 종료일비중 - 시작일직전일지수값 * 시작일비중) / 시작일직전일지수값 * 100
              * 시작일직전일지수값 
              - 지수첫산출일은 직전일지수값이 없으므로 시작일지수값을사용
              - 다음 리밸런싱회차부터는 시작일 직전일의 지수값을 사용*/
              contributeItem.jongmok[jongmokKey].CONTRIBUTE_RATE = ((endIndex * contributeItem.jongmok[jongmokKey].END_WEIGHT) - (startIndex * contributeItem.jongmok[jongmokKey].START_WEIGHT)) / startIndex * 100;
            };
          });
        } catch (e) {
          log.debug("error", e);
        }
        var not_jongmok = []; /* 종목편입되지 않는 종목 */
        try {
          for(var j = 0; j < Object.keys(v_rebalanceObj).length; j++) {
            var v_key = Object.keys(v_rebalanceObj)[j];
            var v_item = v_rebalanceObj[v_key];
            if(v_key != "chg_jongmok") {
              /* 종목편입 종목 */
              if(typeof v_item.add_jongmok != "undefined" && Object.keys(v_item.add_jongmok).length > 0) {
                /* 종목편입 되지 않은 종목 = 원래종목 - 추가로 편입된 종목 */
                not_jongmok = Object.keys(v_item.org_jongmok).filter(x => !Object.keys(v_item.add_jongmok).includes(x));
                not_jongmok = not_jongmok.filter(x => !Object.keys(v_item.add_jongmok).includes(x));
                for(var k = 0; k < Object.keys(v_item.add_jongmok).length; k++) {
                  var v_sub_key = Object.keys(v_item.add_jongmok)[k];
                  var v_sub_item = v_item.add_jongmok[v_sub_key];
                  v_sub_item.EVENT_FLAG = "20";
                  v_sub_item.rebalance_import_yn = "1";
                }
                v_arr_rebalance.push(v_item.add_jongmok);
              }
              /* 종목편출 종목 */
              if(typeof v_item.sub_jongmok != "undefined" && Object.keys(v_item.sub_jongmok).length > 0) {
                for(var k = 0; k < Object.keys(v_item.sub_jongmok).length; k++) {
                  var v_sub_key = Object.keys(v_item.sub_jongmok)[k];
                  var v_sub_item = v_item.sub_jongmok[v_sub_key];
                  v_sub_item.EVENT_FLAG = "30";
                  v_sub_item.rebalance_import_yn = "1";
                }
                v_arr_rebalance.push(v_item.sub_jongmok);
              }
              /* 비중조절 종목 */
              if(typeof v_item.imp_jongmok != "undefined" && Object.keys(v_item.imp_jongmok).length > 0) {
                /* 종목편입 되지 않은 종목 = ( 원래종목 - 추가로 편입된 종목 ) - 비중조절 종목 */
                not_jongmok = not_jongmok.filter(x => !Object.keys(v_item.imp_jongmok).includes(x));
                /* 비중조절인 경우 종목으로 편입되어 있는지 체크여부 는 "1" 로 설정 */
                for(var k = 0; k < Object.keys(v_item.imp_jongmok).length; k++) {
                  var v_imp_key = Object.keys(v_item.imp_jongmok)[k];
                  v_item.imp_jongmok[v_imp_key].rebalance_import_yn = "1";
                }
                if(typeof v_item.add_jongmok != "undefined" && Object.keys(v_item.add_jongmok).length > 0) {
                  for(var k = Object.keys(v_item.imp_jongmok).length - 1; k >= 0; k--) {
                    var v_imp_key = Object.keys(v_item.imp_jongmok)[k];
                    if(typeof v_item.add_jongmok[v_imp_key] != "undefined") {
                      delete v_item.imp_jongmok[v_imp_key];
                    }
                  }
                }
                if(Object.keys(v_item.imp_jongmok).length > 0) {
                  v_arr_rebalance.push(v_item.imp_jongmok);
                }
              }
              /* 종목편입 되지 않은 종목 */
              // if( not_jongmok && not_jongmok.length > 0 ) {
              //     var not_jongmok_obj =   {};
              //     for( var k=0; k < not_jongmok.length; k++ ) {
              //         var   v_key   =   not_jongmok[k];
              //         if( typeof v_item.org_jongmok[ v_key ] != "undefined" ) {
              //             if( j==0 ) {
              //                 v_item.org_jongmok[ v_key ].BEFORE_IMPORTANCE   =   "-1";
              //             }
              //             not_jongmok_obj[ v_key ]    =   v_item.org_jongmok[ v_key ];
              //             not_jongmok_obj[ v_key ].rebalance_import_yn    =   "0";
              //         }
              //     }
              //     if( Object.keys( not_jongmok_obj ).length > 0 ) {
              //         v_arr_rebalance.push( not_jongmok_obj );
              //     }
              // }                            
            }
          }
        } catch (e) {
          log.debug("error", e);
        }
      }
    }
  } catch (e) {
    log.debug("fn_get_simulation_data error", e);
  }
  return {
    dailyJongmokObj: v_dailyJongmokObj,
    dailyObj: v_dailyObj,
    arr_daily: v_arr_daily,
    arr_rebalance: v_arr_rebalance,
    arr_contribute: v_arr_contribute
  };
};
/*
 * 포트폴리오에 해당 하는 종목만 걸러낸다.
 * 2019-09-09  daeguk
 */
var fn_history_filter = function(temp_kspjong_hist /*DB에서 조회된 종목별 히스토리*/ , v_simulPortfolio /* 시작일 포트롤리오 */ , v_simulPortfolioList /* 리밸런싱일별 포트 폴리오*/ , v_arrRebalanceDate /* 리밸런싱 일자 정보 */ ) {
  var kspjong_hist = [];
  let simulPortfolio = v_simulPortfolio;
  temp_kspjong_hist.forEach(function(kspjong_item) {
    kspjong_item.rebalancing = "0";
    var v_rebalancing = _.filter(v_arrRebalanceDate, {
      'F12506': kspjong_item.F12506
    });
    if(v_rebalancing && v_rebalancing.length > 0) {
      kspjong_item.rebalancing = "1";
    }
    if(kspjong_item.rebalancing == 1) {
      simulPortfolio = v_simulPortfolioList[kspjong_item.F12506];
    }
    for(var i = 0; i < Object.keys(simulPortfolio).length; i++) {
      var F16013 = Object.keys(simulPortfolio)[i];
      if(kspjong_item.F16013 == F16013) {
        kspjong_hist.push(kspjong_item);
      }
    }
  });
  return kspjong_hist;
}
/* 리밸런싱 날짜별 종목 편입 편출 여부 체크
   2019-09-16 daeguk
*/
var fn_set_rebalanceDate_history = function(v_rebalance_cnt /* 리밸런싱 횟수 */ , v_F12506 /* 현재날짜*/ , v_rebalanceObj /* 리밸런싱 정보 */ , v_jongmok /* 현재종목 */ , v_prev_jongmok /* 이전종목*/ , v_key /* 종목키*/ , JongmokImportDateList /* 종목별 투입 일자 리스트 */ , p_simulPortfolio /* 포트폴리오 */ ) {
  var v_rebalanceDate = v_rebalanceObj[v_F12506];
  var v_jongmok_temp = Object.assign({}, v_jongmok);
  var v_prev_jongmok_temp = Object.assign({}, v_prev_jongmok);
  /* 첫 리밸런싱인 경우 */
  if(v_rebalance_cnt == 0) {
    /* 현재 종목기준으로 검색 */
    for(var j = 0; j < Object.keys(v_jongmok_temp).length; j++) {
      var v_key = Object.keys(v_jongmok_temp)[j];
      var v_tempItem = Object.assign({}, v_jongmok_temp[v_key]);
      if(v_key != "KRW" && JongmokImportDateList[v_key].IMPORT_YN == "1" && Number(JongmokImportDateList[v_key].startDate) <= Number(v_F12506)) {
        /* 리밸런싱 변경 정보에 값이 없는 경우 - 종목편입 */
        if(!v_rebalanceObj.chg_jongmok[v_key] || typeof v_rebalanceObj.chg_jongmok[v_key] == "undefined") {
          v_tempItem.BEFORE_IMPORTANCE = "-1";
          v_rebalanceObj.chg_jongmok[v_key] = v_tempItem; /* 리밸런싱 변경정보 */
          v_rebalanceDate.add_jongmok[v_key] = v_tempItem; /* 리밸런싱별 종목정보 */
        }
      }
    }
    /* 포트폴리오 종목의 갯수와 다른 경우 KRW 편입 */
    if(Object.keys(v_rebalanceObj.chg_jongmok).length > 0) {
      if(Object.keys(v_rebalanceObj.chg_jongmok).length != Object.keys(p_simulPortfolio).length) {
        if(v_jongmok_temp["KRW"] && typeof v_jongmok_temp["KRW"] != "undefined") {
          v_jongmok_temp["KRW"].BEFORE_IMPORTANCE = "-1";
          v_rebalanceObj.chg_jongmok["KRW"] = v_jongmok_temp["KRW"];
          v_rebalanceDate.add_jongmok["KRW"] = v_jongmok_temp["KRW"];
        }
      }
    }
  } else {
    /* 현재 종목기준으로 검색 */
    for(var j = 0; j < Object.keys(v_jongmok_temp).length; j++) {
      var v_key = Object.keys(v_jongmok_temp)[j];
      var v_tempItem = Object.assign({}, v_jongmok_temp[v_key]);
      if(v_key != "KRW" && JongmokImportDateList[v_key].IMPORT_YN == "1" && Number(JongmokImportDateList[v_key].startDate) <= Number(v_F12506)) {
        /* 리밸런싱 변경 정보에 값이 없는 경우 - 종목편입 */
        if(!v_rebalanceObj.chg_jongmok[v_key] || typeof v_rebalanceObj.chg_jongmok[v_key] == "undefined") {
          //                                                    v_tempItem.BEFORE_IMPORTANCE =   "-1";
          v_rebalanceObj.chg_jongmok[v_key] = v_tempItem; /* 리밸런싱 변경정보 */
          v_rebalanceDate.add_jongmok[v_key] = v_tempItem; /* 리밸런싱별 종목정보 */
        }
      }
    }
    /* 포트폴리오 종목의 갯수와 다른 경우 KRW 편입 */
    if(Object.keys(v_rebalanceObj.chg_jongmok).length > 0) {
      /* 리밸런싱 변경정보에 KRW 가 존재하지 않는 경우 KRW 편입 */
      if(!v_rebalanceObj.chg_jongmok["KRW"] || typeof v_rebalanceObj.chg_jongmok["KRW"] == "undefined") {
        if(Object.keys(v_rebalanceObj.chg_jongmok).length != Object.keys(p_simulPortfolio).length) {
          if(v_jongmok_temp["KRW"] && typeof v_jongmok_temp["KRW"] != "undefined") {
            //                                    v_jongmok_temp[ "KRW" ].BEFORE_IMPORTANCE =   "-1";
            v_rebalanceObj.chg_jongmok["KRW"] = v_jongmok_temp["KRW"];
            v_rebalanceDate.add_jongmok["KRW"] = v_jongmok_temp["KRW"];
          }
        }
      }
    }
    /* 리밸런싱 변경정보 기준으로 검색 */
    for(var j = Object.keys(v_rebalanceObj.chg_jongmok).length - 1; j >= 0; j--) {
      var v_key = Object.keys(v_rebalanceObj.chg_jongmok)[j];
      var v_tempItem = Object.assign({}, v_rebalanceObj.chg_jongmok[v_key]);
      /* 리밸런싱 변경 정보에는 존재하나 현재종목에는 존재하지 않는 경우 종목편출 */
      if(!v_jongmok_temp[v_key] || typeof v_jongmok_temp[v_key] == "undefined") {
        v_tempItem.F12506 = v_F12506; /* 일자를 삭제하는 일자로 수정 */
        if(!v_prev_jongmok_temp[v_key] || typeof v_prev_jongmok_temp[v_key] == "undefined") {
          //                                                    v_tempItem.BEFORE_IMPORTANCE        =   "-1";
        } else {
          v_tempItem.BEFORE_IMPORTANCE = v_prev_jongmok_temp[v_key].BEFORE_IMPORTANCE;
        }
        v_tempItem.AFTER_IMPORTANCE = "0";
        v_rebalanceDate.sub_jongmok[v_key] = v_tempItem;
        delete v_rebalanceObj.chg_jongmok[v_key];
      }
    }
  }
}
module.exports.runBacktest = runBacktest;
module.exports.saveBacktestResult = saveBacktestResult;
module.exports.getBacktestResult = getBacktestResult;
module.exports.getSimulJongmoForExcel = getSimulJongmoForExcel;
module.exports.getSimulResultSaveYn = getSimulResultSaveYn;
module.exports.getAnalyze_timeseries = getAnalyze_timeseries;
module.exports.fnSaveTmSimulResultAnal = fnSaveTmSimulResultAnal;
module.exports.fn_set_balance = fn_set_balance;
module.exports.fn_set_sub_bench_mark = fn_set_sub_bench_mark;
module.exports.getSimulTimeSeriesExcel = getSimulTimeSeriesExcel;