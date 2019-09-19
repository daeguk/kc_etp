/*
 *  시뮬레이션 관련 정보
 *
 *  @date 2019-07-26
 *  @author bkLove
 */
var os = require('os');
var fs = require('fs');
var config = require('../../../config/config');
var util = require('../../../util/util');
var Promise = require("bluebird");


// var multer = require('multer');
// var xlsx = require('xlsx');
var async = require('async');

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs');

var log = config.logger;


var INIT_START_YEAR     =   { value : 2000, text : "2000" };    /* 시작년도 최초값 */
var SEARCH_SCEN_NAME    =   "unnamed";                          /* 시나리오명 prefix */
var initGrpInfo         =   {
        INIT_GRP_CD         :   "*"                             /* 그룹코드 최초값 */
    ,   INIT_INCRE_GRP_CD   :   100000                          /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
};


/*
 * 화면에서 select 된 리밸런싱 일자를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getRebalanceDate = function(req, res) {
    try {
        log.debug('simulation.getRebalanceDate 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getRebalanceDate  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getRebalanceDate  req.body.data no data.";

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

            /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
            var queryId     =   "getRebalanceDate";

            try {

                if( paramData.rebalance_cycle_cd == "" ) {

                    queryId     =   "getRebalanceDateUploadByScenCd";

                    if( !paramData.grp_cd || !paramData.scen_cd )  {
                        throw   "grp_cd 또는 scen_cd 가 존재하지 않습니다.";
                    }
                }

                stmt = mapper.getStatement('simulation2', queryId, paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    resultMsg.result = true;
                    resultMsg.msg = "";                    

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation2." + queryId +" Error while performing Query";
                        resultMsg.err = err;
                    }
                    else if (rows && rows.length > 0) {
                        for( var i=0 ; i < rows.length; i++ ) {
                            resultMsg.dataList.push( { "text" : rows[i].fmt_F12506, "value" : rows[i].F12506 } );
                        }
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] simulation2." + queryId + " Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation2." + queryId + " 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList  =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 목록정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulList2 = function(req, res) {
    try {
        log.debug('simulation.getSimulList2 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getSimulList2  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation.getSimulList2  req.body.data no data.";

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
                stmt = mapper.getStatement('simulation2', 'getSimulList2', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation2.getSimulList2 Error while performing Query";
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
                resultMsg.msg = "[error] simulation2.getSimulList2 Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation.getSimulList2 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.dataList      =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 포트폴리오 정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulPortfolio2 = function(req, res) {
    try {
        log.debug('simulation2.getSimulPortfolio2 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation2.getSimulPortfolio2  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] simulation2.getSimulPortfolio2  req.body.data no data.";

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
     
        
        /* 리밸런싱일별 포트폴리오 */
        var rebalancePortfolioObj       =   {};
        resultMsg.rebalancePortfolioObj =   {};

        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation2', 'getSimulPortfolio2', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = "[error] simulation2.getSimulPortfolio2 Error while performing Query";
                        resultMsg.err = err;
                    }
                    
                    if( !err ) {
                        resultMsg.result = true;
                        resultMsg.msg = "";

                        if ( rows && rows.length > 0 ) {
                            resultMsg.result = true;

                            var v_order_no  =   0;
                            for( var i=0; i < rows.length; i++ ) {
                                if( !rebalancePortfolioObj[ rows[i].rebalance_date ] || Object.keys( rebalancePortfolioObj[ rows[i].rebalance_date ] ).length == 0  ) {
                                    rebalancePortfolioObj[ rows[i].rebalance_date ]     =   {};
                                    v_order_no  =   0;
                                }

                                if( !rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ] || Object.keys( rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ] ).length == 0  ) {
                                    rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ]         =   {};
                                }

                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].F16013      =   rows[i].F16013;         /* 단축코드 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].F16002      =   rows[i].F16002;         /* 종목명 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].F15028      =   rows[i].F15028;         /* 시가총액 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].importance  =   rows[i].importance;     /* 비중 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].order_no    =   v_order_no;             /* 정렬순번 */
                                rebalancePortfolioObj[ rows[i].rebalance_date ][ rows[i].F16013 ].trIndex     =   v_order_no;             /* 테이블 레코드 순번 */

                                v_order_no++;
                            }
                        }

                        resultMsg.rebalancePortfolioObj   =   rebalancePortfolioObj;
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = "[error] simulation2.getSimulPortfolio2 Error while performing Query";
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = "[error] simulation2.getSimulPortfolio2 오류가 발생하였습니다.";
        resultMsg.err = expetion;

        resultMsg.rebalancePortfolioObj  =   [];

        res.json(resultMsg);
        res.end();
    }
}



module.exports.getRebalanceDate = getRebalanceDate;
module.exports.getSimulList2 = getSimulList2;
module.exports.getSimulPortfolio2 = getSimulPortfolio2;