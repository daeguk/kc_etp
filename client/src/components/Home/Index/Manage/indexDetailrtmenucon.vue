<template>
    <v-layout row class="w100 pt-3">
        <v-flex xs12>
            <v-card flat>
                <v-list two-line subheader>
                    <v-list-tile
                        v-for="item in items"
                        :key="item.title"
                        @click
                        class="right_menu_w3"
                    >
                        <v-list-tile-content class="rm_con_h">
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-avatar>
                            <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
                        </v-list-tile-avatar>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
export default {
    data() {
        return {
            items: [
                {
                    icon: "feedback",
                    iconClass: "lighten-1 small",
                    title: "DBF 4차산업혁명 지수",
                    subtitle: "DBF130"
                },
                {
                    icon: "",
                    iconClass: "lighten-1 white--text",
                    title: "Recipes",
                    subtitle: "Jan 17, 2014"
                },
                {
                    icon: "feedback",
                    iconClass: " lighten-1 small",
                    title: "Work",
                    subtitle: "Jan 28, 2014"
                }
            ]
        };
    }
};
</script>