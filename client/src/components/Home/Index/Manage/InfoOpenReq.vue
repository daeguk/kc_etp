<template>
    <v-container>
        <v-layout justify-center column fill-height>
            <v-flex >
        <v-card>
            <v-card flat>
                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">정보공개 요청처리</h3>
                        <div
                            style="color:grey"
                        >지수 구성종목의 유동비율, cap비율 및 다양한 factor 비율과 기준시가총액 등 지수의 상세 정보를 요청자와 공유합니다.</div>
                    </div>
                </v-card-title>
            </v-card>

            <table id="index_table" class="display table01_w">
                     <thead>
                        <tr>
                            <th>reqID</th>
                            <th>신청기관</th>
                            <th>지수</th>
                            <th>지수코드</th>
                            <th>요청일자</th>
                            <th>요청처리</th>
                        </tr>
                    </thead>
            </table>
        </v-card> 
         </v-flex>    
         <v-flex>
              <v-dialog
        v-model="dialog"
        max-width="450"
      >
        <v-card class="pop_alert">
        <h6><v-icon class="confirm">help</v-icon> Confirm</h6>
        <!--h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
        <h6><v-icon class="error_1">error</v-icon> Error</h6-->
          <v-card-title>정보 공개 요청 {{message}} 하시겠습니까?</v-card-title>
  
         
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              class="pop_alret_yesbtn"
              depressed
              dark
              small
              @click="updateIndexOpenYn('Y');"
            >
              예
            </v-btn>
  
            <v-btn
              class="pop_alret_nobtn"
              depressed
              dark
              small
              @click="updateIndexOpenYn('N');"
            >
              아니요
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
         </v-flex>
         
        </v-layout>


             
    </v-container>    

</template>


<script>

import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import Config from "@/js/config.js";
var reqTable;

export default {
    props: [],
    data() {
        return {
            selected: [],
            dialog: false,
            message: '승인',
            reqFlag: true,
            results: [],
        };
    },
    mounted: function() {
        var vm = this;
         
         $('#index_table, tbody').on('click', 'button', function () {
            var data = reqTable.row($(this).parents('tr')).data();
           // alert("Name = " + JSON.stringify(data));
            if ($(this).attr('name') == "ok") {
                vm.dialogOpen('1', data);
            } else {
                vm.dialogOpen('2', data);
            }
        
        });

         reqTable = $('#index_table').DataTable( {
                    "processing": true,
                    "serverSide": false,
                    "info": true,   // control table information display field
                    "stateSave": true,  //restore table state on page reload,
                    "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                    paging: false,
                    searching: false,
                    data : [],
                            
                    columns: [
                        { "data": "REG_ID", "orderable": true },
                        { "data": "INST_NAME", "orderable" : true },
                        { "data": "F16002", "orderable" : true },
                        { "data": "F16013", "orderable" : true },
                        { "data": "REG_TIME", "orderable" : true },
                        { "data": null, "align":"center", className: 'dt-body-center', defaultContent:"<div class='tooltip'><button type='button' name='ok' class='btn_icon v-icon material-icons '>thumb_up_alt</button><span class='tooltiptext' style='width:50px;'>승인</span></div><div class='tooltip'><button type='button' name='no' color='grey' class='btn_icon v-icon material-icons grey'>thumb_down_alt</button><span class='tooltiptext' style='width:50px;'>거절</span></div>" } 
                    ]
        });
        
        vm.getInfoOpenReqList();
    },
    created: function() {
    },
    beforeDestroy() {},
    methods: {
        getInfoOpenReqList: function() {
            console.log("getInfoOpenReqList");
            var vm = this;

            axios.get(Config.base_url + "/user/index/getinfoopenreqlist", {
                    params: {
                        // "bbs_id" : vm.bbs_id,
                        // "seloption" : vm.seloption,
                        // "searchinfo" : vm.searchinfo,
                        // "curPage": vm.curPage,
                        // "perPage": vm.perPage
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("해당 신청현황이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        //console.log("response=" + JSON.stringify(items));
                        vm.results = items;
                        
                         reqTable.clear().draw();
                         reqTable.rows.add(vm.results).draw();
                    }
                });
        }, 
        dialogOpen: function(flag, item) {
            this.selected = item;
            if (flag == '1') {
                this.message = '승인';
                this.reqFlag = true;
            } else {
                this.message = '거절';
                this.reqFlag = false; 
            }
            this.dialog = true;
        },
        updateIndexOpenYn: function(flag) {
            this.dialog = false;

            if(flag == 'Y') {
                console.log("JISU_ID="+this.selected.F16013);
                axios.post(Config.base_url + '/user/index/updateIndexOpenYn', {
                    params : {
                        flag : flag,
                        reqFlag : this.reqFlag,
                        JISU_ID : this.selected.F16013,
                        INST_CD : this.selected.INST_CD
                    }
                }).then(response => {
                  
                    this.getInfoOpenReqList();
                })
            }
        }
    }
};
</script>
<style scoped>
table.v-table tbody td,
table.v-table tbody th {
    height: 30px;
}
</style>
