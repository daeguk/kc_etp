/*
 *  시뮬레이션 관련 정보
 *
 *  @date 2019-08-08
 *  @author pjk
 */
var os = require('os');
var fs = require('fs');
var config = require('../../../config/config');
var util = require('../../../util/util');
var Promise = require("bluebird");
var async = require('async');
var log = config.logger;



/*
 * 시뮬레이션 처리 
 */
var simulation_cal = function(req, res) {
    try {
        log.debug('simulation.simulation_cal 호출');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        var params = {
            start_date : '20180101',
            rebalance_cycle : '2',
            rebalance_date_cd : '1',
            portfolio : [
                {code : 'KR7091220004',
                rate : 33.34
                }, 
                {code : 'KR7091160002',
                rate : 33.33
                }, 
                {code : 'KR7099140006',
                rate : 33.33
                }, 
            ],
            rebalance_gubun: ''
        }

        // 리밸런싱 주기 처
        params = rebalance_cycle(params);

        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return log.error(txerr);
                }

                async.waterfall([

                    /*리밸런싱 날짜를 로드 한다.*/
                    function(callback) {

                        try{

                            log.debug('리밸런싱 주기 로딩');

                            stmt = mapper.getStatement('simulation_test', 'getRebalencingDate', params, format);
                            log.debug(stmt, params);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulation.getRebalencingDate Error while performing Query";
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                } else {


                                    callback(null, rows);
                                }
                            });
                            
                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation.getRebalencingDate Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 2. 종목 정보를 Road 한다. */
                    function(rebalancing_date, callback) {

                        try{
                            log.debug('종목 정보를 Road');

                            stmt = mapper.getStatement('simulation_test', 'getitemhisotry', params, format);
                            log.debug(stmt, params);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulation.getitemhisotry Error while performing Query";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                } else {

                                    var item_historys = rows;

                                    item_historys.forEach(item_history => {
                                        // 리밸런싱 날짜의 구분자 1로 세팅 
                                        console.log(item_history.F12506)
                                    });

                                    callback(null);
                                }
                            });
                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = "[error] simulation.getitemhisotry Error while performing Query";
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                ], function(err) {

                    if (err) {
                        log.error(err, stmt, params);
                        conn.rollback();

                    } else {
                        resultMsg.result        =   true;
                        resultMsg.err           =   null;

                        conn.commit();
                    }

                    res.json(resultMsg);
                    res.end();

                });
            });
        });

    } catch (expetion) {

        console.log(expetion);
        resultMsg.result = false;
        resultMsg.err = expetion;        
        res.json(resultMsg);
        res.end();
    }
}

/* 리밸런싱 주기 처리 */
var rebalance_cycle = function(params) {
    // 년 - 첫영업일 
    if (params.rebalance_cycle == '1' && params.rebalance_date_cd == '1') {
        params.rebalance_gubun = '15'
    // 년 - 옵션만기일
    } else if (params.rebalance_cycle == '1' && params.rebalance_date_cd == '4') {
        params.rebalance_gubun = '42'
    // 년 - 옵션만기 익주 첫영업일
    } else if (params.rebalance_cycle == '1' && params.rebalance_date_cd == '5') {
        params.rebalance_gubun = '42'
    // 반기 - 첫영업일 
    } else if (params.rebalance_cycle == '2' && params.rebalance_date_cd == '1') {
        params.rebalance_gubun = '42'
    // 반기 - 동시만기일
    } else if (params.rebalance_cycle == '2' && params.rebalance_date_cd == '2') {
        params.rebalance_gubun = '42'
    // 반기 - 동시만기 익주 첫영업일
    } else if (params.rebalance_cycle == '2' && params.rebalance_date_cd == '3') {
        params.rebalance_gubun = '42'
    // 반기 - 옵션만기일
    } else if (params.rebalance_cycle == '2' && params.rebalance_date_cd == '4') {
        params.rebalance_gubun = '42'
    // 반기 - 옵션만기 익주 첫영업일
    } else if (params.rebalance_cycle == '2' && params.rebalance_date_cd == '5') {
        params.rebalance_gubun = '42'
    // 분기 - 첫영업일 
    } else if (params.rebalance_cycle == '3' && params.rebalance_date_cd == '1') {
        params.rebalance_gubun = '42'
    // 분기 - 동시만기일
    } else if (params.rebalance_cycle == '3' && params.rebalance_date_cd == '2') {
        params.rebalance_gubun = '42'
    // 분기 - 동시만기 익주 첫영업일
    } else if (params.rebalance_cycle == '3' && params.rebalance_date_cd == '3') {
        params.rebalance_gubun = '42'
    // 분기 - 옵션만기일
    } else if (params.rebalance_cycle == '3' && params.rebalance_date_cd == '4') {
        params.rebalance_gubun = '42'
    // 분기 - 옵션만기 익주 첫영업일
    } else if (params.rebalance_cycle == '3' && params.rebalance_date_cd == '5') {
        params.rebalance_gubun = '42'
    
    // 매월 -첫영업일
    } else if (params.rebalance_cycle == '4' && params.rebalance_date_cd == '1') {
    // 매월 - 옵션만기일
    } else if (params.rebalance_cycle == '4' && params.rebalance_date_cd == '4') {
    // 매월 - 옵션만기 익주 첫영업일
    } else if (params.rebalance_cycle == '4' && params.rebalance_date_cd == '5') {
    // 매주 - 첫영업일
    } else if (params.rebalance_cycle == '5' && params.rebalance_date_cd == '1') {
        params.rebalance_gubun = '14'
    } 

    return params;
}



module.exports.simulation_cal = simulation_cal;
