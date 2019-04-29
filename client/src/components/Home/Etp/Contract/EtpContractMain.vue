<template>
<v-card>

 <!--비교자산 탭end--->
    <v-card class="pop_btn_w text-xs-right">
        <v-btn depressed color="primary" @click="addData()" >추가하기</v-btn>
    </v-card>
 <v-card flat>
    
    
     
    <table id="jisu_grid" class="display" style="width:100%">
        <thead>
            <tr>
                <th>ID</th>
                <th>지수명</th>
                <th>CU SHrs</th>
            </tr>
        </thead>   
    </table>
  </v-card>
     
</v-card>
</template>


<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import select from 'datatables.net-select'
import _ from "lodash";
import Config from '@/js/config.js'
var jisu_grid = null;
  export default {
    data () {
      return {
        search: '',       
        results: [
        ]
      }
    }, 
    components: {},
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        var vm = this;
        vm.getInfoIndexList();


        $('#jisu_grid, tbody').on('click', 'tbody td', function () {
            //var data = table.row($(this).parents('tr')).data();

            if ($(this).index() == 2) {
                var cal = $("input[name='calcu']")
                var sum = 0;
                for (let i = 0; i < cal.length; i++) {
                    sum += Number(cal.eq(i).val());
                }

                console.log("sum==" + sum);
            }
           
        });
        
       
    
    },
    methods: {
        getInfoIndexList: function() {
            console.log("getInfoIndexList");
            axios.get(Config.base_url + "/user/index/getInfoIndexList", {
                    params: {
                    }
                }).then(response => {
                    // console.log(response);
                    if (response.data.success == false) {
                        alert("관리지수 목록이 없습니다");
                    } else {
                        var items = response.data.results;
                        
                        //console.log("response=" + JSON.stringify(items));
                        this.results = items;
             
                        if (!$.fn.dataTable.isDataTable( '#jisu_grid' ) ) {
                            jisu_grid = $('#jisu_grid').DataTable( {
                                "processing": true,
                                "serverSide": false,
                                "search": true,
                                scrollY:        '50vh',
                                scrollCollapse: true,
                                "info": true,   // control table information display field
                                "stateSave": true,  //restore table state on page reload,
                                "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                              
                                select: {
                                    style:    'multi',
                                    selector: 'td:first-child'
                                },
                                paging: false,
                                searching: false,
                                data : this.results,
                                columns: [
                                    { "data": "JISU_CD", "orderable": true },
                                    { "data": "JISU_NM", "orderable" : true },
                                    { "data": "CU", "orderable" : true, defaultContent:"<input type='number' name='calcu' id='calcu'>"}, 
                                ]
                            }); 
                        }

                         
                    }
                   
                });
        }, 
        addData: function() {
            var vm = this;
            jisu_grid.row.add( {
                'JISU_CD':'',
                'JISU_NM':"<input type='number' name='jongmok' id='jongmok' style='width:150px'><button  id='confirm'>확인</button>",
                null:""
             } ).draw( false );
           
            $("button[id='confirm']").on('click', function () {
              
                var test = vm.getInfoIndex($("input[id='jongmok']").eq(0).val());
             
                vm.results.push({
                    ANNO_YN: "발표",
                    ETP_MARKET_ID: 168,
                    ETP_NM: null,
                    INDEX_CAL_METHOD: "시가총액방식",
                    INST_CNT: 1,
                    IP_DT: "2019-04-03",
                    JISU_CD: test.JISU_CD,
                    JISU_NM: "테스트",
                    LARGE_TYPE: "FNGUIDE",
                    MARKET_ID: "M168",
                    MIDDLE_TYPE: "FNGUIDE"
                });

                jisu_grid.clear().draw();
                jisu_grid.rows.add(vm.results).draw();

                //$("input[name='jongmok']").css("color", "red");
                
            }); 
        },
        
        getInfoIndex: function(jongmok) {
            return {
                'JISU_CD':'111',
                'JISU_NM':"<input type='number' name='jongmok' id='jongmok'><button  id='confirm'>확인</button>",
                'CU':"<input type='number' name='calcu' id='calcu' value='test'>"
             } 
        }, 
        
    }
  }
</script>
