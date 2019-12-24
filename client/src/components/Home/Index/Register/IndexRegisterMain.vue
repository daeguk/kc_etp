<template>
    <v-container class="IndexRegi_w">
        <v-layout row class="content_margin con_wrap">
            <v-flex grow  class="conWidth_left">
                <v-card flat lite pb-0>
                    <v-card-title primary-title>
                        <h3 class="headline" pb-0>
                            신규 지수 등록
                            <span class="grey--text">지수의 기본정보 및 소급지수를 등록합니다.</span>
                        </h3>
                    </v-card-title>
                    <registrationModify v-if="editYn" :editData="editData" :key="editData.jisu_id" @fn_refresh="fn_refresh" @fn_moveRegisterPage="fn_moveRegisterPage"></registrationModify>
                    <registration v-show="!editYn" @fn_refresh="fn_refresh"></registration>
                </v-card>
            </v-flex>
            <v-flex shrink   class="conWidth_right">
                <v-card flat class="right_menu_w">
                    <v-list class="pt-0" dense>
                         <v-list-tile class="right_menu_newbtn">
                                <v-list-tile-content>
                                    <v-btn nomal depressed class="btn_orange01" dark  @click="fn_jisuRegister()">신규지수등록</v-btn>
                                </v-list-tile-content>
                            </v-list-tile>
                            <quickmenucon v-if="refreshYn"></quickmenucon>
                        </v-list>
                </v-card>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
import Config from "@/js/config.js";
import util   from "@/js/util.js";
import registration from "./registration.vue";
import quickmenucon from "./quickmenucon.vue";
import registrationModify from "./registrationModify.vue";
import Constant from "@/store/store_constant.js";

export default {
    data() {
        return {
            ticksLabels: ["등록완료", "연동신청", "연동완료"],
            drawer: true,
            mini: false,

            editYn : false,
            editData : { jisu_id: "", jisu_seq : -1 },
            refreshYn : true,
        };
    },
    
    components: {
        registration,
        quickmenucon,
        registrationModify,
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
    },

    methods: {

        /*
         * Quick Menu -> [신규지수등록] 버튼 클릭시 신규지수등록 화면을 호출한다.
         * 2019-04-10  bkLove(촤병국)
         */
        async   fn_jisuRegister() {
            var vm = this;

            var typeCd  =   vm.$store.state.user.type_cd;

            if( !( typeCd == "9998" || typeCd == "9999" ) ) {
                if( typeCd != "0003" ) {

                    vm.$root.confirmt.open('확인','지수사업자만 등록하실수 있습니다.',{},1 );
                    return  false;
                }
            }

            if( await vm.$root.confirmt.open(
                        '[신규지수등록]',
                        '현재 작성중인 내용은 사라집니다. \n[신규지수등록] 화면으로 이동하시겠습니까?',
                        {}
                    ,   2
                )
            ) {
                if( "Y" != vm.$root.confirmt.val ) {
                    return false;
                }
            }

            vm.editYn = false;
            vm.$EventBus.$emit( "indexRegisterMain_registration_call", "clear" );            
        },

        fn_refresh( paramData ) {
            var vm = this;

            vm.editYn   = false;
            vm.refreshYn = false;

            vm.$nextTick().then( () => {
                vm.refreshYn = true;

                if( paramData ) {
                    vm.editData.jisu_id = paramData.jisu_id;
                    vm.editData.jisu_seq = paramData.jisu_seq;
                    vm.editYn   = true;
                }
            });
        },

        fn_moveRegisterPage() {
            var vm = this;

            vm.editYn = false;
            vm.refreshYn = false;

            vm.$nextTick().then( () => {
                vm.refreshYn = true;
                vm.$EventBus.$emit( "indexRegisterMain_registration_call", "clear" );
            });
        },
    }
};
</script>

