<template>
  <v-app>
    <div v-if="!enterServiceFlag">
      <MainLanding></MainLanding>
    </div>
    <div v-else>
      <ToolBar></ToolBar>
      <NoticeModal v-if="showModalFlag"></NoticeModal>
      <!--NavMini v-if="!showFullFlag"></NavMini>
      <NavFull v-if="showFullFlag"></NavFull-->
      <HomeContents></HomeContents>
      <Footer></Footer>
    </div>        
  </v-app>
</template> 

<script>

import MainLanding          from './MainLanding.vue';
import ToolBar          from './ToolBar.vue';
import NavFull          from './NavFull.vue';
import NavMini          from './NavMini.vue';
import HomeContents     from './HomeContents.vue';
import NoticeModal      from './NoticeModal.vue';
import Footer           from './Footer.vue';
import Config       from "@/js/config.js";
import Constant     from '@/store/store_constant.js';

export default {
  components: {
    MainLanding: MainLanding,
    ToolBar: ToolBar,
    NavMini: NavMini,
    NavFull: NavFull,
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
    this.$EventBus.$on('popClose', this.popClose);
    this.$EventBus.$on('menuClick', this.menuClick);
    this.$EventBus.$on('enterService', this.enterService);
    this.$EventBus.$on('outService', this.outService);

    let loginDt = localStorage.getItem('loginDt');
    let nDate = new Date();
    let nTerm = nDate.getTime() - Number(loginDt);
    // console.log(nTerm);

    if(loginDt !== null && nTerm < 600000) {
      let user = JSON.parse(localStorage.getItem('user'));
      if(user !== null) {
        this.enterServiceFlag = true;
        this.$store.commit(Constant.ADD_USER, user);
      }        
    }else {
      localStorage.removeItem("finalPath");
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('popClose');
    this.$EventBus.$off('menuClick');
    this.$EventBus.$off('enterService');
    this.$EventBus.$off('outService');
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

      this.$router.push({path: Config.home_url});
    },
  }
}
</script>

<style scoped>


</style>