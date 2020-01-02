<template>
  <v-container>
    <v-flex>
      <v-dialog v-model="showDialog" persistent max-width="750">
        <v-card>
          <h5>
            <v-card-title ma-0>
              ETF iNAV Realtime Calculator
              <v-spacer></v-spacer>
              <v-btn icon dark @click="fn_closePop">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
          </h5>

          <div class="ETPInavpop1">
            <v-list subheader>
              <h6>
                {{etpBasic.F16002}}
                <span>{{etpBasic.F16012}}</span>
              </h6>

              <v-list-tile>
                <v-list-tile-title class="sumu_text">Simulation Mode</v-list-tile-title>
                <v-list-tile-content class="sumul_btn_w">
                  <ul>
                    <li>
                      <v-switch
                        v-model="SimulationSwitch"
                        v-on:change="SimulationMode"
                        color="primary"
                      ></v-switch>
                    </li>
                    <li v-if="SimulationSwitch == true">
                      <v-btn small flat icon>
                        <v-icon :class="btn_class" v-on:click="navCalcu">{{btn_kind}}</v-icon>
                      </v-btn>
                    </li>
                    <li v-if="SimulationSwitch == true">
                      <v-btn small flat icon>
                        <v-icon v-on:click="getiNavData(paramData.F16012)">refresh</v-icon>
                      </v-btn>
                    </li>
                  </ul>
                </v-list-tile-content>
                <span>
                  <button type="button" class="exceldown_btn" @click.stop="fn_downExcel"></button>
                </span>
              </v-list-tile>
            </v-list>
          </div>

          <div class="sumul_w">
            <v-card flat class="sumul_card_w">
              <v-layout>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs6 class="sumul_card_line">
                      <ul>
                        <li class="list_tit">산출방식</li>
                        <li>{{etpBasic.F33929 == '0' ? 'PDF' : '지수수익율'}}</li>
                      </ul>
                      <ul>
                        <li class="list_tit">전일NAV</li>
                        <li>{{formatNumber(etpBasic.F03329)}}</li>
                      </ul>
                      <ul>
                        <li class="list_tit">
                          <b>외부공표 iNAV</b>
                        </li>
                        <li class="text_red" v-if="etpBasic.F30818 >= 0">
                          <b>{{formatNumber(etpBasic.F15301)}}</b>
                          <br />
                          <span class="float_r">{{formatNumber(etpBasic.F30818)}}%</span>
                        </li>
                        <li class="text_blue" v-if="etpBasic.F30818 < 0">
                          <b>{{formatNumber(etpBasic.F15301)}}</b>
                          <br />
                          <span class="float_r">{{formatNumber(etpBasic.F30818)}}%</span>
                        </li>
                      </ul>
                    </v-flex>
                    <v-flex xs6>
                      <ul>
                        <li class="list_tit">CU시가총액</li>
                        <li>{{formatNumber(market_tot_amt)}}</li>
                      </ul>
                      <ul>
                        <li class="list_tit">CU당 주식수</li>
                        <li>{{formatInt(etpBasic.F16499)}}</li>
                      </ul>
                      <ul>
                        <li class="list_tit">
                          <b>iNAV 계산결과</b>
                        </li>
                        <li class="text_red" v-if="iNav_percent >= 0">
                          <b>{{formatNumber(iNav_amt.toFixed(2))}}</b>
                          <br />
                          <span class="float_r">{{formatNumber(iNav_percent.toFixed(2))}}%</span>
                        </li>
                        <li class="text_blue" v-if="iNav_percent < 0">
                          <b>{{formatNumber(iNav_amt.toFixed(2))}}</b>
                          <br />
                          <span class="float_r">{{formatNumber(iNav_percent.toFixed(2))}}%</span>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
          </div>
          <!--pdf table-->

          <h4>
            {{etpBasic.F33929 == '0' ? 'PDF' : '지수수익율'}}
            <span>{{etpBasic.F12506}}</span>
          </h4>

          <table id="pdf_table" class="tbl_type ver9" style="width:100%">
            <colgroup>
              <col width="8%" />
              <col width="10%" />
              <col width="20%" />
              <col width="15%" />
              <col width="7%" />
              <col width="15%" />
              <col width="15%" />
              <col width="16%" />
            </colgroup>
            <thead>
              <tr>
                <th class="txt_left">분류</th>
                <th class="txt_left">코드</th>
                <th>종목</th>
                <th class="txt_right">CU수량</th>
                <th class="txt_right">비중</th>
                <th class="txt_right">현재가</th>
                <th class="txt_right">기준가</th>
                <th class="txt_right">CU시가총액</th>
              </tr>
            </thead>
          </table>

          <!--pdf table end-->
          <v-card class="pop_bot_h"></v-card>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-container>
</template>



<script>
  import $ from "jquery";
  import dt from "datatables.net";
  import select from "datatables.net-select";
  import _ from "lodash";
  import Config from "@/js/config.js";
  import util from "@/js/util.js";
  import {nav_cal_common} from '@/js/common/mixins/mixins_nav_cal.js';
  var pdf_table = null;
  export default {
    props: ["showDialog", "paramData"],
    data() {
      return {
        SimulationSwitch: false,
        etpBasic: {},
        pdfList: null,
        market_tot_amt: 0,
        iNav_amt: 0,
        iNav_percent: 0,
        nav_timer: null,
        btn_class: 'btn_on',
        btn_kind: 'play_circle_outline',
        SimulationRender: {},
        DefaultRender: {},
      };
    },
    mixins: [nav_cal_common],
    created: function() {},
    mounted: function() {
      var vm = this;
      /* 시뮬레이션 모드 */
      vm.SimulationRender = {
        "processing": true,
        "serverSide": false,
        "info": false, // control table information display field
        "stateSave": true, //restore table state on page reload,
        "lengthMenu": [
          [10, 20, 50, -1],
          [10, 20, 50, "All"]
        ],
        "scrollY": '40vh',
        thead: {
          display: 'none'
        },
        "ordering": true,
        "order": [
          [4, "desc"]
        ],
        "columnDefs": [{
          "render": function(data, type, row) {
            let htm = "";
            if(data == 0) {
              htm = 'KSP';
            } else if(data == 1) {
              htm = 'KSQ';
            } else if(data == 2) {
              htm = '기타';
            } else if(data == 3) {
              htm = '채권';
            } else if(data == 4) {
              htm = '파생';
            }
            return htm;
          },
          "targets": 0
        }, {
          "render": function(data, type, row) {
            let htm = "";
            htm += "<input type='text' id='F16499' class='txt_right' value='" + vm.formatNumber(data) + "'>";
            return htm;
          },
          "targets": 3
        }, {
          "render": function(data, type, row) {
            let htm = "";
            htm += Number(data) + "%";
            return htm;
          },
          "targets": 4
        }, {
          "render": function(data, type, row) {
            let htm = ""
            htm += "<input type='text' id='F15001' class='txt_right' value='" + vm.formatNumber(data) + "'>";
            if(row.F15004 >= 0) {
              htm += "<br><span class='text_S text_red'>" + vm.formatNumber(vm.formatDigit(row.F15004, 2)) + "%</span>";
            } else {
              htm += "<br><span class='text_S text_blue'>" + vm.formatNumber(vm.formatDigit(row.F15004, 2)) + "%</span>";
            }
            return htm;
          },
          "targets": 5
        }, {
          "render": function(data, type, row) {
            let htm = ""
            htm += "<input type='text' id='F15007' class='txt_right' value='" + vm.formatNumber(data) + "'>";
            return htm;
          },
          "targets": 6
        }, {
          "render": function(data, type, row) {
            let htm = ""
            htm = vm.formatNumber(data);
            return htm;
          },
          "targets": 7
        }, ],
        select: {
          style: 'single',
          selector: 'td:first-child'
        },
        paging: false,
        searching: false,
        columns: [{
          /* 분류 */ 
          "data": "F33861",
          "orderable": true
        }, {
          /*코드*/
          "data": "F16013",
          "orderable": true,
          className: "txt_left"
        },  {
          /*종목*/
          "data": "F16004",
          "orderable": true,
          className: "txt_left"
        },  {
          /*cu 수량*/
          "data": "F16499",
          "orderable": true,
          className: "txt_right"
        },  {
          /*비중*/
          "data": "F34743",
          "orderable": true,
          className: "txt_right"
        },  {
          /*현재가*/
          "data": "F15001",
          "orderable": true,
          className: "txt_right"
        },  {
          /*기준가*/
          "data": "F15007",
          "orderable": true,
          className: "txt_right"
        },  {
          /*CU시가총액*/
          "data": "F16588",
          "orderable": true,
          className: "txt_right"
        },  ]
      };
      /* 기본 모드 */
      vm.DefaultRender = {
        "processing": true,
        "serverSide": false,
        "info": false, // control table information display field
        "stateSave": true, //restore table state on page reload,
        "lengthMenu": [
          [10, 20, 50, -1],
          [10, 20, 50, "All"]
        ],
        "scrollY": '40vh',
        thead: {
          display: 'none'
        },
        "ordering": true,
        "order": [
          [4, "desc"]
        ],
        "columnDefs": [{
          "render": function(data, type, row) {
            let htm = "";
            if(data == 0) {
              htm = 'KSP';
            } else if(data == 1) {
              htm = 'KSQ';
            } else if(data == 2) {
              htm = '기타';
            } else if(data == 3) {
              htm = '채권';
            } else if(data == 4) {
              htm = '파생';
            }
            return htm;
          },
          "targets": 0
        }, {
          "render": function(data, type, row) {
            let htm = "";
            htm += vm.formatNumber(data);
            return htm;
          },
          "targets": 3
        }, {
          "render": function(data, type, row) {
            let htm = "";
            htm += Number(data) + "%";
            return htm;
          },
          "targets": 4
        }, {
          "render": function(data, type, row) {
            let htm = ""
            htm += vm.formatNumber(data);
            if(row.F15004 >= 0) {
              htm += "<br><span class='text_S text_red'>" + vm.formatNumber(vm.formatDigit(row.F15004, 2)) + "%</span>";
            } else {
              htm += "<br><span class='text_S text_blue'>" + vm.formatNumber(vm.formatDigit(row.F15004, 2)) + "%</span>";
            }
            return htm;
          },
          "targets": 5
        }, {
          "render": function(data, type, row) {
            let htm = ""
            htm = vm.formatNumber(data);
            return htm;
          },
          "targets": [6, 7]
        }, ],
        select: {
          style: 'single',
          selector: 'td:first-child'
        },
        paging: false,
        searching: false,
        columns: [{
          /* 분류 */
          "data": "F33861",
          "orderable": true
        },  {
          /*코드*/
          "data": "F16013",
          "orderable": true,
          className: "txt_left"
        },  {
          /*종목*/
          "data": "F16004",
          "orderable": true,
          className: "txt_left"
        },  {
          /*cu 수량*/
          "data": "F16499",
          "orderable": true,
          className: "txt_right"
        },  {
          /*비중*/
          "data": "F34743",
          "orderable": true,
          className: "txt_right"
        },  {
          /*현재가*/
          "data": "F15001",
          "orderable": true,
          className: "txt_right"
        },  {
          /*기준가*/
          "data": "F15007",
          "orderable": true,
          className: "txt_right"
        },  {
          /*CU시가총액*/
          "data": "F16588",
          "orderable": true,
          className: "txt_right"
        },  ]
      };
      pdf_table = $('#pdf_table').DataTable(vm.DefaultRender);
      // 값이 변경 되었을때 
      $('#pdf_table tbody').on('change', 'input', function() {
        var table = $('#pdf_table').DataTable();
        var data = table.row($(this).parents('td').parents('tr')).data();
        if($(this).attr('id') == 'F16499') {
          data.F16499 = vm.NtoS($(this).val());
        } else if($(this).attr('id') == 'F15001') {
          data.F15001 = vm.NtoS($(this).val());
        } else if($(this).attr('id') == 'F15007') {
          data.F15007 = vm.NtoS($(this).val());
        }
        //vm.navCalcu();
      });
      vm.getiNavData(vm.paramData.F16012);
    },
    methods: {
      /*
       * ETP iNAV 계산기 데이터를 조회한다.
       */
      getiNavData(F16012) {
        var vm = this;
        let simulationMode = false; /* 데이터를 DB 상에서 가져 오기 때문에 무조건 false로 넘김*/
        vm.$root.progresst.open();
        // console.log( "EtpOperPdfInavCalcPop.vue -> getiNavData" );
        util.axiosCall({
          "url": Config.base_url + "/user/etp/getiNavData",
          "data": {
            //F16012 : 'KR7261110001',
            F16012: F16012,
          },
          "method": "get",
          "paramKey": "params"
        }, async function(response) {
            try {
              if(response.data.success) {
                vm.etpBasic = response.data.etpBasic;
                vm.pdfList = response.data.pdfList;
                var market_amt = 0;
                var market_tot_amt = 0;
                var index = 0;
                /* pdf데이터가 없을 경우 */
                if(vm.pdfList.length == 0) {
                  vm.$root.progresst.close();
                }
                for(let item of vm.pdfList) {
                  await vm.iNavCalulator(item, simulationMode).then(function(jongItem) {
                    /* 종목 정보 바인딩 */
                    item.F16588 = jongItem.market_amt; /* 시가 총액 (처음 로딩시는 etp 평가 금액으로 세팅)*/
                    item.F15001 = jongItem.F15001; /* 현재가 */
                    item.F15007 = jongItem.F15007; /* 기준가 */
                    item.F15004 = jongItem.F15004; /* 등락률 */
                    item.F15472 = jongItem.F15472; /* 대비 */
                    item.F16013 = jongItem.F16013; /* 단축코드 */
                    item.F15001_US = 0; /* 달러 현재가 */
                    item.F14531 = 0; /* JPYUSD 매수호가 */
                    item.F14501 = 0; /* JPYUSD 매도호가 */
                    item.F03003 = 0; /* JPYUSD 전일종가 */
                    item.F33904 = 0; /* 단위계약승수 */
                    // 엔화예금일경우 
                    if(item.F16316 == 'JPYZZ0000001') {
                      item.F15001_US = jongItem.F15001_US; /* 달러 현재가 */
                      item.F14531 = jongItem.F14531; /* JPYUSD 매수호가 */
                      item.F14501 = jongItem.F14501; /* JPYUSD 매도호가 */
                      item.F03003 = jongItem.F03003; /* JPYUSD 전일종가 */
                    }
                    // 선물 또는 옵션일 경우
                    if(item.F33861 == '4') {
                      item.F33904 = jongItem.F33904; /* 단위계약승수 */
                    }
                    market_tot_amt += jongItem.market_amt;
                    if(index == (vm.pdfList.length - 1)) {
                      vm.market_tot_amt = market_tot_amt;
                      /*INav 계산 : CU시가총액 / CU당 주식수*/
                      if(vm.etpBasic.F16499 > 0) {
                        vm.iNav_amt = vm.market_tot_amt / vm.etpBasic.F16499;
                      } else {
                        vm.iNav_amt = vm.market_tot_amt;
                      }
                      /* INav 등락률 */
                      vm.iNav_percent = ((vm.iNav_amt / vm.etpBasic.F03329) - 1) * 100;
                      /* 비중 정보 산출*/
                      for(let item of vm.pdfList) {
                        item.F34743 = ((item.F16588 / vm.market_tot_amt) * 100).toFixed(2);
                      }
                      vm.pdf_reload(vm.pdfList);
                    }
                    //console.log("market_amt:"+market_amt + "idx:" + index + "lenght:" + (vm.pdfList.length-1));     
                    index++;
                  });
                }
              } else {
                vm.$root.progresst.close();
              }
            } catch (ex) {
              vm.$root.progresst.close();
              console.log("error", ex);
            }
          },
          function(error) {
            console.log(error);
            vm.$root.progresst.close();
            if(error) {
              vm.$root.confirmt.open('확인', error, {}, 4);
            }
          });
      },
      pdf_reload: function() {
        pdf_table.clear().draw();
        pdf_table.rows.add(this.pdfList).draw();
        this.$root.progresst.close();
      },
      formatNumber: function(num) {
        if(num != null && typeof num !== 'undefined') {
          var parts = num.toString().split(".");
          return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        } else {
          return num;
        }
      },
      formatDigit: function(num, digit) {
        return util.formatDigit(num, digit)
      },
      formatInt: function(num) {
        return util.formatInt(num);
      },
      NtoS: function(num) {
        return util.NumtoStr(num);
      },
      /* 반복 계산 시작 및 스톱처리 */
      startStop: function() {
        if(this.nav_timer == null) {
          this.startLoopCalcu();
        } else {
          this.stopLoopCalcu();
        }
      },
      /* 반복 계산 */
      startLoopCalcu: function() {
        if(this.nav_timer == null) {
          this.btn_kind = 'pause_circle_outline'
          this.nav_timer = setInterval(this.getiNavData(this.paramData.F16012), 10000);
        }
      },
      /* 반복 계산 스톱*/
      stopLoopCalcu: function() {
        if(this.nav_timer != null) {
          this.btn_kind = 'play_circle_outline'
          clearInterval(this.nav_timer);
          this.nav_timer = null;
        }
      },
      /* Inav 계산 처리 */
      async navCalcu() {
        var vm = this;
        var market_amt = 0;
        var market_tot_amt = 0;
        var index = 0;
        vm.$root.progresst.open();
        for(let item of vm.pdfList) {
          await vm.iNavCalulator(item, vm.SimulationSwitch).then(function(jongItem) {
            /* 종목 정보 바인딩 */
            item.F16588 = jongItem.market_amt; /* 시가 총액 */
            item.F15001 = jongItem.F15001; /* 현재가 */
            item.F15007 = jongItem.F15007; /* 기준가 */
            item.F15004 = jongItem.F15004; /* 등락률 */
            item.F15472 = jongItem.F15472; /* 대비 */
            item.F16013 = jongItem.F16013; /* 단축코드 */
            item.F15001_US = 0; /* 달러 현재가 */
            item.F14531 = 0; /* JPYUSD 매수호가 */
            item.F14501 = 0; /* JPYUSD 매도호가 */
            item.F03003 = 0; /* JPYUSD 전일종가 */
            item.F33904 = 0; /* 단위계약승수 */
            // 엔화예금일경우 
            if(item.F16316 == 'JPYZZ0000001') {
              item.F15001_US = jongItem.F15001_US; /* 달러 현재가 */
              item.F14531 = jongItem.F14531; /* JPYUSD 매수호가 */
              item.F14501 = jongItem.F14501; /* JPYUSD 매도호가 */
              item.F03003 = jongItem.F03003; /* JPYUSD 전일종가 */
            }
            // 선물 또는 옵션일 경우
            if(item.F33861 == '4') {
              item.F33904 = jongItem.F33904; /* 단위계약승수 */
            }
            market_tot_amt += jongItem.market_amt;
            /* 등락률 재계산 */
            item.F15004 = ((item.F15001 / item.F15007) - 1) * 100;
            if(index == (vm.pdfList.length - 1)) {
              vm.market_tot_amt = market_tot_amt;
              /*INav 계산 : CU시가총액 / CU당 주식수*/
              if(vm.etpBasic.F16499 > 0) {
                vm.iNav_amt = vm.market_tot_amt / vm.etpBasic.F16499;
              } else {
                vm.iNav_amt = vm.market_tot_amt;
              }
              /* INav 등락률 */
              vm.iNav_percent = ((vm.iNav_amt / vm.etpBasic.F03329) - 1) * 100;
              /* 비중 정보 산출*/
              for(let item of vm.pdfList) {
                item.F34743 = ((item.F16588 / vm.market_tot_amt) * 100).toFixed(2);
              }
              vm.pdf_reload(vm.pdfList);
            }
            //console.log("market_amt:"+market_amt + "idx:" + index + "lenght:" + (vm.pdfList.length-1));     
            index++;
          });
        }
      },
      SimulationMode: function() {
        if(this.SimulationSwitch) {
          this.stopLoopCalcu();
          pdf_table.destroy();
          pdf_table = $('#pdf_table').DataTable(this.SimulationRender);
          this.pdf_reload(this.pdfList);
        } else {
          pdf_table.destroy();
          pdf_table = $('#pdf_table').DataTable(this.DefaultRender);
          this.getiNavData(this.paramData.F16012);
        }
      },
      fn_closePop() {
        var vm = this;
        vm.stopLoopCalcu();
        vm.$emit("fn_closePop", "close");
      },
      /*
       *  엑셀을 다운로드 한다.
       *  2019-07-09  bkLove(촤병국)
       */
      fn_downExcel: function() {
        var vm = this;
        var tableList = pdf_table.rows().data();
        if(!tableList || tableList.length == 0) {
          vm.$root.confirmt.open('확인', '조회된 내용이 1건 이상 존재해야 합니다.', {}, 1);
          return false;
        }
        var arrHeaderNm = [];
        var arrHeaderKey = [];
        var arrColsInfo = [];
        var sheetNm = "";
        var execelDataList = [];
        sheetNm = "PDF";
        arrHeaderNm = ["분류", "코드", "종목", "CU 수량", "비중", "현재가", "등락율", "기준가", "CU시가총액"];
        arrHeaderKey = ["F33861", "F16013", "F16004", "F16499", "F34743", "F15001", "F15004", "F15007", "F16588"];
        arrColsInfo = [{width: 10}, {width: 10}, {width: 30}, {width: 15}, {width: 15}, {width: 15}, {width: 15}, {width: 15}, {width: 15}];
        /* key에 존재하는 데이터를 기준으로 원본 데이터 추출 */
        for(var i in tableList) {
          var dataRow = tableList[i];
          var tempObj = {};
          var existCheck = _.filter(arrHeaderKey, function(o) {
            if(typeof dataRow[o] != "undefined") {
              /* 분류="F33861" 인 경우 */
              if("F33861" == o) {
                var htm = "";
                if(dataRow[o] == 0) {
                  htm = 'KSP';
                } else if(dataRow[o] == 1) {
                  htm = 'KSQ';
                } else if(dataRow[o] == 2) {
                  htm = '기타';
                } else if(dataRow[o] == 3) {
                  htm = '채권';
                } else if(dataRow[o] == 4) {
                  htm = '파생';
                }
                tempObj[o] = htm;
              }
              /* CU수량="F16499", 비중="F34743", 기준가="F15007", CU시가총액="F16588", 등락율="F15004", 현재가="F15001"  인 경우 */
              else if(["F16499", "F34743", "F15007", "F16588", "F15004", "F15001"].includes(o)) {
                tempObj[o] = Number(util.NumtoStr(vm.formatNumber(dataRow[o])));
              } else {
                tempObj[o] = dataRow[o];
              }
            }
          });
          if(Object.keys(tempObj).length > 0) {
            execelDataList[i] = tempObj;
          }
        }
        var excelInfo = {
          excelFileNm: "iNAV 계산기",
          sheetNm: sheetNm,
          dataInfo: execelDataList,
          arrHeaderNm: arrHeaderNm,
          arrHeaderKey: arrHeaderKey,
          arrColsInfo: arrColsInfo
        };
        util.fn_downExcel(excelInfo);
      }
    }
  };
</script>