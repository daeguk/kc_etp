<template>
<v-toolbar fixed app clipped-left clipped-right dark color="#434343" class="elevation-0"  style="z-index:100;">
  <!--v-toolbar-side-icon @click="menuClick"></v-toolbar-side-icon-->
  <!--
  <v-toolbar-title v-on:mouseover="showContextMenu($event)">
  -->
  <v-toolbar-title>
    <div class="logo_w">
        <a class="routerlink logo" @click="outService">EMP<span>Etp Management<br> Platform</span></a>
    </div>
  </v-toolbar-title>
    <ContextMenu v-show="isContext" @menuClick="menuClick"></ContextMenu>
    <span class="top_cont_title">{{menuTitle}}</span>
  <v-spacer></v-spacer>
  <!--고객지원---->
  <v-menu v-model="menu" bottom offset-y :close-on-content-click="false" >
        <template v-slot:activator="{ on }">
            <v-btn flat v-on="on" class="support_btn"><v-icon>send</v-icon> 고객지원</v-btn>
        </template>
        <v-card flat class="support">
            <v-card-title><h5>고객지원</h5>
            <p>서비스 관련 문의 및 개선해야 할 사항을 남겨주시면 빠른시간 내에 답변 드리겠습니다.</p>
            <v-textarea label="" outline color="blue" height="220px"></v-textarea>
            </v-card-title>
                <div class="text-xs-center">  
                    <v-btn dark depressed color="primary" @click="menu = false">전송하기</v-btn>
                </div>
        </v-card>
      </v-menu>
    <!--고객지원end---->  
  <UserInfo></UserInfo>
</v-toolbar>

</template>


<script>
import ContextMenu          from './ContextMenu.vue';
import UserInfo          from './UserInfo.vue';
import Config       from "@/js/config.js";
import Constant     from '@/store/store_constant.js';




export default {
  data() {
    return {
        isContext: true,
        menuTitle: "MARKET ETP INFO",
        clickTimer: 0,
        homeUrl: Config.home_url,
    };
  },
  components: {
    ContextMenu, UserInfo
  },
  created: function() {
  },
  beforeDestroy() {
  },    
  mounted: function() {
  },
  methods: {
//    contextMenuClick: function() {
      // console.log('ToolBar contextMenuClick!!!');
//      var vm = this;
//      this.isContext = !this.isContext;
//      vm.clickTimer = 1;
//      setTimeout(function() {
//        vm.clickTimer = 0;
//      }, 1000);
 //   },
 //   contextMenuOver: function() {
      // console.log('ToolBar contextMenuClick!!!');
//      if(this.clickTimer == 0) {
//        this.isContext = true;
//      }
//    },
    menuClick: function(menu) {
      //console.log("menuClick........: " + menu.title);        
        this.menuTitle = menu.title;
     },
    outService: function() {
      console.log("UserInfo.vue....... outService...");
      // Home.vue
      this.$EventBus.$emit("outService");
    },
  }
}  
</script>

<style scoped>
.v-menu__content.menuable__content__active{left:60% !important;}
</style>