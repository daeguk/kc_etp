<template>

    <v-container>

        <v-dialog v-model="showDialog" persistent max-width="800">

            <v-card flat ma-3>

                <h5>
                    <v-card-title ma-0>
                        지수 오류 내역 ({{ indexBasic.F16002     /* 한글종목명 */ }} Index)
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

                <v-card flat>
                    <table id="tableIndexErrorList" class="display table01_w"    style="width:100%"></table>
                </v-card>

            </v-card>

        </v-dialog>

    <v-flex>
        <ProgressBar ref="progress"></ProgressBar>
        <ConfirmDialog ref="confirm2"></ConfirmDialog>
    </v-flex>           

    </v-container>
</template>


<script>

import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import util       from "@/js/util.js";

import Config from '@/js/config.js';
import ConfirmDialog                from "@/components/common/ConfirmDialog.vue";

import ProgressBar from "@/components/common/ProgressBar.vue";


var tableIndexErrorList = null;

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
        ProgressBar: ProgressBar,
        ConfirmDialog: ConfirmDialog        
    },
    mounted () {

        var vm = this;

        tableIndexErrorList = $('#tableIndexErrorList').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            paging: false,
            searching: false,
            data : [],
            "columnDefs": [ {} ],
            columns: [
                { "data": "err_id"          ,   "orderable" : true, "width" :   "120"   ,   "title"   :   "err_id"     },      /* err_id */
                { "data": "err_date"        ,   "orderable" : true, "width" :   "80"    ,   "title"   :   "날짜"        },       /* 날짜 */
                { "data": "err_time"        ,   "orderable" : true, "width" :   "80"    ,   "title"   :   "발생시간"       },      /* 발생시간 */
                { "data": "fix_time"        ,   "orderable" : true, "width" :   "80"    ,   "title"   :   "조치시간"       },      /* 조치시간 */
                { "data": "err_content"     ,   "orderable" : true, "width" :   "200"   ,   "title"   :   "오류내용"       },      /* 오류내용 */
                { "data": "remark"          ,   "orderable" : true, "width" :   "150"   ,   "title"   :   "비고"         },      /* 비고 */
            ]
        });

        vm.fn_getIndexErrorList();

        console.log( "IndexErrorList.vue -> mounted" );

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
        fn_getIndexErrorList : function() {

            var vm = this;

            util.processing(vm.$refs.progress, true);

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/etp/getEtpOperIndexError"
                        ,   "data"      :   vm.paramData
                        ,   "method"    :   "post"
                    }
                ,   function(response) {

                        if( vm.$refs.progress ) {
                            util.processing(vm.$refs.progress, false);
                        }

                        try{

                            if (response && response.data) {

                                var indexBasic = response.data.indexBasic;
                                if( indexBasic ) {
                                    vm.indexBasic   =  indexBasic;
                                }                    

                                var dataList =   response.data.dataList;

                                if( dataList ) {
                                    tableIndexErrorList.clear().draw();
                                    tableIndexErrorList.rows.add( dataList ).draw();
                                    tableIndexErrorList.draw();
                                }
                            }

                        }catch(ex) {
                            if( vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }

                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        if( vm.$refs.progress ) {
                            util.processing(vm.$refs.progress, false);
                        }

                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );            

        },

        fn_closePop() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        }
    }
};
</script>

