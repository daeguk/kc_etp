<template>

    <div >
        <v-layout row>
            <v-flex xs12>

                <v-card flat ma-3>

                <!-- content내용 -->
                    <div class="title01_w">
                        <v-card-title primary-title>
                            <div class="title_wrap01">
                                <h3 class="headline mb-0">
                                    {{this.etpBasic.f16002}}
                                    <span class="grey--text">{{etpBasic.f16013}}</span>
                                </h3>

                                <!--div class="right_btn"  v-if="showEtpManageDetailDialog">
                                    <v-layout align-right>
                                        <v-flex xs12 sm4 text-xs-center>                                         
                                            <div class="btn_r">
                                                <v-btn icon  @click.stop="fn_close">
                                                    <v-icon>close</v-icon>
                                                </v-btn>
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </div-->

                                <div class="right_btn"  v-if="!showEtpManageDetailDialog">
                                    <v-layout align-right>
                                        <v-flex xs12 sm4 text-xs-center>
                                            <div class="btn_r">
                                                <v-btn
                                                    outline
                                                    color="primary"
                                                    small
                                                    @click="fn_goBack()"
                                                >목록으로 돌아가기</v-btn>
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <p class="title_ex">
                                {{this.etpBasic.f16002}} 관한 내용이 들어갑니다
                            </p>
                        </v-card-text>
                    </div>


                    <div class="graph_01_w">

                        <div class="sub_title_num">
                            {{etpBasic.f15001}}
                            <span class="text_blue">{{etpBasic.f15472}}({{etpBasic.f15004}})</span>
                            <p>Last Updated : {{etpBasic.f12506}}</p>
                        </div>
                        <LineEtpMultiChart :etpBasic="etpBasic"></LineEtpMultiChart>
                    </div>
                    <div class="tab2_w">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-tabs fixed-tabs light v-model="tab5" align-with-title>
                                    <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                    <v-tab v-for="item in items5" :key="item">{{ item }}</v-tab>
                                </v-tabs>

                                <v-tabs-items v-model="tab5">
                                    <v-tab-item>
                                        <EtpManageDetailBasicInfoTab    v-if="showEtpManageDetailDialogBySub"

                                                                        :paramData="paramData"
                                                                        :etpBasic="etpBasic"
                                                                        :indexBasic="indexBasic"
                                                                        @showMessageBox="showMessageBox">
                                        </EtpManageDetailBasicInfoTab>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <EtpManageDetailAnalysisTab     v-if="showEtpManageDetailDialogBySub"

                                                                        :paramData="paramData" 
                                                                        :etpBasic="etpBasic"
                                                                        @showMessageBox="showMessageBox">
                                        </EtpManageDetailAnalysisTab>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-flex>
                        </v-layout>
                    </div>
                </v-card>
            </v-flex>
            <!--v-flex class="conWidth_right">
                <ComFavorItemSub    @showDetail="showDetail" @showMessageBox="showMessageBox"></ComFavorItemSub>
            </v-flex-->
            <ConfirmDialog ref="confirm"></ConfirmDialog>
        </v-layout>
    </div>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";
import EtpManageDetailBasicInfoTab from "./EtpManageDetailBasicInfoTab.vue";
import EtpManageDetailAnalysisTab from "./EtpManageDetailAnalysisTab.vue";
import ComFavorItemSub from "@/components/common/control/ComFavorItemSub";
import LineEtpMultiChart   from  '@/components/common/chart/LineEtpMultiChart.vue';
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import Config from "@/js/config.js";
import util from "@/js/util.js";

export default {
    props : [ "paramData", "showEtpManageDetailDialog" ],
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            text: "전종목",
            text2: "",
            dialog: false,
            dialog2: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            tab5: null,
            items5: ["기본정보", "분석정보"],
            items4: [],
            mini: false,
            right: null,
            rowsPerPageItems: [10, 20, 30, 50],
            headers: [
                {
                    text: "Code",
                    align: "left",
                    value: "name"
                },
                { text: "name", value: "name" },
                { text: "BasePrc", value: "BasePrc", align: "right" },
                { text: "Shrs", value: "Shrs", align: "right" },
                { text: "Float rto", value: "FloatRto", align: "right" },
                { text: "Ceiling rto", value: "CeilingRto", align: "right" },
                { text: "Factor rto", value: "FactorRto", align: "right" }
            ],
            desserts: [],
            toggle_one: '1M',
            basicData           :   {},
            etpBasic            :   {},
            indexBasic          :   {},
            etpInfos            :   {},
            showEtpManageDetailDialogBySub : false,
        };
    },
    components: {
        ConfirmDialog : ConfirmDialog,
        LineEtpMultiChart,
        EtpManageDetailBasicInfoTab,
        EtpManageDetailAnalysisTab,
        ComFavorItemSub
    },
    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
        
        var vm = this;
        
        console.log( "EtpManageDetail.vue -> mounted" );
        console.log( vm.paramData );
        vm.init(false);
        
    },
    created: function() {
        var vm = this;
        vm.$EventBus.$on('changeEtpInfo', data => {

            vm.toggle_one = '1M';
            vm.init(true);
            
        });
    },
    updated: function() {
        console.log("Etp_updated================");
    },
    beforeDestory: function() {
        this.$EventBus.$off('changeEtpInfo');
    },
    
    methods: {
        init: function(event) {
            var vm = this;
            
            vm.$nextTick().then(() => {
                if(     vm.paramData 
                    &&  (       vm.paramData.f16012
                            ||  vm.paramData.f16257
                            ||  vm.paramData.f34239
                        )
                ) {
                    vm.basicData.f16012         =   vm.paramData.f16012;            /* 국제표준코드 */
                    vm.basicData.f16257         =   vm.paramData.f16257;            /* ETP기초지수코드 */
                    vm.basicData.f34239         =   vm.paramData.f34239;            /* ETP기초지수MID */
                                        
                    vm.paramData.perf_class   = 'perf_chart_w2'; /* performanc 그래프 class */
                    vm.paramData.tbl_class   = 'tbl_type ver5'; /* performanc 테이블 class */
                    vm.paramData.chart_size  = '960'; /* performanc 차트 사이즈 */
                }
                else if(
                        vm.$route.query.f16012  
                    &&  vm.$route.query.f16257  
                    &&  vm.$route.query.f34239  
                ) {
                    vm.basicData.f16012         =   vm.$route.query.f16012;         /* 국제표준코드 */
                    vm.basicData.f16257         =   vm.$route.query.f16257;         /* ETP기초지수코드 */
                    vm.basicData.f34239         =   vm.$route.query.f34239;         /* ETP기초지수MID */
                    vm.paramData.perf_class   = 'perf_chart_w'; /* performanc 그래프 class */
                    vm.paramData.tbl_class   = 'tbl_type ver4'; /* performanc 테이블 class */
                    vm.paramData.chart_size  = '1180'; /* performanc 차트 사이즈 */
                }
                if(     vm.basicData.f16012
                    ||  vm.basicData.f16257
                    ||  vm.basicData.f34239
                )   {
                   // vm.$refs.etpBtn_1m.$el.click();     /* ETP 차트 정보를 조회한다. */
                    vm.fn_getEtpBasic();                /* ETP 의 기본정보를 조회한다. */
                }
                if (event) {
                    // 분석정보 실행
                    vm.$EventBus.$emit('changeEtpAnalysisInfo');
                }
            });
            
        },
        /*
         * ETP 의 기본정보를 조회한다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_getEtpBasic: function() {
            console.log("fn_getEtpBasic");
            var vm = this;
            axios.post(Config.base_url + "/user/etp/getEtpBasic", {
                data:   vm.basicData
            }).then(function(response) {
                console.log(response);
                if (response.data) {
                    vm.etpBasic = response.data.etpBasic;
                    vm.etpBasic.f15001 = util.formatStringNum(vm.etpBasic.f15001);
                    vm.showEtpManageDetailDialogBySub   =   true;
                }
            });
        },
        /*
         * 이전화면으로 되돌린다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_goBack() {
            this.$router.go(-1);
        },
        /*
         * 팝업창을 종료한다.
         * 2019-04-25  bkLove(촤병국)
         */
        fn_close : function() {
            this.$emit( "fn_closePop", "close" );
        },
        showMessageBox: function(title, msg, option, gubun) {
            this.$root.$confirm.open(title,msg, option, gubun);
        }        
    }
    
};
</script>