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

var log = require('../../../util/logg');


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


        resultMsg.errorList         =   [];
        resultMsg.pdf_list          =   [];

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


            var v_param = {
                    p_count_check       :   true    /* 엑셀 건수 체크 */
                ,   p_column_check      :   true    /* 엑셀 컬럼 체크 */
                ,   p_record_check      :   true    /* 엑셀 레코드 체크 */
                ,   p_record_data       :   {}      /* 엑셀 레코드 데이터 */
                ,   p_index             :   0       /* 엑셀 index */
                ,   p_startIndex        :   1
                ,   p_pdf_yn            :   "1"
            };                

            /* 엑셀파일을 파싱한다. */
            var workbook = xlsx.readFile(reqParam.uploadFolder + "/" + req.file.filename);
            var sheet_name_list = workbook.SheetNames;
            var dataLists = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: ["col01", "col02", "col03", "col04", "col05"], range: v_param.p_startIndex });


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

                    for (var i = 0; i < dataLists.length-1; i++) {
                        var data = dataLists[i];

                        /* 엑셀 레코드 밸리데이션을 수행한다. */
                        v_param.p_index         =   i;
                        simulationUpload.fn_excel_record_check( v_param, data );

                        if( data.col01 != paramData.F16012 ) {
                            v_param.p_record_check  =   false;

                            data.result             =   false;
                            data.msg                =   "[" + ( i + v_param.p_startIndex + 1 ) + " 행] ETF 코드를 잘못 입력하셨습니다.";
                        }


                        for (var j = i+1; j < dataLists.length; j++) {
                            var data2 = dataLists[j];

                            /* 엑셀 레코드 밸리데이션을 수행한다. */
                            v_param.p_index         =   j;
                            simulationUpload.fn_excel_record_check( v_param, data2 );


                            if( data.F16316 != "" && data2.F16316 != "" && data.F16316 == data2.F16316 ) {
                                v_param.p_record_check  =   false;

                                data.result             =   false;
                                data.msg                =   "[" + ( i + v_param.p_startIndex + 1 ) + " 행] 과 [" + ( j + v_param.p_startIndex + 1 ) + " 행] 종목코드 컬럼이 중복 존재합니다.";
                            }else if( data.F16004 != "" && data2.F16004 != "" && data.F16004 == data2.F16004 ) {
                                v_param.p_record_check  =   false;

                                data.result             =   false;
                                data.msg                =   "[" + ( i + v_param.p_startIndex + 1 ) + " 행] 과 [" + ( j + v_param.p_startIndex + 1 ) + " 행] 종목명 컬럼이 중복 존재합니다.";
                            }
                        }

                        data.row_no = i + v_param.p_startIndex + 1;

                        /* 마지막 전 인덱스인 경우 */
                        if( i == dataLists.length-2 ) {

                            /* 마지막 레코드에 row_no 추가 */
                            data        =   dataLists[i+1];
                            data.row_no =   i + v_param.p_startIndex + 2;

                            if( data.col01 != paramData.F16012 ) {
                                v_param.p_record_check  =   false;

                                data.result             =   false;
                                data.msg                =   "[" + ( data.row_no ) + " 행] ETF 코드를 잘못 입력하셨습니다.";
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

                simulationUpload.deleteFile(reqParam);

                resultMsg.record_check          =   v_param.p_record_check;
                resultMsg.count_check           =   v_param.p_count_check;
                resultMsg.result = false;

                res.json(resultMsg);
                res.end();

            } else {


                var format = { language: 'sql', indent: '' };
                var stmt = "";
                Promise.using(pool.connect(), conn => {

                    async.waterfall([

                        /* 1. ETP 기본 정보를 조회한다. */
                        function(callback) {

                            try{
                                var  msg = {};

                                msg.etpBasic    =   {};

                                stmt = mapper.getStatement('etpOper', 'getEtpBasic', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows.length > 1) {
                                        resultMsg.result = false;
                                        resultMsg.msg = "해당 코드가 1건 이상 존재합니다.";
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }                            

                                    if (rows && rows.length == 1) {
                                        msg.etpBasic = rows[0];
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

                        /* 2. ETF 정보를 조회한다. */
                        function(msg, callback) {

                            try{

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

                                msg.pdf_list    =   [];

                                if( typeof msg.etpBasic == "undefined" || Object.keys( msg.etpBasic ).length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "기본 정보가 존재하지 않습니다.";
                                    resultMsg.err = "기본 정보가 존재하지 않습니다.";

                                    callback(resultMsg);
                                }
                                /* ETF 가 아닌 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                                else if( !( msg.etpBasic.F16493 == "1" || msg.etpBasic.F16493 == "2" ) ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "ETF 정보가 존재하지 않습니다.";
                                    resultMsg.err = "ETF 정보가 존재하지 않습니다.";

                                    callback(resultMsg);
                                }
                                /* ETF 인 경우 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                                else{

                                    paramData.search_date   =   paramData.F12506;
                                    stmt = mapper.getStatement('etpOper', 'getEtpOperPdfEtfEmergency', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }


                                        if( rows && rows.length > 0 ) {

                                        /* ETF 구성종목 데이터들을 화면에 노출하기 위한 정보로 구성 */
                                            rows.forEach( function(item, index, array) {
                                                var data            =   {};

                                                data.F12506         =   paramData.F12506;               /* 일자 */
                                                data.fmt_F12506     =   util.formatDate( data.F12506 ); /* 일자 */
                                                data.F16012         =   paramData.F16012;               /* ETF종목코드 */
                                                data.F16583         =   paramData.F16583;               /* 사무수탁회사번호 */
                                                data.F16013         =   paramData.F16013;               /* ETF단축코드 */

                                                data.F16316         =   item.F16316;                    /* 구성종목코드 */
                                                data.F33837         =   item.F33837;                    /* 구성종목수 */
                                                data.F16499         =   item.F16499;                    /* 1CU단위증권수 */
                                                data.fmt_F16499     =   Math.floor( 
                                                    Number( data.F16499 ) * 100 
                                                ) / 100;                                                /* 1CU단위증권수 */
                                                data.F33861         =   item.F33861;                    /* ETF시장구분 */
                                                data.F34840         =   item.F34840;                    /* 액면금액설정현금액 */
                                                data.fmt_F34840     =   Math.floor( 
                                                    Number( data.F34840 ) * 100 
                                                ) / 100;                                                /* 액면금액설정현금액 */
                                                
                                                data.F33904         =   (
													typeof item.F33904 == "undefined" || item.F33904 == null ? "" : item.F33904
												);                    									/* 선물 옵션 계약승수*/ 
                                                data.F34743         =   item.F34743;                    /* ETF_PDF비중 */
                                                data.fmt_F34743     =   item.fmt_F34743;                /* ETF_PDF비중 */
                                                data.F16004         =   item.F16004;                    /* 해외시장종목명 */
                                                data.status         =   "normal";
												
												data.F15007         =   0;                              /* kspjong_basic 기준가 (신규추가시 사용) */
                                                data.F16588         =   item.F16588;                    /* 평가금액 */

                                                data.F16499_prev    =   item.F16499;                    /* CU shrs (변경전) */
                                                data.F34840_prev    =   item.F34840;                    /* 액면금액 (변경전) */
                                                data.F16588_prev    =   item.F16588;                    /* 평가금액 (변경전) */
                                                data.code_check     =   true;                           /* code_check */


                                            /* 업로드된 종목코드와 동일한 정보가 존재하는 경우 */
                                                var filterData      =   _.filter( dataLists, function(o) {

                                                    /* 구성종목코드 */
                                                    return  o.F16316 == item.F16316;
                                                });
                                                if( filterData && filterData.length == 1 ) {

                                                    // data.F16316         =   filterData[0].F16012;            /* 구성종목코드 */
                                                    // data.F33837         =   filterData[0].F33837;            /* 구성종목수 */
                                                    data.F16499         =   filterData[0].F16499;               /* 1CU단위증권수 */
                                                    data.fmt_F16499     =   Math.floor( 
                                                        Number( data.F16499 ) * 100 
                                                    ) / 100;                                                    /* 1CU단위증권수 */
                                                    // data.F33861         =   filterData[0].F33861;            /* ETF시장구분 */
                                                    data.F34840         =   filterData[0].F34840;               /* 액면금액설정현금액 */
                                                    data.fmt_F34840     =   Math.floor( 
                                                        Number( data.F34840 ) * 100 
                                                    ) / 100;                                                    /* 액면금액설정현금액 */


                                                    /* 액면금액이 0 보다 큰 경우 평가금액 0 으로 설정 */
                                                    if( Number( item.F34840 ) > 0 ) {
                                                        data.F16588         =   0;                              /* 평가금액 */
                                                    }else{
                                                        if( 
                                                            !(      Number( data.F16499_prev ) == Number( filterData[0].F16499 )
                                                                &&  Number( data.F34840_prev ) == Number( item.F34840 )
                                                            ) 
                                                        ) {
                                                            data.status         =   "modify";

                                                            if( data.status == "modify" ) {

                                                                if( Number( data.F16499_prev ) == 0 ) {
                                                                    data.F16588         =   0;                  /* 평가금액 */
                                                                }else{
                                                                    data.F16588         =   (
                                                                        Number( data.F16588_prev ) * Number( filterData[0].F16499 ) / Number( data.F16499_prev )
                                                                    );                                          /* 평가금액 */
                                                                }
                                                            }                                                        
                                                        }


                                                        if( 
                                                            !(      Number( data.F34840_prev ) == Number( filterData[0].F34840 )
                                                                &&  Number( data.F16499_prev ) == Number( item.F16499 )
                                                            ) 
                                                        ) {
                                                            data.status         =   "modify";

                                                            if( data.status == "modify" ) {

                                                                if( Number( data.F34840 ) == 0 ) {

                                                                    if( Number( data.F16499_prev ) == 0  ) {
                                                                        v_F16588    =   0;
                                                                    }else{
                                                                        v_F16588    =   Number( data.F16588_prev ) * Number( data.F16499 ) / Number( data.F16499_prev );
                                                                    }

                                                                }else{

                                                                    if( Number( data.F34840_prev ) == 0 ) {
                                                                        data.F16588         =   0;              /* 평가금액 */
                                                                    }else{
                                                                        data.F16588         =   (
                                                                            Number( data.F16588_prev ) * Number( filterData[0].F34840 ) / Number( data.F34840_prev )
                                                                        );                                      /* 평가금액 */
                                                                    }
                                                                }
                                                            }                                                        
                                                        }
                                                    }
                                                    
                                                    // data.F33904         =   filterData[0].F33904;           /* 선물 옵션 계약승수*/ 
                                                    // data.F34743         =   filterData[0].F34743;           /* ETF_PDF비중 */
                                                    // data.fmt_F34743     =   filterData[0].fmt_F34743;       /* ETF_PDF비중 */
                                                    // data.F16004         =   filterData[0].F16002;           /* 해외시장종목명 */


                                                    // data.F16499_prev    =   filterData[0].F16499;           /* CU shrs (변경전) */
                                                    // data.F34840_prev    =   filterData[0].F34840;           /* 액면금액 (변경전) */
                                                    // data.F16588_prev    =   filterData[0].F16588;           /* 평가금액 (변경전) */

                                                    filterData[0].status        =   data.status;

                                                    filterData[0].F16499        =   data.F16499;
                                                    filterData[0].F34840        =   data.F34840;
                                                    filterData[0].F16588        =   data.F16588;

                                                    filterData[0].F16499_prev   =   data.F16499_prev;
                                                    filterData[0].F34840_prev   =   data.F34840_prev;
                                                    filterData[0].F16588_prev   =   data.F16588_prev;
                                                }

                                                msg.pdf_list.push( data );
                                            });
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

                        /* 3. kspjong_basic 을 조회하여 종목이 존재하는지 체크한다. */
                        function( msg, callback ) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

                                msg.arr_insert_list     =   [];

                                if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
                                    resultMsg.result        =   false;
                                    resultMsg.record_check  =   false;

                                    callback(resultMsg);
                                }else{

                                    msg.arr_insert_list   =   _.filter( dataLists, function(o) {
                                        return ( typeof o.status == "undefined" || o.status == "" );
                                    });                                    


                                    if( typeof msg.arr_insert_list == "undefined" || msg.arr_insert_list.length == 0 ) {

                                        callback(null, msg);
                                    }else{

                                        stmt = mapper.getStatement('etpOper', 'getAllKspjongBasic', paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            try {

                                                if (err) {
                                                    log.error(err, stmt, paramData);

                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }
                                                else if ( !rows || rows.length == 0 )  {

                                                    log.error(stmt, paramData);

                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = "[error] etpOper.getAllKspjongBasic 종목 기본정보가 없습니다.";

                                                    return callback(resultMsg);
                                                }


                                                for( var i=0 ; i < msg.arr_insert_list.length; i++ ) {

                                                    var item        =   msg.arr_insert_list[i];
                                                    var filterData  =   _.filter( rows, function(o) {

                                                        /* 구성종목코드 */
                                                        return  o.F16012 == item.F16316;
                                                    });


                                                    /* 존재하는 경우 - modify */
                                                    if( filterData && filterData.length == 1 ){
                                                        var data            =   {};

                                                        data.F12506         =   paramData.F12506;               /* 일자 */
                                                        data.fmt_F12506     =   util.formatDate( data.F12506 ); /* 일자 */
                                                        data.F16012         =   paramData.F16012;               /* ETF종목코드 */
                                                        data.F16583         =   paramData.F16583;               /* 사무수탁회사번호 */
                                                        data.F16013         =   paramData.F16013;               /* ETF단축코드 */
                                                        
                                                        data.F16316         =   filterData[0].F16012;           /* 구성종목코드 */
                                                        data.F33837         =   0;                              /* 구성종목수 */
                                                        data.F16499         =   item.F16499;                    /* 1CU단위증권수 */
                                                        data.fmt_F16499     =   Math.floor( 
                                                            Number( data.F16499 ) * 100 
                                                        ) / 100;                                                /* 1CU단위증권수 */
                                                        data.F33861         =   ( [ "KR1", "KR3", "KR6" ].includes( filterData[0].F16012.substr(0,3) ) ? "3" : filterData[0].F33861 );
                                                        data.F34840         =   item.F34840;                    /* 액면금액설정현금액 */
                                                        data.fmt_F34840     =   Math.floor( 
                                                            Number( data.F34840 ) * 100 
                                                        ) / 100;                                                /* 액면금액설정현금액 */

                                                        data.F33904         =   (
															typeof filterData[0].F33904 == "undefined" || filterData[0].F33904 == null ? 0 : filterData[0].F33904
														);  													/* 선물 옵션 계약승수*/ 
                                                        data.F34743         =   0;                              /* ETF_PDF비중 */
                                                        data.fmt_F34743     =   0;                              /* ETF_PDF비중 */
                                                        data.F16004         =   filterData[0].F16002;           /* 해외시장종목명 */
                                                        data.status         =   "insert";

                                                        item.status         =   data.status;

                                                        data.F15007         =   (
															typeof filterData[0].F15007 == "undefined" || filterData[0].F15007 == null ? 0 : filterData[0].F15007
														);  													/* kspjong_basic 기준가 (신규추가시 사용) */
														data.F16588			=	0;

                                                        /* 액면금액이 0 보다 큰 경우 평가금액 0 으로 설정 */
                                                        if( Number( item.F34840 ) > 0 ) {
                                                            data.F16588         =   0;                          /* 평가금액 */
                                                        }else{

                                                            if( Number( item.F34840 ) == 0 ) {

                                                                if (data.F33861 == '4') {                        
                                                                    data.F16588     =   (
                                                                        Number( data.F15007 ) * Number( data.F16499 ) * Number( data.F33904 )
                                                                    );
                                                                } 
                                                                /* 코스피, 코스닥 그외 : 평가금액 = 기준가 * CU수량 */
                                                                else {
                                                                    data.F16588     =   Number( data.F15007 ) * Number( data.F16499 );
                                                                }
                                                            }else{
                                                                data.F16588 =   0;
                                                            }

                                                        }

                                                        data.F16499_prev    =   data.F16499;                    /* CU shrs (변경전) */
                                                        data.F34840_prev    =   data.F34840;                    /* 액면금액 (변경전) */
                                                        data.F16588_prev    =   data.F16588;                    /* 평가금액 (변경전) */
                                                        data.code_check     =   true;                           /* code_check */

                                                        item.F16499         =   data.F16499;
                                                        item.F34840         =   data.F34840;
                                                        item.F16588         =   data.F16588;

                                                        item.F16499_prev    =   data.F16499_prev;
                                                        item.F34840_prev    =   data.F34840_prev;
                                                        item.F16588_prev    =   data.F16588_prev;

                                                        msg.pdf_list.push( data );
                                                    }
                                                    /* td_kspjong_basic 에 코드가 중복 존재하는 경우 */
                                                    else if( filterData && filterData.length > 1 ){
                                                        resultMsg.errorList.push( { 
                                                                result  :   false
                                                            ,   msg     :   "[" + data.row_no + " 행] CODE 컬럼 값 (" + data.F16316 + ") 이 DB 에 중복 존재합니다."
                                                        });
                                                    }

                                                    /* 10 개 까지만 결과정보에 보관한다. */
                                                    if( resultMsg.errorList.length == 10  ) {
                                                        break;
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
                                    }
                                }

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        },

                        /* 4. future_basic 을 조회하여 종목이 존재하는지 체크한다. */
                        function( msg, callback ) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

                                msg.arr_insert_list =   [];

                                if( resultMsg.errorList && resultMsg.errorList.length > 0 ) {
                                    resultMsg.result        =   false;
                                    resultMsg.record_check  =   false;

                                    callback(resultMsg);
                                }else{

                                    msg.arr_insert_list   =   _.filter( dataLists, function(o) {
                                        return ( typeof o.status == "undefined" || o.status == "" );
                                    });


                                    if( typeof msg.arr_insert_list == "undefined" || msg.arr_insert_list.length == 0 ) {

                                        callback(null, msg);
                                    }else{

                                        stmt = mapper.getStatement('etpOper', 'getAllFutureBasic', paramData, format);
                                        log.debug(stmt, paramData);

                                        conn.query(stmt, function(err, rows) {

                                            try {

                                                if (err) {
                                                    log.error(err, stmt, paramData);

                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = err;

                                                    return callback(resultMsg);
                                                }
                                                else if ( !rows || rows.length == 0 )  {

                                                    log.error(stmt, paramData);

                                                    resultMsg.result = false;
                                                    resultMsg.msg = config.MSG.error01;
                                                    resultMsg.err = "[error] etpOper.getAllFutureBasic 종목 기본정보가 없습니다.";

                                                    return callback(resultMsg);
                                                }


                                                for( var i=0 ; i < msg.arr_insert_list.length; i++ ) {

                                                    var item        =   msg.arr_insert_list[i];
                                                    var filterData  =   _.filter( rows, function(o) {

                                                        /* 구성종목코드 */
                                                        return  o.F16012 == item.F16316;
                                                    });


                                                    /* 존재하는 경우 - modify */
                                                    if( filterData && filterData.length == 1 ){
                                                        var data            =   {};

                                                        data.F12506         =   paramData.F12506;               /* 일자 */
                                                        data.fmt_F12506     =   util.formatDate( data.F12506 ); /* 일자 */
                                                        data.F16012         =   paramData.F16012;               /* ETF종목코드 */
                                                        data.F16583         =   paramData.F16583;               /* 사무수탁회사번호 */
                                                        data.F16013         =   paramData.F16013;               /* ETF단축코드 */
                                                        
                                                        data.F16316         =   filterData[0].F16012;           /* 구성종목코드 */
                                                        data.F33837         =   0;                              /* 구성종목수 */
                                                        data.F16499         =   item.F16499;                    /* 1CU단위증권수 */
                                                        data.fmt_F16499     =   Math.floor( 
                                                            Number( data.F16499 ) * 100 
                                                        ) / 100;                                                /* 1CU단위증권수 */
                                                        data.F33861         =   ( [ "KR1", "KR3", "KR6" ].includes( filterData[0].F16012.substr(0,3) ) ? "3" : filterData[0].F33861 );
                                                        data.F34840         =   item.F34840;                    /* 액면금액설정현금액 */
                                                        data.fmt_F34840     =   Math.floor( 
                                                            Number( data.F34840 ) * 100 
                                                        ) / 100;                                                /* 액면금액설정현금액 */

                                                        data.F33904         =   (
															typeof filterData[0].F33904 == "undefined" || filterData[0].F33904 == null ? 0 : filterData[0].F33904
														);  													/* 선물 옵션 계약승수*/ 
                                                        data.F34743         =   0;                              /* ETF_PDF비중 */
                                                        data.fmt_F34743     =   0;                              /* ETF_PDF비중 */
                                                        data.F16004         =   filterData[0].F16002;           /* 해외시장종목명 */
                                                        data.status         =   "insert";

                                                        item.status         =   data.status;

                                                        data.F15007         =   (
															typeof filterData[0].F15007 == "undefined" || filterData[0].F15007 == null ? 0 : filterData[0].F15007
														);  													/* kspjong_basic 기준가 (신규추가시 사용) */
														data.F16588			=	0;

                                                        /* 액면금액이 0 보다 큰 경우 평가금액 0 으로 설정 */
                                                        if( Number( item.F34840 ) > 0 ) {
                                                            data.F16588         =   0;                          /* 평가금액 */
                                                        }else{

                                                            if( Number( item.F34840 ) == 0 ) {

                                                                if (data.F33861 == '4') {                        
                                                                    data.F16588     =   (
                                                                        Number( data.F15007 ) * Number( data.F16499 ) * Number( data.F33904 )
                                                                    );
                                                                } 
                                                                /* 코스피, 코스닥 그외 : 평가금액 = 기준가 * CU수량 */
                                                                else {
                                                                    data.F16588     =   Number( data.F15007 ) * Number( data.F16499 );
                                                                }
                                                            }else{
                                                                data.F16588 =   0;
                                                            }
                                                        }

                                                        data.F16499_prev    =   data.F16499;                    /* CU shrs (변경전) */
                                                        data.F34840_prev    =   data.F34840;                    /* 액면금액 (변경전) */
                                                        data.F16588_prev    =   data.F16588;                    /* 평가금액 (변경전) */
                                                        data.code_check     =   true;                           /* code_check */

                                                        item.F16499         =   data.F16499;
                                                        item.F34840         =   data.F34840;
                                                        item.F16588         =   data.F16588;

                                                        item.F16499_prev    =   data.F16499_prev;
                                                        item.F34840_prev    =   data.F34840_prev;
                                                        item.F16588_prev    =   data.F16588_prev;

                                                        msg.pdf_list.push( data );
                                                    }
                                                    /* td_kspjong_basic 에 코드가 중복 존재하는 경우 */
                                                    else if( filterData && filterData.length > 1 ){
                                                        resultMsg.errorList.push( { 
                                                                result  :   false
                                                            ,   msg     :   "[" + data.row_no + " 행] CODE 컬럼 값 (" + data.F16316 + ") 이 DB 에 중복 존재합니다."
                                                        });
                                                    }

                                                    /* 10 개 까지만 결과정보에 보관한다. */
                                                    if( resultMsg.errorList.length == 10  ) {
                                                        break;
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
                                    }
                                }

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        },

                        /* 5. CU 수량, 액면금액이 변경되었는지 체크한다. */
                        function( msg, callback ) {

                            try {

                                if( !msg || Object.keys( msg ).length == 0 ) {
                                    msg = {};
                                }

                                /* status 가 normal 이 아닌 정보 추출 */
                                var v_arr_change_list   =   _.filter( dataLists, function(o) {
                                    return  ( typeof o.status == "undefined" || o.status != "normal" );
                                });

                                if( !v_arr_change_list || v_arr_change_list.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = "[CU SHrs] 또는 [액면금액]  변경된 정보가 한건 이상 존재해야 합니다.";
                                    resultMsg.err = "[CU SHrs] 또는 [액면금액]  변경된 정보가 한건 이상 존재해야 합니다.";

                                    callback(resultMsg);

                                }else{

                                    resultMsg.errorList =   [];

                                    /* 등록건 종목명이 비어 있는 경우 */
                                    var v_arr_insert_check   =   _.filter( dataLists, function(o) {
                                        return ( typeof o.status == "undefined" || o.status == "" ) && ( o.F16004 == "undefined" || o.F16004 == "" );
                                    });                                    
                                    if( v_arr_insert_check && v_arr_insert_check.length > 0 ) {


                                        for( var i=0; i < v_arr_insert_check.length; i++ ) {
                                            var item    =   v_arr_insert_check[i];

                                            resultMsg.errorList.push( { msg : "[" + ( item.row_no ) + " 행] 종목명을 입력해 주세요." } );

                                            /* 10 개 까지만 결과정보에 보관한다. */
                                            if( resultMsg.errorList.length == 10  ) {
                                                break;
                                            }
                                        }

                                        resultMsg.record_check  =   false;
                                        resultMsg.result        =   false;

                                        callback(resultMsg);

                                    }else{

                                        /* 등록건이 "KR1", "KR3", "KR6" 으로 시작하지 않는 경우 */
                                        v_arr_insert_check   =   _.filter( dataLists, function(o) {
                                            return ( typeof o.status == "undefined" || o.status == "" ) && ![ "KR1", "KR3", "KR6" ].includes( o.F16316.substr(0,3) );
                                        });
                                        if( v_arr_insert_check && v_arr_insert_check.length > 0 ) {

                                            for( var i=0; i < v_arr_insert_check.length; i++ ) {
                                                var item    =   v_arr_insert_check[i];

                                                resultMsg.errorList.push( { msg : "[" + ( item.row_no ) + " 행] 구성종목코드를 확인해 주세요." } );

                                                /* 10 개 까지만 결과정보에 보관한다. */
                                                if( resultMsg.errorList.length == 10  ) {
                                                    break;
                                                }
                                            }

                                            resultMsg.record_check  =   false;
                                            resultMsg.result        =   false;

                                            callback(resultMsg);

                                        }else{

                                            /*  
                                            *   ###################################################################################
                                            *   insert 상태 초기값 설정
                                            *   ###################################################################################
                                            */
                                            var v_arr_insert_list   =   _.filter( dataLists, function(o) {
                                                return ( typeof o.status == "undefined" || o.status == "" );
                                            });

                                            /* 등록건이 존재하는 경우 */
                                            if( v_arr_insert_list && v_arr_insert_list.length > 0 ) {
                                                v_arr_insert_list.forEach( function(rowItem) {

                                                    var data            =   {};

                                                    data.F12506         =   paramData.F12506;               /* 일자 */
                                                    data.fmt_F12506     =   util.formatDate( data.F12506 ); /* 일자 */
                                                    data.F16012         =   paramData.F16012;               /* ETF종목코드 */
                                                    data.F16583         =   paramData.F16583;               /* 사무수탁회사번호 */
                                                    data.F16013         =   paramData.F16013;               /* ETF단축코드 */

                                                    data.F16316         =   rowItem.F16316;                 /* 구성종목코드 */
                                                    data.F33837         =   0;                              /* 구성종목수 */
                                                    data.F16499         =   rowItem.F16499;                 /* 1CU단위증권수 */
                                                    data.fmt_F16499     =   Math.floor( 
                                                        Number( data.F16499 ) * 100 
                                                    ) / 100;                                                /* 1CU단위증권수 */
                                                    data.F33861         =   ( [ "KR1", "KR3", "KR6" ].includes( rowItem.F16316.substr(0,3) ) ? "3" : "" );
                                                    data.F34840         =   rowItem.F34840;                 /* 액면금액설정현금액 */
                                                    data.fmt_F34840     =   Math.floor( 
                                                        Number( data.F34840 ) * 100 
                                                    ) / 100;                                                /* 액면금액설정현금액 */

                                                    data.F33904         =   "";                             /* 선물 옵션 계약승수*/ 
                                                    data.F34743         =   0;                              /* ETF_PDF비중 */
                                                    data.fmt_F34743     =   0;                              /* ETF_PDF비중 */
                                                    data.F16004         =   rowItem.F16004;                 /* 해외시장종목명 */
                                                    data.status         =   "insert";
                                                    
                                                    rowItem.status      =   data.status;

                                                    data.F15007         =   0;                              /* kspjong_basic 기준가 (신규추가시 사용) */
                                                    data.F16588         =   0;                              /* 평가금액 */
                                                    data.F16499_prev    =   rowItem.F16499;              	/* CU shrs (변경전) */
                                                    data.F34840_prev    =   rowItem.F34840;              	/* 액면금액 (변경전) */
                                                    data.F16588_prev    =   0;                              /* 평가금액 (변경전) */
                                                    data.code_check     =   true;                           /* code_check */

                                                    rowItem.F16499_prev =   data.F16499_prev;
                                                    rowItem.F34840_prev =   data.F34840_prev;
                                                    rowItem.F16588_prev =   data.F16588_prev;

                                                    msg.pdf_list.push( data );
                                                })
                                            }


                                            msg.pdf_list =   _.orderBy( msg.pdf_list
                                                , [ "fmt_F12506", "status" ]
                                                , [ "asc", "asc"]
                                            );                                    

                                            resultMsg.pdf_list      =   msg.pdf_list;

                                            callback( null );
                                        }
                                    }
                                }

                            } catch (err) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = err;

                                callback(resultMsg);
                            }
                        },

                    ], function(err) {

                        simulationUpload.deleteFile(reqParam);

                        if (err) {

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
            resultMsg.pdf_list      =   [];

            res.json(resultMsg);
            res.end();
        }
    });
};


module.exports.uploadPdf = uploadPdf;
