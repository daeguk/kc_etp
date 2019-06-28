<template>
    <v-container>
    <v-flex>
    <v-dialog v-model="showDialog" persistent max-width="900">
        
        <v-card class="mx-auto">

            <v-window v-model="step">


                <v-window-item :value="1">
<!---step1 START-->
                    <v-card flat class="listset_pop">
                        <h5>
                            <v-card-title ma-0>
                                {{ etpBasic.F16002          /* 한글종목명 */ }}
                                <span>{{ etpBasic.F16013    /* 단축코드 */ }}</span>

                                <v-spacer></v-spacer>
                                <v-btn icon @click="fn_close">
                                    <v-icon>close</v-icon>
                                </v-btn>                                
                            </v-card-title>

                        </h5>

                        <v-card flat class="pdf_mody_w">
                            <v-toolbar card prominent>
                                <v-toolbar-title class="pdf_t">
                                    <v-icon class="text_red">feedback</v-icon>PDF 수정 모드입니다.
                                </v-toolbar-title>

                                <v-btn outline small color="primary" dark   @click="fn_addRow()">
                                    <v-icon small color="primary">add</v-icon>자산추가
                                </v-btn>

                                <!-- 개발 중복 자산추가 팝업 end -->
                            </v-toolbar>
                        </v-card>
                        
                        <v-card flat>

                            <table :id="tblEmergeny01" class="tbl_type ver7" style="width:100%" >

                                <colgroup>
                                    <col width="10%">
                                    <col width="8%">
                                    <col width="12%">
                                    <col width="14%">
                                    <col width="12%">
                                    <col width="12%">
                                    <col width="12%">
                                    <col width="10%">
                                    <col width="9%">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th class="txt_center">Date</th>
                                        <th class="txt_center">시장<br>구분</th>
                                        <th class="txt_left">구성종목코드</th>
                                        <th class="txt_left">종목명</th>
                                        <th class="txt_right">CU shrs</th>
                                        <th class="txt_right">액면금액</th>
                                        <th class="txt_right">평가금액</th>
                                        <th class="txt_right">비중</th>
                                        <th class="txt_right"></th>
                                    </tr>
                                </thead> 

                            </table>
                        </v-card>
                    </v-card>
                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <span style="color:red">{{ jongmok_state_msg }}</span>
                        <v-btn color="primary" depressed @click="fn_stepCheck(1)">Next</v-btn>
                    </v-card-actions>
<!-- step1 END-->
                </v-window-item>





                <v-window-item :value="2">
<!---step2 START-->
                    <v-card flat class="listset_pop">
                        <h5>
                            <v-card-title ma-0>
                                <v-btn icon :disabled="step === 1" flat @click='step--; jongmok_state = ""; jongmok_state_msg = "";' >
                                    <v-icon>arrow_back_ios</v-icon>
                                </v-btn>PDF 변경신청 현황

                                <v-spacer></v-spacer>
                                <v-btn icon @click="fn_close">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-card-title>
                        </h5>
                        <v-card flat>
                            <v-flex xs12    v-for="subData in allDataList" :key='"step2_" + subData.etf_F16012'>

                                <h4>
                                    {{ subData.etf_F16002           /* ETF 한글종목명 */    }}
                                    <span>{{ subData.etf_F16013     /* ETF 단축코드 */      }}</span>
                                </h4>

                                <table v-bind:id='"step2_" + subData.etf_F16012' class="tbl_type ver7" style="width:100%">
                                    <colgroup>
                                        <col width="10%">       <!-- 구분 -->
                                        <col width="15%">       <!-- CODE -->
                                        <col width="15%">       <!-- 종목 -->

                                        <col width="15%">       <!-- CU shrs -->
                                        <col width="15%">

                                        <col width="15%">       <!-- 액면금액 -->
                                        <col width="15%">                                        
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th class="txt_center"  rowspan="2">구분</th>
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
                        <v-card flat class="pdf_context">
                            <div
                                class="pdf_coment text-xs-center"
                            >* 추가로 변경하실 ETF 종목이 있다면 [추가 변경]을 선택하세요.</div>
                            <p class="text-xs-center">다른 ETF의 PDF를 변경하시겠습니까?</p>
                            <div class="pop_btn_w">
                                <p class="pdfmody_btn">

                                    <v-btn fab dark depressed color="primary" :disabled="disabledAddEtfOperPdf" @click="fn_showAddEtfOperPdf()">
                                        <v-icon dark large>add</v-icon>
                                    </v-btn>네, 추가 변경 작업을 진행합니다.

                                    <v-expansion-panel v-model="showAddEtfOperPdfPanel" expand>
                                        <v-expansion-panel-content flat>
                                            <v-card flat>
                                                <v-card-text>
                                                    <div class="pdfmody_panel">
                                                        <span>
                                                            <v-text-field
                                                                placeholder="ETP의 종목코드 12자리 또는 단축코드를 입력하세요"
                                                                value
                                                                outline
                                                                class="width_fix2"
                                                                v-model="txtAddEtpCode"
                                                                maxlength="15"
                                                            ></v-text-field>
                                                        </span>
                                                        <span>
                                                            <v-btn outline small color="primary" @click="fn_addEtfOperPdfModify">확인</v-btn>
                                                            <v-btn outline small color="#9e9e9e" @click="fn_addEtfOperPdfModifyCancel">취소</v-btn>
                                                        </span>
                                                        <span style="color:red">
                                                            {{ result.msg }}
                                                        </span>
                                                    </div>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </p>
                                <p class="pdfmody_btn">
                                    <v-btn fab dark depressed color="primary" :disabled="disabledSubmit2" @click="fn_stepCheck(2)">
                                        <v-icon dark large>navigate_next</v-icon>
                                    </v-btn>아니오, 지금까지 변경한 내용을 제출합니다.
                                </p>
                            </div>
                        </v-card>
                    </v-card>
                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                    </v-card-actions>
<!--step2 END-->
                </v-window-item>

                <v-window-item :value="3">
<!---step3 START-->
                    <v-card flat class="listset_pop">
                        <h5>
                            <v-card-title ma-0>
                                PDF 변경신청 완료
                                <v-spacer></v-spacer>

                                <v-btn icon @click="fn_close">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-card-title>
                        </h5>

                        <v-card flat>
                            <v-flex xs12    v-for="subData in allDataList" :key='"step3_"  + subData.etf_F16012'>

                                <h4>
                                    {{ subData.etf_F16002           /* ETF 한글종목명 */    }}
                                    <span>{{ subData.etf_F16013     /* ETF 단축코드 */      }}</span>
                                </h4>

                                <table v-bind:id='"step3_" + subData.etf_F16012' class="tbl_type ver7" style="width:100%">
                                    <colgroup>
                                        <col width="10%">       <!-- 구분 -->
                                        <col width="15%">       <!-- CODE -->
                                        <col width="15%">       <!-- 종목 -->

                                        <col width="15%">       <!-- CU shrs -->
                                        <col width="15%">

                                        <col width="15%">       <!-- 액면금액 -->
                                        <col width="15%">                                        
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th class="txt_center"  rowspan="2">구분</th>
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


                        <v-card flat class="pdf_context">
                            <div class="pdf_coment text-xs-center text_blue">
                                <b>
                                    PDF 변경 신청이 완료되었습니다.
                                    <br>신속한 작업을 위해 내역을 제출하신 후 코스콤 담당자와 통화해주세요
                                </b>
                            </div>
                            <div class="pdf_coment text-xs-center">
                                신일식 과장 02-767-8747
                                <br>이형준 과장 02-767-8750
                                <br>오춘교 대리 02-767-8735
                            </div>
                            <p class="text-xs-center">
                                <v-btn dark depressed color="primary" @click="fn_close">닫기</v-btn>
                            </p>
                        </v-card>
                    </v-card>
                    <v-card-actions></v-card-actions>
<!--step3 END-->
                </v-window-item>
            </v-window>

        </v-card>

    </v-dialog>
    </v-flex>
    <v-flex>
        <ProgressBar ref="progress"></ProgressBar>
    </v-flex>    
    </v-container>    

</template>



<script>
import $ from "jquery";
import _ from "lodash";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import Config from "@/js/config.js";
import tool       from "@/js/common/tool/tool.js";

import ProgressBar from "@/components/common/ProgressBar.vue";

var tblEmergeny01 = null;

export default {
    props : [ "showDialog", "paramData" ],
    components : {
        ProgressBar: ProgressBar,
    },
    data() {
        return {
            step: 1,
            tblEmergeny01 : "tblEmergeny01",
            etpBasic : {},
            dataList : [],
            allDataList : [],
            disabledAddEtfOperPdf : false,
            showAddEtfOperPdfPanel : [false],
            disabledSubmit2 : false,
            txtAddEtpCode : "",
            result : {
                    flag : true
                ,   msg: ""
            },
            search_date : "",

            jongmok_state : "", /* ksp_jongbasic DB 조회 상태 */
            jongmok_state_msg : "",
        };
    },
    created: function() {

        var vm = this;
    },
    mounted: function() {

        var vm = this;


        console.log( ">>>>>> EtpOperPdfEmergencyModifyPop.vue ==> " );
        console.log( vm.paramData );

        tblEmergeny01   =   $('#' + vm.tblEmergeny01 ).DataTable( {
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
                        if( typeof row.F16316 != "undefined" && row.F16316.length > 0 ) {       /* 구성종목코드 */
                            if( row.F16316.indexOf( "<input" ) > -1 ) {
                                htm = util.formatNumber( data );
                            }else{
                                /* 1CU단위증권수 */
                                htm = "<input type='text' name='F16499' id='F16499' style='width:100%; text-align:right' value='" + util.formatNumber( data ) + "' maxlength='20'>";
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
                        if( typeof row.F16316 != "undefined" && row.F16316.length > 0 ) {       /* 구성종목코드 */
                            if( row.F16316.indexOf( "<input" ) > -1 ) {
                                htm = util.formatNumber( data );
                            }else{
                                /* 액면금액 */
                                htm = "<input type='text' name='F34840' id='F34840' style='width:100%; text-align:right' value='" + util.formatNumber( data ) + "' maxlength='20'>";
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
                { 
                    "targets": 8,
                    "render": function ( data, type, row ) {
                        if (data) {
                            if ( row.status == "insert" ) {
                                return "<div class='tooltip'><button id='btnDelete' name='btnDelete' type='button' class='btn_icon v-icon material-icons'>delete</button><span class='tooltiptext' style='width:40px;'>삭제</span></div>";
                            }else{
                                return "";
                            }
                        } else {
                            return "";
                        }
                    },
                },                 
            ],
            columns: [  
                { "data" : "fmt_F12506"     ,   "orderable" : false  ,   "className" : "txt_center" ,   "width" :   "10%"   , "title" :   "Date"          },   /* Date */
                { "data" : "F33861"         ,   "orderable" : false  ,   "className" : "txt_center" ,   "width" :   "8%"    , "title" :   "시장<br>구분"      },  /* 시장구분 */
                { "data" : "F16316"         ,   "orderable" : false  ,   "className" : "txt_left"   ,   "width" :   "12%"   , "title" :   "구성종목코드"  },  /* 구성종목코드 */
                { "data" : "F16004"         ,   "orderable" : false  ,   "className" : "txt_left"   ,   "width" :   "14%"   , "title" :   "종목명"        },  /* 종목명 */
                { "data" : "F16499"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "CU shrs"       },  /* CU shrs */
                { "data" : "F34840"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "액면금액"      },  /* 액면금액 */
                { "data" : "F16588"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "평가금액"      },  /* 평가금액 */
                { "data" : "fmt_F34743"     ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "10%"    , "title" :   "비중(%)"      },  /* 비중 */
                { "data": null              ,   "orderable" : false  ,   "align":"center"           ,   "width" :   "9%"    , defaultContent:"" },

                { "data" : "status"         ,   "visible"   : false   },                                                                /* status */
                { "data" : "code_check"     ,   "visible"   : false   },                                                                /* code_check */
                { "data" : "F16499_prev"    ,   "visible"   : false   },                                                                /* CU shrs (변경전) */
                { "data" : "F34840_prev"    ,   "visible"   : false   },                                                                /* 액면금액 (변경전) */
            ]
        });

        /* [자산추가] 후 확인 종목코드에 엔터키 입력시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('keyup', "input[name='jongmok']", function (e) {
            if( e.keyCode == 13 ) {

                var table = $("#" + vm.tblEmergeny01 ).DataTable();
                var data = table.row($(this).parents("tr")).data();
                var rowIndex = table.row($(this).parents("tr")).index();
                var nowData = {
                    F16499 : 0
                };

                vm.fn_getJongmokData( { 
                        status : "insert"
                    ,   codeVal : $(this).parents("tr").find( "input[name='jongmok']" ).eq(0).val()
                    ,   tableData: data
                    ,   nowData : nowData
                    ,   rowIndex : rowIndex
                    ,   F16499_prev : 0
                });
            }
        });        

        /* [자산추가] 후 확인 버튼 클릭시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('click', "button[name='confirm']", function () {

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var nowData = {
                F16499 : 0
            };            

            vm.fn_getJongmokData( { 
                    status : "insert"
                ,   codeVal : $(this).parents("tr").find( "input[name='jongmok']" ).eq(0).val()
                ,   tableData: data
                ,   nowData : nowData
                ,   rowIndex : rowIndex
                ,   F16499_prev : 0
            });            
        });

        /* CU shrs 수정시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('blur', "input[name='F16499'],input[name='F34840']", function () {

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var jongmokTag = $(this).parents("tr").find( "input[name='jongmok']" );
            var nowData = {};
            var tdData = _.replace( $(this).eq(0).val(), /,/g, "" );
            $(this).eq(0).val( tdData );            

            /* CU shrs */
            if ( $(this).attr('name') == 'F16499' ) {
                nowData.name    =   "F16499";
                nowData.F16499  =   tdData;
            }
            /* 액면금액 */
            else if( $(this).attr('name') == 'F34840' ) {
                nowData.name    =   "F34840";
                nowData.F34840  =   tdData;
            }

            $(this).eq(0).val( util.formatNumber( tdData ) );

            vm.fn_setStatus( data, nowData, rowIndex, ( jongmokTag ? jongmokTag.length : 0 ), $(this) );
        });

        // 삭제버튼 클릭시
        $('#' + vm.tblEmergeny01 + ' tbody').on('click', 'button[name=btnDelete]', function () {
            var table = $('#' + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents('tr')).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var jongmokTag = $(this).parents("tr").find( "input[name='jongmok']" );            

            vm.fn_deleteTableData( data, $(this).eq(0).val(), rowIndex, ( jongmokTag ? jongmokTag.length : 0 ) );
        });

        var searchParam                 =   {}
        searchParam.F16012              =   vm.paramData.F16012;                   /* 국제표준코드 */
        searchParam.F16013              =   vm.paramData.F16013;                   /* 단축코드 */
/* 여러종류의 ETF 코드 데이터 저장을 위해 임시로 처리함 */
//        searchParam.F16012              =   "KR7322410002";
        searchParam.initYn              =   "Y";

        vm.fn_getEtpOperPdfModify( searchParam );
    },
        
    methods: {

        // Create an array the length of our items
        // with all values as true
        all() {
            this.panel = [...Array(this.items).keys()].map(_ => true);
        },        

        /*
         * ETP PDF 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOperPdfModify( searchParam ) {

            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop -> fn_getEtpOperPdfModify");

            if (tblEmergeny01) {
                tblEmergeny01.clear().draw();
            }

            vm.etpBasic =   {};
            vm.dataList =   [];

            vm.result.flag  =   true;
            vm.result.msg   =   '';

            


            /* tm_pdf_basic 에서 최근 F12506(일자) 정보를 조회한다. */
            vm.fn_getTmPdfBaiscMaxF12506( searchParam ).then( async function(e1){
                if( !e1 ) {
                    return  false;
                }            

                if( !vm.search_date ) {
                    if( await vm.$emit('showMessageBox', '확인', "최근일자 정보가 존재하지 않습니다.",{},1) ) {
                        return  false;
                    }
                }

                searchParam.isEtfYn     =   "Y";

                util.processing(vm.$refs.progress, true);
                axios.post( Config.base_url + "/user/etp/getEtpOperPdfModify", {
                    data: searchParam
                }).then( async function(response) {
                    console.log(response);

                    util.processing(vm.$refs.progress, false);

                    if (response.data) {

                        var msg = ( response.data.msg ? response.data.msg : "" );
                        if (!response.data.result) {
                            if( msg ) {
                                if( await vm.$emit('showMessageBox', '확인', msg,{},1) ) {
                                    return  false;
                                }
                            }
                        }

                        var etpBasic = response.data.etpBasic;
                        var dataList = response.data.dataList;

                        if( searchParam.initYn == "N" ) {

                            if( etpBasic && Object.keys( etpBasic ).length > 0 ) {

                                /* allDataList 에서 존재하는 인덱스를 확인한다. */
                                var filterIndex  =   _.findIndex( vm.allDataList,    {
                                        "etf_F16012"    :   etpBasic.F16012      /* ETF 국제표준코드 */
                                    ,   "etf_F16013"    :   etpBasic.F16013      /* ETF 단축코드 */
                                });

                                if( filterIndex > -1 ) {
                                    vm.result.flag  =   false;
                                    vm.result.msg   =   '해당 코드는 이미 변경작업에 존재합니다. 다른 코드를 선택해 주세요.';

                                    return  false;
                                }

                                /* 로그인 운용사코드와 동일한지 체크 */
                                if( etpBasic.login_F33960_check != "Y" ) {
                                    vm.result.flag  =   false;
                                    vm.result.msg   =   '타 발행사의 종목은 변경하실수 없습니다.';

                                    return  false;
                                }

                                /* 사무수탁회사번호 가 없는 경우 */
    /* 여러종류의 ETF 코드 데이터 저장을 위해 임시로 처리함 */
    //etpBasic.F16583 = 10;
                                if( etpBasic.F16583 == "" ) {
                                    vm.result.flag  =   false;
                                    vm.result.msg   =   '사무수탁회사번호가 존재하지 않습니다.';

                                    return  false;
                                }

                            }else{

                                vm.result.flag  =   false;
                                vm.result.msg   =   '해당코드의 종목이 존재하지 않습니다.';

                                return  false;
                            }
                        }

                        vm.txtAddEtpCode    =   "";

                        vm.step             =   1;
                        vm.etpBasic         =   etpBasic;

                        if (dataList && dataList.length > 0) {
                            tblEmergeny01.rows.add( dataList ).draw();
                            tblEmergeny01.draw();

                            vm.dataList =   dataList;
                        }
                    }
                    
                }).catch(error => {
                    util.processing(vm.$refs.progress, false);
                    vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
                });
            });
        },

        /*
         * tm_pdf_basic 에서 최근 F12506(일자) 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getTmPdfBaiscMaxF12506( searchParam ) {
            var vm = this;

            return  new Promise(function(resolve, reject) {
                console.log( "fn_getTmPdfBaiscMaxF12506 called" );
                
                // 이미 검색일자가 존재하는 경우 조회하지 않게 함.
                if( vm.search_date ) {
                    searchParam.search_date     =  vm.search_date;
 
                    resolve(true);
                }else{
                    util.processing(vm.$refs.progress, true);
                    axios.post( Config.base_url + "/user/etp/getTmPdfBaiscMaxF12506", {
                        data: searchParam
                    }).then(function(response) {
                        console.log(response);

                        util.processing(vm.$refs.progress, false);
                        if (response.data) {

                            var msg = ( response.data.msg ? response.data.msg : "" );
                            if (!response.data.result) {
                                if( msg ) {
                                    resolve(false);
                                }
                            }

                            if( response.data.dateInfo ) {
                                vm.search_date      =   response.data.dateInfo.F12506;
                            }
                        }

                        resolve(true);
                        
                    }).catch(error => {
                        console.log( error );
                        util.processing(vm.$refs.progress, false);
                        vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);

                        resolve(false);
                    });
                }

            }).catch( function(e) {
                console.log( e );

                util.processing(vm.$refs.progress, false);
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);

                resolve(false);
            });
        },        

        /*
         * [자산 추가] 후 구성종목 찾기를 누를시 실행한다.
         * 2019-05-03  bkLove(촤병국)
         */
        async fn_getJongmokData( dataJson ) {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop -> fn_getJongmokData");

            vm.jongmok_state    =   "ing";

            if( dataJson.status == "insert" ) {
                if(     !dataJson.codeVal
                    ||  dataJson.codeVal.length == 0
                ) {
                    if( await vm.$emit("showMessageBox", '확인','구성종목코드를 입력해 주세요.',{},1) ) {
                        return  false;
                    }
                }

                if(  dataJson.codeVal.length < 6 ) {
                    if( await vm.$emit("showMessageBox", '확인','구성종목코드를 6자리 이상 입력해 주세요.',{},1) ) {
                        return  false;
                    }
                }
            }

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var tr = table.row( dataJson.rowIndex );            

            util.processing(vm.$refs.progress, true);
            axios.post( Config.base_url + "/user/etp/getJongmokData", {
                data: { "searchCode" : dataJson.codeVal }
            }).then(async function(response) {
                console.log(response);

                util.processing(vm.$refs.progress, false);

                if (response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );
                    if (!response.data.result) {
                        if( msg ) {
                            if( await vm.$emit('showMessageBox', '확인', msg,{},1) ) {
                                if( typeof dataJson.tableData.F16499_prev != "undefined" ) {
                                    if( dataJson.thisTag ) {
                                        dataJson.thisTag.eq(0).val( util.formatNumber( dataJson.tableData.F16499_prev ) );
                                    }
                                }                                
                                return  false;
                            }
                        }
                    }

                    var dataList = response.data.dataList;
                    if ( !dataList || dataList.length == 0 ) {
                        if( await vm.$emit('showMessageBox', '확인', '구성종목코드(' + dataJson.codeVal + ')가 존재하지 않습니다.',{},1) ) {
                            if( typeof dataJson.tableData.F16499_prev != "undefined" ) {
                                if( dataJson.thisTag ) {
                                    dataJson.thisTag.eq(0).val( util.formatNumber( dataJson.tableData.F16499_prev ) );
                                }
                            }
                            return  false;
                        }

                        return  false;
                    }

                    if ( dataList && dataList.length > 1 ) {
                        if( await vm.$emit("showMessageBox", '확인','구성종목코드(' + dataJson.codeVal + ')가 여러건 존재합니다.',{},1) ) {
                            if( typeof dataJson.tableData.F16499_prev != "undefined" ) {
                                if( dataJson.thisTag ) {
                                    dataJson.thisTag.eq(0).val( util.formatNumber( dataJson.tableData.F16499_prev ) );
                                }
                            }                            
                            return  false;
                        }
                    }

                    if( dataJson.status == "insert" ) {
                        
                        var filterData = _.filter( tblEmergeny01.rows().data() , function(o) {
                            if ( o.F16316 == dataList[0].F16012 ) {
                                return true; 
                            }
                        });
                    
                        if( filterData.length > 0 ) {
                            if( await vm.$emit("showMessageBox", '확인','구성종목코드(' + dataJson.codeVal + ')가 이미 존재합니다.',{},1) ) {
                                return  false;
                            }
                        }

                        var addData     =   {

                                "fmt_F12506"    :   dataList[0].fmt_F12506      /* Date */
                            ,   "F33861"        :   dataList[0].F33861          /* 시장구분 */
                            ,   "F16316"        :   dataList[0].F16012          /* 구성종목코드 */
                            ,   "F16004"        :   dataList[0].F16002          /* 종목명 */
                            ,   "F16499"        :   0                           /* CU shrs */
                            ,   "F34840"        :   0                           /* 액면금액 */
                            ,   "F16588"        :   0                           /* 평가금액 */
                            ,   "fmt_F34743"    :   0                           /* 비중 */

                            ,   "status"        :   "insert"
                            ,   "code_check"    :   true
                            ,   "F16499_prev"   :   '0'                         /* CU shrs ( 변경전 ) */
                            ,   "F34840_prev"   :   '0'                         /* 액면금액 ( 변경전 ) */
                        }

                        tblEmergeny01.row(  dataJson.rowIndex ).data( addData ).order( [0, "asc"] ).draw(  );
                        vm.dataList[ dataJson.rowIndex ]            =   addData;
                    }else{
                        /* F16588 (평가금액) = F15007 ( td_kspjong_basic 의 기준가 ) * F16499 ( CU shrs ) */
                        var  v_F16588   =   Number( dataList[0].F15007 ) * Number( dataJson.nowData.F16499 );

                        table.cell( tr, 6 ).data( v_F16588 );
                        vm.dataList[ dataJson.rowIndex ].F16588    =   v_F16588;

                        /* 
                        *   상태값 normal 로 변경
                        *
                        *   수정한 [1CU단위증권수] 와 원본 [1CU단위증권수] 이 같고
                        *   수정했던 [액면금액] 과 원본 [액면금액] 이 같은 경우
                        */
                        if( dataJson.nowStatus == "insert" ) {
                            table.cell( tr, 9 ).data( { "status" : "insert" } );
                            vm.dataList[ dataJson.rowIndex ].status  =   "insert";
                        }
                        else if(    Number( dataJson.tableData.F16499_prev ) == Number( dataJson.nowData.F16499 )
                                &&  Number( dataJson.tableData.F34840_prev ) == Number( dataJson.tableData.F34840 ) ) {
                            table.cell( tr, 9 ).data( { "status" : "normal" } );
                            vm.dataList[ dataJson.rowIndex ].status  =   "normal";
                        }                            
                        else{
                            table.cell( tr, 9 ).data( { "status" : "modify" } );
                            vm.dataList[ dataJson.rowIndex ].status  =   "modify";                            
                        }

                        vm.dataList[ dataJson.rowIndex ].F16499      =   dataJson.nowData.F16499;                        
                    }
                }

                vm.jongmok_state    =   "";
            }).catch(error => {
                util.processing(vm.$refs.progress, false);
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        },

        /*
         * [자산 추가] 클릭시 수행한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_addRow() {
            var vm = this;

            /* 자산추가된 행에 대해 빈 값이 존재하는지 체크한다. */
            if( !vm.fn_emptyCheck() )   {
                return  false;
            }

            /* 자산추가 후 구성종목코드가 확인이 되지 않는건이 있는지 확인한다. */
            if( !vm.fn_codeCheck() ) {
                return  false;
            }            
                                                
            var addData     =   {
                    'fmt_F12506'    :   ''              /* Date */
                ,   'F33861'        :   ''              /* 시장구분 */
                ,   'F16316'        :   "<input type='text' name='jongmok' id='jongmok' class='txt_left' style='width:100%' placeholder='12자리/6자리코드' maxlength='20' >"            /* 구성종목코드 */
                ,   'F16004'        :   "<button  name='confirm' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01'>확인</button>"                              /* 종목명 */
                ,   'F16499'        :   ''              /* CU shrs */
                ,   'F34840'        :   ''              /* 액면금액 */
                ,   'F16588'        :   '0'             /* 평가금액 */
                ,   'fmt_F34743'    :   '0'             /* 비중 */

                ,   "status"        :   "insert"
                ,   "code_check"    :   false
                ,   "F16499_prev"   :   '0'             /* CU shrs ( 변경전 ) */
                ,   "F34840_prev"   :   '0'             /* 액면금액 ( 변경전 ) */
            }

            tblEmergeny01.row.add( addData ).order( [0, "asc"] ).draw(  );            

            vm.dataList.push( addData );
        },

        /*
         * NEXT 버튼 클릭시 수행한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_stepCheck( step ) {
            var vm = this;

            if( step == 1) {

                vm.jongmok_state_msg    =   "";

                vm.fn_jongmokStateCheck().then( async function(e1){

                    if( !e1 ) {
                        vm.jongmok_state_msg   =   "처리 중 입니다. Next 버튼을 다시 눌러주세요.";
                        return  false;
                    }

                    /* 자산추가된 행에 대해 빈 값이 존재하는지 체크한다. */
                    if( !vm.fn_emptyCheck() )   {
                        return  false;
                    }

                    /* 자산추가 후 구성종목코드가 확인이 되지 않는건이 있는지 확인한다. */
                    if( !vm.fn_codeCheck() ) {
                        return  false;
                    }

                    /* 이전건이 존재하는 경우 */
                    if( vm.allDataList.length > 0 ) {

                        /* 변경된 데이터만 추출 */
                        var filterData  =   _.filter( vm.dataList, function( o, i ) {
                            if( o.status == "insert" || o.status == "modify" ) {
                                return  true;
                            }
                        });

                        /* 현재 수정된 건이 없는 경우 */
                        if( filterData.length == 0 ) {
                            var filterIndex  =   _.findIndex( vm.allDataList,    {
                                                        "etf_F16012"    :   vm.etpBasic.F16012      /* ETF 국제표준코드 */
                                                    ,   "etf_F16013"    :   vm.etpBasic.F16013      /* ETF 단축코드 */
                                                });

                            if( filterIndex > -1 ) {
                                /* 현재건 삭제 */
                                vm.allDataList.splice( filterIndex, 1 );
                            }
                        }
                    }

                    vm.fn_modifyAllDataList();


                    /* 추가 또는 수정건이 존재하는지 체크한다. */
                    if(     !vm.allDataList 
                        ||  vm.allDataList.length == 0  
                    ) {
                        if( !vm.fn_modifyCheck() ) {
                            return  false;
                        }
                    }



                    if( vm.allDataList.length > 0 ) {

                        var items = [];

                        for ( let subData of vm.allDataList ) {
                            if ( $.fn.DataTable.isDataTable('#step2_' + subData.etf_F16012 ) ) {
                                $('#step2_' + subData.etf_F16012).DataTable().destroy();
                            }
                        }

                        for ( let subData of vm.allDataList ) {

                            vm.$nextTick().then(() => {

                                items = subData.data;

                                // console.log("subData.etf_F16012=[" + subData.etf_F16012 + "]");
                                // console.log( "items" );
                                // console.log( items );
                                
                                $( '#step2_' + subData.etf_F16012 ).DataTable( {
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
                                                /* 구분 */
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
                                                "targets": 0
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
                                                "targets": 3
                                            },
                                            {  
                                                /* CU shrs (변경후) */
                                                "render": function ( data, type, row ) {

                                                    var htm = "";
                                                    htm    +=  util.formatNumber( data );

                                                    return htm;
                                                },
                                                "targets": 4
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
                                                "targets": 5
                                            },
                                            {  
                                                /* 액면금액 (변경후) */
                                                "render": function ( data, type, row ) {

                                                    var htm = "";
                                                    htm    +=  util.formatNumber( data );

                                                    return htm;
                                                },
                                                "targets": 6
                                            },
                                        ],
                                        columns: [
                                            { "data" : "status"         ,   "width" :   "15%"   ,   "orderable" : false  ,   "className" : "txt_center"     },     /* 구분 */
                                            { "data" : "F16316"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_left"       },     /* 코드 */
                                            { "data" : "F16004"         ,   "width" :   "25%"   ,   "orderable" : false  ,   "className" : "txt_left"       },     /* 종목명 */
                                            
                                            { "data" : "F16499_prev"    ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* CU shrs (변경전) */
                                            { "data" : "F16499"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* CU shrs */

                                            { "data" : "F34840_prev"    ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* 액면금액 (변경전) */
                                            { "data" : "F34840"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* 액면금액 */
                                        ]
                                }).draw();
                            });
                        }

                        vm.fn_addEtfOperPdfModifyCancel();

                        vm.step = 2;
                    }                    

                });

            }else if( step == 2 ) {

                vm.fn_saveEtpOperPdfModify();
            }
        },

        /*
         * ETP PDF 정보를 저장한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_saveEtpOperPdfModify() {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop -> fn_saveEtpOperPdfModify");


            // console.log("문자발송...........");
            // axios.get("http://forms.koscom.co.kr/sms/EtpSmsAction.do", {
            //   params: {
            //     sendNo: '027677114',
            //     recvNo: '01047191302',
            //     message: 'ETP PDF 변경신청 접수중입니다.',
            //   }
            // });

            util.processing(vm.$refs.progress, true);
            axios.post( Config.base_url + "/user/etp/saveEtpOperPdfModify", {
                data: {     
                        now_date    : vm.search_date
                    ,   allDataList : vm.allDataList
                }
            }).then( async function(response) {

                console.log(response);
                util.processing(vm.$refs.progress, false);
                // tool.smsSend(0, "ETP PDF 변경신청 접수되었습니다.(테스트)");

                if (response.data) {

                    var msg = ( response.data.msg ? response.data.msg : "" );
                    if (!response.data.result) {
                        if( msg ) {
                            if( await vm.$emit('showMessageBox', '확인', msg,{},1) ) {
                                return  false;
                            }
                        }
                    }
            
                    vm.fn_getPdfByGroupNo();
                }
            }).catch(error => {
                util.processing(vm.$refs.progress, false);
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        },

        fn_getPdfByGroupNo() {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop -> fn_getPdfByGroupNo");            

            util.processing(vm.$refs.progress, true);
            axios.post( Config.base_url + "/user/etp/getPdfByGroupNo", {
                data: {}
            }).then( async function(response) {

                console.log(response);

                util.processing(vm.$refs.progress, false);
                if (response.data) {

                    var msg = ( response.data.msg ? response.data.msg : "" );
                    if (!response.data.result) {
                        if( msg ) {
                            if( await vm.$emit('showMessageBox', '확인', msg,{},1) ) {
                                return  false;
                            }
                        }
                    }

                    if( response.data.allDataList.length > 0 ) {
                        vm.allDataList  =   response.data.allDataList;

                        vm.step     =   3;
                        if( vm.allDataList.length > 0 ) {

                            var items = [];

                            for ( let subData of vm.allDataList ) {
                                if ( $.fn.DataTable.isDataTable('#step3_' + subData.etf_F16012 ) ) {
                                    $('#step3_' + subData.etf_F16012).DataTable().destroy();
                                }
                            }

                            for ( let subData of vm.allDataList ) {

                                vm.$nextTick().then(() => {

                                    if ( $.fn.DataTable.isDataTable('#step3_' + subData.etf_F16012 ) ) {
                                        $('#step3_' + subData.etf_F16012).DataTable().destroy();
                                    }   

                                    items = subData.data;

                                    // console.log("subData.etf_F16012=[" + subData.etf_F16012 + "]");
                                    // console.log( "items" );
                                    // console.log( items );
                                    
                                    $( '#step3_' + subData.etf_F16012 ).DataTable( {
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
                                                    /* 구분 */
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
                                                    "targets": 0
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
                                                    "targets": 3
                                                },
                                                {  
                                                    /* CU shrs (변경후) */
                                                    "render": function ( data, type, row ) {

                                                        var htm = "";
                                                        htm    +=  util.formatNumber( data );

                                                        return htm;
                                                    },
                                                    "targets": 4
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
                                                    "targets": 5
                                                },
                                                {  
                                                    /* 액면금액 (변경후) */
                                                    "render": function ( data, type, row ) {

                                                        var htm = "";
                                                        htm    +=  util.formatNumber( data );

                                                        return htm;
                                                    },
                                                    "targets": 6
                                                },
                                            ],
                                            columns: [
                                                { "data" : "status"         ,   "width" :   "15%"   ,   "orderable" : false  ,   "className" : "txt_center"     },     /* 구분 */
                                                { "data" : "F16316"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_left"       },     /* 코드 */
                                                { "data" : "F16004"         ,   "width" :   "25%"   ,   "orderable" : false  ,   "className" : "txt_left"       },     /* 종목명 */

                                                { "data" : "F16499_prev"    ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* CU shrs (변경전) */
                                                { "data" : "F16499"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* CU shrs */

                                                { "data" : "F34840_prev"    ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* 액면금액 (변경전) */
                                                { "data" : "F34840"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"      },     /* 액면금액 */
                                            ]
                                    }).draw();
                                });
                            }
                        }
                    }
                }
            }).catch(error => {
                util.processing(vm.$refs.progress, false);
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        },

        /*
         * [추가변경 작업] 버튼을 누르는 경우 저장버튼은 비활성화 처리한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_showAddEtfOperPdf() {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop.vue -> fn_showAddEtfOperPdf");


            vm.disabledAddEtfOperPdf    =   false;
            vm.showAddEtfOperPdfPanel   =   [ true ];

            vm.disabledSubmit2          =   true;
        },

        fn_addEtfOperPdfModifyCancel() {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop.vue -> fn_addEtfOperPdfModifyCancel");

            vm.disabledAddEtfOperPdf    =   false;
            vm.showAddEtfOperPdfPanel   =   [ false ];

            vm.disabledSubmit2          =   false;

            vm.result.flag              =   true;
            vm.result.msg               =   "";
            vm.txtAddEtpCode            =   "";
        },        

        async fn_addEtfOperPdfModify() {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop.vue -> fn_addEtfOperPdfModify");

            if(     !vm.txtAddEtpCode
                ||  vm.txtAddEtpCode.length == 0
            ) {
                if( await vm.$emit("showMessageBox", '확인','ETF 코드를 입력해 주세요.',{},1) ) {
                    return  false;
                }
            }

            if(  vm.txtAddEtpCode.length < 6
            ) {
                if( await vm.$emit("showMessageBox", '확인','ETF 코드를 6자리 이상 입력해 주세요.',{},1) ) {
                    return  false;
                }
            }            

            var searchParam                 =   {}
            searchParam.F16012              =   "";
            searchParam.searchCode          =   vm.txtAddEtpCode;
            searchParam.initYn              =   "N";

            vm.fn_getEtpOperPdfModify( searchParam );
        },

        /*
         * 삭제버튼 클릭시 로직을 수행한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_deleteTableData( tableData, F16499, rowIndex, jongmokTagYn ) {
            var vm = this;

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            
            table.row( rowIndex ).remove().order( [0, "asc"] ).draw();
            vm.dataList.splice( rowIndex, 1 );

            vm.fn_modifyAllDataList();
        },

        /*
         * CU shrs 변경시 상태값을 변경한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_setStatus( tableData, nowData, rowIndex, jongmokTagYn, thisTag ) {
            var vm = this;

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var tr = table.row( rowIndex );

            /* 종목코드 태그가 존재하지 않는 경우 */
            if( jongmokTagYn == 0 ) {

                /* 1CU단위증권수 */
                if( nowData.name == "F16499" ) {

                    /* 구성종목 코드가 존재하는 경우 */
                    if( tr.data() && tr.data().F16316 ) {
                        vm.fn_getJongmokData( { status : "modify", nowStatus : tableData.status, codeVal : tr.data().F16316, tableData: tableData, nowData : nowData, rowIndex : rowIndex, thisTag : thisTag } );
                    }

                    // if( tableData.status != "insert" ) {
                        
                    //     /* 
                    //     *   상태값 normal 로 변경
                    //     *
                    //     *   수정한 [1CU단위증권수] 와 원본 [1CU단위증권수] 이 같고
                    //     *   수정했던 [액면금액] 과 원본 [액면금액] 이 같은 경우
                    //     */
                    //     if(     Number( tableData.F16499_prev ) == Number( nowData.F16499 )
                    //         &&  Number( tableData.F34840_prev ) == Number( tableData.F34840 ) ) {
                    //         table.cell( tr, 9 ).data( { "status" : "normal" } );
                    //         vm.dataList[ rowIndex ].status  =   "normal";
                    //     }else{
                    //         table.cell( tr, 9 ).data( { "status" : "modify" } );
                    //         vm.dataList[ rowIndex ].status  =   "modify";
                    //     }
                    // }

                    // vm.dataList[ rowIndex ].F16499      =   nowData.F16499;
                }
                /* 액면금액 */
                else if( nowData.name == "F34840" ) {

                    if( tableData.status != "insert" ) {
                                            
                        /* 
                        *   상태값 normal 로 변경
                        *
                        *   수정한 [액면금액] 과 원본 [액면금액] 이 같고
                        *   수정했던 [1CU단위증권수] 과 원본 [1CU단위증권수] 이 같은 경우
                        */
                        if(     Number( tableData.F34840_prev ) == Number( nowData.F34840 )
                            &&  Number( tableData.F16499_prev ) == Number( tableData.F16499 ) ) {
                            table.cell( tr, 9 ).data( { "status" : "normal" } );
                            vm.dataList[ rowIndex ].status  =   "normal";
                        }
                        else{
                            table.cell( tr, 9 ).data( { "status" : "modify" } );
                            vm.dataList[ rowIndex ].status  =   "modify";
                        }
                    }

                    vm.dataList[ rowIndex ].F34840      =   nowData.F34840;
                }

            }else{
                vm.dataList[ rowIndex ].code_check  =   false;

                if( nowData.name == "F16499" ) {
                    vm.dataList[ rowIndex ].F16499      =   nowData.F16499;
                }else{
                    vm.dataList[ rowIndex ].F34840      =   nowData.F34840;
                }                
            }
        },

        /*
         *  ksp_jongbasic DB 조회 상태를 체크한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_jongmokStateCheck() {

            var vm = this;

            return  new Promise(function(resolve, reject) {
                if( vm.jongmok_state ) {
                    resolve( false );
                }

                resolve( true );

            }).catch( function(e) {
                console.log( e );
                resolve(false);
            });            
        },        

        /*
         * 자산추가된 행에 대해 빈 값이 존재하는지 체크한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_emptyCheck() {

            var vm = this;

            var jongmokData = $("#tblEmergeny01 tbody").find("input[name='jongmok']" );

            var filterData  =   _.filter( tblEmergeny01.rows( jongmokData.parents("tr") ).data(), function( o, i ) {
                if( o.status == "insert" && jongmokData.eq(i).val() == "" ) {
                    return  true;
                }
            });

            if( filterData.length > 0 ) {
                if( vm.$emit("showMessageBox", '확인','구성종목코드가 빈 항목이 존재합니다.',{},1) ) {
                    return  false;
                }
            }

            return  true;
        },

        /*
         * 추가 또는 수정건이 존재하는지 체크한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_modifyCheck() {

            var vm = this;

            var filterData  =   _.filter( vm.dataList, function( o, i ) {
                if( o.status == "insert" || o.status == "modify" ) {
                    return  true;
                }
            });

            if( filterData.length == 0 ) {
                if( vm.$emit("showMessageBox", '확인','수정건이 1건 이상 존재해야 합니다.',{},1) ) {
                    return  false;
                }
            }

            return  true;
        },

        /*
         * 자산추가 후 구성종목코드가 확인이 되지 않는건이 있는지 확인한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_codeCheck() {

            var vm = this;

            var filterData  =   _.filter( vm.dataList, function( o, i ) {
                if( o.code_check != true ) {
                    return  true;
                }
            });

            if( filterData.length > 0 ) {
                if( vm.$emit("showMessageBox", '확인','구성종목코드가 확인 되지 않은 건이 존재합니다.',{},1) ) {
                    return  false;
                }
            }

            return  true;
        },

        fn_modifyAllDataList() {

            var vm = this;

            /* 변경된 데이터만 추출 */
            var filterData  =   _.filter( vm.dataList, function( o, i ) {
                if( o.status == "insert" || o.status == "modify" ) {
                    return  true;
                }
            });

            if( filterData.length > 0 ) {
                /* 추가할 데이터 */
                var jsonData    =   {
                        "etf_F16012"    :   vm.etpBasic.F16012      /* ETF 국제표준코드 */
                    ,   "etf_F16013"    :   vm.etpBasic.F16013      /* ETF 단축코드 */
                    ,   "etf_F16002"    :   vm.etpBasic.F16002      /* ETF 한글종목명 */
                    ,   "etf_F16583"    :   vm.etpBasic.F16583      /* ETF 사무수탁회사번호 */
                    ,   "data"          :   filterData
                };



                /* allDataList 에서 존재하는 인덱스를 확인한다. */
                var filterIndex  =   _.findIndex( vm.allDataList,    {
                                            "etf_F16012"    :   vm.etpBasic.F16012      /* ETF 국제표준코드 */
                                        ,   "etf_F16013"    :   vm.etpBasic.F16013      /* ETF 단축코드 */
                                    });

                /* 존재하지 않는 경우 */
                if( filterIndex == -1 ) {
                    vm.allDataList.push( jsonData );
                }
                /* 존재하는 경우 해당 인덱스에 데이터 교체 */
                else{
                    vm.allDataList[ filterIndex ]   =   jsonData;
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
    },
};
</script>
