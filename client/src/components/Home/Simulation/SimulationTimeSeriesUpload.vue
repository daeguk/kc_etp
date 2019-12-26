<template>
    <v-layout row wrap class="content_margin etp_new">
        <v-flex grow xs12>
            <v-card flat height="800px">
                <v-card-title primary-title>
                    <h3 class="headline w100" pb-0>
                        PORTFOLIO SIMULATION |
                        <span
                            class="grey--text"
                        >KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>

                        <span class="btn_r">
                            <v-btn small flat icon v-on:click="fn_refresh()">
                                <v-icon>refresh</v-icon>
                            </v-btn>
                        </span>
                        <span class="btn_r">
                            <v-btn small flat icon v-on:click="fn_goList()">
                                <v-icon>reply</v-icon>
                            </v-btn>
                        </span>

                        <span class="btn_r">
                            <button type="button" class="exceldown_btn" v-if="paramData.grp_cd && paramData.scen_cd && paramData.result_daily_yn == '1'" @click="fn_excelDown()"></button>
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
                            <v-select
                                :items="arr_grp_cd"
                                item-text="grp_name"
                                item-value="grp_cd"
                                @change="fn_resetErrorMessage();"
                                v-model="grp_cd"
                                outline
                            ></v-select>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시나리오명</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field
                                outline
                                v-model="scen_name"
                                @blur="fn_resetErrorMessage();"
                                maxlength="50"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">초기투자금액(KRW)</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field
                                type="text"
                                v-model="init_invest_money"
                                outline
                                @blur="fn_resetErrorMessage();"
                                maxlength="15"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">벤치마크 설정</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select
                                :items="arr_bench_mark_cd"
                                item-text="com_dtl_name"
                                item-value="com_dtl_cd"
                                v-model="bench_mark_cd"
                                outline
                                @change="fn_resetErrorMessage();"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시계열 업로드</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <input
                                type="text"
                                class="upload-name"
                                disabled
                                :value="time_series_file_nm"
                            />
                        </v-flex>
                        <v-flex xs2>
                            <label class="upload-hidden" @click="fn_fileClick()">업로드</label>
                            <input
                                type="file"
                                name="timeSeriesUpload"
                                ref="timeSeriesUpload"
                                style="display:none;"
                            />
                            <SimulationTimeSeriesUploadPop></SimulationTimeSeriesUploadPop>
                        </v-flex>
                    </v-layout>
                </v-card>

                <div class="savebtn01">

                    <div class="warning_box"    v-if="arr_show_error_message != null && arr_show_error_message.length > 0">
                        <span v-for="(item, index) in arr_show_error_message" :key="index">
                            <v-icon color="#ff4366">error_outline</v-icon> {{item}} <br>
                        </span>
                    </div>

                    <v-btn depressed color="primary" @click.stop="fn_uploadTimeSeries()">저장하기</v-btn>
                </div>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
import util       from "@/js/util.js";
import Config from "@/js/config.js";
import _ from "lodash";
import excel from "xlsx";

import MastPopup02 from "@/components/common/popup/MastPopup02";
import SimulationExcelupModal  from "@/components/Home/simulation/SimulationExcelupModal.vue";
import SimulationTimeSeriesUploadPop  from "@/components/Home/simulation/SimulationTimeSeriesUploadPop.vue";

var table01 = null;


export default {

    props : [ "paramData" ],

    data() {
        return {


                arr_show_error_message      :   []          /* 에러 메시지 노출 정보 */

            ,   arr_grp_cd                  :   []          /* 상위 그룹정보 */
            ,   arr_bench_mark_cd           :   []          /* 초기설정 벤치마크 array */

            ,   prev_grp_cd                 :   ""          /* 상위 그룹코드 (변경전) */
            ,   prev_scen_cd                :   ""          /* 시나리오 코드 (변경전) */
            ,   scen_cd                     :   ""          /* 시나리오 코드 */
            ,   scen_order_no               :   ""          /* 시나리오 정렬순번 */
            ,   org_grp_yn                  :   ""          /* 상위 그룹코드 */

            ,   grp_cd                      :   "*"         /* 상위 그룹코드 */
            ,   scen_name                   :   ""          /* 시나리오명 */
            ,   org_scen_name               :   ""          /* 시나리오명 원본 */
            ,   init_invest_money           :   1000000     /* 초기투자금액 */
            ,   bench_mark_cd               :   "1"         /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
            ,   bench_index_cd01            :   ""          /* 벤치마크 인덱스 코드 ( F16013 ) */
            ,   bench_index_cd02            :   ""          /* 벤치마크 인덱스 코드 ( large_type ) */
            ,   bench_index_cd03            :   ""          /* 벤치마크 인덱스 코드 ( middle_type ) */
            ,   bench_index_nm              :   ""          /* 벤치마크 인덱스 코드명 */
            ,   time_series_file_nm         :   ""          /* 파일명 */

            ,   limit : {
                    max_size : 1                            /* 파일 사이즈 (Mb) */
                }
        };
    },

    components: {
        MastPopup02,
        SimulationExcelupModal : SimulationExcelupModal, 
        SimulationTimeSeriesUploadPop : SimulationTimeSeriesUploadPop,    
    },    

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        /* 초기 시뮬레이션을 조회한다. */
        vm.fn_getInitSimul();

        /* 포트폴리오 파일 영역 */
        this.$refs.timeSeriesUpload.addEventListener(
            "change",
            async function(evt) {
                let file        =   this.$refs.timeSeriesUpload.files[0];

                var flag    =   true;

                vm.arr_show_error_message   =   [];

                /* 엑셀 유형인지 파일을 체크한다. */
                await vm.fn_checkFile( file ).then( async function(e) {

                    if( e && e.result ) {

                        /* 파일 사이즈를 체크한다. */
                        return  await vm.fn_sizeCheck( file, "file" );
                    }else{
                        flag = false;
                    }

                }).then( function(e){

                    if( e && e.result ) {

                        vm.time_series_file_nm          =   file.name;
                    }else{
                        flag    =   false;
                    }


                    if( !flag ) {
                        vm.time_series_file_nm          =   "";
                        vm.$refs.timeSeriesUpload.value =   null;

                        if( vm.$refs.timeSeriesUpload.files ) {
                            vm.$refs.timeSeriesUpload.files  =   null;
                        }
                    }

                }).catch( function(e) {

                    if( e && e.result ) {

                    }else{

                        vm.time_series_file_nm          =   "";
                        vm.$refs.timeSeriesUpload.value =   null;

                        if( vm.$refs.timeSeriesUpload.files ) {
                            vm.$refs.timeSeriesUpload.files  =   null;
                        }
                    }
                });

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

			if( await vm.$root.confirmt.open(
						'[시뮬레이션]',
						'입력된 내용이 모두 초기화 됩니다. 그래도 진행하시겠습니까?',
						{}
					,   2
				)
			) {
				if( "Y" == vm.$root.confirmt.val ) {

                    vm.grp_cd                       =   "*";

					vm.bench_index_cd01            	=   "";         /* 벤치마크 인덱스 코드 ( F16013 ) */
					vm.bench_index_cd02            	=   "";         /* 벤치마크 인덱스 코드 ( large_type ) */
					vm.bench_index_cd03            	=   "";         /* 벤치마크 인덱스 코드 ( middle_type ) */
					vm.bench_index_nm              	=   "";         /* 벤치마크 인덱스 코드명 */

                    vm.time_series_file_nm          =   "";
                    vm.$refs.timeSeriesUpload.value  =   null;

                    if( vm.$refs.timeSeriesUpload.files ) {
                        vm.$refs.timeSeriesUpload.files  =   null;
                    }

                    /* 목록에서 넘겨받은 key 값이 존재하는 경우 등록된 내용을 조회하여 설정한다. */
                    if(     vm.paramData && Object.keys( vm.paramData ).length > 0 
                        &&  vm.paramData.grp_cd && vm.paramData.scen_cd 
                    ) {
                        vm.init_invest_money            =   vm.org_init_invest_money;
                        vm.bench_mark_cd               	=   vm.org_bench_mark_cd;       /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
                        vm.scen_name                    =   vm.org_scen_name;
                    }else{

                        vm.init_invest_money            =   1000000;
                        vm.bench_mark_cd               	=   "1";                        /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */

                        /* next 시나리오명을 조회한다. */
                        vm.fn_getNextScenName();
                    }
				}
			}

		},

        /*
         * 초기 시뮬레이션을 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_getInitSimul() {

            var vm = this;


            /* 상위 그룹정보를 조회한다. */
            vm.fn_initGrpCd().then( async function(e) {

                if( e && e.result ) {

                    /* 초기 설정 데이터를 조회한다. */
                    await vm.fn_initData().then( async function(e1) {

                        if( e1 && e1.result ) {

                            /* 목록에서 넘겨받은 key 값이 존재하는 경우 등록된 내용을 조회하여 설정한다. */
                            if(     vm.paramData && Object.keys( vm.paramData ).length > 0 
                                &&  vm.paramData.grp_cd && vm.paramData.scen_cd 
                            ) {
                                /* 시뮬레이션 마스터 정보를 조회한다. */
                                vm.fn_getSimulMast( vm.paramData );

                            }else{
                                /* next 시나리오명을 조회한다. */
                                vm.fn_getNextScenName();
                            }
                        }
                    });
                }
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

                vm.$root.progresst.open();

                var param = {};
                param.show_owner_yn     =   "";

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getInitGrpCd"
                            ,   "data"      :   param
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.$root.progresst.close();

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
                            vm.$root.progresst.close();
                            if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
            });
        },

        /*
         * next 시나리오명을 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getNextScenName() {
            var vm = this;

            vm.arr_show_error_message   =   [];
            vm.$root.progresst.open();

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/getNextScenName"
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
                        vm.$root.progresst.close();
                        if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
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
                COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ )
            */
            var arrComMstCd = [ "COM008" ];

            vm.arr_show_error_message   =   [];

            return  new Promise(function(resolve, reject) {
                vm.$root.progresst.open();

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getInitData"
                            ,   "data"      :   { arrComMstCd : arrComMstCd }
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.$root.progresst.close();

                            try{
                                if (response && response.data) {
                                    var arrMsg = ( response.data.arrMsg && response.data.arrMsg.length > 0 ? response.data.arrMsg : [] );

                                    if (!response.data.result) {
                                        if( arrMsg.length > 0 ) {
                                            vm.arr_show_error_message.push( ...arrMsg );
                                        }

                                        resolve( { result : false } );
                                    }else{

                                        /* 초기설정 벤치마크 array */
                                        if( response.data.arr_bench_mark_cd && response.data.arr_bench_mark_cd.length > 0 ) {
                                            vm.arr_bench_mark_cd   =   response.data.arr_bench_mark_cd;
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

                            vm.$root.progresst.close();
                            if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
                // resolve( { result : false } );
            });                
        },

        /*
         * 시뮬레이션 마스터 정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getSimulMast( v_paramData ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.$root.progresst.open();

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/getSimulMast"
                        ,   "data"      :   v_paramData
                        ,   "method"    :   "post"
                    }
                ,   function(response) {
                        vm.$root.progresst.close();

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
                                        vm.org_scen_name            =   mastInfo.scen_name;             /* 시나리오명 */
                                        
                                        vm.init_invest_money        =   Number( mastInfo.init_invest_money );     /* 초기투자금액 */
                                        vm.org_init_invest_money    =   Number( mastInfo.init_invest_money );     /* 초기투자금액 */

                                        vm.bench_mark_cd            =   ( mastInfo.bench_mark_cd == "0" ? "1" : mastInfo.bench_mark_cd );
                                        vm.org_bench_mark_cd        =   ( mastInfo.bench_mark_cd == "0" ? "1" : mastInfo.bench_mark_cd );
                                    }
                                }
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.$root.progresst.close();
                        if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
                    }
            );
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

            /* 초기설정 벤치마크 array */
            if( !vm.arr_bench_mark_cd || vm.arr_bench_mark_cd.length == 0 ) {
                vm.arr_show_error_message.push( "초기 데이터 [벤치마크] 값이 존재하지 않습니다." );
            }

            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }

            if( !vm.scen_name || vm.scen_name.length == 0 ) {
                vm.arr_show_error_message.push( "[조건설정] 시나리오명을 입력해 주세요." );
            }

            if( !vm.$refs.timeSeriesUpload.value || vm.$refs.timeSeriesUpload.value == null ) {
                vm.arr_show_error_message.push( "[조건설정] 시계열을 업로드 해주세요." );
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
         * 시계열 엑셀을 업로드 한다.
         * 2019-07-26  bkLove(촤병국)
         */    
        fn_uploadTimeSeries() {
            var vm = this;

            var p_param     =   {};

            vm.arr_show_error_message   =   [];


            /* 마스트 정보를 밸리데이션 체크한다. */
            vm.fn_validationSimulMast();

            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }

            var check       =   true;
            return  new Promise(function(resolve, reject) {


                /* 벤치마크가 설정된 경우 */
                if( vm.bench_mark_cd != "0" ) {
                    if( vm.arr_bench_mark_cd && vm.arr_bench_mark_cd.length > 0  ) {
                        var existCheck = _.filter( vm.arr_bench_mark_cd, function(o) {
                            if ( o.com_dtl_cd == vm.bench_mark_cd ) {
                                return  o;
                            }
                        });
                        
                        if( existCheck && existCheck.length == 1 ) {
                            p_param.bench_index_cd01    =   existCheck[0].com_val01;        /* F16013 */
                            p_param.bench_index_cd02    =   existCheck[0].com_val02;        /* middle_type */
                            p_param.bench_index_cd03    =   existCheck[0].com_val03;        /* large_type */
                            p_param.bench_index_nm      =   existCheck[0].com_dtl_name;
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


                p_param.prev_grp_cd         =   vm.prev_grp_cd;
                p_param.prev_scen_cd        =   vm.prev_scen_cd;
                p_param.scen_cd             =   vm.scen_cd;
                p_param.scen_order_no       =   vm.scen_order_no;
                p_param.org_grp_yn          =   v_temp[0].grp_yn;

                p_param.grp_cd              =   vm.grp_cd;
                p_param.scen_name           =   vm.scen_name;
                p_param.bench_mark_cd       =   vm.bench_mark_cd;
                p_param.init_invest_money   =   vm.init_invest_money;
                

                var formData    =   new FormData();

                formData.append( "files", vm.$refs.timeSeriesUpload.files[0] );
                formData.append( "data", JSON.stringify( p_param ) );                


                vm.$root.progresst.open();

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/uploadTimeSeries"
                            ,   "data"      :   formData
                            ,   "method"    :   "post"
                            ,   "paramKey"  :   ""
                            ,   "headers"   :   {   "Content-Type": "multipart/form-data"   }
                        }
                    ,   async function(response) {
                            vm.$root.progresst.close();

                            try{

                                if( response.data ) {

                                    if( !response.data.result ) {
                                        var errorList = [];

                                        if(     ( typeof response.data.count_check  != "undefined"  && !response.data.count_check )
                                            ||  ( typeof response.data.record_check != "undefined"  && !response.data.record_check ) 
                                        ) {

                                            if( typeof response.data.errorList != "undefined" && response.data.errorList.length > 0 ) {
                                                errorList    =   response.data.errorList;

                                                for( var i=0; i < errorList.length; i++ ) {
                                                    if( !errorList[i].result && errorList[i].msg ) {
                                                        vm.arr_show_error_message.push( errorList[i].msg );
                                                    }
                                                }
                                            }else{
                                                var msg = ( response.data.msg ? response.data.msg : "" );

                                                if( msg ) {
                                                    vm.arr_show_error_message.push( msg );
                                                }
                                            }
                                        }else{
                                            var msg = ( response.data.msg ? response.data.msg : "" );

                                            if( msg ) {
                                                vm.arr_show_error_message.push( msg );
                                            }
                                        }

                                        if( typeof response.data.simul_mast == "undefined" || response.data.simul_mast == "" ) {
                                            if( msg ) {
                                                vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                                            }                                            
                                        }

                                        check   =   false;
                                    }


                                    if( check ) {

                                        vm.$emit( "fn_showSimulation", 
                                            { 
                                                    showSimulationId        :   2
                                                ,   simul_mast              :   response.data.simul_mast
                                                ,   arr_daily               :   response.data.arr_daily
                                            }
                                        );
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
                            vm.$root.progresst.close();
                            if ( error && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
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
                    if( await vm.$root.confirmt.open(
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

                    if( vm.$root.confirmt.open(
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
                            if( await vm.$root.confirmt.open(
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
                            if( await vm.$root.confirmt.open(
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
            this.$refs.timeSeriesUpload.click();
        },


        /*
         * 목록조회 화면으로 이동한다.
         * 2019-09-06  bkLove(촤병국)
         */
        fn_goList: function() {
            var vm = this;

            vm.$emit( "fn_showSimulation", { showSimulationId : 0 } );
        },

        /*
        * 엑셀을 다운로드 한다.
        * 2019-10-17  bkLove(촤병국)
        */
        async fn_excelDown() {

            var vm = this;


            if( !vm.paramData.grp_cd || !vm.paramData.scen_cd ) {

                if( await vm.$root.confirmt.open(
                            '[엑셀파일 유형확인]'
                        ,   "신규등록은 다운로드 하실수 없습니다."
                        ,   {}
                        ,   1
                    )
                ) {
                }

                return  false;
            }

            var options     =   {
                    skipHeader          :   true
                ,   origin              :   "A2"
                ,   colStartIndex       :   0
                ,   rowStartIndex       :   1
                ,   colsInfo            :   {
                            hidden  :   false
                        ,   width   :   15
                    }
                ,   rowsInfo        :   {
                            hidden  :   false
                        ,   hpt     :   20
                    }
            };

            var excelInfo = {
                    excelFileNm     :   vm.org_scen_name.replace( /(\\)|(")|(\/)|(:)|(\*)|(\?)|(<)|(>)|(\|)/g, "" )
                ,   sheetNm         :   ""
                ,   dataInfo        :   []

                ,   arrHeaderNm     :   []
                ,   arrHeaderKey    :   []

                ,   arrColsInfo     :   []
            };            


            try{

                var dataWS;
                var wb = excel.utils.book_new();

                vm.$root.progresst.open();

                step1().then( function(e){
                    return step2();

                }).then( function(e) {
                    vm.$root.progresst.close();
                }).catch( function(e) {
                    console.log( e );
                    vm.$root.progresst.close();
                });
                

                /* 시계열 등록 */
                async function    step1() {

                    excelInfo.sheetNm           =   "시계열 등록";

                    return  await new Promise(function(resolve, reject) {

                        try{

                            if( vm.grp_cd == "undefined" || vm.scen_cd == "undefined" ) {

                                resolve( { result : true } );

                            }else{

                                util.axiosCall(
                                        {
                                                "url"       :   Config.base_url + "/user/simulation/getSimulTimeSeriesExcel"
                                            ,   "data"      :   {
                                                        "grp_cd"                    :   vm.prev_grp_cd
                                                    ,   "scen_cd"                   :   vm.prev_scen_cd
                                                }
                                            ,   "method"    :   "post"
                                        }
                                    ,   function(response) {
                                            try{                                                

                                                if (response && response.data) {
                                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                                    if (!response.data.result) {
                                                        if( msg ) {
                                                            resolve( { result : false } );
                                                        }
                                                    }else{

                                                        excelInfo.arrHeaderNm       =   [       
                                                            "DATE", "지수"
                                                        ];

                                                        excelInfo.arrHeaderKey      =   [       
                                                            "fmt_F12506", "INDEX_RATE"
                                                        ];


                                                        excelInfo.arrColsInfo       =   [       
                                                            {width : 20}, {width : 45}
                                                        ];

                                                        excelInfo.dataInfo  =   vm.fn_setExcelInfo( response.data.arr_result_daily, excelInfo.arrHeaderKey );
                                                        dataWS              =   excel.utils.aoa_to_sheet( [ excelInfo.arrHeaderNm ] );
                                                        options             =   Object.assign( options, excelInfo.options );
                                                        vm.fn_setSheetInfo( dataWS, options, excelInfo );
                                                        excel.utils.sheet_add_json( dataWS, excelInfo.dataInfo, { header: excelInfo.arrHeaderKey , skipHeader : options.skipHeader, origin : options.origin });
                                                        excel.utils.book_append_sheet( wb, dataWS, excelInfo.sheetNm );

                                                        resolve( { result : true } );


                                                        resolve( { result : true } );
                                                    }
                                                }

                                            }catch(ex) {
                                                console.log( "error", ex );

                                                resolve( { result : false } );
                                            }
                                        }
                                    ,   function(ex) {
                                            console.log( "error", ex );

                                            if ( ex && vm.$root.confirmt.open( '확인', error, {}, 4 ) ) {}
                                            resolve( { result : false } );
                                        }
                                );
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                            
                            resolve( { result : false } );
                        }
                    });
                }                

                /* 파일 저장 */
                async function    step2() {

                    return  await new Promise(function(resolve, reject) {

                        try{                
                            excel.writeFile( wb, excelInfo.excelFileNm + "_"+ util.getToday() +  ".xlsx" );

                            resolve( { result : true } );

                        }catch(ex) {
                            console.log( "error", ex );

                            resolve( { result : false } );
                        }
                    });
                }

            }catch(e){
                console.log( "[error] SimulationTimeSeriesUpload.vue -> fn_excelDown", e );
            }
        },

        /*
        * 시트정보를 설정한다.
        * 2019-10-17  bkLove(촤병국)
        */
        fn_setSheetInfo( p_dataWS, p_options, p_excelInfo ) {

            try{
            
            /* 설정할 컬럼 정보 */

                /* 헤더 컬럼별 설정정보가 있는 경우 */
                if( p_excelInfo.arrColsInfo && p_excelInfo.arrColsInfo.length > 0 ) {
                    p_dataWS['!cols'] = [];

                    for (var i = p_options.colStartIndex ; i < p_excelInfo.arrHeaderKey.length ; i++) {
                        var colsInfo    =   {};

                        colsInfo    =   Object.assign( colsInfo, p_options.colsInfo );

                        /* arrColsInfo 갯수와 arrHeaderKey 갯수가 다를수 있기에 arrColsInfo 의 인덱스가 arrHeaderKey 인덱스 안에 포함되는 경우 */
                        if( i < p_excelInfo.arrColsInfo.length ) {
                            colsInfo    =   Object.assign( colsInfo, p_excelInfo.arrColsInfo[i] );
                        }

                        p_dataWS['!cols'][i] = colsInfo;
                    }
                }
                /* 기본 컬럼 설정정보가 있는 경우 */
                else if( p_excelInfo.colsInfo && Object.keys( p_excelInfo.colsInfo ).length > 0 ) {
                    p_dataWS['!cols'] = [];

                    for (var i = p_options.colStartIndex ; i < p_excelInfo.arrHeaderKey.length ; i++) {
                        var colsInfo    =   Object.assign( {}, p_options.colsInfo, p_excelInfo.colsInfo );
                        p_dataWS['!cols'][i] = colsInfo;
                    }
                }



            /* 설정할 레코드 정보 */

                /* 레코드별 설정정보가 있는 경우 */
                if( p_excelInfo.arrRowsInfo && p_excelInfo.arrRowsInfo.length > 0 ) {
                    p_dataWS['!rows'] = [];

                    for (var i = 0, row= p_options.rowStartIndex; i < p_excelInfo.dataInfo.length; i++, row++) {
                        var rowsInfo    =   {};

                        rowsInfo    =   Object.assign( rowsInfo, p_options.rowsInfo );

                        /* arrRowsInfo 갯수와 dataInfo 갯수가 다를수 있기에 arrRowsInfo 의 인덱스가 dataInfo 인덱스 안에 포함되는 경우 */
                        if( i < p_excelInfo.arrRowsInfo.length ) {
                            rowsInfo    =   Object.assign( rowsInfo, p_excelInfo.arrRowsInfo[i] );
                        }

                        p_dataWS['!rows'][row] = rowsInfo;
                    }
                }
                /* 기본 레코드 설정정보가 있는 경우 */
                else if( p_excelInfo.rowsInfo && Object.keys( p_excelInfo.rowsInfo ).length > 0 ) {
                    p_dataWS['!rows'] = [];

                    for (var i = p_options.colStartIndex ; i < p_excelInfo.arrHeaderKey.length ; i++) {
                        var rowsInfo    =   Object.assign( {}, p_options.rowsInfo, p_excelInfo.rowsInfo );
                        p_dataWS['!rows'][i] = rowsInfo;
                    }
                }

            }catch(e){
                console.log( "[error] SimulationTimeSeriesUpload.vue -> fn_setSheetInfo", e );
            }                
        },


        /*
        * p_arr_header_key 정보를 기준으로 데이터를 설정한다.
        * 2019-10-17  bkLove(촤병국)
        */
        fn_setExcelInfo( p_data_list, p_arr_header_key ) {

            var v_execel_data_list  =   [];

            try{

                if( p_data_list && p_data_list.length >0 && p_arr_header_key && p_arr_header_key.length > 0 ) {

                    /* key에 존재하는 데이터를 기준으로 원본 데이터 추출 */
                    for( var i in p_data_list ) {

                        var dataRow = p_data_list[i];
                        
                        var tempObj = {};
                        var existCheck = _.filter( p_arr_header_key, function(o) {

                            if ( typeof dataRow[o] != "undefined" ) {

                                if( 
                                    [  "fmt_balance",  "bm_data01", "bm_1000_data" ].includes( o ) 
                                ) {
                                    if( typeof dataRow[o] == "string" ) {
                                        tempObj[o]  =   Number( util.NumtoStr( dataRow[o] ) );
                                    }else{
                                        tempObj[o]  =   Number( dataRow[o] );
                                    }
                                }
                                else if( [ "INDEX_RATE", "RETURN_VAL", "F15028_S", "F15028_C"  ].includes(o) ){
                                    tempObj[o]  =   String( dataRow[o] );
                                }
                                else{
                                    tempObj[o]  =   dataRow[o];
                                }
                            }
                        });

                        if( Object.keys(tempObj).length > 0 ) {
                            v_execel_data_list[i]   =   tempObj;
                        }
                    }
                }

                return  v_execel_data_list;

            }catch(e){
                console.log( "[error] SimulationTimeSeriesUpload.vue -> fn_setExcelInfo", e );
            }
        },        
    }
};
</script>