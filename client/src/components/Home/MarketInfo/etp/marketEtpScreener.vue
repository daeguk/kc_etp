<template>
<v-container>
        <v-layout row wrap class="content_margin etp_new">
        <v-flex xs12>
            <v-card flat>
            <v-card-title primary-title>
                        <h3 class="headline subtit" pb-0>
                           ETP Screener
                                <span>조건에 맞는 ETP종목을 찾아줍니다.</span>
                        </h3>
                    </v-card-title>
                     <v-card class="register_wrap pt0" flat xs12 color="lighten-1">
                    <h4>조건 설정</h4>
                     </v-card>
                     <v-card flat>
                         <v-layout>
                             <v-flex xs5>
                                 <!---조건설정 탭--->
                                 <v-card>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>User Profile</v-toolbar-title>
    </v-toolbar>
    <v-tabs
      v-model="tab"
      class="elevation-2 v-tabs--vertical"
      :centered="centered"
      :grow="grow"
      :vertical="vertical"
      :right="right"
      :prev-icon="prevIcon ? 'mdi-arrow-left-bold-box-outline' : undefined"
      :next-icon="nextIcon ? 'mdi-arrow-right-bold-box-outline' : undefined"
      :icons-and-text="icons"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab
        v-for="i in tabs"
        :key="i"
        :href="`#tab-${i}`"
      >
        Tab {{ i }}
        <v-icon v-if="icons">mdi-phone</v-icon>
      </v-tab>

      <v-tab-item
        v-for="i in tabs"
        :key="i"
        :value="'tab-' + i"
      >
        <v-card
          flat
          tile
        >
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
                                 
                                 <!---조건설정 탭 end--->
                             </v-flex>
                             <v-flex xs6>
                             </v-flex>
                         </v-layout>
                     </v-card>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
  export default {
    data () {
      return {
        tab: null,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        icons: false,
        centered: false,
        grow: false,
        vertical: false,
        prevIcon: false,
        nextIcon: false,
        right: false,
        tabs: 3,
      }
    },
  }
</script>