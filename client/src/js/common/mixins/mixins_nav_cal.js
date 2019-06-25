import Config from "@/js/config.js";
/*
 *  Nav 계산기 공통 함수
 */
export const nav_cal_common =   {

    methods: {

        iNavCalulator(pdf_info, simulationMode) {
            return new Promise(function(resolve, reject) {
            /*ETF 정보와 PDF 정보 
            {
                F12506: "20190513"  => 입회 일자
                F15001: "23100"     => 현재가 
                F15007: "23600"     => 기준가
                F15028: (...)       => 시가총액
                F16002: (...)       => 한글종목명
                F16012: (...)       => 국제표준코드
                F16316: (...)       => 구성종목코드
                F16499: (...)       => 1CU단위증권수
                F16583: (...)       => 사무수탁회사번호
                F16588: (...)       => 평가금액
                F33837: (...)       => 구성종목수
                F33861: (...)       => ETF시장구분
                F34743: (...)       => ETF_PDF비중
                F34840: (...)       => 액면금액설정현금액
            }
            //## [START] 자산별 value 세팅작업
            /*자산이 원화예금(KRD010010001)일 경우 */
            var assetValue = "";
            if (pdf_info.F16316 == "CASH00000001") {
                try {
                    assetValue = 1

                    let market_tot_amt = (assetValue * Number(pdf_info.F16499));  /* 시가총액 */
                   
                    let jongItem = {};
                    jongItem.market_amt = market_tot_amt;
                    jongItem.F15001 = 1;       /* 현재가 */
                    jongItem.F15007 = 1;                  /* 기준가 */
                    jongItem.F15004 = 0;                     /* 등락률 */
                    jongItem.F15472 = 0;                     /* 대비 */
                    jongItem.F16013 = 'CASH';                     /* 종목코드 */

                    resolve(jongItem);
                } catch(e) {

                    let jongItem = {};
                    jongItem.market_amt = 0;
                    jongItem.F15001 = 1;
                    jongItem.F15007 = 1;
                    jongItem.F15004 = 0;
                    jongItem.F15472 = 0;
                    jongItem.F16013 = 'CASH';

                    resolve(jongItem);
                    console.log(e);
                }
            }

            else if (pdf_info.F16316 == "KRD010010001") {
                try {
                    assetValue = 1

                    let market_tot_amt = (assetValue * Number(pdf_info.F16499));  /* 시가총액 */
                  
                    let jongItem = {};
                    jongItem.market_amt = market_tot_amt;
                    jongItem.F15001 = 1;       /* 현재가 */
                    jongItem.F15007 = 1;                  /* 기준가 */
                    jongItem.F15004 = 0;                     /* 등락률 */
                    jongItem.F15472 = 0;                     /* 대비 */
                    jongItem.F16013 = 'KRD';                     /* 종목코드 */

                    resolve(jongItem);
                } catch(e) {

                    let jongItem = {};
                    jongItem.market_amt = 0;
                    jongItem.F15001 = 1;       /* 현재가 */
                    jongItem.F15007 = 1;                  /* 기준가 */
                    jongItem.F15004 = 0;                     /* 등락률 */
                    jongItem.F15472 = 0;                     /* 대비 */
                    jongItem.F16013 = 'KRD';                     /* 종목코드 */

                    resolve(jongItem);
                    console.log(e);
                }
            }
            /*자산이 달러예금(USDZZ0000001)일 경우,
                서울외국환중개에서 제공하는 현재가를 사용. 
                코드값: 11USDSP*/        
            else if (pdf_info.F16316 == 'USDZZ0000001') { 
                /* 시뮬레이션 모드가 아니면 DB에서 현재가를 추출 */
                if (!simulationMode) {
                    axios.get(Config.base_url + "/user/etp/getExchBasic", {
                        params: {
                            F16012 : '11USDSP',
                        }
                    }).then(function(response) {
                        try {
                            let exchBasic = response.data.results[0];
                            assetValue = Number(exchBasic.F15001); /* 현재가 */
                            console.log("assetValue:"+assetValue);                    
                            let market_tot_amt = (assetValue * Number(pdf_info.F16499));  /* 시가총액 */


                            let jongItem = {};
                            jongItem.market_amt = market_tot_amt;
                            jongItem.F15001 = exchBasic.F15001;       /* 현재가 */
                            jongItem.F15007 = exchBasic.F15007;                    /* 기준가 */
                            jongItem.F15004 = exchBasic.F15004;                     /* 등락률 */
                            jongItem.F15472 = exchBasic.F15472;                     /* 대비 */
                            jongItem.F16013 = exchBasic.F16013;                     /* 종목코드 */

                            resolve(jongItem);
                        } catch(e) {
                            
                            let jongItem = {};
                            jongItem.market_amt = 0;
                            jongItem.F15001 = 0;
                            jongItem.F15007 = 0;
                            jongItem.F15004 = 0;
                            jongItem.F15472 = 0;
                            jongItem.F16013 = 0;

                            resolve(jongItem);

                            console.log(e);
                        }
                    }) ;
                } else {
                    try {                        
                        assetValue = Number(pdf_info.F15001); /* 현재가 */
                        console.log("assetValue:"+assetValue);                    
                        let market_tot_amt = (assetValue * Number(pdf_info.F16499));  /* 시가총액 */
                        
                        let jongItem = {};
                        jongItem.market_amt = market_tot_amt;
                        jongItem.F15001 = pdf_info.F15001;       /* 현재가 */
                        jongItem.F15007 = pdf_info.F15007;                    /* 기준가 */
                        jongItem.F15004 = pdf_info.F15004;                     /* 등락률 */
                        jongItem.F15472 = pdf_info.F15472;                     /* 대비 */
                        jongItem.F16013 = pdf_info.F16013;                     /* 종목코드 */


                        resolve(jongItem);
                    } catch(e) {
                        
                        let jongItem = {};
                        jongItem.market_amt = 0;
                        jongItem.F15001 = 0;
                        jongItem.F15007 = 0;
                        jongItem.F15004 = 0;
                        jongItem.F15472 = 0;
                        jongItem.F16013 = 0;

                        resolve(jongItem);

                        console.log(e);
                    }
                }

            }
    
            /*
                자산이 엔화예금(JPYZZ0000001)일 경우,
                서울외국환중개에서 제공하는 USD현재가와, 
                이종통화인 JPYUSD의 최우선매도수호가 평균을 이용하여 KRWJPY를 구한다.
                매도/매수 호가중 한쪽이 없을 경우 하나의 값만 사용한다
                코드값: 11USDSP, 11JPUSP
            */
    
            else if (pdf_info.F16316 == 'JPYZZ0000001') {
                
                let exchUSBasic = null;
                let ExchJPBasic = null;
                let assetValue = 0;
                let jpy_value = 0;
                
                /* 시뮬레이션 모드가 아니면 DB에서 현재가를 추출 */
                if (!simulationMode) {
                    axios.get(Config.base_url + "/user/etp/getExchBasic", {
                        params: {
                            F16012 : '11USDSP',
                        }
                    }).then(function(response) {
                        exchUSBasic = response.data.results[0];
                        
                        axios.get(Config.base_url + "/user/etp/getExchBasic", {
                            params: {
                                F16012 : '11JPUSP',
                            }
                        }).then(function(response) {
                            try {
                                assetValue = Number(exchUSBasic.F15001); /* 현재가 */

                                ExchJPBasic = response.data.results[0];
                                
                                /* JPYUSD 매수호가 */
                                var jpy_bid = Number(ExchJPBasic.F14531);                            
                    
                                /*JPYUSD 매도호가*/
                                var jpy_ask = Number(ExchJPBasic.F14501);   
                    
                                /*# 매수/매도 둘다 값이 있을 경우 평균값사용*/
                                if ( jpy_bid != 0 && jpy_ask != 0 ) {
                                    jpy_value = (jpy_bid + jpy_ask) / 2
                                }
                                /*# 매수/매도 둘다 값이 없을 경우 전일종가 사용*/
                                else if (jpy_bid == 0 && jpy_ask == 0) {
                                    jpy_value = ExchJPBasic.F03003;
                                }
                                /*# 매수/매도 중 한쪽만 값이 있을 경우 그 값을 사용*/
                                else {
                                    jpy_value = jpy_bid + jpy_ask
                                }
                    
                                /*# 달러 / JPYUSD를 자산의 value로 SET*/
                                assetValue = assetValue / jpy_value

                                let market_tot_amt = (assetValue * Number(pdf_info.F16499));  /* 시가총액 */
                                
                                let jongItem = {};
                                jongItem.market_amt = market_tot_amt;
                                jongItem.F15001 = ExchJPBasic.F15001;       /* 현재가 */
                                jongItem.F15007 = ExchJPBasic.F15007;                    /* 기준가 */
                                jongItem.F15004 = ExchJPBasic.F15004;                     /* 등락률 */
                                jongItem.F15472 = ExchJPBasic.F15472;                     /* 대비 */
                                jongItem.F16013 = ExchJPBasic.F16013;                     /* 종목코드 */
                                jongItem.F15001_US = exchUSBasic.F15001;                  /* 달러 현재가 */
                                jongItem.F14531 = ExchJPBasic.F14531;                     /* JPYUSD 매수호가 */
                                jongItem.F14501 = ExchJPBasic.F14501;                     /* JPYUSD 매도호가 */
                                jongItem.F03003 = ExchJPBasic.F03003;                     /* JPYUSD 전일종가 */

                                resolve(jongItem);
                            } catch(e) {
                            
                                let jongItem = {};
                                jongItem.market_amt = 0;
                                jongItem.F15001 = 0;
                                jongItem.F15007 = 0;
                                jongItem.F15004 = 0;
                                jongItem.F15472 = 0;
                                jongItem.F16013 = 0;
                                jongItem.F15001_US = 0;                  /* 달러 현재가 */
                                jongItem.F14531 = 0;                     /* JPYUSD 매수호가 */
                                jongItem.F14501 = 0;                     /* JPYUSD 매도호가 */
                                jongItem.F03003 = 0;                     /* JPYUSD 전일종가 */

                                resolve(jongItem);
                                console.log(e);
                            }
                            
                        }) ;
                    }) ;
                } else {
                    try {
                        assetValue = Number(pdf_info.F15001_US); /* 현재가 */
                        
                        /* JPYUSD 매수호가 */
                        var jpy_bid = Number(pdf_info.F14531);                            
            
                        /*JPYUSD 매도호가*/
                        var jpy_ask = Number(pdf_info.F14501);   
            
                        /*# 매수/매도 둘다 값이 있을 경우 평균값사용*/
                        if ( jpy_bid != 0 && jpy_ask != 0 ) {
                            jpy_value = (jpy_bid + jpy_ask) / 2
                        }
                        /*# 매수/매도 둘다 값이 없을 경우 전일종가 사용*/
                        else if (jpy_bid == 0 && jpy_ask == 0) {
                            jpy_value = pdf_info.F03003;
                        }
                        /*# 매수/매도 중 한쪽만 값이 있을 경우 그 값을 사용*/
                        else {
                            jpy_value = jpy_bid + jpy_ask
                        }
            
                        /*# 달러 / JPYUSD를 자산의 value로 SET*/
                        assetValue = assetValue / jpy_value

                        let market_tot_amt = (assetValue * Number(pdf_info.F16499));  /* 시가총액 */
                        
                        let jongItem = {};
                        jongItem.market_amt = market_tot_amt;
                        jongItem.F15001 = pdf_info.F15001;       /* 현재가 */
                        jongItem.F15007 = pdf_info.F15007;                    /* 기준가 */
                        jongItem.F15004 = pdf_info.F15004;                     /* 등락률 */
                        jongItem.F15472 = pdf_info.F15472;                     /* 대비 */
                        jongItem.F16013 = pdf_info.F16013;                     /* 종목코드 */
                        jongItem.F15001_US = pdf_info.F15001_US;                  /* 달러 현재가 */
                        jongItem.F14531 = pdf_info.F14531;                     /* JPYUSD 매수호가 */
                        jongItem.F14501 = pdf_info.F14501;                     /* JPYUSD 매도호가 */
                        jongItem.F03003 = pdf_info.F03003;                     /* JPYUSD 전일종가 */

                        resolve(jongItem);
                    } catch(e) {
                    
                        let jongItem = {};
                        jongItem.market_amt = 0;
                        jongItem.F15001 = 0;
                        jongItem.F15007 = 0;
                        jongItem.F15004 = 0;
                        jongItem.F15472 = 0;
                        jongItem.F16013 = 0;
                        jongItem.F15001_US = 0;                  /* 달러 현재가 */
                        jongItem.F14531 = 0;                     /* JPYUSD 매수호가 */
                        jongItem.F14501 = 0;                     /* JPYUSD 매도호가 */
                        jongItem.F03003 = 0;                     /* JPYUSD 전일종가 */

                        resolve(jongItem);
                        console.log(e);
                    }
                }
            }
              
    
            /*
                자산의 소속시장이 KOSPI, KOSDAQ일 경우
                만약 자산의 CU주식수가 0보다 크거나 같다면, 자산의 현재가를 사용하고,
                CU주식수가 0보다 작다면 '현재가 - 기준가'를 사용한다      
                F33861 => 0: 유가증권 1: 코스닥 2: 기타 3:채권 4: 선물옵션
            */
            else if (pdf_info.F33861 == "0" || pdf_info.F33861 == "1") {
             
                    try {
                        /* CU 주식수 */
                        if (pdf_info.F16499 >= 0) {
                            /* 현재가*/
                            assetValue = Number(pdf_info.F15001);

                        } else if (pdf_info.F16499 < 0) {
                            /*현재가 - 기준가*/
                            assetValue = Number(pdf_info.F15001) - Number(pdf_info.F15007)
                        }

                        let market_tot_amt = (assetValue * Number(pdf_info.F16499)); /* 시가 총액 */
        
                        let jongItem = {};
                        jongItem.market_amt = market_tot_amt;
                        jongItem.F15001 = pdf_info.F15001;       /* 현재가 */
                        jongItem.F15007 = pdf_info.F15007;                    /* 기준가 */
                        jongItem.F15004 = pdf_info.F15004;                     /* 등락률 */
                        jongItem.F15472 = pdf_info.F15472;                     /* 대비 */
                        jongItem.F16013 = pdf_info.F16013;                     /* 종목코드 */


                        resolve(jongItem);
                    } catch(e) {
                        
                        let jongItem = {};
                        jongItem.market_amt = 0;
                        jongItem.F15001 = 0;
                        jongItem.F15007 = 0;
                        jongItem.F15004 = 0;
                        jongItem.F15472 = 0;
                        jongItem.F16013 = 0;

                        resolve(jongItem);
                        console.log(e);
                    }
            }
                    
    
            /*
                자산의 소속시장이 채권일 경우
                채권평가사들의 T+2일기준 가격의 평균을 사용하고, 10000으로 나눠준다
            */
            else if (pdf_info.F33861 == '3') {
                // 채권 일단 제외
                ///assetValue = getBondBasic(asset.ISIN코드).t2_value / 10000

                //let market_tot_amt = (assetValue * asset.액면금액)''              
                let jongItem = {};
                jongItem.market_amt = 0;
                jongItem.F15001 = 0;
                jongItem.F15007 = 0;
                jongItem.F15004 = 0;
                jongItem.F15472 = 0;
                jongItem.F16013 = '';

                resolve(jongItem);

            }
            /*
                자산의 소속시장이 선물 또는 옵션일 경우
                (현재가 - 기준가) X 단위계약승수 를 사용한다.
            */
            else if (pdf_info.F33861 == '4') {
                /* 시뮬레이션 모드가 아니면 DB에서 현재가를 추출 */
                if (!simulationMode) {                
                    axios.get(Config.base_url + "/user/etp/getFutureBasic", {
                        params: {
                            F16012 : pdf_info.F16316,
                        }
                    }).then(function(response) {
                        try {
                            let futureBasic = response.data.results[0];
                            assetValue = (Number(futureBasic.F15001) - Number(futureBasic.F15007)) * Number(futureBasic.F33904);
                            
                            /*시가총액 = assetValue * cu 주식수 */
                            let market_tot_amt = (assetValue * Number(pdf_info.F16499)); /* 시가 총액 */
                            
                            let jongItem = {};
                            jongItem.market_amt = market_tot_amt;
                            jongItem.F15001 = futureBasic.F15001;       /* 현재가 */
                            jongItem.F15007 = futureBasic.F15007;                    /* 기준가 */        
                            jongItem.F15004 = futureBasic.F15004;                     /* 등락률 */
                            jongItem.F15472 = futureBasic.F15472;                     /* 대비 */
                            jongItem.F16013 = futureBasic.F16013;                     /* 종목코드 */
                            jongItem.F33904 = futureBasic.F33904;                     /* 단위계약승수 */
                                
                            resolve(jongItem);
                        } catch(e) {
                            
                            let jongItem = {};
                            jongItem.market_amt = 0;
                            jongItem.F15001 = 0;
                            jongItem.F15007 = 0;
                            jongItem.F15004 = 0;
                            jongItem.F15472 = 0;
                            jongItem.F16013 = 0;
                            jongItem.F33904 = 0;                     /* 단위계약승수 */
                            resolve(jongItem);
                            console.log(e);
                        }
                    }) ;
                } else {
                    try {
                        assetValue = (Number(pdf_info.F15001) - Number(pdf_info.F15007)) * Number(pdf_info.F33904);
                        
                        /*시가총액 = assetValue * cu 주식수 */
                        let market_tot_amt = (assetValue * Number(pdf_info.F16499)); /* 시가 총액 */
                        
                        let jongItem = {};
                        jongItem.market_amt = market_tot_amt;
                        jongItem.F15001 = pdf_info.F15001;                    /* 현재가 */
                        jongItem.F15007 = pdf_info.F15007;                    /* 기준가 */        
                        jongItem.F15004 = pdf_info.F15004;                    /* 등락률 */
                        jongItem.F15472 = pdf_info.F15472;                    /* 대비 */
                        jongItem.F16013 = pdf_info.F16013;                    /* 종목코드 */
                        jongItem.F33904 = pdf_info.F33904;                    /* 단위계약승수 */
                            
                        resolve(jongItem);
                    } catch(e) {
                        
                        let jongItem = {};
                        jongItem.market_amt = 0;
                        jongItem.F15001 = 0;
                        jongItem.F15007 = 0;
                        jongItem.F15004 = 0;
                        jongItem.F15472 = 0;
                        jongItem.F16013 = 0;
                        jongItem.F33904 = 0;                     /* 단위계약승수 */
                        resolve(jongItem);
                        console.log(e);
                    }
                }
            } else {
                let jongItem = {};
                    jongItem.market_amt = 0;
                    jongItem.F15001 = 0;
                    jongItem.F15007 = 0;
                    jongItem.F15004 = 0;
                    jongItem.F15472 = 0;
                    jongItem.F16013 = pdf_info.F16013;

                        
                    resolve(jongItem);
            }
                
            });
        },
    },    
}