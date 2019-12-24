<template>
    <v-layout row wrap>
    <v-flex xs12>
      <v-tabs slot="extension"  v-model="activeTab"  align-with-title light>
      <v-tabs-slider color="#35e0e2"></v-tabs-slider>
        <v-tab v-for="tab of tabs" :key="tab.id" @click="fn_pageMove(tab.id)" >
          {{ tab.name }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item  >
            <IndexCode      v-if="activeTab==0" 
                            :org_data_list="org_data_list">
            </IndexCode>
        </v-tab-item>
        <v-tab-item >
            <OperComCode    v-if="activeTab==1" 
                            :org_data_list="org_data_list">
            </OperComCode>
        </v-tab-item>        
      </v-tabs-items>
    </v-flex>
  </v-layout>
</template>

<script>
import $ from "jquery";
import dt from "datatables.net";
import util       from "@/js/util.js";
import select from "datatables.net-select";
import Config from "@/js/config.js";
import IndexCode from "@/components/Home/OperSupport/IndexCode.vue";
import OperComCode from "@/components/Home/OperSupport/OperComCode.vue";

export default {

    data() {
        return {
                activeTab: 0
            ,   tabs: [
                    { id: 0, name: "지수구분코드"},
                    { id: 1, name: "발행사코드"},
                ]

            ,   org_index_list      :   []
            ,   org_oper_list       :   []
            ,   org_data_list       :   []
        };
    
    }, 

    components: {
      IndexCode,   
      OperComCode
    }, 

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;


        /* 지수구분코드를 조회한다. */
        vm.fn_getIndexCode().then( function(e) {
            
            vm.activeTab        =   -1;

            if( e && e.result ) {

                vm.org_data_list    =   vm.org_index_list;

                /* 발행사 코드를 조회한다. */
                return  vm.fn_getOperCode();
            }
        }).then( function(e) {
            
            vm.activeTab        =   0;
        });
    },    

    methods: {

        /*
         *  탭 클릭시 paramData 를 초기화 한다.
         *  2019-07-26  bkLove(촤병국)
         */
        fn_pageMove( tab_id ) {
            var vm = this;

            vm.org_data_list        =   [];

            if( tab_id == 0 ) {
                vm.org_data_list    =   vm.org_index_list;
            }else if( tab_id == 1 ) {
                vm.org_data_list    =   vm.org_oper_list;
            }            

            vm.activeTab            =   tab_id;
        },

        /*
         * 지수구분코드를 조회한다.
         * 2019-10-11  bkLove(촤병국)
         */
        async fn_getIndexCode() {
            var vm = this;


            return  await new Promise(function(resolve, reject) {
                vm.$root.progresst.open();
                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/operSupport/getIndexCode"
                            ,   "data"      :   {}
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.$root.progresst.close();

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.$root.confirmt.open('확인', msg, {}, 1 );
                                        }

                                        resolve( { result : false } );
                                    }else{
                                        vm.org_index_list       =   response.data.dataList;

                                        resolve( { result : true } );
                                    }
                                }

                            }catch(ex) {
                                console.log( "error", ex );

                                resolve( { result : false } );
                            }
                        }
                    ,   function(error) {
                            vm.$root.progresst.close();
                            if ( error ) {
                                vm.$root.confirmt.open('확인', error, {}, 4 );
                            }

                            resolve( { result : false } );
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
            });                
        },

        /*
         * 발행사 코드를 조회한다.
         * 2019-10-11  bkLove(촤병국)
         */
        async fn_getOperCode() {
            var vm = this;


            return  await new Promise(function(resolve, reject) {

                vm.$root.progresst.open();

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/operSupport/getOperCode"
                            ,   "data"      :   {}
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.$root.progresst.close();

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.$root.confirmt.open('확인', msg, {}, 1 );
                                        }

                                        resolve( { result : false } );
                                    }else{
                                        vm.org_oper_list    =   response.data.dataList;

                                        resolve( { result : true } );
                                    }
                                }

                            }catch(ex) {
                                console.log( "error", ex );

                                resolve( { result : false } );
                            }
                        }
                    ,   function(error) {
                            vm.$root.progresst.close();
                            if ( error ) {
                                vm.$root.confirmt.open('확인', error, {}, 4 );
                            }

                            resolve( { result : false } );
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
            });
        },
    }
} 
</script>