<template>
<v-app>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex xs12>
                <v-container>
                    <v-layout>
                        <v-flex xs4 mr-2>
                            <IndexSummaryCard :item="cardItem1" :chartItem="chartItem1"></IndexSummaryCard>
                        </v-flex>
                        <v-flex xs4 mr-2>
                            <IndexSummaryCard :item="cardItem2" :chartItem="chartItem2"></IndexSummaryCard>
                        </v-flex>
                        <v-flex xs4>
                            <IndexSummaryCard :item="cardItem3" :chartItem="chartItem3"></IndexSummaryCard>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
        <v-layout row wrap mt-2  class="content_margin">
            <v-flex xs3 pr-2>
                <IndexSummaryBox :item="boxItem1"></IndexSummaryBox>
            </v-flex>
            <v-flex xs3 pr-2>
                <IndexSummaryBox :item="boxItem2"></IndexSummaryBox>
            </v-flex>
            <v-flex xs3 pr-2>
                <IndexSummaryBox :item="boxItem3"></IndexSummaryBox>
            </v-flex>
            <v-flex xs3>
                <IndexSummaryBox :item="boxItem4"></IndexSummaryBox>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="content_margin">
            <v-flex xs12 >
                <InfoOpenReq></InfoOpenReq>
            </v-flex>
        </v-layout>
    </v-container>
    <v-flex>
             <ConfirmDialog ref="confirm"></ConfirmDialog>
    </v-flex>
</v-app>
    
</template>



<script>
import Config from "@/js/config.js";
import IndexSummaryCard from "./IndexSummaryCard.vue";
import IndexSummaryBox from "./IndexSummaryBox.vue";
import InfoOpenReq from "./InfoOpenReq.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
export default {
    props: [],
    data() {
        return {
            
            cardItem1: {
                name: "DBF 2차 산업혁명 지수",
                subTitle: "the Newest Index",
                close_idx: "300.23",
                fluc_idx: "+1.65",
                fluc_rate: "0.51"
            },
            cardItem2: {
                name: "DBF 4차전지 테마지수",
                subTitle: "the Best Performed Index",
                close_idx: "300.23",
                fluc_idx: "+1.65",
                fluc_rate: "0.51"
            },
            cardItem3: {
                name: "DBF 배당성장 지수",
                subTitle: "the Most Popular Index",
                close_idx: "300.23",
                fluc_idx: "+1.65",
                fluc_rate: "0.51"
            },
            chartItem1: {
                chartId: "summaryChart1",
                width: "360",
                height: "150",
                marginW: 10,
                marginH: 20,
                code: "DBF001",
                market_id: "M168",
                large_type: "FNGUIDE",
                chartColor: "#B39DDB"
            },
            chartItem2: {
                chartId: "summaryChart2",
                width: "360",
                height: "150",
                marginW: 10,
                marginH: 20,
                code: "DBF002",
                market_id: "M168",
                large_type: "FNGUIDE",
                chartColor: "#9FA8DA"
            },
            chartItem3: {
                chartId: "summaryChart3",
                width: "360",
                height: "150",
                marginW: 10,
                marginH: 20,
                code: "62801",
                market_id: "M168",
                large_type: "FNGUIDE",
                chartColor: "#90CAF9"
            },
            boxItem1: {
                mode: '4',
                title: "발표지수",
                count: 0,
                subTitle: "회원사/벤더로 분배되는 지수",
                updateDate: "0"
            },
            boxItem2: {
                mode: '3',
                title: "산출지수",
                count: 0,
                subTitle: "미발표 지수를 포함한 플랫폼에서 산출중인 지수",
                updateDate: "0"
            },
            boxItem3: {
                mode: '2',
                title: "프로젝트",
                count: 0,
                subTitle: "개발중인 지수",
                updateDate: "0"
            },
            boxItem4: {
                mode: '1',
                title: "조회요청",
                count: 0,
                subTitle: "지수상세정보 공개요청 건수",
                updateDate: "0"
            }
        };
    },
    components: {
        IndexSummaryCard: IndexSummaryCard,
        IndexSummaryBox: IndexSummaryBox,
        InfoOpenReq: InfoOpenReq,
        ConfirmDialog: ConfirmDialog
    },
    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
        this.getIndexSummaryInfo();
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
        getIndexSummaryInfo: function() {
            var vm = this;

            axios
                .post(Config.base_url + "/user/index/getIndexSummaryInfo", {
                    params: {}
                })
                .then(function(response) {
                    // console.log(response);
                    if (response.data.success == false) {
                        vm.$root.$confirm.open('', '지수정보가 없습니다.', {}, 1);
                    } else {
                        if(response.data.results1[0]) {
                            console.log(response.data.results1);
                            console.log(response.data.results1[0].F16002);

                            vm.cardItem1.name = response.data.results1[0].F16002;
                            vm.chartItem1.code = response.data.results1[0].F16013;

                            
                            //debugger;
                            vm.chartItem1.market_id = response.data.results1[0].market_id;

                            vm.cardItem1.subTitle =
                                response.data.results1[0].F16002;
                            vm.cardItem1.close_idx =
                                response.data.results1[0].F15001;
                            vm.cardItem1.fluc_idx =
                                response.data.results1[0].F15472;
                            vm.cardItem1.fluc_rate =
                                response.data.results1[0].F15004;
                        }

                        if(response.data.results2[0]) {
                            vm.cardItem2.name = response.data.results2[0].F16002;
                            vm.chartItem2.code = response.data.results2[0].F16013;
                            vm.chartItem2.market_id = response.data.results2[0].MARKET_ID;
                            vm.cardItem2.subTitle =
                                response.data.results2[0].F16002;
                            vm.cardItem2.close_idx =
                                response.data.results2[0].F15001;
                            vm.cardItem2.fluc_idx =
                                response.data.results2[0].F15472;
                            vm.cardItem2.fluc_rate =
                                response.data.results2[0].F15004;
                        }
                        
                        vm.$EventBus.$emit("getIndexSummaryHist", "loading");
                        
                    }
                });
        }
    }
};
</script>




