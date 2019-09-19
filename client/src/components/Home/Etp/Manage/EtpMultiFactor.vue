<template>
  <div>
    <h4 class="mb-0">Multi Factors</h4>
    <span>MSCI FaCS를 기반으로 ETF와 팩터별 점수를 계산합니다.</span>
    <v-layout>
      <v-flex xs1>
        <br>
        <br>
        <img width="40px" height="30px" src="/assets/img/value.jpg"><span>Value</span><br>
        <img width="40px" height="30px" src="/assets/img/lowsize.jpg"><span>Low Size</span><br>
        <img width="40px" height="30px" src="/assets/img/momentum.jpg"><span>Momentum</span><br>
        <img width="40px" height="30px" src="/assets/img/quality.jpg"><span>Quality</span><br>
        <img width="40px" height="30px" src="/assets/img/yield.jpg"><span>Yield</span><br>
        <img width="40px" height="30px" src="/assets/img/lowvol.jpg"><span>Low Vol</span><br>
        <img width="40px" height="30px" src="/assets/img/liquidity.jpg"><span>Liquidity</span><br>
        <img width="40px" height="30px" src="/assets/img/growth.jpg"><span>Growth</span>
      </v-flex>
      <v-flex xs10>
        <v-layout>
          <v-flex xs4>
            <MultiFactorChart chartId="MultiFactorChart" :etpBasic="etpBasic" gubun=0></MultiFactorChart>
          </v-flex>
          <v-flex xs4>
            <MultiFactorChart v-if="etpBasic1flag" chartId="MultiFactorChart1" 
              :etpBasic="etpBasic1" gubun=1
              @openMastModal="openMastModal(1)"></MultiFactorChart>
            <div v-else style="border: 1px solid #69F0AE;">
              <span> 비교할 종목을 선택하세요.</span>
              <v-btn outline small color="#69F0AE" dark v-on:click="openMastModal(1)">
                <v-icon small color="#69F0AE">add</v-icon>종목검색
              </v-btn>
            </div>
          </v-flex>
          <v-flex xs4>
            <MultiFactorChart v-if="etpBasic2flag" chartId="MultiFactorChart2" 
              :etpBasic="etpBasic2" gubun=1
              @openMastModal="openMastModal(2)"></MultiFactorChart>
            <div v-else style="border: 1px solid #69F0AE;">
              <span> 비교할 종목을 선택하세요.</span>
              <v-btn outline small color="#69F0AE" dark v-on:click="openMastModal(2)">
                <v-icon small color="#69F0AE">add</v-icon>종목검색
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <MastPopup v-if="MastModalFlag" @selectedItem="getMsciFactorItem" @closeMastModal="closeMastModal" ></MastPopup>
  </div>
</template>

<script>
import MultiFactorChart from "@/components/common/chart/MultiFactorChart";
import MastPopup from "@/components/common/popup/MastPopup";
import Config from "@/js/config.js";
import util from "@/js/util.js";

export default {
  props: ["etpBasic" ],

  data() {
    return {
      MastModalFlag: false,
      etpBasic1: {},
      etpBasic1flag: false,
      etpBasic2: {},
      etpBasic2flag: false,
      selectedBox: 1, 
    };
  },
  watch: {
    'etpBasic.F16013': function() {
      // console.log("watch.........etpBasic.F16013: ");
      // console.log(this.etpBasic);
      this.init();
    },
  },
  components: {
    MultiFactorChart,
    MastPopup,
  },
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init: function() {
      // console.log("EtpMultiFactor.................");
      // console.log(this.etpBasic);
    },
    openMastModal: function(val) {  
      // console.log("openMastModal..........");
      this.selectedBox = val;
      this.MastModalFlag = true; 
    },         
    closeMastModal: function() { 
      this.MastModalFlag = false; 
    },
    getMsciFactorItem: function(items, market) {
      if(market == 1) {
        if(this.selectedBox == 1) {
          this.etpBasic1 = items[0];
          this.etpBasic1flag = true;
        }else if(this.selectedBox == 2) {
          this.etpBasic2 = items[0];
          this.etpBasic2flag = true;
        }
      }else {
        alert("ETF 종목만 선택할 수 있습니다.");
      }
    },
  }
};
</script>
