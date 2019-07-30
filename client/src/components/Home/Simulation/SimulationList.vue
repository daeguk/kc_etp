<template>

    <v-layout row wrap class="content_margin" >
        <v-flex grow>

            <v-card flat class="creat_f">
                <div class="warning_box"    v-if="arr_show_error_message != null && arr_show_error_message.length > 0">
                    <span v-for="(item, index) in arr_show_error_message" :key="index">
                        <v-icon color="#ff4366">error_outline</v-icon> {{item}} <br>
                    </span>
                </div>

                <span>
                    <v-btn depressed color="primary" @click="showCreateGroup = 'N'" >Create Senario</v-btn>
                </span>
                <span>
                    <v-btn depressed outline color="primary" @click="showCreateGroup = 'Y'">Create A Group</v-btn>
                </span>

                <div style="display:inline" v-if="showCreateGroup=='Y'">
                    <span>
                        <v-text-field   v-model="scen_name" outline class="wid200"  maxlegnth="50"></v-text-field>
                    </span>
                    <span class="margin_t1">
                        <v-btn depressed small outline color="primary" @click="fn_createGroup()">추가</v-btn>
                    </span>
                </div>
            </v-card>

            <v-card flat>
                <table  id="table01" class="tbl_type ver10">
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

                        <tr v-for="( item, index ) in arr_simul_list"    :key="'simul_' + index" >

                            <!-- Name -->
                            <td class="txt_left">
                                <div class=""  v-if="item.grp_yn == '1'">
                                    <v-icon>folder_open</v-icon> {{ item.scen_name }}
                                </div>
                                <div class="folder_2dep"  v-if="item.grp_yn == '0'">
                                    <v-icon>description</v-icon> {{ item.scen_name }}
                                </div>                                
                            </td>

                            <!-- Index -->
                            <td class="txt_right">
                                <div v-if="item.grp_yn == '0'">
<!--
                                    2,076.93
                                    <br />
                                    <span class="text_S text_blue">0.47%</span>
-->
                                </div>
                            </td>

                            <!-- Last modified -->
                            <td>
                                {{ item.fmt_upd_time }}
                                <input  type="hidden"   name="strParam"    :value="JSON.stringify( { 'grp_cd' : item.grp_cd, 'scen_cd' : item.scen_cd } )" />
                            </td>

                            <!-- 버튼 영역 -->
                            <td class="txt_right">
                                <button name="btn1" class="btn_icon v-icon material-icons"  >inbox</button>
                                <button name="btn2" class="btn_icon v-icon material-icons"  >equalizer</button>
                                <button name="btn3" class="btn_icon v-icon material-icons"  >more_horiz</button>               
                            </td>
                        </tr>

                    </tbody>

                </table>
                
            </v-card>
        </v-flex>
    </v-layout>
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
                activeTab: 0
            ,   tabs: [
                    { id: 0, name: "관리목록"       },
                    { id: 1, name: "Simulation"     },
                ]

            ,   arr_show_error_message      :   []          /* 에러 메시지 노출 정보 */
            ,   showCreateGroup             :   'N'         /* 그룹추가 노출여부 */
            ,   scen_name                   :   ""          /* 그룹명 */
            ,   arr_simul_list               :  []          /* 시뮬레이션 목록 정보 */
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

        /* 시뮬레이션 목록정보를 조회한다. */
        vm.fn_getSimulList();


        table01 =   $( "#table01" );


        /* table tr 에서 버튼 클릭시  */
        $('#table01 tbody').on('click', "button[name=btn1], button[name=btn2]", function() {
            var tr          =   $(this).closest('tr');
            var rowIndex    =   tr.index();

            switch( $(this).attr( "name" ) ) {

                        /* 수정화면으로 이동한다. */
                case    "btn1"  :
                            var strParam    =   tr.find( "td input[name=strParam]" );

                            if( !strParam ) {
                                console.log( "simulation strParam parameter 인자값이 없습니다." );
                                return  false;
                            }

                            var v_jsonParam =   JSON.parse( strParam.val() );

                            if( !v_jsonParam || Object.keys( v_jsonParam ).length == 0 ) {
                                console.log( "simulation v_jsonParam parameter 인자값이 없습니다." );
                                return  false;
                            }                                
                            
                            vm.fn_showSimulationModify( v_jsonParam );

                            break;

                case    "btn2"  :

                            break;
                
            }
        });        
    },

    methods: {

        /*
         * 시뮬레이션 목록정보를 조회한다. 
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getSimulList() {
            var vm = this;

            vm.arr_show_error_message   =   [];
            axios.post(Config.base_url + "/user/simulation/getSimulList", {
                data: {}
            }).then( function(response) {
                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                        }
                    }else{
                        vm.arr_simul_list   =   response.data.dataList;
                    }
                }
            });
        },

        /*
         * 그룹 정보를 추가한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_createGroup() {
            var vm = this;

            vm.arr_show_error_message   =   [];


            if( !vm.scen_name || vm.scen_name.length == 0 ) {
                vm.arr_show_error_message.push( "그룹명 을 입력해 주세요." );
                return  false;
            }            

            axios.post(Config.base_url + "/user/simulation/crateGroup", {
                data: {
                    scen_name   :   vm.scen_name
                }
            }).then( function(response) {
                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                        }
                    }else{
                        /* 시뮬레이션 목록정보를 조회한다. */
                        vm.fn_getSimulList();
                    }
                }
            });
        },

        /*
         * 수정화면으로 이동한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showSimulationModify( v_jsonParam ) {
            var vm = this;

            vm.arr_show_error_message   =   [];


            if( !v_jsonParam.grp_cd || !v_jsonParam.scen_cd  ) {
                vm.arr_show_error_message.push( "그룹코드 또는 시나리오 코드가 존재하지 않습니다." );
                return  false;
            }            


            vm.$emit( "fn_showSimulationModify", v_jsonParam );
        }
    }    
};
</script>