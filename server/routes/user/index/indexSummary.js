/*
 * ETP REGISTER 위한 라우팅 함수 정의
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

var util = require("util");
var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs'); 


var getIndexSummaryInfo = function (req, res) {
    try {
        console.log('indexSummary=>getIndexSummaryInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
       
        var params = {
            large_type : req.session.large_type,
        };


        var stmt1 = mapper.getStatement('index', 'indexSummaryLately', params, {language:'sql', indent: '  '});
        var stmt2 = //mapper.getStatement('index', 'indexSummaryResult', params, {language:'sql', indent: '  '});

        stmt2 ="SELECT BAS.F16013";
        stmt2 +="    ,BAS.F16002";
        stmt2 +="    ,BAS.LARGE_TYPE";
        stmt2 +="    ,BAS.MIDDLE_TYPE";
        stmt2 +="    ,HIS.F12506";
        stmt2 +="    ,HIS.F15009";
        stmt2 +="    ,HIS.F15010";
        stmt2 +="    ,HIS.F15011";
        stmt2 +="    ,HIS.F15001";
        stmt2 +="    ,HIS.F15472";
        stmt2 +="    ,HIS.F15006";
        stmt2 +="    ,HIS.F15004";
        stmt2 +="    ,HIS.F15015";
        stmt2 +="    ,HIS.F15023"; 
        stmt2 +=" FROM (SELECT A.F16013";
        stmt2 +="            ,A.F16002";
        stmt2 +="            ,A.LARGE_TYPE";
        stmt2 +="            ,A.MIDDLE_TYPE";
        stmt2 +="            ,A.MARKET_ID";
        stmt2 +="        FROM kc_etp.td_index_basic A,";
        stmt2 +="            (SELECT  A.F16013";
        stmt2 +="                FROM (SELECT basic.F16013";
        stmt2 +="                            , (SELECT F15009";
        stmt2 +="                                FROM (SELECT F16013, F12506, F15009";
        stmt2 +="                                , (CASE @vF16013 WHEN a.F16013 THEN @rownum:=@rownum+1 ELSE @rownum:=1 END) rnum ";
        stmt2 +="                                , (@vF16013:= a.F16013) vF16013";
        stmt2 +="                            FROM td_index_hist a";
        stmt2 +="                            INNER JOIN (SELECT @vF16013:='', @rownum:=0 FROM DUAL) b";
        stmt2 +="                            where  F12506 >= date_format(DATE_SUB(now(), INTERVAL 1 YEAR), '%Y%m%d')";
        stmt2 +="                            order by F16013, F12506 DESC) A";
        stmt2 +="                            where A.rnum = 1";
        stmt2 +="                            And A.F16013 = basic.F16013) maxData";
        stmt2 +="                            , (SELECT F15009 ";
        stmt2 +="                                FROM (SELECT F16013, F12506, F15009";
        stmt2 +="                                            , (CASE @vF16013 WHEN a.F16013 THEN @rownum:=@rownum+1 ELSE @rownum:=1 END) rnum ";
        stmt2 +="                                            , (@vF16013:= a.F16013) vF16013";
        stmt2 +="                                        FROM td_index_hist a";
        stmt2 +="                                        INNER JOIN (SELECT @vF16013:='', @rownum:=0 FROM DUAL) b";
        stmt2 +="                                        where F12506 >= date_format(DATE_SUB(now(), INTERVAL 1 YEAR), '%Y%m%d')";
        stmt2 +="                                        order by F16013, F12506 ASC) A";
        stmt2 +="                                where A.rnum = 1";
        stmt2 +="                                and A.F16013 = basic.F16013) minData";
        stmt2 +="                        FROM td_index_basic basic";
        stmt2 +="                        WHERE basic.large_type='"+params.large_type+"') A";
        stmt2 +="                        group by F16013";
        stmt2 +="                order by max(ifnull(A.maxData/A.minData, 0)) desc";
        stmt2 +="                limit 0, 1)B";
        stmt2 +="        WHERE A.F16013 = B.F16013";
        stmt2 +="    ) BAS,";
        stmt2 +="    kc_etp.td_index_hist HIS";
        stmt2 +=" WHERE BAS.F16013 = HIS.F16013";
        stmt2 +="    AND BAS.MARKET_ID = HIS.MARKET_ID";
        stmt2 +="    AND BAS.large_type='"+params.large_type+"'";
        stmt2 +=" ORDER BY HIS.F12506 DESC";
        stmt2 +=" limit 0, 1";

        Promise.using(pool.connect(), conn => {

            Promise.all([
                conn.queryAsync(stmt1),
                conn.queryAsync(stmt2)
            ]).then( rows => {
                res.json({
                    success: true,
                    results1: rows[0],
                    results2: rows[1],
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


            /*conn.queryAsync(stmt).then(rows => {
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
            });*/


        });
    } catch (exception) {
        util.log("err==>", exception);
    }    
};

var getInfoOpenReqList = function (req, res) {
    try {
        console.log('indexSummary=>getInfoOpenReqList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var jisu_cd = '';
        if (req.query.jisu_cd) {
            jisu_cd = req.query.jisu_cd;
        }
        var params = {
            large_type : req.session.large_type,
            jisu_cd : jisu_cd,
        };

        var stmt = mapper.getStatement('index', 'indexReqList', params, {language:'sql', indent: '  '});

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
        util.log("err", exception);
    }
};


var getindexSubscribeList = function (req, res) {
    try {
        console.log('indexSummary=>getindexSubscribeList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var jisu_cd = '';
        if (req.query.jisu_cd) {
            jisu_cd = req.query.jisu_cd;
        }
        var params = {
            large_type : req.session.large_type,
            jisu_cd : jisu_cd,
        };

        var stmt = mapper.getStatement('index', 'getindexSubscribeList', params, {language:'sql', indent: '  '});

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
        util.log("err", exception);
    }
};



var updateIndexOpenYn = function(req, res) {
    
    try {
        console.log('indexSummary=>updateIndexOpenYn 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var params = {
            JISU_ID : req.body.params.JISU_ID,
            INST_CD : req.body.params.INST_CD
        }

        // 세션 로그인키 바인딩
        if (req.session.loginkey) {
            params.UPD_ID = req.session.loginkey;
        } else {
            params.UPD_ID = 'system';
        }

        // 공개 처리 플래그
        if (req.body.params.reqFlag == true) {
            params.FLAG = '2';
        } else {
            params.FLAG = '0';
        }

        util.log("req.body.params.reqFlag", JSON.stringify(params));
        
        
        var stmt = mapper.getStatement('index', 'updateIndexOpenYn', params, {language:'sql', indent: '  '});
    
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
    } catch(err) {
        util.log("err=>", err);
    }    
}


/*
* 관리지 목록
*/
var getInfoIndexList = function (req, res) {
    console.log('indexSummary=>getInfoOpenReqList 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");

    var params = {
        large_type : req.session.large_type,
    };

    var stmt = mapper.getStatement('index', 'getInfoIndexList', params, {language:'sql', indent: '  '});

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
};

/*
* 지수 요약정보 그래프 데이터
*/
var getIndexSummaryHist = function (req, res) {
    try {
        console.log('indexSummary=>getindexsummaryhist 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        console.log("req.query");
        console.log(req.query);
        var options = {
            large_type : req.session.large_type,
            JISU_ID: req.query.jisu_id,
        };

        var stmt = mapper.getStatement('index', 'selectIndexSummaryHist', options, {language:'sql', indent: '  '});
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

/*
* 지수 기본 정보 
*/
var getIndexBaseInfo = function (req, res) {
    try {
        console.log('indexSummary=>getIndexBaseInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexBaseInfo', options, {language:'sql', indent: '  '});
        
        util.log("getIndexBaseInfo:" + stmt);

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

/*
* 지수 기본 정보 그래프 데이터
*/
var getIndexEtpHistoryData = function (req, res) {
    try {
        console.log('indexSummary=>getIndexEtpHistoryData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id,
            term: req.query.term
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexEtpHistoryData', options, {language:'sql', indent: '  '});
     

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



/*
* 지수에 속한 ETP 정보
*/
var getIndexInEtpInfo = function (req, res) {
    try {
        console.log('indexSummary=>getIndexInEtpInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexInEtpInfo', options, {language:'sql', indent: '  '});
     

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



/*
* 지수ETF 리스트
*/
var getETFList = function (req, res) {
    try {
        console.log('indexSummary=>getETFList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getETFList', options, {language:'sql', indent: '  '});
     

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


/*
* 지수ETN 리스트
*/
var getETNList = function (req, res) {
    try {
        console.log('indexSummary=>getETNList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getETNList', options, {language:'sql', indent: '  '});
     

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


/*
* 비중 정보 리스트 
*/
var getIndexImportanceList = function (req, res) {
    try {
        console.log('indexSummary=>getIndexImportanceList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = ""; //mapper.getStatement('index', 'getIndexImportanceList', options, {language:'sql', indent: '  '});
        stmt += "SELECT ITEM.ISIN_CODE ";
        stmt += " , ITEM.JOING_NM ";
        stmt += " , ITEM.ITEM_AMT/TOT_ITEM.TOT_AMT PERCNT";
        stmt += " , ITEM.GUBUN ";  	 
        stmt += " FROM(SELECT MAP.ISIN_CODE ";
        stmt += "         ,MAP.F16002 JOING_NM ";
        stmt += "         ,ROUND((COMP.F03003 * COMP.F30812 * COMP.F30813 * COMP.MAP.CEILING_PERCNT * MAP.STYLE_INCLUD_PERCNT)) ITEM_AMT ";
        stmt += "         ,MAP.GUBUN ";
        stmt += "         FROM (SELECT F12506 ";
        stmt += "                     , ISIN_CODE ";
        stmt += "                     , UP_CODE ";
        stmt += "                     , CEILING_PERCNT ";
        stmt += "                     , STYLE_INCLUD_PERCNT ";
        stmt += "                     , GUBUN ";
        stmt += "                     , F16002 ";
        stmt += "                 FROM (SELECT A.F12506 ";
        stmt += "                         , A.ISIN_CODE ";
        stmt += "                         , A.UP_CODE ";
        stmt += "                         , A.CEILING_PERCNT ";
        stmt += "                         , A.STYLE_INCLUD_PERCNT ";
        stmt += "                         , A.GUBUN ";
        stmt += "                         , B.F16002 ";
        stmt += "                         , (CASE @vISIN_CODE WHEN A.ISIN_CODE THEN @rownum:=@rownum+1 ELSE @rownum:=1 END) rnum ";
        stmt += "                         , (@vISIN_CODE:=A.ISIN_CODE) vISIN_CODE ";
        stmt += "                         FROM m168uidxmap A ";
        stmt += "                     INNER JOIN td_kspjong_basic B ";
        stmt += "                         ON A.ISIN_CODE = B.F16012  ";
        stmt += "                     INNER JOIN (SELECT @vISIN_CODE:='', @rownum:=0 FROM DUAL) C ";
        stmt += "                     ORDER BY A.ISIN_CODE, A.F12506 DESC ";
        stmt += "                     ) a ";
        stmt += "         WHERE a.rnum = 1 ";
        stmt += "         AND UP_CODE = CONCAT(IF(substr('"+options.jisu_cd+"', 1, 3) = '600', 'MFI', 'WFN'), substr('"+options.jisu_cd+"', 3))) MAP ";
        stmt += "         INNER JOIN m168uidxcomp COMP ";
        stmt += "         ON MAP.F12506 = COMP.F12506 ";
        stmt += "         AND MAP.ISIN_CODE = COMP.F16013 ";
        stmt += "         AND MAP.GUBUN = COMP.GUBUN) ITEM ";
        stmt += "  INNER JOIN (SELECT SUM(ROUND((COMP.F03003 * COMP.F30812 * COMP.F30813 * COMP.MAP.CEILING_PERCNT * MAP.STYLE_INCLUD_PERCNT))) TOT_AMT ";
        stmt += "         FROM (SELECT F12506 ";
        stmt += "                     , ISIN_CODE ";
        stmt += "                     , UP_CODE ";
        stmt += "                     , CEILING_PERCNT ";
        stmt += "                     , STYLE_INCLUD_PERCNT ";
        stmt += "                     , GUBUN ";
        stmt += "                     , F16002 ";
        stmt += "                 FROM (SELECT A.F12506 ";
        stmt += "                         , A.ISIN_CODE ";
        stmt += "                         , A.UP_CODE ";
        stmt += "                         , A.CEILING_PERCNT ";
        stmt += "                         , A.STYLE_INCLUD_PERCNT ";
        stmt += "                         , A.GUBUN ";
        stmt += "                         , B.F16002 ";
        stmt += "                         , (CASE @vISIN_CODE WHEN A.ISIN_CODE THEN @rownum:=@rownum+1 ELSE @rownum:=1 END) rnum ";
        stmt += "                         , (@vISIN_CODE:=A.ISIN_CODE) vISIN_CODE ";
        stmt += "                         FROM m168uidxmap A ";
        stmt += "                     INNER JOIN td_kspjong_basic B ";
        stmt += "                         ON A.ISIN_CODE = B.F16012  ";
        stmt += "                     INNER JOIN (SELECT @vISIN_CODE:='', @rownum:=0 FROM DUAL) C ";
        stmt += "                     ORDER BY A.ISIN_CODE, A.F12506 DESC ";
        stmt += "                     ) a ";
        stmt += "         WHERE a.rnum = 1 ";
        stmt += "         AND UP_CODE = CONCAT(IF(substr('"+options.jisu_cd+"', 1, 3) = '600', 'MFI', 'WFN'), substr('"+options.jisu_cd+"', 3))) MAP ";
        stmt += "         INNER JOIN m168uidxcomp COMP ";
        stmt += "         ON MAP.F12506 = COMP.F12506 ";
        stmt += "         AND MAP.ISIN_CODE = COMP.F16013 ";
        stmt += "         AND MAP.GUBUN = COMP.GUBUN) TOT_ITEM";
        stmt += "   order by ITEM.ITEM_AMT/TOT_ITEM.TOT_AMT desc";
     
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



module.exports.getIndexSummaryInfo = getIndexSummaryInfo;
module.exports.getInfoOpenReqList = getInfoOpenReqList;
module.exports.updateIndexOpenYn = updateIndexOpenYn;
module.exports.getInfoIndexList = getInfoIndexList;
module.exports.getIndexSummaryHist = getIndexSummaryHist;
module.exports.getIndexBaseInfo = getIndexBaseInfo;
module.exports.getIndexEtpHistoryData = getIndexEtpHistoryData;
module.exports.getIndexInEtpInfo = getIndexInEtpInfo;
module.exports.getindexSubscribeList = getindexSubscribeList;
module.exports.getETFList = getETFList; 
module.exports.getETNList = getETNList; 
module.exports.getIndexImportanceList = getIndexImportanceList;