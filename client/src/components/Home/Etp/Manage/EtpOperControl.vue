<template>
    <v-layout row wrap>
        <v-flex xs12>  
            <IndexDetailDialog v-if="showIndexDetailDialog" :paramData="paramData"></IndexDetailDialog>
            <EtpManageDetail v-if="showEtpDetailDialog" :paramData="paramData" :showEtpManageDetailDialog="showEtpDetailDialog"></EtpManageDetail>

            <!-- ETP 운용정보 -->
            <EtpOperInfo    v-if="showEtpOerInfo == 0" 
            
                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox"
                            @fn_setIndexBasic="fn_setIndexBasic"
                            @fn_eventClose = "fn_eventClose" >
            </EtpOperInfo>

            <!-- 지수관리 -->
            <EtpOperIndex   v-if="showEtpOerInfo == 1" 
                            
                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox">
            </EtpOperIndex>

            <!-- PDF 관리 -->
            <EtpOperPdf     v-if="showEtpOerInfo == 2" 
                        
                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox">
            </EtpOperPdf>

            <EtpOperInfoQuick   v-if="showEtpOperInfoQuick"

                                :indexBasic = "indexBasic"

                                @fn_setInavData = "fn_setInavData"
                                @fn_setEtpPerformanceData = "fn_setEtpPerformanceData"
                                @fn_setCustomizeData = "fn_setCustomizeData"

                                @showDetail="showDetail" 
                                @showMessageBox="showMessageBox"                                
            ></EtpOperInfoQuick>
            
            <ConfirmDialog ref="confirm"></ConfirmDialog>
        </v-flex>
    </v-layout> 
</template>

<script>

import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config from "@/js/config.js";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

import IndexDetailDialog from "@/components/Home/Index/Manage/IndexDetailDialog.vue";   /*지수 상세정보*/
import EtpManageDetail from "@/components/Home/Etp/Manage/EtpManageDetail.vue";         /*ETP 상세정보*/

import EtpOperInfo from "@/components/Home/Etp/Manage/EtpOperInfo.vue";                 /* ETP 운용정보 */
import EtpOperIndex from "@/components/Home/Etp/Manage/EtpOperIndex.vue";               /* 지수관리 */
import EtpOperPdf from "@/components/Home/Etp/Manage/EtpOperPdf.vue";                   /* PDF 관리 */

import EtpOperInfoQuick     from    "@/components/Home/Etp/Manage/EtpOperInfoQuick.vue";

export default {
    props: ["activeTab"],
    data() {
        return {
            showIndexDetailDialog : false,
            showEtpDetailDialog : false,
            showEtpOerInfo : 0,
            paramData : [],

            showEtpOperInfoQuick : false,
            indexBasic : {}
    	};
    },    

    components: {
        
        IndexDetailDialog : IndexDetailDialog,
        EtpManageDetail :   EtpManageDetail,

        EtpOperInfo :  EtpOperInfo,                 /* ETP 운용정보 */
        EtpOperIndex :   EtpOperIndex,              /* 지수관리 */
        EtpOperPdf :  EtpOperPdf,                   /* PDF 관리 */

        ConfirmDialog : ConfirmDialog,
        EtpOperInfoQuick, EtpOperInfoQuick
    },

    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
    },
    created: function() {
        this.$EventBus.$on('showList', data => {
            this.showEtpOerInfo = data.tab_id;
            this.showEtpDetailDialog = false;
            this.showIndexDetailDialog = false;
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
                
                this.showEtpOerInfo = 0;
                
            } else if (gubun == '2') { 
                this.paramData = paramData;
                this.showEtpDetailDialog = false;

                if (this.showIndexDetailDialog) {
                    this.$EventBus.$emit('changeEtpInfoClose', paramData);
                    this.$EventBus.$emit('changeIndexInfo', paramData);
                }
                
                this.showIndexDetailDialog = true;                
                this.showEtpOerInfo = 0;
            }
        },
        showMessageBox: function(title, msg, option, gubun) {
            this.$root.$confirm.open(title,msg, option, gubun);
        },

        fn_setIndexBasic : function( paramData ) {
            this.indexBasic = paramData;

            this.showEtpOperInfoQuick =   true;
        },

        /*
         *  EtpOperControl.vue -> EtpOperInfo  fn_setInavData 함수를 호출한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setInavData( paramData ) {
            var vm = this;

            console.log("########## EtpOperControl.vue -> fn_setInavData START ############");
            vm.$EventBus.$emit( "EtpOperControl_EtpOperInfo_setInavData", paramData );
            console.log("########## EtpOperControl.vue -> fn_setInavData END ############");
        },

        /*
         *  EtpOperControl.vue -> EtpOperInfo  fn_setEtpPerformanceData 함수를 호출한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setEtpPerformanceData( paramData ) {
            var vm = this;

            console.log("########## EtpOperControl.vue -> fn_setEtpPerformanceData START ############");
            vm.$EventBus.$emit( "EtpOperControl_EtpOperInfo_setEtpPerformanceData", paramData );
            console.log("########## EtpOperControl.vue -> fn_setEtpPerformanceData END ############");
        },

        /*
         *  EtpOperControl.vue -> EtpOperInfo  fn_setCustomizeData 함수를 호출한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setCustomizeData( paramData ) {
            var vm = this;

            console.log("########## EtpOperControl.vue -> fn_setCustomizeData START ############");
            vm.$EventBus.$emit( "EtpOperControl_EtpOperInfo_setCustomizeData", paramData );
            console.log("########## EtpOperControl.vue -> fn_setCustomizeData END ############");
        },

        fn_eventClose( paramData ) {

            if( paramData == "fn_setInavData" ) {
                this.showEtpOperInfoQuick   =   false;
                this.showEtpOperInfoQuick   =   true;
            }
        }
    }   


}
</script>

<style scoped>

</style>