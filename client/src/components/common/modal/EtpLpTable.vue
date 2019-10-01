<template>
  <v-container>
    <v-layout row wrap>
      <v-flex grow xs12 mt-2>
        <v-card flat>
          <v-card-title primary-title>
            <v-layout>
            <v-flex xs2>
              <span style="font-size:16px">일중 스프레드 현황</span>
            </v-flex>
            </v-layout>
          </v-card-title>

          <div class="table-box-wrap">
          <!--
            <div class="table-box" style="max-height:1000px;">
            -->
            <div class="table-box">
            <table class="tbl_type ver8">
              <caption> 헤더 고정 테이블</caption>
              <colgroup>
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
              </colgroup>
              <thead>
                <tr>
                  <th style="width:10%" class="txt_center">일자</th>
                  <th style="width:10%" class="txt_center">시간</th>
                  <th style="width:10%" class="txt_right">iNav</th>
                  <th style="width:10%" class="txt_right">NAV.chg</th>
                  <th style="width:10%" class="txt_right">현재가</th>
                  <th style="width:10%" class="txt_right">등락율</th>
                  <th style="width:10%" class="txt_right">LP매도호가</th>
                  <th style="width:10%" class="txt_right">LP매수호가</th>
                  <th style="width:10%" class="txt_right">LP스프레드</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in fn_convert_intra_data" :key="index">
                  <td class="txt_center">{{item.F20044}}</td>
                  <td class="txt_center">{{item.F20104}}</td>
                  <td class="txt_right">{{item.F15301}}</td>
                  <td class="txt_right">{{item.F30818}} %</td>
                  <td class="txt_right">{{item.F15001}}</td>
                  <td class="txt_right">{{item.F20041}} %</td>
                  <td class="txt_right">{{item.F40544}}</td>
                  <td class="txt_right">{{item.F40545}}</td>
                  <td class="txt_right" :style='Number( item.F33294 ) > 1 ? "color:red" : ""'>{{item.F33294}} %</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </v-card>
      </v-flex>
      <!---테이블1 end -->
    </v-layout>
  </v-container>
</template>

<script>

import Config       from "@/js/config.js";
import util       from "@/js/util.js";

export default {
  props: ['etpInfo'],
  data() {
    return {
      intra_data:[],
    };
  },
  computed: {

      fn_convert_intra_data : function() {
          var vm = this;

          vm.intra_data.forEach( function( item, index, array ) {
              item.F15301   =   util.formatInt( item.F15301 );      //  iNAV
              item.F15001   =   util.formatInt( item.F15001 );      //  현재가
              item.F40544   =   util.formatInt( item.F40544 );      //  LP매도호가
              item.F40545   =   util.formatInt( item.F40545 );      //  LP매수호가
          });

          return    vm.intra_data;
      }
  },
  mounted: function() {
    this.getEtpIntra();
  },
  created: function() {},
  beforeDestroy() {},
  methods: {
    getEtpIntra: function() {
      // console.log("getIndexIntra : " + rinfo.seq);
      var vm = this;

      axios.get(Config.base_url + "/user/marketinfo/getEtpHogaIntraToday", {
        params: vm.etpInfo
      }).then(function(response) {
        // console.log(response);
        if (response.data.success == false) {
            alert("해당 지수의 데이터가 없습니다");
        } else {
            vm.intra_data = response.data.results;
        }
      });
    },
  }
};
</script>
