/*
 * 설정
 *
 * @date 2019-02-07
 * @author ThreeOn
 * /database/mysql/user/etpinfo_model.js
 */
var model = {};

model.selectEtfKorList = function(options) {
    console.log('selectEtpKorList');

    var stmt = 'SELECT ISU_KOR_ABBRV, ISIN_CODE, ISU_SRT_CD, UPD_DATE, NAME_K, \
        SYM_CODE \
        from m001_sksetfkormasti \
        WHERE 1=1';

    // if (options.id != null && options != "") {
    //     stmt += ` AND ID = \'${options.id}\'`;
    // }

    stmt += ` ORDER BY UPD_DATE DESC`
    return stmt;
}

model.selectEtfForList = function(options) {
    console.log('selectEtfForList');

    var stmt = 'SELECT ISU_KOR_ABBRV, ISIN_CODE, ISU_SRT_CD, UPDATE_DATE, NAME_K, \
        SYM_CODE, EX_RATE_CODE \
        from m001_sksetfformasti \
        WHERE 1=1';

    // if (options.id != null && options != "") {
    //     stmt += ` AND ID = \'${options.id}\'`;
    // }

    stmt += ` ORDER BY UPDATE_DATE DESC`
    return stmt;
}

model.selectEtnKorList = function(options) {
    console.log('selectEtnKorList');

    var stmt = 'SELECT ISU_KOR_ABBRV, ISIN_CODE, ISU_SRT_CD, UPD_DATE, NAME_K, \
        SYM_CODE \
        from m001_sksetnkormasti \
        WHERE 1=1';

    // if (options.id != null && options != "") {
    //     stmt += ` AND ID = \'${options.id}\'`;
    // }

    stmt += ` ORDER BY UPD_DATE DESC`
    return stmt;
}

model.selectEtnForList = function(options) {
    console.log('selectEtnForList');

    var stmt = 'SELECT ISU_KOR_ABBRV, ISIN_CODE, ISU_SRT_CD, UPDATE_DATE, NAME_K, \
        SYM_CODE, EX_RATE_CODE \
        from m001_sksetnformasti \
        WHERE 1=1';

    // if (options.id != null && options != "") {
    //     stmt += ` AND ID = \'${options.id}\'`;
    // }

    stmt += ` ORDER BY UPDATE_DATE DESC`
    return stmt;
}

module.exports = model;