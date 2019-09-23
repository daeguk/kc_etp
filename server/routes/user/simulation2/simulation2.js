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
var _ = require("lodash");

var simulationBacktest = require('./simulationBacktest');

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs');

var log = config.logger;

var limit = {
        divide_size         :   100
    ,   result_dive_size    :   5
};

var INIT_START_YEAR     =   { value : 2000, text : "2000" };    /* 시작년도 최초값 */
var SEARCH_SCEN_NAME    =   "unnamed";                          /* 시나리오명 prefix */
var initGrpInfo         =   {
        INIT_GRP_CD         :   "*"                             /* 그룹코드 최초값 */
    ,   INIT_INCRE_GRP_CD   :   100000                          /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
};


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
        if (!req.body.data) {
            log.error("[error] simulation.getRebalanceDate  req.body.data no data.", req.body.data);

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


        resultMsg.dataList      =   [];

        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
            var queryId     =   "getRebalanceDate";

            try {

                if( paramData.rebalance_cycle_cd == "" ) {

                    queryId     =   "getRebalanceDateUploadByScenCd";

                    if( !paramData.grp_cd || !paramData.scen_cd )  {
                        throw   "grp_cd 또는 scen_cd 가 존재하지 않습니다.";
                    }
                }

                stmt = mapper.getStatement('simulation2', queryId, paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    resultMsg.result = true;
                    resultMsg.msg = "";                    

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    else if (rows && rows.length > 0) {
                        for( var i=0 ; i < rows.length; i++ ) {
                            resultMsg.dataList.push( { "text" : rows[i].fmt_F12506, "value" : rows[i].F12506 } );
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

        resultMsg.dataList  =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 목록정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulList2 = function(req, res) {
    try {
        log.debug('simulation.getSimulList2 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getSimulList2  req.body.data no data.", req.body.data);

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
     
        resultMsg.dataList  =   [];
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation2', 'getSimulList2', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    
                    if (rows && rows.length > 0) {
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

        resultMsg.dataList      =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 포트폴리오 정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulPortfolio2 = function(req, res) {
    try {
        log.debug('simulation2.getSimulPortfolio2 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation2.getSimulPortfolio2  req.body.data no data.", req.body.data);

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
     
        
        /* 리밸런싱일별 포트폴리오 */
        var rebalancePortfolioObj       =   {};
        resultMsg.rebalancePortfolioObj =   {};

        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation2', 'getSimulPortfolio2', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    
                    if( !err ) {
                        resultMsg.result = true;
                        resultMsg.msg = "";

                        if ( rows && rows.length > 0 ) {
                            resultMsg.result = true;

                            var v_order_no  =   0;
                            for( var i=0; i < rows.length; i++ ) {
                                if( !rebalancePortfolioObj[ rows[i].rebalance_date ] || Object.keys( rebalancePortfolioObj[ rows[i].rebalance_date ] ).length == 0  ) {
                                    rebalancePortfolioObj[ rows[i].rebalance_date ]     =   {};
                                    v_order_no  =   0;
                                }

                                if( !rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ] || Object.keys( rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ] ).length == 0  ) {
                                    rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ]         =   {};
                                }

                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].F16013      =   rows[i].F16013;         /* 단축코드 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].F16002      =   rows[i].F16002;         /* 종목명 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].F15028      =   rows[i].F15028;         /* 시가총액 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].importance  =   rows[i].importance;     /* 비중 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].order_no    =   v_order_no;             /* 정렬순번 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].trIndex     =   v_order_no;             /* 테이블 레코드 순번 */

                                v_order_no++;
                            }
                        }

                        resultMsg.rebalancePortfolioObj   =   rebalancePortfolioObj;
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

        resultMsg.rebalancePortfolioObj  =   [];

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
        log.debug('simulation2.runBacktestWithSaveBasicInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation2.runBacktestWithSaveBasicInfo  req.body.data no data.", req.body.data);

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

        resultMsg.arr_daily             =   [];
        resultMsg.arr_rebalance         =   [];
        resultMsg.simul_mast            =   {};
        resultMsg.analyzeList           =   [];
        resultMsg.jsonFileName          =   "";
        resultMsg.inputData             =   [];        

        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return log.error(txerr);
                }

                async.waterfall([

                    /* 1. 시나리오명이 존재하는지 체크한다. */
                    function(callback) {

                        try{
                            var msg         =   {};
                            var exist_yn    =   "Y";

                            paramData.changeGrpCdYn  =   "0";

                            /* 기존에 등록된 prev_scen_cd 가 없는 경우 ( 신규 건 ) */
                            if( typeof paramData.prev_scen_cd == "undefined" || paramData.prev_scen_cd == "" ) {
                                paramData.status    =   "insert";
                            }else{
                                paramData.status    =   "modify";
                            }

                            stmt = mapper.getStatement('simulation', 'getExistScenName', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( rows && rows.length == 1) {
                                    exist_yn   =   rows[0].exist_yn;
                                }

                                if( exist_yn == "Y" ) {
                                    resultMsg.result = false;
                                    resultMsg.msg   = config.MSG.error01;
                                    resultMsg.err   = "시나리오명이 이미 존재합니다.";

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

                        try{
                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }


                            var exist_cnt   =   1;

                            paramData.grp_yn            =   "0";                                    /* 그룹여부(1-그룹) */
                            paramData.scen_depth        =   "2";                                    /* 시나리오 DEPTH */

                            /* 수정 건 이고 상위 그룹이 변경된 경우 */
                            if(     paramData.status        ==  "modify"
                                &&  paramData.prev_grp_cd   !=  paramData.grp_cd ) {

                                paramData.changeGrpCdYn  =   "1";
                                stmt = mapper.getStatement('simulationBacktest', 'getExistSubCnt', paramData, format);
                                log.debug(stmt);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( rows && rows.length == 1) {
                                        exist_cnt   =   rows[0].exist_cnt;
                                    }

                                    if( exist_cnt > 0 ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "변경 전 상위그룹에 시나리오가 한건 이상  존재합니다.";
                                        resultMsg.err       =   "변경 전 상위그룹에 시나리오가 한건 이상  존재합니다.";

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

                    /* 3. 시뮬레이션 시나리오 코드를 채번한다. */
                    function(msg, callback) {

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }

                            /* modify 상태이고 상위그룹이 변경되지 않는 경우 기존 scen_cd 사용 */
                            if(     paramData.status        ==  "modify"
                                &&  paramData.prev_grp_cd   ==  paramData.grp_cd  ) {

                                    callback(null, msg);

                            }else{

                                paramData.init_incre_grp_cd     =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */

                                stmt = mapper.getStatement('simulationBacktest', "getScenCd1", paramData, format);
                                log.debug(stmt);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows.length == 1) {
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

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }                            

                            if( !paramData.grp_cd  ) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = config.MSG.error01;

                                callback( resultMsg, msg);

                            }else if( !paramData.scen_cd  ) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = config.MSG.error01;

                                callback( resultMsg, msg);

                            }else{

                                /* 신규 건 이거나 상위 그룹이 변경된 경우 정렬순번 조회 */
                                if(     paramData.status        ==  "insert"
                                    ||  paramData.prev_grp_cd   !=  paramData.grp_cd  ) {

                                    stmt = mapper.getStatement('simulation', 'getScenOrderNo', paramData, format);
                                    log.debug(stmt);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if (rows && rows.length == 1) {
                                            paramData.scen_order_no     =   rows[0].scen_order_no;
                                        }

                                        callback(null, msg);
                                    });

                                }else{
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
                    function( msg, callback) {

                        if( !msg || Object.keys( msg ).length == 0 ) {
                            msg = {};
                        }


                        if( paramData.status  ==  "modify" ) {

                            try{
                                stmt = mapper.getStatement('simulation2', 'getSimulMast2', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( !rows || rows.length != 1 ) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        callback(resultMsg, msg);
                                    }else{

                                        /* simul_mast 정보가 변동되었는지 체크하기 위해 v_simul_mast 에 보관 */
                                        msg.v_org_simul_mast    =   [];
                                        msg.v_org_simul_mast.push({
                                                start_year              :   rows[0].start_year                      /* 시작년도 */
                                            ,   rebalance_cycle_cd      :   rows[0].rebalance_cycle_cd              /* 리밸런싱주기 (COM006) */
                                            ,   rebalance_date_cd       :   rows[0].rebalance_date_cd               /* 리밸런싱일자 (COM007) */
                                            ,   init_invest_money       :   rows[0].init_invest_money               /* 초기투자금액 */
                                            ,   bench_mark_cd           :   rows[0].bench_mark_cd                   /* 벤치마크 (COM008) */
                                            ,   importance_method_cd    :   rows[0].importance_method_cd            /* 비중설정방식 (COM009) */
                                        });

                                        msg.v_input_simul_mast  =   [];
                                        msg.v_input_simul_mast.push({
                                                start_year              :   paramData.start_year                    /* 시작년도 */
                                            ,   rebalance_cycle_cd      :   paramData.rebalance_cycle_cd            /* 리밸런싱주기 (COM006) */
                                            ,   rebalance_date_cd       :   paramData.rebalance_date_cd             /* 리밸런싱일자 (COM007) */
                                            ,   init_invest_money       :   paramData.init_invest_money             /* 초기투자금액 */
                                            ,   bench_mark_cd           :   paramData.bench_mark_cd                 /* 벤치마크 (COM008) */
                                            ,   importance_method_cd    :   paramData.importance_method_cd          /* 비중설정방식 (COM009) */
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

                        }else{
                            callback(null, msg);
                        }
                    },

                    /* 6. modify 인 경우 tm_simul_portfolio2 를 조회한다. */
                    function( msg, callback) {

                        if( !msg || Object.keys( msg ).length == 0 ) {
                            msg = {};
                        }


                        if( paramData.status  ==  "modify" ) {

                            try{

                                stmt = mapper.getStatement('simulation2', 'getSimulPortfolio3', paramData, format);
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
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        callback(resultMsg, msg);
                                    }else{

                                        msg.v_org_simul_portfolio    =  [];

                                        /* simul_portfolio 정보가 변동되었는지 체크하기 위해 v_simul_mast 에 보관 */
                                        for( var i=0; i < rows.length; i++ ) {

                                            msg.v_org_simul_portfolio.push({
                                                    F16013              :   rows[i].F16013                          /* 구성종목코드  */
                                                ,   rebalance_date      :   rows[i].rebalance_date                  /* 리밸런싱 날짜 */
                                                ,   importance          :   rows[i].importance                      /* 비중  */
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

                        }else{
                            callback(null, msg);
                        }
                    },

                    /* 7. 현재 serialNo 를 구한다.  */
                    function( msg, callback) {

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }

                            stmt = mapper.getStatement('simulation2', 'getSerialNo', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length != 1 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    callback(resultMsg, msg);
                                }else{

                                    msg.now_serial_no       =   Number( rows[0].serial_no );

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

                    /* 8. 시뮬레이션 기본 정보를 저장한다. */
                    function( msg, callback) {

                        var queryId =   "saveTmSimulMast2";            

                        try{

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }                            


                            if( paramData.status  ==  "insert" ) {

                                paramData.serial_no     =   msg.now_serial_no + 1;

                            }else if( paramData.status  ==  "modify" ) {

                                queryId =   "modifyTmSimulMast2";

                                paramData.serial_no     =   msg.now_serial_no + 1;


                                /* DB 에 존재하는 정보와 입력한 정보가 다른지 체크  */
                                var v_diff_simul_mast       =   _.xorWith( msg.v_org_simul_mast, msg.v_input_simul_mast, _.isEqual );
                                var v_diff_simul_portfolio  =   _.xorWith( msg.v_org_simul_portfolio, msg.v_input_portfolio, _.isEqual );


                                log.debug( "#######################################################################################################" );
                                
                                /* simul_mast 정보가 다른 경우 tm_simul_mast 의 serial_no 에 1 증가 */
                                if( v_diff_simul_mast && v_diff_simul_mast.length > 0 ) {
                                    paramData.serial_no     =   msg.now_serial_no + 1;
                                    log.debug( "simul_mast 변경됨 >>> 변경전 serial_no", msg.now_serial_no, "변경후 serial_no",  paramData.serial_no );
                                }
                                /* simul_portfolio 정보가 다른 경우 tm_simul_mast 의 serial_no 에 1 증가 */
                                else if( v_diff_simul_portfolio && v_diff_simul_portfolio.length > 0 ) {
                                    paramData.serial_no     =   msg.now_serial_no + 1;
                                    log.debug( "simul_portfolio 변경됨 >>> 변경전 serial_no", msg.now_serial_no, "변경후 serial_no",  paramData.serial_no );
                                }
                                /* simul_mast 와 simul_portfolio 모두 변경된 정보가 없는 경우 현재 serial_no 로 유지 */
                                else{
                                    log.debug( "simul_mast, simul_portfolio 변경없음 >>> serial_no", msg.now_serial_no );
                                    paramData.serial_no     =   msg.now_serial_no;
                                }

                                log.debug( "#######################################################################################################" );
                            }

                            stmt = mapper.getStatement('simulationBacktest2', queryId, paramData, format);
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
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    callback(resultMsg, msg);
                                }else{
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

                    /* 9. 수정일 경우 이미 등록된 tm_simul_portfolio 를 삭제한다.  */
                    function( msg, callback) {

                        try {

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }

                            /* 수정인 경우 */
                            if( paramData.status  ==  "modify" ) {

                                stmt = mapper.getStatement('simulation2', "deleteTmSimulPortfolio2", paramData, format);
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

                            }else{
                                callback(null, msg);
                            }

                        } catch (err) {
                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }
                    },

                    /* 10. tm_simul_portfolio 에 저장한다. */
                    function( msg, callback) {

                        try {

                            if( !msg || Object.keys( msg ).length == 0 ) {
                                msg = {};
                            }


                            if( paramData.rebalancePortfolioObj && Object.keys( paramData.rebalancePortfolioObj ).length > 0 ) {

                                msg.arr_portfolio       =   [];
                                msg.v_input_portfolio   =   [];
                                for( var i=0; i < Object.keys( paramData.rebalancePortfolioObj ).length; i++ ) {
                                    var v_key       =   Object.keys( paramData.rebalancePortfolioObj )[i];
                                    var v_sub_item  =   paramData.rebalancePortfolioObj[ v_key ];

                                    var v_order_no  =   0;
                                    for( var j=0; j < Object.keys( v_sub_item ).length; j++ ) {
                                        var v_sub_key2  =   Object.keys( v_sub_item )[j];
                                        var v_sub_item2 =   v_sub_item[ v_sub_key2 ];

                                        v_sub_item2.rebalance_date  =   v_key;
                                        msg.arr_portfolio.push( v_sub_item2 );

                                        msg.v_input_portfolio.push({
                                                F16013              :   v_sub_item2.F16013                  /* 구성종목코드  */
                                            ,   rebalance_date      :   v_sub_item2.rebalance_date          /* 리밸런싱 날짜 */
                                            ,   importance          :   v_sub_item2.importance              /* 비중  */
                                        })
                                    }
                                }
                            }

                            /* 포트폴리오 기본정보가 없는 경우 */
                            if( !msg.arr_portfolio || msg.arr_portfolio.length == 0  ){

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = "[백테스트] 포트폴리오 정보가 존재하지 않습니다.";

                                callback(resultMsg);
                            }

                            /* 포트폴리오 설정 건이 존재하는 경우 */
                            if( msg.arr_portfolio && msg.arr_portfolio.length > 0  ){
                                
                                var divideList  =   [];
                                async.forEachOfLimit( msg.arr_portfolio, 1, function(subList, i, innerCallback) {

                                    async.waterfall([

                                        function(innerCallback) {
                                            divideList.push( subList );
                                            
                                            innerCallback(null, paramData);
                                        },

                                        function(sub_msg, innerCallback) {

                                            var divide_size = ( limit && limit.divide_size ? limit.divide_size : 1 );
                                            if( divideList && ( divideList.length == divide_size || i == msg.arr_portfolio.length-1 ) ) {
                                                try {
                                                    paramData.arr_portfolio =   divideList;
                                                    stmt = mapper.getStatement('simulation2', 'saveTmSimulPortfolio2', paramData, format);
//                                                  log.debug(stmt);

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

                                    delete msg.arrInsertDtl;
                                    callback(null);
                                });                                
                            
                            }

                        } catch (err) {
                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }
                    },

                ], function(err) {

                    if (err) {
                        log.debug(err, stmt, paramData);
                        conn.rollback();
                    } else {
                        resultMsg.result        =   true;
                        conn.commit();
                    }


                    if( resultMsg.result ) {

                        try{

                            /* 백테스트를 수행한다. */
                            simulationBacktest.runBacktest( req, res, paramData ).then( function(e) {

                                if( e && e.resultMsg ) {
                                    resultMsg   =   e.resultMsg;

                                    if( e.resultMsg.result ) {
                                        e.resultMsg.msg = "성공적으로 저장하였습니다.";
                                        e.resultMsg.err = null;
                                    }
                                }

                                res.json(resultMsg);
                                res.end();

                            }).catch( function(expetion){

                                log.debug( expetion, paramData );

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = expetion;

                                res.json( resultMsg );
                                res.end();
                            });

                        }catch( e ) {

                            log.debug( e, paramData );

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = expetion;

                            res.json(resultMsg);
                            res.end();                            
                        }

                    }else{
                        res.json(resultMsg);
                        res.end();                        
                    }
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
 * 시뮬레이션 정보를 삭제한다.
 * 2019-05-20  bkLove(촤병국)
 */
var deleteAllSimul = function(req, res) {
    try {
        log.debug('simulation2.deleteAllSimul 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation2.deleteAllSimul  req.body.data no data.", req.body.data);

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

        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return log.error(txerr);
                }

                async.waterfall([

                    /* 1. simul_mast 가 이미 삭제되었는지 체크한다. */
                    function(callback) {

                        try{
                            var msg         =   {};

                            paramData.changeGrpCdYn     =   "0";
                            stmt = mapper.getStatement('simulation2', 'getSimulMast2', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                /* 이미 삭제된 경우 */
                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "이미 삭제된 상태입니다.";
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

                    /* 2. tm_simul_result_rebalance 를 삭제한다. */
                    function(msg, callback) {

                        try{
                            var msg         =   {};

                            stmt = mapper.getStatement('simulation2', 'deleteSimulResultRebalance', paramData, format);
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
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 3. tm_simul_result_daily 를 삭제한다. */
                    function(msg, callback) {

                        try{
                            var msg         =   {};

                            stmt = mapper.getStatement('simulation2', 'deleteSimulResultDaily', paramData, format);
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
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 4. tm_simul_result_mast 를 삭제한다. */
                    function(msg, callback) {

                        try{
                            var msg         =   {};

                            stmt = mapper.getStatement('simulation2', 'deleteSimulResultMast', paramData, format);
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
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 5. tm_simul_portfolio2 를 삭제한다. */
                    function(msg, callback) {

                        try{
                            var msg         =   {};

                            stmt = mapper.getStatement('simulation2', 'deleteTmSimulPortfolio2', paramData, format);
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
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 6. tm_simul_mast 를 삭제한다. */
                    function(msg, callback) {

                        try{
                            var msg         =   {};

                            stmt = mapper.getStatement('simulation2', 'deleteSimulMast', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
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

                    if (err) {
                        log.debug(err, stmt, paramData);
                        conn.rollback();

                    } else {

                        resultMsg.result        =   true;
                        resultMsg.msg           =   "성공적으로 삭제하였습니다.";
                        resultMsg.err           =   null;

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



module.exports.getRebalanceDate = getRebalanceDate;
module.exports.getSimulList2 = getSimulList2;
module.exports.getSimulPortfolio2 = getSimulPortfolio2;
module.exports.runBacktestWithSaveBasicInfo = runBacktestWithSaveBasicInfo;
module.exports.deleteAllSimul = deleteAllSimul;