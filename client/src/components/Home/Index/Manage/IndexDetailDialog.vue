<template>
    <v-dialog v-model="showDialog" :max-width="options.width" v-bind:style="{ zIndex: options.zIndex }">
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
                                                <v-btn icon  @click.stop="fn_close">
                                                    <v-icon>close</v-icon>
                                                </v-btn>
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <p class="title_ex">
                                {{this.results.F16002}} 관한 설명이 들어갑니다
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
                                    <v-btn flat value="1D" v-on:click="Indexchart('1D')">1D</v-btn>
                                    <v-btn flat value="1W" v-on:click="Indexchart('1W')">1W</v-btn>
                                    <v-btn flat value="1M" v-on:click="Indexchart('1M')">1M</v-btn>
                                    <v-btn flat value="3M" v-on:click="Indexchart('3M')">3M</v-btn>
                                    <v-btn flat value="6M" v-on:click="Indexchart('6M')">6M</v-btn>
                                    <v-btn flat value="1Y" v-on:click="Indexchart('1Y')">1Y</v-btn>
                                    <v-btn flat value="Total" v-on:click="Indexchart('TOTAL')">Total</v-btn>
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
                                        <indexinfotab1  :basicData = "basicData"    v-if="openIndexInfoTab1"></indexinfotab1>
                                    </v-tab-item>

                                    <v-tab-item>
                                        <indexinfotab2  :basicData = "basicData"    v-if="openIndexInfoTab2"></indexinfotab2>
                                    </v-tab-item>

                                </v-tabs-items>
                            </v-flex>
                        </v-layout>
                    </div>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
    </v-dialog>
</template>


<script>

import indexinfotab1 from "./indexinfotab1.vue";
import indexinfotab2 from "./indexinfotab2.vue";

import Config from "@/js/config.js";
export default {
    props: ['paramData', 'showDialog'],
    data() {
        return {
            text: "center",
            toggle_none: null,
            toggle_one: '1M',
            toggle_exclusive: 2,
            toggle_multiple: [0, 1, 2],
            tab: null,
            items: ["기본정보", "분석정보"],
            results:{},
            etpInfos:{},
            index_dialog:false,
            options: {
                color: 'primary',
                width: '809%',
                zIndex: 200
            },

            openIndexInfoTab1: false,
            openIndexInfoTab2: false,
            basicData : {}
        };
    },
    components: {
          indexinfotab1: indexinfotab1,
          indexinfotab2: indexinfotab2,
    }, 
    computed: {},
    created: function() {},
    beforeDestroy() {},

    mounted: function() {
        var vm = this;

        if(     this.paramData 
            &&  this.paramData.F16013
            &&  this.paramData.LARGE_TYPE
            &&  this.paramData.MARKET_ID
        ) {
            this.basicData.jisu_cd      =   this.paramData.F16013;
            this.basicData.large_type   =   this.paramData.LARGE_TYPE;
            this.basicData.market_id    =   this.paramData.MARKET_ID;
        }
        else if(
                vm.$route.query.jisu_cd  
            &&  vm.$route.query.large_type  
            &&  vm.$route.query.market_id  
        ) {
            this.basicData.jisu_cd      =   this.$route.query.jisu_cd;
            this.basicData.large_type   =   this.$route.query.large_type;
            this.basicData.market_id    =   this.$route.query.market_id;
        }



        if(     this.basicData
            &&  this.basicData.jisu_cd
            &&  this.basicData.large_type
            &&  this.basicData.market_id
        ) {
            this.openIndexInfoTab1   =   true;

            this.getIndexBaseInfo();
            this.Indexchart();
        }


        if(     this.basicData
            &&  this.basicData.jisu_cd
            &&  this.basicData.market_id
        ) {
            this.openIndexInfoTab2   =   true;
        }
    },

    methods: {

        fn_showDialog : function( param ) {
            this.showDialog =   param;
        },

        fn_close : function() {
            this.$emit( "fn_closePop", "close" );
        },

        getIndexBaseInfo: function() {
            var vm = this;

            axios.get(Config.base_url + "/user/index/getIndexBaseInfo", {
                    params: {
                        jisu_cd : vm.basicData.jisu_cd,
                        market_id : vm.basicData.market_id,
                        large_type : vm.basicData.large_type
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
        
        Indexchart: function(term) {
            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});
                        
            // 주기 디폴트
            if (!term) term = '1M';

            var jisu_cd = this.basicData.jisu_cd; 
            var market_id = this.basicData.market_id;
            var large_type = this.basicData.large_type;

            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart(jisu_cd, market_id, large_type, term));

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
      
            function drawChart(jisu_cd, market_id, large_type, term) {
                            
                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'date');

                axios.get(Config.base_url + "/user/index/getIndexEtpHistoryData", {                    
                    params: {
                        jisu_cd : jisu_cd,
                        market_id : market_id,
                        large_type : large_type,
                        term : term
                    }
                }).then(response => {

                    var INDEX_NM = "";
                    var ETP_NM = "";

                    if (response.data.results != null) {
                        var INDEX_NM = response.data.results[0].INDEX_NM;
                        var ETP_NM = response.data.results[0].ETP_NM;
                    }

                    data.addColumn('number', INDEX_NM);

                    // ETP 정보가 있으면 추가 
                    if (ETP_NM != null) {
                        data.addColumn('number', ETP_NM);
                    }

                    // console.log(response);
                    if (response.data.success == false) {
                        alert("정보가 없습니다."); 

                        data.addRows(
                            []
                        );

                         // Set chart options
                        var options = {'title':' ',
                                'height':'300',
                                'colors':['#a52714', '#0000ff', '#ff00000', '#00ff00'],
                                'hAxis':{
                                    format: "MM.dd",
                                    ticks: data.getDistinctValues(0),
                                },
                            };
                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.LineChart(document.getElementById('index_chart_div'));

                        
                        chart.draw(data, options);
                    } else {
                        var items = [] 

                        for (let item of response.data.results) {
                            if (ETP_NM != null) {
                                items.push([new Date(item.trd_dd), Number(item.close_idx), Number(item.ept_close_idx)]);
                            } else {
                                items.push([new Date(item.trd_dd), Number(item.close_idx)]);
                            }
                          
                        }

                        data.addRows(
                            items
                        );

                         // Set chart options
                        var options = {'title':' ',
                                'height':'300',
                                'colors':['#a52714', '#0000ff', '#ff00000', '#00ff00'],
                                'hAxis':{
                                    format: "MM.dd",
                                    ticks: data.getDistinctValues(0),
                                },
                        };

                        if (term == "1D" || term == "1W") {
                            options.hAxis.format = "HH:mm";
                            options.hAxis.ticks = data.getDistinctValues(0);
                        }
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