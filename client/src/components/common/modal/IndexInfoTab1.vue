<template>
  <v-container fluid grid-list-md pa-2 mb-4>
    <v-layout row wrap class="indexlist_ww">
      <v-flex class="w50">
        <!--table1-->
        <div class="indexinfo_box01">
          <h4 class="mb-0">INDEX Info</h4>
          <v-card flat class="indexinfo_list_table">
            <v-layout row>
                <v-flex xs6>기준지수</v-flex>
                <v-flex xs6 class="text_r">{{indexBasic.std_index}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>기준일</v-flex>
                <v-flex xs6 class="text_r">{{formatDate(indexBasic.std_date)}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>발표일</v-flex>
                <v-flex xs6 class="text_r">{{formatDate(indexBasic.anno_date)}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>지수산출방식</v-flex>
                <v-flex xs6 class="text_r">{{indexBasic.index_cal_method}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>기준시가총액</v-flex>
                <v-flex xs6 class="text_r">{{indexBasic.std_capital}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>비교시가총액</v-flex>
                <v-flex xs6 class="text_r">{{formatInt(indexBasic.F15028/1000000000)}}십억</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>고정현금</v-flex>
                <v-flex xs6 class="text_r">{{indexBasic.fixed_cash}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>유동비율적용여부</v-flex>
                <v-flex xs6 class="text_r">{{indexBasic.flowrate_yn}}</v-flex>
            </v-layout>
          </v-card>
        </div>
        <!--table1 end -->
      </v-flex>
      <v-flex xs6>
        <!---table2 -->
        <v-container fluid grid-list-md pa-0 mb-4>
          <v-layout row wrap>
            <v-flex xs12>
              <!---table2_1 -->
              <div class="indexinfo_box02 a1">
                <h4 class="mb-0">ETP Info</h4>
                <v-card flat class="indexinfo_list_table" v-for="(item, index) in etpList" :key="index">
                  <v-card-title>● {{item.F16002}} ({{item.F16013}})</v-card-title>
                  <v-layout row>
                      <v-flex xs6>ETP배율</v-flex>
                      <v-flex xs6 class="text_r">{{item.F18453}}</v-flex>
                  </v-layout>
                  <v-layout row>
                      <v-flex xs6>시가총액</v-flex>
                      <v-flex xs6 class="text_r">{{formatInt(item.F15028/1000000)}}백만</v-flex>
                  </v-layout>
                  <v-layout row>
                      <v-flex xs6>현재가</v-flex>
                      <v-flex xs6 class="text_r">{{formatInt(item.F15001)}}</v-flex>
                  </v-layout>
                  <v-layout row>
                      <v-flex xs6>최종NAV</v-flex>
                      <v-flex xs6 class="text_r">{{formatNumber(item.F15301)}}</v-flex>
                  </v-layout>
                  <v-layout row>
                      <v-flex xs6>추적오차율</v-flex>
                      <v-flex xs6 class="text_r">{{item.F15302}}</v-flex>
                  </v-layout>
                  <v-layout row>
                  </v-layout>
                </v-card>
                <v-card v-if="!etp_yn" flat class="indexinfo_list_table">
                  <v-card-title>● ETP 정보가 없습니다.</v-card-title>
                </v-card>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <!---table2 end -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Config from "@/js/config.js";
import util from "@/js/util.js";

export default {
  props: ["indexBasic", "etpList"],
  data() {
    return {
        etp_yn : false,
        param: {},
        type_cd : ''
    };
  },
  computed: {

  },
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
    // console.log("tab1...............");
    // console.log("this.etpList.length : " + this.etpList.length);
    this.type_cd = this.$store.state.user.type_cd;
    if(this.etpList.length !== 0) this.etp_yn = true;
    else this.etp_yn = false;
  },
  methods: {
    formatInt:function(num) {
      return util.formatInt(num);
    },
    formatNumber:function(num) {
      return util.formatNumber(num);
    },
    formatDate:function(inDate) {
      return util.formatDate(inDate);
    },
  }
};
</script>