<template>
    <v-container>

        <v-tabs v-model="activeTab" align-with-title light>
            <v-tabs-slider></v-tabs-slider>

            <v-tab v-for="tab of tabs"  :key="tab.id">
                {{ tab.name }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
            <v-tab-item>
                <v-layout row wrap class="content_margin">
                    <v-flex grow>
                        <v-card flat class="creat_f">
                            <span>
                                <v-btn depressed color="primary">Create Senario</v-btn>
                            </span>
                            <span>
                                <v-btn depressed outline color="primary">Create A Group</v-btn>
                            </span>
                            <span>
                                <v-text-field label="unnamed-1" outline class="wid200"></v-text-field>
                            </span>
                            <span class="margin_t1">
                                <v-btn depressed small outline color="primary">추가</v-btn>
                            </span>
                        </v-card>
                        <v-card flat>
                            <table class="tbl_type ver10">
                                <caption></caption>
                                <colgroup>
                                    <col width="40%" />
                                    <col width="20%" />
                                    <col width="20%" />
                                    <col width="20%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th class="txt_left">Name</th>
                                        <th class="txt_right">Index</th>
                                        <th>Last modifired</th>
                                        <th class="txt_right"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="txt_left">
                                            <v-icon>folder_open</v-icon>KIMS Kosdaq TOP50 Index
                                        </td>
                                        <td class="txt_right"></td>
                                        <td></td>
                                        <td class="txt_right"></td>
                                    </tr>
                                    <tr>
                                        <td class="txt_left">
                                            <div class="folder_2dep">
                                                <v-icon>description</v-icon>KIMS Kosdaq TOP50 Senario 1
                                            </div>
                                        </td>
                                        <td class="txt_right">
                                            2,076.93
                                            <br />
                                            <span class="text_S text_blue">0.47%</span>
                                        </td>
                                        <td>2019.01.12</td>
                                        <td class="txt_right">
                                            <button class="btn_icon v-icon material-icons"  @click.stop="" >inbox</button>
                                            <button class="btn_icon v-icon material-icons"  @click.stop="" >equalizer</button>
                                            <button class="btn_icon v-icon material-icons"  @click.stop="" >more_horiz</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="txt_left">
                                            <div class="folder_2dep">
                                                <v-icon>description</v-icon>KIMS Kosdaq TOP50 Senario 1
                                            </div>
                                        </td>
                                        <td class="txt_right">
                                            2,076.93
                                            <br />
                                            <span class="text_S text_red">-0.47%</span>
                                        </td>
                                        <td>2019.01.12</td>
                                        <td class="txt_right">
                                            <button class="btn_icon v-icon material-icons"  @click.stop="" >inbox</button>
                                            <button class="btn_icon v-icon material-icons"  @click.stop="" >equalizer</button>
                                            <button class="btn_icon v-icon material-icons"  @click.stop="" >more_horiz</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-tab-item>
            <v-tab-item>
                <Simulation v-if="activeTab==1"></Simulation>
            </v-tab-item>
        </v-tabs-items>
    </v-container>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";

import Simulation from "@/components/Home/Simulation/Simulation.vue";

var table01 = null;


export default {

    data() {
        return {
            activeTab: 0,
            tabs: [
                { id: 0, name: "관리목록"       },
                { id: 1, name: "Simulation"     },
            ],            
        };
    },
    components: {
        Simulation: Simulation
    },
    
    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;
    },

    methods: {
        fn_test: function() {
            this.$router.push({ path: "/simulation/SimulationResult" });
        },
    }    
};
</script>