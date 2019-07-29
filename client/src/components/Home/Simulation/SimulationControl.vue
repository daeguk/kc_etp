<template>
    <v-container>

        <v-tabs v-model="activeTab" align-with-title light>
            <v-tabs-slider></v-tabs-slider>

            <v-tab v-for="tab of tabs"  :key="tab.id"   @click="fn_pageMove(tab.id)">
                {{ tab.name }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
            <v-tab-item>
                <!-- 시뮬레이션 목록화면 -->
                <SimulationList v-if="activeTab==0" 
                                @fn_showSimulationModify="fn_showSimulationModify">
                </SimulationList>
            </v-tab-item>

            <v-tab-item>
                <!-- 시뮬레이션 수정화면 -->
                <Simulation v-if="activeTab==1"
                            :paramData  =   "paramData">
                </Simulation>
            </v-tab-item>

        </v-tabs-items>
    </v-container>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";

import Simulation from "@/components/Home/Simulation/Simulation.vue";
import SimulationList from "@/components/Home/Simulation/SimulationList.vue";

var table01 = null;


export default {

    data() {
        return {
            activeTab: 0,
            tabs: [
                { id: 0, name: "관리목록"       },
                { id: 1, name: "Simulation"     },
            ],

            paramData   :   {}
        };
    },
    components: {
            Simulation
        ,   SimulationList
    },
    
    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;
     
    },

    methods: {

        /*
         * 탭 클릭시 paramData 를 초기화 한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_pageMove( tab_id ) {
            var vm = this;

            vm.paramData    =   {};
            vm.activeTab    =   tab_id;
        },

        /*
         * 목록에서 선택된 인자값을 받아 수정화면을 보여준다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showSimulationModify: function( v_jsonParam ) {
            var vm = this;

            vm.paramData    =   v_jsonParam;
            vm.activeTab    =   1;
        },  
    }    
};
</script>