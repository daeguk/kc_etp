<template>
    <v-container>
        <v-list class="pt-0" dense>
            <v-list-tile-content class="rightmenu_con2 rightmenu_line">
                <v-layout class="w100">
                    <v-flex xs12>
                       

                                <v-tabs v-model="activeTab" centered>
                                    <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                    <v-tab v-for="item in kindTabs" :key="item">{{ item }}</v-tab>
                                </v-tabs>
                                
                                <v-tabs-items v-model="activeTab">
                                <v-tab-item>
                                    <!-- etf 리스트 영역 -->
                                    <v-layout row >
                                        
                                        <v-flex xs12>
                                            <v-card flat>
                                                <v-card-title>
                                                    <v-text-field v-model="search" v-on:keyup="filterEtfData" append-icon="search" label="Search" single-line hide-details></v-text-field>
                                                </v-card-title>    
                                                <table id="publish_etp_table" class="tbl_type" style="width:100%">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th></th>
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
                                    <v-layout row>
                                        <v-flex xs12>
                                            <v-card flat>
                                                <v-card-title>
                                                    <v-text-field v-model="search" v-on:keyup="filterEtnData" append-icon="search" label="Search" single-line hide-details></v-text-field>
                                                </v-card-title>    
                                                <table id="all_etp_table" class="tbl_type" style="width:100%">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th></th>
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
                                
                    </v-flex>
                </v-layout>
            </v-list-tile-content>
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


var publish_etp_table = null;
var all_etp_table = null;

export default {
    props: [],
    data() {
        return {
            jongMokDialog: false,
            right: null,
            tab: null,
            kindTab : null, 
            activeTab: 0, 
            kindTabs: ["운영종목", "전종목"],
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
            
        };
    },
    components: {
    },
    computed: {
        
    },
    mounted: function() {

        
        var vm = this;

        /* [운영사가 발행한 종목 -> ETF] 테이블 */
        publish_etp_table = $('#publish_etp_table').DataTable( {
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
                        let htm = "";
                        if (data == '1') {
                            htm += "<div class='tooltip'><button type='button' id='btn_faver' class='btn_icon v-icon material-icons'>star</button><span class='tooltiptext' style='width:40px;'>즐겨찾기</span></div>";
                        } else {
                            htm += "<div class='tooltip'><button type='button' id='btn_faver' class='btn_icon v-icon material-icons'>star_border</button><span class='tooltiptext' style='width:40px;'>즐겨찾기</span></div>";
                        }
                        
                        return htm;
                    },
                    "targets": 1
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           "+data+"";
                        htm += "            <br>"+row.JISU_CD;
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
                { "data": "faver_seq", "visible": false},
                { "data": "faver", "orderable": false, width:'5%', defaultContent:"<div class='tooltip'><button type='button' id='btn_faver' class='btn_icon v-icon material-icons'>star</button><span class='tooltiptext' style='width:40px;'>즐겨찾기</span></div>"},
                { "data": "JISU_NM", "orderable": false},
                { "data": null, "orderable": false, width:'5%', defaultContent:"<div class='tooltip'><button type='button' id='btn_detail' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:40px;'>ETP</span></div>"},
            ]
        });


        //  ETF 에서 그래프 선택시
        $('#publish_etp_table tbody').on('click', 'button', function () {
            var table = $('#publish_etp_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_faver') {

                if (data.faver == '1') {
                    data.faver = 0;
                    $(this).html("star_border");
                    vm.deleteItem(data, 'etf');
                } else {
                    data.faver = 1;
                    $(this).html("star");
                    vm.setSelectedItem(data, '1', 'etf');
                }
                //$(this).html("star_border");
                //etf_table.rows.add(etf_table.rows().data()).draw();
            } else if ($(this).attr('id') == 'btn_detail') {
                data.GUBUN= "1";
                vm.fn_detailPop( data );
            }
        });



    /* [전체 종목: 운영사가 ETF 발행사이면 ETF 전체 종목, ETN 발행사 이면 ETN 전체 종목] 테이블 */
        all_etp_table = $('#all_etp_table').DataTable( {
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
                        let htm = "";
                        if (data == '1') {
                            htm += "<div class='tooltip'><button type='button' id='btn_faver' class='btn_icon v-icon material-icons'>star</button><span class='tooltiptext' style='width:40px;'>즐겨찾기</span></div>";
                        } else {
                            htm += "<div class='tooltip'><button type='button' id='btn_faver' class='btn_icon v-icon material-icons'>star_border</button><span class='tooltiptext' style='width:40px;'>즐겨찾기</span></div>";
                        }
                        
                        return htm;
                    },
                    "targets": 1
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br>"+row.JISU_CD;
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
                { "data": "faver_seq", "visible": false},
                { "data": "faver", "orderable": false, width:'5%', defaultContent:"<div class='tooltip'><button type='button' id='btn_faver' class='btn_icon v-icon material-icons'>star</button><span class='tooltiptext' style='width:40px;'>즐겨찾기</span></div>"},
                { "data": "JISU_NM", "orderable": false},
                { "data": null, "orderable": false, width:'5%', defaultContent:"<div class='tooltip'><button type='button' id='btn_detail' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:40px;'>ETP</span></div>"},
            ]
        });

        
        $('#all_etp_table tbody').on('click', 'button', function () {
            var table = $('#all_etp_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_faver') {

                if (data.faver == '1') {
                    data.faver = 0;
                    $(this).html("star_border");
                    vm.deleteItem(data, 'etn');
                } else {
                    data.faver = 1;
                    $(this).html("star");
                    vm.setSelectedItem(data, '1', 'etn');
                }
                //$(this).html("star_border");
                //etf_table.rows.add(etf_table.rows().data()).draw();
            } else if ($(this).attr('id') == 'btn_detail') {
                data.GUBUN= "1";
                vm.fn_detailPop( data );
            }
           
        });


        this.getPublicEtpList();
        this.getALLEtpList();
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
                    jisu_cd : jisu_cd,
                    market_id : market_id
                }
            }).then(function(response) {
                if (response.data.success == false) {
                    vm.$emit("showMessageBox", '확인','삭제 중 오류가 발생했습니다.',{},1);
                } else {
                    //if (mode == 'etf') vm.getEtfList();
                   // if (mode == 'etn') vm.getEtnList();
                    //if (mode == 'index') vm.getIndexList();
                }
            });

        },
        /* 관심 종목 추가 */
        setSelectedItem: function(sel_items, gubun, mode) {
            var vm = this;

            vm.jongMokDialog = false;

            var addFavorItems = [];

            if (gubun  == '1') {
                var idx = - 1;
                if (mode == 'etf') idx =  _.findIndex(vm.etfList, { 'ITEM_CD': sel_items.JISU_CD});
                if (mode == 'etn') idx =  _.findIndex(vm.etnList, { 'ITEM_CD': sel_items.JISU_CD});
                if (mode == 'index') idx =  _.findIndex(vm.indexList, { 'ITEM_CD': sel_items.JISU_CD});
                    
                if (idx == -1) {
                    addFavorItems.push({
                        GUBUN : gubun,
                        F16012 : sel_items.JISU_CD,
                        F16013 : '',
                        F16002 : sel_items.JISU_NM,
                        MARKET_ID : '',
                        LARGE_TYPE : '',
                        MIDDLE_TYPE : ''
                    });
                } else {
                    vm.$emit("showMessageBox", '확인','이미 추가된 관심 종목 입니다.',{},1);
                }
            } else if (gubun == '2') {
                var idx = -1;

                if (mode == 'etf') idx =  _.findIndex(vm.favorItems, { 'ITEM_CD': sel_items.JISU_CD, 'MARKET_ID': sel_items.MARKET_ID });
                if (mode == 'etn') idx =  _.findIndex(vm.favorItems, { 'ITEM_CD': sel_items.JISU_CD, 'MARKET_ID': sel_items.MARKET_ID });
                if (mode == 'index') idx =  _.findIndex(vm.favorItems, { 'ITEM_CD': sel_items.JISU_CD, 'MARKET_ID': sel_items.MARKET_ID });

                if (idx == -1) {
                    addFavorItems.push({
                        GUBUN : gubun,
                        F16012 : '',
                        F16013 : sel_items.JISU_CD,
                        F16002 : sel_items.JISU_NM,
                        MARKET_ID : sel_items.MARKET_ID,
                        LARGE_TYPE : sel_items.LARGE_TYPE,
                        MIDDLE_TYPE : sel_items.MIDDLE_TYPE
                    });
                } else {
                    vm.$emit("showMessageBox", '확인','이미 추가된 관심 종목 입니다.',{},1);
                }
            }    

            
        

            axios.post(Config.base_url + "/user/common/insertFavorItem", {
                    params: {
                        addFavorItems : addFavorItems
                    }
            }).then(function(response) {
                if (response.data.success == false) {
                    vm.$emit("showMessageBox", '확인','저장 중 오류가 발생했습니다.',{},4);
                } else {
                    //if (mode == 'etf') vm.getEtfList();
                    //if (mode == 'etn') vm.getEtnList();
                    //if (mode == 'index') vm.getIndexList();
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
        getPublicEtpList: function() {
            console.log("etn_grid");
            axios.get(Config.base_url + "/user/common/getPublishEtpList", {
                params: {
                }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    this.$emit("showMessageBox", '확인','종목정보가 없습니다.',{},1);
                } else {
                    var items = response.data.results;
                    this.etnList = items;
                    publish_etp_table.clear().draw();
                    publish_etp_table.rows.add(items).draw();
                                        
                }
                
            });
        }, 

        /* 전체 종목 etf 종목리스트 */
        getALLEtpList: function() {
            console.log("etn_grid");
            axios.get(Config.base_url + "/user/common/getALLEtpList", {
                params: {
                }
            }).then(response => {
                // console.log(response);
                if (response.data.success == false) {
                    this.$emit("showMessageBox", '확인','종목정보가 없습니다.',{},1);
                } else {
                    var items = response.data.results;
                    this.etfList = items;

                    all_etp_table.clear().draw();
                    all_etp_table.rows.add(items).draw();
            
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

                //if(     !param.F16012        /* 국제표준코드  */
                //    ||  !param.F16257        /* ETP기초지수코드  */
                //    ||  !param.F34239        /* ETP기초지수MID  */
                //    ||  param.F34239 < 0
                //) {
                //    vm.$emit("showMessageBox", '확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.', {}, 1);
                //    return  false;
                //}

                vm.paramData.f16012       =   param.F16012;           /* 국제표준코드 */
                vm.paramData.f16257       =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.f34239       =   param.F34239;           /* ETP기초지수MID */

             
                vm.$emit('showDetail', 1, vm.paramData);
            }
            /* 인덱스인 경우 */
            else if( param.GUBUN == "2" ) {

                console.log("########## ComFavorItem.vue -> fn_detailPop ############");
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

                vm.paramData.f16012       =   param.F16012;           /* 국제표준코드 */
                vm.paramData.f16257       =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.f34239       =   param.F34239;           /* ETP기초지수MID */

                vm.paramData.F16257       =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.LARGE_TYPE   =   param.LARGE_TYPE;       /* 지수대분류(FNGUIDE, KRX, KIS, KAP) */
                vm.paramData.MARKET_ID    =   param.MARKET_ID;        /* 시장 ID  */

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
        filterEtfData: function() {
            var vm = this;
        
            var filterData = _.filter(vm.etfList, function(o) { 

                var nmIdx = o.JISU_NM.indexOf(vm.search);
                var cdIdx = o.JISU_CD.indexOf(vm.search);

                if (nmIdx > -1 || cdIdx > -1) {
                    return true; 
                } else {
                    return false;
                }
            });

            etf_table.clear().draw();
            etf_table.rows.add(filterData).draw();           
        },     
        
        filterEtnData: function() {
            var vm = this;
        
            var filterData = _.filter(vm.etnList, function(o) { 

                var nmIdx = o.JISU_NM.indexOf(vm.search);
                var cdIdx = o.JISU_CD.indexOf(vm.search);

                if (nmIdx > -1 || cdIdx > -1) {
                    return true; 
                } else {
                    return false;
                }
            });

            etn_table.clear().draw();
            etn_table.rows.add(filterData).draw();           
        },        

        filterIndexData: function() {
            var vm = this;
        
            var filterData = _.filter(vm.indexList, function(o) { 

                var nmIdx = o.JISU_NM.indexOf(vm.search);
                var cdIdx = o.JISU_CD.indexOf(vm.search);

                if (nmIdx > -1 || cdIdx > -1) {
                    return true; 
                } else {
                    return false;
                }
            });

            index_table.clear().draw();
            index_table.rows.add(filterData).draw();           
        }        
    }
};
</script>