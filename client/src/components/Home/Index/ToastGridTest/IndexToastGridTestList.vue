<template>
  <div>
    <h2> Toast 그리드 테스트 </h2>
    cnt={{count}}
    <grid :rowData="results" :columnData="columns" />
  </div>
</template>

<script>
import Config from "@/js/config.js"

import 'tui-grid/dist/tui-grid.css'
import { Grid } from '@toast-ui/vue-grid'

var startDt, endDt;

export default {
  props: [],
 
  components: {
      'grid': Grid
  },
  data() {
      return {
          count: 0,
          results: [],
          columns: [ // for columnData prop
              { title: '인덱스 코드'  , name: 'index_cd',  },
              { title: 'trd_dd'      , name: 'trd_dd'     },
              { title: 'open_idx'    , name: 'open_idx'   },
              { title: 'high_idx'    , name: 'high_idx'   },
              { title: 'low_idx'     , name: 'low_idx'    },
              { title: 'close_idx'   , name: 'close_idx'  },
              { title: 'fluc_idx'    , name: 'close_idx'  },
              { title: 'fluc_type'   , name: 'fluc_type'  },
              { title: 'trdvol'      , name: 'trdvol'     },
              { title: 'trdval'      , name: 'trdval'     }
          ]
      }
  },
  computed:{
    
  },
  mounted: function() {
//    startDt = new Date().getTime();

    console.time("## 측정 ##");
    new Promise( (resolve) => {
      this.getIndexToastGridTestList();
    }).then( (data) => {
      console.log(">>>>>>>>>>>");
//    endDt = new Date().getTime();

    console.timeEnd("## 측정 ##");
//    console.log( "소요시간=[" + ( ( endDt - startDt ) / 1000 ) + "]" );      
    })    
  },
  created: function() {

  },
  beforeDestroy() {

  },
  methods: {
    getIndexToastGridTestList: function() {
      console.log('getIndexToastGridTestList');
      var vm = this;

      console.time("## Toast DB 측정 ##");
      axios.get(Config.base_url+'/user/index/getIndexToastGridTestList', {
          params: {
              // "bbs_id" : vm.bbs_id,
              // "seloption" : vm.seloption,
              // "searchinfo" : vm.searchinfo,
              // "curPage": vm.curPage,
              // "perPage": vm.perPage
          }
      }).then(function(response) {
          console.log(response);
          if(response.data.success == false){
              alert("해당 신청현황이 없습니다");
          }else {
            var items = response.data.results;
            var tcount   = response.data.count;
/*            
            items.forEach(function(item, index) {
              if(item.kor_for_type == 'K') {
                item.kor_for_type = "국내";
              }else if(item.kor_for_type == 'F') {
                item.kor_for_type = "해외";
              }else {
                item.kor_for_type = "";
              }

            });
*/            
            vm.results = items;
            vm.count = tcount;

            console.log( "전체 출력 건수=[" + tcount + "]");

            console.timeEnd("## Toast DB 측정 ##");
          }
      });
    }
  }    
}
</script>

