<template>
  <v-layout row wrap class="content_margin con_wrap">
    <v-flex grow :class="className">
      <!-- ETP 운용정보 -->
      <LpOperInfo
        v-if="showEtpOperInfo == 0" 
        :toggle="toggle"
        @showDetail="showDetail" 
        @fn_showDetailPdf="fn_showDetailPdf"
        @fn_pageMove="fn_pageMove"
        @fn_setInavData="fn_setInavData"
        @fn_setEtpPerformanceData="fn_setEtpPerformanceData"
        @fn_setEtpLpspread="fn_setEtpLpspread"
        @fn_setCustomizeData="fn_setCustomizeData"
        @fn_setStateInfo="fn_setStateInfo">
      </LpOperInfo>

      <!-- 지수 상세 팝업 -->
      <v-dialog v-model="showIndexDetailDialog" persistent max-width="1400">
        <IndexDetailInfo
          v-if="showIndexDetailDialog" 
          :paramData="paramData" 
          :showDialog="showIndexDetailDialog" 
          :showView="false"
          @fn_closePop="fn_close">
        </IndexDetailInfo>
      </v-dialog>

      <!-- 지수 상세정보 팝업 -->
      <EtpOperIndexDetailListPop
        v-if="showEtpOperIndexDetailListDialog" 
        :paramData="paramData" 
        :showDialog="showEtpOperIndexDetailListDialog" 
        @fn_closePop="fn_close">
      </EtpOperIndexDetailListPop>

      <!-- ETP 상세 -->
      <EtpManageDetail
        v-if="showEtpDetailDialog" 
        :paramData="paramData"
        :showEtpManageDetailDialog="showEtpManageDetailDialog">
      </EtpManageDetail>            

      <!-- (PDF) iNAV 계산기 팝업 -->
      <EtpOperPdfInavCalcPop
        v-if="showEtpOperPdfInavCalcPop"
        :paramData="paramData" 
        :showDialog="showEtpOperPdfInavCalcPop" 
        @fn_closePop="fn_close" >
      </EtpOperPdfInavCalcPop>

      <!-- (지수 수익율) iNAV 계산기 팝업 -->
      <v-dialog  v-model="showEtpOperIndexInavCalcPop"  persistent  max-width="760" >
        <EtpOperInfoInavIndex
          v-if="showEtpOperIndexInavCalcPop"
          :paramData = "paramData"
          @fn_close = "fn_close">
        </EtpOperInfoInavIndex>
      </v-dialog>
    </v-flex>
    <v-flex :class="FaverClassName">
      <ComEtpFavorItemSub
        v-if="showFaver"   
        :faverSize = "faverSize"
        @showDetail="showDetail">
      </ComEtpFavorItemSub>
    </v-flex>
  </v-layout> 
</template>

<script>


import Config                       from "@/js/config.js";
import util                         from "@/js/util.js";

import ComEtpFavorItemSub              from "@/components/common/control/ComEtpFavorItemSub"; 

import IndexDetailInfo              from "@/components/Home/Index/Manage/IndexDetailInfo.vue";              /* 지수 상세정보 */
import EtpOperIndexDetailListPop    from "@/components/Home/Etp/Manage/EtpOperIndexDetailListPop.vue";      /* 지수종목 상세정보 */
import EtpManageDetail              from "@/components/Home/Etp/Manage/EtpManageDetail.vue";                /*ETP 상세정보*/
import EtpOperIndexErrorPop         from "@/components/Home/Etp/Manage/EtpOperIndexErrorPop.vue";           /*ETP 상세정보*/
import EtpOperPdfInavCalcPop        from "@/components/Home/Etp/Manage/EtpOperPdfInavCalcPop.vue";          /* (PDF) iNAV 계산기 팝업 */
import EtpOperInfoInavIndex         from "@/components/Home/Etp/Manage/EtpOperInfoInavIndex.vue";            /* (지수 수익율) iNAV 계산기 팝업 */

import LpOperInfo                  from "@/components/Home/Lp/Manage/LpOperInfo.vue";                    /* ETP 운용정보 */

export default {
  props: [],
  data() {
    return {
      showIndexDetailDialog : false,
      showEtpDetailDialog : false,
      showEtpManageDetailDialog : false,
      showEtpOperIndexDetailListDialog : false,
      showEtpOperIndexFixDialog: false,
      showEtpOperIndexErrorDialog : false,
      showEtpOerPdfMain : false,
      showEtpOperPdfHistPop : false,
      showEtpOperPdfInavCalcPop : false,
      showEtpOperIndexInavCalcPop : false,
      showEtpOerPdfQuick : false,
      showFaver : false,

      showEtpOperInfo : 0,
      paramData : [],
      className: '',
      FaverClassName: '',
      pdfData : {},
      indexBasic : {},
      // faverSize : 760,
      faverSize : 985,
      reloadYn : false,
      toggle : {
        togglePdfEmergencyPop : false,
        toggleIanvPop : false,

        toggleINav :   false,
        toggleEtpPerformance :  false,
        toggleEtpLpspread : false,
        toggleCustomize :  false,
        arrCustomizeColumn : []
      },
      state : {       
        pageState : 'etpInfo'   /* etpInfo - ETP운용정보, iNav - iNav 산출현황, performance - ETP Performance, customize - 컬럼 선택 */
        ,gubun : 'A' 
      }            
    };
  },    
  components: {
    IndexDetailInfo                 :   IndexDetailInfo,                    /* 인덱스 상세정보 */
    EtpManageDetail                 :   EtpManageDetail,                    /* ETP 상세정보 */
    EtpOperPdfInavCalcPop           :   EtpOperPdfInavCalcPop,              /* (PDF) iNAV 계산기 팝업 */
    EtpOperInfoInavIndex            :   EtpOperInfoInavIndex,               /* (지수수익율) iNAV 계산기 팝업 */
    ComEtpFavorItemSub              :   ComEtpFavorItemSub,

    LpOperInfo,
  },

  mounted: function() {
    this.className = "conWidth_100";
  },
  created() {
    console.log("LpOperControl.......created.........");

    this.$EventBus.$off('showList2');
    this.$EventBus.$on('showList2', data => {
      console.log("showList2........." + data.tab_id);
      this.className = "conWidth_100";
      this.showEtpOperInfo                     =   data.tab_id;
      this.showEtpManageDetailDialog          =   true;
      this.showEtpDetailDialog                =   false;
      this.showFaver                          =   false;
      // this.showIndexDetailDialog              =   false;
      // this.showEtpOerPdfQuick                 =   false;
      // this.showEtpOerPdfMain                  =   false;
      // this.showEtpOperIndexDetailListDialog   =   false;
      // this.showEtpOperIndexFixDialog          =   false;
      // this.showEtpOperIndexErrorDialog        =   false;
      // this.showEtpOperPdfEmergencyModifyPop   =   false;
      // this.showEtpOperPdfHistPop              =   false;
      // this.showEtpOperPdfInavCalcPop          =   false;
      // this.showEtpOperIndexInavCalcPop        =   false;
    });
  },
  destroyed() {
    // console.log("LpOperControl.......destroyed.........");
    this.$EventBus.$off('showList2');
  },

  beforeUpdated: function() {
  },
  updated: function() {
  },
  methods: {
    showDetail: function(gubun, paramData) {
      if (gubun == '1') {
        console.log("showDetail........LpOperControl...");
        this.paramData = paramData;
        this.showEtpOperInfo = -1;
        this.showEtpDetailDialog = true;
        this.$EventBus.$emit('changeEtpInfo', paramData);
        this.showFaver = true;

      // } else if (gubun == '2') { 
      //   this.paramData = paramData;
      //   this.showEtpDetailDialog = false;
      //   // this.faverSize = 760;
      //   if (this.showIndexDetailDialog) {
      //     this.$EventBus.$emit('changeIndexInfo', paramData);
      //   }
      //   this.showIndexDetailDialog = true;                
      //   this.showFaver = false;
      } 
      this.className = "conWidth_left";
      this.FaverClassName = "conWidth_right";
    },

    fn_showDetailPdf(gubun, paramData) {
      this.paramData = paramData;

      /* (PDF) iNAV 계산기 팝업 */
      if( gubun == '7' ) {
        this.toggle.togglePdfEmergencyPop  = false;
        this.toggle.toggleIanvPop = true;
        
        this.showEtpOperPdfInavCalcPop = true;
      }
      /* (지수 수익율) iNAV 계산기 팝업 */
      else if( gubun == '8' ) {
        this.showEtpOperIndexInavCalcPop = true;
      }
    },

    /*
      *  ETP 운용정보에서 이미지 버튼 클릭시 상세페이지로 이동시킨다.
      *  2019-05-03  bkLove(촤병국)
      */
    // fn_pageMove( btnId, paramData ) {
    //   switch( btnId ) {
    //     case    'btnPdf'    :
    //       this.paramData  =   paramData;
    //       this.$emit( "fn_setActiveTab", 2, this.paramData );
    //       break;
    //   }            
    // },

    // fn_setFirstData( firstData ) {
    //   var vm = this;

    //   vm.paramData = firstData;
    //   vm.$emit( "fn_setFirstData", firstData );
    // },

    fn_setInavData( paramData, stateInfo ) {
      var vm = this;

      if( paramData && typeof paramData.toggleINav != "undefined" ) {
        vm.toggle.toggleINav    =   paramData.toggleINav;
      }
      vm.toggle.toggleEtpPerformance  =   false;
      vm.toggle.toggleCustomize  =   false;
      vm.toggle.toggleEtpLpspread  =   false;
      vm.toggle.arrCustomizeColumn  =   [];

      if( stateInfo ) {
        vm.state.pageState  =   stateInfo.pageState;
        vm.state.gubun  =   stateInfo.gubun;
      }
    },

    fn_setEtpPerformanceData( paramData, stateInfo ) {
      var vm = this;

      if( paramData && typeof paramData.toggleEtpPerformance != "undefined" ) {
        vm.toggle.toggleEtpPerformance    =   paramData.toggleEtpPerformance;
      }

      vm.toggle.toggleINav  =   false;
      vm.toggle.toggleCustomize  =   false;
      vm.toggle.toggleEtpLpspread  =   false;
      vm.toggle.arrCustomizeColumn  =   [];

      if( stateInfo ) {
        vm.state.pageState  =   stateInfo.pageState;
        vm.state.gubun  =   stateInfo.gubun;
      }            
    },

    fn_setEtpLpspread( paramData, stateInfo ) {
      var vm = this;

      if( paramData && typeof paramData.toggleEtpLpspread != "undefined" ) {
        vm.toggle.toggleEtpLpspread    =   paramData.toggleEtpLpspread;
      }

      vm.toggle.toggleINav  =   false;
      vm.toggle.toggleEtpPerformance  =   false;
      vm.toggle.toggleCustomize  =   false;
      vm.toggle.arrCustomizeColumn  =   [];

      if( stateInfo ) {
        vm.state.pageState  =   stateInfo.pageState;
        vm.state.gubun  =   stateInfo.gubun;
      }
    },        
    
    fn_setCustomizeData( paramData, stateInfo ) {
      var vm = this;

      if( paramData ) {
        if( typeof paramData.toggleCustomize != "undefined" ) {
          vm.toggle.toggleCustomize    =   paramData.toggleCustomize;
        }
        if( paramData.arrCustomizeColumn ) {
          vm.toggle.arrCustomizeColumn    =   paramData.arrCustomizeColumn;
        }                
      }

      vm.toggle.toggleINav  =   false;
      vm.toggle.toggleEtpPerformance  =   false;
      vm.toggle.toggleEtpLpspread  =   false;

      if( stateInfo ) {
        vm.state.pageState  =   stateInfo.pageState;
        vm.state.gubun  =   stateInfo.gubun;
      }            
    },

    fn_setStateInfo( stateInfo ) {
      var vm = this;

      if( stateInfo ) {
        vm.state.pageState = stateInfo.pageState;
        vm.state.gubun = stateInfo.gubun;
      }
    },

    /*
      *  지소관리 상세 팝업에서 종료시 해당 팝업을 종료한다.
      *  2019-05-03  bkLove(촤병국)
      */
    fn_close( param ) {
      var vm = this;

      vm.showIndexDetailDialog                =   false;

      vm.showEtpOperIndexDetailListDialog     =   false;
      vm.showEtpOperIndexFixDialog            =   false;
      vm.showEtpOperIndexErrorDialog          =   false;
      vm.showEtpOperPdfHistPop                =   false;
      vm.showEtpOperPdfInavCalcPop            =   false;
      vm.showEtpOperIndexInavCalcPop          =   false;

      vm.toggle.togglePdfEmergencyPop    = false;
      vm.toggle.toggleIanvPop = false;
    },
  }
}
</script>

<style scoped>

</style>