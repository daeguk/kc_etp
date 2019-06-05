<template>
    <v-container>
        <v-flex>
            <v-dialog v-model="showDialog" persistent max-width="900" >
                <v-card flat>
                    <v-layout row wrap >
                        <v-flex grow>

                            <v-card flat>
                                <div class="title01_w case3">
                                    <v-card-title primary-title>
                                        <div class="title_wrap01">
                                            <h3 class="headline mb-0">
                                            {{ paramData.f16002 }} |
                                                <span class="grey--text">({{ paramData.f16013 }})</span>
                                            </h3>
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
                                    <table id="tblPdfList" class="tbl_type ver7"></table>
                            </v-card>

                        </v-flex>

                        <v-flex>
                            <ProgressBar ref="progress"></ProgressBar>
                        </v-flex>            

                    </v-layout>

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

var tblPdfList = null;

export default {
    props : [ "showDialog", "paramData" ],
    components : {
        ProgressBar: ProgressBar
    },
    data() {
        return {
            searchParam : {
                show_date : "",
                search_date : "",
                search_nm : "",
                f16493 : "",
                f16012 : "",
            },
            f16002 : "",
            pdfData : {},
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
                    vm.searchParam.f16002       =   vm.paramData.f16002;            /* 한글종목명 */
                    vm.searchParam.f16013       =   vm.paramData.f16013;            /* 단축코드 */

                    vm.searchParam.f16493       =   vm.paramData.f16493;            /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    vm.searchParam.f16012       =   vm.paramData.f16012;            /* 국제표준코드 */
                }

                resolve();

            }).catch( function(e) {

                console.log( e );

            }).then( function() {

                vm.searchParam.show_date    =       new Date().getFullYear() 
                                                +   "-" 
                                                +   _.padStart( (parseInt(new Date().getMonth()) + 1) , 2 , '0' )
                                                +   "-" 
                                                +   _.padStart( new Date().getDate(), 2, '0' )

                vm.fn_setTableInfo();
                vm.fn_getEtpOerPdf( 'Y' );
            });            
        },

        /*
         *  테이블 기본정보를 설정한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setTableInfo(arrCustomizeColumn) {
            var vm = this;

            $("#tblPdfList").empty();

            tblPdfList = $("#tblPdfList").DataTable({
                "processing": true,
                "serverSide": false,
                "info": false,   // control table information display field
                "stateSave": true,  //restore table state on page reload,
                "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                "scrollY": '50vh',
                select: {
                    style:    'single',
                    selector: 'td:first-child'
                },
                paging: false,
                searching: false,
                data : [],    
                "columnDefs": [         
                    {  
                        "render": function ( data, type, row ) {

                            var htm = "";
                            if( row.status != "normal" ) {
                                htm = "<span class='text_blue'>" + data + "</span>"
                            }else{
                                htm = data;
                            }

                            return htm;
                        },
                        "targets": [0, 1, 2, 3]
                    },
                    {  
                        /* CU shrs */
                        "render": function ( data, type, row ) {
                            var htm = "";
                            if( typeof row.f16316 != "undefined" && row.f16316.length > 0 ) {       /* 구성종목코드 */
                                if( row.f16316.indexOf( "<input" ) > -1 ) {
                                    htm = util.formatNumber( data );
                                }else{
                                    /* 1CU단위증권수 */
                                    htm = "<input type='text' name='f16499' id='f16499' style='width:100%; text-align:right' value='" + util.formatNumber( data ) + "' maxlength='15'>";
                                }
                            }

                            return htm;
                        },
                        "orderable" : false,
                        "targets": 4
                    },
                    {  
                        /* 액면금액 */
                        "render": function ( data, type, row ) {
                            var htm = "";
                            if( typeof row.f16316 != "undefined" && row.f16316.length > 0 ) {       /* 구성종목코드 */
                                if( row.f16316.indexOf( "<input" ) > -1 ) {
                                    htm = util.formatNumber( data );
                                }else{
                                    /* 액면금액 */
                                    htm = "<input type='text' name='f34840' id='f34840' style='width:100%; text-align:right' value='" + util.formatNumber( data ) + "' maxlength='15'>";
                                }
                            }

                            return htm;
                        },
                        "orderable" : false,
                        "targets": 5
                    },
                    {  
                        /* 평가금액 */
                        "render": function ( data, type, row ) {

                            var htm = "";

                            htm += util.formatNumber(data);

                            return htm;
                        },
                        "orderable" : false,
                        "targets": 6
                    },              
                ],
                columns: [  
                    { "data" : "fmt_f12506"     ,   "orderable" : false  ,   "className" : "txt_center" ,   "width" :   "10%"   , "title" :   "Date"          },   /* Date */
                    { "data" : "f33861"         ,   "orderable" : false  ,   "className" : "txt_center" ,   "width" :   "8%"    , "title" :   "시장<br>구분"      },  /* 시장구분 */
                    { "data" : "f16316"         ,   "orderable" : false  ,   "className" : "txt_left"   ,   "width" :   "12%"   , "title" :   "구성종목코드"  },  /* 구성종목코드 */
                    { "data" : "f16004"         ,   "orderable" : false  ,   "className" : "txt_left"   ,   "width" :   "14%"   , "title" :   "종목명"        },  /* 종목명 */
                    { "data" : "f16499"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "CU shrs"       },  /* CU shrs */
                    { "data" : "f34840"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "액면금액"      },  /* 액면금액 */
                    { "data" : "f16588"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "평가금액"      },  /* 평가금액 */
                    { "data" : "fmt_f34743"     ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "10%"    , "title" :   "비중(%)"      },  /* 비중 */
                ]
            });
        },        

        /*
         * ETP PDF 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOerPdf( initYn ) {
            var vm = this;

            console.log("EtpOperPdf.vue -> fn_getEtpOperPdf");

            var  url = Config.base_url + "/user/etp/getEtpOperPdf";

            if (tblPdfList) {
                tblPdfList.clear().draw();
            }

            vm.searchParam.search_date  =   vm.searchParam.show_date.replace(/-/g,"");
            vm.searchParam.search_date  =   vm.searchParam.search_date.replace(/\./g,"");
            vm.searchParam.isInstCd     =   "Y";        /* 기관에 속한 정보만 노출하는지 */

            util.processing(vm.$refs.progress, true);
            axios.post( url, {
                data: vm.searchParam
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var dataList = response.data.dataList;

                    if (dataList && dataList.length > 0) {
                        tblPdfList.rows.add(dataList).draw();
                    }
                }

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

