<template>
  <div class="text-xs-center">
    <v-menu offset-y open-on-hover dark>
      <template v-slot:activator="{ on }">
        <v-btn class="topmenu_icon"
          icon
          dark
          v-on="on"
        >
        <v-icon>apps</v-icon>
        </v-btn>
      </template>
      <v-list  two-line  class="menu_list">
    <v-list-tile v-for="(menu, index) in menuList" :key="index" :menu='menu' v-on:click="movePage(menu)">
      <v-list-tile-avatar><object type="image/svg+xml" :data="menu.imagePath" width="36px" height="36px" ></object></v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{menu.title}}</v-list-tile-title>
        <v-list-tile-sub-title>{{menu.stitle}}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
    </v-menu>
  </div>
</template>

<!--template>
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
</template-->
<script>
export default {
  data() {
    return {
      allMenuList: [
        {path: '/info/etpinfo', imagePath:'/assets/img/marketetp_icon.png', title: 'MARKET ETP INFO', stitle: 'MARKET ETP 정보 조회'},
        {path: '/info/indexinfo', imagePath:'/assets/img/marketindex_icon.png', title: 'MARKET INDEX INFO', stitle: 'INDEX INFO 정보 조회'},
        {path: '/index/manage/indexSummary', imagePath:'/assets/img/icons/icons8-dashboard.svg', title: '지수 관리', stitle: '지수 관리 정보 조회'},
        {path: '/index/register', imagePath:'/assets/img/icons/icons8-login-rounded.svg', title: '지수 등록', stitle: '지수 등록 정보 조회'},
        {path: '/etp/manage', imagePath:'/assets/img/icons/icons8-investment-portfolio.svg', title: 'ETP 운용 관리', stitle: 'TP 운용 정보 조회'},
        {path: '/etp/register', imagePath:'/assets/img/icons/icons8-agreement-new-filled.svg', title: 'ETP 신규 등록', stitle: 'ETP 신규 정보 조회'},
        {path: '/OperSupport/OperSupportControl', imagePath:'/assets/img/icons/icons8-agreement-new-filled.svg', title: '운용 지원', stitle: '지수 코드정보 및 기타 지원용 데이터 조회'},
        {path: '/simulation/simulationControl', imagePath:'/assets/img/icons/icons8-agreement-new-filled.svg', title: '시뮬레이션', stitle: '시뮬레이션 등록'},
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
    // console.log("this : ");
    // console.log(this.$store.state.user);
    var type_cd = this.$store.state.user.type_cd;
    var tmp = this.$store.state.user.email;
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
      
    }else if(type_cd == '9998' || type_cd == '9999') {
      this.menuList.push(this.allMenuList[2]);
      this.menuList.push(this.allMenuList[3]);
      this.menuList.push(this.allMenuList[4]);
      this.menuList.push(this.allMenuList[5]);
      this.menuList.push(this.allMenuList[6]);      //  운용 지원
    }else {

    }
    if(tmp.indexOf("test@") !== -1 || tmp.indexOf("test_etn@") !== -1) {
      this.menuList.push(this.allMenuList[7]);      //  시뮬레이션
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
.v-menu__content{position:fixed !important; top:56px !important;}

</style>