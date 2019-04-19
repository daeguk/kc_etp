<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex xs12>
                <v-carousel light hide-delimiters height="250px" interval="10000">
                    <v-carousel-item class="bg_W market_layout_w" v-for="(item, index) in representGrpList" :key="index">
                        <v-layout class="market_card_layout">
                            <v-flex>
                                <v-card flat>
                                    <div class="market_card_w line_l">
                                        <div class="market_card">
                                            <h6>
                                                {{ item.one.f16002 }}
                                                <p>
                                                    {{ item.one.f15001 }}
                                                    <span class="text_blue">{{ item.one.f15472 }}({{ item.one.f15004 }} %)</span>
                                                </p>
                                            </h6>
                                            <ul>
                                                <li>
                                                    ETF-{{ item.one.grp_etf_cnt }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM 30,000K</span>
                                                </li>
                                                <li>
                                                    ETN-{{ item.one.grp_etn_cnt }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM 30,000K</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>
                            
                            <v-flex>
                                <v-card flat>
                                    <div class="market_card_w">
                                        <div class="market_card">
                                            <h6>
                                                {{ item.two.f16002 }}
                                                <p>
                                                    {{ item.two.f15001 }}
                                                    <span class="text_red">{{ item.two.f15472 }}({{ item.two.f15004 }} %)</span>
                                                </p>
                                            </h6>
                                            <ul>
                                                <li>
                                                    ETF-{{ item.two.grp_etf_cnt }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM 30,000K</span>
                                                </li>
                                                <li>
                                                    ETN-{{ item.two.grp_etn_cnt }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM 30,000K</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>
                            <v-flex>
                                <v-card flat>
                                    <div class="market_card_w">
                                        <div class="market_card">
                                            <h6>
                                                {{ item.three.f16002 }}
                                                <p>
                                                    {{ item.three.f15001 }}
                                                    <span class="text_red">{{ item.three.f15472 }}({{ item.three.f15004 }} %)</span>
                                                </p>
                                            </h6>
                                            <ul>
                                                <li>
                                                    ETF-{{ item.three.grp_etf_cnt }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM 30,000K</span>
                                                </li>
                                                <li>
                                                    ETN-{{ item.three.grp_etn_cnt }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM 30,000K</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>
                            <v-flex>
                                <v-card flat>
                                    <div class="market_card_w">
                                        <div class="market_card">
                                            <h6>
                                                {{ item.four.f16002 }}
                                                <p>
                                                    {{ item.four.f15001 }}
                                                    <span class="text_red">{{ item.four.f15472 }}({{ item.four.f15004 }} %)</span>
                                                </p>
                                            </h6>
                                            <ul>
                                                <li>
                                                    ETF-{{ item.four.grp_etf_cnt }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM 30,000K</span>
                                                </li>
                                                <li>
                                                    ETN-{{ item.four.grp_etn_cnt }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM 30,000K</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>


            <!---테이블1--->
            <v-flex grow xs12 mt-3>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            KOSPI 200
                            <p>
                                Total
                                <span class="text_result">120</span> results
                                <span>기준일 :2018.10.20</span>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="15%">
                                <col width="10%">
                                <col width="15%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>종목</th>
                                    <th>1-Week</th>
                                    <th>1-Month비중</th>
                                    <th>3-Month</th>
                                    <th>YTD</th>
                                    <th>1-Year</th>
                                    <th>3-Year</th>
                                    <th>5-Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="txt_left line2">
                                        <span>
                                            <b>KODEX 200</b>
                                            <br>000100
                                            <span>
                                                <div class="text_new">new</div>
                                            </span>
                                        </span>
                                    </td>
                                    <td class="align_r text_blue">
                                        277166.42
                                        <br>
                                        <span class="text_S">-0.14%</span>
                                    </td>
                                    <td>1.26</td>
                                    <td>-4.51</td>
                                    <td>3.52</td>
                                    <td>3.32</td>
                                    <td class="align_r text_red">
                                        220.22
                                        <br>
                                        <span class="text_S">0.98%</span>
                                    </td>
                                    <td>
                                        <div class="tooltip">
                                            <button
                                                type="button"
                                                class="btn_icon v-icon material-icons"
                                            >equalizer</button>
                                            <span class="tooltiptext" style="width:70px;">지수정보</span>
                                        </div>
                                        <div class="tooltip">
                                            <button
                                                type="button"
                                                class="btn_icon v-icon material-icons"
                                            >picture_as_pdf</button>
                                            <span class="tooltiptext" style="width:70px;">PDF관리</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card>
                </v-card>
            </v-flex>
            <!---테이블1 end--->

            <!---테이블2--->
            <v-flex grow xs12 mt-3>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            KOSDAQ 150
                            <p>
                                Total
                                <span class="text_result">120</span> results
                                <span>기준일 :2018.10.20</span>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="15%">
                                <col width="10%">
                                <col width="15%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>종목</th>
                                    <th>1-Week</th>
                                    <th>1-Month비중</th>
                                    <th>3-Month</th>
                                    <th>YTD</th>
                                    <th>1-Year</th>
                                    <th>3-Year</th>
                                    <th>5-Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="txt_left line2">
                                        <span>
                                            <b>KODEX 200</b>
                                            <br>000100
                                            <span>
                                                <div class="text_new">new</div>
                                            </span>
                                        </span>
                                    </td>
                                    <td class="align_r text_blue">
                                        277166.42
                                        <br>
                                        <span class="text_S">-0.14%</span>
                                    </td>
                                    <td>1.26</td>
                                    <td>-4.51</td>
                                    <td>3.52</td>
                                    <td>3.32</td>
                                    <td class="align_r text_red">
                                        220.22
                                        <br>
                                        <span class="text_S">0.98%</span>
                                    </td>
                                    <td>
                                        <div class="tooltip">
                                            <button
                                                type="button"
                                                class="btn_icon v-icon material-icons"
                                            >equalizer</button>
                                            <span class="tooltiptext" style="width:70px;">지수정보</span>
                                        </div>
                                        <div class="tooltip">
                                            <button
                                                type="button"
                                                class="btn_icon v-icon material-icons"
                                            >picture_as_pdf</button>
                                            <span class="tooltiptext" style="width:70px;">PDF관리</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card>
                </v-card>
            </v-flex>
            <!---테이블2 end--->
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
        </v-layout>
    </v-container>
</template>

<script>
//import infopoptab1 from "../index/manage/infopoptab1.vue";
//import infopoptab2 from "../index/manage/infopoptab2.vue";
//import infopoptab3 from "../index/manage/infopoptab3.vue";
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
            toggle_one: "",
            search: "",
            drawer: "",
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
            items4: ["ETF", "ETN", "INDEX"]


            ,   representList       :   []
            ,   representGrpList    :   []

            ,   ctgJisuList         :   []
            ,   ctgJisuByEtpList    :   []
            ,   ctgJisuByEtpJson    :   {}
        };
    },
    components: {
        //infopoptab1: infopoptab1,
        //infopoptab1: infopoptab1,
        //infopoptab1: infopoptab1
    },
    computed: {},
    mounted: function() {
        this.getEtpRepresentList();      
    },
    created: function() {},
    beforeDestroy() {},
    methods: {

        /*
         * 시장대표에 해당하는 지수 및 ETP 정보를 조회한다. ( ETP -> 시장대표 탭 선택시 )
         * 2019-04-16  bkLove(촤병국)
         */        
        getEtpRepresentList: function() {
            console.log("getEtfKorList");
            var vm = this;

            axios.post(Config.base_url + "/user/marketinfo/getEtpRepresentList", {
                data: {}
            }).then(function(response) {
                console.log(response);

                if( response.data ) {

                    vm.$nextTick().then(() => {
                        vm.representList    =   response.data.representList;
                        vm.representGrpList =   response.data.representGrpList;
                        vm.ctgJisuList      =   response.data.ctgJisuList;
                        vm.ctgJisuByEtpList =   response.data.ctgJisuByEtpList;
                        vm.ctgJisuByEtpJson =   response.data.ctgJisuByEtpJson;
                    });                      
                }
            });
        }
    }
};
</script>
