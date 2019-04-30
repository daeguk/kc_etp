<template>
    <v-container>
        <v-layout row class="content_margin">

            <v-flex grow>
                <v-card flat lite pb-0></v-card>
            </v-flex>

            <!-- rightmenu -->
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
                                @keyup.enter="fn_getIndexJongmokList()"
                            ></v-text-field>
                        </v-list-tile-content>

                        <v-list-tile-content class="rightmenu_con ver2">
                            <v-subheader>
                                <v-icon small color="primary">feedback</v-icon>지수 조치 현황
                                <v-dialog v-model="dialog" persistent max-width="500">
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
                                                지수조치 현황 ( {{ indexBasic.f16002 }} )
                                                <v-spacer></v-spacer>
                                                <v-btn icon dark @click="dialog = false">
                                                    <v-icon>close</v-icon>
                                                </v-btn>
                                            </v-card-title>
                                        </h5>

                                        <indexDetailrtmenupop :rowData="this.rowData" v-if="dialog"></indexDetailrtmenupop>
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
                                @keyup.enter="fn_getIndexList()"
                            ></v-text-field>

                            <!--오른쪽 메뉴 하단 리스트 영역 -->
                            <v-layout row class="w100 pt-3">
                                <v-flex xs12>
                                    <v-card flat>

                                        <table id="jisuTable" class="display" style="width:100%">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                </tr>
                                            </thead>  
                                        </table>      
<!--                              
                                        <v-list two-line subheader>

                                            <v-list-tile
                                                v-for="item in indexDataList"
                                                :key="item.f16002"
                                                @click.stop
                                                class="right_menu_w3"
                                            >
                                                <v-list-tile-content class="rm_con_h" @click="fn_getSelectedIndexList(item)">
                                                    <v-list-tile-title>{{ item.f16002 }}</v-list-tile-title>
                                                    <v-list-tile-sub-title>{{ item.f16013 }}</v-list-tile-sub-title>
                                                </v-list-tile-content>

                                                <v-list-tile-avatar>
                                                    <v-icon class="lighten-1 white--text">feedback</v-icon>
                                                </v-list-tile-avatar>
                                            </v-list-tile>

                                        </v-list>
-->                                        
                                    </v-card>
                                </v-flex>
                            </v-layout>
                            <!--오른쪽 메뉴 하단 리스트 영역 -->
                        </v-list-tile-content>
                    </v-list>
                </v-navigation-drawer>
            </v-card>
            <!--rightmenu end -->

        </v-layout>
    </v-container>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config from "@/js/config.js";
import indexDetailrtmenupop from "@/components/Home/Index/Manage/indexDetailrtmenupop.vue";


var jisuTable = null;
var currentFileName = null;

export default {
    props: [  ],
    data() {
        return {
            drawer: true,
            dialog: false,
            mini: false,

            jongmokDataList : [],


            jisuHeader: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            indexDataList : [],                 /* quick Menu 에서 지수목록 데이터 */

            indexBasic : {},                    /* 선택된 지수의 마스터 정보 */
            indexDetailList : [],               /* 선택된 지수의 상세 목록 */


            /* 지수 조치현황 정보 */
            indexFixData    :   {},             /* 지수조치 현황의 기본정보 */
            indexFixJongmokInoutList : [],      /* 지수조치 종목 편출입 정보 */
            indexFixModifyList      : [],       /* 지수채용 주식수 변경 정보 */
                    
            rowData : {},                       /* 지수목록에서 선택된 데이터 */
            form: {
                    jisuSearch: ""              /* quick Menu 에서 지수검색 데이터 */
                ,   jisuSearchYn : "Y"
                ,   jongmokSearch: ""           /* quick Menu 에서 종목검색 데이터 */
                ,   resultsCnt  : 0
            },
        };
    },
    components: {
        indexDetailrtmenupop: indexDetailrtmenupop
    },
    computed: {},
    mounted: function() {

        var vm = this;

        currentFileName =   document.URL.substring( document.URL.lastIndexOf("/") + 1, document.URL.lastIndexOf("/") + 30 );
        console.log( currentFileName + "." + "mounted" );

        /* 우측 quick 메뉴의 지수정보에서 첫번째 데이터를 조회하여 지수 및 상세정보를 조회한다. */
        vm.fn_getIndexListByFirst();


        vm.$nextTick().then(() => {

            jisuTable   =   $("#jisuTable").DataTable({
                processing: true,
                language: {
                    'loadingRecords': '&nbsp;',
                    'processing': 'Loading...'
                },
                serverSide: false,
                info: false, // control table information display field
                stateSave: false, //restore table state on page reload,
                lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                ordering: false,
                columnDefs: [
                    {
                        render: function(data, type, row) {
                            let htm =   "<span>";
                            htm     +=      "<b>" + data + "</b>";
                            htm     +=      "<br>" + row.f16013;
                            htm     +=  "</span>";
                            return htm;
                        },
                        targets: 0
                    }
                ],
                select: {

                },
                paging: false,
                searching: false,
                columns: [
                    { data: "f16002", orderable: false, width: "95%" },
                ]
            });

            // 테이블
            $("#jisuTable tbody").on("click", "td", function() {
                var table = $("#jisuTable").DataTable();
                var rowData = table.row( $(this).parents('tr') ).data();

                vm.form.jisuSearchYn    =   "Y";
                vm.fn_getIndexDetailList( rowData, vm.form );
            });


            /* 우측 quick 메뉴의 지수정보를 조회한다. */
            vm.fn_getIndexList();

        });

    },
    created: function() {},
    beforeDestroy() {},

    methods: {

        /*
         * 지수 목록에서 선택된 데이터를 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexDetailList : function( rowData, paramForm ) {

            var vm = this;

            console.log( currentFileName + "." + "fn_getIndexDetailList" );

            axios.post(Config.base_url + "/user/index/getIndexDetailList", {
                data:  rowData
            }).then(response => {

                if (response && response.data) {

                    var indexBasic = response.data.indexBasic;
                    if( indexBasic ) {
                        vm.indexBasic   =  indexBasic;
                    }

                    var indexDetailList =   response.data.indexDetailList;
                    vm.indexDetailList  =   indexDetailList;

                    vm.form.jisuSearchYn    =   "Y";
                    vm.form.resultsCnt      =   indexDetailList.length;
                    vm.$emit( "fn_getIndexDetailList", vm.indexBasic, vm.indexDetailList, vm.form );
                }
            });
        },        

        /*
         * 지수종목상세 정보를 조회한다. ( 지수관리 -> 지수종목상세 탭 클릭시 )
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexJongmokList : function() {

            var vm = this;

            console.log( currentFileName + "." + "fn_getIndexJongmokList" );

            if( vm.form.jongmokSearch.length < 2 ) {
                alert( "2자 이상 입력해 주세요.");
                return false;
            }

            axios.post(Config.base_url + "/user/index/getIndexJongmokList", {
                data: {
                    searchData : vm.form.jongmokSearch
                }
            }).then(response => {

                if (response && response.data) {
                    vm.jongmokDataList = response.data.dataList;

                    vm.form.jisuSearchYn =   "N";
                    vm.$emit( "fn_getIndexJongmokList", vm.jongmokDataList, vm.form );
                }
            });

        },

        /*
         * 우측 quick 메뉴의 지수정보에서 첫번째 데이터를 조회하여 지수 및 상세정보를 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexListByFirst : function() {

            var vm = this;

            console.log( CurrentFileName + "." + "fn_getIndexListByFirst" );

            axios.post(Config.base_url + "/user/index/getIndexList", {
                data: {
                    firstYn : 'Y'
                }
            }).then(response => {

                if (response && response.data) {
                    var indexDataList = response.data.dataList;
                    if( indexDataList && indexDataList.length == 1 ) {
                        vm.rowData = indexDataList[0];

                        vm.form.jisuSearchYn =   "Y";
                        vm.fn_getIndexDetailList( vm.rowData, vm.form );
                    }
                }
            });
        },

        /*
         * 우측 quick 메뉴의 지수정보를 조회한다. ( 지수관리 -> 지수종목상세 ->  quick 메뉴 -> 검색영역 )
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexList : function() {

            var vm = this;

            console.log( currentFileName + "." + "fn_getIndexList" );

            if( jisuTable ) {
                jisuTable.clear().draw();
            }

            axios.post(Config.base_url + "/user/index/getIndexList", {
                data: {
                    searchData : vm.form.jisuSearch
                }
            }).then(response => {

                if (response && response.data) {
                    vm.indexDataList = response.data.dataList;

                    jisuTable.clear().draw();
                    jisuTable.rows.add( vm.indexDataList ).draw();                    
                }
            });
        },

        /*
         * 지수 조회현황 팝업을 오픈한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_openJisuJixPopup : function() {

            var vm = this;

            vm.dialog = true;
        },

    }
};
</script>