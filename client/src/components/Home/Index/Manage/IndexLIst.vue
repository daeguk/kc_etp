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
               
                 <table id="index_table"  class="tbl_type ver8" width="100%">
                     <thead>
                        <tr>
                            <th class="txt_left">ID</th>
                            <th class="txt_left">지수명</th>
                            <th class="txt_left">요청일</th>
                            <th class="txt_left">발표여부</th>
                            <th class="txt_left">산출타입</th>
                            <th class="txt_left">ETP</th>
                            <th class="txt_left">정보조회기관</th>
                            <th></th>
                        </tr>
                    </thead>
                </table>
                </v-card>
            </v-flex>

                       
        </v-layout>
         <v-flex>
             <ConfirmDialog ref="confirm"></ConfirmDialog>
             <ProgressBar ref="progress"></ProgressBar>
        </v-flex>
    </v-container>
   
</v-app>    
</template>

<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import Config from '@/js/config.js';
import util       from "@/js/util.js";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
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
            list_cnt: 0
        };
    },
    components: {
        ConfirmDialog: ConfirmDialog,
        ProgressBar: ProgressBar
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {       
        var vm = this;

        table = $('#index_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": true,   // control table information display field
                           
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            paging: false,
            searching: false,
            data : [],
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
                },
            ],
            columns: [
                { "data": "JISU_CD", "orderable": true, className: 'txt_left' },
                { "data": "JISU_NM", "orderable" : true, className: 'txt_left' },
                { "data": "IP_DT", "orderable" : true, className: 'txt_left' },
                { "data": "ANNO_YN", "orderable" : true, className: 'txt_left' },
                { "data": "INDEX_CAL_METHOD", "orderable" : true, className: 'txt_left' },
                { "data": "ETP_NM", "orderable": true, className: 'txt_left' },
                { "data": "INST_CNT", "orderable": true, className: 'txt_right' },
                { "data": null, "orderable": false, className: 'checks', defaultContent:"<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:50px;'>지수정보</span></div>" } 
            ]
         }); 


        vm.getInfoIndexList();

        $('#index_table, tbody').on('click', 'button', function () {
        
            var data = table.row($(this).parents('tr')).data();
           // alert("Name = " + JSON.stringify(data));


            
            vm.movePage(data.JISU_CD, data.MARKET_ID, data.LARGE_TYPE);
        
        });

        $('#index_table, tbody').on('click', 'tbody tr', function () {
            var data = table.row($(this).parents('tr')).data();
           // alert("Name = " + JSON.stringify(data));

           
        });
       
    },
    methods: {
        getInfoIndexList: function() {
            console.log("getInfoIndexList");
            
            util.processing(this.$refs.progress, true);
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

                        table.clear().draw();
                        table.rows.add(this.results).draw();
                        
                    }                    
                    util.processing(this.$refs.progress, false);
                });
        }, 
        getReplace: function(text) {
            if (text) {
                return text.replace(/,/gi,"</br>");
            }
        },
        movePage: function(jisu_cd, market_id, large_type) {
            this.$router.push({path: '/index/manage/IndexDetailInfo', query :{'jisu_cd':jisu_cd, 'market_id':market_id, 'large_type':large_type}});
        }

        
    }
};
</script>
<style scoped>
</style>

