<template>
    <v-dialog v-model="dialog" persistent max-width="720">
        <template v-slot:activator="{ on }">
            <v-btn small flat icon class="simul_ticon" dark v-on="on">
                <v-icon class="pr-0">help_outline</v-icon>
            </v-btn>
        </template>
        <v-card flat>
            <h5>
                <v-card-title>
                    <h5>
                        PDF긴급반영 일괄제출(엑셀업로드) 기능 사용법 안내
                        <span class="pl-0"></span>
                    </h5>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
            </h5>
            <div class="incode_pop pb-3">
                <ul>
                    <li>해당 기능은 사용자가 업로드한 PDF내역(엑셀)으로 해당ETF의 내역을 일괄교체합니다.</li>
                    <li class="pt-3 text_red">
                        <b>※ 주의사항</b>
                        <br />일괄제출시 이전의 PDF내역은 모두 지워지고, 제출한 엑셀내용으로 교체되므로 사용시 유의바랍니다.
                    </li>
                </ul>

                <!--1table-->
                <div class="mt-3">
                    <h6>
                        제출 스펙 설명
                        <span class="sub_tabletitle">- 아래의 양식으로 PDF내역을 작성 합니다.</span>
                    </h6>
                    <v-btn
                        color="primary"
                        depressed
                        small
                        class="ml-0 mb-3"
                        @click="fn_getPdfSampleFileDown()"
                    >샘플 받기</v-btn>

                    <div class="table-box-wrap pb-0">
                        <div class="table-box">
                            <table class="tbl_type ver8 v2">
                                <caption>헤더 고정 테이블</caption>
                                <colgroup>
                                    <col width="19%" />
                                    <col width="19%" />
                                    <col width="16%" />
                                    <col width="19%" />
                                    <col width="27%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th style="width:19%" class="txt_left">ETF 종목코드</th>
                                        <th style="width:19%" class="txt_left">구성종목코드</th>
                                        <th style="width:16%" class="txt_right">CU당수량</th>
                                        <th style="width:19%" class="txt_right">액면금액</th>
                                        <th style="width:27%" class="txt_left">종목명</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="txt_left">KR7000000001</td>
                                        <td class="txt_left">KRD010010001</td>
                                        <td class="txt_right">99999999.99</td>
                                        <td class="txt_right">0</td>
                                        <td class="txt_left">원화예금</td>
                                    </tr>
                                    <tr>
                                        <td class="txt_left">KR7000000001</td>
                                        <td class="txt_left">KR7000020008</td>
                                        <td class="txt_right">99.99</td>
                                        <td class="txt_right">0</td>
                                        <td class="txt_left">동화약품</td>
                                    </tr>
                                    <tr>
                                        <td class="txt_left">KR7000000001</td>
                                        <td class="txt_left">KR7000040006</td>
                                        <td class="txt_right">-99.99</td>
                                        <td class="txt_right">0</td>
                                        <td class="txt_left">KR모터스</td>
                                    </tr>
                                    <tr>
                                        <td class="txt_left">KR7000000001</td>
                                        <td class="txt_left">KR4101P90001</td>
                                        <td class="txt_right">99.99</td>
                                        <td class="txt_right">0</td>
                                        <td class="txt_left">코스피200 F 201909</td>
                                    </tr>
                                    <tr>
                                        <td class="txt_left">KR7000000001</td>
                                        <td class="txt_left">KR103502G7C2</td>
                                        <td class="txt_right">0</td>
                                        <td class="txt_right">35593041000</td>
                                        <td class="txt_left">국고02375-2712(17-7)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <ul>
                    <li class="pt-3">
                        <b>1. 필수 입력사항:</b>
                        <br />(1) ETF 종목코드(12자리),
                        <br />(2) 구성종목코드(12자리),
                        <br />(3) CU수량 OR 액면금액
                        <br />* 단축코드는 사용불가합니다.
                        <br />* 종목명은 선택사항입니다.
                    </li>
                    <li class="pt-3">
                        <b>2. 원화예금(현금)</b>의 ISIN코드는
                        <b>'KRD010010001'</b>로 입력하세요
                    </li>
                    <li class="pt-3">
                        <b>3. 채권</b>종목의 경우
                        <b>'액면금액'</b> 컬럼에 값을 입력하세요
                        <br />- 이경우, 'CU당수량' 컬럼은 '0' 값입력 또는 공란으로 비워두세요
                    </li>
                    <li class="pt-3 pb-3">
                        <b>4.</b> 주식, 선물 등
                        <b>채권외</b>종목의 경우
                        <b>'CU당수량'</b> 컬럼에 값을 입력하세요.
                        <br />- 이경우, '액면금액' 컬럼은 '0' 값 입력 또는 공란으로 비워두세요
                        <br />* CU당수량값은
                        <b>소수점 둘째자리</b>까지 반영됩니다.
                    </li>
                </ul>
            </div>
lex>
        </v-card>
    </v-dialog>
</template>

<script>
import Config from "@/js/config.js";
import util   from "@/js/util.js";

export default {
    data() {
        return {
            dialog: false,
        };
    },
    mounted() {
    },
    methods: {
        /*
         * PDF 샘플을 다운로드 한다.
         * 2019-06-21  bkLove(촤병국)
         */
        fn_getPdfSampleFileDown() {
            var vm = this;

            vm.$root.progresst.open();
            axios.get( Config.base_url + "/user/etp/getPdfSampleFileDown", {
                responseType : "blob"
            }).then((response, status, xhr) => {
                const url = window.URL.createObjectURL(new Blob([response.data], {type: "application/vnd.ms-excel"}));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', 'pdf_sample.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild( link );
                vm.$root.progresst.close();
            }).catch( function(e) {
                vm.$root.progresst.close();
            });    
        }        
    }
};
</script>