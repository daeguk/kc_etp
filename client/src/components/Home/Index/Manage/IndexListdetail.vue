<template>
    <div class="content_margin">
        <v-layout row>
            <v-flex xs12>
                <v-card flat ma-3>
                    <div class="title01_w">
                        <v-card-title primary-title>
                            <div class="title_wrap01">
                                <h3 class="headline mb-0">
                                   {{this.results.F16002}}
                                    <span class="grey--text">{{results.F16013}}</span> 
                                </h3>
                                <div class="right_btn">
                                    <v-layout align-right>
                                        <v-flex xs12 sm4 text-xs-center>
                                            <div class="btn_r">
                                                <v-btn outline color="indigo" small :to="{path:'/index/manage', query:{'activeTab':'2'}}">목록으로 돌아가기</v-btn>
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <p class="title_ex">
                                TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
                                TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
                                TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
                                TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
                                TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
                            </p>
                        </v-card-text>
                    </div>
                    <div class="graph_01_w">
                        <div class="sub_title_num">
                            {{results.F15001}}
                            <span>{{results.F15472}}({{results.F15004}})</span>
                            <p>Last Updated : {{results.F12506}}</p>
                        </div>
                        <v-card flat class="graph_toggle">
                            <v-flex xs12 sm6 class="py-2">
                                <v-btn-toggle v-model="toggle_one" class="toggle_01">
                                    <v-btn flat value="1D">1D</v-btn>
                                    <v-btn flat value="1W">1W</v-btn>
                                    <v-btn flat value="1M">1M</v-btn>
                                    <v-btn flat value="3M">3M</v-btn>
                                    <v-btn flat value="6M">6M</v-btn>
                                    <v-btn flat value="1Y">1Y</v-btn>
                                    <v-btn flat value="Total">Total</v-btn>
                                </v-btn-toggle>
                            </v-flex>
                        </v-card>
                        <div
                            id="index_chart_div"
                            class="graph_01"
                            style="height:300px;background-color:#f6f6f6;"
                        ></div>
                    </div>

                    <div class="tab2_w">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-tabs
                                    fixed-tabs
                                    light
                                    v-model="tab"
                                    align-with-title
                                >
                                    <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                    <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
                                </v-tabs>

                                <v-tabs-items v-model="tab">
                                    <v-tab-item>
                                        <indexinfotab1 :index_item="results" :etp_items="etpInfos"></indexinfotab1>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <!--indexinfotab2></indexinfotab2-->
                                    </v-tab-item>
                                    <v-tab-item>
                                        <indexinfotab3></indexinfotab3>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-flex>
                        </v-layout>
                    </div>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>


<script>
import indexinfotab1 from "./indexinfotab1.vue";
import indexinfotab2 from "./indexinfotab2.vue";
import indexinfotab3 from "./indexinfotab3.vue";

import Config from "@/js/config.js";
export default {
    data() {
        return {
            text: "center",
            toggle_none: null,
            toggle_one: '1D',
            toggle_exclusive: 2,
            toggle_multiple: [0, 1, 2],
            tab: null,
            items: ["기본정보", "분석정보", "정보공개 목록"],
            results:{},
            etpInfos:{},
        };
    },
    components: {
        indexinfotab1: indexinfotab1,
        //indexinfotab2: indexinfotab2,
        indexinfotab3: indexinfotab3
    }, 
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        this.getIndexBaseInfo();
        this.getIndexInEtpInfo();
        this.Indexchart();
    },
    methods: {
        getIndexBaseInfo: function() {
            var vm = this;
            console.log("getIndexBaseInfo");
            
            axios.get(Config.base_url + "/user/index/getIndexBaseInfo", {
                    params: {
                        jisu_cd : vm.$route.query.jisu_cd,
                        market_id : vm.$route.query.market_id
                        
                    }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    alert("지수정보가 없습니다.");
                } else {
                    var items = response.data.results;
                    vm.results = items[0];
                    console.log("response=" + JSON.stringify(vm.results));
                    //this.list_cnt = this.results.length;
                }
            });

        },     
        getIndexInEtpInfo: function() {
            var vm = this;

            axios.get(Config.base_url + "/user/index/getIndexInEtpInfo", {
                    params: {
                        jisu_cd : vm.$route.query.jisu_cd,
                        market_id : vm.$route.query.market_id
                        
                    }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    alert("지수정보가 없습니다.");
                } else {
                    var items = response.data.results;
                    vm.etpInfos = items;
                    console.log("etp_response=" + JSON.stringify(vm.results));
                    //this.list_cnt = this.results.length;
                }
            });
        },    
        Indexchart: function() {
            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});

            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart(this.$route.query.jisu_cd, this.$route.query.market_id));

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
      
            function drawChart(jisu_cd, market_id) {
                
                
                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'date');
                data.addColumn('number', 'DBF 500 Index');

                // Set chart options
                var options = {'title':' ',
                            'width':'100%',
                            'height':'300px',
                            'hAxis':{format:'yyyy-MM-dd HH:mm:ss'}};
 
                
                axios.get(Config.base_url + "/user/index/getIndexEtpHistoryData", {                    
                    params: {
                        jisu_cd : jisu_cd,
                        market_id : market_id
                        
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("지수정보가 없습니다.2"); 
                    } else {
                        var items = [] 

                        for (let item of response.data.results) {
                            items.push([item.trd_dd, item.close_idx]);
                        }

                        data.addRows(
                            items
                        );

                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.LineChart(document.getElementById('index_chart_div'));
                        chart.draw(data, options);
                    }
                });


                
                
            }
        },
    } 

};
</script>