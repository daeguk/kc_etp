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
 * 등록된 지수정보를 조회한다.
 * 2019-04-11  bkLove(촤병국)
 */
var getRegistedJisuData = function(req, res) {

    try{
        console.log('indexModify.getRegistedJisuData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        var resultJson = {};


        var paramData = {};
        if ( req.body.data ) {
            paramData   =   req.body.data;
        }

        paramData.user_id = req.session.user_id;

        console.log( req.body.data );

        /* 1. 지수 마스터 정보를 조회한다. */
        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {
            
            var jisuInfo = {};
            var jisuDataList = [];
            var arr_jisu_inst = [];
            var arr_show_inst = [];
            async.waterfall([

                /* 1. 지수 마스터 정보를 조회한다. */
                function( callback ) {

                    stmt = mapper.getStatement('indexModify', 'getJisuMast', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] indexModify.getJisuMast Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows && rows[0] ) {
                            jisuInfo    =   rows[0];
                        }

                        resultJson.resultMsg = resultMsg;
                        resultJson.jisuInfo = jisuInfo;

                        callback( null, jisuInfo );
                    });
                },

                /* 2. 소급지수 목록 정보를 조회한다. */
                function( data, callback ) {                    

                    paramData.file_id   =  data.jisu_file_id; 
                    stmt = mapper.getStatement('indexRegister', 'getTmJisuTempUpload', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] indexModify.getTmJisuTempUpload Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            jisuDataList    =   rows;
                        }

                        resultJson.resultMsg = resultMsg;
                        resultJson.jisuDataList = jisuDataList;

                        callback( null, jisuDataList );
                    });
                },
                /* 3. 등록된 기관 목록 정보를 조회한다. */
                function( data, callback ) {                    

                    stmt = mapper.getStatement('indexModify', 'getJisuShareReq', paramData, format);
                    console.log(stmt);

                    conn.query(stmt, function( err, rows ) {

                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] indexModify.getJisuShareReq Error while performing Query";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {

                            var  dataList = [];
                            for( var i=0, inx=0; i < rows.length; i=i+4 ) {
                                var data        =   rows[i];
                                var groupData   =   {};

                                arr_jisu_inst.push( data.inst_cd );
                                groupData.one   =   {};
                                groupData.one.inst_cd       =   data.inst_cd;
                                groupData.one.inst_name     =   data.inst_name;

                                groupData.two = {};
                                if( i+1 < rows.length ) {
                                    data = rows[i+1];
                                    arr_jisu_inst.push( data.inst_cd );
                                    groupData.two.inst_cd       =   data.inst_cd;
                                    groupData.two.inst_name     =   data.inst_name;
                                }

                                groupData.three = {};
                                if( i+2 < rows.length ) {
                                    data = rows[i+2];
                                    arr_jisu_inst.push( data.inst_cd );
                                    groupData.three.inst_cd     =   data.inst_cd;
                                    groupData.three.inst_name   =   data.inst_name;
                                }

                                groupData.four = {};
                                if( i+3 < rows.length ) {
                                    data = rows[i+3];
                                    arr_jisu_inst.push( data.inst_cd );
                                    groupData.four.inst_cd      =   data.inst_cd;
                                    groupData.four.inst_name    =   data.inst_name;
                                }                

                                dataList[inx++] = groupData;
                            }

                            arr_show_inst = dataList;
                        }

                        resultJson.resultMsg = resultMsg;
                        resultJson.arr_show_inst = arr_show_inst;
                        resultJson.arr_jisu_inst = arr_jisu_inst;

                        callback( null );
                    });
                }                    
            ], function (err) {

                console.log( err );

                res.json( resultJson );
                res.end();                
            });
        });

        // if( response.data.jisuData ) {
        //     selfThis.modForm = response.data.jisuData;
        //     selfThis.modForm.duplCheckResult  =   true;
        // }

        // if( response.data.arr_jisu_inst ) {
        //     selfThis.modForm.arr_jisu_inst  =   response.data.arr_jisu_inst;        /* 선택된 기관 정보 */
        // }

        // if( response.data.arr_show_inst ) {
        //     selfThis.arr_show_inst              =   response.data.arr_show_inst;    /* (사용자가 선택) 4개를 1개로 그룹핑한 기관정보 ( 팝업창에서 선택된 기관정보 노출 ) */
        // }

        // if( response.data.jisuDataList ) {
        //     selfThis.jisuDataList               =   response.data.jisuDataList;     /* 소급지수 업로드 후 목록정보 */
        //     selfThis.jisuUploadResult           =   true;                           /* 소급지수 업로드 결과 여부 */
        // }

    } catch(expetion) {

        console.log( expetion );

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result = false;
            resultMsg.msg    = "[error] indexModify.getRegistedJisuData 오류가 발생하였습니다.";
        }

        res.json({
                resultMsg: resultMsg
            ,   jisuDataList : []
            ,   jisuInfo : {}
            ,   arr_show_inst : []
            ,   arr_jisu_inst : []
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

