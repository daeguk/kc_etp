<template>
    <v-container fluid pa-2 mb-4>
        <v-layout row wrap class="indexlist_ww">
            <v-flex xs6>


                <!-- SUMMARY -->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">SUMMARY</h4>
                    <v-card flat class="indexinfo_list_table">
                        <v-layout row>
                            <v-flex xs6>발행사</v-flex>
                            <v-flex xs6 class="text_r">{{ etpBasic.F33961    /* ETP운용사명(한글명) */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>상장일</v-flex>
                            <v-flex xs6 class="text_r">{{ etpBasic.fmt_F16017 /* 상장일 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>AUM</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.F15028 ) /* 시가총액 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>CU수량</v-flex>
                            <v-flex xs6 class="text_r">{{ ["3", "4"].includes( etpBasic.F16493 ) ? "N/A" : new Intl.NumberFormat().format( etpBasic.F34515 ) /* ETF_1CU당금액 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>CU당 주식수</v-flex>
                            <v-flex xs6 class="text_r">{{ ["3", "4"].includes( etpBasic.F16493 ) ? "N/A" : new Intl.NumberFormat().format( etpBasic.F16499 ) /* ETF_CU구성단위 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>상장주식수</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.F16143 ) /* 상장 주식수 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>일평균거래량</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.F15015 ) /* 거래량 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>과표기준가</v-flex>
                            <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.F15007 ) /* 기준가 */ }}</v-flex>
                        </v-layout>
                    </v-card>
                </div>
            </v-flex>



            <v-flex xs6     v-if="fn_indexExistsYn">

                <!-- INDEX Info -->
                <div class="indexinfo_box01 v2">
                    <h4 class="mb-0">INDEX Info</h4>
                    <v-card flat class="indexinfo_list_table">
                        <v-layout row>
                            <v-flex xs3>기초지수</v-flex>
                            <v-flex xs7 class="text_r">{{ indexBasic.F16002     /* 한글종목명 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs3>지수산출기관</v-flex>
                            <v-flex xs7 class="text_r">{{ indexBasic.index_cal_method   /* 지수산출방식 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs3>기준지수</v-flex>
                            <v-flex xs7 class="text_r">{{ new Intl.NumberFormat().format( indexBasic.std_index )     /* 지수산출방식 */ }}</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs3>기준일</v-flex>
                            <v-flex xs7 class="text_r">{{  indexBasic.fmt_std_date  /* 기준일 */ }}</v-flex>
                        </v-layout>
                        <v-layout row class="pa-0">
                            <v-flex xs3 style="padding:12px !important">지수방법론</v-flex>
                            <v-flex xs7 class="text_r btn_pad1" v-if="false">
                                DBF_Bio_Theme_Methodology.pdf
                                <v-btn flat icon color="primary">
                                    <v-icon>move_to_inbox</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                       
                                <div class="btn_pad2">
                                <v-btn depressed dark color="primary" @click="showDetail()">지수정보확인</v-btn>
                                </div>
                            
                    </v-card>
                </div>
            </v-flex>


            <v-flex xs6     v-if="!fn_indexExistsYn">
                <div class="indexinfo_box01">
                    <h4 class="mb-0">INDEX Info</h4>

                    <v-card flat class="indexinfo_list_table">
                        <v-card-title>● INDEX 정보가 없습니다.</v-card-title>
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
                                    <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( etpBasic.F03329 )   /* 전일ETP지표가치(예탁원)(NAV/IV) */ }}</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>iNAV</v-flex>
                                    <v-flex xs6 class="text_r">
                                        {{ new Intl.NumberFormat().format( etpBasic.F15301  ) /* ETP지표가치(NAV/IV) */ }}
                                        <br>
                                        <span :class="etpBasic.F30818 >= 0 ? 'text_red' : 'text_blue' " >{{ etpBasic.F30818  /* 장중지표가치(iNAV/iIV)등락율 */ }}%</span>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>추적오차율</v-flex>
                                    <v-flex xs6 class="text_r">{{ etpBasic.F15302       /* 추적오차율 */ }}%</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>괴리율</v-flex>
                                    <v-flex xs6 class="text_r">{{ etpBasic.F15304       /* ETP괴리율 */ }}%</v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs6>
                            <v-card flat class="indexinfo_list_table">
                                <v-layout row>
                                    <v-flex xs6>지수전일가</v-flex>
                                    <v-flex xs6 class="text_r">{{ new Intl.NumberFormat().format( Number( etpBasic.F15318 ) - Number( etpBasic.F15319 ) ) /* ETP기초지수현재가 - ETP기초지수기준대비 */ }}</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>지수현재가</v-flex>
                                    <v-flex xs6 class="text_r">
                                        {{ new Intl.NumberFormat().format( etpBasic.F15318 )    /* ETP기초지수현재가 */ }}
                                        <br>
                                        <span :class="etpBasic.F30823 >= 0 ? 'text_red' : 'text_blue' ">{{ etpBasic.F30823    /* ETF관련지수등락율 */ }}%</span>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </div>
                <!-- table3 end -->
            </v-flex>
        </v-layout>
        <IndexInfoModal v-if="IndexModalFlag" :indexInfo="indexBasic"
          @closeIndexModal="closeIndexModal"></IndexInfoModal>
    </v-container>
</template>

<script>
import Config from "@/js/config.js";
import IndexInfoModal   from  '@/components/common/modal/IndexInfoModal.vue';

export default {
    props   :   [ "paramData", "etpBasic", "indexBasic" ],
    data() {
        return {
            index_item: {},
            rowsPerPageItems: [50, 50],
            etp_items: [],
            IndexModalFlag: false,
        };
    },
    components: {
        IndexInfoModal,
    },
    computed: {

        fn_indexExistsYn : function() {
            var vm = this;

            if(     typeof vm.indexBasic === "undefined" 
                ||  vm.indexBasic.length == 0
            ) {
                return  false;
            }

            return  true;
        }
    },

    created: function() {},
    beforeDestroy() {},
    mounted: function() {

        var vm = this;

        vm.$nextTick().then(() => {

        });
    },
    
    methods: {
        showDetail: function() {
          this.IndexModalFlag = true;
        },
        closeIndexModal: function() {
          this.IndexModalFlag = false;
        },
    }
};
</script>