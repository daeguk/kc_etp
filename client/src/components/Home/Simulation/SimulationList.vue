<template>

    <v-layout row wrap class="content_margin" >
        <v-flex grow>

            <v-card flat class="creat_f">
                <div class="warning_box"    v-if="arr_show_error_message != null && arr_show_error_message.length > 0">
                    <span class="margin_n" v-for="(item, index) in arr_show_error_message" :key="index">
                        <v-icon color="#ff4366">error_outline</v-icon> {{item}} <br>
                    </span>
                </div>

                <span>
                    <v-btn depressed color="primary" @click="fn_showSenario()" >Create Senario</v-btn>
                </span>
                <span>
                    <v-btn depressed outline color="primary" @click="fn_showCreateGroup();">Create A Group</v-btn>
                </span>

                <div style="display:inline" v-if="showCreateGroup=='Y'">
                    <span>
                        <v-text-field   v-model="scen_name" outline class="wid200 text_in01"  maxlegnth="50"    ref="scen_name"></v-text-field>
                    </span>
                    <span class="margin_t1">
                        <v-btn  v-if="['insert', 'modify'].includes( status )"    depressed small outline color="primary" @click="fn_modifyGroup( 'insert' )">추가</v-btn>
                        <v-btn  v-if="['modify'].includes( status )"              depressed small outline color="primary" @click="fn_modifyGroup( 'modify' )">수정</v-btn>
                        <v-btn  v-if="['modify'].includes( status )"              depressed small outline color="primary" @click="fn_modifyGroup( 'delete' )">삭제</v-btn>
                    </span>
                </div>
            </v-card>

            <v-card flat>
           <div class="table-box-wrap">
            <div class="table-box" style="max-height:690px;">
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
                                <!-- 시나리오 그룹 인 경우 -->
                                <div class=""  v-if="item.grp_yn == '1'">
                                    <v-icon>folder_open</v-icon> {{ item.scen_name }}
                                </div>

                                <!-- 시나리오 이지만 그룹이 선택안함 경우 -->
                                <div class="folder_1dep"  v-if="item.grp_yn == '0' && item.grp_cd == '*'">
                                    <v-icon>description</v-icon> {{ item.scen_name }}
                                </div>

                                <!-- 시나리오 이지만 그룹코드가 있는 경우 -->
                                <div class="folder_2dep"  v-if="item.grp_yn == '0' && item.grp_cd != '*'">
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
                                <input  type="hidden"   name="strParam"    :value="JSON.stringify( { 'grp_cd' : item.grp_cd, 'scen_cd' : item.scen_cd, 'scen_name' : item.scen_name, 'grp_yn' : item.grp_yn } )" />
                            </td>

                            <!-- 버튼 영역 -->
                            <td class="txt_right">
                                <button name="btn1" class="btn_icon v-icon material-icons"  >inbox</button>
                                <button name="btn2" class="btn_icon v-icon material-icons"  >equalizer</button>
                                <v-menu bottom left>
                                    <template v-slot:activator="{ on }">
                                        <button name="btn2" class="btn_icon v-icon material-icons" v-on="on" >more_horiz</button>
                                    </template>
                                    <ul class="more_menu_w">
                                        <li @click="">menu1</li>
                                        <li @click="">menu2</li>
                                        <li @click="">menu3</li>
                                    </ul>
                                </v-menu>             
                            </td>
                        </tr>

                    </tbody>

                </table>
            </div>
           </div>
                
            </v-card>
        </v-flex>

        <v-flex>
            <ProgressBar ref="progress"></ProgressBar>
            <ConfirmDialog ref="confirm2"></ConfirmDialog>
        </v-flex>        
    </v-layout>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import select from "datatables.net-select";
import Config from "@/js/config.js";

import ConfirmDialog  from "@/components/common/ConfirmDialog.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";

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
            ,   arr_simul_list              :   []          /* 시뮬레이션 목록 정보 */

            ,   grp_cd                      :   ""          /* 선택한 그룹코드 */
            ,   scen_cd                     :   ""          /* 선택한 시나리오 코드 */
            ,   scen_name                   :   ""          /* 그룹명 */
            ,   status                      :   "insert"    /* 상태정보 */
        };
    },
    components: {
        ProgressBar,
        ConfirmDialog,        
        Simulation
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

                            /* 수정정보를 보여준다. */
                            vm.fn_showSimulationModify( v_jsonParam );

                            break;

                case    "btn2"  :

                            break;
                
            }
        });        
    },

    methods: {


        /*
         * 시나리오 버튼 클릭시
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showSenario : function() {
            var vm = this;

            vm.showCreateGroup  =   'N';
        },

        /*
         * 시나리오 그룹 버튼 클릭시
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showCreateGroup : function() {
            var vm = this;

            vm.status           =   'insert';
            vm.showCreateGroup  =   'Y'
        },

        /*
         * 시뮬레이션 목록정보를 조회한다. 
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getSimulList() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            util.processing(vm.$refs.progress, true);

            axios.post(Config.base_url + "/user/simulation/getSimulList", {
                data: {}
            }).then( function(response) {

                util.processing(vm.$refs.progress, false);

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
            }).catch(error => {

                util.processing(vm.$refs.progress, false);
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '서버로 부터 응답을 받지 못하였습니다.',
                        {}
                        ,4
                    )
                ) {
                }
            });
        },

        /*
         * 그룹 정보를 수정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        async fn_modifyGroup( v_status="insert" ) {
            var vm = this;

            var param   =   {
                    grp_cd          :   ""
                ,   scen_cd         :   ""
                ,   prev_grp_cd     :   ""
                ,   prev_scen_cd    :   ""

                ,   scen_name       :   ""
                ,   status          :   v_status
            };

            vm.arr_show_error_message   =   [];

            var confirm_nm          =   "저장";

            /* 등록, 수정인 경우 그룹명 필수 */
            if( ["insert", "modify" ].includes( v_status ) ) {
                if( !vm.scen_name || vm.scen_name.length == 0 ) {
                    vm.arr_show_error_message.push( "그룹명 을 입력해 주세요." );
                    return  false;
                }
            }

            /* 수정, 삭제인 경우 그룹코드, 시나리오 코드 필수 */
            if( ["modify", "delete" ].includes( v_status ) ) {

                if( !vm.grp_cd ) {
                    vm.arr_show_error_message.push( "그룹코드가 존재하지 않습니다." );
                    console.log( "그룹코드가 존재하지 않습니다." );
                    return  false;
                }

                if( !vm.scen_cd ) {
                    vm.arr_show_error_message.push( "시나리오 코드가 존재하지 않습니다." );
                    console.log( "시나리오 코드가 존재하지 않습니다." );
                    return  false;
                }                

                param.grp_cd        =   vm.grp_cd;          /* 선택한 그룹코드 */
                param.scen_cd       =   vm.scen_cd;         /* 선택한 시나리오 코드 */             
            }

            param.scen_name     =   vm.scen_name;           /* 그룹명 */    



            if( param.status == "modify" ) {
                confirm_nm          =   "수정";
            }else if( param.status == "delete" ) {
                confirm_nm          =   "삭제";
            }

            if( await vm.$refs.confirm2.open(
                        '[시나리오 그룹]',
                        confirm_nm + '하시겠습니까?',
                        {}
                    ,   2
                )
            ) {
                if( "Y" != vm.$refs.confirm2.val ) {
                    return  false;
                }
            }

            util.processing(vm.$refs.progress, true);

            axios.post(Config.base_url + "/user/simulation/modifyGroup", {
                data: param
            }).then( async function(response) {

                util.processing(vm.$refs.progress, false);

                if (response && response.data) {
                    var msg = ( response.data.msg ? response.data.msg : "" );

                    if (!response.data.result) {
                        if( msg ) {
                            vm.arr_show_error_message.push( msg );
                        }
                    }else{

                        if( msg ) {
                            if ( await vm.$refs.confirm2.open(
                                    '확인',
                                    msg,
                                    {}
                                    ,1
                                )
                            ) {
                                vm.grp_cd           =   "";         /* 선택한 그룹코드 */
                                vm.scen_cd          =   "";         /* 선택한 시나리오 코드 */
                                vm.scen_name        =   "";         /* 그룹명 */

                                vm.status           =   "insert";

                                /* 정상적으로 수정된 경우 create group 영역을 보이지 않게 한다. */
                                vm.showCreateGroup  =   'N';

                                /* 시뮬레이션 목록정보를 조회한다. */
                                vm.fn_getSimulList();
                            }
                        }
                    }
                }
            }).catch(error => {

                util.processing(vm.$refs.progress, false);
                if ( vm.$refs.confirm2.open(
                        '확인',
                        '서버로 부터 응답을 받지 못하였습니다.',
                        {}
                        ,4
                    )
                ) {
                }
            });
        },

        /*
         * 수정정보를 보여준다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showSimulationModify( v_jsonParam ) {
            var vm = this;

            vm.arr_show_error_message   =   [];


            if( !v_jsonParam.grp_cd || !v_jsonParam.scen_cd  ) {
                vm.arr_show_error_message.push( "그룹코드 또는 시나리오 코드가 존재하지 않습니다." );
                return  false;
            }            

            /* 시나리오 그룹인 경우 */
            if( v_jsonParam.grp_yn == '1' ) {
                vm.grp_cd           =   v_jsonParam.grp_cd;         /* 그룹코드 */
                vm.scen_cd          =   v_jsonParam.scen_cd;        /* 시나리오 코드 */
                vm.scen_name        =   v_jsonParam.scen_name;      /* 시나리오 명 */

                vm.status           =   "modify";
                vm.showCreateGroup  =   'Y';

                vm.$nextTick(function(){
                    vm.$refs.scen_name.focus();
                });
            }
            /* 시나리오 그룹이 아닌 경우 - 시나리오 수정화면으로 이동한다.*/
            else{
                vm.$emit( "fn_showSimulationModify", v_jsonParam );
            }
        }
    }    
};
</script>
