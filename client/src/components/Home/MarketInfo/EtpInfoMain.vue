<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
                slot="extension"
                v-model="activeTab"
                align-with-title
                light
            >
            <v-tabs-slider color="#35e0e2"></v-tabs-slider>
    
                <v-tab v-for="tab of tabs"  :key="tab.id" @click="pageMove(tab.route)" >
                    {{ tab.name }}
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="activeTab">
                <v-tab-item v-for="tab of tabs"  :key="tab.id" >
                </v-tab-item>
            </v-tabs-items>
            <router-view></router-view>    
      </v-flex>
    </v-layout> 
</template>

<script>
export default {
        props: [],
        data() {
            return {
                activeTab: 0,
                tabs: [
                { id: 1, name: "전체", route: '/info/etpinfo/marktEtpSummaryInfo' },
                { id: 2, name: "시장대표", route: '/info/etpinfo/marketRepresent' },
                { id: 3, name: "섹터", route: '/info/etpinfo/marketSector' },
                { id: 4, name: "테마", route: '/info/etpinfo/marketEtnForList' },
                { id: 5, name: "전략", route: '/info/etpinfo/marketStrategy' },
                { id: 6, name: "채권", route: '/info/etpinfo/marketEtpforList6' },
                { id: 7, name: "해외", route: '/info/etpinfo/marketEtpforList7' },
                { id: 8, name: "혼합", route: '/info/etpinfo/marketEtpforList8' },
                { id: 9, name: "상품", route: '/info/etpinfo/marketEtpforList9' }
            ],
    	};
    },    
    mounted: function() {
        if (this.$route.query.activeTab == 2) {
            //this.activeTab = 1;
           // this.pageMove('/info/etpinfo/marketStrategy');
        } else {
            this.activeTab = 0;
            this.pageMove('/info/etpinfo/marktEtpSummaryInfo');
        }
    },
    created: function() {
        
    },
    beforeUpdated: function() {
    },
    updated: function() {
    },
    methods: {
        pageMove : function(route) {
            this.$router.push(route);
        }
    }

}
</script>

<style scoped>

</style>