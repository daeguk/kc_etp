
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

module.exports.getFavorItemInfo = getFavorItemInfo;