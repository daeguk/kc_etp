<template>
    <v-card flat xs12>
        <v-container>
            <v-card flat class="regi_status">
                <v-layout row>
                    <v-flex xs2>
                        <v-subheader>Register ID</v-subheader>
                    </v-flex>
                    <v-flex xs4 mt-3 mb-2>
                        <span>regdafi1234</span>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs2>
                        <v-subheader>Status</v-subheader>
                    </v-flex>

                    <v-flex xs4 mt-3 mb-2>
                        <span class="text_color_blue">등록완료 ></span>
                        <span>연동신청 ></span>
                        <span>연동완료</span>
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
                                <v-text-field label="ID" value="e.g.FDL001" outline></v-text-field>
                            </v-flex>

                            <v-flex xs4 class="text-xs-left">
                                <v-layout row>
                                    <v-dialog v-model="dialog" persistent max-width="350">
                                        <template v-slot:activator="{ on }">
                                            <v-btn small depressed color="primary" dark>중복확인</v-btn>
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
                                <v-text-field label="지수한글명" value="DBF 바이오 테마 지수" outline></v-text-field>
                            </v-flex>
                        </v-layout>

                        <!-- 지수개요 -->
                        <v-layout row>
                            <v-flex xs2>
                                <v-subheader>지수개요</v-subheader>
                            </v-flex>
                            <v-flex xs10>
                                <v-textarea label="지수개요" outline color="blue"></v-textarea>
                            </v-flex>
                        </v-layout>

                        <!-- 기준지수 -->
                        <v-layout row>
                            <v-flex xs2>
                                <v-subheader>기준지수</v-subheader>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field label="기준지수" value="e.g.FDL001" outline></v-text-field>
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
                                    <v-flex xs12 sm6 md4>
                                        <v-menu
                                            ref="menu"
                                            v-model="menu"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="date"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="date"
                                                    label="Picker in menu"
                                                    append-icon="event"
                                                    box
                                                    readonly
                                                    outline
                                                    v-on="on"
                                                    widh="100%"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="date" no-title scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    flat
                                                    color="primary"
                                                    @click="menu = false"
                                                >Cancel</v-btn>
                                                <v-btn
                                                    flat
                                                    color="primary"
                                                    @click="$refs.menu.save(date)"
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
                                <input type="text" class="upload-name" id="upload-name" disabled>
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
                            <v-flex xs4 class="drag_box_w">
                                <v-layout flat class="drag_box list">
                                    <v-data-table
                                        :headers="headers"
                                        :items="desserts"
                                        class="regist_table"
                                        hide-actions
                                    >
                                        <template v-slot:items="props">
                                            <td>{{ props.item.name }}</td>
                                            <td class="text-xs-right">{{ props.item.calories }}</td>
                                            <td class="text-xs-right">{{ props.item.fat }}</td>
                                        </template>
                                    </v-data-table>
                                </v-layout>
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
                        </v-layout>
                    </v-container>
                </v-card>
            </div>
            <!---특정기관과 공유 end-->

            <div class="text-xs-center">
                <p class="text_info1">
                    <v-icon small>priority_high</v-icon>플랫폼 연동이 완료된 상태이므로 일부 정보에 한해 변경이 가능합니다.
                </p>
                <v-btn depressed large color="primary" dark>저장</v-btn>
                <v-btn depressed large color="#3158a1" dark>등록</v-btn>
                <v-btn depressed large color="#9e9e9e" dark>삭제</v-btn>
            </div>
        </v-container>
    </v-card>
</template>


<script>
export default {
    props: [ "editData" ],
    data() {
        return {
            date: new Date().toISOString().substr(0, 10),
            menu: false,

            dialog: false,
            dialog2: false,

            headers: [
                {
                    text: "Dessert (100g serving)",
                    align: "left",
                    sortable: false,
                    value: "name"
                },
                { text: "Calories", value: "calories" },
                { text: "Fat (g)", value: "fat" }
            ],
            ex4: [],
            desserts: [
                {
                    name: "Frozen Yogurt",
                    calories: 159,
                    fat: 6.0
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237,
                    fat: 9.0
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237,
                    fat: 9.0
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237,
                    fat: 9.0
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237,
                    fat: 9.0
                }
            ]
        };
    },
    mounted: function() {
        alert(">>>>" + this.editData.jisu_id);
    }
};
</script>






