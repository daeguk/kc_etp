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

                                        item-text="scen_name" 
                                        item-value="scen_cd" 

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
                                <col width="15%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>종목코드</th>
                                    <th class="txt_left">종목명</th>
                                    <th class="txt_right">시가총액</th>
                                    <th class="txt_right">비중</th>
                                    <th class="txt_right">지수적용비율</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="sum">
                                    <td>Total</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="txt_right">
                                        <input type="text" id class="txt_right wid100" value="" /> %
                                    </td>
                                    <td></td>
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
            <ProgressBar ref="progress"></ProgressBar>
            <ConfirmDialog ref="confirm2"></ConfirmDialog>
        </v-flex>

    </v-layout>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";

import MastPopup from "@/components/common/popup/MastPopup";
import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";

var table01 = null;


export default {

    data() {
        return {
                toggle_one: 0
            ,   items3: ["설정안함", "KOSPI200", "KOSDAQ150", "KOSPI", "KOSDAQ"]
            ,   item: [
                    {
                        link: "Simulation/SimulationResult"
                    }
                ]


            ,   disabled_rebalance_cd:[ false, true, true, true, false ]
            ,   MastModalFlag: false
            ,   selectedRowIndex    :   -1
            ,   arr_rebalance_disabled_check    :   { 
                        /* 1- 매년 */
                        "1" :   [ false , true, true, true, false ]

                        /* 2-반기 */
                    ,   "2" :   [ false , false, true, true, false ]

                        /* 3-분기 */
                    ,   "3" :   [ false , true, false, true, false ]

                        /* 4-매월 */
                    ,   "4" :   [ false , true, true, false, false ]

                        /* 5-매주 */
                    ,   "5" :   [ false , false, false, false, false ]
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

            ,   grp_cd                      :   ""          /* 상위 그룹코드 */
            ,   scen_name                   :   ""          /* 시나리오명 */
            ,   start_year                  :   2000        /* 시작년도 */
            ,   rebalance_cycle_cd          :   "1"         /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
            ,   rebalance_date_cd           :   ""          /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
            ,   init_invest_money           :   1000000     /* 초기투자금액 */
            ,   bench_mark_cd               :   "0"         /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
            ,   importance_method_cd        :   "1"         /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */

            ,   arr_portfolio               :   []          /* 포트폴리오 설정 정보 */
        };
    },

    components: {
        MastPopup,
        ProgressBar,
        ConfirmDialog        
    },    

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        /* 상위 그룹정보를 조회한다. */
        vm.fn_initGrpCd();

        /* next 시나리오명을 조회한다. */
        vm.fn_getNextScenName();        

        /* 초기 설정 데이터를 조회한다. */
        vm.fn_initData();



        table01 =   $( "#table01" );

        /* 최초 5개의 레코드를 노출한다. */
        vm.fn_addRecords( 0, 5 );


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
        });


        /* table tr 에서 종목코드 change 시 레코드 초기화   */
        $('#table01 tbody').on('change', "input[name='F16316']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            vm.fn_resetErrorMessage();
            vm.fn_resetRecords( rowIndex );
            vm.fn_setTotalRecord();
        });        
    },



    methods: {

        fn_test: function() {
            this.$router.push( { path: "/Simulation/SimulationResult" }) ;
        },

        /*
         * 에러내용을 초기화 한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_resetErrorMessage : function() {
            var vm = this;

            vm.arr_show_error_message   =   [];
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

            var siga    = [ 101.00, 201.00, 301.00 ];
            var sigiTot = 603;
            var sameTot = 100;
            var len     =   3;


            table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                var tr = $(this);

                var v_text0         =   tr.find( "td:eq(0) .add_btn_span" ).text();         /* 첫번째 컬럼 */
                var v_F16316        =   tr.find( "td input[name=F16316]" ).val();           /* 종목코드 */
                var v_importance    =   tr.find( "td input[name=importance]" ).val();       /* 비중 */
                var v_jisu_rate     =   tr.find( "td:eq(5)" ).text();                       /* 지수적용비율 */

                if( typeof v_F16316 != "undefined" ) {

                    if( v_F16316 != "" ) {

                    }
                }
            });


            var result  =   vm.fn_temp( sigiTot, len, siga );
            //  vm.fn_temp( result, sameTot, len );
debugger;
        },

        fn_temp : function( tot=0, divide=1, rows=[] ) {

            var result = [];

            for( var i=0 ; i < divide; i++ ) {
                result.push( { rate : 0, money : 0 } );
            }            

            var imsi = Math.floor( parseFloat( tot / divide ) * 100 ) / 100;
       
            var sumData = 0;
            var sumTot = 0;

            for( var i in result) {
                imsi    =   Math.floor( parseFloat( rows[i] / tot ) * 100 * 100 ) / 100;

                sumTot  += rows[i];
                sumData = Math.floor( ( sumData * 100 ) +  parseFloat( imsi * 100 ) ) / 100

                result[i].rate      =   imsi;
                result[i].money    =   rows[i];
            }


            for( var i in result ) {
                sumData = Math.floor( ( sumData * 100 ) +  parseFloat( 0.01 * 100 ) ) / 100 ;

                result[i].rate  =   Math.floor( ( result[i] * 100 ) +  parseFloat( 0.01 * 100 ) ) / 100;
                if( sumData >= tot ) {
                    break;
                }
            }

            return  result;
debugger;            
/*
            for( var i in result) {
                sumData = Math.floor( ( sumData * 100 ) +  parseFloat( imsi * 100 ) ) / 100

                result[i].rate   =  imsi;
                if( sumData >= tot ) {
                    break;
                } 
            }

            var temp1 = Math.floor( (tot - sumData ) * 100 ) / 100;
            for( var i in result ) {
                sumData = Math.floor( ( sumData * 100 ) +  parseFloat( 0.01 * 100 ) ) / 100 ;

                result[i].rate   =   Math.floor( ( result[i] * 100 ) +  parseFloat( 0.01 * 100 ) ) / 100;
                if( sumData >= tot ) {
                    break;
                }
            }
*/            
        },

        /*
         * 상위 그룹정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_initGrpCd() {
            var vm = this;

            axios.post(Config.base_url + "/user/simulation/getInitGrpCd", {
                data: {}
            }).then( function(response) {
                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                        }
                    }else{
                        vm.arr_grp_cd   =   response.data.dataList;
                    }
                }
            });            
        },

        /*
         * next 시나리오명을 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getNextScenName() {
            var vm = this;

            axios.post(Config.base_url + "/user/simulation/getNextScenName", {
                data: {}
            }).then( function(response) {
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

            axios.post(Config.base_url + "/user/simulation/getInitData", {
                data: { arrComMstCd : arrComMstCd }
            }).then( function(response) {

                if (response && response.data) {
                    var arrMsg = ( response.data.arrMsg && response.data.arrMsg.length > 0 ? response.data.arrMsg : [] );

                    if (!response.data.result) {
                        if( arrMsg.length > 0 ) {
                            vm.arr_show_error_message.push( ...arrMsg );
                        }
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
                    }
                }
            });            
        },

        /*
         * 레코드를 추가한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_addRecords( rowIndex=0, addCount=1 ) {
            var vm  =   this;
            
            var trHtml      =   "";
            for( var i=1; i <= addCount; i++ ) {
                trHtml      +=  `<tr>`;

                trHtml      +=  `    <td>`;
                if( i == addCount ) {
                    trHtml      +=  `       <button class="btn_icon v-icon material-icons" name="btn_asset">add_circle_outline</button>`;
                }else{
                    trHtml      +=  `       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
                }
                trHtml      +=  `        <span class="add_btn_span">Asset` + (rowIndex+i) + `</span>`;
                trHtml      +=  `    </td>`;

                trHtml      +=  `    <td class="td_in_input">`;
                trHtml      +=  `        <input type="text"     name="F16316" class="txt_right wid150"  maxlength="15" value />`;
                trHtml      +=  `        <span>`;
                trHtml      +=  `            <button class="btn_icon v-icon material-icons"  name="btn_F16316_search" >search</button>`;
                trHtml      +=  `        </span>`;
                trHtml      +=  `    </td>`;

                trHtml      +=  `    <td class="txt_left"></td>`;
                trHtml      +=  `    <td class="txt_right"></td>`;
                trHtml      +=  `    <td class="txt_right">`;
                trHtml      +=  `        <input type="text"     name="importance" class="txt_right wid100"  maxlength="5" value /> %`;
                trHtml      +=  `    </td>`;
                trHtml      +=  `    <td class="txt_right"></td>`;
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

            tr.find( "td input[name=F16316]" ).val( "" );       /* 종목코드 */
            tr.find( "td:eq(2)" ).text( "" );                   /* 종목명 */
            tr.find( "td:eq(3)" ).text( "" );                   /* 시가총액 */

            tr.find( "td [name=importance]" ).val( "" );        /* 비중 */
            tr.find( "td:eq(5)" ).text( "" );                   /* 지수적용비율 */
        },

        /*
         * total 레코드를 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_setTotalRecord : function() {
            var vm = this;

            var totalRecord   =   {
                    tot_F16316      :   0           /* (합계) 시가총액 */
                ,   tot_importance  :   0           /* (합계) 비중 */
            };

            table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                var tr = $(this);

                var v_text0         =   tr.find( "td:eq(0) .add_btn_span" ).text();         /* 첫번째 컬럼 */
                var v_F16316        =   tr.find( "td input[name=F16316]" ).val();           /* 종목코드 */

                var v_F15028        =   tr.find( "td:eq(3)" ).text();                       /* 시가총액 */
                var v_importance    =   tr.find( "td input[name=importance]" ).val();       /* 비중 */
                var v_jisu_rate     =   tr.find( "td:eq(5)" ).text();                       /* 지수적용비율 */

                if( typeof v_F16316 != "undefined" ) {

                    if( v_F16316 != "" ) {
                        totalRecord.tot_F16316      =   Number( totalRecord.tot_F16316 ) + Number( v_F15028 );
                        totalRecord.tot_importance  =   ( ( Number( totalRecord.tot_importance ) * 100 ) + ( Number( v_importance ) * 100 ) ) / 100;
                    }
                }
            });


            table01.find( "tbody tr:last" ).each( function( inx, rowItem ) {
                var tr = $(this);

                tr.find( "td:eq(3)").text( totalRecord.tot_F16316 );        /* (합계) 시가총액 */
                tr.find( "td:eq(5)").text( totalRecord.tot_importance );    /* (합계) 비중 */
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
        fn_getSelectedItem: function( items, gubun ) {
            var vm = this;

            for( let i=0; i < items.length; i++ ) {

                /* 추가된 자산정보를 table 에 설정한다. */
                vm.fn_setMastRowData( vm.selectedRowIndex + i, items[i], gubun ).then( async function(e) {
                    if( e && e.result ) {
                        vm.fn_setTotalRecord();
                    }
                });
            }
        },

        /*
         * 추가된 자산정보를 table 에 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_setMastRowData: function( rowIndex=0, rowItem, gubun ) {
            var vm = this;


            var dataTrCnt   =   table01.find( "tbody tr" ).length - 1;
            if( rowIndex > dataTrCnt-1 ) {
                vm.fn_addRecords( dataTrCnt, 5 );
            }

            var tr;          

            return  new Promise(function(resolve, reject) {

            /* 한건씩 자산을 추가한다. */
                tr  =   table01.find( "tbody tr" ).eq( rowIndex );

                tr.find( "td input[name=F16316]" ).val( rowItem.F16012 );       /* 종목코드 */
                tr.find( "td:eq(2)" ).text( rowItem.F16002 );                   /* 종목명 */

                resolve( { result : true } );

            }).catch( function(e) {
                console.log( e );

                resolve( { result : false } );

            }).then( async function(e1) {

                if( e1 && e1.result ) {

                    return  await new Promise(function(resolve1, reject1) {

                    /* 선택된 종목의 구성정보를 조회한다. */
                        axios.post(Config.base_url + "/user/simulation/getJongmokInfo", {
                            data: { "F16012" : rowItem.F16012 }
                        }).then( function(response) {
                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.arr_show_error_message.push( msg );
                                    }

                                    resolve1( { result : false } );
                                }else{
                                    var jongmokInfo = response.data.jongmokInfo;
                                    
                                    if( !jongmokInfo || Object.keys( jongmokInfo ).length == 0 ) {
                                        jongmokInfo =   {};
                                    }

                                    if( jongmokInfo.F15028 ) {
                                        tr.find( "td:eq(3)" ).text( jongmokInfo.F15028 );               /* 시가총액 */

                                        tr.find( "td:eq(5)" ).text( rowIndex / 100 );                   /* 지수적용비율 */
                                    }
                                    resolve1( { result : true } );
                                }

                            }else{
                                resolve1( { result : false } );
                            }

                        }).catch( function(e) {
                            console.log( e );
                            resolve1( { result : false } );
                        });

                    }).catch( function(e1) {
                        console.log( e1 );
                        resolve1( { result : false } );
                    });
                }

            });
        },

        /*
         * 테이블 정보를 점검 후 list 에 저장한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_table2List() {
            var vm = this;

            var rowIndex = 1;

            vm.arr_portfolio    =   [];
            
            table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                var tr = $(this);

                var v_text0         =   tr.find( "td:eq(0) .add_btn_span" ).text();         /* 첫번째 컬럼 */
                var v_F16316        =   tr.find( "td input[name=F16316]" ).val();           /* 종목코드 */
                var v_importance    =   tr.find( "td input[name=importance]" ).val();       /* 비중 */
                var v_jisu_rate     =   tr.find( "td:eq(5)" ).text();                       /* 지수적용비율 */

                if( typeof v_F16316 != "undefined" ) {

                    if( v_F16316 != "" ) {

                        /* 종목코드가 존재시 비중정보 체크 */
                        try{
                            if( v_importance == "" ) {
                                vm.arr_show_error_message.push( "[포트폴리오] " + v_text0 + " 비중을 입력해 주세요." );
                            }else if( isNaN( v_importance ) ) {
                                vm.arr_show_error_message.push( "[포트폴리오] " + v_text0 + " 비중은 숫자만 입력해 주세요." );
                            }else if( Number( v_importance ) <= 0 ) {
                                vm.arr_show_error_message.push( "[포트폴리오] " + v_text0 + " 비중은 0 보다 큰수를 입력해 주세요." );
                            }
                        }catch( e ) {
                            vm.arr_show_error_message.push( "[포트폴리오] " + v_text0 + " 비중은 숫자만 입력해 주세요." );
                        }

                        vm.arr_portfolio.push({
                                "F16316"        :   v_F16316            /* 종목코드 */
                            ,   "importance"    :   v_importance        /* 비중 */
                            ,   "jisu_rate"     :   v_jisu_rate         /* 지수적용비율 */
                            ,   "order_no"      :   rowIndex++          /* 정렬 순번 */
                        });                        
                    }else{

                        /* 종목코드 없을시 비중을 입력한 경우 */
                        if( v_importance != "" ) {
                            vm.arr_show_error_message.push( "[포트폴리오] " + v_text0 + " 종목코드를 선택해주세요" );
                        }

                    }
                }
            });

            if( !vm.arr_show_error_message || vm.arr_show_error_message.length == 0  ) {
                if( !vm.arr_portfolio || vm.arr_portfolio.length == 0 ) {
                    vm.arr_show_error_message.push( "[포트폴리오] 종목코드가 한건 이상 존재해야 합니다." );
                    return  false;
                }
            }
        },        

        /*
         * 시뮬레이션 기본정보를 저장한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_saveBaicInfo() {
            var vm = this;

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

            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }  


            /* 테이블 정보를 점검 후 list 에 저장한다. */
            vm.fn_table2List();

            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }            

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

                        if( msg ) {
                            if ( await vm.$refs.confirm2.open(
                                    '확인',
                                    msg,
                                    {}
                                    ,1
                                )
                            ) {
                                if(vm.$refs.confirm2.val == 'Y') {
                                    return  false;
                                }
                            }
                        }
                    }
                }
            });            
        },

    }
};
</script>