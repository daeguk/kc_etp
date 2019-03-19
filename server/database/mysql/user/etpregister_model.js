/*
 * 설정
 *
 * @date 2019-02-07
 * @author ThreeOn
 * /database/mysql/user/etpregister_model.js
 */
var model = {};

model.selectEtpRegisterList = function(options) {
    console.log('selectEtpRegisterList');

    var stmt = 'SELECT b.inst_name, a.isu_kor_nm, a.req_date, a.kor_for_type, \
        ifnull(a.ridx_dist_sym_code, a.idx_sym_code) as basic_idx, \
        a.isu_eng_nm \
        from m001uetpmaster a \
        LEFT JOIN tm_domain_mast b \
        ON a.inst_cd = b.inst_cd \
        WHERE 1=1';

    if (options.id != null && options != "") {
        stmt += ` AND ID = \'${options.id}\'`;
    }

    stmt += ` ORDER BY a.req_date DESC`
    return stmt;
}


module.exports = model;