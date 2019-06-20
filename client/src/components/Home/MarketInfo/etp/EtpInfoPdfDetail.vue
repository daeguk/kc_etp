<template>
    <v-card flat>
        <v-layout row wrap >
            <v-flex grow>
                <v-card flat>
                     <div class="title01_w case3">
                        <v-card-title primary-title>
                            <div class="title_wrap01">
                                <h3 class="headline mb-0">
                                  {{ searchParam.f16002 }} |
                                    <span class="grey--text">({{ searchParam.f16013 }})</span>
                                    <span class="pdf_calendar">
                                <v-menu
                                    ref="menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="searchParam.show_date"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="searchParam.show_date"
                                            label="Picker in menu"
                                            append-icon="event"
                                            box
                                            outline
                                            v-on="on"
                                            @change ="$refs.menu2.save(searchParam.show_date);fn_getEtpOerPdf( 'N' )"
                                            widh="100%"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="searchParam.show_date" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat @click="menu = false">Cancel</v-btn>
                                        <v-btn
                                            flat
                                            color="primary"
                                            @click="$refs.menu2.save(searchParam.show_date);fn_getEtpOerPdf( 'N' )"
                                        >OK</v-btn>
                                    </v-date-picker>
                                </v-menu>                            
                            </span>
                            <!--v-text-field
                                v-model="searchParam.search_nm"
                                class="pdf_search ver2"
                                single-line
                                hide-details
                                :readonly="true"
                            ></v-text-field-->
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
    props: [ "paramData", "showEtpInfoPdfDetail" ],
    components : {
        ProgressBar: ProgressBar
    },
    data() {
        return {
            stateInfo: {
                pageState:  "pdf" /* pdf - PDF 관리, pdfByRate - 비중변경현황 */,
                totWidth: 0
            },
            arrShowColumn: [],
            arrShowColumnDef: [],
            searchParam : {
                show_date : "",
                search_date : "",
                search_nm : "",
                f16493 : "",
                f16012 : ""
            },
            pdfData : {},
            emergency_exist_yn : "N",
        };
    },
    mounted: function() {
        var vm = this;

        console.log( ">>>>>>>>>>>>>>>>>>>> EtpOperPdf.vue mounted");
        console.log( vm.paramData );

        vm.pdfData  =   vm.paramData;

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

                if( vm.pdfData ) {

                    vm.searchParam.f16002       =   vm.pdfData.f16002;          /* 한글종목명 */
                    vm.searchParam.f16013       =   vm.pdfData.f16013;          /* 단축코드 */

                    vm.searchParam.f16493       =   vm.pdfData.f16493;          /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    vm.searchParam.f16012       =   vm.pdfData.f16012;          /* 국제표준코드 */

                    vm.searchParam.search_nm    =   vm.searchParam.f16002 + "(" + vm.searchParam.f16013 + ")";  /* 한글종목명 / 단축코드 */
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

            if( vm.pdfData && Object.keys( vm.pdfData ).length > 0 ) {

                vm.searchParam.search_date  =   vm.searchParam.show_date.replace(/-/g,"");
                vm.searchParam.search_date  =   vm.searchParam.search_date.replace(/\./g,"");
                vm.searchParam.isInstCd     =   "N";        /* 기관에 속한 정보만 노출하는지 */

                if( initYn == "N" ) {
                    if(     !vm.searchParam.f16012          /* 국제표준코드 */
                        ||  !vm.searchParam.f16493          /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    ) {
                        vm.$emit("showMessageBox", '확인','기준코드가 존재하지 않습니다.',{},1);
                        return  false;
                    }
                }

                util.processing(vm.$refs.progress, true);
                axios.post( url, {
                    data: vm.searchParam
                }).then(function(response) {
                    console.log(response);

                    util.processing(vm.$refs.progress, false);
                    if (response.data) {
                        var msg = ( response.data.msg ? response.data.msg : "" );
                        if (!response.data.result) {
                            if( msg ) {
                                vm.$emit("showMessageBox", '확인', msg,{},1);
                                return  false;
                            }
                        }

                        var dataList = response.data.dataList;

                        if (dataList && dataList.length > 0) {
                            tblPdfList.rows.add(dataList).draw();
                        }
                    }

                }).catch(error => {
                    util.processing(vm.$refs.progress, false);
                    vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
                });
            }
            
        },

        /*
         *  테이블 기본정보를 설정한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setTableInfo(arrCustomizeColumn) {
            var vm = this;

            var tableObj = {
                processing: true,
                serverSide: false,
                info: false, // control table information display field
                stateSave: true, //restore table state on page reload,
                lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                "scrollY": '50vh',
                paging: false,
                searching: false,
                data: [],
                autoWidth: false
            };

            /* pdf - PDF 관리, pdfByRate - 비중변경현황 */
            /* [PDF 관리] 를 선택한 경우 */
            if (vm.stateInfo.pageState == "pdf") {

                vm.fn_setArrShowColumn([
                        "fmt_f12506"        /* 입회일 - Date */
                    ,   "status"            /* 상태 */
                    ,   "f33861"            /* ETF시장구분 - 시장구분 -  */
                    ,   "f16316"            /* 구성종목코드 - 종목코드 */
                    ,   "f16004"            /* 해외시장종목명 - 종목명 */
                    ,   "f16499"            /* 1CU단위증권수 - CU SHrs */
                    ,   "f34840"            /* 액면금액설정현금액 - 액면금액 */
                    ,   "f16588"            /* 평가금액 - 평가금액 */
                    ,   "fmt_f34743"        /* ETF_PDF비중 - 비중 */
                ]);
            } 

            if ($.fn.DataTable.isDataTable("#tblPdfList")) {
                $("#tblPdfList").DataTable().destroy();
                $("#tblPdfList").empty();
            }

            if (vm.stateInfo.totWidth > 900) {
                $("#tblPdfList").attr( "style", "table-layout: fixed;" );
                tableObj.scrollX = true;
            } else {
                $("#tblPdfList").attr("style", " ");
                tableObj.scrollX = false;
            }

            tableObj.columns = vm.arrShowColumn;
            tableObj.columnDefs = vm.arrShowColumnDef;

            tblPdfList = $("#tblPdfList").DataTable(tableObj);
        },

        /*
         *  테이블에서 그래프 영역에 출력될 버튼이미지를 렌더링한다.
         *  2019-05-03  bkLove(촤병국)
         */        
        fn_getGraphInfo( param ) {

            var graphContent    =   "";

            var divClass = "tooltip";
            var btnClass = "btn_icon v-icon material-icons";
            var btnSpanClass = "tooltiptext";
            var btnSpanStyle = "width:70px;";

            var btnId = "";
            var btnContent = "";
            var btnSpanContent = "";

            if( !param ) {
                return  graphContent;
            }

            if(     typeof param.btnId      === "undefined"
                ||  typeof param.btnContent === "undefined" 
            ) {
                return  graphContent;
            }


            if( typeof param.btnSpanContent != "undefined" ) {
                btnSpanContent  =   param.btnSpanContent;
            }            

            btnId           =   param.btnId;
            btnContent      =   param.btnContent;


            graphContent    +=  '<div class="' + divClass + '">';
            graphContent    +=      '<button    id="' + btnId + '" ';
            graphContent    +=      '           type="button" ';
            graphContent    +=      '           class="' + btnClass + '" ';
            graphContent    +=      '>' + btnContent + '</button>';
            graphContent    +=      '<span class="' + btnSpanClass + '" style="' + btnSpanStyle + '" >' + btnSpanContent + '</span>';
            graphContent    +=  '</div>';            

            return  graphContent;
        },    

        /*
         *  노출할 컬럼 배열정보를 통해 테이블에 컬럼을 설정한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setArrShowColumn( arrTemp ) {
            var vm = this;

            var arrColumn  =   [
                { 'name' : 'fmt_f12506'     , 'data': 'fmt_f12506'      ,  'width' : '7%' , 'orderable' : true , 'className': 'dt-body-center'  , 'title' : 'Date'     },      /* Date */
                { 'name' : 'status'         , 'data': 'status'          ,  'width' : '5%' , 'orderable' : true , 'className': 'dt-body-center'  , 'title' : '상태'      },       /* 상태 */
                { 'name' : 'f33861'         , 'data': 'f33861'          ,  'width' : '6%' , 'orderable' : true , 'className': 'dt-body-center'  , 'title' : '시장구분'  },       /* 시장구분 */
                { 'name' : 'f16316'         , 'data': 'f16316'          ,  'width' : '9%' , 'orderable' : true , 'className': 'dt-body-left'    , 'title' : '종목코드'  },       /* 종목코드 */
                { 'name' : 'f16004'         , 'data': 'f16004'          ,  'width' : '19%', 'orderable' : true , 'className': 'dt-body-left'    , 'title' : '종목명'    },       /* 종목명 ( 해외시장종목명 ) */
                { 'name' : 'f16499'         , 'data': 'f16499'          ,  'width' : '9%' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : 'CU SHrs'   },      /* CU SHrs */
                { 'name' : 'f34840'         , 'data': 'f34840'          ,  'width' : '9%' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '액면금액'   },      /* 액면금액 */
                { 'name' : 'f16588'         , 'data': 'f16588'          ,  'width' : '9%' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '평가금액'   },      /* 평가금액 */
                { 'name' : 'fmt_f34743'     , 'data': 'fmt_f34743'      ,  'width' : '6%' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
            ];        

            var arrColumnDef  =   [
                    /* 상태 */
                    {  
                            'name' : 'status'
                        ,   "render": function ( data, type, row ) {

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
                    },                
                    /* CU SHrs */
                    {      
                            'name' : 'f16499'   
                        ,   "render": function ( data, type, row, meta ) {
                                let htm = "";

                                htm += util.formatNumber(data);

                                return  htm;
                            }
                    },

                    /* 액면금액 */
                    {      
                            'name' : 'f34840'   
                        ,   "render": function ( data, type, row, meta ) {
                                let htm = "";

                                htm += util.formatNumber(data);

                                return  htm;
                            }
                    },

                    /* 평가금액 */
                    {      
                            'name' : 'f16588'   
                        ,   "render": function ( data, type, row, meta ) {
                                let htm = "";

                                htm += util.formatNumber(data);

                                return  htm;
                            }
                    },
            ];

            vm.stateInfo.totWidth    =   0;

            vm.arrShowColumn    =   [];
            vm.arrShowColumnDef =   [];


            if( arrTemp && arrTemp.length > 0 ) {

                /* 화면에 노출할 arrTemp 배열을 통해 arrShowColumn 에 노출할 컬럼 정보를 넣는다. */
                arrTemp.forEach(function(e,i) {
                    var same = arrColumn.filter(function(o, p) {
                        return o.name === e;
                    });

                    if( same.length > 0 ) {
                        vm.stateInfo.totWidth += Number( same[0].width );

                        vm.arrShowColumn.push( same[0] );
                    }
                });
            }


            if( vm.arrShowColumn.length > 0 )  {

                /* 설정한 columnDefs 가 존재하는 경우 */
                if( arrColumnDef.length > 0 ) {

                    /* 화면에 노출할 arrTemp 배열 과 일치하는 columnDefs 정보를 넣는다. */
                    vm.arrShowColumn.forEach(function(e,i) {
                        var same = arrColumnDef.filter(function(o, p) {
                            return o.name === e.name;
                        });

                        if( same.length > 0 ) {
                            same[0].targets = [ i ];
                            vm.arrShowColumnDef.push( same[0] );
                        }
                    });
                }
            }
        },

        /*
         * 팝업창을 종료한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_close() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        },
    }
};
</script>

