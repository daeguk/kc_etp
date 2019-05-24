<template>
    <v-container>
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
                    KODEX200
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
                        <v-layout>
                            <v-flex xs6 class="sumul_card_line">
                                <ul>
                                    <li class="list_tit">산출방식</li>
                                    <li>PDF</li>
                                </ul>
                                <ul>
                                    <li class="list_tit">전일NAV</li>
                                    <li>12430.23</li>
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
                            </v-flex>
                            <v-flex xs6>
                                <ul>
                                    <li class="list_tit">CU시가총액</li>
                                    <li>1235879665654411111</li>
                                </ul>
                                <ul>
                                    <li class="list_tit">CU당 주식수</li>
                                    <li>4000</li>
                                </ul>
                                <ul>
                                    <li class="list_tit">
                                        <b>iNAV 계산결과</b>
                                    </li>
                                    <li class="text_red">
                                        <b>12435.13</b>
                                        <br>
                                        <span class="float_r">0.56%</span>
                                    </li>
                                </ul>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card>
        </div>

        <!--pdf table-->
        <h4>
            PDF
            <span>2018.11.10</span>
        </h4>
        <table id class="tbl_type" style="width:100%">
            <colgroup>
                <col width="7%">
                <col width="18%">
                <col width="12%">
                <col width="15%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="18%">
            </colgroup>
            <thead>
                <tr>
                    <th class="txt_left">분류</th>
                    <th class="txt_left">코드</th>
                    <th>종목</th>
                    <th class="txt_right">CU수량</th>
                    <th class="txt_right">비중</th>
                    <th class="txt_right">현재가</th>
                    <th class="txt_right">기준가</th>
                    <th class="txt_right">CU시가총액</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>예금</td>
                    <td class="txt_left">KRD0125422222</td>
                    <td>원화현금</td>
                    <td>
                        <input type="text" class="txt_right">
                    </td>
                    <td class="txt_right">3.52</td>
                    <td class="txt_right">3.32</td>
                    <td class="txt_right">
                        220.22
                        <br>
                        <span class="text_S text_red">0.98%</span>
                    </td>
                    <td class="txt_right">2565751</td>
                </tr>
            </tbody>
        </table>
    </v-container>
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

        };
    },
    components: {

    },    
    mounted: function() {
        var vm = this;

        console.log( "########## EtpOperInfoInavPdf.vue #################" );

    },
    created: function() {},
    beforeDestory: function() {
        var vm = this;
    },

    methods: {
        
        fn_close() {
            var vm = this;

            vm.$emit( "fn_close", "pdf" );
        }        
    }
};
</script>