<template>
  <div>
    <v-data-table 
      :headers="headers"
      :items="results"
      :rows-per-page-items="rowsPerPageItems"
      dark
      disable-initial-sort
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.index+1 }}</td>
        <td class="text-xs-center">{{ props.item.index_cd }}</td>
        <td class="text-xs-left">{{ props.item.trd_dd }}</td>
        <td class="text-xs-left">{{ props.item.open_idx }}</td>
        <td class="text-xs-left">{{ props.item.high_idx }}</td>
        <td class="text-xs-center">{{ props.item.low_idx }}</td>
        <td class="text-xs-left">{{ props.item.close_idx }}</td>

        <td class="text-xs-left">{{ props.item.fluc_idx }}</td>
        <td class="text-xs-left">{{ props.item.fluc_type }}</td>
        <td class="text-xs-left">{{ props.item.trdvol }}</td>
        <td class="text-xs-left">{{ props.item.trdval }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Config       from "@/js/config.js"

export default {
  props: [],
  data() {
    return {
      rowsPerPageItems: [5000],
      headers: [
        { text: 'No'          , value: 'index'       , align:"center", sortable: false,},
        { text: '인덱스 코드'  , value: 'index_cd'    , align:"left",  sortable: true },
        { text: 'trd_dd'      , value: 'trd_dd'      , align:"left",  sortable: true },
        { text: 'open_idx'    , value: 'open_idx'    , align:"left",  sortable: true },
        { text: 'high_idx'    , value: 'high_idx'    , align:"left",  sortable: true },
        { text: 'low_idx'     , value: 'low_idx'     , align:"left",  sortable: true },
        { text: 'close_idx'   , value: 'close_idx'   , align:"left",  sortable: true },
        { text: 'fluc_idx'    , name: 'fluc_idx'    , align:"left",  sortable: true },
        { text: 'fluc_type'   , value: 'fluc_type'   , align:"left",  sortable: true },
        { text: 'trdvol'      , value: 'trdvol'      , align:"left",  sortable: true },
        { text: 'trdval'      , value: 'trdval'      , align:"left",  sortable: true }        
      ],
      results: [],
    };
  },
  components: {
      
  },
  computed:{

  },
  mounted: function() {
      this.getIndexVueTableTestList();
  },
  created: function() {
      
  },
  beforeDestroy() {
      
  },
  methods: {
    getIndexVueTableTestList: function() {
      console.log('getIndexVueTableTestList');
      var vm = this;

      console.time("## VueTable DB 측정 ##");

      axios.get(Config.base_url+'/user/index/getIndexVueTableTestList', {
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

            console.timeEnd("## VueTable DB 측정 ##");
          }
      });

    }
  }
}
</script>
<style scoped>
  table.v-table tbody td, table.v-table tbody th {
      height: 30px;
  }
  
  .title-main {
    margin: 10px 0px;
    padding: 0;
  }
  .title-sub {
    font-size: 12px;
    color: grey;
  }

  .v-toolbar__content, .v-toolbar__extension {
    margin: 0;
    padding: 0;
  }
</style>