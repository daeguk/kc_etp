<template>
  <v-container fluid grid-list-md pa-0 mb-4>
  <v-layout row wrap>
    <v-flex xs12> 
      <div class="indexinfo_box02 a1">
        <h4 class="mb-0">ETP Info</h4>
          <v-data-table 
          :headers="headers"
          :items="desserts"
          disable-initial-sort
          hide-actions
          >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>       
          </template>
        </v-data-table>
      </div>
   </v-flex>
   <v-flex xs12>
      <div class="indexinfo_box02 a2">
          <v-data-table 
          :headers="headers"
          :items="desserts"
          disable-initial-sort
          hide-actions

          >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>       
          </template>
        </v-data-table>
      </div>
    </v-flex>
     <v-flex xs12>
      <div class="indexinfo_box02 a3">
          <v-data-table 
          :headers="headers"
          :items="desserts"
          disable-initial-sort
          hide-actions

          >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>       
          </template>
        </v-data-table>
      </div>
    </v-flex>
  </v-layout>
  </v-container>

</template>



<script>
export default {
  props: [],
  data() {
    return {
      results: [],
      rowsPerPageItems: [50, 50],
      headers: [
        {text: '● KODEX DB 500 ETF(05320)', align:"left", sortable: false, value: 'id' },
        {text: '', align:"center", sortable: false, value: 'inst_name' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
        },
        {
          name: 'Eclair',
          calories: 262,
        },
        {
          name: 'Cupcake',
          calories: 305,
        },
        {
          name: 'Gingerbread',
          calories: 356,
        },
        {
          name: 'Jelly bean',
          calories: 375,
        }
      ],
      modalFlag: false,
    };
  },
  
}
</script>

