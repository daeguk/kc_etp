# ETF 정보
ETF = {
    '종목명' = "",
    'ISIN코드' = "",
    'cu당발행수식수' = 5000,
    '총시가총액' = 0,
    'iNAV' = 0,
}

# PDF에 포함된 자산의 정보
asset = {
    '시장구분' : '',
    'ISIN코드' : "",
    'Value'    : 0,
    '현재가'    : 0,
    '기준가'    : 0,
    'cu주식수'  : 0,
    ''
}

# ETF의 ISIN(또는 단출코드)를 KEY로, PDF내역을 가져온다
pdf_list = getPdfInfo( ETF.ISIN코드 )

for asset in pdf_list :

## [START] 자산별 value 세팅작업

"""
    자산이 원화예금(KRD010010001)일 경우 
"""
    if asset.ISIN코드 == "KRD010010001" :
        asset.value = 1

"""
    자산이 달러예금(USDZZ0000001)일 경우,
    서울외국환중개에서 제공하는 현재가를 사용. 
    코드값: 11USDSP
""" 
    elif asset.ISIN코드 == "USDZZ0000001" :
        asset.value = getExchangePrc("11USDSP")
"""
    자산이 엔화예금(JPYZZ0000001)일 경우,
    서울외국환중개에서 제공하는 USD현재가와, 
    이종통화인 JPYUSD의 최우선매도수호가 평균을 이용하여 KRWJPY를 구한다.
    매도/매수 호가중 한쪽이 없을 경우 하나의 값만 사용한다
    코드값: 11USDSP, 11JPUSP
""" 
    elif asset.ISIN코드 == "JPYZZ0000001" :
        asset.value = getExchangeCurrent("11USDSP").cur_prc # 달러의 현재가
        jpy_bid = getExchangeCurrent("11JPUSP").bid_prc     # JPYUSD 매수호가
        jpy_ask = getExchangeCurrent("11JPUSP").ask_prc     # JPYUSD 매도호가
        # 매수/매도 둘다 값이 있을 경우 평균값사용
        if ( jpy_bid != 0 && jpy_ask != 0 ) :
            jpy_value = (jpy_bid + jpy_ask) / 2
        # 매수/매도 둘다 값이 없을 경우 전일종가 사용
        elif (jpy_bid == 0 && jpy_ask == 0) :
            jpy_value = getExchangeCurrent("11JPUSP").prev_prc
        # 매수/매도 중 한쪽만 값이 있을 경우 그 값을 사용
        else :
            jpy_value = jpy_bid + jpy_ask
        # 달러 / JPYUSD를 자산의 value로 SET
        asset.value = asset.value / jpy_value

"""
    자산의 소속시장이 KOSPI, KOSDAQ일 경우
    만약 자산의 CU주식수가 0보다 크거나 같다면, 자산의 현재가를 사용하고,
    CU주식수가 0보다 작다면 '현재가 - 기준가'를 사용한다       
""" 
    elif asset.시장구분 == "KOSPI" || asset.시장구분 == "KOSDAQ" :
        if asset.cu주식수 >= 0 :
            asset.value = getAssetCurrent(asset.ISIN코드).cur_prc
        elif asset.cu주식수 < 0 :
            asset.value = getAssetCurrent(asset.ISIN코드).cur_prc - getAssetCurrent(asset.ISIN코드).bas_prc

"""
    자산의 소속시장이 채권일 경우
    채권평가사들의 T+2일기준 가격의 평균을 사용하고, 10000으로 나눠준다
"""
    elif asset.시장구분 == "채권" :
            asset.value = getBondCurrent(asset.ISIN코드).t2_value / 10000
"""
    자산의 소속시장이 선물 또는 옵션일 경우
    (현재가 - 기준가) X 단위계약승수 를 사용한다.
"""
    elif asset.시장구분 == "선물" || asset.시장구분 == "옵션" :
            asset.value = (getAssetCurrent(asset.ISIN코드).cur_prc - getAssetCurrent(asset.ISIN코드).bas_prc) * getAssetCurrent(asset.ISIN코드).단위계약승수
## [END] value 세팅작업

## ETF의 총 시가총액에 자산의 시가총액을 누적
    if asset.시장구분 == "채권" :
        ETF.시가총액 = ETF.시가총액 + (asset.value * asset.액면금액)
    else :
        ETF.시가총액 = ETF.시가총액 + (asset.value * asset.cu주식수)
## [END] for loop 

## ETF INAV 계산(PDF방식)
ETF.iNAV = ETF.시가총액 / ETF.cu당발행주식수
    
