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
                            <v-card dark flat class="apply_pre bgcolor1">
                                <v-icon>border_color</v-icon>신청:  {{ list_cnt }}건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat class="bgcolor2">
                                <v-icon>assessment</v-icon>지수입수:  {{ indexCnt }}건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat class="bgcolor3">
                                <v-icon>assignment</v-icon>지수분배: {{ distCnt }}건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat  class="bgcolor4">
                                <v-icon>insert_drive_file</v-icon>종목코드 신청:  {{ codeCnt }}건
                            </v-card>
                        </v-flex>
                        <v-flex xs2 ma-2>
                            <v-card dark flat class="bgcolor5">
                                <v-icon>exposure</v-icon>iNAV산출 :{{ inavCnt }}건
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
                 <!---실제적용 테이블--->
                <v-card flat>
                    <table id="example1" class="tbl_type">
                         <thead>
                            <tr>
                                <th width="1%"></th>
                                <th width="1%">No</th>
                                <th style="display: none">seq</th>
                                <th style="display: none">inst_cd</th>
                                <th style="display: none">idx_mid</th>
                                <th style="display: none">ridx_mid</th>
                                <th style="display: none">idx_sym_code</th>
                                <th style="display: none">ridx_dist_sym_code</th>
                                <th width="12%">발행사</th>
                                <th width="18%">종목명</th>
                                <th width="8%">신청일</th>
                                <th width="8%">국내/해외</th>
                                <th width="10">기초지수</th>
                                <th width="14%" class="txt_left">신청현황</th>
                                <th width="18%"></th>
                                <th width="8%"></th>
                                <th style="display: none">idx_nm</th>
                                <th style="display: none">isu_srt_cd</th>
                             </tr>
                        </thead>
                    </table>
                     <v-card-actions flat class="mr-3">
                        <v-spacer></v-spacer>
                        <div flat class="mr-3" v-if="this.loginInstCd==='04870'">
                            <v-btn depressed color="grey" dark @click="deleteEtpApply">삭제</v-btn>
                        </div>
                            <v-btn depressed color="primary" dark @click="downloadExcel">엑셀</v-btn>
                    </v-card-actions>
                </v-card>
                <!---실제적용 테이블end--->
                <!---회사 연락처 팝업 --->
                <companyContactModal :companyContactModal="this.companyContactModal" @close="hideContactkPop"></companyContactModal>
                <!-- 회사 연락처 팝업   end  -->
                <!---기초지수 팝업 내용 --->
                <idxConfirmModal :idxConfirmModal="this.idxConfirmModal" @close="hideIdxListPop"></idxConfirmModal>
                <!-- 기초지수 팝업 내용  end  -->
                <!---inav 팝업 내용 --->
                <iNavConfirmModal :iNavConfirmModal="this.iNavConfirmModal" @close="hideInavListPop"></iNavConfirmModal>
                <!-- inav 팝업 내용  end  -->
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
import iNavConfirmModal from "./iNavConfirmModal";
import excel from "xlsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

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
            companyContactModal:{
                dialog: false,
                instCd: '',
            },
            idxConfirmModal:{
                dialog: false,
                idxSymCode: '',
                idxNm : '',
                ridxDistSymCode: '',
                marketId:'',
                rMarketId:''
            },
            iNavConfirmModal:{
                dialog: false,
                isuSrtCd:'',
                isuKorNm:''
            },
            seqValues :[],
            loginInstCd:''
        };
    },
    components: {
        companyContactModal,
        idxConfirmModal,
        iNavConfirmModal
    
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
        this.$root.$confirm = this.$refs.confirm;
        //this.loginInstCd =  this.$store.state.user.inst_cd;
        //console.log("inst_cd : " + this.$store.state.user.inst_cd);
              
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
                    if (response.data.success == false) {
                        alert("ETP신청현황  목록이 없습니다");
                    } else {
                        var items = response.data.results;
                        var inst_cd = response.data.inst_cd;
                        this.inst_cd = response.data.inst_cd ;
                        this.results = items;
                        this.list_cnt = this.results.length;
                        console.log("getEtpApplyList=" + JSON.stringify(response.data.inst_cd));       
                        table = $("#example1").DataTable({
                            autoWidth: false, 
                            processing: true,
                            serverSide: false,
                            info: true, // control table information display field
                            stateSave: true, //restore table state on page reload,
                            paging: false,
                            searching: false,
                            data: this.results,
                            destroy: true,
                            //list_cnt : this.results.length,
                                columnDefs: [
                                {  
                                       "render": function ( data, type, row ,meta) {
                                        return "<input type='checkbox' color='primary' name='seq'   value='" + row.seq + "'>";
                                        },   
                                        "targets": 0 
                                },
                                {  
                                        "data": "num",
                                        "render": function ( data, type, row ,meta) {
                                            return meta.row + meta.settings._iDisplayStart + 1;
                                        },   
                                        "targets": 1 
                                },
                                {  
                                    "render": function ( data, type, row ) {
                                        let shtml = '' ;
                                        if (row.isin_stat_cd == "0001"){ 
                                           shtml += '담당자 접수 중' ;
                                        }else if(row.isin_stat_cd == "0002"){
                                           shtml += '표준코드 입력대기 중' ;                                            
                                        }else if(row.isin_stat_cd == "0003"){
                                           shtml += 'iNAV/iIV산출대기중' ;                                            
                                        }else if(row.isin_stat_cd == "0004"){
                                           shtml += 'iNAV/iIV 산출테스트 중' ;                                            
                                        }else if(row.isin_stat_cd == "0008"){
                                           shtml += '상장보류' ;                                            
                                        }
                                        return shtml;
                                        }, 
                                    "targets": 13
                                },
                                {  
                                "render": function ( data, type, row ) {
                                        var shtml = '' ;
                                        shtml += '<div class="v-input v-input--range-slider v-input--slider v-input--slider--ticks v-input--slider--ticks-labels v-input--is-label-active v-input--is-dirty v-input--is-readonly theme--light">'
                                        shtml += ' <div class="v-input__control"> ' 
                                        shtml += '        <div class="v-input__slot">'
                                        shtml += '            <div class="v-slider">'
                                        shtml += '                <input role="slider" value="0" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">'
                                        shtml += '                <input role="slider" value="1" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">'
                                        shtml += '                <input role="slider" value="2" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">'
                                        shtml += '                <div class="v-slider__track__container">'
                                        var ahtml1='',ahtml2='',ahtml3='',ahtml4 = '' ;
                                        ahtml1 = '                <div class="v-slider__track" style="left: 0px; right: auto; width: 100%;"></div>' ;
                                        ahtml2 = '                <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(33% - 0px);"></div>' ;
                                        ahtml3 = '                <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(66% - 0px);"></div>'  ;
                                        ahtml4 = '                <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(100% - 0px);"></div>'  ;
    
                                        if (row.isin_stat_cd == "0001"){    
                                            shtml += ahtml1 
                                        } else if (row.isin_stat_cd == "0002"){    
                                            shtml += ahtml1 + ahtml2               
                                        } else if (row.isin_stat_cd == "0003"){    
                                            shtml += ahtml1 + ahtml2 + ahtml3              
                                        } else if (row.isin_stat_cd == "0004"){    
                                            shtml += ahtml1 + ahtml2 + ahtml3 +  ahtml4                           
                                        }        
                                        shtml += '            </div>'
                                        shtml += '            <div class="v-slider__ticks-container">'
                                        shtml += '                    <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 0%;"><span>신청</span></span>'
                                        shtml += '                    <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 33%;"><span>지수</span></span>'
                                        shtml += '                    <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 66%;"><span>코드</span></span>'
                                        shtml += '                    <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 100%;"><span>iNAV</span></span>'
                                        shtml += '             </div>'
                                        var bhtml1='',bhtml2='',bhtml3='',bhtml4 = '' ;
                                        var selecTag1 = '',selecTag2 = '',selecTag3 = '',selecTag4 = '' ;
                                        if (row.isin_stat_cd == "0001"){    
                                            selecTag1  = 'select_on'   ;
                                            selecTag2  = ''   ;
                                            selecTag3  = ''   ;
                                            selecTag4  = ''   ;
                                        } else if (row.isin_stat_cd == "0002"){    
                                            selecTag1  = ''   ;
                                            selecTag2  = 'select_on'   ;
                                            selecTag3  = ''   ;
                                            selecTag4  = ''   ;
                                        } else if (row.isin_stat_cd == "0003"){    
                                            selecTag1  = ''   ;
                                            selecTag2  = ''   ;
                                            selecTag3  = 'select_on'   ;
                                            selecTag4  = ''   ;
                                        } else if (row.isin_stat_cd == "0004"){    
                                            selecTag1  = ''   ;
                                            selecTag2  = ''   ;
                                            selecTag3  = ''   ;
                                            selecTag4  = 'select_on'   ;                       
                                        }                                                
                                        bhtml1 += '                 <div class="v-slider__thumb-container primary--text" style="left: 0%;">'
                                        bhtml1 += '                        <div class="v-slider__thumb ' + selecTag1 + ' primary"></div>'
                                        bhtml1 += '                 </div>'
                                        bhtml2 += '                 <div class="v-slider__thumb-container primary--text" style="left: 33%;">'
                                        bhtml2 += '                               <div class="v-slider__thumb ' + selecTag2 +  ' primary "></div>'
                                        bhtml2 += '                  </div>'
                                        bhtml3 += '                 <div class="v-slider__thumb-container primary--text" style="left: 66%;">'
                                        bhtml3 += '                        <div class="v-slider__thumb ' + selecTag3 +  ' primary"></div>'
                                        bhtml3 += '                  </div>'
                                        bhtml4 += '                 <div class="v-slider__thumb-container primary--text" style="left: 100%;">'
                                        bhtml4 += '                        <div class="v-slider__thumb ' + selecTag4 +  ' primary"></div>' 
                                        bhtml4 += '                  </div>'                                       
                                       if (row.isin_stat_cd == "0001"){    
                                            shtml += bhtml1 
                                        } else if (row.isin_stat_cd == "0002"){    
                                            shtml += bhtml1 + bhtml2               
                                        } else if (row.isin_stat_cd == "0003"){    
                                            shtml += bhtml1 + bhtml2 + bhtml3              
                                        } else if (row.isin_stat_cd == "0004"){    
                                            shtml += bhtml1 + bhtml2 + bhtml3 +  bhtml4                           
                                        }                                                

                                        shtml += '            </div>'
                                        shtml += '        </div>'
                                        shtml += '    </div>'
                                        shtml += '</div>'
                                        if(row.isin_stat_cd == "0008"){
                                           shtml = '상장보류' ;                                            
                                        }
                                        return shtml;
                                        }, 
                                    "targets": 14
                                },
                             ],
                            columns: [
                                {
                                   data: "null",
                                   className: "td_in_center",
                                   "orderable" : false
                                },
                                { "data" : "num" , "orderable" : true },
                                { "data" : "seq" , "orderable" : false },
                                { "data" : "inst_cd" , "orderable" : false },
                                { "data" : "idx_mid" , "orderable" : false },
                                { "data" : "ridx_mid" , "orderable" : false },
                                { "data" : "basic_idx" , "orderable" : false  },
                                { "data" : "ridx_dist_sym_code" , "orderable" : false },
                                { "data" : "inst_nm", "orderable" : true,className: "txt_left t_link"},
                                { "data" : "isu_kor_nm", "orderable" : true,className: "txt_left t_link" },
                                { "data" : "req_date", "orderable" : true },
                                { "data" : "kor_for_type_name", "orderable" : true },
                                { "data" : "basic_idx", "orderable": true,className: "txt_left" },
                                {  data: null,className: "txt_left", 
                                     "orderable" : false,
                                   defaultContent: ""
                                  },
                                { data: null, className: "", defaultContent:"" , "orderable" : false,},
                                { data: null, className: "", defaultContent:[
                                        '<td><div class="tooltip"><button type="button" name="popIdx" class="btn_icon v-icon material-icons">equalizer</button><span class="tooltiptext" style="width:50px;">기초지수</span></div>'
                                        + '<div class="tooltip"><button type="button" name="popInav" class="btn_icon v-icon material-icons">trending_up</button><span class="tooltiptext" style="width:50px;">iNAV</span></div></td> '
                                        ] , "orderable" : false,},
                                { "data" : "idx_nm", "orderable": false },
                                { "data" : "isu_srt_cd", "orderable": false },        
                            ],
                         });
                         
                        $('#example1 tbody tr td:nth-child(3)').hide();
                        $('#example1 tbody tr td:nth-child(4)').hide();
                        $('#example1 tbody tr td:nth-child(5)').hide();
                        $('#example1 tbody tr td:nth-child(6)').hide();
                        $('#example1 tbody tr td:nth-child(7)').hide();
                        $('#example1 tbody tr td:nth-child(8)').hide();
                        $('#example1 tbody tr td:nth-child(17)').hide();
                        $('#example1 tbody tr td:nth-child(18)').hide();
                        
                    
                        $("#example1 tbody").on('click', 'tr td:nth-child(10)', function(){
                            var tr = $(this).parents();
                            var td = tr.children();
                            var seq = td.eq(2).text(); 
                            console.log("##CLICK example1 > tbody > tr", td.eq(2).text());
                            vm.$emit("moveUpdatePage", seq); 
                        });
                        //기초지수 확인팝업 
                        $("button[name=popIdx]").on('click', function(){
                            console.log("#CLICK example1 > tbody > tr > basic index",$(this));
                            var tr = $(this).parent().parent().parent();
                            var idxMid = $(tr).find("td:eq(4)").text();
                            var rIdxMid = $(tr).find("td:eq(5)").text();
                            var idxSymCode = $(tr).find("td:eq(6)").text();
                            var ridxDistSymCode = $(tr).find("td:eq(7)").text();
                             var marketId= 'M' + ('0' + idxMid).slice(-3)  ;
                            var rMarketId= 'M' + ('0' + rIdxMid).slice(-3)  ;
                            console.log("idxMid : " + idxMid + " marketId: " + marketId + ": " + rMarketId + "rMarketId:" + "idxSymCode:"+  idxSymCode  + ": " + "ridxDistSymCode:" +  ridxDistSymCode) ;
                            vm.idxConfirmModal.idxSymCode = idxSymCode;
                            vm.idxConfirmModal.ridxDistSymCode = ridxDistSymCode;
                            vm.idxConfirmModal.marketId = marketId;
                            vm.idxConfirmModal.rMarketId = rMarketId;
                            vm.idxConfirmModal.idxNm = $(tr).find("td:eq(16)").text();;
                            vm.idxConfirmModal.dialog = true;
                            vm.showIdxListPop();
                        });                        
                        //inav 확인팝업 
                        $("button[name=popInav]").on('click', function(){
                            var tr = $(this).parent().parent().parent();
                            var idxSymCode = $(tr).find("td:eq(6)").text();
                            var isuSrtCd = $(tr).find("td:eq(17)").text();
                            console.log("isuSrtCd : " + $(tr).find("td:eq(17)").text() + "idxSymCode : " + idxSymCode ) ;
                            vm.iNavConfirmModal.idxSymCode = idxSymCode;                            
                            vm.iNavConfirmModal.isuKorNm = $(tr).find("td:eq(9)").text();
                            vm.iNavConfirmModal.isuSrtCd = $(tr).find("td:eq(17)").text();
                            vm.iNavConfirmModal.dialog = true;
                            vm.showInavListPop();
                        });                                               
                       //회사 연락처 팝업 
                        $("#example1 tbody").on('click', 'tr td:nth-child(9)', function(){
                            console.log("#CLICK example1 > tbody > tr > contributor",$(this));
                            var tr = $(this).parents();
                            var td = tr.children();
                            var instCd = td.eq(3).text();
                            vm.companyContactModal.instCd = instCd;
                            vm.showContactPop();
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
                    console.log("getIdxList=" + JSON.stringify(items));
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
        showInavListPop: function() {
           this.iNavConfirmModal.dialog = true;
           this.$EventBus.$emit('iNavListModal');
         },
        hideInavListPop: function() {
            this.iNavConfirmModal.dialog = false;
        },      
        deleteEtpApply: async function() {   
            var vm = this;
            var delList = $('input[name=seq]:checked');
             console.log("delList: " + delList.length );
            if(delList.length == 0){
                if( vm.$root.$confirm.open(
                        '[오류]',
                        '삭제할 항목을 선택하여 주십시요',
                        {}
                    ,   1
                        )
                    ) {
                        return false;
                }
            }
            var seqValues = [];
            $('input[name=seq]:checked').each(function(){
               seqValues.push($(this).val());     
            });
            console.log("seqValues: " + seqValues );
            await axios.get(Config.base_url + "/user/etp/deleteEtpApply", {
                params: {
                    seqValues : seqValues
                }
            }).then(function(response) {
                if (response.data.result == false) {
                   if( vm.$root.$confirm.open(
                                '[오류]',
                                response.data.msg,
                                {}
                            ,   1
                                )
                            ) {
                                return false;
                            }
                    
                }else if (response.data.result == true) {
                        vm.refreshYn = true;
                        //vm.getEtpApplyList();
                        //vm.getEtpApplyDistCnt();
                        //vm.getEtpApplyIndexCnt();
                        //vm.getEtpApplyCodeCnt();
                        //vm.getEtpApplyInavCnt();
                    if(  vm.$root.$confirm.open(
                            '[삭제]',
                            '삭제가 완료되었습니다.',
                            {}
                        ,   1
                            )
                        ){}                
                }
            });

        },
        downloadExcel: function() {
            var vm = this;
            //var tempResults= vm.results ;
             var dataWS = excel.utils.aoa_to_sheet([["종목한글명","종목영문명","종목코드","단축코드","상품구분","발행기관","신청일자","상장신청일자","상장일자","기초지수KRX분배여부","기초지수발행사분배여부","기초지수예탁원분배여부","기초지수미래에셋분배여부","기초지수산출기관코드","기초지수심볼코드","기초지수명","기초지수입수기관코드","기초지수종가타입","기초지수휴장일","기초지수추적배수구분","전일기초지수구분(한국시간기준)","기초지수파일명(경로포함)","지수구성종목예탁원분배여부","지수구성종목미래에셋분배여부","블룸버그티커","종가지수요청사항","실시간여부","실시간지수산출기관코드","실시간지수입수기관코드","실시간지수산출기관심볼코드","실시간지수입수기관심볼코드","실시간지수휴장일","실시간지수KRX분배여부","실시간지수발행사분배여부","실시간지수예탁원분배여부","실시간지수미래에셋분배여부","실시간지수제공주기","참고지수심볼코드","참고지수명","참고지수입수기관코드","참고지수파일명","참고지수요청사항","참고지수블룸버그티커","적용환율","환헷지여부","종목상태명","iNAV/iIV산출구분코드","기초지수입수여부_KOSCOM","기초지수분배여부_KOSCOM","iNAV산출여부_KOSCOM","기초지수MID_KOSCOM","실시간지수MID_KOSCOM","종가파일_KOSCOM","실시간TR_KOSCOM"]]);
            /* hide  column */
            dataWS['!cols'] = [];
            for (var i = 54 ; i < 100 ; i++) {
                dataWS['!cols'][i] = { hidden: true };
            }
             //console.log("downloadExcel=" + JSON.stringify(tempResults));
            excel.utils.sheet_add_json(dataWS, vm.results, {header: ["isu_kor_nm","isu_eng_nm","isin_code","isu_srt_cd","etp_type","inst_nm","req_date" ,"list_req_date" ,"list_date","krx_dist_yn","comp_dist_yn","ksd_dist_yn","mirae_dist_yn","idx_inst_cd_nm","idx_sym_code","idx_nm","idx_dist_inst_cd_nm","idx_close_type","idx_holy_cd_nm" ,"idx_trace_yd_mult_type","pre_idx_type","idx_file_nm","idx_comp_ksd_dist_yn","idx_comp_mirae_dist_yn","blom_ticker","user_req","real_yn","ridx_inst_cd_nm","ridx_dist_inst_cd_nm","ridx_crt_sym_code","ridx_dist_sym_code","ridx_holy_cd_nm","ridx_krx_dist_yn","ridx_comp_dist_yn","ridx_ksd_dist_yn","ridx_mirae_dist_yn","ridx_dist_term","refidx_sym_code","refidx_nm","refidx_inst_cd_nm","refidx_file_nm","refidx_req","refidx_blom_ticker","ex_rate_cd_nm","ex_hedge_yn","isin_stat_cd_nm","inav_calc_cd_nm","idx_rec_yn","idx_dis_yn","inav_calc_yn","idx_mid","ridx_mid","close_file","real_idx_tr"] ,skipHeader:true, origin:"A2"});
            var wb = excel.utils.book_new();
            excel.utils.book_append_sheet(wb, dataWS, "신청목록");
            excel.writeFile(wb, "해외ETP신청목록.xlsx");
        }
    }
    
};
</script>

