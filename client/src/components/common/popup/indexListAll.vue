<template>
<v-card flat>
<!-- 
  <v-card-title>
    <v-text-field class="pt-0" v-model="search" v-on:keyup="filterData" append-icon="search" label="Search" single-line hide-details></v-text-field>
  </v-card-title>   
-->
  <v-card flat>
    <table id="jisu_grid1" class="tbl_type" style="width:100%">
      <colgroup>
        <col width="15%">
        <col width="55%">
        <col width="30%">
      </colgroup>
      <thead>
        <tr>
          <th><!--input  type='checkbox' class="selectAll select-checkbox"/--></th>
          <th class="txt_left">지수명</th>
          <th class="txt_left">ID</th>
        </tr>
      </thead>   
    </table>
  </v-card>
  <v-card class="pop_btn_w text-xs-center">
    <v-btn depressed color="primary" @click="selectData()" >추가하기</v-btn>
  </v-card>
</v-card>
</template>

<script>
  import $ from 'jquery'
  import dt from 'datatables.net'
  import select from 'datatables.net-select'
  import _ from "lodash";
  import Config from '@/js/config.js'
  var jisu_grid1 = null;
  export default {
    props: ["results"],
    data() {
      return {
        search: '',
        resultes: []
      }
    },
    components: {},
    computed: {},
    created: function() {
      var vm = this;
      vm.$EventBus.$on('fn_indexListAllFilterData', data => {
        vm.search = data;
        vm.filterData();
      });
    },
    beforeDestroy() {
      var vm = this;
      vm.$EventBus.$off('fn_indexListAllFilterData');
    },
    mounted: function() {
      var vm = this;
      vm.getInfoIndexList();
      $('.selectAll').on('click', function() {
        if($(this).is(":checked")) {
          jisu_grid1.rows().select();
        } else {
          jisu_grid1.rows().deselect();
        }
      });
    },
    methods: {
      getInfoIndexList: function() {
        //      this.results = this.$store.state.indexmast;
        if(!$.fn.dataTable.isDataTable('#jisu_grid1')) {
          jisu_grid1 = $('#jisu_grid1').DataTable({
            "processing": true,
            "serverSide": false,
            "search": true,
            scrollY: '50vh',
            scrollCollapse: true,
            "info": true, // control table information display field
            "stateSave": true, //restore table state on page reload,
            "lengthMenu": [
              [10, 20, 50, -1],
              [10, 20, 50, "All"]
            ],
            "columnDefs": [{
              'orderable': false,
              'targets': 0,
              'className': 'select-checkbox',
            }, ],
            select: {
              style: 'multi',
              selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            data: this.results,
            columns: [{
              "data": null,
              "defaultContent": "",
              "orderable": false
            }, {
              "data": "F16002",
              "orderable": true,
              className: 'txt_left'
            }, {
              "data": "F16013",
              "orderable": true,
              className: 'txt_left'
            }, ]
          });
        }
      },
      selectData: function() {
        var data = jisu_grid1.rows({
          selected: true
        }).data();
        this.$emit("selectedItem", data, 3);
        jisu_grid1.rows().deselect();
      },
      filterData: function() {
        var vm = this;
        var delay = (function() {
          var timer = 0;
          return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
          };
        })();
        delay(function() {
          var filterData = _.filter(vm.results, function(o) {
            var nmIdx = o.F16002.indexOf(vm.search);
            var cdIdx = o.F16013.indexOf(vm.search);
            if(nmIdx > -1 || cdIdx > -1) {
              return true;
            } else {
              return false;
            }
          });
          jisu_grid1.clear().draw();
          jisu_grid1.rows.add(filterData).draw();
        }, 1000);
      },
    }
  }
</script>