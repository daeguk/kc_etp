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


                    <ComFavorItemSub    @showDetail="showDetail"></ComFavorItemSub>

                </v-navigation-drawer>
            </v-card>
            </v-flex>

            <!--rightmenu end -->
        </v-layout>
    </v-container>
</template>


<script>
import Config from "@/js/config.js";
import ComFavorItemSub from "@/components/common/control/ComFavorItemSub";

export default {
    props: [],
    data() {
        return {
            mini: false,
            right: null,
            tab: null,
            kindTab : null, 
            activeTab: 0, 
            tabs: ["관심종목", "전체종목"],
            kindTabs: ["ETF", "ETN", "INDEX"],
            drawer: null,

            paramData : {},
            showIndexDetailDialog : false,
            showEtpDetailDialog : false,
        };
    },
    components: {
        ComFavorItemSub: ComFavorItemSub
    },
    computed: {
        
    },
    mounted: function() {
        var vm = this;

    },
    created: function() {},
    beforeDestroy() {},
    methods: {

        /*
         * Control 영역( 관심종목/전체종목 - ComFavorItem ) 에서 띄워진 Index 상세 팝업창을 종료한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_closeIndexDetailPop : function( param ) {
            // console.log( "ComFavorItem.vue -> fn_closeIndexDetailPop" );

            this.showIndexDetailDialog =       false;
        },

        fn_closeEtpDetailPop : function( param ) {
            // console.log( "ComFavorItem.vue -> fn_closeEtpDetailPop" );

            this.showEtpDetailDialog    =   false;
        },
        
        showDetail: function(gubun, paramData) {
            var vm = this;

            vm.$emit( "showDetail", gubun, paramData );
        },
    }
};
</script>