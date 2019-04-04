<template>
    <div class="indexinfo_box01 ver1">
        <h4 class="mb-0">지수정보 신청 현황</h4>
        <v-data-table :headers="headers" :items="desserts" slot="extension" hide-actions>
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.calories }}</td>
                <td class="text-xs-center">
                    <v-btn depressed dark small color="#42a4e1">YES</v-btn>
                    <v-btn depressed dark small color="grey">NO</v-btn>
                </td>
            </template>
        </v-data-table>
    </div>
</template>


<script>
export default {
    props: [],
    data() {
        return {
            results: [],
            rowsPerPageItems: [50, 50],
            headers: [
                { text: "신청기관", align: "left", value: "name" },
                { text: "요청일자", align: "right", value: "calories" },
                { text: "요청처리", align: "center", sortable: false, value: "button" }
            ],
            desserts: [
                {
                    name: "삼성자산운용",
                    calories: "2018.08.15",
                    button: ""
                },
                {
                    name: "한국투자신탁",
                    calories: 4,
                    button: ""
                },
                {
                    name: "한국예탁결제원",
                    calories: 3,
                    button: ""
                }
            ],
            modalFlag: false
        };
    }
};
</script>