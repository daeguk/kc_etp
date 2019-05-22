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
            c.font = 'bold 16px  Noto Sans,san-serif';
            c.fillText(this.chartItem.ctg_name, 15, 30);
            
            if(Number(this.chartItem.f15004) > 0) c.fillStyle = "#ff4366";
            else  c.fillStyle = "#1e99e8"
            c.font = 'bold 26px san-serif';
            c.fillText(this.chartItem.f15004+"%", 15, 58);
            c.fillStyle = "#37474F";
            c.font = '10px  Noto Sans,san-serif';
            c.fillText(this.chartItem.f16002, 110, 56);
            
            // 자산총액
            c.font = '11px  Noto Sans,san-serif';
            c.fillStyle = "#757575";
            c.fillRect(18, 70, 30, 14);
            c.fillStyle = "white";
            c.fillText("ETF", 24, 81);

            c.fillStyle = "#424242";
            c.fillRect(18, 90, 30, 14);
            c.fillStyle = "white";
            c.fillText("ETN", 24, 101);

            c.font = '16px  Noto Sans,san-serif';
            c.textAlign = "end";
            c.fillStyle = "#29a275";
            c.fillText(this.chartItem.etf_sum + " AUM", 213, 82);
            c.fillStyle = "#29a275";
            c.fillText(this.chartItem.etn_sum + " 원", 213, 102);

            // Bar Chart
            c.textAlign = "left";
            c.font = '12px  Noto Sans,san-serif';
            c.fillStyle = "#ff4366";
            c.fillText("상승 " + this.chartItem.up, 18, 136);
            c.fillRect(18, 117, uplen, 4);
            c.fillStyle = "#959EB1";
            c.fillText("보합 " + this.chartItem.bohap, 158, 136);
            c.fillRect(18+uplen+2, 117, bohaplen, 4);
            c.fillStyle = "#1e99e8";
            c.fillText("하락 " + this.chartItem.down, 288, 136);
            c.fillRect(18+uplen+bohaplen+4, 117, downlen, 4);
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