<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card flat>
          <v-dialog v-model="dialog" persistent max-width="500">                                   
            <v-card flat  height="775">
              <h5>
                <v-card-title class="pb-0">
                  자산추가
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

                    <v-tab v-for="tab of tabs"  :key="tab.id"   @click="fn_pageMove(tab.id)">
                        {{ tab.name }}
                    </v-tab>
                </v-tabs>                

				<v-card-title >
					<v-text-field class="pt-0" v-model="search" v-on:keyup="fn_filterData" append-icon="search" label="Search" single-line hide-details></v-text-field>
				</v-card-title>

                  <v-tabs-items v-model="activeTab">
                    <v-tab-item>
                      <kospiList    v-if="showTab == 0"
                                    :results="kospiList" 

                                    @selectedItem="getSelectedItem"></kospiList>
                    </v-tab-item>
                    <v-tab-item>
                      <kosdaqList   v-if="showTab == 1"
                                    :results="kosdaqList" 
                      
                                    @selectedItem="getSelectedItem"></kosdaqList>
                    </v-tab-item>
                    <v-tab-item>
                      <etfList 		v-if="showTab == 2"

					  				@selectedItem="getSelectedItem"></etfList>
                    </v-tab-item>
                    <v-tab-item>
                      <etnList 		v-if="showTab == 3"

					  				@selectedItem="getSelectedItem"></etnList>
                    </v-tab-item>
                    </v-tabs-items>
                </v-flex>

                <v-flex>
                    <ConfirmDialog ref="confirm2"></ConfirmDialog>
                    <ProgressBar ref="progress2"></ProgressBar>
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
import kospiList from "./kospiList.vue";
import kosdaqList from "./kosdaqList.vue";

import etfList from "./etfList.vue";
import etnList from "./etnList.vue";
import indexListDom from "./indexListDom.vue";
import indexListAll from "./indexListAll.vue";

import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import select from "datatables.net-select";
import Config from "@/js/config.js";

import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";

export default {
  props: [],
  data() {
    return {
            activeTab: 0
        ,   tabs: [
                { id: 0, name: "KOSPI"       },
                { id: 1, name: "KOSDAQ"     },
                { id: 2, name: "ETF"     },
                { id: 3, name: "ETN"     },
            ]
        ,   dialog: false

        ,   kospiList : []
        ,   kosdaqList : []

		,	search		: ""
        ,   showTab     :   0
    };
  },
  components: {
    kospiList,
    kosdaqList,      
    etfList,
    etnList,

    ProgressBar,
    ConfirmDialog    
  },
  computed: {},
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
    var vm = this;

    this.dialog = true;

    this.fn_getAllKspjongBasic().then( function(e) {
        vm.fn_pageMove( 0 );
    });
  },
  methods: {
    getSelectedItem: function(sel_items, gubun) {
      var vm = this;
// console.log("selectedItem ..............");
// console.log(sel_items);
      this.$emit("selectedItem", sel_items, gubun);
    },
    closeModal: function() {
      this.dialog = false;
      this.$emit("closeMastModal");
    },

    
    /*
    *  탭 클릭시 paramData 를 초기화 한다.
    *  2019-07-26  bkLove(촤병국)
    */
    fn_pageMove( tab_id ) {
        var vm = this;

        vm.activeTab    =   tab_id;

        if( vm.activeTab == 0 && vm.kospiList.length > 0 ) {
            vm.showTab = 0;
        }else if( vm.activeTab == 1 && vm.kosdaqList.length > 0 ) {
            vm.showTab = 1;
        }else if( vm.activeTab == 2 ) {
            vm.showTab = 2;
        }else if( vm.activeTab == 3 ) {
            vm.showTab = 3;
        }else{
            vm.showTab = -1;
        }

		vm.fn_filterData();
    },

    fn_showMessageBox: function(title, msg, option, gubun) {
        this.$refs.confirm2.open(title,msg, option, gubun);
    },

    /*
    *  진행 progress 를 보여준다.
    *  2019-07-26  bkLove(촤병국)
    */
    fn_showProgress: function(visible) {

        if( this.$refs && this.$refs.progress2 ) {
            util.processing( this.$refs.progress2, visible );
        }
    },

    /*
    * 종목코드를 검색한다.
    * 2019-07-26  bkLove(촤병국)
    */
    async fn_getAllKspjongBasic() {
        var vm = this;

        return  await new Promise(function(resolve, reject) {

            util.processing(vm.$refs.progress2, true);

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/common/getAllKspjongBasic"
                        ,   "data"      :   {}
                        ,   "method"    :   "get"
                        ,   "paramKey"  :   "params"
                    }
                ,   async function(response) {

                        try{

                            if( vm.$refs.progress2 ) {
                                util.processing(vm.$refs.progress2, false);
                            }

                            if (response.data) {
                                var results = response.data.results;

                                results.forEach( function(item, index, array) {
                                    if( item.F33861 == "0" ) {
                                        vm.kospiList.push( item );
                                    }else if( item.F33861 == "1" ) {
                                        vm.kosdaqList.push( item );
                                    }
                                })
                            }

                            resolve( { result : true } );

                        }catch(ex) {
                            resolve( { result : false } );

                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        resolve( { result : false } );

                        if( vm.$refs.progress2 ) {
                            util.processing(vm.$refs.progress2, false);
                        }

                        if( error ) {
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                    }
            );

        }).catch( function(e1) {
            console.log( e1 );
            resolve( { result : false } );
        });
    },    

	fn_filterData() {
		var vm = this;

        vm.$nextTick( function(e) {

            /* KOSPI */
            if( vm.showTab == 0 ) {
                vm.$EventBus.$emit('fn_kospiFilterData', vm.search);
            }
            /* KOSDAQ */
            else if( vm.showTab == 1 ){
                vm.$EventBus.$emit('fn_kosdaqFilterData', vm.search);
            }
            /* ETF */
            else if( vm.showTab == 2 ){
                vm.$EventBus.$emit('fn_etfFilterData', vm.search);
            }
            /* ETN */
            else if( vm.showTab == 3 ){
                vm.$EventBus.$emit('fn_etnFilterData', vm.search);
            }
        });
	}
  }
}
</script>
