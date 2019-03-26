<template>
    <div>
        <v-badge
          v-model="show"
          color="cyan"
          left
        >
          <template v-slot:badge>
            <span>0</span>
          </template>
          <v-icon
            large
            color="grey lighten-1"
          >shopping_cart</v-icon>
        </v-badge>
    </div>
</template>

<script>
import Config       from "@/js/config.js"

export default {
    
    data() {
        return {
            show : true
        };
    },
    methods: {

    }
}
</script>

<style scoped>

</style>