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
    
},
  methods: {
    movePage: function(menu) {
      this.$emit("MMenuClick", menu);
      this.$router.push({path:menu.path});
    }
  }
}  
</script>

<style scoped>
.v-menu__content{position:fixed !important; top:56px !important;}

</style>