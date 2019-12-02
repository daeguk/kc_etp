/**
 * 라우팅 모듈을 로딩하여 설정
 * 
 * 라우팅 모듈 파일에 대한 정보는 config.js의 route_info 배열에 등록함
 *
 * @date 2018-07-30
 * @author ThreeOn
 */

const wsModule = require('ws');
var requestIp = require('request-ip');

module.exports = function(_server) {
  const wss = new wsModule.Server({server: _server});

  wss.on('connection', function(ws, req) {
    let tmpip = requestIp.getClientIp(req);
    console.log("Websocket Connection IP : " + tmpip);

    ws.on('message', function(message) {
      console.log(" receive1..............");
      console.log(message);
      var tmp = JSON.parse(message);
      console.log(tmp);
      console.log(tmp.msg);

      // ws.send(JSON.stringify(tmp));
    });

    ws.on('error', function(message) {
      console.log("error Websocket Connection : " + tmpip);
    });

    ws.on('close', function(message) {
      console.log("close Websocket Connection : " + tmpip);
    });
    
  });

  setInterval(inFunc, 2000);

  function inFunc() {
    console.log("inFunc......");
    var msg = {event:"ETF_SISE", code:"069500", F15001:"22000"};

    wss.clients.forEach(function each(client) {
      if (client.readyState === wsModule.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  }
}

