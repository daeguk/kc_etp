<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
                slot="extension"
                v-model="tab"
                align-with-title
                dark
                color=#333
            >
            <v-tabs-slider color="yellow"></v-tabs-slider>
    
            <v-tab v-for="item in items" :key="item">
                {{ item }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <EtfKorList></EtfKorList>
                </v-tab-item>
                <v-tab-item>
                    <EtfForList></EtfForList>
                </v-tab-item>
                <v-tab-item>
                    <EtnKorList></EtnKorList>
                </v-tab-item>
                <v-tab-item>
                    <EtnForList></EtnForList>
                </v-tab-item>
        </v-tabs-items>    
      </v-flex>
    </v-layout> 
</template>

<script>
import EtfKorList   from  './EtfKorList.vue'
import EtfForList   from  './EtfForList.vue'
import EtnKorList   from  './EtnKorList.vue'
import EtnForList   from  './EtnForList.vue'

export default {
        data() {
            return {
                tab: null,
                items: ['ETF 국내', 'ETF 해외', 'ETN 국내', 'ETN 해외'],
    	};
    },    
    components: {
        EtfKorList     : EtfKorList,
        EtfForList     : EtfForList,
        EtnKorList     : EtnKorList,
        EtnForList     : EtnForList,
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>