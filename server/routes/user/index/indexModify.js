/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require('../../../util/util');
var Promise = require("bluebird");

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs');
var async = require('async');

/* logging 추가함.  2019-06-10 */
var log = require('../../../util/logg');

var limit = {
        method_max_size : 5      /* 지수방법론 (Mb) */
    ,   jisu_max_size : 1        /* 소급지수 (Mb) */
    ,   jisu_divide_size : 100
};

/* 
 * 등록된 지수정보를 조회한다.
 * 2019-04-11  bkLove(촤병국)
 */
var getRegistedJisuData = function(req, res) {

    try {
        log.debug('indexModify.getRegistedJisuData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};


        var paramData = {};
        if (req.body.data) {
            paramData = req.body.data;
        }

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );

        log.debug(req.body.data);

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
                function(callback) {

                    try {
                        stmt = mapper.getStatement('indexModify', 'getJisuMast', paramData, format);
                        log.debug(stmt, paramData);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows && rows[0]) {
                                jisuInfo = rows[0];
                            }

                            resultMsg.jisuInfo = jisuInfo;

                            callback(null, jisuInfo);
                        });
                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },

                /* 2. 소급지수 목록 정보를 조회한다. */
                function(data, callback) {

                    try {
                        paramData.file_id = data.jisu_file_id;
                        stmt = mapper.getStatement('indexRegister', 'getTmJisuTempUpload', paramData, format);
                        log.debug(stmt);

                        conn.query(stmt, function(err, rows) {

                            if (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                            if (rows) {
                                jisuDataList = rows;
                            }

                            resultMsg.jisuDataList = jisuDataList;

                            callback(null, jisuDataList);
                        });
                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                },
                /* 3. 등록된 기관 목록 정보를 조회한다. */
                function(data, callback) {

                    try {
                        stmt = mapper.getStatement('indexModify', 'getJisuShareReq', paramData, format);
                        log.debug(stmt, paramData);

                        conn.query(stmt, function(err, rows) {

                            try {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if (rows) {

                                    var dataList = [];
                                    for (var i = 0, inx = 0; i < rows.length; i = i + 4) {
                                        var data = rows[i];
                                        var groupData = {};

                                        arr_jisu_inst.push(data.inst_cd);
                                        groupData.one = {};
                                        groupData.one.inst_cd = data.inst_cd;
                                        groupData.one.inst_name = data.inst_name;

                                        groupData.two = {};
                                        if (i + 1 < rows.length) {
                                            data = rows[i + 1];
                                            arr_jisu_inst.push(data.inst_cd);
                                            groupData.two.inst_cd = data.inst_cd;
                                            groupData.two.inst_name = data.inst_name;
                                        }

                                        groupData.three = {};
                                        if (i + 2 < rows.length) {
                                            data = rows[i + 2];
                                            arr_jisu_inst.push(data.inst_cd);
                                            groupData.three.inst_cd = data.inst_cd;
                                            groupData.three.inst_name = data.inst_name;
                                        }

                                        groupData.four = {};
                                        if (i + 3 < rows.length) {
                                            data = rows[i + 3];
                                            arr_jisu_inst.push(data.inst_cd);
                                            groupData.four.inst_cd = data.inst_cd;
                                            groupData.four.inst_name = data.inst_name;
                                        }

                                        dataList[inx++] = groupData;
                                    }

                                    arr_show_inst = dataList;
                                }

                                resultMsg.arr_show_inst = arr_show_inst;
                                resultMsg.arr_jisu_inst = arr_jisu_inst;

                                callback(null);

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        });

                    } catch (err) {

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;

                        return callback(resultMsg);
                    }
                }

            ], function(err) {

                if (err) {
                    log.error(err, paramData);
                } else {
                    resultMsg.result = true;
                    resultMsg.msg = "";
                    resultMsg.err = null;
                }

                res.json(resultMsg);
                res.end();
            });
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        if (resultMsg && !resultMsg.msg) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            resultMsg.jisuDataList = [];
            resultMsg.jisuInfo = {};
            resultMsg.arr_show_inst = [];
            resultMsg.arr_jisu_inst = [];
        }

        res.json(resultMsg);
        res.end();
    }
}


/**
 * NOTE: 디렉토리가 존재하는지 체크
 * @param {Array|String} DB에 저장된 업로드 경로
 */
function dirExists(absoluteDir) {
    try {
        // Array
        if (Array.isArray(absoluteDir)) {
            var flag = [];

            absoluteDir.forEach(function(Dir) {
                flag.push(fs.statSync(Dir).isDirectory()); // 존재하면 true 없으면 false
            });

            if (flag.indexOf(false) === -1) {
                return true;
            } else {
                return false;
            }

        } else {

            return fs.statSync(absoluteDir).isDirectory(); // 이하 동일
        }

    } catch (e) {
        log.error(e);

        // 디렉토리가 존재하지 않으면 'ENOENT' 에러를 반환해줌. return false
        if (e.code === 'ENOENT') {
            return false;
        } else {
            // 그외 에러는 확인
            throw e;
        }
    }
}


function deleteFile(fileInfo) {
    try {

        if (!fileInfo || !fileInfo.uploadFolder || !fileInfo.save_file_name) {
            return false;
        }

        fs.unlink(fileInfo.uploadFolder + "/" + fileInfo.save_file_name, function(err) {
            log.debug(fileInfo.uploadFolder + "/" + fileInfo.save_file_name + " 파일삭제 완료");
        });

        return true;

    } catch (e) {
        log.error(e);

        return false;
    }
}



/* 
 * 지수 정보를 수정한다.
 * 2019-04-11  bkLove(촤병국)
 */
var modifyJisu = function(req, res) {

    log.debug('indexModify.js modifyJisu 호출됨.');

    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        var reqParam = {
            uploadFolder: config.uploadFolder,
            save_file_name: '',
            user_id: req.session.user_id
        };

        var storage = multer.diskStorage({

            // 서버에 저장할 폴더
            destination: function(req, file, cb) {

                if (!dirExists(reqParam.uploadFolder)) {
                    fs.mkdirSync(reqParam.uploadFolder);
                }

                cb(null, reqParam.uploadFolder);
            },

            /* 서버에 저장 */
            filename: function(req, file, cb) {

                log.debug("file" + JSON.stringify(file));

                var fileLen = file.originalname.length;
                var lastDot = file.originalname.lastIndexOf(".");
                var fileName = file.originalname.substring(0, lastDot);
                var fileExt = file.originalname.substring(lastDot, fileLen).toLowerCase();

                reqParam.save_file_name = "method_" + fileName + "_" + Date.now() + "" + fileExt;

                cb(null, reqParam.save_file_name);
            }
        });


        var upload = multer({ storage: storage }).single('files');

        upload(req, res, function(err) {

            log.debug("upload start");

            if (err) {
                log.error("File Upload Err" + err);
            }


            /* body.data 값이 있는지 체크 */
            if (!req.body.data) {
                log.debug("indexModify.save  req.body.data no data.", req.body.data);

                resultMsg.result = false;
                resultMsg.msg = "입력값이 유효하지 않습니다.";

                res.json(resultMsg);
                res.end();

            } else {

                try{
                    fn_sizeCheck( req.file, "methodFile", resultMsg );

                    var paramData = JSON.parse(req.body.data);

                    paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
                    paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
                    paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
                    paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
                    paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );

                    log.debug(paramData);

                    /*
                    *   입력변수에 '\' 입력시 ' \' ' 따옴표를 치환하게 되어 쿼리오류 발생. ( '\' 입력시 '\\' 로 치환함. )
                    *   written by bkLove(최병국)   2019-06-25
                    */
                   util.fn_replaceSpecialChar( paramData );

                    var format = { language: 'sql', indent: '' };
                    var stmt = "";
                    Promise.using(pool.connect(), conn => {

                        conn.beginTransaction(txerr => {

                            if (txerr) {
                                return log.error(txerr);
                            }

                            async.waterfall([

                                /* 1. status 를 조회한다. */
                                function(callback) {

                                    try {

                                        paramData.file_id = paramData.prev_method_file_id;

                                        stmt = mapper.getStatement('indexModify', 'getJisuMast', paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            try {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                /* 이미 삭제된 경우 */
                                                if ( !rows || rows.length == 0 ) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = "[error] 이미 삭제된 상태입니다.";
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }   

                                                if (rows && rows[0]) {
                                                    paramData.nowStatus = rows[0].status;
                                                }

                                                /* 연동신청을 누르는 경우 상태값이 연동 완료된 경우 */
                                                if (paramData.modStatus == "03" && paramData.nowStatus == "03") {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = "[error] 이미 연동완료된 상태입니다.";
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                /* 상태가 변경된 경우 */
                                                if (paramData.nowStatus != paramData.status) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = "[error] 상태가 변경되었습니다. 화면 갱신후 다시 저장해 주세요.";
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                callback(null, paramData);

                                            } catch (err) {

                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }
                                        });


                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 2. 지수방법론을 저장한다. */
                                function(data, callback) {
                                    try {
                                        /* 지수방법론 파일이 존재하는 경우 */
                                        if (req.file) {
                                            reqParam.org_file_name = req.file.originalname;
                                            reqParam.mime_type = req.file.mimetype;
                                            reqParam.file_size = req.file.size;
                                            reqParam.gubun = "001"; /* 지수방법론 */

                                            stmt = mapper.getStatement('indexRegister', 'saveTmJisuFile', reqParam, format);
                                            log.debug(stmt, reqParam);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                paramData.method_file_id = rows.insertId;

                                                callback(null, paramData);
                                            });

                                        } else {
                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 3. 기존 지수파일이 바뀐 경우 기준 지수 파일 정보를 조회한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.prev_method_file_id != -1 &&
                                            paramData.prev_method_file_id != paramData.method_file_id) {

                                            paramData.file_id = paramData.prev_method_file_id;

                                            stmt = mapper.getStatement('indexModify', 'getJisuFile', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows && rows[0]) {
                                                    paramData.prev_mothod_save_file_name = rows[0].save_file_name;
                                                }

                                                callback(null, paramData);
                                            });

                                        } else {
                                            callback(null, paramData);
                                        }
                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 4. 기존 지수파일이 바뀐 경우 기준 지수 파일을 삭제한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.prev_method_file_id != -1 &&
                                            paramData.prev_method_file_id != paramData.method_file_id) {

                                            /* 기준 지수파일 경로가 존재하는 경우 */
                                            if (paramData.prev_mothod_save_file_name) {

                                                deleteFile({ "uploadFolder": reqParam.uploadFolder, "save_file_name": paramData.prev_mothod_save_file_name });
                                                callback(null, paramData);
                                            } else {
                                                callback(null, paramData);
                                            }
                                        } else {
                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] 기존지수 파일을 변경된 지수파일로 변경중 오류가 발생하였습니다.";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },


                                /* 5. 지수 마스터를 수정한다. */
                                function(data, callback) {

                                    try {
                                        stmt = mapper.getStatement('indexModify', 'modifyJisuMast', paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            callback(null, paramData);
                                        });

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 6. 삭제할 지수정보공개요청 조회 */
                                function(data, callback) {

                                    try {
                                        stmt = mapper.getStatement('indexModify', 'getJisuShareReqForDelete', paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            if (rows) {
                                                paramData.jisuShareReqDeleteList = rows;
                                                log.debug(rows);
                                            }

                                            callback(null, paramData);
                                        });

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 7. 삭제할 지수정보공개요청 삭제 */
                                function(data, callback) {

                                    try {
                                        if (paramData.jisuShareReqDeleteList != null && paramData.jisuShareReqDeleteList.length > 0) {

                                            stmt = mapper.getStatement('indexModify', 'deleteJisuShareReqList', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows) {
                                                    log.debug(rows);
                                                }

                                                callback(null, paramData);
                                            });
                                        } else {
                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 8. 추가할 지수정보공개요청 목록을 조회한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.arr_jisu_inst != null && paramData.arr_jisu_inst.length > 0) {
                                            stmt = mapper.getStatement('indexModify', 'getJisuShareReqForInsert', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows) {
                                                    paramData.jisuShareReqInsertList = rows;
                                                    log.debug(rows);
                                                }

                                                callback(null, paramData);
                                            });
                                        } else {
                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 9. 추가할 지수정보공개요청을 저장한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.jisuShareReqInsertList != null && paramData.jisuShareReqInsertList.length > 0) {

                                            paramData.req_flag = "0"; /* 공개여부 0:비공개, 1:공개요청, 2:공개 */
                                            stmt = mapper.getStatement('indexModify', 'insertJisuShareReqList', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows) {
                                                    log.debug(rows);
                                                }

                                                callback(null, paramData);
                                            });
                                        } else {
                                            callback(null, paramData);
                                        }
                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 10. 수정할 지수정보공개요청 목록을 조회한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.arr_jisu_inst != null && paramData.arr_jisu_inst.length > 0) {
                                            stmt = mapper.getStatement('indexModify', 'getJisuShareReqForUpdate', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows) {
                                                    paramData.jisuShareReqUpdateList = rows;
                                                    log.debug(rows);
                                                }

                                                callback(null, paramData);
                                            });
                                        } else {
                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 11. 수정할 지수정보공개요청을 저장한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.jisuShareReqUpdateList != null && paramData.jisuShareReqUpdateList.length > 0) {

                                            stmt = mapper.getStatement('indexModify', 'updateJisuShareReqList', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows) {
                                                    log.debug(rows);
                                                }

                                                callback(null, paramData);
                                            });
                                        } else {
                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 12. [지수 엑셀 업로드] 데이터를 삭제한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.jisu_file_id != paramData.prev_jisu_file_id) {

                                            stmt = mapper.getStatement('indexModify', 'deleteJisuUpload', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows) {
                                                    log.debug(rows);
                                                }

                                                callback(null, paramData);
                                            });

                                        } else {

                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 13. [tm_jisu_temp_upload] 데이터 건수를 조회한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.jisu_file_id != paramData.prev_jisu_file_id) {

                                            paramData.uploadCnt =   0;
                                            paramData.file_id = paramData.jisu_file_id;

                                            stmt = mapper.getStatement('indexRegister', 'getTmJisuTempUploadCnt', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows && rows.length == 1) {
                                                    paramData.uploadCnt = rows[0].cnt;
                                                }

                                                callback(null, paramData);
                                            });

                                        } else {

                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },                                

                                /* 14. [지수별 최신 이력번호] 를 조회한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.jisu_file_id != paramData.prev_jisu_file_id) {

                                            if ( paramData.file_id != -1 && paramData.uploadCnt > 0 ) {

                                                stmt = mapper.getStatement('indexRegister', 'getHistNoByTmJisuUploadHist', paramData, format);
                                                log.debug(stmt, paramData);

                                                conn.query(stmt, function(err, rows) {

                                                    if (err) {
                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;
                                                        resultMsg.err = err;

                                                        return callback(resultMsg);
                                                    }

                                                    if (rows && rows.length == 1 ) {
                                                        paramData.hist_no = rows[0].hist_no;
                                                    }

                                                    callback(null, paramData);
                                                });
                                            } else {
                                                callback(null, paramData);
                                            }
                                        }else{
                                            callback(null, paramData);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                                /* 15. [지수 엑셀업로드 이력] 테이블에 저장한다. */
                                function(data, callback) {

                                    try {
                                        if (paramData.jisu_file_id != paramData.prev_jisu_file_id) {

                                            if ( paramData.file_id != -1 && paramData.uploadCnt > 0 ) {

                                                if (paramData.hist_no) {

                                                    /* 8. [tm_jisu_upload_hist] 테이블에 저장한다. */
                                                    stmt = mapper.getStatement('indexRegister', 'saveTmJisuUploadHist', paramData, format);
                                                    log.debug(stmt, paramData);

                                                    conn.query(stmt, function(err, rows) {

                                                        if (err) {
                                                            resultMsg.result = false;
                                                            resultMsg.msg = config.MSG.error01;
                                                            resultMsg.err = err;

                                                            return callback(resultMsg);
                                                        }

                                                        callback(null);
                                                    });

                                                } else {
                                                    callback(null);
                                                }
                                            }else{
                                                callback(null);
                                            }

                                        } else {
                                            callback(null);
                                        }

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }
                                },

                            ], function(err) {

                                if (err) {
                                    log.error(err, paramData);
                                    conn.rollback();

                                    deleteFile(reqParam);
                                } else {

                                    resultMsg.jisu_id = paramData.jisu_id;
                                    resultMsg.jisu_seq = paramData.jisu_seq;

                                    resultMsg.result = true;

                                    if (paramData.modStatus) {
                                        resultMsg.msg = "성공적으로 연동신청 하였습니다.";
                                    } else {
                                        resultMsg.msg = "성공적으로 수정 하였습니다.";
                                    }
                                    resultMsg.err = null;

                                    conn.commit();
                                }

                                res.json(resultMsg);
                                res.end();
                            });
                        });
                    });

                } catch (expetion) {

                    log.error(expetion, paramData, reqParam);

                    deleteFile(reqParam);

                    resultMsg.result = false;
                    resultMsg.err = expetion;

                    res.json(resultMsg);
                    res.end();
                }                    
                    
            }
        });

    } catch (expetion) {
        log.error(expetion, paramData);

        deleteFile(reqParam);

        if (resultMsg && !resultMsg.msg) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = expetion;
        }

        res.json(resultMsg);
        res.end();
    }
}




/* 
 * 지수 정보를 삭제한다.
 * 2019-04-11  bkLove(촤병국)
 */
var deleteJisu = function(req, res) {

    log.debug('indexModify.js deleteJisu 호출됨.');

    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        var reqParam = {
            uploadFolder: config.uploadFolder,
            save_file_name: '',
            user_id: req.session.user_id
        };


        /* body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.debug("indexModify.deleteJisu  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = "입력값이 유효하지 않습니다.";

            res.json(resultMsg);
            res.end();

        } else {

            var paramData = req.body.data;

            paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
            paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
            paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
            paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
            paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );

            log.debug(paramData);

            var format = { language: 'sql', indent: '' };
            Promise.using(pool.connect(), conn => {

                conn.beginTransaction(txerr => {

                    if (txerr) {
                        return log.error(txerr);
                    }

                    async.waterfall([

                        /* 1. status 를 조회한다. */
                        function(callback) {

                            try {
                                if (paramData.prev_method_file_id != -1) {

                                    paramData.file_id = paramData.prev_method_file_id;

                                    stmt = mapper.getStatement('indexModify', 'getJisuMast', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        try {
                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            /* 이미 삭제된 경우 */
                                            if ( !rows || rows.length == 0 ) {
                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] 이미 삭제된 상태입니다.";
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            if (rows && rows[0]) {
                                                paramData.nowStatus = rows[0].status;
                                            }

                                            if (paramData.nowStatus == "03") {
                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] 연동완료 상태입니다. 상태를 확인해 주세요.";
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            callback(null, paramData);

                                        } catch (err) {

                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                    });

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                        },

                        /* 2. 지수 방법론 파일정보를 조회한다. */
                        function(data, callback) {

                            try {
                                if (paramData.prev_method_file_id != -1) {

                                    paramData.file_id = paramData.prev_method_file_id;

                                    stmt = mapper.getStatement('indexModify', 'getJisuFile', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if (rows && rows[0]) {
                                            paramData.prev_mothod_save_file_name = rows[0].save_file_name;
                                        }

                                        callback(null, paramData);
                                    });

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                        },

                        /* 3. 지수방법론 파일을 삭제한다. */
                        function(data, callback) {

                            try {
                                if (paramData.prev_method_file_id != -1) {

                                    /* 기준 지수파일 경로가 존재하는 경우 */
                                    if (paramData.prev_mothod_save_file_name) {

                                        fs.unlink(reqParam.uploadFolder + "/" + paramData.prev_mothod_save_file_name, function(err) {

                                            /*                                         if( err ) {
                                                                                        resultMsg.result    =   false;
                                                                                        resultMsg.msg       =   "[error] 지수방법론 삭제 중 오류가 발생하였습니다.";
                                                                                        resultMsg.err       =   err;

                                                                                        return callback( resultMsg );
                                                                                    }
                                            */
                                            log.debug(reqParam.uploadFolder + "/" + paramData.prev_save_file_name + " 파일삭제 완료");

                                            callback(null, paramData);
                                        });

                                    } else {
                                        callback(null, paramData);
                                    }

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = "[error] 지수방법론 파일 삭제 중 오류가 발생하였습니다.";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 4. 지수방법론을 삭제한다. */
                        function(data, callback) {

                            try {
                                if (paramData.prev_method_file_id != -1) {

                                    /* 기존 지수방법론 경로가 존재하는 경우 */
                                    if (paramData.prev_mothod_save_file_name) {

                                        paramData.file_id = paramData.prev_method_file_id;

                                        stmt = mapper.getStatement('indexModify', 'deleteJisuFile', paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            callback(null, paramData);
                                        });

                                    } else {
                                        callback(null, paramData);
                                    }

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },


                        /* 5. 소급지수 파일 정보를 조회한다. */
                        function(data, callback) {

                            try {
                                if (paramData.prev_jisu_file_id != -1) {

                                    paramData.file_id = paramData.prev_jisu_file_id;

                                    stmt = mapper.getStatement('indexModify', 'getJisuFile', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if (rows && rows[0]) {
                                            paramData.prev_jisu_save_file_name = rows[0].save_file_name;
                                        }

                                        callback(null, paramData);
                                    });

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 6. 소급지수 파일을 삭제한다. */
                        function(data, callback) {

                            try {
                                if (paramData.prev_jisu_file_id != -1) {

                                    /* 기존 지수파일 경로가 존재하는 경우 */
                                    if (paramData.prev_jisu_save_file_name) {

                                        fs.unlink(reqParam.uploadFolder + "/" + paramData.prev_jisu_save_file_name, function(err) {
                                            /* 
                                                                                    if( err ) {
                                                                                        resultMsg.result    =   false;
                                                                                        resultMsg.msg       =   "[error] 소급 지수파일 삭제 중 오류가 발생하였습니다.";
                                                                                        resultMsg.err       =   err;

                                                                                        return callback( resultMsg );
                                                                                    }
                                            */
                                            log.debug(reqParam.uploadFolder + "/" + paramData.prev_jisu_save_file_name + " 파일삭제 완료");

                                            callback(null, paramData);
                                        });

                                    } else {
                                        callback(null, paramData);
                                    }

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = "[error] 소급지수 파일 삭제 중 오류가 발생하였습니다.";
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 7. 소급지수 파일정보를 삭제한다. */
                        function(data, callback) {

                            try {
                                if (paramData.prev_jisu_file_id != -1) {

                                    /* 기존 지수파일 경로가 존재하는 경우 */
                                    if (paramData.prev_jisu_save_file_name) {

                                        paramData.file_id = paramData.prev_jisu_file_id;

                                        stmt = mapper.getStatement('indexModify', 'deleteJisuFile', paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            callback(null, paramData);
                                        });

                                    } else {
                                        callback(null, paramData);
                                    }

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 8. [지수 저장전 업로드 정보] 가 존재하는지 확인한다. */
                        function(data, callback) {

                            try {
                                if (paramData.prev_jisu_file_id != -1) {

                                    paramData.file_id = paramData.prev_jisu_file_id;

                                    stmt = mapper.getStatement('indexModify', 'getJisuTempUploadCnt', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if (rows && rows[0].cnt > 0) {
                                            paramData.exists_jisu_temp_upload = "Y";
                                        }

                                        callback(null, paramData);
                                    });

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 9. [지수 저장전 업로드 정보] 를 삭제한다. */
                        function(data, callback) {

                            try {
                                if (paramData.prev_jisu_file_id != -1) {

                                    if (paramData.exists_jisu_temp_upload == "Y") {

                                        paramData.file_id = paramData.prev_jisu_file_id;

                                        stmt = mapper.getStatement('indexModify', 'deleteJisuTempUpload', paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            callback(null, paramData);
                                        });
                                    }

                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 10. [지수 엑셀업로드] 가 존재하는지 확인한다. */
                        function(data, callback) {

                            try {
                                stmt = mapper.getStatement('indexModify', 'getJisuUploadCnt', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows[0].cnt > 0) {
                                        paramData.exists_jisu_upload = "Y";
                                    }

                                    callback(null, paramData);
                                });

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 11. [지수 엑셀업로드] 를 삭제한다. */
                        function(data, callback) {

                            try {
                                if (paramData.exists_jisu_upload == "Y") {

                                    stmt = mapper.getStatement('indexModify', 'deleteJisuUpload', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        callback(null, paramData);
                                    });
                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 12. [지수 특정기관공유] 가 존재하는지 확인한다. */
                        function(data, callback) {

                            try {
                                stmt = mapper.getStatement('indexModify', 'getJisuShareReqCnt', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows[0].cnt > 0) {
                                        paramData.exists_jisu_share_req = "Y";
                                    }

                                    callback(null, paramData);
                                });

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 13. [지수 특정기관공유] 를 삭제한다. */
                        function(data, callback) {

                            try {
                                if (paramData.exists_jisu_share_req == "Y") {

                                    stmt = mapper.getStatement('indexModify', 'deleteJisuShareReq', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        callback(null, paramData);
                                    });
                                } else {
                                    callback(null, paramData);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }

                        },

                        /* 14. [지수 마스터] 가 존재하는지 확인한다. */
                        function(data, callback) {

                            try {
                                stmt = mapper.getStatement('indexModify', 'getJisuMastCnt', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows[0].cnt > 0) {
                                        paramData.exists_jisu_mast = "Y";
                                    }

                                    callback(null, paramData);
                                });

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        },

                        /* 15. [지수 마스터] 를 삭제한다. */
                        function(data, callback) {

                            try {
                                if (paramData.exists_jisu_mast == "Y") {

                                    stmt = mapper.getStatement('indexModify', 'deleteJisuMast', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        callback(null);
                                    });
                                } else {
                                    callback(null);
                                }

                            } catch (err) {

                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                return callback(resultMsg);
                            }
                        }

                    ], function(err) {

                        if (err) {
                            log.error(err, paramData);
                            conn.rollback();
                        } else {

                            resultMsg.result = true;
                            resultMsg.msg = "성공적으로 삭제하였습니다.";
                            resultMsg.err = null;

                            conn.commit();
                        }

                        res.json(resultMsg);
                        res.end();
                    });
                });
            });
        }

    } catch (expetion) {
        log.error(expetion, paramData);

        if (resultMsg && !resultMsg.msg) {
            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;
            resultMsg.err = expetion;
        }

        res.json(resultMsg);
        res.end();
    }
}

function    fn_sizeCheck( file, gubun, resultMsg ){

    if( file ) {
        var title = "";
        var maxSize = 0;

        if( gubun == "file") {
            title = "소급지수";

            if( limit ) {
                maxSize = limit.jisu_max_size;
            }
        }else if( gubun == "methodFile" ) {
            title = "지수방법론";

            if( limit ) {
                maxSize = limit.method_max_size;
            }                    
        }

        if( maxSize > 0 ) {
            if( file.size == 0 ) {
                resultMsg.result = false;
                resultMsg.msg = title + " 파일용량이 0 byte 입니다.";

                throw new Error( resultMsg.msg );
            }

            if( ( maxSize * 1024 * 1024 ) < file.size ) {
                resultMsg.result = false;
                resultMsg.msg = title + " 파일용량은 " + maxSize + " Mb 보다 작아야 합니다.";

                throw new Error( resultMsg.msg );
            }
        }
    }
}


module.exports.getRegistedJisuData = getRegistedJisuData;
module.exports.modifyJisu = modifyJisu;
module.exports.deleteJisu = deleteJisu;