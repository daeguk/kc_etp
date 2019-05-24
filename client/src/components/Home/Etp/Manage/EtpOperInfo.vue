<template>
    <v-container>
        <v-layout row wrap class="con_wrap">
            <v-flex grow class="conWidth_left">

                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            ETP 운용 정보
                            <p>
                                Total
                                <span class="text_result">{{ result_cnt }}</span> results
                                <span class="toggle2">
                                    <v-btn-toggle v-model="text" class="toggle_01">
                                        <v-btn flat value="전종목"      @click="fn_getEtpOperInfo('A')">전종목</v-btn>
                                        <v-btn flat value="국내"        @click="fn_getEtpOperInfo('K')">국내</v-btn>
                                        <v-btn flat value="해외"        @click="fn_getEtpOperInfo('F')">해외</v-btn>
                                        <v-btn flat value="관심종목"    @click="fn_getEtpOperInfo('I')">관심종목</v-btn>
                                    </v-btn-toggle>
                                </span>
                            </p>
                            <!--오른쪽 메뉴 종목으로 찾기 검색 후 
                            <p class="text_result">
                                6 results
                            </p--->
                            <p class="sub_txt">기준일 : {{ nowDate }}</p>
                        </h3>
                    </v-card-title>


                    <v-card flat>
                        <table id="table01" class="tbl_type"    style="width:100%"/>
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

                <!-- [ETP 운영정보] -> Quick Menu iNAV 산출현황 선택 -> 그리드에서 Pdf 선택시 -->
                <v-dialog   v-model="showInavPdfYn"     persistent  max-width="500" >
                    <EtpOperInfoInavPdf     v-if="inavGubun == 'pdf'"

                                            :paramData = "etpRow"
                                            @fn_close = "fn_close">
                    </EtpOperInfoInavPdf>
                </v-dialog>

                <!-- [ETP 운영정보] -> Quick Menu iNAV 산출현황 선택 -> 그리드에서 Index 선택시 -->
                <v-dialog  v-model="showInavIndexYn"  persistent  max-width="600" >
                    <EtpOperInfoInavIndex   v-if="inavGubun == 'index'"

                                            :paramData = "etpRow"
                                            @fn_close = "fn_close">
                    </EtpOperInfoInavIndex>
                </v-dialog>   

            </v-flex>       
        </v-layout>
    </v-container>
</template>


<script>
import $      from 'jquery';
import dt      from 'datatables.net';
import buttons from 'datatables.net-buttons';
import util       from "@/js/util.js";

import Config from '@/js/config.js';
import EtpOperInfoQuick         from    "@/components/Home/Etp/Manage/EtpOperInfoQuick.vue";
import EtpOperInfoInavPdf       from    "@/components/Home/Etp/Manage/EtpOperInfoInavPdf.vue";
import EtpOperInfoInavIndex     from    "@/components/Home/Etp/Manage/EtpOperInfoInavIndex.vue";

var table01 = null;

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
            EtpOperInfoQuick        :   EtpOperInfoQuick
        ,   EtpOperInfoInavPdf      :   EtpOperInfoInavPdf
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
            showInavIndexYn : false
        };
    },
    mounted: function() {
        var vm = this;

        console.log( "######### EtpOperInfo.vue mounted ");
        vm.$nextTick().then(() => {
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

            if( table01 ) {
                table01.clear().draw();
            }

            axios.post(Config.base_url + "/user/etp/getEtpOperInfo", {
                data: {
                        f34241 : vm.stateInfo.gubun
                }
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var dataList = response.data.dataList;
                    
                    if( dataList && dataList.length > 0 ) {
                        table01.rows.add( dataList ).draw();
                        table01.draw();

                        vm.indexBasic   =   dataList[0];
                        vm.result_cnt   =   dataList.length;
                    }
                }
            });
        },

        /*
         *  테이블 기본정보를 설정한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setTableInfo( arrCustomizeColumn ) {

            var vm = this;

            var tableObj    =    {
                "processing": true,
                "serverSide": false,
                "info": false,   // control table information display field
                "stateSave": true,  //restore table state on page reload,
                "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                paging: false,
                searching: false,
                data : [],
                autoWidth: false,
            };


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
                    ,   'f33929_nm'                     /* 산출방식  <---- ADDED */
                    ,   'f15301'                        /* iNAV */
                    ,   'f03329'                        /* 전일최종NAV */
                    ,   'f15302'                        /* 추적오차율 */
                    ,   'f15304'                        /* 괴리율 */

                    ,   'index_nm'                      /* 기초지수 */
                    ,   'index_f15001'                  /* 지수현재가 */
                    ,   'f18438'                        /* 환율  <---- ADDED */
                    ,   'graph'                         /* 그래프 영역 */
                ] );
            }
            /* [ETP Performance] 를 선택한 경우 */
            else if( vm.stateInfo.pageState == "performance" ) {

                vm.fn_setArrShowColumn( [ 
                        'f16002'                        /* 종목 */
                    ,   'f15301'                        /* iNAV */
                    ,   'f03329'                        /* 전일최종NAV */
                    ,   'f15302'                        /* 추적오차율 */
                    ,   'f15304'                        /* 괴리율 */

                    ,   'week1'                         /* 1주 */
                    ,   'month1'                        /* 1개월 */
                    ,   'month3'                        /* 3개월 */
                    ,   'month6'                        /* 6개월 */
                    ,   'year1'                         /* 연환산 */
                    ,   'graph'                         /* 그래프 영역 */
                ] );
            }
            /* customize 를 선택한 경우 */
            else if( vm.stateInfo.pageState == "customize" ) {
                
                vm.fn_setArrShowColumn( arrCustomizeColumn );                
            }



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

                /* 산출방식 컬럼값이 없어 레코드 행이 짝수이면 pdf, 홀수이면 index 로 임시 처리함. TODO: 추후 변경 필요. */
                var gubun = "";
                if( rowInx %2 ==0 ) {
                    gubun = "btnInavPdfPop";
                }else{
                    gubun = "btnInavIndexPop";
                }

                switch( btnId ) {

                    case    'btnInav'       :

                                if( gubun == "btnInavPdfPop" ) {
                                    vm.inavGubun    =   "pdf";
                                    vm.showInavPdfYn   =   true;
                                }else if( gubun == "btnInavIndexPop" ) {
                                    vm.inavGubun    =   "index";
                                    vm.showInavIndexYn =   true;
                                }

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
            graphContent    +=      '<span class="' + btnSpanClass + '" style="' + btnSpanStyle + '" >' + btnSpanContent + '</span>';
            graphContent    +=  '</div>';            

            return  graphContent;
        },


        /*
         *  노출할 컬럼 배열정보를 통해 테이블에 컬럼을 설정한다.
         *  2019-05-03  bkLove(촤병국)
         */
        fn_setArrShowColumn( arrTemp ) {
            var vm = this;

            var arrColumn  =   [
                { 'name' : 'f16002'             , 'data': 'f16002'           ,  'width' : '220', 'orderable' : true  , 'className': 'txt_left',  'title' : '종목'           },      /* 한글종목명 */
                { 'name' : 'f33929_nm'          , 'data': 'f33929_nm'        ,  'width' : '100', 'orderable' : true  , 'className': 'txt_left',  'title' : '지표산출방식'   },      /* 지표산출방식 */
                { 'name' : 'f15301'             , 'data': 'f15301'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : 'iNAV'          },      /* ETP지표가치(NAV/IV) */
                { 'name' : 'f03329'             , 'data': 'f03329'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '전일NAV'},      /* 전일ETP지표가치(예탁원)(NAV/IV) */
                { 'name' : 'f15302'             , 'data': 'f15302'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : 'TE' },      /* 추적오차율 */
                                                                                                                                                    
                { 'name' : 'f15304'             , 'data': 'f15304'           ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right', 'title' : '괴리율'        },      /* ETP괴리율 */
                { 'name' : 'index_nm'           , 'data': 'index_nm'         ,  'width' : '200', 'orderable' : true  , 'className': 'txt_left' , 'title' : '기초지수'      },      /* 기초지수명 */
                { 'name' : 'index_f15001'       , 'data': 'index_f15001'     ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '지수' },      /* 지수 현재가 */
                { 'name' : 'f18438'             , 'data': 'f18438'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '환율'          },      /* 적용환율 */
                { 'name' : 'f18001'             , 'data': 'f18001'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'ETF 전일가'    },      /* 전일ETF순자산총액(원)  */

                { 'name' : 'week1'              , 'data': 'week1'            ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '<br>1주'        },      /* 1주  */
                { 'name' : 'month1'             , 'data': 'month1'           ,  'width' : '90',  'orderable' : true  , 'className': 'txt_right', 'title' : '수익률<br>1개월'      },     /* 1개월  */
                { 'name' : 'month3'             , 'data': 'month3'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '<br>3개월' },      /* 3개월  */
                { 'name' : 'ytd'                , 'data': 'ytd'              ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '<br>연환산'     },      /* ytd  */
                                                                                                                                                    
                { 'name' : 'f30812'             , 'data': 'f30812'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'AUM'           },      /* 유동시가총액  */
                { 'name' : 'prev_f15001'        , 'data': 'prev_f15001'      ,  'width' : '90',  'orderable' : true  , 'className': 'txt_right', 'title' : '지수<br>전일가'},     /* 기초지수 전일가  */
                { 'name' : 'f15007'             , 'data': 'f15007'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '과표기준가'    },      /* 기준가  */
                { 'name' : 'f15001'             , 'data': 'f15001'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : 'ETF 현재가'    },      /* 현재가  */
                { 'name' : 'f16073'             , 'data': 'f16073'           ,  'width' : '80',  'orderable' : true  , 'className': 'txt_right', 'title' : '과세구분'      },      /* 락구분코드  */

                { 'name' : 'graph'              , 'data': null               ,  'width' : '150', 'orderable' : false  },
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
                                let htm = ""
            
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
                                let htm = ""
            
                                htm += util.formatNumber(data);

                                if (row.f30818 >= 0) {
                                    htm += "<br><span class='text_S text_red'>"+row.f30818+"%</span>";      /* 장중지표가치(iNAV/iIV)등락율 */
                                } else {
                                    htm += "<br><span class='text_S text_blue'>"+row.f30818+"%</span>";     /* 장중지표가치(iNAV/iIV)등락율 */
                                }

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
                                    graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnInav", "btnContent" : "visibility", "btnSpanContent" : "투자지표" } );
                                }
                                
                                /* ETF 상세정보 */
                                graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnEtpInfo", "btnContent" : "equalizer", "btnSpanContent" : "ETP정보" } );

                                /* ETF 인 경우에만 PDF 아이콘 노출 - ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN) */
                                if( row.f16493 == "1" || row.f16493 == "2" ) {

                                    /* PDF 정보 */
                                    graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnPdf", "btnContent" : "picture_as_pdf", "btnSpanContent" : "PDF관리" } );
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

