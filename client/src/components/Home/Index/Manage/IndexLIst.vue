<template>
  <v-container>
    <v-layout row wrap class="content_margin">
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex xs3 v-for="(rinfo, index) in rep_info" :key="rinfo.seq">
            <AreaIndexChart v-if="chartLoadFlag" :chartItem="rinfo" :dataSet="getDataSet(index)"></AreaIndexChart>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex grow>
        <v-card flat>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                Index List |
                <span class="grey--text">total {{list_cnt}} index</span>
              </h3>
            </div>
          </v-card-title>
        </v-card>
        <v-card flat>
          <table id="index_table" class="tbl_type ver8" width="100%">
            <thead>
              <tr>
                <th class="txt_left">ID</th>
                <th class="txt_left">지수명</th>
                <th class="txt_left">요청일</th>
                <th class="txt_left">발표여부</th>
                <th class="txt_left">산출타입</th>
                <th class="txt_left">ETP</th>
                <th class="txt_left">정보조회기관</th>
                <th></th>
              </tr>
            </thead>
          </table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import $ from 'jquery'
  import dt from 'datatables.net'
  import Config from '@/js/config.js';
  import util from "@/js/util.js";
  import AreaIndexChart from '@/components/common/chart/AreaIndexChart.vue';
  var table = null;
  export default {
    props: [],
    data() {
      return {
        rowsPerPageItems: [10, 20, 30],
        headers: [{
          text: "ID",
          align: "left",
          sortable: false,
          value: "JISU_CD"
        }, {
          text: "지수명",
          value: "JISU_NM",
          align: "left"
        }, {
          text: "요청일",
          value: "IP_DT"
        }, {
          text: "발표여부",
          value: "ANNO_YN"
        }, {
          text: "산출타입",
          value: "INDEX_CAL_METHOD"
        }, {
          text: "ETP",
          value: "ETP_NM"
        }, {
          text: "정보조회기관",
          value: "INST_CNT"
        }, {
          text: "",
          value: "iron"
        }],
        results: [],
        intra_data: [],
        list_cnt: 0,
        chartLoadFlag: false,
        rep_info: [],
      };
    },
    components: {
      AreaIndexChart: AreaIndexChart
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
      var vm = this;
      table = $('#index_table').DataTable({
        "processing": true,
        "serverSide": false,
        "info": false, // control table information display field
        "scrollY": '75vh',
        "lengthMenu": [
          [10, 20, 50, -1],
          [10, 20, 50, "All"]
        ],
        paging: false,
        searching: false,
        data: [],
        "columnDefs": [{
          "render": function(data, type, row) {
            if(data) {
              return data.replace(/,/gi, "</br>");
            } else {
              return "";
            }
          },
          "targets": 5
        }, ],
        columns: [{
          "data": "JISU_CD",
          "orderable": true,
          className: 'txt_left'
        }, {
          "data": "JISU_NM",
          "orderable": true,
          className: 'txt_left'
        }, {
          "data": "IP_DT",
          "orderable": true,
          className: 'txt_left'
        }, {
          "data": "ANNO_YN",
          "orderable": true,
          className: 'txt_left'
        }, {
          "data": "INDEX_CAL_METHOD",
          "orderable": true,
          className: 'txt_left'
        }, {
          "data": "ETP_NM",
          "orderable": true,
          className: 'txt_left'
        }, {
          "data": "INST_CNT",
          "orderable": true,
          className: 'txt_right'
        }, {
          "data": null,
          "orderable": false,
          className: 'checks',
          defaultContent: "<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:50px;'>지수정보</span></div>"
        }]
      });
      vm.getRecentIndex();
      vm.getInfoIndexList();
      $('#index_table, tbody').on('click', 'button', function() {
        var data = table.row($(this).parents('tr')).data();
        // alert("Name = " + JSON.stringify(data));
        vm.movePage(data.JISU_CD, data.MARKET_ID, data.LARGE_TYPE);
      });
      $('#index_table, tbody').on('click', 'tbody tr', function() {
        var data = table.row($(this).parents('tr')).data();
        // alert("Name = " + JSON.stringify(data));
      });
    },
    methods: {
      getRecentIndex: function() {
        var vm = this;
        vm.$root.progresst.open();
        util.axiosCall({
          "url": Config.base_url + "/user/index/getRecentIndex",
          "data": {},
          "method": "post",
          "paramKey": "params"
        }, function(response) {
          // console.log(response);
          if(response.data.success == false) {
            vm.$root.confirmt.open('', '지수 목록이 없습니다', {}, 1);
          } else {
            var items = response.data.results;
            items.forEach(function(item, index) {
              item.sColor = "#def5ae";
              item.eColor = "#ffffff";
              item.height = 150;
              if(index == items.length - 1) {
                item.width = 350;
              } else {
                item.width = 340;
              }
              item.marginW = 1;
              item.marginH = 40;
            });
            vm.rep_info = items;
            vm.rep_info.forEach(function(rinfo, index) {
              vm.getIndexIntra(rinfo);
            });
          }
          vm.$root.progresst.close();
        }, function(error) {
          vm.$root.progresst.close();
          if(error) {
            vm.$root.confirmt.open('', error, {}, 1);
          }
        });
      },
      getInfoIndexList: function() {
        var vm = this;
        vm.$root.progresst.open();
        util.axiosCall({
          "url": Config.base_url + "/user/index/getInfoIndexList",
          "data": {},
          "method": "get",
          "paramKey": "params"
        }, function(response) {
          // console.log(response);
          if(response.data.success == false) {
            vm.$root.confirmt.open('', '관리지수 목록이 없습니다', {}, 1);
          } else {
            var items = response.data.results;
            //console.log("response=" + JSON.stringify(items));
            vm.results = items;
            vm.list_cnt = vm.results.length;
            table.clear().draw();
            table.rows.add(vm.results).draw();
          }
          vm.$root.progresst.close();
        }, function(error) {
          vm.$root.progresst.close();
          if(error) {
            vm.$root.confirmt.open('', error, {}, 1);
          }
        });
      },
      getReplace: function(text) {
        if(text) {
          return text.replace(/,/gi, "</br>");
        }
      },
      movePage: function(jisu_cd, market_id, large_type) {
        this.$router.push({
          path: '/index/manage/IndexDetailInfo',
          query: {
            'jisu_cd': jisu_cd,
            'market_id': market_id,
            'large_type': large_type
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
          if(response.data.success == false) {
            alert("해당 지수의 데이터가 없습니다");
          } else {
            vm.intra_data.push(response.data.results);
            if(vm.intra_data.length == vm.rep_info.length) vm.chartLoadFlag = true;
          }
        });
      },
      getDataSet: function(idx) {
        var vm = this;
        var intra_info = vm.intra_data[idx];
        var items = [];
        for(let item of intra_info) {
          // console.log("close_idx : " + item.close_idx);
          items.push([item.F20044, item.F20004, item.F20008]);
        }
        return items;
      },
    }
  };
</script>
<style scoped>
</style>