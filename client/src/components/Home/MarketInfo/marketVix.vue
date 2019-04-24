<template>
    <v-container>
        <v-layout row wrap class="content_margin">

            <!---테이블 start--->
            <v-flex v-for="item in ctg_results" :key="item.ctg_code"  grow xs12 mt-3>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                           {{item.ctg_name}}
                            <p>
                                Total
                                <span class="text_result" v-bind:id="table_name + '_count'+item.ctg_code">120</span> results
                                <span v-bind:id="table_name + '_date'+item.ctg_code">기준일 :2018.10.20</span>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table v-bind:id="table_name + item.ctg_code" class="tbl_type" style="width:100%">
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
            <!---테이블 end--->


            <!--rightmenu---->
            <v-card flat class="right_menu_w2">
                <v-navigation-drawer
                    v-model="drawer"
                    :mini-variant="mini"
                    app
                    right
                    light
                    clipped
                    mini-variant-width="50"
                    width="250"
                >
                    <v-list class="pa-1">
                        <v-list-tile v-if="mini">
                            <v-list-tile-action>
                                <v-btn icon @click.stop="mini = !mini">
                                    <v-icon>chevron_left</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile avatar tag="div">
                            <v-list-tile-content class="rightmenu_tit">Quick Start</v-list-tile-content>
                            <v-list-tile-content>
                                <v-btn icon @click.stop="mini = !mini">
                                    <v-icon>chevron_right</v-icon>
                                </v-btn>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>

                    <v-list class="pt-0" dense>
                        <v-list-tile-content class="rightmenu_con2 rightmenu_line">
                            <v-layout class="w100">
                                <v-flex xs12>
                                    <v-tabs v-model="tab" centered>
                                        <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                        <v-tab v-for="item in items1" :key="item">{{ item }}</v-tab>
                                    </v-tabs>

                                    <v-tabs-items v-model="tab">
                                        <v-tab-item>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                            <v-layout row class="w100 pt-2">
                                                <v-flex xs12>
                                                    <v-card flat>
                                                        <v-list two-line subheader>
                                                            <v-list-tile
                                                                v-for="item in items2"
                                                                :key="item.title"
                                                                @click
                                                                class="right_menu_w3"
                                                            >
                                                                <v-list-tile-content
                                                                    class="rm_con_h"
                                                                >
                                                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                                                    <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                                                                </v-list-tile-content>
                                                            </v-list-tile>
                                                        </v-list>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                        </v-tab-item>
                                        <v-tab-item>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                            <v-layout row class="w100 pt-2">
                                                <v-flex xs12>
                                                    <v-card flat>
                                                        <v-list two-line subheader>
                                                            <v-list-tile
                                                                v-for="item in items3"
                                                                :key="item.title"
                                                                @click
                                                                class="right_menu_w3"
                                                            >
                                                                <v-list-tile-content
                                                                    class="rm_con_h"
                                                                >
                                                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                                                    <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                                                                </v-list-tile-content>
                                                            </v-list-tile>
                                                        </v-list>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                            <!--오른쪽 메뉴 하단 리스트 영역 end--->
                                        </v-tab-item>
                                    </v-tabs-items>
                                </v-flex>
                            </v-layout>
                            <!---자산추가 팝업--->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-card flat>
                                        <v-dialog v-model="dialog" persistent max-width="500">
                                            <template v-slot:activator="{ on }">
                                                <v-btn outline small color="primary" dark v-on="on">
                                                    <v-icon small color="primary">add</v-icon>자산추가
                                                </v-btn>
                                            </template>
                                            <v-card>
                                                <h5>
                                                    <v-card-title ma-0>
                                                        비교자산추가
                                                        <v-spacer></v-spacer>
                                                        <v-btn icon dark @click="dialog = false">
                                                            <v-icon>close</v-icon>
                                                        </v-btn>
                                                    </v-card-title>
                                                </h5>
                                                <v-card-title>
                                                    <v-text-field
                                                        v-model="search"
                                                        append-icon="search"
                                                        label="Search"
                                                        single-line
                                                        hide-details
                                                    ></v-text-field>
                                                </v-card-title>

                                                <!--비교자산 탭--->

                                                <v-layout row wrap>
                                                    <v-flex xs12>
                                                        <v-tabs
                                                            fixed-tabs
                                                            color="cyan"
                                                            dark
                                                            v-model="tab2"
                                                        >
                                                            <v-tabs-slider color="#00fffc"></v-tabs-slider>
                                                            <v-tab
                                                                v-for="item in items4"
                                                                :key="item"
                                                            >{{ item }}</v-tab>
                                                        </v-tabs>
                                                        <!--v-tabs-items v-model="tab2">
                                                                        <v-tab-item>
                                                                            <infopoptab1></infopoptab1>
                                                                        </v-tab-item>
                                                                        <v-tab-item>
                                                                            <infopoptab2></infopoptab2>
                                                                        </v-tab-item>
                                                                        <v-tab-item>
                                                                            <infopoptab3></infopoptab3>
                                                                        </v-tab-item>
                                                        </v-tabs-items-->
                                                    </v-flex>
                                                </v-layout>
                                                <!--비교자산 탭end--->
                                            </v-card>
                                            <v-card class="pop_btn_w text-xs-center">
                                                <v-btn
                                                    depressed
                                                    color="primary"
                                                    @click="dialog = false"
                                                >추가하기</v-btn>
                                            </v-card>
                                        </v-dialog>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                            <!--자산추가 팝업 end--->
                        </v-list-tile-content>
                    </v-list>
                </v-navigation-drawer>
            </v-card>
            <!--rightmenu end--->
        </v-layout>
    </v-container>
</template>

<script>
//import infopoptab1 from "../index/manage/infopoptab1.vue";
//import infopoptab2 from "../index/manage/infopoptab2.vue";
//import infopoptab3 from "../index/manage/infopoptab3.vue";
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";
var importance_grid = null;

export default {
    props: [],
    data() {
        return {
            dialog: false,
            mini: false,
            right: null,
            results: [],
            tab: null,
            tab2: null,
            drawer: "",
            search: "",
            items1: ["전체", "시장대표"],
            items: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            items2: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                },
                {
                    title: "KODEX 코스닥150 레버러지",
                    subtitle: "122630"
                }
            ],
            items3: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                }
            ],
            items4: ["ETF", "ETN", "INDEX"],

            table_name : "vix",
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
         orderedData : function(){
           
            return _.orderBy(this.carousel_mod, 'ctg_code', 'asc');
        }
    },
    mounted: function() {
        this.getEtpList( "008" );      /* 008-VIX */
    },
    created: function() {},
    beforeDestroy() {},
    methods: {

        getData: function(carousel_data, n, x, dataKind) {

            if (carousel_data[(((n-1)* this.carousel_info.carousel_div )+x-1)]) {
                return carousel_data[(((n-1)* this.carousel_info.carousel_div)+x-1)][ dataKind ];
            } else {
                return "";
            }
        },        

        /*
         * 시장대표에 해당하는 지수 및 ETP 정보를 조회한다. ( ETP -> 시장대표 탭 선택시 )
         * 2019-04-16  bkLove(촤병국)
         */        
        getEtpList: function( ctg_large_code ) {
            console.log("getEtpList");

            var vm = this;
            var idx = 0;    

            axios.post(Config.base_url + "/user/marketinfo/getEtpList", {
                data: {
                    "ctg_large_code"    :   ctg_large_code
                }
            }).then(function(response) {
                console.log(response);

                if( response.data ) {
                    var etpLists = response.data.etpLists;
                    vm.carousel_data = response.data.carousel_data;
                    vm.carousel_mod = response.data.carousel_mod;
                    vm.ctg_results = response.data.ctgCodeList;
                    vm.carousel_info = response.data.carousel_info;

                    var items = null;

                    for (let ctgCodeItem of vm.ctg_results) {

                        vm.$nextTick().then(() => {
                            items = etpLists[idx++];
                            $('#' + vm.table_name + ctgCodeItem.ctg_code).DataTable( {
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
                                                htm += "            <br>"+row.f16013;
                                                if (row.NEW_YN == "Y") {
                                                    htm += "<span><div class='text_new'>new</div></span>";
                                                }
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
                            if (items) {
                                $("#" + vm.table_name + "_count" + ctgCodeItem.ctg_code).html(items.length);
                                $("#" + vm.table_name + "_date"  + ctgCodeItem.ctg_code).html("기준일 :"+items[0].f12506);
                            }

                            // 테이블별 이벤트
                            $('#' + vm.table_name + ctgCodeItem.ctg_code+' tbody').on('click', 'button', function () {
                                var table = $('#' + vm.table_name + ctgCodeItem.ctg_code).DataTable();
                                var data = table.row($(this).parents('tr')).data();

                                if ($(this).attr('id') == 'detail') {
                                    console.log('move detailPage ');
                                    vm.movePage( data );
                                } else {
                                    console.log('move pdfPage ');
                                }
                                    
                            });
                            
                        });
                    }
                }
            });
        },

        movePage: function( data ) {

            this.$router.push({ 
                    path    :   '/etp/etpManageDetail'
                ,   query   :   { 
                            'f16012'    :   data.f16012        /* 국제표준코드  */
                        ,   'f16257'    :   data.f16257        /* ETP기초지수코드  */
                        ,   'f34239'    :   data.f34239        /* ETP기초지수MID  */
                    } 
            });
        }        
    }
};
</script>
