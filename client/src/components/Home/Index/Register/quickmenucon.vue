<template>
    <div>
        <v-list-tile>
            <v-list-tile-content>
                <v-card flat class="right_menu_sub_title">지수 등록 현황</v-card>
            </v-list-tile-content>
        </v-list-tile>


        <v-list-tile class="right_menu_con_w" v-for="(item, index) in indexSelectList" :key="index">
            <v-list-tile-content class="w_1">
                <v-toolbar flat>
                    <v-toolbar-title>{{item.jisu_kor_nm}}</v-toolbar-title>
               <v-spacer></v-spacer> 
                    
                        <button type="button" class="btn_icon v-icon material-icons" @click="fn_showJisuEdit({ 'jisu_id' : item.jisu_id, 'jisu_seq' : item.jisu_seq } )">edit</button>

                </v-toolbar>
                <v-range-slider
                    :tick-labels="statusList"
                    :value="item.arr_status_position"
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
//        seasons: [ "등록완료", "연동신청", "연동완료" ],
        drawer: true,
        items: [
            { title: "Home", icon: "dashboard" },
            { title: "About", icon: "question_answer" }
        ],
        mini: false,
        right: null,

        statusList : [],            /* 등록상태명 배열정보 */
        indexSelectList : []        /* 등록된 지수목록 */
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

            var vm = this;

            axios.post(Config.base_url + "/user/index/getStatusList", {
                data: { com_mst_cd: "COM001" }
            }).then(function(response) {

                if (response && response.data) {
                    vm.statusList   = response.data.arrList;

                    vm.fn_getIndexSelectList();
                }
            });
        },

        /*
         * 등록된 인덱스 목록을 조회한다.
         * 2019-04-10  bkLove(촤병국)
         */
        fn_getIndexSelectList() {

            var vm = this;

            axios.post(Config.base_url + "/user/index/getIndexSelectList", {
                data: {  }
            }).then(function(response) {
                if (response && response.data) {
                    vm.indexSelectList   = response.data.dataList;
                }
            });
        },

        /*
         * 선택된 지수 정보를 조회한다.
         * 2019-04-10  bkLove(촤병국)
         */
        fn_showJisuEdit( param ) {
            var vm = this;

            if( param ) {
                /*
                * quickmenucon -> 수정버튼 버튼 클릭시 이벤트를 호출한다.
                */
                vm.$EventBus.$emit( "quickmenucon_IndexRegisterMain_call", param );
            }
        }
    }
};
</script>