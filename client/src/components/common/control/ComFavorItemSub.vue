<template>
    <v-container>
        <v-list class="pt-0" dense>
            <v-list-tile-content class="rightmenu_con2 rightmenu_line">
                <v-layout class="w100">
                    <v-flex xs12>
                                <v-card>
                                    <v-card-title class="con_r_ta_serch">
                                            <v-text-field v-model="search" v-on:keyup="filterData(1)" append-icon="search" label="Search" single-line hide-details></v-text-field>
                                            <button type='button' id='btn_idx_faver' v-on:click="filterData(2)" :class='faverClass'>star</button>
                                    </v-card-title>    
                                </v-card>

                                <v-tabs v-model="activeTab" centered grow>
                                    <v-tabs-slider></v-tabs-slider>

                                    <v-tab v-for="item in kindTabs" :key="item">{{ item }}</v-tab>
                                </v-tabs>
                                
                                <v-tabs-items v-model="activeTab">
                                <v-tab-item>
                                    <!-- etf 리스트 영역 -->
                                    <v-layout row >
                                        
                                        <v-flex xs12>
                                            <v-card flat>
                                               
                                                <table id="etf_table" class="tbl_type ver2" style="width:100%">
                                                    <colgroup>
                                                        <col width="3%">
                                                        <col width="70%">
                                                        <col width="27%">
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>종목명</th>
                                                            <th>현재가</th>
                                                        </tr>
                                                    </thead>  
                                                </table>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-tab-item>
                                <v-tab-item>
                                    <!--ETN 리스트 영역 -->
                                    <v-layout row>
                                        <v-flex xs12>
                                            <v-card flat>
                                               
                                                <table id="etn_table" class="tbl_type ver2" style="width:100%">
                                                    <colgroup>
                                                        <col width="3%">
                                                        <col width="70%">
                                                        <col width="27%">
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                           
                                                            <th></th>
                                                            <th>종목명</th>
                                                            <th>현재가</th>
                                                        </tr>
                                                    </thead>  
                                                </table>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-tab-item>
                                <v-tab-item>
                                    <!--INDEX 리스트 영역 -->
                                    <v-layout row >
                                        <v-flex xs12>
                                            <v-card flat>
                                                
                                                <table id="index_table" class="tbl_type ver2" style="width:100%">
                                                    <colgroup>
                                                        <col width="3%">
                                                        <col width="70%">
                                                        <col width="27%">
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>종목명</th>
                                                            <th>현재가</th>
                                                        </tr>
                                                    </thead>  
                                                </table>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>                                                 
                                </v-tab-item>
                                </v-tabs-items>
                                
                    </v-flex>
                </v-layout>
                <!---자산추가 팝업 -->

                <!--자산추가 팝업 end -->
            </v-list-tile-content>
            <ProgressBar ref="progress"></ProgressBar>
        </v-list>

    </v-container>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config from "@/js/config.js";
import util       from "@/js/util.js";
import ProgressBar from "@/components/common/ProgressBar.vue";

var etf_table = null;
var etn_table = null;
var index_table = null;

export default {
    props: [],
    data() {
        return {
            jongMokDialog: false,
            right: null,
            tab: null,
            kindTab : null, 
            activeTab: 0, 
            kindTabs: ["ETF", "ETN", "INDEX"],
            drawer: null,
            favorItems: [],
            etnList: [],
            etfList: [],
            indexList: [],

            options: {
                color: 'primary',
                width: '80%',
                zIndex: 200
            },
            paramData : {},
            search: '',
            showIndexDetailDialog : false,
            showEtpDetailDialog : false,            
            faverClass: 'btn_icon_star v-icon material-icons',
        };
    },
    components: {
        ProgressBar : ProgressBar
    },
    computed: {
        
    },
    mounted: function() {
        var vm = this;


    /* [전체종목 -> ETF] 테이블 */
        etf_table = $('#etf_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            "scrollY":        '125vh',
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        if (data == '1') {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star on v-icon material-icons'>star</button>";
                        } else {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star v-icon material-icons'>star</button>";
                        }
                        
                        return htm;
                    },
                    "targets": 0
                },
                 {  
                    "render": function ( data, type, row ) {
                        let htm = "<div class='td_ellipsis'>";
                        htm += "           "+data+"";
                        htm += "            <br><span class='text_S'>"+row.F16013+"</div>";
                        return htm;
                    },
                    "targets": 1
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
                    "targets": 2
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "faver", "orderable": false, width:'5%', defaultContent:""},    
                { "data": "JISU_NM", "orderable": false, className:'txt_left line2 in_icon'},                
                { "data": "F15001", "orderable": false, className:'txt_right'},            
            ]
        });

        //  ETF 에서 관심종목 클릭시
        $('#etf_table tbody').on('click', 'button', function () {
            var table = $('#etf_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_faver') {
                console.log(data.faver_seq);
                    //data.faver =  data.faver == '1' ? '0' : '1';

                if (data.faver == '1') {
                    data.faver = "0";
                    data.GUBUN= "1";
                    $(this).attr("class", "btn_icon_star v-icon material-icons");
                    vm.deleteItem(data, 'etf');
                } else {
                    data.faver = "1";
                    $(this).attr("class", "btn_icon_star on v-icon material-icons");
                    vm.setSelectedItem(data, '1', 'etf');
                }                  
            }            
        });

        //  ETF 에서 그래프 선택시
        $('#etf_table tbody').on('click', 'td', function () {
            var table = $('#etf_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).index() == 1) {
                data.GUBUN= "1";
                vm.fn_detailPop( data );
            }
        });


    /* [전체종목 -> ETN] 테이블 */
        etn_table = $('#etn_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            "scrollY":        '125vh',
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        if (data == '1') {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star on v-icon material-icons'>star</button>";
                        } else {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star v-icon material-icons'>star</button>";
                        }
                        
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<div class='td_ellipsis'>";
                        htm += "           "+data+"";
                        htm += "            <br><span class='text_S'>"+row.F16013+"</div>";
                        return htm;
                    },
                    "targets": 1
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
                    "targets": 2
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "faver", "orderable": false, width:'5%', defaultContent:""},
                { "data": "JISU_NM", "orderable": false, className:'txt_left line2 in_icon'},                
                { "data": "F15001", "orderable": false, className:'txt_right'},                
            ]
        });

        //  ETN 에서 관심종목 클릭시
        $('#etn_table tbody').on('click', 'button', function () {
            var table = $('#etn_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_faver') {
                console.log(data.faver_seq);
                //data.faver =  data.faver == '1' ? '0' : '1';

                if (data.faver == '1') {
                    data.faver = "0";
                    data.GUBUN= "1";
                    $(this).attr("class", "btn_icon_star v-icon material-icons");
                    vm.deleteItem(data, 'etn');
                } else {
                    data.faver = "1";
                    $(this).attr("class", "btn_icon_star on v-icon material-icons");
                    vm.setSelectedItem(data, '1', 'etn');
                }
            }
           
        });

        //  ETN 에서 그래프 선택시
        $('#etn_table tbody').on('click', 'td', function () {
            var table = $('#etn_table').DataTable();
            var data = table.row($(this).parents('tr')).data();
           
            if ($(this).index() == 1) {
                data.GUBUN= "1";
                vm.fn_detailPop( data );
            }
           
        });


    /* [전체종목 -> INDEX] 테이블 */
        index_table = $('#index_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            "scrollY":        '125vh',
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        if (data == '1') {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star on v-icon material-icons'>star</button>";
                        } else {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star v-icon material-icons'>star</button>";
                        }
                        
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<div class='td_ellipsis'>";
                        htm += "           "+data+"";
                        htm += "            <br><span class='text_S'>"+row.F16013+"</div>";
                        return htm;
                    },
                    "targets": 1
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
                    "targets": 2
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "faver", "orderable": false, width:'5%', defaultContent:""},
                { "data": "JISU_NM", "orderable": false, className:'txt_left line2 in_icon'},                
                { "data": "F15001", "orderable": false, className:'txt_right'},                
            ]
        });

        //  INDEX 에서 그래프 선택시
        $('#index_table tbody').on('click', 'button', function () {
            var table = $('#index_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_faver') {
                console.log(data.faver_seq);
                //data.faver =  data.faver == '1' ? '0' : '1';

                if (data.faver == '1') {
                    data.faver = "0";
                    data.GUBUN= "2";
                    $(this).attr("class", "btn_icon_star v-icon material-icons");
                    vm.deleteItem(data, 'index');
                } else {
                    data.faver = "1";
                    $(this).attr("class", "btn_icon_star on v-icon material-icons");
                    vm.setSelectedItem(data, '2', 'index');
                }
                //$(this).html("star_border");
                //etf_table.rows.add(etf_table.rows().data()).draw();
            } 
        });

        //  INDEX 에서 그래프 선택시
        $('#index_table tbody').on('click', 'td', function () {
            var table = $('#index_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).index() == 1) {
                data.GUBUN= "2";
                vm.fn_detailPop( data );
            }
        });

        this.getEtnList();
        this.getEtfList();
        this.getIndexList();
    },
    created: function() {},
    beforeDestroy() {},
    methods: {

        deleteItem: function(data, mode) {        
            console.log("deleteItem");
            var vm = this;

            var jisu_cd = '';
            var market_id = '';
          
            if (data.GUBUN == '1') {
                jisu_cd = data.JISU_CD;
            } else {
                jisu_cd = data.JISU_CD;
                market_id = data.MARKET_ID;
            }

            axios.post(Config.base_url + "/user/common/deleteFavorItem", {
                params: {
                    gubun : data.GUBUN,
                    jisu_cd : jisu_cd,
                    market_id : market_id
                }
            }).then(function(response) {
                if (response.data.success == false) {
                    vm.$emit("showMessageBox", '확인','삭제 중 오류가 발생했습니다.',{},1);
                } 
            });

        },
        /* 관심 종목 추가 gubun 1: etf또는 etn 2: index*/
        setSelectedItem: function(sel_items, gubun, mode) {
            var vm = this;

            var addFavorItems = [];

            /* etn 또는 etf 일경우 */
            if (gubun  == '1') {
               
                addFavorItems.push({
                    GUBUN : gubun,
                    F16012 : sel_items.JISU_CD,
                    F16013 : '',
                    F16002 : sel_items.JISU_NM,
                    MARKET_ID : '',
                    LARGE_TYPE : '',
                    MIDDLE_TYPE : ''
                });
               
            } else if (gubun == '2') {
                
                addFavorItems.push({
                    GUBUN : gubun,
                    F16012 : '',
                    F16013 : sel_items.JISU_CD,
                    F16002 : sel_items.JISU_NM,
                    MARKET_ID : sel_items.MARKET_ID,
                    LARGE_TYPE : sel_items.LARGE_TYPE,
                    MIDDLE_TYPE : sel_items.MIDDLE_TYPE
                });
            }    


            axios.post(Config.base_url + "/user/common/insertFavorItem", {
                    params: {
                        addFavorItems : addFavorItems
                    }
            }).then(function(response) {
                if (response.data.success == false) {
                    vm.$emit("showMessageBox", '확인','저장 중 오류가 발생했습니다.',{},4);
                } 
            });

        },
        /* 종목팝업 show */
        showJongMokPop: function() {
            this.jongMokDialog = true;            
        },
        hideJongMokPop: function() {
            this.jongMokDialog = false;
        },

        /* 전체 종목 etn 종목리스트 */
        getEtnList: function() {
            util.processing(this.$refs.progress, true);
            console.log("etn_grid");
            axios.get(Config.base_url + "/user/common/getETNList", {
                params: {
                }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    this.$emit("showMessageBox", '확인','종목정보가 없습니다.',{},1);
                } else {
                    var items = response.data.results;
                    this.etnList = items;
                    etn_table.clear().draw();
                    etn_table.rows.add(items).draw();
                                        
                }
                util.processing(this.$refs.progress, false);
            }).catch(error => {
                util.processing(this.$refs.progress, false);
                this.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        }, 

        /* 전체 종목 etf 종목리스트 */
        getEtfList: function() {
            console.log("etn_grid");
            util.processing(this.$refs.progress, true);
            axios.get(Config.base_url + "/user/common/getETFList", {
                params: {
                }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    this.$emit("showMessageBox", '확인','종목정보가 없습니다.',{},1);
                } else {
                    var items = response.data.results;
                    this.etfList = items;

                    etf_table.clear().draw();
                    etf_table.rows.add(items).draw();
            
                }
                util.processing(this.$refs.progress, false);
            }).catch(error => {
                util.processing(this.$refs.progress, false);
                this.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        }, 

        /* 전체 종목 index 종목리스트 */
        getIndexList: function() {
            console.log("etn_grid");
            util.processing(this.$refs.progress, true);
            axios.get(Config.base_url + "/user/common/getIndexList", {
                params: {
                }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    this.$emit("showMessageBox", '확인','종목정보가 없습니다.',{},1);
                } else {
                    var items = response.data.results;
                    this.indexList = items;

                    index_table.clear().draw();
                    index_table.rows.add(items).draw();
                    
                }
                util.processing(this.$refs.progress, false);
            }).catch(error => {
                util.processing(this.$refs.progress, false);
                this.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        },

        /*
         * Control 영역( 관심종목/전체종목 - ComFavorItem ) 에서 ETP 또는 INDEX 를 선택하는 경우 팝업창을 띄운다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_detailPop : function( param ) {

            var vm = this;

            console.log( "ComFavorItem.vue -> fn_detailPop" );
            console.log( param );

            vm.paramData    =   param;

            /* ETP 인 경우 */
            if( param.GUBUN == "1" ) {

                console.log("########## ComFavorItemSub.vue -> fn_detailPop ############");
                console.log( "param.F16012=[" + param.F16012 + "] /* 국제표준코드  */" );
                console.log( "param.F16257=[" + param.F16257 + "] /* ETP기초지수코드  */" );
                console.log( "param.F34239=[" + param.F34239 + "] /* ETP기초지수MID  */" );

                //if(     !param.F16012        /* 국제표준코드  */
                //    ||  !param.F16257        /* ETP기초지수코드  */
                //    ||  !param.F34239        /* ETP기초지수MID  */
                //    ||  param.F34239 < 0
                //) {
                //    vm.$emit("showMessageBox", '확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.', {}, 1);
                //    return  false;
                //}

                vm.paramData.f16012     =   param.F16012;           /* 국제표준코드 */
                vm.paramData.f16257     =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.f34239     =   param.F34239;           /* ETP기초지수MID */

                vm.paramData.f16002     =   param.JISU_NM;          /* 한글종목명 */
                vm.paramData.f16013     =   param.F16013;           /* 단축코드 */
                vm.paramData.f16493     =   param.F16493;           /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                vm.paramData.f33960     =   param.F33960;           /* ETP운용사코드 */
             
                vm.$emit('showDetail', 1, vm.paramData);
            }
            /* 인덱스인 경우 */
            else if( param.GUBUN == "2" ) {

                console.log("########## ComFavorItemSub.vue -> fn_detailPop ############");
                console.log( "param.F16257=["       + param.F16257     + "]     /* 지수코드  */" );
                console.log( "param.LARGE_TYPE=["   + param.LARGE_TYPE  + "]    /* 지수대분류(FNGUIDE, KRX, KIS, KAP)  */" );
                console.log( "param.MARKET_ID=["    + param.MARKET_ID   + "]    /* 시장 ID  */" );

                //if(     !param.F16257          /* 지수코드  */
                //    ||  !param.LARGE_TYPE       /* 지수대분류(FNGUIDE, KRX, KIS, KAP)  */
                //    ||  !param.MARKET_ID        /* 시장 ID  */
                //) {
                //    vm.$emit("showMessageBox", '확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.', {}, 1);
                //    return  false;
                //}

                vm.paramData.f16012     =   param.F16012;           /* 국제표준코드 */
                vm.paramData.f16257     =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.f34239     =   param.F34239;           /* ETP기초지수MID */

                vm.paramData.F16257     =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.LARGE_TYPE =   param.LARGE_TYPE;       /* 지수대분류(FNGUIDE, KRX, KIS, KAP) */
                vm.paramData.MARKET_ID  =   param.MARKET_ID;        /* 시장 ID  */

                vm.paramData.f16002     =   param.JISU_NM;          /* 한글종목명 */
                vm.paramData.f16013     =   param.F16013;           /* 단축코드 */
                vm.paramData.index_cal_method     =   param.INDEX_CAL_METHOD;            /* 지수산출방식 */

                vm.$emit('showDetail', 2, vm.paramData);
            }
        },

        /*
         * Control 영역( 관심종목/전체종목 - ComFavorItem ) 에서 띄워진 Index 상세 팝업창을 종료한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_closeIndexDetailPop : function( param ) {
            console.log( "ComFavorItem.vue -> fn_closeIndexDetailPop" );

            this.showIndexDetailDialog =       false;
        },

        fn_closeEtpDetailPop : function( param ) {
            console.log( "ComFavorItem.vue -> fn_closeEtpDetailPop" );

            this.showEtpDetailDialog    =   false;
        },
        /*mode 1: 데이터 필터 2: 관심종목*/
        filterData: function(mode) {
            var vm = this;
            var faverData = '-1';
            
            /* 이벤트 delay이로 부하 줄임 */
            var delay = (function(){
                var timer = 0;
                return function(callback, ms){
                    clearTimeout (timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            delay(function(){
            

                if (vm.faverClass == "btn_icon_star v-icon material-icons") {                        
                    faverData = "1";
                    vm.faverClass = "btn_icon_star v-icon on material-icons";
                } else {
                    faverData = "0";
                    vm.faverClass = "btn_icon_star v-icon material-icons";
                }

                /* eft 필터링 */
                var etfFilterData = _.filter(vm.etfList, function(o) { 
                    
                    if (mode == '1') {
                        var nmIdx = o.JISU_NM.indexOf(vm.search);
                        var cdIdx = o.JISU_CD.indexOf(vm.search);

                        if (nmIdx > -1 || cdIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    } else if (mode == '2') {          
                        
                        if (faverData == "0") return true;

                        var faverIdx = o.faver.indexOf(faverData);
                        if (faverIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    }
                });

                
                
                /* etn 필터링*/
                var etnFilterData = _.filter(vm.etnList, function(o) { 

                    if (mode == '1') {
                        var nmIdx = o.JISU_NM.indexOf(vm.search);
                        var cdIdx = o.JISU_CD.indexOf(vm.search);

                        if (nmIdx > -1 || cdIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    } else if (mode == '2') {          
                        
                        if (faverData == "0") return true;

                        var faverIdx = o.faver.indexOf(faverData);
                        if (faverIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    }
                });

                
                
                /* idx 필터링*/
                var idxFilterData = _.filter(vm.indexList, function(o) { 

                    if (mode == '1') {
                        var nmIdx = o.JISU_NM.indexOf(vm.search);
                        var cdIdx = o.JISU_CD.indexOf(vm.search);

                        if (nmIdx > -1 || cdIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    } else if (mode == '2') {          
                        
                        if (faverData == "0") return true;

                        var faverIdx = o.faver.indexOf(faverData);
                        if (faverIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    }
                });

                etf_table.clear().draw();
                etf_table.rows.add(etfFilterData).draw();   

                etn_table.clear().draw();
                etn_table.rows.add(etnFilterData).draw();       

                index_table.clear().draw();
                index_table.rows.add(idxFilterData).draw();    

            }, 1000 );
        },     
        
        
    }
};
</script>