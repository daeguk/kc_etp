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
                                <v-btn
                                    small
                                    depressed
                                    outline
                                    color="primary"
                                    @click="indexFixDialog=true"
                                >내역확인</v-btn>

                                <ComIndexFixPopup   v-if="indexFixDialog"

                                                    :indexBasic="this.indexBasic" 
                                                    :indexFixDialog="this.indexFixDialog" 
                                                    
                                                    @fn_closePop="fn_closePop" >
                                </ComIndexFixPopup>                                
                            </v-subheader>


                            <p class="text_red">
                                <v-icon small>arrow_right</v-icon>3개 지수에 대한 조치 발생
                            </p>
                        </v-list-tile-content>


<v-btn @click='$router.push( "/etp/manage/etpOperInfoQuickInav")'>iNav Publ</v-btn><br>
<v-btn @click='$router.push( "/etp/manage/etpOperInfoQuickPerformance")'>ETP Performance Publ</v-btn><br>

                        <v-list-tile-content class="rightmenu_con Oper_menu">

                            <v-subheader>
                                <v-icon small>build</v-icon>Operation Tools
                            </v-subheader>

                            <v-card flat class="w100">
                                <v-list>
                                    <v-list-tile
                                        class="border_b"
                                        @click="fn_setInavData"
                                    >
                                        <v-list-tile-avatar>
                                            <v-icon value="산출 현황">exposure</v-icon>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>iNAV 산출 현황</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>


                                    <v-list-tile
                                        class="border_b"
                                        @click="fn_setEtpPerformanceData"
                                    >
                                        <v-list-tile-avatar>
                                            <v-icon value="Performance" icon>loop</v-icon>
                                        </v-list-tile-avatar>

                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>ETP Performance</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>




                                    <v-dialog v-model="customizeDialog" persistent max-width="550">
                                        <template v-slot:activator="{ on }">
                                            <v-list-tile v-on="on" class="border_b">
                                                <v-list-tile-avatar>
                                                    <v-icon value="Customize" icon>poll</v-icon>
                                                </v-list-tile-avatar>

                                                <v-list-tile-content class="rm_con_h">
                                                    <v-list-tile-title>Customize</v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </template>



                                        <!---ETP운용화면 항목설정  팝업-->
                                        <v-card class="listset_pop">
                                            <h5>
                                                <v-card-title ma-0>
                                                    ETP 운용화면 항목설정
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon @click="customizeDialog = false">
                                                        <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                            </h5>

                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="iNAV"
                                                        value="f15301"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="기초지수명"
                                                        value="index_nm"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="ETF전일가"
                                                        value="f18001"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="전일NAV"
                                                        value="f03329"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="기초지수현재가"
                                                        value="index_f15001"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="AUM"
                                                        value="f30812"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="추적오차율"
                                                        value="f15302"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="기초지수전일가"
                                                        value="prev_f15001"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="과표기준가"
                                                        value="f15007"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="괴리율"
                                                        value="f15304"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="ETF현재가"
                                                        value="f15001"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="arrCustomizeColumn"
                                                        label="과세구분"
                                                        value="f16073"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>

                                            <v-card flat class="pop_btn_w text-xs-center">
                                                <v-btn depressed color="primary" @click="fn_setCustomizeData">추가하기</v-btn>
                                            </v-card>
                                        </v-card>
                                        <!---ETP운용화면 항목설정 팝업 end-->
                                    </v-dialog>
                                </v-list>
                            </v-card>
                        </v-list-tile-content>



                        <!-- 관심종목 영역 -->
                        <ComFavorItemSub    v-if="showFaver" 
                        
                                            @showDetail="showDetail" 
                                            @showMessageBox="showMessageBox"
                        ></ComFavorItemSub>

                    </v-list>
                </v-navigation-drawer>
            </v-card>
            <!--rightmenu end--->

        </v-layout>

    </v-container>
</template>


<script>
import ComIndexFixPopup from "@/components/common/popup/ComIndexFixPopup.vue";
import ComFavorItemSub from "@/components/common/control/ComFavorItemSub"; 

export default {
    props: [ "indexBasic" ],

    components: {
            ComIndexFixPopup    :   ComIndexFixPopup
        ,   ComFavorItemSub     :   ComFavorItemSub
    },
    data() {
        return {
            text: "전종목",
            checkbox: true,
            text2: "",
            dialog: false,
            dialog2: false,
            dialog5: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            items1: ["전체", "시장대표"],
            items: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            items2: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                },
                {
                    title: "KODEX 코스닥150 레버러지",
                    subtitle: "122630"
                }
            ],
            items3: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                }
            ],
            items4 : [],
            selected : [],

            mini: false,
            right: null,
            rowsPerPageItems: [10, 20, 30, 50],
            headers: [
                {
                    text: "Code",
                    align: "left",
                    value: "name"
                },
                { text: "name", value: "name" },
                { text: "BasePrc", value: "BasePrc", align: "right" },
                { text: "Shrs", value: "Shrs", align: "right" },
                { text: "Float rto", value: "FloatRto", align: "right" },
                { text: "Ceiling rto", value: "CeilingRto", align: "right" },
                { text: "Factor rto", value: "FactorRto", align: "right" }
            ],
            desserts: [],

            toggleINav : false,
            toggleEtpPerformance : false,
            arrCustomizeColumn : [],
            customizeDialog : false,

            indexFixDialog : false,
            showFaver : true,
        };
    },
    mounted: function() {},
    created: function() {},
    beforeDestory: function() {},

    methods : {

        /*
         * 지수조치현황 팝업창을 종료한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_closePop( param )  {
            var vm = this;

            vm.indexFixDialog   =   false;
        },        

        /*
         *  EtpOperInfo.vue -> fn_setInavData 함수를 호출한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setInavData() {
            var vm = this;
            vm.toggleINav  =   !vm.toggleINav;

            var paramData   =   {};
            paramData.toggleINav    =   vm.toggleINav;

            console.log("########## EtpOperInfoQuick.vue -> fn_setInavData START ############");
            vm.$emit( "fn_setInavData", paramData );
            console.log("########## EtpOperInfoQuick.vue -> fn_setInavData END ############");
        },

        /*
         *  EtpOperInfo.vue -> fn_setEtpPerformanceData 함수를 호출한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setEtpPerformanceData() {
            var vm = this;
            vm.toggleEtpPerformance  =   !vm.toggleEtpPerformance;

            var paramData   =   {};
            paramData.toggleEtpPerformance    =   vm.toggleEtpPerformance;            

            console.log("########## EtpOperInfoQuick.vue -> fn_setEtpPerformanceData START ############");
            vm.$emit( "fn_setEtpPerformanceData", paramData );
            console.log("########## EtpOperInfoQuick.vue -> fn_setEtpPerformanceData END ############");
        },

        /*
         *  EtpOperInfo.vue -> fn_setCustomizeData 함수를 호출한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setCustomizeData() {
            var vm = this;
            var arrFixTitle = [ "f16002" ];     /* 종목은 선택하지 않아도 출력되게 수정 */

            console.log("########## EtpOperInfoQuick.vue -> fn_setCustomizeData START ############");

            vm.customizeDialog  =   false;

            /* 고정으로 노출할 항목이 중복으로 존재하는지 체크한다. */
            arrFixTitle.forEach(function(e,i) {
                var same = vm.arrCustomizeColumn.filter(function(o, p) {
                    return o === e;
                });

                if( same.length == 0 ) {
                    vm.arrCustomizeColumn.unshift( e );
                }
            });

            vm.$emit( "fn_setCustomizeData", vm.arrCustomizeColumn );

            console.log("########## EtpOperInfoQuick.vue -> fn_setCustomizeData END ############");
        },

        /*
         *  관심종목에서 그래프 선택시 상세정보를 보여준다.
         *  2019-05-03  bkLove(촤병국)
         */
        showDetail: function(gubun, paramData) {
            var vm = this;
            vm.$emit( "showDetail", gubun, paramData );
        },

        /*
         *  메시지창 정보가 필요한 경우 해당 정보를 보여준다.
         *  2019-05-03  bkLove(촤병국)
         */        
        showMessageBox: function(title, msg, option, gubun) {
            var vm = this;
            vm.$emit( "showMessageBox", title, msg, option, gubun );
        }        
    }
};
</script>

