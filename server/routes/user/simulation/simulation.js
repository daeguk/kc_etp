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

                            /* modify 상태이고 상위그룹이 변경되지 않는 경우 기존 scen_cd 사용 */
                            if(     paramData.status        ==  "modify"
                                &&  paramData.prev_grp_cd   ==  paramData.grp_cd  ) {

                                    callback(null, paramData);

                            }else{

                                paramData.init_incre_grp_cd     =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */

                                stmt = mapper.getStatement('simulation', "getScenCd1", paramData, format);
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

                    /* 2. grp_cd, scen_cd 가 존재하는지 체크한다. */
                    function(callback) {

                        try{

                            /* 넘겨받은 상태값이 없는 경우 */
                            if( typeof paramData.status == "undefined" || paramData.status == "" ) {
                                paramData.status    =   "insert";
                            }

                            /* insert 인 경우 grp_cd, scen_cd 가 존재하는지 체크하지 않는다. */
                            if( paramData.status == "insert" ) {

                                callback(null, paramData);

                            }else{                            

                                stmt = mapper.getStatement('simulation', 'getExistCodeCheckByGroup', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getExistCodeCheckByGroup Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows.length == 1) {

                                        if( rows[0].grp_cd_yn != "Y" ) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "선택한 그룹코드가 존재하지 않습니다.";
                                            resultMsg.err = "선택한 그룹코드가 존재하지 않습니다.";

                                            return callback(resultMsg);
                                        }
                                        else if( rows[0].scen_cd_yn != "Y" ) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "선택한 시나리오 코드가 존재하지 않습니다.";
                                            resultMsg.err = "선택한 시나리오 코드가 존재하지 않습니다.";

                                            return callback(resultMsg);
                                        }

                                        callback(null, paramData);
                                    }
                                });
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation.getExistCodeCheckByGroup Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 2. 시나리오명이 존재하는지 체크한다. */
                    function(msg, callback) {

                        try{
                            var exist_yn   =   "Y";

                            /* 상태값이 modify 인 경우 */
                            if( paramData.status == "modify" ){
                                paramData.prev_grp_cd   =   paramData.grp_cd;
                                paramData.prev_scen_cd  =   paramData.scen_cd;
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

                    /* 3. 하위에 시나리오 건수를 조회한다. ( 시나리오 그룹에서 삭제시 ) */
                    function(msg, callback) {

                        try{
                            var exist_cnt   =   1;

                            paramData.grp_yn                =   '1';                                /* 그룹여부(1-그룹) */
                            paramData.scen_depth            =   "1";                                /* 시나리오 DEPTH */

                            /* 등록, 수정 인 경우 하위에 시나리오 건수를 조회하지 않는다. */
                            if( [ "insert", "modify" ].includes( paramData.status ) ) {

                                callback(null, paramData);

                            }else{

                                stmt = mapper.getStatement('simulation', 'getExistSubCntByGroup', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getExistSubCntByGroup Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( rows && rows.length == 1) {
                                        exist_cnt   =   rows[0].exist_cnt;
                                    }

                                    if( exist_cnt > 0 ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "시나리오가 한건 이상  존재합니다.";
                                        resultMsg.err       =   "[error] simulation.getExistSubCntByGroup Error while performing Query";

                                        return callback(resultMsg);                                    
                                    }

                                    callback(null, paramData);
                                });
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation.getExistSubCntByGroup Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 3. 시뮬레이션 시나리오 코드를 채번한다. */
                    function(msg, callback) {

                        try{

                            /* modify, delete 인 경우 시뮬레이션 시나리오 코드를 채번하지 않는다. */
                            if( [ "modify", "delete" ].includes( paramData.status ) ) {

                                callback(null, paramData);

                            }else{                            

                                paramData.init_incre_grp_cd     =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */

                                /* 상위그룹이 없는 경우 그룹여부='1' 설정 */
                                if( typeof paramData.grp_cd == "undefined" || !paramData.grp_cd ) {
                                    paramData.grp_cd            =   initGrpInfo.INIT_GRP_CD;            /* 그룹코드 최초값 */
                                }

                                stmt = mapper.getStatement('simulation', 'getScenCdByGroup', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getScenCdByGroup Error while performing Query";
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
                            resultMsg.msg = "[error] simulation.getScenCdByGroup Error while performing Query";
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

                                /* delete 인 경우 시뮬레이션 시나리오 정렬순번을 조회하지 않는다. */
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

                        var queryId =   "saveTmSimulMastByGroup";           

                        try{
                            if( paramData.status  ==  "modify" ) {
                                queryId =   "modifyTmSimulMastByGroup";
                            }else if( paramData.status  ==  "delete" ) {
                                queryId =   "deleteTmSimulMastByGroup";
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
                    
                    if( !err ) {
                        resultMsg.result = true;
                        resultMsg.msg = "";
                        if (rows && rows.length > 0) {
                            resultMsg.dataList = rows;
                        }
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

/*
 * 백테스트 결과를 조회한다.
 * 2019-08-14  bkLove(촤병국)
 */
var getBacktestResult = function(req, res) {
    try {
        log.debug('simulation.runBacktest 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.runBacktest  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.runBacktest  req.body.data no data.";

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
        var arrInsertDtl    =   [];
        var divideList      =   [];

        resultMsg.dataList = [];
        Promise.using(pool.connect(), conn => {

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
                            stmt = mapper.getStatement('simulation', 'getSimulListByBacktest', paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulation.getSimulListByBacktest Error while performing Query";
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
                        resultMsg.msg = "[error] simulation.getSimulListByBacktest Error while performing Query";
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

                /* 2. (백테스트) 시뮬레이션 할 이력 데이터를 조회한다. */
                function(msg, callback) {

                    try{
                        stmt = mapper.getStatement('simulation', 'getSimulHistListByBacktest', paramData, format);
                        log.debug(stmt, paramData);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] simulation.getSimulHistListByBacktest Error while performing Query";
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

                                var v_next_F12506   =   "";         /* 이후 입회일자 */
                                var subListObj      =   {};         /* 일자별 종목 데이터 */
                                var subMastObj      =   {};         /* 일자별 결과 정보 */

                                for( var i=0; i < rows.length; i++ ) {

                                    v_next_F12506   =   "";

                                    if( !subListObj[ rows[i].F12506 ] || Object.keys( subListObj[ rows[i].F12506 ] ).length == 0  ) {
                                        subListObj[ rows[i].F12506 ]    =   {};
                                    }

                                    if( !subMastObj[ rows[i].F12506 ] || Object.keys( subMastObj[ rows[i].F12506 ] ).length == 0  ) {
                                        subMastObj[ rows[i].F12506 ]    =   {};
                                    }                                    

                                    subListObj[ rows[i].F12506 ][ rows[i].F16013 ]  =   rows[i];


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

                                        /* 입회일(F12506) 종목들의 기준정보로 데이터를 설정한다. */
                                        fn_set_F12506( i, rows[i].F12506, subListObj[ rows[i].F12506 ], simulPortfolio, subMastObj[ rows[i].F12506 ] );

                                        /* 
                                            T일이 리밸런싱 일자인가? ( 주기와 일자가 같은 경우 ) 
                                        */
                                        if(     subMastObj[ rows[i].F12506 ].rebalance_cycle_cd_yn == 'Y'
                                            &&  subMastObj[ rows[i].F12506 ].rebalance_date_cd_yn == 'Y'
                                        ) {

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
                                        }
                                        else{
                                            /*
                                                4. 시장조치 확인을 위한 T-1일 비교시총과 T일 시가기준 비교시총  비교
                                                - (1)T-1일 비교시가총액: 이전 루프에서 계산된 직전일의 비교시가총액 사용
                                                - (2)T일 시가기준 비교시가총액: SUM(기준가 * 상장주식수 * 지수적용비율)
                                                - (1) 과 (2) 의 값이 다를 경우 시장조치가 발생했다고 판단할 수 있다
                                            */

                                            /*
                                                비교시가총액 변동이 발생했나?
                                            */
                                            if( true ) {
                                                    /*
                                                        5. 종목별 지수적용비율 계산
                                                        - [2. 종목별 지수적용비율 계산] 과 다른 점은 배분비율을 사용하는 대신 직전일(T-1)의 종목비중을 넣어 계산한다는 것이다.
                                                        - A종목_지수적용비율 = (T-1일_A종목종가 * T-1일_A종목상장주식수 * T-1일_A종목지수적용비율) * SUM(T일_기준가 * T일_상장주식수) / (T일_ A종목기준가 * T일_A종목상장주식수)
                                                    */
                                            }
                                        }

                                        /*
                                            8. 지수 및 구성종목 정보 LOAD
                                            - 직전일의 지수 및 구성종목 정보는 당일에 사용되므로 관리한다.
                                            - 지수정보 : 기준시가총액, 비교시가총액, 지수
                                            - 구성종목정보 : 종목 리스트, 기준가, 종가, 상장주식수, 배분비율, 지수적용비율
                                        */                                     
                                    }
                                }


                                for( var i=0; i < Object.keys( subListObj ).length; i++ ) {
                                    var v_F12506        =   Object.keys( subListObj )[i];
                                    var v_subItem       =   subListObj[ v_F12506 ];
                                    var v_mastItem      =   subMastObj[ v_F12506 ];

                                    for( var j=0; j < Object.keys( subListObj[ v_F12506 ] ).length; j++ ) {
                                        var v_dataKey       =   Object.keys( subListObj[ v_F12506 ] )[j];
                                        var v_dataItem      =   subListObj[ v_F12506 ][ v_dataKey ];

console.log( "v_dataItem", v_dataItem );
                                    }
                                }
                            }

                            callback(null, paramData);
                        });

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation.runBacktest Error while performing Query";
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

            ], function(err) {

                if (err) {
                    log.error(err, stmt, paramData);
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
        resultMsg.msg = "[error] simulation.runBacktest 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 입회일(F12506) 종목들의 기준정보로 데이터를 설정한다.
 * 2019-08-14  bkLove(촤병국)
 */
var fn_set_F12506 = function( p_rowInx, p_F12506,  p_subListObj, p_simulPortfolioObj, p_subMastObj ) {

    /* 소수점시 계산시 사용할 고정값 */
    var numInfo     =   {
            IMPORTANCE_FIX_NUM      :   100             /* 비중  소수점 계산시 사용할 고정값 */
        ,   IMPORTANCE_FIX_NUM1     :   10000           /* 비중  소수점 계산시 사용할 고정값 */
        ,   JISU_RATE_FIX_NUM       :   10000000000     /* 지수적용비율 소수점 계산시 사용할 고정값 */
    };

    /* 현금 정보 */
    var krwInfo  =   {  
            F16013                  :   "KRW"           /* 종목코드 */
        ,   F16002                  :   "현금"          /* 종목명 */
        ,   importance              :   0               /* 비중 */

        ,   F15007                  :   1               /* 기준가 ( 전일 종가 ) - 기준가 */    
        ,   F15001                  :   1               /* 현재가 ( 당일 종가 ) - 종가 */
        ,   F16143                  :   100000000       /* 상장주식수 */
        ,   F15028                  :   0               /* 시가기준 시총 */
        ,   jisu_rate               :   0               /* 지수적용비율 */
        ,   KRW_exists_yn           :   "N"             /* 현금 존재여부 */
    };

    /* total 정보 */
    var totalInfo  =   {
            tot_F15028              :   0               /* 시가기준 시총 */
        ,   tot_F15028_S            :   0               /* 기준 시가총액 */
        ,   tot_F15028_C            :   0               /* 비교 시가총액 */

        ,   start_year              :   ""              /* 시작년도 */
        ,   rebalance_cycle_cd      :   ""              /* 리밸런싱주기 (COM006) */
        ,   rebalance_date_cd       :   ""              /* 리밸런싱일자 (COM007) */
        ,   init_invest_money       :   0               /* 초기투자금액 */
        ,   bench_mark_cd           :   ""              /* 벤치마크 (COM008) */
        ,   importance_method_cd    :   ""              /* 비중설정방식 (COM009) */

        ,   rebalance_cycle_cd_yn   :   "N"             /* 리밸런싱주기 에 포함되는지 체크 */
        ,   rebalance_date_cd_yn    :   "N"             /* 리밸런싱일자 에 포함되는지 체크 */
    };


    /* 1. 포트 폴리오를 기준으로 종목코드 할당 및 total 정보를 설정한다. */
    for( var i = 0; i < Object.keys( p_simulPortfolioObj ).length; i++ ) {
        var v_portKey     =   Object.keys( p_simulPortfolioObj )[i];
        var v_portItem    =   Object.assign( {}, p_simulPortfolioObj[ v_portKey ] );


        /*  일자별 이력에 존재하는 종목코드가 시뮬레이션 포트폴리오 종목에 존재하는 경우 
            - 시뮬레이션 포트폴리오 정보를 일자별 종목코드에 할당
        */
        if( Object.keys( p_subListObj ).includes( v_portKey ) ) {
            v_portItem.F16013_exists_yn         =   "Y";                        /* 종목코드 존재여부 */
            Object.assign( p_subListObj[ v_portKey ],  v_portItem );

            if( totalInfo.rebalance_cycle_cd_yn == "N" ) {
                if( p_subListObj[ v_portKey ].chk_rebalance_cycle_cd    ==  v_portItem.rebalance_cycle_cd  ) {
                    totalInfo.rebalance_cycle_cd_yn     =   "Y";
                }
            }

            if( totalInfo.rebalance_date_cd_yn == "N" ) {
                if( p_subListObj[ v_portKey ].chk_rebalance_date_cd  ==  v_portItem.rebalance_date_cd  ) {
                    totalInfo.rebalance_date_cd_yn   =   "Y";
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
            krwInfo.importance                  =       Number( krwInfo.importance )
                                                    +   (
                                                                Number( v_portItem.importance )
                                                            /   numInfo.IMPORTANCE_FIX_NUM 
                                                        );                                              /* 존재하지 않는 항목들의 비중 합계 ( 비중이 정수로 되어 있어 100을 나눈다. ) */

        /* 항목정보 설정 */
            v_portItem.importance               =   0;                                                  /* 비중 */
            v_portItem.F15007                   =   0;                                                  /* 기준가 ( 전일 종가 ) - 기준가 */
            v_portItem.F15001                   =   0;                                                  /* 현재가 ( 당일 종가 ) - 종가 */
            v_portItem.F16143                   =   0;                                                  /* 상장주식수 */
            v_portItem.F16013_exists_yn         =   "N";                                                /* 종목코드 존재여부 */

            p_subListObj[ v_portKey ]           =   Object.assign( {},  v_portItem );
        }

        p_subListObj[ v_portKey ].importance    =   (
                                                            Number( p_subListObj[ v_portKey ].importance )
                                                        /   numInfo.IMPORTANCE_FIX_NUM
                                                    );                                                  /* 비중 ( 비중이 정수로 되어 있어 100을 나눈다. ) */

        p_subListObj[ v_portKey ].F15028        =   fn_calc_data( 
                                                            "F15028"
                                                        ,   { F15007 : p_subListObj[ v_portKey ].F15007, F16143 : p_subListObj[ v_portKey ].F16143 } 
                                                    );                                                  /* 시가기준 시총 */


    /* total 정보 설정 */
        totalInfo.tot_F15028                    =       Number( totalInfo.tot_F15028 ) 
                                                    +   Number( p_subListObj[ v_portKey ].F15028 );     /* 시가기준 시총 */

        if( i == 0 ) {
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
        p_subListObj[ krwInfo.F16013 ]  =   Object.assign( {},  krwInfo );

        p_subListObj[ krwInfo.F16013 ].F15028   =   fn_calc_data( 
                                                            "F15028"
                                                        ,   { F15007 : p_subListObj[ krwInfo.F16013 ].F15007, F16143 : p_subListObj[ krwInfo.F16013 ].F16143 } 
                                                    );                                                      /* 시가기준 시총 */

        totalInfo.tot_F15028                    =       Number( totalInfo.tot_F15028 ) 
                                                    +   Number( p_subListObj[ krwInfo.F16013 ].F15028 );    /* 시가기준 시총 */
    }


    /* 3. total 정보로 지수정보를 계산한다. */
    for( var i = 0; i < Object.keys( p_subListObj ).length; i++ ) {
        var v_dataKey     =   Object.keys( p_subListObj )[i];
        var v_dataItem    =   p_subListObj[ v_dataKey ];

        v_dataItem.jisu_rate            =       fn_calc_data( 
                                                        "jisu_rate"
                                                    ,   { importance : v_dataItem.importance, F15028 : v_dataItem.F15028 }
                                                    ,   { tot_F15028 : totalInfo.tot_F15028 }
                                                );                                  /* 지수적용비율 */

        v_dataItem.F15028_S             =       fn_calc_data( 
                                                        "F15028_S"
                                                    ,   { F15007 : v_dataItem.F15007, F16143 : v_dataItem.F16143, jisu_rate : v_dataItem.jisu_rate }
                                                    ,   {}
                                                );                                  /* 기준시가총액 */

        v_dataItem.F15028_C             =       fn_calc_data( 
                                                        "F15028_C"
                                                    ,   { F15007 : v_dataItem.F15001, F16143 : v_dataItem.F16143, jisu_rate : v_dataItem.jisu_rate }
                                                    ,   { }
                                                );                                  /* 비교시가총액 */

    /* total 정보 */
        totalInfo.tot_F15028_S          =       Number( totalInfo.tot_F15028_S )
                                            +   Number( v_dataItem.F15028_S );      /* 기준 시가총액 */

        totalInfo.tot_F15028_C          =       Number( totalInfo.tot_F15028_C )
                                            +   Number( v_dataItem.F15028_S );      /* 비교 시가총액 */
    }

    Object.assign( p_subMastObj, totalInfo );
}


/*
 * 구분에 따라 계산식을 수행한다.
 * 2019-08-14  bkLove(촤병국)
 */
var fn_calc_data = function(        p_gubun = 'F15028'
                                ,   p_param={ importance : 0,  F15007 : 0, F15001 : 0, F16143 : 0, F15028 : 0, jisu_rate : 0 }
                                ,   p_totalInfo={ tot_F15028 : 0, tot_F15028_S : 0, tot_F15028_C : 0 }   ) {

    /* p_param */
    //  importance      /* 비중 */
    //  F15007          /* 기준가 ( 전일 종가 ) - 기준가 */
    //  F15001          /* 현재가 ( 당일 종가 ) - 종가 */
    //  F16143          /* 상장주식수 */
    //  F15028          /* 시가기준 시총 */
    //  jisu_rate       /* 지수적용비율 */    

    /* p_totalInfo */
    //  tot_F15028      /* 시가기준 시총 */
    //  tot_F15028_S    /* 기준 시가총액 */
    //  tot_F15028_C    /* 비교 시가총액 */

    /* 소수점시 계산시 사용할 고정값 */
    var numInfo     =   {
            IMPORTANCE_FIX_NUM      :   100             /* 비중  소수점 계산시 사용할 고정값 */
        ,   IMPORTANCE_FIX_NUM1     :   10000           /* 비중  소수점 계산시 사용할 고정값 */
        ,   JISU_RATE_FIX_NUM       :   10000000000     /* 지수적용비율 소수점 계산시 사용할 고정값 */
    };

    var v_calc      =   0;

    switch ( p_gubun ) {

                /* 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
        case    "F15028"    :
                    v_calc  =   Number( p_param.F16143 )  *  Number( p_param.F15007 );
                    break;

                /* 지수적용비율 = ( 비중(p_param.importance) * SUM(시가기준 시총 p_totalInfo.tot_F15028 ) ) / 현재종목 시가 총액( p_param.F15028 ) */
        case    "jisu_rate"    :

                    /* 분모가 0 인 경우 */
                    if( !p_param.F15028 || p_param.F15028 == 0 ) {
                        v_calc  =   0;
                    }else{
                        v_calc  =   Math.round( 
                                        ( ( Number( p_param.importance ) * Number( p_totalInfo.tot_F15028 ) ) / p_param.F15028 ) * numInfo.JISU_RATE_FIX_NUM
                                    ) / ( numInfo.JISU_RATE_FIX_NUM * numInfo.IMPORTANCE_FIX_NUM );
                    }
                    break;

                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.jisu_rate) */
        case    "F15028_S"    :
                    v_calc  =   Number( p_param.F16143 )  *  Number( p_param.F16143 ) * Number( p_param.jisu_rate );
                    break;

                /* 비교 시가총액 = 종가(p_param.F15001) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.jisu_rate) */
        case    "F15028"    :
                    v_calc  =   Number( p_param.F15001 )  *  Number( p_param.F16143 ) *  Number( p_param.jisu_rate );
                    break;                    
    }

    return  v_calc;
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
module.exports.getBacktestResult = getBacktestResult;