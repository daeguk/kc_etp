<template>
    <v-container>
        <v-layout row wrap>
        <!--
            <v-flex xs12>
                <v-carousel  light hide-delimiters height="250px" interval="10000">
                    <v-carousel-item  class="bg_W market_layout_w" v-if="carousel_info.carousel_cnt > 0"  v-for="n in carousel_info.carousel_cnt" :key="n">
                        <v-layout class="market_card_layout">
                            <v-flex  v-for="x in carousel_info.carousel_div" :key="x">
                                <v-card flat>
                                    <div class="market_card_w line_l">
                                        <div class="market_card2" wrap>
                                            <h6>
                                                {{fn_getDataFromMarket(carousel_data, n, x, "name")}}
                                                <p>
                                                    {{ new Intl.NumberFormat().format( fn_getDataFromMarket(carousel_data, n, x, "f15001") ) }}
                                                    <span :class='( fn_getDataFromMarket(carousel_data, n, x, "f15472") > 0 ? "text_red" : "" )'>
                                                        {{fn_getDataFromMarket(carousel_data, n, x, "f15472")}}({{fn_getDataFromMarket(carousel_data, n, x, "f15004")}} %)
                                                    </span>
                                                </p>
                                            </h6>
                                            <ul>
                                                <li>
                                                    ETF - {{ new Intl.NumberFormat().format( fn_getDataFromMarket(carousel_data, n, x, "etf_cnt") ) }}종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM {{ new Intl.NumberFormat().format( fn_getDataFromMarket(carousel_data, n, x, "etf_sum")  / 1000 ) }}K</span>
                                                </li>
                                                <li>
                                                    ETN - {{fn_getDataFromMarket(carousel_data, n, x, "etn_cnt")}} 종목
                                                    <br>
                                                    <span>Total</span>
                                                    <span class="text_result2">AUM {{ new Intl.NumberFormat().format( fn_getDataFromMarket(carousel_data, n, x, "etn_sum")  / 1000 ) }}K</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </v-card>
                            </v-flex>                           
                        </v-layout>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
            -->
            <v-flex xs12>
              <v-layout class="marketrepre_graph">
                <v-flex  v-for="(rinfo, index) in rep_info" :key="rinfo.seq">
                  <v-card flat>
                    <AreaIndexTextChart v-if=chartLoadFlag :chartItem="{chartId: rinfo.f16013 + rinfo.market_id,
                       width: '342', height: '150',  marginW: 1, marginH: 40, chartColor: '#C8E6C9'}"
                        :textItem="rinfo"
                        :dataSet="getDataSet(index)"></AreaIndexTextChart>
                  </v-card>
                </v-flex>                    
              </v-layout>
            </v-flex>

            <v-flex v-for="item in ctg_results" :key="item.ctg_code"  grow xs12 mt-3>
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
import AreaIndexTextChart   from  '@/components/Common/Chart/AreaIndexTextChart.vue';
import AreaChart   from  '@/components/Common/Chart/AreaChart.vue';

var importance_grid = null;

export default {
    props: [  ],
    data() {
        return {
            table_name : "represent",
            ctg_results: [],
            carousel_info:[],
            carousel_data:[],
            carousel_mod:[],
            intra_data:[],
            rep_info:[{seq:0, f16013:"1", market_id:"M002", name:"KOSPI", f15001:"2,078.00", 
                        f15472:"", f15004:"",etf_sum:"", etn_sum:"", sColor:"#79caab", eColor:"#d8faf0"},
              {seq:1, f16013:"51", market_id:"M002", name:"KOSPI 200", f15001:"", 
                      f15472:"", f15004:"",etf_sum:"", etn_sum:"", sColor:"#BA68C8", eColor:"#E1BEE7"},
              {seq:2, f16013:"1", market_id:"M004", name:"KOSDAQ", f15001:"", 
                      f15472:"", f15004:"",etf_sum:"", etn_sum:"", sColor:"#DCE775", eColor:"#F0F4C3"},
              {seq:3, f16013:"203", market_id:"M004", name:"KOSDAQ 150", f15001:"", 
                      f15472:"", f15004:"",etf_sum:"", etn_sum:"", sColor:"#A1887F", eColor:"#D7CCC8"}],
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
    mixins : [ market_common ],
    components: {
      AreaIndexTextChart,
    },
    computed: {
         orderedData : function(){
            return _.orderBy(this.carousel_mod, 'ctg_code', 'asc');
        }        
    },
    mounted: function() {

        this.fn_getEtpList( "001" );       /* 001-시장대표 */
        for(var i=0; i<4; i++) {
          this.getIndexBasic(this.rep_info[i]);
          this.getEtfSumByIndex(this.rep_info[i]);
          this.getEtnSumByIndex(this.rep_info[i]);
        }
        for(var i=0; i<4; i++) {
          this.getIndexIntra(this.rep_info[i]);
        }
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
      getIndexBasic: function(rinfo) {
        console.log("getIndexBasic : " + rinfo.seq);
        var vm = this;

        axios.get(Config.base_url + "/user/marketinfo/getIndexBasic", {
          params: rinfo
        }).then(function(response) {
          console.log(response);
          if (response.data.success == false) {
              alert("해당 지수의 데이터가 없습니다");
          } else {
            rinfo.f15001 = response.data.results[0].F15001;
            rinfo.f15472 = response.data.results[0].F15472;
            rinfo.f15004 =  response.data.results[0].F15004;      
          }
        });
      },
      getEtfSumByIndex: function(rinfo) {
        console.log("getEtfSumByIndex : " + rinfo.seq);
        var vm = this;

        axios.get(Config.base_url + "/user/marketinfo/getEtfSumByIndex", {
          params: {
            f34239: Number(rinfo.market_id.substring(1)),
            // f34239: rinfo.market_id.substring(1),
            f16257 : rinfo.f16013
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
        console.log("getEtnSumByIndex : " + rinfo.seq);
        var vm = this;

        axios.get(Config.base_url + "/user/marketinfo/getEtnSumByIndex", {
          params: {
            f34239: Number(rinfo.market_id.substring(1)),
            // f34239: rinfo.market_id.substring(1),
            f16257 : rinfo.f16013
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
        console.log("getIndexIntra : " + rinfo.seq);
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
              if(vm.intra_data.length == 4) vm.chartLoadFlag = true;
          }
        });
      },
      getDataSet: function(idx) {
          var vm = this;
          var intra_info = vm.intra_data[idx];
          var items = [];
          for (let item of intra_info) {
            // console.log("close_idx : " + item.close_idx);
              items.push([item.trd_his, item.close_idx, item.trd_dd]);
          }

          return items;
      },
    }
};
</script>
