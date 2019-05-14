<template>
    <v-layout row wrap class="content_margin con_wrap">

        <v-flex grow :class="className">

            <!-- ETP 운용정보 -->
            <EtpOperInfo    v-if="showEtpOerInfo == 0" 
            
                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox"
                            @fn_showDetailIndex="fn_showDetailIndex"
                            @fn_pageMove="fn_pageMove"
                            @fn_setFirstData="fn_setFirstData">
            </EtpOperInfo>

            <!-- 지수관리 -->
            <EtpOperIndex   v-if="showEtpOerInfo == 1" 
                            
                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox"
                            @fn_showDetailIndex="fn_showDetailIndex">
            </EtpOperIndex>

            <!-- PDF 관리 -->
            <EtpOperPdf     v-if="showEtpOerInfo == 2" 

                            :paramData="paramData"
                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox"
                            @fn_showDetailIndex="fn_showDetailIndex"
                            @fn_showDetailPdf="fn_showDetailPdf">
            </EtpOperPdf>
            





            <!-- 메시지 관리 -->
            <ConfirmDialog ref="confirm"></ConfirmDialog>

            <!-- 지수 상세 팝업 -->
            <v-dialog v-model="showIndexDetailDialog" persistent max-width="1300">
                <IndexDetailInfo        v-if="showIndexDetailDialog" 
                
                                        :paramData="paramData" 
                                        :showDialog="showIndexDetailDialog" 
                                        @fn_closePop="fn_close">
                </IndexDetailInfo>
            </v-dialog>

            <!-- 지수 상세정보 팝업 -->
            <EtpOperIndexDetailListPop  v-if="showEtpOperIndexDetailListDialog" 
            
                                        :paramData="paramData" 
                                        :showDialog="showEtpOperIndexDetailListDialog" 
                                        
                                        @fn_closePop="fn_close">
            </EtpOperIndexDetailListPop>


            <!-- ETP 상세 -->
            <EtpManageDetail    v-if="showEtpDetailDialog" 
            
                                :paramData="paramData" 
                                :showEtpManageDetailDialog="showEtpManageDetailDialog">
            </EtpManageDetail>            

            <!-- 지수 조치현황 -->
            <ComIndexFixPopup   v-if="showEtpOperIndexFixDialog"

                                :indexBasic="paramData" 
                                :indexFixDialog="showEtpOperIndexFixDialog" 
                                
                                @fn_closePop="fn_close" >
            </ComIndexFixPopup>            

            <!-- 지수오류내역 -->
            <EtpOperIndexErrorPop   v-if="showEtpOperIndexErrorDialog"

                                    :paramData="paramData" 
                                    :showDialog="showEtpOperIndexErrorDialog" 
                                
                                    @fn_closePop="fn_close" >
            </EtpOperIndexErrorPop>


            <!-- PDF 긴급반영 -->
            <EtpOperPdfEmergencyModifyPop   v-if="showEtpOperPdfEmergencyModifyPop"

                                            :paramData="paramData" 
                                            :showDialog="showEtpOperPdfEmergencyModifyPop" 
                                
                                            @fn_closePop="fn_close" >
            </EtpOperPdfEmergencyModifyPop>

            <!-- iNAV 계산기 팝업 -->
            <EtpOperPdfInavCalcPop          v-if="showEtpOperPdfInavCalcPop"

                                            :paramData="paramData" 
                                            :showDialog="showEtpOperPdfInavCalcPop" 
                                
                                            @fn_closePop="fn_close" >
            </EtpOperPdfInavCalcPop>

        </v-flex>

        <v-flex :class="FaverClassName">
            <ComFavorItemSub        v-if="showFaver"   

                                    @showDetail="showDetail" 
                                    @showMessageBox="showMessageBox">
            </ComFavorItemSub>
        </v-flex>

    </v-layout> 
</template>

<script>

import $                            from "jquery";
import dt                           from "datatables.net";
import buttons                      from "datatables.net-buttons";
import select                       from "datatables.net-select";
import _                            from "lodash";
import Config                       from "@/js/config.js";


import ConfirmDialog                from "@/components/common/ConfirmDialog.vue";
import ComIndexFixPopup             from "@/components/common/popup/ComIndexFixPopup.vue";
import ComFavorItemSub              from "@/components/common/control/ComFavorItemSub"; 


import IndexDetailInfo              from "@/components/Home/Index/Manage/IndexDetailInfo.vue";              /* 지수 상세정보 */
import EtpOperIndexDetailListPop    from "@/components/Home/Etp/Manage/EtpOperIndexDetailListPop.vue";      /* 지수종목 상세정보 */
import EtpManageDetail              from "@/components/Home/Etp/Manage/EtpManageDetail.vue";                /*ETP 상세정보*/
import EtpOperIndexErrorPop         from "@/components/Home/Etp/Manage/EtpOperIndexErrorPop.vue";           /*ETP 상세정보*/

import EtpOperInfo                  from "@/components/Home/Etp/Manage/EtpOperInfo.vue";                    /* ETP 운용정보 */
import EtpOperIndex                 from "@/components/Home/Etp/Manage/EtpOperIndex.vue";                   /* 지수관리 */
import EtpOperPdf                   from "@/components/Home/Etp/Manage/EtpOperPdf.vue";                     /* PDF 관리 */
import EtpOperPdfEmergencyModifyPop from "@/components/Home/Etp/Manage/EtpOperPdfEmergencyModifyPop.vue";   /* PDF 긴급반영 팝업 */
import EtpOperPdfInavCalcPop        from "@/components/Home/Etp/Manage/EtpOperPdfInavCalcPop.vue";          /* iNAV 계산기 팝업 */

export default {
    props: ["activeTab"],
    data() {
        return {
            showIndexDetailDialog : false,
            showEtpDetailDialog : false,
            showEtpManageDetailDialog : false,
            showEtpOperIndexDetailListDialog : false,
            showEtpOperIndexFixDialog: false,
            showEtpOperIndexErrorDialog : false,
            showEtpOperPdfEmergencyModifyPop : false,
            showEtpOperPdfInavCalcPop : false,
            showFaver : false,

            showEtpOerInfo : 0,
            paramData : [],
            className: '',
            FaverClassName: '',            
    	};
    },    

    components: {
        
        IndexDetailInfo                 :   IndexDetailInfo,                    /* 인덱스 상세정보 */
        EtpManageDetail                 :   EtpManageDetail,                    /* ETP 상세정보 */
        EtpOperIndexDetailListPop       :   EtpOperIndexDetailListPop,          /* 인덱스 상세 목록 정보 */
        ComIndexFixPopup                :   ComIndexFixPopup,                   /* 지수조치현황 */
        EtpOperIndexErrorPop            :   EtpOperIndexErrorPop,               /* 지수오류내역 */
        EtpOperPdfEmergencyModifyPop    :   EtpOperPdfEmergencyModifyPop,       /* PDF 긴급반영 팝업 */
        EtpOperPdfInavCalcPop           :   EtpOperPdfInavCalcPop,              /* iNAV 계산기 팝업 */

        EtpOperInfo                     :   EtpOperInfo,                        /* ETP 운용정보 */
        EtpOperIndex                    :   EtpOperIndex,                       /* 지수관리 */
        EtpOperPdf                      :   EtpOperPdf,                         /* PDF 관리 */

        ConfirmDialog                   :   ConfirmDialog,                      /* 공통 메시지창 */
        ComFavorItemSub                 :   ComFavorItemSub,
    },

    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;

        this.className = "conWidth_100";
    },
    created: function() {
        this.$EventBus.$on('showList', data => {

            this.className = "conWidth_100";

            this.showEtpOerInfo                     =   data.tab_id;
            this.showEtpDetailDialog                =   false;
            this.showEtpManageDetailDialog          =   false;
            this.showIndexDetailDialog              =   false;

            this.showEtpOperIndexDetailListDialog   =   false;
            this.showEtpOperIndexFixDialog          =   false;
            this.showEtpOperIndexErrorDialog        =   false;
            this.showEtpOperPdfEmergencyModifyPop   =   false;
            this.showEtpOperPdfInavCalcPop          =   false;

            this.showFaver                          =   false;

            this.paramData                          =   data.paramData;
        });
    },
    beforeUpdated: function() {
        
    },
    updated: function() {
    },
    methods: {
        showDetail: function(gubun, paramData) {      
                  
            if (gubun == '1') {
                this.paramData = paramData;
                this.showIndexDetailDialog = false;
                
                if (this.showEtpDetailDialog) {
                    this.$EventBus.$emit('changeIndexInfoClose', paramData);
                    this.$EventBus.$emit('changeEtpInfo', paramData);
                }
                this.showEtpDetailDialog = true;
                
                this.showEtpOerInfo = -1;
                this.showFaver = true;
                
            } else if (gubun == '2') { 
                this.paramData = paramData;
                this.showEtpDetailDialog = false;

                if (this.showIndexDetailDialog) {
                    this.$EventBus.$emit('changeEtpInfoClose', paramData);
                    this.$EventBus.$emit('changeIndexInfo', paramData);
                }
                
                this.showIndexDetailDialog = true;                
                this.showEtpOerInfo = this.activeTab;
                this.showFaver = false;
            } 

            this.className = "conWidth_left";  
            this.FaverClassName = "conWidth_right";
        },
        showMessageBox: function(title, msg, option, gubun) {
            this.$root.$confirm.open(title,msg, option, gubun);
        },


        async fn_showDetailIndex(gubun, paramData) {      

            /* 지수관리 -> 지수구성정보 상세팝업 */
            if( gubun == '3' ) {
                this.paramData = paramData;
                this.showEtpOperIndexFixDialog = false;
                this.showEtpOperIndexErrorDialog = false;

                if (this.showEtpOperIndexDetailListDialog) {
                    this.$EventBus.$emit('changeEtpOperIndexFixClose', paramData);
                    this.$EventBus.$emit('changeEtpOperIndexErrorClose', paramData);

                    this.$EventBus.$emit('changeEtpOperIndexDetailList', paramData);
                }
                
                this.showEtpOperIndexDetailListDialog = true;
                this.showEtpOerInfo = this.activeTab;
            }
            /* 지수관리 -> 지수조치내역 팝업 */
            else if( gubun == '4' ) {

                var checkResult = false;

                if( paramData ) {
                    console.log( "paramData.f16013=[" + paramData.f16013 + "]/paramData.market_id=[" + paramData.market_id + "]/paramData.f16257=[" + paramData.f16257+ "]/paramData.f34239=[" + paramData.f34239 + "]" );
                }else{
                    console.log( "paramData is null");
                }

                if(     paramData 
                    &&  paramData.f16013        /* 단축코드 */
                    &&  paramData.market_id     /* 시장 ID */
                ) {
                    checkResult =   true;
                }
                else if(    
                        paramData
                    &&  paramData.f16257        /* ETP기초지수코드 */
                    &&  paramData.f34239        /* ETP기초지수MID */
                ) {
                    checkResult = true;
                }

                if( !checkResult ) {
                    if( await this.$root.$confirm.open(
                                '[지수 조치현황]',
                                '지수 정보가 없습니다.',
                                {}
                            ,   1
                        )
                    ) {
                        return false;
                    }                    
                }
                
                this.paramData = paramData;
                this.showEtpOperIndexDetailListDialog = false;
                this.showEtpOperIndexErrorDialog = false;

                if (this.showEtpOperIndexFixDialog) {
                    this.$EventBus.$emit('changeEtpOperIndexDetailListClose', paramData);
                    this.$EventBus.$emit('changeEtpOperIndexErrorClose', paramData);

                    this.$EventBus.$emit('changeEtpOperIndexFix', paramData);
                }

                this.showEtpOperIndexFixDialog = true;  
                this.showEtpOerInfo = this.activeTab;              
            
            }
            /* 지수관리 -> 지수오류내역 */
            else if ( gubun == '5' ) {
                this.paramData = paramData;
                this.showEtpOperIndexDetailListDialog = false;
                this.showEtpOperIndexFixDialog = false;

                if (this.showEtpOperIndexErrorDialog) {
                    this.$EventBus.$emit('changeEtpOperIndexDetailListClose', paramData);
                    this.$EventBus.$emit('changeEtpOperIndexFixClose', paramData);

                    this.$EventBus.$emit('changeEtpOperIndexError', paramData);
                }
                
                this.showEtpOperIndexErrorDialog = true;                
                this.showEtpOerInfo = this.activeTab;
            }
        },

        fn_showDetailPdf(gubun, paramData) {

            /* PDF 관리 -> PDF 긴급반영 팝업 */
            if( gubun == '6' ) {
                this.paramData = paramData;
                this.showEtpOperPdfInavCalcPop = false;

                if (this.showEtpOperPdfEmergencyModifyPop) {
                    this.$EventBus.$emit('EtpOperControl_EtpOperPdfInavCalcPop_close', paramData);

                    this.$EventBus.$emit('EtpOperControl_EtpOperPdfEmergencyModifyPop_call', paramData);
                }
                
                this.showEtpOperPdfEmergencyModifyPop = true;
                this.showEtpOerInfo = this.activeTab;
            }
            /* PDF 관리 -> iNAV 계산기 팝업 */
            else if( gubun == '7' ) {
                this.paramData = paramData;
                this.showEtpOperPdfEmergencyModifyPop = false;

                if (this.showEtpOperPdfInavCalcPop) {
                    this.$EventBus.$emit('EtpOperControl_EtpOperPdfEmergencyModifyPop_close', paramData);

                    this.$EventBus.$emit('EtpOperControl_EtpOperPdfInavCalcPop_call', paramData);
                }
                
                this.showEtpOperPdfInavCalcPop = true;
                this.showEtpOerInfo = this.activeTab;
            }
        },

        /*
         *  ETP 운용정보에서 이미지 버튼 클릭시 상세페이지로 이동시킨다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_pageMove( btnId, paramData ) {

            switch( btnId ) {

                case    'btnPdf'    :
                            this.paramData  =   paramData;
                            this.$emit( "fn_setActiveTab", 2, this.paramData );
                            break;
            }            
        },

        fn_setFirstData( paramData ) {
            var vm = this;

            vm.$emit( "fn_setFirstData", paramData );
        },

        /*
         *  지소관리 상세 팝업에서 종료시 해당 팝업을 종료한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_close( param ) {
            var vm = this;

            vm.showIndexDetailDialog                =   false;

            vm.showEtpOperIndexDetailListDialog     =   false;
            vm.showEtpOperIndexFixDialog            =   false;
            vm.showEtpOperIndexErrorDialog          =   false;
            vm.showEtpOperPdfEmergencyModifyPop     =   false;
            vm.showEtpOperPdfInavCalcPop            =   false;
        }
    }
}
</script>

<style scoped>

</style>