<template>
  <v-container fluid grid-list-md pa-0 mb-4>
  <v-layout row wrap>
    <v-flex md6> 
      <indexinfo1box :item="boxItem1"></indexinfo1box>
    </v-flex>
    <v-flex md6>
      <indexinfo2box :item="boxItem2"></indexinfo2box>
    </v-flex>
  </v-layout>
  </v-container>
</template>


<script>
import Config       from "@/js/config.js"
import indexinfo1box   from  './indexinfo1box.vue'
import indexinfo2box   from  './indexinfo2box.vue'


export default {
  props: [],
  data() {
    return {
      boxItem1: {title:"Index Info", count: 120, subTitle: '회원사/벤더로 분배되는 지수', updateDate: '25/02/19'},
      boxItem2: {title:"산출지수", count: 156, subTitle: '미발표 지수를 포함한 플랫폼에서 산출중인 지수', updateDate: '25/02/19'},
    };
  },
  components: {
    indexinfo1box: indexinfo1box,
    indexinfo2box: indexinfo2box,
  },
  computed:{

  },
  mounted: function() {
  },
  created: function() {
      
  },
  beforeDestroy() {
      
  },
  methods: {
  }
}
</script>
<style scoped>
</style>