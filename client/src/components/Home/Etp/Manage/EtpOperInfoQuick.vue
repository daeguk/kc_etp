<template>

    <v-container>

        <v-layout row wrap class="content_margin">

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
                                    <v-list-tile
                                        router-link
                                        to="/etp/manage/etpOperControlMenuInav"
                                        class="border_b"
                                        v-model="text2"
                                    >
                                        <v-list-tile-avatar>
                                            <v-icon value="산출 현황">exposure</v-icon>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>iNAV 산출 현황</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                    <v-list-tile
                                        router-link
                                        to="EtpOperPerformance"
                                        class="border_b"
                                    >
                                        <v-list-tile-avatar>
                                            <v-icon value="Performance" icon>loop</v-icon>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>ETP Performance</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <v-dialog v-model="dialog5" persistent max-width="550">
                                        <template v-slot:activator="{ on }">
                                            <v-list-tile v-on="on" class="border_b">
                                                <v-list-tile-avatar>
                                                    <v-icon value="Customize" icon>poll</v-icon>
                                                </v-list-tile-avatar>
                                                <v-list-tile-content class="rm_con_h">
                                                    <v-list-tile-title>Customize</v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </template>
                                        <!---ETP운용화면 항목설정  팝업-->
                                        <v-card class="listset_pop">
                                            <h5>
                                                <v-card-title ma-0>
                                                    ETP 운용화면 항목설정
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon @click="dialog5 = false">
                                                        <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                            </h5>

                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="iNAV"
                                                        value="iNAV"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="기초지수명"
                                                        value="기초지수명"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="ETF전일가"
                                                        value="ETF전일가"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="전일NAV"
                                                        value="전일NAV"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="기초지수현재가"
                                                        value="기초지수현재가"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="AUM"
                                                        value="AUM"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="추적오차율"
                                                        value="추적오차율"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="기초지수전일가"
                                                        value="기초지수전일가"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="과표기준가"
                                                        value="과표기준가"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="괴리율"
                                                        value="괴리율"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="ETF현재가"
                                                        value="ETF현재가"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selected"
                                                        label="과세구분"
                                                        value="과세구분"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>

                                            <v-card flat class="pop_btn_w text-xs-center">
                                                <v-btn depressed color="primary" @click>추가하기</v-btn>
                                            </v-card>
                                        </v-card>
                                        <!---ETP운용화면 항목설정 팝업 end-->
                                    </v-dialog>
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
                                        <v-dialog
                                            v-model="dialog2"
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

        </v-layout>

    </v-container>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            text: "전종목",
            checkbox: true,
            text2: "",
            dialog: false,
            dialog2: false,
            dialog5: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
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
            items4 : [],
            selected : [],

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

        };
    },
    mounted: function() {},
    created: function() {},
    beforeDestory: function() {}
};
</script>

