

var config = require('./mysql_config');
var etpStmts = {};

var setStmts = function(app) {
	console.log('init() 호출됨.');
	
    var modelLen = config.db_model.length;
	console.log('설정에 정의된 모델의 수 : %d', modelLen);
	
	for (var i = 0; i < modelLen; i++) {
		var curItem = config.db_model[i];
		
		// database 객체에 속성으로 추가
		etpStmts[curItem.modelName] = require(curItem.file);
		console.log('[MYSQL] 모델 이름 [%s] 이 mydb 객체의 속성으로 추가됨.', curItem.modelName);
	}
	
    app.set('mydb', etpStmts);
    console.log('[MYSQL]mydb 객체가 app 객체의 속성으로 추가됨.');
};

// database 객체를 module.exports에 할당
module.exports.etpStmts = setStmts;