<template>
    <v-layout row>
        <v-flex xs12>
            <v-card flat>
                <v-card flat class="right_menu_w4">
                    <v-list subheader two-line>
                        <v-subheader class="subheading">기준시총 변동</v-subheader>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>당일( {{indexFixData.now_date}} )</v-list-tile-title>
                                <v-list-tile-sub-title>
                                    {{indexFixData.now_date_money}}
                                    <p>{{indexFixData.now_date_change_money}}</p>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-content>
                                <v-list-tile-title>당일( {{indexFixData.oper_date}} )</v-list-tile-title>
                                <v-list-tile-sub-title>
                                    {{indexFixData.oper_date_money}}
                                    <p></p>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>


                <!--종목편출입 테이블-->
                <v-subheader class="subheading">종목편출입</v-subheader>

                <table id="tableIndexFixJongmokInout" class="display table01_w">
                    <thead>
                        <tr>
                            <th>code</th>
                            <th>종목명</th>
                            <th>구분</th>
                            <th>비중(%)</th>
                        </tr>
                    </thead>
                </table>
                <!--종목편출입 테이블 end-->

                <br>

                <!--지수채용주식수변경테이블-->
                <v-subheader class="subheading">지수채용주식수변경</v-subheader>

                <table id="tableIndexFixModify" class="display table01_w">
                    <thead>
                        <tr>
                            <th>code</th>
                            <th>종목명</th>
                            <th></th>
                            <th></th>
                            <th>변경분</th>
                        </tr>
                    </thead>
                </table>
                <!--지수채용주식수변경테이블 end-->
                
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'

import Config from '@/js/config.js';

var tableIndexFixJongmokInout = null;
var tableIndexFixModify = null;


export default {
    props: [ "rowData" ],

    data() {
        return {
            notifications: false,
            sound: false,
            video: false,
            invites: false,
            dialog: false,
            search: "",

            indexFixData                :   {},
            indexFixJongmokInoutList    :   [],
            indexFixModifyList          :   []
        };
    },

    mounted() {

        /* 지수조치 종목 편출입 정보 */
        tableIndexFixJongmokInout = $('#tableIndexFixJongmokInout').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            paging: false,
            searching: false,
            data : [],
            "columnDefs": [
                { "targets": 0, className: "dt-center" },
                { "targets": 2, className: "dt-center" },
            ],            
            columns: [
                { "data": "code"                ,   "orderable" : true  },      /* code */
                { "data": "name"                ,   "orderable" : true  },      /* 종목명 */
                { "data": "gubun_name"          ,   "orderable" : true  },      /* 구분 */
                { "data": "rate"                ,   "orderable" : true  },      /* 비중 */
            ]
        });


        /* 지수채용 주식수 변경 정보 */
        tableIndexFixModify = $('#tableIndexFixModify').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            paging: false,
            searching: false,
            data : [],
           
            columns: [
                { "data": "code"                ,   "orderable" : true  },      /* 종목코드 */
                { "data": "name"                ,   "orderable" : true  },      /* 한글종목명 */
                { "data": "now_date_money"      ,   "orderable" : true  },      /* 당일 금액 */
                { "data": "prev_date_money"     ,   "orderable" : true  },      /* 전일 금액 */
                { "data": "in_out_money"        ,   "orderable" : true  },      /* 변경분 */
            ]
        });

        this.fn_getIndexFixList();
    },

    methods: {
        /*
         * 선택한 지수 조치내역을 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexFixList : function() {

            var vm = this;

            axios.post(Config.base_url + "/user/index/getIndexFixList", {
                data: this.rowData
            }).then(response => {

                if (response && response.data) {

                    /* 지수조치 현황의 기본정보 */
                    var indexFixData                =   response.data.indexFixData;
                    if( indexFixData ) {
                        vm.indexFixData             =   indexFixData;
                    }                    

                    /* 지수조치 종목 편출입 정보 */
                    var indexFixJongmokInoutList    =   response.data.indexFixJongmokInoutList;
                    if( indexFixJongmokInoutList && indexFixJongmokInoutList.length > 0 ) {
                        vm.indexFixJongmokInoutList =   indexFixJongmokInoutList;

                        tableIndexFixJongmokInout.clear().draw();
                        tableIndexFixJongmokInout.rows.add(indexFixJongmokInoutList).draw();
                        tableIndexFixJongmokInout.draw(indexFixJongmokInoutList);                        
                    }
                    
                    /* 지수채용 주식수 변경 정보 */
                    var indexFixModifyList          =   response.data.indexFixModifyList;
                    if( indexFixModifyList && indexFixModifyList.length > 0 ) {
                        vm.indexFixModifyList       =   indexFixModifyList;

                        tableIndexFixModify.clear().draw();
                        tableIndexFixModify.rows.add(indexFixModifyList).draw();
                        tableIndexFixModify.draw(indexFixModifyList);                        
                    }
                }
            });
        }        
    }
};
</script>
