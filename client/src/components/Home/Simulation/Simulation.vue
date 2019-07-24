<template>
    <v-layout row wrap class="content_margin etp_new">
        <v-flex grow>
            <v-card flat>

                <v-card-title primary-title>
                    <h3 class="headline" pb-0>
                        PORTFOLIO SIMULATION |
                        <span   class="grey--text">KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>
                    </h3>
                    <div class="warning_box"    v-if="arr_show_error_message != null && arr_show_error_message.length > 0">
                        <span v-for="(item, index) in arr_show_error_message" :key="index">
                            <v-icon color="#ff4366">error_outline</v-icon> {{item}} <br>
                        </span>
                    </div>
                </v-card-title>


                <v-card class="register_wrap pt0" flat xs12 color="lighten-1">
                    <h4>조건 설정</h4>

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">상위그룹</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select :items="arr_grp_cd" item-text="scen_name" item-value="grp_cd"  v-model="grp_cd"  outline></v-select>
                        </v-flex>
                    </v-layout>                    

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시나리오명</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field   outline     v-model="scen_name"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시작년도</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select :items="items1" item-text="text" item-value="value"  v-model="start_year" placeholder="선택하세요" outline></v-select>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">리밸런싱주기</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select :items="items2" placeholder="선택하세요" outline></v-select>
                        </v-flex>
                        <v-flex xs8 row class="checkbox_w pl-2">
                            <v-layout row wrap class="light--text">
                                <v-flex xs1>
                                    <v-checkbox
                                        v-bind:disabled="inputDisabled"
                                        color="primary"
                                        label="첫영업일"
                                        value="Y"
                                    ></v-checkbox>
                                </v-flex>
                                <v-flex xs2>
                                    <v-checkbox
                                        v-bind:disabled="inputDisabled"
                                        color="primary"
                                        label="동시만기 익일"
                                        value="Y"
                                    ></v-checkbox>
                                </v-flex>
                                <v-flex xs3>
                                    <v-checkbox
                                        v-bind:disabled="inputDisabled"
                                        color="primary"
                                        label="동시만기 익주 첫영업일"
                                        value="Y"
                                    ></v-checkbox>
                                </v-flex>
                                <v-flex xs2>
                                    <v-checkbox
                                        v-bind:disabled="inputDisabled"
                                        color="primary"
                                        label="옵션만기 익일"
                                        value="Y"
                                    ></v-checkbox>
                                </v-flex>
                                <v-flex xs3>
                                    <v-checkbox
                                        v-bind:disabled="inputDisabled"
                                        color="primary"
                                        label="옵션만기 익주 첫영업일"
                                        value="Y"
                                    ></v-checkbox>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>


                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">초기투자금액(KRW)</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field   v-model="init_invest_money" outline></v-text-field>
                        </v-flex>
                    </v-layout>


                    <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">벤치마크 설정</v-subheader>
                        </v-flex>
                        <v-flex xs2>
                            <v-select :items="items3" placeholder="선택하세요" outline></v-select>
                        </v-flex>
                    </v-layout>
                </v-card>


                <v-card class="register_wrap pt0" flat xs12 color="lighten-1">
                    <h4>포트폴리오 설정</h4>
                    <v-layout row>
                        <v-flex xs12>
                            <div class="right_btn">
                                <span>비중설정방식:</span>
                                <span class="toggle2">
                                    <v-btn-toggle v-model="toggle_one" class="toggle_01">
                                        <v-btn flat>직접입력</v-btn>
                                        <v-btn flat>동일가중</v-btn>
                                        <v-btn flat>시총비중</v-btn>
                                    </v-btn-toggle>
                                </span>
                            </div>
                        </v-flex>
                    </v-layout>


                    <v-card flat class="pt-3">
                        <table class="tbl_type ver10">
                            <caption>헤더 고정 테이블</caption>
                            <colgroup>
                                <col width="10%" />
                                <col width="16%" />
                                <col width="16%" />
                                <col width="15%" />
                                <col width="16%" />
                                <col width="16%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>종목코드</th>
                                    <th class="txt_left">종목명</th>
                                    <th class="txt_right">시가총액</th>
                                    <th class="txt_right">YTD</th>
                                    <th class="txt_right">지수적용비율</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <button class="btn_icon v-icon material-icons"  @click.stop="">add_circle_outline</button>
                                        <span class="add_btn_span">Asset1</span>
                                    </td>
                                    <td class="td_in_input">
                                        <input type="text" id class="txt_right wid100" value />
                                        <span>
                                            <button class="btn_icon v-icon material-icons"  @click.stop="" >search</button>
                                        </span>
                                    </td>
                                    <td class="txt_left">삼성전자</td>
                                    <td class="txt_right">999.999.999.999.999</td>
                                    <td class="txt_right">
                                        <input type="text" id class="txt_right wid100" value />
                                    </td>
                                    <td class="txt_right">25.3</td>
                                </tr>
                                <tr class="sum">
                                    <td>Total</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="txt_right">
                                        <input type="text" id class="txt_right wid100" value="100%" />
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="text-xs-center mt-3">
                            <v-btn depressed color="primary" @click.stop="fn_test">백테스트 실행</v-btn>
                        </div>
                    </v-card>
                </v-card>

            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";

var table01 = null;


export default {

    data() {
        return {
                toggle_one: 0
            ,   items1: [
                    "2000",
                    "2001",
                    "2002",
                    "2003",
                    "2004",
                    "2005",
                    "2006",
                    "2007",
                    "2008",
                    "2009",
                    "2010",
                    "2011",
                    "2012",
                    "2013",
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019"
                ]
            ,   items2: ["매년", "반기", "분기", "매월"]
            ,   items3: ["설정안함", "KOSPI200", "KOSDAQ150", "KOSPI", "KOSDAQ"]
            ,   item: [
                    {
                        link: "Simulation/SimulationResult"
                    }
                ]

            ,   inputDisabled : false
            ,   arr_show_error_message      :   []          /* 에러 메시지 노출 정보 */

            ,   arr_grp_cd                  :   []          /* 상위 그룹정보 */
            ,   arr_start_year              :   []          /* 초기설정 시작년도 array */
            ,   arr_rebalance_cycle_cd      :   []          /* 초기설정 리밸런싱주기 array */
            ,   arr_rebalance_date_cd       :   []          /* 초기설정 리밸런싱일자 array */
            ,   arr_bench_mark_cd           :   []          /* 초기설정 벤치마크 array */
            ,   arr_importance_method_cd    :   []          /* 초기설정 비중설정방식 array */

            ,   grp_cd                      :   ""          /* 상위 그룹코드 */
            ,   scen_name                   :   ""          /* 시나리오명 */
            ,   start_year                  :   "2000"      /* 시작년도 */
            ,   rebalance_cycle_cd          :   ""          /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
            ,   rebalance_date_cd           :   ""          /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
            ,   init_invest_money           :   1000000     /* 초기투자금액 */
            ,   bench_mark_cd               :   "0"         /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
            ,   importance_method_cd        :   "1"         /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
        };
    },

    components: {

    },    

    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        /* 상위 그룹정보를 조회한다. */
        vm.fn_initGrpCd();

        /* next 시나리오명을 조회한다. */
        vm.fn_getNextScenName();        

        /* 초기 설정 데이터를 조회한다. */
        vm.fn_initData();
    },

    methods: {

        fn_test: function() {
            this.$router.push( { path: "/Simulation/SimulationResult" }) ;
        },

        /*
         * 상위 그룹정보를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_initGrpCd() {
            var vm = this;

            vm.arr_show_error_message  =   [];
            axios.post(Config.base_url + "/user/simulation/getInitGrpCd", {
                data: {}
            }).then( function(response) {
                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                        }
                    }else{
                        vm.arr_grp_cd   =   response.data.dataList;
                    }
                }
            });            
        },

        /*
         * next 시나리오명을 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getNextScenName() {
            var vm = this;

            axios.post(Config.base_url + "/user/simulation/getNextScenName", {
                data: {}
            }).then( function(response) {
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
            });            
        },        

        /*
         * 초기 설정 데이터를 조회한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_initData() {
            var vm = this;

            /* COM006 - 리밸런싱주기( 1- 매년, 2-반기, 3-분기, 4,-매월, 5-매주 ) */
            /* COM007 - 리밸런싱일자 ( 1. 첫영업일, 2.동시만기익일, 3. 동시만기 익주 첫영업일 4. 옵션만기익, 5. 옵션만기 익주 첫영업일 ) */
            /* COM008 - 벤치마크( 0-설정안함, 1. KOSPI200, 2.KOSDAQ150, 3.KOSDAQ ) */
            /* COM009 - 비중설정방식( 1-직접입력, 2. 동일가중, 3.시총비중 ) */
            var arrComMstCd = [ "COM006", "COM007", "COM008", "COM009" ];            

            axios.post(Config.base_url + "/user/simulation/getInitData", {
                data: { arrComMstCd : arrComMstCd }
            }).then( function(response) {

                if (response && response.data) {
                    var arrMsg = ( response.data.arrMsg && response.data.arrMsg.length > 0 ? response.data.arrMsg : [] );

                    if (!response.data.result) {
                        if( arrMsg.length > 0 ) {
                            vm.arr_show_error_message.push( ...arrMsg );
                        }
                    }
                }
            });            
        }
        
    }
};
</script>