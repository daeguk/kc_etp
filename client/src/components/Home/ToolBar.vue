<template>
<v-toolbar fixed app clipped-left clipped-right dark color="#434343" class="elevation-0"  style="z-index:100;">
  <!--v-toolbar-side-icon @click="menuClick"></v-toolbar-side-icon-->
  <!--
  <v-toolbar-title v-on:mouseover="showContextMenu($event)">
  -->
  <v-toolbar-title>
    <a class="routerlink logo" @click="outService">ETP PLATFORM</a>
    <v-btn icon dark class="topmenu_icon" @click="contextMenuClick" 
      @mouseover="contextMenuOver"><v-icon>apps</v-icon>
    </v-btn>
    <span class="top_cont_title">{{menuTitle}}</span>
  </v-toolbar-title>
  <ContextMenu v-if="isContext" @menuClick="menuClick"></ContextMenu>
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
      console.log("menuClick........: " + menu.title);
      this.isContext = false;
      this.menuTitle = menu.title;
    },
    outService: function() {
      console.log("UserInfo.vue....... outService...");
      // Home.vue
      this.$EventBus.$emit("outService");
    },
<<<<<<< HEAD
    movePage: function(link) {
        this.$router.push({path:link});
    }
=======
    showContextMenu: function(e) {
            
            console.log("showContextMenu");
            var menu = document.getElementById("context-menu");

            if (menu.className == "active") {
                //menu.classList.remove('active');
                return;
            } else {
                if(!this.contextMenuWidth || !this.contextMenuHeight) {
                    menu.style.visibility = "hidden";
                    menu.style.display = "block";
                    this.contextMenuWidth = menu.offsetWidth;
                    this.contextMenuHeight = menu.offsetHeight;
                    menu.removeAttribute("style");
                }

                

                if((this.contextMenuWidth + e.pageX) >= window.innerWidth) {
                    menu.style.left = (e.pageX - this.contextMenuWidth) + "px";
                } else {
                    var left = 0;
                    if (e.pageX >= 441) {
                        left = 441;
                    } else {
                        left = e.pageX - 31;
                    }
                     
                    menu.style.left = left + "px";
                }
                
            
                menu.style.top = "50px";                


                menu.classList.add('active');
            }

        },
        hideContextMenu: function() {
            document.getElementById("context-menu").classList.remove('active');
        },
        movePage: function(link) {
            this.$router.push({path:link});
        }
>>>>>>> 831595454de01951ec8e7b676bf08c2e506e70e1
  }
}  
</script>

<style scoped>

</style>