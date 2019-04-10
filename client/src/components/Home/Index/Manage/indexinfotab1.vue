<template>
    <v-container fluid grid-list-md pa-0 mb-4>
        <v-layout row wrap>
            <v-flex md6>
                <!--table1-->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Index Info</h4>
                    <v-data-table
                        :headers="headers"
                        :items="indexInfo"
                        disable-initial-sort
                        hide-actions
                        hide-headers
                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="text-xs-right">{{ props.item.calories }}</td>
                        </template>
                    </v-data-table>
                </div>
                <!--table1 end--->
            </v-flex>
            <v-flex md6>
                <!---table2--->
                <v-container fluid grid-list-md pa-0 mb-4>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <!---table2_1--->
                            <div class="indexinfo_box02 a1">
                                <h4 class="mb-0">ETP Info</h4>
                                <v-data-table
                                    :headers="headers2"
                                    :items="desserts2"
                                    disable-initial-sort
                                    hide-actions
                                >
                                    <template slot="items" slot-scope="props">
                                        <td class="text-xs-left">{{ props.item.name }}</td>
                                        <td class="text-xs-right">{{ props.item.calories }}</td>
                                    </template>
                                </v-data-table>
                            </div>
                        </v-flex>
                        <v-flex xs12>
                            <!---table2_2--->
                            <div class="indexinfo_box02 a2">
                                <v-data-table
                                    :headers="headers3"
                                    :items="desserts3"
                                    disable-initial-sort
                                    hide-actions
                                >
                                    <template slot="items" slot-scope="props">
                                        <td class="text-xs-left">{{ props.item.name }}</td>
                                        <td class="text-xs-right">{{ props.item.calories }}</td>
                                    </template>
                                </v-data-table>
                            </div>
                        </v-flex>
                        <v-flex xs12>
                             <!---table2_3--->
                            <div class="indexinfo_box02 a3">
                                <v-data-table
                                    :headers="headers4"
                                    :items="desserts4"
                                    disable-initial-sort
                                    hide-actions
                                >
                                    <template slot="items" slot-scope="props">
                                        <td class="text-xs-left">{{ props.item.name }}</td>
                                        <td class="text-xs-right">{{ props.item.calories }}</td>
                                    </template>
                                </v-data-table>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
                <!---table2 end--->
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>

export default {
    props: ["index_item"],
    data() {
        return {
            results: [],
            rowsPerPageItems: [50, 50],
            headers: [
                { text: "ID", align: "center", sortable: false, value: "id" },
                {
                    text: "지수명",
                    align: "center",
                    sortable: false, 
                    value: "inst_name"
                }
            ],
            indexInfo: [
                {
                    name: "기준지수",
                    calories: this.index_item.STD_INDEX
                },
                {
                    name: "기준일",
                    calories: this.index_item.STD_DATE
                },
                {
                    name: "발표일",
                    calories: this.index_item.ANNO_DATE
                },
                {
                    name: "지수산출방식",
                    calories: this.index_item.INDEX_CAL_METHOD
                },
                {
                    name: "기준시가총액",
                    calories: this.index_item.STD_CAPITAL
                },
                {
                    name: "비교시가총액",
                    calories: this.index_item.STD_CAPITAL
                },
                {
                    name: "고정현금",
                    calories: this.index_item.FIXED_CASH
                },
                {
                    name: "유동비율적용여부",
                    calories: this.index_item.FLOWRATE_YN
                }
            ],
            headers2: [
                {
                    text: "● KODEX DB 500 ETF(05320)",
                    align: "left",
                    sortable: false,
                    value: "id"
                },
                {
                    text: "",
                    align: "center",
                    sortable: false,
                    value: "inst_name"
                }
            ],
            desserts2: [
                {
                    name: "Frozen Yogurt",
                    calories: 159
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237
                },
                {
                    name: "Eclair",
                    calories: 262
                },
                {
                    name: "Cupcake",
                    calories: 305
                },
                {
                    name: "Gingerbread",
                    calories: 356
                },
                {
                    name: "Jelly bean",
                    calories: 375
                }
            ],
            headers3: [
                {
                    text: "● KODEX DB 500 ETF(05320)",
                    align: "left",
                    sortable: false,
                    value: "id"
                },
                {
                    text: "",
                    align: "center",
                    sortable: false,
                    value: "inst_name"
                }
            ],
            desserts3: [
                {
                    name: "Frozen Yogurt",
                    calories: 159
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237
                },
                {
                    name: "Eclair",
                    calories: 262
                },
                {
                    name: "Cupcake",
                    calories: 305
                },
                {
                    name: "Gingerbread",
                    calories: 356
                },
                {
                    name: "Jelly bean",
                    calories: 375
                }
            ],
            headers4: [
                {
                    text: "● KODEX DB 500 ETF(05320)",
                    align: "left",
                    sortable: false,
                    value: "id"
                },
                {
                    text: "",
                    align: "center",
                    sortable: false,
                    value: "inst_name"
                }
            ],
            desserts4: [
                {
                    name: "Frozen Yogurt",
                    calories: 159
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237
                },
                {
                    name: "Eclair",
                    calories: 262
                },
                {
                    name: "Cupcake",
                    calories: 305
                },
                {
                    name: "Gingerbread",
                    calories: 356
                },
                {
                    name: "Jelly bean",
                    calories: 375
                }
            ],
            modalFlag: false
        };
    }
};
</script>