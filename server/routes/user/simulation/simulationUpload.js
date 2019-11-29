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
var _ = require("lodash");

var simulModule = require('./simulModule');

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
        resultMsg.p_start_year          =   "";

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
            var arrExcelJongmok         =   [];     /* 엑셀에서 업로드한 종목정보 */


            var v_param = {
                    p_count_check       :   true    /* 엑셀 건수 체크 */
                ,   p_column_check      :   true    /* 엑셀 컬럼 체크 */
                ,   p_record_check      :   true    /* 엑셀 레코드 체크 */
                ,   p_rebalance_file_yn :   "0"     /* 리밸런싱 샘플파일 유무 */
                ,   p_record_data       :   {}      /* 엑셀 레코드 데이터 */
                ,   p_index             :   0       /* 엑셀 index */
                ,   p_startIndex        :   0
            };                

            /* 엑셀파일을 파싱한다. */
            var workbook = xlsx.readFile(reqParam.uploadFolder + "/" + req.file.filename);
            var sheet_name_list = workbook.SheetNames;
            var dataLists = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: ["col01", "col02", "col03"], range: v_param.p_startIndex });        


            /* 엑셀 건수 체크 */
            if (dataLists.length <= 1) {
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
                    if( typeof dataLists[1].col01 != "undefined" ) {

                        var col01   =   dataLists[1].col01;

                        if( col01 != "" && ( String( col01 ).length == 8 || String( col01 ).length == 10 ) ) {
                            v_param.p_rebalance_file_yn     =   "1";
                        }
                    }
                }

                if( dataLists.length > 0 ) {
                    dataLists.splice( 0, 1 );
                }

                if( dataLists.length == 1 ) {

                    v_param.p_index         =   0;

                    /* 엑셀 레코드 밸리데이션을 수행한다. */
                    fn_excel_record_check( v_param, dataLists[0] );
                }else{

                    var dateCheck       =   [];
                    var jongmokCheck    =   [];
                    for (var i = 0; i < dataLists.length-1; i++) {
                        var data = dataLists[i];

                        /* 엑셀 레코드 밸리데이션을 수행한다. */
                        v_param.p_index         =   i;
                        fn_excel_record_check( v_param, data );


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

                deleteFile(reqParam);

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

                        /* 1. tm_date_manage 를 조회하여 리밸런싱 일자가 존재하는 경우 일자를 체크한다. */
                        function( callback ) {

                            try {
                                
                                var msg         =   {};

                                /* 리밸런싱 샘플 파일인 경우 2000 년도 부터 영업일을 조회한다. */
                                if( v_param.p_rebalance_file_yn == "1" ) {
                                    reqParam.start_year             =   "2000";     /* 시작년도 */
                                    reqParam.rebalance_cycle_cd     =   "0";        /* 리밸런싱 주기 */
                                    reqParam.rebalance_date_cd      =   "0";        /* 리밸런싱 일자 코드 */
                                }

                                stmt = mapper.getStatement( "simulation", "getRebalanceDate", reqParam, format);
                                log.debug(stmt, reqParam);

                                conn.query(stmt, function(err, rows) {
                                    try {

                                        resultMsg.result = true;
                                        resultMsg.msg = "";                    

                                        if (err) {
                                            log.error(err, stmt, reqParam);

                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }
                                        else if ( !rows || rows.length == 0 )  {

                                            log.error(err, stmt, reqParam);

                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = "[error] simulation.getRebalanceDate 일자 기본정보가 없습니다.";

                                            return callback(resultMsg);
                                        }



                                    /**********************************************************************************************
                                     * 리밸런싱 일자가 포함된 파일인 경우 2000년 이전, 현재일자 이후, 영업일에 포함되는지 체크 START
                                     **********************************************************************************************/
                                        if( v_param.p_rebalance_file_yn == "1" ) {

                                            var arrOrgDate  =   [];
                                            for( var i=0 ; i < rows.length; i++ ) {
                                                arrOrgDate.push({
                                                    date    :   rows[i].F12506
                                                })
                                            }

                                            var arrDiffDate =   _.differenceWith( arrExcelRebalanceDate, arrOrgDate, _.isEqual );

                                            if( arrDiffDate && arrDiffDate.length > 0 ) {

                                                for( var i=0 ; i < arrDiffDate.length; i++ ) {

                                                    if( Number( arrDiffDate[i].date ) < 20000101 ) {
                                                        resultMsg.errorList.push( { 
                                                                result  :   false
                                                            ,   msg     :   "2000 년도 이전 날짜 ( " + arrDiffDate[i].date + " )  가 존재합니다."
                                                        });
                                                    }
                                                    else if( arrDiffDate[i].date > util.getTodayDate() ) {
                                                        resultMsg.errorList.push( { 
                                                                result  :   false
                                                            ,   msg     :   "현재일 이후 날짜 ( " + arrDiffDate[i].date + " )  가 존재합니다."
                                                        });
                                                    }
                                                    else{
                                                        resultMsg.errorList.push( { 
                                                                result  :   false
                                                            ,   msg     :   "영업일에 포함되지 않은 일자 ( " + arrDiffDate[i].date + " )  가 존재합니다."
                                                        });
                                                    }                                                    

                                                    /* 10 개 까지만 결과정보에 보관한다. */
                                                    if( resultMsg.errorList.length == 10  ) {
                                                        break;
                                                    }
                                                }
                                            }
                                            

                                            if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
                                                resultMsg.result = false;
                                                
                                                return  callback(resultMsg);
                                            }
                                        }
                                    /**********************************************************************************************
                                     * 리밸런싱 일자가 포함된 파일인 경우 2000년 이전, 현재일자 이후, 영업일에 포함되는지 체크 END
                                     **********************************************************************************************/



                                        /* 리밸런싱 샘플 파일인 경우 리밸런싱 일자 콤보에 노출할 정보 구성 */
                                        if( v_param.p_rebalance_file_yn == "1" ) {

                                            for( var i=0; i < rows.length; i++ ) {

                                                var filterData  =   _.filter(  arrExcelRebalanceDate, function(o) {
                                                    return  o.date  ==   rows[i].F12506
                                                });


                                                if( filterData && filterData.length > 0 ) {

                                                    resultMsg.arr_rebalance_date.push( { 
                                                            "text"  :   rows[i].fmt_F12506
                                                        ,   "value" :   rows[i].F12506 
                                                    });
                                                }
                                            }

                                        }
                                        /* 리밸런싱 일자가 없는 경우 최초일만 보관 */
                                        else{

                                            resultMsg.arr_rebalance_date.push( { 
                                                    "text" : rows[0].fmt_F12506
                                                ,   "value" : rows[0].F12506 
                                            } );
                                        }


                                        log.debug( 
                                                "\n"
                                            ,   "#############################################################"
                                            ,   "\n"
                                            ,   "resultMsg.arr_rebalance_date"
                                            ,   "\n"
                                            ,   resultMsg.arr_rebalance_date
                                            ,   "\n"
                                            ,   "#############################################################" 
                                        );


                                        /* 엑셀 업로드를 통해 start_year 년도 추출 */
                                        if( resultMsg.arr_rebalance_date && resultMsg.arr_rebalance_date.length > 0 ) {

                                            var v_min_obj   =   _.minBy( resultMsg.arr_rebalance_date, function(o){
                                                return  o.value
                                            });

                                            if( v_min_obj && Object.keys( v_min_obj ).length > 0 ) {
                                                if( v_min_obj.value && v_min_obj.value.length > 4 ) {
                                                    msg.p_start_year    =   v_min_obj.value.substring( 0, 4 );
                                                }
                                            }
                                        }                                        


                                        callback(null, msg);

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

                        /* 2. kspjong_basic 을 조회하여 종목이 존재하는지 체크한다. */
                        function( msg, callback) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

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


                                        callback(null, msg);

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

                        /* 3. kspjong_basic 에 존재하지 않을시 etp_basic 을 조회하여 종목이 존재하는지 체크한다. */
                        function( msg, callback) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

                                
                                /* kspjong_basic 에 존재하지 않는 종목이 존재하는 경우 */
                                if( msg.arrExcelJongmokNotExist && msg.arrExcelJongmokNotExist.length > 0 ) {

                                    stmt = mapper.getStatement('simulation', 'getEtpBasic', reqParam, format);
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
                                                resultMsg.err = "[error] simulation.getEtpBasic 종목 기본정보가 없습니다.";

                                                return callback(resultMsg);
                                            }


                                        /**********************************************************************************************
                                         * ept_basic 에 존재하는지 체크 START
                                         **********************************************************************************************/
                                            for( var i=0 ; i < msg.arrExcelJongmokNotExist.length; i++ ) {

                                                var filterData  =   _.filter( rows, function(o) {

                                                    /* 단축코드 */
                                                    if( msg.arrExcelJongmokNotExist[i].code.length == 6 ) {
                                                        return  o.F16013 == msg.arrExcelJongmokNotExist[i].code;
                                                    }
                                                    /* 국제표준코드 */
                                                    else{
                                                        return  o.F16012 == msg.arrExcelJongmokNotExist[i].code;
                                                    }
                                                });


                                                /* 일치하는 코드가 없는 경우 */
                                                if( !filterData || filterData.length == 0 ) {
                                                    resultMsg.errorList.push( { 
                                                            result  :   false
                                                        ,   msg     :   "[" + msg.arrExcelJongmokNotExist[i].row_no + " 행] CODE 컬럼 값 (" + msg.arrExcelJongmokNotExist[i].code + ") 이 존재하지 않습니다."
                                                    });                                                    
                                                }
                                                /* etp_basic 에 코드가 중복존재하는 경우 */
                                                else if( filterData && filterData.length > 1 ){
                                                    resultMsg.errorList.push( { 
                                                            result  :   false
                                                        ,   msg     :   "[" + msg.arrExcelJongmokNotExist[i].row_no + " 행] CODE 컬럼 값 (" + msg.arrExcelJongmokNotExist[i].code + ") 이 중복 존재합니다."
                                                    });
                                                }

                                                /* 10 개 까지만 결과정보에 보관한다. */
                                                if( resultMsg.errorList.length == 10  ) {
                                                    break;
                                                }
                                            }
                                        /**********************************************************************************************
                                         * ept_basic 에 존재하는지 체크 END
                                         **********************************************************************************************/

                                            if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
                                                resultMsg.result = false;
                                                
                                                return  callback(resultMsg);
                                            }


                                            /* ept_basic 과 일치하는 코드에 대해 데이터 설정 */
                                            for (var i = 0; i < dataLists.length; i++) {

                                                var data    =   dataLists[i];

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


                                            callback(null, msg);

                                        } catch (err) {

                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return  callback(resultMsg);
                                        }                                    
                                    });

                                }else{

                                    callback(null, msg);
                                }

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        },

                        /* 4. 리밸런싱 일자별, 코드별로 포트폴리오 데이터를 설정한다. */
                        function( msg, callback ) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }


                                /* 일자, 엑셀 행번호 순으로 정렬 */
                                dataLists  =   _.orderBy( dataLists, [ 'date', 'row_no' ] );


                            /**********************************************************************************************
                             * 리밸런싱 일자별, 코드별로 포트폴리오 데이터 설정 START
                             **********************************************************************************************/
                                var v_order_no  =   0;
                                for( var i=0; i < dataLists.length; i++ ) {

                                    var data    =   dataLists[i];

                                    if( !rebalancePortfolioObj[ data.date ] || Object.keys( rebalancePortfolioObj[ data.date ] ).length == 0  ) {
                                        rebalancePortfolioObj[ data.date ]                          =   {};
                                        v_order_no  =   0;
                                    }

                                    if( !rebalancePortfolioObj[ data.date ][ data.F16013 ] || Object.keys( rebalancePortfolioObj[ data.date ][ data.F16013 ] ).length == 0  ) {
                                        rebalancePortfolioObj[ data.date ][ data.F16013 ]           =   {};
                                    }

                                    rebalancePortfolioObj[ data.date ][ data.F16013 ].F16013        =   data.F16013;        /* 단축코드 */
                                    rebalancePortfolioObj[ data.date ][ data.F16013 ].F16002        =   data.F16002;        /* 종목명 */
                                    rebalancePortfolioObj[ data.date ][ data.F16013 ].F15028        =   data.F15028;        /* 시가총액 */
                                    rebalancePortfolioObj[ data.date ][ data.F16013 ].importance    =   data.allocation;    /* 엑셀에서 입력한 비중 */

                                    rebalancePortfolioObj[ data.date ][ data.F16013 ].order_no      =   v_order_no;         /* 정렬순번 */
                                    rebalancePortfolioObj[ data.date ][ data.F16013 ].trIndex       =   v_order_no;         /* 테이블 레코드 순번 */

                                    v_order_no++;
                                }
                            /**********************************************************************************************
                             * 리밸런싱 일자별, 코드별로 포트폴리오 데이터 설정 END
                             **********************************************************************************************/

                                resultMsg.result = true;

                                resultMsg.rebalancePortfolioObj     =   rebalancePortfolioObj;
                                resultMsg.p_rebalance_file_yn       =   v_param.p_rebalance_file_yn;
                                resultMsg.p_start_year              =   msg.p_start_year;

                                console.log( "######## resultMsg.p_start_year", resultMsg.p_start_year );

                                callback(null);

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
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


/*
 * 엑셀 레코드 밸리데이션을 수행한다.
 * 2019-09-06  bkLove(촤병국)
 */

function    fn_excel_record_check( p_param={ p_column_check : true, p_record_check : true, p_rebalance_file_yn : "0", p_index : 0, p_startIndex : 0, p_time_series_yn : "0" }, p_record_data={} ){

    try{

        if( p_record_data && Object.keys( p_record_data ).length > 0 ) {

            /* 시계열 업로드 파일인 경우 */
            if( typeof p_param.p_time_series_yn != "undefined" && p_param.p_time_series_yn == "1" ) {

                /* DATE 체크 */
                p_param.p_column                =   "DATE";
                p_param.p_data                  =   p_record_data.col01;
                fn_excel_column_check( p_param, p_record_data );

                if( !p_param.p_column_check ) {
                    p_param.p_record_check      =   false;
                }else{

                    /* INDEX_RATE 값이 비이 있을시 0으로 디폴트값 설정 */
                    if( typeof p_record_data.col02 == "undefined" || p_record_data.col02 == "" ) {
                        p_record_data.col02 =   "0";
                    }

                    /* INDEX_RATE 체크 */
                    p_param.p_column            =   "INDEX_RATE";
                    p_param.p_data              =   p_record_data.col02;
                    fn_excel_column_check( p_param, p_record_data );

                    if( !p_param.p_column_check ) {
                        p_param.p_record_check      =   false;
                    }
                }

                if( p_param.p_column_check ) {
                    p_record_data.date          =   String( p_record_data.col01 );
                    p_record_data.F12506        =   p_record_data.date;
                    p_record_data.INDEX_RATE    =   Number( p_record_data.col02 );
                }

            }else{

                /* 리밸런싱 파일이 아닌 경우 */
                if( p_param.p_rebalance_file_yn == "0" ) {

                    /* CODE 체크 */
                    p_param.p_column                =   "CODE";
                    p_param.p_data                  =   p_record_data.col01;
                    fn_excel_column_check( p_param, p_record_data );

                    if( !p_param.p_column_check ) {
                        p_param.p_record_check      =   false;
                    }else{

                        /* ALLOCATION 값이 비이 있을시 0으로 디폴트값 설정 */
                        if( typeof p_record_data.col02 == "undefined" || p_record_data.col02 == "" ) {
                            p_record_data.col02 =   "0";
                        }

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

                            /* ALLOCATION 값이 비이 있을시 0으로 디폴트값 설정 */
                            if( typeof p_record_data.col03 == "undefined" || p_record_data.col03 == "" ) {
                                p_record_data.col03 =   "0";
                            }

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
    }catch(e){
        log.error( e );        
    }
}

/*
 * 엑셀 레코드 밸리데이션을 수행한다.
 * 2019-09-06  bkLove(촤병국)
 */

function    fn_excel_column_check( p_param={ p_column_check : true, p_column : "", p_rebalance_file_yn : "0", p_data : "", p_index : 0, p_startIndex : 0 }, p_record_data={} ){

    try{
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

                        }else if( !( String( p_param.p_data ).length == 8 || String( p_param.p_data ).length == 10 ) ) {
                            p_param.p_column_check          =   false;

                            p_record_data.result    =   false;
                            p_record_data.msg       =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] DATE 컬럼은 ( YYYYMMDD 또는 YYYY.MM.DD ) 형태로 입력 해 주세요.";   

                        }else{

                            try{

                                var year    =   null;
                                var month   =   null;
                                var day     =   null;


                                p_record_data.col01     =   String( p_record_data.col01 ).replace( /(\.)|(\-)|(\/)/g, "" );
                                p_param.p_data          =   p_record_data.col01;

                                if( String( p_param.p_data ).length == 8 ) {
                                    year    =   Number( String( p_param.p_data ).substring(0, 4));
                                    month   =   Number( String( p_param.p_data ).substring(4, 6));
                                    day     =   Number( String( p_param.p_data ).substring(6, 8));
                                }else if( String( p_param.p_data ).length == 10 ) {
                                    year    =   Number( String( p_param.p_data ).substring(0, 4));
                                    month   =   Number( String( p_param.p_data ).substring(5, 7));
                                    day     =   Number( String( p_param.p_data ).substring(8, 10));
                                }

                                var date    =   new Date( year, month-1, day );

                                if( p_param.p_data != date.getFullYear() + util.padZero( ( date.getMonth() + 1 ), 2 ) + util.padZero( date.getDate(), 2 ) ) {
                                    p_param.p_column_check          =   false;

                                    p_record_data.result            =   false;
                                    p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] DATE 컬럼의 날짜가 정확한지 확인해 주세요.";
                                }
                            }catch(e) {

                                p_param.p_column_check          =   false;

                                p_record_data.result            =   false;
                                p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] DATE 컬럼은 ( YYYYMMDD 또는 YYYY.MM.DD ) 형태로 입력 해 주세요.";
                            }
                        }

                        break;

                case    "INDEX_RATE"  :

                        if (typeof p_param.p_data == "undefined") {
                            p_param.p_column_check          =   false;

                            p_record_data.result            =   false;
                            p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] INDEX_RATE 컬럼이 존재하지 않습니다.";

                        }else{
                        
                            try{
                                var temp = Number( p_param.p_data );

                                if( isNaN( temp ) ) {
                                    p_param.p_column_check          =   false;

                                    p_record_data.result            =   false;
                                    p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] INDEX_RATE 컬럼은 숫자형만 입력해 주세요.";                                
                                }
                            }catch(e) {
                                p_param.p_column_check          =   false;

                                p_record_data.result            =   false;
                                p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] INDEX_RATE 컬럼은 숫자형만 입력해 주세요.";
                            }

                            if( p_param.p_column_check ) {
                                if ( Number( p_param.p_data ) < 0 || Number( p_param.p_data ) > 10000 ) {
                                    p_param.p_column_check          =   false;

                                    p_record_data.result            =   false;
                                    p_record_data.msg               =   "[" + (p_param.p_index + p_param.p_startIndex + 1) + " 행] INDEX_RATE 컬럼은 0 ~ 10000 사이만 입력해 주세요.";
                                }
                            }
                        }

                        break;

            }
        }

    }catch(e){
        log.error( e );
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


/*
 * 시계열을 업로드 한다.
 * 2019-09-06  bkLove(촤병국)
 */
var uploadTimeSeries = function(req, res) {
    log.debug('simulationUpload.uploadTimeSeries 호출됨.');

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

        log.debug("#1 simulationUpload.uploadTimeSeries upload start");

        if (err) {
            log.error("#1 simulationUpload.uploadTimeSeries upload Error", err);
        }


        resultMsg.errorList             =   [];
        resultMsg.simul_mast            =   {};
        resultMsg.arr_daily             =   [];

        try {
            reqParam.org_file_name = req.file.originalname;
            reqParam.mime_type = req.file.mimetype;
            reqParam.file_size = req.file.size;


            fn_sizeCheck( req.file, "file", resultMsg );

            var paramData = JSON.parse(req.body.data);

            paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
            paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
            paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
            paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
            paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );            


            var arrExcelDate            =   [];     /* 엑셀에서 업로드한 일자정보 */

            var v_param = {
                    p_count_check       :   true    /* 엑셀 건수 체크 */
                ,   p_column_check      :   true    /* 엑셀 컬럼 체크 */
                ,   p_record_check      :   true    /* 엑셀 레코드 체크 */
                ,   p_record_data       :   {}      /* 엑셀 레코드 데이터 */
                ,   p_index             :   0       /* 엑셀 index */
                ,   p_startIndex        :   1
                ,   p_time_series_yn    :   "1"
            };                

            /* 엑셀파일을 파싱한다. */
            var workbook = xlsx.readFile(reqParam.uploadFolder + "/" + req.file.filename);
            var sheet_name_list = workbook.SheetNames;
            var dataLists = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: ["col01", "col02"], range: v_param.p_startIndex });        


            /* 엑셀 건수 체크 */
            if (dataLists.length == 0) {
                v_param.p_count_check   =   false;

                resultMsg.result        =   false;
                resultMsg.msg           =   "레코드는 1건 이상 존재해야 합니다.";

            } else {

                if( dataLists.length == 1 ) {

                    v_param.p_index             =   0;

                    /* 엑셀 레코드 밸리데이션을 수행한다. */
                    fn_excel_record_check( v_param, dataLists[0] );
                }else{

                    var dateCheck       =   [];
                    for (var i = 0; i < dataLists.length-1; i++) {
                        var data = dataLists[i];

                        /* 엑셀 레코드 밸리데이션을 수행한다. */
                        v_param.p_index             =   i;
                        fn_excel_record_check( v_param, data );


                        /* 날짜 */
                        dateCheck   =   arrExcelDate.filter( function( item, index, array ) {
                            return  item.date == String( data.date );
                        });

                        if( !dateCheck || dateCheck.length == 0 ) {
                            arrExcelDate.push( { date : data.date } );
                        }

                        for (var j = i+1; j < dataLists.length; j++) {
                            var data2 = dataLists[j];

                            /* 엑셀 레코드 밸리데이션을 수행한다. */
                            v_param.p_index             =   j;
                            fn_excel_record_check( v_param, data2 );                            

                            if( v_param.p_record_check ) {

                                if( data.date == data2.date ) {
                                    v_param.p_record_check  =   false;

                                    data.result             =   false;
                                    data.msg                =   "[" + ( i + v_param.p_startIndex + 1 ) + " 행] 과 [" + ( j + v_param.p_startIndex + 1 ) + " 행] DATE 컬럼이 중복 존재합니다.";
                                }
                            }
                        }

                        data.row_no         =   i + v_param.p_startIndex;
                        data.rebalancing    =   "0";                /* 리밸런싱 여부(Y,N)-COM010 */
                        data.F15028_S       =   0;                  /* 기준시총 */
                        data.F15028_C       =   0;                  /* 비교시총 */

                        /* 마지막 전 인덱스인 경우 */
                        if( i == dataLists.length-2 ) {

                            /* 마지막 레코드에 row_no 추가 */
                            data                =   dataLists[i+1];
                            data.row_no         =   i + v_param.p_startIndex + 1;
                            data.rebalancing    =   "0";            /* 리밸런싱 여부(Y,N)-COM010 */
                            data.F15028_S       =   0;              /* 기준시총 */
                            data.F15028_C       =   0;              /* 비교시총 */

                            /* 날짜 */
                            dateCheck   =   arrExcelDate.filter( function( item, index, array ) {
                                return  item.date == String( data.date );
                            });

                            if( !dateCheck || dateCheck.length == 0 ) {
                                arrExcelDate.push( { date : data.date } );
                            }
                        }
                    }
                }
            }


            /* 건수 체크 와 레코드 체크 결과 정상이 아닌 경우 오류 노출 */
            if ( !v_param.p_count_check || !v_param.p_record_check ) {

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

                deleteFile(reqParam);

                resultMsg.record_check          =   v_param.p_record_check;
                resultMsg.count_check           =   v_param.p_count_check;
                resultMsg.result = false;

                res.json(resultMsg);
                res.end();

            } else {


                var format = { language: 'sql', indent: '' };
                var stmt = "";
				Promise.using(pool.connect(), conn => {

					conn.beginTransaction(txerr => {

						if (txerr) {
							return log.error(txerr);
						}            

						async.waterfall([

                            /* 1. 시나리오명이 존재하는지 체크한다. */
                            function(callback) {

                                try{
                                    var msg         =   {};
                                    var exist_yn    =   "Y";

                                    paramData.changeGrpCdYn     =   "0";
                                    paramData.prevChangeGrpCdYn =   "0";

                                    /* 기존에 등록된 prev_scen_cd 가 없는 경우 ( 신규 건 ) */
                                    if( typeof paramData.prev_scen_cd == "undefined" || paramData.prev_scen_cd == "" ) {
                                        paramData.status    =   "insert";
                                    }else{
                                        paramData.status    =   "modify";
                                    }

                                    /* 수정 건 이고 상위 그룹이 변경된 경우 */
                                    if(     paramData.status        ==  "modify"
                                        &&  paramData.prev_grp_cd   !=  paramData.grp_cd ) {

                                        paramData.changeGrpCdYn     =   "1";
                                        paramData.prevChangeGrpCdYn =   "1";
                                    }

                                    stmt = mapper.getStatement('simulation', 'getExistScenName', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if ( rows && rows.length == 1) {
                                            exist_yn   =   rows[0].exist_yn;
                                        }

                                        if( exist_yn == "Y" ) {
                                            resultMsg.result = false;
                                            resultMsg.msg   = "시나리오명이 이미 존재합니다.";
                                            resultMsg.err   = "시나리오명이 이미 존재합니다.";

                                            return callback(resultMsg);                                    
                                        }

                                        callback(null, msg);
                                    });

                                } catch (err) {

                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    callback(resultMsg);
                                }
                            },                            

							/* 2. tm_date_manage 를 조회하여 일자를 체크한다. */
							function( msg, callback ) {

								try {
									
									if( !msg || Object.keys( msg ).length == 0 ) {
										msg = {};
									}

									paramData.start_year             =   "2000";     /* 시작년도 */
									paramData.rebalance_cycle_cd     =   "0";        /* 리밸런싱 주기 */
									paramData.rebalance_date_cd      =   "0";        /* 리밸런싱 일자 코드 */

									stmt = mapper.getStatement( "simulation", "getRebalanceDate", paramData, format);
									log.debug(stmt, paramData);

									conn.query(stmt, function(err, rows) {
										try {

											resultMsg.result = true;
											resultMsg.msg = "";                    

											if (err) {
												log.error(err, stmt, paramData);

												resultMsg.result = false;
												resultMsg.msg = config.MSG.error01;
												resultMsg.err = err;

												return callback(resultMsg);
											}
											else if ( !rows || rows.length == 0 )  {

												log.error(err, stmt, paramData);

												resultMsg.result = false;
												resultMsg.msg = config.MSG.error01;
												resultMsg.err = "[error] simulation.getRebalanceDate 일자 기본정보가 없습니다.";

												return callback(resultMsg);
											}



										/**********************************************************************************************
										 * 2000년 이전, 현재일자 이후, 영업일에 포함되는지 체크 START
										 **********************************************************************************************/
											var arrOrgDate  =   [];
											for( var i=0 ; i < rows.length; i++ ) {
												arrOrgDate.push({
													date    :   rows[i].F12506
												})
											}

											var arrDiffDate =   _.differenceWith( arrExcelDate, arrOrgDate, _.isEqual );

											if( arrDiffDate && arrDiffDate.length > 0 ) {

												for( var i=0 ; i < arrDiffDate.length; i++ ) {

													if( Number( arrDiffDate[i].date ) < 20000101 ) {
														resultMsg.errorList.push( { 
																result  :   false
															,   msg     :   "2000 년도 이전 날짜 ( " + arrDiffDate[i].date + " )  가 존재합니다."
														});
													}
													else if( arrDiffDate[i].date > util.getTodayDate() ) {
														resultMsg.errorList.push( { 
																result  :   false
															,   msg     :   "현재일 이후 날짜 ( " + arrDiffDate[i].date + " )  가 존재합니다."
														});
													}
													else{
														resultMsg.errorList.push( { 
																result  :   false
															,   msg     :   "영업일에 포함되지 않은 일자 ( " + arrDiffDate[i].date + " )  가 존재합니다."
														});
													}                                                    

													/* 10 개 까지만 결과정보에 보관한다. */
													if( resultMsg.errorList.length == 10  ) {
														break;
													}
												}
											}
											

											if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
												resultMsg.result = false;
												
												return  callback(resultMsg);
											}
										/**********************************************************************************************
										 * 2000년 이전, 현재일자 이후, 영업일에 포함되는지 체크 END
										 **********************************************************************************************/


											/* 엑셀 업로드를 통해 start_year 년도 추출 */
											if( arrExcelDate && arrExcelDate.length > 0 ) {

												var v_min_obj   =   _.minBy( arrExcelDate, function(o){
													return  o.date
												});

												if( v_min_obj && Object.keys( v_min_obj ).length > 0 ) {
													if( v_min_obj.date && v_min_obj.date.length > 4 ) {
														msg.p_start_year    =   v_min_obj.date.substring( 0, 4 );
													}

                                                    msg.first_date  =   v_min_obj.date;
												}
											}                                        


											callback(null, msg);

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

							/* 3. 시뮬레이션 시나리오 코드를 채번한다. */
							function(msg, callback) {

								try{

									if( !msg || Object.keys( msg ).length == 0 ) {
										msg = {};
									}

                                    /* modify 상태이고 상위그룹이 변경되지 않는 경우 기존 scen_cd 사용 */
                                    if(     paramData.status        ==  "modify"
                                        &&  paramData.prev_grp_cd   ==  paramData.grp_cd  ) {

                                            callback(null, msg);

                                    }else{

                                        paramData.init_incre_grp_cd      =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
                                        stmt = mapper.getStatement('simulation', "getScenCd1", paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            if (rows && rows.length == 1) {
                                                paramData.scen_cd = rows[0].scen_cd;
                                            }

                                            callback(null, msg);
                                        });
                                    }

								} catch (err) {

									resultMsg.result = false;
									resultMsg.msg = config.MSG.error01;
									resultMsg.err = err;

									callback(resultMsg);
								}
							},

							/* 4. 시뮬레이션 시나리오 정렬순번을 조회한다. */
							function(msg, callback) {

								try{

									if( !msg || Object.keys( msg ).length == 0 ) {
										msg = {};
									}

                                    paramData.grp_yn            =   "0";                        

									if( !paramData.grp_cd || !paramData.scen_cd ) {
										resultMsg.result = false;
										resultMsg.msg = config.MSG.error01;
										resultMsg.err = config.MSG.error01;

										callback( resultMsg );

									}else{

                                        /* 신규 건 이거나 상위 그룹이 변경된 경우 정렬순번 조회 */
                                        if(     paramData.status        ==  "insert"
                                            ||  paramData.prev_grp_cd   !=  paramData.grp_cd  
                                        ) {
                                            stmt = mapper.getStatement('simulation', 'getScenOrderNo', paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if (rows && rows.length == 1) {
                                                    paramData.scen_order_no     =   rows[0].scen_order_no;
                                                }

                                                callback(null, msg);
                                            });

                                        }else{
                                            callback(null, msg);
                                        }
									}

								} catch (err) {

									resultMsg.result = false;
									resultMsg.msg = config.MSG.error01;
									resultMsg.err = err;

									callback(resultMsg);
								}
							},

                            /* 5. 현재 serialNo 를 구한다.  */
                            function( msg, callback) {

                                try{

                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }

                                    stmt = mapper.getStatement('simulation', 'getSerialNo', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if ( !rows || rows.length != 1 ) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            callback(resultMsg, msg);
                                        }else{

                                            msg.now_serial_no       =   Number( rows[0].serial_no );

                                            callback(null, msg);
                                        }
                                        
                                    });

                                } catch (err) {

                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    callback(resultMsg);
                                }
                            },

                            /* 6. 변경전 시나리오의 상위 그룹 정보를 조회한다. */
                            function( msg, callback) {

                                try {

                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }

                                    msg.v_simul_upper_grp       =   {};

                                    /* 그룹변경이 없는 경우 */
                                    if( paramData.changeGrpCdYn == "0" ) {
                                        callback(null, msg);

                                    }else{
                                        stmt = mapper.getStatement('simulation', "getUpperGrp", paramData, format);
                                        log.debug(stmt);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            if ( rows && rows.length == 1 ) {
                                                msg.v_simul_upper_grp       =   rows[0];
                                            }

                                            callback(null, msg);
                                        });
                                    }

                                } catch (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }
                            },                            

							/* 7. 시뮬레이션 기본 정보를 저장한다. */
							function( msg, callback ) {

								try{

									if( !msg || Object.keys( msg ).length == 0 ) {
										msg = {};
									}


                                    if( typeof msg.now_serial_no == "undefined" || msg.now_serial_no == null ) {
                                        msg.now_serial_no   =   0;
                                    }

                                    var queryId =   "saveTmSimulMast";

                                    if( paramData.status  ==  "modify" ) {
                                        queryId =   "modifyTmSimulMast";
                                    }

                                    if( typeof msg.p_start_year != "undefined" ) {
									    paramData.start_year        =   msg.p_start_year;       /* 시작년도 */
                                    }
									paramData.rebalance_cycle_cd    =   null;                   /* 리밸런싱 주기 */
									paramData.rebalance_date_cd     =   null;                   /* 리밸런싱 일자 코드 */

									paramData.scen_depth     		=   "2";                    /* 시나리오 DEPTH */
									paramData.importance_method_cd	=   "1";                    /* 비중설정방식 (COM009) */
                                    paramData.serial_no             =   msg.now_serial_no + 1;  /* 변경 순번 */
									paramData.stock_gubun			=   "1"; 	                /* 주식수 구분 (COM013) */
                                    paramData.time_series_upload_yn =   "1";                    /* 시계열 업로드 여부 */


									stmt = mapper.getStatement('simulation', queryId, paramData, format);
									log.debug(stmt, paramData);

									conn.query(stmt, function(err, rows) {

										if (err) {
											resultMsg.result = false;
											resultMsg.msg = config.MSG.error01;
											resultMsg.err = err;

											return callback(resultMsg);
										}

                                        resultMsg.simul_mast    =   Object.assign( {}, paramData );

										callback(null, msg);
										
									});

								} catch (err) {

									resultMsg.result = false;
									resultMsg.msg = config.MSG.error01;
									resultMsg.err = err;

									callback(resultMsg);
								}
							},

							/* 8. [tm_simul_result_mast] 테이블에 등록한다. */
							function(msg, callback) {

								try{

									if( !msg || Object.keys( msg ).length == 0 ) {
										msg = {};
									}

                                    var queryId =   "saveTmSimulResultMast";

                                    if( paramData.status  ==  "modify" ) {
                                        queryId =   "modifyTmSimulResultMast";
                                    }

									stmt = mapper.getStatement('simulationBacktest', queryId, paramData, { language: 'sql', indent: '  ' });
									log.debug(stmt, paramData);

									conn.query(stmt, function(err, rows) {

										if (err) {
											resultMsg.result = false;
											resultMsg.msg = config.MSG.error01;
											resultMsg.err = err;

											return callback(resultMsg);
										}

										callback(null, msg);
									});

								} catch (err) {

									resultMsg.result = false;
									resultMsg.msg = config.MSG.error01;
									resultMsg.err = err;

									callback(resultMsg);
								}
							},

                            /* 9. 변경할 대상이 상위 그룹이 있는 경우 - 변경전 시나리오 공유자 정보를 조회한다. */
                            function( msg, callback) {

                                try {

                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }

                                    msg.v_simul_prev_share      =   [];


                                    if( paramData.changeGrpCdYn == "0" ) {
                                        callback(null, msg);

                                    }else{

                                        /* 변경할 대상이 상위그룹인 경우 */
                                        if( paramData.org_grp_yn == "1" ) {

                                            paramData.changeGrpCdYn     =   "1";
                                            stmt = mapper.getStatement('simulation', "getUserListInCheckedSimulation", paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if( rows && rows.length > 0  ) {
                                                    msg.v_simul_prev_share      =   rows;
                                                }

                                                paramData.changeGrpCdYn     =   paramData.prevChangeGrpCdYn;

                                                callback(null, msg);
                                            });

                                        }else{
                                            callback(null, msg);
                                        }
                                    }

                                } catch (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }
                            },

                            /* 10. 변경할 대상이 상위 그룹이 있는 경우 - 변경할 그룹 공유자 정보를 조회한다. */
                            function( msg, callback) {

                                try {

                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }

                                    msg.v_simul_share_upper     =   [];


                                    if( paramData.changeGrpCdYn == "0" ) {
                                        callback(null, msg);

                                    }else{

                                        /* 변경할 대상이 상위 그룹이 있는 경우 */
                                        if( paramData.org_grp_yn == "1" ) {

                                            paramData.changeGrpCdYn     =   "0";
                                            paramData.upper_grp_cd      =   "*";
                                            paramData.upper_scen_cd     =   paramData.grp_cd;
                                            stmt = mapper.getStatement('simulation', "getSimulShareUpperGrp", paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if( rows && rows.length > 0  ) {
                                                    msg.v_simul_share_upper     =   rows;
                                                }

                                                paramData.changeGrpCdYn     =   paramData.prevChangeGrpCdYn;

                                                callback(null, msg);
                                            });

                                        }else{
                                            callback(null, msg);
                                        }
                                    }

                                } catch (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }
                            },

                            /* 11. 변경할 대상이 상위 그룹이 있는 경우 - 그룹 공유자 정보를 설정한다. */
                            function( msg, callback) {

                                try {

                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }


                                    msg.arr_insert_list     =   [];


                                    if( paramData.changeGrpCdYn == "1" ) {

                                        /* 변경할 대상이 상위 그룹이 있는 경우 - (변경전) 시나리오 공유자가 존재하는 경우  */
                                        if( typeof msg.v_simul_prev_share != "undefined" && msg.v_simul_prev_share.length > 0 ) {

                                            /* 변경할 대상이 상위 그룹이 있는 경우 - (변경할) 그룹 공유자가 존재하는 경우  */
                                            if( typeof msg.v_simul_share_upper != "undefined" && msg.v_simul_share_upper.length > 0 ) {

                                                msg.v_simul_prev_share.forEach( function( item, index, array) {

                                                    var v_check_data    =   _.filter( msg.v_simul_share_upper, {
                                                            'email'     :   item.email
                                                    });

                                                    if( typeof v_check_data == "undefined" || v_check_data.length == 0 ) {

                                                        msg.arr_insert_list.push({
                                                                "grp_cd"        :   paramData.upper_grp_cd
                                                            ,   "scen_cd"       :   paramData.upper_scen_cd
                                                            ,   "email"         :   item.email
                                                            ,   "owner_yn"      :   item.owner_yn
                                                        });                                            
                                                    }

                                                });

                                                paramData.arr_insert_list   =   msg.arr_insert_list;
                                                
                                            }else{
                                                paramData.arr_insert_list  =    msg.v_simul_prev_share;
                                            }
                                        }
                                    }


                                    if( !paramData.arr_insert_list || paramData.arr_insert_list.length == 0 ) {
                                        callback(null, msg);

                                    }else{
                                        stmt = mapper.getStatement('simulation', "saveShareUserInArr", paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }


                                            if( rows ) {
                                                log.debug( "simulation.saveShareUserInArr ( 기존 시나리오 공유자 -> 그룹 공유자 ) success" );
                                            }

                                            paramData.arr_insert_list   =   [];

                                            callback(null, msg);
                                        });
                                    }

                                } catch (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }
                            },

                            /* 12. 변경전 대상이 상위 그룹이 있는 경우 - 변경전 그룹에 속하지 않는 삭제 대상 공유자를 조회한다. */
                            function( msg, callback) {

                                try {

                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }


                                    msg.v_arr_simul_share_not_in_group      =   [];


                                    if( paramData.changeGrpCdYn == "0" ) {
                                        callback(null, msg);

                                    }else{

                                        /* 변경전 대상이 상위그룹이 있는 경우 */
                                        if( typeof msg.v_simul_upper_grp == "undefined" || Object.keys( msg.v_simul_upper_grp ).length == 0 ) {
                                            callback(null, msg);

                                        }else{

                                            paramData.prev_upper_grp_cd     =   msg.v_simul_upper_grp.grp_cd;
                                            paramData.prev_upper_scen_cd    =   msg.v_simul_upper_grp.scen_cd;
                                            stmt = mapper.getStatement('simulation', "getSimulShareNotInGroupForDelelete", paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if( rows && rows.length > 0 ) {
                                                    msg.v_arr_simul_share_not_in_group  =   rows;
                                                }

                                                callback(null, msg);
                                            });
                                        }
                                    }

                                } catch (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }
                            },

                            /* 13. 변경전 대상이 상위 그룹이 있는 경우 - 변경전 그룹에 속하지 않는 삭제 대상 공유자를 삭제한다. */
                            function( msg, callback) {

                                try {

                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }

                                    if( paramData.changeGrpCdYn == "0" ) {
                                        callback(null, msg);

                                    }else{

                                        /* 변경전 대상이 상위그룹이 있는 경우 */
                                        if( typeof msg.v_arr_simul_share_not_in_group == "undefined" || msg.v_arr_simul_share_not_in_group.length == 0 ) {
                                            callback(null, msg);

                                        }else{

                                            paramData.arr_delete_list   =   msg.v_arr_simul_share_not_in_group;
                                            stmt = mapper.getStatement('simulation', "deleteShareUserInArr", paramData, format);
                                            log.debug(stmt, paramData);

                                            conn.query(stmt, function(err, rows) {

                                                if (err) {
                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }

                                                if( rows ) {
                                                    log.debug( "simulation.deleteShareUserInArr ( 변경전 그룹에 속하지 않는 삭제 대상 ) success" );
                                                }

                                                paramData.arr_delete_list   =   [];

                                                callback(null, msg);
                                            });
                                        }
                                    }

                                } catch (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }
                            },                    

                            /* 14. 그룹변경인 경우 [tm_simul_share] 시나리오 수정한다. */
                            function( msg, callback) {

                                try {

                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }

                                    var v_queryId   =   "";


                                    if( paramData.changeGrpCdYn == "0" ) {

                                        /* 등록인 경우 */
                                        if( paramData.status  ==  "insert" ) {

                                            paramData.owner_yn  = "1";
                                            v_queryId   =   "saveTmSimulShareScen";

                                        }else{
                                            v_queryId   =   "modifyTmSimulShareScenByChangeGroup";
                                        }
                                    }else{
                                        v_queryId       =   "modifyTmSimulShareScenByChangeGroup";
                                    }

                                    stmt = mapper.getStatement('simulation', v_queryId, paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if( rows ) {
                                            log.debug( "simulation." + v_queryId + " ( 시나리오 tm_simul_share ) success" );
                                        }

                                        callback(null, msg);
                                    });

                                } catch (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }
                            },

							/* 15. td_kspjong_hist 테이블 기준 td_index_hist 테이블에서 bench_mark 와 일치하는 정보를 조회한다.*/
							function(msg, callback) {

								try{

									if( !msg || Object.keys( msg ).length == 0 ) {
										msg = {};
									}

                                    if( typeof msg.first_date == "undefined" || msg.first_date == "" ) {
										resultMsg.result = false;
										resultMsg.msg = "최초일이 존재하지 않습니다.";
										resultMsg.err = config.MSG.error01;

										callback( resultMsg );

                                    }else{

                                        paramData.first_date    =   msg.first_date;
                                        stmt = mapper.getStatement('simulationBacktest', 'getSimulBenchMark', paramData, format);
                                        log.debug(stmt);

                                        conn.query(stmt, function(err, rows) {

                                            if (err) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                resultMsg.err = err;

                                                return callback(resultMsg);
                                            }

                                            if ( rows && rows.length > 0 ) {

                                                /* 일자별 지수에 밴치마크 정보를 설정한다. */
                                                var v_prev_index    =   0;
                                                for( var i=0; i < dataLists.length; i++ ) {

                                                    var v_daily         =   dataLists[i];
                                                    var v_prev_daily    =   ( typeof dataLists[ v_prev_index ] == "undefined"       ? {} : dataLists[ v_prev_index ] );

                                                    var v_index         =   -1;
                                                    var v_bm            =   {};



                                                    v_daily.RETURN_VAL    =   Number(
                                                        simulModule.fn_calc_data(
                                                                "RETURN_VAL"
                                                            ,   {}
                                                            ,   {       
                                                                        INDEX_RATE          :   v_daily.INDEX_RATE          /* 당일 지수 */
                                                                    ,   BEFORE_INDEX_RATE   :   v_prev_daily.INDEX_RATE     /* 전일 지수 */
                                                                }
                                                        )
                                                    );

                                                    v_index         =   _.findIndex( rows, { "F12506" : v_daily.F12506  });
                                                    if( v_index > -1 ) {
                                                        v_bm        =   ( typeof rows[v_index] == "undefined"       ? {} : rows[v_index] );
                                                    }

                                                    if( typeof v_bm != "undefined" && Object.keys( v_bm ).length > 0 ) {

                                                        v_daily.bm_data01       =   Number( v_bm.F15001 );
                                                        v_daily.F15175          =   Number( v_bm.F15175 );
                                                        v_daily.KOSPI_F15001    =   Number( v_bm.KOSPI_F15001 );


                                                        /* 최초인 경우 */
                                                        if( i == 0 ) {

                                                            v_daily.bm_1000_data    =   1000;
                                                            v_daily.bm_return_data  =   Number(
                                                                (
                                                                    ( Number( v_daily.bm_1000_data ) - Number( v_daily.bm_1000_data ) ) / Number( v_daily.bm_1000_data )
                                                                ).toFixed(17)
                                                            );

                                                        }else{

                                                            /* 1000 단위환산 = 전일 단위환산 * ( 당일지수 / 전일 지수 ) */
                                                            v_daily.bm_1000_data    =   Number(
                                                                (
                                                                        Number( v_prev_daily.bm_1000_data ) *
                                                                        ( Number( v_daily.bm_data01 ) / Number( v_prev_daily.bm_data01 ) )
                                                                ).toFixed(17)
                                                            );

                                                            /* return = ( 당일 단위환산 - 전일 단위환산 ) / 전일 단위환산 */
                                                            v_daily.bm_return_data  =   Number(
                                                                (
                                                                        ( Number( v_daily.bm_1000_data ) - Number( v_prev_daily.bm_1000_data ) ) / Number( v_prev_daily.bm_1000_data )
                                                                ).toFixed(17)
                                                            );
                                                        }
                                                    }

                                                    if( i > 0 ) {
                                                        v_prev_index    =   i;
                                                    }
                                                }

                                                resultMsg.arr_daily      =   dataLists;
                                            }

                                            callback(null, msg);
                                        });
                                    }

								} catch (err) {

									resultMsg.result = false;
									resultMsg.msg = config.MSG.error01;
									resultMsg.err = err;

									callback(resultMsg);
								}
							},

                            /* 16. tm_simul_result_daily 를 삭제한다. */
                            function(msg, callback) {

                                try{
                                    if( !msg || Object.keys( msg ).length == 0 ) {
                                        msg = {};
                                    }

                                    stmt = mapper.getStatement('simulation', 'deleteSimulResultDaily', paramData, format);
                                    log.debug(stmt);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if( rows ) {
                                            log.debug( "simulation.deleteSimulResultDaily success" );
                                        }

                                        callback(null, msg);
                                    });

                                } catch (err) {

                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    callback(resultMsg);
                                }
                            },                            

							/* 17. [tm_simul_result_daily] 테이블에 등록한다. */
							function(msg, callback) {

								if( !msg || Object.keys( msg ).length == 0 ) {
									msg = {};
								}

                                try{
                                    var divideList  =   [];
                                    async.forEachOfLimit( dataLists, 1, function(subList, i, innerCallback) {

                                        async.waterfall([

                                            function(innerCallback) {

                                                divideList.push( subList );
                                                
                                                innerCallback(null, paramData);
                                            },

                                            function(sub_msg, innerCallback) {

                                                var divide_size = ( limit && limit.result_dive_size ? limit.result_dive_size : 1 );
                                                if( divideList && ( divideList.length == divide_size || i == v_resultSimulData.arr_daily.length-1 ) ) {
                                                    try {
                                                        paramData.dataLists =   divideList;
                                                        stmt = mapper.getStatement('simulationBacktest', 'saveTmSimulResultDaily', paramData, format);

                                                        conn.query(stmt, function(err, rows) {
                                                            if (err) {
                                                                resultMsg.result = false;
                                                                resultMsg.msg = config.MSG.error01;
                                                                resultMsg.err = err;

                                                                return innerCallback(resultMsg);
                                                            }

                                                            innerCallback(null);
                                                        });

                                                        divideList  =   [];

                                                    } catch (err) {

                                                        resultMsg.result = false;
                                                        resultMsg.msg = config.MSG.error01;

                                                        if( !resultMsg.err ) {
                                                            resultMsg.err = err;
                                                        }

                                                        return innerCallback(resultMsg);
                                                    }

                                                }else{
                                                    innerCallback(null);
                                                }
                                            }

                                        ], function(err) {

                                            if( err ) {
                                                resultMsg.result = false;
                                                resultMsg.msg = config.MSG.error01;
                                                if( !resultMsg.err ) {
                                                    resultMsg.err = err;
                                                }

                                                return innerCallback(resultMsg);
                                            }

                                            innerCallback(null);
                                        });                                            

                                    }, function(err) {
                                        if (err) {
                                            return callback(resultMsg);
                                        }

                                        log.debug( "simulationBacktest.saveTmSimulResultDaily" );

                                        callback(null, msg);
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
								log.error(err, paramData);

								conn.rollback();
							} else {
								resultMsg.result = true;
								resultMsg.msg = "";
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

            deleteFile(reqParam);

            resultMsg.result = false;
            if( !resultMsg.msg ) {
                resultMsg.msg = config.MSG.error01;
            }
            resultMsg.err = expetion;

            res.json(resultMsg);
            res.end();
        }
    });
};



module.exports.uploadPortfolio = uploadPortfolio;
module.exports.uploadTimeSeries = uploadTimeSeries;
