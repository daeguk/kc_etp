<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline mb-0">
                            EPT 신청현황 |
                            <span
                                class="grey--text"
                            >코스콤에 신청하신 ETP목록 및 ETP별 진행 상태를 확인 할 수 있습니다.</span>
                        </h3>
                    </v-card-title>
                </v-card>
                <v-card flat>
                    <v-layout row wrap class="etp_apply_w">
                        <v-flex xs2 mt-2 ml-3 mb-3 mr-2>
                            <v-card dark flat color="#42a4e1" class="apply_pre">
                                <v-icon>border_color</v-icon>신청: 12건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#1976d2">
                                <v-icon>assessment</v-icon>지수입수: 6건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#3158a1">
                                <v-icon>assignment</v-icon>지수분배: 0건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#128293">
                                <v-icon>insert_drive_file</v-icon>종목코드 신청: 8건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#0abcc2">
                                <v-icon>exposure</v-icon>iNAV산출 :4건
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
                <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="results"
                    :rows-per-page-items="rowsPerPageItems"
                    light
                    hide-actions
                    disable-initial-sort
                    class="table_line1 etp_apply_ta"
                >
                    <template slot="items" slot-scope="props">
                        <td>
                            <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                        </td>
                        <td class="text-xs-center">{{ props.index+1 }}</td>
                        <td class="text-xs-center">
                            <v-dialog v-model="dialog2" persistent max-width="550">
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on">한국투자 증권</v-btn>
                                </template>
                                <!---발행사 담당자 연락처 팝업 내용-->
                                <v-card>
                                <h5>
                                    <v-card-title ma-0>
                                        발행사 담당자 연락처
                                        <v-spacer></v-spacer>
                                        <v-btn icon dark @click="dialog2 = false">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>
                                <v-card flat>
                                    <v-data-table
                                        :headers="headers2"
                                        :items="desserts2"
                                        :search="search"
                                        hide-actions
                                        class="elevation-1 table_line4"
                                    >
                                        <template v-slot:items="props">
                                            <td class="text-xs-center">{{ props.item.name11 }}</td>
                                            <td class="text-xs-center">{{ props.item.phone }}</td>
                                            <td class="text-xs-center">{{ props.item.phone2 }}</td>
                                            <td class="text-xs-center">{{ props.item.email }}</td>
                                        </template>
                                        <v-alert
                                            v-slot:no-results
                                            :value="true"
                                            color="error"
                                            icon="warning"
                                        >Your search for "{{ search }}" found no results.</v-alert>
                                    </v-data-table>
                                </v-card>
                                <v-card class="pop_bot_h"></v-card>
                            </v-card>
                            <!---발행사 담당자 연락처 팝업 내용end-->
                            </v-dialog>
                        </td>
                        <td class="text-xs-left">{{ props.item.isu_kor_nm }}</td>
                        <td class="text-xs-left">{{ props.item.req_date }}</td>
                        <td class="text-xs-left">{{ props.item.kor_for_type }}</td>
                        <td class="text-xs-center">
                            <v-dialog v-model="dialog3" persistent max-width="550">
                                <template v-slot:activator="{ on }">
                            <v-btn small depressed dark color="#1976d2" v-on="on">기초지수</v-btn>
                            </template>
                                <!---발행사 담당자 연락처 팝업 내용-->
                                <v-card>
                                <h5>
                                    <v-card-title ma-0>
                                        발행사 담당자 연락처
                                        <v-spacer></v-spacer>
                                        <v-btn icon dark @click="dialog3 = false">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>
                                <v-card flat>
                                    <v-data-table
                                        :headers="headers3"
                                        :items="desserts3"
                                        :search="search"
                                        hide-actions
                                        class="elevation-1 table_line4"
                                    >
                                        <template v-slot:items="props">
                                            <td class="text-xs-center">{{ props.item.name11 }}</td>
                                            <td class="text-xs-center">{{ props.item.phone }}</td>
                                            <td class="text-xs-center">{{ props.item.phone2 }}</td>
                                            <td class="text-xs-center">{{ props.item.email }}</td>
                                        </template>
                                        <v-alert
                                            v-slot:no-results
                                            :value="true"
                                            color="error"
                                            icon="warning"
                                        >Your search for "{{ search }}" found no results.</v-alert>
                                    </v-data-table>
                                </v-card>
                                <v-card class="pop_bot_h"></v-card>
                            </v-card>
                            <!---발행사 담당자 연락처 팝업 내용end-->
                            </v-dialog>
                            <v-btn small depressed dark color="#42a4e1">iIV</v-btn>
                        </td>

                        <!--처리현황 신청일경우-->
                        <!--td class="text-xs-left">
                            <v-stepper value="1">
                                    <v-stepper-header>
                                        <v-stepper-step step="1">신청
                                         <small>담당자 접수 중</small></v-stepper-step>
                                        <v-divider></v-divider>
                                        <v-stepper-step step="2">지수 </v-stepper-step>
                                        <v-divider></v-divider>
                                         <v-stepper-step step="3">코드</v-stepper-step>
                                        <v-divider></v-divider>
                                        <v-stepper-step step="4">iNAV </v-stepper-step>
                                    </v-stepper-header>
                                </v-stepper>
                        </td-->
                        <!-- 처리현황 지수일경우--->
                        <!--td class="text-xs-left">
                            <v-stepper value="2">
                                    <v-stepper-header>
                                        <v-stepper-step step="1" complete>신청</v-stepper-step>
                                        <v-divider class="divider_on"></v-divider>
                                        <v-stepper-step step="2">
                                            지수
                                            <small>표준코드 입력 대기중</small>
                                        </v-stepper-step>
                                        <v-divider></v-divider>
                                        <v-stepper-step step="3">코드</v-stepper-step>
                                        <v-divider></v-divider>
                                        <v-stepper-step step="4">iNAV </v-stepper-step>
                                    </v-stepper-header>
                                </v-stepper>
                        </td-->
                        <!-- 처리현황 코드일경우--->
                        <td class="text-xs-left">
                            <v-stepper value="3">
                                <v-stepper-header>
                                    <v-stepper-step step="1" complete>신청</v-stepper-step>
                                    <v-divider class="divider_on"></v-divider>
                                    <v-stepper-step step="2" complete>지수</v-stepper-step>
                                    <v-divider class="divider_on"></v-divider>
                                    <v-stepper-step step="3">
                                        코드
                                        <small>표준코드 입력 대기중</small>
                                    </v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step step="4">iNAV</v-stepper-step>
                                </v-stepper-header>
                            </v-stepper>
                        </td>

                        <!--처리현황 iNAV일경우--->
                        <!--td class="text-xs-left">
                            <v-stepper value="4">
                                    <v-stepper-header>
                                        <v-stepper-step step="1" complete>신청</v-stepper-step>
                                        <v-divider class="divider_on"></v-divider>
                                        <v-stepper-step step="2" complete>
                                            지수
                                        
                                        </v-stepper-step>
                                        <v-divider class="divider_on">></v-divider>
                                        <v-stepper-step step="3" complete>코드</v-stepper-step>
                                        <v-divider class="divider_on"></v-divider>
                                        <v-stepper-step step="4">iNAV
                                            <small>iNAV/iV 산출테스트 중</small>
                                        </v-stepper-step>
                                    </v-stepper-header>
                                </v-stepper>
                        </td-->
                    </template>
                </v-data-table>
                <div class="text-xs-right my-3">
                    <v-btn depressed color="#9e9e9e" dark>삭제</v-btn>
                    <v-btn depressed color="#42a4e1" dark>엑셀</v-btn>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Config from "@/js/config.js";

export default {
    props: [],
    data() {
        return {
            seasons: ["신청", "지수", "코드", "iNAV"],
            rowsPerPageItems: [20, 10, 30, 50],
            dialog: false,
            dialog2: false,
            dialog3: false,
            selected: [],
            headers: [
                {
                    text: "",
                    align: "center",
                    sortable: false,
                    value: "index",
                    width: "20px"
                },
                {
                    text: "No",
                    align: "center",
                    sortable: false,
                    value: "index"
                },
                { text: "발행사", align: "center", value: "inst_name" },
                { text: "종목명", align: "center", value: "isu_kor_nm" },
                { text: "신청일", align: "left", value: "req_date" },
                { text: "국내/해외", align: "left", value: "kor_for_type" },
                { text: "기초지수", align: "center", value: "basic_idx" },
                {
                    text: "처리현황",
                    align: "center",
                    value: "isu_eng_nm",
                    width: "510px"
                }
            ],
            headers2: [
                {
                    text: "담당자",
                    align: "center",
                    value: "name11",
                    width: "20px"
                },
                {
                    text: "전화번호",
                    align: "center",
                    value: "phone"
                },
                { text: "휴대전화", align: "center", value: "phone2" },
                { text: "이메일", align: "center", value: "email" },
            ],
            desserts2: [
                {
                    name11: "제가현",
                    phone: "0-2356-5878",
                    phone2:"010-222-2222",
                    email: "7845dsfe@naver.com",
                },
                {
                    name11: "제가현",
                    phone: "0-2356-5878",
                    phone2:"010-222-2222",
                    email: "7845dsfe@naver.com",
                },
                {
                   name11: "제가현",
                    phone: "0-2356-5878",
                    phone2:"010-222-2222",
                    email: "7845dsfe@naver.com",
                },
               {
                   name11: "제가현",
                    phone: "0-2356-5878",
                    phone2:"010-222-2222",
                    email: "7845dsfe@naver.com",
                }
            ],
            results: [
                {
                    inst_name: "test",
                    isu_kor_nm: "11"
                }
            ],
            modalFlag: false
        };
    },
    components: {},
    computed: {},
    mounted: function() {
        this.getEtpApplyList();
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
        getEtpApplyList: function() {
            console.log("getEtpApplyList");
            var vm = this;

            axios
                .get(Config.base_url + "/user/etp/getetpapplylist", {
                    params: {
                        // "bbs_id" : vm.bbs_id,
                        // "seloption" : vm.seloption,
                        // "searchinfo" : vm.searchinfo,
                        // "curPage": vm.curPage,
                        // "perPage": vm.perPage
                    }
                })
                .then(function(response) {
                    console.log(response);
                    if (response.data.success == false) {
                        alert("해당 신청현황이 없습니다");
                    } else {
                        var items = response.data.results;
                        var tcount = response.data.count;
                        items.forEach(function(item, index) {
                            if (item.kor_for_type == "K") {
                                item.kor_for_type = "국내";
                            } else if (item.kor_for_type == "F") {
                                item.kor_for_type = "해외";
                            } else {
                                item.kor_for_type = "";
                            }
                        });
                        vm.results = items;
                        vm.count = tcount;
                    }
                });
        }
    }
};
</script>

