/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");
/* 
 * etp 신청 현황  조회한다.
 * 
 *  *  */
var getEtpApplyList = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var options = { 
            inst_cd : req.session.inst_cd == '04870' ? '' : req.session.inst_cd,
            };
        util.log("options", JSON.stringify(options.inst_cd));
        var stmt = mapper.getStatement('EtpRegister', 'selectEtpApplyList', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
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
    } catch(exception) {
        util.log("err=>", exception);
    }
};
var getEtpApplyDistCnt = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyDistCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var options = { 
            inst_cd : req.session.inst_cd == '04870' ? '' : req.session.inst_cd
         };
        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyDistCnt', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
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
    } catch(exception) {
        util.log("err=>", exception);
    }
};
var getEtpApplyIndexCnt = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyIndexCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var options = { 
            inst_cd : req.session.inst_cd == '04870' ? '' : req.session.inst_cd
         };
        util.log("options", JSON.stringify(options));
        var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyIndexCnt', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
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
    } catch(exception) {
        util.log("err=>", exception);
    }
};
var getEtpApplyCodeCnt = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyCodeCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
         var options = { 
            inst_cd : req.session.inst_cd == '04870' ? '' : req.session.inst_cd
         };
        util.log("options", JSON.stringify(options));
        var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyCodeCnt', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
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
    } catch(exception) {
        util.log("err=>", exception);
    }
};
var getEtpApplyInavCnt = function (req, res) {
    try {
        console.log('EtpApply=>getEtpApplyInavCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
         var options = { 
            inst_cd : req.session.inst_cd == '04870' ? '' : req.session.inst_cd
         };
        util.log("options", JSON.stringify(options));
        var stmt = mapper.getStatement('EtpRegister', 'getEtpApplyInavCnt', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
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
    } catch(exception) {
        util.log("err=>", exception);
    }
};
var getCompContactList = function (req, res) {
    try {
        console.log('EtpApply=>getCompContactList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var options = { 
            inst_cd : req.session.inst_cd == '04870' ? '' : req.session.inst_cd,
         };
        util.log("options", JSON.stringify(options));
        var stmt = mapper.getStatement('EtpRegister', 'getCompContactList', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
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
    } catch(exception) {
        util.log("err=>", exception);
    }
};
var getIdxList = function (req, res) {
    try {
        console.log('EtpApply=>getIdxList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        
        var options = { 
                       "idxTable":  req.query.idxTable,
                       "idx_sym_code":  req.query.idx_sym_code
                       };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('EtpRegister', 'getIdxList', options, {language:'sql', indent: '  '});
        console.log(stmt);

        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
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
    } catch(exception) {
        util.log("err=>", exception);
    }
};
var getRidxList = function (req, res) {
    try {
        console.log('EtpApply=>getRidxList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        
        var options = { 
                       "market_id":  req.query.market_id,
                       "ridx_dist_sym_code":  req.query.ridx_dist_sym_code
                       };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('EtpRegister', 'getRidxList', options, {language:'sql', indent: '  '});
        console.log(stmt);


        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
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
    } catch(exception) {
        util.log("err=>", exception);
    }
};
var deleteEtpApply = function (req, res) {
    try {
        console.log('EtpApply=>deleteEtpApply 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var params = { 
                        "user_id"   :   req.session.user_id,
                        "seqValues" :   req.query.seqValues,
                        "seq"       :  "",
                        "type_cd"   :   req.session.type_cd
                       };
        //*** 운영반영시 주석제거***               
        // if(params.type_cd !=='0002'){
        //     res.json({
        //         result: false
        //         ,msg: "코스콤만 삭제가 가능합니다."
        //     });
        //     res.end();
        //     return;
        // }

        var stmt = "";
        var async = require('async');
        var format = { language: 'sql', indent: ' ' };
        function replacer(name, val) {
            if ( val == null || val==undefined ) {
                return ""; 
            }  else {
                return val; // return unchanged
            }
        }
   
        async.forEachOfLimit(req.query.seqValues, 1, function(seq, index, cb) {
        console.log(index + ': ' + seq);

           Promise.using(pool.connect(), conn => {  
                async.waterfall([
                    function( callback ) { //삭제
                        params.seq = seq;
                        console.log(params.seq);
                        stmt = mapper.getStatement('EtpRegister', 'deleteEtpApply' ,params, format);
                        console.log(stmt);
                        conn.query(stmt, function( err, rows ) {
                            if ( rows ) {
                                console.log( "deleteEtpApply", rows );
                            } if( err ) {
                                return callback( err );
                            }
                            callback( null, params );
                        });
                    },
                    function( data, callback ) { //db 마스터조회

                        stmt = mapper.getStatement('EtpRegister', 'getMaster', params, format);
                        console.log(stmt);
                        conn.query(stmt, function( err, rows ) {
                            if ( rows ) {
                                params.dbMasterData = rows[0];
                            }
                            if( err ) {
                                return callback( err );
                            }
                            callback( null, params );
                        });
                    },
                    function( data, callback ) { //히스토리 시퀀스확인

                        stmt = mapper.getStatement('EtpRegister', 'getMasterHistoryNextSeq', params, format);
                        console.log(stmt);
                        conn.query(stmt, function( err, rows ) {
                            if ( rows ) {
                                params.dbMasterData.seq_hist = rows[0].SEQ_HIST;
                            }
                            if( err ) {
                                return callback( err );
                            }
                            callback( null, params );
                        });
                    },
                    function( data, callback ) { //히스토리쌓기
                      
                        stmt = mapper.getStatement('EtpRegister', 'insertMasterHistory',  JSON.parse(JSON.stringify(params.dbMasterData, replacer)), format);
                        console.log(stmt);
                        conn.query(stmt, function( err, rows ) {
                            if ( rows ) {
                                console.log( "insertMasterHistory", rows );
                            }
                            if( err ) {
                                return callback( err );
                            }
                            callback( null, params );
                        });
                    }
                ],function (err) {
                    if(err){
                        console.log("[err] EtpRegister.deleteEtpApply Error while performing Query.", err);
                        res.json({
                            result: false
                            ,msg: err
                        });
                        res.end();
                    }else{
                        console.log(index + ": done")
                        cb();
                    }
                   
                });
            });  
        }, function() {
            console.log('ALL done');
            res.json({
                result: true
            });
            res.end();
        });
        
    }catch(exception) {
            util.log("err=>", exception);
            res.json({
                result: false
                ,msg: exception
            });
            res.end();
    }    
}    

module.exports.getEtpApplyList = getEtpApplyList;
module.exports.getEtpApplyDistCnt = getEtpApplyDistCnt;
module.exports.getEtpApplyIndexCnt = getEtpApplyIndexCnt;
module.exports.getEtpApplyCodeCnt = getEtpApplyCodeCnt;
module.exports.getEtpApplyInavCnt = getEtpApplyInavCnt;
module.exports.getCompContactList = getCompContactList;
module.exports.getIdxList = getIdxList;
module.exports.getRidxList = getRidxList;
module.exports.deleteEtpApply = deleteEtpApply;