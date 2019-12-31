<template>
  <v-dialog v-model="indexFixDialog" persistent max-width="500">
    <v-layout row>
      <v-flex xs12>
        <v-card flat>
          <h5>
            <v-card-title ma-0>
              지수조치 현황 ( {{ indexFixData.F16002 }} )
              <v-spacer></v-spacer>

              <v-btn icon dark @click="fn_closePop">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
          </h5>

          <div class="index3pop2_con">
            <v-list subheader two-line>
              <v-list-tile>
                <v-list-tile-title>조치 기준일</v-list-tile-title>
                <v-list-tile-content>{{ indexFixData.fix_date }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </div>

          <v-card flat class="right_menu_w4">
            <v-list subheader two-line>
              <v-subheader class="subheading">기준시총 변동</v-subheader>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>당일( {{indexFixData.now_date}} )</v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{indexFixData.now_date_money}}
                    <p>{{indexFixData.now_date_change_money}}</p>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-content>
                  <v-list-tile-title>당일( {{indexFixData.oper_date}} )</v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{indexFixData.oper_date_money}}
                    <p></p>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>

          <!--종목편출입 테이블-->
          <v-subheader class="subheading">종목편출입</v-subheader>
          <table id="tableIndexFixJongmokInout" class="tbl_type"></table>
          <!--종목편출입 테이블 end-->

          <br />

          <!--지수채용주식수변경테이블-->
          <v-subheader class="subheading">지수채용주식수변경</v-subheader>
          <table id="tableIndexFixModify" class="tbl_type"></table>
          <!--지수채용주식수변경테이블 end-->
        </v-card>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>


<script>
  import $ from 'jquery'
  import dt from 'datatables.net'
  import Config from '@/js/config.js';
  import util from "@/js/util.js";
  var tableIndexFixJongmokInout = null;
  var tableIndexFixModify = null;
  export default {
    props: ["indexBasic", "indexFixDialog"],
    data() {
      return {
        notifications: false,
        sound: false,
        video: false,
        invites: false,
        dialog: false,
        search: "",
        indexFixData: {},
        indexFixJongmokInoutList: [],
        indexFixModifyList: []
      };
    },
    created: function() {
      var vm = this;
    },
    mounted() {
      if(this.indexBasic) {
        this.fn_getIndexFixList();
      }
    },
    methods: {
      /*
       * 지수조치현황 팝업창을 종료한다.
       * 2019-04-16  bkLove(촤병국)
       */
      fn_closePop: function() {
        var vm = this;
        vm.$emit("fn_closePop", false);
      },
      /*
       * 선택한 지수 조치내역을 조회한다.
       * 2019-04-16  bkLove(촤병국)
       */
      fn_getIndexFixList: function() {
        var vm = this;
        vm.$root.progresst.open();
        util.axiosCall({
          "url": Config.base_url + "/user/index/getIndexFixList",
          "data": vm.indexBasic,
          "method": "post"
        }, function(response) {
          try {
            vm.$root.progresst.close();
            if(response && response.data) {
              var msg = (response.data.msg ? response.data.msg : "");
              if(!response.data.result) {
                if(msg) {
                  if(vm.$root.confirmt.open('확인', msg, {}, 1)) {}
                  return false;
                }
              }
              /* 지수조치 현황의 기본정보 */
              var indexFixData = response.data.indexFixData;
              if(indexFixData) {
                vm.indexFixData = indexFixData;
              }
              /* 지수조치 종목 편출입 정보 */
              tableIndexFixJongmokInout = $('#tableIndexFixJongmokInout').DataTable({
                "processing": true,
                "serverSide": false,
                "info": false, // control table information display field
                "stateSave": true, //restore table state on page reload,
                "lengthMenu": [
                  [10, 20, 50, -1],
                  [10, 20, 50, "All"]
                ],
                paging: false,
                searching: false,
                data: [],
                "columnDefs": [{
                  "targets": 0,
                  className: "dt-left"
                }, {
                  "targets": 2,
                  className: "dt-right"
                }, ],
                columns: [{
                  "title": "code",
                  "data": "code",
                  "orderable": true,
                  className: "txt_left"
                }, /* code */ {
                  "title": "종목명",
                  "data": "name",
                  "orderable": true,
                  className: "txt_left"
                }, /* 종목명 */ {
                  "title": "구분",
                  "data": "gubun_name",
                  "orderable": true,
                  className: "txt_right"
                }, /* 구분 */ {
                  "title": "비중(%)",
                  "data": "rate",
                  "orderable": true,
                  className: "txt_right"
                }, /* 비중(%) */ ]
              });
              /* 지수채용 주식수 변경 정보 */
              tableIndexFixModify = $('#tableIndexFixModify').DataTable({
                "processing": true,
                "serverSide": false,
                "info": false, // control table information display field
                "stateSave": true, //restore table state on page reload,
                "lengthMenu": [
                  [10, 20, 50, -1],
                  [10, 20, 50, "All"]
                ],
                paging: false,
                searching: false,
                data: [],
                columns: [{
                  "title": "code",
                  "data": "code",
                  "orderable": true,
                  className: "txt_left"
                }, /* 종목코드 */ {
                  "title": "종목명",
                  "data": "name",
                  "orderable": true,
                  className: "txt_left"
                }, /* 한글종목명 */ {
                  "title": vm.indexFixData.now_date,
                  "data": "now_date_money",
                  "orderable": true,
                  className: "txt_right"
                }, /* 당일 금액 */ {
                  "title": vm.indexFixData.oper_date,
                  "data": "prev_date_money",
                  "orderable": true,
                  className: "txt_right"
                }, /* 전일 금액 */ {
                  "title": "변경분",
                  "data": "in_out_money",
                  "orderable": true,
                  className: "txt_right"
                }, /* 변경분 */ ]
              });
              /* 지수조치 종목 편출입 정보 */
              var indexFixJongmokInoutList = response.data.indexFixJongmokInoutList;
              if(indexFixJongmokInoutList && indexFixJongmokInoutList.length > 0) {
                vm.indexFixJongmokInoutList = indexFixJongmokInoutList;
                tableIndexFixJongmokInout.clear().draw();
                tableIndexFixJongmokInout.rows.add(indexFixJongmokInoutList).draw();
                tableIndexFixJongmokInout.draw(indexFixJongmokInoutList);
              }
              /* 지수채용 주식수 변경 정보 */
              var indexFixModifyList = response.data.indexFixModifyList;
              if(indexFixModifyList && indexFixModifyList.length > 0) {
                vm.indexFixModifyList = indexFixModifyList;
                tableIndexFixModify.clear().draw();
                tableIndexFixModify.rows.add(indexFixModifyList).draw();
                tableIndexFixModify.draw(indexFixModifyList);
              }
            }
          } catch (ex) {
            vm.$root.progresst.close();
            console.log("error", ex);
          }
        }, function(error) {
          vm.$root.progresst.close();
          if(error) {
            if(error && vm.$root.confirmt.open('확인', error, {}, 4)) {}
          }
        });
      }
    }
  };
</script>