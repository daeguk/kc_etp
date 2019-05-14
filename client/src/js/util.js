var util = {
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatStringNum: function(num) {
      return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
}
  
  export default util