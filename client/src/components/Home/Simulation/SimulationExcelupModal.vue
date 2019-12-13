<template>
    <v-dialog v-model="dialog" persistent max-width="650">
        <template v-slot:activator="{ on }">
            <v-btn small flat icon class="simul_ticon pl-3 mr-1" dark v-on="on">
                <v-icon>help_outline</v-icon>
            </v-btn>
        </template>
        <v-card flat>
            <h5>
                <v-card-title>
                    <h5>
                        포트폴리오 업로드 방법
                        <span class="pl-0"></span>
                    </h5>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
            </h5>
            <div class="incode_pop">
                <ul>
                    <li>※ 시뮬레이션 종목을 화면에서 선택할 필요없이 엑셀로 작성하여 올릴 수 있습니다.</li>
                    <li>※ 아래 두가지 양식 중 하나를 선택하시어, 엑셀로 작성후 파일을 업로드해 주세요</li>
                </ul>

                <!--1table-->
                <div class="mt-3">
                    <h6>
                        [1번양식] CODE+ALLOCATION
                        <span class="sub_tabletitle">
                            사용자가 설정한 리밸런싱일자에 동일한 포트폴리오의 비중을 세팅합니다.
                            <br />비중(ALLOCATION)을 입력하지 않을 경우 0%로 입력됩니다.
                        </span>
                    </h6>
                    <span class="t_head"><예시></span>
                    <div class="table-box-wrap pb-0">
                        <div class="table-box">
                            <table class="tbl_type ver8 v2">
                                <caption>헤더 고정 테이블</caption>
                                <colgroup>
                                    <col width="40%" />
                                    <col width="60%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th style="width:40%">CODE</th>
                                        <th style="width:60%">ALLOCATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>005930</td>
                                        <td>30</td>
                                    </tr>
                                    <tr>
                                        <td>005380</td>
                                        <td>40</td>
                                    </tr>
                                    <tr>
                                        <td>091990</td>
                                        <td>30</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!--2table-->
                <div class="mt-3">
                    <span><컬럼 설명></span>
                    <div class="table-box-wrap v3 pb-0">
                        <div class="table-box">
                            <table class="tbl_type ver11 v3">
                                <caption>헤더 고정 테이블</caption>
                                <colgroup>
                                    <col width="20%" />
                                    <col width="80%" />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th style="width:20%">CODE</th>
                                        <td style="width:80%" class="txt_left">
                                            <span class="text_red">[필수입력]</span> 종목의 6자리 단축코드 또는 12자리 ISIN을 입력합니다.
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>ALLOCATION</th>
                                        <td class="txt_left">
                                            <b>[선택사항]</b> 종목별 비중(단위: %)을 입력합니다.
                                            <br />
                                            <span
                                                class="po_txt_pad"
                                            ><예시>비중이 12.35 %일경우, '12.35'를 입력합니다.</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div>
                    <샘플 다운받기>
                    <v-btn
                        color="primary"
                        depressed
                        small
                        @click="fn_getSampleFileDown( { gubun : 'portfolio'} )"
                    >1번양식 다운로드</v-btn>
                </div>

                <!--3table-->
                <div class="mt-4">
                    <h6>
                        [2번양식] DATE+CODE+ALLOCATION
                        <span class="sub_tabletitle">
                            리벨런싱일자별 포트폴리오 비중을 설정합니다.
                            <br />비중(ALLOCATION)을 입력하지 않을 경우 0%로 입력됩니다.
                        </span>
                    </h6>
                    <span class="t_head"><예시></span>
                    <div class="table-box-wrap pb-0">
                        <div class="table-box">
                            <table class="tbl_type ver8 v2">
                                <caption>헤더 고정 테이블</caption>
                                <colgroup>
                                    <col width="33%" />
                                    <col width="33%" />
                                    <col width="33%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th style="width:33%">DATE</th>
                                        <th style="width:33%">CODE</th>
                                        <th style="width:33%">ALLOCATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>20150102</td>
                                        <td>005930</td>
                                        <td>30</td>
                                    </tr>
                                    <tr>
                                        <td>20150102</td>
                                        <td>005380</td>
                                        <td>40</td>
                                    </tr>
                                    <tr>
                                        <td>20150102</td>
                                        <td>091990</td>
                                        <td>30</td>
                                    </tr>
                                    <tr>
                                        <td>20160102</td>
                                        <td>005930</td>
                                        <td>20</td>
                                    </tr>
                                    <tr>
                                        <td>20160102</td>
                                        <td>005380</td>
                                        <td>50</td>
                                    </tr>
                                    <tr>
                                        <td>20160102</td>
                                        <td>091990</td>
                                        <td>30</td>
                                    </tr>
                                    <tr>
                                        <td>20170102</td>
                                        <td>000660</td>
                                        <td>20</td>
                                    </tr>
                                    <tr>
                                        <td>20170102</td>
                                        <td>035420</td>
                                        <td>50</td>
                                    </tr>
                                    <tr>
                                        <td>20170102</td>
                                        <td>005930</td>
                                        <td>30</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!--4table-->
                <div class="mt-3">
                    <span><컬럼 설명></span>
                    <div class="table-box-wrap v3 pb-0">
                        <div class="table-box">
                            <table class="tbl_type ver11 v3">
                                <caption>헤더 고정 테이블</caption>
                                <colgroup>
                                    <col width="20%" />
                                    <col width="80%" />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th style="width:20%">DATE</th>
                                        <td style="width:80%" class="txt_left">
                                            <span class="text_red">[필수입력]</span> 리밸런싱일자를 입력합니다(YYYMMDD).
                                            <br />
                                            <span class="text_red po_txt_pad">휴장일일경우 에러처리됩니다.</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style="width:20%">CODE</th>
                                        <td style="width:80%" class="txt_left">
                                            <span class="text_red">[필수입력]</span> 종목의 6자리 단축코드 또는 12자리 ISIN을 입력합니다.
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>ALLOCATION</th>
                                        <td class="txt_left">
                                            <b>[선택사항]</b> 종목별 비중(단위: %)을 입력합니다.
                                            <br />
                                            <span
                                                class="po_txt_pad"
                                            ><예시>비중이 12.35 %일경우, '12.35'를 입력합니다.</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="pb-3">
                    <샘플 다운받기>
                    <v-btn
                        color="primary"
                        depressed
                        small
                        @click="fn_getSampleFileDown( { gubun : 'rebalancing'} )"
                    >2번양식 다운로드</v-btn>
                </div>
            </div>

            <v-flex>
                <ProgressBar ref="progress"></ProgressBar>
            </v-flex>
        </v-card>
    </v-dialog>
</template>

<script>
import Config from "@/js/config.js";
import util   from "@/js/util.js";

import ProgressBar from "@/components/common/ProgressBar.vue";

export default {
    data() {
        return {
            dialog: false,
        };
    },

    components : {
        ProgressBar: ProgressBar,
    },

    mounted() {
    },

    methods: {    

        /*
         * 샘플파일을 다운로드 한다.
         * 2019-06-21  bkLove(촤병국)
         */
        fn_getSampleFileDown( p_param={ gubun : '' } ) {
            var vm = this;

            if( !p_param ) {
                p_param =   {};
            }

            if( typeof p_param.gubun == "undefined" || p_param.gubun == "" ) {
                p_param.gubun   =   "rebalancing";
            }

            if( p_param.gubun == "rebalancing" ) {
                p_param.url         =   "/user/simulation/getRebalancingSampleFileDown";
                p_param.file_name   =   "rebalancing_sample.xlsx";
            }else if( p_param.gubun == "portfolio" ) {
                p_param.url         =   "/user/simulation/getPortfolioSampleFileDown";
                p_param.file_name  =   "portfolio_sample.xlsx";
            }

            util.processing(vm.$refs.progress, true);

            axios.get( Config.base_url + p_param.url, {
                responseType : "blob"
            }).then((response, status, xhr) => {
                const url = window.URL.createObjectURL(new Blob([response.data], {type: "application/vnd.ms-excel"}));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', p_param.file_name);
                document.body.appendChild(link);
                link.click();

                document.body.removeChild( link );

                util.processing(vm.$refs.progress, false);

            }).catch( function(e) {
                util.processing(vm.$refs.progress, false);
            }); 
        },
    }
};
</script>