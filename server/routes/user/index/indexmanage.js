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


var getIndexVueTableTestList = function (req, res) {
    log.debug('indexmanage 모듈 안에 있는 getIndexVueTableTestList 호출됨.');
    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");

    // var options = {id:'admin'};
    log.debug("req.query");
    log.debug(req.query);
    var options = {};
    var stmt = etpStmts.IndexManage.getIndexToastGridTestList(options);
    log.debug(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {

            log.debug("sql1" == rows.affectedRows)
            res.json({
                success: true,
                results: rows,
                count: rows.length
            });
            res.end();
        }).catch(err => {
            log.debug("Error while performing Query.", err);
            res.json({
                success: false,
                message: err
            });
            res.end();
        });


    });
};

/* 
********************************************************************************** **
*************************************************************************************
*/

var getIndexToastGridTestList = function (req, res) {
    log.debug('indexmanage 모듈 안에 있는 getIndexToastGridTestList 호출됨.');

    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");

    // var options = {id:'admin'};
    log.debug("req.query");
    log.debug(req.query);
    var options = {};
    var stmt = etpStmts.IndexManage.getIndexToastGridTestList(options);
    log.debug(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {
            log.debug("sql1" == rows.affectedRows)
            res.json({
                success: true,
                results: rows,
                count: rows.length
            });
            res.end();
        }).catch(err => {
            log.debug("Error while performing Query.", err);
            res.json({
                success: false,
                message: err
            });
            res.end();
        });


    });
};


module.exports.getIndexVueTableTestList = getIndexVueTableTestList;
module.exports.getIndexToastGridTestList = getIndexToastGridTestList;
