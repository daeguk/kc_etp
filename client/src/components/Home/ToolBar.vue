<template>
<v-toolbar fixed app clipped-left clipped-right dark color="#434343" class="elevation-0"  style="z-index:100;">
  <!--v-toolbar-side-icon @click="menuClick"></v-toolbar-side-icon-->
  <v-toolbar-title>
    <a class="routerlink logo" @click="outService">ETP PLATFORM</a>
    <!--v-menu offset-y open-on-hover class="top_menu" >
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
    </v-menu-->
  </v-toolbar-title>


<v-btn
          icon
          dark
          class="topmenu_icon"
        ><v-icon @mouseover="showContextMenu($event)">apps</v-icon>
        </v-btn>

<template id="template-context-menu">
    <!--div id="context-menu"  v-on:mouseleave="hideContextMenu()"-->
    <div id="context-menu" v-on:mouseleave="hideContextMenu()">
        <v-list  two-line  class="menu_list">
            <v-list-tile v-on:click="movePage('/info/etpinfo')">
                <v-list-tile-avatar><object type="image/svg+xml" data="/assets/img/icons/icons8-heat-map.svg" width="36px" height="36px" ></object></v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>MARKET ETP INFO</v-list-tile-title>
                <v-list-tile-sub-title>MARKET ETP 정보 조회</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="movePage('/info/indexinfo')">
        <v-list-tile-avatar><object type="image/svg+xml" data="/assets/img/icons/icons8-heat-map.svg" width="36px" height="36px"></object></v-list-tile-avatar>
            <v-list-tile-content>
          <v-list-tile-title>MARKET INDEX INFO</v-list-tile-title>
          <v-list-tile-sub-title>INDEX INFO 정보 조회</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="movePage('/index/manage/indexSummary')">
        <v-list-tile-avatar><object type="image/svg+xml"  data="/assets/img/icons/icons8-dashboard.svg" width="32px" height="32px" ></object></v-list-tile-avatar>
            <v-list-tile-content>
          <v-list-tile-title>지수 관리</v-list-tile-title>
          <v-list-tile-sub-title>지수 관리 정보 조회</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="movePage('/index/register')">
        <v-list-tile-avatar><object type="image/svg+xml" data="/assets/img/icons/icons8-login-rounded.svg" width="32px" height="32px" ></object></v-list-tile-avatar>
            <v-list-tile-content>
          <v-list-tile-title>지수 등록</v-list-tile-title>
          <v-list-tile-sub-title>지수 등록 정보 조회</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="movePage('/etp/manage')">
        <v-list-tile-avatar><object type="image/svg+xml" data="/assets/img/icons/icons8-investment-portfolio.svg" width="32px" height="32px" ></object></v-list-tile-avatar>
            <v-list-tile-content>
          <v-list-tile-title>ETP 운용 관리</v-list-tile-title>
          <v-list-tile-sub-title>ETP 운용 정보 조회</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="movePage('/etp/register')">
        <v-list-tile-avatar><object type="image/svg+xml" data="/assets/img/icons/icons8-agreement-new-filled.svg" width="32px" height="32px" ></object></v-list-tile-avatar>
            <v-list-tile-content>
          <v-list-tile-title>ETP 신규 등록</v-list-tile-title>
          <v-list-tile-sub-title>ETP 신규 정보 조회</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="movePage('/etp/contract')">
        <v-list-tile-avatar><object type="image/svg+xml" data="/assets/img/icons/icons8-gg.svg" width="32px" height="32px" ></object></v-list-tile-avatar>
            <v-list-tile-content>
          <v-list-tile-title>운용 지원</v-list-tile-title>
          <v-list-tile-sub-title>운용 지원 정보 조회</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
      </v-list>
</div>
</template>

  <v-spacer></v-spacer>
  <UserInfo></UserInfo>
</v-toolbar>

</template>



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
                menu.classList.add('active');
            }

        },
        hideContextMenu: function() {
            document.getElementById("context-menu").classList.remove('active');
        },
        movePage: function(link) {
            this.$router.push({path:link});
        }
  }
}  
</script>

<style scoped>

</style>