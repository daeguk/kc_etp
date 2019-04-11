<template>
    <v-container fluid grid-list-md pa-0 mb-4>
        <v-layout row wrap>
            <v-flex md6>
                <!--table1-->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Index Info</h4>
                    <v-data-table
                        :headers="headers"
                        :items="indexInfo"
                        disable-initial-sort
                        hide-actions
                        hide-headers
                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="text-xs-right">{{ props.item.value }}</td>
                        </template>
                    </v-data-table>
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
                                <v-card v-for="etp_item of etp_items" :key="etp_item.F16013">
                                   
                                    <v-card-title primary-title> 
                                    <div>
                                        <div class="headline">● KODEX DB 500 ETF(05320)</div>
                                    </div>
                                    </v-card-title>
                                    <v-slide-y-transition>
                                    <v-card-text>
                                        <span  style='text-align:left;left-margin:50px;'>추격배수</span><span style='align:right'>159</span>                     
                                    </v-card-text>
                                    </v-slide-y-transition>
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
import Config from '@/js/config.js';

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