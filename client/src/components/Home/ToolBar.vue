<template>
<v-toolbar fixed app clipped-left clipped-right dark color="#323232" class="elevation-0"  style="z-index:100;">
  <!--v-toolbar-side-icon @click="menuClick"></v-toolbar-side-icon-->
  <v-toolbar-title>
    <a class="routerlink logo" @click="outService">ETP PLATFORM</a>
    <v-menu offset-y open-on-hover class="top_menu" >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          dark
          v-on="on"
        ><v-icon>apps</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile>
          <v-list-tile-title><router-link class="routerlink" to="/info/etpinfo"><img src="/assets/img/icons/icons8-agreement-new-filled.svg" width="24px" height="24px" class="svg_icon">MARKET ETP INFO</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title><router-link class="routerlink" to="/info/indexinfo"><v-icon>apps</v-icon>MARKET INDEX INFO</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title><router-link class="routerlink" to="/index/manage/indexSummary"><v-icon>apps</v-icon>지수 관리</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title><router-link class="routerlink" to="/index/register"><v-icon>apps</v-icon>지수 등록</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title><router-link class="routerlink" to="/etp/manage"><v-icon>apps</v-icon>ETP 운용 관리</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title><router-link class="routerlink" to="/etp/register"><v-icon>apps</v-icon>ETP 신규 등록</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title><router-link class="routerlink" to="/etp/contract"><v-icon>apps</v-icon>운용 지원</router-link></v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar-title>


<v-btn
          icon
          dark
          @click.prevent="showContextMenu($event)"
        ><v-icon>apps</v-icon>
        </v-btn>

<template id="template-context-menu">
<div id="context-menu" v-on:mouseleave="hideContextMenu()">
  <v-list>
        <v-list-tile v-on:click="hideContextMenu()">
          <v-list-tile-title><router-link class="routerlink" to="/info/etpinfo"><img src="/assets/img/icons/icons8-agreement-new-filled.svg" width="24px" height="24px" class="svg_icon">MARKET ETP INFO</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click="hideContextMenu()">
          <v-list-tile-title><router-link class="routerlink" to="/info/indexinfo"><v-icon>apps</v-icon>MARKET INDEX INFO</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click="hideContextMenu()">
          <v-list-tile-title><router-link class="routerlink" to="/index/manage/indexSummary"><v-icon>apps</v-icon>지수 관리</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click="hideContextMenu()">
          <v-list-tile-title><router-link class="routerlink" to="/index/register"><v-icon>apps</v-icon>지수 등록</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click="hideContextMenu()">
          <v-list-tile-title><router-link class="routerlink" to="/etp/manage"><v-icon>apps</v-icon>ETP 운용 관리</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click="hideContextMenu()">
          <v-list-tile-title><router-link class="routerlink" to="/etp/register"><v-icon>apps</v-icon>ETP 신규 등록</router-link></v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click="hideContextMenu()">
          <v-list-tile-title><router-link class="routerlink" to="/etp/contract"><v-icon>apps</v-icon>운용 지원</router-link></v-list-tile-title>
        </v-list-tile>
      </v-list>
</div>
</template>

  <v-spacer></v-spacer>
  <UserInfo></UserInfo>
</v-toolbar>

</template>


<style>
#context-menu {
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  display: none;
  list-style: none;
  position: absolute;
  z-index: 2147483647;
  background-color: white;
  border: 1px solid #ebebeb;
  border-bottom-width: 0px;
}

#context-menu.active {
  display: block;
}

.context-menu-icon {
  top: 1px;
  position: relative;
  margin-right: 10px;
}

.context-menu-item {
  display: flex;
  cursor: pointer;
  padding: 8px 15px;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
}

.context-menu-item:hover {
  background-color: #ebebeb;
}
</style>

<script>
import UserInfo          from './UserInfo.vue';
import Config       from "@/js/config.js";
import Constant     from '@/store/store_constant.js';

export default {
  data() {
    return {
        isDrawer: true,
        homeUrl: Config.home_url,
    };
  },
  components: {
    UserInfo: UserInfo,
  },
  created: function() {
  },
  beforeDestroy() {
  },    
  mounted: function() {
  },
  methods: {
    menuClick: function() {
      console.log('ToolBar menuClick!!!');
      this.isDrawer = !this.isDrawer;
      this.$EventBus.$emit("menuClick", this.isDrawer);
    },
    outService: function() {
      console.log("UserInfo.vue....... outService...");
      // Home.vue
      this.$EventBus.$emit("outService");
    },
    showContextMenu: function(e) {
            
            
            var menu = document.getElementById("context-menu");

            if (menu.className == "active") {
                menu.classList.remove('active');
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
                    var left = e.pageX - 50;
                    menu.style.left = left + "px";
                }
                
            
                menu.style.top = "50px";                


                menu.classList.add('active');
            }

        },
        hideContextMenu: function() {
            document.getElementById("context-menu").classList.remove('active');
        }
  }
}  
</script>

<style scoped>

</style>