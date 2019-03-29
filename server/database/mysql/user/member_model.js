/*
 * 설정
 *
 * @date 2019-02-01
 * @author ThreeOn
 * /database/mysql/user/member_model.js
 */
var model = {};

model.selectUserList = function(options) {
	console.log('selectUserList');

    var stmt = 'SELECT * from tm_domain_mast WHERE 1=1';
    
    if(options.id != null) {
        stmt += ` AND domain = \'${options.id}\' AND inst_cd = \'${options.pass}\'`;
    }
    return stmt;
}

module.exports = model;
