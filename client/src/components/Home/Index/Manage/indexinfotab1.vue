<template>
  <v-container fluid grid-list-md pa-0 mb-4>
  <v-layout row wrap>
    <v-flex md6> 
      <indexinfotab1box1 :item="boxItem1"></indexinfotab1box1>
    </v-flex>
    <v-flex md6>
      <indexinfotab1box2 :item="boxItem2"></indexinfotab1box2>
    </v-flex>
  </v-layout>
  </v-container>
</template>


<script>
import Config       from "@/js/config.js"
import indexinfotab1box1   from  './indexinfotab1box1.vue'
import indexinfotab1box2   from  './indexinfotab1box2.vue'


export default {
  props: [],
  data() {
    return {
      boxItem1: {title:"Index Info", count: 120, subTitle: '회원사/벤더로 분배되는 지수', updateDate: '25/02/19'},
      boxItem2: {title:"산출지수", count: 156, subTitle: '미발표 지수를 포함한 플랫폼에서 산출중인 지수', updateDate: '25/02/19'},
    };
  },
  components: {
    indexinfotab1box1: indexinfotab1box1,
    indexinfotab1box2: indexinfotab1box2,
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