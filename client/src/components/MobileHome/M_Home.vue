<template>
  <v-app>
    <div v-if="!enterServiceFlag">
      <MainLanding></MainLanding>
    </div>
    <div v-else>    
      <ToolBar></ToolBar>
      <NoticeModal v-if="showModalFlag"></NoticeModal>
      <HomeContents></HomeContents>
      <Footer></Footer>      
    </div>        
  </v-app>
</template> 

<script>

import MainLanding          from './M_MainLanding.vue';
import ToolBar          from './M_ToolBar.vue';
import HomeContents     from './M_HomeContents.vue';
import NoticeModal      from './M_NoticeModal.vue';
import Footer           from './M_Footer.vue';
import Config       from "@/js/config.js";
import Constant     from '@/store/store_constant.js';

export default {
  components: {
    MainLanding: MainLanding,
    ToolBar: ToolBar,
    HomeContents: HomeContents,
    NoticeModal:NoticeModal,
    Footer: Footer,
  },
  data() {
    return {
      showModalFlag: false,
      showFullFlag: true,
      enterServiceFlag: false,
    };
  },
  beforeCreate() {
      // this.$forceupdate;
  },
  created: function() {
    this.$EventBus.$on('MPopClose', this.popClose);
    this.$EventBus.$on('MMenuClick', this.menuClick);
    this.$EventBus.$on('MEnterService', this.enterService);
    this.$EventBus.$on('MOutService', this.outService);

    let loginDt = localStorage.getItem('loginDt');
    let nDate = new Date();
    let nTerm = nDate.getTime() - Number(loginDt);
   /* console.log("Home.vue.............");
    console.log("loginDt : " + loginDt + " nDate : " + nDate + "nTerm : " + nTerm);

    if(loginDt !== null && nTerm < 600000) {
      let user = JSON.parse(localStorage.getItem('user'));
console.log("user.........");
console.log(user);
      if(user !== null) {
        this.enterServiceFlag = true;
        this.$store.commit(Constant.ADD_USER, user);
      }        
    }else {
      localStorage.removeItem("finalPath");
    }*/
  },
  beforeDestroy() {
    this.$EventBus.$off('MPopClose');
    this.$EventBus.$off('MMenuClick');
    this.$EventBus.$off('MEnterService');
    this.$EventBus.$off('MOutService');
  },    
  methods: {
    popClose: function() {
      // console.log('popClose');
      this.showModalFlag = false;
    },
    menuClick: function(isDrawer) {
      // console.log('Home menuClick');
      this.showFullFlag = isDrawer;
    },
    enterService: function() {      
      // console.log('enterService............');
      this.enterServiceFlag = true;
    },
    outService: function() {
      // console.log('outService............');
      this.enterServiceFlag = false;
      localStorage.clear();
      this.$store.commit(Constant.DELETE_USER);

      this.$router.push({path: Config.mobile_home});
    },
  }
}
</script>

<style scoped>


</style>