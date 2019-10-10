<template>
<v-container>
    <v-layout row wrap class="content_margin">
        <v-flex grow xs12>
            <v-card flat>
                <v-card-title primary-title class="pb-0">
                    <h3 class="headline w100">
                        <div class="incode_search">
                            <v-text-field   v-model="search_name" 
                                            append-icon="search" 
                                            label="지수명 검색" 
                                            single-line 
                                            hide-details

                                            v-on:keyup="fn_filterAllData()"
                            >
                             </v-text-field>
                        </div>

                        <span><button type='button'  class="exceldown_btn" @click.stop="fn_downExcel()"></button></span>

                        <span class="btn_r ver2">
                           <IndexCodeModal></IndexCodeModal>
                        </span>
                    </h3>
                </v-card-title>
            </v-card>
            <v-card flat>
                <div class="table-box-wrap">
                    <div class="table-box" style="min-height:670px;">
                        <table class="tbl_type" >
                            <caption>헤더 고정 테이블</caption>
                            <colgroup>
                                <col width="15%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="55%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th width="15%">대</th>
                                    <th width="15%">중</th>
                                    <th width="15%">소</th>
                                    <th width="55%" class="txt_left">지수명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="( item, index ) in show_data_list"    :key="'index_' + index" >
                                    <td>{{ item.large_code }}</td>
                                    <td>{{ item.middle_code }}</td>
                                    <td>{{ item.small_code }}</td>
                                    <td class="txt_left">{{ item.index_name }}</td>
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

import IndexCodeModal from "@/components/Home/OperSupport/IndexCodeModal.vue";

export default {

    props : [ "org_data_list" ],

    data() {
        return {
                dialog          :   false
            ,   search_name     :   ""
            ,   show_data_list  :   []
        }
    
    },
    
    components: {
        IndexCodeModal : IndexCodeModal,
    },

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        vm.show_data_list   =   vm.org_data_list;
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
         * 조회된 내용에서 필터를 수행한다.
         * 2019-10-11  bkLove(촤병국)
         */
        fn_filterAllData: function() {
            var vm = this;

            vm.search_name   =   vm.search_name.toUpperCase();

            /* 이벤트 delay이로 부하 줄임 */
            var delay = (function(){
                var timer = 0;
                return function(callback, ms){
                    clearTimeout (timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            delay(function(){

                vm.show_data_list   =   [];
                var filterData = _.filter( vm.org_data_list, function(o) { 

                    var nmIdx = o.index_name ? o.index_name.toUpperCase().indexOf(vm.search_name) : -1;       /* 지수명 */

                    if ( nmIdx > -1 ) {
                        return true; 
                    } else {
                        return false;
                    }
                });

                vm.show_data_list   =   filterData;

            }, 1000 );
        },

        /*
         *  엑셀을 다운로드 한다.
         *  2019-07-09  bkLove(촤병국)
         */
        fn_downExcel: function() {
            var vm = this;


            if( !vm.show_data_list || vm.show_data_list.length == 0 ) {
                vm.fn_showMessageBox( '확인','조회된 내용이 1건 이상 존재해야 합니다.',{}, 1 );
                return  false;
            }          

            var arrHeaderNm     =   [ "대", "중", "소", "지수명" ];
            var arrHeaderKey    =   [ "large_code", "middle_code", "small_code", "index_name" ];
            var arrColsInfo     =   [ {width : 15}, {width : 15}, {width : 15}, {width : 60} ];

            var sheetNm         =   "ETF 대상지수구분";


            var excelInfo = {
                    excelFileNm     :   "지수구분코드"
                ,   sheetNm         :   sheetNm
                ,   dataInfo        :   vm.show_data_list

                ,   arrHeaderNm     :   arrHeaderNm
                ,   arrHeaderKey    :   arrHeaderKey

                ,   arrColsInfo     :   arrColsInfo
            };

            util.fn_downExcel( excelInfo );
        }        
    }    

} 
</script>