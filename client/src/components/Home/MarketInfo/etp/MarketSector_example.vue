<template>
  <v-container>
    <div>
      <div
        class="market_layout_w"
        v-if="carousel_info.carousel_cnt > 0"
        v-for="n in carousel_info.carousel_cnt"
        :key="n"
      >
        <v-layout class="market_card_layout">
          <v-flex v-for="x in 5" :key="x">
            <v-card flat>
              <div class="market_card_w">
                <div class="market_card2" wrap>
                  <h6>{{fn_getDataFromMarket(carousel_data, n, x, "name")}}</h6>
                  <ul>
                    <li>
                      <dl>
                        <dt
                          class="txt_num"
                        >{{new Intl.NumberFormat().format((fn_getDataFromMarket(carousel_data, n, x, "total_amt")) / 1000)}}K</dt>
                        <dt>KODEX IT</dt>
                      </dl>
                    </li>
                    <li>
                      <span class="etf_icon">ETF</span>
                      {{fn_getDataFromMarket(carousel_data, n, x, "etf_cnt")}}종목
                      <span class="unit">AUM</span>
                    </li>
                    <li>
                      <span class="etn_icon">ETN</span>
                      {{fn_getDataFromMarket(carousel_data, n, x, "etn_cnt")}}종목
                      <span class="unit">원</span>
                    </li>
                  </ul>
                </div>
                <div class="market_card_graph">
                  <div style="width:40%" class="market_graph_bar1"></div>
                  <div style="width:20%" class="market_graph_bar2"></div>
                  <div style="width:40%;" class="market_graph_bar3"></div>
                </div>
                <div class="market_card_graph">
                  <div class="text_w t1">상승:12</div>
                  <div class="text_w t2">보합:2</div>
                  <div class="text_w t3">하락:8</div>
                </div>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
      <v-card class="bg_W" v-if="Object.keys(carousel_mod).length > 0">
        <v-layout class="market_card_layout">
          <v-flex v-for="mod_item in orderedData" :key="mod_item.ctg_code">
            <v-card flat>
              <div class="market_card_w line_l">
                <div class="market_card2" wrap>
                  <h6>{{mod_item.name}}</h6>
                  <ul>
                    <li>
                      <dl>
                        <dt>총규모</dt>
                        <dt
                          class="txt_num text_result2"
                        >{{new Intl.NumberFormat().format((mod_item.total_amt) / 1000)}}K</dt>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>ETF - {{mod_item.etf_cnt}}종목</dt>
                        <dt>ETN - {{mod_item.etn_cnt}}종목</dt>
                      </dl>
                    </li>
                  </ul>
                </div>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </div>
    <v-layout row wrap>
      <!-- 테이블1 -->

      <v-flex v-for="item in ctg_results" :key="item.ctg_code" grow xs12 mt-2 mb-1>
        <v-card flat>
          <v-card-title primary-title>
            <h3 class="headline subtit" pb-0>
              {{item.ctg_name}}
              <p>
                Total
                <span class="text_result" v-bind:id="table_name + '_count'+item.ctg_code">120</span> results
                <span v-bind:id="table_name + '_date'+item.ctg_code">기준일 :2018.10.20</span>
              </p>
            </h3>
          </v-card-title>
          <v-card flat>
            <table v-bind:id="table_name + item.ctg_code" class="tbl_type" style="width:100%">
              <colgroup>
                <col width="20%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
                <col width="15%" />
                <col width="10%" />
                <col width="15%" />
              </colgroup>
              <thead>
                <tr>
                  <th>종목</th>
                  <th>INAV</th>
                  <th>전일최종NAV</th>
                  <th>추적오차율</th>
                  <th>괴리율</th>
                  <th>기초지수</th>
                  <th>지수현재가</th>
                  <th></th>
                </tr>
              </thead>
            </table>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Config from "@/js/config.js";
  import {market_common} from '@/js/common/mixins/mixins_marketinfo.js';
  export default {
    props: [],
    data() {
      return {
        table_name: "sector",
        ctg_results: [],
        carousel_info: [],
        carousel_data: [],
        carousel_mod: [],
        options: {
          color: 'primary',
          width: '80%',
          zIndex: 200
        },
        showEtpManageDetailDialog: false,
        paramData: {},
      };
    },
    mixins: [market_common],
    components: {},
    computed: {
      orderedData: function() {
        return _.orderBy(this.carousel_mod, 'ctg_code', 'asc');
      }
    },
    mounted: function() {
      var vm = this;
      vm.fn_getEtpList("002");
    },
    created: function() {},
    beforeDestroy() {},
    methods: {}
  };
</script>