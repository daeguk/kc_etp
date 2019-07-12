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
                    {{etpBasic.F16002}} <span>{{etpBasic.F16012}}</span>
                </h6>
                <v-list-tile>
                    <v-list-tile-title class="sumu_text">Simulation Mode</v-list-tile-title>
                    <v-list-tile-content class="sumul_btn_w">
                        <ul>
                            <li>
                                <v-switch v-model="SimulationSwitch" color="primary" v-on:change="SimulationMode"></v-switch>
                            </li>
                            <li v-if="SimulationSwitch == true">
                                <v-btn small flat icon>
                                    <v-icon class="btn_on" v-on:click="indexInavCal()">play_circle_outline</v-icon>
                                </v-btn>
                            </li>
                            <li v-if="SimulationSwitch == true">
                                <v-btn small flat icon>
                                    <v-icon v-on:click="init(paramData.F16012)">refresh</v-icon>
                                </v-btn>
                            </li>
                        </ul>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </div>
        <div class="sumul_w">
            <v-card flat class="sumul_card_w ver3">
                <v-layout>
                    <v-flex xs12>
                        <ul>
                            <li class="list_tit">산출방식</li>
                            <li>{{etpBasic.F33929 == '0' ? 'PDF' : '지수수익율'}}</li>
                        </ul>
                        <ul>
                            <li class="list_tit">유형</li>
                            <li v-if="etpBasic.F34241 == 'K'">일반</li>
                            <li v-else>
                                <span v-if="etpBasic.F34240 == 'H'">환헷지(H)</span>
                                <span v-else-if="etpBasic.F34240 == 'F'">환노출일반(F)</span>
                                <span v-else-if="etpBasic.F34240 == 'A'">지수환노출(A)</span>
                                <span v-else-if="etpBasic.F34240 == 'T'">복합배율(T)</span>
                                <span v-else-if="etpBasic.F34240 == 'K'">복합배율2(K)</span>
                                <span v-else-if="etpBasic.F34240 == 'I'">인도레버리지(I)</span>
                                <span v-else-if="etpBasic.F34240 == 'J'">KINDEX합성일본인버스(J)</span>
                                <span v-else-if="etpBasic.F34240 == 'G'">KODEX 미국채10년 선물 ETF(G)</span>
                            </li>
                           
                            
                        </ul>
                        <ul>
                            <li class="list_tit">산출식</li>
                            <li v-if="etpBasic.F34241 == 'K'">iNAV=<span class="txt_point">①전일NAV</span>×(1+<span class="txt_point3">③기초지수등락율</span>×<span class="txt_point2">②배율</span>)</li>
                            <li v-else>
                                <span v-if="etpBasic.F34240 == 'H'">iNAV=<span class="txt_point">①전일NAV</span>×(1+<span class="txt_point3">③기초지수등락율</span>×<span class="txt_point2">②배율</span>)</span>
                                <span v-else-if="etpBasic.F34240 == 'F'">iNAV=<span class="txt_point">①전일NAV</span>×(1+<span class="txt_point3">③기초지수등락율</span>×<span class="txt_point2">②배율</span>)×(<span class="txt_point4">④적용환율/기준환율</span>)</span>
                                <span v-else-if="etpBasic.F34240 == 'A'">iNAV=<span class="txt_point">①전일NAV</span>×(1+<span class="txt_point3">③기초지수등락율</span>×<span class="txt_point2">②배율</span>×<span class="txt_point4">④적용환율/기준환율</span>)</span>
                                <span v-else-if="etpBasic.F34240 == 'T'">iNAV=<span class="txt_point">①전일NAV</span>×(1+<span class="txt_point3">③기초지수등락율</span>×<span class="txt_point2">②배율</span>)<br>×(1+(적용환율-기준환율)/기준환율×<span class="txt_point2">②배율</span>)</span>
                                <span v-else-if="etpBasic.F34240 == 'K'">iNAV=<span class="txt_point">①전일NAV</span>×(1+((1+<span class="txt_point3">③기초지수등락율</span>)<br>×<span class="txt_point4">④적용환율/기준환율</span>-1)×<span class="txt_point2">②배율</span>)</span>
                                <span v-else-if="etpBasic.F34240 == 'I'">iNAV=<span class="txt_point">①전일NAV</span>×(1+((1+<span class="txt_point3">③기초지수등락율</span>)×<span class="txt_point4">④적용환율/기준환율</span>-1)<br>×<span class="txt_point2">②배율</span>) ×(1+전일등락율×<span class="txt_point2">②배율</span>)</span>
                                <span v-else-if="etpBasic.F34240 == 'J'">iNAV=<span class="txt_point">①전일NAV</span>×(1+<span class="txt_point3">③기초지수등락율</span>×<span class="txt_point2">②배율</span>-예상배당수익률)</span>
                                <span v-else-if="etpBasic.F34240 == 'G'">iNAV=<span class="txt_point">①전일NAV</span>×(1+<span class="txt_point2">②배율</span>×<span class="txt_point3">③지수등락율</span>)×(환율보정계수/기준환율)</span>                                
                            </li>
                        </ul>
                        
                        <ul v-if="SimulationSwitch == true">
                            <li class="list_tit case2 txt_point">①전일NAV</li>
                            <li class="input_mid">
                                <v-text-field  v-model="F03329"  outline class="txt_right"></v-text-field>
                            </li>
                        </ul>
                        <ul v-else>
                            <li class="list_tit case2 txt_point">①전일NAV</li>
                            <li class="align_r">{{F03329}}</li>
                        </ul>

                        <ul v-if="SimulationSwitch == true">
                            <li class="list_tit case2 txt_point2">②배율</li>
                            <li class="input_mid">
                                <v-text-field v-model="F18453" outline class="txt_right"></v-text-field>
                            </li>                            
                        </ul>
                        <ul v-else>
                            <li class="list_tit case2 txt_point2">②배율</li>
                            <li class="align_r">{{F18453}}</li>
                        </ul>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs12 class="sumul_card_w ver3">
                        <ul class="bot_line">
                            <li class="list_tit">기초지수</li>
                            <li>{{etpBasic.F34777}}</li>
                        </ul>
                        <ul class="bot_line1">
                            <li class="list_tit">지수현재가</li>
                            <li class="input_mid" v-if="SimulationSwitch == true">
                                <v-text-field v-model="F15318" outline class="txt_right"></v-text-field>
                            </li>
                            <li v-else class="align_r text_red">{{F15318}}</li>
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
                                    <v-text-field   v-model="F15007" outline class="txt_right"></v-text-field>
                                    <span class="float_r">{{formatDate(etpBasic.F12506)}}</span>
                                </div>
                                <div v-else>
                                    <li class="align_r">
                                        {{F15007}}
                                    </li><br>
                                    <span class="float_r">{{formatDate(etpBasic.F12506)}}</span>
                                </div>
                            </li>
                        </ul>
                        <ul>
                            <li class="list_tit txt_point3"><b>③등락률(%)</b></li>
                            <li class="align_r">
                                <b>{{F30823}}%</b>
                            </li>
                        </ul>
                        <ul v-if="etpBasic.F34240 == 'I'"> <!-- 인도레버리지 -->
                            <li class="list_tit"><b>전일등락율(%)</b></li>
                            <li class="align_r">
                                <b>{{F34374}}%</b>
                            </li>
                        </ul>
                        <ul v-if="etpBasic.F34240 == 'J'"> <!-- KINDEX합성일본인버스 -->
                            <li class="list_tit"><b>예상배당수익률(%)</b></li>
                            <li class="align_r">
                                <b>{{F18101}}%</b>
                            </li>
                        </ul>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs12 class="sumul_card_w ver3">
                        <ul class="bot_line">
                            <li class="list_tit">환율</li>
                            <li class="align_r">{{etpBasic.ex_rate_code}}</li>
                        </ul>
                        <ul class="bot_line1">
                            <li class="list_tit">적용환율</li>
                            <li class="input_mid" v-if="SimulationSwitch == true">
                                <v-text-field v-model="F30819" outline class="txt_right"></v-text-field>
                            </li>
                            <li v-else class="align_r text_red">{{F30819}}</li>
                        </ul>
                        <ul class="bot_line2">
                            <li class="list_tit case2">기준환율</li>
                            <li class="input_mid" v-if="SimulationSwitch == true">
                                <v-text-field v-model="F30824" outline class="txt_right"></v-text-field>
                            </li>
                            <li class="align_r" v-else>
                                {{F30824}}
                            </li>
                        </ul>
                        <ul v-if="etpBasic.F34240 == 'F' || etpBasic.F34240 == 'A' || etpBasic.F34240 == 'K' || etpBasic.F34240 == 'I' ">
                            <li class="list_tit txt_point4">④적용환율/기준환율</li>
                            <li class="align_r">
                                <b>{{F15004_1}}</b>
                            </li>
                        </ul>
                        <ul v-else-if="etpBasic.F34240 == 'T'">
                            <li class="list_tit txt_point3"><b>③등락률(%)</b></li>
                            <li class="align_r">
                                <b>{{F15004_2}}</b>
                            </li>
                        </ul>
                        <ul v-else>
                            <li class="list_tit txt_point">변동률</li>
                            <li class="align_r">
                                <b>{{F15004}}</b>
                            </li>
                        </ul>
                        <ul class="bot_line3" v-if="etpBasic.F34240 == 'J'" >
                            <li class="list_tit txt_point">Other Factor</li>
                            <li class="align_r">
                                <b>{{F18101}}</b>
                            </li>
                        </ul>
                        <ul class="result ver2 bot_line1">
                            <li class="list_tit">
                                <b>외부공표 iNAV</b>
                            </li>
                            <li class="text_red align_r" v-if="etpBasic.F30818 >= 0">                                        
                                <b>{{formatNumber(etpBasic.F15301)}}</b>
                                <br>
                                <span class="float_r">{{formatNumber(etpBasic.F30818)}}%</span>
                            </li>
                            <li class="text_blue align_r" v-if="etpBasic.F30818 < 0">                                        
                                <b>{{formatNumber(etpBasic.F15301)}}</b>
                                <br>
                                <span class="float_r">{{formatNumber(etpBasic.F30818)}}%</span>
                            </li>
                        </ul>
                        <ul class="result">
                            <li class="list_tit txt_point1">iNAV 계산결과</li>
                            <li class="align_r text_red" v-if="iNavRate >=0 ">
                                <b>{{iNav}}</b>
                                <br>
                                <span class="float_r">{{iNavRate}}%</span>
                            </li>
                            <li class="align_r text_blue" v-if="iNavRate < 0">
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
            etpBasic: {}, /* ETP 정보 */
            F15318: 0,  /* 기초지수 현재가 */
            F30823: 0,  /* 기초지수 등락률 */
            F03329: 0,  /* 전일Nav */
            F15302: 0,  /* 추적수익률 */
            F15007: 0,  /* 지수기준가  */
            F30824: 0,  /* 장전기준율(기준환율) */
            F30819: 0,  /* 매매기준율(적용환율) */
            F15004: 0,  /* 변동률 */ 
            F15004_1: 0,  /* (매매기준율(적용환율)/장전매매기준율(기준환율)) */ 
            F15004_2: 0,  /* (매매기준율(적용환율)-장전매매기준율(기준환율))/장전매매기준율(기준환율) */ 
            F34374: 0,  /* 전일ETP기초지수등락율 */
            F18101: 0,  /* 예상배당수익률 : 배당율 */
            F18453: 0,  /* ETP 배율 */
            F18101: 0,  /* 예상 배당 수익률 */
            F33128: 0,  /* 환율보정계수 */
            iNav: 0,    /* INav 계산결과 */
            iNavRate: 0, /* INav 계산결과 율 */
            readonly: true
        };
    },   
    components: {
        ProgressBar: ProgressBar
    },    
    mounted: function() {        
        this.init(this.paramData.F16012);
    },
    created: function() {},
    beforeDestory: function() {
        var vm = this;
    },
    methods: {
        init: function(F16012) {
            var vm = this;            
            util.processing(vm.$refs.progress, true);
            console.log( "EtpOperInfoInavIndex.vue -> getiNavIndexData" );

            axios.get( Config.base_url + "/user/etp/getiNavIndexData", {
                params: {
                    //F16012 : 'KR7261110001',
                    F16012 : F16012,
                }
            }).then(async function(response) {

                if (response.data.success) {
                    vm.etpBasic = response.data.etpBasic;

                    // 전일 Nav
                    vm.F03329 = vm.formatNumber(vm.etpBasic.F03329);
                    // 추적수익률
                    vm.F15302 = vm.formatNumber(vm.etpBasic.F15302);
                    // 기준가
                    vm.F15007 = vm.formatNumber(vm.etpBasic.F15318 - vm.etpBasic.F15319);
                    // 매매기준율
                    vm.F30819 = vm.formatNumber(vm.etpBasic.F30819);
                    // 장전 기준윻
                    vm.F30824 = vm.formatNumber(vm.etpBasic.F30824);
                    
                    // 기초 지수 현재가
                    vm.F15318 = vm.formatNumber(vm.etpBasic.F15318);
                    //기초지수 등락률 
                    vm.F30823 = vm.formatDigit(vm.etpBasic.F30823, 5);
                    // 전일ETP기초지수등락율
                    vm.F34374 = vm.formatNumber(vm.etpBasic.F34374);
                    // 예상배당수익률 : 배당율
                    vm.F18101 = vm.etpBasic.F18101;
                    // ETP 배율 
                    vm.F18453 = vm.etpBasic.F18453;
                    // 변동률 
                    vm.F15004 = (vm.NtoS(vm.F30819) / vm.NtoS(vm.F30824)-1) * 100;
                    vm.F15004 = vm.formatDigit(vm.F15004, 5);
                    // (ETP계산유형: F, A, K, I)매매기준율 /장전 매매 기준율
                    vm.F15004_1 = vm.formatDigit(vm.etpBasic.F30819 / vm.etpBasic.F30824, 5);
                    // (ETP계산유형: T)(매매기준율 - 장전 매매 기준율)/ 장전매매기준율
                    vm.F15004_2 = vm.formatDigit((vm.etpBasic.F30819 - vm.etpBasic.F30824) / vm.etpBasic.F30824, 5);
                    // 예상배당 수익률
                    vm.F18101 = vm.formatNumber(vm.etpBasic.F18101);
                    // 환율 보정 계수 
                    vm.F33128 =  vm.formatNumber(vm.etpBasic.F33128);
                    // INav 계산결과
                    vm.iNav = vm.formatNumber(0);    
                    // INav 계산결과 율
                    vm.iNavRate = vm.formatNumber(0);    
                    
                    vm.indexInavCal();
                } else {
                    util.processing(vm.$refs.progress, false);                
                }
            }).catch(error => {
                console.log(error);
                util.processing(vm.$refs.progress, false);   
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);             
            });
        },
        indexInavCal : function() {
            var vm = this;
            try {
                util.processing(vm.$refs.progress, true);
                // 지수 등락률
                vm.F30823 = (vm.NtoS(vm.F15318) / vm.NtoS(vm.F15007)) - 1 ;
                // 변동률 
                vm.F15004 = (vm.NtoS(vm.F30819) / vm.NtoS(vm.F30824) - 1) * 100;
                // ETP 계산 유형(H: 환햇지, F: 환노출, A: 지수환노출, T: 복합배율, K: 복합배율2, I: 인도레버리지, J: KINDEX합성일본인버스)

                /* 
                일반(국내) : 국내는 유형이 없음
                iNAV=전일NAV*(1+기초지수등락율*배율)
                */
                if (vm.etpBasic.F34241 == 'K') {
                    vm.iNav = vm.NtoS(vm.F03329) * ( 1 + vm.F30823 * vm.F18453 );
                } else {
                    /* 
                    H. 환헷지
                    iNAV=전일NAV*(1+기초지수등락율*배율)
                    */
                    if (vm.etpBasic.F34240 == 'H') {
                        vm.iNav = vm.NtoS(vm.F03329) * ( 1 + vm.F30823 * vm.F18453 );
                    /* 
                    F. 환노출일반
                    iNAV=전일NAV*(1+기초지수등락율*배율)*(매매기준율/장전매매기준율)
                    */           
                    } else if (vm.etpBasic.F34240 == 'F') {
                        vm.iNav = vm.NtoS(vm.F03329) * ( 1 + vm.F30823 * vm.NtoS(vm.F18453) ) * ( vm.NtoS(vm.F30819)	/ vm.NtoS(vm.F30824) );
                        
                    /* 
                    A.지수환노출 : ARIRAN차이나H레버리지(합성)
                    iNAV=전일NAV*(1+기초지수등락율*배율*매매기준율/장전매매기준율)
                    */
                    } else if (vm.etpBasic.F34240 == 'A') {
                        vm.iNav = vm.NtoS(vm.F03329) * ( 1 + vm.F30823 * vm.NtoS(vm.F18453)  * vm.NtoS(vm.F30819)	/ vm.NtoS(vm.F30824) );
                    /* 
                    K. 복합배율2 : KINDEX 중국본토 레버리지 CSI300
                    iNAV=전일NAV*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율)
                    */
                    } else if (vm.etpBasic.F34240 == 'K') {
                        vm.iNav = vm.NtoS(vm.F03329) * ( 1 + (( 1 + vm.F30823 ) * vm.NtoS(vm.F30819) /  vm.NtoS(vm.F30824) - 1 ) * vm.NtoS(vm.F18453) );
                    /* 
                    T.복합배율 :  TIGER 차이나A레버리지(합성)
                    iNAV=전일NAV*(1+기초지수등락율*배율)*(1+(매매기준율-장전매매기준율)/장전매매기준율*배율)               
                    */
                    } else if (vm.etpBasic.F34240 == 'T') {
                        vm.iNav = vm.NtoS(vm.F03329) * ( 1 + vm.F30823 * vm.NtoS(vm.F18453) ) * (1 + (vm.NtoS(vm.F30819)  - vm.NtoS(vm.F30824)) / vm.NtoS(vm.F30824)	* vm.NtoS(vm.F18453) );
                    /*
                        I. 인도레버리지, 전일ETP기초지수등락율(FID 34374 사용 하드코딩되있음)
                        iNAV=전일NAV*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율) *(1+전일등락율*배율)
                    */
                    } else if (vm.etpBasic.F34240 == 'I') {
                        vm.iNav = vm.NtoS(vm.F03329) * ( 1 + (( 1 + vm.F30823 ) * vm.NtoS(vm.F30819) /  vm.NtoS(vm.F30824) - 1 ) * vm.NtoS(vm.F18453) ) * (1 + vm.NtoS(vm.F34374) * vm.NtoS(vm.F18453));
                    /* 
                    J. KINDEX합성일본인버스, 1년에 2번 inav를 예상배당수익률(FID 18101 (주의)DEC -6)로 조정한다.
                    iNAV=전일NAV*(1+기초지수등락율*배율-예상배당수익률)
                    */
                    } else if (vm.etpBasic.F34240 == 'J') {
                        vm.iNav = vm.NtoS(vm.F03329) * (1 + vm.F30823 * vm.NtoS(vm.F18453) - vm.NtoS(vm.F18101)); 
                    /* 
                    G.  KODEX 미국채10년 선물 ETF
                    iNAV = 전일NAV * (1+지수등락율*배율)*(환율보정계수 / 장전매매기준율)
                    */
                    } else if (vm.etpBasic.F34240 == 'G') {
                        vm.iNav = vm.NtoS(vm.F03329) * ( 1 + vm.F30823 * vm.NtoS(vm.F18453) ) * ( vm.NtoS(vm.F33128) / vm.NtoS(vm.F30824) );
                    }
                } 
                
                /* iNav 등락률 */
                vm.iNavRate =  ((vm.iNav / vm.NtoS(vm.F03329)) - 1) * 100;
                vm.iNav = vm.formatNumber(vm.iNav);
                vm.iNavRate = vm.formatNumber(vm.iNavRate);
                vm.F30823 = vm.formatDigit(vm.F30823*100, 5);  /* 등락률 */
                vm.F15004 = vm.formatDigit(vm.F15004, 5);  /* 변동률 */
                // (ETP계산유형: F, A, K, I)매매기준율 /장전 매매 기준율
                vm.F15004_1 = vm.formatDigit(vm.NtoS(vm.F30819) / vm.NtoS(vm.F30824), 5);
                // (ETP계산유형: T)(매매기준율 - 장전 매매 기준율)/ 장전매매기준율
                vm.F15004_2 = vm.formatDigit((vm.NtoS(vm.F30819) - vm.NtoS(vm.F30824)) / vm.NtoS(vm.F30824), 5);
                
                util.processing(vm.$refs.progress, false);
            }catch(e) {
                util.processing(vm.$refs.progress, false);
            }
        },
        formatNumber:function(num) {
            return util.formatNumber(num);
        },
        formatDigit:function(num, digit) {
            return util.formatDigit(num, digit)
        },
        formatDate:function(date) {
            if (date == null) return '';
            else return util.formatDate(date);
        },
        NtoS: function(num) {
            return util.NumtoStr(num);
        },
        fn_close() {
            var vm = this;
            vm.$emit( "fn_close", "index" );
        },    
        SimulationMode: function() {
            if (!this.SimulationSwitch) {
               this.init(this.paramData.F16012);
            } 
        },   
    }
};
</script>