<template>
  <v-container>
    <v-flex>
      <v-dialog v-model="showDialog" persistent max-width="1100" max-height="800">
        <v-card class="mx-auto">
          <v-card flat class="listset_pop ver2">
            <h5>
              <v-card-title ma-0>
                PDF수정 내역
                <v-spacer></v-spacer>
                <v-btn icon @click="fn_close">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-card-title>
            </h5>

            <v-card flat>
              <v-flex xs12 v-for="subData in allDataList" :key='"step3_"  + subData.etf_F16012'>
                <div class="pdfm_title">
                  {{ subData.etf_F16002 /* ETF 한글종목명 */ }}
                  <span>{{ subData.etf_F16013 /* ETF 단축코드 */ }}</span>
                </div>

                <table
                  v-bind:id='"step3_" + subData.etf_F16012'
                  class="tbl_type ver7"
                  style="width:100%"
                >
                  <colgroup>
                    <col width="18%" />
                    <!-- email -->
                    <col width="8%" />
                    <!-- 시간 -->
                    <col width="6%" />
                    <!-- 상태 -->
                    <col width="10%" />
                    <!-- CODE -->
                    <col width="18%" />
                    <!-- 종목 -->

                    <col width="10%" />
                    <!-- CU shrs -->
                    <col width="10%" />

                    <col width="10%" />
                    <!-- 액면금액 -->
                    <col width="10%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="txt_center" rowspan="2">email</th>
                      <th class="txt_center" rowspan="2">시간</th>
                      <th class="txt_center" rowspan="2">상태</th>
                      <th class="txt_center" rowspan="2">CODE</th>
                      <th class="txt_left" rowspan="2">종목</th>
                      <th class="txt_center" colspan="2">CU shrs</th>
                      <th class="txt_center" colspan="2">액면금액</th>
                    </tr>
                    <tr>
                      <th class="txt_right">변경전</th>
                      <th class="txt_right">변경후</th>
                      <th class="txt_right">변경전</th>
                      <th class="txt_right">변경후</th>
                    </tr>
                  </thead>
                </table>
              </v-flex>
            </v-card>
          </v-card>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-container>
</template>


<script>
  import $ from "jquery";
  import _ from "lodash";
  import dt from "datatables.net";
  import util from "@/js/util.js";
  import Config from "@/js/config.js";
  var tblPdfHistList = null;
  export default {
    props: ["showDialog", "paramData"],
    data() {
      return {
        searchParam: {
          now_date: "",
          search_date: "",
          search_nm: "",
          F16493: "",
          F16012: "",
        },
        F16002: "",
        pdfData: {},
        allDataList: []
      };
    },
    mounted: function() {
      var vm = this;
      // console.log( ">>>>>>>>>>>>>>>>>>>> EtpOperPdfHistPop.vue mounted");8
      vm.fn_init();
    },
    created: function() {
      var vm = this;
    },
    beforeDestory: function() {
      var vm = this;
    },
    methods: {
      fn_init() {
        var vm = this;
        new Promise(function(resolve, reject) {
          if(vm.paramData) {
            vm.searchParam.F16583 = vm.paramData.F16583; /* 사무수탁회사번호 */
            vm.searchParam.F16002 = vm.paramData.F16002; /* 한글종목명 */
            vm.searchParam.F16013 = vm.paramData.F16013; /* 단축코드 */
            vm.searchParam.F16493 = vm.paramData.F16493; /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
            vm.searchParam.F16012 = vm.paramData.F16012; /* 국제표준코드 */
          }
          resolve();
        }).catch(function(e) {
          console.log(e);
        }).then(function() {
          vm.searchParam.now_date = new Date().getFullYear() + _.padStart((parseInt(new Date().getMonth()) + 1), 2, '0') + _.padStart(new Date().getDate(), 2, '0');
          vm.searchParam.isInstCd = "Y"; /* 기관에 속한 정보만 노출하는지 */
          vm.fn_getEtpOperPdfEmergencyHistNow();
        });
      },
      /*
       * ETP PDF 정보를 조회한다.
       * 2019-05-03  bkLove(촤병국)
       */
      fn_getEtpOperPdfEmergencyHistNow() {
        var vm = this;
        // console.log("EtpOperPdfEmergencyModifyPop -> fn_getEtpOperPdfEmergencyHistNow");            
        vm.$root.progresst.open();
        util.axiosCall({
          "url": Config.base_url + "/user/etp/getEtpOperPdfEmergencyHistNow",
          "data": vm.searchParam,
          "method": "post"
        }, function(response) {
          try {
            vm.$root.progresst.close();
            if(response.data) {
              var msg = (response.data.msg ? response.data.msg : "");
              if(!response.data.result) {
                if(msg) {
                  vm.$root.confirmt.open('확인', msg, {}, 1);
                  return false;
                }
              }
              if(response.data.allDataList.length > 0) {
                vm.allDataList = response.data.allDataList;
                vm.step = 3;
                if(vm.allDataList.length > 0) {
                  var items = [];
                  for(let subData of vm.allDataList) {
                    if($.fn.DataTable.isDataTable('#step3_' + subData.etf_F16012)) {
                      $('#step3_' + subData.etf_F16012).DataTable().destroy();
                    }
                  }
                  for(let subData of vm.allDataList) {
                    vm.$nextTick().then(() => {
                      if($.fn.DataTable.isDataTable('#step3_' + subData.etf_F16012)) {
                        $('#step3_' + subData.etf_F16012).DataTable().destroy();
                      }
                      items = subData.data;
                      console.log("subData.etf_F16012=[" + subData.etf_F16012 + "]");
                      console.log("items");
                      console.log(items);
                      $('#step3_' + subData.etf_F16012).DataTable({
                        "processing": true,
                        "serverSide": false,
                        "info": false, // control table information display field
                        "stateSave": true, //restore table state on page reload,
                        "lengthMenu": [
                          [10, 20, 50, -1],
                          [10, 20, 50, "All"]
                        ],
                        "scrollY": (items.length >= 12 ? '27vh' : ''),
                        select: {
                          style: 'single',
                          selector: 'td:first-child'
                        },
                        paging: false,
                        searching: false,
                        data: items,
                        ordering: false,
                        "columnDefs": [{
                          /* 상태 */
                          "render": function(data, type, row) {
                            var htm = "";
                            if(typeof row.status != "undefined") {
                              if(row.status == "insert") {
                                htm = "신규";
                              } else {
                                htm = "변경";
                              }
                            }
                            return htm;
                          },
                          "targets": 2
                        }, {
                          /* CU shrs (변경전) */
                          "render": function(data, type, row) {
                            var htm = "";
                            if(typeof row.status != "undefined") {
                              if(row.status == "insert") {
                                htm = "-";
                              } else {
                                htm = util.formatNumber(data);
                              }
                            }
                            return htm;
                          },
                          "targets": 5
                        }, {
                          /* CU shrs (변경후) */
                          "render": function(data, type, row) {
                            var htm = "";
                            htm += util.formatNumber(data);
                            return htm;
                          },
                          "targets": 6
                        }, {
                          /* 액면금액 (변경전) */
                          "render": function(data, type, row) {
                            var htm = "";
                            if(typeof row.status != "undefined") {
                              if(row.status == "insert") {
                                htm = "-";
                              } else {
                                htm = util.formatNumber(data);
                              }
                            }
                            return htm;
                          },
                          "targets": 7
                        }, {
                          /* 액면금액 (변경후) */
                          "render": function(data, type, row) {
                            var htm = "";
                            htm += util.formatNumber(data);
                            return htm;
                          },
                          "targets": 8
                        }, ],
                        columns: [{
                          /* 이메일 */
                          "data": "email",
                          "width": "18%",
                          "orderable": false,
                          "className": "txt_left"
                        },  {
                          /* 시간 */
                          "data": "fmt_reg_time",
                          "width": "8%",
                          "orderable": false,
                          "className": "txt_center"
                        },  {
                          /* 상태 */
                          "data": "status",
                          "width": "6%",
                          "orderable": false,
                          "className": "txt_center"
                        },  {
                          /* 코드 */
                          "data": "F16316",
                          "width": "10%",
                          "orderable": false,
                          "className": "txt_left"
                        },  {
                          /* 종목명 */
                          "data": "F16004",
                          "width": "18%",
                          "orderable": false,
                          "className": "txt_left"
                        },  {
                          /* CU shrs (변경전) */
                          "data": "F16499_prev",
                          "width": "10%",
                          "orderable": false,
                          "className": "txt_right"
                        },  {
                          /* CU shrs */
                          "data": "F16499",
                          "width": "10%",
                          "orderable": false,
                          "className": "txt_right"
                        },  {
                          /* 액면금액 (변경전) */
                          "data": "F34840_prev",
                          "width": "10%",
                          "orderable": false,
                          "className": "txt_right"
                        },  {
                          /* 액면금액 */
                          "data": "F34840",
                          "width": "10%",
                          "orderable": false,
                          "className": "txt_right"
                        },  ]
                      }).draw();
                    });
                  }
                }
              }
            }
          } catch (ex) {
            vm.$root.progresst.close();
            console.log("error", ex);
          }
        }, function(error) {
          vm.$root.progresst.close();
          if(error && vm.$root.confirmt.open('확인', error, {}, 4)) {}
        });
      },
      fn_close() {
        this.$emit("fn_closePop", "close");
      }
    }
  };
</script>