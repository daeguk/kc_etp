<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs slot="extension" v-model="activeTab" align-with-title light>
        <v-tabs-slider color="#1e99e8"></v-tabs-slider>
        <v-tab v-for="tab of tabs" :key="tab.id" @click="pageMove(tab.id)">{{ tab.name }}</v-tab>
      </v-tabs>
      <EtpOperControl
        :activeTab="activeTab"
        @fn_setActiveTab="fn_setActiveTab"
        @fn_setFirstData="fn_setFirstData"
      ></EtpOperControl>
    </v-flex>
  </v-layout>
</template>


<script>
  import EtpOperControl from '@/components/Home/Etp/Manage/EtpOperControl.vue'
  export default {
    data() {
      return {
        activeTab: 0,
        tabs: [{
          id: 0,
          name: "ETP 운용정보",
          route: '/etp/manage/etpOperInfo'
        }, {
          id: 1,
          name: "지수관리",
          route: '/etp/manage/etpOperIndex'
        }, {
          id: 2,
          name: "PDF 관리",
          route: '/etp/manage/etpOperPdf'
        }, ],
        firstData: {}
      };
    },
    components: {
      EtpOperControl: EtpOperControl
    },
    mounted: function() {
      this.activeTab = 0;
      this.pageMove(0);
    },
    methods: {
      pageMove: function(tab_id, paramData) {
        var vm = this;
        this.$EventBus.$emit("showList1", {
          tab_id: tab_id,
          paramData: ((paramData && Object.keys(paramData).length > 0) ? paramData : vm.firstData)
        });
      },
      /*
       *  ETP 운용정보 리스트가 조회된 경우 첫번째 행의 레코드를 보관한다.
       *  2019-05-03  bkLove(촤병국)
       */
      fn_setFirstData: function(firstData) {
        var vm = this;
        vm.firstData = "";
        vm.firstData = firstData;
      },
      /*
       *  ETP 운용정보 리스트에서 PDF 행을 선택한 경우
       *  2019-05-03  bkLove(촤병국)
       */
      fn_setActiveTab: function(activeTab, paramData) {
        this.activeTab = activeTab;
        this.pageMove(activeTab, paramData);
      }
    }
  };
</script>