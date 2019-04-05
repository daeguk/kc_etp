<template>
    <v-container>
        <v-layout row class="content_margin">
            <v-flex grow>
                <v-card flat lite pb-0>
                </v-card>
            </v-flex>
<indexDetailrtmenu></indexDetailrtmenu>
        </v-layout>
    </v-container>
</template>


<script>
import indexDetailrtmenu from "./indexDetailrtmenu.vue";

export default {
    data() {
        return {
            value: 0,
            fruits: 0,
            ticksLabels: ["등록완료", "연동신청", "연동완료"],
            drawer:false,
            items: [
                { title: "Home", icon: "dashboard" },
                { title: "About", icon: "question_answer" }
            ],
            mini: false,
            right: null
        };
    },
    components: {
        indexDetailrtmenu: indexDetailrtmenu,
    }
};
</script>

