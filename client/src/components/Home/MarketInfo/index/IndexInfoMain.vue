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
                    <today></today>
                </v-tab-item>
                <v-tab-item>
                    <indexBiz></indexBiz>
                </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
</template>

<script>

import today   from  './today.vue'
import indexBiz   from  './indexBiz.vue'

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
        today     : today,
        indexBiz     : indexBiz,
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>