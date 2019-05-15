<template>
    <canvas :id=chartItem.seq :width=chartItem.width :height=chartItem.height>
    </canvas>
</template>

<script>
import Config       from "@/js/config.js"

export default {
    props:['chartItem'],
    data() {
        return {
            canvas:{},
            ctx:{},
            grad:{},
            maxVal: 0.0,
            minVal: 0.0,
            itemNum: 0,
            valHeight: 0.0,
        };
    },    
    created: function() {
    },
    mounted: function() {
        // console.log("AreaIndexTextChart..........");
        this.canvas = document.getElementById(this.chartItem.seq);
        this.ctx = this.canvas.getContext('2d');
        this.dataInit();
    },
    methods: {
        draw: function (){
            var c = this.ctx;
            var _width = this.chartItem.width - 44;
            var totcnt = this.chartItem.up + this.chartItem.down + this.chartItem.bohap;
            var uplen = (this.chartItem.up / totcnt) * _width;
            var downlen = (this.chartItem.down / totcnt) * _width;
            var bohaplen = (this.chartItem.bohap / totcnt) * _width;
            // 좌즉 상단 현재가
            c.fillStyle = "#37474F";
            c.font = 'bold 18px san-serif';
            c.fillText(this.chartItem.ctg_name, 15, 30);
            
            if(Number(this.chartItem.f15004) > 0) c.fillStyle = "#F57F17";
            else  c.fillStyle = "#40C4FF"
            c.font = 'bold 24px san-serif';
            c.fillText(this.chartItem.f15004+"%", 15, 55);
            c.fillStyle = "#37474F";
            c.font = '10px san-serif';
            c.fillText(this.chartItem.f16002, 100, 55);
            
            // 자산총액
            c.font = '11px san-serif';
            c.fillStyle = "#757575";
            c.fillRect(25, 70, 30, 14);
            c.fillStyle = "white";
            c.fillText("ETF", 30, 81);

            c.fillStyle = "#424242";
            c.fillRect(25, 90, 30, 14);
            c.fillStyle = "white";
            c.fillText("ETN", 30, 101);

            c.font = '12px san-serif';
            c.textAlign = "end";
            c.fillStyle = "#1B5E20";
            c.fillText(this.chartItem.etf_sum + " AUM", 200, 80);
            c.fillStyle = "#1B5E20";
            c.fillText(this.chartItem.etn_sum + " 원", 200, 100);

            // Bar Chart
            c.textAlign = "left";
            c.font = '11px san-serif';
            c.fillStyle = "#F57F17";
            c.fillText("상승 " + this.chartItem.up, 20, 140);
            c.fillRect(20, 115, uplen, 4);
            c.fillStyle = "#37474F";
            c.fillText("보합 " + this.chartItem.bohap, 160, 140);
            c.fillRect(20+uplen+2, 115, bohaplen, 4);
            c.fillStyle = "#40C4FF";
            c.fillText("하락 " + this.chartItem.down, 290, 140);
            c.fillRect(20+uplen+bohaplen+4, 115, downlen, 4);
            // console.log("up : " + this.chartItem.up);
            // console.log("down : " + this.chartItem.down);
            // console.log("bohap : " + this.chartItem.bohap);
            // console.log("totcnt : " + totcnt);
            // console.log("uplen : " + uplen + " downlen : " + downlen + " bohaplen : " + bohaplen);
        },
        dataInit: function() {
            this.draw();
        },
    }
}    
</script>

<style scoped>
canvas {
    background-color: #fff;
}
</style>