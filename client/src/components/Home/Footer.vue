<template>
<v-footer app>
    <v-layout row wrap align-center>
    <v-flex md4>
        <span style="padding-left:30px;"></span>
        <v-icon small>error</v-icon>
        <span>도움말</span>
        <span style="padding-left:20px;"></span>
        <v-icon small>local_offer</v-icon>
        <span>KOSCOM 연락처</span>
        <span style="padding-left:20px;"></span>
        <v-icon small>assignment_ind</v-icon>
        <span>사용자등록</span>
    </v-flex>
    <v-flex md-3 offset-md5>
        <span>&copy; Copyright KOSCOM 2019. All rights reserved.</span>
    </v-flex>
    </v-layout>
</v-footer>
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