<template>
  <canvas :id="chartId" :width="chart.width" :height="chart.height"></canvas>
</template>

<script>
  import Config from "@/js/config.js"
  import util from "@/js/util.js"
  export default {
    props: ['itemLists'],
    data() {
      return {
        canvas: {},
        ctx: {},
        chartId: "PerformColumnChart",
        chart: {
          width: 1000,
          height: 180
        },
        crect: {
          x1: 200,
          y1: 20,
          x2: 940,
          y2: 160
        },
        grad: {},
        mrect: {},
        dt: 0,
        cX: 0,
        cY: 0,
        rad: [120, 70, 60],
        hlen: 0,
        wpos: [],
        disCnt: 5,
        maxRate: 0,
        xGugan: [],
        color2: ['#85c406', '#1e99e8', '#434343', '#ff4366', '#fbb040'],
        init_chart_image: {},
      };
    },
    watch: {
      'itemLists': function() {
        // console.log("PerformColumnChart watch.........itemLists len : " + this.itemLists.length);
        // console.log(this.itemLists);
        if(this.itemLists.length > 0) {
          this.dataInit();
        }
      },
    },
    created: function() {},
    mounted: function() {
      // console.log("LineEtpMultiChart..........");
      this.canvas = document.getElementById(this.chartId);
      this.ctx = this.canvas.getContext('2d');
      // this.mrect = this.canvas.getBoundingClientRect();
      // this.dataInit();
      this.cY = (this.crect.y1 + this.crect.y2) / 2;
      this.hlen = this.cY - this.crect.y1;
      this.dt = (this.crect.y2 - this.crect.y1) / 4;
      let xdiff = (this.crect.x2 - this.crect.x1) / 8;
      for(let i = 0; i < 8; i++) {
        this.wpos[i] = (this.crect.x1 + 30) + xdiff * i;
      }
      this.drawInit();
    },
    methods: {
      dataInit: function() {
        var c = this.ctx;
        if(this.itemLists.length < 5) this.disCnt = this.itemLists.length;
        else this.disCnt = 5;
        let xwidth = 50 / this.disCnt;
        this.clearRect();
        c.putImageData(this.init_chart_image, this.crect.x1 - 1, this.crect.y1 - 2);
        this.maxRate = this.getMaxRate(this.disCnt, this.itemLists);
        this.xGugan = this.getXGugan();
        // Y Axis Text
        c.fillStyle = "#424242";
        c.textBaseline = "middle";
        c.textAlign = "end";
        c.font = '12px  Roboto, sans-serif, Noto-Sans';
        c.fillText(this.xGugan[0] + " %", this.crect.x1 - 10, this.crect.y1);
        c.fillText(this.xGugan[1] + " %", this.crect.x1 - 10, this.crect.y1 + this.dt);
        c.fillText(this.xGugan[2] + " %", this.crect.x1 - 10, this.cY);
        c.fillText(this.xGugan[3] + " %", this.crect.x1 - 10, this.crect.y2 - this.dt);
        c.fillText(this.xGugan[4] + " %", this.crect.x1 - 10, this.crect.y2);
        for(let i = 0; i < this.disCnt; i++) {
          let hpos = [];
          for(let j = 0; j < 8; j++) {
            hpos[j] = 0;
          }
          if(this.itemLists[i].F15004 !== ' - ') hpos[0] = this.getHpos(this.itemLists[i].F15004);
          if(this.itemLists[i].weekRate !== ' - ') hpos[1] = this.getHpos(this.itemLists[i].weekRate);
          if(this.itemLists[i].monthRate !== ' - ') hpos[2] = this.getHpos(this.itemLists[i].monthRate);
          if(this.itemLists[i].ytdRate !== ' - ') hpos[3] = this.getHpos(this.itemLists[i].ytdRate);
          if(this.itemLists[i].yearRate !== ' - ') hpos[4] = this.getHpos(this.itemLists[i].yearRate);
          if(this.itemLists[i].year3Rate !== ' - ') hpos[5] = this.getHpos(this.itemLists[i].year3Rate);
          if(this.itemLists[i].year5Rate !== ' - ') hpos[6] = this.getHpos(this.itemLists[i].year5Rate);
          if(this.itemLists[i].year10Rate !== ' - ') hpos[7] = this.getHpos(this.itemLists[i].year10Rate);
          c.fillStyle = this.color2[i];
          for(let j = 0; j < 8; j++) {
            c.fillRect(this.wpos[j] + xwidth * i, this.cY, xwidth, hpos[j]);
          }
        }
      },
      getHpos: function(rate) {
        return this.hlen * Number(rate) / this.maxRate * (-1);
      },
      getMaxRate: function(cnt, itemLists) {
        let rtn = 0;
        for(let i = 0; i < cnt; i++) {
          if(Math.abs(Number(itemLists[i].F15004)) > rtn) rtn = Math.abs(Number(itemLists[i].F15004));
          if(Math.abs(Number(itemLists[i].weekRate)) > rtn) rtn = Math.abs(Number(itemLists[i].weekRate));
          if(Math.abs(Number(itemLists[i].monthRate)) > rtn) rtn = Math.abs(Number(itemLists[i].monthRate));
          if(Math.abs(Number(itemLists[i].ytdRate)) > rtn) rtn = Math.abs(Number(itemLists[i].ytdRate));
          if(Math.abs(Number(itemLists[i].yearRate)) > rtn) rtn = Math.abs(Number(itemLists[i].yearRate));
          if(Math.abs(Number(itemLists[i].year3Rate)) > rtn) rtn = Math.abs(Number(itemLists[i].year3Rate));
          if(Math.abs(Number(itemLists[i].year5Rate)) > rtn) rtn = Math.abs(Number(itemLists[i].year5Rate));
          if(Math.abs(Number(itemLists[i].year10Rate)) > rtn) rtn = Math.abs(Number(itemLists[i].year10Rate));
        }
        // console.log("getMaxRate............ : " + rtn);
        return rtn;
      },
      getXGugan: function() {
        let tmp = [];
        this.maxRate = Math.ceil(this.maxRate / 10) * 10;
        tmp[0] = this.maxRate;
        tmp[1] = this.maxRate / 2;
        tmp[2] = 0;
        tmp[3] = this.maxRate / 2 * (-1);
        tmp[4] = this.maxRate * (-1);
        // console.log(tmp);
        return tmp;
      },
      drawInit: function() {
        let c = this.ctx;
        // c.strokeRect(0, 0, this.chart.width, this.chart.height);
        c.beginPath();
        c.strokeStyle = "#37474F";
        c.lineWidth = 1;
        c.moveTo(this.crect.x1, this.cY);
        c.lineTo(this.crect.x2, this.cY);
        c.stroke();
        c.closePath();
        c.beginPath();
        c.strokeStyle = "#BDBDBD";
        c.lineWidth = 1;
        c.setLineDash([2]);
        c.moveTo(this.crect.x1, this.crect.y1 + 0.5);
        c.lineTo(this.crect.x2, this.crect.y1 + 0.5);
        c.moveTo(this.crect.x1, this.crect.y1 + this.dt + 0.5);
        c.lineTo(this.crect.x2, this.crect.y1 + this.dt + 0.5);
        c.moveTo(this.crect.x1, this.crect.y2 + 0.5);
        c.lineTo(this.crect.x2, this.crect.y2 + 0.5);
        c.moveTo(this.crect.x1, this.crect.y2 - this.dt + 0.5);
        c.lineTo(this.crect.x2, this.crect.y2 - this.dt + 0.5);
        c.stroke();
        c.closePath();
        // 차트 골격 저장
        this.init_chart_image = c.getImageData(this.crect.x1 - 1, this.crect.y1 - 2, this.crect.x2 + 1, this.crect.y2);
      },
      clearRect: function() {
        var c = this.ctx;
        c.clearRect(0, 0, this.chart.width, this.chart.height);
      },
    }
  }
</script>
<style scoped>
  canvas {
    background-color: #fff;
  }
</style>