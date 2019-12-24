<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs>
<!--      
  to 를 쓰면, tab에 있는 under-bar 가 반응하지 않음
        <v-tab v-for="tab of tabs" :key="tab.id" :to="tab.route">
-->        
        <v-tab v-for="tab of tabs" :key="tab.id" @click="pageMove(tab.route)">
          {{tab.name}}
        </v-tab>                
      </v-tabs>
      <router-view></router-view>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  data() {
    return {
      tabs: [
        {id: 0, name: "LP 운용정보", route: '/lp/manage/lpOperInfo'},
        // {id: 1, name: "LP 운용정보1", route: '/lp/manage/lpOperInfo'},
      ],
    };
  },
  components: {
  },
  mounted: function() {
  },
  methods: {
    pageMove: function(rpath) {
      // console.log("path : " + rpath) ;
      this.$router.push({path:rpath});
    }
  }
};
</script>
