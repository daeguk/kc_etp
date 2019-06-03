<template>
    <v-container>
        <v-layout row wrap >
            <!--rightmenu---->
            <v-card flat class="right_menu_w2">
                <v-list class="pt-0" dense>
                        <v-list-tile-content class="rightmenu_con">
                            <v-subheader>지수 조치 현황
                                <v-btn
                                    small
                                    depressed
                                    outline
                                    color="primary"
                                    @click="fn_showDetailIndex"
                                    :disabled = "fix_info.fix_disabled"
                                >내역확인</v-btn>

                            </v-subheader>
                            <!--p class="text_red">
                                <v-icon small>arrow_right</v-icon>{{ fix_info.fix_msg }}
                            </p-->
                        </v-list-tile-content>
                        <v-list-tile-content class="rightmenu_con case2 Oper_menu">
                            <v-subheader>
                                <v-icon small>build</v-icon>PDF Tools
                            </v-subheader>
                            <v-card flat class="w100">
                                <v-list>
                                    <!---pdf긴급반영 팝업-->
                                    <v-list-tile :class="( togglePdfEmergencyPop ? 'border_b select' : 'border_b' )" @click.stop="fn_showDetailPdf(6)">
                                        <v-list-tile-avatar>
                                            <div :class="( togglePdfEmergencyPop ? 'oper_list_icon select' : 'oper_list_icon' )"><span class="icon5"></span></div>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>PDF 긴급반영</v-list-tile-title>
                                            <v-list-tile-sub-title>종목 추가, 수량 변경 요청</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <!---pdf긴급반영 팝업 팝업 end-->
                                    
                                    <!---iNAV 계산기 팝업---->
                                    <v-list-tile :class="( toggleIanvPop ? 'border_b select' : 'border_b' )" @click.stop="fn_showDetailPdf(7)">
                                        <v-list-tile-avatar>
                                            <div :class="( toggleIanvPop ? 'oper_list_icon select' : 'oper_list_icon' )"><span class="icon6"></span></div>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>iNAV 계산기</v-list-tile-title>
                                            <v-list-tile-sub-title>플랫폼 상에서 iNAV계산</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    
                                    <!---iNAV 계산기 팝업 end---->

                                    <v-list-tile
                                        :class="( togglePdfByRate ? 'border_b select' : 'border_b' )"
                                        @click="fn_setEtpOperPdfByRate"
                                        v-model="togglePdfByRate"
                                    >
                                        <v-list-tile-avatar>
                                           <div :class="( togglePdfByRate ? 'oper_list_icon select' : 'oper_list_icon' )"><span class="icon7"></span></div>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>비중 변경현황</v-list-tile-title>
                                            <v-list-tile-sub-title>최근 5일간 비중 변경내역</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                        </v-list-tile-content>


                        <!-- 관심종목 영역 -->
                        <ComEtpFavorItemSub     v-if="showFaver" 
                                                :faverSize = "faverSize"
                                                @showDetail="showDetail" 
                                                @showMessageBox="showMessageBox">
                        </ComEtpFavorItemSub>

                    </v-list>

            </v-card>
            <!--rightmenu end--->
        </v-layout>
    </v-container>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config from "@/js/config.js";

import ComEtpFavorItemSub   from "@/components/common/control/ComEtpFavorItemSub.vue"; 

export default {
    props : [ "pdfData", "indexBasic" ],
    data() {
        return {
            showFaver : true,
            togglePdfEmergencyPop : false,
            toggleIanvPop : false,
            togglePdfByRate   : false,

            /* 지수 조치현황 */
            fix_info : {
                fix_disabled : true,
                fix_msg : "조치현황 없음"
            },
            faverSize : 50,            
        };
    },
    components: {
        ComEtpFavorItemSub      :   ComEtpFavorItemSub
    },
    mounted: function() {
        var vm = this;

        console.log( ">>>>>>>>>>>>>>>>>>>> EtpOperPdfQuick.vue pdfData mounted");
        console.log( vm.pdfData );        
    },
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


            /* 기초 데이터가 존재하는지 체크 */
            if( !vm.pdfData || Object.keys( vm.pdfData ).length == 0 ) {
                vm.$emit("showMessageBox", '확인','기초 데이터가 존재하지 않습니다.',{},1);
                return  false;
            }

            /* 기준 데이터가 존재하는지 체크 */
            if( !vm.pdfData.f16012 || !vm.pdfData.f16493 ) {
                vm.$emit("showMessageBox", '확인','기준 데이터가 존재하지 않습니다.',{},1);
                return  false;
            }

            /* ETF 인지 체크 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
            if( !( vm.pdfData.f16493 == "1" || vm.pdfData.f16493 == "2" ) ) {
                vm.$emit("showMessageBox", '확인','ETF 상품만 가능합니다.',{},1);
                return  false;
            }

            vm.togglePdfByRate  =   !vm.togglePdfByRate;

            vm.togglePdfEmergencyPop    =   false;
            vm.toggleIanvPop            =   false;

            var paramData   =   {};
            paramData.togglePdfByRate    =   vm.togglePdfByRate;            

            vm.$emit( "fn_setEtpOperPdfByRate", paramData );
        },

        fn_showDetailPdf : function( gubun ) {
            var vm = this;

console.log( " EtpOperPdfQuick.vue -> fn_showDetailPdf #################" );
console.log( vm.pdfData );

            /* 기초 데이터가 존재하는지 체크 */
            if( !vm.pdfData || Object.keys( vm.pdfData ).length == 0 ) {
                vm.$emit("showMessageBox", '확인','기초 데이터가 존재하지 않습니다.',{},1);
                return  false;
            }

            /* 기준 데이터가 존재하는지 체크 */
            if( !vm.pdfData.f16012 || !vm.pdfData.f16493 ) {
                vm.$emit("showMessageBox", '확인','기준 데이터가 존재하지 않습니다.',{},1);
                return  false;
            }

            /* ETF 인지 체크 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
            if( !( vm.pdfData.f16493 == "1" || vm.pdfData.f16493 == "2" ) ) {
                vm.$emit("showMessageBox", '확인','ETF 상품만 가능합니다.',{},1);
                return  false;
            }

            if( !vm.pdfData.f16583 ) {
                vm.$emit("showMessageBox", '확인','사무수탁회사번호가 존재하지 않습니다.',{},1);
                return  false;
            }            

            /* PDF 긴급반영인 경우 */
            if( gubun == 6 ) {

                vm.togglePdfEmergencyPop    =   true;
                vm.toggleIanvPop            =   false;
                vm.togglePdfByRate          =   false;

                vm.$emit( "fn_showDetailPdf", gubun, vm.pdfData );
            }
            /* iNAV 계산기인 경우 */
            else if( gubun == 7 ) {

                vm.togglePdfEmergencyPop    =   false;
                vm.toggleIanvPop            =   true;
                vm.togglePdfByRate          =   false;                

                var gubun   =   "7";

                /* 0-PDF, 1-지수 수익율 */
                if( vm.pdfData.f33929 == "0" ) {
                    gubun   =   "7";
                }else if( vm.pdfData.f33929 == "1" ) {
                    gubun   =   "8";
                }

                vm.$emit( "fn_showDetailPdf", gubun, vm.pdfData );
            }
            
        }
    }
};
</script>

