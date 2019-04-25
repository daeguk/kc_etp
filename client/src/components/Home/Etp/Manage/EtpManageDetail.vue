<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>

                <v-card flat ma-3>

                <!---content내용--->
                    <div class="title01_w">
                        <v-card-title primary-title>
                            <div class="title_wrap01">
                                <h3 class="headline mb-0">
                                    {{this.etpBasic.f16002}}
                                    <span class="grey--text">{{etpBasic.f16013}}</span>
                                </h3>
                                <div class="right_btn">
                                    <v-layout align-right>
                                        <v-flex xs12 sm4 text-xs-center>
                                            <div class="btn_r">
                                                <v-btn
                                                    outline
                                                    color="primary"
                                                    small
                                                    :to="{path:'/ETP/manage', query:{'activeTab':'2'}}"
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
                            <v-list-tile-content class="rightmenu_con rightmenu_line">
                                <v-subheader>
                                    <v-icon small>feedback</v-icon>지수 조치 현황
                                    <v-dialog v-model="dialog" persistent max-width="500">
                                        <template v-slot:activator="{ on }">
                                            <v-btn
                                                small
                                                depressed
                                                outline
                                                color="primary"
                                                v-on="on"
                                            >내역확인</v-btn>
                                        </template>
                                        <v-card flat>
                                            <h5>
                                                <v-card-title ma-0>
                                                    지수조치 현황(DBF 500 Index)
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon dark @click="dialog = false">
                                                        <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                            </h5>
                                            <div class="index3pop2_con">
                                                <v-list subheader two-line>
                                                    <v-list-tile>
                                                        <v-list-tile-title>조치 기준일</v-list-tile-title>
                                                        <v-list-tile-content>2018.10.11</v-list-tile-content>
                                                    </v-list-tile>
                                                </v-list>
                                            </div>
                                            <!--indexDetailrtmenupop></indexDetailrtmenupop-->
                                            <v-card class="pop_bot_h"></v-card>
                                        </v-card>
                                    </v-dialog>
                                </v-subheader>
                                <p class="text_red">
                                    <v-icon small>arrow_right</v-icon>3개 지수에 대한 조치 발생
                                </p>
                            </v-list-tile-content>
                            <v-list-tile-content class="rightmenu_con Oper_menu">
                                <v-subheader>
                                    <v-icon small>build</v-icon>Operation Tools
                                </v-subheader>
                                <v-card flat class="w100">
                                    <v-list>
                                        <v-list-tile @click class="border_b" v-model="text2">
                                            <v-list-tile-avatar>
                                                <v-icon value="산출 현황">exposure</v-icon>
                                            </v-list-tile-avatar>
                                            <v-list-tile-content class="rm_con_h">
                                                <v-list-tile-title>iNAV 산출 현황</v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                        <v-list-tile @click class="border_b">
                                            <v-list-tile-avatar>
                                                <v-icon value="Performance" icon>loop</v-icon>
                                            </v-list-tile-avatar>
                                            <v-list-tile-content class="rm_con_h">
                                                <v-list-tile-title>ETP Performance</v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                        <v-list-tile @click class="border_b">
                                            <v-list-tile-avatar>
                                                <v-icon value="Customize" icon>poll</v-icon>
                                            </v-list-tile-avatar>
                                            <v-list-tile-content class="rm_con_h">
                                                <v-list-tile-title>Customize</v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </v-card>
                            </v-list-tile-content>

                            <v-list-tile-content class="rightmenu_con">
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
                                            <v-dialog v-model="dialog2" persistent max-width="500">
                                                <template v-slot:activator="{ on }">
                                                    <v-btn
                                                        outline
                                                        small
                                                        color="primary"
                                                        dark
                                                        v-on="on"
                                                    >
                                                        <v-icon small color="primary">add</v-icon>자산추가
                                                    </v-btn>
                                                </template>
                                                <v-card>
                                                    <h5>
                                                        <v-card-title ma-0>
                                                            비교자산추가
                                                            <v-spacer></v-spacer>
                                                            <v-btn
                                                                icon
                                                                dark
                                                                @click="dialog2 = false"
                                                            >
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

            basicData           :   {},
            etpBasic            :   {},
            indexBasic          :   {},
            etpInfos            :   {}
        };
    },
    components: {
        EtpManageDetailBasicInfoTab: EtpManageDetailBasicInfoTab,
        EtpManageDetailAnalysisTab: EtpManageDetailAnalysisTab
    },
    mounted: function() {
        var vm = this;

        vm.basicData.f16012     =   vm.$route.query.f16012;     /* 국제표준코드 */
        vm.basicData.f16257     =   vm.$route.query.f16257;     /* ETP기초지수코드 */
        vm.basicData.f34239     =   vm.$route.query.f34239;     /* ETP기초지수MID */

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

