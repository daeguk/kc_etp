<template>
<v-app>
    <v-container>
       
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">
                                Index List |
                                <span class="grey--text">total {{list_cnt}} index</span>
                            </h3>
                        </div>
                    </v-card-title>
                </v-card>
                <v-card flat>
               
                 <table id="index_table" class="display table01_w">
                     <thead>
                        <tr>
                            <th>ID</th>
                            <th>지수명</th>
                            <th>요청일</th>
                            <th>발표여부</th>
                            <th>산출타입</th>
                            <th>ETP</th>
                            <th>정보조회기관</th>
                            <th></th>
                        </tr>
                    </thead>
                </table>
                </v-card>
            </v-flex>

                       
        </v-layout>
         <v-flex>
             <ConfirmDialog ref="confirm"></ConfirmDialog>
        </v-flex>
    </v-container>
   
</v-app>    
</template>

<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import Config from '@/js/config.js';
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
var table = null;

export default {
    
    props: [],

    data() {
        return {
           
            rowsPerPageItems: [10, 20, 30],
            headers: [
                {
                    text: "ID",
                    align: "left",
                    sortable: false,
                    value: "JISU_CD"
                },
                { text: "지수명", value: "JISU_NM", align: "left"},
                { text: "요청일", value: "IP_DT" },
                { text: "발표여부", value: "ANNO_YN" },
                { text: "산출타입", value: "INDEX_CAL_METHOD" },
                { text: "ETP", value: "ETP_NM" },
                { text: "정보조회기관", value: "INST_CNT" },
                { text: "", value: "iron" }
            ],

            results: [],
            loadingbar: false,
            list_cnt: 0
        };
    },
    components: {
        ConfirmDialog: ConfirmDialog
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {

        var vm = this;
        vm.getInfoIndexList();

        $('#index_table, tbody').on('click', 'button', function () {
        
            var data = table.row($(this).parents('tr')).data();
           // alert("Name = " + JSON.stringify(data));


            
            vm.movePage(data.JISU_CD, data.MARKET_ID);
        
        });

        $('#index_table, tbody').on('click', 'tbody tr', function () {
            var data = table.row($(this).parents('tr')).data();
           // alert("Name = " + JSON.stringify(data));


           
        });
       
    },
    methods: {
        getInfoIndexList: function() {
            console.log("getInfoIndexList");
            this.loadingbar = true;
            axios.get(Config.base_url + "/user/index/getInfoIndexList", {
                    params: {
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        this.$refs.confirm.open('', '관리지수 목록이 없습니다', {}, 1);
                    } else {
                        
                        var items = response.data.results;  
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.results = items;
                        this.list_cnt = this.results.length;

                        table = $('#index_table').DataTable( {
                            "processing": true,
                            "serverSide": false,
                            "info": true,   // control table information display field
                           
                            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                            paging: false,
                            searching: false,
                            data : this.results,
                            "columnDefs": [
                             {  
                                "render": function ( data, type, row ) {
                                    if (data) {
                                        return data.replace(/,/gi,"</br>");
                                    } else {
                                        return "";
                                    }
                                },
                                "targets": 5
                            },],
                            columns: [
                                //{ "defaultContent": "<button type='button' class='btn btn-primary btn-xs'>Trial Run</button>" },
                                { "data": "JISU_CD", "orderable": true },
                                { "data": "JISU_NM", "orderable" : true },
                                { "data": "IP_DT", "orderable" : true },
                                { "data": "ANNO_YN", "orderable" : true },
                                { "data": "INDEX_CAL_METHOD", "orderable" : true },
                                { "data": "ETP_NM", "orderable": true },
                                { "data": "INST_CNT", "orderable": true },
                                { "data": null, className: 'checks', defaultContent:"<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:50px;'>지수정보</span></div>" } 
                            ]
                        }); 
                    }
                    this.loadingbar = false;
                });
        }, 
        getReplace: function(text) {
            if (text) {
                return text.replace(/,/gi,"</br>");
            }
        },
        movePage: function(jisu_cd, market_id) {
            this.$router.push({path: '/index/manage/IndexListdetail', query :{'jisu_cd':jisu_cd, 'market_id':market_id}});
        }

        
    }
};
</script>
<style scoped>
</style>

