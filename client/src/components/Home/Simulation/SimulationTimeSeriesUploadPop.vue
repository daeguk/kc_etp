<template>
    <v-dialog v-model="dialog" persistent max-width="510">
        <template v-slot:activator="{ on }">
            <v-btn small flat icon class="simul_ticon mr-1" dark v-on="on">
                <v-icon>help_outline</v-icon>
            </v-btn>
        </template>
        <v-card flat>
            <h5>
                <v-card-title>
                    <h5>시계열데이터 업로드 방법</h5>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
            </h5>
            <div class="incode_pop">
                <ul>
                    <li>※ 종목 및 지수, 전략의 시계열 정보를 엑셀로 작성하여 올릴 수 있습니다.</li>
                    <li>※ 아래 양식에 따라 엑셀로 작성후 파일을 업로드해 주세요</li>
                </ul>

                <!--1table-->
                <div class="mt-3">
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
                                        <th style="width:40%">DATE</th>
                                        <th style="width:60% " class="txt_right">PRICE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>20150102</td>
                                        <td class="txt_right">100</td>
                                    </tr>
                                    <tr>
                                        <td>20150103</td>
                                        <td class="txt_right">100.12</td>
                                    </tr>
                                    <tr>
                                        <td>20150104</td>
                                        <td class="txt_right">100.23</td>
                                    </tr>
                                    <tr>
                                        <td>20150105</td>
                                        <td class="txt_right">100.42</td>
                                    </tr>
                                    <tr>
                                        <td>20150106</td>
                                        <td class="txt_right">100.23</td>
                                    </tr>
                                    <tr>
                                        <td>20150107</td>
                                        <td class="txt_right">100.99</td>
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
                                        <th style="width:20%">DATE</th>
                                        <td style="width:80%" class="txt_left">
                                            <span class="text_red">[필수입력]</span> 일자를 입력합니다(YYYMMDD).
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>PRICE</th>
                                        <td class="txt_left">
                                            <span class="text_red">[필수입력]</span> 가격을 입력합니다.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="pb-4">
                    <샘플 다운받기>
                    <v-btn
                        color="primary"
                        depressed
                        small
                        @click="fn_getTimeSeriesSampleFileDown()"
                    >양식 다운로드</v-btn>
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
         * 시계열 샘플파일을 다운로드 한다.
         * 2019-06-21  bkLove(촤병국)
         */
        fn_getTimeSeriesSampleFileDown() {
            var vm = this;

            util.processing(vm.$refs.progress, true);

            axios.get( Config.base_url + "/user/simulation/getTimeSeriesSampleFileDown", {
                responseType : "blob"
            }).then((response, status, xhr) => {
                const url = window.URL.createObjectURL(new Blob([response.data], {type: "application/vnd.ms-excel"}));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', 'timeseries_sample.xlsx');
                document.body.appendChild(link);
                link.click();

                document.body.removeChild( link );

                util.processing(vm.$refs.progress, false);

            }).catch( function(e) {
                util.processing(vm.$refs.progress, false);
            }); 
        }
    }
};
</script>