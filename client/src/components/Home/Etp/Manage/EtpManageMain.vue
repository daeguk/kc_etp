<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
                slot="extension"
                v-model="tab"
                align-with-title
                light
            >
            <v-tabs-slider color="#1e99e8"></v-tabs-slider>
    
            <v-tab v-for="item in items" :key="item">
                {{ item }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <Info></Info>
                </v-tab-item>
                <v-tab-item>
                    <Index></Index>
                </v-tab-item>
                <v-tab-item>
                    <Pdf></Pdf>
                </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
</template>

<script>
 import Info   from  './Info.vue'
 import Index   from  './Index.vue'
 import Pdf   from  './Pdf.vue'

export default {
        data() {
            return {
                 tab: null,
                 items: ['ETP 운용정보', '지수관리', 'PDF 관리'],
    	};
    },    
    components: {
         Info     : Info,
         Index     : Index,
         Pdf     : Pdf,
    }
    
}
</script>
