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
            <IndexCode></IndexCode>
        </v-tab-item>
        <v-tab-item >
            <OperComCode></OperComCode>
        </v-tab-item>        
      </v-tabs-items>
    </v-flex>

  </v-layout>
</template>

<script>

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
        IndexCode : IndexCode,
        OperComCode : OperComCode,
    }, 

      methods: {

        /*
         *  탭 클릭시 paramData 를 초기화 한다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_pageMove( tab_id ) {
            var vm = this;

            vm.activeTab            =   tab_id;
        }
      }
} 
</script>