<template>
  <v-container fluid grid-list-md pa-0 mb-4>
  <v-layout row wrap>
    <v-flex xs6> 
      <!--table1 -->
      <div class="indexinfo_box01 ver1">
        <h4 class="mb-0">지수정보 구독 현황</h4>
          <table id="subscribe_table" class="tbl_type" style="width:100%">
            <colgroup>
                <col width="35%">
                <col width="35%">
                <col width="30%">
            </colgroup>
            <thead>
            <tr>
                <th class="txt_left">기관명</th>
                <th class="txt_right">구독지수</th>
                <th></th>
            </tr>
            </thead>             
        </table>
  

  </div>
      <!--table1 end-->
    </v-flex>
    <v-flex xs6>
      <!--tabel2 -->
       <div class="indexinfo_box01 ver1">
        <h4 class="mb-0">지수정보 신청 현황</h4>
        <table id="req_table" class="tbl_type" style="width:100%">
            <colgroup>
                <col width="30%">
                <col width="30%">
                <col width="40%">
            </colgroup>
            <thead>
            <tr>
                <th class="txt_left">신청기관</th>
                <th class="txt_left">요청일자</th>
                <th>요청처리</th>
            </tr>
            </thead> 
            <tbody>
                <tr>
                    <td class="txt_left">미래에셋자산운용<br><span>Sean Kim</span></td>
                    <td class="txt_left">2018.08.15</td>
                    <td><button type='button' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01'>Yes</button><button type='button' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_03' >No</button></td>
                </tr>
            </tbody>  
        </table>
        <!--v-data-table :headers="headers2" :items="req_results" slot="extension" hide-actions>
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.INST_NAME }}</td>
                <td class="text-xs-right">{{ props.item.REG_TIME }}</td>
                <td class="text-xs-center">
                    <v-btn depressed dark small color="#42a4e1" @click.stop="dialogOpen('1', props.item);">YES</v-btn>
                    <v-btn depressed dark small color="grey" @click.stop="dialogOpen('2', props.item);">NO</v-btn>
                </td>
            </template> 
        </v-data-table--> 
    </div>
      <!---table2 -->
    </v-flex>
    <v-flex>
        <ConfirmDialog ref="confirm"></ConfirmDialog>
    </v-flex> 
  </v-layout>
  </v-container>
</template>


<script>
var subscribe_table = "";
var req_table = "";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import select from 'datatables.net-select'
import Config from '@/js/config.js';
 export default {
    components: {
        ConfirmDialog: ConfirmDialog
    },
    props: [],
    data() {
        return {
        rowsPerPageItems: [50, 50],
        headers: [
            {text: '기간명', align:"left", value: 'name' },
            {text: '구독지수', align:"right",  value: 'calories'},
            {text: '', align:"center", sortable: false, value: 'button'}
        ],
        message: '승인',
        reqFlag: true,
        dialog: false,
        subscribe_results: [
        ],
        headers2: [
            { text: "신청기관", align: "left", value: "inst_name" },
            { text: "요청일자", align: "right", value: "reg_time" },
            { text: "요청처리", align: "center", sortable: false, value: "button" }
        ],
        req_results: [],
        modalFlag: false,
        };
    },
    computed: {

    },
    created: function() {

    },
    beforeDestroy() {

    },
    mounted: function() {
        // ConfirmDialog 변수 
        this.$root.$confirm = this.$refs.confirm;

        var vm = this;
        subscribe_table = $('#subscribe_table').DataTable( {
                "processing": true,
                "serverSide": false,
                "search": true,
                "info": false,   // control table information display field
                "stateSave": true,  //restore table state on page reload,
                "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                select: {
                    style:    'single',
                    selector: 'td:first-child'
                },
                paging: false,
                searching: false,
                "ordering": false,
               
                data : [],
                columns: [
                    { "data": "INST_NAME", "orderable": false}, 
                    { "data": "SUBCNT", "orderable": false},      
                    {"data": null, "align":"center", className: '', defaultContent:"<button type='button' id='btn_haji' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_02'>해지</button>"}
                ]
        }); 

        //  INDEX 에서 그래프 선택시
        $('#subscribe_table tbody').on('click', 'button', function () {
            var table = $('#subscribe_table').DataTable();
            var data = table.row($(this).parents('tr')).data();
           
            vm.dialogOpen('3', data);

        });


        req_table = $('#req_table').DataTable( {
                "processing": true,
                "serverSide": false,
                "search": true,
                "info": false,   // control table information display field
                "stateSave": true,  //restore table state on page reload,
                "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                select: {
                    style:    'single',
                    selector: 'td:first-child'
                },
                paging: false,
                searching: false,
                "ordering": false,
               
                data : [],
                columns: [
                    { "data": "INST_NAME", "orderable": false}, 
                    { "data": "REG_TIME", "orderable": false},      
                    {"data": null, "align":"center", className: '', defaultContent:"<button type='button' id='btn_yes' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01'>Yes</button><button type='button' id='btn_no' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_03' >No</button>"}
                ]
        }); 

        //  INDEX 에서 그래프 선택시
        $('#req_table tbody').on('click', 'button', function () {
            var table = $('#req_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_yes') {
                vm.dialogOpen('1', data);
            } else if ($(this).attr('id') == 'btn_no') {
                vm.dialogOpen('2', data);
            }

        });

        vm.getInfoOpenReqList();
        vm.getindexSubscribeList();
    },
    methods: {
        /* 신청 현황 */
        getInfoOpenReqList: function() {
            console.log("getInfoOpenReqList");
            var vm = this;

            axios.get(Config.base_url + "/user/index/getinfoopenreqlist", {
                    params: {
                        jisu_cd : vm.$route.query.jisu_cd,
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("해당 신청현황이 없습니다");
                    } else {
                        var items = response.data.results;
     
                        vm.req_results = items;
                    
                        req_table.clear().draw();
                        req_table.rows.add(vm.req_results).draw();
                    } 
                });
        }, 
        /* 구독 현황 */
        getindexSubscribeList: function() {
            console.log("getInfoOpenReqList");
            var vm = this;

            axios.get(Config.base_url + "/user/index/getindexSubscribeList", {
                    params: {
                        jisu_cd : vm.$route.query.jisu_cd,
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("해당 신청현황이 없습니다");
                    } else {
                        var items = response.data.results;
                                            
                        vm.subscribe_results = items;

                        subscribe_table.clear().draw();
                        subscribe_table.rows.add(vm.subscribe_results).draw();
                    } 
                });
        }, 

        async dialogOpen(flag, item) {
            
            if (flag == '1') {
                this.message = "정보 공개 요청 승인 하시겠습니까?";
                this.reqFlag = true;
            } else if (flag == '2') {
                this.message = '정보 공개 요청 거절 하시겠습니까?';
                this.reqFlag = false; 
            } else {
                this.message = '정보 공개 요청 해지 하시겠습니까?';
                this.reqFlag = false; 
            }


            if (await this.$root.$confirm.open(
					'정보공개',
					this.message,
					{}, 2
				)
			) {
                this.updateIndexOpenYn(this.$root.$confirm.val, item);                
            }
        },


        updateIndexOpenYn: function(flag, item) {
            this.dialog = false;
            
            if(flag == 'Y') {
                console.log("JISU_ID="+item.F16013);
                axios.post(Config.base_url + '/user/index/updateIndexOpenYn', {
                    params : {
                        flag : flag,
                        reqFlag : item.REQ_FLAG,
                        JISU_ID : item.F16013,
                        INST_CD : item.INST_CD
                    }
                }).then(response => {
                  
                    this.getInfoOpenReqList();
                })
            }
        }
    }
  
}
</script>
