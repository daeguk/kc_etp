<template>
    <v-container>
        <v-layout row>
            <v-flex xs12>

                <v-card flat>

                    <v-dialog v-model="dialog" persistent width="500px">

                        <!-- 공유하기 팝업창--->
                        <div>
                            <v-card flat>
                                <h5>
                                    <v-card-title class="ver2">
                                        공유하기
                                        <span class="pl-0"></span>
                                        <v-spacer></v-spacer>
                                        <v-btn icon @click="fn_close_modal()">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>

                                <!--1table-->
                                <div class="simul_share_search">
                                    <v-text-field
                                        ref="ref_txt_search"
                                        v-model="v_search"
                                        @keyup.stop="fn_filter_data()"
                                        append-icon="search"
                                        single-line
                                        hide-details
                                        autofocus
                                    ></v-text-field>
                                </div>

                                <div class="incode_pop">
                                    <h6>공유자 선택</h6>
                                    <div class="table-box-wrap">
                                        <div class="table-box" style="height:200px;">
                                            <table class="tbl_type ver8 v2">
                                                <caption>헤더 고정 테이블</caption>
                                                <colgroup>
                                                    <col width="10%" />
                                                    <col width="30%" />
                                                    <col width="60%" />
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th style="width:10%"></th>
                                                        <th style="width:30%" class="txt_left">이름</th>
                                                        <th style="width:60%" class="txt_left">이메일</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="( item_for_share, index_for_share ) in arr_user_list_for_share"
                                                        :key="'arr_user_list_for_share_' + index_for_share">

                                                        <td class="txt_left">
                                                            <v-checkbox
                                                                v-model="item_for_share.checked_for_share"

                                                                :key="'arr_checked_for_share_' + index_for_share"
                                                                :name="'chk_share_' + index_for_share"
                                                                :value="item_for_share.email"
                                                                color="primary"
                                                            ></v-checkbox>
                                                        </td>

                                                        <td class="txt_left">{{ item_for_share.name }}</td>
                                                        <td class="txt_left">{{ item_for_share.email }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="text-xs-center">
                                        <v-btn depressed small color="primary" @click.stop="fn_apply_share_user_in_arr()">공유하기</v-btn>
                                    </div>
                                </div>

                                <!--2table-->
                                <div class="incode_pop pt-3">
                                    <h6 class="pb-1">공유자 선택해제</h6>
                                    <div class="table-box-wrap">
                                        <div class="table-box" style="max-height:200px;">
                                            <table class="tbl_type ver8 v2">
                                                <caption>헤더 고정 테이블</caption>
                                                <colgroup>
                                                    <col width="20%" />
                                                    <col width="50%" />
                                                    <col width="30%" />
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th style="width:20%">이름</th>
                                                        <th style="width:50%" class="txt_left">이메일</th>
                                                        <th style="width:30%" class="txt_left"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr
                                                        v-if="!arr_user_list_shared || arr_user_list_shared.length == 0"
                                                    >
                                                        <td
                                                            class="txt_left"
                                                            colspan="3"
                                                        >공유된 공유자가 없습니다.</td>
                                                    </tr>

                                                    <tr
                                                        v-for="( item_shared, index_shared ) in arr_user_list_shared"
                                                        :key="index_shared"
                                                    >
                                                        <td class="txt_left">{{ item_shared.name }}</td>
                                                        <td class="txt_left">{{ item_shared.email }}</td>
                                                        <td class="txt_left">
                                                            <v-btn
                                                                depressed
                                                                outline
                                                                small
                                                                color="primary"
                                                                @click.stop="fn_apply_share_user_revoke_in_arr( item_shared )"
                                                            >공유해제</v-btn>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </v-card>
                        </div>
                    </v-dialog>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>



import util       from "@/js/util.js";
import Config from "@/js/config.js";

export default {
  props: [ "share_row_data" ],
  data() {
    return {
            dialog                      :   false

        ,   v_search	                :   ""

        ,   arr_user_list_for_share     :   []          /* array 모든 공유할 공유자 */
        ,   arr_user_list_shared        :   []          /* array 모든 공유된 공유자 */
        ,   arr_checked_for_share       :   []          /* array 선택된 공유할 공유자 */
        ,   arr_checked_shared          :   []          /* array 선택된 공유된 공유자 */

        ,   arr_user_list_for_share_cp  :   []          /* arr_user_list_for_share 복사본 */
    };
  },
  computed: {},
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
    var vm = this;

    vm.dialog = true;
    vm.v_search =   "";

    // console.log( "sharePopup02 vm.share_row_data", vm.share_row_data );

    vm.fn_show_share();
  },
  methods: {


        /*
         *  팝업창을 종료한다.
         *  2019-10-24  bkLove(촤병국)
         */
        fn_close_modal: function() {
            var vm = this;

            vm.dialog = false;
            vm.$emit("fn_close_share_modal");
        },

        /*
         *  공유정보를 노출한다.
         *  2019-10-24  bkLove(촤병국)
         */
        fn_show_share() {

            var vm = this;


            if( !vm.share_row_data || !vm.share_row_data.grp_cd || !vm.share_row_data.scen_cd  ) {

                if ( vm.$root.confirmt.open(
                        '확인',
                        "기본정보가 존재하지 않습니다.",
                        {}
                        ,1
                    )
                ) {
                }

                return  false;
            }

            vm.$root.progresst.open();

            /* 공유된 공유자를 조회한다. */
            vm.fn_get_user_list_shared().then( function(e){

                if( e && e.result  ) {

                    /* 공유할 공유자를 조회한다. */
                    return  vm.fn_get_user_list_for_share();
                }

            }).then( function(e) {
                vm.$root.progresst.close();
            });

        },        

        /*
         * 공유할 공유자를 조회한다.
         * 2019-11-13  bkLove(촤병국)
         */
        async fn_get_user_list_for_share() {

            var vm = this;

			vm.arr_user_list_for_share      =   [];
			vm.arr_user_list_for_share_cp   =   [];
            
            return  await new Promise(function(resolve, reject) {

				if( !vm.share_row_data || !vm.share_row_data.grp_cd || !vm.share_row_data.scen_cd ) {

					if ( vm.$root.confirmt.open(
							'확인',
							"기본정보가 존재하지 않습니다.",
							{}
							,1
						)
					) {
					}

					resolve( { result : false } );

				}else{

					var p_param         	=   {};

					p_param.grp_cd      	=   vm.share_row_data.grp_cd;
					p_param.scen_cd     	=   vm.share_row_data.scen_cd;
					p_param.arr_user_shared	=	vm.arr_user_list_shared;


					util.axiosCall(
							{
									"url"       :   Config.base_url + "/user/simulation/getUserListForShareInResultGroup"
								,   "data"      :   p_param
								,   "method"    :   "post"
							}
						,   async function(response) {

								try{

									if (response && response.data) {
										var msg = ( response.data.msg ? response.data.msg : "" );

										if (!response.data.result) {


											if( msg ) {

												if ( vm.$root.confirmt.open(
														'확인',
														msg,
														{}
														,1
													)
												) {
												}
											}

											resolve( { result : false } );
										}else{

											vm.arr_user_list_for_share      =   [ ...response.data.arr_user_list_for_share];        /* array 모든 공유할 공유자 */
											vm.arr_user_list_for_share_cp   =   [ ...response.data.arr_user_list_for_share];        /* array 모든 공유할 공유자 */

											resolve( { result : true } );
										}

									}else{

										resolve( { result : false } );
									}

								}catch(ex) {
									console.log( "error", ex );
									resolve( { result : false } );
								}
							}
						,   function(error) {
								if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}

								resolve( { result : false } );
							}
					);
				}

            }).catch( function(e1) {
                console.log( e1 );
            });             
        },

        /*
         * 공유된 공유자를 조회한다.
         * 2019-11-13  bkLove(촤병국)
         */
        async fn_get_user_list_shared() {

            var vm = this;


            return  await new Promise(function(resolve, reject) {

                if( !vm.share_row_data || !vm.share_row_data.grp_cd || !vm.share_row_data.scen_cd  ) {

                    if ( vm.$root.confirmt.open(
                            '확인',
                            "기본정보가 존재하지 않습니다.",
                            {}
                            ,1
                        )
                    ) {
                    }

                    resolve( { result : false } );

                }else{

                    var p_param                     =   {};

                    p_param.grp_cd                  =   vm.share_row_data.grp_cd;
                    p_param.scen_cd                 =   vm.share_row_data.scen_cd;
                    p_param.method_gubun            =   vm.share_row_data.method_gubun;
                    p_param.arr_scen_in_grp         =   vm.share_row_data.arr_scen_in_grp;

                    util.axiosCall(
                            {
                                    "url"       :   Config.base_url + "/user/simulation/getUserListSharedInGroup"
                                ,   "data"      :   p_param
                                ,   "method"    :   "post"
                            }
                        ,   async function(response) {

                                try{

                                    if (response && response.data) {
                                        var msg = ( response.data.msg ? response.data.msg : "" );

                                        if (!response.data.result) {

                                            if( msg ) {

                                                if ( vm.$root.confirmt.open(
                                                        '확인',
                                                        msg,
                                                        {}
                                                        ,1
                                                    )
                                                ) {
                                                }                                            
                                            }

                                            resolve( { result : false } );

                                        }else{
                                            
                                            vm.arr_user_list_shared      =   response.data.arr_user_list_shared;                /* array 모든 공유된 공유자 */
                                            resolve( { result : true } );
                                        }

                                    }else{
                                        resolve( { result : false } );
                                    }

                                }catch(ex) {
                                    console.log( "error", ex );
                                    resolve( { result : false } );
                                }
                            }
                        ,   function(error) {
                                if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
                                resolve( { result : false } );
                            }
                    );
                }

            }).catch( function(e1) {
                console.log( e1 );
            });
        },        

        /*
         * 선택된 사용자를 공유한다.
         * 2019-11-13  bkLove(촤병국)
         */
        async fn_apply_share_user_in_arr() {

            var vm = this;

            vm.arr_checked_for_share    =   [];


            if( !vm.share_row_data || !vm.share_row_data.arr_scen_in_grp || vm.share_row_data.arr_scen_in_grp.length == 0 ) {

                if ( vm.$root.confirmt.open(
                        '확인',
                        "기본정보가 존재하지 않습니다.",
                        {}
                        ,1
                    )
                ) {
                }

                return  false;
            }

            var temp    =   _.filter( vm.arr_user_list_for_share, function(o) {
                return  typeof o.checked_for_share != "undefined" && o.checked_for_share != "";
            });

            if( !temp || temp.length == 0 ) {

                if ( await vm.$root.confirmt.open(
                        '확인',
                        '공유할 대상자가 1건 이상 선택되어야 합니다.',
                        {}
                        , 1
                    )
                ) {
                }

                return  false;
            }


            return  await new Promise( async function(resolve, reject) {

                vm.arr_checked_for_share        =   temp;


                var p_param                     =   {};

                p_param.grp_cd                  =   vm.share_row_data.grp_cd;
                p_param.scen_cd                 =   vm.share_row_data.scen_cd;
                p_param.method_gubun            =   vm.share_row_data.method_gubun;
                p_param.arr_scen_in_grp         =   vm.share_row_data.arr_scen_in_grp;
                p_param.arr_checked_for_share   =   vm.arr_checked_for_share;

                vm.$root.progresst.open();
                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/applyShareUserInResultGroup"
                            ,   "data"      :   p_param
                            ,   "method"    :   "post"
                        }
                    ,   async function(response) {

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {

                                        vm.$root.progresst.close();

                                        if( msg ) {

                                            if ( vm.$root.confirmt.open(
                                                    '확인',
                                                    msg,
                                                    {}
                                                    ,1
                                                )
                                            ) {
                                            }                                                
                                        }

                                        resolve( { result : false } );
                                    }else{
                                        vm.$root.progresst.close();
                                        resolve( { result : true } );
                                    }

                                }else{
                                    vm.$root.progresst.close();
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                vm.$root.progresst.close();
                                console.log( "error", ex );
                                resolve( { result : false } );
                            }
                        }
                    ,   function(error) {
                            vm.$root.progresst.close();
                            if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
                            resolve( { result : false } );
                        }
                );

            }).then( function(e) {

                if( e && e.result ) {

                    vm.v_search =   "";
                    return  vm.fn_show_share();
                }

            }).catch( function(e1) {
                console.log( e1 );
            });
        },

        /*
         * 선택된 사용자를 공유해제 한다.
         * 2019-11-13  bkLove(촤병국)
         */
        async fn_apply_share_user_revoke_in_arr( p_checkedItem ) {

            var vm = this;

            vm.arr_checked_shared       =   [];


            if( !vm.share_row_data || !vm.share_row_data.grp_cd || !vm.share_row_data.scen_cd  ) {

                if ( vm.$root.confirmt.open(
                        '확인',
                        "기본정보가 존재하지 않습니다.",
                        {}
                        ,1
                    )
                ) {
                }

                return  false;
            }


            if( !p_checkedItem || !p_checkedItem.email ) {

                if ( await vm.$root.confirmt.open(
                        '확인',
                        '공유해제할 대상자가 선택되어야 합니다.',
                        {}
                        , 1
                    )
                ) {
                }

                return  false;

            }


            return  await new Promise( async function(resolve, reject) {

                vm.arr_checked_shared.push( { 
                    "email"     :   p_checkedItem.email 
                });                


                var p_param                     =   {};

                p_param.grp_cd                  =   vm.share_row_data.grp_cd;
                p_param.scen_cd                 =   vm.share_row_data.scen_cd;
                p_param.arr_checked_shared      =   vm.arr_checked_shared;

                vm.$root.progresst.open();

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/applyShareUserRevokeInGroup"
                            ,   "data"      :   p_param
                            ,   "method"    :   "post"
                        }
                    ,   async function(response) {

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        vm.$root.progresst.close();
                                        if( msg ) {
                                            if ( vm.$root.confirmt.open(
                                                    '확인',
                                                    msg,
                                                    {}
                                                    ,1
                                                )
                                            ) {
                                            }                                                
                                        }

                                        resolve( { result : false } );
                                    }else{
                                        vm.$root.progresst.close();
                                        resolve( { result : true } );
                                    }

                                }else{
                                    vm.$root.progresst.close();
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                vm.$root.progresst.close();
                                console.log( "error", ex );
                                resolve( { result : false } );
                            }
                        }
                    ,   function(error) {
                            vm.$root.progresst.close();
                            if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
                            resolve( { result : false } );
                        }
                );

            }).then( function(e) {

                if( e && e.result ) {


                    vm.v_search =   "";
                    return  vm.fn_show_share();
                }

            }).catch( function(e1) {
                console.log( e1 );
            });     
        },        

        /*
         * 필터를 수행한다.
         * 2019-11-13  bkLove(촤병국)
         */
        fn_filter_data: function() {
            var vm = this;

            /* 이벤트 delay이로 부하 줄임 */
            var delay = (function(){
                var timer = 0;
                return function(callback, ms){
                    clearTimeout (timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            delay(function(){

                var filterData = _.filter( vm.arr_user_list_for_share_cp, function(item, index, array) { 

                    var nmIdx = item.name  ? item.name.indexOf(vm.v_search)     : -1;        /* 이름 */
                    var cdIdx = item.email ? item.email.toUpperCase().indexOf(vm.v_search.toUpperCase())    : -1;        /* 이메일 */

                    if (nmIdx > -1 || cdIdx > -1) {
                        return true; 
                    } else {
                        return false;
                    }
                });

				vm.arr_user_list_for_share  =   [];

                vm.$nextTick(function(e) {
                    vm.arr_user_list_for_share  =   filterData;
                });

            }, 2000 );
        },    
  }
}
</script>
