<template>
    <v-dialog v-model="showDialog" persistent max-width="750">
        <v-card>
            <h5>
                <v-card-title ma-0>
                    ETF iNAV Realtime Calculator
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="fn_closePop">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
            </h5>

            <div class="ETPInavpop1">
                <v-list subheader>
                    <h6>
                        KODEX200 <span>069500</span>
                    </h6>

                    <v-list-tile>
                        <v-list-tile-title class="sumu_text">Sumulation Mode</v-list-tile-title>
                        <v-list-tile-content class="sumul_btn_w">
                            <ul>
                                <li>
                                    <v-switch v-model="switch1" color="primary"></v-switch>
                                </li>
                                <li>
                                    <v-btn small flat icon>
                                        <v-icon class="btn_on">play_circle_outline</v-icon>
                                    </v-btn>
                                </li>
                                <li>
                                    <v-btn small flat icon>
                                        <v-icon>refresh</v-icon>
                                    </v-btn>
                                </li>
                            </ul>
                        </v-list-tile-content>

                    </v-list-tile>
                </v-list>
            </div>

            <div class="sumul_w">
                <v-card flat class="sumul_card_w">
                    <v-layout>
                        <v-flex xs12>
                            <v-layout>
                                <v-flex xs6 class="sumul_card_line">
                                    <ul>
                                        <li class="list_tit">산출방식</li>
                                        <li>PDF</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">전일NAV</li>
                                        <li>12430.23</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">
                                            <b>iNAV</b>
                                            <br>
                                            <span>외부공표</span>
                                        </li>
                                        <li class="text_red">
                                            <b>12435.13</b>
                                            <br>
                                            <span class="float_r">0.56%</span>
                                        </li>
                                    </ul>
                                </v-flex>
                                <v-flex xs6>
                                    <ul>
                                        <li class="list_tit">CU시가총액</li>
                                        <li>1235879665654411111</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">CU당 주식수</li>
                                        <li>4000</li>
                                    </ul>
                                    <ul>
                                        <li class="list_tit">
                                            <b>iNAV 계산결과</b>
                                        </li>
                                        <li class="text_red">
                                            <b>12435.13</b>
                                            <br>
                                            <span class="float_r">0.56%</span>
                                        </li>
                                    </ul>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </div>
            <!--pdf table-->

            <h4>
                PDF <span>2018.11.10</span>
            </h4>

            <table id class="tbl_type" style="width:100%">
                <colgroup>
                    <col width="9%">
                    <col width="18%">
                    <col width="12%">
                    <col width="15%">
                    <col width="10%">
                    <col width="10%">
                    <col width="10%">
                    <col width="16%">
                </colgroup>
                <thead>
                    <tr>
                        <th class="txt_left">분류</th>
                        <th class="txt_left">코드</th>
                        <th>종목</th>
                        <th class="txt_right">CU수량</th>
                        <th class="txt_right">비중</th>
                        <th class="txt_right">현재가</th>
                        <th class="txt_right">기준가</th>
                        <th class="txt_right">CU시가총액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>예금</td>
                        <td class="txt_left">KRD0125422222</td>
                        <td>원화현금</td>
                        <td>
                            <input type="text" class="txt_right">
                        </td>
                        <td class="txt_right">3.52</td>
                        <td class="txt_right">3.32</td>
                        <td class="txt_right">
                            220.22
                            <br>
                            <span class="text_S text_red">0.98%</span>
                        </td>
                        <td class="txt_right">2565751</td>
                    </tr>
                </tbody>
            </table>

            <!--pdf table end-->
            <v-card class="pop_bot_h"></v-card>
        </v-card>
    </v-dialog>
</template>



<script>
export default {
    props: [ "showDialog", "paramData" ],
    data() {
        return {
            dialog2: false,
            dialog5: false,
            drawer: true,
            search: "",
            step: 1,
            panel: [],
            tab2: "",
            items4: [],
            switch1: "",
            on: false,


            searchData : {
                second  :   10
            }
        };
    },
    created: function() {
        var vm = this;

        vm.$EventBus.$on( "EtpOperControl_EtpOperPdfInavCalcPop_call", data => {
            console.log( "EventBus EtpOperControl_EtpOperPdfInavCalcPop_call>>>>>>>" );
            console.log(data);
        });

        vm.$EventBus.$on( "EtpOperControl_EtpOperPdfInavCalcPop_close", data => {
            vm.$EventBus.$off( "EtpOperControl_EtpOperPdfInavCalcPop_call");
        });
    },
    methods: {
        // Create an array the length of our items
        // with all values as true
        all() {
            this.panel = [...Array(this.items).keys()].map(_ => true);
        },

        /*
         * ETP iNAV 계산기 데이터를 조회한다.
         * 2019-05-14  bkLove(촤병국)
         */
        fn_getEtpOerPdfInavCalc() {
            var vm = this;

            console.log( "EtpOperPdfInavCalcPop.vue -> fn_getEtpOerPdfInavCalc" );

            axios.post( Config.base_url + "/user/etp/getEtpOerPdfInavCalc", {
                data: vm.paramData
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var dataList = response.data.dataList;

                    if (dataList && dataList.length > 0) {
                        tblPdfList.rows.add(dataList).draw();
                        tblPdfList.draw();                    
                    }
                }
            });
        },        

        fn_closePop() {
            var vm = this;

            vm.$emit("fn_closePop", "close");
        }
    }
};
</script>
