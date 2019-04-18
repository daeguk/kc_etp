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
 * 시장대표 정보를 조회한다. ( ETP 시장정보 -> 시장대표 탭 클릭시 )
 * 2019-04-19  bkLove(촤병국)
 */
var getEtpRepresentList = function(req, res) {
    try {
        console.log('etpinfo.getEtpRepresentList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpinfo.getEtpRepresentList  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpinfo.getEtpRepresentList  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        paramData.user_id       =   req.session.user_id;
        paramData.inst_cd       =   req.session.inst_cd;
        paramData.inst_type_cd  =   req.session.inst_type_cd;
        paramData.large_type    =   req.session.large_type;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. 시장을 대표하는 지수정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('etpinfo', 'getJisuListByEtpRepresent', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpinfo.getJisuListByEtpRepresent Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.representList = rows;
                        }

                        callback( null, paramData );
                    });
                },

                /* 2. 시장을 대표하는 지수의 ETF, ETN 건수를 조회한다. */
                function( data, callback ) { 

                    stmt = mapper.getStatement('etpinfo', 'getJisuListByEtpRepresentCnt', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpinfo.getJisuListByEtpRepresentCnt Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.etpList = rows;

                            console.log( rows );
                        }

                        callback( null );
                    });
                },              

                /* 3. 지수별 ETP 목록을 조회한다. */
                function( data, callback ) { 

                    stmt = mapper.getStatement('etpinfo', 'getEtpListByJisu', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpinfo.getEtpListByJisu Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.etpList = rows;
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
            resultMsg.msg       =   "[error] etpinfo.getEtpRepresentList 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.representList =   [];
        resultMsg.etpList       =   [];
        
        res.json({
            resultMsg
        });
        res.end();  
    }
}




var getEtfKorList = function(req, res) {
    console.log('etpinfo 모듈 안에 있는 getEtpKorList 호출됨.');

    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");

    // var options = {id:'admin'};
    var options = {};
    var stmt = etpStmts.EtpInfo.selectEtfKorList(options);
    console.log(stmt);
    
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
              util.log("sql1" == rows.affectedRows)
              res.json({ success: true, results: rows });
              res.end();
          }).catch(err => {
              util.log("Error while performing Query.", err);
              res.json({ success: false, message: err });
              res.end();
          });
  
     
    });
};

var getEtfForList = function(req, res) {
  console.log('etpinfo 모듈 안에 있는 getEtfForList 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  var options = {};
  var stmt = etpStmts.EtpInfo.selectEtfForList(options);
  console.log(stmt);
  
  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
            util.log("sql1" == rows.affectedRows)
            res.json({ success: true, results: rows });
            res.end();
        }).catch(err => {
            util.log("Error while performing Query.", err);
            res.json({ success: false, message: err });
            res.end();
        });

   
  });
};

var getEtnKorList = function(req, res) {
  console.log('etpinfo 모듈 안에 있는 getEtnKorList 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  var options = {};
  var stmt = etpStmts.EtpInfo.selectEtnKorList(options);
  console.log(stmt);
  
  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
            util.log("sql1" == rows.affectedRows)
            res.json({ success: true, results: rows });
            res.end();
        }).catch(err => {
            util.log("Error while performing Query.", err);
            res.json({ success: false, message: err });
            res.end();
        });

   
  });
};

var getEtnForList = function(req, res) {
  console.log('etpinfo 모듈 안에 있는 getEtnForList 호출됨.');

  var pool = req.app.get("pool");
  var etpStmts = req.app.get("stmt");

  // var options = {id:'admin'};
  var options = {};
  var stmt = etpStmts.EtpInfo.selectEtnForList(options);
  console.log(stmt);
  
  Promise.using(pool.connect(), conn => {
    conn.queryAsync(stmt).then(rows => {
            util.log("sql1" == rows.affectedRows)
            res.json({ success: true, results: rows });
            res.end();
        }).catch(err => {
            util.log("Error while performing Query.", err);
            res.json({ success: false, message: err });
            res.end();
        });

   
  });
};

module.exports.getEtfKorList = getEtfKorList;
module.exports.getEtfForList = getEtfForList;
module.exports.getEtnKorList = getEtnKorList;
module.exports.getEtnForList = getEtnForList;
module.exports.getEtpRepresentList = getEtpRepresentList;