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
import Config from "@/js/config.js";

export default {

    data: () => ({
        seasons: [ "등록완료", "연동신청", "연동완료" ],
        drawer: true,
        items: [
            { title: "Home", icon: "dashboard" },
            { title: "About", icon: "question_answer" }
        ],
        mini: false,
        right: null,

        statusList : [],
        indexSelectList : []
    }),

    created() {
        this.fn_getStatusList();
/*        
        console.log( "eventBus on >> ");

        this.$EventBus.$on( "test", res => {
            alert();
            console.log( ">> val=[" + res + "]");
        })
*/
    },

    mounted() {
        
    },    

    beforeDestory : function() {
//        this.$EventBus.$off("test");
    },    

    methods: {

        /*
         * 등록상태 목록을 조회한다.
         * 2019-04-10  bkLove(촤병국)
         */
        fn_getStatusList() {

            axios.post(Config.base_url + "/user/index/getStatusList", {
                data: { com_mst_cd: "COM001" }
            }).then(function(response) {
                if (response && response.data) {
                }
            });
        },

        /*
         * 등록된 인덱스 목록을 조회한다.
         * 2019-04-10  bkLove(촤병국)
         */        
        fn_getIndexSelectList() {

            axios.post(Config.base_url + "/user/index/getIndexSelectList", {
                data: {  }
            }).then(function(response) {
                if (response && response.data) {
                }
            });
        }
    }
};
</script>