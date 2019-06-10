<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs
          slot="extension"
          v-model="activeTab"
          align-with-title
          light
      >
      <v-tabs-slider color="#35e0e2"></v-tabs-slider>

          <v-tab v-for="tab of tabs"  :key="tab.id" @click="pageMove(tab.id)" >
              {{ tab.name }}
          </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
          <v-tab-item v-for="tab of tabs"  :key="tab.id" >
          </v-tab-item>
      </v-tabs-items>
    
    <IndexInfoControl :activeTab="activeTab"></IndexInfoControl>
    </v-flex>
  </v-layout>
</template>

<script>

import IndexInfoControl from  '@/components/Home/MarketInfo/index/IndexInfoControl.vue'

export default {

  data() {
    return {
      activeTab: 0,
      inx : 2,
      tabs: [
        { id: 1, name: "KRX"       , route: '/info/indexinfo/krx' },
        { id: 2, name: "FnGuide"       , route: '/info/indexinfo/fnguide' },
      ]
/*            
      inx : 1,
      tabs: [
        { id: 1, name: "KRX"       , route: '/info/indexinfo/Today' },
      ]
*/            
    };
  },    
  mounted: function() {
    this.activeTab = 0;
    this.pageMove(1);
  },
  created: function() {
      
  },
  beforeUpdated: function() {
      
  },
  components: {
    IndexInfoControl : IndexInfoControl
  },
  updated: function() {
    
  },
  methods: {
    pageMove : function(tab_id) {
      /* 페이지 이동시 마다 이벤트 삭제 처리 */
      this.$EventBus.$off('changeEtpInfo');
      this.$EventBus.$off('changeIndexInfo');
      this.$EventBus.$off('changeIndexBasicInfo');
      this.$EventBus.$off('changeIndexAnalysisInfo');
      this.$EventBus.$off('changeEtpAnalysisInfo');

      this.$EventBus.$emit("showList", {tab_id:tab_id});

      
      //this.activeTab = id + 1;
      //this.$router.push({path:'/info/etpinfo/EtpMarketInfo', props:{activeTab:this.activeTab}});
    }
  }
}
</script>

<style scoped>

</style>