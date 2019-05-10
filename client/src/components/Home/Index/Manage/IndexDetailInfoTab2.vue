<template>
    <v-container fluid grid-list-md pa-0 mb-4>
        <v-layout row wrap>
            <v-flex xs12 flat>
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Performance</h4>
                    <div class="graph_02_w">
                        <div class="perf_chart_w" id="perf_chart"></div>
                    </div>
                   <v-card flat>
                     <table id="perf_table" class="tbl_type ver3" style="width:1348px">
                         <colgroup>
                            <col width="314px">
                            <col width="117px">
                            <col width="122px">
                            <col width="117px">
                            <col width="112px">
                            <col width="123px">
                            <col width="118px">
                            <col width="118px">
                            <col width="122px">
                            <col width="85px">
                        </colgroup>
                         <thead>
                          <tr>
                             <th></th>
                             <th></th>
                             <th class="txt_right">1-Week</th>
                             <th class="txt_right">1-Month</th>
                             <th class="txt_right">3-Month</th>
                             <th class="txt_right">YTD</th>
                             <th class="txt_right">1-Year</th>
                             <th class="txt_right">3-Year</th>
                             <th class="txt_right">5-Year</th>
                             <th class="txt_right">10-Year</th>
                             <th></th>
                           </tr>
                           </thead>
                       </table> 

                     
                    </v-card>
                    <!---자산추가 팝업 -->
                    <v-layout row>
                        <v-btn outline small color="primary" dark v-on:click="showJongMokPop">
                            <v-icon small color="primary">add</v-icon>자산추가
                        </v-btn>
                        <jongmokPopup @selectedItem="getSelectedItem" @hideJongMokPop="hideJongMokPop" :showDialog="jongMokDialog"></jongmokPopup>
                    </v-layout>
                    <!--자산추가 팝업 end -->
                </div>
            </v-flex>
            <v-flex xs12 flat>
                <!---비중정보 팝업 -->
                <div class="indexinfo_box01">
                    <h4 class="mb-0">포트폴리오</h4>
                    <v-layout>
                        <v-flex xs6>
                    <v-subheader>
                        TOP10 비중정보
                        <v-dialog v-model="dialog" persistent max-width="500">
                            <template v-slot:activator="{ on }">
                                <v-btn outline small color="primary" dark v-on="on">VIEW ALL</v-btn>
                            </template>
                            <v-card>
                                <h5>
                                    <v-card-title ma-0>
                                        종목 비중정보 (KODEX 200)
                                        <v-spacer></v-spacer>
                                        <v-btn icon dark @click="dialog = false">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                </h5>
                                <div class="index3pop2_con">
                                    <v-list subheader two-line>
                                        <!--v-list-tile>
                                            <v-list-tile-title>Last Updated</v-list-tile-title>
                                            <v-list-tile-content>Notifications</v-list-tile-content>
                                        </v-list-tile-->
                                        <v-list-tile>
                                            <v-list-tile-title>Total</v-list-tile-title>
                                            <v-list-tile-content>{{importance_cnt}}</v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </div>
                                <v-card flat>
                                    <table id="importance_grid" class="tbl_type" style="width:100%">
                                        <colgroup>
                                            <col width="20%">
                                            <col width="40%">
                                            <col width="40%">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th class="txt_left">Code</th>
                                                <th class="txt_left">Name</th>
                                                <th class="txt_right">Alllocation</th>
                                            </tr>
                                        </thead>   
                                    </table>
                                </v-card>
                                <v-card class="pop_bot_h"></v-card>
                            </v-card>
                        </v-dialog>
                    </v-subheader>
                    <v-card flat>
                    <div class="indexinfo_box01">
                    <v-card flat class="indexinfo_list_table">
                        <v-layout row>
                            <v-flex xs3><v-icon style="color:#b9e0f7" class="lineh">fiber_manual_record</v-icon>삼성전자</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                            <v-flex xs2></v-flex>
                            <v-flex xs3><v-icon style="color:#72cdf4" class="lineh">fiber_manual_record</v-icon>SK하이닉스</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs3><v-icon style="color:#1e99e8" class="lineh">fiber_manual_record</v-icon>셀트리온</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                            <v-flex xs2></v-flex>
                            <v-flex xs3><v-icon style="color:#0076be" class="lineh">fiber_manual_record</v-icon>LG화학</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs3><v-icon style="color:#dcddde" class="lineh">fiber_manual_record</v-icon>NAVER</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                             <v-flex xs2></v-flex>
                            <v-flex xs3><v-icon style="color:#B6B8BA;" class="lineh">fiber_manual_record</v-icon>삼성바이오로</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs3><v-icon style="color:#7E8083" class="lineh">fiber_manual_record</v-icon>삼성바이오</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                            <v-flex xs2></v-flex>
                            <v-flex xs3><v-icon style="color:#FBB040" class="lineh">fiber_manual_record</v-icon>신한지주</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs3><v-icon style="color:#F58025" class="lineh">fiber_manual_record</v-icon>현대차</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                             <v-flex xs2></v-flex>
                            <v-flex xs3><v-icon style="color:#EDED8A" class="lineh">fiber_manual_record</v-icon>SK</v-flex>
                            <v-flex xs2 class="text_r">10.25%</v-flex>
                        </v-layout>
                    </v-card>
                </div>
                    </v-card>

                        </v-flex>
                        <v-flex xs6>
                            <div class="graph_02_w"  id="importance_chart"></div>
                        </v-flex>
                    </v-layout>
                    <v-card flat></v-card>
                </div>
                <!---비중정보 팝업end-->
            </v-flex>

            <v-flex xs12></v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import jongmokPopup from "@/components/common/popup/jongmokPopup";
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import select from 'datatables.net-select'
import Config from '@/js/config.js'
import { index_common } from '@/js/common/mixins/mixins_index.js';

var perf_table = null;
export default {
    props: ["basicData"],
    data() {
        return {
            tab: null,
            items: ["ETF", "ETN", "INDEX"],
            dialog: false,
            jongMokDialog: false,
            results: [],
            importance_cnt:0,
            search:"",

            modalFlag: false,
            importance_grid_id : "importance_grid",
            importance_chart_id : "importance_chart",
            param: {}
        };
    },
    mixins : [ index_common ],
    components: {
        jongmokPopup: jongmokPopup,
    },
    computed: {},
    created: function() {
        var vm = this;
        vm.$EventBus.$on('changeIndexAnalysisInfo', data => {
            vm.init();
        });

    },
    beforeDestroy() {
        this.$EventBus.$off('changeIndexAnalysisInfo')
    },

    mounted: function() {        
        this.init();
    },
    methods: {
        init: function() {
            var vm = this;

            if(     vm.basicData 
                &&  vm.basicData.jisu_cd
                &&  vm.basicData.large_type
                &&  vm.basicData.market_id
            ) {
                vm.param.jisu_cd      =   vm.basicData.jisu_cd;
                vm.param.large_type   =   vm.basicData.large_type;
                vm.param.market_id    =   vm.basicData.market_id;
            }
            else if(   
                    vm.$route.query.jisu_cd  
                &&  vm.$route.query.large_type  
                &&  vm.$route.query.market_id  
            ) {
                vm.param.jisu_cd      =   vm.$route.query.jisu_cd;
                vm.param.large_type   =   vm.$route.query.large_type;
                vm.param.market_id    =   vm.$route.query.market_id;
            }        


            vm.$root.$infopoptab1 = vm.$refs.$infopoptab1;

            if(perf_table) {
                perf_table.destroy();
            }
            perf_table = $('#perf_table').DataTable( {
                "processing": true,
                "serverSide": false,
                "search": true,
                "info": false,   // control table information display field
                "stateSave": true,  //restore table state on page reload,
                "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                select: {
                    style:    'single',
                    selector: 'td:first-child'
                },
                paging: false,
                searching: false,
                "ordering": false,
                "columnDefs": [
                    {  
                        "render": function ( data, type, row ) {
                            if (data) {
                                return "<img src='/assets/img/icon_bar01.png'><span>&nbsp;&nbsp;&nbsp;" + data + "</span>";
                            } else {
                                return "";
                            }
                        },
                        "targets": 1
                    },
                    {
                        "targets": [ 0 ],
                        "visible": false
                    },
                    {  
                        "render": function ( data, type, row ) {
                            if (data) {
                                // 기본 지수는 삭제 버튼 제외
                                if (row.F16013 != vm.$route.query.jisu_cd) {
                                    return "<div class='tooltip'><button type='button' id='per_del' class='btn_icon v-icon material-icons'>delete</button><span class='tooltiptext' style='width:40px;'>삭제</span></div>";
                                } 
                            } else {
                                return "";
                            }
                        },
                        "targets": 10
                    },                
                ],
                data : [],
                columns: [
                    { "data": "F16013", "orderable": false}, 
                    { "data": "F16002", "orderable": false,  "width":"30%", className: 'txt_left line2'}, 
                    { "data": "Week1", "orderable": false, className: 'txt_right'},
                    { "data": "Month1", "orderable": false, className: 'txt_right'},
                    { "data": "Month3", "orderable": false, className: 'txt_right'},
                    { "data": "YTD", "orderable": false, className: 'txt_right'},
                    { "data": "Year1", "orderable": false, className: 'txt_right'},
                    { "data": "Year3", "orderable": false, className: 'txt_right'},
                    { "data": "Year5", "orderable": false, className: 'txt_right'},
                    { "data": "Year10", "orderable": false, className: 'txt_right'},
                    {"data": null, "align":"center", className: '', defaultContent:""}
                ]
            }); 
        

            if(     this.param
                &&  this.param.jisu_cd
                &&  this.param.market_id
            ) {

                vm.getIndexImportanceList( this.param );

                $('#perf_table, tbody').on('click', 'button', function () {
                    if ($(this).attr('id') == 'per_del') {
                        var data = perf_table.row($(this).parents('tr')).remove().draw();
                    
                        vm.performance_chart();
                    }
                });

                vm.getIndexAnalysisInfo();
            }
        },
        performance_chart: function() {
            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});

           
            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart());

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
      
            function drawChart() {
               
              
                var items = [] 

                items.push(['string']);
                items.push(['1-Week']);
                items.push(['1-Month']);
                items.push(['3-Month']);
                items.push(['YTD']);
                items.push(['1-Year']);
                items.push(['3-Year']);
                items.push(['5-Year']);
                items.push(['10-Year']);

              
                for (let i = 0; i < perf_table.rows().data().length; i++) {   
                    var data = perf_table.rows().data()[i];
                    // 첫번째 ROW 범위
                    items[0][i+1] = data.F16002;           
                    for (let x = 0; x < perf_table.rows().data().length; x++) {   
                        var item = perf_table.rows().data()[x];
                        // 데이터                    
                        items[1][x+1] = Number(item.Week1);
                        items[2][x+1] = Number(item.Month1);
                        items[3][x+1] = Number(item.Month3);
                        items[4][x+1] = Number(item.YTD);
                        items[5][x+1] = Number(item.Year1);
                        items[6][x+1] = Number(item.Year3);
                        items[7][x+1] = Number(item.Year5);
                        items[8][x+1] = Number(item.Year10);
                    }
                }
        
            
                var chart_data = new google.visualization.arrayToDataTable( items);

                 // Set chart options
                var options = {'title':'',
                            'width':'1180',
                            'height':'180',
                            'colors': ['#1e99e8', '#48485e', '#ff4366', '#727281', '#b9e0f7'],                           
                            'legend': {
                                position: 'left'
                            },
                            seriesType: 'bars',
                            
                };
                // Instantiate and draw our chart, passing in some options.                
                var chart = new google.visualization.ComboChart(document.getElementById('perf_chart'));
                chart.draw(chart_data, options);
            }
        },


        getIndexAnalysisInfo: function() {
            var vm = this;
            console.log("getIndexAnalysisInfo");
            axios.get(Config.base_url + "/user/index/getIndexAnalysisInfo", {
                    params: {
                        jisu_cd : vm.param.jisu_cd,
                        market_id : vm.param.market_id
                    }
            }).then(response => {
                    // console.log(response);
                if (response.data.success == false) {
                    alert("비중 목록이 없습니다");
                } else {
                    var items = response.data.results;
                    console.log("response=" + JSON.stringify(items));
                    
                    perf_table.clear().draw();
                    perf_table.rows.add(items).draw();

                    // 그래프 실행
                    setTimeout(function() {
                        vm.performance_chart();
                    }, 2500);
                }
                   
            });
        }, 

        /* 자산 추가시 선택된 정보 처리*/
        getSelectedItem: function(sel_items, gubun) {
            var vm = this;
            vm.jongMokDialog = false;
            
            for (let i = 0; i < sel_items.length; i++) {
                
                if (perf_table.rows().count() <= 4) {

                    let compare_cnt = perf_table.column(0).data().filter(
                        function(value, index) {
                            return sel_items[i].JISU_CD == value ? true : false;
                        }
                    ).count();
                    
                    if (compare_cnt == 0) {      
                        var jisu_cd = '';
                        var market_id = '';
                        // ETP 정보일 경우
                        if (gubun == '1') {
                            jisu_cd = sel_items[i].JISU_CD
                            market_id = '';
                        // Index 정보 일경우
                        } else if (gubun == '2') {
                            jisu_cd = sel_items[i].JISU_CD
                            market_id = sel_items[i].MARKET_ID;
                        }
                        axios.get(Config.base_url + "/user/index/getIndexAnalysisData", {
                                params: {
                                    jisu_cd : jisu_cd,                            
                                    market_id : market_id,
                                    gubun : gubun
                                }
                        }).then(response => {
                                // console.log(response);
                            if (response.data.success == false) {
                                alert("비중 목록이 없습니다");
                            } else {
                                var items = response.data.results[0];
                                                
                                perf_table.row.add(  {
                                    F16012 : items.F16012,
                                    F16013 : items.F16013,
                                    F16002 : items.F16002,
                                    Week1 : items.Week1,
                                    Month1 : items.Month1,
                                    Month3 : items.Month3,
                                    YTD : items.YTD,
                                    Year1 : items.Year1,
                                    Year3 : items.Year3,
                                    Year5 : items.Year5,
                                    Year10 : items.Year10,
                                } ).draw(false); 
                                
                                vm.performance_chart();
                            }
                       
                        });
                    } else {
                            alert(sel_items[i].JISU_NM +"은 이미 추가된 자산입니다.");    
                    }
                   
                } else {
                    alert("자산 비교는 총 5개 까지 가능 합니다.");
                    break;
                }
            }

            
        
        },
        showJongMokPop: function() {  
                 this.jongMokDialog = true; 
        },         
     
        hideJongMokPop: function() { 
            this.jongMokDialog = false; 
        }, 

    }
}
</script>
