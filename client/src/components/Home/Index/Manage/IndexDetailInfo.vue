<template>
  <div :class="contentClass">
    <v-layout row>
      <v-flex xs12>
        <v-card flat ma-3>
          <div class="title01_w">
            <v-card-title primary-title>
              <div class="title_wrap01">
                <h3 class="headline mb-0">
                  {{this.results.F16002}}
                  <span class="grey--text">{{results.F16013}}</span>
                </h3>
                <div class="right_btn">
                  <v-layout align-right>
                    <div class="btn_r" v-if="!showDialog">
                      <v-btn
                        outline
                        color="primary"
                        small
                        :to="{path:'/index/manage', query:{'activeTab':'2'}}"
                      >목록으로 돌아가기</v-btn>
                    </div>
                    <div class="btn_r" v-if="showDialog == true && showView == false">
                      <v-btn icon @click="fn_close">
                        <v-icon>close</v-icon>
                      </v-btn>
                    </div>
                  </v-layout>
                </div>
              </div>
            </v-card-title>
            <v-card-text>
              <p class="title_ex">{{this.results.INDEX_COMMENT}}</p>
            </v-card-text>
          </div>
          <!--                    
                    <div class="graph_01_w">
                        <div class="sub_title_num">
                            {{results.F15001}}
                            <span>{{results.F15472}}({{results.F15004}})</span>
                            <p>Last Updated : {{results.F12506}}</p>
                        </div>
                        <v-card flat class="graph_toggle">
                            <v-flex xs12  class="py-2">
                                <v-btn-toggle v-model="toggle_one" class="toggle_01">
                                    <v-btn flat value="1D" v-on:click="Indexchart('1D')">1D</v-btn>
                                    <v-btn flat value="1W" v-on:click="Indexchart('1W')">1W</v-btn>
                                    <v-btn flat value="1M" v-on:click="Indexchart('1M')">1M</v-btn>
                                    <v-btn flat value="3M" v-on:click="Indexchart('3M')">3M</v-btn>
                                    <v-btn flat value="6M" v-on:click="Indexchart('6M')">6M</v-btn>
                                    <v-btn flat value="1Y" v-on:click="Indexchart('1Y')">1Y</v-btn>
                                    <v-btn flat value="Total" v-on:click="Indexchart('TOTAL')">Total</v-btn>
                                </v-btn-toggle>
                            </v-flex>
                        </v-card>

                        <div
                            id="index_chart_div"
                            class="graph_01"
                            style="height:300px;background-color:#f6f6f6;"
                        ></div>
                    </div>
          -->

          <div class="graph_01_w">
            <div class="sub_title_num">
              {{results.F15001}}
              <span>{{results.F15472}}({{results.F15004}})%</span>
              <p>Last Updated : {{results.F12506}}</p>
            </div>
            <div class="index_nums">
              <v-layout>
                <v-flex class="ver1">
                  <ul>
                    <li>시가총액</li>
                    <li class="number">{{formatInt(results.F15028/1000000000)}}십억</li>
                  </ul>
                </v-flex>
                <v-flex class="ver2">
                  <ul>
                    <li>거래량</li>
                    <li class="number">{{formatInt(results.F15015)}}주</li>
                  </ul>
                </v-flex>
                <v-flex class="ver3">
                  <ul>
                    <li>거래대금</li>
                    <li class="number">{{formatInt(results.F15023)}}천</li>
                  </ul>
                </v-flex>
              </v-layout>
            </div>

            <div class="pad_gleft1">
              <LineIndexChart01 v-if="chartFlag==1" :indexBasic="results"></LineIndexChart01>
              <LineIndexChart02 v-if="chartFlag==2" :indexBasic="results"></LineIndexChart02>
            </div>
          </div>
          <div class="tab2_w">
            <v-layout row wrap>
              <v-flex xs12>
                <v-tabs fixed-tabs light v-model="tab" align-with-title>
                  <v-tabs-slider color="#1976d2"></v-tabs-slider>

                  <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <IndexDetailInfoTab1 :basicData="basicData" v-if="openSubIndexInfoTab"></IndexDetailInfoTab1>
                  </v-tab-item>
                  <v-tab-item>
                    <IndexDetailInfoTab2
                      :basicData="results"
                      :etpList="etpList"
                      :showDialog="showDialog"
                      :showView="showView"
                      v-if="openSubIndexInfoTab"
                    ></IndexDetailInfoTab2>
                  </v-tab-item>
                  <v-tab-item v-if="!showDialog">
                    <IndexDetailInfoTab3></IndexDetailInfoTab3>
                  </v-tab-item>
                </v-tabs-items>
              </v-flex>
            </v-layout>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>


<script>
  import IndexDetailInfoTab1 from "./IndexDetailInfoTab1.vue";
  import IndexDetailInfoTab2 from "./IndexDetailInfoTab2.vue";
  import IndexDetailInfoTab3 from "./IndexDetailInfoTab3.vue";
  import LineIndexChart02 from '@/components/common/chart/LineIndexChart02.vue';
  import LineIndexChart01 from '@/components/common/chart/LineIndexChart01.vue';
  import Config from "@/js/config.js";
  import util from "@/js/util.js";
  export default {
    props: ['paramData', 'showDialog', 'showView'],
    data() {
      return {
        text: "center",
        toggle_none: null,
        toggle_one: '1M',
        toggle_exclusive: 2,
        toggle_multiple: [0, 1, 2],
        tab: null,
        items: ["기본정보", "분석정보", "정보공개 목록"],
        results: {},
        etpInfos: {},
        index_dialog: false,
        options: {
          color: 'primary',
          width: '809%',
          zIndex: 200
        },
        openSubIndexInfoTab: false,
        openSubPublicTab: true,
        basicData: {},
        contentClass: 'content_margin',
        etpList: [],
        chartFlag: 0,
      };
    },
    components: {
      IndexDetailInfoTab1: IndexDetailInfoTab1,
      IndexDetailInfoTab2: IndexDetailInfoTab2,
      IndexDetailInfoTab3: IndexDetailInfoTab3,
      LineIndexChart01: LineIndexChart01,
      LineIndexChart02: LineIndexChart02,
    },
    computed: {},
    created: function() {
      var vm = this;
      vm.$EventBus.$on('changeIndexInfo', data => {
        vm.toggle_one = '1M';
        vm.openSubIndexInfoTab = true;
        if(vm.showView) {
          vm.chartFlag = 2;
        } else {
          vm.chartFlag = 1;
        }
        vm.init(true);
        vm.items = ["기본정보", "분석정보"];
      });
    },
    beforeDestroy() {
      this.$EventBus.$off('changeIndexInfo');
    },
    mounted: function() {
      // 메시지 박스 참조
      var vm = this;
      if(vm.showView) {
        vm.chartFlag = 2;
      } else {
        vm.chartFlag = 1;
      }
      vm.init(false);
      if(vm.showDialog) {
        vm.items = ["기본정보", "분석정보"];
      } else {
        vm.items = ["기본정보", "분석정보", "정보공개 목록"];
      }
    },
    methods: {
      init: function(event) {
        var vm = this;
        vm.$nextTick().then(() => {
          if(vm.paramData && vm.paramData.F16257 && vm.paramData.LARGE_TYPE && vm.paramData.MARKET_ID) {
            vm.basicData.jisu_cd = vm.paramData.F16257;
            vm.basicData.large_type = vm.paramData.LARGE_TYPE;
            vm.basicData.market_id = vm.paramData.MARKET_ID;
            vm.basicData.perf_class = 'perf_chart_w2'; /* performanc 그래프 class */
            vm.basicData.tbl_class = 'tbl_type ver5'; /* performanc 테이블 class */
            vm.basicData.chart_size = '960'; /* performanc 차트 사이즈 */
            vm.contentClass = '';
          } else if(vm.$route.query.jisu_cd && vm.$route.query.large_type && vm.$route.query.market_id) {
            vm.basicData.jisu_cd = vm.$route.query.jisu_cd;
            vm.basicData.large_type = vm.$route.query.large_type;
            vm.basicData.market_id = vm.$route.query.market_id;
            vm.basicData.perf_class = 'perf_chart_w'; /* performanc 그래프 class */
            vm.basicData.tbl_class = 'tbl_type ver4'; /* performanc 테이블 class */
            vm.basicData.chart_size = '1180'; /* performanc 차트 사이즈 */
            vm.contentClass = 'content_margin';
          }
          if(vm.basicData && vm.basicData.jisu_cd && vm.basicData.large_type && vm.basicData.market_id) {
            vm.getIndexBaseInfo();
          }
          if(event == true) {
            // // 분석정보 실행
            vm.$EventBus.$emit('changeIndexAnalysisInfo');
            // 분석정보 실행
            vm.$EventBus.$emit('changeIndexBasicInfo');
          }
        });
      },
      fn_close: function() {
        this.$emit("fn_closePop", "close");
      },
      getIndexBaseInfo: function() {
        var vm = this;
        util.axiosCall({
          "url": Config.base_url + "/user/index/getIndexBaseInfo",
          "data": {
            jisu_cd: vm.basicData.jisu_cd,
            market_id: vm.basicData.market_id,
            large_type: vm.basicData.large_type
          },
          "method": "get",
          "paramKey": "params"
        }, function(response) {
          try {
            if(response.data.success == false) {
              if(vm.$root.confirmt.open('확인', "지수정보가 없습니다.", {}, 1)) {}
            } else {
              var items = response.data.results;
              if(items[0].MARKET_ID) {
                items[0].market_id = items[0].MARKET_ID;
              }
              if(items[0].LARGE_TYPE) {
                items[0].large_type = items[0].LARGE_TYPE;
              }
              vm.results = items[0];
              //this.list_cnt = this.results.length;
              vm.getIndexInEtpInfo(vm.basicData);
            }
          } catch (ex) {
            console.log("error", ex);
          }
        }, function(error) {
          if(error) {
            if(vm.$root.confirmt.open('확인', error, {}, 4)) {}
          }
        });
      },
      getIndexInEtpInfo: function(rinfo) {
        var vm = this;
        vm.etpList = [];
        axios.get(Config.base_url + "/user/index/getIndexInEtpInfo", {
          params: {
            jisu_cd: rinfo.jisu_cd,
            market_id: rinfo.market_id,
          }
        }).then(response => {
          if(response.data.success == false) {
            // alert("지수 관련 ETP정보가 없습니다.");
          } else {
            vm.etpList = response.data.results;
            vm.tabFlag = true;
          }
          vm.openSubIndexInfoTab = true;
        });
      },
      formatInt: function(num) {
        return util.formatInt(num);
      },
    }
  };
</script>