<template>
<div class="content_margin">
  <v-container class="summary_card_pad">
  <v-layout row wrap>
    <v-flex md4> 
        <IndexSummaryCard :item="cardItem1" :chartItem="chartItem1"></IndexSummaryCard>
    </v-flex>
    <v-flex md4>
        <IndexSummaryCard :item="cardItem2" :chartItem="chartItem2"></IndexSummaryCard>
    </v-flex>
    <v-flex md4> 
        <IndexSummaryCard :item="cardItem3" :chartItem="chartItem3"></IndexSummaryCard>
    </v-flex>
  </v-layout>
  <v-layout row wrap mt-1>
    <v-flex md3> 
      <IndexSummaryBox :item="boxItem1"></IndexSummaryBox>
    </v-flex>
    <v-flex md3>
      <IndexSummaryBox :item="boxItem2"></IndexSummaryBox>
    </v-flex>
    <v-flex md3> 
      <IndexSummaryBox :item="boxItem3"></IndexSummaryBox>
    </v-flex>
    <v-flex md3> 
      <IndexSummaryBox :item="boxItem4"></IndexSummaryBox>
    </v-flex>
  </v-layout>
    <v-layout row wrap my-1>
       <v-flex md12> 
         <InfoOpenReq></InfoOpenReq>
       </v-flex>
    </v-layout>
  </v-container>
</div> 
</template>

<script>
import Config       from "@/js/config.js"
import IndexSummaryCard   from  './IndexSummaryCard.vue'
import IndexSummaryBox   from  './IndexSummaryBox.vue'
import InfoOpenReq   from  './InfoOpenReq.vue'

export default {
  props: [],
  data() {
    return {
      cardItem1: {
          name:  "DBF 2차 산업혁명 지수",
          subTitle: "the Newest Index",
          close_idx: "300.23",
          fluc_idx: "+1.65",
          fluc_rate: "0.51"
      },
      cardItem2: {
          name:  "DBF 4차전지 테마지수",
          subTitle: "the Best Performed Index",
          close_idx: "300.23",
          fluc_idx: "+1.65",
          fluc_rate: "0.51"
      },
      cardItem3: {
          name:  "DBF 배당성장 지수",
          subTitle: "the Most Popular Index",
          close_idx: "300.23",
          fluc_idx: "+1.65",
          fluc_rate: "0.51"
      },
      chartItem1: {
          chartId: "summaryChart1", width: "360", height:"150", marginW:10, marginH:20,
          code: "DBF001", chartColor: '#B39DDB',
      },
      chartItem2: {
          chartId: "summaryChart2", width: "360", height:"150", marginW:10, marginH:20,
          code: "DBF002", chartColor: '#9FA8DA',
      },
      chartItem3: {
          chartId: "summaryChart3", width: "360", height:"150", marginW:10, marginH:20,
          code: "DBF003", chartColor: '#90CAF9',
      },
      boxItem1: {title:"발표지수", count: 120, subTitle: '회원사/벤더로 분배되는 지수', updateDate: '25/02/19'},
      boxItem2: {title:"산출지수", count: 156, subTitle: '미발표 지수를 포함한 플랫폼에서 산출중인 지수', updateDate: '25/02/19'},
      boxItem3: {title:"프로젝트", count: 7, subTitle: '개발중인 지수', updateDate: '25/02/19'},
      boxItem4: {title:"조회요청", count: 12, subTitle: '지수상세정보 공개요청 건수', updateDate: '25/02/19'},
    };
  },
  components: {
    IndexSummaryCard: IndexSummaryCard,
    IndexSummaryBox: IndexSummaryBox,
    InfoOpenReq: InfoOpenReq,
  },
  computed:{

  },
  mounted: function() {
    this.getIndexSummaryInfo();
  },
  created: function() {
      
  },
  beforeDestroy() {
      
  },
  methods: {
    getIndexSummaryInfo() {
      var vm = this;
      
      axios.post(Config.base_url + "/user/index/getIndexSummaryInfo", {
          params: {
          }
      }).then(function(response) {
          // console.log(response);
          if (response.data.success == false) {
              alert("해당 신청현황이 없습니다");
          } else {
              console.log(response.data.results);
              console.log(response.data.results[0].F16002);

              vm.cardItem1.name = response.data.results[0].F16002;
              //vm.cardItem1.subTitle = response.data.results[0].F16004;
              vm.cardItem1.close_idx = response.data.results[0].F15001;
              vm.cardItem1.fluc_idx = response.data.results[0].F15472;
              vm.cardItem1.fluc_rate = response.data.results[0].F15004;
              
          }
      });
    },
  }
}
</script>
<style scoped>
</style>
