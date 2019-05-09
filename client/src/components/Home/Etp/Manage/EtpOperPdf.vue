<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            <v-text-field
                                v-model="search"
                                label="TIGER 코스닥 150 레버러지 (229200)"
                                class="pdf_search"
                                append-icon="search"
                                single-line
                                hide-details
                            ></v-text-field>
                            <p class="pdf_calendar">
                                <v-menu
                                    ref="menu2"
                                    v-model="menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="date2"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="date2"
                                            label="Picker in menu"
                                            append-icon="event"
                                            box
                                            outline
                                            v-on="on"
                                            widh="100%"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date2" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat @click="menu = false">Cancel</v-btn>
                                        <v-btn
                                            flat
                                            color="primary"
                                            @click="$refs.menu2.save(date2)"
                                        >OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </p>
                        </h3>
                    </v-card-title>
                    <v-card flat>
                        <table id class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="10%">
                                <col width="10%">
                                <col width="15%">
                                <col width="15%">
                                <col width="10%">
                                <col width="15%">
                                <col width="15%">
                                <col width="10%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th class="txt_right">시장구분</th>
                                    <th class="txt_left">구성종목코드</th>
                                    <th class="txt_left">종목명</th>
                                    <th class="txt_right">CU Shrs</th>
                                    <th class="txt_right">액면금액</th>
                                    <th class="txt_right">평가금액</th>
                                    <th class="txt_right">비중</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>20181112</td>
                                    <td class="txt_right">2</td>
                                    <td class="txt_left">KRD010010001</td>
                                    <td class="txt_left">원화현금</td>
                                    <td class="txt_right">767855459</td>
                                    <td class="txt_right">0</td>
                                    <td class="txt_right">548521321300</td>
                                    <td class="txt_right">85.65</td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card>
                    


                    <!-- [PDF 관리] Quick 메뉴 정보 -->
                    <EtpOperPdfQuick    :paramData = "paramData"

                                        @showDetail="showDetail" 
                                        @showMessageBox="showMessageBox">
                    </EtpOperPdfQuick>                    
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'

import Config from '@/js/config.js';
import EtpOperPdfQuick     from    "@/components/Home/Etp/Manage/EtpOperPdfQuick.vue";

var table01 = null;

export default {
    components: {
        //indexDetailrtmenupop: indexDetailrtmenupop
    },
    data() {
        return {
            text: "전종목",
            checkbox: true,
            date2: new Date().toISOString().substr(0, 10),
            menu2: false,
            text2: "",
            dialog: false,
            dialog2: false,
            dialog5: false,
            dialog6: false,
            drawer: true,
            search: "",
            tab: null,
            tab2: null,
            items1: ["전체", "시장대표"],
            items: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            items2: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                },
                {
                    title: "KODEX 코스닥150 레버러지",
                    subtitle: "122630"
                }
            ],
            items3: [
                {
                    title: "KODEX 200",
                    subtitle: "069500"
                },
                {
                    title: "KODEX 삼성그룹",
                    subtitle: "102780"
                },
                {
                    title: "KODEX 레버러지",
                    subtitle: "122630"
                }
            ],
            mini: false,
            right: null,
            rowsPerPageItems: [10, 20, 30, 50],
            headers: [
                {
                    text: "Code",
                    align: "left",
                    value: "name"
                },
                { text: "name", value: "name" },
                { text: "BasePrc", value: "BasePrc", align: "right" },
                { text: "Shrs", value: "Shrs", align: "right" },
                { text: "Float rto", value: "FloatRto", align: "right" },
                { text: "Ceiling rto", value: "CeilingRto", align: "right" },
                { text: "Factor rto", value: "FactorRto", align: "right" }
            ],
            desserts: [],
            items4: [],
            switch1: "",

            paramData : {},
            stateInfo :     {       
                                    pageState : 'etpInfo'   /* etpInfo - ETP운용정보, iNav - iNav 산출현황, performance - ETP Performance, customize - 컬럼 선택 */
                                ,   gubun : 'A' 
                                ,   totWidth : 0
                            },
            arrShowColumn   :   [],
            arrShowColumnDef   :   [],            
        };
    },
    components: {
        EtpOperPdfQuick :   EtpOperPdfQuick
    },
    mounted: function() {

        var vm = this;

        vm.$nextTick().then(() => {
            vm.fn_setTableInfo();
            vm.fn_getEtpOperIndex( vm.stateInfo.gubun );        
        });        
    },
    created: function() {},
    beforeDestory: function() {},

    methods : {

        /*
         * ETP 지수관리 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */

        fn_getEtpOerPdf() {

            var vm = this;

            console.log("EtpOperPdf.vue -> fn_getEtpOperPdf");

            if( table01 ) {
                table01.clear().draw();
            }            

            axios.post(Config.base_url + "/user/etp/getEtpOperPdf", {
                data: {}
            })
            .then(function(response) {
                console.log(response);

                if (response.data) {
                    var dataList = response.data.dataList;
                    
                    if( dataList && dataList.length > 0 ) {
                        table01.rows.add( dataList ).draw();
                        table01.draw();
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
                    ,   'index_cal_method'              /* 산출방식  <---- ADDED */
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
                                vm.$emit('showDetail', 1, vm.paramData);
                                break;

                    case    'btnPdf'    :
                                vm.$emit('fn_pageMove', btnId, vm.paramData);
                                break;
                }
                
                console.log("########## EtpOperInfo.vue -> pageMove END ############");
            });                
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
                { 'name' : 'f16002'             , 'data': 'f16002'           ,  'width' : '220', 'orderable' : true  , 'className': 'dt-body-left',  'title' : '종목'           },      /* 한글종목명 */
                { 'name' : 'index_cal_method'   , 'data': 'index_cal_method' ,  'width' : '100', 'orderable' : true  , 'className': 'dt-body-left',  'title' : '지수<br>산출방식'   },      /* 지수산출방식 */
                { 'name' : 'f15301'             , 'data': 'f15301'           ,  'width' : '60',  'orderable' : true  , 'className': 'dt-body-right', 'title' : 'iNAV'          },      /* ETP지표가치(NAV/IV) */
                { 'name' : 'f03329'             , 'data': 'f03329'           ,  'width' : '60',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '전일최종<br>NAV'},      /* 전일ETP지표가치(예탁원)(NAV/IV) */
                { 'name' : 'f15302'             , 'data': 'f15302'           ,  'width' : '60',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '추적<br>오차율' },      /* 추적오차율 */
                                                                                                                                                    
                { 'name' : 'f15304'             , 'data': 'f15304'           ,  'width' : '60',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '괴리율'        },      /* ETP괴리율 */
                { 'name' : 'index_nm'           , 'data': 'index_nm'         ,  'width' : '200', 'orderable' : true  , 'className': 'dt-body-left' , 'title' : '기초지수'      },      /* 기초지수명 */
                { 'name' : 'index_f15001'       , 'data': 'index_f15001'     ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '지수<br>현재가' },      /* 지수 현재가 */
                { 'name' : 'f18438'             , 'data': 'f18438'           ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '환율'          },      /* 적용환율 */
                { 'name' : 'f18001'             , 'data': 'f18001'           ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : 'ETF 전일가'    },      /* 전일ETF순자산총액(원)  */

                { 'name' : 'week1'              , 'data': 'week1'            ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '1주'           },      /* 1주  */
                { 'name' : 'month1'             , 'data': 'month1'           ,  'width' : '90',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '1개월'          },     /* 1개월  */
                { 'name' : 'month3'             , 'data': 'month3'           ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '수익률<br>3개월' },      /* 3개월  */
                { 'name' : 'month6'             , 'data': 'month6'           ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '6개월'          },      /* 6개월  */
                { 'name' : 'year1'              , 'data': 'year1'            ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '연환산'         },      /* 연환산  */
                                                                                                                                                    
                { 'name' : 'f30812'             , 'data': 'f30812'           ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : 'AUM'           },      /* 유동시가총액  */
                { 'name' : 'prev_f15001'        , 'data': 'prev_f15001'      ,  'width' : '90',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '기초지수<br>전일가'},     /* 기초지수 전일가  */
                { 'name' : 'f15007'             , 'data': 'f15007'           ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '과표기준가'    },      /* 기준가  */
                { 'name' : 'f15001'             , 'data': 'f15001'           ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : 'ETF 현재가'    },      /* 현재가  */
                { 'name' : 'f16073'             , 'data': 'f16073'           ,  'width' : '80',  'orderable' : true  , 'className': 'dt-body-right', 'title' : '과세구분'      },      /* 락구분코드  */

                { 'name' : 'graph'              , 'data': null               ,  'width' : '150' },
            ];        

            var arrColumnDef  =   [

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

                                /* PDF 정보 */
                                graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnPdf", "btnContent" : "picture_as_pdf", "btnSpanContent" : "PDF관리" } );                                

                                return  graphContent;
                            }
                    },
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

        showDetail: function(gubun, paramData) {      
            var vm = this;

            vm.$emit( "showDetail", gubun, paramData );
        },

        showMessageBox: function(title, msg, option, gubun) {
            var vm = this;

            vm.$emit( "showMessageBox", title, msg, option, gubun );
        },        
    }
};
</script>

