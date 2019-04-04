<template>
 <v-card flat>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      hide-actions
      class="elevation-1 table_line4"
    >
      <template v-slot:items="props">
          <td>
        <v-checkbox
          v-model="props.selected"
          primary
          hide-details
        ></v-checkbox>
      </td>
        <td>{{ props.item.name1 }}</td>
        <td class="text-xs-left">{{ props.item.종목지수명 }}</td>
        <td class="text-xs-right">{{ props.item.구분 }}</td>
      </template>
      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
</template>


<script>
  export default {
    data () {
      return {
        search: '',
        headers: [
        {
            text: '',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          {
            text: 'CODE',
            align: 'left',
            value: 'name1'
          },
          { text: '종목지수명', value: '종목지수명' },
          { text: '구분', value: '구분' },
        ],
        desserts: [
          {
            name1: '000000',
            종목지수명: 'Kodex일본TOPIX',
            구분: 6.0,
          },
          {
            name1: '101280',
            종목지수명: 'Kodex일본TOPIX',
            구분: 6.0,
          },
          {
            name1: '101280',
            종목지수명: 'Kodex일본TOPIX',
            구분: 6.0,
          },
          {
            name1: '101280',
            종목지수명: 'Kodex일본TOPIX',
            구분: 6.0,
          },
          {
            name1: '101280',
            종목지수명: 'Kodex일본TOPIX',
            구분: 6.0,
          },
         {
            name1: '101280',
            종목지수명: 'Kodex일본TOPIX',
            구분: 6.0,
          }
         
        ]
      }
    }
  }
</script>
