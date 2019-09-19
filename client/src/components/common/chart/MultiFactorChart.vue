<template>
  <div>
    <div style="text-align:center; font-weight:600;padding-bottom:5px;">
      <span class="m_title">{{etpBasic.F16002}}</span> 
      <span v-if="gubun==1" @click="openMastModal" class="multif_btn2">[종목바꾸기]</span>
    </div>
    <span>Underweight</span><span style="float:right;">Overweight</span>
    <div style="border: 1px solid #85c406;">
      <canvas :id=chartId :width=chart.width :height=chart.height>
      </canvas>
    </div>
  </div>
</template>

<script>
import Config from "@/js/config.js"
import util from "@/js/util.js"

export default {
  props:['chartId', 'etpBasic', 'gubun'],
  data() {
    return {
      canvas:{},
      ctx:{},
      chart:{width:270, height:360},
      mRes: {},
      color2: '#b9e0f7',
      color3: '#72cdf4',
      color4: '#1e99e8',
      color5: '#0076be',
      color6: '#dcddde',
      color7: '#B6B8BA',
      color8: '#7E8083',
      color9: '#FBB040',
      color10: '#F58025',
      cX: 0,  // Center X
      cY: 0,  // Center Y
      cW: 0,  // 차트 길이
      cH: 0,  // 전체 차트 높이
      Height: 0,
      maxValue: 1.5,
      minValue: -1.5,
      lineH: 15,
      lineDH: 0,
    };
  },    
  watch: {
    'etpBasic.F16013': function() {
      // console.log("watch.........MultiFactorChart etpBasic.F16013: ");
      // console.log(this.etpBasic);
      this.drawInit();
      this.dataInit();
    },
  },
  created: function() {
  },
  mounted: function() {
    // console.log("MultiFactorChart..........");
    // console.log("gubun : " + this.gubun);
    this.canvas = document.getElementById(this.chartId);
    this.ctx = this.canvas.getContext('2d');
    // this.mrect = this.canvas.getBoundingClientRect();
    this.cX = this.chart.width / 2;
    this.cY = 5;
    this.cW = this.cX - 5;
    this.cH = this.chart.height - this.cY ;
    this.lineDH = this.lineH * 3;
    this.drawInit();
    this.dataInit();
    // this.cY = (this.crect.y1 + this.crect.y2) /2;
    // this.hlen = this.cY - this.crect.y1;
    // this.dt = (this.crect.y2 - this.crect.y1) / 4;
    // let xdiff = (this.crect.x2 - this.crect.x1) / 8;
    // for(let i=0; i < 8; i++) {
    //   this.wpos[i] = (this.crect.x1 + 30) + xdiff * i;
    // }
  },
  methods: {
    dataInit: function() {
      this.getEtpMultiFactor();
    },
    drawInit: function() {
      var c = this.ctx;
      c.clearRect(0, 0, this.chart.width, this.chart.height);
      c.lineWidth = 1;
      c.strokeStyle = this.color2;
      c.lineCap = "round";
      c.moveTo(this.cX, this.cY);
      c.lineTo(this.cX, this.chart.height);
      c.stroke();
      // c.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    },
    getEtpMultiFactor: function() {
      var vm = this;
      // console.log("getEtpMultiFactor.............");
      axios.get( Config.base_url + "/user/etp/getEtpMultiFactor", {
        params: vm.etpBasic
      }).then(function(response) {
        if (response.data.success == false) {
          alert("해당 데이터가 없습니다");
        }else {
          vm.mRes = response.data.results[0];
          // console.log("getEtpMultiFactor1..............");
          // console.log(vm.mRes);
          vm.nextProcess();
          // console.log("getEtpMultiFactor2..............");
          // console.log(vm.mRes);
        }
      });
    },
    nextProcess: function() {
      this.convData(this.mRes);
      this.drawChart();
    },
    getMaxMinVal: function(val) {
      if(val > this.maxValue) return this.maxValue;
      else if(val < this.minValue) return this.minValue;
      else return val;
    },
    convData: function(mRes) {
      mRes.MOMENTUM = this.getMaxMinVal(mRes.MOMENTUM);
      mRes.SIZE = this.getMaxMinVal(mRes.SIZE);
      mRes.GROWTH = this.getMaxMinVal(mRes.GROWTH);
      mRes.LIQUIDITY = this.getMaxMinVal(mRes.LIQUIDITY);
      mRes.YIELD = this.getMaxMinVal(mRes.YIELD);
      mRes.QUALITY = this.getMaxMinVal(mRes.QUALITY);
      mRes.VOL = this.getMaxMinVal(mRes.VOL);
      mRes.VALUE = this.getMaxMinVal(mRes.VALUE);
    },
    calWidth: function(val) {
      return (val / this.maxValue * this.cW) ;
    },
    drawChart: function() {
      var c = this.ctx;
      var tx = 0;
      var _hpos = 0;

      // console.log("drawChart.......");
      // console.log(this.mRes);
      c.fillStyle = this.color2;
      _hpos = this.cY + 10;
      tx = this.calWidth(this.mRes.MOMENTUM);
      c.fillRect(this.cX, _hpos, tx, this.lineH);

      c.fillStyle = this.color3;
      _hpos = _hpos + this.lineDH;
      tx = this.calWidth(this.mRes.SIZE);
      c.fillRect(this.cX, _hpos, tx, this.lineH);

      c.fillStyle = this.color4;
      _hpos = _hpos + this.lineDH;
      tx = this.calWidth(this.mRes.GROWTH);
      c.fillRect(this.cX, _hpos, tx, this.lineH);

      c.fillStyle = this.color5;
      _hpos = _hpos + this.lineDH;
      tx = this.calWidth(this.mRes.LIQUIDITY);
      c.fillRect(this.cX, _hpos, tx, this.lineH);

      c.fillStyle = this.color6;
      _hpos = _hpos + this.lineDH;
      tx = this.calWidth(this.mRes.YIELD);
      c.fillRect(this.cX, _hpos, tx, this.lineH);

      c.fillStyle = this.color7;
      _hpos = _hpos + this.lineDH;
      tx = this.calWidth(this.mRes.QUALITY);
      c.fillRect(this.cX, _hpos, tx, this.lineH);

      c.fillStyle = this.color8;
      _hpos = _hpos + this.lineDH;
      tx = this.calWidth(this.mRes.VOL);
      c.fillRect(this.cX, _hpos, tx, this.lineH);

      c.fillStyle = this.color9;
      _hpos = _hpos + this.lineDH;
      tx = this.calWidth(this.mRes.VALUE);
      c.fillRect(this.cX, _hpos, tx, this.lineH);
    },
    openMastModal: function() {
      this.$emit("openMastModal", this.gubun);
    },


  }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>