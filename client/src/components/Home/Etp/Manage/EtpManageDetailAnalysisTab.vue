<template>
  <v-container fluid grid-list-md pa-0 mb-4>
  <v-layout row wrap>
    <v-flex xs12 flat>
      <div class="indexinfo_box01">
        <h4 class="mb-0">Performance</h4>
        <div class="graph_02_w">
          <EtpPerformColumnChart :itemLists="indexLists"></EtpPerformColumnChart>
        </div>
        <v-card flat>
            <table class="tbl_type ver5">
              <caption> 헤더 고정 테이블</caption>
              <colgroup>
                <col width="19%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
              </colgroup>
              <thead>
                <tr>
                  <th style="width:19%" class="txt_center"></th>
                  <th @dblclick="sortTable(1)" style="width:9%" class="txt_center">Daily</th>
                  <th @dblclick="sortTable(2)" style="width:9%" class="txt_center">1Week</th>
                  <th @dblclick="sortTable(3)" style="width:9%" class="txt_center">1Month</th>
                  <th @dblclick="sortTable(4)" style="width:9%" class="txt_center">YTD</th>
                  <th @dblclick="sortTable(5)" style="width:9%" class="txt_center">1Year</th>
                  <th @dblclick="sortTable(6)" style="width:9%" class="txt_center">3Year</th>
                  <th @dblclick="sortTable(7)" style="width:9%" class="txt_center">5Year</th>
                  <th @dblclick="sortTable(8)" style="width:9%" class="txt_center">10Year</th>
                  <th style="width:7%" class="txt_center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in indexLists" :key="index">
                  <td class="txt_left"><img :src="barImgPath[index]">
                    <span > {{item.F16002}}<span v-if="index == 0"><br>&nbsp;&nbsp;(NAV)</span></span></td>
                  <td class="txt_right" :style="item.dStyle">{{item.F15004}}%</td>
                  <td class="txt_right" :style="item.wStyle">{{item.weekRate}}%</td>
                  <td class="txt_right" :style="item.mStyle">{{item.monthRate}}%</td>
                  <td class="txt_right" :style="item.ytdStyle">{{item.ytdRate}}%</td>
                  <td class="txt_right" :style="item.yStyle">{{item.yearRate}}%</td>
                  <td class="txt_right" :style="item.y3Style">{{item.year3Rate}}%</td>
                  <td class="txt_right" :style="item.y5Style">{{item.year5Rate}}%</td>
                  <td class="txt_right" :style="item.y10Style">{{item.year10Rate}}%</td>
                  <td class="txt_center">
                    <div v-if="index !== 0" class='tooltip'>
                      <button class='btn_icon v-icon material-icons' @click="deleteItem(item, index)">delete
                      </button>
                      <span class='tooltiptext' style='width:80px;'>지수정보</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
        </v-card>
        <v-layout row>
            <v-btn outline small color="primary" dark v-on:click="openMastModal">
              <v-icon small color="primary">add</v-icon>자산추가
            </v-btn>
            <MastPopup v-if="MastModalFlag" @selectedItem="getSelectedItem" @closeMastModal="closeMastModal" ></MastPopup>
        </v-layout>
      </div> 
    </v-flex>
    <v-flex xs12 flat>
      <div class="indexinfo_box01">
          <h4 class="mb-0">포트폴리오</h4>
          <v-layout>
            <v-flex xs6>
              <v-subheader>
                TOP10 비중정보
                <v-btn outline small color="primary" dark @click="openWeightModal">VIEW ALL</v-btn>
                <EtpPdfWeightModal v-if="WeightModalFlag" :etpBasic="etpBasic" :etpWeight="weightResults" 
                  @closeWeightModal="closeWeightModal"></EtpPdfWeightModal>
              </v-subheader>
              <TableEtpWeightChart v-if="WeightFlag" :etpWeight="weightResults"></TableEtpWeightChart>
            </v-flex>
            <v-flex xs6>
              <PieEtpWeightChart v-if="WeightFlag" :etpWeight="weightResults"></PieEtpWeightChart>
            </v-flex>
          </v-layout>
      </div>
      <div class="indexinfo_box01 v1">
        <h4 class="mb-0">섹터비중</h4>
        <BarEtpWeightChart :etpBasic="etpBasic"></BarEtpWeightChart>
      </div>
    </v-flex>
    <v-flex xs12 flat>
      <div class="indexinfo_box01">
        <EtpFundFlow :etpBasic="etpBasic"></EtpFundFlow>
      </div>
    </v-flex>
    <v-flex xs12 flat>
      <div class="indexinfo_box01">
        <EtpMultiFactor :etpBasic="etpBasic"></EtpMultiFactor>
      </div>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
import EtpPdfWeightModal from "@/components/common/modal/EtpPdfWeightModal";
import TableEtpWeightChart from "@/components/common/chart/TableEtpWeightChart";
import PieEtpWeightChart from "@/components/common/chart/PieEtpWeightChart";
import BarEtpWeightChart from "@/components/common/chart/BarEtpWeightChart";
import EtpPerformColumnChart from "@/components/common/chart/EtpPerformColumnChart";
import EtpFundFlow from "@/components/Home/Etp/Manage/EtpFundFlow";
import EtpMultiFactor from "@/components/Home/Etp/Manage/EtpMultiFactor";
import MastPopup from "@/components/common/popup/MastPopup";
import Config from "@/js/config.js";
import util from "@/js/util.js";

export default {
  props: ["etpBasic" ],

  data() {
    return {
      indexBasic: {},
      weightResults: [],
      indexLists: [],
      befDates: {},
      modalFlag: false,
      WeightFlag: false,
      WeightModalFlag: false,
      defaultTranFlag: false, // ETP 기본 종목 조회 후, INDEX 조회처리
      MastModalFlag: false,
      barImg: ['perform_bar01.png', 
        'perform_bar02.png', 
        'perform_bar03.png', 
        'perform_bar04.png', 
        'perform_bar05.png'],
      barImgPath: [],
      etpBasic1: {},
      etpBasic1flag: false,
      etpBasic2: {},
      etpBasic2flag: false,
    };
  },
  watch: {
    'etpBasic.F16013': function() {
      // console.log("watch.........etpBasic.F16013: ");
      // console.log(this.etpBasic);
      this.defaultTranFlag = false;
      this.indexLists = [];
      this.init();
    },
    'defaultTranFlag': function() {
      if(this.defaultTranFlag == true) {
        this.getIndexAnal(this.indexBasic);
      }
    },
    'indexLists': function() {
      // console.log("indexLists...... watch");
      // console.log(this.indexLists);
    }
  },
  components: {
    EtpPdfWeightModal,
    TableEtpWeightChart,
    PieEtpWeightChart,
    BarEtpWeightChart,
    EtpPerformColumnChart,
    EtpFundFlow,
    EtpMultiFactor,
    MastPopup,
  },
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
    this.befDates = this.$store.state.befDates;
    for(let i=0; i < 5; i++) {
      this.barImgPath[i] = "/assets/img/" + this.barImg[i];
      // console.log("barImg : " + this.barImgPath[i]);
    }
    this.init();
  },
  methods: {
    init: function() {
      // console.log("EtpManageDetailAnaysisTab.................");
      // console.log(this.etpBasic);
      this.indexBasic.F16013 = this.etpBasic.F16257;
      this.indexBasic.market_id = "M" + util.pad(this.etpBasic.F34239, 3);
      // console.log(this.indexBasic);
      this.getEtpNavAnal(this.etpBasic);
      this.getEtpWeightList();
    },
    openWeightModal: function() {
      // console.log("openWeightModal One............");
      this.WeightModalFlag = true;
    },
    closeWeightModal: function() {
      // console.log("closeWeightModal One............");
      this.WeightModalFlag = false;
    },
    getEtpWeightList: function() {
      var vm = this;
      // console.log("getEtpWeightList");
      axios.get( Config.base_url + "/user/etp/getEtpWeightList", {
        params: vm.etpBasic
      }).then(function(response) {
        if (response.data.success == false) {
          alert("해당 종목이 없습니다");
        }else {
          vm.weightResults = response.data.results;
          vm.WeightFlag = true;
        }
      });
    },
    openMastModal: function() {  
      // console.log("openMastModal..........");
      this.MastModalFlag = true; 
    },         
    closeMastModal: function() { 
      this.MastModalFlag = false; 
    },
    // gubun : 1 ETF, 2 ETN, 3 INDEX
    getSelectedItem: function(items, gubun) {
      for(let i=0; i < items.length; i++) {
        // this.indexLists.push(items[i]);
        if(gubun == 3) {
          this.getIndexAnal(items[i]);
        }else {
          this.getEtpAnal(items[i]);
        }
      }
    },
    getMsciFactorItem1: function(items, gubun) {
      if(gubun == 1) {
        this.etpBasic1 = items[0];
        this.etpBasic1flag = true;
      }else {
        alert("ETF 종목만 선택할 수 있습니다.");
      }
    },
    deleteItem: function(item, index) {
      this.indexLists.splice(index, 1);
    },
    getEtpAnal: function(item) {
      var vm = this;
      // vm.indexLists = [];          
      if(item.F16013 == undefined) item.F16013 = item.F16013;
      // console.log("getEtpAnal");
      axios.get(Config.base_url + "/user/marketinfo/getEtpAnal", {
        params: {
          F16013: item.F16013,
          bef1Week: vm.befDates.bef1Week,
          bef1Month: vm.befDates.bef1Month,
          befYtd: vm.befDates.befYtd,
          bef1Year: vm.befDates.bef1Year,
          bef3Year: vm.befDates.bef3Year,
          bef5Year: vm.befDates.bef5Year,
          bef10Year: vm.befDates.bef10Year,
        }
      }).then(function(response) {
        // console.log(response);
        if(response.data.success == false) {
          alert("해당 종목이 없습니다");
        } else {
          // console.log("tresult........................");
          // console.log(response.data.results[0]);

          let tmp = JSON.parse(JSON.stringify(response.data.results[0]));
          // tmp.nStyle = {color:'#969696'};
          // tmp.F15472 = util.getPlus(tmp.F15472, 2);
          tmp.F15004 = util.getPlus(tmp.F15004, 2);
          tmp.dStyle = util.getUpAndDownStyle(tmp.F15004);
          tmp.weekRate = util.getDiffRate1(tmp.F15001, tmp.bef1Week);
          tmp.wStyle = util.getUpAndDownStyle(tmp.weekRate);
          tmp.monthRate = util.getDiffRate1(tmp.F15001, tmp.bef1Month);
          tmp.mStyle = util.getUpAndDownStyle(tmp.monthRate);
          tmp.ytdRate = util.getDiffRate1(tmp.F15001, tmp.befYtd);
          tmp.ytdStyle = util.getUpAndDownStyle(tmp.ytdRate);
          tmp.yearRate = util.getDiffRate1(tmp.F15001, tmp.bef1Year);
          tmp.yStyle = util.getUpAndDownStyle(tmp.yearRate);
          tmp.year3Rate = util.getDiffRate1(tmp.F15001, tmp.bef3Year);
          tmp.y3Style = util.getUpAndDownStyle(tmp.year3Rate);
          tmp.year5Rate = util.getDiffRate1(tmp.F15001, tmp.bef5Year);
          tmp.y5Style = util.getUpAndDownStyle(tmp.year5Rate);
          tmp.year10Rate = util.getDiffRate1(tmp.F15001, tmp.bef10Year);
          tmp.y10Style = util.getUpAndDownStyle(tmp.year10Rate);
          tmp.F15001 = util.formatNumber(tmp.F15001);
          tmp.gubun = 1; // ETF

          vm.indexLists.push(tmp);
          vm.defaultTranFlag = true; // ETP 첫 조회후, INDEX 조회 처리
        }

        // console.log("getEtpAnal........");
        // console.log(vm.indexLists);
      });
    },
    getEtpNavAnal: function(item) {
      var vm = this;
      // vm.indexLists = [];          
      // console.log("getEtpAnal");
      axios.get(Config.base_url + "/user/marketinfo/getEtpAnal", {
        params: {
          F16013: item.F16013,
          bef1Week: vm.befDates.bef1Week,
          bef1Month: vm.befDates.bef1Month,
          befYtd: vm.befDates.befYtd,
          bef1Year: vm.befDates.bef1Year,
          bef3Year: vm.befDates.bef3Year,
          bef5Year: vm.befDates.bef5Year,
          bef10Year: vm.befDates.bef10Year,
        }
      }).then(function(response) {
        // console.log(response);
        if(response.data.success == false) {
          alert("해당 종목이 없습니다");
        } else {
          // console.log("tresult........................");
          // console.log(response.data.results[0]);

          let tmp = JSON.parse(JSON.stringify(response.data.results[0]));
          // tmp.nStyle = {color:'#969696'};
          // tmp.F15472 = util.getPlus(tmp.F15472, 2);
          tmp.F15004 = util.getPlus(tmp.F30818, 2);
          tmp.dStyle = util.getUpAndDownStyle(tmp.F30818);
          tmp.weekRate = util.getDiffRate1(tmp.F15301, tmp.bef1Week);
          tmp.wStyle = util.getUpAndDownStyle(tmp.weekRate);
          tmp.monthRate = util.getDiffRate1(tmp.F15301, tmp.bef1Month);
          tmp.mStyle = util.getUpAndDownStyle(tmp.monthRate);
          tmp.ytdRate = util.getDiffRate1(tmp.F15301, tmp.befYtd);
          tmp.ytdStyle = util.getUpAndDownStyle(tmp.ytdRate);
          tmp.yearRate = util.getDiffRate1(tmp.F15301, tmp.bef1Year);
          tmp.yStyle = util.getUpAndDownStyle(tmp.yearRate);
          tmp.year3Rate = util.getDiffRate1(tmp.F15301, tmp.bef3Year);
          tmp.y3Style = util.getUpAndDownStyle(tmp.year3Rate);
          tmp.year5Rate = util.getDiffRate1(tmp.F15301, tmp.bef5Year);
          tmp.y5Style = util.getUpAndDownStyle(tmp.year5Rate);
          tmp.year10Rate = util.getDiffRate1(tmp.F15301, tmp.bef10Year);
          tmp.y10Style = util.getUpAndDownStyle(tmp.year10Rate);
          tmp.F15001 = util.formatNumber(tmp.F15301);
          tmp.gubun = 1; // ETF
          vm.indexLists.push(tmp);
          vm.getEtpAnal(item);
        }

        // console.log("getEtpAnal........");
        // console.log(vm.indexLists);
      });
    },
    getIndexAnal: function(item) {
      var vm = this;
      // vm.indexLists = [];          
      axios.get(Config.base_url + "/user/marketinfo/getIndexAnal", {
        params: {
          F16013: item.F16013,
          market_id: item.market_id,
          bef1Week: vm.befDates.bef1Week,
          bef1Month: vm.befDates.bef1Month,
          befYtd: vm.befDates.befYtd,
          bef1Year: vm.befDates.bef1Year,
          bef3Year: vm.befDates.bef3Year,
          bef5Year: vm.befDates.bef5Year,
          bef10Year: vm.befDates.bef10Year,
        }
      }).then(function(response) {
        // console.log(response);
        if (response.data.success == false) {
          alert("해당 종목이 없습니다");
        } else {
          // console.log("tresult........................");
          // console.log(response.data.results[0]);

          let tmp = JSON.parse(JSON.stringify(response.data.results[0]));
          tmp.nStyle = {color:'#969696'};
          tmp.F15472 = util.getPlus(tmp.F15472, 2);
          tmp.F15004 = util.getPlus(tmp.F15004, 2);
          tmp.dStyle = util.getUpAndDownStyle(tmp.F15004);
          tmp.weekRate = util.getDiffRate1(tmp.F15001, tmp.bef1Week);
          tmp.wStyle = util.getUpAndDownStyle(tmp.weekRate);
          tmp.monthRate = util.getDiffRate1(tmp.F15001, tmp.bef1Month);
          tmp.mStyle = util.getUpAndDownStyle(tmp.monthRate);
          tmp.ytdRate = util.getDiffRate1(tmp.F15001, tmp.befYtd);
          tmp.ytdStyle = util.getUpAndDownStyle(tmp.ytdRate);
          tmp.yearRate = util.getDiffRate1(tmp.F15001, tmp.bef1Year);
          tmp.yStyle = util.getUpAndDownStyle(tmp.yearRate);
          tmp.year3Rate = util.getDiffRate1(tmp.F15001, tmp.bef3Year);
          tmp.y3Style = util.getUpAndDownStyle(tmp.year3Rate);
          tmp.year5Rate = util.getDiffRate1(tmp.F15001, tmp.bef5Year);
          tmp.y5Style = util.getUpAndDownStyle(tmp.year5Rate);
          tmp.year10Rate = util.getDiffRate1(tmp.F15001, tmp.bef10Year);
          tmp.y10Style = util.getUpAndDownStyle(tmp.year10Rate);
          tmp.F15001 = util.formatNumber(tmp.F15001);
          tmp.gubun = 3; // INDEX

          vm.indexLists.push(tmp);
        }
      });
    },
    sortTable: function(num) {
      var vm = this;
      vm.sortFlag = vm.sortFlag * (-1);
        
      if(num == 0) {
        vm.indexLists.sort(function(a, b) {
          if(a.F16002 > b.F16002) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }else if(num == 1) {
        vm.indexLists.sort(function(a, b) {
          if(Number(a.F15004) > Number(b.F15004)) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }else if(num == 2) {
        vm.indexLists.sort(function(a, b) {
          if(Number(a.weekRate) > Number(b.weekRate)) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }else if(num == 3) {
        vm.indexLists.sort(function(a, b) {
          if(Number(a.monthRate) > Number(b.monthRate)) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }else if(num == 4) {
        vm.indexLists.sort(function(a, b) {
          if(Number(a.ytdRate) > Number(b.ytdRate)) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }else if(num == 5) {
        vm.indexLists.sort(function(a, b) {
          if(Number(a.yearRate) > Number(b.yearRate)) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }else if(num == 6) {
        vm.indexLists.sort(function(a, b) {
          if(Number(a.year3Rate) > Number(b.year3Rate)) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }else if(num == 7) {
        vm.indexLists.sort(function(a, b) {
          if(Number(a.year5Rate) > Number(b.year5Rate)) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }else if(num == 8) {
        vm.indexLists.sort(function(a, b) {
          if(Number(a.year10Rate) > Number(b.year10Rate)) return vm.sortFlag;
          else return (vm.sortFlag * (-1));
        });
      }
    },
  }
};
</script>
