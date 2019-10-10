<template>
    <v-layout row wrap>
    <v-flex xs12>
      <v-tabs slot="extension"  v-model="activeTab"  align-with-title light>
      <v-tabs-slider color="#35e0e2"></v-tabs-slider>
        <v-tab v-for="tab of tabs" :key="tab.id" @click="fn_pageMove(tab.id)" >
          {{ tab.name }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item  >
            <IndexCode      v-if="activeTab==0" 
                        
                            @fn_showMessageBox="fn_showMessageBox"
                            @fn_showProgress="fn_showProgress">
            </IndexCode>
        </v-tab-item>
        <v-tab-item >
            <OperComCode    v-if="activeTab==1" 

                            @fn_showMessageBox="fn_showMessageBox"
                            @fn_showProgress="fn_showProgress">
            </OperComCode>
        </v-tab-item>        
      </v-tabs-items>
    </v-flex>


        <v-flex>
            <ProgressBar ref="progress2"></ProgressBar>
            <ConfirmDialog ref="confirm2"></ConfirmDialog>
        </v-flex>       

  </v-layout>
</template>

<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import select from "datatables.net-select";
import Config from "@/js/config.js";

import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";

import IndexCode from "@/components/Home/OperSupport/IndexCode.vue";
import OperComCode from "@/components/Home/OperSupport/OperComCode.vue";

export default {

  data() {
    return {
        activeTab: 0,
        tabs: [
            { id: 0, name: "지수구분코드"},
            { id: 1, name: "운영사코드"},
        ]
        };
    
    }, 

    components: {
            ProgressBar
        ,   ConfirmDialog

        ,   IndexCode
        ,   OperComCode
    }, 

    methods: {

        /*
         *  탭 클릭시 paramData 를 초기화 한다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_pageMove( tab_id ) {
            var vm = this;

            vm.activeTab            =   tab_id;
        },

        /*
         *  메시지 팝업창을 노출한다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_showMessageBox: function(title, msg, option, gubun) {
            this.$refs.confirm2.open( title,msg, option, gubun );
        },

        /*
         *  진행 progress 를 보여준다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_showProgress: function(visible) {

            if( this.$refs && this.$refs.progress2 ) {
                util.processing( this.$refs.progress2, visible );
            }
        },        
    }
} 
</script>