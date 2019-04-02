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
                                    <input
                                        type="text"
                                        class="upload-name"
                                        id="upload-name"
                                        disabled
                                    >
                                    <!--v-text-field
                    file
                    label=""
                    value="dbfn"
                    outline
                    readonly
                    append-icon="create_new_folder"
                                    ></v-text-field-->
                                </v-flex>

                                <v-flex xs4>
                                    <label for="upload" class="upload-hidden">업로드</label>
                                    <input type="file" id="upload" name="upload">
                                </v-flex>
                            </v-layout>

                            <!-- 소급지수 -->
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>소급지수</v-subheader>
                                </v-flex>

                                <v-flex xs4 id="file-drag-drop">
                                    <v-layout flat class="drag_box" ref="fileform">
                                        <v-layout class="jumsun" align-center justify-center column>
                                            <v-layout justify-space-around>
                                                <v-icon large color="#c9c9c9">cloud_upload</v-icon>
                                            </v-layout>

                                            <v-layout xs12>
                                                <p class="text-xs-center">업로드 할 소급지수 파일을 드래그 해주세요.</p>
                                            </v-layout>
                                        </v-layout>
                                    </v-layout>
                                </v-flex>

                                <v-flex xs4 ml-3>
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

                                <v-flex>
                                    <v-data-table
                                        :headers="headers"
                                        :items="desserts"
                                        class="elevation-1"
                                    >
                                        <template v-slot:items="props">
                                            <td>{{ props.item.name }}</td>
                                            <td class="text-xs-right">{{ props.item.calories }}</td>
                                            <td class="text-xs-right">{{ props.item.fat }}</td>
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
                                    <v-textarea outline color="blue" height="80px">
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
                            <v-layout>
                                <v-flex xs3>
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>삼성자산운용</b>
                                    <v-btn flat icon color="#c2c2c2">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3>
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>미래에셋자산운용</b>
                                    <v-btn flat icon color="#c2c2c2">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3>
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>KB자산운용</b>
                                    <v-btn flat icon color="#c2c2c2">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3>
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>한국투자신탁</b>
                                    <v-btn flat icon color="#c2c2c2">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>

                            <v-layout>
                                <v-flex xs3>
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>삼성자산운용</b>
                                    <v-btn flat icon color="#c2c2c2">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3>
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>미래에셋자산운용</b>
                                    <v-btn flat icon color="#c2c2c2">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3>
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>KB자산운용</b>
                                    <v-btn flat icon color="#c2c2c2">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs3>
                                    <v-icon color="#1976d2">near_me</v-icon>
                                    <b>한국투자신탁</b>
                                    <v-btn flat icon color="#c2c2c2">
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
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="삼성자산운용"
                                                        color="primary"
                                                        value="삼성자산운용"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="미래에셋자산운용"
                                                        color="primary"
                                                        value="미래에셋자산운용"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="KB자산운용"
                                                        color="primary"
                                                        value="KB자산운용"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="한국투자신탁"
                                                        color="primary"
                                                        value="한국투자신탁"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="키움자산운용"
                                                        color="primary"
                                                        value="키움자산운용"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="교보악사자산운용"
                                                        color="primary"
                                                        value="교보악사자산운용"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="삼성증권"
                                                        color="primary"
                                                        value="삼성증권"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="대신증권"
                                                        color="primary"
                                                        value="대신증권"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="NH투자증권"
                                                        color="primary"
                                                        value="NH투자증권"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout
                                                align-center
                                                justify-space-around
                                                row
                                                fill-height
                                            >
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="미래에셋대우"
                                                        color="primary"
                                                        value="미래에셋대우"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="예탁결제원"
                                                        color="primary"
                                                        value="예탁결제원"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-checkbox
                                                        v-model="ex4"
                                                        label="KRX"
                                                        color="primary"
                                                        value="KRX"
                                                        hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>

                                        <v-card class="pop_btn_w text-xs-center">
                                            <v-btn
                                                depressed
                                                color="primary"
                                                @click="dialog2 = false"
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
                    <v-btn depressed large color="#3158a1" dark @click="this.fn_save">등록</v-btn>
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
            valid: true,

            dragAndDropCapable: false,
            files: [],
            file: "",
            uploadPercentage: 0,
            desserts : [],
            headers : [],

            //            , date: new Date().toISOString().substr(0, 10)
            menu: false,
            dialog: false,
            dialog2: false,
            ex4: null,
            form: {
                duplCheckResult: false,

                jisu_id: "",
                jisu_kor_nm: "",
                jisu_eng_nm: "",
                jisu_summary: "",
                base_jisu: "",
                base_date: "",
                req_content: ""
            },
            rules: {
                jisu_kor_nm: [
                    v => !!v || "[지수 한글명] is required",
                    v =>
                        (v && v.length <= 50) ||
                        "[지수 한글명] must be less than 50 characters"
                ],
                jisu_summary: [
                    v => !!v || "[지수 개요] is required",
                    v =>
                        (v && v.length <= 2000) ||
                        "[지수 개요] must be less than 2000 characters"
                ],
                base_jisu: [
                    v => !!v || "[기준 지수] is required",
                    v =>
                        (v && v.length <= 17) ||
                        "[기준 지수]] must be less than 17 characters"
                ],
                base_date: [v => !!v || "[기준일] is required"]
            }
        };
    },

    mounted() {
        /*
        Determine if drag and drop functionality is capable in the browser
      */
        this.dragAndDropCapable = this.determineDragAndDropCapable();

        /*
        If drag and drop capable, then we continue to bind events to our elements.
      */
        if (this.dragAndDropCapable) {
            /*
          Listen to all of the drag events and bind an event listener to each
          for the fileform.
        */
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
                    /*
            For each event add an event listener that prevents the default action
            (opening the file in the browser) and stop the propagation of the event (so
            no other elements open the file in the browser)
          */
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

            this.$refs.fileform.addEventListener(
                "drop",
                function(e) {
                    let formData = new FormData();
                    formData.append("files", e.dataTransfer.files[0]);

                    axios
                        .post(Config.base_url + "/sample/fileuploadSingle", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            },
                        })
                        .then(function() {
                            console.log("SUCCESS!!");
                        })
                        .catch(function() {
                            console.log("FAILURE!!");
                        });      
                }.bind(this)
            );
        }
    },

    methods: {
        /*
         * 이미 등록된 지수ID 가 존재하는지 확인한다.
         * 2019-04-02  bkLove(촤병국)
         */
        fn_jisuDuplCheck() {
<<<<<<< HEAD
          var vm = this;

          if( !this.$refs.form.validate() ) {
            return  false;
          }

          axios.post(Config.base_url+'/user/index/getJisuDuplCheck', {
            data : { jisu_id : this.form.jisu_id }
          }).then(function(response) {
              console.log( response);
          });  
=======
            var vm = this;

            /* 1. 지수 ID 필수 체크 */

            if (!this.form.jisu_id) {
                alert("[지수 ID] is required");
                this.$refs.jisu_id.focus();
                vm.form.duplCheckResult = false;

                return false;
            } else if (this.form.jisu_id.length > 10) {
                alert("[기준 ID] must be less than 10 characters");
                this.$refs.jisu_id.focus();
                vm.form.duplCheckResult = false;

                return false;
            }

            /* 2. 지수 ID 중복 체크 */
            axios
                .post(Config.base_url + "/user/index/getJisuDuplCheck", {
                    data: { jisu_id: this.form.jisu_id }
                })
                .then(function(response) {
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
>>>>>>> 7e4602242da3b7bf3259c8bbb6e754a8f18a7842
        },

        /*
         * 등록 버튼 클릭시
         * 2019-04-02  bkLove(촤병국)
         */
        fn_save() {
            var vm = this;

            if (!this.form.duplCheckResult) {
                alert("[지수 ID] 중복확인을 해주세요.");
                this.$refs.jisu_id.focus();

                return false;
            }

            if (!this.$refs.form.validate()) {
                return false;
            }

            axios
                .post(Config.base_url + "/user/index/save", {
                    data: this.form
                })
                .then(function(response) {
                    console.log(response);
                });
        },

        /*
        Determines if the drag and drop functionality is in the
        window
      */
        determineDragAndDropCapable() {
            /*
          Create a test element to see if certain events
          are present that let us do drag and drop.
        */
            var div = document.createElement("div");

            /*
          Check to see if the `draggable` event is in the element
          or the `ondragstart` and `ondrop` events are in the element. If
          they are, then we have what we need for dragging and dropping files.

          We also check to see if the window has `FormData` and `FileReader` objects
          present so we can do our AJAX uploading
        */
            return (
                ("draggable" in div ||
                    ("ondragstart" in div && "ondrop" in div)) &&
                "FormData" in window &&
                "FileReader" in window
            );
        }
    }
};
</script>






