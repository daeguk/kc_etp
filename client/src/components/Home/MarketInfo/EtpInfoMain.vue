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
                    <etfkorlist></etfkorlist>
                </v-tab-item>
                <v-tab-item>
                    <etfforlist></etfforlist>
                </v-tab-item>
                <v-tab-item>
                    <etnkorlist></etnkorlist>
                </v-tab-item>
                <v-tab-item>
                    <etnforlist></etnforlist>
                </v-tab-item>
        </v-tabs-items>    
      </v-flex>
    </v-layout> 
</template>

<script>
import etfkorlist   from  './EtfKorList.vue'
import etfforlist   from  './EtfForList.vue'
import etnkorlist   from  './EtnKorList.vue'
import etnforlist   from  './EtnForList.vue'

export default {
        data() {
            return {
                mini: false,
                right: null,
                tab: null,
                items: ['전체', '시장대표', '섹터', '전략', '채권', '해외', '혼합', '상품'],
    	};
    },    
    components: {
        etfkorlist     : etfkorlist,
        etfforlist     : etfforlist,
        etnkorlist     : etnkorlist,
        etnforlist     : etnforlist,
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>