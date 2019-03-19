<template>
    <v-card>
        <div class="card_title">
            <h4 class="mb-0">{{item.title}}</h4>
            <hr>
            <v-layout row>
                <v-flex md9>
                    <div class="box-subtitle">
                        <div class="grey--text">{{item.subTitle}}</div>
                        <div class="grey--text">Last Updated : {{item.updateDate}}</div>
                    </div>
                </v-flex>
                <v-flex md3>
                    <h1>{{item.count}}</h1>
                </v-flex>
            </v-layout>
        </div>
    </v-card>
</template>

<script>
import Config       from "@/js/config.js"

export default {
    props:['item'],
    data() {
        return {
        };
    },    
    components: {
    },
    created: function() {
    },
    mounted: function() {
    },
    methods: {
    }
}
</script>

<style scoped>
.card_title {
    padding: 10px 20px 10px 20px;
}

h1 {
    font-size: 36px;
    padding: 10px 0px;
}
.box-subtitle {
    font-size: 12px;
}
</style>