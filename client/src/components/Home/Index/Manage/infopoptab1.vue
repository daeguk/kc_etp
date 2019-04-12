<template>
 <v-card flat>
    
    

    <table id="jisu_grid" class="display" style="width:100%">
        <thead>
            <tr>
                <th><input  type='checkbox' class="selectAll"></input></th>
                <th>ID</th>
                <th>지수명</th>
            </tr>
        </thead>   
    </table>
  </v-card>
</template>


<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import select from 'datatables.net-select'
import Config from '@/js/config.js'
var jisu_grid = null;
  export default {
    data () {
      return {
        search: '',
        headers: [
        {
            text: '',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          {
            text: 'CODE',
            align: 'left',
            value: 'name1'
          },
          { text: '종목지수명', value: '종목지수명' },
          { text: '구분', value: '구분' },
        ],
        resultes: [
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

        $('.selectAll').on('click', function () {
            alert(this.className)
            if ($(this).is( ":checked" )) {
                jisu_grid.rows().select();        
            } else {
                jisu_grid.rows().deselect(); 
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

                        jisu_grid = $('#jisu_grid').DataTable( {
                            "processing": true,
                            "serverSide": false,
                            "search": true,
                            "info": true,   // control table information display field
                            "stateSave": true,  //restore table state on page reload,
                            "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                             "columnDefs": [
                             {  
                                'orderable': false,
                                'targets': 0,
                                'className': 'select-checkbox',
                            },],
                            select: {
                                style:    'os',
                                selector: 'td:first-child'
                            },
                            paging: false,
                            searching: false,
                            data : this.results,
                            columns: [
                                { "data": null, "defaultContent": ""},
                                { "data": "JISU_CD", "orderable": true },
                                { "data": "JISU_NM", "orderable" : true },
                            ]
                        }); 
                    }
                   
                });
        }, 
        getReplace: function(text) {
            if (text) {
                return text.replace(/,/gi,"</br>");
            }
        },
        movePage: function(jisu_cd, market_id) {
            this.$router.push({path: '/index/manage/IndexListdetail', query :{'jisu_cd':jisu_cd, 'market_id':market_id}});
        }

        
    }
  }
</script>
