<template>
  <v-layout row wrap>
    <v-flex xs12 flat>
      <div class="indexinfo_box01">
        <h4 class="mb-0">Performance</h4>
        <div class="graph_02_w">
          <IndexPerformColumnChart :itemLists="indexLists"></IndexPerformColumnChart>
        </div>
        <v-card flat>
          <div class="table-box-wrap">
            <div class="table-box" style="max-height:200px;">
            <table class="tbl_type ver8">
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
                  <td class="txt_left"><img :src="barImgPath[index]"><span :style="item.nStyle"> {{item.F16002}}</span></td>
                  <td class="txt_right" :style="item.dStyle">{{item.F15004}}%</td>
                  <td class="txt_right" :style="item.wStyle">{{item.weekRate}}%</td>
                  <td class="txt_right" :style="item.mStyle">{{item.monthRate}}%</td>
                  <td class="txt_right" :style="item.ytdStyle">{{item.ytdRate}}%</td>
                  <td class="txt_right" :style="item.yStyle">{{item.yearRate}}%</td>
                  <td class="txt_right" :style="item.y3Style">{{item.year3Rate}}%</td>
                  <td class="txt_right" :style="item.y5Style">{{item.year5Rate}}%</td>
                  <td class="txt_right" :style="item.y10Style">{{item.year10Rate}}%</td>
                  <td class="txt_center">
                    <div class='tooltip'>
                      <button class='btn_icon v-icon material-icons' @click="deleteItem(item, index)">delete
                      </button>
                      <span class='tooltiptext' style='width:80px;'>지수정보</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </v-card>
        <v-layout row>
            <v-btn outline small color="primary" dark v-on:click="openMastModal">
              <v-icon small color="primary">add</v-icon>자산추가
            </v-btn>
        </v-layout>
      </div>
    </v-flex>
    <MastPopup v-if="MastModalFlag" @selectedItem="getSelectedItem" @closeMastModal="closeMastModal" ></MastPopup>
  </v-layout>
</template>


<script>
import IndexPerformColumnChart from "@/components/common/chart/IndexPerformColumnChart";
import MastPopup from "@/components/common/popup/MastPopup";
import Config from '@/js/config.js'
import util from "@/js/util.js";

export default {
  props: ["indexBasic", "etpList"],
  data() {
    return {
      MastModalFlag: false,
      results: [],
      modalFlag: false,
      indexLists: [],
      sortFlag: 1,
      befDates: {},
      barImg: ['perform_bar01.png', 
        'perform_bar02.png', 
        'perform_bar03.png', 
        'perform_bar04.png', 
        'perform_bar05.png'],
      barImgPath: [],
    };
  },
  watch: {
    /*
    'etpList': function() {
      console.log("IndexInfoTab2 watch.........etpList ");
      console.log("this.etpList.length : " + this.etpList.length);
      for(let i=0; i < this.etpList.length; i++) {
        // let tmp1 = JSON.parse(JSON.stringify(this.etpList[i]));
        // this.indexLists.push(tmp1);
        this.getEtpAnal(this.etpList[i]);
      }
    },
    */
  },
  components: {
      IndexPerformColumnChart,
      MastPopup,
  },
  computed: {},
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {        
    // console.log("IndexInfoTab2 mount...............");
    for(let i=0; i < 5; i++) {
      this.barImgPath[i] = "/assets/img/" + this.barImg[i];
      // console.log("barImg : " + this.barImgPath[i]);
    }
    this.befDates = this.$store.state.befDates;
    this.getIndexAnal(this.indexBasic);
    console.log("this.etpList.length : " + this.etpList.length);
    for(let i=0; i < this.etpList.length; i++) {
      // let tmp1 = JSON.parse(JSON.stringify(this.etpList[i]));
      // this.indexLists.push(tmp1);
      this.getEtpAnal(this.etpList[i]);
    }
  },
  methods: {
    openMastModal: function() {  
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
    deleteItem: function(item, index) {
      this.indexLists.splice(index, 1);
    },
    getEtpAnal: function(item) {
      var vm = this;
      // vm.indexLists = [];          
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
          tmp.gubun = 1; // ETF

          vm.indexLists.push(tmp);
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
}
</script>
