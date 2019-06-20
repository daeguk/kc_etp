<template>
    <v-container>
        <v-layout row wrap class="con_wrap">
            <v-flex grow class="conWidth_left">
                <v-card flat>
                    <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                            지수관리
                            <span class="text_result">{{ result_cnt }}</span>
                            <span class="text_result_t"> results</span>
                            <span class="sub_txt">기준일 : {{ fmt_f12506 }}</span>
                        </h3>
                    </v-card-title>
                    
                    <v-card flat>
                        <table id="tableOperIndex" class="tbl_type ver7"></table>

                    </v-card>
             </v-card>
           </v-flex>
           <v-flex class="conWidth_right">
                <!-- [지수관리] Quick 메뉴 정보 -->
                    <EtpOperIndexQuick  :indexBasic = "indexBasic"

                                        @showDetail="showDetail" 
                                        @showMessageBox="showMessageBox"
                                        @fn_showDetailIndex="fn_showDetailIndex"
                                        @fn_setEtpOperIndexOversea="fn_setEtpOperIndexOversea">
                    </EtpOperIndexQuick>
           </v-flex>
        </v-layout>
    <IndexInfoModal v-if="IndexModalFlag" :indexInfo="paramData"
      @closeIndexModal="closeIndexModal"></IndexInfoModal>
    </v-container>
</template>


<script>
import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import util       from "@/js/util.js";
import dtFc from "datatables.net-fixedcolumns";

import Config from "@/js/config.js";
//import indexDetailrtmenupop from "./indexDetailrtmenupop.vue";
import EtpOperIndexQuick     from    "@/components/Home/Etp/Manage/EtpOperIndexQuick.vue";
import IndexInfoModal   from  '@/components/common/modal/IndexInfoModal.vue';

var tableOperIndex = null;

export default {

    data() {
        return {
            fmt_f12506 :   "",
            indexBasic  :   {},
            paramData   :   {},
            stateInfo   :   {
                                    pageState : 'index'     /* index - 지수관리 , oversea - 해외지수 종가 모니터링 */
                                ,   totWidth : 0
                            },
            arrShowColumn   :   [],
            arrShowColumnDef   :   [],
            nowDate:        new Date().getFullYear() 
                        +   "." 
                        +   (parseInt(new Date().getMonth()) + 1) 
                        +   "." 
                        +   new Date().getDate(),
            result_cnt  :   0,
            arrOverseaMarketList    :   [],
            IndexModalFlag: false,
        };
    },
    components: {
        EtpOperIndexQuick,
        IndexInfoModal,
    },
    mounted: function() {

        var vm = this;

        vm.$nextTick().then(() => {
            vm.fn_setTableInfo();
            vm.fn_getEtpOperIndex();
        });
    },
    created: function() {},
    beforeDestory: function() {},

    methods: {
        /*
         * ETP 지수관리 정보를 조회한다.
         * 2019-05-03  bkLove(촤병국)
         */

        fn_getEtpOperIndex() {
            var vm = this;

            console.log("EtpOperIndex.vue -> fn_getEtpOperIndex");

            var  url = Config.base_url + "/user/etp/getEtpOperIndex";

            vm.arrOverseaMarketList =   [];
            if( vm.stateInfo.pageState == "oversea" ) {
                url = Config.base_url + "/user/etp/getEtpOperIndexOversea";

                vm.arrOverseaMarketList =   [
                        { "jisu_mid" : "79" }
                    ,   { "jisu_mid" : "80" }
                    ,   { "jisu_mid" : "81" }
                    ,   { "jisu_mid" : "82" }
                    ,   { "jisu_mid" : "86" }
                    ,   { "jisu_mid" : "94" }
                ];

            }

            if( tableOperIndex ) {
                tableOperIndex.clear().draw();
            }

            vm.$emit( "fn_showProgress", true );
            axios.post( url, {
                data: {
                    arrOverseaMarketList    :   vm.arrOverseaMarketList
                }
            }).then(function(response) {
                console.log(response);

                vm.$emit( "fn_showProgress", false );
                vm.result_cnt = 0;
                if (response.data) {

                    var msg = ( response.data.msg ? response.data.msg : "" );
                    if (!response.data.result) {
                        if( msg ) {
                            vm.$emit("showMessageBox", '확인', msg,{},1);
                            return  false;
                        }
                    }

                    var dataList = response.data.dataList;

                    if( dataList && dataList.length > 0 ) {
                        tableOperIndex.rows.add( dataList ).draw();

                        vm.indexBasic   =   dataList[0];

                        vm.fmt_f12506   =   dataList[0].fmt_f12506;
                        vm.result_cnt   =   util.formatInt( dataList.length );
                    }
                }

            }).catch(error => {
                vm.$emit( "fn_showProgress", false );
                vm.$emit("showMessageBox", '확인','서버로 부터 응답을 받지 못하였습니다.',{},4);
            });
        },

        fn_setEtpOperIndexOversea : function( paramData ) {

            var vm = this;

            /* 해외지수 종가 모니터링 버튼이 체크된 경우에는 해외지수 종가 모니터링 정보를 노출한다. */
            if( paramData && paramData.toggleIndexOversea ) {
                vm.stateInfo.pageState  =  'oversea';               /* index - 지수관리 , oversea - 해외지수 종가 모니터링 */
            }
            /* 해외지수 종가 모니터링 버튼이 두번 눌러 체크해제된 경우 지수관리 기본 정보를 노출한다.  */
            else{
                vm.stateInfo.pageState  =  'index';
            }            
            
            vm.fn_setTableInfo();
            vm.fn_getEtpOperIndex();
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
                "scrollY": '730px',         
                paging: false,
                searching: false,
                data : [],
                autoWidth: false,
            };


            /* [지수관리] 를 선택한 경우 */
            if( vm.stateInfo.pageState == "index" ) {
                
                vm.fn_setArrShowColumn( [ 
                        'f16002'                        /* 지수 */
                    ,   'large_type'                    /* 산출기관 */
                    ,   'vendor'                        /* 벤더 */
                    ,   'manage_type'                   /* 관리유형 */
                    ,   'last_date'                     /* Last */
                    ,   'last_time'                     /* Time */
                    ,   'etp_info_json'                 /* ETF */
                    ,   'graph'                         /* 그래프 영역 */
                ] );

            }
            /* [iNAV 산출현황] 을 선택한 경우 */
            else if( vm.stateInfo.pageState == "oversea" ) {

                vm.fn_setArrShowColumn( [ 
                        'in_out'                        /* 입수 구분 */
                    ,   'f16002'                        /* 지수 */
                    ,   'f16013'                        /* 실시간 심볼 */
                    ,   'incre_symbol'                  /* 증가 심볼 */
                    ,   'rest_date'                     /* 휴장일 */
                    ,   'f15001'                        /* 최근종가 */

                    ,   'fmt_f12506'                    /* 최근일자 */
                    ,   'fmt_std_date'                  /* 기준일자 */
                ] );
            }



            if ( $.fn.DataTable.isDataTable('#tableOperIndex') ) {
                $('#tableOperIndex').DataTable().destroy();
                $('#tableOperIndex').empty();
            }        

            if( vm.stateInfo.totWidth > 900 ) {
                $('#tableOperIndex').attr( "style", "width: 1500px; table-layout: fixed;");
                tableObj.scrollX    =   true;
            }else{
                $('#tableOperIndex').attr( "style", "width: 100%; ");
                tableObj.scrollX    =   false;
            }

            tableObj.columns    =   vm.arrShowColumn ;
            tableObj.columnDefs =   vm.arrShowColumnDef ;

            tableOperIndex = $('#tableOperIndex').DataTable( tableObj );

            // 테이블별 이벤트
            $('#tableOperIndex tbody').on('click', 'button[id=btnIndex],button[id=btnIndexDetailList],button[id=btnIndexFix],button[id=btnIndexError] ', function () {

                var table   =   $('#tableOperIndex').DataTable();
                var data    =   table.row($(this).parents('tr')).data();
                var rowInx  =   table.row($(this)).index();
                var btnId   =   $(this).attr('id');


                console.log("########## EtpOperIndex.vue -> pageMove START ############");
                console.log( "data.f16013=["        +   data.f16013         +   "]  /* 단축코드  */" );
                console.log( "data.large_type=["    +   data.large_type     +   "]  /* 지수대분류(FNGUIDE, KRX, KIS, KAP)  */" );
                console.log( "data.market_id=["     +   data.market_id      +   "]  /* 시장 ID  */" );


                vm.paramData.F16257         =   data.f16013;        /* 단축코드  */
                vm.paramData.LARGE_TYPE     =   data.large_type;    /* 지수대분류(FNGUIDE, KRX, KIS, KAP)  */
                vm.paramData.MARKET_ID      =   data.market_id;     /* 시장 ID  */

                vm.paramData.F16013         =   data.f16013;        /* 단축코드  */
                vm.paramData.f16013         =   data.f16013;        /* 단축코드  */
                vm.paramData.market_id      =   data.market_id;     /* 시장 ID  */

                vm.paramData.rowIndex       =   rowInx;


                switch( btnId ) {

                            /* 지수정보 */
                    case    'btnIndex'       :
                                // vm.$emit('showDetail', 2, vm.paramData);
                                vm.openIndexModal();
                                break;

                            /* 지수구성정보 */
                    case    'btnIndexDetailList'    :
                                vm.$emit('fn_showDetailIndex', 3, vm.paramData);
                                break;

                            /* 지수조치내역 */
                    case    'btnIndexFix'    :
                                vm.$emit('fn_showDetailIndex', 4, vm.paramData);
                                break;

                            /* 지수오류내역 */
                    case    'btnIndexError'    :
                                vm.$emit('fn_showDetailIndex', 5, vm.paramData);
                                break;

                    case    'btnPdf'    :
                                vm.$emit('fn_pageMove', btnId, vm.paramData);
                                break;
                }                
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
            var btnSpanStyle = "width:75px;";

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
                { 'name' : 'f16002'             , 'data': 'f16002'          ,  'width' : '200', 'orderable' : true  , 'className': 'txt_left'   , 'title' : '지수'          },      /* 한글종목명 */
                { 'name' : 'large_type'         , 'data': 'large_type'      ,  'width' : '60',  'orderable' : true  , 'className': 'txt_left'   , 'title' : '산출기관'      },      /* 지수대분류(FNGUIDE, KRX, KIS, KAP) */
                { 'name' : 'vendor'             , 'data': 'vendor'          ,  'width' : '40',  'orderable' : true  , 'className': 'txt_left'   , 'title' : '벤더'          },      /* 벤더 */
                { 'name' : 'manage_type'        , 'data': 'manage_type'     ,  'width' : '60',  'orderable' : true  , 'className': ''           , 'title' : '관리유형'      },      /* 관리유형 */
                { 'name' : 'last_date'          , 'data': 'last_date'       ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right'  , 'title' : 'Last'          },      /* Last */
                { 'name' : 'last_time'          , 'data': 'last_time'       ,  'width' : '60',  'orderable' : true  , 'className': 'txt_right'  , 'title' : 'Time'          },      /* Time */
                { 'name' : 'etp_info_json'      , 'data': 'etp_info_json'   ,  'width' : '250', 'orderable' : true  , 'className': 'txt_left'   , 'title' : 'ETF'           },       /* ETF */
                { 'name' : 'graph'              , 'data': null              ,  'width' : '150', 'orderable' : false },

                { 'name' : 'in_out'             , 'data': 'in_out'          ,  'width' : '60' , 'orderable' : true  , 'className': 'txt_left'   , 'title' : '입수 구분'     },      /* 입수 구분 */
                { 'name' : 'f16013'             , 'data': 'f16013'          ,  'width' : '80' , 'orderable' : true  , 'className': 'txt_left'   , 'title' : '실시간 심볼'   },      /* 단축코드 */
                { 'name' : 'incre_symbol'       , 'data': 'incre_symbol'    ,  'width' : '80' , 'orderable' : true  , 'className': 'txt_left'   , 'title' : '증가 심볼'     },      /* 증가 심볼 */
                { 'name' : 'rest_date'          , 'data': 'rest_date'       ,  'width' : '80' , 'orderable' : true  , 'className': 'txt_right'  , 'title' : '휴장일'        },       /* 휴장일 */
                { 'name' : 'fmt_f12506'         , 'data': 'fmt_f12506'      ,  'width' : '80' , 'orderable' : true  , 'className': 'txt_right'  , 'title' : '최근일자'      },       /* 입회일 */
                { 'name' : 'f15001'             , 'data': 'f15001'          ,  'width' : '100', 'orderable' : true  , 'className': 'txt_right'  , 'title' : '최근종가'      },     /* 현재가 */
                { 'name' : 'fmt_std_date'       , 'data': 'fmt_std_date'    ,  'width' : '100', 'orderable' : true  , 'className': 'txt_center' , 'title' : '기준일자'      },     /* 기준일자 */
            ];        

            var arrColumnDef  =   [

                    /* 지수 */
                    {       
                            'name' : 'f16002'   
                        ,   "render": function ( data, type, row, meta ) {
                                var content = "";

                                if( data ) {

                                    content +=  "<div>";
                                    content +=      "<b>" + row.f16002 + "</b>";        /* 한글종목명 */
                                    content +=      "<br>";
                                    content +=      row.f16013;                         /* 단축코드 */
                                    content +=  "</div>";
/*
                                    if( true ) {
                                        content +=  "<div class='in_icon_r'>";
                                        content +=      "<span class='btn_icon v-icon material-icons text_red'>feedback</span>";
                                        content +=  "</div>";                                        
                                    }
*/                                    
                                }

                                return  content;
                            }
                    },
                    
                    /* Last */
                    {      
                            'name' : 'last_date'   
                        ,   "render": function ( data, type, row, meta ) {
                                let htm = "";
  
                                htm += data;           /* 한글종목명 */

                                if (row.f15004 >= 0) {
                                    htm += "<br><span class='text_S text_red'>"+row.f15004+"%</span>";      /* 등락율 */
                                } else {
                                    htm += "<br><span class='text_S text_blue'>"+row.f15004+"%</span>";     /* 등락율 */
                                }

                                return  htm;
                            }
                    },

                    /* ETF */
                    {       
                            'name' : 'etp_info_json'   
                        ,   "render": function ( data, type, row, meta ) {
                                var content = "";

                                if( data ) {
                                    var arrData = JSON.parse( data );

                                    for( var i in arrData ) {
                                        content +=      arrData[i].f16002;
                                        content +=      "<br>";
                                    }
                                }

                                return  content;
                            }
                    },

                    /* 최근종가 */
                    {      
                            'name' : 'f15001'   
                        ,   "render": function ( data, type, row, meta ) {
                                let htm = "";

                                htm += util.formatNumber(data);

                                if (row.f15004 >= 0) {
                                    htm += "<br><span class='text_S text_red'>"+row.f15004+"%</span>";      /* 등락율 */
                                } else {
                                    htm += "<br><span class='text_S text_blue'>"+row.f15004+"%</span>";     /* 등락율 */
                                }

                                return  htm;
                            }
                    },

                    /* 그래프 영역 */
                    {       
                            'name' : 'graph'   
                        ,   "render": function ( data, type, row ) {

                                var graphContent = "";

                                /* 지수정보 */
                                graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnIndex"      , "btnContent" : "equalizer"       , "btnSpanContent" : "지수정보" } );
                                
                                /* 지수구성정보 */
                                graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnIndexDetailList", "btnContent" : "pie_chart"        , "btnSpanContent" : "지수구성정보" } );

                                /* 지수조치내역 */
/*
    TODO:   2차에서 개발 ( 버튼 숨김 처리 )
                                graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnIndexFix"   , "btnContent" : "insert_comment"   , "btnSpanContent" : "지수조치내역" } );
*/                                

                                /* 지수오류내역 */
/*
    TODO:   2차에서 개발 ( 버튼 숨김 처리 )
                                graphContent    +=  vm.fn_getGraphInfo( { "btnId" : "btnIndexError" , "btnContent" : "assignment_turned_in", "btnSpanContent" : "지수오류내역" } );
*/                                

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

        fn_showDetailIndex( gubun, paramData) {
            var vm = this;

            vm.$emit( "fn_showDetailIndex", gubun, paramData );
        },
        openIndexModal: function() {
          this.IndexModalFlag = true;
        },
        closeIndexModal: function() {
          this.IndexModalFlag = false;
        },
    }
};
</script>

