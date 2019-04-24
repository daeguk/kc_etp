<template>
    <v-container>
        <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
                slot="extension"
                v-model="tab"
                align-with-title
                light
            >
            <v-tabs-slider color="#1e99e8"></v-tabs-slider>
    
            <v-tab v-for="item in items4" :key="item">
                {{ item }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab4">
                <v-tab-item>
                    <Info></Info>
                </v-tab-item>
                <v-tab-item>
                    <Index></Index>
                </v-tab-item>
                <v-tab-item>
                    <Pdf></Pdf>
                </v-tab-item>
        </v-tabs-items>
        
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            ETP 운용 정보
                            <p>
                                Total
                                <span class="text_result">120</span> results
                                <span  class="toggle2">
                                    <v-btn-toggle v-model="text" class="toggle_01">
                                        <v-btn flat value="전종목" v-on:click="">전종목</v-btn>
                                        <v-btn flat value="국내" v-on:click="">국내</v-btn>
                                        <v-btn flat value="해외" v-on:click="">해외</v-btn>
                                        <v-btn flat value="관심종목" v-on:click="">관심종목</v-btn>
                                    </v-btn-toggle>
                                </span>
                            </p>
                            <p class="sub_txt">기준일 : 2019.3.20</p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
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
                                    <th class="txt_right">산출방식</th>
                                    <th class="txt_right">iNAV</th>
                                    <th class="txt_right">전일최종NAV</th>
                                    <th class="txt_right">기초지수</th>
                                    <th class="txt_right">지수현재가</th>
                                    <th class="txt_right">환율</th>
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
                                                <div class="text_new">new</div>
                                            </span>
                                        </span>
                                    </td>
                                    <td class="txt_right">PDF</td>
                                    <td class="txt_right">277166.42<br><span class="text_S text_blue">-0.14%</span>
                                    </td>
                                    <td class="txt_right">-4.51</td>
                                    <td class="txt_right"> 277166.42<br><span class="text_S text_red">0.14%</span>
                                    </td>
                                    <td class="txt_right">273.00<br><span class="text_S">2018.10.19</span>
                                    </td>
                                    <td class="txt_right">1129.30<br><span class="text_S">USDKRW</span>
                                    </td>
                                    <td>
                                        <!--투자지표 투자지표 산출 계산기(PDF)-->
                                        <v-dialog v-model="dialog5" persistent max-width="750">
                                        <template v-slot:activator="{ on }">
                                             <div class='tooltip'><button type='button' v-on="on" class='btn_icon v-icon material-icons'>visibility</button><span class='tooltiptext' style='width:70px;'>투자지표</span></div>
                                         </template>
                                         <v-card>
                                            <h5>
                                                <v-card-title ma-0>ETF iNAV Realtime Calculator
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon dark @click="dialog5 = false">
                                                    <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                            </h5>
                                        <div class="ETPInavpop1">
                                        <v-list subheader>
                                            <h6> KODEX200<span>069500</span></h6>
                                            <v-list-tile>
                                                <v-list-tile-title class="sumu_text">Sumulation Mode</v-list-tile-title>
                                                <v-list-tile-content class="sumul_btn_w">
                                                    <ul>
                                                        <li><v-switch v-model="switch1" color="primary"></v-switch></li>
                                                        <li><v-btn small flat icon ><v-icon class="btn_on">play_circle_outline</v-icon></v-btn></li>
                                                        <li><v-btn small flat icon ><v-icon>refresh</v-icon></v-btn></li>
                                                    </ul>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            </v-list>
                                        </div>
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
                                                            <li class="list_tit"><b>iNAV</b><br><span>외부공표</span></li>
                                                            <li class="text_red"><b>12435.13</b><br><span class="float_r">0.56%</span></li>
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
                                                            <li class="list_tit"><b>iNAV 계산결과</b></li>
                                                            <li class="text_red"><b>12435.13</b><br><span class="float_r">0.56%</span></li>
                                                        </ul>
                                                    </v-flex>
                                                 </v-layout>
                   
                                                </v-flex>
                                            </v-layout>
                                    </v-card>
                   
                <!--pdf table-->
               <h4>PDF <span>2018.11.10</span></h4>
                <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="7%">
                                <col width="18%">
                                <col width="12%">
                                <col width="15%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="18%">
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
                                    <td>예금 </td>
                                    <td class="txt_left">KRD0125422222</td>
                                    <td>원화현금</td>
                                    <td><input type="text" class="txt_right"></td>
                                    <td class="txt_right">3.52</td>
                                    <td class="txt_right">3.32</td>
                                    <td class="txt_right">220.22<br><span class="text_S text_red">0.98%</span></td>
                                    <td class="txt_right">2565751</td>
                                </tr>
                            </tbody>
                        </table>
                <!--pdf table end-->
                 <v-card class="pop_bot_h"></v-card>
                                        </v-card>
                                    </v-dialog>
                        <!----투자지표 투자지표 산출 계산기(PDF)--->
                        <!--투자지표 산출 계산기(지수연동)-->
                                        <v-dialog v-model="dialog6" persistent max-width="500">
                                        <template v-slot:activator="{ on }">
                                             <div class='tooltip'><button type='button' v-on="on" class='btn_icon v-icon material-icons'>visibility</button><span class='tooltiptext' style='width:70px;'>투자지표</span></div>
                                         </template>
                                         <v-card>
                                            <h5>
                                                <v-card-title ma-0>ETF iNAV Realtime Calculator
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon dark @click="dialog6 = false">
                                                    <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                            </h5>
                                        <div class="ETPInavpop1">
                                        <v-list subheader>
                                            <h6> KODEX 미국S&P500 선물<span>069500</span></h6>
                                            <v-list-tile>
                                                <v-list-tile-title class="sumu_text">Sumulation Mode</v-list-tile-title>
                                                <v-list-tile-content class="sumul_btn_w">
                                                    <ul>
                                                        <li><v-switch v-model="switch1" color="primary"></v-switch></li>
                                                        <li><v-btn small flat icon ><v-icon class="btn_on">play_circle_outline</v-icon></v-btn></li>
                                                        <li><v-btn small flat icon ><v-icon>refresh</v-icon></v-btn></li>
                                                    </ul>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            </v-list>
                                        </div>
                                    <v-card flat class="sumul_card_w ver2">
                                                <v-layout>
                                                     <v-flex xs12>
                                                         <ul>
                                                             <li class="list_tit">산출방식</li>
                                                             <li>지수수익률</li>
                                                        </ul>
                                                        <ul>
                                                             <li class="list_tit">유형</li>
                                                             <li>환노출(F)</li>
                                                        </ul>
                                                        <ul>
                                                            <li class="text_coment">iNAV=전일NAV*(1+배율*지수등락률)*환변동률</li>
                                                        </ul>
                                                        <ul>
                                                            <li class="list_tit"><b>iNAV</b><br><span>외부공표</span></li>
                                                            <li class="text_red"><b>12435.13</b><br><span class="float_r">0.56%</span></li>
                                                        </ul>
                                                        <ul>
                                                            <li class="list_tit case2">전일NAV</li>
                                                            <li class="input_mid"><v-text-field value outline class="txt_right"></v-text-field></li>
                                                         </ul>
                                                        <ul>
                                                            <li class="list_tit case2">추적수익률</li>
                                                            <li class="input_mid"><v-text-field value outline class="txt_right"></v-text-field></li>
                                                         </ul>
                                                         <ul>
                                                            <li class="list_tit">기초지수</li>
                                                            <li>S&P 500 Futures Total R</li>
                                                         </ul>
                                                    </v-flex>
                                                 </v-layout>
            
                                        </v-card>
                                        <v-card class="pop_bot_h"></v-card>
                                    </v-card>
                                </v-dialog>
                        <!----투자지표 산출 계산기(지수연동)end--->
                                        
                                        <div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:70px;'>ETP정보</span></div>
                                        <div class='tooltip'><button type='button' class='btn_icon v-icon material-icons'>picture_as_pdf</button><span class='tooltiptext' style='width:70px;'>PDF관리</span></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card>
                            <!--rightmenu---->
                            <v-card flat class="right_menu_w2">
                                <v-navigation-drawer
                                    v-model="drawer"
                                    :mini-variant="mini"
                                    app
                                    right
                                    light
                                    clipped
                                    mini-variant-width="50"
                                    width="250"
                                >
                                    <v-list class="pa-1">
                                        <v-list-tile v-if="mini">
                                            <v-list-tile-action>
                                                <v-btn icon @click.stop="mini = !mini">
                                                    <v-icon>chevron_left</v-icon>
                                                </v-btn>
                                            </v-list-tile-action>
                                        </v-list-tile>
                                        <v-list-tile avatar tag="div">
                                            <v-list-tile-content class="rightmenu_tit">Quick Start</v-list-tile-content>
                                            <v-list-tile-content>
                                                <v-btn icon @click.stop="mini = !mini">
                                                    <v-icon>chevron_right</v-icon>
                                                </v-btn>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>

                                    <v-list class="pt-0" dense>
                                         <v-list-tile-content class="rightmenu_con rightmenu_line">
                                            <v-subheader>
                                                <v-icon small>feedback</v-icon> 지수 조치 현황
                                                <v-dialog
                                                    v-model="dialog"
                                                    persistent
                                                    max-width="500"
                                                >
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn
                                                            small
                                                            depressed
                                                            outline
                                                            color="primary"
                                                            v-on="on"
                                                        >내역확인</v-btn>
                                                    </template>
                                                    <v-card flat>
                                                        <h5>
                                                            <v-card-title ma-0>
                                                                지수조치 현황(DBF 500 Index)
                                                                <v-spacer></v-spacer>
                                                                <v-btn
                                                                    icon
                                                                    dark
                                                                    @click="dialog = false"
                                                                >
                                                                    <v-icon>close</v-icon>
                                                                </v-btn>
                                                            </v-card-title>
                                                        </h5>
                                                        <div class="index3pop2_con">
                                                            <v-list subheader two-line>
                                                                <v-list-tile>
                                                                    <v-list-tile-title>조치 기준일</v-list-tile-title>
                                                                    <v-list-tile-content>2018.10.11</v-list-tile-content>
                                                                </v-list-tile>
                                                            </v-list>
                                                        </div>
                                                        <!--indexDetailrtmenupop></indexDetailrtmenupop-->
                                                        <v-card class="pop_bot_h"></v-card>
                                                    </v-card>
                                                </v-dialog>
                                            </v-subheader>
                                            <p class="text_red">
                                                <v-icon small >arrow_right</v-icon>3개 지수에 대한 조치 발생
                                            </p>
                                        </v-list-tile-content>
                                       <v-list-tile-content class="rightmenu_con Oper_menu">
                                           <v-subheader><v-icon small>build</v-icon>Operation Tools</v-subheader>
                                           <v-card flat class="w100">
                                           <v-list>
                                           <v-list-tile router-link to="InfoEtpInav" class="border_b" v-model="text2">
                                               <v-list-tile-avatar>
                                                <v-icon  value="산출 현황">exposure</v-icon>
                                                 </v-list-tile-avatar>
                                                <v-list-tile-content class="rm_con_h">
                                                    <v-list-tile-title>iNAV 산출 현황</v-list-tile-title>
                                                </v-list-tile-content>
                                           </v-list-tile>
                                           <v-list-tile @click class="border_b">
                                               <v-list-tile-avatar>
                                                    <v-icon  value="Performance" icon>loop</v-icon>
                                                 </v-list-tile-avatar>
                                                <v-list-tile-content class="rm_con_h">
                                                    <v-list-tile-title>ETP Performance</v-list-tile-title>
                                                </v-list-tile-content>
                                           </v-list-tile>
                                           <v-list-tile @click class="border_b">
                                               <v-list-tile-avatar>
                                               <v-icon value="Customize" icon>poll</v-icon>
                                                 </v-list-tile-avatar>
                                                <v-list-tile-content class="rm_con_h">
                                                    <v-list-tile-title>Customize</v-list-tile-title>
                                                </v-list-tile-content>
                                           </v-list-tile>
                                           </v-list>
                                           </v-card>
                                       </v-list-tile-content>

                                        <v-list-tile-content class="rightmenu_con">
                                           <v-layout class="w100">
                                <v-flex xs12>
                                    <v-tabs v-model="tab" centered>
                                        <v-tabs-slider color="#1976d2"></v-tabs-slider>

                                        <v-tab v-for="item in items1" :key="item">{{ item }}</v-tab>
                                    </v-tabs>

                                    <v-tabs-items v-model="tab">
                                        <v-tab-item>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                            <v-layout row class="w100 pt-2">
                                                <v-flex xs12>
                                                    <v-card flat>
                                                        <v-list two-line subheader>
                                                            <v-list-tile
                                                                v-for="item in items2"
                                                                :key="item.title"
                                                                @click
                                                                class="right_menu_w3"
                                                            >
                                                                <v-list-tile-content
                                                                    class="rm_con_h"
                                                                >
                                                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                                                    <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                                                                </v-list-tile-content>
                                                            </v-list-tile>
                                                        </v-list>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                        </v-tab-item>
                                        <v-tab-item>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                            <v-layout row class="w100 pt-2">
                                                <v-flex xs12>
                                                    <v-card flat>
                                                        <v-list two-line subheader>
                                                            <v-list-tile
                                                                v-for="item in items3"
                                                                :key="item.title"
                                                                @click
                                                                class="right_menu_w3"
                                                            >
                                                                <v-list-tile-content
                                                                    class="rm_con_h"
                                                                >
                                                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                                                    <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                                                                </v-list-tile-content>
                                                            </v-list-tile>
                                                        </v-list>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                            <!--오른쪽 메뉴 하단 리스트 영역 end--->
                                        </v-tab-item>
                                    </v-tabs-items>
                                </v-flex>

                            </v-layout> 
                            <!---자산추가 팝업--->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-card flat>
                                        <v-dialog v-model="dialog2" persistent max-width="500">
                                            <template v-slot:activator="{ on }">
                                                <v-btn outline small color="primary" dark v-on="on">
                                                    <v-icon small color="primary">add</v-icon>자산추가
                                                </v-btn>
                                            </template>
                                            <v-card>
                                                <h5>
                                                    <v-card-title ma-0>
                                                        비교자산추가
                                                        <v-spacer></v-spacer>
                                                        <v-btn icon dark @click="dialog2 = false">
                                                            <v-icon>close</v-icon>
                                                        </v-btn>
                                                    </v-card-title>
                                                </h5>
                                                <v-card-title>
                                                    <v-text-field
                                                        v-model="search"
                                                        append-icon="search"
                                                        label="Search"
                                                        single-line
                                                        hide-details
                                                    ></v-text-field>
                                                </v-card-title>

                                                <!--비교자산 탭--->

                                                <v-layout row wrap>
                                                    <v-flex xs12>
                                                        <v-tabs
                                                            fixed-tabs
                                                            color="cyan"
                                                            dark
                                                            v-model="tab2"
                                                        >
                                                            <v-tabs-slider color="#00fffc"></v-tabs-slider>
                                                            <v-tab
                                                                v-for="item in items4"
                                                                :key="item"
                                                            >{{ item }}</v-tab>
                                                        </v-tabs>
                                                        <!--v-tabs-items v-model="tab2">
                                                            <v-tab-item>
                                                                <infopoptab1></infopoptab1>
                                                            </v-tab-item>
                                                            <v-tab-item>
                                                                <infopoptab2></infopoptab2>
                                                            </v-tab-item>
                                                            <v-tab-item>
                                                                <infopoptab3></infopoptab3>
                                                            </v-tab-item>
                                                        </v-tabs-items-->
                                                    </v-flex>
                                                </v-layout>
                                                <!--비교자산 탭end--->
                                            </v-card>
                                            <v-card class="pop_btn_w text-xs-center">
                                                <v-btn
                                                    depressed
                                                    color="primary"
                                                    @click="dialog = false"
                                                >추가하기</v-btn>
                                            </v-card>
                                        </v-dialog>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                            <!--자산추가 팝업 end--->
                                        </v-list-tile-content>
                                    </v-list>
                                </v-navigation-drawer>
                            </v-card>
                            <!--rightmenu end--->
                </v-card>
            </v-flex>
        </v-layout>
        </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        
        return {
            text: '전종목',
            text2:'산출종현황',
            dialog: false,
            dialog2: false,
            dialog5: false,
            dialog6: false,
            modalFlag: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            tab4: null,
            items1: ["전체", "시장대표"],
            items4: ["ETP운영정보", "지수관리", "PDF관리"],
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
            desserts: [
                
            ]
        };
    },
    mounted : function() {
       
    }, 
    created : function() {
    },
    beforeDestory : function() {
       
    }
};
</script>

