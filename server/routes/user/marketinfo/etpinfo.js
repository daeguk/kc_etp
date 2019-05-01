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
 * ETP 정보를 조회한다.
 * 2019-04-19  bkLove(촤병국)
 */
var getEtpList = function(req, res) {
    try {
        console.log('etpinfo.getEtpList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] etpinfo.getEtpList  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] etpinfo.getEtpList  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        paramData.user_id       =   req.session.user_id;
        paramData.inst_cd       =   req.session.inst_cd;
        paramData.type_cd       =   req.session.type_cd;
        paramData.large_type    =   req.session.large_type;


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        var carousel_info = {
            carousel_cnt    :   0,
            carousel_mod    :   0,
            carousel_div    :   4
        };

        Promise.using(pool.connect(), conn => {

            /* 1. 시장을 대표하는 메인 코드정보를 조회한다. */
            var etpFunc1    =   function( callback ) {

                paramData.com_mst_cd    =   "COM003";       /* 시장을 대표하는 지수 */
                stmt = mapper.getStatement('etpinfo', 'getIndexInfoByCodeDtl', paramData, format);
                console.log( "etpinfo.getIndexInfoByCodeDtl query call");

                conn.query(stmt, function( err, rows ) {

                    if( err ) {
                        resultMsg.result    =   false;
                        resultMsg.msg       =   "[error] etpinfo.getIndexInfoByCodeDtl Error while performing Query";
                        resultMsg.err       =   err;

                        return callback( resultMsg );
                    }

                    if ( rows ) {
                        carousel_info.carousel_cnt =  Math.floor( rows.length / carousel_info.carousel_div);
                        carousel_info.carousel_mod =  rows.length % carousel_info.carousel_div;

                        resultMsg.codeList          =   rows;
                    }

                    callback( null, paramData );
                });
            };

            /* 2. 시장을 대표하는 코드 (COM003) 에 속한 지수별 데이터를 조회한다. */
            var etpFunc2    =   function( data, callback ) { 

                var carousel_data =   [];
                var carousel_mod = [];

                var total_amt = 0;  /* 전체 금액 */

                var etf_cnt = 0;    /* ETF 건수, 합계 */
                var etf_sum = 0;

                var etn_cnt = 0;    /* ETN 건수, 합계 */
                var etn_sum = 0;

                async.forEachOf( resultMsg.codeList, function ( ctgCodeItem, index, inner_callback ){

                    paramData.com_val01     =   ctgCodeItem.com_val01;
                    paramData.com_val02     =   ctgCodeItem.com_val02;
                    paramData.com_val03     =   ctgCodeItem.com_val03;
                    stmt = mapper.getStatement('etpinfo', 'getJisuListByEtpRepresent', paramData, format);
                    console.log( "etpinfo.getJisuListByEtpRepresent query call");

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpinfo.getJisuListByEtpRepresent Error while performing Query";
                            resultMsg.err       =   err;

                            return inner_callback( resultMsg );
                        }

                        if( rows ) {

                            if ( (carousel_info.carousel_cnt * carousel_info.carousel_div) > index ) {

                                rows.forEach(function(item, idx) {
                                    total_amt += item.f15028;                       /* 시가총액 */

                                    // ctf 구분자가 1과 2일 경우 
                                    if (item.f16493 == '1' || item.f16493 == '2') {
                                        etf_cnt++; 
                                        etf_sum += item.f15028;                     /* ETF_시가총액 누적 */
                                    } else if (item.f16493 == '3' || item.f16493 == '4') {
                                        etn_cnt++; 
                                        etn_sum += item.f15028;                     /* ETN_시가총액 누적 */
                                    }
                                });

                                carousel_data.push({
                                        "name"      :   ctgCodeItem.f16002          /* 한글종목명 */
                                    ,   "total_amt" :   total_amt
                                    ,   "etf_cnt"   :   etf_cnt
                                    ,   "etf_sum"   :   etf_sum

                                    ,   "etf_sum"   :   etf_sum
                                    ,   "etn_sum"   :   etn_sum
                                    ,   "f15001"    :   ctgCodeItem.f15001          /* 현재가 */
                                    ,   "f15472"    :   ctgCodeItem.f15472          /* 대비 */
                                    ,   "f15004"    :   ctgCodeItem.f15004          /* 등락율 */
                                });
                            } else {

                                rows.forEach(function(item, idx) {
                                    total_amt += item.f15028;                       /* 시가총액 */

                                    // ctf 구분자가 1과 2일 경우 
                                    if (item.f16493 == '1' || item.f16493 == '2') {
                                        etf_cnt++; 
                                        etf_sum += item.f15028;                     /* ETF_시가총액 누적 */
                                    } else if (item.f16493 == '3' || item.f16493 == '4') {
                                        etn_cnt++; 
                                        etn_sum += item.f15028;                     /* ETN_시가총액 누적 */
                                    }
                                });

                                carousel_data.push({
                                        "name"      :   ctgCodeItem.f16002          /* 한글종목명 */
                                    ,   "total_amt" :   total_amt
                                    ,   "etf_cnt"   :   etf_cnt
                                    ,   "etf_sum"   :   etf_sum

                                    ,   "etf_sum"   :   etf_sum
                                    ,   "etn_sum"   :   etn_sum
                                    ,   "f15001"    :   ctgCodeItem.f15001          /* 현재가 */
                                    ,   "f15472"    :   ctgCodeItem.f15472          /* 대비 */
                                    ,   "f15004"    :   ctgCodeItem.f15004          /* 등락율 */
                                });
                            }
                        }

                        inner_callback( null );
                    });

                }, function(err){

                    if(err){
                        return callback( resultMsg );
                    }else{
                        resultMsg.carousel_info     =   carousel_info;
                        resultMsg.carousel_mod      =   carousel_mod;
                        resultMsg.carousel_data     =   carousel_data;

                        return callback( null, paramData );;
                    }
                });
            };

            var etpFunc3_1      =   function( callback ) { 

                stmt = mapper.getStatement('etpinfo', 'getJisuListByCtgCode', paramData, format);
                console.log( "etpinfo.getJisuListByCtgCode query call");

                conn.query(stmt, function( err, rows ) {

                    if( err ) {
                        resultMsg.result    =   false;
                        resultMsg.msg       =   "[error] etpinfo.getJisuListByCtgCode Error while performing Query";
                        resultMsg.err       =   err;

                        return callback( resultMsg );
                    }

                    if ( rows ) {
                        resultMsg.ctgCodeList   =   rows;
                    }

                    callback( null, paramData );
                });
            };

            /* 3. 분류코드별 지수정보를 조회한다. */
            var etpFunc3    =   function( data, callback ) { 

                stmt = mapper.getStatement('etpinfo', 'getJisuListByCtgCode', paramData, format);
                console.log( "etpinfo.getJisuListByCtgCode query call");

                conn.query(stmt, function( err, rows ) {

                    if( err ) {
                        resultMsg.result    =   false;
                        resultMsg.msg       =   "[error] etpinfo.getJisuListByCtgCode Error while performing Query";
                        resultMsg.err       =   err;

                        return callback( resultMsg );
                    }

                    if ( rows ) {
                        resultMsg.ctgCodeList   =   rows;
                    }

                    callback( null, paramData );
                });
            };

            /* 4. 지수별 ETP 목록을 조회한다. */
            var etpFunc4    =   function( data, callback ) { 

                var etpLists    =   [];

                /* ctg_code 별로 ETP 목록 데이터를 조회한다. */
                async.forEachOf( resultMsg.ctgCodeList, function ( innerData, i, inner_callback ){

                    paramData.ctg_code  =   innerData.ctg_code;
                    stmt = mapper.getStatement('etpinfo', 'getEtpListByJisu', paramData, format);
                    console.log( "etpinfo.getEtpListByJisu query call");

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpinfo.getEtpListByJisu Error while performing Query";
                            resultMsg.err       =   err;

                            return inner_callback( resultMsg );
                        }

                        if( rows ) {
                            etpLists.push( rows );
                        }

                        inner_callback( null );
                    });

                }, function(err){

                    if(err){
                        return callback( resultMsg );
                    }else{
                        resultMsg.etpLists          =   etpLists;

                        return callback( null );
                    }
                });
            };            

            /* 4. 지수별 ETP 목록을 조회한다. */
            var etpFunc4_1   =   function( data, callback ) { 

                var etpLists        =   [];
                var carousel_data   =   [];
                var carousel_mod    =   [];

                carousel_info.carousel_cnt =  Math.floor(resultMsg.ctgCodeList.length / carousel_info.carousel_div);
                carousel_info.carousel_mod =  resultMsg.ctgCodeList.length % carousel_info.carousel_div;

                /* ctg_code 별로 ETP 목록 데이터를 조회한다. */
                async.forEachOf( resultMsg.ctgCodeList, function ( ctgCodeItem, index, inner_callback ){

                    paramData.ctg_code  =   ctgCodeItem.ctg_code;
                    stmt = mapper.getStatement('etpinfo', 'getEtpListByJisu', paramData, format);
                    console.log( "etpinfo.getEtpListByJisu query call");

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] etpinfo.getEtpListByJisu Error while performing Query";
                            resultMsg.err       =   err;

                            return inner_callback( resultMsg );
                        }

                        if( rows ) {
                            /* ===================상단 데이터 생성 =========================*/
                            var total_amt = 0;
                            var etf_cnt = 0;
                            var etn_cnt = 0;
                            

                            //util.log("(carousel_info.carousel_cnt * 5):" , (carousel_info.carousel_cnt * 5));
                            //util.log("index" , index);


                            if ((carousel_info.carousel_cnt * 5) > index) {
                                //util.log("data:=====================", index);

                                async.forEachOf( rows, function ( item, idx){ 
                                    total_amt += item.f15028;
                                    // ctf 구분자가 1과 2일 경우 
                                    if (item.f16493 == '1' || item.f16493 == '2') {
                                        etf_cnt++; 
                                    } else if (item.f16493 == '3' || item.f16493 == '4') {
                                        etn_cnt++; 
                                    }
                                });

                                carousel_data.push({"ctg_code":ctgCodeItem.ctg_code, "name":ctgCodeItem.ctg_name, "total_amt":total_amt, "etf_cnt": etf_cnt, "etn_cnt": etn_cnt});
                            } else {
                                //util.log("mode:=====================", index);
                                async.forEachOf( rows, function ( item, idx){
                                    total_amt += item.f15028;
                                    // ctf 구분자가 1과 2일 경우 
                                    if (item.f16493 == '1' || item.f16493 == '2') {
                                        etf_cnt++; 
                                    } else if (item.f16493 == '3' || item.f16493 == '4') {
                                        etn_cnt++; 
                                    }
                                });
                                carousel_mod.push({"ctg_code":ctgCodeItem.ctg_code, "name":ctgCodeItem.ctg_name, "total_amt":total_amt, "etf_cnt": etf_cnt, "etn_cnt": etn_cnt});
                            }  
                            /* ===================상단 데이터 생성 완료 =========================*/

                            etpLists.push( rows );
                        }

                        inner_callback( null );
                    });

                }, function(err){

                    if(err){
                        return callback( resultMsg );
                    }else{
                        resultMsg.etpLists          =   etpLists;

                        resultMsg.carousel_info     =   carousel_info;
                        resultMsg.carousel_data     =   carousel_data;
                        resultMsg.carousel_mod      =   carousel_mod;

                        return callback( null );
                    }
                });
            };

console.log("##############################################################");
console.log("##############################################################" + paramData.ctg_large_code );            


            var funcList =   [];

            /* 001-시장대표 인 경우 - 메인화면 상단의 데이터 조회를 위해 4개 함수를 호출하게 한다. */
            if( paramData.ctg_large_code    ==  "001" ) {
                funcList.push( etpFunc1 );
                funcList.push( etpFunc2 );
                funcList.push( etpFunc3 );
                funcList.push( etpFunc4 );
            }
            else if( 
                    paramData.ctg_large_code    ==  "002"       /* 섹터 */
                ||  paramData.ctg_large_code    ==  "004"       /* 테마 */
            ) {
                funcList.push( etpFunc3_1 );
                funcList.push( etpFunc4_1 );
            }
            /* 그외 인경우 - 테이블 정보 조회를 위해 2개 함수만 호출하게 한다. */
            else{
                funcList.push( etpFunc3_1 );
                funcList.push( etpFunc4 );
            }


            async.waterfall( funcList, function (err) {

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
            resultMsg.msg       =   "[error] etpinfo.getEtpList 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.etpLists          =   [];
        resultMsg.carousel_info     =   {};
        resultMsg.carousel_data     =   [],
        resultMsg.carousel_mod      =   [];
        resultMsg.ctgCodeList       =   [];

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
    //console.log(stmt);

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
  //console.log(stmt);
  
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
  //console.log(stmt);
  
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
  //console.log(stmt);
  
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
module.exports.getEtpList = getEtpList;