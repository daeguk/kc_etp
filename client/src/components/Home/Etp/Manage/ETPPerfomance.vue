<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-tabs slot="extension" v-model="tab5" align-with-title light>
                    <v-tabs-slider color="#1e99e8"></v-tabs-slider>

                    <v-tab v-for="item in items5" :key="item">{{ item }}</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab5">
                    <v-tab-item>
                        <Info></Info>
                    </v-tab-item>
                    <v-tab-item>
                        <Index></Index>
                    </v-tab-item>
                    <v-tab-item>
                        <Pdf></Pdf>
                    </v-tab-item>
                </v-tabs-items>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            ETP 운용 정보
                            <p>
                                Total
                                <span class="text_result">120</span> results
                                <span class="toggle2">
                                    <v-btn-toggle v-model="text" class="toggle_01">
                                        <v-btn flat value="전종목" v-on:click.stop>전종목</v-btn>
                                        <v-btn flat value="국내" v-on:click.stop>국내</v-btn>
                                        <v-btn flat value="해외" v-on:click>해외</v-btn>
                                        <v-btn flat value="관심종목" v-on:click.stop>관심종목</v-btn>
                                    </v-btn-toggle>
                                </span>
                            </p>
                            <!--오른쪽 메뉴 종목으로 찾기 검색 후 
                            <p class="text_result">
                                6 results
                            </p-->
                            <p class="sub_txt">기준일 : 2019.3.20</p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="15%">
                                <col width="8%">
                                <col width="8%">
                                <col width="8%">
                                <col width="8%">
                                <col width="5%">
                                <col width="5%">
                                <col width="5%">
                                <col width="5%">
                                <col width="5%">
                                <col width="10%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th rowspan="2" class="txt_left">종목</th>
                                    <th rowspan="2" class="txt_right">iNAV</th>
                                    <th rowspan="2" class="txt_right">전일최종NAV</th>
                                    <th rowspan="2" class="txt_right">추적오차율</th>
                                    <th rowspan="2" class="txt_right">괴리율</th>
                                    <th colspan="5">수익률</th>
                                    <th rowspan="2"></th>
                                </tr>
                                <tr>
                                    <th class="txt_right th_line">1주</th>
                                    <th class="txt_right th_line">1개월</th>
                                    <th class="txt_right th_line">3개월</th>
                                    <th class="txt_right th_line">6개월</th>
                                    <th class="txt_right th_line">연환산</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="txt_left line2">
                                        <span>
                                            <b>KODEX 200</b>
                                            <br>000100
                                            <span>
                                                <div class="txt_new">new</div>
                                            </span>
                                        </span>
                                    </td>
                                    <td class="txt_right">
                                        277166.42
                                        <br>
                                        <span class="text_S text_blue">-0.14%</span>
                                    </td>
                                    <td class="txt_right">1.26</td>
                                    <td class="txt_right">-4.51</td>
                                    <td class="txt_right">3.52</td>
                                    <td class="txt_right">3.32</td>
                                    <td class="txt_right">1.26</td>
                                    <td class="txt_right">-4.51</td>
                                    <td class="txt_right">3.52</td>
                                    <td class="txt_right">3.52</td>
                                    <td>
                                        <div class="tooltip">
                                            <router-link to="etpManageDetail">
                                                <button
                                                    type="button"
                                                    class="btn_icon v-icon material-icons"
                                                >equalizer</button>
                                            </router-link>
                                            <span class="tooltiptext" style="width:70px;">ETP정보</span>
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
                    <!-- rightmenu -->
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
                                                to="InfoEtpInav"
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
                                                to="ETPPerfomance"
                                                class="border_b"
                                            >
                                                <v-list-tile-avatar>
                                                    <v-icon value="Performance" icon>loop</v-icon>
                                                </v-list-tile-avatar>
                                                <v-list-tile-content class="rm_con_h">
                                                    <v-list-tile-title>ETP Performance</v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile @click.stop class="border_b">
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
                                                    <!--오른쪽 메뉴 하단 리스트 영역 -->
                                                    <v-layout row class="w100 pt-2">
                                                        <v-flex xs12>
                                                            <v-card flat>
                                                                <v-list two-line subheader>
                                                                    <v-list-tile
                                                                        v-for="item in items2"
                                                                        :key="item.title"
                                                                        @click.stop
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
                                                    <!--오른쪽 메뉴 하단 리스트 영역 -->
                                                </v-tab-item>
                                                <v-tab-item>
                                                    <!--오른쪽 메뉴 하단 리스트 영역 -->
                                                    <v-layout row class="w100 pt-2">
                                                        <v-flex xs12>
                                                            <v-card flat>
                                                                <v-list two-line subheader>
                                                                    <v-list-tile
                                                                        v-for="item in items3"
                                                                        :key="item.title"
                                                                        @click.stop
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
                                                    <!--오른쪽 메뉴 하단 리스트 영역 end -->
                                                </v-tab-item>
                                            </v-tabs-items>
                                        </v-flex>
                                    </v-layout>
                                    <!-- 자산추가 팝업 -->
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

                                                        <!--비교자산 탭 -->

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
                                                        <!--비교자산 탭end -->
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
                                    <!--자산추가 팝업 end -->
                                </v-list-tile-content>
                            </v-list>
                        </v-navigation-drawer>
                    </v-card>
                    <!--rightmenu end -->
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";
import Info from "./Info.vue";
import Index from "./Index.vue";
import Pdf from "./Pdf.vue";

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            text: "전종목",
            text2: "Performance",
            dialog: false,
            dialog2: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            tab5: null,
            items1: ["전체", "시장대표"],
            items5: ["ETP 운용정보", "지수관리", "PDF 관리"],
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
            mini: false,
            right: null,
            desserts: [],
            components: {
                Info: Info,
                Index: Index,
                Pdf: Pdf
            }
        };
    },
    mounted: function() {},
    created: function() {},
    beforeDestory: function() {}
};
</script>

