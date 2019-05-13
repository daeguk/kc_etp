<template>

    <v-dialog v-model="showDialog" persistent max-width="900">
        
        <v-card class="mx-auto">

            <v-window v-model="step">

                <v-spacer></v-spacer>
                <v-btn icon @click="fn_closePop">
                    <v-icon>close</v-icon>
                </v-btn>

                <v-window-item :value="1">
                    <!---step1-->
                    <v-card flat class="listset_pop">
                        <h5>
                            <v-card-title ma-0>
                                TIGER 코스닥 150
                                <span>229200</span>
                            </v-card-title>
                        </h5>
                        <v-card flat class="pdf_mody_w">
                            <v-toolbar card prominent>
                                <v-toolbar-title class="pdf_t">
                                    <v-icon class="text_red">feedback</v-icon>PDF 수정 모드입니다.
                                </v-toolbar-title>
                                <v-spacer></v-spacer>

                                <v-dialog v-model="dialog2" persistent max-width="500">
                                    <template v-slot:activator="{ on }">
                                        <v-btn outline small color="primary" dark v-on="on">
                                            <v-icon small color="primary">add</v-icon>자산추가
                                        </v-btn>
                                    </template>
                                    <!---개발 중복 자산추가 팝업----->
                                    <v-card>
                                        <h5>
                                            <v-card-title ma-0>
                                                비교자산추가
                                                <v-spacer></v-spacer>
                                                <v-btn icon dark @click="dialog2 = false">
                                                    <v-icon>close</v-icon>
                                                </v-btn>
                                            </v-card-title>
                                        </h5>
                                        <v-card-title>
                                            <v-text-field
                                                v-model="search"
                                                append-icon="search"
                                                label="Search"
                                                single-line
                                                hide-details
                                            ></v-text-field>
                                        </v-card-title>
                                        <!--비교자산 탭--->
                                        <v-layout row wrap>
                                            <v-flex xs12>
                                                <v-tabs fixed-tabs color="cyan" dark v-model="tab2">
                                                    <v-tabs-slider color="#00fffc"></v-tabs-slider>
                                                    <v-tab
                                                        v-for="item in items4"
                                                        :key="item"
                                                    >{{ item }}</v-tab>
                                                </v-tabs>
                                                <!--v-tabs-items v-model="tab2">
                                                <v-tab-item>
                                                    <infopoptab1></infopoptab1>
                                                </v-tab-item>
                                                    <v-tab-item>
                                                <infopoptab2></infopoptab2>
                                                    </v-tab-item>
                                                <v-tab-item>
                                                    <infopoptab3></infopoptab3>
                                                </v-tab-item>
                                                </v-tabs-items-->
                                            </v-flex>
                                        </v-layout>
                                        <!--비교자산 탭end--->
                                    </v-card>
                                    <v-card class="pop_btn_w text-xs-center">
                                        <v-btn
                                            depressed
                                            color="primary"
                                            @click="dialog = false"
                                        >추가하기</v-btn>
                                    </v-card>
                                </v-dialog>

                                <!---개발 중복 자산추가 팝업 end----->
                            </v-toolbar>
                        </v-card>
                        <v-card flat>
                            <table id class="tbl_type" style="width:100%">
                                <colgroup>
                                    <col width="6%">
                                    <col width="9%">
                                    <col width="15%">
                                    <col width="15%">
                                    <col width="15%">
                                    <col width="15%">
                                    <col width="15%">
                                    <col width="10%">
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
                    <!---step1 end-->
                </v-window-item>


                <v-window-item :value="2">
                    <!---step2-->
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
                    <!--step2 end-->
                </v-window-item>


                <v-window-item :value="3">
                    <!---step3-->
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
                    <!--step3 end-->
                </v-window-item>
            </v-window>

        </v-card>

    </v-dialog>

</template>



<script>
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
            on: false
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
    methods: {
        // Create an array the length of our items
        // with all values as true
        all() {
            this.panel = [...Array(this.items).keys()].map(_ => true);
        },

        fn_closePop() {
            var vm = this;

            vm.$emit( "fn_closePop", "close" );
        }
    }
};
</script>
