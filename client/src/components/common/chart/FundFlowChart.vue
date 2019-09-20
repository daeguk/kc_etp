<template>
  <canvas :id=chartId :width=chart.width :height=chart.height>
  </canvas>
</template>

<script>
import Config from "@/js/config.js"
import util from "@/js/util.js"

export default {
  props:['chartId', 'etpBasic', 'sitem', 'eitem', 'citem', 'rank', 'num'],
  data() {
    return {
      canvas:{},
      ctx:{},
      chart:{width:550, height:200},
    };
  },    
  watch: {
    'etpBasic.F16013': function() {
      // console.log("watch.........FundFlowChart etpBasic.F16013: ");
      // console.log(this.etpBasic);
      this.drawChart();
    },
  },
  created: function() {
  },
  mounted: function() {
    // console.log("FundFlowChart..........");
    this.canvas = document.getElementById(this.chartId);
    this.ctx = this.canvas.getContext('2d');
    this.drawChart();
  },
  methods: {
    drawChart: function() {
      var c = this.ctx;
      var rad = 30;
      var cX1 = 60;
      var cX2 = 460;
      var clen = cX2 - cX1;
      var rlen = cX2 - cX1 - (rad * 4);
      var cX = cX1 + (rad * 2) + rlen * ((this.num - this.rank) / this.num);

      // console.log("rank : " + this.rank + " num : " + this.num);
      // console.log("cX : " + cX);
      var cY = 100;

      c.clearRect(0, 0, this.chart.width, this.chart.height);
      c.textAlign = 'center';

      c.beginPath();
      c.arc(cX1, cY, rad, 0, Math.PI*2);
      c.fillStyle = "#CFD8DC";
      c.fill(); 
      c.closePath();

      c.beginPath();
      c.arc(cX2, cY, rad, 0, Math.PI*2);
      c.fill(); 
      c.closePath();

      c.fillRect(cX1, cY-5, clen, 10);

      c.fillStyle = "#424242";
      c.font = '14px san-serif';
      c.fillText(Math.round(this.sitem.FLOW/100000000), cX1, cY+5);
      c.fillText(this.sitem.F16002, cX1, cY+55);
      c.fillText(Math.round(this.eitem.FLOW/100000000), cX2, cY+5);
      c.fillText(this.eitem.F16002, cX2, cY+55);

      c.beginPath();
      c.arc(cX, cY, rad, 0, Math.PI*2);
      c.fillStyle = "#00E676";
      c.fill(); 
      c.closePath();
      c.fillStyle = "#FFFFFF";
      c.fillText(Math.round(this.citem.FLOW/100000000), cX, cY+5);
      c.fillStyle = "#424242";
      c.fillText("RANK (" + this.rank + " / " + this.num + ")", cX, cY-40);


    },
  }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>