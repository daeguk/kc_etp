<template>
     <v-dialog :value="dialog" persistent max-width="500">
     <!--기초지수 팝업 내용-->
       <v-card>
           <h5>
               <v-card-title ma-0>
                   기초지수
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="$emit('close')">
                        <v-icon>close</v-icon>
                    </v-btn>
               </v-card-title>
           </h5>
           <v-card flat>
               <table id="idxConfirm" class="display table01_w">
                   <colgroup>
                       <col width="20%">
                       <col width="20%">
                       <col width="60%">
                   </colgroup>
                   <thead>
                       <tr>
                           <th>심플코드</th>
                           <th>
                               <v-select
                                   :items="items1"
                                   value
                                   placeholder="실시간종가"
                               ></v-select>
                           </th>
                           <th>지수명</th>
                       </tr>
                   </thead>
               </table>
               <table id="example3" class="display table01_w">
                   <colgroup>
                       <col width="50%">
                       <col width="50%">
                   </colgroup>
                    <thead>
                       <tr>
                           <th>일자</th>
                           <th>현재가</th>
                       </tr>
                   </thead>
               </table>
           </v-card>
           <v-card class="pop_bot_h"></v-card>
       </v-card>
       <!--기초지수 팝업 내용end-->
    </v-dialog>
</template>


<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import Config from '@/js/config.js'
var contact_grid = null;
export default {
    props: {
        idxConfirmModal: {
            type: Object,
        }
    },
    data() {
        return {
           items1: ["실시간", "종가"],
        }
    },
    components: {

    },
    computed: {
        dialog() {
            return this.idxConfirmModal.dialog;
        },
        idxTable() {
            return this.idxConfirmModal.idxTable;
        },
        idxSymCode() {
            return this.idxConfirmModal.idxSymCode;
        },
        ridxDistSymCode() {
            return this.idxConfirmModal.ridxDistSymCode;
        }
    },
    created: function() {
        var vm = this;
        this.$EventBus.$on('idxListModal', function() {
        vm.getIdxList();
        });
    },
  
    beforeDestroy() {
     },
    mounted: function() {
        //var vm = this;
        //vm.getIdxList();   
    },
    methods: {
           getIdxList: function() {
                axios.get(Config.base_url + "/user/etp/getIdxList", {
                  params:{idxTable: this.idxConfirmModal.idxTable,
                          idx_sym_code: this.idxConfirmModal.idxSymCode,
                         }
                 }).then(response => {
                     if (response.data.success == false) {
                        alert("연락처가  없습니다");
                    } else {
                        var items = response.data.results;
                        this.results = items;
                        console.log("getIdxList=" + JSON.stringify(items));
                        contact_grid = $('#idxList_grid').DataTable( {
                            autoWidth: false, 
                            processing: true,
                            serverSide: false,
                            info: true, // control table information display field
                            stateSave: true, //restore table state on page reload,
                            paging: false,
                            searching: false,
                            data: this.results,
                            destroy: true,
                                columns: [
                                   { "data": "USER_NM", "orderable": true },
                                   { "data": "TEL_NO", "orderable" : true },
                                   { "data": "CEL_NO", "orderable": true },
                                   { "data": "EMAIL", "orderable" : true },
                                ]
                            }); 
                    }
                   
                });
        }, 

    }
}
</script>
