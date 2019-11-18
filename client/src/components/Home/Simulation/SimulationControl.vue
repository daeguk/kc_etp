<template>
    <v-container>

        <v-tabs v-model="activeTab" align-with-title light >
            <v-tabs-slider></v-tabs-slider>

            <v-tab v-for="tab of tabs"  :key="tab.id"   @click="fn_pageMove(tab.id)">
                {{ tab.name }}
            </v-tab>
        </v-tabs>


        <!-- 시뮬레이션 목록화면 -->
        <SimulationList         v-if="[ 0, 1 ].includes( showSimulationId ) && activeTab==0" 

                                @fn_showProgress="fn_showProgress"
                                @fn_showSimulation="fn_showSimulation">
        </SimulationList>

        <!-- 시뮬레이션 수정화면 -->
        <Simulation             v-if="[ 0, 1 ].includes( showSimulationId ) && activeTab==1"

                                :paramData  =   "paramData"

                                @fn_showProgress="fn_showProgress"
                                @fn_showWaitProgress="fn_showWaitProgress"
                                @fn_showSimulation="fn_showSimulation">
        </Simulation>

        <!-- 시뮬레이션 결과화면 -->
        <SimulationResult       v-if="showSimulationId == 2"

                                :paramData  =   "paramData"

                                @fn_showProgress="fn_showProgress"
                                @fn_showWaitProgress="fn_showWaitProgress"
                                @fn_showSimulation="fn_showSimulation">
        </SimulationResult>

        <!-- 시뮬레이션 그룹 화면 -->
        <SimulationResultGroup   v-if="showSimulationId == 3"

                                :paramData  =   "paramData"

                                @fn_showProgress="fn_showProgress"
                                @fn_showSimulation="fn_showSimulation">
        </SimulationResultGroup>

        <v-flex>
            <ProgressBar ref="progress2"></ProgressBar>
            <WaitProgressBar ref="wait_progress"></WaitProgressBar>
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
import WaitProgressBar from "@/components/common/WaitProgressBar.vue";

import Simulation from "@/components/Home/Simulation/Simulation.vue";
import SimulationList from "@/components/Home/Simulation/SimulationList.vue";
import SimulationResult from "@/components/Home/Simulation/SimulationResult.vue";
import SimulationResultGroup from "@/components/Home/Simulation/SimulationResultGroup.vue";


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
            ,   showSimulationId    :   0       /* 시뮬레이션 param 정보 */
        };
    },
    components: {
            ProgressBar
        ,   WaitProgressBar
        ,   ConfirmDialog

        ,   Simulation
        ,   SimulationList
        ,   SimulationResult
        ,   SimulationResultGroup
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

            if( tab_id == 0 ) {
                vm.paramData    =   {};
            }else{
                if( vm.paramData.simul_mast ) {

                    if( vm.paramData.simul_mast.grp_cd ) {
                        vm.paramData.grp_cd     =   vm.paramData.simul_mast.grp_cd;
                    }

                    if( vm.paramData.simul_mast.scen_cd ) {
                        vm.paramData.scen_cd    =   vm.paramData.simul_mast.scen_cd;
                    }                
                }                    
            }

            vm.activeTab            =   tab_id;
            vm.showSimulationId     =   0;
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

        /*
         *  진행 progress 를 보여준다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_showWaitProgress: function(visible) {

            if( this.$refs && this.$refs.wait_progress ) {
                util.processing( this.$refs.wait_progress, visible );
            }
        },      

        /*
         *  param 과 일치하는 정보를 보여준다.
         *  2019-08-12  bkLove(촤병국)
         */
        async fn_showSimulation(
             v_param={ 
                    showSimulationId    :   1

                ,   grp_cd              :   ""
                ,   scen_cd             :   ""

                ,   simul_mast          :   {}
                ,   arr_daily           :   []
                ,   arr_rebalance       :   []
                ,   analyzeList         :   []
                ,   arr_scen_in_grp     :   []
                ,   method_gubun        :   ""
            } 
        ) {
            var vm = this;

            vm.paramData    =   v_param;        

            switch( v_param.showSimulationId ) {

                        /* 시뮬레이션 목록 화면 */
                case    0:
                        vm.activeTab            =   0;
                        vm.showSimulationId     =   0;
                        break;

                        /* 시뮬레이션 등록 수정 화면 */
                case    1:
                        vm.activeTab            =   1;
                        vm.showSimulationId     =   0;
                        break;

                        /* 시뮬레이션 결과 */
                case    2:
                        vm.activeTab            =   1;
                        vm.showSimulationId     =   2;
                        break;

                        /* 시뮬레이션 그룹 결과 */
                case    3:
                        vm.activeTab            =   3;
                        vm.showSimulationId     =   3;
                        break;                        
            }
        }
    }
};
</script>