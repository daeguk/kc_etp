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
                    {{paramData.f16002}} <span>{{paramData.f16012}}</span>
                </h6>
                <v-list-tile>
                    <v-list-tile-title class="sumu_text">Simulation Mode</v-list-tile-title>
                    <v-list-tile-content class="sumul_btn_w">
                        <ul>
                            <li>
                                <v-switch v-model="SimulationSwitch" color="primary"></v-switch>
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
                            <li>{{paramData.f33929 == '0' ? 'PDF' : '지수수익율'}}</li>
                        </ul>
                        <ul>
                            <li class="list_tit">유형</li>
                            <li v-if="paramData.f34240 == 'H'">환헷지(H)</li>
                            <li v-if="paramData.f34240 == 'F'">환노출일반(F)</li>
                            <li v-if="paramData.f34240 == 'A'">지수환노출(A)</li>
                            <li v-if="paramData.f34240 == 'T'">복합배율(T)</li>
                            <li v-if="paramData.f34240 == 'K'">복합배율2(K)</li>
                            <li v-if="paramData.f34240 == 'I'">인도레버리지(I)</li>
                            <li v-if="paramData.f34240 == 'J'">KINDEX합성일본인버스(J)</li>
                        </ul>
                        <ul>
                            <li class="text_coment" v-if="paramData.f34240 == 'H'">iNAV=전일NAV*(1+기초지수등락율*배율)</li>
                            <li class="text_coment" v-if="paramData.f34240 == 'F'">iNAV=전일NAV*(1+기초지수등락율*배율)*(매매기준율/장전매매기준율)</li>
                            <li class="text_coment" v-if="paramData.f34240 == 'A'">iNAV=전일NAV*(1+기초지수등락율*배율*매매기준율/장전매매기준율)</li>
                            <li class="text_coment" v-if="paramData.f34240 == 'T'">iNAV=전일NAV*(1+기초지수등락율*배율)*(1+(매매기준율-장전매매기준율)/장전매매기준율*배율)</li>
                            <li class="text_coment" v-if="paramData.f34240 == 'K'">iNAV=전일NAV*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율)</li>
                            <li class="text_coment" v-if="paramData.f34240 == 'I'">iNAV=전일NAV*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율) *(1+전일등락율*배율)</li>
                            <li class="text_coment" v-if="paramData.f34240 == 'J'">iNAV=전일NAV*(1+기초지수등락율*배율-예상배당수익률)</li>
                        </ul>
                        <ul>
                            <li class="list_tit">
                                <b>iNAV</b>
                                <br>
                                <span>외부공표</span>
                            </li>
                            <li class="text_red" v-if="paramData.f30818 >= 0">                                        
                                <b>{{formatNumber(paramData.f15301)}}</b>
                                <br>
                                <span class="float_r">{{formatNumber(paramData.f30818)}}</span>
                            </li>
                            <li class="text_blue" v-if="paramData.f30818 < 0">                                        
                                <b>{{formatNumber(paramData.f15301)}}</b>
                                <br>
                                <span class="float_r">{{formatNumber(paramData.f30818)}}</span>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit case2 txt_point">전일NAV</li>
                            <li class="input_mid">
                                <v-text-field :value="formatNumber(paramData.f03329)" outline class="txt_right"></v-text-field>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit case2 txt_point">추적수익률</li>
                            <li class="input_mid">
                                <v-text-field :value="formatNumber(paramData.f15302)" outline class="txt_right"></v-text-field>
                            </li>
                        </ul>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs12 class="sumul_card_w ver3">
                        <ul class="bot_line">
                            <li class="list_tit">기초지수</li>
                            <li>{{paramData.f34777}}</li>
                        </ul>
                        <ul class="bot_line1">
                            <li class="list_tit">지수현재가</li>
                            <li class="align_r text_red">{{formatNumber(paramData.f15318)}}</li>
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
                                    <v-text-field :value="formatNumber(paramData.f15318 - paramData.f15319)" outline class="txt_right"></v-text-field>
                                    <span class="float_r">{{paramData.index_std_date}}</span>
                                </div>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit txt_point">등락률(%)</li>
                            <li class="align_r">
                                <b>{{formatNumber(paramData.f30823)}}%</b>
                            </li>
                        </ul>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs12 class="sumul_card_w ver3">
                        <ul class="bot_line">
                            <li class="list_tit">적용환율</li>
                            <li class="align_r">{{paramData.ex_rate_code}}</li>
                        </ul>
                        <ul class="bot_line1">
                            <li class="list_tit">매매기준율</li>
                            <li class="align_r text_red">{{formatNumber(paramData.f30819)}}</li>
                        </ul>
                        <ul>
                            <li class="list_tit">KRW-USD</li>
                            <li class="align_r">{{formatNumber(paramData.f18438)}}</li>
                        </ul>
                        <ul class="bot_line1">
                            <li class="list_tit">USD-CNY</li>
                            <li class="align_r"></li>
                        </ul>
                        <ul class="bot_line2">
                            <li class="list_tit case2">장전기준율</li>
                            <li class="input_mid">
                                <v-text-field :value="formatNumber(paramData.f30824)" outline class="txt_right"></v-text-field>
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
import util       from "@/js/util.js";
import Config from '@/js/config.js';

var table01 = null;

export default {
    props : [ "paramData" ],
    data() {
        return {
            SimulationSwitch: []

        };
    },   
    components: {

    },    
    mounted: function() {
        debugger;
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
        indexInavCal : function() {
            // ETP 계산 유형(H: 환햇지, F: 환노출, A: 지수환노출, T: 복합배율, K: 복합배율2, I: 인도레버리지, J: KINDEX합성일본인버스)

            /* 
               H. 환헷지
               iNAV=전일NAV*(1+기초지수등락율*배율)
            */
            if (paramData.f34240 == 'H') {
                
            /* 
               F. 환노출일반
               iNAV=전일NAV*(1+기초지수등락율*배율)*(매매기준율/장전매매기준율)
            */           
            } else if (paramData.f34240 == 'F') {
            
            /* 
               A.지수환노출 : ARIRAN차이나H레버리지(합성)
               iNAV=전일NAV*(1+기초지수등락율*배율*매매기준율/장전매매기준율)
            */
            } else if (paramData.f34240 == 'A') {
            
            /* 
               K. 복합배율2 : KINDEX 중국본토 레버리지 CSI300
               iNAV=전일NAV*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율)
            */
            } else if (paramData.f34240 == 'T') {
            
            /* 
               T.복합배율 :  TIGER 차이나A레버리지(합성)
               iNAV=전일NAV*(1+기초지수등락율*배율)*(1+(매매기준율-장전매매기준율)/장전매매기준율*배율)               
            */
            } else if (paramData.f34240 == 'K') {

            /*
                I. 인도레버리지, 전일ETP기초지수등락율(FID 34374 사용 하드코딩되있음)
                iNAV=전일NAV*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율) *(1+전일등락율*배율)
            */
            } else if (paramData.f34240 == 'I') {
            
            /* 
               J. KINDEX합성일본인버스, 1년에 2번 inav를 예상배당수익률(FID 18101 (주의)DEC -6)로 조정한다.
               iNAV=전일NAV*(1+기초지수등락율*배율-예상배당수익률)
            */
            } else if (paramData.f34240 == 'J') {
                
            } 
        },
        formatNumber:function(num) {
            return util.formatNumber(num);
        },

        fn_close() {
            var vm = this;

            vm.$emit( "fn_close", "index" );
        }
    }
};
</script>