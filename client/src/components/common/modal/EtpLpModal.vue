<template>
<v-layout>
  <v-dialog v-model="dialog" persistent max-width="1100px">
    <v-card flat ma-3>
      <div class="title01_w">
        <v-card-title primary-title>
          <div class="title_wrap01">
            <h3 class="headline mb-0">
              {{etpInfo.F16002}} <span>({{etpInfo.F16013}})</span>
            </h3>
            <div class="right_btn">
              <v-layout align-right>
                <v-flex xs12 sm4 text-xs-center>                                         
                  <div class="btn_r">
                    <v-btn icon  @click.stop="closeModal">
                        <v-icon>close</v-icon>
                    </v-btn>
                  </div>
                </v-flex>
              </v-layout>
              </div>
          </div>
        </v-card-title>
      </div>
      <div class="graph_01_w">
        <div class="sub_title_num">
          {{formatInt(etpInfo.F15001)}}
          <span :style="etpInfo.F15472_Style">{{formatInt(etpInfo.F15472)}}({{etpInfo.F15004}}%)</span>
          <!--
          <span>{{etpInfo.F15472}}({{etpInfo.F15004}})%</span>
          -->
          <p>Last Updated : {{etpInfo.F12506}} {{marketTime}}</p>
        </div>
        <div class="index_nums">
          <v-layout>
            <v-flex>
              <ul>
                <li>스프레드평균</li>
                <li class="number">{{etpInfo.avgF33294}}%</li>
              </ul>
            </v-flex>
            <v-flex>
              <ul>
                <li>iNav</li>
                <li class="number"> {{formatInt(etpInfo.F15602)}}</li>
                <li class="number2"> <span :style="etpInfo.F30818_Style">{{etpInfo.F30818}}%</span></li>
              </ul>
            </v-flex>
            <v-flex>
              <ul>
                <li>기초지수</li>
                <li class="number"> {{parseFloat(etpInfo.F15318).toFixed(2)}}</li>
                <li class="number2"> <span :style="etpInfo.F30823_Style">{{etpInfo.F30823}}%</span></li>
              </ul>
            </v-flex>
            <v-flex>
              <ul>
                <li>시가총액</li>
                <li class="number"> {{formatInt(etpInfo.F15028/1000000000)}}십억</li>
              </ul>
            </v-flex>
            <v-flex>
              <ul>
                <li>거래량</li>
                <li class="number">{{formatInt(etpInfo.F15015)}} 주</li>
                <li  class="number2 text_green">AVG(3M) {{formatInt(etpInfo.avgF15015)}}</li>
              </ul>
            </v-flex>
            <v-flex class="ver3">
              <ul>
                <li>거래대금</li>
                <li class="number">{{formatInt(etpInfo.F15023/1000)}} 천</li>
                <li class="number2 text_green">AVG(3M) {{formatInt(etpInfo.avgF15023/1000)}}</li>
              </ul>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <!--
      <LineIndexChart v-if="chartFlag" :indexBasic="indexBasic"></LineIndexChart>
      -->
      <LineEtpLpChart :etpBasic="etpInfo"></LineEtpLpChart>
      <EtpLpTable :etpInfo="etpInfo"></EtpLpTable>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
// import LineIndexChart   from  '@/components/common/chart/LineIndexChart.vue';

import Config from "@/js/config.js";
import util from "@/js/util.js";
import LineEtpLpChart   from  '@/components/common/chart/LineEtpLpChart.vue';
import EtpLpTable   from  '@/components/common/modal/EtpLpTable.vue';

export default {
  props: ['etpInfo'],
  data() {
    return {
        dialog: false, 
        tab: null,
        indexBasic: {},
        etpList: [],
        marketTime: '',
        chartFlag: false,
    };
  },
  components: {
    LineEtpLpChart, EtpLpTable, 
  }, 
  computed: {},
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
    this.dialog = true;
    // console.log("Open EtpLpModal...........");
    // console.log(this.etpInfo);
    this.etpInfo.F15472_Style = util.getUpAndDownStyle(this.etpInfo.F15472);
    this.etpInfo.F30818_Style = util.getUpAndDownStyle(this.etpInfo.F30818);
    this.etpInfo.F30823_Style = util.getUpAndDownStyle(this.etpInfo.F30823);
    this.marketTime = util.formatTime(this.etpInfo.F33267);
    this.getEtpIntraAvg('avgF33294', this.etpInfo.F16013, this.etpInfo.F12506, 'F33294');
    this.getEtpHistAvg('avgF15015', this.etpInfo.F16013, 'F15015', 3);
    this.getEtpHistAvg('avgF15023', this.etpInfo.F16013, 'F15023', 3);
  },
  methods: {
    closeModal: function() {
      var vm = this;
      vm.$emit("closeEtpLpModal");
      vm.dialog = false;
    },
    formatNumber:function(num) {
        return util.formatNumber(num);
    },
    formatInt:function(num) {
        return util.formatInt(num);
    },
    getEtpIntraAvg: function(rtnName, F16013, F12506, colName) {
      var vm = this;
      var options = {
        F16013: F16013,
        F12506: F12506,
        colName: colName, 
      };
      // console.log(options);
      axios.get(Config.base_url + "/user/marketinfo/getEtpIntraAvg", {
        params: options
      }).then(function(response) {
        if (response.data.success == false) {
          alert("해당 지수의 데이터가 없습니다");
        } else {
          var rtnVal;
          // console.log("getEtpAvg.........");
          vm.etpInfo[rtnName] = response.data.results[0][colName];
          // console.log(rtnName + " : " + vm.etpInfo[rtnName]);
          vm.$forceUpdate();
        }
      });
    },
    getEtpHistAvg: function(rtnName, F16013, colName, num) {
      var vm = this;
      var options = {
        F16013: F16013,
        colName: colName, 
        num: num,
      };
      // console.log(options);
      axios.get(Config.base_url + "/user/marketinfo/getEtpHistAvg", {
        params: options
      }).then(function(response) {
        if (response.data.success == false) {
          alert("해당 지수의 데이터가 없습니다");
        } else {
          var rtnVal;
          // console.log("getEtpHistAvg.........");
          vm.etpInfo[rtnName] = response.data.results[0][colName];
          // console.log(rtnName + " : " + vm.etpInfo[rtnName]);
          vm.$forceUpdate();
        }
      });
    },
  } 
};
</script>