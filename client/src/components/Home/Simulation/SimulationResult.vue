<template>
    <v-layout row wrap class="content_margin etp_new">
        <v-flex grow>

            <v-card flat>
                <v-card-title primary-title>
                    <h3 class="headline" pb-0>
                        PORTFOLIO SIMULATION |
                        <span
                            class="grey--text"
                        >KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>
                    </h3>
                </v-card-title>
            </v-card>

            <v-card flat class="bot_pad1">
                <div class="warning_box"    v-if="arr_show_error_message != null && arr_show_error_message.length > 0">
                    <span class="margin_n" v-for="(item, index) in arr_show_error_message" :key="index">
                        <v-icon color="#ff4366">error_outline</v-icon> {{item}} <br>
                    </span>
                </div>

                <h4>
                    {{ simul_result_mast.scen_name }}
                    <span class="sub_t">테스트 결과</span>
                    <span class="excel_btn">
                        <button type="button" class="exceldown_btn"></button>
                    </span>
                    <span class="btn_r">
                        <v-btn small flat icon v-on:click="fn_goSimulMod()">
                            <v-icon>reply</v-icon>
                        </v-btn>
                    </span>
                </h4>


            <!-- 그래프 영역-->


                            <div class="simul_g_w">
                                <div class="simul_g_l">
                            <!-- <div class="simul_graph"> -->
                                <LineSimulationChart    v-if="chartFlag" 
                                
                                                        :arr_result_daily="arr_result_daily"
                                                        :simul_result_mast="simul_result_mast"
                                                        
                                                        @fn_showMessageBox="fn_showMessageBox">
                                </LineSimulationChart>
                            <!-- </div> -->
                                </div>
                                <div class="simul_g_r">
                                <table class="tbl_type ver11">
                                    <colgroup>
                                        <col width="50%"/>
                                        <col width="50%"/>
                                    </colgroup>

                                    <tbody>
                                        <tr v-for="( row, index ) in  fn_sort_arr_analyze_main" v-bind:key="row + '_' + index + '_main'" >
                                            <th class="txt_left" width="50%">
                                                {{ row.anal_title          /* 분석지표 */ }}
                                            </th>
                                            <td class="txt_right" width="50%">
                                                {{ row.backtest           /* 백테스트 */ }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>

                <v-tabs v-model="activeTab" centered light>
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab v-for="item in item" :key="item">{{ item }}</v-tab>
                </v-tabs>

                <v-tabs-items v-model="activeTab">


            <!-- 일자별 지수 탭1-->
                    <v-tab-item>
                        <v-layout row wrap>
                            <v-flex grow xs12>
                                <v-card flat>
                                    <div class="table-box-wrap mar15">
                                        <div class="table-box" style="max-height:710px;">
                                            <table class="tbl_type ver10">
                                                <caption></caption>
                                                <colgroup>
                                                    <col width="14%" />
                                                    <col width="14%" />
                                                    <col width="14%" />
                                                    <col width="14%" />
                                                    <col width="14%" />
                                                    <col width="14%" />
                                                    <col width="14%" />
                                                </colgroup>
                                                <thead>
                                                    <tr >
                                                        <th class="txt_left">일자</th>
                                                        <th class="txt_right">Index</th>
                                                        <th class="txt_right">Balance</th>
                                                        <th class="txt_right">Return</th>
                                                        <th class="txt_right">{{ simul_result_mast.bench_index_nm }}</th>
                                                        <th class="txt_right">BM(1000환산)</th>
                                                        <th class="txt_right">BM return</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="( row, index ) in  fn_sort_arr_result_daily" v-bind:key="row + '_' + index" >
                                                        <td class="txt_left">{{  row.fmt_F12506             /* 일자 */ }}</td>
                                                        <td class="txt_right">{{ row.fmt_INDEX_RATE         /* 지수 */ }}</td>
                                                        <td class="txt_right">{{ row.fmt_balance            /* balance */ }}</td>
                                                        <td class="txt_right">{{ row.fmt_RETURN_VAL         /* return */ }}</td>
                                                        <td class="txt_right">{{ row.fmt_bm_data01          /* BM */ }}</td>
                                                        <td class="txt_right">{{ row.fmt_bm_1000_data       /* BM(1000환산) */ }}</td>
                                                        <td class="txt_right">{{ row.fmt_bm_return_data     /* BM(return) */ }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-tab-item>


            <!-- 리밸런싱 내역 탭2-->
                    <v-tab-item>
                        <v-layout row wrap>
                            <v-flex grow xs12>
                                <v-card flat>
                                    <div class="table-box-wrap mar15">
                                        <div class="table-box" style="max-height:710px;">
                                            <table class="tbl_type ver10">
                                                <caption></caption>

                                                <colgroup>
                                                    <col width="20%" />
                                                    <col width="20%" />
                                                    <col width="20%" />
                                                    <col width="20%" />
                                                    <col width="20%" />
                                                </colgroup>

                                                <thead>
                                                                   
                                                    <tr>
                                                        <th width="20%" class="txt_left">일자</th>
                                                        <th width="20%">Event</th>
                                                        <th width="20%" class="txt_left">종목</th>
                                                        <th width="20%" class="txt_right">변경전</th>
                                                        <th width="20%" class="txt_right">변경후</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
    
                                                    <tr v-for="(row, index) in fn_sort_arr_result_rebalance" v-bind:key="(row + '_' + index)" :style="row.style_background">
                                                        <td class="txt_left">{{ row.fmt_F12506              /* 일자 */ }}</td>
                                                        <td><!--비중조절 div class="grav_icon"></div--> 
                                                            <!--종목편출 div class="extr_icon"></div--> 
                                                            <div :class='row.EVENT_FLAG == "20" ? "trans_icon" : ( row.EVENT_FLAG == "10" ? "grav_icon" : "extr_icon"  ) '></div>
                                                            {{ row.fmt_EVENT_FLAG /* EVENT */ }}
                                                        </td>
                                                        <td class="txt_left">{{ row.fmt_F16002              /* 종목 */ }}</td>
                                                        <td class="txt_right">{{ row.fmt_BEFORE_IMPORTANCE  /* 변경전 */ }}</td>
                                                        <td class="txt_right">{{ row.fmt_AFTER_IMPORTANCE   /* 변경후 */ }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-tab-item>


            <!--시뮬레이션 설정 탭3-->
                    <v-tab-item>
                        <div class="table-box">
                                <table class="tbl_type ver11">
                                    <caption>헤더 고정 테이블</caption>
                                    <colgroup>
                                        <col width="35%" />
                                        <col width="65%" />
                                    </colgroup>
                                        <tr>
                                            <th style="width:35%">시작년도</th>
                                            <td style="width:65%">{{  simul_result_mast.start_year  }}</td>
                                        </tr>
                                        <tr>
                                            <th>리밸런싱주기</th>
                                            <td>{{ simul_result_mast.fmt_rebalance }}</td>
                                        </tr>
                                        <tr>
                                            <th>초기투자금액(KRW)</th>
                                            <td>{{ simul_result_mast.fmt_init_invest_money }}</td>
                                        </tr>
                                        <tr>
                                            <th>벤치마크 설정</th>
                                            <td>{{ simul_result_mast.fmt_bench_mark_cd }}</td>
                                        </tr>
                                        <tr>
                                            <th>비중설정방식</th>
                                            <td>{{ simul_result_mast.fmt_rebalance_date_cd }}</td>
                                        </tr>
                                        
                                </table>
                            </div>
                        <!--div class="simul_setup">
                            <h6>
                                <span class="bullet"></span>리밸런싱
                            </h6>
                            <v-layout>
                                <v-flex xs2>시작년도</v-flex>
                                <v-flex xs3>{{  simul_result_mast.start_year  }}</v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs2>주기</v-flex>
                                <v-flex xs3>{{ simul_result_mast.fmt_rebalance }}</v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs2>횟수</v-flex>
                                <v-flex xs3>{{ simul_result_mast.rebalance_cnt }} 회</v-flex>
                            </v-layout>
                            <h6>
                                <span class="bullet"></span>선정방식
                            </h6>
                            <v-layout>
                                <v-flex xs2>시가총액</v-flex>
                                <v-flex xs3></v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs2>거래량</v-flex>
                                <v-flex xs3></v-flex>
                            </v-layout>
                        </div-->
                    </v-tab-item>


            <!--분석정보 -->
                    <v-tab-item >
                        <v-card flat>
                        <div class="btn_only_r">
                            <span class="btn_rr"><button type="button" class="exceldown_btn" id="jsonFileDownload" @click="fn_jsonFileDownload()" ></button></span>
                        </div>
                            <div class="table-box-wrap mar15">
                                <div class="table-box" style="max-height:710px;">
                                    <table class="tbl_type ver10">
                                        <colgroup>
                                            <col width="33%"/>
                                            <col width="33%"/>
                                            <col width="33%"/>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th class="txt_left">분석지표</th>
                                                <th class="txt_right">백테스트</th>
                                                <th class="txt_right">{{ simul_result_mast.bench_index_nm }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="!arr_analyze || arr_analyze.length == 0" >
                                                <td colspan="3" style="align:center">
                                                    처리중 오류가 발생하였습니다.
                                                </td>
                                            </tr>

                                            <tr v-for="( row, index ) in  arr_analyze" v-bind:key="row + '_' + index" >
                                                <td class="txt_left">
                                                    {{ row.anal_title          /* 분석지표 */ }}
                                                </td>
                                                <td class="txt_right">
                                                    {{ row.backtest           /* 백테스트 */ }}
                                                </td>
                                                <td class="txt_right">
                                                    {{ row.benchmark          /* 벤치마크 */ }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </v-card>
                    </v-tab-item>

                </v-tabs-items>

                <v-card flat>
                    <div class="text-xs-center mt-1">
                        <v-btn depressed color="primary" @click.stop="fn_saveBacktestResult()">저장하기</v-btn>
                    </div>
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
import _ from "lodash";

import LineSimulationChart  from "@/components/common/chart/LineSimulationChart.vue";
import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";

export default {

    props : [ "paramData" ],

    data() {
        return {
                activeTab: 0
            ,   item: [
                    "일자별지수",
                    "리밸런싱내역",
                    "시뮬레이션 설정",
                    "분석정보",
                ]

            ,   arr_show_error_message      :   []

                /* 공통코드 정보 */
            ,   arr_code_list               :   []

                /* 결과 정보 */
            ,   simul_result_mast           :   {}
            ,   arr_result_daily            :   []      /* array 일자별 지수 */
            ,   arr_result_rebalance        :   []      /* array 리밸런스 */
            ,   arr_analyze_org             :   []      /* 분석정보 원본 */
            ,   arr_analyze_temp            :   []      /* 분석정보#1 */
            ,   arr_analyze                 :   []      /* 분석정보#1 */
            ,   arr_analyze_main            :   []      /* 초기화면 */
            ,   inputData                   :   []
            ,   jsonFileName                :   ""

            ,   chartFlag                   :   false

        };
    },

    components: {
        ConfirmDialog,
        LineSimulationChart,
    },

    created() {
        var vm = this;
    },

    computed: {

        /*
         * 일자별 지수를 정력한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_sort_arr_result_daily : function() {
            var vm = this;

            return _.orderBy( vm.arr_result_daily, [
                "F12506"
            ], ["desc"]);
        },

        fn_sort_arr_analyze_main : function() {
            var vm = this;

            return _.orderBy( vm.arr_analyze_main, [
                "order_no"
            ], ["asc"]);
        },

        /*
         * 리밸런싱 내역을 정렬한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_sort_arr_result_rebalance : function() {
            var vm = this;

            vm.arr_result_rebalance = _.orderBy( vm.arr_result_rebalance, [
                "F12506",
                "rebalance_import_yn",
                function(e) {
                    return  ( e.EVENT_FLAG == "20" ? 1 : e.EVENT_FLAG == "10" ? 2 : 3 );
                },
            ], ["desc", "desc", "asc"]);


            var v_toggle_background     =   [ "", "background:#e7f2f7" ];
            var v_prev_F12506           =   "";
            var v_now_background        =   "";
            for( var i=0; i < vm.arr_result_rebalance.length; i++ ) {
                var v_row   =   vm.arr_result_rebalance[i];

                if( v_prev_F12506 != v_row.F12506 ) {
                    v_now_background    =   _.xor( v_toggle_background, [ v_now_background ] )[0];
                    v_prev_F12506       =   v_row.F12506;
                }

                v_row.style_background  =   v_now_background;
            }

            return  vm.arr_result_rebalance;
        }
    },

    mounted() {
        var vm = this;


        vm.chartFlag   =   false;

        /* 초기 설정 데이터를 조회한다. */
        vm.fn_initData().then( async function(e) {

            if( e && e.result ) {

                /* 목록에서 넘겨받은 key 값이 존재하는 경우 등록된 내용을 조회하여 설정한다. */
                if( vm.paramData && Object.keys( vm.paramData ).length > 0 ) {

                    /* grp_cd 와 scen_cd 가 존재하는 경우 DB 저장된 backtest 결과 조회 */
                    if( vm.paramData.grp_cd && vm.paramData.scen_cd  ) {
                        vm.fn_getBacktestResult( vm.paramData );
                    }
                    /* 화면으로 부터 결과정보를 받은 경우 */
                    else if( 
                            ( vm.paramData.simul_mast && Object.keys( vm.paramData.simul_mast ).length > 0 )
                        ||  ( vm.paramData.arr_daily && vm.paramData.arr_daily.length > 0 )
                        ||  ( vm.paramData.arr_rebalance && vm.paramData.arr_rebalance.length > 0 )
                        ||  ( vm.paramData.analyzeList && vm.paramData.analyzeList.length > 0 )
                        ||  ( vm.paramData.jsonFileName && vm.paramData.jsonFileName.length > 0 )
                        ||  ( vm.paramData.inputData && vm.paramData.inputData.length > 0 )
                    ){                        

                    /*************************************************************************************************************
                    *   array 리밸런스 정보
                    **************************************************************************************************************/
                        var v_prev_F12506   =   "";
                        var v_rebalance_cnt =   0;

                        if( vm.paramData.arr_rebalance && vm.paramData.arr_rebalance.length > 0  ){

                            v_prev_F12506   =   "";

                            vm.paramData.arr_rebalance.forEach( function( item, index, array ) {

                                Object.keys( array[ index ] ).forEach( function( key ) {
                                    
                                    var sub_item    =   array[ index ][ key ];
                                    
                                    if( v_prev_F12506 != sub_item.F12506 ) {
                                        v_rebalance_cnt++;
                                    }

                                    /* 구분에 맞게 레코드를 설정한다. */
                                    vm.fn_set_record_data( "rebalance", sub_item );

                                    vm.arr_result_rebalance.push( sub_item );

                                    /* 이전 입회일자 설정 */
                                    v_prev_F12506   =   sub_item.F12506;
                                });
                            });
                        }


                    /*************************************************************************************************************
                    *   시뮬레이션 마스터 정보
                    **************************************************************************************************************/
                        vm.simul_result_mast                =   Object.assign( {}, vm.paramData.simul_mast );

                        /* 구분에 맞게 레코드를 설정한다. */
                        vm.fn_set_record_data( "mast", vm.simul_result_mast );

                        /* 리밸런싱 횟수 */
                        vm.simul_result_mast.rebalance_cnt  =   v_rebalance_cnt;
                        


                    /*************************************************************************************************************
                    *   array 일자별 지수 정보
                    **************************************************************************************************************/
                        vm.paramData.arr_daily.forEach( function( item, index, array ) {

                            item.bench_mark_cd      =   vm.simul_result_mast.bench_mark_cd;

                            /* 구분에 맞게 레코드를 설정한다. */
                            vm.fn_set_record_data( "daily", item );

                            if( vm.simul_result_mast.bench_mark_cd != "0" ) {

                                item.fmt_bm_1000_data       =   util.formatNumber(
                                    item.bm_1000_data
                                );                                                                                                                  /* bm(1000환산) */
                                item.fmt_bm_return_data     =   util.formatNumber(
                                    item.bm_return_data * 100
                                ) + " %";                                                                                                           /* bm(return) */
                            }else{
                                item.fmt_bm_1000_data       =   "";                                                                                 /* bm(1000환산) */
                                item.fmt_bm_return_data     =   "";                                                                                 /* bm(return) */
                            }

                            vm.arr_result_daily.push( item );
                        });

                        vm.chartFlag   =   true;


                        vm.inputData            =   vm.paramData.inputData;
                        vm.jsonFileName         =   vm.paramData.jsonFileName;

                        vm.arr_analyze_org      =   vm.paramData.analyzeList;
                        try{
                            if( vm.arr_analyze_org ) {
                                vm.arr_analyze_temp =   JSON.parse( vm.arr_analyze_org );
                            }
                        }catch( e ) {
                            vm.arr_analyze_temp =   "";
                            vm.arr_analyze.push( { anal_title : "처리중 오류가 발생하였습니다." }  );
                            console.log( "analyzeList 파싱 중 오류가 발생되었습니다.", e );
                        }
                        vm.fn_setAnal01();
                    }
                }

                vm.arr_analyze_main =   [];
                vm.arr_analyze_main.push({
                        "anal_title"    :   "CAGR"
                    ,   "backtest"      :   "-6.80935 %"
                });

                vm.arr_analyze_main.push({
                        "anal_title"    :   "Vol (annualized)"
                    ,   "backtest"      :   "13.48135 %"
                });

                vm.arr_analyze_main.push({
                        "anal_title"    :   "Sharpe Ratio"
                    ,   "backtest"      :   "-0.57220"
                });     

                vm.arr_analyze_main.push({
                        "anal_title"    :   "Beta(vs market)"
                    ,   "backtest"      :   "0.78272"
                });

                vm.arr_analyze_main.push({
                        "anal_title"    :   "Beta(vs benchmark)"
                    ,   "backtest"      :   "N/A"
                });

                vm.arr_analyze_main.push({
                        "anal_title"    :   "Alpha(vs market, annualized)"
                    ,   "backtest"      :   "-7.77029 %"
                });

                vm.arr_analyze_main.push({
                        "anal_title"    :   "Alpha(vs benchmark, annualized)"
                    ,   "backtest"      :   "N/A"
                });

                vm.arr_analyze_main.push({
                        "anal_title"    :   "MDD"
                    ,   "backtest"      :   "-30.36347 %"
                });
            }
        });
    },

    methods: {

        /*
         * 진행 progress 를 보여준다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showProgress: function( visible ) {
            var vm = this;
            vm.$emit("fn_showProgress", visible );
        },

        /*
         *  메시지 팝업창을 노출한다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_showMessageBox: function(title, msg, option, gubun) {

            if( this.$refs && this.$refs.confirm2 ) {
                this.$refs.confirm2.open( title,msg, option, gubun );
            }
        },

        /*
         * 백테스트 결과를 조회한다.
         * 2019-08-14  bkLove(촤병국)
         */
        fn_getBacktestResult( v_param ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.arr_result_rebalance     =   [];
            vm.simul_result_mast        =   {};
            vm.arr_result_daily         =   [];

            return  new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getBacktestResult"
                            ,   "data"      :   v_param
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.arr_show_error_message.push( msg );
                                        }

                                        resolve( { result : false } );
                                    }else{


                                    /*************************************************************************************************************
                                    *   array 리밸런스 정보
                                    **************************************************************************************************************/
                                        var v_prev_F12506   =   "";
                                        var v_rebalance_cnt =   0;

                                        if( response.data.arr_result_rebalance && response.data.arr_result_rebalance.length > 0  ){

                                            v_prev_F12506   =   "";

                                            response.data.arr_result_rebalance.forEach( function( sub_item, index, array ) {

                                                if( v_prev_F12506 != sub_item.F12506 ) {
                                                    v_rebalance_cnt++;
                                                }

                                                /* 구분에 맞게 레코드를 설정한다. */
                                                vm.fn_set_record_data( "rebalance", sub_item );

                                                vm.arr_result_rebalance.push( sub_item );

                                                /* 이전 입회일자 설정 */
                                                v_prev_F12506   =   sub_item.F12506;
                                            });
                                        }


                                    /*************************************************************************************************************
                                    *   시뮬레이션 마스터 정보
                                    **************************************************************************************************************/

                                        vm.simul_result_mast        =   response.data.simul_result_mast;

                                        /* 구분에 맞게 레코드를 설정한다. */
                                        vm.fn_set_record_data( "mast", vm.simul_result_mast );

                                        /* 리밸런싱 횟수 */
                                        vm.simul_result_mast.rebalance_cnt      =   v_rebalance_cnt;



                                    /*************************************************************************************************************
                                    *   array 일자별 지수 정보
                                    **************************************************************************************************************/
                                        response.data.arr_result_daily.forEach( function( item, index, array ) {

                                            item.bench_mark_cd      =   vm.simul_result_mast.bench_mark_cd;

                                            /* 구분에 맞게 레코드를 설정한다. */
                                            vm.fn_set_record_data( "daily", item );

                                            if( vm.simul_result_mast.bench_mark_cd != "0" ) {

                                                item.fmt_bm_1000_data       =   util.formatNumber(
                                                    item.bm_1000_data
                                                );                                                                                                              /* bm(1000환산) */
                                                item.fmt_bm_return_data     =   util.formatNumber(
                                                    item.bm_return_data * 100
                                                ) + " %";                                                                                                       /* bm(return) */
                                            }else{
                                                item.fmt_bm_1000_data       =   "";                                                                             /* bm(1000환산) */
                                                item.fmt_bm_return_data     =   "";                                                                             /* bm(return) */
                                            }

                                            vm.arr_result_daily.push( item );
                                        });

                                        vm.chartFlag   =   true;


                                    /*************************************************************************************************************
                                    *   분석정보 #1
                                    **************************************************************************************************************/
                                        vm.inputData            =   response.data.inputData;
                                        vm.jsonFileName         =   response.data.jsonFileName;

                                        vm.arr_analyze_org      =   response.data.analyzeList;

                                        try{
                                            if( vm.arr_analyze_org ) {                           
                                                vm.arr_analyze_temp     =   JSON.parse( vm.arr_analyze_org );
                                            }
                                        }catch( e ) {
                                            vm.arr_analyze_temp     =   "";
                                            console.log( "analyzeList 파싱 중 오류가 발생되었습니다.", e );
                                        }
                                        vm.fn_setAnal01();

                                        resolve( { result : true } );
                                    }
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            vm.fn_showProgress( false );
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );


            //     axios.post(Config.base_url + "/user/simulation/getBacktestResult", {
            //         data: v_param
            //     }).then( function(response) {

            //         vm.fn_showProgress( false );

            //         if (response && response.data) {
            //             var msg = ( response.data.msg ? response.data.msg : "" );

            //             if (!response.data.result) {
            //                 if( msg ) {
            //                     vm.arr_show_error_message.push( msg );
            //                 }

            //                 resolve( { result : false } );
            //             }else{


            //             /*************************************************************************************************************
            //             *   array 리밸런스 정보
            //             **************************************************************************************************************/
            //                 var v_prev_F12506   =   "";
            //                 var v_rebalance_cnt =   0;

            //                 if( response.data.arr_result_rebalance && response.data.arr_result_rebalance.length > 0  ){

            //                     v_prev_F12506   =   "";

            //                     response.data.arr_result_rebalance.forEach( function( sub_item, index, array ) {

            //                         if( v_prev_F12506 != sub_item.F12506 ) {
            //                             v_rebalance_cnt++;
            //                         }

            //                         /* 구분에 맞게 레코드를 설정한다. */
            //                         vm.fn_set_record_data( "rebalance", sub_item );

            //                         vm.arr_result_rebalance.push( sub_item );

            //                         /* 이전 입회일자 설정 */
            //                         v_prev_F12506   =   sub_item.F12506;
            //                     });
            //                 }


            //             /*************************************************************************************************************
            //             *   시뮬레이션 마스터 정보
            //             **************************************************************************************************************/

            //                 vm.simul_result_mast        =   response.data.simul_result_mast;

            //                 /* 구분에 맞게 레코드를 설정한다. */
            //                 vm.fn_set_record_data( "mast", vm.simul_result_mast );

            //                 /* 리밸런싱 횟수 */
            //                 vm.simul_result_mast.rebalance_cnt      =   v_rebalance_cnt;



            //             /*************************************************************************************************************
            //             *   array 일자별 지수 정보
            //             **************************************************************************************************************/
            //                 response.data.arr_result_daily.forEach( function( item, index, array ) {

            //                     item.bench_mark_cd      =   vm.simul_result_mast.bench_mark_cd;

            //                     /* 구분에 맞게 레코드를 설정한다. */
            //                     vm.fn_set_record_data( "daily", item );

            //                     if( vm.simul_result_mast.bench_mark_cd != "0" ) {

            //                         item.fmt_bm_1000_data       =   util.formatNumber(
            //                             item.bm_1000_data
            //                         );                                                                                                              /* bm(1000환산) */
            //                         item.fmt_bm_return_data     =   util.formatNumber(
            //                             item.bm_return_data * 100
            //                         ) + " %";                                                                                                       /* bm(return) */
            //                     }else{
            //                         item.fmt_bm_1000_data       =   "";                                                                             /* bm(1000환산) */
            //                         item.fmt_bm_return_data     =   "";                                                                             /* bm(return) */
            //                     }

            //                     vm.arr_result_daily.push( item );
            //                 });


            //             /*************************************************************************************************************
            //             *   분석정보 #1
            //             **************************************************************************************************************/
            //                 vm.inputData            =   response.data.inputData;
            //                 vm.jsonFileName         =   response.data.jsonFileName;

            //                 vm.arr_analyze_org      =   response.data.analyzeList;

            //                 try{
            //                     if( vm.arr_analyze_org ) {                           
            //                         vm.arr_analyze_temp     =   JSON.parse( vm.arr_analyze_org );
            //                     }
            //                 }catch( e ) {
            //                     vm.arr_analyze_temp     =   "";
            //                     console.log( "analyzeList 파싱 중 오류가 발생되었습니다.", e );
            //                 }
            //                 vm.fn_setAnal01();

            //                 resolve( { result : true } );
            //             }
            //         }else{
            //             resolve( { result : false } );
            //         }
            //     }).catch(error => {
            //         resolve( { result : false } );

            //         vm.fn_showProgress( false );
            //         if ( vm.$refs.confirm2.open(
            //                 '확인',
            //                 '서버로 부터 응답을 받지 못하였습니다.',
            //                 {}
            //                 ,4
            //             )
            //         ) {
            //         }
            //     });

            }).catch( function(e1) {
                console.log( e1 );
            });
        },

        /*
         * 초기 설정 데이터를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_initData() {
            var vm = this;

            /* COM008 - 벤치마크 */
            /* COM009 - 비중설정방식 */
            /* COM011 - 이벤트 타입 ( 10-비중조절, 20- 종목편입 ) */
            /* COM012 - 리밸런싱코드 기준 tm_date_manage 테이블 mapping */
            var arrComMstCd = [ "COM008", "COM009", "COM011", "COM012" ];

            vm.arr_show_error_message   =   [];

            return await new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getInitData1"
                            ,   "data"      :   {  arrComMstCd : arrComMstCd }
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{

                                if (response && response.data) {
                                    var arrMsg = ( response.data.msg && response.data.msg.length > 0 ? response.data.msg : [] );

                                    if (!response.data.result) {
                                        if( arrMsg.length > 0 ) {
                                            vm.arr_show_error_message.push( ...arrMsg );
                                        }

                                        resolve( { result : false } );
                                    }else{

                                        if( response.data.arr_code_list && response.data.arr_code_list.length > 0 ) {
                                            
                                            var com011_check    =   false;
                                            var com012_check    =   false;
                                            var existCheck = _.filter( response.data.arr_code_list, function(o) {

                                                if ( o.com_mst_cd == "COM011" ) {
                                                    com011_check    =   true;
                                                }

                                                if ( o.com_mst_cd == "COM012" ) {
                                                    com012_check    =   true;
                                                }
                                            });

                                            if( !com011_check ) {
                                                arr_show_error_message.push( "공통코드 이벤트 타입 정보가 존재하지 않습니다." );
                                                return  false;
                                            }

                                            if( !com012_check ) {
                                                arr_show_error_message.push( "공통코드 리밸런싱 맵핑 정보가 존재하지 않습니다." );
                                                return  false;
                                            }
                                            
                                            vm.arr_code_list    =   response.data.arr_code_list;
                                        }

                                        resolve( { result : true } );
                                    }
                                }else{

                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            vm.fn_showProgress( false );
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

                // axios.post(Config.base_url + "/user/simulation/getInitData1", {
                //     data: {  arrComMstCd : arrComMstCd }
                // }).then( function(response) {

                //     vm.fn_showProgress( false );

                //     if (response && response.data) {
                //         var arrMsg = ( response.data.msg && response.data.msg.length > 0 ? response.data.msg : [] );

                //         if (!response.data.result) {
                //             if( arrMsg.length > 0 ) {
                //                 vm.arr_show_error_message.push( ...arrMsg );
                //             }

                //             resolve( { result : false } );
                //         }else{

                //             if( response.data.arr_code_list && response.data.arr_code_list.length > 0 ) {
                                
                //                 var com011_check    =   false;
                //                 var com012_check    =   false;
                //                 var existCheck = _.filter( response.data.arr_code_list, function(o) {

                //                     if ( o.com_mst_cd == "COM011" ) {
                //                         com011_check    =   true;
                //                     }

                //                     if ( o.com_mst_cd == "COM012" ) {
                //                         com012_check    =   true;
                //                     }
                //                 });

                //                 if( !com011_check ) {
                //                     arr_show_error_message.push( "공통코드 이벤트 타입 정보가 존재하지 않습니다." );
                //                     return  false;
                //                 }

                //                 if( !com012_check ) {
                //                     arr_show_error_message.push( "공통코드 리밸런싱 맵핑 정보가 존재하지 않습니다." );
                //                     return  false;
                //                 }
                                
                //                 vm.arr_code_list    =   response.data.arr_code_list;
                //             }

                //             resolve( { result : true } );
                //         }
                //     }else{

                //         resolve( { result : false } );
                //     }
                // }).catch(error => {
                //     resolve( { result : false } );

                //     vm.fn_showProgress( false );
                //     if ( vm.$refs.confirm2.open(
                //             '확인',
                //             '서버로 부터 응답을 받지 못하였습니다.',
                //             {}
                //             ,4
                //         )
                //     ) {
                //     }
                // });

            }).catch( function(e1) {
                console.log( e1 );
                resolve( { result : false } );
            });
        },

        /*
         * 백테스트 결과를 저장한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_saveBacktestResult : function() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.fn_showProgress( true );

            var paramData   =  {};

            paramData   =   vm.simul_result_mast;

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/saveBacktestResult"
                        ,   "data"      :   paramData
                        ,   "method"    :   "post"
                    }
                ,   function(response) {
                        vm.fn_showProgress( false );

                        try{

                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( !msg ) {
                                        vm.arr_show_error_message.push( msg );
                                    }
                                }else{

                                    var	v_grp_cd	=	response.data.grp_cd;
                                    var	v_scen_cd	=	response.data.scen_cd;

                                    if( msg ) {
                                        if ( vm.$refs.confirm2.open(
                                                '확인',
                                                msg,
                                                {}
                                                ,1
                                            )
                                        ) {
                                            // vm.fn_getBacktestResult( { 
                                            // 		grp_cd  : v_grp_cd
                                            // 	, 	scen_cd : v_scen_cd 
                                            // });
                                        }
                                    }                        

                                }
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.fn_showProgress( false );
                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );

            // axios.post(Config.base_url + "/user/simulation/saveBacktestResult", {
            //     data: paramData
            // }).then( function(response) {

            //     vm.fn_showProgress( false );

            //     if (response && response.data) {
            //         var msg = ( response.data.msg ? response.data.msg : "" );

            //         if (!response.data.result) {
            //             if( !msg ) {
            //                 vm.arr_show_error_message.push( msg );
            //             }

            //             resolve( { result : false } );
            //         }else{

			// 			var	v_grp_cd	=	response.data.grp_cd;
			// 			var	v_scen_cd	=	response.data.scen_cd;

            //             if( msg ) {
            //                 if ( vm.$refs.confirm2.open(
            //                         '확인',
            //                         msg,
            //                         {}
            //                         ,1
            //                     )
            //                 ) {
			// 					// vm.fn_getBacktestResult( { 
			// 					// 		grp_cd  : v_grp_cd
			// 					// 	, 	scen_cd : v_scen_cd 
			// 					// });
            //                 }
            //             }                        

            //         }
            //     }
            // }).catch(error => {

            //     vm.fn_showProgress( false );
            //     if ( vm.$refs.confirm2.open(
            //             '확인',
            //             '서버로 부터 응답을 받지 못하였습니다.',
            //             {}
            //             ,4
            //         )
            //     ) {
            //     }
            // });
        },

        /*
        * 코드명 정보를 반환한다.
        * 2019-07-26  bkLove(촤병국)
        */
        fn_getCodeName( p_com_mst_cd="", p_com_dtl_cd ) {
            var vm = this;

            var com_dtl_name = "";
            if( vm.arr_code_list && vm.arr_code_list.length > 0  ) {
                var existCheck = _.filter( vm.arr_code_list, function(o) {

                    if ( o.com_mst_cd == p_com_mst_cd && o.com_dtl_cd == p_com_dtl_cd ) {
                        return  o;
                    }
                });
                
                if( existCheck && existCheck.length == 1 ) {
                    com_dtl_name    =   existCheck[0].com_dtl_name;
                }
            }

            return  com_dtl_name;
        },

        /*
        * 구분에 맞게 레코드를 설정한다.
        * 2019-07-26  bkLove(촤병국)
        */
        fn_set_record_data( p_gubun="", p_item_obj={} ) {

            var vm = this;

            if( p_gubun != "" && Object.keys( p_item_obj ).length > 0 ) {

                switch( p_gubun ) {

                            /* rebalance 내역 설정 */
                    case    "rebalance"  :

                            p_item_obj.fmt_F12506               =   util.formatDate( new String( p_item_obj.F12506 ) );         /* 일자 */
                            p_item_obj.fmt_EVENT_FLAG           =   vm.fn_getCodeName( "COM011", p_item_obj.EVENT_FLAG );       /* Event */

                            p_item_obj.fmt_F16002               =   (
                                    (!p_item_obj.F16002 ? "현금" : p_item_obj.F16002 )  
                                + " ( " + p_item_obj.F16013 + " )"
                            );                                                                                                  /* 종목 */

                            /* 변경전 */
                            p_item_obj.fmt_BEFORE_IMPORTANCE    =   (
                                Number( p_item_obj.BEFORE_IMPORTANCE ) == -1 ? 
                                "-" : util.formatNumber( p_item_obj.BEFORE_IMPORTANCE * 100 ) + " %"
                            );

                            /* 변경후 */
                            p_item_obj.fmt_AFTER_IMPORTANCE     =   (
                                Number( p_item_obj.AFTER_IMPORTANCE ) == -1 ? 
                                "-" : util.formatNumber( p_item_obj.AFTER_IMPORTANCE * 100 ) + " %"
                            );                        

                            break;

                            /* 시물레이션 설정 및 마스터 정보 */
                    case    "mast"  :

                            /* 리밸런싱 주기 */
                            p_item_obj.fmt_rebalance            =   vm.fn_getCodeName( "COM012", p_item_obj.rebalance_cycle_cd + p_item_obj.rebalance_date_cd );

                            /* 초기 투자금액 */
                            p_item_obj.fmt_init_invest_money    =   util.formatInt( p_item_obj.init_invest_money );

                            /* 벤치마크 설정 */
                            p_item_obj.fmt_bench_mark_cd        =   vm.fn_getCodeName( "COM008", p_item_obj.bench_mark_cd );

                            /* 비중설정 방식 */
                            p_item_obj.fmt_rebalance_date_cd    =   vm.fn_getCodeName( "COM009", p_item_obj.rebalance_date_cd );

                            if( p_item_obj.bench_mark_cd == "0" ) {
                                p_item_obj.bench_index_nm       =   "BM (N/A)";
                            }else{
                                p_item_obj.bench_index_nm       =   "BM (" + p_item_obj.bench_index_nm + ")";
                            }                        

                            break;

                            /* 일자별 지수 설정 */
                    case    "daily"  :

                            p_item_obj.fmt_F12506               =   util.formatDate( new String( p_item_obj.F12506 ) );           /* 일자 */
                            p_item_obj.fmt_INDEX_RATE           =   util.formatNumber(
                                p_item_obj.INDEX_RATE
                            );
                            p_item_obj.fmt_balance              =   util.formatNumber( ( typeof p_item_obj.balance == "undefined"  ? "0" : Number( p_item_obj.balance ).toFixed(3) ) );

                            if( p_item_obj.bench_mark_cd == "0" ) {
                                p_item_obj.fmt_bm_data01        =   "";
                            }else{
                                p_item_obj.fmt_bm_data01        =   util.formatNumber( ( typeof p_item_obj.bm_data01 == "undefined"  ? "0" : Number( p_item_obj.bm_data01 ).toFixed(2) ) );
                            }
                            p_item_obj.fmt_RETURN_VAL           =   util.formatNumber(
                                p_item_obj.RETURN_VAL * 100
                            ) + " %";                                                                                           /* return_val */

                            break;
                }
            }
        },

        /*
        * 분석정보를 설정한다.
        * 2019-07-26  bkLove(촤병국)
        */
        fn_setAnal01() {

            var vm = this;

            vm.arr_analyze      =   [];
            vm.arr_analyze_main =   [];

            if( vm.arr_analyze_temp &&  Object.keys( vm.arr_analyze_temp ).length > 0  ) {
                var v_anal      =   {};
                var v_anal01    =   {};
                
                /* 정수처리 */
                v_anal                  =   vm.fn_getFindJson( "final_balance" );
                v_anal.anal_title       =   "Final Balance";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   parseInt( Number( v_anal.backtest )  ) : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   parseInt( Number( v_anal.benchmark ) ) : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "cagr" );
                v_anal.anal_title       =   "CAGR";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                v_anal                  =   Object.assign( {}, v_anal );
                v_anal.order_no         =   1;
                vm.arr_analyze_main.push( v_anal );

                /*  수익률 ( 연도 )
                    %처리. 100곱한후 소수점 6째자리에서 반올림 
                */
                v_anal                  =   vm.fn_getFindJson( "best_y", "rtn" );
                v_anal01                =   vm.fn_getFindJson( "best_y", "year" );
                v_anal.anal_title       =   "Best Year";
                v_anal.backtest02       =   ( v_anal01.backtest     != "N/A"    ?   v_anal01.backtest   : "N/A" );
                v_anal.benchmark02      =   ( v_anal01.benchmark    != "N/A"    ?   v_anal01.benchmark  : "N/A" );
                v_anal.backtest         =   ( 
                        v_anal.backtest       != "N/A"    
                    ?       ( Number( v_anal.backtest )  * 100 ).toFixed(5) 
                        +   " %" 
                        +   " (" 
                        +       v_anal.backtest02  
                        +   ")" 
                    : "N/A"
                );
                v_anal.benchmark        =   ( 
                        v_anal.benchmark      != "N/A"    
                    ?       ( Number( v_anal.benchmark ) * 100 ).toFixed(5) 
                        +   " %" 
                        +   " (" 
                        +       v_anal.benchmark02 
                        +   ")" 
                    :   "N/A"
                );
                vm.arr_analyze.push( v_anal );

                /*  수익률 ( 연도 )
                    %처리. 100곱한후 소수점 6째자리에서 반올림 
                */
                v_anal                  =   vm.fn_getFindJson( "worst_y", "rtn" );
                v_anal01                =   vm.fn_getFindJson( "worst_y", "year" );
                v_anal.anal_title       =   "Worst Year";
                v_anal.backtest02       =   ( v_anal01.backtest     != "N/A"    ?   v_anal01.backtest   : "N/A" );
                v_anal.benchmark02      =   ( v_anal01.benchmark    != "N/A"    ?   v_anal01.benchmark  : "N/A" );
                v_anal.backtest         =   ( 
                        v_anal.backtest       != "N/A"    
                    ?       ( Number( v_anal.backtest )  * 100 ).toFixed(5) 
                        +   " %" 
                        +   " (" + v_anal.backtest02  
                        +   ")" 
                    : "N/A" 
                );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    
                    ?       ( Number( v_anal.benchmark ) * 100 ).toFixed(5) 
                        +   " %" 
                        +   " (" 
                        +       v_anal.benchmark02 
                        +   ")" 
                    :   "N/A" 
                );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "mdd" );
                v_anal.anal_title       =   "MDD";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                v_anal                  =   Object.assign( {}, v_anal );
                v_anal.order_no         =   8;
                vm.arr_analyze_main.push( v_anal );

                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "sharpe_rto" );
                v_anal.anal_title       =   "Sharpe Ratio";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  ).toFixed(5) : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) ).toFixed(5) : "N/A" );
                vm.arr_analyze.push( v_anal );

                v_anal                  =   Object.assign( {}, v_anal );
                v_anal.order_no         =   3;
                vm.arr_analyze_main.push( v_anal );

                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "sortino_rto" );
                v_anal.anal_title       =   "Sortino Ratio";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  ).toFixed(5) : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) ).toFixed(5) : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_market", "corr" );
                v_anal.anal_title       =   "Market Correlation";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  ).toFixed(5) : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) ).toFixed(5) : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "arith_mean" );
                v_anal.anal_title       =   "Arithmetic Mean (daily)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "annlzd_arith_mean" );
                v_anal.anal_title       =   "Arithmetic Mean (annualized)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "geo_mean" );
                v_anal.anal_title       =   "Geometric Mean (daily)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "annlzd_geo_mean" );
                v_anal.anal_title       =   "Geometric Mean (annualized)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );                

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "stdev" );
                v_anal.anal_title       =   "Volatility (daily)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "annlzd_stdev" );
                v_anal.anal_title       =   "Volatility (annualized)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                v_anal                  =   Object.assign( {}, v_anal );
                v_anal.anal_title       =   "Vol (annualized)";
                v_anal.order_no         =   2;
                vm.arr_analyze_main.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "down_dev" );
                v_anal.anal_title       =   "Downside Deviation (daily)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_market", "beta" );
                v_anal.anal_title       =   "Beta(vs market)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  ).toFixed(5) : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) ).toFixed(5) : "N/A" );
                vm.arr_analyze.push( v_anal );

                v_anal                  =   Object.assign( {}, v_anal );
                v_anal.anal_title       =   "Beta(vs market)";
                v_anal.order_no         =   4;
                vm.arr_analyze_main.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_market", "alpha" );
                v_anal.anal_title       =   "Alpha(vs market, annualized)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                v_anal                  =   Object.assign( {}, v_anal );
                v_anal.anal_title       =   "Alpha(vs market, annualized)";
                v_anal.order_no         =   6;
                vm.arr_analyze_main.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_market", "r2" );
                v_anal.anal_title       =   "R2(vs market)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_benchmark", "beta" );
                v_anal.anal_title       =   "Beta(vs benchmark)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  ).toFixed(5) : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) ).toFixed(5) : "N/A" );
                vm.arr_analyze.push( v_anal );

                v_anal                  =   Object.assign( {}, v_anal );
                v_anal.anal_title       =   "Beta(vs benchmark)";
                v_anal.order_no         =   5;
                vm.arr_analyze_main.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_benchmark", "alpha" );
                v_anal.anal_title       =   "Alpha(vs benchmark, annualized)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %": "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %": "N/A" );
                vm.arr_analyze.push( v_anal );

                v_anal                  =   Object.assign( {}, v_anal );
                v_anal.anal_title       =   "Alpha(vs benchmark, annualized)";
                v_anal.order_no         =   7;
                vm.arr_analyze_main.push( v_anal );


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_benchmark", "r2" );
                v_anal.anal_title       =   "R2(vs benchmark)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %": "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %": "N/A" );
                vm.arr_analyze.push( v_anal );

                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "skewness" );
                v_anal.anal_title       =   "Skewness";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  ).toFixed(5) : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) ).toFixed(5) : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "kurtosis" );
                v_anal.anal_title       =   "Excess Kurtosis";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  ).toFixed(5) : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) ).toFixed(5) : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "hist_var" );
                v_anal.anal_title       =   "Historical VaR(5%)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "anal_var" );
                v_anal.anal_title       =   "Analytical VaR(5%)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );

                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "c_var" );
                v_anal.anal_title       =   "Conditional VaR(5%)";
                v_anal.backtest         =   ( v_anal.backtest       != "N/A"    ?   ( Number( v_anal.backtest )  * 100 ).toFixed(5) + " %" : "N/A" );
                v_anal.benchmark        =   ( v_anal.benchmark      != "N/A"    ?   ( Number( v_anal.benchmark ) * 100 ).toFixed(5) + " %" : "N/A" );
                vm.arr_analyze.push( v_anal );
            }
        },

        /*
        * key 에 일치하는 JSON 정보를 추출한다.
        * 2019-07-26  bkLove(촤병국)
        */
        fn_getFindJson( p_strKey="", p_subKey="" ) {

            var vm = this;
            var returnJson  =   {
                    backtest    :   ""
                ,   benchmark   :   ""
            };

            if( p_strKey != "" && vm.arr_analyze_temp &&  Object.keys( vm.arr_analyze_temp ).length > 0 ) {

                if( p_subKey != "" ) {
                    if(     typeof vm.arr_analyze_temp[ "backtest" ]                        !=  "undefined"
                        &&  vm.arr_analyze_temp[ "backtest" ]
                        &&  typeof vm.arr_analyze_temp[ "backtest" ][ p_strKey ]            !=  "undefined" 
                        &&  vm.arr_analyze_temp[ "backtest" ][ p_strKey ]
                        &&  typeof vm.arr_analyze_temp[ "backtest" ][ p_strKey ][p_subKey]  !=  "undefined" 
                        &&  vm.arr_analyze_temp[ "backtest" ][ p_strKey ][p_subKey]
                    ) {
                        returnJson.backtest     =   vm.arr_analyze_temp[ "backtest" ][ p_strKey ][p_subKey];
                    }else{
                        returnJson.backtest     =   "N/A";
                    }


                    if(     typeof vm.arr_analyze_temp[ "benchmark" ]                       !=  "undefined"
                        &&  vm.arr_analyze_temp[ "benchmark" ]
                        &&  typeof vm.arr_analyze_temp[ "benchmark" ][ p_strKey ]           !=  "undefined" 
                        &&  vm.arr_analyze_temp[ "benchmark" ][ p_strKey ]
                        &&  typeof vm.arr_analyze_temp[ "benchmark" ][ p_strKey ][p_subKey] !=  "undefined" 
                        &&  vm.arr_analyze_temp[ "benchmark" ][ p_strKey ][p_subKey]
                    ) {
                        returnJson.benchmark    =   vm.arr_analyze_temp[ "benchmark" ][ p_strKey ][p_subKey];
                    }else{
                        returnJson.benchmark    =   "N/A";
                    }

                }else{

                    if(     typeof vm.arr_analyze_temp[ "backtest" ]                !=  "undefined"
                        &&  vm.arr_analyze_temp[ "backtest" ]
                        &&  typeof vm.arr_analyze_temp[ "backtest" ][ p_strKey ]    !=  "undefined" 
                        &&  vm.arr_analyze_temp[ "backtest" ][ p_strKey ]
                    ) {
                        returnJson.backtest     =   vm.arr_analyze_temp[ "backtest" ][ p_strKey ];
                    }else{
                        returnJson.backtest     =   "N/A";
                    }


                    if(     typeof vm.arr_analyze_temp[ "benchmark" ]               !=  "undefined"
                        &&  vm.arr_analyze_temp[ "benchmark" ]
                        &&  typeof vm.arr_analyze_temp[ "benchmark" ][ p_strKey ]   !=  "undefined" 
                        &&  vm.arr_analyze_temp[ "benchmark" ][ p_strKey ]
                    ) {
                        returnJson.benchmark    =   vm.arr_analyze_temp[ "benchmark" ][ p_strKey ];
                    }else{
                        returnJson.benchmark    =   "N/A";
                    }
                }
            }

            return  returnJson;

        },


        /*
        * json 원본을 다운로드 한다.
        * 2019-07-26  bkLove(촤병국)
        */        
        fn_jsonFileDownload() {
            var vm = this;

            const data = vm.inputData;

            var fileURL = window.URL.createObjectURL( new Blob( [ data ], { type: 'text/plain'} ));
            var fileLink = document.createElement('a');

            fileLink.href = fileURL;
            fileLink.setAttribute( 'download',  vm.jsonFileName );
            document.body.appendChild(fileLink);

            fileLink.click();
        },

        /*
         * 시뮬레이션 기본 정보 수정화면으로 이동한다.
         * 2019-09-06  bkLove(촤병국)
         */
        fn_goSimulMod: function() {
            var vm = this;

            var p_param     =   {
                    showSimulationId    :   1
                ,   grp_cd              :   null
                ,   scen_cd             :   null
            };

            if( vm.paramData.grp_cd && vm.paramData.scen_cd  ) {
                p_param.grp_cd      =   vm.paramData.grp_cd; 
                p_param.scen_cd     =   vm.paramData.scen_cd;
            }
            /* 화면으로 부터 결과정보를 받은 경우 */
            else if( vm.paramData.simul_mast && Object.keys( vm.paramData.simul_mast ).length > 0 ) {
                p_param.grp_cd      =   vm.paramData.simul_mast.grp_cd; 
                p_param.scen_cd     =   vm.paramData.simul_mast.scen_cd;
            }

            if( p_param.grp_cd == null || p_param.scen_cd == null ) {
                console.log( "시뮬레이션 기본정보가 존재하지 않습니다." );
                return  false;
            }

            vm.$emit( "fn_showSimulation", p_param );
        }            
    }
    
};
</script>

