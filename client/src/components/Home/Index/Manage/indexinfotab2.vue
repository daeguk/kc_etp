<template>
    <v-container fluid grid-list-md pa-0 mb-4>
        <v-layout row wrap>
            <v-flex xs12 flat>
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Performance</h4>
                    <div class="graph_02_w" style="height:100px;">그래프 들어갑니다</div>
                    <v-card flat>
                        <v-data-table
                            :headers="headers"
                            :items="desserts"
                            class="table_line2 indexinfo_table01"
                            
                        >
                            <template v-slot:items="props">
                                <td class="text-xs-right">
                                    <img src="/assets/img/icon_bar01.png">
                                    <!--img src="/assets/img/icon_bar02.png"-->
                                    <!--img src="/assets/img/icon_bar03.png"-->
                                </td>
                                <td class="text-xs-left">{{ props.item.name }}</td>
                                <td class="text-xs-center">{{ props.item.Week1 }}</td>
                                <td class="text-xs-center">{{ props.item.Month1 }}</td>
                                <td class="text-xs-center">{{ props.item.Month3 }}</td>
                                <td class="text-xs-center">{{ props.item.YTD }}</td>
                                <td class="text-xs-center">{{ props.item.Year1 }}</td>
                                <td class="text-xs-center">{{ props.item.Year3 }}</td>
                                <td class="text-xs-center">{{ props.item.Year5 }}</td>
                                <td class="text-xs-center">{{ props.item.Year10 }}</td>
                            </template>
                        </v-data-table>
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
                                                        <infopoptab1></infopoptab1>
                                                    </v-tab-item>
                                                    <v-tab-item>
                                                        <infopoptab2></infopoptab2>
                                                    </v-tab-item>
                                                    <v-tab-item>
                                                        <infopoptab3></infopoptab3>
                                                    </v-tab-item>
                                                </v-tabs-items>
                                            </v-flex>
                                        </v-layout>
                                        <!--비교자산 탭end--->
                                        <v-card class="pop_btn_w text-xs-center">
                                            <v-btn
                                                depressed
                                                color="primary"
                                                @click="dialog = false"
                                            >추가하기</v-btn>
                                        </v-card>
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
            headers: [
                {
                    text: "",
                    align: "right",
                    sortable: false,
                    value: "",
                    width: 10
                },
                {
                    text: "",
                    align: "left",
                    sortable: false,
                    value: "name"
                },
                { text: "1-Week", value: "Week1" },
                { text: "1-Month", value: "Month1" },
                { text: "3-Month", value: "Month3" },
                { text: "YTD", value: "YTD" },
                { text: "1-Year", value: "Year1" },
                { text: "3-Year", value: "Year3" },
                { text: "5-Year", value: "Year5" },
                { text: "10-Year", value: "Year10" }
            ],
            desserts: [
                {
                    icon: "v-icon",
                    name: "TIGER 미국달러 선물레버러지(Price)",
                    Week1: 159,
                    Month1: 6.0,
                    Month3: 24,
                    YTD: 4.0,
                    Year1: "1%",
                    Year3: 24,
                    Year5: 4.0,
                    Year10: "1%"
                },
                {
                    icon: "edit",
                    name: "TIGER 미국달러 선물레버러지(NAV)",
                    Week1: 159,
                    Month1: 6.0,
                    Month3: 24,
                    YTD: 4.0,
                    Year1: "1%",
                    Year3: 24,
                    Year5: 4.0,
                    Year10: "1%"
                },
                {
                    icon: "edit",
                    name: "F-USDKRW",
                    Week1: 159,
                    Month1: 6.0,
                    Month3: 24,
                    YTD: 4.0,
                    Year1: "1%",
                    Year3: 24,
                    Year5: 4.0,
                    Year10: "1%"
                }
            ],
        
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
        vm.getIndexImportanceList();
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
                            "search": true,
                            "info": true,   // control table information display field
                            "stateSave": true,  //restore table state on page reload,
                            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
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
                                { "data": "PERCNT", "orderable" : true },
                                { "data": "GUBUN", "orderable" : true },
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
        }
    }
}
</script>
