<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card flat>
          <v-dialog v-model="dialog" persistent max-width="500">
            <v-card flat height="775">
              <h5>
                <v-card-title class="pb-0">
                  비교자산추가
                  <v-spacer></v-spacer>
                  <v-btn icon dark @click="closeModal">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-card-title>
              </h5>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-tabs v-model="activeTab" grow fixed-tabs light>
                    <v-tabs-slider></v-tabs-slider>

                    <v-tab
                      v-for="tab of tabs"
                      :key="tab.id"
                      @click="fn_pageMove(tab.id)"
                    >{{ tab.name }}</v-tab>
                  </v-tabs>

                  <v-card-title>
                    <v-text-field
                      class="pt-0"
                      v-model="search"
                      v-on:keyup="fn_filterData"
                      append-icon="search"
                      label="Search"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>

                  <v-tabs-items v-model="activeTab">
                    <v-tab-item>
                      <etfList
                        v-if="showTab == 0"
                        :results="etfList"
                        @selectedItem="getSelectedItem"
                      ></etfList>
                    </v-tab-item>
                    <v-tab-item>
                      <etnList
                        v-if="showTab == 1"
                        :results="etnList"
                        @selectedItem="getSelectedItem"
                      ></etnList>
                    </v-tab-item>
                    <v-tab-item>
                      <indexListDom
                        v-if="showTab == 2"
                        :results="domainIndexList"
                        @selectedItem="getSelectedItem"
                      ></indexListDom>
                    </v-tab-item>
                    <v-tab-item>
                      <indexListAll
                        v-if="showTab == 3"
                        :results="indexListAll"
                        @selectedItem="getSelectedItem"
                      ></indexListAll>
                    </v-tab-item>
                  </v-tabs-items>
                </v-flex>
              </v-layout>
            </v-card>
          </v-dialog>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import etfList from "./etfList.vue";
  import etnList from "./etnList.vue";
  import indexListDom from "./indexListDom.vue";
  import indexListAll from "./indexListAll.vue";
  import util from "@/js/util.js";
  import Config from '@/js/config.js'
  export default {
    props: [],
    data() {
      return {
        activeTab: 0,
        tabs: [{
          id: 0,
          name: "ETF"
        }, {
          id: 1,
          name: "ETN"
        }, {
          id: 2,
          name: "INDEX(국내)"
        }, {
          id: 3,
          name: "INDEX(전체)"
        }, ],
        dialog: false,
        etfList: [],
        etnList: [],
        domainIndexList: [],
        forIndexList: [],
        indexListAll: [],
        search: "",
        showTab: 0
      };
    },
    components: {
      etfList,
      etnList,
      indexListDom,
      indexListAll
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
      var vm = this;
      this.dialog = true;
      /*  ETF, ETN 정보를 조회한다. */
      this.fn_getEtpMast().then(function(e) {
        /* INDEX 정보를 조회한다. */
        return vm.fn_getIndexMast();
      }).then(function(e) {
        vm.fn_pageMove(0);
      });
    },
    methods: {
      getSelectedItem: function(sel_items, gubun) {
        var vm = this;
        // console.log("selectedItem ..............");
        // console.log(sel_items);
        this.$emit("selectedItem", sel_items, gubun);
        this.dialog = false;
        this.$emit("closeMastModal");
      },
      closeModal: function() {
        this.dialog = false;
        this.$emit("closeMastModal");
      },
      fn_pageMove(tab_id) {
        var vm = this;
        vm.activeTab = tab_id;
        if(vm.activeTab == 0) {
          vm.showTab = 0;
        } else if(vm.activeTab == 1) {
          vm.showTab = 1;
        } else if(vm.activeTab == 2) {
          vm.showTab = 2;
        } else if(vm.activeTab == 3) {
          vm.showTab = 3;
        } else {
          vm.showTab = -1;
        }
        vm.fn_filterData();
      },
      /*
       * ETF, ETN 정보를 조회한다.
       * 2019-07-26  bkLove(촤병국)
       */
      async fn_getEtpMast() {
        var vm = this;
        vm.etfList = [];
        vm.etnList = [];
        return await new Promise(function(resolve, reject) {
          vm.$root.progresst.open();
          util.axiosCall({
            "url": Config.base_url + "/user/marketinfo/getEtpMast",
            "data": {},
            "method": "get",
            "paramKey": "params"
          }, async function(response) {
              try {
                vm.$root.progresst.close();
                if(response.data) {
                  var results = response.data.results;
                  results.forEach(function(item, index, array) {
                    if(item.F16493 == '1' || item.F16493 == '2') {
                      vm.etfList.push(item);
                    } else {
                      vm.etnList.push(item);
                    }
                  });
                }
                resolve({
                  result: true
                });
              } catch (ex) {
                vm.$root.progresst.close();
                console.log("error", ex);
                resolve({
                  result: false
                });
              }
            },
            function(error) {
              vm.$root.progresst.close();
              if(error) {
                if(error && vm.$root.confirmt.open('확인', error, {}, 4)) {}
              }
              resolve({
                result: false
              });
            });
        }).catch(function(e1) {
          console.log(e1);
        });
      },
      /*
       * INDEX 정보를 조회한다.
       * 2019-07-26  bkLove(촤병국)
       */
      async fn_getIndexMast() {
        var vm = this;
        vm.domainIndexList = [];
        vm.forIndexList = [];
        vm.indexListAll = [];
        return await new Promise(function(resolve, reject) {
          vm.$root.progresst.open();
          util.axiosCall({
            "url": Config.base_url + "/user/marketinfo/getIndexMast",
            "data": {},
            "method": "get",
            "paramKey": "params"
          }, async function(response) {
              try {
                vm.$root.progresst.close();
                if(response.data) {
                  var results = response.data.results;
                  results.forEach(function(item, index, array) {
                    vm.indexListAll.push(item);
                    if(item.large_type == 'KRX' || item.large_type == 'FNGUIDE') {
                      vm.domainIndexList.push(item);
                    } else {
                      vm.forIndexList.push(item);
                    }
                  });
                  vm.indexListAll.sort(function(a, b) {
                    if(a.F16002 > b.F16002) return 1;
                    else return -1;
                  });
                  vm.domainIndexList.sort(function(a, b) {
                    if(a.F16002 > b.F16002) return 1;
                    else return -1;
                  });
                  vm.forIndexList.sort(function(a, b) {
                    if(a.F16002 > b.F16002) return 1;
                    else return -1;
                  });
                }
                resolve({
                  result: true
                });
              } catch (ex) {
                vm.$root.progresst.close();
                console.log("error", ex);
                resolve({
                  result: false
                });
              }
            },
            function(error) {
              vm.$root.progresst.close();
              if(error) {
                if(error && vm.$root.confirmt.open('확인', error, {}, 4)) {}
              }
              resolve({
                result: false
              });
            });
        }).catch(function(e1) {
          console.log(e1);
        });
      },
      fn_filterData() {
        var vm = this;
        vm.$nextTick(function(e) {
          /* ETF */
          if(vm.activeTab == 0) {
            vm.$EventBus.$emit('fn_etfFilterData', vm.search);
          }
          /* ETN */
          else if(vm.activeTab == 1) {
            vm.$EventBus.$emit('fn_etnFilterData', vm.search);
          }
          /* INDEX(국내) */
          else if(vm.activeTab == 2) {
            vm.$EventBus.$emit('fn_indexListDomFilterData', vm.search);
          }
          /* INDEX(전체) */
          else if(vm.activeTab == 3) {
            vm.$EventBus.$emit('fn_indexListAllFilterData', vm.search);
          }
        });
      }
    }
  }
</script>