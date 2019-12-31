<template>
  <canvas :id="chartItem.chartId" :width="chartItem.width" :height="chartItem.height"></canvas>
</template>

<script>
  import Config from "@/js/config.js"
  export default {
    props: ['chartItem', 'dataSet'],
    data() {
      return {
        canvas: {},
        ctx: {},
        dataArr: [],
        maxVal: 0.0,
        minVal: 0.0,
        itemNum: 0,
        valHeight: 0.0,
      };
    },
    created: function() {},
    mounted: function() {
      console.log("LineChart..........");
      this.canvas = document.getElementById(this.chartItem.chartId);
      this.ctx = this.canvas.getContext('2d');
      this.dataInit();
    },
    methods: {
      draw: function() {
        var c = this.ctx;
        var _width = this.chartItem.width - (this.chartItem.marginW * 2);
        var _height = this.chartItem.height - (this.chartItem.marginH * 2);
        var _dnum = this.itemNum;
        var _maxv = this.maxVal;
        var _minv = this.minVal;
        var _wpos = 0.0,
          _hpos = 0.0;
        // c.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        // 차트 그리기 시작
        c.beginPath();
        c.lineWidth = 1;
        c.strokeStyle = this.chartItem.chartColor;
        var vm = this;
        this.dataArr.forEach(function(item, index) {
          // console.log("inex : " + index);
          _wpos = vm.chartItem.marginW + index * _width / (vm.itemNum - 1);
          _hpos = vm.chartItem.marginH + (_height - ((item[1] - vm.minVal) / vm.valHeight * _height));
          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          } else {
            c.lineTo(_wpos, _hpos);
            c.stroke();
          }
        });
      },
      dataInit: function() {
        var vm = this;
        this.dataArr = this.dataSet;
        this.dataArr.forEach(function(item, index) {
          if(index == 0) {
            vm.maxVal = item[1];
            vm.minVal = item[1];
          }
          if(vm.maxVal < item[1]) {
            vm.maxVal = item[1];
          } else if(vm.minVal > item[1]) {
            vm.minVal = item[1];
          }
        });
        vm.itemNum = vm.dataArr.length;
        vm.valHeight = vm.maxVal - vm.minVal;
        vm.draw();
      },
    }
  }
</script>
<style scoped>
  canvas {
    background-color: #fff;
  }
</style>