<template>
  <canvas
    :id="chartId"
    :width="chart.width"
    :height="chart.height"
    v-on:mousemove.stop="mouseMove"
    v-on:mouseleave.stop="mouseLeave"
    v-on:mousedown.stop="mouseClick"
  ></canvas>
</template>

<script>
  import $ from "jquery";
  import _ from "lodash"
  import Config from "@/js/config.js"
  import util from "@/js/util.js";
  export default {
    props: ['simul_result_mast', 'arr_result_data', 'arr_result_header', 'arr_checked', 'bm_header'],
    data() {
      return {
        canvas: {},
        ctx: {},
        chartId: "LineSimulationChart",
        chart: {
          width: 1050,
          height: 330
        },
        grad: {},
        mrect: {},
        crect: {
          x1: 80,
          y1: 40,
          x2: 1050,
          y2: 300
        },
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
        term: ['1W', '1M', '3M', '6M', '1Y', 'ALL'],
        dmode: 2,
        dterm: 5,
        wlen: 0,
        hlen: 0,
        //      ydifflen: 0,
        intra_data: [],
        hist_data: [],
        sArr: [],
        mArr: [],
        init_mode_image: {},
        init_term_image: {},
        init_chart_image: {},
        draw_chart_image: {},
        yAxisVal: [],
        xAxisDd: [],
        xAxisTt: [],
        lineColor1: ["#2ac9ad", "#5e8bff", "#febd57", "#9a25ff", "#ea557f", "#afdb4a", "#5073b8", "#0f98ad", "#e2c395", "#a3adbf", "#23233f"],
        lineColor2: ["#2ac9ad", "#5e8bff", "#febd57", "#9a25ff", "#ea557f", "#afdb4a", "#5073b8", "#0f98ad", "#e2c395", "#a3adbf", "#23233f"],
      };
    },
    watch: {
      'arr_checked': function() {
        this.draw_hist(this.dmode);
      }
    },
    created: function() {},
    mounted: function() {
      var vm = this;
      // console.log("LineIndexChart..........");
      this.canvas = document.getElementById(this.chartId);
      this.ctx = this.canvas.getContext('2d');
      this.mrect = $("#" + this.chartId).offset();
      //this.mrect = this.canvas.getBoundingClientRect();
      this.wlen = this.crect.x2 - this.crect.x1;
      // -10 : 하단 라인 침범 수정
      this.hlen = this.crect.y2 - this.crect.y1 - 10;
      //    this.ydifflen = (this.crect.y2 - this.crect.y1) / 6;
      // console.log("ydifflen : " + this.ydifflen);
      this.drawInit();
      this.dataInit();
    },
    methods: {
      drawInit: function() {
        var c = this.ctx;
        // c.strokeRect(0, 0, this.chart.width, this.chart.height);
        //        this.drawMode(this.dmode);
        //        this.drawTerm(this.dterm);
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
        for(var i = 0; i < 6; i++) {
          c.moveTo(this.crect.x1, this.crect.y1 + 50 * i);
          c.lineTo(this.crect.x2, this.crect.y1 + 50 * i);
        }
        c.stroke();
        // 차트 골격 저장
        var vm = this;
        this.init_chart_image = c.getImageData(this.crect.x1 - 1, this.crect.y1 - 2, this.crect.x2 + 1, this.crect.y2);
      },
      dataInit: function() {
        var vm = this;
        this.hist_data = [];
        this.hist_data = [...this.arr_result_data];
        this.hist_data = _.orderBy(this.hist_data, ["F12506"], ["asc"]);
        this.draw_hist(vm.dmode);
      },
      draw_hist: function(dmode) {
        // console.log("draw_hist... ");        
        this.draw_mhist(dmode, this.hist_data);
      },
      draw_mhist: function(dmode, idata) {
        var c = this.ctx;
        var vm = this;
        var _dnum = idata.length;
        var val = 0,
          val1 = 0;
        var arr_baseVal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var arr_curRate = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        var minRate = 0.0,
          maxRate = 0.0;
        var diffRate = 0.0;
        var stepRate = 0.0;
        var _wpos = 0,
          _hpos = 0;
        var maxVal = 0,
          minVal = 0,
          diffVal = 0,
          stepVal = 0;;
        this.sArr = [];
        idata.forEach(function(item, index) {
          var sdata = {};
          var arr_val = [];
          var arr_sdata = [];
          if(vm.bm_header != "BM (N/A)" && vm.bm_header != "") {
            arr_sdata.push(Number(_.get(item, 'BM_RATE') == '' ? '-' : _.get(item, 'BM_RATE')));
            if(vm.arr_checked[0]) {
              arr_val.push(Number(_.get(item, 'BM_RATE') == '' ? '-' : _.get(item, 'BM_RATE')));
            }
          }
          vm.arr_result_header.forEach(function(scen, x) {
            let scen_cd = scen.scen_cd;
            let val = _.get(item, scen.grp_cd + '_' + scen.scen_cd + '_INDEX_RATE') == '' ? '-' : _.get(item, scen.grp_cd + '_' + scen.scen_cd + '_INDEX_RATE');
            arr_sdata.push(Number(val));
            if(vm.bm_header != "BM (N/A)" && vm.bm_header != "") {
              if(vm.arr_checked[x + 1]) {
                arr_val.push(Number(val));
              }
            } else {
              if(vm.arr_checked[x]) {
                arr_val.push(Number(val));
              }
            }
          });
          if(index == 0) {
            arr_baseVal = [...arr_val];
            maxRate = 0.0;
            minRate = 0.0;
            if(typeof _.min(arr_val) != 'undefined') minVal = _.min(arr_val);
            if(typeof _.max(arr_val) != 'undefined') maxVal = _.max(arr_val);
          } else {
            if(typeof _.min(arr_val) != 'undefined') minVal = _.min(arr_val) > minVal ? minVal : _.min(arr_val);
            if(typeof _.max(arr_val) != 'undefined') maxVal = _.max(arr_val) < maxVal ? maxVal : _.max(arr_val);
            arr_baseVal.forEach(function(baseVal, b_index) {
              if(baseVal == 0) {
                arr_curRate[b_index] = 0;
              } else {
                try {
                  arr_curRate[b_index] = (arr_val[b_index] - baseVal) * 100 / baseVal;
                } catch (error) {
                  // arr_val[b_index]]에 값이 없을때
                  arr_curRate[b_index] = 0;
                }
              }
            });
            maxRate = _.max(arr_curRate) < maxRate ? maxRate : _.max(arr_curRate);
            minRate = _.min(arr_curRate) > minRate ? minRate : _.min(arr_curRate);
          }
          sdata.dd = item.fmt_F12506;
          sdata.vv = [...arr_sdata];
          sdata.rate = [...arr_curRate];
          vm.sArr.push(sdata);
        });
        diffVal = (maxVal * 10000 - minVal * 10000) / 10000;
        stepVal = diffVal / 5;
        diffRate = maxRate - minRate;
        stepRate = diffRate / 6;
        if(!isNaN(minVal)) {
          // Y Axis 데이터 
          vm.yAxisVal[0] = minVal;
          for(var i = 1; i < 6; i++) {
            vm.yAxisVal[i] = minVal + stepVal * i;
            // console.log("yAxis : " + vm.yAxisVal[i]);
          }
          vm.yAxisVal[5] = maxVal;
          for(var i = 0; i < 6; i++) {
            vm.yAxisVal[i] = Number(vm.yAxisVal[i]).toFixed(2);
          }
          // X Axis 데이터
          var stepX = Math.floor(_dnum / 5);
          for(var i = 0; i < 5; i++) {
            vm.xAxisDd[i] = vm.sArr[stepX * i].dd;
            //          vm.xAxisTt[i] = vm.sArr[stepX*i].tt;
          }
        }
        c.clearRect(0, vm.crect.y1 - 6, vm.chart.width, vm.chart.height - vm.crect.y1 + 6);
        c.putImageData(vm.init_chart_image, vm.crect.x1 - 1, vm.crect.y1 - 2);
        // 시나리오 차트 그리기
        vm.arr_checked.forEach(function(check_array, idx) {
          if(check_array) {
            c.beginPath();
            var grd = c.createLinearGradient(vm.crect.x1, vm.crect.y1, vm.crect.x2, vm.crect.y1);
            grd.addColorStop(0, vm.lineColor1[idx]);
            grd.addColorStop(1, vm.lineColor2[idx]);
            c.lineWidth = 1.5;
            c.setLineDash([]);
            c.strokeStyle = grd;
            vm.chartDataPosArr = [];
            vm.chartDataHPosArr = [];
            vm.sArr.forEach(function(item, index) {
              // _dnum - 1 : 오른쪽 마지막 픽셀 표현
              if(!isNaN(item.vv[idx])) {
                _wpos = index / (_dnum - 1) * vm.wlen + vm.crect.x1;
                _hpos = vm.crect.y1 + (vm.hlen - ((item.vv[idx] - minVal) / diffVal * vm.hlen));
                vm.chartDataPosArr[index] = _wpos;
                vm.chartDataHPosArr[index] = _hpos;
                if(index == 0) {
                  c.moveTo(_wpos, _hpos);
                } else {
                  c.lineTo(_wpos, _hpos);
                }
              }
            });
            c.stroke();
          }
        });
        //Y-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "end";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        for(var i = 0; i < 6; i++) {
          // console.log("yAxis : " + vm.yAxisVal[i]);
          c.fillText(vm.yAxisVal[5 - i], 65, vm.crect.y1 + 50 * i);
        }
        //X-Axis 그리기
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "center";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        for(var i = 0; i < 5; i++) {
          // console.log("xAxis : " + vm.xAxisDd[i] + " " + vm.xAxisTt[i]);
          c.fillText(vm.xAxisDd[i], vm.crect.x1 + 35 + (vm.crect.x2 - vm.crect.x1) / 5 * i, vm.crect.y2 + 10);
        }
        this.draw_chart_image = c.getImageData(this.crect.x1, this.crect.y1 - 10, this.crect.x2, this.crect.y2);
      },
      // 마우스 이동시 툴팁 처리
      mouseMove: function(event) {
        if(Object.keys(this.draw_chart_image).length === 0) {} else {
          var c = this.ctx;
          // modal 이 아닌 경우
          // var _mwpos = event.pageX-this.mrect.left;
          // var _mhpos = event.pageY-this.mrect.top;
          // modal 인 경우
          var _mwpos = event.layerX;
          var _mhpos = event.layerY;
          c.putImageData(this.draw_chart_image, this.crect.x1, this.crect.y1 - 10);
          if(this.selectGuideCheck(_mwpos, _mhpos) !== -1) {
            // console.log("Got.......... guide");
            this.drawGuideLine(_mwpos);
            //            this.drawToolTip(_mwpos, _mhpos);
            if(this.dmode == 2) this.drawMToolTip(_mwpos, _mhpos);
            else this.drawToolTip(_mwpos, _mhpos);
          }
        }
      },
      // 마우스 OUT 툴팁 처리
      mouseLeave: function(event) {
        if(Object.keys(this.draw_chart_image).length === 0) {} else {
          var c = this.ctx;
          c.putImageData(this.draw_chart_image, this.crect.x1, this.crect.y1 - 10);
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
        c.fillRect(twpos + 10, hpos + 20, tt_wlen, tt_hlen - 10);
        // 툴팁 텍스트 그리기
        item = this.getDataByPos(wpos);
        c.fillStyle = "black";
        c.textAlign = "right";
        c.font = '11px san-serif';
        c.fillText(item.dd, twpos + tt_wlen, hpos + 31);
        c.fillText(util.formatNumber(item.vv[0]), twpos + tt_wlen, hpos + 43);
        // 포인트 원 그리기
        if((wpos - this.crect.x1) > 5) { // Y-Axis 침범 방지
          dhpos = this.getHPosByPos(wpos);
          c.beginPath();
          c.fillStyle = "#FFAB00";
          c.arc(wpos, dhpos, 5, 0, Math.PI * 2);
          c.fill();
          c.stroke();
        }
      },
      // Multi Chart Tool Tip
      drawMToolTip: function(wpos, hpos) {
        var c = this.ctx;
        var vm = this;
        var twpos = wpos;
        var tt_wlen = 170;
        var tt_hlen = 50;
        var item = {};
        var dhpos = 0;
        // 툴팁 박스 그리기
        if(wpos + tt_wlen >= this.crect.x2) twpos -= (tt_wlen + 20);
        c.fillStyle = "#FFFDE7";
        c.fillRect(twpos + 10, hpos + 20, tt_wlen, tt_hlen - 10 + (this.arr_checked.length * 12));
        // 툴팁 텍스트 그리기
        item = this.getDataByPos(wpos);
        c.fillStyle = "black";
        c.textAlign = "right";
        c.font = '11px Roboto, sans-serif, Noto-Sans';
        c.fillText(item.dd, twpos + tt_wlen, hpos + 31);
        var cal_hpos = hpos + 43;
        vm.arr_checked.forEach(function(check_array, idx) {
          if(check_array) {
            var circle = new Path2D();
            circle.arc(twpos + 20, cal_hpos, 5, 0, 2 * Math.PI);
            c.fillStyle = vm.lineColor1[idx];
            c.fill(circle);
            c.fillStyle = "black";
            c.textAlign = "right";
            c.font = '11px Roboto, sans-serif, Noto-Sans';
            if(vm.bm_header != "BM (N/A)" && vm.bm_header != "") {
              if(idx == 0) {
                c.fillText(vm.bm_header + ": " + util.formatNumber(item.vv[idx]), twpos + tt_wlen, cal_hpos);
              } else {
                c.fillText(vm.arr_result_header[idx - 1].scen_name.substr(0, 10) + "...: " + util.formatNumber(item.vv[idx]), twpos + tt_wlen, cal_hpos);
              }
            } else {
              c.fillText(vm.arr_result_header[idx].scen_name.substr(0, 10) + "...: " + util.formatNumber(item.vv[idx]), twpos + tt_wlen, cal_hpos);
            }
            cal_hpos += 12;
          }
        });
        // 포인트 원 그리기
        if((wpos - this.crect.x1) > 5) { // Y-Axis 침범 방지
          // ETP POINT
          dhpos = this.getHPosByPos(wpos);
          c.beginPath();
          c.fillStyle = "#85c406";
          c.arc(wpos, dhpos, 5, 0, Math.PI * 2);
          c.fill();
          c.stroke();
          // INDEX POINT
          dhpos = this.getHPosByPos1(wpos);
          c.beginPath();
          c.fillStyle = "#9e9e9e";
          c.arc(wpos, dhpos, 5, 0, Math.PI * 2);
          c.fill();
          c.stroke();
        }
      },
      getDataByPos: function(wpos) {
        var i = 0;
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
        var i = 0;
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
        var i = 0;
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
        var _mwpos = event.pageX - this.mrect.left;
        var _mhpos = event.pageY - this.mrect.top;
        var selectMode = 0;
        var selectTerm = 0;
        // console.log("pageX : " + event.pageX + " pageY : " +event.pageY);
        // console.log("clientX : " + event.clientX + " clientY : " +event.clientY);
        // console.log("layerX : " + event.layerX + " layerY : " +event.layerY);
        // console.log("left : " + this.mrect.left + " top : " + this.mrect.top);
        console.log("wpos : " + _mwpos + " hpos : " + _mhpos);
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
        var ix = [this.crect.x1, this.crect.x1 + iw, this.crect.x1 + iw * 2];
        var iy = 16;
        // console.log("selectModeCheck........");
        // console.log("wpos : " + wpos + " hpos : " + hpos);
        if(hpos >= iy && hpos <= (iy + ih)) {
          if(wpos >= ix[0] && wpos <= ix[1]) return 0;
          else if(wpos > ix[1] && wpos <= ix[2]) return 1;
          else if(wpos > ix[2] && wpos <= (ix[2] + iw)) return 2;
          else return -1;
        } else {
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
        for(var i = 0; i < (tnum + 1); i++) {
          ix[i] = this.crect.x2 - (iw * (tnum - i));
        }
        // console.log("hpos : " + hpos + " iy : " + iy + " ih : " + ih);
        if(hpos >= iy && hpos <= (iy + ih)) {
          for(var i = 0; i < tnum; i++) {
            // console.log("wpos : " + wpos + " ix[i] : " + ix[i] + " ix[i+1] : " + ix[i+1]);
            if(wpos >= ix[i] && wpos <= ix[i + 1]) break;
          }
          if(i == tnum) return -1
          else return i;
        } else {
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
        } else {
          return -1;
        }
      },
      drawMode: function(dmode) {
        // console.log("dmode : " + dmode + " this.dmode : " + this.dmode);
        var vm = this;
        var c = this.ctx;
        var tword = ["Index", "BM", "MULTI"];
        var iw = 60;
        var ih = 25;
        var ix = [this.crect.x1, this.crect.x1 + iw, this.crect.x1 + iw * 2];
        var iy = 16;
        var tx = [ix[0] + 20, ix[1] + 12, ix[2] + 12];
        var ty = 35;
        c.clearRect(ix[0], iy, iw * 3, ih);
        // 테두리
        c.beginPath();
        c.strokeStyle = "#cacaca";
        c.lineWidth = 0.7;
        c.moveTo(ix[0], iy);
        c.lineTo(ix[2] + iw, iy);
        c.lineTo(ix[2] + iw, iy + ih);
        c.lineTo(ix[0], iy + ih);
        c.lineTo(ix[0], iy);
        c.moveTo(ix[1], iy);
        c.lineTo(ix[1], iy + ih);
        c.moveTo(ix[2], iy);
        c.lineTo(ix[2], iy + ih);
        c.stroke();
        c.closePath();
        // Text
        c.fillStyle = "#37474F";
        c.font = '12px Roboto, sans-serif, Noto-Sans';
        c.textBaseline = "bottom";
        c.textAlign = "left";
        tword.forEach(function(item, index) {
          c.fillText(item, tx[index], ty);
        });
        // Active
        c.fillStyle = "#85c406";
        c.fillRect(ix[dmode], iy, iw, ih);
        c.fillStyle = "#FFFFFF";
        c.fillText(tword[dmode], tx[dmode], ty);
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
        for(var i = 0; i < tnum; i++) {
          ix[i] = this.crect.x2 - (iw * (tnum - i));
          tx[i] = ix[i] + 16;
        }
        tx[tnum - 1] -= 2;
        c.clearRect(ix[0], iy, iw * tnum, ih);
        // 테두리
        c.beginPath();
        c.strokeStyle = "#ffffff";
        c.lineWidth = 1;
        c.moveTo(ix[0], iy);
        c.lineTo(ix[tnum - 1] + iw, iy);
        c.lineTo(ix[tnum - 1] + iw, iy + ih);
        c.lineTo(ix[0], iy + ih);
        c.lineTo(ix[0], iy);
        for(var i = 1; i < tnum; i++) {
          c.moveTo(ix[i], iy);
          c.lineTo(ix[i], iy + ih);
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