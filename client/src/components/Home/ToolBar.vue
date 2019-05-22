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
    }
  }
}  
</script>

<style scoped>

</style>