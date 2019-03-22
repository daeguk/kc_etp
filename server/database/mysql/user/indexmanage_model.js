/*
 * 설정
 *
 * @date 2019-02-07
 * @author ThreeOn
 * /database/mysql/user/etpregister_model.js
 */
var model = {};

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

module.exports = model;