<template>
    <v-container>
        <v-layout row>

            <v-flex grow>
                <v-card flat lite pb-0></v-card>
            </v-flex>

            <!-- rightmenu -->
            <v-card flat class="right_menu_w2">
                    <v-list class="pt-0" dense>
                        <v-list-tile-content class="rightmenu_con">
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

                                <v-btn
                                    small
                                    depressed
                                    outline
                                    color="primary"
                                    v-on="on"
                                    @click="fn_openJisuJixPopup()"
                                >내역확인</v-btn>

                                <v-card flat>
                                    <ComIndexFixPopup   v-if="indexFixDialog"

                                                        :indexBasic="this.indexBasic" 
                                                        :indexFixDialog="this.indexFixDialog" 
                                                        
                                                        @fn_closePop="fn_closePop" >
                                    </ComIndexFixPopup>
                                    <v-card class="pop_bot_h"></v-card>
                                </v-card>
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
                            <v-layout row class="w100 pt-3 pr-2">
                                <v-flex xs12>
                                    <v-card flat>

                                        <table id="jisuTable" class="tbl_type ver2">
                                            <thead>
                                                <tr>
                                                    <th class="txt_left">지수명</th>
                                                </tr>
                                            </thead>  
                                        </table> 
                                        <!---ppt09버전 수정 테이블--->
                                        <table id="jisuTable" class="tbl_type ver2">
                                            <colgroup>
                                                <col width="70%">
                                                <col width="30%">
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th class="txt_left">지수명</th>
                                                    <th class="txt_right">현재가</th>
                                                </tr>
                                            </thead> 
                                            <tbody>
                                                <tr>
                                                       <td class="txt_left line2 in_icon">
                                                           <div>
                                                             KODEX 200fds
                                                             <br><span class="text_S">000100</span>
                                                            </div>
                                                            <div class="in_icon_r">
                                                                <span class="btn_icon v-icon material-icons text_red">feedback</span>
                                                            </div>
                                                        </td>
                                                        <td class="txt_right">1234.56<br><span class='text_blue text_S'>-2.5</span></td>
                                                </tr>
                                            </tbody> 
                                        </table> 
                                      <!---ppt09버전 수정 테이블--->
                                    </v-card>
                                </v-flex>
                            </v-layout>
                            <!--오른쪽 메뉴 하단 리스트 영역 -->
                        </v-list-tile-content>
                    </v-list>
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
import ComIndexFixPopup from "@/components/common/popup/ComIndexFixPopup.vue";


var jisuTable = null;

export default {
    props: [  ],
    data() {
        return {
            drawer: true,
            mini: false,
            on : false,

            indexBasic : {},                    /* 선택된 지수의 마스터 정보 */

            /* 지수 조치현황 정보 */
            indexFixDialog : false,
            indexFixData    :   {},             /* 지수조치 현황의 기본정보 */
            indexFixJongmokInoutList : [],      /* 지수조치 종목 편출입 정보 */
            indexFixModifyList      : [],       /* 지수채용 주식수 변경 정보 */

            form: {
                    jisuSearch: ""              /* quick Menu 에서 지수검색 데이터 */
                ,   jisuSearchYn : "Y"
                ,   jongmokSearch: ""           /* quick Menu 에서 종목검색 데이터 */
            },
        };
    },
    components: {
        ComIndexFixPopup: ComIndexFixPopup
    },
    computed: {},
    mounted: function() {

        var vm = this;

        console.log( "ComIndexJongmok.vue -> mounted" );

        vm.$nextTick().then(() => {

            /* 우측 quick 메뉴의 지수정보에서 첫번째 데이터를 조회하여 지수 및 상세정보를 조회한다. */
            vm.fn_getIndexListByFirst();


            /* 지수 테이블 초기 설정 */
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
                    { data: "f16002", orderable: false, className:"txt_left"},
                ]
            });


            // 지수에서 행 선택시
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
         * 지수조치현황 팝업창을 종료한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_closePop( param )  {
            var vm = this;

            vm.indexFixDialog = false;
        },

        /*
         * 지수 목록에서 선택된 데이터를 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexDetailList : function( rowData, paramForm ) {

            var vm = this;

            console.log( "ComIndexJongmok.vue -> fn_getIndexDetailList" );
            

            axios.post(Config.base_url + "/user/index/getIndexDetailList", {
                data:  rowData
            }).then(response => {

                if (response && response.data) {

                    var indexBasic = response.data.indexBasic;
                    if( indexBasic ) {
                        vm.indexBasic   =  indexBasic;
                    }

                    var indexDetailList =   response.data.indexDetailList;

                    vm.form.jisuSearchYn    =   "Y";
                    vm.$emit( "fn_getIndexDetailList", vm.indexBasic, indexDetailList, vm.form );
                }
            });
        },        


        /*
         * 지수종목상세 정보를 조회한다. ( 지수관리 -> 지수종목상세 탭 클릭시 )
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexJongmokList : function() {

            var vm = this;

            console.log( "ComIndexJongmok.vue -> fn_getIndexJongmokList" );

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
                    var jongmokDataList = response.data.dataList;

                    vm.form.jisuSearchYn =   "N";
                    vm.$emit( "fn_getIndexJongmokList", jongmokDataList, vm.form );
                }
            });

        },


        /*
         * 우측 quick 메뉴의 지수정보에서 첫번째 데이터를 조회하여 지수 및 상세정보를 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexListByFirst : function() {

            var vm = this;

            console.log( "ComIndexJongmok.vue -> fn_getIndexListByFirst" );

            axios.post(Config.base_url + "/user/index/getIndexList", {
                data: {
                    firstYn : 'Y'
                }
            }).then(response => {

                if (response && response.data) {
                    var indexDataList = response.data.dataList;
                    if( indexDataList && indexDataList.length == 1 ) {
                        var rowData = indexDataList[0];

                        vm.form.jisuSearchYn =   "Y";
                        vm.fn_getIndexDetailList( rowData, vm.form );
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

            console.log( "ComIndexJongmok.vue -> fn_getIndexList" );

            if( jisuTable ) {
                jisuTable.clear().draw();
            }

            axios.post(Config.base_url + "/user/index/getIndexList", {
                data: {
                    searchData : vm.form.jisuSearch
                }
            }).then(response => {

                if (response && response.data) {
                    var indexDataList = response.data.dataList;

                    jisuTable.clear().draw();
                    jisuTable.rows.add( indexDataList ).draw();                    
                }
            });
        },


        /*
         * 지수 조회현황 팝업을 오픈한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_openJisuJixPopup : function() {

            var vm = this;

            vm.indexFixDialog = true;
        },

    }
};
</script>