<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>

                <v-card flat>

                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            ETP 운용 정보
                            <p>
                                Total
                                <span class="text_result" ref="result_cnt" >0</span> results
                                <span class="toggle2">
                                    <v-btn-toggle v-model="text" class="toggle_01">
                                        <v-btn flat value="전종목"      @click="fn_getEtpOperInfo('A')">전종목</v-btn>
                                        <v-btn flat value="국내"        @click="fn_getEtpOperInfo('K')">국내</v-btn>
                                        <v-btn flat value="해외"        @click="fn_getEtpOperInfo('F')">해외</v-btn>
                                        <v-btn flat value="관심종목"    @click="fn_getEtpOperInfo('I')">관심종목</v-btn>
                                    </v-btn-toggle>
                                </span>
                            </p>
                            <!--오른쪽 메뉴 종목으로 찾기 검색 후 
                            <p class="text_result">
                                6 results
                            </p--->
                            <p class="sub_txt">기준일 : {{ nowDate }}</p>
                        </h3>
                    </v-card-title>


                    <v-card flat>

                        <table id="table01" class="display table01_w">
                            <colgroup>
                                <col width="22%">       <!-- 종목 -->
                                <col>                   <!-- 지수산출방식 -->
                                <col width="12%">       <!-- iNAV -->
                                <col width="12%">       <!-- 전일최종NAV -->
                                <col width="11%">       <!-- 추적오차율 -->
                                <col width="8%">        <!-- 괴리율 -->

                                <col width="22%">       <!-- 기초지수 -->
                                <col width="11%">       <!-- 지수현재가 -->
                                <col>                   <!-- 환율 -->
                                <col width="2%">        <!-- 그래프 이미지 -->
                            </colgroup>

                            <thead>
                                <tr>
                                    <th >종목</th>
                                    <th >지수산출방식</th>
                                    <th >iNAV</th>
                                    <th >전일최종NAV</th>
                                    <th >추적오차율</th>
                                    <th >괴리율</th>

                                    <th >기초지수</th>
                                    <th >지수현재가</th>
                                    <th >환율</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>


                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="15%">
                                <col width="10%">
                                <col width="15%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="txt_left">종목</th>
                                    <th class="txt_right">iNAV</th>
                                    <th class="txt_right">전일최종NAV</th>
                                    <th class="txt_right">추적오차율</th>
                                    <th class="txt_right">괴리율</th>
                                    <th class="txt_right">기초지수</th>
                                    <th class="txt_right">지수현재가</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="txt_left line2">
                                        <span>
                                            <b>KODEX 200</b>
                                            <br>000100
                                            <span>
                                                <div class="txt_new">new</div>
                                            </span>
                                        </span>
                                    </td>
                                    <td class="txt_right">
                                        277166.42
                                        <br>
                                        <span class="text_S text_blue">-0.14%</span>
                                    </td>
                                    <td class="txt_right">1.26</td>
                                    <td class="txt_right">-4.51</td>
                                    <td class="txt_right">3.52</td>
                                    <td class="txt_right">3.32</td>
                                    <td class="txt_right">
                                        220.22
                                        <br>
                                        <span class="text_S text_red">0.98%</span>
                                    </td>
                                    <td>
                                        <div class="tooltip">
                                            <router-link to="etpManageDetail">
                                                <button
                                                    type="button"
                                                    class="btn_icon v-icon material-icons"
                                                >equalizer</button>
                                            </router-link>
                                            <span class="tooltiptext" style="width:70px;">ETP정보</span>
                                        </div>
                                        <div class="tooltip">
                                            <button
                                                type="button"
                                                class="btn_icon v-icon material-icons"
                                            >picture_as_pdf</button>
                                            <span class="tooltiptext" style="width:70px;">PDF관리</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card>


                    <EtpOperInfoQuick   @fn_setInavData="fn_setInavData"
                                        @fn_setEtpPerformanceData="fn_setEtpPerformanceData"
                                        @fn_setCustomizeData="fn_setCustomizeData"
                    ></EtpOperInfoQuick>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'

import Config from '@/js/config.js';
import EtpOperInfoQuick     from    "@/components/Home/Etp/Manage/EtpOperInfoQuick.vue";
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

var table01 = null;

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
        EtpOperInfoQuick  :   EtpOperInfoQuick
    },
    data() {
        return {
            text: "전종목",
            items: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            items2: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                },
                {
                    title: "KODEX 코스닥150 레버러지",
                    subtitle: "122630"
                }
            ],
            items3: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                }
            ],
            
            mini: false,
            right: null,
            rowsPerPageItems: [10, 20, 30, 50],
            headers: [
                {
                    text: "Code",
                    align: "left",
                    value: "name"
                },
                { text: "name", value: "name" },
                { text: "BasePrc", value: "BasePrc", align: "right" },
                { text: "Shrs", value: "Shrs", align: "right" },
                { text: "Float rto", value: "FloatRto", align: "right" },
                { text: "Ceiling rto", value: "CeilingRto", align: "right" },
                { text: "Factor rto", value: "FactorRto", align: "right" }
            ],
            desserts: [],

            nowDate:        new Date().getFullYear() 
                        +   "." 
                        +   (parseInt(new Date().getMonth()) + 1) 
                        +   "." 
                        +   new Date().getDate(),
        };
    },
    mounted: function() {
        var vm = this;

        table01 = $('#table01').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            paging: false,
            searching: false,
            data : [],
            "columnDefs": [ {} ],
            columns: [
                { "name" : "f16002"             , "data": "f16002"           , "title" : "종목"        ,   "orderable" : true  ,   className: 'dt-body-left'  },        /* 한글종목명 */
                { "name" : "index_cal_method"   , "data": "index_cal_method" , "title" : "산출방식"     ,   "orderable" : true  ,   className: 'dt-body-left'  },       /* 지수산출방식 */
                { "name" : "f15301"             , "data": "f15301"           , "title" : "iNAV"        ,   "orderable" : true  ,   className: 'dt-body-right'  },      /* ETP지표가치(NAV/IV) */
                { "name" : "f03329"             , "data": "f03329"           , "title" : "전일최종NAV"  ,   "orderable" : true  ,   className: 'dt-body-right'  },      /* 전일ETP지표가치(예탁원)(NAV/IV) */
                { "name" : "f15302"             , "data": "f30812"           , "title" : "추적오차율"   ,   "orderable" : true  ,   className: 'dt-body-right'  },      /* 추적오차율 */
                { "name" : "f15304"             , "data": "f15304"           , "title" : "괴리율"       ,   "orderable" : true  ,   className: 'dt-body-right'  },      /* ETP괴리율 */
                { "name" : "index_nm"           , "data": "index_nm"         , "title" : "기초 지수"    ,   "orderable" : true  ,   className: 'dt-body-left'  },       /* 기초지수명 */
                { "name" : "f15001"             , "data": "f15001"           , "title" : "지수 현재가"  ,   "orderable" : true  ,   className: 'dt-body-right'  },      /* 지수 현재가 */
                { "name" : "f18438"             , "data": "f18438"           , "title" : "환율"         ,   "orderable" : true  ,   className: 'dt-body-right'  },      /* 적용환율 */
                { "data": null, className: 'checks', defaultContent:"<div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:50px;'>지수정보</span></div>" } 
            ]
        });
        
        vm.fn_getEtpOperInfo( 'A' );     /* 초기에 [전종목]이 조회되게 처리한다. */
    },
    created: function() {},
    beforeDestory: function() {},

    methods: {

        /*
         *  ETP 운영정보를 조회한다.
         *  param   :   ETP지표가치산출구분(K:국내,F:해외)  / A:전종목, I:관심종목
         *  2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOperInfo( gubun ) {

            var vm = this;

            console.log( "EtpOperInfo.vue -> fn_getEtpOperInfo" );

            if( !gubun ) {
                gubun   =   "A";
            }


            if( table01 ) {
                table01.clear().draw();
            }


//            table01.column( [ 'index_cal_method', 'f18438' ] ).visible(false);
            vm.$refs.result_cnt.textContent = "0";

            axios.post(Config.base_url + "/user/etp/getEtpOperInfo", {
                data: {
                    f34241 : gubun
                }
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var dataList = response.data.dataList;
                    
                    if( dataList && dataList.length > 0 ) {
                        table01.rows.add( dataList ).draw();
                        table01.draw();

                        vm.$refs.result_cnt.textContent = dataList.length;
                    }
                }
            });
        },

        /*
         *  EtpOperInfoQuick.vue -> [iNAV 산출현황] 선택시 호출된다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setInavData( param ) {
            console.log("########## EtpOperInfo.vue -> fn_setInavData START ############");
            console.log("# param");
            console.log( param );
            console.log("########## EtpOperInfo.vue -> fn_setInavData END ############");


        },

        /*
         *  EtpOperInfoQuick.vue -> [ETP Performance] 선택시 호출된다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setEtpPerformanceData( param ) {
            console.log("########## EtpOperInfo.vue -> fn_setEtpPerformanceData START ############");
            console.log("# param");
            console.log( param );
            console.log("########## EtpOperInfo.vue -> fn_setEtpPerformanceData END ############");
        },

        /*
         *  EtpOperInfoQuick.vue -> [Curtomize] 선택시 호출된다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setCustomizeData( param ) {
            console.log("########## EtpOperInfo.vue -> fn_setCustomizeData START ############");
            console.log("# param");
            console.log( param );
            console.log("########## EtpOperInfo.vue -> fn_setCustomizeData END ############");
        }
    }
};
</script>

