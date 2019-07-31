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
        divide_size : 100
};

var INIT_START_YEAR     =   { value : 2000, text : "2000" };    /* 시작년도 최초값 */
var SEARCH_SCEN_NAME    =   "unnamed";                          /* 시나리오명 prefix */
var initGrpInfo         =   {
        INIT_GRP_CD         :   "*"                             /* 그룹코드 최초값 */
    ,   INIT_INCRE_GRP_CD   :   100000                          /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
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
        if (!req.body.data) {
            log.error("[error] simulation.getInitGrpCd  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getInitGrpCd  req.body.data no data.";

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        resultMsg.dataList      =   [{
                grp_cd          :   initGrpInfo.INIT_GRP_CD
            ,   grp_name        :   "선택안함"
        }];

        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation', 'getInitGrpCd', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation.getInitGrpCd Error while performing Query";
                        resultMsg.err = err;
                    }
                    else if (rows && rows.length > 0) {
                        resultMsg.dataList.push( ...rows );

                        resultMsg.result = true;
                        resultMsg.msg = "";
                    }else{
                        resultMsg.result = true;
                        resultMsg.msg = "";
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] simulation.getInitGrpCd Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation.getInitGrpCd 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList  =   [];

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
        if (!req.body.data) {
            log.error("[error] simulation.getNextScenName  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getNextScenName  req.body.data no data.";

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

            try {
                paramData.search_scen_name  =   SEARCH_SCEN_NAME;
                stmt = mapper.getStatement('simulation', 'getNextScenName', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation.getNextScenName Error while performing Query";
                        resultMsg.err = err;
                    }
                    
                    if (rows && rows.length == 1) {
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
                resultMsg.msg = "[error] simulation.getNextScenName Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation.getNextScenName 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.scen_name  =   "";

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
        if (!req.body.data) {
            log.error("[error] simulation.getInitData  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getInitData  req.body.data no data.";

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );



        resultMsg.arr_start_year                =   [];     /* 초기설정 시작년도 array */
        resultMsg.arr_rebalance_cycle_cd        =   [];     /* 초기설정 리밸런싱주기 array */
        resultMsg.arr_rebalance_date_cd         =   [];     /* 초기설정 리밸런싱일자 array */
        resultMsg.arr_bench_mark_cd             =   [];     /* 초기설정 벤치마크 array */
        resultMsg.arr_importance_method_cd      =   [];     /* 초기설정 비중설정방식 array */

        resultMsg.arrMsg                        =   [];

        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {

            /* 초기설정 시작년도 array */
                var nowYear = new Date().getFullYear();
                for( var i=INIT_START_YEAR.value; i <= nowYear; i++ ) {
                    resultMsg.arr_start_year.push( { value : new String(i), text : new String(i) } );
                }

                stmt = mapper.getStatement('simulation', 'getInitData', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation.getInitData Error while performing Query";
                        resultMsg.err = err;
                    }

                    if (rows && rows.length > 0) {

                        for( var i in rows ) {                        

                            if( rows[i].com_mst_cd ) {

                                switch( rows[i].com_mst_cd ) {

                                    /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
                                    case    "COM006":
                                                resultMsg.arr_rebalance_cycle_cd.push( rows[i] );
                                                break;

                                    /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
                                    case    "COM007":
                                                resultMsg.arr_rebalance_date_cd.push( rows[i] );
                                                break;

                                    /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
                                    case    "COM008":
                                                resultMsg.arr_bench_mark_cd.push( rows[i] );
                                                break;

                                    /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
                                    case    "COM009":
                                                resultMsg.arr_importance_method_cd.push( rows[i] );
                                                break;
                                }
                            }                          
                        }
                    }


                    /* 초기설정 시작년도 array */
                    if( resultMsg.arr_start_year.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [시작년도] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }

                    /* 초기설정 리밸런싱주기 array */
                    if( resultMsg.arr_rebalance_cycle_cd.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [리밸런싱주기] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }

                    /* 초기설정 리밸런싱일자 array */
                    if( resultMsg.arr_rebalance_date_cd.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [리밸런싱일자] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }

                    /* 초기설정 벤치마크 array */
                    if( resultMsg.arr_bench_mark_cd.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [벤치마크] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }

                    /* 초기설정 비중설정방식 array */
                    if( resultMsg.arr_importance_method_cd.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [비중설정방식] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }
                    

                    if(     resultMsg.arr_start_year.length             >   0
                        &&  resultMsg.arr_rebalance_cycle_cd.length     >   0
                        &&  resultMsg.arr_rebalance_date_cd.length      >   0
                        &&  resultMsg.arr_bench_mark_cd.length          >   0
                        &&  resultMsg.arr_importance_method_cd.length   >   0
                    ) {
                        resultMsg.result = true;
                        resultMsg.msg = "";
                    }                    

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] simulation.getInitData Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation.getInitData 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.arr_start_year                =   [];     /* 초기설정 시작년도 array */
        resultMsg.arr_rebalance_cycle_cd        =   [];     /* 초기설정 리밸런싱주기 array */
        resultMsg.arr_rebalance_date_cd         =   [];     /* 초기설정 리밸런싱일자 array */
        resultMsg.arr_bench_mark_cd             =   [];     /* 초기설정 벤치마크 array */
        resultMsg.arr_importance_method_cd      =   [];     /* 초기설정 비중설정방식 array */

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
        if (!req.body.data) {
            log.error("[error] simulation.getJongmokInfo  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getJongmokInfo  req.body.data no data.";

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

            try {
                stmt = mapper.getStatement('etpOper', 'getKspjongBasic', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getKspjongBasic Error while performing Query";
                        resultMsg.err = err;
                    }
                    
                    if (rows && rows.length == 1) {
                        resultMsg.jongmokInfo = rows[0];

                        resultMsg.result = true;
                        resultMsg.msg = "";
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] simulation.getJongmokInfo Error while performing Query";
                resultMsg.err = err;

                resultMsg.jongmokInfo   =   {};

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation.getJongmokInfo 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.jongmokInfo   =   {};

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 기본정보를 저장한다.
 * 2019-05-20  bkLove(촤병국)
 */
var saveBaicInfo = function(req, res) {
    try {
        log.debug('simulation.saveBaicInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.saveBaicInfo  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.saveBaicInfo  req.body.data no data.";

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

        var arrInsertDtl    =   [];
        var arrModifyDtl    =   [];
        var arrDeleteDtl    =   [];
        var divideList      =   [];

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
                            resultMsg.msg = "[error] simulation.getExistScenName Error while performing Query";
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

                            /* 상위그룹이 없는 경우 그룹여부='1' 설정 */
                            if( !paramData.grp_cd || paramData.grp_cd == initGrpInfo.INIT_GRP_CD ) {
                                paramData.grp_yn        =   "1";                                    /* 그룹여부(1-그룹) */
                                paramData.scen_depth    =   "1";                                    /* 시나리오 DEPTH */

                                paramData.grp_cd        =   initGrpInfo.INIT_GRP_CD;                /* 그룹코드 최초값 */
                            }
                                                        

                            /* 수정 건 이고 상위 그룹이 변경된 경우 */
                            if(     paramData.status        ==  "modify"
                                &&  paramData.prev_grp_cd   !=  paramData.grp_cd ) {

                                stmt = mapper.getStatement('simulation', 'getExistSubCnt', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getExistSubCnt Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( rows && rows.length == 1) {
                                        exist_cnt   =   rows[0].exist_cnt;
                                    }

                                    if( exist_cnt > 0 ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "변경 전 상위그룹에 시나리오가 한건 이상  존재합니다.";
                                        resultMsg.err       =   "[error] simulation.getExistSubCnt Error while performing Query";

                                        return callback(resultMsg);                                    
                                    }

                                    callback(null, paramData);
                                });

                            }else{
                                callback(null, paramData);
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation.getExistSubCnt Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 3. 시뮬레이션 시나리오 코드를 채번한다. */
                    function(msg, callback) {

                        try{

                            /* 신규 건 이거나 상위 그룹이 변경된 경우 정렬순번 조회 */
                            if(     paramData.status        ==  "insert"
                                ||  paramData.prev_grp_cd   !=  paramData.grp_cd  ) {

                                paramData.init_incre_grp_cd     =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */

                                stmt = mapper.getStatement('simulation', 'getScenCd', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getScenCd Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows.length == 1) {
                                        paramData.scen_cd = rows[0].scen_cd;
                                    }

                                    callback(null, paramData);
                                });

                            }else{
                                callback(null, paramData);
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation.getScenCd Error while performing Query";
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

                            stmt = mapper.getStatement('simulation', queryId, paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulation." + queryId + " Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulation." + queryId + " Error while performing Query";
                                    resultMsg.err = err;

                                    callback(resultMsg, paramData);
                                }else{
                                    callback(null, paramData);
                                }
                                
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation." + queryId + " Error while performing Query";
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
                                stmt = mapper.getStatement('simulation', 'getTmSimulPortfolioExistCheck1', paramData, { language: 'sql', indent: '  ' });
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getTmSimulPortfolioExistCheck1 Error while performing Query";
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
                            resultMsg.msg = "[error] simulation.getTmSimulPortfolioExistCheck1 Error while performing Query";
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
                                    stmt = mapper.getStatement('simulation', 'getTmSimulPortfolioExistCheck2', paramData, { language: 'sql', indent: '  ' });
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] simulation.getTmSimulPortfolioExistCheck2 Error while performing Query";
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
                            resultMsg.msg = "[error] simulation.getTmSimulPortfolioExistCheck2 Error while performing Query";
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
                                                stmt = mapper.getStatement('simulation', 'saveTmSimulPortfolio', paramData, format);
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulation.saveTmSimulPortfolio Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulation.saveTmSimulPortfolio Error while performing Query";

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
                                        resultMsg.msg = "[error] simulation.saveTmSimulPortfolio Error while performing Query";
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
                                                stmt = mapper.getStatement('simulation', 'modifyTmSimulPortfolio', paramData, format);
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulation.modifyTmSimulPortfolio Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulation.modifyTmSimulPortfolio Error while performing Query";

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
                                        resultMsg.msg = "[error] simulation.modifyTmSimulPortfolio Error while performing Query";
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
                                                stmt = mapper.getStatement('simulation', 'deleteTmSimulPortfolio', paramData, format);
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {
                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] simulation.deleteTmSimulPortfolio Error while performing Query";
                                                        resultMsg.err = err;

                                                        return innerCallback(resultMsg);
                                                    }

                                                    innerCallback(null);
                                                });

                                                divideList  =   [];                                                        

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulation.deleteTmSimulPortfolio Error while performing Query";

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
                                        resultMsg.msg = "[error] simulation.deleteTmSimulPortfolio Error while performing Query";
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

                                callback(null);
                            });

                        }else{
                            callback(null);
                        }
                    },                    

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
        resultMsg.msg = "[error] simulation.saveBaicInfo 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        res.json(resultMsg);
        res.end();
    }
}


/*
 * 그룹 정보를 추가한다.
 * 2019-05-20  bkLove(촤병국)
 */
var modifyGroup = function(req, res) {
    try {
        log.debug('simulation.modifyGroup 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.modifyGroup  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.modifyGroup  req.body.data no data.";

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

                    /* 1. 시나리오명이 존재하는지 체크한다. */
                    function(callback) {

                        try{
                            var exist_yn   =   "Y";

                            /* 기존에 등록된 scen_cd 가 없는 경우 ( 신규 건 ) */
                            if( typeof paramData.scen_cd == "undefined" || paramData.scen_cd == "" ) {
                                paramData.status    =   "insert";
                            }else if( typeof paramData.status == "undefined" || paramData.status == "" ){
                                paramData.status    =   "modify";
                            }

                            /* delete 인 경우 시나리오명 중복체크를 하지 않는다. */
                            if( paramData.status  == "delete" ) {

                                callback(null, paramData);

                            }else{

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
                                        resultMsg.msg   = "시나리오 그룹명이 이미 존재합니다.";
                                        resultMsg.err   = "[error] simulation.getExistScenName Error while performing Query";

                                        return callback(resultMsg);                                    
                                    }

                                    callback(null, paramData);
                                });
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation.getExistScenName Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 2. 수정 삭제시 grp_cd, scen_cd 가 존재하는지 체크한다. */
                    function(msg, callback) {

                        try{

                            /* delete 인 경우 시뮬레이션 시나리오 코드를 채번하지 않는다. */
                            if( paramData.status  == "delete" ) {

                                callback(null, paramData);

                            }else{                            

                                paramData.grp_yn                =   '1';                                /* 그룹여부(1-그룹) */
                                paramData.scen_depth            =   "1";                                /* 시나리오 DEPTH */
                                paramData.init_incre_grp_cd     =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */

                                /* 상위그룹이 없는 경우 그룹여부='1' 설정 */
                                if( typeof paramData.grp_cd == "undefined" || !paramData.grp_cd ) {
                                    paramData.grp_cd            =   initGrpInfo.INIT_GRP_CD;            /* 그룹코드 최초값 */
                                }

                                stmt = mapper.getStatement('simulation', 'getScenCd1', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getScenCd1 Error while performing Query";
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
                            resultMsg.msg = "[error] simulation.getScenCd1 Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 3. 시뮬레이션 시나리오 코드를 채번한다. */
                    function(msg, callback) {

                        try{

                            /* delete 인 경우 시뮬레이션 시나리오 코드를 채번하지 않는다. */
                            if( paramData.status  == "delete" ) {

                                callback(null, paramData);

                            }else{                            

                                paramData.grp_yn                =   '1';                                /* 그룹여부(1-그룹) */
                                paramData.scen_depth            =   "1";                                /* 시나리오 DEPTH */
                                paramData.init_incre_grp_cd     =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */

                                /* 상위그룹이 없는 경우 그룹여부='1' 설정 */
                                if( typeof paramData.grp_cd == "undefined" || !paramData.grp_cd ) {
                                    paramData.grp_cd            =   initGrpInfo.INIT_GRP_CD;            /* 그룹코드 최초값 */
                                }

                                stmt = mapper.getStatement('simulation', 'getScenCd1', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getScenCd1 Error while performing Query";
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
                            resultMsg.msg = "[error] simulation.getScenCd1 Error while performing Query";
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

                                /* delete 인 경우 시뮬레이션 시나리오 코드를 채번하지 않는다. */
                                if( paramData.status  == "delete" ) {

                                    callback(null, paramData);

                                }else{

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
                            }else if( paramData.status  ==  "delete" ) {
                                queryId =   "deleteTmSimulMast";
                            }

                            paramData.start_year            =   "";         /* 시작년도 */
                            paramData.rebalance_cycle_cd    =   "";         /* 리밸런싱주기 (COM006) */
                            paramData.rebalance_date_cd     =   "";         /* 리밸런싱일자 (COM007) */
                            paramData.init_invest_money     =   0;          /* 초기투자금액 */
                            paramData.bench_mark_cd         =   "";         /* 벤치마크 (COM008) */
                            paramData.importance_method_cd  =   "";         /* 비중설정방식 (COM009) */

                            stmt = mapper.getStatement('simulation', queryId, paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulation." + queryId + " Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulation." + queryId + " Error while performing Query";
                                    resultMsg.err = err;

                                    callback(resultMsg, paramData);
                                }else{
                                    callback(null, paramData);
                                }
                                
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation." + queryId + " Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                ], function(err) {

                    if (err) {
                        log.error(err, stmt, paramData);
                        conn.rollback();

                    } else {
                        resultMsg.result        =   true;

                        if( paramData.status  ==  "delete" ) {
                            resultMsg.msg       =   "성공적으로 삭제하였습니다.";
                        }else{
                            resultMsg.msg       =   "성공적으로 저장하였습니다.";
                        }
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
        resultMsg.msg = "[error] simulation.modifyGroup 오류가 발생하였습니다.";
        resultMsg.err = expetion;

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
        if (!req.body.data) {
            log.error("[error] simulation.getSimulList  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getSimulList  req.body.data no data.";

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
                stmt = mapper.getStatement('simulation', 'getSimulList', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation.getSimulList Error while performing Query";
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
                resultMsg.msg = "[error] simulation.getSimulList Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation.getSimulList 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList      =   [];

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
        if (!req.body.data) {
            log.error("[error] simulation.getSimulMast  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getSimulMast  req.body.data no data.";

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
     
        resultMsg.mastInfo  =   {};
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation.getSimulMast Error while performing Query";
                        resultMsg.err = err;
                    }
                    
                    if (rows && rows.length == 1) {
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
                resultMsg.msg = "[error] simulation.getSimulMast Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation.getSimulMast 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.mastInfo  =   {};

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
        if (!req.body.data) {
            log.error("[error] simulation.getSimulPortfolio  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getSimulPortfolio  req.body.data no data.";

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
                stmt = mapper.getStatement('simulation', 'getSimulPortfolio', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation.getSimulPortfolio Error while performing Query";
                        resultMsg.err = err;
                    }
                    
                    resultMsg.result = true;
                    resultMsg.msg = "";
                    if (rows && rows.length > 0) {
                        resultMsg.dataList = rows;
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] simulation.getSimulPortfolio Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation.getSimulPortfolio 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList  =   [];

        res.json(resultMsg);
        res.end();
    }
}

module.exports.getInitGrpCd = getInitGrpCd;
module.exports.getNextScenName = getNextScenName;
module.exports.getInitData = getInitData;
module.exports.getJongmokInfo = getJongmokInfo;
module.exports.saveBaicInfo = saveBaicInfo;
module.exports.modifyGroup = modifyGroup;
module.exports.getSimulList = getSimulList;
module.exports.getSimulMast = getSimulMast;
module.exports.getSimulPortfolio = getSimulPortfolio;
