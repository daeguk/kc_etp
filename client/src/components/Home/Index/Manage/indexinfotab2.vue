<template>
    <v-container fluid grid-list-md pa-0 mb-4>
        <v-layout row wrap>
            <v-flex xs12 flat>
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Performance</h4>
                    <div class="graph_02_w" style="height:100px;">그래프 들어갑니다</div>
                    <v-card flat>
                        <v-data-table
                            :headers="headers"
                            :items="desserts"
                            class="table_line2 indexinfo_table01"
                            hide-actions="pagination"
                        >
                            <template v-slot:items="props">
                                <td class="text-xs-right">
                                    <img src="/assets/img/icon_bar01.png">
                                    <!--img src="/assets/img/icon_bar02.png"-->
                                    <!--img src="/assets/img/icon_bar03.png"-->
                                </td>
                                <td class="text-xs-left">{{ props.item.name }}</td>
                                <td class="text-xs-center">{{ props.item.Week1 }}</td>
                                <td class="text-xs-center">{{ props.item.Month1 }}</td>
                                <td class="text-xs-center">{{ props.item.Month3 }}</td>
                                <td class="text-xs-center">{{ props.item.YTD }}</td>
                                <td class="text-xs-center">{{ props.item.Year1 }}</td>
                                <td class="text-xs-center">{{ props.item.Year3 }}</td>
                                <td class="text-xs-center">{{ props.item.Year5 }}</td>
                                <td class="text-xs-center">{{ props.item.Year10 }}</td>
                            </template>
                        </v-data-table>
                    </v-card>
                    <!---자산추가 팝업--->
                    <v-layout row>
                        <v-flex xs12>
                            <v-card flat>
                                <v-dialog v-model="dialog" persistent max-width="500">
                                    <template v-slot:activator="{ on }">
                                        <v-btn outline small color="primary" dark v-on="on">
                                            <v-icon small color="primary">add</v-icon>자산추가
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <h5>
                                            <v-card-title ma-0>
                                                비교자산추가
                                                <v-spacer></v-spacer>
                                                <v-btn icon dark @click="dialog = false">
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
                                                <v-tabs
                                                    fixed-tabs
                                                    color="cyan"
                                                    dark
                                                    v-model="tab"
                                                >
                                                    <v-tabs-slider color="#00fffc"></v-tabs-slider>
                                                    <v-tab
                                                        v-for="item in items"
                                                        :key="item"
                                                    >{{ item }}</v-tab>
                                                </v-tabs>
                                                 <v-tabs-items v-model="tab">
                                                    <v-tab-item>
                                                        <infopoptab1></infopoptab1>
                                                    </v-tab-item>
                                                    <v-tab-item>
                                                        <infopoptab2></infopoptab2>
                                                    </v-tab-item>
                                                    <v-tab-item>
                                                        <infopoptab3></infopoptab3>
                                                    </v-tab-item>
                                                </v-tabs-items>
                                            </v-flex>
                                        </v-layout>
                                        <!--비교자산 탭end--->
                                        <v-card class="pop_btn_w text-xs-center">
                                            <v-btn
                                                depressed
                                                color="primary"
                                                @click="dialog = false"
                                            >추가하기</v-btn>
                                        </v-card>
                                    </v-card>
                                </v-dialog>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <!--자산추가 팝업 end--->
                </div>
            </v-flex>
            <v-flex xs12 flat>
                <!---비중정보 팝업--->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">포트폴리오</h4>
                    <v-subheader>
                        TOP10 비중정보
                        <v-dialog v-model="dialog2" persistent max-width="500">
                            <template v-slot:activator="{ on }">
                                <v-btn outline small color="primary" dark v-on="on">VIEW ALL</v-btn>
                            </template>
                            <v-card>
                                <h5>
                                    <v-card-title ma-0>
                                        종목 비중정보 (KODEX 200)
                                        <v-spacer></v-spacer>
                                        <v-btn icon dark @click="dialog2 = false">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>
                                <div class="index3pop2_con">
                                    <v-list subheader two-line>
                                        <v-list-tile>
                                            <v-list-tile-title>Last Updated</v-list-tile-title>
                                            <v-list-tile-content>Notifications</v-list-tile-content>
                                        </v-list-tile>
                                        <v-list-tile>
                                            <v-list-tile-title>Total</v-list-tile-title>
                                            <v-list-tile-content>500</v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </div>
                                <v-card flat>
                                    <v-data-table
                                        :headers="headers2"
                                        :items="desserts2"
                                        :search="search"
                                        hide-actions
                                        class="elevation-1 table_line4"
                                    >
                                        <template v-slot:items="props">
                                            <td>
                                                <v-checkbox
                                                    v-model="props.selected"
                                                    primary
                                                    hide-details
                                                ></v-checkbox>
                                            </td>
                                            <td>{{ props.item.name1 }}</td>
                                            <td class="text-xs-left">{{ props.item.종목지수명 }}</td>
                                            <td class="text-xs-right">{{ props.item.구분 }}</td>
                                        </template>
                                        <v-alert
                                            v-slot:no-results
                                            :value="true"
                                            color="error"
                                            icon="warning"
                                        >Your search for "{{ search }}" found no results.</v-alert>
                                    </v-data-table>
                                </v-card>
                                <v-card class="pop_bot_h"></v-card>
                            </v-card>
                        </v-dialog>
                    </v-subheader>
                    <div class="graph_02_w" style="height:100px;">파이차트 들어갑니다</div>
                    <v-card flat></v-card>
                </div>
                <!---비중정보 팝업end-->
            </v-flex>

            <v-flex xs12></v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import infopoptab1 from "./infopoptab1.vue";
import infopoptab2 from "./infopoptab2.vue";
import infopoptab3 from "./infopoptab3.vue";

export default {
    data() {
        return {
            tab: null,
            items: ["ETF", "ETN", "INDEX"],
            dialog: false,
            dialog2: false,
            results: [],
            search:"",
            headers: [
                {
                    text: "",
                    align: "right",
                    sortable: false,
                    value: "",
                    width: 10
                },
                {
                    text: "",
                    align: "left",
                    sortable: false,
                    value: "name"
                },
                { text: "1-Week", value: "Week1" },
                { text: "1-Month", value: "Month1" },
                { text: "3-Month", value: "Month3" },
                { text: "YTD", value: "YTD" },
                { text: "1-Year", value: "Year1" },
                { text: "3-Year", value: "Year3" },
                { text: "5-Year", value: "Year5" },
                { text: "10-Year", value: "Year10" }
            ],
            desserts: [
                {
                    icon: "v-icon",
                    name: "TIGER 미국달러 선물레버러지(Price)",
                    Week1: 159,
                    Month1: 6.0,
                    Month3: 24,
                    YTD: 4.0,
                    Year1: "1%",
                    Year3: 24,
                    Year5: 4.0,
                    Year10: "1%"
                },
                {
                    icon: "edit",
                    name: "TIGER 미국달러 선물레버러지(NAV)",
                    Week1: 159,
                    Month1: 6.0,
                    Month3: 24,
                    YTD: 4.0,
                    Year1: "1%",
                    Year3: 24,
                    Year5: 4.0,
                    Year10: "1%"
                },
                {
                    icon: "edit",
                    name: "F-USDKRW",
                    Week1: 159,
                    Month1: 6.0,
                    Month3: 24,
                    YTD: 4.0,
                    Year1: "1%",
                    Year3: 24,
                    Year5: 4.0,
                    Year10: "1%"
                }
            ],
            headers2: [
                {
                    text: "",
                    align: "left",
                    sortable: false,
                    value: "name"
                },
                {
                    text: "CODE",
                    align: "left",
                    value: "name1"
                },
                { text: "종목지수명", value: "종목지수명" },
                { text: "구분", value: "구분" }
            ],
            desserts2: [
                {
                    name1: "000000",
                    종목지수명: "Kodex일본TOPIX",
                    구분: 6.0
                },
                {
                    name1: "101280",
                    종목지수명: "Kodex일본TOPIX",
                    구분: 6.0
                },
                {
                    name1: "101280",
                    종목지수명: "Kodex일본TOPIX",
                    구분: 6.0
                },
                {
                    name1: "101280",
                    종목지수명: "Kodex일본TOPIX",
                    구분: 6.0
                },
                {
                    name1: "101280",
                    종목지수명: "Kodex일본TOPIX",
                    구분: 6.0
                },
                {
                    name1: "101280",
                    종목지수명: "Kodex일본TOPIX",
                    구분: 6.0
                }
            ],
            modalFlag: false
        };
    },
    components: {
        infopoptab1: infopoptab1,
        infopoptab2: infopoptab2,
        infopoptab3: infopoptab3
    }
}
</script>
