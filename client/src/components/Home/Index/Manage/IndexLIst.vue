<template>
    <v-container>
        <v-layout row wrap class="content_margin">
            <v-flex grow>
                <v-card flat>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">
                                Index List |
                                <span class="grey--text">total 363 index</span>
                            </h3>
                        </div>
                    </v-card-title>
                </v-card>
                <v-data-table :headers="headers" :items="desserts" class="table_line1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-center">{{ props.item.calories }}</td>
                        <td class="text-xs-center">{{ props.item.fat }}</td>
                        <td class="text-xs-center">{{ props.item.carbs }}</td>
                        <td class="text-xs-center">{{ props.item.protein }}</td>
                        <td class="text-xs-center">
                            <v-flex xs12 sm3 center>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            flat
                                            icon
                                            color="blue"
                                            to="/index/manage/IndexListdetail"
                                             dark v-on="on"
                                        >
                                            <v-icon>equalizer</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>지수정보</span>
                                </v-tooltip>
                            </v-flex>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: [],

    data() {
        return {
            headers: [
                {
                    text: "Dessert (100g serving)",
                    align: "left",
                    sortable: false,
                    value: "name"
                },
                { text: "Calories", value: "calories" },
                { text: "Fat (g)", value: "fat" },
                { text: "Carbs (g)", value: "carbs" },
                { text: "Protein (g)", value: "protein" },
                { text: "Iron (%)", value: "iron" }
            ],

            desserts: [
                {
                    name: "Frozen Yogurt",
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: "1%"
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                    iron: "1%"
                },
                {
                    name: "Eclair",
                    calories: 262,
                    fat: 16.0,
                    carbs: 23,
                    protein: 6.0,
                    iron: "7%"
                },
                {
                    name: "Cupcake",
                    calories: 305,
                    fat: 3.7,
                    carbs: 67,
                    protein: 4.3,
                    iron: "8%"
                },
                {
                    name: "Gingerbread",
                    calories: 356,
                    fat: 16.0,
                    carbs: 49,
                    protein: 3.9,
                    iron: "16%"
                },
                {
                    name: "Jelly bean",
                    calories: 375,
                    fat: 0.0,
                    carbs: 94,
                    protein: 0.0,
                    iron: "0%"
                },
                {
                    name: "Lollipop",
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: "2%"
                },
                {
                    name: "Honeycomb",
                    calories: 408,
                    fat: 3.2,
                    carbs: 87,
                    protein: 6.5,
                    iron: "45%"
                },
                {
                    name: "Donut",
                    calories: 452,
                    fat: 25.0,
                    carbs: 51,
                    protein: 4.9,
                    iron: "22%"
                },
                {
                    name: "KitKat",
                    calories: 518,
                    fat: 26.0,
                    carbs: 65,
                    protein: 7,
                    iron: "6%"
                }
            ]
        };
    },
    components: {},
    computed: {},
    created: function() {},
    beforeDestroy() {},
    mounted: function() {},
    methods: {}
};
</script>
<style scoped>
</style>



<!--

<template>
<v-container grid-list-md>
    <v-layout row wrap>
      <v-flex grow  ma-3>
        <v-card flat>
        <v-card flat>
          <v-card-title primary-title>
        <div>
        <h3 class="headline mb-0">Index List | <span>total: 163 indexs</span></h3>
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
<!--   
        <v-icon @click.stop="showIndexInfoModal(pros.item)">equalizer</v-icon>
      </td>
    </template>
  </v-data-table>
        </v-card>
      </v-flex>
 </v-layout>
</v-container>
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
