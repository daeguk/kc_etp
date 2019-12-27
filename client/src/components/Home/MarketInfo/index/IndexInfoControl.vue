<template>
  <v-layout row wrap class="content_margin con_wrap">
    <v-flex grow :class="className">
      <KrxIndexList v-if="activeTab == 1"></KrxIndexList>       
      <FngIndexList v-if="activeTab == 2"></FngIndexList>       
    </v-flex>
    <v-flex :class="FaverClassName">
      <ComFavorItemSub v-if="showFaver"  :faverSize = "faverSize" @showDetail="showDetail"></ComFavorItemSub>
    </v-flex>
  </v-layout> 
</template>

<script>

import util       from "@/js/util.js";
import Config from "@/js/config.js";
import today from "./today.vue";
import KrxIndexList from "./KrxIndexList.vue";
import FngIndexList from "./FngIndexList.vue";
import ComFavorItemSub from "@/components/common/control/ComFavorItemSub"; 
import IndexDetailInfo from "@/components/Home/Index/Manage/IndexDetailInfo.vue";   /*지수 상세정보*/
import EtpManageDetail from "@/components/Home/Etp/Manage/EtpManageDetail.vue";         /*ETP 상세정보*/

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
      faverSize: 1059
    };
  },    

    components: {
        ComFavorItemSub : ComFavorItemSub,
        IndexDetailInfo : IndexDetailInfo,
        EtpManageDetail :   EtpManageDetail,
        KrxIndexList,
        FngIndexList,
    },

    mounted: function() {
        // 메시지 박스 참조
        this.className = "conWidth_100";
        // console.log("activeTab : " + this.activeTab);
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
    beforeDestroy: function() {
      var vm = this;
      vm.$EventBus.$off('showList');
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
            vm.className = "conWidth_left";  
            vm.FaverClassName = "conWidth_right";   
        },
    }   


}
</script>

<style scoped>

</style>