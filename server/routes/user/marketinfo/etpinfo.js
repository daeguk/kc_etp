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

                            /* [시장을 대표하는 마스터 데이터] 와 [ETF, ETN 별 조회 내역] 에 대해 데이터를 합치기 위함. ( 지수코드, middle_type ) */
                            for( var rep in resultMsg.representList ) {
                                var repData     =   resultMsg.representList[ rep ];

                                for( var etp in rows ) {
                                    var etpData =   rows[ etp ];

                                    if(     repData.f16013      == etpData.f16257           /* 단축코드 = ETP기초지수코드 */
                                        &&  repData.middle_type == etpData.middle_type
                                    ) {
                                        repData.grp_etf_cnt     =   etpData.grp_etf_cnt;
                                        repData.grp_etf_sum     =   etpData.grp_etf_sum;

                                        repData.grp_etn_cnt     =   etpData.grp_etn_cnt;
                                        repData.grp_etn_sum     =   etpData.grp_etn_sum;

                                        break;
                                    }
                                }
                            }

                            /* 시장대표 탭에서 지수노출시 4개를 1세트로 노출하기 위함. */
                            var  representGrpList = [];
                            for( var i=0, inx=0; i < resultMsg.representList.length; i=i+4 ) {
                                var data        =   resultMsg.representList[i];
                                var groupData   =   {};

                                groupData.one   =   data;

                                groupData.two = {};
                                if( i+1 < resultMsg.representList.length ) {
                                    data = resultMsg.representList[i+1];
                                    groupData.two   =   data;
                                }

                                groupData.three = {};
                                if( i+2 < resultMsg.representList.length ) {
                                    data = resultMsg.representList[i+2];
                                    groupData.three   =   data;
                                }

                                groupData.four = {};
                                if( i+3 < resultMsg.representList.length ) {
                                    data = resultMsg.representList[i+3];
                                    groupData.four   =   data;
                                }                

                                representGrpList.push( groupData );
                            }

                            resultMsg.representGrpList     =   representGrpList;
                        }

                        callback( null, paramData );
                    });
                },              

                /* 3. 분류코드별 지수정보를 조회한다. */
                function( data, callback ) { 

                    stmt = mapper.getStatement('etpinfo', 'getJisuListByCtgCode', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpinfo.getJisuListByCtgCode Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.ctgJisuList   =   rows;
                        }

                        callback( null, paramData );
                    });
                },

                /* 4. 지수별 ETP 목록을 조회한다. */
                function( data, callback ) { 

                    var dataJson    =   {};
                    var arrDataList =   [];

                    /* ctg_code 별로 ETP 목록 데이터를 조회한다. */
                    async.forEachOf( resultMsg.ctgJisuList, function ( innerData, i, inner_callback ){

                        paramData.ctg_code  =   innerData.ctg_code;
                        stmt = mapper.getStatement('etpinfo', 'getEtpListByJisu', paramData, format);
                        console.log(stmt);

                        conn.query(stmt, function( err, rows ) {

                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] etpinfo.getEtpListByJisu Error while performing Query";
                                resultMsg.err       =   err;

                                return inner_callback( resultMsg );
                            }

                            if( rows ) {
                                dataJson[ innerData.ctg_code ]  =   [];
                                dataJson[ innerData.ctg_code ]  =   rows;           /* ctg_code 별 etp 목록 ( JSON 형태 ) */
                                arrDataList.push( rows );                           /* ctg_code 별 etp 목록 ( 배열 형태 ) */
                            }

                            inner_callback( null );
                        });

                    }, function(err){

                        if(err){
                            return callback( resultMsg );
                        }else{
                            resultMsg.ctgJisuByEtpList      =   arrDataList;        /* ctg_code 별 etp 목록 ( JSON 형태 ) */
                            resultMsg.ctgJisuByEtpJson      =   dataJson;           /* ctg_code 별 etp 목록 ( 배열 형태 ) */

                            return callback( null );
                        }
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

        resultMsg.representList     =   [];
        resultMsg.representList     =   [];

        resultMsg.ctgJisuList       =   [];
        resultMsg.ctgJisuByEtpList  =   [];
        resultMsg.ctgJisuByEtpJson  =   {};
        
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

    res.json({ success: true, results: rows });
    res.end();
/*
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
*/    
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