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


// 각 카테고리별 시장 정보 리스트
var getMarketCtgCodeInfo = function (req, res, ctg_code) {
    
        console.log('marketInfo=>getMarketCtgCodeInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var params = {
            ctg_code : ctg_code,
        };

        var params = {
            ctg_code : ctg_code,
        };

        var stmt1 = mapper.getStatement('market', 'getMarketCtgCodeInfo', params, {language:'sql', indent: '  '});

        Promise.using(pool.connect(), conn => {

            Promise.all([
                conn.queryAsync(stmt1)

            ]).then( rows => {
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
        
        
};


/*
* 섹터에 속한 ETP 정보
*/
var getSectorEtpList = function (req, res) {
    try {

        
        console.log('marketInfo=>getSectorEtpList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
       
        var carousel_info = {
            carousel_cnt : 0,
            carousel_mod : 0
        };

        var carousel_data = [];
        var carousel_mod = [];
        // 캐러셀 나눌 분자는 5개로 처리
        var carousel_div = 5;
        var carousel_cnt = 0;
        var ctg_code = req.query.ctg_code;
        var etpLists = [];

    async.waterfall([    

        function(callback) {
            var params = {
                ctg_code : ctg_code,
            };

            var stmt = mapper.getStatement('market', 'getMarketCtgCodeInfo', params, {language:'sql', indent: '  '});

            Promise.using(pool.connect(), conn => {

                Promise.all([
                    conn.queryAsync(stmt)

                ]).then( rows => {
                    callback(null, rows[0]);         
                }).catch(err => {
                    throw err;
                });
            });  
        },

        function(ctgCodeList, callback) {
            console.log("ctg_code"+ ctgCodeList.length);

            
            carousel_info.carousel_cnt =  Math.floor(ctgCodeList.length / 5);
            carousel_info.carousel_mod =  ctgCodeList.length % 5;

            ctgCodeList.forEach(function(ctgCodeItem, index) {
            //for (let [index, ctgCodeItem] of ctgCodeList) {  
                
                
                var params = {
                    ctg_code : ctgCodeItem.ctg_code,
                    ctg_large_code : ctgCodeItem.ctg_large_code,
                };

                var ctg_name = ctgCodeItem.ctg_name;


            
                var stmt1 = mapper.getStatement('etpinfo', 'getEtpListByJisu', params, {language:'sql', indent: '  '});

            

                Promise.using(pool.connect(), conn => {

                    Promise.all([
                        conn.queryAsync(stmt1)

                    ]).then( rows => {
                        
                        /* ===================상단 데이터 생성 =========================*/
                        var total_amt = 0;
                        var etf_cnt = 0;
                        var etn_cnt = 0;
                        

                        if ((carousel_info.carousel_cnt * 5) > index) {

                            rows[0].forEach(function(item, idx) {
                                total_amt += item.f15028;
                                // ctf 구분자가 1과 2일 경우 
                                if (item.f16493 == '1' || item.f16493 == '2') {
                                    etf_cnt++; 
                                } else if (item.f16493 == '3' || item.f16493 == '4') {
                                    etn_cnt++; 
                                }
                            });

                            carousel_data.push({"name":ctg_name, "total_amt":total_amt, "etf_cnt": etf_cnt, "etn_cnt": etn_cnt});
                        } else {
                            carousel_mod.push({"name":ctg_name, "total_amt":total_amt, "etf_cnt": etf_cnt, "etn_cnt": etn_cnt});
                        }  
                        /* ===================상단 데이터 생성 완료 =========================*/
                        // 조회한 데이터 저장
                        etpLists.push(rows[0]);
                        
                        //console.log(ctgCodeList.length +"::" + index);
                        if (index == ctgCodeList.length-1) {
                            callback(null, etpLists, carousel_info, carousel_data, carousel_mod, ctgCodeList);   
                        }
                    }).catch(err => {
                        throw err; 
                    });

                             
                });
            });
            
        }
        ], function (err, etpLists, carousel_info, carousel_data, carousel_mod, ctgCodeList) {
            // result now equals 'done'
            res.json({
                success: true,
                etpLists: etpLists,
                carousel_info: carousel_info,
                carousel_data: carousel_data,
                carousel_mod: carousel_mod,
                ctgCodeList: ctgCodeList
            });
            res.end();
        });

        
    } catch (exception) {

        util.log("Error while performing Query.", exception);
        res.json({
            success: false,
            message: exception
        });
        res.end();
    }    
};


module.exports.getMarketCtgCodeInfo = getMarketCtgCodeInfo;
module.exports.getSectorEtpList = getSectorEtpList;