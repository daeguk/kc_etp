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
                                    <col width="12%">
                                    <col width="20%">
                                    <col width="12%">
                                    <col width="12%">
                                    <col width="12%">
                                    <col width="12%">
                                </colgroup>

                                <thead>
                                    <tr>
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
                        <v-btn :disabled="step === 2" color="primary" depressed @click="step++">Next</v-btn>
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
                    /* CU shrs */
                    "render": function ( data, type, row ) {
                        let htm = "<input type='text' name='f16499' id='f16499' style='width:100%; text-align:right'  value='" + data + "' maxlength='15'>";
                        return htm;
                    },
                    "targets": 4
                },                
            ],
            columns: [
                { "data" : "f12506"         ,   "orderable" : true  ,   "className" : "txt_center   text_blue"  },      /* Date */
                { "data" : "f33861"         ,   "orderable" : true  ,   "className" : "txt_center   text_blue"  },      /* 시장구분 */
                { "data" : "f16316"         ,   "orderable" : true  ,   "className" : "txt_left     text_blue"  },      /* 구성종목코드 */
                { "data" : "f16002"         ,   "orderable" : true  ,   "className" : "txt_left     text_blue"  },      /* 종목명 */
                { "data" : "f16499"         ,   "orderable" : true  ,   "className" : "txt_right"   },                  /* CU shrs */
                { "data" : "f34840"         ,   "orderable" : true  ,   "className" : "txt_right"   },                  /* 액면금액 */
                { "data" : "f16588"         ,   "orderable" : true  ,   "className" : "txt_right"   },                  /* 평가금액 */
                { "data" : "f34743"         ,   "orderable" : true  ,   "className" : "txt_right"   },                  /* 비중 */
            ]
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

        fn_getJongmokData( param ) {
            var vm = this;

            console.log("EtpOperPdf.vue -> fn_getEtpOperPdfEmergencyModifyPop.vue");

            if(     !param.val()
                ||  param.val().length == 0
            ) {
                vm.$emit("showMessageBox", '확인','구성종목코드를 입력해 주세요.',{},1);

                return  false;
            }

            axios.post( Config.base_url + "/user/etp/getJongmokData", {
                data: { "f16012" : param.val() }
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var dataList = response.data.dataList;

                    if ( !dataList || dataList.length == 0 ) {
                        vm.$emit("showMessageBox", '확인','구성종목코드(' + param.val() + ')가 존재하지 않습니다.',{},1);
                        return  false;
                    }

                    if ( dataList && dataList.length > 1 ) {
                        vm.$emit("showMessageBox", '확인','구성종목코드(' + param.val() + ')가 여러건 존재합니다.',{},1);
                        return  false;
                    }

                    var filterData = _.filter(vm.dataList, function(o) {

                        if ( o.f16316 == dataList[0].f16012 ) {
                            return true; 
                        }
                    });

                    if( filterData.length > 0 ) {
                        vm.$emit("showMessageBox", '확인','구성종목코드(' + param.val() + ')가 이미 존재합니다.',{},1);
                        return  false;
                    }

                // { "data" : "f12506"         ,   "orderable" : true  ,   "className" : "txt_center   text_blue"  },      /* Date */
                // { "data" : "f33861"         ,   "orderable" : true  ,   "className" : "txt_center   text_blue"  },      /* 시장구분 */
                // { "data" : "f16316"         ,   "orderable" : true  ,   "className" : "txt_left     text_blue"  },      /* 구성종목코드 */
                // { "data" : "f16002"         ,   "orderable" : true  ,   "className" : "txt_left     text_blue"  },      /* 종목명 */
                // { "data" : "f16499"         ,   "orderable" : true  ,   "className" : "txt_right"   },                  /* CU shrs */
                // { "data" : "f34840"         ,   "orderable" : true  ,   "className" : "txt_right"   },                  /* 액면금액 */
                // { "data" : "f16588"         ,   "orderable" : true  ,   "className" : "txt_right"   },                  /* 평가금액 */
                // { "data" : "f34743"         ,   "orderable" : true  ,   "className" : "txt_right"   },                  /* 비중 */

                //     var addData     =   {
                //             "f12506"    :   dataList[0].f12506
                //         ,   "f12506"    :   dataList[0].f12506
                //     }                    

                    vm.dataList.unshift( dataList[0] );

                    tblEmergeny01.clear().draw();
                    tblEmergeny01.rows.add( vm.dataList ).draw();                    
                }
            });
        },

        fn_addRow() {
            var vm = this;


            // <tr class="pdfmody_acttd">
            //     <td></td>
            //     <td></td>
            //     <td colspan="6" class="txt_left">
            //         <input
            //             type="text"
            //             class="txt_left width_fix"
            //             placeholder="12자리/6자리코드"
            //         >
            //         <button
            //             type="button"
            //             class="v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01"
            //             v-on="on"
            //         >확인</button>
            //     </td>
            // </tr>

            tblEmergeny01.row.add( {

                'f12506'    :   '',     /* Date */
                'f33861'    :   '',     /* 시장구분 */
                'f16316'    :   "<input type='text' name='jongmok' id='jongmok' style='width:100%' maxlength='15' >",       /* 구성종목코드 */
                'f16002'    :   "<button  id='confirm'>확인</button>",                                                      /* 종목명 */
                'f16499'    :   '',     /* CU shrs */
                'f34840'    :   '0',    /* 액면금액 */
                'f16588'    :   '0',    /* 평가금액 */
                'f34743'    :   '0',    /* 비중 */

             } ).draw( false );
           
            $("button[id='confirm']").on('click', function () {

                vm.fn_getJongmokData( $("input[id='jongmok']") );
/*              
                var test = vm.getInfoIndex( $("input[id='jongmok']" ).eq(0).val());
             
                vm.results.push({
                    ANNO_YN: "발표",
                    ETP_MARKET_ID: 168,
                    ETP_NM: null,
                    INDEX_CAL_METHOD: "시가총액방식",
                    INST_CNT: 1,
                    IP_DT: "2019-04-03",
                    JISU_CD: test.JISU_CD,
                    JISU_NM: "테스트",
                    LARGE_TYPE: "FNGUIDE",
                    MARKET_ID: "M168",
                    MIDDLE_TYPE: "FNGUIDE"
                });
*/

                //$("input[name='jongmok']").css("color", "red");
                
            });          
        },

        fn_closePop() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        }
    },
};
</script>
