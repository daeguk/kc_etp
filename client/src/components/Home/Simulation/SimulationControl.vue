<template>
  <v-container>
    <v-tabs v-model="activeTab" align-with-title light>
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="tab of tabs" :key="tab.id" @click="fn_pageMove(tab.id)">{{ tab.name }}</v-tab>
    </v-tabs>

    <!-- 시뮬레이션 목록화면 -->
    <SimulationList
      v-if="[ 0, 1 ].includes( showSimulationId ) && activeTab==0"
      @fn_showSimulation="fn_showSimulation"
    ></SimulationList>

    <!-- 시뮬레이션 수정화면 -->
    <Simulation
      v-if="[ 0, 1 ].includes( showSimulationId ) && activeTab==1"
      :paramData="paramData"
      @fn_showSimulation="fn_showSimulation"
    ></Simulation>

    <!-- 시뮬레이션 결과화면 -->
    <SimulationResult
      v-if="showSimulationId == 2"
      :paramData="paramData"
      @fn_showSimulation="fn_showSimulation"
    ></SimulationResult>

    <!-- 시뮬레이션 그룹 화면 -->
    <SimulationResultGroup
      v-if="showSimulationId == 3"
      :paramData="paramData"
      @fn_showSimulation="fn_showSimulation"
    ></SimulationResultGroup>

    <!-- 시계열 업로드 화면 -->
    <SimulationTimeSeriesUpload
      v-if="showSimulationId == 4"
      :paramData="paramData"
      @fn_showSimulation="fn_showSimulation"
    ></SimulationTimeSeriesUpload>
  </v-container>
</template>

<script>
  import util from "@/js/util.js";
  import Config from "@/js/config.js";
  import Simulation from "@/components/Home/Simulation/Simulation.vue";
  import SimulationList from "@/components/Home/Simulation/SimulationList.vue";
  import SimulationResult from "@/components/Home/Simulation/SimulationResult.vue";
  import SimulationResultGroup from "@/components/Home/Simulation/SimulationResultGroup.vue";
  import SimulationTimeSeriesUpload from "@/components/Home/Simulation/SimulationTimeSeriesUpload.vue";
  var table01 = null;
  export default {
    data() {
      return {
        activeTab: 0,
        tabs: [{
          id: 0,
          name: "관리목록"
        }, {
          id: 1,
          name: "Simulation"
        }, ],
        paramData: {} /* 파리미터 정보 */ ,
        showSimulationId: 0 /* 시뮬레이션 param 정보 */
      };
    },
    components: {
      Simulation,
      SimulationList,
      SimulationResult,
      SimulationResultGroup,
      SimulationTimeSeriesUpload
    },
    created() {},
    mounted() {},
    methods: {
      /*
       *  탭 클릭시 paramData 를 초기화 한다.
       *  2019-07-26  bkLove(촤병국)
       */
      fn_pageMove(tab_id) {
        var vm = this;
        if(tab_id == 0) {
          vm.paramData = {};
          vm.showSimulationId = 0;
        } else {
          if(vm.paramData) {
            if(vm.paramData.simul_mast) {
              if(vm.paramData.simul_mast.grp_cd) {
                vm.paramData.grp_cd = vm.paramData.simul_mast.grp_cd;
              }
              if(vm.paramData.simul_mast.scen_cd) {
                vm.paramData.scen_cd = vm.paramData.simul_mast.scen_cd;
              }
              if(typeof vm.paramData.owner_all_yn != "undefined" && vm.paramData.owner_all_yn == "0") {
                tab_id = 0;
                vm.showSimulationId = 0;
              } else if(typeof vm.paramData.simul_mast.time_series_upload_yn != "undefined" && vm.paramData.simul_mast.time_series_upload_yn == "1") {
                tab_id = 1;
                vm.showSimulationId = 4;
              } else if(["getInfoCheckedScenCd", "getScenInGrpCd"].includes(vm.paramData.method_gubun)) {
                tab_id = 1;
                vm.showSimulationId = 3;
              } else {
                vm.showSimulationId = 0;
              }
            } else if(vm.paramData.grp_cd && vm.paramData.scen_cd) {
              if(typeof vm.paramData.owner_all_yn != "undefined" && vm.paramData.owner_all_yn == "0") {
                tab_id = 0;
                vm.showSimulationId = 0;
              } else if(typeof vm.paramData.time_series_upload_yn != "undefined" && vm.paramData.time_series_upload_yn == "1") {
                tab_id = 1;
                vm.showSimulationId = 4;
              } else if(["getInfoCheckedScenCd", "getScenInGrpCd"].includes(vm.paramData.method_gubun)) {
                tab_id = 1;
                vm.showSimulationId = 3;
              } else {
                vm.showSimulationId = 0;
              }
            }
          } else {
            vm.showSimulationId = 0;
          }
        }
        vm.activeTab = tab_id;
      },
      /*
       *  param 과 일치하는 정보를 보여준다.
       *  2019-08-12  bkLove(촤병국)
       */
      async fn_showSimulation(v_param = {
        showSimulationId: 1,
        grp_cd: "",
        scen_cd: "",
        time_series_upload_yn: "",
        owner_all_yn: "",
        simul_mast: {},
        arr_daily: [],
        arr_rebalance: [],
        arr_contribute: [],
        arr_scen_in_grp: [],
        method_gubun: ""
      }) {
        var vm = this;
        vm.paramData = v_param;
        switch (v_param.showSimulationId) {
          /* 시뮬레이션 목록 화면 */
          case 0:
            vm.activeTab = 0;
            vm.showSimulationId = 0;
            break;
            /* 시뮬레이션 등록 수정 화면 */
          case 1:
            vm.activeTab = 1;
            vm.showSimulationId = 0;
            break;
            /* 시뮬레이션 결과 */
          case 2:
            vm.activeTab = 1;
            vm.showSimulationId = 2;
            break;
            /* 시뮬레이션 그룹 결과 */
          case 3:
            vm.activeTab = 1;
            vm.showSimulationId = 3;
            break;
            /* 시계열 업로드 화면 */
          case 4:
            vm.activeTab = 1;
            vm.showSimulationId = 4;
            break;
        }
      }
    }
  };
</script>