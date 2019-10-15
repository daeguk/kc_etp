<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex xs3 v-for="(rinfo, index) in rep_info" :key="rinfo.seq">
            <AreaIndexTextChart v-if=chartLoadFlag 
              :chartItem="rinfo"
              :dataSet="getDataSet(index)"></AreaIndexTextChart>
          </v-flex>                    
        </v-layout>
      </v-flex>
      <v-flex v-for="item in ctg_results" :key="item.ctg_code"  grow xs12 mt-2>
        <v-card flat>
          <v-card-title primary-title>
            <h3 class="headline subtit" pb-0>
              {{item.ctg_name}}
                <span class="text_result" v-bind:id="table_name + '_count'+item.ctg_code">120 </span>
                <span class="text_result_t">results</span>
                <span v-bind:id="table_name + '_date'+item.ctg_code">기준일111 :2018.10.20</span>
            </h3>
          </v-card-title>
          <v-card flat>
            <table v-bind:id="table_name + item.ctg_code" class="tbl_type" style="width:100%">
              <colgroup>
                <col width="20%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="15%">
                <col width="10%">
                <col width="15%">
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
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config from "@/js/config.js";
import util from "@/js/util.js";
import { market_common } from '@/js/common/mixins/mixins_marketinfo.js';
import AreaIndexTextChart   from  '@/components/common/chart/AreaIndexTextChart.vue';

export default {
  props: [],
  data() {
    return {
      table_name : "represent",
      ctg_results: [],
      intra_data:[],
      rep_info:[{seq:1, F16013:"1", market_id:"M002", name:"KOSPI", F15001:"", 
                  F15472:"", F15004:"",etf_sum:"", etn_sum:"", sColor:"#def5ae", eColor:"#ffffff",
                  width:340, height:150, marginW:1, marginH:40},
        {seq:2, F16013:"51", market_id:"M002", name:"KOSPI 200", F15001:"", 
                F15472:"", F15004:"",etf_sum:"", etn_sum:"", sColor:"#def5ae", eColor:"#ffffff",
                width:340, height:150, marginW:1, marginH:40},
        {seq:3, F16013:"1", market_id:"M004", name:"KOSDAQ", F15001:"", 
                F15472:"", F15004:"",etf_sum:"", etn_sum:"", sColor:"#def5ae", eColor:"#ffffff",
                width:340, height:150, marginW:1, marginH:40},
        {seq:4, F16013:"203", market_id:"M004", name:"KOSDAQ 150", F15001:"", 
                F15472:"", F15004:"",etf_sum:"", etn_sum:"", sColor:"#def5ae", eColor:"#ffffff",
                width:350, height:150, marginW:1, marginH:40}],
      options: {
        color: 'primary',
        width: '80%',
        zIndex: 200
      },
      chartLoadFlag : false,
      showEtpManageDetailDialog : false,
      paramData : {},
    };
  },
  mixins : [market_common],
  components: {
    AreaIndexTextChart,
  },
  mounted: function() {
    this.fn_getEtpList( "001" );       /* 001-시장대표 */
    for(var i=0; i<this.rep_info.length; i++) {
      this.getIndexBasic(this.rep_info[i]);
      this.getEtfSumByIndex(this.rep_info[i]);
      this.getEtnSumByIndex(this.rep_info[i]);
    }
    for(var i=0; i<this.rep_info.length; i++) {
      this.getIndexIntra(this.rep_info[i]);
    }
  },
  created: function() {},
  beforeDestroy() {},
  methods: {
    getIndexBasic: function(rinfo) {
      // console.log("getIndexBasic : " + rinfo.seq);
      var vm = this;

      axios.get(Config.base_url + "/user/marketinfo/getIndexBasic", {
        params: rinfo
      }).then(function(response) {
        // console.log(response);
        if (response.data.success == false) {
            alert("해당 지수의 데이터가 없습니다");
        } else {
          rinfo.F15001 = response.data.results[0].F15001;
          rinfo.F15472 = response.data.results[0].F15472;
          rinfo.F15004 =  response.data.results[0].F15004;      
        }
      });
    },
    getEtfSumByIndex: function(rinfo) {
      // console.log("getEtfSumByIndex : " + rinfo.seq);
      var vm = this;

      axios.get(Config.base_url + "/user/marketinfo/getEtfSumByIndex", {
        params: {
          F34239: Number(rinfo.market_id.substring(1)),
          // F34239: rinfo.market_id.substring(1),
          F16257 : rinfo.F16013
        }
      }).then(function(response) {
        // console.log(response);
        if (response.data.success == false) {
            // alert("해당 지수의 데이터가 없습니다");
            rinfo.etf_sum = 0;
        } else {
          rinfo.etf_sum = response.data.results[0].F16500;
          if(rinfo.etf_sum == null) rinfo.etf_sum = 0;
          else rinfo.etf_sum = util.formatStringNum(rinfo.etf_sum);
        }
      });
    },
    getEtnSumByIndex: function(rinfo) {
      // console.log("getEtnSumByIndex : " + rinfo.seq);
      var vm = this;

      axios.get(Config.base_url + "/user/marketinfo/getEtnSumByIndex", {
        params: {
          F34239: Number(rinfo.market_id.substring(1)),
          // F34239: rinfo.market_id.substring(1),
          F16257 : rinfo.F16013
        }
      }).then(function(response) {
        // console.log(response);
        if (response.data.success == false) {
            // alert("해당 지수의 데이터가 없습니다");
            rinfo.etn_sum = 0;
        } else {
          rinfo.etn_sum = response.data.results[0].F16500;
          if(rinfo.etn_sum == null) rinfo.etn_sum = 0;
          else rinfo.etn_sum = util.formatStringNum(rinfo.etn_sum);
        }
      });
    },
    getIndexIntra: function(rinfo) {
      // console.log("getIndexIntra : " + rinfo.seq);
      var vm = this;

      axios.get(Config.base_url + "/user/marketinfo/getIndexIntra", {
        params: rinfo
      }).then(function(response) {
        // console.log(response);
        if (response.data.success == false) {
          alert("해당 지수의 데이터가 없습니다");
        } else {
          // vm.intra_data.push = response.data.results;
          vm.intra_data.push(response.data.results);
          // console.log(vm.intra_data[rinfo.seq]);
          // 데이터 없는 상태에서 getDataSet 하면 에러남.
          // Error in render: "TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
          if(vm.intra_data.length == vm.rep_info.length) vm.chartLoadFlag = true;
        }
      });
    },
    getDataSet: function(idx) {
      var vm = this;
      var intra_info = vm.intra_data[idx];
      var items = [];
      for (let item of intra_info) {
        // console.log("close_idx : " + item.close_idx);
        items.push([item.F20044, item.F20004, item.F20008]);
      }
      return items;
    },
  }
};
</script>
