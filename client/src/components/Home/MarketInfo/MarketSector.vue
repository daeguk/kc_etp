<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex xs12>
                <v-carousel  light hide-delimiters height="250px" interval="10000">
                    <v-carousel-item  class="bg_W market_layout_w" v-for="n in carousel_info.carousel_cnt" :key="n">

                        <v-layout class="market_card_layout">
                            <v-flex  v-for="x in 5" :key="x">
                                <v-card flat>
                                    <div class="market_card_w line_l">
                                        <div class="market_card2" wrap>
                                            <h6>{{carousel_data[(((n-1)*5)+x-1)].name}}</h6>
                                            <ul>
                                                <li>
                                                    <dl> 
                                                        <dt>총규모</dt>
                                                        <dt class="txt_num text_result2">{{new Intl.NumberFormat().format((carousel_data[(((n-1)*5)+x-1)].total_amt) / 1000)}}K</dt>
                                                    </dl>
                                                </li>
                                                <li> <dl> 
                                                        <dt>ETF - {{carousel_data[(((n-1)*5)+x-1)].etf_cnt}}종목</dt>
                                                        <dt>ETN - {{carousel_data[(((n-1)*5)+x-1)].etn_cnt}}종목</dt>
                                                    </dl>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>                           
                        </v-layout>
                    </v-carousel-item>
                    <v-carousel-item  class="bg_W" v-if="Object.keys(carousel_mod).length > 0">
                        <v-layout class="market_card_layout" >
                            <v-flex v-for="mod_item in carousel_mod" :key="mod_item.name">
                                <v-card flat>
                                    <div class="market_card_w line_l">
                                        <div class="market_card2" wrap>
                                            <h6> {{mod_item.name}} </h6>
                                            <ul>
                                                <li>
                                                    <dl> 
                                                        <dt>총규모</dt>
                                                        <dt class="txt_num text_result2">{{new Intl.NumberFormat().format((mod_item.total_amt) / 1000)}}K</dt>
                                                    </dl>
                                                </li>
                                                <li> <dl> 
                                                        <dt>ETF - {{mod_item.etf_cnt}}종목</dt>
                                                        <dt>ETN - {{mod_item.etn_cnt}}종목</dt>
                                                    </dl>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
            <!---테이블1--->
            
            <v-flex v-for="item in ctg_results" :key="item.ctg_code"  grow xs12 mt-3>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                           {{item.ctg_name}}
                            <p>
                                Total
                                <span class="text_result" v-bind:id="'sec_count'+item.ctg_code">120</span> results
                                <span v-bind:id="'sec_date'+item.ctg_code">기준일 :2018.10.20</span>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table v-bind:id="'sector'+item.ctg_code" class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="15%">
                                <col width="10%">
                                <col width="15%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>종목</th>
                                    <th>INAV</th>
                                    <th>전일최종NAV</th>
                                    <th>추적오차율</th>
                                    <th>괴리율</th>
                                    <th>기초지수</th>
                                    <th>지수현재가</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                    </v-card>
                </v-card>
            </v-flex>
            <!---테이블1 end--->

        </v-layout>
    </v-container>
</template>

<script>

import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";

import Config       from "@/js/config.js"


export default {
    props: [],
    data() {
        return {
            ctg_results: [],
            carousel_info:[],
            carousel_data:[],
            carousel_mod:[],            
        };
    },
    components: {
        //infopoptab1: infopoptab1,
        //infopoptab2: infopoptab2,
        //infopoptab3: infopoptab3
    },
    computed: {
    },
    mounted: function() {
        var vm = this;
        vm.getSectorEtpList();
        
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
        getSectorEtpList: function() {
            console.log("getSectorEtpList");
            var vm = this;

            axios.get(Config.base_url + "/user/marketinfo/getSectorEtpList", {
                    params: {
                        "ctg_code" : "002"
                    }
            }).then(function(response) {
                console.log(response);
                if (response.data.success == false) {
                    alert("해당 종목이 없습니다");
                } else {
                    var etpLists = response.data.etpLists;
                    vm.carousel_data = response.data.carousel_data;
                    vm.carousel_mod = response.data.carousel_mod;
                    vm.ctg_results = response.data.ctgCodeList;
                    vm.carousel_info = response.data.carousel_info;


                    
                    var items = null;

                    var index = 0;
                    for (let ctgCodeItem of vm.ctg_results) {

                        items = etpLists[index];
                        
                        vm.$nextTick().then(() => {
                            $('#sector'+ctgCodeItem.ctg_code).DataTable( {
                                    "processing": true,
                                    "serverSide": false,
                                    "info": false,   // control table information display field
                                    "stateSave": true,  //restore table state on page reload,
                                    "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                    
                                    select: {
                                        style:    'single',
                                        selector: 'td:first-child'
                                    },
                                    paging: false,
                                    searching: false,
                                    data : items,                            
                                    "columnDefs": [
                                        {  
                                            "render": function ( data, type, row ) {
                                                let htm = "<span>";
                                                htm += "           <b>"+data+"</b>";
                                                htm += "            <br>"+row.f16013+" <span><div class='text_new'>new</div></span>";
                                                htm += "        </span>";
                                                return htm;
                                            },
                                            "targets": 0
                                        },
                                        {  
                                            "render": function ( data, type, row ) {
                                                let htm = ""
                                                if (row.f15004 >= 0) {
                                                    htm = "<span class='align_r text_red'>"+data;
                                                } else {
                                                    htm = "<span class='align_r text_blue'>"+data;
                                                }
                                                htm += "<br><span class='text_S'>"+row.f30818+"%</span>";
                                                htm += "   </span>";
                                                return htm;
                                            },
                                            "targets": 1
                                        },
                                        {  
                                            "render": function ( data, type, row ) {
                                                let htm = ""
                                                if (row.f15004 >= 0) {
                                                    htm = "<span class='align_r text_red'>"+data;
                                                } else {
                                                    htm = "<span class='align_r text_blue'>"+data;
                                                }
                                                htm += "<br><span class='text_S'>"+row.f15004+"%</span>";
                                                htm += "   </span>";
                                                return htm;
                                            },
                                            "targets": 6
                                        },
                                        {
                                            "render": function ( data, type, row ) {
                                                let htm = "<div class='tooltip'><button type='button' id='detail' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:70px;'>지수정보</span></div>";
                                                htm += "<div class='tooltip'><button type='button' id='pdf' class='btn_icon v-icon material-icons'>picture_as_pdf</button><span class='tooltiptext' style='width:70px;'>PDF관리</span></div>";
                                                return htm;
                                            },
                                            "targets": 7
                                        }
                                    ],
                                    columns: [
                                        { "data": "f16002", "orderable": true, className:"txt_left line2"}, /*종목*/
                                        { "data": "f15301", "orderable": true }, /*INAV*/
                                        { "data": "f03329", "orderable" : true}, /*전일최종Nav*/
                                        { "data": "f15302", "orderable" : true}, /*추적오차율*/
                                        { "data": "f15304", "orderable" : true}, /*괴리율*/
                                        { "data": "f34777", "orderable" : true}, /*기초지수*/
                                        { "data": "f15001", "orderable" : true}, /*지수현재가*/
                                        { "data": null, "orderable" : true, defaultContent:""},
                                    ]
                            }); 

                            // ETP 갯수와 기준일 바인딩 
                            $("#sec_count"+ctgCodeItem.ctg_code).html(items.length);
                            $("#sec_date"+ctgCodeItem.ctg_code).html("기준일 :"+items[0].f12506);

                            // 테이블별 이벤트
                            $('#sector'+ctgCodeItem.ctg_code+' tbody').on('click', 'button', function () {
                                var table = $('#sector'+ctgCodeItem.ctg_code).DataTable();
                                var data = table.row( this ).data();    
                                if ($(this).attr('id') == 'detail') {
                                    
                                    console.log('move detailPage ');
                                } else {
                                    console.log('move pdfPage ');
                                }
                                    
                            });
                            index++;
                        });
                    }

                }
            });  
        },
        
    }
};
</script>
