<template>
    <v-layout row wrap class="content_margin etp_new">
        <v-flex grow>
            <v-card flat>
             <v-card-title primary-title>   
                <h3 class="headline" pb-0>
                            PORTFOLIO SIMULATION |
                   <span class="grey--text">KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>
                </h3>
             </v-card-title>
            </v-card>
            
        </v-flex>
    </v-layout>
</template>

<script>
export default {

  data() {
    return {
      activeTab: 0,
       item: [
        '일자별지수', '리밸런싱내역', '시뮬레이션 설정', '분석정보#1', '분석정보#2'
      ],
    };
  }
  
}
</script>

