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

            <v-tabs-items v-model="tab5">
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
                           전일종가 모니터링
                            <p>Total<span class="text_result">120</span> results </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="5%">
                                <col width="23%">
                                <col width="15%">
                                <col width="10%">
                                <col width="12%">
                                <col width="10%">
                                <col width="15%">
                                <col width="10%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>입수</th>
                                    <th class="txt_left">지수</th>
                                    <th class="txt_left">실시간심볼</th>
                                    <th class="txt_left">종가심볼</th>
                                    <th>휴장일</th>
                                    <th>최근일자</th>
                                    <th class="txt_right">최근종가</th>
                                    <th>기준일자</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text_red">NO</td>
                                    <td class="txt_left"><b>S&P GSCI Agriculture Enhanced</b><br><span class="text_S">SGECASP Index</span></td>
                                    <td class="txt_left">SPI@SGECASP</td>
                                    <td class="txt_left">SGECASP</td>
                                    <td >US</td>
                                    <td>20181203</td>
                                    <td class="txt_right">64.174560</td>
                                    <td>20181203</td>
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

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        
        return {
            text: '전종목',
            checkbox: true,
            text2:'해외지수',
            dialog: false,
            dialog2: false,
            dialog5: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            tab5: null,
            items1: ["전체", "시장대표"],
            items5: ["ETP 운용정보", "지수관리", "PDF관리"],
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

