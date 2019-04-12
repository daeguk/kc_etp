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

    console.log('indexModify.js modifyJisu 호출됨.');

    try{
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        var resultJson = {};

        var reqParam = {
                uploadFolder: "d:\\test"
            ,   save_file_name: ''
            ,   user_id : req.session.user_id
        };

        var storage = multer.diskStorage({

            // 서버에 저장할 폴더
            destination: function (req, file, cb) {
                cb(null, reqParam.uploadFolder);
            },

            /* 서버에 저장 */
            filename: function (req, file, cb) {

                console.log("file" + JSON.stringify(file));

                var fileLen = file.originalname.length;
                var lastDot = file.originalname.lastIndexOf(".");
                var fileName = file.originalname.substring(0, lastDot);
                var fileExt = file.originalname.substring(lastDot, fileLen).toLowerCase();

                reqParam.save_file_name = "method_" + fileName + "_" + Date.now() + "" + fileExt;

                cb(null, reqParam.save_file_name);
            }
        });


        var upload = multer({ storage: storage }).single('files');

        upload(req, res, function (err) {

            console.log("upload start");

            if (err) {
                console.log("File Upload Err" + err);
            }


            /* 1. body.data 값이 있는지 체크 */
            if (!req.body.data) {
                console.log("indexRegister.save  req.body.data no data.");
                console.log(req.body.data);

                resultMsg.result = false;
                resultMsg.msg = "입력값이 유효하지 않습니다.";

                res.json(resultMsg);
                res.end();
                return;
            }

            var paramData = JSON.parse( req.body.data );


            paramData.user_id = reqParam.user_id;

console.log( paramData );

            var format = { language: 'sql', indent: '' };
            Promise.using(pool.connect(), conn => {

                conn.beginTransaction(txerr => {

                    if( txerr ) {
                        return console.error( txerr );
                    }

                    async.waterfall([

                        /* 1. 지수ID 중복 체크 */
                        function( callback ) {

                            stmt = mapper.getStatement('indexRegister', 'getJisuDuplCheck', paramData, format);
                            console.log(stmt);

                            conn.query(stmt, function( err, rows ) {

                                if( err ) {
                                    resultMsg.result    =   false;
                                    resultMsg.msg       =   "[error] indexModify.getJisuMast Error while performing Query";
                                    resultMsg.err       =   err;

                                    return callback( resultMsg );
                                }

                                if (rows &&
                                    rows[0].cnt > 0) {
                                    resultMsg.result    =   false;
                                    resultMsg.msg       =   "[지수ID]가 이미 존재합니다.";
                                    resultMsg.err       =   err;

                                    return callback( resultMsg );
                                }                                    

                                callback( null, rows );
                            });

                        },

                        /* 2. 지수방법론을 저장한다. */
                        function( data, callback ) {

                            /* 지수방법론 파일이 존재하는 경우 */
                            if( req.file ) {
                                reqParam.org_file_name = req.file.originalname;
                                reqParam.mime_type = req.file.mimetype;
                                reqParam.file_size = req.file.size;
                                reqParam.gubun = "001";      /* 지수방법론 */

                                var stmt = mapper.getStatement('indexRegister', 'saveTmJisuFile', reqParam, format);
                                console.log(stmt);

                                conn.query(stmt, function( err, rows ) {

                                    paramData.method_file_id        =   rows.insertId;

                                    if( err ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "[error] indexModify.saveTmJisuFile Error while performing Query";
                                        resultMsg.err       =   err;

                                        return callback( resultMsg );
                                    }

                                    callback( null, paramData );
                                });

                            }else{
                                callback( null, paramData );
                            }

                        },
                        /* 3. 지수 마스터를 수정한다. */
                        function( data, callback ) {

                            if( paramData.modStatus ) {
                                paramData.status = paramData.modStatus;
                            }

                            stmt = mapper.getStatement('indexModify', 'modifyJisuMast', paramData, format);
                            console.log(stmt);

                            conn.query(stmt, function( err, rows ) {

                                if( err ) {
                                    resultMsg.result    =   false;
                                    resultMsg.msg       =   "[error] indexModify.modifyJisuMast Error while performing Query";
                                    resultMsg.err       =   err;

                                    return callback( resultMsg );
                                }

                                if ( rows ) {

                                }

                                callback( null );
                            });
                        }                    
                    ], function (err) {

                        if( err ) {
                            console.log( err );
                            conn.rollback();
                        }else{
                            conn.commit();
                        }

                        res.json( resultJson );
                        res.end();
                    });
                });
            });
        });

    } catch(expetion) {
        console.log( "##5" );
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

