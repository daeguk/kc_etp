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

/* logging 추가함.  2019-06-10 */
var log = config.logger;

/* 
 * 지수등록 상태정보를 조회한다.
 * 2019-04-10  bkLove(촤병국)
 */
var getStatusList = function(req, res) {
    try {
        log.debug('indexSelectList.getStatusList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] indexSelectList.getStatusList  req.body.data no data.", req.body.data);

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

        if (req.session.type_cd == '9998' || req.session.type_cd == '9999') paramData.large_type = "FNGUIDE";

        /* 2. 지수 등록 상태정보를 조회한다. */
        var format = { language: 'sql', indent: '' };
        var stmt = mapper.getStatement('indexSelectList', 'getCodeDtl', paramData, format);
        log.debug(stmt, paramData);

        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {

                var arrList = [];
                if (rows) {

                    for (var i = 0; i < rows.length; i++) {
                        var data = rows[i];

                        arrList.push(data.com_dtl_name);
                    }
                }

                resultMsg.result = true;
                resultMsg.msg = "";
                resultMsg.arrList = arrList;
                resultMsg.dataList = rows;

                res.json(resultMsg);
                res.end();

            }).catch(err => {
                log.error("[error] indexSelectList.getStatusList Error while performing Query.", err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;

                res.json(resultMsg);
                res.end();
            });
        });

    } catch (expetion) {
        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;

        res.json(resultMsg);
        res.end();
    }
}

/* 
 *************************************************************************************
 *************************************************************************************
 */

/* 
 * 등록된 지수정보를 조회한다.
 * 2019-04-10  bkLove(촤병국)
 */
var getIndexSelectList = function(req, res) {

    try {
        log.debug('indexSelectList.getIndexSelectList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};


        var paramData = {};
        if (req.body.data) {
            JSON.parse(JSON.stringify(req.body.data));
        }

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );

        if (req.session.type_cd == '9998' || req.session.type_cd == '9999') paramData.large_type = "FNGUIDE";
        
        /* 1. 기관정보를 조회한다. */
        var format = { language: 'sql', indent: '' };
        var stmt = mapper.getStatement('indexSelectList', 'getJisuList', paramData, format);
        log.debug(stmt, paramData);

        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {

                if (rows) {

                    for (var i = 0; i < rows.length; i++) {
                        var data = rows[i];
                        var status_pos = parseInt(data.status_position);

                        data.arr_status_position = [];
                        data.arr_status_position.push(0);
                        data.arr_status_position.push(status_pos);
                    }

                    resultMsg.result = true;
                    resultMsg.msg = "";
                    resultMsg.dataList = rows;
                }

                res.json(resultMsg);
                res.end();

            }).catch(err => {
                log.error("[error] indexSelectList.getIndexSelectList Error while performing Query.", err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;

                res.json(resultMsg);
                res.end();
            });
        });

    } catch (expetion) {
        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;

        res.json(resultMsg);
        res.end();
    }
}


module.exports.getStatusList = getStatusList;
module.exports.getIndexSelectList = getIndexSelectList;