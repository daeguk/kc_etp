<template>
<v-toolbar fixed app  clipped-left clipped-right dark color="#48485e" class="elevation-0"  style="z-index:100;">
  <v-toolbar-side-icon @click="menuClick"></v-toolbar-side-icon>
  <v-toolbar-title>
    <a class="routerlink logo" @click="outService">ETP PLATFORM</a>
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