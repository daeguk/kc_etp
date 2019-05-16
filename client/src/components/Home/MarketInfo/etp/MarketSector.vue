<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3 v-for="(rinfo, index) in rep_info" :key="rinfo.seq">
                    <BarSectorTextChart v-if=chartLoadFlag 
                        :chartItem="rinfo"></BarSectorTextChart>
                </v-flex>                    
              </v-layout>
            </v-flex>


            <!-- 테이블1 -->
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
import Config       from "@/js/config.js";
import util from "@/js/util.js";
import { market_common } from '@/js/common/mixins/mixins_marketinfo.js';
import BarSectorTextChart   from  '@/components/Common/Chart/BarSectorTextChart.vue';

export default {
    props: [],
    data() {
        return {

            table_name : "sector",
            ctg_results: [],
            carousel_info:[],
            carousel_data:[],
            carousel_mod:[],
            data_load_cnt:0,           
            sector_code:['010', '015', '020', '025', '030', '035', '040', '045', '050', '099'],
            rep_info:[],                        
            options: {
                color: 'primary',
                width: '80%',
                zIndex: 200
            },
            showEtpManageDetailDialog : false,
            paramData : {},
        };
    },
    mixins : [ market_common ],
    components: {
      BarSectorTextChart,
    },
    computed: {
      orderedData : function(){
        
        return _.orderBy(this.carousel_mod, 'ctg_code', 'asc');
      },
      chartLoadFlag : function(){
        if(this.data_load_cnt == this.sector_code.length) return true;
        else return false;        
      }
    },
    mounted: function() {
      var vm = this;

      for(var i=0; i < this.sector_code.length; i++) {
        var rinfo = {};

        rinfo.seq = i+1;
        rinfo.ctg_large_code = "002";
        rinfo.ctg_code = this.sector_code[i];
        if(i % 4 == 3) rinfo.width = 350;
        else  rinfo.width = 340;
        rinfo.height = 150;
        this.rep_info.push(rinfo);

        this.getEtpCtgBasic(this.rep_info[i]);
        this.getEtpSectorMaxRate(this.rep_info[i]);
        this.getEtfSectorSum(this.rep_info[i]);
        this.getEtnSectorSum(this.rep_info[i]);
        this.getEtpSectorUp(this.rep_info[i]);
        this.getEtpSectorDown(this.rep_info[i]);
        this.getEtpSectorBohap(this.rep_info[i]);

      }
      vm.fn_getEtpList( "002" );
        
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
      dataInit: function() {
      },
      getEtpCtgBasic: function(rinfo) {
        var vm = this;
        axios.get(Config.base_url + "/user/marketinfo/getEtpCtgBasic", {
          params: rinfo
        }).then(function(response) {
          if (response.data.success == false) {
            // alert("해당 지수의 데이터가 없습니다");
            rinfo.ctg_name = "";
          } else {
            rinfo.ctg_name = response.data.results[0].ctg_name;
          }
        });
      },
      getEtpSectorMaxRate: function(rinfo) {
        var vm = this;
        axios.get(Config.base_url + "/user/marketinfo/getEtpSectorMaxRate", {
          params: rinfo
        }).then(function(response) {
          if (response.data.success == false) {
            // alert("해당 지수의 데이터가 없습니다");
            rinfo.ctg_name = "";
          } else {
            rinfo.f15004 = response.data.results[0].F15004;
            rinfo.f16002 = response.data.results[0].F16002;
          }
        });
      },
      getEtfSectorSum: function(rinfo) {
        var vm = this;
        axios.get(Config.base_url + "/user/marketinfo/getEtfSectorSum", {
          params: rinfo
        }).then(function(response) {
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
      getEtnSectorSum: function(rinfo) {
        var vm = this;
        axios.get(Config.base_url + "/user/marketinfo/getEtnSectorSum", {
          params: rinfo
        }).then(function(response) {
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
      getEtpSectorUp: function(rinfo) {
        var vm = this;
        axios.get(Config.base_url + "/user/marketinfo/getEtpSectorUp", {
          params: rinfo
        }).then(function(response) {
          if (response.data.success == false) {
              // alert("해당 지수의 데이터가 없습니다");
             rinfo.etn_sum = 0;
          } else {
            rinfo.up = Number(response.data.results[0].Up);
          }
        });
      },
      getEtpSectorDown: function(rinfo) {
        var vm = this;
        axios.get(Config.base_url + "/user/marketinfo/getEtpSectorDown", {
          params: rinfo
        }).then(function(response) {
          if (response.data.success == false) {
              // alert("해당 지수의 데이터가 없습니다");
             rinfo.etn_sum = 0;
          } else {
            rinfo.down = Number(response.data.results[0].Down);
          }
        });
      },
      getEtpSectorBohap: function(rinfo) {
        var vm = this;
        axios.get(Config.base_url + "/user/marketinfo/getEtpSectorBohap", {
          params: rinfo
        }).then(function(response) {
          console.log("getEtpSectorBohap");
          console.log(response);
          if (response.data.success == false) {
              // alert("해당 지수의 데이터가 없습니다");
             rinfo.etn_sum = 0;
          } else {
            rinfo.bohap = Number(response.data.results[0].Bohap);
            vm.data_load_cnt++;
          }
        });
      },
        
    }
};
</script>