<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout>
          <v-flex xs3 v-for="(rinfo, index) in rep_info" :key="rinfo.seq">
            <AreaIndexChart v-if="chartLoadFlag" :chartItem="rinfo" :dataSet="getDataSet(index)"></AreaIndexChart>
          </v-flex>
        </v-layout>
      </v-flex>

      <!---테이블1 -->
      <v-flex grow xs12 mt-2>
        <v-card flat>
          <v-card-title primary-title>
            <v-layout>
              <v-flex xs1>
                <h3 class="headline subtit" pb-0>KRX</h3>
                <span class="text_result">{{indexLists.length}}</span>
                <span class="text_result_t">results</span>
              </v-flex>
              <v-flex xs2>
                <v-combobox
                  dense
                  v-model="selIndexType"
                  :items="indexTypes"
                  label="INDEX TYPE"
                  @change="getIndexList(selIndexType)"
                ></v-combobox>
              </v-flex>
            </v-layout>
          </v-card-title>

          <div class="table-box-wrap">
            <div class="table-box" style="max-height:1000px;">
              <table class="tbl_type ver8">
                <caption>헤더 고정 테이블</caption>
                <colgroup>
                  <col width="21%" />
                  <col width="9%" />
                  <col width="7%" />
                  <col width="7%" />
                  <col width="7%" />
                  <col width="7%" />
                  <col width="7%" />
                  <col width="7%" />
                  <col width="7%" />
                  <col width="7%" />
                  <col width="7%" />
                  <col width="7%" />
                </colgroup>
                <thead>
                  <tr>
                    <th @dblclick="sortTable(0)" style="width:21%" class="txt_center">지수명</th>
                    <th style="width:9%" class="txt_center">현재가</th>
                    <th style="width:7%" class="txt_center">대비</th>
                    <th @dblclick="sortTable(1)" style="width:7%" class="txt_center">Daily</th>
                    <th @dblclick="sortTable(2)" style="width:7%" class="txt_center">1Week</th>
                    <th @dblclick="sortTable(3)" style="width:7%" class="txt_center">1Month</th>
                    <th @dblclick="sortTable(4)" style="width:7%" class="txt_center">YTD</th>
                    <th @dblclick="sortTable(5)" style="width:7%" class="txt_center">1Year</th>
                    <th @dblclick="sortTable(6)" style="width:7%" class="txt_center">3Year</th>
                    <th @dblclick="sortTable(7)" style="width:7%" class="txt_center">5Year</th>
                    <th @dblclick="sortTable(8)" style="width:7%" class="txt_center">10Year</th>
                    <th style="width:7%" class="txt_center">지수정보</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in indexLists" :key="index">
                    <td class="txt_left">
                      <span style="font-weight:bold;">{{item.F16002}}</span>
                    </td>
                    <td class="txt_right">{{item.F15001}}</td>
                    <td class="txt_right" :style="item.dStyle">{{item.F15472}}</td>
                    <td class="txt_right" :style="item.dStyle">{{item.F15004}}%</td>
                    <td class="txt_right" :style="item.wStyle">{{item.weekRate}}%</td>
                    <td class="txt_right" :style="item.mStyle">{{item.monthRate}}%</td>
                    <td class="txt_right" :style="item.ytdStyle">{{item.ytdRate}}%</td>
                    <td class="txt_right" :style="item.yStyle">{{item.yearRate}}%</td>
                    <td class="txt_right" :style="item.y3Style">{{item.year3Rate}}%</td>
                    <td class="txt_right" :style="item.y5Style">{{item.year5Rate}}%</td>
                    <td class="txt_right" :style="item.y10Style">{{item.year10Rate}}%</td>
                    <td class="txt_center">
                      <div class="tooltip">
                        <button
                          class="btn_icon v-icon material-icons"
                          @click="openIndexModal(item)"
                        >equalizer</button>
                        <span class="tooltiptext" style="width:80px;">지수정보</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </v-card>
      </v-flex>
      <!---테이블1 end -->
    </v-layout>
    <IndexInfoModal
      v-if="IndexModalFlag"
      :indexInfo="indexBasic"
      @closeIndexModal="closeIndexModal"
    ></IndexInfoModal>
  </v-container>
</template>

<script>
  import _ from "lodash";
  import Config from "@/js/config.js";
  import util from "@/js/util.js";
  import AreaIndexChart from '@/components/common/chart/AreaIndexChart.vue';
  import IndexInfoModal from '@/components/common/modal/IndexInfoModal.vue';
  export default {
    props: [],
    data() {
      return {
        indexLists: [],
        resultLists: [],
        indexBasic: {},
        chartLoadFlag: false,
        IndexModalFlag: false,
        paramData: {},
        intra_data: [],
        indexTypes: [{
            text: "KOSPI",
            value: "KSP"
          }, {
            text: "KOSDAQ",
            value: "KSQ"
          }, {
            text: "SECTOR",
            value: "SECTOR"
          }, {
            text: "ETC",
            value: "ETC"
          },
          // {text:"전체", value:"TOTAL"},
        ],
        selIndexType: {
          text: "KOSPI",
          value: "KSP"
        },
        rep_info: [{
          seq: 1,
          F16013: "1",
          market_id: "M002",
          name: "KOSPI",
          F15001: "",
          F15472: "",
          F15004: "",
          sColor: "#def5ae",
          eColor: "#ffffff",
          width: 340,
          height: 150,
          marginW: 1,
          marginH: 40
        }, {
          seq: 2,
          F16013: "51",
          market_id: "M002",
          name: "KOSPI 200",
          F15001: "",
          F15472: "",
          F15004: "",
          sColor: "#def5ae",
          eColor: "#ffffff",
          width: 340,
          height: 150,
          marginW: 1,
          marginH: 40
        }, {
          seq: 3,
          F16013: "1",
          market_id: "M004",
          name: "KOSDAQ",
          F15001: "",
          F15472: "",
          F15004: "",
          sColor: "#def5ae",
          eColor: "#ffffff",
          width: 340,
          height: 150,
          marginW: 1,
          marginH: 40
        }, {
          seq: 4,
          F16013: "203",
          market_id: "M004",
          name: "KOSDAQ 150",
          F15001: "",
          F15472: "",
          F15004: "",
          sColor: "#def5ae",
          eColor: "#ffffff",
          width: 350,
          height: 150,
          marginW: 1,
          marginH: 40
        }],
        sortFlag: 1,
      };
    },
    components: {
      AreaIndexChart,
      IndexInfoModal,
    },
    computed: {},
    mounted: function() {
      var vm = this;
      this.befDates = this.$store.state.befDates;
      step1().then(function(e){
        if( e && e.result ) {
          return  vm.getIndexList(vm.selIndexType);
        }
      }).then(function(e){
        vm.$root.progresst.close();
      }).catch(function(e){
        vm.$root.progresst.close();
      });
      function  step1() {
        vm.$root.progresst.open();
        return new Promise( async function(resolve, reject) {
          try{
            for(var i = 0; i < vm.rep_info.length; i++) {
              await vm.getIndexBasic(vm.rep_info[i]);
              await vm.getIndexIntra(vm.rep_info[i]);
            }
            resolve({result:true});
          }catch(e){
            console.log(e);
            resolve({result:false});
          }
        }).catch(function(e1) {
          console.log(e1);
        });        
      }
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
      openIndexModal: function(item) {
        console.log("openIndexModal : " + item.market_id + " " + item.F16013);
        this.indexBasic = item;
        this.IndexModalFlag = true;
      },
      closeIndexModal: function() {
        console.log("closeIndexModal One............");
        this.IndexModalFlag = false;
      },
      getIndexBasic: async function(rinfo) {
        // console.log("getIndexBasic : " + rinfo.seq);
        var vm = this;
        return await new Promise( async function(resolve, reject) {
          try{               
            axios.get(Config.base_url + "/user/marketinfo/getIndexBasic", {
              params: rinfo
            }).then(function(response) {
              // console.log(response);
              if(response.data.success == false) {
               alert("해당 지수의 데이터가 없습니다");
              } else {
                rinfo.F15001 = response.data.results[0].F15001;
                rinfo.F15472 = response.data.results[0].F15472;
                rinfo.F15004 = response.data.results[0].F15004;
              }
              resolve({result:true});
            });
          }catch(e){
            console.log(e);
            resolve({result:false});
          }
        }).catch(function(e1) {
          console.log(e1);
        });            
      },
      getIndexIntra: async function(rinfo) {
        // console.log("getIndexIntra : " + rinfo.seq);
        var vm = this;
        return await new Promise( async function(resolve, reject) {
          try{         
            axios.get(Config.base_url + "/user/marketinfo/getIndexIntra", {
              params: rinfo
            }).then(function(response) {
              // console.log(response);
              if(response.data.success == false) {
               alert("해당 지수의 데이터가 없습니다");
              } else {
                // vm.intra_data.push = response.data.results;
                vm.intra_data.push(response.data.results);
                // console.log(vm.intra_data[rinfo.seq]);
                // 데이터 없는 상태에서 getDataSet 하면 에러남.
                // Error in render: "TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
                if(vm.intra_data.length == vm.rep_info.length) vm.chartLoadFlag = true;
              }
              resolve({result:true});
            });
          }catch(e){
            console.log(e);
            resolve({result:false});
          }
        }).catch(function(e1) {
          console.log(e1);
        });
      },
      getDataSet: function(idx) {
        var vm = this;
        var intra_info = vm.intra_data[idx];
        var items = [];
        for(let item of intra_info) {
          // console.log("close_idx : " + item.close_idx);
          items.push([item.F20044, item.F20004, item.F20008]);
        }
        return items;
      },
      getIndexList: async function(indexType) {
        // console.log("getKrxIndexList");
        var vm = this;
        vm.indexLists = [];
        return await new Promise( async function(resolve, reject) {
          try{                
            axios.get(Config.base_url + "/user/marketinfo/getIndexListAnalByType", {
              params: {
                large_type: "KRX",
                middle_type: indexType.value,
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
                vm.resultLists = response.data.results;
                // console.log(vm.resultLists);
                for(let i = 0; i < vm.resultLists.length; i++) {
                  let tmp = {};
                  tmp = JSON.parse(JSON.stringify(vm.resultLists[i]));
                  tmp.F15472 = util.getPlus(tmp.F15472, 2);
                  tmp.F15004 = vm.resultLists[i].F15004;
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
                  vm.indexLists.push(tmp);
                }
                vm.indexLists.sort(function(a, b) {
                  if(Number(a.ytdRate) > Number(b.ytdRate)) return -1;
                  else return 1;
                });
              }
              resolve({result:true});
            });
          }catch(e){
            console.log(e);
            resolve({result:false});
          }
        }).catch(function(e1) {
          console.log(e1);
        });            
      },
      getUpAndDownStyle: function(value) {
        var tmp = Number(value);
        var rtn = {};
        if(tmp > 0) rtn = this.upStyle;
        else if(tmp < 0) rtn = this.downStyle;
        else rtn = this.sqStyle;
        return rtn;
      },
      sortTable: function(num) {
        var vm = this;
        vm.sortFlag = vm.sortFlag * (-1);
        if(num == 0) {
          vm.indexLists.sort(function(a, b) {
            if(a.F16002 > b.F16002) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        } else if(num == 1) {
          vm.indexLists.sort(function(a, b) {
            if(Number(a.F15004) > Number(b.F15004)) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        } else if(num == 2) {
          vm.indexLists.sort(function(a, b) {
            if(Number(a.weekRate) > Number(b.weekRate)) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        } else if(num == 3) {
          vm.indexLists.sort(function(a, b) {
            if(Number(a.monthRate) > Number(b.monthRate)) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        } else if(num == 4) {
          vm.indexLists.sort(function(a, b) {
            if(Number(a.ytdRate) > Number(b.ytdRate)) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        } else if(num == 5) {
          vm.indexLists.sort(function(a, b) {
            if(Number(a.yearRate) > Number(b.yearRate)) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        } else if(num == 6) {
          vm.indexLists.sort(function(a, b) {
            if(Number(a.year3Rate) > Number(b.year3Rate)) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        } else if(num == 7) {
          vm.indexLists.sort(function(a, b) {
            if(Number(a.year5Rate) > Number(b.year5Rate)) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        } else if(num == 8) {
          vm.indexLists.sort(function(a, b) {
            if(Number(a.year10Rate) > Number(b.year10Rate)) return vm.sortFlag;
            else return (vm.sortFlag * (-1));
          });
        }
      },
    }
  };
</script>
<style scoped>
  .textcount {
    margin-left: 50px;
    color: #FF0000;
  }
</style>