<template>
    <v-container>
        <v-layout row wrap class="con_wrap">
            <v-flex grow class="conWidth_left">

                <v-card flat>
                <div class="title01_w case2">
                    <v-card-title primary-title>
                        <div class="title_wrap01">
                            <h3 class="headline subtit">
                            ETP 운용 정보
                                <span class="text_result">{{ result_cnt }}</span>
                                <span class="text_result_t">results</span>
                                <span class="sub_txt">기준일 : {{ fmt_F12506 }}</span>
                            </h3>
                            <div class="right_btn">
                                <span><button type='button'  class="exceldown_btn" @click.stop="fn_downExcel"></button></span>

                                <span class="toggle2">
                                    <v-btn-toggle v-model="stateInfo.gubun" class="toggle_01">
                                        <v-btn flat value="A"       @click="fn_getEtpOperInfo('A')">전종목</v-btn>
                                        <v-btn flat value="K"       @click="fn_getEtpOperInfo('K')">국내</v-btn>
                                        <v-btn flat value="F"       @click="fn_getEtpOperInfo('F')">해외</v-btn>
                                        <v-btn flat value="I"       @click="fn_getEtpOperInfo('I')">관심종목</v-btn>
                                    </v-btn-toggle>
                                </span>
                                
                            </div>
                            
                        </div>
                    </v-card-title>
                </div>

                    <v-card flat>
                        <div v-show='stateInfo.pageState != "performance"' >
                            <table id="table01" class="tbl_type ver7"    style="width:100%"/>
                        </div>

                        <div v-show='stateInfo.pageState == "performance"' >
                            <table id="table02" class="tbl_type ver7"    style="width:100%">

                                <colgroup>
                                    <col width="20%">       <!-- 종목 -->

                                    <col width="8%">        <!-- 1주 -->
                                    <col width="8%">        <!-- 1개월 -->
                                    <col width="8%">        <!-- 3개월 -->
                                    <col width="8%">        <!-- YTD -->

                                    <col width="8%">        <!-- 1주 -->
                                    <col width="8%">        <!-- 1개월 -->
                                    <col width="8%">        <!-- 3개월 -->
                                    <col width="8%">        <!-- YTD -->

                                    <col width="14%">
                                </colgroup>

                                <thead>
                                    <tr>
                                        <th class="txt_left"    rowspan="2">종목</th>

                                        <th class="txt_center"  colspan="4">수익율(종가)</th>
                                        <th class="txt_center"  colspan="4">수익율(NAV)</th>
                                        <th rowspan="2"></th>
                                    </tr>

                                    <tr>
                                        <th class="txt_right">1주</th>
                                        <th class="txt_right">1개월</th>
                                        <th class="txt_right">3개월</th>
                                        <th class="txt_right">YTD</th>

                                        <th class="txt_right">1주</th>
                                        <th class="txt_right">1개월</th>
                                        <th class="txt_right">3개월</th>
                                        <th class="txt_right">YTD</th>
                                    </tr>
                                </thead>                                
                            </table>
                            <!--투자지표 아이콘 변경
                            <table id="" class="tbl_type ver7" style="width:100%">

                                 <thead>
                                    <tr>
                                        <th class="txt_left">투자지표 아이콘</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    <tr>
                                        <td><div class="tooltip"><button type="button" name="" class="calcu_icon"></button><span class="tooltiptext" style="width:70px;">투자지표</span></div></td>
                                    </tr>
                                    <tr>
                                            <td>test</td>
                                    </tr>
                                </tbody>                               
                            </table>
                            -->
                            
                        </div>                        
                    </v-card>
                </v-card>
            </v-flex>  
            <v-flex class="conWidth_right">
                 <!-- [ETP 운영정보] Quick 메뉴 정보 -->
                    <EtpOperInfoQuick   :etpBasic = "etpBasic"
                                        :toggle = "toggle"

                                        @fn_setInavData = "fn_setInavData"
                                        @fn_setEtpPerformanceData = "fn_setEtpPerformanceData"
                                        @fn_setEtpLpspread = "fn_setEtpLpspread"
                                        @fn_setCustomizeData = "fn_setCustomizeData"

                                        @showDetail="showDetail" 
                                        @showMessageBox="showMessageBox"
                                        @fn_showDetailIndex="fn_showDetailIndex">
                    </EtpOperInfoQuick>
            </v-flex>       
        </v-layout>
    <EtpLpModal v-if="EtpLpModalFlag" :etpInfo="etpBasic" @closeEtpLpModal="closeEtpLpModal"></EtpLpModal>
    </v-container>
</template>


<script>
import $      from 'jquery';
import dt      from 'datatables.net';
import buttons from 'datatables.net-buttons';
import util       from "@/js/util.js";
import dtFc from "datatables.net-fixedcolumns";

import Config from '@/js/config.js';
import Constant from "@/store/store_constant.js"

import EtpOperInfoQuick         from    "@/components/Home/Etp/Manage/EtpOperInfoQuick.vue";
import EtpLpModal   from  '@/components/common/modal/EtpLpModal.vue';

var table01 = null;
var table02 = null;

export default {
    props : [ "toggle", "state" ],
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
            EtpOperInfoQuick,
            EtpLpModal,
    },
    data() {
        return {
            text: "전종목",
            fmt_F12506 :   "",

            stateInfo :     {       
                                    pageState : 'etpInfo'   /* etpInfo - ETP운용정보, iNav - iNav 산출현황, performance - ETP Performance, customize - 컬럼 선택 */
                                ,   gubun : 'A' 
                                ,   totWidth : 0
                            },
            arrShowColumn   :   [],
            arrShowColumnDef   :   [],
            etpOperInfoQuickYn : true,

            result_cnt  :   0,
            etpBasic  :   {},
            paramData   :   {},
            etpRow      :   {},
            inavGubun   :   "",
            showInavPdfYn : false,
            showInavIndexYn : false,
            EtpLpModalFlag: false,
        };
    },
    mounted: function() {
        var vm = this;

        console.log( "######### EtpOperInfo.vue mounted ");

        if( vm.state ) {
            vm.stateInfo.pageState  =   vm.state.pageState;
            vm.stateInfo.gubun  =   vm.state.gubun;
        }

        if( vm.toggle ) {
            if( vm.toggle.arrCustomizeColumn && vm.toggle.arrCustomizeColumn.length > 0 ) {
                vm.arrCustomizeColumn   =   vm.toggle.arrCustomizeColumn;
            }
        }


        new Promise(function(resolve, reject) {

        /* [ETP Performance] 테이블 정보 */
            vm.fn_setArrShowColumn( [
                    'F16002'                        /* 종목 */

                ,   'W00002'                         /* 종가1주수익률 */
                ,   'W00003'                        /* 종가1달수익률 */
                ,   'W00004'                        /* 종가3달수익률 */
                ,   'W00005'                        /* 종가YTD수익률 */

                ,   'W00012'                         /* NAV1주수익률 */
                ,   'W00013'                        /* NAV1달수익률 */
                ,   'W00014'                        /* NAV3달수익률 */
                ,   'W00015'                        /* NAVYTD수익률 */                

                ,   'graph'                         /* 그래프 영역 */
            ]);

            for( var i in vm.arrShowColumn ) {
                vm.arrShowColumn[i].title   =   undefined;
            }

            table02 = $('#table02').DataTable( {
                "processing": true,
                "serverSide": false,
                "info": false,   // control table information display field
                "stateSave": true,  //restore table state on page reload,
                "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                "scrollY": '760px',
                paging: false,
                searching: false,
                data : [],
                autoWidth: false,
                columns     :   vm.arrShowColumn,
                columnDefs  :   vm.arrShowColumnDef
            });

            // 테이블별 이벤트
            $('#table02 tbody').on('click', 'button[id=btnInav],button[id=btnEtpInfo],button[id=btnPdf]', function () {

                var table = $('#table02').DataTable();
                var data = table.row($(this).parents('tr')).data();
                var rowInx = table.row($(this)).index();
                var btnId   =   $(this).attr('id');

                console.log("########## EtpOperInfo.vue -> pageMove START ############");
                console.log( "data.F16012=[" + data.F16012 + "] /* 국제표준코드  */" );
                console.log( "data.F16257=[" + data.F16257 + "] /* ETP기초지수코드  */" );
                console.log( "data.F34239=[" + data.F34239 + "] /* ETP기초지수MID  */" );

                vm.paramData.F16012         =   data.F16012;        /* 국제표준코드  */
                vm.paramData.F16257         =   data.F16257;        /* ETP기초지수코드  */
                vm.paramData.F34239         =   data.F34239;        /* ETP기초지수MID  */
                vm.paramData.rowIndex       =   rowInx;

                switch( btnId ) {

                    case    'btnInav'       :

                                var gubun   =   "7";

                                /* 0-PDF, 1-지수 수익율 */
                                if( data.F33929 == "0" ) {
                                    gubun   =   "7";
                                }else if( data.F33929 == "1" ) {
                                    gubun   =   "8";
                                }

                                vm.$emit( "fn_showDetailPdf", gubun, data );

                                break;

                    case    'btnEtpInfo'    :
                                vm.$emit('showDetail', 1, data );
                                break;

                    case    'btnPdf'    :
                                vm.$emit('fn_pageMove', btnId, data);
                                break;
                }
                
                console.log("########## EtpOperInfo.vue -> pageMove END ############");
            });            

            resolve();

        }).catch( function(e) {

            console.log( e );

        }).then( function() {

            vm.fn_setTableInfo( vm.arrCustomizeColumn );
            vm.fn_getEtpOperInfo( vm.stateInfo.gubun );
        });
    },
    created: function() {},
    beforeDestory: function() {
        var vm = this;
    },

    methods: {

        /*
         *  ETP 운영정보를 조회한다.
         *  param   :   ETP지표가치산출구분(K:국내,F:해외)  / A:전종목, I:관심종목
         *  2019-05-03  bkLove(촤병국)
         */
        fn_getEtpOperInfo( gubun ) {

            var vm = this;

            console.log( "EtpOperInfo.vue -> fn_getEtpOperInfo" );

            if( vm.stateInfo.gubun ) {
                vm.stateInfo.gubun   =   gubun;        /* A-전종목, K-국내, F-해외, I-관심종목 */
            }

            if( vm.stateInfo.pageState == "performance" ) {
                if( table02 ) {
                    table02.clear().draw();
                }
            }else{
                if( table01 ) {
                    table01.clear().draw();
                }
            }


            vm.$emit( "fn_showProgress", true );

            axios.post(Config.base_url + "/user/etp/getEtpOperInfo", {
                data: {
                    F34241 : vm.stateInfo.gubun
                }
            }).then(function(response) {
                console.log(response);

                vm.$emit( "fn_showProgress", false );
                if (response.data) {
                    var dataList = response.data.dataList;

                    vm.result_cnt   =   0;

                    var msg = ( response.data.msg ? response.data.msg : "" );
                    if (!response.data.result) {
                        if( msg ) {
                            vm.showMessageBox('확인', msg,{},1);
                            return  false;
                        }
                    }

                    if( dataList && dataList.length > 0 ) {

                        if( vm.stateInfo.pageState == "performance" ) {
                            table02.rows.add( dataList ).draw();

                            vm.etpBasic     =   table02.rows().data()[0];
                        }else{
                            table01.rows.add( dataList ).draw();

                            vm.etpBasic     =   table01.rows().data()[0];
                        }

//                        vm.etpBasic     =   dataList[0];
                        vm.fmt_F12506   =   vm.etpBasic.fmt_F12506;
                        vm.result_cnt   =   util.formatInt( dataList.length );

                        vm.$emit( "fn_setFirstData", vm.etpBasic );
                    }
                    
                    vm.$emit( "fn_setStateInfo", vm.stateInfo );
                }

            }).catch(error => {
                vm.$emit( "fn_showProgress", false );
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        },

        /*
         *  테이블 기본정보를 설정한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setTableInfo( arrCustomizeColumn ) {

            var vm = this;


            /* [기본 ETP 운용정보] 를 선택한 경우 */
            if( vm.stateInfo.pageState == "etpInfo" ) {
                
                vm.fn_setArrShowColumn( [ 
                        'F16002'                        /* 종목 */
                    ,   'F15301'                        /* iNAV */
                    ,   'F03329'                        /* 전일최종NAV */
                    ,   'F19329'                        /* 전일추적오차율 */
                    ,   'F19330'                        /* 전일괴리율 */

                    ,   'F34777'                        /* 기초지수 */
                    ,   'F15318'                        /* 지수현재가 */
                    ,   'graph'                         /* 그래프 영역 */
                ] );

            }
            /* [iNAV 산출현황] 을 선택한 경우 */
            else if( vm.stateInfo.pageState == "iNav" ) {

                vm.fn_setArrShowColumn( [ 
                        'F16002'                        /* 종목 */
                    ,   'F33929_nm'                     /* 산출방식 */
                    ,   'F15301'                        /* iNAV */
                    ,   'F03329'                        /* 전일최종NAV */

                    ,   'F34777'                        /* 기초지수 */
                    ,   'F15318'                        /* 지수현재가 */
                    ,   'F18450'                        /* 환코드 */
                    ,   'F18438'                        /* 환율 */
                    ,   'graph'                         /* 그래프 영역 */
                ] );
            }
            /* [LP spread] 을 선택한 경우 */
            else if( vm.stateInfo.pageState == "lpspread" ) {

                vm.fn_setArrShowColumn( [ 
                        'F16002'                        /* 종목 */
                    ,   'F15301'                        /* iNAV */
                    ,   'F15318'                        /* 지수현재가 */
                    ,   'F40544'                        /* LP매도호가1 */
                    ,   'F40545'                        /* LP매수호가1 */
                    ,   'F33294'                        /* LP스프레드 */
                    ,   'graph'                         /* 그래프 영역 */
                ] );
            }
            /* customize 를 선택한 경우 */
            else if( vm.stateInfo.pageState == "customize" ) {
                
                if( arrCustomizeColumn && arrCustomizeColumn.length > 0  ) {
                    vm.fn_setArrShowColumn( arrCustomizeColumn );                
                }
            }

            if( vm.stateInfo.pageState != "performance" ) {

                var tableObj    =    {
                    "processing": true,
                    "serverSide": false,
                    "info": false,   // control table information display field
                    "stateSave": true,  //restore table state on page reload,
                    "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                    "scrollY": '760px',
                    paging: false,
                    searching: false,
                    data : [],
                    autoWidth: false,

                    fixedColumns:   {
                        leftColumns: 2,
                    }
                };

                if ( $.fn.DataTable.isDataTable('#table01') ) {
                    $('#table01').DataTable().destroy();
                    $('#table01').empty();
                }

                if( vm.stateInfo.totWidth > 900 ) {
                    $('#table01').attr( "style", "width: 1500px; table-layout: fixed;");
                    tableObj.scrollX    =   true;
                }else{
                    $('#table01').attr( "style", "width: 100%; ");
                    tableObj.scrollX    =   false;
                }

                tableObj.columns    =   vm.arrShowColumn ;
                tableObj.columnDefs =   vm.arrShowColumnDef ;

                table01 = $('#table01').DataTable( tableObj );
            }


            // 테이블별 이벤트
            $('#table01 tbody').on('click', 'button[id=btnInav],button[id=btnSpread],button[id=btnEtpInfo],button[id=btnPdf]', function () {

                var table = $('#table01').DataTable();
                var data = table.row($(this).parents('tr')).data();
                var rowInx = table.row($(this)).index();
                var btnId   =   $(this).attr('id');

                console.log("########## EtpOperInfo.vue -> pageMove START ############");
                console.log( "data.F16012=[" + data.F16012 + "] /* 국제표준코드  */" );
                console.log( "data.F16257=[" + data.F16257 + "] /* ETP기초지수코드  */" );
                console.log( "data.F34239=[" + data.F34239 + "] /* ETP기초지수MID  */" );

                vm.paramData.F16012         =   data.F16012;        /* 국제표준코드  */
                vm.paramData.F16257         =   data.F16257;        /* ETP기초지수코드  */
                vm.paramData.F34239         =   data.F34239;        /* ETP기초지수MID  */
                vm.paramData.rowIndex       =   rowInx;

                switch( btnId ) {

                    case    'btnInav'       :

                                var gubun   =   "7";

                                /* 0-PDF, 1-지수 수익율 */
                                if( data.F33929 == "0" ) {
                                    gubun   =   "7";
                                }else if( data.F33929 == "1" ) {
                                    gubun   =   "8";
                                }

                                vm.$emit( "fn_showDetailPdf", gubun, data );

                                break;

                    case    'btnSpread'    :
                      console.log("btnSpread..........");
                      console.log(data);
                      vm.openEtpLpModal(data);
                      break;

                    case    'btnEtpInfo'    :
                                vm.$emit('showDetail', 1, data );
                                break;

                    case    'btnPdf'    :
                                vm.$emit('fn_pageMove', btnId, data);
                                break;
                }
                
                console.log("########## EtpOperInfo.vue -> pageMove END ############");
            });                
        },

        /*
         *  EtpOperInfoQuick.vue -> [iNAV 산출현황] 선택시 호출된다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setInavData( paramData ) {
            
            var vm = this;

            console.log("########## EtpOperInfo.vue -> fn_setInavData START ############");
            console.log("# paramData");
            console.log( paramData );

            /* iNAV 산출현황 버튼이 체크된 경우에는 iNAV 정보를 노출한다. */
            if( paramData && paramData.toggleINav ) {
                vm.stateInfo.pageState  =  'iNav';              /* etpInfo - ETP운용정보, iNav - iNav 산출현황, performance - ETP Performance, customize - 컬럼 선택 */
            }
            /* iNAV 산출현황 버튼이 두번 눌러 체크해제된 경우 etp 기본 정보를 노출한다.  */
            else{
                vm.stateInfo.pageState  =  'etpInfo';
            }

            vm.fn_setTableInfo();
            vm.fn_getEtpOperInfo( vm.stateInfo.gubun );

            vm.$emit( "fn_setInavData", paramData, vm.stateInfo );

            console.log("########## EtpOperInfo.vue -> fn_setInavData END ############");
        },

        /*
         *  EtpOperInfoQuick.vue -> [ETP Performance] 선택시 호출된다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setEtpPerformanceData( paramData ) {

            var vm = this;

            console.log("########## EtpOperInfo.vue -> fn_setEtpPerformanceData START ############");
            console.log("# paramData");
            console.log( paramData );

            /* ETP Performance 버튼이 체크된 경우에는 iNAV 정보를 노출한다. */
            if( paramData && paramData.toggleEtpPerformance ) {
                vm.stateInfo.pageState  =  'performance';              /* etpInfo - ETP운용정보, iNav - iNav 산출현황, performance - ETP Performance, customize - 컬럼 선택 */
            }
            /* ETP Performance 버튼이 두번 눌러 체크해제된 경우 etp 기본 정보를 노출한다.  */
            else{
                vm.stateInfo.pageState  =  'etpInfo';
            }

            vm.fn_setTableInfo();
            vm.fn_getEtpOperInfo( vm.stateInfo.gubun );

            vm.$emit( "fn_setEtpPerformanceData", paramData, vm.stateInfo );

            console.log("########## EtpOperInfo.vue -> fn_setEtpPerformanceData END ############");
        },

        fn_setEtpLpspread( paramData ) {

            var vm = this;

            console.log("########## EtpOperInfo.vue -> fn_setEtpLpspread START ############");
            console.log("# paramData");
            console.log( paramData );

            /* ETP Lpspread 버튼이 체크된 경우에는 iNAV 정보를 노출한다. */
            if( paramData && paramData.toggleEtpLpspread ) {
                vm.stateInfo.pageState  =  'lpspread';              /* etpInfo - ETP운용정보, iNav - iNav 산출현황, performance - ETP Performance, customize - 컬럼 선택 */
            }
            /* ETP Performance 버튼이 두번 눌러 체크해제된 경우 etp 기본 정보를 노출한다.  */
            else{
                vm.stateInfo.pageState  =  'etpInfo';
            }

            vm.fn_setTableInfo();
            vm.fn_getEtpOperInfo( vm.stateInfo.gubun );

            vm.$emit( "fn_setEtpLpspread", paramData, vm.stateInfo );

            console.log("########## EtpOperInfo.vue -> fn_setEtpLpspread END ############");
        },

        /*
         *  EtpOperInfoQuick.vue -> [Curtomize] 선택시 호출된다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setCustomizeData( paramData ) {

            var vm = this;

            console.log("########## EtpOperInfo.vue -> fn_setCustomizeData START ############");
            console.log("# paramData");
            console.log( paramData );

            vm.stateInfo.pageState  =  'customize';

            if( paramData && paramData.arrCustomizeColumn.length > 0 ) {
                vm.arrCustomizeColumn   =   paramData.arrCustomizeColumn;

                vm.fn_setTableInfo( paramData.arrCustomizeColumn );
                vm.fn_getEtpOperInfo( vm.stateInfo.gubun );
            }

            vm.$emit( "fn_setCustomizeData", paramData, vm.stateInfo );

            console.log("########## EtpOperInfo.vue -> fn_setCustomizeData END ############");
        },
        
        /*
         *  테이블에서 그래프 영역에 출력될 버튼이미지를 렌더링한다.
         *  2019-05-03  bkLove(촤병국)
         */        
        fn_getGraphInfo( param ) {

            var graphContent    =   "";

            var divClass = "tooltip";
            var btnClass = "btn_icon v-icon material-icons";
            var btnSpanClass = "tooltiptext";
            var btnSpanStyle = "width:70px;";

            var btnId = "";
            var btnContent = "";
            var btnSpanContent = "";

            if( !param ) {
                return  graphContent;
            }

            if(     typeof param.btnId      === "undefined"
                ||  typeof param.btnContent === "undefined" 
            ) {
                return  graphContent;
            }


            if( typeof param.btnSpanContent != "undefined" ) {
                btnSpanContent  =   param.btnSpanContent;
            }            

            btnId           =   param.btnId;
            btnContent      =   param.btnContent;


            graphContent    +=  '<div class="' + divClass + '">';
            graphContent    +=      '<button    id="' + btnId + '" ';
            graphContent    +=      '           type="button" ';
            graphContent    +=      '           class="' + btnClass + '" ';
            graphContent    +=      '>' + btnContent + '</button>';
            graphContent    +=      '<span class="' + btnSpanClass + '" style="' + btnSpanStyle + '">' + btnSpanContent + '</span>';
            graphContent    +=  '</div>';            

            return  graphContent;
        },


        /*
         *  노출할 컬럼 배열정보를 통해 테이블에 컬럼을 설정한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setArrShowColumn( arrTemp ) {
            var vm = this;

            var typeCd  =   vm.$store.state.user.type_cd;
            var krxCd   =   vm.$store.state.user.krx_cd;

            var arrColumn  =   [
                { 'name' : 'F16002'             , 'data': 'F16002'           ,  'width' : '150', 'orderable' : true  , 'className': 'txt_left',  'title' : '종목'           },      /* 한글종목명 */
                { 'name' : 'F33929_nm'          , 'data': 'F33929_nm'        ,  'width' : '70',  'orderable' : true  , 'className': 'txt_left',  'title' : '산출방식'   },      /* 지표산출방식 */
                { 'name' : 'F15301'             , 'data': 'F15301'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : 'iNAV'          },      /* ETP지표가치(NAV/IV) */
                { 'name' : 'F03329'             , 'data': 'F03329'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : '전일NAV'},      /* 전일ETP지표가치(예탁원)(NAV/IV) */
                { 'name' : 'F40544'             , 'data': 'F40544'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : 'LP매도호가'},      /* LP매도호가 */
                { 'name' : 'F40545'             , 'data': 'F40545'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : 'LP매수호가'},      /* LP매수호가 */
                { 'name' : 'F33294'             , 'data': 'F33294'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : 'LP스프레드'},      /* LP스프레드 */
                { 'name' : 'F19329'             , 'data': 'F19329'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : 'TE' },      /* 추적오차율 */
                                                                                                                                                    
                { 'name' : 'F19330'             , 'data': 'F19330'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : '괴리율'        },      /* ETP괴리율 */
                { 'name' : 'F34777'             , 'data': 'F34777'           ,  'width' : '120', 'orderable' : true  , 'className': 'txt_left' , 'title' : '기초지수'      },      /* 기초지수명 */
                { 'name' : 'F15318'             , 'data': 'F15318'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '지수' },      /* 지수 현재가 */
                { 'name' : 'F18450'             , 'data': 'F18450'           ,  'width' : '40',  'orderable' : true  , 'className': 'txt_right', 'title' : '환코드'         },      /* 해외ETF원주자산기준통화코드 */
                { 'name' : 'F18438'             , 'data': 'F18438'           ,  'width' : '70',  'orderable' : true  , 'className': 'txt_right', 'title' : '환율'          },      /* 적용환율 */
                { 'name' : 'F18001'             , 'data': 'F18001'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'ETF 전일가'    },      /* 전일ETF순자산총액(원)  */

                { 'name' : 'W00002'             , 'data': 'W00002'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '1주'        },      /* 종가1주수익률  */
                { 'name' : 'W00003'             , 'data': 'W00003'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '1개월'      },     /* 종가1달수익률  */
                { 'name' : 'W00004'             , 'data': 'W00004'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '3개월'      },      /* 종가3달수익률  */
                { 'name' : 'W00005'             , 'data': 'W00005'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : 'YTD'        },      /* 종가YTD수익률  */

                { 'name' : 'W00012'             , 'data': 'W00012'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '1주'        },      /* NAV1주수익률  */
                { 'name' : 'W00013'             , 'data': 'W00013'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '1개월'      },     /* NAV1달수익률  */
                { 'name' : 'W00014'             , 'data': 'W00014'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '3개월'      },      /* NAV3달수익률  */
                { 'name' : 'W00015'             , 'data': 'W00015'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : 'YTD'        },      /* NAVYTD수익률  */
                                                                                                                                                    
                { 'name' : 'F30812'             , 'data': 'F30812'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'AUM'           },      /* 유동시가총액  */
                { 'name' : 'F15007'             , 'data': 'F15007'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '과표기준가'    },      /* 기준가  */
                { 'name' : 'F15001'             , 'data': 'F15001'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'ETF 현재가'    },      /* 현재가  */
                { 'name' : 'F16073'             , 'data': 'F16073'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '과세구분'      },      /* 락구분코드  */

                { 'name' : 'graph'              , 'data': null               ,  'width' : '120', 'orderable' : false  },
            ];        

            var arrColumnDef  =   [
                    /* 종목 */
                    {       'name' : 'F16002'   
                        ,   "render": function ( data, type, row ) {

                                let htm = "<span>";
                                htm +=          "<b>"+data+"</b>";
                                htm +=          "<br><span class='text_s'>"+row.F16013+"</span>";        /* ETF단축코드 */
                                if (row.new_yn == "Y") {
                                    htm += " <span><div class='text_new'>new</div></span>";
                                }
                                return htm;
                            }
                    },

                    /* iNAV */
                    {       'name' : 'F15301'   
                        ,   "render": function ( data, type, row ) {
                                let htm = "";
            
                                htm += util.formatNumber(data);

                                if (row.F30818 >= 0) {
                                    htm += "<br><span class='text_S text_red'>"+row.F30818+"%</span>";      /* 장중지표가치(iNAV/iIV)등락율 */
                                } else {
                                    htm += "<br><span class='text_S text_blue'>"+row.F30818+"%</span>";     /* 장중지표가치(iNAV/iIV)등락율 */
                                }

                                return htm;
                            },
                    },

                    /* 전일NAV */
                    {       'name' : 'F03329'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""
            
                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* LP매도호가 */
                    {       'name' : 'F40544'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""
            
                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* LP매수호가 */
                    {       'name' : 'F40545'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""
            
                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* LP스프레드 */
                    {       'name' : 'F33294'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""
            
                                htm += util.formatNumber(data)+"%";

                                return htm;
                            },
                    },

                    /* 지수 */
                    {       'name' : 'F15318'   
                        ,   "render": function ( data, type, row ) {
                                let htm = "";
            
                                htm += util.formatNumber(data);

                                if (row.F30823 >= 0) {
                                    htm += "<br><span class='text_S text_red'>"+row.F30823+"%</span>";      /* ETF관련지수등락율 */
                                } else {
                                    htm += "<br><span class='text_S text_blue'>"+row.F30823+"%</span>";     /* ETF관련지수등락율 */
                                }

                                return htm;
                            },
                    },

                    /* 환율 */
                    {       'name' : 'F18438'   
                        ,   "render": function ( data, type, row ) {

                                var v_F30819      =   util.formatNumber( row.F30819 );        /* 매매기준율 */
                                var v_F30824      =   util.formatNumber( row.F30824 );        /* 장전기준율 */

                                var rateData    =   util.formatNumber( ( ( util.NumtoStr( v_F30819 ) / util.NumtoStr( v_F30824 ) ) - 1 ) * 100 );    /* ( 장전기준율 / 매매기준율 - 1 ) * 100 */

                                let htm = ""

                                htm += util.formatNumber( row.F30819 );                     /* 매매기준율 */
                                htm += "<br>";

                                if ( rateData >= 0) {
                                    htm += "<span class='text_S text_red'>"+rateData+"%</span>";
                                } else {
                                    htm += "<span class='text_S text_blue'>"+rateData+"%</span>";
                                }                                

                                return htm;
                            },
                    },                    

                    /* 종가1주수익률 */
                    {       'name' : 'W00002'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* 종가1달수익률 */
                    {       'name' : 'W00003'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* 종가3달수익률 */
                    {       'name' : 'W00004'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },


                    /* 종가YTD수익률 */
                    {       'name' : 'W00005'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* NAV1주수익률 */
                    {       'name' : 'W00012'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* NAV1달수익률 */
                    {       'name' : 'W00013'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* NAV3달수익률 */
                    {       'name' : 'W00014'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },


                    /* NAVYTD수익률 */
                    {       'name' : 'W00015'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* 과표기준가 */
                    {       'name' : 'F15007'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""
            
                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* ETF 현재가 */
                    {       'name' : 'F15001'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""
            
                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },


                    /* ETF 전일가 */
                    {       'name' : 'F18001'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""
            
                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },                    

                    /* 그래프 */
                    {       'name' : 'graph'   
                        ,   "render": function ( data, type, row ) {

                                var graphContent = "";

                                /* etpInfo - ETP운용정보, iNav - iNav 산출현황, performance - ETP Performance, customize - 컬럼 선택 */
                                /* iNAV 산출현황 */
                                if( vm.stateInfo.pageState === 'iNav' ) {

                                    if(     ( typeCd == "9998" || typeCd == "9999" ) 
                                        ||  krxCd == row.F33960                         /* 로그인 운용사 코드와 해당 row의 ETP운용사코드 가 같은 경우 */
                                    ) {
                                        graphContent    +=  '<div class="tooltip"><button type="button" id="btnInav" name="btnInav" class="calcu_icon"></button><span class="tooltiptext" style="width:70px;">투자지표</span></div>';
                                    }
//                                    graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnInav", "btnContent" : "visibility", "btnSpanContent" : "투자지표" } );
                                }else if( vm.stateInfo.pageState === 'lpspread' ) {
                                        graphContent    +=  '<div class="tooltip"><button type="button" id="btnSpread" name="btnSpread" class="calcu_icon"></button><span class="tooltiptext" style="width:70px;">LP차트</span></div>';
                                }
                                
                                /* ETF 상세정보 */
                                graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnEtpInfo", "btnContent" : "equalizer", "btnSpanContent" : "ETP정보" } );

                                /* ETF 인 경우에만 PDF 아이콘 노출 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                                if( row.F16493 == "1" || row.F16493 == "2" ) {

                                    /* PDF 정보 */
                                    graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnPdf", "btnContent" : "pie_chart", "btnSpanContent" : "PDF관리" } );
                                }

                                return  graphContent;
                            }
                    },                

/*            
                {       'name' : 'F33929'   
                    ,   "render": function ( data, type, row ) {
                            if (data) {
                                return "<img src='/assets/img/icon_bar01.png'><span>&nbsp;&nbsp;&nbsp;" + data + "</span>";
                            } else {
                                return "";
                            }
                        }
                },
                {       'name' : 'F15301'             
                    ,   "render": function ( data, type, row ) {
                            if (data) {
                                return "<img src='/assets/img/icon_bar01.png'><span>&nbsp;&nbsp;&nbsp;" + data + "</span>";
                            } else {
                                return "";
                            }
                        }            
                },
                {       'name' : 'F03329'             
                    ,   "render": function ( data, type, row ) {
                                let htm = "<span>";
                                htm += "           <b>"+data+"</b>";
                                return htm;
                        }
                },
*/            
            ];

            vm.stateInfo.totWidth    =   0;

            vm.arrShowColumn    =   [];
            vm.arrShowColumnDef =   [];


            if( arrTemp && arrTemp.length > 0 ) {

                /* 화면에 노출할 arrTemp 배열을 통해 arrShowColumn 에 노출할 컬럼 정보를 넣는다. */
                arrTemp.forEach(function(e,i) {
                    var same = arrColumn.filter(function(o, p) {
                        return o.name === e;
                    });

                    if( same.length > 0 ) {
                        vm.stateInfo.totWidth += Number( same[0].width );

                        vm.arrShowColumn.push( same[0] );
                    }
                });
            }



            if( vm.arrShowColumn.length > 0 )  {

                /* 설정한 columnDefs 가 존재하는 경우 */
                if( arrColumnDef.length > 0 ) {

                    /* 화면에 노출할 arrTemp 배열 과 일치하는 columnDefs 정보를 넣는다. */
                    vm.arrShowColumn.forEach(function(e,i) {
                        var same = arrColumnDef.filter(function(o, p) {
                            return o.name === e.name;
                        });

                        if( same.length > 0 ) {
                            same[0].targets = [ i ];
                            vm.arrShowColumnDef.push( same[0] );
                        }
                    });
                }

            }
        },


        /*
         *  iNAV 산출현황 선택 후 그리드에서 pdf 또는 index 에 따라 호출되 팝업창을 총료한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_close( param ) {
            var vm = this;

            vm.inavGubun   =   "";

            vm.showInavPdfYn   =   false;
            vm.showInavIndexYn =   false;
        },
        
        showDetail: function(gubun, paramData) {      
            var vm = this;

            vm.$emit( "showDetail", gubun, paramData );
        },

        showMessageBox: function(title, msg, option, gubun) {
            var vm = this;

            vm.$emit( "showMessageBox", title, msg, option, gubun );
        },

        fn_showDetailIndex( gubun, paramData) {
            var vm = this;

            vm.$emit( "fn_showDetailIndex", gubun, paramData );
        },

        /*
         *  엑셀을 다운로드 한다.
         *  2019-07-09  bkLove(촤병국)
         */
        fn_downExcel: function() {
            var vm = this;

            var tableList = null;

            /* Performance 인 경우 */
            if( vm.stateInfo.pageState == "performance" ) {
                tableList   =   table02.rows().data();
            }
            /* 그외 인 경우 */
            else{
                tableList   =   table01.rows().data();
            }

            if( !tableList || tableList.length == 0 ) {
                vm.$emit("showMessageBox", '확인','조회된 내용이 1건 이상 존재해야 합니다.',{},1);
                return  false;
            }            

            var arrHeaderNm     =   [];
            var arrHeaderKey    =   [];
            var arrColsInfo     =   [];

            var sheetNm         =   "";
            var execelDataList  =   [];


            /* [default]를 선택하는 경우 */
            if( vm.stateInfo.pageState == "etpInfo" ) {
                sheetNm         =   "ETP 운용정보";
                arrHeaderNm     =   [       "종목", "단축코드", "iNAV", "iNAV 등락율", "전일NAV"
                                        ,   "TE", "괴리율", "기초지수", "지수", "지수 등락율" ];
                arrHeaderKey    =   [       "F16002", "F16013", "F15301", "F30818", "F03329"
                                        ,   "F19329", "F19330", "F34777", "F15318", "F30823" ];
                arrColsInfo     =   [       {width : 30}, {width : 10}, {width : 15}, {width : 15}, {width : 15}
                                        ,   {width : 15}, {width : 15}, {width : 30}, {width : 15}, {width : 15} ];
            }
            /* [iNAV]를 선택하는 경우 */
            else if( vm.stateInfo.pageState == "iNav" ) {
                sheetNm         =   "iNav 산출현황";
                arrHeaderNm     =   [        "종목", "단축코드", "산출방식", "iNAV", "iNAV 등락율"
                                        ,   "전일NAV", "기초지수", "지수", "지수 등락율", "환코드"
                                        ,   "환율 (매매기준율)", "환율 (장전 대비 매매기준율)" ];
                arrHeaderKey    =   [       "F16002", "F16013", "F33929_nm", "F15301", "F30818"
                                        ,   "F03329", "F34777", "F15318", "F30823", "F18450"
                                        ,   "F30819", "F18438" ];
                arrColsInfo     =   [       {width : 30}, {width : 10}, {width : 15}, {width : 15}, {width : 15}
                                        ,   {width : 15}, {width : 30}, {width : 15}, {width : 15}, {width : 15}
                                        ,   {width : 15}, {width : 20} ];
            }
            /* [Performance]를 선택하는 경우 */
            else if( vm.stateInfo.pageState == "performance" ) {
                sheetNm         =   "performance";
                arrHeaderNm     =   [       "종목", "단축코드", "수익율(증가) 1주", "수익율(증가) 1개월", "수익율(증가) 3개월"
                                        ,   "수익율(증가) YTD",   "수익율(NAV) 1주", "수익율(NAV) 1개월", "수익율(NAV) 3개월", "수익율(NAV) YTD" ];
                arrHeaderKey    =   [       "F16002", "F16013", "W00002", "W00003", "W00004"
                                        ,   "W00005", "W00012", "W00013", "W00014", "W00015" ];
                arrColsInfo     =   [       {width : 30}, {width : 10}, {width : 20}, {width : 20}, {width : 20}
                                        ,   {width : 20}, {width : 20}, {width : 20}, {width : 20}, {width : 20} ];
            }            
            /* [LP Spread]를 선택하는 경우 */
            else if( vm.stateInfo.pageState == "lpspread" ) {
                sheetNm         =   "LP spread";
                arrHeaderNm     =   [       "종목", "단축코드", "iNAV", "iNAV 등락율", "지수"
                                        ,   "지수 등락율", "LP매도호가", "LP매수호가", "LP스프레드" ];
                arrHeaderKey    =   [       "F16002", "F16013", "F15301", "F30818", "F15318"
                                        ,   "F30823", "F40544", "F40545", "F33294" ];
                arrColsInfo     =   [       {width : 30}, {width : 10}, {width : 15}, {width : 15}, {width : 15}
                                        ,   {width : 15}, {width : 20}, {width : 15}, {width : 15} ];
            }
            /* [customize]를 선택하는 경우 */
            else if( vm.stateInfo.pageState == "customize" ) {
                sheetNm         =   "customize";
                arrHeaderNm     =   [];
                arrHeaderKey    =   vm.arrCustomizeColumn.slice();
                arrColsInfo     =   [ {width : 30} ];

                vm.fn_arrInsertAtFind( arrHeaderKey, "F16002", "F16013" );      /* F16002=종목, F16013=단축코드 */
                vm.fn_arrInsertAtFind( arrHeaderKey, "F15301", "F30818" );      /* F15301=iNAV, F30818=iNAV 등락율 */
                vm.fn_arrInsertAtFind( arrHeaderKey, "F15318", "F30823" );      /* F15318=지수, F30823=지수 등락율 */

                for( var i in arrHeaderKey ) {
                    if( "F16013" === arrHeaderKey[i] ) {
                        arrHeaderNm.push( "단축코드" );
                        continue;
                    }
                    else if( "F30818" === arrHeaderKey[i] ) {
                        arrHeaderNm.push( "iNAV 등락율" );
                        continue;
                    }   
                    else if( "F30823" === arrHeaderKey[i] ) {
                        arrHeaderNm.push( "지수 등락율" );
                        continue;
                    }

                    var same = vm.arrShowColumn.filter(function(o, p) {
                        return arrHeaderKey[i] === o.name;
                    });

                    if( same && same.length == 1 ) {
                        arrHeaderNm.push( same[0].title );                       
                    }
                }

            }


            /* key에 존재하는 데이터를 기준으로 원본 데이터 추출 */
            for( var i in tableList ) {
                var dataRow = tableList[i];
                
                var tempObj = {};
                var existCheck = _.filter( arrHeaderKey, function(o) {

                    if ( typeof dataRow[o] != "undefined" ) {

                        /* 전일NAV="F03329", LP매도호가="F40544", LP매수호가="F40545", 종가1주수익률="W00002", 종가1달수익률="W00003" */
                        /* 종가3달수익률="W00004", 종가YTD수익률="W00005", NAV1주수익률="W00012", NAV1달수익률="W00013", NAV3달수익률="W00014" */
                        /* NAVYTD수익률="W00015", 과표기준가="F15007", ETF 현재가="F15001", ETF 전일가="F18001", 괴리율="F19330" */
                        /* iNAV="F15301", 장중지표가치(iNAV/iIV)등락율="F30818", 지수="F15318", ETF관련지수등락율="F30823", LP스프레드="F33294" */
                        /* 환율 (매매기준율)="F30819" */
                        if( [       "F03329", "F40544", "F40545", "W00002", "W00003"
                                ,   "W00004", "W00005", "W00012", "W00013", "W00014"
                                ,   "W00015", "F15007", "F15001", "F18001", "F19330"
                                ,   "F15301", "F30818", "F15318", "F30823", "F33294"
                                ,   "F30819" ].includes( o ) ) {
                            tempObj[o]  =   Number( util.NumtoStr( util.formatNumber( dataRow[o] ) ) );
                        }
                        /* 환율="F18438" 인 경우 */
                        else if( "F18438" == o ) {
                            var v_F30819    =   util.formatNumber( dataRow.F30819 );        /* 매매기준율 */
                            var v_F30824    =   util.formatNumber( dataRow.F30824 );        /* 장전기준율 */

                            var rateData    =   util.formatNumber( ( ( util.NumtoStr( v_F30819 ) / util.NumtoStr( v_F30824 ) ) - 1 ) * 100 );    /* ( 장전기준율 / 매매기준율 - 1 ) * 100 */

                            tempObj[o]      =   rateData;
                        }
                        else{
                            tempObj[o]  =   dataRow[o];
                        }
                    }
                });

                if( Object.keys(tempObj).length > 0 ) {
                    execelDataList[i]   =   tempObj;
                }
            }

            var excelInfo = {
                    excelFileNm     :   "ETP 운용정보"
                ,   sheetNm         :   sheetNm
                ,   dataInfo        :   execelDataList

                ,   arrHeaderNm     :   arrHeaderNm
                ,   arrHeaderKey    :   arrHeaderKey

                ,   arrColsInfo     :   arrColsInfo
            };

            util.fn_downExcel( excelInfo );
        },

        fn_arrInsertAtFind( arr, findStr, nextAddStr ) {
            for( var i=arr.length-1; i >=0; i-- ) {
                if( arr[i] === findStr ) {
                    arr.splice( i+1, 0, nextAddStr );
                }
            }
        },
        openEtpLpModal: function(data) {
          this.etpBasic = data;
          this.EtpLpModalFlag = true;
        },
        closeEtpLpModal: function() {
          this.EtpLpModalFlag = false;
        },
    }
};
</script>

