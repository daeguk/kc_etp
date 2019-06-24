<template>
  <canvas :id=chartItem.seq :width=chartItem.width :height=chartItem.height 
    v-on:mousemove.stop="drawToolTip" v-on:mouseleave.stop="clearToolTip">
    </canvas>
</template>

<script>
import Config       from "@/js/config.js"
import util       from "@/js/util.js";

export default {
    props:['chartItem', 'dataSet'],
    data() {
        return {
            canvas:{},
            ctx:{},
            grad:{},
            crect:{},
            dataArr: [],
            chartDataPosArr: [],
            bef_tooltip_img: {},
            maxVal: 0.0,
            minVal: 0.0,
            itemNum: 0,
            valHeight: 0.0,
            tt_wlen: 150,
            tt_hlen: 15,
        };
    },    
    created: function() {
    },
    mounted: function() {
        // console.log("AreaIndexTextChart..........");
        this.canvas = document.getElementById(this.chartItem.seq);
        this.rect = this.canvas.getBoundingClientRect();
        this.ctx = this.canvas.getContext('2d');
        this.grad = this.ctx.createLinearGradient(0,0,0,this.canvas.height);
        this.grad.addColorStop(0, this.chartItem.sColor);
        // this.grad.addColorStop(1, "#fff");
        this.grad.addColorStop(1,  this.chartItem.eColor);
        this.dataInit();
    },
    methods: {
        dataInit: function() {
            var vm = this;
            this.dataArr = this.dataSet.reverse();
            this.dataArr.forEach(function(item, index) {
                if(index == 0) {
                    vm.maxVal = item[2];
                    vm.minVal = item[2];
                }
                if(vm.maxVal < item[2]) {
                    vm.maxVal = item[2];
                }else if(vm.minVal > item[2]) {
                    vm.minVal = item[2];
                }
            });
            vm.itemNum = vm.dataArr.length;
            vm.valHeight = vm.maxVal - vm.minVal;
            vm.draw();
        },
        draw: function (){
            var c = this.ctx;
            var _width = this.chartItem.width - (this.chartItem.marginW * 2);
            var _height = this.chartItem.height - (this.chartItem.marginH * 2);
            var _dnum = this.itemNum;
            var _maxv = this.maxVal;
            var _minv = this.minVal;
            var _wpos = 0.0, _hpos = 0.0;

            // c.strokeRect(0, 0, this.canvas.width, this.canvas.height);

            // 차트 그리기 시작
            c.beginPath();
            c.lineWidth = 3;
            c.strokeStyle = this.chartItem.sColor;

            var vm = this;
            this.dataArr.forEach(function(item, index){
                _wpos = vm.chartItem.marginW + index * _width / (vm.itemNum-1);
                _hpos = vm.chartItem.marginH + (_height - ((item[2] - vm.minVal)/ vm.valHeight * _height));

                vm.chartDataPosArr[index] = _wpos;
                if(index == 0) {
                    c.moveTo(_wpos, _hpos);
                }else {
                    c.lineTo(_wpos, _hpos);
                    c.stroke();
                }
                // console.log("item[0] : " + item[0] + " item[1] : " + item[1] + " item[2] : " + item[2]);
            });

            // fill 을 위한 cloasePath 만들기
            _wpos = vm.chartItem.marginW + _width;
            _hpos = vm.chartItem.marginH * 2 + _height;
            c.lineTo(_wpos, _hpos);
            c.lineTo(vm.chartItem.marginW, _hpos);
            c.closePath();
            c.fillStyle = this.grad;
            c.fill();

            // 좌즉 상단 현재가
            c.fillStyle = "#37474F";
            c.font = '14px san-serif';
            c.fillText(this.chartItem.name, 15, 30);
            c.fillStyle = "#263238";
            c.font = 'bold 28px san-serif';
            c.fillText(this.chartItem.F15001, 15, 60);
            var slen = this.chartItem.F15001.length;
            if(Number(this.chartItem.F15472) < 0) {
              c.fillStyle = "#039BE5";
            }else {
              c.fillStyle = "#FF0000";
            }
            c.font = '12px san-serif';
            this.chartItem.F15472 = util.getPlus(this.chartItem.F15472, 2);
            this.chartItem.F15004 = util.getPlus(this.chartItem.F15004, 2);
            if(slen > 6) c.fillText(this.chartItem.F15472, 125, 47);
            else  c.fillText(this.chartItem.F15472, 115, 47);
            if(slen > 6) c.fillText(this.chartItem.F15004 + "%", 125, 60);
            else  c.fillText(this.chartItem.F15004 + "%", 115, 60);

            this.bef_tooltip_img = c.getImageData(0, 0, this.chartItem.width, this.chartItem.height);
        },
        drawToolTip: function(event) {
          var c = this.ctx;
          /*
          var _mwpos = event.clientX-this.rect.left;
          var _wpos = _mwpos;
          var _hpos = event.clientY-this.rect.top - 20;
          */
          var _mwpos = event.layerX;
          var _wpos = _mwpos;
          var _hpos = event.layerY;
          var item = [];
          var tooltip = "";
          // console.log("client : " + event.clientX + " "  + event.clientY);
          // console.log("client : " + event.layerX + " "  + event.layerY);
          // console.log("rec : " + this.rect.left + " " + this.rect.top);
          // console.log("_wpos : " + _wpos + " _hpos : " + _hpos);

          if(_wpos > 200) _wpos -= this.tt_wlen;

          c.putImageData(this.bef_tooltip_img, 0, 0);

          c.fillStyle = "#FFFDE7";
          c.fillRect(_wpos, _hpos, this.tt_wlen, this.tt_hlen);
          this.draw_tooltip_flag = true;

          item = this.getDataByPos(_mwpos);
          c.fillStyle = "black";
          c.textAlign = "left";
          c.font = '11px san-serif';
          tooltip = "" + item[0] + " " + item[1] + " " + item[2];
          c.fillText(tooltip, _wpos+2, _hpos+11);

          this.drawGuideLine(c, _mwpos);
        },
        drawGuideLine: function(c, _mwpos) {
          c.beginPath();
          c.strokeStyle = "#757575";
          c.lineWidth = 1;
          c.setLineDash([1]);
          c.moveTo(_mwpos, 0);
          c.lineTo(_mwpos, this.chartItem.height);
          c.stroke();
        },
        clearToolTip: function(event) {
          this.ctx.putImageData(this.bef_tooltip_img, 0, 0);
        },
        getDataByPos: function(_mwpos) {
          var i=0;
          for(; i < this.chartDataPosArr.length; i++) {
            var item = this.chartDataPosArr[i];
            // console.log("item : " + item + " _wpos : " + _mwpos);
            // console.log("index : " + i);
            if(item > _mwpos) {
              break;
            }              
          }
          if(i == this.chartDataPosArr.length) i -= 1;
          return this.dataArr[i];
        },
    }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>