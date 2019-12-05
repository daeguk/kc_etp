<template>
  <v-content>
    <v-container fluid>
      <div id="_content">
        <router-view></router-view>
      </div>
    </v-container>
  </v-content>
</template> 

<script>
import Config       from "@/js/config.js";
import EtpInfoMain     from '@/components/Home/MarketInfo/etp/EtpInfoMain.vue';
export default {
  components: {
    EtpInfoMain
  },
  data() {
    return {
    };
  },
  beforeCreate() {
  },
  created: function() {
    let finalPath = localStorage.getItem('finalPath');

    this.$router.push({ path: Config.mobile_home + Config.info_url });      
    
  },
  beforeDestroy() {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>