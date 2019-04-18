<template>
    <v-container fluid grid-list-md pa-0 mb-4>
        <v-layout row wrap>
            <v-flex xs12 flat>
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Performance</h4>
                    <div class="graph_02_w" style="height:100px;">그래프 들어갑니다</div>
                    <v-card flat>
                        <table id="perf_table" class="display table01_w" style="width:100%">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th>1-Week</th>
                                    <th>1-Month</th>
                                    <th>3-Month</th>
                                    <th>YTD</th>
                                    <th>1-Year</th>
                                    <th>3-Year</th>
                                    <th>5-Year</th>
                                    <th>10-Year</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                      
                    </v-card>
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
                                                    v-model="tab"
                                                >
                                                    <v-tabs-slider color="#00fffc"></v-tabs-slider>
                                                    <v-tab
                                                        v-for="item in items"
                                                        :key="item"
                                                    >{{ item }}</v-tab>
                                                </v-tabs>
                                                 <v-tabs-items v-model="tab">
                                                    <v-tab-item>
                                                        <infopoptab1 @selectedItem="getSelectedItem"></infopoptab1>
                                                    </v-tab-item>
                                                    <v-tab-item>
                                                        <infopoptab2 @selectedItem="getSelectedItem"></infopoptab2>
                                                    </v-tab-item>
                                                    <v-tab-item>
                                                        <infopoptab3 @selectedItem="getSelectedItem"></infopoptab3>
                                                    </v-tab-item>
                                                </v-tabs-items>
                                            </v-flex>
                                        </v-layout>
                                    </v-card>   
                                </v-dialog>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <!--자산추가 팝업 end--->
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
                    <div class="graph_02_w"  id="importance_chart"></div>
                    <v-card flat></v-card>
                </div>
                <!---비중정보 팝업end-->
            </v-flex>

            <v-flex xs12></v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import infopoptab1 from "./infopoptab1.vue";
import infopoptab2 from "./infopoptab2.vue";
import infopoptab3 from "./infopoptab3.vue";
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import select from 'datatables.net-select'
import Config from '@/js/config.js'
var importance_grid = null;
var perf_table = null;
export default {
    data() {
        return {
            tab: null,
            items: ["ETF", "ETN", "INDEX"],
            dialog: false,
            dialog2: false,
            results: [],
            importance_cnt:0,
            search:"",

            modalFlag: false
        };
    },
    components: {
        infopoptab1: infopoptab1,
        infopoptab2: infopoptab2,
        infopoptab3: infopoptab3
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        
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
                            return "<img src='/assets/img/icon_bar01.png'>&nbsp;" + data;
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
                                return "<div class='tooltip'><button type='button' name='ok' class='btn_icon v-icon material-icons '>thumb_up_alt</button><span class='tooltiptext' style='width:50px;'>삭제</span></div>";
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
                { "data": "F16013", "orderable": false,  "width":"30%"}, 
                { "data": "F16002", "orderable": false,  "width":"30%"}, 
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

    },
    methods: {

        getIndexImportanceList: function() {
            console.log("getIndexImportanceList");
            axios.get(Config.base_url + "/user/index/getIndexImportanceList", {
                    params: {
                        jisu_cd : this.$route.query.jisu_cd,
                        market_id : this.$route.query.market_id
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("비중 목록이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.results = items;
                        this.importance_cnt = this.results.length;

                        // 차트 호출
                        this.importance_chart(items);
                        
                        importance_grid = $('#importance_grid').DataTable( {
                            "processing": true,
                            "serverSide": false,
                            "info": false,   // control table information display field
                            "stateSave": true,  //restore table state on page reload,
                            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                            scrollY:        '500px',
                            scrollCollapse: true,
                            select: {
                                style:    'multi',
                                selector: 'td:first-child'
                            },
                            paging: false,
                            searching: false,
                            data : this.results,
                            columns: [
                                { "data": "ISIN_CODE", "orderable": true},
                                { "data": "JOING_NM", "orderable": true },
                                { "data": "PERCNT", "orderable" : true},
                                { "data": "GUBUN", "orderable" : true},
                            ]
                        }); 

                        
                    }
                   
                });
        }, 

        importance_chart: function(results) {
            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});

           
            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart());

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
      
            function drawChart() {
                
                
                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'JOING_NM');
                data.addColumn('number', 'PERCNT');

                // Set chart options
                var options = {'title':' ',
                            'width':'100%',
                            'height':'400px'};
 
                
                
                var items = [] 

                for (let item of results) {
                    
                    if (items.length >= 5) break;

                    items.push([item.JOING_NM, item.PERCNT]);

                }

                data.addRows(
                    items
                );

                // Instantiate and draw our chart, passing in some options.
                var chart = new google.visualization.PieChart(document.getElementById('importance_chart'));
                chart.draw(data, options);
            }
        },

        getIndexAnalysisInfo: function() {
            console.log("getIndexAnalysisInfo");
            axios.get(Config.base_url + "/user/index/getIndexAnalysisInfo", {
                    params: {
                        jisu_cd : this.$route.query.jisu_cd,
                        market_id : this.$route.query.market_id
                    }
            }).then(response => {
                    // console.log(response);
                if (response.data.success == false) {
                    alert("비중 목록이 없습니다");
                } else {
                    var items = response.data.results;
                        
                    console.log("response=" + JSON.stringify(items));
                    perf_table.clear().draw();
                    perf_table.rows.add(items).draw();
                }
                   
            });
        }, 

        getSelectedItem: function(sel_items) {
            var vm = this;
            vm.dialog = false;
               
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
    }
}
</script>
