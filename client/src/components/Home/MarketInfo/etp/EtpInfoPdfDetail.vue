<template>
  <v-card flat height="560">
    <v-layout row wrap>
      <v-flex grow>
        <v-card flat>
          <div class="title01_w case3">
            <v-card-title primary-title>
              <div class="title_wrap01">
                <h3 class="headline mb-0">
                  {{ searchParam.F16002 }} |
                  <span class="grey--text">({{ searchParam.F16013 }})</span>
                  <span class="pdf_calendar">
                    <v-menu
                      ref="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="searchParam.show_date"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="searchParam.show_date"
                        label="Picker in menu"
                        append-icon="event"
                        box
                        outline
                        @keyup.enter="$refs.menu2.save(searchParam.show_date);fn_getEtpOerPdf( 'N' )"
                        widh="100%"
                      ></v-text-field>
                      <v-date-picker
                        v-model="searchParam.show_date"
                        no-title
                        scrollable
                        locale="ko"
                        @input="$refs.menu2.save(searchParam.show_date);fn_getEtpOerPdf( 'N' )"
                      ></v-date-picker>
                    </v-menu>
                  </span>
                  <!--v-text-field
                                v-model="searchParam.search_nm"
                                class="pdf_search ver2"
                                single-line
                                hide-details
                                :readonly="true"
                  ></v-text-field-->
                </h3>
                <div class="right_btn">
                  <v-btn icon @click="fn_close">
                    <v-icon>close</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-card-title>
          </div>
        </v-card>
        <v-card flat>
          <table id="tblPdfList" class="tbl_type ver7"></table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<style scoped>
.v-menu__content{position:fixed !important;}
</style>

<script>
  import $ from "jquery";
  import dt from "datatables.net";
  import util from "@/js/util.js";
  import Config from "@/js/config.js";
  var tblPdfList = null;
  export default {
    props: ["paramData", "showEtpInfoPdfDetail"],
    data() {
      return {
        stateInfo: {
          pageState: "pdf" /* pdf - PDF 관리, pdfByRate - 비중변경현황 */ ,
          totWidth: 0
        },
        arrShowColumn: [],
        arrShowColumnDef: [],
        searchParam: {
          show_date: "",
          search_date: "",
          search_nm: "",
          F16493: "",
          F16012: ""
        },
        pdfData: {},
        emergency_exist_yn: "N",
      };
    },
    mounted: function() {
      var vm = this;
      // console.log( ">>>>>>>>>>>>>>>>>>>> EtpOperPdfDetail.vue mounted");
      // console.log( vm.paramData );
      vm.pdfData = vm.paramData;
      vm.fn_init();
    },
    created: function() {},
    beforeDestory: function() {},
    methods: {
      fn_init() {
        var vm = this;
        if(vm.pdfData) {
          vm.searchParam.F16002 = vm.pdfData.F16002; /* 한글종목명 */
          vm.searchParam.F16013 = vm.pdfData.F16013; /* 단축코드 */
          vm.searchParam.F16493 = vm.pdfData.F16493; /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
          vm.searchParam.F16012 = vm.pdfData.F16012; /* 국제표준코드 */
          vm.searchParam.search_nm = vm.searchParam.F16002 + "(" + vm.searchParam.F16013 + ")"; /* 한글종목명 / 단축코드 */
          /* tm_pdf_basic 에서 최근 F12506(일자) 정보를 조회한다. */
          vm.fn_getTmPdfBaiscMaxF12506().then(function(e1) {
            if(!e1) {
              return false;
            }
            vm.fn_setTableInfo();
            vm.fn_getEtpOerPdf('Y');
          });
        }
      },
      /*
       * ETP PDF 정보를 조회한다.
       * 2019-05-03  bkLove(촤병국)
       */
      fn_getEtpOerPdf(initYn) {
        var vm = this;
        // console.log("EtpOperPdf.vue -> fn_getEtpOperPdf");
        var url = Config.base_url + "/user/etp/getEtpOperPdf";
        if(tblPdfList) {
          tblPdfList.clear().draw();
        }
        if(vm.pdfData && Object.keys(vm.pdfData).length > 0) {
          vm.searchParam.search_date = vm.searchParam.show_date.replace(/-/g, "");
          vm.searchParam.search_date = vm.searchParam.search_date.replace(/\./g, "");
          vm.searchParam.isInstCd = "N"; /* 기관에 속한 정보만 노출하는지 */
          if(initYn == "N") {
            if(!vm.searchParam.F16012 /* 국제표준코드 */ || !vm.searchParam.F16493 /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */ ) {
              vm.$root.confirmt.open('확인', '기준코드가 존재하지 않습니다.', {}, 1);
              return false;
            }
          }
          vm.$root.progresst.open();
          axios.post(url, {
            data: vm.searchParam
          }).then(function(response) {
            // console.log(response);
            vm.$root.progresst.close();
            if(response.data) {
              var msg = (response.data.msg ? response.data.msg : "");
              if(!response.data.result) {
                if(msg) {
                  vm.$root.confirmt.open('확인', msg, {}, 1);
                  return false;
                }
              }
              var dataList = response.data.dataList;
              if(dataList && dataList.length > 0) {
                tblPdfList.rows.add(dataList).draw();
              }
            }
          }).catch(error => {
            vm.$root.progresst.close();
            vm.$root.confirmt.open('확인', '서버로 부터 응답을 받지 못하였습니다.', {}, 4);
          });
        }
      },
      /*
       *  테이블 기본정보를 설정한다.
       *  2019-05-03  bkLove(촤병국)
       */
      fn_setTableInfo(arrCustomizeColumn) {
        var vm = this;
        var tableObj = {
          processing: true,
          serverSide: false,
          info: false, // control table information display field
          stateSave: true, //restore table state on page reload,
          lengthMenu: [
            [10, 20, 50, -1],
            [10, 20, 50, "All"]
          ],
          "scrollY": '50vh',
          paging: false,
          searching: false,
          data: [],
          autoWidth: false
        };
        /* pdf - PDF 관리, pdfByRate - 비중변경현황 */
        /* [PDF 관리] 를 선택한 경우 */
        if(vm.stateInfo.pageState == "pdf") {
          vm.fn_setArrShowColumn(["fmt_F12506" /* 입회일 - Date */ , "status" /* 상태 */ , "F33861" /* ETF시장구분 - 시장구분 -  */ , "F16316" /* 구성종목코드 - 종목코드 */ , "F16004" /* 해외시장종목명 - 종목명 */ , "F16499" /* 1CU단위증권수 - CU SHrs */ , "F34840" /* 액면금액설정현금액 - 액면금액 */ , "F16588" /* 평가금액 - 평가금액 */ , "fmt_F34743" /* ETF_PDF비중 - 비중 */ ]);
        }
        if($.fn.DataTable.isDataTable("#tblPdfList")) {
          $("#tblPdfList").DataTable().destroy();
          $("#tblPdfList").empty();
        }
        if(vm.stateInfo.totWidth > 900) {
          $("#tblPdfList").attr("style", "table-layout: fixed;");
          tableObj.scrollX = true;
        } else {
          $("#tblPdfList").attr("style", " ");
          tableObj.scrollX = false;
        }
        tableObj.columns = vm.arrShowColumn;
        tableObj.columnDefs = vm.arrShowColumnDef;
        tblPdfList = $("#tblPdfList").DataTable(tableObj);
      },
      /*
       *  테이블에서 그래프 영역에 출력될 버튼이미지를 렌더링한다.
       *  2019-05-03  bkLove(촤병국)
       */
      fn_getGraphInfo(param) {
        var graphContent = "";
        var divClass = "tooltip";
        var btnClass = "btn_icon v-icon material-icons";
        var btnSpanClass = "tooltiptext";
        var btnSpanStyle = "width:70px;";
        var btnId = "";
        var btnContent = "";
        var btnSpanContent = "";
        if(!param) {
          return graphContent;
        }
        if(typeof param.btnId === "undefined" || typeof param.btnContent === "undefined") {
          return graphContent;
        }
        if(typeof param.btnSpanContent != "undefined") {
          btnSpanContent = param.btnSpanContent;
        }
        btnId = param.btnId;
        btnContent = param.btnContent;
        graphContent += '<div class="' + divClass + '">';
        graphContent += '<button    id="' + btnId + '" ';
        graphContent += '           type="button" ';
        graphContent += '           class="' + btnClass + '" ';
        graphContent += '>' + btnContent + '</button>';
        graphContent += '<span class="' + btnSpanClass + '" style="' + btnSpanStyle + '" >' + btnSpanContent + '</span>';
        graphContent += '</div>';
        return graphContent;
      },
      /*
       *  노출할 컬럼 배열정보를 통해 테이블에 컬럼을 설정한다.
       *  2019-05-03  bkLove(촤병국)
       */
      fn_setArrShowColumn(arrTemp) {
        var vm = this;
        var arrColumn = [{
          /* Date */
          'name': 'fmt_F12506',
          'data': 'fmt_F12506',
          'width': '7%',
          'orderable': true,
          'className': 'dt-body-center',
          'title': 'Date'
        },  {
          /* 상태 */
          'name': 'status',
          'data': 'status',
          'width': '5%',
          'orderable': true,
          'className': 'dt-body-center',
          'title': '상태'
        },  {
          /* 시장구분 */
          'name': 'F33861',
          'data': 'F33861',
          'width': '6%',
          'orderable': true,
          'className': 'dt-body-center',
          'title': '시장구분'
        },  {
          /* 종목코드 */
          'name': 'F16316',
          'data': 'F16316',
          'width': '9%',
          'orderable': true,
          'className': 'dt-body-left',
          'title': '종목코드'
        },  {
          /* 종목명 ( 해외시장종목명 ) */
          'name': 'F16004',
          'data': 'F16004',
          'width': '19%',
          'orderable': true,
          'className': 'dt-body-left',
          'title': '종목명'
        },  {
          /* CU SHrs */
          'name': 'F16499',
          'data': 'F16499',
          'width': '9%',
          'orderable': true,
          'className': 'dt-body-right',
          'title': 'CU SHrs'
        },  {
          /* 액면금액 */
          'name': 'F34840',
          'data': 'F34840',
          'width': '9%',
          'orderable': true,
          'className': 'dt-body-right',
          'title': '액면금액'
        },  {
          /* 평가금액 */
          'name': 'F16588',
          'data': 'F16588',
          'width': '9%',
          'orderable': true,
          'className': 'dt-body-right',
          'title': '평가금액'
        },  {
          /* 비중 */
          'name': 'fmt_F34743',
          'data': 'fmt_F34743',
          'width': '6%',
          'orderable': true,
          'className': 'dt-body-right',
          'title': '비중 (%)'
        },  ];
        var arrColumnDef = [
          /* 상태 */
          {
            'name': 'status',
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
          },
          /* CU SHrs */
          {
            'name': 'F16499',
            "render": function(data, type, row, meta) {
              let htm = "";
              htm += util.formatNumber(data);
              return htm;
            }
          },
          /* 액면금액 */
          {
            'name': 'F34840',
            "render": function(data, type, row, meta) {
              let htm = "";
              htm += util.formatNumber(data);
              return htm;
            }
          },
          /* 평가금액 */
          {
            'name': 'F16588',
            "render": function(data, type, row, meta) {
              let htm = "";
              htm += util.formatNumber(data);
              return htm;
            }
          },
        ];
        vm.stateInfo.totWidth = 0;
        vm.arrShowColumn = [];
        vm.arrShowColumnDef = [];
        if(arrTemp && arrTemp.length > 0) {
          /* 화면에 노출할 arrTemp 배열을 통해 arrShowColumn 에 노출할 컬럼 정보를 넣는다. */
          arrTemp.forEach(function(e, i) {
            var same = arrColumn.filter(function(o, p) {
              return o.name === e;
            });
            if(same.length > 0) {
              vm.stateInfo.totWidth += Number(same[0].width);
              vm.arrShowColumn.push(same[0]);
            }
          });
        }
        if(vm.arrShowColumn.length > 0) {
          /* 설정한 columnDefs 가 존재하는 경우 */
          if(arrColumnDef.length > 0) {
            /* 화면에 노출할 arrTemp 배열 과 일치하는 columnDefs 정보를 넣는다. */
            vm.arrShowColumn.forEach(function(e, i) {
              var same = arrColumnDef.filter(function(o, p) {
                return o.name === e.name;
              });
              if(same.length > 0) {
                same[0].targets = [i];
                vm.arrShowColumnDef.push(same[0]);
              }
            });
          }
        }
      },
      /*
       * tm_pdf_basic 에서 최근 F12506(일자) 정보를 조회한다.
       * 2019-05-03  bkLove(촤병국)
       */
      fn_getTmPdfBaiscMaxF12506() {
        var vm = this;
        return new Promise(function(resolve, reject) {
          console.log("fn_getTmPdfBaiscMaxF12506 called");
          // 이미 검색일자가 존재하는 경우 조회하지 않게 함.
          if(vm.searchParam.show_date) {
            resolve(true);
          } else {
            vm.$root.progresst.open();
            util.axiosCall({
              "url": Config.base_url + "/user/etp/getTmPdfBaiscMaxF12506",
              "data": vm.searchParam,
              "method": "post"
            }, function(response) {
              try {
                if(response.data) {
                  var msg = (response.data.msg ? response.data.msg : "");
                  if(!response.data.result) {
                    if(msg) {
                      vm.$root.confirmt.open('확인', msg, {}, 1);
                      resolve(false);
                    }
                  }
                  if(response.data.dateInfo) {
                    vm.searchParam.show_date = response.data.dateInfo.fmt_F12506;
                  }
                }
                vm.$root.progresst.close();
                resolve(true);
              } catch (ex) {
                vm.$root.progresst.close();
                console.log("error", ex);
                resolve(false);
              }
            }, function(error) {
              vm.$root.progresst.close();
              if(error) {
                vm.$root.confirmt.open('확인', msg, {}, 4);
              }
              resolve(false);
            });
          }
        }).catch(function(e) {
          console.log(e);
          vm.$root.progresst.close();
          vm.$root.confirmt.open('확인', '서버로 부터 응답을 받지 못하였습니다.', {}, 4);
        })
      },
      /*
       * 팝업창을 종료한다.
       * 2019-05-03  bkLove(촤병국)
       */
      fn_close() {
        var vm = this;
        vm.$emit("fn_closePop", "close");
      },
    }
  };
</script>