
import $      from 'jquery'
import Config from "@/js/config.js";
import util       from "@/js/util.js";


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

            vm.$emit('showProgress', true);
            console.log("########## mixins_marketinfo.js -> fn_getEtpList ############");
            console.log("ctg_large_code=[" + ctg_large_code + "]");
            console.log("vm.table_name=[" + vm.table_name + "]");

            axios.post(Config.base_url + "/user/marketinfo/getEtpList", {
                data: {
                    ctg_large_code  :   ctg_large_code
                }
            }).then(function(response) {
                console.log(response);

                console.log("carousel_data..............");

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
                                                htm += "            <br><span class='text_s'>"+row.f16013+"</span>";
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
                            
                                                htm += util.formatNumber(data);

                                                if (row.f30818 >= 0) {
                                                    htm += "<br><span class='text_S text_red'>"+row.f30818+"%</span>";
                                                } else {
                                                    htm += "<br><span class='text_S text_blue'>"+row.f30818+"%</span>"; /* ETF관련지수등락율 */
                                                }

                                                return htm;
                                                
                                            },
                                            "targets": 1
                                        },
                                        {  
                                            "render": function ( data, type, row ) {
                                                
                                                return util.formatNumber(data);
                                                
                                            },
                                            "targets": 2
                                        },
                                        {  
                                            "render": function ( data, type, row ) {

                                                let htm = ""
                            
                                                htm += util.formatNumber(data);

                                                if (row.f30823 >= 0) {
                                                    htm += "<br><span class='text_S text_red'>"+row.f30823+"%</span>";
                                                } else {
                                                    htm += "<br><span class='text_S text_blue'>"+row.f30823+"%</span>"; /* ETF관련지수등락율 */
                                                }

                                                return htm;
                                                
                                            },
                                            "targets": 6
                                        },
                                        {
                                            "render": function ( data, type, row ) {
                                                let htm = "<div class='tooltip'><button type='button' id='detail' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:40px;'>ETP</span></div>";
                                                htm += "<div class='tooltip'><button type='button' id='pdf' class='btn_icon v-icon material-icons'>pie_chart</button><span class='tooltiptext' style='width:60px;'>PDF관리</span></div>";
                                                return htm;
                                            },
                                            "targets": 7
                                        }
                                    ],
                                    columns: [
                                        { "data": "f16002", "orderable": true, className:"txt_left line2"}, /*종목*/
                                        { "data": "f15301", "orderable": true, className:"txt_right" }, /*INAV*/
                                        { "data": "f03329", "orderable" : true, className:"txt_right" }, /*전일최종Nav*/
                                        { "data": "f15302", "orderable" : true, className:"txt_right" }, /*추적오차율*/
                                        { "data": "f15304", "orderable" : true, className:"txt_right" }, /*괴리율*/
                                        { "data": "f34777", "orderable" : true, className:"txt_left" }, /*기초지수*/
                                        { "data": "f15318", "orderable" : true, className:"txt_right" }, /*지수현재가*/
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
                                    vm.fn_movePageFromMarket( data, 1 );
                                } else {
                                    vm.fn_movePageFromMarket( data, 3 );
                                }
                                    
                            });
                            
                        });
                    }
                }
                vm.$emit('showProgress', false);
            }).catch(error => {
                vm.$emit("showProgress", false);
            });
        },
        
        fn_movePageFromMarket: function( data, gubun ) {

            var vm = this;

            console.log("########## mixins_marketinfo.js -> fn_movePageFromMarket ############");
            console.log( "data.f16012=[" + data.f16012 + "] /* 국제표준코드  */" );
            console.log( "data.f16257=[" + data.f16257 + "] /* ETP기초지수코드  */" );
            console.log( "data.f34239=[" + data.f34239 + "] /* ETP기초지수MID  */" );


            //vm.showEtpManageDetailDialog = true;
            vm.$emit('showDetail', gubun, data);
              
        },

        fn_marketClosePop : function( param ) {
            this.showEtpManageDetailDialog =   false;
        }
    },    
}