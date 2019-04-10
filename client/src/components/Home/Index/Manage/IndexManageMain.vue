<template>
<div id="app">
    <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
            slot="extension"
            dark
            color="#3158a1"
            v-model="activeTab"
            align-with-title
            app
            fixed
            clipped-right
            >
            <v-tabs-slider color="#ff821d"></v-tabs-slider>
    
            <v-tab v-for="tab of tabs"  :key="tab.id" :to="tab.route"  v-on:click="setLeftControlBoxDraw(index)">
              {{ tab.name }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="activeTab">
                <v-tab-item v-for="tab of tabs"  :key="tab.id" :to="tab.route" >
                     <router-view />    
                </v-tab-item>
            </v-tabs-items>
      </v-flex>
    </v-layout> 
</div>
</template>

<script>
//import Summary   from  './Summary.vue';
//import IndexList   from  './IndexList.vue';
//import IndexDetail   from  './IndexDetail.vue';
//import indexDetailrtmenu from "./indexDetailrtmenu.vue";

export default {
    name: 'app',
    data() {
        return {
            activeTab: '/index/manage/indexSummary',
            tabs: [
                { id: 1, name: "Summary", route: '/index/manage/indexSummary' },
                { id: 2, name: "관리지수목록", route: '/index/manage/indexList' },
                { id: 3, name: "지수종목상세", route: '/index/manage/indexDetail' }
            ],
    	};
    },    
    components: {
        //Summary     : Summary,
        //IndexList     : IndexList,
        //IndexDetail     : IndexDetail,
        //indexDetailrtmenu   :indexDetailrtmenu,
    },
    mounted: function() {
        //this.$router.push("/index/manage/indexSummary");

        if (this.$route.query.tab !== undefined) {
            this.tab = this.$route.query.tab;
            setLeftControlBoxDraw(1);
        }
    },
    created: function() {
       
    },
    methods: {
        setLeftControlBoxDraw : function(draw) {
            if (draw != 2) {
                this.$EventBus.$emit("LeftControlBoxDraw", false); 
            } else {
                this.$EventBus.$emit("LeftControlBoxDraw", true); 
            }
        }
    }

}
</script>

<style scoped>

</style>