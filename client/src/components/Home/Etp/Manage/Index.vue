<template>
    <v-container>
        
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                           지수관리
                            <p>Total<span class="text_result">120</span> results </p>
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
                                <col width="10%">
                                <col width="15%">
                                <col width="15%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="txt_left">지수</th>
                                    <th class="txt_left">산출기관</th>
                                    <th class="txt_left">벤더</th>
                                    <th>관리유형</th>
                                    <th class="txt_right">Last</th>
                                    <th class="txt_right">Time</th>
                                    <th class="txt_left">ETF</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="txt_left line2 in_icon">
                                            <div>
                                            <b>KODEX 200fdsfdsfsfdfs</b>
                                            <br>000100
                                            </div>
                                            <div class="in_icon_r"><span class="btn_icon v-icon material-icons text_red">feedback</span></div>
                                     </td>
                                    <td class="txt_left">KRX</td>
                                    <td class="txt_left">KRX</td>
                                    <td >실시간</td>
                                    <td class="txt_right">220.22<br><span class="text_S text_red">0.98%</span></td>
                                    <td class="txt_right">09:31:10</td>
                                    <td class="txt_left">KODEX 200<br>KODEX 레버러지</td>
                                    <td>
                                        <div class="tooltip">
                                           <v-dialog v-model="dialog8" persistent max-width="1300">
                                          <template v-slot:activator="{ on }">
                                           <button type="button" class="btn_icon v-icon material-icons" v-on="on">visibility</button>
                                            <span class="tooltiptext" style="width:70px;">지수정보</span>
                                            </template>
                                            
                                             <v-card>
                                                <h5>
                                                <v-card-title ma-0> 
                                                    DBF 500 Index <span>DBF001</span>
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon dark @click="dialog8 = false">
                                                    <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                             </h5>
                                                <v-card flat>
                                                    <IndexInfoDetailPop></IndexInfoDetailPop>
                                                </v-card>
                                             </v-card>
                                         </v-dialog>
                                        </div>
                                        <div class="tooltip">
                                          <v-dialog v-model="dialog6" persistent max-width="800">
                                          <template v-slot:activator="{ on }">
                                            <button type="button" class="btn_icon v-icon material-icons" v-on="on">equalizer</button>
                                            <span class="tooltiptext" style="width:90px;">지수구성정보</span>
                                            </template>
                                            <!--- 개발 중복 화면  ppt: IDX_MNG_06 참고  -->
                                            <v-card>
                                                <h5>
                                                <v-card-title ma-0>
                                                    DBF Biotech Index
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon dark @click="dialog6 = false">
                                                    <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                             </h5>
                                            <div class="index3pop2_con ver2">
                                                <v-list subheader two-line>
                                                    <v-list-tile>
                                                        <v-list-tile-title>DBF134</v-list-tile-title>
                                                     </v-list-tile>
                                                    <v-list-tile>
                                                        <v-list-tile-title>기준일</v-list-tile-title>
                                                        <v-list-tile-content>2018.10.20</v-list-tile-content>
                                                     </v-list-tile>
                                                    <v-list-tile>
                                                        <v-list-tile-title>Last Updated</v-list-tile-title>
                                                        <v-list-tile-content>2018.09.23 09:40:20</v-list-tile-content>
                                                    </v-list-tile>
                                                </v-list>
                                            </div>
                                        <v-card flat>
                                            <table id="importance_grid" class="tbl_type" style="width:100%">
                                                <colgroup>
                                                    <col width="10%">
                                                    <col width="20%">
                                                    <col width="15%">
                                                    <col width="15%">
                                                    <col width="10%">
                                                    <col width="15%">
                                                    <col width="15%">
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th class="txt_left">CODE</th>
                                                        <th class="txt_left">Name</th>
                                                        <th class="txt_right">BasePrc</th>
                                                        <th class="txt_right">Shrs</th>
                                                        <th class="txt_right">Float rto</th>
                                                        <th class="txt_right">Ceiling rto</th>
                                                        <th class="txt_right">Factor rto</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td class="txt_left">000100</td>
                                                        <td class="txt_left">유한양행</td>
                                                        <td class="txt_right">190000</td>
                                                        <td class="txt_right">12209354</td>
                                                        <td class="txt_right">0.65</td>
                                                        <td class="txt_right">1</td>
                                                        <td class="txt_right">0.95854566322</td>
                                                    </tr>
                                                </tbody>   
                                            </table>
                                        </v-card>
                                        <!--- 개발 중복 화면  ppt: IDX_MNG_06 참고end--->
                                        <v-card class="pop_bot_h"></v-card>
                                        </v-card>
                                        </v-dialog>
                                        </div>
                                         <v-menu bottom left>
                                            <template v-slot:activator="{ on }">
                                                <div class="tooltip">
                                                    <button v-on="on" type="button" class="btn_icon v-icon material-icons">more_horiz</button>
                                                    <span class="tooltiptext" style="width:50px;">More</span>
                                                </div>
                                            </template>
                                                    <v-list class="tdicon_menu">
                                                        <v-dialog v-model="dialog7" persistent max-width="500">
                                                        <template v-slot:activator="{ on }">
                                                        <v-list-tile v-on="on">
                                                            <v-list-tile-title><v-icon class="list_i">insert_comment</v-icon> 지수조치내역</v-list-tile-title>
                                                        </v-list-tile>
                                                    </template>
                                                    <!---개발 중복 팝업 ppt: IDX_MNG_06_01 참조-->
                                                    <v-card flat>
                                                        <h5>
                                                            <v-card-title ma-0>
                                                                지수조치 현황(DBF 500 Index)
                                                                <v-spacer></v-spacer>
                                                                <v-btn icon dark  @click="dialog7 = false">
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
                                                     <!---개발 중복 팝업 ppt: IDX_MNG_06_01 참조 end-->
                                            
                                                 </v-dialog>
                                                 </v-list>
                                            <v-list class="tdicon_menu">
                                                <v-dialog v-model="dialog3" persistent max-width="700">
                                                    <template v-slot:activator="{ on }">
                                                <v-list-tile  class="tdicon_menu" v-on="on">
                                                    <v-list-tile-title><v-icon class="list_i" v-on="on">assignment_turned_in</v-icon> 지수오류내역</v-list-tile-title>
                                                    </v-list-tile>
                                                    </template>
                                                    <v-card>
                                                        <h5>
                                                            <v-card-title ma-0>
                                                            지수 오류 내역 (DBF500 Index)
                                                            <v-spacer></v-spacer>
                                                            <v-btn icon dark @click="dialog3 = false">
                                                                <v-icon>close</v-icon>
                                                            </v-btn>
                                                            </v-card-title>
                                                        </h5>
                                                        <v-card flat>
                                                            <table id="" class="tbl_type" style="width:100%">
                                                                <colgroup>
                                                                    <col width="20%">
                                                                    <col width="10%">
                                                                    <col width="10%">
                                                                    <col width="10%">
                                                                    <col width="20%">
                                                                    <col width="20%">
                                                                </colgroup>
                                                                <thead>
                                                                    <tr>
                                                                        <th class="txt_left">err-id</th>
                                                                        <th>날짜</th>
                                                                        <th>발생시간</th>
                                                                        <th>처리시간</th>
                                                                        <th class="txt_left">오류내용</th>
                                                                        <th class="txt_left">비교</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <td class="txt_left">er_dbf_18092300011</td>
                                                                    <td>2018.09.10</td>
                                                                    <td>06:30:10</td>
                                                                    <td>07:00:00</td>
                                                                    <td class="txt_left">지수 연속성 불일치</td>
                                                                    <td class="txt_left">장전처리 완료됨</td>
                                                                </tbody>   
                                                                </table>
                                                        </v-card>
                                                        <v-card class="pop_bot_h"></v-card>
                                                        </v-card>
                                                </v-dialog>
                                            </v-list>
                                        </v-menu>
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
                                                    <!---개발 중복 팝업 ppt: IDX_MNG_06_01 참조-->
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
                                                     <!---개발 중복 팝업 ppt: IDX_MNG_06_01 참조 end-->
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
                                                <v-list-tile router-link to="Overseasindex" class="border_b" v-model="text2">
                                                    <v-list-tile-avatar>
                                                     <v-icon  value="해외지수">exposure</v-icon>
                                                    </v-list-tile-avatar>
                                                     <v-list-tile-content class="rm_con_h">
                                                    <v-list-tile-title>해외지수 종가 모니터링</v-list-tile-title>
                                                 </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-card>
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
import IndexInfoDetailPop from "./IndexInfoDetailPop.vue";

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        
        return {
            text: '전종목',
            checkbox: true,
            text2:'',
            dialog: false,
            dialog2: false,
            dialog3: false,
            dialog5: false,
            dialog6: false,
            dialog7: false,
            dialog8: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            items1: ["전체", "시장대표"],
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
    components: {
                IndexInfoDetailPop: IndexInfoDetailPop,
    },
    mounted : function() {
       
    }, 
    created : function() {
    },
    beforeDestory : function() {
       
    }
};
</script>

