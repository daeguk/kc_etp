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
  import Config from "@/js/config.js";
  export default {
    components: {},
    data() {
      return {};
    },
    beforeCreate() {},
    created: function() {
      let finalPath = localStorage.getItem('finalPath');
      // console.log("finalPath.....");
      // console.log(finalPath);
      if(finalPath !== null && finalPath !== '/') {
        this.$router.push({
          path: finalPath
        });
      } else if(this.$store.state.user.type_cd == '0003') {
        this.$router.push({
          path: Config.jisu_url
        });
      } else if(this.$store.state.user.type_cd == '0001' || this.$store.state.user.type_cd == '0002' || this.$store.state.user.type_cd == '0004' || this.$store.state.user.type_cd == '9998' || this.$store.state.user.type_cd == '9999') {
        this.$router.push({
          path: Config.etp_url
        });
      } else {
        this.$router.push({
          path: Config.info_url
        });
      }
    },
    beforeDestroy() {},
    methods: {}
  }
</script>
<style scoped>
</style>