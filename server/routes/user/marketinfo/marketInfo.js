/*
 * 시장 정보
 *
 * @date 2019-04-19
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

var util = require("util");


var getMarketCtgCodeInfo = function (req, res) {
    try {
        console.log('marketInfo=>getMarketCtgCodeInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
       
        var params = {
            ctg_code : req.query.ctg_code,
        };


        var stmt1 = mapper.getStatement('market', 'getMarketCtgCodeInfo', params, {language:'sql', indent: '  '});

    

        Promise.using(pool.connect(), conn => {

            Promise.all([
                conn.queryAsync(stmt1)

            ]).then( rows => {
                res.json({
                    success: true,
                    results: rows,
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
    } catch (exception) {
        util.log("err==>", exception);
    }    
};


module.exports.getMarketCtgCodeInfo = getMarketCtgCodeInfo;