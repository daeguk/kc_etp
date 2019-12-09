<template>
    <v-layout row wrap class="content_margin">
        <v-flex grow>
            <v-card flat class="creat_f">
                <div
                    class="warning_box"
                    v-if="arr_show_error_message != null && arr_show_error_message.length > 0"
                >
                    <span
                        class="margin_n"
                        v-for="(item, index) in arr_show_error_message"
                        :key="index"
                    >
                        <v-icon color="#ff4366">error_outline</v-icon>
                        {{item}}
                        <br />
                    </span>
                </div>

                <span>
                    <v-btn depressed color="primary" @click="fn_showSenario()">시나리오 생성</v-btn>
                </span>
                <span>
                    <v-btn
                        depressed
                        outline
                        color="primary"
                        @click="fn_showCreateGroup();"
                    >그룹 생성</v-btn>
                </span>

                <div style="display:inline" v-if="showCreateGroup=='Y'">
                    <span>
                        <v-text-field
                            v-model="scen_name"
                            outline
                            class="wid200 text_in01"
                            maxlegnth="50"
                            ref="scen_name"
                        ></v-text-field>
                    </span>
                    <span class="margin_t1">
                        <v-btn
                            v-if="['insert'].includes( status )"
                            depressed
                            small
                            outline
                            color="primary"
                            @click="fn_modify_group( 'insert' )"
                        >추가</v-btn>
                        <!-- 
                        <v-btn  v-if="['modify'].includes( status )"    depressed small outline color="primary" @click="fn_modify_group( 'modify' )">수정</v-btn>
                        <v-btn  v-if="['modify'].includes( status )"    depressed small outline color="primary" @click="fn_modify_group( 'delete' )">삭제</v-btn> 
                        -->
                    </span>
                </div>
                <span>
                    <v-btn
                        depressed
                        outline
                        color="primary"

                        @click.stop="fn_show_simulation_time_series_upload( {}, -1 )"
                        
                    >시계열 등록</v-btn>
                </span>
                <span class="btn_r">
                    <v-btn depressed color="primary" @click="fn_compare_checked_data()">비교하기</v-btn>
                </span>
            </v-card>

            <v-card flat>
                <div class="table-box-wrap">
                    <div class="table-box" style="max-height:690px;">
                        <table id="table01" class="tbl_type ver10">
                            <caption></caption>

                            <colgroup>
                                <col width="4%" />
                                <col width="40%" />
                                <col width="20%" />
                                <col width="25%" />
                                <col width="15%" />
                            </colgroup>

                            <thead>
                                <tr>
                                    <th width="4%"></th>
                                    <th width="40%" class="txt_left">Name</th>
                                    <th width="20%" class="txt_right">Index</th>
                                    <th width="25%" class="txt_right">Last modifired</th>
                                    <th width="15%"></th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="( item, index ) in arr_simul_list"
                                    :key="'simul_' + index"
                                >
                                    <td>
                                        <v-checkbox
                                            color="primary"
                                            v-model="arr_comp"
                                            :name="'chk_' + index"
                                            :value="fn_set_checked_value( item )"
                                            @click.stop="fn_check_data( item, index )"
                                            :disabled="item.grp_yn=='1'"
                                        ></v-checkbox>
                                    </td>

                                    <!-- Name -->
                                    <td class="txt_left">
                                        <!-- 시나리오 그룹 인 경우 -->
                                        <div class="simu_namemodi_w" v-if="item.grp_yn == '1'">
                                            <div>
                                                <v-icon>folder_open</v-icon>
                                            </div>

                                            <div
                                                :name="'div_simul_' + index + '_read'"
                                                style="display:inline"
                                            >{{ item.scen_name }}</div>
                                            <div
                                                :name="'div_simul_' + index + '_edit'"
                                                style="display:none;"
                                            >
                                                <ul>
                                                    <li>
                                                        <input
                                                            type="text"
                                                            :name="'txt_simul_' + index"
                                                            :value="item.scen_name"
                                                            maxlength="50"
                                                            @keyup.enter.stop="fn_rename_scenario( item, index )"
                                                        />
                                                    </li>
                                                    <li>
                                                        <v-btn
                                                            name="btn_rename"
                                                            outline
                                                            small
                                                            color="primary"
                                                            @click.stop="fn_rename_scenario( item, index )"
                                                        >변경</v-btn>
                                                    </li>
                                                    <li>
                                                        <v-btn
                                                            name="btn_rename_cancel"
                                                            small
                                                            outline
                                                            color="primary"
                                                            @click.stop="fn_show_rename_cancel( item, index )"
                                                        >취소</v-btn>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <!-- 시나리오 그룹이 아닌 경우 -->
                                        <div
                                            :class="fn_grp_check_class(item)"
                                            v-if="item.grp_yn == '0'"
                                            class="simu_namemodi_w"
                                        >
                                            <div>
                                                <v-icon v-if="( typeof item.time_series_upload_yn != 'undefined' && item.time_series_upload_yn == '1')">insert_chart_outlined</v-icon>
                                                <v-icon v-if="( typeof item.time_series_upload_yn == 'undefined' || item.time_series_upload_yn != '1')">insert_chart</v-icon>
                                            </div>

                                            <div
                                                :name="'div_simul_' + index + '_read'"
                                                style="display:inline"
                                            >{{ item.scen_name }}</div>
                                            <div
                                                :name="'div_simul_' + index + '_edit'"
                                                style="display:none;"
                                            >
                                                <ul>
                                                    <li>
                                                        <input
                                                            type="text"
                                                            :name="'txt_simul_' + index"
                                                            :value="item.scen_name"
                                                            maxlength="50"
                                                            @keyup.enter.stop="fn_rename_scenario( item, index )"
                                                        />
                                                    </li>
                                                    <li>
                                                        <v-btn
                                                            name="btn_rename"
                                                            small
                                                            outline
                                                            color="primary"
                                                            @click.stop="fn_rename_scenario( item, index )"
                                                        >변경</v-btn>
                                                    </li>
                                                    <li>
                                                        <v-btn
                                                            name="btn_rename_cancel"
                                                            small
                                                            outline
                                                            color="primary"
                                                            @click.stop="fn_show_rename_cancel( item, index )"
                                                        >취소</v-btn>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Index -->
                                    <td class="txt_right">
                                        {{ fn_formatNumber( item.INDEX_RATE ) }}
                                        <br />
                                        <div
                                            v-if='fn_formatNumber( item.INDEX_RATE ) != null && fn_formatNumber( item.INDEX_RATE ) != ""'
                                        >
                                            <span
                                                :class='( ( Number( item.INDEX_RATE ) - 1000 ) / 1000) * 100 > 0 ? "text_S text_red" : "text_S text_blue" '
                                            >
                                                {{ fn_formatNumber( Number( item.INDEX_RATE ) - 1000 ) }}
                                                ( {{ fn_formatNumber( ( ( Number( item.INDEX_RATE ) - 1000 ) / 1000) * 100 ) + " %" }} )
                                            </span>
                                        </div>
                                    </td>

                                    <!-- Last modified -->
                                    <td class="txt_right">
                                        {{ item.fmt_upd_time }}
                                        <input
                                            type="hidden"
                                            name="strParam"
                                            :value="JSON.stringify( { 'grp_cd' : item.grp_cd, 'scen_cd' : item.scen_cd, 'scen_name' : item.scen_name, 'grp_yn' : item.grp_yn, 'simul_change_yn' : item.simul_change_yn, 'result_daily_yn' : item.result_daily_yn, 'index' : index, 'owner_yn' : item.owner_yn, 'time_series_upload_yn' : item.time_series_upload_yn } )"
                                        />
                                    </td>


                                <!-- 버튼 영역 start -->
                                    <td>
                                        <div class="tooltip">
                                            <button
                                                name="btn1"
                                                :class="'simul_icon1 ' + ( ( item.grp_yn == '0' && item.owner_yn == '1' ) ?  '' : 'disable' )"
                                                @click.stop="fn_show_simul_modify( item, index )"
                                            ></button>
                                            <span class="tooltiptext" style="width:70px;">설정하기</span>
                                        </div>

                                        <div class="tooltip">
                                            <button
                                                name="btn2"
                                                :class="'simul_icon2 ' + ( ( item.grp_yn == '1' || ( item.grp_yn == '0' && item.result_daily_yn == '1' ) ) ?  '' : 'disable' )"
                                                @click.stop="fn_show_simul_detail( item, index )"
                                            ></button>
                                            <span class="tooltiptext" style="width:70px;">결과보기</span>
                                        </div>

                                        <!-- 그룹인 경우 -->
                                        <div class="tooltip">
                                            <v-menu
                                                bottom
                                                left
                                                v-if="item.grp_yn == '1'"
                                                :close-on-content-click="false"
                                                v-model="item.menu_grp"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <button
                                                        name="btn4"
                                                        class="btn_icon v-icon material-icons"
                                                        v-on="on"
                                                        @click="fn_show_more( item, index, 'grp' )"
                                                    >more_horiz</button>
                                                </template>

                                                <ul class="more_menu_w">
                                                    <li
                                                        v-if="item.owner_yn == '1'"
                                                        @click="fn_modify_group( 'delete', item, index )"
                                                    >
                                                        <v-icon class="simul_more_btn">delete</v-icon>삭제
                                                    </li>

                                                    <li
                                                        v-if="item.owner_yn == '1'"
                                                        @click="fn_show_rename( item, index, 'true' )"
                                                    >
                                                        <v-icon class="simul_more_btn">create</v-icon>이름변경
                                                    </li>

                                                    <li @click="fn_copy_scenario( item, index )">
                                                        <v-icon class="simul_more_btn">file_copy</v-icon>복사하기
                                                    </li>


                                                    <li v-if="item.owner_yn == '0'"
                                                        @click="fn_apply_share_user_revoke_in_arr( item, index, 'grp' )">
                                                        <v-icon
                                                            class="simul_more_btn"
                                                        >share</v-icon>공유해제
                                                    </li>                                                    


                                                    <li v-if="item.owner_yn == '1'"
                                                        @click="fn_open_share_modal( item, index, 'grp' )">
                                                        <v-icon
                                                            class="simul_more_btn"
                                                        >share</v-icon>공유하기                                               
                                                    </li>
                                                </ul>
                                            </v-menu>
                                            <span class="tooltiptext" style="width:50px;">more</span>
                                        </div>

                                        <!-- 시나리오인 경우 -->
                                        <div class="tooltip">
                                            <v-menu
                                                bottom
                                                left
                                                v-if="item.grp_yn == '0'"
                                                :close-on-content-click="false"
                                                v-model="item.menu"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <button
                                                        name="btn3"
                                                        class="btn_icon v-icon material-icons"
                                                        v-on="on"
                                                        @click="fn_show_more( item, index, 'scen' )"
                                                    >more_horiz</button>
                                                </template>

                                                <ul class="more_menu_w">
                                                    <li
                                                        v-if="item.owner_yn == '1'"
                                                        @click="fn_simul_delete( item, index );item.menu = false"
                                                    >
                                                        <v-icon class="simul_more_btn">delete</v-icon>삭제
                                                    </li>

                                                    <li
                                                        v-if="item.owner_yn == '1'"
                                                        @click="fn_show_rename( item, index, 'true' ); item.menu = false"
                                                    >
                                                        <v-icon class="simul_more_btn">create</v-icon>이름변경
                                                    </li>

                                                    <li
                                                        v-if="item.owner_yn == '1'"
                                                        @click="fn_show_change_group_list( item, index );"
                                                    >
                                                        <v-icon class="simul_more_btn">restore_page</v-icon>그룹변경
                                                    </li>

                                                    <!--그룹명 팝업창---->
                                                    <v-card
                                                        v-if="showGrpChange && item.owner_yn == '1'"
                                                    >
                                                        <ul class="simul_group_modi_pop">
                                                            <li
                                                                @click.stop
                                                                v-if="!arr_group_list || arr_group_list.length == 0"
                                                            >변경할 그룹정보가 없습니다.</li>

                                                            <li
                                                                @click="fn_change_group( item_grp, index_grp, item )"
                                                                v-for="( item_grp, index_grp ) in arr_group_list"
                                                                :key="index_grp"
                                                            >{{ item_grp.grp_name }}</li>
                                                        </ul>
                                                    </v-card>
                                                    <!--그룹명 팝업창end--->

                                                    <li @click="fn_copy_scenario( item, index )">
                                                        <v-icon class="simul_more_btn">file_copy</v-icon>복사하기
                                                    </li>


                                                    <li v-if="item.owner_yn == '0'"
                                                        @click="fn_apply_share_user_revoke_in_arr( item, index, 'scen' )">
                                                        <v-icon
                                                            class="simul_more_btn"
                                                        >share</v-icon>공유해제
                                                    </li>

                                                    <li v-if="item.owner_yn == '1'"
                                                        @click="fn_open_share_modal( item, index, 'scen' )">
                                                        <v-icon
                                                            class="simul_more_btn"
                                                        >share</v-icon>공유하기                                               
                                                    </li>

                                                </ul>
                                            </v-menu>
                                            <span class="tooltiptext" style="width:50px;">more</span>
                                        </div>
                                    </td>
                                <!-- 버튼 영역 end -->

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </v-card>
        </v-flex>

        <v-flex>
            
            <sharePopup01 
                v-if="share_modal_flag" 
                
                :share_row_data="share_row_data"
                 @fn_close_share_modal="fn_close_share_modal" 
                 @fn_showProgress="fn_showProgress"></sharePopup01>

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
import sharePopup01 from "@/components/common/popup/sharePopup01";

var table01 = null;


export default {

    data() {
        return {
            alert: true,
                dialog: false
            ,   showGrpChange : false
            ,   showMenu        :   false

            ,   activeTab: 0
            ,   tabs: [
                    { id: 0, name: "관리목록"       },
                    { id: 1, name: "Simulation"     },
                ]

            ,   arr_show_error_message      :   []          /* 에러 메시지 노출 정보 */
            ,   showCreateGroup             :   'N'         /* 그룹추가 노출여부 */
            ,   arr_simul_list              :   []          /* 시뮬레이션 목록 정보 */
            ,   arr_group_list              :   []          /* array 그룹 목록 */

            ,   grp_cd                      :   ""          /* 선택한 그룹코드 */
            ,   scen_cd                     :   ""          /* 선택한 시나리오 코드 */
            ,   scen_name                   :   ""          /* 그룹명 */
            ,   status                      :   "insert"    /* 상태정보 */

            ,   arr_comp                    :   []
            ,   now_event                   :   ""
            ,   now_status                  :   ""
            ,   share_row_data              :   {}          /* 공유할 레코드 데이터  */
            ,   share_modal_flag            :   false
            ,   share_row_index             :   -1

            ,   v_share_count               :   0           /* 공유 건수 */
        };
    },
    components: {
        ConfirmDialog,        
        Simulation,
        sharePopup01
    },
    
    created() {
        var vm = this;
    },

    mounted() {
        var vm = this;

        /* 시뮬레이션 목록정보를 조회한다. */
        vm.fn_getSimulList();
    },

    methods: {

        /*
         * 진행 progress 를 보여준다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showProgress: function( visible ) {
            var vm = this;
            vm.$emit("fn_showProgress", visible );
        },

        /*
         * 시나리오 버튼 클릭시
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showSenario : function() {
            var vm = this;

            vm.showCreateGroup  =   'N';
            vm.$emit("fn_showSimulation", { showSimulationId : 1 } );
        },

        /*
         * 시나리오 그룹 버튼 클릭시
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showCreateGroup : function() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.fn_check_now_status().then( async function(e){

                if( e && e.result ) {            

                    vm.status           =   'insert';
                    vm.showCreateGroup  =   'Y'
                }
            });
        },

        /*
         * 시뮬레이션 목록정보를 조회한다. 
         * 2019-07-26  bkLove(촤병국)
         */
        fn_getSimulList() {
            var vm = this;

            vm.arr_show_error_message   =   [];

            vm.now_event                =   "";
            vm.now_status               =   "";
            vm.arr_simul_list           =   [];
            
            vm.fn_showProgress( true );

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/getSimulList"
                        ,   "data"      :   {}
                        ,   "method"    :   "post"
                    }
                ,   function(response) {
                        vm.fn_showProgress( false );

                        if (response && response.data) {
                            var msg = ( response.data.msg ? response.data.msg : "" );

                            if (!response.data.result) {
                                if( msg ) {
                                    vm.arr_show_error_message.push( msg );
                                }
                            }else{
                                vm.arr_simul_list   =   response.data.dataList;
                                vm.arr_comp         =   [];
                            }
                        }
                    }
                ,   function(error) {
                        vm.fn_showProgress( false );

                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {
                        }
                    }
            );

        },

        /*
         * 그룹 정보를 수정한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_modify_group( v_status="insert", p_item, p_index ) {
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

            vm.fn_check_now_status().then( async function(e){

                if( e && e.result ) {            


                    /* 등록인 경우 그룹명 필수 */
                    if( ["insert" ].includes( v_status ) ) {

                        if( !vm.scen_name || vm.scen_name.length == 0 ) {

                            vm.arr_show_error_message.push( "그룹명 을 입력해 주세요." );
                            return  false;
                        }

                        param.scen_name     =   vm.scen_name;           /* 그룹명 */
                    }


                    /* 삭제인 경우 */
                    if( [ "delete" ].includes( v_status ) ) {

                        if( typeof p_item == "undefined" || Object.keys( p_item ).length == 0 || typeof p_index == "undefined" || p_index < 0 ) {
                            vm.arr_show_error_message.push( "기본정보를 확인해 주세요." );
                            return  false;
                        }

                        if( typeof p_item.grp_cd == "undefined" || !p_item.grp_cd ) {
                            vm.arr_show_error_message.push( "그룹코드가 존재하지 않습니다." );
                            return  false;
                        }

                        if( typeof p_item.scen_cd == "undefined" || !p_item.scen_cd ) {
                            vm.arr_show_error_message.push( "시나리오 코드가 존재하지 않습니다." );
                            return  false;
                        }


                        if( await vm.$refs.confirm2.open(
                                    '[시나리오 그룹]',
                                    '[' + p_item.scen_name + '] 삭제 하시겠습니까?',
                                    {}
                                ,   2
                            )
                        ) {
                            if( "Y" != vm.$refs.confirm2.val ) {
                                return  false;
                            }
                        }

                        param.grp_cd        =   p_item.grp_cd;          /* 선택한 그룹코드 */
                        param.scen_cd       =   p_item.scen_cd;         /* 선택한 시나리오 코드 */
                    }

                    vm.fn_showProgress( true );

                    util.axiosCall(
                            {
                                    "url"       :   Config.base_url + "/user/simulation/modifyGroup"
                                ,   "data"      :   param
                                ,   "method"    :   "post"
                            }
                        ,   async function(response) {
                                vm.fn_showProgress( false );

                                try{
                                    if (response && response.data) {
                                        var msg = ( response.data.msg ? response.data.msg : "" );

                                        if (!response.data.result) {
                                            if( msg ) {
                                                vm.arr_show_error_message.push( msg );
                                            }
                                        }else{

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

                                }catch(ex) {
                                    console.log( "error", ex );
                                }
                            }
                        ,   function(error) {
                                vm.fn_showProgress( false );
                                if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                            }
                    );
                }
            });
        },

        /*
         * 수정정보를 보여준다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_showSimulation( v_jsonParam ) {
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
                vm.$emit( "fn_showSimulation", v_jsonParam );
            }
        },

        /*
         * formatNumber 를 수행한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_formatNumber( p_param ) {
            var vm = this;

            return  p_param ? util.formatNumber( p_param ) : "";
        },

        /*
         * 시뮬레이션을 삭제한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_simul_delete( p_item, p_index ) {

            var vm = this;

            vm.arr_show_error_message   =   [];

            if( !p_item || !p_item.grp_cd || !p_item.scen_cd  ) {
                vm.arr_show_error_message.push( "그룹코드 또는 시나리오 코드가 존재하지 않습니다." );
                return  false;
            }                  

            /* 현재 status 의 상태값을 체크한다. */
            vm.fn_check_now_status().then( function(e) {

                if( e && e.result ) {

                    /* 시나리오 공유 건수를 조회한다. */
                    return  vm.fn_get_scenario_share_count( p_item, p_index );
                }
            }).then( async function(e) {

                if( e && e.result ) {

                    var v_msg   =   "";

                    if( vm.v_share_count == 0 ) {
                        v_msg   =   '[' + p_item .scen_name + '] ' + '시나리오 정보가 모두 삭제됩니다. 삭제하시겠습니까?';
                    }else{
                        v_msg   =   '[' + p_item .scen_name + '] ' + '공유된 건수가 ' + vm.v_share_count + ' 건 존재합니다. 시나리오 정보와 함께 모두 삭제하시겠습니까?';
                    }

                    if( await vm.$refs.confirm2.open(
                                '[시나리오]',
                                v_msg,
                                {}
                            ,   2
                        )
                    ) {
                        if( "Y" != vm.$refs.confirm2.val ) {
                            return  false;
                        }
                    }

                    var p_param     =   {};

                    p_param.grp_cd  =   p_item.grp_cd;
                    p_param.scen_cd =   p_item.scen_cd;

                    vm.fn_showProgress( true );

                    util.axiosCall(
                            {
                                    "url"       :   Config.base_url + "/user/simulation/deleteAllSimul"
                                ,   "data"      :   p_param
                                ,   "method"    :   "post"
                            }
                        ,   async function(response) {
                                vm.fn_showProgress( false );

                                try{

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

                                }catch(ex) {
                                    console.log( "error", ex );
                                }
                            }
                        ,   function(error) {
                                vm.fn_showProgress( false );
                                if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                            }
                    );
                }

            });                
        },

        
        /*
         * 시나리오 공유 건수를 조회한다.
         * 2019-11-11  bkLove(촤병국)
         */
        async fn_get_scenario_share_count( p_item, p_index ) {

            var vm = this;

            vm.arr_show_error_message   =   [];
            
            if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0  ) {
                vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                return  false;
            }

            var param           =   {};

            param.grp_cd        =   p_item.grp_cd;
            param.scen_cd       =   p_item.scen_cd;

            vm.v_share_count    =   0;

            return  await new Promise(function(resolve, reject) {

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/getScenarioShareCount"
                            ,   "data"      :   param
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.arr_show_error_message.push( msg );
                                        }

                                        resolve( { result : false } );
                                    }else{
                                        vm.v_share_count    =   response.data.share_count;

                                        resolve( { result : true } );
                                    }
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
            });            
        },

        /*
         * 그룹코드에 속한 시나리오를 조회한다.
         * 2019-10-24  bkLove(촤병국)
         */
        fn_get_scen_in_grpCd( p_item, p_index ) {

            var vm = this;

            vm.arr_show_error_message   =   [];


            if( !p_item.scen_cd  ) {
                vm.arr_show_error_message.push( "그룹코드가 존재하지 않습니다." );
                return  false;
            }

            var p_param         =   {};

            p_param.grp_cd      =   p_item.grp_cd;
            p_param.scen_cd     =   p_item.scen_cd;

            vm.fn_showProgress( true );

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/getScenInGrpCd"
                        ,   "data"      :   p_param
                        ,   "method"    :   "post"
                    }
                ,   async function(response) {

                        try{

                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {

                                    vm.fn_showProgress( false );

                                    if( msg ) {
                                        vm.arr_show_error_message.push( msg );
                                    }

                                    return  false;
                                }

                                if( msg ) {
                                    if ( await vm.$refs.confirm2.open(
                                            '확인',
                                            msg,
                                            {}
                                            ,1
                                        )
                                    ) {
                                        /* 그룹 내 시나리오 결과 조회 */
                                        vm.$emit( "fn_showSimulation", { 
                                                "showSimulationId"  :   3
                                            ,   "simul_mast"        :   response.data.simul_mast
                                            ,   "arr_scen_in_grp"   :   response.data.dataList
                                            ,   "owner_all_yn"      :   response.data.owner_all_yn
                                            ,   "method_gubun"      :   "getScenInGrpCd"
                                        });

                                        return  false;
                                    }
                                }

                                /* 그룹 내 시나리오 결과 조회 */
                                vm.$emit( "fn_showSimulation", { 
                                        "showSimulationId"  :   3
                                    ,   "simul_mast"        :   response.data.simul_mast
                                    ,   "arr_scen_in_grp"   :   response.data.dataList
                                    ,   "owner_all_yn"      :   response.data.owner_all_yn
                                    ,   "method_gubun"      :   "getScenInGrpCd"
                                });                                
                            }

                            vm.fn_showProgress( false );

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.fn_showProgress( false );
                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );
        },

        /*
         * 선택된 데이터를 설정한다.
         * 2019-10-24  bkLove(촤병국)
         */
        fn_set_checked_value( p_param ) {
            return  '{ "grp_cd" : "' + p_param.grp_cd + '", "scen_cd" : "' + p_param.scen_cd + '" }';
        },

        /*
         * 체크박크 선택시 데이터를 점검한다.
         * 2019-10-24  bkLove(촤병국)
         */
        async fn_check_data( item, index ) {
            var vm = this;

            if( item.grp_yn == "1" ) {

                if ( await vm.$refs.confirm2.open(
                        '확인',
                        '그룹은 선택하실수 없습니다.',
                        {}
                        , 1
                    )
                ) {
                    var v_index =   _.findIndex( vm.arr_comp, function(o){ 
                        o = JSON.parse(o);
                        return o.grp_cd == item.grp_cd && o.scen_cd == item.scen_cd;
                    });

                    if( v_index > -1 ) {
                        vm.arr_comp.splice(  v_index, 1 );
                    }
                }
            }else{

                if( vm.arr_comp.length >= 10 ) {

                    if ( await vm.$refs.confirm2.open(
                            '확인',
                            '최대 10개 까지만 선택 가능합니다.',
                            {}
                            , 1
                        )
                    ) {
                        var v_index =   _.findIndex( vm.arr_comp, function(o){ 
                            o = JSON.parse(o);
                            return o.grp_cd == item.grp_cd && o.scen_cd == item.scen_cd;
                        });

                        if( v_index > -1 ) {
                            vm.arr_comp.splice(  v_index, 1 );
                        }
                    }
                }

            }
        },

        /*
         * 체크된 데이터를 비교한다.
         * 2019-10-24  bkLove(촤병국)
         */
        fn_compare_checked_data() {

            var vm = this;

            vm.arr_show_error_message   =   [];


            if( !vm.arr_comp || vm.arr_comp.length == 0 ) {
                vm.arr_show_error_message.push( "비교대상 시나리오를 선택해 주세요." );
                return  false;
            }

            if( vm.arr_comp.length == 1 ) {
                vm.arr_show_error_message.push( "비교대상 시나리오를 2개 이상 선택해 주세요." );
                return  false;
            }            

            var param_comp  =   _.map( vm.arr_comp, function(o) {
                o = JSON.parse(o);
                return  o;
            });

            var param       =   {
                dataList    :   param_comp
            };


            vm.fn_showProgress( true );

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/simulation/getInfoCheckedScenCd"
                        ,   "data"      :   param
                        ,   "method"    :   "post"
                    }
                ,   async function(response) {
                        vm.fn_showProgress( false );

                        try{

                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.arr_show_error_message.push( msg );
                                    }

                                    return  false;
                                }

                                if( msg ) {
                                    
                                    if ( await vm.$refs.confirm2.open(
                                            '확인',
                                            msg,
                                            {}
                                            ,1
                                        )
                                    ) {
                                        /* 그룹 내 시나리오 결과 조회 */
                                        vm.$emit( "fn_showSimulation", { 
                                                "showSimulationId"  :   3
                                            ,   "simul_mast"        :   response.data.simul_mast
                                            ,   "arr_scen_in_grp"   :   response.data.dataList
                                            ,   "owner_all_yn"      :   response.data.owner_all_yn
                                            ,   "method_gubun"      :   "getInfoCheckedScenCd"
                                        });

                                        return  false;
                                    }
                                }

                                /* 그룹 내 시나리오 결과 조회 */
                                vm.$emit( "fn_showSimulation", { 
                                        "showSimulationId"  :   3
                                    ,   "simul_mast"        :   response.data.simul_mast
                                    ,   "arr_scen_in_grp"   :   response.data.dataList
                                    ,   "owner_all_yn"      :   response.data.owner_all_yn
                                    ,   "method_gubun"      :   "getInfoCheckedScenCd"
                                });                                
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {
                        vm.fn_showProgress( false );
                        if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                    }
            );
        },

        /*
         * 선택된 행을 rename 할수 있게 보여준다.
         * 2019-10-24  bkLove(촤병국)
         */
        fn_show_rename( p_item, p_index, p_flag="false" ) {

            var vm = this;

            vm.arr_show_error_message   =   [];


            if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0  ) {
                vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                return  false;
            }


            if( p_flag == "true" ) {

                vm.fn_check_now_status().then( function(e){

                    if( e && e.result  ) {

                        vm.now_event    =   "fn_show_rename";
                        vm.now_status   =   "ing";

                        $( "div[name=div_simul_" + p_index + "_read]" ).attr("style", "display:none;");
                        $( "div[name=div_simul_" + p_index + "_edit]" ).attr("style", "display:inline;");
                    }

                });

            }else if( p_flag == "false" ){

                vm.now_event    =   "";
                vm.now_status   =   "";

                $( "div[name=div_simul_" + p_index + "_read]" ).attr("style", "display:inline;");
                $( "div[name=div_simul_" + p_index + "_edit]" ).attr("style", "display:none;");
            }
        },

        /*
         * 현재 status 의 상태값을 체크한다.
         * 2019-10-24  bkLove(촤병국)
         */
        async fn_check_now_status() {
            var vm = this;

            return  await new Promise( async function(resolve, reject) {

                if( vm.now_status == "ing" ) {

                    if( [ "fn_show_rename", "fn_rename" ].includes( vm.now_event ) ) {

                        if ( await vm.$refs.confirm2.open(
                                '확인',
                                '이름변경이 완료되지 않은 건이 존재합니다.',
                                {}
                                , 1
                            )
                        ) {        
                            
                        }
                    }

                    resolve( { result : false } );

                }else{
                    resolve( { result : true } );
                }
            }).catch( function(e1) {
                console.log( e1 );
            });
        },

        /*
         * class 정보를 반환한다.
         * 2019-10-24  bkLove(촤병국)
         */
        fn_grp_check_class( item ) {
            var v_class =   "";

            if( item.grp_yn == '0' && item.grp_cd == '*' ) {
                v_class =   "folder_1dep";
            }else if( item.grp_yn == '0' && item.grp_cd != '*' ) {
                v_class =   "folder_2dep";
            }

            return  v_class;
        },

        /*
         * 선택된 시나리오를 복사한다.
         * 2019-10-24  bkLove(촤병국)
         */
        async fn_copy_scenario( p_item, p_index ) {

            var vm = this;

            vm.arr_show_error_message   =   [];
            
            if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0  ) {
                vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                return  false;
            }

            if ( await vm.$refs.confirm2.open(
                    '확인',
                    '[' + p_item.scen_name + '] 복사 하시겠습니까?',
                    {}
                    ,2
                )
            ) {
                if( "Y" != vm.$refs.confirm2.val ) {
                    return  false;
                }
            }            

            var param           =   {};

            param.prev_grp_cd   =   p_item.grp_cd;
            param.prev_scen_cd  =   p_item.scen_cd;

            param.grp_cd        =   p_item.grp_cd;
        

            return  await new Promise(function(resolve, reject) {

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/copyScenario"
                            ,   "data"      :   param
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.arr_show_error_message.push( msg );
                                        }

                                        resolve( { result : false } );
                                    }else{

                                        /* 시뮬레이션 목록정보를 조회한다. */
                                        vm.fn_getSimulList();

                                        resolve( { result : true } );
                                    }
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
            });
        },

        /*
         * 그룹변경할 목록 정보를 조회한다.
         * 2019-10-24  bkLove(촤병국)
         */
        async fn_show_change_group_list( p_item, p_index ) {
            var vm = this;

            vm.arr_show_error_message   =   [];


            vm.fn_check_now_status().then( async function(e){            

                if( e && e.result ) {
            
                    if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0  ) {
                        vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                        return  false;
                    }

                    var param           =   {};

                    vm.arr_group_list   =   [];

                    if( vm.showGrpChange ) {
                        vm.showGrpChange    =   !vm.showGrpChange;
                        return  false;
                    }

                    param.now_grp_cd    =   p_item.grp_cd;
//                    param.show_owner_yn =   "1";
                

                    return  await new Promise(function(resolve, reject) {

                        util.axiosCall(
                                {
                                        "url"       :   Config.base_url + "/user/simulation/getInitGrpCd"
                                    ,   "data"      :   param
                                    ,   "method"    :   "post"
                                }
                            ,   function(response) {
                                    vm.fn_showProgress( false );

                                    try{

                                        if (response && response.data) {
                                            var msg = ( response.data.msg ? response.data.msg : "" );

                                            if (!response.data.result) {
                                                if( msg ) {
                                                    vm.arr_show_error_message.push( msg );
                                                }

                                                resolve( { result : false } );
                                            }else{

                                                vm.arr_group_list   =   response.data.dataList;
                                                vm.showGrpChange    =   !vm.showGrpChange;

                                                resolve( { result : true } );
                                            }
                                        }else{
                                            resolve( { result : false } );
                                        }

                                    }catch(ex) {
                                        resolve( { result : false } );
                                        console.log( "error", ex );
                                    }
                                }
                            ,   function(error) {
                                    resolve( { result : false } );

                                    if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                                }
                        );

                    }).catch( function(e1) {
                        console.log( e1 );
                    });
                }
            });
        },

        /*
         * 선택된 시나리오를 그룹변경 한다.
         * 2019-10-24  bkLove(촤병국)
         */
        async fn_change_group( p_item, p_index, p_now_item ) {

            var vm = this;

            vm.arr_show_error_message   =   [];
            
            if( !p_item || !p_item.grp_cd || !p_item.grp_name  ) {
                vm.arr_show_error_message.push( "변경할 그룹정보가 존재하지 않습니다." );
                return  false;
            }

            if( !p_now_item || !p_now_item.grp_cd || !p_now_item.scen_cd  ) {
                vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                return  false;
            }

            var param           =   {};

            param.prev_grp_cd   =   p_now_item.grp_cd;
            param.prev_scen_cd  =   p_now_item.scen_cd;

            param.grp_cd        =   p_item.grp_cd;
            param.org_grp_yn    =   p_item.grp_yn;
        

            return  await new Promise(function(resolve, reject) {

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/fnChangeGroup"
                            ,   "data"      :   param
                            ,   "method"    :   "post"
                        }
                    ,   function(response) {
                            vm.fn_showProgress( false );

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {
                                        if( msg ) {
                                            vm.arr_show_error_message.push( msg );
                                        }

                                        resolve( { result : false } );
                                    }else{

                                        /* 시뮬레이션 목록정보를 조회한다. */
                                        vm.fn_getSimulList();
                                    }
                                }else{
                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                resolve( { result : false } );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            resolve( { result : false } );

                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );

            }).catch( function(e1) {
                console.log( e1 );
            });            
        },

        /*
         *  더보기를 클릭한다.
         *  2019-11-11  bkLove(촤병국)
         */
        fn_show_more( p_item, p_index, p_gubun="scen" ) {
            var vm = this;

            vm.arr_group_list               =   [];
            vm.showGrpChange                =   false;
        },

        /*
         *  수정화면을 보여준다.
         *  2019-11-13  bkLove(촤병국)
         */
        fn_show_simul_modify( p_item, p_index ) {

            var vm = this;

            try{

                vm.arr_show_error_message   =   [];

                if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0  ) {
                    vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                    return  false;
                }

                if( !( p_item.grp_yn == '0' && p_item.owner_yn == '1' ) ) {
                    return false;
                }


                if( typeof p_item.time_series_upload_yn != 'undefined' && p_item.time_series_upload_yn == '1' ) {

                    vm.fn_show_simulation_time_series_upload( p_item, p_index );
                }else{

                    /* 수정정보를 보여준다. */
                    p_item.showSimulationId         =   1;
                    vm.fn_showSimulation( p_item );
                }

            }catch( e ) {
                console.log( e );
            }

        },

        /*
         *  상세화면을 보여준다.
         *  2019-11-13  bkLove(촤병국)
         */
        async fn_show_simul_detail( p_item, p_index ) {

            var vm = this;

            try{

                vm.arr_show_error_message   =   [];

                if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0  ) {
                    vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                    return  false;
                }


                if( !( p_item.grp_yn == '1' || ( p_item.grp_yn == '0' && p_item.result_daily_yn == '1' ) ) ) {
                    return false;
                }


                if( p_item.grp_yn == '1' ) {
                    vm.fn_get_scen_in_grpCd( p_item, p_index );
                }else{

                    if( p_item.simul_change_yn == "1" ) {

                        if( p_item.owner_yn != "1" ) {

                            if ( await vm.$refs.confirm2.open(
                                    '확인',
                                    '시뮬레이션 결과와 시나리오 정보가 변동이 발생되었습니다. 소유자만 시나리오 화면으로 이동가능합니다.',
                                    {}
                                    ,1
                                )
                            ) {
                                return  false;
                            }

                        }else{

                            if ( await vm.$refs.confirm2.open(
                                    '확인',
                                    '시뮬레이션 결과와 시나리오 정보가 변동이 발생되었습니다. 시나리오 화면으로 이동하시겠습니까?',
                                    {}
                                    ,2
                                )
                            ) {

                                if( "Y" == vm.$refs.confirm2.val ) {
                                    /* 수정정보를 보여준다. */
                                    p_item.showSimulationId        =   1;
                                    vm.fn_showSimulation( p_item );
                                }
                            }
                        }

                    }else{

                        p_item.owner_all_yn     =   p_item.owner_yn;

                        /* 결과화면을 보여준다. */
                        p_item.showSimulationId        =   2;
                        vm.$emit( "fn_showSimulation", p_item );
                    }

                }

            }catch( e ) {
                console.log( e );
            }

        },

        /*
         *  이름변경을 수행한다.
         *  2019-11-13  bkLove(촤병국)
         */
        async fn_rename_scenario( p_item, p_index ) {

            var vm = this;

            vm.arr_show_error_message   =   [];

            if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0 ) {
                vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                return  false;
            }

            var v_obj   =   $( "input[name=txt_simul_" + p_index + "]" );

            if( v_obj && typeof v_obj.val() != "undefined" ) {

                if( v_obj.val() == "" ) {

                    if ( await vm.$refs.confirm2.open(
                            '확인',
                            '시나리오명 을 입력해 주세요.',
                            {}
                            ,1
                        )
                    ) {
                        v_obj.focus();
                        return  false;
                    }
                }            


                var p_param         =   {};

                p_param.grp_cd      =   p_item.grp_cd;
                p_param.scen_cd     =   p_item.scen_cd;
                p_param.scen_name   =   v_obj.val();


                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/renameScenario"
                            ,   "data"      :   p_param
                            ,   "method"    :   "post"
                        }
                    ,   async function(response) {

                            try{

                            if (response && response.data) {
                                var msg = ( response.data.msg ? response.data.msg : "" );

                                if (!response.data.result) {
                                    if( msg ) {
                                        vm.arr_show_error_message.push( msg );
                                    }

                                    vm.fn_showProgress( false );

                                }else{

                                    /* 시뮬레이션 목록정보를 조회한다. */
                                    vm.fn_getSimulList();

                                    vm.fn_showProgress( false );
                                }
                            }

                            }catch(ex) {
                                vm.fn_showProgress( false );
                                console.log( "error", ex );
                            }
                        }
                    ,   function(error) {
                            vm.fn_showProgress( false );
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                );
            }

        },

        /*
         *  이름변경을 취소한다.
         *  2019-11-13  bkLove(촤병국)
         */
        fn_show_rename_cancel( p_item, p_index ) {

            var vm = this;

            try{

                vm.arr_show_error_message   =   [];

                if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0 ) {
                    vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                    return  false;
                }            

                vm.fn_show_rename( p_item, p_index, "false" );

            }catch( e ) {
                console.log( e );
            }
        },

        /*
         * 공유하기 창을 오픈한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_open_share_modal: function( p_item, p_index, p_gubun="scen" ) {

            var vm = this;

            vm.arr_show_error_message   =   [];

            p_item.menu_grp             =   false;
            p_item.menu                 =   false;


            if( !p_item || !p_item.grp_cd || !p_item.scen_cd || typeof p_index == "undefined" || p_index < 0  ) {
                vm.arr_show_error_message.push( "기본정보가 존재하지 않습니다." );
                return  false;
            }

            var v_param             =   {};

            v_param                 =   p_item;
            v_param.p_index         =   p_index;
            v_param.p_gubun         =   p_gubun;

            vm.share_row_data       =   v_param;
            vm.share_row_index      =   p_index;
            vm.share_modal_flag     =   true;
        },

        /*
         * 공유하기 창을 종료한다.
         * 2019-07-26  bkLove(촤병국)
         */
        fn_close_share_modal: function() {
            var vm = this;

            vm.share_modal_flag     =   false;
        },

        /*
         * 시나리오 버튼 클릭시
         * 2019-07-26  bkLove(촤병국)
         */
        fn_show_simulation_time_series_upload : function( p_item, p_index ) {
            var vm = this;

            /* 수정정보를 보여준다. */
            p_item.showSimulationId         =   4;

            vm.$emit("fn_showSimulation", p_item );
        },

        /*
         * 선택된 사용자를 공유해제 한다.
         * 2019-11-13  bkLove(촤병국)
         */
        async fn_apply_share_user_revoke_in_arr( p_item, p_index, p_gubun="scen" ) {

            var vm = this;

            vm.arr_checked_shared       =   [];


            if( !p_item || !p_item.grp_cd || !p_item.scen_cd  ) {

                if ( vm.$refs.confirm2.open(
                        '확인',
                        "기본정보가 존재하지 않습니다.",
                        {}
                        ,1
                    )
                ) {
                }

                return  false;
            }

            return  await new Promise( async function(resolve, reject) {

                var p_param                     =   {};

                p_param.grp_cd                  =   p_item.grp_cd;
                p_param.scen_cd                 =   p_item.scen_cd;
                p_param.only_shared_user        =   "Y";
                p_param.arr_checked_shared      =   [];


                vm.fn_showProgress( true );

                util.axiosCall(
                        {
                                "url"       :   Config.base_url + "/user/simulation/applyShareUserRevokeInArr"
                            ,   "data"      :   p_param
                            ,   "method"    :   "post"
                        }
                    ,   async function(response) {

                            try{

                                if (response && response.data) {
                                    var msg = ( response.data.msg ? response.data.msg : "" );

                                    if (!response.data.result) {

                                        vm.fn_showProgress( false );

                                        if( msg ) {

                                            if ( vm.$refs.confirm2.open(
                                                    '확인',
                                                    msg,
                                                    {}
                                                    ,1
                                                )
                                            ) {
                                            }                                                
                                        }

                                        resolve( { result : false } );
                                    }else{
                                        vm.fn_showProgress( false );

                                        resolve( { result : true } );
                                    }

                                }else{
                                    vm.fn_showProgress( false );

                                    resolve( { result : false } );
                                }

                            }catch(ex) {
                                vm.fn_showProgress( false );

                                console.log( "error", ex );
                                resolve( { result : false } );
                            }
                        }
                    ,   function(error) {
                            vm.fn_showProgress( false );

                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                            resolve( { result : false } );
                        }
                );

            }).then( function(e) {

                if( e && e.result ) {

                    /* 시뮬레이션 목록정보를 조회한다. */
                    return  vm.fn_getSimulList();                    
                }

            }).catch( function(e1) {
                console.log( e1 );
            });     
        },        
    }  
};
</script>