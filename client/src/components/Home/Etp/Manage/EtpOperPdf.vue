<template>
    <v-container>
        <v-layout row wrap class="con_wrap">
            <v-flex grow class="conWidth_left">
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit w100" pb-0>

                            {{ searchParam.F16002 }} |
                            <span class="grey--text">({{ searchParam.F16013 }})</span>

                            <span class="text_result_t pdf_calendar">
                                <v-menu
                                    ref="menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="searchParam.show_date"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <v-text-field
                                        slot="activator"
                                        v-model="searchParam.show_date"
                                        label="Picker in menu"
                                        append-icon="event"
                                        box
                                        outline
                                        @keyup.enter="$refs.menu2.save(searchParam.show_date);fn_getEtpOerPdf( 'N' )"
                                        width="100%"
                                    ></v-text-field>
                                    <v-date-picker v-model="searchParam.show_date" no-title scrollable locale="ko" @input="$refs.menu2.save(searchParam.show_date);fn_getEtpOerPdf( 'N' )">
                                    </v-date-picker>
                                </v-menu>
                            </span>

                            <div class="excel_btn_down"><button type='button'  class="exceldown_btn" @click.stop="fn_downExcel"></button></div>
                        </h3>
                    </v-card-title>


                <!-- inst_cd (기관코드) 가 같은 사용자가 작성한 PDF 수정건이 있는지 -->
                    <v-card flat class="pdf_mody_w" v-if='emergency_exist_yn == "Y"'>
                        <v-toolbar card prominent>
                            <v-toolbar-title class="pdf_t">
                                <v-icon class="text_red">feedback</v-icon>PDF 수정된 내용이 있습니다.
                            </v-toolbar-title>

                            <v-btn outline small color="primary" dark   @click.stop="fn_showDetailPdf(9, pdfData)">
                                <v-icon small color="primary">add</v-icon>수정내역 보기
                            </v-btn>
                        </v-toolbar>
                    </v-card>


                    <v-card flat>
                        <table id="tblPdfList" class="tbl_type ver7"></table>
                    </v-card>

                </v-card>
            </v-flex>

           <v-flex class="conWidth_right">
                <!-- [PDF 관리] Quick 메뉴 정보 -->
                <EtpOperPdfQuick
                    :pdfData="pdfData"
                    :indexBasic = "indexBasic"
                    :toggle= "toggle"
                    @showDetail="showDetail"
                    @fn_showDetailIndex="fn_showDetailIndex"
                    @fn_setEtpOperPdfByRate="fn_setEtpOperPdfByRate"
                    @fn_showDetailPdf="fn_showDetailPdf">
                </EtpOperPdfQuick>
           </v-flex>

        </v-layout>
    </v-container>
</template>


<script>
import $ from "jquery";
import _ from "lodash";
import dt from "datatables.net";
import util       from "@/js/util.js";

import Config from "@/js/config.js";
import EtpOperPdfQuick from "@/components/Home/Etp/Manage/EtpOperPdfQuick.vue";


var tblPdfList = null;

export default {
    props: [ "paramData", "reloadYn", "toggle" ],
    components: {
        EtpOperPdfQuick                 :   EtpOperPdfQuick,
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
                F16493 : "",
                F16012 : ""
            },
            pdfData : {},
            indexBasic : {},
            rateTitleList : [],
            emergency_exist_yn : "N",

            pdfDataList : [],
        };
    },
    watch : {
        reloadYn   :   function( oldVal, newVal ) {
            var vm = this;
            
            if( !vm.reloadYn  ) {
                vm.fn_init(); 
            }
        }
    },
    mounted: function() {
        var vm = this;

        console.log( ">>>>>>>>>>>>>>>>>>>> EtpOperPdf.vue mounted");
        console.log(this.paramData);

        if( vm.paramData ) {
            vm.pdfData  =   vm.paramData;
        }

        vm.fn_init();
    },
    created: function() {

    
    },
    beforeDestory: function() {
    },
    destroyed: function() {
      // console.log("destoyed...... EtpOperPdf......");
    },

    methods: {

        fn_init() {

            var vm = this;


            if( vm.pdfData && Object.keys( vm.pdfData ).length > 0 ) {
//              vm.searchParam.F16583       =   vm.pdfData.F16583;          /* 사무수탁회사번호 */
                vm.searchParam.F16002       =   vm.pdfData.F16002;          /* 한글종목명 */
                vm.searchParam.F16013       =   vm.pdfData.F16013;          /* 단축코드 */

                vm.searchParam.F16493       =   vm.pdfData.F16493;          /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                vm.searchParam.F16012       =   vm.pdfData.F16012;          /* 국제표준코드 */

                vm.searchParam.search_nm    =   vm.searchParam.F16002 + "(" + vm.searchParam.F16013 + ")";  /* 한글종목명 / 단축코드 */


                /* tm_pdf_basic 에서 최근 F12506(일자) 정보를 조회한다. */
                vm.fn_getTmPdfBaiscMaxF12506().then( function(e1){
                    if( !e1 ) {
                        return  false;
                    }

                    /* 현재일자에 PDF 변경건이 존재하는지 반환한다. */
                    vm.fn_getPdfExistYnByNow().then( function(e2) {
                        if( !e2 ) {
                            return  false;
                        }

                        vm.fn_setTableInfo();
                        vm.fn_getEtpOerPdf( 'Y' );
                    });
                });
            } 
        },

        /*
         * ETP 지수관리 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOerPdf( initYn ) {
            var vm = this;

            console.log("EtpOperPdf.vue -> fn_getEtpOperPdf");

            var  url = Config.base_url + "/user/etp/getEtpOperPdf";

            if( vm.stateInfo.pageState == "pdfByRate" ) {
                url = Config.base_url + "/user/etp/getEtpOperPdfByRate";
            }            

            if (tblPdfList) {
                tblPdfList.clear().draw();
            }

            if( vm.pdfData && Object.keys( vm.pdfData ).length > 0 ) {

                vm.searchParam.search_date  =   vm.searchParam.show_date.replace(/-/g,"");
                vm.searchParam.search_date  =   vm.searchParam.search_date.replace(/\./g,"");
                vm.searchParam.isInstCd     =   "N";        /* 기관에 속한 정보만 노출하는지 */

                if( initYn == "N" ) {
                    if(     !vm.searchParam.F16012          /* 국제표준코드 */
                        ||  !vm.searchParam.F16493          /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    ) {
                        vm.$root.confirmt.open('확인','기준코드가 존재하지 않습니다.',{},1);
                        return  false;
                    }
                }
// console.log("fn_getEtpOerPdf............");
// console.log(vm.searchParam);
                vm.pdfDataList  =   [];

                vm.$root.progresst.open();
                util.axiosCall(
                        {
                                "url"       :   url
                            ,   "data"      :   vm.searchParam
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {

                            try{
                                vm.$root.progresst.close();

                                if (response.data) {

                                    var msg = ( response.data.msg ? response.data.msg : "" );
                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.$root.confirmt.open('확인', msg,{},1);
                                            return  false;
                                        }
                                    }

                                    var dataList = response.data.dataList;

                                    if (dataList && dataList.length > 0) {
                                        tblPdfList.rows.add(dataList).draw();

                                        vm.indexBasic   =   dataList[0];
                                        vm.pdfDataList  =   dataList;
                                    }
                                }

                            }catch(ex) {
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            vm.$root.progresst.close();
                            if( error ) {
                                vm.$root.confirmt.open('확인', error ,{},4);
                            }
                        }
                );

            }
            
        },


        /*
         *  ETP 운영정보 - > PDF 관리 에서 비중 변경현황시 타이틀 정보를 조회한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOperPdfByRateTitle() {

            var vm = this;

            console.log("EtpOperPdf.vue -> fn_getEtpOperPdfByRateTitle");

            vm.searchParam.search_date  =   vm.searchParam.show_date.replace(/-/g,"");
            vm.searchParam.search_date  =   vm.searchParam.search_date.replace(/\./g,"");
            vm.searchParam.isInstCd     =   "N";        /* 기관에 속한 정보만 노출하는지 */


            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/etp/getEtpOperPdfByRateTitle"
                        ,   "data"      :   vm.searchParam
                        ,   "method"    :   "post"
                    }
                ,   function(response) {

                        try{

                            if (response.data) {

                                var msg = ( response.data.msg ? response.data.msg : "" );
                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.$root.confirmt.open('확인', msg,{},1);
                                        return  false;
                                    }
                                }

                                var rateTitleList = response.data.rateTitleList;
                                vm.rateTitleList =   rateTitleList;
                            }

                            vm.fn_setTableInfo();
                            vm.fn_getEtpOerPdf( 'N' );  

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {

                        if( error ) {
                            vm.$root.confirmt.open('확인', error ,{},4);
                        }
                    }
            );

        },        

        fn_setEtpOperPdfByRate : function( paramData ) {

            var vm = this;

            /* 해외지수 종가 모니터링 버튼이 체크된 경우에는 해외지수 종가 모니터링 정보를 노출한다. */
            if( paramData && paramData.togglePdfByRate ) {
                vm.stateInfo.pageState  =  'pdfByRate';               /* pdf - PDF 관리 , pdfByRate - 비중변경현황 */
            }
            /* 해외지수 종가 모니터링 버튼이 두번 눌러 체크해제된 경우 지수관리 기본 정보를 노출한다.  */
            else{
                vm.stateInfo.pageState  =  'pdf';
            }            


            vm.fn_getEtpOperPdfByRateTitle();
        },

        /*
         * 현재일자에 PDF 변경건이 존재하는지 반환한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getPdfExistYnByNow() {

            var vm = this;

            return  new Promise(function(resolve, reject) {
                // console.log( "fn_getPdfExistYnByNow called" );
                vm.$root.progresst.open();
                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/etp/getPdfExistYnByNow"
                            ,   "data"      :   vm.searchParam
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            try{
                                vm.$root.progresst.close();
                                if (response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );
                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.$root.confirmt.open('확인',msg,{},4);
                                            resolve(false);
                                        }
                                    }

                                    if( response.data.emergency_exist_yn ) {
                                        vm.emergency_exist_yn   =   response.data.emergency_exist_yn;
                                    }
                                }

                                resolve(true);

                            }catch(ex) {
                                vm.$root.progresst.close();
                                console.log( "error", ex );

                                resolve(false);
                            }
                        }
                    ,   function(error) {

                            

                            if( error ) {
                                vm.$root.confirmt.open('확인', error ,{},4);
                            }

                            resolve(false);
                        }
                );


            }).catch( function(e) {
                console.log( e );
                vm.$root.progresst.close();
                vm.$root.confirmt.open('확인','서버로 부터 응답을 받지 못하였습니다.',{},4);

                resolve(false);
            })
        },

        /*
         * tm_pdf_basic 에서 최근 F12506(일자) 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getTmPdfBaiscMaxF12506() {
            var vm = this;

            return  new Promise(function(resolve, reject) {
                console.log( "fn_getTmPdfBaiscMaxF12506 called" );
                
                // 이미 검색일자가 존재하는 경우 조회하지 않게 함.
                if( vm.searchParam.show_date ) {
                    resolve(true);
                }else{
                    vm.$root.progresst.open();
                    util.axiosCall(
                            {
                                    "url"       :   Config.base_url + "/user/etp/getTmPdfBaiscMaxF12506"
                                ,   "data"      :   vm.searchParam
                                ,   "method"    :   "post"
                            }
                        ,   function(response) {

                                try{

                                    if (response.data) {
                                        var msg = ( response.data.msg ? response.data.msg : "" );
                                        if (!response.data.result) {
                                            if( msg ) {
                                                vm.$root.confirmt.open('확인', msg,{},1);
                                                resolve(false);
                                            }
                                        }

                                        if( response.data.dateInfo ) {
                                            vm.searchParam.show_date    =   response.data.dateInfo.fmt_F12506;
                                        }
                                    }
                                    vm.$root.progresst.close();
                                    resolve(true);

                                }catch(ex) {
                                    vm.$root.progresst.close();
                                    console.log( "error", ex );
                                    resolve(false);
                                }
                            }
                        ,   function(error) {
                                vm.$root.progresst.close();
                                if( error ) {
                                    vm.$root.confirmt.open('확인', msg,{},4);
                                }
                                resolve(false);
                            }
                    );

                }

            }).catch( function(e) {
                console.log( e );
                vm.$root.progresst.close();
                vm.$root.confirmt.open('확인','서버로 부터 응답을 받지 못하였습니다.',{},4);                

                resolve(false);
            })
        },

        /*
         *  테이블 기본정보를 설정한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setTableInfo(arrCustomizeColumn) {
            var vm = this;

            var tableObj = {
//              processing: true,
                serverSide: false,
                info: false, // control table information display field
                stateSave: true, //restore table state on page reload,
                lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                "scrollY": ( vm.emergency_exist_yn && vm.emergency_exist_yn == "Y" ? "680px" : '730px' ),
                paging: false,
                searching: false,
                data: [],
                autoWidth: false,

                fixedColumns:   {
                    leftColumns: 5,
                }
            };

            /* pdf - PDF 관리, pdfByRate - 비중변경현황 */
            /* [PDF 관리] 를 선택한 경우 */
            if (vm.stateInfo.pageState == "pdf") {

                vm.fn_setArrShowColumn([
                        "fmt_F12506"        /* 입회일 - Date */
                    ,   "status"            /* 상태 */
                    ,   "F33861"            /* ETF시장구분 - 시장구분 -  */
                    ,   "F16316"            /* 구성종목코드 - 종목코드 */
                    ,   "F16004"            /* 해외시장종목명 - 종목명 */
                    ,   "F16499"            /* 1CU단위증권수 - CU SHrs */
                    ,   "F34840"            /* 액면금액설정현금액 - 액면금액 */
                    ,   "F16588"            /* 평가금액 - 평가금액 */
                    ,   "fmt_F34743"        /* ETF_PDF비중 - 비중 */
                ]);
            } 
            /* [비중변경현황] 을 선택한 경우 */
            else if (vm.stateInfo.pageState == "pdfByRate") {
                
                vm.fn_setArrShowColumn([
                        "fmt_F12506"        /* 입회일 - Date */,
                    ,   "status"            /* 상태 */
                    ,   "F33861"            /* ETF시장구분 - 시장구분 */,
                    ,   "F16316"            /* 구성종목코드 - 종목코드 */,
                    ,   "F16004"            /* 해외시장종목명 - 종목명 */,
                    ,   "F16499"            /* 1CU단위증권수 - CU SHrs */,
                    ,   "F34840"            /* 액면금액설정현금액 - 액면금액 */,
                    ,   "F16588"            /* 평가금액 - 평가금액 */,

                    ,   "rate_day0"         /* 비중 당일 */,
                    ,   "rate_day1"         /* 비중 1일전 */,
                    ,   "rate_day2"         /* 비중 2일전 */,
                    ,   "rate_day3"         /* 비중 3일전 */,
                    ,   "rate_day4"         /* 비중 4일전 */,
                ]);
            }


            if ($.fn.DataTable.isDataTable("#tblPdfList")) {
                $("#tblPdfList").DataTable().destroy();
                $("#tblPdfList").empty();
            }

            if (vm.stateInfo.totWidth > 900) {
                $("#tblPdfList").attr( "style", "width: 1500px; table-layout: fixed;" );
                tableObj.scrollX = true;
            } else {
                $("#tblPdfList").attr("style", "width: 100%; ");
                tableObj.scrollX = false;
            }

            tableObj.columns = vm.arrShowColumn;
            tableObj.columnDefs = vm.arrShowColumnDef;

            tblPdfList = $("#tblPdfList").DataTable(tableObj);


            /* 비중변경 현황인 경우 비중관련 컬럼에 날짜 정보를 설정한다. */
            if( vm.stateInfo.pageState == "pdfByRate" ) {

                if( vm.rateTitleList && vm.rateTitleList.length > 0  ) {

                    tblPdfList.columns().every(function (index) {

                        var same = vm.rateTitleList.filter(function(o, p) {
                            return vm.arrShowColumn[index].name === o.name;
                        });                                

                        if( same && same.length == 1 ) {
                            $( tblPdfList.column( index ).header() ).html( vm.arrShowColumn[index].title + "<br>" + same[0].show_date );
                        }

                    });
                }
            }


            // 테이블별 이벤트
            $("#tblPdfList tbody").on( "click", "button[id=btnInav],button[id=btnEtpInfo],button[id=btnPdf]", function() {
                var table = $("#tblPdfList").DataTable();
                var data = table.row($(this).parents("tr")).data();
                var rowInx = table.row($(this)).index();
                var btnId = $(this).attr("id");
            });
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
                { 'name' : 'fmt_F12506'     , 'data': 'fmt_F12506'      ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-center'  , 'title' : 'Date'      },      /* Date */
                { 'name' : 'status'         , 'data': 'status'          ,  'width' : '30' , 'orderable' : true , 'className': 'dt-body-center'  , 'title' : '상태'      },       /* 상태 */
                { 'name' : 'F33861'         , 'data': 'F33861'          ,  'width' : '60' , 'orderable' : true , 'className': 'dt-body-center'  , 'title' : '시장구분'  },       /* 시장구분 */
                { 'name' : 'F16316'         , 'data': 'F16316'          ,  'width' : '120', 'orderable' : true , 'className': 'dt-body-left'    , 'title' : '종목코드'  },       /* 종목코드 */
                { 'name' : 'F16004'         , 'data': 'F16004'          ,  'width' : '200', 'orderable' : true , 'className': 'dt-body-left'    , 'title' : '종목명'    },       /* 종목명 ( 해외시장종목명 ) */
                { 'name' : 'F16499'         , 'data': 'F16499'          ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : 'CU SHrs'   },      /* CU SHrs */
                { 'name' : 'F34840'         , 'data': 'F34840'          ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '액면금액'   },      /* 액면금액 */
                { 'name' : 'F16588'         , 'data': 'F16588'          ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '평가금액'   },      /* 평가금액 */
                { 'name' : 'fmt_F34743'     , 'data': 'fmt_F34743'      ,  'width' : '50' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'   },      /* 비중 */

                { 'name' : 'rate_day0'      , 'data': 'rate_day0'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
                { 'name' : 'rate_day1'      , 'data': 'rate_day1'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
                { 'name' : 'rate_day2'      , 'data': 'rate_day2'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
                { 'name' : 'rate_day3'      , 'data': 'rate_day3'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
                { 'name' : 'rate_day4'      , 'data': 'rate_day4'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
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
                                    }else if( row.status == "modify" ) {
                                        htm = "변경";
                                    }
                                }

                                return htm;
                            },
                    },
                    /* CU SHrs */
                    {      
                            'name' : 'F16499'   
                        ,   "render": function ( data, type, row, meta ) {
                                let htm = "";

                                htm += util.formatNumber(data);

                                return  htm;
                            }
                    },

                    /* 액면금액 */
                    {      
                            'name' : 'F34840'   
                        ,   "render": function ( data, type, row, meta ) {
                                let htm = "";

                                htm += util.formatNumber(data);

                                return  htm;
                            }
                    },

                    /* 평가금액 */
                    {      
                            'name' : 'F16588'   
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
        showDetail: function(gubun, paramData) {

            var vm = this;

            if (gubun == '1') {
                vm.pdfData = paramData;
                
                vm.fn_init();
            }
        },
        fn_showDetailIndex(gubun, paramData) {
            var vm = this;

            vm.$emit( "fn_showDetailIndex", gubun, paramData );
        },
        fn_showDetailPdf(gubun, paramData) {
            var vm = this;

            vm.$emit( "fn_showDetailPdf", gubun, paramData );
        },
        /*
         *  엑셀을 다운로드 한다.
         *  2019-07-09  bkLove(촤병국)
         */
        fn_downExcel: function() {
            var vm = this;

            var tableList = tblPdfList.rows().data();

            if( !tableList || tableList.length == 0 ) {
                vm.$root.confirmt.open('확인','조회된 내용이 1건 이상 존재해야 합니다.',{},1);
                return  false;
            }          

            var arrHeaderNm     =   [       "Date", "상태", "시장구분", "종목코드", "종목명"
                                        ,   "CU SHrs", "액면금액", "평가금액" ];
            var arrHeaderKey    =   [       "fmt_F12506", "status", "F33861", "F16316", "F16004"
                                        ,   "F16499", "F34840", "F16588" ];
            var arrColsInfo     =   [];

            var sheetNm         =   "PDF 정보";
            var execelDataList  =   [];

            /* 비중변경현황을 선택하는 경우 */
            if( vm.stateInfo.pageState == "pdfByRate" ) {
                sheetNm         =   "PDF 비중 변경현황";

                var arrHeaderTempKey    =   [ "rate_day0", "rate_day1", "rate_day2", "rate_day3", "rate_day4" ];
                for( var i in arrHeaderTempKey ) {
                    var same = vm.rateTitleList.filter(function(o, p) {
                        return arrHeaderTempKey[i] === o.name;
                    });                                

                    if( same && same.length == 1 ) {
                        arrHeaderNm.push( "비중(%) \n" + same[0].show_date );
                    }
                }
                arrHeaderKey    =   arrHeaderKey.concat( [ "rate_day0", "rate_day1", "rate_day2", "rate_day3", "rate_day4" ] );
                arrColsInfo     =   [ {width : 15}, {width : 10}, {width : 10}, {width : 15}, {width : 30}, {width : 15}, {width : 15}, {width : 15}, {width : 15}, {width : 15}, {width : 15}, {width : 15}, {width : 15} ];
            }
            else{
                arrHeaderNm.push( "비중(%)" );
                arrHeaderKey.push( "fmt_F34743" );
                arrColsInfo     =   [ {width : 15}, {width : 10}, {width : 10}, {width : 15}, {width : 30}, {width : 15}, {width : 15}, {width : 15}];
            }


            /* key에 존재하는 데이터를 기준으로 원본 데이터 추출 */
            for( var i in tableList ) {
                var dataRow = tableList[i];
                
                var tempObj = {};
                var existCheck = _.filter( arrHeaderKey, function(o) {

                    if ( typeof dataRow[o] != "undefined" ) {

                        /* F16499="CU SHrs", F34840="액면금액", F16588="평가금액", fmt_F34743="비중(%)", rate_day0~5=비중 인 경우 */
                        if( [ "F16499", "F34840", "F16588", "fmt_F34743", "rate_day0", "rate_day1", "rate_day2", "rate_day3", "rate_day4" ].includes( o ) ) {
                            tempObj[o]  =   Number( dataRow[o] );
                        }else{
                            tempObj[o]  =   dataRow[o];
                        }
                    }
                });

                if( Object.keys(tempObj).length > 0 ) {
                    execelDataList[i]   =   tempObj;
                }
            }

            var excelInfo = {
                    excelFileNm     :   "PDF 관리"
                ,   sheetNm         :   sheetNm
                ,   dataInfo        :   execelDataList

                ,   arrHeaderNm     :   arrHeaderNm
                ,   arrHeaderKey    :   arrHeaderKey

                ,   arrColsInfo     :   arrColsInfo
            };

            util.fn_downExcel( excelInfo );
        }        
    }
};
</script>

