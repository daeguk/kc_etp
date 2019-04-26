<template>
    <v-container fluid grid-list-md pa-0 mb-4>
        <v-layout row wrap>
            <v-flex xs12 flat>
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Performance</h4>

                <!---performance chart 정보 START--->
                    <div
                        id="etp_comboChart_div"
                        class="graph_01"
                        style="height:300px;background-color:#f6f6f6;"
                    ></div>
                <!---performance chart 정보 END--->

                    <v-card flat>

                <!---performance table 정보 START--->
                        <table v-bind:id="tableName" class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="30%">
                                <col width="9%">
                                <col width="9%">
                                <col width="9%">
                                <col width="9%">
                                <col width="9%">
                                <col width="9%">
                                <col width="9%">
                                <col width="7%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>{{ this.nowDate }} (%)</th>
                                    <th>1-Week</th>
                                    <th>1-Month</th>
                                    <th>3-Month</th>
                                    <th>1-Year</th>
                                    <th>3Year</th>
                                    <th>5Year</th>
                                    <th>10-Year</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                <!---performance table 정보 END--->

                    </v-card>

                <!---자산추가 팝업 START--->
                    <v-layout row>
                        <v-btn outline small color="primary" dark v-on:click="showJongMokPop">
                            <v-icon small color="primary">add</v-icon>자산추가
                        </v-btn>
                        <jongmokPopup @selectedItem="getSelectedItem" @hideJongMokPop="hideJongMokPop" :showDialog="jongMokDialog"></jongmokPopup>
                    </v-layout>
                <!--자산추가 팝업 END--->

                </div> 
            </v-flex>
            
            <v-flex xs12 flat>
                <!---비중정보 팝업--->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">포트폴리오</h4>
                    <v-subheader>
                        TOP10 비중정보
                        <v-dialog v-model="dialog2" persistent max-width="500">
                            <template v-slot:activator="{ on }">
                                <v-btn outline small color="primary" dark v-on="on">VIEW ALL</v-btn>
                            </template>
                            <v-card>
                                <h5>
                                    <v-card-title ma-0>
                                        종목 비중정보 (KODEX 200)
                                        <v-spacer></v-spacer>
                                        <v-btn icon dark @click="dialog2 = false">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>
                                <div class="index3pop2_con">
                                    <v-list subheader two-line>
                                        <!--v-list-tile>
                                            <v-list-tile-title>Last Updated</v-list-tile-title>
                                            <v-list-tile-content>Notifications</v-list-tile-content>
                                        </v-list-tile-->
                                        <v-list-tile>
                                            <v-list-tile-title>Total</v-list-tile-title>
                                            <v-list-tile-content>{{importance_cnt}}</v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </div>
                                <v-card flat>
                                    <table id="importance_grid" class="display" style="width:100%">
                                        <thead>
                                            <tr>
                                                <th>CODE</th>
                                                <th>종목지수명</th>
                                                <th>비중</th>
                                                <th>구분</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </v-card>
                                <v-card class="pop_bot_h"></v-card>
                            </v-card>
                        </v-dialog>
                    </v-subheader>
                    <div class="graph_02_w" id="importance_chart"></div>
                    <v-card flat></v-card>
                </div>
                <!---비중정보 팝업end-->
            </v-flex>

            <v-flex xs12></v-flex>
        </v-layout>

    </v-container>
</template>


<script>
import jongmokPopup from "@/components/common/popup/jongmokPopup";
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";

var importance_grid = null;
var table01 = null;
var chart01 = null;

export default {
    data() {
        return {
            tab: null,
            items: ["ETF", "ETN", "INDEX"],
            jongMokDialog: false,
            dialog2: false,
            results: [],
            importance_cnt: 0,
            search: "",

            modalFlag: false,

            tableName : "tblEtp",
            nowDate:        new Date().getFullYear() 
                        +   "." 
                        +   (parseInt(new Date().getMonth()) + 1) 
                        +   "." 
                        +   new Date().getDate(),

            jongmokPopYn        :   false,
            basicData           :   {
                arrNavPriceGubun    :   [],
            },
            arrEtpPerformance   :   [],
            arrIndexPerformance :   []
        };
    },
    components: {
        jongmokPopup: jongmokPopup, 
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        /*        
        var vm = this;

        vm.$root.$infopoptab1 = vm.$refs.$infopoptab1;
        vm.getIndexImportanceList();

        $('#perf_table, tbody').on('click', 'button', function () {
            var data = perf_table.row($(this).parents('tr')).remove().draw();
        });

        perf_table = $('#perf_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "search": true,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        if (data) {
                            return "<img src='/assets/img/icon_bar01.png'><span>&nbsp;&nbsp;&nbsp;" + data + "</span>";
                        } else {
                            return "";
                        }
                    },
                    "targets": 1
                },
                {
                    "targets": [ 0 ],
                    "visible": false
                },
                {  
                    "render": function ( data, type, row ) {
                        if (data) {
                            // 기본 지수는 삭제 버튼 제외
                            if (row.F16013 != vm.$route.query.jisu_cd) {
                                return "<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>delete</button><span class='tooltiptext' style='width:40px;'>삭제</span></div>";
                            } 
                        } else {
                            return "";
                        }
                    },
                    "targets": 10
                },                
            ],
            data : [],
            columns: [
                { "data": "F16013", "orderable": false}, 
                { "data": "F16002", "orderable": false,  "width":"30%", className: 'txt_left line2'}, 
                { "data": "Week1", "orderable": false, className: 'dt-body-right'},
                { "data": "Month1", "orderable": false, className: 'dt-body-right'},
                { "data": "Month3", "orderable": false, className: 'dt-body-right'},
                { "data": "YTD", "orderable": false, className: 'dt-body-right'},
                { "data": "Year1", "orderable": false, className: 'dt-body-right'},
                { "data": "Year3", "orderable": false, className: 'dt-body-right'},
                { "data": "Year5", "orderable": false, className: 'dt-body-right'},
                { "data": "Year10", "orderable": false, className: 'dt-body-right'},
                {"data": null, "align":"center", className: 'dt-body-center', defaultContent:""}
            ]
        }); 
    

        vm.getIndexAnalysisInfo();
*/
        var vm = this;

        chart01 = new google.visualization.ComboChart( document.getElementById("etp_comboChart_div") );

        vm.basicData.f16012     =   vm.$route.query.f16012;     /* 국제표준코드 */
        vm.basicData.f16257     =   vm.$route.query.f16257;     /* ETP기초지수코드 */
        vm.basicData.f34239     =   vm.$route.query.f34239;     /* ETP기초지수MID */
        
        vm.basicData.arrNavPriceGubun     =   [ "PRICE", "NAV"];

        google.charts.setOnLoadCallback(function() {
            chart01.clearChart();
        });        

        /* ETP performance 정보를 조회한다. */
        this.fn_getEtpPerformance(); 

        /* 테이블 렌더링 */
        this.$nextTick().then(() => {

            table01 =  $("#" + vm.tableName ).DataTable({
                processing: true,
                serverSide: false,
                info: false, // control table information display field
                stateSave: true, //restore table state on page reload,
                lengthMenu: [
                    [10, 20, 50, -1],
                    [10, 20, 50, "All"]
                ],

                select: {
                    style: "single",
                    selector: "td:first-child"
                },
                paging: false,
                searching: false,
                data: [],
                ordering: false,
                columnDefs: [                   
                    {  
                        "targets": 0,
                        "render": function ( data, type, row ) {
                            if (data) {

                               if( row.etpIndexGubun == "ETP" ) {
                                    var  html = "";

                                    html +=  "<img src='/assets/img/icon_bar01.png'>";
                                    html +=  "<span>"
                                    html +=     "&nbsp;&nbsp;&nbsp;";
                                    html +=     data;
                                    html +=     "<br>";
                                    html +=     "&nbsp;&nbsp;&nbsp;";
                                    html +=     "(" + row.navPriceGubun + ")";
                                    html +=  "</span>";

                                    return html;
                                }else{
                                    return "<img src='/assets/img/icon_bar01.png'><span>&nbsp;&nbsp;&nbsp;" + data + "</span>";
                                }
                                
                            } else {
                                return "";
                            }
                        },
                    },

                    {  
                        "targets": 8,
                        "render": function ( data, type, row ) {
                            if (data) {
                                if ( row.delAbleYn == "Y" ) {
                                    return "<div class='tooltip'><button id='btnDelete' type='button' class='btn_icon v-icon material-icons'>delete</button><span class='tooltiptext' style='width:40px;'>삭제</span></div>";
                                }else{
                                    return "";
                                }
                            } else {
                                return "";
                            }
                        },
                    }, 

                ],
                columns: [
                    { "data": "f16002"      , "orderable" : false , className: "txt_left line2"  },    /* 한글 종목명 */
                    { "data": "week1_price" , "orderable" : false , className: 'dt-body-right'   },    /* 1-week */
                    { "data": "month1_price", "orderable" : false , className: 'dt-body-right'   },    /* 1-Month */
                    { "data": "month3_price", "orderable" : false , className: 'dt-body-right'   },    /* 3-Month */
                    { "data": "year1_price" , "orderable" : false , className: 'dt-body-right'   },    /* 1-Year */
                    { "data": "year3_price" , "orderable" : false , className: 'dt-body-right'   },    /* 3-Year */
                    { "data": "year5_price" , "orderable" : false , className: 'dt-body-right'   },    /* 5-Year */
                    { "data": "year10_price", "orderable" : false , className: 'dt-body-right'   },    /* 10-Year */
                    { "data": null          , "orderable" : false , className: 'dt-body-center', defaultContent:"", "align":"center" }
                ]
            });


            // 테이블별 이벤트
            $('#' + vm.tableName + ' tbody').on('click', 'button', function () {
                var table = $('#' + vm.tableName ).DataTable();
                var data = table.row($(this).parents('tr')).data();

                if ($(this).attr('id') == 'btnDelete') {
                    vm.fn_deleteTableData( $(this), data );
                }
                    
            });
        });

    },
    methods: {

        /*
         * Performance 테이블에서 삭제버튼을 누를시 수행한다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_deleteTableData : function( pThis, rowData ) {
            console.log("fn_deleteTableData");

            var vm = this;

            if( table01 ) {
                table01.clear().draw();
            }            

            /* 초기데이터 유무가 Y 인 경우 */
            if( rowData.initYn  === "Y" ) {

                /* ETP/INDEX 구분 이 'ETP' 인 경우 */
                if( rowData.etpIndexGubun   === "ETP" ) {

                    var selData =   vm.basicData.arrNavPriceGubun.filter( function(item) {
                        return  rowData.navPriceGubun   === item;           /* NAV/PRICE 구분 이 일치히는 경우 */

                                
                    });

                    vm.basicData.arrNavPriceGubun   =   vm.basicData.arrNavPriceGubun.filter( function(item) { 
                        return  selData.indexOf( item ) == -1; 
                    });

                }

                /* ETP/INDEX 구분 이 'ETP' 인 경우 */
                if( rowData.etpIndexGubun   === "INDEX" ) {

                    if(     vm.basicData.f16257     ==  rowData.f16257          /* ETP기초지수코드 */
                        &&  vm.basicData.f34239     ==  rowData.f34239          /* ETP기초지수MID */
                    )   {
                        /* 초기데이터 지수정보 초기화 */
                        vm.basicData.f16257 =   "";     /* ETP기초지수코드 */
                        vm.basicData.f34239 =   "";     /* ETP기초지수MID */
                    }
                }

            }

            if( table01 ) {
                table01.row( pThis.parents('tr') ).remove().draw();
            }


            

            var options = {
                title: " ",
                align: "start",
                width: 940,
                height: 300,
                vAxis: { title: "" },
                hAxis: { title: "" },
                seriesType: "bars",
                series: "",
                legend: { position: "bottom" }
            };

            // Load the Visualization API and the corechart package.
            google.charts.load("current", { packages: ["corechart"] });

            google.charts.setOnLoadCallback(function() {
                chart01.clearChart();
            });

            this.fn_getEtpPerformance();
        },

        /*
         * ETP 의 기본정보를 조회한다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_getEtpPerformance: function() {
            console.log("fn_getEtpPerformance");

            var vm = this;
            var arrToData;


            // Set chart options
            var options = {
                title: " ",
                align: "start",
                width: 940,
                height: 300,
                vAxis: { title: "" },
                hAxis: { title: "" },
                seriesType: "bars",
                series: "",
                legend: { position: "bottom" }
            };

            // Load the Visualization API and the corechart package.
            google.charts.load("current", { packages: ["corechart"] });

            google.charts.setOnLoadCallback(
                drawChart(
                    vm.basicData,
                    vm.arrEtpPerformance,
                    vm.arrIndexPerformance
                )
            );

            function drawChart( basicData, arrEtpPerformance, arrIndexPerformance ) {

                axios.post(Config.base_url + "/user/etp/getEtpPerformance", {

                    data: {
                        basicData           :   basicData,
                        arrEtpPerformance   :   arrEtpPerformance,
                        arrIndexPerformance :   arrIndexPerformance
                    }

                }).then(response => {
                    console.log(response.data);
                    if (response.data) {
                        var chartList = response.data.chartList;
                        var etpPerformanceList = response.data.etpPerformanceList;
debugger;
                    /* 차트 출력 */
                        var items = [];
                        if (chartList && chartList.length > 0) {
                            items = chartList;
                        }
                        arrToData = new google.visualization.arrayToDataTable( items, false);
                        chart01.draw( arrToData, options );

                    /* 테이블 정보 출력 */
                        if( table01 ) {
                            table01.rows.add( etpPerformanceList ).draw();                        
                        }
                    }
                });
            }
        },

        getSelectedItem: function(sel_items, gubun) {
            var vm = this;
            for (let i = 0; i < sel_items.length; i++) {
                
                if (perf_table.rows().count() <= 4) {

                    let compare_cnt = perf_table.column(0).data().filter(
                        function(value, index) {
                            return sel_items[i].JISU_CD == value ? true : false;
                        }
                    ).count();
                    
                    if (compare_cnt == 0) {
                        perf_table.row.add(  {
                            F16012 : '',
                            F16013 : sel_items[i].JISU_CD,
                            F16002 : sel_items[i].JISU_NM,
                            Week1 : '1',
                            Month1 : '2',
                            Month3 : '3',
                            YTD : '4',
                            Year1 : '5',
                            Year3 : '6',
                            Year5 : '7',
                            Year10 : '8',
                        } ).draw( false );
                    } else {
                        alert(sel_items[i].JISU_NM +"은 이미 추가된 자산입니다.");    
                    }
                } else {
                    alert("자산 비교는 총 5개 까지 가능 합니다.");
                    break;
                }

            }
        
        },        

        /*
         * [자산추가] 팝업창을 호출한다.
         * 2019-04-25  bkLove(촤병국)
         */
        showJongMokPop: function() { 
            this.jongMokDialog = true;
        },        

        hideJongMokPop: function() {
            this.jongMokDialog = false;
        },

        getSelectedItem: function(sel_items) {
            var vm = this;

            vm.jongMokDialog = false;

            for (let i = 0; i < sel_items.length; i++) {
                if (perf_table.rows().count() <= 4) {
                    let compare_cnt = perf_table
                        .column(0)
                        .data()
                        .filter(function(value, index) {
                            return sel_items[i].JISU_CD == value ? true : false;
                        })
                        .count();

                    if (compare_cnt == 0) {
                        perf_table.row
                            .add({
                                F16012: "",
                                F16013: sel_items[i].JISU_CD,
                                F16002: sel_items[i].JISU_NM,
                                Week1: "1",
                                Month1: "2",
                                Month3: "3",
                                YTD: "4",
                                Year1: "5",
                                Year3: "6",
                                Year5: "7",
                                Year10: "8"
                            })
                            .draw(false);
                    } else {
                        alert(
                            sel_items[i].JISU_NM + "은 이미 추가된 자산입니다."
                        );
                    }
                } else {
                    alert("자산 비교는 총 5개 까지 가능 합니다.");
                    break;
                }
            }
        }
        
    }
};
</script>
