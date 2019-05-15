

var util = {    
    formatNumber: function(num) {
        if (num != null) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return '';
        }
    },
  }
  
  export default util