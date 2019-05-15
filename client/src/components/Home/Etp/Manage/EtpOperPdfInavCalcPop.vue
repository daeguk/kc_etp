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
                        <v-list-tile-title class="sumu_text">Sumulation Mode</v-list-tile-title>
                        <v-list-tile-content class="sumul_btn_w">
                            <ul>
                                <li>
                                    <v-switch v-model="switch1" color="primary"></v-switch>
                                </li>
                                <li>
                                    <v-btn small flat icon>
                                        <v-icon class="btn_on">play_circle_outline</v-icon>
                                    </v-btn>
                                </li>
                                <li>
                                    <v-btn small flat icon>
                                        <v-icon>refresh</v-icon>
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
                                        <li>1235879665654411111</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">CU당 주식수</li>
                                        <li>4000</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">
                                            <b>iNAV 계산결과</b>
                                        </li>
                                        <li class="text_red">
                                            <b>12435.13</b>
                                            <br>
                                            <span class="float_r">0.56%</span>
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
                    <col width="12%">
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
            switch1: "",
            etpBasic : {}, 
            pdfList: null,
        };
    },
    mixins : [ nav_cal_common ],
    created: function() {
       
    },
    mounted: function() {

        /* [전체종목 -> ETF] 테이블 */
        pdf_table = $('#pdf_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            "scrollY":        '80vh',
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                 {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        if (data == 0) {
                            htm = '유가증권';
                        } else if (data == 1) {
                            htm = '코스닥';
                        } else if (data == 2) {
                            htm = '기타';
                        } else if (data == 3) {
                            htm = '채권';
                        } else if (data == 4) {
                            htm = '선물 및 옵션';
                        }
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        
                        htm += "<input type='text' class='txt_right' value='"+data+"'>";
                        
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
                    "targets": 5
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
        $('#pdf_table tbody').on('click', 'button', function () {
            var table = $('#pdf_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_faver') {
                console.log(data.faver_seq);
                //data.faver =  data.faver == '1' ? '0' : '1';

                if (data.faver == '1') {
                    data.faver = 0;
                    $(this).html("star_border");
                    vm.deleteItem(data, 'etf');
                } else {
                    data.faver = 1;
                    $(this).html("star");
                    vm.setSelectedItem(data, '1', 'etf');
                }
                //$(this).html("star_border");
                //etf_table.rows.add(etf_table.rows().data()).draw();
            } else if ($(this).attr('id') == 'btn_detail') {
                data.GUBUN= "1";
                vm.fn_detailPop( data );
            }
        });



        this.getiNavData();
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
            }).then(function(response) {

                if (response.data) {

                    vm.etpBasic = response.data.etpBasic;
                    vm.pdfList = response.data.pdfList;

                    var market_amt = 0;
                    var market_tot_amt = 0;
                    var pdfResults = [];
                    for (let item of vm.pdfList) {
                        
                        vm.iNavCalulator(item).then(function(market_amt) {
                            item.market_amt = market_amt;
                            market_tot_amt += market_amt;

                            debugger;
                            console.log("market_amt:"+market_amt);
                        }) ;

                        break;
                    }

                    pdf_table.clear().draw();
                    pdf_table.rows.add(vm.pdfList).draw();
                }
            });
        },        
        formatNumber:function(num) {
            return util.formatNumber(num);
        },

        fn_closePop() {
            var vm = this;

            vm.$emit("fn_closePop", "close");
        }
    }
};
</script>
