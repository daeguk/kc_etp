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
 * 등록된 지수정보를 조회한다.
 * 2019-04-11  bkLove(촤병국)
 */
var getRegistedJisuData = function(req, res) {

    var resultMsg = {};
    
    try{
        console.log('indexModify.getRegistedJisuData 호출됨.');

        resultMsg.result = true;
        resultMsg.msg    = "";
        res.json({
                resultMsg: resultMsg
            ,   dataList: []
        });
        res.end();        

    } catch(expetion) {
        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result = false;
            resultMsg.msg    = "[error] indexSelectList.getRegistedJisuData 오류가 발생하였습니다.";
        }

        res.json({
                resultMsg: resultMsg
            ,   dataList : []
        });
        res.end();   
    }
}

/* 
 * 지수 정보를 수정한다.
 * 2019-04-11  bkLove(촤병국)
 */
var modifyJisu = function(req, res) {

    var resultMsg = {};
    
    try{
        console.log('indexModify.modifyJisu 호출됨.');

        resultMsg.result = true;
        resultMsg.msg    = "";
        res.json({
                resultMsg: resultMsg
            ,   dataList: []
        });
        res.end();        

    } catch(expetion) {
        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result = false;
            resultMsg.msg    = "[error] indexModify.modifyJisu 오류가 발생하였습니다.";
        }

        res.json({
                resultMsg: resultMsg
            ,   dataList : []
        });
        res.end();        
    }
}


module.exports.getRegistedJisuData = getRegistedJisuData;
module.exports.modifyJisu = modifyJisu;

