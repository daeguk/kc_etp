<template>

    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>

                <v-card flat ma-3>

                <!-- content내용 -->
                    <div class="title01_w">
                        <v-card-title primary-title>
                            <div class="title_wrap01">
                                <h3 class="headline mb-0">
                                    {{this.etpBasic.f16002}}
                                    <span class="grey--text">{{etpBasic.f16013}}</span>
                                </h3>

                                <!--div class="right_btn"  v-if="showEtpManageDetailDialog">
                                    <v-layout align-right>
                                        <v-flex xs12 sm4 text-xs-center>                                         
                                            <div class="btn_r">
                                                <v-btn icon  @click.stop="fn_close">
                                                    <v-icon>close</v-icon>
                                                </v-btn>
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </div-->

                                <div class="right_btn"  v-if="!showEtpManageDetailDialog">
                                    <v-layout align-right>
                                        <v-flex xs12 sm4 text-xs-center>
                                            <div class="btn_r">
                                                <v-btn
                                                    outline
                                                    color="primary"
                                                    small
                                                    @click="fn_goBack()"
                                                >목록으로 돌아가기</v-btn>
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </div>
                            </div>
                        </v-card-title>
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
                                        <EtpManageDetailBasicInfoTab    v-if="showEtpManageDetailDialogBySub"

                                                                        :paramData="paramData"
                                                                        :etpBasic="etpBasic"
                                                                        :indexBasic="indexBasic">
                                        </EtpManageDetailBasicInfoTab>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <EtpManageDetailAnalysisTab     v-if="showEtpManageDetailDialogBySub"
                                                                        :paramData="paramData" >
                                        </EtpManageDetailAnalysisTab>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-flex>
                        </v-layout>
                    </div>
                </v-card>


            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";
import EtpManageDetailBasicInfoTab from "./EtpManageDetailBasicInfoTab.vue";
import EtpManageDetailAnalysisTab from "./EtpManageDetailAnalysisTab.vue";
import Config from "@/js/config.js";

export default {
    props : [ "paramData", "showEtpManageDetailDialog" ],
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
            toggle_one: '1M',

            basicData           :   {},
            etpBasic            :   {},
            indexBasic          :   {},
            etpInfos            :   {},

            showEtpManageDetailDialogBySub : false,

        };
    },
    components: {
        EtpManageDetailBasicInfoTab: EtpManageDetailBasicInfoTab,
        EtpManageDetailAnalysisTab: EtpManageDetailAnalysisTab
    },
    mounted: function() {
        var vm = this;
        
        console.log( "EtpManageDetail.vue -> mounted" );
        console.log( vm.paramData );

        vm.init();

        
    },
    created: function() {
        var vm = this;
        vm.$EventBus.$on('changeEtpInfo', data => {
            vm.toggle_one = '1M';
            vm.init();
            // 분석정보 실행
            vm.$EventBus.$emit('changeEtpAnalysisInfo');
        });
    },
    updated: function() {
        console.log("Etp_updated================");
    },
    beforeDestory: function() {
        this.$EventBus.$off('changeEtpInfo');
    },
    
    methods: {
        init: function() {
            var vm = this;
            vm.$nextTick().then(() => {
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
                    &&  vm.$route.query.f16257  
                    &&  vm.$route.query.f34239  
                ) {
                    vm.basicData.f16012         =   vm.$route.query.f16012;         /* 국제표준코드 */
                    vm.basicData.f16257         =   vm.$route.query.f16257;         /* ETP기초지수코드 */
                    vm.basicData.f34239         =   vm.$route.query.f34239;         /* ETP기초지수MID */
                }


                if(     vm.basicData.f16012
                    ||  vm.basicData.f16257
                    ||  vm.basicData.f34239
                )   {
                   // vm.$refs.etpBtn_1m.$el.click();     /* ETP 차트 정보를 조회한다. */

                    vm.fn_getEtpBasic();                /* ETP 의 기본정보를 조회한다. */
                    vm.fn_getEtpChartData('1M');        /* ETP 차트 정보를 조회한다. */
                }
            });

            
        },
        /*
         * ETP 의 기본정보를 조회한다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_getEtpBasic: function() {
            console.log("fn_getEtpBasic");

            var vm = this;

            axios.post(Config.base_url + "/user/etp/getEtpBasic", {
                data: {
                    basicData   :   vm.basicData
                }
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    vm.etpBasic = response.data.etpBasic;
                    vm.indexBasic = response.data.indexBasic;

                    vm.showEtpManageDetailDialogBySub   =   true;
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
                    vm.basicData
                )
            );

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
      
            function drawChart( basicData ) {
                
                
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
                            basicData   :   basicData
                        ,   term        :   term            /* 기간정보 */
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
                                        items.push( [ item.hh24, Number( item.now_price ), Number( item.index_now_price ) ] );
                                    }else{
                                        items.push( [ item.hh24, Number( item.now_price ) ] );
                                    }
                                }
                                // 1D가 아닌 경우 가로축에 일자단위 노출
                                else{
                                    // index 정보가 있으면 추가
                                    if ( index_nm != null ) {
                                        items.push( [ item.fmt_yyyymmdd, Number( item.now_price ), Number( item.index_now_price ) ] );
                                    }else{
                                        items.push( [ item.fmt_yyyymmdd, Number( item.now_price ) ] );
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
        },

        /*
         * 이전화면으로 되돌린다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_goBack() {
            this.$router.go(-1);
        },

        /*
         * 팝업창을 종료한다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_close : function() {
            this.$emit( "fn_closePop", "close" );
        },        
    }
};
</script>

