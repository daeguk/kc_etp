/*
 * 설정
 *
 * @date 2019-02-07
 * @author ThreeOn
 * /database/mysql/user/etpregister_model.js
 */
var model = {};

model.selectIndexSummaryHist = function(options) {
    console.log("selectIndexSummaryHist");
    
    var stmt = '';
/*
    stmt = 'SELECT BAS.F16013
    stmt +=        ,BAS.F16002
    stmt +=        ,BAS.F16004
    stmt +=        ,BAS.LARGE_TYPE
    stmt +=        ,BAS.MIDDLE_TYPE
    stmt +=        ,HIS.F16013
    stmt +=        ,HIS.F12506
    stmt +=        ,HIS.F15009
    stmt +=         ,HIS.F15010
    stmt +=        ,HIS.F15011
    stmt +=        ,HIS.F15001
    stmt +=        ,HIS.F15472
    stmt +=        ,HIS.F15006
    stmt +=        ,HIS.F15004
    stmt +=        ,HIS.F15015
    stmt +=        ,HIS.F15023 
    stmt +=    FROM (SELECT * 
    stmt +=            FROM kc_etp.td_index_basic
    stmt +=            WHERE F16013 = (SELECT MAX(F16013)
    stmt +=                            FROM kc_etp.td_index_basic
    stmt +=                            WHERE large_type='FNGUIDE'
    stmt +=                            )
    stmt +=        ) BAS,
    stmt +=        kc_etp.td_index_history HIS
    stmt +=    WHERE BAS.F16013 = HIS.F16013
    stmt +=    ORDER BY HIS.F12506 DESC
    stmt +=    limit 0, 1;
    */
}

model.selectIndexInfoOpenReqList = function(options) {
        console.log('selectIndexInfoOpenReqList');

        /*
    var stmt = 'SELECT b.inst_name, a.isu_kor_nm, a.req_date, a.kor_for_type, \
        ifnull(a.ridx_dist_sym_code, a.idx_sym_code) as basic_idx, \
        a.isu_eng_nm \
        from m001uetpmaster a \
        LEFT JOIN domain_mast b \
        ON a.inst_cd = b.inst_cd \
        WHERE 1=1';

    if (options.id != null && options != "") {
        stmt += ` AND ID = \'${options.id}\'`;
    }
*/
        var stmt = 'SELECT * from info_open_req a WHERE 1=1';
        stmt += ` ORDER BY a.req_date DESC`
        return stmt;
    },

    model.selectIndexSummaryHist = function(options) {
        console.log('selectIndexInfoOpenReqList');

        var stmt = 'SELECT trd_dd, close_idx from index_hist a WHERE 1=1';
        stmt += ` AND index_cd = \'${options.index_cd}\'`;
        // stmt += ` limit 200`
        return stmt;
    }

model.getIndexToastGridTestList = function(options) {
    console.log('indexmanage_model.js -> getIndexToastGridTestList');

    var stmt = 'SELECT * from index_hist a WHERE 1=1';
    stmt += ` ORDER BY a.trd_dd DESC`;
    stmt += ` limit 500`;
    return stmt;
}

/* 
 * 이미 등록된 지수ID 가 존재하는지 확인한다.
 * 2019-04-02  bkLove(촤병국)
 */
model.getJisuDuplCheck = function(options) {
    console.log('/* indexmanage_model.getJisuDuplCheck */');

    var stmt =  ``
    stmt    +=  `SELECT	COUNT(1)   AS  cnt \n`;
    stmt    +=  `  FROM	tm_jisu_mast \n`;
    stmt    +=  ` WHERE	tm_jisu_mast.jisu_id    =    \'${options.jisu_id}\' \n`;
    return stmt;
}

/* 
 * tm_jisu_mast 지수 마스터 테이블에 저장한다.
 * 2019-04-02  bkLove(촤병국)
 */
model.saveTmJisuMast = function(options) {
    console.log('/* indexmanage_model.saveTmJisuMast */');

    var stmt =  ``;
    stmt    +=  `INSERT  INTO    tm_jisu_mast \n`;
    stmt    +=  `( \n`;
    stmt    +=  `        jisu_id \n`;

    stmt    +=  `    ,   jisu_kor_nm \n`;
    stmt    +=  `    ,   jisu_eng_nm \n`;
    stmt    +=  `    ,   jisu_summary \n`;
    stmt    +=  `    ,   base_jisu \n`;
    stmt    +=  `    ,   base_date \n`;
    stmt    +=  `    ,   req_content \n`;

    stmt    +=  `    ,   reg_id \n`;
    stmt    +=  `    ,   reg_time \n`;
    stmt    +=  `    ,   upd_id \n`;
    stmt    +=  `    ,   upd_time \n`;
    stmt    +=  `) \n`;
    stmt    +=  `VALUES \n`;
    stmt    +=  `( \n`;
    stmt    +=  `        \'${options.jisu_id}\'  \n`;

    stmt    +=  `    ,   \'${options.jisu_kor_nm}\' \n`;
    stmt    +=  `    ,   \'${options.jisu_eng_nm}\' \n`;
    stmt    +=  `    ,   \'${options.jisu_summary}\' \n`;
    stmt    +=  `    ,   \'${options.base_jisu}\' \n`;
    stmt    +=  `    ,   REPLACE( \'${options.base_date}\', '-', '' ) \n`;
    stmt    +=  `    ,   \'${options.req_content}\' \n`;

    stmt    +=  `    ,   \'${options.user_id}\' \n`;
    stmt    +=  `    ,   now() \n`;
    stmt    +=  `    ,   \'${options.user_id}\' \n`;
    stmt    +=  `    ,   now() \n`;
    stmt    +=  `) \n`;

    return stmt;
}


module.exports = model;