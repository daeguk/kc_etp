<template>
    <v-container>
        <v-layout row wrap class="content_margin">

            <!-- 테이블 start -->
            <v-flex v-for="item in ctg_results" :key="item.ctg_code"  grow xs12 mt-3>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                           {{item.ctg_name}}
                            <p>
                                Total
                                <span class="text_result" v-bind:id="table_name + '_count'+item.ctg_code">120</span> results
                                <span v-bind:id="table_name + '_date'+item.ctg_code">기준일 :2018.10.20</span>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table v-bind:id="table_name + item.ctg_code" class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="15%">
                                <col width="10%">
                                <col width="15%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>종목</th>
                                    <th>INAV</th>
                                    <th>전일최종NAV</th>
                                    <th>추적오차율</th>
                                    <th>괴리율</th>
                                    <th>기초지수</th>
                                    <th>지수현재가</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                    </v-card>
                </v-card>
            </v-flex>

            <v-flex>
                <v-dialog v-model="showEtpManageDetailDialog"   :max-width="options.width" v-bind:style="{ zIndex: options.zIndex }" >
                    <EtpManageDetail    v-if="showEtpManageDetailDialog"  

                                        :paramData="paramData"
                                        :showEtpManageDetailDialog="showEtpManageDetailDialog"  
                                        
                                        @fn_closePop = "fn_marketClosePop">
                    </EtpManageDetail>
                </v-dialog>
            </v-flex>

            <v-flex>
                <ConfirmDialog ref="confirm"></ConfirmDialog>
            </v-flex>

            <!-- 테이블 end -->
            <ComFavorItem></ComFavorItem>
        </v-layout>
    </v-container>
</template>

<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";
import ComFavorItem from "@/components/common/control/ComFavorItem"; 
import EtpManageDetail from "@/components/Home/Etp/Manage/EtpManageDetail.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import { market_common } from '@/js/common/mixins/mixins_marketinfo.js';

var importance_grid = null;

export default {
    props: [],
    data() {
        return {
            table_name : "bond",
            ctg_results: [],
            carousel_info:[],
            carousel_data:[],
            carousel_mod:[],

            options: {
                color: 'primary',
                width: '80%',
                zIndex: 200
            },
            showEtpManageDetailDialog : false,
            paramData : {},                
        };
    },
    mixins : [ market_common ],
    components: {
            ComFavorItem    :   ComFavorItem
        ,   EtpManageDetail :   EtpManageDetail
        ,   ConfirmDialog   :   ConfirmDialog
    },
    computed: {
         orderedData : function(){
           
            return _.orderBy(this.carousel_mod, 'ctg_code', 'asc');
        }
    },
    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;

        this.fn_getEtpList( "005" );      /* 005-채권 */
    },
    created: function() {},
    beforeDestroy() {},
    methods: {

    }
};
</script>
