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

var log = config.logger;

/*
 * ETP 운용관리 - ETP 운영정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperInfo = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperInfo  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperInfo  req.body.data no data.";

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

                /* 1. EtpBasic 의 기본정보를 조회한다. */
                stmt = mapper.getStatement('etpOper', 'getEtpOperInfo', paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getEtpOperInfo Error while performing Query";
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
                resultMsg.msg = "[error] etpOper.getEtpOperInfo Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] etpOper.getEtpOperInfo 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * ETP 운용관리 - 지수관리 를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperIndex = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperIndex 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperIndex  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperIndex  req.body.data no data.";

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


        resultMsg.dataList = [];
        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. Etp 운용관리 - 지수관리 기본정보를 조회한다. */
                function(callback) {

                    paramData.group_concat_max_len = 1000000;
                    stmt = mapper.getStatement('etpOper', 'setGroupConcatMaxLen', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] etpOper.setGroupConcatMaxLen Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        callback(null, paramData);
                    });
                },

                /* 2. Etp 운용관리 - 지수관리 기본정보를 조회한다. */
                function(msg, callback) {

                    stmt = mapper.getStatement('etpOper', 'getEtpOperIndex', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] etpOper.getEtpOperIndex Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows && rows.length > 0) {
                            resultMsg.dataList = rows;
                        }

                        callback(null, paramData);
                    });
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
        resultMsg.msg = "[error] etpOper.getEtpOperIndex 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}


/*
 * ETP 운용관리 - 지수관리 - 해외지수 종가 모니터링을 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperIndexOversea = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperIndexOversea 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperIndexOversea  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperIndexOversea  req.body.data no data.";

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
                stmt = mapper.getStatement('etpOper', 'getEtpOperIndexOversea', paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getEtpOperIndexOversea Error while performing Query";
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
                resultMsg.msg = "[error] etpOper.getEtpOperIndexOversea Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] etpOper.getEtpOperIndexOversea 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * ETP 운용관리 - 지수관리 - 오류내역을 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperIndexError = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperIndexError 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperIndexError  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperIndexOversea  req.body.data no data.";

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


            async.waterfall([

                /* 1. EtpBasic 의 기본정보를 조회한다. */
                function(callback) {

                    stmt = mapper.getStatement('etpOper', 'getEtpOperIndexError', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] etpOper.getEtpOperIndexError Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows && rows.length > 0) {
                            resultMsg.dataList = rows;
                        }

                        callback(null, paramData);
                    });
                },

                /* 2. ETP Basic 정보를 조회한다. */
                function(msg, callback) {

                    if (resultMsg.dataList && resultMsg.dataList.length > 0) {

                        stmt = mapper.getStatement('indexDetail', 'getIndexBasicDetail', paramData, format);

                        // 대입 문자 치환
                        stmt = stmt.replace(/\: =/g, ':=');

                        log.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] indexDetail.getIndexBasicDetail Error while performing Query";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows) {
                                resultMsg.indexBasic = rows[0];
                            }

                            callback(null);
                        });

                    } else {
                        callback(null);
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
        resultMsg.msg = "[error] etpOper.getEtpOperIndexError 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];
        resultMsg.indexBasic = {};

        res.json(resultMsg);
        res.end();
    }
}


/*
 * ETP 운용관리 - PDF관리 정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperPdf = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperPdf 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperPdf  req.body.data no data.", paramData);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdf  req.body.data no data.";

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


        resultMsg.dataList = [];
        resultMsg.allDataList = [];
        Promise.using(pool.connect(), conn => {

            try {
                /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                if (paramData.f16493 == "1" || paramData.f16493 == "2") {

                    stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtfHist', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            log.error(err, stmt, paramData);

                            resultMsg.result = false;
                            resultMsg.msg = "[error] etpOper.getEtpOperPdfEtfHist Error while performing Query";
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

                } else {
                    resultMsg.result = true;
                    resultMsg.msg = "";

                    res.json(resultMsg);
                    res.end();
                }

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] etpOper.getEtpOperPdfEtfHist Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        if (resultMsg && !resultMsg.msg) {
            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdf 오류가 발생하였습니다.";
            resultMsg.err = expetion;
        }

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * ETP 운용관리 - PDF관리 - 이력조회 팝업을 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperPdfEmergencyHistNow = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperPdfEmergencyHistNow 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperPdfEmergencyHistNow  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdfEmergencyHistNow  req.body.data no data.";

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


        resultMsg.allDataList = [];
        Promise.using(pool.connect(), conn => {

            async.waterfall([

                /* 1. 현재시간 에 속한 tm_pdf_modify_hist_mast 정보를 조회한다. */
                function(callback) {

                    try {
                        /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                        if (paramData.f16493 == "1" || paramData.f16493 == "2") {

                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistMastByNow', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] etpOper.getTmPdfModifyHistMastByNow Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    resultMsg.allDataList = rows;
                                }

                                callback(null, paramData);
                            });
                        } else {
                            callback(null, paramData);
                        }

                    } catch (err) {
                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getTmPdfModifyHistMastByNow Error while performing Query";
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

                /* 2. 현재시간 에 속한 tm_pdf_modify_hist_dtl 정보를 조회한다. */
                function(msg, callback) {

                    try {
                        /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                        if (paramData.f16493 == "1" || paramData.f16493 == "2") {

                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistDtlByNow', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] etpOper.getTmPdfModifyHistDtlByNow Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    for (var i in resultMsg.allDataList) {

                                        resultMsg.allDataList[i].etf_f16012 = resultMsg.allDataList[i].f16012; /* ETF 국제표준코드 */
                                        resultMsg.allDataList[i].etf_f16013 = resultMsg.allDataList[i].f16013; /* ETF 단축코드 */
                                        resultMsg.allDataList[i].etf_f16002 = resultMsg.allDataList[i].f16002; /* ETF 한글종목명 */
                                        resultMsg.allDataList[i].etf_f16583 = resultMsg.allDataList[i].f16583; /* ETF 사무수탁회사번호 */

                                        var same = rows.filter(function(o, p) {
                                            return (o.f16583 === resultMsg.allDataList[i].f16583 /* 사무수탁회사번호 */ &&
                                                o.f16012 === resultMsg.allDataList[i].f16012 /* ETF종목코드 */ &&
                                                o.f16013 === resultMsg.allDataList[i].f16013 /* ETF단축코드 */
                                            );
                                        });

                                        if (same.length > 0) {
                                            resultMsg.allDataList[i].data = [];
                                            resultMsg.allDataList[i].data = same;
                                        }
                                    }
                                }

                                callback(null);
                            });
                        } else {
                            callback(null);
                        }

                    } catch (err) {
                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getTmPdfModifyHistDtlByNow Error while performing Query";
                        resultMsg.err = err;

                        return callback(resultMsg);
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
        resultMsg.msg = "[error] etpOper.getEtpOperPdfEmergencyHistNow 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.allDataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * ETP 운용관리 - 비중변경현황 정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperPdfByRateTitle = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperPdfByRateTitle 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperPdfByRateTitle  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdfByRateTitle  req.body.data no data.";

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

        var rateTitleList = [];
        Promise.using(pool.connect(), conn => {

            try {
                /* 1. ETP 운용관리 - 비중변경현황 - 최근 5개 날짜 정보를 조회한다. ( ETF 인 경우 ) */
                stmt = mapper.getStatement('etpOper', "getEtpOperPdfEtfHistByRateTitle", paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getEtpOperPdfEtfHistByRateTitle Error while performing Query";
                        resultMsg.err = err;
                    }

                    if (rows && rows.length > 0) {
                        for (var i = 0; i < rows.length; i++) {
                            var temp = {};

                            temp.index = i;
                            temp.name = "rate_day" + i;
                            temp.show_date = rows[i].show_date;
                            temp.date = rows[i].f12506;

                            rateTitleList.push(temp);
                        }

                        resultMsg.result = true;
                        resultMsg.msg = "";

                        resultMsg.rateTitleList = rateTitleList;
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] etpOper.getEtpOperPdfEtfHistByRateTitle Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] etpOper.getEtpOperPdfByRateTitle 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.rateTitleList = [];

        res.json(resultMsg);
        res.end();
    }
}


/*
 * ETP 운용관리 - 비중변경현황 정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperPdfByRate = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperPdfByRate 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperPdfByRate  req.body.data no data.");
            log.error(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdfByRate  req.body.data no data.";

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



        var rateTitleList = [];
        Promise.using(pool.connect(), conn => {

            async.waterfall([

                /* 1. ETP 운용관리 - 비중변경현황 - 최근 5개 날짜 정보를 조회한다. ( ETF 인 경우 ) */
                function(callback) {

                    stmt = mapper.getStatement('etpOper', "getEtpOperPdfEtfHistByRateTitle", paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] etpOper.getEtpOperPdfEtfHistByRateTitle Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows && rows.length > 0) {
                            for (var i = 0; i < rows.length; i++) {
                                var temp = {};

                                temp.index = i;
                                temp.name = "rate_day" + i;
                                temp.show_date = rows[i].show_date;
                                temp.date = rows[i].f12506;

                                rateTitleList.push(temp);
                            }

                            resultMsg.rateTitleList = rateTitleList;
                        }

                        callback(null, paramData);
                    });

                },

                /* 2. ETP 운용관리 - PDF관리 정보를 조회한다. ( ETF 인 경우 ) */
                function(msg, callback) {

                    if (resultMsg.rateTitleList && resultMsg.rateTitleList.length > 0) {

                        paramData.rateTitleList = resultMsg.rateTitleList;

                        stmt = mapper.getStatement('etpOper', "getEtpOperPdfEtfHistByRate", paramData, format);
                        log.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] etpOper.getEtpOperPdfEtfHistByRate Error while performing Query";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length > 0) {
                                resultMsg.dataList = rows;
                            }

                            callback(null);
                        });

                    } else {

                        callback(null);
                    }
                }

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
        resultMsg.msg = "[error] etpOper.getEtpOperPdfByRate 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.rateTitleList = [];
        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * PDF 관리 -> PDF 긴급반영 정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperPdfModify = function(req, res) {
    try {
        log.debug('etpOper.getEtpOperPdfModify 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getEtpOperPdfModify  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getEtpOperPdfModify  req.body.data no data.";

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


        resultMsg.dataList = [];
        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. ETP 기본 정보를 조회한다. */
                function(callback) {

                    var f16012 = paramData.f16012;
                    if (paramData.searchCode) {
                        paramData.f16012 = "";
                    }
                    stmt = mapper.getStatement('etpDetail', 'getEtpBasic', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] etpDetail.getEtpBasic Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows && rows.length == 1) {
                            resultMsg.etpBasic = rows[0];
                        }

                        paramData.f16012 = f16012;

                        callback(null, paramData);
                    });
                },

                /* 2. ETF 정보를 조회한다. */
                function(msg, callback) {

                    /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    if (resultMsg.etpBasic &&
                        (resultMsg.etpBasic.f16493 == "1" || resultMsg.etpBasic.f16493 == "2")
                    ) {

                        stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtfEmergency', paramData, format);
                        log.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] etpOper.getEtpOperPdfEtfEmergency Error while performing Query";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length > 0) {

                                for (var i in rows) {
                                    rows[i].status = "normal";

                                    rows[i].f16499 = rows[i].f16499; /* 1CU단위증권수 */
                                    rows[i].f16499_prev = rows[i].f16499; /* 1CU단위증권수 */

                                    rows[i].f34840 = rows[i].f34840; /* 액면금액설정현금액 */
                                    rows[i].f34840_prev = rows[i].f34840; /* 액면금액설정현금액 */

                                    rows[i].code_check = true; /* 코드 체크 ( defulat : true ) */

                                    resultMsg.dataList.push(rows[i]);
                                }
                            }

                            callback(null);
                        });
                    } else {
                        callback(null);
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
        resultMsg.msg = "[error] etpOper.getEtpOperPdfByRate 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.etpBasic = {};
        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 국제표준코드에 속한 종목정보( td_kspjong_basic, td_future_basic )를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getJongmokData = function(req, res) {
    try {
        log.debug('etpOper.getJongmokData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getJongmokData  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getJongmokData  req.body.data no data.";

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
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getKspjongBasic Error while performing Query";
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
                resultMsg.msg = "[error] etpOper.getKspjongBasic Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] etpOper.getKspjongBasic 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}


/*
 * PDF 관리 -> PDF 긴급반영 정보를 저장한다.
 * 2019-05-20  bkLove(촤병국)
 */
var saveEtpOperPdfModify = function(req, res) {
    try {
        log.debug('etpOper.saveEtpOperPdfModify 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.saveEtpOperPdfModify  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.saveEtpOperPdfModify  req.body.data no data.";

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


        resultMsg.dataList = [];
        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return log.error(txerr);
                }
                log.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>");
                log.debug(paramData.allDataList);

                async.waterfall([

                    /* 1. 사용자별 처리한 그룹번호를 조회한다. */
                    function(callback) {

                        stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistMastGroupNo', paramData, format);
                        log.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] etpOper.getTmPdfModifyHistMastGroupNo Error while performing Query";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length == 1) {
                                paramData.group_no = rows[0].group_no;
                            }

                            callback(null, paramData);
                        });
                    },

                    function(msg, callback) {

                        log.debug("####group_no=[" + paramData.group_no + "]");

                        if (!paramData.group_no) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] group_no 가 존재하지 않습니다.";
                            resultMsg.err = "[error] etpOper.getTmPdfModifyHistMastGroupNo  group_no not data";

                            return callback(resultMsg);

                        } else {

                            async.forEachOfLimit(paramData.allDataList, 1, function(subList, index, callback) {

                                paramData.f16583 = subList.etf_f16583; /* 사무수탁회사번호 */
                                paramData.f16012 = subList.etf_f16012; /* ETF종목코드 */
                                paramData.f16013 = subList.etf_f16013; /* ETF단축코드 */
                                paramData.dataLists = subList.data;

                                log.debug(paramData);

                                var arrAllDtl = [];
                                var arrInsertDtl = [];
                                var arrModifyDtl = [];
                                var arrDeleteDtl = [];

                                async.waterfall([

                                    /*
                                     * 2. ETP 운용관리 - PDF 긴급반영 - 저장시 td_etfpdf_basic 에 데이터가 존재하는지 체크한다.
                                     *
                                     * 1) td_etfpdf_basic 에 없는 경우 'insert'
                                     * 2) td_etfpdf_basic 에 존재하는 경우 'update'
                                     *
                                     */
                                    function(callback) {

                                        try {

                                            var stmt = mapper.getStatement('etpOper', 'getTdEtfpdfBasicExistsCheck', paramData, { language: 'sql', indent: '  ' });
                                            log.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = "[error] etpOper.getTdEtfpdfBasicExistsCheck Error while performing Query";
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
                                            })

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.getTdEtfpdfBasicExistsCheck Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 3. td_etfpdf_basic 에 저장한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrInsertDtl && arrInsertDtl.length > 0) {
                                                paramData.dataLists = arrInsertDtl;
                                                var stmt = mapper.getStatement('etpOper', 'saveTdEtfpdfBasic', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.saveTdEtfpdfBasic Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.saveTdEtfpdfBasic Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 4. [td_etfpdf_basic] 테이블의 f33837(구성종목수) 을 수정한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrInsertDtl && arrInsertDtl.length > 0) {
                                                var stmt = mapper.getStatement('etpOper', 'modifyTdEtfpdfBasicF33837', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.modifyTdEtfpdfBasicF33837 Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.modifyTdEtfpdfBasicF33837 Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 5. td_etfpdf_basic 에 수정한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrModifyDtl && arrModifyDtl.length > 0) {
                                                paramData.dataLists = arrModifyDtl;
                                                var stmt = mapper.getStatement('etpOper', 'modifyTdEtfpdfBasic', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.modifyTdEtfpdfBasic Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.modifyTdEtfpdfBasic Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /*  6. td_etfpdf_hist에 저장하기 위해 변경된 td_etfpdf_basic 의 데이터를 조회한다. */
                                    function(msg, callback) {

                                        try {

                                            arrAllDtl = [];

                                            paramData.dataLists = subList.data;
                                            var stmt = mapper.getStatement('etpOper', 'getTdEtfpdfBasicAllData', paramData, { language: 'sql', indent: '  ' });
                                            log.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = "[error] etpOper.getTdEtfpdfBasicAllData Error while performing Query";
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows && rows.length > 0) {
                                                    arrAllDtl = rows;
                                                }

                                                callback(null, paramData);
                                            })

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.getTdEtfpdfBasicAllData Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /*
                                     * 7. ETP 운용관리 - PDF 긴급반영 - 저장시 td_etfpdf_hist 에 데이터가 존재하는지 체크한다.
                                     *
                                     * 1) td_etfpdf_hist 에 없는 경우 'insert'
                                     * 2) td_etfpdf_hist 에 존재하는 경우 'update'
                                     *
                                     */
                                    function(msg, callback) {

                                        try {

                                            arrInsertDtl = [];
                                            arrModifyDtl = [];
                                            arrDeleteDtl = [];

                                            if (arrAllDtl && arrAllDtl.length > 0) {

                                                paramData.dataLists = arrAllDtl;
                                                var stmt = mapper.getStatement('etpOper', 'getTdEtfpdfHistExistsCheck', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.getTdEtfpdfHistExistsCheck Error while performing Query";
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
                                                })
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.getTdEtfpdfHistExistsCheck Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 8. td_etfpdf_hist 에 저장한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrInsertDtl && arrInsertDtl.length > 0) {
                                                paramData.dataLists = arrInsertDtl;
                                                var stmt = mapper.getStatement('etpOper', 'saveTdEtfpdfHist', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.saveTdEtfpdfHist Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.saveTdEtfpdfHist Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 9. [td_etfpdf_hist] 테이블의 f33837(구성종목수) 을 수정한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrInsertDtl && arrInsertDtl.length > 0) {
                                                var stmt = mapper.getStatement('etpOper', 'modifyTdEtfpdfHistF33837', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.modifyTdEtfpdfHistF33837 Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.modifyTdEtfpdfHistF33837 Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 10. td_etfpdf_hist 에 수정한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrModifyDtl && arrModifyDtl.length > 0) {
                                                paramData.dataLists = arrModifyDtl;
                                                var stmt = mapper.getStatement('etpOper', 'modifyTdEtfpdfHist', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.modifyTdEtfpdfHist Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.modifyTdEtfpdfHist Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 
                                     * 11. ETP 운용관리 - PDF 긴급반영 - 저장시 상세에 이미 등록된 데이터가 존재하는지 체크한다.  
                                     *
                                     * 1) tm_pdf_modify_dtl 에 없는 경우에는 'insert'
                                     * 2) tm_pdf_modify_dtl 에 존재하고 CU수량과 액면금액 모두 td_etfpdf_basic 의 값과 동일한 경우 'delete'
                                     * 3) tm_pdf_modify_dtl 에 존재하고 CU수량과 액면금액이 td_etfpdf_basic 의 값과 다른 경우 'modify'
                                     *                             
                                     */
                                    function(msg, callback) {

                                        try {

                                            arrAllDtl = [];
                                            arrInsertDtl = [];
                                            arrModifyDtl = [];
                                            arrDeleteDtl = [];

                                            paramData.dataLists = subList.data;
                                            var stmt = mapper.getStatement('etpOper', 'getTmPdfModifyDtlExistsCheck', paramData, { language: 'sql', indent: '  ' });
                                            log.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = "[error] etpOper.getTmPdfModifyDtlExistsCheck Error while performing Query";
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows && rows.length > 0) {
                                                    for (var i in rows) {
                                                        if (rows[i].dtl_status == "insert") {
                                                            arrInsertDtl.push(rows[i]);
                                                        } else if (rows[i].dtl_status == "modify") {
                                                            arrModifyDtl.push(rows[i]);
                                                        } else if (rows[i].dtl_status == "delete") {
                                                            arrDeleteDtl.push(rows[i]);
                                                        }
                                                    }

                                                    arrAllDtl = rows;
                                                }

                                                callback(null, paramData);
                                            })

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.getTmPdfModifyDtlExistsCheck Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 12. PDF 변경 상세 정보 (구성종목) 정보를 저장한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrInsertDtl && arrInsertDtl.length > 0) {

                                                paramData.dataLists = arrInsertDtl;
                                                var stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyDtl', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.saveTmPdfModifyDtl Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.saveTmPdfModifyDtl Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 13. PDF 변경 상세 정보 (구성종목) 정보를 수정한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrModifyDtl && arrModifyDtl.length > 0) {
                                                paramData.dataLists = arrModifyDtl;
                                                var stmt = mapper.getStatement('etpOper', 'modifyTmPdfModifyDtl', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.modifyTmPdfModifyDtl Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.modifyTmPdfModifyDtl Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 14. PDF 변경 상세 정보 (구성종목) 정보를 삭제한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrDeleteDtl && arrDeleteDtl.length > 0) {
                                                paramData.dataLists = arrDeleteDtl;
                                                var stmt = mapper.getStatement('etpOper', 'deleteTmPdfModifyDtl', paramData, { language: 'sql', indent: '  ' });
                                                log.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = "[error] etpOper.deleteTmPdfModifyDtl Error while performing Query";
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    callback(null, paramData);
                                                })

                                            } else {
                                                callback(null, paramData);
                                            }

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.deleteTmPdfModifyDtl Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 15. ETP 운용관리 - PDF 긴급반영 - 저장시 마스터 상태정보를 조회한다. */
                                    function(msg, callback) {

                                        try {
                                            var stmt = mapper.getStatement('etpOper', 'getTmPdfModifyMastCheck', paramData, { language: 'sql', indent: '  ' });
                                            log.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = "[error] etpOper.getTmPdfModifyMastCheck Error while performing Query";
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows && rows.length == 1) {
                                                    paramData.mast_status = rows[0].mast_status;
                                                }

                                                callback(null, paramData);
                                            })

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper.getTmPdfModifyMastCheck Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 16. PDF 변경 마스터 정보를 변경한다. */
                                    function(msg, callback) {

                                        var queryId = "saveTmPdfModifyMast";
                                        try {

                                            if (paramData.mast_status == "insert") {
                                                queryId = "saveTmPdfModifyMast";
                                            } else if (paramData.mast_status == "modify") {
                                                queryId = "modifyTmPdfModifyMast";
                                            } else if (paramData.mast_status == "delete") {
                                                queryId = "deleteTmPdfModifyMast";
                                            }

                                            var stmt = mapper.getStatement('etpOper', queryId, paramData, { language: 'sql', indent: '  ' });
                                            log.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = "[error] etpOper." + queryId + " Error while performing Query";
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }


                                                callback(null, paramData);
                                            })
                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] etpOper." + queryId + " Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 17. PDF 변경 이력 마스터 정보를 저장한다. */
                                    function(msg, callback) {

                                        var stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyHistMast', paramData, { language: 'sql', indent: '  ' });
                                        log.debug(stmt);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] etpOper.saveTmPdfModifyHistMast Error while performing Query";
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            if (rows) {
                                                paramData.hist_no = rows.insertId;
                                            }

                                            callback(null, paramData);
                                        })

                                    },

                                    /* 18. PDF 변경 이력 상세 정보를 저장한다. */
                                    function(msg, callback) {

                                        paramData.dataLists = arrAllDtl;
                                        stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyHistDtl', paramData, format);
                                        log.debug(stmt);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] etpOper.saveTmPdfModifyHistDtl Error while performing Query";
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            callback(null, paramData);
                                        });

                                    },

                                ], function(err) {

                                    if (err) {
                                        return callback(resultMsg);
                                    }

                                    callback(null);
                                });


                            }, function(err) {

                                if (err) {
                                    return callback(resultMsg);
                                }

                                callback(null);

                            });
                        }
                    }

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
        resultMsg.msg = "[error] etpOper.saveEtpOperPdfModify 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 최근 group_no 에 속한 pdf 수정정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getPdfByGroupNo = function(req, res) {

    try {
        log.debug('etpOper.getPdfByGroupNo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getPdfByGroupNo  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getPdfByGroupNo  req.body.data no data.";

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

        resultMsg.allDataList = [];
        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. 최근에 저장된 group_no 를 조회한다. */
                function(callback) {

                    try {
                        stmt = mapper.getStatement('etpOper', 'getMaxGroupNo', paramData, format);
                        log.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] etpOper.getMaxGroupNo Error while performing Query";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (!rows || rows.length != 1) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] etpOper.getMaxGroupNo group_no 가 존재하지 않습니다.";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length == 1) {
                                paramData.group_no = rows[0].group_no;
                            }

                            callback(null, paramData);
                        });

                    } catch (err) {
                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getMaxGroupNo Error while performing Query";
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

                /* 2. group_no 에 속한 tm_pdf_modify_hist_mast 정보를 조회한다. */
                function(msg, callback) {

                    try {
                        if (paramData.group_no) {
                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistMastByGroupNo', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] etpOper.getTmPdfModifyHistMastByGroupNo Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    resultMsg.allDataList = rows;
                                }

                                callback(null, paramData);
                            });

                        } else {
                            callback(null, paramData);
                        }

                    } catch (err) {
                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getTmPdfModifyHistMastByGroupNo Error while performing Query";
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

                /* 3. group_no 에 속한 tm_pdf_modify_hist_dtl 정보를 조회한다. */
                function(msg, callback) {

                    try {
                        if (paramData.group_no) {
                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistDtlByGroupNo', paramData, format);
                            log.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] etpOper.getTmPdfModifyHistDtlByGroupNo Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {

                                    for (var i in resultMsg.allDataList) {

                                        resultMsg.allDataList[i].etf_f16012 = resultMsg.allDataList[i].f16012; /* ETF 국제표준코드 */
                                        resultMsg.allDataList[i].etf_f16013 = resultMsg.allDataList[i].f16013; /* ETF 단축코드 */
                                        resultMsg.allDataList[i].etf_f16002 = resultMsg.allDataList[i].f16002; /* ETF 한글종목명 */
                                        resultMsg.allDataList[i].etf_f16583 = resultMsg.allDataList[i].f16583; /* ETF 사무수탁회사번호 */

                                        var same = rows.filter(function(o, p) {
                                            return (o.hist_no === resultMsg.allDataList[i].hist_no /* 이력번호 */ &&
                                                o.email === resultMsg.allDataList[i].email /* 이메일 */ &&
                                                o.f16583 === resultMsg.allDataList[i].f16583 /* 사무수탁회사번호 */ &&
                                                o.f16012 === resultMsg.allDataList[i].f16012 /* ETF종목코드 */ &&
                                                o.f16013 === resultMsg.allDataList[i].f16013 /* ETF단축코드 */ &&
                                                o.group_no === resultMsg.allDataList[i].group_no /* 사용자별 처리한 그룹번호 */
                                            );
                                        });

                                        if (same.length > 0) {
                                            resultMsg.allDataList[i].data = [];
                                            resultMsg.allDataList[i].data = same;
                                        }
                                    }
                                }

                                callback(null);
                            });

                        } else {
                            callback(null);
                        }

                    } catch (err) {
                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getTmPdfModifyHistDtlByGroupNo Error while performing Query";
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                }

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
        resultMsg.msg = "[error] etpOper.getPdfByGroupNo 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}


/*
 * 현재일자에 PDF 변경건이 존재하는지 반환한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getPdfExistYnByNow = function(req, res) {

    try {
        log.debug('etpOper.getPdfExistYnByNow 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpOper.getPdfExistYnByNow  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpOper.getPdfExistYnByNow  req.body.data no data.";

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

        resultMsg.emergency_exist_yn = "N";
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('etpOper', 'getPdfExistYnByNow', paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getPdfExistYnByNow Error while performing Query";
                        resultMsg.err = err;
                    }

                    if (!rows || rows.length != 1) {
                        resultMsg.result = false;
                        resultMsg.msg = "[error] etpOper.getMaxGroupNo emergency_exist_yn 가 존재하지 않습니다.";
                        resultMsg.err = err;
                    }

                    if (rows && rows.length == 1) {

                        resultMsg.result = true;
                        resultMsg.msg = "";

                        resultMsg.emergency_exist_yn = rows[0].emergency_exist_yn;
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] etpOper.getPdfExistYnByNow Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, stmt, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] etpOper.getPdfExistYnByNow 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        res.json(resultMsg);
        res.end();
    }
}


module.exports.getEtpOperInfo = getEtpOperInfo;
module.exports.getEtpOperIndex = getEtpOperIndex;
module.exports.getEtpOperIndexOversea = getEtpOperIndexOversea;
module.exports.getEtpOperIndexError = getEtpOperIndexError;
module.exports.getEtpOperPdf = getEtpOperPdf;
module.exports.getEtpOperPdfByRateTitle = getEtpOperPdfByRateTitle;
module.exports.getEtpOperPdfByRate = getEtpOperPdfByRate;
module.exports.getEtpOperPdfModify = getEtpOperPdfModify;
module.exports.getJongmokData = getJongmokData;

module.exports.saveEtpOperPdfModify = saveEtpOperPdfModify;
module.exports.getPdfByGroupNo = getPdfByGroupNo;
module.exports.getPdfExistYnByNow = getPdfExistYnByNow;
module.exports.getEtpOperPdfEmergencyHistNow = getEtpOperPdfEmergencyHistNow;