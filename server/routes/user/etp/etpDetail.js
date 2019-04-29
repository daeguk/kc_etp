/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs'); 
var async = require('async'); 


/*
 * ETP 의 기본정보를 조회한다.
 * 2019-04-25  bkLove(촤병국)
 */
var getEtpBasic = function(req, res) {
    try {
        console.log('etpDetail.getEtpBasic 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpDetail.getEtpBasic  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpDetail.getEtpBasic  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        paramData.user_id       =   req.session.user_id;
        paramData.inst_cd       =   req.session.inst_cd;
        paramData.type_cd       =   req.session.type_cd;
        paramData.large_type    =   req.session.large_type;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. EtpBasic 의 기본정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('etpDetail', 'getEtpBasic', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpDetail.getEtpBasic Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length == 1 ) {
                            resultMsg.etpBasic  = rows[0];
                        }

                        callback( null, resultMsg );
                    });
                }, 

                /* 2. ETP기초지수코드 와 ETP기초지수MID 에 속한 IndexBasic 의 기본정보를 조회한다. */
                function( data, callback ) { 

                    stmt = mapper.getStatement('etpDetail', 'getIndexBasicByEtpJisuCd', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpDetail.getIndexBasicByEtpJisuCd Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length == 1 ) {
                            resultMsg.indexBasic  = rows[0];
                        }

                        callback( null );
                    });
                }                

            ], function (err) {

                if( err ) {
                    console.log( err );
                }else{

                    resultMsg.result    =   true;
                    resultMsg.msg       =   "";
                    resultMsg.err       =   null;
                }

                res.json( resultMsg );
                res.end();
            });
        });

    } catch(expetion) {

        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result    =   false;
            resultMsg.msg       =   "[error] etpDetail.getEtpBasic 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.etpBasic          =   {};
        resultMsg.indexBasic        =   {};

        res.json({
            resultMsg
        });
        res.end();  
    }
}

/*
 * ETP performance 정보를 조회한다.
 * 2019-04-25  bkLove(촤병국)
 */
var getEtpPerformance = function(req, res) {
    try {
        console.log('etpDetail.getEtpPerformance 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpDetail.getEtpPerformance  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpDetail.getEtpPerformance  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        paramData.user_id       =   req.session.user_id;
        paramData.inst_cd       =   req.session.inst_cd;
        paramData.type_cd       =   req.session.type_cd;
        paramData.large_type    =   req.session.large_type;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {

            async.waterfall([

                /* 1. ETP performance 정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('etpDetail', 'getEtpPerformance', paramData, format);

                    // 대입 문자 치환
                    stmt = stmt.replace(/\: =/g,':='); 

                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpDetail.getEtpPerformance Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length > 0 ) {
                            resultMsg.etpPerformanceList    =   rows;
                        }

                        callback( null, paramData );
                    });
                },

                /* 2. 자산추가된 ETP 의 ETP performance 정보를 조회한다. */
                function( msg, callback ) {

                    if( paramData.arrEtpPerformance && paramData.arrEtpPerformance.length > 0 ) {

                        stmt = mapper.getStatement('etpDetail', 'getEtpPerformanceByEtp', paramData, format);

                        // 대입 문자 치환
                        stmt = stmt.replace(/\: =/g,':='); 

                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpDetail.getEtpPerformanceByEtp Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {
                                for( var inx in rows) {
                                    resultMsg.etpPerformanceList.push( rows[inx] );
                                }
                            }

                            callback( null, paramData );
                        });

                    }else{
                        callback( null, paramData );
                    }
                },

                /* 3. 자산추가된 INDEX 의 ETP performance 정보를 조회한다. */
                function( msg, callback ) {

                    if( paramData.arrIndexPerformance && paramData.arrIndexPerformance.length > 0 ) {

                        stmt = mapper.getStatement('etpDetail', 'getEtpPerformanceByIndex', paramData, format);

                        // 대입 문자 치환
                        stmt = stmt.replace(/\: =/g,':='); 

                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpDetail.getEtpPerformanceByIndex Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {
                                for( var inx in rows) {
                                    resultMsg.etpPerformanceList.push( rows[inx] );
                                }
                            }

                            callback( null );
                        });

                    }else{
                        callback( null );
                    }
                },                


            ], function (err) {

                if( err ) {
                    console.log( err );
                }else{

                    resultMsg.result    =   true;
                    resultMsg.msg       =   "";
                    resultMsg.err       =   null;
                }

                res.json( resultMsg );
                res.end();
            });
        });

    } catch(expetion) {

        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result    =   false;
            resultMsg.msg       =   "[error] etpDetail.getEtpPerformance 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.etpPerformanceList    =   [];

        res.json({
            resultMsg
        });
        res.end();  
    }
}


/*
 * ETP 정보를 조회한다. ( 분석정보, 포트폴리오, 성능정보 )
 * 2019-04-25  bkLove(촤병국)
 */
var getEtpInfo = function(req, res) {
    try {
        console.log('etpDetail.getEtpInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpDetail.getEtpInfo  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpDetail.getEtpInfo  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        paramData.user_id       =   req.session.user_id;
        paramData.inst_cd       =   req.session.inst_cd;
        paramData.type_cd       =   req.session.type_cd;
        paramData.large_type    =   req.session.large_type;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        var carousel_info = {
            carousel_cnt    :   0,
            carousel_mod    :   0,
            carousel_div    :   4
        };

        Promise.using(pool.connect(), conn => {

            /* 1. 시장을 대표하는 메인 코드정보를 조회한다. */
            var etpFunc1    =   function( callback ) {

                paramData.com_mst_cd    =   "COM003";       /* 시장을 대표하는 지수 */
                stmt = mapper.getStatement('etpDetail', 'getIndexInfoByCodeDtl', paramData, format);
                console.log( "etpDetail.getIndexInfoByCodeDtl query call");

                conn.query(stmt, function( err, rows ) {

                    if( err ) {
                        resultMsg.result    =   false;
                        resultMsg.msg       =   "[error] etpDetail.getIndexInfoByCodeDtl Error while performing Query";
                        resultMsg.err       =   err;

                        return callback( resultMsg );
                    }

                    if ( rows ) {
                        carousel_info.carousel_cnt =  Math.floor( rows.length / carousel_info.carousel_div);
                        carousel_info.carousel_mod =  rows.length % carousel_info.carousel_div;

                        resultMsg.codeList          =   rows;
                    }

                    callback( null, paramData );
                });
            };

            /* 2. 시장을 대표하는 코드 (COM003) 에 속한 지수별 데이터를 조회한다. */
            var etpFunc2    =   function( data, callback ) { 

                var carousel_data =   [];
                var carousel_mod = [];

                var total_amt = 0;  /* 전체 금액 */

                var etf_cnt = 0;    /* ETF 건수, 합계 */
                var etf_sum = 0;

                var etn_cnt = 0;    /* ETN 건수, 합계 */
                var etn_sum = 0;

                async.forEachOf( resultMsg.codeList, function ( ctgCodeItem, index, inner_callback ){

                    paramData.com_val01     =   ctgCodeItem.com_val01;
                    paramData.com_val02     =   ctgCodeItem.com_val02;
                    paramData.com_val03     =   ctgCodeItem.com_val03;
                    stmt = mapper.getStatement('etpDetail', 'getJisuListByEtpRepresent', paramData, format);
                    console.log( "etpDetail.getJisuListByEtpRepresent query call");

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpDetail.getJisuListByEtpRepresent Error while performing Query";
                            resultMsg.err       =   err;

                            return inner_callback( resultMsg );
                        }

                        if( rows ) {

                            if ( (carousel_info.carousel_cnt * carousel_info.carousel_div) > index ) {

                                rows.forEach(function(item, idx) {
                                    total_amt += item.f15028;                       /* 시가총액 */

                                    // ctf 구분자가 1과 2일 경우 
                                    if (item.f16493 == '1' || item.f16493 == '2') {
                                        etf_cnt++; 
                                        etf_sum += item.f15028;                     /* ETF_시가총액 누적 */
                                    } else if (item.f16493 == '3' || item.f16493 == '4') {
                                        etn_cnt++; 
                                        etn_sum += item.f15028;                     /* ETN_시가총액 누적 */
                                    }
                                });

                                carousel_data.push({
                                        "name"      :   ctgCodeItem.f16002          /* 한글종목명 */
                                    ,   "total_amt" :   total_amt
                                    ,   "etf_cnt"   :   etf_cnt
                                    ,   "etf_sum"   :   etf_sum

                                    ,   "etf_sum"   :   etf_sum
                                    ,   "etn_sum"   :   etn_sum
                                    ,   "f15001"    :   ctgCodeItem.f15001          /* 현재가 */
                                    ,   "f15472"    :   ctgCodeItem.f15472          /* 대비 */
                                    ,   "f15004"    :   ctgCodeItem.f15004          /* 등락율 */
                                });
                            } else {

                                rows.forEach(function(item, idx) {
                                    total_amt += item.f15028;                       /* 시가총액 */

                                    // ctf 구분자가 1과 2일 경우 
                                    if (item.f16493 == '1' || item.f16493 == '2') {
                                        etf_cnt++; 
                                        etf_sum += item.f15028;                     /* ETF_시가총액 누적 */
                                    } else if (item.f16493 == '3' || item.f16493 == '4') {
                                        etn_cnt++; 
                                        etn_sum += item.f15028;                     /* ETN_시가총액 누적 */
                                    }
                                });

                                carousel_data.push({
                                        "name"      :   ctgCodeItem.f16002          /* 한글종목명 */
                                    ,   "total_amt" :   total_amt
                                    ,   "etf_cnt"   :   etf_cnt
                                    ,   "etf_sum"   :   etf_sum

                                    ,   "etf_sum"   :   etf_sum
                                    ,   "etn_sum"   :   etn_sum
                                    ,   "f15001"    :   ctgCodeItem.f15001          /* 현재가 */
                                    ,   "f15472"    :   ctgCodeItem.f15472          /* 대비 */
                                    ,   "f15004"    :   ctgCodeItem.f15004          /* 등락율 */
                                });
                            }
                        }

                        inner_callback( null );
                    });

                }, function(err){

                    if(err){
                        return callback( resultMsg );
                    }else{
                        resultMsg.carousel_info     =   carousel_info;
                        resultMsg.carousel_mod      =   carousel_mod;
                        resultMsg.carousel_data     =   carousel_data;

                        return callback( null, paramData );;
                    }
                });
            };

            var etpFunc3_1      =   function( callback ) { 

                stmt = mapper.getStatement('etpDetail', 'getJisuListByCtgCode', paramData, format);
                console.log( "etpDetail.getJisuListByCtgCode query call");

                conn.query(stmt, function( err, rows ) {

                    if( err ) {
                        resultMsg.result    =   false;
                        resultMsg.msg       =   "[error] etpDetail.getJisuListByCtgCode Error while performing Query";
                        resultMsg.err       =   err;

                        return callback( resultMsg );
                    }

                    if ( rows ) {
                        resultMsg.ctgCodeList   =   rows;
                    }

                    callback( null, paramData );
                });
            };

            /* 3. 분류코드별 지수정보를 조회한다. */
            var etpFunc3    =   function( data, callback ) { 

                stmt = mapper.getStatement('etpDetail', 'getJisuListByCtgCode', paramData, format);
                console.log( "etpDetail.getJisuListByCtgCode query call");

                conn.query(stmt, function( err, rows ) {

                    if( err ) {
                        resultMsg.result    =   false;
                        resultMsg.msg       =   "[error] etpDetail.getJisuListByCtgCode Error while performing Query";
                        resultMsg.err       =   err;

                        return callback( resultMsg );
                    }

                    if ( rows ) {
                        resultMsg.ctgCodeList   =   rows;
                    }

                    callback( null, paramData );
                });
            };

            /* 4. 지수별 ETP 목록을 조회한다. */
            var etpFunc4    =   function( data, callback ) { 

                var etpLists    =   [];

                /* ctg_code 별로 ETP 목록 데이터를 조회한다. */
                async.forEachOf( resultMsg.ctgCodeList, function ( innerData, i, inner_callback ){

                    paramData.ctg_code  =   innerData.ctg_code;
                    stmt = mapper.getStatement('etpDetail', 'getEtpListByJisu', paramData, format);
                    console.log( "etpDetail.getEtpListByJisu query call");

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpDetail.getEtpListByJisu Error while performing Query";
                            resultMsg.err       =   err;

                            return inner_callback( resultMsg );
                        }

                        if( rows ) {
                            etpLists.push( rows );
                        }

                        inner_callback( null );
                    });

                }, function(err){

                    if(err){
                        return callback( resultMsg );
                    }else{
                        resultMsg.etpLists          =   etpLists;

                        return callback( null );
                    }
                });
            };            


            var funcList =   [];

            /* 001-시장대표 인 경우 - 메인화면 상단의 데이터 조회를 위해 4개 함수를 호출하게 한다. */
            if( paramData.ctg_large_code    ==  "001" ) {
                funcList.push( etpFunc1 );
                funcList.push( etpFunc2 );
                funcList.push( etpFunc3 );
                funcList.push( etpFunc4 );
            }
            /* 그외 인경우 - 테이블 정보 조회를 위해 2개 함수만 호출하게 한다. */
            else{
                funcList.push( etpFunc3_1 );
                funcList.push( etpFunc4 );
            }


            async.waterfall( funcList, function (err) {

                if( err ) {
                    console.log( err );
                }else{

                    resultMsg.result    =   true;
                    resultMsg.msg       =   "";
                    resultMsg.err       =   null;
                }

                res.json( resultMsg );
                res.end();
            });
        });                

    } catch(expetion) {

        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result    =   false;
            resultMsg.msg       =   "[error] etpDetail.getEtpInfo 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.etpLists          =   [];
        resultMsg.carousel_info     =   {};
        resultMsg.carousel_data     =   [],
        resultMsg.carousel_mod      =   [];
        resultMsg.ctgCodeList       =   [];

        res.json({
            resultMsg
        });
        res.end();  
    }
}


/* 
 * ETP 차트 정보를 조회한다.
 * 2019-04-25  bkLove(촤병국)
 */
var getEtpChartData = function(req, res) {
    
    try {
        console.log('etpDetail.getEtpChartData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpDetail.getEtpChartData  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpDetail.getEtpChartData  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        paramData.user_id       =   req.session.user_id;
        paramData.inst_cd       =   req.session.inst_cd;
        paramData.type_cd       =   req.session.type_cd;
        paramData.large_type    =   req.session.large_type;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. 지수정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('etpDetail', 'getEtpChartData', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpDetail.getEtpChartData Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.chartList = rows;
                        }

                        callback( null );
                    });
                }

            ], function (err) {

                if( err ) {
                    console.log( err );
                }else{

                    resultMsg.result    =   true;
                    resultMsg.msg       =   "";
                    resultMsg.err       =   null;
                }

                res.json( resultMsg );
                res.end();
            });
        });                

    } catch(expetion) {

        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result    =   false;
            resultMsg.msg       =   "[error] etpDetail.getEtpChartData 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.chartList      =   [];
        res.json({
            resultMsg
        });
        res.end();  
    }
}


module.exports.getEtpBasic = getEtpBasic;
module.exports.getEtpInfo = getEtpInfo;
module.exports.getEtpPerformance = getEtpPerformance;
module.exports.getEtpChartData = getEtpChartData;
