<template>
    <v-container>
        <v-layout row wrap>
        <v-flex xs12>
            <v-tabs
                slot="extension"
                v-model="tab5"
                align-with-title
                light
            >
            <v-tabs-slider color="#1e99e8"></v-tabs-slider>
    
            <v-tab v-for="item in items5" :key="item">
                {{ item }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
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
      </v-flex>
    </v-layout>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                             <v-text-field v-model="search" label="TIGER 코스닥 150 레버러지 (229200)" class="pdf_search"  append-icon="search"  single-line hide-details></v-text-field>
                            <p class="pdf_calendar">
                                <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                 :return-value.sync="date2" lazy transition="scale-transition" offset-y full-width min-width="290px" >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="date2" label="Picker in menu" append-icon="event" box outline v-on="on" widh="100%"></v-text-field>
                                    </template>
                                        <v-date-picker v-model="date2" no-title scrollable><v-spacer></v-spacer>
                                           <v-btn flat  @click="menu = false">Cancel</v-btn>
                                              <v-btn flat color="primary" @click="$refs.menu2.save(date2)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="8%">
                                <col width="6%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                                <col width="7%">
                                <col width="7%">
                                <col width="7%">
                                <col width="7%">
                                <col width="7%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th rowspan="2">Date</th>
                                    <th rowspan="2" class="txt_right">시장구분</th>
                                    <th rowspan="2" class="txt_left">구성종목코드</th>
                                    <th rowspan="2" class="txt_left">종목명</th>
                                    <th rowspan="2" class="txt_right">CU Shrs</th>
                                    <th rowspan="2" class="txt_right">액면금액</th>
                                    <th rowspan="2" class="txt_right">평가금액</th>
                                    <th class="txt_right">비중</th>
                                    <th class="txt_right">비중</th>
                                    <th class="txt_right">비중</th>
                                    <th class="txt_right">비중</th>
                                    <th class="txt_right">비중</th>
                                </tr>
                                <tr>
                                    <th class="txt_right text_blue th_line">11/12</th>
                                    <th class="txt_right text_blue th_line">11/11</th>
                                    <th class="txt_right text_blue th_line">11/10</th>
                                    <th class="txt_right text_blue th_line">11/09</th>
                                    <th class="txt_right text_blue th_line">11/08</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>20181112</td>
                                    <td class="txt_right">2</td>
                                    <td class="txt_left">KRD010010001</td>
                                    <td class="txt_left">원화현금</td>
                                    <td class="txt_right">767855459</td>
                                    <td class="txt_right">0</td>
                                    <td class="txt_right">548521321300</td>
                                    <td class="txt_right">85.65</td>
                                    <td class="txt_right">85.65</td>
                                    <td class="txt_right">85.65</td>
                                    <td class="txt_right">85.65</td>
                                    <td class="txt_right">85.65</td>

                                </tr>
                            </tbody>
                        </table>
                    </v-card>
                            <!--rightmenu---->
                            <v-card flat class="right_menu_w2">
                                <v-navigation-drawer v-model="drawer" :mini-variant="mini" app right light clipped
                                    mini-variant-width="50" width="250">
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
                                                <v-dialog v-model="dialog" persistent max-width="500">
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn small depressed outline color="primary" v-on="on">내역확인</v-btn>
                                                    </template>
                                                    <v-card flat>
                                                        <h5>
                                                            <v-card-title ma-0>
                                                                지수조치 현황(DBF 500 Index)
                                                                <v-spacer></v-spacer>
                                                                <v-btn icon dark @click="dialog = false">
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
                                           <v-subheader><v-icon small>build</v-icon>PDF Tools</v-subheader>
                                            <v-card flat class="w100">
                                            <v-list>
                                            <!---pdf긴급반영 팝업-->
                                          
                                            <EtpOperPdfEmergencyModifyPop></EtpOperPdfEmergencyModifyPop>
                                            
                                            <!---pdf긴급반영 팝업 팝업 end-->
                                    <!---iNAV 계산기 팝업---->
                                 <v-dialog v-model="dialog6" persistent max-width="750">
                                    <template v-slot:activator="{ on }">
                                      <v-list-tile  class="border_b ver2" v-on="on">
                                         <v-list-tile-avatar>
                                            <v-icon  value="계산기" icon>exposure</v-icon>
                                        </v-list-tile-avatar>
                                        <v-list-tile-content class="rm_con_h">
                                            <v-list-tile-title>iNAV 계산기</v-list-tile-title>
                                            <v-list-tile-sub-title>플랫폼 상에서 iNAV계산</v-list-tile-sub-title>
                                         </v-list-tile-content>
                                     </v-list-tile>
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
                                            <h6> KODEX200 <span>069500</span></h6>
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
                                </div>
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
                    <!---iNAV 계산기 팝업 end---->
                    
                             <v-list-tile  v-model="text" class="border_b ver2 importance">
                                 <v-list-tile-avatar>
                                     <v-icon value="비중변경현황" icon>find_replace</v-icon>
                                 </v-list-tile-avatar>
                                 <v-list-tile-content class="rm_con_h">
                                     <v-list-tile-title>비중 변경현황</v-list-tile-title>
                                     <v-list-tile-sub-title>최근 5일간 비중 변경내역</v-list-tile-sub-title>
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
                                                            <v-list-tile v-for="item in items2" :key="item.title" @click class="right_menu_w3">
                                                                <v-list-tile-content  class="rm_con_h">
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
                                                            <v-list-tile v-for="item in items3" :key="item.title" @click class="right_menu_w3">
                                                                <v-list-tile-content class="rm_con_h">
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
                                                    <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                                                </v-card-title>

                                                <!--비교자산 탭--->

                                                <v-layout row wrap>
                                                    <v-flex xs12>
                                                        <v-tabs fixed-tabs color="cyan" dark v-model="tab2">
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
                                                <v-btn depressed color="primary" @click="dialog = false">추가하기</v-btn>
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
    </v-container>
</template>


<script>
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

import EtpOperPdfEmergencyModifyPop from "@/components/Home/Etp/Manage/EtpOperPdfEmergencyModifyPop.vue";

export default {
    components: {
        EtpOperPdfEmergencyModifyPop: EtpOperPdfEmergencyModifyPop,
    },
    data() {
        
        return {
            text: '전종목',
            checkbox: true,
            date2: new Date().toISOString().substr(0, 10),
            menu2: false,
            text:'비중변경현황',
            dialog: false,
            dialog2: false,
            dialog5: false,
            dialog6: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            tab5: null,
            items1: ["전체", "시장대표"],
            items5: ['ETP 운용정보', '지수관리', 'PDF 관리'],
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
            desserts: []
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

