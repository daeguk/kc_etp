<template>

<v-card>
    <v-card-title>
        <v-text-field v-model="search" v-on:change="filterData" append-icon="search" label="Search" single-line hide-details></v-text-field>
    </v-card-title>                       
 <v-card flat>
    <table id="etf_grid" class="display" style="width:100%;">
        <thead>
            <tr>
                <th><input type='checkbox' class="selectAll select-checkbox" color='primary'  label='' value=''></th>
                <th>ID</th>
                <th>종목/지수명</th>
            </tr>
        </thead>   
    </table>
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
import _ from "lodash";
import Config from '@/js/config.js'
var etf_grid = null;
  export default {
    data () {
      return {
        search: '',
        resultes: [
        ]
      }
    }, 
    components: {},
    computed: {
        
    },
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

                        if (!$.fn.dataTable.isDataTable( '#etf_grid' ) ) {
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
                    }
                   
                });
        }, 

        selectData: function() {
           

            console.log("data=" + etf_grid.rows( { selected: true } ).count());
            var data = etf_grid.rows( { selected: true } ).data();
           
            this.$emit("selectedItem", data, 1);

            etf_grid.rows().deselect(); 

        },

        filterData: function() {
            var vm = this;
        
            var filterData = _.filter(vm.results, function(o) { 

                var nmIdx = o.JISU_NM.indexOf(vm.search);
                var cdIdx = o.JISU_CD.indexOf(vm.search);

                if (nmIdx > -1 || cdIdx > -1) {
                    return true; 
                } else {
                    return false;
                }
            });

            etf_grid.clear().draw();
            etf_grid.rows.add(filterData).draw();           
        }

    }
  }
</script>
