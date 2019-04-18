<template>
<v-card>
                       
 <v-card flat>
    <!--table id="etf_grid" class="display" style="width:100%;">
        <thead>
            <tr>
                <th><input type='checkbox' class="selectAll select-checkbox" color='primary'  label='' value=''></th>
                <th>ID</th>
                <th>종목/지수명</th>
            </tr>
        </thead>   
    </table-->
  </v-card>

    <!--비교자산 탭end--->
    <v-card class="pop_btn_w text-xs-center">
        <v-btn depressed color="primary" @click="selectData()" >추가하기</v-btn>
    </v-card>
</v-card>
</template>


<script>
import $      from 'jquery'
import dt      from 'datatables.net'
import buttons from 'datatables.net-buttons'
import select from 'datatables.net-select'
import Config from '@/js/config.js'
var etf_grid = null;
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
           
            if ($(this).is( ":checked" )) {
                etf_grid.rows().select();        
            } else {
                etf_grid.rows().deselect(); 
            }
        });
    },
    methods: {
        getInfoIndexList: function() {
            console.log("getEtfList");
            axios.get(Config.base_url + "/user/index/getETFList", {
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

                        etf_grid = $('#etf_grid').DataTable( {
                            "processing": true,
                            "serverSide": false,
                            "search": true,
                            scrollY:        '50vh',
                            scrollCollapse: true,
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
                                style:    'multi',
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

        selectData: function() {
           

            console.log("data=" + etf_grid.rows( { selected: true } ).count());
            var data = etf_grid.rows( { selected: true } ).data();
           
            this.$emit("selectedItem", data);

            etf_grid.rows().deselect(); 

        }
    }
  }
</script>
