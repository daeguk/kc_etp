<template>
    <v-container>
        <v-layout row xs12>

            <v-flex grow>
                <v-card flat lite pb-0></v-card>
            </v-flex>

            <!-- rightmenu -->
            <v-card flat class="right_menu_w2 ver3">
                    <v-list class="pt-0" dense>
                        <v-list-tile-content class="rightmenu_con">
                            <v-subheader>종목으로 찾기</v-subheader>
                            <v-text-field
                                v-model="form.jongmokSearch"
                                append-icon="search"
                                placeholder="e.g.005930, 삼성전자"
                                value="e.g.005930, 삼성전자"
                                 single-line
                                class="w100 pt-0"
                                @keyup.enter="fn_getIndexJongmokList()"
                            ></v-text-field>
                        </v-list-tile-content>


                        <v-list-tile-content class="rightmenu_con mb-2">
                            <v-subheader>
                                지수 조치 현황
                                <v-btn
                                    small
                                    depressed
                                    outline
                                    color="primary"
                                    v-on="on"
                                    @click="fn_openJisuJixPopup()"
                                    :disabled = "fix_info.fix_disabled"
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
                            
                            <!--p class="text_red">
                                <v-icon small>arrow_right</v-icon>{{ fix_info.fix_msg }}
                            </p-->
                        </v-list-tile-content>

                        <v-list-tile-content class="rightmenu_con">
                            <v-text-field
                                v-model="form.jisuSearch"
                                append-icon="search"
                                placeholder="e.g.005930, 삼성전자"
                                value="e.g.005930, 삼성전자"
                                single-line
                                class="w100"
                                v-on:keyup="fn_filterAllData()"
                            ></v-text-field>
                        </v-list-tile-content>
                         <!--오른쪽 메뉴 하단 리스트 영역 -->
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
                                        </table> 
                                        <!---ppt09버전 수정 테이블--->
                                        <!--table id="jisuTable" class="tbl_type ver2">
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
                                        </table--> 
                                      <!---ppt09버전 수정 테이블--->

                            <!--오른쪽 메뉴 하단 리스트 영역 -->
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
import util       from "@/js/util.js";

var jisuTable = null;

export default {
    props: [  ],
    data() {
        return {
            drawer: true,
            mini: false,
            on : false,

            indexBasic : {},                    /* 선택된 지수의 마스터 정보 */
            indexDataList : [],

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

            /* 지수 조치현황 */
            fix_info : {
                fix_disabled : true,
                fix_msg : "조치현황 없음"
            }            
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
                scrollY: '58vh',
                columnDefs: [
                    {  
                        "render": function ( data, type, row ) {
                            let htm = "<div class='td_ellipsis2'>";
                            htm += "           "+data+"";
                            htm += "            <br><span class='text_S'>"+row.F16013+"</div>";
                            return htm;
                        },
                        "targets": 0
                    },
                    {  
                        "render": function ( data, type, row ) {
                            let htm = ""
                                
                                htm += "<div>" + util.formatNumber(data) + "</div>";

                                if (row.F15004 >= 0) {
                                    htm += "<span class='text_S text_red'>"+row.F15004+"%</span>";
                                } else {
                                    htm += "<span class='text_S text_blue'>"+row.F15004+"%</span>";
                                }

                                return htm;
                                },
                        "targets": 1
                    },
                ],
                select: {

                },
                paging: false,
                searching: false,
                columns: [
                    { data: "F16002", orderable: false, className:"txt_left line2 in_icon"},
                    { "data": "F15001", "orderable": false, className:'txt_right'},            
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
            
            vm.$root.progresst.open();

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/index/getIndexDetailList"
                        ,   "data"      :   rowData
                        ,   "method"    :   "post"
                    }
                ,   function(response) {

                        try{

                            if (response && response.data) {

                                var indexBasic = response.data.indexBasic;
                                if( indexBasic ) {
                                    vm.indexBasic   =  indexBasic;
                                }

                                var indexDetailList =   response.data.indexDetailList;

                                vm.form.jisuSearchYn    =   "Y";
                                vm.$emit( "fn_getIndexDetailList", vm.indexBasic, indexDetailList, vm.form );
                            }
                            vm.$root.progresst.close();

                        }catch(ex) {
                            vm.$root.progresst.close();
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.$root.progresst.close();
                        if( error ) {
                            vm.$root.confirmt.open('확인',error,{},4);
                        }
                    }
            );

        },        


        /*
         * 지수종목상세 정보를 조회한다. ( 지수관리 -> 지수종목상세 탭 클릭시 )
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexJongmokList : function() {

            var vm = this;
            
            // console.log( "ComIndexJongmok.vue -> fn_getIndexJongmokList" );

            if( vm.form.jongmokSearch.length < 2 ) {
                vm.$root.confirmt.open('확인', "2자 이상 입력해 주세요.",{},1);
                return false;
            }

            vm.$root.progresst.open();

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/index/getIndexJongmokList"
                        ,   "data"      :   {
                                searchData : vm.form.jongmokSearch
                            }
                        ,   "method"    :   "post"
                    }
                ,   function(response) {

                        try{

                            vm.$root.progresst.close();
                            if (response && response.data) {
                                var jongmokDataList = response.data.dataList;

                                var msg = ( response.data.msg ? response.data.msg : "" );
                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.$root.confirmt.open('확인', msg,{},1);
                                        return  false;
                                    }
                                }

                                vm.form.jisuSearchYn =   "N";
                                vm.$emit( "fn_getIndexJongmokList", jongmokDataList, vm.form );
                            }

                        }catch(ex) {
                            vm.$root.progresst.close();
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.$root.progresst.close();
                        if( error ) {
                            vm.$root.confirmt.open('확인',error,{},4);
                        }
                    }
            );
            
        },


        /*
         * 우측 quick 메뉴의 지수정보에서 첫번째 데이터를 조회하여 지수 및 상세정보를 조회한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexListByFirst : function() {

            var vm = this;
            // console.log( "ComIndexJongmok.vue -> fn_getIndexListByFirst" );
            vm.$root.progresst.open();
            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/index/getIndexList"
                        ,   "data"      :   {
                                firstYn : 'Y'
                            }
                        ,   "method"    :   "post"
                    }
                ,   function(response) {

                        try{

                            vm.$root.progresst.close();
                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );
                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.$root.confirmt.open('확인', msg,{},1);
                                        return  false;
                                    }
                                }

                                var indexDataList = response.data.dataList;
                                if( indexDataList && indexDataList.length == 1 ) {
                                    var rowData = indexDataList[0];

                                    vm.form.jisuSearchYn =   "Y";
                                    vm.fn_getIndexDetailList( rowData, vm.form );
                                }
                            }

                        }catch(ex) {
                            vm.$root.progresst.close();
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.$root.progresst.close();
                        if( error ) {
                            vm.$root.confirmt.open('확인',error,{},4);
                        }
                    }
            );
            
        },


        /*
         * 우측 quick 메뉴의 지수정보를 조회한다. ( 지수관리 -> 지수종목상세 ->  quick 메뉴 -> 검색영역 )
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getIndexList : function() {

            var vm = this;
           
            // console.log( "ComIndexJongmok.vue -> fn_getIndexList" );

            if( jisuTable ) {
                jisuTable.clear().draw();
            }

            vm.$root.progresst.open();

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/index/getIndexList"
                        ,   "data"      :   {
                                searchData : vm.form.jisuSearch
                            }
                        ,   "method"    :   "post"
                    }
                ,   function(response) {

                        try{

                            vm.$root.progresst.close();
                            if (response && response.data) {

                                var msg = ( response.data.msg ? response.data.msg : "" );
                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.$root.confirmt.open('확인', msg,{},1);
                                        return  false;
                                    }
                                }

                                vm.indexDataList = response.data.dataList;

                                jisuTable.clear().draw();
                                jisuTable.rows.add( vm.indexDataList ).draw();                    
                            }

                        }catch(ex) {
                            vm.$root.progresst.close();
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.$root.progresst.close();
                        if( error ) {
                            vm.$root.confirmt.open('확인',error,{},4);
                        }
                    }
            );
           
        },


        /*
         * 지수 조회현황 팝업을 오픈한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_openJisuJixPopup : function() {

            var vm = this;

            vm.indexFixDialog = true;
        },

        
        fn_filterAllData: function() {
            var vm = this;

            vm.form.jisuSearch = vm.form.jisuSearch.toUpperCase();

            /* 이벤트 delay이로 부하 줄임 */
            var delay = (function(){
                var timer = 0;
                return function(callback, ms){
                    clearTimeout (timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            delay(function(){

                var filterData = _.filter( vm.indexDataList, function(o) { 

                    var nmIdx = o.F16002 ? o.F16002.toUpperCase().indexOf(vm.form.jisuSearch) : -1;       /* 한글종목명 */
                    var cdIdx = o.F16013 ? o.F16013.toUpperCase().indexOf(vm.form.jisuSearch) : -1;       /* 단축코드 */

                    if (nmIdx > -1 || cdIdx > -1) {
                        return true; 
                    } else {
                        return false;
                    }
                });

                jisuTable.clear().draw();
                jisuTable.rows.add(filterData).draw();       

            }, 1000 );
        },        

    }
};
</script>