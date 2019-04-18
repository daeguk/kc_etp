<template>
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
      <td class="text-xs-center">{{ props.item.ISU_KOR_ABBRV }}</td>
      <td class="text-xs-left">{{ props.item.ISIN_CODE }}</td>
      <td class="text-xs-left">{{ props.item.ISU_SRT_CD }}</td>
      <td class="text-xs-left">{{ props.item.UPDATE_DATE }}</td>
      <td class="text-xs-left">{{ props.item.NAME_K }}</td>
      <td class="text-xs-center">{{ props.item.SYM_CODE }}</td>
      <td class="text-xs-center">{{ props.item.EX_RATE_CODE }}</td>
    </template>
  </v-data-table>
</template>

<script>
import Config       from "@/js/config.js"

export default {
  props: [],
  data() {
    return {
      rowsPerPageItems: [20, 10, 30, 50],
      headers: [
        { text: 'No', align:"center", sortable: false, value: 'index'},
        { text: '종목명', align:"center", value: 'ISU_KOR_ABBRV'},
        { text: '표준코드', align:"center", value: 'ISIN_CODE' },
        { text: '단축코드', align:"left", value: 'ISU_SRT_CD' },
        { text: '상장일자', align:"left", value: 'UPDATE_DATE' },
        { text: '기초지수', align:"center", value: 'NAME_K' },
        { text: '기초지수코드', align:"left", value: 'SYM_CODE' },
        { text: '환율', align:"left", value: 'EX_RATE_CODE' },
      ],
      results: [],
    };
  },
  components: {
      
  },
  computed:{

  },
  mounted: function() {
      //this.getEtnForList();
  },
  created: function() {
      
  },
  beforeDestroy() {
      
  },
  methods: {
    getEtnForList: function() {
      console.log('getEtfForList');
      var vm = this;

      axios.get(Config.base_url+'/user/marketinfo/getetnforlist', {
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
              alert("해당 종목이 없습니다");
          }else {
            var items = response.data.results;
            var tcount   = response.data.count;
            // items.forEach(function(item, index) {
            //   if(item.kor_for_type == 'K') {
            //     item.kor_for_type = "국내";
            //   }else if(item.kor_for_type == 'F') {
            //     item.kor_for_type = "해외";
            //   }else {
            //     item.kor_for_type = "";
            //   }
            // });
            vm.results = items;
            vm.count = tcount;
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
