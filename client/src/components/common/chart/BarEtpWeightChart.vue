<template>
  <canvas :id=chartId :width=chart.width :height=chart.height>
  </canvas>
</template>

<script>
import Config       from "@/js/config.js"
import util from "@/js/util.js"

export default {
  props:['etpBasic'],
  data() {
    return {
      canvas:{},
      ctx:{},
      chartId:"BarEtpWeightChart",
      chart:{width:1100, height:360},
      grad:{},
      bwidth: 790,
      results: [],
      weights: [],
      weightsNum: [],
      maxWeightNum: 0,
      bpos: 180,
      spos: [],
      weightText: ["에너지", "소재", "산업재", "자유소비재", "필수소비재", "건강관리", "금융",
        "정보기술", "커뮤니케이션서비스", "유틸리티", "부동산"],
      color1: ['#b9e0f7', '#72cdf4', '#1e99e8', '#0076be', '#dcddde', '#B6B8BA', '#7E8083', '#FBB040', '#F58025', '#EDED8A', '#85c406', '#209267'] ,
    };
  },    
  watch: {
    'etpBasic': function() {
      console.log("BarEtpWeightChart watch.........etpWeight ");
      this.clearRect();
      this.getEtpGigsWeight();
    },
  },
  created: function() {
  },
  mounted: function() {
    // console.log("BarEtpWeightChart.........");
    this.canvas = document.getElementById(this.chartId);
    this.ctx = this.canvas.getContext('2d');
    this.drawInit();
    this.getEtpGigsWeight();
  },
  methods: {
    initWeight: function() {
      for(var i=0; i < this.weightText.length; i++) {
        this.weights[i] = "0.00";
        this.spos[i] =  this.bpos;
      }
    },
    drawInit: function() {
      this.initWeight();
      this.drawText();
      this.drawAxis();
    },
    drawText: function() {
      // console.log("drawText...............");
      var c = this.ctx;
      c.save();
      // c.strokeRect(0, 0, this.canvas.width, this.canvas.height);
      c.fillStyle = "#424242";
      c.textBaseline = "middle";
      c.textAlign = "left";
      c.font = '14px san-serif';
      for(var i=0; i < this.weightText.length; i++) {
        c.fillText(this.weightText[i], 10, 30 + i*30);
      }
      c.restore();
    },
    drawText1: function() {
      // console.log("drawText...............");
      var c = this.ctx;
      c.save();
      c.fillStyle = "#424242";
      c.textBaseline = "middle";
      c.textAlign = "left";
      c.font = '14px san-serif';
      for(var i=0; i < this.weightText.length; i++) {
        c.fillText(this.weights[i] + "%", this.spos[i] + 10, 30 + i*30);
      }
      c.restore();
    },
    drawAxis: function() {
      var c = this.ctx;
      c.beginPath();
      c.save();
      c.strokeStyle = "#a8a8a8";
      c.lineWidth = 1;
      c.moveTo(160, 20);
      c.lineTo(160, 340);
      c.stroke();
      c.closePath();
      c.restore();

    },
    clearRect: function() {
      var c = this.ctx;
      c.clearRect(this.bpos-10, 20, this.bwidth+200, 380);
    },
    drawChart: function() {
      var c = this.ctx;
      for(var i = 0; i < this.weightText.length; i++) {
        // console.log("drawChart...........");
        c.beginPath();
        c.save();
        c.strokeStyle = this.color1[i];
        c.lineWidth = 2;
        c.moveTo(this.bpos, 30 + i*30);
        c.lineTo(this.spos[i], 30 + i*30);
        c.stroke();
        c.closePath();
        c.restore();

        c.beginPath();
        c.fillStyle = this.color1[i];
        c.arc(this.spos[i], 30 + i*30, 5, 0, Math.PI*2);
        c.fill();
        c.closePath();
        c.restore();

      }
    },
    getEtpGigsWeight: function() {
      // console.log("getEtpGigsWeight : " + this.etpBasic.F16012);
      var vm = this;

      axios.get(Config.base_url + "/user/marketinfo/getEtpGigsWeight", {
        params: vm.etpBasic
      }).then(function(response) {
        // console.log(response);
        if (response.data.success == false) {
//        alert("해당 ETP의 데이터가 없습니다");
          vm.initWeight();
        } else {
          if(response.data.results.length > 0) {
            vm.results = response.data.results;
            vm.dataConv(vm.results);

          }else {
//          alert("해당 ETP의 데이터가 없습니다");
            vm.initWeight();
          }
        }
        vm.drawText1();
        vm.drawChart();
      });
    },
    dataConv: function(results) {
      this.weights[0] = results[0].R00001;
      this.weights[1] = results[0].R00002;
      this.weights[2] = results[0].R00003;
      this.weights[3] = results[0].R00004;
      this.weights[4] = results[0].R00005;
      this.weights[5] = results[0].R00006;
      this.weights[6] = results[0].R00007;
      this.weights[7] = results[0].R00008;
      this.weights[8] = results[0].R00009;
      this.weights[9] = results[0].R00010;
      this.weights[10] = results[0].R00011;

      this.maxWeightNum = 0;
      for(var i=0; i < this.weightText.length; i++) {
        this.weightsNum[i] = Number(this.weights[i]);
        if(this.maxWeightNum < this.weightsNum[i]) this.maxWeightNum = this.weightsNum[i];
      }
      for(var i=0; i < this.weightText.length; i++) {
        this.spos[i] =  this.bpos + this.bwidth * (this.weightsNum[i]/this.maxWeightNum);
      }
    }
  }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>