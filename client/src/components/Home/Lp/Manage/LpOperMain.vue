<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs slot="extension" v-model="activeTab" align-with-title light>
        <v-tabs-slider color="#1e99e8"></v-tabs-slider>
        <v-tab v-for="tab of tabs" :key="tab.id" @click="pageMove(tab.id)" >
            {{ tab.name }}
        </v-tab>                
      </v-tabs>
      <LpOperControl 
        @fn_setActiveTab="fn_setActiveTab">
      </LpOperControl>
    </v-flex>
  </v-layout>
</template>

<script>
import LpOperControl from  '@/components/Home/Lp/Manage/LpOperControl.vue'

export default {
  data() {
    return {
      activeTab: 0,
      tabs: [
        {id: 0, name: "LP 운용정보"},
      ],
    };
  },
  components: {
    LpOperControl,
  },
  created() {
    // console.log("LpOperMain.......created.........");

  },
  destroyed() {
    // console.log("LpOperMain.......destroyed.........");
  },
  mounted: function() {
    this.activeTab = 0;
    this.pageMove(0);
  },
  methods: {
    pageMove : function(tab_id) {
      console.log("pageMove : " + tab_id);
      this.$EventBus.$emit("showList2", {tab_id:tab_id, paramData : {}});
    },

    fn_setActiveTab : function(activeTab) {
      this.activeTab = activeTab;
    }
  }
};
</script>
