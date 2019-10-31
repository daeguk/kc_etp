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
                        <button type="button" class="exceldown_btn" @click="fn_excelDown()"></button>
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
                                <ul>
                                    <li><span class="rcolor1">●</span> Scenario </li>
                                    <li><span class="rcolor2">●</span> {{ simul_result_mast.bench_index_nm2 }}</li>
                                </ul>
                            <!-- </div> -->
                                </div>
                                <div class="simul_g_r">
                                <table class="tbl_type ver11 v2">
                                    <colgroup>
                                        <col width="38%"/>
                                        <col width="31%"/>
                                        <col width="31%"/>
                                    </colgroup>
                                    <thead>
                                        <th></th>
                                        <th>Scenario</th>
                                        <th>{{ simul_result_mast.bench_index_nm2 }}</th>
                                    </thead>

                                    <tbody>
                                        <tr v-for="( row, index ) in  fn_sort_arr_analyze_main" v-bind:key="row + '_' + index + '_main'" >
                                            <th class="txt_left"  width="38%">
                                                {{ row.anal_title          /* 분석지표 */ }}
                                            </th>
                                            <td class="txt_right" width="31%">
                                                {{ row.backtest           /* Senario */ }}
                                            </td>
                                            <td class="txt_right" width="31%">
                                                {{ row.benchmark          /* BM */ }}
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
import excel from "xlsx";

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
            ,   arr_analyze_db              :   []      /* DB 에 저장하기 위한 정보 */
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
            var v_now_background        =   "background:#e7f2f7";
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

                            /* 비교시총 */
                            if( typeof item.tot_F15028_C != "undefined" ) {
                                item.F15028_C       =   item.tot_F15028_C;
                            }

                            /* 기준시총 */
                            if( typeof item.tot_F15028_S != "undefined" ) {
                                item.F15028_S       =   item.tot_F15028_S;
                            }

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
                                        if( response.data.arr_analyze && response.data.arr_analyze.length > 0 ) {

                                            vm.arr_analyze          =   response.data.arr_analyze;
                                            vm.arr_analyze_main     =   response.data.arr_analyze_main;
                                        }else{
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

            paramData                   =   vm.simul_result_mast;
            paramData.arr_analyze       =   vm.arr_analyze_db;

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
                                    if( msg ) {
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
                                p_item_obj.bench_index_nm2       =  "BM (N/A)";
                            }else{
                                p_item_obj.bench_index_nm2       =   p_item_obj.bench_index_nm;
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
                            p_item_obj.fmt_rebalancing_yn       =   ( p_item_obj.rebalancing == "0" ? "N" : "Y" );

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
            vm.arr_analyze_db   =   [];

            if( vm.arr_analyze_temp &&  Object.keys( vm.arr_analyze_temp ).length > 0  ) {
                var v_anal      =   {};
                var v_anal01    =   {};
                

                /* 정수처리 */
                v_anal                  =   vm.fn_getFindJson( "final_balance" );
                v_anal.anal_title       =   "Final Balance";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "int"
                    ,   p_percent_yn        :   "0"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "cagr" );
                v_anal.anal_title       =   "CAGR";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   vm.arr_analyze_main

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   1
                });


                /*  수익률 ( 연도 )
                    %처리. 100곱한후 소수점 6째자리에서 반올림 
                */
                v_anal                  =   vm.fn_getFindJson( "best_y", "rtn" );
                v_anal01                =   vm.fn_getFindJson( "best_y", "year" );
                v_anal.anal_title       =   "Best Year";
                v_anal.backtest02       =   ( v_anal01.backtest     != "N/A"    ?   v_anal01.backtest   : "N/A" );
                v_anal.benchmark02      =   ( v_anal01.benchmark    != "N/A"    ?   v_anal01.benchmark  : "N/A" );
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   v_anal01

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /*  수익률 ( 연도 )
                    %처리. 100곱한후 소수점 6째자리에서 반올림 
                */
                v_anal                  =   vm.fn_getFindJson( "worst_y", "rtn" );
                v_anal01                =   vm.fn_getFindJson( "worst_y", "year" );
                v_anal.anal_title       =   "Worst Year";
                v_anal.backtest02       =   ( v_anal01.backtest     != "N/A"    ?   v_anal01.backtest   : "N/A" );
                v_anal.benchmark02      =   ( v_anal01.benchmark    != "N/A"    ?   v_anal01.benchmark  : "N/A" );
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   v_anal01

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "mdd" );
                v_anal.anal_title       =   "MDD";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   vm.arr_analyze_main

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   6
                });


                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "sharpe_rto" );
                v_anal.anal_title       =   "Sharpe Ratio";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   vm.arr_analyze_main

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "0"
                    ,   p_position          :   5
                    ,   p_order_no          :   3
                });


                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "sortino_rto" );
                v_anal.anal_title       =   "Sortino Ratio";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "0"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_market", "corr" );
                v_anal.anal_title       =   "Market Correlation";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "0"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "arith_mean" );
                v_anal.anal_title       =   "Arithmetic Mean (daily)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "annlzd_arith_mean" );
                v_anal.anal_title       =   "Arithmetic Mean (annualized)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "geo_mean" );
                v_anal.anal_title       =   "Geometric Mean (daily)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "annlzd_geo_mean" );
                v_anal.anal_title       =   "Geometric Mean (annualized)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "stdev" );
                v_anal.anal_title       =   "Volatility (daily)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "annlzd_stdev" );
                v_anal.anal_title       =   "Volatility (annualized)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   vm.arr_analyze_main

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   2
                });
                vm.arr_analyze_main[ vm.arr_analyze_main.length-1 ].anal_title      =   "Vol(annualized)";
                vm.arr_analyze_db[ vm.arr_analyze_db.length-1 ].title_anal_id       =   "Vol(annualized)";


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "down_dev" );
                v_anal.anal_title       =   "Downside Deviation (daily)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_market", "beta" );
                v_anal.anal_title       =   "Beta(vs market)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   vm.arr_analyze_main

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "0"
                    ,   p_position          :   5
                    ,   p_order_no          :   4
                });
                vm.arr_analyze_main[ vm.arr_analyze_main.length-1 ].anal_title      =   "Beta(KOSPI 기준)";
                vm.arr_analyze_db[ vm.arr_analyze_db.length-1 ].title_anal_id       =   "Beta(KOSPI 기준)";


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_market", "alpha" );
                v_anal.anal_title       =   "Alpha(vs market, annualized)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   vm.arr_analyze_main

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   5
                });
                vm.arr_analyze_main[ vm.arr_analyze_main.length-1 ].anal_title      =   "Alpha(KOSPI 기준)";
                vm.arr_analyze_db[ vm.arr_analyze_db.length-1 ].title_anal_id       =   "Alpha(KOSPI 기준)";


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_market", "r2" );
                v_anal.anal_title       =   "R2(vs market)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_benchmark", "beta" );
                v_anal.anal_title       =   "Beta(vs benchmark)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "0"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_benchmark", "alpha" );
                v_anal.anal_title       =   "Alpha(vs benchmark, annualized)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "vs_benchmark", "r2" );
                v_anal.anal_title       =   "R2(vs benchmark)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "skewness" );
                v_anal.anal_title       =   "Skewness";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "0"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "kurtosis" );
                v_anal.anal_title       =   "Excess Kurtosis";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "0"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "hist_var" );
                v_anal.anal_title       =   "Historical VaR(5%)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "anal_var" );
                v_anal.anal_title       =   "Analytical VaR(5%)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });


                /* %처리. 100곱한후 소수점 6째자리에서 반올림 */
                v_anal                  =   vm.fn_getFindJson( "c_var" );
                v_anal.anal_title       =   "Conditional VaR(5%)";
                vm.fn_set_analyze_data({ 
                        p_arr_analyze       :   vm.arr_analyze
                    ,   p_arr_analyze_db    :   vm.arr_analyze_db
                    ,   p_arr_analyze_main  :   null

                    ,   p_anal              :   v_anal 
                    ,   p_anal01            :   {}

                    ,   p_type              :   "number"
                    ,   p_percent_yn        :   "1"
                    ,   p_position          :   5
                    ,   p_order_no          :   -1
                });
            }
        },

        /*
        *   파싱된 분석정보를 설정한다.
        *   2019-07-26  bkLove(촤병국)
        */
        fn_set_analyze_data( p_param={ p_arr_analyze : [], p_arr_analyze_db:[], p_arr_analyze_main:[], p_anal:{}, p_anal01:{}, p_type:"", p_percent_yn:"0", p_position:5, p_order_no:-1 } ) {

            var vm = this;

            var v_result_data   =   {};

            var v_data  =   {
                    anal_title      :   ""
                ,   backtest02      :   ""
                ,   benchmark02     :   ""
            };

            if( typeof p_param.p_anal !="undefined" && Object.keys(p_param.p_anal).length > 0 && typeof p_param.p_anal.anal_title !="undefined" ) {
                v_data.anal_title       =   p_param.p_anal.anal_title;
            }

            if( typeof p_param.p_anal01 != "undefined" && Object.keys(p_param.p_anal01).length > 0 ) {
                v_data.backtest02       =   ( p_param.p_anal01.backtest     != "N/A"    ?   p_param.p_anal01.backtest   : "N/A" );
                v_data.benchmark02      =   ( p_param.p_anal01.benchmark    != "N/A"    ?   p_param.p_anal01.benchmark  : "N/A" );
            }


        /*  analyze     START */
            if( p_param.p_arr_analyze != null ) {

                v_result_data   =   Object.assign( {}, v_data );

                v_result_data.backtest         =   vm.fn_convert_data({
                        p_data              :   p_param.p_anal.backtest
                    ,   p_data01            :   v_data.backtest02
                    ,   p_type              :   p_param.p_type
                    ,   p_percent_yn        :   p_param.p_percent_yn
                    ,   p_show_percent_yn   :   "1"
                    ,   p_show_data01_yn    :   "1"
                    ,   p_position          :   p_param.p_position
                });

                v_result_data.benchmark        =   vm.fn_convert_data({
                        p_data              :   p_param.p_anal.benchmark
                    ,   p_data01            :   v_data.benchmark02
                    ,   p_type              :   p_param.p_type
                    ,   p_percent_yn        :   p_param.p_percent_yn
                    ,   p_show_percent_yn   :   "1"
                    ,   p_show_data01_yn    :   "1"
                    ,   p_position          :   p_param.p_position
                });

                p_param.p_arr_analyze.push( v_result_data );


                /*  arr_analyze_main    START */
                if( p_param.p_arr_analyze_main != null ) {
                    v_result_data               =   Object.assign( {}, v_result_data );
                    v_result_data.order_no      =   p_param.p_order_no;

                    p_param.p_arr_analyze_main.push( v_result_data );
                }
                /*  arr_analyze_main    END */

            }
        /*  analyze     END */


        /* arr_analyze_db   START */
            if( p_param.p_arr_analyze != null ) {

                v_result_data       =   Object.assign( {}, v_data );

                v_result_data.title_anal_id     =   "";
                if( p_param.p_order_no > 0 ) {
                    v_result_data.title_anal_id =   v_result_data.anal_title;
                }

                v_result_data.title_order_no    =   p_param.p_order_no;
                
                v_result_data.backtest      =   vm.fn_convert_data({
                        p_data              :   p_param.p_anal.backtest
                    ,   p_data01            :   v_data.backtest02
                    ,   p_type              :   p_param.p_type
                    ,   p_percent_yn        :   p_param.p_percent_yn
                    ,   p_show_percent_yn   :   "0"
                    ,   p_show_data01_yn    :   "0"
                    ,   p_position          :   p_param.p_position
                });

                v_result_data.backtest_year             =   "";
                if( v_data.backtest02 != "" ) {
                    v_result_data.backtest_year         =   v_data.backtest02;
                }

                v_result_data.backtest_percent_yn       =   "0";
                if( typeof p_param.p_percent_yn != "undefined" ) {
                    v_result_data.backtest_percent_yn   =   p_param.p_percent_yn;
                }

            
                v_result_data.benchmark     =   vm.fn_convert_data({
                        p_data              :   p_param.p_anal.benchmark
                    ,   p_data01            :   v_data.benchmark02
                    ,   p_type              :   p_param.p_type
                    ,   p_percent_yn        :   p_param.p_percent_yn
                    ,   p_show_percent_yn   :   "0"
                    ,   p_show_data01_yn    :   "0"
                    ,   p_position          :   p_param.p_position
                });

                v_result_data.benchmark_year            =   "";
                if( v_data.benchmark02 != "" ) {
                    v_result_data.benchmark_year        =   v_data.benchmark02;
                }

                v_result_data.benchmark_percent_yn      =   "0";
                if( typeof p_param.p_percent_yn != "undefined" ) {
                    v_result_data.benchmark_percent_yn  =   p_param.p_percent_yn;
                }
            }
        /* arr_analyze_db   END */

            p_param.p_arr_analyze_db.push( v_result_data );            
        },


        /*
        *   구분 정보에 맞게 데이터를 노출한다.
        *   2019-07-26  bkLove(촤병국)
        */
        fn_convert_data( p_param={ p_data : "", p_data01 : "", p_type : "", p_percent_yn : "0",  p_show_percent_yn : "0", p_position : 5, p_show_data01_yn : "0" } ) {

            var v_data  =   "";

            if( p_param.p_data == "N/A" ) {
                v_data  =   p_param.p_data;
            }else{
                switch( p_param.p_type ) {

                    case    "number"    :

                                if( p_param.p_percent_yn == "0" ) {
                                    v_data  =   Number( p_param.p_data ).toFixed( p_param.p_position );
                                }else{
                                    v_data  =   ( Number( p_param.p_data ) * 100 ).toFixed( p_param.p_position );
                                }

                                if( p_param.p_percent_yn == "1" && p_param.p_show_percent_yn == "1" ) {
                                    v_data  +=  " %";
                                }

                                if( typeof p_param.p_show_data01_yn != "undefined" && p_param.p_show_data01_yn == "1" ) {
                                    if( p_param.p_data01 != "" ) {
                                        v_data    +=  " (";
                                        v_data    +=  p_param.p_data01;
                                        v_data    +=  ")";
                                    }
                                }

                                break;

                    case    "int"    :

                                v_data  =   parseInt( Number( p_param.p_data ) );
                                break;

                    case    ""    :
                                v_data  =   p_param.p_data;
                                break;
                }
            }

            return  v_data;
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
        * 엑셀을 다운로드 한다.
        * 2019-10-17  bkLove(촤병국)
        */
        fn_excelDown() {

            var vm = this;

            var options     =   {
                    skipHeader          :   true
                ,   origin              :   "A2"
                ,   colStartIndex       :   0
                ,   rowStartIndex       :   1
                ,   colsInfo            :   {
                            hidden  :   false
                        ,   width   :   15
                    }
                ,   rowsInfo        :   {
                            hidden  :   false
                        ,   hpt     :   20
                    }
            };

            var excelInfo = {
                    excelFileNm     :   vm.simul_result_mast.scen_name.replace( /(\\)|(")|(\/)|(:)|(\*)|(\?)|(<)|(>)|(\|)/g, "" )
                ,   sheetNm         :   ""
                ,   dataInfo        :   []

                ,   arrHeaderNm     :   []
                ,   arrHeaderKey    :   []

                ,   arrColsInfo     :   []
            };            


            try{

                var dataWS;
                var wb = excel.utils.book_new();

                step1().then( function(e){
                    if( e && e.result ) {
                        return  step2();
                    }
                }).then( function(e1) {
                    if( e1 && e1.result ) {
                        return  step3();
                    }
                }).then( function(e2) {
                    if( e2 && e2.result ) {
                        return  step4();
                    }
                }).then( function(e3) {
                    step5();
                })
                
                /* 일자별 지수 */
                async function    step1() {

                    return  await new Promise(function(resolve, reject) {

                        vm.fn_showProgress( true );

                        try{
                            excelInfo.sheetNm           =   "일자별 지수";

                            excelInfo.arrHeaderNm       =   [       
                                    "일자", "Index", "Balance", "Return", vm.simul_result_mast.bench_index_nm
                                ,   "BM(1000환산)", "BM return", "기준시총", "비교시총", "리밸런싱일 여부"
                            ];


                            excelInfo.arrHeaderKey      =   [       
                                    "fmt_F12506", "INDEX_RATE", "fmt_balance", "RETURN_VAL", "fmt_bm_data01"
                                ,   "fmt_bm_1000_data", "fmt_bm_return_data", "F15028_S", "F15028_C", "fmt_rebalancing_yn"
                            ];

                            excelInfo.arrColsInfo       =   [       
                                    {width : 15}, {width : 30}, {width : 15}, {width : 30}, {width : 15}
                                ,   {width : 15}, {width : 15}, {width : 30}, {width : 30}, {width : 15} 
                            ];

                            excelInfo.dataInfo  =   vm.fn_setExcelInfo( vm.fn_sort_arr_result_daily, excelInfo.arrHeaderKey );
                            dataWS              =   excel.utils.aoa_to_sheet( [ excelInfo.arrHeaderNm ] );
                            options             =   Object.assign( options, excelInfo.options );
                            vm.fn_setSheetInfo( dataWS, options, excelInfo );
                            excel.utils.sheet_add_json( dataWS, excelInfo.dataInfo, { header: excelInfo.arrHeaderKey , skipHeader : options.skipHeader, origin : options.origin });
                            excel.utils.book_append_sheet( wb, dataWS, excelInfo.sheetNm );

                            resolve( { result : true } );

                        }catch(ex) {
                            vm.fn_showProgress( false );
                            console.log( "error", ex );

                            resolve( { result : false } );
                        }
                    });

                }
                
                /* 리밸런싱 내역 */
                async function    step2() {
                    return  await new Promise(function(resolve, reject) {

                        try{
                            excelInfo.sheetNm           =   "리밸런싱 내역";

                            excelInfo.arrHeaderNm       =   [       
                                "일자", "Event", "종목", "변경전", "변경후"
                            ];

                            excelInfo.arrHeaderKey      =   [       
                                "fmt_F12506", "fmt_EVENT_FLAG", "fmt_F16002", "fmt_BEFORE_IMPORTANCE", "fmt_AFTER_IMPORTANCE"
                            ];

                            excelInfo.arrColsInfo       =   [       
                                {width : 15}, {width : 15}, {width : 40}, {width : 15}, {width : 15}
                            ];

                            excelInfo.dataInfo  =   vm.fn_setExcelInfo( vm.fn_sort_arr_result_rebalance, excelInfo.arrHeaderKey );
                            dataWS              =   excel.utils.aoa_to_sheet( [ excelInfo.arrHeaderNm ] );
                            options             =   Object.assign( options, excelInfo.options );
                            vm.fn_setSheetInfo( dataWS, options, excelInfo );
                            excel.utils.sheet_add_json( dataWS, excelInfo.dataInfo, { header: excelInfo.arrHeaderKey , skipHeader : options.skipHeader, origin : options.origin });
                            excel.utils.book_append_sheet( wb, dataWS, excelInfo.sheetNm );

                            resolve( { result : true } );

                        }catch(ex) {
                            vm.fn_showProgress( false );
                            console.log( "error", ex );

                            resolve( { result : false } );
                        }                                    
                    });

                }
                
                /* 분석정보 */
                async function    step3() {
                    return  await new Promise(function(resolve, reject) {

                        try{
                            excelInfo.sheetNm           =   "분석정보";

                            excelInfo.arrHeaderNm       =   [       
                                "분석지표", "백테스트", vm.simul_result_mast.bench_index_nm
                            ];

                            excelInfo.arrHeaderKey      =   [       
                                "anal_title", "backtest", "benchmark"
                            ];


                            excelInfo.arrColsInfo       =   [       
                                {width : 45}, {width : 20}, {width : 20}
                            ];

                            excelInfo.dataInfo  =   vm.fn_setExcelInfo( vm.arr_analyze, excelInfo.arrHeaderKey );
                            dataWS              =   excel.utils.aoa_to_sheet( [ excelInfo.arrHeaderNm ] );
                            options             =   Object.assign( options, excelInfo.options );
                            vm.fn_setSheetInfo( dataWS, options, excelInfo );
                            excel.utils.sheet_add_json( dataWS, excelInfo.dataInfo, { header: excelInfo.arrHeaderKey , skipHeader : options.skipHeader, origin : options.origin });
                            excel.utils.book_append_sheet( wb, dataWS, excelInfo.sheetNm );

                            resolve( { result : true } );

                        }catch(ex) {
                            vm.fn_showProgress( false );
                            console.log( "error", ex );

                            resolve( { result : false } );
                        }
                    });
                }

                /* 종목 정보 */
                async function    step4() {

                    return  await new Promise(function(resolve, reject) {

                        try{

                            util.axiosCall(
                                    {
                                            "url"       :   Config.base_url + "/user/simulation/getSimulJongmoForExcel"
                                        ,   "data"      :   {
                                                    "grp_cd"    :   vm.simul_result_mast.grp_cd
                                                ,   "scen_cd"   :   vm.simul_result_mast.scen_cd
                                            }
                                        ,   "method"    :   "post"
                                    }
                                ,   function(response) {
                                        try{

                                            excelInfo.sheetNm           =   "종목정보";

                                            if (response && response.data) {
                                                var msg = ( response.data.msg ? response.data.msg : "" );

                                                if (!response.data.result) {
                                                    if( msg ) {
                                                        resolve( { result : false } );
                                                    }
                                                }else{

                                                    var arr_excel_jongmok_header    =   response.data.arr_excel_jongmok_header;
                                                    var arr_excel_jongmok_data      =   response.data.arr_excel_jongmok_data;

                                                    if( !arr_excel_jongmok_header || typeof arr_excel_jongmok_header == "undefined" ) {
                                                        arr_excel_jongmok_header    =   [];
                                                    }

                                                    if( !arr_excel_jongmok_data || typeof arr_excel_jongmok_data == "undefined" ) {
                                                        arr_excel_jongmok_data      =   [];
                                                    }


                                                    var arr_row2    =   [ 
                                                            {   "col_id"    :   "F15007"            ,   "width" :   12  ,   "title" :   "기준가"        }
                                                        ,   {   "col_id"    :   "F30700"            ,   "width" :   12  ,   "title" :   "종가"          }
                                                        ,   {   "col_id"    :   "F16143"            ,   "width" :   12  ,   "title" :   "상장주식수"    }
                                                        ,   {   "col_id"    :   "TODAY_RATE"        ,   "width" :   25  ,   "title" :   "지수적용비율"  }
                                                        ,   {   "col_id"    :   "TODAY_IMPORTANCE"  ,   "width" :   25  ,   "title" :   "비중"          }
                                                    ];

                                                    var v_excel_row_data    =   [];

                                                    if( arr_excel_jongmok_data.length > 0 ) {

                                                        if( arr_excel_jongmok_header.length > 0 ) {

                                                            v_excel_row_data.push( [] );
                                                            v_excel_row_data.push( [] );

                                                            var v_row_data  =   [];
                                                            arr_excel_jongmok_data.forEach( function( item, index, array ) {
                                                                v_row_data  =   [];

                                                                v_row_data.push( item.fmt_F12506 );
                                                                arr_excel_jongmok_header.forEach( function( item1, index1, array1 ) {

                                                                    if( item1.F16013 && typeof item1.F16013 != "undefined" ) {

                                                                        arr_row2.forEach( function( item2, index2, array2 ) {

                                                                            if( item2.col_id && typeof item2.col_id != "undefined" ) {

                                                                                if( item[ item1.F16013 + "_" + item2.col_id ] && typeof item[ item1.F16013 + "_" + item2.col_id ] != "undefined" ) {

                                                                                    if( [ "F15007", "F30700", "F16143" ].includes( item2.col_id ) ) {
                                                                                        v_row_data.push( Number( item[ item1.F16013 + "_" + item2.col_id ] ) );
                                                                                    }else{
                                                                                        v_row_data.push( item[ item1.F16013 + "_" + item2.col_id ] );
                                                                                    }
                                                                                }else{
                                                                                    v_row_data.push( item[ item1.F16013 + "_" + item2.col_id ] );
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                });

                                                                v_excel_row_data.push( v_row_data );
                                                            })

                                                        }
                                                    }

                                                    dataWS = excel.utils.aoa_to_sheet( v_excel_row_data );


                                                    var v_arr_cols          =   [];
                                                    var v_arr_merge_cell    =   [];
                                                    if( arr_excel_jongmok_header.length > 0 ) {
                                                        
                                                        dataWS[ excel.utils.encode_cell( { r : 0, c: 0 } ) ]              =   { t:'s', v: "일자" };
                                                        v_arr_merge_cell.push({
                                                                s : { r: 0 , c: 0 }
                                                            ,   e : { r: 1 , c: 0 }
                                                        });
                                                        v_arr_cols.push( { hidden : false, width : 12 } );
                                                                                                                    
                                                        for( var i=0; i < arr_excel_jongmok_header.length; i++ ) {
                                                            var v_header    =   arr_excel_jongmok_header[i];

                                                            dataWS[ excel.utils.encode_cell( { r : 0, c: ( i * arr_row2.length ) + 1 } ) ]          =   { t:'s', v: v_header.F16002 };
                                                            for( var j=0; j < arr_row2.length; j++ ) {
                                                                var v_rows2     =   arr_row2[j];

                                                                dataWS[ excel.utils.encode_cell( { r : 1 , c: (i * arr_row2.length) + j + 1 } ) ]   =   { t:'s', v: v_rows2.title };

                                                                v_arr_cols.push( { hidden : false, width : v_rows2.width } );
                                                            }

                                                            v_arr_merge_cell.push({
                                                                    s : { r: 0 , c: ( i * arr_row2.length ) + 1 }
                                                                ,   e : { r: 0 , c: ( i * arr_row2.length ) + arr_row2.length }
                                                            });
                                                        }

                                                        dataWS['!merges']   =   v_arr_merge_cell;
                                                        dataWS['!cols']     =   v_arr_cols;
                                                    }


                                                    dataWS['!ref'] = excel.utils.encode_range({
                                                        s: { c: 0, r: 0 },
                                                        e: { c: ( arr_row2.length * arr_excel_jongmok_header.length ), r: v_excel_row_data.length + 2 }
                                                    });                                                    


                                                    excel.utils.book_append_sheet( wb, dataWS, excelInfo.sheetNm );

                                                    resolve( { result : true } );
                                                }
                                            }

                                        }catch(ex) {
                                            console.log( "error", ex );

                                            resolve( { result : false } );
                                        }
                                    }
                                ,   function(error) {
                                        console.log( "error", ex );

                                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                                        resolve( { result : false } );
                                    }
                            );

                        }catch(ex) {
                            console.log( "error", ex );
                            
                            resolve( { result : false } );
                        }
                    });
                }                

                /* 파일 저장 */
                async function    step5() {

                    return  await new Promise(function(resolve, reject) {

                        try{                
                            excel.writeFile( wb, excelInfo.excelFileNm + "_"+ util.getToday() +  ".xlsx" );

                            vm.fn_showProgress( false );

                            resolve( { result : true } );

                        }catch(ex) {
                            vm.fn_showProgress( false );
                            console.log( "error", ex );

                            resolve( { result : false } );
                        }
                    });
                }

            }catch(e){
                console.log( "[error] SimulationResult.vue -> fn_excelDown", e );
            }
        },

        /*
        * 시트정보를 설정한다.
        * 2019-10-17  bkLove(촤병국)
        */
        fn_setSheetInfo( p_dataWS, p_options, p_excelInfo ) {

            try{
            
            /* 설정할 컬럼 정보 */

                /* 헤더 컬럼별 설정정보가 있는 경우 */
                if( p_excelInfo.arrColsInfo && p_excelInfo.arrColsInfo.length > 0 ) {
                    p_dataWS['!cols'] = [];

                    for (var i = p_options.colStartIndex ; i < p_excelInfo.arrHeaderKey.length ; i++) {
                        var colsInfo    =   {};

                        colsInfo    =   Object.assign( colsInfo, p_options.colsInfo );

                        /* arrColsInfo 갯수와 arrHeaderKey 갯수가 다를수 있기에 arrColsInfo 의 인덱스가 arrHeaderKey 인덱스 안에 포함되는 경우 */
                        if( i < p_excelInfo.arrColsInfo.length ) {
                            colsInfo    =   Object.assign( colsInfo, p_excelInfo.arrColsInfo[i] );
                        }

                        p_dataWS['!cols'][i] = colsInfo;
                    }
                }
                /* 기본 컬럼 설정정보가 있는 경우 */
                else if( p_excelInfo.colsInfo && Object.keys( p_excelInfo.colsInfo ).length > 0 ) {
                    p_dataWS['!cols'] = [];

                    for (var i = p_options.colStartIndex ; i < p_excelInfo.arrHeaderKey.length ; i++) {
                        var colsInfo    =   Object.assign( {}, p_options.colsInfo, p_excelInfo.colsInfo );
                        p_dataWS['!cols'][i] = colsInfo;
                    }
                }



            /* 설정할 레코드 정보 */

                /* 레코드별 설정정보가 있는 경우 */
                if( p_excelInfo.arrRowsInfo && p_excelInfo.arrRowsInfo.length > 0 ) {
                    p_dataWS['!rows'] = [];

                    for (var i = 0, row= p_options.rowStartIndex; i < p_excelInfo.dataInfo.length; i++, row++) {
                        var rowsInfo    =   {};

                        rowsInfo    =   Object.assign( rowsInfo, p_options.rowsInfo );

                        /* arrRowsInfo 갯수와 dataInfo 갯수가 다를수 있기에 arrRowsInfo 의 인덱스가 dataInfo 인덱스 안에 포함되는 경우 */
                        if( i < p_excelInfo.arrRowsInfo.length ) {
                            rowsInfo    =   Object.assign( rowsInfo, p_excelInfo.arrRowsInfo[i] );
                        }

                        p_dataWS['!rows'][row] = rowsInfo;
                    }
                }
                /* 기본 레코드 설정정보가 있는 경우 */
                else if( p_excelInfo.rowsInfo && Object.keys( p_excelInfo.rowsInfo ).length > 0 ) {
                    p_dataWS['!rows'] = [];

                    for (var i = p_options.colStartIndex ; i < p_excelInfo.arrHeaderKey.length ; i++) {
                        var rowsInfo    =   Object.assign( {}, p_options.rowsInfo, p_excelInfo.rowsInfo );
                        p_dataWS['!rows'][i] = rowsInfo;
                    }
                }

            }catch(e){
                console.log( "[error] SimulationResult.vue -> fn_setSheetInfo", e );
            }                
        },


        /*
        * p_arr_header_key 정보를 기준으로 데이터를 설정한다.
        * 2019-10-17  bkLove(촤병국)
        */
        fn_setExcelInfo( p_data_list, p_arr_header_key ) {

            var v_execel_data_list  =   [];

            try{

                if( p_data_list && p_data_list.length >0 && p_arr_header_key && p_arr_header_key.length > 0 ) {

                    /* key에 존재하는 데이터를 기준으로 원본 데이터 추출 */
                    for( var i in p_data_list ) {

                        var dataRow = p_data_list[i];
                        
                        var tempObj = {};
                        var existCheck = _.filter( p_arr_header_key, function(o) {

                            if ( typeof dataRow[o] != "undefined" ) {

                                if( 
                                    [  "fmt_balance",  "bm_data01", "bm_1000_data" ].includes( o ) 
                                ) {
                                    if( typeof dataRow[o] == "string" ) {
                                        tempObj[o]  =   Number( util.NumtoStr( dataRow[o] ) );
                                    }else{
                                        tempObj[o]  =   Number( dataRow[o] );
                                    }
                                }
                                else if( [ "INDEX_RATE", "RETURN_VAL", "F15028_S", "F15028_C"  ].includes(o) ){
                                    tempObj[o]  =   String( dataRow[o] );
                                }
                                else{
                                    tempObj[o]  =   dataRow[o];
                                }
                            }
                        });

                        if( Object.keys(tempObj).length > 0 ) {
                            v_execel_data_list[i]   =   tempObj;
                        }
                    }
                }

                return  v_execel_data_list;

            }catch(e){
                console.log( "[error] SimulationResult.vue -> fn_setExcelInfo", e );
            }
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

