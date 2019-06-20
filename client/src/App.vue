<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
import Config from "@/js/config.js"
import util from "@/js/util.js"
import Constant from "@/store/store_constant.js"

export default {
  name: 'app',
  data () {
    return {
      IndexMast: [],
      EtpMast: [],
    }
  },
  created() {
    // this.$router.push({ path: '/landing'});
  },
  mounted: function() {      
    this.setBefDates();
    this.getEtpMast();
    this.getIndexMast();
  },
  methods: {
    setBefDates: function() {
      var befDates = {};

      befDates.bef1Week = util.getBef1Week();
      befDates.bef1Month = util.getBef1Month();
      befDates.befYtd = util.getBefYtd();
      befDates.bef1Year = util.getBef1Year();
      befDates.bef3Year = util.getBef3Year();
      befDates.bef5Year = util.getBef5Year();
      befDates.bef10Year = util.getBef10Year();

      this.$store.commit(Constant.SET_BEF_DATES, befDates);
    },
    getEtpMast: function() {
      var vm = this;
      console.log("App.vue : getEtpMast");
      
      axios.get(Config.base_url + "/user/marketinfo/getEtpMast", {
        params: {
        }
      }).then(response => {
        // console.log(response);
        if (response.data.success == false) {
          alert("ETP정보가 없습니다.");
        } else {
          vm.$store.commit(Constant.SET_ETP, response.data.results);
        }
      });
    },   
    getIndexMast: function() {
      var vm = this;
      console.log("App.vue : getIndexMast");
      
      axios.get(Config.base_url + "/user/marketinfo/getIndexMast", {
        params: {
        }
      }).then(response => {
        // console.log(response);
        if (response.data.success == false) {
          alert("지수정보가 없습니다.");
        } else {
          vm.$store.commit(Constant.SET_INDEX, response.data.results);
        }
      });
    },   
  },
}
</script>

<style>
</style>