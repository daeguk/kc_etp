<template>
  <div id="app">
    <router-view></router-view>
    <ConfirmDialog ref="confirmt"></ConfirmDialog>
    <ProgressBar ref="progresst"></ProgressBar>
  </div>
</template>

<script>
import Config from "@/js/config.js"
import util from "@/js/util.js"
import Constant from "@/store/store_constant.js"
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";

export default {
  name: 'app',
  data () {
    return {
      // IndexMast: [],
      // EtpMast: [],
      ws: null,
    }
  },
  components: {
    ConfirmDialog,
    ProgressBar
  },
  created() {
    // this.$router.push({ path: '/landing'});

  },
  mounted: function() {
    this.$root.confirmt = this.$refs.confirmt;
    this.$root.progresst = this.$refs.progresst;
    // 실시간 데이터 테스트 완료 (2019.11.02)
    // this.initWebSocket();
    this.setBefDates();
    // ETP / INDEX MASTER 처리 (초기 접속 속도 문제로 블록킹)
    // this.getEtpMast();
    // this.getIndexMast();

    // PC / MOBILE 분기 처리
    var filter = "win16|win32|win64|mac|macintel"; 
    console.log("Created..........");
    console.log(navigator.platform);
    if ( navigator.platform ) { 
      if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) { 
        this.$router.push({ path: '/mobile'});
      } else { 
        this.$router.push({ path: '/'});
        // this.$router.push({ path: '/mobile'});
        //pc alert('pc 접속'); 
      } 
    }
  },
  methods: {
    // 실시간 데이터 테스트 완료 (2019.11.02)
    /*
    initWebSocket: function() {
      console.log("initWebSocket..........");
      var vm = this;
      this.socket = new WebSocket(Config.ws_url);
      this.socket.onopen = function() {
        console.log("Connected......");
        vm.socket.send(JSON.stringify({msg: "CLIENT TEST"}));
      }
      this.socket.onmessage = function(recv) {
        console.log("onmessage..........");
        console.log(recv.data);
        var rMsg = JSON.parse(recv.data);
        vm.$EventBus.$emit(rMsg.event, rMsg);
        // var tmp = JSON.parse(recv.data)
        // console.log(tmp.msg);
      }
    },
    */
    setBefDates: function() {
      var befDates = {};

      befDates.bef1Week = util.getBef1Week();
      befDates.bef1Month = util.getBef1Month();
      befDates.bef3Month = util.getBef3Month();
      befDates.bef6Month = util.getBef6Month();
      befDates.befYtd = util.getBefYtd();
      befDates.bef1Year = util.getBef1Year();
      befDates.bef3Year = util.getBef3Year();
      befDates.bef5Year = util.getBef5Year();
      befDates.bef10Year = util.getBef10Year();

      this.$store.commit(Constant.SET_BEF_DATES, befDates);
    },
    getEtpMast: function() {
      var vm = this;
      // console.log("App.vue : getEtpMast");
      
      axios.get(Config.base_url + "/user/marketinfo/getEtpMast", {
        params: {
        }
      }).then(response => {
        // console.log(response);
        if (response.data.success == false) {
          // alert("ETP정보가 없습니다.");
        } else {
          vm.$store.commit(Constant.SET_ETP, response.data.results);
        }
      });
    },   
    getIndexMast: function() {
      var vm = this;
      // console.log("App.vue : getIndexMast");
      
      axios.get(Config.base_url + "/user/marketinfo/getIndexMast", {
        params: {
        }
      }).then(response => {
        // console.log(response);
        if (response.data.success == false) {
          // alert("지수정보가 없습니다.");
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