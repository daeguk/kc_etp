import $ from 'jquery'
import Config from "@/js/config.js";
/* 비중정보 그리드 데이터 인스턴스 ID */
var importance_grid = null;
/*
 *  Index 에서 사용할 공통 함수 정보
 *  2019-04-29  bkLove(촤병국)
 */
export const index_common = {
  methods: {
    /*
     * 비중정보 그리드 데이터를 조회한다.
     *
     *  [파라미터 인자 정보]
     *  param   paramData.jisu_cd       지수코드
     *  param   paramData.market_id     market_id
     * 
     *  [함수 호출시 필수 정보]
     *  importance_grid_id  :   그리드 ID (필수)
     *  results             :   그리드 데이터 array
     *  importance_cnt      :   건수
     * 
     *  2019-04-29
     */
    getIndexImportanceList: function(paramData) {
      var vm = this;
      console.log("getIndexImportanceList");
      axios.get(Config.base_url + "/user/index/getIndexImportanceList", {
        params: {
          jisu_cd: paramData.jisu_cd,
          market_id: paramData.market_id
        }
      }).then(response => {
        // console.log(response);
        if(response.data.success == false) {
          alert("비중 목록이 없습니다");
        } else {
          var items = response.data.results;
          //console.log("response=" + JSON.stringify(items));
          this.results = items;
          this.importance_cnt = this.results.length;
          // 차트 호출
          this.importance_chart(items);
          if(importance_grid) {
            importance_grid.destroy()
          }
          importance_grid = $('#' + vm.importance_grid_id).DataTable({
            "processing": true,
            "serverSide": false,
            "info": false, // control table information display field
            "stateSave": true, //restore table state on page reload,
            "lengthMenu": [
              [10, 20, 50, -1],
              [10, 20, 50, "All"]
            ],
            scrollY: '500px',
            scrollCollapse: true,
            select: {
              style: 'multi',
              selector: 'td:first-child'
            },
            paging: false,
            searching: false,
            data: this.results,
            columns: [{
              "data": "ISIN_CODE",
              "orderable": true
            }, {
              "data": "JONG_NM",
              "orderable": true
            }, {
              "data": "PERCNT",
              "orderable": true
            }, {
              "data": "GUBUN",
              "orderable": true
            }, ]
          });
        }
      });
    },
    /*
     *  비중정보 차트 데이터를 조회한다.
     *
     *  [파라미터 인자 정보]
     *  param
     * 
     *  [함수 호출시 필수 정보]
     *  importance_chart_id   :   차트 DIV 의 ID (필수)
     * 
     *  2019-04-29
     */
    importance_chart: function(results) {
      var vm = this;
      // Load the Visualization API and the corechart package.
      google.charts.load('current', {
        'packages': ['corechart']
      });
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
        var options = {
          'title': '',
          'width': '700',
          'height': '350',
          'colors': ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde', '#B6B8BA', '#7E8083', '#FBB040', '#F58025', '#EDED8A'],
          'legend': {
            position: 'right',
            color: '#ffffff',
          },
          'lineWidth': 5
        };
        var items = []
        for(let item of results) {
          if(items.length >= 10) break;
          items.push([item.JONG_NM, Number(item.PERCNT)]);
        }
        data.addRows(items);
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById(vm.importance_chart_id));
        chart.draw(data, options);
      }
    },
  },
}