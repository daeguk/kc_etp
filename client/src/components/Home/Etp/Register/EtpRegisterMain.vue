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
                    <EtpApplyList></EtpApplyList>
                </v-tab-item>
                <v-tab-item>
                    <EtpResiter></EtpResiter>
                </v-tab-item>
        </v-tabs-items>    
      </v-flex>
    </v-layout> 
</template>

<script>
import EtpApplyList   from  './EtpApplyList.vue'
import EtpResiter   from  './EtpRegister.vue'

export default {
        data() {
            return {
                tab: null,
                items: ['신청현황', '신규등록'],
    	};
    },    
    components: {
        EtpApplyList     : EtpApplyList,
        EtpResiter     : EtpResiter,
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>