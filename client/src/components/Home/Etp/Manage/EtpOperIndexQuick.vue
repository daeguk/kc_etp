<template>
    <v-container>
        <v-layout row wrap class="content_margin">
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
                                <v-icon small>feedback</v-icon>지수 조치 현황
                                <v-dialog v-model="dialog" persistent max-width="500">
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            small
                                            depressed
                                            outline
                                            color="primary"
                                            v-on="on"
                                        >내역확인</v-btn>
                                    </template>
                                    <v-card flat>
                                        <h5>
                                            <v-card-title ma-0>
                                                지수조치 현황(DBF 500 Index)
                                                <v-spacer></v-spacer>
                                                <v-btn icon dark @click="dialog = false">
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
                                        <!--indexDetailrtmenupop></indexDetailrtmenupop-->
                                        <v-card class="pop_bot_h"></v-card>
                                    </v-card>
                                </v-dialog>
                            </v-subheader>
                            <p class="text_red">
                                <v-icon small>arrow_right</v-icon>3개 지수에 대한 조치 발생
                            </p>
                        </v-list-tile-content>
                        <v-list-tile-content class="rightmenu_con Oper_menu">
                            <v-subheader>
                                <v-icon small>build</v-icon>Operation Tools
                            </v-subheader>
                            <v-card flat class="w100">
                                <v-list>
                                    <v-list-tile
                                        class="border_b"
                                        @click="fn_setEtpOperIndexOversea"
                                    >
                                        <v-list-tile-avatar>
                                            <v-icon value="해외지수">exposure</v-icon>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>해외지수 종가 모니터링</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                        </v-list-tile-content>
                    </v-list>
                </v-navigation-drawer>
            </v-card>
            <!--rightmenu end--->
        </v-layout>
    </v-container>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            dialog: false,

            toggleIndexOversea : false,
        };
    },
    mounted: function() {},
    created: function() {},
    beforeDestory: function() {},

    methods: {
        /*
         *  관심종목에서 그래프 선택시 상세정보를 보여준다.
         *  2019-05-03  bkLove(촤병국)
         */
        showDetail: function(gubun, paramData) {
            var vm = this;
            vm.$emit("showDetail", gubun, paramData);
        },

        /*
         *  메시지창 정보가 필요한 경우 해당 정보를 보여준다.
         *  2019-05-03  bkLove(촤병국)
         */

        showMessageBox: function(title, msg, option, gubun) {
            var vm = this;
            vm.$emit("showMessageBox", title, msg, option, gubun);
        },

        fn_setEtpOperIndexOversea() {
            var vm = this;
            vm.toggleIndexOversea  =   !vm.toggleIndexOversea;

            var paramData   =   {};
            paramData.toggleIndexOversea    =   vm.toggleIndexOversea;            

            vm.$emit( "fn_setEtpOperIndexOversea", paramData );
        }
    }
};
</script>

