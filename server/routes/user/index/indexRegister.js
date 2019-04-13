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
 * 이미 등록된 지수ID 가 존재하는지 확인한다.
 * 2019-04-02  bkLove(촤병국)
 */
var getJisuDuplCheck = function (req, res) {
    console.log('indexRegister.getJisuDuplCheck 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var result = false;

    /* 1. body.data 값이 있는지 체크 */
    if (!req.body.data) {
        console.log("[error] indexRegister.getJisuDuplCheck  req.body.data no data.");
        console.log(req.body.data);
        res.json({
            success: false,
            result: result
        });
        return;
    }

    var paramData = JSON.parse(JSON.stringify(req.body.data));

    /* 2. 이미 등록된 지수ID 가 존재하는지 확인 */
    var format = { language: 'sql', indent: '' };
    var stmt = mapper.getStatement('indexRegister', 'getJisuDuplCheck', paramData, format);
    console.log(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {

            /* 3. cnt 가 0보다 큰 경우 데이터가 존재 */
            if (rows &&
                rows[0].cnt > 0) {
                result = true;
            }

            console.log("indexRegister.getJisuDuplCheck  result=[" + result + "]");
            res.json({
                success: true,
                result: result
            });
            res.end();
        }).catch(err => {
            console.log("[error] indexRegister.getJisuDuplCheck Error while performing Query.", err);
            res.json({
                success: false,
                message: err,
                result: result
            });
            res.end();
        });
    });
};

/* 
*************************************************************************************
*************************************************************************************
*/

/* 
 * 기관정보를 조회한다.
 * 2019-04-02  bkLove(촤병국)
 */
var getDomainInst = function(req, res) {
    console.log('indexRegister.getDomainInst 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var result = false;

    var paramData = {};

    /* 1. 기관정보를 조회한다. */
    var format = { language: 'sql', indent: '' };
    var stmt = mapper.getStatement('indexRegister', 'getDomainInst', paramData, format);
    console.log(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {

            var     dataList = [];
            if ( rows ) {

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
            }

            res.json({
                    dataGroupList: dataList
                ,   dataList : rows
            });
            res.end();

        }).catch(err => {
            console.log("[error] indexRegister.getDomainInst Error while performing Query.", err);
            res.json({
                dataList: []
            });
            res.end();
        });
    });
}

/* 
*************************************************************************************
*************************************************************************************
*/

/*
 * 소급지수 파일을 업로드 한다.
 * 2019-04-02  bkLove(촤병국)
 */
var fileuploadSingle = function (req, res) {
    console.log('indexRegister.fileuploadSingle 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    var reqParam = {
            uploadFolder: "d:\\test"
        ,   save_file_name: ''
        ,   user_id : req.session.user_id,
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

            reqParam.save_file_name = fileName + "_" + Date.now() + "" + fileExt;

            cb(null, reqParam.save_file_name);
        }
    });


    var upload = multer({ storage: storage }).single('files');

    upload(req, res, function (err) {

        console.log("#6 upload start");

        if (err) {
            console.log("File Upload Err" + err);
        }

        try{
            reqParam.org_file_name = req.file.originalname;
            reqParam.mime_type = req.file.mimetype;
            reqParam.file_size = req.file.size;

            console.log( JSON.stringify(reqParam) );  


            /* 엑셀파일을 파싱한다. */
            var workbook = xlsx.readFile(reqParam.uploadFolder + "/" + req.file.filename);
            var sheet_name_list = workbook.SheetNames;
            var dataLists = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: ["col01", "col02", "col03"], range: 2 });


            /* 엑셀 건수 체크 */
            if( dataLists.length == 0 ) {  
                resultMsg.result = false;
                resultMsg.msg = "소급지수 건수는 1건 이상 존재해야 합니다.";

            }else{

                /* 엑셀 데이터 사이즈 체크 */
                var check = true;
                for (var i = 0; i < dataLists.length; i++) {
                    var data = dataLists[i];

                    if( data.col01.length > 100 ) {
                        check = false;

                        resultMsg.result = false;
                        resultMsg.msg = "[" + (i+1) + " 행] 첫번째 컬럼이 100자리 이내여야 합니다.";
                        
                        break;
                    }

                    else if( data.col02.length > 100 ) {
                        check = false;

                        resultMsg.result = false;
                        resultMsg.msg = "[" + (i+1) + " 행] 두번째 컬럼이 100자리 이내여야 합니다.";
                        
                        break;
                    }

                    else if( data.col03.length > 100 ) {
                        check = false;

                        resultMsg.result = false;
                        resultMsg.msg = "[" + (i+1) + " 행] 세번째 컬럼이 100자리 이내여야 합니다.";
                        
                        break;
                    }

                    data.row_no = i+1;

                    if( !data.col04 ) {
                        data.col04 = "";
                    }

                    if( !data.col05 ) {
                        data.col05 = "";
                    }                     
                }
            }


            if( !check ) {

                res.json(resultMsg);
                res.end();

            }else{

                var format = { language: 'sql', indent: '' };
                var stmt = "";
                Promise.using(pool.connect(), conn => {
                    conn.beginTransaction(txerr => {

                        if( txerr ) {
                            return console.error( txerr );
                        }

                        async.waterfall([

                            /* 1. [지수 파일정보] 테이블에 저장한다. */
                            function( callback ) {

                                reqParam.gubun = "002";      /* 소급 지수 */

                                stmt = mapper.getStatement('indexRegister', 'saveTmJisuFile', reqParam, format);
                                console.log(stmt);

                                conn.query(stmt, function( err, rows ) {

                                    if( err ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "[error] indexRegister.saveTmJisuFile Error while performing Query";
                                        resultMsg.err       =   err;

                                        return callback( resultMsg );
                                    }

                                    if( rows ) {
                                        reqParam.file_id    =   rows.insertId;
                                    }

                                    callback( null, reqParam );
                                });
                            },


                            /* 2. [지수 저장전 업로드] 테이블에 저장한다. */
                            function( data, callback ) {

                                if( reqParam.file_id ) {

                                    reqParam.dataLists  =   dataLists;
                        
                                    stmt = mapper.getStatement('indexRegister', 'saveTmJisuTempUpload', reqParam, format);
                                    console.log(stmt);

                                    conn.query(stmt, function( err, rows ) {

                                        if( err ) {
                                            resultMsg.result    =   false;
                                            resultMsg.msg       =   "[error] indexRegister.saveTmJisuTempUpload Error while performing Query";
                                            resultMsg.err       =   err;

                                            return callback( resultMsg );
                                        }

                                        callback( null, reqParam );
                                    });

                                }else{

                                    callback( null, reqParam );
                                }
                            },

                            
                            /* 3. [지수 저장전 업로드] 테이블을 조회한다. */
                            function( data, callback ) {

                                if( reqParam.file_id ) {

                                    stmt = mapper.getStatement('indexRegister', 'getTmJisuTempUpload', reqParam, format);
                                    console.log(stmt);

                                    conn.query(stmt, function( err, rows ) {

                                        if( err ) {
                                            resultMsg.result    =   false;
                                            resultMsg.msg       =   "[error] indexRegister.getTmJisuTempUpload Error while performing Query";
                                            resultMsg.err       =   err;

                                            return callback( resultMsg );
                                        }

                                        if( rows ) {
                                            resultMsg.result = true;
                                            resultMsg.jisu_file_id = reqParam.file_id;
                                            resultMsg.dataList = rows;
                                        }

                                        callback( null, reqParam );
                                    });

                                }else{

                                    callback( null, reqParam );
                                }
                            }                            

                        ], function (err) {

                            if( err ) {
                                console.log( err );
                                conn.rollback();
                            }else{

                                resultMsg.result    =   true;
                                resultMsg.msg       =   "";
                                resultMsg.err       =   null;

                                conn.commit();
                            }

                            res.json( resultMsg );
                            res.end();
                        });

                    });
                });
            }

        } catch(expetion) {

            console.log(expetion);

            if( resultMsg && !resultMsg.msg ) {
                resultMsg.result    =   false;
                resultMsg.msg       =   "[error] 소급지수 파일 업로드 중 오류가 발생하였습니다.";
                resultMsg.err       =   expetion;
            }

            res.json({
                resultMsg
            });
            res.end();        
        }
    });
};


/* 
*************************************************************************************
*************************************************************************************
*/

/*
 * 지수정보를 등록한다.
 * 2019-04-02  bkLove(촤병국)
 */
var registerJisu = function (req, res) {
    console.log('indexRegister.save 호출됨.');

    try{
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};


        var resultMsg = {};
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

            /* body.data 값이 있는지 체크 */
            if (!req.body.data) {
                console.log("indexRegister.save  req.body.data no data.");
                console.log(req.body.data);

                resultMsg.result = false;
                resultMsg.msg = "입력값이 유효하지 않습니다.";

                res.json(resultMsg);
                res.end();
            }else{

                var paramData = JSON.parse( req.body.data );
                paramData.user_id = reqParam.user_id;
                console.log( paramData );

                var format = { language: 'sql', indent: '' };
                var stmt = "";
                Promise.using(pool.connect(), conn => {

                    conn.beginTransaction(txerr => {

                        if( txerr ) {
                            return console.error( txerr );
                        }

                        async.waterfall([

                            /* 1. [지수ID] 중복을 체크한다. */
                            function( callback ) {

                                stmt = mapper.getStatement('indexRegister', 'getJisuDuplCheck', paramData, format);
                                console.log(stmt);

                                conn.query(stmt, function( err, rows ) {

                                    if( err ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "[error] indexRegister.getJisuDuplCheck Error while performing Query";
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
                                    

                                    callback( null, paramData );
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

                                    stmt = mapper.getStatement('indexRegister', 'saveTmJisuFile', reqParam, format);
                                    console.log(stmt);

                                    conn.query(stmt, function( err, rows ) {

                                        if( err ) {
                                            resultMsg.result    =   false;
                                            resultMsg.msg       =   "[error] indexRegister.saveTmJisuFile Error while performing Query";
                                            resultMsg.err       =   err;

                                            return callback( resultMsg );
                                        }
                                        
                                        paramData.method_file_id        =   rows.insertId;

                                        callback( null, paramData );
                                    });

                                }else{
                                    callback( null, paramData );
                                }
                            },


                            /* 3. 지수 마스터를 저장한다. */
                            function( data, callback ) {

                                paramData.status                =   "01";       // 상태 (01: 등록완료, 02:연동신청, 03: 연동완료 )
                                stmt = mapper.getStatement('indexRegister', 'saveTmJisuMast', paramData, format);
                                console.log(stmt);

                                conn.query(stmt, function( err, rows ) {

                                    if( err ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "[error] indexRegister.saveTmJisuMast Error while performing Query";
                                        resultMsg.err       =   err;

                                        return callback( resultMsg );
                                    }

                                    if( rows.affectedRows > 0 ) {
                                        paramData.jisu_seq      =   rows.insertId;      /* 지수 시퀀스 */
                                    }

                                    callback( null, paramData );
                                });
                            },


                            /* 4. 지수 정보공개요청 을 저장한다. */
                            function( data, callback ) {

                                if( paramData.arr_jisu_inst && paramData.arr_jisu_inst.length > 0  ) {

                                    paramData.req_flag    =   "0";       /* 공개여부 0:비공개, 1:공개요청, 2:공개 */

                                    stmt = mapper.getStatement('indexRegister', 'saveTmJisuShareReq', paramData, format);
                                    console.log(stmt);

                                    conn.query(stmt, function( err, rows ) {

                                        if( err ) {
                                            resultMsg.result    =   false;
                                            resultMsg.msg       =   "[error] indexRegister.saveTmJisuShareReq Error while performing Query";
                                            resultMsg.err       =   err;

                                            return callback( resultMsg );
                                        }

                                        callback( null, paramData );
                                    });

                                }else{
                                    callback( null, paramData );
                                }
                            },


                            /* 5. [지수 저장전 업로드] 를 조회한다. */
                            function( data, callback ) {

                                paramData.file_id  =    paramData.jisu_file_id;

                                stmt = mapper.getStatement('indexRegister', 'getTmJisuTempUpload', paramData, format);
                                console.log(stmt);

                                conn.query(stmt, function( err, rows ) {

                                    if( err ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "[error] indexRegister.getTmJisuTempUpload Error while performing Query";
                                        resultMsg.err       =   err;

                                        return callback( resultMsg );
                                    }

                                    if( rows && rows.length > 0 ) {
                                        paramData.dataLists =   rows;
                                    }

                                    callback( null, paramData );

                                });
                            },


                            /* 6. [지수 엑셀업로드] 에 저장한다. */
                            function( data, callback ) {

                                if( paramData.dataLists != null && paramData.dataLists.length > 0  ) {

                                    stmt = mapper.getStatement('indexRegister', 'saveTmJisuUpload', paramData, format);
                                    console.log(stmt);

                                    conn.query(stmt, function( err, rows ) {

                                        if( err ) {
                                            resultMsg.result    =   false;
                                            resultMsg.msg       =   "[error] indexRegister.saveTmJisuUpload Error while performing Query";
                                            resultMsg.err       =   err;

                                            return callback( resultMsg );
                                        }

                                        callback( null, paramData );
                                    });

                                }else{
                                    callback( null, paramData );
                                }
                            },


                            /* 7. [지수 엑셀업로드 이력] 에 저장하기 위해 지수별 최신 이력번호를 조회한다. */
                            function( data, callback ) {

                                if( paramData.dataLists != null && paramData.dataLists.length > 0  ) {

                                    stmt = mapper.getStatement('indexRegister', 'getHistNoByTmJisuUploadHist', paramData, format);
                                    console.log(stmt);

                                    conn.query(stmt, function( err, rows ) {

                                        if( err ) {
                                            resultMsg.result    =   false;
                                            resultMsg.msg       =   "[error] indexRegister.getHistNoByTmJisuUploadHist Error while performing Query";
                                            resultMsg.err       =   err;

                                            return callback( resultMsg );
                                        }
    
                                        if( rows && rows[0].hist_no ) {
                                            paramData.hist_no   =   rows[0].hist_no;
                                        }

                                        callback( null, paramData );
                                    });

                                }else{
                                    callback( null, paramData );
                                }
                            },


                            /* 8. [지수 엑셀업로드 이력] 에 저장한다. */
                            function( data, callback ) {

                                if( paramData.dataLists != null && paramData.dataLists.length > 0  ) {

                                    if( paramData.hist_no ) {

                                        stmt = mapper.getStatement('indexRegister', 'saveTmJisuUploadHist', paramData, format);
                                        console.log(stmt);

                                        conn.query(stmt, function( err, rows ) {

                                            if( err ) {
                                                resultMsg.result    =   false;
                                                resultMsg.msg       =   "[error] indexRegister.saveTmJisuUploadHist Error while performing Query";
                                                resultMsg.err       =   err;

                                                return callback( resultMsg );
                                            }                                    

                                            callback( null, paramData );
                                        });

                                    }else{
                                        callback( null );
                                    }

                                }else{
                                    callback( null );
                                }
                            }

                        ], function (err) {

                            if( err ) {
                                console.log( err );
                                conn.rollback();
                            }else{

                                resultMsg.result    =   true;
                                resultMsg.msg       =   "성공적으로 저장 하였습니다.";
                                resultMsg.err       =   null;

                                conn.commit();
                            }

                            res.json( resultMsg );
                            res.end();
                        });

                    });
                });
            }
        });                        

    } catch(expetion) {

        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result    =   false;
            resultMsg.msg       =   "[error] indexRegister.registerJisu 오류가 발생하였습니다.";
            resultMsg.err       =   expetion;
        }

        res.json({
            resultMsg
        });
        res.end();        
    }
};


module.exports.getJisuDuplCheck = getJisuDuplCheck;
module.exports.getDomainInst = getDomainInst;
module.exports.fileuploadSingle = fileuploadSingle;
module.exports.registerJisu = registerJisu;