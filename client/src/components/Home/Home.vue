<template>
  <v-app>
    <div v-if="!enterServiceFlag">
      <MainLanding></MainLanding>
    </div>
    <div v-else>
      <ToolBar></ToolBar>
      <NoticeModal v-if="showModalFlag"></NoticeModal>
      <NavMini v-if="!showFullFlag"></NavMini>
      <NavFull v-if="showFullFlag"></NavFull>
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
  data() {
    return {
      showModalFlag: false,
      showFullFlag: true,
      enterServiceFlag: false,
    };
  },
  components: {
    MainLanding: MainLanding,
    ToolBar: ToolBar,
    NavMini: NavMini,
    NavFull: NavFull,
    HomeContents: HomeContents,
    NoticeModal:NoticeModal,
    Footer: Footer,
  },
  beforeCreate() {
      // this.$forceupdate;
  },
  created: function() {
    this.$EventBus.$on('popClose', this.popClose);
    this.$EventBus.$on('menuClick', this.menuClick);
    this.$EventBus.$on('enterService', this.enterService);
    this.$EventBus.$on('outService', this.outService);
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
      console.log('Home menuClick');
      this.showFullFlag = isDrawer;
    },
    enterService: function() {
      console.log('enterService............');
      this.enterServiceFlag = true;
    },
    outService: function() {
      console.log('outService............');
      this.enterServiceFlag = false;
      this.$store.commit(Constant.DELETE_USER);

      // 로그인 정보 LocalStorage에서 삭제
      sessionStorage.clear();

      this.$router.push({
        path: Config.home_url
      });
    },
  }
}
</script>

<style scoped>


</style>