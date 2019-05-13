/*
 *  ETP 등록화면
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");
var async = require('async');
       
var format = { language: 'sql', indent: '' };

var getEtpRegisterView = function(req, res) {
    try {
        util.log('###ETP VIEW CALL###', req.query.seq);

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper"); 
        
        var paramData ={};
        util.log('###ETP VIEW CALL paramData###', paramData)
        paramData.seq = req.query.seq*1;

        util.log('###ETP VIEW CALL paramData.seq###', paramData.seq);
        paramData.user_id       =   req.session.user_id;
        //paramData.inst_cd       =   req.session.inst_cd;
        //paramData.inst_type_cd  =   req.session.inst_type_cd;
        
        //개발용 세팅
        paramData.inst_cd       =   '04654';
        paramData.inst_type_cd  =   '0001';
     

        // /* 2. 발행사코드 체크 */
        if ( paramData.inst_type_cd !=='0001' && paramData.inst_type_cd !=='0002') {
            resultMsg.result = false;
            resultMsg.msg = "[error] NOT SUPPORTED paramData.inst_type_cd ";
            throw resultMsg;
        }
        util.log('###ETP VIEW CALL sessioncheck###');
        var resultMsg = {};
        var param = { 
            userType: '0001', 
            lCd: '004', 
            seq: paramData.seq,
            inst_cd : paramData.inst_cd, 
            inst_type_cd : paramData.inst_type_cd
        };
        var stmt='';
        
        
        Promise.using(pool.connect(), conn => {
            async.waterfall([    

                //발행사
                function( callback ) {
                    stmt = mapper.getStatement('EtpRegister', 'getCompList', param, format);
                    util.log(stmt);
                    conn.query(stmt, function( err, rows ) {
                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] ";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.compList = rows;
                        }
                        //util.log(rows);
                        callback( null, param );
                    });
                 
                 },

                 function( data, callback ) { //지수산출/입수기관
                    stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
                    //util.log(stmt);
                    conn.query(stmt, function( err, rows ) {
                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] ";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.code004List = rows;
                        }

                        callback( null, param );
                        //util.log(rows);
                    });
                   
                 },
                 function( data, callback ) { //휴장일기준
                     param.lCd ='005'
                    stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
                    //util.log(stmt);
                    conn.query(stmt, function( err, rows ) {
                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] ";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.code005List = rows;
                        }

                        callback( null, param );
                       // util.log(rows);
                    });
                   
                 },
                 function( data, callback ) { //적용환율
                    param.lCd ='006'
                    stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
                   // util.log(stmt);
                    conn.query(stmt, function( err, rows ) {
                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] ";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.code006List = rows;
                        }

                        callback( null, param );
                       // util.log(rows);
                    });
                   
                 },
                 function( data, callback ) { //iNav/ilv 계산식
                    param.lCd ='007'
                    stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
                    //util.log(stmt);
                    conn.query(stmt, function( err, rows ) {
                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] ";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.code007List = rows;
                        }

                        callback( null, param );
                       // util.log(rows);
                    });
                   
                 },
                 function( data, callback ) { //국내지수산출기관
                    param.lCd ='008'
                    stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
                   // util.log(stmt);
                    conn.query(stmt, function( err, rows ) {
                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] ";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.code008List = rows;
                        }

                        callback( null, param );
                       // util.log(rows);
                    });
                   
                 },
                 function( data, callback ) { //국내지수타입
                    param.lCd ='009'
                    stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
                   // util.log(stmt);
                    conn.query(stmt, function( err, rows ) {
                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] ";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.code009List = rows;
                        }

                       callback( null, param );
                       // util.log(rows);
                    });
                   
                 },
                 function( data, callback ) { //사무수탁사
                    param.lCd ='010'
                    stmt = mapper.getStatement('EtpRegister', 'getCodeList', param, format);
                  //  util.log(stmt);
                    conn.query(stmt, function( err, rows ) {
                        if( err ) {
                            resultMsg.result    =   false;
                            resultMsg.msg       =   "[error] ";
                            resultMsg.err       =   err;

                            return callback( resultMsg );
                        }

                        if ( rows ) {
                            resultMsg.code010List = rows;
                        }

                        callback( null, param );
                        //util.log(rows);
                    });
                   
                 },
                
                function( data, callback ) { //update 화면에조회될 기본정보
                //    if(param.seq !== '0'){
                        stmt = mapper.getStatement('EtpRegister', 'getMaster', param, format);
                        // util.log(stmt);
                        conn.query(stmt, function( err, rows ) {
                            if( err ) {
                                resultMsg.result    =   false;
                                resultMsg.msg       =   "[error] ";
                                resultMsg.err       =   err;

                                return callback( resultMsg );
                            }
                    
                            resultMsg.masterData = rows;
                            //util.log(resultMsg.masterData);
                            if ( rows ) {
                                var idxFileNm = rows.idx_file_nm;
                                if(idxFileNm !==null && idxFileNm =='' && idxFileNm !==undefined){
                                    var idx = idxFileNm.lastIndexOf;
                                    if(idx > 0){
                                    var idxFilePath  = idxFileNm.substring(0, idx);
                                    var newIdxFileNm = idxFileNm.substring(idx+1, idxFileNm.length);
                                    resultMsg.masterData.idx_file_nm   = newIdxFileNm;
                                    resultMsg.masterData.idx_file_path = idxFilePath;
                                    }
                                }
                            }

                            callback( null, param );
                            //util.log(rows);
                        });
                //    }  
                },
            ],
             function (err) {

                if( err ) {
                    console.log( err );
                }else{

                    resultMsg.result    =   true;
                    resultMsg.msg       =   "";
                    resultMsg.err       =   null;
                    resultMsg.params    = param;
                }

                res.json( resultMsg );
                res.end();
            });
         });       
       
    } catch(exception) {
        console.log(expetion);

        if( resultMsg && !resultMsg.msg ) {
            resultMsg.result    =   false;
            resultMsg.msg       =   "[error] 오류가 발생하였습니다.";
            resultMsg.err       =   exception;
        }

        resultMsg.compList                  =   {};
        resultMsg.code004List      =   [];
        resultMsg.code005List      =   [];
        resultMsg.code006List      =   [];
        resultMsg.code007List      =   [];
        resultMsg.code008List      =   [];
        resultMsg.code009List      =   [];
        resultMsg.code010List      =   [];
        resultMsg.masterData       =   [];

        res.json({
            resultMsg
        });
        res.end()
    }
};

var insertEtpRegister = function(req, res) {
    
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        util.log('###ETP INSERT CALL JSONPARSE BEFORE>>>###'+req.body.data);
        var paramData = JSON.parse(req.body.data);
     
        paramData.user_id       =   req.session.user_id;
        //paramData.inst_cd       =   req.session.inst_cd;
        //paramData.inst_type_cd  =   req.session.inst_type_cd;
        
        //개발용 세팅
        paramData.inst_cd       =   '04654';
        paramData.inst_type_cd  =   '0001';

        util.log("###ETP INSERT CALL HUDLE1##",  req.session);
        if( req.session ==''){
            res.json({
                result: false
                ,msg: "잘못된 접속입니다."
            });
            res.end();
            return;
        }
        util.log("###ETP INSERT CALL HUDLE2##",  paramData);
        if(paramData.inst_type_cd !=='0001' && paramData.inst_type_cd !=='0002'){
            res.json({
                result: false
                ,msg: "발행사만 신청이 가능합니다."
            });
            res.end();
            return;
        }
        util.log("###ETP INSERT CALL HUDLE JUMP SUCCESS");
        paramData.list_req_date = paramData.listReqDate;
        paramData.list_date = paramData.listDate;

        var isin_code       = paramData.isin_code;      //단축코드
        var list_req_date   = paramData.list_req_date;  //상장신청일
        var inav_calc_yn    = paramData.inav_calc_yn;   //iNAV산출여부
        var idx_rec_yn      = paramData.idx_rec_yn ;    //기초지수입수여부
        var isin_stat_cd    = paramData.isin_stat_cd;   //상태
        var real_yn         = paramData.real_yn;        //실시간 지수반영여부
        
        // if(kor_for_type =='K'){
        //     this.paramData.idx_sym_code = paramData.kor_idx_sym_code;
        //     this.paramData.idx_nm       = paramData.kor_idx_nm;
        //     this.paramData.idx_inst_cd  = paramData.kor_idx_inst_cd;
        //     this.user_req               = paramData.kor_user_req;
        // }

        paramData.isin_stat_cd = "0001";

        if(isin_code !=="" &&isin_code !==undefined ){
            if(list_req_date=='' &&list_req_date !==undefined ){
                res.json({
                    result: false
                    ,msg: "종목코드 입력 시 상장신청일, 상장일이 입력되어야 합니다."
                });
                res.end();
                return;
            }
            
            if(list_date=='' &&list_date !==undefined ){
                res.json({
                    result: false
                    ,msg: "종목코드 입력 시 상장신청일, 상장일이 입력되어야 합니다."
                });
                res.end();
                return;
            }
        }

        if(inav_calc_yn !=="" &&inav_calc_yn !==undefined ){
            if(isin_code=='' &&isin_code !==undefined ){
                res.json({
                    result: false
                    ,msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
                });
                res.end();
                return;
            }

            if(list_req_date=='' &&list_req_date !==undefined ){
                res.json({
                    result: false
                    ,msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
                });
                res.end();
                return;
            }

            if(list_date=='' &&list_date !==undefined ){
                res.json({
                    result: false
                    ,msg: "iNAV산출여부가 'Y'일때 종목코드, 상장신청일, 상장일이 입력되어야 합니다."
                });
                res.end();
                return;
            }
        }

        if(idx_rec_yn=='Y'){
            paramData.isin_stat_cd  =   '0002';
        }
        if(idx_rec_yn=='N'){
            paramData.isin_stat_cd = '0001';
        }

        if(isin_stat_cd=='0002' &&isin_code==''&&isin_code==undefined){
            paramData.isin_stat_cd  =   '0003';
        }

        if(inav_calc_yn=='Y'){
            paramData.isin_stat_cd  =   '0004';
        }

        if(real_yn =='N'){
            paramData.ridx_inst_cd='';
            paramData.ridx_dist_sym_code='';
            paramData.ridx_holy_cd='';
            paramData.ridx_comp_dist_yn='';
            paramData.ridx_krx_dist_yn='';
            paramData.ridx_ksd_dist_yn='';
            paramData.ridx_mirae_dist_yn='';
            paramData.ex_hedge_yn='';
            paramData.ridx_dist_term='';
        }

        util.log('###ETP CALL JSONPARSE LAST>>>###'+JSON.stringify(paramData));
        var stmt = mapper.getStatement('EtpRegister', 'insertMaster', paramData, format);
        console.log(stmt);
        
        
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {

                res.json({
                    result: true
                });
                res.end();
    
            }).catch(err => {
                console.log("[error] EtpRegister.insertMaster Error while performing Query.", err);
                res.json({
                    result: false
                    ,msg: err
                });
                res.end();
            });
        });
};

var updateEtpRegister = function(req, res) {

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
   
    util.log('###ETP UPDATE JSONPARSE BEFORE>>>###'+req.body.data);
    var paramData = JSON.parse(req.body.data);
    
    paramData.user_id       =   req.session.user_id;
    //paramData.inst_cd       =   req.session.inst_cd;
    //paramData.inst_type_cd  =   req.session.inst_type_cd;
    
    //개발용 세팅
    paramData.inst_cd       =   '04654';
    paramData.inst_type_cd  =   '0001';
    
    paramData.list_req_date = paramData.listReqDate;
    paramData.list_date = paramData.listDate;

    if( req.session ==''){
        res.json({
            result: false
            ,msg: "잘못된 접속입니다."
        });
        res.end();
        return;
    }
    util.log('###ETP UPDATE JSONPARSE HUDLE1>>>###',req.session);
    var idx_file_nm = paramData.idx_file_nm;
    if(idx_file_nm!==null && idx_file_nm!=='' && idx_file_nm!==undefined){
        var idx = idx_file_nm.lastIndexOf("/");
        if(idx > 0 ){
            var idx_file_path =     idx_file_nm.substring(0, idx);
            var new_idx_file_nm =   idx_file_nm.substring(idx+1, idx_file_nm.length);
            paramData.idx_file_path     = idx_file_path;
            paramData.idx_file_nm       = new_idx_file_nm;
        }
    }
    var stmt='';


    Promise.using(pool.connect(), conn => {
        try{
            async.waterfall([    

                function( callback ) {
                    stmt = mapper.getStatement('EtpRegister', 'updateMaster', paramData, format);
                    conn.query(stmt, function( err, rows ) {  
                        if ( rows ) {
                            console.log( "updateMaster", rows );
                        }
                        if( err ) {
                            return callback( err );
                        }
                        callback( null, paramData );


                    });
                },
                function( data, callback ) {
                    stmt = mapper.getStatement('EtpRegister', 'insertMasterHistory', paramData, format);
                    conn.query(stmt, function( err, rows ) {
                        if ( rows ) {
                            console.log( "insertMasterHistory", rows );
                        }
                        if( err ) {
                            return callback( err );
                        }
                        callback( null, paramData );

                    });
                
                },
                ],function (err) {

                    if(err){
                        res.json({
                            result: false
                            ,msg: err
                        });
                    }
                    res.json({
                        result: true
                    });
                    res.end();
                });
        }catch(exception) {
        
        }
    });

};

module.exports.getEtpRegisterView = getEtpRegisterView;
module.exports.insertEtpRegister = insertEtpRegister;
module.exports.updateEtpRegister = updateEtpRegister;