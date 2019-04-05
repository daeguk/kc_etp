/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

var util = require("util");
var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs'); 


var getIndexVueTableTestList = function (req, res) {
    console.log('indexmanage 모듈 안에 있는 getIndexVueTableTestList 호출됨.');
    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");

    // var options = {id:'admin'};
    console.log("req.query");
    console.log(req.query);
    var options = {};
    var stmt = etpStmts.IndexManage.getIndexToastGridTestList(options);
    console.log(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {

            util.log("sql1" == rows.affectedRows)
            res.json({
                success: true,
                results: rows,
                count: rows.length
            });
            res.end();
        }).catch(err => {
            util.log("Error while performing Query.", err);
            res.json({
                success: false,
                message: err
            });
            res.end();
        });


    });
};

var getIndexToastGridTestList = function (req, res) {
    console.log('indexmanage 모듈 안에 있는 getIndexToastGridTestList 호출됨.');

    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");

    // var options = {id:'admin'};
    console.log("req.query");
    console.log(req.query);
    var options = {};
    var stmt = etpStmts.IndexManage.getIndexToastGridTestList(options);
    console.log(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {
            util.log("sql1" == rows.affectedRows)
            res.json({
                success: true,
                results: rows,
                count: rows.length
            });
            res.end();
        }).catch(err => {
            util.log("Error while performing Query.", err);
            res.json({
                success: false,
                message: err
            });
            res.end();
        });


    });
};



/* 
 * 이미 등록된 지수ID 가 존재하는지 확인한다.
 * 2019-04-02  bkLove(촤병국)
 */
var getJisuDuplCheck = function (req, res) {
    console.log('indexmanage.getJisuDuplCheck 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var result = false;

    /* 1. body.data 값이 있는지 체크 */
    if (!req.body.data) {
        console.log("[error] indexmanage.getJisuDuplCheck  req.body.data no data.");
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

            console.log("indexmanage.getJisuDuplCheck  result=[" + result + "]");
            res.json({
                success: true,
                result: result
            });
            res.end();
        }).catch(err => {
            console.log("[error] indexmanage.getJisuDuplCheck Error while performing Query.", err);
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
 * 기관정보를 조회한다.
 * 2019-04-02  bkLove(촤병국)
 */
var getDomainInst = function(req, res) {
    console.log('indexmanage.getDomainInst 호출됨.');

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
            console.log("[error] indexmanage.getDomainInst Error while performing Query.", err);
            res.json({
                dataList: []
            });
            res.end();
        });
    });
}



/*
 * 소급지수 파일을 업로드 한다.
 * 2019-04-02  bkLove(촤병국)
 */
var fileuploadSingle = function (req, res) {
    console.log('indexmanage.fileuploadSingle 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    var reqParam = {
            uploadFolder: "d:\\test"
        ,   save_file_name: ''
            /* TODO: 추후 세션의 사용자 ID 로 변경 필요. */
        ,   user_id : 'test01'
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


            /* 1. 엑셀파일을 파싱한다. */
            var workbook = xlsx.readFile(reqParam.uploadFolder + "/" + req.file.filename);
            var sheet_name_list = workbook.SheetNames;
            var dataLists = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: ["col01", "col02", "col03"], range: 2 });


            /* 2. 엑셀 건수 체크 */
            if( dataLists.length == 0 ) {
                resultMsg.result = false;
                resultMsg.msg = "소급지수 건수는 1건 이상 존재해야 합니다.";

                res.json(resultMsg);
                res.end();  

                throw resultMsg;
            }


            /* 3. 엑셀 데이터 사이즈 체크 */
            var check = true;
            for (var i = 0; i < dataLists.length; i++) {
                var data = dataLists[i];

                if( data.col01.length > 100 ) {
                    check = false;

                    resultMsg.result = false;
                    resultMsg.msg = "[" + (i+1) + " 행] 첫번째 컬럼이 100자리 이내여야 합니다."
                    
                    break;
                }

                else if( data.col02.length > 100 ) {
                    check = false;

                    resultMsg.result = false;
                    resultMsg.msg = "[" + (i+1) + " 행] 두번째 컬럼이 100자리 이내여야 합니다."
                    
                    break;
                }

                else if( data.col03.length > 100 ) {
                    check = false;

                    resultMsg.result = false;
                    resultMsg.msg = "[" + (i+1) + " 행] 세번째 컬럼이 100자리 이내여야 합니다."
                    
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

            if( !check ) {
                res.json(resultMsg);
                res.end();

                throw resultMsg;
            }


            var format = { language: 'sql', indent: '' };
            Promise.using(pool.connect(), conn => {
                conn.beginTransaction(txerr => {

                    reqParam.gubun = "002";      /* 소급 지수 */


                    /* 4. [saveTmJisuFile] 테이블에 저장한다. */
                    var stmt = mapper.getStatement('indexRegister', 'saveTmJisuFile', reqParam, format);
                    console.log(stmt);

                    conn.queryAsync(stmt).then(rows => {

                        reqParam.file_id    =   rows.insertId;
                        reqParam.dataLists  =   dataLists;


                        /* 5. [tm_jisu_temp_upload] 저장 쿼리문 조회 */                   
                        stmt = mapper.getStatement('indexRegister', 'saveTmJisuTempUpload', reqParam, format);
                        console.log(stmt);

                        conn.queryAsync(stmt).then(rows => {

                            conn.commit();


                            /* 6. [tm_jisu_temp_upload] 쿼리문 조회 */
                            var stmt = mapper.getStatement('indexRegister', 'getTmJisuTempUpload', reqParam, format);
                            console.log(stmt);

                            conn.queryAsync(stmt).then(rows => {

                                resultMsg.result = true;
                                resultMsg.jisu_file_id = reqParam.file_id;
                                resultMsg.dataList = rows;

                                res.json(resultMsg);
                                res.end();
                            }).catch(err => {

                                console.log(err);

                                resultMsg.result = false;
                                resultMsg.msg = "처리중 오류가 발생하였습니다.";

                                res.json(resultMsg);
                                res.end();
                            });                    

                        }).catch(err => {

                            console.log(err);
                            conn.rollback();

                            resultMsg.result = false;
                            resultMsg.msg = "처리중 오류가 발생하였습니다.";

                            res.json(resultMsg);
                            res.end();
                        });

                    }).catch(err => {

                        console.log(err);
                        conn.rollback();

                        resultMsg.result = false;
                        resultMsg.msg = "처리중 오류가 발생하였습니다.";

                        res.json(resultMsg);
                        res.end();
                    });
                });
            });
        }catch( e ) {
            console.log( e );
        }
    });
};




/*
 * 지수정보를 등록한다.
 * 2019-04-02  bkLove(촤병국)
 */
var save = function (req, res) {
    console.log('indexmanage.save 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};

    /* 1. body.data 값이 있는지 체크 */
    if (!req.body.data) {
        console.log("indexmanage.save  req.body.data no data.");
        console.log(req.body.data);

        resultMsg.result = false;
        resultMsg.msg = "입력값이 유효하지 않습니다.";

        res.json(resultMsg);
        return;
    }

    var paramData = JSON.parse(JSON.stringify(req.body.data));

    /* TODO: 추후 세션의 사용자 ID 로 변경 필요. */
    paramData.user_id = 'test01';


    var format = { language: 'sql', indent: '' };
    Promise.using(pool.connect(), conn => {

        conn.beginTransaction(txerr => {

            /* 2. [지수ID] 가 존재하는지 쿼리문 조회 */
            var stmt = mapper.getStatement('indexRegister', 'getJisuDuplCheck', paramData, format);
            console.log(stmt);

            conn.queryAsync(stmt).then(rows => {

                /* 3. [지수ID]가 존재하는지 체크 */
                if (rows &&
                    rows[0].cnt > 0) {
                    resultMsg.result = false;
                    resultMsg.msg = "[지수ID]가 이미 존재합니다.";

                    throw resultMsg;
                }

                /* 4. [tm_jisu_mast] 저장 쿼리문 조회 */
                stmt = mapper.getStatement('indexRegister', 'saveTmJisuMast', paramData, format);
                console.log(stmt);

                conn.queryAsync(stmt).then(rows => {

                    paramData.req_flag    =   "0";       /* 공개여부 0:비공개, 1:공개요청, 2:공개 */

console.log( paramData );

                    /* 5. [tm_jisu_share_req] 저장 쿼리문 조회 */
                    stmt = mapper.getStatement('indexRegister', 'saveTmJisuShareReq', paramData, format);
                    console.log(stmt);

                    conn.queryAsync(stmt).then(rows => {

                        conn.commit();

                        resultMsg.result = true;
                        resultMsg.msg = "성공적으로 저장하였습니다.";

                        res.json(resultMsg);
                        res.end();

                    }).catch(err => {

                        console.log(err);

                        if (!err.msg) {
                            resultMsg.result = false;
                            resultMsg.msg = "indexmanage.saveTmJisuShareReq 오류 발생.";
                        }

                        res.json(resultMsg);
                        res.end();

                        conn.rollback();
                    });

                }).catch(err => {

                    console.log(err);

                    if (!err.msg) {
                        resultMsg.result = false;
                        resultMsg.msg = "indexmanage.saveTmJisuMast 오류 발생.";
                    }

                    res.json(resultMsg);
                    res.end();

                    conn.rollback();
                });

            }).catch(err => {

                console.log(err);

                if (!err.msg) {
                    resultMsg.result = false;
                    resultMsg.msg = "indexmanage.getJisuDuplCheck 오류 발생.";
                }

                res.json(resultMsg);
                res.end();

                conn.rollback();
            });
        });
    });
};


module.exports.getIndexVueTableTestList = getIndexVueTableTestList;
module.exports.getIndexToastGridTestList = getIndexToastGridTestList;
module.exports.getJisuDuplCheck = getJisuDuplCheck;
module.exports.getDomainInst = getDomainInst;
module.exports.fileuploadSingle = fileuploadSingle;
module.exports.save = save;
