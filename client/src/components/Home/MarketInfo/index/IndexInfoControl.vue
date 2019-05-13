<template>
    <v-layout row wrap class="content_margin con_wrap">
        <v-flex grow :class="className">
            <IndexDetailDialog v-if="showIndexDetailDialog" :showDialog="true" :paramData="paramData"></IndexDetailDialog>
            <EtpManageDetail v-if="showEtpDetailDialog" :paramData="paramData" :showEtpManageDetailDialog="showEtpDetailDialog"></EtpManageDetail>
            <today v-if="showMarketInfo == 1" @showDetail="showDetail" @showMessageBox="showMessageBox"></today>         
            <ConfirmDialog ref="confirm"></ConfirmDialog>
        </v-flex>
        <v-flex :class="FaverClassName">
                <ComFavorItemSub v-if="showFaver"   @showDetail="showDetail" @showMessageBox="showMessageBox"></ComFavorItemSub>
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
import ComFavorItemSub from "@/components/common/control/ComFavorItemSub"; 
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
            showFaver : false,
            className: '',
            FaverClassName: '',
    	};
    },    

    components: {
        ComFavorItemSub : ComFavorItemSub,
        ConfirmDialog : ConfirmDialog,
        IndexDetailDialog : IndexDetailDialog,
        EtpManageDetail :   EtpManageDetail,
        today :  today,               /* 001-Today */
    },

    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
        this.className = "conWidth_100";
    },
    created: function() {
        this.$EventBus.$on('showList', data => {
            this.className = "conWidth_100";
            this.FaverClassName = "";
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
                    vm.$EventBus.$off('changeIndexInfo', paramData);
                    vm.$EventBus.$emit('changeEtpInfo', paramData);
                }
                vm.showEtpDetailDialog = true;                
                vm.showMarketInfo = 0;
                vm.showFaver = true;
                
            } else {
                vm.paramData = paramData;
                vm.showEtpDetailDialog = false;

                if (vm.showIndexDetailDialog) {
                    vm.$EventBus.$off('changeEtpInfo', paramData);
                    vm.$EventBus.$emit('changeIndexInfo', paramData);
                }
                
                vm.showIndexDetailDialog = true;                
                vm.showMarketInfo = 0;
                vm.showFaver = true;
            }


            vm.className = "conWidth_left";  
            vm.FaverClassName = "conWidth_right";   
        },
        showMessageBox: function(title, msg, option, gubun) {
            this.$root.$confirm.open(title,msg, option, gubun);
        }
    }   


}
</script>

<style scoped>

</style>