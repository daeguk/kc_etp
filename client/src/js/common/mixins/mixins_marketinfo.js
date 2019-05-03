
import $      from 'jquery'
import Config from "@/js/config.js";



/*
 *  Market 에서 사용할 공통 함수 정보
 *  2019-05-02  bkLove(촤병국)
 */
export  const  market_common =   {

    methods: {

        fn_getDataFromMarket: function(carousel_data, n, x, dataKind) {

            if (carousel_data[(((n-1)* this.carousel_info.carousel_div )+x-1)]) {
                return carousel_data[(((n-1)* this.carousel_info.carousel_div)+x-1)][ dataKind ];
            } else {
                return "";
            }
        },        

        /*
         * 시장대표에 해당하는 지수 및 ETP 정보를 조회한다. ( ETP -> 시장대표 탭 선택시 )
         * 2019-04-16  bkLove(촤병국)
         */
        fn_getEtpList: function( ctg_large_code ) {

            var vm = this;
            var idx = 0;

            console.log("########## mixins_marketinfo.js -> fn_getEtpList ############");
            console.log("ctg_large_code=[" + ctg_large_code + "]");
            console.log("vm.table_name=[" + vm.table_name + "]");

            axios.post(Config.base_url + "/user/marketinfo/getEtpList", {
                data: {
                    ctg_large_code  :   ctg_large_code
                }
            }).then(function(response) {
                console.log(response);

                if( response.data ) {
                    var etpLists = response.data.etpLists;
                    vm.carousel_data = response.data.carousel_data;
                    vm.carousel_mod = response.data.carousel_mod;
                    vm.ctg_results = response.data.ctgCodeList;
                    vm.carousel_info = response.data.carousel_info;

                    var items = null;

                    for (let ctgCodeItem of vm.ctg_results) {

                        vm.$nextTick().then(() => {
                            items = etpLists[idx++];

                            console.log("vm.table_name + ctgCodeItem.ctg_code=[" + vm.table_name + ctgCodeItem.ctg_code + "]");
                            $('#' + vm.table_name + ctgCodeItem.ctg_code).DataTable( {
                                    "processing": true,
                                    "serverSide": false,
                                    "info": false,   // control table information display field
                                    "stateSave": true,  //restore table state on page reload,
                                    "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                                    
                                    select: {
                                        style:    'single',
                                        selector: 'td:first-child'
                                    },
                                    paging: false,
                                    searching: false,
                                    data : items,                            
                                    "columnDefs": [
                                        {  
                                            "render": function ( data, type, row ) {
                                                let htm = "<span>";
                                                htm += "           <b>"+data+"</b>";
                                                htm += "            <br>"+row.f16013;
                                                if (row.NEW_YN == "Y") {
                                                    htm += "<span><div class='text_new'>new</div></span>";
                                                }
                                                return htm;
                                            },
                                            "targets": 0
                                        },
                                        {  
                                            "render": function ( data, type, row ) {
                                                let htm = ""
                                                if (row.f15004 >= 0) {
                                                    htm = "<span class='align_r text_red'>"+data;
                                                } else {
                                                    htm = "<span class='align_r text_blue'>"+data;
                                                }
                                                htm += "<br><span class='text_S'>"+row.f30818+"%</span>";
                                                htm += "   </span>";
                                                return htm;
                                            },
                                            "targets": 1
                                        },
                                        {  
                                            "render": function ( data, type, row ) {
                                                let htm = ""
                                                if (row.f15004 >= 0) {
                                                    htm = "<span class='align_r text_red'>"+data;
                                                } else {
                                                    htm = "<span class='align_r text_blue'>"+data;
                                                }
                                                htm += "<br><span class='text_S'>"+row.f15004+"%</span>";
                                                htm += "   </span>";
                                                return htm;
                                            },
                                            "targets": 6
                                        },
                                        {
                                            "render": function ( data, type, row ) {
                                                let htm = "<div class='tooltip'><button type='button' id='detail' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:70px;'>ETP</span></div>";
                                                htm += "<div class='tooltip'><button type='button' id='pdf' class='btn_icon v-icon material-icons'>picture_as_pdf</button><span class='tooltiptext' style='width:70px;'>PDF관리</span></div>";
                                                return htm;
                                            },
                                            "targets": 7
                                        }
                                    ],
                                    columns: [
                                        { "data": "f16002", "orderable": true, className:"txt_left line2"}, /*종목*/
                                        { "data": "fmt_f15301", "orderable": true }, /*INAV*/
                                        { "data": "fmt_f03329", "orderable" : true}, /*전일최종Nav*/
                                        { "data": "f15302", "orderable" : true}, /*추적오차율*/
                                        { "data": "f15304", "orderable" : true}, /*괴리율*/
                                        { "data": "f34777", "orderable" : true}, /*기초지수*/
                                        { "data": "fmt_f15318", "orderable" : true}, /*지수현재가*/
                                        { "data": null, "orderable" : true, defaultContent:""},
                                    ]
                            }); 

                            // ETP 갯수와 기준일 바인딩 
                            if (items) {
                                $("#" + vm.table_name + "_count"+ ctgCodeItem.ctg_code).html(items.length);
                                $("#" + vm.table_name + "_date" + ctgCodeItem.ctg_code).html("기준일 :"+items[0].f12506);
                            }

                            // 테이블별 이벤트
                            $('#' + vm.table_name + ctgCodeItem.ctg_code+' tbody').on('click', 'button', function () {
                                var table = $('#' + vm.table_name + ctgCodeItem.ctg_code).DataTable();
                                var data = table.row($(this).parents('tr')).data();

                                if ($(this).attr('id') == 'detail') {
                                    console.log('move detailPage ');
                                    vm.fn_movePageFromMarket( data );
                                } else {
                                    console.log('move pdfPage ');
                                }
                                    
                            });
                            
                        });
                    }
                }
            });
        },
        
        fn_movePageFromMarket: function( data ) {

            var vm = this;

            console.log("########## mixins_marketinfo.js -> fn_movePageFromMarket ############");
            console.log( "data.f16012=[" + data.f16012 + "] /* 국제표준코드  */" );
            console.log( "data.f16257=[" + data.f16257 + "] /* ETP기초지수코드  */" );
            console.log( "data.f34239=[" + data.f34239 + "] /* ETP기초지수MID  */" );

            if(     !data.f16012        /* 국제표준코드  */
                ||  !data.f16257        /* ETP기초지수코드  */
                ||  !data.f34239        /* ETP기초지수MID  */
                ||  data.f34239 < 0
            ) {
                vm.$root.$confirm.open('확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.', {}, 1);
                return  false;
            }


            vm.paramData.f16012         =   data.f16012;        /* 국제표준코드  */
            vm.paramData.f16257         =   data.f16257;        /* ETP기초지수코드  */
            vm.paramData.f34239         =   data.f34239;        /* ETP기초지수MID  */

            axios.post(Config.base_url + "/user/etp/getExistEtpBasicCnt", {
                data: {
                    basicData   :   vm.paramData
                }
            }).then(function(response) {
                console.log(response);

                if (response.data) {
                    var etpIndex = response.data.etpIndex;

                    if( etpIndex.etp_cnt == 0 ) {
                        vm.$emit("showMessageBox", '확인','ETP 정보가 존재하지 않습니다. 관리자에게 문의해 주세요.', {}, 1);
                        return  false;
                    }

                    if( etpIndex.index_cnt == 0 ) {
                        vm.$emit("showMessageBox", '확인','지수정보가 존재하지 않습니다. 관리자에게 문의해 주세요.' + '(' + etpIndex.index_cnt + ')', {}, 1);
                        return  false;
                    }

                    //vm.showEtpManageDetailDialog = true;
                    vm.$emit('showDetail', 1, vm.paramData);
                }
            });
        },

        fn_marketClosePop : function( param ) {
            this.showEtpManageDetailDialog =   false;
        }
    },    
}