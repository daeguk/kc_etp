<template>
    <v-data-table :headers="headers" :items="desserts" class="elevation-1">
        <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>
            <td class="text-xs-right">{{ props.item.fat }}</td>
            <td class="text-xs-right">{{ props.item.carbs }}</td>
            <td class="text-xs-right">{{ props.item.protein }}</td>
            <td class="text-xs-right">{{ props.item.iron }}</td>
        </template>
    </v-data-table>
</template>

<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'

import Config from '@/js/config.js';

export default {
    props: [],
    data() {
        return {
            headers: [
                {
                    text: "PDF",
                    align: "left",
                    sortable: false,
                    value: "name"
                },
                { text: "Calories", value: "calories" },
                { text: "Fat (g)", value: "fat" },
                { text: "Carbs (g)", value: "carbs" },
                { text: "Protein (g)", value: "protein" },
                { text: "Iron (%)", value: "iron" }
            ],
            desserts: [
                {
                    name: "Frozen Yogurt",
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: "1%"
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                    iron: "1%"
                },
                {
                    name: "Eclair",
                    calories: 262,
                    fat: 16.0,
                    carbs: 23,
                    protein: 6.0,
                    iron: "7%"
                },
                {
                    name: "Cupcake",
                    calories: 305,
                    fat: 3.7,
                    carbs: 67,
                    protein: 4.3,
                    iron: "8%"
                },
                {
                    name: "Gingerbread",
                    calories: 356,
                    fat: 16.0,
                    carbs: 49,
                    protein: 3.9,
                    iron: "16%"
                },
                {
                    name: "Jelly bean",
                    calories: 375,
                    fat: 0.0,
                    carbs: 94,
                    protein: 0.0,
                    iron: "0%"
                },
                {
                    name: "Lollipop",
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: "2%"
                },
                {
                    name: "Honeycomb",
                    calories: 408,
                    fat: 3.2,
                    carbs: 87,
                    protein: 6.5,
                    iron: "45%"
                },
                {
                    name: "Donut",
                    calories: 452,
                    fat: 25.0,
                    carbs: 51,
                    protein: 4.9,
                    iron: "22%"
                },
                {
                    name: "KitKat",
                    calories: 518,
                    fat: 26.0,
                    carbs: 65,
                    protein: 7,
                    iron: "6%"
                }
            ],

            dataList    :   [],
        };
    },
    components: {},
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {},
    methods: {

        /*
         * ETP PDF 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */        
        fn_getEtpOperPdf( ) {

            var vm = this;

            console.log( "EtpOperPdf.vue -> fn_getEtpOperPdf" );

            axios.post(Config.base_url + "/user/etp/getEtpOperPdf", {
                data: {}
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    vm.dataList = response.data.dataList;
                    
                }
            });
        },        
    }
};
</script>
<style scoped>
</style>
