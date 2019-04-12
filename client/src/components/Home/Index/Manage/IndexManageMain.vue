<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
            slot="extension"
            light
            v-model="activeTab"
            align-with-title
            app
            fixed
            clipped-right
            >
            <v-tabs-slider color="#35e0e2"></v-tabs-slider>
    
            <v-tab v-for="tab of tabs"  :key="tab.id" @click="pageMove(tab.route)" >
              {{ tab.name }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="activeTab">
                <v-tab-item v-for="tab of tabs"  :key="tab.id" >
                      <router-view></router-view>
                </v-tab-item>
            </v-tabs-items>
           
      </v-flex>
    </v-layout> 
</template>

<script>

export default {
    data() {
        return {
            activeTab: 0,
            tabs: [
                { id: 1, name: "Summary", route: '/index/manage/indexSummary' },
                { id: 2, name: "관리지수목록", route: '/index/manage/indexList' },
                { id: 3, name: "지수종목상세", route: '/index/manage/indexDetail' }
            ],
    	};
    },    
    
    mounted: function() {
        if (this.$route.query.activeTab == 2) {
            this.pageMove('/index/manage/indexList');
        } else {
            this.pageMove('/index/manage/indexSummary');
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