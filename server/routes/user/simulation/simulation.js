/*
 *  시뮬레이션 관련 정보
 *
 *  @date 2019-07-26
 *  @author bkLove
 */
var os = require('os');
var fs = require('fs');
var config = require('../../../config/config');
var util = require('../../../util/util');
var Promise = require("bluebird");


// var multer = require('multer');
// var xlsx = require('xlsx');
var async = require('async');

var multer = require('multer');
var xlsx = require('xlsx');
var fs = require('fs');

var log = config.logger;


var INIT_START_YEAR     =   { value : 2000, text : "2000" };    /* 시작년도 최초값 */
var SEARCH_SCEN_NAME    =   "unnamed";                          /* 시나리오명 prefix */
var initGrpInfo         =   {
        INIT_GRP_CD         :   "*"                             /* 그룹코드 최초값 */
    ,   INIT_INCRE_GRP_CD   :   100000                          /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */
};


/*
 * 상위 그룹정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getInitGrpCd = function(req, res) {
    try {
        log.debug('simulation.getInitGrpCd 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getInitGrpCd  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        resultMsg.dataList      =   [{
                grp_cd          :   initGrpInfo.INIT_GRP_CD
            ,   grp_name        :   "선택안함"
        }];

        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation', 'getInitGrpCd', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    else if (rows && rows.length > 0) {
                        resultMsg.dataList.push( ...rows );

                        resultMsg.result = true;
                        resultMsg.msg = "";
                    }else{
                        resultMsg.result = true;
                        resultMsg.msg = "";
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dataList  =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * next 시나리오명을 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getNextScenName = function(req, res) {
    try {
        log.debug('simulation.getNextScenName 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getNextScenName  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {
                paramData.search_scen_name  =   SEARCH_SCEN_NAME;
                stmt = mapper.getStatement('simulation', 'getNextScenName', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    
                    if (rows && rows.length == 1) {
                        resultMsg.scen_name = rows[0].next_scen_name;

                        resultMsg.result = true;
                        resultMsg.msg = "";
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.scen_name  =   "";

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 공통코드 초기 데이터를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getInitData = function(req, res) {
    try {
        log.debug('simulation.getInitData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getInitData  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );



        resultMsg.arr_start_year                =   [];     /* 초기설정 시작년도 array */
        resultMsg.arr_rebalance_cycle_cd        =   [];     /* 초기설정 리밸런싱주기 array */
        resultMsg.arr_rebalance_date_cd         =   [];     /* 초기설정 리밸런싱일자 array */
        resultMsg.arr_bench_mark_cd             =   [];     /* 초기설정 벤치마크 array */
        resultMsg.arr_importance_method_cd      =   [];     /* 초기설정 비중설정방식 array */

        resultMsg.arrMsg                        =   [];

        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {

            /* 초기설정 시작년도 array */
                var nowYear = new Date().getFullYear();
                for( var i=INIT_START_YEAR.value; i <= nowYear; i++ ) {
                    resultMsg.arr_start_year.push( { value : new String(i), text : new String(i) } );
                }

                stmt = mapper.getStatement('simulation', 'getInitData', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if (rows && rows.length > 0) {

                        for( var i in rows ) {                        

                            if( rows[i].com_mst_cd ) {

                                switch( rows[i].com_mst_cd ) {

                                    /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
                                    case    "COM006":
                                                resultMsg.arr_rebalance_cycle_cd.push( rows[i] );
                                                break;

                                    /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
                                    case    "COM007":
                                                resultMsg.arr_rebalance_date_cd.push( rows[i] );
                                                break;

                                    /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
                                    case    "COM008":
                                                resultMsg.arr_bench_mark_cd.push( rows[i] );
                                                break;

                                    /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
                                    case    "COM009":
                                                resultMsg.arr_importance_method_cd.push( rows[i] );
                                                break;
                                }
                            }                          
                        }
                    }


                    /* 초기설정 시작년도 array */
                    if( resultMsg.arr_start_year.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [시작년도] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }

                    /* 초기설정 리밸런싱주기 array */
                    if( resultMsg.arr_rebalance_cycle_cd.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [리밸런싱주기] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }

                    /* 초기설정 리밸런싱일자 array */
                    if( resultMsg.arr_rebalance_date_cd.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [리밸런싱일자] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }

                    /* 초기설정 벤치마크 array */
                    if( resultMsg.arr_bench_mark_cd.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [벤치마크] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }

                    /* 초기설정 비중설정방식 array */
                    if( resultMsg.arr_importance_method_cd.length == 0 ) {
                        resultMsg.result = false;
                        resultMsg.msg = "초기 데이터 [비중설정방식] 값이 존재하지 않습니다.";
                        resultMsg.arrMsg.push( resultMsg.msg );
                    }
                    

                    if(     resultMsg.arr_start_year.length             >   0
                        &&  resultMsg.arr_rebalance_cycle_cd.length     >   0
                        &&  resultMsg.arr_rebalance_date_cd.length      >   0
                        &&  resultMsg.arr_bench_mark_cd.length          >   0
                        &&  resultMsg.arr_importance_method_cd.length   >   0
                    ) {
                        resultMsg.result = true;
                        resultMsg.msg = "";
                    }                    

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.arr_start_year                =   [];     /* 초기설정 시작년도 array */
        resultMsg.arr_rebalance_cycle_cd        =   [];     /* 초기설정 리밸런싱주기 array */
        resultMsg.arr_rebalance_date_cd         =   [];     /* 초기설정 리밸런싱일자 array */
        resultMsg.arr_bench_mark_cd             =   [];     /* 초기설정 벤치마크 array */
        resultMsg.arr_importance_method_cd      =   [];     /* 초기설정 비중설정방식 array */

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 선택된 종목의 구성정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getJongmokInfo = function(req, res) {
    try {
        log.debug('simulation.getJongmokInfo 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getJongmokInfo  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('etpOper', 'getKspjongBasic', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    
                    if (rows ) {
						if( rows.length == 1) {
							resultMsg.jongmokInfo = rows[0];

							resultMsg.result = true;
							resultMsg.msg = "";
						}else if( rows.length > 1 ) {
							resultMsg.result = false;
							resultMsg.msg = "데이터가 2건 이상 존재합니다.";
						}
                    }else{
						resultMsg.result = false;
						resultMsg.msg = "데이터가 존재하지 않습니다.";
					}

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                resultMsg.jongmokInfo   =   {};

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.jongmokInfo   =   {};

        res.json(resultMsg);
        res.end();
    }
}


/*
 * 그룹 정보를 수정한다.
 * 2019-05-20  bkLove(촤병국)
 */
var modifyGroup = function(req, res) {
    try {
        log.debug('simulation.modifyGroup 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};
        
        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.modifyGroup  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );

        var format = { language: 'sql', indent: '' };
        var stmt = "";

        Promise.using(pool.connect(), conn => {

            conn.beginTransaction(txerr => {

                if (txerr) {
                    return log.error(txerr);
                }

                async.waterfall([

                    /* 2. grp_cd, scen_cd 가 존재하는지 체크한다. */
                    function(callback) {

                        try{

                            /* 넘겨받은 상태값이 없는 경우 */
                            if( typeof paramData.status == "undefined" || paramData.status == "" ) {
                                paramData.status    =   "insert";
                            }

                            /* insert 인 경우 grp_cd, scen_cd 가 존재하는지 체크하지 않는다. */
                            if( paramData.status == "insert" ) {

                                callback(null, paramData);

                            }else{                            

                                stmt = mapper.getStatement('simulation', 'getExistCodeCheckByGroup', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows.length == 1) {

                                        if( rows[0].grp_cd_yn != "Y" ) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "선택한 그룹코드가 존재하지 않습니다.";
                                            resultMsg.err = "선택한 그룹코드가 존재하지 않습니다.";

                                            return callback(resultMsg);
                                        }
                                        else if( rows[0].scen_cd_yn != "Y" ) {
                                            resultMsg.result = false;
                                            resultMsg.msg = "선택한 시나리오 코드가 존재하지 않습니다.";
                                            resultMsg.err = "선택한 시나리오 코드가 존재하지 않습니다.";

                                            return callback(resultMsg);
                                        }

                                        callback(null, paramData);
                                    }
                                });
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 2. 시나리오명이 존재하는지 체크한다. */
                    function(msg, callback) {

                        try{
                            var exist_yn   =   "Y";

                            /* 상태값이 modify 인 경우 */
                            if( paramData.status == "modify" ){
                                paramData.prev_grp_cd   =   paramData.grp_cd;
                                paramData.prev_scen_cd  =   paramData.scen_cd;
                            }

                            /* delete 인 경우 시나리오명 중복체크를 하지 않는다. */
                            if( paramData.status  == "delete" ) {

                                callback(null, paramData);

                            }else{

                                stmt = mapper.getStatement('simulation', 'getExistScenName', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( rows && rows.length == 1) {
                                        exist_yn   =   rows[0].exist_yn;
                                    }

                                    if( exist_yn == "Y" ) {
                                        resultMsg.result = false;
                                        resultMsg.msg   = "시나리오 그룹명이 이미 존재합니다.";
                                        resultMsg.err   = config.MSG.error01;

                                        return callback(resultMsg);                                    
                                    }

                                    callback(null, paramData);
                                });
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 3. 하위에 시나리오 건수를 조회한다. ( 시나리오 그룹에서 삭제시 ) */
                    function(msg, callback) {

                        try{
                            var exist_cnt   =   1;

                            paramData.grp_yn                =   '1';                                /* 그룹여부(1-그룹) */
                            paramData.scen_depth            =   "1";                                /* 시나리오 DEPTH */

                            /* 등록, 수정 인 경우 하위에 시나리오 건수를 조회하지 않는다. */
                            if( [ "insert", "modify" ].includes( paramData.status ) ) {

                                callback(null, paramData);

                            }else{

                                stmt = mapper.getStatement('simulation', 'getExistSubCntByGroup', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if ( rows && rows.length == 1) {
                                        exist_cnt   =   rows[0].exist_cnt;
                                    }

                                    if( exist_cnt > 0 ) {
                                        resultMsg.result    =   false;
                                        resultMsg.msg       =   "시나리오가 한건 이상  존재합니다.";
                                        resultMsg.err       =   "시나리오가 한건 이상  존재합니다.";

                                        return callback(resultMsg);                                    
                                    }

                                    callback(null, paramData);
                                });
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },                    

                    /* 3. 시뮬레이션 시나리오 코드를 채번한다. */
                    function(msg, callback) {

                        try{

                            /* modify, delete 인 경우 시뮬레이션 시나리오 코드를 채번하지 않는다. */
                            if( [ "modify", "delete" ].includes( paramData.status ) ) {

                                callback(null, paramData);

                            }else{                            

                                paramData.init_incre_grp_cd     =   initGrpInfo.INIT_INCRE_GRP_CD;      /* 그룹인 경우 시나리오 코드는 해당값 단위로 증가 */

                                /* 상위그룹이 없는 경우 그룹여부='1' 설정 */
                                if( typeof paramData.grp_cd == "undefined" || !paramData.grp_cd ) {
                                    paramData.grp_cd            =   initGrpInfo.INIT_GRP_CD;            /* 그룹코드 최초값 */
                                }

                                stmt = mapper.getStatement('simulation', 'getScenCdByGroup', paramData, format);
                                log.debug(stmt, paramData);

                                conn.query(stmt, function(err, rows) {

                                    if (err) {
                                        resultMsg.result = false;
                                        resultMsg.msg = config.MSG.error01;
                                        resultMsg.err = err;

                                        return callback(resultMsg);
                                    }

                                    if (rows && rows.length == 1) {
                                        paramData.scen_cd = rows[0].scen_cd;
                                    }

                                    callback(null, paramData);
                                });
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 4. 시뮬레이션 시나리오 정렬순번을 조회한다. */
                    function(msg, callback) {

                        try{

                            if( !paramData.grp_cd  ) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = "[error] simulation.getScenOrderNo Error while performing Query";

                                callback( resultMsg, paramData)

                            }else if( !paramData.scen_cd  ) {
                                resultMsg.result = false;
                                resultMsg.msg = config.MSG.error01;
                                resultMsg.err = "[error] simulation.getScenOrderNo Error while performing Query";

                                callback( resultMsg, paramData)

                            }else{

                                /* delete 인 경우 시뮬레이션 시나리오 정렬순번을 조회하지 않는다. */
                                if( paramData.status  == "delete" ) {

                                    callback(null, paramData);

                                }else{

                                    stmt = mapper.getStatement('simulation', 'getScenOrderNo', paramData, format);
                                    log.debug(stmt, paramData);

                                    conn.query(stmt, function(err, rows) {

                                        if (err) {
                                            resultMsg.result = false;
                                            resultMsg.msg = config.MSG.error01;
                                            resultMsg.err = err;

                                            return callback(resultMsg);
                                        }

                                        if (rows && rows.length == 1) {
                                            paramData.scen_order_no     =   rows[0].scen_order_no;
                                        }

                                        callback(null, paramData);
                                    });
                                }
                            }

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                    /* 5. 시뮬레이션 기본 정보를 저장한다. */
                    function( msg, callback) {

                        var queryId =   "saveTmSimulMastByGroup";           

                        try{
                            if( paramData.status  ==  "modify" ) {
                                queryId =   "modifyTmSimulMastByGroup";
                            }else if( paramData.status  ==  "delete" ) {
                                queryId =   "deleteTmSimulMastByGroup";
                            }

                            paramData.start_year            =   "";         /* 시작년도 */
                            paramData.rebalance_cycle_cd    =   "";         /* 리밸런싱주기 (COM006) */
                            paramData.rebalance_date_cd     =   "";         /* 리밸런싱일자 (COM007) */
                            paramData.init_invest_money     =   0;          /* 초기투자금액 */
                            paramData.bench_mark_cd         =   "";         /* 벤치마크 (COM008) */
                            paramData.importance_method_cd  =   "";         /* 비중설정방식 (COM009) */

                            stmt = mapper.getStatement('simulation', queryId, paramData, format);
                            log.debug(stmt, paramData);

                            conn.query(stmt, function(err, rows) {

                                if (err) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    return callback(resultMsg);
                                }

                                if ( !rows || rows.length == 0 ) {
                                    resultMsg.result = false;
                                    resultMsg.msg = config.MSG.error01;
                                    resultMsg.err = err;

                                    callback(resultMsg, paramData);
                                }else{
                                    callback(null, paramData);
                                }
                                
                            });

                        } catch (err) {

                            resultMsg.result = false;
                            resultMsg.msg = config.MSG.error01;
                            resultMsg.err = err;

                            callback(resultMsg);
                        }
                    },

                ], function(err) {

                    if (err) {
                        log.error(err, stmt, paramData);
                        conn.rollback();

                    } else {
                        resultMsg.result        =   true;

                        if( paramData.status  ==  "delete" ) {
                            resultMsg.msg       =   "성공적으로 삭제하였습니다.";
                        }else{
                            resultMsg.msg       =   "성공적으로 저장하였습니다.";
                        }
                        resultMsg.err           =   null;

                        conn.commit();
                    }

                    res.json(resultMsg);
                    res.end();

                });
            });
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 목록정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulList = function(req, res) {
    try {
        log.debug('simulation.getSimulList 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getSimulList  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        resultMsg.dataList  =   [];
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation', 'getSimulList', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    
                    if (rows && rows.length > 0) {
                        resultMsg.result = true;
                        resultMsg.msg = "";

                        resultMsg.dataList = rows;
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dataList      =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 마스터 정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulMast = function(req, res) {
    try {
        log.debug('simulation.getSimulMast 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getSimulMast  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        resultMsg.mastInfo  =   {};
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation', 'getSimulMast', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    
                    if (rows && rows.length == 1) {
                        resultMsg.result = true;
                        resultMsg.msg = "";

                        resultMsg.mastInfo = rows[0];
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.mastInfo  =   {};

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 포트폴리오 정보를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getSimulPortfolio = function(req, res) {
    try {
        log.debug('simulation.getSimulPortfolio 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getSimulPortfolio  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        resultMsg.dataList  =   [];
        Promise.using(pool.connect(), conn => {

            try {
                stmt = mapper.getStatement('simulation', 'getSimulPortfolio', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }
                    
                    if( !err ) {
                        resultMsg.result = true;
                        resultMsg.msg = "";
                        if (rows && rows.length > 0) {
                            resultMsg.dataList = rows;
                        }
                    }

                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.dataList  =   [];

        res.json(resultMsg);
        res.end();
    }
}

/*
 * 시뮬레이션 공통코드 초기 데이터를 조회한다.
 * 2019-07-26  bkLove(촤병국)
 */
var getInitData1 = function(req, res) {
    try {
        log.debug('simulation.getInitData 호출됨.');

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var resultMsg = {};

        /* 1. body.data 값이 있는지 체크 */
        if (!req.body.data) {
            log.error("[error] simulation.getInitData  req.body.data no data.", req.body.data);

            resultMsg.result = false;
            resultMsg.msg = config.MSG.error01;

            throw resultMsg;
        }

        var paramData = JSON.parse(JSON.stringify(req.body.data));

        paramData.user_id = ( req.session.user_id ? req.session.user_id : "" );
        paramData.inst_cd = ( req.session.inst_cd ? req.session.inst_cd : "" );
        paramData.type_cd = ( req.session.type_cd ? req.session.type_cd : "" );
        paramData.large_type = ( req.session.large_type ? req.session.large_type : "" );
        paramData.krx_cd = ( req.session.krx_cd ? req.session.krx_cd : "" );


        resultMsg.arr_code_list                 =   [];
        resultMsg.arrMsg                        =   [];

        var format = { language: 'sql', indent: '' };
        var stmt = "";
     
        Promise.using(pool.connect(), conn => {

            try {

                stmt = mapper.getStatement('simulation', 'getInitData', paramData, format);
                log.debug(stmt, paramData);

                conn.query(stmt, function(err, rows) {

                    if (err) {
                        log.error(err, stmt, paramData);

                        resultMsg.result = false;
                        resultMsg.msg = config.MSG.error01;
                        resultMsg.err = err;
                    }

                    if( rows && rows.length > 0 ) {
                        resultMsg.arr_code_list   =   rows;

                        resultMsg.result = true;
                        resultMsg.msg = "";                        
                    }else{
                        resultMsg.result = false;
                        resultMsg.msg = "공통코드 데이터가 존재하지 않습니다.";
                        resultMsg.err = "공통코드 데이터가 존재하지 않습니다.";
                    }
 
                    res.json(resultMsg);
                    res.end();
                });

            } catch (err) {
                log.error(err, stmt, paramData);

                resultMsg.result = false;
                resultMsg.msg = config.MSG.error01;
                resultMsg.err = err;
                resultMsg.arr_code_list     =   [];

                res.json(resultMsg);
                res.end();
            }
        });

    } catch (expetion) {

        log.error(expetion, paramData);

        resultMsg.result = false;
        resultMsg.msg = config.MSG.error01;
        resultMsg.err = expetion;

        resultMsg.arr_code_list     =   [];

        res.json(resultMsg);
        res.end();
    }
}


module.exports.getInitGrpCd = getInitGrpCd;
module.exports.getNextScenName = getNextScenName;
module.exports.getInitData = getInitData;
module.exports.getJongmokInfo = getJongmokInfo;
module.exports.modifyGroup = modifyGroup;
module.exports.getSimulList = getSimulList;
module.exports.getSimulMast = getSimulMast;
module.exports.getSimulPortfolio = getSimulPortfolio;
module.exports.getInitData1 = getInitData1;