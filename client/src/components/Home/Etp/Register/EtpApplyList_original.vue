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
                                <v-icon>border_color</v-icon>신청:  {{ list_cnt }}건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#1976d2">
                                <v-icon>assessment</v-icon>지수입수:  {{ indexCnt }}건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#466eb9">
                                <v-icon>assignment</v-icon>지수분배: {{ distCnt }}건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#48485e">
                                <v-icon>insert_drive_file</v-icon>종목코드 신청:  {{ codeCnt }}건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat color="#727281">
                                <v-icon>exposure</v-icon>iNAV산출 :{{ inavCnt }}건
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
                 <!---실제적용 테이블--->
                <v-card flat>
                    <table id="example1" class="display table01_w">
                        <thead>
                            <tr>
                                <th width="2%"></th>
                                <th width="1%">No</th>
                                <th style="display: none">seq</th>
                                <th style="display: none">inst_cd</th>
                                <th style="display: none">idx_mid</th>
                                <th style="display: none">idx_sym_code</th>
                                <th style="display: none">ridx_dist_sym_code</th>
                                <th width="15%">발행사</th>
                                <th width="40%">종목명</th>
                                <th>신청일</th>
                                <th width="10%">국내/해외</th>
                                <th width="10%">기초지수</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                    </table>
                </v-card>
                <!---실제적용 테이블end--->

 
                <div class="text-xs-right my-3">
                    <v-btn depressed color="#9e9e9e" dark>삭제</v-btn>
                    <v-btn depressed color="#48485e" dark>엑셀</v-btn>
                </div>
                <!---회사 연락처 팝업 --->
                <companyContactModal :companyContactModal="this.companyContactModal" @close="hideContactkPop"></companyContactModal>
                <!-- 회사 연락처 팝업   end  -->
                <!---기초지수 팝업 내용 --->
                <idxConfirmModal :idxConfirmModal="this.idxConfirmModal" @close="hideIdxListPop"></idxConfirmModal>
                <!-- 기초지수 팝업 내용  end  -->
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import Config from "@/js/config.js";
import companyContactModal from "./companyContactModal";
import idxConfirmModal from "./idxConfirmModal";
var table = null;

export default {
    props: [],

    data() {
        return {
            results: [],
            loadingbar: false,
            list_cnt: 0,
            distCnt: 0,
            indexCnt: 0,
            codeCnt: 0,
            inavCnt: 0,
            dialog2: false,
            dialog3: false,
            //items1: ["실시간", "종가"],
            companyContactModal:{
                dialog: false,
                instCd: '',
            },
            idxConfirmModal:{
                dialog: false,
                idxTable: '',
                idxSymCode: '',
                ridxDistSymCode: '',
            },
            idxList :[]
        };
    },
    components: {
        companyContactModal,
        idxConfirmModal
    },
    computed: {},
    created: function() {
    },
    beforeDestroy() {},
    mounted: function() {
        var vm = this;
        vm.getEtpApplyList();
        vm.getEtpApplyDistCnt();
        vm.getEtpApplyIndexCnt();
        vm.getEtpApplyCodeCnt();
        vm.getEtpApplyInavCnt();
    },
    methods: {
        getEtpApplyList: function() {
            var vm = this;
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
                        this.results = items;
                        this.list_cnt = this.results.length;
                          table = $("#example1").DataTable({
                            autoWidth: false, 
                            processing: true,
                            serverSide: false,
                            info: true, // control table information display field
                            stateSave: true, //restore table state on page reload,
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
                                    "targets": 12 
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
                                    "targets": 13 
                                },  
                            ],
                            columns: [
                                //{ "defaultContent": "<button type='button' class='btn btn-primary btn-xs'>Trial Run</button>" },
                                {
                                   data: "null",
                                   className: "td_in_center",
                                   "orderable" : false,
                                   defaultContent:[
                                        "<input type='checkbox' color='primary' v-model='selected2' label='' value=''>"
                                   ]
                                },
                                { "data" : "num" , "orderable" : true },
                                { "data" : "seq" , "orderable" : false },
                                { "data" : "inst_cd" , "orderable" : false },
                                { "data" : "idx_mid" , "orderable" : false },
                                { "data" : "idx_sym_code" , "orderable" : false },
                                { "data" : "ridx_dist_sym_code" , "orderable" : false },
                                { "data" : "inst_nm", "orderable" : true},
                                { "data" : "isu_kor_nm", "orderable" : true },
                                { "data" : "req_date", "orderable" : true },
                                { "data" : "kor_for_type_name", "orderable" : true },
                                { "data" : "basic_idx", "orderable": true },
                                {  data: null,className: "td_in_center", 
                                     "orderable" : false,
                                   defaultContent: ""
                                  },
                                { data: null, className: "checks", defaultContent: "", "orderable" : false,}
                            ]
                        });
                        $('#example1 tbody tr td:nth-child(3)').hide();
                        $('#example1 tbody tr td:nth-child(4)').hide();
                        $('#example1 tbody tr td:nth-child(5)').hide();
                        $('#example1 tbody tr td:nth-child(6)').hide();
                        $('#example1 tbody tr td:nth-child(7)').hide();

                        //회사 연락처 팝업 
                        $("#example1 tbody").on('click', 'tr td:nth-child(8)', function(){
                            console.log("#CLICK example1 > tbody > tr > contributor",$(this));
                            var tr = $(this).parents();
                            var td = tr.children();
                            var instCd = td.eq(3).text();
                            vm.companyContactModal.instCd = instCd;
                            vm.showContactPop();
                        });
                        //기초지수 확인팝업 
                        $("#example1 tbody").on('click', 'tr td:nth-child(13)', function(){
                            console.log("#CLICK example1 > tbody > tr > basic index",$(this));
                            var tr = $(this).parents();
                            var td = tr.children();
                            var idxMid = td.eq(4).text();
                            var idxSymCode = td.eq(5).text();
                            var ridxDistSymCode = td.eq(6).text();
                            var idxTable= 'm' + idxMid + 'hbased'  ;
                            console.log("idxModal : " + idxMid + ": " + idxTable + ": " + idxSymCode + ": " + ridxDistSymCode )
                            vm.idxConfirmModal.idxTable = idxTable;
                            vm.idxConfirmModal.idxSymCode = idxSymCode;
                            vm.idxConfirmModal.ridxDistSymCode = ridxDistSymCode;
                            vm.idxConfirmModal.dialog = true;
                            vm.showIdxListPop();

                        });                        
                    }
                   // this.loadingbar = false;
                });
        },
        getEtpApplyDistCnt: function() {
            console.log("getEtpApplyDistCnt");
            axios.get(Config.base_url + "/user/etp/getEtpApplyDistCnt", {
                    params: {
                    }
            }).then(response => {
                     console.log(response);

                if (response.data.success == false) {
                    this.distCnt = 0 ;   
                } else {
                    var items = response.data.results ;
                    this.distCnt = items['0']['distCnt'] ;
                    console.log("response=" + this.distCnt );
                }
                   
            });
        }, 
        getEtpApplyIndexCnt: function() {
            console.log("getEtpApplyIndexCnt");
            axios.get(Config.base_url + "/user/etp/getEtpApplyIndexCnt", {
                    params: {
                    }
            }).then(response => {
                     console.log(response);

                if (response.data.success == false) {
                    this.indexCnt = 0 ;   
                } else {
                    var items = response.data.results ;
                    this.indexCnt = items['0']['indexCnt'] ;
                    console.log("responseindex=" + this.indexCnt );
                }
                   
            });
        },
        getEtpApplyCodeCnt: function() {
            console.log("getEtpApplyCodeCnt");
            axios.get(Config.base_url + "/user/etp/getEtpApplyCodeCnt", {
                    params: {
                    }
            }).then(response => {
                     console.log(response);

                if (response.data.success == false) {
                    this.codeCnt = 0 ;   
                } else {
                    var items = response.data.results ;
                    this.codeCnt = items['0']['codeCnt'] ;
                    console.log("responsecode=" + this.codeCnt );
                }
                   
            });
        }, 
        getEtpApplyInavCnt: function() {
            console.log("getEtpApplyInavCnt");
            axios.get(Config.base_url + "/user/etp/getEtpApplyInavCnt", {
                    params: {
                    }
            }).then(response => {
                    console.log(response);

                if (response.data.success == false) {
                    this.inavCnt = 0 ;   
                } else {
                    var items = response.data.results ;
                    this.inavCnt = items['0']['inavCnt'] ;
                    console.log("responseinav=" + this.inavCnt );
                }
            });
        },
        showContactPop: function() {
           this.companyContactModal.dialog = true;
           this.$EventBus.$emit('contactModal');
           //this.$refs.refCompanyContactModal.getCompanyContactList();
        },
        hideContactkPop: function() {
            this.companyContactModal.dialog = false;
        },
        showIdxListPop: function() {
           this.idxConfirmModal.dialog = true;
           this.$EventBus.$emit('idxListModal');
         },
        hideIdxListPop: function() {
            this.idxConfirmModal.dialog = false;
        },

    }
};
</script>

