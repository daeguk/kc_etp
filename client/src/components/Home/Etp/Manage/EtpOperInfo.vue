<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>

                <v-card flat>

                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            ETP 운용 정보
                            <p>
                                Total
                                <span class="text_result">120</span> results
                                <span class="toggle2">
                                    <v-btn-toggle v-model="text" class="toggle_01">
                                        <v-btn flat value="전종목" v-on:click.stop="">전종목</v-btn>
                                        <v-btn flat value="국내" v-on:click.stop="">국내</v-btn>
                                        <v-btn flat value="해외" v-on:click.stop="">해외</v-btn>
                                        <v-btn flat value="관심종목" v-on:click.stop="">관심종목</v-btn>
                                    </v-btn-toggle>
                                </span>
                            </p>
                            <!--오른쪽 메뉴 종목으로 찾기 검색 후 
                            <p class="text_result">
                                6 results
                            </p--->
                            <p class="sub_txt">기준일 : 2019.3.20</p>
                        </h3>
                    </v-card-title>


                    <v-card flat>
                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="15%">
                                <col width="10%">
                                <col width="15%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="txt_left">종목</th>
                                    <th class="txt_right">iNAV</th>
                                    <th class="txt_right">전일최종NAV</th>
                                    <th class="txt_right">추적오차율</th>
                                    <th class="txt_right">괴리율</th>
                                    <th class="txt_right">기초지수</th>
                                    <th class="txt_right">지수현재가</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="txt_left line2">
                                        <span>
                                            <b>KODEX 200</b>
                                            <br>000100
                                            <span>
                                                <div class="txt_new">new</div>
                                            </span>
                                        </span>
                                    </td>
                                    <td class="txt_right">
                                        277166.42
                                        <br>
                                        <span class="text_S text_blue">-0.14%</span>
                                    </td>
                                    <td class="txt_right">1.26</td>
                                    <td class="txt_right">-4.51</td>
                                    <td class="txt_right">3.52</td>
                                    <td class="txt_right">3.32</td>
                                    <td class="txt_right">
                                        220.22
                                        <br>
                                        <span class="text_S text_red">0.98%</span>
                                    </td>
                                    <td>
                                        <div class="tooltip">
                                            <router-link to="etpManageDetail">
                                                <button
                                                    type="button"
                                                    class="btn_icon v-icon material-icons"
                                                >equalizer</button>
                                            </router-link>
                                            <span class="tooltiptext" style="width:70px;">ETP정보</span>
                                        </div>
                                        <div class="tooltip">
                                            <button
                                                type="button"
                                                class="btn_icon v-icon material-icons"
                                            >picture_as_pdf</button>
                                            <span class="tooltiptext" style="width:70px;">PDF관리</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card>


                    <EtpOperInfoQuick></EtpOperInfoQuick>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import EtpOperInfoQuick     from    "@/components/Home/Etp/Manage/EtpOperInfoQuick.vue";
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
        EtpOperInfoQuick  :   EtpOperInfoQuick
    },
    data() {
        return {
            text: "전종목",
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
            desserts: []
        };
    },
    mounted: function() {},
    created: function() {},
    beforeDestory: function() {}
};
</script>

