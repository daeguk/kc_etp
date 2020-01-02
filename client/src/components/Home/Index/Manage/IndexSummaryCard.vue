<template>
  <v-card>
    <div class="summary_title">
      <v-toolbar flat>
        <v-toolbar-title>{{item.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="movePage">
          <v-icon>more_horiz</v-icon>
        </v-btn>
      </v-toolbar>
      <!--h5 class="headline mb-0">{{item.name}}</h5-->
      <div>
        <span>{{item.subTitle}}</span>
      </div>
      <h3 class="display-1 mb-0 text-xs-right">{{new Intl.NumberFormat().format(item.close_idx)}}</h3>
      <div class="text-xs-right">
        <span class="red--text">{{item.fluc_idx}} ({{item.fluc_rate}}%)</span>
      </div>
    </div>

    <AreaChart v-if="chartLoadFlag" :chartItem="chartItem" :dataSet="dataSet"></AreaChart>
  </v-card>
</template>

<script>
  import Config from "@/js/config.js"
  import AreaChart from '@/components/Common/Chart/AreaChart.vue'
  import util from "@/js/util.js";
  export default {
    props: ['item', 'chartItem'],
    data() {
      return {
        chartLoadFlag: false,
        dataSet: [],
      };
    },
    components: {
      AreaChart: AreaChart
    },
    created: function() {
      this.$EventBus.$on('getIndexSummaryHist', data => {
        this.getIndexSummaryHist();
      });
    },
    beforeDestroy() {
      this.$EventBus.$off('getIndexSummaryHist');
    },
    mounted: function() {
      //this.getIndexSummaryHist();
    },
    methods: {
      getIndexSummaryHist: function() {
        var vm = this;
        console.log('getIndexSummaryHist');
        util.axiosCall({
          "url": Config.base_url + '/user/index/getindexsummaryhist',
          "data": {
            "jisu_id": vm.chartItem.code,
            "market_id": vm.chartItem.market_id
          },
          "method": "get",
          "paramKey": "params"
        }, function(response) {
          if(response.data.success == false) {
            vm.$root.confirmt.open('확인', "데이터가 없습니다", {}, 1);
          } else {
            var items = response.data.results;
            var close_idx = 0.0;
            items.forEach(function(item, index) {
              close_idx = parseFloat(item.close_idx);
              vm.dataSet.push([item.trd_dd, close_idx]);
            });
            vm.chartLoadFlag = true;
          }
        }, function(error) {
          if(error) {
            vm.$root.confirmt.open('확인', error, {}, 4);
          }
        });
      },
      movePage: function() {
        this.$router.push({
          path: '/index/manage/IndexDetailInfo',
          query: {
            'jisu_cd': this.chartItem.code,
            'market_id': this.chartItem.market_id,
            'large_type': this.chartItem.large_type
          }
        });
      }
    }
  }
</script>