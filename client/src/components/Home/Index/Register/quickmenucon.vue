<template>
    <div>
        <v-list-tile>
            <v-list-tile-content>
                <v-card flat class="right_menu_sub_title">지수 등록 현황</v-card>
            </v-list-tile-content>
        </v-list-tile>


        <v-list-tile class="right_menu_con_w">
            <v-list-tile-content class="w_1">
                <v-toolbar flat>
                    <v-toolbar-title>DBfn 전기자동차 지수</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click>
                        <v-icon color="primary">edit</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-range-slider
                    :tick-labels="seasons"
                    :value="[0, 0]"
                    always-dirty
                    min="0"
                    max="2"
                    ticks="always"
                    readonly
                ></v-range-slider>
            </v-list-tile-content>
        </v-list-tile>

        <v-list-tile class="right_menu_con_w">
            <v-list-tile-content class="w_1">
                <v-toolbar flat>
                    <v-toolbar-title>DBfn 전기자동차 지수</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click>
                        <v-icon color="primary">edit</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-range-slider
                    :tick-labels="seasons"
                    :value="[0, 1]"
                    always-dirty
                    min="0"
                    max="2"
                    ticks="always"
                    readonly
                ></v-range-slider>
            </v-list-tile-content>
        </v-list-tile>

        <v-list-tile class="right_menu_con_w">
            <v-list-tile-content class="w_1">
                <v-toolbar flat>
                    <v-toolbar-title>DBfn 전기자동차 지수</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click>
                        <v-icon color="primary">edit</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-range-slider
                    :tick-labels="seasons"
                    :value="[0, 2]"
                    always-dirty
                    min="0"
                    max="2"
                    ticks="always"
                    readonly
                ></v-range-slider>
            </v-list-tile-content>
        </v-list-tile>

        <v-list-tile class="right_menu_con_w">
            <v-list-tile-content class="w_1">
                <v-toolbar flat>
                    <v-toolbar-title>DBfn 전기자동차 지수</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click>
                        <v-icon color="primary">edit</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-range-slider
                    :tick-labels="seasons"
                    :value="[0, 2]"
                    always-dirty
                    min="0"
                    max="2"
                    ticks="always"
                    readonly
                ></v-range-slider>
            </v-list-tile-content>
        </v-list-tile>
    </div>
</template>


<script>
export default {
    data: () => ({
        seasons: ["등록완료", "연동신청", "연동완료"],
        drawer: true,
        items: [
            { title: "Home", icon: "dashboard" },
            { title: "About", icon: "question_answer" }
        ],
        mini: false,
        right: null
    }),

    mounted() {
        console.log( "eventBus on >> ");
        this.$EventBus.$on( "test", function(val) {
            console.log( "val=[" + val + "]");
        })
    },

    methods: {
        season(val) {
            return this.seasons[val];
        }
    }
};
</script>