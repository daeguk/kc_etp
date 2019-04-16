<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>

                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            DBF Biotech Index |
                            <span class="grey--text">DBF134</span>
                            <p>기준일 :2018.10.20</p>
                            <!--오른쪽 메뉴 종목으로 찾기 검색 후 
                            <p class="text_result">
                                6 results
                            </p--->
                            <p class="sub_txt">Last Updated : 2019.3.20 09:40:20</p>
                        </h3>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="jongmokDataList"
                        :pagination.sync="pagination"

                        class="table_line1"
                    >
                        <template slot="items" slot-scope="props">
                            <td>{{ props.item.code }}</td>
                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="text-xs-right">{{ props.item.base_prc }}</td>
                            <td class="text-xs-right">{{ props.item.shrs }}</td>
                            <td class="text-xs-right">{{ props.item.float_rto }}</td>
                            <td class="text-xs-right">{{ props.item.ceilling_rto }}</td>
                            <td class="text-xs-right">{{ props.item.factor_rto }}</td>
                        </template>
                    </v-data-table>

                    <v-container>
                        <v-layout row class="content_margin">
                            <v-flex grow>
                                <v-card flat lite pb-0></v-card>
                            </v-flex>
                            <!--rightmenu---->
                            <v-card flat class="right_menu_w2">
                                <v-navigation-drawer
                                    v-model="drawer"
                                    :mini-variant="mini"
                                    app
                                    right
                                    light
                                    clipped
                                    mini-variant-width="50"
                                    width="250"
                                >
                                    <v-list class="pa-1">
                                        <v-list-tile v-if="mini">
                                            <v-list-tile-action>
                                                <v-btn icon @click.stop="mini = !mini">
                                                    <v-icon>chevron_left</v-icon>
                                                </v-btn>
                                            </v-list-tile-action>
                                        </v-list-tile>
                                        <v-list-tile avatar tag="div">
                                            <v-list-tile-content class="rightmenu_tit">Quick Start</v-list-tile-content>
                                            <v-list-tile-content>
                                                <v-btn icon @click.stop="mini = !mini">
                                                    <v-icon>chevron_right</v-icon>
                                                </v-btn>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>

                                    <v-list class="pt-0" dense>
                                        <v-list-tile-content class="rightmenu_con rightmenu_line">
                                            <v-subheader>
                                                <v-icon small color="primary">flash_on</v-icon>종목으로 찾기
                                            </v-subheader>
                                            <v-text-field
                                                v-model="form.jongmokSearch"
                                                append-icon="search"
                                                placeholder="e.g.005930, 삼성전자"
                                                value="e.g.005930, 삼성전자"
                                                outline
                                                hide-details
                                            ></v-text-field>
                                        </v-list-tile-content>
                                        <v-list-tile-content class="rightmenu_con ver2">
                                            <v-subheader>
                                                <v-icon small color="primary">feedback</v-icon>지수 조치 현황
                                                <v-dialog
                                                    v-model="dialog"
                                                    persistent
                                                    max-width="500"
                                                >
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn
                                                            small
                                                            depressed
                                                            outline
                                                            color="primary"
                                                            v-on="on"

                                                            @click="fn_openJisuJixPopup()"
                                                        >내역확인</v-btn>
                                                    </template>
                                                    <v-card flat>
                                                        <h5>
                                                            <v-card-title ma-0>
                                                                지수조치 현황(DBF 500 Index)
                                                                <v-spacer></v-spacer>
                                                                <v-btn
                                                                    icon
                                                                    dark
                                                                    @click="dialog = false"
                                                                >
                                                                    <v-icon>close</v-icon>
                                                                </v-btn>
                                                            </v-card-title>
                                                        </h5>
                                                        <div class="index3pop2_con">
                                                            <v-list subheader two-line>
                                                                <v-list-tile>
                                                                    <v-list-tile-title>조치 기준일</v-list-tile-title>
                                                                    <v-list-tile-content>2018.10.11</v-list-tile-content>
                                                                </v-list-tile>
                                                            </v-list>
                                                        </div>
                                                        <indexDetailrtmenupop  :fixData="fixData"></indexDetailrtmenupop>
                                                        <v-card class="pop_bot_h"></v-card>
                                                    </v-card>
                                                </v-dialog>
                                            </v-subheader>
                                            <p>
                                                <v-icon small color="primary">arrow_right</v-icon>기준시가 총액변동
                                            </p>
                                            <p>
                                                <v-icon small color="primary">arrow_right</v-icon>종목편출입
                                            </p>
                                            <p>
                                                <v-icon small color="primary">arrow_right</v-icon>종목비중조절
                                            </p>
                                        </v-list-tile-content>

                                        <v-list-tile-content class="rightmenu_con">
                                            <v-text-field
                                                v-model="form.jisuSearch"
                                                append-icon="search"
                                                placeholder="e.g.005930, 삼성전자"
                                                value="e.g.005930, 삼성전자"
                                                outline
                                                hide-details

                                                @keyup.enter ="fn_getIndexList()"
                                            ></v-text-field>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                            <v-layout row class="w100 pt-3">
                                                <v-flex xs12>
                                                    <v-card flat>
                                                        <v-list two-line subheader>

                                                            <v-list-tile
                                                                v-for="item in jisuDataList"
                                                                :key="item.f16002"
                                                                @click
                                                                class="right_menu_w3"
                                                            >
                                                                <v-list-tile-content
                                                                    class="rm_con_h"
                                                                >
                                                                    <v-list-tile-title>{{ item.f16002 }}</v-list-tile-title>
                                                                    <v-list-tile-sub-title>{{ item.f16013 }}</v-list-tile-sub-title>
                                                                </v-list-tile-content>

                                                                <v-list-tile-avatar>
                                                                    <v-icon class="lighten-1 white--text">feedback</v-icon>
                                                                </v-list-tile-avatar>
                                                            </v-list-tile>

                                                        </v-list>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                        </v-list-tile-content>
                                    </v-list>
                                </v-navigation-drawer>
                            </v-card>
                            <!--rightmenu end--->
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import Config from '@/js/config.js';
import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

export default {
    components: {
        indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            dialog: false,
            drawer: true,

            mini: false,
            right: null,



            headers: [
                {
                    text: "Code",
                    align: "left",
                    value: "code"
                },
                { text: "name", value: "name" },
                { text: "BasePrc", value: "base_prc", align: "right" },
                { text: "Shrs", value: "shrs", align: "right" },
                { text: "Float rto", value: "float_rto", align: "right" },
                { text: "Ceiling rto", value: "ceilling_rto", align: "right" },
                { text: "Factor rto", value: "factor_rto", align: "right" }
            ],
            pagination : {
                rowsPerPage : -1
            },
            jongmokDataList : [],


            jisuHeader: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            jisuDataList : [],      


            fixData : {},

            form: {
                    jisuSearch: ""
                ,   jongmokSearch: ""
            }
        };
    },
    mounted () {

        var vm = this;
        vm.fn_getIndexList();
    },
    created: function() {},
    beforeDestory: function() {},

    methods: {

        /*
         * 지수종목상세 정보를 조회한다. ( 지수관리 -> 지수종목상세 탭 클릭시 )
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexJongmokList : function() {

            var vm = this;

            axios.post(Config.base_url + "/user/index/getIndexJongmokList", {
                data: {
                    searchData : ""
                }
            }).then(response => {

                if (response && response.data) {
                    vm.jongmokDataList = response.data.dataList;
                }

            });

        },

        /*
         * 검색영역에 일치하는 지수정보를 조회한다. ( 지수관리 -> 지수종목상세 ->  quick 메뉴 -> 검색영역 )
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexList : function() {

            var vm = this;

            axios.post(Config.base_url + "/user/index/getIndexList", {
                data: {
                    searchData : vm.form.jisuSearch
                }
            }).then(response => {

                if (response && response.data) {
                    vm.jisuDataList = response.data.dataList;

                    if( vm.jisuDataList && vm.jisuDataList.length > 0 ) {
                        var rowData = vm.jisuDataList[0];
                        vm.fn_getIndexDetailList( rowData );
                    }
                }
            });

        },

        /*
         * 지수 목록에서 선택된 데이터를 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexDetailList : function( rowData ) {

            var vm = this;

            axios.post(Config.base_url + "/user/index/getIndexDetailList", {
                data: rowData
            }).then(response => {

                if (response && response.data) {

                }
            });
        },

        /*
         * 선택한 지수 조치내역을 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexFixList : function( rowData ) {

            var vm = this;

            axios.post(Config.base_url + "/user/index/getIndexFixList", {
                data: rowData
            }).then(response => {

                if (response && response.data) {

                }
            });
        },        

        /*
         * 지수 조회현황 팝업을 오픈한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_openJisuJixPopup : function() {

            var vm = this;

            vm.fixData = {};
            vm.dialog = true;
        },        
    }
};
</script>

