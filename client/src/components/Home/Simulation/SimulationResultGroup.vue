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
                <div
                    class="warning_box"
                    v-if="arr_show_error_message != null && arr_show_error_message.length > 0"
                >
                    <span
                        class="margin_n"
                        v-for="(item, index) in arr_show_error_message"
                        :key="index"
                    >
                        <v-icon color="#ff4366">error_outline</v-icon>
                        {{item}}
                        <br />
                    </span>
                </div>

                <h4>
                    {{ simul_result_mast.scen_name }}
                    <span class="sub_t">테스트 결과</span>

                    <span class="btn_r">
                        <v-btn small flat icon @click="fn_open_share_modal( v_item, v_index )">
                            <v-icon>share</v-icon>
                        </v-btn>
                    </span>

                    <span class="btn_r">
                        <v-btn small flat icon v-on:click="fn_goSimulBack()">
                            <v-icon>reply</v-icon>
                        </v-btn>
                    </span>
                </h4>

                <!-- 그래프 영역-->

                <div class="simul_g_w">
                    <div class="simul_g_l">
                        <!-- <div class="simul_graph"> -->
                        <LineSimulationChartG
                            v-if="chartFlag"
                            :arr_result_data="arr_result_daily01"
                            :arr_result_header="arr_result_daily01_header"
                            :arr_checked="arr_checked"
                            :bm_header="bm_daily_header"
                            @fn_showMessageBox="fn_showMessageBox"
                        ></LineSimulationChartG>
                        <!-- </div> -->
                    </div>

                    <div class="simul_g_r v2">
                        <ul v-if="bm_daily_header=='BM (N/A)'">
                            <li
                                v-for="(item, index) in arr_result_daily01_header"
                                v-bind:key="index"
                            >
                                <span
                                    :class="'rcolor' + ( (index+1) < 10 ? '0'+(index+1) : (index+1) ) "
                                >●</span>

                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span dark v-on="on">{{ fn_cutByte( item.scen_name, 28 ) }}</span>
                                    </template>
                                    <span>{{ item.scen_name }}</span>
                                </v-tooltip>

                                <span class="checkbox">
                                    <v-checkbox
                                        v-model="arr_checked[index]"
                                        :key="item.scen_cd"
                                        checked="true"
                                        unchecked="false"
                                    ></v-checkbox>
                                </span>
                            </li>
                        </ul>

                        <ul v-if="bm_daily_header!='BM (N/A)'">
                            <li>
                                <span class="rcolor01">●</span>

                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span dark v-on="on">{{ fn_cutByte( bm_daily_header, 28 ) }}</span>
                                    </template>
                                    <span>{{ bm_daily_header }}</span>
                                </v-tooltip>

                                <span class="checkbox">
                                    <v-checkbox
                                        v-model="arr_checked[0]"
                                        key="bm"
                                        checked="true"
                                        unchecked="false"
                                    ></v-checkbox>
                                </span>
                            </li>

                            <li
                                v-for="(item, index) in arr_result_daily01_header"
                                v-bind:key="index"
                            >
                                <span
                                    :class="'rcolor' + ( (index+2) < 10 ? '0'+(index+2) : (index+2) ) "
                                >●</span>

                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span dark v-on="on">{{ fn_cutByte( item.scen_name, 28 ) }}</span>
                                    </template>
                                    <span>{{ item.scen_name }}</span>
                                </v-tooltip>

                                <span class="checkbox">
                                    <v-checkbox
                                        v-model="arr_checked[index+1]"
                                        :key="item.scen_cd"
                                        checked="true"
                                        unchecked="false"
                                    ></v-checkbox>
                                </span>
                            </li>
                        </ul>
                    </div>

                    <table id="tbl_result_anal01" class="tbl_type ver12">
                        <thead>
                            <tr id="tr01"></tr>
                        </thead>
                    </table>
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
                                    <table id="tbl_result_daily" class="tbl_type ver12">
                                        <thead>
                                            <tr id="tr01"></tr>
                                            <tr id="tr02"></tr>
                                        </thead>
                                    </table>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-tab-item>

                    <!-- 분석정보2-->
                    <v-tab-item>
                        <v-layout row wrap>
                            <v-flex grow xs12>
                                <v-card flat>
                                    <table id="tbl_result_anal02" class="tbl_type ver12">
                                        <thead>
                                            <tr id="tr01"></tr>
                                        </thead>
                                    </table>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </v-flex>

        <v-flex>
            <sharePopup02
                v-if="share_grp_modal_flag"
                :share_row_data="share_row_data"
                @fn_close_share_modal="fn_close_share_modal"
                @fn_showProgress="fn_showProgress"
            ></sharePopup02>

            <sharePopup03
                v-if="share_scen_modal_flag"
                :share_row_data="share_row_data"
                @fn_close_share_modal="fn_close_share_modal"
                @fn_showProgress="fn_showProgress"
            ></sharePopup03>            

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

import LineSimulationChartG  from "@/components/common/chart/LineSimulationChartG.vue";
import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";
import sharePopup02 from "@/components/common/popup/sharePopup02";
import sharePopup03 from "@/components/common/popup/sharePopup03";

var tbl_result_daily    =   null;
var tbl_result_anal01   =   null;
var tbl_result_anal02   =   null;

export default {

    props : [ "paramData" ],

    data() {
        return {
                activeTab: 0
            ,   item: [
                    "일자별지수",
                    "분석정보",
                ]

            ,   arr_show_error_message      :   []

            ,   simul_result_mast           :   {}
            ,   arr_scen_in_grp             :   []      /* 그룹 내 시나리오 정보 */
            ,   method_gubun                :   ""      /* 호출된 메소드 ( 선택비교 또는 그룹비교 체크 용) */

                /* 결과 정보 */
            ,   arr_result_daily01          :   []      /* array 일자별 지수 */
            ,   arr_result_daily01_header   :   []      /* array 일자별 지수 헤더 */
            ,   arr_checked                 :   []      /* array 체크된 정보 */

            ,   arr_result_anal01           :   []      /* array 분석정보 */
            ,   arr_result_anal01_header    :   []      /* array 분석정보 헤더 */

            ,   arr_result_anal02           :   []      /* array 분석정보 */
            ,   arr_result_anal02_header    :   []      /* array 분석정보 헤더 */

            ,   bm_daily_header             :   ""      /* daily BM 헤더 */
            ,   bm_anal_header              :   ""      /* 분석정보 BM 헤더 */

            ,   chartFlag                   :   false

            ,   v_item                      :   {
						grp_cd		:	""
					,	scen_cd		:	""
                }
            ,   v_index                     :   0
            ,   share_row_data              :   {}          /* 공유할 레코드 데이터  */
            ,   share_row_index             :   -1
            ,   share_grp_modal_flag        :   false
            ,   share_scen_modal_flag       :   false

        };
    },

    components: {
        ConfirmDialog,
        LineSimulationChartG,
        sharePopup02,
        sharePopup03,
    },

    created() {
        var vm = this;
    },   

    computed: {

        /*
         * 일자별 지수를 정력한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_sort_arr_result_daily01 : function() {
            var vm = this;

            return _.orderBy( vm.arr_result_daily01, [
                "F12506"
            ], ["desc"]);
        },       

        fn_getClass : function( index  ){
            console.log( "index", index );
            return 'rcolor' + _.padStart( index+2, 2, '0' );
        }             
    },

    mounted() {
        var vm = this;

        vm.chartFlag   =   false;

        vm.fn_showProgress( true );

        /* 초기 데이터를 설정한다. */
        vm.fn_init().then(function(e){
            if( e && e.result ) {
                return step1();
            }
        }).then(function(e){
            if( e && e.result ) {
                return step2();
            }
        }).then(function(e) {
            if( e && e.result ) {
                return step3();
            }
        }).then(function(e){
            vm.fn_showProgress( false );
        }).catch( function(e) {
            console.log( e );
            vm.fn_showProgress( false );
        });



        /* 코드에 속한 일자별 지수를 조회한다. */
        async function step1() {

            return  await new Promise(function(resolve, reject) {

                vm.fn_getSimulDailyInArrCd({ 
                    "arr_scen_in_grp"   :   vm.arr_scen_in_grp
                }).then(function(e1){

                    if( e1 && e1.result ) {

                        try{
                            var tableObj_daily = {
                                serverSide: false,
                                ordering: false,
                                info: false, // control table information display field
                                stateSave: true, //restore table state on page reload,
                                lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                "scrollY": '680px',
                                paging: false,
                                searching: false,
                                data: [],
                                autoWidth: false,

                                fixedColumns:   {
                                    leftColumns: 1,
                                }                            
                            };

                            if ($.fn.DataTable.isDataTable("#tbl_result_daily")) {
                                $("#tbl_result_daily").DataTable().destroy();
                                $("#tbl_result_daily").empty();
                            }

                            var v_daily_tr01            =   $("#tbl_result_daily thead tr[id='tr01']");
                            var v_daily_tr02            =   $("#tbl_result_daily thead tr[id='tr02']");

                            var v_daily_tr01_html       =   "";
                            var v_daily_tr02_html       =   "";

                            var v_arr_show_column       =   [];
                            var v_arr_show_columnDef    =   [];


                            v_daily_tr01_html       =   `<th class="txt_center"  width="100" rowspan="2">일자</th>`;
                            v_arr_show_column.push( { "data": "fmt_F12506"  , "orderable": false } );

                            if( vm.bm_daily_header != 'BM (N/A)' ) {
                                vm.arr_checked.push( true );
                            }

                            vm.arr_result_daily01_header.forEach(function(item, index, array){

                                vm.arr_checked.push( true );

                                v_daily_tr01_html   +=  '<th class="txt_center" colspan="2" width="180">' + item.scen_name + '</th>';

                                v_daily_tr02_html   +=  '<th class="txt_right" width="90">지수</th>';
                                v_daily_tr02_html   +=  '<th class="txt_right" width="90">등락</th>';

                                v_arr_show_column.push( { "data": item.grp_cd + "_" + item.scen_cd + "_INDEX_RATE"  , "orderable": false, 'className': 'dt-body-right' } );
                                v_arr_show_column.push( { "data": item.grp_cd + "_" + item.scen_cd + "_RETURN_VAL"  , "orderable": false, 'className': 'dt-body-right' } );

                                v_arr_show_columnDef.push({  
                                        "render": function ( data, type, row ) {
                                            let htm = ""
                                        
                                            if( typeof data != "undefined" && data != null && data != "" ) {
                                                htm += "<div>" + util.formatNumber(data) + "</div>";
                                            }

                                            return htm;
                                        }
                                    ,   "targets": ( 2*index ) + 1
                                });

                                v_arr_show_columnDef.push({  
                                        "render": function ( data, type, row ) {
                                            let htm = ""

                                            if( typeof data != "undefined" && data != null && data != "" ) {
                                                htm += "<div>" + util.formatNumber(data * 100) + " %</div>";
                                            }

                                            return htm;
                                        }
                                    ,   "targets": ( 2*index ) + 2
                                });
                            });


                            v_daily_tr01_html   +=  '<th class="txt_center" colspan="2" width="180">' + vm.bm_daily_header + '</th>';

                            v_daily_tr02_html   +=  '<th class="txt_right" width="90">지수</th>';
                            v_daily_tr02_html   +=  '<th class="txt_right" width="90">등락</th>';

                            v_arr_show_column.push( { "data":  "BM_RATE"    , "orderable": false, 'className': 'dt-body-right' } );
                            v_arr_show_column.push( { "data":  "BM_RETURN"  , "orderable": false, 'className': 'dt-body-right' } );

                            v_arr_show_columnDef.push({  
                                    "render": function ( data, type, row ) {
                                        let htm = ""
                                    
                                        if( typeof data != "undefined" && data != null && data != "" ) {
                                            htm += "<div>" + util.formatNumber(data) + "</div>";
                                        }

                                        return htm;
                                    }
                                ,   "targets": v_arr_show_column.length-2
                            });

                            v_arr_show_columnDef.push({  
                                    "render": function ( data, type, row ) {
                                        let htm = ""
                                    
                                        if( typeof data != "undefined" && data != null && data != "" ) {
                                            htm += "<div>" + util.formatNumber(data * 100) + " %</div>";
                                        }

                                        return htm;
                                    }
                                ,   "targets": v_arr_show_column.length-1
                            });                        

                            v_daily_tr01.html( v_daily_tr01_html );                        

                            v_daily_tr01.html( v_daily_tr01_html );
                            v_daily_tr02.html( v_daily_tr02_html );

                            if ( vm.arr_result_daily01_header.length > 6 ) {
                                $("#tbl_result_daily").attr( "style", "width: 2040px; table-layout: fixed;" );
                                tableObj_daily.scrollX = true;
                            } else {
                                tableObj_daily.scrollX = "100%";
                            }

                            tableObj_daily.columns    =   v_arr_show_column;
                            tableObj_daily.columnDefs =   v_arr_show_columnDef;

                            tbl_result_daily = $("#tbl_result_daily").DataTable(tableObj_daily);
                            tbl_result_daily.rows.add( vm.fn_sort_arr_result_daily01 ).draw();

                            vm.chartFlag   =   true;

                            resolve( { result : true } );

                        }catch(ex) {
                            console.log( "error", ex );
                            resolve( { result : false } );
                        }

                    }else{
                        resolve( { result : false } );
                    }
                });

            }).catch( function(e1) {
                console.log( e1 );
                vm.fn_showProgress( false );
            });
        }

        /* 코드에 속한 분석정보 01 을 조회한다. */
        async function step2() {

            return  await new Promise(function(resolve, reject) {

                vm.fn_getSimulAnal01InArrCd({
                    "arr_scen_in_grp"   :   vm.arr_scen_in_grp
                }).then(function(e1){

                    if( e1 && e1.result ) {

                        try{
                            var tableObj_anal01 = {
                                serverSide: false,
                                ordering: false,
                                info: false, // control table information display field
                                stateSave: true, //restore table state on page reload,
                                lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                paging: false,
                                searching: false,
                                data: [],
                                autoWidth: false,

                                fixedColumns:   {
                                    leftColumns: 1,
                                }                            
                            };

                            if ($.fn.DataTable.isDataTable("#tbl_result_anal01")) {
                                $("#tbl_result_anal01").DataTable().destroy();
                                $("#tbl_result_anal01").empty();
                            }

                            var v_daily_tr01        =   $("#tbl_result_anal01 thead tr[id='tr01']");
                            var v_daily_tr01_html   =   "";


                            if( vm.arr_result_anal01.length == 0 ) {
                                v_daily_tr01_html       =   `<td class="txt_center">분석정보가 존재하지 않습니다.</td>`;

                                v_daily_tr01.html( v_daily_tr01_html );
                            }else{

                                var v_arr_show_column       =   [];
                                var v_arr_show_columnDef    =   [];

                                v_daily_tr01_html       =   `<th class="txt_left"  width="200">분석지표</th>`;
                                v_arr_show_column.push( { "data": "scen_name"  , "orderable": false, 'className': 'dt-body-left' } );

                                vm.arr_result_anal01_header.forEach(function(item, index, array){
                                    v_daily_tr01_html   +=  '<th class="txt_right" width="140">' + item.anal_id + '</th>';

                                    v_arr_show_column.push( { "data": item.anal_id, "orderable": false, 'className': 'dt-body-right' } );

                                    v_arr_show_columnDef.push({  
                                            "render": function ( data, type, row ) {
                                                let htm = ""
                                            
                                                if( typeof data != "undefined" && data != null && data != "" ) {
                                                    htm += data;
                                                }

                                                return htm;
                                            }
                                        ,   "targets": index+1
                                    });
                                });

                                v_daily_tr01.html( v_daily_tr01_html );

                                if ( vm.arr_result_anal01_header.length > 8 ) {
                                    $("#tbl_result_anal01").attr( "style", "width: 1500px; table-layout: fixed;" );
                                    tableObj_anal01.scrollX = true;
                                } else {
                                    tableObj_anal01.scrollX = "100%";
                                }

                                tableObj_anal01.columns    =   v_arr_show_column;
                                tableObj_anal01.columnDefs =   v_arr_show_columnDef;

                                tbl_result_anal01 = $("#tbl_result_anal01").DataTable(tableObj_anal01);
                                tbl_result_anal01.rows.add( vm.arr_result_anal01 ).draw();
                            }

                            resolve( { result : true } );

                        }catch(ex) {
                            console.log( "error", ex );
                            resolve( { result : false } );
                        }

                    }else{
                        resolve( { result : false } );
                    }
                });

            }).catch( function(e1) {
                console.log( e1 );
                vm.fn_showProgress( false );
            });
        }


        /* 코드에 속한 분석정보 02 를 조회한다. */
        async function  step3() {

            return  await new Promise(function(resolve, reject) {

                vm.fn_getSimulAnal02InArrCd({ 
                    "arr_scen_in_grp"   :   vm.arr_scen_in_grp 
                }).then(function(e1){

                    if( e1 && e1.result ) {

                        try{
                            var tableObj_anal02 = {
                                serverSide: false,
                                ordering: false,
                                info: false, // control table information display field
                                stateSave: true, //restore table state on page reload,
                                lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                "scrollY": '680px',
                                paging: false,
                                searching: false,
                                data: [],
                                autoWidth: false,                      
                            };

                            if ($.fn.DataTable.isDataTable("#tbl_result_anal02")) {
                                $("#tbl_result_anal02").DataTable().destroy();
                                $("#tbl_result_anal02").empty();
                            }

                            var v_daily_tr01        =   $("#tbl_result_anal02 thead tr[id='tr01']");
                            var v_daily_tr01_html   =   "";


                            if( vm.arr_result_anal02.length == 0 ) {
                                v_daily_tr01_html       =   `<td class="txt_center">분석정보가 존재하지 않습니다.</td>`;

                                v_daily_tr01.html( v_daily_tr01_html );
                            }else{

                                var v_arr_show_column       =   [];
                                var v_arr_show_columnDef    =   [];


                                v_daily_tr01_html       =   `<th class="txt_left"  width="220">분석지표</th>`;
                                v_arr_show_column.push( { "data": "anal_id"  , "orderable": false, 'className': 'dt-body-left' } );

                                vm.arr_result_anal02_header.forEach(function(item, index, array){
                                    v_daily_tr01_html   +=  '<th class="txt_right" width="180">' + item.scen_name + '</th>';
                                    v_arr_show_column.push( { "data": item.grp_cd + "_" + item.scen_cd, "orderable": false, 'className': 'dt-body-right' } );
                                    v_arr_show_columnDef.push({  
                                            "render": function ( data, type, row ) {
                                                let htm = ""
                                            
                                                if( typeof data != "undefined" && data != null && data != "" ) {
                                                    htm += data;
                                                }

                                                return htm;
                                            }
                                        ,   "targets": index + 1
                                    });
                                });


                                v_daily_tr01_html       +=   '<th class="txt_right"  width="180">' + vm.bm_anal_header + '</th>';
                                v_arr_show_column.push( { "data": "bm", "orderable": false, 'className': 'dt-body-right' } );
                                v_arr_show_columnDef.push({  
                                        "render": function ( data, type, row ) {
                                            let htm = ""
                                        
                                            if( typeof data != "undefined" && data != null && data != "" ) {
                                                htm += data;
                                            }

                                            return htm;
                                        }
                                    ,   "targets": v_arr_show_column.length-1
                                });

                                v_daily_tr01.html( v_daily_tr01_html );

                                var v_width     =   1660;

                                var v_inx       =   0;
                                if( vm.arr_result_anal02_header.length == 7 ) {
                                    v_inx       =   0;
                                }else if( vm.arr_result_anal02_header.length == 8 ) {
                                    v_inx       =   1;
                                }else if( vm.arr_result_anal02_header.length == 9 ) {
                                    v_inx       =   2;
                                }else if( vm.arr_result_anal02_header.length >= 10 ) {
                                    v_inx       =   3;
                                }

                                v_width     +=  ( v_inx * 180 );

                                if ( vm.arr_result_anal02_header.length >= 7 ) {
                                    $("#tbl_result_anal02").attr( "style", "width: " + v_width + "px; table-layout: fixed;" );
                                    tableObj_anal02.scrollX = true;
                                } else {
                                    tableObj_anal02.scrollX = "100%";
                                }

                                tableObj_anal02.columns    =   v_arr_show_column;
                                tableObj_anal02.columnDefs =   v_arr_show_columnDef;

                                tbl_result_anal02 = $("#tbl_result_anal02").DataTable( tableObj_anal02 );
                                tbl_result_anal02.rows.add( vm.arr_result_anal02 ).draw();
                            }

                            resolve( { result : true } );

                        }catch(ex) {
                            console.log( "error", ex );
                            resolve( { result : false } );
                        }

                    }else{
                        resolve( { result : false } );
                    }
                });

            }).catch( function(e1) {
                console.log( e1 );
                vm.fn_showProgress( false );
            });
        }
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
         * 초기 데이터를 설정한다.
         * 2019-10-24  bkLove(촤병국)
         */
        async fn_init() {
            var vm = this;

            return  await new Promise(function(resolve, reject) {

                try{
                    vm.simul_result_mast                =   Object.assign( {}, vm.paramData.simul_mast );
                    vm.arr_scen_in_grp                  =   [ ...vm.paramData.arr_scen_in_grp ];

                    vm.method_gubun                     =   vm.paramData.method_gubun;
                    vm.v_item.grp_cd    				=   vm.paramData.simul_mast.grp_cd;
                    vm.v_item.scen_cd   				=   vm.paramData.simul_mast.scen_cd;

                    resolve( { result : true } );
                }catch(e) {
                    console.log( "error", e );
                    resolve( { result : true } );
                }

            }).catch( function(e1) {
                console.log( e1 );
            });
        },

        /*
         * 코드에 속한 일자별 지수를 조회한다.
         * 2019-08-14  bkLove(촤병국)
         */
        async fn_getSimulDailyInArrCd( p_param={ grp_cd : "", arr_scen_in_grp : [] }  ) {
            var vm = this;

            vm.arr_show_error_message       =   [];

            vm.arr_result_daily01           =   [];
            vm.arr_result_daily01_header    =   [];

            return  await new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getSimulDailyInArrCd"
                            ,   "data"      :   p_param
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

                                        vm.bm_daily_header              =   response.data.bm_header;
                                        vm.arr_result_daily01           =   response.data.arr_result_daily01;
                                        vm.arr_result_daily01_header    =   response.data.arr_result_daily01_header;

//                                        vm.chartFlag = true;
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
         * 코드에 속한 분석정보 01 을 조회한다.
         * 2019-08-14  bkLove(촤병국)
         */
        async fn_getSimulAnal01InArrCd( p_param={ grp_cd : "", arr_scen_in_grp : [] } ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            return  await new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getSimulAnal01InArrCd"
                            ,   "data"      :   p_param
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{

                                vm.arr_result_anal01            =   [];
                                vm.arr_result_anal01_header     =   [];

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.arr_show_error_message.push( msg );
                                        }

                                        resolve( { result : false } );
                                    }else{

                                        vm.arr_result_anal01            =   response.data.arr_result_anal;
                                        vm.arr_result_anal01_header     =   response.data.arr_result_anal_header;

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
         * 코드에 속한 분석정보 02 를 조회한다.
         * 2019-08-14  bkLove(촤병국)
         */
        async fn_getSimulAnal02InArrCd( p_param={ grp_cd : "", arr_scen_in_grp : [] } ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            return  await new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getSimulAnal02InArrCd"
                            ,   "data"      :   p_param
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{

                                vm.arr_result_anal02            =   [];
                                vm.arr_result_anal02_header     =   [];

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.arr_show_error_message.push( msg );
                                        }

                                        resolve( { result : false } );
                                    }else{

                                        vm.arr_result_anal02            =   response.data.arr_result_anal;
                                        vm.arr_result_anal02_header     =   response.data.arr_result_anal_header;
                                        vm.bm_anal_header               =   response.data.bm_header;

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
         * 시뮬레이션 목록화면으로 이동한다.
         * 2019-09-06  bkLove(촤병국)
         */
        fn_goSimulBack: function() {
            var vm = this;

            vm.$emit( "fn_showSimulation", { showSimulationId : 0 } );
        },

        /*
         * 문자열을 길이만큼 자른다.
         * 2019-09-06  bkLove(촤병국)
         */
        fn_cutByte( str, len) {

            var count = 0;
            
            for(var i = 0; i < str.length; i++) {
                if(escape(str.charAt(i)).length >= 4)
                    count += 2;
                else
                    if(escape(str.charAt(i)) != "%0D")
                        count++;

                if(count >  len) {
                    if(escape(str.charAt(i)) == "%0A")
                        i--;
                    break;		
                }
            }
            
            return str.substring(0, i);

        },

        /*
         * 공유하기 창을 오픈한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_open_share_modal: function( p_item, p_index ) {

            var vm = this;

            vm.arr_show_error_message   =   [];


            if( !p_item || !vm.method_gubun || !vm.arr_scen_in_grp || vm.arr_scen_in_grp.length == 0  ) {
                vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                return  false;
            }

            /* 그룹비교인 경우 */
            if( vm.method_gubun == "getScenInGrpCd" ) {
                if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0  ) {
                    vm.arr_show_error_message.push( "[그룹비교] 기본정보가 존재하지 않습니다." );
                    return  false;
                }
            }

            var v_param             =   {};

            v_param                 =   p_item;
            v_param.p_index         =   p_index;
			v_param.method_gubun	=	vm.method_gubun;
			v_param.arr_scen_in_grp	=	vm.arr_scen_in_grp;

            vm.share_row_data       =   v_param;
            vm.share_row_index      =   p_index;

            /* 02 */
            if( vm.method_gubun == "getScenInGrpCd" ) {
                vm.share_grp_modal_flag     =   true;
            }
            /* 03 */
            else if( vm.method_gubun == "getInfoCheckedScenCd" ) {
                vm.share_scen_modal_flag    =   true;
            }
        },

        /*
         * 공유하기 창을 종료한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_close_share_modal: function() {
            var vm = this;

            vm.share_grp_modal_flag     =   false;
            vm.share_scen_modal_flag    =   false;
        },		
    },
    
};
</script>

