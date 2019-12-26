<template>

<v-card>

 <!-- 비교자산 탭end -->
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
                <th></th>
            </tr>
        </thead>   
    </table>
    
  </v-card>

<v-card class="pop_btn_w text-xs-right">
        <v-btn depressed color="primary" @click="hideContextMenu()" @contextmenu.prevent="showContextMenu($event)">....</v-btn>
</v-card>

<template id="template-context-menu-item">
  <li class="context-menu-item">
    <slot></slot>
  </li>
</template>

<template id="template-context-menu">
  <ul id="context-menu">
    <li>      
       <v-btn depressed color="primary">테스트</v-btn>
    </li>
    <div class="tooltip">
        <button    id="btnIndexFix" type="button" class="btn_icon v-icon material-icons" >insert_comment</button>
        <span class="tooltiptext" style="width:70px;" >지수조치내역</span>
    </div>

    <div class="tooltip">
        <button    id="btnIndexError" type="button" class="btn_icon v-icon material-icons" >assignment_turned_in</button>
        <span class="tooltiptext" style="width:70px;" >지수오류내역</span>
    </div>    
  </ul>
</template>

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
        on: false,
        search: '',       
        results: [
        ],
        contextMenuWidth: null,
        contextMenuHeight: null
      }
    }, 
    components: {
    },
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {
        var vm = this;
        vm.getInfoIndexList();

        
        $('#jisu_grid, tbody').on('click', "input[name='calcu']", function (event) {
            //var data = table.row($(this).parents('tr')).data();

            var cal = $("input[name='calcu']")
            var sum = 0;
            for (let i = 0; i < cal.length; i++) {
                    sum += Number(cal.eq(i).val());
            }

            console.log("sum==" + sum);
       
        });
        

        $('#jisu_grid, tbody').on('click', 'tbody button', function (event) {
            //var data = table.row($(this).parents('tr')).data();
            vm.hideContextMenu(event);    
           //  vm.hideContextMenu(event);
           
        });

        $('#jisu_grid, tbody').on('contextmenu', 'tbody button', function (event) {
            //var data = table.row($(this).parents('tr')).data();
        
            event.preventDefault();
            vm.showContextMenu(event);           
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
                                    { "data": null, "orderable" : true, defaultContent:"<div class='tooltip'><button type='button' id='btn_context' class='btn_icon v-icon material-icons'>equalizer</button><span class='tooltiptext' style='width:40px;'>INDEX</span></div>"},
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

        showContextMenu: function(e) {
            
            var menu = document.getElementById("context-menu");
            if(!this.contextMenuWidth || !this.contextMenuHeight) {
                menu.style.visibility = "hidden";
                menu.style.display = "block";
                this.contextMenuWidth = menu.offsetWidth;
                this.contextMenuHeight = menu.offsetHeight;
                menu.removeAttribute("style");
            }
            if((this.contextMenuWidth + e.pageX) >= window.innerWidth) {
                menu.style.left = (e.pageX - this.contextMenuWidth) + "px";
            } else {
                var left = e.pageX - 150;
                menu.style.left = left + "px";
            }

            if((this.contextMenuHeight + e.pageY) >= window.innerHeight) {
                menu.style.top = (e.pageY - this.contextMenuHeight) - 50 + "px";
            } else {
                var top = e.pageY - 50;
                menu.style.top = top + "px";
            }
            
            menu.classList.add('active');

        },
        hideContextMenu: function() {
            document.getElementById("context-menu").classList.remove('active');
        }
        
    }
  }
</script>

<style>
#context-menu {
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  display: none;
  list-style: none;
  position: absolute;
  z-index: 2147483647;
  background-color: white;
  border: 1px solid #ebebeb;
  border-bottom-width: 0px;
}

#context-menu.active {
  display: block;
}

.context-menu-icon {
  top: 1px;
  position: relative;
  margin-right: 10px;
}

.context-menu-item {
  display: flex;
  cursor: pointer;
  padding: 8px 15px;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
}

.context-menu-item:hover {
  background-color: #ebebeb;
}
</style>
