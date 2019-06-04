<template>
    <v-container>
    <v-flex>
    <v-dialog v-model="showDialog" persistent max-width="900" @keydown.enter.prevent="fn_prevent_event">
        
        <v-card class="mx-auto">

            <v-window v-model="step">


                <v-window-item :value="1">
<!---step1 START-->
                    <v-card flat class="listset_pop">
                        <h5>
                            <v-card-title ma-0>
                                {{ etpBasic.f16002          /* 한글종목명 */ }}
                                <span>{{ etpBasic.f16013    /* 단축코드 */ }}</span>

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

                                <!---개발 중복 자산추가 팝업 end----->
                            </v-toolbar>
                        </v-card>
                        
                        <v-card flat>

                            <table :id="tblEmergeny01" class="tbl_type ver7" style="width:100%" >

                                <colgroup>
                                    <col width="10%">
                                    <col width="8%">
                                    <col width="12%">
                                    <col width="14%">
                                    <col width="12">
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
                        <v-btn color="primary" depressed @click="fn_stepCheck(1)">Next</v-btn>
                    </v-card-actions>
<!---step1 END-->
                </v-window-item>





                <v-window-item :value="2">
<!---step2 START-->
                    <v-card flat class="listset_pop">
                        <h5>
                            <v-card-title ma-0>
                                <v-btn icon :disabled="step === 1" flat @click="step--">
                                    <v-icon>arrow_back_ios</v-icon>
                                </v-btn>PDF 변경신청 현황

                                <v-spacer></v-spacer>
                                <v-btn icon @click="fn_close">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-card-title>
                        </h5>
                        <v-card flat>
                            <v-flex xs12    v-for="subData in allDataList" :key='"step2_" + subData.etf_f16012'>

                                <h4>
                                    {{ subData.etf_f16002           /* ETF 한글종목명 */    }}
                                    <span>{{ subData.etf_f16013     /* ETF 단축코드 */      }}</span>
                                </h4>

                                <table v-bind:id='"step2_" + subData.etf_f16012' class="tbl_type ver7" style="width:100%"></table>

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
                            <v-flex xs12    v-for="subData in allDataList" :key='"step3_"  + subData.etf_f16012'>

                                <h4>
                                    {{ subData.etf_f16002           /* ETF 한글종목명 */    }}
                                    <span>{{ subData.etf_f16013     /* ETF 단축코드 */      }}</span>
                                </h4>

                                <table v-bind:id='"step3_" + subData.etf_f16012' class="tbl_type ver7" style="width:100%"></table>

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
                                신일식 과장 767-0000
                                <br>이형준 과장 767-0000
                                <br>오춘교 대리 767-0000
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
import ProgressBar from "@/components/common/ProgressBar.vue";

var tblEmergeny01 = null;

export default {
    props : [ "showDialog", "paramData" ],
    components : {
        ProgressBar: ProgressBar
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
            }
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
                        if( typeof row.f16316 != "undefined" && row.f16316.length > 0 ) {       /* 구성종목코드 */
                            if( row.f16316.indexOf( "<input" ) > -1 ) {
                                htm = util.formatNumber( data );
                            }else{
                                /* 1CU단위증권수 */
                                htm = "<input type='number' name='f16499' id='f16499' style='width:100%; text-align:right' value='" + util.formatNumber( data ) + "' maxlength='15'>";
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
                                htm = "<input type='number' name='f34840' id='f34840' style='width:100%; text-align:right' value='" + util.formatNumber( data ) + "' maxlength='15'>";
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
                { "data" : "fmt_f12506"     ,   "orderable" : false  ,   "className" : "txt_center" ,   "width" :   "10%"   , "title" :   "Date"          },   /* Date */
                { "data" : "f33861"         ,   "orderable" : false  ,   "className" : "txt_center" ,   "width" :   "8%"    , "title" :   "시장<br>구분"      },  /* 시장구분 */
                { "data" : "f16316"         ,   "orderable" : false  ,   "className" : "txt_left"   ,   "width" :   "12%"   , "title" :   "구성종목코드"  },  /* 구성종목코드 */
                { "data" : "f16004"         ,   "orderable" : false  ,   "className" : "txt_left"   ,   "width" :   "14%"   , "title" :   "종목명"        },  /* 종목명 */
                { "data" : "f16499"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "CU shrs"       },  /* CU shrs */
                { "data" : "f34840"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "액면금액"      },  /* 액면금액 */
                { "data" : "f16588"         ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "12%"   , "title" :   "평가금액"      },  /* 평가금액 */
                { "data" : "fmt_f34743"     ,   "orderable" : false  ,   "className" : "txt_right"  ,   "width" :   "10%"    , "title" :   "비중(%)"      },  /* 비중 */
                { "data": null              ,   "orderable" : false  ,   "align":"center"           ,   "width" :   "9%"    , defaultContent:"" },

                { "data" : "status"         ,   "visible"   : false   },                                                                /* status */
                { "data" : "code_check"     ,   "visible"   : false   },                                                                /* code_check */
                { "data" : "f16499_prev"    ,   "visible"   : false   },                                                                /* CU shrs (변경전) */                
            ]
        });

        /* [자산추가] 후 확인 종목코드에 엔터키 입력시 */
/*        
        $("#" + vm.tblEmergeny01 + " tbody").on('keyup', "input[name='jongmok']", function (e) {
            if( e.keyCode == 13 ) {

                var table = $("#" + vm.tblEmergeny01 ).DataTable();
                var data = table.row($(this).parents("tr")).data();
                var rowIndex = table.row($(this).parents("tr")).index();

                vm.fn_getJongmokData( $(this).eq(0).val() , rowIndex  );
            }
        });        
*/
        /* [자산추가] 후 확인 버튼 클릭시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('click', "button[name='confirm']", function () {

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();

            vm.fn_getJongmokData( $(this).parents("tr").find( "input[name='jongmok']" ).eq(0).val() , rowIndex  );
        });



        /* CU shrs 수정시 */
        $("#" + vm.tblEmergeny01 + " tbody").on('blur', "input[name='f16499'],input[name='f34840']", function () {

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var jongmokTag = $(this).parents("tr").find( "input[name='jongmok']" );


            var nowData = {};

            /* CU shrs */
            if ( $(this).attr('name') == 'f16499' ) {
                var tdData = $(this).eq(0).val();
                $(this).eq(0).val( util.formatNumber( tdData ) );

                nowData.name = "f16499";
                nowData.f16499  =   $(this).eq(0).val();
            }
            /* 액면금액 */
            else if( $(this).attr('name') == 'f34840' ) {
                var tdData = $(this).eq(0).val();
                $(this).eq(0).val( util.formatNumber( tdData ) );

                nowData.name = "f34840";
                nowData.f34840  =   $(this).eq(0).val();
            }


            vm.fn_setStatus( data, nowData, rowIndex, ( jongmokTag ? jongmokTag.length : 0 ) );
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
        searchParam.f16012              =   vm.paramData.f16012;                   /* 국제표준코드 */
/* 여러종류의 ETF 코드 데이터 저장을 위해 임시로 처리함 */
//        searchParam.f16012              =   "KR7322410002";
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

            util.processing(vm.$refs.progress, true);
            axios.post( Config.base_url + "/user/etp/getEtpOperPdfModify", {
                data: searchParam
            }).then(function(response) {
                console.log(response);

                util.processing(vm.$refs.progress, false);

                if (response.data) {
                    var etpBasic = response.data.etpBasic;
                    var dataList = response.data.dataList;

                    if( searchParam.initYn == "N" ) {

                        if( etpBasic && Object.keys( etpBasic ).length > 0 ) {

                            /* allDataList 에서 존재하는 인덱스를 확인한다. */
                            var filterIndex  =   _.findIndex( vm.allDataList,    {
                                    "etf_f16012"    :   etpBasic.f16012      /* ETF 국제표준코드 */
                                ,   "etf_f16013"    :   etpBasic.f16013      /* ETF 단축코드 */
                            });

                            if( filterIndex > -1 ) {
                                vm.result.flag  =   false;
                                vm.result.msg   =   '해당 코드는 이미 변경작업에 존재합니다. 다른 코드를 선택해 주세요.';

                                return  false;
                            }

                            /* 로그인 운용사코드와 동일한지 체크 */
                            if( etpBasic.login_f33960_check != "Y" ) {
                                vm.result.flag  =   false;
                                vm.result.msg   =   '타 발행사의 종목은 변경하실수 없습니다.';

                                return  false;
                            }

                            /* 사무수탁회사번호 가 없는 경우 */
/* 여러종류의 ETF 코드 데이터 저장을 위해 임시로 처리함 */
//etpBasic.f16583 = 10;
                            if( etpBasic.f16583 == "" ) {
                                vm.result.flag  =   false;
                                vm.result.msg   =   '사무수탁회사번호가 존재하지 않습니다.';

                                return  false;
                            }

                        }else{

                            vm.result.flag  =   false;
                            vm.result.msg   =   '해당코드의 데이터가 존재하지 않습니다.';

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
                
            });
        },

        /*
         * [자산 추가] 후 구성종목 찾기를 누를시 실행한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getJongmokData( codeVal, rowIndex ) {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop -> fn_getJongmokData");

            if(     !codeVal
                ||  codeVal.length == 0
            ) {
                vm.$emit("showMessageBox", '확인','구성종목코드를 입력해 주세요.',{},1);

                return  false;
            }

            if(  codeVal.length < 6 ) {
                vm.$emit("showMessageBox", '확인','구성종목코드를 6자리 이상 입력해 주세요.',{},1);

                return  false;
            }            

            util.processing(vm.$refs.progress, true);
            axios.post( Config.base_url + "/user/etp/getJongmokData", {
                data: { "searchCode" : codeVal }
            }).then(function(response) {
                console.log(response);

                util.processing(vm.$refs.progress, false);

                if (response.data) {
                    var dataList = response.data.dataList;

                    if ( !dataList || dataList.length == 0 ) {
                        vm.$emit("showMessageBox", '확인','구성종목코드(' + codeVal + ')가 존재하지 않습니다.',{},1);
                        return  false;
                    }

                    if ( dataList && dataList.length > 1 ) {
                        vm.$emit("showMessageBox", '확인','구성종목코드(' + codeVal + ')가 여러건 존재합니다.',{},1);
                        return  false;
                    }

                    var filterData = _.filter( tblEmergeny01.rows().data() , function(o) {
                        if ( o.f16316 == dataList[0].f16012 ) {
                            return true; 
                        }
                    });

                    if( filterData.length > 0 ) {
                        vm.$emit("showMessageBox", '확인','구성종목코드(' + codeVal + ')가 이미 존재합니다.',{},1);
                        return  false;
                    }

                    var addData     =   {

                            "fmt_f12506"    :   dataList[0].fmt_f12506      /* Date */
                        ,   "f33861"        :   dataList[0].f33861          /* 시장구분 */
                        ,   "f16316"        :   dataList[0].f16012          /* 구성종목코드 */
                        ,   "f16004"        :   dataList[0].f16002          /* 종목명 */

                        ,   "f16499"        :   0                           /* CU shrs */
                        ,   "f34840"        :   0                           /* 액면금액 */
                        ,   "f16588"        :   0                           /* 평가금액 */
                        ,   "fmt_f34743"    :   0                           /* 비중 */

                        ,   "status"        :   "insert"
                        ,   "code_check"    :   true
                        ,   "f16499_prev"   :   0                           /* CU shrs ( 변경전 ) */                        
                    }

                    tblEmergeny01.row(rowIndex).data( addData ).order( [0, "asc"] ).draw(  );

                    vm.dataList[ rowIndex ] =   addData;
                }
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
                    'fmt_f12506'    :   ''              /* Date */
                ,   'f33861'        :   ''              /* 시장구분 */
                ,   'f16316'        :   "<input type='text' name='jongmok' id='jongmok' class='txt_left' style='width:100%' placeholder='12자리/6자리코드' maxlength='15' >"            /* 구성종목코드 */
                ,   'f16004'        :   "<button  name='confirm' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01'>확인</button>"                              /* 종목명 */
                ,   'f16499'        :   ''              /* CU shrs */
                ,   'f34840'        :   ''              /* 액면금액 */
                ,   'f16588'        :   '0'             /* 평가금액 */
                ,   'fmt_f34743'    :   '0'             /* 비중 */

                ,   "status"        :   "insert"
                ,   "code_check"    :   false
                ,   "f16499_prev"   :   ''              /* CU shrs ( 변경전 ) */                
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

                /* 자산추가된 행에 대해 빈 값이 존재하는지 체크한다. */
                if( !vm.fn_emptyCheck() )   {
                    return  false;
                }

                /* 자산추가 후 구성종목코드가 확인이 되지 않는건이 있는지 확인한다. */
                if( !vm.fn_codeCheck() ) {
                    return  false;
                }

                /* 추가 또는 수정건이 존재하는지 체크한다. */
                if(     !vm.allDataList 
                    ||  vm.allDataList.length == 0  
                ) {
                    if( !vm.fn_modifyCheck() ) {
                        return  false;
                    }
                }


                vm.fn_modifyAllDataList();


                /* 이전건 + 현재건 데이터가 존재하는 경우 */
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
                                                    "etf_f16012"    :   vm.etpBasic.f16012      /* ETF 국제표준코드 */
                                                ,   "etf_f16013"    :   vm.etpBasic.f16013      /* ETF 단축코드 */
                                            });

                        /* 현재건 삭제 */
                        vm.allDataList.splice( filterIndex, 1 );
                    }
                }




                if( vm.allDataList.length > 0 ) {

                    var items = [];
                    for ( let subData of vm.allDataList ) {

                        vm.$nextTick().then(() => {

                            if ( $.fn.DataTable.isDataTable('#step2_' + subData.etf_f16012 ) ) {
                                $('#step2_' + subData.etf_f16012).DataTable().destroy();
                                $('#step2_' + subData.etf_f16012).empty();
                            }   

                            items = subData.data;

                            console.log("subData.etf_f16012=[" + subData.etf_f16012 + "]");
                            console.log( "items" );
                            console.log( items );
                            
                            $( '#step2_' + subData.etf_f16012 ).DataTable( {
                                    "processing": true,
                                    "serverSide": false,
                                    "info": false,   // control table information display field
                                    "stateSave": true,  //restore table state on page reload,
                                    "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                    
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
                                            /* 변경전 */
                                            "render": function ( data, type, row ) {

                                                var htm = "";
                                                if( typeof row.status != "undefined" ) {
                                                    if( row.status == "insert" ) {
                                                        htm = "-";
                                                    }else{
                                                        htm = data;
                                                    }
                                                }

                                                return htm;
                                            },
                                            "targets": 3
                                        },                                        
                                    ],
                                    columns: [
                                        { "data" : "status"         ,   "width" :   "15%"   ,   "orderable" : false  ,   "className" : "txt_center" ,    "title" :   "구분"     },     /* 구분 */
                                        { "data" : "f16316"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_left"   ,    "title" :   "CODE"     },     /* 코드 */
                                        { "data" : "f16004"         ,   "width" :   "25%"   ,   "orderable" : false  ,   "className" : "txt_left"   ,    "title" :   "종목"     },     /* 종목명 */
                                        { "data" : "f16499_prev"    ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"  ,    "title" :   "변경전"   },     /* CU shrs (변경전) */
                                        { "data" : "f16499"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"  ,    "title" :   "변경후"   },     /* CU shrs */
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


            axios.post( Config.base_url + "/user/etp/saveEtpOperPdfModify", {
                data: { allDataList : vm.allDataList }
            }).then(function(response) {

                console.log(response);

                if (response.data) {

                    if( !response.data.result ) {
                        vm.$emit("showMessageBox", '확인', response.data.msg,{},1);
                        return  false;
                    }



                    vm.step     =   3;
                    if( vm.allDataList.length > 0 ) {

                        var items = [];
                        for ( let subData of vm.allDataList ) {

                            vm.$nextTick().then(() => {

                                if ( $.fn.DataTable.isDataTable('#step3_' + subData.etf_f16012 ) ) {
                                    $('#step3_' + subData.etf_f16012).DataTable().destroy();
                                    $('#step3_' + subData.etf_f16012).empty();
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
                                                /* 변경전 */
                                                "render": function ( data, type, row ) {

                                                    var htm = "";
                                                    if( typeof row.status != "undefined" ) {
                                                        if( row.status == "insert" ) {
                                                            htm = "-";
                                                        }else{
                                                            htm = data;
                                                        }
                                                    }

                                                    return htm;
                                                },
                                                "targets": 3
                                            },                                        
                                        ],
                                        columns: [
                                            { "data" : "status"         ,   "width" :   "15%"   ,   "orderable" : false  ,   "className" : "txt_center" ,    "title" :   "구분"     },     /* 구분 */
                                            { "data" : "f16316"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_left"   ,    "title" :   "CODE"     },     /* 코드 */
                                            { "data" : "f16004"         ,   "width" :   "25%"   ,   "orderable" : false  ,   "className" : "txt_left"   ,    "title" :   "종목"     },     /* 종목명 */
                                            { "data" : "f16499_prev"    ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"  ,    "title" :   "변경전"   },     /* CU shrs (변경전) */
                                            { "data" : "f16499"         ,   "width" :   "20%"   ,   "orderable" : false  ,   "className" : "txt_right"  ,    "title" :   "변경후"   },     /* CU shrs */
                                        ]
                                }).draw();
                            });
                        }
                    }
                }
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

        fn_addEtfOperPdfModify() {
            var vm = this;

            console.log("EtpOperPdfEmergencyModifyPop.vue -> fn_addEtfOperPdfModify");

            if(     !vm.txtAddEtpCode
                ||  vm.txtAddEtpCode.length == 0
            ) {
                vm.$emit("showMessageBox", '확인','ETF 코드를 입력해 주세요.',{},1);

                return  false;
            }

            if(  vm.txtAddEtpCode.length < 6
            ) {
                vm.$emit("showMessageBox", '확인','ETF 코드를 6자리 이상 입력해 주세요.',{},1);

                return  false;
            }            

            var searchParam                 =   {}
            searchParam.f16012              =   vm.txtAddEtpCode;
            searchParam.initYn              =   "N";

            vm.fn_getEtpOperPdfModify( searchParam );
        },

        /*
         * 삭제버튼 클릭시 로직을 수행한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_deleteTableData( tableData, f16499, rowIndex, jongmokTagYn ) {
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
        fn_setStatus( tableData, nowData, rowIndex, jongmokTagYn ) {
            var vm = this;

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var tr = table.row( rowIndex );

            /* 종목코드 태그가 존재하지 않는 경우 */
            if( jongmokTagYn == 0 ) {

                /* 1CU단위증권수 */
                if( nowData.name == "f16499" ) {
debugger;
                    if( tableData.status != "insert" ) {
                        
                        /* DB 에 저장된 값이 존재하면 상태값은 변경 상태 */
                        if(  tableData.f16499_exist ) {
                            table.cell( tr, 9 ).data( { "status" : "modify" } );
                            vm.dataList[ rowIndex ].status  =   "modify";
                        }
                        /* 
                        *   상태값 normal 로 변경
                        *
                        *   수정한 [1CU단위증권수] 와 원본 [1CU단위증권수] 이 같고
                        *   수정했던 [액면금액] 과 원본 [액면금액] 이 같은 경우
                        */
                        else if(   tableData.f16499_prev == nowData.f16499 
                                &&  tableData.f34840_prev == tableData.f34840 ) {
                            table.cell( tr, 9 ).data( { "status" : "normal" } );
                            vm.dataList[ rowIndex ].status  =   "normal";
                        }
                        else{
                            table.cell( tr, 9 ).data( { "status" : "modify" } );
                            vm.dataList[ rowIndex ].status  =   "modify";
                        }
                    }

                    vm.dataList[ rowIndex ].f16499      =   util.formatNumber( nowData.f16499 );
                }
                /* 액면금액 */
                else if( nowData.name == "f34840" ) {

                    if( tableData.status != "insert" ) {
                        
                        /* DB 에 저장된 값이 존재하면 상태값은 변경 상태 */
                        if(  tableData.f34840_exist ) {
                            table.cell( tr, 9 ).data( { "status" : "modify" } );
                            vm.dataList[ rowIndex ].status  =   "modify";
                        }                        
                        /* 
                        *   상태값 normal 로 변경
                        *
                        *   수정한 [액면금액] 과 원본 [액면금액] 이 같고
                        *   수정했던 [1CU단위증권수] 과 원본 [1CU단위증권수] 이 같은 경우
                        */
                        else if(    tableData.f34840_prev == nowData.f34840 
                                &&  tableData.f16499_prev == tableData.f16499 ) {
                            table.cell( tr, 9 ).data( { "status" : "normal" } );
                            vm.dataList[ rowIndex ].status  =   "normal";
                        }
                        else{
                            table.cell( tr, 9 ).data( { "status" : "modify" } );
                            vm.dataList[ rowIndex ].status  =   "modify";
                        }
                    }

                    vm.dataList[ rowIndex ].f34840      =   util.formatNumber( nowData.f34840 );
                }

            }else{
                vm.dataList[ rowIndex ].code_check  =   false;

                if( nowData.name == "f16499" ) {
                    vm.dataList[ rowIndex ].f16499      =   util.formatNumber( nowData.f16499 );
                }else{
                    vm.dataList[ rowIndex ].f34840      =   util.formatNumber( nowData.f34840 );
                }                
            }
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
                vm.$emit("showMessageBox", '확인','구성종목코드가 빈 항목이 존재합니다.',{},1);
                return  false;
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
                vm.$emit("showMessageBox", '확인','수정건이 1건 이상 존재해야 합니다.',{},1);
                return  false;
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
                vm.$emit("showMessageBox", '확인','구성종목코드가 확인 되지 않은 건이 존재합니다.',{},1);
                return  false;
            }

            return  true;
        },

        fn_modifyAllDataList() {

            var vm = this;

            /* allDataList 에서 존재하는 인덱스를 확인한다. */
            var filterIndex  =   _.findIndex( vm.allDataList,    {
                                        "etf_f16012"    :   vm.etpBasic.f16012      /* ETF 국제표준코드 */
                                    ,   "etf_f16013"    :   vm.etpBasic.f16013      /* ETF 단축코드 */
                                });

            /* 변경된 데이터만 추출 */
            var filterData  =   _.filter( vm.dataList, function( o, i ) {
                if( o.status == "insert" || o.status == "modify" ) {
                    return  true;
                }
            });

            /* 추가할 데이터 */
            var jsonData    =   {
                    "etf_f16012"    :   vm.etpBasic.f16012      /* ETF 국제표준코드 */
                ,   "etf_f16013"    :   vm.etpBasic.f16013      /* ETF 단축코드 */
                ,   "etf_f16002"    :   vm.etpBasic.f16002      /* ETF 한글종목명 */
                ,   "etf_f16583"    :   vm.etpBasic.f16583      /* ETF 사무수탁회사번호 */
                ,   "data"          :   filterData
            };                                             


            /* 존재하지 않는 경우 */
            if( filterIndex == -1 ) {
                vm.allDataList.push( jsonData );
            }
            /* 존재하는 경우 해당 인덱스에 데이터 교체 */
            else{
                vm.allDataList[ filterIndex ]   =   jsonData;
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

        fn_prevent_event() {

            return  true;
        }
    },
};
</script>
