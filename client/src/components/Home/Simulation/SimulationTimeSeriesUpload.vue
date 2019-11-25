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
                            <label class="upload-hidden" @click="/*fn_fileClick()*/">업로드</label>
                            <input
                                type="file"
                                name="timeSeriesUpload"
                                ref="timeSeriesUpload"
                                style="display:none;"
                            />
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
                
                arr_show_error_message      :   []          /* 에러 메시지 노출 정보 */

            ,   arr_grp_cd                  :   []          /* 상위 그룹정보 */
            ,   arr_bench_mark_cd           :   []          /* 초기설정 벤치마크 array */

            ,   scen_cd                     :   ""          /* 시나리오 코드 */
            ,   scen_order_no               :   ""          /* 시나리오 정렬순번 */
            ,   org_grp_yn                  :   ""          /* 상위 그룹코드 */

            ,   grp_cd                      :   "*"         /* 상위 그룹코드 */
            ,   scen_name                   :   ""          /* 시나리오명 */
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
        ConfirmDialog,
        SimulationExcelupModal : SimulationExcelupModal,      
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

			if( await vm.$refs.confirm2.open(
						'[시뮬레이션]',
						'입력된 내용이 모두 초기화 됩니다. 그래도 진행하시겠습니까?',
						{}
					,   2
				)
			) {
				if( "Y" == vm.$refs.confirm2.val ) {

                    vm.grp_cd                       =   "*";
					vm.bench_mark_cd               	=   "1";        /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
					vm.bench_index_cd01            	=   "";         /* 벤치마크 인덱스 코드 ( F16013 ) */
					vm.bench_index_cd02            	=   "";         /* 벤치마크 인덱스 코드 ( large_type ) */
					vm.bench_index_cd03            	=   "";         /* 벤치마크 인덱스 코드 ( middle_type ) */
					vm.bench_index_nm              	=   "";         /* 벤치마크 인덱스 코드명 */

                    vm.time_series_file_nm          =   "";
                    vm.$refs.timeSeriesUpload.value  =   null;

                    if( vm.$refs.timeSeriesUpload.files ) {
                        vm.$refs.timeSeriesUpload.files  =   null;
                    }

                    /* next 시나리오명을 조회한다. */
                    vm.fn_getNextScenName();
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
            vm.fn_initGrpCd();

            /* 초기 설정 데이터를 조회한다. */
            vm.fn_initData();

            /* next 시나리오명을 조회한다. */
            vm.fn_getNextScenName();

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
                COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ )
            */
            var arrComMstCd = [ "COM008" ];

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

        /**************/
            if( vm.arr_show_error_message && vm.arr_show_error_message.length > 0  ) {
                return  false;
            }

            if( !vm.scen_name || vm.scen_name.length == 0 ) {
                vm.arr_show_error_message.push( "[조건설정] 시나리오명을 입력해 주세요." );
            }

            if( !vm.$refs.timeSeriesUpload.value || vm.$refs.timeSeriesUpload.value == null ) {
                vm.arr_show_error_message.push( "[조건설정] 시계열을 업로드 해주세요." );
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

        /**************/
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

                p_param.grp_cd              =   vm.grp_cd;
                p_param.scen_name           =   vm.scen_name;
                p_param.bench_mark_cd       =   vm.bench_mark_cd;

                var formData    =   new FormData();

                formData.append( "files", vm.$refs.timeSeriesUpload.files[0] );
                formData.append( "data", JSON.stringify( p_param ) );                


                vm.fn_showProgress( true );


                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/uploadTimeSeries"
                            ,   "data"      :   formData
                            ,   "method"    :   "post"
                            ,   "paramKey"  :   ""
                            ,   "headers"   :   {   "Content-Type": "multipart/form-data"   }
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
                                        check   =   true;
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
            this.$refs.timeSeriesUpload.click();
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