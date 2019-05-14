<template>
    <v-container>
        <v-layout row wrap>
            <!--rightmenu---->
            <v-card flat class="right_menu_w2 w100">
                 <v-list class="pt-0" dense>
                        <v-list-tile-content class="rightmenu_con">
                            <v-subheader>
                                <v-icon small>feedback</v-icon>지수 조치 현황
                                <v-btn
                                    small
                                    depressed
                                    outline
                                    color="primary"
                                    @click="fn_showDetailIndex"
                                >내역확인</v-btn>
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
            </v-card>
            <!--rightmenu end--->
        </v-layout>
    </v-container>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

export default {
    props : [ "indexBasic"],
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            mini: false,
            drawer : true,
            dialog: false,

            toggleIndexOversea : false,
        };
    },
    mounted: function() {},
    created: function() {},
    beforeDestory: function() {},

    methods: {

        fn_showDetailIndex() {
            var vm = this;

            vm.$emit( "fn_showDetailIndex", 4, vm.indexBasic );
        },

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

        fn_setEtpOperIndexOversea : function() {
            var vm = this;
            vm.toggleIndexOversea  =   !vm.toggleIndexOversea;

            var paramData   =   {};
            paramData.toggleIndexOversea    =   vm.toggleIndexOversea;            

            vm.$emit( "fn_setEtpOperIndexOversea", paramData );
        }
    }
};
</script>

