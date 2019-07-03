/*
 * 설정
 */
var http = require('http');
var config = require('../config/config');
const recvNoList = [
  // PDF 담당 : 김상용, 민선기, 오인명, 이형준
  ['01047191302', '01091703352', '01088939334', '01071397335'],
  // ['01047191302',],
  // ['01035575178'],
  // 고객지원 담당 : 김상용, 민선기
  ['01047191302', '01091703352',],
];

module.exports = {
  smsSend: function(gubun, msg) {
    if(config.runenv == 'prod') {
      let recvNo = recvNoList[gubun];
      let str = '/sms/EtpSmsAction.do?sendNo=027677114&message='+msg;
      let options = {
        host:'127.0.0.1',
        port:8090,
        path:'',
      }

      for(let i=0; i < recvNo.length; i++) {
        str = str + "&recvNo=" + recvNo[i];
        options.path = encodeURI(str);
        console.log("smsSEnd...........");
        console.log(options.path);
        http.request(options, function(res) {
          console.log(res);
        }).end();
      }
    }
  },
}