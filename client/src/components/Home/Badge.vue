<template>
  <div>
    <v-badge v-model="show" color="cyan" left>
      <template v-slot:badge>
        <span>{{badgeCnt}}</span>
      </template>
      <v-icon large color="grey lighten-1">shopping_cart</v-icon>
    </v-badge>
  </div>
</template>

<script>
  import Config from "@/js/config.js"
  export default {
    data() {
      return {
        show: true,
        badgeCnt: 0
      };
    },
    created: function() {
      console.log(">>>>>> badgeCnt=[" + this.badgeCnt + "]");
    },
    methods: {}
  }
</script>
<style scoped>
</style>