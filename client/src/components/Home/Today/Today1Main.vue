<template>
    <v-layout row wrap>
        <v-flex xs12>
           <v-tabs
                slot="extension"
                v-model="tab"
                align-with-title
                light
            >
            <v-tabs-slider color="#35e0e2"></v-tabs-slider>
    
            <v-tab v-for="item in items" :key="item">
                {{ item }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <indexmarkettab1></indexmarkettab1>
                </v-tab-item>
                <v-tab-item>
                    <indexmarkettab2></indexmarkettab2>
                </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
</template>

<script>

import indexmarkettab1   from  './indexmarkettab1.vue'
import indexmarkettab2   from  './indexmarkettab2.vue'

export default {
        data() {
            return {
                tab: null,
                drawer:"",
                search:"",
                items: ['TODAY', '지수사업자별'],
    	};
    },    
    components: {
        indexmarkettab1     : indexmarkettab1,
        indexmarkettab2     : indexmarkettab2,
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>