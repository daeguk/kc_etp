<template>
  <v-layout row wrap class="content_margin con_wrap">
    <v-flex grow :class="className">
      <!-- ETP 운용정보 -->
      <EtpOperInfo
        v-if="showEtpOerInfo == 0" 
        :toggle="toggle"
        :state="state"
        @showDetail="showDetail" 
        @showMessageBox="showMessageBox"
        @fn_showProgress="fn_showProgress"
        @fn_showDetailIndex="fn_showDetailIndex"
        @fn_showDetailPdf="fn_showDetailPdf"
        @fn_pageMove="fn_pageMove"
        @fn_setFirstData="fn_setFirstData"
        @fn_setInavData="fn_setInavData"
        @fn_setEtpPerformanceData="fn_setEtpPerformanceData"
        @fn_setEtpLpspread="fn_setEtpLpspread"
        @fn_setCustomizeData="fn_setCustomizeData"
        @fn_setStateInfo="fn_setStateInfo">
      </EtpOperInfo>

      <!-- 지수관리 -->
      <EtpOperIndex
        v-if="showEtpOerInfo == 1" 
        @showDetail="showDetail" 
        @fn_showProgress="fn_showProgress"
        @showMessageBox="showMessageBox"
        @fn_showDetailIndex="fn_showDetailIndex">
      </EtpOperIndex>

      <!-- PDF 관리 -->
      <EtpOperPdf
        v-if="showEtpOerInfo == 2" 
        :paramData="paramData"
        :reloadYn="reloadYn"
        :toggle="toggle"
        @showMessageBox="showMessageBox"
        @fn_showProgress="fn_showProgress"
        @fn_showDetailIndex="fn_showDetailIndex"
        @fn_showDetailPdf="fn_showDetailPdf">
      </EtpOperPdf>

      <!-- 메시지 관리 -->
      <ConfirmDialog ref="confirm"></ConfirmDialog>

      <ProgressBar ref="progress"></ProgressBar>

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

      <!-- 지수 조치현황 -->
      <ComIndexFixPopup
        v-if="showEtpOperIndexFixDialog"
        :indexBasic="paramData" 
        :indexFixDialog="showEtpOperIndexFixDialog" 
        @fn_closePop="fn_close" >
      </ComIndexFixPopup>            

      <!-- 지수오류내역 -->
      <EtpOperIndexErrorPop
        v-if="showEtpOperIndexErrorDialog"
        :paramData="paramData" 
        :showDialog="showEtpOperIndexErrorDialog" 
        @fn_closePop="fn_close" >
      </EtpOperIndexErrorPop>

      <!-- PDF 긴급반영 -->
      <EtpOperPdfEmergencyModifyPop
        v-if="showEtpOperPdfEmergencyModifyPop"
        :paramData="paramData" 
        :showDialog="showEtpOperPdfEmergencyModifyPop"
        @showMessageBox="showMessageBox"
        @fn_closePop="fn_close" >
      </EtpOperPdfEmergencyModifyPop>

      <!-- PDF 수정내역 팝업 -->
      <EtpOperPdfHistPop
        v-if="showEtpOperPdfHistPop"
        :paramData="paramData" 
        :showDialog="showEtpOperPdfHistPop"
        @showMessageBox="showMessageBox"
        @fn_closePop="fn_close" >
      </EtpOperPdfHistPop>            

      <!-- (PDF) iNAV 계산기 팝업 -->
      <EtpOperPdfInavCalcPop
        v-if="showEtpOperPdfInavCalcPop"
        :paramData="paramData" 
        :showDialog="showEtpOperPdfInavCalcPop" 
        @showMessageBox="showMessageBox"
        @fn_closePop="fn_close" >
      </EtpOperPdfInavCalcPop>

      <!-- (지수 수익율) iNAV 계산기 팝업 -->
      <v-dialog  v-model="showEtpOperIndexInavCalcPop"  persistent  max-width="760" >
        <EtpOperInfoInavIndex
          v-if="showEtpOperIndexInavCalcPop"
          :paramData = "paramData"
          @showMessageBox="showMessageBox"
          @fn_close = "fn_close">
        </EtpOperInfoInavIndex>
      </v-dialog>
    </v-flex>

    <v-flex :class="FaverClassName">
      <ComEtpFavorItemSub
        v-if="showFaver"   
        :faverSize = "faverSize"
        @showDetail="showDetail" 
        @showMessageBox="showMessageBox">
      </ComEtpFavorItemSub>
    </v-flex>
  </v-layout> 
</template>

<script>

import $                            from "jquery";
import dt                           from "datatables.net";
import buttons                      from "datatables.net-buttons";
import select                       from "datatables.net-select";
import _                            from "lodash";
import Config                       from "@/js/config.js";
import util                         from "@/js/util.js";

import ConfirmDialog                from "@/components/common/ConfirmDialog.vue";
import ProgressBar                  from "@/components/common/ProgressBar.vue";
import ComIndexFixPopup             from "@/components/common/popup/ComIndexFixPopup.vue";
import ComEtpFavorItemSub              from "@/components/common/control/ComEtpFavorItemSub"; 

import IndexDetailInfo              from "@/components/Home/Index/Manage/IndexDetailInfo.vue";              /* 지수 상세정보 */
import EtpOperIndexDetailListPop    from "@/components/Home/Etp/Manage/EtpOperIndexDetailListPop.vue";      /* 지수종목 상세정보 */
import EtpManageDetail              from "@/components/Home/Etp/Manage/EtpManageDetail.vue";                /*ETP 상세정보*/
import EtpOperIndexErrorPop         from "@/components/Home/Etp/Manage/EtpOperIndexErrorPop.vue";           /*ETP 상세정보*/
import EtpOperInfo                  from "@/components/Home/Etp/Manage/EtpOperInfo.vue";                    /* ETP 운용정보 */
import EtpOperIndex                 from "@/components/Home/Etp/Manage/EtpOperIndex.vue";                   /* 지수관리 */
import EtpOperPdf                   from "@/components/Home/Etp/Manage/EtpOperPdf.vue";                     /* PDF 관리 */
import EtpOperPdfEmergencyModifyPop from "@/components/Home/Etp/Manage/EtpOperPdfEmergencyModifyPop.vue";   /* PDF 긴급반영 팝업 */
import EtpOperPdfHistPop            from "@/components/Home/Etp/Manage/EtpOperPdfHistPop.vue";              /* PDF 수정내역 팝업 */
import EtpOperPdfInavCalcPop        from "@/components/Home/Etp/Manage/EtpOperPdfInavCalcPop.vue";          /* (PDF) iNAV 계산기 팝업 */
import EtpOperInfoInavIndex         from "@/components/Home/Etp/Manage/EtpOperInfoInavIndex.vue";            /* (지수 수익율) iNAV 계산기 팝업 */

export default {
  props: ["activeTab"],
  data() {
    return {
      showIndexDetailDialog : false,
      showEtpDetailDialog : false,
      showEtpManageDetailDialog : false,
      showEtpOperIndexDetailListDialog : false,
      showEtpOperIndexFixDialog: false,
      showEtpOperIndexErrorDialog : false,
      showEtpOerPdfMain : false,
      showEtpOperPdfEmergencyModifyPop : false,
      showEtpOperPdfHistPop : false,
      showEtpOperPdfInavCalcPop : false,
      showEtpOperIndexInavCalcPop : false,
      showEtpOerPdfQuick : false,
      showFaver : false,

      showEtpOerInfo : 0,
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
    EtpOperIndexDetailListPop       :   EtpOperIndexDetailListPop,          /* 인덱스 상세 목록 정보 */
    ComIndexFixPopup                :   ComIndexFixPopup,                   /* 지수조치현황 */
    EtpOperIndexErrorPop            :   EtpOperIndexErrorPop,               /* 지수오류내역 */
    EtpOperPdfEmergencyModifyPop    :   EtpOperPdfEmergencyModifyPop,       /* PDF 긴급반영 팝업 */
    EtpOperPdfHistPop               :   EtpOperPdfHistPop,                  /* PDF 수정내역 팝업 */
    EtpOperPdfInavCalcPop           :   EtpOperPdfInavCalcPop,              /* (PDF) iNAV 계산기 팝업 */
    EtpOperInfoInavIndex            :   EtpOperInfoInavIndex,               /* (지수수익율) iNAV 계산기 팝업 */

    EtpOperInfo                     :   EtpOperInfo,                        /* ETP 운용정보 */
    EtpOperIndex                    :   EtpOperIndex,                       /* 지수관리 */
    EtpOperPdf                      :   EtpOperPdf,                         /* PDF 관리 */

    ConfirmDialog                   :   ConfirmDialog,                      /* 공통 메시지창 */
    ProgressBar                     :   ProgressBar,
    ComEtpFavorItemSub              :   ComEtpFavorItemSub,
  },
  watch : {
    showEtpOperPdfEmergencyModifyPop : function( oldValue, newValue ) {
      var vm = this;

      vm.paramData = vm.paramData;
      vm.reloadYn = vm.showEtpOperPdfEmergencyModifyPop;
    }
  },

  mounted: function() {
    // 메시지 박스 참조
    this.$root.$confirm = this.$refs.confirm;

    this.className = "conWidth_100";
  },
  created: function() {
    this.$EventBus.$on('showList', data => {
      this.className = "conWidth_100";
      this.showEtpOerInfo                     =   data.tab_id;
      this.showEtpDetailDialog                =   false;
      this.showEtpManageDetailDialog          =   true;
      this.showIndexDetailDialog              =   false;
      this.showEtpOerPdfQuick                 =   false;
      this.showEtpOerPdfMain                  =   false;
      this.showEtpOperIndexDetailListDialog   =   false;
      this.showEtpOperIndexFixDialog          =   false;
      this.showEtpOperIndexErrorDialog        =   false;
      this.showEtpOperPdfEmergencyModifyPop   =   false;
      this.showEtpOperPdfHistPop              =   false;
      this.showEtpOperPdfInavCalcPop          =   false;
      this.showEtpOperIndexInavCalcPop        =   false;
      this.showFaver                          =   false;
      this.paramData                          =   data.paramData;
      if( this.showEtpOerInfo == 2 ) {
        this.className      =   "conWidth_left";
        this.FaverClassName =   "conWidth_right";
        this.showEtpOerPdfQuick =   true;
      }
/*
      if (data.tab_id == 0 || data.tab_id == 1) {
          this.$EventBus.$off('EtpOperControl_EtpOperPdf_setEtpOperPdfByRate_call');
      }else{
          this.$EventBus.$off('changeEtpAnalysisInfo');
      }
*/
    });
  },
  beforeUpdated: function() {
  },
  updated: function() {
    // 메시지 박스 참조
    this.$root.$confirm = this.$refs.confirm;    
  },
  methods: {
    showDetail: function(gubun, paramData) {
      this.showFaver =   false;
      if (gubun == '1') {
        this.paramData = paramData;
        // this.faverSize = 1081;
        if( this.activeTab != 2 ) {                
          this.showIndexDetailDialog = false;
          if (this.showEtpDetailDialog) {
              this.$EventBus.$off('changeIndexInfo', paramData);
              this.$EventBus.$emit('changeEtpInfo', paramData);
          }
          this.showEtpDetailDialog = true;
          if( this.activeTab != 2 ) {
              this.showFaver =   true;
          }
          this.showEtpOerInfo = -1;
        }else{
          this.showEtpOerInfo = -1;
          this.$nextTick().then(() => {
              if (this.showEtpOerPdfMain) {         
                  this.$EventBus.$off('changeIndexInfo', paramData);
                  this.$EventBus.$off('changeEtpInfo', paramData);
              }
              this.showEtpOerPdfMain = true;
              this.showEtpOerInfo = this.activeTab;
          });
        }
      } else if (gubun == '2') { 
        this.paramData = paramData;
        this.showEtpDetailDialog = false;
        // this.faverSize = 760;
        if (this.showIndexDetailDialog) {
          this.$EventBus.$off('changeEtpAnalysisInfo', paramData);
          this.$EventBus.$off('changeEtpInfo', paramData);
          this.$EventBus.$emit('changeIndexInfo', paramData);
        }
        this.showIndexDetailDialog = true;                
        this.showEtpOerInfo = this.activeTab;
        this.showFaver = false;
      } 
      this.className = "conWidth_left";
      this.FaverClassName = "conWidth_right";
    },
    showMessageBox: function(title, msg, option, gubun) {
      this.$root.$confirm.open(title,msg, option, gubun);
    },
    fn_showProgress: function(visible) {
      if( this.$refs && this.$refs.progress ) {
        util.processing(this.$refs.progress, visible);
      }
    },      
    async fn_showDetailIndex(gubun, paramData) {
      /* 지수관리 -> 지수구성정보 상세팝업 */
      if( gubun == '3' ) {
        this.paramData = paramData;
        this.showEtpOperIndexDetailListDialog = true;
      /* 지수관리 -> 지수조치내역 팝업 */
      }else if( gubun == '4' ) {
        var checkResult = false;
        if(paramData) {
            // console.log( "paramData.F16013=[" + paramData.F16013 + "]/paramData.market_id=[" + paramData.market_id + "]/paramData.F16257=[" + paramData.F16257+ "]/paramData.F34239=[" + paramData.F34239 + "]" );
        }else{
            // console.log( "paramData is null");
        }

        if(paramData &&  paramData.F16013 &&  paramData.market_id) {
          checkResult =   true;
        /* ETP기초지수코드 / ETP기초지수MID */
        }else if(paramData &&  paramData.F16257 &&  paramData.F34239) {
          checkResult = true;
        }

        if( !checkResult ) {
          if( await this.$root.$confirm.open(
            '[지수 조치현황]',
            '지수 정보가 없습니다.',
            {},   1
            )
          ) {
            return false;
          }                    
        }
        this.paramData = paramData;
        this.showEtpOperIndexFixDialog = true;  
      /* 지수관리 -> 지수오류내역 */
      }else if ( gubun == '5' ) {
        this.paramData = paramData;
        this.showEtpOperIndexErrorDialog = true;
      }
    },

    fn_showDetailPdf(gubun, paramData) {
      this.paramData = paramData;

      /* PDF 관리 -> PDF 긴급반영 팝업 */
      if( gubun == '6' ) {
        this.toggle.togglePdfEmergencyPop  = true;
        this.toggle.toggleIanvPop = false;

        this.showEtpOperPdfEmergencyModifyPop = true;
      }
      /* (PDF) iNAV 계산기 팝업 */
      else if( gubun == '7' ) {
        this.toggle.togglePdfEmergencyPop  = false;
        this.toggle.toggleIanvPop = true;
        
        this.showEtpOperPdfInavCalcPop = true;
      }
      /* (지수 수익율) iNAV 계산기 팝업 */
      else if( gubun == '8' ) {
        this.showEtpOperIndexInavCalcPop = true;
      }
      /* PDF 관리 -> PDF 수정내역 팝업 */
      else if( gubun == '9' ) {
        this.showEtpOperPdfHistPop  =   true;
      }
    },

    /*
      *  ETP 운용정보에서 이미지 버튼 클릭시 상세페이지로 이동시킨다.
      *  2019-05-03  bkLove(촤병국)
      */
    fn_pageMove( btnId, paramData ) {
      switch( btnId ) {
        case    'btnPdf'    :
          this.paramData  =   paramData;
          this.$emit( "fn_setActiveTab", 2, this.paramData );
          break;
      }            
    },

    fn_setFirstData( firstData ) {
      var vm = this;

      vm.paramData = firstData;
      vm.$emit( "fn_setFirstData", firstData );
    },

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
      vm.showEtpOperPdfEmergencyModifyPop     =   false;
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