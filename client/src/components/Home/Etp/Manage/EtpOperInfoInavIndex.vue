<template>
    <v-card flat>
        <h5>
            <v-card-title ma-0>
                ETF iNAV Realtime Calculator
                <v-spacer></v-spacer>
                <v-btn icon dark @click="fn_close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>
        </h5>
        <div class="ETPInavpop1">
            <v-list subheader>
                <h6>
                    KODEX 미국S&P500 선물
                    <span>069500</span>
                </h6>
                <v-list-tile>
                    <v-list-tile-title class="sumu_text">Sumulation Mode</v-list-tile-title>
                    <v-list-tile-content class="sumul_btn_w">
                        <ul>
                            <li>
                                <v-switch v-model="switch1" color="primary"></v-switch>
                            </li>
                            <li>
                                <v-btn small flat icon>
                                    <v-icon class="btn_on">play_circle_outline</v-icon>
                                </v-btn>
                            </li>
                            <li>
                                <v-btn small flat icon>
                                    <v-icon>refresh</v-icon>
                                </v-btn>
                            </li>
                        </ul>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </div>
        <div class="sumul_w">
            <v-card flat class="sumul_card_w">
                <v-layout>
                    <v-flex xs12>
                        <ul>
                            <li class="list_tit">산출방식</li>
                            <li>지수수익률</li>
                        </ul>
                        <ul>
                            <li class="list_tit">유형</li>
                            <li>환노출(F)</li>
                        </ul>
                        <ul>
                            <li class="text_coment">iNAV=전일NAV*(1+배율*지수등락률)*환변동률</li>
                        </ul>
                        <ul>
                            <li class="list_tit">
                                <b>iNAV</b>
                                <br>
                                <span>외부공표</span>
                            </li>
                            <li class="text_red">
                                <b>12435.13</b>
                                <br>
                                <span class="float_r">0.56%</span>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit case2 txt_point">전일NAV</li>
                            <li class="input_mid">
                                <v-text-field value outline class="txt_right"></v-text-field>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit case2 txt_point">추적수익률</li>
                            <li class="input_mid">
                                <v-text-field value outline class="txt_right"></v-text-field>
                            </li>
                        </ul>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs12 class="sumul_card_w ver3">
                        <ul class="bot_line">
                            <li class="list_tit">기초지수</li>
                            <li>S&P 500 Futures Total R</li>
                        </ul>
                        <ul class="bot_line1">
                            <li class="list_tit">지수현재가</li>
                            <li class="align_r text_red">220.22</li>
                        </ul>
                        <!--ul class="bot_line2">
                                                    <li class="list_tit"><b>지수기준가</b><br><span>기준일</span></li>
                                                    <li class="align_r"><b>220.01</b><br><span>2018.10.11</span></li>
                        </ul!-->
                        <ul class="bot_line2">
                            <li class="list_tit">
                                <b>지수기준가</b>
                                <br>
                                <span>기준일</span>
                            </li>
                            <li>
                                <div>
                                    <v-text-field value outline class="txt_right"></v-text-field>
                                    <span class="float_r">2018.10.11</span>
                                </div>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit txt_point">등락률(%)</li>
                            <li class="align_r">
                                <b>0.98</b>
                            </li>
                        </ul>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs12 class="sumul_card_w ver3">
                        <ul class="bot_line">
                            <li class="list_tit">적용환율</li>
                            <li class="align_r">KRW-CNY</li>
                        </ul>
                        <ul class="bot_line1">
                            <li class="list_tit">매매기준율</li>
                            <li class="align_r text_red">162.90</li>
                        </ul>
                        <ul>
                            <li class="list_tit">KRW-USD</li>
                            <li class="align_r">1131.50</li>
                        </ul>
                        <ul class="bot_line1">
                            <li class="list_tit">USD-CNY</li>
                            <li class="align_r">6.9392</li>
                        </ul>
                        <ul class="bot_line2">
                            <li class="list_tit case2">장전기준율</li>
                            <li class="input_mid">
                                <v-text-field value outline class="txt_right"></v-text-field>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit txt_point">변동률</li>
                            <li class="align_r">
                                <b>0.98</b>
                            </li>
                        </ul>
                        <ul class="bot_line3">
                            <li class="list_tit txt_point">Other Factor</li>
                            <li class="align_r">
                                <b>-</b>
                            </li>
                        </ul>
                        <ul class="result">
                            <li class="list_tit txt_point1">iNAV 계산결과</li>
                            <li class="align_r text_red">
                                <b>12435.13</b>
                                <br>
                                <span class="float_r">0.58%</span>
                            </li>
                        </ul>
                    </v-flex>
                </v-layout>
            </v-card>
        </div>
    </v-card>
</template>   

<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'

import Config from '@/js/config.js';

var table01 = null;

export default {
    props : [ "paramData" ],
    data() {
        return {
            dialog: false,
            dialog2: false,
            dialog5: false,
            dialog6: false,
            modalFlag: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            tab4: null,
            items1: ["전체", "시장대표"],
            items4: ["ETP 운용정보", "지수관리", "PDF관리"],
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
            switch1: []

        };
    },
    components: {

    },    
    mounted: function() {
        var vm = this;

        console.log( "########## EtpOperInfoInavIndex.vue #################" );
        console.log( "paramData");
        console.log( vm.paramData );
    },
    created: function() {},
    beforeDestory: function() {
        var vm = this;
    },

    methods: {

        fn_close() {
            var vm = this;

            vm.$emit( "fn_close", "index" );
        }
    }
};
</script>