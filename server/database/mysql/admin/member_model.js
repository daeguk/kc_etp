/*
 * 설정
 *
 * @date 2019-02-01
 * @author ThreeOn
 * /database/mysql/admin/member_model.js
 */
var model = {};

model.selectUserList = function(options) {
	console.log('selectUserList');

    var stmt = 'SELECT * from etp_test WHERE 1=1';
    
    if(options.id != null) {
        stmt += ` AND ID = \'${options.id}\'`;
    }
    return stmt;
}

module.exports = model;
