/*
 *  시뮬레이션 결과 그룹 관련 정보
 *
 *  @date 2019-10-24
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
 * 그룹코드에 속한 시나리오를 조회한다.
 * 2019-05-20  bkLove(촤병국)
 */
var getScenInGrpCd = function(req, res) {
    try {
        log.debug('simulationGroup.getScenInGrpCd 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationGroup.getScenInGrpCd  req.body.data no data.", req.body.data);

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

        resultMsg.dataList      =   [];
        resultMsg.simul_mast    =   {};


        Promise.using(pool.connect(), conn => {

            async.waterfall([

                /* 1. 그룹코드를 조회한다. */
                function(callback) {      

                    try{
                        var msg = {};

                        stmt = mapper.getStatement('simulationGroup', 'getGrpCd', paramData, format);
                        log.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if ( !rows || rows.length == 0) {
                                resultMsg.result = false;
                                resultMsg.msg   = "해당 그룹정보가 존재하지 않습니다.";
                                resultMsg.err   = "해당 그룹정보가 존재하지 않습니다.";

                                return callback(resultMsg);
                            }

                            if( rows && rows.length == 1 ) {
                                msg.simul_mast  =   rows[0];
                                msg.grp_cd      =   rows[0].scen_cd;
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

                /* 2. 그룹코드에 속한 시나리오를 조회한다. */
                function(msg, callback) {      

                    try{
                        paramData.grp_cd    =   msg.grp_cd;
                        stmt = mapper.getStatement('simulationGroup', 'getScenInGrpCd', paramData, format);
                        log.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if ( !rows || rows.length == 0) {
                                resultMsg.result = false;
                                resultMsg.msg   = "해당 그룹정보에 속한 시나리오가 한건 이상 존재해야 합니다.";
                                resultMsg.err   = "해당 그룹정보에 속한 시나리오가 한건 이상 존재해야 합니다.";

                                return callback(resultMsg);
                            }


                            var v_arr_result    =   [];
                            var v_limit_yn      =   false;
                            var v_change_yn     =   false;
                            var v_result_msg    =   "";

                            for( var i=0; i < rows.length; i++ ) {
                                var item    =   rows[i];

                                if( v_arr_result.length == 10 ) {
                                    v_limit_yn          =   true;
                                    v_result_msg        =   "10건까지만 비교됩니다.";
                                    break;
                                }                                

                                if( item.change_serial_yn  ==  "N" ) {
                                    v_arr_result.push( item );
                                }else{
                                    v_change_yn =   true;
                                }
                            };


                            if( !v_arr_result || v_arr_result.length == 0 ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "시뮬레이션 결과와 시나리오 정보가 변동되지 않는 정보가 한건 이상 존재해야 합니다.";
                                resultMsg.err       =   "시뮬레이션 결과와 시나리오 정보가 변동되지 않는 정보가 한건 이상 존재해야 합니다.";

                                return callback(resultMsg);
                            }


                            resultMsg.msg   =   "";
                            if( v_arr_result && v_arr_result.length > 0  ) {

                                if( v_change_yn ) {
                                    resultMsg.msg       =   "시뮬레이션 결과와 시나리오 정보가 변동된 정보가 한건 이상 존재합니다.";
                                }

                                if( v_limit_yn ) {
                                    resultMsg.msg       +=  v_result_msg;
                                }

                                for( var i=0; i < v_arr_result.length; i++ ) {
                                    resultMsg.dataList.push( v_arr_result[i] );
                                }

                                resultMsg.simul_mast    =   msg.simul_mast;
                            }

                            callback(null);
                        });

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;

                        if( !resultMsg.err ) {
                            resultMsg.err = err;
                        }

                        return callback(resultMsg);
                    }
                }

            ], function(err) {

                if (err) {
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

        resultMsg.dataList      =   [];
        resultMsg.simul_mast    =   {};

        res.json(resultMsg);
        res.end();
    }
}


/*
 * 그룹코드에 속한 일자별 지수를 조회한다.
 * 2019-10-24  bkLove(촤병국)
 */
var getSimulDailyInGrpCd = function(req, res) {
    try {
        log.debug('simulationGroup.getSimulDailyInGrpCd 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationGroup.getSimulDailyInGrpCd  req.body.data no data.", req.body.data);

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

        resultMsg.arr_result_daily01            =   [];
        resultMsg.arr_result_daily01_header     =   [];
        resultMsg.bm_header                     =   "BM (N/A)";


        Promise.using(pool.connect(), conn => {

            try{
                var msg = {};

                /* 그룹에 속한 시뮬레이션을 조회한다. */
                stmt = mapper.getStatement('simulationGroup', 'getSimulDailyInGrpCd', paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        res.json(resultMsg);
                        res.end();

                        return  false;
                    }

                    if ( !rows || rows.length == 0) {
                        resultMsg.result = false;
                        resultMsg.msg   = "그룹 내 일자별 지수 정보가 존재하지 않습니다.";
                        resultMsg.err   = "그룹 내 일자별 지수 정보가 존재하지 않습니다.";

                        res.json(resultMsg);
                        res.end();

                        return  false;
                    }

                    if( rows && rows.length > 0 ) {

                        var arr_result_daily            =   _.uniqBy( rows, "F12506" ).map( function(o) {
                            return  { "F12506" : o.F12506, "fmt_F12506" : o.fmt_F12506 };
                        });

                        var arr_result_daily_header     =   _.uniqBy( rows, function(o) { return o.grp_cd + "_" +  o.scen_cd; } ).map( function(o) {
                            return  { "grp_cd" : o.grp_cd , "scen_cd" : o.scen_cd, "scen_name" : o.scen_name };
                        });


                        var v_bm_index  =   -1;
                        for( var i=0; i < rows.length; i++ ) {
                            var v_header        =   _.findIndex( arr_result_daily_header, { "scen_cd" : rows[i].scen_cd, "grp_cd" : rows[i].grp_cd  });

                            if( v_header > -1 ) {
                                var v_index     =   _.findIndex( arr_result_daily, { "F12506" : rows[i].F12506  });

                                if( i==0 ) {
                                    if(rows[i].bench_index_nm != null ) {
                                        resultMsg.bm_header =  "BM (" + rows[i].bench_index_nm + ")";
                                        v_bm_index  =   v_header;
                                    }
                                }

                                if( v_index > -1 ) {

                                    arr_result_daily[ v_index ][ 
                                            arr_result_daily_header[v_header].grp_cd 
                                        +   "_" 
                                        +   arr_result_daily_header[v_header].scen_cd 
                                        +   "_INDEX_RATE" 
                                    ]    =   rows[i].INDEX_RATE;

                                    arr_result_daily[ v_index ][ 
                                            arr_result_daily_header[v_header].grp_cd 
                                        +   "_" 
                                        +   arr_result_daily_header[v_header].scen_cd 
                                        +   "_RETURN_VAL" 
                                    ]    =   rows[i].RETURN_VAL;

                                    if( v_bm_index == v_header ) {
                                        arr_result_daily[ v_index ][ "BM_RATE"   ]  =   rows[i].BM_RATE;
                                        arr_result_daily[ v_index ][ "BM_RETURN" ]  =   rows[i].BM_RETURN;
                                    }
                                }
                            }
                        }

                        arr_result_daily.forEach( function( item, index, array ) {
                            arr_result_daily_header.forEach( function( item1, index1, array1 ){
                                if( typeof item[ item1.grp_cd + "_" + item1.scen_cd + "_INDEX_RATE" ] == "undefined" ) {
                                    item[ item1.grp_cd + "_" + item1.scen_cd + "_INDEX_RATE" ]   =   "";
                                }

                                if( typeof item[ item1.grp_cd + "_" + item1.scen_cd + "_RETURN_VAL" ] == "undefined" ) {
                                    item[ item1.grp_cd + "_" + item1.scen_cd + "_RETURN_VAL" ]   =   "";
                                }                                
                            });

                            if( typeof item[ "BM_RATE" ] == "undefined" || item[ "BM_RATE" ] == 0 ) {
                                item[ "BM_RATE" ]    =   "";
                            }

                            if( typeof item[ "BM_RETURN" ] == "undefined" || item[ "BM_RETURN" ] == 0 ) {
                                item[ "BM_RETURN" ] =   "";
                            }                            
                        });

                        resultMsg.result                        =   true;
                        resultMsg.arr_result_daily01_header     =   arr_result_daily_header;
                        resultMsg.arr_result_daily01            =   arr_result_daily;

                        res.json(resultMsg);
                        res.end();
                    }
                });

            } catch (err) {

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;

                if( !resultMsg.err ) {
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

        resultMsg.arr_result_daily01            =   [];
        resultMsg.arr_result_daily01_header     =   [];
        resultMsg.bm_header                     =   "BM (N/A)";

        res.json(resultMsg);
        res.end();
    }
}


/*
 * 그룹코드에 속한 분석정보01 을 조회한다.
 * 2019-10-24  bkLove(촤병국)
 */
var getSimulAnal01InGrpCd = function(req, res) {
    try {
        log.debug('simulationGroup.getSimulAnal01InGrpCd 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationGroup.getSimulAnal01InGrpCd  req.body.data no data.", req.body.data);

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

        resultMsg.arr_result_anal           =   [];
        resultMsg.arr_result_anal_header    =   [];

        var arr_result_anal                 =   [];
        var arr_result_anal_header          =   [];


        Promise.using(pool.connect(), conn => {

            try{
                var msg = {};

                /* 그룹에 속한 분석정보01 을 조회한다. */
                stmt = mapper.getStatement('simulationGroup', 'getSimulAnal01InGrpCd', paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        res.json(resultMsg);
                        res.end();

                        return  false;
                    }

                    if( rows && rows.length > 0 ) {

                        arr_result_anal             =   _.uniqBy( rows, function(o) { return o.grp_cd + "_" +  o.scen_cd; } ).map( function(o) {
                            return  { "grp_cd" : o.grp_cd, "scen_cd" : o.scen_cd, "scen_name" : o.scen_name };
                        });

                        arr_result_anal_header      =   _.uniqBy( rows, "title_anal_id" ).map( function(o) {
                            return  { "anal_id" : o.title_anal_id, "title_order_no" : o.title_order_no };
                        });

                        arr_result_anal_header      =   _.orderBy( arr_result_anal_header, [ "title_order_no" ], [ "asc" ] );


                        for( var i=0; i < rows.length; i++ ) {
                            var v_header            =   _.findIndex( arr_result_anal_header, { "anal_id" : rows[i].title_anal_id  });

                            if( v_header > -1 ) {
                                var v_index         =   _.findIndex( arr_result_anal, { "scen_cd" : rows[i].scen_cd, "grp_cd" : rows[i].grp_cd });

                                var analData        =   "";

                                analData            +=  rows[i].backtest;
                                if(  rows[i].backtest != "N/A" ) {
                                    if( rows[i].backtest_percent_yn  == "1"  ) {
                                        analData        +=  " %";
                                    }

                                    if( rows[i].backtest_year != null && rows[i].backtest_year != "" ) {
                                        analData        +=   " (" + rows[i].backtest_year + ")";
                                    }
                                }

                                if( v_index > -1 ) {
                                    arr_result_anal[ v_index ][ arr_result_anal_header[v_header].anal_id ]      =   analData;
                                }
                            }
                        }

                        arr_result_anal.forEach( function( item, index, array ) {
                            arr_result_anal_header.forEach( function( item1, index1, array1 ){
                                if( typeof item[ item1.anal_id ] == "undefined" ) {
                                    item[ item1.anal_id ]   =   "";
                                }
                            });
                        });
                    }

                    resultMsg.result                        =   true;
                    resultMsg.arr_result_anal_header        =   arr_result_anal_header;
                    resultMsg.arr_result_anal               =   arr_result_anal;

                    res.json(resultMsg);
                    res.end();                    
                });

            } catch (err) {

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;

                if( !resultMsg.err ) {
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

        resultMsg.arr_result_anal           =   [];
        resultMsg.arr_result_anal_header    =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 그룹코드에 속한 분석정보를 조회한다.
 * 2019-10-24  bkLove(촤병국)
 */
var getSimulAnal02InGrpCd = function(req, res) {
    try {
        log.debug('simulationGroup.getSimulAnal02InGrpCd 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulationGroup.getSimulAnal02InGrpCd  req.body.data no data.", req.body.data);

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

        resultMsg.arr_result_anal           =   [];
        resultMsg.arr_result_anal_header    =   [];

        resultMsg.bm_header                 =   "BM (N/A)";

        var arr_result_anal                 =   [];
        var arr_result_anal_header          =   [];
        var arr_result_anal_bm              =   [];


        Promise.using(pool.connect(), conn => {

            try{
                var msg = {};

                /* 그룹에 속한 분석정보를 조회한다. */
                stmt = mapper.getStatement('simulationGroup', 'getSimulAnal02InGrpCd', paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        res.json(resultMsg);
                        res.end();

                        return  false;
                    }

                    if( rows && rows.length > 0 ) {

                        arr_result_anal         =   _.uniqBy( rows, "anal_id" ).map( function(o) {
                            return  { "anal_id" : o.anal_id, "show_order_no" : o.show_order_no };
                        });

                        arr_result_anal         =   _.orderBy( arr_result_anal, [ "show_order_no" ], [ "asc" ] );

                        arr_result_anal_header  =   _.uniqBy( rows, function(o) { return o.grp_cd + "_" +  o.scen_cd; } ).map( function(o) {
                            return  { "grp_cd" : o.grp_cd, "scen_cd" : o.scen_cd, "scen_name" : o.scen_name };
                        });



                        var v_bm_index  =   -1;
                        for( var i=0; i < rows.length; i++ ) {
                            var v_header            =   _.findIndex( arr_result_anal_header, { "scen_cd" : rows[i].scen_cd, "grp_cd" : rows[i].grp_cd });

                            if( v_header > -1 ) {
                                var v_index         =   _.findIndex( arr_result_anal, { "anal_id" : rows[i].anal_id  });

                                if( i==0 ) {
                                    if(rows[i].bench_index_nm != null ) {
                                        resultMsg.bm_header =  "BM (" + rows[i].bench_index_nm + ")";
                                        v_bm_index  =   v_header;
                                    }
                                }

                                var analData        =   "";
                                analData            +=  rows[i].backtest;
                                if( rows[i].backtest != "N/A" ) {

                                    if( rows[i].backtest_percent_yn  == "1" ) {
                                        analData        +=  " %";
                                    }

                                    if( rows[i].backtest_year != null && rows[i].backtest_year != "" ) {
                                        analData        +=   " (" + rows[i].backtest_year + ")";
                                    }
                                }


                                var v_bm_data       =   "";
                                if( v_bm_index == v_header ) {
                                    v_bm_data       +=  rows[i].benchmark;
                                    
                                    if( rows[i].benchmark != "N/A" ) {

                                        if( rows[i].benchmark_percent_yn  == "1" ) {
                                            v_bm_data   +=  " %";
                                        }

                                        if( rows[i].benchmark_year != null && rows[i].benchmark_year != "" ) {
                                            v_bm_data   +=   " (" + rows[i].benchmark_year + ")";
                                        }
                                    }
                                }                                

                                if( v_index > -1 ) {
                                    arr_result_anal[ v_index ][ 
                                            arr_result_anal_header[v_header].grp_cd 
                                        +   "_" 
                                        +   arr_result_anal_header[v_header].scen_cd 
                                    ]      =   analData;

                                    if( v_bm_index == v_header ) {
                                        arr_result_anal_bm[ v_index ]       =   v_bm_data;
                                    }
                                }
                            }
                        }

                        arr_result_anal.forEach( function( item, index, array ) {
                            arr_result_anal_header.forEach( function( item1, index1, array1 ){
                                if( typeof item[ item1.grp_cd + "_" + item1.scen_cd ] == "undefined" ) {
                                    item[ item1.grp_cd + "_" + item1.scen_cd ]   =   "";
                                }
                            });

                            if( typeof arr_result_anal_bm[ index ] == "undefined" ) {
                                item[ "bm" ]    =   "N/A";
                            }else{
                                item[ "bm" ]    =   arr_result_anal_bm[ index ];
                            }
                        });
                    }

                    resultMsg.result                        =   true;
                    resultMsg.arr_result_anal_header        =   arr_result_anal_header;
                    resultMsg.arr_result_anal               =   arr_result_anal;

                    res.json(resultMsg);
                    res.end();                    
                });

            } catch (err) {

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;

                if( !resultMsg.err ) {
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

        resultMsg.arr_result_anal           =   [];
        resultMsg.arr_result_anal_header    =   [];
        resultMsg.bm_header                 =   "BM (N/A)";

        res.json(resultMsg);
        res.end();
    }
}

module.exports.getScenInGrpCd = getScenInGrpCd;
module.exports.getSimulDailyInGrpCd = getSimulDailyInGrpCd;
module.exports.getSimulAnal01InGrpCd = getSimulAnal01InGrpCd;
module.exports.getSimulAnal02InGrpCd = getSimulAnal02InGrpCd;
