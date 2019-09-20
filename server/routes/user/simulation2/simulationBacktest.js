/*
 *  시뮬레이션 관련 정보
 *
 *  @date 2019-07-26
 *  @author bkLove
 *  수정일 2018-09-06  daeguk  
 *  -수정내용: 리밸런싱일별로 포트 폴리오 입력시 처리 과정 추가 및 오류 수정
 */

var config = require('../../../config/config');
var Promise = require("bluebird");


// var multer = require('multer');
// var xlsx = require('xlsx');
var async = require('async');
var _ = require("lodash");

var simulModule = require('./simulModule');
var simulAnalyze = require('../simulation/analyzeTimeserise');


var log = config.logger;

var limit = {
        divide_size         :   100
    ,   result_dive_size    :   5
};

var initGrpInfo         =   {
        INIT_GRP_CD         :   "*"                             /* 그룹코드 최초값 */
    ,   INIT_INCRE_GRP_CD   :   100000                          /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
};



/*
 * 백테스트를 수행한다.
 * 2019-05-20  bkLove(촤병국)
 */
var runBacktest = async function(req, res, paramData) {

    return await new Promise(function(resolve, reject) {

        try {
            log.debug('simulationBacktest.runBacktest 호출됨.');

            var pool = req.app.get("pool");
            var mapper = req.app.get("mapper");
            var resultMsg = {};


            var format = { language: 'sql', indent: '' };
            var stmt = "";


            var v_resultSimulData           =   {};

            resultMsg.arr_daily             =   [];
            resultMsg.arr_rebalance         =   [];
            resultMsg.simul_mast            =   {};
            resultMsg.analyzeList           =   [];
            resultMsg.jsonFileName          =   "";
            resultMsg.inputData             =   [];        

            Promise.using(pool.connect(), conn => {

                async.waterfall([

                    /* 1 저장시 입력했던 정보로 백테스트 기본정보를 조회한다. */
                    function(callback) {

                        try{
                            var msg = {};

                            stmt = mapper.getStatement('simulationBacktest2', 'getSimulListByBacktest2', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }


                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }


                                var v_simul_mast                            =   {};
                                var v_simulPortfolio                        =   rows;
                                for( var i in rows ) {
                                    //v_simulPortfolio[ rows[i].F16013 ]      =   rows[i];

                                    /* 마스터 정보 설정 */
                                    if( i == 0 ) {

                                        v_simul_mast.grp_cd                 =   rows[0].grp_cd;                 /* 그룹코드(상위코드) */
                                        v_simul_mast.scen_cd                =   rows[0].scen_cd;                /* 시나리오 코드 */

                                        v_simul_mast.start_year             =   rows[0].start_year;             /* 시작년도 */
                                        v_simul_mast.rebalance_cycle_cd     =   rows[0].rebalance_cycle_cd;     /* 리밸런싱주기 (COM006) */
                                        v_simul_mast.rebalance_date_cd      =   rows[0].rebalance_date_cd;      /* 리밸런싱일자 (COM007) */
                                        v_simul_mast.init_invest_money      =   rows[0].init_invest_money;      /* 초기투자금액 */
                                        v_simul_mast.bench_mark_cd          =   rows[0].bench_mark_cd;          /* 벤치마크 (COM008) */
                                        v_simul_mast.bench_index_cd01       =   rows[0].bench_index_cd01;       /* 벤치마크 인덱스 코드 ( F16013 ) */
                                        v_simul_mast.bench_index_cd02       =   rows[0].bench_index_cd02;       /* 벤치마크 인덱스 코드 ( large_type ) */
                                        v_simul_mast.bench_index_cd03       =   rows[0].bench_index_cd03;       /* 벤치마크 인덱스 코드 ( middle_type ) */
                                        v_simul_mast.bench_index_nm         =   rows[0].bench_index_nm;         /* 벤치마크 인덱스 코드명 */                                        
                                        v_simul_mast.importance_method_cd   =   rows[0].importance_method_cd;   /* 비중설정방식 (COM009) */
                                    }
                                }                                

                                msg.v_simul_mast        =   v_simul_mast;
                                msg.v_simulPortfolio    =   v_simulPortfolio;

                                callback( null, msg );
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

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }

                            stmt = mapper.getStatement('simulationBacktest2', 'getRebalanceDateByScenCd', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }


                                if ( !rows || rows.length == 0 ) {
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
                                        
                                        if (index == 0) firstRebalenceDate = item.F12506;
                                        var simulPortfolio = _.filter(msg.v_simulPortfolio, {'rebalance_date': item.F12506});
                                        var simulPortfolioObj = [];

                                        simulPortfolio.forEach(function(portfolio) {
                                            simulPortfolioObj[ portfolio.F16013 ] = portfolio;
                                        });

                                        v_simulPortfolioList[item.F12506] = simulPortfolioObj;
                                    });
                                }

                                msg.v_arrRebalanceDate  =   rows;
                                msg.v_simulPortfolioList =  v_simulPortfolioList;
                                msg.v_simulPortfolio = v_simulPortfolioList[firstRebalenceDate]; // 첫 리밸런싱 까지 포트 폴리오로 사용
                                msg.firstRebalenceDate = firstRebalenceDate; // 첫리밸런싱 일자
                                callback( null, msg );
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
                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }

                            stmt = mapper.getStatement('simulationBacktest2', 'getSimulHistListByScenCd3', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0  ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                } else {
                                    paramData.first_date = rows[0].F12506;
                                    temp_kspjong_hist = rows;
                                    

                                    kspjong_hist = fn_history_filter(
                                        temp_kspjong_hist /*DB에서 조회된 종목별 히스토리*/
                                        , msg.v_simulPortfolio  /* 시작일 포트롤리오 */
                                        , msg.v_simulPortfolioList /* 리밸런싱일별 포트 폴리오*/    
                                    );
                    
                                }

                            /*************************************************************************************************************
                            *   시뮬레이션 이력정보로 백테스트 수행결과를 반환한다.
                            **************************************************************************************************************/

                                v_resultSimulData   =   fn_get_simulation_data(
                                        msg.v_simul_mast        /* 시뮬레이션 기본 마스터 정보 */
                                    ,   kspjong_hist                    /* 일자별 종목 이력 데이터 */
                                    ,   msg.v_arrRebalanceDate  /* 리밸런싱 일자 정보 */
                                    ,   msg.v_simulPortfolio    /* [tm_simul_portfolio] 기준 종목 데이터 */
                                    ,   msg.v_simulPortfolioList /*리밸런싱 날짜별 포트 폴리오*/
                                );

                                delete msg.v_simul_mast;
                                delete msg.v_arrRebalanceDate;
                                delete msg.v_simulPortfolio;
                                delete msg.v_simulPortfolioList;

                                callback( null, msg );
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            resultMsg.dailyJongmokObj   =   {};
                            resultMsg.dailyObj          =   {};

                            callback(resultMsg);
                        }
                    },

                    /* 4. td_kspjong_hist 테이블 기준 td_index_hist 테이블에서 bench_mark 와 일치하는 정보를 조회한다.*/
                    function(msg, callback) {

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }                            

                            

                            stmt = mapper.getStatement('simulationBacktest2', 'getSimulBenchMark', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( rows || rows.length > 0 ) {
                                    /* 일자별 지수에 밴치마크 정보를 설정한다. */
                                    fn_set_bench_mark( v_resultSimulData.arr_daily, rows );
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

                    /* 5. 파이선을 통해 분석정보를 가져온다.*/
                    function(msg, callback) {

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }                            

                            /* 파이선을 통해 분석정보를 가져온다. */
                            if( v_resultSimulData.arr_daily && v_resultSimulData.arr_daily.length > 0 ) {

                                log.debug( "분석정보 #1 조회 from 파이선 START");
                                simulAnalyze.getAnalyze_timeseries(v_resultSimulData.arr_daily, paramData.bench_mark_cd).then( function(e) {
                                    if( e && e.result ) {
                                        if( e.results && e.results.length > 0 ) {
                                            resultMsg.analyzeList   =   e.results;
                                            resultMsg.jsonFileName  =   e.jsonFileName;
                                            resultMsg.inputData  =   e.inputData;                                            
                                        }
                                        callback(null);
                                    }else{

                                        stmt    =   "";
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = "[error] simulAnalyze.getAnalyze_timeseries 파이선 호출중 오류가 발생되었습니다.";

                                        return callback(null);

                                    }
                                });
                                log.debug( "분석정보 #1 조회 from 파이선 END");

                            }else{
                                callback(null);
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(null);
                        }
                    },                    

                ], function(err) {

                    if (err) {
                        log.debug(err, stmt, paramData);

                    } else {

                        resultMsg.result        =   true;

                        resultMsg.simul_mast        =   { 
                                grp_cd                  :   paramData.grp_cd                /* 그룹코드(상위코드) */
                            ,   scen_cd                 :   paramData.scen_cd               /* 시나리오 코드 */

                            ,   scen_name               :   paramData.scen_name             /* 시나리오명 */
                            ,   start_year              :   paramData.start_year            /* 시작년도 */
                            ,   rebalance_cycle_cd      :   paramData.rebalance_cycle_cd    /* 리밸런싱주기 (COM006) */
                            ,   rebalance_date_cd       :   paramData.rebalance_date_cd     /* 리밸런싱일자 (COM007) */
                            ,   init_invest_money       :   paramData.init_invest_money     /* 초기투자금액 */
                            ,   bench_mark_cd           :   paramData.bench_mark_cd         /* 벤치마크 (COM008) */
                            ,   bench_index_cd01        :   paramData.bench_index_cd01      /* 벤치마크 인덱스 코드 ( F16013 ) */
                            ,   bench_index_cd02        :   paramData.bench_index_cd02      /* 벤치마크 인덱스 코드 ( large_type ) */
                            ,   bench_index_cd03        :   paramData.bench_index_cd03      /* 벤치마크 인덱스 코드 ( middle_type ) */
                            ,   bench_index_nm          :   paramData.bench_index_nm        /* 벤치마크 인덱스 코드명 */
                            ,   importance_method_cd    :   paramData.importance_method_cd  /* 비중설정방식 (COM009) */
                        };

                        /* 일자별 지수에 balance 정보를 설정한다. */
                        fn_set_balance( v_resultSimulData.arr_daily, resultMsg.simul_mast );

                        resultMsg.arr_daily         =   [ ...v_resultSimulData.arr_daily];
                        resultMsg.arr_rebalance     =   [ ...v_resultSimulData.arr_rebalance];

                        resultMsg.err           =   null;

                        resolve( { 
                                result : true
                            ,   resultMsg : resultMsg 
                        });                        

                    }

                });
            });


        } catch (expetion) {

            log.debug(expetion, paramData);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = expetion;

            resultMsg.arr_daily             =   [];
            resultMsg.arr_rebalance         =   [];
            resultMsg.simul_mast            =   {};
            resultMsg.analyzeList           =   [];
            resultMsg.jsonFileName          =   "";
            resultMsg.inputData             =   [];

            resolve( { 
                    result : false
                ,   resultMsg : resultMsg 
            });
        }

    }).catch( function(expetion){

        log.debug(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.arr_daily             =   [];
        resultMsg.arr_rebalance         =   [];
        resultMsg.simul_mast            =   {};
        resultMsg.analyzeList           =   [];
        resultMsg.jsonFileName          =   "";
        resultMsg.inputData             =   [];

        resolve( { 
                result : false
            ,   resultMsg : resultMsg 
        });
    });
}




/*************************************************************************************************************
*   백테스트 결과 저장
**************************************************************************************************************/


/*
 * 백테스트 결과를 저장한다.
 * 2019-08-14  bkLove(촤병국)
 */
var saveBacktestResult2 = function(req, res) {
    try {
        log.debug('simulationBacktest.saveBacktestResult2 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationBacktest.saveBacktestResult2  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        var v_resultSimulData           =   {};

        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return log.error(txerr);
                }            

                async.waterfall([

                    /* 1. (백테스트) 시뮬레이션 할 기본정보를 조회한다. */
                    function(callback) {

                        try{                           

                            if(  !paramData.grp_cd || !paramData.scen_cd  ) {
                                resultMsg.result = false;
                                resultMsg.msg = "[백테스트] 기본 인자값 정보가 존재하지 않습니다.";
                                resultMsg.err = "[백테스트] 기본 인자값 정보가 존재하지 않습니다.";

                                callback(resultMsg);
                            }
                            else{

                                var msg = {};

                                stmt = mapper.getStatement('simulationBacktest2', 'getSimulListByBacktest2', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( !rows || rows.length == 0 || !rows[0].start_year ) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";
                                        resultMsg.err = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";

                                        return callback(resultMsg);
                                    }else{
                                        paramData.start_year    =   rows[0].start_year;     /* 시작년도 */
                                    }


                                    var v_simul_mast                            =   {};
                                    var v_simulPortfolio                        =   rows;
									for( var i in rows ) {
										//v_simulPortfolio[ rows[i].F16013 ]    =   rows[i];

                                        /* 마스터 정보 설정 */
                                        if( i == 0 ) {
                                            v_simul_mast.grp_cd                 =   rows[0].grp_cd;                 /* 그룹코드(상위코드) */
                                            v_simul_mast.scen_cd                =   rows[0].scen_cd;                /* 시나리오 코드 */

                                            v_simul_mast.start_year             =   rows[0].start_year;             /* 시작년도 */
                                            v_simul_mast.rebalance_cycle_cd     =   rows[0].rebalance_cycle_cd;     /* 리밸런싱주기 (COM006) */
                                            v_simul_mast.rebalance_date_cd      =   rows[0].rebalance_date_cd;      /* 리밸런싱일자 (COM007) */
                                            v_simul_mast.init_invest_money      =   rows[0].init_invest_money;      /* 초기투자금액 */
                                            v_simul_mast.bench_mark_cd          =   rows[0].bench_mark_cd;          /* 벤치마크 (COM008) */
                                            v_simul_mast.bench_index_cd01       =   rows[0].bench_index_cd01;       /* 벤치마크 인덱스 코드 ( F16013 ) */
                                            v_simul_mast.bench_index_cd02       =   rows[0].bench_index_cd02;       /* 벤치마크 인덱스 코드 ( large_type ) */
                                            v_simul_mast.bench_index_cd03       =   rows[0].bench_index_cd03;       /* 벤치마크 인덱스 코드 ( middle_type ) */
                                            v_simul_mast.bench_index_nm         =   rows[0].bench_index_nm;         /* 벤치마크 인덱스 코드명 */
                                            v_simul_mast.importance_method_cd   =   rows[0].importance_method_cd;   /* 비중설정방식 (COM009) */

                                            v_simul_mast.serial_no              =   rows[0].serial_no               /* 변경 순번 */
                                        }                             
									}

                                    if( v_simul_mast ) {

                                        paramData.serial_no     =   v_simul_mast.serial_no;                         /* 변경 순번 */

                                        log.debug( "#######################################################################################################" );
                                        log.debug( "simul_mast  serial_no", paramData.serial_no );
                                        log.debug( "#######################################################################################################" );
                                    }

                                    msg.v_simul_mast            =   v_simul_mast;
                                    msg.v_simulPortfolio        =   v_simulPortfolio;

                                    callback( null, msg );
                                });
                            }
                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 2. scen_cd 에 존재하는 리밸런싱 일자를 조회한다. */
                    function(msg, callback) {

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }

                            stmt = mapper.getStatement('simulationBacktest2', 'getRebalanceDateByScenCd', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }


                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
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
                                       
                                       if (index == 0) firstRebalenceDate = item.F12506;
                                       var simulPortfolio = _.filter(msg.v_simulPortfolio, {'rebalance_date': item.F12506});
                                       var simulPortfolioObj = [];

                                       simulPortfolio.forEach(function(portfolio) {
                                           simulPortfolioObj[ portfolio.F16013 ] = portfolio;
                                       });

                                       v_simulPortfolioList[item.F12506] = simulPortfolioObj;
                                   });
                               }

                                msg.v_arrRebalanceDate      =   rows;
                                msg.v_simulPortfolioList    =   v_simulPortfolioList;
                                msg.v_simulPortfolio        =   v_simulPortfolioList[firstRebalenceDate];   //  첫 리밸런싱 까지 포트 폴리오로 사용
                                msg.firstRebalenceDate      =   firstRebalenceDate;                         //  첫리밸런싱 일자

                                callback( null, msg );
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 3. 입력할 값을 기준으로 tm_simul_result_mast 와 비교하여 insert, modify 대상 추출 */
                    function(msg, callback) {

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }

                            stmt = mapper.getStatement('simulationBacktest2', 'getTmSimulResultMastCheck', paramData, { language: 'sql', indent: '  ' });
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length == 1) {

                                    msg.simul_result_mast_status    =   rows[0].dtl_status
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

                    /* 4. [tm_simul_result_mast] 테이블에 등록 또는 수정한다. */
                    function(msg, callback) {

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }

                            if( msg.simul_result_mast_status ) {

                                var queryId     =   "";

                                if( msg.simul_result_mast_status == "insert" ) {
                                    queryId     =   "saveTmSimulResultMast";
                                }else if( msg.simul_result_mast_status == "modify" ) {
                                    queryId     =   "modifyTmSimulResultMast";
                                }

                                stmt = mapper.getStatement('simulationBacktest2', queryId, paramData, { language: 'sql', indent: '  ' });
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    callback(null, msg);
                                });

                            }else{
                                callback(null, msg);
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 5. scen_cd 에 존재하면서 start_year 기준 이력 데이터를 조회한다. */
                    function(msg, callback) {
                        var temp_kspjong_hist = [];
                        var kspjong_hist = [];
                        try{
                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }
                            
                            stmt = mapper.getStatement('simulationBacktest2', 'getSimulHistListByScenCd3', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0  ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                } else {
                                    paramData.first_date = rows[0].F12506;
                                    temp_kspjong_hist = rows;
                                    

                                    kspjong_hist = fn_history_filter(
                                        temp_kspjong_hist /*DB에서 조회된 종목별 히스토리*/
                                        , msg.v_simulPortfolio  /* 시작일 포트롤리오 */
                                        , msg.v_simulPortfolioList /* 리밸런싱일별 포트 폴리오*/    
                                    );
                                }                           


                            /*************************************************************************************************************
                            *   시뮬레이션 이력정보로 백테스트 수행결과를 반환한다.
                            **************************************************************************************************************/
                                v_resultSimulData   =   fn_get_simulation_data(
                                        msg.v_simul_mast        /* 시뮬레이션 기본 마스터 정보 */
                                    ,   kspjong_hist                    /* 일자별 종목 이력 데이터 */
                                    ,   msg.v_arrRebalanceDate  /* 리밸런싱 일자 정보 */
                                    ,   msg.v_simulPortfolio    /* [tm_simul_portfolio] 기준 종목 데이터 */
                                    ,   msg.v_simulPortfolioList /*리밸런싱 날짜별 포트 폴리오*/
                                );

                                delete msg.v_simul_mast;
                                delete msg.v_arrRebalanceDate;
                                delete msg.v_simulPortfolio;
                                delete msg.v_simulPortfolioList;

                                callback(null, msg);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 6. (백테스트) tm_simul_result_daily 결과를 삭제한다. */
                    function(msg, callback) {

                        try {

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }                            

                            stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResultDaily', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {
                                if (err) {
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

                            if( !resultMsg.err ) {
                                resultMsg.err = err;
                            }

                            return callback(resultMsg);
                        }
                    },

                    /* 7. (백테스트) tm_simul_result_daily 결과를 저장한다. */
                    function(msg, callback) {

                        if( !msg || Object.keys( msg ).length == 0 ) {
                            msg = {};
                        }                        

                        /* daily 건이 존재하는 경우 */
                        if( v_resultSimulData.arr_daily && v_resultSimulData.arr_daily.length > 0 ) {

                            var divideList  =   [];
                            async.forEachOfLimit( v_resultSimulData.arr_daily, 1, function(subList, i, innerCallback) {

                                async.waterfall([

                                    function(innerCallback) {
                                        subList.F15028_S  =   subList.tot_F15028_S;
                                        subList.F15028_C  =   subList.tot_F15028_C;

                                        divideList.push( subList );
                                        
                                        innerCallback(null, paramData);
                                    },

                                    function(sub_msg, innerCallback) {

                                        var divide_size = ( limit && limit.result_dive_size ? limit.result_dive_size : 1 );
                                        if( divideList && ( divideList.length == divide_size || i == v_resultSimulData.arr_daily.length-1 ) ) {
                                            try {
                                                paramData.dataLists =   divideList;
                                                stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultDaily', paramData, format);
//                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;

                                                if( !resultMsg.err ) {
                                                    resultMsg.err = err;
                                                }

                                                return innerCallback(resultMsg);
                                            }

                                        }else{
                                            innerCallback(null);
                                        }
                                    }

                                ], function(err) {

                                    if( err ) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        if( !resultMsg.err ) {
                                            resultMsg.err = err;
                                        }

                                        return innerCallback(resultMsg);
                                    }

                                    innerCallback(null);
                                });                                            

                            }, function(err) {
                                if (err) {
                                    return callback(resultMsg);
                                }

                                delete  v_resultSimulData.arr_daily;

                                callback(null, msg);
                            });

                        }else{
                            callback(null, msg);
                        }

                    },

                    /* 8. (백테스트) tm_simul_result_rebalance 결과를 삭제한다. */
                    function(msg, callback) {

                        try {

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }                            

                            stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResultRebalance', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {
                                if (err) {
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

                            if( !resultMsg.err ) {
                                resultMsg.err = err;
                            }

                            return callback(resultMsg);
                        }
                    },

                    /* 9. (백테스트) tm_simul_result_rebalance 결과를 저장한다. */
                    function(msg, callback) {

                        if( !msg || Object.keys( msg ).length == 0 ) {
                            msg = {};
                        }

                        var arr_result_rebalance    =   [];

						if( v_resultSimulData.arr_rebalance && v_resultSimulData.arr_rebalance.length > 0 ) {
							v_resultSimulData.arr_rebalance.forEach( function( item, index, array ) {

								Object.keys(item).forEach( function( sub_item, sub_index, sub_array ) {
									arr_result_rebalance.push( item[ sub_item ] );

								});
							});
						}

                        
                        if( arr_result_rebalance && arr_result_rebalance.length > 0 ) {

                            var divideList  =   [];
                            async.forEachOfLimit( arr_result_rebalance, 1, function(subList, i, innerCallback) {

                                async.waterfall([

                                    function(innerCallback) {

                                        divideList.push( subList );
                                        
                                        innerCallback(null, paramData);
                                    },

                                    function(sub_msg, innerCallback) {

                                        var divide_size = ( limit && limit.result_dive_size ? limit.result_dive_size : 1 );
                                        if( divideList && ( divideList.length == divide_size || i == arr_result_rebalance.length-1 ) ) {
                                            try {
                                                paramData.dataLists =   divideList;
                                                stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultRebalance', paramData, format);
//                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;

                                                if( !resultMsg.err ) {
                                                    resultMsg.err = err;
                                                }

                                                return innerCallback(resultMsg);
                                            }

                                        }else{
                                            innerCallback(null);
                                        }
                                    }

                                ], function(err) {

                                    if( err ) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        if( !resultMsg.err ) {
                                            resultMsg.err = err;
                                        }

                                        return innerCallback(resultMsg);
                                    }

                                    innerCallback(null);
                                });                                            

                            }, function(err) {
                                if (err) {
                                    return callback(resultMsg);
                                }

                                delete  v_resultSimulData.arr_rebalance;
                                arr_result_rebalance    =   [];

                                callback(null);
                            });

                        }else{
                            callback(null);
                        }

                    },                    


/*************************************************************************************
*   추후 아래 삭제 및 저장 부분은 삭제 예정 START
*************************************************************************************/
                    /* 10. (백테스트) tm_simul_result 결과를 삭제한다. */
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
//                                     resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResult Error while performing Query";
//                                     resultMsg.err = err;

//                                     return callback(resultMsg);
//                                 }

//                                 callback(null, msg);
//                             });

//                         } catch (err) {

//                             resultMsg.result = false;
//                             resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResult Error while performing Query";

//                             if( !resultMsg.err ) {
//                                 resultMsg.err = err;
//                             }

//                             return callback(resultMsg);
//                         }
//                     },

//                     /* 11. (백테스트) 시뮬레이션 결과를 저장한다. */
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
//                                                         resultMsg.msg = "[error] simulationBacktest.saveTmSimulResult Error while performing Query";
//                                                         resultMsg.err = err;

//                                                         return innerCallback(resultMsg);
//                                                     }

//                                                     innerCallback(null);
//                                                 });

//                                                 divideList  =   [];

//                                             } catch (err) {

//                                                 resultMsg.result = false;
//                                                 resultMsg.msg = "[error] simulationBacktest.saveTmSimulResult Error while performing Query";

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
//                                         resultMsg.msg = "[error] simulationBacktest.saveTmSimulResult Error while performing Query";
//                                         if( !resultMsg.err ) {
//                                             resultMsg.err = err;
//                                         }

//                                         return innerCallback(resultMsg);
//                                     }

//                                     innerCallback(null);
//                                 });                                            

//                             }, function(err) {
//                                 if (err) {
//                                     return callback(resultMsg);
//                                 }

//                                 delete  v_resultSimulData.dailyJongmokObj;
//                                 arrInsertDtl    =   [];

//                                 callback(null, msg);
//                             });

//                         }else{
//                             callback(null, msg);
//                         }

//                     },

/*************************************************************************************
*   추후 아래 삭제 및 저장 부분은 삭제 예정 END
*************************************************************************************/

                ], function(err) {

                    if (err) {
                        log.debug(err, stmt, paramData);
                        conn.rollback();

                    } else {
                        resultMsg.result = true;
                        resultMsg.msg = "성공적으로 저장하였습니다.";
                        resultMsg.err = null;

						resultMsg.grp_cd	=	paramData.grp_cd;
						resultMsg.scen_cd	=	paramData.scen_cd;

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
*   백테스트 결과 조회
**************************************************************************************************************/

/*
 * 백테스트 결과를 조회한다.
 * 2019-08-14  bkLove(촤병국)
 */
var getBacktestResult2 = function(req, res) {
    try {
        log.debug('simulationBacktest.runBacktest 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationBacktest.runBacktest  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        var format = { language: 'sql', indent: '' };
        var stmt = "";


        resultMsg.arr_result_daily      =   [];
        resultMsg.arr_result_rebalance  =   [];
        resultMsg.simul_result_mast     =   {};
        resultMsg.arr_bench_mark        =   [];
        resultMsg.analyzeList           =   [];
        resultMsg.jsonFileName          =   "";
        resultMsg.inputData             =   [];

        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return log.error(txerr);
                }            

                async.waterfall([

                    /* 1. (백테스트) 시뮬레이션 할 기본정보를 조회한다. */
                    function(callback) {

                        try{

                            if(  !paramData.grp_cd || !paramData.scen_cd  ) {
                                resultMsg.result = false;
                                resultMsg.msg = "[백테스트] 기본 인자값 정보가 존재하지 않습니다.";
                                resultMsg.err = "[백테스트] 기본 인자값 정보가 존재하지 않습니다.";

                                callback(resultMsg);
                            }
                            else{
                                stmt = mapper.getStatement('simulationBacktest2', 'getSimulListByBacktest2', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( !rows || rows.length == 0 || !rows[0].start_year ) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";
                                        resultMsg.err = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";

                                        return callback(resultMsg);
                                    }
                                    
                                    resultMsg.simul_result_mast =   rows[0];
                                    
                                    paramData.bench_mark_cd = rows[0].bench_mark_cd;
                                    paramData.bench_index_cd01 = rows[0].bench_index_cd01;
                                    paramData.bench_index_cd02 = rows[0].bench_index_cd02;
                                    paramData.bench_index_cd03 = rows[0].bench_index_cd03;
                                    
                                    callback(null, paramData);
                                });
                            }
                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 2. (백테스트) tm_simul_result_daily 테이블을 조회한다. */
                    function(msg, callback) {

                        try{

                            stmt = mapper.getStatement('simulationBacktest', 'getSimulResultDaily', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( rows && rows.length > 0 ) {
                                    resultMsg.arr_result_daily      =   rows;

                                    paramData.first_date = rows[0].F12506;

                                    /* 일자별 지수에 balance 정보를 설정한다. */
                                    fn_set_balance( resultMsg.arr_result_daily, resultMsg.simul_result_mast );
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 3. tm_simul_result_daily 테이블 기준 td_index_hist 테이블에서 bench_mark 와 일치하는 정보를 조회한다.*/
                    function(msg, callback) {

                        try{

                            stmt = mapper.getStatement('simulationBacktest2', 'getSimulBenchMark', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( rows && rows.length > 0 ) {
                                    /* 일자별 지수에 밴치마크 정보를 설정한다. */
                                    fn_set_bench_mark( resultMsg.arr_result_daily, rows );
                                }

                                callback(null, paramData);
                            });
                                
                           
                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 4. (백테스트) tm_simul_result_rebalance 테이블을 조회한다. */
                    function(msg, callback) {

                        try{
                            stmt = mapper.getStatement('simulationBacktest', 'getSimulResultRebalance', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( rows && rows.length > 0 ) {
                                    resultMsg.arr_result_rebalance      =   rows;
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },
                    

                    /* 5. 파이선을 통해 분석정보를 가져온다.*/
                    function(msg, callback) {

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }                            
 
                            /* 파이선을 통해 분석정보를 가져온다. */
                            if( resultMsg.arr_result_daily && resultMsg.arr_result_daily.length > 0 ) {

                                log.debug( "분석정보 #1 조회 from 파이선 START");
                                simulAnalyze.getAnalyze_timeseries(resultMsg.arr_result_daily, paramData.bench_mark_cd).then( function(e) {
                                    if( e && e.result ) {
                                        if( e.results && e.results.length > 0 ) {
                                            resultMsg.analyzeList   =   e.results;
                                            resultMsg.jsonFileName  =   e.jsonFileName;
                                            resultMsg.inputData  =   e.inputData;
                                        }
                                        callback(null);
                                    }else{

                                        stmt    =   "";
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = "[error] simulAnalyze.getAnalyze_timeseries 파이선 호출중 오류가 발생되었습니다.";

                                        return callback(null);

                                    }
                                });
                                log.debug( "분석정보 #1 조회 from 파이선 END");

                            }else{
                                callback(null);
                            }

                        } catch (err) {

                            //resultMsg.result = false;
                            //resultMsg.msg = "[error] simulAnalyze.getAnalyze_timeseries 파이선 호출중 오류가 발생되었습니다.";
                            //resultMsg.err = err;

                            callback(null);
                        }
                    },


                ], function(err) {

                    if (err) {
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

        resultMsg.arr_result_daily      =   [];
        resultMsg.arr_result_rebalance  =   [];
        resultMsg.simul_result_mast     =   {};
        resultMsg.analyzeList           =   [];
        resultMsg.jsonFileName          =   "";
        resultMsg.inputData             =   [];        

        res.json(resultMsg);
        res.end();
    }
}

/*
*   일자별 지수에 balance 정보를 설정한다.
*   2019-08-14  bkLove(촤병국)
*/
function    fn_set_balance( p_arr_daily, p_simul_mast ) {

    if(     p_arr_daily && p_arr_daily.length > 0 ) {

        var v_prev_index   =    0;
        for( var i=0; i < p_arr_daily.length; i++ ) {

            var v_daily         =   p_arr_daily[i];
            var v_prev_daily    =   ( typeof p_arr_daily[ v_prev_index ] == "undefined"     ? {} : p_arr_daily[ v_prev_index ] );

            /* 최초인 경우 */
            if( i == 0 ) {
                v_daily.balance  =   p_simul_mast.init_invest_money;
            }else{
                /* balance = 전일 balance * ( 당일 지수 / 전일 지수 ) */
                v_daily.balance  =   (
                    Number( v_prev_daily.balance ) * ( Number( Number( v_daily.INDEX_RATE ).toFixed(2) ) / Number( Number( v_prev_daily.INDEX_RATE ).toFixed(2) ) )
                ).toFixed(3);
            }

            if( i > 0 ) {
                v_prev_index    =   i;
            }            
        }
    }
}

/*
*   일자별 지수에 밴치마크 정보를 설정한다.
*   2019-08-14  bkLove(촤병국)
*/
function    fn_set_bench_mark( p_arr_daily, p_arr_bench ) {
    try {
        /* 소수점시 계산시 사용할 고정값 */
        var numInfo     =   {
                IMPORTANCE_FIX_NUM      :   100                     /* 비중  소수점 계산시 사용할 고정값 */
            ,   IMPORTANCE_FIX_NUM1     :   10000                   /* 비중  소수점 계산시 사용할 고정값 */
            ,   JISU_RATE_FIX_NUM       :   100000000000000000      /* 지수적용비율 소수점 계산시 사용할 고정값 */
        };

        if(     p_arr_daily && p_arr_daily.length > 0
            &&  p_arr_bench && p_arr_bench.length > 0
        ) {

            var v_prev_index   =    0;
            for( var i=0; i < p_arr_daily.length; i++ ) {

                var v_daily         =   p_arr_daily[i];
                var v_prev_daily    =   ( typeof p_arr_daily[ v_prev_index ] == "undefined"     ? {} : p_arr_daily[ v_prev_index ] );

                var v_bm            =   ( typeof p_arr_bench[i] == "undefined"                  ? {} : p_arr_bench[i] );
                var v_prev_bm       =   ( typeof p_arr_bench[ v_prev_index ] == "undefined"     ? {} : p_arr_bench[ v_prev_index ] );


                v_daily.bm_data01       =   Number( v_bm.F15001 );
                v_daily.F15175          =   Number( v_bm.F15175 );
                v_daily.KOSPI_F15001    =   Number( v_bm.KOSPI_F15001 );


                /* 최초인 경우 */
                if( i == 0 ) {

                    v_daily.bm_1000_data    =   1000;
                    v_daily.bm_return_data  =   Number(
                        (
                            ( Number( v_daily.bm_1000_data ) - Number( v_daily.bm_1000_data ) ) / Number( v_daily.bm_1000_data )
                        ).toFixed(17)
                    );

                }else{

                    /* 1000 단위환산 = 전일 단위환산 * ( 당일지수 / 전일 지수 ) */
                    v_daily.bm_1000_data    =   Number(
                        (
                                Number( v_prev_daily.bm_1000_data ) *
                                ( Number( v_daily.bm_data01 ) / Number( v_prev_daily.bm_data01 ) )
                        ).toFixed(17)
                    );

                    /* return = ( 당일 단위환산 - 전일 단위환산 ) / 전일 단위환산 */
                    v_daily.bm_return_data  =   Number(
                        (
                                ( Number( v_daily.bm_1000_data ) - Number( v_prev_daily.bm_1000_data ) ) / Number( v_prev_daily.bm_1000_data )
                        ).toFixed(17)
                    );
                }

                if( i > 0 ) {
                    v_prev_index    =   i;
                }            
            }
        }
    } catch(e) {
        throw e;
    }
}



/*
*  시뮬레이션 이력정보로 백테스트 수행결과를 반환한다.
*  2019-08-14  bkLove(촤병국)
*/
var	fn_get_simulation_data  =   function( 
			p_simul_mast                /* 시뮬레이션 기본 마스터 정보 */
		,   p_simul_hist_data           /* 일자별 종목 이력 데이터 */
		,   p_arrRebalanceDate          /* 리밸런싱 일자 정보 */
        ,   p_simulPortfolio            /* [tm_simul_portfolio] 기준 종목 데이터 */
        ,   p_simulPortfolioList        /* 리밸런싱 날짜별 포트 폴리오 */
	) {

		var v_prev_F12506               =   "";         /* 이전 입회일자 */
		var v_next_F12506               =   "";         /* 이후 입회일자 */

		var v_before_F12506             =   "";         /* 직전 입회일자 */
		var v_first_F12506              =   "";         /* 최초 입회일자 */
		var v_first_record_yn           =   "N";        /* 최초 레코드 여부 */
		

		var v_dailyJongmokObj           =   {};         /* 일자별 종목 데이터 */
		var v_dailyObj                  =   {};         /* 일자별 결과 정보 */

		var v_arr_daily                 =   [];         /* array 일자별 데이터 */
		var v_arr_rebalance             =   [];         /* array rebalance 데이터 */

        var v_rebalanceObj              =   {};

        var JongmokImportDateList       = [];           /* 종목별 편입 일자*/
	
		try{
			if ( p_simul_hist_data && p_simul_hist_data.length > 0 ) {

				if( p_simul_hist_data.length > 0 ) {

					v_first_F12506  =   p_simul_hist_data[0].F12506;
					v_prev_F12506   =   p_simul_hist_data[0].F12506;
					v_before_F12506 =   p_simul_hist_data[0].F12506;
				}


                var v_prev_jongmok      =   {};
                var v_jongmok           =   {};
                var v_daily             =   {};
                var v_prev_daily        =   {};
                var v_prev_rebalancing_F12506   =   "";         /* 이전 리밸런싱 일자 */

				for( var i=0; i < p_simul_hist_data.length; i++ ) {

					v_next_F12506   =   "";

					if( !v_dailyJongmokObj[ p_simul_hist_data[i].F12506 ] || Object.keys( v_dailyJongmokObj[ p_simul_hist_data[i].F12506 ] ).length == 0  ) {
						v_dailyJongmokObj[ p_simul_hist_data[i].F12506 ]    =   {};
					}

					if( !v_dailyObj[ p_simul_hist_data[i].F12506 ] || Object.keys( v_dailyObj[ p_simul_hist_data[i].F12506 ] ).length == 0  ) {
						v_dailyObj[ p_simul_hist_data[i].F12506 ]    =   {};
					}

					v_dailyJongmokObj[ p_simul_hist_data[i].F12506 ][ p_simul_hist_data[i].F16013 ]  =   p_simul_hist_data[i];


				/* 입회일자 기준 직전 일자 추출 */

					/* i-1 이 0 보다 큰 경우 - i-1 입회일자 셋팅 */
					if( i-1 >= 0 ) {
						v_prev_F12506   =   p_simul_hist_data[i-1].F12506;
					}

					/* 입회일자가 달라지는 경우 */
					if( v_prev_F12506  !=  p_simul_hist_data[i].F12506 ) {
						v_before_F12506 =   v_prev_F12506;
					}

					
				/* 입회일자가 바뀌는 경우 */

					/* i+1 이 마지막 인 경우 - i+1 입회일자 셋팅 */
					if( i+1 <= p_simul_hist_data.length-1 ) {
						v_next_F12506   =   p_simul_hist_data[i+1].F12506;
					}
					/* i 가 마지막인 경우 - 마지막 입회일자 셋팅 */
					else if( i == p_simul_hist_data.length-1 ) {
						v_next_F12506   =   p_simul_hist_data[i].F12506;
					}

                    /* 리밸런싱 날짜별로 포트 폴리오 변경*/
                    var findIndex  = _.findIndex(p_arrRebalanceDate, {'F12506':p_simul_hist_data[i].F12506});

                    if (findIndex != -1) {
                        p_simulPortfolio = p_simulPortfolioList[p_simul_hist_data[i].F12506];
                    }

					/* 입회일자가 달라지는 경우 */
					if(     v_next_F12506 != p_simul_hist_data[i].F12506
						||  i == p_simul_hist_data.length-1 
					) {

						/* 비교시가총액 변동 발생 여부 */
						v_dailyObj[ p_simul_hist_data[i].F12506 ].change_yn   =   "N";

						v_first_record_yn  =   "N";
						if( v_first_F12506 == p_simul_hist_data[i].F12506 ) {
							v_first_record_yn  =   "Y";
						}



                        v_jongmok           =   v_dailyJongmokObj[ p_simul_hist_data[i].F12506 ];
                        v_prev_jongmok      =   v_dailyJongmokObj[ v_before_F12506 ];


                        simulModule.fn_set_importDate(
                            {       F12506          :   p_simul_hist_data[i].F12506     /* 입회일자 */
                                ,   first_record_yn :   v_first_record_yn               /* 최초 레코드 여부 */
                            }
                            ,   p_arrRebalanceDate                  /* 리밸런싱 일자 */
                            ,   v_jongmok                           /* 현재 종목 */
                            ,   p_simulPortfolio                    /* [tm_simul_portfolio] 기준 종목 데이터 */
                            ,   JongmokImportDateList               /* 종목별 편입일자*/
                        );
						
						/*************************************************************************************************************
						*   일자별로 종목들의 기초 데이터를 설정한다.
						*   -   최초일은 종가 기준으로 계산
						*   -   이후는 기준가 기준으로 계산
						*   -   T 일이 리밸런싱일자 인지 설정
						**************************************************************************************************************/
						simulModule.fn_set_dayilyJongmok( 
								{       
										rowInx          :   i                               /* 일자별 종목 레코드 인덱스 */
									,   F12506          :   p_simul_hist_data[i].F12506     /* 입회일자 */
									,   v_before_F12506 :   v_before_F12506                 /* 직전 영업일 입회일자 */
									,   first_record_yn :   v_first_record_yn               /* 최초 레코드 여부 */
								}
							,   p_simul_mast                                                /* 시뮬레이션 기본 마스터 정보 */
							,   p_arrRebalanceDate                                          /* 리밸런싱 일자 */
							,   v_jongmok                                                   /* 일자별 종목 데이터 */
							,   v_dailyObj                                                  /* 일자별 정보 */
                            ,   p_simulPortfolio                                            /* [tm_simul_portfolio] 기준 종목 데이터 */
                            ,   JongmokImportDateList                                       /* 종목별 편입일자*/
						);
                    }
                }


    /**************************************************/

                if( v_dailyJongmokObj && Object.keys( v_dailyJongmokObj ).length > 0 ) {

                    v_prev_jongmok      =   {};
                    v_jongmok           =   {};
                    v_daily             =   {};
                    v_prev_daily        =   {};
                    v_prev_index        =   0;


                /* 첫날을 제외한 리밸런싱의 전후 날짜를 설정한다. */
                    var prev_rebalance_F12506    =   "";

                    v_rebalanceObj.chg_jongmok  =   {};         /* 첫 리밸런싱 종목을 기준으로 변경되는 정보 ( 종목편입 인지 확인 ) */
                    for( var i=0; i < p_arrRebalanceDate.length; i++ ) {

                        if( !v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ] || Object.keys( v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ] ).length == 0  ) {
                            v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ]      =   {};
                        }

                        v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ].prev_rebalance_F12506    =   prev_rebalance_F12506;
                        v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ].rebalance_F12506         =   p_arrRebalanceDate[i].F12506;

                        v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ].org_jongmok              =   {};     /* 원본 종목정보 */
                        v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ].add_jongmok              =   {};     /* 종목편입 */
                        v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ].sub_jongmok              =   {};     /* 종목편출 */
                        v_rebalanceObj[ p_arrRebalanceDate[i].F12506 ].imp_jongmok              =   {};     /* 비중조절 종목 */

                        prev_rebalance_F12506   =   p_arrRebalanceDate[i].F12506;
                    }
                    


                    var v_rebalance_cnt = 0;
                    for( var i=0;i < Object.keys( v_dailyJongmokObj ).length; i++ ) {

                        var v_F12506        =   Object.keys( v_dailyJongmokObj )[i];

                        var v_jongmok       =   v_dailyJongmokObj[ v_F12506 ];
                        var v_prev_jongmok  =   ( typeof v_dailyJongmokObj[ Object.keys( v_dailyJongmokObj )[v_prev_index] ] == "undefined" ? {} : v_dailyJongmokObj[ Object.keys( v_dailyJongmokObj )[v_prev_index] ] );

                        var v_daily         =   v_dailyObj[ Object.keys( v_dailyObj )[i] ];
                        var v_prev_daily    =   ( typeof v_dailyObj[ Object.keys( v_dailyObj )[v_prev_index] ] == "undefined" ? {} : v_dailyObj[ Object.keys( v_dailyObj )[v_prev_index] ] );

                        v_first_record_yn   =   "N";
                        if( i == 0 ) {
                            v_first_record_yn   =   "Y";
                        }

                        /* 리밸런싱 날짜별로 포트 폴리오 변경*/
                        var findIndex  = _.findIndex(p_arrRebalanceDate, {'F12506':v_F12506});

                        if (findIndex != -1) {
                            p_simulPortfolio = p_simulPortfolioList[v_F12506];
                        }
// if( [ "20171228" ].includes( v_F12506 ) ) {
//     log.debug( "v_F12506", v_F12506, "v_daily.tot_F15028_3", v_daily.tot_F15028_3 );
// }


                        try{

                            if( v_daily.rebalancing   ==   "1" ) {
                                v_prev_rebalancing_F12506   =   v_F12506;
                            }


                            var v_change_yn  =   "N";

                            if(  v_first_record_yn == "Y") {
                                // 시작 포트 폴리오 
                                p_simulPortfolio = p_simulPortfolioList[p_arrRebalanceDate[0].F12506];

                                simulModule.fn_set_today_rate(
                                        {       
                                                F12506                      :   v_F12506                        /* 입회일자 */
                                            ,   v_before_F12506             :   v_before_F12506
                                            ,   v_first_F12506              :   v_first_F12506
                                            ,   first_record_yn             :   v_first_record_yn               /* 최초 레코드 여부 */
                                            ,   case_gubun                  :   "case1"
                                            ,   v_change_yn                 :   "N"
                                            ,   p_prev_rebalancing_F12506   :   v_prev_rebalancing_F12506
                                        }
                                    ,   p_simul_mast                                                /* 시뮬레이션 기본 마스터 정보 */
                                    ,   p_simulPortfolio                                            /* [tm_simul_portfolio] 기준 종목 데이터 */
                                    ,   v_jongmok                                                   /* 현재 종목 */
                                    ,   v_prev_jongmok                                              /* 이전 종목 */
                                    ,   v_daily                                                     /* 현재 daily */
                                    ,   v_prev_daily                                                /* 이전 daily */
                                    ,   v_rebalanceObj
                                );
                                

                                /*  리밸런싱인 경우 종목별 지수적용비율을 재산정 */
                                if( v_daily.rebalancing     ==  "1" ) {

                                    
                                    fn_set_rebalanceDate_history(v_rebalance_cnt, v_F12506, v_rebalanceObj, v_jongmok, v_prev_jongmok, v_key, JongmokImportDateList, p_simulPortfolio);

                                    v_rebalance_cnt++;
                                }
                            }else{

                                /*  리밸런싱인 경우 종목별 지수적용비율을 재산정 */
                                if( v_daily.rebalancing     ==  "1" ) {

                                    simulModule.fn_set_today_rate(
                                            {       
                                                    F12506                      :   v_F12506                        /* 입회일자 */
                                                ,   v_before_F12506             :   v_before_F12506
                                                ,   v_first_F12506              :   v_first_F12506
                                                ,   first_record_yn             :   v_first_record_yn               /* 최초 레코드 여부 */
                                                ,   case_gubun                  :   "case2"
                                                ,   v_change_yn                 :   "N"
                                                ,   p_prev_rebalancing_F12506   :   v_prev_rebalancing_F12506
                                            }
                                        ,   p_simul_mast                                                /* 시뮬레이션 기본 마스터 정보 */
                                        ,   p_simulPortfolio                                            /* [tm_simul_portfolio] 기준 종목 데이터 */
                                        ,   v_jongmok                                                   /* 현재 종목 */
                                        ,   v_prev_jongmok                                              /* 이전 종목 */
                                        ,   v_daily                                                     /* 현재 daily */
                                        ,   v_prev_daily                                                /* 이전 daily */
                                        ,   v_rebalanceObj
                                    );

                                    fn_set_rebalanceDate_history(v_rebalance_cnt, v_F12506, v_rebalanceObj, v_jongmok, v_prev_jongmok, v_key, JongmokImportDateList, p_simulPortfolio);

                                    v_rebalance_cnt++;
                                }else{

                                    /* 이벤트 변동여부 체크 */
                                    v_change_yn     =   simulModule.fn_get_event_check(
                                            {       
                                                    F12506          :   v_F12506                        /* 입회일자 */
                                                ,   v_before_F12506 :   v_before_F12506
                                                ,   first_record_yn :   v_first_record_yn               /* 최초 레코드 여부 */
                                            }
                                        ,   p_simul_mast                                                /* 시뮬레이션 기본 마스터 정보 */
                                        ,   p_simulPortfolio                                            /* [tm_simul_portfolio] 기준 종목 데이터 */
                                        ,   v_jongmok                                                   /* 현재 종목 */
                                        ,   v_prev_jongmok                                              /* 이전 종목 */
                                        ,   v_daily                                                     /* 현재 daily */
                                        ,   v_prev_daily                                                /* 이전 daily */
                                    );

                                    simulModule.fn_set_today_rate(
                                            {       
                                                    F12506                      :   v_F12506                        /* 입회일자 */
                                                ,   v_before_F12506             :   v_before_F12506
                                                ,   v_first_F12506              :   v_first_F12506
                                                ,   first_record_yn             :   v_first_record_yn               /* 최초 레코드 여부 */
                                                ,   case_gubun                  :   "case3"
                                                ,   v_change_yn                 :   v_change_yn
                                                ,   p_prev_rebalancing_F12506   :   v_prev_rebalancing_F12506
                                            }
                                        ,   p_simul_mast                                                /* 시뮬레이션 기본 마스터 정보 */
                                        ,   p_simulPortfolio                                            /* [tm_simul_portfolio] 기준 종목 데이터 */
                                        ,   v_jongmok                                                   /* 현재 종목 */
                                        ,   v_prev_jongmok                                              /* 이전 종목 */
                                        ,   v_daily                                                     /* 현재 daily */
                                        ,   v_prev_daily                                                /* 이전 daily */
                                        ,   v_rebalanceObj
                                    );
                                }

                            }

                        }catch( e ) {
                            log.debug( "error ", e );
                        }

                        v_arr_daily.push( v_daily );

                        if( i > 0 ) {
                            v_prev_index    =   i;
                        }
                    }


                    var not_jongmok =   [];     /* 종목편입되지 않는 종목 */
                    try{
                        for( var j=0; j < Object.keys( v_rebalanceObj ).length; j++ ) {

                            var v_key       =   Object.keys( v_rebalanceObj )[j];
                            var v_item      =   v_rebalanceObj[ v_key ];
                            

                            if( v_key != "chg_jongmok" ) {

                            /* 종목편입 종목 */
                                if( typeof v_item.add_jongmok != "undefined" && Object.keys( v_item.add_jongmok ).length > 0 ) {

                                    /* 종목편입 되지 않은 종목 = 원래종목 - 추가로 편입된 종목 */
                                    not_jongmok = Object.keys( v_item.org_jongmok ).filter( x => !Object.keys( v_item.add_jongmok ).includes(x) );
                                    not_jongmok = not_jongmok.filter( x => !Object.keys( v_item.add_jongmok ).includes(x) );

                                    for( var k=0; k < Object.keys( v_item.add_jongmok ).length; k++ ) {
                                        var v_sub_key   =   Object.keys( v_item.add_jongmok )[k];
                                        var v_sub_item  =   v_item.add_jongmok[ v_sub_key ];

                                        v_sub_item.EVENT_FLAG           =   "20";
                                        v_sub_item.rebalance_import_yn  =   "1";
                                    }

                                    v_arr_rebalance.push( v_item.add_jongmok );
                                }

                            /* 종목편출 종목 */
                                if( typeof v_item.sub_jongmok != "undefined" && Object.keys( v_item.sub_jongmok ).length > 0 ) {

                                    for( var k=0; k < Object.keys( v_item.sub_jongmok ).length; k++ ) {
                                        var v_sub_key   =   Object.keys( v_item.sub_jongmok )[k];
                                        var v_sub_item  =   v_item.sub_jongmok[ v_sub_key ];

                                        v_sub_item.EVENT_FLAG           =   "30";
                                        v_sub_item.rebalance_import_yn  =   "1";
                                    }

                                    v_arr_rebalance.push( v_item.sub_jongmok );
                                }

                            /* 비중조절 종목 */
                                if( typeof v_item.imp_jongmok != "undefined" && Object.keys( v_item.imp_jongmok ).length > 0 ) {

                                    /* 종목편입 되지 않은 종목 = ( 원래종목 - 추가로 편입된 종목 ) - 비중조절 종목 */
                                    not_jongmok = not_jongmok.filter( x => !Object.keys( v_item.imp_jongmok ).includes(x) );


                                    /* 비중조절인 경우 종목으로 편입되어 있는지 체크여부 는 "1" 로 설정 */
                                    for( var k=0; k < Object.keys( v_item.imp_jongmok ).length; k++ ) {
                                        var   v_imp_key   =   Object.keys( v_item.imp_jongmok )[k];
                                        v_item.imp_jongmok[ v_imp_key ].rebalance_import_yn =   "1";
                                    }                                    

                                    if( typeof v_item.add_jongmok != "undefined" && Object.keys( v_item.add_jongmok ).length > 0  ) {
                                        for( var k=Object.keys( v_item.imp_jongmok ).length-1; k >= 0; k-- ) {
                                            var   v_imp_key   =   Object.keys( v_item.imp_jongmok )[k];

                                            if( typeof v_item.add_jongmok[ v_imp_key ] != "undefined" ) {
                                                delete v_item.imp_jongmok[ v_imp_key ];
                                            }
                                        }
                                    }

                                    if( Object.keys( v_item.imp_jongmok ).length > 0 ) {
                                        v_arr_rebalance.push( v_item.imp_jongmok );
                                    }
                                }

                            /* 종목편입 되지 않은 종목 */
                                if( not_jongmok && not_jongmok.length > 0 ) {

                                    var not_jongmok_obj =   {};
                                    for( var k=0; k < not_jongmok.length; k++ ) {
                                        var   v_key   =   not_jongmok[k];

                                        if( typeof v_item.org_jongmok[ v_key ] != "undefined" ) {
                                            if( j==0 ) {
                                                v_item.org_jongmok[ v_key ].BEFORE_IMPORTANCE   =   "-1";
                                            }

                                            not_jongmok_obj[ v_key ]    =   v_item.org_jongmok[ v_key ];
                                            not_jongmok_obj[ v_key ].rebalance_import_yn    =   "0";
                                        }
                                    }

                                    if( Object.keys( not_jongmok_obj ).length > 0 ) {
                                        v_arr_rebalance.push( not_jongmok_obj );
                                    }
                                }                            
                            }
                        }
                        
                    }catch(e) {
                        log.debug( "error", e );
                    }
                }
			}            
		}catch( e ) {
			log.debug( "fn_get_simulation_data error", e );
		}

		return  { 
				dailyJongmokObj     :   v_dailyJongmokObj
			,   dailyObj            :   v_dailyObj
			,   arr_daily           :   v_arr_daily
			,   arr_rebalance       :   v_arr_rebalance
		};
	};



/*
* 포트폴리오에 해당 하는 종목만 걸러낸다.
* 2019-09-09  daeguk
*/
var fn_history_filter   = function(
    temp_kspjong_hist /*DB에서 조회된 종목별 히스토리*/
    , v_simulPortfolio  /* 시작일 포트롤리오 */
    , v_simulPortfolioList /* 리밸런싱일별 포트 폴리오*/    
) {
    var kspjong_hist = [];
    let simulPortfolio = v_simulPortfolio;
                                    
    temp_kspjong_hist.forEach(function(kspjong_item) {

        if (kspjong_item.rebalancing == 1) {
            simulPortfolio = v_simulPortfolioList[kspjong_item.F12506];
        }

        for( var i = 0; i < Object.keys( simulPortfolio ).length; i++ ) {
            var F16013     =   Object.keys( simulPortfolio )[i];

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
var fn_set_rebalanceDate_history = function(v_rebalance_cnt, /* 리밸런싱 횟수 */
    v_F12506, /* 현재날짜*/
    v_rebalanceObj, /* 리밸런싱 정보 */ 
    v_jongmok, /* 현재종목 */
    v_prev_jongmok, /* 이전종목*/
    v_key, /* 종목키*/
    JongmokImportDateList, /* 종목별 투입 일자 리스트 */
    p_simulPortfolio /* 포트폴리오 */
    ) {
    
    var v_rebalanceDate     =   v_rebalanceObj[ v_F12506 ];
    var v_jongmok_temp      =   Object.assign( {}, v_jongmok );
    var v_prev_jongmok_temp =   Object.assign( {}, v_prev_jongmok );


    /* 첫 리밸런싱인 경우 */
    if( v_rebalance_cnt == 0 ) {

        /* 현재 종목기준으로 검색 */
        for( var j=0; j < Object.keys( v_jongmok_temp ).length; j++ ) {
            var v_key       =   Object.keys( v_jongmok_temp )[j];
            var v_tempItem  =   Object.assign( {}, v_jongmok_temp[ v_key ] );


            if(v_key != "KRW" && JongmokImportDateList[v_key].IMPORT_YN == "1" && Number(JongmokImportDateList[v_key].startDate) <= Number(v_F12506) ) {

                /* 리밸런싱 변경 정보에 값이 없는 경우 - 종목편입 */
                if( !v_rebalanceObj.chg_jongmok[ v_key ] || typeof v_rebalanceObj.chg_jongmok[ v_key ] == "undefined" ) {

                    v_tempItem.BEFORE_IMPORTANCE =   "-1";

                    v_rebalanceObj.chg_jongmok[ v_key ]     =   v_tempItem;     /* 리밸런싱 변경정보 */
                    v_rebalanceDate.add_jongmok[ v_key ]    =   v_tempItem;     /* 리밸런싱별 종목정보 */
                }
            }
        }

        /* 포트폴리오 종목의 갯수와 다른 경우 KRW 편입 */
        if( Object.keys( v_rebalanceObj.chg_jongmok ).length > 0 ) {

            if( Object.keys( v_rebalanceObj.chg_jongmok ).length != Object.keys( p_simulPortfolio ).length ) {
                if( v_jongmok_temp[ "KRW" ] && typeof v_jongmok_temp[ "KRW" ] != "undefined" ) {

                    v_jongmok_temp[ "KRW" ].BEFORE_IMPORTANCE =   "-1";

                    v_rebalanceObj.chg_jongmok[ "KRW" ]     =    v_jongmok_temp[ "KRW" ];
                    v_rebalanceDate.add_jongmok[ "KRW" ]    =    v_jongmok_temp[ "KRW" ];
                }
            }
        }
    }else{

        /* 현재 종목기준으로 검색 */
        for( var j=0; j < Object.keys( v_jongmok_temp ).length; j++ ) {
            var v_key       =   Object.keys( v_jongmok_temp )[j];
            var v_tempItem  =   Object.assign( {}, v_jongmok_temp[ v_key ] );


            if(v_key != "KRW" && JongmokImportDateList[v_key].IMPORT_YN == "1" && Number(JongmokImportDateList[v_key].startDate) <= Number(v_F12506)) {

                /* 리밸런싱 변경 정보에 값이 없는 경우 - 종목편입 */
                if( !v_rebalanceObj.chg_jongmok[ v_key ] || typeof v_rebalanceObj.chg_jongmok[ v_key ] == "undefined" ) {
                                                    
//                                                    v_tempItem.BEFORE_IMPORTANCE =   "-1";

                    v_rebalanceObj.chg_jongmok[ v_key ]     =   v_tempItem;     /* 리밸런싱 변경정보 */
                    v_rebalanceDate.add_jongmok[ v_key ]    =   v_tempItem;     /* 리밸런싱별 종목정보 */
                }
            }
        }

        /* 포트폴리오 종목의 갯수와 다른 경우 KRW 편입 */
        if( Object.keys( v_rebalanceObj.chg_jongmok ).length > 0 ) {

            /* 리밸런싱 변경정보에 KRW 가 존재하지 않는 경우 KRW 편입 */
            if( !v_rebalanceObj.chg_jongmok[ "KRW" ] || typeof v_rebalanceObj.chg_jongmok[ "KRW" ] == "undefined" ) {
                if( Object.keys( v_rebalanceObj.chg_jongmok ).length != Object.keys( p_simulPortfolio ).length ) {
                    if( v_jongmok_temp[ "KRW" ] && typeof v_jongmok_temp[ "KRW" ] != "undefined" ) {

    //                                    v_jongmok_temp[ "KRW" ].BEFORE_IMPORTANCE =   "-1";

                        v_rebalanceObj.chg_jongmok[ "KRW" ]     =    v_jongmok_temp[ "KRW" ];
                        v_rebalanceDate.add_jongmok[ "KRW" ]    =    v_jongmok_temp[ "KRW" ];
                    }
                }
            }
        }                                        


        /* 리밸런싱 변경정보 기준으로 검색 */
        for( var j=0; j < Object.keys( v_rebalanceObj.chg_jongmok ).length; j++ ) {
            var v_key       =   Object.keys( v_rebalanceObj.chg_jongmok )[j];
            var v_tempItem  =   Object.assign( {}, v_rebalanceObj.chg_jongmok[ v_key ] );


            /* 리밸런싱 변경 정보에는 존재하나 현재종목에는 존재하지 않는 경우 종목편출 */
            if( !v_jongmok_temp[ v_key ] || typeof v_jongmok_temp[ v_key ] == "undefined" ) {

                v_tempItem.F12506                       =   v_F12506;       /* 일자를 삭제하는 일자로 수정 */
                                                
                if( !v_prev_jongmok_temp[ v_key ] || typeof v_prev_jongmok_temp[ v_key ] == "undefined" ) {
//                                                    v_tempItem.BEFORE_IMPORTANCE        =   "-1";
                }else{
                    v_tempItem.BEFORE_IMPORTANCE        =   v_prev_jongmok_temp[ v_key ].BEFORE_IMPORTANCE;
                }

                v_tempItem.AFTER_IMPORTANCE             =   "0";

                v_rebalanceDate.sub_jongmok[ v_key ]    =   v_tempItem;

                delete v_rebalanceObj.chg_jongmok[ v_key ];
            }
        }
    }    
}

module.exports.runBacktest = runBacktest;
module.exports.saveBacktestResult2 = saveBacktestResult2;
module.exports.getBacktestResult2 = getBacktestResult2;