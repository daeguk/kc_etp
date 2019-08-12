<template>
    <v-layout row wrap class="content_margin etp_new">
        <v-flex grow>

            <v-card flat>
                <v-card-title primary-title>
                    <h3 class="headline" pb-0>
                        PORTFOLIO SIMULATION |
                        <span
                            class="grey--text"
                        >KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>
                    </h3>
                </v-card-title>
            </v-card>

            <v-card flat class="bot_pad1">
                <div class="warning_box"    v-if="arr_show_error_message != null && arr_show_error_message.length > 0">
                    <span class="margin_n" v-for="(item, index) in arr_show_error_message" :key="index">
                        <v-icon color="#ff4366">error_outline</v-icon> {{item}} <br>
                    </span>
                </div>

                <h4>
                    테스트 결과
                    <span class="excel_btn">
                        <button type="button" class="exceldown_btn"></button>
                    </span>
                </h4>
                <div class="simul_graph"></div>
                <v-tabs v-model="activeTab" centered light>
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab v-for="item in item" :key="item">{{ item }}</v-tab>
                </v-tabs>
                <v-tabs-items v-model="activeTab">
                    <!--리밸런싱내역 탭1-->
                    <v-tab-item>
                        <v-layout row wrap>
                            <v-flex grow xs12>
                                <v-card flat>
                                    <table class="tbl_type ver10 mt-3">
                                        <caption></caption>
                                        <colgroup>
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                        </colgroup>
                                        <thead>
                                            <tr >
                                                <th class="txt_left">일자</th>
                                                <th class="txt_right">Index</th>
                                                <th class="txt_right">Balance</th>
                                                <th class="txt_right">Return</th>
                                                <th class="txt_right">BM(KOSPI200)</th>
                                                <th class="txt_right">BM(1000환산)</th>
                                                <th class="txt_right">BM return</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(row, prop, index) in paramData.subMastObj" v-bind:key="index">
                                                <td class="txt_left">{{ prop    /* 일자 */ }}</td>
                                                <td class="txt_right">{{ row.INDEX_RATE     /* 지수 */ }}</td>
                                                <td class="txt_right"></td>
                                                <td class="txt_right">{{ row.RETURN_VAL     /* 결과 */ }} %</td>
                                                <td class="txt_right"></td>
                                                <td class="txt_right"></td>
                                                <td class="txt_right"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-tab-item>
                    <!--일자별 지수 탭2-->
                    <v-tab-item>
                        <v-layout row wrap>
                            <v-flex grow xs12>
                                <v-card flat>
                                    <table class="tbl_type ver10 mt-3">
                                        <caption></caption>
                                        <colgroup>
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                            <col width="14%" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th class="txt_left">일자</th>
                                                <th>Event</th>
                                                <th class="txt_left">종목</th>
                                                <th class="txt_right">변경전</th>
                                                <th class="txt_right">변경후</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(row, prop, index) in this.arrSubListObj" v-bind:key="index">
                                                <td class="txt_left">{{ prop    /* 일자 */ }}</td>
                                                <td>{{ prop.EVENT_FLAG    /* 일자 */ }}</td>
                                                <td class="txt_left">삼성전자(005930)</td>
                                                <td class="txt_right">30.0%</td>
                                                <td class="txt_right">33.33%</td>
                                            </tr>
                                            <tr>
                                                <td class="txt_left">20190701</td>
                                                <td>비중조절</td>
                                                <td class="txt_left">삼성전자(005930)</td>
                                                <td class="txt_right">30.0%</td>
                                                <td class="txt_right">33.33%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-tab-item>

                    <!--시뮬레이션 설정 탭3-->
                    <v-tab-item>
                        <div class="simul_setup">
                            <h6>
                                <span class="bullet"></span>리밸런싱
                            </h6>
                            <v-layout>
                                <v-flex xs2>시작년도</v-flex>
                                <v-flex xs3>2018</v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs2>주기</v-flex>
                                <v-flex xs3>분기|첫 영업일</v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs2>횟수</v-flex>
                                <v-flex xs3>6회</v-flex>
                            </v-layout>
                            <h6>
                                <span class="bullet"></span>선정방식
                            </h6>
                            <v-layout>
                                <v-flex xs2>시가총액</v-flex>
                                <v-flex xs3>2,000,000,000,000원 이상</v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs2>거래량</v-flex>
                                <v-flex xs3>3개월 평균 100만주 이상</v-flex>
                            </v-layout>
                        </div>
                    </v-tab-item>

                    <!--분석정보1 탭4-->
                    <v-tab-item>분석정보1</v-tab-item>
                    <!--분석정보2 탭5-->
                    <v-tab-item>분석정보2</v-tab-item>
                </v-tabs-items>
                <v-card flat>
                    <div class="text-xs-center mt-3">
                        <v-btn depressed color="primary" @click.stop="">저장하기</v-btn>
                    </div>
                </v-card>
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

import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";

export default {

    props : [ "paramData" ],

    data() {
        return {
                activeTab: 0
            ,   item: [
                    "일자별지수",
                    "리밸런싱내역",
                    "시뮬레이션 설정",
                    "분석정보#1",
                    "분석정보#2"
                ]

            ,   arr_show_error_message      :   []

            ,   arrSubListObj               :   []
        };
    },

    components: {
        ConfirmDialog,
    },

    created() {
        var vm = this;
    },

    computed: {

    },

    mounted() {
        var vm = this;
debugger;
        /* 목록에서 넘겨받은 key 값이 존재하는 경우 등록된 내용을 조회하여 설정한다. */
        if( vm.paramData && Object.keys( vm.paramData ).length > 0 ) {
            if( vm.paramData.grp_cd && vm.paramData.scen_cd  ) {
                vm.fn_getBacktestResult( vm.paramData );
            }else if( vm.paramData.subListObj && vm.paramData.subMastObj  ){
                console.log( ">>>>>>>>>>>>", vm.paramData.subListObj, vm.paramData.subMastObj );
console.log("#####1");
                vm.getSubData();
console.log("#####2");                
            }
        }
    },

    methods: {

        getSubData : function() {
            var vm = this;
console.log( ">>>>>>>>>> getSubData");
            vm.arrSubListObj   =   [];

            for( var subObj in vm.paramData.subListObj ) {
                console.log( vm.paramData.subListObj[ subObj ] );
                vm.arrSubListObj.push( vm.paramData.subListObj[ subObj ] );
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

        /*
         * 백테스트 결과를 조회한다.
         * 2019-08-14  bkLove(촤병국)
         */
        fn_getBacktestResult( v_param ) {
            var vm = this;

            vm.arr_show_error_message   =   [];

            return  new Promise(function(resolve, reject) {

                vm.fn_showProgress( true );

                axios.post(Config.base_url + "/user/simulation/getBacktestResult", {
                    data: v_param
                }).then( function(response) {

                    vm.fn_showProgress( false );

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
                }).catch(error => {
                    resolve( { result : false } );

                    vm.fn_showProgress( false );
                    if ( vm.$refs.confirm2.open(
                            '확인',
                            '서버로 부터 응답을 받지 못하였습니다.',
                            {}
                            ,4
                        )
                    ) {
                    }
                });

            }).catch( function(e1) {
                console.log( e1 );
                resolve( { result : false } );
            });
        },
    }
};
</script>

