
<template>
<div>
  <v-container fluid grid-list-md pa-0 mt-4 mb-4>
  <v-layout row wrap>
    <v-flex > 
        <v-data-table 
          :headers="headers"
          :items="results"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.user_id }}</td>
            <td class="text-xs-center">{{ props.item.inst_name }}</td>
            <td class="text-xs-center">{{ props.item.user_name }}</td>
            <td class="text-xs-center">{{ props.item.idx_nm }}</td>
            <td class="text-xs-center">{{ props.item.idx_sym_code }}</td>
            <td class="text-xs-center">{{ props.item.req_date }}</td>
            <td class="text-xs-center">3</td>
            <td class="text-xs-center">
 
              <v-icon @click.stop="showIndexInfoModal(pros.item)">equalizer</v-icon>
            </td>
          </template>
        </v-data-table>
    </v-flex>
  </v-layout>
  <v-layout row wrap>
    <v-flex md3> 
      <div id="chart_div"></div>
    </v-flex>
  </v-layout>
  </v-container>
</div>    
</template>





<script>
import Config       from "@/js/config.js"
export default {
  props: [],
  data() {
    return {
      results: [],
      rowsPerPageItems: [20, 10, 30, 50],
      headers: [
        {text: 'ID', align:"center", sortable: false, value: 'id' },
        {text: '지수명', align:"center", sortable: false, value: 'inst_name'},
        {text: '등록일', align:"center", sortable: false, value: 'user_name'},
        {text: '발표여부', align:"center", value: 'idx_nm' },
        {text: '산출타입', align:"center", value: 'idx_sym_code' },
        {text: 'ETP', align:"center", value: 'req_date' },
        {text: '정보조회기관', align:"center", value: 'req_process' },
        {text: '', align:"center", value: 'index_info' },
      ],
      modalFlag: false,
    };
  },
  mounted: function() {
      this.getBluList();
      this.chartTest();
  },
  methods: {
    getBluList: function() {
      console.log('getBluList');
      var vm = this;

      axios.post(Config.base_url+'/user/index/getBlueList', {
          
              "instCd": "FNGUIDE"
          
      }).then(function(response) {
          // console.log(response);
          if(response.data.success == false){
              alert("해당 신청현황이 없습니다");
          }else {
            var items = response.data.results;
            var tcount   = response.data.count;
            vm.results = items;
            vm.count = tcount;
          }
      });
    },
    chartTest: function() {
      // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    }
  },
  showIndexInfoModal: function(item) {
      this.modalFlag = true;
  },
  closeIndexInfoModal: function() {
      this.modalFlag = false;
  }
}
</script>
