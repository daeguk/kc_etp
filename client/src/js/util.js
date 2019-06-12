
var util = {    
    /* 천단위 콤마 처리 */
    formatNumber: function(num) {
        if (num != null && typeof num !== 'undefined') {
            if (isNaN(num)) {
              return "0.00"              
            } else {
              num = Number(num).toFixed(2);
              return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            
        } else {
            return "0.00" 
        }
    },
    /* 천단위 콤마 처리 */
    formatInt: function(num) {
      if (num != null && typeof num !== 'undefined') {
          if (isNaN(num)) {
            return "0.00"              
          } else {
            num = Number(num).toFixed(0);
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          
      } else {
          return "0.00" 
      }
    },
    /* 천단위 콤마 처리 */
    formatDigit: function(num, digit) {
      if (num != null && typeof num !== 'undefined') {
          if (isNaN(num)) {
            return "0.00000"              
          } else {
            return Number(num).toFixed(digit);
          }
          
      } else {
          return "0.00" 
      }
    },
    formatStringNum: function(num) {
      if (num != null) {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }else {
        return '';
      }
    },
    formatDate: function(inDate) {
      return inDate.substring(0, 4) + "." + inDate.substring(4,6) + "." + inDate.substring(6,8);
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
    getPlus: function(val, fixNum) {
      var tmp = Number(val).toFixed(fixNum);
      var rtn = "";

      if(tmp > 0) rtn = "+" + tmp;
      else rtn = "" + tmp;

      return rtn;

    },
    getDiffRate: function(curr, base) {
      var diffRate = "";
      if(base == null || base == "" || base == undefined) {
        diffRate = " - ";
      }else {
        let tmp = 0.0;
        tmp = (curr - base) * 100 / base;
        diffRate = tmp.toFixed(2);
      }

      return diffRate;
    },
    getDiffRate1: function(curr, base) {
      var diffRate = "";
      if(base == null || base == "" || base == undefined) {
        diffRate = " - ";
      }else {
        let tmp = 0.0;
        tmp = (curr - base) * 100 / base;
        tmp = tmp.toFixed(2);
        if(tmp > 0) diffRate = "+" + tmp;
        else diffRate = "" + tmp;
      }

      return diffRate;
    },
    processing: function(component, visible) {
        if (visible) {
            component.open();
        } else {
            component.close();
        }
    },
    strSubString: function(str, len) {
      var rtn = str ;
      if(str.length > len) {
        rtn = str.substring(0, len) + "...";
      }
      return rtn ;
    },

    getToday: function() {
      var d = new Date();
      var myear = d.getFullYear();
      var mmonth = d.getMonth() + 1;
      var mday = d.getDate();

      if(mmonth < 10) mmonth = "0" + mmonth;
      if(mday < 10) mday = "0" + mday;

      return myear + "" + mmonth + "" + mday;
    },
    getBef1Week: function() {
      var d = new Date();
      var tdate = d.getTime() - (7 * 24 * 60 * 60 * 1000);
      var mdate = new Date();
      mdate.setTime(tdate);
      var myear = mdate.getFullYear();
      var mmonth = mdate.getMonth() + 1;
      var mday = mdate.getDate();

      if(mmonth < 10) mmonth = "0" + mmonth;
      if(mday < 10) mday = "0" + mday;

      return myear + "" + mmonth + "" + mday;
    },
    getBef1Month: function() {
      var mdate = new Date();
      mdate.setMonth(mdate.getMonth()-1);
      var myear = mdate.getFullYear();
      var mmonth = mdate.getMonth() + 1;
      var mday = mdate.getDate();

      if(mmonth < 10) mmonth = "0" + mmonth;
      if(mday < 10) mday = "0" + mday;

      return myear + "" + mmonth + "" + mday;
    },
    getBefYtd: function() {
      var mdate = new Date();
      var myear = mdate.getFullYear();

      return myear + "0101";
    },

    getBef1Year: function() {
      var mdate = new Date();
      mdate.setFullYear(mdate.getFullYear()-1);
      var myear = mdate.getFullYear();
      var mmonth = mdate.getMonth() + 1;
      var mday = mdate.getDate();

      if(mmonth < 10) mmonth = "0" + mmonth;
      if(mday < 10) mday = "0" + mday;

      return myear + "" + mmonth + "" + mday;
    },

    getBef3Year: function() {
      var mdate = new Date();
      mdate.setFullYear(mdate.getFullYear()-3);
      var myear = mdate.getFullYear();
      var mmonth = mdate.getMonth() + 1;
      var mday = mdate.getDate();

      if(mmonth < 10) mmonth = "0" + mmonth;
      if(mday < 10) mday = "0" + mday;

      return myear + "" + mmonth + "" + mday;
    },

}  
  export default util