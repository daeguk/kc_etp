
<template>
<div>
  로그인 하십시오.
</div>    
</template>





<script>
import Config       from "@/js/config.js"
export default {
  props: [],
  data() {
    return {

    }
  },
  mounted: function() {       
      this.$EventBus.$emit('loginClose', true);
  },
  created: function() {
    
  },
  updated: function() {
     
  },
  methods: {
    
  },
  
}
</script>
