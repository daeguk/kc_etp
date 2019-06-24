<template>
        <v-layout row wrap>
            <v-flex xs12 flat>
                <div class="indexinfo_box01">
                    <h4 class="mb-0">Performance</h4>
                    <div class="graph_02_w">
                        <div :class="perf_class" id="perf_chart"></div>
                    </div>
                   <v-card flat>
                     <table id="perf_table" :class="tbl_class">
                         <colgroup>
                            <col class="">
                            <col class="perf_t_w0">
                            <col class="perf_t_w1">
                            <col class="perf_t_w2">
                            <col class="perf_t_w3">
                            <col class="perf_t_w4">
                            <col class="perf_t_w5">
                            <col class="perf_t_w6">
                            <col class="perf_t_w7">
                            <col class="perf_t_w8">
                            <col class="perf_t_w9">
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
                                            <col width="10%">
                                            <col width="40%">
                                            <col width="40%">
                                            <col width="10%">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th class="txt_left">Code</th>
                                                <th class="txt_left">Name</th>
                                                <th class="txt_right">Alllocation</th>
                                                <th class="txt_left">GUBUN</th>
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
                        <v-layout v-if="results.length >= 1">
                                <v-flex xs3><v-icon :style="{color:importance_colors[0]}" class="lineh">fiber_manual_record</v-icon>{{results[0].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r">{{results[0].PERCNT}}%</v-flex>
                                <v-flex xs2></v-flex>
                                <v-flex xs3 v-if="results.length >= 2"><v-icon :style="{color:importance_colors[1]}" class="lineh">fiber_manual_record</v-icon>{{results[1].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r" v-if="results.length >= 2">{{results[1].PERCNT}}%</v-flex>     
                        </v-layout>    
                        <v-layout v-if="results.length >= 3">
                                <v-flex xs3><v-icon :style="{color:importance_colors[2]}" class="lineh">fiber_manual_record</v-icon>{{results[2].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r">{{results[2].PERCNT}}%</v-flex>
                                <v-flex xs2></v-flex>
                                <v-flex xs3 v-if="results.length >= 4"><v-icon :style="{color:importance_colors[3]}" class="lineh">fiber_manual_record</v-icon>{{results[3].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r" v-if="results.length >= 4">{{results[3].PERCNT}}%</v-flex>     
                        </v-layout>    
                        <v-layout v-if="results.length >= 5">
                                <v-flex xs3><v-icon :style="{color:importance_colors[4]}" class="lineh">fiber_manual_record</v-icon>{{results[4].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r">{{results[4].PERCNT}}%</v-flex>
                                <v-flex xs2></v-flex>
                                <v-flex xs3 v-if="results.length >= 6"><v-icon :style="{color:importance_colors[5]}" class="lineh">fiber_manual_record</v-icon>{{results[5].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r" v-if="results.length >= 6">{{results[5].PERCNT}}%</v-flex>     
                        </v-layout>    
                        <v-layout v-if="results.length >= 7">
                                <v-flex xs3><v-icon :style="{color:importance_colors[6]}" class="lineh">fiber_manual_record</v-icon>{{results[6].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r">{{results[6].PERCNT}}%</v-flex>
                                <v-flex xs2></v-flex>
                                <v-flex xs3 v-if="results.length >= 8"><v-icon :style="{color:importance_colors[7]}" class="lineh">fiber_manual_record</v-icon>{{results[7].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r" v-if="results.length >= 8">{{results[7].PERCNT}}%</v-flex>     
                        </v-layout>    
                        <v-layout v-if="results.length >= 9">
                                <v-flex xs3><v-icon :style="{color:importance_colors[8]}" class="lineh">fiber_manual_record</v-icon>{{results[8].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r">{{results[8].PERCNT}}%</v-flex>
                                <v-flex xs2></v-flex>
                                <v-flex xs3 v-if="results.length >= 10"><v-icon :style="{color:importance_colors[9]}" class="lineh">fiber_manual_record</v-icon>{{results[9].JONG_NM}}</v-flex>
                                <v-flex xs2 class="text_r" v-if="results.length >= 10">{{results[9].PERCNT}}%</v-flex>     
                        </v-layout>                       
                    </v-card>
                </div>
                    </v-card>

                        </v-flex>
                        <v-flex xs6>
                            <div class="graph_02_w"  id="importance_chart"></div>
                        </v-flex>
                    </v-layout>
                </div>
                <!---비중정보 팝업end-->
            </v-flex>
        </v-layout>
</template>


<script>
import jongmokPopup from "@/components/common/popup/jongmokPopup";
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import select from 'datatables.net-select'
import Config from '@/js/config.js'

var perf_table = null;
var importance_grid = null;
export default {
    props: ["basicData", "showDialog", "showView"],
    data() {
        return {
            tab: null,
            importance_colors: ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde', '#B6B8BA', '#7E8083', '#FBB040', '#F58025', '#EDED8A'],
            dialog: false,
            jongMokDialog: false,
            results: [],
            importance_cnt:0,
            search:"",
            modalFlag: false,
            importance_grid_id : "importance_grid",
            importance_chart_id : "importance_chart",
            performChartImages  :   ['perform_bar01.png', 'perform_bar02.png', 'perform_bar03.png', 'perform_bar04.png', 'perform_bar05.png'],
            param: {},
            perf_class : 'perf_chart_w',
            tbl_class : 'tbl_type ver4',
            chart_size : '1180'
        };
    },
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
            vm.$nextTick().then(() => {
                if(     vm.basicData 
                    &&  vm.basicData.jisu_cd
                    &&  vm.basicData.large_type
                    &&  vm.basicData.market_id
                ) {
                    vm.param.jisu_cd      =   vm.basicData.jisu_cd;
                    vm.param.large_type   =   vm.basicData.large_type;
                    vm.param.market_id    =   vm.basicData.market_id;

                    if( vm.showView ) {
                        vm.perf_class = vm.basicData.perf_class;
                        vm.tbl_class = vm.basicData.tbl_class;
                        vm.chart_size = vm.basicData.chart_size;
                    }
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
                            "render": function ( data, type, row, meta ) {
                                if (data) {
                                    return "<img src='/assets/img/" + vm.performChartImages[ meta.row ] + "'><span class='line2_ts2'>" + data + "</span>";
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
                        { "data": "F16002", "orderable": false,  className: 'txt_left line2 perf_t_w0'}, 
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
            });
        },
        performance_chart: function() {
            var vm = this;
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
                            'width':vm.chart_size,
                            'height':'180',
                            'colors': ['#85c406', '#1e99e8', '#434343', '#ff4366', '#fbb040'],                
                            'hAxis':{
                                textStyle: {
                                    color:'#ffffff'
                                },
                                gridlines: {
                                    color:'#ffffff'
                                }
                            },
                            'legend': {
                                position: 'left',
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
                    //alert("데이터가 없습니다");
                } else {
                    var items = response.data.results;
                    console.log("response=" + JSON.stringify(items));
                    
                    perf_table.clear().draw();
                    perf_table.rows.add(items).draw();

                    // 그래프 실행
                    
                    vm.performance_chart();
                }
                   
            });
        }, 

        /* 자산 추가시 선택된 정보 처리*/
        getSelectedItem: function(sel_items, gubun) {
            var vm = this;
            vm.jongMokDialog = false;
            
            if ((perf_table.rows().count()) + sel_items.length > 5) {

                vm.$emit("showMessageBox", '확인','자산 비교는 5개 까지 가능 합니다.',{},1);
                return;
            } 

            for (let i = 0; i < sel_items.length; i++) {

                    let compare_cnt = perf_table.column(0).data().filter(
                        function(value, index) {
                            var JISU_CD = ( gubun == '1' ? sel_items[i].F16012 : sel_items[i].F16013 );
                            return JISU_CD == value ? true : false;
                        }
                    ).count();
                    
                    if (compare_cnt == 0) {      
                        var jisu_cd = '';
                        var market_id = '';
                        // ETP 정보일 경우
                        if (gubun == '1') {
                            jisu_cd = sel_items[i].F16012;
                            market_id = '';
                        // Index 정보 일경우
                        } else if (gubun == '2') {
                            jisu_cd = sel_items[i].F16013;
                            market_id = sel_items[i].market_id;
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
                                vm.$emit("showMessageBox", '확인','데이터가 없습니다.',{},1);
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
                            vm.$emit("showMessageBox", '확인',sel_items[i].F16002 +"은 이미 추가된 자산입니다.",{},1);
                    }
                   
            }

            
        
        },
        showJongMokPop: function() {  
                 this.jongMokDialog = true; 
        },         
     
        hideJongMokPop: function() { 
            this.jongMokDialog = false; 
        }, 


        getIndexImportanceList: function( paramData ) {

            var     vm  =   this;

            console.log("getIndexImportanceList");
            axios.get(Config.base_url + "/user/index/getIndexImportanceList", {
                    params: {
                        jisu_cd     :   paramData.jisu_cd,
                        market_id   :   paramData.market_id
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("비중 목록이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.results = items;
                        this.importance_cnt = this.results.length;

                        // 차트 호출
                        this.importance_chart(items);
                        
                        if (importance_grid) {
                            importance_grid.destroy()
                        }

                        importance_grid = $('#' + vm.importance_grid_id).DataTable( {
                            "processing": true,
                            "serverSide": false,
                            "info": false,   // control table information display field
                            "stateSave": true,  //restore table state on page reload,
                            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                            scrollY:        '500px',
                            scrollCollapse: true,
                            select: {
                                style:    'multi',
                                selector: 'td:first-child'
                            },
                            paging: false,
                            searching: false,
                            data : this.results,
                            columns: [
                                { "data": "ISIN_CODE", "orderable": true},
                                { "data": "JONG_NM", "orderable": true },
                                { "data": "PERCNT", "orderable" : true},
                                { "data": "GUBUN", "orderable" : true},
                            ]
                        }); 

                        
                    }
                   
                });
        }, 


        importance_chart: function(results) {

            var     vm  =   this;

            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});

           
            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart());

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
      
            function drawChart() {
                
                
                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', '');
                data.addColumn('number', 'PERCNT');

               
                // Set chart options
                var options = {'title':'',
                            'width':'700',
                            'height':'350',
                            'colors': ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde', '#B6B8BA', '#7E8083', '#FBB040', '#F58025', '#EDED8A'],        
                                       
                            'legend': {
                                position: 'right',
                                color: '#ffffff',
                               
                            },
                            'lineWidth': 5
                            
                };
                
                
                var items = [] 

                for (let item of results) {
                    
                    if (items.length >= 10) break;

                    items.push([item.JONG_NM, Number( item.PERCNT ) ]);

                }
                
            

                
                data.addRows(
                    items
                );

                // Instantiate and draw our chart, passing in some options.
                var chart = new google.visualization.PieChart( document.getElementById( vm.importance_chart_id ) );
                chart.draw(data, options);
            }
        },

    }
}
</script>
