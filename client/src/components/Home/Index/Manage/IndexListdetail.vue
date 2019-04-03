<template>
<div class="content_margin">
<v-layout row>
    <v-flex xs12>  
    <v-card flat ma-3>
  <div class="title01_w">
        <v-card-title primary-title>
         <div class="title_wrap01">
          <h3 class="headline mb-0">TIGER 미국달러선물레버리지  <span class="grey--text"> 261110</span></h3>
          <div  class="right_btn">
            <v-layout align-right>
                <v-flex xs12 sm4 text-xs-center>
                <div class="btn_r">
                 <v-btn outline color="indigo" small>목록으로 돌아가기</v-btn>
                </div>
              </v-flex>
            </v-layout>
          </div>
          </div>
        </v-card-title>
        <v-card-text>
        <p class="title_ex">TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
      TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
      TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
      TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
      TIGER 미국달러선물레버리지에 관한 내용이 들어갑니다
      </p> 
        </v-card-text>
        
    </div>   
        <div class="graph_01_w">
          <div class="sub_title_num">1273.46 
            <span>+23 21(0.9%)</span>
            <p>Last Updated : 2019.3.20</p>
          </div>
          <div class="graph_01" style="height:100px;">
            <div class="g_w">그래프들어갑니다</div></div>
        </div>
        
  
  
    <div class="tab2_w">
     <v-layout row wrap>
        <v-flex xs12>
            <v-tabs fixed-tabs
            slot="extension"
            light
            v-model="tab"
            align-with-title
            >
            <v-tabs-slider color="#1976d2"></v-tabs-slider>
    
            <v-tab v-for="item in items" :key="item">
                {{ item }}
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <indexinfotab1></indexinfotab1>
                </v-tab-item>
                <v-tab-item>
                    <indexinfotab2></indexinfotab2>
                </v-tab-item>
                <v-tab-item>
                    <indexinfotab3></indexinfotab3>
                </v-tab-item>
        </v-tabs-items>    
      </v-flex>
      </v-layout> 
    </div>
  </v-card>
  </v-flex>
</v-layout>
</div>
</template>


<script>

  export default {
    data: () => ({
      value: [
        423,
        446,
        675,
        510,
        590,
        610,
        760
      ]
    })
  }
  
</script>
<script>

import indexinfotab1   from  './indexinfotab1.vue'
import indexinfotab2   from  './indexinfotab2.vue'
import indexinfotab3   from  './indexinfotab3.vue'


export default {
        data() {
            return {
                tab: null,
                items: ['기본정보', '분석정보', '정보공개 목록'],
    	};
    },    
    components: {
        indexinfotab1     : indexinfotab1,
        indexinfotab2     : indexinfotab2,
        indexinfotab3     : indexinfotab3,
    },
    created: function() {
    },
    methods: {
    }

}
</script>