<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex xs12>
                <v-layout>
                    <v-flex xs3 pr-2 v-for="(marketRep, index) in marketRepList" :key="marketRep.f16002">
                        <v-card flat class="marketindex_card">
                            <v-card-title>
                                <h4>{{marketRep.f16002}}</h4>
                                <v-spacer></v-spacer>
                                <div class="index_num1">{{formatNumber(marketRep.f15001)}}</div>
                            </v-card-title>
                            <v-card-text class="index_graph_w">
                                <!--div class="graph_v2" :id="marketRep.f16013 + marketRep.market_id"></div-->
                                <AreaChart v-if=chartLoadFlag :chartItem="{chartId: marketRep.f16013 + marketRep.market_id, width: '150', height: '100',  marginW: 10, marginH: 20, chartColor: '#B39DDB'}" :dataSet="getDataSet(index)"></AreaChart>
                                <div class="index_num2 text_red" v-if="marketRep.f15004 >= 0">
                                    {{marketRep.f15472}}
                                    <br>({{marketRep.f15004}}%)
                                </div>
                                <div class="index_num2 text_blue" v-else>
                                    {{marketRep.f15472}}
                                    <br>({{marketRep.f15004}}%)
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>                    
                </v-layout>
            </v-flex>

            <!---테이블1 -->
            <v-flex grow xs12 mt-3>
                <v-card flat>
                    <v-card-title primary-title class="tbl_w2">
                        <v-list-tile>
                            <v-list-tile-avatar>
                                <img src="/assets/img/avatar.png">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title class="headline">KRX
                                </v-list-tile-title>
                                <v-list-tile-sub-title>설명이 들어갑니다.</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-card-title>
                    <v-card flat>
                        <table id="krxIndexTable" class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>지수명</th>
                                    <th>현재가</th>
                                    <th>전일가</th>
                                    <th>Daily</th>
                                    <th>1Week</th>
                                    <th>1Month</th>
                                    <th>YTD</th>
                                    <th>1Year</th>
                                    <th>3Year</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                        <v-btn block color="#ffffff" @click="moreData('krx')">
                            <v-icon color="#9e9e9e">add</v-icon>더보기 ({{krxCurrentPage}}/{{krxTotalPage}})
                        </v-btn>
                    </v-card>
                </v-card>
            </v-flex>
            <!---테이블1 end -->

            <!-- 테이블2 -->
            <v-flex grow xs12 mt-3>
                <v-card flat>
                    <v-card-title primary-title class="tbl_w2">
                        <v-list-tile>
                            <v-list-tile-avatar>
                                <img src="/assets/img/avatar.png">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title class="headline">FnGuide
                                </v-list-tile-title>
                                <v-list-tile-sub-title>설명이 들어갑니다.</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-card-title>
                    <v-card flat>
                        <table id="fnGuideIndexTable" class="tbl_type" style="width:100%">
                            <colgroup>
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                                <col width="%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>지수명</th>
                                    <th>현재가</th>
                                    <th>전일가</th>
                                    <th>Daily</th>
                                    <th>1Week</th>
                                    <th>1Month</th>
                                    <th>YTD</th>
                                    <th>1Year</th>
                                    <th>3Year</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                        <v-btn block color="#ffffff" @click="moreData('fn')">
                            <v-icon color="#9e9e9e">add</v-icon>더보기 ({{fnCurrentPage}}/{{fnTotalPage}})
                        </v-btn>
                    </v-card>
                </v-card>
            </v-flex>
            
        </v-layout>
    </v-container>
</template>



<script>

import $ from "jquery";
import dt from "datatables.net";
import buttons from "datatables.net-buttons";
import select from "datatables.net-select";
import _ from "lodash";
import Config       from "@/js/config.js";
import util       from "@/js/util.js";
import AreaChart   from  '@/components/Common/Chart/AreaChart.vue';

var krxIndexTable = null;
var fnGuideIndexTable = null;
export default {
    props: [],
    data() {
        return {
            marketRepList: [],
            graphinfos:[],     
            krsLists:[],   
            fnGuideLists:[], 
            pageLength: 5, 
            krxCurrentPage: 0,
            krxTotalPage:0,
            fnCurrentPage: 0,
            fnTotalPage:0,
            chartLoadFlag: true,

            paramData : {},
        };
    },
    components: {
        AreaChart: AreaChart,
    },
    computed: {
        
    },
    mounted: function() {
        var vm = this;

        vm.getMarketIndexList();
        

        krxIndexTable = $('#krxIndexTable').DataTable( {
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
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br><span class='text_s'>"+row.F16013+"</span>";
                        if (row.NEW_YN == "Y") {
                            htm += "<span><div class='text_new'>new</div></span>";
                        }
                        htm += "        </span>";
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {

                        let htm = ""
                            
                        htm += util.formatNumber(data);

                        if (row.F15004 >= 0) {
                            htm += "<br><span class='text_S text_red'>"+row.F15004+"%</span>";
                        } else {
                            htm += "<br><span class='text_S text_blue'>"+row.F15004+"%</span>"; /* ETF관련지수등락율 */
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
                        if (data >= 0) {
                                htm = "<span class='align_r text_red'>"+data + "</span>";
                        } else {
                                htm = "<span class='align_r text_blue'>"+data + "</span>";
                        }      
                        return htm;                   
                    },
                    "targets": [3]
                },
                {
                    "render": function ( data, type, row ) {
                        let htm = "<div class='tooltip'><button type='button' id='btnIndexDetail' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:70px;'>지수정보</span></div>";                            
                        return htm;
                    },
                    "targets": 9
                }
            ],              
            columns: [
                { "data": "F16002", "orderable": true, className:"txt_left line2"}, /*종목*/
                { "data": 'F15001', "orderable": true }, /*현재가*/
                { "data": 'F15009', "orderable" : true}, /*전일가*/
                { "data": 'daily', "orderable" : true }, /*Daily*/
                { "data": '1week', "orderable" : true}, /*1Week*/
                { "data": '1month', "orderable" : true}, /*1Month*/
                { "data": 'ytd', "orderable" : true}, /*YTD*/
                { "data": '1year', "orderable" : true}, /*1Year*/
                { "data": '3year', "orderable" : true}, /*3Year*/
                { "data": null, "orderable" : true, defaultContent:""},
            ]
        }); 

        // 테이블별 이벤트
        $('#krxIndexTable tbody').on('click', 'button', function (e) {
            e.stopImmediatePropagation();

            var table = $('#krxIndexTable').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btnIndexDetail') {
                vm.fn_movePage( data );
            }

            return  false; 
        });


        fnGuideIndexTable = $('#fnGuideIndexTable').DataTable( {
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
            "columnDefs": [
                {  
                    "render": function ( data, type, row ) {
                        let htm = "<span>";
                        htm += "           <b>"+data+"</b>";
                        htm += "            <br><span class='text_s'>"+row.F16013+"</span>";
                        if (row.NEW_YN == "Y") {
                            htm += "<span><div class='text_new'>new</div></span>";
                        }
                        htm += "        </span>";
                        return htm;
                    },
                    "targets": 0
                },
                {  
                    "render": function ( data, type, row ) {

                        let htm = ""
                            
                        htm += util.formatNumber(data);

                        if (row.F15004 >= 0) {
                            htm += "<br><span class='text_S text_red'>"+row.F15004+"%</span>";
                        } else {
                            htm += "<br><span class='text_S text_blue'>"+row.F15004+"%</span>"; /* ETF관련지수등락율 */
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
                        if (data >= 0) {
                                htm = "<span class='align_r text_red'>"+data + "</span>";
                        } else {
                                htm = "<span class='align_r text_blue'>"+data + "</span>";
                        }      
                        return htm;                   
                    },
                    "targets": [3]
                },
                {
                    "render": function ( data, type, row ) {
                        let htm = "<div class='tooltip'><button type='button' id='btnIndexDetail'  class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:70px;'>지수정보</span></div>";                            
                        return htm;
                    },
                    "targets": 9
                }
            ],                                    
            columns: [
                { "data": "F16002", "orderable": true, className:"txt_left line2"}, /*종목*/
                { "data": 'F15001', "orderable": true }, /*현재가*/
                { "data": 'F15009', "orderable" : true}, /*전일가*/
                { "data": 'daily', "orderable" : true }, /*Daily*/
                { "data": '1week', "orderable" : true}, /*1Week*/
                { "data": '1month', "orderable" : true}, /*1Month*/
                { "data": 'ytd', "orderable" : true}, /*YTD*/
                { "data": '1year', "orderable" : true}, /*1Year*/
                { "data": '3year', "orderable" : true}, /*3Year*/
                { "data": null, "orderable" : true},
            ]
        });

        // 테이블별 이벤트
        $('#fnGuideIndexTable tbody').on('click', 'button', function (e) {
            e.stopImmediatePropagation();

            var table = $('#fnGuideIndexTable').DataTable();
            var data = table.row($(this).parents('tr')).data();

            if ($(this).attr('id') == 'btnIndexDetail') {
                vm.fn_movePage( data );
            }

            return  false;
        });
    },
    created: function() {},
    beforeDestroy() {},
    methods: {

        getMarketIndexList: function() {
            console.log("getMarketIndexList");
            var vm = this;
            var idx = 0;

            vm.$emit('showProgress', true);
            axios.get(Config.base_url + "/user/marketinfo/getMarketIndexList", {
                    params: {
                       
                    }
            }).then(function(response) {
                console.log(response);
                if (response.data.success == false) {
                    alert("해당 종목이 없습니다");
                } else {
                    vm.marketRepList = response.data.marketRepList;
                    vm.graphinfos = response.data.graphinfos;
                    vm.krsLists = response.data.krsLists[0];
                    vm.fnGuideLists = response.data.fnGuideLists[0];
                   
                    vm.krxTotalPage = vm.krsLists.length;
                    vm.fnTotalPage = vm.fnGuideLists.length;

                    // KRX INDEX DRAW (페이지 크기만큼만 잘라내어 보여 준다.)
                    if (vm.krxTotalPage > 0) {
                        krxIndexTable.clear().draw();
                        krxIndexTable.rows.add(vm.getSliceData(vm.krsLists, 'krx')).draw();
                    }
                    // FNGUIDE INDEX DRAW
                    if (vm.fnTotalPage > 0) {
                        fnGuideIndexTable.clear().draw();
                        fnGuideIndexTable.rows.add(vm.getSliceData(vm.fnGuideLists, 'fn')).draw();
                    }

                    /*구글 챠트 사용 하지 않음 차후 사용 가능성이 있어 그대로 둠*/
                    /*var idx = 0;
                    for (let marketInfo of vm.marketRepList) {
                        vm.$nextTick().then(() => {
                            vm.Indexchart(marketInfo.f16013 + marketInfo.market_id, vm.graphinfos[idx]);

                            idx++;
                        });
                    }*/
                }
                vm.$emit('showProgress', false);
            });
        },
        
        getDataSet: function(idx) {
            var vm = this;
            var graphinfo = vm.graphinfos[idx];
            var items = [];
            for (let item of graphinfo) {
                items.push([item.trd_his, item.close_idx]);
            }

            return items;
        },
        Indexchart: function(id, graphinfo) {
            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});


            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart(id, graphinfo));

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
      
            function drawChart(id, graphinfo) {
                
                
                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'date');
                data.addColumn('number', "");


                // Set chart options
                var options = {'title':'',
                            'width':'100%',
                            'height':'100%',
                            'colors': ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
                            'hAxis':{
                                format:'yyyy-MM-dd HH:mm:ss',
                                textStyle: {
                                    color:'#ffffff'
                                },
                                gridlines: {
                                    color:'#ffffff'
                                }
                            },
                            'vAxis':{
                                format:'decimal',
                                textStyle: {
                                    color:'#ffffff'
                                },
                                gridlines: {
                                    color:'#ffffff'
                                }
                            }, 

                            'legend': {
                                position: 'left',
                                color: '#ffffff'
                            }
                };
 
                
                    
                var items = [] 

                for (let item of graphinfo) {
                    items.push([item.trd_his, item.close_idx]);
                }

                data.addRows(
                    items
                );

                // Instantiate and draw our chart, passing in some options.
                
                var chart = new google.visualization.AreaChart(document.getElementById(id));
                chart.draw(data, options);
            }
        },
        getSliceData: function(items, gubun) {
            var vm = this;
            var curPage = 0;
            if (gubun == "krx") {
                curPage = vm.pageLength + vm.krxCurrentPage;
                if (items != null) {
                    if (curPage <= items.length) {
                        vm.krxCurrentPage = curPage;
                        return _.slice(items, 0, curPage);
                    } else {
                        if (vm.krxCurrentPage < items.length) {
                            vm.krxCurrentPage = items.length;
                            return _.slice(items, 0, curPage);
                        } else {
                            return null;
                        }
                    }
                }
            } else if (gubun == "fn") {
                curPage = vm.pageLength + vm.fnCurrentPage;
                if (items != null) {
                    if (curPage <= items.length) {
                        vm.fnCurrentPage = curPage;
                        return _.slice(items, 0, curPage);
                    } else {            
                        if (vm.fnCurrentPage < items.length) {
                            vm.fnCurrentPage = items.length;
                            return _.slice(items, 0, curPage);
                        } else {
                            return null;
                        }
                        return null;
                    }
                }
            } 
        }, 

        moreData: function(gubun) {
            var vm = this;

            if (gubun == "krx") {
                // KRX INDEX DRAW (페이지 크기만큼만 잘라내어 보여 준다.)
                var items = vm.getSliceData(vm.krsLists, gubun);
                if (items != null) {
                    krxIndexTable.clear().draw();
                    krxIndexTable.rows.add(items).draw();
                }
            } else if (gubun == "fn") {
                // FNGUIDE INDEX DRAW
                var items = vm.getSliceData(vm.fnGuideLists, gubun);
                if (items != null) {
                    fnGuideIndexTable.clear().draw();
                    fnGuideIndexTable.rows.add(items).draw();
                }
            }
        },
        formatNumber:function(num) {
            return util.formatNumber(num);
        },

        /*
         *  그리드에서 차트이미지 선택시 인덱스 상세 팝업창을 띄운다. ( IndexInfoMain.vue -> emit )
         *  2019-04-16  bkLove(촤병국)
         */
        fn_movePage: function( data ) {
            this.$emit('showDetail', 2, data);
        },
    }
};
</script>
