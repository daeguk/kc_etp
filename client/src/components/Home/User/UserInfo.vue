<template>
    <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat color="white"><v-badge overlap color="orange">
            <span slot="badge">3</span>
            <v-icon large color="grey">notifications</v-icon>
        </v-badge></v-btn>
        <v-btn flat color="white"><v-avatar
            :tile="tile"
            :size="avatarSize"
            color="gray lighten-4">
            <img src="/assets/img/avatar.png" alt="avatar">
        </v-avatar></v-btn>
        <v-btn flat color="primary">[DBfn] James</v-btn>
    </v-toolbar-items>
</template>

<script>
export default {
    data() {
        return {
            tile: false,
            avatarSize: "36px",
        };
    },
    methods: {

    }
}
</script>

<style scoped>

</style>