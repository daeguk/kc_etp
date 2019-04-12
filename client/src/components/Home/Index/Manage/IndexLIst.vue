<template>
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
                <!--v-data-table :headers="headers" :items="results" :rows-per-page-items="rowsPerPageItems" :loading="loadingbar"  class="table_line1">
                    <v-progress-circular slot="progress" color="blue" indeterminate></v-progress-circular>
                    <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.JISU_CD }}</td>
                        <td class="text-xs-left">{{ props.item.JISU_NM }}</td>
                        <td class="text-xs-center">{{ props.item.IP_DT }}</td> 
                        <td class="text-xs-center">{{ props.item.ANNO_YN }}</td>
                        <td class="text-xs-center">{{ props.item.INDEX_CAL_METHOD }}</td>
                        <td class="text-xs-left"><p v-html="getReplace(props.item.ETP_NM)"></v-html></p></td>
                        <td class="text-xs-center">{{ props.item.INST_CNT }}</td>
                        <td class="text-xs-center">
                            <v-flex xs12 sm3 center> 
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            flat
                                            icon
                                            color="blue"
                                            :to="{path: '/index/manage/IndexListdetail', query :{'jisu_cd':props.item.JISU_CD, 'market_id':props.item.MARKET_ID}}"
                                             dark v-on="on"
                                        >
                                            <v-icon>equalizer</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>지수정보</span>
                                </v-tooltip>
                            </v-flex>
                        </td>
                    </template>
                </v-data-table-->
                
                <table id="example1" class="display" style="width:100%">
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
            </v-flex>

                       
        </v-layout>
    </v-container>
</template>

<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import Config from '@/js/config.js';
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
    components: {},
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        var vm = this;
        vm.getInfoIndexList();

        $('#example1, tbody').on('click', 'button', function () {
            var data = table.row($(this).parents('tr')).data();
           // alert("Name = " + JSON.stringify(data));


            table.row.add( {
                "JISU_CD":       "Tiger Nixon",
                "JISU_NM":   "System Architect",
                "IP_DT":     "$3,120",
                "ANNO_YN": "2011/04/25",
                "INDEX_CAL_METHOD":     "Edinburgh",
                "ETP_NM":       "5421",
                "INST_CNT":       "5421",
            } ).draw();
            
            vm.movePage(data.JISU_CD, data.MARKET_ID);
        
        });

        $('#example1, tbody').on('click', 'tbody tr', function () {
            var data = table.row($(this).parents('tr')).data();
           // alert("Name = " + JSON.stringify(data));


            table.row.add( {
                "JISU_CD":       "Tiger Nixon",
                "JISU_NM":   "System Architect",
                "IP_DT":     "$3,120",
                "ANNO_YN": "2011/04/25",
                "INDEX_CAL_METHOD":     "Edinburgh",
                "ETP_NM":       "5421",
                "INST_CNT":       "5421",
            } ).draw();

           
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
                        alert("관리지수 목록이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.results = items;
                        this.list_cnt = this.results.length;

                        table = $('#example1').DataTable( {
                            "processing": true,
                            "serverSide": false,
                            "info": true,   // control table information display field
                            "stateSave": true,  //restore table state on page reload,
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
                                { "data": null, className: 'checks', defaultContent:"<button type='button' class='btn btn-primary btn-xs'>상세보기</button>" } 
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

