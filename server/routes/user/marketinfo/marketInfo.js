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



/*
* ETP 시장 정보
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
            

        Promise.using(pool.connect(), conn => {

            async.waterfall([    
                function(callback) {
                    var params = {
                        ctg_code : ctg_code,
                    };
                
                    var stmt = mapper.getStatement('market', 'getMarketCtgCodeInfo', params, {language:'sql', indent: '  '});
                    
                    conn.query(stmt, function( err, rows ) {
                        callback(null, rows);                                 
                    })              
                },

                function(ctgCodeList, callback) {
                    console.log("ctg_code"+ ctgCodeList.length);
                
                                        
                    carousel_info.carousel_cnt =  Math.floor(ctgCodeList.length / carousel_div);
                    carousel_info.carousel_mod =  ctgCodeList.length % carousel_div;
                
                    //util.log("carousel_info.carousel_cnt:", carousel_info.carousel_cnt);
                    //util.log("carousel_info.carousel_mod:", carousel_info.carousel_mod);
                
                    // 항목 갯수 만큼 쿼리 
                    async.forEachOf( ctgCodeList, function ( ctgCodeItem, index){                                
                        var params = {
                            ctg_code : ctgCodeItem.ctg_code,
                            ctg_large_code : ctgCodeItem.ctg_large_code,
                        };
                        
                        //console.log("ctgCodeItem.ctg_large_code,"+ctgCodeItem.ctg_large_code);
                        var ctg_name = ctgCodeItem.ctg_name;
                
                
                        var stmt = mapper.getStatement('etpinfo', 'getEtpListByJisu', params, {language:'sql', indent: '  '});


                        conn.query(stmt, function( err, rows ) {
                            /* ===================상단 데이터 생성 =========================*/
                            var total_amt = 0;
                            var etf_cnt = 0;
                            var etn_cnt = 0;
                            

                            //util.log("(carousel_info.carousel_cnt * 5):" , (carousel_info.carousel_cnt * 5));
                            //util.log("index" , index);


                            if ((carousel_info.carousel_cnt * 5) > index) {
                                //util.log("data:=====================", index);

                                async.forEachOf( rows, function ( item, idx){ 
                                    total_amt += Number(item.f15028);
                                    console.log("tot_amt"+ item.f15028);
                                    // ctf 구분자가 1과 2일 경우 
                                    if (item.f16493 == '1' || item.f16493 == '2') {
                                        etf_cnt++; 
                                    } else if (item.f16493 == '3' || item.f16493 == '4') {
                                        etn_cnt++; 
                                    }
                                });

                                carousel_data.push({"ctg_code":ctgCodeItem.ctg_code, "name":ctg_name, "total_amt":total_amt, "etf_cnt": etf_cnt, "etn_cnt": etn_cnt});
                            } else {
                                //util.log("mode:=====================", index);
                                async.forEachOf( rows, function ( item, idx){                                    
                                    total_amt += Number(item.f15028);
                                    console.log("tot_amt"+ item.f15028);
                                    // ctf 구분자가 1과 2일 경우 
                                    if (item.f16493 == '1' || item.f16493 == '2') {
                                        etf_cnt++; 
                                    } else if (item.f16493 == '3' || item.f16493 == '4') {
                                        etn_cnt++; 
                                    }
                                });
                                carousel_mod.push({"ctg_code":ctgCodeItem.ctg_code, "name":ctg_name, "total_amt":total_amt, "etf_cnt": etf_cnt, "etn_cnt": etn_cnt});
                            }  
                            /* ===================상단 데이터 생성 완료 =========================*/
                            // 조회한 데이터 저장
                            etpLists.push(rows);
                            
                            //console.log(ctgCodeList.length +"::" + index);
                            if (index == ctgCodeList.length-1) {
                                callback(null, etpLists, carousel_info, carousel_data, carousel_mod, ctgCodeList);   
                            }                                
                        })
                    });
                }
            ], 
                function (err, etpLists, carousel_info, carousel_data, carousel_mod, ctgCodeList) {
                    // result now equals 'done'
            
                    //carousel_data = carousel_data.sort(carouselSort);
            
                    //util.log("carousel_mod:", carousel_mod.length);
                    res.json({
                        success: true,
                        etpLists: etpLists,
                        carousel_info: carousel_info,
                        carousel_data: carousel_data,
                        carousel_mod: carousel_mod,
                        ctgCodeList: ctgCodeList
                    });
                    res.end();
                }  
            );          
        });
    } catch (exception) {

        util.log("Error while performing Query.", exception);
        res.json({
            success: false,
            message: exception
        });
        res.end();
    }
    
    function carouselSort(a, b) {
        if(a.ctg_code == b.ctg_code){ return 0} return  a.ctg_code > b.ctg_code ? 1 : -1;
    }
      
      
};


/*
* INDEX 시장 정보
*/
var getMarketIndexList = function (req, res) {
    try {

        
        console.log('marketInfo=>getMarketIndexList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");       
        var graphinfos = [];
        var krsLists = [];
        var fnGuideLists = [];
            

        Promise.using(pool.connect(), conn => {

            async.waterfall([    
                function(callback) {
                    var params = {
                        com_mst_cd : "COM003",
                    };
                    /* 시장 대표 정보 쿼리 KOSPI, KOSPI200, KOSDAQ, KOSDAQ150*/
                    var stmt = mapper.getStatement('etpinfo', 'getIndexInfoByCodeDtl', params, {language:'sql', indent: '  '});
                    
                    conn.query(stmt, function( err, rows ) {
                        callback(null, rows);                                 
                    })              
                },
                
                function(marketRepList, callback) {
                
                    // 항목 갯수 만큼 쿼리 
                    async.forEachOf( marketRepList, function ( marketItem, index){                                
                        var params = {
                            f16013 : marketItem.f16013,
                            market_id : marketItem.market_id,
                        };
                
                        util.log("현재가=", marketItem.f15001)
                        var stmt = mapper.getStatement('common.item', 'getTodayIntraInfo', params, {language:'sql', indent: '  '});


                        conn.query(stmt, function( err, rows ) {
                            
                            /* ===================상단 데이터 생성 완료 =========================*/
                            // 조회한 데이터 저장
                            graphinfos.push(rows);
                            
                            //console.log(ctgCodeList.length +"::" + index);
                            if (index == marketRepList.length-1) {
                                callback(null, marketRepList, graphinfos);   
                            }                                
                        })
                    });
                },
                function(marketRepList, graphinfos, callback) {

                    var dataCnt = 0;
                    // KRS INDEX 정보 추출
                    var params = {
                        large_type : 'KRX'
                    };

                    var stmt = mapper.getStatement('common.item', 'getIndexBaseInfo', params, {language:'sql', indent: '  '});
                    // 대입 문자 치환
                    stmt = stmt.replace(/\: =/g,':='); 

                    conn.query(stmt, function( err, rows ) {
                            
                        /* ===================상단 데이터 생성 완료 =========================*/
                        // 조회한 데이터 저장
                        krsLists.push(rows);

                        dataCnt++;
                        
                        if (dataCnt == 2) {
                            callback(null, marketRepList, graphinfos, krsLists, fnGuideLists);   
                        }
                    })

                    // FNGUIDE INDEX 정보 추출
                    params = {
                        large_type : 'FNGUIDE'
                    };

                    stmt = mapper.getStatement('common.item', 'getIndexBaseInfo', params, {language:'sql', indent: '  '});
                    // 대입 문자 치환
                    stmt = stmt.replace(/\: =/g,':='); 

                    conn.query(stmt, function( err, rows ) {
                            
                        /* ===================상단 데이터 생성 완료 =========================*/
                        // 조회한 데이터 저장
                        fnGuideLists.push(rows);
                        dataCnt++;

                        if (dataCnt == 2) {
                            callback(null, marketRepList, graphinfos, krsLists, fnGuideLists);   
                        }
                    })

                    
                }
            ], 
                function (err, marketRepList, graphinfos, krsLists, fnGuideLists) {
                    // result now equals 'done'
            
                    res.json({
                        success: true,
                        marketRepList: marketRepList,
                        graphinfos: graphinfos,
                        krsLists: krsLists, 
                        fnGuideLists: fnGuideLists
                    });
                    res.end();
                }  
            );          
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





module.exports.getSectorEtpList = getSectorEtpList;
module.exports.getMarketIndexList = getMarketIndexList;