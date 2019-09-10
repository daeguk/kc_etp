/*
 * 시뮬레이션 모듈을 관장한다.
 *
 * @date 2019-08-14
 * @author bkLove(최병국)
 */


var config = require('../../../config/config');
var util = require('../../../util/util');

var log = config.logger;




/*************************************************************************************************************
**************************************************************************************************************/

/*
* 종목이 포함 되어야 하는 날짜를 구한다. 
* 2019-08-14  bkLove(촤병국)
*/
var	fn_set_importDate	=	    function(
            p_param={ 
                    rowInx          :   -1      /* 일자별 종목 레코드 인덱스 */
                ,   F12506          :   ""      /* 입회일자 */
                ,   v_before_F12506 :   ""      /* 직전 영업일 입회일자 */
                ,   first_oper_yn   :   "N"     /* 최초 레코드 기준 이전 영업일 여부 */
                ,   first_record_yn :   "N"     /* 최초 레코드 여부 */
            }
        ,   p_arrRebalanceDate                  /* 리밸런싱 일자 */
        ,   p_jongmok                           /* 현재 종목 */
        ,   p_simulPortfolioObj                 /* [tm_simul_portfolio] 기준 종목 데이터 */
    ) {


    try{
        /* 1. 포트 폴리오를 기준으로 종목코드 할당 및 total 정보를 설정한다. */
        for( var i = 0; i < Object.keys( p_simulPortfolioObj ).length; i++ ) {

            var v_portKey     =   Object.keys( p_simulPortfolioObj )[i];
            var v_portItem    =   Object.assign( {}, p_simulPortfolioObj[ v_portKey ] );
            
            /*====================================================================
                종목 포함 여부 체크 시작
                ====================================================================*/

            // 종목이 포함 되는 최초 날짜 체크 
            if (typeof v_portItem.history_start_date == "undefined") {
                p_simulPortfolioObj[ v_portKey ].index = -1;

                if( Object.keys( p_jongmok ).includes( v_portKey ) ) {
                    p_simulPortfolioObj[ v_portKey ].history_start_date = p_param.F12506;
                } else {
                    p_simulPortfolioObj[ v_portKey ].history_start_date = "0";
                }
            } else {
                if (p_simulPortfolioObj[ v_portKey ].history_start_date == "0") {
                    if( Object.keys( p_jongmok ).includes( v_portKey ) ) {
                        p_simulPortfolioObj[ v_portKey ].history_start_date = p_param.F12506;
                    } else {
                        p_simulPortfolioObj[ v_portKey ].history_start_date = "0";
                    }
                }
            }

            p_simulPortfolioObj[ v_portKey ].rebalance_F12506   =   0;
            
            /* 종목 포함 여부 체크 
                - 검색된 첫날 보다 늦을 경우 다음 리밸런싱일에 포함 시킨다. 
            */
            if (v_portItem.IMPORT_YN == 0 && p_simulPortfolioObj[ v_portKey ].history_start_date != "0") {
                // 시작일 보다 검색된 첫날이 적거나 같으면 시뮬레이션 종목을 편입
                if (p_param.first_record_yn == "Y") {                    
                    if (Number(p_param.F12506) >= Number(p_simulPortfolioObj[ v_portKey ].history_start_date)) {
                        p_simulPortfolioObj[ v_portKey ].IMPORT_YN = 1;
                        p_simulPortfolioObj[ v_portKey ].startDate = p_param.F12506;
                        console.log(v_portKey+"::"+p_param.F12506);
                    } 
                } else {

                    if (Number(v_portItem.start_year + '0101') >= Number(p_simulPortfolioObj[ v_portKey ].history_start_date)) {
                        p_simulPortfolioObj[ v_portKey ].IMPORT_YN = 1;
                        p_simulPortfolioObj[ v_portKey ].startDate = p_param.F12506;
                        console.log(v_portKey+"::"+p_param.F12506);
                    } else if  (Number(p_param.F12506) >= Number(p_simulPortfolioObj[ v_portKey ].history_start_date)) {                        
                        var import_cnt = 0;     
                        // 리밸런싱 날짜 인지 확인 
                        p_arrRebalanceDate.forEach(function(rebalanceDate, index) {
                            if (Number(p_param.F12506) == Number(rebalanceDate.F12506)) {
                                import_cnt += 1;                                    
                                p_simulPortfolioObj[ v_portKey ].index = index;
                            }
                        });

                        if (import_cnt > 0) {                                
                            p_simulPortfolioObj[ v_portKey ].IMPORT_YN = 1;
                            p_simulPortfolioObj[ v_portKey ].startDate = p_param.F12506;
                            console.log(v_portKey+"::"+p_param.F12506);
                        }
                    }
                }
            } 

            v_portItem    =   Object.assign( {}, p_simulPortfolioObj[ v_portKey ] );
        }

    }catch(e) {
        log.error( "simulModule.fn_set_importDate", e );
    }
};
    

/*************************************************************************************************************
**************************************************************************************************************/

/*
* 일자별로 종목들의 기초 데이터를 설정한다.
* 2019-08-14  bkLove(촤병국)
*/
var	fn_set_dayilyJongmok =	function(
        p_param={ 
                rowInx          :   -1      /* 일자별 종목 레코드 인덱스 */
            ,   F12506          :   ""      /* 입회일자 */
            ,   v_before_F12506 :   ""      /* 직전 영업일 입회일자 */
            ,   first_oper_yn   :   "N"     /* 최초 레코드 기준 이전 영업일 여부 */
            ,   first_record_yn :   "N"     /* 최초 레코드 여부 */
        }
    ,   p_simul_mast                        /* 시뮬레이션 기본 마스터 정보 */
    ,   p_arrRebalanceDate                  /* 리밸런싱 일자 */
    ,   p_jongmok                           /* 현재 종목 */
    ,   p_dailyObj                          /* 일자별 정보 */
    ,   p_simulPortfolioObj                 /* [tm_simul_portfolio] 기준 종목 데이터 */
) {

    /* 소수점시 계산시 사용할 고정값 */
    var numInfo     =   {
            IMPORTANCE_FIX_NUM      :   100                     /* 비중  소수점 계산시 사용할 고정값 */
        ,   IMPORTANCE_FIX_NUM1     :   10000                   /* 비중  소수점 계산시 사용할 고정값 */
        ,   JISU_RATE_FIX_NUM       :   100000000000000000      /* 지수적용비율 소수점 계산시 사용할 고정값 */
    };

    /* 현금 정보 */
    var krwInfo  =   {
            F12506                  :   ""              /* 입회일자 */
        ,   F16013                  :   "KRW"           /* 종목코드 */
        ,   F16002                  :   "현금"          /* 종목명 */
        ,   importance              :   0               /* 비중 */
        ,   F15007                  :   1               /* 기준가 ( 전일 종가 ) - 기준가 */    
        ,   F30700                  :   1               /* 현재가 ( 당일 종가 ) - 종가 */
        ,   F16143                  :   100000000       /* 상장주식수 */
        ,   F15028                  :   0               /* 시가기준 시총 */
        ,   TODAY_RATE              :   0               /* 지수적용비율 */
        ,   BEFORE_RATE             :   0               /* (직전) 지수적용비율 */
        ,   KRW_exists_yn           :   "N"             /* 현금 존재여부 */

        ,   BEFORE_IMPORTANCE       :   0
        ,   AFTER_INPORTANCE        :   0
    };

    /* total 정보 */
    var totalInfo  =   {
            tot_F15028              :   0               /* 시가기준 시총 */
        ,   tot_F15028_1            :   0               /* 시가기준 시총 (종가) */
        ,   tot_F15028_2            :   0               /* 시가기준 시총(기준가) */
        ,   prev_tot_F15028_1       :   0               /* (직전) 기준가 * 상장주식수 총액 */
        ,   prev_tot_F15028_2       :   0               /* (직전) 기준가 * 상장주식수 총액 */
        ,   tot_F15028_1_TODAY_RATE :   0               /* 종가 * 상장주식수 * 시가총액 */
        ,   tot_F15028_2_TODAY_RATE :   0               /* 기준가 * 상장주식수 * 시가총액 */
        ,   tot_F15028_S_TODAY_RATE :   0               /* (첫날 종가, 이후 기준가) * 상장주식수 * 시가총액 */
        ,   tot_F15028_S            :   0               /* 기준 시가총액 */
        ,   tot_F15028_C            :   0               /* 비교 시가총액 */
        ,   prev_tot_F15028_S       :   0               /* (직전) 기준 시가총액 */
        ,   prev_tot_F15028_C       :   0               /* (직전) 비교 시가총액 */
        ,   PREV_INDEX_RATE         :   0               /* (직전) 지수 */
        ,   INDEX_RATE              :   0               /* 지수 */
        ,   RETURN_VAL              :   0               /* RETURN_VAL */

        ,   start_year              :   ""              /* 시작년도 */
        ,   rebalance_cycle_cd      :   ""              /* 리밸런싱주기 (COM006) */
        ,   rebalance_date_cd       :   ""              /* 리밸런싱일자 (COM007) */
        ,   init_invest_money       :   0               /* 초기투자금액 */
        ,   bench_mark_cd           :   ""              /* 벤치마크 (COM008) */
        ,   importance_method_cd    :   ""              /* 비중설정방식 (COM009) */        
        ,   rebalancing             :   "0"             /* 리밸런싱에 포함되는지 체크 */        
    };


    try{


        var v_F15028_1  =   0;
        var v_F15028_2  =   0;


    /* 1. 포트 폴리오를 기준으로 종목코드 할당 및 total 정보를 설정한다. */
        for( var i = 0; i < Object.keys( p_simulPortfolioObj ).length; i++ ) {
            var v_portKey     =   Object.keys( p_simulPortfolioObj )[i];
            var v_portItem    =   Object.assign( {}, p_simulPortfolioObj[ v_portKey ] );


            v_F15028_1  =   0;    
            v_F15028_2  =   0;
            

            /*  일자별 이력에 존재하는 종목코드가 시뮬레이션 포트폴리오 종목에 존재하는 경우 
                - 시뮬레이션 포트폴리오 정보를 일자별 종목코드에 할당
            */
            //if(Object.keys( p_jongmok ).includes( v_portKey ) ) {

            if (v_portItem.IMPORT_YN == "1" && Number(v_portItem.startDate) <= Number(p_param.F12506)) {

                if(Object.keys( p_jongmok ).includes( v_portKey ) ) {
                    v_portItem.F16013_exists_yn         =   "Y";                        /* 종목코드 존재여부 */

                    v_portItem.TODAY_RATE               =   0;
                    v_portItem.BEFORE_RATE              =   0;

                    Object.assign( p_jongmok[ v_portKey ],  v_portItem );

                    if( totalInfo.rebalancing == "0" ) {
                        if( p_jongmok[ v_portKey ].rebalancing    ==  "1"  ) {
                            totalInfo.rebalancing       =   "1";
                        }
                    }
                } else {
                    /* 항목정보 설정 */
                    v_portItem.F12506                   =   p_param.F12506;
                    v_portItem.importance               =   0;                                                  /* 비중 */
                    v_portItem.F15007                   =   0;                                                  /* 기준가 ( 전일 종가 ) - 기준가 */
                    v_portItem.F30700                   =   0;                                                  /* 현재가 ( 당일 종가 ) - 종가 */
                    v_portItem.F16143                   =   0;                                                  /* 상장주식수 */
                    v_portItem.F16013_exists_yn         =   "N";                                                /* 종목코드 존재여부 */
                    v_portItem.TODAY_RATE               =   0;
                    v_portItem.BEFORE_RATE              =   0;
                    v_portItem.rebalancing              =   "0";

                    p_jongmok[ v_portKey ]              =   Object.assign( {},  v_portItem );
                }

//                    console.log( "p_jongmok[ v_portKey ].rebalance_F12506", p_jongmok[ v_portKey ].rebalance_F12506 );
            }
            else{

                /* 일자별 이력에 종목코드가 없는 경우 현금존재여부 = 'Y' 로 설정 */
                if( krwInfo.KRW_exists_yn  ==  "N" ) {
                    krwInfo.KRW_exists_yn   =   "Y";
                }
                

            /* 현금에서 사용할 정보 설정 */

                /* 존재하지 않는 항목들의 비중 누적 ( 비중이 정수로 되어 있어 100을 나눈다. ) */
                krwInfo.importance                  =   (
                        Number( krwInfo.importance )
                    +   (
                                Number( v_portItem.importance )
                            /   numInfo.IMPORTANCE_FIX_NUM 
                        )
                );

            /* 항목정보 설정 */
                v_portItem.F12506                   =   p_param.F12506;
                v_portItem.importance               =   0;                                                  /* 비중 */
                v_portItem.F15007                   =   0;                                                  /* 기준가 ( 전일 종가 ) - 기준가 */
                v_portItem.F30700                   =   0;                                                  /* 현재가 ( 당일 종가 ) - 종가 */
                v_portItem.F16143                   =   0;                                                  /* 상장주식수 */
                v_portItem.F16013_exists_yn         =   "N";                                                /* 종목코드 존재여부 */
                v_portItem.TODAY_RATE               =   0;
                v_portItem.BEFORE_RATE              =   0;
                v_portItem.rebalancing              =   "0";

                p_jongmok[ v_portKey ]              =   Object.assign( {},  v_portItem );
            }


            /* 비중 ( 비중이 정수로 되어 있어 100을 나눈다. ) */
            p_jongmok[ v_portKey ].importance  =       (
                    Number( p_jongmok[ v_portKey ].importance )
                /   numInfo.IMPORTANCE_FIX_NUM
            );



            /*************************************************************************************************************
            *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
            *   -   2 : 동일 가중인 경우 ( 상장주식수를 1로 고정한다 )
            **************************************************************************************************************/             
            if( "2" == v_portItem.importance_method_cd ) {

                p_jongmok[ v_portKey ].F16143       =   1;

            }


            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            p_jongmok[ v_portKey ].F15028_1         =   Number(
                fn_calc_data( 
                        "F15028_1"
                    ,   { 
                                F30700  :   p_jongmok[ v_portKey ].F30700     /* 현재가 ( 당일 종가 ) - 종가 */
                            ,   F16143  :   p_jongmok[ v_portKey ].F16143     /* 상장주식수 */
                        } 
                )
            );

            /* 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
            p_jongmok[ v_portKey ].F15028_2         =   Number(
                fn_calc_data( 
                        "F15028_2"
                    ,   { 
                                F15007  :   p_jongmok[ v_portKey ].F15007     /* 기준가 ( 전일 종가 ) - 기준가 */
                            ,   F16143  :   p_jongmok[ v_portKey ].F16143     /* 상장주식수 */
                        } 
                )
            );

// if( [ "20171228", "20180102" ].includes( p_param.F12506 ) ) {
//     console.log( "p_param.F12506", p_param.F12506, "v_dataKey", v_portKey, "F30700", p_jongmok[ v_portKey ].F30700, "F15007", p_jongmok[ v_portKey ].F15007, "F16143", p_jongmok[ v_portKey ].F16143, "p_jongmok[ v_portKey ].F15028_1", p_jongmok[ v_portKey ].F15028_1,"p_jongmok[ v_portKey ].F15028_2", p_jongmok[ v_portKey ].F15028_2, "\n" );    
// }            

            p_jongmok[ v_portKey ].BEFORE_IMPORTANCE    =   0;
            p_jongmok[ v_portKey ].AFTER_IMPORTANCE     =   0;


            if( typeof p_jongmok[ v_portKey ]   != "undefined" ) {

                if( typeof p_jongmok[ v_portKey ].F15028_1   != "undefined" ) {
                    v_F15028_1  =   Number( p_jongmok[ v_portKey ].F15028_1 );
                }

                if( typeof p_jongmok[ v_portKey ].F15028_2   != "undefined"
                ) {
                    v_F15028_2  =   Number( p_jongmok[ v_portKey ].F15028_2 );
                }
            }


        /* total 정보 설정 */

            /* 시가기준 시총 누적 - 종가 */
            totalInfo.tot_F15028_1                  =   Number( totalInfo.tot_F15028_1 )    +   v_F15028_1;

            /* 시가기준 시총 누적 - 기준가 */
            totalInfo.tot_F15028_2                  =   Number( totalInfo.tot_F15028_2 )    +   v_F15028_2;
        


            if( i == 0 ) {
                totalInfo.F12506                    =   p_param.F12506;                                     /* 입회일자 */
                totalInfo.grp_cd                    =   v_portItem.grp_cd;                                  /* 그룹코드(상위코드) */
                totalInfo.scen_cd                   =   v_portItem.scen_cd;                                 /* 시나리오코드 */
                totalInfo.start_year                =   v_portItem.start_year;                              /* 시작년도 */
                totalInfo.rebalance_cycle_cd        =   v_portItem.rebalance_cycle_cd;                      /* 리밸런싱주기 (COM006) */
                totalInfo.rebalance_date_cd         =   v_portItem.rebalance_date_cd;                       /* 리밸런싱일자 (COM007) */
                totalInfo.init_invest_money         =   v_portItem.init_invest_money;                       /* 초기투자금액 */
                totalInfo.bench_mark_cd             =   v_portItem.bench_mark_cd;                           /* 벤치마크 (COM008) */
                totalInfo.importance_method_cd      =   v_portItem.importance_method_cd;                    /* 비중설정방식 (COM009) */                
            }
        }


    /*************************************************************************************************************
    *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
    *   -   직접입력, 동일가중인 경우에만 현금을 추가한다.
    **************************************************************************************************************/
        if( [ "1", "2" ].includes( v_portItem.importance_method_cd ) ) {
    
        /* 2. 현금이 존재하는 경우 현금 종목을 추가한다. */
            if( krwInfo.KRW_exists_yn == "Y" ) {

                krwInfo.F12506      =   p_param.F12506;
                p_jongmok[ krwInfo.F16013 ]   =   {};

                Object.assign( p_jongmok[ krwInfo.F16013 ],   krwInfo );

                Object.assign( p_jongmok[ krwInfo.F16013 ],   totalInfo );


                /*************************************************************************************************************
                *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
                *   -   2 : 동일 가중인 경우 ( 상장주식수를 1로 고정한다 )
                **************************************************************************************************************/
                if( "2" == totalInfo.importance_method_cd ) {
                    p_jongmok[ krwInfo.F16013 ].F16143 =   1;
                }


                /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
                p_jongmok[ krwInfo.F16013 ].F15028_1   =   Number(
                    fn_calc_data( 
                            "F15028_1"
                        ,   {       
                                    F30700  :   p_jongmok[ krwInfo.F16013 ].F30700        /* 현재가 ( 당일 종가 ) - 종가 */
                                ,   F16143  :   p_jongmok[ krwInfo.F16013 ].F16143        /* 상장주식수 */
                            } 
                    )
                );

                /* 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
                p_jongmok[ krwInfo.F16013 ].F15028_2   =   Number(
                    fn_calc_data( 
                            "F15028_2"
                        ,   {       
                                    F15007  :   p_jongmok[ krwInfo.F16013 ].F15007        /* 기준가 ( 전일 종가 ) - 기준가 */
                                ,   F16143  :   p_jongmok[ krwInfo.F16013 ].F16143        /* 상장주식수 */
                            } 
                    )
                );
            }
        }




    /* total 정보 */

        v_F15028_1  =   0;    
        v_F15028_2  =   0;

        if( typeof p_jongmok[ krwInfo.F16013 ]   != "undefined" ) {

            if( typeof p_jongmok[ krwInfo.F16013 ].F15028_1   != "undefined" ) {
                v_F15028_1  =   Number( p_jongmok[ krwInfo.F16013 ].F15028_1 );
            }

            if( typeof p_jongmok[ krwInfo.F16013 ].F15028_2   != "undefined"
            ) {
                v_F15028_2  =   Number( p_jongmok[ krwInfo.F16013 ].F15028_2 );
            }
        }


        /* 최초 시가기준 시총 누적 - 종가 */
        totalInfo.tot_F15028_1          =   Number( totalInfo.tot_F15028_1 )    +   v_F15028_1;

        /* 시가기준 시총 누적 - 기준가 */
        totalInfo.tot_F15028_2          =   Number( totalInfo.tot_F15028_2 )    +   v_F15028_2;



        Object.assign( p_dailyObj[ p_param.F12506 ], totalInfo );


// if( [ "20171228", "20180102", "20180103" ].includes( p_param.F12506 )  ) {
//     console.log( "F12506", p_param.F12506, "totalInfo", totalInfo );
// }            
            

    }catch(e) {
        log.error( "simulModule.fn_set_dayilyJongmok", e );
    }
};


/*************************************************************************************************************
**************************************************************************************************************/

/*
* 직접입력, 시가총액 지수정보를 처리한다.
* 2019-08-14  bkLove(촤병국)
*/
var	fn_set_today_rate =	function(
        p_param={ 
                rowInx          :   -1      /* 일자별 종목 레코드 인덱스 */
            ,   F12506          :   ""      /* 입회일자 */
            ,   v_first_F12506  :   ""      /* 최초일자 */
            ,   v_before_F12506 :   ""      /* 직전 영업일 입회일자 */
            ,   first_oper_yn   :   "N"     /* 최초 레코드 기준 이전 영업일 여부 */
            ,   first_record_yn :   "N"     /* 최초 레코드 여부 */
            ,   case_gubun      :   "case1"
            ,   v_change_yn     :   "N"
            ,   p_prev_rebalancing_F12506   :   ""
        }
    ,   p_simul_mast                        /* 시뮬레이션 기본 마스터 정보 */
    ,   p_simulPortfolio                    /* [tm_simul_portfolio] 기준 종목 데이터 */
    ,   p_jongmok                           /* 현재 종목 */
    ,   p_prev_jongmok                      /* 이전 종목 */
    ,   p_daily                             /* 현재 daily */
    ,   p_prev_daily                        /* 이전 daily */
    ,   p_rebalanceObj                      /* rebalance 일자 */
) {

    /* 소수점시 계산시 사용할 고정값 */
    var numInfo     =   {
            IMPORTANCE_FIX_NUM      :   100                     /* 비중  소수점 계산시 사용할 고정값 */
        ,   IMPORTANCE_FIX_NUM1     :   10000                   /* 비중  소수점 계산시 사용할 고정값 */
        ,   JISU_RATE_FIX_NUM       :   100000000000000000      /* 지수적용비율 소수점 계산시 사용할 고정값 */
    };


    try{

        /* 당일 기준시총 총액 */
        p_daily.tot_F15028_S           =    0;

        /* 당일 비교시총 총액 */
        p_daily.tot_F15028_C           =    0;

        /* 기준가 * 상장주식수 총액 */
        p_daily.tot_F15007_F16143      =    0;

        /* 종가 * 상장주식수 총액 */
        p_daily.tot_F30700_F16143      =    0;


        for( var i = 0; i < Object.keys( p_jongmok ).length; i++ ) {

            var v_dataKey     =   Object.keys( p_jongmok )[i];
            var v_dataItem    =   p_jongmok[ v_dataKey ];




            /* 최초인 경우 종가 기준으로 설정 */
            if( p_param.first_record_yn == "Y" ) {
                v_dataItem.F15028       =   v_dataItem.F15028_1;
                p_daily.tot_F15028      =   p_daily.tot_F15028_1;
            }
            /* 최초인 경우 기준가 기준으로 설정 */
            else{
                v_dataItem.F15028       =   v_dataItem.F15028_2;
                p_daily.tot_F15028      =   p_daily.tot_F15028_2;
            }



            if( [ "1", "2" ].includes( v_dataItem.importance_method_cd ) ) {

                switch( p_param.case_gubun  ) {

                    case    "case1" :

                            /* 지수적용비율 = ( 비중(p_param.importance) * SUM(시가기준 시총 p_totalInfo.tot_F15028 ) ) / 현재종목 시가 총액( p_param.F15028 ) */
                            v_dataItem.TODAY_RATE           =   Number(
                                fn_calc_data(
                                        "TODAY_RATE1"
                                    ,   {       
                                                importance      :   v_dataItem.importance           /* 비중 */
                                            ,   F15028          :   v_dataItem.F15028               /* 시가기준 시총 */
                                        }
                                    ,   {       
                                                tot_F15028      :   p_daily.tot_F15028_1            /* 시가기준 시총 */
                                        }
                                )
                            );


                            break;

                    case    "case2" :

                            /* 지수적용비율 = ( 비중(p_param.importance) * SUM(시가기준 시총 p_totalInfo.tot_F15028 ) ) / 현재종목 시가 총액( p_param.F15028 ) */
                            v_dataItem.TODAY_RATE           =   Number(
                                fn_calc_data(
                                        "TODAY_RATE1"
                                    ,   {       
                                                importance      :   v_dataItem.importance           /* 비중 */
                                            ,   F15028          :   v_dataItem.F15028               /* 시가기준 시총 */
                                        }
                                    ,   {       
                                                tot_F15028      :   p_daily.tot_F15028_2            /* 시가기준 시총 */
                                        }
                                )
                            );                            

                            break;

                    case    "case3" :

                            /*  리밸런싱이 아니고 이벤트 변동이 없는 경우 전날 해당종목의 지수적용비율을 그대로 사용 */
                            if( p_param.v_change_yn == "N" ) {
                                v_dataItem.TODAY_RATE           =   p_prev_jongmok[ v_dataKey ].TODAY_RATE;
                            }
                            /* 
                            *   이벤트 발생 된 경우
                            *   -   전날의 비교시총 총합과 전날 종가 정보로 종목별 지수적용비율 재산정
                            *   -   재산정된 종목별 지수적용비율로 기준시총 총합을 재산정한다.
                            */
                            else{

                                /* 지수적용비율 = (T-1일_A종목종가(F30700) * T-1일_A종목상장주식수(F16143) * T-1일_A종목지수적용비율(TODAY_RATE)) * SUM(T일_기준가 * T일_상장주식수) / (T일_ A종목기준가 * T일_A종목상장주식수) */
                                v_dataItem.TODAY_RATE   =   Number(
                                    fn_calc_data(
                                            "TODAY_RATE2"
                                        ,   {       
                                                    importance          :   v_dataItem.importance                           /* 비중 */
                                                ,   F30700              :   p_prev_jongmok[ v_dataKey ].F30700              /* 현재가 ( 당일 종가 ) - 종가 */
                                                ,   F16143              :   p_prev_jongmok[ v_dataKey ].F16143              /* 상장주식수 */
                                                ,   TODAY_RATE          :   p_prev_jongmok[ v_dataKey ].TODAY_RATE          /* 지수적용비율 */
                                                ,   F15028              :   v_dataItem.F15028                               /* 시가기준 시총 */
                                                ,   F15007_F16143       :   v_dataItem.F15028_2                             /* 기준가 * 상장주식수 */
                                            }
                                        ,   {       
                                                    tot_F15007_F16143   :   p_daily.tot_F15028_2                            /* 기준가 * 상장주식수 총액 */
                                                ,   prev_tot_F15028_C   :   p_prev_daily.tot_F15028_C                       /* 전일 비교 시가총액 */
                                            }
                                    )
                                );
                            }

                            break;

                }
            }
            /*************************************************************************************************************
            *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
            *   -   3 : 시총비중인 경우 지수적용 비율을 1로 고정한다.
            **************************************************************************************************************/
            else if( [ "3" ].includes( v_dataItem.importance_method_cd ) ) {
                /* 지수적용비율 = 직전 지수적용 비율 */
                v_dataItem.TODAY_RATE           =   1;
            }


// if( [ "20171228", "20180102" ].includes( p_param.F12506 ) ) {
//     console.log( "p_param.F12506", p_param.F12506, "v_dataKey", v_dataKey, "case_gubun", p_param.case_gubun, "F15007", v_dataItem.F15007, "F16143", v_dataItem.F16143, "TODAY_RATE", v_dataItem.TODAY_RATE, "F30700", v_dataItem.F30700, "\n" );
//     console.log( "p_param.F12506", p_param.F12506, "v_dataKey", v_dataKey, "importance", v_dataItem.importance, "F15028", v_dataItem.F15028, "p_daily.tot_F15028_1", p_daily.tot_F15028_1, "TODAY_RATE", v_dataItem.TODAY_RATE, "\n" );    
// }


            if( p_prev_jongmok[ v_dataKey ] ) {
                v_dataItem.BEFORE_RATE          =   p_prev_jongmok[ v_dataKey ].TODAY_RATE;
            }else{
                v_dataItem.BEFORE_RATE          =   0;
            }



            /* 이벤트(비중조절, 종목편입)-COM011 ( 10-비중조절, 20-종목편입 ) */
            v_dataItem.EVENT_FLAG           =   "";  

            /* 최초인 경우 종가 기준으로 설정 */
            if( p_param.first_record_yn == "Y" ) {

                /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_dataItem.F15028_C         =   Number(
                    fn_calc_data( 
                            "F15028_C"
                        ,   {       
                                    F30700          :   v_dataItem.F30700               /* 현재가 ( 당일 종가 ) - 종가 */
                                ,   F16143          :   v_dataItem.F16143               /* 상장주식수 */
                                ,   TODAY_RATE      :   v_dataItem.TODAY_RATE           /* 지수적용비율 */
                            }
                        ,   {}
                    )
                );

                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_dataItem.F15028_S         =   v_dataItem.F15028_C;

            }else{

                /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_dataItem.F15028_C         =   Number(
                    fn_calc_data( 
                            "F15028_C"
                        ,   {       
                                    F30700          :   v_dataItem.F30700               /* 현재가 ( 당일 종가 ) - 종가 */
                                ,   F16143          :   v_dataItem.F16143               /* 상장주식수 */
                                ,   TODAY_RATE      :   v_dataItem.TODAY_RATE           /* 지수적용비율 */
                            }
                        ,   {}
                    )
                );

                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_dataItem.F15028_S         =   Number(
                    fn_calc_data(
                            "F15028_S_2"
                        ,   {       
                                    F15007          :   v_dataItem.F15007           /* 기준가 ( 전일 종가 ) - 기준가 */
                                ,   F16143          :   v_dataItem.F16143           /* 상장주식수 */
                                ,   TODAY_RATE      :   v_dataItem.TODAY_RATE       /* 지수적용비율 */
                            }
                        ,   {}
                    )
                );
      

                /* 종목이 편입되기 전엔 krw 로 존재했다가 종목이 편입되게 되면 krw 항목이 없어지게 됨. */
                if( typeof p_prev_jongmok[ v_dataKey ] != "undefined" ) {

                    /* 직전 [기준 시가총액]과 다르면 10-비중조절 로 설정 */
                    if( v_dataItem.F15028_S != p_prev_jongmok[ v_dataKey ].F15028_S ) {
                        v_dataItem.EVENT_FLAG   =   "10";       /* 10-비중조절 */
                    }
                }


                /* 리밸런싱인 경우 */
                // if( v_dataItem.rebalancing == "1" ) {
                //     var     v_rebalanceDate     =   p_rebalanceObj[ p_param.F12506 ];

                //     var     v_startDate         =   v_rebalanceDate.prev_rebalance_F12506   ? v_rebalanceDate.prev_rebalance_F12506 : p_param.v_first_F12506;
                //     var     v_endDate           =   v_rebalanceDate.rebalance_F12506        ? v_rebalanceDate.rebalance_F12506      : p_param.F12506;

                    // if( v_dataItem && v_dataItem.IMPORT_YN == "1" ) {
                    //     if( p_simulPortfolio[ v_dataKey ] && Object.keys( p_simulPortfolio[ v_dataKey ] ).length > 0 ) {

                    //         if( !v_rebalanceDate.add_jongmok[ v_dataKey ] || Object.keys( v_rebalanceDate.add_jongmok[ v_dataKey ] ).length == 0  ) {
                    //             v_rebalanceDate.add_jongmok[ v_dataKey ]    =   {};
                    //         }
                    //         v_rebalanceDate.add_jongmok[ v_dataKey ]        =   v_dataItem;
                    //     }

                    //     if( v_dataKey == "KRW" ) {
                    //         v_rebalanceDate.add_jongmok[ v_dataKey ]        =   v_dataItem;
                    //     }
                    // }
                    // else{

                    // }

                // }
            }


            /* 당일 기준시총 총액 */
            p_daily.tot_F15028_S           =    Number( p_daily.tot_F15028_S )      +   Number( v_dataItem.F15028_S );

            /* 당일 비교시총 총액 */
            p_daily.tot_F15028_C           =    Number( p_daily.tot_F15028_C )      +   Number( v_dataItem.F15028_C );


            /* 종가 * 상장주식수 * 시가총액 */
            v_dataItem.F15028_1_TODAY_RATE  =   Number(
                fn_calc_data(
                        "F15028_S_1"
                    ,   {       
                                F30700          :   v_dataItem.F30700           /* 종가 */
                            ,   F16143          :   v_dataItem.F16143           /* 상장주식수 */
                            ,   TODAY_RATE      :   v_dataItem.TODAY_RATE       /* 지수적용비율 */
                        }
                    ,   {}
                )
            );


            /* 기준가 * 상장주식수 * 시가총액 */
            v_dataItem.F15028_2_TODAY_RATE  =   Number(
                fn_calc_data(
                        "F15028_S_2"
                    ,   {       
                                F15007          :   v_dataItem.F15007           /* 기준가 ( 전일 종가 ) - 기준가 */
                            ,   F16143          :   v_dataItem.F16143           /* 상장주식수 */
                            ,   TODAY_RATE      :   v_dataItem.TODAY_RATE       /* 지수적용비율 */
                        }
                    ,   {}
                )
            );
   

// if( [ "20180102" ].includes( p_param.F12506 ) ) {
//     console.log( "p_param.F12506", p_param.F12506, "v_dataItem.F15007", v_dataItem.F15007, "v_dataItem.F16143", v_dataItem.F16143, "v_dataItem.TODAY_RATE", v_dataItem.TODAY_RATE, "v_dataItem.F15028_S", v_dataItem.F15028_S );
// }       


            /* 종가 * 상장주식수 * 시가총액 총합 */
            if( typeof p_daily.tot_F15028_1_TODAY_RATE == "undefined" ) {
                p_daily.tot_F15028_1_TODAY_RATE =   0;
            }
            p_daily.tot_F15028_1_TODAY_RATE     =      (
                    Number( p_daily.tot_F15028_1_TODAY_RATE )
                +   Number( v_dataItem.F15028_1_TODAY_RATE )
            );


            /* 기준가 * 상장주식수 * 시가총액 총합 */
            if( typeof p_daily.tot_F15028_2_TODAY_RATE == "undefined" ) {
                p_daily.tot_F15028_2_TODAY_RATE =   0;
            }
            p_daily.tot_F15028_2_TODAY_RATE     =      (
                    Number( p_daily.tot_F15028_2_TODAY_RATE )
                +   Number( v_dataItem.F15028_2_TODAY_RATE )
            );

            /* ( 첫날 종가, 이후 기준가 ) * 상장주식수 * 시가총액 총합 */
            if( typeof p_daily.tot_F15028_S_TODAY_RATE == "undefined" ) {
                p_daily.tot_F15028_S_TODAY_RATE =   0;
            }
            p_daily.tot_F15028_S_TODAY_RATE     =      (
                    Number( p_daily.tot_F15028_S_TODAY_RATE )
                +   Number( v_dataItem.F15028_S )
            );            



            /* 기준가 * 상장주식수 총액 */
            p_daily.tot_F15007_F16143      =    Number( p_daily.tot_F15007_F16143 ) +   Number( v_dataItem.F15007_F16143 );

            /* 종가 * 상장주식수 총액 */
            p_daily.tot_F30700_F16143      =    Number( p_daily.tot_F30700_F16143 ) +   Number( v_dataItem.F30700_F16143 );
        }



        /* 앞서 항목당 구해진 지수적용비율을 항목전체와 곱한 후 다시 비율을 구해야 하기에 전체 지수비율이 끝난후 다시 재산출하게 됨. */
        for( var i = 0; i < Object.keys( p_jongmok ).length; i++ ) {

            var v_dataKey     =   Object.keys( p_jongmok )[i];
            var v_dataItem    =   p_jongmok[ v_dataKey ];


            /* 기준 시가총액 비중 = 기준 시가총액( p_param.F15028_S ) / 시가 기준시총 총액 ( p_totalInfo.tot_F15028_S )  */
            v_dataItem.AFTER_IMPORTANCE         =       Number(
                fn_calc_data(
                        "F15028_S_importance"
                    ,   {       
                                F15028_S        :   v_dataItem.F15028_S                                 /* (첫날종가, 이후 기준가) * 상장주식수 * 지수적용비율 */
                        }
                    ,   {
                                tot_F15028_S    :   p_daily.tot_F15028_S_TODAY_RATE                     /* (첫날종가, 이후 기준가) * 상장주식수 * 지수적용비율 총합 */
                        }
                )
            );


            /* 기준 시가총액 비중 = 기준 시가총액( p_param.F15028_S ) / 시가 기준시총 총액 ( p_totalInfo.tot_F15028_S )  */
            v_dataItem.BEFORE_IMPORTANCE        =       Number(
                fn_calc_data(
                        "F15028_S_importance"
                    ,   {       
                                F15028_S        :   p_prev_jongmok[ v_dataKey ].F15028_1_TODAY_RATE     /* 기준가 * 상장주식수 * 지수적용비율 */
                        }
                    ,   {
                                tot_F15028_S    :   p_prev_daily.tot_F15028_1_TODAY_RATE                /* 기준가 * 상장주식수 * 지수적용비율 총합 */
                        }
                )
            );

// if( [ "20180126", "20180702" ].includes( p_param.F12506 ) ) {
//     console.log( "prev p_param.F12506", p_param.F12506, "v_dataKey", v_dataKey,  "prev.F15028_1_TODAY_RATE", p_prev_jongmok[ v_dataKey ].F15028_1_TODAY_RATE, "prev.tot_F15028_1_TODAY_RATE", p_prev_daily.tot_F15028_1_TODAY_RATE, "v_dataItem.BEFORE_IMPORTANCE", v_dataItem.BEFORE_IMPORTANCE, "\n"  );
// }

// if( [ "20180102"].includes( p_param.F12506 ) ) {
//     console.log( "p_param.F12506", p_param.F12506, "v_dataKey", v_dataKey,  "v_dataItem.AFTER_IMPORTANCE", v_dataItem.AFTER_IMPORTANCE, "v_dataItem.BEFORE_IMPORTANCE", v_dataItem.BEFORE_IMPORTANCE  );
// } 

            /* 리밸런싱인 경우 원본 종목정보를 보관한다. */
            if( p_daily.rebalancing == "1" ) {
                p_rebalanceObj[ p_param.F12506 ].org_jongmok[ v_dataKey ]       =   v_dataItem;

                /* 비중조절인 경우 */
                if( v_dataItem.EVENT_FLAG == "10" ) {
                    p_rebalanceObj[ p_param.F12506 ].imp_jongmok[ v_dataKey ]   =   v_dataItem;
                }
            }
        }


// if( [ "20171228", "20180102" ].includes( p_param.F12506 ) ) {
//     console.log( "p_param.F12506", p_param.F12506, "p_daily.tot_F15028_S", p_daily.tot_F15028_S, "p_daily.tot_F15028_C", p_daily.tot_F15028_C,  );
// }

        if( p_daily.rebalancing  !=  "1" && p_param.v_change_yn == "N" ) {
            p_daily.tot_F15028_S            =   p_prev_daily.tot_F15028_S;

// if( [ "20171228", "20180102" ].includes( p_param.F12506 ) ) {
//     console.log( "p_param.F12506", p_param.F12506, "p_daily.rebalancing", p_daily.rebalancing, "p_param.v_change_yn", p_param.v_change_yn, "tot_F15028_S", p_daily.tot_F15028_S );
// }

        }else{

            /* 기준시가 총액 재계산 = T-1일 기준시가총액(p_totalInfo.prev_tot_F15028_S) * SUM(p_totalInfo.tot_F15028_S) / T-1일 비교시가총액(p_totalInfo.prev_tot_F15028_C) */
            p_daily.tot_F15028_S      =   Number(
                fn_calc_data(
                        "tot_F15028_S"
                    ,   {}
                    ,   {       
                                tot_F15028_S        :   p_daily.tot_F15028_S                /* 기준 시가총액 */
                            ,   prev_tot_F15028_S   :   p_prev_daily.tot_F15028_S           /* 전일 기준 시가총액 */
                            ,   prev_tot_F15028_C   :   p_prev_daily.tot_F15028_C           /* 전일 비교 시가총액 */
                        }
                )
            );

// if( [ "20171228", "20180102" ].includes( p_param.F12506 ) ) {
//     console.log( "p_param.F12506", p_param.F12506, "p_daily.rebalancing", p_daily.rebalancing, "p_param.v_change_yn", p_param.v_change_yn, "tot_F15028_S", p_daily.tot_F15028_S_TODAY_RATE, "p_prev_daily.tot_F15028_S", p_prev_daily.tot_F15028_S, "p_prev_daily.tot_F15028_C", p_prev_daily.tot_F15028_C, "p_daily.tot_F15028_S", p_daily.tot_F15028_S );
// }

        }





        /* 전일 비교시총 총액 */
        p_daily.prev_tot_F15028_C          =   p_prev_daily.tot_F15028_C;

        /* 전일 기준시총 총액 */
        p_daily.prev_tot_F15028_S          =   p_prev_daily.tot_F15028_S;



        /* 지수 = ( 비교 시가총액(p_totalInfo.tot_F15028_C) / 기준 시가총액(p_totalInfo.tot_F15028_S) ) * 1000  */
        p_daily.INDEX_RATE    =   Number(
            fn_calc_data(
                    "INDEX_RATE"
                ,   {}
                ,   {       
                            tot_F15028_C        :   p_daily.tot_F15028_C        /* 비교 시가총액 */
                        ,   tot_F15028_S        :   p_daily.tot_F15028_S        /* 기준 시가총액 */
                    }
            )
        );
        
        
        /* RETURN_VAL = ( 당일 지수(p_totalInfo.INDEX_RATE) - 전일 지수(p_totalInfo.BEFORE_INDEX_RATE) ) / 전일 지수(p_totalInfo.BEFORE_INDEX_RATE)  */
        p_daily.RETURN_VAL    =   Number(
            fn_calc_data(
                    "RETURN_VAL"
                ,   {}
                ,   {       
                            INDEX_RATE          :   p_daily.INDEX_RATE          /* 당일 지수 */
                        ,   BEFORE_INDEX_RATE   :   p_prev_daily.INDEX_RATE     /* 전일 지수 */
                    }
            )
        );

        /* 전일 지수 */
        p_daily.PREV_INDEX_RATE             =   p_prev_daily.INDEX_RATE;

        /* 전일 RETURN_VAL */
        p_daily.PREV_RETURN_VAL             =   p_prev_daily.RETURN_VAL;

        

    }catch(e) {
        log.error( "simulModule.fn_set_today_rate", e );
    }
};


/*************************************************************************************************************
**************************************************************************************************************/

/*
* 이벤트 변동여부를 체크한다.
* 2019-08-14  bkLove(촤병국)
*/
var	fn_get_event_check =	function(
        p_param={ 
                rowInx          :   -1      /* 일자별 종목 레코드 인덱스 */
            ,   F12506          :   ""      /* 입회일자 */
            ,   v_before_F12506 :   ""      /* 직전 영업일 입회일자 */
            ,   first_oper_yn   :   "N"     /* 최초 레코드 기준 이전 영업일 여부 */
            ,   first_record_yn :   "N"     /* 최초 레코드 여부 */
        }
    ,   p_simul_mast                        /* 시뮬레이션 기본 마스터 정보 */
    ,   p_simulPortfolio                    /* [tm_simul_portfolio] 기준 종목 데이터 */
    ,   p_jongmok                           /* 현재 종목 */
    ,   p_prev_jongmok                      /* 이전 종목 */
    ,   p_daily                             /* 현재 daily */
    ,   p_prev_daily                        /* 이전 daily */
) {

    var eventObj    =   {
            F12506              :   p_param.F12506              /* 당일 */
        ,   before_F12506       :   p_param.v_before_F12506     /* 전일 */

        ,   tot_F15028_S        :   0                           /* 당일 기준시총 총액 */
        ,   tot_F15028_C        :   0                           /* 당일 비교시총 총액 */
        ,   tot_F15007_F16143   :   0                           /* 당일 기준가 * 상장주식수 총액 */

        ,   prev_tot_F15028_S   :   0                           /* 전일 기준시총 총액 */
        ,   prev_tot_F15028_C   :   0                           /* 전일 비교시총 총액 */

        ,   change_yn           :   "N"                         /* 변동여부 */
    };

    try{

        for( var i = 0; i < Object.keys( p_jongmok ).length; i++ ) {

            var v_dataKey     =   Object.keys( p_jongmok )[i];
            var v_dataItem    =   p_jongmok[ v_dataKey ];



            /* 기준가 기준 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
            v_dataItem.F15028           =   v_dataItem.F15028_2;               
            p_daily.tot_F15028          =   p_daily.tot_F15028_2;

            /* 종목이 편입되기 전엔 krw 로 존재했다가 종목이 편입되게 되면 krw 항목이 없어지게 됨. */
            if( typeof p_prev_jongmok[ v_dataKey ] != "undefined" ) {
                /* 지수적용비율 = 직전 지수적용 비율 */
                v_dataItem.TODAY_RATE               =   p_prev_jongmok[ v_dataKey ].TODAY_RATE;
            }


            /*************************************************************************************************************
            *   비중설정방식 ( COM009 ) importance_method_cd  - 1:직접입력, 2:동일가중, 3-시총비중
            *   -   3 : 시총비중인 경우 지수적용 비율을 1로 고정한다.
            **************************************************************************************************************/
            if( [ "3" ].includes( v_dataItem.importance_method_cd ) ) {
                /* 지수적용비율 = 직전 지수적용 비율 */
                v_dataItem.TODAY_RATE           =   1;
            }

            /* 기준가(p_param.F15007) * 상장주식수(p_param.F16143) */
            v_dataItem.F15007_F16143            =   Number(
                    fn_calc_data( 
                        "F15007_F16143"
                    ,   {       
                                F15007          :   v_dataItem.F15007               /* 기준가 ( 전일 종가 ) - 기준가 */
                            ,   F16143          :   v_dataItem.F16143               /* 상장주식수 */
                        }
                    ,   {}
                )
            );                   


                
            /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
            v_dataItem.F15028_S         =       Number(
                fn_calc_data( 
                        "F15028_S_2"
                    ,   {       
                                F15007          :   v_dataItem.F15007           /* 기준가 ( 전일 종가 ) - 기준가 */
                            ,   F16143          :   v_dataItem.F16143           /* 상장주식수 */
                            ,   TODAY_RATE      :   v_dataItem.TODAY_RATE       /* 지수적용비율 */
                        }
                    ,   {}
                )
            );

            /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
            v_dataItem.F15028_C         =   Number(
                fn_calc_data( 
                        "F15028_C"
                    ,   {       
                                F30700          :   v_dataItem.F30700               /* 현재가 ( 당일 종가 ) - 종가 */
                            ,   F16143          :   v_dataItem.F16143               /* 상장주식수 */
                            ,   TODAY_RATE      :   v_dataItem.TODAY_RATE           /* 지수적용비율 */
                        }
                    ,   {}
                )
            );             

            /* 당일 기준시총 총액 */
            eventObj.tot_F15028_S           =       Number( eventObj.tot_F15028_S )
                                                +   Number( v_dataItem.F15028_S );

            /* 당일 비교시총 총액 */
            eventObj.tot_F15028_C           =       Number( eventObj.tot_F15028_C )
                                                +   Number( v_dataItem.F15028_C );


            /* 기준가 * 상장주식수 총액 */
            eventObj.tot_F15007_F16143      =       Number( eventObj.tot_F15007_F16143 )
                                                +   Number( v_dataItem.F15007_F16143 );
        }


        /* 전일 비교시총 총액 */
        eventObj.prev_tot_F15028_C          =   p_prev_daily.tot_F15028_C;

        /* 전일 기준시총 총액 */
        eventObj.prev_tot_F15028_S          =   p_prev_daily.tot_F15028_S;

        /* 기준가 * 상장주식수 총액 */
        p_daily.tot_F15007_F16143           =   eventObj.tot_F15007_F16143;


        if( eventObj.tot_F15028_S   !=  eventObj.prev_tot_F15028_C ) {
            eventObj.change_yn      =   "Y";
        }

        return  eventObj.change_yn;

    }catch(e) {
        log.error( "simulModule.fn_get_event_check", e );
    }
};


/*************************************************************************************************************
**************************************************************************************************************/

/*
* 구분에 따라 계산식을 수행한다.
* 2019-08-14  bkLove(촤병국)
*/
var	fn_calc_data	=    function(
        p_gubun = 'F15028'                      /* 계산할 구분자 */
    ,   p_param={       
                importance          :   0       /* 비중 */
            ,   F15007              :   0       /* 기준가 ( 전일 종가 ) - 기준가 */
            ,   F30700              :   0       /* 수정주가 현재가 ( 당일 종가 ) - 종가 */
            ,   F16143              :   0       /* 상장주식수 */
            ,   F15028              :   0       /* 시가기준 시총 */
            ,   F15007_F16143       :   0       /* 기준가 * 상장주식수 */
            ,   TODAY_RATE          :   0       /* 지수적용비율 */
            ,   F15028_S            :   0       /* 기준 시가총액 */
            
        }
    ,   p_totalInfo={ 
                tot_F15028          :   0       /* 시가기준 시총 */
            ,   tot_F15028_S        :   0       /* 기준 시가총액 */
            ,   tot_F15028_C        :   0       /* 비교 시가총액 */
            ,   tot_F15007_F16143   :   0       /* 기준가 * 상장주식수 총액 */
            ,   tot_F30700          :   0       /* 수정기준가 총합 */
            ,   prev_tot_F15028_S   :   0       /* 전일 기준 시가총액 */
            ,   prev_tot_F15028_C   :   0       /* 전일 비교 시가총액 */
            ,   INDEX_RATE          :   0       /* 당일 지수 */
            ,   BEFORE_INDEX_RATE   :   0       /* 전일 지수 */
        }
) {

    /* 소수점시 계산시 사용할 고정값 */
    var numInfo     =   {
            IMPORTANCE_FIX_NUM      :   100                     /* 비중  소수점 계산시 사용할 고정값 */
        ,   IMPORTANCE_FIX_NUM1     :   10000                   /* 비중  소수점 계산시 사용할 고정값 */
        ,   JISU_RATE_FIX_NUM       :   100000000000000000      /* 지수적용비율 소수점 계산시 사용할 고정값 */
    };


    var v_calc      =   0;

    try{

        switch ( p_gubun ) {

                    /* 시가기준 시총 = 상장주식수(p_param.F16143) * 종가(p_param.F30700) */
            case    "F15028_1"    :
                        v_calc  =   Number( p_param.F16143 )  *  Number( p_param.F30700 );
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 시가기준 시총 = 상장주식수(p_param.F16143) * 기준가(p_param.F15007) */
            case    "F15028_2"    :
                        v_calc  =   Number( p_param.F16143 )  *  Number( p_param.F15007 );
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 기준가(p_param.F15007) * 상장주식수(p_param.F16143) */
            case    "F15007_F16143"  :
                        v_calc  =   Number( p_param.F15007 )  *  Number( p_param.F16143 );
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 종가(p_param.F30700) * 상장주식수(p_param.F16143) */
            case    "F30700_F16143"  :
                        v_calc  =   Number( p_param.F30700 )  *  Number( p_param.F16143 );
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 지수적용비율 = ( 비중(p_param.importance) * SUM(시가기준 시총 p_totalInfo.tot_F15028 ) ) / 현재종목 시가 총액( p_param.F15028 ) */
            case    "TODAY_RATE1"    :

                        /* 분모가 0 인 경우 */
                        if( !p_param.F15028 || p_param.F15028 == 0 ) {
                            v_calc  =   0;
                        }else{
                            v_calc  =   ((Number( p_param.importance ) * Number( p_totalInfo.tot_F15028 ) ) / p_param.F15028).toFixed(17);
                        }
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 지수적용비율 = (T-1일_A종목종가(F30700) * T-1일_A종목상장주식수(F16143) * T-1일_A종목지수적용비율(TODAY_RATE)) * SUM(T일_기준가 * T일_상장주식수) / (T일_ A종목기준가 * T일_A종목상장주식수) */
            case    "TODAY_RATE2"    :
                        /* 분모가 0 인 경우 */
                        if( !p_param.F15028 || p_param.F15028 == 0 ) {
                            v_calc  =   0;
                        }else{
                            v_calc  = 
                                ((( ( Number( p_param.F30700 ) * Number( p_param.F16143 ) * Number( p_param.TODAY_RATE ) ) / Number( p_totalInfo.prev_tot_F15028_C ) ) 
                                    *   Number( p_totalInfo.tot_F15007_F16143 )
                                )   /   Number( p_param.F15007_F16143)).toFixed(17);
                        }
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 지수적용비율 = ( 비중(importance) * SUM( 수정기준가 총합 tot_F30700 ) ) / 수정기준가( F30700 ) */
            case    "TODAY_RATE3"    :
                        v_calc  =   ( Number( p_param.TODAY_RATE ) * Number( p_param.F15028 ) );
                        break;

                    /* 기준시가 총액 재계산 = T-1일 기준시가총액(p_totalInfo.prev_tot_F15028_S) * SUM(p_totalInfo.tot_F15028_S) / T-1일 비교시가총액(p_totalInfo.prev_tot_F15028_C) */
            case    "tot_F15028_S"    :
                        /* 분모가 0 인 경우 */
                        if( !p_totalInfo.prev_tot_F15028_C || p_totalInfo.prev_tot_F15028_C == 0 ) {
                            v_calc  =   0;
                        }else{
                            v_calc  =   (( Number( p_totalInfo.prev_tot_F15028_S ) * Number( p_totalInfo.tot_F15028_S ) ) /   p_totalInfo.prev_tot_F15028_C).toFixed(17);
                        }
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 기준 시가총액 비중 = 기준 시가총액( p_param.F15028_S ) / 시가 기준시총 총액 ( p_totalInfo.tot_F15028_S )  */
            case    "F15028_S_importance"    :
                        /* 분모가 0 인 경우 */
                        if( !p_totalInfo.tot_F15028_S || p_totalInfo.tot_F15028_S == 0 ) {
                            v_calc  =   0;
                        }else{
                            v_calc  =    (Number( p_param.F15028_S ) / Number( p_totalInfo.tot_F15028_S )).toFixed(17) 
                        }
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 기준 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
            case    "F15028_S_1"    :
                        v_calc  =   (Number( p_param.F30700 )  *  Number( p_param.F16143 ) * Number( p_param.TODAY_RATE )).toFixed(17);
                        if (isNaN(v_calc)) v_calc = 0;
                        break;            

                    /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
            case    "F15028_S_2"    :
                        v_calc  =   (Number( p_param.F15007 )  *  Number( p_param.F16143 ) * Number( p_param.TODAY_RATE )).toFixed(17);
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 기준 시가총액 = 수정기준가(p_param.F15028_S) * 지수적용비율(p_param.TODAY_RATE) */
            case    "F15028_S"    :
                        v_calc  =   (Number( p_param.F15028_S ) *  Number( p_param.TODAY_RATE )).toFixed(17);
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
            case    "F15028_C"    :
                        v_calc  =   (Number( p_param.F30700 )  *  Number( p_param.F16143 ) *  Number( p_param.TODAY_RATE )).toFixed(17);
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* 지수 = ( 비교 시가총액(p_totalInfo.tot_F15028_C) / 기준 시가총액(p_totalInfo.tot_F15028_S) ) * 1000  */
            case    "INDEX_RATE"    :

                        /* 분모가 0 인 경우 */
                        if( !p_totalInfo.tot_F15028_S || p_totalInfo.tot_F15028_S == 0 ) {
                            v_calc  =   0;
                        }else{
                            v_calc  =   (Number( p_totalInfo.tot_F15028_C ) / Number( p_totalInfo.tot_F15028_S )  * 1000).toFixed(17);
                        }
                        if (isNaN(v_calc)) v_calc = 0;
                        break;

                    /* RETURN_VAL = ( 당일 지수(p_totalInfo.INDEX_RATE) - 전일 지수(p_totalInfo.BEFORE_INDEX_RATE) ) / 전일 지수(p_totalInfo.BEFORE_INDEX_RATE)  */
            case    "RETURN_VAL"    :

                        /* 분모가 0 인 경우 */
                        if( !p_totalInfo.BEFORE_INDEX_RATE || p_totalInfo.BEFORE_INDEX_RATE == 0 ) {
                            v_calc  =   0;
                        }else{
                            v_calc  =   ((Number( p_totalInfo.INDEX_RATE ) - Number( p_totalInfo.BEFORE_INDEX_RATE ) ) /   Number( p_totalInfo.BEFORE_INDEX_RATE )).toFixed(17);
                        }
                        if (isNaN(v_calc)) v_calc = 0;
                        break;
        }

    }catch(e) {
        log.error( "simulModule.fn_calc_data", e );
    }

    return  v_calc;
};


/*************************************************************************************************************
**************************************************************************************************************/

/*
* 종목들의 합산정보를 조회한다.
* 2019-08-14  bkLove(촤병국)
*/
var	fn_calc_jongmok	=    function(
    p_jongmok
) {

    try{

        if( p_jongmok && Object.keys( p_jongmok ).length > 0  ) {

            var p_return    =   {
                    tot_F15028_S        :   0
                ,   tot_F15028_C        :   0
                ,   tot_F15007_F16143   :   0
                ,   tot_F30700_F16143   :   0
            };

            for( var i = 0; i < Object.keys( p_jongmok ).length; i++ ) {

                var v_dataKey       =   Object.keys( p_jongmok )[i];
                var v_dataItem      =   p_jongmok[ v_dataKey ];

                var v_itemObj       =   {
                        F15028_C        :   0
                    ,   F15028_S        :   0
                    ,   F15007_F16143   :   0
                    ,   F30700_F16143   :   0
                };


                /* 비교 시가총액 = 종가(p_param.F30700) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_itemObj.F15028_C          =   Number(
                    fn_calc_data( 
                            "F15028_C"
                        ,   {       
                                    F30700          :   v_dataItem.F30700               /* 현재가 ( 당일 종가 ) - 종가 */
                                ,   F16143          :   v_dataItem.F16143               /* 상장주식수 */
                                ,   TODAY_RATE      :   v_dataItem.TODAY_RATE           /* 지수적용비율 */
                            }
                        ,   {}
                    )
                );

                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_itemObj.F15028_S          =   Number(
                    fn_calc_data(
                            "F15028_S_2"
                        ,   {       
                                    F15007          :   v_dataItem.F15007           /* 기준가 ( 전일 종가 ) - 기준가 */
                                ,   F16143          :   v_dataItem.F16143           /* 상장주식수 */
                                ,   TODAY_RATE      :   v_dataItem.TODAY_RATE       /* 지수적용비율 */
                            }
                        ,   {}
                    )
                );


                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_itemObj.F15007_F16143         =   Number(
                    fn_calc_data(
                            "F15007_F16143"
                        ,   {       
                                    F15007          :   v_dataItem.F15007           /* 기준가 ( 전일 종가 ) - 기준가 */
                                ,   F16143          :   v_dataItem.F16143           /* 상장주식수 */
                            }
                        ,   {}
                    )
                );

                /* 기준 시가총액 = 기준가(p_param.F15007) * 상장주식수(p_param.F16143) * 지수적용비율(p_param.TODAY_RATE) */
                v_itemObj.F30700_F16143         =   Number(
                    fn_calc_data(
                            "F30700_F16143"
                        ,   {       
                                    F30700          :   v_dataItem.F30700           /* 기준가 ( 전일 종가 ) - 기준가 */
                                ,   F16143          :   v_dataItem.F16143           /* 상장주식수 */
                            }
                        ,   {}
                    )
                );         

                /* 당일 기준시총 총액 */
                p_return.tot_F15028_S           =    Number( p_return.tot_F15028_S )      +   Number( v_itemObj.F15028_S );

                /* 당일 비교시총 총액 */
                p_return.tot_F15028_C           =    Number( p_return.tot_F15028_C )      +   Number( v_itemObj.F15028_C );

                /* 기준가 * 상장주식수 총액 */
                p_return.tot_F15007_F16143      =    Number( p_return.tot_F15007_F16143 ) +   Number( v_itemObj.F15007_F16143 );

                /* 종가 * 상장주식수 총액 */
                p_return.tot_F30700_F16143      =    Number( p_return.tot_F30700_F16143 ) +   Number( v_itemObj.F30700_F16143 );

            }

            return  p_return;
        }

    }catch(e) {
        log.error( "simulModule.fn_calc_jongmok", e );
    }        
}


module.exports.fn_calc_data             =   fn_calc_data;
module.exports.fn_calc_jongmok          =   fn_calc_jongmok; 
module.exports.fn_get_event_check       =   fn_get_event_check;
module.exports.fn_set_importDate        =   fn_set_importDate;
module.exports.fn_set_dayilyJongmok     =   fn_set_dayilyJongmok;
module.exports.fn_set_today_rate        =   fn_set_today_rate;