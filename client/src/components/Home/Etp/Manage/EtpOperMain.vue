<template>
    <v-layout row wrap>
        <v-flex xs12>

            <v-tabs slot="extension" v-model="tab" align-with-title light>
                <v-tabs-slider color="#1e99e8"></v-tabs-slider>

                <v-tab v-for="tab of tabs"  :key="tab.id" @click="pageMove(tab.id)" >
                    {{ tab.name }}
                </v-tab>                
            </v-tabs>


            <v-tabs-items v-model="activeTab">
                <v-tab-item v-for="tab of tabs"  :key="tab.id" >
                </v-tab-item>
            </v-tabs-items>
            <!--router-view></router-view-->

            <EtpOperControl :activeTab="activeTab"></EtpOperControl>

        </v-flex>
    </v-layout>
</template>

<script>

import EtpOperControl from  '@/components/Home/Etp/Manage/EtpOperControl.vue'

export default {
    data() {
        return {
            tab: null,

            activeTab: 0,
            tabs: [
                { id: 0, name: "ETP 운용정보"       , route: '/etp/manage/etpOperInfo' },               /* ETP 운용정보 */
                { id: 1, name: "지수관리"           , route: '/etp/manage/etpOperIndex' },              /* 지수관리 */
                { id: 2, name: "PDF 관리"           , route: '/etp/manage/etpOperPdf' },                /* PDF 관리 */
            ],
        };
    },
    components: {
        EtpOperControl  :   EtpOperControl
    },
    mounted: function() {
        this.activeTab = 0;
        this.pageMove(0);
    },
    methods: {
        pageMove : function(tab_id) {
            this.$EventBus.$emit("showList", {tab_id:tab_id});
            //this.activeTab = id + 1;
            //this.$router.push({path:'/info/etpinfo/EtpMarketInfo', props:{activeTab:this.activeTab}});
        }
    }
};
</script>
