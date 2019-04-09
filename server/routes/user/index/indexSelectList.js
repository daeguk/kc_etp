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


/* 
 * 기관정보를 조회한다.
 * 2019-04-10  bkLove(촤병국)
 */
var getStatusList = function(req, res) {
    try {
        console.log('indexSelectList.getStatusList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            console.log("[error] indexSelectList.getStatusList  req.body.data no data.");
            console.log(req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "[error] indexSelectList.getStatusList  req.body.data no data.";
            
            throw resultMsg;
        }

        var paramData = JSON.parse( JSON.stringify(req.body.data) );

        /* 2. 상태정보를 조회한다. */
        var format = { language: 'sql', indent: '' };
        var stmt = mapper.getStatement('indexSelectList', 'getCodeDtl', paramData, format);
        console.log(stmt);

        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {

                resultMsg.result = true;
                resultMsg.msg    = "";
                res.json({
                    resultMsg: resultMsg,
                    dataList: []
                });
                res.end();

            }).catch(err => {
                console.log("[error] indexSelectList.getStatusList Error while performing Query.", err);

                resultMsg.result = false;
                resultMsg.msg    = "[error] indexSelectList.getStatusList Error while performing Query";
                
                throw resultMsg;
            });
        });

    } catch(expetion) {
        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result = false;
            resultMsg.msg    = "[error] indexSelectList.getStatusList 오류가 발생하였습니다.";
        }

        res.json({
            resultMsg: resultMsg,
            dataList: []
        });
        res.end();        
    }
}

/* 
*************************************************************************************
*************************************************************************************
*/

/* 
 * 기관정보를 조회한다.
 * 2019-04-10  bkLove(촤병국)
 */
var getIndexSelectList = function(req, res) {
    console.log('indexSelectList.getIndexSelectList 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var result = false;

    var paramData = {};

    /* 1. 기관정보를 조회한다. */
    var format = { language: 'sql', indent: '' };
    var stmt = mapper.getStatement('indexSelectList', 'getJisuMast', paramData, format);
    console.log(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {

            if ( rows ) {

                var     dataList = [];
                for( var i=0, inx=0; i < rows.length; i=i+3 ) {
                    var data    =   rows[i];
                    var groupData = {};

                    groupData.one = data;
                    console.log( "i=[" + i + "]=" + JSON.stringify(data) );                    

                    groupData.two = {};
                    if( i+1 < rows.length ) {
                        data = rows[i+1];
                        groupData.two = data;
                        console.log( "i+1=[" + (i+1) + "]=" + JSON.stringify(data) );
                    }

                    groupData.three = {};
                    if( i+2 < rows.length ) {
                        data = rows[i+2];
                        groupData.three = data;
                        console.log( "i+2=[" + (i+2) + "]=" + JSON.stringify(data) );
                    }

                    dataList[inx++] = groupData;
                }

                res.json({
                      dataGroupList: dataList
                    , dataList : rows
                });
                res.end();
            }

        }).catch(err => {
            console.log("[error] indexSelectList.getIndexSelectList Error while performing Query.", err);
            res.json({
                dataList: []
            });
            res.end();
        });
    });
}


module.exports.getStatusList = getStatusList;
module.exports.getIndexSelectList = getIndexSelectList;

