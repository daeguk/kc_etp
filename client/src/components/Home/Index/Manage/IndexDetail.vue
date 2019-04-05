<template>
    <v-container>
        <v-layout row  wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            DBF Biotech Index |
                            <span class="grey--text">DBF134</span>
                            <p>
                                기준일 :2018.10.20
                            </p>
                            <!--오른쪽 메뉴 종목으로 찾기 검색 후 
                            <p class="text_result">
                                6 results
                            </p--->
                            <p class="sub_txt">Last Updated : 2019.3.20 09:40:20</p>
                        </h3>
                    </v-card-title>
                        <v-data-table
                            :headers="headers"
                            :items="desserts"
                            class="table_line1"
                            hide-actions="pagination"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.name }}</td>
                                <td class="text-xs-left">{{ props.item.calories }}</td>
                                <td class="text-xs-right">{{ props.item.fat }}</td>
                                <td class="text-xs-right">{{ props.item.carbs }}</td>
                                <td class="text-xs-right">{{ props.item.protein }}</td>
                                <td class="text-xs-right">{{ props.item.iron }}</td>
                                <td class="text-xs-right">{{ props.item.last }}</td>
                            </template>
                        </v-data-table>
                    <indexDetailcon></indexDetailcon>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import indexDetailcon from "./indexDetailcon.vue";

export default {
    components: {
        indexDetailcon: indexDetailcon
    },
    data() {
        return {
            headers: [
                {
                    text: "Code",
                    align: "left",
                    value: "name"
                },
                { text: "name", value: "calories" },
                { text: "Fat (g)", value: "fat", align:"right" },
                { text: "Carbs (g)", value: "carbs", align:"right" },
                { text: "Protein (g)", value: "protein", align:"right" },
                { text: "Iron (%)", value: "iron", align:"right" },
                { text: "Factor rto", value: "last", align:"right" },
            ],
            desserts: [
                {
                    name: "000100",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
               {
                    name: "000090",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
                {
                    name: "000108",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
                {
                    name: "002100",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
                {
                    name: "100100",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
                {
                    name: "000100",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
                {
                    name: "000100",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
                {
                    name: "000100",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
                {
                    name: "000100",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                },
                {
                    name: "000100",
                    calories: "유한양행",
                    fat: 190000,
                    carbs: 12209354,
                    protein: 0.65,
                    iron: "1",
                    last:0.5,
                }
            ]
        };
    }
};
</script>

