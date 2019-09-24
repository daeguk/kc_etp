/**
 * 라우팅 모듈을 로딩하여 설정
 * 
 * 라우팅 모듈 파일에 대한 정보는 config.js의 route_info 배열에 등록함
 *
 * @date 2018-07-30
 * @author ThreeOn
 */

var route_loader = {};

var cof = require('../config/config');
var config = require('../config/route_config');

/* logging 추가함.  2019-06-10 */
var log = cof.logger;

route_loader.sessionCheckRegister = function(app) {
	log.debug('route_loader.sessionCheckRegister 호출됨.');
	var infoLen = config.route_info.length;
	log.debug('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);
         
	for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];

// 보안을 강화하고자 한다면, session key / IP를 DB에 저장하고 모든 조회시 체크
// route_loader.js 지금은 loginkey == undefined 로만 체크하기로 함
// 필요하면, IP / ID 로 DB 세션값 체크, 속도 이슈 생기면 DB를 REDIS로 구성
		if(curItem.session == 'check') {
			log.debug("seesionCheck path : [" + curItem.path + "]");
			app.all(curItem.path, function(req, res, next) {
                
                
                /*
                    세션 정보 처리[개발시 사용];
                    ============================
                */
/*               req.session.user_id = "test@hanwha.com";
               req.session.inst_cd = "03068";
               req.session.type_cd = "0001";
               req.session.large_type = "FNGUIDE";
               req.session.krx_cd = '410220'; //거래소 ETP 발행사 코드
//               req.session.krx_cd = '56'; // ETN 상품이 존재하는 운용사 ( 하나금융투자증권 )
//               req.session.krx_cd = '2'; // ETN 상품이 존재하는 운용사 ( 신한금융투자증권 ) 
               req.session.save();
               log.debug("loginkey : " + req.session.user_id);*/
                /*===================================*/

				if(req.session.user_id) {
					log.debug("session SUCCESS");
					next();
				}else {
					log.debug("session FAIL......." + req.path);
					var error = new Error('session error');
					error.status = 900;
					res.json(error);				
                	res.end();
					//next(error);
				}
			});
		}
	}

};

route_loader.routerInit = function(app, router) {
	log.debug('route_loader.routerInit 호출됨.');
	return initRoutes(app, router);
};

// route_info에 정의된 라우팅 정보 처리
function initRoutes(app, router) {
	var infoLen = config.route_info.length;
	// log.debug('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);
 
	for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];
			
		// 모듈 파일에서 모듈 불러옴
		var curModule = require(curItem.file);
		 log.debug('%s 파일에서 모듈정보를 읽어옴.', curItem.file);
		
		//  라우팅 처리
		if (curItem.type == 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
		} else if (curItem.type == 'post') {
            router.route(curItem.path).post(curModule[curItem.method]);
		} else {
			router.route(curItem.path).post(curModule[curItem.method]);
		}
		// log.debug('라우팅 모듈 [%s]이(가) 설정됨.', curItem.method);
	}

    // 라우터 객체 등록
	app.use('/', router);
}

module.exports = route_loader;

