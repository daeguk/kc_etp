<template>
    <v-layout row wrap>
      <v-flex grow xs12 mt-2>
        <v-card flat>
          <h4> 일중 스프레드 현황</h4>

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
                  <th style="width:10%" class="txt_center">iNav</th>
                  <th style="width:10%" class="txt_center">NAV.chg</th>
                  <th style="width:10%" class="txt_center">현재가</th>
                  <th style="width:10%" class="txt_center">등락율</th>
                  <th style="width:10%" class="txt_center">LP매도호가</th>
                  <th style="width:10%" class="txt_center">LP매수호가</th>
                  <th style="width:10%" class="txt_center">LP스프레드</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in intra_data" :key="index">
                  <td class="txt_right">{{item.F20044}}</td>
                  <td class="txt_right">{{item.F20104}}</td>
                  <td class="txt_right">{{item.F15301}}</td>
                  <td class="txt_right">{{item.F30818}} %</td>
                  <td class="txt_right">{{item.F15001}}</td>
                  <td class="txt_right">{{item.F20041}} %</td>
                  <td class="txt_right">{{item.F40544}}</td>
                  <td class="txt_right">{{item.F40545}}</td>
                  <td class="txt_right">{{item.F33294}} %</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </v-card>
      </v-flex>
      <!---테이블1 end -->
    </v-layout>
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
