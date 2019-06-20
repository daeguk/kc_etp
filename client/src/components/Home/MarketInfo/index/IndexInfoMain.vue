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
        <v-tab v-for="tab of tabs" :key="tab.id" @click="pageMove(tab)" >
          {{ tab.name }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="tab of tabs" :key="tab.id" >
        </v-tab-item>
      </v-tabs-items>
      <v-layout row wrap class="content_margin con_wrap">
        <router-view></router-view>    
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>

import KrxIndexList from "./KrxIndexList.vue";
import FngIndexList from "./FngIndexList.vue";

export default {

  data() {
    return {
      activeTab: 0,
      tabs: [
        { id: 1, name: "KRX", route:"/info/indexinfo/krxindexlist"},
        { id: 2, name: "FnGuide", route:"/info/indexinfo/fngindexlist"},
      ]
    };
  },    
  mounted: function() {
    this.pageMove(this.tabs[0]);
  },
  created: function() {
      
  },
  beforeUpdated: function() {
      
  },
  components: {
    KrxIndexList,
    FngIndexList,
  },
  updated: function() {
    
  },
  methods: {
    pageMove : function(tab) {
console.log("pageMove.... " + tab.route);      
      this.$router.push({path:tab.route});
    }
  }
}
</script>

<style scoped>

</style>