<template>
  <v-container>
    <v-layout row wrap>
      <v-card flat class="right_menu_w2">
        <v-list class="pt-0" dense>
          <v-list-tile-content class="rightmenu_con">
            <v-subheader>
              지수 조치 현황
              <v-btn
                small
                depressed
                outline
                color="primary"
                @click="fn_showDetailIndex"
                :disabled="fix_info.fix_disabled"
              >내역확인</v-btn>
            </v-subheader>
            <!--p class="text_red">
                                <v-icon small>arrow_right</v-icon>{{ fix_info.fix_msg }}
            </p-->
          </v-list-tile-content>
          <v-list-tile-content class="rightmenu_con case2 Oper_menu">
            <v-subheader>
              <v-icon small>build</v-icon>PDF Tools
            </v-subheader>
            <v-card flat class="w100 ver2">
              <v-list>
                <v-list-tile
                  :class="( toggle.togglePdfEmergencyPop ? 'border_b select' : 'border_b' )"
                  @click.stop="fn_showDetailPdf(6)"
                >
                  <v-list-tile-avatar>
                    <!--말풍선 추가---->
                    <!--div class="text-xs-center">
                                                <v-menu v-model="showPdfTooltip" :nudge-width="200" offset-x left class="arrow_menu">
                    <template v-slot:activator="{ on }"-->
                    <div
                      :class="( toggle.togglePdfEmergencyPop ? 'oper_list_icon select' : 'oper_list_icon' )"
                    >
                      <span class="icon5"></span>
                    </div>
                    <!--/template>
                                                    
                                                    <v-layout>
                                                        <v-flex >
                                                            <div class="arrow_box">
                                                            <span> 해당 기능은 점검 중입니다. 점검이 완료되는 시점에 다시 안내드리겠습니다.</span>
                                                            <v-btn flat @click="fn_closePdfTooltip()" icon small dark><v-icon>close</v-icon></v-btn>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex class="arrow_flex"></v-flex>
                                                    </v-layout>
                                                </v-menu>
                                            </div>
                    -->
                    <!---말풍선 추가end---->
                  </v-list-tile-avatar>
                  <v-list-tile-content class="rm_con_h">
                    <v-list-tile-title>PDF 긴급반영</v-list-tile-title>
                    <v-list-tile-sub-title>종목 추가, 수량 변경 요청</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile
                  :class="( toggle.toggleIanvPop ? 'border_b select' : 'border_b' )"
                  @click.stop="fn_showDetailPdf(7)"
                >
                  <v-list-tile-avatar>
                    <div
                      :class="( toggle.toggleIanvPop ? 'oper_list_icon select' : 'oper_list_icon' )"
                    >
                      <span class="icon6"></span>
                    </div>
                  </v-list-tile-avatar>
                  <v-list-tile-content class="rm_con_h">
                    <v-list-tile-title>iNAV 계산기</v-list-tile-title>
                    <v-list-tile-sub-title>플랫폼 상에서 iNAV계산</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                  :class="( togglePdfByRate ? 'border_b select' : 'border_b' )"
                  @click="fn_setEtpOperPdfByRate"
                  v-model="togglePdfByRate"
                >
                  <v-list-tile-avatar>
                    <div :class="( togglePdfByRate ? 'oper_list_icon select' : 'oper_list_icon' )">
                      <span class="icon7"></span>
                    </div>
                  </v-list-tile-avatar>
                  <v-list-tile-content class="rm_con_h">
                    <v-list-tile-title>비중 변경현황</v-list-tile-title>
                    <v-list-tile-sub-title>최근 5일간 비중 변경내역</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-list-tile-content>
          <ComEtpFavorItemSub v-if="showFaver" :faverSize="faverSize" @showDetail="showDetail"></ComEtpFavorItemSub>
        </v-list>
      </v-card>
    </v-layout>
  </v-container>
</template>

<style scoped>
.v-menu__content {
  box-shadow: none !important;
}
</style>

<script>
  import util from "@/js/util.js";
  import _ from "lodash";
  import Config from "@/js/config.js";
  import Constant from "@/store/store_constant.js";
  import ComEtpFavorItemSub from "@/components/common/control/ComEtpFavorItemSub.vue";
  export default {
    props: ["pdfData", "indexBasic", "toggle"],
    data() {
      return {
        showPdfTooltip: true,
        showFaver: true,
        //togglePdfEmergencyPop : false,
        //toggleIanvPop : false,
        togglePdfByRate: false,
        /* 지수 조치현황 */
        fix_info: {
          fix_disabled: true,
          fix_msg: "조치현황 없음"
        },
        faverSize: 430,
        exists_now_pdf_yn: "N",
      };
    },
    components: {
      ComEtpFavorItemSub: ComEtpFavorItemSub
    },
    mounted: function() {
      var vm = this;
      console.log(">>>>>>>>>>>>>>>>>>>> EtpOperPdfQuick.vue pdfData mounted");
      console.log(vm.pdfData);
      if(typeof Config.showPdfTooltip != "undefined") {
        console.log(">>>>>>>>>>>>> $$$$$$$$$$$$ Config.showPdfTooltip=", Config.showPdfTooltip);
        vm.showPdfTooltip = Config.showPdfTooltip;
      }
    },
    created: function() {},
    beforeDestory: function() {},
    methods: {
      fn_showDetailIndex() {
        var vm = this;
        vm.$emit("fn_showDetailIndex", 4, vm.indexBasic);
      },
      /*
       *  관심종목에서 그래프 선택시 상세정보를 보여준다.
       *  2019-05-03  bkLove(촤병국)
       */
      showDetail: function(gubun, paramData) {
        var vm = this;
        vm.$emit("showDetail", gubun, paramData);
      },
      fn_setEtpOperPdfByRate: function() {
        var vm = this;
        /* 기초 데이터가 존재하는지 체크 */
        if(!vm.pdfData || Object.keys(vm.pdfData).length == 0) {
          vm.$root.confirmt.open('확인', '기초 데이터가 존재하지 않습니다.', {}, 1);
          return false;
        }
        /* 기준 데이터가 존재하는지 체크 */
        if(!vm.pdfData.F16012 || !vm.pdfData.F16493) {
          vm.$root.confirmt.open('확인', '기준 데이터가 존재하지 않습니다.', {}, 1);
          return false;
        }
        /* ETF 인지 체크 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
        if(!(vm.pdfData.F16493 == "1" || vm.pdfData.F16493 == "2")) {
          vm.$root.confirmt.open('확인', 'ETF 상품만 가능합니다.', {}, 1);
          return false;
        }
        vm.togglePdfByRate = !vm.togglePdfByRate;
        //            vm.togglePdfEmergencyPop    =   false;
        //            vm.toggleIanvPop            =   false;
        var paramData = {};
        paramData.togglePdfByRate = vm.togglePdfByRate;
        vm.$emit("fn_setEtpOperPdfByRate", paramData);
      },
      fn_showDetailPdf: function(gubun) {
        var vm = this;
        // console.log( " EtpOperPdfQuick.vue -> fn_showDetailPdf #################" );
        // console.log( vm.pdfData );
        /* 기초 데이터가 존재하는지 체크 */
        if(!vm.pdfData || Object.keys(vm.pdfData).length == 0) {
          vm.$root.confirmt.open('확인', '기초 데이터가 존재하지 않습니다.', {}, 1);
          return false;
        }
        /* 기준 데이터가 존재하는지 체크 */
        if(!vm.pdfData.F16012 || !vm.pdfData.F16493) {
          vm.$root.confirmt.open('확인', '기준 데이터가 존재하지 않습니다.', {}, 1);
          return false;
        }
        /* ETF 인지 체크 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
        if(!(vm.pdfData.F16493 == "1" || vm.pdfData.F16493 == "2")) {
          vm.$root.confirmt.open('확인', 'ETF 상품만 가능합니다.', {}, 1);
          return false;
        }
        /* PDF 긴급반영인 경우 */
        if(gubun == 6) {
          //                vm.togglePdfEmergencyPop    =   true;
          //                vm.toggleIanvPop            =   false;
          vm.togglePdfByRate = false;
          // console.log( "krx_cd >>>>>>>>>>>>>>>>>>>>>" + vm.$store.state.user.krx_cd );
          var typeCd = vm.$store.state.user.type_cd;
          if(!(typeCd == "9998" || typeCd == "9999")) {
            if(vm.$store.state.user.krx_cd != vm.pdfData.F33960) {
              vm.$root.confirmt.open('확인', '타 발행사의 종목은 PDF 긴급반영 하실 수 없습니다.', {}, 1);
              return false;
            }
          }
          vm.fn_getExistsNowPdfBaisc().then(function(e) {
            if(!e || !e.result) {
              return false;
            }
            if(vm.exists_now_pdf_yn != "Y") {
              vm.$root.confirmt.open('확인', '과거 PDF 는 수정할 수 없습니다', {}, 1);
              return false;
            }
            vm.$emit("fn_showDetailPdf", gubun, vm.pdfData);
          });
        }
        /* iNAV 계산기인 경우 */
        else if(gubun == 7) {
          //                vm.togglePdfEmergencyPop    =   false;
          //                vm.toggleIanvPop            =   true;
          vm.togglePdfByRate = false;
          var gubun = "7";
          /* 0-PDF, 1-지수 수익율 */
          if(vm.pdfData.F33929 == "0") {
            gubun = "7";
            vm.$emit("fn_showDetailPdf", gubun, vm.pdfData);
          } else if(vm.pdfData.F33929 == "1") {
            gubun = "8";
            vm.$emit("fn_showDetailPdf", gubun, vm.pdfData);
          }
        }
      },
      /*
       * 현재일자에 pdf basic 데이터가 존재하는지 체크한다.
       * 2019-05-03  bkLove(촤병국)
       */
      async fn_getExistsNowPdfBaisc() {
        var vm = this;
        return await new Promise(function(resolve, reject) {
          // console.log( "fn_getExistsNowPdfBaisc called" );
          vm.$root.progresst.open();
          util.axiosCall({
            "url": Config.base_url + "/user/etp/getExistsNowPdfBaisc",
            "data": vm.pdfData,
            "method": "post"
          }, function(response) {
            try {
              vm.$root.progresst.close();
              if(response.data) {
                var msg = (response.data.msg ? response.data.msg : "");
                if(!response.data.result) {
                  if(msg) {
                    resolve({result: false});
                  }
                }
                vm.exists_now_pdf_yn = response.data.exists_now_pdf_yn;
              }
              resolve({result: true});
            } catch (ex) {
              vm.$root.progresst.close();
              console.log("error", ex);
              resolve({result: false});
            }
          }, function(error) {
            vm.$root.progresst.close();
            if(error) {
              vm.$root.confirmt.open('확인', error, {}, 4);
            }
            resolve({result: false});
          });
        }).catch(function(e) {
          console.log(e);
          vm.$root.progresst.close();
          vm.$root.confirmt.open('확인', '서버로 부터 응답을 받지 못하였습니다.', {}, 4);
          //                resolve(false);
        });
      },
      fn_closePdfTooltip() {
        var vm = this;
        vm.showPdfTooltip = false;
        Config.showPdfTooltip = false;
      }
    }
  };
</script>