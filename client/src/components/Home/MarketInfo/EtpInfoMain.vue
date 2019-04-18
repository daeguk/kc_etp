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
                <v-tab-item>
                    <EtpforList5></EtpforList5>
                </v-tab-item>
                <v-tab-item>
                    <EtpforList6></EtpforList6>
                </v-tab-item>
                <v-tab-item>
                    <EtpforList7></EtpforList7>
                </v-tab-item>
                <v-tab-item>
                    <EtpforList8></EtpforList8>
                </v-tab-item>
        </v-tabs-items>    
      </v-flex>
    </v-layout> 
</template>

<script>
<<<<<<< HEAD
import EtfKorList   from  './EtfKorList.vue'
import EtfForList   from  './EtfForList.vue'
import EtnKorList   from  './EtnKorList.vue'
import EtnForList   from  './EtnForList.vue'
import EtpforList5   from  './EtpforList5.vue'
import EtpforList6   from  './EtpforList6.vue'
import EtpforList7   from  './EtpforList7.vue'
import EtpforList8   from  './EtpforList8.vue'
=======
import etfkorlist   from  './EtfKorList.vue'
import etfforlist   from  './EtfForList.vue'
import etnkorlist   from  './EtnKorList.vue'
import etnforlist   from  './EtnForList.vue'
>>>>>>> b3ee123d897dbdf4faec2c1dbb1717b34c61c7c7

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
<<<<<<< HEAD
        EtfKorList     : EtfKorList,
        EtfForList     : EtfForList,
        EtnKorList     : EtnKorList,
        EtnForList     : EtnForList,
        marketinfotab5 : marketinfotab5,
        marketinfotab6 : marketinfotab6,
        marketinfotab7 : marketinfotab7,
        marketinfotab8 : marketinfotab8,
=======
        etfkorlist     : etfkorlist,
        etfforlist     : etfforlist,
        etnkorlist     : etnkorlist,
        etnforlist     : etnforlist,
>>>>>>> b3ee123d897dbdf4faec2c1dbb1717b34c61c7c7
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>