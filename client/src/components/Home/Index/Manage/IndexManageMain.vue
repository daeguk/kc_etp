<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs
        slot="extension"
        light
        v-model="activeTab"
        align-with-title
        app
        fixed
        clipped-left
        clipped-right
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab v-for="tab of tabs" :key="tab.id" @click="pageMove(tab.route)">{{ tab.name }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="tab of tabs" :key="tab.id"></v-tab-item>
      </v-tabs-items>
      <router-view></router-view>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        activeTab: 0,
        tabs: [{
          id: 1,
          name: "관리지수목록",
          route: '/index/manage/indexList'
        }, {
          id: 2,
          name: "지수종목상세",
          route: '/index/manage/indexDetailList'
        }],
      };
    },
    mounted: function() {
      if(this.$route.query.activeTab == 1) {
        this.activeTab = 1;
        this.pageMove(this.tabs[1].route);
      } else {
        this.activeTab = 0;
        this.pageMove(this.tabs[0].route);
      }
    },
    created: function() {},
    beforeUpdated: function() {},
    updated: function() {},
    methods: {
      pageMove: function(route) {
        this.$router.push(route);
      }
    }
  }
</script>
<style scoped>
</style>