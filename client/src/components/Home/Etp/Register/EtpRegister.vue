<template>
    <v-container>
        <v-layout row wrap class="content_margin etp_new">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">
                                ETP 신청 |
                                <span
                                    class="grey--text"
                                >ETP 신규 신청서 작성 및 상세 내용을 확인, 수정 할 수 있습니다.</span>
                            </h3>
                        </div>
                    </v-card-title>
                </v-card>
                  <!---step1---><!---세션 param의 inst_cd 같은거 -->
                            <v-card class="register_wrap  pt0" color="lighten-1" flat xs12>
                                <h4>1.발행사 정보</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">발행사</v-subheader>
                                        </v-flex>
                                        <v-flex xs3> 
                                        <!--코스콤> 수정> 발행사 선택 불가 -->
                                        <!--코스콤> 수정> 저장된발행사 코드로 selected -->
                                        <!--코스콤> 등록> 발행사 선택 가능-->
                                        <!--일반>   등록> 발행사 파라미터로 받은걸로 selected-->
                                        <v-select  
                                        v-if="masterData.paramInstTypeCd ===koscomSuperUser || masterData.paramInstTypeCd ===koscomUser"  
                                        v-bind:disabled = compInputDisabled
                                            :items="compList"
                                            :selected ="masterData.inst_cd" 
                                            v-model ="masterData.inst_cd"
                                            item-value="value"
                                            item-text="text"
                                            placeholder="선택하세요"
                                            outline
                                            ref="inst_cd"
                                            :rules ="[errors.inst_cd]"
                                        ></v-select>
                                        <v-select
                                        v-else
                                        v-bind:disabled = compInputDisabled
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
                            <!--div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 2">Continue</v-btn>
                            </div-->


                        <!---step2--->
                            <v-card class="register_wrap" color="lighten-1"  flat xs12 >
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
                                            outline
                                            maxlength="50"
                                            ref="isu_kor_nm"
                                            :rules ="[errors.isu_kor_nm]"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r essen">종목영문명</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-bind:disabled= inputDisabled
                                            label="종목영문명" 
                                            v-model="masterData.isu_eng_nm"
                                            outline
                                            maxlength="50"
                                            ref="isu_eng_nm"
                                            :rules ="[errors.isu_eng_nm]"
                                            ></v-text-field>
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
                                            outline
                                            maxlength="12"
                                            :rules ="[errors.isin_code]"
                                            ></v-text-field>
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
                                            outline
                                            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                            maxlength="6"
                                            :rules ="[errors.isu_srt_cd]"
                                            ></v-text-field>
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
                                            <v-layout row wrap >
                                                <v-flex xs4 sm6 md4 >
                                                    <v-menu   
                                                    ref="menu"
                                                        v-model="menu"
                                                        :close-on-content-click="false"
                                                        :nudge-right="40"
                                                        lazy
                                                        transition="v-scale-transition"
                                                        offset-y
                                                        full-width
                                                        min-width="290px"
                                                    >
                                                     
                                                        <template v-slot:activator="{ on }" >
                                                            <v-text-field v-bind:disabled = inputDisabled
                                                                v-model="masterData.list_req_date"
                                                                label="Picker in menu"
                                                                append-icon="event"
                                                                box
                                                                outline
                                                                v-on="on"
                                                                width="100%"
                                                                ref="list_req_date"
                                                                maxlength="10"
                                                               :rules ="[errors.list_req_date]"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            no-title
                                                            scrollable
                                                            v-model="masterData.list_req_date"
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
                                                <v-flex xs4 sm6 md4>
                                                    <v-menu
                                                         ref="menu2"
                                                        v-model="menu2"
                                                        :close-on-content-click="false"
                                                        :nudge-right="40"
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
                                                                width="100%"
                                                                ref="list_date"
                                                                maxlength="10"
                                                                :rules ="[errors.list_date]"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            no-title
                                                            scrollable
                                                             v-model="masterData.list_date"
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
                            <!--div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="fn_insertEtpRegisterStep1()">Continue</v-btn>
                                <v-btn color="grey" depressed dark @click="e1 = 1">Cancel</v-btn>
                            </div-->

                        <!---step3--->
                            
                            <v-card class="register_wrap" color="lighten-1"  flat xs12 >
                                <div v-show="masterData.kor_for_type==='F'">
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
                                             <v-text-field   v-bind:disabled = inputDisabled
                                            label="지수심볼" 
                                            v-model="masterData.idx_sym_code" 
                                            outline 
                                            maxlength="16"
                                            ref="idx_sym_code"
                                            :rules ="[errors.idx_sym_code]"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수명칭</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-bind:disabled = inputDisabled 
                                            label="지수명칭" value outline v-model="masterData.idx_nm" 
                                             maxlength="80"></v-text-field>
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
                                                :rules ="[errors.idx_dist_inst_cd]"
                                            ></v-select>
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
                                                :rules ="[errors.idx_holy_cd]"
                                            ></v-select>
                                            
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
                                                :rules ="[errors.idx_trace_yd_mult_type]"
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
                                            <v-select v-bind:disabled = inputDisabled
                                                :items="items8"
                                                :selected="masterData.idx_close_type"
                                                v-model="masterData.idx_close_type"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                                ref ="idx_close_type"
                                                :rules ="[errors.idx_close_type]"
                                            ></v-select>
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
                                                ref="pre_idx_type"
                                                 :rules ="[errors.pre_idx_type]"
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
                                            <v-text-field v-bind:disabled = inputDisabled 
                                            label="지수파일명" value outline v-model="masterData.idx_file_nm"
                                            maxlength="30" ref="idx_file_nm"
                                            :rules ="[errors.idx_file_nm]"
                                            ></v-text-field>
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
                                             label="기초지수경로" value outline v-model="masterData.idx_file_path"
                                             maxlength="500" ref="idx_file_path"
                                             :rules ="[errors.idx_file_path]"
                                             ></v-text-field>
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
                                                :selected="idxCompDistYn"
                                                v-model="idxCompDistYn"
                                                item-value="value"
                                                item-text="text"
                                                placeholder="선택하세요"
                                                outline
                                                @change='updateIdxDistCheckBox()'
                                                ref="idxCompDistYn"
                                                :rules ="[errors.idxCompDistYn]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수구성종목분배처</v-subheader>
                                        </v-flex>
                                        <v-flex xs5 row class="checkbox_w">
                                            <v-layout row wrap class="light--text">
                                                <v-flex xs2>
                                                    <v-checkbox  v-bind:disabled="idxCompDistYn === 'N' || inputDisabled"
                                                        color="primary"
                                                         :checked="masterData.idx_comp_ksd_dist_yn"
                                                        v-model="masterData.idx_comp_ksd_dist_yn"
                                                        label="예탁원"
                                                        true-value="Y"
                                                        false-value="N"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex xs6> 
                                                    <v-checkbox  v-bind:disabled="idxCompDistYn === 'N' || inputDisabled"
                                                        color="primary"
                                                         :checked="masterData.idx_comp_mirae_dist_yn" 
                                                        v-model="masterData.idx_comp_mirae_dist_yn"
                                                        label="미래에셋펀드서비스"
                                                        true-value="Y"
                                                        false-value="N"
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
                                            <v-text-field label="블룸버그 티커" value outline  v-model="masterData.blom_ticker" v-bind:disabled = inputDisabled maxlength="15"></v-text-field>
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
                                            <v-subheader class="subheader_r">요청사항</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-textarea v-bind:disabled = inputDisabled 
                                            label="요청사항" outline color="blue" v-model="masterData.user_req" maxlength="500"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </div>
                            <div v-show="masterData.kor_for_type==='K'">
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
                                            label="지수심볼"  outline  v-model="masterData.kor_idx_sym_code" ref="kor_idx_sym_code"
                                            :rules ="[errors.kor_idx_sym_code]"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수명칭</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-bind:disabled = inputDisabled
                                            label="지수명칭"  outline v-model="masterData.kor_idx_nm"
                                            :rules ="[errors.kor_idx_nm]"
                                            ></v-text-field>
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
                                                ref="idx_inst_cd"
                                                :rules ="[errors.idx_inst_cd]"
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
                                                ref="idx_comp_cd"
                                                :rules ="[errors.idx_comp_cd]"
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
                                            label="요청사항" outline color="blue"  
                                            v-model="masterData.kor_user_req" maxlength="500" ref="kor_user_req"
                                            :rules ="[errors.kor_user_req]"
                                            ></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </div>       
                            </v-card>

                            <!--div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="fn_insertEtpRegisterStep2()" v-if="masterData.kor_for_type==='F'">Continue</v-btn>
                                <v-btn color="primary" depressed dark @click="e1 = 6" v-else-if="masterData.kor_for_type==='K'">Continue</v-btn>
                                <v-btn color="grey" depressed dark @click="e1 = 2">Cancel</v-btn>
                            </div-->

                        <!---step4--->
                            <v-card class="register_wrap" color="lighten-1"  flat xs12  v-show="masterData.kor_for_type==='F'">
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
                                               :items="code004List"
                                                item-value="value"
                                                item-text="text"
                                                :selected="masterData.ridx_dist_inst_cd"
                                                v-model="masterData.ridx_dist_inst_cd"
                                                placeholder="선택하세요"
                                                outline
                                                ref="ridx_dist_inst_cd"
                                                :rules ="[errors.ridx_dist_inst_cd]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수입수기관심볼</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field  v-bind:disabled="masterData.real_yn === 'N' || inputDisabled"
                                            label="지수입수기관심볼" value outline v-model="masterData.ridx_dist_sym_code" maxlength="16" ></v-text-field>
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
                                                :rules ="[errors.ridx_holy_cd]"
                                            ></v-select>
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
                            <!--div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="fn_insertEtpRegisterStep4()">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 3">Cancel</v-btn>
                            </div-->

                        <!---step5--->
                            <v-card class="register_wrap" color="lighten-1" flat xs12  v-show="masterData.kor_for_type==='F'">
                                <h4>5.참고지수정보 (상품구분이 ETF일때만 입력가능 합니다.)</h4>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">지수심볼</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field  v-bind:disabled="masterData.etp_type !== 'ETF' || inputDisabled"
                                            label value outline  v-model="masterData.refidx_sym_code" ></v-text-field>
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
                                             value outline  v-model="masterData.refidx_file_nm" maxlength="30"></v-text-field>
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
                                            <v-subheader class="subheader_r">요청사항</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-textarea v-bind:disabled="masterData.etp_type !== 'ETF' ||  inputDisabled" 
                                            label="요청사항" outline  color="blue" v-model="masterData.refidx_req" ></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <!--div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="e1 = 6">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 4">Cancel</v-btn>
                            </div-->
                        <!---step6--->
                            <v-card class="register_wrap" color="lighten-1" flat xs12>
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
                                                :rules ="[errors.inav_calc_cd]"
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                 <div class="text-xs-center pt-3 mt-3" v-if="masterData.paramInstTypeCd !==koscomSuperUser && masterData.paramInstTypeCd !==koscomUser ">
                                <v-btn color="primary" depressed dark   v-if="masterData.seq  === ''&& !inputDisabled" @click.prevent="fn_insertEtpRegister('S')">저장</v-btn>
                                <v-btn color="primary" depressed dark   v-if="masterData.seq  !== ''&& !inputDisabled" @click.prevent="fn_insertEtpRegister('U')">수정</v-btn>
                                </div>
                                  <ConfirmDialog ref="confirm" ></ConfirmDialog>
                            </v-card>

                            <!--div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark @click="fn_insertEtpRegister()" 
                                 v-if="masterData.paramInstTypeCd  === '0001' && masterData.seq  == ''" >저장</v-btn>
                                  <v-btn color="primary" depressed dark @click="fn_updateEtpRegister()" 
                                 v-if="masterData.paramInstTypeCd  === '0001' && masterData.seq  !== ''" >수정</v-btn>
                                <v-btn color="primary" depressed dark @click="e1 = 7"  v-else-if="masterData.paramInstTypeCd === '0002'">Continue</v-btn>

                                <v-btn color="grey" depressed dark @click="e1 = 5" v-if="masterData.kor_for_type === 'F'">Cancel</v-btn>
                                <v-btn color="grey" depressed dark @click="e1 = 3" v-if="masterData.kor_for_type === 'K'">Cancel</v-btn>
                            </div-->

                        <!---step7--->
                            <v-card class="register_wrap" color="lighten-1"  flat xs12  v-show="masterData.paramInstTypeCd === koscomSuperUser || masterData.paramInstTypeCd === koscomUser " >
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
                                                :rules ="[errors.inav_calc_yn]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">기초지수MID</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="기초지수MID"  value outline  v-model="masterData.idx_mid"  type="number" maxlength="3"  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"></v-text-field>
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
                                             value outline v-model="masterData.ridx_mid"  type="number" maxlength="3"  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"> </v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">실시간TR</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="실시간TR"  v-bind:disabled = inputDisabled
                                             value outline v-model="masterData.real_idx_tr" maxlength="50"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">종가파일</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field label="종가파일"   v-bind:disabled = inputDisabled
                                            value outline v-model="masterData.close_file" maxlength="500"></v-text-field>
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
                                             value outline v-model="masterData.krx_up_code"  type="number" maxlength="5"  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">사무수탁사업종코드</v-subheader>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field label="사무수탁사업종코드"   v-bind:disabled = inputDisabled
                                             value outline v-model="masterData.agent_up_code"  type="number" maxlength="5"  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2>
                                            <v-subheader class="subheader_r">진행상황</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-textarea  v-bind:disabled = inputDisabled
                                            label="진행상황" outline color="blue" v-model="masterData.proc_stat" maxlength="1000"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <div class="text-xs-center pt-3 mt-3">
                                <v-btn color="primary" depressed dark   v-if="masterData.seq  === '' && !inputDisabled" @click="fn_insertEtpRegister('S')">저장</v-btn>
                                <v-btn color="primary" depressed dark   v-if="masterData.seq  !== '' && !inputDisabled" @click="fn_insertEtpRegister('U')">수정</v-btn>
                                </div>
                            </v-card>
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
            etpUser           : "0001",
            etnUser           : "0002",
            koscomUser        : "9998",
            koscomSuperUser   : "9999",
            compList :[],       //발행사
            code004List :[],    //지수입수기관
            //code0041List :[],   //실시간 지수입수기관(숫자)
            code005List :[],    //실시간휴장일기준
            code006List :[],    //Hedge여부/적용환율
            code007List :[],    //산출식
            code008List :[],    //국내지수산출기관
            code009List :[],    //국내지수타입
            code010List :[],    //사무수탁사
            items2: [{value: "F", text: "해외" }, {value: "K" , text: "국내" }],
            items4: [{value: "", text: "선택하세요." },{value: "ETF", text: "ETF" }, {value: "ETN" , text: "ETN" }],
            //지수추적배수
            items7: [{value: "", text: "선택하세요." },{value: "1", text: "1" }, {value: "-1", text: "-1" },{value: "2", text: "2" },{value: "-2", text: "-2" },{value: "3", text: "3" },{value: "-3", text: "-3" }],
            //지수종가타입
            items8: [{value: "", text: "선택하세요." },{value: "SP", text: "SP" },{value: "TR", text: "TR" },{value: "ER", text: "ER" }],
            //전일기초지수구분
            items9: [{value: "", text: "선택하세요." },{value: "0", text: "T" },{value: "-1", text: "T-1" },{value: "-2", text: "T-2" },{value: "-3", text: "T-3" }],
            items10: [{value: "Y", text: "YES" },{value: "N", text: "NO" }],
            masterData :{},
            inputDisabled: false,
            compInputDisabled: false,
            idxCompDistYn : "N",
            errors : {seq_hist:true, seq:true, isu_kor_nm:true,isu_eng_nm:true,isin_code:true,isu_srt_cd:true,etp_type:true,inst_cd:true,req_date:true,list_req_date:true,list_date:true,krx_dist_yn:true,comp_dist_yn:true,ksd_dist_yn:true,mirae_dist_yn:true,idx_inst_cd:true,idx_sym_code:true,idx_nm:true,idx_dist_inst_cd:true,idx_close_type:true,idx_holy_cd:true,idx_trace_yd_mult_type:true,pre_idx_type:true,idx_file_nm:true,idx_comp_ksd_dist_yn:true,idx_comp_mirae_dist_yn:true,blom_ticker:true,user_req:true,real_yn:"N",ridx_inst_cd:true,ridx_dist_inst_cd:true,ridx_crt_sym_code:true,ridx_dist_sym_code:true,ridx_holy_cd:true,ridx_krx_dist_yn:true,ridx_comp_dist_yn:true,ridx_ksd_dist_yn:true,ridx_mirae_dist_yn:true,ridx_dist_term:true,refidx_sym_code:true,refidx_nm:true,refidx_inst_cd:true,refidx_file_nm:true,refidx_req:true,refidx_blom_ticker:true,ex_rate_cd:true,ex_hedge_yn:true,isin_stat_cd:true,inav_calc_cd:true,idx_rec_yn:true,idx_dis_yn:true,inav_calc_yn:true,idx_mid:true,ridx_mid:true,close_file:true,real_idx_tr:true,proc_stat:true,insert_id:true,insert_time:true,update_id:true,update_time:true,kor_for_type:"F",agent_cd:true,idx_comp_cd:true,krx_up_code:true,agent_up_code:true
                                   ,idx_file_path:true
                                   ,listDate:true, listReqDate:true
                                   ,kor_idx_sym_code:true, kor_idx_nm:true, kor_user_req:true, idxCompDistYn:true},
            seq : 0
        };
    },
    components: {
        ConfirmDialog : ConfirmDialog,
    },
    mounted: function() {
      
             
        this.getEtpRegisterView();
        this.$root.$confirm = this.$refs.confirm;        // 메시지 박스 참조
    },
    created: function() {
          
    },
    computed: {
    }, 
    
    methods: {
        

        //지수구성종목분배여부 N일때 기존 checked 해제
        updateIdxDistCheckBox: function(){
            var vm = this;
            if(vm.idxCompDistYn =='N'){
                vm.masterData.idx_comp_ksd_dist_yn = "N";
                vm.masterData.idx_comp_mirae_dist_yn = "N";
            }
        }
        ,getEtpRegisterView :  function(){
            var vm = this;
             vm.errors = {seq_hist:true, seq:true, isu_kor_nm:true,isu_eng_nm:true,isin_code:true,isu_srt_cd:true,etp_type:true,inst_cd:true,req_date:true,list_req_date:true,list_date:true,krx_dist_yn:true,comp_dist_yn:true,ksd_dist_yn:true,mirae_dist_yn:true,idx_inst_cd:true,idx_sym_code:true,idx_nm:true,idx_dist_inst_cd:true,idx_close_type:true,idx_holy_cd:true,idx_trace_yd_mult_type:true,pre_idx_type:true,idx_file_nm:true,idx_comp_ksd_dist_yn:true,idx_comp_mirae_dist_yn:true,blom_ticker:true,user_req:true,real_yn:"N",ridx_inst_cd:true,ridx_dist_inst_cd:true,ridx_crt_sym_code:true,ridx_dist_sym_code:true,ridx_holy_cd:true,ridx_krx_dist_yn:true,ridx_comp_dist_yn:true,ridx_ksd_dist_yn:true,ridx_mirae_dist_yn:true,ridx_dist_term:true,refidx_sym_code:true,refidx_nm:true,refidx_inst_cd:true,refidx_file_nm:true,refidx_req:true,refidx_blom_ticker:true,ex_rate_cd:true,ex_hedge_yn:true,isin_stat_cd:true,inav_calc_cd:true,idx_rec_yn:true,idx_dis_yn:true,inav_calc_yn:true,idx_mid:true,ridx_mid:true,close_file:true,real_idx_tr:true,proc_stat:true,insert_id:true,insert_time:true,update_id:true,update_time:true,kor_for_type:"F",agent_cd:true,idx_comp_cd:true,krx_up_code:true,agent_up_code:true
                                   ,idx_file_path:true
                                   ,listDate:true, listReqDate:true
                                   ,kor_idx_sym_code:true, kor_idx_nm:true, kor_user_req:true, idxCompDistYn:true};
            console.log('##getEtpRegisterView 호출 error##', vm.errors);
            console.log('##getEtpRegisterView 호출 seq##', vm.seq);
             axios
            .get(Config.base_url + "/user/etp/getEtpRegisterView", {
                    params: {seq: vm.seq}
                })
            .then(function(response) {
                console.log("'##getEtpRegisterView 호출 >>> result##", response.data);
                if(!response.data.result){
                    if( vm.$root.$confirm.open(
                        '[오류]',
                        response.data.msg,
                        {}
                    ,   1
                        )
                    ) {
                            if( "Y" == vm.$root.$confirm.val ) {
                                vm.$emit("movePage", 0); 
                            }
                    }
                }else{
                  //초기화
                    vm.masterData ={
                         seq_hist:"", seq:"", isu_kor_nm:"",isu_eng_nm:"",isin_code:"",isu_srt_cd:"",etp_type:"",inst_cd:"",req_date:"",list_req_date:"",list_date:"",krx_dist_yn:"",comp_dist_yn:"",ksd_dist_yn:"",mirae_dist_yn:"",idx_inst_cd:"",idx_sym_code:"",idx_nm:"",idx_dist_inst_cd:"",idx_close_type:"",idx_holy_cd:"",idx_trace_yd_mult_type:"",pre_idx_type:"",idx_file_nm:"",idx_comp_ksd_dist_yn:"",idx_comp_mirae_dist_yn:"",blom_ticker:"",user_req:"",real_yn:"N",ridx_inst_cd:"",ridx_dist_inst_cd:"",ridx_crt_sym_code:"",ridx_dist_sym_code:"",ridx_holy_cd:"",ridx_krx_dist_yn:"",ridx_comp_dist_yn:"",ridx_ksd_dist_yn:"",ridx_mirae_dist_yn:"",ridx_dist_term:"",refidx_sym_code:"",refidx_nm:"",refidx_inst_cd:"",refidx_file_nm:"",refidx_req:"",refidx_blom_ticker:"",ex_rate_cd:"",ex_hedge_yn:"",isin_stat_cd:"",inav_calc_cd:"",idx_rec_yn:"N",idx_dis_yn:"N",inav_calc_yn:"N",idx_mid:"",ridx_mid:"",close_file:"",real_idx_tr:"",proc_stat:"",insert_id:"",insert_time:"",update_id:"",update_time:"",kor_for_type:"F",agent_cd:"",idx_comp_cd:"",krx_up_code:"",agent_up_code:""
                        ,idx_file_path:""
                        ,listDate:"", listReqDate:""
                        ,kor_idx_sym_code:"", kor_idx_nm:"", kor_user_req:""
                        };
                        
                   //상장신청일, 상장일 디폴트 공백.     
                   // vm.masterData.list_req_date = new Date().toISOString().substr(0, 10);
                   // vm.masterData.list_date = new Date().toISOString().substr(0, 10); 
                    vm.e1= 1;
                    vm.inputDisabled = false;
                  
                    var compList = response.data.compList; //발행사
                    for (let i = 0; i < compList.length; i++) {
                        vm.compList.push({ value: compList[i].INST_CD, text: compList[i].INST_NM });
                    }

                    var code004List = response.data.code004List; //지수입수기관
                         vm.code004List.push({ value: "", text: "선택하세요." });
                    for (let i = 0; i < code004List.length; i++) {
                        vm.code004List.push({ value: code004List[i].M_CD, text: code004List[i].M_CD_NM });
                    }

                    // var code0041List = response.data.code004List; //지수입수기관(숫자)
                    //     vm.code0041List.push({ value: "", text: "선택하세요." });
                    // for (let i = 0; i < code004List.length; i++) {
                    //     vm.code0041List.push({ value: code004List[i].M_CD.substr(2,4), text: code004List[i].M_CD_NM });
                    // }

                    var code005List = response.data.code005List; //실시간휴장일기준
                        vm.code005List.push({ value: "", text: "선택하세요." });
                    for (let i = 0; i < code005List.length; i++) {
                        vm.code005List.push({ value: code005List[i].M_CD, text: code005List[i].M_CD_NM });
                    }

                    var code006List = response.data.code006List; //Hedge여부/적용환율
                         vm.code006List.push({ value: "", text: "선택하세요." });
                    for (let i = 0; i < code006List.length; i++) {
                        vm.code006List.push({ value: code006List[i].M_CD, text: code006List[i].M_CD_NM });
                    }

                    var code007List = response.data.code007List; //산출식
                         vm.code007List.push({ value: "", text: "선택하세요." });
                    for (let i = 0; i < code007List.length; i++) {
                        vm.code007List.push({ value: code007List[i].M_CD, text: code007List[i].M_CD_NM });
                    }

                    var code008List = response.data.code008List;//국내지수산출기관
                        vm.code008List.push({ value: "", text: "선택하세요." });
                    for (let i = 0; i < code008List.length; i++) {
                        vm.code008List.push({ value: code008List[i].M_CD, text: code008List[i].M_CD_NM });
                    }

                    var code009List = response.data.code009List;//국내지수타입
                       vm.code009List.push({ value: "", text: "선택하세요." });
                    for (let i = 0; i < code009List.length; i++) {
                        vm.code009List.push({ value: code009List[i].M_CD, text: code009List[i].M_CD_NM });
                    }

                    var code010List = response.data.code010List; //사무수탁사
                     vm.code010List.push({ value: "", text: "선택하세요." });
                    for (let i = 0; i < code010List.length; i++) {
                        vm.code010List.push({ value: code010List[i].M_CD, text: code010List[i].M_CD_NM });
                    }

                    var paramData = response.data.params;

                    if(response.data.masterData.length > 0){
                        vm.masterData = response.data.masterData[0];
                        console.log("masterData", vm.masterData);

                        if(vm.masterData.kor_for_type==null){
                            vm.masterData.kor_for_type ="F";
                        }

                        if(vm.masterData.idx_comp_mirae_dist_yn=='Y' || vm.masterData.idx_comp_ksd_dist_yn=='Y'){
                            vm.idxCompDistYn = 'Y';
                        }

                        if( (paramData.inst_cd !== vm.masterData.inst_cd) 
                            && (paramData.inst_type_cd !==vm.koscomUser && paramData.inst_type_cd !==vm.koscomSuperUser) ){
                            vm.inputDisabled = true;
                        }

                        var imsi  = vm.masterData.list_req_date;
                        var imsi2 = vm.masterData.list_date;
                        
                        if(imsi  !==undefined && imsi !==null && imsi  !=='')   vm.masterData.list_req_date = imsi.substr(0,4).concat("-").concat(imsi.substr(4,2)).concat("-").concat(imsi.substr(6,2));
                        if(imsi2 !==undefined && imsi2 !==null && imsi2 !=='') vm.masterData.list_date     = imsi2.substr(0,4).concat("-").concat(imsi2.substr(4,2)).concat("-").concat(imsi2.substr(6,2));
                    }

                    if(vm.masterData.kor_for_type =='K'){
                        vm.masterData.kor_idx_sym_code = vm.masterData.idx_sym_code ;
                        vm.masterData.kor_idx_nm       = vm.masterData.idx_nm;
                        vm.masterData.kor_user_req     = vm.masterData.user_req;
                    }
                    
                    
                    //코스콤> 수정페이지에서는 발행사 선택 불가
                    //코스콤> 등록페이지에서는 발행사 선택 가능
                    //일반> 발행사 선택 불가
                
                    if(paramData.inst_type_cd == vm.koscomUser || paramData.inst_type_cd == vm.koscomSuperUser){
                        console.log("masterData.seq",vm.masterData.seq);
                        if(vm.masterData.seq !== undefined && vm.masterData.seq !==''){ //수정 
                            vm.compInputDisabled = true;
                        }else{
                            vm.compInputDisabled = false; //등록
                        }
                    }else{
                        vm.compInputDisabled = true;
                    }

                    console.log("vm.compInputDisabled",vm.compInputDisabled);
                    console.log("paramData",paramData);
                    vm.masterData.paramInstCd=paramData.inst_cd;
                    vm.masterData.paramInstTypeCd=paramData.inst_type_cd;
                  
                    console.log("masterData PARAM PLUS FINAL RESET", vm.masterData);
                }
            });
        },
        
         fn_insertEtpRegister: async function(arg) {
             function replacer(name, val) {
                        if ( val == '' || val==undefined ) {
                            return null; 
                        }  else {
                            return val; // return unchanged
                        }
                    }
            var vm = this;
            vm.errors = {seq_hist:true, seq:true, isu_kor_nm:true,isu_eng_nm:true,isin_code:true,isu_srt_cd:true,etp_type:true,inst_cd:true,req_date:true,list_req_date:true,list_date:true,krx_dist_yn:true,comp_dist_yn:true,ksd_dist_yn:true,mirae_dist_yn:true,idx_inst_cd:true,idx_sym_code:true,idx_nm:true,idx_dist_inst_cd:true,idx_close_type:true,idx_holy_cd:true,idx_trace_yd_mult_type:true,pre_idx_type:true,idx_file_nm:true,idx_comp_ksd_dist_yn:true,idx_comp_mirae_dist_yn:true,blom_ticker:true,user_req:true,real_yn:"N",ridx_inst_cd:true,ridx_dist_inst_cd:true,ridx_crt_sym_code:true,ridx_dist_sym_code:true,ridx_holy_cd:true,ridx_krx_dist_yn:true,ridx_comp_dist_yn:true,ridx_ksd_dist_yn:true,ridx_mirae_dist_yn:true,ridx_dist_term:true,refidx_sym_code:true,refidx_nm:true,refidx_inst_cd:true,refidx_file_nm:true,refidx_req:true,refidx_blom_ticker:true,ex_rate_cd:true,ex_hedge_yn:true,isin_stat_cd:true,inav_calc_cd:true,idx_rec_yn:true,idx_dis_yn:true,inav_calc_yn:true,idx_mid:true,ridx_mid:true,close_file:true,real_idx_tr:true,proc_stat:true,insert_id:true,insert_time:true,update_id:true,update_time:true,kor_for_type:"F",agent_cd:true,idx_comp_cd:true,krx_up_code:true,agent_up_code:true
                        ,idx_file_path:true
                        ,listDate:true, listReqDate:true
                        ,kor_idx_sym_code:true, kor_idx_nm:true, kor_user_req:true, idxCompDistYn:true};
            var hudleYn = "Y";
              console.log("###fn_insertEtpRegister:::", vm.masterData);
            //코스콤은 발행사 수정 가능
            if(vm.masterData.paramInstTypeCd === vm.koscomUser || vm.masterData.paramInstTypeCd == vm.koscomSuperUser){
                if(vm.masterData.inst_cd ==null || vm.masterData.inst_cd ==''){
                    vm.errors.inst_cd = "발행사를 선택해주세요."
                    vm.$refs.inst_cd.focus();
                    hudleYn ='N';
                }
            }

            if(vm.masterData.isu_kor_nm == null || vm.masterData.isu_kor_nm ==''){
                vm.errors.isu_kor_nm = "종목한글명을 입력해주세요."
                vm.$refs.isu_kor_nm.focus();
                hudleYn ='N';
            }
            if(vm.masterData.isu_eng_nm == null || vm.masterData.isu_eng_nm ==''){
                vm.errors.isu_eng_nm = "종목영문명을 입력해주세요."
                vm.$refs.isu_eng_nm.focus();
               hudleYn ='N';
            }
            
            if(vm.masterData.isu_srt_cd !=='' && vm.masterData.isu_srt_cd !==null){
                if(vm.masterData.isin_code =='' || vm.masterData.isin_code ==null){
                    vm.$refs.isin_code.focus();
                    vm.errors.isin_code='단축코드 입력 시 종목코드가 입력되어야 합니다.';
                    hudleYn ='N';
                }
            }

            if(vm.masterData.isin_code !==''&& vm.masterData.isin_code !==null){
                if(vm.masterData.isu_srt_cd =='' || vm.masterData.isu_srt_cd ==null){
                    vm.$refs.isu_srt_cd.focus();
                    vm.errors.isu_srt_cd='종목코드 입력 시 단축코드가 입력되어야 합니다.';
                    hudleYn ='N';
                }
            }

             if(vm.masterData.isin_code !=='' && vm.masterData.isin_code !==null){
                if(vm.masterData.list_req_date =='' || vm.masterData.list_req_date ==null){
                    vm.$refs.list_req_date.focus();
                     vm.errors.list_req_date='종목코드 입력 시 상장신청일이 입력되어야 합니다.';
                   hudleYn ='N';
                }

                if(vm.masterData.list_date =='' || vm.masterData.list_date ==null){
                   vm.$refs.list_date.focus();
                    vm.errors.list_date='종목코드 입력 시 상장일이 입력되어야 합니다.';
                   hudleYn ='N';
                }

                if(vm.masterData.inav_calc_cd =='' || vm.masterData.inav_calc_cd ==null){
                    vm.$refs.inav_calc_cd.focus();
                    vm.errors.inav_calc_cd='종목코드 입력 시 iNAV/iV 관련정보가 입력되어야 합니다.';
                   hudleYn ='N';
                }
            }

            //외국종목
            if(vm.masterData.kor_for_type==='F'){   
                var check= /[ㄱ-ㅎ|ㅓ-ㅣ|가-힣]/;
                if(check.test(vm.masterData.idx_sym_code)){
                    vm.errors.idx_sym_code = "지수심볼에 한글은 들어갈수 없습니다.";
                    vm.$refs.idx_sym_code.focus();
                   hudleYn ='N';
                }
                if(vm.masterData.idx_sym_code =='' || vm.masterData.idx_sym_code ==null){
                   vm.errors.idx_sym_code = "지수심볼을 입력해주세요.";
                     vm.$refs.idx_sym_code.focus();
                   hudleYn ='N';
                }
                if(vm.masterData.idx_dist_inst_cd =='' || vm.masterData.idx_dist_inst_cd ==null){
                    vm.errors.idx_dist_inst_cd = "지수입수기관을 입력해주세요.";
                   vm.$refs.idx_dist_inst_cd.focus();
                   hudleYn ='N';
                }
                if(vm.masterData.idx_holy_cd =='' || vm.masterData.idx_holy_cd ==null){
                    vm.errors.idx_holy_cd = "실시간휴장일기준을 입력해주세요.";
                   vm.$refs.idx_holy_cd.focus();
                   hudleYn ='N';
                }
                
                if(vm.masterData.idx_trace_yd_mult_type =='' || vm.masterData.idx_trace_yd_mult_type ==null){
                    vm.errors.idx_trace_yd_mult_type = "지수추적배수을 입력해주세요.";
                    vm.$refs.idx_trace_yd_mult_type.focus();
                   hudleYn ='N';
                }
                
                if(vm.masterData.idx_close_type=='' || vm.masterData.idx_close_type ==null){
                    vm.errors.idx_close_type = "지수종가타입을 입력해주세요.";
                    vm.$refs.idx_close_type.focus();
                   hudleYn ='N';
                }

                if(vm.masterData.pre_idx_type=='' || vm.masterData.pre_idx_type ==null){
                    vm.errors.pre_idx_type = "전일기초지수구분을 입력해주세요.";
                   vm.$refs.pre_idx_type.focus();
                   hudleYn ='N';
                }

                if(vm.masterData.idx_file_nm=='' || vm.masterData.idx_file_nm ==null){
                    vm.errors.idx_file_nm = "지수파일명을 입력해주세요.";
                  vm.$refs.idx_file_nm.focus();
                   hudleYn ='N';
                }

                if(vm.masterData.idx_file_path=='' || vm.masterData.idx_file_path ==null){
                    vm.errors.idx_file_path =  "기초지수경로을 입력해주세요.";
                  vm.$refs.idx_file_path.focus();
                   hudleYn ='N';
                }

                // if(vm.idxCompDistYn.length=='' || vm.masterData.idxCompDistYn ==null){
                //     vm.errors.idxCompDistYn = "this field is required";
                //     vm.$refs.idxCompDistYn.focus();
                //    hudleYn ='N';
                // }
            //국내종목   
            }else if(vm.masterData.kor_for_type==='K'){   
                var check= /[ㄱ-ㅎ|ㅓ-ㅣ|가-힣]/;
                if(check.test(vm.masterData.kor_idx_sym_code)){
                    vm.errors.kor_idx_sym_code = "지수심볼에 한글은 들어갈수 없습니다.";
                   vm.$refs.kor_idx_sym_code.focus();
                   hudleYn ='N';
                }
                if(vm.masterData.kor_idx_sym_code=='' || vm.masterData.kor_idx_sym_code ==null){
                    vm.errors.kor_idx_sym_code = "지수심볼을 입력해주세요.";
                    vm.$refs.kor_idx_sym_code.focus();
                   hudleYn ='N';
                }
                if(vm.masterData.idx_inst_cd=='' || vm.masterData.idx_inst_cd ==null){
                    vm.errors.idx_inst_cd = "지수산출기관을 입력해주세요.";
                    vm.$refs.idx_inst_cd.focus();
                   hudleYn ='N';
                }
                if(vm.masterData.idx_comp_cd =='' || vm.masterData.idx_comp_cd ==null){
                    vm.errors.idx_comp_cd = "지수타입을 입력해주세요.";
                    vm.$refs.idx_comp_cd.focus();
                   hudleYn ='N';
                }
                
                if(vm.masterData.kor_user_req =='' || vm.masterData.kor_user_req ==null){
                    vm.errors.kor_user_req = "요청사항을 입력해주세요.";
                   vm.$refs.kor_user_req.focus();
                   hudleYn ='N';
                }
            }
        
            if(vm.masterData.ridx_dist_sym_code !=='' && vm.masterData.ridx_dist_sym_code !==null){
                if(vm.masterData.ridx_dist_inst_cd ==='' || vm.masterData.ridx_dist_inst_cd == null){
                     vm.$refs.ridx_dist_inst_cd.focus();
                     vm.errors.ridx_dist_inst_cd = '실시간 지수입수기관심볼 입력 시 실시간 지수입수기관이 입력되어야 합니다.';
                   hudleYn ='N';
                }

                if(vm.masterData.ridx_holy_cd ==='' || vm.masterData.ridx_holy_cd ==null){
                     vm.$refs.ridx_holy_cd.focus();
                     vm.errors.ridx_holy_cd = '실시간 지수입수기관심볼 입력 시 실시간 휴장일 기준이 입력되어야 합니다.';
                   hudleYn ='N';
                }
            }

            //날짜형식체크
            if(vm.masterData.list_req_date !==undefined && vm.masterData.list_req_date!==null && vm.masterData.list_req_date!=="") {
                vm.masterData.listReqDate = vm.masterData.list_req_date.replace(/-/gi, "");
            }else{
                vm.masterData.listReqDate = null; //미입력시 NULL로 저장/수정(다른데이터는 공백으로)
            }

            if(vm.masterData.list_date !==undefined && vm.masterData.list_date!==null && vm.masterData.list_date!=="") {
                vm.masterData.listDate     = vm.masterData.list_date.replace(/-/gi, "");
            }else{
                vm.masterData.listDate    = null;
            }

            if(vm.masterData.isin_code !=''){
                if(vm.masterData.inav_calc_cd  ==''){
                     vm.$refs.inav_calc_cd.focus();
                     vm.errors.inav_calc_cd='종목코드 입력 시 iNAV/iV 관련정보가 입력되어야 합니다.';
                   hudleYn ='N';
                }
            }

            if(vm.masterData.inav_calc_yn =='Y'){
                if(vm.masterData.isin_code ==='' || vm.masterData.isin_code ==null){
                     vm.$refs.isin_code.focus();
                     vm.errors.isin_code='iNAV산출여부가 Y일 때 종목코드, 상장신청일, 상장일이 입력되어야 합니다.';
                   hudleYn ='N';
                }
                
                if(vm.masterData.list_req_date =='' || vm.masterData.list_req_date ==null){
                    vm.$refs.list_req_date.focus();
                    vm.errors.list_req_date='iNAV산출여부가 Y일 때 종목코드, 상장신청일, 상장일이 입력되어야 합니다.';
                   hudleYn ='N';
                }

                if(vm.masterData.list_date =='' || vm.masterData.list_date ==null){ 
                     vm.$refs.list_date.focus();
                     vm.errors.list_date='iNAV산출여부가 Y일 때 종목코드, 상장신청일, 상장일이 입력되어야 합니다.';
                   hudleYn ='N';
                }

            }

            // if(vm.masterData.ex_rate_cd =='0000'){
            //     vm.masterData.ex_hedge_yn ='Y';
            // } 

   
                if(arg ==='S' && hudleYn =='Y'){
                    console.log("fn_insertEtpRegister 호출>> this.masterData ", vm.masterData);
                    if( await this.$root.$confirm.open(
                            "[저장]",
                            "저장하시겠습니까?",
                            {}
                        ,   2
                        )
                    ){
                        if( "Y" != this.$root.$confirm.val ) {
                            return false;
                        }
                    } 
                    var origin_file_nm =  vm.masterData.idx_file_nm;
                    if(vm.masterData.idx_file_path !=='' && vm.masterData.idx_file_path !=null){ 
                        vm.masterData.idx_file_nm= vm.masterData.idx_file_path + "/" + vm.masterData.idx_file_nm;
                    }
                    
                    //int type파라미터
                    // idx_trace_yd_mult_type(지수추적배수)
                    // pre_idx_type(전일기초지수구분)
                    // ridx_dist_term(지수제공주기)
                    // idx_mid(기초지수MID)
                    // ridx_mid(실시간지수MID)
                    // krx_up_code(거래소업종코드)
                    // agent_up_code(사무사수탁업종코드)

                    await axios({
                        method: 'post',
                        url: Config.base_url + "/user/etp/insertEtpRegister",
                        data: { "data" : JSON.stringify(vm.masterData, replacer)},
                        headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(function(response) {
                            
                            console.log("insertEtpRegister result>>>", response);
                            if( response.data.result ) {
                                if(  vm.$root.$confirm.open(
                                    '[저장]',
                                    '저장이 완료되었습니다.',
                                    {}
                                ,   1
                                    )
                                ) {
                                    if( "Y" == vm.$root.$confirm.val ) {
                                        vm.$emit("movePage", 0); 
                                    }
                                }
                            }else{
                                if( vm.$root.$confirm.open(
                                    '[오류]',
                                    response.data.msg,
                                    {}
                                ,   1
                                    )
                                ) {
                                    vm.masterData.idx_file_nm = origin_file_nm;
                                    return false;
                                }
                            }

                        });
                }else if(arg ==='U' && hudleYn =='Y'){
                    console.log("fn_updateEtpRegister 호출>> this.masterData ", vm.masterData);
                    if(vm.masterData.isin_stat_cd =='0002' && vm.masterData.idx_rec_yn =='N'){
                        if( await this.$root.$confirm.open(
                                '[저장]',
                                '기초지수입수여부가 "N"으로 변경되어 종목신청상태로 돌아갑니다.',
                                {}
                            ,   2
                                )
                            ) {
                                if( "Y" != this.$root.$confirm.val ) {
                                    return false;
                                }
                            }
                    }

                    if( await this.$root.$confirm.open(
                                '[수정]',
                                '수정하시겠습니까',
                                {}
                            ,   2
                                )
                            ) {
                                if( "Y" != this.$root.$confirm.val ) {
                                    return false;
                                }
                            }
                    if(vm.masterData.idx_file_path !=='' && vm.masterData.idx_file_path !=null){ 
                        vm.masterData.idx_file_nm= vm.masterData.idx_file_path + "/" + vm.masterData.idx_file_nm;
                    }
                 
                 
                    await axios({
                        method: 'post',
                        url: Config.base_url + "/user/etp/updateEtpRegister",
                        data: { "data" : JSON.stringify(vm.masterData, replacer)},
                        headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(function(response) {
                                
                                console.log("updateEtpRegister result>>>", response);
                            if( response.data.result ) {
                                if( vm.$root.$confirm.open(
                                    '[수정]',
                                    '수정이 완료되었습니다.',
                                    {}
                                ,   1
                                    )
                                ) {
                                    if( "Y" == vm.$root.$confirm.val ) {
                                            vm.$emit("movePage", 0); 
                                    }
                                    
                                }
                                //alert('수정이 완료되었습니다.');
                            
                            }else{
                                if( vm.$root.$confirm.open(
                                    '[오류]',
                                    response.data.msg,
                                    {}
                                ,   1
                                    )
                                ) {
                                    vm.masterData.idx_file_nm = origin_file_nm;
                                    return false;
                                }
                            }
                    });
                }

         
        }
    }
};
</script>