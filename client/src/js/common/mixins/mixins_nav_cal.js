import Config from "@/js/config.js";
/*
 *  Nav 계산기 공통 함수
 */
export const nav_cal_common =   {

    methods: {

        iNavCalulator: function(pdf_info) {
            /*ETF 정보와 PDF 정보 
            {
                f12506: "20190513"  => 입회 일자
                f15001: "23100"     => 현재가 
                f15007: "23600"     => 기준가
                f15028: (...)       => 시가총액
                f16002: (...)       => 한글종목명
                f16012: (...)       => 국제표준코드
                f16316: (...)       => 구성종목코드
                f16499: (...)       => 1CU단위증권수
                f16583: (...)       => 사무수탁회사번호
                f16588: (...)       => 평가금액
                f33837: (...)       => 구성종목수
                f33861: (...)       => ETF시장구분
                f34743: (...)       => ETF_PDF비중
                f34840: (...)       => 액면금액설정현금액
            }
            //## [START] 자산별 value 세팅작업
    
            
            /*자산이 원화예금(KRD010010001)일 경우 */
            var assetValue = "";
            if (pdf_info.f16316 == "KRD010010001") {
                assetValue = 1

                let market_tot_amt = (assetValue * Number(pdf_info.f16499));

                return market_tot_amt;
            }
            /*자산이 달러예금(USDZZ0000001)일 경우,
                서울외국환중개에서 제공하는 현재가를 사용. 
                코드값: 11USDSP*/        
            else if (pdf_info.f16316 == 'USDZZ0000001') {
                let exchBasic = this.getExchBasic("11USDSP");

                assetValue = Number(exchBasic.f15001); /* 현재가 */
                console.log("assetValue:"+assetValue);

                let market_tot_amt = (assetValue * Number(pdf_info.f16499));

                return market_tot_amt;
            }
    
            /*
                자산이 엔화예금(JPYZZ0000001)일 경우,
                서울외국환중개에서 제공하는 USD현재가와, 
                이종통화인 JPYUSD의 최우선매도수호가 평균을 이용하여 KRWJPY를 구한다.
                매도/매수 호가중 한쪽이 없을 경우 하나의 값만 사용한다
                코드값: 11USDSP, 11JPUSP
            */
    
            else if (pdf_info.f16316 == 'JPYZZ0000001') {
                /* 달러의 현재가*/
                let exchUSBasic = this.getExchBasic("11USDSP");
                assetValue = Number(exchUSBasic.f15001); 
                
                let ExchJPBasic = this.getExchBasic("11JPUSP");
                /* JPYUSD 매수호가 */
                var jpy_bid = Number(ExchJPBasic.f14531);
    
                /*JPYUSD 매도호가*/
                var jpy_ask = Number(ExchJPBasic.f14501);   
    
                /*# 매수/매도 둘다 값이 있을 경우 평균값사용*/
                if ( jpy_bid != 0 && jpy_ask != 0 ) {
                    jpy_value = (jpy_bid + jpy_ask) / 2
                }
                /*# 매수/매도 둘다 값이 없을 경우 전일종가 사용*/
                else if (jpy_bid == 0 && jpy_ask == 0) {
                    jpy_value = ExchJPBasic.f03003;
                }
                /*# 매수/매도 중 한쪽만 값이 있을 경우 그 값을 사용*/
                else {
                    jpy_value = jpy_bid + jpy_ask
                }
    
                /*# 달러 / JPYUSD를 자산의 value로 SET*/
                assetValue = assetValue / jpy_value

                let market_tot_amt = (assetValue * Number(pdf_info.f16499));

                return market_tot_amt;
            }
              
    
            /*
                자산의 소속시장이 KOSPI, KOSDAQ일 경우
                만약 자산의 CU주식수가 0보다 크거나 같다면, 자산의 현재가를 사용하고,
                CU주식수가 0보다 작다면 '현재가 - 기준가'를 사용한다      
                f33861 => 0: 유가증권 1: 코스닥 2: 기타 3:채권 4: 선물옵션
            */
            else if (pdf_info.f33861 == "0" || pdf_info.f33861 == "1") {
                this.getKspjongBasic(pdf_info.f16316).then(function(kspjongBasic) {
                   
                    /* CU 주식수 */
                    if (pdf_info.f16499 >= 0) {
                        /* 현재가*/
                        assetValue = Number(kspjongBasic.f15001);

                    } else if (pdf_info.f16499 < 0) {
                        /*현재가 - 기준가*/
                        assetValue = Number(kspjongBasic.f15001) - Number(kspjongBasic.f15007)
                    }

                    let market_tot_amt = (assetValue * Number(pdf_info.f16499));

                    return market_tot_amt;
                }) ;
                
            }
                    
    
            /*
                자산의 소속시장이 채권일 경우
                채권평가사들의 T+2일기준 가격의 평균을 사용하고, 10000으로 나눠준다
            */
            else if (pdf_info.f33861 == '3') {
                // 채권 일단 제외
                ///assetValue = getBondBasic(asset.ISIN코드).t2_value / 10000

                //let market_tot_amt = (assetValue * asset.액면금액)''

                return 0;
            }
            /*
                자산의 소속시장이 선물 또는 옵션일 경우
                (현재가 - 기준가) X 단위계약승수 를 사용한다.
            */
            else if (pdf_info.f33861 == '4') {
                let futureBasic = this.getFutureBasic(pdf_info.f16316);

                assetValue = (Number(futureBasic.f15001) - Number(futureBasic.f15007)) * Number(futureBasic.f33904);

                let market_tot_amt = (assetValue * Number(pdf_info.f16499));

                return market_tot_amt;
            }
                
         
        },
        
        /* 외환 정보 리턴 */
        getExchBasic: function(f16316) {
            
            let data;
            axios.get(Config.base_url + "/user/etp/getExchBasic", {
                params: {
                    f16012 : f16316,
                }
            }).then(function(response) {
    
                if (response.data.success == false) {
                    console.log("데이터 오류");
                    data = {};
                } else {
                    data = response.data.results[0];
                }
            });
            return data;
        },
    
        getBondBasic: function(f16316) {
            let data;
            axios.get(Config.base_url + "/user/etp/getBondBasic", {
                params: {
                    f16012 : f16316,
                }
            }).then(function(response) {
    
                if (response.data.success == false) {
                    console.log("데이터 오류");
                    data = {};
                } else {
                    data = response.data.results[0];
                }
            });
            return data;
        },
    
        getKspjongBasic: function(f16316) {
            return new Promise(function(resolve, reject) {
                axios.get(Config.base_url + "/user/etp/getKspjongBasic", {
                    params: {
                        f16012 : f16316,
                    }
                }).then(function(response) {
        
                    if (response.data.success == false) {
                        console.log("데이터 오류");
                        reject(new Error("Request is failed"));
                    } else {
                        resolve(response.data.results[0]);
                    }
                });
            });
        },

        getFutureBasic: function(f16316) {
            let data;
            axios.get(Config.base_url + "/user/etp/getFutureBasic", {
                params: {
                    f16012 : f16316,
                }
            }).then(function(response) {
    
                if (response.data.success == false) {
                    console.log("데이터 오류");
                    data = {};
                } else {
                    data = response.data.results[0];
                }
            });
            return data;
        }
    },    
}