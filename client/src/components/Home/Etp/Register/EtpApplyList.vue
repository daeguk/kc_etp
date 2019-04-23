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
                            <v-card dark flat color="#466eb9">
                                <v-icon>assignment</v-icon>지수분배: 0건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#48485e">
                                <v-icon>insert_drive_file</v-icon>종목코드 신청: 8건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#727281">
                                <v-icon>exposure</v-icon>iNAV산출 :4건
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
                <!--테이블 td안 참고--->
                <v-card>
                    <table id="test" class="display table01_w">
                       <colgroup>
                            <col width="5%">
                            <col width="10%">
                            <col width="10%">
                            <col width="10%">
                            <col width="5%">
                            <col width="15%">
                            <col width="15%">
                            <col width="30%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>발행사</th>
                                <th>종목명</th>
                                <th>신청일</th>
                                <th>국내/해외</th>
                                <th>기초지수</th>
                                <th></th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="checkbox" class="checkbox_css">
                                </td>
                                <td>
                                    <a href>한국투자증권</a>
                                    <!--발행사 담당자 연락처 팝업
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
                                                <table id="example2" class="display table01_w">
                                                    <colgroup>
                                                        <col width="25%">
                                                        <col width="25%">
                                                        <col width="25%">
                                                        <col width="25%">
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th>담당자</th>
                                                            <th>전화번호</th>
                                                            <th>휴대전화</th>
                                                            <th>이메일</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                               </v-card>
                                            <v-card class="pop_bot_h"></v-card>
                                        </v-card>
                                        -->
                                </td>
                                <td>TRUE 골드 커버드콜 ETN</td>
                                <td>2019.01.11</td>
                                <td>해외</td>
                                <td>SPCLGCTR</td>
                                <td>
                                    <v-dialog v-model="dialog2" persistent max-width="550">
                                        <template v-slot:activator="{ on }">
                                            <button
                                                type="button"
                                                class="v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01"
                                                v-on="on"
                                            >기초지수</button>
                                        </template>
                                        <!--기초지수 팝업 내용-->
                                        <v-card>
                                            <h5>
                                                <v-card-title ma-0>
                                                    기초지수
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon dark @click="dialog2 = false">
                                                        <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                            </h5>
                                            <v-card flat>
                                                <table id="example2" class="display table01_w">
                                                    <colgroup>
                                                        <col width="20%">
                                                        <col width="20%">
                                                        <col width="60%">
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th>심플코드</th>
                                                            <th>
                                                                <v-select
                                                                    :items="items1"
                                                                    value
                                                                    placeholder="실시간종가"
                                                                ></v-select>
                                                            </th>
                                                            <th>지수명</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                                <table id="example3" class="display table01_w">
                                                    <colgroup>
                                                        <col width="50%">
                                                        <col width="50%">
                                                    </colgroup>
                                                     <thead>
                                                        <tr>
                                                            <th>일자</th>
                                                            <th>현재가</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </v-card>
                                            <v-card class="pop_bot_h"></v-card>
                                        </v-card>
                                        <!--기초지수 팝업 내용end-->
                                    </v-dialog>
                                     <v-dialog v-model="dialog3" persistent max-width="550">
                                        <template v-slot:activator="{ on }">
                                            <button
                                                type="button"
                                                class="v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01"
                                                v-on="on"
                                            >iNAV</button>
                                        </template>
                                        <!--iNAV 팝업 내용-->
                                        <v-card>
                                            <h5>
                                                <v-card-title ma-0>
                                                    iNAV
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon dark @click="dialog3 = false">
                                                        <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                            </h5>
                                            <v-card flat>
                                                <table id="example2" class="display table01_w">
                                                    <colgroup>
                                                        <col width="50%">
                                                        <col width="50%">
                                                    </colgroup>
                                                    <thead>
                                                        <colgroup>
                                                        <col width="50%">
                                                        <col width="50%">
                                                    </colgroup>
                                                        <tr>
                                                            <th>심볼코드</th>
                                                            <th>ETP 종목명</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                               </v-card>
                                            <v-card>
                                             <v-card-title class="text-xs-right">기준일자:2019.12.11</v-card-title>
                                                <table id="example3" class="display table01_w">
                                                    <colgroup>
                                                        <col width="50%">
                                                        <col width="50%">
                                                    </colgroup>
                                                     <thead>
                                                        <tr>
                                                            <th>일자</th>
                                                            <th>현재가</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                        </v-card>
                                            <v-card class="pop_bot_h"></v-card>
                                        </v-card>
                                        <!--iNAV 내용end-->
                                    </v-dialog>
                                </td>
                                <td>
                                    <div class="progress">
                                        <ol>
                                            <li class="on"><span><b>신청</b> : 담당자 접수중</span></li>
                                            <li ><span> <b>지수</b></span></li>
                                            <li ><span> <b>코드</b></span></li>
                                            <li class="last"><span><b>iNAV</b></span></li>
                                        </ol>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><div class="progress">
                                        <ol>
                                            <li class="on"><span><b>신청</b> </span></li>
                                            <li class="on" ><span> <b>지수</b> : 담당자 접수중</span></li>
                                            <li ><span><b>코드</b></span></li>
                                            <li class="last"><span><b>iNAV</b></span></li>
                                        </ol>
                                    </div></td>
                            </tr>
                            <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><div class="progress">
                                        <ol>
                                            <li class="on"><span><b>신청</b></span></li>
                                            <li class="on"><span> <b>지수</b></span></li>
                                            <li class="on"><span><b>코드</b> : 표준코드 입력대기중</span></li>
                                            <li class="last"><span><b>iNAV</b></span></li>
                                        </ol>
                                    </div></td>
                            </tr>

                            <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                    <div class="progress">
                                        <ol>
                                            <li class="on"><span><b>신청</b></span></li>
                                            <li class="on"><span> <b>지수</b></span></li>
                                            <li class="on"><span><b>코드</b></span></li>
                                            <li class="on_last"><span><b>iNAV</b> : 표준코드 입력대기중</span></li>
                                        </ol>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-card>
                <!---테이블 td안 참고end--->
                <!---실제적용 테이블--->
                <v-card flat>
                    <table id="example1" class="display table01_w">
                        <colgroup>
                            <col width="2%">
                            <col width="2%">
                            <col width="12%">
                            <col width="12%">
                            <col width="9%">
                            <col width="7%">
                            <col width="9%">
                            <col width="17%">
                            <col width="30%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th></th>
                                <th>No</th>
                                <th>발행사</th>
                                <th>종목명</th>
                                <th>신청일</th>
                                <th>국내/해외</th>
                                <th>기초지수</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                    </table>
                </v-card>
                <!---실제적용 테이블end--->

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
                    </template>

                <div class="text-xs-right my-3">
                    <v-btn depressed color="#9e9e9e" dark>삭제</v-btn>
                    <v-btn depressed color="#48485e" dark>엑셀</v-btn>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import Config from "@/js/config.js";
var table = null;

export default {
    props: [],

    data() {
        return {
            results: [],
            loadingbar: false,
            list_cnt: 0,
            dialog2: false,
            dialog3: false,
            items1: ["실시간", "종가"]
        };
    },
    components: {},
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        var vm = this;
        vm.getEtpApplyList();
    },
    methods: {
        getEtpApplyList: function() {
            console.log("getEtpApplyList");
            this.loadingbar = true;
            axios
                .get(Config.base_url + "/user/etp/getEtpApplyList", {
                    params: {}
                })
                .then(response => {
                      console.log("console:" + response);
                    if (response.data.success == false) {
                        alert("ETP신청현황  목록이 없습니다");
                    } else {
                        var items = response.data.results;

                        //console.log("response=" + JSON.stringify(items));
                        this.results = items;
                        this.list_cnt = this.results.length;
                          table = $("#example1").DataTable({
                            processing: true,
                            serverSide: false,
                            info: true, // control table information display field
                            stateSave: true, //restore table state on page reload,
                            lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                            paging: false,
                            searching: false,
                            data: this.results,
                            //list_cnt : this.results.length,
                               columnDefs: [
                                 {  
                                     "data": "num",
                                     "render": function ( data, type, row ,meta) {
                                        return meta.row + meta.settings._iDisplayStart + 1;
                                    },   
                                    "targets": 1 
                                },  
                                {  
                                    "render": function ( data, type, row ) {
                                        var etpType = (row.etp_type == "ETN")  ? "iIV" : "iNAV" ;
                                        let shtml = "" ;
                                        if (row.isin_stat_cd == "0001"|| row.isin_stat_cd == "0008" ) {
                                            shtml += "<button type='button' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01' v-on='off'>기초지수</button><button type='button' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01' v-on='off'>" + etpType + "</button>"; 
                                        }else if(row.isin_stat_cd == "0002" || row.isin_stat_cd == "0003" ){
                                             shtml += "<button type='button' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01' v-on='on'>기초지수</button><button type='button' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01' v-on='off'>" + etpType + "</button>"; 
                                        }else if(row.isin_stat_cd == "0004"){
                                            shtml += "<button type='button' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01' v-on='on'>기초지수</button><button type='button' class='v-btn v-btn--outline v-btn--small v-btn--depressed btn_intable_01' v-on='on'>" + etpType + "</button>"; 
                                        }
                                        return shtml;
                                    },   
                                    "targets": 7 
                                },  
                                                                {  
                                    "render": function ( data, type, row ) {
                                         let shtml = '' ;
                                         shtml += '<td> <div class="progress"> <ol>' ;
                                         if (row.isin_stat_cd == "0001"){ 
                                            shtml += '<li class="on"><span><b>신청</b> : 담당자 접수중</span></li><li ><span> <b>지수</b></span></li><li ><span> <b>코드</b></span></li><li class="last"><span><b>iNAV</b></span></li>' ;
                                         }else if(row.isin_stat_cd == "0002"){
                                            shtml += '<li class="on"><span><b>신청</b></span></li><li class="on"><span> <b>지수 </b>: 표준코드 입력대기중</span></li><li ><span> <b>코드</b></span></li><li class="last"><span><b>iNAV</b></span></li>' ;                                            
                                         }else if(row.isin_stat_cd == "0003"){
                                            shtml += '<li class="on"><span><b>신청</b></span></li><li class="on"><span> <b>지수 </b></span></li><li class="on"><span> <b>코드</b>: iNAV/iIV 산출대기중</span></li><li class="last"><span><b>iNAV</b></span></li>' ;                                            
                                         }else if(row.isin_stat_cd == "0004"){
                                            shtml += '<li class="on"><span><b>신청</b></span></li><li class="on"><span> <b>지수</b></span></li><li class="on"><span><b>코드</b></span></li><li class="on_last"><span><b>iNAV</b> : iNAV/iIV 산출테스트 중 </span></li>' ;                                            
                                         }else if(row.isin_stat_cd == "0008"){
                                            shtml += '상장보류' ;                                            
                                         }
                                         shtml += '</ol></div></td>' ;
                                         return shtml;
                                    },   
                                    "targets": 8 
                                },  
                            ],
                            columns: [
                                //{ "defaultContent": "<button type='button' class='btn btn-primary btn-xs'>Trial Run</button>" },
                                {
                                   data: "null",
                                   className: "td_in_center",
                                   "orderable" : false,
                                   defaultContent:
                                        "<input type='checkbox' color='primary' v-model='selected2' label='' value=''>"
                                },
                                { "data" : "num" , "orderable" : true },
                                { "data": "inst_nm", "orderable" : true },
                                { "data": "isu_kor_nm", "orderable" : true },
                                { "data": "req_date", "orderable" : true },
                                { "data": "kor_for_type_name", "orderable" : true },
                                { "data": "basic_idx", "orderable": true },
                                {  data: null,className: "td_in_center", 
                                     "orderable" : false,
                                   defaultContent: ""
                                  },
                                { data: null, className: "checks", defaultContent: "", "orderable" : false,}
                            ]

                        });
                    }
                    this.loadingbar = false;
                });
        },
    }
};
</script>

