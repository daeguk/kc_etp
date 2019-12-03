/*
 *  etp 업로드 관련 정보
 *
 *  @date 2019-09-06
 *  @author bkLove
 */
var os = require('os');
var fs = require('fs');
var config = require('../../../config/config');
var util = require('../../../util/util');
var Promise = require("bluebird");


// var multer = require('multer');
// var xlsx = require('xlsx');
var async = require('async');
var _ = require("lodash");
var simulationUpload = require('../simulation/simulationUpload');

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs');

var log = config.logger;


var limit = {
    max_size      :   1       /* 포트폴리오 (Mb) */
};

var initGrpInfo         =   {
        INIT_GRP_CD         :   "*"                             /* 그룹코드 최초값 */
    ,   INIT_INCRE_GRP_CD   :   100000                          /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
};


/*
 * PDF 를 업로드 한다.
 * 2019-09-06  bkLove(촤병국)
 */
var uploadPdf = function(req, res) {
    log.debug('etpUpload.uploadPdf 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var resultMsg = {};
    var reqParam = {
        uploadFolder: config.uploadFolder,
        save_file_name: '',
        user_id: req.session.user_id,
    };

    var storage = multer.diskStorage({

        // 서버에 저장할 폴더
        destination: function(req, file, cb) {

            if (!simulationUpload.dirExists(reqParam.uploadFolder)) {
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

            reqParam.save_file_name = fileName + "_" + Date.now() + "" + fileExt;

            cb(null, reqParam.save_file_name);
        }
    });


    var upload = multer({ storage: storage }).single('files');

    upload(req, res, function(err) {

        log.debug("#1 etpUpload.uploadPdf upload start");

        if (err) {
            log.error("#1 etpUpload.uploadPdf upload Error", err);
        }


        /* 리밸런싱일별 포트폴리오 */
        var rebalancePortfolioObj       =   {};

        resultMsg.errorList             =   [];
        resultMsg.arr_rebalance_date    =   [];
        resultMsg.p_rebalance_file_yn   =   "0";
        resultMsg.p_start_year          =   "";

        try {
            reqParam.org_file_name = req.file.originalname;
            reqParam.mime_type = req.file.mimetype;
            reqParam.file_size = req.file.size;


            simulationUpload.fn_sizeCheck( req.file, "file", resultMsg );

            var paramData = JSON.parse(req.body.data);

            paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
            paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
            paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
            paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
            paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );    



            var arrCodeList06           =   [];     /* 단축코드 array */
            var arrCodeList12           =   [];     /* 국제표준코드 array */
            var arrExcelRebalanceDate   =   [];     /* 엑셀에서 업로드한 일자정보 */
            var arrExcelJongmok         =   [];     /* 엑셀에서 업로드한 종목정보 */


            var v_param = {
                    p_count_check       :   true    /* 엑셀 건수 체크 */
                ,   p_column_check      :   true    /* 엑셀 컬럼 체크 */
                ,   p_record_check      :   true    /* 엑셀 레코드 체크 */
                ,   p_rebalance_file_yn :   "0"     /* 리밸런싱 샘플파일 유무 */
                ,   p_record_data       :   {}      /* 엑셀 레코드 데이터 */
                ,   p_index             :   0       /* 엑셀 index */
                ,   p_startIndex        :   1
            };                

            /* 엑셀파일을 파싱한다. */
            var workbook = xlsx.readFile(reqParam.uploadFolder + "/" + req.file.filename);
            var sheet_name_list = workbook.SheetNames;
            var dataLists = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: ["col01", "col02", "col03", "col04"], range: v_param.p_startIndex });


            /* 엑셀 건수 체크 */
            if (dataLists.length <= 0 ) {
                v_param.p_count_check   =   false;

                resultMsg.result        =   false;
                resultMsg.msg           =   "레코드는 1건 이상 존재해야 합니다.";

            } else {


                if( dataLists.length == 1 ) {

                    v_param.p_index         =   0;

                    /* 엑셀 레코드 밸리데이션을 수행한다. */
                    simulationUpload.fn_excel_record_check( v_param, dataLists[0] );
                }else{

                    var dateCheck       =   [];
                    var jongmokCheck    =   [];
                    for (var i = 0; i < dataLists.length-1; i++) {
                        var data = dataLists[i];

                        /* 엑셀 레코드 밸리데이션을 수행한다. */
                        v_param.p_index         =   i;
                        simulationUpload.fn_excel_record_check( v_param, data );


                        /* 리밸런싱 날자가 존재하는 엑셀 파일인 경우 */
                        if( v_param.p_rebalance_file_yn == "1" ) {

                            /* 리밸런싱 날짜 */
                            dateCheck   =   arrExcelRebalanceDate.filter( function( item, index, array ) {
                                return  item.date == String( data.date );
                            });

                            if( !dateCheck || dateCheck.length == 0 ) {
                                arrExcelRebalanceDate.push( { date : data.date } );
                            }
                        }


                        /* 종목코드 */
                        jongmokCheck    =   arrExcelJongmok.filter( function( item, index, array ) {
                            return  item.code == String( data.code );
                        });

                        if( !jongmokCheck || jongmokCheck.length == 0 ) {
                            arrExcelJongmok.push( { 
                                    code    :   data.code
                                ,   row_no  :   i + v_param.p_startIndex  
                            });
                        }
                        

                        for (var j = i+1; j < dataLists.length; j++) {
                            var data2 = dataLists[j];

                            /* 엑셀 레코드 밸리데이션을 수행한다. */
                            v_param.p_index         =   j;
                            simulationUpload.fn_excel_record_check( v_param, data2 );                            


                            if( v_param.p_record_check ) {

                                /* 리밸런싱 샘플 파일이 아닌 경우 - 엑셀 파일에 코드만 중복존재하는지 체크 */
                                if( v_param.p_rebalance_file_yn == "0" ) {
                                    if( data.code == data2.code ) {
                                        v_param.p_record_check  =   false;

                                        data.result             =   false;
                                        data.msg                =   "[" + ( i + v_param.p_startIndex + 1 ) + " 행] 과 [" + ( j + v_param.p_startIndex + 1 ) + " 행] CODE 컬럼이 중복 존재합니다.";
                                    }
                                }
                                /* 리밸런싱 샘플인 경우 - 엑셀 파일에 날짜와 코드 둘다 중복존재하는지 체크 */
                                else{
                                    if( data.date == data2.date  && data.code == data2.code ) {
                                        v_param.p_record_check  =   false;

                                        data.result             =   false;
                                        data.msg                =   "[" + ( i + v_param.p_startIndex + 1 ) + " 행] 과 [" + ( j + v_param.p_startIndex + 1 ) + " 행] DATE 컬럼 과 CODE 컬럼이 중복 존재합니다.";
                                    }
                                }
                            }
                        }

                        data.row_no = i + v_param.p_startIndex;

                        /* 마지막 전 인덱스인 경우 */
                        if( i == dataLists.length-2 ) {

                            /* 마지막 레코드에 row_no 추가 */
                            data        =   dataLists[i+1];
                            data.row_no =   i + v_param.p_startIndex + 1;


                            /* 리밸런싱 날자가 존재하는 엑셀 파일인 경우 */
                            if( v_param.p_rebalance_file_yn == "1" ) {

                                /* 리밸런싱 날짜 */
                                dateCheck   =   arrExcelRebalanceDate.filter( function( item, index, array ) {
                                    return  item.date == String( data.date );
                                });

                                if( !dateCheck || dateCheck.length == 0 ) {
                                    arrExcelRebalanceDate.push( { date : data.date } );
                                }                            
                            }

                            /* 종목코드 */
                            jongmokCheck    =   arrExcelJongmok.filter( function( item, index, array ) {
                                return  item.code == String( data.code );
                            });

                            if( !jongmokCheck || jongmokCheck.length == 0 ) {
                                arrExcelJongmok.push( { 
                                        code    :   data.code
                                    ,   row_no  :   i + v_param.p_startIndex + 1 
                                });
                            }
                        }
                    }
                }
            }


            /* 건수 체크 와 레코드 체크 결과 정상이 아닌 경우 오류 노출 */
            if ( !v_param.p_count_check || !v_param.p_record_check ) {

                if( dataLists.length > 0 ) {
                    dataLists.splice( 0, 1 );
                }                

                if( !v_param.p_count_check ) {
                    resultMsg.errorList.push( { msg: resultMsg.msg } );
                }else if( !v_param.p_record_check ) {

                    for (var i = 0; i < dataLists.length; i++) {
                        var data = dataLists[i];

                        /* 오류가 존재하는 경우 */
                        if( typeof data.result != "undefined" && typeof data.msg != "undefined" && !data.result ) {
                            resultMsg.errorList.push( data );

                            /* 10 개 까지만 결과정보에 보관한다. */
                            if( resultMsg.errorList.length == 10  ) {
                                break;
                            }
                        }
                    }
                }

                simulationUpload.deleteFile(reqParam);

                resultMsg.record_check          =   v_param.p_record_check;
                resultMsg.count_check           =   v_param.p_count_check;
                resultMsg.p_rebalance_file_yn   =   v_param.p_rebalance_file_yn;
                resultMsg.result = false;

                res.json(resultMsg);
                res.end();

            } else {


                var format = { language: 'sql', indent: '' };
                var stmt = "";
                Promise.using(pool.connect(), conn => {

                    async.waterfall([

                        /* 1. kspjong_basic 을 조회하여 종목이 존재하는지 체크한다. */
                        function( callback ) {

                            try {

                                var msg         =   {};

                                msg.arrExcelJongmokNotExist =   [];

                                stmt = mapper.getStatement('simulation', 'getKspjongBasic', reqParam, format);
                                log.debug(stmt, reqParam);

                                conn.query(stmt, function(err, rows) {

                                    try {

                                        if (err) {
                                            log.error(err, stmt, reqParam);

                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                        else if ( !rows || rows.length == 0 )  {

                                            log.error(stmt, reqParam);

                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = "[error] simulation.getKspjongBasic 종목 기본정보가 없습니다.";

                                            return callback(resultMsg);
                                        }


                                    /**********************************************************************************************
                                     * kspjong_basic 에 존재하는지 체크 START
                                     **********************************************************************************************/
                                        for( var i=0 ; i < arrExcelJongmok.length; i++ ) {

                                            var filterData  =   _.filter( rows, function(o) {

                                                /* 단축코드 */
                                                if( arrExcelJongmok[i].code.length == 6 ) {
                                                    return  o.F16013 == arrExcelJongmok[i].code;
                                                }
                                                /* 국제표준코드 */
                                                else{
                                                    return  o.F16012 == arrExcelJongmok[i].code;
                                                }
                                            });


                                            /* 일치하는 코드가 없는 경우 */
                                            if( !filterData || filterData.length == 0 ) {                                                
                                                msg.arrExcelJongmokNotExist.push( arrExcelJongmok[i] );
                                            }
                                            /* kspjong_basic 에 코드가 중복존재하는 경우 */
                                            else if( filterData && filterData.length > 1 ){
                                                resultMsg.errorList.push( { 
                                                        result  :   false
                                                    ,   msg     :   "[" + arrExcelJongmok[i].row_no + " 행] CODE 컬럼 값 (" + arrExcelJongmok[i].code + ") 이 중복 존재합니다."
                                                });
                                            }

                                            /* 10 개 까지만 결과정보에 보관한다. */
                                            if( resultMsg.errorList.length == 10  ) {
                                                break;
                                            }                                                
                                        }
                                    /**********************************************************************************************
                                     * kspjong_basic 에 존재하는지 체크 END
                                     **********************************************************************************************/

                                        if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
                                            resultMsg.result = false;
                                            
                                            return  callback(resultMsg);
                                        }


                                        var first_rebalance_date    =   "";
                                        if( resultMsg.arr_rebalance_date && resultMsg.arr_rebalance_date.length > 0 ) {
                                            first_rebalance_date    =   resultMsg.arr_rebalance_date[0].value;
                                        }

                                        /* kspjong_basic 과 일치하는 코드에 대해 데이터 설정 */
                                        for (var i = 0; i < dataLists.length; i++) {

                                            var data        =   dataLists[i];

                                            /* 리밸런싱 샘플 파일이 아닌 경우 최초 리밸런싱일자를 date 에 넣어준다. */
                                            if( v_param.p_rebalance_file_yn != "1" ) {
                                                data.date       =   first_rebalance_date;
                                            }

                                            var filterData  =   _.filter( rows, function(o) {

                                                /* 단축코드 */
                                                if( data.code.length == 6 ) {
                                                    return  o.F16013 == data.code;
                                                }
                                                /* 국제표준코드 */
                                                else{
                                                    return  o.F16012 == data.code;
                                                }
                                            });

                                            if( filterData && filterData.length == 1 ) {
                                                data.F16013     =   filterData[0].F16013;       /* 단축코드 */
                                                data.F16002     =   filterData[0].F16002;       /* 종목명 */
                                                data.F15028     =   filterData[0].F15028;       /* 시가총액 */
                                            }
                                        }


                                        callback(null);

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return  callback(resultMsg);
                                    }                                    
                                });

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        },

                    ], function(err) {

                        deleteFile(reqParam);

                        if (err) {
                            resultMsg.rebalancePortfolioObj     =   {};
                            resultMsg.p_rebalance_file_yn       =   "0";
                            resultMsg.arr_rebalance_date        =   [];

                            log.error(err, reqParam);
                        } else {
                            resultMsg.result = true;
                            resultMsg.msg = "";
                            resultMsg.err = null;
                        }

                        res.json(resultMsg);
                        res.end();
                    });
                });
            }

        } catch (expetion) {

            log.error(expetion, reqParam);

            simulationUpload.deleteFile(reqParam);

            resultMsg.result = false;
            if( !resultMsg.msg ) {
                resultMsg.msg = config.MSG.error01;
            }
            resultMsg.err = expetion;

            resultMsg.rebalancePortfolioObj     =   {};
            resultMsg.p_rebalance_file_yn       =   "0";
            resultMsg.arr_rebalance_date        =   [];

            res.json(resultMsg);
            res.end();
        }
    });
};


module.exports.uploadPdf = uploadPdf;
