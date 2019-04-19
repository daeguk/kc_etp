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
                    <MarketRepresent></MarketRepresent>
                </v-tab-item>
                <v-tab-item>
                    <MarketSector></MarketSector>
                </v-tab-item>
                <v-tab-item>
                    <EtnForList></EtnForList>
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
import EtfForList   from  './EtfForList.vue'
import MarketRepresent   from  './MarketRepresent.vue'
import MarketSector   from  './MarketSector.vue'
import EtnForList   from  './EtnForList.vue'
import EtpforList5   from  './EtpforList5.vue'
import EtpforList6   from  './EtpforList6.vue'
import EtpforList7   from  './EtpforList7.vue'
import EtpforList8   from  './EtpforList8.vue'

export default {
        data() {
            return {
                mini: false,
                right: null,
                tab: null,
                drawer:"",
                search:"",
                items: ['전체', '시장대표', '섹터', '전략', '채권', '해외', '혼합', '상품'],
    	};
    },    
    components: {
        EtfForList      :   EtfForList,
        MarketRepresent :   MarketRepresent,        
        MarketSector    :   MarketSector,
        EtnForList      :   EtnForList,
        EtpforList5     :   EtpforList5,
        EtpforList6     :   EtpforList6,
        EtpforList7     :   EtpforList7,
       EtpforList8      :   EtpforList8,
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>