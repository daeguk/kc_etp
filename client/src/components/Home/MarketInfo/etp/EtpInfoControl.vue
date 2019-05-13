<template>
    <v-layout row wrap class="content_margin con_wrap">
        <v-flex grow :class="className">
            <IndexDetailDialog v-if="showIndexDetailDialog" :paramData="paramData"></IndexDetailDialog>
            <EtpManageDetail v-if="showEtpDetailDialog" :paramData="paramData" :showEtpManageDetailDialog="showEtpDetailDialog"></EtpManageDetail>
            <marketRepresent v-if="showMarketInfo == 1" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketRepresent>               
            <marketSector v-if="showMarketInfo == 2" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketSector>                   
            <marketThema v-if="showMarketInfo == 3" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketThema>                       
            <marketStrategy v-if="showMarketInfo == 4" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketStrategy>                 
            <marketBond v-if="showMarketInfo == 5" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketBond>                         
            <marketCurrency v-if="showMarketInfo == 6" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketCurrency>                 
            <marketRawMaterials v-if="showMarketInfo == 7" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketRawMaterials>         
            <marketVix v-if="showMarketInfo == 8" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketVix>                          
            <marketRealEstate v-if="showMarketInfo == 9" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketRealEstate>             
            <marketMixAssets v-if="showMarketInfo == 10" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketMixAssets>               
            <marketOversea v-if="showMarketInfo == 11" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketOversea>                   
            <marketLeverageInverse v-if="showMarketInfo == 12" @showDetail="showDetail" @showMessageBox="showMessageBox"></marketLeverageInverse>   
            <ConfirmDialog ref="confirm"></ConfirmDialog>
        </v-flex>
        <v-flex :class="FaverClassName">
                <ComFavorItemSub v-if="showFaver"   @showDetail="showDetail" @showMessageBox="showMessageBox"></ComFavorItemSub>
        </v-flex>
    </v-layout> 
     
</template>

<script>

import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config from "@/js/config.js";
import ComFavorItemSub from "@/components/common/control/ComFavorItemSub"; 
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

import IndexDetailDialog from "@/components/Home/Index/Manage/IndexDetailDialog.vue";   /*지수 상세정보*/
import EtpManageDetail from "@/components/Home/Etp/Manage/EtpManageDetail.vue";         /*ETP 상세정보*/

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
            showMarketInfo : 0,
            paramData : [],
            showFaver : false,
            className: '',
            FaverClassName: '',
    	};
    },    

    components: {
        ComFavorItemSub : ComFavorItemSub,
        ConfirmDialog : ConfirmDialog,
        IndexDetailDialog : IndexDetailDialog,
        EtpManageDetail :   EtpManageDetail,
        marketRepresent :  marketRepresent,               /* 001-시장대표 */
        marketSector :   marketSector,                   /* 002-섹터*/
        marketThema :  marketThema,                       /* 003-테마 */
        marketStrategy : marketStrategy,                 /* 004-전략 */
        marketBond : marketBond,                         /* 005-채권 */
        marketCurrency : marketCurrency,                 /* 006-통화 */
        marketRawMaterials : marketRawMaterials,         /* 007-원자재 */
        marketVix : marketVix,                          /* 008-VIX */
        marketRealEstate : marketRealEstate,             /* 009-부동산 */
        marketMixAssets : marketMixAssets,               /* 010-혼합자산 */
        marketOversea : marketOversea,                   /* 101-국가 ( 탭에 노출은 '해외' ) */
        marketLeverageInverse : marketLeverageInverse   /* 201-배율 ( 탭에 노출은 '레버리지/인버스' ) */
    },

    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
    },
    created: function() {
        this.$EventBus.$on('showList', data => {
            this.className = "";
            this.FaverClassName = "";
            this.showMarketInfo = data.tab_id;
            this.showEtpDetailDialog = false;
            this.showIndexDetailDialog = false;
            this.showFaver = false;
        });
    },
    beforeUpdated: function() {
        
    },
    updated: function() {
    },
    methods: {
        showDetail: function(gubun, paramData) {               
            if (gubun == '1') {
                this.paramData = paramData;
                this.showIndexDetailDialog = false;
                
                if (this.showEtpDetailDialog) {
                    this.$EventBus.$off('changeIndexInfo', paramData);
                    this.$EventBus.$emit('changeEtpInfo', paramData);
                }
                this.showEtpDetailDialog = true;
                
                this.showMarketInfo = 0;
                this.showFaver = true;
                
            } else if (gubun == '2') { 
                this.paramData = paramData;
                this.showEtpDetailDialog = false;

                if (this.showIndexDetailDialog) {
                    this.$EventBus.$off('changeEtpInfo', paramData);
                    this.$EventBus.$emit('changeIndexInfo', paramData);
                }
                
                this.showIndexDetailDialog = true;                
                this.showMarketInfo = 0;
                this.showFaver = true;
            }

            this.className = "conWidth_left";  
            this.FaverClassName = "conWidth_right";       
        },
        showMessageBox: function(title, msg, option, gubun) {
            this.$root.$confirm.open(title,msg, option, gubun);
        }
    }   


}
</script>

<style scoped>

</style>