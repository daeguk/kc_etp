<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <v-card flat ma-3>
      <div class="title01_w">
        <v-card-title primary-title>
          <div class="title_wrap01">
            <h3 class="headline mb-0">
              {{title}}
            </h3>
            <div class="right_btn">
              <v-layout align-right>
                <v-flex xs12 sm4 text-xs-center>                                         
                  <div class="btn_r">
                    <v-btn icon  @click.stop="closeModal">
                        <v-icon>close</v-icon>
                    </v-btn>
                  </div>
                </v-flex>
              </v-layout>
              </div>
          </div>
        </v-card-title>
      </div>
      <div class="table-box-wrap">
        <div ref="table1" class="table-box" style="max-height:800px;">
        <table class="tbl_type ver8">
          <colgroup>
            <col width="10%">
            <col width="40%">
            <col width="20%">
            <col width="30%">
          </colgroup>
          <thead>
            <tr>
              <th style="width:10%" class="txt_center">순위</th>
              <th style="width:40%" class="txt_center">종목명</th>
              <th style="width:20%" class="txt_center">종목코드</th>
              <th style="width:30%" class="txt_center">자금유출입</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemList" :key="index">
              <td class="txt_right"><span :class="{text_hightlight:(item.F16013==curCode)}">{{index+1}}</span></td>
              <td class="txt_right"><span :class="{text_hightlight:(item.F16013==curCode)}">{{item.F16002}}</span></td>
              <td class="txt_right"><span :class="{text_hightlight:(item.F16013==curCode)}">{{item.F16013}}</span></td>
              <td class="txt_right"><span :class="{text_hightlight:(item.F16013==curCode)}">{{formatInt(Math.floor(item.FLOW))}}</span></td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>

import Config from "@/js/config.js";
import util from "@/js/util.js";

export default {
  props: ['gubun', 'itemList', 'curCode', 'rank'],
  data() {
    return {
        dialog: false, 
        title: "",
    };
  },
  components: {
  }, 
  computed: {},
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
    var vm = this;
    this.dialog = true;
    if(this.gubun == 0) this.title = "1주";
    else if(this.gubun == 1) this.title = "1개월";
    else if(this.gubun == 2) this.title = "3개월";
    else if(this.gubun == 3) this.title = "6개월";
    this.title = this.title + " 자금유입 순위";
    // console.log("EtpRankPopup......");
    // console.log(this.itemList);
  },
  updated() {
    var factor = 26;
    if(this.rank < 100) factor = 15;
    this.$refs.table1.scrollTop = (this.rank - 1) * factor;
    // console.log(this.$refs.table1.scrollTop);
  },
  methods: {
    closeModal: function() {
      var vm = this;
      vm.$emit("closeRankModal");
      vm.dialog = false;
    },
    formatInt:function(num) {
        return util.formatInt(num);
    },
  } 
};
</script>

<style scoped>
.text_hightlight {
  background-color: yellow;
}
</style>