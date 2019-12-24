<template>
<v-layout>
  <v-flex>
  <v-dialog v-model="dialog" persistent max-width="1100px">
    <v-card flat ma-3>
      <div class="title01_w">
        <v-card-title primary-title>
          <div class="title_wrap01">
            <h3 class="headline mb-0">
              {{indexBasic.F16002}}
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
          {{indexBasic.F15001}}
          <span :style="indexBasic.dStyle">{{indexBasic.F15472}}({{indexBasic.F15004}})%</span>
          <p>Last Updated : {{indexBasic.F12506}}</p>
        </div>
        <div class="index_nums">
          <v-layout>
            <v-flex class="ver1">
              <ul>
                <li>시가총액</li>
                <li class="number"> {{formatInt(indexBasic.F15028/1000000000)}}십억</li>
              </ul>
            </v-flex>
            <v-flex class="ver2">
              <ul>
                <li>거래량</li>
                <li class="number">{{formatInt(indexBasic.F15015)}}주</li>
              </ul>
            </v-flex>
            <v-flex class="ver3">
              <ul>
                <li>거래대금</li>
                <li class="number">{{formatInt(indexBasic.F15023)}}천</li>
              </ul>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <LineIndexChart v-if="chartFlag" :indexBasic="indexBasic"></LineIndexChart>
      <div class="tab2_w">
        <v-layout row wrap>
          <v-flex xs12>
            <v-tabs
              fixed-tabs
              light
              v-model="tab"
              align-with-title
            >
            <v-tabs-slider color="#1976d2"></v-tabs-slider>
              <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <IndexInfoTab2 v-if="tabFlag" :indexBasic="indexBasic" :etpList="etpList"></IndexInfoTab2>
              </v-tab-item>
              <v-tab-item>
                <IndexInfoTab1 v-if="tabFlag" :indexBasic="indexBasic" :etpList="etpList"></IndexInfoTab1>
              </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </div>
    </v-card>
  </v-dialog>
  </v-flex>
</v-layout>
</template>

<script>
import LineIndexChart   from  '@/components/common/chart/LineIndexChart.vue';
import IndexInfoTab1 from "./IndexInfoTab1.vue";
import IndexInfoTab2 from "./IndexInfoTab2.vue";

import Config from "@/js/config.js";
import util from "@/js/util.js";

export default {
  props: ['indexInfo'],
  data() {
    return {
        dialog: false, 
        tab: null,
        items: ["분석정보", "기본정보"],
        indexBasic: {},
        etpList: [],
        chartFlag: false,
        tabFlag: false,
    };
  },
  components: {
  /*
      IndexDetailInfoTab3: IndexDetailInfoTab3
  */
    LineIndexChart,
    IndexInfoTab1,
    IndexInfoTab2,
  }, 
  computed: {},
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
    this.dialog = true;
    console.log("Open IndexInfoModal...........");
    console.log(this.indexInfo);
    this.getIndexBasic(this.indexInfo);
    // this.getIndexInEtpInfo(this.indexInfo);
  },
  methods: {
    closeModal: function() {
      var vm = this;
      vm.$emit("closeIndexModal");
      vm.dialog = false;
    },
    formatNumber:function(num) {
        return util.formatNumber(num);
    },
    formatInt:function(num) {
        return util.formatInt(num);
    },
    getIndexBasic: function(rinfo) {
      var vm = this;

      axios.get(Config.base_url + "/user/marketinfo/getIndexBasic", {
        params: {
          F16013: rinfo.F16013,
          market_id: rinfo.market_id
        }
      }).then(function(response) {
        if (response.data.success == false) {
            alert("해당 지수의 데이터가 없습니다");
        } else {
          vm.indexBasic = response.data.results[0];
          vm.indexBasic.dStyle = util.getUpAndDownStyle(vm.indexBasic.F15472);
          vm.chartFlag = true;
          vm.getIndexInEtpInfo(vm.indexInfo);
        }
      });
    },
    getIndexInEtpInfo: function(rinfo) {
      console.log("getIndexInEtpInfo...............");
      var vm = this;
      vm.etpList = [];
      axios.get(Config.base_url + "/user/index/getIndexInEtpInfo", {
        params: {
          jisu_cd : rinfo.F16013,
          market_id : rinfo.market_id,
        }
      }).then(response => { 
        if (response.data.success == false) {
          // alert("지수 관련 ETP정보가 없습니다.");
        } else {
          vm.etpList = response.data.results;
          vm.tabFlag = true;
        console.log("vm.etpList......................");
        console.log(vm.etpList);
        }
      });
    },    
  } 
};
</script>