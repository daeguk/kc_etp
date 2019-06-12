<template>
    <div :class="contentClass">
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
                                            <div class="btn_r" v-if="!showDialog">
                                                <v-btn outline color="primary" small :to="{path:'/index/manage', query:{'activeTab':'2'}}">목록으로 돌아가기</v-btn>
                                            </div>
                                            <div class="btn_r" v-if="showDialog == true && showView == false">
                                                <v-btn icon @click="fn_close" >
                                                    <v-icon>close</v-icon>
                                                </v-btn>
                                            </div>
                                    </v-layout>
                                </div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <p class="title_ex">
                                {{this.results.INDEX_COMMENT}}
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
                            <v-flex xs12  class="py-2">
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
                                        <IndexDetailInfoTab1 :basicData = "basicData" @showMessageBox="showMessageBox"    v-if="openSubIndexInfoTab"></IndexDetailInfoTab1>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <IndexDetailInfoTab2 :basicData = "basicData"  :showDialog="showDialog" :showView="showView" @showMessageBox="showMessageBox"   v-if="openSubIndexInfoTab"></IndexDetailInfoTab2>
                                    </v-tab-item>
                                    <v-tab-item  v-if="!showDialog">
                                        <IndexDetailInfoTab3 @showMessageBox="showMessageBox"></IndexDetailInfoTab3>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-flex>
                        </v-layout>
                    </div>
                </v-card>
                <ConfirmDialog ref="confirm" v-show="false"></ConfirmDialog>
            </v-flex>
        </v-layout>
    </div>
</template>


<script>
import IndexDetailInfoTab1 from "./IndexDetailInfoTab1.vue";
import IndexDetailInfoTab2 from "./IndexDetailInfoTab2.vue";
import IndexDetailInfoTab3 from "./IndexDetailInfoTab3.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

import Config from "@/js/config.js";
export default {
    props: ['paramData', 'showDialog', 'showView'],
    data() {
        return {
            text: "center",
            toggle_none: null,
            toggle_one: '1M',
            toggle_exclusive: 2,
            toggle_multiple: [0, 1, 2],
            tab: null,
            items: ["기본정보", "분석정보", "정보공개 목록"],
            results:{},
            etpInfos:{},
            index_dialog:false,
            options: {
                color: 'primary',
                width: '809%',
                zIndex: 200
            },

            openSubIndexInfoTab: false,
            openSubPublicTab: true, 
            basicData : {},
            contentClass : 'content_margin'
        };
    },
    components: {
        ConfirmDialog : ConfirmDialog,
        IndexDetailInfoTab1: IndexDetailInfoTab1,
        IndexDetailInfoTab2: IndexDetailInfoTab2,
        IndexDetailInfoTab3: IndexDetailInfoTab3
    }, 
    computed: {},
    created: function() {
         var vm = this;

        vm.$EventBus.$on('changeIndexInfo', data => {
            vm.toggle_one = '1M';
            vm.openSubIndexInfoTab = true;
            vm.init(true);
            vm.items = ["기본정보", "분석정보"];
        });
    },
    beforeDestroy() {
        this.$EventBus.$off('changeIndexInfo');
    },
    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
        var vm = this;
        
        vm.init(false);  

        if (vm.showDialog) {
            vm.items = ["기본정보", "분석정보"];
        } else {
            vm.items = ["기본정보", "분석정보", "정보공개 목록"];
        }
    },
    methods: {
        init: function(event) {
            var vm = this;
        
            vm.$nextTick().then(() => {

                if(     vm.paramData 
                    &&  vm.paramData.F16257
                    &&  vm.paramData.LARGE_TYPE
                    &&  vm.paramData.MARKET_ID
                ) {
                    vm.basicData.jisu_cd      =   vm.paramData.F16257;
                    vm.basicData.large_type   =   vm.paramData.LARGE_TYPE;
                    vm.basicData.market_id    =   vm.paramData.MARKET_ID;
                    vm.basicData.perf_class   = 'perf_chart_w2'; /* performanc 그래프 class */
                    vm.basicData.tbl_class   = 'tbl_type ver5'; /* performanc 테이블 class */
                    vm.basicData.chart_size  = '960'; /* performanc 차트 사이즈 */
                    vm.contentClass = '';
                }
                else if(
                        vm.$route.query.jisu_cd  
                    &&  vm.$route.query.large_type  
                    &&  vm.$route.query.market_id  
                ) {
                    vm.basicData.jisu_cd      =   vm.$route.query.jisu_cd;
                    vm.basicData.large_type   =   vm.$route.query.large_type;
                    vm.basicData.market_id    =   vm.$route.query.market_id;
                    vm.basicData.perf_class   = 'perf_chart_w'; /* performanc 그래프 class */
                    vm.basicData.tbl_class   = 'tbl_type ver4'; /* performanc 테이블 class */
                    vm.basicData.chart_size  = '1180'; /* performanc 차트 사이즈 */
                    vm.contentClass = 'content_margin';
                    
                }


                if(     vm.basicData
                    &&  vm.basicData.jisu_cd
                    &&  vm.basicData.large_type
                    &&  vm.basicData.market_id
                ) {
                    vm.getIndexBaseInfo();
                    vm.Indexchart();
                }

                if (event == true) {
                    // 분석정보 실행
                    vm.$EventBus.$emit('changeIndexAnalysisInfo');
                    // 분석정보 실행
                    vm.$EventBus.$emit('changeIndexBasicInfo');
                }
            });   
            
            
        },

        fn_close : function() {
            this.$emit( "fn_closePop", "close" );
        },

        getIndexBaseInfo: function() {
            var vm = this;
            console.log("getIndexBaseInfo");
            
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
                    
                    vm.openSubIndexInfoTab      =   true;
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

                    if (response.data.results[0] != null) {
                        INDEX_NM = response.data.results[0].INDEX_NM;
                        ETP_NM = response.data.results[0].ETP_NM;
                    }

                    data.addColumn('number', INDEX_NM);

                    // ETP 정보가 있으면 추가 
                    if (ETP_NM != null) {
                        data.addColumn('number', ETP_NM);
                    }

                    // console.log(response);
                    if (response.data.success == false) {                    

                        data.addRows(
                            []
                        );

                         // Set chart options
                        var options = {'title':' ',
                                'height':'300',
                                'colors':['#85c406', '#787878', '#ff4366', '#727281'],
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
                            let trd_dd = item.trd_dd.split(',');
                            if (ETP_NM != null) {
                                items.push([new Date(trd_dd[0], trd_dd[1], trd_dd[2], trd_dd[3], trd_dd[4], trd_dd[5]), Number(item.close_idx), Number(item.ept_close_idx)]);
                            } else {
                                items.push([new Date(trd_dd[0], trd_dd[1], trd_dd[2], trd_dd[3], trd_dd[4], trd_dd[5]), Number(item.close_idx)]);
                            }
                          
                        }

                        data.addRows(
                            items
                        );

                         // Set chart options
                        var options = {'title':' ',
                                'height':'300',
                                'colors':['#85c406', '#787878', '#ff4366', '#727281'],
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
        showMessageBox: function(title, msg, option, gubun) {
            this.$root.$confirm.open(title,msg, option, gubun);
        }
    } 

};
</script>