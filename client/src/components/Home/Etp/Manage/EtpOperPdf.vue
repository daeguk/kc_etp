<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            <v-text-field
                                v-model="searchParam.show_search_nm"
                                :label="searchParam.show_search_nm"
                                class="pdf_search"
                                append-icon="search"
                                single-line
                                hide-details
                                @keyup.enter="searchParam.search_nm = ''; fn_getEtpOerPdf()"
                            ></v-text-field>
                            <p class="pdf_calendar">
                                <v-menu
                                    ref="menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="date2"
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
                                            widh="100%"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date2" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat @click="menu = false">Cancel</v-btn>
                                        <v-btn
                                            flat
                                            color="primary"
                                            @click="$refs.menu2.save(date2)"
                                        >OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table id="tblPdfList" class="display table01_w"></table>
                    </v-card>

                    <!-- [PDF 관리] Quick 메뉴 정보 -->
                    <EtpOperPdfQuick
                        :indexBasic = "indexBasic"
                        @showDetail="showDetail"
                        @showMessageBox="showMessageBox"

                        @fn_showDetailIndex="fn_showDetailIndex"
                        @fn_setEtpOperPdfByRate = "fn_setEtpOperPdfByRate"
                        @fn_showDetailPdf="fn_showDetailPdf"
                    ></EtpOperPdfQuick>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import $ from "jquery";
import _ from "lodash";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";

import Config from "@/js/config.js";
import EtpOperPdfQuick from "@/components/Home/Etp/Manage/EtpOperPdfQuick.vue";

var tblPdfList = null;

export default {
    props: [ "paramData" ],
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            text: "전종목",
            checkbox: true,
            date2: new Date().toISOString().substr(0, 10),
            menu2: false,
            text2: "",
            dialog: false,
            dialog2: false,
            dialog5: false,
            dialog6: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            items1: ["전체", "시장대표"],
            items: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            items2: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                },
                {
                    title: "KODEX 코스닥150 레버러지",
                    subtitle: "122630"
                }
            ],
            items3: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                }
            ],
            mini: false,
            right: null,
            rowsPerPageItems: [10, 20, 30, 50],
            headers: [
                {
                    text: "Code",
                    align: "left",
                    value: "name"
                },
                { text: "name", value: "name" },
                { text: "BasePrc", value: "BasePrc", align: "right" },
                { text: "Shrs", value: "Shrs", align: "right" },
                { text: "Float rto", value: "FloatRto", align: "right" },
                { text: "Ceiling rto", value: "CeilingRto", align: "right" },
                { text: "Factor rto", value: "FactorRto", align: "right" }
            ],
            desserts: [],
            items4: [],
            switch1: "",



            indexBasic : {},
            stateInfo: {
                pageState:  "pdf" /* pdf - PDF 관리, pdfByRate - 비중변경현황 */,
                totWidth: 0
            },
            arrShowColumn: [],
            arrShowColumnDef: [],
            searchParam : {
                show_date : "",
                search_date : "",
                show_search_nm : "",
                search_nm : ""
            }
        };
    },
    components: {
        EtpOperPdfQuick: EtpOperPdfQuick
    },
    mounted: function() {
        var vm = this;

        if( vm.paramData ) {

            vm.searchParam.f16013   =   vm.paramData.f16257;     /* ETP기초지수코드  */
            vm.searchParam.f34239   =   vm.paramData.f34239;     /* ETP기초지수MID  */

            if(     vm.paramData.index_nm
                &&  vm.paramData.f16257
            ) {
                vm.searchParam.show_search_nm   =   vm.paramData.index_nm + "(" + vm.paramData.f16257 + ")";
                vm.searchParam.search_nm        =   vm.paramData.index_nm;
            }
        }
        

        vm.searchParam.show_date    =       new Date().getFullYear() 
                                        +   "-" 
                                        +   _.padStart( (parseInt(new Date().getMonth()) + 1) , 2 , '0' )
                                        +   "-" 
                                        +   new Date().getDate();

        vm.$nextTick().then(() => {
            vm.fn_setTableInfo();
            vm.fn_getEtpOerPdf();
        });
    },
    created: function() {},
    beforeDestory: function() {},

    methods: {

        fn_showDetailIndex( gubun, paramData) {
            var vm = this;

            vm.$emit( "fn_showDetailIndex", gubun, paramData );
        },

        /*
         * ETP 지수관리 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */

        fn_getEtpOerPdf() {
            var vm = this;

            console.log("EtpOperPdf.vue -> fn_getEtpOperPdf");

            var  url = Config.base_url + "/user/etp/getEtpOperPdf";

            if( vm.stateInfo.pageState == "pdfByRate" ) {
                url = Config.base_url + "/user/etp/getEtpOperPdfByRate";
            }            

            if (tblPdfList) {
                tblPdfList.clear().draw();
            }

            vm.searchParam.search_date  =   vm.searchParam.show_date.replace(/-/g,"");
            vm.searchParam.search_date  =   vm.searchParam.search_date.replace(/\./g,"");

            if( !vm.searchParam.search_nm ) {
                vm.searchParam.search_nm   =   vm.searchParam.show_search_nm;
            }

            axios.post( url, {
                data: vm.searchParam
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var dataList = response.data.dataList;

                    if (dataList && dataList.length > 0) {
                        tblPdfList.rows.add(dataList).draw();
                        tblPdfList.draw();

                        vm.indexBasic   =   dataList[0];

                        if( vm.stateInfo.pageState == "pdfByRate" ) {

                            var rateDateList    =   response.data.rateDateList;

                            tblPdfList.columns().every(function (index) {

                                var same = rateDateList.filter(function(o, p) {
                                    return vm.arrShowColumn[index].name === o.name;
                                });                                

                                if( same && same.length == 1 ) {
                                    $( tblPdfList.column( index ).header() ).html( vm.arrShowColumn[index].title + "<br>" + same[0].date );
                                }

                            });
                        }
                    }
                }
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

            vm.fn_setTableInfo();
            vm.fn_getEtpOerPdf();
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
                paging: false,
                searching: false,
                data: [],
                autoWidth: false
            };

            /* pdf - PDF 관리, pdfByRate - 비중변경현황 */
            /* [PDF 관리] 를 선택한 경우 */
            if (vm.stateInfo.pageState == "pdf") {

                vm.fn_setArrShowColumn([
                    "date"              /* Date */,
                    "market_gubun"      /* 시장구분  */,
                    "jongmok_code"      /* 종목코드 */,
                    "jongmok_nm"        /* 종목명 */,
                    "cuShrs"            /* CU SHrs */,
                    "org_money"         /* 액면금액 */,
                    "eval_money"        /* 평가금액 */,
                    "rate"              /* 비중 */
                ]);
            } 
            /* [비중변경현황] 을 선택한 경우 */
            else if (vm.stateInfo.pageState == "pdfByRate") {
                
                vm.fn_setArrShowColumn([
                    "date"              /* 종목 */,
                    "market_gubun"      /* 시장구분 */,
                    "jongmok_code"      /* 종목코드 */,
                    "jongmok_nm"        /* 종목명 */,
                    "cuShrs"            /* CU SHrs */,
                    "org_money"         /* 액면금액 */,
                    "eval_money"        /* 평가금액 */,

                    "rate_day0"         /* 비중 당일 */,
                    "rate_day1"         /* 비중 1일전 */,
                    "rate_day2"         /* 비중 2일전 */,
                    "rate_day3"         /* 비중 3일전 */,
                    "rate_day4"         /* 비중 4일전 */,
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
                { 'name' : 'date'           , 'data': 'date'            ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-center'  , 'title' : 'Date'      },      /* Date */
                { 'name' : 'market_gubun'   , 'data': 'market_gubun'    ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-center'  , 'title' : '시장구분'  },       /* 시장구분 */
                { 'name' : 'jongmok_code'   , 'data': 'jongmok_code'    ,  'width' : '120', 'orderable' : true , 'className': 'dt-body-left'    , 'title' : '종목코드'  },       /* 종목코드 */
                { 'name' : 'jongmok_nm'     , 'data': 'jongmok_nm'      ,  'width' : '200', 'orderable' : true , 'className': 'dt-body-left'    , 'title' : '종목명'    },       /* 종목명 */
                { 'name' : 'cuShrs'         , 'data': 'cuShrs'          ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : 'CU SHrs'   },      /* CU SHrs */
                { 'name' : 'org_money'      , 'data': 'org_money'       ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '액면금액'   },      /* 액면금액 */
                { 'name' : 'eval_money'     , 'data': 'eval_money'      ,  'width' : '100', 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '평가금액'   },      /* 평가금액 */
                { 'name' : 'rate'           , 'data': 'rate'            ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중'      },      /* 비중 */

                { 'name' : 'rate_day0'      , 'data': 'rate_day0'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중'       },      /* 비중 */
                { 'name' : 'rate_day1'      , 'data': 'rate_day1'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중'       },      /* 비중 */
                { 'name' : 'rate_day2'      , 'data': 'rate_day2'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중'       },      /* 비중 */
                { 'name' : 'rate_day3'      , 'data': 'rate_day3'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중'       },      /* 비중 */
                { 'name' : 'rate_day4'      , 'data': 'rate_day4'       ,  'width' : '80' , 'orderable' : true , 'className': 'dt-body-right'   , 'title' : '비중'       },      /* 비중 */

            ];        

            var arrColumnDef  =   [
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

            vm.$emit( "showDetail", gubun, paramData );
        },

        showMessageBox: function(title, msg, option, gubun) {
            var vm = this;

            vm.$emit( "showMessageBox", title, msg, option, gubun );
        },

        fn_showDetailPdf : function( gubun, paramData ) {
            var vm = this;

            vm.$emit( "fn_showDetailPdf", gubun, paramData );
        }
    }
};
</script>

