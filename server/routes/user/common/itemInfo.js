
/*
 * 시장 정보
 *
 * @date 2019-04-19
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");
var async = require('async'); 
var util = require("util");


/* logging 추가함.  2019-06-10 */
var log = config.logger;

// 관심 종목 리스트 가져 오기
var getFavorItemInfo = function (req, res) {
    
    try {
        log.debug('itemInfo=>getFavorItemInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var params = {
            type_cd : req.session.type_cd,
            inst_cd : req.session.inst_cd,
            user_id : req.session.user_id
        };

        
        if (req.session.user_id != null) {
            var stmt = mapper.getStatement('common.item', 'getFavorItemInfo', params, {language:'sql', indent: '  '});

            Promise.using(pool.connect(), conn => {

                Promise.all([
                    conn.queryAsync(stmt)

                ]).then( rows => {
                    res.json({
                        success: true,
                        results: rows[0]
                    });
                    res.end();  
                }).catch(err => {
                    log.debug("Error while performing Query.", err);
                    res.json({
                        success: false,
                        message: err
                    });
                    res.end();
                });
            }); 
        } else {
            res.json({
                success: true,
                results: []
            });
            res.end();  
        }
    } catch (exception) {
        log.debug("error", exception);
    }   
    
};


// 관심 종목 삭제
var deleteFavorItem = function (req, res) {
    
    try {
        log.debug('itemInfo=>deleteFavorItem 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var params = {
            type_cd : req.session.type_cd,
            inst_cd : req.session.inst_cd,
            user_id : req.session.user_id,
            gubun   : req.body.params.gubun, 
            jisu_cd : req.body.params.jisu_cd,
            market_id : req.body.params.market_id
        };

        log.debug(JSON.stringify(req.body.params) + ":gubun");
        log.debug(req.body.gubun + ":gubun");
        if (req.session.user_id != null) {
            var stmt = mapper.getStatement('common.item', 'deleteFavorItem', params, {language:'sql', indent: '  '});

            log.debug(stmt);

            Promise.using(pool.connect(), conn => {
                conn.beginTransaction(txerr => {
                    Promise.all([
                        conn.queryAsync(stmt)

                    ]).then( rows => {
                        conn.commit();
                        res.json({
                            success: true
                        });
                        res.end();  
                    }).catch(err => {
                        conn.rollback();
                        log.debug("Error while performing Query.", err);
                        res.json({
                            success: false,
                            message: err
                        });
                        res.end();
                    });
                });
            }); 
        } else {
            res.json({
                success: false,
                results: []
            });
            res.end();  
        }
    } catch (exception) {
        log.debug("error", exception);
    }   
    
};



// 관심 종목 추가
var insertFavorItem = function (req, res) {
    
    try {
        log.debug('itemInfo=>insertFavorItem 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        

        var addFaverItems = req.body.params.addFavorItems;
       

        if (req.session.user_id != null) {

            Promise.using(pool.connect(), conn => {
                conn.beginTransaction(txerr => {
                    async.waterfall([    
                        function(callback) {
                            
                            async.forEachOf(addFaverItems, function(item, index) {
                                var params = {
                                    type_cd : req.session.type_cd,
                                    inst_cd : req.session.inst_cd,
                                    user_id : req.session.user_id,
                                    gubun  : item.GUBUN,
                                    F16012 : item.F16012,
                                    F16013 : item.F16013,
                                    market_id : item.MARKET_ID,
                                    large_type : item.LARGE_TYPE,
                                    middle_type : item.MIDDLE_TYPE,
                                };
                            
                                var stmt = mapper.getStatement('common.item', 'insertFavorItem', params, {language:'sql', indent: '  '});
                                
                                 log.debug(stmt);

                                conn.query(stmt, function( err, rows ) {
                                    if(err) {                                        
                                        conn.rollback();
                                        throw err;
                                    }                                                                    
                                })  
                                
                                if (index == addFaverItems.length-1) {
                                    callback(null, true);
                                }
                            });
                        },
                    ], 
                    function (err, data) {
                        // result now equals 'done'
                        conn.commit();
                        res.json({
                            success: true,
                        });
                        res.end();
                    }  
                );          
        
                }); 
            }); 
        } else {
            res.json({
                success: false,
                results: []
            });
            res.end();  
        }
    } catch (exception) {
        log.debug("error", exception);
    }   
    
};




/*
* ETF 리스트
*/
var getETFList = function (req, res) {
    try {
        log.debug('itemInfo=>getETFList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = { 
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id,
            type_cd : req.session.type_cd == null? '' : req.session.type_cd,
            inst_cd : req.session.inst_cd == null? '' : req.session.inst_cd,
            user_id : req.session.user_id == null? '' : req.session.user_id
            
        };

        log.debug("options", JSON.stringify(options));

        var stmt = mapper.getStatement('common.item', 'getETFList', options, {language:'sql', indent: '  '});
     

        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                log.debug("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        log.debug("err=>", exception);
    }
};


/*
* ETN 리스트
*/
var getETNList = function (req, res) {
    try {
        log.debug('itemInfo=>getETNList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id,
            type_cd : req.session.type_cd == null? '' : req.session.type_cd,
            inst_cd : req.session.inst_cd == null? '' : req.session.inst_cd,
            user_id : req.session.user_id == null? '' : req.session.user_id
        };

        log.debug("options", JSON.stringify(options));

        var stmt = mapper.getStatement('common.item', 'getETNList', options, {language:'sql', indent: '  '});
     

        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                res.json({
                    success: true,
                    results: rows
                });
                res.end();
            }).catch(err => {
                log.debug("Error while performing Query.", err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        log.debug("err=>", exception);
    }
};



/*
* Index 목록(관심종목)
*/
var getIndexList = function (req, res) {
    log.debug('itemInfo=>getInfoOpenReqList 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");

    var params = {
        large_type : req.session.large_type == null? '' : req.session.large_type,
        type_cd : req.session.type_cd == null? '' : req.session.type_cd,
        inst_cd : req.session.inst_cd == null? '' : req.session.inst_cd,
        user_id : req.session.user_id == null? '' : req.session.user_id
    };

    var stmt = mapper.getStatement('common.item', 'getIndexList', params, {language:'sql', indent: '  '});

    log.debug(stmt);

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(rows => {
            res.json({
                success: true,
                results: rows
            });
            res.end();
        }).catch(err => {
            log.debug("Error while performing Query.", err);
            res.json({
                success: false,
                message: err
            });
            res.end();
        });


    });
};




/*
* 운영사가 발행한 ETP 리스트
*/
var getPublishEtpList = function (req, res) {
    try {
        log.debug('itemInfo=>getPublishEtfList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = { 
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id,
            type_cd : req.session.type_cd == null? '' : req.session.type_cd,
            inst_cd : req.session.inst_cd == null? '' : req.session.inst_cd,
            user_id : req.session.user_id == null? '' : req.session.user_id,
            krx_cd : req.session.krx_cd == null? '' : req.session.krx_cd
            
        };

        log.debug("options", JSON.stringify(options));

        var query_id = "";

        // ETF 발행사 이면 
        if (req.session.type_cd == '0001') {
            query_id = "getPublishEtfList";
        } else if (req.session.type_cd == '0002') {
            query_id = "getPublishEtnList";
        } else if (req.session.type_cd == '9998' || req.session.type_cd == '9999') {
            query_id = "getPublishAllList";
        } 
        
        if (query_id != "") {
            var stmt = mapper.getStatement('common.item', query_id, options, {language:'sql', indent: '  '});
            
            log.debug("stmt", stmt);
            

            Promise.using(pool.connect(), conn => {
                conn.queryAsync(stmt).then(rows => {
                    res.json({
                        success: true,
                        results: rows
                    });
                    res.end();
                }).catch(err => {
                    log.debug("Error while performing Query.", err);
                    res.json({
                        success: false,
                        message: err
                    });
                    res.end();
                });

            });
        } else {
            res.json({
                success: true,
                results: []
            });
            res.end();
        }
    } catch(exception) {
        log.debug("err=>", exception);
    }
};



/*
* ETF, ETN 전체 종목 (발생사의 타입에 따라 처리 0001: ETF발행사, 0002: ETN 발행사)
*/
var getALLEtpList = function (req, res) {
    try {
        log.debug('itemInfo=>getALLEtpList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = { 
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id,
            type_cd : req.session.type_cd == null? '' : req.session.type_cd,
            inst_cd : req.session.inst_cd == null? '' : req.session.inst_cd,
            user_id : req.session.user_id == null? '' : req.session.user_id
            
        };

        log.debug("options", JSON.stringify(options));

        var query_id = "";

        // ETF 발행사 이면 
        if (req.session.type_cd == '0001') {
            query_id = "getETFList";
        } else if (req.session.type_cd == '0002') {
            query_id = "getETNList";
        } else if (req.session.type_cd == '9998' || req.session.type_cd == '9999') {
            query_id = "getAllETPList";
        }

        if (query_id != "") {
            var stmt = mapper.getStatement('common.item', query_id, options, {language:'sql', indent: '  '});
        

            Promise.using(pool.connect(), conn => {
                conn.queryAsync(stmt).then(rows => {
                    res.json({
                        success: true,
                        results: rows
                    });
                    res.end();
                }).catch(err => {
                    log.debug("Error while performing Query.", err);
                    res.json({
                        success: false,
                        message: err
                    });
                    res.end();
                });

            });
        } else {
            res.json({
                success: true,
                results: []
            });
            res.end(); 
        }
    } catch(exception) {
        log.debug("err=>", exception);
    }
};



module.exports.insertFavorItem = insertFavorItem;
module.exports.deleteFavorItem = deleteFavorItem;
module.exports.getFavorItemInfo = getFavorItemInfo;
module.exports.getETFList = getETFList; 
module.exports.getETNList = getETNList; 
module.exports.getIndexList = getIndexList; 
module.exports.getPublishEtpList = getPublishEtpList; 
module.exports.getALLEtpList = getALLEtpList; 
