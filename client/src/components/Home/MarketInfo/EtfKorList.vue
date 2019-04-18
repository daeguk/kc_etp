<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-layout row>
                        <v-flex xs12>
                            <!---content내용--->
                            <v-card flat ma-3>
                                <div class="title01_w">
                                    <v-card-title primary-title>
                                        <div class="title_wrap01">
                                            <h3 class="headline mb-0">
                                                TIGER 미국달러선물레버러지
                                                <span
                                                    class="grey--text"
                                                >261110</span>
                                            </h3>
                                            <div class="right_btn">
                                                <v-layout align-right>
                                                    <v-flex xs12 sm4 text-xs-center>
                                                        <div class="btn_r">
                                                            <v-btn
                                                                outline
                                                                color="indigo"
                                                                small
                                                                :to="{path:'/index/manage', query:{'activeTab':'2'}}"
                                                            >목록으로 돌아가기</v-btn>
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
                                        9000
                                        <span class="text_blue">-25(-0.28%)</span>
                                        <p>Last Updated : 2018.09.23. 09:40:20</p>
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
                                                v-model="tab3"
                                                align-with-title
                                            >
                                                <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                                <v-tab v-for="item in items5" :key="item">{{ item }}</v-tab>
                                            </v-tabs>

                                            <v-tabs-items v-model="tab3">
                                                <v-tab-item>
                                                    <ETPinfotab1></ETPinfotab1>
                                                </v-tab-item>
                                                <v-tab-item>
                                                    <ETPinfotab2></ETPinfotab2>
                                                </v-tab-item>
                                            </v-tabs-items>
                                        </v-flex>
                                    </v-layout>
                                </div>
                            </v-card>
                            <!---content내용end--->
                        </v-flex>
                        <!--rightmenu---->
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
                                    <v-list-tile-content class="rightmenu_con2 rightmenu_line">
                                        <v-layout class="w100">
                                            <v-flex xs12>
                                                <v-tabs v-model="tab" centered>
                                                    <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                                    <v-tab
                                                        v-for="item in items1"
                                                        :key="item"
                                                    >{{ item }}</v-tab>
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
                                                    <v-dialog
                                                        v-model="dialog"
                                                        persistent
                                                        max-width="500"
                                                    >
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
                                                                        @click="dialog = false"
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
                                                                        <v-tabs-slider
                                                                            color="#00fffc"
                                                                        ></v-tabs-slider>
                                                                        <v-tab
                                                                            v-for="item in items4"
                                                                            :key="item"
                                                                        >{{ item }}</v-tab>
                                                                    </v-tabs>
                                                                    <v-tabs-items v-model="tab2">
                                                                        <v-tab-item>
                                                                            <!--infopoptab1></infopoptab1-->
                                                                        </v-tab-item>
                                                                        <v-tab-item>
                                                                            <!--infopoptab2></infopoptab2-->
                                                                        </v-tab-item>
                                                                        <v-tab-item>
                                                                            <!--infopoptab3></infopoptab3-->
                                                                        </v-tab-item>
                                                                    </v-tabs-items>
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
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import infopoptab1 from "@/components/Home/index/manage/infopoptab1.vue";
import infopoptab2 from "@/components/Home/index/manage/infopoptab2.vue";
import infopoptab3 from "@/components/Home/index/manage/infopoptab3.vue";
import ETPinfotab1 from "@/components/Home/MarketInfo/ETPinfotab1.vue";
import ETPinfotab2 from "@/components/Home/MarketInfo/ETPinfotab2.vue";
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";
var importance_grid = null;

export default {
    props: [],
    data() {
        return {
            dialog: false,
            mini: false,
            right: null,
            results: [],
            tab: null,
            tab2: null,
            tab3: null,
            items1: ["전체", "시장대표"],
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
            items4: ["ETF", "ETN", "INDEX"],
            items5: ["기본정보", "분석정보"]
        };
    },
    components: {
        infopoptab1: infopoptab1,
        infopoptab2: infopoptab2,
        infopoptab3: infopoptab3,
        ETPinfotab1: ETPinfotab1,
        ETPinfotab2: ETPinfotab2,
    },
    computed: {},
    mounted: function() {
        //this.getEtfKorList(); 
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
        getEtfKorList: function() {
            console.log("getEtfKorList");
            var vm = this;

            axios
                .get(Config.base_url + "/user/marketinfo/getetfkorlist", {
                    params: {
                        // "bbs_id" : vm.bbs_id,
                        // "seloption" : vm.seloption,
                        // "searchinfo" : vm.searchinfo,
                        // "curPage": vm.curPage,
                        // "perPage": vm.perPage
                    }
                })
                .then(function(response) {
                    console.log(response);
                    if (response.data.success == false) {
                        alert("해당 종목이 없습니다");
                    } else {
                        var items = response.data.results;
                        var tcount = response.data.count;
                        // items.forEach(function(item, index) {
                        //   if(item.kor_for_type == 'K') {
                        //     item.kor_for_type = "국내";
                        //   }else if(item.kor_for_type == 'F') {
                        //     item.kor_for_type = "해외";
                        //   }else {
                        //     item.kor_for_type = "";
                        //   }
                        // });
                        vm.results = items;
                        vm.count = tcount;
                    }
                });
        }
    }
};
</script>

