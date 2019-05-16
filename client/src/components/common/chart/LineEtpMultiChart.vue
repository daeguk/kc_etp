<template>
  <canvas :id=chartId :width=chart.width :height=chart.height 
    v-on:mousemove.stop="mouseMove" v-on:mouseleave.stop="mouseLeave">
  </canvas>
</template>

<script>
import Config       from "@/js/config.js"
import util from "@/js/util.js";

export default {
    props:['etpBasic'],
    data() {
        return {
            canvas:{},
            ctx:{},
            chartId:"EtpMultiChart",
            chart:{width:1050, height:400},
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
            intra_date:[],
        };
    },    
    watch: {
      'etpBasic.f16013': function() {
        console.log("watch.........: ");
        console.log(this.etpBasic);
        // this.etpBasic = newEtpBasic;
        this.dataInit();
      }
    },
    created: function() {
    },
    mounted: function() {
        console.log("LineEtpMultiChart..........");
        this.canvas = document.getElementById(this.chartId);
        this.rect = this.canvas.getBoundingClientRect();
        this.ctx = this.canvas.getContext('2d');
        this.drawInit(this.ctx);
        /*
        this.grad = this.ctx.createLinearGradient(0,0,0,this.canvas.height);
        this.grad.addColorStop(0, this.chartItem.sColor);
        this.grad.addColorStop(1,  this.chartItem.eColor);
        */
        // this.dataInit();
    },
    methods: {
        drawInit: function(c) {
            c.strokeRect(0, 0, this.chart.width, this.chart.height);

            c.beginPath();
            c.lineWidth = 0.8;
            c.strokeStyle = "#37474F";
            c.moveTo(80, 50);
            c.lineTo(80, 350);
            c.lineTo(1000, 350);
            c.stroke();
            c.closePath();

            c.beginPath();
            c.strokeStyle = "#BDBDBD";
            c.setLineDash([2]);
            for(var i=1; i < 7; i++) {
              c.moveTo(80, 50*i);
              c.lineTo(1000, 50*i);
            }
            c.stroke();

        },

        dataInit: function() {
            var vm = this;
            /*
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
            */
            this.getEtpMultiIntra(0, 100);
        },
        getEtpMultiIntra: function(term, limit) {
          console.log("getEtpMultiIntra : " + this.etpBasic.f16013);
          var vm = this;

          vm.etpBasic.limit = limit;
          vm.etpBasic.f34239 = "M" + util.pad(vm.etpBasic.f34239, 3);

          axios.get(Config.base_url + "/user/marketinfo/getEtpMultiIntra", {
            params: vm.etpBasic
          }).then(function(response) {
            console.log(response);
            if (response.data.success == false) {
                alert("해당 ETP의 데이터가 없습니다");
            } else {
                // vm.intra_data.push = response.data.results;
                vm.intra_data = response.data.results.reverse();
                vm.draw();
            }
          });
        },
        draw: function (){
            var c = this.ctx;
            /*
            var _width = this.chartItem.width - (this.chartItem.marginW * 2);
            var _height = this.chartItem.height - (this.chartItem.marginH * 2);
            var _dnum = this.itemNum;
            var _maxv = this.maxVal;
            var _minv = this.minVal;
            var _wpos = 0.0, _hpos = 0.0;
            */
            // 차트 그리기 시작
            /*
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
                console.log("item[0] : " + item[0] + " item[1] : " + item[1] + " item[2] : " + item[2]);
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
            c.font = 'bold 24px san-serif';
            c.fillText(this.chartItem.f15001, 15, 55);
            var slen = this.chartItem.f15001.length;
            c.fillStyle = "#039BE5";
            c.font = '10px san-serif';
            if(slen > 6) c.fillText(this.chartItem.f15472, 115, 45);
            else  c.fillText(this.chartItem.f15472, 100, 45);
            c.fillStyle = "#039BE5";
            c.font = '10px san-serif';
            if(slen > 6) c.fillText(this.chartItem.f15004 + "%", 115, 57);
            else  c.fillText(this.chartItem.f15004 + "%", 100, 57);

            // 우측 하단 자산총액
            c.fillStyle = "#757575";
            c.fillRect(165, 110, 30, 14);
            c.fillStyle = "white";
            c.font = '11px san-serif';
            c.fillText("ETF", 170, 121);

            c.fillStyle = "#424242";
            c.fillRect(165, 130, 30, 14);
            c.fillStyle = "white";
            c.font = '11px san-serif';
            c.fillText("ETN", 170, 141);

            c.fillStyle = "#1B5E20";
            c.font = '12px san-serif';
            c.textAlign = "end";
            c.fillText(this.chartItem.etf_sum + " AUM", 335, 120);
            c.fillStyle = "#1B5E20";
            c.font = '12px san-serif';
            c.textAlign = "end";
            c.fillText(this.chartItem.etn_sum + " 원", 335, 140);

            this.bef_tooltip_img = c.getImageData(0, 0, this.chartItem.width, this.chartItem.height);
            */
        },
        mouseMove: function(event) {
          /*
          var c = this.ctx;
          var _mwpos = event.clientX-this.rect.left;
          var _wpos = _mwpos;
          var _hpos = event.clientY-this.rect.top - 20;
          var item = [];
          var tooltip = "";

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
          */
        },
        /*
        drawGuideLine: function(c, _mwpos) {
          c.beginPath();
          c.strokeStyle = "#757575";
          c.lineWidth = 1;
          c.setLineDash([1]);
          c.moveTo(_mwpos, 0);
          c.lineTo(_mwpos, this.chartItem.height);
          c.stroke();
        },
        */
        mouseLeave: function(event) {
          /*
          this.ctx.putImageData(this.bef_tooltip_img, 0, 0);
          */
        },
        /*
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
        */
    }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>