<template>
    <v-container>
        <v-flex>
            <v-dialog v-model="showDialog" persistent  max-width="1100"  >
                <v-card class="mx-auto" height="400">
                    <v-card flat class="listset_pop">
                        <v-card flat>
                            <v-layout row wrap >
                                <v-flex grow>

                                    <v-card flat>
                                        <div class="title01_w case3">
                                            <v-card-title primary-title>
                                                <div class="title_wrap01">
                                                    <div class="right_btn">
                                                        <v-btn icon  @click="fn_close">
                                                            <v-icon>close</v-icon>
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </v-card-title>
                                        </div>      
                                    </v-card>

                                    <v-card flat>
                                        
                                        <v-flex xs12    v-for="subData in allDataList" :key='"step3_"  + subData.etf_f16012'>

                                            <h4>
                                                {{ subData.etf_f16002           /* ETF 한글종목명 */    }}
                                                <span>{{ subData.etf_f16013     /* ETF 단축코드 */      }}</span>
                                            </h4>

                                            <table v-bind:id='"step3_" + subData.etf_f16012' class="tbl_type ver7" style="width:100%">
                                                <colgroup>
                                                    <col width="18%">       <!-- email -->
                                                    <col width="8%">        <!-- 시간 -->
                                                    <col width="6%">        <!-- 상태 -->
                                                    <col width="10%">       <!-- CODE -->
                                                    <col width="18%">       <!-- 종목 -->

                                                    <col width="10%">       <!-- CU shrs -->
                                                    <col width="10%">

                                                    <col width="10%">       <!-- 액면금액 -->
                                                    <col width="10%">                                        
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th class="txt_center"  rowspan="2">email</th>
                                                        <th class="txt_center"  rowspan="2">시간</th>
                                                        <th class="txt_center"  rowspan="2">상태</th>
                                                        <th class="txt_center"  rowspan="2">CODE</th>
                                                        <th class="txt_left"    rowspan="2">종목</th>
                                                        <th class="txt_center"  colspan="2">CU shrs</th>
                                                        <th class="txt_center"  colspan="2">액면금액</th>
                                                    </tr>
                                                    <tr>
                                                        <th class="txt_right">변경전</th>
                                                        <th class="txt_right">변경후</th>
                                                        <th class="txt_right">변경전</th>
                                                        <th class="txt_right">변경후</th>                                            
                                                    </tr>
                                                </thead>
                                            </table>

                                        </v-flex>

                                    </v-card>

                                </v-flex>

                                <v-flex>
                                    <ProgressBar ref="progress"></ProgressBar>
                                </v-flex>

                            </v-layout>

                        </v-card>
                    </v-card>
                </v-card>
            </v-dialog>
        </v-flex>
    </v-container>
     
</template>


<script>
import $ from "jquery";
import _ from "lodash";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import dtFc from "datatables.net-fixedcolumns";

import Config from "@/js/config.js";
import ProgressBar from "@/components/common/ProgressBar.vue";

var tblPdfHistList = null;

export default {
    props : [ "showDialog", "paramData" ],
    components : {
        ProgressBar: ProgressBar
    },
    data() {
        return {
            searchParam : {
                now_date : "",
                search_date : "",
                search_nm : "",
                f16493 : "",
                f16012 : "",
            },
            f16002 : "",
            pdfData : {},
            allDataList : []
        };
    },
    mounted: function() {
        var vm = this;

        console.log( ">>>>>>>>>>>>>>>>>>>> EtpOperPdfHistPop.vue mounted");8

        vm.fn_init();
    },
    created: function() {
        var vm = this;

    },
    beforeDestory: function() {
        var vm = this;
    },

    methods: {

        fn_init() {

            var vm = this;

            new Promise(function(resolve, reject) {

                if( vm.paramData ) {
                    vm.searchParam.f16583       =   vm.paramData.f16583;            /* 사무수탁회사번호 */
                    vm.searchParam.f16002       =   vm.paramData.f16002;            /* 한글종목명 */
                    vm.searchParam.f16013       =   vm.paramData.f16013;            /* 단축코드 */

                    vm.searchParam.f16493       =   vm.paramData.f16493;            /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    vm.searchParam.f16012       =   vm.paramData.f16012;            /* 국제표준코드 */
                }

                resolve();

            }).catch( function(e) {

                console.log( e );

            }).then( function() {

                vm.searchParam.now_date     =       new Date().getFullYear() 
                                                +   _.padStart( (parseInt(new Date().getMonth()) + 1) , 2 , '0' )
                                                +   _.padStart( new Date().getDate(), 2, '0' );
                vm.searchParam.isInstCd     =   "Y";        /* 기관에 속한 정보만 노출하는지 */

                vm.fn_getEtpOperPdfEmergencyHistNow();
            });            
        },

        /*
         * ETP PDF 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOperPdfEmergencyHistNow() {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop -> fn_getEtpOperPdfEmergencyHistNow");            

            util.processing(vm.$refs.progress, true);
            axios.post( Config.base_url + "/user/etp/getEtpOperPdfEmergencyHistNow", {
                data: vm.searchParam
            }).then(function(response) {

                console.log(response);

                util.processing(vm.$refs.progress, false);
                if (response.data) {

                    if( !response.data.result ) {
                        vm.$emit("showMessageBox", '확인', response.data.msg,{},1);
                        return  false;
                    }

                    if( response.data.allDataList.length > 0 ) {
                        vm.allDataList  =   response.data.allDataList;

                        vm.step     =   3;
                        if( vm.allDataList.length > 0 ) {

                            var items = [];

                            for ( let subData of vm.allDataList ) {
                                if ( $.fn.DataTable.isDataTable('#step3_' + subData.etf_f16012 ) ) {
                                    $('#step3_' + subData.etf_f16012).DataTable().destroy();
                                }
                            }

                            for ( let subData of vm.allDataList ) {

                                vm.$nextTick().then(() => {

                                    if ( $.fn.DataTable.isDataTable('#step3_' + subData.etf_f16012 ) ) {
                                        $('#step3_' + subData.etf_f16012).DataTable().destroy();
                                    }   

                                    items = subData.data;

                                    console.log("subData.etf_f16012=[" + subData.etf_f16012 + "]");
                                    console.log( "items" );
                                    console.log( items );
                                    
                                    $( '#step3_' + subData.etf_f16012 ).DataTable( {
                                            "processing": true,
                                            "serverSide": false,
                                            "info": false,   // control table information display field
                                            "stateSave": true,  //restore table state on page reload,
                                            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                            "scrollY": '15vh',
                                            select: {
                                                style:    'single',
                                                selector: 'td:first-child'
                                            },
                                            paging: false,
                                            searching: false,
                                            data : items,
                                            ordering : false,
                                            "columnDefs": [
                                                {  
                                                    /* 상태 */
                                                    "render": function ( data, type, row ) {

                                                        var htm = "";
                                                        if( typeof row.status != "undefined" ) {
                                                            if( row.status == "insert" ) {
                                                                htm = "신규";
                                                            }else{
                                                                htm = "변경";
                                                            }
                                                        }

                                                        return htm;
                                                    },
                                                    "targets": 2
                                                },
                                                {  
                                                    /* CU shrs (변경전) */
                                                    "render": function ( data, type, row ) {

                                                        var htm = "";
                                                        if( typeof row.status != "undefined" ) {
                                                            if( row.status == "insert" ) {
                                                                htm = "-";
                                                            }else{
                                                                htm = util.formatNumber( data );
                                                            }
                                                        }

                                                        return htm;
                                                    },
                                                    "targets": 5
                                                },
                                                {  
                                                    /* CU shrs (변경후) */
                                                    "render": function ( data, type, row ) {

                                                        var htm = "";
                                                        htm    +=  util.formatNumber( data );

                                                        return htm;
                                                    },
                                                    "targets": 6
                                                },
                                                {  
                                                    /* 액면금액 (변경전) */
                                                    "render": function ( data, type, row ) {

                                                        var htm = "";
                                                        if( typeof row.status != "undefined" ) {
                                                            if( row.status == "insert" ) {
                                                                htm = "-";
                                                            }else{
                                                                htm = util.formatNumber( data );
                                                            }
                                                        }

                                                        return htm;
                                                    },
                                                    "targets": 7
                                                },
                                                {  
                                                    /* 액면금액 (변경후) */
                                                    "render": function ( data, type, row ) {

                                                        var htm = "";
                                                        htm    +=  util.formatNumber( data );

                                                        return htm;
                                                    },
                                                    "targets": 8
                                                },
                                            ],
                                            columns: [
                                                { "data" : "email"          ,   "width" :   "18%"   ,   "orderable" : false  ,   "className" : "txt_left"       },     /* 이메일 */
                                                { "data" : "fmt_reg_time"   ,   "width" :   "8%"    ,   "orderable" : false  ,   "className" : "txt_center"     },     /* 시간 */
                                                { "data" : "status"         ,   "width" :   "6%"    ,   "orderable" : false  ,   "className" : "txt_center"     },     /* 상태 */
                                                { "data" : "f16316"         ,   "width" :   "10%"   ,   "orderable" : false  ,   "className" : "txt_left"       },     /* 코드 */
                                                { "data" : "f16004"         ,   "width" :   "18%"   ,   "orderable" : false  ,   "className" : "txt_left"       },     /* 종목명 */

                                                { "data" : "f16499_prev"    ,   "width" :   "10%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* CU shrs (변경전) */
                                                { "data" : "f16499"         ,   "width" :   "10%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* CU shrs */

                                                { "data" : "f34840_prev"    ,   "width" :   "10%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* 액면금액 (변경전) */
                                                { "data" : "f34840"         ,   "width" :   "10%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* 액면금액 */
                                            ]
                                    }).draw();
                                });
                            }
                        }
                    }
                }
            }).catch(error => {
                util.processing(vm.$refs.progress, false);
            });
        },

        /*
         * 팝업창을 종료한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_close() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        }        
    }
};
</script>

