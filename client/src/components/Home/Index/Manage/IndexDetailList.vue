<template>
  <v-container class="IndexRegi_w">
    <v-layout row wrap class="content_margin con_wrap">
      <v-flex grow class="conWidth_left">
        <v-card flat>
          <!-- 지수 찾기 결과 -->
          <v-card-title primary-title v-if="form.jisuSearchYn == 'Y'">
            <h3 class="headline subtit" pb-0>
              {{ indexBasic.F16002 }} |
              <span class="grey--text">{{ indexBasic.F16013 }}</span>

              <span class="text_result_t">기준일 : {{ indexBasic.fmt_std_date /* 기준일 */ }}</span>
              <span class="sub_txt">Last Updated : {{ indexBasic.fmt_F12506 /* 입회일 */ }}</span>
            </h3>
          </v-card-title>

          <!-- 종목 찾기 결과 -->
          <v-card-title primary-title v-if="form.jisuSearchYn == 'N'">
            <h3 class="headline subtit" pb-0>
              {{ indexBasic.FA16002 }} 편입지수 목록
              <span class="grey--text">{{ form.resultsCnt }} results</span>
              <span class="sub_txt">Last Updated : {{ indexBasic.fmt_F12506 /* 입회일 */ }}</span>
            </h3>
          </v-card-title>

          <table id="tableIndexList" class="tbl_type ver7" width="100%"></table>
        </v-card>
      </v-flex>
      <v-flex class="conWidth_right">
        <IndexDetailQuick
          @fn_getIndexDetailList="fn_getIndexDetailList"
          @fn_getIndexJongmokList="fn_getIndexJongmokList"
        ></IndexDetailQuick>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import $ from 'jquery'
  import dt from 'datatables.net'
  import util from "@/js/util.js";
  import Config from '@/js/config.js';
  import IndexDetailQuick from "@/components/Home/Index/Manage/IndexDetailQuick.vue";
  var tableIndexList = null;
  export default {
    components: {
      IndexDetailQuick,
    },
    data() {
      return {
        progress: true,
        indexBasic: {},
        /* 선택된 지수의 마스터 정보 */
        form: {
          jisuSearch: "" /* quick Menu 에서 지수검색 데이터 */ ,
          jisuSearchYn: "Y",
          jongmokSearch: "" /* quick Menu 에서 종목검색 데이터 */ ,
          resultsCnt: 0
        },
      };
    },
    mounted() {
      var vm = this;
      // console.log( "IndexDetailList.vue -> mounted" );
    },
    created: function() {},
    beforeDestory: function() {},
    methods: {
      /*
       * 조회된 지수데이터를 설정한다.
       * 2019-04-16  bkLove(촤병국)
       */
      fn_getIndexDetailList: function(paramIndexBasic, paramIndexDetailList, paramForm) {
        var vm = this;
        // console.log( "IndexDetail.vue -> fn_getIndexDetailList" );
        if(paramIndexBasic) {
          vm.indexBasic = paramIndexBasic;
        }
        if(paramForm) {
          vm.form = paramForm;
        }
        if($.fn.dataTable.isDataTable('#tableIndexList')) {
          tableIndexList.destroy();
        }
        /* 유형에 따라 컬럼 헤더 변경 */
        tableIndexList = $('#tableIndexList').DataTable({
          "processing": true,
          "serverSide": false,
          "info": false, // control table information display field
          "stateSave": true, //restore table state on page reload,
          "lengthMenu": [
            [10, 20, 50, -1],
            [10, 20, 50, "All"]
          ],
          "scrollY": '75vh',
          paging: false,
          searching: false,
          data: [],
          "columnDefs": [{
            "render": function(data, type, row) {
              return util.formatNumber(data);;
            },
            "targets": [2, 3]
          }],
          columns: [{
            /* 종목코드 */
            "title": "Code",
            "data": "isin_code",
            "orderable": true,
            "width": "12%",
            className: "txt_left"
          },  {
            /* 한글종목명 */
            "title": "Name",
            "data": "F16002",
            "orderable": true,
            "width": "18%",
            className: "txt_left"
          },  {
            /* 전일종가 */
            "title": "BasePrc",
            "data": "F03003",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          },  {
            /* 상장주식수 */
            "title": "Shrs",
            "data": "F30812",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          },  {
            /* 스타일포함비중 */
            "title": "Float rto",
            "data": "F30813",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          },  {
            /* CEILING비중 */
            "title": "Ceiling rto",
            "data": "ceiling_percnt",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          },  {
            /* 유동주식비율 */
            "title": "Factor rto",
            "data": "style_includ_percnt",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          }  ]
        });
        if(paramIndexDetailList) {
          tableIndexList.clear().draw();
          tableIndexList.rows.add(paramIndexDetailList).draw();
          //tableIndexList.draw();
        }
        vm.form.resultsCnt = paramIndexDetailList.length;
      },
      /*
       * 조회된 종목데이터를 설정한다. 
       * 2019-04-16  bkLove(촤병국)
       */
      fn_getIndexJongmokList: function(paramJongmokDataList, paramForm) {
        var vm = this;
        // console.log( "IndexDetail.vue -> fn_getIndexJongmokList" );
        if(paramForm) {
          vm.form = paramForm;
        }
        if($.fn.dataTable.isDataTable('#tableIndexList')) {
          tableIndexList.destroy();
        }
        /* 유형에 따라 컬럼 헤더 변경 */
        tableIndexList = $('#tableIndexList').DataTable({
          "processing": true,
          "serverSide": false,
          "info": false, // control table information display field
          "stateSave": true, //restore table state on page reload,
          "lengthMenu": [
            [10, 20, 50, -1],
            [10, 20, 50, "All"]
          ],
          "scrollY": '72vh',
          paging: false,
          searching: false,
          data: [],
          "columnDefs": [{
            "render": function(data, type, row) {
              return util.formatNumber(data);;
            },
            "targets": [3, 4]
          }],
          columns: [{
            /* ID */
            "title": "ID",
            "data": "isin_code",
            "orderable": true,
            "width": "12%",
            className: "txt_left"
          },  {
            /* 지수명 */
            "title": "지수명",
            "data": "F16002",
            "orderable": true,
            "width": "18%",
            className: "txt_left"
          },  {
            /* 편입비중(%) */
            "title": "편입비중(%)",
            "data": "in_out_rate",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          },  {
            /* shrs */
            "title": "Shrs",
            "data": "F30812",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          },  {
            /* float_rto */
            "title": "Float rto",
            "data": "style_includ_percnt",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          },  {
            /* ceiling_rto */
            "title": "Ceiling rto",
            "data": "ceiling_percnt",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          },  {
            /* factor_rto */
            "title": "Factor rto",
            "data": "F30813",
            "orderable": true,
            "width": "14%",
            className: "txt_right"
          }  ]
        });
        if(paramJongmokDataList) {
          tableIndexList.clear().draw();
          tableIndexList.rows.add(paramJongmokDataList).draw();
          //tableIndexList.draw();
          vm.form.resultsCnt = paramJongmokDataList.length;
        }
      },
      fn_closePop() {
        this.$emit("fn_closePop", "close");
      }
    }
  };
</script>