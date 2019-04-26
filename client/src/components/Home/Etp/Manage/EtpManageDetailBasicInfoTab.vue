<template>
    <v-container fluid grid-list-md pa-2 mb-4>
        <v-layout row wrap class="indexlist_ww">
            <v-flex md6>


                <!-- SUMMARY -->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">SUMMARY</h4>
                    <v-card flat class="indexinfo_list_table">
                        <v-layout row>
                            <v-flex xs6>발행사</v-flex>
                            <v-flex xs6 class="text_r">{{ etpBasic.f16002 /* 한글종목명 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>상장일</v-flex>
                            <v-flex xs6 class="text_r">{{ etpBasic.fmt_f16017 /* 상장일 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>AUM</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.f15028 ) /* 시가총액 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>CU수량</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.f34515 ) /* ETF_1CU당금액 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>CU당 주식수</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.f16499 ) /* ETF_CU구성단위 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>상장주식수</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.f16143 ) /* 상장 주식수 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>일평균거래량</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.f15015 ) /* 거래량 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>과표기준가</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.f15007 ) /* 기준가 */ }}</v-flex>
                        </v-layout>
                    </v-card>
                </div>
            </v-flex>



            <v-flex md6>

                <!-- INDEX Info -->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">INDEX Info</h4>
                    <v-card flat class="indexinfo_list_table">
                        <v-layout row>
                            <v-flex xs6>기초지수</v-flex>
                            <v-flex xs6 class="text_r">{{ indexBasic.f16002     /* 한글종목명 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>지수산출기관</v-flex>
                            <v-flex xs6 class="text_r">{{ indexBasic.index_cal_method    /* 지수산출방식 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>기준지수</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( indexBasic.std_index )     /* 기준지수 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>기준일</v-flex>
                            <v-flex xs6 class="text_r">{{ indexBasic.fmt_std_date        /* 기준일 */ }}</v-flex>
                        </v-layout>
                        <v-layout row class="pa-0">
                            <v-flex xs6 style="padding:12px !important">지수방법론</v-flex>
                            <v-flex xs6 class="text_r btn_pad1">
                                <v-btn flat icon color="primary">
                                    <v-icon>move_to_inbox</v-icon>
                                </v-btn>DBF_Bio_Theme_Methodology.pdf
                            </v-flex>
                        </v-layout>
                        <v-layout style="border:none;">
                            <v-flex class="text-xs-center">
                                <v-btn depressed dark color="primary">지수정보확인</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </div>
            </v-flex>



            <v-flex xs12>

                <!--투자지표-->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">투자지표</h4>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-card flat class="indexinfo_list_table" style="padding-right:24px;">
                                <v-layout row>
                                    <v-flex xs6>전일NAV</v-flex>
                                    <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.f03329 )   /* 전일ETP지표가치(예탁원)(NAV/IV) */ }}</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>iNAV</v-flex>
                                    <v-flex xs6 class="text_r text_blue">
                                        {{ new Intl.NumberFormat().format( etpBasic.f19288  ) /* ETP지표가치_장종료-확정치차(NAV/IV) */ }}
                                        <br>
                                        <span>{{ etpBasic.f30818  /* 장중지표가치(iNAV/iIV)등락율 */ }}%</span>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>추적오차율</v-flex>
                                    <v-flex xs6 class="text_r">{{ etpBasic.f15302       /* 추적오차율 */ }}%</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>괴리율</v-flex>
                                    <v-flex xs6 class="text_r">{{ etpBasic.f15304       /* ETP괴리율 */ }}%</v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs6>
                            <v-card flat class="indexinfo_list_table">
                                <v-layout row>
                                    <v-flex xs6>지수전일가</v-flex>
                                    <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.f31892 ) /* 전일현금배당금액 */ }}</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>지수현재가</v-flex>
                                    <v-flex xs6 class="text_r text_blue">
                                        {{ new Intl.NumberFormat().format( etpBasic.f15318 )    /* ETP기초지수현재가 */ }}
                                        <br>
                                        <span>{{ etpBasic.f30823    /* ETF관련지수등락율 */ }}%</span>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </div>
                <!-- table3 end -->
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
import Config from "@/js/config.js";

export default {
    props: [],
    data() {
        return {
            index_item: {},
            rowsPerPageItems: [50, 50],
            etp_items: [],

            basicData           :   {},
            etpBasic            :   {},
            indexBasic          :   {},
            arrEtpPerformance   :   [],
        };
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {

        var vm = this;

        vm.basicData.f16012     =   vm.$route.query.f16012;     /* 국제표준코드 */
        vm.basicData.f16257     =   vm.$route.query.f16257;     /* ETP기초지수코드 */
        vm.basicData.f34239     =   vm.$route.query.f34239;     /* ETP기초지수MID */

        this.fn_getEtpBasic();          /* ETP 의 기본정보를 조회한다. */
    },
    methods: {
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

                    vm.$emit("receiveEtpBasic", vm.etpBasic, vm.indexBasic);
                }
            });
        },

    }
};
</script>