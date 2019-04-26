<template>
        <v-layout row wrap>
            <v-flex grow>
                 <v-card flat ma-3>
                   <!---content내용--->
                    <div class="title01_w">
                        <v-card-text>
                            <p class="title_ex">
                                {{this.etpBasic.f16002}} 관한 내용이 들어갑니다
                            </p>
                        </v-card-text>
                    </div>
                    
                     <div class="graph_01_w">

                        <div class="sub_title_num">
                            {{etpBasic.f15001}}
                            <span class="text_blue">{{etpBasic.f15472}}({{etpBasic.f15004}})</span>
                            <p>Last Updated : {{etpBasic.f12506}}</p>
                        </div>

                        <v-card flat class="graph_toggle">
                            <v-flex xs12 sm6 class="py-2">
                                <v-btn-toggle v-model="toggle_one" class="toggle_01">
                                    <v-btn flat value="1D" v-on:click="fn_getEtpChartData('1D')">1D</v-btn>
                                    <v-btn flat value="1W" v-on:click="fn_getEtpChartData('1W')">1W</v-btn>
                                    <v-btn ref="etpBtn_1m" flat value="1M" v-on:click.stop="fn_getEtpChartData('1M')">1M</v-btn>
                                    <v-btn flat value="3M" v-on:click="fn_getEtpChartData('3M')">3M</v-btn>
                                    <v-btn flat value="6M" v-on:click="fn_getEtpChartData('6M')">6M</v-btn>
                                    <v-btn flat value="1Y" v-on:click="fn_getEtpChartData('1Y')">1Y</v-btn>
                                    <v-btn flat value="Total" v-on:click="fn_getEtpChartData('TOTAL')">Total</v-btn>
                                </v-btn-toggle>
                            </v-flex>
                        </v-card>
                        <div
                            id="etp_chart_div"
                            class="graph_01"
                            style="height:300px;background-color:#f6f6f6;"
                        ></div>
                    </div>

                    <div class="tab2_w">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-tabs fixed-tabs light v-model="tab5" align-with-title>
                                    <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                    <v-tab v-for="item in items5" :key="item">{{ item }}</v-tab>
                                </v-tabs>

                                <v-tabs-items v-model="tab5">
                                    <v-tab-item>
                                        <EtpManageDetailBasicInfoTab    v-on:receiveEtpBasic = "fn_setEtpBasic"></EtpManageDetailBasicInfoTab>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <EtpManageDetailAnalysisTab></EtpManageDetailAnalysisTab>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-flex>
                        </v-layout>
                    </div>
                </v-card>
            </v-flex>
        </v-layout>

</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";
import EtpManageDetailBasicInfoTab from "./EtpManageDetailBasicInfoTab.vue";
import EtpManageDetailAnalysisTab from "./EtpManageDetailAnalysisTab.vue";
import Config from "@/js/config.js";

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            text: "전종목",
            text2: "",
            dialog: false,
            dialog2: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            tab5: null,
            items1: ["전체", "시장대표"],
            items5: ["기본정보", "분석정보"],
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
            items4: [],
            mini: false,
            right: null,
            rowsPerPageItems: [10, 20, 30, 50],
            headers: [
                {
                    text: "Code",
                    align: "left",
                    value: "name"
                },
                { text: "name", value: "name" },
                { text: "BasePrc", value: "BasePrc", align: "right" },
                { text: "Shrs", value: "Shrs", align: "right" },
                { text: "Float rto", value: "FloatRto", align: "right" },
                { text: "Ceiling rto", value: "CeilingRto", align: "right" },
                { text: "Factor rto", value: "FactorRto", align: "right" }
            ],
            desserts: [],
            toggle_one: null,

            etpBasic    :   {},
            indexBasic  :   {},
            etpInfos    :   {}
        };
    },
    components: {
        EtpManageDetailBasicInfoTab: EtpManageDetailBasicInfoTab,
        EtpManageDetailAnalysisTab: EtpManageDetailAnalysisTab
    },
    mounted: function() {
        var vm = this;

        // this.fn_getEtpInfo();            /* ETP 정보를 조회한다. ( 분석정보, 포트폴리오, 성능정보 ) */

        vm.$refs.etpBtn_1m.$el.click();     /* ETP 차트 정보를 조회한다. */
    },
    created: function() {},
    beforeDestory: function() {},

    methods: {

        /*
         * EtpManageDetailBasicInfoTab 에서 조회된 etp 기본정보를 설정한다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_setEtpBasic : function( etpBasic, indexBasic ) {
            this.etpBasic       =   etpBasic;
            this.indexBasic     =   indexBasic;
debugger;
        },

        /*
         * ETP 정보를 조회한다. ( 분석정보, 포트폴리오, 성능정보 )
         * 2019-04-25  bkLove(촤병국)
         */
        fn_getEtpInfo: function() {
            console.log("fn_getEtpInfo");

            var vm = this;
            var idx = 0;

            axios
                .post(Config.base_url + "/user/etp/getEtpInfo", {
                    data: {
                            f16012  :   vm.$route.query.f16012      /* 국제표준코드 */
                        ,   f16257  :   vm.$route.query.f16257      /* ETP기초지수코드  */
                        ,   f34239  :   vm.$route.query.f34239      /* ETP기초지수MID  */
                    }
                })
                .then(function(response) {
                    console.log(response);

                    if (response.data) {
                    }
                });
        },

        /*
         * ETP 차트 정보를 조회한다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_getEtpChartData: function( term ) {
            console.log("fn_getEtpChartData");

            var vm = this;

            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});

            // 주기 디폴트
            if (!term) term = '1M';

            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback( 
                drawChart( 
                        vm.$route.query.f16012          /* 국제표준코드 */
                    ,   vm.$route.query.f16257          /* ETP기초지수코드  */
                    ,   vm.$route.query.f34239          /* ETP기초지수MID  */
                )
            );

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
      
            function drawChart( f16012, f16257, f34239 ) {
                
                
                // Create the data table.
                var data = new google.visualization.DataTable();

                // Set chart options
                var options = {
                    'title':' ',
                    'width':'100%',
                    'height':'300px',
                    'hAxis':{format:'yyyy-MM-dd HH:mm:ss'}
                };
 
                
                axios.post(Config.base_url + "/user/etp/getEtpChartData", {                    
                    data: {
                            f16012  :   f16012          /* 국제표준코드 */
                        ,   f16257  :   f16257          /* ETP기초지수코드  */
                        ,   f34239  :   f34239          /* ETP기초지수MID  */

                        ,   term    :   term            /* 기간정보 */
                    }
                }).then(response => {

                    if( response.data ) {

                        var chartList   =   response.data.chartList;

                        if( chartList == null || chartList.length == 0 ) {
                            data.addColumn('string', "date" );
                            data.addColumn('number', "" );
                        }

                        var items = [] 
                        if( chartList && chartList.length > 0 ) {

                            var fmt_yyyymmdd = chartList[0].fmt_yyyymmdd;
                            var etp_nm = chartList[0].etp_nm;
                            var index_nm = chartList[0].index_nm;

                            data.addColumn('string', "date" );
                            data.addColumn('number', etp_nm );

                            // index 정보가 있으면 추가
                            if ( index_nm != null ) {
                                data.addColumn('number', index_nm );
                            }

                            for ( let item of chartList ) {
                                // 1D 경우 가로축에 시간단위가 노출
                                if( term == "1D" ) {
                                    // index 정보가 있으면 추가
                                    if ( index_nm != null ) {
                                        items.push( [ item.hh24, item.now_price, item.index_now_price ] );
                                    }else{
                                        items.push( [ item.hh24, item.now_price ] );
                                    }
                                }
                                // 1D가 아닌 경우 가로축에 일자단위 노출
                                else{
                                    // index 정보가 있으면 추가
                                    if ( index_nm != null ) {
                                        items.push( [ item.fmt_yyyymmdd, item.now_price, item.index_now_price ] );
                                    }else{
                                        items.push( [ item.fmt_yyyymmdd, item.now_price ] );
                                    }
                                }
                            }
                        }

                        data.addRows(
                            items
                        );

                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.LineChart(document.getElementById('etp_chart_div'));
                        chart.draw(data, options);
                    }
                });   
            }
        }
    }
};
</script>

