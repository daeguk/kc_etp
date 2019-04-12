<template>
    <v-container>
        <v-layout row wrap class="content_margin etp_new">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">
                                EPT 신청 |
                                <span
                                    class="grey--text"
                                >ETP 신규 신청서 작성 및 상세 내용을 확인, 수정 할 수 있습니다.</span>
                            </h3>
                        </div>
                    </v-card-title>
                </v-card>
                <v-stepper v-model="e1">
                    <v-stepper-header>
                        <v-stepper-step :complete="e1 > 1" step="1">step</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 > 2" step="2">step</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 > 3" step="3">step</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 > 4" step="4">step</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 > 5" step="5">step</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 > 6" step="6">step</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step step="7">step</v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                        <!---step1--->
                        <v-stepper-content step="1">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>1.발행사 정보</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수산출기관</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 2">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 1">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step2--->
                        <v-stepper-content step="2">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>2.기본 정보</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">종목한글명</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="종목한글명" value="grgrg" outline readonly></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">종목영문명</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="종목영문명" value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">종목코드(12자리)</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="종목코드(12자리)" value outline></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">단축코드(6자리)</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="단축코드(6자리)" value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">국내/해외구분</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items2"
                                                value
                                                placeholder="국내/해외구분"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">사무수탁사</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items3"
                                                value
                                                placeholder="사무수탁사"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">상품구분</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items4"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">상장신청일</v-subheader>
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
                                                                outline
                                                                v-on="on"
                                                                widh="100%"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="date"
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
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">상장일</v-subheader>
                                        </v-flex>
                                        <v-flex xs4>
                                            <!--달력-->
                                            <v-layout row wrap>
                                                <v-flex xs12 sm6 md4>
                                                    <v-menu
                                                        ref="menu2"
                                                        v-model="menu2"
                                                        :close-on-content-click="false"
                                                        :nudge-right="40"
                                                        :return-value.sync="date2"
                                                        lazy
                                                        transition="scale-transition"
                                                        offset-y
                                                        full-width
                                                        min-width="290px"
                                                    >
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field
                                                                v-model="date2"
                                                                label="Picker in menu"
                                                                append-icon="event"
                                                                box
                                                                outline
                                                                v-on="on"
                                                                widh="100%"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="date2"
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
                                                                @click="$refs.menu2.save(date2)"
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
                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 3">Continue</v-btn>
                                <v-btn color="grey" depressed dark @click="e1 = 1">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step3--->
                        <v-stepper-content step="3">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>
                                    3.기초지수분배처
                                    <span>(*중요 : 기초지수는 ETP상장준비과정 전에 지수제공처와 모든 협의가 완료되어야 합니다.)</span>
                                </h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수심볼</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="지수심볼" value outline></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수명칭</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="지수명칭" value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수입수기관</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items5"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수분배처</v-subheader>
                                        </v-flex>
                                        <v-flex xs5 row class="checkbox_w">
                                            <v-layout row wrap class="light--text">
                                                <v-flex xs2>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected2"
                                                        label="발행사"
                                                        value="발행사"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected2"
                                                        label="KRX"
                                                        value="KRX"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected2"
                                                        label="예탁원"
                                                        value="예탁원"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected2"
                                                        label="미래에셋펀드서비스"
                                                        value="미래에셋펀드서비스"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">휴장일기준</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items6"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수추적배수</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items7"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수종가타입</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items8"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">전일기초지수구분</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items9"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수파일명</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field label="지수파일명" value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">기초지수경로</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field label="기초지수경로" value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수구성종목분배여부</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items10"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수구성종목분배처</v-subheader>
                                        </v-flex>
                                        <v-flex xs5 row class="checkbox_w">
                                            <v-layout row wrap class="light--text">
                                                <v-flex xs2>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected"
                                                        label="예탁원"
                                                        value="예탁원"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected"
                                                        label="미래에셋펀드서비스"
                                                        value="미래에셋펀드서비스"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">블룸버그 티커</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="블룸버그 티커" value outline></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">Hedge여부/적용환율</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items11"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">요청사항</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-textarea label="요청사항" outline color="blue"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>

                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 4">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 2">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step4--->
                        <v-stepper-content step="4">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>4.실시간 지수 분배처</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간지수 반영여부</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items10"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수입수기관</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items5"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수입수기관심볼</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="지수입수기관심볼" value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간휴장일기준</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items6"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간지수분배처</v-subheader>
                                        </v-flex>
                                        <v-flex xs5 row class="checkbox_w">
                                            <v-layout row wrap class="light--text">
                                                <v-flex xs2>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected3"
                                                        label="발행사"
                                                        value="발행사"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected"
                                                        label="KRX"
                                                        value="KRX"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected"
                                                        label="예탁원"
                                                        value="예탁원"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-checkbox
                                                        color="primary"
                                                        v-model="selected"
                                                        label="미래에셋펀드서비스"
                                                        value="미래에셋펀드서비스"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 5">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 3">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step5--->
                        <v-stepper-content step="5">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>5.참고지수정보</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수심볼</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label value outline disabled></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수명칭</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label value outline disabled></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수입수기관</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items5"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                                disabled
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수파일명</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="지수파일명" disabled value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">블룸버그 티커</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field label="지수파일명" disabled value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">요청사항</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-textarea label="요청사항" outline disabled color="blue"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 6">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 4">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step6--->
                        <v-stepper-content step="6">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>6.iNAV/iV</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">산출식</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-select
                                                :items="items12"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>

                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 7">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 5">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step7--->
                        <v-stepper-content step="7">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>7.코스콤</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수입수여부</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items10"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수분배여부</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items10"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">iNAV 산출여부</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select
                                                :items="items10"
                                                value
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수MID</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="기초지수MID"  value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간지수MID</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="실시간지수MID"  value outline></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간TR</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="실시간TR"  value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">종가파일</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field label="종가파일"  value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">거래소업종코드</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="거래소업종코드"  value outline></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">사무수탁사업종코드</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="사무수탁사업종코드"  value outline></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">진행상황</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-textarea label="진행상황" outline color="blue"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 1">저장</v-btn>
                            </div>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
export default {
    data() {
        return {
            selected: [""],
            selected2: [""],
            selected3: [""],
            date: new Date().toISOString().substr(0, 10),
            date2: new Date().toISOString().substr(0, 10),
            menu: false,
            menu2: false,
            modal: false,
            e1: 0,
            items: [
                "DB자산운용",
                "KB자산운용",
                "KB증권",
                "NH-Amundi자산운용",
                "NH투자증권",
                "대신증권",
                "미래에셋대우",
                "미래에셋자산운용",
                "미래에셋증권",
                "삼성자산운용",
                "삼성증권",
                "신한금융투자",
                "키움자산운용",
                "한국투신운용",
                "한국투자증권",
                "한화자산운용"
            ],
            items2: ["해외", "국내"],
            items3: ["한국예탁결제원", "미래에셋펀드서비스"],
            items4: ["ETF", "ETN"],
            items5: [
                "한국예탁결제원",
                "동경거래소",
                "인도거래소",
                "IDC",
                "EUROSTOXX",
                "FACTSET",
                "MARKIT",
                "MORNING STAR",
                "MSCI",
                "SGX",
                "SIX",
                "SOLACTIVE",
                "S&P",
                "BNP PARIBAS",
                "Reuters",
                "자사(발행사)",
                "이데일리",
                "코스콤",
                "신규"
            ],
            items6: [
                "KR-한국",
                "AU-호주",
                "EU-유로",
                "GE-독일",
                "HK-홍콩",
                "ID-인도네시아",
                "IN-인도",
                "JP-일본",
                "PH-필리핀",
                "RU-러시아",
                "SG-싱가폴",
                "SH-중국(상해)",
                "SZ-중국(심천)",
                "TW-대만",
                "UK-영국",
                "US-미국",
                "VN-베트남",
                "MX-멕시코",
                "BNP",
                "CME",
                "EUREX",
                "EU-유로",
                "KCME-CME연계",
                "KEUREX-EUREX연계",
                "SH|SZ-상해,심천 중 휴장이 있으면 휴장",
                "SH|SZ|KR-상해,심천,한국 중 휴장이 있으면 휴장",
                "UK|KR-영국,한국 중 휴장이 있으면 휴장",
                "HK&US-홍콩,미국 동시휴장일 경우 휴장",
                "KRTWHKSG-한국,대만,홍콩,싱가폴 모두 휴장일경우 휴장",
                "NoHol-No Holiday",
                "신규"
            ],
            items7: ["1", "-1", "2", "-2", "3", "-3"],
            items8: ["SP", "TR", "ER"],
            items9: ["T", "T-1", "T-2", "T-3"],
            items10: ["YES", "NO"],
            items11: [
                "환노출-KRW",
                "환노출-AUD",
                "환노출-CNY",
                "환노출-EUR",
                "환노출-HKD",
                "환노출-IDR",
                "환노출-INR",
                "환노출-JPY",
                "환노출-PHP",
                "환노출-RUB",
                "환노출-TWD",
                "환노출-USD",
                "환노출-VND",
                "환노출-MXN",
                "환노출-SGD",
                "신규"
            ],
            items12: [
                "신규",
                "전일NAV(IV)*(1+기초지수등락율*배율*매매기준율/장전매매기준율)",
                "전일NAV(IV)*(1+기초지수등락율*배율)*(매매기준율/장전매매기준율)",
                "전일NAV(IV)*(1+기초지수등락율*배율)",
                "전일NAV(IV)*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율) *(1+전일등락율*배율)",
                "전일NAV(IV)*(1+기초지수등락율*배율-예상배당수익률)",
                "전일NAV(IV)*(1+((1+기초지수등락율)*매매기준율/장전매매기준율-1)*배율)",
                "PDF방식-국내전용",
                "지수수익률방식-국내전용"
            ]
        };
    }
};
</script>