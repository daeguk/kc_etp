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

/* logging 추가함.  2019-06-10 */
var log = config.logger;


/*
 * ETP 의 기본정보를 조회한다.
 * 2019-04-25  bkLove(촤병국)
 */
var getEtpBasic = function(req, res) {
    try {
        log.debug('etpDetail.getEtpBasic 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpDetail.getEtpBasic  req.body.data no data.", req.body.data);

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

                    stmt = mapper.getStatement('etpDetail', 'getEtpBasic', paramData, format);
                    log.debug(stmt, paramData);

                    conn.query(stmt, function(err, rows) {

                        try{
                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length == 1) {
                                resultMsg.etpBasic = rows[0];
                            }

                            callback(null, resultMsg);

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    });
                },

                /* 2. ETP기초지수코드 와 ETP기초지수MID 에 속한 IndexBasic 의 기본정보를 조회한다. */
                function(data, callback) {

                    stmt = mapper.getStatement('etpDetail', 'getIndexBasicByEtpJisuCd', paramData, format);
                    log.debug(stmt, paramData);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows && rows.length == 1) {
                            resultMsg.indexBasic = rows[0];
                        }

                        callback(null);
                    });
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
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.etpBasic = {};
        resultMsg.indexBasic = {};

        res.json(resultMsg);
        res.end();
    }
}

/*
 * ETP performance 정보를 조회한다.
 * 2019-04-25  bkLove(촤병국)
 */
var getEtpPerformance = function(req, res) {
    try {
        log.debug('etpDetail.getEtpPerformance 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] etpDetail.getEtpPerformance  req.body.data no data.", req.body.data);

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

                /* 1. ETP performance 정보를 조회한다. */
                function(callback) {

                    try{
                        stmt = mapper.getStatement('etpDetail', 'getEtpPerformance', paramData, format);

                        // 대입 문자 치환
                        stmt = stmt.replace(/\: =/g, ':=');

                        log.debug(stmt, paramData);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows.length > 0) {
                                resultMsg.etpPerformanceList = rows;
                            }

                            callback(null, paramData);
                        });

                    } catch (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

                /* 2. 자산추가된 ETP 의 ETP performance 정보를 조회한다. */
                function(msg, callback) {

                    try{
                        if (paramData.arrEtpPerformance && paramData.arrEtpPerformance.length > 0) {

                            stmt = mapper.getStatement('etpDetail', 'getEtpPerformanceByEtp', paramData, format);

                            // 대입 문자 치환
                            stmt = stmt.replace(/\: =/g, ':=');

                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    for (var inx in rows) {
                                        resultMsg.etpPerformanceList.push(rows[inx]);
                                    }
                                }

                                callback(null, paramData);
                            });

                        } else {
                            callback(null, paramData);
                        }

                    } catch (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        callback(resultMsg);
                    }
                },

                /* 3. 자산추가된 INDEX 의 ETP performance 정보를 조회한다. */
                function(msg, callback) {

                    try{
                        if (paramData.arrIndexPerformance && paramData.arrIndexPerformance.length > 0) {

                            stmt = mapper.getStatement('etpDetail', 'getEtpPerformanceByIndex', paramData, format);

                            // 대입 문자 치환
                            stmt = stmt.replace(/\: =/g, ':=');

                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows && rows.length > 0) {
                                    for (var inx in rows) {
                                        resultMsg.etpPerformanceList.push(rows[inx]);
                                    }
                                }

                                callback(null);
                            });

                        } else {
                            callback(null);
                        }

                    } catch (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
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
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.etpPerformanceList = [];

        res.json(resultMsg);
        res.end();
    }
}

/* 
 * ETP 비중 정보를 조회한다.
 * 2019-04-25  bkLove(촤병국)
 * 2019-06-19  ThreeOn : 쿼리단순화
 */
var getEtpWeightList = function(req, res) {
  try {
    log.debug('etpDetail.getEtpWeightList 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var paramData = req.query;
    var stmt = mapper.getStatement('etpDetail', 'getEtpWeightList', paramData, { language: 'sql', indent: ' '});
    log.debug(stmt, paramData);

    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt, function(err, rows) {
        res.json({
          success: true,
          results: rows
      });
        res.end();
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
}

/* 
 * ETP MultiFactor 정보를 조회한다.
 * 2019-09-17  ThreeOn
 */
var getEtpMultiFactor = function(req, res) {
  try {
    log.debug('etpDetail.getEtpMultiFactor 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var paramData = req.query;
    var stmt = mapper.getStatement('etpDetail', 'getEtpMultiFactor', paramData, { language: 'sql', indent: ' '});
    log.debug(stmt, paramData);

    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt, function(err, rows) {
        res.json({
          success: true,
          results: rows
      });
        res.end();
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
}

/* 
 * ETP FundFlowRank 정보를 조회한다.
 * 2019-09-17  ThreeOn
 */
var getEtpFundFlowRank = function(req, res) {
  try {
    log.debug('etpDetail.getEtpFundFlowRank 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    // console.log(req.query);
    var paramData = req.query;
    var stmt = mapper.getStatement('etpDetail', 'getEtpFundFlowRank', paramData, { language: 'sql', indent: ' '});
    log.debug(stmt, paramData);

    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt, function(err, rows) {
        res.json({
          success: true,
          results: rows
      });
        res.end();
      });
    });
  } catch (expetion) {
    log.error(expetion, paramData);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
}

module.exports.getEtpBasic = getEtpBasic;
module.exports.getEtpPerformance = getEtpPerformance;
module.exports.getEtpWeightList = getEtpWeightList;
module.exports.getEtpMultiFactor = getEtpMultiFactor;
module.exports.getEtpFundFlowRank = getEtpFundFlowRank;