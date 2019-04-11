<template>
    <v-container fluid grid-list-md pa-2 mb-4>
        <v-layout row wrap class="indexlist_ww">
            <v-flex md6>
                <!--table1-->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">INDEX Info</h4>
                    <v-card flat class="indexinfo_list_table">
                        <v-layout row>
                            <v-flex xs6>기준지수</v-flex>
                            <v-flex xs6 class="text_r">1000</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>기준일</v-flex>
                            <v-flex xs6 class="text_r">2010.01.02</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>발표일</v-flex>
                            <v-flex xs6 class="text_r">2015.07.22</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>지수산출방식</v-flex>
                            <v-flex xs6 class="text_r">시가총액방식</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>기준시가총액</v-flex>
                            <v-flex xs6 class="text_r">325455545541521</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>비교시가총액</v-flex>
                            <v-flex xs6 class="text_r">22257777777777777777</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>고정현금</v-flex>
                            <v-flex xs6 class="text_r">0</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>유동비율적용여부</v-flex>
                            <v-flex xs6 class="text_r">N</v-flex>
                        </v-layout>
                    </v-card>
                </div>
                <!--table1 end--->
            </v-flex>
            <v-flex md6>
                <!---table2--->
                <v-container fluid grid-list-md pa-0 mb-4>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <!---table2_1--->
                            <div class="indexinfo_box02 a1">
                                <h4 class="mb-0">ETP Info</h4>
                                <v-card flat class="indexinfo_list_table">
                                    <v-card-title>● KODEX DB 500 ETF(05320)</v-card-title>
                                    <v-layout row>
                                        <v-flex xs6>추격배수</v-flex>
                                        <v-flex xs6 class="text_r">159</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>시가총액</v-flex>
                                        <v-flex xs6 class="text_r">24552</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>최종NAV</v-flex>
                                        <v-flex xs6 class="text_r">14242</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>추적오차율</v-flex>
                                        <v-flex xs6 class="text_r">2424242</v-flex>
                                    </v-layout>
                                </v-card>
                            </div>
                        </v-flex>
                        <v-flex xs12>
                            <!---table2_2--->
                            <div class="indexinfo_box02 a2">
                                <v-card flat class="indexinfo_list_table">
                                    <v-card-title>● KODEX DB 500 ETF(05320)</v-card-title>
                                    <v-layout row>
                                        <v-flex xs6>추격배수</v-flex>
                                        <v-flex xs6 class="text_r">159</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>시가총액</v-flex>
                                        <v-flex xs6 class="text_r">24552</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>최종NAV</v-flex>
                                        <v-flex xs6 class="text_r">14242</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>추적오차율</v-flex>
                                        <v-flex xs6 class="text_r">2424242</v-flex>
                                    </v-layout>
                                </v-card>
                            </div>
                        </v-flex>
                        <v-flex xs12>
                            <!---table2_3--->
                            <div class="indexinfo_box02 a3">
                                <v-card flat class="indexinfo_list_table">
                                    <v-card-title>● KODEX DB 500 ETF(05320)</v-card-title>
                                    <v-layout row>
                                        <v-flex xs6>추격배수</v-flex>
                                        <v-flex xs6 class="text_r">159</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>시가총액</v-flex>
                                        <v-flex xs6 class="text_r">24552</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>최종NAV</v-flex>
                                        <v-flex xs6 class="text_r">14242</v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs6>추적오차율</v-flex>
                                        <v-flex xs6 class="text_r">2424242</v-flex>
                                    </v-layout>
                                </v-card>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
                <!---table2 end--->
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
export default {
    props: [""],
    data() {
        return {
            index_item: {},
            rowsPerPageItems: [50, 50],
            headers: [
                { text: "ID", align: "center", sortable: false, value: "id" },
                {
                    text: "지수명",
                    align: "center",
                    sortable: false,
                    value: "inst_name"
                }
            ],
            indexInfo: [
             /*   {
                    name: "기준지수",
                    value: index_item.STD_INDEX
                },
                {
                    name: "기준일",
                    value: index_item.STD_DATE
                },
                {
                    name: "발표일",
                    value: index_item.ANNO_DATE
                },
                {
                    name: "지수산출방식",
                    value: index_item.INDEX_CAL_METHOD
                },
                {
                    name: "기준시가총액",
                    value: index_item.STD_CAPITAL
                },
                {
                    name: "비교시가총액",
                    value: index_item.STD_CAPITAL
                },
                {
                    name: "고정현금",
                    value: index_item.FIXED_CASH
                },
                {
                    name: "유동비율적용여부",
                    value: index_item.FLOWRATE_YN
                }*/
            ],
            etp_items : [],
        };
    },
    computed: {

    },
    created: function() {

    },
    beforeDestroy() {

    },
    mounted: function() {
        this.getIndexBaseInfo();
        this.getIndexInEtpInfo();
    },
    methods: {
        getIndexBaseInfo: function() {
            var vm = this;
            console.log("getIndexBaseInfo");
            
            axios.get(Config.base_url + "/user/index/getIndexBaseInfo", {
                    params: {
                        jisu_cd : vm.$route.query.jisu_cd,
                        market_id : vm.$route.query.market_id
                        
                    }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    alert("지수정보가 없습니다.");
                } else {
                    var items = response.data.results;
                    vm.index_item = items[0];
                    console.log("response=" + JSON.stringify(vm.index_item));
                    //this.list_cnt = this.results.length;
                }
            });

        },   
        getIndexInEtpInfo: function() {
            var vm = this;

            axios.get(Config.base_url + "/user/index/getIndexInEtpInfo", {
                    params: {
                        jisu_cd : vm.$route.query.jisu_cd,
                        market_id : vm.$route.query.market_id
                        
                    }
            }).then(response => { 
                // console.log(response);
                if (response.data.success == false) {
                    alert("지수정보가 없습니다.1");
                } else {
                    var items = response.data.results;
                    vm.etp_items = items;
                    console.log("etp_response=" + JSON.stringify(vm.etp_items));
                    //this.list_cnt = this.results.length;
                }
            });
        },    
    }
};
</script>