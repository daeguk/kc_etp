<template>
    <v-layout row wrap>
        <v-flex xs12>  
            <v-dialog v-model="showIndexDetailDialog" persistent max-width="1300">
                <IndexDetailDialog v-if="showIndexDetailDialog" :paramData="paramData" :showDialog="showIndexDetailDialog" @fn_closePop="fn_close"></IndexDetailDialog>
            </v-dialog>

            <EtpManageDetail v-if="showEtpDetailDialog" :paramData="paramData" :showEtpManageDetailDialog="showEtpDetailDialog"></EtpManageDetail>

            <!-- ETP 운용정보 -->
            <EtpOperInfo    v-if="showEtpOerInfo == 0" 
            
                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox"
                            @fn_pageMove="fn_pageMove">
            </EtpOperInfo>

            <!-- 지수관리 -->
            <EtpOperIndex   v-if="showEtpOerInfo == 1" 
                            
                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox">
            </EtpOperIndex>

            <!-- PDF 관리 -->
            <EtpOperPdf     v-if="showEtpOerInfo == 2" 
                            :paramData="paramData"

                            @showDetail="showDetail" 
                            @showMessageBox="showMessageBox">
            </EtpOperPdf>
            
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

export default {
    props: ["activeTab"],
    data() {
        return {
            showIndexDetailDialog : false,
            showEtpDetailDialog : false,
            showEtpOerInfo : 0,
            paramData : [],
    	};
    },    

    components: {
        
        IndexDetailDialog : IndexDetailDialog,      /* 인덱스 상세정보 */
        EtpManageDetail :   EtpManageDetail,        /* ETP 상세정보 */

        EtpOperInfo :  EtpOperInfo,                 /* ETP 운용정보 */
        EtpOperIndex :   EtpOperIndex,              /* 지수관리 */
        EtpOperPdf :  EtpOperPdf,                   /* PDF 관리 */

        ConfirmDialog : ConfirmDialog,
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
                
                this.showEtpOerInfo = vm.activeTab;
                
            } else if (gubun == '2') { 
                this.paramData = paramData;
                this.showEtpDetailDialog = false;

                if (this.showIndexDetailDialog) {
                    this.$EventBus.$emit('changeEtpInfoClose', paramData);
                    this.$EventBus.$emit('changeIndexInfo', paramData);
                }
                
                this.showIndexDetailDialog = true;                
                this.showEtpOerInfo = vm.activeTab;
            }
        },
        showMessageBox: function(title, msg, option, gubun) {
            this.$root.$confirm.open(title,msg, option, gubun);
        },

        /*
         *  ETP 운용정보에서 이미지 버튼 클릭시 상세페이지로 이동시킨다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_pageMove( btnId, paramData ) {

            switch( btnId ) {

                case    'btnPdf'    :
                            this.paramData  =   paramData;
                            this.$emit( "fn_setActiveTab", 2 );
                            break;
            }            
        },

        /*
         *  지소관리 상세 팝업에서 종료시 해당 팝업을 종료한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_close( param ) {
            var vm = this;

            vm.showIndexDetailDialog    =   false;
            
        }
    }
}
</script>

<style scoped>

</style>