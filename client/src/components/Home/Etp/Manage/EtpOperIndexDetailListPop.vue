<template>

    <v-container>

        <v-dialog v-model="showDialog" persistent max-width="800">

            <v-card flat ma-3>

                <h5>
                    <v-card-title ma-0>
                        {{ indexBasic.f16002     /* 한글종목명 */ }}
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
                            <v-list-tile-title>{{ indexBasic.f16013  /* 단축코드 */ }}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>기준일</v-list-tile-title>
                            <v-list-tile-content>{{ indexBasic.fmt_f12506  /* 입회일 */ }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Last Updated</v-list-tile-title>
                            <v-list-tile-content>{{ nowDate /* 현재일 */ }}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>

                </div>


                <v-card flat>
                    <table id="tableIndexDetailList" class="display table01_w"    style="width:100%"></table>
                </v-card>

            </v-card>

        </v-dialog>

    </v-container>
</template>


<script>

import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'

import Config from '@/js/config.js';

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
    components : {},
    mounted () {

        var vm = this;

        tableIndexDetailList = $('#tableIndexDetailList').DataTable( {
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
                { "data": "isin_code"             ,   "orderable" : true, "width" :   "80" , "title"   :   "code"          },      /* 종목코드 */
                { "data": "f16002"                ,   "orderable" : true, "width" :   "200", "title"   :   "name"           },      /* 한글종목명 */
                { "data": "f03003"                ,   "orderable" : true, "width" :   "70" , "title"   :   "base_prc"      },      /* 전일종가 */
                { "data": "f30812"                ,   "orderable" : true, "width" :   "70" , "title"   :   "shrs"          },      /* 상장주식수 */
                { "data": "style_includ_percnt"   ,   "orderable" : true, "width" :   "70" , "title"   :   "float_rto"     },      /* 스타일포함비중 */
                { "data": "ceiling_percnt"        ,   "orderable" : true, "width" :   "70" , "title"   :   "ceiling_rto"   },      /* CEILING비중 */
                { "data": "f30813"                ,   "orderable" : true, "width" :   "70" , "title"   :   "factor_rto"    }       /* 유동주식비율 */
            ]
        });

        vm.fn_getIndexDetailList();

        console.log( "IndexDetailList.vue -> mounted" );

    },
    created: function() {

        var vm = this;

        vm.$EventBus.$on('changeEtpOperIndexDetailList', data => {
            console.log( "EventBus changeEtpOperIndexDetailList>>>>>>>" );
            console.log( data );

            vm.fn_getIndexDetailList();
        });

        vm.$EventBus.$on('changeEtpOperIndexDetailListClose', data => {
            vm.$EventBus.$off('changeEtpOperIndexDetailList');         
        });

    },
    beforeDestory: function() {},

    methods: {

        /*
         * 지수 목록에서 선택된 데이터를 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexDetailList : function() {

            var vm = this;

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
                        tableIndexDetailList.clear().draw();
                        tableIndexDetailList.rows.add( indexDetailList ).draw();
                        tableIndexDetailList.draw();
                    }
                }
            });            
        },

        fn_closePop() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        }
    }
};
</script>

