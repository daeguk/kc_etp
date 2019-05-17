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

                /* 1. ETP 운용관리 - PDF관리 정보를 조회한다. ( ETF 인 경우 ) */
                function( callback ) {

                    /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    if( paramData.f16493 == "1" || paramData.f16493  == "2" ) {

                        stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtf', paramData, format);
                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.getEtpOperPdfEtf Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {
                                resultMsg.dataList  = rows;
                            }

                            callback( null, paramData );
                        });
                    }else{
                        callback( null, paramData );
                    }                    
                },

                /* 2. ETP 운용관리 - PDF관리 정보를 조회한다. ( ETN 인 경우 ) */
                function( msg, callback ) {

                    /* ETN 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    if( paramData.f16493 == "3" || paramData.f16493  == "4" ) {

                        stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtn', paramData, format);
                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.getEtpOperPdfEtn Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {
                                resultMsg.dataList  = rows;
                            }

                            callback( null );
                        });

                    }else{
                        callback( null );
                    }
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

                /* 1. ETP 운용관리 - PDF관리 정보를 조회한다. ( ETF 인 경우 ) */
                function( callback ) {

                    /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    if( paramData.f16493 == "1" || paramData.f16493  == "2" ) {

                        stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtfByRate', paramData, format);
                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.getEtpOperPdfEtfByRate Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {
                                resultMsg.dataList  = rows;
                            }

                            callback( null, paramData );
                        });
                    }else{
                        callback( null, paramData );
                    }                    
                },

                /* 2. ETP 운용관리 - PDF관리 정보를 조회한다. ( ETN 인 경우 ) */
                function( msg, callback ) {

                    /* ETN 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    if( paramData.f16493 == "3" || paramData.f16493  == "4" ) {

                        stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtnByRate', paramData, format);
                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.getEtpOperPdfEtnByRate Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {
                                resultMsg.dataList  = rows;
                            }

                            callback( null );
                        });

                    }else{
                        callback( null );
                    }
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

/*
 * PDF 관리 -> PDF 긴급반영 정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperPdfModify = function(req, res) {
    try {
        console.log('etpOper.getEtpOperPdfModify 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getEtpOperPdfModify  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdfModify  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        paramData.user_id       =   req.session.user_id;
        paramData.inst_cd       =   req.session.inst_cd;
        paramData.type_cd       =   req.session.type_cd;
        paramData.large_type    =   req.session.large_type;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        resultMsg.dataList  =   [];
        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. ETP 기본 정보를 조회한다. */
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

                        callback( null, paramData );
                    });
                },

                /* 2. ETF 정보를 조회한다. */
                function( msg, callback ) {

                    /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    if(     resultMsg.etpBasic
                        &&  ( resultMsg.etpBasic.f16493 == "1" || resultMsg.etpBasic.f16493  == "2" ) 
                    ) {

                        stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtf', paramData, format);
                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.getEtpOperPdfEtf Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {

                                for( var i in rows) {
                                    rows[i].status          =   "normal";
                                    rows[i].f16499_prev     =   rows[i].f16499;     /* 1CU단위증권수 */
                                    rows[i].code_check      =   true;               /* 코드 체크 ( defulat : true ) */

                                    resultMsg.dataList.push( rows[i] );
                                }
                            }

                            callback( null, paramData );
                        });
                    }else{
                        callback( null, paramData );
                    }                    
                },

                /* 3. ETN 정보를 조회한다. */
                function( msg, callback ) {

                    /* ETN 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    if(     resultMsg.etpBasic
                        &&  ( resultMsg.etpBasic.f16493 == "3" || resultMsg.etpBasic.f16493  == "4" ) 
                    ) {

                        stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtn', paramData, format);
                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.getEtpOperPdfEtn Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {
                                for( var i in rows) {
                                    rows[i].status          =   "normal";
                                    rows[i].f16499_prev     =   rows[i].f16499;     /* 1CU단위증권수 */
                                    rows[i].code_check      =   true;               /* 코드 체크 ( defulat : true ) */

                                    resultMsg.dataList.push( rows[i] );
                                }
                            }

                            callback( null );
                        });

                    }else{
                        callback( null );
                    }
                }           

            ], function (err) {

                if( err ) {
                    console.log( err );
                }else{

                    if( resultMsg.dataList && resultMsg.dataList.length >0 ) {
                        if( resultMsg.etpBasic && Object.keys( resultMsg.etpBasic ).length > 0 ) {
                            resultMsg.etpBasic.f16583   =   resultMsg.dataList[0].f16583;
                        }
                    }

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

        resultMsg.etpBasic      =   {};
        resultMsg.dataList      =   [];

        res.json({
            resultMsg
        });
        res.end();  
    }
}

/*
 * exchBasic 환율정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getExchBasic = function(req, res) {
    try {
        console.log('etpOper.getExchBasic 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getExchBasic  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getExchBasic  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getExchBasic', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getExchBasic Error while performing Query";
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
            resultMsg.msg       =   "[error] etpOper.getExchBasic 오류가 발생하였습니다.";
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
 * exchBasic 환율정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getExchBasic = function(req, res) {
    try {
        console.log('etpOper.getExchBasic 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getExchBasic  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getExchBasic  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getExchBasic', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getExchBasic Error while performing Query";
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
            resultMsg.msg       =   "[error] etpOper.getExchBasic 오류가 발생하였습니다.";
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
 * kspjongBasic 데이터를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getKspjongBasic = function(req, res) {
    try {
        console.log('etpOper.getKspjongBasic 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getKspjongBasic  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getKspjongBasic  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getKspjongBasic', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getKspjongBasic Error while performing Query";
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
            resultMsg.msg       =   "[error] etpOper.getKspjongBasic 오류가 발생하였습니다.";
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
 * futureBasic 데이터를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getFutureBasic = function(req, res) {
    try {
        console.log('etpOper.getFutureBasic 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getFutureBasic  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getFutureBasic  req.body.data no data.";
            
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

                    stmt = mapper.getStatement('etpOper', 'getFutureBasic', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getFutureBasic Error while performing Query";
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
            resultMsg.msg       =   "[error] etpOper.getFutureBasic 오류가 발생하였습니다.";
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
 * 국제표준코드에 속한 종목정보( td_kspjong_basic, td_future_basic )를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getJongmokData = function(req, res) {
    try {
        console.log('etpOper.getJongmokData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.getJongmokData  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getJongmokData  req.body.data no data.";
            
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

                /* 1. KspjongBasic 의 기본정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('etpOper', 'getKspjongBasic', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpOper.getKspjongBasic Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows.length > 0 ) {
                            resultMsg.dataList  = rows;
                        }

                        callback( null, paramData );
                    });
                },

                /* 2. FutureBasic 의 기본정보를 조회한다. */
                function( msg, callback ) {



                    if( !( resultMsg.dataList && resultMsg.dataList.length > 0 ) ) {
                        stmt = mapper.getStatement('etpOper', 'getFutureBasic', paramData, format);
                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.getFutureBasic Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }

                            if ( rows && rows.length > 0 ) {
                                resultMsg.dataList  = rows;
                            }

                            callback( null );
                        });

                    }else{
                        callback( null );
                    }
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
            resultMsg.msg       =   "[error] etpOper.getKspjongBasic 오류가 발생하였습니다.";
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
 * PDF 관리 -> PDF 긴급반영 정보를 저장한다.
 * 2019-05-20  bkLove(촤병국)
 */
var saveEtpOperPdfModify = function(req, res) {
    try {
        console.log('etpOper.saveEtpOperPdfModify 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpOper.saveEtpOperPdfModify  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.saveEtpOperPdfModify  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        paramData.user_id       =   req.session.user_id;
        paramData.inst_cd       =   req.session.inst_cd;
        paramData.type_cd       =   req.session.type_cd;
        paramData.large_type    =   req.session.large_type;


        var format = { language: 'sql', indent: '' };
        var stmt = "";
/*
{ etf_f16012: 'KR7322410002',
  etf_f16013: '322410',
  etf_f16002: 'HANARO 고배당',
  etf_f16583: '49',
  data:
   [ { status: 'insert',
       code_check: true,
       f16499_prev: 0,
       f12506: '20190513',
       f33861: '2',
       f16316: 'HK0000307485',
       f16002: 'GRT',
       f16499: 0,
       f34840: 0,
       f16588: 0,
       f34743: 0 } ] }
*/
        paramData.allDataList.push(
            {       etf_f16012: 'KR7322410003'
                ,   etf_f16013: '322413'
                ,   etf_f16002: 'HANARO 고배당(test3)'
                ,   etf_f16583: '03'
                ,   data: [ 
                        { 
                            status: 'insert',
                            code_check: true,
                            f12506: '20190513',
                            f33861: '2',
                            f16316: 'HK0000312568',
                            f16002: '오가닉티코스메틱',
                            f16499_prev: 100,                        
                            f16499: 300,
                            f34840: 0,
                            f16588: 0,
                            f34743: 0 
                        },
                        { 
                            status: 'insert',
                            code_check: true,
                            f12506: '20190513',
                            f33861: '2',
                            f16316: 'HK0000341732',
                            f16002: '컬러레이',
                            f16499_prev: 200,                        
                            f16499: 400,
                            f34840: 0,
                            f16588: 0,
                            f34743: 0 
                        },                        
                    ]
            },
            {       etf_f16012: 'KR7322410004'
                ,   etf_f16013: '322414'
                ,   etf_f16002: 'HANARO 고배당(test4)'
                ,   etf_f16583: '04'
                ,   data: [ 
                        { 
                            status: 'insert',
                            code_check: true,
                            f12506: '20190513',
                            f33861: '2',
                            f16316: 'HK0000449303',
                            f16002: '윙입푸드',
                            f16499_prev: 400,                        
                            f16499: 500,
                            f34840: 0,
                            f16588: 0,
                            f34743: 0 
                        },
                        { 
                            status: 'update',
                            code_check: true,
                            f12506: '20190513',
                            f33861: '1',
                            f16316: 'KR7000020008',
                            f16002: '동화약품',
                            f16499_prev: 600,                        
                            f16499: 700,
                            f34840: 0,
                            f16588: 0,
                            f34743: 0 
                        },                        
                    ]
            }            
        )

        resultMsg.dataList  =   [];
        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if( txerr ) {
                    return console.error( txerr );
                }            


                async.forEachOfLimit( paramData.allDataList, 1, function ( subList, index, callback ){

                    var paramData = {
                        f16583      :   subList.etf_f16583,         /* 사무수탁회사번호 */
                        f16012      :   subList.etf_f16012,         /* ETF종목코드 */
                        f16013      :   subList.etf_f16013,         /* ETF단축코드 */

                        dataLists   :   subList.data
                    };
                    

                    paramData.user_id       =   req.session.user_id;
                    paramData.inst_cd       =   req.session.inst_cd;
                    paramData.type_cd       =   req.session.type_cd;
                    paramData.large_type    =   req.session.large_type;
                    paramData.hist_no       =   "";

                    async.waterfall([

                        /* 1. PDF 변경 마스터 정보를 저장한다. */
                        function( callback ) {

                            var stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyMast', paramData, {language:'sql', indent: '  '});
                            console.log( stmt );

                            conn.query(stmt, function( err, rows ) {

                                if( err ) {
                                    resultMsg.result    =   false;
                                    resultMsg.msg       =   "[error] etpOper.saveTmPdfModifyMast Error while performing Query";
                                    resultMsg.err       =   err;

                                    return callback( resultMsg );
                                }


                                callback( null, paramData );                             
                            })
                        },

                        /* 2. PDF 변경 상세 정보 (구성종목) 정보를 저장한다. */
                        function( msg, callback ) {

                            try{

                                var stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyDtl', paramData, {language:'sql', indent: '  '});
                                console.log(stmt);

                                conn.query(stmt, function( err, rows ) {

                                    if( err ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "[error] etpOper.saveTmPdfModifyDtl Error while performing Query";
                                        resultMsg.err       =   err;

                                        return callback( resultMsg );
                                    }

                                    callback( null, paramData );                             
                                })

                            }catch(err){
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.saveTmPdfModifyDtl Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }
                        },                    

                        /* 3. ETF 종목코드별 이력번호 번호를 조회한다. */
                        function( msg, callback ) {


                            stmt = mapper.getStatement('etpOper', 'getHistNoByTmPdfModifyHist', paramData, format);
                            console.log(stmt);

                            conn.query(stmt, function( err, rows ) {

                                if( err ) {
                                    resultMsg.result    =   false;
                                    resultMsg.msg       =   "[error] etpOper.getHistNoByTmPdfModifyHist Error while performing Query";
                                    resultMsg.err       =   err;

                                    return callback( resultMsg );
                                }

                                if ( rows && rows.length == 1 ) {
                                    paramData.hist_no   =   rows[0].hist_no;
                                }

                                callback( null, paramData );
                            });
                        },

                        /* 4. PDF 변경 이력 정보를 저장한다. */
                        function( msg, callback ) {


                            /*  이력번호가 존재하는 경우 */
                            if( paramData.hist_no && paramData.hist_no.length > 0 ) {

                                stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyHist', paramData, format);
                                console.log(stmt);

                                conn.query(stmt, function( err, rows ) {

                                    if( err ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "[error] etpOper.saveTmPdfModifyHist Error while performing Query";
                                        resultMsg.err       =   err;

                                        return callback( resultMsg );
                                    }

                                    callback( null, paramData );
                                });

                            }else{
c
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpOper.saveTmPdfModifyHist Error while performing Query";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }                    
                        },

                    ], function (err) {

                        if( err ) {
                            return  callback( resultMsg );
                        }

                        callback( null, paramData );
                    });                       


                }, function(err) {

                    if( err ) {
                        console.log( err );
                        conn.rollback();

                    }else{
                        resultMsg.result    =   true;
                        resultMsg.msg       =   "성공적으로 저장하였습니다.";
                        resultMsg.err       =   null;

                        conn.commit();
                    }

                    res.json( resultMsg );
                    res.end();
                    
                });     
            });
        });

    } catch(expetion) {

        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result    =   false;
            resultMsg.msg       =   "[error] etpOper.saveEtpOperPdfModify 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

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
module.exports.getEtpOperPdfModify = getEtpOperPdfModify;
module.exports.getJongmokData = getJongmokData;


module.exports.getExchBasic = getExchBasic;
module.exports.getKspjongBasic = getKspjongBasic;
module.exports.getFutureBasic = getFutureBasic;

module.exports.saveEtpOperPdfModify = saveEtpOperPdfModify;

