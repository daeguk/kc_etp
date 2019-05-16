<template>

    <v-dialog v-model="showDialog" persistent max-width="900">
        
        <v-card class="mx-auto">

            <v-window v-model="step">

                <v-spacer></v-spacer>
                <v-btn icon @click="fn_closePop">
                    <v-icon>close</v-icon>
                </v-btn>



                <v-window-item :value="1">
<!---step1 START-->
                    <v-card flat class="listset_pop">
                        <h5>
                            <v-card-title ma-0>
                                {{ etpBasic.f16002          /* 한글종목명 */ }}
                                <span>{{ etpBasic.f16013    /* 단축코드 */ }}</span>
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

                            <table :id="tblEmergeny01" class="tbl_type" style="width:100%">

                                <colgroup>
                                    <col width="10%">
                                    <col width="10%">
                                    <col width="14%">
                                    <col width="18%">
                                    <col width="12%">
                                    <col width="12%">
                                    <col width="12%">
                                    <col width="12%">
                                    <col>
                                    <col>
                                    <col>                                    
                                </colgroup>

                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th>Date</th>
                                        <th class="txt_right">시장구분</th>
                                        <th class="txt_left">구성종목코드</th>
                                        <th class="txt_left">종목명</th>
                                        <th class="txt_right">CU Shrs</th>
                                        <th class="txt_right">액면금액</th>
                                        <th class="txt_right">평가금액</th>
                                        <th class="txt_right">비중</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr class="pdfmody_acttd">
                                        <td></td>
                                        <td></td>
                                        <td colspan="6" class="txt_left">
                                            <input
                                                type="text"
                                                class="txt_left width_fix"
                                                placeholder="12자리/6자리코드"
                                            >
                                            <button
                                                type="button"
                                                class="v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01"
                                                v-on="on"
                                            >확인</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text_blue">20181112</td>
                                        <td class="txt_right text_blue">2</td>
                                        <td class="txt_left text_blue">KRD010010001</td>
                                        <td class="txt_left text_blue">원화현금</td>
                                        <td class="txt_right">
                                            <input type="text" class="txt_right">
                                        </td>
                                        <td class="txt_right">0</td>
                                        <td class="txt_right">548521321300</td>
                                        <td class="txt_right">85.65</td>
                                    </tr>
                                    <tr>
                                        <td>20181112</td>
                                        <td class="txt_right">2</td>
                                        <td class="txt_left">KRD010010001</td>
                                        <td class="txt_left">원화현금</td>
                                        <td class="txt_right">
                                            <input type="text" class="txt_right">
                                        </td>
                                        <td class="txt_right">0</td>
                                        <td class="txt_right">548521321300</td>
                                        <td class="txt_right">85.65</td>
                                    </tr>
                                </tbody>
                            
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
                                <v-btn icon @click="dialog5 = false">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-card-title>
                        </h5>
                        <v-card flat>
                            <table id class="tbl_type" style="width:100%">
                                <colgroup>
                                    <col width="15%">
                                    <col width="20%">
                                    <col width="25%">
                                    <col width="20%">
                                    <col width="20%">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th class="txt_left">CODE</th>
                                        <th class="txt_left">종목</th>
                                        <th class="txt_right">변경전</th>
                                        <th class="txt_right">변경후</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>변경</td>
                                        <td class="txt_left">KRD0101220110</td>
                                        <td class="txt_left">원화예금</td>
                                        <td class="txt_right">985632675</td>
                                        <td class="txt_right">12358684520</td>
                                    </tr>
                                    <tr>
                                        <td>변경</td>
                                        <td class="txt_left">KRD0101220110</td>
                                        <td class="txt_left">원화예금</td>
                                        <td class="txt_right">985632675</td>
                                        <td class="txt_right">12358684520</td>
                                    </tr>
                                </tbody>
                            </table>
                        </v-card>
                        <v-card flat class="pdf_context">
                            <div
                                class="pdf_coment text-xs-center"
                            >* 추가로 변경하실 ETF 종목이 있다면 [추가 변경]을 선택하세요.</div>
                            <p class="text-xs-center">다른 ETF의 PDF를 변경하시겠습니까?</p>
                            <div class="pop_btn_w">
                                <p class="pdfmody_btn">
                                    <v-btn fab dark depressed color="primary" @click="all">
                                        <v-icon dark large>add</v-icon>
                                    </v-btn>네, 추가 변경 작업을 진행합니다.
                                    <v-expansion-panel v-model="panel" expand>
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
                                                            ></v-text-field>
                                                        </span>
                                                        <span>
                                                            <v-btn outline small color="primary">확인</v-btn>
                                                            <v-btn outline small color="#9e9e9e">취소</v-btn>
                                                        </span>
                                                    </div>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </p>
                                <p class="pdfmody_btn">
                                    <v-btn fab dark depressed color="primary" @click="step++">
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
                                <v-btn icon @click="dialog5 = false">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-card-title>
                        </h5>
                        <v-card flat>
                            <h4>
                                TIGER 코스닥 150
                                <span>002345</span>
                            </h4>
                            <table id class="tbl_type" style="width:100%">
                                <colgroup>
                                    <col width="15%">
                                    <col width="20%">
                                    <col width="25%">
                                    <col width="20%">
                                    <col width="20%">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th class="txt_left">CODE</th>
                                        <th class="txt_left">종목</th>
                                        <th class="txt_right">변경전</th>
                                        <th class="txt_right">변경후</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>변경</td>
                                        <td class="txt_left">KRD0101220110</td>
                                        <td class="txt_left">원화예금</td>
                                        <td class="txt_right">985632675</td>
                                        <td class="txt_right">12358684520</td>
                                    </tr>
                                    <tr>
                                        <td>변경</td>
                                        <td class="txt_left">KRD0101220110</td>
                                        <td class="txt_left">원화예금</td>
                                        <td class="txt_right">985632675</td>
                                        <td class="txt_right">12358684520</td>
                                    </tr>
                                    <tr>
                                        <td>변경</td>
                                        <td class="txt_left">KRD0101220110</td>
                                        <td class="txt_left">원화예금</td>
                                        <td class="txt_right">985632675</td>
                                        <td class="txt_right">12358684520</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h4>
                                TIGER 레버러지
                                <span>002345</span>
                            </h4>
                            <table id class="tbl_type" style="width:100%">
                                <colgroup>
                                    <col width="15%">
                                    <col width="20%">
                                    <col width="25%">
                                    <col width="20%">
                                    <col width="20%">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th class="txt_left">CODE</th>
                                        <th class="txt_left">종목</th>
                                        <th class="txt_right">변경전</th>
                                        <th class="txt_right">변경후</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>변경</td>
                                        <td class="txt_left">KRD0101220110</td>
                                        <td class="txt_left">원화예금</td>
                                        <td class="txt_right">985632675</td>
                                        <td class="txt_right">12358684520</td>
                                    </tr>
                                    <tr>
                                        <td>변경</td>
                                        <td class="txt_left">KRD0101220110</td>
                                        <td class="txt_left">원화예금</td>
                                        <td class="txt_right">985632675</td>
                                        <td class="txt_right">12358684520</td>
                                    </tr>
                                    <tr>
                                        <td>변경</td>
                                        <td class="txt_left">KRD0101220110</td>
                                        <td class="txt_left">원화예금</td>
                                        <td class="txt_right">985632675</td>
                                        <td class="txt_right">12358684520</td>
                                    </tr>
                                </tbody>
                            </table>
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
                                <v-btn dark depressed color="primary" @click="dialog5 = false">닫기</v-btn>
                            </p>
                        </v-card>
                    </v-card>
                    <v-card-actions></v-card-actions>
<!--step3 END-->
                </v-window-item>
            </v-window>

        </v-card>

    </v-dialog>

</template>



<script>
import $ from "jquery";
import _ from "lodash";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";

import Config from "@/js/config.js";

var tblEmergeny01 = null;

export default {
    props : [ "showDialog", "paramData" ],
    data() {
        return {
            dialog2: false,
            dialog5: false,
            drawer: true,
            search: "",
            step: 1,
            panel: [],
            tab2: "",
            items4: [],
            on: false,


            tblEmergeny01 : "tblEmergeny01",
            searchParam : {},
            etpBasic : {},
            dataList : [],
        };
    },
    created: function() {

        var vm = this;

        vm.$EventBus.$on('EtpOperControl_EtpOperPdfEmergencyModifyPop_call', data => {
            console.log( "EventBus EtpOperControl_EtpOperPdfEmergencyModifyPop_call>>>>>>>" );
            console.log( data );

        });

        vm.$EventBus.$on('EtpOperControl_EtpOperPdfEmergencyModifyPop_close', data => {
            vm.$EventBus.$off('EtpOperControl_EtpOperPdfEmergencyModifyPop_call');         
        });

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
                    "targets": [3, 4, 5, 6]
                },
                {  
                    /* CU shrs */
                    "render": function ( data, type, row ) {

                        var htm = "";
                        if( typeof row.f16316 != "undefined" && row.f16316.length > 0 ) {
                            if( row.f16316.indexOf( "<input" ) > -1 ) {
                                htm = data;
                            }else{
                                htm = "<input type='text' name='f16499' id='f16499' style='width:100%; text-align:right' value='" + data + "' maxlength='15'>";
                            }
                        }else{
                            html = data;
                        }

                        return htm;
                    },
                    "orderable" : false,
                    "targets": 7
                },
            ],
            columns: [
                { "data" : "status"         ,   "visible"   : false   },                                                    /* status */
                { "data" : "code_check"     ,   "visible"   : false   },                                                    /* code_check */
                { "data" : "f16499_prev"    ,   "visible"   : false   },                                                    /* CU shrs (변경전) */

                { "data" : "f12506"         ,   "orderable" : false  ,   "className" : "txt_center"  },                     /* Date */
                { "data" : "f33861"         ,   "orderable" : false  ,   "className" : "txt_center"  },                     /* 시장구분 */
                { "data" : "f16316"         ,   "orderable" : false  ,   "className" : "txt_left"    },                     /* 구성종목코드 */
                { "data" : "f16002"         ,   "orderable" : false  ,   "className" : "txt_left"    },                     /* 종목명 */
                { "data" : "f16499"         ,   "orderable" : false  ,   "className" : "txt_right"   },                     /* CU shrs */
                { "data" : "f34840"         ,   "orderable" : false  ,   "className" : "txt_right"   },                     /* 액면금액 */
                { "data" : "f16588"         ,   "orderable" : false  ,   "className" : "txt_right"   },                     /* 평가금액 */
                { "data" : "f34743"         ,   "orderable" : false  ,   "className" : "txt_right"   },                     /* 비중 */
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
        $("#" + vm.tblEmergeny01 + " tbody").on('change', "input[name='f16499']", function () {

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var data = table.row($(this).parents("tr")).data();
            var rowIndex = table.row($(this).parents("tr")).index();
            var jongmokTag = $(this).parents("tr").find( "input[name='jongmok']" );

            vm.fn_setStatus( data, $(this).eq(0).val(), rowIndex, ( jongmokTag ? jongmokTag.length : 0 ) );
        });        

        vm.fn_getEtpOperPdfModify();
    },
        
    methods: {

        // Create an array the length of our items
        // with all values as true
        all() {
            this.panel = [...Array(this.items).keys()].map(_ => true);
        },

        /*
         * ETP 지수관리 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOperPdfModify() {
            var vm = this;

            console.log("EtpOperPdf.vue -> fn_getEtpOperPdfEmergencyModifyPop.vue");

            if (tblEmergeny01) {
                tblEmergeny01.clear().draw();
            }

            vm.searchParam.f16012   =   vm.paramData.f16012;                   /* 국제표준코드 */
            vm.searchParam.f16012   =   "KR7322410002";

            axios.post( Config.base_url + "/user/etp/getEtpOperPdfModify", {
                data: vm.searchParam
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var etpBasic = response.data.etpBasic;
                    var dataList = response.data.dataList;

                    if( etpBasic && Object.keys( etpBasic ).length > 0 ) {
                        vm.etpBasic =   etpBasic;
                    }

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

            console.log("EtpOperPdf.vue -> fn_getEtpOperPdfEmergencyModifyPop.vue");

            if(     !codeVal
                ||  codeVal.length == 0
            ) {
                vm.$emit("showMessageBox", '확인','구성종목코드를 입력해 주세요.',{},1);

                return  false;
            }

            axios.post( Config.base_url + "/user/etp/getJongmokData", {
                data: { "f16012" : codeVal }
            }).then(function(response) {
                console.log(response);

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
                            "status"        :   "insert"
                        ,   "code_check"    :   true
                        ,   "f16499_prev"   :   0                           /* CU shrs ( 변경전 ) */

                        ,   "f12506"        :   dataList[0].f12506          /* Date */
                        ,   "f33861"        :   dataList[0].f33861          /* 시장구분 */
                        ,   "f16316"        :   dataList[0].f16012          /* 구성종목코드 */
                        ,   "f16002"        :   dataList[0].f16002          /* 종목명 */

                        ,   "f16499"        :   0                           /* CU shrs */
                        ,   "f34840"        :   0                           /* 액면금액 */
                        ,   "f16588"        :   0                           /* 평가금액 */
                        ,   "f34743"        :   0                           /* 비중 */
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
                    "status"        :   "insert"
                ,   "code_check"    :   false
                ,   "f16499_prev"   :   ''              /* CU shrs ( 변경전 ) */

                ,   'f12506'        :   ''              /* Date */
                ,   'f33861'        :   ''              /* 시장구분 */
                ,   'f16316'        :   "<input type='text' name='jongmok' id='jongmok' style='width:100%;' maxlength='15' >"        /* 구성종목코드 */
                ,   'f16002'        :   "<button  name='confirm'>확인</button>"                                                      /* 종목명 */
                ,   'f16499'        :   ''              /* CU shrs */
                ,   'f34840'        :   '0'             /* 액면금액 */
                ,   'f16588'        :   '0'             /* 평가금액 */
                ,   'f34743'        :   '0'             /* 비중 */
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
                if( !vm.fn_modifyCheck() ) {
                    return  false;
                }
                
                vm.step = 2;
            }
        },

        /*
         * CU shrs 변경시 상태값을 변경한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_setStatus( tableData, f16499, rowIndex, jongmokTagYn ) {
            var vm = this;

            var table = $("#" + vm.tblEmergeny01 ).DataTable();
            var tr = table.row( rowIndex );

            /* 종목코드 태그가 존재하지 않는 경우 */
            if( jongmokTagYn == 0 ) {

                if( tableData.status != "insert" ) {

                    /* 이전값과 현재값이 동일한 경우 상태값 원상태로 변경 */
                    if( tableData.f16499_prev == f16499 ) {
                        table.cell( tr, 0 ).data( { "status" : "normal" } );
                        vm.dataList[ rowIndex ].status  =   "normal";
                    }
                    else if( tableData.f16499_prev != f16499 ) {
                        table.cell( tr, 0 ).data( { "status" : "modify" } );
                        vm.dataList[ rowIndex ].status  =   "modify";
                    }
                }

                vm.dataList[ rowIndex ].f16499  =   f16499;
            }else{
                vm.dataList[ rowIndex ].code_check   =   false;
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

        /*
         * 팝업창을 종료한다.
         * 2019-05-03  bkLove(촤병국)
         */
        fn_closePop() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        }
    },
};
</script>
