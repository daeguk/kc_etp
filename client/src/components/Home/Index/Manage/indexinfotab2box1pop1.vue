<template>
    <v-layout row>
        <v-flex xs12>
            <v-card flat>
                <v-dialog v-model="dialog" persistent max-width="500">
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
                                <v-btn icon dark @click="dialog = false">
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
                                <v-tabs fixed-tabs slot="extension" color="cyan" dark v-model="tab">
                                    <v-tabs-slider color="#00fffc"></v-tabs-slider>
                                    <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
                                </v-tabs>

                                <v-tabs-items v-model="tab">
                                    <v-tab-item>
                                        <infopoptab1></infopoptab1>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <infopoptab2></infopoptab2>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <infopoptab3></infopoptab3>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-flex>
                        </v-layout>
                        <!--비교자산 탭end--->
                        <v-card class="pop_btn_w text-xs-center">
                            <v-btn depressed color="primary" @click="dialog = false">추가하기</v-btn>
                        </v-card>
                    </v-card>
                </v-dialog>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
import infopoptab1 from "./infopoptab1.vue";
import infopoptab2 from "./infopoptab2.vue";
import infopoptab3 from "./infopoptab3.vue";

export default {
    data() {
        return {
            tab: null,
            items: ["ETF", "ETN", "INDEX"],
            dialog: false
        };
    },
    components: {
        infopoptab1: infopoptab1,
        infopoptab2: infopoptab2,
        infopoptab3: infopoptab3
    },
    created: function() {},
    methods: {}
};
</script>