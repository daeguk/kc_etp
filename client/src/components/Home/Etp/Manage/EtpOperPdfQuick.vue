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

                                <v-btn
                                    small
                                    depressed
                                    outline
                                    color="primary"
                                    @click="fn_showDetailIndex"
                                >내역확인</v-btn>

                            </v-subheader>
                            <p class="text_red">
                                <v-icon small>arrow_right</v-icon>3개 지수에 대한 조치 발생
                            </p>
                        </v-list-tile-content>
                        <v-list-tile-content class="rightmenu_con Oper_menu">
                            <v-subheader>
                                <v-icon small>build</v-icon>PDF Tools
                            </v-subheader>
                            <v-card flat class="w100">
                                <v-list>
                                    <!---pdf긴급반영 팝업-->

                                    <v-list-tile class="border_b ver2" @click="fn_showDetailPdf(6)">
                                        <v-list-tile-avatar>
                                            <v-icon value="긴급반영">flash_on</v-icon>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>PDF 긴급반영</v-list-tile-title>
                                            <v-list-tile-sub-title>종목 추가, 수량 변경 요청</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <!---pdf긴급반영 팝업 팝업 end-->
                                    
                                    <!---iNAV 계산기 팝업---->
                                    <v-list-tile class="border_b ver2" @click="fn_showDetailPdf(7)">
                                        <v-list-tile-avatar>
                                            <v-icon value="계산기" icon>exposure</v-icon>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>iNAV 계산기</v-list-tile-title>
                                            <v-list-tile-sub-title>플랫폼 상에서 iNAV계산</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    
                                    <!---iNAV 계산기 팝업 end---->

                                    <v-list-tile
                                        class="border_b ver2 importance"
                                        @click="fn_setEtpOperPdfByRate"
                                    >
                                        <v-list-tile-avatar>
                                            <v-icon value="비중변경현황" icon>find_replace</v-icon>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>비중 변경현황</v-list-tile-title>
                                            <v-list-tile-sub-title>최근 5일간 비중 변경내역</v-list-tile-sub-title>
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
                                                <v-btn outline small color="primary" dark v-on="on">
                                                    <v-icon small color="primary">add</v-icon>자산추가
                                                </v-btn>
                                            </template>
                                            <v-card>
                                                <h5>
                                                    <v-card-title ma-0>
                                                        비교자산추가
                                                        <v-spacer></v-spacer>
                                                        <v-btn icon dark @click="dialog2 = false">
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
    props : [ "indexBasic" ],
    data() {
        return {
            text: "전종목",
            checkbox: true,
            date2: new Date().toISOString().substr(0, 10),
            menu2: false,
            text2: "",
            dialog: false,
            dialog2: false,
            dialog5: false,
            dialog6: false,
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
            items4: [],
            switch1: "",


            togglePdfByRate   : false,
        };
    },
    components: {

    },
    mounted: function() {},
    created: function() {},
    beforeDestory: function() {},
    methods : {

        fn_showDetailIndex() {
            var vm = this;

            vm.$emit( "fn_showDetailIndex", 4, vm.indexBasic );
        },        

        /*
         *  관심종목에서 그래프 선택시 상세정보를 보여준다.
         *  2019-05-03  bkLove(촤병국)
         */
        showDetail: function(gubun, paramData) {
            var vm = this;
            vm.$emit( "showDetail", gubun, paramData );
        },

        /*
         *  메시지창 정보가 필요한 경우 해당 정보를 보여준다.
         *  2019-05-03  bkLove(촤병국)
         */        
        showMessageBox: function(title, msg, option, gubun) {
            var vm = this;
            vm.$emit( "showMessageBox", title, msg, option, gubun );
        },

        fn_setEtpOperPdfByRate : function() {

            var vm = this;
            vm.togglePdfByRate  =   !vm.togglePdfByRate;

            var paramData   =   {};
            paramData.togglePdfByRate    =   vm.togglePdfByRate;            

            vm.$emit( "fn_setEtpOperPdfByRate", paramData );
        },

        fn_showDetailPdf : function( gubun ) {
            var vm = this;

            vm.$emit( "fn_showDetailPdf", gubun, {} );
        }
    }
};
</script>

