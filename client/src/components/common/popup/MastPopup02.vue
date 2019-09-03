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
                      <kospiList    v-if="activeTab == 0 && kospiList.length > 0"
                                    :results="kospiList" 

                                    @selectedItem="getSelectedItem"></kospiList>
                    </v-tab-item>
                    <v-tab-item>
                      <kosdaqList   v-if="activeTab == 1 && kosdaqList.length > 0"
                                    :results="kosdaqList" 
                      
                                    @selectedItem="getSelectedItem"></kosdaqList>
                    </v-tab-item>
                    <v-tab-item>
                      <etfList 		v-if="activeTab == 2"

					  				@selectedItem="getSelectedItem"></etfList>
                    </v-tab-item>
                    <v-tab-item>
                      <etnList 		v-if="activeTab == 3"

					  				@selectedItem="getSelectedItem"></etnList>
                    </v-tab-item>
                    </v-tabs-items>
                </v-flex>
              </v-layout>
            </v-card>   
          </v-dialog>
        </v-card>
      </v-flex>

        <v-flex>
            <ConfirmDialog ref="confirm2"></ConfirmDialog>
            <ProgressBar ref="progress2"></ProgressBar>
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
    this.dialog = true;

    this.fn_getAllKspjongBasic();
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
        util.processing( this.$refs.progress2, visible );
    },

    /*
    * 종목코드를 검색한다.
    * 2019-07-26  bkLove(촤병국)
    */
    async fn_getAllKspjongBasic() {
        var vm = this;

        return  await new Promise(function(resolve, reject) {

            vm.fn_showProgress( true );
            axios.get( Config.base_url + "/user/common/getAllKspjongBasic", {
                data: {}
            }).then(async function(response) {
                vm.fn_showProgress( false );

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

            }).catch(error => {
                resolve( { result : false } );

                vm.fn_showProgress( false );

                vm.fn_showMessageBox(
                    '확인',
                    '서버로 부터 응답을 받지 못하였습니다.',
                    {}
                    ,4
                );
            });
        }).catch( function(e1) {
            console.log( e1 );
            resolve( { result : false } );
        });
    },    

	fn_filterData() {
		var vm = this;

        /* KOSPI */
		if( vm.activeTab == 0 && vm.kospiList.length > 0 ) {
        	vm.$EventBus.$emit('fn_kospiFilterData', vm.search);
		}
        /* KOSDAQ */
        else if( vm.activeTab == 1 && vm.kosdaqList.length > 0 ){
			vm.$EventBus.$emit('fn_kosdaqFilterData', vm.search);
		}
        /* ETF */
        else if( vm.activeTab == 2 ){
			vm.$EventBus.$emit('fn_etfFilterData', vm.search);
		}
        /* ETN */
        else if( vm.activeTab == 3 ){
			vm.$EventBus.$emit('fn_etnFilterData', vm.search);
		}
	}
  }
}
</script>
