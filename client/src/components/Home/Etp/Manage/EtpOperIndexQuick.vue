<template>
  <v-container>
    <v-layout row wrap>
      <v-card flat class="right_menu_w2 w100">
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
                                <v-icon small>arrow_right</v-icon> {{ fix_info.fix_msg }}
            </p-->
          </v-list-tile-content>
          <v-list-tile-content class="rightmenu_con case2 Oper_menu">
            <v-subheader>Operation Tools</v-subheader>
            <v-card flat class="w100">
              <v-list>
                <v-list-tile
                  :class="( toggleIndexOversea ? 'border_b select' : 'border_b' )"
                  @click="fn_setEtpOperIndexOversea"
                  v-model="toggleIndexOversea"
                >
                  <v-list-tile-avatar>
                    <div
                      :class="( toggleIndexOversea ? 'oper_list_icon select' : 'oper_list_icon' )"
                    >
                      <span class="icon4"></span>
                    </div>
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
    </v-layout>
  </v-container>
</template>


<script>
  //import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";
  export default {
    props: ["indexBasic"],
    components: {
      //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
      return {
        toggleIndexOversea: false,
        /* 지수 조치현황 */
        fix_info: {
          fix_disabled: true,
          fix_msg: "조치현황 없음"
        }
      };
    },
    mounted: function() {},
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
      fn_setEtpOperIndexOversea: function() {
        var vm = this;
        vm.toggleIndexOversea = !vm.toggleIndexOversea;
        var paramData = {};
        paramData.toggleIndexOversea = vm.toggleIndexOversea;
        vm.$emit("fn_setEtpOperIndexOversea", paramData);
      }
    }
  };
</script>