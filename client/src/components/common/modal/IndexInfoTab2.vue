<template>
  <v-layout row wrap>
    <v-flex xs12 flat>
      <div class="indexinfo_box01">
        <h4 class="mb-0">Performance</h4>
        <div class="graph_02_w">
        TEST
        </div>
        <v-card flat>
        </v-card>
          <!---자산추가 팝업 -->
          <v-layout row>
              <v-btn outline small color="primary" dark v-on:click="showJongMokPop">
                <v-icon small color="primary">add</v-icon>자산추가
              </v-btn>
          </v-layout>
          <!--자산추가 팝업 end -->
      </div>
    </v-flex>
    <!--
    <jongmokPopup @selectedItem="getSelectedItem" @hideJongMokPop="hideJongMokPop" :showDialog="jongMokDialog"></jongmokPopup>
    -->
  </v-layout>
</template>


<script>
import jongmokPopup from "@/components/common/popup/jongmokPopup";
import Config from '@/js/config.js'

var perf_table = null;
var importance_grid = null;
export default {
  props: ["indexBasic"],
  data() {
      return {
          tab: null,
          importance_colors: ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde', '#B6B8BA', '#7E8083', '#FBB040', '#F58025', '#EDED8A'],
          dialog: false,
          jongMokDialog: false,
          results: [],
          importance_cnt:0,
          search:"",
          modalFlag: false,
          importance_grid_id : "importance_grid",
          importance_chart_id : "importance_chart",
          performChartImages  :   ['perform_bar01.png', 'perform_bar02.png', 'perform_bar03.png', 'perform_bar04.png', 'perform_bar05.png'],
          param: {},
          perf_class : 'perf_chart_w',
          tbl_class : 'tbl_type ver4',
          chart_size : '1180'
      };
  },
  components: {
      jongmokPopup: jongmokPopup,
  },
  computed: {},
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {        
      console.log("tab2...............");
  },
  methods: {
      showJongMokPop: function() {  
                this.jongMokDialog = true; 
      },         
    
      hideJongMokPop: function() { 
          this.jongMokDialog = false; 
      }, 
  }
}
</script>
