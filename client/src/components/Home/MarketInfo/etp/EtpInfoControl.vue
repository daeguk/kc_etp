<template>
    <v-layout row wrap>
        <v-flex xs12>
            
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
import ComFavorItem from "@/components/common/control/ComFavorItem"; 
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
    props: [],
    data() {
            return {
                showIndexDetailDialog : false,
                showEtpDetailDialog : false,
            ],
    	};
    },    

    components: {
        ComFavorItem : ComFavorItem,
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
        if (this.$route.query.activeTab == 2) {
            //this.activeTab = 1;
           // this.pageMove('/info/etpinfo/marketStrategy');
        } else {
            this.activeTab = 0;
            this.pageMove('/info/etpinfo/marketRepresent');
        }
    },
    created: function() {
        
    },
    beforeUpdated: function() {
        
    },
    updated: function() {
        if (this.$route.path == '/info/etpinfo') {        
            this.activeTab = 0;
            this.pageMove('/info/etpinfo/marketRepresent');
        }
    },
    methods: {
        pageMove : function(route) {
            this.$router.push(route);
        }
    }

}
</script>

<style scoped>

</style>