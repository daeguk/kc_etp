<template>
    <v-layout row wrap class="content_margin etp_new">
        <v-flex grow>
            <v-card flat>

                <v-card-title primary-title>
                    <h3 class="headline" pb-0>
                        PORTFOLIO SIMULATION |
                        <span   class="grey--text">KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>
                    </h3>
                    <div class="warning_box"    v-if="arr_show_error_message != null && arr_show_error_message.length > 0">
                        <span v-for="(item, index) in arr_show_error_message" :key="index">
                            <v-icon color="#ff4366">error_outline</v-icon> {{item}} <br>
                        </span>
                    </div>
                </v-card-title>


                <v-card class="register_wrap pt0" flat xs12 color="lighten-1">
                    <h4>조건 설정</h4>

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">상위그룹</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select   :items="arr_grp_cd" 

                                        item-text="grp_name" 
                                        item-value="grp_cd" 

                                        @change="fn_resetErrorMessage();"

                                        v-model="grp_cd"
                                        outline>
                            </v-select>
                        </v-flex>
                    </v-layout>                    

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시나리오명</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field   outline     v-model="scen_name"     @blur="fn_resetErrorMessage();"   maxlength="50"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시작년도</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select   :items="arr_start_year" 
                            
                                        item-text="text" 
                                        item-value="value"  

                                        @change="fn_resetErrorMessage();"
                                        
                                        v-model="start_year" 
                                        placeholder="선택하세요" 
                                        outline>
                            </v-select>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">리밸런싱주기</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select   :items="arr_rebalance_cycle_cd" 
                                        
                                        item-text="com_dtl_name" 
                                        item-value="com_dtl_cd"

                                        @change="fn_resetErrorMessage();fn_resetRebalanceDateCd()"
                                        
                                        v-model="rebalance_cycle_cd"
                                        placeholder="선택하세요" 
                                        outline>
                            </v-select>
                        </v-flex>
                        <v-flex xs8 row class="checkbox_w pl-2">
                            <v-layout row wrap class="light--text">

                                <v-radio-group  v-model="rebalance_date_cd" row>
                                    <v-radio
                                        v-for="(item, index) in arr_rebalance_date_cd"

                                        :key="'rebalance_date_cd_' + index"
                                        :label="item.com_dtl_name"
                                        :value="item.com_dtl_cd"
                                        :disabled="disabled_rebalance_cd[index]"

                                        @change="fn_resetErrorMessage();"

                                        color="primary"
                                    ></v-radio>
                                </v-radio-group>

                            </v-layout>
                        </v-flex>
                    </v-layout>


                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">초기투자금액(KRW)</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field   type="text"   v-model="init_invest_money" outline @blur="fn_resetErrorMessage();" maxlength="15"></v-text-field>
                        </v-flex>
                    </v-layout>


                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">벤치마크 설정</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select :items="items3" placeholder="선택하세요" outline  @change="fn_resetErrorMessage();"></v-select>
                        </v-flex>
                    </v-layout>
                </v-card>


                <v-card class="register_wrap pt0" flat xs12 color="lighten-1">
                    <h4>포트폴리오 설정</h4>
                    <v-layout row>
                        <v-flex xs12>
                            <div class="right_btn">
                                <span>비중설정방식:</span>
                                <span class="toggle2">

                                    <v-btn-toggle   v-model="importance_method_cd"  class="toggle_01" >
                                        <v-btn  v-for="(item, index) in arr_importance_method_cd"

                                                :key="'importance_method_cd_' + index" 
                                                :value="item.com_dtl_cd" 
                                                
                                                flat

                                                @click.stop="fn_setImportanceMethodCd( item.com_dtl_cd )"
                                        >{{ item.com_dtl_name }}</v-btn>
                                    </v-btn-toggle>

                                </span>
                            </div>
                        </v-flex>
                    </v-layout>


                    <v-card flat class="pt-3">
                        <table class="tbl_type ver10"   id="table01">
                            <caption>헤더 고정 테이블</caption>
                            <colgroup>
                                <col width="10%" />
                                <col width="25%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="20%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>종목코드</th>
                                    <th class="txt_left">종목명</th>
                                    <th class="txt_right">시가총액</th>
                                    <th class="txt_right">비중</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="sum">
                                    <td>Total</td>
                                    <td></td>
                                    <td></td>
                                    <td class="txt_right"></td>
                                    <td class="txt_right">
                                        <input type="text"  name="importance"   class="txt_right wid100" value="" /> %
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="text-xs-center mt-3">
                            <v-btn depressed color="primary" @click.stop="fn_saveBaicInfo()">백테스트 실행</v-btn>
                        </div>

                        <MastPopup v-if="MastModalFlag" @selectedItem="fn_getSelectedItem" @closeMastModal="fn_closeMastModal" ></MastPopup>

                    </v-card>

                </v-card>

            </v-card>
        </v-flex>

        <v-flex>
            <ConfirmDialog ref="confirm2"></ConfirmDialog>
        </v-flex>

    </v-layout>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import select from "datatables.net-select";
import Config from "@/js/config.js";

import MastPopup from "@/components/common/popup/MastPopup";
import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";

var table01 = null;


export default {

    props : [ "paramData" ],

    data() {
        return {
                toggle_one: 0
            ,   items3: ["설정안함", "KOSPI200", "KOSDAQ150", "KOSPI", "KOSDAQ"]
            ,   item: [
                    {
                        link: "Simulation/SimulationResult"
                    }
                ]


            ,   disabled_rebalance_cd:[ true, true, true, true, true ]
            ,   MastModalFlag: false
            ,   selectedRowIndex    :   -1
            ,   arr_rebalance_disabled_check    :   { 
                        /* 0번째- 첫영업일 / 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 / 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */

                        /* 0- 모든영업일 */
                        "0" :   [ true , true, true, true, true ]           /* disabled : 모두 */

                        /* 1-매주 */
                    ,   "1" :   [ false , true, true, true, true ]          /* disabled : 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 / 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */

                        /* 2-매월 */
                    ,   "2" :   [ false , true, true, false, false ]        /* disabled : 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 */

                        /* 3-분기 */
                    ,   "3" :   [ false , false, false, true, true ]        /* disabled : 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */                    

                        /* 4-반기 */
                    ,   "4" :   [ false , true, true, true, true ]          /* disabled : 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 / 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */

                        /* 5-분기 */
                    ,   "5" :   [ false , true, true, true, true ]          /* disabled : 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 / 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */

                }
            ,   arr_show_error_message      :   []          /* 에러 메시지 노출 정보 */

            ,   arr_grp_cd                  :   []          /* 상위 그룹정보 */
            ,   arr_start_year              :   []          /* 초기설정 시작년도 array */
            ,   arr_rebalance_cycle_cd      :   []          /* 초기설정 리밸런싱주기 array */
            ,   arr_rebalance_date_cd       :   []          /* 초기설정 리밸런싱일자 array */
            ,   arr_bench_mark_cd           :   []          /* 초기설정 벤치마크 array */
            ,   arr_importance_method_cd    :   []          /* 초기설정 비중설정방식 array */

            ,   prev_grp_cd                 :   ""          /* 그룹 코드 (변경전) */
            ,   prev_scen_cd                :   ""          /* 시나리오 코드 */
            ,   scen_cd                     :   ""          /* 시나리오 코드 */
            ,   scen_order_no               :   ""          /* 시나리오 정렬순번 */

            ,   grp_cd                      :   "*"         /* 상위 그룹코드 */
            ,   scen_name                   :   ""          /* 시나리오명 */
            ,   start_year                  :   "2000"      /* 시작년도 */
            ,   rebalance_cycle_cd          :   "0"         /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
            ,   rebalance_date_cd           :   ""          /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
            ,   init_invest_money           :   1000000     /* 초기투자금액 */
            ,   bench_mark_cd               :   "0"         /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
            ,   importance_method_cd        :   "1"         /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */

            ,   arr_portfolio               :   []          /* 포트폴리오 설정 정보 */
        };
    },

    components: {
        MastPopup,
        ConfirmDialog        
    },    

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        table01 =   $( "#table01" );

        /* 목록에서 넘겨받은 key 값이 존재하는 경우 등록된 내용을 조회하여 설정한다. */
        if(     vm.paramData && Object.keys( vm.paramData ).length > 0 
            &&  vm.paramData.grp_cd && vm.paramData.scen_cd 
        ) {

            /* 상위 그룹 정보 및 초기 데이터가 설정된 이후 상세정보 설정되도록 함. */
            
            /* 상위 그룹정보를 조회한다. */
            vm.fn_initGrpCd().then( async function(e) {

                if( e && e.result ) {

                    /* 초기 설정 데이터를 조회한다. */
                    await vm.fn_initData().then( async function(e1) {

                        if( e1 && e1.result ) {

                            /* 시뮬레이션 마스터 정보를 조회한다. */
                            vm.fn_getSimulMast( vm.paramData );

                            /* 시뮬레이션 포트폴리오 정보를 조회한다. */
                            vm.fn_getSimulPortfolio( vm.paramData );
                        }
                    });
                }
            });

        }else{

            /* 상위 그룹정보를 조회한다. */
            vm.fn_initGrpCd();

            /* 초기 설정 데이터를 조회한다. */
            vm.fn_initData();            

            /* next 시나리오명을 조회한다. */
            vm.fn_getNextScenName();

            /* 최초 5개의 레코드를 노출한다. */
            vm.fn_addRecords( 0, 5 );

            /* total 레코드를 설정한다. */
            vm.fn_setTotalRecord();
        }


        /* table tr 에서 추가 버튼을 누르는 경우 */
        $('#table01 tbody').on('click', "[name='btn_asset']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            vm.fn_resetErrorMessage();
            vm.fn_addRecords( rowIndex+1, 5 );
            vm.fn_setTotalRecord();
        });
        

        /* table tr 에서 자산찾기 버튼을 누르는 경우  */
        $('#table01 tbody').on('click', "[name='btn_F16316_search']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            vm.fn_resetErrorMessage();
            vm.fn_openMastModal( rowIndex );
        });


        /* table tr 에서 종목코드, 비중  blur 시 오류 메시지 초기화  */
        $('#table01 tbody').on('blur', "input[name='F16316'], input[name='importance']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            vm.fn_resetErrorMessage();

            /* 종목코드인 경우에만 코드 검색 */
            if( $(this).attr("name") == "F16316" ) {
                /* 종목코드를 검색한다. */
                vm.fn_getJongmokData( rowIndex, $(this) ).then(function(e){

                    if( e && e.result ) {
                        
                        var rowItem;
                        if( e.rowItem && Object.keys( e.rowItem ).length > 0 )  {
                            rowItem =   e.rowItem;

                            tr.find( "td input[name=F16316]" ).val( rowItem.F16012 );               /* 종목코드 */
                            tr.find( "td:eq(2)" ).text( rowItem.F16002 );                           /* 종목명 */

                            tr.find( "td:eq(3)" ).text( util.formatInt( rowItem.F15028 ) );         /* 시가총액 */
    //                      tr.find( "td:eq(5)" ).text( rowIndex / 100 );                           /* 지수적용비율 */

                            /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
                            vm.fn_setImportanceMethodCd( vm.importance_method_cd );
                        }
                    }
                });
            }
        });


        /* table tr 에서 종목코드 change 시 레코드 초기화   */
        $('#table01 tbody').on('change', "input[name='F16316']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            vm.fn_resetErrorMessage();
            vm.fn_resetRecords( rowIndex );

            /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
            vm.fn_setImportanceMethodCd( vm.importance_method_cd );
        });


        /* table tr 에서 종목코드 엔터키 누를시   */
        $('#table01 tbody').on('keypress', "input[name='F16316']", function(e) {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            vm.fn_resetErrorMessage();

            if( e.which == 13 ) {

                /* 종목코드를 검색한다. */
                vm.fn_getJongmokData( rowIndex, $(this) ).then(function(e){

                    if( e && e.result ) {
                        
                        var rowItem;
                        if( e.rowItem && Object.keys( e.rowItem ).length > 0 )  {
                            rowItem =   e.rowItem;

                            tr.find( "td input[name=F16316]" ).val( rowItem.F16012 );               /* 종목코드 */
                            tr.find( "td:eq(2)" ).text( rowItem.F16002 );                           /* 종목명 */

                            tr.find( "td:eq(3)" ).text( util.formatInt( rowItem.F15028 ) );         /* 시가총액 */
    //                      tr.find( "td:eq(5)" ).text( rowIndex / 100 );                           /* 지수적용비율 */

                            /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
                            vm.fn_setImportanceMethodCd( vm.importance_method_cd );
                        }
                    }
                });                
            }
        });        

        

        /* table tr 에서 비중 change 시 total 영역 계산   */
        $('#table01 tbody').on('change', "input[name='importance']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();
            var v_importance=   $(this);

            /* 비중을 변경하는 경우 [직접입력] 으로 강제 설정 */
            vm.importance_method_cd =   "1";

            if( v_importance.val() ) {
                v_importance.val( util.formatNumber( v_importance.val() ) );
            }

            vm.fn_resetErrorMessage();
            vm.fn_setTotalRecord();
        });
    },



    methods: {

        /*
         * 에러내용을 초기화 한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_resetErrorMessage : function() {
            var vm = this;

            vm.arr_show_error_message   =   [];
        },

        /*
         * 진행 progress 를 보여준다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showProgress: function( visible ) {
            var vm = this;
            vm.$emit("fn_showProgress", visible );
        },

        /*
         * 리밸런싱주기 선택시 v-radio 의 disabled 정보를 다시 셋팅한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_resetRebalanceDateCd: function() {
            var vm = this;

            var arr_temp = [...vm.arr_rebalance_cycle_cd];

            vm.arr_rebalance_cycle_cd   =   [];

            vm.disabled_rebalance_cd    =   vm.arr_rebalance_disabled_check[ vm.rebalance_cycle_cd ];
            vm.arr_rebalance_cycle_cd   =   [ ...arr_temp ];
        },

        /*
         * 비중설정방식 선택시 테이블의 비중정보를 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_setImportanceMethodCd: function( importance_method_cd ) {
            var vm = this;

            /* total 정보 */
            var total   =   {
                    length          :   0       /* 총건수 */
                ,   same_rate_sum   :   100     /* 동일가중 합계 */

                ,   F15028          :   0       /* (합계) 시가총액 */
                ,   importance      :   0       /* (합계) 비중 */
//              ,   jisu_rate       :   0       /* (합계) 지수적용 비율 */
            };
            var result  =   [];


            /* 계산할 항목에 대한 전체 정보를 구한다. */
            table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                var tr = $(this);

                var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );            /* 첫번째 컬럼 */
                var v_F16316        =   tr.find( "td input[name=F16316]" );             /* 종목코드 */

                var v_F15028        =   tr.find( "td:eq(3)" );                          /* 시가총액 */
                var v_importance    =   tr.find( "td input[name=importance]" );         /* 비중 */
//              var v_jisu_rate     =   tr.find( "td:eq(5)" );                          /* 지수적용비율 */           


                /* 종목코드가 존재하는 경우 */
                if( typeof v_F16316.val() != "undefined" ) {

                    if( v_F16316.val() != "" ) {
                        result.push( { 
                                F15028      :   0       /* 시가총액 */
                            ,   importance  :   0       /* 비중 */
//                          ,   jisu_rate   :   0       /* 지수적용비율 */
                        } );

                        total.length++;         /* 총건수 */

                        total.F15028            =   Number( total.F15028 )  +  Number( util.NumtoStr( v_F15028.text() ) );                                          /* (합계) 시가총액 */
//                      total.importance        =   Math.floor( ( total.importance * 100 )  +  ( Number( util.NumtoStr( v_importance.val() ) ) * 100 ) ) / 100;     /* (합계) 비중 */
//                      total.jisu_rate         =   Math.floor( ( total.jisu_rate * 100 )   +  ( Number( util.NumtoStr( v_jisu_rate.text() ) ) * 100 ) ) / 100;     /* (합계) 지수적용비율 */
                    }
                }
            });


            /*  레코드별 비중정보를 구한다. */
            if( [ "2", "3"].includes( importance_method_cd ) ) {
                var same_rate           =   Math.floor( parseFloat( total.same_rate_sum / total.length ) * 100 ) / 100;     /* 동일 가중 비율 */
                var v_temp_importance   =   0;
                var v_inx               =   0;

                table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                    var tr = $(this);

                    var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );                /* 첫번째 컬럼 */
                    var v_F16316        =   tr.find( "td input[name=F16316]" );                 /* 종목코드 */

                    var v_F15028        =   tr.find( "td:eq(3)" );                              /* 시가총액 */
                    var v_importance    =   tr.find( "td input[name=importance]" );             /* 비중 */
//                  var v_jisu_rate     =   tr.find( "td:eq(5)" );                              /* 지수적용비율 */

                    if( typeof v_F16316.val() != "undefined" ) {
                        if( v_F16316.val() != "" ) {

                            /* 동일가중인 경우 */
                            if( importance_method_cd == "2" ) {
                                v_temp_importance   =   same_rate;
                            }
                            /* 시총비중인 경우 */
                            else if( importance_method_cd == "3" ) {
                                v_temp_importance   =   Math.floor( parseFloat( Number( util.NumtoStr( v_F15028.text() ) ) / total.F15028 ) * 100 * 100 ) / 100;
                            }

//                          total.F15028                =   Number( total.F15028 )  +  Number( util.NumtoStr( v_F15028.text() ) );                                          /* (합계) 시가총액 */
                            total.importance            =   Math.floor( ( total.importance * 100 )  +  parseFloat( v_temp_importance * 100 ) ) / 100;                       /* (합계) 비중 */
//                          total.jisu_rate             =   Math.floor( ( total.jisu_rate * 100 )   +  ( Number( util.NumtoStr( v_jisu_rate.text() ) ) * 100 ) ) / 100;     /* (합계) 지수적용비율 */                            

                            result[v_inx].F15028        =   Number( util.NumtoStr( v_F15028.text() ) );             /* 시가총액 */
                            result[v_inx].importance    =   v_temp_importance;                                      /* 비중 */
//                          result[v_inx].jisu_rate     =   Number( util.NumtoStr( v_jisu_rate.text() ) );          /* 지수적용비율 */

                            v_inx++;
                        }
                    }
                });


                /* 비중 합계가 100 이  아닌 경우 0.01 값을 더해 100 이 되면 중단 */
                if( Math.floor( ( total.same_rate_sum - total.importance ) * 100 ) / 100 != 0 ) {

                    for( var i in result ) {
                        total.importance = Math.floor( ( total.importance * 100 ) +  parseFloat( 0.01 * 100 ) ) / 100 ;

                        result[i].importance   =   Math.floor( ( result[i].importance * 100 ) +  parseFloat( 0.01 * 100 ) ) / 100;
                        if( total.importance == total.same_rate_sum ) {
                            break;
                        }
                    }
                }


                /* 비중 정보를 tr 에 설정한다. */
                v_inx   =   0;
                table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                    var tr = $(this);

                    var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );                /* 첫번째 컬럼 */
                    var v_F16316        =   tr.find( "td input[name=F16316]" );                 /* 종목코드 */

                    var v_F15028        =   tr.find( "td:eq(3)" );                              /* 시가총액 */
                    var v_importance    =   tr.find( "td input[name=importance]" );             /* 비중 */
//                  var v_jisu_rate     =   tr.find( "td:eq(5)" );                              /* 지수적용비율 */

                    if( typeof v_F16316.val() != "undefined" ) {
                        if( v_F16316.val() != "" ) {
                            v_importance.val( result[v_inx].importance );                       /* 비중 */

                            v_inx++;
                        }
                    }
                });
            }

            vm.importance_method_cd =   importance_method_cd;

            /* total 레코드를 설정한다. */
            vm.fn_setTotalRecord( total );
        },

        /*
         * 상위 그룹정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_initGrpCd() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            return  await new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );
                axios.post(Config.base_url + "/user/simulation/getInitGrpCd", {
                    data: {}
                }).then( function(response) {

                    vm.fn_showProgress( false );

                    if (response && response.data) {
                        var msg = ( response.data.msg ? response.data.msg : "" );

                        if (!response.data.result) {
                            if( msg ) {
                                vm.arr_show_error_message.push( msg );
                            }

                            resolve( { result : false } );
                        }else{
                            vm.arr_grp_cd   =   response.data.dataList;

                            resolve( { result : true } );
                        }
                    }else{
                        resolve( { result : false } );
                    }
                }).catch(error => {
                    resolve( { result : false } );

                    vm.fn_showProgress( false );
                    if ( vm.$refs.confirm2.open(
                            '확인',
                            '서버로 부터 응답을 받지 못하였습니다.',
                            {}
                            ,4
                        )
                    ) {
                    }
                });

            }).catch( function(e1) {
                console.log( e1 );
                resolve( { result : false } );
            });
        },

        /*
         * 종목코드를 검색한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_getJongmokData( rowIndex=0, v_obj={} ) {
            var vm = this;

            if( v_obj.val() == "" ) {
                if (await vm.$refs.confirm2.open(
                        '확인',
                        '종목코드를 입력해 주세요.',
                        {}
                        ,1
                    )
                ) {
                    return  false;
                }

                return  false;
            }

            if( v_obj.val().length < 6 ) {
                if (await vm.$refs.confirm2.open(
                        '확인',
                        '종목코드를 6자리 이상 입력해 주세요.',
                        {}
                        ,1
                    )
                ) {
                    return  false;
                }
                return  false;
            }            


            return  new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                axios.post( Config.base_url + "/user/etp/getJongmokData", {
                    data: { "searchCode" : v_obj.val() }
                }).then(async function(response) {
                    console.log(response);

                    vm.fn_showProgress( false );

                    if (response.data) {
                        var msg = ( response.data.msg ? response.data.msg : "" );
                        if (!response.data.result) {
                            if( msg ) {
                                if (await vm.$refs.confirm2.open(
                                        '확인',
                                        msg,
                                        {}
                                        ,1
                                    )
                                ) {
                                    resolve( { result : false } );
                                }
                            }
                        }else{
                            var dataList = response.data.dataList;

                            if ( !dataList || dataList.length == 0 ) {
                                if (await vm.$refs.confirm2.open(
                                        '확인',
                                        '종목코드(' + v_obj.val() + ')가 존재하지 않습니다.',
                                        {}
                                        ,1
                                    )
                                ) {
                                    resolve( { result : false } );
                                }
                            }
                            else if ( dataList.length > 1 ) {
                                if (await vm.$refs.confirm2.open(
                                        '확인',
                                        '종목코드(' + v_obj.val() + ')가 여러건 존재합니다.',
                                        {}
                                        ,1
                                    )
                                ) {
                                    resolve( { result : false } );
                                }
                            
                            }else if(  dataList.length == 1 ) {
                                resolve( { result : true, rowItem : dataList[0] } );
                            }
                        }
                    }
                }).catch(error => {
                    resolve( { result : false } );

                    vm.fn_showProgress( false );
                    if ( vm.$refs.confirm2.open(
                            '확인',
                            '서버로 부터 응답을 받지 못하였습니다.',
                            {}
                            ,4
                        )
                    ) {
                    }
                });
            }).catch( function(e1) {
                console.log( e1 );
                resolve( { result : false } );
            });
        },

        /*
         * next 시나리오명을 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getNextScenName() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.fn_showProgress( true );

            axios.post(Config.base_url + "/user/simulation/getNextScenName", {
                data: {}
            }).then( function(response) {

                vm.fn_showProgress( false );

                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                        }
                    }else{
                        vm.scen_name   =   response.data.scen_name;
                    }
                }
            }).catch(error => {
                vm.fn_showProgress( false );
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '서버로 부터 응답을 받지 못하였습니다.',
                        {}
                        ,4
                    )
                ) {
                }
            });
        },

        /*
         * 초기 설정 데이터를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_initData() {
            var vm = this;

            /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
            /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
            /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
            /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
            var arrComMstCd = [ "COM006", "COM007", "COM008", "COM009" ];            

            vm.arr_show_error_message   =   [];

            return  new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                axios.post(Config.base_url + "/user/simulation/getInitData", {
                    data: { arrComMstCd : arrComMstCd }
                }).then( function(response) {

                    vm.fn_showProgress( false );

                    if (response && response.data) {
                        var arrMsg = ( response.data.arrMsg && response.data.arrMsg.length > 0 ? response.data.arrMsg : [] );

                        if (!response.data.result) {
                            if( arrMsg.length > 0 ) {
                                vm.arr_show_error_message.push( ...arrMsg );
                            }

                            resolve( { result : false } );
                        }else{

                            /* 초기설정 시작년도 array */
                            if( response.data.arr_start_year && response.data.arr_start_year.length > 0 ) {
                                vm.arr_start_year   =   response.data.arr_start_year;
                            }

                            /* 초기설정 리밸런싱주기 array */
                            if( response.data.arr_rebalance_cycle_cd && response.data.arr_rebalance_cycle_cd.length > 0 ) {
                                vm.arr_rebalance_cycle_cd   =   response.data.arr_rebalance_cycle_cd;
                            }

                            /* 초기설정 리밸런싱일자 array */
                            if( response.data.arr_rebalance_date_cd && response.data.arr_rebalance_date_cd.length > 0 ) {
                                vm.arr_rebalance_date_cd   =   response.data.arr_rebalance_date_cd;
                            }

                            /* 초기설정 벤치마크 array */
                            if( response.data.arr_bench_mark_cd && response.data.arr_bench_mark_cd.length > 0 ) {
                                vm.arr_bench_mark_cd   =   response.data.arr_bench_mark_cd;
                            }

                            /* 초기설정 비중설정방식 array */
                            if( response.data.arr_importance_method_cd && response.data.arr_importance_method_cd.length > 0 ) {
                                vm.arr_importance_method_cd   =   response.data.arr_importance_method_cd;
                            }

                            resolve( { result : true } );
                        }
                    }else{

                        resolve( { result : false } );
                    }
                }).catch(error => {
                    resolve( { result : false } );

                    vm.fn_showProgress( false );
                    if ( vm.$refs.confirm2.open(
                            '확인',
                            '서버로 부터 응답을 받지 못하였습니다.',
                            {}
                            ,4
                        )
                    ) {
                    }
                });

            }).catch( function(e1) {
                console.log( e1 );
                resolve( { result : false } );
            });                
        },

        /*
         * 레코드를 추가한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_addRecords( rowIndex=0, addCount=1, dataList=[] ) {
            var vm  =   this;

            var trHtml      =   "";
            var rowData     =   {};
            var strJson     =   "";
            for( var i=1; i <= addCount; i++ ) {
                rowData = {
                        grp_cd      :   ""      /* 그룹코드(상위코드) */
                    ,   scen_cd     :   ""      /* 시나리오코드 */
                    ,   F16316      :   ""      /* 구성종목코드 */
                    
                    ,   F16002      :   ""      /* 종목명 */
                    ,   order_no    :   0       /* 정렬 순번 */
                    ,   importance  :   ""      /* 비중 */
//                  ,   jisu_rate   :   ""      /* 지수적용비율 */

                    ,   F16013      :   ""      /* 단축코드 */
                    ,   F15028      :   ""      /* 시가총액 */
                    ,   F16017      :   ""      /* 상장일 */
                };


                if( dataList.length > 0 && i-1 <= dataList.length-1 ) {
                    rowData =   dataList[ i-1 ];

                    strJson =   JSON.stringify( { "F16013" : rowData.F16013 , "F15028" : rowData.F15028, "F16017" : rowData.F16017 } )
                }


                trHtml      +=  `<tr>`;

                                    /* asset 순번 */
                trHtml      +=  `    <td>`;
                if( i == addCount ) {
                    trHtml      +=  `       <button class="btn_icon v-icon material-icons" name="btn_asset">add_circle_outline</button>`;
                }else{
                    trHtml      +=  `       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
                }
                trHtml      +=  `        <span class="add_btn_span">Asset` + (rowIndex+i) + `</span>`;
                trHtml      +=  `    </td>`;

                                    /* 종목코드 */
                trHtml      +=  `    <td class="td_in_input">`;
                trHtml      +=  `        <input type="text"     name="F16316" class="txt_right wid150"  maxlength="15" value="` + rowData.F16316 + `" />`;
                trHtml      +=  `        <span>`;
                trHtml      +=  `            <button class="btn_icon v-icon material-icons"  name="btn_F16316_search" >search</button>`;
                trHtml      +=  `        </span>`;
                trHtml      +=  `    </td>`;

                                    /* 종목명 */
                trHtml      +=  `    <td class="txt_left">` + rowData.F16002 + `</td>`;

                                    /* 시가총액 */
                trHtml      +=  `    <td class="txt_right">` + ( rowData.F15028 ? util.formatInt( rowData.F15028 ) : '' ) + `</td>`;

                                    /* 비중 */
                trHtml      +=  `    <td class="txt_right">`;
                trHtml      +=  `        <input type="hidden"   name="strJson"      value="` + strJson + `" />`;
                trHtml      +=  `        <input type="text"     name="importance"   class="txt_right wid100"  maxlength="5" value="` + rowData.importance + `" /> %`;
                trHtml      +=  `    </td>`;

                trHtml      +=  `</tr>`;
            }

            $( "#table01 tbody > tr").eq( rowIndex ).before( trHtml );
        },

        /*
         * 종목코드 변경시 선택된 행 정보를 초기화 한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_resetRecords : function( rowIndex ) {
            var vm = this;

            var tr  =   table01.find( "tbody tr" ).eq( rowIndex );

//          tr.find( "td input[name=F16316]" ).val( "" );       /* 종목코드 */
            tr.find( "td:eq(2)" ).text( "" );                   /* 종목명 */
            tr.find( "td:eq(3)" ).text( "" );                   /* 시가총액 */

            tr.find( "td [name=importance]" ).val( "" );        /* 비중 */
//          tr.find( "td:eq(5)" ).text( "" );                   /* 지수적용비율 */
        },

        /*
         * total 레코드를 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_setTotalRecord : function( v_total ) {
            var vm = this;

            /* total 정보 */
            var total   =   {
                    length          :   0       /* 총건수 */
                ,   same_rate_sum   :   100     /* 동일가중 합계 */

                ,   F15028          :   0       /* (합계) 시가총액 */
                ,   importance      :   0       /* (합계) 비중 */
//              ,   jisu_rate       :   0       /* (합계) 지수적용 비율 */
            };            


            /* v_total 에 값이 있는 경우 tr 들을 순회하지 않는다.  */
            if( !v_total || Object.keys( v_total ).length == 0 ) {

                table01.find( "tbody tr input[name=F16316]" ).parents("tr").each( function( inx, rowItem ) {
                    var tr = $(this);

                    var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );                /* 첫번째 컬럼 */
                    var v_F16316        =   tr.find( "td input[name=F16316]" );                 /* 종목코드 */

                    var v_F15028        =   tr.find( "td:eq(3)" );                              /* 시가총액 */
                    var v_importance    =   tr.find( "td input[name=importance]" );             /* 비중 */
//                  var v_jisu_rate     =   tr.find( "td:eq(5)" );                              /* 지수적용비율 */

                    if( typeof v_F16316.val() != "undefined" ) {
                        if( v_F16316.val() != "" ) {
                            total.F15028            =   Number( total.F15028 )  +  Number( util.NumtoStr( v_F15028.text() ) );                                          /* (합계) 시가총액 */
                            total.importance        =   Math.floor( ( total.importance * 100 )  +  ( Number( util.NumtoStr( v_importance.val() ) ) * 100 ) ) / 100;     /* (합계) 비중 */
//                          total.jisu_rate         =   Math.floor( ( total.jisu_rate * 100 )   +  ( Number( util.NumtoStr( v_jisu_rate.text() ) ) * 100 ) ) / 100;     /* (합계) 지수적용비율 */
                        }
                    }
                });
            }

            /* tr 에 합계를 설정한다.  */
            total   =   Object.assign( total, v_total );
            table01.find( "tbody tr:last" ).each( function( inx, rowItem ) {
                var tr = $(this);

                tr.find( "td:eq(3)").text( util.formatInt( total.F15028 ) );                /* (합계) 시가총액 */
                tr.find( "td input[name=importance]").val( total.importance );              /* (합계) 비중 */
            });
        },

        /*
         * 자산추가 창을 오픈한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_openMastModal: function( rowIndex ) {  
            var vm = this;

            vm.selectedRowIndex =   rowIndex;
            vm.MastModalFlag    =   true;
        },

        /*
         * 자산추가 창을 종료한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_closeMastModal: function() { 
            var vm = this;

            vm.MastModalFlag    =   false;
        },

        /*
         *  자산추가에서 선택한 정보를 반환한다.
         *  gubun : 1 ETF, 2 ETN, 3 INDEX
         * 
         *  2019-07-26  bkLove(촤병국)
         */        
        async fn_getSelectedItem( items, gubun ) {
            var vm = this;

            for( let i=0; i < items.length; i++ ) {

                /* 추가된 자산정보를 table 에 설정한다. */
                await vm.fn_setMastRowData( vm.selectedRowIndex + i, items[i], gubun );
            }

            /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
            vm.fn_setImportanceMethodCd( vm.importance_method_cd );
        },

        /*
         * 추가된 자산정보를 table 에 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_setMastRowData: function( rowIndex=0, rowItem, gubun ) {
            var vm = this;

            var dataTrCnt   =   table01.find( "tbody tr input[name=F16316]" ).parents("tr").length;
            if( rowIndex > dataTrCnt-1 ) {
                vm.fn_addRecords( dataTrCnt, 5 );
            }

            var tr;          

            return  new Promise(function(resolve, reject) {

            /* 한건씩 자산을 추가한다. */
                tr  =   table01.find( "tbody tr" ).eq( rowIndex );

                tr.find( "td input[name=F16316]" ).val( rowItem.F16012 );       /* 종목코드 */
                tr.find( "td:eq(2)" ).text( rowItem.F16002 );                   /* 종목명 */


                vm.fn_showProgress( true );

            /* 선택된 종목의 구성정보를 조회한다. */
                axios.post(Config.base_url + "/user/simulation/getJongmokInfo", {
                    data: { "F16012" : rowItem.F16012 }
                }).then( function(response) {

                    vm.fn_showProgress( false );

                    if (response && response.data) {
                        var msg = ( response.data.msg ? response.data.msg : "" );

                        if (!response.data.result) {
                            if( msg ) {
                                vm.arr_show_error_message.push( msg );
                            }

                            resolve( { result : false } );
                        }else{
                            var jongmokInfo = response.data.jongmokInfo;
                            
                            if( !jongmokInfo || Object.keys( jongmokInfo ).length == 0 ) {
                                jongmokInfo =   {};
                            }

                            tr.find( "td:eq(3)" ).text( util.formatInt( jongmokInfo.F15028 ) );     /* 시가총액 */
//                          tr.find( "td:eq(5)" ).text( rowIndex / 100 );                           /* 지수적용비율 */
                            resolve( { result : true } );
                        }

                    }else{
                        resolve( { result : false } );
                    }

                }).catch(error => {
                    resolve( { result : false } );

                    vm.fn_showProgress( false );
                    if ( vm.$refs.confirm2.open(
                            '확인',
                            '서버로 부터 응답을 받지 못하였습니다.',
                            {}
                            ,4
                        )
                    ) {
                    }
                });

            }).catch( function(e1) {
                console.log( e1 );
                resolve( { result : false } );
            });
        },

        /*
         * 테이블 정보를 점검 후 list 에 저장한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_table2List() {
            var vm = this;

            /* total 정보 */
            var total   =   {
                    length          :   0       /* 총건수 */
                ,   same_rate_sum   :   100     /* 동일가중 합계 */

                ,   F15028          :   0       /* (합계) 시가총액 */
                ,   importance      :   0       /* (합계) 비중 */
//              ,   jisu_rate       :   0       /* (합계) 지수적용 비율 */
            };            
            

            var rowIndex = 1;

            vm.arr_portfolio    =   [];
            
            table01.find( "tbody  tr" ).each( function( inx, rowItem ) {
                var tr = $(this);

                var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );            /* 첫번째 컬럼 */
                var v_F16316        =   tr.find( "td input[name=F16316]" );             /* 종목코드 */
                var v_F16316_nm     =   tr.find( "td:eq(2)" );                          /* 종목코드 명 */

                var v_F15028        =   tr.find( "td:eq(3)" );                          /* 시가총액 */
                var v_importance    =   tr.find( "td input[name=importance]" );         /* 비중 */
//              var v_jisu_rate     =   tr.find( "td:eq(5)" ).text();                   /* 지수적용비율 */

                if( typeof v_F16316.val() != "undefined" ) {

                    if( v_F16316.val() != "" ) {

                        /* 종목코드가 존재시 종목명이 없는 경우 ( 종목코드를 수정한 경우 종목명을 지움 ) */
                        if( v_F16316_nm.text() == "" ) {
                            vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 종목명이 존재하지 않습니다. 종목코드를 확인해 주세요." );
                        }

                        /* 종목코드가 존재시 비중정보 체크 */
                        try{
                            if( v_importance.val() == "" ) {
                                vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 비중을 입력해 주세요." );
                            }else if( isNaN( v_importance.val() ) ) {
                                vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 비중은 숫자만 입력해 주세요." );
                            }else if( Number( v_importance.val() ) <= 0 ) {
                                vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 비중은 0 보다 큰수를 입력해 주세요." );
                            }
                        }catch( e ) {
                            vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 비중은 숫자만 입력해 주세요." );
                        }

                        total.length++;         /* 총건수 */
                        total.F15028            =   Number( total.F15028 )  +  Number( util.NumtoStr( v_F15028.text() ) );                                          /* (합계) 시가총액 */
                        total.importance        =   Math.floor( ( total.importance * 100 )  +  ( Number( util.NumtoStr( v_importance.val() ) ) * 100 ) ) / 100;     /* (합계) 비중 */
//                      total.jisu_rate         =   Math.floor( ( total.jisu_rate * 100 )   +  ( Number( util.NumtoStr( v_jisu_rate.text() ) ) * 100 ) ) / 100;     /* (합계) 지수적용비율 */                        

                        vm.arr_portfolio.push({
                                "F16316"        :   v_F16316.val()                          /* 종목코드 */
                            ,   "importance"    :   util.NumtoStr( v_importance.val() )     /* 비중 */
//                          ,   "jisu_rate"     :   util.NumtoStr( v_jisu_rate )            /* 지수적용비율 */
                            ,   "order_no"      :   rowIndex++                              /* 정렬 순번 */
                            ,   "trIndex"       :   inx                                     /* 테이블 레코드 순번 */
                        });                        
                    }else{

                        /* 종목코드 없이 비중을 입력한 경우 */
                        if( v_importance.val() != "" ) {
                            vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 종목코드를 선택해주세요" );
                        }

                    }
                }
            });


            if( !vm.arr_portfolio || vm.arr_portfolio.length == 0 ) {
                vm.arr_show_error_message.push( "[포트폴리오] 종목코드가 한건 이상 존재해야 합니다." );
                return  false;
            }

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }

            /* [포트폴리오] 2건 이상인 경우 중복을 체크한다. */
            if( vm.arr_portfolio && vm.arr_portfolio.length > 1 ) {
                var     tr1         =   null;
                var     tr2         =   null;

                var     row1        =   null;
                var     row2        =   null;

                var     v_text01    =   null;
                var     v_text02    =   null;                
                for( var i = 0; i < vm.arr_portfolio.length -1; i++ ) {
                    row1    =   vm.arr_portfolio[i];

                    for( var j = i+1; j < vm.arr_portfolio.length ; j++ ) {
                        row2        =   vm.arr_portfolio[j];

                        v_text01    =   null;
                        v_text02    =   null;
                        if( row1.F16316 == row2.F16316 ) {
                            tr1         =   $( "#table01 tbody > tr").eq( vm.arr_portfolio[i].trIndex );
                            tr2         =   $( "#table01 tbody > tr").eq( vm.arr_portfolio[j].trIndex );

                            v_text01    =   tr1.find( "td:eq(0) .add_btn_span" );           /* 첫번째 컬럼 */
                            v_text02    =   tr2.find( "td:eq(0) .add_btn_span" );           /* 첫번째 컬럼 */

                            vm.arr_show_error_message.push( "[포트폴리오] " + v_text01.text() + ", " + v_text02.text() + " 종목코드가 중복 존재합니다. " );
                        }
                    }
                }
            }

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }            


            /* 포트폴리오 1건 이상 입력한 경우에는 비중의 합은 100 이 되어야 함.  */
            if( vm.arr_portfolio.length > 0 && total.importance != 100 ) {
                vm.arr_show_error_message.push( "[포트폴리오] 비중의 합은 100 이 되어야 합니다." );
                return  false;
            }
        },        

        /*
         * 시뮬레이션 기본정보를 저장한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_saveBaicInfo() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            /* 상위그룹 array */
            if( !vm.arr_grp_cd || vm.arr_grp_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [상위그룹] 정보가 존재하지 않습니다." );
            }            

            /* 초기설정 시작년도 array */
            if( !vm.arr_start_year || vm.arr_start_year.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [시작년도] 값이 존재하지 않습니다." );
            }

            /* 초기설정 리밸런싱주기 array */
            if( !vm.arr_rebalance_cycle_cd || vm.arr_rebalance_cycle_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [리밸런싱주기] 값이 존재하지 않습니다." );
            }

            /* 초기설정 리밸런싱일자 array */
            if( !vm.arr_rebalance_date_cd || vm.arr_rebalance_date_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [리밸런싱일자] 값이 존재하지 않습니다." );
            }

            /* 초기설정 벤치마크 array */
            if( !vm.arr_bench_mark_cd || vm.arr_bench_mark_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [벤치마크] 값이 존재하지 않습니다." );
            }

            /* 초기설정 비중설정방식 array */
            if( !vm.arr_importance_method_cd || vm.arr_importance_method_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [비중설정방식] 값이 존재하지 않습니다." );
            }

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }



            if( !vm.scen_name || vm.scen_name.length == 0 ) {
                vm.arr_show_error_message.push( "[조건설정] 시나리오명을 입력해 주세요." );
            }


            if( !vm.start_year ) {
                vm.arr_show_error_message.push( "[조건설정] 시작년도를 선택해 주세요." );
            }

            if( !vm.rebalance_cycle_cd ) {
                vm.arr_show_error_message.push( "[조건설정] 리밸런싱주기를 선택해 주세요." );
            }

            if( !vm.rebalance_date_cd ) {
                vm.arr_show_error_message.push( "[조건설정] 리밸런싱 일자를 선택해 주세요." );
            }

            try{
                if( vm.init_invest_money == "" ) {
                    vm.arr_show_error_message.push( "[조건설정] 초기투자금액을 입력해 주세요." );
                }else if( isNaN( vm.init_invest_money ) ) {
                    vm.arr_show_error_message.push( "[조건설정] 초기투자금액은 숫자만 입력해 주세요." );
                }else if( Number( vm.init_invest_money ) <= 0 ) {
                    vm.arr_show_error_message.push( "[조건설정] 초기투자금액은 0 보다 큰수를 입력해 주세요." );
                }
            }catch( e ) {
                vm.arr_show_error_message.push( "[조건설정] 초기투자금액은 숫자만 입력해 주세요." );
            }

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }  


            /* 테이블 정보를 점검 후 list 에 저장한다. */
            vm.fn_table2List();

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }


            vm.fn_showProgress( true );

            axios.post(Config.base_url + "/user/simulation/saveBaicInfo", {
                data: { 
                        
                        "prev_grp_cd"           :   vm.prev_grp_cd              /* 그룹 코드 (변경전) */
                    ,   "prev_scen_cd"          :   vm.prev_scen_cd             /* 시나리오 코드 (변경전) */
                    ,   "scen_cd"               :   vm.scen_cd                  /* 시나리오 코드 */
                    ,   "scen_order_no"         :   vm.scen_order_no            /* 시나리오 정렬순번 */

                    ,   "grp_cd"                :   vm.grp_cd                   /* 상위 그룹코드 */
                    ,   "scen_name"             :   vm.scen_name                /* 시나리오명 */
                    ,   "start_year"            :   vm.start_year               /* 시작년도 */
                    ,   "rebalance_cycle_cd"    :   vm.rebalance_cycle_cd       /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
                    ,   "rebalance_date_cd"     :   vm.rebalance_date_cd        /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
                    ,   "init_invest_money"     :   vm.init_invest_money        /* 초기투자금액 */
                    ,   "bench_mark_cd"         :   vm.bench_mark_cd            /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
                    ,   "importance_method_cd"  :   vm.importance_method_cd     /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */

                    ,   "arr_portfolio"         :   vm.arr_portfolio            /* 포트폴리오 설정 정보 */
                }
            }).then( async function(response) {

                vm.fn_showProgress( false );

                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                            return  false;
                        }
                    }else{

                        vm.prev_grp_cd      =   response.data.grp_cd;           /* 그룹 코드 */
                        vm.prev_scen_cd     =   response.data.scen_cd;          /* 시나리오 코드 */
                        vm.scen_cd          =   response.data.scen_cd;          /* 시나리오 코드 */
                        vm.scen_order_no    =   response.data.scen_order_no;    /* 시나리오 정렬순번 */

                        var arr_daily       =   response.data.arr_daily;
                        var arr_rebalance   =   response.data.arr_rebalance;
                        var simulMastObj    =   response.data.simulMastObj;

                        if( msg ) {
                            if ( await vm.$refs.confirm2.open(
                                    '확인',
                                    msg,
                                    {}
                                    ,1
                                )
                            ) {
                                if(vm.$refs.confirm2.val == 'Y') {

                                    vm.$emit( "fn_showSimulation", 
                                        { 
                                                showSimulationId    :    2
                                            ,   arr_daily           :   arr_daily
                                            ,   arr_rebalance       :   arr_rebalance
                                            ,   simul_mast          :   simulMastObj
                                        }
                                    );

                                    /* 시뮬레이션 마스터 정보를 조회한다. */
//                                    vm.fn_getSimulMast( { grp_cd : vm.grp_cd, scen_cd : vm.scen_cd } );

                                    /* 시뮬레이션 포트폴리오 정보를 조회한다. */
//                                    vm.fn_getSimulPortfolio( { grp_cd : vm.grp_cd, scen_cd : vm.scen_cd } );

                                }
                            }
                        }
                    }
                }
            }).catch(error => {
                vm.fn_showProgress( false );
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '서버로 부터 응답을 받지 못하였습니다.',
                        {}
                        ,4
                    )
                ) {
                }
            });
        },

        /*
         * 시뮬레이션 마스터 정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getSimulMast( v_paramData ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.fn_showProgress( true );

            axios.post(Config.base_url + "/user/simulation/getSimulMast", {
                data: v_paramData
            }).then( function(response) {

                vm.fn_showProgress( false );

                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                        }
                    }else{
                        var mastInfo = response.data.mastInfo;

                        if( mastInfo && Object.keys( mastInfo ).length > 0 ) {
                            vm.prev_grp_cd              =   mastInfo.grp_cd;                /* 상위 그룹코드 (변경전) */
                            vm.prev_scen_cd             =   mastInfo.scen_cd;               /* 시나리오 코드 (변경전) */

                            vm.scen_cd                  =   mastInfo.scen_cd;               /* 시나리오 코드 */
                            vm.scen_order_no            =   mastInfo.scen_order_no;         /* 시나리오 정렬순번 */

                            vm.grp_cd                   =   mastInfo.grp_cd;                /* 상위 그룹코드 */
                            vm.scen_name                =   mastInfo.scen_name;             /* 시나리오명 */
                            vm.start_year               =   mastInfo.start_year;            /* 시작년도 */
                            vm.rebalance_cycle_cd       =   mastInfo.rebalance_cycle_cd;    /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
                            vm.rebalance_date_cd        =   mastInfo.rebalance_date_cd;     /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
                            vm.init_invest_money        =   mastInfo.init_invest_money;     /* 초기투자금액 */
                            vm.bench_mark_cd            =   mastInfo.bench_mark_cd;         /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
                            vm.importance_method_cd     =   mastInfo.importance_method_cd;  /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */

                            if( !vm.rebalance_cycle_cd ) {
                                vm.rebalance_cycle_cd   =   "0";
                            }

                            /* 리밸런싱주기 선택시 v-radio 의 disabled 정보를 다시 셋팅한다. */
                            vm.fn_resetRebalanceDateCd();
                        }
                    }
                }
            }).catch(error => {
                vm.fn_showProgress( false );
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '서버로 부터 응답을 받지 못하였습니다.',
                        {}
                        ,4
                    )
                ) {
                }
            });
        },

        /*
         * 시뮬레이션 포트폴리오 정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getSimulPortfolio( v_paramData ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.fn_showProgress( true );

            axios.post(Config.base_url + "/user/simulation/getSimulPortfolio", {
                data: v_paramData
            }).then( function(response) {

                vm.fn_showProgress( false );

                /* 레코드를 초기화 한다. */
                vm.fn_initRecords();

                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                        }
                    }else{
                        var dataList = response.data.dataList;
                        var cnt = 0;

                        if( !dataList ) {
                            dataList    =   [];
                        }

                        /* 건수가 0 인 경우 레코드 5개는 추가한다. */
                        var cnt = ( Math.ceil( dataList.length / 5 ) == 0 ? 1 : Math.ceil( dataList.length / 5 ) ) * 5;                  

                        /* 레코드를 추가한다. */
                        vm.fn_addRecords( 0, cnt, dataList );

                        /* total 레코드를 설정한다. */
                        vm.fn_setTotalRecord();

                        vm.arr_portfolio    =   dataList;
                    }
                }
            }).catch(error => {
                vm.fn_showProgress( false );
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '서버로 부터 응답을 받지 못하였습니다.',
                        {}
                        ,4
                    )
                ) {
                }
            });
        },

        /*
         * 레코드를 초기화 한다.
         * 2019-07-26  bkLove(촤병국)
         */        
        fn_initRecords() {

            var vm = this;

            $( table01.find( "tbody tr input[name=F16316]" ).parents("tr").get().reverse() ).each(function(inx){
                var tr = $(this);

                var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );                /* 첫번째 컬럼 */
                var v_F16316        =   tr.find( "td input[name=F16316]" );                 /* 종목코드 */

                var v_F15028        =   tr.find( "td:eq(3)" );                              /* 시가총액 */
                var v_importance    =   tr.find( "td input[name=importance]" );             /* 비중 */
//              var v_jisu_rate     =   tr.find( "td:eq(5)" );                              /* 지수적용비율 */

                if( typeof v_F16316 != "undefined" ) {
                    $(this).remove();
                }                
            });
        }
    }
};
</script>