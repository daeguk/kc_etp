<template>
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

                    <indexDetailrtmenucon></indexDetailrtmenucon>
                </v-list-tile-content>
            </v-list>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
import indexDetailrtmenucon from "./indexDetailrtmenucon.vue";
import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";
export default {
    data() {
        return {
            dialog: false,
            drawer: true,
            items: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            mini: false,
            right: null
        };
    },
    components: {
        indexDetailrtmenucon: indexDetailrtmenucon,
        indexDetailrtmenupop: indexDetailrtmenupop
    }
};
</script>
