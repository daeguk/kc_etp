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
                        <v-form>
                        <!---step1---><!---세션 param의 inst_cd 같은거 -->
                        <v-stepper-content step="1">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>1.발행사 정보</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">발행사</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select  v-bind:disabled="masterData.paramInstTypeCd !== '0002'"
                                                :items="compList"
                                                :selected ="masterData.paramInstCd"
                                                v-model ="masterData.paramInstCd"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 2">Continue</v-btn>
                            </div>
                        </v-stepper-content>


                        <!---step2--->
                        <v-stepper-content step="2" >
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12 >
                                <h4>2.기본 정보</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">종목한글명</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field   v-bind:disabled = inputDisabled
                                            label="종목한글명"
                                              v-model="masterData.isu_kor_nm"
                                            outline></v-text-field>
                                        {{errors.isu_kor_nm}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">종목영문명</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-bind:disabled= inputDisabled
                                            label="종목영문명" 
                                             v-model="masterData.isu_eng_nm"
                                            outline></v-text-field>
                                            {{errors.isu_eng_nm}}
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">종목코드(12자리)</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field  v-bind:disabled = inputDisabled
                                            ref="isin_code"
                                            label="종목코드(12자리)" 
                                            v-model="masterData.isin_code"
                                            outline></v-text-field>
                                             {{errors.isin_code}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">단축코드(6자리)</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field  v-bind:disabled = inputDisabled
                                            type="number"
                                            ref="isu_srt_cd"
                                            label="단축코드(6자리)" 
                                            v-model="masterData.isu_srt_cd"
                                            outline></v-text-field>
                                             {{errors.isu_srt_cd}}
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">국내/해외구분</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                               :items="items2"
                                               :selected="masterData.kor_for_type"
                                               v-model="masterData.kor_for_type"
                                                 item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"                               
                                                outline>
                                        </v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">사무수탁사</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                               :items="code010List"
                                               :selected="masterData.agent_cd"
                                               v-model="masterData.agent_cd"
                                                 item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
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
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="items4"
                                                :selected="masterData.etp_type"
                                                v-model="masterData.etp_type"
                                                item-value="value"
                                                item-text="text"
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
                                                        :return-value.sync="masterData.list_req_date"
                                                        lazy
                                                        transition="scale-transition"
                                                        offset-y
                                                        full-width
                                                        min-width="290px"
                                                    >
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field v-bind:disabled = inputDisabled
                                                                v-model="masterData.list_req_date"
                                                                label="Picker in menu"
                                                                append-icon="event"
                                                                box
                                                                outline
                                                                v-on="on"
                                                                widh="100%"
                                                               
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="masterData.list_req_date"
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
                                                                @click="$refs.menu.save(masterData.list_req_date)"
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
                                                        :return-value.sync="masterData.list_date"
                                                        lazy
                                                        transition="scale-transition"
                                                        offset-y
                                                        full-width
                                                        min-width="290px"
                                                    >
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field v-bind:disabled = inputDisabled
                                                                v-model="masterData.list_date"
                                                                label="Picker in menu"
                                                                append-icon="event"
                                                                box
                                                                outline
                                                                v-on="on"
                                                                widh="100%"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="masterData.list_date"
                                                            no-title
                                                            scrollable
                                                        >
                                                            <v-spacer></v-spacer>
                                                            <v-btn
                                                                flat
                                                                color="primary" 
                                                                @click="menu2 = false"
                                                            >Cancel</v-btn>
                                                            <v-btn
                                                                flat
                                                                color="primary"
                                                                @click="$refs.menu2.save(masterData.list_date)"
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
                                <v-btn color="primary" depressed dark @click="fn_insertEtpRegisterStep1()">Continue</v-btn>
                                <v-btn color="grey" depressed dark @click="e1 = 1">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step3--->
                        <v-stepper-content step="3">
                            
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12 >
                                <div v-if="masterData.kor_for_type==='F'">
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
                                            <v-text-field v-bind:disabled = inputDisabled 
                                            label="지수심볼" value outline v-model="masterData.idx_sym_code" ref="idx_sym_code"></v-text-field>
                                            {{errors.idx_sym_code}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수명칭</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-bind:disabled = inputDisabled 
                                            label="지수명칭" value outline v-model="masterData.idx_nm"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수입수기관</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="code004List"
                                                :selected="masterData.idx_dist_inst_cd"
                                                v-model="masterData.idx_dist_inst_cd"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                                ref="idx_dist_inst_cd"
                                            ></v-select>
                                            {{errors.idx_dist_inst_cd}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수분배처</v-subheader>
                                        </v-flex>
                                        <v-flex xs5 row class="checkbox_w">
                                            <v-layout row wrap class="light--text">
                                                <v-flex xs2>
                                                    <v-checkbox v-bind:disabled = inputDisabled
                                                        color="primary"
                                                        v-model="masterData.comp_dist_yn"
                                                        :checked="masterData.comp_dist_yn"
                                                        label="발행사"
                                                        value="Y"
                                                    ></v-checkbox> 
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-checkbox v-bind:disabled = inputDisabled
                                                        color="primary"
                                                        v-model="masterData.krx_dist_yn"
                                                        :checked="masterData.krx_dist_yn"
                                                        label="KRX"
                                                        value="Y"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-checkbox v-bind:disabled = inputDisabled
                                                        color="primary"
                                                        v-model="masterData.ksd_dist_yn"
                                                        :checked="masterData.ksd_dist_yn"
                                                        label="예탁원"
                                                        value="Y"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-checkbox v-bind:disabled = inputDisabled
                                                        color="primary"
                                                         v-model="masterData.mirae_dist_yn"
                                                         :checked="masterData.mirae_dist_yn"
                                                        label="미래에셋펀드서비스"
                                                        value="Y"
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
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="code005List"
                                                 :selected="masterData.idx_holy_cd"
                                                v-model="masterData.idx_holy_cd"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                                ref ="idx_holy_cd"
                                            ></v-select>
                                            {{errors.idx_holy_cd}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수추적배수</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="items7"
                                                :selected="masterData.idx_trace_yd_mult_type"
                                                v-model="masterData.idx_trace_yd_mult_type"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                                ref="idx_trace_yd_mult_type"
                                            ></v-select>
                                            {{errors.idx_trace_yd_mult_type}}
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수종가타입</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="items8"
                                                :selected="masterData.idx_close_type"
                                                v-model="masterData.idx_close_type"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                             {{errors.idx_close_type}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">전일기초지수구분</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="items9"
                                                 :selected="masterData.pre_idx_type"
                                                v-model="masterData.pre_idx_type"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                             {{errors.pre_idx_type}}
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수파일명</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field v-bind:disabled = inputDisabled 
                                            label="지수파일명" value outline v-model="masterData.idx_file_nm"></v-text-field>
                                             {{errors.idx_file_nm}}
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">기초지수경로</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field v-bind:disabled = inputDisabled
                                             label="기초지수경로" value outline v-model="masterData.idx_file_path"></v-text-field>
                                             {{errors.idx_file_path}}
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수구성종목분배여부</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="items10"
                                                :selected="masterData.idx_comp_dist_yn"
                                                v-model="masterData.idx_comp_dist_yn"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                           {{errors.idx_comp_dist_yn}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수구성종목분배처</v-subheader>
                                        </v-flex>
                                        <v-flex xs5 row class="checkbox_w">
                                            <v-layout row wrap class="light--text">
                                                <v-flex xs2>
                                                    <v-checkbox  v-bind:disabled="masterData.idx_comp_dist_yn === 'N' && inputDisabled"
                                                        color="primary"
                                                         :checked="masterData.idx_comp_ksd_dist_yn"
                                                        v-model="masterData.idx_comp_ksd_dist_yn"
                                                        label="예탁원"
                                                        value="Y"
                                                        
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs6> 
                                                    <v-checkbox  v-bind:disabled="masterData.idx_comp_dist_yn === 'N' && inputDisabled"
                                                        color="primary"
                                                         :checked="masterData.idx_comp_mirae_dist_yn"
                                                        v-model="masterData.idx_comp_mirae_dist_yn"
                                                        label="미래에셋펀드서비스"
                                                        value="Y"
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
                                            <v-text-field label="블룸버그 티커" value outline  v-model="masterData.blom_ticker" v-bind:disabled = inputDisabled></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">Hedge여부/적용환율</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select  v-bind:disabled = inputDisabled
                                               :items="code006List"
                                               :selected="masterData.ex_rate_cd"
                                                v-model="masterData.ex_rate_cd"
                                                item-value="value"
                                                item-text="text"
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
                                            <v-textarea v-bind:disabled = inputDisabled 
                                            label="요청사항" outline color="blue" v-model="masterData.user_req"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </div>
                            <div v-if="masterData.kor_for_type==='K'">
                                <h4>
                                    3.국내지수정보
                                </h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수심볼</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-bind:disabled = inputDisabled
                                            label="지수심볼" value outline  v-model="masterData.idx_sym_code"></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수명칭</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-bind:disabled = inputDisabled
                                            label="지수명칭" value outline v-model="masterData.idx_nm"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수산출기관</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="code008List"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.idx_inst_cd"
                                                v-model="masterData.idx_inst_cd"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                       <v-flex xs2>
                                            <v-subheader class="subheader_r essen">지수타입</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled = inputDisabled
                                              :items="code009List"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.idx_comp_cd"
                                                v-model="masterData.idx_comp_cd"
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
                                            <v-textarea v-bind:disabled = inputDisabled
                                            label="요청사항" outline color="blue"  v-model="masterData.user_req"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </div>       
                            </v-card>

                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="fn_insertEtpRegisterStep2()" v-if="masterData.kor_for_type==='F'">Continue</v-btn>
                                <v-btn color="primary" depressed dark @click="e1 = 6" v-else-if="masterData.kor_for_type==='K'">Continue</v-btn>
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
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="items10"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.real_yn"
                                                v-model="masterData.real_yn"
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
                                            <v-select v-bind:disabled="masterData.real_yn === 'N' || inputDisabled"
                                               :items="code0041List"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.ridx_dist_inst_cd"
                                                v-model="masterData.ridx_dist_inst_cd"
                                                placeholder="선택하세요"
                                                outline
                                                ref="ridx_dist_inst_cd"
                                            ></v-select>
                                            {{errors.ridx_dist_inst_cd}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수입수기관심볼</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field  v-bind:disabled="masterData.real_yn === 'N' || inputDisabled"
                                            label="지수입수기관심볼" value outline v-model="masterData.ridx_dist_sym_code" ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간휴장일기준</v-subheader>
                                        </v-flex>
                                        <v-flex xs3> 
                                            <v-select v-bind:disabled="masterData.real_yn === 'N'  || inputDisabled"
                                              :items="code005List"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.ridx_holy_cd"
                                                v-model="masterData.ridx_holy_cd"
                                                placeholder="선택하세요"
                                                outline
                                                ref ="ridx_holy_cd"
                                            ></v-select>
                                            {{errors.ridx_holy_cd}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간지수분배처</v-subheader>
                                        </v-flex>
                                        <v-flex xs5 row class="checkbox_w">
                                            <v-layout row wrap class="light--text">
                                                <v-flex xs2>
                                                    <v-checkbox v-bind:disabled="masterData.real_yn === 'N'  || inputDisabled"
                                                        color="primary"
                                                        :checked="masterData.ridx_comp_dist_yn"
                                                        v-model="masterData.ridx_comp_dist_yn"
                                                        label="발행사"
                                                        value="Y"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-checkbox v-bind:disabled="masterData.real_yn === 'N'  || inputDisabled"
                                                        color="primary"
                                                        :checked="masterData.ridx_krx_dist_yn"
                                                        v-model="masterData.ridx_krx_dist_yn"
                                                        label="KRX"
                                                        value="Y"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-checkbox v-bind:disabled="masterData.real_yn === 'N'  || inputDisabled"
                                                        color="primary"
                                                       :checked="masterData.ridx_ksd_dist_yn"
                                                        v-model="masterData.ridx_ksd_dist_yn"
                                                        label="예탁원"
                                                        value="Y"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-checkbox v-bind:disabled="masterData.real_yn === 'N'  || inputDisabled"
                                                        color="primary"
                                                         :checked="masterData.ridx_mirae_dist_yn"
                                                        v-model="masterData.ridx_mirae_dist_yn"
                                                        label="미래에셋펀드서비스"
                                                        value="Y"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="fn_insertEtpRegisterStep4()">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 3">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step5--->
                        <v-stepper-content step="5">
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>5.참고지수정보 (상품구분이 ETP일때만 입력가능 합니다.)</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수심볼</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field  v-bind:disabled="masterData.etp_type !== 'ETF' || inputDisabled"
                                            label value outline  v-model="masterData.refidx_sym_code"></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수명칭</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field  v-bind:disabled="masterData.etp_type !== 'ETF' || inputDisabled"
                                            label value outline  v-model="masterData.refidx_nm" ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수입수기관</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select v-bind:disabled="masterData.etp_type !== 'ETF'|| inputDisabled"
                                               :items="code004List"
                                                 item-value="value"
                                                item-text="text"
                                                :selected="masterData.refidx_inst_cd"
                                                v-model="masterData.refidx_inst_cd"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수파일명</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="지수파일명"  v-bind:disabled="masterData.etp_type !== 'ETF' || inputDisabled"
                                             value outline  v-model="masterData.refidx_file_nm" ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">블룸버그 티커</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field  v-bind:disabled="masterData.etp_type !== 'ETF' || inputDisabled"  
                                            label="블룸버그 티커"  value outline v-model="masterData.refidx_blom_ticker"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">요청사항</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-textarea v-bind:disabled="masterData.etp_type !== 'ETF' ||  inputDisabled" 
                                            label="요청사항" outline  color="blue" v-model="masterData.refidx_req" ></v-textarea>
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
                                            <v-select  v-bind:disabled = inputDisabled
                                                ref="inav_calc_cd"
                                               :items="code007List"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.inav_calc_cd"
                                                v-model="masterData.inav_calc_cd"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                            {{errors.inav_calc_cd}}
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>

                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="fn_insertEtpRegister()" 
                                 v-if="masterData.paramInstTypeCd  === '0001' && masterData.seq  == ''" >저장</v-btn>
                                  <v-btn color="primary" depressed dark @click="fn_updateEtpRegister()" 
                                 v-if="masterData.paramInstTypeCd  === '0001' && masterData.seq  !== ''" >수정</v-btn>
                                <v-btn color="primary" depressed dark @click="e1 = 7"  v-else-if="masterData.paramInstTypeCd === '0002'">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 5" v-if="masterData.kor_for_type === 'F'">Cancel</v-btn>
                                <v-btn color="grey" depressed dark @click="e1 = 3" v-if="masterData.kor_for_type === 'K'">Cancel</v-btn>
                            </div>
                        </v-stepper-content>

                        <!---step7--->
                        <v-stepper-content step="7" v-if="masterData.paramInstTypeCd === '0002'" >
                            <v-card class="register_wrap" color="lighten-1" height="100%" flat xs12>
                                <h4>7.코스콤</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수입수여부</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select  v-bind:disabled = inputDisabled
                                                :items="items10"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.idx_rec_yn"
                                                v-model="masterData.idx_rec_yn"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수분배여부</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-select  v-bind:disabled = inputDisabled
                                                :items="items10"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.idx_dis_yn"
                                                v-model="masterData.idx_dis_yn"
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
                                            <v-select  v-bind:disabled = inputDisabled
                                                :items="items10"
                                                 item-value="value"
                                                item-text="text"
                                                :selected="masterData.inav_calc_yn"
                                                v-model="masterData.inav_calc_yn"
                                                placeholder="선택하세요"
                                                outline
                                            ></v-select>
                                            {{errors.inav_calc_yn}}
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수MID</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="기초지수MID"  value outline  v-model="masterData.idx_mid"  type="number"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간지수MID</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="실시간지수MID"  v-bind:disabled = inputDisabled
                                             value outline v-model="masterData.ridx_mid"  type="number"> </v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간TR</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="실시간TR"  v-bind:disabled = inputDisabled
                                             value outline v-model="masterData.real_idx_tr"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">종가파일</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field label="종가파일"   v-bind:disabled = inputDisabled
                                            value outline v-model="masterData.close_file"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">거래소업종코드</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="거래소업종코드"  v-bind:disabled = inputDisabled
                                             value outline v-model="masterData.krx_up_code"  type="number"></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">사무수탁사업종코드</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="사무수탁사업종코드"   v-bind:disabled = inputDisabled
                                             value outline v-model="masterData.agent_up_code"  type="number"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">진행상황</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-textarea  v-bind:disabled = inputDisabled
                                            label="진행상황" outline color="blue" v-model="masterData.proc_stat"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark   v-if="masterData.seq  === ''" @click="fn_insertEtpRegister()">저장</v-btn>
                                <v-btn color="primary" depressed dark   v-if="masterData.seq  !== ''" @click="fn_updateEtpRegister()">수정</v-btn>
                            </div>
                          
                        </v-stepper-content>
                         </v-form>  
                    </v-stepper-items>
                </v-stepper>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import Config from "@/js/config.js";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

export default {
    data() {
        return {
            selected: [""],
            selected2: ["Y"],
            selected3: [""],
            date: new Date().toISOString().substr(0, 10),
            date2: new Date().toISOString().substr(0, 10),
            menu: false,
            menu2: false,
            modal: false,
            e1: 0,
            compList :[],
            code004List :[],
            code0041List :[],
            code005List :[],
            code006List :[],
            code007List :[],
            code008List :[],
            code009List :[],
            code010List :[],
            items2: [{value: "F", text: "해외" }, {value: "K" , text: "국내" }],
            items4: [{value: "ETF", text: "ETF" }, {value: "ETN" , text: "ETN" }],
            items7: [{value: 1, text: "1" }, {value: -1, text: "-1" },{value: 2, text: "2" },{value: -2, text: "-2" },{value: 3, text: "3" },{value: -3, text: "-3" }],
            items8: [{value: "SP", text: "SP" },{value: "TR", text: "TR" },{value: "ER", text: "ER" }],
            items9: [{value: 0, text: "T" },{value: -1, text: "T-1" },{value: -2, text: "T-2" },{value: -3, text: "T-3" }],
            items10: [{value: "Y", text: "YES" },{value: "N", text: "NO" }],
            masterData :{
                paramInstCd:"0000"
               ,paramInstTypeCd:"0001"
               ,idxCompDistYn:"N"
               ,seq_hist:"", seq:"",isu_kor_nm:"",isu_eng_nm:"",isin_code:"",isu_srt_cd:"",etp_type:"",inst_cd:"",req_date:"",list_req_date:"",list_date:"",krx_dist_yn:"",comp_dist_yn:"",ksd_dist_yn:"",mirae_dist_yn:"",idx_inst_cd:"",idx_sym_code:"",idx_nm:"",idx_dist_inst_cd:"",idx_close_type:"",idx_holy_cd:"",idx_trace_yd_mult_type:"",pre_idx_type:"",idx_file_nm:"",idx_comp_ksd_dist_yn:"",idx_comp_mirae_dist_yn:"",blom_ticker:"",user_req:"",real_yn:"",ridx_inst_cd:"",ridx_dist_inst_cd:"",ridx_crt_sym_code:"",ridx_dist_sym_code:"",ridx_holy_cd:"",ridx_krx_dist_yn:"",ridx_comp_dist_yn:"",ridx_ksd_dist_yn:"",ridx_mirae_dist_yn:"",ridx_dist_term:"",refidx_sym_code:"",refidx_nm:"",refidx_inst_cd:"",refidx_file_nm:"",refidx_req:"",refidx_blom_ticker:"",ex_rate_cd:"",ex_hedge_yn:"",isin_stat_cd:"",inav_calc_cd:"",idx_rec_yn:"",idx_dis_yn:"",inav_calc_yn:"",idx_mid:"",ridx_mid:"",close_file:"",real_idx_tr:"",proc_stat:"",insert_id:"",insert_time:"",update_id:"",update_time:"",kor_for_type:"F",agent_cd:"",idx_comp_cd:"",krx_up_code:"",agent_up_code:""
               ,idx_file_path:""
               ,idx_comp_dist_yn:"N"
               ,listDate:"", listReqDate:""
            },
            inputDisabled: false,
            errors: {},
            seq : 0

        };
    },
    mounted: function() {
        // 메시지 박스 참조
        this.$root.$confirm = this.$refs.confirm;
        this.getEtpRegisterView();

    },
    created: function() {

       // this.$emit('movePage', 0);
    }, 
    methods: {
        getEtpRegisterView : function(){
            var vm = this;
            console.log('##getEtpRegisterView 호출##', vm.seq);
            axios
            .get(Config.base_url + "/user/etp/getEtpRegisterView", {
                    params: {seq: vm.seq}
                })
            .then(function(response) {
                    console.log("'##getEtpRegisterView 호출 >>> result##", response.data);

                  
                    var compList = response.data.compList;
                    for (let i = 0; i < compList.length; i++) {
                        vm.compList.push({ value: compList[i].INST_CD, text: compList[i].INST_NM });
                    }


                    var code004List = response.data.code004List;
                    for (let i = 0; i < code004List.length; i++) {
                        vm.code004List.push({ value: code004List[i].M_CD, text: code004List[i].M_CD_NM });
                    }

                    var code0041List = response.data.code004List;
                    for (let i = 0; i < code004List.length; i++) {
                        vm.code0041List.push({ value: code004List[i].M_CD.substr(2,4), text: code004List[i].M_CD_NM });
                    }

                    var code005List = response.data.code005List;
                    for (let i = 0; i < code005List.length; i++) {
                        vm.code005List.push({ value: code005List[i].M_CD, text: code005List[i].M_CD_NM });
                    }

                    var code006List = response.data.code006List;
                    for (let i = 0; i < code006List.length; i++) {
                        vm.code006List.push({ value: code006List[i].M_CD, text: code006List[i].M_CD_NM });
                    }

                    var code007List = response.data.code007List;
                    for (let i = 0; i < code007List.length; i++) {
                        vm.code007List.push({ value: code007List[i].M_CD, text: code007List[i].M_CD_NM });
                    }

                    var code008List = response.data.code008List;
                    for (let i = 0; i < code008List.length; i++) {
                        vm.code008List.push({ value: code008List[i].M_CD, text: code008List[i].M_CD_NM });
                    }

                    var code009List = response.data.code009List;
                    for (let i = 0; i < code009List.length; i++) {
                        vm.code009List.push({ value: code009List[i].M_CD, text: code009List[i].M_CD_NM });
                    }

                    var code010List = response.data.code010List;
                    for (let i = 0; i < code010List.length; i++) {
                        vm.code010List.push({ value: code010List[i].M_CD, text: code010List[i].M_CD_NM });
                    }

                    var paramData = response.data.params;

                    if(response.data.masterData!=""){
                         vm.masterData = response.data.masterData[0];
                        console.log("masterData", vm.masterData);
                        if(vm.masterData.idx_comp_ksd_dist_yn=='Y' || vm.masterData.idx_comp_mirae_dist_yn=='Y'){
                            vm.masterData.idx_comp_dist_yn ="Y";
                        }else if(vm.masterData.idx_comp_ksd_dist_yn!=='Y' && vm.masterData.idx_comp_mirae_dist_yn!=='Y'){
                            vm.masterData.idx_comp_dist_yn ="N";
                        }

                        if(vm.masterData.kor_for_type==null){
                            vm.masterData.kor_for_type ="F";
                        }

                        //수정시 코스콤 아니고 해당발행사 아니면 전체input 비활성화
                        if(paramData.inst_cd != vm.masterData.inst_cd && paramData.inst_type_cd!='0002'){
                            vm.inputDisabled = true;
                        }

                        var imsi  = vm.masterData.list_req_date;
                        var imsi2 = vm.masterData.list_date;
                        
                        if(imsi  !==undefined && imsi !==null)   vm.masterData.list_req_date = imsi.substr(0,4).concat("-").concat(imsi.substr(4,2)).concat("-").concat(imsi.substr(6,2));
                        if(imsi2 !==undefined && imsi2 !==null) vm.masterData.list_date     = imsi2.substr(0,4).concat("-").concat(imsi2.substr(4,2)).concat("-").concat(imsi2.substr(6,2));
                    }else{ 
                        vm.masterData =[];
                        vm.masterData.list_req_date = new Date().toISOString().substr(0, 10); //함수라서 여기서해줌
                        vm.masterData.list_date = new Date().toISOString().substr(0, 10); 
                    }
                    // else{ //등록시  DEFAULT 위의설정단에서 추가해줌.
                    //     vm.masterData.idxCompDistYn ="N";
                    //     vm.masterData.kor_for_type ="F";
                    // }

                    
                  
                     console.log("paramData",paramData);
                    vm.masterData.paramInstCd=paramData.inst_cd;
                    vm.masterData.paramInstTypeCd=paramData.inst_type_cd;
                  
                    // vm.masterData.inst_cd =paramData.inst_cd;
                    // vm.masterData.inst_type_cd =paramData.inst_type_cd;
                    
                  

                     console.log("masterData RESET", vm.masterData);

            });
        },
        fn_insertEtpRegisterStep1: function() {
            var vm = this;
            vm.errors = {};

            console.log("fn_insertEtpRegisterStep1 호출>> this.masterData ", this.masterData);
                  
            if(vm.masterData.isu_kor_nm.length < 1){
                vm.errors.isu_kor_nm = "this field is required"
                return;
            }else{
                vm.errors.isu_kor_nm = "";
            }
            
            if(vm.masterData.isu_eng_nm.length < 1){
                vm.errors.isu_eng_nm = "this field is required"
                return;
            }else{
                vm.errors.isu_eng_nm="";
            }
            
            if(vm.masterData.isu_srt_cd!='' && vm.masterData.isin_code ==''){
                 vm.$refs.isin_code.focus();
                 vm.errors.isin_code='단축코드 입력 시 종목코드가 입력되어야 합니다.';
                return;
            }

            if(vm.masterData.isu_srt_cd =='' && vm.masterData.isin_code !=''){
                vm.$refs.isu_srt_cd.focus();
                 vm.errors.isu_srt_cd='종목코드 입력 시 단축코드가 입력되어야 합니다.';
                return;
            }

             if(vm.masterData.isin_code !=''){
                if(vm.masterData.list_req_date ==''){
                     vm.$refs.list_req_date.focus();
                     vm.errors.list_req_date='종목코드 입력 시 상장신청일이 입력되어야 합니다.';
                    return;
                }

                if(vm.masterData.list_date ==''){
                    vm.$refs.list_date.focus();
                    vm.errors.list_date='종목코드 입력 시 상장일이 입력되어야 합니다.';
                    return;
                }
            }

            vm.e1 = 3;
          
         },
         fn_insertEtpRegisterStep2: function() {
            var vm = this;
            vm.errors = {};

            console.log("외국종목 fn_insertEtpRegisterStep2 호출>> this.masterData ", this.masterData);
            
            var check= /[ㄱ-ㅎ|ㅓ-ㅣ|가-힣]/;
            if(check.test(vm.masterData.idx_sym_code)){
                vm.errors.idx_sym_code = "지수심볼에 한글은 들어갈수 없습니다.";
                return;
            }
            if(vm.masterData.idx_sym_code.length < 1){
                vm.errors.idx_sym_code = "this field is required"
                return;
            }
            if(vm.masterData.idx_dist_inst_cd.length < 1){
                vm.errors.idx_dist_inst_cd = "this field is required"
                return;
            }
            if(vm.masterData.idx_holy_cd.length < 1){
                vm.errors.idx_holy_cd = "this field is required"
                return;
            }
            
            if(vm.masterData.idx_trace_yd_mult_type.length < 1){
                vm.errors.idx_trace_yd_mult_type = "this field is required"
                return;
            }
            
            if(vm.masterData.idx_close_type.length < 1){
                vm.errors.idx_close_type = "this field is required"
                return;
            }

            if(vm.masterData.pre_idx_type.length < 1){
                vm.errors.pre_idx_type = "this field is required"
                return;
            }

            if(vm.masterData.idx_file_nm.length < 1){
                vm.errors.idx_file_nm = "this field is required"
                return;
            }

            // if(vm.masterData.idx_file_path.length < 1){
            //     vm.errors.idx_file_path = "this field is required"
            //     return;
            // }

            if(vm.masterData.idx_comp_dist_yn.length < 1){
                vm.errors.idx_comp_dist_yn = "this field is required"
                return;
            }
            
         
            vm.e1 = 4;
         },  
        
        fn_insertEtpRegisterStep4: function() {
            var vm = this;

            if(vm.masterData.ridx_dist_sym_code !=''){
                if(vm.masterData.ridx_dist_inst_cd ===''){
                     vm.$refs.ridx_dist_inst_cd.focus();
                     vm.errors.ridx_dist_inst_cd = '실시간 지수입수기관심볼 입력 시 실시간 지수입수기관이 입력되어야 합니다.';
                    return;
                }

                if(vm.masterData.ridx_holy_cd ===''){
                     vm.$refs.ridx_holy_cd.focus();
                     vm.errors.ridx_holy_cd = '실시간 지수입수기관심볼 입력 시 실시간 휴장일 기준이 입력되어야 합니다.';
                    return;
                }

            }

              vm.e1 = 5;
            

        }, 
        fn_insertEtpRegister: function() {
            var vm = this;

            vm.masterData.listReqDate = vm.masterData.list_req_date.replace(/-/gi, "");
            vm.masterData.listDate     = vm.masterData.list_date.replace(/-/gi, "");
            //vm.masterData.req_date     = vm.masterData.req_date.replace(/-/gi, "");

            var check= /[ㄱ-ㅎ|ㅓ-ㅣ|가-힣]/;
            if(check.test(vm.masterData.idx_sym_code)){
                vm.errors.idx_sym_code = "지수심볼에 한글은 들어갈수 없습니다.";
                return;
            }

            if(vm.masterData.isin_code !=''){
                if(vm.masterData.inav_calc_cd  ==''){
                     vm.$refs.inav_calc_cd.focus();
                     vm.errors.inav_calc_cd='종목코드 입력 시 iNAV/iV 관련정보가 입력되어야 합니다.';
                    return;
                }
            }

            if(vm.masterData.inav_calc_yn =='Y'){
                if(vm.masterData.isin_code ===''){
                     vm.$refs.isin_code.focus();
                     vm.errors.isin_code='iNAV산출여부가 Y일 때 첫번째 페이지의 종목코드, 상장신청일, 상장일이 입력되어야 합니다.';
                    return;
                }
                
                if(vm.masterData.list_req_date ==''){
                     vm.$refs.menu.focus();
                     vm.errors.list_req_date='iNAV산출여부가 Y일 때 첫번째 페이지의 종목코드, 상장신청일, 상장일이 입력되어야 합니다.';
                    return;
                }

                if(vm.masterData.list_date ==''){
                     vm.$refs.menu2.focus();
                     vm.errors.list_date='iNAV산출여부가 Y일 때 첫번째 페이지의 종목코드, 상장신청일, 상장일이 입력되어야 합니다.';
                    return;
                }

            }

            vm.masterData.idx_file_nm= vm.masterData.idx_file_path + "/" + vm.masterData.idx_file_nm;
            if(vm.masterData.ex_rate_cd =='0000'){
                vm.masterData.ex_hedge_yn ='Y';
            } 

            axios({
                 method: 'post',
                 url: Config.base_url + "/user/etp/insertEtpRegister",
                 data: { "data" : JSON.stringify(vm.masterData)},
                  headers: {
                        "Content-Type": "application/json"
                    }
                 }).then(function(response) {
                       
                       console.log("insertEtpRegister result>>>", response);
                    if( response.data.result ) {
                         vm.$emit("movePage", 0); 
                    }else{
                        console.log(response.msg);
                    }

                });
        },

         fn_updateEtpRegister: function() {
            var vm = this;
            console.log("fn_updateEtpRegister 호출>> this.masterData ", vm.masterData);
                        
           if(vm.masterData.list_req_date !==undefined && vm.masterData.list_req_date!==null) {
               vm.masterData.listReqDate = vm.masterData.list_req_date.replace(/-/gi, "");
           }
           if(vm.masterData.list_date !==undefined && vm.masterData.list_date!==null) {
               vm.masterData.listDate     = vm.masterData.list_date.replace(/-/gi, "");
           }
           // vm.masterData.req_date     = vm.masterData.req_date.replace(/-/gi, "");
            var json = JSON.stringify(vm.masterData);

            function replacer(name, val) {
                if ( val == null || val==undefined ) {
                    return ""; 
                }  else {
                    return val; // return unchanged
                }
            }   

            axios({
                 method: 'post',
                 url: Config.base_url + "/user/etp/updateEtpRegister",
                 
                 data: { "data" : JSON.stringify(vm.masterData, replacer)},
                 headers: {
                        "Content-Type": "application/json"
                    }
                 }).then(function(response) {
                        
                        console.log("updateEtpRegister result>>>", response);
                     if( response.data.result ) {
                         alert('수정이 완료되었습니다.');
                          vm.$emit("movePage", 0); 
                    }else{
                        console.log(resultData.msg);
                    }
                });
        }
    }
};
</script>