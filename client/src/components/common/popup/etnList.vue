<template>
  <v-card flat>
    <!-- 
  <v-card-title >
    <v-text-field class="pt-0" v-model="search" v-on:keyup="filterData" append-icon="search" label="Search" single-line hide-details></v-text-field>
  </v-card-title>
    -->
    <v-card flat>
      <table id="etn_grid" class="tbl_type" style="width:100%;">
        <colgroup>
          <col width="15%" />
          <col width="30%" />
          <col width="55%" />
        </colgroup>
        <thead>
          <tr>
            <th>
              <!--input type='checkbox' class="selectAll " color='primary'  label='' value=''-->
            </th>
            <th class="txt_left">ID</th>
            <th class="txt_left">종목/지수명</th>
          </tr>
        </thead>
      </table>
    </v-card>
    <v-card class="pop_btn_w text-xs-center">
      <v-btn depressed color="primary" @click="selectData()">추가하기</v-btn>
    </v-card>
  </v-card>
</template>

<script>
  import $ from 'jquery'
  import dt from 'datatables.net'
  import select from 'datatables.net-select'
  import _ from "lodash";
  import Config from '@/js/config.js'
  var etn_grid = null;
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
      vm.$EventBus.$on('fn_etnFilterData', data => {
        vm.search = data;
        vm.filterData();
      });
    },
    beforeDestroy() {
      var vm = this;
      vm.$EventBus.$off('fn_etnFilterData');
    },
    mounted: function() {
      var vm = this;
      vm.getEtnList();
      $('.selectAll').on('click', function() {
        if($(this).is(":checked")) {
          etn_grid.rows().select();
        } else {
          etn_grid.rows().deselect();
        }
      });
    },
    methods: {
      getEtnList: function() {
        // this.results = this.$store.state.etnmast;
        // console.log("getEtnList.....................");
        // console.log(this.results);
        if(!$.fn.dataTable.isDataTable('#etn_grid')) {
          etn_grid = $('#etn_grid').DataTable({
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
              "data": "F16013",
              "orderable": true,
              className: 'txt_left'
            }, {
              "data": "F16002",
              "orderable": true,
              className: 'txt_left'
            }, ]
          });
        }
      },
      selectData: function() {
        console.log("data=" + etn_grid.rows({
          selected: true
        }).count());
        var data = etn_grid.rows({
          selected: true
        }).data();
        this.$emit("selectedItem", data, 1);
        etn_grid.rows().deselect();
      },
      filterData: function() {
        var vm = this;
        vm.search = vm.search.toUpperCase();
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
            var cdIdx1 = o.F16012.indexOf(vm.search);
            if(nmIdx > -1 || cdIdx > -1 || cdIdx > -1) {
              return true;
            } else {
              return false;
            }
          });
          etn_grid.clear().draw();
          etn_grid.rows.add(filterData).draw();
        }, 1000);
      }
    }
  }
</script>