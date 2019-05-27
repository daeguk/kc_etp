

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
    }
}  
  export default util