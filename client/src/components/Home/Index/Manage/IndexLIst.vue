<template>
<div>
  <v-card flat>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Index List | </h3>
      </div>
    </v-card-title>
  </v-card>
  <IndexInfoModal v-if="modalFlag" :modalFlag="modalFlag"></IndexInfoModal>
  <v-data-table 
    :headers="headers"
    :items="results"
    :rows-per-page-items="rowsPerPageItems"
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
<!--        
        <v-btn color="primary" dark @click.stop="showIndexInfoModal()">
          <v-icon>equalizer</v-icon>
        </v-btn>
-->        
        <v-icon @click.stop="showIndexInfoModal(pros.item)">equalizer</v-icon>
      </td>
    </template>
  </v-data-table>
</div>    
</template>

<script>
import Config       from "@/js/config.js"
import IndexInfoModal   from  './IndexInfoModal.vue'

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
  components: {
    IndexInfoModal: IndexInfoModal,
  },
  created: function() {
      this.$EventBus.$on('closeIndexInfoModal', this.closeIndexInfoModal);
  },
  beforeDestroy() {
      this.$EventBus.$off('closeIndexInfoModal');
  },    
  mounted: function() {
      //this.getInfoOpenReqList();
  },
  methods: {
    getIndexInfoManageList: function() {
      console.log('getIndexInfoManageList');
      var vm = this;

      axios.get(Config.base_url+'/user/index/getindexinfomanagelist', {
          params: {
              "instCd": "FNGUIDE"
          }
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
    showIndexInfoModal: function(item) {
      this.modalFlag = true;
    },
    closeIndexInfoModal: function() {
      this.modalFlag = false;
    }
      
  }
}
</script>
<style scoped>
  table.v-table tbody td, table.v-table tbody th {
      height: 30px;
  }

</style>
