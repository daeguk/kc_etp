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
                    <table id="example1" class="tbl_type">
                        
                        <thead>
                            <tr>
                                <th width="2%"></th>
                                <th width="1%">No</th>
                                <th style="display: none">seq</th>
                                <th style="display: none">inst_cd</th>
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
                     <v-card-actions flat class="mr-3">
                         <v-spacer></v-spacer>
                        <v-btn depressed color="#9e9e9e" dark>삭제</v-btn>
                        <v-btn depressed color="#48485e" dark>엑셀</v-btn>
                    </v-card-actions>
                </v-card>
                <!---실제적용 테이블end--->
                <!---ex 테이블--->
                <v-card flat>
                    <table id="example1" class="tbl_type">
                        <thead>
                            <tr>
                                <th width="2%"></th>
                                <th width="1%">No</th>
                                <th style="display: none">seq</th>
                                <th style="display: none">inst_cd</th>
                                <th width="15%" class="txt_left">발행사</th>
                                <th width="40%" class="txt_left">종목명</th>
                                <th width="15%" class="txt_left">신청현황</th>
                                <th width="18%"></th>
                                <th width="10%"></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr>
                                 <td></td>
                                  <td></td>
                                   <td></td>
                                    <td></td>
                                     <td  class="txt_left"></td>
                                      <td class="txt_left"></td>
                                       <td class="txt_left">담당자 접수 중</td>
                                        <td>
                                            <div class="v-input v-input--range-slider v-input--slider v-input--slider--ticks v-input--slider--ticks-labels v-input--is-label-active v-input--is-dirty v-input--is-readonly theme--light">
                                            <div class="v-input__control">
                                                <div class="v-input__slot">
                                                    <div class="v-slider">
                                                        <input role="slider" value="0" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        <input role="slider" value="1" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        <input role="slider" value="2" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        <div class="v-slider__track__container">
                                                            <div class="v-slider__track" style="left: 0px; right: auto; width: 100%;"></div>
                                                        </div>
                                                    <div class="v-slider__ticks-container">
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 0%;"><span>신청</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 33%;"><span>지수</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 66%;"><span>코드</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 100%;"><span>iNAV</span></span>
                                                     </div>
                                                         <div class="v-slider__thumb-container primary--text" style="left: 0%;">
                                                                <div class="v-slider__thumb select_on primary"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                <td><div class='tooltip'><button type='button' id='pdf' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:70px;'>기초지수</span></div>
                                <div class='tooltip'><button type='button' id='pdf' class='btn_icon v-icon material-icons'>trending_up</button><span class='tooltiptext' style='width:70px;'>iNAV</span></div></td>
                            </tr>
                            <tr>
                                 <td></td>
                                  <td></td>
                                   <td></td>
                                    <td></td>
                                     <td></td>
                                      <td></td>
                                       <td class="txt_left">표준코드 입력대기 중</td>
                                        <td>
                                            <div class="v-input v-input--range-slider v-input--slider v-input--slider--ticks v-input--slider--ticks-labels v-input--is-label-active v-input--is-dirty v-input--is-readonly theme--light">
                                            <div class="v-input__control">
                                                <div class="v-input__slot">
                                                    <div class="v-slider">
                                                        <input role="slider" value="0" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        <input role="slider" value="1" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        <input role="slider" value="2" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        <div class="v-slider__track__container">
                                                            <div class="v-slider__track" style="left: 0px; right: auto; width: 100%;"></div>
                                                            <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(33% - 0px);"></div>
                                                        </div>
                                                    <div class="v-slider__ticks-container">
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 0%;"><span>신청</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 33%;"><span>지수</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 66%;"><span>코드</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 100%;"><span>iNAV</span></span>
                                                     </div>
                                                         <div class="v-slider__thumb-container primary--text" style="left: 0%;">
                                                                <div class="v-slider__thumb primary"></div>
                                                        </div>
                                                         <div class="v-slider__thumb-container primary--text" style="left: 33%;">
                                                            <div class="v-slider__thumb select_on primary "></div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                <td></td>
                            </tr>
                             <tr>
                                 <td></td>
                                  <td></td>
                                   <td></td>
                                    <td></td>
                                     <td></td>
                                      <td></td>
                                       <td class="txt_left">iNAV/iIV산출대기중</td>
                                        <td>
                                            <div class="v-input v-input--range-slider v-input--slider v-input--slider--ticks v-input--slider--ticks-labels v-input--is-label-active v-input--is-dirty v-input--is-readonly theme--light">
                                                <div class="v-input__control">
                                                    <div class="v-input__slot">
                                                        <div class="v-slider">
                                                            <input role="slider" value="0" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                            <input role="slider" value="1" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                            <input role="slider" value="2" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                            <div class="v-slider__track__container">
                                                                <div class="v-slider__track" style="left: 0px; right: auto; width: 100%;"></div>
                                                                <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(33% - 0px);"></div>
                                                                <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(66% - 0px);"></div>
                                                            </div>
                                                            <div class="v-slider__ticks-container">
                                                                <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 0%;"><span>신청</span></span>
                                                                <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 33%;"><span>지수</span></span>
                                                                <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 66%;"><span>코드</span></span>
                                                                <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 100%;"><span>iNAV</span></span>
                                                            </div>
                                                            <div class="v-slider__thumb-container primary--text" style="left: 0%;">
                                                                <div class="v-slider__thumb primary"></div>
                                                            </div>
                                                            <div class="v-slider__thumb-container primary--text" style="left: 33%;">
                                                                <div class="v-slider__thumb primary"></div>
                                                            </div>
                                                            <div class="v-slider__thumb-container primary--text" style="left: 66%;">
                                                                <div class="v-slider__thumb select_on primary"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                <tr>
                                 <td></td>
                                  <td></td>
                                   <td></td>
                                    <td></td>
                                     <td></td>
                                      <td></td>
                                       <td class="txt_left">iNAV/iIV산출대기중</td>
                                        <td>
                                            <div class="v-input v-input--range-slider v-input--slider v-input--slider--ticks v-input--slider--ticks-labels v-input--is-label-active v-input--is-dirty v-input--is-readonly theme--light">
                                            <div class="v-input__control">
                                                <div class="v-input__slot">
                                                    <div class="v-slider">
                                                        <input role="slider" value="0" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        <input role="slider" value="1" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        <input role="slider" value="2" readonly="readonly" aria-readonly="true" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0,1">
                                                        
                                                        <div class="v-slider__track__container">
                                                            <div class="v-slider__track" style="left: 0px; right: auto; width: 100%;"></div>
                                                            <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(33% - 0px);"></div>
                                                            <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(66% - 0px);"></div>
                                                            <div class="v-slider__track-fill primary" style="left: 0%; right: auto; width: calc(100% - 0px);"></div>
                                                        </div>
                                                    <div class="v-slider__ticks-container">
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 0%;"><span>신청</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 33%;"><span>지수</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 66%;"><span>코드</span></span>
                                                            <span class="v-slider__ticks v-slider__ticks--always-show" style="border-width: 1px; left: 100%;"><span>iNAV</span></span>
                                                     </div>
                                                         <div class="v-slider__thumb-container primary--text" style="left: 0%;">
                                                                <div class="v-slider__thumb primary"></div>
                                                        </div>
                                                         <div class="v-slider__thumb-container primary--text" style="left: 33%;">
                                                            <div class="v-slider__thumb primary"></div>
                                                        </div>
                                                        <div class="v-slider__thumb-container primary--text" style="left: 66%;">
                                                            <div class="v-slider__thumb primary"></div>
                                                        </div>
                                                        <div class="v-slider__thumb-container primary--text" style="left: 100%;">
                                                            <div class="v-slider__thumb select_on primary"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </v-card>
                <!---ex테이블end--->
                <template slot="items" slot-scope="props">
                    <td>
                        <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                    </td>
                    <td class="text-xs-center">{{ props.index+1 }}</td>
                    <td class="text-xs-left" >{{ props.item.isu_kor_nm }}</td>
                    <td class="text-xs-left">{{ props.item.req_date }}</td>
                    <td class="text-xs-left">{{ props.item.kor_for_type }}</td>
                    <td class="text-xs-center"></td>

                </template>
                        <v-dialog v-model="dialog3" persistent max-width="550">
                            <!---기초지수 팝업 내용-->
                            <v-card>
                                <h5>
                                    <v-card-title ma-0>
                                        기초지수 
                                        <v-spacer></v-spacer>
                                        <v-btn icon dark @click="dialog3 = false">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>
                                <v-card flat>
                                  <v-data-table
                                        class="elevation-1 table_line4"
                                        :items="idxList"
                                      
                                    >
                                      <template slot="items" slot-scope="props" >
                                            <td class="text-xs-center">>{{props.item.idx}}</td>
                                            <td class="text-xs-center"></td>
                                            <td class="text-xs-center"></td>
                                            <td class="text-xs-center"></td>
                                        <v-alert
                                            v-slot:no-results
                                            :value="true"
                                            color="error"
                                            icon="warning"
                                        ></v-alert>
                                     </template>    
                                    </v-data-table>
                                </v-card>
                                <v-card class="pop_bot_h"></v-card>
                            </v-card>
                            <!---기초지수 팝업 내용-end-->
                        </v-dialog>
                        <v-dialog v-model="dialog2" persistent max-width="550">
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
                                        hide-actions
                                        class="elevation-1 table_line4"
                                        :items="compContactList"
                                        
                                    >   
                                    <template slot="items" slot-scope="props" >
                                        <td class="text-xs-center" >{{props.item.USER_NM}}</td>
                                        <td class="text-xs-center">{{props.item.TEL_NO}}</td>
                                        <td class="text-xs-center">{{props.item.CEL_NO}}</td>
                                        <td class="text-xs-center">{{props.item.EMAIL}}</td>
                                       
                                    </template>    
                                     <v-alert
                                            v-slot:no-results
                                            :value="true"
                                            color="error"
                                            icon="warning"
                                        ></v-alert>
                                    </v-data-table>
                                </v-card>
                                <v-card class="pop_bot_h"></v-card>
                            </v-card>
                            <!---발행사 담당자 연락처 팝업 내용end-->
                    </v-dialog>
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
            distCnt: 0,
            indexCnt: 0,
            codeCnt: 0,
            inavCnt: 0,
            dialog2: false,
            dialog3: false,
            items1: ["실시간", "종가"],
            compContactList : [],
            idxList :[]

        };
    },
    components: {},
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
                        
                        //console.log("response=" + JSON.stringify(items));
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
                                    "targets": 9 
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
                                    "targets": 10 
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
                                { "data": "inst_nm", "orderable" : true},
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
                         
                        $('#example1 tbody tr td:nth-child(3)').hide();
                        $('#example1 tbody tr td:nth-child(4)').hide();
                        
                    
                        $("#example1 tbody").on('click', 'tr td:nth-child(6)', function(){
                            var tr = $(this).parents();
                            var td = tr.children();
                            var seq = td.eq(2).text(); 
                            console.log("##CLICK example1 > tbody > tr", td.eq(2).text());
                            vm.$emit("moveUpdatePage", seq); 
                        });

                    
                        $("#example1 tbody").on('click', 'tr td:nth-child(10)', function(){
                            console.log("#CLICK example1 > tbody > tr > basic index",$(this));
                            vm.dialog3 = true;
                        });
                        
                        $("#example1 tbody").on('click', 'tr td:nth-child(5)', function(){
                            console.log("#CLICK example1 > tbody > tr > contributor",$(this));
                            var tr = $(this).parents();
                            var td = tr.children();
                            var instCd = td.eq(3).text(); 
                            vm.getCompContactList(instCd);
                            vm.dialog2 = true;
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
        getCompContactList: function(val) {
            var vm = this;
            console.log("getCompContactList");
            axios.get(Config.base_url + "/user/etp/getCompContactList", {
                    params: {
                        inst_cd : val
                    }
            }).then(response => {
                     console.log(response);

                if (response.data.success == false) {
                    
                } else {
                    vm.compContactList = response.data.results ;
                    console.log("getCompContactList=" + vm.compContactList );
                }

                 
            });

           
        }
      
       

          
       

        
    


    }
};
</script>

