/*
 *  시뮬레이션 업로드 관련 정보
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

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs');

var log = config.logger;


var limit = {
    max_size      :   1       /* 포트폴리오 (Mb) */
};


/*
 * 포트폴리오를 업로드 한다.
 * 2019-09-06  bkLove(촤병국)
 */
var uploadPortfolio = function(req, res) {
    log.debug('simulationUpload.uploadPortfolio 호출됨.');

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

            reqParam.save_file_name = fileName + "_" + Date.now() + "" + fileExt;

            cb(null, reqParam.save_file_name);
        }
    });


    var upload = multer({ storage: storage }).single('files');

    upload(req, res, function(err) {

        log.debug("#1 simulationUpload.uploadPortfolio upload start");

        if (err) {
            log.error("#1 simulationUpload.uploadPortfolio upload Error", err);
        }


        /* 리밸런싱일별 포트폴리오 */
        var rebalancePortfolioObj       =   {};

        resultMsg.errorList             =   [];
        resultMsg.arr_rebalance_date    =   [];
        resultMsg.p_rebalance_file_yn   =   "0";

        try {
            reqParam.org_file_name = req.file.originalname;
            reqParam.mime_type = req.file.mimetype;
            reqParam.file_size = req.file.size;

            if( req.body ) {
                reqParam.start_year = req.body.start_year;
                reqParam.rebalance_cycle_cd = req.body.rebalance_cycle_cd;
                reqParam.rebalance_date_cd = req.body.rebalance_date_cd;
            }


            fn_sizeCheck( req.file, "file", resultMsg );


            var arrCodeList06           =   [];     /* 단축코드 array */
            var arrCodeList12           =   [];     /* 국제표준코드 array */
            var arrExcelRebalanceDate   =   [];     /* 엑셀에서 업로드한 일자정보 */


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
            var dataLists = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: ["col01", "col02", "col03"], range: v_param.p_startIndex });        


            /* 엑셀 건수 체크 */
            if (dataLists.length == 0) {
                v_param.p_count_check   =   false;

                resultMsg.result        =   false;
                resultMsg.msg           =   "레코드는 1건 이상 존재해야 합니다.";

            } else {

                /* 
                *   리밸런싱 샘플파일 유무 체크 
                *   - 컬럼3개가 모두 존재하고 첫번째 컬럼의 자리수가 8자리 인 경우 리밸런싱 파일으로 간주 
                */
                if(     typeof dataLists[0].col01 != "undefined"
                    &&  typeof dataLists[0].col02 != "undefined"
                    &&  typeof dataLists[0].col03 != "undefined"
                ) {
                    var col01   =   dataLists[0].col01;

                    if( col01 != "" && new String( col01 ).length == 8 ) {
                        v_param.p_rebalance_file_yn     =   "1";
                    }
                }


                if( dataLists.length == 1 ) {

                    v_param.p_index         =   0;

                    /* 엑셀 레코드 밸리데이션을 수행한다. */
                    fn_excel_record_check( v_param, dataLists[0] );
                }else{

                    var dateCheck   =   [];
                    for (var i = 0; i < dataLists.length-1; i++) {
                        var data = dataLists[i];

                        /* 엑셀 레코드 밸리데이션을 수행한다. */
                        v_param.p_index         =   i;
                        fn_excel_record_check( v_param, data );


                        if( v_param.p_rebalance_file_yn == "1" ) {

                            dateCheck   =   arrExcelRebalanceDate.filter( function( item, index, array ) {
                                return  item.date == String( dataLists[i].date );
                            });

                            if( !dateCheck || dateCheck.length == 0 ) {
                                arrExcelRebalanceDate.push( { date : dataLists[i].date } );
                            }                            
                        }

                        for (var j = i+1; j < dataLists.length; j++) {
                            var data2 = dataLists[j];

                            /* 엑셀 레코드 밸리데이션을 수행한다. */
                            v_param.p_index         =   j;
                            fn_excel_record_check( v_param, data2 );                            


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

                        if( i == dataLists.length-2 ) {
                            /* 마지막 레코드에 row_no 추가 */
                            data = dataLists[i+1];
                            data.row_no = i + v_param.p_startIndex + 1;
                        }                        
                    }
                }
            }


            /* 건수 체크 와 레코드 체크 결과 정상이 아닌 경우 오류 노출 */
            if ( !v_param.p_count_check || !v_param.p_record_check ) {

                if( !v_param.p_record_check ) {
                    for (var i = 0; i < dataLists.length-1; i++) {
                        var data = dataLists[i];

                        /* 오류가 존재하는 경우 */
                        if( !data.result ) {
                            resultMsg.errorList.push( data );

                            /* 10 개 까지만 결과정보에 보관한다. */
                            if( resultMsg.errorList.length == 10  ) {
                                break;
                            }
                        }
                    }
                }

                deleteFile(reqParam);

                resultMsg.record_Check          =   v_param.p_record_check;
                resultMsg.p_rebalance_file_yn   =   v_param.p_rebalance_file_yn;
                resultMsg.result = false;

                res.json(resultMsg);
                res.end();

            } else {


                var format = { language: 'sql', indent: '' };
                var stmt = "";
                Promise.using(pool.connect(), conn => {

                    async.waterfall([

                        /* 1. 리밸런싱 샘플 파일인 경우 업로드한 리밸런싱 날짜 중 영업일에 존재하지 않는 일자를 조회한다. */
                        function( callback ) {

                            /* 리밸런싱 샘플 파일인 경우 */
                            if( v_param.p_rebalance_file_yn == "1" ) {

                                try {
                                    var msg         =   {};

                                    reqParam.rebalance_cycle_cd     =   "0";        /* 리밸런싱 주기 */
                                    reqParam.rebalance_date_cd      =   "0";        /* 리밸런싱 일자 코드 */

                                    if( !arrExcelRebalanceDate || arrExcelRebalanceDate.length == 0 ) {
                                        arrExcelRebalanceDate.push( { date : "" } );
                                    }
                                    reqParam.arrExcelRebalanceDate  =   arrExcelRebalanceDate;
                                    stmt = mapper.getStatement('simulationUpload', 'getRebalanceDateNotExistCheckByUpload', reqParam, format);
                                    log.debug(stmt, reqParam);

                                    conn.query(stmt, function(err, rows) {
                                        try {

                                            resultMsg.result = true;
                                            resultMsg.msg = "";                    

                                            if (err) {
                                                log.error(err, stmt, reqParam);

                                                resultMsg.result = false;
                                                resultMsg.msg = "[error] simulationUpload.getRebalanceDateNotExistCheckByUpload Error while performing Query";
                                                resultMsg.err = err;
                                            }
                                            else if (rows && rows.length > 0) {

                                                for( var i=0 ; i < rows.length; i++ ) {

                                                    if( rows[i].date_check == "check1" ) {
                                                        resultMsg.errorList.push( { 
                                                                result  :   false
                                                            ,   msg     :   "2000 년도 이전 날짜 ( " + rows[i].F12506 + " )  가 존재합니다."
                                                        });
                                                    }

                                                    if( rows[i].date_check == "check2" ) {
                                                        resultMsg.errorList.push( { 
                                                                result  :   false
                                                            ,   msg     :   "현재일 이후 날짜 ( " + rows[i].F12506 + " )  가 존재합니다."
                                                        });
                                                    }                                                    

                                                    /* 10 개 까지만 결과정보에 보관한다. */
                                                    if( resultMsg.errorList.length == 10  ) {
                                                        break;
                                                    }
                                                }
                                                

                                                if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
                                                    resultMsg.result = false;
                                                    
                                                    return  callback(resultMsg);
                                                }

                                            }

                                            callback(null, msg);

                                        } catch (err) {

                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] simulationUpload.getRebalanceDateNotExistCheckByUpload Error while performing Query";
                                            resultMsg.err = err;

                                            return  callback(resultMsg);
                                        }

                                    });

                                } catch (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[error] simulationUpload.getRebalanceDateNotExistCheckByUpload Error while performing Query";
                                    resultMsg.err = err;

                                    callback(resultMsg);
                                }

                            }else{
                                callback(null, msg);
                            }
                        },

                        /* 2. 화면에서 select 된 리밸런싱 일자를 조회한다. */
                        function( msg, callback ) {

                            var nameSpaceId     =   "simulation2";
                            var queryId         =   "getRebalanceDate";

                            try {
                                
                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }


                                /* 리밸런싱 샘플 파일인 경우 리밸런싱 일자를 조회한다. */
                                if( v_param.p_rebalance_file_yn == "1" ) {

                                    reqParam.rebalance_cycle_cd     =   "0";        /* 리밸런싱 주기 */
                                    reqParam.rebalance_date_cd      =   "0";        /* 리밸런싱 일자 코드 */
                                    reqParam.arrExcelRebalanceDate  =   dataLists;

                                    nameSpaceId     =   "simulationUpload";
                                    queryId         =   "getRebalanceDateByUpload";
                                }

                                if( !reqParam.arrExcelRebalanceDate || reqParam.arrExcelRebalanceDate.length == 0 ) {
                                    reqParam.arrExcelRebalanceDate.push( { date : "" } );
                                }

                                stmt = mapper.getStatement( nameSpaceId, queryId, reqParam, format);
                                log.debug(stmt, reqParam);

                                conn.query(stmt, function(err, rows) {
                                    try {

                                        resultMsg.result = true;
                                        resultMsg.msg = "";                    

                                        if (err) {
                                            log.error(err, stmt, reqParam);

                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] " + nameSpaceId +"." + queryId + " Error while performing Query";
                                            resultMsg.err = err;
                                        }
                                        else if (rows && rows.length > 0) {

                                            /* 리밸런싱 샘플 파일인 경우 리밸런싱 일자를 조회한다. */
                                            if( v_param.p_rebalance_file_yn == "1" ) {
                                                for( var i=0; i < rows.length; i++ ) {
                                                    resultMsg.arr_rebalance_date.push( { "text" : rows[i].fmt_F12506, "value" : rows[i].F12506 } );
                                                }
                                            }else{
                                                resultMsg.arr_rebalance_date.push( { "text" : rows[0].fmt_F12506, "value" : rows[0].F12506 } );
                                            }
                                        }

                                        callback(null, msg);

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] " + nameSpaceId +"." + queryId + " Error while performing Query";
                                        resultMsg.err = err;

                                        return  callback(resultMsg);
                                    }

                                });

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] " + nameSpaceId +"." + queryId + " Error while performing Query";
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        },                        

                        /* 3. 업로드한 종목 중 존재하지 않는 종목을 조회한다. ( 10개만 노출 ) */
                        function( msg, callback) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

                                var first_rebalance_date    =   "";
                                if( resultMsg.arr_rebalance_date && resultMsg.arr_rebalance_date.length > 0 ) {
                                    first_rebalance_date    =   resultMsg.arr_rebalance_date[0].F12506;
                                }

                                for( var i=0; i < dataLists.length; i++) {
                                    var data = dataLists[i];
                                    
                                    if( !data.date )        data.date       =   "";
                                    if( !data.code )        data.code       =   "";
                                    if( !data.allocation )  data.allocation =   -1;
                                    if( !data.row_no )      data.row_no     =   -1;

                                    /* 리밸런싱 샘플 파일이 아닌 경우 최초 리밸런싱일자를 date 에 넣어준다. */
                                    if( v_param.p_rebalance_file_yn != "1" ) {
                                        data.date       =   first_rebalance_date;
                                    }                              

                                    if( data.code.length == 6  ){
                                        arrCodeList06.push( data );
                                    }else if( data.code.length == 12 ) {
                                        arrCodeList12.push( data );
                                    }
                                }

                                if( arrCodeList06.length == 0 ) {
                                    arrCodeList06.push({
                                            date        :   ""
                                        ,   code        :   ""
                                        ,   allocation  :   -1
                                        ,   row_no      :   -1
                                    });
                                }

                                if( arrCodeList12.length == 0 ) {
                                    arrCodeList12.push({
                                            date        :   ""
                                        ,   code        :   ""
                                        ,   allocation  :   -1
                                        ,   row_no      :   -1
                                    });
                                }

                                reqParam.arrCodeList06  =   arrCodeList06;
                                reqParam.arrCodeList12  =   arrCodeList12;

                                stmt = mapper.getStatement('simulationUpload', 'getJongmokNotExistCheckByUpload', reqParam, format);
                                log.debug(stmt, reqParam);

                                conn.query(stmt, function(err, rows) {

                                    try {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] simulationUpload.getJongmokNotExistCheckByUpload Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if( rows && rows.length > 0 ) {

                                            for( var i=0 ; i < rows.length; i++ ) {
                                                resultMsg.errorList.push( { 
                                                        result  :   false
                                                    ,   msg     :   "[" + rows[i].row_no + " 행] CODE 컬럼 값 (" + rows[i].code + ") 이 존재하지 않습니다."
                                                });

                                                /* 10 개 까지만 결과정보에 보관한다. */
                                                if( resultMsg.errorList.length == 10  ) {
                                                    break;
                                                }                                                
                                            }

                                            if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
                                                resultMsg.result = false;
                                                
                                                return  callback(resultMsg);
                                            }
                                        }

                                        callback(null, msg);

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationUpload.getJongmokNotExistCheckByUpload Error while performing Query";
                                        resultMsg.err = err;

                                        return  callback(resultMsg);
                                    }                                    
                                });

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] simulationUpload.getJongmokNotExistCheckByUpload Error while performing Query";
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        },

                        /* 4. 업로드한 종목 중 존재하지 않는 종목을 조회한다. ( 10개만 노출 ) */
                        function( msg, callback ) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

                                stmt = mapper.getStatement('simulationUpload', 'getJongmokDuplCheckByUpload', reqParam, format);
                                log.debug(stmt, reqParam);

                                conn.query(stmt, function(err, rows) {
                                    try {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] simulationUpload.getJongmokDuplCheckByUpload Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if( rows && rows.length > 0 ) {

                                            for( var i=0 ; i < rows.length; i++ ) {
                                                resultMsg.errorList.push( { 
                                                        result  :   false
                                                    ,   msg     :   "[" + rows[i].row_no + " 행] CODE 컬럼 값 (" + rows[i].code + ") 이 중복 존재합니다."
                                                });

                                                /* 10 개 까지만 결과정보에 보관한다. */
                                                if( resultMsg.errorList.length == 10  ) {
                                                    break;
                                                }                                                
                                            }

                                            if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
                                                resultMsg.result = false;
                                                
                                                return  callback(resultMsg);
                                            }
                                        }

                                        callback(null, msg);

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationUpload.getJongmokDuplCheckByUpload Error while performing Query";
                                        resultMsg.err = err;

                                        return  callback(resultMsg);
                                    }

                                });

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] simulationUpload.getJongmokDuplCheckByUpload Error while performing Query";
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        },

                        /* 5. 업로드한 종목과 일치하는 정보를 조회한다. */
                        function( msg, callback ) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

                                stmt = mapper.getStatement('simulationUpload', 'getJongmokByUpload', reqParam, format);
                                log.debug(stmt, reqParam);

                                conn.query(stmt, function(err, rows) {
                                    try {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "[error] simulationUpload.getJongmokByUpload Error while performing Query";
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }


                                        if ( rows && rows.length > 0 ) {
                                            resultMsg.result = true;

                                            var v_order_no  =   0;
                                            for( var i=0; i < rows.length; i++ ) {
                                                if( !rebalancePortfolioObj[ rows[i].date ] || Object.keys( rebalancePortfolioObj[ rows[i].date ] ).length == 0  ) {
                                                    rebalancePortfolioObj[ rows[i].date ]     =   {};
                                                    v_order_no  =   0;
                                                }

                                                if( !rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ] || Object.keys( rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ] ).length == 0  ) {
                                                    rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ]         =   {};
                                                }

                                                rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ].F16013      =   rows[i].F16013;         /* 단축코드 */
                                                rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ].F16002      =   rows[i].F16002;         /* 종목명 */
                                                rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ].F15028      =   rows[i].F15028;         /* 시가총액 */
                                                rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ].importance  =   rows[i].allocation;     /* 엑셀에서 입력한 비중 */
                                                rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ].order_no    =   v_order_no;             /* 정렬순번 */
                                                rebalancePortfolioObj[ rows[i].date ][ rows[i].F16013 ].trIndex     =   v_order_no;             /* 테이블 레코드 순번 */

                                                v_order_no++;
                                            }
                                        }

                                        resultMsg.rebalancePortfolioObj     =   rebalancePortfolioObj;
                                        resultMsg.p_rebalance_file_yn       =   v_param.p_rebalance_file_yn;

console.log( "resultMsg.p_rebalance_file_yn", resultMsg.p_rebalance_file_yn );

                                        callback(null);

                                    } catch (err) {

                                        resultMsg.result = false;
                                        resultMsg.msg = "[error] simulationUpload.getJongmokByUpload Error while performing Query";
                                        resultMsg.err = err;

                                        return  callback(resultMsg);
                                    }

                                });

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = "[error] simulationUpload.getJongmokByUpload Error while performing Query";
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        }                            

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

            deleteFile(reqParam);

            resultMsg.result = false;
            if( !resultMsg.msg ) {
                resultMsg.msg = "[error] portfolio 파일 업로드 중 오류가 발생하였습니다.";
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


/*
 * 엑셀 레코드 밸리데이션을 수행한다.
 * 2019-09-06  bkLove(촤병국)
 */

function    fn_excel_record_check( p_param={ p_column_check : true, p_record_check : true, p_rebalance_file_yn : "0", p_index : 0, p_startIndex : 0 }, p_record_data={} ){

    if( p_record_data && Object.keys( p_record_data ).length > 0 ) {

        /* 리밸런싱 파일이 아닌 경우 */
        if( p_param.p_rebalance_file_yn == "0" ) {


            /* CODE 체크 */
            p_param.p_column                =   "CODE";
            p_param.p_data                  =   p_record_data.col01;
            fn_excel_column_check( p_param, p_record_data );

            if( !p_param.p_column_check ) {
                p_param.p_record_check      =   false;
            }else{

                /* ALLOCATION 체크 */
                p_param.p_column            =   "ALLOCATION";
                p_param.p_data              =   p_record_data.col02;
                fn_excel_column_check( p_param, p_record_data );                

                if( !p_param.p_column_check ) {
                    p_param.p_record_check      =   false;
                }
            }

            if( p_param.p_column_check ) {
                p_record_data.code          =   String( p_record_data.col01 );
                p_record_data.allocation    =   String( p_record_data.col02 );
            }

        }
        /* 리밸런싱 파일인 경우 */
        else{

            /* DATE 체크 */
            p_param.p_column                =   "DATE";
            p_param.p_data                  =   p_record_data.col01;
            fn_excel_column_check( p_param, p_record_data );

            if( !p_param.p_column_check ) {
                p_param.p_record_check      =   false;
            }else{

                /* CODE 체크 */
                p_param.p_column            =   "CODE";
                p_param.p_data              =   p_record_data.col02;
                fn_excel_column_check( p_param, p_record_data );

                if( !p_param.p_column_check ) {
                    p_param.p_record_check      =   false;
                }else{

                    /* ALLOCATION 체크 */
                    p_param.p_column            =   "ALLOCATION";
                    p_param.p_data              =   p_record_data.col03;
                    fn_excel_column_check( p_param, p_record_data );

                    if( !p_param.p_column_check ) {
                        p_param.p_record_check      =   false;
                    }                    
                }
            }

            if( p_param.p_column_check ) {
                p_record_data.date          =   String( p_record_data.col01 );
                p_record_data.code          =   String( p_record_data.col02 );
                p_record_data.allocation    =   Number( p_record_data.col03 );
            }
        }
    }

}

/*
 * 엑셀 레코드 밸리데이션을 수행한다.
 * 2019-09-06  bkLove(촤병국)
 */

function    fn_excel_column_check( p_param={ p_column_check : true, p_column : "", p_rebalance_file_yn : "0", p_data : "", p_index : 0, p_startIndex : 0 }, p_record_data={} ){

    if( p_param.p_column != "" ) {

        switch( p_param.p_column ) {

            case    "CODE"  :

                    if (typeof p_param.p_data == "undefined") {
                        p_param.p_column_check          =   false;

                        p_record_data.result            =   false;
                        p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] CODE 컬럼이 존재하지 않습니다.";

                    } else if ( !( String( p_param.p_data ).length == 6 || String( p_param.p_data ).length == 12 ) ) {
                        p_param.p_column_check          =   false;

                        p_record_data.result            =   false;
                        p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] CODE 컬럼은 6자리 또는 12자리만 가능합니다.";
                    }

                    break;

            case    "ALLOCATION"  :

                    if (typeof p_param.p_data == "undefined") {
                        p_param.p_column_check          =   false;

                        p_record_data.result            =   false;
                        p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] ALLOCATION 컬럼이 존재하지 않습니다.";

                    }else{
                    
                        try{
                            var temp = Number( p_param.p_data );

                            if( isNaN( temp ) ) {
                                p_param.p_column_check          =   false;

                                p_record_data.result            =   false;
                                p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] ALLOCATION 컬럼은 숫자형만 입력해 주세요.";                                
                            }
                        }catch(e) {
                            p_param.p_column_check          =   false;

                            p_record_data.result            =   false;
                            p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] ALLOCATION 컬럼은 숫자형만 입력해 주세요.";
                        }

                        if( p_param.p_column_check ) {
                            if ( Number( p_param.p_data ) < 0 || Number( p_param.p_data ) > 100 ) {
                                p_param.p_column_check          =   false;

                                p_record_data.result            =   false;
                                p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] ALLOCATION 컬럼은 0 ~ 100 사이만 입력해 주세요.";
                            }
                        }
                    }

                    break;

            case    "DATE"  :

                    if (typeof p_param.p_data == "undefined") {
                        p_param.p_column_check          =   false;

                        p_record_data.result    =   false;
                        p_record_data.msg       =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] DATE 컬럼이 존재하지 않습니다.";

                    }else if( String( p_param.p_data ).length != 8 ) {
                        p_param.p_column_check          =   false;

                        p_record_data.result    =   false;
                        p_record_data.msg       =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] DATE 컬럼은 8자리만 입력가능합니다.";   

                    }else{

                        try{
                            var year    =   Number( new String( p_param.p_data ).substring(0, 4));
                            var month   =   Number( new String( p_param.p_data ).substring(4, 6));
                            var day     =   Number( new String( p_param.p_data ).substring(6, 8));

                            var date    =   new Date( year, month-1, day );

                            if( p_param.p_data != date.getFullYear() + util.padZero( ( date.getMonth() + 1 ), 2 ) + util.padZero( date.getDate(), 2 ) ) {
                                p_param.p_column_check          =   false;

                                p_record_data.result            =   false;
                                p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] DATE 컬럼의 날짜가 정확한지 확인해 주세요.";
                            }
                        }catch(e) {

                            p_param.p_column_check          =   false;

                            p_record_data.result            =   false;
                            p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] DATE 컬럼이 날짜유형인지 확인해 주세요.";
                        }
                    }

                    break;            

        }
    }
}

/*
 * 엑셀 파일 사이즈를 체크한다.
 * 2019-09-06  bkLove(촤병국)
 */
function    fn_sizeCheck( file, gubun, resultMsg ){

    if( file ) {
        var title = "포트폴리오";
        var maxSize = limit.max_size;

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

/*
 * 파일을 삭제한다.
 * 2019-09-06  bkLove(촤병국)
 */
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


module.exports.uploadPortfolio = uploadPortfolio;