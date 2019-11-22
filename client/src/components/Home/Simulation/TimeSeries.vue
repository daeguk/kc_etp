<template>
    <v-layout row wrap class="content_margin etp_new" >
        <v-flex grow xs12>
            <v-card flat height="800px">
                <v-card-title primary-title  >
                    <h3 class="headline w100" pb-0 >
                        PORTFOLIO SIMULATION |
                        <span   class="grey--text">KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>
                   
                     <span class="btn_r">
                     <v-btn small flat icon v-on:click="fn_refresh()">
                        <v-icon >refresh</v-icon>
                    </v-btn>
                    </span>
                    <span class="btn_r">
                     <v-btn small flat icon v-on:click="fn_goList()">
                        <v-icon >reply</v-icon>
                    </v-btn>
                    </span>
                     </h3>
                </v-card-title>


                <v-card class="register_wrap pt0" flat xs12 color="lighten-1">
                    <h4>조건 설정</h4>

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">상위그룹</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select   :items="arr_grp_cd" 

                                        item-text="grp_name" 
                                        item-value="grp_cd" 

                                        @change="fn_resetErrorMessage();"

                                        v-model="grp_cd"
                                        outline>
                            </v-select>
                        </v-flex>
                    </v-layout>                    

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시나리오명</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field   outline     v-model="scen_name"     @blur="fn_resetErrorMessage();"   maxlength="50"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">벤치마크 설정</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select   :items="arr_bench_mark_cd" 
                                        
                                        item-text="com_dtl_name" 
                                        item-value="com_dtl_cd"
                                        
                                        v-model="bench_mark_cd" 
                                        outline  
                                        
                                        @change="fn_resetErrorMessage();">
                            </v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시계열 업로드</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <input type='text' class='upload-name'   disabled />
                        </v-flex>
                        <v-flex xs2>
                        <label  class="upload-hidden"  v-on:click="" >업로드</label>
                        </v-flex>
                    </v-layout>
                </v-card>
                     <div class="savebtn01" >                                                 
                            <v-btn depressed color="primary" @click="" >저장하기</v-btn>
                        </div>


            </v-card>
        </v-flex>

        <v-flex>
            <ConfirmDialog ref="confirm2"></ConfirmDialog>
        </v-flex>

    </v-layout>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import select from "datatables.net-select";
import Config from "@/js/config.js";
import _ from "lodash";

import MastPopup02 from "@/components/common/popup/MastPopup02";
import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";
import SimulationExcelupModal  from "@/components/Home/simulation/SimulationExcelupModal.vue";

var table01 = null;


export default {

    props : [ "paramData" ],

    data() {
        return {
                items: ['발행주식수', '발행주식수+CAP적용', '유동주식수', '유동주식수+CAP적용'],
                toggle_one: 0
            ,   items3: ["설정안함", "KOSPI200", "KOSDAQ150", "KOSPI", "KOSDAQ"]
            ,   item: [
                    {
                        link: "Simulation/SimulationResult"
                    }
                ]


            ,   disabled_rebalance_cd:[ false, true, true, true, true ]
            ,   MastModalFlag: false
            ,   selectedRowIndex    :   -1
            ,   arr_rebalance_disabled_check    :   { 
                        /* 0번째- 첫영업일 / 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 / 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */

                        /* 1-매주 */
                        "1" :   [ false , true, true, true, true ]          /* disabled : 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 / 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */

                        /* 2-매월 */
                    ,   "2" :   [ false , true, true, false, false ]        /* disabled : 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 */

                        /* 3-분기 */
                    ,   "3" :   [ false , false, false, true, true ]        /* disabled : 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */                    

                        /* 4-반기 */
                    ,   "4" :   [ false , true, true, true, true ]          /* disabled : 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 / 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */

                        /* 5-분기 */
                    ,   "5" :   [ false , true, true, true, true ]          /* disabled : 1번째- 동시만기 영업일 / 2번째- 동시만기 익주 첫영업일 / 3번째- 옵션만기 영업일 / 4번째- 옵션만기 익주 첫영업일 */

                }
            ,   arr_show_error_message      :   []          /* 에러 메시지 노출 정보 */

            ,   arr_grp_cd                  :   []          /* 상위 그룹정보 */
            ,   arr_start_year              :   []          /* 초기설정 시작년도 array */
            ,   arr_rebalance_cycle_cd      :   []          /* 초기설정 리밸런싱주기 array */
            ,   arr_rebalance_date_cd       :   []          /* 초기설정 리밸런싱일자 array */
            ,   arr_bench_mark_cd           :   []          /* 초기설정 벤치마크 array */
            ,   arr_importance_method_cd    :   []          /* 초기설정 비중설정방식 array */
            ,   arr_stock_gubun             :   []          /* 초기설정 주식수 구분 array */

            ,   prev_grp_cd                 :   ""          /* 그룹 코드 (변경전) */
            ,   prev_scen_cd                :   ""          /* 시나리오 코드 */
            ,   scen_cd                     :   ""          /* 시나리오 코드 */
            ,   scen_order_no               :   ""          /* 시나리오 정렬순번 */
            ,   org_grp_yn                  :   ""          /* 상위 그룹코드 */

            ,   grp_cd                      :   "*"         /* 상위 그룹코드 */
            ,   scen_name                   :   ""          /* 시나리오명 */
            ,   start_year                  :   "2000"      /* 시작년도 */
            ,   rebalance_cycle_cd          :   "1"         /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
            ,   rebalance_date_cd           :   ""          /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
            ,   init_invest_money           :   1000000     /* 초기투자금액 */
            ,   bench_mark_cd               :   "1"         /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
            ,   importance_method_cd        :   "1"         /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
            ,   bench_index_cd01            :   ""          /* 벤치마크 인덱스 코드 ( F16013 ) */
            ,   bench_index_cd02            :   ""          /* 벤치마크 인덱스 코드 ( large_type ) */
            ,   bench_index_cd03            :   ""          /* 벤치마크 인덱스 코드 ( middle_type ) */
            ,   bench_index_nm              :   ""          /* 벤치마크 인덱스 코드명 */
            ,   p_rebalance_file_yn         :   "0"         /* 리밸런싱 일자가 포함된 샘플파일 유무 */
            ,   excel_start_year            :   ""          /* 리밸런싱 파일인 경우 넘겨받은 엑셀 start_year */
            ,   stock_gubun                 :   "1"         /* 주식수 구분 */

            ,   arr_portfolio               :   []          /* 포트폴리오 설정 정보 */
            ,   arr_rebalance_date          :   []          /* 리밸런싱 일자 */
            ,   arr_rebalance_portfolio     :   []          /* 리밸런싱별 포트폴리오 */
            ,   change_rebalance_yn         :   "0"         /* 리밸런싱 내역조정 여부 */
            ,   rebalance_date              :   ""          /* 리밸런싱 일자 */
            ,   rebalancePortfolioObj       :   {}          /* 리밸런싱일별 포트폴리오 */

            ,   old_start_year              :   "2000"
            ,   old_rebalance_cycle_cd      :   "1"
            ,   old_rebalance_date_cd       :   ""
            ,   old_rebalance_date          :   ""
            ,   detail_init_yn              :   "N"

            ,   limit : {
                    max_size : 1                            /* 파일 사이즈 (Mb) */
                }
        };
    },

    components: {
        MastPopup02,
        ConfirmDialog,
        SimulationExcelupModal : SimulationExcelupModal,      
    },    

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        table01 =   $( "#table01" );

        /* 초기 시뮬레이션을 조회한다. */
        vm.fn_getInitSimul();


        /* table tr 에서 추가 버튼을 누르는 경우 */
        $('#table01 tbody').on('click', "[name='btn_asset']", function() {
            var tbody      	=   $(this).closest('tbody');
			var trLastIndex =   tbody.find( "tr.sum").index();
            var rowIndex	=   tbody.find( "tr:eq(" + ( trLastIndex -1 ) + ")" ).index();

            vm.fn_resetErrorMessage();
            vm.fn_addRecords( rowIndex+1, 5 );
            vm.fn_setTotalRecord();
        });
        

        /* table tr 에서 자산찾기 버튼을 누르는 경우  */
        $('#table01 tbody').on('click', "[name='btn_F16013_search']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            vm.fn_resetErrorMessage();
            vm.fn_openMastModal( rowIndex );
        });


        /* table tr 에서 종목코드, 비중  blur 시 오류 메시지 초기화  */
        $('#table01 tbody').on('blur', "input[name='F16013'], input[name='importance']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();
            var v_F16013_obj    =   null;

            if( $(this).val() != '' ) {

                vm.fn_resetErrorMessage();

                /* 종목코드인 경우에만 코드 검색 */
                if( $(this).attr("name") == "F16013" ) {

                    v_F16013_obj    =   $(this);

                    var  flag = true;
                    table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                        var tr = $(this);

                        var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );            /* 첫번째 컬럼 */
                        var v_F16013        =   tr.find( "td input[name=F16013]" );             /* 종목코드 */

                        /* 종목코드가 존재하는 경우 */
                        if( typeof v_F16013.val() != "undefined" && v_F16013.val() != "" && rowIndex != tr.index() ) {

                            /* 중복된 종목은 추가하지 않음. */
                            if(  v_F16013.val() == v_F16013_obj.val() ) {
                                vm.arr_show_error_message.push( v_text0.text() + " 종목코드(" + v_F16013.val() + ") 가 존재합니다." );
                                v_F16013_obj.val("");
                                flag = false;

                                return  false;
                            }
                        }
                    });

                    if( !flag ) {
                        return  false;
                    }


                    /* 종목코드를 검색한다. */
                    vm.fn_getJongmokData( rowIndex, $(this) ).then(function(e){

                        if( e && e.result ) {
                            
                            var rowItem;
                            if( e.rowItem && Object.keys( e.rowItem ).length > 0 )  {
                                rowItem =   e.rowItem;

                                tr.find( "td input[name=F16013]" ).val( rowItem.F16013 );               /* 종목코드 */
                                tr.find( "td:eq(2)" ).text( rowItem.F16002 );                           /* 종목명 */
                                tr.find( "td:eq(3)" ).text( util.formatInt( rowItem.F15028 ) );         /* 시가총액 */

                                /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
                                vm.fn_setImportanceMethodCd( vm.importance_method_cd ).then( function(e1){
                                    vm.fn_setTotalRecord();
                                });
                            }
                        }
                    });
                }
            }else{

                /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
                vm.fn_setImportanceMethodCd( vm.importance_method_cd ).then( function(e1){
                    vm.fn_setTotalRecord();
                });                           
            }
        });


        /* table tr 에서 종목코드 change 시 레코드 초기화   */
        $('#table01 tbody').on('change', "input[name='F16013']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            vm.fn_resetErrorMessage();
            vm.fn_resetRecords( rowIndex );
        });


        /* table tr 에서 종목코드 엔터키 누를시   */
        $('#table01 tbody').on('keypress', "input[name='F16013']", function(e) {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();
            var v_F16013_obj    =   null;

            vm.fn_resetErrorMessage();

            if( e.which == 13 ) {

                v_F16013_obj    =   $(this);

                var  flag = true;
                table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                    var tr = $(this);

                    var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );            /* 첫번째 컬럼 */
                    var v_F16013        =   tr.find( "td input[name=F16013]" );             /* 종목코드 */

                    /* 종목코드가 존재하는 경우 */
                    if( typeof v_F16013.val() != "undefined" && v_F16013.val() != "" && rowIndex != tr.index() ) {

                        /* 중복된 종목은 추가하지 않음. */
                        if(  v_F16013.val() == v_F16013_obj.val() ) {
                            vm.arr_show_error_message.push( v_text0.text() + " 종목코드(" + v_F16013.val() + ") 가 존재합니다." );
                            v_F16013_obj.val("");
                            flag = false;

                            return  false;
                        }
                    }
                });

                if( !flag ) {
                    return  false;
                }

                /* 종목코드를 검색한다. */
                vm.fn_getJongmokData( rowIndex, $(this) ).then(function(e){

                    if( e && e.result ) {
                        
                        var rowItem;
                        if( e.rowItem && Object.keys( e.rowItem ).length > 0 )  {
                            rowItem =   e.rowItem;

                            tr.find( "td input[name=F16013]" ).val( rowItem.F16013 );               /* 종목코드 */
                            tr.find( "td:eq(2)" ).text( rowItem.F16002 );                           /* 종목명 */
                            tr.find( "td:eq(3)" ).text( util.formatInt( rowItem.F15028 ) );         /* 시가총액 */

                            /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
                            vm.fn_setImportanceMethodCd( vm.importance_method_cd ).then( function(e1){
                                vm.fn_setTotalRecord();
                            });                            
                        }
                    }
                });
            }
        });        

        

        /* table tr 에서 비중 change 시 total 영역 계산   */
        $('#table01 tbody').on('change', "input[name='importance']", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();
            var v_importance=   $(this);

            /* 비중을 변경하는 경우 [직접입력] 으로 강제 설정 */
            vm.importance_method_cd =   "1";
            vm.fn_setImportanceMethodCdEvent( vm.importance_method_cd );

            // if( v_importance.val() ) {
            //     v_importance.val( util.formatNumber( v_importance.val() ) );
            // }


            /* html에 입력된 정보를 p_gubun 에 맞게 일자별 포트폴리오에 등록시킨다. */
            vm.fn_setRebalancePortfolioObj( { p_gubun : "tr", p_obj : tr } );

            vm.fn_resetErrorMessage();
            vm.fn_setTotalRecord();
        });


        /* 포트폴리오 파일 영역 */
        this.$refs.portfolioFile.addEventListener(
            "change",
            async function(evt) {
                var vm          =   this;
                let file        =   this.$refs.portfolioFile.files[0];

                var flag    =   true;

                /* 엑셀 유형인지 파일을 체크한다. */
                await vm.fn_checkFile( file ).then( async function(e) {

                    if( e && e.result ) {

                        /* 파일 사이즈를 체크한다. */
                        return  await vm.fn_sizeCheck( file, "file" );
                    }else{
                        flag = false;
                    }

                }).then( async function(e) {

                    if( e && e.result ) {

                        /* 포트폴리오 엑셀을 업로드 한다. */
                        return  await vm.fn_uploadPortfolio( file );
                    }else{
                        flag = false;
                    }

                }).then( async function(e) {

                    if( e && e.result ) {

                        /* 선택된 리밸런싱 일자에 속한 포트폴리오를 노출한다. */
                        vm.fn_showRebalanceDatePortfolio();

                    }else{
                        flag = false;
                    }

                }).catch( function(e) {

                    if( e && e.result ) {

                    }else{
                        flag = false;
                    }
                });

                vm.$refs.portfolioFile.value  =   null;

                if( vm.$refs.portfolioFile.files ) {
                    vm.$refs.portfolioFile.files  =   null;
                }

            }.bind(this)
        );


    },



    methods: {

        /*
         * 에러내용을 초기화 한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_resetErrorMessage : function() {
            var vm = this;

            vm.arr_show_error_message   =   [];
        },

        /*
         * 초기화를 수행한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_refresh() {

			var vm = this;

			if( await vm.$refs.confirm2.open(
						'[시뮬레이션]',
						'입력된 내용이 모두 초기화 됩니다. 그래도 진행하시겠습니까?',
						{}
					,   2
				)
			) {
				if( "Y" == vm.$refs.confirm2.val ) {
					vm.start_year             		=	"2000";   	/* 시작년도 */
					vm.rebalance_cycle_cd          	=  	"1";        /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
					vm.rebalance_date_cd           	=   "1";        /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
					vm.init_invest_money           	=   1000000;    /* 초기투자금액 */
					vm.bench_mark_cd               	=   "1";        /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
					vm.importance_method_cd        	=   "1";        /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
					vm.bench_index_cd01            	=   "";         /* 벤치마크 인덱스 코드 ( F16013 ) */
					vm.bench_index_cd02            	=   "";         /* 벤치마크 인덱스 코드 ( large_type ) */
					vm.bench_index_cd03            	=   "";         /* 벤치마크 인덱스 코드 ( middle_type ) */
					vm.bench_index_nm              	=   "";         /* 벤치마크 인덱스 코드명 */
					vm.p_rebalance_file_yn         	=   "0";        /* 리밸런싱 일자가 포함된 샘플파일 유무 */
                    vm.excel_start_year             =   ""          /* 리밸런싱 파일인 경우 넘겨받은 엑셀 start_year */

					vm.arr_portfolio               	=   [];         /* 포트폴리오 설정 정보 */
					vm.arr_rebalance_date          	=   [];         /* 리밸런싱 일자 */
					vm.arr_rebalance_portfolio     	=   [];         /* 리밸런싱별 포트폴리오 */
					vm.change_rebalance_yn         	=   "0";        /* 리밸런싱 내역조정 여부 */
					vm.rebalance_date              	=   "";         /* 리밸런싱 일자 */
					vm.rebalancePortfolioObj       	=   {};         /* 리밸런싱일별 포트폴리오 */


                    var arr_temp = [...vm.arr_rebalance_cycle_cd];

                    vm.arr_rebalance_cycle_cd   =   [];

                    vm.disabled_rebalance_cd    =   vm.arr_rebalance_disabled_check[ vm.rebalance_cycle_cd ];
                    vm.arr_rebalance_cycle_cd   =   [ ...arr_temp ];                    

					vm.old_start_year              	=   "2000";
					vm.old_rebalance_cycle_cd      	=   "1";
					vm.old_rebalance_date_cd       	=   "1";
					vm.old_rebalance_date          	=   "";

					/* 레코드를 초기화 한다. */
					vm.fn_initRecords();

					/* 최초 5개의 레코드를 노출한다. */
					vm.fn_addRecords( 0, 5 );

					/* 화면에서 select 된 리밸런싱 일자를 조회한다. */
					vm.fn_getRebalanceDate().then( function(e1){
						if( e1 && e1.result ) {
							vm.old_rebalance_date    =   vm.rebalance_date;
						}
					});
				}
			}

		},


        /*
         * 초기 시뮬레이션을 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_getInitSimul() {

            var vm = this;

			/* 목록에서 넘겨받은 key 값이 존재하는 경우 등록된 내용을 조회하여 설정한다. */
			if(     vm.paramData && Object.keys( vm.paramData ).length > 0 
				&&  vm.paramData.grp_cd && vm.paramData.scen_cd 
			) {

                vm.detail_init_yn   =   "Y";

				/* 상위 그룹 정보 및 초기 데이터가 설정된 이후 상세정보 설정되도록 함. */
				
				/* 상위 그룹정보를 조회한다. */
				vm.fn_initGrpCd().then( async function(e) {

					if( e && e.result ) {

						/* 초기 설정 데이터를 조회한다. */
						await vm.fn_initData().then( async function(e1) {

							if( e1 && e1.result ) {

								/* 시뮬레이션 마스터 정보를 조회한다. */
								vm.fn_getSimulMast( vm.paramData );
							}
						});
					}
				});

			}else{

				/* 상위 그룹정보를 조회한다. */
				vm.fn_initGrpCd();

				/* 초기 설정 데이터를 조회한다. */
				vm.fn_initData().then( function(e) {
					
					if( e && e.result ) {

						if( !vm.rebalance_date_cd ) {
							vm.rebalance_date_cd        =   "1";

							vm.old_start_year           =   vm.start_year;
							vm.old_rebalance_cycle_cd   =   vm.rebalance_cycle_cd;
							vm.old_rebalance_date_cd    =   vm.rebalance_date_cd;

							/* 화면에서 select 된 리밸런싱 일자를 조회한다. */
							vm.fn_getRebalanceDate().then( function(e1){
								if( e1 && e1.result ) {
									vm.old_rebalance_date    =   vm.rebalance_date;
								}
							});
						}
					}
				});

				/* next 시나리오명을 조회한다. */
				vm.fn_getNextScenName();

				/* 최초 5개의 레코드를 노출한다. */
				vm.fn_addRecords( 0, 5 );

				/* total 레코드를 설정한다. */
				vm.fn_setTotalRecord();
			}

        },

        /*
         * 진행 progress 를 보여준다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showProgress: function( visible ) {
            var vm = this;
            vm.$emit("fn_showProgress", visible );
        },

        fn_showWaitProgress: function( visible ) {
            var vm = this;
            vm.$emit("fn_showWaitProgress", visible );
        },

        /*
         * 비중설정방식 선택시 테이블의 비중정보를 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_setImportanceMethodCdEvent: function( importance_method_cd ) {
            var vm = this;

            vm.stock_gubun  =   "1";

            /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
            vm.fn_setImportanceMethodCd( importance_method_cd ).then( function(e1){
                vm.fn_setTotalRecord();
            });            
        },

        /*
         * 비중설정방식 선택시 테이블의 비중정보를 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_setImportanceMethodCd( importance_method_cd ) {
            var vm = this;


            var v_portfolioObj  =   {};


            return  await new Promise(function(resolve, reject) {

                if(     vm.rebalancePortfolioObj
                    &&  vm.rebalance_date
                    &&  typeof vm.rebalancePortfolioObj[ vm.rebalance_date ] != "undefined" 
                    &&  vm.rebalancePortfolioObj[ vm.rebalance_date ]
                ) {
                    vm.rebalancePortfolioObj[ vm.rebalance_date ]     =   {};
                }
                

                /* 계산할 항목에 대한 전체 정보를 구한다. */
                table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                    var tr = $(this);

                    var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );            /* 첫번째 컬럼 */
                    var v_F16002        =   tr.find( "td:eq(2)" );                          /* 종목명 */
                    var v_F16013        =   tr.find( "td input[name=F16013]" );             /* 종목코드 */
                    var v_F15028        =   tr.find( "td:eq(3)" );                          /* 시가총액 */
                    var v_importance    =   tr.find( "td input[name=importance]" );         /* 비중 */


                    /* 종목코드가 존재하는 경우 */
                    if( typeof v_F16013.val() != "undefined" ) {

                        if( v_F16013.val() != "" ) {

                            var rowData     =   {
                                    "F16013"        :   v_F16013.val()                                                      /* 종목코드 */
                                ,   "F16002"        :   v_F16002.text()                                                     /* 종목명 */
                                ,   "F15028"        :   util.NumtoStr( v_F15028.text() )                                    /* 시가총액 */
                                ,   "importance"    :   Number( Number( util.NumtoStr( v_importance.val() ) ).toFixed(5) )  /* 비중 */
                                ,   "order_no"      :   0                                                                   /* 정렬순번 */
                                ,   "trIndex"       :   tr.index()                                                          /* 테이블 레코드 순번 */
                            };

                            if( !v_portfolioObj[ vm.rebalance_date ] || Object.keys( v_portfolioObj[ vm.rebalance_date ] ).length == 0 ) {
                                v_portfolioObj[ vm.rebalance_date ]   =   {};
                            }                    

                            v_portfolioObj[ vm.rebalance_date ][ rowData.F16013 ]     =   Object.assign( {}, rowData );
                        }
                    }
                });


                /* 비중 설정 방식에 따라 각 종목의 비중정보를 구한다. */
                vm.fn_calcImportance( importance_method_cd, v_portfolioObj ).then( function(e2){
                    var v_returnObj =   {};
                    var total       =   {};


                    if( e2 && e2.returnData ) {

                        v_returnObj =  e2.returnData; 

                        /* 직접입력인 경우 */
                        if( [ "1"].includes( importance_method_cd ) ) {

                            /* html에 입력된 정보를 p_gubun 에 맞게 일자별 포트폴리오에 등록시킨다. */
                            vm.fn_setRebalancePortfolioObj( { p_gubun : "table" } );
                        }
                        /*  레코드별 비중정보를 구한다. (동일가중, 시총비중) */
                        else if( [ "2", "3"].includes( importance_method_cd ) ) {

                            if( v_returnObj.resultListObj && typeof v_returnObj.resultListObj[ vm.rebalance_date ] != "undefined" && v_returnObj.resultListObj[ vm.rebalance_date ] ) {

                                var result  =   v_returnObj.resultListObj[ vm.rebalance_date ];

                                if( result && result.length > 0 ) {

                                    /* 비중 정보를 tr 에 설정한다. */
                                    var v_inx   =   0;
                                    table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                                        var tr = $(this);

                                        var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );                /* 첫번째 컬럼 */
                                        var v_F16013        =   tr.find( "td input[name=F16013]" );                 /* 종목코드 */
                                        var v_F15028        =   tr.find( "td:eq(3)" );                              /* 시가총액 */
                                        var v_importance    =   tr.find( "td input[name=importance]" );             /* 비중 */

                                        if( typeof v_F16013.val() != "undefined" ) {
                                            if( v_F16013.val() != "" ) {

                                                var existCheck = _.find( result, function(o) {
                                                    if ( v_F16013.val() == o.F16013 ) {
                                                        return  o;
                                                    }
                                                });

                                                if( existCheck && Object.keys( existCheck ).length > 0 ) {
                                                    v_importance.val( Number( existCheck.importance ).toFixed(5) ); /* 비중 */
                                                }
                                            }
                                        }
                                    });

                                    /* html에 입력된 정보를 p_gubun 에 맞게 일자별 포트폴리오에 등록시킨다. */
                                    vm.fn_setRebalancePortfolioObj( { p_gubun : "table" } );                        

                                    /* 모든 일자별 포트폴리오 정보를 v_returnObj 에 맞게 설정한다. */
                                    vm.fn_modifyAllRebalancePortfolioObj( importance_method_cd );
                                }
                            }
                        }


                        if( v_returnObj.totalObj && typeof v_returnObj.totalObj[ vm.rebalance_date ] != "undefined" && v_returnObj.totalObj[ vm.rebalance_date ] ) {
                            total   =   v_returnObj.totalObj[ vm.rebalance_date ];
                        }

                        vm.importance_method_cd =   importance_method_cd;

                        resolve( { result : true } );
                    }else{
                        resolve( { result : false } );
                    }
                });

            }).catch( function(e1) {

                console.log( e1 );
            });
        },

        /*
         * 비중 설정 방식에 따라 각 종목의 비중정보를 구한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_calcImportance( p_importance_method_cd, p_portfolioObj ) {

            var vm = this;

            var returnData      =   {
                    totalObj        :   {}
                ,   resultListObj   :   {}
                ,   resultObj       :   {}
            };
            var totalObj        =   {};         /* total 정보 */
            var resultListObj   =   {};         /* 결과정보 */
            var resultObj       =   {};


            return  await new Promise(function(resolve, reject) {

                try{

                    if( p_portfolioObj && Object.keys( p_portfolioObj ).length > 0 ) {

                        for( var i=0; i < Object.keys( p_portfolioObj ).length; i++ ) {

                            var v_key   =   Object.keys( p_portfolioObj )[i];
                            var v_item  =   p_portfolioObj[ v_key ];

                            if( v_item && Object.keys( v_item ).length > 0 ) {

                                totalObj[ v_key ]       =       {
                                        length          :   0       /* 총건수 */
                                    ,   same_rate_sum   :   100     /* 동일가중 합계 */

                                    ,   F15028          :   0       /* (합계) 시가총액 */
                                    ,   importance      :   0       /* (합계) 비중 */
                                };

                                resultListObj[ v_key ]      =   [];
                                resultObj[ v_key ]          =   {};

                                for( var j=0; j < Object.keys( v_item ).length; j++ ) {

                                    var v_sub_key   =   Object.keys( v_item )[j];
                                    var v_sub_item  =   v_item[ v_sub_key ];

                                    totalObj[ v_key ].length++;                         /* 총건수 */

                                    totalObj[ v_key ].F15028            =   Number( totalObj[ v_key ].F15028 )  +  Number( v_sub_item.F15028 );     /* (합계) 시가총액 */
                                    totalObj[ v_key ].importance        =   Number (
                                        ( Number( totalObj[ v_key ].importance ) + Number( v_sub_item.importance ) ).toFixed(5)
                                    );                                                                                                              /* (합계) 비중 */


                                    resultListObj[ v_key ].push({
                                            F16013      :   v_sub_item.F16013           /* 종목코드 */
                                        ,   F15028      :   v_sub_item.F15028           /* 시가총액 */
                                        ,   importance  :   v_sub_item.importance       /* 비중 */
                                    });


                                    if( !resultObj[ v_key ][ v_sub_item.F16013 ] || Object.keys( resultObj[ v_key ][ v_sub_item.F16013 ] ).length == 0 ) {
                                        resultObj[ v_key ][ v_sub_item.F16013 ]     =   {};
                                    }   

                                    resultObj[ v_key ][ v_sub_item.F16013 ].F15028      =   v_sub_item.F15028;
                                    resultObj[ v_key ][ v_sub_item.F16013 ].importance  =   v_sub_item.importance;
                                }
                            

                                /*  레코드별 비중정보를 구한다. (동일가중, 시총비중) */
                                if( [ "2", "3"].includes( p_importance_method_cd ) ) {

                                    var same_rate           =   0;      /* 동일 가중 비율 */
                                    var v_temp_importance   =   0;
                                    var v_inx               =   0; 



                                    totalObj[ v_key ].importance		=	0;

                                    same_rate           =   (
                                        Math.floor( ( Number( totalObj[ v_key ].same_rate_sum ) / Number( totalObj[ v_key ].length ) ) * 100000 ) / 100000
                                    );                                                                                      /* 동일 가중 비율 */
                                    v_temp_importance   =   0;
                                    v_inx               =   0;

                                    for( var j=0; j < Object.keys( v_item ).length; j++ ) {

                                        var v_sub_key   =   Object.keys( v_item )[j];
                                        var v_sub_item  =   v_item[ v_sub_key ];

                                        /* 동일가중인 경우 */
                                        if( p_importance_method_cd == "2" ) {
                                            v_temp_importance       =   same_rate;
                                        }
                                        /* 시총비중인 경우 */
                                        else if( p_importance_method_cd == "3" ) {
                                            v_temp_importance       =   Number(
                                                Math.floor( ( Number( v_sub_item.F15028 ) / Number( totalObj[ v_key ].F15028 ) ) * 10000000 ) / 100000
                                            );
                                        }

                                        totalObj[ v_key ].importance                =   Number( 
                                            ( Number( totalObj[ v_key ].importance ) +   Number( v_temp_importance ) ).toFixed(5)
                                        );                                                                                  /* (합계) 비중 */

                                        resultListObj[ v_key ][v_inx].F16013        =   v_sub_item.F16013;                  /* 종목코드 */
                                        resultListObj[ v_key ][v_inx].F15028        =   Number( v_sub_item.F15028 );        /* 시가총액 */
                                        resultListObj[ v_key ][v_inx].importance    =   Number( v_temp_importance );        /* 비중 */



                                        if( !resultObj[ v_key ][ v_sub_item.F16013 ] || Object.keys( resultObj[ v_key ][ v_sub_item.F16013 ] ).length == 0 ) {
                                            resultObj[ v_key ][ v_sub_item.F16013 ]     =   {};
                                        }

                                        resultObj[ v_key ][ v_sub_item.F16013 ].F15028      =   Number( v_sub_item.F15028 );        /* 시가총액 */
                                        resultObj[ v_key ][ v_sub_item.F16013 ].importance  =   Number( v_temp_importance );        /* 비중 */

                                        v_inx++;
                                    }
                                }


                                /* 비중 합계가 100 이  아닌 경우 0.00001 값을 더해 100 이 되면 중단 */
                                if( Number( ( Number( totalObj[ v_key ].same_rate_sum ) - Number( totalObj[ v_key ].importance ) ).toFixed(5) ) != 0 ) {

                                    for( var j in resultListObj[ v_key ] ) {

                                        totalObj[ v_key ].importance    =   Number(
                                            ( Number( totalObj[ v_key ].importance ) +  Number( 0.00001 ) ).toFixed(5)
                                        );

                                        resultListObj[ v_key ][j].importance   =   Number( 
                                            ( Number( resultListObj[ v_key ][j].importance ) +  Number( 0.00001 ) ).toFixed(5)
                                        );


                                        resultObj[ v_key ][ resultListObj[ v_key ][j].F16013 ].importance  =   Number( resultListObj[ v_key ][j].importance );      /* 비중 */

                                        if( Number( totalObj[ v_key ].importance ) == Number( totalObj[ v_key ].same_rate_sum ) ) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    returnData.totalObj        =    totalObj;
                    returnData.resultListObj   =    resultListObj;
                    returnData.resultObj       =    resultObj;

                    resolve( { result : true, returnData : returnData } );

                }catch( e1 ) {
                    console.log( e1 );
                    resolve( { result : false, returnData : returnData } );
                };

            }).catch(error => {
                console.log( error );
                resolve( { result : false, returnData : returnData } );                    
            });
        },

        /*
         * 상위 그룹정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_initGrpCd() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            return  await new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getInitGrpCd"
                            ,   "data"      :   {}
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.arr_show_error_message.push( msg );
                                        }

                                        resolve( { result : false } );
                                    }else{
                                        vm.arr_grp_cd   =   response.data.dataList;                       

                                        resolve( { result : true } );
                                    }
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            vm.fn_showProgress( false );
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
//                resolve( { result : false } );
            });
        },

        /*
         * 종목코드를 검색한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_getJongmokData( rowIndex=0, v_obj={} ) {
            var vm = this;

            if( v_obj.val() == "" ) {
                if (await vm.$refs.confirm2.open(
                        '확인',
                        '종목코드를 입력해 주세요.',
                        {}
                        ,1
                    )
                ) {
                    return  false;
                }

                return  false;
            }

            if( v_obj.val().length < 6 ) {
                if (await vm.$refs.confirm2.open(
                        '확인',
                        '종목코드를 6자리 이상 입력해 주세요.',
                        {}
                        ,1
                    )
                ) {
                    return  false;
                }
                return  false;
            }            


            return  new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/etp/getJongmokData"
                            ,   "data"      :   { "searchCode" : v_obj.val() }
                            ,   "method"    :   "post"
                        }
                    ,   async function(response) {
                            vm.fn_showProgress( false );

                            try{
                                if (response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );
                                    if (!response.data.result) {
                                        if( msg ) {
                                            if (await vm.$refs.confirm2.open(
                                                    '확인',
                                                    msg,
                                                    {}
                                                    ,1
                                                )
                                            ) {
                                                resolve( { result : false } );
                                            }
                                        }
                                    }else{
                                        var dataList = response.data.dataList;

                                        if ( !dataList || dataList.length == 0 ) {
                                            if (await vm.$refs.confirm2.open(
                                                    '확인',
                                                    '종목코드(' + v_obj.val() + ')가 존재하지 않습니다.',
                                                    {}
                                                    ,1
                                                )
                                            ) {
                                                resolve( { result : false } );
                                            }
                                        }
                                        else if ( dataList.length > 1 ) {
                                            if (await vm.$refs.confirm2.open(
                                                    '확인',
                                                    '종목코드(' + v_obj.val() + ')가 여러건 존재합니다.',
                                                    {}
                                                    ,1
                                                )
                                            ) {
                                                resolve( { result : false } );
                                            }
                                        
                                        }else if(  dataList.length == 1 ) {
                                            resolve( { result : true, rowItem : dataList[0] } );
                                        }
                                    }
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            vm.fn_showProgress( false );
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
                // resolve( { result : false } );
            });
        },

        /*
         * next 시나리오명을 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getNextScenName() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.fn_showProgress( true );

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/getNextScenName"
                        ,   "data"      :   {}
                        ,   "method"    :   "post"
                    }
                ,   function(response) {
                        vm.fn_showProgress( false );

                        try{
                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.arr_show_error_message.push( msg );
                                    }
                                }else{
                                    vm.scen_name   =   response.data.scen_name;
                                }
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.fn_showProgress( false );
                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );            
        },

        /*
         * 초기 설정 데이터를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_initData() {
            var vm = this;

            /* 
                COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 )
                COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 )
                COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ )
                COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 )
                COM013 - 주식수 구분 ( 1-유동주식수, 2-상장주식수 )
            */
            var arrComMstCd = [ "COM006", "COM007", "COM008", "COM009", "COM013" ];            

            vm.arr_show_error_message   =   [];

            return  new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getInitData"
                            ,   "data"      :   { arrComMstCd : arrComMstCd }
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{
                                if (response && response.data) {
                                    var arrMsg = ( response.data.arrMsg && response.data.arrMsg.length > 0 ? response.data.arrMsg : [] );

                                    if (!response.data.result) {
                                        if( arrMsg.length > 0 ) {
                                            vm.arr_show_error_message.push( ...arrMsg );
                                        }

                                        resolve( { result : false } );
                                    }else{

                                        /* 초기설정 시작년도 array */
                                        if( response.data.arr_start_year && response.data.arr_start_year.length > 0 ) {
                                            vm.arr_start_year   =   response.data.arr_start_year;
                                        }

                                        /* 초기설정 리밸런싱주기 array */
                                        if( response.data.arr_rebalance_cycle_cd && response.data.arr_rebalance_cycle_cd.length > 0 ) {
                                            vm.arr_rebalance_cycle_cd   =   response.data.arr_rebalance_cycle_cd;
                                        }

                                        /* 초기설정 리밸런싱일자 array */
                                        if( response.data.arr_rebalance_date_cd && response.data.arr_rebalance_date_cd.length > 0 ) {
                                            vm.arr_rebalance_date_cd   =   response.data.arr_rebalance_date_cd;
                                        }

                                        /* 초기설정 벤치마크 array */
                                        if( response.data.arr_bench_mark_cd && response.data.arr_bench_mark_cd.length > 0 ) {
                                            vm.arr_bench_mark_cd   =   response.data.arr_bench_mark_cd;
                                        }

                                        /* 초기설정 비중설정방식 array */
                                        if( response.data.arr_importance_method_cd && response.data.arr_importance_method_cd.length > 0 ) {
                                            vm.arr_importance_method_cd   =   response.data.arr_importance_method_cd;
                                        }

                                        /* 초기설정 주식수구분 array */
                                        if( response.data.arr_stock_gubun && response.data.arr_stock_gubun.length > 0 ) {
                                            vm.arr_stock_gubun          =   response.data.arr_stock_gubun;
                                        }                                        

                                        resolve( { result : true } );
                                    }
                                }else{

                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            vm.fn_showProgress( false );
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
                // resolve( { result : false } );
            });                
        },

        /*
         * 레코드를 추가한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_addRecords( rowIndex=0, addCount=1, dataList=[] ) {
            var vm  =   this;

            var trHtml      =   "";
            var rowData     =   {};

            return  await new Promise( function(resolve, reject) {

                try{
                    for( var i=1; i <= addCount; i++ ) {
                        rowData = {
                                grp_cd      :   ""      /* 그룹코드(상위코드) */
                            ,   scen_cd     :   ""      /* 시나리오코드 */
                            ,   F16013      :   ""      /* 구성종목코드 */
                            
                            ,   F16002      :   ""      /* 종목명 */
                            ,   order_no    :   0       /* 정렬 순번 */
                            ,   importance  :   ""      /* 비중 */
        //                  ,   jisu_rate   :   ""      /* 지수적용비율 */

                            ,   F16013      :   ""      /* 단축코드 */
                            ,   F15028      :   ""      /* 시가총액 */
                            ,   F16017      :   ""      /* 상장일 */
                        };


                        if( dataList.length > 0 && i-1 <= dataList.length-1 ) {
                            rowData =   dataList[ i-1 ];

                            rowData.importance  =   Number( rowData.importance ).toFixed(5);
                        }


                        trHtml      +=  `<tr>`;

                                            /* asset 순번 */
                        trHtml      +=  `    <td>`;
                        if( i == addCount ) {
                            trHtml      +=  `       <button class="btn_icon v-icon material-icons" name="btn_asset">add_circle_outline</button>`;
                        }else{
                            trHtml      +=  `       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
                        }
                        trHtml      +=  `        <span class="add_btn_span">Asset` + (rowIndex+i) + `</span>`;
                        trHtml      +=  `    </td>`;

                                            /* 종목코드 */
                        trHtml      +=  `    <td class="td_in_input">`;
                        trHtml      +=  `        <input type="text"     name="F16013" class="txt_right wid150"  maxlength="15" value="` + rowData.F16013 + `" />`;
                        trHtml      +=  `        <span>`;
                        trHtml      +=  `            <button class="btn_icon v-icon material-icons"  name="btn_F16013_search" >search</button>`;
                        trHtml      +=  `        </span>`;
                        trHtml      +=  `    </td>`;

                                            /* 종목명 */
                        trHtml      +=  `    <td class="txt_left">` + rowData.F16002 + `</td>`;

                                            /* 시가총액 */
                        trHtml      +=  `    <td class="txt_right">` + ( rowData.F15028 ? util.formatInt( rowData.F15028 ) : '' ) + `</td>`;

                                            /* 비중 */
                        trHtml      +=  `    <td class="txt_right">`;
                        trHtml      +=  `        <input type="text"     name="importance"   class="txt_right wid100"  maxlength="9" value="` + rowData.importance + `" /> %`;
                        trHtml      +=  `    </td>`;

                        trHtml      +=  `</tr>`;
                    }

                    $( "#table01 tbody > tr").eq( rowIndex ).before( trHtml );

                    resolve( { result : true } );

                }catch( e1 ) {
                    console.log( e1 );
                    resolve( { result : false } );
                };

            }).catch(error => {
                console.log( error );
                resolve( { result : false } );                    
            });
        },

        /*
         * 종목코드 변경시 선택된 행 정보를 초기화 한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_resetRecords : function( rowIndex ) {
            var vm = this;

            var tr  =   table01.find( "tbody tr" ).eq( rowIndex );

//          tr.find( "td input[name=F16013]" ).val( "" );       /* 종목코드 */
            tr.find( "td:eq(2)" ).text( "" );                   /* 종목명 */
            tr.find( "td:eq(3)" ).text( "" );                   /* 시가총액 */

            tr.find( "td [name=importance]" ).val( "" );        /* 비중 */
        },

        /*
         * total 레코드를 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_setTotalRecord : function( v_total ) {
            var vm = this;

            /* total 정보 */
            var total   =   {
                    length          :   0       /* 총건수 */
                ,   same_rate_sum   :   100     /* 동일가중 합계 */

                ,   F15028          :   0       /* (합계) 시가총액 */
                ,   importance      :   0       /* (합계) 비중 */
//              ,   jisu_rate       :   0       /* (합계) 지수적용 비율 */
            };            


            /* v_total 에 값이 있는 경우 tr 들을 순회하지 않는다.  */
            if( !v_total || Object.keys( v_total ).length == 0 ) {

                table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                    var tr = $(this);

                    var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );                /* 첫번째 컬럼 */
                    var v_F16013        =   tr.find( "td input[name=F16013]" );                 /* 종목코드 */
                    var v_F15028        =   tr.find( "td:eq(3)" );                              /* 시가총액 */
                    var v_importance    =   tr.find( "td input[name=importance]" );             /* 비중 */

                    if( typeof v_F16013.val() != "undefined" ) {
                        if( v_F16013.val() != "" ) {
                            total.F15028            =   Number( total.F15028 )  +  Number( util.NumtoStr( v_F15028.text() ) );                                          /* (합계) 시가총액 */
                            total.importance        =   Number(
                                                            Number(
                                                                Number( Number( total.importance ).toFixed(5) )  +  Number( Number( util.NumtoStr( v_importance.val() ) ).toFixed(5) )
                                                            ).toFixed(5)
                                                        );                                                                                                              /* (합계) 비중 */
                        }
                    }
                });
            }


            /* tr 에 합계를 설정한다.  */
            total   =   Object.assign( total, v_total );
            table01.find( "tbody tr:last" ).each( function( inx, rowItem ) {
                var tr = $(this);

                tr.find( "td:eq(3)").text( util.formatInt( total.F15028 ) );                /* (합계) 시가총액 */
                tr.find( "td input[name=importance]").val( total.importance );              /* (합계) 비중 */
            });
        },

        /*
         * 자산추가 창을 오픈한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_openMastModal: function( rowIndex ) {  
            var vm = this;

            vm.selectedRowIndex =   rowIndex;
            vm.MastModalFlag    =   true;
        },

        /*
         * 자산추가 창을 종료한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_closeMastModal: function() { 
            var vm = this;

            vm.MastModalFlag    =   false;
        },

        /*
         *  자산추가에서 선택한 정보를 반환한다.
         *  gubun : 1 ETF, 2 ETN, 3 INDEX
         * 
         *  2019-07-26  bkLove(촤병국)
         */        
        async fn_getSelectedItem( items, gubun ) {
            var vm = this;

            var flag = true;
            var existInx = 0;
            for( let i=0; i < items.length; i++ ) {

                flag = true;
                table01.find( "tbody tr" ).each( async function( inx, rowItem ) {
                    var tr = $(this);

                    var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );            /* 첫번째 컬럼 */
                    var v_F16013        =   tr.find( "td input[name=F16013]" );             /* 종목코드 */


                    /* 종목코드가 존재하는 경우 */
                    if( typeof v_F16013.val() != "undefined" ) {
                        /* 중복된 종목은 추가하지 않음. */
                        if( v_F16013.val() != "" && v_F16013.val() == items[i].F16013 ) {
                            flag = false;
                        }
                    }
                });


                if( flag ) {
                    /* 추가된 자산정보를 table 에 설정한다. */
                    await vm.fn_setMastRowData( vm.selectedRowIndex + existInx, items[i], gubun );

                    existInx++;
                }
            }

            /* 비중설정방식 선택시 테이블의 비중정보를 설정한다. */
            vm.fn_setImportanceMethodCd( vm.importance_method_cd ).then( function(e1){
                vm.fn_setTotalRecord();
            });            
        },

        /*
         * 추가된 자산정보를 table 에 설정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_setMastRowData: function( rowIndex=0, rowItem, gubun ) {
            var vm = this;

            var dataTrCnt   =   table01.find( "tbody tr input[name=F16013]" ).length;
            if( rowIndex > dataTrCnt-1 ) {
                vm.fn_addRecords( dataTrCnt, 5 );
            }

            var tr;

            return  new Promise(function(resolve, reject) {

            /* 한건씩 자산을 추가한다. */
                tr  =   table01.find( "tbody tr" ).eq( rowIndex );

                tr.find( "td input[name=F16013]" ).val( rowItem.F16013 );       /* 종목코드 */
                tr.find( "td:eq(2)" ).text( rowItem.F16002 );                   /* 종목명 */


                vm.fn_showProgress( true );

            /* 선택된 종목의 구성정보를 조회한다. */
                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getJongmokInfo"
                            ,   "data"      :   { "searchCode" : rowItem.F16013 }
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{
                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.arr_show_error_message.push( msg );
                                        }

                                        resolve( { result : false } );
                                    }else{
                                        var jongmokInfo = response.data.jongmokInfo;
                                        
                                        if( !jongmokInfo || Object.keys( jongmokInfo ).length == 0 ) {
                                            jongmokInfo =   {};
                                        }

                                        tr.find( "td:eq(3)" ).text( util.formatInt( jongmokInfo.F15028 ) );     /* 시가총액 */

                                        resolve( { result : true } );
                                    }

                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            vm.fn_showProgress( false );
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
//                resolve( { result : false } );
            });
        },

        /*
         * 기본정보 저장과 함께 백테스트 실행을 수행한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_runBacktestWithSaveBasicInfo() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            /* 마스트 정보를 밸리데이션 체크한다. */
            vm.fn_validationSimulMast();

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }


            /* 구분에 맞게 선택된 [리밸런싱 일자별 포트폴리오] 데이터를 기준으로 나머지 [리밸런싱의 일자별 포트폴리오] 에 복사한다. */
            vm.fn_copySelectedDateToRebalanceAll( { p_gubun : "first", p_exist_data_skip_yn : "Y"  } );


            /* 선택된 리밸런싱 일자에 속한 포트폴리오를 밸리데이션 체크한다. */
            vm.fn_validationRebalanceDatePortfolio( { p_importance_total_check : 'Y' } );


            /* 리밸런싱 내역조정 버튼 필수 체크 */
            if( vm.change_rebalance_yn ==  "0" ) {
                vm.arr_show_error_message.push( "리밸런싱 내역조정을 한 후 백테스트 진행하세요." );
            }

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }

            var v_order_no  	=   0;
            var v_importance	=	0;

            /* tm_simul_portfolio 의 order_no 를 조정한다. */
            if( vm.rebalancePortfolioObj && Object.keys( vm.rebalancePortfolioObj ).length > 0 ) {
				
                for( var i=0; i < Object.keys( vm.rebalancePortfolioObj ).length; i++ ) {

                    var v_key       =   Object.keys( vm.rebalancePortfolioObj )[i];
                    var v_sub_item  =   vm.rebalancePortfolioObj[ v_key ];

                    v_order_no  	=   0;
					v_importance	=	0;


                    /* 종목이 2개 이상인 경우 trIndex 순으로 정렬하여 order_no 설정 */
                    if(  Object.keys( v_sub_item ).length > 1 ) {

                        var arrKey    =   [];
                        var tempKey;

                        for( var j=0; j < Object.keys( v_sub_item ).length; j++ ) {
                            arrKey.push( Object.keys( v_sub_item )[j] );
                        }

                        for( var j=0; j < arrKey.length-1; j++ ) {
                            for( var k=j; k < arrKey.length; k++ ) {
                                if( v_sub_item[ arrKey[j] ].trIndex > v_sub_item[ arrKey[k] ].trIndex ) {
                                    tempKey     =   arrKey[j];
                                    arrKey[j]   =   arrKey[k];
                                    arrKey[k]   =   tempKey;
                                }
                            }
                        }                   

                        for( var j=0; j < arrKey.length; j++ ) {
                            var v_sub_key2  =   arrKey[j];
                            var v_sub_item2 =   v_sub_item[ v_sub_key2 ];
                            
                            v_sub_item2.importance	=	Number( v_sub_item2.importance ).toFixed(5);

                            v_importance   	=   Number(
                                Number(
                                    Number( Number( v_importance ).toFixed(5) )  +  Number( v_sub_item2.importance )
                                ).toFixed(5)
                            );                     /* (합계) 비중 */

                            v_sub_item2.order_no    =   ++v_order_no;
                        }

                    }
                    /* 종목이 1개 인 경우 */
                    else{

                        for( var j=0; j < Object.keys( v_sub_item ).length; j++ ) {
                            var v_sub_key2  =   Object.keys( v_sub_item )[j];
                            var v_sub_item2 =   v_sub_item[ v_sub_key2 ];
                            
                            v_sub_item2.importance	=	Number( v_sub_item2.importance ).toFixed(5);

                            v_importance   	=   Number(
                                Number(
                                    Number( Number( v_importance ).toFixed(5) )  +  Number( v_sub_item2.importance )
                                ).toFixed(5)
                            );                     /* (합계) 비중 */

                            v_sub_item2.order_no    =   ++v_order_no;
                        }
                    }

					if( v_importance != 100 ) {
						vm.arr_show_error_message.push( "리밸런싱 일 ( " + v_key + " ) 에 비중의 합은 100 이 되어야 합니다." );
					}

					/* 10 개 까지만 결과정보에 보관한다. */
					if( vm.arr_show_error_message.length == 10  ) {
						break;
					}
                }
            }

            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }

            /* 벤치마크가 설정된 경우 */
            if( vm.bench_mark_cd != "0" ) {
                if( vm.arr_bench_mark_cd && vm.arr_bench_mark_cd.length > 0  ) {
                    var existCheck = _.filter( vm.arr_bench_mark_cd, function(o) {
                        if ( o.com_dtl_cd == vm.bench_mark_cd ) {
                            return  o;
                        }
                    });
                    
                    if( existCheck && existCheck.length == 1 ) {
                        vm.bench_index_cd01     =   existCheck[0].com_val01;        /* F16013 */
                        vm.bench_index_cd02     =   existCheck[0].com_val02;        /* middle_type */
                        vm.bench_index_cd03     =   existCheck[0].com_val03;        /* large_type */
                        vm.bench_index_nm       =   existCheck[0].com_dtl_name;
                    }
                }
            }

            var v_temp  =   _.filter( vm.arr_grp_cd, {
                "grp_cd"    :   vm.grp_cd
            });

            
            if( !v_temp || v_temp.length != 1 ) {
				vm.arr_show_error_message.push( "상위그룹 정보가 존재하지 않습니다." );
                return  false;
            }


            vm.fn_showWaitProgress( true );

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/runBacktestWithSaveBasicInfo"
                        ,   "data"      :   {
                                    "prev_grp_cd"           :   vm.prev_grp_cd              /* 그룹 코드 (변경전) */
                                ,   "prev_scen_cd"          :   vm.prev_scen_cd             /* 시나리오 코드 (변경전) */
                                ,   "scen_cd"               :   vm.scen_cd                  /* 시나리오 코드 */
                                ,   "scen_order_no"         :   vm.scen_order_no            /* 시나리오 정렬순번 */

                                ,   "grp_cd"                :   vm.grp_cd                   /* 상위 그룹코드 */
                                ,   "org_grp_yn"            :   v_temp[0].grp_yn            /* 상위 그룹여부 */
                                ,   "scen_name"             :   vm.scen_name                /* 시나리오명 */
                                ,   "start_year"            :   vm.start_year               /* 시작년도 */
                                ,   "rebalance_cycle_cd"    :   vm.rebalance_cycle_cd       /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
                                ,   "rebalance_date_cd"     :   vm.rebalance_date_cd        /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
                                ,   "init_invest_money"     :   vm.init_invest_money        /* 초기투자금액 */
                                ,   "bench_mark_cd"         :   vm.bench_mark_cd            /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
                                ,   "bench_index_cd01"      :   vm.bench_index_cd01         /* 벤치마크 인덱스 코드 ( F16013 ) */
                                ,   "bench_index_cd02"      :   vm.bench_index_cd02         /* 벤치마크 인덱스 코드 ( large_type ) */
                                ,   "bench_index_cd03"      :   vm.bench_index_cd03         /* 벤치마크 인덱스 코드 ( middle_type ) */
                                ,   "bench_index_nm"        :   vm.bench_index_nm           /* 벤치마크 인덱스 코드명 */
                                ,   "importance_method_cd"  :   vm.importance_method_cd     /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
                                ,   "stock_gubun"           :   vm.stock_gubun              /* 주식수 구분 */

                                ,   "rebalancePortfolioObj" :   vm.rebalancePortfolioObj    /* 포트폴리오 설정 정보 */
                            }
                        ,   "method"    :   "post"
                    }
                ,   function(response) {
                        vm.fn_showWaitProgress( false );

                        try{
                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.arr_show_error_message.push( msg );
                                        return  false;
                                    }
                                }else{

                                    var arr_daily       =   response.data.arr_daily;
                                    var arr_rebalance   =   response.data.arr_rebalance;
                                    var simul_mast    	=   response.data.simul_mast;
                                    var analyzeList     =   response.data.analyzeList;
                                    var jsonFileName    =   response.data.jsonFileName;
                                    var inputData       =   response.data.inputData;

                                    if( simul_mast ) {
                                        vm.prev_grp_cd      =   simul_mast.grp_cd;           /* 그룹 코드 */
                                        vm.prev_scen_cd     =   simul_mast.scen_cd;          /* 시나리오 코드 */
                                        vm.scen_cd          =   simul_mast.scen_cd;          /* 시나리오 코드 */
                                        vm.scen_order_no    =   simul_mast.scen_order_no;    /* 시나리오 정렬순번 */
                                    }

                                    vm.$emit( "fn_showSimulation", 
                                        { 
                                                showSimulationId    :    2
                                            ,   arr_daily           :   arr_daily
                                            ,   arr_rebalance       :   arr_rebalance
                                            ,   simul_mast          :   simul_mast
                                            ,   analyzeList         :   analyzeList
                                            ,   jsonFileName        :   jsonFileName
                                            ,   inputData           :   inputData
                                        }
                                    );
                                }
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.fn_showWaitProgress( false );
                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );
        },

        /*
         * 시뮬레이션 마스터 정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getSimulMast( v_paramData ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.fn_showProgress( true );

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/getSimulMast"
                        ,   "data"      :   v_paramData
                        ,   "method"    :   "post"
                    }
                ,   function(response) {
                        vm.fn_showProgress( false );

                        try{
                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.arr_show_error_message.push( msg );
                                    }
                                }else{
                                    var mastInfo = response.data.mastInfo;

                                    if( mastInfo && Object.keys( mastInfo ).length > 0 ) {
                                        vm.prev_grp_cd              =   mastInfo.grp_cd;                /* 상위 그룹코드 (변경전) */
                                        vm.prev_scen_cd             =   mastInfo.scen_cd;               /* 시나리오 코드 (변경전) */

                                        vm.scen_cd                  =   mastInfo.scen_cd;               /* 시나리오 코드 */
                                        vm.scen_order_no            =   mastInfo.scen_order_no;         /* 시나리오 정렬순번 */

                                        vm.grp_cd                   =   mastInfo.grp_cd;                /* 상위 그룹코드 */
                                        vm.scen_name                =   mastInfo.scen_name;             /* 시나리오명 */
                                        vm.start_year               =   mastInfo.start_year;            /* 시작년도 */
                                        vm.rebalance_cycle_cd       =   mastInfo.rebalance_cycle_cd;    /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
                                        vm.init_invest_money        =   mastInfo.init_invest_money;     /* 초기투자금액 */
                                        vm.bench_mark_cd            =   mastInfo.bench_mark_cd;         /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
                                        vm.importance_method_cd     =   mastInfo.importance_method_cd;  /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */

                                        vm.bench_mark_cd            =   ( vm.bench_mark_cd == 0 ? "1" : vm.bench_mark_cd );
                                        vm.change_rebalance_yn      =   "1";                            /* 수정인 경우 리밸런싱 일자 콤보박스는 보이도록 수정 */

                                        /* 주식수 구분 */
                                        vm.stock_gubun              =   (
                                                typeof mastInfo.stock_gubun ==  "undefined" 
                                            ||  mastInfo.stock_gubun        ==  null 
                                            ||  mastInfo.stock_gubun        ==  ""

                                            ?   "1"     :   mastInfo.stock_gubun
                                        );

                                        /* 리밸런싱 주기가 없는 경우 - 리밸런싱 일자가 포함된 샘플파일 유무를 1 로 간주 */
                                        if( vm.rebalance_cycle_cd == "" ) {

                                            vm.p_rebalance_file_yn      =   "1";

                                            vm.rebalance_date_cd        =   mastInfo.rebalance_date_cd;     /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */

                                            vm.old_start_year           =   mastInfo.start_year;
                                            vm.old_rebalance_cycle_cd   =   mastInfo.rebalance_cycle_cd;
                                            vm.old_rebalance_date_cd    =   mastInfo.rebalance_date_cd;

                                            /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                            vm.fn_getRebalanceDate().then( function(e1){
                                                if( e1 && e1.result ) {

                                                    vm.old_rebalance_date    =   vm.rebalance_date;

                                                    /* 시뮬레이션 포트폴리오 정보를 조회한다. */
                                                    vm.fn_getSimulPortfolio( vm.paramData );
                                                }
                                            });

                                        }else{

                                            vm.old_start_year           =   mastInfo.start_year;
                                            vm.old_rebalance_cycle_cd   =   mastInfo.rebalance_cycle_cd;
                                            vm.old_rebalance_date_cd    =   mastInfo.rebalance_date_cd;

                                            /* old_value 값과 비교하여 리밸런싱이 변경되었는지 체크한다. */
                                            vm.fn_checkRebalance( 'rebalance_cycle_cd').then( function(e){

                                                vm.rebalance_date_cd    =   mastInfo.rebalance_date_cd;     /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */

                                                /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                                vm.fn_getRebalanceDate().then( function(e1){

                                                    if( e1 && e1.result ) {

                                                        vm.old_rebalance_date    =   vm.rebalance_date;

                                                        /* 시뮬레이션 포트폴리오 정보를 조회한다. */
                                                        vm.fn_getSimulPortfolio( vm.paramData );
                                                    }
                                                });
                                            });
                                        }
                                    }
                                }
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.fn_showProgress( false );
                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );
        },

        /*
         * 시뮬레이션 포트폴리오 정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getSimulPortfolio( v_paramData ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.fn_showProgress( true );

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/getSimulPortfolio"
                        ,   "data"      :   v_paramData
                        ,   "method"    :   "post"
                    }
                ,   function(response) {
                        vm.fn_showProgress( false );

                        try{
                            vm.detail_init_yn   =   "N";

                            /* 레코드를 초기화 한다. */
                            vm.fn_initRecords();

                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.arr_show_error_message.push( msg );
                                    }
                                }else{

                                    vm.rebalancePortfolioObj    =   response.data.rebalancePortfolioObj;

                                    var v_rebalancePortfolio    =   response.data.rebalancePortfolioObj[ vm.rebalance_date ];

                                    /* 선택된 리밸런싱일자에 포트폴리오가 존재하는 경우 */
                                    if( typeof v_rebalancePortfolio != "undefined" && Object.keys( v_rebalancePortfolio ).length > 0 ) {

                                        var dataList    =   [];

                                        for( var i=0; i < Object.keys( v_rebalancePortfolio ).length; i++ ) {
                                            var v_key   =   Object.keys( v_rebalancePortfolio )[i];

                                            dataList.push( v_rebalancePortfolio[ v_key ] );
                                        }

                                        /* trIndex 순으로 정렬하여 노출 */
                                        dataList    =   _.orderBy(
                                                dataList
                                            ,   [ "trIndex" ]
                                            ,   [ "asc" ]
                                        );

                                        /* 건수가 0 인 경우 레코드 5개는 추가한다. */
                                        var cnt = ( Math.ceil( dataList.length / 5 ) == 0 ? 1 : Math.ceil( dataList.length / 5 ) ) * 5;                  

                                        /* 레코드를 추가한다. */
                                        vm.fn_addRecords( 0, cnt, dataList );

                                        /* total 레코드를 설정한다. */
                                        vm.fn_setTotalRecord();
                                    }
                                    /* 선택된 리밸런싱일자에 포트폴리오가 존재하지 않는 경우 */
                                    else{
                                        /* 최초 5개의 레코드를 노출한다. */
                                        vm.fn_addRecords( 0, 5 );
                                    }

                                }
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.fn_showProgress( false );
                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );
        },

        /*
         * 레코드를 초기화 한다.
         * 2019-07-26  bkLove(촤병국)
         */        
        async fn_initRecords() {

            var vm = this;

            return  await new Promise( function(resolve, reject) {

                try{
                    $( table01.find( "tbody tr input[name=F16013]" ).parents("tr").get().reverse() ).each(function(inx){
                        var tr = $(this);

                        var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );                /* 첫번째 컬럼 */
                        var v_F16013        =   tr.find( "td input[name=F16013]" );                 /* 종목코드 */

                        var v_F15028        =   tr.find( "td:eq(3)" );                              /* 시가총액 */
                        var v_importance    =   tr.find( "td input[name=importance]" );             /* 비중 */

                        if( typeof v_F16013 != "undefined" ) {
                            $(this).remove();
                        }
                    });

                    table01.find( "tbody tr:last" ).each( function( inx, rowItem ) {
                        var tr = $(this);

                        tr.find( "td:eq(3)").text( 0 );                                             /* (합계) 시가총액 */
                        tr.find( "td input[name=importance]").val( 0 );                             /* (합계) 비중 */
                    });

                    resolve( { result : true } );

                }catch( e1 ) {
                    console.log( e1 );
                    resolve( { result : false } );
                };

            }).catch(error => {
                console.log( error );
                resolve( { result : false } );                    
            });
        },


        /*
         * old_value 값과 비교하여 리밸런싱이 변경되었는지 체크한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_checkRebalance( p_obj="" ) {

            var vm = this;

            return  await new Promise( function(resolve, reject) {

                try{
                    switch( p_obj ) {

                                /* 시작년도 */
                        case    "start_year"    :

                                vm.$nextTick( async function(){

                                    /* 리밸린싱 엑셀 파일이 업로드된 경우 */
                                    if( vm.rebalance_cycle_cd == "" ) {

                                        if( vm.old_start_year != vm.start_year ) {

                                            if( Number( vm.excel_start_year ) > Number( vm.start_year ) ) {

                                                if( await vm.$refs.confirm2.open(
                                                            '[시뮬레이션]',
                                                            vm.excel_start_year + " 년도 이후로만 선택해 주세요.",
                                                            {}
                                                        ,   1
                                                    )
                                                ) {
                                                    vm.start_year       =   vm.old_start_year;
                                                    return  false;
                                                }
                                            }

                                            vm.old_start_year   =   vm.start_year;
                                            vm.change_rebalance_yn  =   "0";
                                        }

                                    }else{

                                        if( vm.old_start_year != vm.start_year ) {

                                            /*
                                            *  리밸런싱 주기를 변경하는지 체크
                                            *  ( 두번째 [리밸런싱 일자별 포트폴리오] 의 값이 한건 이상 존재시 [리밸런싱 일자별 포트폴리오]에 값이 존재하는 것으로 간주 )
                                            */
                                            vm.fn_confirmRebalance().then( function(e) {
                
                                                /* 초기화를 선택한 경우 */
                                                if( e && e.confirm == "Y" ) {
                                                    vm.old_start_year           =   vm.start_year;
                                                    vm.change_rebalance_yn      =   "0";

                                                    /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                                    vm.fn_getRebalanceDate().then( function(e) {
                                                        if( e && e.result ) {
                                                            vm.old_rebalance_date       =   vm.rebalance_date;

                                                            var v_fist_Date             =   Object.keys( vm.rebalancePortfolioObj )[0];
                                                            var v_org_rebalance_obj     =   vm.rebalancePortfolioObj[ v_fist_Date ];

                                                            vm.rebalancePortfolioObj    =   {};
                                                            vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   Object.assign( {}, v_org_rebalance_obj );

                                                            /* 구분에 맞게 선택된 [리밸런싱 일자별 포트폴리오] 데이터를 기준으로 나머지 [리밸런싱의 일자별 포트폴리오] 에 복사한다. */
                                                            vm.fn_copySelectedDateToRebalanceAll( { p_gubun : "first", p_exist_data_skip_yn : "Y"  } );
                                                        }
                                                    });
                                                }
                                                /* 초기화를 선택 하지 않은 경우 */
                                                else if( e && e.confirm == "N" ) {
                                                    vm.start_year               =   vm.old_start_year;
                                                }
                                                else{
                                                    vm.old_start_year           =   vm.start_year;
                                                    vm.change_rebalance_yn      =   "0";

                                                    /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                                    vm.fn_getRebalanceDate().then( function(e) {
                                                        if( e && e.result ) {
                                                            vm.old_rebalance_date    =   vm.rebalance_date;
                                                        }
                                                    });
                                                }
                                            });
                                        }else{       
                                            vm.old_start_year                   =   vm.start_year;

                                            if( vm.detail_init_yn == "N" ) {
                                                /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                                vm.fn_getRebalanceDate().then( function(e) {
                                                    if( e && e.result ) {
                                                        vm.old_rebalance_date    =   vm.rebalance_date;
                                                    }
                                                });
                                            }
                                        }                                        

                                    }
                                });

                                break;

                                /* 리밸런싱 주기 */
                        case    "rebalance_cycle_cd"    :
        
                                var arr_temp = [...vm.arr_rebalance_cycle_cd];

                                vm.arr_rebalance_cycle_cd   =   [];

                                vm.disabled_rebalance_cd    =   vm.arr_rebalance_disabled_check[ vm.rebalance_cycle_cd ];
                                vm.arr_rebalance_cycle_cd   =   [ ...arr_temp ];

                                vm.$nextTick( function(){

                                    if( vm.old_rebalance_cycle_cd != vm.rebalance_cycle_cd ) {


                                        /*
                                        *  리밸런싱 주기를 변경하는지 체크
                                        *  ( 두번째 [리밸런싱 일자별 포트폴리오] 의 값이 한건 이상 존재시 [리밸런싱 일자별 포트폴리오]에 값이 존재하는 것으로 간주 )
                                        */
                                        vm.fn_confirmRebalance().then( function(e) {
                                            /* 초기화를 선택한 경우 */
                                            if( e && e.confirm == "Y" ) {

                                                vm.old_rebalance_cycle_cd   =   vm.rebalance_cycle_cd;
                                                vm.change_rebalance_yn      =   "0";

                                                vm.rebalance_date_cd    =   "1";

                                                /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                                vm.fn_getRebalanceDate().then( function(e) {
                                                    if( e && e.result ) {
                                                        vm.old_rebalance_date    =   vm.rebalance_date;

                                                        var v_fist_Date             =   Object.keys( vm.rebalancePortfolioObj )[0];
                                                        var v_org_rebalance_obj     =   vm.rebalancePortfolioObj[ v_fist_Date ];

                                                        vm.rebalancePortfolioObj    =   {};
                                                        vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   Object.assign( {}, v_org_rebalance_obj );

                                                        /* 구분에 맞게 선택된 [리밸런싱 일자별 포트폴리오] 데이터를 기준으로 나머지 [리밸런싱의 일자별 포트폴리오] 에 복사한다. */
                                                        vm.fn_copySelectedDateToRebalanceAll( { p_gubun : "first", p_exist_data_skip_yn : "Y"  } );
                                                    }
                                                });
                                                                                            
                                                vm.old_rebalance_date_cd    =   vm.rebalance_date_cd;
                                            }
                                            /* 초기화를 선택 하지 않은 경우 */
                                            else if( e && e.confirm == "N" ) {
                                                vm.rebalance_cycle_cd       =   vm.old_rebalance_cycle_cd;
                                                vm.rebalance_date_cd        =   vm.old_rebalance_date_cd;
                                            }else{
                                                vm.old_rebalance_cycle_cd   =   vm.rebalance_cycle_cd;
                                                vm.change_rebalance_yn      =   "0";

                                                vm.rebalance_date_cd       =   "1";

                                                /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                                vm.fn_getRebalanceDate().then( function(e1) {
                                                    if( e1 && e1.result ) {
                                                        vm.old_rebalance_date    =   vm.rebalance_date;

                                                        var v_fist_Date             =   Object.keys( vm.rebalancePortfolioObj )[0];
                                                        var v_org_rebalance_obj     =   vm.rebalancePortfolioObj[ v_fist_Date ];

                                                        vm.rebalancePortfolioObj    =   {};
                                                        vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   Object.assign( {}, v_org_rebalance_obj );

                                                        /* old_value 값과 비교하여 리밸런싱이 변경되었는지 체크한다. */
                                                        vm.fn_checkRebalance( 'rebalance_date_cd' );
                                                    }
                                                })
                                            }
                                        });

                                    }else{
                                        vm.old_rebalance_cycle_cd   =   vm.rebalance_cycle_cd;

                                        vm.rebalance_date_cd       =   "1";

                                        if( vm.detail_init_yn == "N" ) {

                                            /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                            vm.fn_getRebalanceDate().then( function(e1) {
                                                if( e1 && e1.result ) {
                                                    vm.old_rebalance_date    =   vm.rebalance_date;

                                                    var v_fist_Date             =   Object.keys( vm.rebalancePortfolioObj )[0];
                                                    var v_org_rebalance_obj     =   vm.rebalancePortfolioObj[ v_fist_Date ];

                                                    vm.rebalancePortfolioObj    =   {};
                                                    vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   Object.assign( {}, v_org_rebalance_obj );

                                                    /* old_value 값과 비교하여 리밸런싱이 변경되었는지 체크한다. */
                                                    vm.fn_checkRebalance( 'rebalance_date_cd' );
                                                }
                                            });
                                        }
                                    }
                                });

                                break;

                                /* 첫영업일, 동시만기 영업일, 동시만기 익주 첫영업일, 옵션만기 영업일, 옵션만기 익주 첫영업일 */
                        case    "rebalance_date_cd"    :

                                vm.$nextTick( function(){

                                    if( vm.old_rebalance_date_cd != vm.rebalance_date_cd ) {

                                        /*
                                        *  리밸런싱 주기를 변경하는지 체크
                                        *  ( 두번째 [리밸런싱 일자별 포트폴리오] 의 값이 한건 이상 존재시 [리밸런싱 일자별 포트폴리오]에 값이 존재하는 것으로 간주 )
                                        */
                                        vm.fn_confirmRebalance().then( function(e) {

                                            /* 초기화를 선택한 경우 */
                                            if( e && e.confirm == "Y" ) {

                                                vm.old_rebalance_date_cd    =   vm.rebalance_date_cd;
                                                vm.change_rebalance_yn      =   "0";

                                                /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                                vm.fn_getRebalanceDate().then( function(e) {
                                                    if( e && e.result ) {
                                                        vm.old_rebalance_date    =   vm.rebalance_date;

                                                        var v_fist_Date             =   Object.keys( vm.rebalancePortfolioObj )[0];
                                                        var v_org_rebalance_obj     =   vm.rebalancePortfolioObj[ v_fist_Date ];

                                                        vm.rebalancePortfolioObj    =   {};
                                                        vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   Object.assign( {}, v_org_rebalance_obj );

                                                        /* 구분에 맞게 선택된 [리밸런싱 일자별 포트폴리오] 데이터를 기준으로 나머지 [리밸런싱의 일자별 포트폴리오] 에 복사한다. */
                                                        vm.fn_copySelectedDateToRebalanceAll( { p_gubun : "first", p_exist_data_skip_yn : "Y"  } );
                                                    }
                                                });                                        
                                            }
                                            /* 초기화를 선택 하지 않은 경우 */
                                            else if( e && e.confirm == "N" ) {
                                                vm.rebalance_date_cd        =   vm.old_rebalance_date_cd;
                                            }else{
                                                vm.old_rebalance_date_cd    =   vm.rebalance_date_cd;
                                                vm.change_rebalance_yn      =   "0";

                                                /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                                vm.fn_getRebalanceDate().then( function(e) {
                                                    if( e && e.result ) {
                                                        vm.old_rebalance_date    =   vm.rebalance_date;

                                                        var v_fist_Date             =   Object.keys( vm.rebalancePortfolioObj )[0];
                                                        var v_org_rebalance_obj     =   vm.rebalancePortfolioObj[ v_fist_Date ];

                                                        vm.rebalancePortfolioObj    =   {};
                                                        vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   Object.assign( {}, v_org_rebalance_obj );
                                                    }
                                                });
                                            }
                                        });

                                    }else{
                                        vm.old_rebalance_date_cd    =   vm.rebalance_date_cd;

                                        if( vm.detail_init_yn == "N" ) {

                                            /* 화면에서 select 된 리밸런싱 일자를 조회한다. */
                                            vm.fn_getRebalanceDate().then( function(e) {
                                                if( e && e.result ) {
                                                    vm.old_rebalance_date    =   vm.rebalance_date;

                                                    var v_fist_Date             =   Object.keys( vm.rebalancePortfolioObj )[0];
                                                    var v_org_rebalance_obj     =   vm.rebalancePortfolioObj[ v_fist_Date ];

                                                    vm.rebalancePortfolioObj    =   {};
                                                    vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   Object.assign( {}, v_org_rebalance_obj );
                                                }
                                            });
                                        }
                                    }
                                });

                                break;

                                /* 리밸런싱 날짜 */
                        case    "rebalance_date"    :

                                vm.$nextTick( function(){
                                    if( vm.old_rebalance_date != vm.rebalance_date ) {

                                        /* 선택된 리밸런싱 일자에 속한 포트폴리오를 밸리데이션 체크한다. */
                                        vm.fn_validationRebalanceDatePortfolio( { p_importance_total_check : 'N' } ).then( function(e2){

                                            if( e2 && e2.result ) {
                                                vm.old_rebalance_date   =   vm.rebalance_date;

                                                /* 선택된 리밸런싱 일자에 속한 포트폴리오를 노출한다. */
                                                vm.fn_showRebalanceDatePortfolio();
                                            }else{
                                                vm.rebalance_date       =   vm.old_rebalance_date;
                                            }
                                        });
                                    }
                                });

                                break;
                    }

                    resolve( { result : true } );

                }catch( e1 ) {
                    console.log( e1 );
                    resolve( { result : false } );
                };

            }).catch(error => {
                console.log( error );
                resolve( { result : false } );
            });
        },

        /*
         *  리밸런싱 주기를 변경하는지 체크
         *  ( 두번째 [리밸런싱 일자별 포트폴리오] 의 값이 한건 이상 존재시 [리밸런싱 일자별 포트폴리오]에 값이 존재하는 것으로 간주 )
         *  
         *  2019-07-26  bkLove(촤병국)
         */
        async fn_confirmRebalance() {

            var vm = this;

  
            if( vm.rebalancePortfolioObj && Object.keys( vm.rebalancePortfolioObj ).length >= 2 ) {
                var v_rebalancePortfolioObj_1   =   vm.rebalancePortfolioObj[ Object.keys( vm.rebalancePortfolioObj )[1] ];
                if( v_rebalancePortfolioObj_1 && Object.keys( v_rebalancePortfolioObj_1 ).length > 0 ) {

                    if( await vm.$refs.confirm2.open(
                                '[시뮬레이션]',
                                '리밸런싱 주기 변경을 하면 포트폴리오가 모두 초기화 됩니다. 그래도 진행하시겠습니까?',
                                {}
                            ,   2
                        )
                    ) {
                        if( "Y" == vm.$refs.confirm2.val ) {
                            return  { confirm : "Y" };
                        }else{
                            return  { confirm : "N" };
                        }
                    }

                }
            }

            return  { check : false };
        },

        /*
         * 화면에서 select 된 리밸런싱 일자를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_getRebalanceDate() {
            var vm = this;

            vm.arr_show_error_message   =   [];
            vm.arr_rebalance_date       =   [];

            return  await new Promise(function(resolve, reject) {

                vm.$nextTick( function(){
                    
                    vm.fn_showProgress( true );

                    util.axiosCall(
                            {
                                    "url"       :   Config.base_url + "/user/simulation/getRebalanceDate"
                                ,   "data"      :   {
                                            "grp_cd"                :   vm.grp_cd
                                        ,   "scen_cd"               :   vm.scen_cd

                                        ,   "start_year"            :   vm.start_year 
                                        ,   "rebalance_cycle_cd"    :   vm.rebalance_cycle_cd
                                        ,   "rebalance_date_cd"     :   vm.rebalance_date_cd
                                    }
                                ,   "method"    :   "post"
                            }
                        ,   function(response) {
                                vm.fn_showProgress( false );

                                try{
                                    if (response && response.data) {
                                        var msg = ( response.data.msg ? response.data.msg : "" );

                                        if (!response.data.result) {
                                            if( msg ) {
                                                vm.arr_show_error_message.push( msg );
                                            }

                                            resolve( { result : false } );
                                        }else{
                                            var dataList = response.data.dataList;

                                            if( dataList && dataList.length > 0 ) {
                                                vm.rebalance_date   =   dataList[0].value;
                                            }

                                            vm.arr_rebalance_date   =   dataList;

                                            resolve( { result : true, dataList : dataList } );
                                        }

                                    }else{
                                        resolve( { result : false } );
                                    }

                                }catch(ex) {
                                    resolve( { result : false } );
                                    console.log( "error", ex );
                                }
                            }
                        ,   function(error) {
                                resolve( { result : false } );

                                vm.fn_showProgress( false );
                                if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                            }
                    );

                });

            }).catch( function(e1) {
                console.log( e1 );
            });            

        },

        /*
         * 리밸런싱 내역조정 버튼 클릭시 리밸런싱 날짜 콤보정보를 보여준다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_changeRebalance() {
            var vm = this;

            // if( vm.change_rebalance_yn == "1" ) {
            //     return  false;
            // }

            // if( vm.change_rebalance_yn != "1" ) {
            //     vm.change_rebalance_yn      =   "0";
            // }

            /* 마스트 정보를 밸리데이션 체크한다. */
            vm.fn_validationSimulMast();

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }

            /* 선택된 리밸런싱 일자에 속한 포트폴리오를 밸리데이션 체크한다. */
            vm.fn_validationRebalanceDatePortfolio( { p_importance_total_check : 'Y' } ).then( function(e2){
                if( e2 && e2.result ) {
                    /* 구분에 맞게 선택된 [리밸런싱 일자별 포트폴리오] 데이터를 기준으로 나머지 [리밸런싱의 일자별 포트폴리오] 에 복사한다. */
                    vm.fn_copySelectedDateToRebalanceAll( { p_gubun : "first", p_exist_data_skip_yn : "Y"  } );

                vm.change_rebalance_yn  =   "1";                    
                }
            });

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }
        },


        /*
         * 구분에 맞게 선택된 [리밸런싱 일자별 포트폴리오] 데이터를 기준으로 나머지 [리밸런싱의 일자별 포트폴리오] 에 복사한다.
         * 2019-09-06  bkLove(촤병국)
         */
        async fn_copySelectedDateToRebalanceAll( p_param={ p_gubun : "first", p_exist_data_skip_yn : "Y"  } ) {

            var vm = this;

            return  await new Promise( function(resolve, reject) {

                try{            

                    if( vm.rebalancePortfolioObj && Object.keys( vm.rebalancePortfolioObj ).length > 0 ) {

                        if( Object.keys( vm.rebalancePortfolioObj[ Object.keys( vm.rebalancePortfolioObj )[0] ] ).length > 0 ) {

                            /* 첫 [리밸런싱 일자별 포트폴리오]  */
                            var v_fist_date             =   "";
                            var v_org_rebalance_obj     =   {};

                            if( p_param.p_gubun == "first" ) {
                                v_fist_date     =   Object.keys( vm.rebalancePortfolioObj )[0];
                            }else if( p_param.p_gubun == "selected_rebalance_date" ) {
                                v_fist_date     =   vm.rebalance_date;
                            }


                            if( typeof v_fist_date != "undefined" && v_fist_date != "" ) {
                                v_org_rebalance_obj =   vm.rebalancePortfolioObj[ v_fist_date ];
                            }


                            if( typeof v_fist_date != "undefined" && v_fist_date != "" && Object.keys( v_org_rebalance_obj ).length > 0 ) {

                                /* 첫 [리밸런싱 일자별 포트폴리오] 를 나머지 [리밸런싱 일자별 포트폴리오]에 복사  */
                                for( var i=0; i < vm.arr_rebalance_date.length; i++ ) {

                                    var date    =   vm.arr_rebalance_date[i].value;

                                    if( p_param.p_exist_data_skip_yn == "Y" ) {
                                        /* 이미 [리밸런싱 일자별 포트폴리오] 에 저장된 데이터가 존재하는 경우 복사하지 않고 건너 뛴다. */
                                        if( vm.rebalancePortfolioObj[ date ] && Object.keys( vm.rebalancePortfolioObj[ date ] ).length > 0 ) {
                                            continue;
                                        }
                                    }

                                    if( !vm.rebalancePortfolioObj[ date ] || Object.keys( vm.rebalancePortfolioObj[ date ] ).length == 0 ) {
                                        vm.rebalancePortfolioObj[ date ]    =   {};
                                    }

                                    vm.rebalancePortfolioObj[ date ]    =   Object.assign( {}, v_org_rebalance_obj );
                                }
                            }
                        }
                    }

                    resolve( { result : true } );

                }catch( e1 ) {
                    console.log( e1 );
                    resolve( { result : false } );
                };

            }).catch(error => {
                console.log( error );
                resolve( { result : false } );                    
            });

        },

        /*
         * html에 입력된 정보를 p_gubun 에 맞게 일자별 포트폴리오에 등록시킨다.
         * 2019-09-06  bkLove(촤병국)
         */
        async fn_setRebalancePortfolioObj( p_param = { p_gubun : "tr", p_obj : {} } ) {

            var vm = this;

            return  await new Promise( function(resolve, reject) {

                try{

                    /* 선택된 리밸런싱 일자가 존재하는 경우 */
                    if( vm.rebalance_date ) {
                        
                        if(  p_param.p_gubun == "tr" ) {

                            if( typeof p_param.p_obj != "undefined" && p_param.p_obj != "" ) {

                                var v_F16013    =   p_param.p_obj.find( "td input[name=F16013]" );

                                /* 종목코드가 존재하는 경우에만 등록 */
                                if( typeof v_F16013 != "undefined" && v_F16013.val() != "" ) {

                                    var rowData     =   {
                                            "F16013"        :   p_param.p_obj.find( "td input[name=F16013]" ).val()                             /* 종목코드 */
                                        ,   "F16002"        :   p_param.p_obj.find( "td:eq(2)" ).text()                                         /* 종목명 */
                                        ,   "F15028"        :   util.NumtoStr( p_param.p_obj.find( "td:eq(3)" ).text() )                        /* 시가총액 */
                                        ,   "importance"    :   util.NumtoStr( p_param.p_obj.find( "td input[name=importance]" ).val() )        /* 비중 */
                                        ,   "order_no"      :   0                                                                               /* 정렬순번 */
                                        ,   "trIndex"       :   p_param.p_obj.index()                                                           /* 테이블 레코드 순번 */
                                    };

                                    if( !vm.rebalancePortfolioObj[ vm.rebalance_date ] || Object.keys( vm.rebalancePortfolioObj[ vm.rebalance_date ] ).length == 0 ) {
                                        vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   {};
                                    }                    

                                    vm.rebalancePortfolioObj[ vm.rebalance_date ][ rowData.F16013 ]     =   Object.assign( {}, rowData );
                                }
                            }
                        }
                        else if( p_param.p_gubun == "table" ) {

                            table01.find( "tbody tr" ).each( function( inx, rowItem ) {
                                var tr = $(this);

                                var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );                /* 첫번째 컬럼 */
                                var v_F16002        =   tr.find( "td:eq(2)" );                              /* 종목명 */
                                var v_F16013        =   tr.find( "td input[name=F16013]" );                 /* 종목코드 */
                                var v_F15028        =   tr.find( "td:eq(3)" );                              /* 시가총액 */
                                var v_importance    =   tr.find( "td input[name=importance]" );             /* 비중 */


                                if( typeof v_F16013.val() != "undefined" ) {

                                    if( v_F16013.val() != "" ) {

                                        var rowData     =   {
                                                "F16013"        :   v_F16013.val()                          /* 종목코드 */
                                            ,   "F16002"        :   v_F16002.text()                         /* 종목명 */
                                            ,   "F15028"        :   util.NumtoStr( v_F15028.text() )        /* 시가총액 */
                                            ,   "importance"    :   util.NumtoStr( v_importance.val() )     /* 비중 */
                                            ,   "order_no"      :   0                                       /* 정렬순번 */
                                            ,   "trIndex"       :   tr.index()                              /* 테이블 레코드 순번 */
                                        };

                                        if( !vm.rebalancePortfolioObj[ vm.rebalance_date ] || Object.keys( vm.rebalancePortfolioObj[ vm.rebalance_date ] ).length == 0 ) {
                                            vm.rebalancePortfolioObj[ vm.rebalance_date ]   =   {};
                                        }                    

                                        vm.rebalancePortfolioObj[ vm.rebalance_date ][ rowData.F16013 ]     =   Object.assign( {}, rowData );
                                    }
                                }
                            });
                        }
                    }

                    resolve( { result : true } );

                }catch( e1 ) {
                    console.log( e1 );
                    resolve( { result : false } );
                };

            }).catch(error => {
                console.log( error );
                resolve( { result : false } );                    
            });
        },

        /*
         * 모든 일자별 포트폴리오 정보를 p_returnObj 에 맞게 설정한다.
         * 2019-09-06  bkLove(촤병국)
         */
        async fn_modifyAllRebalancePortfolioObj( importance_method_cd ) {

            var vm = this;


            return  await new Promise( function(resolve, reject) {

                try{
                    if( vm.rebalancePortfolioObj && Object.keys( vm.rebalancePortfolioObj ).length > 0 ) {

                        vm.fn_calcImportance( importance_method_cd, vm.rebalancePortfolioObj ).then( function(e2) {

                            var v_result            =   {};

                            if( e2 && e2.returnData ) {

                                v_result    =   e2.returnData;

                                if( v_result && v_result.resultObj && Object.keys( v_result.resultObj ).length > 0 ) {

                                    for( var i=0; i < Object.keys( vm.rebalancePortfolioObj ).length; i++ ) {

                                        var v_key           =   Object.keys( vm.rebalancePortfolioObj )[i];
                                        var v_item          =   vm.rebalancePortfolioObj[ v_key ];

                                        var v_returnItem    =   v_result.resultObj[ v_key ];

                                        if( v_returnItem && Object.keys( v_returnItem ).length > 0  ) {

                                            for( var j=0; j < Object.keys( v_item ).length; j++ ) {

                                                var v_sub_key   =   Object.keys( v_item )[j];
                                                var v_sub_item  =   v_item[ v_sub_key ];

                                                v_sub_item.importance	=   v_returnItem[ v_sub_item.F16013 ].importance;
                                            }
                                        }
                                    }
                                }

                                resolve( { result : true } );
                            }else{

                                resolve( { result : false } );
                            }
                        });

                    }else{
                        resolve( { result : false } );
                    }

                }catch( e1 ) {
                    console.log( e1 );
                    resolve( { result : false } );
                };

            }).catch(error => {
                console.log( error );
                resolve( { result : false } );                    
            });
        },

        /*
         * 마스트 정보를 밸리데이션 체크한다.
         * 2019-07-26  bkLove(촤병국)
         */   
        fn_validationSimulMast() {

            var vm = this;

            vm.arr_show_error_message   =   [];

            /* 상위그룹 array */
            if( !vm.arr_grp_cd || vm.arr_grp_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [상위그룹] 정보가 존재하지 않습니다." );
            }            

            /* 초기설정 시작년도 array */
            if( !vm.arr_start_year || vm.arr_start_year.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [시작년도] 값이 존재하지 않습니다." );
            }

            /* 초기설정 리밸런싱주기 array */
            if( !vm.arr_rebalance_cycle_cd || vm.arr_rebalance_cycle_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [리밸런싱주기] 값이 존재하지 않습니다." );
            }

            /* 초기설정 리밸런싱일자 array */
            if( !vm.arr_rebalance_date_cd || vm.arr_rebalance_date_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [리밸런싱일자] 값이 존재하지 않습니다." );
            }

            /* 초기설정 벤치마크 array */
            if( !vm.arr_bench_mark_cd || vm.arr_bench_mark_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [벤치마크] 값이 존재하지 않습니다." );
            }

            /* 초기설정 비중설정방식 array */
            if( !vm.arr_importance_method_cd || vm.arr_importance_method_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [비중설정방식] 값이 존재하지 않습니다." );
            }

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }



            if( !vm.scen_name || vm.scen_name.length == 0 ) {
                vm.arr_show_error_message.push( "[조건설정] 시나리오명을 입력해 주세요." );
            }


            /* 리밸런싱 일자가 포함된 샘플파일이 아닌 경우에만 체크 */
            if( vm.p_rebalance_file_yn == "0" ) {

                if( !vm.start_year ) {
                    vm.arr_show_error_message.push( "[조건설정] 시작년도를 선택해 주세요." );
                }

                if( !vm.rebalance_cycle_cd ) {
                    vm.arr_show_error_message.push( "[조건설정] 리밸런싱주기를 선택해 주세요." );
                }

                if( !vm.rebalance_date_cd ) {
                    vm.arr_show_error_message.push( "[조건설정] 리밸런싱 일자를 선택해 주세요." );
                }
            }

            try{
                if( vm.init_invest_money == "" ) {
                    vm.arr_show_error_message.push( "[조건설정] 초기투자금액을 입력해 주세요." );
                }else if( isNaN( vm.init_invest_money ) ) {
                    vm.arr_show_error_message.push( "[조건설정] 초기투자금액은 숫자만 입력해 주세요." );
                }else if( Number( vm.init_invest_money ) <= 0 ) {
                    vm.arr_show_error_message.push( "[조건설정] 초기투자금액은 0 보다 큰수를 입력해 주세요." );
                }
            }catch( e ) {
                vm.arr_show_error_message.push( "[조건설정] 초기투자금액은 숫자만 입력해 주세요." );
            }

        },        

        /*
         * 선택된 리밸런싱 일자에 속한 포트폴리오를 밸리데이션 체크한다.
         * 2019-07-26  bkLove(촤병국)
         */   
        async fn_validationRebalanceDatePortfolio( p_param={ p_importance_total_check : 'Y' } ) {

            var vm = this;

            /* total 정보 */
            var total   =   {
                    length          :   0       /* 총건수 */
                ,   same_rate_sum   :   100     /* 동일가중 합계 */

                ,   F15028          :   0       /* (합계) 시가총액 */
                ,   importance      :   0       /* (합계) 비중 */
            };            
            

            var rowIndex = 1;
            var v_portfolio     =   [];


            return  await new Promise( function(resolve, reject) {

                try{

                    table01.find( "tbody  tr" ).each( function( inx, rowItem ) {
                        var tr = $(this);

                        var v_text0         =   tr.find( "td:eq(0) .add_btn_span" );            /* 첫번째 컬럼 */
                        var v_F16013        =   tr.find( "td input[name=F16013]" );             /* 종목코드 */
                        var v_F16013_nm     =   tr.find( "td:eq(2)" );                          /* 종목코드 명 */

                        var v_F15028        =   tr.find( "td:eq(3)" );                          /* 시가총액 */
                        var v_importance    =   tr.find( "td input[name=importance]" );         /* 비중 */

                        if( typeof v_F16013.val() != "undefined" ) {

                            if( v_F16013.val() != "" ) {

                                /* 종목코드가 존재시 종목명이 없는 경우 ( 종목코드를 수정한 경우 종목명을 지움 ) */
                                if( v_F16013_nm.text() == "" ) {
                                    vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 종목명이 존재하지 않습니다. 종목코드를 확인해 주세요." );
                                }

                                /* 종목코드가 존재시 비중정보 체크 */
                                try{
                                    if( v_importance.val() == "" ) {
                                        vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 비중을 입력해 주세요." );
                                    }else if( isNaN( util.NumtoStr( v_importance.val() ) ) ) {
                                        vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 비중은 숫자만 입력해 주세요." );
                                    }else if( Number( util.NumtoStr( v_importance.val() ) ) <= 0 ) {
                                        vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 비중은 0 보다 큰수를 입력해 주세요." );
                                    }
                                }catch( e ) {
                                    vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 비중은 숫자만 입력해 주세요." );
                                }

                                total.length++;         /* 총건수 */
                                total.F15028            =   Number( total.F15028 )  +  Number( util.NumtoStr( v_F15028.text() ) );                                          /* (합계) 시가총액 */

                                total.importance        =   Number(
                                    Number(
                                        Number( Number( total.importance ).toFixed(5) )  +  Number( Number( util.NumtoStr( v_importance.val() ) ).toFixed(5) )
                                    ).toFixed(5)
                                );                     /* (합계) 비중 */

                                v_portfolio.push({
                                        "F16013"        :   v_F16013.val()                                                          /* 종목코드 */
                                    ,   "F16002"        :   v_F16013_nm.text()                                                      /* 종목명 */
                                    ,   "F15028"        :   util.NumtoStr( v_F15028.text() )                                        /* 시가총액 */                                
                                    ,   "importance"    :   Number( Number( util.NumtoStr( v_importance.val() ) ).toFixed(5) )      /* 비중 */
                                    ,   "order_no"      :   rowIndex++                                                              /* 정렬 순번 */
                                    ,   "trIndex"       :   inx                                                                     /* 테이블 레코드 순번 */
                                });

                            }else{

                                /* 종목코드 없이 비중을 입력한 경우 */
                                if( v_importance.val() != "" ) {
                                    vm.arr_show_error_message.push( "[포트폴리오] " + v_text0.text() + " 종목코드를 선택해주세요" );
                                }

                            }
                        }
                    });

                
                    if( !v_portfolio || v_portfolio.length == 0 ) {
                        vm.arr_show_error_message.push( "[포트폴리오] 종목코드가 한건 이상 존재해야 합니다." );
                        resolve( { result : false } );
                    }

                /**************/
                    if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                        resolve( { result : false } );
                    }

                    /* [포트폴리오] 2건 이상인 경우 중복을 체크한다. */
                    if( v_portfolio && v_portfolio.length > 1 ) {
                        var     tr1         =   null;
                        var     tr2         =   null;

                        var     row1        =   null;
                        var     row2        =   null;

                        var     v_text01    =   null;
                        var     v_text02    =   null;                
                        for( var i = 0; i < v_portfolio.length -1; i++ ) {
                            row1    =   v_portfolio[i];

                            for( var j = i+1; j < v_portfolio.length ; j++ ) {
                                row2        =   v_portfolio[j];

                                v_text01    =   null;
                                v_text02    =   null;
                                if( row1.F16013 == row2.F16013 ) {
                                    tr1         =   $( "#table01 tbody > tr").eq( v_portfolio[i].trIndex );
                                    tr2         =   $( "#table01 tbody > tr").eq( v_portfolio[j].trIndex );

                                    v_text01    =   tr1.find( "td:eq(0) .add_btn_span" );           /* 첫번째 컬럼 */
                                    v_text02    =   tr2.find( "td:eq(0) .add_btn_span" );           /* 첫번째 컬럼 */

                                    vm.arr_show_error_message.push( "[포트폴리오] " + v_text01.text() + ", " + v_text02.text() + " 종목코드가 중복 존재합니다. " );
                                }
                            }
                        }
                    }

                /**************/
                    if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                        resolve( { result : false } );
                    }            


                    if( p_param.p_importance_total_check == "Y" ) {

                        /* 포트폴리오 1건 이상 입력한 경우에는 비중의 합은 100 이 되어야 함.  */
                        if( v_portfolio.length > 0 && total.importance != 100 ) {
                            vm.arr_show_error_message.push( "[포트폴리오] 비중의 합은 100 이 되어야 합니다." );
                            resolve( { result : false } );
                        }
                    }

                    resolve( { result : true } );

                }catch( e1 ) {
                    console.log( e1 );
                    resolve( { result : false } );
                };

            }).catch(error => {
                console.log( error );
                resolve( { result : false } );                    
            });             
        },


        /*
         * 선택된 리밸런싱 일자에 속한 포트폴리오를 노출한다.
         * 2019-07-26  bkLove(촤병국)
         */   
        fn_showRebalanceDatePortfolio(){

            var vm = this;

            if( vm.rebalance_date ) {

                vm.$nextTick( function(e) {
                    if(  vm.rebalancePortfolioObj && Object.keys( vm.rebalancePortfolioObj ).length > 0 ) {

                        var v_rebalancePortfolio    =   vm.rebalancePortfolioObj[ vm.rebalance_date ];

                        vm.fn_initRecords();

                        /* 선택된 리밸런싱일자에 포트폴리오가 존재하는 경우 */
                        if( typeof v_rebalancePortfolio != "undefined" && Object.keys( v_rebalancePortfolio ).length > 0 ) {

                            var dataList    =   [];

                            for( var i=0; i < Object.keys( v_rebalancePortfolio ).length; i++ ) {
                                var v_key   =   Object.keys( v_rebalancePortfolio )[i];

                                dataList.push( v_rebalancePortfolio[ v_key ] );
                            }
                            
                            /* trIndex 순으로 정렬하여 노출 */
                            dataList    =   _.orderBy(
                                    dataList
                                ,   [ "trIndex" ]
                                ,   [ "asc" ]
                            );

                            /* 건수가 0 인 경우 레코드 5개는 추가한다. */
                            var cnt = ( Math.ceil( dataList.length / 5 ) == 0 ? 1 : Math.ceil( dataList.length / 5 ) ) * 5;                  

                            /* 레코드를 추가한다. */
                            vm.fn_addRecords( 0, cnt, dataList );

                            /* total 레코드를 설정한다. */
                            vm.fn_setTotalRecord();
                        }
                        /* 선택된 리밸런싱일자에 포트폴리오가 존재하지 않는 경우 */
                        else{
                            /* 최초 5개의 레코드를 노출한다. */
                            vm.fn_addRecords( 0, 5 );
                        }
                    }
                });
            }
        },


        /*
         * 포트폴리오 엑셀을 업로드 한다.
         * 2019-07-26  bkLove(촤병국)
         */    
        fn_uploadPortfolio( file ) {
            var vm = this;

            vm.arr_show_error_message   =   [];


            if( !vm.start_year ) {
                vm.arr_show_error_message.push( "[조건설정] 시작년도를 선택해 주세요." );
            }

            if( !vm.rebalance_cycle_cd ) {
                vm.rebalance_cycle_cd       =   "1";    /* 리밸런싱 주기가 없을시 1-매주 디폴트 설정  */
            }

            if( !vm.rebalance_date_cd ) {
                vm.rebalance_date_cd        =   "1";    /* 리밸런싱 일자가 없을시 1-첫영업일 디폴트 설정  */
            }           

            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }


            return  new Promise(function(resolve, reject) {

                let formData = new FormData();
                var check   =   true;

                formData.append("start_year", vm.start_year );
                formData.append("rebalance_cycle_cd", vm.rebalance_cycle_cd );
                formData.append("rebalance_date_cd", vm.rebalance_date_cd );
                formData.append("files", file);

                vm.fn_showProgress( true );


                util.axiosCall(
                        {
                                "url"           :   Config.base_url + "/user/simulation/uploadPortfolio"
                            ,   "data"          :   formData
                            ,   "method"        :   "post"
                            ,   "paramKey"      :   ""
                            ,   "headers"       :   {   "Content-Type": "multipart/form-data"   }
                        }
                    ,   async function(response) {
                            vm.fn_showProgress( false );

                            try{

                                if( response.data ) {

                                    if( !response.data.result ) {
                                        var errorList = [];
                                        if( !response.data.record_check ) {

                                            if( response.data.errorList && response.data.errorList.length > 0 ) {
                                                errorList    =   response.data.errorList;

                                                for( var i=0; i < errorList.length; i++ ) {
                                                    if( !errorList[i].result && errorList[i].msg ) {
                                                        vm.arr_show_error_message.push( errorList[i].msg );
                                                    }
                                                }
                                            }
                                        }else{
                                            if( await vm.$refs.confirm2.open(
                                                        ''
                                                    ,   response.data.msg
                                                    ,   {}
                                                    ,   1
                                                )
                                            ) {
                                            }
                                        }

                                        check   =   false;
                                    }


                                    if( check ) {

                                        /* 시작년도가 존재하는 경우 - 시작년도 재설정 */
                                        if( response.data.p_start_year ) {
                                            vm.old_start_year   =   response.data.p_start_year;
                                            vm.start_year       =   response.data.p_start_year;
                                            vm.excel_start_year =   response.data.p_start_year;
                                        }

                                        /* 리밸런싱 일자가 포함된 샘플파일인 경우 */
                                        if( response.data.p_rebalance_file_yn == "1" ) {
                                            vm.change_rebalance_yn      =   response.data.p_rebalance_file_yn;

                                            vm.p_rebalance_file_yn      =   response.data.p_rebalance_file_yn;
                                            vm.rebalance_cycle_cd       =   "";
                                            vm.rebalance_date_cd        =   "";

                                            /* 콤보박스에 노출할 리밸런싱 날짜를 설정한다. */
                                            if( response.data.arr_rebalance_date && response.data.arr_rebalance_date.length > 0 ) {
                                                vm.arr_rebalance_date       =   response.data.arr_rebalance_date;
                                            }

                                        }else{
                                            vm.change_rebalance_yn      =   "0";
                                        }


                                        /* 엑셀을 업로드 하는 경우 [직접입력] 으로 강제 설정 */
                                        vm.importance_method_cd =   "1";


                                        /* 리밸런싱일별 포트폴리오 데이터 설정 */
                                        if( response.data.rebalancePortfolioObj ) {

                                            vm.rebalancePortfolioObj        =   response.data.rebalancePortfolioObj;

                                            if( vm.arr_rebalance_date && vm.arr_rebalance_date.length > 0 ) {

                                                /* 현재 리밸런싱 일자가 맨 처음 리밸런싱 일자와 다른 경우 맨처음 리밸런싱 일자로 설정 */
                                                if( vm.rebalance_date != vm.arr_rebalance_date[0].value ) {

                                                    vm.old_rebalance_date   =   vm.rebalance_date;

                                                    vm.rebalance_date       =   vm.arr_rebalance_date[0].value;
                                                
                                                    /* 선택된 리밸런싱 일자에 속한 포트폴리오를 노출한다. */
                                                    vm.fn_showRebalanceDatePortfolio();
                                                }
                                            }

                                            check   =   true;
                                        }
                                    }

                                }else{
                                    check = false;
                                }


                                if( check ) {
                                    resolve( { result : true } );
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            vm.fn_showProgress( false );
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
            });

        },

        /*
         * 엑셀 유형인지 파일을 체크한다.
         * 2019-09-06  bkLove(촤병국)
         */
         fn_checkFile( file ) {
            var vm = this;

            var fileLen = file.name.length;
            var lastDot = file.name.lastIndexOf(".");

            var check = true;

            return  new Promise( async function(resolve, reject) {

                /* 1. 확장자가 존재하지 않는지 확인 */
                if (lastDot == -1) {
                    if( await vm.$refs.confirm2.open(
                                '[엑셀파일 유형확인]'
                            ,   "엑셀유형의 파일인지 확인 해 주세요."
                            ,   {}
                            ,   1
                        )
                    ) {
                        check   =   false;
                    }
                }

                var fileExt     =   file.name.substring(lastDot + 1, fileLen).toLowerCase();
                var allowExt    =   ["xls", "xlsx", "csv"];

                /* 2. 허용되는 확장자에 포함되는지 확인 */
                if (!allowExt.includes(fileExt)) {

                    if( vm.$refs.confirm2.open(
                                '[엑셀파일 유형확인]',
                                "엑셀유형의 파일인지 확인 해 주세요.",
                                {}
                            ,   1
                        )
                    ) {        
                        check   =   false;
                    }
                }
                
                if( check ) {
                    resolve( { result : true } );
                }else{
                    resolve( { result : false } );
                }

            }).catch( function(e) {
                console.log( e );
                resolve( { result : false } );
            });
        },        

        /*
         * 파일 사이즈를 체크한다.
         * 2019-09-06  bkLove(촤병국)
         */
        fn_sizeCheck( file, gubun ) {
            var vm = this;

            var check = true;

            return  new Promise( async function(resolve, reject) {

                if( file ) {
                    var title = "포트폴리오";
                    var maxSize = vm.limit.max_size;

                    if( maxSize > 0 ) {
                        if( file.size == 0 ) {
                            if( await vm.$refs.confirm2.open(
                                        '확인',
                                        title + ' 파일용량이 0 byte 입니다.',
                                        {}
                                    ,   1
                                )
                            ) {
                                check = false;
                            }
                        }

                        if( ( maxSize * 1024 * 1024 ) < file.size ) {
                            if( await vm.$refs.confirm2.open(
                                        '확인',
                                        title + ' 파일용량은 ' + maxSize + ' Mb 보다 작아야 합니다.',
                                        {}
                                    ,   1
                                )
                            ) {                       
                                check = false;
                            }
                        }
                    }
                }else{
                    check = false;
                }

                if( check ) {
                    resolve( { result : true } );
                }else{
                    resolve( { result : false } );
                }

            }).catch( function(e) {
                console.log( e );

                resolve( { result : false } );
            });                
        },

        /*
         * 파일 선택시
         * 2019-09-06  bkLove(촤병국)
         */
        fn_fileClick: function() {
            this.$refs.portfolioFile.click();
        },


        /*
         * 목록조회 화면으로 이동한다.
         * 2019-09-06  bkLove(촤병국)
         */
        fn_goList: function() {
            var vm = this;

            vm.$emit( "fn_showSimulation", { showSimulationId : 0 } );
        }
    }
};
</script>