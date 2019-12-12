<template>
  <canvas :id=chartId :width=chart.width :height=chart.height 
    v-on:mousemove.stop="mouseMove" v-on:mouseleave.stop="mouseLeave"
    v-on:mousedown.stop="mouseClick">
  </canvas>
</template>

<script>
import Config       from "@/js/config.js"
import util from "@/js/util.js";

export default {
  props:['indexBasic'],
  data() {
    return {
      canvas:{},
      ctx:{},
      chartId:"LineIndexChart02",
      chart:{width:1050, height:340},
//      chart:{width:1352, height:290},
      grad:{},
      mrect:{},
      crect:{x1:80, y1:60, x2:1000, y2:300},
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
      term:['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'],
      dmode:2,
      dterm:5,
      wlen: 0,
      hlen: 0,
//      ydifflen: 0,
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

      twordMapping : { 0 : "INDEX", 1 : "ETP", 2 : "MULTI" }
    };
  },    
  watch: {
    'indexBasic.F16013': function() {
      // console.log("watch.........etpBasic.F16013: ");
      // console.log(this.etpBasic);
      this.dataInit();
    },
    'dmode': function(newDmode) {
      // console.log("watch.........dmode: " + newDmode);
      this.drawMode(newDmode);
      if(this.dterm == 0 || this.dterm == 1) this.draw_intra(newDmode);
      else this.draw_hist(newDmode);
    },      
    'dterm': function(newDterm) {
      // console.log("watch.........dterm: " + newDterm);
      this.drawTerm(newDterm);
      this.dataInit();
    }
  },
  created: function() {
  },
  mounted: function() {
    // console.log("LineIndexChart..........");
    this.canvas = document.getElementById(this.chartId);
    this.ctx = this.canvas.getContext('2d');
    this.mrect = this.canvas.getBoundingClientRect();
    this.wlen = this.crect.x2 - this.crect.x1;
    // -10 : 하단 라인 침범 수정
    this.hlen = this.crect.y2 - this.crect.y1 - 10;
//    this.ydifflen = (this.crect.y2 - this.crect.y1) / 6;
    // console.log("ydifflen : " + this.ydifflen);
//    this.dataInit();
    this.drawInit();
  },
  methods: {
      drawInit: function() {
        var c = this.ctx;
        // c.strokeRect(0, 0, this.chart.width, this.chart.height);

        this.drawMode(this.dmode);
        this.drawTerm(this.dterm);
        // 차트 MAIN
        c.beginPath();
        c.strokeStyle = "#37474F";
        c.lineWidth = 1;
        // c.moveTo(this.crect.x1, this.crect.y1);
        // c.lineTo(this.crect.x1, this.crect.y2);
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

        // 차트 골격 저장
        var vm = this;
        this.init_chart_image = c.getImageData(this.crect.x1-1, this.crect.y1-2, this.crect.x2+1, this.crect.y2);
      },

      dataInit: function() {
          var vm = this;
        //   if(this.dterm == 0 || this.dterm == 1) this.getIndexIntra(this.indexBasic, this.term[this.dterm]);
        //   else this.getIndexHist(this.indexBasic, this.term[this.dterm]);

        this.getIndexHist(this.indexBasic, this.term[this.dterm]);
      },
      getIndexHist: function(indexInfo, term) {
        // console.log("getIndexHist : " + indexInfo.F16013);
        var vm = this;

        if( indexInfo && indexInfo.F16013 ) {
            indexInfo.jisu_cd   =  indexInfo.F16013;
        }else{
            indexInfo.jisu_cd   =   "";
        }

        indexInfo.term = term;

        axios.get(Config.base_url + "/user/index/getIndexEtpHistoryData", {
          params: indexInfo
        }).then(function(response) {
          // console.log(response);
          if (response.data.success == false) {
             vm.$emit("showMessageBox", '확인', "해당 지수의 데이터가 없습니다" ,{},1 );
          } else {
              if(response.data.results.length > 0) {
                if( vm.dterm == 0 || vm.dterm == 1 ) {
                    vm.intra_data   =   [];
//                    vm.intra_data   =   response.data.results.reverse();

                    vm.intra_data   =    _.orderBy( response.data.results, [
                        "trd_hh"
                    ], ["asc"]);

                    vm.draw_intra(vm.dmode);
                }else{
                    vm.hist_data    =   [];
                    // vm.hist_data    =   response.data.results.reverse();

                    vm.hist_data   =    _.orderBy( response.data.results, [
                        "trd_dd"
                    ], ["asc"]);

                    vm.draw_hist(vm.dmode);
                }
              }else {
                vm.$emit("showMessageBox", '확인', "해당 지수의 데이터가 없습니다" ,{},1 );
              }
          }
        });
      },
      draw_intra: function (dmode){
        // console.log("draw_intra... ");
        if(dmode == 0 || dmode == 1) this.draw_sintra(dmode, this.intra_data);
        else this.draw_mintra(dmode, this.intra_data);        
      },
      draw_hist: function (dmode){
        // console.log("draw_hist... ");
        if(dmode == 0 || dmode == 1) this.draw_shist(dmode, this.hist_data);
        else this.draw_mhist(dmode, this.hist_data);        
      },
      draw_sintra: function (dmode,idata){
        var c = this.ctx;
        var vm = this;
        var _dnum = idata.length;
        var val = 0, maxVal = 0, minVal = 0, diffVal = 0;
        var stepVal = 0;
        var _wpos = 0, _hpos = 0;
        var toFixNum = 0;

        this.sArr = [];
        idata.forEach(function(item, index) {
          var sdata = {};

        //   val = item.F20008;
//          val = item.close_idx;
          if(dmode == 0) val = item.close_idx;
          else val = item.etp_close_idx;          
        

          val = Number(val);
          if(index == 0) {
            maxVal = val;
            minVal = val;
          }else {
            if(maxVal < val) maxVal = val;
            else if(minVal > val) minVal = val;
          }
        //   sdata.dd = item.F20044;
        //   sdata.tt = item.F20004;

          sdata.dd = item.trd_dd;
          sdata.tt = item.trd_hh;

          sdata.vv = val;
          vm.sArr.push(sdata);
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
          vm.xAxisDd[i] = vm.sArr[stepX*i].dd;
          vm.xAxisTt[i] = vm.sArr[stepX*i].tt;
        }

        c.clearRect(0, vm.crect.y1-6, vm.chart.width, vm.chart.height-vm.crect.y1+6);

        c.beginPath();
        var grd = c.createLinearGradient(vm.crect.x1, vm.crect.y1, vm.crect.x2, vm.crect.y1);
        // grd.addColorStop(0, "#C5E1A5");
        // grd.addColorStop(1, "#85c406");
//        if(this.dmode == 0) {
        if(this.dmode == 1) {
          grd.addColorStop(0, "#C5E1A5");
          grd.addColorStop(1, "#85c406");
        }else {
          grd.addColorStop(0, "#b8b8b8");
          grd.addColorStop(1, "#8c8c8c");
        }        
        c.lineWidth = 1;
        c.setLineDash([]);
        c.strokeStyle = grd ;
        // vm.chartDataPosArr = [];
        // vm.chartDataHPosArr = [];
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
        c.putImageData(vm.init_chart_image, vm.crect.x1-1, vm.crect.y1-2);
        c.stroke();

        //Y-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "end";
        c.font = '12px san-serif';
        for(var i=0; i < 7; i++) {
          // console.log("yAxis : " + vm.yAxisVal[i]);
          c.fillText(vm.yAxisVal[6-i], 75, vm.crect.y1 + 50 * i);
        }
        //X-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "center";
        c.font = '12px san-serif';
        
        for(var i=0; i < 5; i++) {
          // console.log("xAxis : " + vm.xAxisDd[i] + " " + vm.xAxisTt[i]);
          c.fillText(vm.xAxisDd[i], vm.crect.x1 + 35 + (vm.crect.x2-vm.crect.x1) / 5 * i, vm.crect.y2+10);
          c.fillText(vm.xAxisTt[i], vm.crect.x1 + 35 + (vm.crect.x2-vm.crect.x1) / 5 * i, vm.crect.y2+25);
        }

        this.draw_chart_image = c.getImageData(this.crect.x1, this.crect.y1-10, this.crect.x2, this.crect.y2);

      },
      draw_shist: function (dmode, idata){
        var c = this.ctx;
        var vm = this;
        var _dnum = idata.length;
        var val = 0, maxVal = 0, minVal = 0, diffVal = 0;
        var stepVal = 0;
        var _wpos = 0, _hpos = 0;
        var toFixNum = 0;

        this.sArr = [];
        idata.forEach(function(item, index) {
          var sdata = {};

        //   val = item.F15001;
        //   if(dmode == 0) val = item.etp_close_idx;
        //   else val = item.close_idx;
          if(dmode == 0) val = item.close_idx;
          else val = item.etp_close_idx;

          val = Number(val);
          if(index == 0) {
            maxVal = val;
            minVal = val;
          }else {
            if(maxVal < val) maxVal = val;
            else if(minVal > val) minVal = val;
          }
//          sdata.dd = item.F12506;
          sdata.dd = item.trd_dd;
          sdata.vv = val;
          vm.sArr.push(sdata);
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
          vm.xAxisDd[i] = vm.sArr[stepX*i].dd;
        }

        c.clearRect(0, vm.crect.y1-6, vm.chart.width, vm.chart.height-vm.crect.y1+6);

        c.beginPath();
        var grd = c.createLinearGradient(vm.crect.x1, vm.crect.y1, vm.crect.x2, vm.crect.y1);
        // grd.addColorStop(0, "#C5E1A5");
        // grd.addColorStop(1, "#85c406");
//        if(this.dmode == 0) {
        if(this.dmode == 1) {    
          grd.addColorStop(0, "#C5E1A5");
          grd.addColorStop(1, "#85c406");
        }else {
          grd.addColorStop(0, "#b8b8b8");
          grd.addColorStop(1, "#8c8c8c");
        }        
        c.lineWidth = 1;
        c.setLineDash([]);
        c.strokeStyle = grd ;
        vm.chartDataPosArr = [];
        vm.chartDataHPosArr = [];
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
        c.putImageData(vm.init_chart_image, vm.crect.x1-1, vm.crect.y1-2);
        c.stroke();

        //Y-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "end";
        c.font = '12px san-serif';
        for(var i=0; i < 7; i++) {
          // console.log("yAxis : " + vm.yAxisVal[i]);
          c.fillText(vm.yAxisVal[6-i], 65, vm.crect.y1 + 50 * i);
        }
        //X-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "center";
        c.font = '12px san-serif';
        
        for(var i=0; i < 5; i++) {
          // console.log("xAxis : " + vm.xAxisDd[i] + " " + vm.xAxisTt[i]);
          c.fillText(vm.xAxisDd[i], vm.crect.x1 + 35 + (vm.crect.x2-vm.crect.x1) / 5 * i, vm.crect.y2+10);
        }

        this.draw_chart_image = c.getImageData(this.crect.x1, this.crect.y1-10, this.crect.x2, this.crect.y2);
      },













      draw_mintra: function (dmode, idata){
        var c = this.ctx;
        var vm = this;
        var _dnum = idata.length;
        var val = 0, val1 = 0;
        var baseVal = 0, baseVal1 = 0;
        var minRate = 0.0, maxRate = 0.0;
        var curRate = 0.0, curRate1 = 0.0;
        var diffRate = 0.0;
        var stepRate = 0.0;
        var _wpos = 0, _hpos = 0;

        this.sArr = [];
        idata.forEach(function(item, index) {
          var sdata = {};

        //   val = item.F20008;
        //   val1 = item.iF20008;

          val = Number( item.etp_close_idx );
          val1 = Number( item.close_idx );

          if(index == 0) {
            baseVal = val; baseVal1 = val1;
            curRate = 0.0; curRate1 = 0.0;
            maxRate = 0.0; minRate = 0.0;
          }else {
            if( baseVal == 0 ) {
                curRate =   0;
            }else{
                curRate = (val - baseVal) * 100 / baseVal;
            }

            if( baseVal1 == 0 ) {
                curRate1    =   0;
            }else{
                // curRate = Number(curRate.toFixed(2));
                curRate1 = (val1 - baseVal1) * 100 / baseVal1;
                // curRate1 = Number(curRate1.toFixed(2));
            }

            if(curRate > curRate1) {

              if(maxRate < curRate) {
                maxRate = curRate;
              }                
              if(minRate > curRate1) {
                minRate = curRate1;
              }
            }else {
              if(maxRate < curRate1) {
                maxRate = curRate1;
              }
              if(minRate > curRate) {
                minRate = curRate;
              }
            }
          }

        //   sdata.dd = item.F20044;
        //   sdata.tt = item.F20004;
          sdata.dd = item.trd_dd;
          sdata.tt = item.trd_hh;        
          sdata.vv = val;
          sdata.ivv = val1;
          sdata.rate = curRate;
          sdata.irate = curRate1;
          vm.sArr.push(sdata);
        });
        diffRate = maxRate - minRate;
        stepRate = diffRate / 6;

// console.log("maxRate : " + maxRate);
// console.log("minRate : " + minRate);
// console.log("diffRate : " + diffRate);
// console.log("stepRate : " + stepRate);

        // Y Axis 데이터 
        vm.yAxisVal[0] = minRate;
        for(var i=1; i < 6; i++) {
          vm.yAxisVal[i] = minRate + stepRate * i;
          // console.log("yAxis : " + vm.yAxisVal[i]);
        }
        vm.yAxisVal[6] = maxRate;
        for(var i=0; i < 7; i++) {
          vm.yAxisVal[i] = vm.yAxisVal[i].toFixed(2);
        }

        // X Axis 데이터
        var stepX = Math.floor(_dnum / 5);
        for(var i=0; i < 5; i++) {
          vm.xAxisDd[i] = vm.sArr[stepX*i].dd;
          vm.xAxisTt[i] = vm.sArr[stepX*i].tt;
        }

        c.clearRect(0, vm.crect.y1-6, vm.chart.width, vm.chart.height-vm.crect.y1+6);

        // ETP 차트 그리기
        c.beginPath();
        var grd = c.createLinearGradient(vm.crect.x1, vm.crect.y1, vm.crect.x2, vm.crect.y1);
        grd.addColorStop(0, "#C5E1A5");
        grd.addColorStop(1, "#85c406");

        c.lineWidth = 1;
        c.setLineDash([]);
        c.strokeStyle = grd ;
        vm.sArr.forEach(function(item, index) {
          // _dnum - 1 : 오른쪽 마지막 픽셀 표현
          _wpos = index / (_dnum-1) * vm.wlen + vm.crect.x1;
          _hpos = vm.crect.y1 + (vm.hlen - ((item.rate - minRate) / diffRate * vm.hlen)) ;
          vm.chartDataPosArr[index] = _wpos;
          vm.chartDataHPosArr[index] = _hpos;

          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          }else {
            c.lineTo(_wpos, _hpos);
          }
        });
        c.putImageData(vm.init_chart_image, vm.crect.x1-1, vm.crect.y1-2);
        c.stroke();

        // INDEX 차트 그리기
        c.beginPath();
        grd = c.createLinearGradient(vm.crect.x1, vm.crect.y1, vm.crect.x2, vm.crect.y1);
        grd.addColorStop(0, "#b8b8b8");
        grd.addColorStop(1, "#8c8c8c");
        c.strokeStyle = grd ;
        vm.sArr.forEach(function(item, index) {
          // console.log("draw_mintra... : " + index);
          // console.log(item);
          // _dnum - 1 : 오른쪽 마지막 픽셀 표현
          _wpos = index / (_dnum-1) * vm.wlen + vm.crect.x1;
          _hpos = vm.crect.y1 + (vm.hlen - ((item.irate - minRate) / diffRate * vm.hlen)) ;
          vm.chartDataPosArr1[index] = _wpos;
          vm.chartDataHPosArr1[index] = _hpos;

          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          }else {
            c.lineTo(_wpos, _hpos);
          }
        });
        c.stroke();

        //Y-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "end";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        for(var i=0; i < 7; i++) {
          // console.log("yAxis : " + vm.yAxisVal[i]);
          c.fillText(vm.yAxisVal[6-i]+"%", 65, vm.crect.y1 + 50 * i);
        }
        //X-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "center";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        
        for(var i=0; i < 5; i++) {
          // console.log("xAxis : " + vm.xAxisDd[i] + " " + vm.xAxisTt[i]);
          c.fillText(vm.xAxisDd[i], vm.crect.x1 + 35 + (vm.crect.x2-vm.crect.x1) / 5 * i, vm.crect.y2+10);
          c.fillText(vm.xAxisTt[i], vm.crect.x1 + 35 + (vm.crect.x2-vm.crect.x1) / 5 * i, vm.crect.y2+25);
        }

        this.draw_chart_image = c.getImageData(this.crect.x1, this.crect.y1-10, this.crect.x2, this.crect.y2);
      },

      draw_mhist: function (dmode, idata){
        var c = this.ctx;
        var vm = this;
        var _dnum = idata.length;
        var val = 0, val1 = 0;
        var baseVal = 0, baseVal1 = 0;
        var minRate = 0.0, maxRate = 0.0;
        var curRate = 0.0, curRate1 = 0.0;
        var diffRate = 0.0;
        var stepRate = 0.0;
        var _wpos = 0, _hpos = 0;

        this.sArr = [];
        idata.forEach(function(item, index) {
          var sdata = {};

        //   val = item.F15001;
        //   val1 = item.iF15001;

          val = Number( item.etp_close_idx );
          val1 = Number( item.close_idx );

          if(index == 0) {
            baseVal = val; baseVal1 = val1;
            curRate = 0.0; curRate1 = 0.0;
            maxRate = 0.0; minRate = 0.0;
          }else {
            
            if( baseVal == 0 ) {
                curRate =   0;
            }else{
                curRate = (val - baseVal) * 100 / baseVal;
            }

            if( baseVal1 == 0 ) {
                curRate1 = 0;
            }else{
                // curRate = Number(curRate.toFixed(2));
                curRate1 = (val1 - baseVal1) * 100 / baseVal1;
                // curRate1 = Number(curRate1.toFixed(2));
            }

            if(curRate > curRate1) {

              if(maxRate < curRate) {
                maxRate = curRate;
              }                
              if(minRate > curRate1) {
                minRate = curRate1;
              }
            }else {
              if(maxRate < curRate1) {
                maxRate = curRate1;
              }
              if(minRate > curRate) {
                minRate = curRate;
              }
            }
          }

//          sdata.dd = item.F12506;
          sdata.dd = item.trd_dd;
          sdata.vv = val;
          sdata.ivv = val1;
          sdata.rate = curRate;
          sdata.irate = curRate1;
          vm.sArr.push(sdata);
        });
        diffRate = maxRate - minRate;
        stepRate = diffRate / 6;

// console.log("maxRate : " + maxRate);
// console.log("minRate : " + minRate);
// console.log("diffRate : " + diffRate);
// console.log("stepRate : " + stepRate);

        // Y Axis 데이터 
        vm.yAxisVal[0] = minRate;
        for(var i=1; i < 6; i++) {
          vm.yAxisVal[i] = minRate + stepRate * i;
          // console.log("yAxis : " + vm.yAxisVal[i]);
        }
        vm.yAxisVal[6] = maxRate;
        for(var i=0; i < 7; i++) {
          vm.yAxisVal[i] = vm.yAxisVal[i].toFixed(2);
        }

        // X Axis 데이터
        var stepX = Math.floor(_dnum / 5);
        for(var i=0; i < 5; i++) {
          vm.xAxisDd[i] = vm.sArr[stepX*i].dd;
          vm.xAxisTt[i] = vm.sArr[stepX*i].tt;
        }

        c.clearRect(0, vm.crect.y1-6, vm.chart.width, vm.chart.height-vm.crect.y1+6);

        // ETP 차트 그리기
        c.beginPath();
        var grd = c.createLinearGradient(vm.crect.x1, vm.crect.y1, vm.crect.x2, vm.crect.y1);
        grd.addColorStop(0, "#C5E1A5");
        grd.addColorStop(1, "#85c406");

        c.lineWidth = 1;
        c.setLineDash([]);
        c.strokeStyle = grd ;
        vm.sArr.forEach(function(item, index) {
          // _dnum - 1 : 오른쪽 마지막 픽셀 표현
          _wpos = index / (_dnum-1) * vm.wlen + vm.crect.x1;
          _hpos = vm.crect.y1 + (vm.hlen - ((item.rate - minRate) / diffRate * vm.hlen)) ;
          vm.chartDataPosArr[index] = _wpos;
          vm.chartDataHPosArr[index] = _hpos;

          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          }else {
            c.lineTo(_wpos, _hpos);
          }
        });
        c.putImageData(vm.init_chart_image, vm.crect.x1-1, vm.crect.y1-2);
        c.stroke();

        // INDEX 차트 그리기
        c.beginPath();
        grd = c.createLinearGradient(vm.crect.x1, vm.crect.y1, vm.crect.x2, vm.crect.y1);
        grd.addColorStop(0, "#b8b8b8");
        grd.addColorStop(1, "#8c8c8c");
        c.strokeStyle = grd ;
        vm.sArr.forEach(function(item, index) {
          // console.log("draw_mintra... : " + index);
          // console.log(item);
          // _dnum - 1 : 오른쪽 마지막 픽셀 표현
          _wpos = index / (_dnum-1) * vm.wlen + vm.crect.x1;
          _hpos = vm.crect.y1 + (vm.hlen - ((item.irate - minRate) / diffRate * vm.hlen)) ;
          vm.chartDataPosArr1[index] = _wpos;
          vm.chartDataHPosArr1[index] = _hpos;

          if(index == 0) {
            c.moveTo(_wpos, _hpos);
          }else {
            c.lineTo(_wpos, _hpos);
          }
        });
        c.stroke();

        //Y-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "end";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        for(var i=0; i < 7; i++) {
          // console.log("yAxis : " + vm.yAxisVal[i]);
          c.fillText(vm.yAxisVal[6-i]+"%", 65, vm.crect.y1 + 50 * i);
        }
        //X-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "center";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        
        for(var i=0; i < 5; i++) {
          // console.log("xAxis : " + vm.xAxisDd[i] + " " + vm.xAxisTt[i]);
          c.fillText(vm.xAxisDd[i], vm.crect.x1 + 35 + (vm.crect.x2-vm.crect.x1) / 5 * i, vm.crect.y2+10);
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
//            this.drawToolTip(_mwpos, _mhpos);
            if(this.dmode == 2) this.drawMToolTip(_mwpos, _mhpos);
            else  this.drawToolTip(_mwpos, _mhpos);
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
      // Single Chart Tool Tip
      drawToolTip: function(wpos, hpos) {
        var c = this.ctx;
        var twpos = wpos;
        var tt_wlen = 70;
        var tt_hlen = 40;
        var item = {};
        var dhpos = 0;

//        item = this.getDataByPos(wpos);
        // 툴팁 박스 그리기
        if(wpos + tt_wlen >= this.crect.x2) twpos -= (tt_wlen + 20);
        c.fillStyle = "#FFFDE7";
        if(this.dterm == 0 || this.dterm == 1) {
          c.fillRect(twpos+10, hpos+20, tt_wlen, tt_hlen);
        }else {
          c.fillRect(twpos+10, hpos+20, tt_wlen, tt_hlen-10);
        }

        // 툴팁 텍스트 그리기
        item = this.getDataByPos(wpos);
        c.fillStyle = "black";
        c.textAlign = "right";
        c.font = '11px san-serif';
        if(this.dterm == 0 || this.dterm == 1) {
          c.fillText(item.dd, twpos+tt_wlen, hpos+31);
          c.fillText(item.tt, twpos+tt_wlen, hpos+43);
          c.fillText( util.formatNumber( item.vv ), twpos+tt_wlen, hpos+55);
        }else {
          c.fillText(item.dd, twpos+tt_wlen, hpos+31);
          c.fillText( util.formatNumber( item.vv ), twpos+tt_wlen, hpos+43);
        }

        // 포인트 원 그리기
        if((wpos - this.crect.x1) > 5) {   // Y-Axis 침범 방지
          dhpos = this.getHPosByPos(wpos);
          c.beginPath();
          c.fillStyle = "#FFAB00";
          c.arc(wpos, dhpos, 5, 0, Math.PI*2);
          c.fill();
          c.stroke();
        }
      },
      // Multi Chart Tool Tip
      drawMToolTip: function(wpos, hpos) {
        var c = this.ctx;
        var twpos = wpos;
        var tt_wlen = 100;
        var tt_hlen = 50;
        var item = {};
        var dhpos = 0;

        // 툴팁 박스 그리기
        if(wpos + tt_wlen >= this.crect.x2) twpos -= (tt_wlen + 20);
        c.fillStyle = "#FFFDE7";
        if(this.dterm == 0 || this.dterm == 1) {
          c.fillRect(twpos+10, hpos+20, tt_wlen, tt_hlen);
        }else {
          c.fillRect(twpos+10, hpos+20, tt_wlen, tt_hlen-10);
        }

        // 툴팁 텍스트 그리기
        item = this.getDataByPos(wpos);

        c.fillStyle = "black";
        c.textAlign = "right";
        c.font = '11px Roboto, sans-serif, Noto-Sans';
        if(this.dterm == 0 || this.dterm == 1) {
          c.fillText(item.dd, twpos+tt_wlen, hpos+31);
          c.fillText("ETP : " + util.formatNumber( item.vv ), twpos+tt_wlen, hpos+43);
          c.fillText("INDEX : " + util.formatNumber( item.ivv ), twpos+tt_wlen, hpos+55);
        }else {
          c.fillText(item.dd, twpos+tt_wlen, hpos+31);
          c.fillText("ETP : " + util.formatNumber( item.vv ), twpos+tt_wlen, hpos+43);
          c.fillText("INDEX : " + util.formatNumber( item.ivv ), twpos+tt_wlen, hpos+55);
        }
        // 포인트 원 그리기
        if((wpos - this.crect.x1) > 5) {   // Y-Axis 침범 방지

          // ETP POINT
          dhpos = this.getHPosByPos(wpos);
          c.beginPath();
          c.fillStyle = "#85c406";
          c.arc(wpos, dhpos, 5, 0, Math.PI*2);
          c.fill();
          c.stroke();

          // INDEX POINT
          dhpos = this.getHPosByPos1(wpos);
          c.beginPath();
          c.fillStyle = "#9e9e9e";
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
      getHPosByPos1: function(wpos) {
        var i=0;
        for(; i < this.chartDataPosArr1.length; i++) {
          var item = this.chartDataPosArr1[i];
          // console.log("item : " + item + " wpos : " + wpos);
          // console.log("index : " + i);
          if(item > wpos) {
            break;
          }              
        }
        if(i == this.chartDataPosArr1.length) i -= 1;
        return this.chartDataHPosArr1[i];
      },
      mouseClick: function(event) {
        // console.log("mouseClick...................................................");
        // var _mwpos = event.pageX-this.mrect.left-200;
        // var _mhpos = event.pageY-this.mrect.top-210;
        // var _mwpos = event.layerX;
        // var _mhpos = event.layerY;
        var _mwpos = event.pageX-this.mrect.left;
        var _mhpos = event.pageY-this.mrect.top;        
        var selectMode = 0;
        var selectTerm = 0;

// console.log("pageX : " + event.pageX + " pageY : " +event.pageY);
// console.log("clientX : " + event.clientX + " clientY : " +event.clientY);
// console.log("layerX : " + event.layerX + " layerY : " +event.layerY);
// console.log("left : " + this.mrect.left + " top : " + this.mrect.top);
// console.log("wpos : " + _mwpos + " hpos : " + _mhpos);
        selectMode = this.selectModeCheck(_mwpos, _mhpos);
        if(selectMode !== -1) {
          console.log("selectMode : " + selectMode);
          if(selectMode !== this.dmode) {
            this.dmode = selectMode;
            return;
          }
        }

        selectTerm = this.selectTermCheck(_mwpos, _mhpos);
        if(selectTerm !== -1) {
          console.log("selectTerm : " + selectTerm);
          if(selectTerm !== this.dterm) {
            this.dterm = selectTerm;
            return;
          }
        }
      },
      selectModeCheck: function(wpos, hpos) {
        var iw = 60;
        var ih = 25;
        var ix = [this.crect.x1, this.crect.x1+iw, this.crect.x1+iw*2];
        var iy = 16;
        // console.log("selectModeCheck........");
        // console.log("wpos : " + wpos + " hpos : " + hpos);

        if(hpos >= iy && hpos <= (iy + ih)) {
          if(wpos >= ix[0] && wpos <= ix[1]) return 0;
          else if(wpos > ix[1] && wpos <= ix[2]) return 1;
          else if(wpos > ix[2] && wpos <= (ix[2] + iw)) return 2;
          else return -1;
        }else {
          return -1;
        }
      },      
      selectTermCheck: function(wpos, hpos) {
        var iw = 50;
        var ih = 25;
        var ix = [];
        var iy = 16;
        var tnum = this.term.length;
// console.log("selectTermCheck........");
// console.log("wpos : " + wpos + " hpos : " + hpos);
        for(var i=0; i < (tnum+1); i++) {
          ix[i] = this.crect.x2 - (iw * (tnum-i));
        }
// console.log("hpos : " + hpos + " iy : " + iy + " ih : " + ih);
        if(hpos >= iy && hpos <= (iy + ih)) {
          for(var i=0; i < tnum; i++) {
// console.log("wpos : " + wpos + " ix[i] : " + ix[i] + " ix[i+1] : " + ix[i+1]);
            if(wpos >= ix[i] && wpos <= ix[i+1]) break;
          }
          if(i == tnum) return -1
          else return i;
        }else {
          return -1;
        }
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

      drawMode: function(dmode) {
        // console.log("dmode : " + dmode + " this.dmode : " + this.dmode);
        var vm = this;

        var c = this.ctx;
        var tword = ["ETP", "INDEX", "MULTI"];
        var iw = 60;
        var ih = 25;
        var ix = [this.crect.x1, this.crect.x1+iw, this.crect.x1+iw*2];
        var iy = 16;
        var tx = [ix[0] + 20, ix[1] + 12, ix[2] + 12];
        var ty = 35;

        c.clearRect(ix[0], iy, iw*3, ih);

        // 테두리
        c.beginPath();
        c.strokeStyle = "#cacaca";
        c.lineWidth = 0.7;
        c.moveTo(ix[0], iy);
        c.lineTo(ix[2]+iw, iy);
        c.lineTo(ix[2]+iw, iy+ih);
        c.lineTo(ix[0], iy+ih);
        c.lineTo(ix[0], iy);
        c.moveTo(ix[1], iy);
        c.lineTo(ix[1], iy+ih);
        c.moveTo(ix[2], iy);
        c.lineTo(ix[2], iy+ih);
        c.stroke();
        c.closePath();

        // Text
        c.fillStyle = "#37474F";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        c.textBaseline = "bottom";
        c.textAlign = "left";
        tword.forEach(function(item, index) {
          var text = item;
          if( vm.twordMapping ) {
              text = vm.twordMapping[index];
          }
          c.fillText(text, tx[index], ty);
        });

        // Active
        c.fillStyle = "#85c406";
        c.fillRect(ix[dmode], iy, iw, ih);

        c.fillStyle = "#FFFFFF";

        if( vm.twordMapping ) {
            c.fillText( vm.twordMapping[dmode], tx[dmode], ty);
        }else{
            c.fillText(tword[dmode], tx[dmode], ty);
        }
      },
      drawTerm: function(dterm) {
        // console.log("dterm : " + dterm + " this.dterm : " + this.dterm);
        var c = this.ctx;
        var iw = 50;
        var ih = 25;
        var ix = [];
        var iy = 16;
        var tx = [];
        var ty = 35;
        var tnum = this.term.length;

        for(var i=0; i < tnum; i++) {
          ix[i] = this.crect.x2 - (iw * (tnum-i));
          tx[i] = ix[i] + 16;
        }
        tx[tnum -1] -= 2;
        c.clearRect(ix[0], iy, iw*tnum, ih);

        // 테두리
        c.beginPath();
        c.strokeStyle = "#ffffff";
        c.lineWidth = 1;
        c.moveTo(ix[0], iy);
        c.lineTo(ix[tnum -1]+iw, iy);
        c.lineTo(ix[tnum -1]+iw, iy+ih);
        c.lineTo(ix[0], iy+ih);
        c.lineTo(ix[0], iy);

        for(var i=1; i < tnum; i++) {
          c.moveTo(ix[i], iy);
          c.lineTo(ix[i], iy+ih);
        }
        c.stroke();
        c.closePath();

        // Text
        c.fillStyle = "#37474F";
        c.font = '12px san-serif';
        c.textBaseline = "bottom";
        c.textAlign = "left";
        this.term.forEach(function(item, index) {
          c.fillText(item, tx[index], ty);
        });

        // Active
        c.fillStyle = "#85c406";
        c.fillRect(ix[dterm], iy, iw, ih);

        c.fillStyle = "#FFFFFF";
        c.fillText(this.term[dterm], tx[dterm], ty);
      },
  }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>