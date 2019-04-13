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
 * 지수종목상세 정보를 조회한다. ( 지수관리 -> 지수종목상세 탭 클릭시 )
 * 2019-04-16  bkLove(촤병국)
 */
var getJisuJongmokList = function(req, res) {
    try {
        console.log('indexDetail.getJisuJongmokList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] indexDetail.getJisuJongmokList  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] indexDetail.getJisuJongmokList  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. 지수종목상세 정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('indexDetail', 'getJisuJongmokList', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] indexDetail.getJisuJongmokList Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.dataList = rows;
                        }

                        callback( null, paramData );
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
            resultMsg.msg       =   "[error] indexDetail.getJisuJongmokList 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.dataList      =   [];
        res.json({
            resultMsg
        });
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
var getJisuList = function(req, res) {
    
    try {
        console.log('indexDetail.getJisuList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] indexDetail.getJisuList  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] indexDetail.getJisuList  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );


        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {


            async.waterfall([

                /* 1. 지수정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('indexDetail', 'getJisuList', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] indexDetail.getJisuList Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.dataList = rows;
                        }

                        callback( null, paramData );
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
            resultMsg.msg       =   "[error] indexDetail.getJisuList 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        resultMsg.dataList      =   [];
        res.json({
            resultMsg
        });
        res.end();  
    }
}


module.exports.getJisuJongmokList = getJisuJongmokList;
module.exports.getJisuList = getJisuList;

