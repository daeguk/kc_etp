import excel from "xlsx";

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
            return "0"              
          } else {
            num = Number(num).toFixed(0);
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          
      } else {
          return "0" 
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
    formatTime: function(inTime) {
      return inTime.substring(0, 2) + ":" + inTime.substring(2,4) + ":" + inTime.substring(4,6);
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
            component.open(visible);
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
    getBef3Month: function() {
      var mdate = new Date();
      mdate.setMonth(mdate.getMonth()-3);
      var myear = mdate.getFullYear();
      var mmonth = mdate.getMonth() + 1;
      var mday = mdate.getDate();

      if(mmonth < 10) mmonth = "0" + mmonth;
      if(mday < 10) mday = "0" + mday;

      return myear + "" + mmonth + "" + mday;
    },
    getBef6Month: function() {
      var mdate = new Date();
      mdate.setMonth(mdate.getMonth()-6);
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

    getBef5Year: function() {
      var mdate = new Date();
      mdate.setFullYear(mdate.getFullYear()-5);
      var myear = mdate.getFullYear();
      var mmonth = mdate.getMonth() + 1;
      var mday = mdate.getDate();

      if(mmonth < 10) mmonth = "0" + mmonth;
      if(mday < 10) mday = "0" + mday;

      return myear + "" + mmonth + "" + mday;
    },

    getBef10Year: function() {
      var mdate = new Date();
      mdate.setFullYear(mdate.getFullYear()-10);
      var myear = mdate.getFullYear();
      var mmonth = mdate.getMonth() + 1;
      var mday = mdate.getDate();

      if(mmonth < 10) mmonth = "0" + mmonth;
      if(mday < 10) mday = "0" + mday;

      return myear + "" + mmonth + "" + mday;
    },
    getUpAndDownStyle: function(value) {
      var tmp = Number(value);
      var rtn = {};
      var upStyle = {color:'#FF5252'};
      var sqStyle = {color: '#959EB1'};
      var downStyle = {color: '#82B1FF'};

      if(tmp > 0) rtn = upStyle;
      else if(tmp < 0) rtn = downStyle;
      else rtn = sqStyle;

      return rtn;
    },

    /*
    *  엑셀을 다운로드 한다.
    *  2019-07-09  bkLove(촤병국)
    */
    fn_downExcel : function( excelInfo ) {
        var vm = this;

        if( !excelInfo || Object.keys(excelInfo).length == 0 ) {
            console.log( "엑셀 다운로드시 필요한 정보를 확인해 주세요." )
            return  false;
        }

        if( !excelInfo.arrHeaderNm || excelInfo.arrHeaderNm.length == 0 ) {
            console.log( "노출할 헤더 정보를 확인해 주세요." );
            return  false;            
        }

        if( !excelInfo.arrHeaderKey || excelInfo.arrHeaderKey.length == 0 ) {
            console.log( "노출할 헤더의 key 정보를 확인해 주세요." );
            return  false;
        }

        if( !excelInfo.sheetNm ) {
            console.log( "엑셀 seeht 명 정보를 확인해 주세요." );
            return  false;
        }

        if( !excelInfo.excelFileNm ) {
            console.log( "다운로드 파일명 정보를 확인해 주세요." );
            return  false;
        }

        if( !excelInfo.dataInfo ) {
            console.log( "엑셀 다운로드할 데이터 정보를 확인해 주세요." );
            return  false;
        }

        var options     =   {
                skipHeader          :   true
            ,   origin              :   "A2"
            ,   colStartIndex       :   0
            ,   rowStartIndex       :   1
            ,   colsInfo            :   {
                        hidden  :   false
                    ,   width   :   15
                }
            ,   rowsInfo        :   {
                        hidden  :   false
                    ,   hpt     :   20
                }
        };


        var dataWS = excel.utils.aoa_to_sheet( [ excelInfo.arrHeaderNm ] );
        options = Object.assign( options, excelInfo.options );


    /* 설정할 컬럼 정보 */

        /* 헤더 컬럼별 설정정보가 있는 경우 */
        if( excelInfo.arrColsInfo && excelInfo.arrColsInfo.length > 0 ) {
            dataWS['!cols'] = [];

            for (var i = options.colStartIndex ; i < excelInfo.arrHeaderKey.length ; i++) {
                var colsInfo    =   {};

                colsInfo    =   Object.assign( colsInfo, options.colsInfo );

                /* arrColsInfo 갯수와 arrHeaderKey 갯수가 다를수 있기에 arrColsInfo 의 인덱스가 arrHeaderKey 인덱스 안에 포함되는 경우 */
                if( i < excelInfo.arrColsInfo.length ) {
                    colsInfo    =   Object.assign( colsInfo, excelInfo.arrColsInfo[i] );
                }

                dataWS['!cols'][i] = colsInfo;
            }
        }
        /* 기본 컬럼 설정정보가 있는 경우 */
        else if( excelInfo.colsInfo && Object.keys( excelInfo.colsInfo ).length > 0 ) {
            dataWS['!cols'] = [];

            for (var i = options.colStartIndex ; i < excelInfo.arrHeaderKey.length ; i++) {
                var colsInfo    =   Object.assign( {}, options.colsInfo, excelInfo.colsInfo );
                dataWS['!cols'][i] = colsInfo;
            }
        }



    /* 설정할 레코드 정보 */

        /* 레코드별 설정정보가 있는 경우 */
        if( excelInfo.arrRowsInfo && excelInfo.arrRowsInfo.length > 0 ) {
            dataWS['!rows'] = [];

            for (var i = 0, row= options.rowStartIndex; i < excelInfo.dataInfo.length; i++, row++) {
                var rowsInfo    =   {};

                rowsInfo    =   Object.assign( rowsInfo, options.rowsInfo );

                /* arrRowsInfo 갯수와 dataInfo 갯수가 다를수 있기에 arrRowsInfo 의 인덱스가 dataInfo 인덱스 안에 포함되는 경우 */
                if( i < excelInfo.arrRowsInfo.length ) {
                    rowsInfo    =   Object.assign( rowsInfo, excelInfo.arrRowsInfo[i] );
                }

                dataWS['!rows'][row] = rowsInfo;
            }
        }
        /* 기본 레코드 설정정보가 있는 경우 */
        else if( excelInfo.rowsInfo && Object.keys( excelInfo.rowsInfo ).length > 0 ) {
            dataWS['!rows'] = [];

            for (var i = options.colStartIndex ; i < excelInfo.arrHeaderKey.length ; i++) {
                var rowsInfo    =   Object.assign( {}, options.rowsInfo, excelInfo.rowsInfo );
                dataWS['!rows'][i] = rowsInfo;
            }
        }

        excel.utils.sheet_add_json( dataWS, excelInfo.dataInfo, { header: excelInfo.arrHeaderKey , skipHeader : options.skipHeader, origin : options.origin });


        var wb = excel.utils.book_new();
        excel.utils.book_append_sheet(wb, dataWS, excelInfo.sheetNm );
        excel.writeFile( wb, excelInfo.excelFileNm + "_"+ vm.getToday() +  ".xlsx" );
    },

    /*
    *  axios 를 수행한다.
    *  2019-09-25  bkLove(촤병국)
    */
    axiosCall( p_param={ url : "", method: "", data : {}, headers : {}, paramKey : "", responseType : "" }, p_callback={}, p_error_callback={} ) {

        try{

            if( p_param ) {

                if( typeof p_param.url == "undefined" || !p_param.url ) {
                    p_param.url             =   "";
                }

                if( typeof p_param.method == "undefined" || !p_param.method ) {
                    p_param.method          =   "post";
                }

                if( typeof p_param.paramKey == "undefined" ) {
                    p_param.paramKey        =   "data";
                }

                if( typeof p_param.data == "undefined"     || !p_param.data ) {
                    p_param.data            =   {};
                }

                if( typeof p_param.headers == "undefined" || !p_param.headers ) {
                    p_param.headers         =   {};
                }

                if( typeof p_param.responseType == "undefined" || !p_param.responseType ) {
                    p_param.responseType    =   "";
                }                
            }


            var axiosParam              =   {};

            axiosParam.url              =   p_param.url;
            axiosParam.method           =   p_param.method;

            if( p_param.responseType != "" ) {
                axiosParam.responseType =   p_param.responseType;
            }

            switch( p_param.paramKey ) {

                case    ""          :
                        axiosParam.data         =   {};
                        axiosParam.data         =   p_param.data;
                        break;                

                case    "data"      :
                        axiosParam.data         =   {};
                        axiosParam.data.data    =   p_param.data;
                        break;

                case    "params"    :
                        axiosParam.params       =   p_param.data;
                        break;
            }

            /* headers 가 존재하는 경우 */
            if( Object.keys( p_param.headers ).length > 0 ) {
                axiosParam.headers      =   p_param.headers;
            }

            axios( axiosParam ).then( function(response) {

                /* 세션이 만료된 경우 */
                if(     response 
                    &&  response.data 
                    &&  response.data.success == -1
                ) {
                    if( p_error_callback && typeof p_error_callback == "function" ) {
                        var msg     =   ( response.data.message ? response.data.message : "처리 중 오류가 발생하였습니다." );
                        p_error_callback( msg );
                    }
                    return  false;
                }

                if( p_callback && typeof p_callback == "function" ) {
                    p_callback(response);
                }

            }).catch(error => {
                console.log( "[error] axiosCall", error );

                if( p_error_callback && typeof p_error_callback == "function" ) {
                    error = "서버로 부터 응답을 받지 못하였습니다.";
                    p_error_callback(error);
                }
            });
            
        }catch(ex) {
            console.log( "[error] axiosCall", ex );
        }
    },

}  
  export default util