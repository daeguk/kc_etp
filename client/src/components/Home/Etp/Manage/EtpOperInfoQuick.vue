<template>
  <v-container>
    <v-layout row wrap>
      <v-card flat class="right_menu_w2 ver3">
        <v-list class="pt-0" dense>
          <v-list-tile-content class="rightmenu_con">
            <v-subheader>지수 조치 현황
              <v-btn
                small
                depressed
                outline
                color="primary"
                @click="fn_showDetailIndex"
                :disabled = "fix_info.fix_disabled"
              >내역확인</v-btn>
            </v-subheader>
            <!--p class="text_red">
                <v-icon small>arrow_right</v-icon>{{ fix_info.fix_msg }}
            </p-->
          </v-list-tile-content>
            <v-list-tile-content class="rightmenu_con case2 Oper_menu">
              <v-subheader>Operation Tools</v-subheader>
              <v-card flat class="w100">
                <v-list>
                  <v-list-tile
                    :class="( toggleINav ? 'border_b select' : 'border_b' )"
                    @click="fn_setInavData"
                    v-model="toggleINav">
                  <v-list-tile-avatar>
                    <!--click,hover시 select 클래스 추가-->
                    <div :class="( toggleINav ? 'oper_list_icon select' : 'oper_list_icon' )"><span class="icon1"></span></div>
                  </v-list-tile-avatar>
                  <v-list-tile-content class="rm_con_h">
                    <v-list-tile-title>실시간투자지표산출현황</v-list-tile-title>
                  </v-list-tile-content>
                  </v-list-tile>

                    <v-list-tile
                      :class="( toggleEtpPerformance ? 'border_b select' : 'border_b' )"
                      @click="fn_setEtpPerformanceData"
                      v-model="toggleEtpPerformance">
                      <v-list-tile-avatar>
                        <div :class="( toggleEtpPerformance ? 'oper_list_icon select' : 'oper_list_icon' )"><span class="icon2"></span></div>
                      </v-list-tile-avatar>
                      <v-list-tile-content class="rm_con_h">
                        <v-list-tile-title>Performance</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile
                        v-if="testFlag"
                        :class="( toggleEtpLpspread ? 'border_b select' : 'border_b' )"
                        @click="fn_setEtpLpspread"
                        v-model="toggleEtpLpspread">
                        <!--
                        <v-list-tile-avatar>
                          <div class="text-xs-center">
                            <v-menu v-model="showLpSpreadTooltip" :nudge-width="80" offset-x left class="arrow_menu">
                              <template v-slot:activator="{ on }">
                                <div :class="( toggleEtpLpspread ? 'oper_list_icon select' : 'oper_list_icon' )"><span class="icon9"></span></div>
                              </template>
                              <v-layout>
                                <v-flex>
                                  <div class="arrow_box">
                                  <span>신규 서비스</span>
                                  <v-btn flat @click="fn_closePdfTooltip()" icon small dark><v-icon>close</v-icon></v-btn>
                                  </div>
                                </v-flex>
                                <v-flex class="arrow_flex"></v-flex>
                              </v-layout>
                            </v-menu>
                          </div>
                        </v-list-tile-avatar>
                        -->
                      <v-list-tile-avatar>
                        <div :class="( toggleEtpLpspread ? 'oper_list_icon select' : 'oper_list_icon' )"><span class="icon9"></span></div>
                      </v-list-tile-avatar>
                        <v-list-tile-content class="rm_con_h">
                          <v-list-tile-title>LP spread</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-dialog v-model="customizeDialog" persistent max-width="650">
                      <template v-slot:activator="{ on }">
                        <v-list-tile v-on="on" @click="toggleCustomize=true;toggleINav=false;toggleEtpPerformance=false;" :class="( toggleCustomize ? 'border_b select' : 'border_b' )">
                          <v-list-tile-avatar>
                            <div :class="( toggleCustomize ? 'oper_list_icon select' : 'oper_list_icon' )"><span class="icon3"></span></div>
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

                            <v-layout wrap>
                              <v-flex xs3 v-for="arr in arrCol" :key="arr.val">
                                <v-checkbox v-model="arr.checked" :label="arr.label" :value="arr.val"></v-checkbox>
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
          <ComEtpFavorItemSub
            v-if="showFaver" 
            :faverSize = "faverSize"
            @showDetail="showDetail">
          </ComEtpFavorItemSub>
        </v-list>
      </v-card>
    </v-layout>
  </v-container>
</template>
<style scoped>
.v-menu__content{box-shadow: none !important;}
</style>

<script>
import util       from "@/js/util.js";
import Config from '@/js/config.js';
import Constant from "@/store/store_constant.js"

import ComIndexFixPopup     from "@/components/common/popup/ComIndexFixPopup.vue";
import ComEtpFavorItemSub   from "@/components/common/control/ComEtpFavorItemSub.vue"; 

export default {
  props: [ "etpBasic", "toggle" ],
  components: {
    ComIndexFixPopup, ComEtpFavorItemSub
  },
  data() {
    return {
      checked: true,
      showLpSpreadTooltip : true,
      showFaver : true,
      toggleINav : false,
      toggleEtpPerformance : false,
      toggleEtpLpspread : false,
      toggleCustomize : false,
      arrCustomizeColumn : [],
      arrCol: [
        {checked: "F15001", label:"ETF현재가", val: "F15001"},
        {checked: "F15301", label:"iNAV", val: "F15301"},
        {checked: "F03329", label:"전일NAV", val: "F03329"},
        {checked: "F19329", label:"추적오차율(전일)", val: "F19329"},
        {checked: "F19330", label:"괴리율", val: "F19330"},
        {checked: "F34777", label:"기초지수명", val: "F34777"},
        {checked: "F15318", label:"지수", val: "F15318"},
        {checked: "", label:"락구분", val: "F16073"},
        {checked: "", label:"순자산총액(백만)", val: "F16500"},
        {checked: "", label:"기준가", val: "F15007"},
        {checked: "", label:"국제표준코드", val: "F16012"},
        {checked: "", label:"상장일", val: "F16017"},
        {checked: "", label:"복제방법", val: "F34514"},
        {checked: "", label:"총보수", val: "F34763"},
        {checked: "", label:"과세구분", val: "F33833"},
        {checked: "", label:"거래량", val: "F15015"},
        {checked: "", label:"거래대금", val: "F15023"},
        {checked: "", label:"발행주식수", val: "F16143"},
        {checked: "", label:"1CU주식수", val: "F16499"},
        {checked: "", label:"설정주식수(전일)", val: "F33835"},
        {checked: "", label:"환매주식수(전일)", val: "F33836"},
      ],
      customizeDialog : false,
      indexFixDialog : false,
      showFaver : true,
      testFlag : false,
      /* 지수 조치현황 */
      fix_info : {
        fix_disabled : true,
        fix_msg : "조치현황 없음"
      },
      faverSize : 448,
    };
  },
  mounted: function() {
    var vm = this;

    if( vm.toggle ) {
      if( vm.toggle.toggleINav ) {
        vm.toggleINav   =   vm.toggle.toggleINav;
      }
      if( vm.toggle.toggleEtpPerformance ) {
        vm.toggleEtpPerformance   =   vm.toggle.toggleEtpPerformance;
      }
      if( vm.toggle.toggleEtpLpspread ) {
        vm.toggleEtpLpspread   =   vm.toggle.toggleEtpLpspread;
      }
      if( vm.toggle.toggleCustomize ) {
        vm.toggleCustomize   =   vm.toggle.toggleCustomize;
      }
      if( vm.toggle.arrCustomizeColumn ) {
        vm.arrCustomizeColumn   =   vm.toggle.arrCustomizeColumn;
      }
    }

    var tmp = this.$store.state.user.email;
    if(tmp.indexOf("test@") !== -1) this.testFlag = true;
    if( typeof Config.showLpSpreadTooltip != "undefined" ) {
// console.log( ">>>>>>>>>>>>> $$$$$$$$$$$$ Config.showLpSpreadTooltip=", Config.showLpSpreadTooltip );
      vm.showLpSpreadTooltip   =   Config.showLpSpreadTooltip;
    }
  },
  methods : {
    fn_showDetailIndex() {
      this.$emit( "fn_showDetailIndex", 4, this.etpBasic );
    },
    /*
      * 지수조치현황 팝업창을 종료한다.
      * 2019-04-16  bkLove(촤병국)
      */
    fn_closePop( param )  {
      vm.indexFixDialog   =   false;
    },        

    /*
      *  EtpOperInfo.vue -> fn_setInavData 함수를 호출한다.
      *  2019-05-03  bkLove(촤병국)
      */
    fn_setInavData() {
      var vm = this;
      var paramData   =   {};

      vm.toggleINav       =   !vm.toggleINav;
      vm.toggleEtpPerformance =   false;
      vm.toggleEtpLpspread =   false;
      vm.toggleCustomize  =   false;
      paramData.toggleINav    =   vm.toggleINav;

      // console.log("########## EtpOperInfoQuick.vue -> fn_setInavData START ############");
      vm.$emit( "fn_setInavData", paramData );
      // console.log("########## EtpOperInfoQuick.vue -> fn_setInavData END ############");
    },

    /*
      *  EtpOperInfo.vue -> fn_setEtpPerformanceData 함수를 호출한다.
      *  2019-05-03  bkLove(촤병국)
      */
    fn_setEtpPerformanceData() {
      var vm = this;
      var paramData   =   {};

      vm.toggleEtpPerformance =   !vm.toggleEtpPerformance;
      vm.toggleINav  =   false;
      vm.toggleEtpLpspread  =   false;
      vm.toggleCustomize      =   false;
      paramData.toggleEtpPerformance    =   vm.toggleEtpPerformance;            

      // console.log("########## EtpOperInfoQuick.vue -> fn_setEtpPerformanceData START ############");
      vm.$emit( "fn_setEtpPerformanceData", paramData );
      // console.log("########## EtpOperInfoQuick.vue -> fn_setEtpPerformanceData END ############");
    },

    fn_setEtpLpspread() {
      var vm = this;
      var paramData   =   {};

      vm.toggleEtpLpspread =   !vm.toggleEtpLpspread;
      vm.toggleINav  =   false;
      vm.toggleEtpPerformance =   false;
      vm.toggleCustomize      =   false;
      paramData.toggleEtpLpspread    =   vm.toggleEtpLpspread;            

      // console.log("########## EtpOperInfoQuick.vue -> fn_setEtpLpspread START ############");
      vm.$emit( "fn_setEtpLpspread", paramData );
      // console.log("########## EtpOperInfoQuick.vue -> fn_setEtpLpspread END ############");
    },

    /*
      *  EtpOperInfo.vue -> fn_setCustomizeData 함수를 호출한다.
      *  2019-05-03  bkLove(촤병국)
      */
    fn_setCustomizeData() {
      var vm = this;
      var paramData   =   {};

      vm.toggleINav  =   false;
      vm.toggleEtpPerformance =   false;
      vm.toggleEtpLpspread =   false;
      vm.toggleCustomize      =   true;
      vm.customizeDialog  =   false;

      paramData.toggleCustomize    =   vm.toggleCustomize;
      vm.arrCustomizeColumn = [];
      vm.arrCustomizeColumn.push("F16002");
      vm.arrCol.forEach(function(item) {
        if(item.checked == item.val) vm.arrCustomizeColumn.push(item.val);
      });
      paramData.arrCustomizeColumn    =   vm.arrCustomizeColumn;
      vm.$emit( "fn_setCustomizeData", paramData );
    },

    /*
      *  관심종목에서 그래프 선택시 상세정보를 보여준다.
      *  2019-05-03  bkLove(촤병국)
      */
    showDetail: function(gubun, paramData) {

      console.log("EtpOperInfoQuick..............showDetail.....");
      this.$emit( "showDetail", gubun, paramData );
    },

    /*
      *  메시지창 정보가 필요한 경우 해당 정보를 보여준다.
      *  2019-05-03  bkLove(촤병국)
      */        
    fn_closePdfTooltip() {
      this.showLpSpreadTooltip = false; 
      Config.showLpSpreadTooltip = false;
    }  
  }
};
</script>

