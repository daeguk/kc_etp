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
                    <today  @fn_receiveIndexData = "fn_receiveIndexData"></today>
                </v-tab-item>
              
            </v-tabs-items>
        </v-flex>

        <v-flex>
            <IndexDetailDialog  v-if="showDialog"  

                                :paramData="paramData" 
                                :showDialog="showDialog"  
                                
                                @fn_closePop = "fn_closeIndexDetailPop">
            </IndexDetailDialog>
        </v-flex>

    </v-layout>
</template>

<script>

import today   from  './today.vue';
import IndexDetailDialog from "../../Index/Manage/IndexDetailDialog.vue";

export default {

    data() {
        return {
            tab: null,
            drawer:"",
            search:"",
            items: ['TODAY'],

            paramData : {},
            showDialog : false,
    	};
    },    
    components: {
        today     : today,
        IndexDetailDialog : IndexDetailDialog
    },
    created: function() {
    },
    methods: {

        /*
         *  자식에서 인덱스 상세 팝업창을 띄우도록 요청을 받음 ( today.vue 에서 emit 받음 )
         *  2019-04-16  bkLove(촤병국)
         */
        fn_receiveIndexData : function( param ) {
            console.log( "IndexInfoMain.vue -> fn_receiveIndexData" );

            this.paramData = param;

            this.showDialog =   true;
        },

        /*
         *  상세팝업창을 종료한다.
         *  2019-04-16  bkLove(촤병국)
         */
        fn_closeIndexDetailPop : function( param ) {
            console.log( "IndexInfoMain.vue -> fn_closeIndexDetailPop" );

            this.showDialog =   false;
        }
    }

}
</script>

<style scoped>

</style>