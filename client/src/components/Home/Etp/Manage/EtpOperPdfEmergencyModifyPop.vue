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
                                        {{ etpBasic.F16002 /* 한글종목명 */ }}
                                        <span>{{ etpBasic.F16013 /* 단축코드 */ }}</span>

                                        <v-text-field v-show="false"></v-text-field>

                                        <v-spacer></v-spacer>
                                        <v-btn icon @click="fn_close()">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>

                                <v-card flat class="pdf_mody_w">
                                    <v-toolbar card prominent>
                                        <v-toolbar-title class="pdf_t">
                                            <v-icon class="text_red">feedback</v-icon>PDF 수정 모드입니다.
                                        </v-toolbar-title>

                                        <v-btn
                                            outline
                                            small
                                            color="primary"
                                            dark
                                            @click="fn_addRow()"
                                        >
                                            <v-icon small color="primary">add</v-icon>자산추가
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <EtpOperPdfEmergencyExcelInfoPop></EtpOperPdfEmergencyExcelInfoPop>
                                        <v-btn
                                            depressed
                                            small
                                            color="primary"
                                            class="ml-0 mr-0"
                                            @click.stop="fn_fileClick();"
                                        >일괄변경 (엑셀업로드)</v-btn>
                                        <input
                                            type="file"
                                            name="pdfUpload"
                                            ref="pdfUpload"
                                            style="display:none;"
                                        />                                
                                        
                                        <!-- 개발 중복 자산추가 팝업 end -->
                                        
                                    </v-toolbar>

                                    <!--에러 코멘트
                                    <div class="upload_error text_orange">
                                        <ul>
                                            <li>※ 업로드한 파일을 확인하세요</li>
                                            <li>※ 업로드한 파일을 확인하세요</li>
                                            <li>※ 업로드한 파일을 확인하세요</li>
                                        </ul>
                                    </div>--->
                                    <div
                                        class="upload_error text_orange"
                                        v-if="arr_show_error_message != null && arr_show_error_message.length > 0"
                                    >
                                        <ul>
                                            <li
                                                v-for="(item, index) in arr_show_error_message"
                                                :key="index"
                                            >
                                                {{item}}
                                            </li>
                                        </ul>
                                         
                                    </div>
                                </v-card>

                                <v-card flat>
                                    <table
                                        :id="tblEmergeny01"
                                        class="tbl_type ver7"
                                        style="width:100%"
                                    >
                                        <colgroup>
                                            <col width="10%" />
                                            <col width="8%" />
                                            <col width="12%" />
                                            <col width="14%" />
                                            <col width="12%" />
                                            <col width="12%" />
                                            <col width="12%" />
                                            <col width="10%" />
                                            <col width="9%" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th class="txt_center">Date</th>
                                                <th class="txt_center">
                                                    시장
                                                    <br />구분
                                                </th>
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
                                <v-btn
                                    color="primary"
                                    :disabled="fn_nextButtonDisabledCheck()"
                                    depressed
                                    @click="fn_stepCheck(1)"
                                >Next</v-btn>
                            </v-card-actions>
                    <!-- step1 END-->
                        </v-window-item>



                        <v-window-item :value="2">
                    <!---step2 START-->
                            <v-card flat class="listset_pop">
                                <h5>
                                    <v-card-title ma-0>
                                        <v-btn icon :disabled="step === 1" flat @click="step--;">
                                            <v-icon>arrow_back_ios</v-icon>
                                        </v-btn>
                                        PDF 변경신청 현황
                                        <v-spacer></v-spacer>
                                        <v-btn icon @click="fn_close">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>
                                <v-card flat>
                                    <v-flex
                                        xs12
                                        v-for="subData in allDataList"
                                        :key='"step2_" + subData.etf_F16012'
                                    >
                                        <h4>
                                            {{ subData.etf_F16002 /* ETF 한글종목명 */ }}
                                            <span>{{ subData.etf_F16013 /* ETF 단축코드 */ }}</span>
                                        </h4>

                                        <table
                                            v-bind:id='"step2_" + subData.etf_F16012'
                                            class="tbl_type ver7"
                                            style="width:100%"
                                        >
                                            <colgroup>
                                                <col width="10%" />
                                                <!-- 구분 -->
                                                <col width="15%" />
                                                <!-- CODE -->
                                                <col width="15%" />
                                                <!-- 종목 -->

                                                <col width="15%" />
                                                <!-- CU shrs -->
                                                <col width="15%" />

                                                <col width="15%" />
                                                <!-- 액면금액 -->
                                                <col width="15%" />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th class="txt_center" rowspan="2">구분</th>
                                                    <th class="txt_center" rowspan="2">CODE</th>
                                                    <th class="txt_left" rowspan="2">종목</th>
                                                    <th class="txt_center" colspan="2">CU shrs</th>
                                                    <th class="txt_center" colspan="2">액면금액</th>
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
                                            <v-btn
                                                fab
                                                dark
                                                depressed
                                                color="primary"
                                                :disabled="disabledAddEtfOperPdf"
                                                @click="fn_showAddEtfOperPdf()"
                                            >
                                                <v-icon dark large>add</v-icon>
                                            </v-btn>
                                            네, 추가 변경 작업을 진행합니다.
                                            <v-expansion-panel
                                                v-model="showAddEtfOperPdfPanel"
                                                expand
                                            >
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
                                                                    <v-btn
                                                                        outline
                                                                        small
                                                                        color="primary"
                                                                        @click="fn_addEtfOperPdfModify"
                                                                    >확인</v-btn>
                                                                    <v-btn
                                                                        outline
                                                                        small
                                                                        color="#9e9e9e"
                                                                        @click="fn_addEtfOperPdfModifyCancel"
                                                                    >취소</v-btn>
                                                                </span>
                                                                <span
                                                                    style="color:red"
                                                                >{{ result.msg }}</span>
                                                            </div>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </p>
                                        <p class="pdfmody_btn">
                                            <v-btn
                                                fab
                                                dark
                                                depressed
                                                color="primary"
                                                :disabled="disabledSubmit2"
                                                @click="fn_stepCheck(2)"
                                            >
                                                <v-icon dark large>navigate_next</v-icon>
                                            </v-btn>아니오, 지금까지 변경한 내용을 제출합니다.
                                        </p>
                                    </div>
                                </v-card>
                            </v-card>

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
                                    <v-flex
                                        xs12
                                        v-for="subData in allDataList"
                                        :key='"step3_"  + subData.etf_F16012'
                                    >
                                        <h4>
                                            {{ subData.etf_F16002 /* ETF 한글종목명 */ }}
                                            <span>{{ subData.etf_F16013 /* ETF 단축코드 */ }}</span>
                                        </h4>

                                        <table
                                            v-bind:id='"step3_" + subData.etf_F16012'
                                            class="tbl_type ver7"
                                            style="width:100%"
                                        >
                                            <colgroup>
                                                <col width="10%" />
                                                <!-- 구분 -->
                                                <col width="15%" />
                                                <!-- CODE -->
                                                <col width="15%" />
                                                <!-- 종목 -->

                                                <col width="15%" />
                                                <!-- CU shrs -->
                                                <col width="15%" />

                                                <col width="15%" />
                                                <!-- 액면금액 -->
                                                <col width="15%" />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th class="txt_center" rowspan="2">구분</th>
                                                    <th class="txt_center" rowspan="2">CODE</th>
                                                    <th class="txt_left" rowspan="2">종목</th>
                                                    <th class="txt_center" colspan="2">CU shrs</th>
                                                    <th class="txt_center" colspan="2">액면금액</th>
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
                                            <br />신속한 작업을 위해 내역을 제출하신 후 코스콤 담당자와 통화해주세요
                                        </b>
                                    </div>
                                    <div class="pdf_coment2 text-xs-center">
                                        오춘교 과장 02-767-8735
                                        <br />이형준 과장 02-767-8750
                                    </div>
                                    <div class="pdf_coment3 text-xs-center">
                                        -주의사항-
                                        <br />본 변경내용은 장중투자지표(iNAV) 산출에만 반영됩니다.
                                        <br />기타업무(설정환매, 정보단말 PDF조회 등)에 반영을 위해
                                        <br />사무관리사에 PDF변경내역을 통지하시기 바랍니다.
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
            <ConfirmDialog ref="confirm2"></ConfirmDialog>
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
import ConfirmDialog                from "@/components/common/ConfirmDialog.vue";

import ProgressBar from "@/components/common/ProgressBar.vue";
import EtpOperPdfEmergencyExcelInfoPop  from "@/components/Home/Etp/Manage/EtpOperPdfEmergencyExcelInfoPop.vue";

var tblEmergeny01 = null;

export default {
    props : [ "showDialog", "paramData" ],
    components : {
        ProgressBar: ProgressBar,
        ConfirmDialog: ConfirmDialog,
        EtpOperPdfEmergencyExcelInfoPop : EtpOperPdfEmergencyExcelInfoPop,
    },
    data() {
        return {
                step: 1
            ,   tblEmergeny01 : "tblEmergeny01"
            ,   etpBasic : {}
            ,   dataList : []
            ,   allDataList : []
            ,   disabledAddEtfOperPdf : false
            ,   showAddEtfOperPdfPanel : [false]
            ,   disabledSubmit2 : false
            ,   txtAddEtpCode : ""
            ,   result : {
                        flag : true
                    ,   msg: ""
                }
            ,   search_date : ""
            ,   fmt_search_date : ""

            ,   jongmok_state : ""      /* ksp_jongbasic DB 조회 상태 */

            ,   status: 0
            ,   arr_show_error_message : []

            ,   limit : {
                    max_size : 1        /* 파일 사이즈 (Mb) */
                }            
        };
    },
    created: function() {

        var vm = this;
    },
    mounted: function() {

        var vm = this;

//        this.$root.$confirm2 = this.$refs.confirm2;

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
                            /* 1CU단위증권수 */
                            htm = "<input type='text' name='F16499' id='F16499' style='width:100%; text-align:right' value='" + util.formatNumber( data ) + "' maxlength='18'>";
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
                            /* 액면금액 */
                            htm = "<input type='text' name='F34840' id='F34840' style='width:100%; text-align:right' value='" + util.formatNumber( data ) + "' maxlength='18'>";
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
                { "data" : "F33861"         ,   "orderable" : false  ,   "className" : "txt_center" ,   "width" :   "8%"    , "title" :   "시장<br>구분"  },    /* 시장구분 */
                { "data" : "F16316"         ,   "orderable" : false  ,   "className" : "txt_left"   ,   "width" :   "12%"   , "title" :   "구성종목코드"  },    /* 구성종목코드 */
                { "data" : "F16004"         ,   "orderable" : false  ,   "className" : "txt_left"   ,   "width" :   "14%"   , "title" :   "종목명"        },    /* 종목명 */
                { "data" : "F16499"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "CU shrs"       },   /* CU shrs */
                { "data" : "F34840"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "액면금액"      },    /* 액면금액 */
                { "data" : "F16588"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "평가금액"      },    /* 평가금액 */
                { "data" : "fmt_F34743"     ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "10%"   , "title" :   "비중(%)"       },    /* 비중 */
                { "data": null              ,   "orderable" : false  ,   "align":"center"           ,   "width" :   "9%"    , defaultContent:"" },

                { "data" : "status"         ,   "visible"   : false   },                                                                /* status */
                { "data" : "code_check"     ,   "visible"   : false   },                                                                /* code_check */
                { "data" : "F16499_prev"    ,   "visible"   : false   },                                                                /* CU shrs (변경전) */
                { "data" : "F34840_prev"    ,   "visible"   : false   },                                                                /* 액면금액 (변경전) */
                { "data" : "F16588_prev"    ,   "visible"   : false   },                                                                /* 평가금액 (변경전) */
                { "data" : "F15007"         ,   "visible"   : false   },                                                                /* kspjong_basic 기준가 (신규추가시 사용) */
            ]
        });

        /* [자산추가] 후 [종목코드] 변경시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('keyup', "input[name='jongmok']", function (e) {

            vm.arr_show_error_message   =  [];

            $(this).val( $(this).val().replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '' ) );
            $(this).val( $(this).val().replace(/[^0-9a-zA-Z]/g, '' ) );

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var tr = $(this).parents("tr");
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var nowData = {
                F16499 : 0
            };

            table.cell( tr, 3 ).data( "<button  name='confirm' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01'>확인</button>" );  /* 종목명 */            
            tr.find( "td input[name=F16499]" ).val( 0 );        /* CU shrs */
            tr.find( "td input[name=F34840]" ).val( 0 );        /* 액면금액 */
            table.cell( tr, 6 ).data( 0 );          /* 평가금액 */
            table.cell( tr, 10).data( false );

            vm.dataList[ rowIndex ].fmt_F12506 =   "";                      /* Date */
            vm.dataList[ rowIndex ].F16316     =   $(this).val();           /* 종목코드 */
            vm.dataList[ rowIndex ].F16004     =   "";                      /* 종목명 */
            vm.dataList[ rowIndex ].F16499     =   0;                       /* CU shrs */
            vm.dataList[ rowIndex ].F34840     =   0;                       /* 액면금액 */
            vm.dataList[ rowIndex ].F16588     =   0;                       /* 평가금액 */
            vm.dataList[ rowIndex ].code_check =   false;
        });        

        

        /* [자산추가] 후 확인 버튼 클릭시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('click', "button[name='confirm']", function () {

            vm.arr_show_error_message   =  [];

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var nowData = {
                F16499 : 0
            };      

            vm.jongmok_state    =   "ing";      

            vm.fn_getJongmokData( { 
                    status : "insert"
                ,   codeVal : $(this).parents("tr").find( "input[name='jongmok']" ).eq(0).val()
                ,   tableData: data
                ,   nowData : nowData
                ,   rowIndex : rowIndex
                ,   F16499_prev : 0
                ,   nowTr : $(this).parents("tr")
            }).then(async function(e){

                if( e && e.result ) {
                    var dataList    =   e.dataList ? e.dataList : [];
                    var dataJson    =   e.dataJson ? e.dataJson : {};

                    if( dataList.length == 0 ) {
                        return  vm.fn_getFutureBasic( dataJson );
                    }else{
                        vm.fn_setSearchData( dataList, dataJson );
                    }
                }

                vm.jongmok_state    =   "";

            }).then( async function(e1) {
                
                if( e1 && e1.result ) {
                    var dataList    =   e1.dataList ? e1.dataList : [];
                    var dataJson    =   e1.dataJson ? e1.dataJson : {};

                    if( dataList.length == 0 ) {

                        vm.status = 1;

                        /* (신규 등록된건만) 구성종목코드 중복체크 ( input box 로 추가된 경우 ) */
                        var jongmokData = $("#tblEmergeny01 tbody").find("input[name='jongmok']" );     /* 종목코드 */
                        var insertDuplCheck  =  _.filter( tblEmergeny01.rows( jongmokData.parents("tr") ).data(), function( o, i ) {
                            if( o.status == "insert" && jongmokData.eq(i).val() == dataJson.codeVal ) {
                                return  true;
                            }
                        });

                        /* (이미 존재하는 건) 구성종목코드 중복체크 ( input box 가 아니고 1건으로 추가된 경우 ) */
                        var duplCheck = _.filter( tblEmergeny01.rows().data() , function( o, i ) {
                            if ( o.status != "insert" && o.F16316 == dataJson.codeVal ) {
                                return true; 
                            }
                        });

                        /* (기존건 + 신규건) 구성종목코드 중복체크 ( 현재 입력하는 코드 포함하여 종목코드체크 ) */
                        var duplCheck1 = _.filter( tblEmergeny01.rows().data() , function( o, i ) {
                            if ( o.F16316 == dataJson.codeVal ) {
                                return true; 
                            }
                        });                        


                        if( insertDuplCheck.length  > 1 || duplCheck.length > 0 || duplCheck1.length > 1 ) {
                            vm.status = 1;
                            if (await vm.$refs.confirm2.open(
                                    '확인',
                                    '구성종목코드(' + dataJson.codeVal + ')가 이미 추가되어 있습니다.',
                                    {}
                                    ,1
                                )
                            ) {
                                dataJson.initYn     =   "Y";
                                vm.fn_setInitData( vm, dataJson );

                                vm.status = 0;                                
                                vm.jongmok_state    =   "";

                                return  false;
                            }
                        }

                        if( ![ "CASH00000001" ].includes( dataJson.codeVal ) && ![ "KR1", "KR3", "KR6" ].includes( dataJson.codeVal.substr(0,3) ) ) {

                            if (await vm.$refs.confirm2.open(
                                    '확인',
                                    '종목코드를 확인해 주세요.',
                                    {}
                                    ,1
                                )
                            ) {
                                dataJson.initYn     =   "Y";
                                vm.fn_setInitData( vm, dataJson );

                                vm.status = 0;                                
                                vm.jongmok_state    =   "";

                                return  false;
                            }

                            return  false;
                        }                        


                        if (await vm.$refs.confirm2.open(
                                '확인',
                                '구성종목코드(' + dataJson.codeVal + ')가 존재하지 않습니다. 종목명을 입력해 주세요.',
                                {}
                                ,1
                            )
                        ) {
                            dataJson.code_check     =   true;
                            dataJson.now_date       =   vm.search_date;
                            dataJson.fmt_now_date   =   vm.fmt_search_date;

                            vm.fn_setInitData( vm, dataJson );

                            vm.status = 0;
                            vm.jongmok_state    =   ""

                            return  false;
                        }
                        
                        return  false;

                    }else{
                        vm.fn_setSearchData( dataList, dataJson );
                    }
                }

                vm.jongmok_state    =   "";
            });
        });

        /* F16004=[종목명] 수정시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('change', "input[name='F16004']", function () {

            vm.arr_show_error_message   =  [];

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var nowData = {};
            var tdData = $(this).eq(0).val();

            vm.jongmok_state=""

            vm.dataList[ rowIndex ].F16004      =   tdData;
        });        

        /* F16499=[CU shrs], F34840=[액면금액] 수정시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('blur', "input[name='F16499'],input[name='F34840']", function () {

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var nowData = {};
            var tdData = $(this).eq(0).val();
            
            $(this).eq(0).val( tdData );


            vm.arr_show_error_message   =  [];

            $(this).css( "borderColor", "" );

            /* CU shrs */
            if ( $(this).attr('name') == 'F16499' ) {

                if( isNaN(util.NumtoStr( tdData )) ) {
                    $(this).css( "borderColor", "red" );
                    vm.arr_show_error_message.push( "[CU shrs] 숫자형식만 입력가능합니다." );
                    return  false;
                }

                nowData.name    =   "F16499";
                nowData.F16499  =   util.NumtoStr( tdData );
            }
            /* 액면금액 */
            else if( $(this).attr('name') == 'F34840' ) {

                if( isNaN(util.NumtoStr( tdData )) ) {
                    $(this).css( "borderColor", "red" );
                    vm.arr_show_error_message.push( "[액면금액] 숫자형식만 입력가능합니다." );
                    return  false;
                }

                nowData.name    =   "F34840";
                nowData.F34840  =   util.NumtoStr( tdData );
            }

            $(this).eq(0).val( util.formatNumber( util.NumtoStr( tdData ) ) );

            vm.jongmok_state=""
            vm.fn_setStatus( data, nowData, rowIndex );
        });

        // 삭제버튼 클릭시
        $('#' + vm.tblEmergeny01 + ' tbody').on('click', 'button[name=btnDelete]', function () {
            var table = $('#' + vm.tblEmergeny01 ).DataTable();
            var tr = $(this).parents('tr');
            var data = table.row($(this).parents('tr')).data();
            var rowIndex = table.row($(this).parents("tr")).index();

            vm.fn_deleteTableData( data, tr, rowIndex );
        });


        /* PDF 업로드 파일 영역 */
        this.$refs.pdfUpload.addEventListener(
            "change",
            async function(evt) {
                var vm          =   this;
                let file        =   this.$refs.pdfUpload.files[0];

                var flag    =   true;

                vm.arr_show_error_message   =  [];

                /* 엑셀 유형인지 파일을 체크한다. */
                await vm.fn_checkFile( file ).then( async function(e) {

                    if( e && e.result ) {

                        /* 파일 사이즈를 체크한다. */
                        return  await vm.fn_sizeCheck( file, "file" );
                    }else{
                        flag = false;
                    }

                }).then( async function(e) {

                    if( e && e.result ) {

                        /* PDF 엑셀을 업로드 한다. */
                        return  await vm.fn_uploadPdf( file );
                    }else{
                        flag = false;
                    }

                }).then( function(e) {

                    vm.$refs.pdfUpload.value  =   null;

                    if( vm.$refs.pdfUpload.files ) {
                        vm.$refs.pdfUpload.files  =   null;
                    }

                }).catch( function(e) {

                    if( e && e.result ) {

                    }else{
                        flag = false;
                    }
                });

            }.bind(this)
        );



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

        async fn_setSearchData( dataList, dataJson ) {

            var vm = this;

        /** 코드 검색건수가 여러건인 경우  **/
            if ( dataList && dataList.length > 1 ) {
                vm.status = 1;
                if (await vm.$refs.confirm2.open(
                        '확인',
                        '구성종목코드(' + dataJson.codeVal + ')가 여러건 존재합니다.',
                        {}
                        ,1
                    )
                ) {
                    dataJson.codeVal    =   "";
                    dataJson.initYn     =   "Y";
                    vm.fn_setInitData( vm, dataJson );

                    vm.status = 0;
                    vm.jongmok_state    =   "";
                    return  false;
                }
            }


        /* 구성종목코드 중복체크 ( 이미 저장되어 있는 건에 대해 체크 ) */
            var duplCheck = _.filter( tblEmergeny01.rows().data() , function(o) {
                if ( o.status != "insert" && o.F16316 == dataJson.codeVal ) {
                    return true; 
                }
            });

            if( duplCheck.length  > 0 ) {
                vm.status = 1;
                if (await vm.$refs.confirm2.open(
                        '확인',
                        '구성종목코드(' + dataJson.codeVal + ')가 이미 존재합니다.',
                        {}
                        ,1
                    )
                ) {
                    dataJson.codeVal    =   "";
                    dataJson.initYn     =   "Y";
                    vm.fn_setInitData( vm, dataJson );

                    vm.status = 0;                                
                    vm.jongmok_state    =   "";

                    return  false;
                }                        
            }                    


        /** 코드 검색건수가 1 건인 경우  **/
            if ( dataList && dataList.length == 1 ) {

                /* (신규 등록된건만) 구성종목코드 중복체크 ( input box 가 아니고 1건으로 추가된 경우 ) */
                var filterData = _.filter( tblEmergeny01.rows().data() , function(o) {
                    if ( o.status == "insert" && o.F16316 == dataList[0].F16012 ) {
                        return true; 
                    }
                });

                /* (이미 존재하는 건) 구성종목코드 중복체크 ( input box 가 아니고 1건으로 추가된 경우 ) */
                var filterData1 = _.filter( tblEmergeny01.rows().data() , function(o) {
                    if ( o.status != "insert" && o.F16316 == dataList[0].F16012 ) {
                        return true; 
                    }
                });                

                if( filterData.length > 1 || filterData1.length > 0 ) {
                    vm.status = 1;
                    if (await vm.$refs.confirm2.open(
                            '확인',
                            '구성종목코드(' + dataJson.codeVal + ')가 이미 존재합니다.',
                            {}
                            ,1
                        )
                    ) {
                        dataJson.codeVal    =   "";
                        dataJson.initYn     =   "Y";
                        vm.fn_setInitData( vm, dataJson );

                        vm.status = 0;                                
                        vm.jongmok_state    =   "";

                        return  false;
                    }
                }

                var addData     =   {
                        "fmt_F12506"    :   vm.fmt_search_date          /* Date */
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
                    ,   "F16588_prev"   :   '0'                         /* 평가금액 (변경전) */
                    ,   "F15007"        :   dataList[0].F15007          /* 검색 기준가 (신규추가시 사용) */
                    ,   "F33904"        :   dataList[0].F33904          /* 선물 옵션 계약 승수 */
                }

                tblEmergeny01.row(  dataJson.rowIndex ).data( addData ).order( [0, "asc"] ).draw();

                addData.F12506      =   vm.search_date;             /* Date */
                addData.F34743      =   0;                          /* 비중 */
                addData.F33837      =   0;                          /* 구성종목수 */

                if( vm.etpBasic && Object.keys( vm.etpBasic).length > 0 ) {
                    if( vm.etpBasic.F16583 ) {
                        addData.F16583  =   vm.etpBasic.F16583;     /* 사무수탁회사번호 */
                    }

                    if( vm.etpBasic.F16012 ) {
                        addData.F16012  =   vm.etpBasic.F16012;     /* ETF종목코드 */
                    }

                    if( vm.etpBasic.F16013 ) {
                        addData.F16013  =   vm.etpBasic.F16013;     /* ETF단축코드 */
                    }
                }

                vm.dataList[ dataJson.rowIndex ]            =   addData;
            }
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
            vm.fn_getNowDate( searchParam ).then( async function(e1){
                if( !e1 ) {
                    return  false;
                }            

                if( !vm.search_date ) {
                    vm.status = 1;
                    if ( await vm.$refs.confirm2.open(
                            '확인',
                            '최근일자 정보가 존재하지 않습니다.',
                            {}
                            ,1
                        )
                    ) {
                        if(vm.$refs.confirm2.val == 'Y') {
                            vm.status = 0;
                            return  false;
                        }

                        vm.status = 0;
                        return  false;                        
                    }
                }

                searchParam.isEtfYn     =   "Y";
                searchParam.search_date =   vm.search_date;

                util.processing(vm.$refs.progress, true);

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/etp/getEtpOperPdfModify"
                            ,   "data"      :   searchParam
                            ,   "method"    :   "post"
                        }
                    ,   async function(response) {

                            try{

                                if( vm.$refs && vm.$refs.progress ) {
                                    util.processing(vm.$refs.progress, false);
                                }

                                if (response.data) {

                                    var msg = ( response.data.msg ? response.data.msg : "" );
                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.status = 1;
                                            if ( await vm.$refs.confirm2.open(
                                                    '확인',
                                                    msg,
                                                    {}
                                                    ,1
                                                )
                                            ) {
                                                if(vm.$refs.confirm2.val == 'Y') {
                                                    vm.status = 0;
                                                    return  false;
                                                }

                                                vm.status = 0;
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

                            }catch(ex) {
                                if( vm.$refs && vm.$refs.progress ) {
                                    util.processing(vm.$refs.progress, false);
                                }

                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }

                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            });
        },

        /*
         * 현재일자를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getNowDate( searchParam ) {
            var vm = this;

            return  new Promise(function(resolve, reject) {
                console.log( "fn_getNowDate called" );

                // 이미 검색일자가 존재하는 경우 조회하지 않게 함.
                if( vm.search_date ) {
                    searchParam.search_date     =  vm.search_date;

                    resolve(true);
                }else{
                    util.processing(vm.$refs.progress, true);

                    util.axiosCall(
                            {
                                    "url"       :   Config.base_url + "/user/etp/getNowDate"
                                ,   "data"      :   searchParam
                                ,   "method"    :   "post"
                            }
                        ,   function(response) {

                                try{

                                    if( vm.$refs && vm.$refs.progress ) {
                                        util.processing(vm.$refs.progress, false);
                                    }                                    

                                    if (response.data) {

                                        var msg = ( response.data.msg ? response.data.msg : "" );
                                        if (!response.data.result) {
                                            if( msg ) {
                                                resolve(false);
                                            }
                                        }

                                        if( response.data.dateInfo ) {
                                            vm.search_date      =   response.data.dateInfo.now_date;
                                            vm.fmt_search_date  =   response.data.dateInfo.fmt_now_date;
                                        }
                                    }

                                    resolve(true);

                                }catch(ex) {
                                    if( vm.$refs && vm.$refs.progress ) {
                                        util.processing(vm.$refs.progress, false);
                                    }

                                    console.log( "error", ex );
                                    resolve(false);
                                }
                            }
                        ,   function(error) {

                                if( vm.$refs && vm.$refs.progress ) {
                                    util.processing(vm.$refs.progress, false);
                                }                                

                                if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}

                                resolve(false);
                            }
                    );


                }

            }).catch( function(e) {
                console.log( e );

                if( vm.$refs.progress ) {
                    util.processing(vm.$refs.progress, false);
                }

                if ( vm.$refs.confirm2.open(
                        '확인',
                        '서버로 부터 응답을 받지 못하였습니다.',
                        {}
                        ,4
                    )
                ) {
                }

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

            if( dataJson.status == "insert" ) {
                if(     !dataJson.codeVal
                    ||  dataJson.codeVal.length == 0
                ) {
                    vm.status = 1;
                    if (await vm.$refs.confirm2.open(
                            '확인',
                            '구성종목코드를 입력해 주세요.',
                            {}
                            ,1
                        )
                    ) {
                        vm.status = 0;
                        vm.jongmok_state    =   "";

                        return  false;
                    }
                }

                if(  dataJson.codeVal.length < 6 ) {
                    vm.status = 1;
                    if (await vm.$refs.confirm2.open(
                            '확인',
                            '구성종목코드를 6자리 이상 입력해 주세요.',
                            {}
                            ,1
                        )
                    ) {
                        vm.status = 0;
                        vm.jongmok_state    =   "";

                        return  false;
                    }
                }

                if(  dataJson.codeVal.length < 6 ) {
                    vm.status = 1;
                    if (await vm.$refs.confirm2.open(
                            '확인',
                            '구성종목코드를 6자리 이상 입력해 주세요.',
                            {}
                            ,1
                        )
                    ) {
                        vm.status = 0;
                        vm.jongmok_state    =   "";

                        return  false;
                    }
                }                
            }

            return  await new Promise(function(resolve, reject) {

                util.processing(vm.$refs.progress, true);

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/etp/getJongmokData"
                            ,   "data"      :   { "searchCode" : dataJson.codeVal }
                            ,   "method"    :   "post"
                        }
                    ,   async function(response) {

                            try{

                                if( vm.$refs && vm.$refs.progress ) {
                                    util.processing(vm.$refs.progress, false);
                                }                                

                                if (response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );
                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.status = 1;
                                            if (await vm.$refs.confirm2.open(
                                                    '확인',
                                                    msg,
                                                    {}
                                                    ,1
                                                )
                                            ) {                                
                                                dataJson.initYn     =   "Y";
                                                vm.fn_setInitData( vm, dataJson );

                                                vm.status = 0;
                                                vm.jongmok_state    =   "";

                                                resolve( { result : false } );
                                            }
                                        }
                                    }else{
                                        var dataList = response.data.dataList;

                                        resolve( { result : true, dataList : dataList, dataJson : dataJson  } );
                                    }
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {

                                if( vm.$refs && vm.$refs.progress ) {
                                    util.processing(vm.$refs.progress, false);
                                }                                
                                console.log( "error", ex );

                                vm.jongmok_state    =   "";
                                resolve( { result : false } );
                            }
                        }
                    ,   function(error) {

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }

                            vm.jongmok_state    =   "";

                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}

                            resolve( { result : false } );
                        }
                );


            }).catch( function(e1) {
                vm.jongmok_state    =   "";

                console.log( e1 );
                resolve( { result : false } );
            });
        },

        /*
         * future_basic 데이터를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        async fn_getFutureBasic( dataJson ) {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop -> fn_getFutureBasic");

            return  await new Promise(function(resolve, reject) {

                util.processing(vm.$refs.progress, true);

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/etp/getFutureBasic1"
                            ,   "data"      :   { "searchCode" : dataJson.codeVal }
                            ,   "method"    :   "post"
                        }
                    ,   async function(response) {

                            try{

                                if( vm.$refs && vm.$refs.progress ) {
                                    util.processing(vm.$refs.progress, false);
                                }                                

                                if (response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );
                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.status = 1;
                                            if (await vm.$refs.confirm2.open(
                                                    '확인',
                                                    msg,
                                                    {}
                                                    ,1
                                                )
                                            ) {   
                                                dataJson.initYn     =   "Y";                             
                                                vm.fn_setInitData( vm, dataJson );

                                                vm.status = 0;
                                                vm.jongmok_state    =   "";

                                                resolve( { result : false } );
                                            }
                                        }
                                    }else{
                                        var dataList = response.data.dataList;

                                        resolve( { result : true, dataList : dataList, dataJson : dataJson  } );
                                    }
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {

                                if( vm.$refs && vm.$refs.progress ) {
                                    util.processing(vm.$refs.progress, false);
                                }                                
                                console.log( "error", ex );

                                vm.jongmok_state    =   "";
                                resolve( { result : false } );
                            }
                        }
                    ,   function(error) {

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }                        

                            vm.jongmok_state    =   "";

                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}

                            resolve( { result : false } );
                        }
                );                


            }).catch( function(e1) {
                console.log( e1 );
                resolve( { result : false } );
            });
        },

        /*
         * [자산 추가] 클릭시 수행한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_addRow() {
            var vm = this;


            vm.jongmok_state=""

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
                ,   "F16588_prev"   :   '0'             /* 평가금액 (변경전) */
                ,   "F15007"        :   '0'             /* kspjong_basic 기준가 (신규추가시 사용) */
                ,   "F33904"        :   '1'             /* 계약승수*/
            }

            tblEmergeny01.row.add( addData ).order( [0, "asc"] ).draw(  );            

            addData.F12506      =   "";                         /* Date */
            addData.F34743      =   0;                          /* 비중 */
            addData.F33837      =   0;                          /* 구성종목수 */

            if( vm.etpBasic && Object.keys( vm.etpBasic).length > 0 ) {

                if( vm.etpBasic.F16583 ) {
                    addData.F16583  =   vm.etpBasic.F16583;     /* 사무수탁회사번호 */
                }

                if( vm.etpBasic.F16012 ) {
                    addData.F16012  =   vm.etpBasic.F16012;     /* ETF종목코드 */
                }

                if( vm.etpBasic.F16013 ) {
                    addData.F16013  =   vm.etpBasic.F16013;     /* ETF단축코드 */
                }
            }

            vm.dataList.push( addData );
        },

        fn_setInitData( vm, dataJson ) {

            try{
                var table = $("#" + vm.tblEmergeny01 ).DataTable();
                var tr = dataJson.nowTr;

                if( !dataJson.now_date ) {
                    dataJson.now_date   =   "";
                }

                if( !dataJson.fmt_now_date ) {
                    dataJson.fmt_now_date   =   "";
                }

                if( typeof dataJson.initYn == "undefined" || !dataJson.initYn ) {
                    dataJson.initYn   =   "N";
                }

                var addData     =   {
                        "fmt_F12506"    :   dataJson.fmt_now_date       /* Date */
                    ,   "F33861"        :   ""                          /* 시장구분 */
                    ,   "F16316"        :   dataJson.codeVal            /* 구성종목코드 */
//                  ,   "F16004"        :   "<input type='text' name='F16004' id='F16004' class='txt_left' style='width:100%' maxlength='20' >" /* 종목명 */
//                  ,   "F16499"        :   0                           /* CU shrs */
//                  ,   "F34840"        :   0                           /* 액면금액 */
//                  ,   "F16588"        :   0                           /* 평가금액 */
                    ,   "fmt_F34743"    :   0                           /* 비중 */

                    ,   "status"        :   "insert"
                    ,   "code_check"    :   true
                    ,   "F16499_prev"   :   '0'                         /* CU shrs ( 변경전 ) */
                    ,   "F34840_prev"   :   '0'                         /* 액면금액 ( 변경전 ) */
                    ,   "F16588_prev"   :   '0'                         /* 평가금액 (변경전) */
                    ,   "F15007"        :   '0'                         /* kspjong_basic 기준가 (신규추가시 사용) */
                    ,   "F33904"        :   '0'                         /* 선물 옵션 계약 숭수 */
                }

                if( !dataJson.code_check ) {
                    addData.code_check =   false;
                }

                var v_F16004    =   "";         /* 종콕명 */
                var v_F16499    =   "0";        /* CU shrs */
                var v_F34840    =   "0";        /* 액면금액 */
                var v_F16588    =   "0";        /* 평가금액 */

                tblEmergeny01.row(  dataJson.rowIndex ).data( addData );

                /* 파라미터에 시장구분이 존재하는 경우 */
                if( typeof dataJson.F33861 != "undefined" ) {
                    addData.F33861  =   dataJson.F33861;            /* 시장구분 */
                }

                if( dataJson.initYn == "N" ) {
                    /* 입력받은 값이 존재하고 길이가 3자리 이상인 경우 */
                    if( typeof dataJson.codeVal != "undefined" && dataJson.codeVal.length > 3 ) {
                        /* 입력받은 문자열의 앞 3자리가 "KR1", "KR3", "KR6" 으로 시작하는 경우 시장구분은 3으로 고정 */
                        if( [ "KR1", "KR3", "KR6" ].includes( dataJson.codeVal.substr(0,3) ) ) {
                            addData.F33861  =   "3";                    /* 시장구분 */ 
                        }
                    }
                }

                if( addData.F33861 != "" ) {
                    table.cell( tr, 1 ).data( addData.F33861 );
                }

                if( !dataJson.initYn || dataJson.initYn == "N" ) {
                    table.cell( tr, 2 ).data( "<input type='text' name='jongmok' id='jongmok' class='txt_left' style='width:100%' maxlength='20' value='" + dataJson.codeVal + "'>" );      /* 종목코드 */
                    table.cell( tr, 3 ).data( "<input type='text' name='F16004'  id='F16004'  class='txt_left' style='width:100%' maxlength='20' value='" + v_F16004 + "'>" );              /* 종목명 */
                }else{
                    table.cell( tr, 2 ).data( "<input type='text' name='jongmok' id='jongmok' class='txt_left' style='width:100%' placeholder='12자리/6자리코드' value='" + dataJson.codeVal + "' maxlength='20' >" );         /* 종목코드 */
                    table.cell( tr, 3 ).data(  "<button  name='confirm' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01'>확인</button>" );                          /* 종목명 */
                }
                table.cell( tr, 4 ).data( v_F16499 );          /* CU shrs */
                table.cell( tr, 5 ).data( v_F34840 );          /* 액면금액 */
                table.cell( tr, 6 ).data( v_F16588 );          /* 평가금액 */
                tblEmergeny01.order( [0, "asc"] ).draw();

                addData.F12506      =   dataJson.now_date;          /* Date */
                addData.F34743      =   0;                          /* 비중 */
                addData.F33837      =   0;                          /* 구성종목수 */


                if( vm.etpBasic && Object.keys( vm.etpBasic).length > 0 ) {
                    if( vm.etpBasic.F16583 ) {
                        addData.F16583  =   vm.etpBasic.F16583;     /* 사무수탁회사번호 */
                    }

                    if( vm.etpBasic.F16012 ) {
                        addData.F16012  =   vm.etpBasic.F16012;     /* ETF종목코드 */
                    }

                    if( vm.etpBasic.F16013 ) {
                        addData.F16013  =   vm.etpBasic.F16013;     /* ETF단축코드 */
                    }
                }

                vm.dataList[ dataJson.rowIndex ]            =   addData;

                vm.dataList[ dataJson.rowIndex ].F16316     =   dataJson.codeVal;       /* 종목코드 */
                vm.dataList[ dataJson.rowIndex ].F16004     =   v_F16004;               /* 종목명 */
                vm.dataList[ dataJson.rowIndex ].F16499     =   v_F16499;               /* CU shrs */
                vm.dataList[ dataJson.rowIndex ].F34840     =   v_F34840;               /* 액면금액 */
                vm.dataList[ dataJson.rowIndex ].F16588     =   v_F16588;               /* 평가금액 */

            }catch( e ) {
                console.log( e );
            }
        },

        /*
         * NEXT 버튼 클릭시 수행한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_stepCheck( step ) {
            var vm = this;

            if( step == 1) {

                var v_check =   true;

                /* 오류메시지가 존재하는 경우 */
                $("#" + vm.tblEmergeny01 + " tbody tr" ).each( function( inx, rowItem ) {
                    var tr = $(this);

                    var v_F16499        =   tr.find( "td input[name='F16499']" );            /* CU 수량 */
                    var v_F34840        =   tr.find( "td input[name='F34840']" );            /* 액믄금액 */

                    if( v_F16499.css("borderColor") == 'rgb(255, 0, 0)' || v_F34840.css("borderColor") == 'rgb(255, 0, 0)' ) {
                        v_check =   false;
                        return  false;
                    }
                });

                if( !v_check ) {
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

                    vm.arr_show_error_message   =  [];

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
                                    "scrollY": ( items.length >= 5 ? '15vh' : '' ),
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

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/etp/saveEtpOperPdfModify"
                        ,   "data"      :   {     
                                    now_date        :   vm.search_date
                                ,   allDataList     :   vm.allDataList
                            }
                        ,   "method"    :   "post"
                    }
                ,   async function(response) {

                        try{

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }                            
                            
                            // try{
                            //     tool.smsSend(0, "ETP PDF 변경신청 접수되었습니다.");
                            // }catch( e ) {
                            //    vm.$emit('showMessageBox', '확인', '문자발송 중 오류가 발생하였으나 긴급반영 처리는 완료되었습니다.',{},1) ;
                            // }

                            if (response.data) {

                                var msg = ( response.data.msg ? response.data.msg : "" );
                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.status = 1;
                                        if ( await vm.$refs.confirm2.open(
                                                '확인',
                                                msg,
                                                {}
                                                ,1
                                            )
                                        ) {
                                            if(vm.$refs.confirm2.val == 'Y') {
                                                vm.status = 0;                                
                                                return  false;
                                            }

                                            vm.status = 0;
                                            return  false;
                                        }
                                    }
                                }

                                vm.fn_getPdfByGroupNo();
                            }

                        }catch(ex) {

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }
                                                        
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {

                        if( vm.$refs && vm.$refs.progress ) {
                            util.processing(vm.$refs.progress, false);
                        }

                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );
            
        },

        fn_getPdfByGroupNo() {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop -> fn_getPdfByGroupNo");            

            util.processing(vm.$refs.progress, true);

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/etp/getPdfByGroupNo"
                        ,   "data"      :   {}
                        ,   "method"    :   "post"
                    }
                ,   async function(response) {

                        try{

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }

                            if (response.data) {

                                var msg = ( response.data.msg ? response.data.msg : "" );
                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.status = 1;
                                        if ( await vm.$refs.confirm2.open(
                                                '확인',
                                                msg,
                                                {}
                                                ,1
                                            )
                                        ) {
                                            if(vm.$refs.confirm2.val == 'Y') {
                                                vm.status = 0;                                
                                                return  false;
                                            }
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
                                                        "scrollY": ( items.length >= 5 ? '15vh' : '' ),
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

                        }catch(ex) {

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {

                        if( vm.$refs && vm.$refs.progress ) {
                            util.processing(vm.$refs.progress, false);
                        }                        
                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );

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
                vm.result.flag  =   false;
                vm.result.msg   =   'ETF 코드를 입력해 주세요.';

                return  false;
            }

            if(  vm.txtAddEtpCode.length < 6
            ) {
                vm.result.flag  =   false;
                vm.result.msg   =   'ETF 코드를 6자리 이상 입력해 주세요.';

                return  false;
            }

            if(  vm.txtAddEtpCode.length > 12
            ) {
                vm.result.flag  =   false;
                vm.result.msg   =   'ETF 코드를 12자리 까지 입력해 주세요.';

                return  false;
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
        async fn_deleteTableData( tableData, tr, rowIndex ) {
            var vm = this;
            var table = $("#" + vm.tblEmergeny01 ).DataTable();

            if( vm.jongmok_state != "" ) {
                vm.status = 1;

                var jongmokCodeData = tr.find("input[name='jongmok']" );
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '구성종목코드(' + jongmokCodeData.eq(0).val() + ')가 처리 중입니다. 다시 삭제버튼을 눌러주세요.',
                        {}
                        ,1
                    )
                ) {
                    vm.jongmok_state = "";
                    vm.status = 0;

                    return  false;
                }
            }
            
            table.row( rowIndex ).remove().order( [0, "asc"] ).draw();
            vm.dataList.splice( rowIndex, 1 );

            vm.fn_modifyAllDataList();
        },

        /*
         * [CU shrs], [액면금액] 변경시 상태값을 변경한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_setStatus( tableData, nowData, rowIndex ) {
            var vm = this;

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var tr = table.row( rowIndex );

            /* 계산된 평가금액 */
            var  v_F16588   =   0;

            /* 1CU단위증권수 */
            if( nowData.name == "F16499" ) {

                if( tableData.status == "insert" ) {

                    if( Number( tableData.F34840 ) > 0 ) {
                        v_F16588    =   0;

                    }else{                        

                        /* v_F16588 (계산된 평가금액) = tableData.F15007 ( kspjong_basic 기준가 ) * nowData.F16499 ( 변경후 CU shrs ) */
                        //F33861 -> 시장구분
                        //F33904 -> 계약승수                        
                        /* 선물 옵션 : 평가금액 = 기준가 * CU수량 * 단위 계약승수*/
                        if (tableData.F33861 == '4') {                        
                            v_F16588    =   Number( tableData.F15007 ) * Number( nowData.F16499 ) * Number(tableData.F33904);
                        /* 코스피, 코스닥 그외 : 평가금액 = 기준가 * CU수량 */
                        } else {
                            v_F16588    =   Number( tableData.F15007 ) * Number( nowData.F16499 );
                        }
                    }
                }else{
                    
                    /* 
                    *   상태값 normal 로 변경
                    *
                    *   수정한 [1CU단위증권수] 와 원본 [1CU단위증권수] 이 같고
                    *   수정했던 [액면금액] 과 원본 [액면금액] 이 같은 경우
                    */
                    if(     Number( tableData.F16499_prev ) == Number( nowData.F16499 )
                        &&  Number( tableData.F34840_prev ) == Number( tableData.F34840 ) ) {
                        table.cell(rowIndex, 9).data( "normal" ).draw();
                        vm.dataList[ rowIndex ].status  =   "normal";
                    }else{
                        table.cell(rowIndex, 9 ).data( "modify" ).draw();
                        vm.dataList[ rowIndex ].status  =   "modify";
                    }

                    /* 변경전 CU shrs 이 0 인 경우 ( 분모가 0 ) */
                    if( Number( tableData.F16499_prev ) == 0  ) {
                        v_F16588    =   0;
                    }else{
                        /* v_F16588 (계산된 평가금액) = tableData.F16588_prev ( 변경전 평가금액 ) * nowData.F16499 ( 변경후 CU shrs ) / tableData.F16499_prev ( 변경전 CU shrs )  */
                        v_F16588    =   Number( tableData.F16588_prev ) * Number( nowData.F16499 ) / Number( tableData.F16499_prev );
                    }
                }

                vm.dataList[ rowIndex ].F16499      =   nowData.F16499;
            }
            /* 액면금액 */
            else if( nowData.name == "F34840" ) {

                if( tableData.status == "insert" ) {

                    if( nowData.F34840 == 0 ) {
                        /* v_F16588 (계산된 평가금액) = tableData.F15007 ( kspjong_basic 기준가 ) * nowData.F16499 ( 변경후 CU shrs ) */
                        //F33861 -> 시장구분
                        //F33904 -> 계약승수                        
                        /* 선물 옵션 : 평가금액 = 기준가 * CU수량 * 단위 계약승수*/
                        if (tableData.F33861 == '4') {                        
                            v_F16588    =   Number( tableData.F15007 ) * Number( tableData.F16499 ) * Number(tableData.F33904);
                        /* 코스피, 코스닥 그외 : 평가금액 = 기준가 * CU수량 */
                        } else {
                            v_F16588    =   Number( tableData.F15007 ) * Number( tableData.F16499 );
                        }
                    }else{
                        /* v_F16588 (계산된 평가금액)  */
                        v_F16588    =   0;
                    }


                }else {
                                        
                    /* 
                    *   상태값 normal 로 변경
                    *
                    *   수정한 [액면금액] 과 원본 [액면금액] 이 같고
                    *   수정했던 [1CU단위증권수] 과 원본 [1CU단위증권수] 이 같은 경우
                    */
                    if(     Number( tableData.F34840_prev ) == Number( nowData.F34840 )
                        &&  Number( tableData.F16499_prev ) == Number( tableData.F16499 ) ) {
                        table.cell(rowIndex, 9).data( "normal" ).draw();
                        vm.dataList[ rowIndex ].status  =   "normal";
                    }
                    else{
                        table.cell(rowIndex, 9 ).data( "modify" ).draw();
                        vm.dataList[ rowIndex ].status  =   "modify";
                    }

                    if( Number( nowData.F34840 ) == 0 ) {

                        /* 변경전 CU shrs 이 0 인 경우 ( 분모가 0 ) */
                        if( Number( tableData.F16499_prev ) == 0  ) {
                            v_F16588    =   0;
                        }else{
                            /* v_F16588 (계산된 평가금액) = tableData.F16588_prev ( 변경전 평가금액 ) * nowData.F16499 ( 변경후 CU shrs ) / tableData.F16499_prev ( 변경전 CU shrs )  */
                            v_F16588    =   Number( tableData.F16588_prev ) * Number( tableData.F16499 ) / Number( tableData.F16499_prev );
                        }
                    }else{
                        /* 변경전 액면금액 이 0 인 경우 ( 분모가 0 ) */
                        if( Number( tableData.F34840_prev ) == 0  ) {
                            v_F16588    =   0;
                        }else{
                            /* v_F16588 (계산된 평가금액) = tableData.F16588_prev ( 변경전 평가금액 ) * nowData.F34840 ( 변경후 액면금액 ) / tableData.F34840_prev ( 변경전 액면금액 )  */
                            v_F16588    =   Number( tableData.F16588_prev ) * Number( nowData.F34840 ) / Number( tableData.F34840_prev );
                        }
                    }
                }

                vm.dataList[ rowIndex ].F34840      =   nowData.F34840;
            }

            v_F16588 = Math.round(v_F16588);
            table.cell( rowIndex, 6 ).data( v_F16588 ).draw();  /* 화면 table 의 평가금액 컬럼 데이터 변경 */

            table.row( rowIndex ).invalidate().draw();
            vm.dataList[ rowIndex ].F16588    =   v_F16588;         /* DB 에 저장하기 위해 계산된 평가금액 보관 */
        },

        /*
         * 자산추가된 행에 대해 빈 값이 존재하는지 체크한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_emptyCheck() {

            var vm = this;

            var jongmokData = $("#tblEmergeny01 tbody").find("input[name='jongmok']" );     /* 종목코드 */
            var F16004Data = $("#tblEmergeny01 tbody").find("input[name='F16004']" );       /* 종목명 */


        /* 종목코드 빈값 체크 */
            var filterData  =   _.filter( tblEmergeny01.rows( jongmokData.parents("tr") ).data(), function( o, i ) {
                if( o.status == "insert" && jongmokData.eq(i).val() == "" ) {
                    return  true;
                }
            });

            if( filterData.length > 0 ) {
                vm.status = 1;
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '구성종목코드 빈 항목이 존재합니다.',
                        {}
                        ,1
                    )
                ) {
                    if(vm.$refs.confirm2.val == 'Y') {
                        vm.status = 0;
                        return  false;
                    }

                    vm.status = 0;
                    return  false;
                }
            }

         /* 종목명 빈값 체크 */
            filterData  =   _.filter( tblEmergeny01.rows( F16004Data.parents("tr") ).data(), function( o, i ) {
                if( o.status == "insert" && F16004Data.eq(i).val() == "" ) {
                    return  true;
                }
            });


            if( filterData.length > 0 ) {
                vm.status = 1;
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '종목명 빈 항목이 존재합니다.',
                        {}
                        ,1
                    )
                ) {
                    if(vm.$refs.confirm2.val == 'Y') {
                        vm.status = 0;
                        return  false;
                    }

                    vm.status = 0;
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
                vm.status = 1;
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '수정건이 1건 이상 존재해야 합니다.',
                        {}
                        ,1
                    )
                ) {
                    if(vm.$refs.confirm2.val == 'Y') {
                        vm.status = 0;
                        return  false;
                    }

                    vm.status = 0;
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
                vm.status = 1;
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '구성종목코드가 확인 되지 않은 건이 존재합니다.',
                        {}
                        ,1
                    )
                ) {
                    if(vm.$refs.confirm2.val == 'Y') {
                        vm.status = 0;
                        return  false;
                    }

                    vm.status = 0;
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

        fn_nextButtonDisabledCheck() {
            var vm = this;
            
            if( vm.jongmok_state=="" ){
                return  false;
            }else if( ( vm.allDataList.length > 0 || vm.dataList.length > 0 ) && vm.jongmok_state=="" ){
                return  false;
            }else{
                return  true;
            }
        },

        /*
         * 팝업창을 종료한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_close() {
            var vm = this;

            if( vm.status == 0 ) {
                vm.$emit( "fn_closePop", "close" );
            }
        },

        /*
         * PDF 엑셀을 업로드 한다.
         * 2019-07-26  bkLove(촤병국)
         */    
        fn_uploadPdf( file ) {
            var vm = this;

            var p_param     =   {};

            vm.arr_show_error_message   =   [];


            if(     vm.etpBasic.F16012 == "undefined"
                ||  vm.etpBasic.F16012 == ""
            ) {
                vm.arr_show_error_message.push( "ETF 코드가 존재하지 않습니다." );
                return  false;
            }

            if(     vm.etpBasic.F16013 == "undefined"
                ||  vm.etpBasic.F16013 == ""
            ) {
                vm.arr_show_error_message.push( "ETF 코드가 존재하지 않습니다." );
                return  false;
            }

            if(     vm.etpBasic.F16583 == "undefined"
                ||  vm.etpBasic.F16583 == ""
            ) {
                vm.arr_show_error_message.push( "ETF 코드가 존재하지 않습니다." );
                return  false;
            }

            p_param.F12506              =   vm.search_date;
            p_param.F16012              =   vm.etpBasic.F16012;
            p_param.F16013              =   vm.etpBasic.F16013;
            p_param.F16583              =   vm.etpBasic.F16583;

            return  new Promise(function(resolve, reject) {

                let formData    =   new FormData();
                var check       =   true;

                formData.append( "files", file );
                formData.append( "data", JSON.stringify( p_param ) );   

                util.processing(vm.$refs.progress, true);

                util.axiosCall(
                        {
                                "url"           :   Config.base_url + "/user/etp/uploadPdf"
                            ,   "data"          :   formData
                            ,   "method"        :   "post"
                            ,   "paramKey"      :   ""
                            ,   "headers"       :   {   "Content-Type": "multipart/form-data"   }
                        }
                    ,   async function(response) {

                            util.processing(vm.$refs.progress, false);

                            try{

                                if( response.data ) {

                                    if( !response.data.result ) {
                                        var errorList = [];

                                        if(     ( typeof response.data.count_check  != "undefined"  && !response.data.count_check )
                                            ||  ( typeof response.data.record_check != "undefined"  && !response.data.record_check ) 
                                        ) {

                                            if( typeof response.data.errorList != "undefined" && response.data.errorList.length > 0 ) {
                                                errorList    =   response.data.errorList;

                                                for( var i=0; i < errorList.length; i++ ) {
                                                    if( !errorList[i].result && errorList[i].msg ) {
                                                        vm.arr_show_error_message.push( errorList[i].msg );
                                                    }
                                                }
                                            }else{
                                                var msg = ( response.data.msg ? response.data.msg : "" );

                                                if( msg ) {
                                                    vm.arr_show_error_message.push( msg );
                                                }
                                            }
                                        }else{
                                            var msg = ( response.data.msg ? response.data.msg : "" );

                                            if( msg ) {
                                                vm.arr_show_error_message.push( msg );
                                            }
                                        }

                                        check   =   false;
                                    }


                                    if( check ) {
                                        vm.dataList         =   [];
                                        tblEmergeny01.clear().draw();                                        

                                        vm.$nextTick( function(o) {
                                            vm.dataList =   response.data.pdf_list;
                                            tblEmergeny01.rows.add( vm.dataList ).draw();
                                        });
                                    }

                                }else{
                                    check = false;
                                }


                                if( check ) {
                                    resolve( { result : true } );
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            util.processing(vm.$refs.progress, false);
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
            });

        },

        /*
         * 엑셀 유형인지 파일을 체크한다.
         * 2019-09-06  bkLove(촤병국)
         */
         fn_checkFile( file ) {
            var vm = this;

            var fileLen = file.name.length;
            var lastDot = file.name.lastIndexOf(".");

            var check = true;

            return  new Promise( async function(resolve, reject) {

                /* 1. 확장자가 존재하지 않는지 확인 */
                if (lastDot == -1) {
                    if( await vm.$refs.confirm2.open(
                                '[엑셀파일 유형확인]'
                            ,   "엑셀유형의 파일인지 확인 해 주세요."
                            ,   {}
                            ,   1
                        )
                    ) {
                        check   =   false;
                    }
                }

                var fileExt     =   file.name.substring(lastDot + 1, fileLen).toLowerCase();
                var allowExt    =   ["xls", "xlsx", "csv"];

                /* 2. 허용되는 확장자에 포함되는지 확인 */
                if (!allowExt.includes(fileExt)) {

                    if( vm.$refs.confirm2.open(
                                '[엑셀파일 유형확인]',
                                "엑셀유형의 파일인지 확인 해 주세요.",
                                {}
                            ,   1
                        )
                    ) {        
                        check   =   false;
                    }
                }
                
                if( check ) {
                    resolve( { result : true } );
                }else{
                    resolve( { result : false } );
                }

            }).catch( function(e) {
                console.log( e );
                resolve( { result : false } );
            });
        },        

        /*
         * 파일 사이즈를 체크한다.
         * 2019-09-06  bkLove(촤병국)
         */
        fn_sizeCheck( file, gubun ) {
            var vm = this;

            var check = true;

            return  new Promise( async function(resolve, reject) {

                if( file ) {
                    var title = "포트폴리오";
                    var maxSize = vm.limit.max_size;

                    if( maxSize > 0 ) {
                        if( file.size == 0 ) {
                            if( await vm.$refs.confirm2.open(
                                        '확인',
                                        title + ' 파일용량이 0 byte 입니다.',
                                        {}
                                    ,   1
                                )
                            ) {
                                check = false;
                            }
                        }

                        if( ( maxSize * 1024 * 1024 ) < file.size ) {
                            if( await vm.$refs.confirm2.open(
                                        '확인',
                                        title + ' 파일용량은 ' + maxSize + ' Mb 보다 작아야 합니다.',
                                        {}
                                    ,   1
                                )
                            ) {                       
                                check = false;
                            }
                        }
                    }
                }else{
                    check = false;
                }

                if( check ) {
                    resolve( { result : true } );
                }else{
                    resolve( { result : false } );
                }

            }).catch( function(e) {
                console.log( e );

                resolve( { result : false } );
            });                
        },

        /*
         * 파일 선택시
         * 2019-09-06  bkLove(촤병국)
         */
        fn_fileClick: function() {
            this.$refs.pdfUpload.click();
        },
    },
};
</script>
