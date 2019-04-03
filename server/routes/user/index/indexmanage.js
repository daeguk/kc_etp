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

var getInfoOpenReqList = function (req, res) {
    console.log('indexmanage 모듈 안에 있는 getInfoOpenReqList 호출됨.');

    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");

    // var options = {id:'admin'};
    var options = {};
    var stmt = etpStmts.IndexManage.selectIndexInfoOpenReqList(options);
    console.log(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {
            util.log("sql1" == rows.affectedRows)
            res.json({
                success: true,
                results: rows
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

var getIndexSummaryHist = function (req, res) {
    console.log('indexmanage 모듈 안에 있는 getindexsummaryhist 호출됨.');

    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");

    // var options = {id:'admin'};
    console.log("req.query");
    console.log(req.query);
    var options = {
        index_cd: req.query.idx_cd
    };
    var stmt = etpStmts.IndexManage.selectIndexSummaryHist(options);
    console.log(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {
            util.log("sql1" == rows.affectedRows)
            res.json({
                success: true,
                results: rows
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
    var etpStmts = req.app.get("stmt");
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

    var options = JSON.parse(JSON.stringify(req.body.data));

    /* 2. 이미 등록된 지수ID 가 존재하는지 확인 */
    var stmt = etpStmts.IndexManage.getJisuDuplCheck(options);
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
 * 소급지수 파일을 업로드 한다.
 * 2019-04-02  bkLove(촤병국)
 */
var fileuploadSingle = function (req, res) {
    console.log('indexmanage.fileuploadSingle 호출됨.');

    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");
    var resultMsg = {};
    var uploadFolder    =   "d:\\test";

    var storage = multer.diskStorage({

        // 서버에 저장할 폴더
        destination: function (req, file, cb) {

            console.log("#1 destination start");

            cb(null, uploadFolder );

            console.log("#2 destination end");
        },

        // 서버에 저장할 파일 명
        filename: function (req, file, cb) {

            console.log("#3 filename start");

            console.log("file" + JSON.stringify(file));

            var fileLen = file.originalname.length;
            var lastDot = file.originalname.lastIndexOf(".");
            var fileName = file.originalname.substring(0, lastDot);
            var fileExt = file.originalname
                .substring(lastDot, fileLen)
                .toLowerCase();
            var saveFileName = fileName + "_" + Date.now() + "" + fileExt;

            console.log("saveFileName=" + saveFileName);
            cb(null, saveFileName);

            console.log("#4 filename end");
        }
    });

    console.log("#5 multer start");

    var upload = multer({ storage: storage }).single('files');

    upload(req, res, function (err) {

        console.log("#6 upload start");

        if (err) {
            console.log("File Upload Err" + err);
        }

        var workbook = xlsx.readFile( uploadFolder + "/" + req.file.filename);
        var sheet_name_list = workbook.SheetNames;
        var dataLists = xlsx.utils.sheet_to_json( workbook.Sheets[sheet_name_list[0]], { header: ["col1", "col2", "col3"], range: 2 } );

        console.log("#7 upload end");

        for( var i=0; i < dataLists.length; i++ ) {
            var row =   dataLists[i];
            console.log( row );
        }

        res.end();
    });

    console.log("#8 multer end");
};


/*
 * 지수정보를 등록한다.
 * 2019-04-02  bkLove(촤병국)
 */
var save = function (req, res) {
    console.log('indexmanage.save 호출됨.');

    var pool = req.app.get("pool");
    var etpStmts = req.app.get("stmt");
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

    var options = JSON.parse(JSON.stringify(req.body.data));

    /* TODO: 추후 세션의 사용자 ID 로 변경 필요. */
    options.user_id = 'test01';


    Promise.using(pool.connect(), conn => {

        conn.beginTransaction(txerr => {

            /* 2. [지수ID] 가 존재하는지 쿼리문 조회 */
            var stmt = etpStmts.IndexManage.getJisuDuplCheck(options);
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
                stmt = etpStmts.IndexManage.saveTmJisuMast(options);
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

module.exports.getInfoOpenReqList = getInfoOpenReqList;
module.exports.getIndexSummaryHist = getIndexSummaryHist;
module.exports.getIndexVueTableTestList = getIndexVueTableTestList;
module.exports.getIndexToastGridTestList = getIndexToastGridTestList;
module.exports.getJisuDuplCheck = getJisuDuplCheck;
module.exports.fileuploadSingle = fileuploadSingle;
module.exports.save = save;
