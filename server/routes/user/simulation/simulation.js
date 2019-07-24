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

var INIT_START_YEAR     =   { value : 2000, text : "2000" };
var SEARCH_SCEN_NAME    =   "unnamed";


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
                grp_cd          :   ""
            ,   scen_cd         :   ""
            ,   scen_name       :   "선택안함"
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
 * 시나리오명을 조회한다.
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
                    resultMsg.arr_start_year.push( { value : i, text : new String(i) } );
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


module.exports.getInitGrpCd = getInitGrpCd;
module.exports.getNextScenName = getNextScenName;
module.exports.getInitData = getInitData;