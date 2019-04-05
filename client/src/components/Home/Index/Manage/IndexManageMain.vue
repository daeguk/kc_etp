<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
            slot="extension"
            dark
            color="#3158a1"
            v-model="tab"
            align-with-title
            app
            fixed
            clipped-right
            >
            <v-tabs-slider color="#ff821d"></v-tabs-slider>
    
            <v-tab v-for="item in items" :key="item">
                {{ item }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <Summary></Summary>
                </v-tab-item>
                <v-tab-item>
                    <IndexList></IndexList>
                </v-tab-item>
                <v-tab-item>
                    <IndexDetail></IndexDetail>
                </v-tab-item>               
        </v-tabs-items>    
      </v-flex>
    </v-layout> 
</template>

<script>
import Summary   from  './Summary.vue'
import IndexList   from  './IndexList.vue'
import IndexDetail   from  './IndexDetail.vue'
import indexDetailrtmenu from "./indexDetailrtmenu.vue";

export default {
        data() {
            return {
                tab: null,
                items: ['Summary', '관리지수목록', '지수종목상세'],
                
    	};
    },    
    components: {
        Summary     : Summary,
        IndexList     : IndexList,
        IndexDetail     : IndexDetail,
        indexDetailrtmenu   :indexDetailrtmenu,
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>