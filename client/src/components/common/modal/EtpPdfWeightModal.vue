<template>
  <v-layout>
    <v-flex>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card flat height="650px">
          <h5>
            <v-card-title ma-0>
              <h5>
                종목 비중정보
                <span class="pl-0">({{etpBasic.F16002}})</span>
              </h5>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeModal">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
          </h5>
          <div class="index3pop2_con">
            <v-list subheader two-line>
              <v-list-tile>
                <v-list-tile-title>Total</v-list-tile-title>
                <v-list-tile-content>{{jCnt}}</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </div>
          <div class="table-box-wrap">
            <div class="table-box" style="max-height:500px;">
              <table class="tbl_type ver8">
                <caption>헤더 고정 테이블</caption>
                <colgroup>
                  <col width="30%" />
                  <col width="30%" />
                  <col width="20%" />
                  <col width="20%" />
                </colgroup>
                <thead>
                  <tr>
                    <th style="width:30%" class="txt_left">Code</th>
                    <th style="width:30%" class="txt_left">Name</th>
                    <th style="width:20%" class="txt_right">Allocation</th>
                    <th style="width:20%" class="txt_right">GUBUN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in etpWeight" :key="index">
                    <td class="txt_left">{{item.ISIN_CODE}}</td>
                    <td class="txt_left">{{item.JONG_NM}}</td>
                    <td class="txt_right">{{item.PERCNT}} %</td>
                    <td class="txt_right">{{fn_F33861_nm( item.GUBUN )}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
  import Config from "@/js/config.js"
  export default {
    props: ['etpBasic', 'etpWeight'],
    data() {
      return {
        dialog: false,
        jCnt: 0,
        jList: [],
      };
    },
    watch: {
      'etpBasic': function() {
        // console.log("watch.........etpWeight ");
        // console.log(this.etpWeight);
        // this.dataInit();
        this.jCnt = this.etpWeight.length;
      },
    },
    computed: {},
    components: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
      this.dialog = true;
      this.jCnt = this.etpWeight.length;
      console.log("openModal Two............");
    },
    methods: {
      closeModal: function() {
        var vm = this;
        vm.$emit("closeWeightModal");
        vm.dialog = false;
      },
      fn_F33861_nm(data) {
        var htm = "";
        if(data == 0) {
          htm = 'KSP';
        } else if(data == 1) {
          htm = 'KSQ';
        } else if(data == 2) {
          htm = '기타';
        } else if(data == 3) {
          htm = '채권';
        } else if(data == 4) {
          htm = '파생';
        }
        return htm;
      }
    }
  }
</script>