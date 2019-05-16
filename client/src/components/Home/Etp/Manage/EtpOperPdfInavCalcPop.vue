<template>
    <v-dialog v-model="showDialog" persistent max-width="750">
        <v-card>
            <h5>
                <v-card-title ma-0>
                    ETF iNAV Realtime Calculator
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="fn_closePop">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
            </h5>

            <div class="ETPInavpop1">
                <v-list subheader>
                    <h6>
                        {{etpBasic.f16002}} <span>{{etpBasic.f16012}}</span>
                    </h6>

                    <v-list-tile>
                        <v-list-tile-title class="sumu_text">Simulation Mode</v-list-tile-title>
                        <v-list-tile-content class="sumul_btn_w">
                            <ul>
                                <li>
                                    <v-switch v-model="SimulationSwitch" v-on:change="SimulationMode" color="primary"></v-switch>
                                </li>
                                <li>
                                    <v-btn small flat icon>
                                        <v-icon :class="btn_class" v-on:click="startStop">{{btn_kind}}</v-icon>
                                    </v-btn>
                                </li>
                                <li>
                                    <v-btn small flat icon>
                                        <v-icon v-on:click="getiNavData(etpBasic.f16012)">refresh</v-icon>
                                    </v-btn>
                                </li>
                            </ul>
                        </v-list-tile-content>

                    </v-list-tile>
                </v-list>
            </div>

            <div class="sumul_w">
                <v-card flat class="sumul_card_w">
                    <v-layout>
                        <v-flex xs12>
                            <v-layout>
                                <v-flex xs6 class="sumul_card_line">
                                    <ul>
                                        <li class="list_tit">산출방식</li>
                                        <li>{{etpBasic.f33929 == '0' ? 'PDF' : '지수수익율'}}</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">전일NAV</li>
                                        <li>{{formatNumber(etpBasic.f03329)}}</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">
                                            <b>iNAV</b>
                                            <br>
                                            <span>외부공표</span>
                                        </li>
                                        <li class="text_red" v-if="etpBasic.f30818 >= 0">                                        
                                            <b>{{formatNumber(etpBasic.f15301)}}</b>
                                            <br>
                                            <span class="float_r">{{formatNumber(etpBasic.f30818)}}</span>
                                        </li>
                                        <li class="text_blue" v-if="etpBasic.f30818 < 0">                                        
                                            <b>{{formatNumber(etpBasic.f15301)}}</b>
                                            <br>
                                            <span class="float_r">{{formatNumber(etpBasic.f30818)}}</span>
                                        </li>
                                    </ul>
                                </v-flex>
                                <v-flex xs6>
                                    <ul>
                                        <li class="list_tit">CU시가총액</li>
                                        <li>{{formatNumber(market_tot_amt)}}</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">CU당 주식수</li>
                                        <li>{{formatNumber(etpBasic.f16499)}}</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">
                                            <b>iNAV 계산결과</b>
                                        </li>
                                        <li class="text_red">
                                            <b>{{formatNumber(iNav_amt)}}</b>
                                            <br>
                                            <span class="float_r">{{formatNumber(iNav_percent)}}%</span>
                                        </li>
                                    </ul>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </div>
            <!--pdf table-->

            <h4>
                {{etpBasic.f33929 == '0' ? 'PDF' : '지수수익율'}} <span>{{etpBasic.f12506}}</span>
            </h4>

            <table id="pdf_table" class="tbl_type" style="width:100%">
                <colgroup>
                    <col width="8%">
                    <col width="15%">
                    <col width="15%">
                    <col width="15%">
                    <col width="7%">
                    <col width="10%">
                    <col width="10%">
                    <col width="16%">
                </colgroup>
                <thead>
                    <tr>
                        <th class="txt_left">분류</th>
                        <th class="txt_left">코드</th>
                        <th>종목</th>
                        <th class="txt_right">CU수량</th>
                        <th class="txt_right">비중</th>
                        <th class="txt_right">현재가</th>
                        <th class="txt_right">기준가</th>
                        <th class="txt_right">CU시가총액</th>
                    </tr>
                </thead>
                
            </table>

            <!--pdf table end-->
            <v-card class="pop_bot_h"></v-card>
        </v-card>
    </v-dialog>
</template>



<script>


import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config from "@/js/config.js";
import util       from "@/js/util.js";
import { nav_cal_common } from '@/js/common/mixins/mixins_nav_cal.js';

var pdf_table = null;
export default {
    props: ["showDialog", "paramData" ],
    data() {
        return {
            SimulationSwitch: false,
            etpBasic : {}, 
            pdfList: null,
            market_tot_amt: 0,    
            iNav_amt: 0,
            iNav_percent: 0,
            nav_timer: null,
            btn_class: 'btn_on',
            btn_kind: 'play_circle_outline'         
        };
    },
    mixins : [ nav_cal_common ],
    created: function() {
       
    },
    mounted: function() {
        var vm = this;
        /* [전체종목 -> ETF] 테이블 */
        pdf_table = $('#pdf_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            "scrollY":        '40vh',
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                 {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        if (data == 0) {
                            htm = 'KSP';
                        } else if (data == 1) {
                            htm = 'KSQ';
                        } else if (data == 2) {
                            htm = '기타';
                        } else if (data == 3) {
                            htm = '채권';
                        } else if (data == 4) {
                            htm = '파생';
                        }
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        
                        htm += "<input type='text' id='cu_cnt' class='txt_right' value='"+data+"'>";
                        
                        return htm;
                    },
                    "targets": 3
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = ""
                            
                        htm = util.formatNumber(data);

                        return htm;
                    },
                    "targets": [5, 7]
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = ""
                            
                            htm = util.formatNumber(data);

                            if (row.f15004 >= 0) {
                                htm += "<br><span class='text_S text_red'>"+row.f15004+"%</span>";
                            } else {
                                htm += "<br><span class='text_S text_blue'>"+row.f15004+"%</span>";
                            }

                            return htm;
                            },
                    "targets": 6
                },
                
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "f33861", "orderable": true},  /* 분류 */
                { "data": "f16316", "orderable": true, className:"txt_left" }, /*코드*/
                { "data": "f16002", "orderable": true}, /*종목*/
                { "data": "f16499", "orderable": true, defaultContent:""}, /*cu 수량*/
                { "data": "f34743", "orderable": true, className:"txt_right" }, /*비중*/
                { "data": "f15001", "orderable": true, className:"txt_right" }, /*현재가*/
                { "data": "f15007", "orderable": true, className:"txt_right" }, /*기준가*/
                { "data": "market_amt", "orderable": true, className:"txt_right" }, /*CU시가총액*/
            ]
        });


        //  ETF 에서 그래프 선택시
        $('#pdf_table tbody').on('change', 'input', function () {            
            var table = $('#pdf_table').DataTable();
            var data = table.row($(this).parents('td').parents('tr')).data();


            data.f16499 = $(this).val();

            vm.navCalcu();
            
        });



        vm.getiNavData();
    },
    methods: {
        
        /*
         * ETP iNAV 계산기 데이터를 조회한다.
         */
        getiNavData(f16012) {
            var vm = this;

            console.log( "EtpOperPdfInavCalcPop.vue -> getiNavData" );

            axios.get( Config.base_url + "/user/etp/getiNavData", {
                params: {
                    f16012 : 'KR7322410002',
                }
            }).then(async function(response) {

                if (response.data) {

                    vm.etpBasic = response.data.etpBasic;
                    vm.pdfList = response.data.pdfList;

                    var market_amt = 0;
                    var market_tot_amt = 0;
                    var index = 0;
                    for (let item of vm.pdfList) {                        
                        await vm.iNavCalulator(item).then(function(market_amt) {
                            item.market_amt = market_amt;
                            market_tot_amt += market_amt;

                            if (index == (vm.pdfList.length-1)) {                                
                                vm.pdf_reload(vm.pdfList);                                                        
                                vm.market_tot_amt = market_tot_amt;

                                /*INav 계산 : CU시가총액 / CU당 주식수*/
                                if (vm.etpBasic.f16499 > 0) {
                                    vm.iNav_amt = vm.market_tot_amt / vm.etpBasic.f16499;
                                } else {
                                    vm.iNav_amt = vm.market_tot_amt;
                                }
                                /* INav 등락률 */
                                vm.iNav_percent =  (vm.iNav_amt / vm.etpBasic.f03329 - 1);

                                /* input box readony 처리 */
                                if (!vm.SimulationSwitch) {
                                    $('#pdf_table tbody td input[id=cu_cnt]').attr("readonly", true);
                                }
                            }
                            //console.log("market_amt:"+market_amt + "idx:" + index + "lenght:" + (vm.pdfList.length-1));     
                            
                            index++;
                        });                        
                    }
                }
            });
        },        

        pdf_reload: function() {
            pdf_table.clear().draw();
            pdf_table.rows.add(this.pdfList).draw();
        },
        formatNumber:function(num) {
            return util.formatNumber(num);
        },

        /* 반복 계산 시작 및 스톱처리 */
        startStop: function() {            
            if (this.nav_timer == null) {   
                this.startLoopCalcu();      
            } else {
                this.stopLoopCalcu();
            }
        },

        /* 반복 계산 */
        startLoopCalcu: function() {
            if (this.nav_timer == null) {                
                this.btn_kind = 'pause_circle_outline'
                this.nav_timer = setInterval(this.navCalcu, 10000);
            }
        },
        /* 반복 계산 스톱*/
        stopLoopCalcu: function() {
            if (this.nav_timer != null) {
                this.btn_kind = 'play_circle_outline'
                clearInterval(this.nav_timer);
                this.nav_timer = null;
            }
        },
       
        /* Inav 계산 처리 */
        async navCalcu() {
            var vm = this;
            var market_amt = 0;
            var market_tot_amt = 0;
            var index = 0;
            for (let item of vm.pdfList) {                        
                await vm.iNavCalulator(item).then(function(market_amt) {
                    item.market_amt = market_amt;
                    market_tot_amt += market_amt;

                    if (index == (vm.pdfList.length-1)) {                                
                        vm.pdf_reload(vm.pdfList);
                        vm.market_tot_amt = market_tot_amt;

                        /*INav 계산 : CU시가총액 / CU당 주식수*/
                        if (vm.etpBasic.f16499 > 0) {
                            vm.iNav_amt = vm.market_tot_amt / vm.etpBasic.f16499;
                        } else {
                            vm.iNav_amt = vm.market_tot_amt;
                        }
                        /* INav 등락률 */
                        vm.iNav_percent =  (vm.iNav_amt / vm.etpBasic.f03329 - 1);
                    }
                            //console.log("market_amt:"+market_amt + "idx:" + index + "lenght:" + (vm.pdfList.length-1));     
                            
                    index++;
                });                        
            }
        },

        SimulationMode: function() {
            if (this.SimulationSwitch) {
                $('#pdf_table tbody td input[id=cu_cnt]').attr("readonly", false);
            } else {
                $('#pdf_table tbody td input[id=cu_cnt]').attr("readonly", true);
            }
        },
        fn_closePop() {
            var vm = this;            
            vm.stopLoopCalcu();
            vm.$emit("fn_closePop", "close");
        }, 

        
    }
};
</script>
