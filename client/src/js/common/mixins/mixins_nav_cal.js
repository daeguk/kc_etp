import Config from "@/js/config.js";
/*
 *  Nav 계산기 공통 함수
 */
export const nav_cal_common =   {

    methods: {

        iNavCalulator: function(data) {
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
            debugger;
            var assetValue = "";
            if (data.f16316 == "KRD010010001") {
                assetValue = 1
            }
            /*자산이 달러예금(USDZZ0000001)일 경우,
                서울외국환중개에서 제공하는 현재가를 사용. 
                코드값: 11USDSP*/
   
        
            else if (data.f16316 == 'USDZZ0000001') {
                assetValue = getExchange("11USDSP");
            }
    
            /*
                자산이 엔화예금(JPYZZ0000001)일 경우,
                서울외국환중개에서 제공하는 USD현재가와, 
                이종통화인 JPYUSD의 최우선매도수호가 평균을 이용하여 KRWJPY를 구한다.
                매도/매수 호가중 한쪽이 없을 경우 하나의 값만 사용한다
                코드값: 11USDSP, 11JPUSP
            */
    
            else if (data.f16316 == 'JPYZZ0000001') {
                /* 달러의 현재가*/
                ///assetValue = getExchange("11USDSP").cur_prc 
    
                /* JPYUSD 매수호가 */
                ///var jpy_bid = getExchange("11JPUSP").bid_prc   
    
                /*JPYUSD 매도호가*/
                ///var jpy_ask = getExchange("11JPUSP").ask_prc   
    
                /*# 매수/매도 둘다 값이 있을 경우 평균값사용*/
                if ( jpy_bid != 0 && jpy_ask != 0 ) {
                    jpy_value = (jpy_bid + jpy_ask) / 2
                }
                /*# 매수/매도 둘다 값이 없을 경우 전일종가 사용*/
                else if (jpy_bid == 0 && jpy_ask == 0) {
                    ///jpy_value = getExchange("11JPUSP").prev_prc
                }
                /*# 매수/매도 중 한쪽만 값이 있을 경우 그 값을 사용*/
                else {
                    jpy_value = jpy_bid + jpy_ask
                }
    
                /*# 달러 / JPYUSD를 자산의 value로 SET*/
                assetValue = assetValue / jpy_value
            }
              
    
            /*
                자산의 소속시장이 KOSPI, KOSDAQ일 경우
                만약 자산의 CU주식수가 0보다 크거나 같다면, 자산의 현재가를 사용하고,
                CU주식수가 0보다 작다면 '현재가 - 기준가'를 사용한다      
                f33861 => 0: 유가증권 1: 코스닥 2: 기타 3:채권 4: 선물옵션
            */
            else if (data.f33861 == "0" || data.f33861 == "1") {
                if (data.f16499 >= 0) {
                    /* 현재가*/
                    ///assetValue = getAssetCurrent(asset.ISIN코드).cur_prc
                } else if (data.f16499 < 0) {
                    /*기준가*/
                    ///assetValue = getAssetCurrent(asset.ISIN코드).cur_prc - getAssetCurrent(asset.ISIN코드).bas_prc
                }
    
            }
                    
    
            /*
                자산의 소속시장이 채권일 경우
                채권평가사들의 T+2일기준 가격의 평균을 사용하고, 10000으로 나눠준다
            */
    
            else if (data.f33861 == '3') {
                // 일단 제외
                // assetValue = getBondCurrent(asset.ISIN코드).t2_value / 10000
            }
            /*
                자산의 소속시장이 선물 또는 옵션일 경우
                (현재가 - 기준가) X 단위계약승수 를 사용한다.
            */
            else if (data.f33861 == '4') {
                ///asset.value = (getAssetCurrent(asset.ISIN코드).cur_prc - getAssetCurrent(asset.ISIN코드).bas_prc) * getAssetCurrent(asset.ISIN코드).단위계약승수
            }
                
            /*## [END] value 세팅작업
    
            ## ETF의 총 시가총액에 자산의 시가총액을 누적
            */
            
            if (data.f33861 == '3') {
                //ETF.시가총액 = ETF.시가총액 + (asset.value * asset.액면금액)
            } else {
                //ETF.시가총액 = ETF.시가총액 + (asset.value * asset.cu주식수)
            }
    
            //## ETF INAV 계산(PDF방식)
            
            return ''//ETF.iNAV = ETF.시가총액 / ETF.cu당발행주식수
        },
        
        /* 외환 정보 리턴 */
        getExchangePrc: function(f16316) {

            axios.get(Config.base_url + "/user/etp/getExchange", {
                params: {
                    f16012 : 'KR7322410002',
                }
            }).then(function(response) {
    
                if (response.data) {
                    debugger;
                    //vm.etpBasic = response.data.etpBasic;
                    //vm.pdfList = response.data.pdfList;
                    //pdf_table.clear().draw();
                    //pdf_table.rows.add().draw(vm.pdfList);
                }
            });
    
        },
    
        getBondCurrent: function() {
    
        },
    
        getAssetCurrent: function() {
    
        }
    },    
}