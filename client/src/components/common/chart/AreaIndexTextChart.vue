<template>
    <canvas :id=chartItem.chartId :width=chartItem.width :height=chartItem.height>
    </canvas>
</template>

<script>
import Config       from "@/js/config.js"

export default {
    props:['chartItem', 'dataSet', 'textItem'],
    data() {
        return {
            canvas:{},
            ctx:{},
            grad:{},
            dataArr: [],
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
        this.canvas = document.getElementById(this.chartItem.chartId);
        this.ctx = this.canvas.getContext('2d');
        this.grad = this.ctx.createLinearGradient(0,0,0,this.canvas.height);
        this.grad.addColorStop(0, this.textItem.sColor);
        // this.grad.addColorStop(1, "#fff");
        this.grad.addColorStop(1,  this.textItem.eColor);
        this.dataInit();
    },
    methods: {
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
            c.lineWidth = 2;
            c.strokeStyle = this.chartItem.chartColor;

            var vm = this;
            this.dataArr.forEach(function(item, index){
                _wpos = vm.chartItem.marginW + index * _width / (vm.itemNum-1);
                _hpos = vm.chartItem.marginH + (_height - ((item[1] - vm.minVal)/ vm.valHeight * _height));

                if(index == 0) {
                    c.moveTo(_wpos, _hpos);
                }else {
                    c.lineTo(_wpos, _hpos);
                    c.stroke();
                }
            });

            // fill 을 위한 cloasePath 만들기
            _wpos = vm.chartItem.marginW + _width;
            _hpos = vm.chartItem.marginH * 2 + _height;
            c.lineTo(_wpos, _hpos);
            c.lineTo(vm.chartItem.marginW, _hpos);
            c.closePath();
            c.fillStyle = this.grad;
            c.fill();

            c.fillStyle = "#37474F";
            c.font = '16px san-serif';
            c.fillText(this.textItem.name, 15, 30);
            c.fillStyle = "#263238";
            c.font = '24px san-serif';
            c.fillText(this.textItem.f15001, 15, 55);
            c.fillStyle = "#039BE5";
            c.font = '12px san-serif';
            c.fillText(this.textItem.f15472, 110, 45);
            c.fillStyle = "#039BE5";
            c.font = '12px san-serif';
            c.fillText(this.textItem.f15004 + "%", 110, 60);

            c.fillStyle = "#757575";
            c.fillRect(165, 100, 30, 14);
            c.fillStyle = "white";
            c.font = '11px san-serif';
            c.fillText("ETF", 170, 111);

            c.fillStyle = "#424242";
            c.fillRect(165, 120, 30, 14);
            c.fillStyle = "white";
            c.font = '11px san-serif';
            c.fillText("ETN", 170, 131);

            c.fillStyle = "#1B5E20";
            c.font = '12px san-serif';
            c.textAlign = "end";
            c.fillText(this.textItem.etf_sum + " AUM", 335, 110);
            c.fillStyle = "#1B5E20";
            c.font = '12px san-serif';
            c.textAlign = "end";
            c.fillText(this.textItem.etn_sum + " 원", 335, 130);
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
                }else if(vm.minVal > item[1]) {
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