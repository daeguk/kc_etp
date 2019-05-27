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
        // var options = {id:'admin'};
        
        var options = { 
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id,
            inst_cd : req.session.inst_cd,
          };

        util.log("options", JSON.stringify(options));

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
        // var options = {id:'admin'};
        
        var options = { 
            inst_cd : req.session.inst_cd
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
        // var options = {id:'admin'};
        
        var options = { 
            inst_cd : req.session.inst_cd
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
            inst_cd : req.session.inst_cd
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
            inst_cd : req.session.inst_cd
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
            "inst_cd":  req.session.inst_cd
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
        util.log("params.seqValues:::", JSON.stringify(req.session));

        var params = { 
                        "user_id":  req.session.user_id,
                        "seqValues":  req.query.seqValues
                       };

        util.log("params:::", JSON.stringify(params));

        var stmt = mapper.getStatement('EtpRegister', 'deleteEtpApply', params, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    result: true
                });
                res.end();
            }).catch(err => {
                util.log("Error while deleteEtpApply.", err);
                res.json({
                    result: false
                    ,msg: err
                });
                res.end();
            });

        });
    } catch(exception) {
        util.log("err=>", exception);
    }
};



module.exports.getEtpApplyList = getEtpApplyList;
module.exports.getEtpApplyDistCnt = getEtpApplyDistCnt;
module.exports.getEtpApplyIndexCnt = getEtpApplyIndexCnt;
module.exports.getEtpApplyCodeCnt = getEtpApplyCodeCnt;
module.exports.getEtpApplyInavCnt = getEtpApplyInavCnt;
module.exports.getCompContactList = getCompContactList;
module.exports.getIdxList = getIdxList;
module.exports.getRidxList = getRidxList;
module.exports.deleteEtpApply = deleteEtpApply;