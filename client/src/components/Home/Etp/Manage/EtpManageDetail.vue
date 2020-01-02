<template>
  <div>
    <v-layout row>
      <v-flex xs12>
        <v-card flat ma-3>
          <!-- content내용 -->
          <div class="title01_w">
            <v-card-title primary-title>
              <div class="title_wrap01">
                <h3 class="headline mb-0">
                  {{this.etpBasic.F16002}}
                  <span class="grey--text">{{etpBasic.F16013}}</span>
                </h3>
                <div class="right_btn" v-if="!showEtpManageDetailDialog">
                  <v-layout align-right>
                    <v-flex xs12 sm4 text-xs-center>
                      <div class="btn_r">
                        <v-btn outline color="primary" small @click="fn_goBack()">목록으로 돌아가기</v-btn>
                      </div>
                    </v-flex>
                  </v-layout>
                </div>
              </div>
            </v-card-title>
          </div>
          <div class="graph_01_w">
            <div class="sub_title_num">
              {{etpBasic.F15001}}
              <span
                v-if="etpBasic.F15472 <= 0"
                class="text_blue"
              >{{etpBasic.F15472}}({{etpBasic.F15004}})%</span>
              <span v-else class="text_red">{{etpBasic.F15472}}({{etpBasic.F15004}})%</span>
              <p>Last Updated : {{etpBasic.fmt_F12506}}</p>
            </div>
            <div class="index_nums">
              <v-layout>
                <v-flex>
                  <ul>
                    <li>iNAV</li>
                    <li class="number">{{formatNumber(etpBasic.F15301)}}</li>
                    <li
                      v-if="etpBasic.F30818 <= 0"
                      class="number2 text_blue"
                    >{{formatNumber(etpBasic.F30818)}}%</li>
                    <li v-else class="number2 text_red">{{formatNumber(etpBasic.F30818)}}%</li>
                  </ul>
                </v-flex>
                <v-flex>
                  <ul>
                    <li>기초지수</li>
                    <li class="number">{{formatNumber(etpBasic.F15318)}}</li>
                    <li
                      v-if="etpBasic.F30823 <= 0"
                      class="number2 text_blue"
                    >{{formatNumber(etpBasic.F30823)}}%</li>
                    <li v-else class="number2 text_red">{{formatNumber(etpBasic.F30823)}}%</li>
                  </ul>
                </v-flex>
                <v-flex class="ver1">
                  <ul>
                    <li>시가총액</li>
                    <li class="number">{{formatNumber(etpBasic.F15028 / 1000000000)}}십억</li>
                    <li></li>
                  </ul>
                </v-flex>
                <v-flex class="ver2">
                  <ul>
                    <li>거래량</li>
                    <li class="number">{{formatInt(etpBasic.F15015)}}주</li>
                    <li class="number2 text_green">AVG(3M):{{formatInt(etpBasic.F13510)}}</li>
                  </ul>
                </v-flex>
                <v-flex class="ver3">
                  <ul>
                    <li>거래대금</li>
                    <li class="number">{{formatNumber(etpBasic.F15023/10000000)}}억</li>
                    <li
                      class="number2 text_green"
                    >AVG(3M):{{formatNumber(etpBasic.F13516/10000000)}}억</li>
                  </ul>
                </v-flex>
              </v-layout>
            </div>
          </div>
          <LineEtpMultiChart :etpBasic="etpBasic"></LineEtpMultiChart>
          <div class="tab2_w">
            <v-layout row wrap>
              <v-flex xs12>
                <v-tabs fixed-tabs light v-model="tab5" align-with-title>
                  <v-tabs-slider color="#1976d2"></v-tabs-slider>
                  <v-tab v-for="item in items5" :key="item">{{ item }}</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab5">
                  <v-tab-item>
                    <EtpManageDetailAnalysisTab
                      v-if="showEtpManageDetailDialogBySub"
                      :etpBasic="paramData"
                    ></EtpManageDetailAnalysisTab>
                  </v-tab-item>
                  <v-tab-item>
                    <EtpManageDetailBasicInfoTab
                      v-if="showEtpManageDetailDialogBySub"
                      :paramData="paramData"
                      :etpBasic="etpBasic"
                      :indexBasic="indexBasic"
                      @showDetail="showDetail"
                    ></EtpManageDetailBasicInfoTab>
                  </v-tab-item>
                </v-tabs-items>
              </v-flex>
            </v-layout>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- 지수 상세 팝업 -->
    <v-dialog v-model="showIndexDetailDialog" persistent max-width="1400">
      <IndexDetailInfo
        v-if="showIndexDetailDialog"
        :paramData="indexBasic"
        :showDialog="showIndexDetailDialog"
        :showView="false"
        @fn_closePop="fn_close"
      ></IndexDetailInfo>
    </v-dialog>
  </div>
</template>

<script>
  import EtpManageDetailBasicInfoTab from "./EtpManageDetailBasicInfoTab.vue";
  import EtpManageDetailAnalysisTab from "./EtpManageDetailAnalysisTab.vue";
  import LineEtpMultiChart from '@/components/common/chart/LineEtpMultiChart.vue';
  import Config from "@/js/config.js";
  import util from "@/js/util.js";
  import IndexDetailInfo from "@/components/Home/Index/Manage/IndexDetailInfo.vue"; /*지수 상세정보*/
  export default {
    props: ["paramData", "showEtpManageDetailDialog"],
    data() {
      return {
        tab5: null,
        items5: ["분석정보", "기본정보"],
        toggle_one: '1M',
        basicData: {},
        etpBasic: {},
        indexBasic: {},
        etpInfos: {},
        showEtpManageDetailDialogBySub: false,
        showIndexDetailDialog: false
      };
    },
    components: {
      IndexDetailInfo,
      LineEtpMultiChart,
      EtpManageDetailBasicInfoTab,
      EtpManageDetailAnalysisTab,
    },
    mounted: function() {
      // console.log( "EtpManageDetail.vue -> mounted" );
      // console.log( vm.paramData );
      this.init(false);
    },
    created: function() {
      console.log("EtpManageDetail...........created..........");
      var vm = this;
      vm.$EventBus.$on('changeEtpInfo', data => {
        console.log("changeEtpInfo..........");
        vm.toggle_one = '1M';
        vm.init(true);
      });
    },
    updated: function() {},
    destroyed: function() {
      console.log("EtpManageDetail...........destoryed..........");
      this.$EventBus.$off('changeEtpInfo');
    },
    methods: {
      init: function(event) {
        var vm = this;
        vm.$nextTick().then(() => {
          if(vm.paramData && (vm.paramData.F16012 || vm.paramData.F16257 || vm.paramData.F34239)) {
            vm.basicData.F16012 = vm.paramData.F16012; /* 국제표준코드 */
            vm.basicData.F16257 = vm.paramData.F16257; /* ETP기초지수코드 */
            vm.basicData.F34239 = vm.paramData.F34239; /* ETP기초지수MID */
            vm.paramData.perf_class = 'perf_chart_w2'; /* performanc 그래프 class */
            vm.paramData.tbl_class = 'tbl_type ver5'; /* performanc 테이블 class */
            vm.paramData.chart_size = '960'; /* performanc 차트 사이즈 */
          } else if(vm.$route.query.F16012 && vm.$route.query.F16257 && vm.$route.query.F34239) {
            vm.basicData.F16012 = vm.$route.query.F16012; /* 국제표준코드 */
            vm.basicData.F16257 = vm.$route.query.F16257; /* ETP기초지수코드 */
            vm.basicData.F34239 = vm.$route.query.F34239; /* ETP기초지수MID */
            vm.paramData.perf_class = 'perf_chart_w'; /* performanc 그래프 class */
            vm.paramData.tbl_class = 'tbl_type ver4'; /* performanc 테이블 class */
            vm.paramData.chart_size = '1180'; /* performanc 차트 사이즈 */
          }
          if(vm.basicData.F16012 || vm.basicData.F16257 || vm.basicData.F34239) {
            // vm.$refs.etpBtn_1m.$el.click();     /* ETP 차트 정보를 조회한다. */
            vm.fn_getEtpBasic(); /* ETP 의 기본정보를 조회한다. */
          }
          if(event) {
            // 분석정보 실행
            vm.$EventBus.$emit('changeEtpAnalysisInfo');
          }
        });
      },
      /*
       * ETP 의 기본정보를 조회한다.
       * 2019-04-25  bkLove(촤병국)
       */
      fn_getEtpBasic: function() {
        console.log("fn_getEtpBasic..................");
        var vm = this;
        axios.post(Config.base_url + "/user/etp/getEtpBasic", {
          data: vm.basicData
        }).then(function(response) {
          console.log(response);
          if(response.data) {
            var msg = (response.data.msg ? response.data.msg : "");
            if(!response.data.result) {
              if(msg) {
                vm.$root.confirmt.open('확인', msg, {}, 1);
                return false;
              }
            }
            vm.etpBasic = response.data.etpBasic;
            vm.etpBasic.F15001 = util.formatStringNum(vm.etpBasic.F15001);
            vm.indexBasic = response.data.indexBasic;
            vm.indexBasic.F16257 = vm.etpBasic.F16257;
            vm.indexBasic.LARGE_TYPE = vm.indexBasic.large_type;
            vm.indexBasic.MARKET_ID = vm.indexBasic.market_id;
            vm.showEtpManageDetailDialogBySub = true;
          }
        });
      },
      /*
       * 이전화면으로 되돌린다.
       * 2019-04-25  bkLove(촤병국)
       */
      fn_goBack() {
        this.$router.go(-1);
      },
      /*
       * 팝업창을 종료한다.
       * 2019-04-25  bkLove(촤병국)
       */
      fn_close: function() {
        var vm = this;
        vm.showIndexDetailDialog = false;
      },
      formatNumber: function(num) {
        return util.formatNumber(num);
      },
      formatInt: function(num) {
        return util.formatInt(num);
      },
      showDetail: function() {
        var vm = this;
        vm.showIndexDetailDialog = true;
      }
    }
  };
</script>