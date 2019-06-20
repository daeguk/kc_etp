var tool = {    
  smsSend: function(gubun, msg) {
    const recvNoList = [
      // PDF 담당 : 김상용, 민선기, 박중근, 최병국, 오인명, 이형준
      // ['01047191302', '01091703352', '01035575178', '01022456081','01088939334', '01071397335'],
      ['01035575178'],
      // 고객지원 담당 : 민선기, 박중근, 최병국
      ['01091703352', '01035575178', '01022456081'],
    ];

    let recvNo = [];
    recvNo = recvNoList[gubun];

    console.log("문자발송...........");
    console.log(recvNo);
    for(let i=0; i < recvNo.length; i++) {
      console.log("i : " + i + " no : " + recvNo[i]);
      axios.get("http://forms.koscom.co.kr/sms/EtpSmsAction.do", {
        params: {
          sendNo: '027677114',
          recvNo: recvNo[i],
          message: msg,
        }
      });
    }
  },
}  
export default tool