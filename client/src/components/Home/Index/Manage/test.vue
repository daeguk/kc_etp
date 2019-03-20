
<template>
  <v-data-table 
    :headers="headers"
    :items="desserts"
    disable-initial-sort
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-center">{{ props.item.name }}</td>
      <td class="text-xs-center">{{ props.item.calories }}</td>
      <td class="text-xs-center">{{ props.item.fat }}</td>
      <td class="text-xs-center">{{ props.item.name }}</td>
      <td class="text-xs-center">{{ props.item.name }}</td>
      <td class="text-xs-center">{{ props.item.name }}</td>
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

    
</template>


<script>

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
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%'
        }
      ],
      modalFlag: false,
    };
  },
  
}
</script>
