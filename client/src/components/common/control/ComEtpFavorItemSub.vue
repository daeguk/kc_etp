<template>
  <v-container>
    <v-list class="pt-0" dense>
      <v-list-tile-content class="rightmenu_con2">
        <v-layout class="w100">
          <v-flex xs12>
            <v-card>
              <v-card-title class="con_r_ta_serch">
                <v-text-field v-model="search" v-on:keyup="filterAllData(1)" append-icon="search" label="Search" single-line hide-details></v-text-field>
                <button type='button' id='btn_all_faver' v-on:click="filterAllData(2)" :class='allFaverClass'>star</button>
              </v-card-title>    
            </v-card>
            <v-tabs v-model="activeTab" centered grow>
                <v-tabs-slider ></v-tabs-slider>
                <v-tab v-for="item in kindTabs" :key="item">{{ item }}</v-tab>
            </v-tabs>
            
            <v-tabs-items v-model="activeTab">
            <v-tab-item>
              <!-- etf 리스트 영역 -->
              <v-layout row >
                <v-flex xs12>
                  <v-card flat>
                    <table id="publish_etp_table" class="tbl_type ver2" style="width:100%;height:100%">
                      <colgroup>
                        <col width="3%">
                        <col width="70%">
                        <col width="27%">
                      </colgroup>
                      <thead>
                        <tr>
                          <th></th>
                          <th>종목명</th>
                          <th>현재가</th>
                        </tr>
                      </thead>  
                    </table>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <!--ETN 리스트 영역 -->
              <v-layout row>
                <v-flex xs12>
                  <v-card flat>                                                
                    <table id="all_etp_table" class="tbl_type ver2" style="width:100%">
                      <colgroup>
                        <col width="3%">
                        <col width="70%">
                        <col width="27%">
                      </colgroup>
                      <thead>
                        <tr>
                          <th></th>
                          <th>종목명</th>
                          <th>현재가</th>
                        </tr>
                      </thead>  
                    </table>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </v-list-tile-content>
    </v-list>
    <ProgressBar ref="progress"></ProgressBar>
    <ConfirmDialog ref="confirm2"></ConfirmDialog>
  </v-container>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config from "@/js/config.js";
import util       from "@/js/util.js";
import ProgressBar from "@/components/common/ProgressBar.vue";
import ConfirmDialog                from "@/components/common/ConfirmDialog.vue";

var publish_etp_table = null;
var all_etp_table = null;

export default {
    props: ["faverSize"],
    data() {
        return {
            jongMokDialog: false,
            right: null,
            tab: null,
            kindTab : null, 
            activeTab: 0, 
            kindTabs: ["운영종목", "전종목"],
            drawer: null,
            favorItems: [],
            pubList: [],
            allList: [],
            paramData : {},
            search: '',
            showIndexDetailDialog : false,
            showEtpDetailDialog : false,
            pubFaverClass: 'btn_icon_star v-icon material-icons',
            allFaverClass: 'btn_icon_star v-icon material-icons',
            
        };
    },
    components: {
        ProgressBar : ProgressBar,
        ConfirmDialog: ConfirmDialog
    },
    computed: {
        
    },
    mounted: function() {
        
        var vm = this;

        /* [운영사가 발행한 종목 -> ETF] 테이블 */
        publish_etp_table = $('#publish_etp_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            "scrollY": vm.faverSize +'px',
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        if (data == '1') {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star on v-icon material-icons'>star</button>";
                        } else {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star v-icon material-icons'>star</button>";
                        }
                        
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<div class='td_ellipsis'>";
                        htm += "           "+data+"";
                        htm += "            <br><span class='text_S'>"+row.F16013+"</div>";
                        return htm;
                    },
                    "targets": 1
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = ""
                            
                            htm += "<div>" + util.formatNumber(data) + "</div>";

                            if (row.F15004 >= 0) {
                                htm += "<span class='text_S text_red'>"+row.F15004+"%</span>";
                            } else {
                                htm += "<span class='text_S text_blue'>"+row.F15004+"%</span>";
                            }

                            return htm;
                            },
                    "targets": 2
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "faver", "orderable": false, width:'5%', defaultContent:"<button type='button' id='btn_faver' class='btn_icon v-icon material-icons'>star</button>"},
                { "data": "JISU_NM", "orderable": false,width:'65%', className:'txt_left line2 in_icon'},                
                { "data": "F15001", "orderable": false, width:'30%',className:'txt_right'},                
            ]
        });

        //  운영종목 에서 관심종목 클릭시
        $('#publish_etp_table tbody').on('click', 'button', function () {
            var table = $('#publish_etp_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_faver') {
                console.log(data.faver_seq);
                    //data.faver =  data.faver == '1' ? '0' : '1';

                if (data.faver == '1') {
                    data.faver = "0";
                    data.GUBUN= "1";
                    $(this).attr("class", "btn_icon_star v-icon material-icons");
                    vm.deleteItem(data);
                } else {
                    data.faver = "1";
                    $(this).attr("class", "btn_icon_star on v-icon material-icons");
                    vm.setSelectedItem(data, '1');
                }                  
            }            
        });

        //  운영종목 에서 그래프 선택시
        $('#publish_etp_table tbody').on('click', 'td', function () {
            var table = $('#publish_etp_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).index() == 1) {
                data.GUBUN= "1";
                vm.fn_detailPop( data );
            }
        });

    /* [전체 종목: 운영사가 ETF 발행사이면 ETF 전체 종목, ETN 발행사 이면 ETN 전체 종목] 테이블 */
        all_etp_table = $('#all_etp_table').DataTable( {
            "processing": true,
            "serverSide": false,
            "info": false,   // control table information display field
            "stateSave": true,  //restore table state on page reload,
            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
            "scrollY": vm.faverSize +'px',
            thead: {
                display:'none'
            },
            "ordering": false,
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "";
                        if (data == '1') {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star on v-icon material-icons'>star</button>";
                        } else {
                            htm += "<button type='button' id='btn_faver' class='btn_icon_star v-icon material-icons'>star</button>";
                        }
                        
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<div class='td_ellipsis'>";
                        htm += "           "+data+"";
                        htm += "            <br><span class='text_S'>"+row.F16013+"</div>";
                        return htm;
                    },
                    "targets": 1
                },
                {  
                    "render": function ( data, type, row ) {
                        let htm = ""
                            
                            htm += "<div>" + util.formatNumber(data) + "</div>";

                            if (row.F15004 >= 0) {
                                htm += "<span class='text_S text_red'>"+row.F15004+"%</span>";
                            } else {
                                htm += "<span class='text_S text_blue'>"+row.F15004+"%</span>";
                            }

                            return htm;
                            },
                    "targets": 2
                },
            ],
            select: {
                style:    'single',
                selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            columns: [
                { "data": "faver", "orderable": false,  defaultContent:"<button type='button' id='btn_faver' class='btn_icon v-icon material-icons'>star</button>"},
                { "data": "JISU_NM", "orderable": false, className:'txt_left line2'},      
                { "data": "F15001", "orderable": false, className:'txt_right'},                         
            ]
        });

        //  전체종목 에서 관심종목 클릭시
        $('#all_etp_table tbody').on('click', 'button', function () {
            var table = $('#all_etp_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btn_faver') {
                console.log(data.faver_seq);
                    //data.faver =  data.faver == '1' ? '0' : '1';

                if (data.faver == '1') {
                    data.faver = "0";
                    data.GUBUN= "1";
                    $(this).attr("class", "btn_icon_star v-icon material-icons");
                    vm.deleteItem(data);
                } else {
                    data.faver = "1";
                    $(this).attr("class", "btn_icon_star on v-icon material-icons");
                    vm.setSelectedItem(data, '1');
                }                  
            }            
        });

        //  전체종목 에서 그래프 선택시
        $('#all_etp_table tbody').on('click', 'td', function () {
            var table = $('#all_etp_table').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).index() == 1) {
                data.GUBUN= "1";
                vm.fn_detailPop( data );
            }
        });


        this.getPublicEtpList();
        this.getALLEtpList();
    },
    created: function() {},
    beforeDestroy() {},
    methods: {
        
        deleteItem: function(data) {        
            console.log("deleteItem");
            var vm = this;

            var jisu_cd = '';
            var market_id = '';
            if (data.GUBUN == '1') {
                jisu_cd = data.JISU_CD;
            } else {
                jisu_cd = data.JISU_CD;
                market_id = data.MARKET_ID;
            }


            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/common/deleteFavorItem"
                        ,   "data"      :   {
                                gubun       :   data.GUBUN,
                                jisu_cd     :   jisu_cd,
                                market_id   :   market_id
                            }
                        ,   "method"    :   "post"
                        ,   "paramKey"  :   "params"
                    }
                ,   function(response) {

                        try{

                            if (response.data.success == false) {
                                if ( vm.$refs.confirm2.open( '확인', '삭제 중 오류가 발생했습니다.', {}, 1 ) ) {}
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {

                        if( error ) {
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                    }
            );

        },
        /* 관심 종목 추가 */
        setSelectedItem: function(sel_items, gubun) {
            var vm = this;

            vm.jongMokDialog = false;

            var addFavorItems = [];

            /* etn 또는 etf 일경우 */
            if (gubun  == '1') {
               
                addFavorItems.push({
                    GUBUN : gubun,
                    F16012 : sel_items.JISU_CD,
                    F16013 : '',
                    F16002 : sel_items.JISU_NM,
                    MARKET_ID : '',
                    LARGE_TYPE : '',
                    MIDDLE_TYPE : ''
                });
               
            } else if (gubun == '2') {
                
                addFavorItems.push({
                    GUBUN : gubun,
                    F16012 : '',
                    F16013 : sel_items.JISU_CD,
                    F16002 : sel_items.JISU_NM,
                    MARKET_ID : sel_items.MARKET_ID,
                    LARGE_TYPE : sel_items.LARGE_TYPE,
                    MIDDLE_TYPE : sel_items.MIDDLE_TYPE
                });
            }    


            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/common/insertFavorItem"
                        ,   "data"      :   {
                                addFavorItems   :   addFavorItems
                            }
                        ,   "method"    :   "post"
                        ,   "paramKey"  :   "params"
                    }
                ,   function(response) {

                        try{

                            if (response.data.success == false) {
                                if ( vm.$refs.confirm2.open( '확인', '처리 중 오류가 발생했습니다.', {}, 1 ) ) {}
                            }

                        }catch(ex) {
                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {

                        if( error ) {
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                    }
            );

        },
        /* 종목팝업 show */
        showJongMokPop: function() {
            this.jongMokDialog = true;            
        },
        hideJongMokPop: function() {
            this.jongMokDialog = false;
        },

        /* 전체 종목 etn 종목리스트 */
        getPublicEtpList: function() {
            var vm = this;
            util.processing(this.$refs.progress, true);
            // console.log("etn_grid");

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/common/getPublishEtpList"
                        ,   "data"      :   {}
                        ,   "method"    :   "get"
                        ,   "paramKey"  :   "params"
                    }
                ,   function(response) {

                        try{

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }
                            
                            // console.log(response);
                            if (response.data.success == false) {
                                if ( vm.$refs.confirm2.open( '확인', '종목정보가 없습니다.', {}, 1 ) ) {}
                            } else {
                                var items = response.data.results;
                                vm.pubList = items;
                                publish_etp_table.clear().draw();
                                publish_etp_table.rows.add(items).draw();
                                                    
                            }

                        }catch(ex) {

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }

                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {

                        if( vm.$refs && vm.$refs.progress ) {
                            util.processing(vm.$refs.progress, false);
                        }                    

                        if( error ) {
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                    }
            );

        }, 

        /* 전체 종목 etf 종목리스트 */
        getALLEtpList: function() {

            var vm = this;

            // console.log("etn_grid");
            util.processing(this.$refs.progress, true);

            util.axiosCall(
                    {
                            "url"       :   Config.base_url + "/user/common/getALLEtpList"
                        ,   "data"      :   {}
                        ,   "method"    :   "get"
                        ,   "paramKey"  :   "params"
                    }
                ,   function(response) {

                        try{

                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }
                            
                            // console.log(response);
                            if (response.data.success == false) {
                                if ( vm.$refs.confirm2.open( '확인', '종목정보가 없습니다.', {}, 1 ) ) {}
                            } else {
                                var items = response.data.results;
                                vm.allList = items;

                                all_etp_table.clear().draw();
                                all_etp_table.rows.add(items).draw();
                        
                            }

                        }catch(ex) {
                            
                            if( vm.$refs && vm.$refs.progress ) {
                                util.processing(vm.$refs.progress, false);
                            }

                            console.log( "error", ex );
                        }
                    }
                ,   function(error) {

                        if( vm.$refs && vm.$refs.progress ) {
                            util.processing(vm.$refs.progress, false);
                        }                    

                        if( error ) {
                            if ( error && vm.$refs.confirm2.open( '확인', error, {}, 4 ) ) {}
                        }
                    }
            );

        }, 

        
        /*
         * Control 영역( 관심종목/전체종목 - ComFavorItem ) 에서 ETP 또는 INDEX 를 선택하는 경우 팝업창을 띄운다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_detailPop : function( param ) {

            var vm = this;

            console.log( "ComFavorItem.vue -> fn_detailPop" );
            console.log( param );

            vm.paramData    =   param;

            /* ETP 인 경우 */
            if( param.GUBUN == "1" ) {

                console.log("########## ComFavorItem.vue -> fn_detailPop ############");
                console.log( "param.F16012=[" + param.F16012 + "] /* 국제표준코드  */" );
                console.log( "param.F16257=[" + param.F16257 + "] /* ETP기초지수코드  */" );
                console.log( "param.F34239=[" + param.F34239 + "] /* ETP기초지수MID  */" );

                vm.paramData.F16012     =   param.F16012;           /* 국제표준코드 */
                vm.paramData.F16257     =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.F34239     =   param.F34239;           /* ETP기초지수MID */

                vm.paramData.F16002     =   param.JISU_NM;          /* 한글종목명 */
                vm.paramData.F16013     =   param.F16013;           /* 단축코드 */
                vm.paramData.F16493     =   param.F16493;           /* ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                vm.paramData.F33960     =   param.F33960;           /* ETP운용사코드 */
                vm.paramData.F16583     =   param.F16583;           /* 사무수탁회사번호 */

                vm.$emit('showDetail', 1, vm.paramData);
            }
            /* 인덱스인 경우 */
            else if( param.GUBUN == "2" ) {

                console.log("########## ComFavorItem.vue -> fn_detailPop ############");
                console.log( "param.F16257=["       + param.F16257     + "]     /* 지수코드  */" );
                console.log( "param.LARGE_TYPE=["   + param.LARGE_TYPE  + "]    /* 지수대분류(FNGUIDE, KRX, KIS, KAP)  */" );
                console.log( "param.MARKET_ID=["    + param.MARKET_ID   + "]    /* 시장 ID  */" );

                vm.paramData.F16012     =   param.F16012;           /* 국제표준코드 */
                vm.paramData.F16257     =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.F34239     =   param.F34239;           /* ETP기초지수MID */

                vm.paramData.F16257     =   param.F16257;           /* ETP기초지수코드 */
                vm.paramData.LARGE_TYPE =   param.LARGE_TYPE;       /* 지수대분류(FNGUIDE, KRX, KIS, KAP) */
                vm.paramData.MARKET_ID  =   param.MARKET_ID;        /* 시장 ID  */

                vm.paramData.F16002     =   param.JISU_NM;          /* 한글종목명 */
                vm.paramData.F16013     =   param.F16013;           /* 단축코드 */
                vm.paramData.index_cal_method     =   param.INDEX_CAL_METHOD;            /* 지수산출방식 */

                vm.$emit('showDetail', 2, vm.paramData);
            }
        },

        /*
         * Control 영역( 관심종목/전체종목 - ComFavorItem ) 에서 띄워진 Index 상세 팝업창을 종료한다.
         * 2019-04-16  bkLove(촤병국)
         */
        fn_closeIndexDetailPop : function( param ) {
            console.log( "ComFavorItem.vue -> fn_closeIndexDetailPop" );

            this.showIndexDetailDialog =       false;
        },

        fn_closeEtpDetailPop : function( param ) {
            console.log( "ComFavorItem.vue -> fn_closeEtpDetailPop" );

            this.showEtpDetailDialog    =   false;
        },
        /*filterPubData: function(mode) {
            var vm = this;

            var faverData = '-1';

            if (vm.pubFaverClass == "btn_icon_star v-icon material-icons") {                        
                faverData = "1";
                vm.pubFaverClass = "btn_icon_star v-icon on material-icons";
            } else {
                faverData = "0";
                vm.pubFaverClass = "btn_icon_star v-icon material-icons";
            }

            var filterData = _.filter(vm.pubList, function(o) { 

                if (mode == '1') {
                    var nmIdx = o.JISU_NM.indexOf(vm.search);
                    var cdIdx = o.JISU_CD.indexOf(vm.search);

                    if (nmIdx > -1 || cdIdx > -1) {
                        return true; 
                    } else {
                        return false;
                    }
                } else if (mode == '2') {          
                    
                    if (faverData == "0") return true;

                    var faverIdx = o.faver.indexOf(faverData);
                    if (faverIdx > -1) {
                        return true; 
                    } else {
                        return false;
                    }
                }
            });

            publish_etp_table.clear().draw();
            publish_etp_table.rows.add(filterData).draw();           
        },     */
        
        filterAllData: function(mode) {
            var vm = this;
            var faverData = '-1';
            vm.search = vm.search.toUpperCase();

            /* 이벤트 delay이로 부하 줄임 */
            var delay = (function(){
                var timer = 0;
                return function(callback, ms){
                    clearTimeout (timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            delay(function(){
                if (vm.allFaverClass == "btn_icon_star v-icon material-icons") {                        
                    faverData = "1";
                    vm.allFaverClass = "btn_icon_star v-icon on material-icons";
                } else {
                    faverData = "0";
                    vm.allFaverClass = "btn_icon_star v-icon material-icons";
                }
                /* 운영 종목 필터링 */
                var filterData = _.filter(vm.pubList, function(o) { 

                    if (mode == '1') {
                        var nmIdx = o.JISU_NM.indexOf(vm.search);
                        var cdIdx = o.JISU_CD.indexOf(vm.search);

                        if (nmIdx > -1 || cdIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    } else if (mode == '2') {          
                        
                        if (faverData == "0") return true;

                        var faverIdx = o.faver.indexOf(faverData);
                        if (faverIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    }
                });

                publish_etp_table.clear().draw();
                publish_etp_table.rows.add(filterData).draw();       
                
                /* 전 종목 필터링 */
                var AllFilterData = _.filter(vm.allList, function(o) { 

                    if (mode == '1') {
                        var nmIdx = o.JISU_NM.indexOf(vm.search);
                        var cdIdx = o.JISU_CD.indexOf(vm.search);

                        if (nmIdx > -1 || cdIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    } else if (mode == '2') {          
                        
                        if (faverData == "0") return true;

                        var faverIdx = o.faver.indexOf(faverData);
                        if (faverIdx > -1) {
                            return true; 
                        } else {
                            return false;
                        }
                    }
                });

                all_etp_table.clear().draw();
                all_etp_table.rows.add(AllFilterData).draw();    
            
            }, 1000 );
        },        

     
    }
};
</script>