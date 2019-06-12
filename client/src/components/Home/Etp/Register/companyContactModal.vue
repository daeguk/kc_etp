<template>
     <v-dialog :value="dialog" persistent max-width="550">
        <!--발행사 담당자 연락처 팝업--->
            <v-card>
                <h5>
                    <v-card-title ma-0>
                        발행사 담당자 연락처
                        <v-spacer></v-spacer>
                        <v-btn icon dark @click="$emit('close')">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                </h5>
                <v-card flat>
                    <table id="companyContact_grid" class="tbl_type ver6">
                        <thead>
                            <tr>
                                <th>담당자</th>
                                <th>전화번호</th>
                                <th>휴대전화</th>
                                <th>이메일</th>
                            </tr>
                        </thead>
                    </table>
                   </v-card>
                <v-card class="pop_bot_h"></v-card>
            </v-card>
         <!--발행사 담당자 연락처 팝업 end --->
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
        companyContactModal: {
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
            return this.companyContactModal.dialog;
        },
        instCd() {
            return this.companyContactModal.instCd;
        }
    },
    created: function() {
        var vm = this;
        this.$EventBus.$on('contactModal', function() {
            vm.getCompanyContactList();
        });
    },
  
    beforeDestroy() {
     },
    mounted: function() {
        //var vm = this;
        //vm.getCompanyContactList();   
    },
    methods: {
           getCompanyContactList: function() {
                axios.get(Config.base_url + "/user/etp/getCompContactList", {
                  params: {inst_cd: this.companyContactModal.instCd}
                 }).then(response => {
                     if (response.data.success == false) {
                        alert("연락처가  없습니다");
                    } else {
                        var items = response.data.results;
                        this.results = items;
                        console.log("getCompanyContactList=" + JSON.stringify(items));
                        contact_grid = $('#companyContact_grid').DataTable( {
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
                                   { "data": "user_nm", "orderable": true,className: "td_in_center","width":"20%" },
                                   { "data": "tel_no", "orderable" : true,className: "td_in_center","width":"20%" },
                                   { "data": "cel_no", "orderable": true ,className: "td_in_center","width":"25%"},
                                   { "data": "email", "orderable" : true ,className: "td_in_center","width":"35%" },
                                ]
                            }); 
                    }
                   
                });
        }, 

    }
}
</script>
