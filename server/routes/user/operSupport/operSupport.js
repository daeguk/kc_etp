/*
 *  운용 지원
 *
 *  @date 2019-10-11
 *  @author bkLove
 */
var os = require('os');
var fs = require('fs');
var config = require('../../../config/config');
var util = require('../../../util/util');
var Promise = require("bluebird");

var async = require('async');
var _ = require("lodash");

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs');

var log = config.logger;


/*
 * 지수구분코드를 조회한다.
 * 2019-10-11  bkLove(촤병국)
 */
var getIndexCode = function(req, res) {
    try {
        log.debug('operSupport.getIndexCode 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] operSupport.getIndexCode  req.body.data no data.", req.body.data);

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


        resultMsg.dataList      =   [];

        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('operSupport', 'getIndexCode', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
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
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dataList  =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 운용사 코드를 조회한다.
 * 2019-10-11  bkLove(촤병국)
 */
var getOperCode = function(req, res) {
    try {
        log.debug('operSupport.getOperCode 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] operSupport.getOperCode  req.body.data no data.", req.body.data);

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


        resultMsg.dataList      =   [];

        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('operSupport', 'getOperCode', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
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
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dataList  =   [];

        res.json(resultMsg);
        res.end();
    }
}


module.exports.getIndexCode = getIndexCode;
module.exports.getOperCode = getOperCode;
