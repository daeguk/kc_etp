<template>
    <v-container>
        <v-layout>
            <v-flex>
            <!--rightmenu -->
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
                        <v-list-tile-content class="rightmenu_con2 rightmenu_line">
                            <v-layout class="w100">
                                <v-flex xs12>
                                    <v-tabs v-model="tab" centered>
                                        <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                        <v-tab v-for="item in tabs" :key="item">{{ item }}</v-tab>
                                    </v-tabs>

                                    <v-tabs-items v-model="tab">
                                        <v-tab-item>
                                            <!--오른쪽 메뉴 하단 리스트 영역 -->
                                            <v-layout row class="w100 pt-2">
                                                <v-flex xs12>
                                                    <v-card flat>
                                                        <table id="favor_grid" class="display" style="width:100%">
                                                        <thead>
                                                            <tr>
                                                                <th></th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>   
                                                    </table>

                                                        <v-btn outline small color="primary" dark v-on:click="showJongMokPop">
                                                            <v-icon small color="primary">add</v-icon>자산추가
                                                        </v-btn>
                                                    </v-card>
                                                </v-flex>                                                
                                            </v-layout>
                                            <!--오른쪽 메뉴 하단 리스트 영역 -->
                                        </v-tab-item>
                                        <v-tab-item>

                                            <v-tabs v-model="activeTab" centered>
                                                <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                                <v-tab v-for="item in kindTabs" :key="item">{{ item }}</v-tab>
                                            </v-tabs>
                                            
                                            <v-tabs-items v-model="activeTab">
                                            <v-tab-item>
                                                <!-- etf 리스트 영역 -->
                                                <v-layout row class="w100 pt-2">
                                                    <v-flex xs12>
                                                        <v-card flat>
                                                            <table id="etf_table" class="display" style="width:100%">
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>  
                                                            </table>
                                                        </v-card>
                                                    </v-flex>
                                                </v-layout>
                                            </v-tab-item>
                                            <v-tab-item>
                                                <!--ETN 리스트 영역 -->
                                                <v-layout row class="w100 pt-2">
                                                    <v-flex xs12>
                                                        <v-card flat>
                                                            <table id="etn_table" class="display" style="width:100%">
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>  
                                                            </table>
                                                        </v-card>
                                                    </v-flex>
                                                </v-layout>
                                            </v-tab-item>
                                            <v-tab-item>
                                                <!--INDEX 리스트 영역 -->
                                                <v-layout row class="w100 pt-2">
                                                    <v-flex xs12>
                                                        <v-card flat>
                                                            <table id="index_table" class="display" style="width:100%">
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>  
                                                            </table>
                                                        </v-card>
                                                    </v-flex>
                                                </v-layout>                                                 
                                            </v-tab-item>
                                            </v-tabs-items>
                                           
                                        </v-tab-item>
                                    </v-tabs-items>
                                </v-flex>
                            </v-layout>
                            <!---자산추가 팝업 -->
                            <jongmokPop @selectedItem="getSelectedItem" @hideJongMokPop="hideJongMokPop" :showDialog="jongMokDialog"></jongmokPop>
                            <!--자산추가 팝업 end -->
                        </v-list-tile-content>
                    </v-list>
                </v-navigation-drawer>
            </v-card>
            </v-flex>

            <v-flex>
                <IndexDetailDialog  v-if="showIndexDetailDialog"  

                                    :paramData="paramData" 
                                    :showDialog="showIndexDetailDialog"  

                                    @fn_closePop = "fn_closeIndexDetailPop">
                </IndexDetailDialog>
            </v-flex>

            <v-flex>
                <v-dialog v-model="showEtpDetailDialog"   :max-width="options.width" v-bind:style="{ zIndex: options.zIndex }" >
                    <EtpManageDetail    v-if="showEtpDetailDialog"  

                                        :paramData="paramData"
                                        :showEtpManageDetailDialog="showEtpDetailDialog"
                                        
                                        @fn_closePop = "fn_closeEtpDetailPop">
                    </EtpManageDetail>
                </v-dialog>
            </v-flex>            

            <v-flex>
                <ConfirmDialog ref="confirm"></ConfirmDialog>
            </v-flex>

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
import jongmokPop from "@/components/common/popup/jongmokPopup";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import IndexDetailDialog from "@/components/Home/Index/Manage/IndexDetailDialog.vue";
import EtpManageDetail from "@/components/Home/Etp/Manage/EtpManageDetail.vue";

var favor_grid = null;
var etf_table = null;
var etn_table = null;
var index_table = null;

export default {
    props: [],
    data() {
        return {
            jongMokDialog: false,
            mini: false,
            right: null,
            tab: null,
            kindTab : null, 
            activeTab: 0, 
            tabs: ["관심종목", "전체종목"],
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
            showIndexDetailDialog : false,
            showEtpDetailDialog : false,
        };
    },
    components: {
        jongmokPop : jongmokPop,
        ConfirmDialog : ConfirmDialog,
        IndexDetailDialog : IndexDetailDialog,
        EtpManageDetail :   EtpManageDetail
    },
    computed: {
        
    },
    mounted: function() {

        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
        
        var vm = this;


    /* [관심종목] 테이블 */
        favor_grid = $('#favor_grid').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br>"+row.ITEM_CD;
                        return htm;
                    },
                    "targets": 0
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "F16002", "orderable": false, width:'95%'},
                { "data": null, "orderable": false, width:'5%', defaultContent:"<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>clear</button><span class='tooltiptext' style='width:40px;'>삭제</span></div>"},
            ]
        }); 


        // 테이블
        $('#favor_grid tbody').on('click', 'button', function () {
            var table = $('#favor_grid').DataTable();
            var data = table.row($(this).parents('tr')).data();

            vm.deleteItem(data.ITEM_SEQ, data.GUBUN, data.ITEM_CD );
        });

        //  관심종목 더블 클릭시
        $('#favor_grid tbody').on('dblclick', 'td', function () {
            var table = $('#favor_grid').DataTable();
            var data = table.row($(this).parents('tr')).data();

            vm.fn_detailPop( data );
        });        


    /* [전체종목 -> ETF] 테이블 */
        etf_table = $('#etf_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br>"+row.JISU_CD;
                        return htm;
                    },
                    "targets": 0
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "JISU_NM", "orderable": false},
                { "data": null, "orderable": false, width:'5%', defaultContent:"<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:40px;'>ETP</span></div>"},
            ]
        });


        //  ETF 에서 그래프 선택시
        $('#etf_table tbody').on('click', 'button', function () {
            var table = $('#etf_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            vm.fn_detailPop( data );
        });



    /* [전체종목 -> ETN] 테이블 */
        etn_table = $('#etn_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br>"+row.JISU_CD;
                        return htm;
                    },
                    "targets": 0
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "JISU_NM", "orderable": false},
                { "data": null, "orderable": false, width:'5%', defaultContent:"<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:40px;'>ETP</span></div>"},
            ]
        });

        //  ETN 에서 그래프 선택시
        $('#etn_table tbody').on('click', 'button', function () {
            var table = $('#etn_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            vm.fn_detailPop( data );
        });


    /* [전체종목 -> INDEX] 테이블 */
        index_table = $('#index_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br>"+row.JISU_CD;
                        return htm;
                    },
                    "targets": 0
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "JISU_NM", "orderable": false},
                { "data": null, "orderable": false, width:'5%', defaultContent:"<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:40px;'>INDEX</span></div>"},
            ]
        });

        //  INDEX 에서 그래프 선택시
        $('#index_table tbody').on('click', 'button', function () {
            var table = $('#index_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            vm.fn_detailPop( data );
        });


        this.getFavorItemInfo();
        this.getEtnList();
        this.getEtfList();
        this.getIndexList();
    },
    created: function() {},
    beforeDestroy() {},
    methods: {

        getFavorItemInfo: function() {
            console.log("getSectorEtpList");
            var vm = this;
            axios.get(Config.base_url + "/user/common/getFavorItemInfo", {
                params: {
                }
            }).then(function(response) {
                console.log(response);
                if (response.data.success == false) {
                    vm.$root.$confirm.open('확인','관심 종목이 없습니다.',{},1);
                } else {
                    //debugger;
                    vm.favorItems = response.data.results;

                    favor_grid.clear().draw();
                    favor_grid.rows.add(vm.favorItems).draw();
                }
            });
        },
        deleteItem: function(item_seq, gubun, item_cd) {        
            console.log("deleteItem");
            var vm = this;
            axios.post(Config.base_url + "/user/common/deleteFavorItem", {
                params: {
                    item_seq : item_seq,
                    gubun : gubun, 
                    item_cd : item_cd
                }
            }).then(function(response) {
                if (response.data.success == false) {
                    vm.$root.$confirm.open('확인','삭제 중 오류가 발생했습니다.',{},1);
                } else {
                    vm.getFavorItemInfo();
                }
            });

        },
        /* 자산추가 팝업에서 선택된 종목 추가 */
        getSelectedItem: function(sel_items, gubun) {
            var vm = this;

            vm.jongMokDialog = false;

            var addFavorItems = [];

            for (let i = 0; i < sel_items.length; i++) {
                
                

                if (gubun  == '1') {
                    var idx = _.findIndex(vm.favorItems, { 'ITEM_CD': sel_items[i].JISU_CD});
                    
                    if (idx == -1) {
                        addFavorItems.push({
                            GUBUN : gubun,
                            F16012 : sel_items[i].JISU_CD,
                            F16013 : '',
                            F16002 : sel_items[i].JISU_NM,
                            MARKET_ID : '',
                            LARGE_TYPE : '',
                            MIDDLE_TYPE : ''
                        });
                    } else {
                        vm.$root.$confirm.open('확인','이미 추가된 관심 종목 입니다.',{},1);
                    }
                } else if (gubun == '2') {
                    var idx = _.findIndex(vm.favorItems, { 'ITEM_CD': sel_items[i].JISU_CD, 'MARKET_ID': sel_items[i].MARKET_ID });

                    if (idx == -1) {
                        addFavorItems.push({
                            GUBUN : gubun,
                            F16012 : '',
                            F16013 : sel_items[i].JISU_CD,
                            F16002 : sel_items[i].JISU_NM,
                            MARKET_ID : sel_items[i].MARKET_ID,
                            LARGE_TYPE : sel_items[i].LARGE_TYPE,
                            MIDDLE_TYPE : sel_items[i].MIDDLE_TYPE
                        });
                    } else {
                        vm.$root.$confirm.open('확인','이미 추가된 관심 종목 입니다.',{},1);
                    }
                }
            }
        
            axios.post(Config.base_url + "/user/common/insertFavorItem", {
                    params: {
                        addFavorItems : addFavorItems
                    }
            }).then(function(response) {
                if (response.data.success == false) {
                    vm.$root.$confirm.open('확인','저장 중 오류가 발생했습니다.',{},4);
                } else {
                    vm.getFavorItemInfo();
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
            console.log("etn_grid");
            axios.get(Config.base_url + "/user/index/getETNList", {
                params: {
                }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    this.$root.$confirm.open('확인','종목정보가 없습니다.',{},1);
                } else {
                    var items = response.data.results;
                    
                    etn_table.clear().draw();
                    etn_table.rows.add(items).draw();
                                        
                }
                
            });
        }, 

        /* 전체 종목 etf 종목리스트 */
        getEtfList: function() {
            console.log("etn_grid");
            axios.get(Config.base_url + "/user/index/getETFList", {
                params: {
                }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    this.$root.$confirm.open('확인','종목정보가 없습니다.',{},1);
                } else {
                    var items = response.data.results;
                    
                    etf_table.clear().draw();
                    etf_table.rows.add(items).draw();
            
                }
                
            });
        }, 

        /* 전체 종목 index 종목리스트 */
        getIndexList: function() {
            console.log("etn_grid");
            axios.get(Config.base_url + "/user/index/getInfoIndexList", {
                params: {
                }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    this.$root.$confirm.open('확인','종목정보가 없습니다.',{},1);
                } else {
                    var items = response.data.results;
                    
                    index_table.clear().draw();
                    index_table.rows.add(items).draw();
                    
                }
                
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

            /* ETP 인 경우 */
            if( param.GUBUN == "1" ) {

                console.log("########## ComFavorItem.vue -> fn_detailPop ############");
                console.log( "param.F16012=[" + param.F16012 + "] /* 국제표준코드  */" );
                console.log( "param.F16257=[" + param.F16257 + "] /* ETP기초지수코드  */" );
                console.log( "param.F34239=[" + param.F34239 + "] /* ETP기초지수MID  */" );

                if(     !param.F16012        /* 국제표준코드  */
                    ||  !param.F16257        /* ETP기초지수코드  */
                    ||  !param.F34239        /* ETP기초지수MID  */
                    ||  param.F34239 < 0
                ) {
                    this.$root.$confirm.open('확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.', {}, 1);
                    return  false;
                }

                this.paramData.f16012       =   param.F16012;           /* 국제표준코드 */
                this.paramData.f16257       =   param.F16257;           /* ETP기초지수코드 */
                this.paramData.f34239       =   param.F34239;           /* ETP기초지수MID */

                axios.post(Config.base_url + "/user/etp/getExistEtpBasicCnt", {
                    data: {
                        basicData   :   vm.paramData
                    }
                }).then(function(response) {
                    console.log(response);

                    if (response.data) {
                        var etpIndex = response.data.etpIndex;

                        if( etpIndex.etp_cnt == 0 ) {
                            vm.$root.$confirm.open('확인','ETP 정보가 존재하지 않습니다. 관리자에게 문의해 주세요.', {}, 1);
                            return  false;
                        }

                        if( etpIndex.index_cnt == 0 ) {
                            vm.$root.$confirm.open('확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.' + '(' + etpIndex.index_cnt + ')', {}, 1);
                            return  false;
                        }

                        vm.showIndexDetailDialog    =   false;
                        vm.showEtpDetailDialog      =   true;
                    }
                });
            }
            /* 인덱스인 경우 */
            else if( param.GUBUN == "2" ) {

                console.log("########## ComFavorItem.vue -> fn_detailPop ############");
                console.log( "param.ITEM_CD=["      + param.ITEM_CD     + "] /* 지수코드  */" );
                console.log( "param.LARGE_TYPE=["   + param.LARGE_TYPE  + "] /* 지수대분류(FNGUIDE, KRX, KIS, KAP)  */" );
                console.log( "param.MARKET_ID=["    + param.MARKET_ID   + "] /* 시장 ID  */" );

                if(     !param.ITEM_CD          /* 지수코드  */
                    ||  !param.LARGE_TYPE       /* 지수대분류(FNGUIDE, KRX, KIS, KAP)  */
                    ||  !param.MARKET_ID        /* 시장 ID  */
                ) {
                    this.$root.$confirm.open('확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.', {}, 1);
                    return  false;
                }

                this.paramData.f16012       =   param.F16012;           /* 국제표준코드 */
                this.paramData.f16257       =   param.F16257;           /* ETP기초지수코드 */
                this.paramData.f34239       =   param.F34239;           /* ETP기초지수MID */

                axios.post(Config.base_url + "/user/etp/getExistEtpBasicCnt", {
                    data: {
                        basicData   :   vm.paramData
                    }
                }).then(function(response) {
                    console.log(response);

                    if (response.data) {
                        var etpIndex = response.data.etpIndex;

                        if( etpIndex.index_cnt == 0 ) {
                            vm.$root.$confirm.open('확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.' + '(' + etpIndex.index_cnt + ')', {}, 1);
                            return  false;
                        }

                        vm.showIndexDetailDialog    =   true;
                        vm.showEtpDetailDialog      =   false;
                    }
                });                
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
        }        
    }
};
</script>