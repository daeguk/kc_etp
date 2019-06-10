<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout>
        <v-flex xs3 v-for="(rinfo, index) in rep_info" :key="rinfo.seq">
          <AreaIndexChart v-if=chartLoadFlag 
            :chartItem="rinfo"
            :dataSet="getDataSet(index)"></AreaIndexChart>
        </v-flex>                    
        </v-layout>
      </v-flex>

      <!---테이블1 -->
      <v-flex grow xs12 mt-2>
        <v-card flat>
          <v-card-title primary-title>
            <h3 class="headline subtit" pb-0>
                  KRX
              <v-combobox dense v-model="selIndexType" :items="indexTypes"
                label="INDEX TYPE" @change="getKrxIndexList(selIndexType)">
              </v-combobox>
              <span class="text_result">{{indexLists.length}} </span>
              <span class="text_result_t">results</span>
            </h3>
          </v-card-title>

          <div class="table-box-wrap">
            <div class="table-box" style="max-height:1000px;">
            <table class="tbl_type ver8">
              <caption> 헤더 고정 테이블</caption>
              <colgroup>
                <col width="21%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="9%">
                <col width="7%">
              </colgroup>
              <thead>
                <tr>
                  <th style="width:21%" class="txt_left">지수명</th>
                  <th style="width:9%" class="txt_center">현재가</th>
                  <th style="width:9%" class="txt_center">대비</th>
                  <th style="width:9%" class="txt_center">Daily</th>
                  <th style="width:9%" class="txt_center">1Week</th>
                  <th style="width:9%" class="txt_center">1Month</th>
                  <th style="width:9%" class="txt_center">YTD</th>
                  <th style="width:9%" class="txt_center">1Year</th>
                  <th style="width:9%" class="txt_center">3Year</th>
                  <th style="width:7%" class="txt_center">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in indexLists" :key="index">
                  <td class="txt_left">{{item.F16002}}</td>
                  <td class="txt_right">{{item.F15001}}</td>
                  <td class="txt_right">{{item.F15472}}</td>
                  <td class="txt_right">{{item.F15004}}%</td>
                  <td class="txt_right">{{item.weekRate}}%</td>
                  <td class="txt_right">{{item.monthRate}}%</td>
                  <td class="txt_right">{{item.ytdRate}}%</td>
                  <td class="txt_right">{{item.yearRate}}%</td>
                  <td class="txt_right">{{item.tyearRate}}%</td>
                  <td class="txt_right">TEST</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </v-card>
      </v-flex>
      <!---테이블1 end -->
    </v-layout>
  </v-container>
</template>

<script>

import _ from "lodash";
import Config       from "@/js/config.js";
import util       from "@/js/util.js";
import AreaIndexChart   from  '@/components/common/chart/AreaIndexChart.vue';

export default {
  props: [],
  data() {
    return {
      indexLists:[],
      resultLists:[],
      chartLoadFlag: false,
      paramData : {},
      intra_data:[],
      bef1Week:"",
      bef1Month:"",
      befYtd:"",
      bef1Year:"",
      bef3Year:"",
      indexTypes: [{text:"KOSPI", value:"KSP"}, 
        {text:"KOSDAQ", value:"KSQ"}, 
        {text:"SECTOR", value:"SECTOR"}, 
        {text:"ETC", value:"ETC"},
        /*
        {text:"전체", value:"TOTAL"},
        */
      ],
      selIndexType: {text:"KOSPI", value:"KSP"},
      rep_info:[{seq:1, f16013:"1", market_id:"M002", name:"KOSPI", f15001:"", 
                  f15472:"", f15004:"", sColor:"#def5ae", eColor:"#ffffff",
                  width:340, height:150, marginW:1, marginH:40},
        {seq:2, f16013:"51", market_id:"M002", name:"KOSPI 200", f15001:"", 
                f15472:"", f15004:"", sColor:"#def5ae", eColor:"#ffffff",
                width:340, height:150, marginW:1, marginH:40},
        {seq:3, f16013:"1", market_id:"M004", name:"KOSDAQ", f15001:"", 
                f15472:"", f15004:"", sColor:"#def5ae", eColor:"#ffffff",
                width:340, height:150, marginW:1, marginH:40},
        {seq:4, f16013:"203", market_id:"M004", name:"KOSDAQ 150", f15001:"", 
                f15472:"", f15004:"", sColor:"#def5ae", eColor:"#ffffff",
                width:350, height:150, marginW:1, marginH:40}],
    };
  },
  components: {
    AreaIndexChart,
  },
  computed: {
      
  },
  mounted: function() {
    this.bef1Week = util.getBef1Week();
    this.bef1Month = util.getBef1Month();
    this.befYtd = util.getBefYtd();
    this.bef1Year = util.getBef1Year();
    this.bef3Year = util.getBef3Year();

    for(var i=0; i<this.rep_info.length; i++) {
      this.getIndexBasic(this.rep_info[i]);
      this.getIndexIntra(this.rep_info[i]);
    }

    this.getKrxIndexList(this.selIndexType);
      // 테이블별 이벤트
      /*
      $('#krxIndexTable tbody').on('click', 'button', function (e) {
          e.stopImmediatePropagation();

          var table = $('#krxIndexTable').DataTable();
          var data = table.row($(this).parents('tr')).data();

          if ($(this).attr('id') == 'btnIndexDetail') {
              vm.fn_movePage( data );
          }

          return  false; 
      });
      */

  },
  created: function() {},
  beforeDestroy() {},
  methods: {
    formatNumber:function(num) {
      return util.formatNumber(num);
    },

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
          rinfo.f15001 = response.data.results[0].F15001;
          rinfo.f15472 = response.data.results[0].F15472;
          rinfo.f15004 =  response.data.results[0].F15004;      
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
    getKrxIndexList: function(indexType) {
      console.log("getKrxIndexList");
      var vm = this;
      vm.indexLists = [];          
      axios.get(Config.base_url + "/user/marketinfo/getKrxIndexListByType1", {
        params: {
          selIndexType: indexType.value,
          bef1Week: vm.bef1Week,
          bef1Month: vm.bef1Month,
          befYtd: vm.befYtd,
          bef1Year: vm.bef1Year,
          bef3Year: vm.bef3Year,
        }
      }).then(function(response) {
        // console.log(response);
        if (response.data.success == false) {
          alert("해당 종목이 없습니다");
        } else {
          vm.resultLists = response.data.results;
          // console.log(vm.resultLists);
          for(let i=0; i < vm.resultLists.length; i++) {
            let tmp = {};
            tmp.F16002 = vm.resultLists[i].F16002;
            tmp.F15001 = vm.resultLists[i].F15001;
            tmp.F15472 = vm.resultLists[i].F15472;
            tmp.F15004 = vm.resultLists[i].F15004;
            tmp.weekRate = util.getDiffRate(tmp.F15001, vm.resultLists[i].bef1Week);
            tmp.monthRate = util.getDiffRate(tmp.F15001, vm.resultLists[i].bef1Month);
            tmp.ytdRate = util.getDiffRate(tmp.F15001, vm.resultLists[i].befYtd);
            tmp.yearRate = util.getDiffRate(tmp.F15001, vm.resultLists[i].bef1Year);
            tmp.tyearRate = util.getDiffRate(tmp.F15001, vm.resultLists[i].bef3Year);
            vm.indexLists.push(tmp);
          }
          console.log("vm.indexLists......." + vm.indexLists.length);
          console.log(vm.indexLists);
        }
      });
    },
  }
};
</script>
<style scoped>
.textcount {
  margin-left: 50px;
  color: #FF0000;
}
</style>