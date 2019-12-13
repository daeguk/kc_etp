/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var os = require('os');
var fs = require('fs');
var config = require('../../../config/config');
var util = require('../../../util/util');
var sms = require('../../../util/sms');
var logg = require('../../../util/logg');
var Promise = require("bluebird");

// var multer = require('multer');
// var xlsx = require('xlsx');
var async = require('async');

/*
 * ETP 운용관리 - ETP 운영정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getEtpOperInfo = function(req, res) {
  try {
    logg.debug('etpOper.getEtpOperInfo 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};

    /* 1. body.data 값이 있는지 체크 */
    if (!req.body.data) {
      logg.error("[error] etpOper.getEtpOperInfo  req.body.data no data.", req.body.data);
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
      try {
        /* 1. EtpBasic 의 기본정보를 조회한다. */
        stmt = mapper.getStatement('etpOper', 'getEtpOperInfo', paramData, format);
        logg.debug(stmt, paramData);
        conn.query(stmt, function(err, rows) {
          if (err) {
            logg.error(err, stmt, paramData);
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = err;
          }else if(rows && rows.length > 0) {
            resultMsg.result = true;
            resultMsg.msg = "";
            resultMsg.dataList = rows;
          }
          res.json(resultMsg);
          res.end();
        });
      } catch (err) {
        logg.error(err, stmt, paramData);
        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = err;

        res.json(resultMsg);
        res.end();
      }
    });
  } catch (expetion) {
    logg.error(expetion, paramData);
    resultMsg.result = false;
    resultMsg.msg = config.MSG.error01;
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
        logg.debug('etpOper.getEtpOperIndex 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getEtpOperIndex  req.body.data no data.", req.body.data);

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


        resultMsg.dataList = [];
        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. Etp 운용관리 - 지수관리 기본정보를 조회한다. */
                function(callback) {

                    try{
                        paramData.group_concat_max_len = 1000000;
                        stmt = mapper.getStatement('etpOper', 'setGroupConcatMaxLen', paramData, format);
                        logg.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            callback(null, paramData);
                        });
                    } catch (err) {
                        logg.error(err);
                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

                /* 2. Etp 운용관리 - 지수관리 기본정보를 조회한다. */
                function(msg, callback) {

                    try{
                        stmt = mapper.getStatement('etpOper', 'getEtpOperIndex', paramData, format);
                        logg.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                logg.error(err);
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length > 0) {
                                resultMsg.dataList = rows;
                            }

                            callback(null, paramData);
                        });

                    } catch (err) {

                        logg.error(err);
                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

            ], function(err) {

                if (err) {
                    logg.error(err, stmt, paramData);
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

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
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
        logg.debug('etpOper.getEtpOperIndexOversea 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("etpOper.getEtpOperIndexOversea  req.body.data no data.");

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

            try {
                stmt = mapper.getStatement('etpOper', 'getEtpOperIndexOversea', paramData, format);
                logg.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        logg.error(err);

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
                logg.error(err);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
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
        logg.debug('etpOper.getEtpOperIndexError 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getEtpOperIndexError  req.body.data no data.");

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


            async.waterfall([

                /* 1. EtpBasic 의 기본정보를 조회한다. */
                function(callback) {

                    try{
                        stmt = mapper.getStatement('etpOper', 'getEtpOperIndexError', paramData, format);
                        logg.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length > 0) {
                                resultMsg.dataList = rows;
                            }

                            callback(null, paramData);
                        });

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

                /* 2. ETP Basic 정보를 조회한다. */
                function(msg, callback) {

                    try{
                        if (resultMsg.dataList && resultMsg.dataList.length > 0) {

                            stmt = mapper.getStatement('indexDetail', 'getIndexBasicDetail', paramData, format);

                            // 대입 문자 치환
                            stmt = stmt.replace(/\: =/g, ':=');

                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
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

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }                        
                },

            ], function(err) {

                if (err) {
                    logg.error(err);
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

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
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
        logg.debug('etpOper.getEtpOperPdf 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getEtpOperPdf  req.body.data no data.");

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


        resultMsg.dataList = [];
        resultMsg.allDataList = [];
        Promise.using(pool.connect(), conn => {

            async.waterfall([

                /* 1. ETP 운용관리 - PDF관리 정보를 조회한다. ( ETF 인 경우 ) */
                function(callback) {

                    try {

                        /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                        if (paramData.F16493 == "1" || paramData.F16493 == "2") {

                            stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtfHist', paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    resultMsg.dataList = rows;

                                    for (var i in resultMsg.dataList) {
                                        resultMsg.dataList[i].status = "";
                                    }
                                }

                                callback(null, paramData);
                            });
                        } else {
                            callback(null, paramData);
                        }

                    } catch (err) {
                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

                /* 2. etfpdf_hist 에서 선택된 날짜에 속한 정보 중 가장 최근 데이터의 상태값을 조회한다. */
                function(msg, callback) {

                    try {
                        stmt = mapper.getStatement('etpOper', 'getStatusByEtpOperPdfEtfHist', paramData, format);
                        logg.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length > 0) {
                                for (var i in resultMsg.dataList) {

                                    var same = rows.filter(function(o, p) {
                                        return (o.F12506 === resultMsg.dataList[i].F12506 /* 일자 */ 
                                            &&  o.F16583 === resultMsg.dataList[i].F16583 /* 사무수탁회사번호 */ 
                                            &&  o.F16012 === resultMsg.dataList[i].F16012 /* ETF종목코드 */
                                            &&  o.F16013 === resultMsg.dataList[i].F16013 /* ETF단축코드 */
                                            &&  o.F16316 === resultMsg.dataList[i].F16316 /* 구성종목코드 */
                                        );
                                    });

                                    if (same.length == 1) {
                                        resultMsg.dataList[i].status = same[0].status;
                                    }
                                }
                            }

                            callback(null);
                        });

                    } catch (err) {
                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

            ], function(err) {

                if (err) {
                    logg.error(err);
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

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

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
        logg.debug('etpOper.getEtpOperPdfEmergencyHistNow 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getEtpOperPdfEmergencyHistNow  req.body.data no data.");

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


        resultMsg.allDataList = [];
        Promise.using(pool.connect(), conn => {

            async.waterfall([

                /* 1. 현재시간 에 속한 tm_pdf_modify_hist_mast 정보를 조회한다. */
                function(callback) {

                    try {
                        /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                        if (paramData.F16493 == "1" || paramData.F16493 == "2") {

                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistMastByNow', paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
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
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

                /* 2. 현재시간 에 속한 tm_pdf_modify_hist_dtl 정보를 조회한다. */
                function(msg, callback) {

                    try {
                        /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                        if (paramData.F16493 == "1" || paramData.F16493 == "2") {

                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistDtlByNow', paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    for (var i in resultMsg.allDataList) {

                                        resultMsg.allDataList[i].etf_F16012 = resultMsg.allDataList[i].F16012; /* ETF 국제표준코드 */
                                        resultMsg.allDataList[i].etf_F16013 = resultMsg.allDataList[i].F16013; /* ETF 단축코드 */
                                        resultMsg.allDataList[i].etf_F16002 = resultMsg.allDataList[i].F16002; /* ETF 한글종목명 */
                                        resultMsg.allDataList[i].etf_F16583 = resultMsg.allDataList[i].F16583; /* ETF 사무수탁회사번호 */

                                        var same = rows.filter(function(o, p) {
                                            return (o.F16583 === resultMsg.allDataList[i].F16583 /* 사무수탁회사번호 */ 
                                                &&  o.F16012 === resultMsg.allDataList[i].F16012 /* ETF종목코드 */ 
                                                &&  o.F16013 === resultMsg.allDataList[i].F16013 /* ETF단축코드 */
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
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

            ], function(err) {

                if (err) {
                    logg.error(err);
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

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
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
        logg.debug('etpOper.getEtpOperPdfByRateTitle 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getEtpOperPdfByRateTitle  req.body.data no data.");

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

        var rateTitleList = [];
        Promise.using(pool.connect(), conn => {

            try {

                /* 1. ETP 운용관리 - 비중변경현황 - 최근 5개 날짜 정보를 조회한다. ( ETF 인 경우 ) */
                stmt = mapper.getStatement('etpOper', "getEtpOperPdfEtfHistByRateTitle", paramData, format);
                logg.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        logg.error(err);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if (rows && rows.length > 0) {
                        for (var i = 0; i < rows.length; i++) {
                            var temp = {};

                            temp.index = i;
                            temp.name = "rate_day" + i;
                            temp.show_date = rows[i].show_date;
                            temp.date = rows[i].F12506;

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
                logg.error(err);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
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
        logg.debug('etpOper.getEtpOperPdfByRate 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getEtpOperPdfByRate  req.body.data no data.");
            logg.error(req.body.data);

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



        var rateTitleList = [];
        Promise.using(pool.connect(), conn => {

            async.waterfall([

                /* 1. ETP 운용관리 - 비중변경현황 - 최근 5개 날짜 정보를 조회한다. ( ETF 인 경우 ) */
                function(callback) {

                    try{
                        stmt = mapper.getStatement('etpOper', "getEtpOperPdfEtfHistByRateTitle", paramData, format);
                        logg.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length > 0) {
                                for (var i = 0; i < rows.length; i++) {
                                    var temp = {};

                                    temp.index = i;
                                    temp.name = "rate_day" + i;
                                    temp.show_date = rows[i].show_date;
                                    temp.date = rows[i].F12506;

                                    rateTitleList.push(temp);
                                }

                                resultMsg.rateTitleList = rateTitleList;
                            }

                            callback(null, paramData);
                        });

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

                /* 2. ETP 운용관리 - PDF관리 정보를 조회한다. ( ETF 인 경우 ) */
                function(msg, callback) {

                    try{
                        if (resultMsg.rateTitleList && resultMsg.rateTitleList.length > 0) {

                            paramData.rateTitleList = resultMsg.rateTitleList;

                            stmt = mapper.getStatement('etpOper', "getEtpOperPdfEtfHistByRate", paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    resultMsg.dataList = rows;

                                    for (var i in resultMsg.dataList) {
                                        resultMsg.dataList[i].status = "";
                                    }                                    
                                }

                                callback(null, paramData);
                            });

                        } else {

                            callback(null, paramData);
                        }

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

                /* 3. etfpdf_hist 에서 선택된 날짜에 속한 정보 중 가장 최근 데이터의 상태값을 조회한다. */
                function(msg, callback) {

                    try {
                        if (resultMsg.rateTitleList && resultMsg.rateTitleList.length > 0) {
                            stmt = mapper.getStatement('etpOper', 'getStatusByEtpOperPdfEtfHist', paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    for (var i in resultMsg.dataList) {

                                        var same = rows.filter(function(o, p) {
                                            return (o.F12506 === resultMsg.dataList[i].F12506 /* 일자 */ 
                                                &&  o.F16583 === resultMsg.dataList[i].F16583 /* 사무수탁회사번호 */ 
                                                &&  o.F16012 === resultMsg.dataList[i].F16012 /* ETF종목코드 */
                                                &&  o.F16013 === resultMsg.dataList[i].F16013 /* ETF단축코드 */
                                                &&  o.F16316 === resultMsg.dataList[i].F16316 /* 구성종목코드 */
                                            );
                                        });

                                        if (same.length == 1) {
                                            resultMsg.dataList[i].status = same[0].status;
                                        }
                                    }
                                }

                                callback(null);
                            });
                            
                        } else {

                            callback(null, paramData);
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
                    logg.error(err);
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

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
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
        logg.debug('etpOper.getEtpOperPdfModify 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getEtpOperPdfModify  req.body.data no data.");

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


        resultMsg.dataList = [];
        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. ETP 기본 정보를 조회한다. */
                function(callback) {

                    try{
                        stmt = mapper.getStatement('etpOper', 'getEtpBasic', paramData, format);
                        logg.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length > 1) {
                                resultMsg.result = false;
                                resultMsg.msg = "해당 코드는 1건 이상 존재합니다.";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }                            

                            if (rows && rows.length == 1) {
                                resultMsg.etpBasic = rows[0];
                            }

                            callback(null, paramData);
                        });

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

                /* 2. ETF 정보를 조회한다. */
                function(msg, callback) {

                    try{
                        /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                        if (resultMsg.etpBasic &&
                            (resultMsg.etpBasic.F16493 == "1" || resultMsg.etpBasic.F16493 == "2")
                        ) {

                            stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtfEmergency', paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {

                                    for (var i in rows) {
                                        rows[i].status = "normal";

                                        rows[i].F16499_prev = rows[i].F16499;   /* 1CU단위증권수 (변경전) */
                                        rows[i].F34840_prev = rows[i].F34840;   /* 액면금액설정현금액 (변경전) */
                                        rows[i].F16588_prev = rows[i].F16588;   /* 평가금액 (변경전) */
                                        rows[i].F15007      = 0;                /* kspjong_basic 기준가 (신규추가시 사용) */

                                        rows[i].code_check = true; /* 코드 체크 ( defulat : true ) */

                                        resultMsg.dataList.push(rows[i]);
                                    }
                                }

                                callback(null);
                            });
                        } else {
                            callback(null);
                        }

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

            ], function(err) {

                if (err) {
                    logg.error(err);
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

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.etpBasic = {};
        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 국제표준코드에 속한 종목정보( td_kspjong_basic )를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getJongmokData = function(req, res) {
    try {
        logg.debug('etpOper.getJongmokData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getJongmokData  req.body.data no data.");

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
                stmt = mapper.getStatement('etpOper', 'getKspjongBasic', paramData, format);
                logg.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        logg.error(err);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if (!err) {
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
                logg.error(err);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 국제표준코드에 속한 종목정보( td_future_basic )를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getFutureBasic1 = function (req, res) {
    try {
        logg.debug('etpOper=>getFutureBasic1 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getFutureBasic1  req.body.data no data.");

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
                stmt = mapper.getStatement('etpOper', 'getFutureBasic', paramData, format);
                logg.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        logg.error(err);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if (!err) {
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
                logg.error(err);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dataList = [];

        res.json(resultMsg);
        res.end();
    }
};


/*
 * PDF 관리 -> PDF 긴급반영 정보를 저장한다.
 * 2019-05-20  bkLove(촤병국)
 */
var saveEtpOperPdfModify = function(req, res) {
    try {
        logg.info('etpOper.saveEtpOperPdfModify 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        var arrAllDtl = [];
        var arrInsertDtl = [];
        var arrModifyDtl = [];
        var ip = "";
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.saveEtpOperPdfModify  req.body.data no data.");

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }else {
          ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
          logg.debug("IP : " + ip);
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));
        var fsData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );
        paramData.reg_ip = ip;
        logg.debug("paramData.............");
        logg.debug(paramData.allDataList[0].data);

        var format = { language: 'sql', indent: '' };
        var stmt = "";

        resultMsg.dataList = [];
        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return logg.error(txerr);
                }
                logg.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>");
                logg.debug(paramData.allDataList);

                async.waterfall([

                    /* 1. 사용자별 처리한 그룹번호를 조회한다. */
                    function(callback) {

                        try{
                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistMastGroupNo', paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
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
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    function(msg, callback) {

                        logg.debug("####group_no=[" + paramData.group_no + "]");

                        if (!paramData.group_no) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = "[error] etpOper.getTmPdfModifyHistMastGroupNo  group_no not data";

                            return callback(resultMsg);

                        } else {

                            async.forEachOfLimit(paramData.allDataList, 1, function(subList, index, callback) {

                                paramData.F16583 = subList.etf_F16583; /* 사무수탁회사번호 */
                                paramData.F16012 = subList.etf_F16012; /* ETF종목코드 */
                                paramData.F16013 = subList.etf_F16013; /* ETF단축코드 */
                                paramData.dataLists = subList.data;

                                logg.debug( "$$$$$$$ 인자값 $$$$$$$ START", paramData, subList, "$$$$$$$ 인자값 $$$$$$$ END");

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
                                            arrAllDtl = [];
                                            arrInsertDtl = [];
                                            arrModifyDtl = [];

                                            var stmt = mapper.getStatement('etpOper', 'getTdEtfpdfBasicExistsCheck', paramData, { language: 'sql', indent: '  ' });
                                            logg.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
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
                                                logg.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 4. td_etfpdf_basic 에 수정한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrModifyDtl && arrModifyDtl.length > 0) {
                                                paramData.dataLists = arrModifyDtl;
                                                var stmt = mapper.getStatement('etpOper', 'modifyTdEtfpdfBasic', paramData, { language: 'sql', indent: '  ' });
                                                logg.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /*
                                     * 5. ETP 운용관리 - PDF 긴급반영 - 저장시 td_etfpdf_hist 에 데이터가 존재하는지 체크한다.
                                     *
                                     * 1) td_etfpdf_hist 에 없는 경우 'insert'
                                     * 2) td_etfpdf_hist 에 존재하는 경우 'update'
                                     *
                                     */
                                    function(msg, callback) {

                                        try {

                                            arrInsertDtl = [];
                                            arrModifyDtl = [];

                                            paramData.dataLists = subList.data;
                                            var stmt = mapper.getStatement('etpOper', 'getTdEtfpdfHistExistsCheck', paramData, { language: 'sql', indent: '  ' });
                                            logg.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 6. td_etfpdf_hist 에 저장한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrInsertDtl && arrInsertDtl.length > 0) {
                                                paramData.dataLists = arrInsertDtl;
                                                var stmt = mapper.getStatement('etpOper', 'saveTdEtfpdfHist', paramData, { language: 'sql', indent: '  ' });
                                                logg.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 7. td_etfpdf_hist 에 수정한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrModifyDtl && arrModifyDtl.length > 0) {
                                                paramData.dataLists = arrModifyDtl;
                                                var stmt = mapper.getStatement('etpOper', 'modifyTdEtfpdfHist', paramData, { language: 'sql', indent: '  ' });
                                                logg.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 
                                     * 8. ETP 운용관리 - PDF 긴급반영 - 저장시 상세에 이미 등록된 데이터가 존재하는지 체크한다.  
                                     *
                                     * 1) tm_pdf_modify_dtl 에 없는 경우에는 'insert'
                                     * 2) tm_pdf_modify_dtl 에 존재하고 CU수량과 액면금액이 td_etfpdf_basic 의 값과 다른 경우 'modify'
                                     *                             
                                     */
                                    function(msg, callback) {

                                        try {

                                            arrAllDtl = [];
                                            arrInsertDtl = [];
                                            arrModifyDtl = [];

                                            paramData.dataLists = subList.data;
                                            var stmt = mapper.getStatement('etpOper', 'getTmPdfModifyDtlExistsCheck', paramData, { language: 'sql', indent: '  ' });
                                            logg.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
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

                                                    arrAllDtl = rows;
                                                }

                                                callback(null, paramData);
                                            })

                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 9. PDF 변경 상세 정보 (구성종목) 정보를 저장한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrInsertDtl && arrInsertDtl.length > 0) {

                                                paramData.dataLists = arrInsertDtl;
                                                var stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyDtl', paramData, { language: 'sql', indent: '  ' });
                                                logg.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 10. PDF 변경 상세 정보 (구성종목) 정보를 수정한다. */
                                    function(msg, callback) {

                                        try {

                                            if (arrModifyDtl && arrModifyDtl.length > 0) {
                                                paramData.dataLists = arrModifyDtl;
                                                var stmt = mapper.getStatement('etpOper', 'modifyTmPdfModifyDtl', paramData, { language: 'sql', indent: '  ' });
                                                logg.debug(stmt);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 11. ETP 운용관리 - PDF 긴급반영 - 저장시 마스터 상태정보를 조회한다. */
                                    function(msg, callback) {

                                        try {
                                            var stmt = mapper.getStatement('etpOper', 'getTmPdfModifyMastCheck', paramData, { language: 'sql', indent: '  ' });
                                            logg.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
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
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 12. PDF 변경 마스터 정보를 변경한다. */
                                    function(msg, callback) {

                                        var queryId = "saveTmPdfModifyMast";
                                        try {

                                            if (paramData.mast_status == "insert") {
                                                queryId = "saveTmPdfModifyMast";
                                            } else if (paramData.mast_status == "modify") {
                                                queryId = "modifyTmPdfModifyMast";
                                            }

                                            var stmt = mapper.getStatement('etpOper', queryId, paramData, { language: 'sql', indent: '  ' });
                                            logg.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }


                                                callback(null, paramData);
                                            })
                                        } catch (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    },

                                    /* 13. PDF 변경 이력 마스터 정보를 저장한다. */
                                    function(msg, callback) {

                                        try{
                                            var stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyHistMast', paramData, { language: 'sql', indent: '  ' });
                                            logg.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows) {
                                                    paramData.hist_no = rows.insertId;
                                                }

                                                callback(null, paramData);
                                            })

                                        } catch (err) {

                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            callback(resultMsg);
                                        }
                                    },

                                    /* 14. PDF 변경 이력 상세 정보를 저장한다. */
                                    function(msg, callback) {

                                        try{
                                            paramData.dataLists = arrAllDtl;
                                            stmt = mapper.getStatement('etpOper', 'saveTmPdfModifyHistDtl', paramData, format);
                                            logg.debug(stmt);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                callback(null, paramData);
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
                        logg.error(err);
                        conn.rollback();

                    } else {
                        resultMsg.result = true;
                        resultMsg.msg = "성공적으로 저장하였습니다.";
                        resultMsg.err = null;
// console.log('etpOper.saveEtpOperPdfModify 성공적으로 저장하였습니다.');
                        conn.commit();
                        makePdfModify(fsData);
                    }

                    res.json(resultMsg);
                    res.end();

                });
            });
        });

    } catch (err) {

        logg.error(err);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = err;

        res.json(resultMsg);
        res.end();
    }
}
/*
 * 최근 pdf 수정정보를 파일로 저장하고 문자발송
 * 2019-06-26  ThreeOn
 */
var makePdfModify = function(fsData) {
  var wItem = {
    fld000: util.padNonZero(8),         // 8자리 데이터일련번호 (X)
    fld001: '620',      // 3자리 데이터종류
    fld002: '103',      // 3자리 데이터분류
    fld003: '',         // 8자리 일자
    fld004: '',         // 3자리 사무수탁번호
    fld005: '',         // 12자리 ETF코드
    fld006: '',         // 4자리 구성종목수
    fld007: '',         // 12자리 구성종목코드
    fld008: '',         // 18자리 1CU단위증권수
    fld009: '',         // 1자리 구성종목시장구분(0:유가 1:코스닥 2:기타)
    fld010: util.padNonZero(40),         // 40자리 시장종목명(X)
    fld011: util.padNonZero(18),         // 18자리 액면금액(X)
    fld012: util.padNonZero(8),         // 8자리 이익분배기준일(X)
    fld013: util.padNonZero(18),         // 18자리 평가금액(X)
    fld014: '0',        // 1자리 구분(0:수정, 1:추가, 2:삭제)
    filler: util.padNonZero(43),         // 43자리 (X)
    filler2: os.EOL,       // 1자리 개행문자
  }
  /*
{ F12506: '20190627',
  fmt_F12506: '2019.06.27',
  F16012: 'KR7152100004',
  F16583: '903',
  F16013: '152100',
  F16316: 'KR7000070003',
  F33837: '201',
  F16499: '121211.00',
  fmt_F16499: '11.00',
  F33861: '0',
  F34840: '0',
  fmt_F34840: '0.00',
  F16588: 8896887400,
  F34743: '3',
  fmt_F34743: '0.03',
  F16004: '삼양홀딩스                              ',
  status: 'modify',
  F16499_prev: '11.00',
  F34840_prev: '0',
  code_check: true },
strlen : 202 (window : 202, linux : 201)
*/
  logg.debug("makePdfModify.......................");
  var ifname = config.pdfmodify_nas_path + "pdfmodify." + util.getTodayDate();
  // 삭제되지 않게 한번 더 저장
  var ifname1 = config.pdfmodify_path + "pdfmodify." + util.getTodayDate();
  var msg = "ETP PDF 변경신청 접수되었습니다.";

  try {
    for(var i=0; i<fsData.allDataList.length; i++) {
      var tmp = fsData.allDataList[i];
      for(var j=0; j<tmp.data.length; j++) {
        wItem.fld003 = tmp.data[j].F12506;
        wItem.fld004 = util.padZero(tmp.data[j].F16583, 3);       /* 사무수탁회사번호 3자리가 아닌 경우 0 추가 ( written by bkLove 2019-07-30 ) */
        wItem.fld005 = tmp.data[j].F16012;
        wItem.fld006 = util.padZero(tmp.data[j].F33837, 4);
        wItem.fld007 = tmp.data[j].F16316;
        wItem.fld008 = util.padZero(Number(tmp.data[j].F16499) * 100, 18); // 백엔드에서 나누기 100 해서 씀

    logg.debug1("tmp F16499 : " + tmp.data[j].F16499);
    logg.debug1("wItem fld008 : " + wItem.fld008);

        wItem.fld009 = tmp.data[j].F33861;
        // wItem.fld010 = util.padSpace(tmp.data[j].F16004, 40);
        // 종목명 인코딩 문제로 스페이스 처리 (2019.08.06. 이형준 과장 요청)
        wItem.fld010 = util.padSpace('', 40);
        wItem.fld011 = util.padZero(tmp.data[j].F34840, 18);    /* 액면금액 ( written by bkLove 2019-08-05 ) */
    logg.debug1("tmp F34840 : " + tmp.data[j].F34840);
    logg.debug1("wItem fld011 : " + wItem.fld011);
        wItem.fld013 = util.padZero(tmp.data[j].F16588, 18);    /* 평가금액 ( written by bkLove 2019-08-05 ) */
    logg.debug1("tmp F16588 : " + tmp.data[j].F16588);
    logg.debug1("wItem fld013 : " + wItem.fld013);
            
        if(tmp.data[j].status == 'insert') wItem.fld014 = '1';
        else if(tmp.data[j].status == 'delete') wItem.fld014 = '2';
        else  wItem.fld014 = '0';

        var ostr = wItem.fld000 + wItem.fld001 + wItem.fld002 + wItem.fld003 + 
        wItem.fld004 + wItem.fld005 + wItem.fld006 + wItem.fld007 + wItem.fld008 + 
        wItem.fld009 + wItem.fld010 + wItem.fld011 + wItem.fld012 + wItem.fld013 + 
        wItem.fld014 + wItem.filler + wItem.filler2;

        msg = msg + "[" + tmp.data[j].F16013 + "]";
        logg.debug1("strlen : " + ostr.length);
        fs.appendFileSync(ifname, ostr, 'utf8');
        fs.appendFileSync(ifname1, ostr, 'utf8');
        // fs.writeFileSync(ifname, ostr, {flag: 'a+', encoding:'latin1'});  // latin1 == ISO-8859-1
        logg.debug1("wItem..................");
        logg.debug1(wItem);
      }
    }
    sms.smsSend(0, msg)
  } catch (error) {
    logg.error(err);
  }
}

/*
 * 최근 group_no 에 속한 pdf 수정정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getPdfByGroupNo = function(req, res) {

    try {
        logg.debug('etpOper.getPdfByGroupNo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getPdfByGroupNo  req.body.data no data.");

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

        resultMsg.allDataList = [];
        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. 최근에 저장된 group_no 를 조회한다. */
                function(callback) {

                    try {
                        stmt = mapper.getStatement('etpOper', 'getMaxGroupNo', paramData, format);
                        logg.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (!rows || rows.length != 1) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
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
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

                /* 2. group_no 에 속한 tm_pdf_modify_hist_mast 정보를 조회한다. */
                function(msg, callback) {

                    try {
                        if (paramData.group_no) {
                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistMastByGroupNo', paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
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
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

                /* 3. group_no 에 속한 tm_pdf_modify_hist_dtl 정보를 조회한다. */
                function(msg, callback) {

                    try {
                        if (paramData.group_no) {
                            stmt = mapper.getStatement('etpOper', 'getTmPdfModifyHistDtlByGroupNo', paramData, format);
                            logg.debug(stmt);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {

                                    for (var i in resultMsg.allDataList) {

                                        resultMsg.allDataList[i].etf_F16012 = resultMsg.allDataList[i].F16012; /* ETF 국제표준코드 */
                                        resultMsg.allDataList[i].etf_F16013 = resultMsg.allDataList[i].F16013; /* ETF 단축코드 */
                                        resultMsg.allDataList[i].etf_F16002 = resultMsg.allDataList[i].F16002; /* ETF 한글종목명 */
                                        resultMsg.allDataList[i].etf_F16583 = resultMsg.allDataList[i].F16583; /* ETF 사무수탁회사번호 */

                                        var same = rows.filter(function(o, p) {
                                            return (o.hist_no === resultMsg.allDataList[i].hist_no /* 이력번호 */ &&
                                                o.email === resultMsg.allDataList[i].email /* 이메일 */ &&
                                                o.F16583 === resultMsg.allDataList[i].F16583 /* 사무수탁회사번호 */ &&
                                                o.F16012 === resultMsg.allDataList[i].F16012 /* ETF종목코드 */ &&
                                                o.F16013 === resultMsg.allDataList[i].F16013 /* ETF단축코드 */ &&
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
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                }

            ], function(err) {

                if (err) {
                    logg.error(err);
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

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
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
        logg.debug('etpOper.getPdfExistYnByNow 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getPdfExistYnByNow  req.body.data no data.", req.body.data);

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

        resultMsg.emergency_exist_yn = "N";
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('etpOper', 'getPdfExistYnByNow', paramData, format);
                logg.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        logg.error(err);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if (!rows || rows.length != 1) {
                        resultMsg.result = false;
                        resultMsg.msg = "etpOper.getPdfExistYnByNow 오류가 발생하였습니다.";
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
                logg.error(err);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        res.json(resultMsg);
        res.end();
    }
}

/*
 * tm_pdf_basic 에서 최근 F12506(일자) 정보를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getTmPdfBaiscMaxF12506 = function(req, res) {
    try {
        logg.debug('etpOper.getTmPdfBaiscMaxF12506 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getTmPdfBaiscMaxF12506  req.body.data no data.");

            resultMsg.resultconfig.MSG.error01;

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
                stmt = mapper.getStatement('etpOper', 'getTmPdfBaiscMaxF12506', paramData, format);
                logg.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        logg.error(err);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if (rows && rows.length == 1) {
                        resultMsg.result = true;
                        resultMsg.msg = "";

                        resultMsg.dateInfo = rows[0];
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                logg.error(err);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dateInfo = {};

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 현재일자를 조회한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getNowDate = function(req, res) {
    try {
        logg.debug('etpOper.getNowDate 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getNowDate  req.body.data no data.");

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

            try {
                stmt = mapper.getStatement('etpOper', 'getNowDate', paramData, format);
                logg.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        logg.error(err);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if (rows && rows.length == 1) {
                        resultMsg.result = true;
                        resultMsg.msg = "";

                        resultMsg.dateInfo = rows[0];
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                logg.error(err);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dateInfo = {};

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 현재일자에 pdf basic 데이터가 존재하는지 체크한다.
 * 2019-05-03  bkLove(촤병국)
 */
var getExistsNowPdfBaisc = function(req, res) {
    try {
        logg.debug('etpOper.getExistsNowEtpBasic 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            logg.error("[error] etpOper.getExistsNowEtpBasic  req.body.data no data.");

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

            try {

                stmt = mapper.getStatement('etpOper', 'getExistsNowPdfBaisc', paramData, format);
                logg.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        logg.error(err);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if (rows && rows.length == 1) {
                        resultMsg.result = true;
                        resultMsg.msg = "";

                        resultMsg.exists_now_pdf_yn = rows[0].exists_now_pdf_yn;
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                logg.error(err);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        logg.error(expetion);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.exists_now_etpbasic_yn = "N";

        res.json(resultMsg);
        res.end();
    }
}

/*
*   PDF 샘플파일 다운로드를 수행한다.
*   2019-09-06  bkLove(촤병국)
*/
var getPdfSampleFileDown = function(req, res) {
    logg.debug('etpOper.getPdfSampleFileDown 호출됨.');

    var paramData = {};
    try {

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        var savedFileNm = "pdf_sample.xlsx";
        var file = config.sampleDownFolder + "/" + savedFileNm;

        logg.debug( "#### getPdfSampleFileDown START ###", file, "#### getPdfSampleFileDown SEND ###" );

        res.download( file, savedFileNm, function( err) {
            logg.error(paramData, err);
        });
        
    } catch (err) {
        logg.error(paramData, err);
    }
};

module.exports.getEtpOperInfo = getEtpOperInfo;
module.exports.getEtpOperIndex = getEtpOperIndex;
module.exports.getEtpOperIndexOversea = getEtpOperIndexOversea;
module.exports.getEtpOperIndexError = getEtpOperIndexError;
module.exports.getEtpOperPdf = getEtpOperPdf;
module.exports.getEtpOperPdfByRateTitle = getEtpOperPdfByRateTitle;
module.exports.getEtpOperPdfByRate = getEtpOperPdfByRate;
module.exports.getEtpOperPdfModify = getEtpOperPdfModify;
module.exports.getJongmokData = getJongmokData;
module.exports.getFutureBasic1 = getFutureBasic1;

module.exports.saveEtpOperPdfModify = saveEtpOperPdfModify;
module.exports.getPdfByGroupNo = getPdfByGroupNo;
module.exports.getPdfExistYnByNow = getPdfExistYnByNow;
module.exports.getEtpOperPdfEmergencyHistNow = getEtpOperPdfEmergencyHistNow;
module.exports.getTmPdfBaiscMaxF12506 = getTmPdfBaiscMaxF12506;
module.exports.getNowDate = getNowDate;
module.exports.getExistsNowPdfBaisc = getExistsNowPdfBaisc;
module.exports.getPdfSampleFileDown = getPdfSampleFileDown;