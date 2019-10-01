<template>
  <canvas :id=chartId :width=chart.width :height=chart.height v-on:mousemove.stop="mouseMove" v-on:mouseleave.stop="mouseLeave"
>
  </canvas>
</template>

<script>
import Config       from "@/js/config.js"
import util from "@/js/util.js";
import numutil from "@/js/common/tool/numutil.js";

export default {
  props:['etpBasic'],
  data() {
    return {
      canvas:{},
      ctx:{},
      chartId:"EtpLpChart",
      chart:{width:1050, height:400},
      grad:{},
      mrect:{},
      crect:{x1:80, y1:60, x2:1000, y2:360},
      color1:["#B0BEC5","#455A64","#FFA726","#4FC3F7"],
      dataArr: [],
      chartDataPosArr: [],
      chartDataHPosArr: [],
      chartDataPosArr1: [],
      chartDataHPosArr1: [],
      bef_tooltip_img: {},
      maxVal: 0.0,
      minVal: 0.0,
      itemNum: 0,
      valHeight: 0.0,
      dmode:2,
      dterm:2,
      wlen: 0,
      hlen: 0,
      intra_data:[],
      hist_data:[],
      sArr:[],
      mArr:[],
      init_mode_image:{},
      init_term_image:{},
      init_chart_image:{},
      draw_chart_image:{},
      yAxisVal:[],
      xAxisDd:[],
      xAxisTt:[],
    };
  },    
  created: function() {
  },
  mounted: function() {
    // console.log("LineEtpLpChart..........");
    // console.log(this.etpBasic);
    this.canvas = document.getElementById(this.chartId);
    this.ctx = this.canvas.getContext('2d');
    this.mrect = this.canvas.getBoundingClientRect();
    this.wlen = this.crect.x2 - this.crect.x1;
    // -10 : 하단 라인 침범 수정
    this.hlen = this.crect.y2 - this.crect.y1 - 10;
    this.drawInit();
    this.getEtpIntra();
  },
  methods: {
      drawInit: function() {
        var c = this.ctx;
        // c.strokeRect(0, 0, this.chart.width, this.chart.height);

        // 차트 MAIN
        c.beginPath();
        c.strokeStyle = "#37474F";
        c.lineWidth = 1;
        // c.moveTo(this.crect.x1, this.crect.y1);
        // c.lineTo(this.crect.x2, this.crect.y1);
        c.moveTo(this.crect.x1, this.crect.y2);
        c.lineTo(this.crect.x2, this.crect.y2);
        c.stroke();
        c.closePath();

        c.beginPath();
        c.strokeStyle = "#BDBDBD";
        c.setLineDash([2]);
        for(var i=0; i < 6; i++) {
          c.moveTo(this.crect.x1, this.crect.y1 + 50*i);
          c.lineTo(this.crect.x2, this.crect.y1 + 50*i);
        }
        c.stroke();

        // 차트 범례
        var fy1 = this.crect.y1-20;
        var fx1 = this.crect.x1 + 40;
        c.fillStyle = this.color1[0];
        c.fillRect(fx1, fy1-2, 60, 12);
        c.textBaseline = "top";
        c.textAlign = "center";
        c.font = '12px  Roboto, sans-serif, Noto-Sans';
        c.fillText("매도호가", fx1 + 100, fy1);

        fx1 = fx1 + 160;
        c.fillStyle = this.color1[1];
        c.fillRect(fx1, fy1-2, 60, 12);
        c.fillText("매수호가", fx1+100, fy1);

        fx1 = fx1 + 160;
        c.fillStyle = this.color1[2];
        c.fillRect(fx1, fy1-2, 60, 12);
        c.fillText("iNav", fx1+90, fy1);

        // 현재가 필요하면, td_etp_hoga_intra 에 F15001(현재가)를 쌓자.
        // fx1 = fx1 + 140;
        // c.fillStyle = this.color1[3];
        // c.fillRect(fx1, fy1-2, 60, 12);
        // c.fillText("현재가", fx1+90, fy1);
        // 차트 골격 저장
        var vm = this;
        this.init_chart_image = c.getImageData(this.crect.x1-1, this.crect.y1-2, this.crect.x2+1, this.crect.y2);
      },

      getEtpIntra: function() {
        var vm = this;

        axios.get(Config.base_url + "/user/marketinfo/getEtpHogaIntraToday", {
          params: vm.etpBasic
        }).then(function(response) {
          // console.log(response);
          if (response.data.success == false) {
              alert("해당 지수의 데이터가 없습니다");
          } else {
              vm.intra_data = response.data.results.reverse();
              vm.draw_intra(vm.intra_data);
          }
        });
      },
      draw_intra: function (idata){
        var c = this.ctx;
        var vm = this;
        var _dnum = idata.length;
        var val = 0, val1 = 0, val2 = 0, val3 = 0;
        var bval1 = 0, bval2 = 0;  // 이전값. 매도/매수 호가 0 일때 대체.
        var maxVal = 0, minVal = 0, diffVal = 0;
        var stepVal = 0;
        var _wpos = 0, _hpos = 0;
        var toFixNum = 0;

        this.sArr = [];
        idata.forEach(function(item, index) {
          var sdata = {};
          var tval1, tval2;

          // val = item.F20008; val1 = item.F40544; val2 = item.F40545;
          val = item.F15301; val1 = item.F40544; val2 = item.F40545; val3 = item.F20008;
          val = Number(val); val1 = Number(val1); val2 = Number(val2); val3 = Number(val3);

          tval1 = numutil.getMaxArr([val, val1, val2, val3]);
          tval2 = numutil.getMinArr([val, val1, val2, val3]);
          if(index == 0) {
            maxVal = tval1;
            minVal = tval2;
            bval1 = val1;
            bval2 = val2;
          }else {
            if(maxVal < tval1) maxVal = tval1;
            else if(minVal > tval2) minVal = tval2;
            if(val1 == 0) val1 = bval1;
            if(val2 == 0) val2 = bval2;
          }
          sdata.dd = item.F20044;
          sdata.tt = item.F20104;
          sdata.vv = val; sdata.vv1 = val1; sdata.vv2 = val2; sdata.vv3 = val3;
          vm.sArr.push(sdata);
          bval1 = val1; bval2 = val2;
        });
        // console.log("maxval : " + maxVal + " minVal : " + minVal);

        // 부동소수점 연산 오류 수정
        diffVal = (maxVal * 10000 - minVal * 10000) /  10000;
        toFixNum = util.getToFixNum(diffVal);

        // Y Axis 데이터 
        stepVal = diffVal / 6;
        vm.yAxisVal[0] = minVal;
        for(var i=1; i < 6; i++) {
          // console.log("i : " + i + " minVal : " + minVal + " maxVal : " + maxVal + " stepVal : " + stepVal);
          vm.yAxisVal[i] = minVal + stepVal * i;
        }
        vm.yAxisVal[6] = maxVal;
        for(var i=0; i < 7; i++) {
          vm.yAxisVal[i] = vm.yAxisVal[i].toFixed(toFixNum);
          vm.yAxisVal[i] = util.formatStringNum(vm.yAxisVal[i].toString());
          // vm.yAxisVal[i] = vm.yAxisVal[i].toString();
        }

        // X Axis 데이터
        var stepX = Math.floor(_dnum / 5);
        for(var i=0; i < 5; i++) {
//          vm.xAxisDd[i] = vm.sArr[stepX*i].dd;
          vm.xAxisDd[i] = "";
          vm.xAxisTt[i] = vm.sArr[stepX*i].tt;
        }

        c.clearRect(0, vm.crect.y1-6, vm.chart.width, vm.chart.height-vm.crect.y1+6);

        // 매도호가 그리기
        c.beginPath();
        c.strokeStyle = vm.color1[0];
        c.lineWidth = 2;
        c.setLineDash([]);
        vm.sArr.forEach(function(item, index) {
          // console.log("draw_sintra... : " + index);
          // console.log(item);
          // _dnum - 1 : 오른쪽 마지막 픽셀 표현
          _wpos = index / (_dnum-1) * vm.wlen + vm.crect.x1;
          _hpos = vm.crect.y1 + (vm.hlen - ((item.vv1 - minVal) / diffVal * vm.hlen)) ;
          vm.chartDataPosArr[index] = _wpos;
          vm.chartDataHPosArr[index] = _hpos;

          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          }else {
            c.lineTo(_wpos, _hpos);
          }
          // console.log("_wpos : " + _wpos + " _hpos : " + _hpos);
        });
        c.putImageData(vm.init_chart_image, vm.crect.x1-1, vm.crect.y1-2);
        c.stroke();

        // 매수호가 그리기
        c.beginPath();
        c.strokeStyle = vm.color1[1];
        c.lineWidth = 2;
        c.setLineDash([]);
        vm.sArr.forEach(function(item, index) {
          // console.log("draw_sintra... : " + index);
          // console.log(item);
          // _dnum - 1 : 오른쪽 마지막 픽셀 표현
          _wpos = index / (_dnum-1) * vm.wlen + vm.crect.x1;
          _hpos = vm.crect.y1 + (vm.hlen - ((item.vv2 - minVal) / diffVal * vm.hlen)) ;
          vm.chartDataPosArr[index] = _wpos;
          vm.chartDataHPosArr[index] = _hpos;

          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          }else {
            c.lineTo(_wpos, _hpos);
          }
          // console.log("_wpos : " + _wpos + " _hpos : " + _hpos);
        });
        // c.putImageData(vm.init_chart_image, vm.crect.x1-1, vm.crect.y1-2);
        c.stroke();

        // iNav 그리기
        c.beginPath();
        c.strokeStyle = vm.color1[2];
        c.lineWidth = 2;
        c.setLineDash([]);
        vm.sArr.forEach(function(item, index) {
          // console.log("draw_sintra... : " + index);
          // console.log(item);
          // _dnum - 1 : 오른쪽 마지막 픽셀 표현
          _wpos = index / (_dnum-1) * vm.wlen + vm.crect.x1;
          _hpos = vm.crect.y1 + (vm.hlen - ((item.vv - minVal) / diffVal * vm.hlen)) ;
          vm.chartDataPosArr[index] = _wpos;
          vm.chartDataHPosArr[index] = _hpos;

          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          }else {
            c.lineTo(_wpos, _hpos);
          }
          // console.log("_wpos : " + _wpos + " _hpos : " + _hpos);
        });
        c.stroke();
/*
        // 현재가 그리기
        c.beginPath();
        c.strokeStyle = vm.color1[3];
        c.lineWidth = 2;
        c.setLineDash([]);
        vm.sArr.forEach(function(item, index) {
          // console.log("draw_sintra... : " + index);
          // console.log(item);
          // _dnum - 1 : 오른쪽 마지막 픽셀 표현
          _wpos = index / (_dnum-1) * vm.wlen + vm.crect.x1;
          _hpos = vm.crect.y1 + (vm.hlen - ((item.vv3 - minVal) / diffVal * vm.hlen)) ;
          vm.chartDataPosArr[index] = _wpos;
          vm.chartDataHPosArr[index] = _hpos;

          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          }else {
            c.lineTo(_wpos, _hpos);
          }
          // console.log("_wpos : " + _wpos + " _hpos : " + _hpos);
        });
        // c.stroke();
        */

        //Y-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "end";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        for(var i=0; i < 7; i++) {
          // console.log("yAxis : " + vm.yAxisVal[i]);
          c.fillText(vm.yAxisVal[6-i], 65, vm.crect.y1 + 50 * i);
        }
        //X-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "center";
        c.font = '12px  Roboto, sans-serif, Noto-Sans';
        
        for(var i=0; i < 5; i++) {
          // console.log("xAxis : " + vm.xAxisDd[i] + " " + vm.xAxisTt[i]);
          //c.fillText(vm.xAxisDd[i], vm.crect.x1 + 35 + (vm.crect.x2-vm.crect.x1) / 5 * i, vm.crect.y2);
          c.fillText(vm.xAxisTt[i], vm.crect.x1 + 35 + (vm.crect.x2-vm.crect.x1) / 5 * i, vm.crect.y2+15);
        }

        this.draw_chart_image = c.getImageData(this.crect.x1, this.crect.y1-10, this.crect.x2, this.crect.y2);

      },

      // 마우스 이동시 툴팁 처리
      mouseMove: function(event) {
        if(Object.keys(this.draw_chart_image).length === 0) {

        }else {
          var c = this.ctx;

          // modal 이 아닌 경우
          // var _mwpos = event.pageX-this.mrect.left;
          // var _mhpos = event.pageY-this.mrect.top;
          // modal 인 경우
          var _mwpos = event.layerX;
          var _mhpos = event.layerY;
          c.putImageData(this.draw_chart_image, this.crect.x1, this.crect.y1-10);
          if(this.selectGuideCheck(_mwpos, _mhpos) !== -1) {
            // console.log("Got.......... guide");
            this.drawGuideLine(_mwpos);
            this.drawMToolTip(_mwpos, _mhpos);
          }
        }
      },
      // 마우스 OUT 툴팁 처리
      mouseLeave: function(event) {
        if(Object.keys(this.draw_chart_image).length === 0) {

        }else {
          var c = this.ctx;
          c.putImageData(this.draw_chart_image, this.crect.x1, this.crect.y1-10);
        }
      },

      // 세로 가이드 라인 처리
      drawGuideLine: function(_mwpos) {
        var c = this.ctx;
        c.beginPath();
        c.strokeStyle = "#757575";
        c.lineWidth = 1;
        c.setLineDash([1]);
        c.moveTo(_mwpos, this.crect.y1);
        c.lineTo(_mwpos, this.crect.y2);
        c.stroke();
      },
      // Multi Chart Tool Tip
      drawMToolTip: function(wpos, hpos) {
        var c = this.ctx;
        var twpos = wpos;
        var tt_wlen = 100;
        var tt_hlen = 65;
        var item = {};
        var dhpos = 0;

        // 툴팁 박스 그리기
        if(wpos + tt_wlen >= this.crect.x2) twpos -= (tt_wlen + 20);
        c.fillStyle = "#FFFDE7";
        c.fillRect(twpos+10, hpos+20, tt_wlen, tt_hlen);

        // 툴팁 텍스트 그리기
        item = this.getDataByPos(wpos);
        c.fillStyle = "black";
        c.textAlign = "right";
        c.font = '11px Roboto, sans-serif, Noto-Sans';
//        c.fillText(item.dd, twpos+tt_wlen, hpos+31);
        c.fillText(item.tt, twpos+tt_wlen, hpos+33);
        c.fillText("Sell : " + item.vv1, twpos+tt_wlen, hpos+45);
        c.fillText("iNav : " + item.vv, twpos+tt_wlen, hpos+57);
        c.fillText("Buy : " + item.vv2, twpos+tt_wlen, hpos+69);
        // 포인트 원 그리기
        if((wpos - this.crect.x1) > 5) {   // Y-Axis 침범 방지

          // iNav POINT
          dhpos = this.getHPosByPos(wpos);
          c.beginPath();
          c.fillStyle = "#85c406";
          c.arc(wpos, dhpos, 5, 0, Math.PI*2);
          c.fill();
          c.stroke();

        }
      },
      getDataByPos: function(wpos) {
        var i=0;
        for(; i < this.chartDataPosArr.length; i++) {
          var item = this.chartDataPosArr[i];
          // console.log("item : " + item + " wpos : " + wpos);
          // console.log("index : " + i);
          if(item > wpos) {
            break;
          }              
        }
        if(i == this.chartDataPosArr.length) i -= 1;
        return this.sArr[i];
      },
      getHPosByPos: function(wpos) {
        var i=0;
        for(; i < this.chartDataPosArr.length; i++) {
          var item = this.chartDataPosArr[i];
          // console.log("item : " + item + " wpos : " + wpos);
          // console.log("index : " + i);
          if(item > wpos) {
            break;
          }              
        }
        if(i == this.chartDataPosArr.length) i -= 1;
        return this.chartDataHPosArr[i];
      },
      selectGuideCheck: function(wpos, hpos) {
        // console.log("selectGuideCheck........");
        // console.log("wpos : " + wpos + " hpos : " + hpos);
        // console.log("this.crect.y1 : " + this.crect.y1 + " this.crect.y2 : " + this.crect.y2);

        if(hpos >= this.crect.y1 && hpos <= this.crect.y2) {
          if(wpos >= this.crect.x1 && wpos <= this.crect.x2) return 0;
          else return -1;
        }else {
          return -1;
        }
      },

  }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>