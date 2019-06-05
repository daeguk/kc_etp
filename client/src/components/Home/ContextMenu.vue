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
      allMenuList: [
        {path: '/info/etpinfo', imagePath:'/assets/img/icons/icons8-heat-map.svg', title: 'MARKET ETP INFO', stitle: 'MARKET ETP 정보 조회'},
        {path: '/info/indexinfo', imagePath:'/assets/img/icons/icons8-heat-map.svg', title: 'MARKET INDEX INFO', stitle: 'INDEX INFO 정보 조회'},
        {path: '/index/manage/indexSummary', imagePath:'/assets/img/icons/icons8-dashboard.svg', title: '지수 관리', stitle: '지수 관리 정보 조회'},
        {path: '/index/register', imagePath:'/assets/img/icons/icons8-login-rounded.svg', title: '지수 등록', stitle: '지수 등록 정보 조회'},
        {path: '/etp/manage', imagePath:'/assets/img/icons/icons8-investment-portfolio.svg', title: 'ETP 운용 관리', stitle: 'TP 운용 정보 조회'},
        {path: '/etp/register', imagePath:'/assets/img/icons/icons8-agreement-new-filled.svg', title: 'ETP 신규 등록', stitle: 'ETP 신규 정보 조회'},
      ],
      menuList: [],
    };
  },
  components: {
  },
  created: function() {
  },
  beforeDestroy() {
  },    
  mounted: function() {
    console.log("this : ");
    console.log(this.$store.state.user);
    var type_cd = this.$store.state.user.type_cd;
/*
(1) 로그인없이 들어올경우 - 1,2
(2) 지수사업자 - 1,2,3,4
(3) ETP발행사 - 1,2,5,6
(4) 거래소 / 사무관리사- 1,2,7
(5) 코스콤 - 1,2,3,4,5,6,7
*/
    this.menuList.push(this.allMenuList[0]);
    this.menuList.push(this.allMenuList[1]);
    if(type_cd == '0001' || type_cd == '0002') {
      this.menuList.push(this.allMenuList[4]);
      this.menuList.push(this.allMenuList[5]);
    }else if(type_cd == '0003') {
      this.menuList.push(this.allMenuList[2]);
      this.menuList.push(this.allMenuList[3]);
    }else if(type_cd == '0004' || type_cd == '0005') {
      
    }else if(type_cd == '9998') {
      this.menuList.push(this.allMenuList[2]);
      this.menuList.push(this.allMenuList[3]);
      this.menuList.push(this.allMenuList[4]);
      this.menuList.push(this.allMenuList[5]);
    }else {

    }
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