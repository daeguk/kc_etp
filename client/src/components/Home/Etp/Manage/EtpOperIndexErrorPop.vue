<template>
  <v-container>
    <v-dialog v-model="showDialog" persistent max-width="800">
      <v-card flat ma-3>
        <h5>
          <v-card-title ma-0>
            지수 오류 내역 ({{indexBasic.F16002}} Index)
            <v-spacer></v-spacer>
            <v-btn icon dark @click="fn_closePop">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
        </h5>
        <v-card flat>
          <table id="tableIndexErrorList" class="display table01_w" style="width:100%"></table>
        </v-card>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import $ from 'jquery'
  import dt from 'datatables.net'
  import util from "@/js/util.js";
  import Config from '@/js/config.js';
  var tableIndexErrorList = null;
  export default {
    props: ["showDialog", "paramData"],
    data() {
      return {
        indexBasic: {},
        /* 선택된 지수의 마스터 정보 */
        nowDate: new Date().getFullYear() + "." + (parseInt(new Date().getMonth()) + 1) + "." + new Date().getDate(),
      };
    },
    mounted() {
      var vm = this;
      tableIndexErrorList = $('#tableIndexErrorList').DataTable({
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
        "columnDefs": [{}],
        columns: [{
          /* err_id */
          "data": "err_id",
          "orderable": true,
          "width": "120",
          "title": "err_id"
        },  {
          /* 날짜 */
          "data": "err_date",
          "orderable": true,
          "width": "80",
          "title": "날짜"
        },  {
          /* 발생시간 */
          "data": "err_time",
          "orderable": true,
          "width": "80",
          "title": "발생시간"
        },  {
          /* 조치시간 */
          "data": "fix_time",
          "orderable": true,
          "width": "80",
          "title": "조치시간"
        },  {
          /* 오류내용 */
          "data": "err_content",
          "orderable": true,
          "width": "200",
          "title": "오류내용"
        },  {
          /* 비고 */
          "data": "remark",
          "orderable": true,
          "width": "150",
          "title": "비고"
        },  ]
      });
      vm.fn_getIndexErrorList();
      // console.log( "IndexErrorList.vue -> mounted" );
    },
    created: function() {},
    beforeDestory: function() {},
    methods: {
      /*
       * 지수 목록에서 선택된 데이터를 조회한다.
       * 2019-04-16  bkLove(촤병국)
       */
      fn_getIndexErrorList: function() {
        var vm = this;
        vm.$root.progresst.open();
        util.axiosCall({
          "url": Config.base_url + "/user/etp/getEtpOperIndexError",
          "data": vm.paramData,
          "method": "post"
        }, function(response) {
          vm.$root.progresst.close();
          try {
            if(response && response.data) {
              var indexBasic = response.data.indexBasic;
              if(indexBasic) {
                vm.indexBasic = indexBasic;
              }
              var dataList = response.data.dataList;
              if(dataList) {
                tableIndexErrorList.clear().draw();
                tableIndexErrorList.rows.add(dataList).draw();
                tableIndexErrorList.draw();
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
      fn_closePop() {
        this.$emit("fn_closePop", "close");
      }
    }
  };
</script>