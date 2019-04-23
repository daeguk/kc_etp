<template>
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
                                            <v-subheader>
                                                <v-icon small color="primary">flash_on</v-icon>종목으로 찾기
                                            </v-subheader>
                                            <v-text-field
                                                v-model="form.jongmokSearch"
                                                append-icon="search"
                                                placeholder="e.g.005930, 삼성전자"
                                                value="e.g.005930, 삼성전자"
                                                outline
                                                hide-details

                                                @keyup.enter ="fn_getIndexJongmokList()"
                                            ></v-text-field>
                                        </v-list-tile-content>


                                        <v-list-tile-content class="rightmenu_con ver2">
                                            <v-subheader>
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

                                                            @click="fn_openJisuJixPopup()"
                                                        >내역확인</v-btn>
                                                    </template>

                                                    <v-card flat>
                                                        <h5>
                                                            <v-card-title ma-0>
                                                                지수조치 현황 ( {{ indexBasic.f16002 }} )
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

                                                        <indexDetailrtmenupop  :rowData="this.rowData" v-if="dialog"></indexDetailrtmenupop>
                                                        <v-card class="pop_bot_h"></v-card>
                                                    </v-card>
                                                </v-dialog>
                                            </v-subheader>
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
                                                v-model="form.jisuSearch"
                                                append-icon="search"
                                                placeholder="e.g.005930, 삼성전자"
                                                value="e.g.005930, 삼성전자"
                                                outline
                                                hide-details

                                                @keyup.enter ="fn_getIndexList()"
                                            ></v-text-field>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                            <v-layout row class="w100 pt-3">
                                                <v-flex xs12>
                                                    <v-card flat>
                                                        <v-list two-line subheader>

                                                            <v-list-tile
                                                                v-for="item in indexDataList"
                                                                :key="item.f16002"
                                                                @click
                                                                class="right_menu_w3"
                                                            >
                                                                <v-list-tile-content
                                                                    class="rm_con_h"
                                                                >
                                                                    <v-list-tile-title @click="fn_getIndexDetailList(item)">{{ item.f16002 }}</v-list-tile-title>
                                                                    <v-list-tile-sub-title>{{ item.f16013 }}</v-list-tile-sub-title>
                                                                </v-list-tile-content>

                                                                <v-list-tile-avatar>
                                                                    <v-icon class="lighten-1 white--text">feedback</v-icon>
                                                                </v-list-tile-avatar>
                                                            </v-list-tile>

                                                        </v-list>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                            <!--오른쪽 메뉴 하단 리스트 영역--->
                                        </v-list-tile-content>
                                    </v-list>
                                </v-navigation-drawer>
                            </v-card>
                            <!--rightmenu end--->

                        </v-layout>
                    </v-container>
</template>