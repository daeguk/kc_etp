<template>
  <div>
    <v-list-tile>
      <v-list-tile-content>
        <v-card flat class="right_menu_sub_title">지수 등록 현황</v-card>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile class="right_menu_con_w" v-for="(item, index) in indexSelectList" :key="index">
      <v-list-tile-content class="w_1">
        <v-toolbar flat>
          <v-toolbar-title>{{item.jisu_kor_nm}}</v-toolbar-title>
          <v-spacer></v-spacer>

          <button
            type="button"
            class="btn_icon v-icon material-icons"
            @click="fn_showJisuEdit({ 'jisu_id' : item.jisu_id, 'jisu_seq' : item.jisu_seq } )"
          >edit</button>
        </v-toolbar>
        <v-range-slider
          :tick-labels="statusList"
          :value="item.arr_status_position"
          always-dirty
          min="0"
          max="2"
          ticks="always"
          readonly
        ></v-range-slider>
      </v-list-tile-content>
    </v-list-tile>
  </div>
</template>

<script>
  import Config from "@/js/config.js";
  import util from "@/js/util.js";
  import Constant from "@/store/store_constant.js";
  export default {
    data: () => ({
      // seasons: [ "등록완료", "연동신청", "연동완료" ],
      drawer: true,
      items: [{
        title: "Home",
        icon: "dashboard"
      }, {
        title: "About",
        icon: "question_answer"
      }],
      mini: false,
      right: null,
      statusList: [],
      /* 등록상태명 배열정보 */
      indexSelectList: [] /* 등록된 지수목록 */
    }),
    created() {
      this.fn_getStatusList();
    },
    mounted() {},
    beforeDestory: function() {},
    methods: {
      /*
       * 등록상태 목록을 조회한다.
       * 2019-04-10  bkLove(촤병국)
       */
      fn_getStatusList() {
        var vm = this;
        vm.$root.progresst.open();
        util.axiosCall({
          "url": Config.base_url + "/user/index/getStatusList",
          "data": {
            com_mst_cd: "COM001"
          },
          "method": "post"
        }, function(response) {
          try {
            vm.$root.progresst.close();
            if(response && response.data) {
              var msg = (response.data.msg ? response.data.msg : "");
              if(!response.data.result) {
                if(msg) {
                  vm.$root.confirmt.open('확인', msg, {}, 1);
                  return false;
                }
              }
              vm.statusList = response.data.arrList;
              vm.fn_getIndexSelectList();
            }
          } catch (ex) {
            vm.$root.progresst.close();
            console.log("error", ex);
          }
        }, function(error) {
          vm.$root.progresst.close();
          if(error) {
            vvm.$root.confirmt.open('확인', error, {}, 4);
          }
        });
      },
      /*
       * 등록된 인덱스 목록을 조회한다.
       * 2019-04-10  bkLove(촤병국)
       */
      fn_getIndexSelectList() {
        var vm = this;
        vm.$root.progresst.open();
        util.axiosCall({
          "url": Config.base_url + "/user/index/getIndexSelectList",
          "data": {},
          "method": "post"
        }, function(response) {
          try {
            vm.$root.progresst.close();
            if(response && response.data) {
              var msg = (response.data.msg ? response.data.msg : "");
              if(!response.data.result) {
                if(msg) {
                  vm.$root.confirmt.open('확인', msg, {}, 1);
                  return false;
                }
              }
              vm.indexSelectList = response.data.dataList;
            }
          } catch (ex) {
            vm.$root.progresst.close();
            console.log("error", ex);
          }
        }, function(error) {
          vm.$root.progresst.close();
          if(error) {
            vm.$root.confirmt.open('확인', error, {}, 4);
          }
        });
      },
      /*
       * 선택된 지수 정보를 조회한다.
       * 2019-04-10  bkLove(촤병국)
       */
      fn_showJisuEdit(param) {
        var vm = this;
        var typeCd = vm.$store.state.user.type_cd;
        if(!(typeCd == "9998" || typeCd == "9999")) {
          if(typeCd != "0003") {
            vm.$root.confirmt.open('확인', '지수사업자만 수정 하실수 있습니다.', {}, 1);
            return false;
          }
        }
        if(param) {
          /*
           * quickmenucon -> 수정버튼 버튼 클릭시 이벤트를 호출한다.
           */
          vm.$EventBus.$emit("quickmenucon_IndexRegisterMain_call", param);
        }
      }
    }
  };
</script>