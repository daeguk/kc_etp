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
                <SimulationList     v-if="activeTab==0" 

                                    @fn_showSimulationModify="fn_showSimulationModify"
                                    @fn_showProgress="fn_showProgress">
                </SimulationList>
            </v-tab-item>

            <v-tab-item>
                <!-- 시뮬레이션 수정화면 -->
                <Simulation         v-if="activeTab==1"

                                    :paramData  =   "paramData"

                                    @fn_showProgress="fn_showProgress">
                </Simulation>
            </v-tab-item>

            <v-tab-item>
                <!-- 시뮬레이션 결과화면 -->
                <SimulationResult   v-if="showSimulationParam == 2"

                                    :paramData  =   "paramData"

                                    @fn_showProgress="fn_showProgress">
                </SimulationResult>
            </v-tab-item>

        </v-tabs-items>


        <v-flex>
            <ProgressBar ref="progress2"></ProgressBar>
            <ConfirmDialog ref="confirm2"></ConfirmDialog>
        </v-flex>   
        
    </v-container>
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

import Simulation from "@/components/Home/Simulation/Simulation.vue";
import SimulationList from "@/components/Home/Simulation/SimulationList.vue";
import SimulationResult from "@/components/Home/Simulation/SimulationResult.vue";


var table01 = null;


export default {

    data() {
        return {
                activeTab: 0
            ,   tabs: [
                    { id: 0, name: "관리목록"       },
                    { id: 1, name: "Simulation"     },
                ]

            ,   paramData           :   {}      /* 파리미터 정보 */
            ,   showSimulationParam :   ""      /* 시뮬레이션 param 정보 */
        };
    },
    components: {
            ProgressBar
        ,   ConfirmDialog

        ,   Simulation
        ,   SimulationList
        ,   SimulationResult
    },
    
    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;
     
    },

    methods: {

        /*
         *  탭 클릭시 paramData 를 초기화 한다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_pageMove( tab_id ) {
            var vm = this;

            vm.paramData    =   {};
            vm.activeTab    =   tab_id;
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
            util.processing( this.$refs.progress2, visible );
        },         

        /*
         *  목록에서 선택된 인자값을 받아 수정화면을 보여준다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_showSimulationModify: function( v_jsonParam ) {
            var vm = this;

            vm.paramData    =   v_jsonParam;
            vm.activeTab    =   1;
        },

        /*
         *  param 과 일치하는 정보를 보여준다.
         *  2019-08-12  bkLove(촤병국)
         */
        fn_showSimulation   :   function( v_param={ showSimulationParam : "1",  grp_cd  : "",  scen_cd : "" } ) {
            var vm = this;

            if( !v_param.grp_cd || !v_param.scen_cd ) {

                return  false;
            }

            vm.paramData            =   v_param;
            vm.showSimulationParam  =   v_param.showSimulationParam;
        }
    }    
};
</script>