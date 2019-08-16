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

        var arrFirstHist                =   [];
        var simulPortfolio              =   {};
        var v_firstHistObj              =   {};         /* 백테스트 실행시 start_year 기준 직전 영업일 하루 데이터 정보 */
        var v_dailyJongmokObj           =   {};         /* 일자별 종목 데이터 */
        var v_dailyObj                  =   {};         /* 일자별 결과 정보 */

        resultMsg.dailyJongmokObj       =   {};
        resultMsg.dailyObj            =   {};
        resultMsg.simulMastObj          =   {};

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

                            stmt = mapper.getStatement('simulationBacktest', 'getSimulListByBacktestInsert', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getSimulListByBacktestInsert Error while performing Query";
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
                                    simulPortfolio[ rows[i].F16013 ]    =   rows[i];
                                }                                

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulListByBacktestInsert Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 12. 저장시 입력했던 정보로 start_year 기준 직전 영업일 하루 데이터를 조회한다. */
                    function(msg, callback) {

                        try{

                            stmt = mapper.getStatement('simulationBacktest', 'getSimulHistListByBacktestBeforeDateInsert', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getSimulHistListByBacktestBeforeDateInsert Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }


                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] " + paramData.start_year + "0101 직전 영업일 정보가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] " + paramData.start_year + "0101 직전 영업일 정보가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }


                                for( var i in rows ) {
                                    v_firstHistObj[ rows[i].F16013 ]    =   rows[i];
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulHistListByBacktestBeforeDateInsert Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 13. (백테스트) 백테스트 실행시 이력정보를 조회한다. */
                    function(msg, callback) {

                        try{

                            if( !v_firstHistObj || Object.keys( v_firstHistObj ).length == 0 ) {
                                resultMsg.result = false;
                                resultMsg.msg   = "[백테스트] " + paramData.start_year + "0101 직전 영업일 정보가 존재하지 않습니다.";
                                resultMsg.err   = "[백테스트] " + paramData.start_year + "0101 직전 영업일 정보가 존재하지 않습니다.";

                                return callback(resultMsg);                                
                            }

                            stmt = mapper.getStatement('simulationBacktest', 'getSimulHistListForInsert', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getSimulHistListForInsert Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0  ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }


                                if (rows && rows.length > 0) {

                                    var v_prev_F12506       =   "";         /* 이전 입회일자 */
                                    var v_next_F12506       =   "";         /* 이후 입회일자 */

                                    var v_before_F12506     =   "";         /* 직전 입회일자 */
                                    var v_first_F12506      =   "";         /* 최초 입회일자 */
                                    var v_first_record_yn   =   "N";        /* 최초 레코드 여부 */
                                    var v_eventObj          =   {};         /* 이벤트 변동 발생여부 */


                                    if( rows.length > 0 ) {

                                        v_first_F12506  =   rows[0].F12506;
                                        v_prev_F12506   =   rows[0].F12506;
                                        v_before_F12506 =   rows[0].F12506;
                                        
                                        /* 최초 영업일이 존재하는 경우 */
                                        if( arrFirstHist.length > 0 && arrFirstHist[0].F12506 ) {
                                            v_prev_F12506   =   arrFirstHist[0].F12506;
                                            v_before_F12506 =   arrFirstHist[0].F12506;


                                            if( !v_dailyObj[ arrFirstHist[0].F12506 ] || Object.keys( v_dailyObj[ arrFirstHist[0].F12506 ] ).length == 0  ) {
                                                v_dailyObj[ arrFirstHist[0].F12506 ]    =   {};
                                            }

                                            /* 
                                                (최초 레코드 기준 이전 영업일) 일자별로 종목들의 기초 데이터를 설정한다.
                                                -   최초일은 종가 기준으로 계산
                                                -   이후는 기준가 기준으로 계산
                                                -   T 일이 리밸런싱일자 인지 설정
                                            */
                                            fn_set_dayilyJongmok( 
                                                    {       
                                                            F12506          :   arrFirstHist[0].F12506
                                                        ,   first_oper_yn   :   "Y"
                                                    }
                                                ,   v_firstHistObj
                                                ,   v_dailyObj
                                                ,   simulPortfolio
                                            );

                                            /* (최초 레코드 기준 이전 영업일) 기준, 비교 시총 관련 정보를 조회한다. */
                                            fn_set_siga_sum(
                                                    {       
                                                            F12506          :   arrFirstHist[0].F12506
                                                        ,   v_before_F12506 :   arrFirstHist[0].F12506
                                                        ,   first_oper_yn   :   "Y"
                                                    }
                                                ,   v_firstHistObj
                                                ,   v_dailyObj
                                            );
                                        }
                                    }                                    

                                    for( var i=0; i < rows.length; i++ ) {

                                        v_next_F12506   =   "";

                                        if( !v_dailyJongmokObj[ rows[i].F12506 ] || Object.keys( v_dailyJongmokObj[ rows[i].F12506 ] ).length == 0  ) {
                                            v_dailyJongmokObj[ rows[i].F12506 ]    =   {};
                                        }

                                        if( !v_dailyObj[ rows[i].F12506 ] || Object.keys( v_dailyObj[ rows[i].F12506 ] ).length == 0  ) {
                                            v_dailyObj[ rows[i].F12506 ]    =   {};
                                        }

                                        v_dailyJongmokObj[ rows[i].F12506 ][ rows[i].F16013 ]  =   rows[i];


                                    /* 입회일자 기준 직전 일자 추출 */
                                        /* i-1 이 0 보다 큰 경우 - i-1 입회일자 셋팅 */
                                        if( i-1 >= 0 ) {
                                            v_prev_F12506   =   rows[i-1].F12506;
                                        }

                                        /* 입회일자가 달라지는 경우 */
                                        if( v_prev_F12506  !=  rows[i].F12506 ) {
                                            v_before_F12506 =   v_prev_F12506;
                                        }


                                    /* 입회일자가 바뀌는 경우 */

                                        /* i+1 이 마지막 인 경우 - i+1 입회일자 셋팅 */
                                        if( i+1 <= rows.length-1 ) {
                                            v_next_F12506   =   rows[i+1].F12506;
                                        }
                                        /* i 가 마지막인 경우 - 마지막 입회일자 셋팅 */
                                        else if( i == rows.length-1 ) {
                                            v_next_F12506   =   rows[i].F12506;
                                        }


                                        /* 입회일자가 달라지는 경우 */
                                        if(     v_next_F12506 != rows[i].F12506
                                            ||  i == rows.length-1 
                                        ) {

                                            /* 비교시가총액 변동 발생 여부 */
                                            v_dailyObj[ rows[i].F12506 ].change_yn   =   "N";

                                            v_first_record_yn  =   "N";
                                            if( v_first_F12506 == rows[i].F12506 ) {
                                                v_first_record_yn  =   "Y";
                                            }
                                            
                                            /* 
                                                일자별로 종목들의 기초 데이터를 설정한다.
                                                -   최초일은 종가 기준으로 계산
                                                -   이후는 기준가 기준으로 계산
                                                -   T 일이 리밸런싱일자 인지 설정
                                            */
                                            fn_set_dayilyJongmok( 
                                                    {       
                                                            rowInx          :   i
                                                        ,   F12506          :   rows[i].F12506
                                                        ,   v_before_F12506 :   v_before_F12506 
                                                        ,   first_record_yn :   v_first_record_yn
                                                    }
                                                ,   v_dailyJongmokObj
                                                ,   v_dailyObj                                                
                                                ,   simulPortfolio
                                            );

                                            /* 이벤트 변동 발생여부 */
/*
                                            v_eventObj    =   fn_get_event_check(
                                                    {       
                                                            F12506          :   rows[i].F12506
                                                        ,   v_before_F12506 :   v_before_F12506
                                                        ,   first_record_yn :   v_first_record_yn
                                                    }
                                                ,   v_dailyJongmokObj
                                                ,   v_dailyObj
                                                ,   v_firstHistObj
                                            );                                            
*/
                                            /* 기준, 비교 시총 관련 정보를 설정한다. */
                                            fn_set_siga_sum(
                                                    {       
                                                            rowInx          :   i
                                                        ,   F12506          :   rows[i].F12506
                                                        ,   v_before_F12506 :   v_before_F12506
                                                        ,   first_record_yn :   v_first_record_yn
                                                    }
                                                ,   v_dailyJongmokObj
                                                ,   v_dailyObj
                                                ,   v_firstHistObj
                                                ,   v_eventObj
                                            );


                                            /* 
                                                T일이 리밸런싱 일자인가? ( 주기와 일자가 같은 경우 ) 
                                            */
                                            if(     v_dailyObj[ rows[i].F12506 ].rebalance_cycle_cd_yn == 'Y'
                                                &&  v_dailyObj[ rows[i].F12506 ].rebalance_date_cd_yn == 'Y'
                                            ) {
                                                    v_dailyObj[ rows[i].F12506 ].rebalancing   =   "1";

                                                /*                                        
                                                    1. 리밸런싱 종목정보 LOAD
                                                    - 화면에서 입력받는 정보: 주기에 해당하는 종목 리스트, 배분비율
                                                    - DB에서 입력받는 정보: 종목의 T일 기준가, 종가, 상장주식수
                                                */

                                                /*
                                                    2. 종목별 지수적용비율 계산
                                                    - 구성 종목들의 지수적용비율을 각각계산한다
                                                    - A종목_지수적용비율 = 배분비율 * SUM(기준가 * 상장주식수) /  (A종목_기준가 * A종목상장주식수)
                                                    - 여기서 SUM(기준가 * 상장주식수) 는 T일의 구성종목의 [기준가*상장주식수] 총 합을 의미한다.
                                                */

                                                /*
                                                    3. 기준시가총액 재계산
                                                    - T일_기준시가총액 = T-1일_기준시가총액 * SUM( T일_기준가 * T일_상장주식수 * T일_지수적용비율) / T-1일_비교시가총액
                                                */

                                                /*
                                                    6. 비교시가총액 계산
                                                    - 비교시가총액 = SUM(종가*상장주식수*지수적용비율)
                                                */

                                                /*
                                                    7. 지수 산출
                                                    - 지수 = 비교시가총액 / 기준시가총액 * 1000
                                                */

                                                /* 지수 정보를 계산하여 설정한다. */
                                                fn_set_index_rate(
                                                        {       
                                                                rowInx          :   i
                                                            ,   F12506          :   rows[i].F12506
                                                            ,   v_before_F12506 :   v_before_F12506
                                                        }
                                                    ,   v_dailyJongmokObj
                                                    ,   v_dailyObj
                                                );
                                            }
                                            else{

                                                /*
                                                    4. 시장조치 확인을 위한 T-1일 비교시총과 T일 시가기준 비교시총  비교
                                                    - (1)T-1일 비교시가총액: 이전 루프에서 계산된 직전일의 비교시가총액 사용
                                                    - (2)T일 시가기준 비교시가총액: SUM(기준가 * 상장주식수 * 지수적용비율)
                                                    - (1) 과 (2) 의 값이 다를 경우 시장조치가 발생했다고 판단할 수 있다
                                                */
                                                /* 비교시가총액 변동이 발생했나? ( 전일 비교시총 총액 과 당일 기준시총 총액이 다른 경우 ) */
                                                if( v_dailyObj[ rows[i].F12506 ].prev_tot_F15028_C != v_dailyObj[ rows[i].F12506 ].tot_F15028_S ) {

                                                      /* 비교시가총액 변동 발생 여부 */
                                                      v_dailyObj[ rows[i].F12506 ].change_yn   =   "Y";
                                                }
// console.log( "######### 1" );
                                                /*
                                                    5. 종목별 지수적용비율 계산
                                                    - [2. 종목별 지수적용비율 계산] 과 다른 점은 배분비율을 사용하는 대신 직전일(T-1)의 종목비중을 넣어 계산한다는 것이다.
                                                    - A종목_지수적용비율 = (T-1일_A종목종가 * T-1일_A종목상장주식수 * T-1일_A종목지수적용비율) * SUM(T일_기준가 * T일_상장주식수) / (T일_ A종목기준가 * T일_A종목상장주식수)
                                                */

                                                /* 지수 정보를 계산하여 설정한다. */
                                                fn_set_index_rate(
                                                        {       
                                                                rowInx          :   i
                                                            ,   F12506          :   rows[i].F12506
                                                            ,   v_before_F12506 :   v_before_F12506
                                                        }
                                                    ,   v_dailyJongmokObj
                                                    ,   v_dailyObj
                                                );
                                            }


//                                             /*
//                                                 8. 지수 및 구성종목 정보 LOAD
//                                                 - 직전일의 지수 및 구성종목 정보는 당일에 사용되므로 관리한다.
//                                                 - 지수정보 : 기준시가총액, 비교시가총액, 지수
//                                                 - 구성종목정보 : 종목 리스트, 기준가, 종가, 상장주식수, 배분비율, 지수적용비율
//                                             */                                     
                                         }
                                    }

                                    resultMsg.dailyJongmokObj   =   v_dailyJongmokObj;
                                    resultMsg.dailyObj          =   v_dailyObj;
                                    resultMsg.simulMastObj      =   { 
                                            grp_cd                  :   paramData.grp_cd                /* 그룹코드(상위코드) */
                                        ,   scen_cd                 :   paramData.scen_cd               /* 시나리오 코드 */

                                        ,   scen_name               :   paramData.scen_name             /* 시나리오명 */
                                        ,   start_year              :   paramData.start_year            /* 시작년도 */
                                        ,   rebalance_cycle_cd      :   paramData.rebalance_cycle_cd    /* 리밸런싱주기 (COM006) */
                                        ,   rebalance_date_cd       :   paramData.rebalance_date_cd     /* 리밸런싱일자 (COM007) */
                                        ,   init_invest_money       :   paramData.init_invest_money     /* 초기투자금액 */
                                        ,   bench_mark_cd           :   paramData.bench_mark_cd         /* 벤치마크 (COM008) */
                                        ,   importance_method_cd    :   paramData.importance_method_cd  /* 비중설정방식 (COM009) */
                                    };

                                }

                                callback(null);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulHistListForInsert Error while performing Query";
                            resultMsg.err = err;

                            resultMsg.dailyJongmokObj   =   {};
                            resultMsg.dailyObj          =   {};

                            callback(resultMsg);
                        }
                    }                    

                ], function(err) {

                    if (err) {
                        log.error(err, stmt, paramData);
                        conn.rollback();

                    } else {
                        resultMsg.result        =   true;
                        resultMsg.msg           =   "성공적으로 저장하였습니다.";
                        resultMsg.grp_cd        =   paramData.grp_cd;               /* 그룹 코드 */
                        resultMsg.scen_cd       =   paramData.scen_cd;              /* 시나리오 코드 */
                        resultMsg.scen_order_no =   paramData.scen_order_no;        /* 시나리오 정렬순번 */

                        resultMsg.dailyJongmokObj   =   v_dailyJongmokObj;
                        resultMsg.dailyObj          =   v_dailyObj;

                        resultMsg.err           =   null;

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
        resultMsg.msg = "[error] simulationBacktest.saveBaicInfo 오류가 발생하였습니다.";
        resultMsg.err = expetion;
        resultMsg.dailyJongmokObj       =   {};
        resultMsg.dailyObj              =   {};

        res.json(resultMsg);
        res.end();
    }
}

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

        /* 시뮬레이션 포트폴리오 종목정보 */
        var simulPortfolio  =   {};
        var v_firstHistObj  =   {};
        var arrFirstHist    =   [];

        var arrInsertDtl    =   [];
        var divideList      =   [];

        resultMsg.dataList = [];
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


                                    /* 단축코드별 시뮬레이션 포트폴리오 정보를 저장한다. */
                                    for( var i in rows ) {
                                        simulPortfolio[ rows[i].F16013 ]    =   rows[i];
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

                    /* 2. scen_cd 에 존재하면서 start_year 기준 직전 영업일 하루 데이터를 조회한다. */
                    function(msg, callback) {

                        try{

                            stmt = mapper.getStatement('simulationBacktest', 'getSimulHistListByBeforeDateScenCd', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getSimulHistListByBeforeDateScenCd Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }


                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] " + paramData.start_year + "0101 직전 영업일 정보가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] " + paramData.start_year + "0101 직전 영업일 정보가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }


                                for( var i in rows ) {

                                    if( !v_firstHistObj[ rows[0].F12506 ] || Object.keys( v_firstHistObj[ rows[0].F12506 ] ).length == 0  ) {
                                        v_firstHistObj[ rows[0].F12506 ]    =   {};
                                    }

                                    v_firstHistObj[ rows[0].F12506 ][ rows[i].F16013 ]    =   rows[i];
                                }

                                arrFirstHist    =   rows;

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulHistListByBeforeDateScenCd Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 3. scen_cd 에 존재하면서 start_year 기준 이력 데이터를 조회한다. */
                    function(msg, callback) {

                        try{
                            stmt = mapper.getStatement('simulationBacktest', 'getSimulHistListByScenCd', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationBacktest.getSimulHistListByBacktest Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0  ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";
                                    resultMsg.err = "[백테스트] 시뮬레이션 할 이력 데이터가 존재하지 않습니다.";

                                    return callback(resultMsg);
                                }                            


                                if (rows && rows.length > 0) {

                                    var v_prev_F12506       =   "";         /* 이전 입회일자 */
                                    var v_next_F12506       =   "";         /* 이후 입회일자 */

                                    var v_before_F12506     =   "";         /* 직전 입회일자 */
                                    var v_first_F12506      =   "";         /* 최초 입회일자 */
                                    var v_first_record_yn   =   "N";        /* 최초 레코드 여부 */

                                    var v_dailyJongmokObj   =   {};         /* 일자별 종목 데이터 */
                                    var v_dailyObj          =   {};         /* 일자별 결과 정보 */
                                    var v_eventObj          =   {};         /* 이벤트 변동 발생여부 */



                                    /*************************************************************************************************************
                                    *   최초 레코드에 대한 일자를 설정한다.
                                    **************************************************************************************************************/
                                    if( rows.length > 0 ) {

                                        v_first_F12506  =   rows[0].F12506;
                                        v_prev_F12506   =   rows[0].F12506;
                                        v_before_F12506 =   rows[0].F12506;
                                        

                                        /*************************************************************************************************************
                                        *   최초 영업일을 설정한다.
                                        **************************************************************************************************************/
                                        if( arrFirstHist.length > 0 && arrFirstHist[0].F12506 ) {
                                            v_prev_F12506   =   arrFirstHist[0].F12506;
                                            v_before_F12506 =   arrFirstHist[0].F12506;


                                            if( !v_dailyObj[ arrFirstHist[0].F12506 ] || Object.keys( v_dailyObj[ arrFirstHist[0].F12506 ] ).length == 0  ) {
                                                v_dailyObj[ arrFirstHist[0].F12506 ]    =   {};
                                            }

                                            /* 
                                                (최초 레코드 기준 이전 영업일) 일자별로 종목들의 기초 데이터를 설정한다.
                                                -   최초일은 종가 기준으로 계산
                                                -   이후는 기준가 기준으로 계산
                                                -   T 일이 리밸런싱일자 인지 설정
                                            */
                                            fn_set_dayilyJongmok( 
                                                    {       
                                                            F12506          :   arrFirstHist[0].F12506
                                                        ,   first_oper_yn   :   "Y"
                                                    }
                                                ,   v_firstHistObj
                                                ,   v_dailyObj
                                                ,   simulPortfolio
                                            );

                                            /* (최초 레코드 기준 이전 영업일) 기준, 비교 시총 관련 정보를 조회한다. */
                                            fn_set_siga_sum(
                                                    {       
                                                            F12506          :   arrFirstHist[0].F12506
                                                        ,   v_before_F12506 :   arrFirstHist[0].F12506
                                                        ,   first_oper_yn   :   "Y"
                                                    }
                                                ,   v_firstHistObj
                                                ,   v_dailyObj
                                            );
                                        }
                                    }



                                    for( var i=0; i < rows.length; i++ ) {

                                        v_next_F12506   =   "";

                                        if( !v_dailyJongmokObj[ rows[i].F12506 ] || Object.keys( v_dailyJongmokObj[ rows[i].F12506 ] ).length == 0  ) {
                                            v_dailyJongmokObj[ rows[i].F12506 ]    =   {};
                                        }

                                        if( !v_dailyObj[ rows[i].F12506 ] || Object.keys( v_dailyObj[ rows[i].F12506 ] ).length == 0  ) {
                                            v_dailyObj[ rows[i].F12506 ]    =   {};
                                        }

                                        v_dailyJongmokObj[ rows[i].F12506 ][ rows[i].F16013 ]  =   rows[i];


                                    /* 입회일자 기준 직전 일자 추출 */

                                        /* i-1 이 0 보다 큰 경우 - i-1 입회일자 셋팅 */
                                        if( i-1 >= 0 ) {
                                            v_prev_F12506   =   rows[i-1].F12506;
                                        }

                                        /* 입회일자가 달라지는 경우 */
                                        if( v_prev_F12506  !=  rows[i].F12506 ) {
                                            v_before_F12506 =   v_prev_F12506;
                                        }


                                    /* 입회일자가 바뀌는 경우 */

                                        /* i+1 이 마지막 인 경우 - i+1 입회일자 셋팅 */
                                        if( i+1 <= rows.length-1 ) {
                                            v_next_F12506   =   rows[i+1].F12506;
                                        }
                                        /* i 가 마지막인 경우 - 마지막 입회일자 셋팅 */
                                        else if( i == rows.length-1 ) {
                                            v_next_F12506   =   rows[i].F12506;
                                        }


                                        /* 입회일자가 달라지는 경우 */
                                        if(     v_next_F12506 != rows[i].F12506
                                            ||  i == rows.length-1 
                                        ) {

                                            /* 비교시가총액 변동 발생 여부 */
                                            v_dailyObj[ rows[i].F12506 ].change_yn   =   "N";

                                            v_first_record_yn  =   "N";
                                            if( v_first_F12506 == rows[i].F12506 ) {
                                                v_first_record_yn  =   "Y";
                                            }
                                            

                                            /* 
                                                일자별로 종목들의 기초 데이터를 설정한다.
                                                -   최초일은 종가 기준으로 계산
                                                -   이후는 기준가 기준으로 계산
                                                -   T 일이 리밸런싱일자 인지 설정
                                            */
                                            fn_set_dayilyJongmok( 
                                                    {       
                                                            rowInx          :   i
                                                        ,   F12506          :   rows[i].F12506
                                                        ,   v_before_F12506 :   v_before_F12506
                                                        ,   first_record_yn :   v_first_record_yn
                                                    }
                                                ,   v_dailyJongmokObj
                                                ,   v_dailyObj
                                                ,   simulPortfolio
                                                ,   v_firstHistObj
                                            ); 


                                            /* 이벤트 변동 발생여부 */
                                            v_eventObj    =   fn_get_event_check(
                                                    {       
                                                            F12506          :   rows[i].F12506
                                                        ,   v_before_F12506 :   v_before_F12506
                                                        ,   first_record_yn :   v_first_record_yn
                                                    }
                                                ,   v_dailyJongmokObj
                                                ,   v_dailyObj
                                                ,   v_firstHistObj
                                            );

                                            /*************************************************************************************************************
                                            *   T일이 리밸런싱일자 인 경우
                                            **************************************************************************************************************/
                                            if( v_dailyObj[ rows[i].F12506 ].rebalancing   ==   "1" ) {

                                                /* 지수 정보를 계산하여 설정한다. */
                                                fn_set_index_rate(
                                                        {       
                                                                rowInx          :   i
                                                            ,   F12506          :   rows[i].F12506
                                                            ,   v_before_F12506 :   v_before_F12506
                                                            ,   first_record_yn :   v_first_record_yn
                                                        }
                                                    ,   v_dailyJongmokObj
                                                    ,   v_dailyObj
                                                    ,   v_firstHistObj
                                                );

                                            }else{

                                                /* 기준, 비교 시총 관련 정보를 설정한다. */
                                                fn_set_siga_sum(
                                                        {       
                                                                rowInx          :   i
                                                            ,   F12506          :   rows[i].F12506
                                                            ,   v_before_F12506 :   v_before_F12506
                                                            ,   first_record_yn :   v_first_record_yn
                                                        }
                                                    ,   v_dailyJongmokObj
                                                    ,   v_dailyObj
                                                    ,   v_firstHistObj
                                                    ,   v_eventObj
                                                );                                               


                                                /*************************************************************************************************************
                                                *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
                                                **************************************************************************************************************/    
                                                if( v_dailyObj[ rows[i].F12506 ].importance_method_cd   ==  "1" ) {

                                                    /*************************************************************************************************************
                                                    *   비교시가총액 변동이 발생한 경우
                                                    **************************************************************************************************************/                                                
                                                    if( v_dailyObj[ rows[i].F12506 ].prev_tot_F15028_C != v_dailyObj[ rows[i].F12506 ].tot_F15028_S ) {

                                                        /* 비교시가총액 변동 발생 여부 */
                                                        v_dailyObj[ rows[i].F12506 ].change_yn   =   "Y";
                                                    }
                                                }


                                                /* 지수 정보를 계산하여 설정한다. */
                                                fn_set_index_rate(
                                                        {       
                                                                rowInx          :   i
                                                            ,   F12506          :   rows[i].F12506
                                                            ,   v_before_F12506 :   v_before_F12506
                                                            ,   first_record_yn :   v_first_record_yn
                                                        }
                                                    ,   v_dailyJongmokObj
                                                    ,   v_dailyObj
                                                    ,   v_firstHistObj
                                                );
                                            }

                                            v_firstHistObj  =   {};
                                        }
                                    }



                                    for( var i=0; i < Object.keys( v_dailyJongmokObj ).length; i++ ) {
                                        var v_F12506        =   Object.keys( v_dailyJongmokObj )[i];
                                        var v_subItem       =   v_dailyJongmokObj[ v_F12506 ];
                                        var v_mastItem      =   v_dailyObj[ v_F12506 ];

                                        for( var j=0; j < Object.keys( v_dailyJongmokObj[ v_F12506 ] ).length; j++ ) {
                                            var v_dataKey       =   Object.keys( v_dailyJongmokObj[ v_F12506 ] )[j];
                                            var v_dataItem      =   v_dailyJongmokObj[ v_F12506 ][ v_dataKey ];

                                            Object.assign( v_dataItem, v_mastItem );


//                                          arrInsertDtl.push( v_dataItem  );
                                        }
                                    }
                                }

                                callback(null, paramData);
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.getSimulHistListByScenCd Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 3. (백테스트) 이미 존재하는 시뮬레이션 결과를 삭제한다. */
                    function(msg, callback) {

                        try {

                            callback(null, paramData);
/*                            
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
*/
                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulationBacktest.deleteTmSimulResult Error while performing Query";

                            if( !resultMsg.err ) {
                                resultMsg.err = err;
                            }

                            return callback(resultMsg);
                        }
                    },

                    /* 4. (백테스트) 시뮬레이션 결과를 저장한다. */
                    function(msg, callback) {

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

                                callback(null, paramData);
                            });

                        }else{
                            callback(null, paramData);
                        }

                    },                    

                ], function(err) {

                    if (err) {
                        log.error(err, stmt, paramData);
                        conn.rollback();

                    } else {
                        resultMsg.result = true;
                        resultMsg.msg = "성공적으로 저장하였습니다.";
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
        resultMsg.msg = "[error] simulationBacktest.runBacktest 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 일자별로 종목들의 기초 데이터를 설정한다.
 * 2019-08-14  bkLove(촤병국)
 */
var fn_set_dayilyJongmok = function( p_param={ rowInx : -1, F12506 : "", v_before_F12506 : "", first_oper_yn : "N", first_record_yn : "N" }, p_dailyJongmokObj, p_dailyObj, p_simulPortfolioObj, p_firstHistObj ) {

    /* 소수점시 계산시 사용할 고정값 */
    var numInfo     =   {
            IMPORTANCE_FIX_NUM      :   100                     /* 비중  소수점 계산시 사용할 고정값 */
        ,   IMPORTANCE_FIX_NUM1     :   10000                   /* 비중  소수점 계산시 사용할 고정값 */
        ,   JISU_RATE_FIX_NUM       :   100000000000000000      /* 지수적용비율 소수점 계산시 사용할 고정값 */
    };

    /* 현금 정보 */
    var krwInfo  =   {  
            F16013                  :   "KRW"           /* 종목코드 */
        ,   F16002                  :   "현금"          /* 종목명 */
        ,   importance              :   0               /* 비중 */

        ,   F15007                  :   1               /* 기준가 ( 전일 종가 ) - 기준가 */    
        ,   F30700                  :   1               /* 현재가 ( 당일 종가 ) - 종가 */
        ,   F16143                  :   100000000       /* 상장주식수 */
        ,   F15028                  :   0               /* 시가기준 시총 */
        ,   TODAY_RATE              :   0               /* 지수적용비율 */
        ,   BEFORE_RATE             :   0               /* (직전) 지수적용비율 */
        ,   KRW_exists_yn           :   "N"             /* 현금 존재여부 */
    };

    /* total 정보 */
    var totalInfo  =   {
            tot_F15028              :   0               /* 시가기준 시총 */
        ,   tot_F15028_1            :   0               /* 시가기준 시총 (종가) */
        ,   tot_F15028_2            :   0               /* 시가기준 시총(기준가) */

        ,   tot_F15028_S            :   0               /* 기준 시가총액 */
        ,   tot_F15028_C            :   0               /* 비교 시가총액 */
        ,   prev_tot_F15028_S       :   0               /* (직전) 기준 시가총액 */
        ,   prev_tot_F15028_C       :   0               /* (직전) 비교 시가총액 */
        ,   PREV_INDEX_RATE         :   0               /* (직전) 지수 */
        ,   INDEX_RATE              :   0               /* 지수 */
        ,   RETURN_VAL              :   0               /* RETURN_VAL */

        ,   start_year              :   ""              /* 시작년도 */
        ,   rebalance_cycle_cd      :   ""              /* 리밸런싱주기 (COM006) */
        ,   rebalance_date_cd       :   ""              /* 리밸런싱일자 (COM007) */
        ,   init_invest_money       :   0               /* 초기투자금액 */
        ,   bench_mark_cd           :   ""              /* 벤치마크 (COM008) */
        ,   importance_method_cd    :   ""              /* 비중설정방식 (COM009) */

        ,   rebalancing             :   "0"             /* 리밸런싱에 포함되는지 체크 */
    };


/* 1. 포트 폴리오를 기준으로 종목코드 할당 및 total 정보를 설정한다. */
    for( var i = 0; i < Object.keys( p_simulPortfolioObj ).length; i++ ) {
        var v_portKey     =   Object.keys( p_simulPortfolioObj )[i];
        var v_portItem    =   Object.assign( {}, p_simulPortfolioObj[ v_portKey ] );


        /*  일자별 이력에 존재하는 종목코드가 시뮬레이션 포트폴리오 종목에 존재하는 경우 
            - 시뮬레이션 포트폴리오 정보를 일자별 종목코드에 할당
        */
        if( Object.keys( p_dailyJongmokObj[ p_param.F12506 ] ).includes( v_portKey ) ) {
            v_portItem.F16013_exists_yn         =   "Y";                        /* 종목코드 존재여부 */

            v_portItem.TODAY_RATE               =   0;
            v_portItem.BEFORE_RATE              =   0;
            v_portItem.rebalancing              =   "0";

            Object.assign( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ],  v_portItem );

            if( totalInfo.rebalancing == "0" ) {
                if( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].rebanance_yn    ==  "Y"  ) {
                    totalInfo.rebalancing       =   "1";
                }
            }
        }
        else{
            /* importance_method_cd ( 비중) - 1 : 직접입력 / 2 : 동일가중 / 3 : 시총비중 */

            /* 일자별 이력에 종목코드가 없는 경우 현금존재여부 = 'Y' 로 설정 */
            if( krwInfo.KRW_exists_yn  ==  "N" ) {
                krwInfo.KRW_exists_yn   =   "Y";
            }
            

        /* 현금에서 사용할 정보 설정 */

            /* 존재하지 않는 항목들의 비중 누적 ( 비중이 정수로 되어 있어 100을 나눈다. ) */
            krwInfo.importance                  =   (
                    Number( krwInfo.importance )
                +   (
                            Number( v_portItem.importance )
                        /   numInfo.IMPORTANCE_FIX_NUM 
                    )
            );

        /* 항목정보 설정 */
            v_portItem.importance               =   0;                                                  /* 비중 */
            v_portItem.F15007                   =   0;                                                  /* 기준가 ( 전일 종가 ) - 기준가 */
            v_portItem.F30700                   =   0;                                                  /* 현재가 ( 당일 종가 ) - 종가 */
            v_portItem.F16143                   =   0;                                                  /* 상장주식수 */
            v_portItem.F16013_exists_yn         =   "N";                                                /* 종목코드 존재여부 */
            v_portItem.TODAY_RATE               =   0;
            v_portItem.BEFORE_RATE              =   0;
            v_portItem.rebalancing              =   "0";

            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ]     =   Object.assign( {},  v_portItem );
        }




        /* 비중 ( 비중이 정수로 되어 있어 100을 나눈다. ) */
        p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].importance  =       (
                Number( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].importance )
            /   numInfo.IMPORTANCE_FIX_NUM
        );


        /*************************************************************************************************************
        *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
        * 
        *   2 : 동일가중인 경우
        *   - 직전 영업일의 수정주가(종가)를 사용해야 되기 때문에 상장주식수:1, 기준가:0, 현재가:0 으로 설정함.
        **************************************************************************************************************/        
        /* 동일가중 , 최초 영업일인 경우 */
        if( v_portItem.importance_method_cd == "2" && p_param.first_oper_yn   ==  "Y" ) {

            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F16143     =   1;          /* 상장주식수(p_param.F16143) 를 모두 1로 설정한다. */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F30700     =   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15001 ? p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15001 : 0;        /* 현재가를 종가로 대체 */

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_1    =     fn_calc_data( 
                    "F15028_1"
                ,   { 
                            F30700  :   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F30700
                        ,   F16143  :   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F16143 
                    } 
            );

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_2    =     fn_calc_data( 
                    "F15028_1"
                ,   { 
                            F30700  :   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F30700
                        ,   F16143  :   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F16143 
                    } 
            );


        /* total 정보 설정 */

            /* 시가기준 시총 누적 - 종가 */
            totalInfo.tot_F15028_1                  =       Number( totalInfo.tot_F15028_1 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_1 );

            /* 시가기준 시총 누적 - 기준가 */
            totalInfo.tot_F15028_2                  =       Number( totalInfo.tot_F15028_2 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_2 );
        }
        /* 동일가중 , 최초 레코드인 경우 */
        else if( v_portItem.importance_method_cd == "2" && p_param.first_record_yn   ==  "Y" ) {

            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F16143     =   1;                                                                  /* 상장주식수(p_param.F16143) 를 모두 1로 설정한다. */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F30700     =   p_firstHistObj[ p_param.v_before_F12506 ][ v_portKey ].F30700;      /* 현재가를 종가로 대체 */

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_1    =  p_firstHistObj[ p_param.v_before_F12506 ][ v_portKey ].F15028_1;

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_2    =  p_firstHistObj[ p_param.v_before_F12506 ][ v_portKey ].F15028_2;


        /* total 정보 설정 */

            /* 시가기준 시총 누적 - 종가 */
            totalInfo.tot_F15028_1                  =       Number( totalInfo.tot_F15028_1 ) 
                                                        +   Number( p_firstHistObj[ p_param.v_before_F12506 ][ v_portKey ].F15028_1 );

            /* 시가기준 시총 누적 - 기준가 */
            totalInfo.tot_F15028_2                  =       Number( totalInfo.tot_F15028_2 ) 
                                                        +   Number( p_firstHistObj[ p_param.v_before_F12506 ][ v_portKey ].F15028_2 );

        }                
        /* 동일가중 인 경우 */
        else if( v_portItem.importance_method_cd == "2" ) {

            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F16143     =   1;       /* 상장주식수(p_param.F16143) 를 모두 1로 설정한다. */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F30700     =   p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_portKey ].F30700;       /* 현재가를 종가로 대체 */

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_1    =  p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_portKey ].F15028_1;

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_2    =  p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_portKey ].F15028_2;


        /* total 정보 설정 */

            /* 시가기준 시총 누적 - 종가 */
            totalInfo.tot_F15028_1                  =       Number( totalInfo.tot_F15028_1 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_1 );

            /* 시가기준 시총 누적 - 기준가 */
            totalInfo.tot_F15028_2                  =       Number( totalInfo.tot_F15028_2 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_2 );

        }        
        /* 직접입력인 경우 */
        else if( v_portItem.importance_method_cd == "1" ) {

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_1    =     fn_calc_data( 
                    "F15028_1"
                ,   { 
                            F30700  :   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F30700
                        ,   F16143  :   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F16143 
                    } 
            );

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
            p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_2    =     fn_calc_data( 
                    "F15028_2"
                ,   { 
                            F15007  :   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15007
                        ,   F16143  :   p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F16143 
                    } 
            );


        /* total 정보 설정 */

            /* 시가기준 시총 누적 - 종가 */
            totalInfo.tot_F15028_1                  =       Number( totalInfo.tot_F15028_1 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_1 );

            /* 시가기준 시총 누적 - 기준가 */
            totalInfo.tot_F15028_2                  =       Number( totalInfo.tot_F15028_2 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ v_portKey ].F15028_2 );
        }

        if( i == 0 ) {
            totalInfo.F12506                    =   p_param.F12506;                                     /* 입회일자 */
            totalInfo.grp_cd                    =   v_portItem.grp_cd;                                  /* 그룹코드(상위코드) */
            totalInfo.scen_cd                   =   v_portItem.scen_cd;                                 /* 시나리오코드 */
            totalInfo.start_year                =   v_portItem.start_year;                              /* 시작년도 */
            totalInfo.rebalance_cycle_cd        =   v_portItem.rebalance_cycle_cd;                      /* 리밸런싱주기 (COM006) */
            totalInfo.rebalance_date_cd         =   v_portItem.rebalance_date_cd;                       /* 리밸런싱일자 (COM007) */
            totalInfo.init_invest_money         =   v_portItem.init_invest_money;                       /* 초기투자금액 */
            totalInfo.bench_mark_cd             =   v_portItem.bench_mark_cd;                           /* 벤치마크 (COM008) */
            totalInfo.importance_method_cd      =   v_portItem.importance_method_cd;                    /* 비중설정방식 (COM009) */
        }
    }


/* 2. 현금이 존재하는 경우 현금 종목을 추가한다. */
    if( krwInfo.KRW_exists_yn == "Y" ) {

        p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ]   =   {};

        Object.assign( p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ],  krwInfo );

        Object.assign( p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ], totalInfo );


        /*************************************************************************************************************
        *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
        * 
        *   동일가중인 경우
        *   - 직전 영업일의 수정주가(종가)를 사용해야 되기 때문에 기준가, 현재가를 0 으로 설정함.
        **************************************************************************************************************/        
        /* 동일가중 , 최초 영업일인 경우 */
        if( v_portItem.importance_method_cd == "2" && p_param.first_oper_yn   ==  "Y" ) {

            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F16143     =   1;         /* 상장주식수(p_param.F16143) 를 모두 1로 설정한다. */
            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F30700     =   1;         /* 현재가를 종가로 대체 */

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_1    =     fn_calc_data( 
                    "F15028_1"
                ,   { 
                            F30700  :   p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F30700
                        ,   F16143  :   p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F16143 
                    } 
            );

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_2    =     fn_calc_data( 
                    "F15028_1"
                ,   { 
                            F30700  :   p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F30700
                        ,   F16143  :   p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F16143 
                    } 
            );


        /* total 정보 설정 */

            /* 시가기준 시총 누적 - 종가 */
            totalInfo.tot_F15028_1                  =       Number( totalInfo.tot_F15028_1 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_1 );

            /* 시가기준 시총 누적 - 기준가 */
            totalInfo.tot_F15028_2                  =       Number( totalInfo.tot_F15028_2 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_2 );
        }
        /* 동일가중 , 최초 레코드인 경우 */
        else if( v_portItem.importance_method_cd == "2" && p_param.first_record_yn   ==  "Y" ) {

            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F16143     =   1;       /* 상장주식수(p_param.F16143) 를 모두 1로 설정한다. */
            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F30700     =   1;       /* 현재가를 종가로 대체 */

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_1    =  p_firstHistObj[ p_param.v_before_F12506 ][ krwInfo.F16013 ].F15028_1;

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_2    =  p_firstHistObj[ p_param.v_before_F12506 ][ krwInfo.F16013 ].F15028_2;


        /* total 정보 설정 */

            /* 시가기준 시총 누적 - 종가 */
            totalInfo.tot_F15028_1                  =       Number( totalInfo.tot_F15028_1 ) 
                                                        +   Number( p_firstHistObj[ p_param.v_before_F12506 ][ krwInfo.F16013 ].F15028_1 );

            /* 시가기준 시총 누적 - 기준가 */
            totalInfo.tot_F15028_2                  =       Number( totalInfo.tot_F15028_2 ) 
                                                        +   Number( p_firstHistObj[ p_param.v_before_F12506 ][ krwInfo.F16013 ].F15028_2 );

        }

        /* 동일가중인 경우 */
        else if( v_portItem.importance_method_cd == "2" ) {

            if( typeof p_dailyJongmokObj[ p_param.v_before_F12506 ][ krwInfo.F16013 ] != "undefined" ) {

                p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F16143     =   1;       /* 상장주식수(p_param.F16143) 를 모두 1로 설정한다. */
                p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F30700     =   1;       /* 현재가를 종가로 대체 */

                /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
                p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_1    =  p_dailyJongmokObj[ p_param.v_before_F12506 ][ krwInfo.F16013 ].F15028_1;

                /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
                p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_2    =  p_dailyJongmokObj[ p_param.v_before_F12506 ][ krwInfo.F16013 ].F15028_2;


            /* total 정보 설정 */

                /* 시가기준 시총 누적 - 종가 */
                totalInfo.tot_F15028_1                  =       Number( totalInfo.tot_F15028_1 ) 
                                                            +   Number( p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_1 );

                /* 시가기준 시총 누적 - 기준가 */
                totalInfo.tot_F15028_2                  =       Number( totalInfo.tot_F15028_2 ) 
                                                            +   Number( p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_2 );
            }

        }
      
        /* 직접입력인 경우 */
        else if( v_portItem.importance_method_cd == "1" ) {

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_1   =   fn_calc_data( 
                    "F15028_1"
                ,   {       
                            F30700  :   p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F30700
                        ,   F16143  :   p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F16143 
                    } 
            );

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15002) */
            p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_2   =   fn_calc_data( 
                    "F15028_2"
                ,   {       
                            F15007  :   p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15007
                        ,   F16143  :   p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F16143 
                    } 
            );


        /* total 정보 *    
            /* 최초 시가기준 시총 누적 - 종가 */
            totalInfo.tot_F15028_1                  =       Number( totalInfo.tot_F15028_1 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_1 );

            /* 시가기준 시총 누적 - 기준가 */
            totalInfo.tot_F15028_2                  =       Number( totalInfo.tot_F15028_2 ) 
                                                        +   Number( p_dailyJongmokObj[ p_param.F12506 ][ krwInfo.F16013 ].F15028_2 );
        }
    }

    Object.assign( p_dailyObj[ p_param.F12506 ], totalInfo );
}


/*
 * 이벤트 변동여부를 체크한다.
 * 2019-08-14  bkLove(촤병국)
 */
var fn_get_event_check  =   function(    
        p_param={
                rowInx          :   -1
            ,   F12506          :   ""
            ,   v_before_F12506 :   ""
            ,   first_record_yn :   "N"
            ,   first_oper_yn   :   "N" 
        }
    ,   p_dailyJongmokObj
    ,   p_dailyObj
    ,   p_firstHistObj 
) {


    var eventObj    =   {
            F12506              :   p_param.F12506              /* 당일 */
        ,   before_F12506       :   p_param.v_before_F12506     /* 전일 */

        ,   tot_F15028_S        :   0                           /* 당일 기준시총 총액 */
        ,   tot_F15028_C        :   0                           /* 당일 비교시총 총액 */
        ,   tot_F15007_F16143   :   0                           /* 당일 기준가 * 상장주식수 총액 */

        ,   prev_tot_F15028_S   :   0                           /* 전일 기준시총 총액 */
        ,   prev_tot_F15028_C   :   0                           /* 전일 비교시총 총액 */

        ,   change_yn           :   "N"                         /* 변동여부 */
    };

    for( var i = 0; i < Object.keys( p_dailyJongmokObj[ p_param.F12506 ] ).length; i++ ) {

        var v_dataKey     =   Object.keys( p_dailyJongmokObj[ p_param.F12506 ] )[i];
        var v_dataItem    =   p_dailyJongmokObj[ p_param.F12506 ][ v_dataKey ];



        /* 기준가 기준 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
        v_dataItem.F15028                           =   v_dataItem.F15028_2;
        p_dailyObj[ p_param.F12506 ].tot_F15028     =   p_dailyObj[ p_param.F12506 ].tot_F15028_2;


        /* 최초인경우 */
        if( p_param.first_record_yn == "Y" ) {

            /* 지수적용비율 = 직전 지수적용 비율 */
            v_dataItem.TODAY_RATE           =   p_firstHistObj[ p_param.v_before_F12506 ][ v_dataKey ].TODAY_RATE;
        }else{

            /* 종목이 편입되기 전엔 krw 로 존재했다가 종목이 편입되게 되면 krw 항목이 없어지게 됨. */
            if( typeof p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ] != "undefined" ) {
                /* 지수적용비율 = 직전 지수적용 비율 */
                v_dataItem.TODAY_RATE           =   p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ].TODAY_RATE;
            }
        }

        v_dataItem.F15007_F16143            =   fn_calc_data( 
                "F15007_F16143"
            ,   {       
                        F15007          :   v_dataItem.F15007
                    ,   F16143          :   v_dataItem.F16143
                }
            ,   {}
        );


        /* 직접입력인 경우 */
        if( v_dataItem.importance_method_cd == "1"  ) {
            
            /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
            v_dataItem.F15028_S         =       fn_calc_data( 
                    "F15028_S_2"
                ,   {       
                            F15007          :   v_dataItem.F15007
                        ,   F16143          :   v_dataItem.F16143
                        ,   TODAY_RATE      :   v_dataItem.TODAY_RATE
                    }
                ,   {}
            );
        }
        /* 동일 가중인 경우 */
        else if( v_dataItem.importance_method_cd == "2"  ) {

            /* 기준 시가총액 = 수정기준가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
            v_dataItem.F15028_S     =       fn_calc_data(
                    "F15028_S_3"
                ,   {       
                            F30700          :   v_dataItem.F30700
                        ,   F16143          :   v_dataItem.F16143
                        ,   TODAY_RATE      :   v_dataItem.TODAY_RATE
                    }
                ,   {}
            );

        }        

        /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
        v_dataItem.F15028_C         =   fn_calc_data( 
                "F15028_C"
            ,   {       
                        F30700          :   v_dataItem.F30700
                    ,   F16143          :   v_dataItem.F16143
                    ,   TODAY_RATE      :   v_dataItem.TODAY_RATE 
                }
            ,   {}
        );             

        /* 당일 기준시총 총액 */
        eventObj.tot_F15028_S           =       Number( eventObj.tot_F15028_S )
                                            +   Number( v_dataItem.F15028_S );

        /* 당일 비교시총 총액 */
        eventObj.tot_F15028_C           =       Number( eventObj.tot_F15028_C )
                                            +   Number( v_dataItem.F15028_C );


        /* 기준가 * 상장주식수 총액 */
        eventObj.tot_F15007_F16143      =       Number( eventObj.tot_F15007_F16143 )
                                            +   Number( v_dataItem.F15007_F16143 );
    }


    /* 전일 비교시총 총액 */
    eventObj.prev_tot_F15028_C          =   p_dailyObj[ p_param.v_before_F12506 ].tot_F15028_C;

    /* 전일 기준시총 총액 */
    eventObj.prev_tot_F15028_S          =   p_dailyObj[ p_param.v_before_F12506 ].tot_F15028_S;

    /* 기준가 * 상장주식수 총액 */
    p_dailyObj[ p_param.F12506 ].tot_F15007_F16143     =   eventObj.tot_F15007_F16143;


    /* 변동이 발생되지 않은 경우 */
    if( eventObj.tot_F15028_S != eventObj.prev_tot_F15028_C ) {
        eventObj.change_yn      =   "Y";
    }

    return  eventObj;
};



/*
 * 기준, 비교 시총 관련 정보를 설정한다.
 * 2019-08-14  bkLove(촤병국)
 */
var fn_set_siga_sum     =   function(    
        p_param={       
                rowInx          :   -1
            ,   F12506          :   ""
            ,   v_before_F12506 :   ""
            ,   first_record_yn :   "N"
            ,   first_oper_yn   :   "N" 
        }
    ,   p_dailyJongmokObj
    ,   p_dailyObj
    ,   p_firstHistObj 
    ,   p_eventObj
) {
    /* total 정보 */
    var totalInfo  =   {
            tot_F15028              :   p_dailyObj[ p_param.F12506 ].tot_F15028             /* 시가기준 시총 */
        ,   tot_F15028_1            :   p_dailyObj[ p_param.F12506 ].tot_F15028_1           /* 시가기준 시총 - 종가 */
        ,   tot_F15028_2            :   p_dailyObj[ p_param.F12506 ].tot_F15028_2           /* 시가기준 시총 - 기준가 */

        ,   tot_F15028_S            :   0                                                   /* 기준 시가총액 */
        ,   tot_F15028_C            :   0                                                   /* 비교 시가총액 */
        ,   prev_tot_F15028_S       :   p_dailyObj[ p_param.F12506 ].prev_tot_F15028_S      /* (직전) 기준 시가총액 */
        ,   prev_tot_F15028_C       :   p_dailyObj[ p_param.F12506 ].prev_tot_F15028_C      /* (직전) 비교 시가총액 */
        ,   INDEX_RATE              :   p_dailyObj[ p_param.F12506 ].INDEX_RATE             /* 지수 */
        ,   PREV_INDEX_RATE         :   p_dailyObj[ p_param.F12506 ].PREV_INDEX_RATE        /* (직전) 지수 */
        ,   RETURN_VAL              :   p_dailyObj[ p_param.F12506 ].RETURN_VAL             /* RETURN_VAL */
    };

    for( var i = 0; i < Object.keys( p_dailyJongmokObj[ p_param.F12506 ] ).length; i++ ) {

        var v_dataKey     =   Object.keys( p_dailyJongmokObj[ p_param.F12506 ] )[i];
        var v_dataItem    =   p_dailyJongmokObj[ p_param.F12506 ][ v_dataKey ];


        /* [최초 영업일] 인 경우 종가 기준으로 계산하여 설정한다. */
        if( p_param.first_oper_yn    ==  "Y" ) {

            /* 종가 기준 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            v_dataItem.F15028                           =   v_dataItem.F15028_1;
            p_dailyObj[ p_param.F12506 ].tot_F15028     =   p_dailyObj[ p_param.F12506 ].tot_F15028_1;



            /* 직접입력인 경우 */
            if( v_dataItem.importance_method_cd == "1"  ) {

                /* 지수적용비율 = ( 비중(importance) * SUM(시가기준 시총 tot_F15028 ) ) / 현재종목 시가 총액( F15028 ) */
                v_dataItem.TODAY_RATE           =       fn_calc_data( 
                        "TODAY_RATE1"
                    ,   {       
                                importance      :   v_dataItem.importance
                            ,   F15028          :   v_dataItem.F15028 
                        }
                    ,   {       
                                tot_F15028      :   p_dailyObj[ p_param.F12506 ].tot_F15028_1
                        }
                );

            }
            /* 동일 가중인 경우 */
            else if( v_dataItem.importance_method_cd == "2"  ) {

                /* 지수적용비율 = ( 비중(importance) * SUM( 수정기준가 총합 tot_F30700 ) ) / 수정기준가( F30700 ) */
                v_dataItem.TODAY_RATE   =       fn_calc_data(
                        "TODAY_RATE3"
                    ,   {       
                                importance  :   v_dataItem.importance
                            ,   F30700      :   v_dataItem.F30700 
                        }
                    ,   {       
                                tot_F30700  :   p_dailyObj[ p_param.F12506 ].tot_F15028
                        }
                );

            }

            /* 기준 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
            v_dataItem.F15028_S             =       fn_calc_data( 
                    "F15028_S_1"
                ,   {       
                            F30700          :   v_dataItem.F30700
                        ,   F16143          :   v_dataItem.F16143
                        ,   TODAY_RATE      :   v_dataItem.TODAY_RATE
                    }
                ,   {}
            );
        }else{


            /*************************************************************************************************************
            *   T일이 리밸런싱일자가 아닌 경우
            **************************************************************************************************************/
            if( p_dailyObj[ p_param.F12506 ].rebalancing    !=  "1" ) {

                /* 기준가 기준 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
                v_dataItem.F15028                           =   v_dataItem.F15028_2;
                p_dailyObj[ p_param.F12506 ].tot_F15028     =   p_dailyObj[ p_param.F12506 ].tot_F15028_2;                


                /* 최초인경우 */
                if( p_param.first_record_yn == "Y" ) {


                    /* 직접입력인 경우 */
                    if( v_dataItem.importance_method_cd == "1"  ) {

                        /* 지수적용비율 = ( 비중(importance) * SUM(시가기준 시총 tot_F15028 ) ) / 현재종목 시가 총액( F15028 ) */
                        v_dataItem.TODAY_RATE           =       fn_calc_data( 
                                "TODAY_RATE1"
                            ,   {       
                                        importance      :   v_dataItem.importance
                                    ,   F15028          :   v_dataItem.F15028 
                                }
                            ,   {       
                                        tot_F15028      :   p_dailyObj[ p_param.F12506 ].tot_F15028_2
                                }
                        );
                    }
                    /* 동일 가중인 경우 */
                    else if( v_dataItem.importance_method_cd == "2"  ) {

                        /* 지수적용비율 = ( 비중(importance) * SUM( 수정기준가 총합 tot_F30700 ) ) / 수정기준가( F30700 ) */
                        v_dataItem.TODAY_RATE   =       fn_calc_data(
                                "TODAY_RATE3"
                            ,   {       
                                        importance  :   v_dataItem.importance
                                    ,   F30700      :   v_dataItem.F30700 
                                }
                            ,   {       
                                        tot_F30700  :   p_dailyObj[ p_param.F12506 ].tot_F15028
                                }
                        );

                    }

                }else{

                    /*************************************************************************************************************
                    *   비교시가총액 변동이 발생한 경우
                    **************************************************************************************************************/
                    if( p_eventObj.change_yn == "Y" ) {

                        /*************************************************************************************************************
                        *   5. 종목별 지수적용비율 계산
                        *   - [2. 종목별 지수적용비율 계산] 과 다른 점은 배분비율을 사용하는 대신 직전일(T-1)의 종목비중을 넣어 계산한다는 것이다.
                        *   - A종목_지수적용비율 = (T-1일_A종목종가 * T-1일_A종목상장주식수 * T-1일_A종목지수적용비율) * SUM(T일_기준가 * T일_상장주식수) / (T일_ A종목기준가 * T일_A종목상장주식수)
                        **************************************************************************************************************/                       

                        /* 종목이 편입되기 전엔 krw 로 존재했다가 종목이 편입되게 되면 krw 항목이 없어지게 됨. */
                        if( typeof p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ] != "undefined" ) {
                            v_dataItem.TODAY_RATE   =   fn_calc_data(
                                    "TODAY_RATE2"
                                ,   {       
                                            importance          :   v_dataItem.importance
                                        ,   F30700              :   p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ].F30700            /* 직전 현재가 ( 당일 종가 ) - 종가 */                                                                    
                                        ,   F16143              :   p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ].F16143            /* 직전 상장주식수 */
                                        ,   TODAY_RATE          :   p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ].TODAY_RATE        /* 직전 종목지수 적용비율 */
                                        ,   F15028              :   v_dataItem.F15028
                                        ,   F15007_F16143       :   v_dataItem.F15007_F16143                                                    /* 기준가 * 상장주식수 */
                                    }
                                ,   {       
                                            tot_F15007_F16143   :   p_eventObj.tot_F15007_F16143
                                        ,   prev_tot_F15028_C   :   p_eventObj.prev_tot_F15028_C
                                    }
                            );
                        }

                    }else{

                        /* 종목이 편입되기 전엔 krw 로 존재했다가 종목이 편입되게 되면 krw 항목이 없어지게 됨. */
                        if( typeof p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ] != "undefined" ) {
                            v_dataItem.TODAY_RATE           =   p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ].TODAY_RATE;
                        }
                    }

                }
            }


            /* 직접입력인 경우 */
            if( v_dataItem.importance_method_cd == "1"  ) {

                /*************************************************************************************************************
                *   3. 기준시가총액 재계산
                *   - T일_기준시가총액 = T-1일_기준시가총액 * SUM( T일_기준가 * T일_상장주식수 * T일_지수적용비율) / T-1일_비교시가총액
                **************************************************************************************************************/
                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_dataItem.F15028_S         =   fn_calc_data(
                        "F15028_S_2"
                    ,   {       
                                F15007      :   v_dataItem.F15007
                            ,   F16143      :   v_dataItem.F16143
                            ,   TODAY_RATE  :   v_dataItem.TODAY_RATE
                        }
                    ,   {}
                );
            }

            /* 동일 가중인 경우 */
            else if( v_dataItem.importance_method_cd == "2"  ) {

                /* 기준 시가총액 = 수정기준가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_dataItem.F15028_S     =       fn_calc_data(
                        "F15028_S_3"
                    ,   {       
                                F30700          :   v_dataItem.F30700
                            ,   F16143          :   v_dataItem.F16143
                            ,   TODAY_RATE      :   v_dataItem.TODAY_RATE
                        }
                    ,   {}
                );

            }                
        }


        /* 직전 지수적용비율 */
        v_dataItem.BEFORE_RATE      =       v_dataItem.TODAY_RATE;

        /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
        v_dataItem.F15028_C         =       fn_calc_data( 
                "F15028_C"
            ,   {       
                        F30700          :   v_dataItem.F30700
                    ,   F16143          :   v_dataItem.F16143
                    ,   TODAY_RATE      :   v_dataItem.TODAY_RATE
                }
            ,   { }
        );

        /* 기준 시가총액 누적 */
        totalInfo.tot_F15028_S       =      Number( totalInfo.tot_F15028_S )
                                        +   Number( v_dataItem.F15028_S );

        /* 비교 시가총액 누적 */
        totalInfo.tot_F15028_C       =      Number( totalInfo.tot_F15028_C )
                                        +   Number( v_dataItem.F15028_C );
    }


    /* [최초 영업일] 인 경우 종가 기준으로 계산하여 설정한다. */
    if( p_param.first_oper_yn    ==  "Y" ) {

        /* T-1 일 기준 시가총액 */
        totalInfo.prev_tot_F15028_S     =   totalInfo.tot_F15028_S;

        /* T-1 일 기준 비교총액 */
        totalInfo.prev_tot_F15028_C     =   totalInfo.tot_F15028_C;

        /* T-1 일 지수 */
        totalInfo.PREV_INDEX_RATE       =   0;

    }else{

        /* T-1 일 기준 시가총액 */
        totalInfo.prev_tot_F15028_S     =   p_dailyObj[ p_param.v_before_F12506 ].tot_F15028_S;

        /* T-1 일 기준 비교총액 */
        totalInfo.prev_tot_F15028_C     =   p_dailyObj[ p_param.v_before_F12506 ].tot_F15028_C;

        /* T-1 일 지수 */
        totalInfo.PREV_INDEX_RATE       =   p_dailyObj[ p_param.v_before_F12506 ].PREV_INDEX_RATE;


        p_dailyObj[ p_param.F12506 ].tot_F15028_S           =   totalInfo.tot_F15028_S;
        p_dailyObj[ p_param.F12506 ].tot_F15028_C           =   totalInfo.tot_F15028_C;
        p_dailyObj[ p_param.F12506 ].prev_tot_F15028_S      =   totalInfo.prev_tot_F15028_S;
        p_dailyObj[ p_param.F12506 ].prev_tot_F15028_C      =   totalInfo.prev_tot_F15028_C;


        /*************************************************************************************************************
        *   T일이 리밸런싱일자가 아닌 경우
        **************************************************************************************************************/
        if( p_dailyObj[ p_param.F12506 ].rebalancing    !=  "1" ) {


            /*************************************************************************************************************
            *   비교시가총액 변동이 발생하지 않은 경우
            **************************************************************************************************************/
            if( p_dailyObj[ p_param.F12506 ].prev_tot_F15028_C == p_dailyObj[ p_param.F12506 ].tot_F15028_S ) {

                /* T일 기준 시가 총액 = T-1일 기준 시가총액 */
                totalInfo.tot_F15028_S      =   p_dailyObj[ p_param.F12506 ].prev_tot_F15028_S;
            }
        }
    }
  

    /*************************************************************************************************************
    *   7. 지수 산출
    *   - 지수 = 비교시가총액 / 기준시가총액 * 1000
    **************************************************************************************************************/

    /* 지수 = ( 비교 시가총액(p_totalInfo.tot_F15028_C) / 기준 시가총액(p_totalInfo.tot_F15028_S) ) * 1000  */
    totalInfo.INDEX_RATE    =   fn_calc_data(
            "INDEX_RATE"
        ,   {}
        ,   {       
                    tot_F15028_C        :   totalInfo.tot_F15028_C      /* 비교 시가총액 누적 */
                ,   tot_F15028_S        :   totalInfo.tot_F15028_S      /* 기준 시가총액 누적 */
            }
    );

    /* RETURN_VAL = ( 당일 지수(p_totalInfo.INDEX_RATE) - 전일 지수(p_totalInfo.BEFORE_INDEX_RATE) ) / 전일 지수(p_totalInfo.BEFORE_INDEX_RATE)  */
    totalInfo.RETURN_VAL    =   fn_calc_data(
            "RETURN_VAL"
        ,   {}
        ,   {       
                    INDEX_RATE          :   totalInfo.INDEX_RATE                                    /* 당일 지수 */
                ,   BEFORE_INDEX_RATE   :   p_dailyObj[ p_param.v_before_F12506 ].INDEX_RATE        /* 전일 지수 */
            }
    );  

    Object.assign( p_dailyObj[ p_param.F12506 ], totalInfo );


    /* 최초 영업일이 아닌 경우 */
    if( p_param.first_oper_yn    !=  "Y" ) {
        p_eventObj.tot_F15028_S             =   totalInfo.tot_F15028_S;
        p_eventObj.prev_tot_F15028_S        =   totalInfo.prev_tot_F15028_S;
        p_eventObj.prev_tot_F15028_C        =   totalInfo.prev_tot_F15028_C;
    }
};


/*
 * 지수 정보를 계산하여 설정한다.
 * 2019-08-14  bkLove(촤병국)
 */
var fn_set_index_rate    =   function(
        p_param={ 
                rowInx : -1
            ,   F12506 : ""
            ,   v_before_F12506: "" 
            ,   first_record_yn :   "N"
        }
    ,   p_dailyJongmokObj
    ,   p_dailyObj
    ,   p_firstHistObj
) {

    /* total 정보 */
    var totalInfo  =   {
            tot_F15028              :   p_dailyObj[ p_param.F12506 ].tot_F15028           /* 시가기준 시총 */
        ,   tot_F15028_S            :   0                                                   /* 기준 시가총액 */
        ,   tot_F15028_C            :   0                                                   /* 비교 시가총액 */
        ,   prev_tot_F15028_S       :   p_dailyObj[ p_param.F12506 ].prev_tot_F15028_S    /* (직전) 기준 시가총액 */
        ,   prev_tot_F15028_C       :   p_dailyObj[ p_param.F12506 ].prev_tot_F15028_C    /* (직전) 비교 시가총액 */
        ,   INDEX_RATE              :   p_dailyObj[ p_param.F12506 ].INDEX_RATE           /* 지수 */
        ,   PREV_INDEX_RATE         :   p_dailyObj[ p_param.F12506 ].INDEX_RATE           /* (직전) 지수 */
        ,   RETURN_VAL              :   p_dailyObj[ p_param.F12506 ].RETURN_VAL           /* RETURN_VAL */
    };


    for( var i = 0; i < Object.keys( p_dailyJongmokObj[ p_param.F12506 ] ).length; i++ ) {

        var v_dataKey     =   Object.keys( p_dailyJongmokObj[ p_param.F12506 ] )[i];
        var v_dataItem    =   p_dailyJongmokObj[ p_param.F12506 ][ v_dataKey ];


        /*************************************************************************************************************
        *   T일이 리밸런싱 일자인 경우
        **************************************************************************************************************/
        if( p_dailyObj[ p_param.F12506 ].rebalancing == "1" ) {

            /* 기준가 기준 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
            v_dataItem.F15028                           =   v_dataItem.F15028_2;
            v_dataItem.rebalancing                      =   "1";
            p_dailyObj[ p_param.F12506 ].tot_F15028     =   p_dailyObj[ p_param.F12506 ].tot_F15028_2;




            /*************************************************************************************************************
            *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
            * 
            *   2 : 동일가중인 경우
            *   - 직전 영업일의 수정주가(종가)를 사용해야 되기 때문에 상장주식수:1, 기준가:0, 현재가:0 으로 설정함.
            **************************************************************************************************************/        
            /* 직접입력인 경우 */
            if( v_dataItem.importance_method_cd == "1"  ) {

                /*************************************************************************************************************
                *   2. 종목별 지수적용비율 계산
                *   - 구성 종목들의 지수적용비율을 각각계산한다
                *   - A종목_지수적용비율 = 배분비율 * SUM(기준가 * 상장주식수) /  (A종목_기준가 * A종목상장주식수)
                *   - 여기서 SUM(기준가 * 상장주식수) 는 T일의 구성종목의 [ 기준가*상장주식수 ] 총 합을 의미한다.
                **************************************************************************************************************/

                /* 지수적용비율 = ( 비중(importance) * SUM(시가기준 시총 tot_F15028 ) ) / 현재종목 시가 총액( F15028 ) */
                v_dataItem.TODAY_RATE   =       fn_calc_data(
                        "TODAY_RATE1"
                    ,   {       
                                importance  :   v_dataItem.importance
                            ,   F15028      :   v_dataItem.F15028 
                        }
                    ,   {       
                                tot_F15028  :   p_dailyObj[ p_param.F12506 ].tot_F15028
                        }
                );

                /*************************************************************************************************************
                *   3. 기준시가총액 재계산
                *   - T일_기준시가총액 = T-1일_기준시가총액 * SUM( T일_기준가 * T일_상장주식수 * T일_지수적용비율) / T-1일_비교시가총액
                **************************************************************************************************************/

                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_dataItem.F15028_S     =       fn_calc_data(
                        "F15028_S_2"
                    ,   {       
                                F15007          :   v_dataItem.F15007
                            ,   F16143          :   v_dataItem.F16143
                            ,   TODAY_RATE      :   v_dataItem.TODAY_RATE
                        }
                    ,   {}
                );
            }
            /* 동일 가중인 경우 */
            else if( v_dataItem.importance_method_cd == "2"  ) {

                /* 지수적용비율 = ( 비중(importance) * SUM( 수정기준가 총합 tot_F30700 ) ) / 수정기준가( F30700 ) */
                v_dataItem.TODAY_RATE   =       fn_calc_data(
                        "TODAY_RATE3"
                    ,   {       
                                importance  :   v_dataItem.importance
                            ,   F30700      :   v_dataItem.F30700 
                        }
                    ,   {       
                                tot_F30700  :   p_dailyObj[ p_param.F12506 ].tot_F15028
                        }
                );


                /* 기준 시가총액 = 수정기준가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_dataItem.F15028_S     =       fn_calc_data(
                        "F15028_S_3"
                    ,   {       
                                F30700          :   v_dataItem.F30700
                            ,   F16143          :   v_dataItem.F16143
                            ,   TODAY_RATE      :   v_dataItem.TODAY_RATE
                        }
                    ,   {}
                );
            }
        }


        /*************************************************************************************************************
        *   6. 비교시가총액 계산
        *   - 비교시가총액 = SUM(종가*상장주식수*지수적용비율)
        **************************************************************************************************************/

        /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
        v_dataItem.F15028_C     =   fn_calc_data( 
                "F15028_C"
            ,   {       
                        F30700          :   v_dataItem.F30700
                    ,   F16143          :   v_dataItem.F16143
                    ,   TODAY_RATE      :   v_dataItem.TODAY_RATE 
                }
            ,   { }
        );                                                



        /* 이벤트(비중조절, 종목편입)-COM011 ( 10-비중조절, 20-종목편입 ) */
        v_dataItem.EVENT_FLAG           =   "";


/************************/

        /* 최초 레코드인 경우 */
        if( p_param.first_record_yn == "Y" ) {

            /* 직전 [기준 시가총액]과 다르면 10-비중조절 로 설정 */
            if( v_dataItem.F15028_S != p_firstHistObj[ p_param.v_before_F12506 ][ v_dataKey ].F15028_S ) {
                v_dataItem.EVENT_FLAG       =   "10";       /* 10-비중조절 */
            }

            v_dataItem.BEFORE_RATE  =   p_firstHistObj[ p_param.v_before_F12506 ][ v_dataKey ].TODAY_RATE;
        }else{

            /* 종목이 편입되기 전엔 krw 로 존재했다가 종목이 편입되게 되면 krw 항목이 없어지게 됨. */
            if( typeof p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ] != "undefined" ) {

                /* 직전 [기준 시가총액]과 다르면 10-비중조절 로 설정 */
                if( v_dataItem.F15028_S != p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ].F15028_S ) {
                    v_dataItem.EVENT_FLAG   =   "10";       /* 10-비중조절 */
                }

                v_dataItem.BEFORE_RATE  =   p_dailyJongmokObj[ p_param.v_before_F12506 ][ v_dataKey ].TODAY_RATE;
            }
        }


        /* 상장일과 날짜가 같으면 20-종목편입으로 설정 */
        if( v_dataItem.F16017 == p_param.F12506 ) {
            v_dataItem.EVENT_FLAG   =   "20";       /* 10-종목편입 */
        }

        /* 기준 시가총액 누적 */
        totalInfo.tot_F15028_S       =      Number( totalInfo.tot_F15028_S )
                                        +   Number( v_dataItem.F15028_S );

        /* 비교 시가총액 누적 */
        totalInfo.tot_F15028_C       =      Number( totalInfo.tot_F15028_C )
                                        +   Number( v_dataItem.F15028_C );
    }

    

    /* T-1 일 기준 시가총액 */
    totalInfo.prev_tot_F15028_S     =   p_dailyObj[ p_param.v_before_F12506 ].tot_F15028_S;

    /* T-1 일 기준 비교총액 */
    totalInfo.prev_tot_F15028_C     =   p_dailyObj[ p_param.v_before_F12506 ].tot_F15028_C;

    /* T-1 일 지수 */
    totalInfo.PREV_INDEX_RATE       =   p_dailyObj[ p_param.v_before_F12506 ].PREV_INDEX_RATE;



    /*************************************************************************************************************
    *   T일이 리밸런싱이 아니고 변동도 발생되지 않은 경우
    **************************************************************************************************************/
    if(     p_dailyObj[ p_param.F12506 ].rebalancing    !=  "1" 
        &&  p_dailyObj[ p_param.F12506 ].change_yn      ==  "N" 
    ) {

        /* T일 기준 시가 총액 = T-1일 기준 시가총액 */
        totalInfo.tot_F15028_S      =   totalInfo.prev_tot_F15028_S;
    }

    /*************************************************************************************************************
    *   T일이 리밸런싱 인 경우
    **************************************************************************************************************/
    else{

        /*************************************************************************************************************
        *   3. 기준시가총액 재계산
        *   - T일_기준시가총액 = T-1일_기준시가총액 * SUM( T일_기준가 * T일_상장주식수 * T일_지수적용비율) / T-1일_비교시가총액
        **************************************************************************************************************/

        /* 기준시가 총액 재계산 = T-1일 기준시가총액(p_totalInfo.prev_tot_F15028_S) * SUM(p_totalInfo.tot_F15028_S) / T-1일 비교시가총액(p_totalInfo.prev_tot_F15028_C) */
        totalInfo.tot_F15028_S  =   fn_calc_data(
                "tot_F15028_S"
            ,   {}
            ,   {       
                        prev_tot_F15028_S   :   totalInfo.prev_tot_F15028_S
                    ,   prev_tot_F15028_C   :   totalInfo.prev_tot_F15028_C
                    ,   tot_F15028_S        :   totalInfo.tot_F15028_S
                }
        );  
    }


    /*************************************************************************************************************
    *   7. 지수 산출
    *   - 지수 = 비교시가총액 / 기준시가총액 * 1000
    **************************************************************************************************************/

    /* 지수 = ( 비교 시가총액(p_totalInfo.tot_F15028_C) / 기준 시가총액(p_totalInfo.tot_F15028_S) ) * 1000  */
    totalInfo.INDEX_RATE    =   fn_calc_data( 
            "INDEX_RATE"
        ,   {}
        ,   {       
                    tot_F15028_C    :   totalInfo.tot_F15028_C      /* 비교 시가총액 누적 */
                ,   tot_F15028_S    :   totalInfo.tot_F15028_S      /* 기준 시가총액 누적 */
            }
    );

    /* RETURN_VAL = ( 당일 지수(p_totalInfo.INDEX_RATE) - 전일 지수(p_totalInfo.BEFORE_INDEX_RATE) ) / 전일 지수(p_totalInfo.BEFORE_INDEX_RATE)  */
    totalInfo.RETURN_VAL    =   fn_calc_data(
            "RETURN_VAL"
        ,   {}
        ,   {       
                    INDEX_RATE          :   totalInfo.INDEX_RATE                                    /* 당일 지수 */
                ,   BEFORE_INDEX_RATE   :   p_dailyObj[ p_param.v_before_F12506 ].INDEX_RATE        /* 전일 지수 */
            }
    );

    Object.assign( p_dailyObj[ p_param.F12506 ], totalInfo );
}


/*
 * 구분에 따라 계산식을 수행한다.
 * 2019-08-14  bkLove(촤병국)
 */
var fn_calc_data = function(        
        p_gubun = 'F15028'
    ,   p_param={       
                importance          :   0       /* 비중 */
            ,   F15007              :   0       /* 기준가 ( 전일 종가 ) - 기준가 */
            ,   F30700              :   0       /* 현재가 ( 당일 종가 ) - 종가 */
            ,   F16143              :   0       /* 상장주식수 */
            ,   F15028              :   0       /* 시가기준 시총 */
            ,   F15007_F16143       :   0       /* 기준가 * 상장주식수 */
            ,   TODAY_RATE          :   0       /* 지수적용비율 */
        }
    ,   p_totalInfo={ 
                tot_F15028          :   0       /* 시가기준 시총 */
            ,   tot_F15028_S        :   0       /* 기준 시가총액 */
            ,   tot_F15028_C        :   0       /* 비교 시가총액 */
            ,   tot_F15007_F16143   :   0       /* 기준가 * 상장주식수 총액 */
            ,   tot_F30700          :   0       /* 수정기준가 총합 */
            ,   prev_tot_F15028_S   :   0       /* 전일 기준 시가총액 */
            ,   prev_tot_F15028_C   :   0       /* 전일 비교 시가총액 */
            ,   INDEX_RATE          :   0       /* 당일 지수 */
            ,   BEFORE_INDEX_RATE   :   0       /* 전일 지수 */
        }
    ) {

    /* 소수점시 계산시 사용할 고정값 */
    var numInfo     =   {
            IMPORTANCE_FIX_NUM      :   100                     /* 비중  소수점 계산시 사용할 고정값 */
        ,   IMPORTANCE_FIX_NUM1     :   10000                   /* 비중  소수점 계산시 사용할 고정값 */
        ,   JISU_RATE_FIX_NUM       :   100000000000000000      /* 지수적용비율 소수점 계산시 사용할 고정값 */
    };

    var v_calc      =   0;

    switch ( p_gubun ) {

                /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
        case    "F15028_1"    :
                    v_calc  =   Number( p_param.F16143 )  *  Number( p_param.F30700 );
                    break;

                /* 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
        case    "F15028_2"    :
                    v_calc  =   Number( p_param.F16143 )  *  Number( p_param.F15007 );
                    break;

                /* 기준가(p_param.F15007) * 상장주식수(p_param.F16143) */
        case    "F15007_F16143"  :
                    v_calc  =   Number( p_param.F15007 )  *  Number( p_param.F16143 );
                    break;

                /* 지수적용비율 = ( 비중(p_param.importance) * SUM(시가기준 시총 p_totalInfo.tot_F15028 ) ) / 현재종목 시가 총액( p_param.F15028 ) */
        case    "TODAY_RATE1"    :

                    /* 분모가 0 인 경우 */
                    if( !p_param.F15028 || p_param.F15028 == 0 ) {
                        v_calc  =   0;
                    }else{
                        v_calc  =   Math.round( 
                            ( ( Number( p_param.importance ) * Number( p_totalInfo.tot_F15028 ) ) / p_param.F15028 ) * numInfo.JISU_RATE_FIX_NUM
                        ) / numInfo.JISU_RATE_FIX_NUM;
                    }
                    break;

                /* 지수적용비율 = (T-1일_A종목종가(F30700) * T-1일_A종목상장주식수(F16143) * T-1일_A종목지수적용비율(TODAY_RATE)) * SUM(T일_기준가 * T일_상장주식수) / (T일_ A종목기준가 * T일_A종목상장주식수) */
        case    "TODAY_RATE2"    :
                    /* 분모가 0 인 경우 */
                    if( !p_param.F15028 || p_param.F15028 == 0 ) {
                        v_calc  =   0;
                    }else{
                        v_calc  =   Math.round(
                            (
                                    Math.round(
                                            ( ( Number( p_param.F30700 ) * Number( p_param.F16143 ) * Number( p_param.TODAY_RATE ) ) / Number( p_totalInfo.prev_tot_F15028_C ) ) 
                                        *   numInfo.JISU_RATE_FIX_NUM
                                    )   /   numInfo.JISU_RATE_FIX_NUM
                                *   Number( p_totalInfo.tot_F15007_F16143 )
                            )   /   Number( p_param.F15007_F16143 ) * numInfo.JISU_RATE_FIX_NUM
                        ) / numInfo.JISU_RATE_FIX_NUM;
                    }
                    break;

                /* 지수적용비율 = ( 비중(importance) * SUM( 수정기준가 총합 tot_F30700 ) ) / 수정기준가( F30700 ) */
        case    "TODAY_RATE3"    :

                    /* 분모가 0 인 경우 */
                    if( !p_param.F30700 || p_param.F30700 == 0 ) {
                        v_calc  =   0;
                    }else{
                        v_calc  =   Math.round( 
                            ( ( Number( p_param.importance ) * Number( p_totalInfo.tot_F30700 ) ) / p_param.F30700 ) * numInfo.JISU_RATE_FIX_NUM
                        ) / numInfo.JISU_RATE_FIX_NUM;
                    }
                    break;

                /* 기준시가 총액 재계산 = T-1일 기준시가총액(p_totalInfo.prev_tot_F15028_S) * SUM(p_totalInfo.tot_F15028_S) / T-1일 비교시가총액(p_totalInfo.prev_tot_F15028_C) */
        case    "tot_F15028_S"    :
                    /* 분모가 0 인 경우 */
                    if( !p_totalInfo.prev_tot_F15028_C || p_totalInfo.prev_tot_F15028_C == 0 ) {
                        v_calc  =   0;
                    }else{
                        v_calc  =   Math.round( 
                            (       
                                    ( Number( p_totalInfo.prev_tot_F15028_S ) * Number( p_totalInfo.tot_F15028_S ) ) 
                                /   p_totalInfo.prev_tot_F15028_C 
                            )   *   numInfo.JISU_RATE_FIX_NUM
                        ) / numInfo.JISU_RATE_FIX_NUM;
                    }
                    break;

            
                /* 기준 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
        case    "F15028_S_1"    :
                    v_calc  =   Number( p_param.F30700 )  *  Number( p_param.F16143 ) * Number( p_param.TODAY_RATE );
                    break;            

                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
        case    "F15028_S_2"    :
                    v_calc  =   Number( p_param.F15007 )  *  Number( p_param.F16143 ) * Number( p_param.TODAY_RATE );
                    break;

                /* 기준 시가총액 = 수정기준가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
        case    "F15028_S_3"    :
                    v_calc  =   Number( p_param.F30700 )  *  Number( p_param.F16143 ) * Number( p_param.TODAY_RATE );
                    break;                    

                /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
        case    "F15028_C"    :
                    v_calc  =   Number( p_param.F30700 )  *  Number( p_param.F16143 ) *  Number( p_param.TODAY_RATE );
                    break;

                /* 지수 = ( 비교 시가총액(p_totalInfo.tot_F15028_C) / 기준 시가총액(p_totalInfo.tot_F15028_S) ) * 1000  */
        case    "INDEX_RATE"    :

                    /* 분모가 0 인 경우 */
                    if( !p_totalInfo.tot_F15028_S || p_totalInfo.tot_F15028_S == 0 ) {
                        v_calc  =   0;
                    }else{
                        v_calc  =   (
                            Math.round(
                                ( Number( p_totalInfo.tot_F15028_C ) / Number( p_totalInfo.tot_F15028_S ) ) * numInfo.JISU_RATE_FIX_NUM
                            ) / numInfo.JISU_RATE_FIX_NUM
                        ) * 1000;
                    }
                    break;

                /* RETURN_VAL = ( 당일 지수(p_totalInfo.INDEX_RATE) - 전일 지수(p_totalInfo.BEFORE_INDEX_RATE) ) / 전일 지수(p_totalInfo.BEFORE_INDEX_RATE)  */
        case    "RETURN_VAL"    :

                    /* 분모가 0 인 경우 */
                    if( !p_totalInfo.BEFORE_INDEX_RATE || p_totalInfo.BEFORE_INDEX_RATE == 0 ) {
                        v_calc  =   0;
                    }else{
                        v_calc  =   Math.round(
                            (       
                                    ( Number( p_totalInfo.INDEX_RATE ) - Number( p_totalInfo.BEFORE_INDEX_RATE ) ) 
                                /   Number( p_totalInfo.BEFORE_INDEX_RATE ) 
                            )  * numInfo.JISU_RATE_FIX_NUM
                        ) / numInfo.JISU_RATE_FIX_NUM;
                    }
                    break;
    }

    return  v_calc;
}


module.exports.saveBaicInfo = saveBaicInfo;
module.exports.getBacktestResult = getBacktestResult;