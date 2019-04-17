<template>
    <v-container fluid grid-list-md pa-2 mb-4>
        <v-layout row wrap class="indexlist_ww">
            <v-flex md6>
                <!--table1-->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">SUMMARY</h4>
                    <v-card flat class="indexinfo_list_table">
                        <v-layout row>
                            <v-flex xs6>발행사</v-flex>
                            <v-flex xs6 class="text_r">미래에셋자산운용</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>상장일</v-flex>
                            <v-flex xs6 class="text_r">2010.01.02</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>AUM</v-flex>
                            <v-flex xs6 class="text_r">102938471</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>CU수량</v-flex>
                            <v-flex xs6 class="text_r">1234</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>CU당 주식수</v-flex>
                            <v-flex xs6 class="text_r">4000</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>상장주식수</v-flex>
                            <v-flex xs6 class="text_r">15000000</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>일평균거래량</v-flex>
                            <v-flex xs6 class="text_r">4321</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>과표기준가</v-flex>
                            <v-flex xs6 class="text_r">9033.99</v-flex>
                        </v-layout>
                    </v-card>
                </div>
                <!--table1 end--->
            </v-flex>
            <v-flex md6>
                <!---table2--->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">INDEX Info</h4>
                    <v-card flat class="indexinfo_list_table">
                        <v-layout row>
                            <v-flex xs6>기초지수</v-flex>
                            <v-flex xs6 class="text_r">F-USDKRW</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>지수산출기관</v-flex>
                            <v-flex xs6 class="text_r">KRX</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>기준지수</v-flex>
                            <v-flex xs6 class="text_r">1000.00</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>기준일</v-flex>
                            <v-flex xs6 class="text_r">2010.01.02</v-flex>
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
                <!---table2 end--->
            </v-flex>
            <v-flex xs12>
                <!--table3-->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">투자지표</h4>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-card flat class="indexinfo_list_table" style="padding-right:24px;">
                                <v-layout row>
                                    <v-flex xs6>전일NAV</v-flex>
                                    <v-flex xs6 class="text_r">9003.01</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>iNAV</v-flex>
                                    <v-flex xs6 class="text_r text_blue">9003.01<br><span>-0.21%</span></v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>추적오차율</v-flex>
                                    <v-flex xs6 class="text_r">0.27%</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>괴리율</v-flex>
                                    <v-flex xs6 class="text_r">-0.01%</v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs6>
                            <v-card flat class="indexinfo_list_table">
                                <v-layout row>
                                    <v-flex xs6>지수전일가</v-flex>
                                    <v-flex xs6 class="text_r">1154.39</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>지수현자가</v-flex>
                                    <v-flex xs6 class="text_r text_blue">9003.01<br><span>-0.21%</span></v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </div>
                <!--table3 end--->
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Config from "@/js/config.js";

export default {
    props: [""],
    data() {
        return {
            index_item: {},
            rowsPerPageItems: [50, 50],
            etp_items: []
        };
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        this.getIndexBaseInfo();
        this.getIndexInEtpInfo();
    },
    methods: {
        getIndexBaseInfo: function() {
            var vm = this;
            console.log("getIndexBaseInfo");

            axios
                .get(Config.base_url + "/user/index/getIndexBaseInfo", {
                    params: {
                        jisu_cd: vm.$route.query.jisu_cd,
                        market_id: vm.$route.query.market_id
                    }
                })
                .then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("지수정보가 없습니다.");
                    } else {
                        var items = response.data.results;
                        vm.index_item = items[0];
                        console.log(
                            "response=" + JSON.stringify(vm.index_item)
                        );
                        //this.list_cnt = this.results.length;
                    }
                });
        },
        getIndexInEtpInfo: function() {
            var vm = this;

            axios
                .get(Config.base_url + "/user/index/getIndexInEtpInfo", {
                    params: {
                        jisu_cd: vm.$route.query.jisu_cd,
                        market_id: vm.$route.query.market_id
                    }
                })
                .then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("지수정보가 없습니다.1");
                    } else {
                        var items = response.data.results;
                        vm.etp_items = items;
                        console.log(
                            "etp_response=" + JSON.stringify(vm.etp_items)
                        );
                        //this.list_cnt = this.results.length;
                    }
                });
        }
    }
};
</script>