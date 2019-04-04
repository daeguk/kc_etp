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

                    <indexinfotab2box1pop1></indexinfotab2box1pop1>
                </div>
            </v-flex>
            <v-flex xs12 flat>
                <indexinfotab2box1pop2></indexinfotab2box1pop2>
            </v-flex>

            <v-flex xs12></v-flex>
        </v-layout>
    </v-container>
</template>



<script>
import indexinfotab2box1pop1 from "./indexinfotab2box1pop1.vue";
import indexinfotab2box1pop2 from "./indexinfotab2box1pop2.vue";

export default {
    props: [],
    data() {
        return {
            dialog: false,
            dialog2: false,
            results: [],
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
            modalFlag: false
        };
    },
    components: {
        indexinfotab2box1pop1: indexinfotab2box1pop1,
        indexinfotab2box1pop2: indexinfotab2box1pop2
    }
};
</script>

