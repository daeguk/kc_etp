<template>
    <v-container class="IndexRegi_w">
        <v-layout row wrap class="content_margin  con_wrap">
            <v-flex grow class="conWidth_left">
                <v-card flat>

                    <!-- 지수 찾기 결과 -->
                    <v-card-title primary-title v-if="form.jisuSearchYn == 'Y'">
                        <h3 class="headline subtit" pb-0>
                            {{ indexBasic.f16002 }} |
                            <span class="grey--text">{{ indexBasic.f16013 }}</span>
                            <p>기준일 : {{ indexBasic.fmt_f12506 }}</p>
                            <p class="sub_txt">Last Updated : </p>
                        </h3>
                    </v-card-title>


                    <!-- 종목 찾기 결과 -->
                    <v-card-title primary-title v-if="form.jisuSearchYn == 'N'">
                        <h3 class="headline subtit" pb-0>
                            {{ indexBasic.f16002 }} 편입지수 목록

                            <p class="grey--text">{{ form.resultsCnt }} results</p>
                            <p class="sub_txt">Last Updated : </p>
                        </h3>
                    </v-card-title>                    


                    <table id="tableIndexList" class="tbl_type" width="100%"></table>
                    
                </v-card>
            </v-flex >
            <v-flex  class="conWidth_right">
                <IndexDetailQuick   @fn_getIndexDetailList="fn_getIndexDetailList"
                                    @fn_getIndexJongmokList="fn_getIndexJongmokList">
                </IndexDetailQuick>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>

import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'

import Config from '@/js/config.js';
import IndexDetailQuick from "@/components/Home/Index/Manage/IndexDetailQuick.vue";

var tableIndexList = null;

export default {
    components: {
        IndexDetailQuick     :   IndexDetailQuick
    },
    data() {
        return {

            indexBasic : {},                    /* 선택된 지수의 마스터 정보 */
      
            form: {
                    jisuSearch: ""              /* quick Menu 에서 지수검색 데이터 */
                ,   jisuSearchYn : "Y"
                ,   jongmokSearch: ""           /* quick Menu 에서 종목검색 데이터 */
                ,   resultsCnt  : 0
            },
        };
    },
    mounted () {

        var vm = this;

        console.log( "IndexDetailList.vue -> mounted" );
    },
    created: function() {},
    beforeDestory: function() {},

    methods: {

        /*
         * 조회된 지수데이터를 설정한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexDetailList : function( paramIndexBasic, paramIndexDetailList, paramForm ) {

            var vm = this;

            console.log( "IndexDetail.vue -> fn_getIndexDetailList" );

            if( paramIndexBasic ) {
                vm.indexBasic   =   paramIndexBasic;
            }

            if( paramForm ) {
                vm.form =   paramForm;
            }

            if ( $.fn.dataTable.isDataTable( '#tableIndexList' ) ) {
                tableIndexList.destroy();
            }

            /* 유형에 따라 컬럼 헤더 변경 */
            tableIndexList = $('#tableIndexList').DataTable( {
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
                    { "title"   :   "code"          ,   "data": "isin_code"             ,   "orderable" : true, className:"txt_left" },      /* 종목코드 */
                    { "title"   :   "name"          ,   "data": "f16002"                ,   "orderable" : true, className:"txt_left"  },      /* 한글종목명 */
                    { "title"   :   "base_prc"      ,   "data": "f03003"                ,   "orderable" : true, className:"txt_right"  },      /* 전일종가 */
                    { "title"   :   "shrs"          ,   "data": "f30812"                ,   "orderable" : true, className:"txt_right"  },      /* 상장주식수 */
                    { "title"   :   "float_rto"     ,   "data": "style_includ_percnt"   ,   "orderable" : true, className:"txt_right"  },      /* 스타일포함비중 */
                    { "title"   :   "ceiling_rto"   ,   "data": "ceiling_percnt"        ,   "orderable" : true, className:"txt_right"  },      /* CEILING비중 */
                    { "title"   :   "factor_rto"    ,   "data": "f30813"                ,   "orderable" : true, className:"txt_right"  }       /* 유동주식비율 */
                ]
            });


            if( paramIndexDetailList ) {
                tableIndexList.clear().draw();
                tableIndexList.rows.add(paramIndexDetailList).draw();
                tableIndexList.draw();
            }

            vm.form.resultsCnt  =   paramIndexDetailList.length;
        },


        /*
         * 조회된 종목데이터를 설정한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexJongmokList : function( paramJongmokDataList, paramForm ) {

            var vm = this;

            console.log( "IndexDetail.vue -> fn_getIndexJongmokList" );

            if( paramForm ) {
                vm.form =   paramForm;
            }

            if ( $.fn.dataTable.isDataTable( '#tableIndexList' ) ) {
                tableIndexList.destroy();
            }

            /* 유형에 따라 컬럼 헤더 변경 */
            tableIndexList = $('#tableIndexList').DataTable( {
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
                    { "title"   :   "id"            ,   "data": "isin_code"             ,   "orderable" : true  },      /* ID */
                    { "title"   :   "name"          ,   "data": "f16002"                ,   "orderable" : true  },      /* 지수명 */
                    { "title"   :   "편입비중(%)"    ,   "data": "in_out_rate"           ,   "orderable" : true  },      /* 편입비중(%) */
                    { "title"   :   "shrs"          ,   "data": "f30812"                ,   "orderable" : true  },      /* shrs */
                    { "title"   :   "float_rto"     ,   "data": "style_includ_percnt"   ,   "orderable" : true  },      /* float_rto */
                    { "title"   :   "ceiling_rto"   ,   "data": "ceiling_percnt"        ,   "orderable" : true  },      /* ceiling_rto */
                    { "title"   :   "factor_rto"    ,   "data": "f30813"                ,   "orderable" : true  }       /* factor_rto */
                ]
            });

            if( paramJongmokDataList ) {
                tableIndexList.clear().draw();
                tableIndexList.rows.add( paramJongmokDataList ).draw();
                tableIndexList.draw();

                vm.form.resultsCnt  =   paramJongmokDataList.length;
            }
        },
             

        fn_closePop() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        }
    }
};
</script>

