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
                <v-card>
                <table style="border:1px solid #101010;">
                    <thead>
                        <th height="25px"><v-btn icon >arrow_upward</v-btn>목록</th>
                        <th><v-btn icon >arrow_downward</v-btn>목록목록</th>
                    </thead>
                    <tbody>
                        <td><v-btn small dark color="red"></v-btn></td>
                        <td><v-text-field
                                        value="DBF 바이오 테마 지수"
                                        outline
                                        
                                    ></v-text-field></td>
                        <td><v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            flat
                                            icon
                                            color="blue"
                                             dark v-on="on"
                                        >
                                            <v-icon>equalizer</v-icon>
                                        </v-btn>
                                    
                                    </template>
                                    <span>지수정보</span>
                                </v-tooltip>
                        </td>
                    </tbody>
                </table>
                </v-card>
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
           
            rowsPerPageItems: [500, 1000, 1500],
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
            loadingbar: false,
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
            this.loadingbar = true;
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
                    this.loadingbar = false;
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

