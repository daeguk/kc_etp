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
              <v-flex xs6 class="text_r">{{index_item.STD_INDEX}}</v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs6>기준일</v-flex>
              <v-flex xs6 class="text_r">{{index_item.STD_DATE}}</v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs6>발표일</v-flex>
              <v-flex xs6 class="text_r">{{index_item.ANNO_DATE}}</v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs6>지수산출방식</v-flex>
              <v-flex xs6 class="text_r">{{index_item.INDEX_CAL_METHOD}}</v-flex>
            </v-layout>
            <v-layout
              row
              v-if="type_cd=='0003' || type_cd=='9998'  || type_cd=='9999' || index_item.REQCNT > 0"
            >
              <v-flex xs6>기준시가총액</v-flex>
              <v-flex xs6 class="text_r">{{index_item.STD_CAPITAL}}</v-flex>
            </v-layout>
            <v-layout
              row
              v-if="type_cd=='0003' || type_cd=='9998'  || type_cd=='9999' || index_item.REQCNT > 0"
            >
              <v-flex xs6>비교시가총액</v-flex>
              <v-flex xs6 class="text_r">{{index_item.STD_CAPITAL}}</v-flex>
            </v-layout>
            <v-layout
              row
              v-if="type_cd=='0003' || type_cd=='9998'  || type_cd=='9999' || index_item.REQCNT > 0"
            >
              <v-flex xs6>고정현금</v-flex>
              <v-flex xs6 class="text_r">{{index_item.FIXED_CASH}}</v-flex>
            </v-layout>
            <v-layout
              row
              v-if="type_cd=='0003' || type_cd=='9998'  || type_cd=='9999' || index_item.REQCNT > 0"
            >
              <v-flex xs6>유동비율적용여부</v-flex>
              <v-flex xs6 class="text_r">{{index_item.FLOWRATE_YN}}</v-flex>
            </v-layout>
          </v-card>
        </div>
        <!--table1 end -->
      </v-flex>
      <v-flex xs6>
        <!---table2 -->
        <v-container fluid grid-list-md pa-0 mb-4>
          <v-layout row wrap>
            <v-flex xs12 v-for="(etp_item, index) in etp_items" :key="etp_item.F16013">
              <!---table2_1 -->
              <div class="indexinfo_box02 a1">
                <h4 class="mb-0">ETP Info</h4>
                <v-card flat class="indexinfo_list_table">
                  <v-card-title>● {{etp_item.F16002}}</v-card-title>
                  <v-layout row>
                    <v-flex xs6>추적배수</v-flex>
                    <v-flex xs6 class="text_r">{{ etp_item.F18453 }}</v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs6>시가총액</v-flex>
                    <v-flex xs6 class="text_r">{{new Intl.NumberFormat().format(etp_item.F15028)}}</v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs6>최종NAV</v-flex>
                    <v-flex xs6 class="text_r">{{etp_item.F19288}}</v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs6>추적오차율</v-flex>
                    <v-flex xs6 class="text_r">{{etp_item.F15302}}</v-flex>
                  </v-layout>
                </v-card>
              </div>
            </v-flex>

            <v-flex xs12 v-if="!etp_yn">
              <!---table2_1 -->
              <div class="indexinfo_box02 a1">
                <h4 class="mb-0">ETP Info</h4>
                <v-card flat class="indexinfo_list_table">
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
  import Config from '@/js/config.js';
  import util from "@/js/util.js";
  export default {
    props: ["basicData"],
    data() {
      return {
        index_item: {},
        rowsPerPageItems: [50, 50],
        etp_items: [],
        etp_yn: false,
        param: {},
        type_cd: ''
      };
    },
    computed: {},
    created: function() {
      var vm = this;
      // vm.$EventBus.$on('changeIndexBasicInfo', data => {
      //     vm.init();
      // });
    },
    beforeDestroy() {
      // this.$EventBus.$off('changeIndexBasicInfo')
    },
    mounted: function() {
      this.type_cd = this.$store.state.user.type_cd;
      this.init();
    },
    methods: {
      init: function() {
        var vm = this;
        if(vm.basicData && vm.basicData.jisu_cd && vm.basicData.large_type && vm.basicData.market_id) {
          vm.param.jisu_cd = vm.basicData.jisu_cd;
          vm.param.large_type = vm.basicData.large_type;
          vm.param.market_id = vm.basicData.market_id;
        } else if(vm.$route.query.jisu_cd && vm.$route.query.large_type && vm.$route.query.market_id) {
          vm.param.jisu_cd = vm.$route.query.jisu_cd;
          vm.param.large_type = vm.$route.query.large_type;
          vm.param.market_id = vm.$route.query.market_id;
        }
        if(vm.param && vm.param.jisu_cd && vm.param.large_type && vm.param.market_id) {
          vm.getIndexBaseInfo();
          vm.getIndexInEtpInfo();
        }
      },
      getIndexBaseInfo: function() {
        var vm = this;
        console.log("getIndexBaseInfo");
        util.axiosCall({
          "url": Config.base_url + "/user/index/getIndexBaseInfo",
          "data": {
            jisu_cd: vm.param.jisu_cd,
            market_id: vm.param.market_id,
            large_type: vm.param.large_type
          },
          "method": "get",
          "paramKey": "params"
        }, function(response) {
          try {
            // console.log(response);
            if(response.data.success == false) {
              vm.$root.confirmt.open('확인', "지수정보가 없습니다.", {}, 1);
            } else {
              var items = response.data.results;
              vm.index_item = items[0];
              console.log("response=" + JSON.stringify(vm.index_item));
              //this.list_cnt = this.results.length;
            }
          } catch (ex) {
            console.log("error", ex);
          }
        }, function(error) {
          if(error) {
            vm.$root.confirmt.open('확인', error, {}, 4);
          }
        });
      },
      getIndexInEtpInfo: function() {
        var vm = this;
        vm.etp_yn = false;
        axios.get(Config.base_url + "/user/index/getIndexInEtpInfo", {
          params: {
            jisu_cd: vm.param.jisu_cd,
            market_id: vm.param.market_id,
            large_type: vm.param.large_type
          }
        }).then(response => {
          // console.log(response);
          if(response.data.success == false) {
            alert("지수정보가 없습니다.1");
          } else {
            var items = response.data.results;
            vm.etp_items = items;
            if(items.length > 0) {
              vm.etp_yn = true;
            } else {
              vm.etp_yn = false;
            }
            //console.log("etp_response=" + JSON.stringify(vm.etp_items));
            //this.list_cnt = this.results.length;
          }
        });
      },
    }
  };
</script>