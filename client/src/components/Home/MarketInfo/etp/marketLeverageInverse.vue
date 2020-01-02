<template>
  <v-container>
    <v-layout row wrap>
      <!-- 테이블 start -->
      <v-flex v-for="item in ctg_results" :key="item.ctg_code" grow xs12>
        <v-card flat>
          <v-card-title primary-title>
            <h3 class="headline subtit" pb-0>
              {{item.ctg_name}}
              <span
                class="text_result"
                v-bind:id="table_name + '_count'+item.ctg_code"
              >120</span>
              <span class="text_result_t">results</span>
              <span v-bind:id="table_name + '_date'+item.ctg_code">기준일 :2018.10.20</span>
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
      <!-- 테이블 end -->
    </v-layout>
  </v-container>
</template>

<script>
  import Config from "@/js/config.js";
  import {market_common} from '@/js/common/mixins/mixins_marketinfo.js';
  var importance_grid = null;
  export default {
    props: [],
    data() {
      return {
        table_name: "leverageInverse",
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
      this.fn_getEtpList("201"); /* 201-배율 ( 탭에 노출은 '레버리지/인버스' ) */
    },
    created: function() {},
    beforeDestroy() {},
    methods: {}
  };
</script>