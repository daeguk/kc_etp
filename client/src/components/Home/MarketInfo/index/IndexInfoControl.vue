<template>
    <v-layout row wrap>
        <v-flex xs12>  
            <IndexDetailDialog v-if="showIndexDetailDialog" :paramData="paramData"></IndexDetailDialog>
            <EtpManageDetail v-if="showEtpDetailDialog" :paramData="paramData" :showEtpManageDetailDialog="showEtpDetailDialog"></EtpManageDetail>
            <today v-if="showMarketInfo == 1" @showDetail="showDetail" @showMessageBox="showMessageBox"></today>                              
            <ComFavorItem v-if="showFaver" @showDetail="showDetail" @showMessageBox="showMessageBox"></ComFavorItem>
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
import ComFavorItem from "@/components/common/control/ComFavorItem"; 
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

import IndexDetailDialog from "@/components/Home/Index/Manage/IndexDetailDialog.vue";   /*지수 상세정보*/
import EtpManageDetail from "@/components/Home/Etp/Manage/EtpManageDetail.vue";         /*ETP 상세정보*/

import today from "./today.vue";                /* 001-Today */

export default {
    props: ["activeTab"],
    data() {
        return {
            showIndexDetailDialog : false,
            showEtpDetailDialog : false,
            showMarketInfo : 0,
            paramData : [],
            showFaver : false
    	};
    },    

    components: {
        ComFavorItem : ComFavorItem,
        ConfirmDialog : ConfirmDialog,
        IndexDetailDialog : IndexDetailDialog,
        EtpManageDetail :   EtpManageDetail,
        today :  today,               /* 001-Today */
    },

    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
    },
    created: function() {
        this.$EventBus.$on('showList', data => {
            this.showMarketInfo = data.tab_id;
            this.showEtpDetailDialog = false;
            this.showIndexDetailDialog = false;
            this.showFaver = false;
        });
    },
    beforeUpdated: function() {
        
    },
    updated: function() {
    },
    methods: {
        showDetail: function(gubun, paramData) {
            var vm = this;
            if (gubun == '1') {
                vm.paramData = paramData;
                vm.showIndexDetailDialog = false;
                if (vm.showEtpDetailDialog) {
                    vm.$EventBus.$emit('changeEtpInfo', paramData);
                }
                vm.showEtpDetailDialog = true;                
                vm.showMarketInfo = 0;
                vm.showFaver = true;
                
            } else {
                vm.paramData = paramData;
                vm.showEtpDetailDialog = false;

                if (vm.showIndexDetailDialog) {
                    vm.$EventBus.$emit('changeIndexInfo', paramData);
                }
                
                vm.showIndexDetailDialog = true;                
                vm.showMarketInfo = 0;
                vm.showFaver = true;
            }
        },
        showMessageBox: function(title, msg, option, gubun) {
            this.$root.$confirm.open(title,msg, option, gubun);
        }
    }   


}
</script>

<style scoped>

</style>