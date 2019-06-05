<template>
     <v-dialog :value="dialog" persistent max-width="600">
     <!-- iNAV 팝업 내용-->
       <v-card>
           <h5>
               <v-card-title ma-0>
                   iNAV 확인
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="$emit('close')">
                        <v-icon>close</v-icon>
                    </v-btn>
               </v-card-title>
           </h5>
           <v-card flat>
               <table id="iNavConfirm" class="display table01_w" >
                   <colgroup>
                       <col width="50%">
                       <col width="50%">
                   </colgroup>
                   <thead>
                       <tr>
                           <th>심볼코드</th>
                           <th>ETP 종목명 </th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                           <td align="center">{{ iNavConfirmModal.idxSymCode }}</td>
                           <td align="center">{{ iNavConfirmModal.isuKorNm }}</td>
                       </tr> 
                   </tbody>
               </table>
                <table id="iNavConfirmData" class="display table01_w">
                    <colgroup>
                        <col width="15%">
                        <col width="15%">
                        <col width="10%">
                        <col width="10%"> 
                        <col width="10%">
                        <col width="10%">
                        <col width="10%">
                        <col width="10%">                     
                        <col width="10%">                                                                     
                    </colgroup>
                    <thead>
                       <tr>
                        <th>시간</th>
                        <th>장중NAV</th>
                        <th>현재기초지수</th>
                        <th>장전매매기준율</th>
                        <th>매매기준율</th>
                        <th>전일기초지수</th>
                        <th>전일NAV</th>
                        <th>배울</th>
                        <th>기초지수등락율</th>                            
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
var table = null;
export default {
    props: {
        iNavConfirmModal: {
            type: Object,
        }
    },
    data() {
        return {
            
         }
    },
    components: {

    },
    computed: {
        dialog() {
            return this.iNavConfirmModal.dialog;
    },
    },
    created: function() {
        var vm = this;
        this.$EventBus.$on('iNavListModal', function() {
             vm.getINavist();        
         });
    },
  
    beforeDestroy() {
     },
    mounted: function() {
     },
    methods: {
        // INAV
        getINavist: function() {
                 axios.get(Config.base_url + "/user/etp/getINavList", {
                  params:{isu_srt_cd: this.iNavConfirmModal.isuSrtCd,
                  }
                }).then(response => {
                     if (response.data.success == false) {
                        alert("데이터에 이상이 있습니다.잠시후 다시 시도해주시기 바랍니다.");
                    } else {
                        var items = response.data.results;
                        this.results = items;
                        if(this.results.length == 0){
                         alert("기초지수 산출전입니다..");   
                        }
                        console.log("getIdxList=" + JSON.stringify(items));
                        table = $('#iNavConfirmData').DataTable( {
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


    }
}
</script>
