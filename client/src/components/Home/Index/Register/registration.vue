<template>
    <v-card flat xs12>
        <v-form ref="form" v-model="valid" lazy-validation>
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
                                <v-flex xs4 mt-3 mb-2>
                                    <span class="text_color_blue">dbfn</span>
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
                                        v-model="form.jisu_id"
                                        :rules="rules.jisu_id"
                                        @keyup="form.duplCheckResult=false"
                                    ></v-text-field>
                                </v-flex>

                                <v-flex xs4 class="text-xs-left">
                                    <v-layout row>
                                        <!-- 중복확인-->
                                        <v-dialog v-model="dialog" persistent max-width="350">
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    small
                                                    depressed
                                                    color="primary"
                                                    dark
                                                    @click="fn_jisuDuplCheck"
                                                >중복확인</v-btn>
                                            </template>
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
                                        v-model="form.jisu_kor_nm"
                                        :rules="rules.jisu_kor_nm"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                            <!-- 지수개요 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>지수개요</v-subheader>
                                </v-flex>

                                <v-flex xs10>
                                    <v-textarea
                                        label="지수개요"
                                        outline
                                        color="blue"
                                        v-model="form.jisu_summary"
                                        :rules="rules.jisu_summary"
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
                                        v-model="form.base_jisu"
                                        :rules="rules.base_jisu"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                            <!-- 기준일 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>기준일</v-subheader>
                                </v-flex>

                                <v-flex xs4>
                                    <!--달력-->
                                    <v-layout row wrap>
                                        <v-flex xs12 sm6 md6>
                                            
                                            <v-menu
                                                ref="menu"
                                                v-model="menu"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="form.base_date"
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
                                                        readonly
                                                        outline
                                                        v-on="on"
                                                        widh="100%"
                                                        v-model="form.base_date"
                                                        :rules="rules.base_date"
                                                    ></v-text-field>
                                                </template>

                                                <v-date-picker
                                                    v-model="form.base_date"
                                                    no-title
                                                    scrollable
                                                >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                        flat
                                                        color="primary"
                                                        @click="menu = false"
                                                    >Cancel</v-btn>
                                                    <v-btn
                                                        flat
                                                        color="primary"
                                                        @click="$refs.menu.save(form.base_date)"
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

                <!---부가정보 선택-->
                <div class="register_wrap">
                    <v-card flat xs12 class="register_t_w">
                        <h4>
                            부가정보
                            <span class="text_color_blue">(선택)</span>
                        </h4>

                        <v-container fluid>
                            <!-- 지수방법론 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>지수방법론</v-subheader>
                                </v-flex>                              

                                <v-flex xs4>
                                    <input type='text' class='upload-name' id='showMethodFile' v-model="showMethodFile" disabled />

                                    <v-layout id="file-drag-drop"  ref="methodForm" class="drag_box">
                                        <input type="file" name="methodFile" ref="methodFile" style="display:none;">

                                        <v-layout class="jumsun" align-center justify-center column>
                                            <v-layout justify-space-around>
                                                <v-icon large color="#c9c9c9">cloud_upload</v-icon>
                                            </v-layout>

                                            <v-layout xs12>
                                                <a class="drop-files" v-on:click="file_click( 'methodFile' )">
                                                    <p
                                                        class="text-xs-center"
                                                    >업로드 할 지수방법론 파일을 드래그 해주세요.</p>
                                                </a>
                                            </v-layout>
                                        </v-layout>                                        
                                    </v-layout>
                                </v-flex>

                            </v-layout>

                            <!-- 소급지수 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>소급지수</v-subheader>
                                </v-flex>

                                <v-flex xs4 id="file-drag-drop" v-show="!jisuUploadResult">
                                    <v-layout flat class="drag_box" ref="fileform">
                                        <input type="file" name="file" ref="file" style="display:none;">

                                        <v-layout class="jumsun" align-center justify-center column>
                                            <v-layout justify-space-around>
                                                <v-icon large color="#c9c9c9">cloud_upload</v-icon>
                                            </v-layout>

                                            <v-layout xs12>
                                                <a class="drop-files" v-on:click="file_click( 'file' )">
                                                    <p
                                                        class="text-xs-center"
                                                    >업로드 할 소급지수 파일을 드래그 해주세요.</p>
                                                </a>
                                            </v-layout>
                                        </v-layout>
                                    </v-layout>
                                </v-flex>


                                <v-flex xs4 ml-3 v-show="!jisuUploadResult">
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

                                    <v-flex>
                                        <v-btn @click="jisuUploadResult = false;form.jisu_file_id='';">X</v-btn>
                                    </v-flex>

                                    <v-data-table
                                        :headers="headers"
                                        :items="jisuDataList"
                                        :pagination.sync="pagination"
                                        class="elevation-1"
                                    >
                                        <template v-slot:items="props">
                                            <td class="text-xs-center">{{ props.item.file_id }}</td>
                                            <td class="text-xs-center">{{ props.item.row_no }}</td>
                                            <td class="text-xs-left">{{ props.item.col01 }}</td>
                                            <td class="text-xs-leftt">{{ props.item.col02 }}</td>
                                            <td class="text-xs-left">{{ props.item.col03 }}</td>
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-layout>

                            <!-- 요청사항 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>요청사항</v-subheader>
                                </v-flex>

                                <v-flex xs10>
                                    <v-textarea outline color="blue" height="80px"  v-model="form.req_content" :rules="[rules.req_content]">
                                        <template v-slot:label>
                                            <div>
                                                Bio
                                                <small>(optional)</small>
                                            </div>
                                        </template>
                                    </v-textarea>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </div>
                <!---부가정보 선택 end-->

                <!---특정기관과 공유-->
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
                                    <v-btn flat icon color="#c2c2c2" @click="fn_deleteInst( item.one )">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3 v-if="Object.keys(item.two).length > 0">
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>{{item.two.inst_name}}</b>
                                    <v-btn flat icon color="#c2c2c2" @click="fn_deleteInst( item.two )">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3 v-if="Object.keys(item.three).length > 0">
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>{{item.three.inst_name}}</b>
                                    <v-btn flat icon color="#c2c2c2" @click="fn_deleteInst( item.three )">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3 v-if="Object.keys(item.four).length > 0">
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>{{item.four.inst_name}}</b>
                                    <v-btn flat icon color="#c2c2c2" @click="fn_deleteInst( item.four )">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>

                            <v-flex xs12 class="add_btn">
                                <v-dialog v-model="dialog2" persistent max-width="700">
                                    <template v-slot:activator="{ on }">
                                        <v-btn flat icon color="#888888" dark v-on="on">
                                            <v-icon>add_circle_outline</v-icon>
                                        </v-btn>
                                    </template>

                                    <!---특정기관과의 공유 팝업-->
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
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height

                                                v-for="(item, index) in arr_group_inst" :key="index"
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="form.arr_jisu_inst"
                                                        :label="item.one.inst_name"
                                                        color="primary"
                                                        :value="item.one.inst_cd"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="form.arr_jisu_inst"
                                                        :label="item.two.inst_name"
                                                        color="primary"
                                                        :value="item.two.inst_cd"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="form.arr_jisu_inst"
                                                        :label="item.three.inst_name"
                                                        color="primary"
                                                        :value="item.three.inst_cd"
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
                                    <!---특정기관과의 공유 팝업 end-->
                                </v-dialog>
                                <b>사용자 추가</b>
                            </v-flex>
                        </v-container>
                    </v-card>
                </div>

                <!---특정기관과 공유 end-->
                <div class="text-xs-center">
                    <v-btn depressed large color="#3158a1" dark @click="this.fn_registerJisu">등록</v-btn>
                </div>
            </v-container>
        </v-form>
    </v-card>
</template>


<script>
import Config from "@/js/config.js";

export default {
    data: () => {
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
                rowsPerPage : 5
            },
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

            /* 기관 관련 정보 */
            arr_org_inst : [],          /* (원본) 기관정보 원본 목록정보 */
            arr_group_inst : [],        /* (원본) 3개를 1개로 그룹핑한 기관정보 ( 기관정보 팝업창에 노출 ) */
            arr_show_inst : [],         /* (사용자가 선택) 4개를 1개로 그룹핑한 기관정보 ( 팝업창에서 선택된 기관정보 노출 ) */


            /* 지수 방법론 관련 정보 */
            formData : new FormData(),  /* 지수방법론 파일 선택시 */
            showMethodFile : "",        /* 지수방법론 파일명 */


            /* 입력값 관련 정보 */
            form: {
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

                arr_jisu_inst : []      /* 선택된 기관 정보 */
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
                        (v && v.length <= 10) ||
                        "[기준 지수]] 10자리 이하로 입력해 주세요."
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

    created() {

        /*
         * indexRegisterMain -> 신규지수등록 버튼 클릭시 이벤트를 수신한다.
         * 2019-04-10  bkLove(촤병국)
         */
        this.$EventBus.$on( "indexRegisterMain_registration_call", res => {

            var vm  = this;

            console.log( ">> registration val=[" + res + "]");

            switch( res ) {
                case    "clear" :

                        vm.$refs.form.reset();

                        vm.formData                 =   new FormData(); /* 지수방법론 파일 선택시 */
                        vm.$refs.methodFile.value   =   null;           /* 지수방법론 파일정보 */
                        vm.showMethodFile           =   null;           /* 지수방법론 파일명 */

                        vm.form.duplCheckResult     =   false;
                        vm.method_file_id           =   -1;
                        vm.jisu_file_id             =   -1;
                        vm.arr_jisu_inst            =   [];             /* 선택된 기관 정보 */
                        vm.arr_show_inst            =   [];             /* (사용자가 선택) 4개를 1개로 그룹핑한 기관정보 ( 팝업창에서 선택된 기관정보 노출 ) */

                        vm.jisuDataList             =   [];             /* 소급지수 업로드 후 목록정보 */
                        vm.jisuUploadResult         =   false;          /* 소급지수 업로드 결과 여부 */
                        vm.$refs.file.value         =   null;           /* 수급지수 파일정보 */

                        vm.form.req_content         =   "";             /* 요청사항 */

                        vm.pagination.rowsPerPage   =   5;

                        break;
            }     
        })
    },


    beforeDestory : function() {

        /*
         * indexRegisterMain -> 신규지수등록 버튼 클릭시 이벤트를 제거한다.
         * 2019-04-10  bkLove(촤병국)
         */
        this.$EventBus.$off("indexRegisterMain_registration_call");
    },


    mounted() {

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
                    this.$refs.fileform.addEventListener(
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
                    this.$refs.methodForm.addEventListener(
                        evt,
                        function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }.bind(this),
                        false
                    );
                }.bind(this)              
            );            

            this.$refs.fileform.addEventListener(
                "drop",
                function(e) {

                    var selfThis    =   this;
                    let file        =   e.dataTransfer.files[0];

                    if( !this.fn_checkFile( file ) ) {
                        return  false;
                    }

                    this.fn_jisuFileUpload( file, selfThis );

                }.bind(this)
            );

            this.$refs.methodForm.addEventListener(
                "drop",
                function(e) {
                    var selfThis    =   this;
                    let file        =   e.dataTransfer.files[0];

                    this.showMethodFile = file.name;

                }.bind(this)
            );            
        }

        /* file input에서 선택된 파일이 있으면 이벤트 실행 */
        this.$refs.file.addEventListener(
            "change",
            function(evt) {
                var selfThis    =   this;
                let file        =   this.$refs.file.files[0];

                if( !this.fn_checkFile( file ) ) {
                    return  false;
                }

                this.fn_jisuFileUpload( file, selfThis );

                this.$refs.fileform.addEventListener(
                    evt,
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this),
                    false
                );
            }.bind(this)
        );

        /* file input에서 선택된 파일이 있으면 이벤트 실행 */
        this.$refs.methodFile.addEventListener(
            "change",
            function(evt) {
                var selfThis    =   this;
                let file        =   this.$refs.methodFile.files[0];

                this.showMethodFile = file.name;

                this.$refs.methodForm.addEventListener(
                    evt,
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this),
                    false
                );
            }.bind(this)
        ); 

        this.fn_getDomainInst();
    },

    methods: {
        /*
         * 이미 등록된 지수ID 가 존재하는지 확인한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_jisuDuplCheck() {
            var vm = this;
            var regType = /^[A-Za-z0-9+]*$/;

            /* 1. 지수 ID 필수 체크 */
            if (!this.form.jisu_id) {
                alert("[지수 ID] is required");
                this.$refs.jisu_id.focus();
                vm.form.duplCheckResult = false;

                return false;
            } else if (this.form.jisu_id.length > 10) {
                alert("[기준 ID] 10자리 까지만 입력 가능합니다.");
                this.$refs.jisu_id.focus();
                vm.form.duplCheckResult = false;

                return false;
            } else if (this.form.jisu_id.length < 5) {
                alert("[기준 ID] 5자리 이상 입력해 주세요.");
                this.$refs.jisu_id.focus();
                vm.form.duplCheckResult = false;

                return false;
            } else if( !regType.test( this.form.jisu_id ) ) {
                alert("[기준 ID] 숫자와 영문자만 가능합니다.");
                this.$refs.jisu_id.focus();
                vm.form.duplCheckResult = false;

                return false;
            }

            /* 2. 지수 ID 중복 체크 */
            axios.post(Config.base_url + "/user/index/getJisuDuplCheck", {
                data: { jisu_id: this.form.jisu_id }
            }).then(function(response) {
                if (response && response.data) {
                    if (response.data.result == true) {
                        alert("해당 [지수 ID] 는 이미 존재합니다.");
                        vm.form.duplCheckResult = false;
                    } else {
                        alert("해당 [지수 ID] 는 사용 가능합니다.");
                        vm.form.duplCheckResult = true;
                    }
                }
            });
        },

        /*
         * 등록 버튼 클릭시
         * 2019-04-02  bkLove(촤병국)
         */
        fn_registerJisu() {
            var vm = this;

            if (!this.form.duplCheckResult) {
                alert("[지수 ID] 중복확인을 해주세요.");
                this.$refs.jisu_id.focus();

                return false;
            }

            if (!this.$refs.form.validate()) {
                return false;
            }


            this.formData = new FormData();
            this.formData.append( "files", this.$refs.methodFile.files[0] );
            this.formData.append( "data", JSON.stringify(this.form) );

            axios.post(
                Config.base_url + "/user/index/registerJisu",
                this.formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }).then(function(response) {
                    if( response.data ) {

                        var resultData = response.data;

                        alert( resultData.msg );
                        if( resultData.result ) {
                            vm.$router.push( "/index/manage" );
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
        file_click: function( gubun ) {

            if( gubun == "file" ) {
                this.$refs.file.click();
            }else{
                this.$refs.methodFile.click();
            }
        },

        /*
         * 엑셀 유형인지 파일을 체크한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_checkFile : function( file ) {

            var fileLen = file.name.length;
            var lastDot = file.name.lastIndexOf(".");

            /* 1. 확장자가 존재하지 않는지 확인 */
            if (lastDot == -1) {
                alert("엑셀유형의 파일인지 확인 해 주세요.");
                return false;
            }

            var fileExt     =   file.name.substring(lastDot + 1, fileLen).toLowerCase();
            var allowExt    =   ["xls", "xlsx", "csv"];

            /* 2. 허용되는 확장자에 포함되는지 확인 */
            if (!allowExt.includes(fileExt)) {
                alert("엑셀유형의 파일인지 확인 해 주세요.");
                return false;
            }

            return  true;    
        },

        /*
         * 소급지수 파일을 업로드한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_jisuFileUpload : function( file, selfThis ){

            let formData = new FormData();
            formData.append("files", file);
            
            axios.post(
                Config.base_url + "/user/index/fileuploadSingle",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            ).then(function(response) {
                console.log( response );

                if( response.data ) {
                    selfThis.jisuUploadResult = response.data.result;
                    
                    if( !response.data.result ) {
                        alert( response.data.msg );

                        return false;
                    }

                    if( response.data.result ) {
                        selfThis.form.jisu_file_id = response.data.jisu_file_id;
                        selfThis.jisuDataList = response.data.dataList;
                    }
                }

            }).catch(function(response) {
                console.log( response );
            });    
        },

        /*
         * 기관정보를 조회한다.
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
            for( var i=0, inx=0; i < this.form.arr_jisu_inst.length; i=i+4 ) {
                var data    =   this.form.arr_jisu_inst[i];
                var groupData = {};

                groupData.one = this.fn_getInstName( data );

                groupData.two = {};
                if( i+1 < this.form.arr_jisu_inst.length ) {
                    data = this.form.arr_jisu_inst[i+1];
                    groupData.two   =   this.fn_getInstName( data );
                }

                groupData.three = {};
                if( i+2 < this.form.arr_jisu_inst.length ) {
                    data = this.form.arr_jisu_inst[i+2];
                    groupData.three =   this.fn_getInstName( data );
                }

                groupData.four = {};
                if( i+3 < this.form.arr_jisu_inst.length ) {
                    data = this.form.arr_jisu_inst[i+3];
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
            for( var i=this.form.arr_jisu_inst.length-1; i >= 0 ; i-- ) {
                var data = this.form.arr_jisu_inst[i];

                if( data == item.inst_cd ) {
                    continue;
                }

                arrTemp.push( data );
            }

            this.form.arr_jisu_inst =   arrTemp;
            this.fn_instShare();
        }      
    }
};
</script>






