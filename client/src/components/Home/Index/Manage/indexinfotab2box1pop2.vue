<template>
    <div class="indexinfo_box01">
        <h4 class="mb-0">포트폴리오</h4>
        <v-subheader>
            TOP10 비중정보
            <v-dialog v-model="dialog" persistent max-width="500">
                <template v-slot:activator="{ on }">
                    <v-btn outline small color="primary" dark v-on="on">VIEW ALL</v-btn>
                </template>
                <v-card>
                    <h5>
                        <v-card-title ma-0>
                            종목 비중정보 (KODEX 200)
                            <v-spacer></v-spacer>
                            <v-btn icon dark @click="dialog = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-card-title>
                    </h5>
                    <div class="index3pop2_con">
                        <v-list subheader two-line>
                            <v-list-tile>
                                <v-list-tile-title>Last Updated</v-list-tile-title>
                                <v-list-tile-content>Notifications</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>Total</v-list-tile-title>
                                <v-list-tile-content>500</v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </div>
                    <indexinfotab2box1pop2t></indexinfotab2box1pop2t>
                    <v-card class="pop_bot_h">
                    </v-card>
                </v-card>
            </v-dialog>
        </v-subheader>
        <div class="graph_02_w" style="height:100px;">파이차트 들어갑니다</div>
        <v-card flat></v-card>
    </div>
</template>


<script>
import indexinfotab2box1pop2t from "./indexinfotab2box1pop2t.vue";

export default {
    data() {
        return {
            dialog: false
        };
    },
    components: {
        indexinfotab2box1pop2t: indexinfotab2box1pop2t,
    },
    created: function() {},
    methods: {}
};
</script>