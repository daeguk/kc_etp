<template>
<v-container>
    <v-layout row wrap class="content_margin">
        <v-flex grow xs12>
            <v-card flat>
                <v-card-title primary-title class="pb-0">

                    <h3 class="headline w100">

                        <v-layout row>
                            <v-flex class="incode_w01">
                                <v-select   :items="arr_large_code" 
                        
                                    item-text="text" 
                                    item-value="value"  

                                    @change="fn_filterAllData()"
                                    
                                    v-model="search_large_code" 
                                    outline
                                    class="select01">
                                </v-select>
                            </v-flex>

                            <v-flex xs2>
                                <v-select   :items="arr_middle_code" 
                        
                                    item-text="text" 
                                    item-value="value"  

                                    @change="fn_filterAllData()"
                                    
                                    v-model="search_middle_code" 
                                    outline
                                    class="select01">
                                </v-select>
                            </v-flex>                            

                            <v-flex  class="incode_w02">                              

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

                            </v-flex>
                        </v-layout>                             
                    </h3>
                </v-card-title>
            </v-card>
            <v-card flat>
                <div class="table-box-wrap">
                    <div class="table-box" style="min-height:670px;">
                        <table class="tbl_type" >
                            <caption>헤더 고정 테이블</caption>
                            <colgroup>
                                <col width="5%" />
                                <col width="5%" />
                                <col width="10%" />
                                <col width="50%" />
                                <col width="15%" />
                                <col width="15%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th width="5%">대</th>
                                    <th width="5%">중</th>
                                    <th width="10%">소</th>
                                    <th width="50%" class="txt_left">지수명</th>
                                    <th width="15%" class="txt_left">업데이트 일자</th>
                                    <th width="15%" class="txt_left">비고</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="( item, index ) in show_data_list"    :key="'index_' + index" >
                                    <td>{{ item.large_code      /* 대 */    }}</td>
                                    <td>{{ item.middle_code     /* 중 */    }}</td>
                                    <td>{{ item.small_code      /* 소 */    }}</td>
                                    <td class="txt_left">{{ item.index_name     /* 지수명 */ }}</td>
                                    <td class="txt_left">{{ item.fmt_upd_time   /* 업데이트 일자 */ }}</td>
                                    <td class="txt_left">{{ item.remark         /* 비고 */ }}</td>
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
import util       from "@/js/util.js";
import Config from "@/js/config.js";

import IndexCodeModal from "@/components/Home/OperSupport/IndexCodeModal.vue";

export default {

    props : [ "org_data_list" ],

    data() {
        return {
                dialog              :   false

            ,   arr_large_code      :   [ 
                        {   text  :   '전체'          ,   value   :   ''  }
                    ,   {   text  :   'K: 코스피'     ,   value   :   'K'  }   
                    ,   {   text  :   'Q: 코스닥'     ,   value   :   'Q'  } 
                    ,   {   text  :   'M: FnGuide'    ,   value   :   'M' }
                    ,   {   text  :   'F: 해외지수'   ,   value    :   'F' }
                    ,   {   text  :   'D: 파생상품'   ,   value    :   'D' }
                    ,   {   text  :   'B: 채권'       ,  value     :  'B' }
                    ,   {   text  :   'C: 상품'       ,  value     :  'C' }
                    ,   {   text  :  'W: WISEfn'     ,  value      :  'W' }
                ]
            ,   arr_middle_code     :   [ 
                        {   text  :  '전체'         ,   value   :   ''  }
                    ,   {   text  :  '1'            ,   value   :   '1' }
                    ,   {   text  :  '2'            ,   value   :   '2' }
                    ,   {   text  :  '3'            ,   value   :   '3' }
                    ,   {   text  :  '4'            ,   value   :   '4' }
                ]

            ,   search_large_code   :   ""
            ,   search_middle_code  :   ""
            ,   search_name         :   ""

            ,   show_data_list      :   []
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

                    var nmIdx           =   o.index_name    ?   o.index_name.toUpperCase().indexOf(vm.search_name) : -1;       /* 지수명 */
                    var v_large_code    =   0;
                    var v_middle_code   =   0;

                    if( vm.search_large_code != "" ) {
                        v_large_code    =   ( ( o.large_code == vm.search_large_code )      ? 1 : -1 );
                    }

                    if( vm.search_middle_code != "" ) {
                        v_middle_code   =   ( ( o.middle_code == vm.search_middle_code )    ? 1 : -1 );
                    }                    

                    if ( nmIdx > -1 && v_large_code > -1 && v_middle_code > -1 ) {
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
                vm.$root.confirmt.open( '확인','조회된 내용이 1건 이상 존재해야 합니다.',{}, 1 );
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