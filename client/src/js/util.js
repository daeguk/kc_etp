

var util = {    
    formatNumber: function(num) {
        if (num != null) {
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
}  
  export default util