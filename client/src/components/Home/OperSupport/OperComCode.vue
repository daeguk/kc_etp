<template>
<v-container>
    <v-layout row wrap class="content_margin">
        <v-flex grow xs12>
            <v-card flat>
                <v-card-title primary-title >
                    <h3 class="headline w100" pb-0 >
                        운용사 코드
                    </h3>
                </v-card-title>
            </v-card>
            <v-card flat>
                <div class="table-box-wrap">
                    <div class="table-box" style="min-height:690px;">
                        <table class="tbl_type" >
                            <caption>헤더 고정 테이블</caption>
                            <colgroup>
                                <col width="20%" />
                                <col width="80%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th width="20%" class="txt_left">운용사코드</th>
                                    <th width="80%" class="txt_left">운용사 한글약명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="( item, index ) in show_data_list"    :key="'oper_' + index" >
                                    <td class="txt_left">{{ item.inst_cd }}</td>
                                    <td class="txt_left">{{ item.inst_name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </v-card>
        </v-flex>
        
    </v-layout>
</v-container>
</template>

<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import select from "datatables.net-select";
import Config from "@/js/config.js";
import _ from "lodash";

import MastPopup02 from "@/components/common/popup/MastPopup02";
import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";

var table01 = null;


export default {

    data() {
        return {
                org_data_list   :   []
            ,   show_data_list  :   []
        }
    },

    components: {
    },    

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        /* 운용사 코드를 조회한다. */
        vm.fn_getOperCode();        
    },

    methods: {

        /*
         * 진행 progress 를 보여준다.
         * 2019-10-11  bkLove(촤병국)
         */
        fn_showProgress: function( visible ) {
            var vm = this;
            vm.$emit("fn_showProgress", visible );
        },

        /*
         * 메시지창을 보여준다.
         * 2019-10-11  bkLove(촤병국)
         */
        fn_showMessageBox: function(title, msg, option, gubun) {
            var vm = this;
            vm.$emit( "fn_showMessageBox", title,msg, option, gubun);
        },        

        /*
         * 운용사 코드를 조회한다.
         * 2019-10-11  bkLove(촤병국)
         */
        fn_getOperCode() {
            var vm = this;

            vm.fn_showProgress( true );

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/operSupport/getOperCode"
                        ,   "data"      :   {
                            }
                        ,   "method"    :   "post"
                    }
                ,   function(response) {
                        vm.fn_showProgress( false );

                        try{

                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.fn_showMessageBox( '확인', msg, {}, 1 );
                                    }
                                }else{
                                    vm.org_data_list    =   response.data.dataList;
                                    vm.show_data_list   =   response.data.dataList;
                                }
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {

                        vm.fn_showProgress( false );
                        if ( error ) {
                            vm.fn_showMessageBox( '확인', error, {}, 4 );
                        }
                    }
            );
        },        
    }
};
</script>