<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            DBF Biotech Index |
                            <span class="grey--text">DBF134</span>
                            <p>기준일 :2018.10.20</p>
                            <!--오른쪽 메뉴 종목으로 찾기 검색 후 
                            <p class="text_result">
                                6 results
                            </p--->
                            <p class="sub_txt">Last Updated : 2019.3.20 09:40:20</p>
                        </h3>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :rows-per-page-items="rowsPerPageItems"
                        class="table_line1"
                    >
                        <template slot="items" slot-scope="props">
                            <td>{{ props.item.name }}</td>
                            <td class="text-xs-left">{{ props.item.calories }}</td>
                            <td class="text-xs-right">{{ props.item.fat }}</td>
                            <td class="text-xs-right">{{ props.item.carbs }}</td>
                            <td class="text-xs-right">{{ props.item.protein }}</td>
                            <td class="text-xs-right">{{ props.item.iron }}</td>
                            <td class="text-xs-right">{{ props.item.last }}</td>
                        </template>
                    </v-data-table>
                    <v-container>
                        <v-layout row class="content_margin">
                            <v-flex grow>
                                <v-card flat lite pb-0></v-card>
                            </v-flex>
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
                                            <v-text-title>
                                                <v-icon small color="primary">flash_on</v-icon>종목으로 찾기
                                            </v-text-title>
                                            <v-text-field
                                                v-model="search"
                                                append-icon="search"
                                                placeholder="e.g.005930, 삼성전자"
                                                value="e.g.005930, 삼성전자"
                                                outline
                                                hide-details
                                            ></v-text-field>
                                        </v-list-tile-content>
                                        <v-list-tile-content class="rightmenu_con ver2">
                                            <v-text-title>
                                                <v-icon small color="primary">feedback</v-icon>지수 조치 현황
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
                                                        <indexDetailrtmenupop></indexDetailrtmenupop>
                                                        <v-card class="pop_bot_h"></v-card>
                                                    </v-card>
                                                </v-dialog>
                                            </v-text-title>
                                            <p>
                                                <v-icon small color="primary">arrow_right</v-icon>기준시가 총액변동
                                            </p>
                                            <p>
                                                <v-icon small color="primary">arrow_right</v-icon>종목편출입
                                            </p>
                                            <p>
                                                <v-icon small color="primary">arrow_right</v-icon>종목비중조절
                                            </p>
                                        </v-list-tile-content>


                                        <v-list-tile-content class="rightmenu_con">
                                            <v-text-field
                                                v-model="search"
                                                append-icon="search"
                                                placeholder="e.g.005930, 삼성전자"
                                                value="e.g.005930, 삼성전자"
                                                outline
                                                hide-details
                                            ></v-text-field>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                            <v-layout row class="w100 pt-3">
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

                                                                <v-list-tile-avatar>
                                                                    <v-icon
                                                                        :class="[item.iconClass]"
                                                                    >{{ item.icon }}</v-icon>
                                                                </v-list-tile-avatar>
                                                            </v-list-tile>
                                                        </v-list>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                             <!--오른쪽 메뉴 하단 리스트 영역end--->
                                        </v-list-tile-content>
                                    </v-list>
                                </v-navigation-drawer>
                            </v-card>
                            <!--rightmenu end--->
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";

export default {
    components: {
        indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            dialog: false,
            drawer: false,
            search: "", 
            items: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            items2: [
                {
                    icon: "feedback",
                    iconClass: "lighten-1 small",
                    title: "DBF 4차산업혁명 지수",
                    subtitle: "DBF130"
                },
                {
                    icon: "",
                    iconClass: "lighten-1 white--text",
                    title: "Recipes",
                    subtitle: "Jan 17, 2014"
                },
                {
                    icon: "feedback",
                    iconClass: " lighten-1 small",
                    title: "Work",
                    subtitle: "Jan 28, 2014"
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
        this.$EventBus.$on("LeftControlBoxDraw", draw => {
            this.drawer = draw;
        });
    },
    beforeDestory : function() {
        this.$EventBus.$off("LeftControlBoxDraw");
    }
};
</script>

