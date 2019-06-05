<template>
    <v-container>
        <v-layout row wrap class="con_wrap">
            <v-flex grow class="conWidth_left">
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>

                            {{ searchParam.f16002 }} |
                            <span class="grey--text">({{ searchParam.f16013 }})</span>

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
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="searchParam.show_date"
                                            label="Picker in menu"
                                            append-icon="event"
                                            box
                                            outline
                                            v-on="on"
                                            @change="$refs.menu2.save(searchParam.show_date);fn_getEtpOerPdf( 'N' )"
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

                    @showDetail="showDetail"
                    @showMessageBox="showMessageBox"

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
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import dtFc from "datatables.net-fixedcolumns";

import Config from "@/js/config.js";
import EtpOperPdfQuick from "@/components/Home/Etp/Manage/EtpOperPdfQuick.vue";


var tblPdfList = null;

export default {
    props: [ "paramData" ],
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
                f16493 : "",
                f16012 : ""
            },
            pdfData : {},
            indexBasic : {},
            rateTitleList : [],
            emergency_exist_yn : "N",
        };
    },
    mounted: function() {
        var vm = this;

        console.log( ">>>>>>>>>>>>>>>>>>>> EtpOperPdf.vue mounted");

        if( vm.paramData ) {
            vm.pdfData  =   vm.paramData;
        }

        vm.fn_getPdfExistYnByNow();
        vm.fn_init();
    },
    created: function() {

    
    },
    beforeDestory: function() {
        var vm = this;
    },

    methods: {

        fn_init() {

            var vm = this;

            new Promise(function(resolve, reject) {

                if( vm.pdfData && Object.keys( vm.pdfData ).length > 0 ) {

                    vm.searchParam.f16002       =   vm.pdfData.f16002;          /* 한글종목명 */
                    vm.searchParam.f16013       =   vm.pdfData.f16013;          /* 단축코드 */

                    vm.searchParam.f16493       =   vm.pdfData.f16493;          /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    vm.searchParam.f16012       =   vm.pdfData.f16012;          /* 국제표준코드 */

                    vm.searchParam.search_nm    =   vm.searchParam.f16002 + "(" + vm.searchParam.f16013 + ")";  /* 한글종목명 / 단축코드 */

                    resolve();

                }else{
                    vm.fn_getEtpOperInfoFirstData( "A", resolve, reject );
                }

            }).catch( function(e) {

                console.log( e );

            }).then( function() {

                vm.searchParam.show_date    =       new Date().getFullYear() 
                                                +   "-" 
                                                +   _.padStart( (parseInt(new Date().getMonth()) + 1) , 2 , '0' )
                                                +   "-" 
                                                +   _.padStart( new Date().getDate(), 2, '0' ) ;

                vm.fn_setTableInfo();
                vm.fn_getEtpOerPdf( 'Y' );
            });            
        },


        /*
         *  ETP 운영정보를 조회한다.
         *  param   :   ETP지표가치산출구분(K:국내,F:해외)  / A:전종목, I:관심종목
         *  2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOperInfoFirstData( gubun, resolve, reject ) {

            var vm = this;

            try{

                axios.post(Config.base_url + "/user/etp/getEtpOperInfo", {
                    data: {
                            f34241  :   gubun
                        ,   isEtfYn :   "Y"
                        ,   firstYn :   "Y"
                    }
                }).then(function(response) {
                    console.log(response);

                    if (response.data) {
                        var dataList = response.data.dataList;

                        if (dataList && dataList.length == 1) {
                            vm.searchParam.f16002       =   dataList[0].f16002;     /* 한글종목명 */
                            vm.searchParam.f16013       =   dataList[0].f16013;     /* 단축코드 */

                            vm.searchParam.f16493       =   dataList[0].f16493;     /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                            vm.searchParam.f16012       =   dataList[0].f16012;     /* 국제표준코드 */

                            vm.searchParam.search_nm    =   vm.searchParam.f16002 + "(" + vm.searchParam.f16013 + ")";      /* 한글종목명 / 단축코드 */

                            vm.pdfData  =   dataList[0];
                        }
                    }

                    resolve();
                });
            }catch(e) {
                reject( e );
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
                    if(     !vm.searchParam.f16012          /* 국제표준코드 */
                        ||  !vm.searchParam.f16493          /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                    ) {
                        vm.$emit("showMessageBox", '확인','기준코드가 존재하지 않습니다.',{},1);
                        return  false;
                    }
                }

                vm.$emit( "fn_showProgress", true );
                axios.post( url, {
                    data: vm.searchParam
                }).then(function(response) {
                    console.log(response);

                    if (response.data) {
                        var dataList = response.data.dataList;

                        if (dataList && dataList.length > 0) {
                            tblPdfList.rows.add(dataList).draw();

                            vm.indexBasic      =   dataList[0];
                        }
                    }

                    vm.$emit( "fn_showProgress", false );
                });
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

            axios.post(  Config.base_url + "/user/etp/getEtpOperPdfByRateTitle", {
                data: vm.searchParam
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var rateTitleList = response.data.rateTitleList;

                    vm.rateTitleList =   rateTitleList;
                }

                vm.fn_setTableInfo();
                vm.fn_getEtpOerPdf( 'N' );                
            });
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

            console.log( "fn_getPdfExistYnByNow called" );
            
            vm.$emit( "fn_showProgress", true );

            axios.post( Config.base_url + "/user/etp/getPdfExistYnByNow", {
                data: {  }
            }).then(function(response) {
                console.log(response);

                vm.$emit( "fn_showProgress", false );

                if (response.data) {
                    if( response.data.emergency_exist_yn ) {
                        vm.emergency_exist_yn   =   response.data.emergency_exist_yn;
                    }
                }
            });
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
                "scrollY": '70vh',
                paging: false,
                searching: false,
                data: [],
                autoWidth: false,

                fixedColumns:   {
                    leftColumns: 4,
                }
            };

            /* pdf - PDF 관리, pdfByRate - 비중변경현황 */
            /* [PDF 관리] 를 선택한 경우 */
            if (vm.stateInfo.pageState == "pdf") {

                vm.fn_setArrShowColumn([
                        "fmt_f12506"        /* 입회일 - Date */
                    ,   "f33861"            /* ETF시장구분 - 시장구분 -  */
                    ,   "f16316"            /* 구성종목코드 - 종목코드 */
                    ,   "f16004"            /* 해외시장종목명 - 종목명 */
                    ,   "f16499"            /* 1CU단위증권수 - CU SHrs */
                    ,   "f34840"            /* 액면금액설정현금액 - 액면금액 */
                    ,   "f16588"            /* 평가금액 - 평가금액 */
                    ,   "fmt_f34743"        /* ETF_PDF비중 - 비중 */
                ]);
            } 
            /* [비중변경현황] 을 선택한 경우 */
            else if (vm.stateInfo.pageState == "pdfByRate") {
                
                vm.fn_setArrShowColumn([
                        "fmt_f12506"        /* 입회일 - Date */,
                    ,   "f33861"            /* ETF시장구분 - 시장구분 */,
                    ,   "f16316"            /* 구성종목코드 - 종목코드 */,
                    ,   "f16004"            /* 해외시장종목명 - 종목명 */,
                    ,   "f16499"            /* 1CU단위증권수 - CU SHrs */,
                    ,   "f34840"            /* 액면금액설정현금액 - 액면금액 */,
                    ,   "f16588"            /* 평가금액 - 평가금액 */,

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
                { 'name' : 'fmt_f12506'     , 'data': 'fmt_f12506'      ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-center'  , 'title' : 'Date'      },      /* Date */
                { 'name' : 'f33861'         , 'data': 'f33861'          ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-center'  , 'title' : '시장구분'  },       /* 시장구분 */
                { 'name' : 'f16316'         , 'data': 'f16316'          ,  'width' : '120', 'orderable' : true , 'className': 'dt-body-left'    , 'title' : '종목코드'  },       /* 종목코드 */
                { 'name' : 'f16004'         , 'data': 'f16004'          ,  'width' : '200', 'orderable' : true , 'className': 'dt-body-left'    , 'title' : '종목명'    },       /* 종목명 ( 해외시장종목명 ) */
                { 'name' : 'f16499'         , 'data': 'f16499'          ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : 'CU SHrs'   },      /* CU SHrs */
                { 'name' : 'f34840'         , 'data': 'f34840'          ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '액면금액'   },      /* 액면금액 */
                { 'name' : 'f16588'         , 'data': 'f16588'          ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '평가금액'   },      /* 평가금액 */
                { 'name' : 'fmt_f34743'     , 'data': 'fmt_f34743'      ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'   },      /* 비중 */

                { 'name' : 'rate_day0'      , 'data': 'rate_day0'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
                { 'name' : 'rate_day1'      , 'data': 'rate_day1'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
                { 'name' : 'rate_day2'      , 'data': 'rate_day2'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
                { 'name' : 'rate_day3'      , 'data': 'rate_day3'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
                { 'name' : 'rate_day4'      , 'data': 'rate_day4'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중 (%)'  },      /* 비중 */
            ];        

            var arrColumnDef  =   [
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

        showDetail: function(gubun, paramData) {

            var vm = this;

            if (gubun == '1') {
                vm.pdfData = paramData;
                
                vm.fn_init();
            }
        },

        showMessageBox: function(title, msg, option, gubun) {
            var vm = this;

            vm.$emit( "showMessageBox", title, msg, option, gubun );
        },
        
        fn_showDetailIndex(gubun, paramData) {
            var vm = this;

            vm.$emit( "fn_showDetailIndex", gubun, paramData );
        },

        fn_showDetailPdf(gubun, paramData) {
            var vm = this;

            vm.$emit( "fn_showDetailPdf", gubun, paramData );
        },            
    }
};
</script>

