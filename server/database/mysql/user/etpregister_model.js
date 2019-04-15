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

    var stmt = 'SELECT a.*, \
        (select inst_nm from m001uetpinstcode where inst_cd = a.inst_cd limit 1) inst_nm, \
        (select m_cd_nm from m001uetpcode where l_cd= "002" and m_cd = a.isin_stat_cd) m_cd_nm, \
        timestampdiff(day,req_date,now()) lapse_date, \
        timestampdiff(day,ifnull(list_date,"29991231")  ,now()) list_lapse_date, \
        ifnull(a.ridx_dist_sym_code,a.idx_sym_code) basic_idx \
        from m001uetpmaster a \
        LEFT JOIN tm_domain_mast b \
        ON a.inst_cd = b.inst_cd \
        WHERE (a.list_date    >=   now()  or      a.list_date is null) \
        and a.isin_stat_cd != "0009" ';

    if (options.id != null && options != "") {
        stmt += ` AND ID = \'${options.id}\'`;
    }

    stmt += `  order by  a.seq asc`
    return stmt;
}


module.exports = model;