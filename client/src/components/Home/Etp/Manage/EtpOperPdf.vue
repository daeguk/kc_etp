<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            <v-text-field
                                v-model="search"
                                label="TIGER 코스닥 150 레버러지 (229200)"
                                class="pdf_search"
                                append-icon="search"
                                single-line
                                hide-details
                            ></v-text-field>
                            <p class="pdf_calendar">
                                <v-menu
                                    ref="menu2"
                                    v-model="menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="date2"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="date2"
                                            label="Picker in menu"
                                            append-icon="event"
                                            box
                                            outline
                                            v-on="on"
                                            widh="100%"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date2" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat @click="menu = false">Cancel</v-btn>
                                        <v-btn
                                            flat
                                            color="primary"
                                            @click="$refs.menu2.save(date2)"
                                        >OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="10%">
                                <col width="10%">
                                <col width="15%">
                                <col width="15%">
                                <col width="10%">
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
                                <tr>
                                    <td>20181112</td>
                                    <td class="txt_right">2</td>
                                    <td class="txt_left">KRD010010001</td>
                                    <td class="txt_left">원화현금</td>
                                    <td class="txt_right">767855459</td>
                                    <td class="txt_right">0</td>
                                    <td class="txt_right">548521321300</td>
                                    <td class="txt_right">85.65</td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card>
                    


                    <!-- [PDF 관리] Quick 메뉴 정보 -->
                    <EtpOperPdfQuick    :paramData = "paramData"

                                        @showDetail="showDetail" 
                                        @showMessageBox="showMessageBox">
                    </EtpOperPdfQuick>                    
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";
import EtpOperPdfQuick     from    "@/components/Home/Etp/Manage/EtpOperPdfQuick.vue";

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            text: "전종목",
            checkbox: true,
            date2: new Date().toISOString().substr(0, 10),
            menu2: false,
            text2: "",
            dialog: false,
            dialog2: false,
            dialog5: false,
            dialog6: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            items1: ["전체", "시장대표"],
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
            desserts: [],
            items4: [],
            switch1: "",

            paramData : {},
        };
    },
    components: {
        EtpOperPdfQuick :   EtpOperPdfQuick
    },
    mounted: function() {},
    created: function() {},
    beforeDestory: function() {},

    methods : {

        showDetail: function(gubun, paramData) {      
            var vm = this;

            vm.$emit( "showDetail", gubun, paramData );
        },

        showMessageBox: function(title, msg, option, gubun) {
            var vm = this;

            vm.$emit( "showMessageBox", title, msg, option, gubun );
        },        
    }
};
</script>

