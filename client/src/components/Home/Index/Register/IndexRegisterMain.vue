<template>
    <v-container>
        <v-layout row class="content_margin">
            <v-flex grow>
                <v-card flat lite pb-0>
                    <v-card-title primary-title>
                        <h3 class="headline" pb-0>
                            신규 지수 등록
                            <span class="grey--text">지수의 기본정보 및 소급지수를 등록합니다.</span>
                        </h3>
                    </v-card-title>
                    <!--registrationModify></registrationModify-->
                    <registration></registration>
                </v-card>
            </v-flex>
            <v-flex shrink>
                <v-card flat class="right_menu_w">
                    <v-navigation-drawer
                        clipped
                        width="250"
                        class="drawer-style"
                        mini-variant-width="50"
                        v-model="drawer"
                        :mini-variant.sync="mini"
                        app
                        right
                    >
                        <v-toolbar flat class="transparent">
                            <v-list class="pa-0">
                                <v-list-tile avatar>
                                    <v-list-tile-avatar class="right_menu_t_i">
                                        <v-btn icon>
                                            <v-icon>add</v-icon>
                                        </v-btn>
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <h6>Quick Menu</h6>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-btn icon @click.stop="mini = !mini">
                                            <v-icon>chevron_right</v-icon>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </v-list>
                        </v-toolbar>

                        <v-list class="pt-0" dense>
                            <v-divider></v-divider>
                            <v-list-tile class="right_menu_newbtn">
                                <v-list-tile-content>
                                    <v-btn nomal depressed color="#ff821d" dark>신규지수등록</v-btn>
                                </v-list-tile-content>
                            </v-list-tile>
                            <quickmenucon></quickmenucon>
                        </v-list>
                    </v-navigation-drawer>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import registration from "./registration.vue";
import quickmenucon from "./quickmenucon.vue";
import registrationModify from "./registrationModify.vue";

export default {
    data() {
        return {
            ticksLabels: ["등록완료", "연동신청", "연동완료"],
            drawer: true,
            mini: false
        };
    },
    components: {
        registration: registration,
        quickmenucon: quickmenucon,
        registrationModify: registrationModify
    }
};
</script>

