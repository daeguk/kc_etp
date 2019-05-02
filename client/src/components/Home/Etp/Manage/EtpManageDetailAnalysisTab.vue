<template>
    <v-container fluid grid-list-md pa-0 mb-4>
        <v-layout row wrap>
            <v-flex xs12 flat>
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Performance</h4>

                <!-- performance chart 정보 START -->
                    <div
                        id="etp_comboChart_div"
                        class="graph_01"
                        style="height:300px;background-color:#f6f6f6;"
                    ></div>
                <!-- performance chart 정보 END -->

                    <v-card flat>

                <!-- performance table 정보 START -->
                        <table v-bind:id="tableName" class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="width:5%">          <!-- 국제표준코드 -->
                                <col width="width:5%">          <!-- ETP기초지수코드 -->
                                <col width="width:5%">          <!-- ETP기초지수MID -->

                                <col width="width:22%">         <!-- 한글 종목명 -->
                                <col width="width:10%">         <!-- 1-Week -->
                                <col width="width:10%">         <!-- 1-Month -->
                                <col width="width:10%">         <!-- 3-Month -->
                                <col width="width:9%">          <!-- YTD -->

                                <col width="width:9%">          <!-- 1-Year -->
                                <col width="width:9%">          <!-- 3-Year -->
                                <col width="width:9%">          <!-- 5-Year -->
                                <col width="width:9%">          <!-- 10-Year -->
                                <col width="width:3%">          <!-- 삭제버튼 -->
                            </colgroup>

                            <thead>
                                <tr>
                                    <th>x</th>                  <!-- 국제표준코드 -->
                                    <th>x</th>                  <!-- ETP기초지수코드 -->
                                    <th>x</th>                  <!-- ETP기초지수MID -->

                                    <th></th>                   <!-- 한글 종목명 -->
                                    <th>1-Week</th>             <!-- 1-Week -->
                                    <th>1-Month</th>            <!-- 1-Month -->
                                    <th>3-Month</th>            <!-- 3-Month -->
                                    <th>YTD</th>                <!-- YTD -->

                                    <th>1-Year</th>             <!-- 1-Year -->
                                    <th>3-Year</th>             <!-- 3-Year -->
                                    <th>5-Year</th>             <!-- 5-Year -->
                                    <th>10-Year</th>            <!-- 10-Year -->
                                    <th></th>                   <!-- 삭제버튼 -->
                                </tr>
                            </thead>
                        </table>
                <!-- performance table 정보 END -->

                    </v-card>

                <!-- 자산추가 팝업 START -->
                    <v-layout row>
                        <v-btn outline small color="primary" dark v-on:click="showJongMokPop">
                            <v-icon small color="primary">add</v-icon>자산추가
                        </v-btn>
                        <jongmokPopup @selectedItem="getSelectedItem" @hideJongMokPop="hideJongMokPop" :showDialog="jongMokDialog"></jongmokPopup>
                    </v-layout>
                <!-- 자산추가 팝업 END -->

                </div> 
            </v-flex>
            
            <v-flex xs12 flat>
                <!-- 비중정보 팝업 -->
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
                <!-- 비중정보 팝업end -->
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
import { index_common } from '@/components/Home/Index/mixins_index.js';

var table01 = null;
var chart01 = null;

export default {
    props   :   [ "paramData" ],

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

            /* 비중관련 정보 */
            importance_cnt:0,
            importance_grid_id : "importance_grid",
            importance_chart_id : "importance_chart",

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
            arrIndexPerformance :   [],
            performChartColors  :   ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde'],
            performChartImages  :   ['perform_bar01.png', 'perform_bar02.png', 'perform_bar03.png', 'perform_bar04.png', 'perform_bar05.png']
        };
    },
    mixins : [ index_common ],
    components: {
        jongmokPopup: jongmokPopup, 
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {

        console.log( "EtpManageDetailAnalysisTab.vue -> mounted" );
       
        var vm = this;

        console.log( "####### vm.paramData #######" );
        console.log( vm.paramData );

        if(     vm.paramData 
            &&  (       vm.paramData.f16012
                    ||  vm.paramData.f16257
                    ||  vm.paramData.f34239
                )
        ) {
            vm.basicData.f16012         =   vm.paramData.f16012;            /* 국제표준코드 */
            vm.basicData.f16257         =   vm.paramData.f16257;            /* ETP기초지수코드 */
            vm.basicData.f34239         =   vm.paramData.f34239;            /* ETP기초지수MID */
        }
        else if(
                vm.$route.query.f16012
            ||  vm.$route.query.f16257
            ||  vm.$route.query.f34239
        ) {
            vm.basicData.f16012         =   vm.$route.query.f16012;         /* 국제표준코드 */
            vm.basicData.f16257         =   vm.$route.query.f16257;         /* ETP기초지수코드 */
            vm.basicData.f34239         =   vm.$route.query.f34239;         /* ETP기초지수MID */
        }

        console.log( "####### vm.basicData #######" );
        console.log( vm.basicData );

        if(     vm.basicData.f16012
            ||  vm.basicData.f16257
            ||  vm.basicData.f34239
        )   {

            vm.basicData.arrNavPriceGubun     =   [ "PRICE", "NAV"];


            this.$nextTick().then(() => {

                /* 비중정보 및 차트정보 조회 */
                var paramData   =   {};
                paramData.jisu_cd   =   vm.basicData.f16257 ;
                paramData.market_id =   vm.basicData.f34239;
                vm.getIndexImportanceList( paramData );            


                chart01 = new google.visualization.ComboChart(document.getElementById('etp_comboChart_div'));

                /* ETP performance 정보를 조회한다. */
                vm.fn_getEtpPerformance();             


                /* 테이블 렌더링 */
                table01 =  $("#" + vm.tableName ).DataTable({
                    processing: true,
                    serverSide: false,
                    info: false, // control table information display field
                    stateSave: false, //restore table state on page reload,
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
                            "targets": [ 0, 1, 2 ],
                            "visible": false
                        },                    
                        {  
                            "targets": 3,
                            "render": function ( data, type, row, meta ) {
                                if (data) {

                                    var     imgHtml = "<img src='/assets/img/icon_bar01.png'>";
                                    var     html    = "";

                                    if(     !vm.performChartImages 
                                        ||  meta.row  > 4
                                        ||  !vm.performChartImages[ meta.row ] 
                                    ) {
                                        html += imgHtml;
                                    }else{
                                        html += "<img src='/assets/img/" + vm.performChartImages[ meta.row ] + "'>";
                                    }                                

                                if( row.etpIndexGubun == "ETP" ) {

                                        html +=  "<span>"
                                        html +=     "&nbsp;&nbsp;&nbsp;";
                                        html +=     data;
                                        html +=     "<br>";
                                        html +=     "&nbsp;&nbsp;&nbsp;";
                                        html +=     "(" + row.navPriceGubun + ")";
                                        html +=  "</span>";

                                        return html;
                                    }else{

                                        html += "<span>";
                                        html +=     "&nbsp;&nbsp;&nbsp;";
                                        html +=     data;
                                        html += "</span>";

                                        return html;
                                    }
                                    
                                } else {
                                    return "";
                                }
                            },
                        },

                        { 
                            "targets": 12,
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

                        { "data": "f16012"      , "orderable" : false  },                                   /* 국제표준코드 */
                        { "data": "f16257"      , "orderable" : false  },                                   /* ETP기초지수코드 */
                        { "data": "f34239"      , "orderable" : false  },                                   /* ETP기초지수MID */

                        { "data": "f16002"      , "orderable" : false , className: "txt_left line2" },      /* 한글 종목명 */
                        { "data": "Week1"       , "orderable" : false , className: 'dt-body-right'  },      /* 1-week */
                        { "data": "Month1"      , "orderable" : false , className: 'dt-body-right'  },      /* 1-Month */
                        { "data": "Month3"      , "orderable" : false , className: 'dt-body-right'  },      /* 3-Month */
                        { "data": "YTD"         , "orderable" : false , className: 'dt-body-right'  },      /* ytd */

                        { "data": "Year1"       , "orderable" : false , className: 'dt-body-right'  },      /* 1-Year */
                        { "data": "Year3"       , "orderable" : false , className: 'dt-body-right'  },      /* 3-Year */
                        { "data": "Year5"       , "orderable" : false , className: 'dt-body-right'  },      /* 5-Year */
                        { "data": "Year10"      , "orderable" : false , className: 'dt-body-right'  },      /* 10-Year */
                        { "data": null          , "orderable" : false , className: 'dt-body-center', defaultContent:"", "align":"center" },

                    ]
                });

                $( table01.column( 3 ).header() ).text( vm.nowDate + " (%)" );


                // 테이블별 이벤트
                $('#' + vm.tableName + ' tbody').on('click', 'button', function () {
                    var table = $('#' + vm.tableName ).DataTable();
                    var data = table.row($(this).parents('tr')).data();

                    if ($(this).attr('id') == 'btnDelete') {
                        vm.fn_deleteTableData( $(this), data );
                    }
                        
                });
            });
        }

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

                /* 'ETP' 인 경우 */
                if( rowData.etpIndexGubun   === "ETP" ) {

                    var selData =   vm.basicData.arrNavPriceGubun.filter( function(item) {
                        return  rowData.navPriceGubun   === item;           /* NAV/PRICE 구분 이 일치히는 경우 */

                                
                    });

                    vm.basicData.arrNavPriceGubun   =   vm.basicData.arrNavPriceGubun.filter( function(item) { 
                        return  selData.indexOf( item ) == -1; 
                    });

                }

                /* 'INDEX' 인 경우 */
                else if( rowData.etpIndexGubun   === "INDEX" ) {
                    if(     vm.basicData.f16257     ==  rowData.f16257          /* ETP기초지수코드 */
                        &&  vm.basicData.f34239     ==  rowData.f34239          /* ETP기초지수MID */
                    )   {
                        /* 초기데이터 지수정보 초기화 */
                        vm.basicData.f16257 =   "";     /* ETP기초지수코드 */
                        vm.basicData.f34239 =   "";     /* ETP기초지수MID */
                    }
                }
            }

            /* 추가된 ETP/INDEX 인 경우 */
            else{

                /* 'ETP' 인 경우 */
                if( rowData.etpIndexGubun   === "ETP" ) {

                    var selData =   vm.arrEtpPerformance.filter( function(item) {
                        return  rowData.f16012   === item.f16012;               /* 국제표준코드 */  
                    });

                    vm.arrEtpPerformance   =   vm.arrEtpPerformance.filter( function(item) { 
                        return  selData.indexOf( item ) == -1; 
                    });

                }

                /* 'INDEX' 인 경우 */
                else if( rowData.etpIndexGubun   === "INDEX" ) {
                    var selData =   vm.arrIndexPerformance.filter( function(item) {
                        return      rowData.f16257   === item.f16257            /* ETP기초지수코드 */
                                &&  rowData.f34239   === item.f34239;           /* ETP기초지수MID */
                    });

                    vm.arrIndexPerformance   =   vm.arrIndexPerformance.filter( function(item) { 
                        return  selData.indexOf( item ) == -1; 
                    });
                }
            }

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
                width: $(window).width()*0.58,
                height: 300,
                colors: vm.performChartColors,
                vAxis: { title: "" },
                hAxis: { title: "" },
                seriesType: "bars",
                series: "",
                legend: { position: "bottom" }
            };

            // Load the Visualization API and the corechart package.
            google.charts.load("current", { packages: ["corechart"] });


            /* 차트를 초기화한다. */
            google.charts.setOnLoadCallback(function() {
                if( chart01 ) {
                    chart01.clearChart();
                }
            });

            if( vm.basicData.arrNavPriceGubun && vm.basicData.arrNavPriceGubun.length != 0  ) {

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
                            var etpPerformanceList = response.data.etpPerformanceList;

                        /* 테이블 정보 출력 */
                            if( table01 ) {
                                table01.rows.add( etpPerformanceList ).draw();                        
                            }

                        /* 차트 출력 */
                        var items = [] 

                        items.push(['string']);
                        items.push(['1-Week']);
                        items.push(['1-Month']);
                        items.push(['3-Month']);
                        items.push(['YTD']);
                        items.push(['1-Year']);
                        items.push(['3-Year']);
                        items.push(['5-Year']);
                        items.push(['10-Year']);

                    
                        for (let i = 0; i < table01.rows().data().length; i++) {
                            var data = table01.rows().data()[i];

                            // 첫번째 ROW 범위
                            items[0][i+1] = data.f16002;           

                            for (let x = 0; x < table01.rows().data().length; x++) {   
                                var item = table01.rows().data()[x];

                                // 데이터                    
                                items[1][x+1] = Number(item.Week1);
                                items[2][x+1] = Number(item.Month1);
                                items[3][x+1] = Number(item.Month3);
                                items[4][x+1] = Number(item.YTD);
                                items[5][x+1] = Number(item.Year1);
                                items[6][x+1] = Number(item.Year3);
                                items[7][x+1] = Number(item.Year5);
                                items[8][x+1] = Number(item.Year10);
                            }
                        }
                
                    
                            var chart_data = new google.visualization.arrayToDataTable( items);

                            // Set chart options
                            var options = {'title':'',
                                        'width':$(window).width()*0.58,
                                        'height':'300',
                                        'colors': ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde'],                           
                                        'legend': {
                                            position: 'left'
                                        },
                                        seriesType: 'bars',
                                        
                            };

                            // Instantiate and draw our chart, passing in some options.
                            var chart = new google.visualization.ComboChart( document.getElementById('etp_comboChart_div') );
                            chart.draw(chart_data, options);
                        }
                    });
                }
            }else{

                alert( "PRICE 또는 NAV 중 1개는 존재해야 합니다. 데이터를 다시 조회 해 주세요." );
                vm.$router.go( -1 );                
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


        getSelectedItem: function( sel_items, gubun ) {

            var vm = this;

            vm.hideJongMokPop();
            for (let i = 0; i < sel_items.length; i++) {

                if ( table01.rows().count() <= 4 ) {

                    let checkList = table01.columns( [0,1,2] ).data();
                    var compare_cnt =   -1;

                    /* INDEX 인 경우 */
                    if( gubun == "2" ) {

                        /* 팝업에서 받은 지수코드와 Table의 ETP기초지수코드(f16257) 가 존재하는지 체크 */
                        var jisuCompCnt =   checkList[1].filter( function( jisuCd, jisuInx ){
                            return sel_items[i].JISU_CD == jisuCd ? true : false;
                        }).length;

                        if( jisuCompCnt > 0 ) {
                            compare_cnt =   jisuCompCnt;
                            break;
                        }

                        /* 팝업에서 받은 지수코드와 Table의 ETP기초지수MID(f34239) 가 존재하는지 체크 */
                        var marketCnt   =   checkList[2].filter( function( marketCd, marketInx ){
                            return sel_items[i].MARKET_ID == marketCd ? true : false;
                        }).length;

                        compare_cnt =   marketCnt;

                    }else{

                        /* 팝업에서 받은 지수코드와 Table의 국제표준코드(f16012) 가 존재하는지 체크 */
                        var etpCompCnt  =   checkList[0].filter( function( etpCd, etpInx ){
                            return sel_items[i].JISU_CD == etpCd ? true : false;
                        }).length;

                        compare_cnt =   etpCompCnt;
                    }

                    if (compare_cnt > 0) {
                        alert(
                            sel_items[i].JISU_NM + "은 이미 추가된 자산입니다."
                        );

                        return false;
                    }


                    /* INDEX 인 경우 */
                    if( gubun == "2" ) {
                        vm.arrIndexPerformance.push({
                                f16012      :   ""                                      /* 국제표준코드 */
                            ,   f16257      :   sel_items[i].JISU_CD                    /* ETP기초지수코드 */
                            ,   f34239      :   sel_items[i].MARKET_ID.substring( 1 )   /* ETP기초지수MID */
                        });
                    }else{
                        vm.arrEtpPerformance.push({
                                f16012      :   sel_items[i].JISU_CD                    /* 국제표준코드 */
                            ,   f16257      :   ""                                      /* ETP기초지수코드 */
                            ,   f34239      :   ""                                      /* ETP기초지수MID */
                        });
                    }
                    
                } else {
                    alert("자산 비교는 총 5개 까지 가능 합니다.");
                    return false;
                }
            }


            if(     ( vm.arrIndexPerformance && vm.arrIndexPerformance.length > 0 )
                ||  ( vm.arrEtpPerformance   && vm.arrEtpPerformance.length > 0 )
            ) {
                if( table01 ) {
                    table01.clear().draw();
                }            

                this.fn_getEtpPerformance();
            }
        }
        
    }
};
</script>
