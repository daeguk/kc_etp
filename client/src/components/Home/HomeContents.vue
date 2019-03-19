<template>
    <v-content>
        <v-container fluid>
            <router-view></router-view>
        </v-container>
   </v-content>
</template> 

<script>

export default {
    data() {
        return {
        };
    },
    components: {
    },
    beforeCreate() {
    },
    created: function() {
        this.$router.push({ path: '/info/etpinfo'});
    },
    beforeDestroy() {
    },

    methods: {
    }
}
</script>

<style scoped>
</style>