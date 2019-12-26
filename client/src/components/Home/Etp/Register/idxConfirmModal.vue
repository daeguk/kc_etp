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
               <table id="idxConfirm" class="tbl_type ver6_1">
                   <colgroup>
                       <col width="25%">
                       <col width="25%">
                       <col width="50%">
                   </colgroup>
                   <thead>
                       <tr>
                           <th>심볼코드</th>
                           <th>종가
                               <!-- <v-select 
                                    class="select_table_in"
                                    :items="items"
                                    @change="selectItem"
                                    v-model="selectedItem.value"
                                 >
                              </v-select> -->
                           </th>
                           <th>지수명</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                           <td>{{ idxConfirmModal.idxSymCode }}</td>
                           <td>{{ selectedItem.text }}</td>
                           <td class="txt_left">{{ idxConfirmModal.idxNm }}</td>
                       </tr> 
                   </tbody>
               </table>
               <table id="dataTable" class="tbl_type ver6 mt-3">
                   <colgroup>
                       <col width="50%">
                       <col width="50%">
                   </colgroup>
                    <thead>
                       <tr>
                           <th></th>
                           <th></th>
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
import Config from '@/js/config.js'
var dataTable = null;
export default {
    props: {
        idxConfirmModal: {
            type: Object,
        }
    },
    data() {
        return {
            items: [{value: "1", text: "종가" }, {value: "2" , text: "실시간" }],
            selectedItem: {
                value: "1",
                text: "종가"
            },
        }
    },
    components: {
    },
    computed: {
        dialog() {
            return this.idxConfirmModal.dialog;
        },
    },
    created: function() {
        var vm = this;
        this.$EventBus.$on('idxListModal', function() {
            vm.selectedItem.value = "1";
            vm.selectedItem.text = "종가";
            if(dataTable != null ){
                dataTable.clear().draw();
             }
            vm.getIdxList();        
         });
    },
  
    beforeDestroy: function() {
      var vm = this;
      vm.$EventBus.$off('idxListModal');
    },
    mounted: function() {
     },
    methods: {
        // selectItem: function() {
        //     var vm = this;
        //     if(dataTable != null){
        //         dataTable.clear().draw();
        //     }
        //     if(vm.selectedItem.value == "2"){
        //         vm.selectedItem.text = "실시간";
        //         if( this.idxConfirmModal.ridxDistSymCode == null || this.idxConfirmModal.ridxDistSymCode.length == 0 ){
        //             alert("신청한 실시간 심볼코드가 없습니다.");  
        //              return;   
        //         }
        //         vm.getRidxList();
        //     }else{
        //         vm.selectedItem.text = "종가";
        //         vm.getIdxList();
        //     }
        // },
        //종가
        getIdxList: function() {
                axios.get(Config.base_url + "/user/etp/getIdxList", {
                  params:{idx_sym_code: this.idxConfirmModal.idxSymCode,
                          market_id: this.idxConfirmModal.marketId
                         }
                }).then(response => {
                     if (response.data.success == false) {
                        alert("데이터에 이상이 있습니다.잠시후 다시 시도해주시기 바랍니다.");
                     } else {
                        var items = response.data.results;
                        this.results = items;
                        if(this.results.length == 0){
                         alert("기초지수 산출전입니다.");   
                        }
                        //console.log("getIdxList=" + JSON.stringify(items));
                        dataTable = $('#dataTable').DataTable( {
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
                                   { "data": "time", "orderable": true,"title" : "일자"  ,className: "td_in_center", },
                                   { "data": "value","orderable" :true,"title" : "현재가",className: "td_in_center", },
                                ]
                            }); 
                    }
                   
                });
        }, 
        //실시간
        // getRidxList: function() {
        //         axios.get(Config.base_url + "/user/etp/getRidxList", {
        //           params:{rMarket_id: this.idxConfirmModal.rMarketId,
        //                   ridx_dist_sym_code: this.idxConfirmModal.ridxDistSymCode,
        //                  }
        //          }).then(response => {
        //              if (response.data.success == false) {
        //                // alert("실시간 데이터가 없습니다.");
        //             } else {
        //                 var items = response.data.results;
        //                 this.results = items;
        //                 if(this.results.length == 0){
        //                  alert("기초지수  산출 전입니다..");   
        //                 }
        //                 dataTable = $('#dataTable').DataTable( {
        //                     autoWidth: false, 
        //                     processing: true,
        //                     serverSide: false,
        //                     info: true, // control table information display field
        //                     stateSave: true, //restore table state on page reload,
        //                     paging: false,
        //                     searching: false,
        //                     data: this.results,
        //                     destroy: true,
        //                         columns: [
        //                            { "data": "time", "orderable" : true , "title"  : "일자"   ,className: "td_in_center", },
        //                            { "data": "value","orderable" : true , "title"  : "현재가" ,className: "td_in_center",},
        //                          ]
        //                     }); 
        //             }
                   
        //         });
        // },

    }
}
</script>
