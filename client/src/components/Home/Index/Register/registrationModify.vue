<template>
    <v-card flat xs12>
        <v-form ref="modForm" v-model="valid" lazy-validation>
            <v-container>
                <v-card flat class="regi_status">
                    <v-layout row  mt-2 mb-1>
                        <v-flex xs2>
                            <v-subheader>Register ID</v-subheader>
                        </v-flex>
                        <v-flex xs4 mt-2>
                            <span>{{ modForm.reg_id }}</span>
                        </v-flex>
                    </v-layout>

                    <v-layout row  mt-1 mb-2>
                        <v-flex xs2>
                            <v-subheader>Status</v-subheader>
                        </v-flex>

                        <v-flex xs4 mt-2 >
                            <span class="text_color_blue">등록완료 ></span>
                            <span v-bind:class="{ 'text_color_blue' : modForm.status >= '02'}">연동신청 ></span>
                            <span v-bind:class="{ 'text_color_blue' : modForm.status >= '03'}">연동완료</span>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-container>

            <v-container pl-4 pr-4>
                <div class="register_wrap">
                    <v-card flat xs12 class="register_t_w">
                        <h4>
                            기본정보
                            <span style="color:red">(필수입력)</span>
                        </h4>

                        <v-container fluid>
                            <!-- 지수 산출기관 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>지수산출기관</v-subheader>
                                </v-flex>

                                <v-flex xs4 mt-1 mb-3>
                                    <span class="text_color_blue">{{ inst_name }}</span>
                                </v-flex>
                            </v-layout>

                            <!-- 지수 ID-->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>지수ID</v-subheader>
                                </v-flex>

                                <v-flex xs4>
                                    <v-text-field                                         
                                        ref="jisu_id"
                                        label="지수ID"
                                        value="e.g.FDL001"
                                        outline
                                        v-model="modForm.jisu_id"
                                        :rules="rules.jisu_id"
                                        @keyup="modForm.duplCheckResult=false"

                                        :disabled="modForm.status == '03'"
                                    ></v-text-field>
                                </v-flex>

                                <v-flex xs4 class="text-xs-left">
                                    <v-layout row>
                                        <v-dialog v-model="dialog" persistent max-width="350">
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    small
                                                    depressed
                                                    color="primary"
                                                    dark
                                                    @click="fn_jisuDuplCheck"
                                                    class="mt-0"
                                                    v-if="modForm.status != '03'"
                                                >중복확인</v-btn>
                                            </template>

<!--                                    
                                        <v-card class="pop_alert">
                                            <h6><v-icon class="confirm">help</v-icon>Confirm</h6>
                                            <h6><v-icon class="warning_1">warning</v-icon> Warning</h6>
                                            <h6><v-icon class="error_1">error</v-icon> Error</h6>
                                            <v-card-title>정보 공개 요청 {{message}} 하시겠습니까?</v-card-title>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>

                                                <v-btn
                                                    class="pop_alret_yesbtn"
                                                    depressed
                                                    dark
                                                    small
                                                    @click="updateIndexOpenYn('Y');"
                                                >예</v-btn>

                                                <v-btn
                                                    class="pop_alret_nobtn"
                                                    depressed
                                                    dark
                                                    small
                                                    @click="updateIndexOpenYn('N');"
                                                >아니요</v-btn>
                                            </v-card-actions>
                                        </v-card> 
-->
                                        </v-dialog>
                                    </v-layout>
                                </v-flex>
                            </v-layout>

                            <!-- 지수한글명-->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>지수한글명</v-subheader>
                                </v-flex>

                                <v-flex xs4>
                                    <v-text-field
                                        label="지수한글명"
                                        value="DBF 바이오 테마 지수"
                                        outline
                                        v-model="modForm.jisu_kor_nm"
                                        :rules="rules.jisu_kor_nm"

                                        :disabled="modForm.status == '03'"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                            <!-- 지수개요 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>지수개요</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-textarea
                                        label="지수개요"
                                        outline
                                        color="blue"
                                        v-model="modForm.jisu_summary"
                                        :rules="rules.jisu_summary"

                                        :disabled="modForm.status == '03'"
                                    ></v-textarea>
                                </v-flex>
                            </v-layout>

                            <!-- 기준지수 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>기준지수</v-subheader>
                                </v-flex>
                                <v-flex xs4>
                                    <v-text-field
                                        label="기준지수"
                                        value="e.g.FDL001"
                                        outline
                                        v-model="modForm.base_jisu"
                                        :rules="rules.base_jisu"

                                        :disabled="modForm.status == '03'"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                            <!-- 기준일 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>기준일</v-subheader>
                                </v-flex>

                                <v-flex xs3>
                                    <!--달력-->
                                    <v-layout row wrap>
                                        <v-flex xs12 sm6 md6>
                                            <v-menu
                                                ref="menu"
                                                v-model="menu"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="modForm.base_date"
                                                lazy
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                min-width="290px"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                        label="Picker in menu"
                                                        append-icon="event"
                                                        box
                                                        outline
                                                        v-on="on"
                                                        widh="100%"
                                                        v-model="modForm.base_date"
                                                        :rules="rules.base_date"

                                                        :disabled="modForm.status == '03'"
                                                    ></v-text-field>
                                                </template>

                                                <v-date-picker v-model="modForm.base_date" no-title scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                        flat
                                                        color="primary"
                                                        @click="menu = false"
                                                    >Cancel</v-btn>
                                                    <v-btn
                                                        flat
                                                        color="primary"
                                                        @click="$refs.menu.save(modForm.base_date)"
                                                    >OK</v-btn>
                                                </v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </v-layout>
                                    <!--달력end-->
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </div>

                <!-- 부가정보 선택-->
                <div class="register_wrap">
                    <v-card flat xs12 class="register_t_w">
                        <h4>
                            부가정보
                            <span class="text_color_blue">(선택)</span>
                            <span class="subtitle_sub">
                                <span style="color:red">플랫폼 연동</span> 신청을 위해서 지수방법론과 소급지수를 업로드하세요.
                            </span>
                        </h4>
                        <v-container fluid>
                            <!-- 지수방법론 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>지수방법론</v-subheader>
                                </v-flex>
                                <v-flex xs4>
                                    <input
                                        type="text"
                                        class="upload-name"
                                        id="show_method_file"
                                        v-model="modForm.show_method_file"
                                        disabled
                                    >

                                    <v-layout id="file-drag-drop" ref="methodForm1" class="drag_box">
                                        <v-layout class="jumsun" align-center justify-center column>
                                            <input
                                                type="file"
                                                name="methodFile1"
                                                ref="methodFile1"
                                                style="display:none;"
                                            >

                                            <v-layout justify-space-around>
                                                <v-icon large color="#c9c9c9">cloud_upload</v-icon>
                                            </v-layout>

                                            <v-layout xs12>
                                                <a
                                                    class="drop-files"
                                                    v-on:click="fn_fileClick( 'methodFile' )"
                                                >
                                                    <p
                                                        class="text-xs-center"
                                                    >업로드 할 지수방법론 파일을 드래그 해주세요.</p>
                                                </a>
                                            </v-layout>
                                        </v-layout>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs4>
                                    <label  class="upload-hidden"  v-on:click="fn_fileClick( 'methodFile' )">업로드</label>
                                </v-flex>
                            </v-layout>

                            <!-- 소급지수 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>소급지수</v-subheader>
                                </v-flex>

                                <v-flex xs4 id="file-drag-drop" v-show="!jisuUploadResult" v-if="modForm.status != '03'">
                                    <v-layout flat class="drag_box" ref="fileform1">
                                        <input
                                            type="file"
                                            name="file1"
                                            ref="file1"
                                            style="display:none;"
                                        >

                                        <v-layout class="jumsun" align-center justify-center column>
                                            <v-layout justify-space-around>
                                                <v-icon large color="#c9c9c9">cloud_upload</v-icon>
                                            </v-layout>

                                            <v-layout xs12>
                                                <a
                                                    class="drop-files"
                                                    v-on:click="fn_fileClick( 'file' )"
                                                >
                                                    <p
                                                        class="text-xs-center"
                                                    >업로드 할 소급지수 파일을 드래그 해주세요.</p>
                                                </a>
                                            </v-layout>
                                        </v-layout>
                                    </v-layout>
                                </v-flex>




                                <v-flex xs4 ml-3 v-show="!jisuUploadResult" v-if="modForm.status != '03'">
                                    <p>
                                        <v-icon color="#1976d2">check</v-icon>
                                        <b>허용되는 확장자</b>
                                        <br>
                                        <span class="info_text">xls, xslx, csv</span>
                                    </p>
                                    <p>
                                        <v-icon color="#1976d2">check</v-icon>
                                        <b>양식</b>
                                        <br>
                                        <span class="info_text">date: YYYYMMDD</span>
                                        <br>
                                        <span class="info_text">idx_id: 등록기관의 id체계</span>
                                        <br>
                                        <span class="info_text">price: ####,##</span>
                                    </p>
                                </v-flex>


                                <v-flex mb-3 v-show="!!jisuUploadResult">

                                    <v-flex xs4 class="drag_box_w">
                                        <v-layout flat class="drag_box list">

                                            <table v-bind:id="tableName" class="tbl_type" style="width:100%">
                                                <colgroup>
                                                    <col width="20%">
                                                    <col width="20%">
                                                    <col width="20%">
                                                    <col width="20%">
                                                    <col width="20%">
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th class="txt_left">파일ID</th>
                                                        <th class="txt_center">행번호</th>
                                                        <th class="txt_left">col01</th>
                                                        <th class="txt_left">col02</th>
                                                        <th class="txt_left">col03</th>
                                                    </tr>
                                                </thead>   
                                            </table>
                                        </v-layout>
                                    </v-flex>
                                     <v-flex xs2 class="drag_box_close">
                                        <v-btn icon @click="fn_clearFile()"><v-icon>close</v-icon></v-btn>
                                    </v-flex>
                                </v-flex>

                            </v-layout>

                            <!-- 요청사항 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>요청사항</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-textarea
                                        label="요청사항"
                                        outline
                                        color="blue"
                                        height="80px"
                                        v-model="modForm.req_content"
                                        :rules="[rules.req_content]"

                                        :disabled="modForm.status == '03'"
                                    >
                                    </v-textarea>
                                </v-flex>

                            </v-layout>


                            

                        </v-container>                        
                    </v-card>
                </div>
                <!-- 부가정보 선택 end-->


                <!-- 특정기관과 공유-->
                <div class="register_wrap">
                    <v-card flat xs12 class="register_t_w">
                        <h4>
                            특정 기관과 공유
                            <span class="text_color_blue">(선택)</span>
                        </h4>

                        <v-container fluid>
                            <v-layout v-for="(item, index) in arr_show_inst" :key="index">
                                <v-flex xs3 v-if="Object.keys(item.one).length > 0">
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>{{item.one.inst_name}}</b>
                                    <v-btn
                                        flat
                                        icon
                                        color="#c2c2c2"
                                        @click="fn_deleteInst( item.one )"

                                        v-if="modForm.status != '03'"
                                    >
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3 v-if="Object.keys(item.two).length > 0">
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>{{item.two.inst_name}}</b>
                                    <v-btn
                                        flat
                                        icon
                                        color="#c2c2c2"
                                        @click="fn_deleteInst( item.two )"

                                        v-if="modForm.status != '03'"
                                    >
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3 v-if="Object.keys(item.three).length > 0">
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>{{item.three.inst_name}}</b>
                                    <v-btn
                                        flat
                                        icon
                                        color="#c2c2c2"
                                        @click="fn_deleteInst( item.three )"

                                        v-if="modForm.status != '03'"
                                    >
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3 v-if="Object.keys(item.four).length > 0">
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>{{item.four.inst_name}}</b>
                                    <v-btn
                                        flat
                                        icon
                                        color="#c2c2c2"
                                        @click="fn_deleteInst( item.four )"

                                        v-if="modForm.status != '03'"
                                    >
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>

                            <v-flex xs12 class="add_btn" v-if="modForm.status != '03'">
                                <v-dialog v-model="dialog2" persistent max-width="750">
                                    <template v-slot:activator="{ on }">
                                        <v-btn flat icon color="#888888" dark v-on="on">
                                            <v-icon>add_circle_outline</v-icon>
                                        </v-btn>
                                    </template>

                                    <!-- 특정기관과의 공유 팝업-->
                                    <v-card>
                                        <h5>
                                            <v-card-title ma-0>
                                                특정 기관과 공유
                                                <v-spacer></v-spacer>
                                                <v-btn icon @click="dialog2 = false">
                                                    <v-icon>close</v-icon>
                                                </v-btn>
                                            </v-card-title>
                                        </h5>

                                        <v-container fluid pt-0>
                                            <v-layout row
                                                fill-height
                                                v-for="(item, index) in arr_group_inst" :key="index"
                                                class="IndexRegi_w ver2_xs3"
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selectedInst"
                                                        :label="item.one.inst_name"
                                                        color="primary"
                                                        :value="item.one.inst_cd"
                                                        :id="item.one.inst_cd"
                                                        :key="item.one.inst_cd"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selectedInst"
                                                        :label="item.two.inst_name"
                                                        color="primary"
                                                        :value="item.two.inst_cd"
                                                        :id="item.two.inst_cd"
                                                        :key="item.two.inst_cd"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="selectedInst"
                                                        :label="item.three.inst_name"
                                                        color="primary"
                                                        :value="item.three.inst_cd"
                                                        :id="item.three.inst_cd"
                                                        :key="item.three.inst_cd"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>

                                        <v-card class="pop_btn_w text-xs-center">
                                            <v-btn
                                                depressed
                                                color="primary"
                                                @click="fn_instShare"
                                            >공유하기</v-btn>
                                        </v-card>
                                    </v-card>
                                    <!-- 특정기관과의 공유 팝업 end-->
                                </v-dialog>
                                <b>사용자 추가</b>
                            </v-flex>
                            
                        </v-container>
                    </v-card>
                </div>
                <!-- 특정기관과 공유 end-->

                <div class="text-xs-center">
                    <p class="text_info1" v-if="modForm.status == '03'">
                        <br>
                        <v-icon small>priority_high</v-icon>플랫폼 연동이 완료된 상태이므로 일부 정보에 한해 변경이 가능합니다.
                    </p>
                    <v-btn depressed large color="primary" dark @click="fn_modifyJisu()">저장</v-btn>
                    <v-btn depressed large color="#3158a1" dark v-if="modForm.status == '01'" @click="fn_modifyJisu( '02' )">연동신청</v-btn>
                    <v-btn depressed large color="#9e9e9e" dark v-if="modForm.status != '03'" @click="fn_deleteJisu()">삭제</v-btn>
                </div>
                     
            </v-container>     
        </v-form>

        <ConfirmDialog ref="confirm2" v-show="false"></ConfirmDialog>
    </v-card>
</template>


<script>
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import Config from "@/js/config.js";
import Constant from "@/store/store_constant.js";

var table01 = null;

export default {
    props: [ "editData" ],

    components: {
        ConfirmDialog: ConfirmDialog
    },
    data() {
        return {

            dragAndDropCapable: false,

            menu: false,                /* 기준일 달력 메뉴 */
            dialog: false,
            dialog2: false,         
            
            /* 소급지수 관련 정보 */
            headers: [
                { text: '파일ID'     , value: 'file_id' , align:"center",  sortable: false,},
                { text: '행번호'     , value: 'row_no'  , align:"center",  sortable: false },
                { text: 'col01'     , value: 'col01'    , align:"center",  sortable: false },
                { text: 'col02'     , value: 'col02'    , align:"center",  sortable: false },
                { text: 'col03'     , value: 'col03'    , align:"center",  sortable: false }
            ],
            pagination : {
                rowsPerPage : -1
            },
            tableName : "table01",
            jisuDataList : [],          /* 소급지수 업로드 후 목록정보 */
            jisuUploadResult : false,   /* 소급지수 업로드 결과 여부 */


            /* 모달관련 정보 */
            modal: {
                openYn: false,
                titleConfirmYn: false,
                titleWarningYn: false,
                titleErrorYn: false,

                message: ""
            },

            inst_name : "",

            /* 기관 관련 정보 */
            arr_org_inst : [],          /* (원본) 기관정보 원본 목록정보 */
            arr_group_inst : [],        /* (원본) 3개를 1개로 그룹핑한 기관정보 ( 기관정보 팝업창에 노출 ) */
            arr_show_inst : [],         /* (사용자가 선택) 4개를 1개로 그룹핑한 기관정보 ( 팝업창에서 선택된 기관정보 노출 ) */


            /* 지수 방법론 관련 정보 */
            formData : new FormData(),  /* 지수방법론 파일 선택시 */

            selectedInst : [],
            /* 입력값 관련 정보 */
            modForm: {
                duplCheckResult: false,

                jisu_id: "",
                jisu_kor_nm: "",
                jisu_eng_nm: "",
                jisu_summary: "",
                base_jisu: "",
                base_date: "",
                method_file_id : -1,
                jisu_file_id : -1,
                req_content: "",
                show_method_file : "",
                reg_id : "",
                status : "",
                modStatus : "",

                prev_jisu_id : "",
                prev_mothod_file_id : -1,
                prev_jisu_file_id : -1,
                                
                arr_jisu_inst : [] ,     /* 선택된 기관 정보 */
            },

            /* 저장시 rules 관련 정보 */
            valid: true,
            rules: {
                jisu_kor_nm: [
                    v => !!v || "[지수 한글명] is required",
                    v =>
                        (v && v.length <= 50) ||
                        "[지수 한글명] 50자 까지만 입력가능합니다."
                ],
                jisu_summary: [
                    v => !!v || "[지수 개요] is required",
                    v =>
                        (v && v.length <= 2000) ||
                        "[지수 개요] 2000자 까지만 입력가능합니다."
                ],
                base_jisu: [
                    v => !!v || "[기준 지수] is required",
                    v => /^([0-9]*)[\.]?([0-9]{3})?$/.test( v ) || "[기준지수] 숫자형만 입력가능합니다.(소수점 3자리까지만)",
                    v =>
                        (v && v.toString().length <= 10) ||
                        "[기준 지수] 10자리 이하로 입력해 주세요."
                ],
                base_date: [v => !!v || "[기준일] is required"],
                req_content(value) {
                    if( !value || ( value.length > 0 && value.length <= 2000 ) ) {
                        return true;
                    }

                    return "[요청사항] 2000자리 이하로 입력해 주세요.";
                }
            }
        };
    },

    mounted() {

        // 메시지 박스 참조
        this.$root.$confirm2 = this.$refs.confirm2;

        this.dragAndDropCapable = this.determineDragAndDropCapable();

        if (this.dragAndDropCapable) {
            [
                "drag",
                "dragstart",
                "dragend",
                "dragover",
                "dragenter",
                "dragleave",
                "drop"
            ].forEach(
                function(evt) {
                    this.$refs.fileform1.addEventListener(
                        evt,
                        function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }.bind(this),
                        false
                    );
                }.bind(this)              
            );

            [
                "drag",
                "dragstart",
                "dragend",
                "dragover",
                "dragenter",
                "dragleave",
                "drop"
            ].forEach(
                function(evt) {
                    this.$refs.methodForm1.addEventListener(
                        evt,
                        function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }.bind(this),
                        false
                    );
                }.bind(this)              
            );            

            /* 소급지수 파일 영역 */
            this.$refs.fileform1.addEventListener(
                "drop",
                function(e) {

                    var selfThis    =   this;
                    let file        =   e.dataTransfer.files[0];

                    var typeCd      =   this.$store.state.user.type_cd;

                    if( !( typeCd == "9998" || typeCd == "9999" ) ) {
                        if( typeCd != "0003" ) {

                            this.$emit( 'showMessageBox', '확인','지수사업자만 업로드 하실수 있습니다.',{},1 );
                            return  false;
                        }
                    }                    

                    this.fn_checkFile( file ).then(function (res) {
                            if( !res ) {
                                return  false;
                            }
                            
                            selfThis.fn_jisuFileUpload( file, selfThis );
                        }
                    );

                }.bind(this)
            );

            /* 지수방법론 파일 영역 */
            this.$refs.methodForm1.addEventListener(
                "drop",
                function(e) {
                    var selfThis    =   this;
                    let files       =   e.dataTransfer.files;
                    let file        =   files[0];

                    var typeCd      =   this.$store.state.user.type_cd;

                    if( !( typeCd == "9998" || typeCd == "9999" ) ) {
                        if( typeCd != "0003" ) {

                            this.$emit( 'showMessageBox', '확인','지수사업자만 업로드 하실수 있습니다.',{},1 );
                            return  false;
                        }
                    }                    

                    this.modForm.show_method_file   =   file.name;
                    this.$refs.methodFile1.files    =   files;
                }.bind(this)
            );            
        }

        /* 소급지수 파일 영역 */
        this.$refs.file1.addEventListener(
            "change",
            function(evt) {
                var selfThis    =   this;
                let file        =   this.$refs.file1.files[0];

                var typeCd      =   this.$store.state.user.type_cd;

                if( !( typeCd == "9998" || typeCd == "9999" ) ) {
                    if( typeCd != "0003" ) {

                        this.$emit( 'showMessageBox', '확인','지수사업자만 업로드 하실수 있습니다.',{},1 );
                        return  false;
                    }
                }                

                this.fn_checkFile( file ).then(function (res) {
                        if( !res ) {
                            return  false;
                        }
                        
                        selfThis.fn_jisuFileUpload( file, selfThis );
                    }
                );

                this.$refs.fileform1.addEventListener(
                    evt,
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this),
                    false
                );
            }.bind(this)
        );

        /* 지수방법론 파일 영역 */
        this.$refs.methodFile1.addEventListener(
            "change",
            function(evt) {
                var selfThis    =   this;
                let file        =   this.$refs.methodFile1.files[0];

                var typeCd      =   this.$store.state.user.type_cd;

                if( !( typeCd == "9998" || typeCd == "9999" ) ) {
                    if( typeCd != "0003" ) {

                        this.$emit( 'showMessageBox', '확인','지수사업자만 업로드 하실수 있습니다.',{},1 );
                        return  false;
                    }
                }                

                this.modForm.show_method_file   =   file.name;

                this.$refs.methodForm1.addEventListener(
                    evt,
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this),
                    false
                );
            }.bind(this)
        ); 

        /* 팝업창에 노출할 전체 기관정보 조회 */
        this.fn_getDomainInst();

        /* 테이블 렌더링 */
        table01 =  $("#" + this.tableName ).DataTable({
            processing: true,
            serverSide: false,
            info: false, // control table information display field
            stateSave: false, //restore table state on page reload,
            lengthMenu: [
                [10, 20, 50, -1],
                [10, 20, 50, "All"]
            ],

            select: {
                style: "single",
                selector: "td:first-child"
            },
            "scrollY": '30vh',
            paging: false,
            searching: false,
            data: [],
            ordering: false,
            columnDefs: [
            ],
            columns: [
                { "data": "file_id"     , "orderable" : false , className: "txt_left"   },              /* 파일ID */
                { "data": "row_no"      , "orderable" : false , className: 'txt_center' },              /* 행번호 */
                { "data": "col01"       , "orderable" : false , className: 'txt_right'  },              /* col01 */
                { "data": "col02"       , "orderable" : false , className: 'txt_right'  },              /* col02 */
                { "data": "col03"       , "orderable" : false , className: 'txt_right'  },              /* col03 */
            ]
        });

        this.inst_name   =  this.$store.state.user.inst_name;

        this.$nextTick().then(() => {

            /* 등록된 지수정보 조회 */
            this.fn_getRegistedJisuData();
        });
    },

    methods: {
        /*
         * 이미 등록된 지수ID 가 존재하는지 확인한다.
         * 2019-04-02  bkLove(촤병국)
         */
        async   fn_jisuDuplCheck() {
            var vm = this;
            var regType = /^[A-Za-z0-9+]*$/;
            

            /* 1. 지수 ID 필수 체크 */
            if (!vm.modForm.jisu_id) {

                if( await vm.$root.$confirm2.open(
                            '[지수 ID]',
                            '[지수 ID] is required',
                            {}
                        ,   2
                    )
                ) {
                    vm.$refs.jisu_id.focus();
                    vm.modForm.duplCheckResult = false;
                    return false;
                }
                
            } else if (vm.modForm.jisu_id.length > 10) {

                if( await vm.$root.$confirm2.open(
                            '[지수 ID]',
                            '[지수 ID] 10자리 까지만 입력 가능합니다.',
                            {}
                        ,   1
                    )
                ) {
                    vm.$refs.jisu_id.focus();
                    vm.modForm.duplCheckResult = false;
                    return false;
                }

            } else if (vm.modForm.jisu_id.length < 5) {

                if( await vm.$root.$confirm2.open(
                            '[지수 ID]',
                            '[지수 ID] 5자리 이상 입력해 주세요.',
                            {}
                        ,   1
                    )
                ) {
                    vm.$refs.jisu_id.focus();
                    vm.modForm.duplCheckResult = false;
                    return false;
                }

            } else if( !regType.test( vm.modForm.jisu_id ) ) {

                if( await vm.$root.$confirm2.open(
                            '[지수 ID]',
                            '[지수 ID] 숫자와 영문자만 가능합니다.',
                            {}
                        ,   1

                    )
                ) {
                    vm.$refs.jisu_id.focus();
                    vm.modForm.duplCheckResult = false;
                    return false;
                }

            }

            /* 2. 지수 ID 중복 체크 */
            axios.post(Config.base_url + "/user/index/getJisuDuplCheck", {
                data: { jisu_id: this.modForm.jisu_id }
            }).then( async function(response) {
                if (response && response.data) {
                    if (response.data.result == true) {

                        if( await vm.$root.$confirm2.open(
                                    '[지수 ID]',
                                    '[지수 ID] 이미 존재합니다.',
                                    {}
                                ,   1
                            )
                        ) {
                            vm.$refs.jisu_id.focus();
                            vm.modForm.duplCheckResult = false;
                            return false;
                        }

                    } else {

                        if( await vm.$root.$confirm2.open(
                                    '[지수 ID]',
                                    '[지수 ID] 사용 가능합니다.',
                                    {}
                                ,   1
                            )
                        ) {
                            vm.modForm.duplCheckResult = true;
                            return false;
                        }
                    }
                }
            });
        },

        /*
         * 저장 버튼 클릭시
         * 2019-04-02  bkLove(촤병국)
         */
        async   fn_modifyJisu( modStatus ) {
            var vm = this;

            var msgTitle = "";

            var typeCd  =   vm.$store.state.user.type_cd;

            if( !( typeCd == "9998" || typeCd == "9999" ) ) {
                if( typeCd != "0003" ) {

                    vm.$emit( 'showMessageBox', '확인','지수사업자만 수정 하실수 있습니다.',{},1 );
                    return  false;
                }
            }

            // 선택된 공유 기관 바인딩 
            vm.modForm.arr_jisu_inst = vm.selectedInst;

            /* 연동완료 상태가 아닌 경우에만 form 을 체크한다. */
            if( this.modForm.status != "03" ) {

                if (!this.modForm.duplCheckResult) {

                    if( await this.$root.$confirm2.open(
                                '[지수 ID]',
                                '[지수 ID] 중복확인을 해주세요.',
                                {}
                            ,   1
                        )
                    ) {
                        this.$refs.jisu_id.focus();

                        return false;
                    }
                }

                if (!this.$refs.modForm.validate()) {
                    return false;
                }
            }

            /* [연동신청] 또는 [연동신청] 완료된 상태인 경우 */
            if( modStatus || this.modForm.status == "02"  ) {

                if( modStatus ) {
                    this.modForm.modStatus = modStatus;

                    msgTitle = "[연동신청] 요청시 ";
                }else if( this.modForm.status == "02" ) {
                    msgTitle = "연동신청된 상태입니다.";
                }


                if( !this.modForm.show_method_file ) {

                    if( await this.$root.$confirm2.open(
                                '[지수방법론]',
                                msgTitle + " 지수방법론을 필수로 업로드 해주세요.",
                                {}
                            ,   1
                        )
                    ) {
                        return false;
                    }
                }

                if( this.modForm.jisu_file_id == -1 ) {

                    if( await this.$root.$confirm2.open(
                                '[소급지수]',
                                msgTitle + " 소급지수를 필수로 업로드 해주세요.",
                                {}
                            ,   1
                        )
                    ) {
                        return false;
                    }
                }
            }
            
            if( modStatus ) {
                msgTitle = "[연동 신청] 하시겠습니까?";
            }else{
                msgTitle = "[지수 수정] 하시겠습니까?";
            }


            if( await this.$root.$confirm2.open(
                        '[지수 수정]',
                        msgTitle,
                        {}
                    ,   2
                )
            ) {
                if( "Y" != this.$root.$confirm2.val ) {
                    return false;
                }
            }             

            this.formData = new FormData();
            this.formData.append( "files", this.$refs.methodFile1.files[0] );
            this.formData.append( "data", JSON.stringify(this.modForm) );

            vm.$emit( "fn_showProgress", true );
            axios.post(
                Config.base_url + "/user/index/modifyJisu",
                this.formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }).then( async function(response) {

                    vm.$emit( "fn_showProgress", false );
                    if( response.data ) {

                        var resultData = response.data;

                        if( await vm.$root.$confirm2.open(
                                    ''
                                ,   resultData.msg
                                ,   {}
                                ,   1
                            )
                        ) {
                        }

                        if( resultData.result ) {
                            vm.$emit( "fn_refresh", { 'jisu_id' : resultData.jisu_id, 'jisu_seq' : resultData.jisu_seq  } );
                        }
                    }
                }).catch(error => {
                    vm.$emit( "fn_showProgress", false );
                    vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
                });
        },


        async   fn_deleteJisu() {
            var vm = this;

            var typeCd  =   vm.$store.state.user.type_cd;

            if( !( typeCd == "9998" || typeCd == "9999" ) ) {
                if( typeCd != "0003" ) {

                    vm.$emit( 'showMessageBox', '확인','지수사업자만 삭제 하실수 있습니다.',{},1 );
                    return  false;
                }
            }

            if( await this.$root.$confirm2.open(
                        '[지수 삭제]',
                        '삭제하시겠습니까?',
                        {}
                    ,   2
                )
            ) {
                if( "Y" != this.$root.$confirm2.val ) {
                    return false;
                }
            } 

            axios.post(
                Config.base_url + "/user/index/deleteJisu",
                { data : this.modForm }
            ).then( async function(response) {
                if( response.data ) {

                    var resultData = response.data;


                    if( await vm.$root.$confirm2.open(
                                ''
                            ,   resultData.msg
                            ,   {}
                            ,   1
                        )
                    ) {
                    }

                    if( resultData.result ) {
                        vm.$emit( "fn_refresh" );
                    }
                }
            });
        },
        

        determineDragAndDropCapable() {

            var div = document.createElement("div");

            return (
                ("draggable" in div ||
                    ("ondragstart" in div && "ondrop" in div)) &&
                "FormData" in window &&
                "FileReader" in window
            );
        },

        /*
         * 파일 선택시
         * 2019-04-02  bkLove(촤병국)
         */
        fn_fileClick: function( gubun ) {

            /* 소급지수 파일 클릭시 */
            if( gubun == "file" ) {
                this.$refs.file1.click();
            }
            /* 지수 방법론 파일 클릭시 */
            else{
                this.$refs.methodFile1.click();
            }
        },

        /*
         * 소급지수 파일 초기화 버튼 클릭시
         * 2019-04-02  bkLove(촤병국)
         */
        fn_clearFile : function() {
            var vm = this;

            vm.jisuUploadResult         =   false;
            
            vm.modForm.jisu_file_id     =   -1;
            vm.$refs.file1.value         =   null;
        },

        /*
         * 엑셀 유형인지 파일을 체크한다.
         * 2019-04-02  bkLove(촤병국)
         */
        async   fn_checkFile( file ) {

            var fileLen = file.name.length;
            var lastDot = file.name.lastIndexOf(".");

            /* 1. 확장자가 존재하지 않는지 확인 */
            if (lastDot == -1) {

                if( await this.$root.$confirm2.open(
                            '[엑셀파일 유형확인]',
                            "엑셀유형의 파일인지 확인 해 주세요.",
                            {}
                        ,   1
                    )
                ) {
                    return  false;
                }
            }

            var fileExt     =   file.name.substring(lastDot + 1, fileLen).toLowerCase();
            var allowExt    =   ["xls", "xlsx", "csv"];

            /* 2. 허용되는 확장자에 포함되는지 확인 */
            if (!allowExt.includes(fileExt)) {

                if( await this.$root.$confirm2.open(
                            '[엑셀파일 유형확인]',
                            "엑셀유형의 파일인지 확인 해 주세요.",
                            {}
                        ,   1
                    )
                ) {
                    return  false;
                }

            }

            return  true;
        },

        /*
         * 소급지수 파일을 업로드한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_jisuFileUpload : function( file, selfThis ){
            var vm = this;

            let formData = new FormData();
            formData.append("files", file);

            if( table01 ) {
                table01.clear().draw();
            }                  

            vm.$emit( "fn_showProgress", true );
            axios.post(
                Config.base_url + "/user/index/fileuploadSingle",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            ).then( async function(response) {
                console.log( response );

                vm.$emit( "fn_showProgress", false );
                if( response.data ) {
                    selfThis.jisuUploadResult = response.data.result;
                    
                    if( !response.data.result ) {

                        if( await selfThis.$root.$confirm2.open(
                                    ''
                                ,   response.data.msg
                                ,   {}
                                ,   1
                            )
                        ) {
                            return false;
                        }
                    }

                    if( response.data.result ) {
                        selfThis.modForm.jisu_file_id = response.data.jisu_file_id;
                        selfThis.jisuDataList = response.data.dataList;

                        if( table01 ) {
                            table01.rows.add( selfThis.jisuDataList ).draw();                        
                        }                        
                    }
                }

            }).catch(error => {
                vm.$emit( "fn_showProgress", false );
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        },

        /*
         * 팝업창에 노출할 전체 기관정보 조회를 조회한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_getDomainInst() {
            var selfThis = this;

            /* 1. 기관정보를 조회한다. */
            axios.post(Config.base_url + "/user/index/getDomainInst", {
                data: {}
            }).then(function(response) {
                if (response && response.data) {
                    selfThis.arr_group_inst = response.data.dataGroupList;
                    selfThis.arr_org_inst = response.data.dataList;
                }
            });
        },

        /*
         * 팝업창에서 선택된 기관정보를 화면에 노출한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_instShare() {
            this.dialog2 = false;

         
            var  dataList = [];
            for( var i=0, inx=0; i < this.selectedInst.length; i=i+4 ) {
                var data    =   this.selectedInst[i];
                var groupData = {};

                groupData.one = this.fn_getInstName( data );

                groupData.two = {};
                if( i+1 < this.selectedInst.length ) {
                    data = this.selectedInst[i+1];
                    groupData.two   =   this.fn_getInstName( data );
                }

                groupData.three = {};
                if( i+2 < this.selectedInst.length ) {
                    data = this.selectedInst[i+2];
                    groupData.three =   this.fn_getInstName( data );
                }

                groupData.four = {};
                if( i+3 < this.selectedInst.length ) {
                    data = this.selectedInst[i+3];
                    groupData.four =   this.fn_getInstName( data );
                }                

                dataList[inx++] = groupData;
            }

            this.arr_show_inst = dataList;
        },

        /*
         * 선택된 기관코드에 대한 기관코드명을 반환한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_getInstName( instCd ) {
            
            var returnData = {};
            if( this.arr_org_inst && this.arr_org_inst.length > 0 ) {
                for( var i=0; i < this.arr_org_inst.length; i++ ) {
                    var data = this.arr_org_inst[i];

                    if( data.inst_cd == instCd ) {
                        returnData = data;
                        break;
                    }
                }
            }

            return returnData;
        },

        /*
         * 선택한 기관 정보를 삭제한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_deleteInst( item ) {

            var   arrTemp = [];
            for( var i=this.selectedInst.length-1; i >= 0 ; i-- ) {
                var data = this.selectedInst[i];

                if( data == item.inst_cd ) {
                    continue;
                }

                arrTemp.push( data );
            }

            this.selectedInst =   arrTemp;
            this.fn_instShare();
        },

        fn_checkedData( item ) {            
            console.log( item );
/*
            var inx = this.modForm.arr_jisu_inst.indexOf( item );
            if( inx != -1 ) {
                this.modForm.arr_jisu_inst.slice( inx, 1);
            }
            this.modForm.arr_jisu_inst.push( item );     
*/              
        },

        /*
         * 등록된 지수정보를 조회한다.
         * 2019-04-11  bkLove(촤병국)
         */        
        fn_getRegistedJisuData() {

            var selfThis = this;

            if( table01 ) {
                table01.clear().draw();
            }            

            selfThis.$emit( "fn_showProgress", true );
            axios.post(Config.base_url + "/user/index/getRegistedJisuData", {
                data: selfThis.editData
            }).then(function(response) {

                selfThis.$emit( "fn_showProgress", false );
                if (response && response.data) {
                    if( response.data.jisuInfo ) {
                        selfThis.modForm = response.data.jisuInfo;
                        selfThis.modForm.duplCheckResult    =   true;
                    }

                    selfThis.modForm.arr_jisu_inst          =   [];
                    selfThis.selectedInst          =   [];
                    if( response.data.arr_jisu_inst && response.data.arr_jisu_inst.length > 0 ) {
                        selfThis.modForm.arr_jisu_inst      =   response.data.arr_jisu_inst;    // 선택된 기관 정보 
                        selfThis.selectedInst = response.data.arr_jisu_inst;
                    }

                    selfThis.modForm.arr_show_inst          =   [];
                    if( response.data.arr_show_inst && response.data.arr_show_inst.length > 0 ) {
                        selfThis.arr_show_inst              =   response.data.arr_show_inst;    /* (사용자가 선택) 4개를 1개로 그룹핑한 기관정보 ( 팝업창에서 선택된 기관정보 노출 ) */
                    }

                    selfThis.modForm.jisuDataList           =   [];
                    if( response.data.jisuDataList && response.data.jisuDataList.length > 0 ) {
                        selfThis.jisuDataList               =   response.data.jisuDataList;     /* 소급지수 업로드 후 목록정보 */
                        selfThis.jisuUploadResult           =   true;                           /* 소급지수 업로드 결과 여부 */

                        if( table01 ) {
                            table01.rows.add( selfThis.jisuDataList ).draw();                        
                        }
                    }
                }
            }).catch(error => {
                selfThis.$emit( "fn_showProgress", false );
                selfThis.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        }
    }
};
</script>






