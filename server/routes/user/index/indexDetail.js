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
 * 지수종목상세 정보를 조회한다. ( 지수관리 -> 지수종목상세 탭 클릭시 )
 * 2019-04-16  bkLove(촤병국)
 */
var getIndexJongmokList = function(req, res) {
    try {
        log.debug('indexDetail.getIndexJongmokList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] indexDetail.getIndexJongmokList  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] indexDetail.getIndexJongmokList  req.body.data no data.";

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = req.session.user_id;
        paramData.inst_cd = req.session.inst_cd;
        paramData.type_cd = req.session.type_cd;
        paramData.large_type = req.session.large_type;
        paramData.krx_cd = req.session.krx_cd;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {

            try {
                paramData.m168uidxmap_gubun = "FNGUIDE";
                stmt = mapper.getStatement('indexDetail', 'getIndexJongmokList', paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        resultMsg.result = false;
                        resultMsg.msg = "[error] indexDetail.getIndexJongmokList Error while performing Query";
                        resultMsg.err = err;
                    }

                    if (rows) {
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
                resultMsg.msg = "[error] etpDetail.getIndexJongmokList Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] indexDetail.getIndexJongmokList 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];
        res.json(resultMsg);
        res.end();
    }
}

/* 
 *************************************************************************************
 *************************************************************************************
 */

/* 
 * 지수 상세 목록 정보를 조회한다. ( 지수관리 -> 지수종목상세 탭 -> quick menu 지수목록 에서 행선택시 )
 * 2019-04-16  bkLove(촤병국)
 */
var getIndexDetailList = function(req, res) {
    try {
        log.debug('indexDetail.getIndexDetailList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] indexDetail.getIndexDetailList  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] indexDetail.getIndexDetailList  req.body.data no data.";

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = req.session.user_id;
        paramData.inst_cd = req.session.inst_cd;
        paramData.type_cd = req.session.type_cd;
        paramData.large_type = req.session.large_type;
        paramData.krx_cd = req.session.krx_cd;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. 선택된 지수의 마스터 정보를 조회한다. */
                function(callback) {

                    stmt = mapper.getStatement('indexDetail', 'getIndexBasicDetail', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] indexDetail.getIndexBasicDetail Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows && rows[0]) {
                            resultMsg.indexBasic = rows[0];
                        }

                        callback(null, paramData);
                    });
                },

                /* 2. 선택된 지수의 상세 목록을 조회한다. */
                function(data, callback) {

                    paramData.m168uidxmap_gubun = "FNGUIDE";
                    stmt = mapper.getStatement('indexDetail', 'getIndexDetailList', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] indexDetail.getIndexDetailList Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows) {
                            resultMsg.indexDetailList = rows;
                        }

                        callback(null);
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
        resultMsg.msg = "[error] indexDetail.getIndexDetailList 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.indexBasic = {};
        resultMsg.indexDetailList = [];

        res.json(resultMsg);
        res.end();
    }
}

/* 
 *************************************************************************************
 *************************************************************************************
 */

/* 
 * 지수 조치현황 정보를 조회한다. ( 지수관리 -> 지수종목상세 탭 -> 내역확인 버튼 클릭시 )
 * 2019-04-16  bkLove(촤병국)
 */
var getIndexFixList = function(req, res) {
    try {
        log.debug('indexDetail.getIndexFixList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] indexDetail.getIndexFixList  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] indexDetail.getIndexFixList  req.body.data no data.";

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = req.session.user_id;
        paramData.inst_cd = req.session.inst_cd;
        paramData.type_cd = req.session.type_cd;
        paramData.large_type = req.session.large_type;
        paramData.krx_cd = req.session.krx_cd;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. 지수조치 현황의 기본정보를 조회한다. */
                function(callback) {

                    stmt = mapper.getStatement('indexDetail', 'getIndexFixData', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] indexDetail.getIndexFixData Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows && rows[0]) {
                            resultMsg.indexFixData = rows[0];
                        }

                        callback(null, paramData);
                    });
                },

                /* 2. 지수조치 종목 편출입 정보를 조회한다. */
                function(data, callback) {

                    stmt = mapper.getStatement('indexDetail', 'getIndexFixJongmokInoutList', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] indexDetail.getIndexFixJongmokInoutList Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows) {
                            resultMsg.indexFixJongmokInoutList = rows;
                        }

                        callback(null, paramData);
                    });
                },

                /* 3. 지수채용 주식수 변경 정보를 조회한다. */
                function(data, callback) {

                    stmt = mapper.getStatement('indexDetail', 'getIndexFixModifyList', paramData, format);
                    log.debug(stmt);

                    conn.query(stmt, function(err, rows) {

                        if (err) {
                            resultMsg.result = false;
                            resultMsg.msg = "[error] indexDetail.getIndexFixModifyList Error while performing Query";
                            resultMsg.err = err;

                            return callback(resultMsg);
                        }

                        if (rows) {
                            resultMsg.indexFixModifyList = rows;
                        }

                        callback(null);
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
        resultMsg.msg = "[error] indexDetail.getIndexFixList 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.indexFixData = {};
        resultMsg.indexFixJongmokInoutList = [];
        resultMsg.indexFixModifyList = [];

        res.json(resultMsg);
        res.end();
    }
}

/* 
 *************************************************************************************
 *************************************************************************************
 */

/* 
 * 지수정보를 조회한다. ( 지수관리 -> 지수종목상세 ->  quick 메뉴 -> 검색영역 )
 * 2019-04-16  bkLove(촤병국)
 */
var getIndexList = function(req, res) {

    try {
        log.debug('indexDetail.getIndexList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] indexDetail.getIndexList  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] indexDetail.getIndexList  req.body.data no data.";

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = req.session.user_id;
        paramData.inst_cd = req.session.inst_cd;
        paramData.type_cd = req.session.type_cd;
        paramData.large_type = req.session.large_type;
        paramData.krx_cd = req.session.krx_cd;


        var format = { language: 'sql', indent: '' };
        var stmt = "";


        resultMsg.dataList = [];
        Promise.using(pool.connect(), conn => {

            try {
                paramData.m168uidxmap_gubun = "FNGUIDE";
                stmt = mapper.getStatement('indexDetail', 'getIndexList', paramData, format);
                log.debug(stmt);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        resultMsg.result = false;
                        resultMsg.msg = "[error] indexDetail.getIndexList Error while performing Query";
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }

                    if (rows) {
                        resultMsg.result = false;
                        resultMsg.msg = "";
                        resultMsg.dataList = rows;
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] etpDetail.getIndexList Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] indexDetail.getIndexList 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList = [];
        res.json(resultMsg);
        res.end();
    }
}


module.exports.getIndexJongmokList = getIndexJongmokList;
module.exports.getIndexList = getIndexList;
module.exports.getIndexDetailList = getIndexDetailList;
module.exports.getIndexFixList = getIndexFixList;