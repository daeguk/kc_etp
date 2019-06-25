<template>

    <v-container>

        <v-dialog v-model="showDialog" persistent max-width="800">

            <v-card flat ma-3>

                <h5>
                    <v-card-title ma-0>
                        {{ indexBasic.F16002     /* 한글종목명 */ }}
                        <v-spacer></v-spacer>
                        <v-btn
                            icon
                            dark
                            @click="fn_closePop"
                        >
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                </h5>


                <div class="index3pop2_con ver2">

                    <v-list subheader two-line>
                        <v-list-tile>
                            <v-list-tile-title>{{ indexBasic.F16013  /* 단축코드 */ }}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>기준일</v-list-tile-title>
                            <v-list-tile-content>{{ indexBasic.fmt_std_date  /* 기준일 */ }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Last Updated</v-list-tile-title>
                            <v-list-tile-content>{{ indexBasic.fmt_F12506 /* 입회일 */ }}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>

                </div>


                <v-card flat>
                    <table id="tableIndexDetailList" class="tbl_type ver7"    style="width:100%"></table>
                </v-card>

            </v-card>

        </v-dialog>

        <v-flex>
            <ProgressBar ref="progress"></ProgressBar>
        </v-flex>             

    </v-container>
</template>


<script>

import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons';
import util       from "@/js/util.js";

import Config from '@/js/config.js';
import ProgressBar from "@/components/common/ProgressBar.vue";

var tableIndexDetailList = null;

export default {
    props : [ "showDialog", "paramData" ],
    data() {
        return {
            indexBasic : {},                    /* 선택된 지수의 마스터 정보 */

            nowDate:        new Date().getFullYear() 
                        +   "." 
                        +   (parseInt(new Date().getMonth()) + 1) 
                        +   "." 
                        +   new Date().getDate(),
        };
    },
    components : {
        ProgressBar: ProgressBar
    },
    mounted () {

        var vm = this;

        tableIndexDetailList = $('#tableIndexDetailList').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            "scrollY": '60vh',
            paging: false,
            searching: false,
            data : [],
            "columnDefs": [ {} ],
            columns: [
                { "data": "isin_code"             ,   "orderable" : true, 'className': 'txt_left'  ,  "width" :   "12%" , "title"   :   "Code"          },      /* 종목코드 */
                { "data": "F16002"                ,   "orderable" : true, 'className': 'txt_left'  ,  "width" :   "18%" , "title"   :   "Name"           },     /* 한글종목명 */
                { "data": "F03003"                ,   "orderable" : true, 'className': 'txt_right' ,  "width" :   "14%" , "title"   :   "BasePrc"       },      /* 전일종가 */
                { "data": "F30812"                ,   "orderable" : true, 'className': 'txt_right' ,  "width" :   "14%" , "title"   :   "Shrs"          },      /* 상장주식수 */
                { "data": "style_includ_percnt"   ,   "orderable" : true, 'className': 'txt_right' ,  "width" :   "14%" , "title"   :   "Float rto"     },      /* 스타일포함비중 */
                { "data": "ceiling_percnt"        ,   "orderable" : true, 'className': 'txt_right' ,  "width" :   "14%" , "title"   :   "Ceiling rto"   },      /* CEILING비중 */
                { "data": "F30813"                ,   "orderable" : true, 'className': 'txt_right' ,  "width" :   "14%" , "title"   :   "Factor rto"    }       /* 유동주식비율 */
            ]
        });

        vm.fn_getIndexDetailList();

        console.log( "IndexDetailList.vue -> mounted" );

    },
    created: function() {

        var vm = this;

    },
    beforeDestory: function() {},

    methods: {

        /*
         * 지수 목록에서 선택된 데이터를 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexDetailList : function() {

            var vm = this;

            util.processing(vm.$refs.progress, true);

            tableIndexDetailList.clear().draw();
            axios.post(Config.base_url + "/user/index/getIndexDetailList", {
                data:  vm.paramData
            }).then(response => {

                if (response && response.data) {

                    var indexBasic = response.data.indexBasic;
                    if( indexBasic ) {
                        vm.indexBasic   =  indexBasic;
                    }

                    var indexDetailList =   response.data.indexDetailList;

                    if( indexDetailList ) {
                        tableIndexDetailList.rows.add( indexDetailList ).draw();
                    }
                }

                util.processing(vm.$refs.progress, false);
            }).catch(error => {
                util.processing(vm.$refs.progress, false);
            });            
        },

        fn_closePop() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        }
    }
};
</script>

