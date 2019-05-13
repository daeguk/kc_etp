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
 * ETP 운용관리 - ETP 운영정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperInfo = function(req, res) {
    try {
        console.log('etpOper.getEtpOperInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getEtpOperInfo  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperInfo  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getEtpOperInfo', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getEtpOperInfo Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length > 0 ) {
                            resultMsg.dataList  = rows;
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
            resultMsg.msg       =   "[error] etpOper.getEtpOperInfo 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.dataList      =   [];

        res.json({
            resultMsg
        });
        res.end();  
    }
}

/*
 * ETP 운용관리 - 지수관리 를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperIndex = function(req, res) {
    try {
        console.log('etpOper.getEtpOperIndex 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getEtpOperIndex  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperIndex  req.body.data no data.";
            
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

                /* 1. Etp 운용관리 - 지수관리 기본정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('etpOper', 'getEtpOperIndex', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getEtpOperIndex Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length > 0 ) {
                            resultMsg.dataList  = rows;
                        }

                        callback( null, paramData );
                    });
                },
                /* 2. ETP Basic 정보를 조회한다. */
                function( msg, callback ) {

                    if( resultMsg.dataList && resultMsg.dataList.length > 0 ) {

                        stmt = mapper.getStatement('etpDetail', 'getEtpBasic', paramData, format);

                        // 대입 문자 치환
                        stmt = stmt.replace(/\: =/g,':='); 

                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpDetail.getEtpBasic Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {

                                resultMsg.dataList.forEach(function( indexRow, i ) {
                                    
                                    var same = rows.filter(function( etpRow, p ) {
                                        return      etpRow.f16257       ==  indexRow.f16013                 /* ETP기초지수코드 = 단축코드 */
                                                &&  etpRow.f34239_pad   ==  indexRow.market_id.substr(1);   /* ETP기초지수MID = 시장 ID  */
                                    });

                                    if( same.length > 0 ) {
                                        var arrTemp = [];

                                        same.forEach( function( etpRow, p ) {
                                            var arrJson = {};

                                            arrJson.f16012      =   etpRow.f16012;      /* 국제표준코드 */
                                            arrJson.f16002      =   etpRow.f16002;      /* 한글종목명 */
                                            arrJson.f16257      =   etpRow.f16257;      /* ETP기초지수코드 */
                                            arrJson.f34239      =   etpRow.f34239;      /* ETP기초지수MID */
                                            arrJson.f34239_pad  =   etpRow.f34239_pad;  /* ETP기초지수MID */

                                            arrTemp.push( arrJson );
                                        });

                                        indexRow.etp_info_json  =   JSON.stringify( arrTemp );
                                    }
                                });
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
            resultMsg.msg       =   "[error] etpOper.getEtpOperIndex 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.dataList      =   [];

        res.json({
            resultMsg
        });
        res.end();  
    }
}


/*
 * ETP 운용관리 - 지수관리 - 해외지수 종가 모니터링을 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperIndexOversea = function(req, res) {
    try {
        console.log('etpOper.getEtpOperIndexOversea 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getEtpOperIndexOversea  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperIndexOversea  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getEtpOperIndexOversea', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getEtpOperIndexOversea Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length > 0 ) {
                            resultMsg.dataList  = rows;
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
            resultMsg.msg       =   "[error] etpOper.getEtpOperIndexOversea 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.dataList      =   [];

        res.json({
            resultMsg
        });
        res.end();  
    }
}

/*
 * ETP 운용관리 - 지수관리 - 오류내역을 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperIndexError = function(req, res) {
    try {
        console.log('etpOper.getEtpOperIndexError 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getEtpOperIndexError  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperIndexOversea  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getEtpOperIndexError', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getEtpOperIndexError Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length > 0 ) {
                            resultMsg.dataList  = rows;
                        }

                        callback( null, paramData );
                    });
                },

                /* 2. ETP Basic 정보를 조회한다. */
                function( msg, callback ) {

                    if( resultMsg.dataList && resultMsg.dataList.length > 0 ) {

                        stmt = mapper.getStatement('indexDetail', 'getIndexBasicDetail', paramData, format);

                        // 대입 문자 치환
                        stmt = stmt.replace(/\: =/g,':='); 

                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] indexDetail.getIndexBasicDetail Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows  ) {
                                resultMsg.indexBasic    =   rows[0];
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
            resultMsg.msg       =   "[error] etpOper.getEtpOperIndexError 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.dataList      =   [];
        resultMsg.indexBasic    =   {};

        res.json({
            resultMsg
        });
        res.end();  
    }
}


/*
 * ETP 운용관리 - PDF관리 정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperPdf = function(req, res) {
    try {
        console.log('etpOper.getEtpOperPdf 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getEtpOperPdf  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdf  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getEtpOperPdf', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getEtpOperPdf Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length > 0 ) {
                            resultMsg.dataList  = rows;
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
            resultMsg.msg       =   "[error] etpOper.getEtpOperPdf 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.dataList      =   [];

        res.json({
            resultMsg
        });
        res.end();  
    }
}

/*
 * ETP 운용관리 - 비중변경현황 정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperPdfByRate = function(req, res) {
    try {
        console.log('etpOper.getEtpOperPdfByRate 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getEtpOperPdfByRate  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdfByRate  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getEtpOperPdfByRate', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getEtpOperPdfByRate Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length > 0 ) {
                            resultMsg.dataList  = rows;

                            resultMsg.rateDateList  =   [];
                            for( var i=0; i < 5; i++ ) {
                                var temp = {};

                                var nowDate     =   new Date();
                                var tempDate    =   new Date(       nowDate.getFullYear()
                                                                ,   nowDate.getMonth()
                                                                ,   ( nowDate.getDate() - i ) 
                                                );

                                temp.name       =   "rate_day" + i;
                                temp.date       =       ( parseInt( tempDate.getMonth() ) + 1 )
                                                    +   "/" 
                                                    +   tempDate.getDate();

                                resultMsg.rateDateList.push( temp );
                            }
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
            resultMsg.msg       =   "[error] etpOper.getEtpOperPdfByRate 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.dataList      =   [];

        res.json({
            resultMsg
        });
        res.end();  
    }
}


module.exports.getEtpOperInfo = getEtpOperInfo;
module.exports.getEtpOperIndex = getEtpOperIndex;
module.exports.getEtpOperIndexOversea = getEtpOperIndexOversea;
module.exports.getEtpOperIndexError = getEtpOperIndexError;
module.exports.getEtpOperPdf = getEtpOperPdf;
module.exports.getEtpOperPdfByRate = getEtpOperPdfByRate;

