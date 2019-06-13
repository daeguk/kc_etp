<template>
  <canvas :id=chartId :width=chart.width :height=chart.height>
  </canvas>
</template>

<script>
import Config       from "@/js/config.js"
import util from "@/js/util.js"

export default {
  props:['etpBasic','etpWeight'],
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
      color1: ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde', '#B6B8BA', '#7E8083', '#FBB040', '#F58025', '#EDED8A'],
      color2: ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde', '#B6B8BA', '#7E8083', '#FBB040', '#F58025', '#EDED8A'],
    };
  },    
  watch: {
    'etpWeight': function() {
      // console.log("PieEtpWeightChart watch.........etpWeight ");
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
    this.cY = this.chart.height / 2 + 20;
    // console.log("PieEtpWeightChart.........");
    // console.log(this.etpWeight);
    // this.drawInit();
    this.dataInit();
  },
  methods: {
    dataInit: function() {
      if(this.etpWeight.length > 0) {
        if(this.etpWeight.length < 10) this.disCnt = this.etpWeight.length;
        else this.disCnt = 10;
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