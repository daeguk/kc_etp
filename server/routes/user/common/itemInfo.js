
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


// 관심 종목 리스트 가져 오기
var getFavorItemInfo = function (req, res) {
    
    try {
        console.log('marketInfo=>getFavorItemInfo 호출됨.');

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
                    util.log("Error while performing Query.", err);
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
        util.log("error", exception);
    }   
    
};


// 관심 종목 삭제
var deleteFavorItem = function (req, res) {
    
    try {
        console.log('marketInfo=>deleteFavorItem 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var params = {
            type_cd : req.session.type_cd,
            inst_cd : req.session.inst_cd,
            user_id : req.session.user_id,
            jisu_cd : req.body.params.jisu_cd,
            market_id : req.body.params.market_id
        };

        
        if (req.session.user_id != null) {
            var stmt = mapper.getStatement('common.item', 'deleteFavorItem', params, {language:'sql', indent: '  '});

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
                        util.log("Error while performing Query.", err);
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
        util.log("error", exception);
    }   
    
};



// 관심 종목 추가
var insertFavorItem = function (req, res) {
    
    try {
        console.log('marketInfo=>insertFavorItem 호출됨.');

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
                                
                                 console.log(stmt);

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
        util.log("error", exception);
    }   
    
};

module.exports.insertFavorItem = insertFavorItem;
module.exports.deleteFavorItem = deleteFavorItem;
module.exports.getFavorItemInfo = getFavorItemInfo;