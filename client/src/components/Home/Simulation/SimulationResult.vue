<template>
    <v-layout row wrap class="content_margin etp_new">
        <v-flex grow>
            <v-card flat>
                <v-card-title primary-title>
                    <h3 class="headline" pb-0>
                        PORTFOLIO SIMULATION |
                        <span
                            class="grey--text"
                        >KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>
                    </h3>
                </v-card-title>
            </v-card>
            <v-card flat class="bot_pad1">
                <h4>테스트 결과
                    <span class="excel_btn"><button type='button'  class="exceldown_btn"></button></span>
                </h4>
                <div class="simul_graph"></div>
                <v-tabs v-model="activeTab" centered light>
                <v-tabs-slider></v-tabs-slider>
                <v-tab v-for="item in item" :key="item">{{ item }}</v-tab>
                </v-tabs>
                    <v-tabs-items v-model="activeTab">
            <!--리밸런싱내역 탭1-->
            <v-tab-item>
                <v-layout row wrap >
                    <v-flex grow xs12>
                        <v-card flat>
                            <table class="tbl_type ver10 mt-3">
                            <caption></caption>
                                <colgroup>
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                </colgroup>
                            <thead>
                            <tr>
                                <th class="txt_left">일자</th>
                                <th class="txt_right">Index</th>
                                <th class="txt_right">Balance</th>
                                <th class="txt_right">Return</th>
                                <th class="txt_right">BM(KOSPI200)</th>
                                <th class="txt_right">BM(1000환산)</th>
                                <th class="txt_right">BM return</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="txt_left">20190701</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">1,234,567</td>
                                <td class="txt_right">0.23%</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">0.23%</td>
                            </tr>
                            <tr>
                                <td class="txt_left">20190701</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">1,234,567</td>
                                <td class="txt_right">0.23%</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">0.23%</td>
                            </tr>
                            <tr>
                                <td class="txt_left">20190701</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">1,234,567</td>
                                <td class="txt_right">0.23%</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">1023.01</td>
                                <td class="txt_right">0.23%</td>
                            </tr>
                            </tbody>
                        </table>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-tab-item>
                    <!--일자별 지수 탭2-->
                    <v-tab-item>
                         <v-layout row wrap >
                            <v-flex grow xs12>
                            <v-card flat>
                            <table class="tbl_type ver10 mt-3">
                            <caption></caption>
                                <colgroup>
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                <col width="14%">
                                </colgroup>
                            <thead>
                            <tr>
                                <th class="txt_left">일자</th>
                                <th>Event</th>
                                <th class="txt_left">종목</th>
                                <th class="txt_right">변경전</th>
                                <th class="txt_right">변경후</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="txt_left">20190701</td>
                                <td>비중조절</td>
                                <td class="txt_left">삼성전자(005930)</td>
                                <td class="txt_right">30.0%</td>
                                <td class="txt_right">33.33%</td>
                            </tr>
                            <tr>
                                <td class="txt_left">20190701</td>
                                <td>비중조절</td>
                                <td class="txt_left">삼성전자(005930)</td>
                                <td class="txt_right">30.0%</td>
                                <td class="txt_right">33.33%</td>
                            </tr>
                            </tbody>
                        </table>
                        </v-card>
                    </v-flex>
                </v-layout>

            </v-tab-item>

            <!--시뮬레이션 설정 탭3-->
            <v-tab-item>
                <div class="simul_setup">
                <h6><span class="bullet"></span>리밸런싱</h6>
                    <v-layout>
                        <v-flex xs2>시작년도</v-flex>
                        <v-flex xs3>2018</v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex xs2>주기</v-flex>
                        <v-flex xs3>분기|첫 영업일</v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex xs2>횟수</v-flex>
                        <v-flex xs3>6회</v-flex>
                    </v-layout>
                    <h6><span class="bullet"></span>선정방식</h6>
                    <v-layout>
                        <v-flex xs2>시가총액</v-flex>
                        <v-flex xs3>2,000,000,000,000원 이상</v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex xs2>거래량</v-flex>
                        <v-flex xs3>3개월 평균 100만주 이상</v-flex>
                    </v-layout>
                </div>
            </v-tab-item>

            <!--분석정보1 탭4-->
            <v-tab-item>
             분석정보1
            </v-tab-item>
            <!--분석정보2 탭5-->
            <v-tab-item>
             분석정보2
            </v-tab-item>
            </v-tabs-items>
            <v-card flat>
                <div class="text-xs-center mt-3"><v-btn depressed color="primary" @click="fn_test">저장하기</v-btn></div>
            </v-card>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";


export default {
    
    data() {
        return {
            activeTab: 0,
            item: [
                "일자별지수",
                "리밸런싱내역",
                "시뮬레이션 설정",
                "분석정보#1",
                "분석정보#2"
            ]
        };
    },

    components: {
        
    },    

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;
    },

    methods: {

    }
};
</script>

