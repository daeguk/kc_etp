<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <br>
      <span class="headline">종목 비중정보({{etpBasic.f16002}})</span>
      <span style="float:right; margin-right:20px">
      <v-btn icon @click="closeModal"><v-icon>close</v-icon>
      </v-btn>
      </span>
      <div>
        <span style="margin-left:30px">Total {{jCnt}}</span>
      </div>
      <div class="table_container">
        <div class="table_wrapper">
          <table>
            <thead>
              <tr>
                <th style="width:10%">Code</th>
                <th style="width:40%">Name</th>
                <th style="width:40%">Allocation</th>
                <th style="width:10%">GUBUN</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in etpWeight" :key="index">
                <td>{{item.ISIN_CODE}}</td>
                <td>{{item.JONG_NM}}</td>
                <td>{{item.PERCNT}}</td>
                <td>{{item.GUBUN}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </v-card>
    </v-dialog>
</template>

<script>
import Config       from "@/js/config.js"

export default {
  props:['etpBasic','etpWeight'],
  data() {
      return {
        dialog: false,
        jCnt: 0,
        jList: [],
      };
  },
  watch: {
    'etpBasic': function() {
      // console.log("watch.........etpWeight ");
      // console.log(this.etpWeight);
      // this.dataInit();
      this.jCnt = this.etpWeight.length;
    },
  },
  computed: {
  },  
  components: {
      
  },
  created: function() {
  },
  beforeDestroy() {
  },
  mounted: function() {
      this.dialog = true;
    this.jCnt = this.etpWeight.length;
      console.log("openModal Two............");

  },
  methods: {
    closeModal: function() {
      var vm = this;
      vm.$emit("closeWeightModal");
      vm.dialog = false;
    }
  }  
}
</script>
<style scoped>
.table_container {
  height:500px; 
  overflow-y:auto;
  margin: 0px 20px 20px 20px;
}

.table_wrapper {
  border: 1px solid #444444;
  /*
  padding: 0px 0px 20px 0px;
  border-radius: 10px;
  */
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-style: hidden;
}
table th {
  border: 1px solid #444444;
  background: #eee;
  padding: 4px;
  text-align: center;
}
table td {
  border: 1px solid #444444;
  padding: 4px;
  text-align: center;
}
table tr:hover {
  background: #fbf8e9;
}    
.headline {
  padding: 20px 0px 0px 20px;
}
</style>
