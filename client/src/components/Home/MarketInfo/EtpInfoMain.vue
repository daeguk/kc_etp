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
                inx : 1,
                tabs: [
/*                { id: 1, name: "전체", route: '/info/etpinfo/marktEtpSummaryInfo' }, */
                { id: 1, name: "시장대표", route: '/info/etpinfo/marketRepresent' },
                { id: 2, name: "섹터", route: '/info/etpinfo/marketSector' },
                { id: 3, name: "테마", route: '/info/etpinfo/marketThema' },
                { id: 4, name: "전략", route: '/info/etpinfo/marketStrategy' },
                { id: 5, name: "채권", route: '/info/etpinfo/marketBond' },
                { id: 6, name: "해외", route: '/info/etpinfo/marketOversea' },
                { id: 7, name: "혼합", route: '/info/etpinfo/marketMix' },
                { id: 8, name: "상품", route: '/info/etpinfo/marketItem' }
            ],
    	};
    },    
    mounted: function() {
        if (this.$route.query.activeTab == 2) {
            //this.activeTab = 1;
           // this.pageMove('/info/etpinfo/marketStrategy');
        } else {
            this.activeTab = 0;
            this.pageMove('/info/etpinfo/marketRepresent');
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