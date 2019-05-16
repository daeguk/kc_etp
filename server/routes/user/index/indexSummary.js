/*
 * 인덱스 관리 요약 정보 처리
 *
 * @date 2019-02-08
 * @author ThreeOn
 */
//var config = require('../../../config/config');
var util = require("util");
var Promise = require("bluebird");

var util = require("util");
//var multer = require('multer'); 
//var xlsx = require('xlsx');
//var fs = require('fs'); 


var getIndexSummaryInfo = function (req, res) {
    try {
        console.log('indexSummary=>getIndexSummaryInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
       
        var params = {
            large_type : req.session.large_type == null ? '' : req.session.large_type,
        };


        var stmt1 = mapper.getStatement('index', 'indexSummaryLately', params, {language:'sql', indent: '  '});
        var stmt2 = mapper.getStatement('index', 'indexSummaryResult', params, {language:'sql', indent: '  '});

        // 대입 문자 치환
        stmt2 = stmt2.replace(/\: =/g,':=');
        

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
            large_type : req.session.large_type == null ? '' : req.session.large_type,
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
            large_type : req.session.large_type == null ? '' : req.session.large_type,
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
* Index 목록
*/
var getInfoIndexList = function (req, res) {
    console.log('indexSummary=>getInfoOpenReqList 호출됨.');

    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");

    var params = {
        large_type : req.session.large_type == null? '' : req.session.large_type,
        type_cd : req.session.type_cd == null? '' : req.session.type_cd,
        inst_cd : req.session.inst_cd == null? '' : req.session.inst_cd,
        user_id : req.session.user_id == null? '' : req.session.user_id
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
            large_type : req.session.large_type == null ? '' : req.session.large_type,
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
            large_type : req.query.large_type,
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
            large_type : req.query.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id,
            term: req.query.term
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexEtpHistoryData', options, {language:'sql', indent: '  '});
     
        util.log("stmt", stmt);

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
            large_type : req.query.large_type,
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
* 비중 정보 리스트 
*/
var getIndexImportanceList = function (req, res) {
    try {
        console.log('indexSummary=>getIndexImportanceList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.query.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexImportanceList', options, {language:'sql', indent: '  '});
        
        // 대입 문자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
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
* <!--지수 상세 -> 분석정보 Performance 정보[선택한 지수정보, 지수에 속한 ETP 정보 4개 까지] -->
*/

var getIndexAnalysisInfo = function (req, res) {
    try {
        console.log('indexSummary=>getIndexAnalysisInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type == null ? '' : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        util.log("options", JSON.stringify(options));

        var stmt = mapper.getStatement('index', 'getIndexAnalysisInfo', options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
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
* <!--Index 또는 ETP 수익률 비교 정보, gubun 1: etp, 2:index] -->
*/

var getIndexAnalysisData = function (req, res) {
    try {
        console.log('indexSummary=>getIndexAnalysisInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            large_type : req.session.large_type == null ? '' : req.session.large_type,
            jisu_cd: req.query.jisu_cd,
            market_id: req.query.market_id
        };

        var gubun = req.query.gubun;
        util.log("options", JSON.stringify(options));
        var query_id = '';

        if (gubun == '1') {
            query_id = 'getIndexAnalysisInfoEtpData';
        } else if (gubun == '2') {
            query_id = 'getIndexAnalysisInfoIndexData';
        }
        var stmt = mapper.getStatement('index', query_id, options, {language:'sql', indent: '  '});
        
        // 대입 연산자 치환
        stmt = stmt.replace(/\: =/g,':='); 
     
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
* 지수요약: 지수정보 공개 요청 건수 
*/

var getShareReqCnt = function (req, res) {
    try {
        console.log('indexSummary=>getShareReqCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
        };


        var stmt = mapper.getStatement('index', 'getShareReqCnt', options, {language:'sql', indent: '  '});
        
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
* 지수요약: 지수정보 등록상태(01: 등록, 02: 연동신청, 03:연동완료)
*/

var getIndexRegStateCnt = function (req, res) {
    try {
        console.log('indexSummary=>getIndexRegStateCnt 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        // var options = {id:'admin'};
        
        var options = {
            state : req.query.state
        };


        var stmt = mapper.getStatement('index', 'getIndexRegStateCnt', options, {language:'sql', indent: '  '});
        
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
module.exports.getIndexImportanceList = getIndexImportanceList;
module.exports.getIndexAnalysisInfo = getIndexAnalysisInfo;
module.exports.getShareReqCnt = getShareReqCnt;
module.exports.getIndexRegStateCnt = getIndexRegStateCnt;
module.exports.getIndexAnalysisData = getIndexAnalysisData;