/*
 *  시뮬레이션 관련 정보
 *
 *  @date 2019-07-26
 *  @author bkLove
 */
var os = require('os');
var fs = require('fs');
var config = require('../../../config/config');
var util = require('../../../util/util');
var Promise = require("bluebird");


// var multer = require('multer');
// var xlsx = require('xlsx');
var async = require('async');

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs');


var simulModule = require('./simulModule');


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
 * 시뮬레이션 기본정보를 저장한다.
 * 2019-05-20  bkLove(촤병국)
 */
var saveBaicInfo = function(req, res) {
    try {
        log.debug('simulationBacktest.saveBaicInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationBacktest.saveBaicInfo  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulationBacktest.saveBaicInfo  req.body.data no data.";

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

        var arrInsertDtl                =   [];
        var arrModifyDtl                =   [];
        var arrDeleteDtl                =   [];
        var divideList                  =   [];

        var v_simul_mast                =   {};
        var v_arrFirstHist              =   [];
        var v_simulPortfolio            =   {};
        var v_firstHistObj              =   {};         /* 백테스트 실행시 start_year 기준 직전 영업일 하루 데이터 정보 */
        var v_dailyJongmokObj           =   {};         /* 일자별 종목 데이터 */
        var v_dailyObj                  =   {};         /* 일자별 결과 정보 */
        var v_arrRebalanceDate          =   {};         /* 리밸런스 일자 */
        
        var v_resultSimulData           =   {};

        resultMsg.arr_daily             =   [];
        resultMsg.arr_rebalance         =   [];
        resultMsg.simul_mast            =   {};
        resultMsg.arr_bench_mark        =   [];

        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return log.error(txerr);
                }

                async.waterfall([

                    /* 1. 시나리오명이 존재하는지 체크한다. */
                    function(callback) {

                        try{
                            var exist_yn   =   "Y";

                            /* 기존에 등록된 prev_scen_cd 가 없는 경우 ( 신규 건 ) */
                            if( typeof paramData.prev_scen_cd == "undefined" || paramData.prev_scen_cd == "" ) {
                                paramData.status    =   "insert";
                            }else{
                                paramData.status    =   "modify";
                            }

                            stmt = mapper.getStatement('simulation', 'getExistScenName', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulation.getExistScenName Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( rows && rows.length == 1) {
                                    exist_yn   =   rows[0].exist_yn;
                                }

                                if( exist_yn == "Y" ) {
                                    resultMsg.result = false;
                                    resultMsg.msg   = "시나리오명이 이미 존재합니다.";
                                    resultMsg.err   = "[error] simulation.getExistScenName Error while performing Query";

                                    return callback(resultMsg);                                    
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getExistScenName Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 2. 그룹코드 변경시 하위에 시나리오 건수를 조회한다. */
                    function(msg, callback) {

                        try{
                            var exist_cnt   =   1;

                            paramData.grp_yn            =   "0";                                    /* 그룹여부(1-그룹) */
                            paramData.scen_depth        =   "2";                                    /* 시나리오 DEPTH */

                            /* 수정 건 이고 상위 그룹이 변경된 경우 */
                            if(     paramData.status        ==  "modify"
                                &&  paramData.prev_grp_cd   !=  paramData.grp_cd ) {

                                stmt = mapper.getStatement('simulationBacktest', 'getExistSubCnt', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationBacktest.getExistSubCnt Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( rows && rows.length == 1) {
                                        exist_cnt   =   rows[0].exist_cnt;
                                    }

                                    if( exist_cnt > 0 ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "변경 전 상위그룹에 시나리오가 한건 이상  존재합니다.";
                                        resultMsg.err       =   "[error] simulationBacktest.getExistSubCnt Error while performing Query";

                                        return callback(resultMsg);                                    
                                    }

                                    callback(null, paramData);
                                });

                            }else{
                                callback(null, paramData);
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getExistSubCnt Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 3. 시뮬레이션 시나리오 코드를 채번한다. */
                    function(msg, callback) {

                        try{

                            /* modify 상태이고 상위그룹이 변경되지 않는 경우 기존 scen_cd 사용 */
                            if(     paramData.status        ==  "modify"
                                &&  paramData.prev_grp_cd   ==  paramData.grp_cd  ) {

                                    callback(null, paramData);

                            }else{

                                paramData.init_incre_grp_cd     =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */

                                stmt = mapper.getStatement('simulationBacktest', "getScenCd1", paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationBacktest.getScenCd1 Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows.length == 1) {
                                        paramData.scen_cd = rows[0].scen_cd;
                                    }

                                    callback(null, paramData);
                                });

                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getScenCd1 Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 4. 시뮬레이션 시나리오 정렬순번을 조회한다. */
                    function(msg, callback) {

                        try{

                            if( !paramData.grp_cd  ) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] simulation.getScenOrderNo  'grp_cd' 가 존재하지 않습니다.";
                                resultMsg.err = "[error] simulation.getScenOrderNo Error while performing Query";

                                callback( resultMsg, paramData)

                            }else if( !paramData.scen_cd  ) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] simulation.getScenOrderNo  'scen_cd' 가 존재하지 않습니다.";
                                resultMsg.err = "[error] simulation.getScenOrderNo Error while performing Query";

                                callback( resultMsg, paramData)

                            }else{

                                /* 신규 건 이거나 상위 그룹이 변경된 경우 정렬순번 조회 */
                                if(     paramData.status        ==  "insert"
                                    ||  paramData.prev_grp_cd   !=  paramData.grp_cd  ) {

                                    stmt = mapper.getStatement('simulation', 'getScenOrderNo', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] simulation.getScenOrderNo Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if (rows && rows.length == 1) {
                                            paramData.scen_order_no     =   rows[0].scen_order_no;
                                        }

                                        callback(null, paramData);
                                    });

                                }else{
                                    callback(null, paramData);
                                }
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation.getScenOrderNo Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 5. 시뮬레이션 기본 정보를 저장한다. */
                    function( msg, callback) {

                        var queryId =   "saveTmSimulMast";            

                        try{
                            if( paramData.status  ==  "modify" ) {
                                queryId =   "modifyTmSimulMast";
                            }                            

                            stmt = mapper.getStatement('simulationBacktest', queryId, paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest." + queryId + " Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest." + queryId + " Error while performing Query";
                                    resultMsg.err = err;

                                    callback(resultMsg, paramData);
                                }else{
                                    callback(null, paramData);
                                }
                                
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest." + queryId + " Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 6. 입력할 값을 기준으로 tm_simul_portfolio 와 비교하여 insert, modify 대상을 추출한다.  */
                    function( msg, callback) {

                        try {
                            arrInsertDtl = [];
                            arrModifyDtl = [];

                            /* 포트폴리오 설정 건이 존재하는 경우 */
                            if( paramData.arr_portfolio && paramData.arr_portfolio.length > 0  ){
                                stmt = mapper.getStatement('simulationBacktest', 'getTmSimulPortfolioExistCheck1', paramData, { language: 'sql', indent: '  ' });
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationBacktest.getTmSimulPortfolioExistCheck1 Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows.length > 0) {
                                        for (var i in rows) {
                                            if (rows[i].dtl_status == "insert") {
                                                arrInsertDtl.push(rows[i]);
                                            } else if (rows[i].dtl_status == "modify") {
                                                arrModifyDtl.push(rows[i]);
                                            }
                                        }
                                    }

                                    callback(null, paramData);
                                });
                            
                            }else{
                                callback(null, paramData);
                            }

                        } catch (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getTmSimulPortfolioExistCheck1 Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }
                    },

                    /* 7. tm_simul_portfolio 을 기준으로 입력할 값과 비교하여 delete 대상을 추출한다.  */
                    function( msg, callback) {

                        try {
                            arrDeleteDtl = [];

                            /* 수정인 경우 */
                            if( paramData.status  ==  "modify" ) {

                                /* 포트폴리오 설정 건이 존재하는 경우 */
                                if( paramData.arr_portfolio && paramData.arr_portfolio.length > 0  ){
                                    stmt = mapper.getStatement('simulationBacktest', 'getTmSimulPortfolioExistCheck2', paramData, { language: 'sql', indent: '  ' });
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] simulationBacktest.getTmSimulPortfolioExistCheck2 Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if (rows && rows.length > 0) {
                                            for (var i in rows) {
                                                if (rows[i].dtl_status == "delete") {
                                                    arrDeleteDtl.push(rows[i]);
                                                }
                                            }
                                        }

                                        callback(null, paramData);
                                    })
                                }else{
                                    callback(null, paramData);
                                }

                            }else{
                                callback(null, paramData);
                            }

                        } catch (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getTmSimulPortfolioExistCheck2 Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }
                    },                    

                    /* 8. 시뮬레이션 포트폴리오 정보를 저장한다. ( insert 건 ) */
                    function( msg, callback) {

                        divideList  =   [];

                        /* 등록건이 존재하는 경우 */
                        if( arrInsertDtl && arrInsertDtl.length > 0 ) {
                            async.forEachOfLimit( arrInsertDtl, 1, function(subList, i, innerCallback) {

                                async.waterfall([

                                    function(innerCallback) {
                                        divideList.push( subList );
                                        
                                        innerCallback(null, paramData);
                                    },

                                    function(msg, innerCallback) {

                                        var divide_size = ( limit && limit.divide_size ? limit.divide_size : 1 );
                                        if( divideList && ( divideList.length == divide_size || i == arrInsertDtl.length-1 ) ) {
                                            try {
                                                paramData.arr_portfolio =   divideList;
                                                stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulPortfolio', paramData, format);
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulationBacktest.saveTmSimulPortfolio Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulationBacktest.saveTmSimulPortfolio Error while performing Query";

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
                                        resultMsg.msg = "[error] simulationBacktest.saveTmSimulPortfolio Error while performing Query";
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

                                callback(null, paramData);
                            });

                        }else{
                            callback(null, paramData);
                        }
                    },

                    /* 9. 시뮬레이션 포트폴리오 정보를 저장한다. ( modify 건 ) */
                    function( msg, callback) {

                        divideList  =   [];

                        /* 수정건이 존재하는 경우 */
                        if( arrModifyDtl && arrModifyDtl.length > 0 ) {
                            async.forEachOfLimit( arrModifyDtl, 1, function(subList, i, innerCallback) {

                                async.waterfall([

                                    function(innerCallback) {
                                        divideList.push( subList );
                                        
                                        innerCallback(null, paramData);
                                    },

                                    function(msg, innerCallback) {

                                        var divide_size = ( limit && limit.divide_size ? limit.divide_size : 1 );
                                        if( divideList && ( divideList.length == divide_size || i == arrModifyDtl.length-1 ) ) {
                                            try {
                                                paramData.arr_portfolio =   divideList;
                                                stmt = mapper.getStatement('simulationBacktest', 'modifyTmSimulPortfolio', paramData, format);
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulationBacktest.modifyTmSimulPortfolio Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulationBacktest.modifyTmSimulPortfolio Error while performing Query";

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
                                        resultMsg.msg = "[error] simulationBacktest.modifyTmSimulPortfolio Error while performing Query";
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

                                callback(null, paramData);
                            });

                        }else{
                            callback(null, paramData);
                        }
                    },

                    /* 10. 시뮬레이션 포트폴리오 정보를 저장한다. ( delete 건 ) */
                    function( msg, callback) {

                        divideList  =   [];

                        /* 삭제건이 존재하는 경우 */
                        if( arrDeleteDtl && arrDeleteDtl.length > 0 ) {
                            async.forEachOfLimit( arrDeleteDtl, 1, function(subList, i, innerCallback) {

                                async.waterfall([

                                    function(innerCallback) {
                                        divideList.push( subList );
                                        
                                        innerCallback(null, paramData);
                                    },

                                    function(msg, innerCallback) {

                                        var divide_size = ( limit && limit.divide_size ? limit.divide_size : 1 );
                                        if( divideList && ( divideList.length == divide_size || i == arrDeleteDtl.length-1 ) ) {
                                            try {
                                                paramData.arr_portfolio =   divideList;
                                                stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulPortfolio', paramData, format);
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulationBacktest.deleteTmSimulPortfolio Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulationBacktest.deleteTmSimulPortfolio Error while performing Query";

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
                                        resultMsg.msg = "[error] simulationBacktest.deleteTmSimulPortfolio Error while performing Query";
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

                                callback(null, paramData);
                            });

                        }else{
                            callback(null, paramData);
                        }
                    },

                    /* 11. 저장시 입력했던 정보로 백테스트 기본정보를 조회한다. */
                    function(msg, callback) {

                        try{

                            stmt = mapper.getStatement('simulationBacktest', 'getSimulListByBacktest', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getSimulListByBacktest Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }


                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 시뮬레이션 할 기본 데이터가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }


                                for( var i in rows ) {
                                    v_simulPortfolio[ rows[i].F16013 ]    =   rows[i];

                                    /* 마스터 정보 설정 */
                                    if( i == 0 ) {
                                        v_simul_mast.grp_cd                 =   rows[0].grp_cd;                 /* 그룹코드(상위코드) */
                                        v_simul_mast.scen_cd                =   rows[0].scen_cd;                /* 시나리오 코드 */

                                        v_simul_mast.start_year             =   rows[0].start_year;             /* 시작년도 */
                                        v_simul_mast.rebalance_cycle_cd     =   rows[0].rebalance_cycle_cd;     /* 리밸런싱주기 (COM006) */
                                        v_simul_mast.rebalance_date_cd      =   rows[0].rebalance_date_cd;      /* 리밸런싱일자 (COM007) */
                                        v_simul_mast.init_invest_money      =   rows[0].init_invest_money;      /* 초기투자금액 */
                                        v_simul_mast.bench_mark_cd          =   rows[0].bench_mark_cd;          /* 벤치마크 (COM008) */
                                        v_simul_mast.importance_method_cd   =   rows[0].importance_method_cd;   /* 비중설정방식 (COM009) */
                                    }
                                }                                

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulListByBacktest Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 12. 저장시 입력했던 정보로 리밸런싱 일자를 조회한다. */
                    function(msg, callback) {

                        try{

                            stmt = mapper.getStatement('simulationBacktest', 'getRebalanceDateByScenCd', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getRebalanceDateByScenCd Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }


                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 리밸런싱 일자 정보가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 리밸런싱 일자 정보가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }

                                v_arrRebalanceDate  =   rows;

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getRebalanceDateByScenCd Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 13. (백테스트) 백테스트 실행시 이력정보를 조회한다. */
                    function(msg, callback) {

                        try{

                            stmt = mapper.getStatement('simulationBacktest', 'getSimulHistListByScenCd2', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getSimulHistListByScenCd2 Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0  ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }


                                var startTime1   =   new Date();

                            /*************************************************************************************************************
                            *   시뮬레이션 이력정보로 백테스트 수행결과를 반환한다.
                            **************************************************************************************************************/

                                v_resultSimulData   =   fn_get_simulation_data(
                                        v_simul_mast            /* 시뮬레이션 기본 마스터 정보 */
                                    ,   rows                    /* 일자별 종목 이력 데이터 */
                                    ,   v_arrRebalanceDate      /* 리밸런싱 일자 정보 */
                                    ,   v_simulPortfolio        /* [tm_simul_portfolio] 기준 종목 데이터 */
                                );

                                

                                var endTime1   =   new Date();

                                console.log( fn_show_diff_time( "시뮬레이션 script 계산결과", startTime1, endTime1 ) );

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulHistListByScenCd2 Error while performing Query";
                            resultMsg.err = err;

                            resultMsg.dailyJongmokObj   =   {};
                            resultMsg.dailyObj          =   {};

                            callback(resultMsg);
                        }
                    },

                    /* 14. td_kspjong_hist 테이블 기준 td_index_hist 테이블에서 bench_mark 와 일치하는 정보를 조회한다.*/
                    function(msg, callback) {

                        try{

                            if(     paramData.start_year
                                &&  paramData.bench_mark_cd
                                &&  paramData.bench_mark_cd != "0"
                            ) {

                                stmt = mapper.getStatement('simulationBacktest', 'getSimulBenchMark', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationBacktest.getSimulBenchMark Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( rows || rows.length > 0 ) {
                                        fn_set_bench_mark( v_resultSimulData.arr_daily, rows );
                                    }

                                    callback(null);
                                });
                                
                            }else{
                                callback(null);
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulBenchMark Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                

                ], function(err) {

                    if (err) {
                        console.error(err, stmt, paramData);
                        conn.rollback();

                    } else {
                        resultMsg.result        =   true;
                        resultMsg.msg           =   "성공적으로 저장하였습니다.";

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

                        fn_set_balance( v_resultSimulData.arr_daily, resultMsg.simul_mast );

                        resultMsg.arr_daily         =   [ ...v_resultSimulData.arr_daily];
                        resultMsg.arr_rebalance     =   [ ...v_resultSimulData.arr_rebalance];                        

                        resultMsg.err           =   null;

                        conn.commit();
                    }

                    res.json(resultMsg);
                    res.end();

                });
            });
        });

    } catch (expetion) {

        console.log(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulationBacktest.saveBaicInfo 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.arr_daily             =   [];
        resultMsg.arr_rebalance         =   [];
        resultMsg.simul_mast            =   {};

        res.json(resultMsg);
        res.end();
    }
}



/*************************************************************************************************************
*   백테스트 결과 저장
**************************************************************************************************************/


/*
 * 백테스트 결과를 저장한다.
 * 2019-08-14  bkLove(촤병국)
 */
var saveBacktestResult = function(req, res) {
    try {
        log.debug('simulationBacktest.saveBacktestResult 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationBacktest.saveBacktestResult  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulationBacktest.saveBacktestResult  req.body.data no data.";

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
 
        var arrInsertDtl                =   [];
        var arrModifyDtl                =   [];
        var arrDeleteDtl                =   [];
        var divideList                  =   [];

        var v_simul_mast                =   {};
        var v_arrFirstHist              =   [];
        var v_simulPortfolio            =   {};
        var v_firstHistObj              =   {};         /* 백테스트 실행시 start_year 기준 직전 영업일 하루 데이터 정보 */
        var v_dailyJongmokObj           =   {};         /* 일자별 종목 데이터 */
        var v_dailyObj                  =   {};         /* 일자별 결과 정보 */
        var v_arrRebalanceDate          =   {};         /* 리밸런스 일자 */
        
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

                                callback(resultMsg, paramData);
                            }
                            else{
                                stmt = mapper.getStatement('simulationBacktest', 'getSimulListByBacktest', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationBacktest.getSimulListByBacktest Error while performing Query";
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

									for( var i in rows ) {
										v_simulPortfolio[ rows[i].F16013 ]    =   rows[i];

                                        /* 마스터 정보 설정 */
                                        if( i == 0 ) {
                                            v_simul_mast.grp_cd                 =   rows[0].grp_cd;                 /* 그룹코드(상위코드) */
                                            v_simul_mast.scen_cd                =   rows[0].scen_cd;                /* 시나리오 코드 */

                                            v_simul_mast.start_year             =   rows[0].start_year;             /* 시작년도 */
                                            v_simul_mast.rebalance_cycle_cd     =   rows[0].rebalance_cycle_cd;     /* 리밸런싱주기 (COM006) */
                                            v_simul_mast.rebalance_date_cd      =   rows[0].rebalance_date_cd;      /* 리밸런싱일자 (COM007) */
                                            v_simul_mast.init_invest_money      =   rows[0].init_invest_money;      /* 초기투자금액 */
                                            v_simul_mast.bench_mark_cd          =   rows[0].bench_mark_cd;          /* 벤치마크 (COM008) */
                                            v_simul_mast.bench_index_cd01       =   rows[0].bench_index_cd01      /* 벤치마크 인덱스 코드 ( F16013 ) */
                                            v_simul_mast.bench_index_cd02       =   rows[0].bench_index_cd02      /* 벤치마크 인덱스 코드 ( large_type ) */
                                            v_simul_mast.bench_index_cd03       =   rows[0].bench_index_cd03      /* 벤치마크 인덱스 코드 ( middle_type ) */
                                            v_simul_mast.bench_index_nm         =   rows[0].bench_index_nm        /* 벤치마크 인덱스 코드명 */
                                            v_simul_mast.importance_method_cd   =   rows[0].importance_method_cd;   /* 비중설정방식 (COM009) */
                                        }                                        
									}

                                    callback(null, paramData);
                                });
                            }
                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulListByBacktest Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 2. scen_cd 에 존재하는 리밸런싱 일자를 조회한다. */
                    function(msg, callback) {

                        try{

                            stmt = mapper.getStatement('simulationBacktest', 'getRebalanceDateByScenCd', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getRebalanceDateByScenCd Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }


                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 리밸런싱 일자 정보가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 리밸런싱 일자 정보가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }

                                v_arrRebalanceDate  =   rows;

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getRebalanceDateByScenCd Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                        

                    /* 3. scen_cd 에 존재하면서 start_year 기준 이력 데이터를 조회한다. */
                    function(msg, callback) {

                        try{
                            stmt = mapper.getStatement('simulationBacktest', 'getSimulHistListByScenCd2', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getSimulHistListByScenCd2 Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0  ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }                            

                                var startTime1   =   new Date();

                            /*************************************************************************************************************
                            *   시뮬레이션 이력정보로 백테스트 수행결과를 반환한다.
                            **************************************************************************************************************/
                                v_resultSimulData  =   fn_get_simulation_data(
                                        v_simul_mast            /* 시뮬레이션 기본 마스터 정보 */
                                    ,   rows                    /* 일자별 종목 이력 데이터 */
                                    ,   v_arrRebalanceDate      /* 리밸런싱 일자 정보 */
                                    ,   v_simulPortfolio        /* [tm_simul_portfolio] 기준 종목 데이터 */
                                );

                                var endTime1   =   new Date();

                                console.log( fn_show_diff_time( "시뮬레이션 script 계산", startTime1, endTime1 ) );

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulHistListByScenCd2 Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 4. (백테스트) tm_simul_result_daily 결과를 삭제한다. */
                    function(msg, callback) {

                        var startTime   =   new Date();

                        try {

                            stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResultDaily', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {
                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResultDaily Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResultDaily Error while performing Query";

                            var endTime   =   new Date();
                            console.log( fn_show_diff_time( "tm_simul_result_daily DB 삭제시간", startTime, endTime ) );

                            if( !resultMsg.err ) {
                                resultMsg.err = err;
                            }

                            return callback(resultMsg);
                        }
                    },

                    /* 5. (백테스트) tm_simul_result_daily 결과를 저장한다. */
                    function(msg, callback) {

                        divideList  =   [];

                        /* daily 건이 존재하는 경우 */
                        if( v_resultSimulData.arr_daily && v_resultSimulData.arr_daily.length > 0 ) {

                            var startTime   =   new Date();

                            async.forEachOfLimit( v_resultSimulData.arr_daily, 1, function(subList, i, innerCallback) {

                                async.waterfall([

                                    function(innerCallback) {
                                        subList.F15028_S  =   subList.tot_F15028_S;
                                        subList.F15028_C  =   subList.tot_F15028_C;

                                        divideList.push( subList );
                                        
                                        innerCallback(null, paramData);
                                    },

                                    function(msg, innerCallback) {

                                        var divide_size = ( limit && limit.result_dive_size ? limit.result_dive_size : 1 );
                                        if( divideList && ( divideList.length == divide_size || i == v_resultSimulData.arr_daily.length-1 ) ) {
                                            try {
                                                paramData.dataLists =   divideList;
                                                stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultDaily', paramData, format);
//                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulationBacktest.saveTmSimulResultDaily Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulationBacktest.saveTmSimulResultDaily Error while performing Query";

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
                                        resultMsg.msg = "[error] simulationBacktest.saveTmSimulResultDaily Error while performing Query";
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

                                var endTime   =   new Date();
                                console.log( fn_show_diff_time( "tm_simul_result_daily DB 등록시간 ( 총 건수: " + v_resultSimulData.arr_daily.length + " 건 )", startTime, endTime ) );

                                callback(null, paramData);
                            });

                        }else{
                            callback(null, paramData);
                        }

                    },

                    /* 6. (백테스트) tm_simul_result_rebalance 결과를 삭제한다. */
                    function(msg, callback) {

                        var startTime   =   new Date();

                        try {

                            stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResultRebalance', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {
                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResultRebalance Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResultRebalance Error while performing Query";

                            var endTime   =   new Date();
                            console.log( fn_show_diff_time( "tm_simul_result_rebalance DB 삭제시간", startTime, endTime ) );

                            if( !resultMsg.err ) {
                                resultMsg.err = err;
                            }

                            return callback(resultMsg);
                        }
                    },

                    /* 7. (백테스트) tm_simul_result_rebalance 결과를 저장한다. */
                    function(msg, callback) {

                        divideList  =   [];

                        var arr_result_rebalance    =   [];

						if( v_resultSimulData.arr_rebalance && v_resultSimulData.arr_rebalance.length > 0 ) {
							v_resultSimulData.arr_rebalance.forEach( function( item, index, array ) {

								Object.keys( array[ index ] ).forEach( function( key ) {
									var sub_item    =   array[ index ][ key ];

									arr_result_rebalance.push( sub_item );
								});
							});
						}

                        
                        if( arr_result_rebalance && arr_result_rebalance.length > 0 ) {

                            var startTime   =   new Date();

                            async.forEachOfLimit( arr_result_rebalance, 1, function(subList, i, innerCallback) {

                                async.waterfall([

                                    function(innerCallback) {

                                        divideList.push( subList );
                                        
                                        innerCallback(null, paramData);
                                    },

                                    function(msg, innerCallback) {

                                        var divide_size = ( limit && limit.result_dive_size ? limit.result_dive_size : 1 );
                                        if( divideList && ( divideList.length == divide_size || i == arr_result_rebalance.length-1 ) ) {
                                            try {
                                                paramData.dataLists =   divideList;
                                                stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultRebalance', paramData, format);
//                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulationBacktest.saveTmSimulResultRebalance Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulationBacktest.saveTmSimulResultRebalance Error while performing Query";

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
                                        resultMsg.msg = "[error] simulationBacktest.saveTmSimulResultRebalance Error while performing Query";
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

                                var endTime   =   new Date();
                                console.log( fn_show_diff_time( "tm_simul_result_rebalance DB 등록시간 ( 총 건수: " + arr_result_rebalance.length + " 건 )", startTime, endTime ) );

                                callback(null, paramData);
                            });

                        }else{
                            callback(null, paramData);
                        }

                    },                    


/*************************************************************************************
*   추후 아래 삭제 및 저장 부분은 삭제 예정 START
*************************************************************************************/
                    /* 8. (백테스트) tm_simul_result 결과를 삭제한다. */
                    function(msg, callback) {

                        var startTime   =   new Date();
                        try {

                            stmt = mapper.getStatement('simulationBacktest', 'deleteTmSimulResult', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {
                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResult Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResult Error while performing Query";

                            var endTime   =   new Date();
                            console.log( fn_show_diff_time( "tm_simul_result DB 삭제시간", startTime, endTime ) );

                            if( !resultMsg.err ) {
                                resultMsg.err = err;
                            }

                            return callback(resultMsg);
                        }
                    },

                    /* 9. (백테스트) 시뮬레이션 결과를 저장한다. */
                    function(msg, callback) {


                        /* tm_simul_result 테이블에 저장하기 위한 변수 설정 */
                        if (    v_resultSimulData 
                            &&  v_resultSimulData.dailyJongmokObj 
                            &&  Object.keys( v_resultSimulData.dailyJongmokObj ).length > 0 
                        ) {

                            for( var i=0; i < Object.keys( v_resultSimulData.dailyJongmokObj ).length; i++ ) {
                                var v_F12506        =   Object.keys( v_resultSimulData.dailyJongmokObj )[i];
                                var v_subItem       =   v_resultSimulData.dailyJongmokObj[ v_F12506 ];
                                var v_mastItem      =   v_resultSimulData.dailyObj[ v_F12506 ];

                                for( var j=0; j < Object.keys( v_resultSimulData.dailyJongmokObj[ v_F12506 ] ).length; j++ ) {
                                    var v_dataKey       =   Object.keys( v_resultSimulData.dailyJongmokObj[ v_F12506 ] )[j];
                                    var v_dataItem      =   v_resultSimulData.dailyJongmokObj[ v_F12506 ][ v_dataKey ];

                                    Object.assign( v_dataItem, v_mastItem );
                                    arrInsertDtl.push( v_dataItem  );
                                }
                            }
                        }


                        divideList  =   [];

                        /* 등록건이 존재하는 경우 */
                        if( arrInsertDtl && arrInsertDtl.length > 0 ) {

                            var startTime   =   new Date();

                            async.forEachOfLimit( arrInsertDtl, 1, function(subList, i, innerCallback) {

                                async.waterfall([

                                    function(innerCallback) {
                                        divideList.push( subList );
                                        
                                        innerCallback(null, paramData);
                                    },

                                    function(msg, innerCallback) {

                                        var divide_size = ( limit && limit.result_dive_size ? limit.result_dive_size : 1 );
                                        if( divideList && ( divideList.length == divide_size || i == arrInsertDtl.length-1 ) ) {
                                            try {
                                                paramData.dataLists =   divideList;
                                                stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResult', paramData, format);
//                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulationBacktest.saveTmSimulResult Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulationBacktest.saveTmSimulResult Error while performing Query";

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
                                        resultMsg.msg = "[error] simulationBacktest.saveTmSimulResult Error while performing Query";
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

                                var endTime   =   new Date();
                                console.log( fn_show_diff_time( "시뮬레이션 DB 등록시간 ( 총 건수: " + arrInsertDtl.length + " 건 )", startTime, endTime ) );

                                callback(null, paramData);
                            });

                        }else{
                            callback(null, paramData);
                        }

                    },

/*************************************************************************************
*   추후 아래 삭제 및 저장 부분은 삭제 예정 END
*************************************************************************************/

                ], function(err) {

                    if (err) {
                        console.log(err, stmt, paramData);
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

        console.log(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulationBacktest.saveBacktestResult 오류가 발생하였습니다.";
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
var getBacktestResult = function(req, res) {
    try {
        log.debug('simulationBacktest.runBacktest 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationBacktest.runBacktest  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulationBacktest.runBacktest  req.body.data no data.";

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
                                stmt = mapper.getStatement('simulationBacktest', 'getSimulListByBacktest', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationBacktest.getSimulListByBacktest Error while performing Query";
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

                                    callback(null, paramData);
                                });
                            }
                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulListByBacktest Error while performing Query";
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
                                    resultMsg.msg = "[error] simulationBacktest.getSimulResultDaily Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( rows || rows.length > 0 ) {
                                    resultMsg.arr_result_daily      =   rows;

                                    fn_set_balance( resultMsg.arr_result_daily, resultMsg.simul_result_mast );
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulResultDaily Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 3. tm_simul_result_daily 테이블 기준 td_index_hist 테이블에서 bench_mark 와 일치하는 정보를 조회한다.*/
                    function(msg, callback) {

                        try{

                            if(     resultMsg.simul_result_mast 
                                &&  resultMsg.simul_result_mast.bench_mark_cd
                                &&  resultMsg.simul_result_mast.bench_mark_cd       != "0"
                                &&  resultMsg.simul_result_mast.bench_index_cd01
                                &&  resultMsg.simul_result_mast.bench_index_cd02
                                &&  resultMsg.simul_result_mast.bench_index_cd03
                            ) {
                                paramData.start_year        =   resultMsg.simul_result_mast.start_year;
                                paramData.bench_mark_cd     =   resultMsg.simul_result_mast.bench_mark_cd;
                                paramData.bench_index_cd01  =   resultMsg.simul_result_mast.bench_index_cd01;   /* F16013 */
                                paramData.bench_index_cd02  =   resultMsg.simul_result_mast.bench_index_cd02;   /* large_type */
                                paramData.bench_index_cd03  =   resultMsg.simul_result_mast.bench_index_cd03;   /* middle_type */

                                stmt = mapper.getStatement('simulationBacktest', 'getSimulBenchMark', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationBacktest.getSimulBenchMark Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( rows || rows.length > 0 ) {
                                        fn_set_bench_mark( resultMsg.arr_result_daily, rows );
                                    }

                                    callback(null, paramData);
                                });
                                
                            }else{
                                callback(null, paramData);
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulBenchMark Error while performing Query";
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
                                    resultMsg.msg = "[error] simulationBacktest.getSimulResultRebalance Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( rows || rows.length > 0 ) {
                                    resultMsg.arr_result_rebalance      =   rows;
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulResultRebalance Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    


                ], function(err) {

                    if (err) {
                        console.log(err, stmt, paramData);
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

        console.log(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulationBacktest.runBacktest 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.arr_result_daily      =   [];
        resultMsg.arr_result_rebalance  =   [];
        resultMsg.simul_result_mast     =   {};

        res.json(resultMsg);
        res.end();
    }
}


/*
* 경과된 시간정보를 시분초로 보여준다.
* 2019-08-14  bkLove(촤병국)
*/
function    fn_show_diff_time( p_title, p_startTime, p_endTime ) {

    var showLog     =   "";

    try{
        var delta       =   ( p_endTime.getTime() - p_startTime.getTime() ) / 1000;

        /* 시 정보 */
        var hours       =   Math.floor( delta / 3600 ) % 24; 
        delta -= hours * 3600;

        /* 분 정보 */
        var minutes     =   Math.floor( delta / 60) % 60;
        delta -= minutes * 60;

        /* 초 정보 */
        var seconds     =   Math.floor( delta % 60 );
        delta -= seconds;

        /* mili second 정보 */
        var delta       =   ( Math.round( delta * 1000 ) / 1000 ) * 1000;


        showLog +=  "\n#########################################################\n";
        showLog +=  "* " + p_title + "\n";
        showLog +=  "---------------------------------------------------------\n";
        showLog +=  "start_time = ["  +   dateToStr( p_startTime )      +   "]\n";
        showLog +=  "end_time   = ["  +   dateToStr( p_endTime )        +   "]\n";
        showLog +=  "run_time   = [";

        /* 시간 차이가 없는 경우 */
        if( ( p_endTime.getTime() - p_startTime.getTime() ) <= 0 ){
            showLog +=  "00:00:00";
        }

        else {
            showLog     +=      lpad( hours, 2 ) 
                +   ":"     +   lpad( minutes, 2 )
                +   ":"     +   lpad( seconds, 2 )

                +   "."     +   lpad( delta, 3 )
                +   " sec";
        }

        showLog +=  "]\n";
        showLog +=  "#########################################################\n";

    }catch( e ) {
        console.log( "fn_show_diff_time error ", e );
    }
    
    return showLog;


    /*
    * date 를 날짜형식으로 반환한다.
    * 2019-08-14  bkLove(촤병국)
    */
    function    dateToStr( p_date ) {
        var strDate     =
                        lpad( p_date.getFullYear()   , 4) 
            +   '-' +   lpad( p_date.getMonth() + 1  , 2) 
            +   '-' +   lpad( p_date.getDate()       , 2) 
            
            +   ' ' +   lpad( p_date.getHours()      , 2 ) 
            +   ':' +   lpad( p_date.getMinutes()    , 2 ) 
            +   ':' +   lpad( p_date.getSeconds()    , 2 );

        return  strDate;
    }

    /*
    * left padd 하여 반환한다.
    * 2019-08-14  bkLove(촤병국)
    */
    function lpad( n, digits ) {
        var zero = '';
        n = n.toString();

        if ( n.length < digits ) {
            for (i = 0; i < digits - n.length; i++) {
                zero += '0';
            }
        }

        return zero + n;
    }

}

/*
*   일자별 지수에 밴치마크 정보를 설정한다.
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
                    Number( v_prev_daily.balance ) * ( Number( v_daily.INDEX_RATE ).toFixed(2) / Number( v_prev_daily.INDEX_RATE ).toFixed(2) )
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

            /* 최초인 경우 */
            if( i == 0 ) {
                v_daily.bm_1000_data    =   1000;
                v_daily.bm_return_data  =   (
                    ( Number( v_daily.bm_1000_data ) - Number( v_daily.bm_1000_data ) ) / Number( v_daily.bm_1000_data )
                ).toFixed(17);
            }else{
                /* 1000 단위환산 = 전일 단위환산 * ( 당일지수 / 전일 지수 ) */
                v_daily.bm_1000_data    =   (
                        Number( v_prev_daily.bm_1000_data ) *
                        ( Number( v_daily.bm_data01 ) / Number( v_prev_daily.bm_data01 ) )
                ).toFixed(17);

                /* return = ( 당일 단위환산 - 전일 단위환산 ) / 전일 단위환산 */
                v_daily.bm_return_data  =   (
                        ( Number( v_daily.bm_1000_data ) - Number( v_prev_daily.bm_1000_data ) ) / Number( v_prev_daily.bm_1000_data )
                ).toFixed(17);
            }

            if( i > 0 ) {
                v_prev_index    =   i;
            }            
        }
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
	) {

		var v_prev_F12506               =   "";         /* 이전 입회일자 */
		var v_next_F12506               =   "";         /* 이후 입회일자 */

		var v_before_F12506             =   "";         /* 직전 입회일자 */
		var v_first_F12506              =   "";         /* 최초 입회일자 */
		var v_first_record_yn           =   "N";        /* 최초 레코드 여부 */
		

		var v_dailyJongmokObj           =   {};         /* 일자별 종목 데이터 */
		var v_dailyObj                  =   {};         /* 일자별 결과 정보 */
		var v_eventObj                  =   {};         /* 이벤트 변동 발생여부 */

		var v_arr_daily                 =   [];         /* array 일자별 데이터 */
		var v_arr_rebalance             =   [];         /* array rebalance 데이터 */

        var v_rebalanceObj              =   {};

	
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


// if( [ "20171228" ].includes( v_F12506 ) ) {
//     console.log( "v_F12506", v_F12506, "v_daily.tot_F15028_3", v_daily.tot_F15028_3 );
// }


                        try{

                            if( v_daily.rebalancing   ==   "1" ) {
                                v_prev_rebalancing_F12506   =   v_F12506;
                            }


                            var v_change_yn  =   "N";

                            if(  v_first_record_yn == "Y" ) {

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

                                    var v_rebalanceDate     =   v_rebalanceObj[ v_F12506 ];
                                    var v_jongmok_temp      =   Object.assign( {}, v_jongmok );
                                    var v_prev_jongmok_temp =   Object.assign( {}, v_prev_jongmok );


                                    /* 첫 리밸런싱인 경우 */
                                    if( v_rebalance_cnt == 0 ) {

                                    /* 현재 종목기준으로 검색 */
                                        for( var j=0; j < Object.keys( v_jongmok_temp ).length; j++ ) {
                                            var v_key       =   Object.keys( v_jongmok_temp )[j];
                                            var v_tempItem  =   Object.assign( {}, v_jongmok_temp[ v_key ] );


                                            if( v_tempItem.IMPORT_YN == "1" ) {

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


                                            if( v_tempItem.IMPORT_YN == "1" ) {

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

    //                                                    v_jongmok_temp[ "KRW" ].BEFORE_IMPORTANCE =   "-1";

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


//                                    v_arr_rebalance.push( v_jongmok_temp );

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
                            console.log( "error ", e );
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
                                        for( var k=0; k < Object.keys( v_item.imp_jongmok ).length; k++ ) {
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

                                        if( v_item.org_jongmok[ v_key ] != "undefined" ) {
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
                        console.log( "error", e );
                    }
                }
			}

		}catch( e ) {
			console.log( "fn_get_simulation_data error", e );
		}

		return  { 
				dailyJongmokObj     :   v_dailyJongmokObj
			,   dailyObj            :   v_dailyObj
			,   arr_daily           :   v_arr_daily
			,   arr_rebalance       :   v_arr_rebalance
		};
	};


module.exports.saveBaicInfo = saveBaicInfo;
module.exports.saveBacktestResult = saveBacktestResult;
module.exports.getBacktestResult = getBacktestResult;