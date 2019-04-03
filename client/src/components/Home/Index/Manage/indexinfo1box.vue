<template>
<div class="indexinfo_box01">
  <h4 class="mb-0">Index Info</h4>
  <v-data-table 
    :headers="headers"
    :items="desserts"
    disable-initial-sort
    hide-actions
    hide-headers
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.calories }}</td>
    </template>
  </v-data-table>

  </div>
    
</template>


<script>
export default {
  props: [],
  data() {
    return {
      results: [],
      rowsPerPageItems: [50, 50],
      headers: [
        {text: 'ID', align:"center", sortable: false, value: 'id' },
        {text: '지수명', align:"center", sortable: false, value: 'inst_name'},
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
        },
        {
          name: 'Lollipop',
          calories: 392,
        },
        {
          name: 'Honeycomb',
          calories: 408,
        },
        {
          name: 'Donut',
          calories: 452,
        },
        {
          name: 'KitKat',
          calories: 518,
        }
      ],
      modalFlag: false,
    };
  },
  
}
</script>