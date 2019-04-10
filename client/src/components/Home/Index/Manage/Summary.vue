<template>
    <v-container class="summary_card_pad">
        <v-layout row wrap>
            <v-flex xs12>
                <v-tabs
                    slot="extension"
                    dark
                    color="#3158a1"
                    v-model="activeTab"
                    align-with-title
                    app
                    fixed
                    clipped-right
                >
                    <v-tabs-slider color="#ff821d"></v-tabs-slider>

                    <v-tab
                        v-for="tab of tabs"
                        :key="tab.id"
                        :to="tab.route"
                        v-on:click="setLeftControlBoxDraw(index)"
                    >{{ tab.name }}</v-tab>
                </v-tabs>

                <v-tabs-items v-model="activeTab">
                    <v-tab-item v-for="tab of tabs" :key="tab.id" :to="tab.route"></v-tab-item>
                </v-tabs-items>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-container>
                    <v-layout>
                        <v-flex xs4 ml-3 mt-3 mr-2>
                            <IndexSummaryCard :item="cardItem1" :chartItem="chartItem1"></IndexSummaryCard>
                        </v-flex>
                        <v-flex xs4 mt-3 mr-2>
                            <IndexSummaryCard :item="cardItem2" :chartItem="chartItem2"></IndexSummaryCard>
                        </v-flex>
                        <v-flex xs4 mt-3 mr-3>
                            <IndexSummaryCard :item="cardItem3" :chartItem="chartItem3"></IndexSummaryCard>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
        <v-layout row wrap mt-2 ml-3 mr-2>
            <v-flex md3>
                <IndexSummaryBox :item="boxItem1"></IndexSummaryBox>
            </v-flex>
            <v-flex md3>
                <IndexSummaryBox :item="boxItem2"></IndexSummaryBox>
            </v-flex>
            <v-flex md3>
                <IndexSummaryBox :item="boxItem3"></IndexSummaryBox>
            </v-flex>
            <v-flex md3>
                <IndexSummaryBox :item="boxItem4"></IndexSummaryBox>
            </v-flex>
        </v-layout>
        <v-layout row wrap ml-3 mt-2 mr-2 mb-3>
            <v-flex md12 >
                <InfoOpenReq></InfoOpenReq>
            </v-flex>
        </v-layout>
    </v-container>
</template>



<script>
import Config from "@/js/config.js";
import IndexSummaryCard from "./IndexSummaryCard.vue";
import IndexSummaryBox from "./IndexSummaryBox.vue";
import InfoOpenReq from "./InfoOpenReq.vue";

export default {
    props: [],
    data() {
        return {
            activeTab: "/index/manage/indexSummary",
            tabs: [
                { id: 1, name: "Summary", route: "/index/manage/indexSummary" },
                {
                    id: 2,
                    name: "관리지수목록",
                    route: "/index/manage/indexList"
                },
                {
                    id: 3,
                    name: "지수종목상세",
                    route: "/index/manage/indexDetail"
                }
            ],
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
                chartColor: "#B39DDB"
            },
            chartItem2: {
                chartId: "summaryChart2",
                width: "360",
                height: "150",
                marginW: 10,
                marginH: 20,
                code: "DBF002",
                chartColor: "#9FA8DA"
            },
            chartItem3: {
                chartId: "summaryChart3",
                width: "360",
                height: "150",
                marginW: 10,
                marginH: 20,
                code: "62801",
                chartColor: "#90CAF9"
            },
            boxItem1: {
                title: "발표지수",
                count: 120,
                subTitle: "회원사/벤더로 분배되는 지수",
                updateDate: "25/02/19"
            },
            boxItem2: {
                title: "산출지수",
                count: 156,
                subTitle: "미발표 지수를 포함한 플랫폼에서 산출중인 지수",
                updateDate: "25/02/19"
            },
            boxItem3: {
                title: "프로젝트",
                count: 7,
                subTitle: "개발중인 지수",
                updateDate: "25/02/19"
            },
            boxItem4: {
                title: "조회요청",
                count: 12,
                subTitle: "지수상세정보 공개요청 건수",
                updateDate: "25/02/19"
            }
        };
    },
    components: {
        IndexSummaryCard: IndexSummaryCard,
        IndexSummaryBox: IndexSummaryBox,
        InfoOpenReq: InfoOpenReq
    },
    mounted: function() {
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
                        alert("해당 신청현황이 없습니다");
                    } else {
                        console.log(response.data.results1);
                        console.log(response.data.results1[0].F16002);

                        vm.cardItem1.name = response.data.results1[0].F16002;
                        vm.chartItem1.code = response.data.results1[0].F16013;
                        vm.cardItem1.subTitle =
                            response.data.results1[0].F16002;
                        vm.cardItem1.close_idx =
                            response.data.results1[0].F15001;
                        vm.cardItem1.fluc_idx =
                            response.data.results1[0].F15472;
                        vm.cardItem1.fluc_rate =
                            response.data.results1[0].F15004;

                        vm.cardItem2.name = response.data.results2[0].F16002;
                        vm.chartItem2.code = response.data.results2[0].F16013;
                        vm.cardItem2.subTitle =
                            response.data.results2[0].F16002;
                        vm.cardItem2.close_idx =
                            response.data.results2[0].F15001;
                        vm.cardItem2.fluc_idx =
                            response.data.results2[0].F15472;
                        vm.cardItem2.fluc_rate =
                            response.data.results2[0].F15004;

                        vm.$EventBus.$emit("getIndexSummaryHist", "loading");
                    }
                });
        }
    }
};
</script>




