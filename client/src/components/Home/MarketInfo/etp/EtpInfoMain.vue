<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs slot="extension" v-model="activeTab" align-with-title light>
        <v-tabs-slider color="#35e0e2"></v-tabs-slider>
        <v-tab v-for="tab of tabs" :key="tab.id" @click="pageMove(tab.id)">{{ tab.name }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="tab of tabs" :key="tab.id"></v-tab-item>
      </v-tabs-items>
      <!--router-view></router-view-->
      <EtpInfoControl :activeTab="activeTab"></EtpInfoControl>
    </v-flex>
  </v-layout>
</template>

<script>
  import EtpInfoControl from '@/components/Home/MarketInfo/etp/EtpInfoControl.vue'
  export default {
    props: [],
    data() {
      return {
        activeTab: 0,
        inx: 1,
        tabs: [
          /* { id: 1, name: "전체", route: '/info/etpinfo/marktEtpSummaryInfo' }, */
          {
            /* 001-시장대표 */
            id: 1,
            name: "시장대표",
            route: '/info/etpinfo/marketRepresent'
          },  {
            /* 002-섹터*/
            id: 2,
            name: "섹터",
            route: '/info/etpinfo/marketSector'
          },  {
            /* 003-테마 */
            id: 3,
            name: "테마",
            route: '/info/etpinfo/marketThema'
          },  {
            /* 004-전략 */
            id: 4,
            name: "전략",
            route: '/info/etpinfo/marketStrategy'
          },  {
            /* 005-채권 */
            id: 5,
            name: "채권",
            route: '/info/etpinfo/marketBond'
          },  {
            /* 006-통화 */
            id: 6,
            name: "통화",
            route: '/info/etpinfo/marketCurrency'
          },  {
            /* 007-원자재 */
            id: 7,
            name: "원자재",
            route: '/info/etpinfo/marketRawMaterials'
          },  {
            /* 008-VIX */
            id: 8,
            name: "VIX",
            route: '/info/etpinfo/marketVix'
          },  {
            /* 009-부동산 */
            id: 9,
            name: "부동산",
            route: '/info/etpinfo/marketRealEstate'
          },  {
            /* 010-혼합자산 */
            id: 10,
            name: "혼합자산",
            route: '/info/etpinfo/marketMixAssets'
          },  {
            /* 101-국가 ( 탭에 노출은 '해외' ) */
            id: 11,
            name: "해외",
            route: '/info/etpinfo/marketOversea'
          },  {
            /* 201-배율 ( 탭에 노출은 '레버리지/인버스' ) */
            id: 12,
            name: "레버리지/인버스",
            route: '/info/etpinfo/marketLeverageInverse'
          }, 
        ],
      };
    },
    mounted: function() {
      if(this.$route.query.activeTab == 2) {
        //this.activeTab = 1;
        // this.pageMove('/info/etpinfo/marketStrategy');
      } else {
        this.activeTab = 0;
        this.pageMove(1);
      }
    },
    created: function() {},
    beforeUpdated: function() {},
    components: {
      EtpInfoControl: EtpInfoControl
    },
    updated: function() {
      if(this.$route.path == '/info/etpinfo') {
        //this.activeTab = 0;
        //this.pageMove(0);
      }
    },
    methods: {
      pageMove: function(tab_id) {
        /* 페이지 이동시 마다 이벤트 삭제 처리 */
        this.$EventBus.$emit("showList", {
          tab_id: tab_id
        });
      }
    }
  }
</script>
<style scoped>
</style>