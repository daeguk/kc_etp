<template>
    <v-container>
        <v-layout>
            <v-flex>
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
                        <v-list-tile-content class="rightmenu_con2 rightmenu_line">
                            <v-layout class="w100">
                                <v-flex xs12>
                                    <v-tabs v-model="tab" centered>
                                        <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                        <v-tab v-for="item in tabs" :key="item">{{ item }}</v-tab>
                                    </v-tabs>

                                    <v-tabs-items v-model="tab">
                                        <v-tab-item>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                            <v-layout row class="w100 pt-2">
                                                <v-flex xs12>
                                                    <v-card flat>
                                                        <v-list two-line subheader>
                                                            <v-list-tile
                                                                v-for="(item, index) in favorItems"
                                                                :key="index"
                                                                class="right_menu_w3"
                                                            >
                                                                <v-list-tile-content
                                                                    class="rm_con_h"
                                                                >
                                                                    <v-list-tile-title>{{ item.F16002 }}</v-list-tile-title>
                                                                    <v-list-tile-sub-title>{{ item.ITEM_CD }}</v-list-tile-sub-title>
                                                                </v-list-tile-content>
                                                                <v-btn flat icon color="#c2c2c2" @click="deleteItem(item.ITEM_SEQ, item.GUBUN, item.ITEM_CD )"><v-icon>clear</v-icon></v-btn>
                                                            </v-list-tile>
                                                        </v-list>
                                                        <v-btn outline small color="primary" dark v-on:click="showJongMokPop">
                                                            <v-icon small color="primary">add</v-icon>자산추가
                                                        </v-btn>
                                                    </v-card>
                                                </v-flex>                                                
                                            </v-layout>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                        </v-tab-item>
                                        <v-tab-item>

                                            <v-tabs v-model="activeTab" centered>
                                                <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                                <v-tab v-for="item in kindTabs" :key="item">{{ item }}</v-tab>
                                            </v-tabs>
                                            
                                            <v-tabs-items v-model="activeTab">
                                            <v-tab-item>
                                                <!--etf 리스트 영역--->
                                                <v-layout row class="w100 pt-2">
                                                    <v-flex xs12>
                                                        <v-card flat>
                                                            <v-list two-line subheader>
                                                                <v-list-tile
                                                                    v-for="item in etfList"
                                                                    :key="item.JISU_CD"
                                                                    class="right_menu_w3"
                                                                >
                                                                    <v-list-tile-content
                                                                        class="rm_con_h"
                                                                    >
                                                                        <v-list-tile-title>{{ item.JISU_NM }}</v-list-tile-title>
                                                                        <v-list-tile-sub-title>{{ item.JISU_CD }}</v-list-tile-sub-title>
                                                                    </v-list-tile-content>
                                                                </v-list-tile>
                                                            </v-list>
                                                        </v-card>
                                                    </v-flex>
                                                </v-layout>
                                            </v-tab-item>
                                            <v-tab-item>
                                                <!--ETN 리스트 영역--->
                                                <v-layout row class="w100 pt-2">
                                                    <v-flex xs12>
                                                        <v-card flat>
                                                            <v-list two-line subheader>
                                                                <v-list-tile
                                                                    v-for="item in etnList"
                                                                    :key="item.JISU_CD"
                                                                    class="right_menu_w3"
                                                                >
                                                                    <v-list-tile-content
                                                                        class="rm_con_h"
                                                                    >
                                                                        <v-list-tile-title>{{ item.JISU_NM }}</v-list-tile-title>
                                                                        <v-list-tile-sub-title>{{ item.JISU_CD }}</v-list-tile-sub-title>
                                                                    </v-list-tile-content>
                                                                </v-list-tile>
                                                            </v-list>
                                                        </v-card>
                                                    </v-flex>
                                                </v-layout>
                                            </v-tab-item>
                                            <v-tab-item>
                                                <!--INDEX 리스트 영역--->
                                                <v-layout row class="w100 pt-2">
                                                    <v-flex xs12>
                                                        <v-card flat>
                                                            <v-list two-line subheader>
                                                                <v-list-tile
                                                                    v-for="item in indexList"
                                                                    :key="item.JISU_CD"
                                                                    class="right_menu_w3"
                                                                >
                                                                    <v-list-tile-content
                                                                        class="rm_con_h"
                                                                    >
                                                                        <v-list-tile-title>{{ item.JISU_NM }}</v-list-tile-title>
                                                                        <v-list-tile-sub-title>{{ item.JISU_CD }}</v-list-tile-sub-title>
                                                                    </v-list-tile-content>
                                                                </v-list-tile>
                                                            </v-list>
                                                        </v-card>
                                                    </v-flex>
                                                </v-layout>                                                 
                                            </v-tab-item>
                                            </v-tabs-items>
                                           
                                        </v-tab-item>
                                    </v-tabs-items>
                                </v-flex>
                            </v-layout>
                            <!---자산추가 팝업--->
                            <jongmokPop @selectedItem="getSelectedItem"></jongmokPop>
                            <!--자산추가 팝업 end--->
                        </v-list-tile-content>
                    </v-list>
                </v-navigation-drawer>
            </v-card>
            </v-flex>
            <v-flex>
                <ConfirmDialog ref="confirm"></ConfirmDialog>
            </v-flex>
            <!--rightmenu end--->
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

var importance_grid = null;

export default {
    props: [],
    data() {
        return {
            dialog: false,
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
            indexList: []
        };
    },
    components: {
        jongmokPop : jongmokPop,
        ConfirmDialog : ConfirmDialog
    },
    computed: {
        
    },
    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
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
        getSelectedItem: function(sel_items, gubun) {
            var vm = this;
            
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
        showJongMokPop: function() {
            this.$EventBus.$emit( "showJongMokPop", true );
        },

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
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.etnList = items;                        
                    }
                   
                });
        }, 
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
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.etfList = items;                        
                    }
                   
                });
        }, 
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
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.indexList = items;                        
                    }
                   
                });
        },
    }
};
</script>