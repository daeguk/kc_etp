/**
 * CRON SCHEDULER
 * 
 * @date 2018-09-17
 * 
 * @author ThreeOn
 */

var cron_scheduler = {};

var cron = require('node-cron');
var logg = require('../util/logg');

cron_scheduler.init = function(app) {
	logg.info('cron_scheduler.init 호출됨.');
	// return cronRegister(app);
};

// route_info에 정의된 라우팅 정보 처리
function cronRegister(app) {
	// cron 작업 등록
	cron.schedule('* 0 * * *', function(){
		logg.info('dailyCronJob 작업 실행 : ');
		dailyCronJob(app);
	});
}

function dailyCronJob(app) {
    // var database = app.get('database');

    // if (database.db) {
    //     database.UserModel.initTodayVisit(function(err, result) {
    //         if (err) {
    //             console.log("initTodayVisit.... ERROR " + err);
    //         } else {
		// 		console.dir("initTodayVisit.... OK : ");
		// 		console.log(result);
    //         }
    //     });
    // } else {
		// console.dir("initTodayVisit DB ERROR");
    // }
}

module.exports = cron_scheduler;

