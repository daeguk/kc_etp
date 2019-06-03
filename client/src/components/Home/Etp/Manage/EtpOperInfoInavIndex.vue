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
                            <li v-if="SimulationSwitch == true">
                                <v-btn small flat icon>
                                    <v-icon class="btn_on" v-on:click="indexInavCal()">play_circle_outline</v-icon>
                                </v-btn>
                            </li>
                            <li v-if="SimulationSwitch == true">
                                <v-btn small flat icon>
                                    <v-icon v-on:click="init()">refresh</v-icon>
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
                            <li class="text_red align_r" v-if="paramData.f30818 >= 0">                                        
                                <b>{{formatNumber(paramData.f15301)}}</b>
                                <br>
                                <span class="float_r">{{formatNumber(paramData.f30818)}}</span>
                            </li>
                            <li class="text_blue align_r" v-if="paramData.f30818 < 0">                                        
                                <b>{{formatNumber(paramData.f15301)}}</b>
                                <br>
                                <span class="float_r">{{formatNumber(paramData.f30818)}}</span>
                            </li>
                        </ul>
                        <ul v-if="SimulationSwitch == true">
                            <li class="list_tit case2 txt_point">전일NAV</li>
                            <li class="input_mid">
                                <v-text-field  v-model="f03329"  outline class="txt_right"></v-text-field>
                            </li>
                        </ul>
                        <ul v-else>
                            <li class="list_tit case2 txt_point">전일NAV</li>
                            <li class="align_r">{{f03329}}</li>
                        </ul>

                        <ul v-if="SimulationSwitch == true">
                            <li class="list_tit case2 txt_point">배율</li>
                            <li class="input_mid">
                                <v-text-field v-model="f18453" outline class="txt_right"></v-text-field>
                            </li>                            
                        </ul>
                        <ul v-else>
                            <li class="list_tit case2 txt_point">배율</li>
                            <li class="align_r">{{f18453}}</li>
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
                            <li class="align_r text_red">{{f15318}}</li>
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
                                <div v-if="SimulationSwitch == true">
                                    <v-text-field   v-model="f15007" outline class="txt_right"></v-text-field>
                                    <span class="float_r">{{paramData.index_std_date}}</span>
                                </div>
                                <div v-else>
                                    <li class="align_r">
                                        {{f15007}}
                                    </li><br>
                                    <span class="float_r">{{paramData.index_std_date}}</span>
                                </div>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit txt_point">등락률(%)</li>
                            <li class="align_r">
                                <b>{{f30823}}%</b>
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
                            <li class="align_r text_red">{{f30819}}</li>
                        </ul>
                        <ul class="bot_line2">
                            <li class="list_tit case2">장전기준율</li>
                            <li class="input_mid" v-if="SimulationSwitch == true">
                                <v-text-field v-model="f30824" outline class="txt_right"></v-text-field>
                            </li>
                            <li class="align_r" v-else>
                                {{f30824}}
                            </li>
                        </ul>
                        <ul v-if="paramData.f34240 == 'F' || paramData.f34240 == 'A' || paramData.f34240 == 'K' || paramData.f34240 == 'I' ">
                            <li class="list_tit txt_point">매매기준율/장전기준율</li>
                            <li class="align_r">
                                <b>{{f15004_1}}</b>
                            </li>
                        </ul>
                        <ul v-else-if="paramData.f34240 == 'T'">
                            <li class="list_tit txt_point">등락률</li>
                            <li class="align_r">
                                <b>{{f15004_2}}</b>
                            </li>
                        </ul>
                        <ul v-else>
                            <li class="list_tit txt_point">변동률</li>
                            <li class="align_r">
                                <b>{{f15004}}</b>
                            </li>
                        </ul>
                        <ul class="bot_line3">
                            <li class="list_tit txt_point">Other Factor</li>
                            <li class="align_r">
                                <b>{{f18101}}</b>
                            </li>
                        </ul>
                        <ul class="result">
                            <li class="list_tit txt_point1">iNAV 계산결과</li>
                            <li class="align_r text_red">
                                <b>{{iNav}}</b>
                                <br>
                                <span class="float_r">{{iNavRate}}%</span>
                            </li>
                        </ul>
                    </v-flex>
                </v-layout>
            </v-card>
        </div>
        <ProgressBar ref="progress"></ProgressBar>        
    </v-card>
</template>   

<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import util       from "@/js/util.js";
import Config from '@/js/config.js';
import ProgressBar from "@/components/common/ProgressBar.vue";

var table01 = null;

export default {
    props : [ "paramData" ],
    data() {
        return {
            SimulationSwitch: false,
            f15318: 0,  /* 기초지수 현재가 */
            f30823: 0,  /* 기초지수 등락률 */
            f03329: 0,  /* 전일Nav */
            f15302: 0,  /* 추적수익률 */
            f15007: 0,  /* 지수기준가  */
            f30824: 0,  /* 장전기준율 */
            f30819: 0,  /* 매매기준율 */
            f15004: 0,  /* 변동률 */ 
            f15004_1: 0,  /* (매매기준율/장전매매기준율) */ 
            f15004_2: 0,  /* (매매기준율-장전매매기준율)/장전매매기준율 */ 
            f34374: 0,  /* 전일ETP기초지수등락율 */
            f18101: 0,  /* 예상배당수익률 : 배당율 */
            f18453: 0,  /* ETP 배율 */
            f18101: 0,  /* 예상 배당 수익률 */
            iNav: 0,    /* INav 계산결과 */
            iNavRate: 0, /* INav 계산결과 율 */
            readonly: true
        };
    },   
    components: {
        ProgressBar: ProgressBar
    },    
    mounted: function() {
        this.init();
    },
    created: function() {},
    beforeDestory: function() {
        var vm = this;
    },

    methods: {
        init: function() {
            var vm = this;
            // 전일 Nav
            vm.f03329 = vm.formatNumber(vm.paramData.f03329);
            // 추적수익률
            vm.f15302 = vm.formatNumber(vm.paramData.f15302);
            // 기준가
            vm.f15007 = vm.formatNumber(vm.paramData.f15318 - vm.paramData.f15319);
            // 매매기준율
            vm.f30819 = vm.formatNumber(vm.paramData.f30819);
            // 장전 기준윻
            vm.f30824 = vm.formatNumber(vm.paramData.f30824);
            
            // 기초 지수 현재가
            vm.f15318 = vm.formatNumber(vm.paramData.f15318);
            //기초지수 등락률 
            vm.f30823 = vm.formatNumber(vm.paramData.f30823);
            // 전일ETP기초지수등락율
            vm.f34374 = vm.formatNumber(vm.paramData.f34374);
            // 예상배당수익률 : 배당율
            vm.f18101 = vm.paramData.f18101;
            // ETP 배율 
            vm.f18453 = vm.paramData.f18453;
            // 변동률 
            vm.f15004 = (1 - vm.NtoS(vm.f30819) / vm.NtoS(vm.f30824)) * 100;
            vm.f15004 = vm.formatNumber(vm.f15004);

            // (ETP계산유형: F, A, K, I)매매기준율 /장전 매매 기준율
            vm.f15004_1 = vm.formatNumber(vm.paramData.f30819 / vm.paramData.f30824);

            // (ETP계산유형: T)(매매기준율 - 장전 매매 기준율)/ 장전매매기준율
            vm.f15004_2 = vm.formatNumber((vm.paramData.f30819 - vm.paramData.f30824) / vm.paramData.f30824);

            // 예상배당 수익률
            vm.f18101 = vm.formatNumber(vm.paramData.f18101);
            // INav 계산결과
            vm.iNav = vm.formatNumber(0);    
            // INav 계산결과 율
            vm.iNavRate = vm.formatNumber(0);    
            

            vm.indexInavCal();
        },
        indexInavCal : function() {
            var vm = this;
            util.processing(vm.$refs.progress, true);

            // 지수 등락률
            vm.f30823 = (vm.NtoS(vm.f15318) / vm.NtoS(vm.f15007)) - 1 ;

            // 변동률 
            vm.f15004 = (vm.NtoS(vm.f30824) / vm.NtoS(vm.f30819) - 1) * 100;

            // ETP 계산 유형(H: 환햇지, F: 환노출, A: 지수환노출, T: 복합배율, K: 복합배율2, I: 인도레버리지, J: KINDEX합성일본인버스)
            /* 
               H. 환헷지
               iNAV=전일NAV*(1+기초지수등락율*배율)
            */
            if (vm.paramData.f34240 == 'H') {
                vm.iNav = vm.NtoS(vm.f03329) * ( 1 + vm.f30823 * vm.f18453 );
            /* 
               F. 환노출일반
               iNAV=전일NAV*(1+기초지수등락율*배율)*(매매기준율/장전매매기준율)
            */           
            } else if (vm.paramData.f34240 == 'F') {

                vm.iNav = vm.NtoS(vm.f03329) * ( 1 + vm.f30823 * vm.NtoS(vm.f18453) ) * ( vm.NtoS(vm.f30819)	/ vm.NtoS(vm.f30824) );
                
            /* 
               A.지수환노출 : ARIRAN차이나H레버리지(합성)
               iNAV=전일NAV*(1+기초지수등락율*배율*매매기준율/장전매매기준율)
            */
            } else if (vm.paramData.f34240 == 'A') {
                vm.iNav = vm.NtoS(vm.f03329) * ( 1 + vm.f30823 * vm.NtoS(vm.f18453)  * vm.NtoS(vm.f30819)	/ vm.NtoS(vm.f30824) );
            /* 
               K. 복합배율2 : KINDEX 중국본토 레버리지 CSI300
               iNAV=전일NAV*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율)
            */
            } else if (vm.paramData.f34240 == 'K') {
                vm.iNav = vm.NtoS(vm.f03329) * ( 1 + (( 1 + vm.f30823 ) * vm.NtoS(vm.f30819) /  vm.NtoS(vm.f30824) - 1 ) * vm.NtoS(vm.f18453) );
            /* 
               T.복합배율 :  TIGER 차이나A레버리지(합성)
               iNAV=전일NAV*(1+기초지수등락율*배율)*(1+(매매기준율-장전매매기준율)/장전매매기준율*배율)               
            */
            } else if (vm.paramData.f34240 == 'T') {
                vm.iNav = vm.NtoS(vm.f03329) * ( 1 + vm.f30823 * vm.NtoS(vm.f18453) ) * (1 + (vm.NtoS(vm.f30819)  - vm.NtoS(vm.f30824)) / vm.NtoS(vm.f30824)	* vm.NtoS(vm.f18453) );
            /*
                I. 인도레버리지, 전일ETP기초지수등락율(FID 34374 사용 하드코딩되있음)
                iNAV=전일NAV*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율) *(1+전일등락율*배율)
            */
            } else if (vm.paramData.f34240 == 'I') {
                vm.iNav = vm.NtoS(vm.f03329) * ( 1 + (( 1 + vm.f30823 ) * vm.NtoS(vm.f30819) /  vm.NtoS(vm.f30824) - 1 ) * vm.NtoS(vm.f18453) ) * (1 + vm.NtoS(f34374) * vm.NtoS(vm.f18453));
            /* 
               J. KINDEX합성일본인버스, 1년에 2번 inav를 예상배당수익률(FID 18101 (주의)DEC -6)로 조정한다.
               iNAV=전일NAV*(1+기초지수등락율*배율-예상배당수익률)
            */
            } else if (vm.paramData.f34240 == 'J') {
                vm.iNav = vm.NtoS(vm.f03329) * (1 + vm.f30823 * vm.NtoS(vm.f18453) - vm.NtoS(vm.f18101)); 
            } 

            /* iNav 등락률 */
            vm.iNavRate =  ((vm.iNav / vm.NtoS(vm.f03329)) - 1) * 100;

            vm.iNav = vm.formatNumber(vm.iNav);
            vm.iNavRate = vm.formatNumber(vm.iNavRate);
            vm.f30823 = vm.formatNumber(vm.f30823*100);  /* 등락률 */
            vm.f15004 = vm.formatNumber(vm.f15004);  /* 변동률 */

            // (ETP계산유형: F, A, K, I)매매기준율 /장전 매매 기준율
            vm.f15004_1 = vm.formatNumber(vm.NtoS(vm.f30819) / vm.NtoS(vm.f30824));

            // (ETP계산유형: T)(매매기준율 - 장전 매매 기준율)/ 장전매매기준율
            vm.f15004_2 = vm.formatNumber((vm.NtoS(vm.f30819) - vm.NtoS(vm.f30824)) / vm.NtoS(vm.f30824));
            
            util.processing(vm.$refs.progress, false);
        },
        formatNumber:function(num) {
            return util.formatNumber(num);
        },
        NtoS: function(num) {
            return util.NumtoStr(num);
        },
        fn_close() {
            var vm = this;

            vm.$emit( "fn_close", "index" );
        },       
    }
};
</script>