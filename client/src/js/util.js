
var util = {    
    /* 천단위 콤마 처리 */
    formatNumber: function(num) {
    
        if (num != null && typeof num !== 'undefined') {
            num = Number(num).toFixed(2);
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return '';
        }
    },
    formatStringNum: function(num) {
      if (num != null) {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }else {
        return '';
      }
    },
    pad: function(n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    },
    /* 콤마 제거 */
    NumtoStr: function(num) {
        if (num != null && typeof num !== 'undefined') {
            return Number(num.replace(/\,/g, ""));
        } else {
            return 0;
        }
    },
    getToFixNum: function(diffVal) {
      var toFixNum = 0;
      var tVal = diffVal * 10000;

      tVal = tVal.toFixed(0);

      if((tVal % 10000) == 0) {
        toFixNum = 0;
      }else if((tVal % 100) == 0) {
        toFixNum = 2;
      }else {
        toFixNum = 4;
      }
      return toFixNum;
    },

    processing: function(component, visible) {
        if (visible) {
            component.open();
        } else {
            component.close();
        }
    },

}  
  export default util