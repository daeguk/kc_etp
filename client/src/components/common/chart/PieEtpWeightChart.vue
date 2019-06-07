<template>
  <canvas :id=chartId :width=chart.width :height=chart.height>
  </canvas>
</template>

<script>
import Config       from "@/js/config.js"
import util from "@/js/util.js"

export default {
  props:['etpWeight'],
  data() {
    return {
      canvas:{},
      ctx:{},
      chartId:"PieEtpWeightChart",
      chart:{width:500, height:330},
      grad:{},
      mrect:{},
      cX: 0,
      cY: 0,
      rad: [120, 70, 60],
      disCnt: 10,
      sumWeight: 0,
      weights: [],
      angles: [],
      color1: ['#90CAF9', '#80DEEA', '#80CBC4', '#A5D6A7', '#E6EE9C', 
        '#FFCC80', '#EF9A9A', '#F48FB1', '#CE93D8', '#9FA8DA'],
      color2: ['#BBDEFB', '#B2EBF2', '#B2DFDB', '#C8E6C9', '#F0F4C3', 
        '#FFE0B2', '#FFCDD2', '#F8BBD0', '#E1BEE7', '#C5CAE9'],
    };
  },    
  watch: {
    'etpWeight': function() {
      // console.log("watch.........etpWeight ");
      // console.log(this.etpWeight);
      this.dataInit();
    },
  },
  created: function() {
  },
  mounted: function() {
    // console.log("LineEtpMultiChart..........");
    this.canvas = document.getElementById(this.chartId);
    this.ctx = this.canvas.getContext('2d');
    this.mrect = this.canvas.getBoundingClientRect();
    this.cX = this.chart.width / 2;
    this.cY = this.chart.height / 2;
    // console.log("PieEtpWeightChart.........");
    // console.log(this.etpWeight);
    // this.drawInit();
    this.dataInit();
  },
  methods: {
    dataInit: function() {
      if(this.etpWeight.length > 0) {
        if(this.etpWeight.length < this.disCnt) this.disCnt = this.etpWeight.length;
        this.sumWeight = 0;
        for(var i = 0; i < this.disCnt; i++) {
          this.weights[i] = Number(this.etpWeight[i].PERCNT);
          this.sumWeight += this.weights[i];
          // console.log("this.weights : " + this.weights[i] + " sum : " + this.sumWeight);
        }
        console.log("sum : " + this.sumWeight);
        var spos = 0.0;
        for(var i = 0; i < this.disCnt; i++) {
          this.weights[i] = this.weights[i] / this.sumWeight;
          spos += Math.PI * 2 * this.weights[i]
          this.angles[i] = spos;
          // console.log("this.weights : " + this.weights[i]);
          // console.log("this.angles : " + this.angles[i]);
        }
        this.drawInit();
      }
    },
    drawInit: function() {
      this.drawChart1();
      this.drawChart2();
      this.drawChart3();
      this.drawText();

    },
    drawChart1: function() {
      var c = this.ctx;
      for(var i = 0; i < this.disCnt; i++) {
        c.beginPath();
        c.save();
        // c.strokeStyle = this.color1[i];
        c.fillStyle = this.color1[i];
        if(i == 0) {
          c.arc(this.cX, this.cY, this.rad[0], 0, this.angles[i], false);
        }else {
          c.arc(this.cX, this.cY, this.rad[0], this.angles[i-1], this.angles[i], false);
        }
        // c.stroke();
        c.lineTo(this.cX, this.cY);
        c.fill();
        c.restore();
      }
    },
    drawChart2: function() {
      var c = this.ctx;

      for(var i = 0; i < this.disCnt; i++) {
        c.beginPath();
        c.save();
        // c.strokeStyle = this.color1[i];
        c.fillStyle = this.color2[i];
        if(i == 0) {
          c.arc(this.cX, this.cY, this.rad[1], 0, this.angles[i], false);
        }else {
          c.arc(this.cX, this.cY, this.rad[1], this.angles[i-1], this.angles[i], false);
        }
        // c.stroke();
        c.lineTo(this.cX, this.cY);
        c.fill();
        c.restore();
      }
    },
    drawChart3: function() {
      var c = this.ctx;
      c.beginPath();
      c.save();
      c.strokeStyle = "#ffffff";
      c.fillStyle = "#ffffff";
      c.arc(this.cX, this.cY, this.rad[2], 0, Math.PI *2, false);
      c.stroke();
      c.fill();
      c.restore();
    },
    drawText: function() {
      var c = this.ctx;
      c.fillStyle = "#424242";
      c.textBaseline = "middle";
      c.textAlign = "center";
      c.font = '24px san-serif';
      c.fillText(this.sumWeight.toFixed(2) + "%", this.cX, this.cY-5);
      c.font = '12px san-serif';
      c.fillText("TOP 10 비중", this.cX, this.cY+15);
    }
  }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>