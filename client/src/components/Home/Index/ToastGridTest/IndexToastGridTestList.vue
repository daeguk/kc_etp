<template>
  <div>
    <h2> Toast 그리드 테스트 </h2>
    <grid :rowData="rows" :columnData="columns" />
  </div>
</template>

<script>
import Config from "@/js/config.js"

import 'tui-grid/dist/tui-grid.css'
import { Grid } from '@toast-ui/vue-grid'


export default {
  props: [],
 
  components: {
      'grid': Grid
  },
  data() {
      return {
          rows: [ // for rowData prop
              {
                  name: 'Beautiful Lies',
                  artist: 'Birdy'
              },
              {
                  name: 'X1111',
                  artist: 'Ed Sheeran'
              }
          ],
          columns: [ // for columnData prop
              {
                  title: 'Name',
                  name: 'name',
              },
              {
                  title: 'Artist',
                  name: 'artist'
              }
          ]
      }
  },
  computed:{
    
  },
  mounted: function() {
     this.getIndexToastGridTestList();
  },
  created: function() {
   

  },
  beforeDestroy() {
      
  },
  methods: {
    getIndexToastGridTestList: function() {
      console.log('getIndexToastGridTestList');
      var vm = this;

      axios.get(Config.base_url+'/user/index/getIndexToastGridTestList', {
          params: {
              // "bbs_id" : vm.bbs_id,
              // "seloption" : vm.seloption,
              // "searchinfo" : vm.searchinfo,
              // "curPage": vm.curPage,
              // "perPage": vm.perPage
          }
      }).then(function(response) {
/*        
          console.log(response);
          if(response.data.success == false){
              alert("해당 신청현황이 없습니다");
          }else {
            var items = response.data.results;
            var tcount   = response.data.count;
            items.forEach(function(item, index) {
              if(item.kor_for_type == 'K') {
                item.kor_for_type = "국내";
              }else if(item.kor_for_type == 'F') {
                item.kor_for_type = "해외";
              }else {
                item.kor_for_type = "";
              }

            });
            vm.results = items;
            vm.count = tcount;
          }
*/          
      });

    }
  }    
}
</script>

