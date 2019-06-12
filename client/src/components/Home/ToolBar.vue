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
    <v-btn icon dark class="topmenu_icon" @click="contextMenuClick" 
            @mouseover="contextMenuOver"><v-icon>apps</v-icon>
    </v-btn>
    <span class="top_cont_title">{{menuTitle}}</span>
  <ContextMenu v-show="isContext" @menuClick="menuClick"></ContextMenu>
  <v-spacer></v-spacer>
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
        isContext: false,
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
    contextMenuClick: function() {
      // console.log('ToolBar contextMenuClick!!!');
      var vm = this;
      this.isContext = !this.isContext;
      vm.clickTimer = 1;
      setTimeout(function() {
        vm.clickTimer = 0;
      }, 1000);
    },
    contextMenuOver: function() {
      // console.log('ToolBar contextMenuClick!!!');
      if(this.clickTimer == 0) {
        this.isContext = true;
      }
    },
    menuClick: function(menu) {
      // console.log("menuClick........: " + menu.title);
      this.isContext = false;
      this.menuTitle = menu.title;
    },
    outService: function() {
      console.log("UserInfo.vue....... outService...");
      // Home.vue
      this.$EventBus.$emit("outService");
    },
    movePage: function(link) {
        this.$router.push({path:link});
    }
  }
}  
</script>

<style scoped>

</style>