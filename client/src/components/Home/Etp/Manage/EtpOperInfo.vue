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
                                <span class="sub_txt">기준일 : {{ nowDate }}</span>
                            </h3>
                            <div class="right_btn">
                                <span class="toggle2">
                                    <v-btn-toggle v-model="text" class="toggle_01">
                                        <v-btn flat value="전종목"      @click="fn_getEtpOperInfo('A')">전종목</v-btn>
                                        <v-btn flat value="국내"        @click="fn_getEtpOperInfo('K')">국내</v-btn>
                                        <v-btn flat value="해외"        @click="fn_getEtpOperInfo('F')">해외</v-btn>
                                        <v-btn flat value="관심종목"    @click="fn_getEtpOperInfo('I')">관심종목</v-btn>
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
                            --->
                            
                        </div>                        
                    </v-card>
                </v-card>
            </v-flex>  
            <v-flex class="conWidth_right">
                 <!-- [ETP 운영정보] Quick 메뉴 정보 -->
                    <EtpOperInfoQuick   :indexBasic = "indexBasic"

                                        @fn_setInavData = "fn_setInavData"
                                        @fn_setEtpPerformanceData = "fn_setEtpPerformanceData"
                                        @fn_setCustomizeData = "fn_setCustomizeData"

                                        @showDetail="showDetail" 
                                        @showMessageBox="showMessageBox"
                                        @fn_showDetailIndex="fn_showDetailIndex">
                    </EtpOperInfoQuick>
            </v-flex>       
        </v-layout>
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
import EtpOperInfoInavIndex     from    "@/components/Home/Etp/Manage/EtpOperInfoInavIndex.vue";

var table01 = null;
var table02 = null;

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
            EtpOperInfoQuick        :   EtpOperInfoQuick
        ,   EtpOperInfoInavIndex    :   EtpOperInfoInavIndex
    },
    data() {
        return {
            text: "전종목",
            nowDate:        new Date().getFullYear() 
                        +   "." 
                        +   (parseInt(new Date().getMonth()) + 1) 
                        +   "." 
                        +   new Date().getDate(),

            stateInfo :     {       
                                    pageState : 'etpInfo'   /* etpInfo - ETP운용정보, iNav - iNav 산출현황, performance - ETP Performance, customize - 컬럼 선택 */
                                ,   gubun : 'A' 
                                ,   totWidth : 0
                            },
            arrShowColumn   :   [],
            arrShowColumnDef   :   [],
            etpOperInfoQuickYn : true,

            result_cnt  :   0,
            indexBasic  :   {},
            paramData   :   {},
            etpRow      :   {},
            inavGubun   :   "",
            showInavPdfYn : false,
            showInavIndexYn : false,
        };
    },
    mounted: function() {
        var vm = this;

        console.log( "######### EtpOperInfo.vue mounted ");


        new Promise(function(resolve, reject) {

        /* [ETP Performance] 테이블 정보 */
            vm.fn_setArrShowColumn( [
                    'f16002'                        /* 종목 */

                ,   'w00002'                         /* 종가1주수익률 */
                ,   'w00003'                        /* 종가1달수익률 */
                ,   'w00004'                        /* 종가3달수익률 */
                ,   'w00005'                        /* 종가YTD수익률 */

                ,   'w00012'                         /* NAV1주수익률 */
                ,   'w00013'                        /* NAV1달수익률 */
                ,   'w00014'                        /* NAV3달수익률 */
                ,   'w00015'                        /* NAVYTD수익률 */                

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
                "scrollY": '73vh',
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
                console.log( "data.f16012=[" + data.f16012 + "] /* 국제표준코드  */" );
                console.log( "data.f16257=[" + data.f16257 + "] /* ETP기초지수코드  */" );
                console.log( "data.f34239=[" + data.f34239 + "] /* ETP기초지수MID  */" );

                vm.paramData.f16012         =   data.f16012;        /* 국제표준코드  */
                vm.paramData.f16257         =   data.f16257;        /* ETP기초지수코드  */
                vm.paramData.f34239         =   data.f34239;        /* ETP기초지수MID  */
                vm.paramData.rowIndex       =   rowInx;

                switch( btnId ) {

                    case    'btnInav'       :

                                var gubun   =   "7";

                                /* 0-PDF, 1-지수 수익율 */
                                if( data.f33929 == "0" ) {
                                    gubun   =   "7";
                                }else if( data.f33929 == "1" ) {
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

            vm.fn_setTableInfo();
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
                    f34241 : vm.stateInfo.gubun
                }
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var dataList = response.data.dataList;
                    
                    if( dataList && dataList.length > 0 ) {

                        if( vm.stateInfo.pageState == "performance" ) {
                            table02.rows.add( dataList ).draw();
                        }else{
                            table01.rows.add( dataList ).draw();
                        }

                        vm.indexBasic   =   dataList[0];
                        vm.result_cnt   =   dataList.length;
                    }
                }

                vm.$emit( "fn_showProgress", false );
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
                        'f16002'                        /* 종목 */
                    ,   'f15301'                        /* iNAV */
                    ,   'f03329'                        /* 전일최종NAV */
                    ,   'f15302'                        /* 추적오차율 */
                    ,   'f15304'                        /* 괴리율 */

                    ,   'index_nm'                      /* 기초지수 */
                    ,   'index_f15001'                  /* 지수현재가 */
                    ,   'graph'                         /* 그래프 영역 */
                ] );

            }
            /* [iNAV 산출현황] 을 선택한 경우 */
            else if( vm.stateInfo.pageState == "iNav" ) {

                vm.fn_setArrShowColumn( [ 
                        'f16002'                        /* 종목 */
                    ,   'f33929_nm'                     /* 산출방식 */
                    ,   'f15301'                        /* iNAV */
                    ,   'f03329'                        /* 전일최종NAV */

                    ,   'index_nm'                      /* 기초지수 */
                    ,   'index_f15001'                  /* 지수현재가 */
                    ,   'f18450'                        /* 환코드 */
                    ,   'f18438'                        /* 환율 */
                    ,   'graph'                         /* 그래프 영역 */
                ] );
            }
            /* customize 를 선택한 경우 */
            else if( vm.stateInfo.pageState == "customize" ) {
                
                vm.fn_setArrShowColumn( arrCustomizeColumn );                
            }




            if( vm.stateInfo.pageState != "performance" ) {

                var tableObj    =    {
                    "processing": true,
                    "serverSide": false,
                    "info": false,   // control table information display field
                    "stateSave": true,  //restore table state on page reload,
                    "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                    "scrollY": '75vh',
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
            $('#table01 tbody').on('click', 'button[id=btnInav],button[id=btnEtpInfo],button[id=btnPdf]', function () {

                var table = $('#table01').DataTable();
                var data = table.row($(this).parents('tr')).data();
                var rowInx = table.row($(this)).index();
                var btnId   =   $(this).attr('id');

                console.log("########## EtpOperInfo.vue -> pageMove START ############");
                console.log( "data.f16012=[" + data.f16012 + "] /* 국제표준코드  */" );
                console.log( "data.f16257=[" + data.f16257 + "] /* ETP기초지수코드  */" );
                console.log( "data.f34239=[" + data.f34239 + "] /* ETP기초지수MID  */" );

                vm.paramData.f16012         =   data.f16012;        /* 국제표준코드  */
                vm.paramData.f16257         =   data.f16257;        /* ETP기초지수코드  */
                vm.paramData.f34239         =   data.f34239;        /* ETP기초지수MID  */
                vm.paramData.rowIndex       =   rowInx;

                switch( btnId ) {

                    case    'btnInav'       :

                                var gubun   =   "7";

                                /* 0-PDF, 1-지수 수익율 */
                                if( data.f33929 == "0" ) {
                                    gubun   =   "7";
                                }else if( data.f33929 == "1" ) {
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

            console.log("########## EtpOperInfo.vue -> fn_setEtpPerformanceData END ############");
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

            if( paramData && paramData.length > 0 ) {
                vm.fn_setTableInfo( paramData );
                vm.fn_getEtpOperInfo( vm.stateInfo.gubun );
            }

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
                { 'name' : 'f16002'             , 'data': 'f16002'           ,  'width' : '150', 'orderable' : true  , 'className': 'txt_left',  'title' : '종목'           },      /* 한글종목명 */
                { 'name' : 'f33929_nm'          , 'data': 'f33929_nm'        ,  'width' : '70',  'orderable' : true  , 'className': 'txt_left',  'title' : '산출방식'   },      /* 지표산출방식 */
                { 'name' : 'f15301'             , 'data': 'f15301'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : 'iNAV'          },      /* ETP지표가치(NAV/IV) */
                { 'name' : 'f03329'             , 'data': 'f03329'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : '전일NAV'},      /* 전일ETP지표가치(예탁원)(NAV/IV) */
                { 'name' : 'f15302'             , 'data': 'f15302'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : 'TE' },      /* 추적오차율 */
                                                                                                                                                    
                { 'name' : 'f15304'             , 'data': 'f15304'           ,  'width' : '50',  'orderable' : true  , 'className': 'txt_right', 'title' : '괴리율'        },      /* ETP괴리율 */
                { 'name' : 'index_nm'           , 'data': 'index_nm'         ,  'width' : '120', 'orderable' : true  , 'className': 'txt_left' , 'title' : '기초지수'      },      /* 기초지수명 */
                { 'name' : 'index_f15001'       , 'data': 'index_f15001'     ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '지수' },      /* 지수 현재가 */
                { 'name' : 'f18450'             , 'data': 'f18450'           ,  'width' : '40',  'orderable' : true  , 'className': 'txt_right', 'title' : '환코드'         },      /* 해외ETF원주자산기준통화코드 */
                { 'name' : 'f18438'             , 'data': 'f18438'           ,  'width' : '70',  'orderable' : true  , 'className': 'txt_right', 'title' : '환율'          },      /* 적용환율 */
                { 'name' : 'f18001'             , 'data': 'f18001'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'ETF 전일가'    },      /* 전일ETF순자산총액(원)  */

                { 'name' : 'w00002'             , 'data': 'w00002'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '1주'        },      /* 종가1주수익률  */
                { 'name' : 'w00003'             , 'data': 'w00003'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '1개월'      },     /* 종가1달수익률  */
                { 'name' : 'w00004'             , 'data': 'w00004'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '3개월'      },      /* 종가3달수익률  */
                { 'name' : 'w00005'             , 'data': 'w00005'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : 'YTD'        },      /* 종가YTD수익률  */

                { 'name' : 'w00012'             , 'data': 'w00012'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '1주'        },      /* NAV1주수익률  */
                { 'name' : 'w00013'             , 'data': 'w00013'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '1개월'      },     /* NAV1달수익률  */
                { 'name' : 'w00014'             , 'data': 'w00014'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '3개월'      },      /* NAV3달수익률  */
                { 'name' : 'w00015'             , 'data': 'w00015'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : 'YTD'        },      /* NAVYTD수익률  */
                                                                                                                                                    
                { 'name' : 'f30812'             , 'data': 'f30812'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'AUM'           },      /* 유동시가총액  */
                { 'name' : 'prev_f15001'        , 'data': 'prev_f15001'      ,  'width' : '90',  'orderable' : true  , 'className': 'txt_right', 'title' : '지수전일가'},     /* 기초지수 전일가  */
                { 'name' : 'f15007'             , 'data': 'f15007'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '과표기준가'    },      /* 기준가  */
                { 'name' : 'f15001'             , 'data': 'f15001'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'ETF 현재가'    },      /* 현재가  */
                { 'name' : 'f16073'             , 'data': 'f16073'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '과세구분'      },      /* 락구분코드  */

                { 'name' : 'graph'              , 'data': null               ,  'width' : '120', 'orderable' : false  },
            ];        

            var arrColumnDef  =   [
                    /* 종목 */
                    {       'name' : 'f16002'   
                        ,   "render": function ( data, type, row ) {

                                let htm = "<span>";
                                htm += "           <b>"+data+"</b>";
                                htm += "            <br><span class='text_s'>"+row.f16013+"</span>";        /* ETF단축코드 */
                                if (row.NEW_YN == "Y") {
                                    htm += "<span><div class='text_new'>new</div></span>";
                                }
                                return htm;
                            }
                    },

                    /* iNAV */
                    {       'name' : 'f15301'   
                        ,   "render": function ( data, type, row ) {
                                let htm = "";
            
                                htm += util.formatNumber(data);

                                if (row.f30818 >= 0) {
                                    htm += "<br><span class='text_S text_red'>"+row.f30818+"%</span>";      /* 장중지표가치(iNAV/iIV)등락율 */
                                } else {
                                    htm += "<br><span class='text_S text_blue'>"+row.f30818+"%</span>";     /* 장중지표가치(iNAV/iIV)등락율 */
                                }

                                return htm;
                            },
                    },

                    /* 전일NAV */
                    {       'name' : 'f03329'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""
            
                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* 지수 */
                    {       'name' : 'index_f15001'   
                        ,   "render": function ( data, type, row ) {
                                let htm = "";
            
                                htm += util.formatNumber(data);

                                if (row.f30823 >= 0) {
                                    htm += "<br><span class='text_S text_red'>"+row.f30823+"%</span>";      /* ETF관련지수등락율 */
                                } else {
                                    htm += "<br><span class='text_S text_blue'>"+row.f30823+"%</span>";     /* ETF관련지수등락율 */
                                }

                                return htm;
                            },
                    },

                    /* 환율 */
                    {       'name' : 'f18438'   
                        ,   "render": function ( data, type, row ) {

                                row.f30819      =   util.formatNumber( row.f30819 );        /* 매매기준율 */
                                row.f30824      =   util.formatNumber( row.f30824 );        /* 장전기준율 */

                                var rateData    =   util.formatNumber( ( util.NumtoStr(row.f30819) / util.NumtoStr(row.f30824) - 1 ) * 100 );    /* ( 장전기준율 / 매매기준율 - 1 ) * 100 */

                                let htm = ""

                                htm += util.formatNumber( row.f30819 );                     /* 매매기준율 */
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
                    {       'name' : 'w00002'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* 종가1달수익률 */
                    {       'name' : 'w00003'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* 종가3달수익률 */
                    {       'name' : 'w00004'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },


                    /* 종가YTD수익률 */
                    {       'name' : 'w00005'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* NAV1주수익률 */
                    {       'name' : 'w00012'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* NAV1달수익률 */
                    {       'name' : 'w00013'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },

                    /* NAV3달수익률 */
                    {       'name' : 'w00014'   
                        ,   "render": function ( data, type, row ) {
                                let htm = ""

                                htm += util.formatNumber(data);

                                return htm;
                            },
                    },


                    /* NAVYTD수익률 */
                    {       'name' : 'w00015'   
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
                                        ||  krxCd == row.f33960                         /* 로그인 운용사 코드와 해당 row의 ETP운용사코드 가 같은 경우 */
                                    ) {
                                        graphContent    +=  '<div class="tooltip"><button type="button" id="btnInav" name="btnInav" class="calcu_icon"></button><span class="tooltiptext" style="width:70px;">투자지표</span></div>';
                                    }
//                                    graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnInav", "btnContent" : "visibility", "btnSpanContent" : "투자지표" } );
                                }
                                
                                /* ETF 상세정보 */
                                graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnEtpInfo", "btnContent" : "equalizer", "btnSpanContent" : "ETP정보" } );

                                /* ETF 인 경우에만 PDF 아이콘 노출 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                                if( row.f16493 == "1" || row.f16493 == "2" ) {

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
                {       'name' : 'f15301'             
                    ,   "render": function ( data, type, row ) {
                            if (data) {
                                return "<img src='/assets/img/icon_bar01.png'><span>&nbsp;&nbsp;&nbsp;" + data + "</span>";
                            } else {
                                return "";
                            }
                        }            
                },
                {       'name' : 'f03329'             
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
    }
};
</script>

