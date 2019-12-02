<template>
  <v-layout row wrap class="content_margin con_wrap">
    <v-flex grow :class="className">
      <IndexDetailInfo v-if="showIndexDetailDialog" :showDialog="showIndexDetailDialog" :paramData="paramData" :showView="true"></IndexDetailInfo>
      <EtpManageDetail v-if="showEtpDetailDialog" :showEtpManageDetailDialog="showEtpDetailDialog" :paramData="paramData"></EtpManageDetail>
      <v-dialog v-model="showEtpInfoPdfDetail" persistent max-width="1100">
          <EtpInfoPdfDetail v-if="showEtpInfoPdfDetail" :showEtpInfoPdfDetail="showEtpInfoPdfDetail" :paramData="paramData" @showMessageBox="showMessageBox" @fn_closePop="fn_close"></EtpInfoPdfDetail>
      </v-dialog>
      <marketRepresent v-if="showMarketInfo == 1" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketRepresent>               
      <marketSector v-if="showMarketInfo == 2" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketSector>                   
      <marketThema v-if="showMarketInfo == 3" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketThema>                       
      <marketStrategy v-if="showMarketInfo == 4" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketStrategy>                 
      <marketBond v-if="showMarketInfo == 5" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketBond>                         
      <marketCurrency v-if="showMarketInfo == 6" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketCurrency>                 
      <marketRawMaterials v-if="showMarketInfo == 7" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketRawMaterials>         
      <marketVix v-if="showMarketInfo == 8" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketVix>                          
      <marketRealEstate v-if="showMarketInfo == 9" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketRealEstate>             
      <marketMixAssets v-if="showMarketInfo == 10" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketMixAssets>               
      <marketOversea v-if="showMarketInfo == 11" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketOversea>                   
      <marketLeverageInverse v-if="showMarketInfo == 12" @showDetail="showDetail" @showMessageBox="showMessageBox" @showProgress="showProgress"></marketLeverageInverse>   
      <ConfirmDialog ref="confirm"></ConfirmDialog>
      <ProgressBar ref="progress"></ProgressBar>
    </v-flex>
    <v-flex :class="FaverClassName">
      <ComFavorItemSub v-if="showFaver" :faverSize = "faverSize" @showDetail="showDetail" @showMessageBox="showMessageBox"></ComFavorItemSub>
    </v-flex>
  </v-layout> 
</template>

<script>
import util       from "@/js/util.js";
import ComFavorItemSub from "@/components/common/control/ComFavorItemSub"; 
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";

import IndexDetailInfo from "@/components/Home/Index/Manage/IndexDetailInfo.vue";   /*지수 상세정보*/
import EtpManageDetail from "@/components/Home/Etp/Manage/EtpManageDetail.vue";         /*ETP 상세정보*/
import EtpInfoPdfDetail         from  "@/components/Home/MarketInfo/etp/EtpInfoPdfDetail.vue";                         /* PDF 상세 */
import EtpOperPdfHistPop            from "@/components/Home/Etp/Manage/EtpOperPdfHistPop.vue";              /* PDF 수정내역 팝업 */

import marketRepresent from "./marketRepresent.vue";                /* 001-시장대표 */
import marketSector from "./marketSector.vue";                      /* 002-섹터*/
import marketThema from "./marketThema.vue";                        /* 003-테마 */
import marketStrategy from "./marketStrategy.vue";                  /* 004-전략 */
import marketBond from "./marketBond.vue";                          /* 005-채권 */
import marketCurrency from "./marketCurrency.vue";                  /* 006-통화 */
import marketRawMaterials from "./marketRawMaterials.vue";          /* 007-원자재 */
import marketVix from "./marketVix.vue";                            /* 008-VIX */
import marketRealEstate from "./marketRealEstate.vue";              /* 009-부동산 */
import marketMixAssets from "./marketMixAssets.vue";                /* 010-혼합자산 */
import marketOversea from "./marketOversea.vue";                    /* 101-국가 ( 탭에 노출은 '해외' ) */
import marketLeverageInverse from "./marketLeverageInverse.vue";    /* 201-배율 ( 탭에 노출은 '레버리지/인버스' ) */

export default {
  props: ["activeTab"],
  data() {
    return {
      showIndexDetailDialog : false,
      showEtpDetailDialog : false,
      showEtpInfoPdfDetail : false,

      showMarketInfo : 0,
      paramData : [],
      showFaver : false,
      className: '',
      FaverClassName: '',
      faverSize: 1059,
    };
  },    

  components: {
    ComFavorItemSub : ComFavorItemSub,
    ConfirmDialog : ConfirmDialog,
    ProgressBar : ProgressBar,
    IndexDetailInfo : IndexDetailInfo,
    EtpManageDetail :   EtpManageDetail,
    EtpInfoPdfDetail: EtpInfoPdfDetail,                 /* PDF 상세 */
    EtpOperPdfHistPop : EtpOperPdfHistPop,              /* PDF 수정내역 팝업 */

    marketRepresent :  marketRepresent,                 /* 001-시장대표 */
    marketSector :   marketSector,                      /* 002-섹터*/
    marketThema :  marketThema,                         /* 003-테마 */
    marketStrategy : marketStrategy,                    /* 004-전략 */
    marketBond : marketBond,                            /* 005-채권 */
    marketCurrency : marketCurrency,                    /* 006-통화 */
    marketRawMaterials : marketRawMaterials,            /* 007-원자재 */
    marketVix : marketVix,                              /* 008-VIX */
    marketRealEstate : marketRealEstate,                /* 009-부동산 */
    marketMixAssets : marketMixAssets,                  /* 010-혼합자산 */
    marketOversea : marketOversea,                      /* 101-국가 ( 탭에 노출은 '해외' ) */
    marketLeverageInverse : marketLeverageInverse       /* 201-배율 ( 탭에 노출은 '레버리지/인버스' ) */
  },

  mounted: function() {
    // 메시지 박스 참조
    this.$root.$confirm = this.$refs.confirm;
    this.className = "conWidth_100";
  },
  created: function() {
    this.$EventBus.$on('showList', data => {
      this.className = "conWidth_100";
      this.FaverClassName = "";
      this.showMarketInfo = data.tab_id;
      this.showEtpDetailDialog = false;
      this.showIndexDetailDialog = false;
      this.showEtpInfoPdfDetail = false;
      this.showFaver = false;
    });

  },
  destroyed() {
    this.$EventBus.$off('showList');
  },
  beforeUpdated: function() {
      
  },
  updated: function() {
  },
  methods: {
    showDetail: function(gubun, paramData) {  
      /* ETP 정보 */             
      if(gubun == '1') {
        this.paramData = paramData;
        this.showIndexDetailDialog = false;
        this.showEtpInfoPdfDetail = false;
        
        if (this.showEtpDetailDialog) {
            this.$EventBus.$off('changeIndexInfo', paramData);
            this.$EventBus.$emit('changeEtpInfo', paramData);
        }
        this.showEtpDetailDialog = true;
        
        this.showMarketInfo = 0;
        this.showFaver = true;

        this.className = "conWidth_left";  
        this.FaverClassName = "conWidth_right";
      /* 인덱스 정보 */
      }else if (gubun == '2') { 
        this.paramData = paramData;
        this.showEtpDetailDialog = false;
        this.showEtpInfoPdfDetail = false;

        if (this.showIndexDetailDialog) {
          this.$EventBus.$off('changeEtpInfo', paramData);
          this.$EventBus.$emit('changeIndexInfo', paramData);
        }
        
        this.showIndexDetailDialog = true;                
        this.showMarketInfo = 0;
        this.showFaver = true;

        this.className = "conWidth_left";  
        this.FaverClassName = "conWidth_right";
      /* PDF 상세 */
      }else if( gubun == '3' ) {
        this.paramData = paramData;
        this.showEtpInfoPdfDetail = true;
        this.className = "conWidth_100";  
        this.FaverClassName = "conWidth_right";                
      }
    },
    showMessageBox: function(title, msg, option, gubun) {
      this.$root.$confirm.open(title,msg, option, gubun);
    },
    showProgress: function(visible) {
      if( this.$refs && this.$refs.progress ) {
          util.processing(this.$refs.progress, visible);
      }
    },
    /*
      *  지수관리 상세 팝업에서 종료시 해당 팝업을 종료한다.
      *  2019-05-03  bkLove(촤병국)
      */
    fn_close( param ) {
      this.showEtpInfoPdfDetail                =   false;
    },
  }   
}
</script>

<style scoped>
</style>