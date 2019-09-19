<template>
  <div>
    <h4 class="mb-0">Fund Flows</h4>
    <span class="multi_sub_tit">기간별 자금 유입현황을 추정합니다.</span><br>
    <span class="multi_sub_sub_tit">*단위 : 억원</span>
    <v-layout>
      <v-flex xs6>
        <img :src="barImg">
        <span>1주</span>
        <span @click="openRankModal(0)" class="multif_btn1">[전체순위보기]</span>
        <FundFlowChart v-if="chartLoadFlag1"
          chartId="FundFlowChart1" :etpBasic="etpBasic"
          :sitem="sitem[0]" :eitem="eitem[0]" :citem="citem[0]" 
          :rank="rank[0]" :num="num[0]"></FundFlowChart>
      </v-flex>
      <v-flex xs6>
        <img :src="barImg">
        <span>1개월</span>
        <span @click="openRankModal(1)" class="multif_btn1">[전체순위보기]</span>
        <FundFlowChart v-if="chartLoadFlag2"
          chartId="FundFlowChart2" :etpBasic="etpBasic"
          :sitem="sitem[1]" :eitem="eitem[1]" :citem="citem[1]" 
          :rank="rank[1]" :num="num[1]"></FundFlowChart>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs6>
        <img :src="barImg">
        <span>3개월</span>
        <span @click="openRankModal(2)" class="multif_btn1">[전체순위보기]</span>
        <FundFlowChart v-if="chartLoadFlag3"
          chartId="FundFlowChart3" :etpBasic="etpBasic"
          :sitem="sitem[2]" :eitem="eitem[2]" :citem="citem[2]" 
          :rank="rank[2]" :num="num[2]"></FundFlowChart>
      </v-flex>
      <v-flex xs6>
        <img :src="barImg">
        <span>6개월</span>
        <span @click="openRankModal(3)" class="multif_btn1">[전체순위보기]</span>
        <FundFlowChart v-if="chartLoadFlag4"
          chartId="FundFlowChart4" :etpBasic="etpBasic"
          :sitem="sitem[3]" :eitem="eitem[3]" :citem="citem[3]" 
          :rank="rank[3]" :num="num[3]"></FundFlowChart>
      </v-flex>
    </v-layout>
    <EtpRankPopup v-if="RankModalFlag" @closeRankModal="closeRankModal"
      :gubun="modalGubun" :itemList="modalList"></EtpRankPopup>
  </div>
</template>

<script>
import FundFlowChart from "@/components/common/chart/FundFlowChart";
import EtpRankPopup from "@/components/common/popup/EtpRankPopup";
import Config from "@/js/config.js";
import util from "@/js/util.js";

export default {
  props: ["etpBasic" ],

  data() {
    return {
      barImg: "/assets/img/perform_bar05.png",
      bef1Week: 0,
      bef1Month: 0,
      bef3Month: 0,
      bef6Month: 0,
      cRes: [],
      sitem: [],
      eitem: [],
      citem: [],
      rank: [],
      num: [],
      chartLoadFlag1: false,
      chartLoadFlag2: false,
      chartLoadFlag3: false,
      chartLoadFlag4: false,
      RankModalFlag: false,
      modalGubun: 0,
      modalList: [],
    };
  },
  watch: {
    'etpBasic.F16013': function() {
      // console.log("EtpFundFlow watch.........etpBasic.F16013: ");
      // console.log(this.etpBasic);
      this.chartLoadFlag1 = false,
      this.chartLoadFlag2 = false,
      this.chartLoadFlag3 = false,
      this.chartLoadFlag4 = false,
      this.init();
    },
  },
  components: {
    FundFlowChart,
    EtpRankPopup,
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
      // console.log("EtpFundFlow.................");
      this.bef1Week = this.$store.state.befDates.bef1Week;
      this.getEtpFundFlowRank(this.bef1Week, 0);

      this.bef1Month = this.$store.state.befDates.bef1Month;
      this.getEtpFundFlowRank(this.bef1Month, 1);

      this.bef3Month = this.$store.state.befDates.bef3Month;
      this.getEtpFundFlowRank(this.bef3Month, 2);

      this.bef6Month = this.$store.state.befDates.bef6Month;
      this.getEtpFundFlowRank(this.bef6Month, 3);
    },
    getEtpFundFlowRank: function(val, gubun) {
      var vm = this;
      // console.log("getEtpFundFlowRank............." + val);
      axios.get( Config.base_url + "/user/etp/getEtpFundFlowRank", {
        params: {
          befDate : val,
        }
      }).then(function(response) {
        if (response.data.success == false) {
          alert("해당 데이터가 없습니다");
        }else {
          vm.cRes[gubun] = response.data.results;
          var mRes = vm.cRes[gubun];
          var resLen = mRes.length;
          var tmp = 0;
          // console.log("getEtpFundFlowRank1.............. : " + resLen);

          vm.eitem[gubun] = mRes[0];
          vm.sitem[gubun] = mRes[resLen-1];
          tmp = mRes.findIndex(x => x.F16013 === vm.etpBasic.F16013);
          vm.citem[gubun] = mRes[tmp];
          vm.rank[gubun] = tmp + 1;
          vm.num[gubun] = resLen;
          // console.log(vm.sitem[gubun]);
          // console.log(vm.eitem[gubun]);
          // console.log(vm.citem[gubun]);
          // console.log(vm.rank[gubun]);
          // console.log(vm.num[gubun]);
          if(gubun == 0) vm.chartLoadFlag1 = true;
          else if(gubun == 1) vm.chartLoadFlag2 = true;
          else if(gubun == 2) vm.chartLoadFlag3 = true;
          else if(gubun == 3) vm.chartLoadFlag4 = true;
          // vm.nextProcess();
          // console.log("getEtpMultiFactor2..............");
          // console.log(vm.mRes);
        }
      });
    },
    openRankModal: function(val) {  
      this.RankModalFlag = true;
      this.modalGubun = val;
      this.modalList = this.cRes[val];

      // console.log("openRankModal.....");
      // console.log(this.modalList);
    },         
    closeRankModal: function() { 
      this.RankModalFlag = false; 
    },
  }
};
</script>
