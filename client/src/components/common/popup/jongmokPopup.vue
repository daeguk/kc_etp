<template>
    <v-container>
<!---자산추가 팝업--->
                    <v-layout row>
                        <v-flex xs12>
                            <v-card flat>
                                <v-dialog v-model="showDialog" persistent max-width="500">                                   
                                    <v-card flat>
                                        <h5>
                                            <v-card-title class="pb-0">
                                                비교자산추가
                                                <v-spacer></v-spacer>
                                                <v-btn icon dark @click="hideJongMokPop">
                                                    <v-icon>close</v-icon>
                                                </v-btn>
                                            </v-card-title>
                                        </h5>
                                       
                                        <!--비교자산 탭--->

                                        <v-layout row wrap>
                                            <v-flex xs12>
                                                <v-tabs
                                                    grow
                                                    fixed-tabs
                                                    light
                                                    v-model="tab"
                                                >
                                                    <v-tabs-slider ></v-tabs-slider>
                                                    <v-tab
                                                        v-for="item in items"
                                                        :key="item"
                                                    >{{ item }}</v-tab>
                                                </v-tabs>
                                                 <v-tabs-items v-model="tab">
                                                    <v-tab-item>
                                                        <etfList @selectedItem="getSelectedItem"></etfList>
                                                    </v-tab-item>
                                                    <v-tab-item>
                                                        <etnList @selectedItem="getSelectedItem"></etnList>
                                                    </v-tab-item>
                                                    <v-tab-item>
                                                        <indexList @selectedItem="getSelectedItem"></indexList>
                                                    </v-tab-item>
                                                </v-tabs-items>
                                            </v-flex>
                                        </v-layout>
                                    </v-card>   
                                </v-dialog>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <!--자산추가 팝업 end--->
</v-container>
</template>


<script>
import etfList from "./etfList.vue";
import etnList from "./etnList.vue";
import indexList from "./indexList.vue";
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import select from 'datatables.net-select'
import Config from '@/js/config.js'
var importance_grid = null;
var perf_table = null;
export default {
    props: ['showDialog'],
    data() {
        return {
            tab: null,
            items: ["ETF", "ETN", "INDEX"],
            dialog: false
        };
    },
    components: {
        etfList: etfList,
        etnList: etnList,
        indexList: indexList
    },
    computed: {},
    created: function() {
       
    },
  
    beforeDestroy() {
         //this.$EventBus.$off("showJongMokPop");
    },
    mounted: function() {
        

    },
    methods: {
        getSelectedItem: function(sel_items, gubun) {
            var vm = this;

            this.$emit("selectedItem", sel_items, gubun);
        
            vm.dialog = false;
        },
        hideJongMokPop: function() {
            this.dialog = false;
            this.$emit("hideJongMokPop", false);
        }
    }
}
</script>
