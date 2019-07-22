<template>
 <v-container>
  <v-tabs v-model="activeTab" align-with-title light>
      <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="item in item" :key="item">{{ item }}</v-tab>
       </v-tabs>
            <v-tabs-items v-model="activeTab">
             <v-tab-item>
                <v-layout row wrap class="content_margin">
                    <v-flex grow>
                        <v-card flat>시뮬리스트</v-card>
                    </v-flex>
                </v-layout>

            </v-tab-item>
            <v-tab-item>
                <Simulation></Simulation>
            </v-tab-item>
        </v-tabs-items>
</v-container>                                     
</template>
<script>

import Simulation from "./Simulation.vue";

export default {

  data() {
    return {
      activeTab: 0,
       item: [
        '관리목록', 'Simulation'
      ],
    };
  },
   components: {
        Simulation : Simulation,
    }
  
}
</script>