<template>
    <v-container>
        <v-layout row class="content_margin">
            <v-flex grow>
                <v-card flat lite pb-0>
                    <v-card-title primary-title>
                        <h3 class="headline" pb-0>
                            신규 지수 등록
                            <span class="grey--text">지수의 기본정보 및 소급지수를 등록합니다.</span>
                        </h3>
                    </v-card-title>
                    <registrationModify v-if="editYn" :editData="editData" :key="editData.jisu_id"></registrationModify>
                    <registration v-show="!editYn"></registration>
                </v-card>
            </v-flex>
            <v-flex shrink>
                <v-card flat class="right_menu_w">
                    <v-navigation-drawer
                        clipped
                        width="250"
                        class="drawer-style" 
                        mini-variant-width="50"
                        v-model="drawer"
                        :mini-variant.sync="mini"
                        app
                        right
                    >
                        <v-toolbar flat class="transparent">
                            <v-list class="pa-0">
                                <v-list-tile avatar>
                                    <v-list-tile-avatar class="right_menu_t_i">
                                        <v-btn icon>
                                            <v-icon>add</v-icon>
                                        </v-btn>
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <h6>Quick Menu</h6>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-btn icon @click.stop="mini = !mini">
                                            <v-icon>chevron_right</v-icon>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </v-list>
                        </v-toolbar>

                        <v-list class="pt-0" dense>
                            <v-divider></v-divider>
                            <v-list-tile class="right_menu_newbtn">
                                <v-list-tile-content>
                                    <v-btn nomal depressed color="#ff821d" dark  @click="fn_jisuRegister()">신규지수등록</v-btn>
                                </v-list-tile-content>
                            </v-list-tile>
                            <quickmenucon></quickmenucon>
                        </v-list>
                    </v-navigation-drawer>
                </v-card>
            </v-flex>

        </v-layout>

        <ConfirmDialog ref="confirm" v-show="false"></ConfirmDialog>
    </v-container>
</template>


<script>
import Config from "@/js/config.js";

import registration from "./registration.vue";
import quickmenucon from "./quickmenucon.vue";
import registrationModify from "./registrationModify.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

export default {
    data() {
        return {
            ticksLabels: ["등록완료", "연동신청", "연동완료"],
            drawer: true,
            mini: false,

            editYn : false,
            editData : { jisu_id: "", jisu_seq : -1 }
        };
    },
    
    components: {
        registration: registration,
        quickmenucon: quickmenucon,
        registrationModify: registrationModify,
        ConfirmDialog: ConfirmDialog
    },

    created() {
        /*
         * quickmenucon -> 수정버튼 버튼 클릭시 이벤트를 수신한다.
         * 2019-04-10  bkLove(촤병국)
         */
        this.$EventBus.$on("quickmenucon_IndexRegisterMain_call", res => {
            var vm = this;

            if( res && res.jisu_id ) {
                vm.editYn   = true;
                vm.editData = res;
            }
        });
    },

    mounted() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;        
    },

    methods: {

        /*
         * Quick Menu -> [신규지수등록] 버튼 클릭시 신규지수등록 화면을 호출한다.
         * 2019-04-10  bkLove(촤병국)
         */
        async   fn_jisuRegister() {
            var vm = this;

            if( await vm.$root.$confirm.open(
                        '[신규지수등록]',
                        '현재 작성중인 내용은 사라집니다. \n[신규지수등록] 화면으로 이동하시겠습니까?',
                        {}
                    ,   2
                )
            ) {
                if( "Y" != vm.$root.$confirm.val ) {
                    return false;
                }
            }

            vm.editYn = false;
            vm.$EventBus.$emit( "indexRegisterMain_registration_call", "clear" );            
        }
    }
};
</script>

