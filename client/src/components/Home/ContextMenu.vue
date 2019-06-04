<template>
<div class="context-menu">
  <v-list  two-line  class="menu_list">
    <v-list-tile v-for="(menu, index) in menuList" :key="index" :menu='menu' v-on:click="movePage(menu)">
      <v-list-tile-avatar><object type="image/svg+xml" :data="menu.imagePath" width="36px" height="36px" ></object></v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{menu.title}}</v-list-tile-title>
        <v-list-tile-sub-title>{{menu.stitle}}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</div>
</template>
<script>

export default {
  data() {
    return {
      menuList: [
        {path: '/info/etpinfo', imagePath:'/assets/img/icons/icons8-heat-map.svg', title: 'MARKET ETP INFO', stitle: 'MARKET ETP 정보 조회'},
        {path: '/info/indexinfo', imagePath:'/assets/img/icons/icons8-heat-map.svg', title: 'MARKET INDEX INFO', stitle: 'INDEX INFO 정보 조회'},
        {path: '/index/manage/indexSummary', imagePath:'/assets/img/icons/icons8-dashboard.svg', title: '지수 관리', stitle: '지수 관리 정보 조회'},
        {path: '/index/register', imagePath:'/assets/img/icons/icons8-login-rounded.svg', title: '지수 등록', stitle: '지수 등록 정보 조회'},
        {path: '/etp/manage', imagePath:'/assets/img/icons/icons8-investment-portfolio.svg', title: 'ETP 운용 관리', stitle: 'TP 운용 정보 조회'},
        {path: '/etp/register', imagePath:'/assets/img/icons/icons8-agreement-new-filled.svg', title: 'ETP 신규 등록', stitle: 'ETP 신규 정보 조회'},
      ],
    };
  },
  components: {
  },
  created: function() {
  },
  beforeDestroy() {
  },    
  mounted: function() {
  },
  methods: {
    movePage: function(menu) {
      this.$emit("menuClick", menu);
      this.$router.push({path:menu.path});
    }
  }
}  
</script>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 9998;
  top: 60px;
  left: 16%;
  width: 15%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}
</style>