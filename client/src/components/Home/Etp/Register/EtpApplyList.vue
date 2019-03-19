<template>
<div>
  <div class="title-main">
     <h2>ETP 신청현황 <span class="title-sub"> | 코스콤에 신청하신 ETP목록 및 ETP별 진행 상태를 확인할 수 있습니다.</span></h2> 
  </div>
  <v-btn color="blue darken-3" class="white--text ml-0 pl-5 pr-5">신청 : 12건</v-btn>
  <v-btn color="blue darken-2" class="white--text ml-0 pl-5 pr-5">지수입수 : 6건</v-btn>
  <v-btn color="blue darken-1" class="white--text ml-0 pl-5 pr-5">지수분배 : 0건</v-btn>
  <v-btn color="teal lighten-1" class="white--text ml-0 pl-5 pr-5">종목코드신청 : 0건</v-btn>
  <v-btn color="teal lighten-3" class="white--text ml-0 pl-5 pr-5">iNAV산출 : 4건</v-btn>

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
      <td class="text-xs-center">{{ props.item.inst_name }}</td>
      <td class="text-xs-left">{{ props.item.isu_kor_nm }}</td>
      <td class="text-xs-left">{{ props.item.req_date }}</td>
      <td class="text-xs-left">{{ props.item.kor_for_type }}</td>
      <td class="text-xs-center">{{ props.item.basic_idx }}</td>
      <td class="text-xs-left">{{ props.item.isu_eng_nm }}</td>
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
      rowsPerPageItems: [20, 10, 30, 50],
      headers: [
        { text: 'No', align:"center", sortable: false, value: 'index'},
        { text: '발행사', align:"center", value: 'inst_name'},
        { text: '종목명', align:"center", value: 'isu_kor_nm' },
        { text: '신청일', align:"left", value: 'req_date' },
        { text: '국내/해외', align:"left", value: 'kor_for_type' },
        { text: '기초지수', align:"center", value: 'basic_idx' },
        { text: '처리현황',  align:"center", value: 'isu_eng_nm' }
      ],
      results: [],
    };
  },
  components: {
      
  },
  computed:{

  },
  mounted: function() {
      this.getEtpApplyList();
  },
  created: function() {
      
  },
  beforeDestroy() {
      
  },
  methods: {
    getEtpApplyList: function() {
      console.log('getEtpApplyList');
      var vm = this;

      axios.get(Config.base_url+'/user/etp/getetpapplylist', {
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
