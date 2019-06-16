<template>
  <canvas :id=chartId :width=chart.width :height=chart.height>
  </canvas>
</template>

<script>
import Config from "@/js/config.js"
import util from "@/js/util.js"

export default {
  props:['itemList'],
  data() {
    return {
      canvas:{},
      ctx:{},
      chartId:"PerformColumnChart",
      chart:{width:1000, height:200},
      grad:{},
      mrect:{},
      cX: 0,
      cY: 0,
      rad: [120, 70, 60],
      disCnt: 10,
      sumWeight: 0,
      weights: [],
      angles: [],
      color1: ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde', '#B6B8BA', '#7E8083', '#FBB040', '#F58025', '#EDED8A'],
    };
  },    
  watch: {
    'itemList': function() {
      console.log("PerformColumnChart watch.........itemList ");
      this.dataInit();
    },
  },
  created: function() {
  },
  mounted: function() {
    // console.log("LineEtpMultiChart..........");
    this.canvas = document.getElementById(this.chartId);
    this.ctx = this.canvas.getContext('2d');
    // this.mrect = this.canvas.getBoundingClientRect();
    this.dataInit();
  },
  methods: {
    dataInit: function() {
      this.drawInit();
      if(this.itemList.length > 0) {
        if(this.itemList.length < 5) this.disCnt = this.itemList.length;
        else this.disCnt = 5;
        this.drawInit();
      }
    },
    drawInit: function() {
      var c = this.ctx;
      c.strokeRect(0, 0, this.chart.width, this.chart.height);
      // this.clearRect();
      // this.drawCircle();
      // this.drawText();
    },
    clearRect: function() {
      var c = this.ctx;
      c.clearRect(0, 0, this.chart.width, this.chart.height);
    },
    /*
    drawCircle: function() {
      var c = this.ctx;
      for(var i = 0; i < this.disCnt; i++) {
        c.beginPath();
        c.fillStyle = this.color1[i];
        if(i % 2 == 0) {
          c.arc(40, 30 + parseInt(i/2) * 50, 10, 0, Math.PI*2);
        }else {
          c.arc(300, 30 + parseInt(i/2) * 50, 10, 0, Math.PI*2);
        }
        c.fill();
        c.closePath();
        c.restore();
      }
    },
    drawText: function() {
      var c = this.ctx;
      c.fillStyle = "#424242";
      c.textBaseline = "middle";
      c.textAlign = "left";
      c.font = '14px san-serif';
      for(var i = 0; i < this.disCnt; i++) {
        if(i % 2 == 0) {
          c.fillText(util.strSubString(this.etpWeight[i].JONG_NM, 13), 60, 30 + parseInt(i/2) * 50);
          c.fillText(this.etpWeight[i].PERCNT + "%", 200, 30 + parseInt(i/2) * 50);
        }else {
          c.fillText(util.strSubString(this.etpWeight[i].JONG_NM, 13), 320, 30 + parseInt(i/2) * 50);
          c.fillText(this.etpWeight[i].PERCNT + "%", 460, 30 + parseInt(i/2) * 50);
        }
      }
    },
    */
  }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>