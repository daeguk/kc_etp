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
          <v-card-title primary-title class="tbl_w2">
            <v-list-tile>
              <v-list-tile-title class="headline">FnGuide
              </v-list-tile-title>
            </v-list-tile>
          </v-card-title>
          <v-card flat>
              <table id="krxIndexTable" class="tbl_type" style="width:100%">
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
                          <th>지수명</th>
                          <th>현재가</th>
                          <th>전일가</th>
                          <th>Daily</th>
                          <th>1Week</th>
                          <th>1Month</th>
                          <th>YTD</th>
                          <th>1Year</th>
                          <th>3Year</th>
                          <th></th>
                      </tr>
                  </thead>
              </table>
              <v-btn block color="#ffffff" @click="moreData('krx')">
                  <v-icon color="#9e9e9e">add</v-icon>더보기 ({{krxCurrentPage}}/{{krxTotalPage}})
              </v-btn>
          </v-card>
        </v-card>
      </v-flex>
      <!---테이블1 end -->

            <!-- 테이블2 -->
            <v-flex grow xs12 mt-2>
                <v-card flat>
                    <v-card-title primary-title class="tbl_w2">
                        <v-list-tile>
                            <v-list-tile-avatar>
                                <img src="/assets/img/avatar.png">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title class="headline">FnGuide
                                </v-list-tile-title>
                                <v-list-tile-sub-title>설명이 들어갑니다.</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-card-title>
                    <v-card flat>
                        <table id="fnGuideIndexTable" class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="21%">
                                <col width="9%">
                                <col width="9%">
                                <col width="9%">
                                <col  width="9%">
                                <col  width="9%">
                                <col  width="9%">
                                <col  width="9%">
                                <col  width="9%">
                                <col  width="7%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>지수명</th>
                                    <th>현재가</th>
                                    <th>전일가</th>
                                    <th>Daily</th>
                                    <th>1Week</th>
                                    <th>1Month</th>
                                    <th>YTD</th>
                                    <th>1Year</th>
                                    <th>3Year</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                        <v-btn block color="#ffffff" @click="moreData('fn')">
                            <v-icon color="#9e9e9e">add</v-icon>더보기 ({{fnCurrentPage}}/{{fnTotalPage}})
                        </v-btn>
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
import util       from "@/js/util.js";
import AreaIndexChart   from  '@/components/common/chart/AreaIndexChart.vue';

var krxIndexTable = null;
var fnGuideIndexTable = null;
export default {
  props: [],
  data() {
    return {
      marketRepList: [],
      graphinfos:[],     
      krsLists:[],   
      fnGuideLists:[], 
      pageLength: 5, 
      krxCurrentPage: 0,
      krxTotalPage:0,
      fnCurrentPage: 0,
      fnTotalPage:0,
      chartLoadFlag: false,

      paramData : {},
      intra_data:[],
      rep_info:[{seq:1, f16013:"1", market_id:"M002", name:"KOSPI", f15001:"", 
                  f15472:"", f15004:"",etf_sum:"", etn_sum:"", sColor:"#def5ae", eColor:"#ffffff",
                  width:340, height:150, marginW:1, marginH:40},
        {seq:2, f16013:"51", market_id:"M002", name:"KOSPI 200", f15001:"", 
                f15472:"", f15004:"",etf_sum:"", etn_sum:"", sColor:"#def5ae", eColor:"#ffffff",
                width:340, height:150, marginW:1, marginH:40},
        {seq:3, f16013:"1", market_id:"M004", name:"KOSDAQ", f15001:"", 
                f15472:"", f15004:"",etf_sum:"", etn_sum:"", sColor:"#def5ae", eColor:"#ffffff",
                width:340, height:150, marginW:1, marginH:40},
        {seq:4, f16013:"203", market_id:"M004", name:"KOSDAQ 150", f15001:"", 
                f15472:"", f15004:"",etf_sum:"", etn_sum:"", sColor:"#def5ae", eColor:"#ffffff",
                width:350, height:150, marginW:1, marginH:40}],
    };
  },
    components: {
      AreaIndexChart,
    },
    computed: {
        
    },
    mounted: function() {
      var vm = this;
      for(var i=0; i<this.rep_info.length; i++) {
        this.getIndexBasic(this.rep_info[i]);
        this.getIndexIntra(this.rep_info[i]);
      }

      vm.getMarketIndexList();
        

        krxIndexTable = $('#krxIndexTable').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                    
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br><span class='text_s'>"+row.F16013+"</span>";
                        if (row.NEW_YN == "Y") {
                            htm += "<span><div class='text_new'>new</div></span>";
                        }
                        htm += "        </span>";
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {

                        let htm = ""
                            
                        htm += util.formatNumber(data);

                        if (row.F15004 >= 0) {
                            htm += "<br><span class='text_S text_red'>"+row.F15004+"%</span>";
                        } else {
                            htm += "<br><span class='text_S text_blue'>"+row.F15004+"%</span>"; /* ETF관련지수등락율 */
                        }

                        return htm;
                    },
                    "targets": 1
                },
                {
                    "render": function ( data, type, row ) {
                        return util.formatNumber(data);                            
                    },
                    "targets": 2
                },
                {
                    "render": function ( data, type, row ) {
                        let htm = ""
                        if (data >= 0) {
                                htm = "<span class='align_r text_red'>"+data + "</span>";
                        } else {
                                htm = "<span class='align_r text_blue'>"+data + "</span>";
                        }      
                        return htm;                   
                    },
                    "targets": [3]
                },
                {
                    "render": function ( data, type, row ) {
                        let htm = "<div class='tooltip'><button type='button' id='btnIndexDetail' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:50px;'>지수정보</span></div>";                            
                        return htm;
                    },
                    "targets": 9
                }
            ],              
            columns: [
                { "data": "F16002", "orderable": true, className:"txt_left line2"}, /*종목*/
                { "data": 'F15001', "orderable": true , className:"txt_right"}, /*현재가*/
                { "data": 'F15009', "orderable" : true, className:"txt_right"}, /*전일가*/
                { "data": 'daily', "orderable" : true, className:"txt_right" }, /*Daily*/
                { "data": '1week', "orderable" : true, className:"txt_right"}, /*1Week*/
                { "data": '1month', "orderable" : true, className:"txt_right"}, /*1Month*/
                { "data": 'ytd', "orderable" : true, className:"txt_right"}, /*YTD*/
                { "data": '1year', "orderable" : true, className:"txt_right"}, /*1Year*/
                { "data": '3year', "orderable" : true, className:"txt_right"}, /*3Year*/
                { "data": null, "orderable" : true, defaultContent:""},
            ]
        }); 

        // 테이블별 이벤트
        $('#krxIndexTable tbody').on('click', 'button', function (e) {
            e.stopImmediatePropagation();

            var table = $('#krxIndexTable').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btnIndexDetail') {
                vm.fn_movePage( data );
            }

            return  false; 
        });


        fnGuideIndexTable = $('#fnGuideIndexTable').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                    
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br><span class='text_s'>"+row.F16013+"</span>";
                        if (row.NEW_YN == "Y") {
                            htm += "<span><div class='text_new'>new</div></span>";
                        }
                        htm += "        </span>";
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {

                        let htm = ""
                            
                        htm += util.formatNumber(data);

                        if (row.F15004 >= 0) {
                            htm += "<br><span class='text_S text_red'>"+row.F15004+"%</span>";
                        } else {
                            htm += "<br><span class='text_S text_blue'>"+row.F15004+"%</span>"; /* ETF관련지수등락율 */
                        }

                        return htm;


                    },
                    "targets": 1
                },
                {
                    "render": function ( data, type, row ) {
                        return util.formatNumber(data);                            
                    },
                    "targets": 2
                },
                {
                    "render": function ( data, type, row ) {
                        let htm = ""
                        if (data >= 0) {
                                htm = "<span class='align_r text_red'>"+data + "</span>";
                        } else {
                                htm = "<span class='align_r text_blue'>"+data + "</span>";
                        }      
                        return htm;                   
                    },
                    "targets": [3]
                },
                {
                    "render": function ( data, type, row ) {
                        let htm = "<div class='tooltip'><button type='button' id='btnIndexDetail'  class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:50px;'>지수정보</span></div>";                            
                        return htm;
                    },
                    "targets": 9
                }
            ],                                    
            columns: [
                { "data": "F16002", "orderable": true, className:"txt_left line2"}, /*종목*/
                { "data": 'F15001', "orderable": true, className:"txt_right" }, /*현재가*/
                { "data": 'F15009', "orderable" : true, className:"txt_right"}, /*전일가*/
                { "data": 'daily', "orderable" : true, className:"txt_right" }, /*Daily*/
                { "data": '1week', "orderable" : true, className:"txt_right"}, /*1Week*/
                { "data": '1month', "orderable" : true, className:"txt_right"}, /*1Month*/
                { "data": 'ytd', "orderable" : true, className:"txt_right"}, /*YTD*/
                { "data": '1year', "orderable" : true, className:"txt_right"}, /*1Year*/
                { "data": '3year', "orderable" : true, className:"txt_right"}, /*3Year*/
                { "data": null, "orderable" : true},
            ]
        });

        // 테이블별 이벤트
        $('#fnGuideIndexTable tbody').on('click', 'button', function (e) {
            e.stopImmediatePropagation();

            var table = $('#fnGuideIndexTable').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btnIndexDetail') {
                vm.fn_movePage( data );
            }

            return  false;
        });
    },
    created: function() {},
    beforeDestroy() {},
    methods: {

        getMarketIndexList: function() {
            console.log("getMarketIndexList");
            var vm = this;
            var idx = 0;

            vm.$emit('showProgress', true);
            axios.get(Config.base_url + "/user/marketinfo/getMarketIndexList", {
                    params: {
                       
                    }
            }).then(function(response) {
                console.log(response);
                if (response.data.success == false) {
                    alert("해당 종목이 없습니다");
                } else {
                    vm.marketRepList = response.data.marketRepList;
                    vm.graphinfos = response.data.graphinfos;
                    vm.krsLists = response.data.krsLists[0];
                    vm.fnGuideLists = response.data.fnGuideLists[0];
                   
                    vm.krxTotalPage = vm.krsLists.length;
                    vm.fnTotalPage = vm.fnGuideLists.length;

                    // KRX INDEX DRAW (페이지 크기만큼만 잘라내어 보여 준다.)
                    if (vm.krxTotalPage > 0) {
                        krxIndexTable.clear().draw();
                        krxIndexTable.rows.add(vm.getSliceData(vm.krsLists, 'krx')).draw();
                    }
                    // FNGUIDE INDEX DRAW
                    if (vm.fnTotalPage > 0) {
                        fnGuideIndexTable.clear().draw();
                        fnGuideIndexTable.rows.add(vm.getSliceData(vm.fnGuideLists, 'fn')).draw();
                    }
                }
                vm.$emit('showProgress', false);
            }).catch(error => {
                vm.$emit("showProgress", false);
            });
        },
        getSliceData: function(items, gubun) {
            var vm = this;
            var curPage = 0;
            if (gubun == "krx") {
                curPage = vm.pageLength + vm.krxCurrentPage;
                if (items != null) {
                    if (curPage <= items.length) {
                        vm.krxCurrentPage = curPage;
                        return _.slice(items, 0, curPage);
                    } else {
                        if (vm.krxCurrentPage < items.length) {
                            vm.krxCurrentPage = items.length;
                            return _.slice(items, 0, curPage);
                        } else {
                            return null;
                        }
                    }
                }
            } else if (gubun == "fn") {
                curPage = vm.pageLength + vm.fnCurrentPage;
                if (items != null) {
                    if (curPage <= items.length) {
                        vm.fnCurrentPage = curPage;
                        return _.slice(items, 0, curPage);
                    } else {            
                        if (vm.fnCurrentPage < items.length) {
                            vm.fnCurrentPage = items.length;
                            return _.slice(items, 0, curPage);
                        } else {
                            return null;
                        }
                        return null;
                    }
                }
            } 
        }, 

        moreData: function(gubun) {
            var vm = this;

            if (gubun == "krx") {
                // KRX INDEX DRAW (페이지 크기만큼만 잘라내어 보여 준다.)
                var items = vm.getSliceData(vm.krsLists, gubun);
                if (items != null) {
                    krxIndexTable.clear().draw();
                    krxIndexTable.rows.add(items).draw();
                }
            } else if (gubun == "fn") {
                // FNGUIDE INDEX DRAW
                var items = vm.getSliceData(vm.fnGuideLists, gubun);
                if (items != null) {
                    fnGuideIndexTable.clear().draw();
                    fnGuideIndexTable.rows.add(items).draw();
                }
            }
        },
        formatNumber:function(num) {
            return util.formatNumber(num);
        },

        /*
         *  그리드에서 차트이미지 선택시 인덱스 상세 팝업창을 띄운다. ( IndexInfoMain.vue -> emit )
         *  2019-04-16  bkLove(촤병국)
         */
        fn_movePage: function( data ) {
            this.$emit('showDetail', 2, data);
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
    }
};
</script>
