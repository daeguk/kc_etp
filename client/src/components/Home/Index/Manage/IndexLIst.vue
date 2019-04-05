<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">
                                Index List |
                                <span class="grey--text">total {{list_cnt}} index</span>
                            </h3>
                        </div>
                    </v-card-title>
                </v-card>
                <v-data-table :headers="headers" :items="results" :rows-per-page-items="rowsPerPageItems" class="table_line1">
                    <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.JISU_CD }}</td>
                        <td class="text-xs-center">{{ props.item.JISU_NM }}</td>
                        <td class="text-xs-center">{{ props.item.IP_DT }}</td> 
                        <td class="text-xs-center">{{ props.item.ANNO_YN }}</td>
                        <td class="text-xs-center">{{ props.item.INDEX_CAL_METHOD }}</td>
                        <td class="text-xs-left"><p v-html="getReplace(props.item.ETP_NM)"></v-html></p></td>
                        <td class="text-xs-center">{{ props.item.INST_CNT }}</td>
                        <td class="text-xs-center">
                            <v-flex xs12 sm3 center> 
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            flat
                                            icon
                                            color="blue"
                                            to="/index/manage/IndexListdetail"
                                             dark v-on="on"
                                        >
                                            <v-icon>equalizer</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>지수정보</span>
                                </v-tooltip>
                            </v-flex>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Config from '@/js/config.js'
export default {
    props: [],

    data() {
        return {
            rowsPerPageItems: [500, 1000],
            headers: [
                {
                    text: "ID",
                    align: "left",
                    sortable: false,
                    value: "JISU_CD"
                },
                { text: "지수명", value: "JISU_NM", align: "left"},
                { text: "요청일", value: "IP_DT" },
                { text: "발표여부", value: "ANNO_YN" },
                { text: "산출타입", value: "INDEX_CAL_METHOD" },
                { text: "ETP", value: "ETP_NM" },
                { text: "정보조회기관", value: "INST_CNT" },
                { text: "", value: "iron" }
            ],

            results: [],
            list_cnt: 0
        };
    },
    components: {},
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        this.getInfoIndexList();
    },
    methods: {
        getInfoIndexList: function() {
            console.log("getInfoIndexList");

            axios.get(Config.base_url + "/user/index/getInfoIndexList", {
                    params: {
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("관리지수 목록이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.results = items;
                        this.list_cnt = this.results.length;
                    }
                });
        }, 
        getReplace: function(text) {
            if (text) {
                return text.replace(/,/gi,"</br>");
            }
        }
    }
};
</script>
<style scoped>
</style>

